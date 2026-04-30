import * as fsSync from "fs";
import * as fs from "fs/promises";
import * as path from "path";
import { glob } from "glob";
import type { WorkspaceTool } from "./types";

/**
 * Build the set of workspace file-system tools for the ATDD agents.
 * All paths are workspace-relative; absolute paths are rejected.
 */
export function buildWorkspaceTools(workspaceRoot: string): WorkspaceTool[] {
  /**
   * Resolve and validate that a user-supplied path stays inside the workspace.
   * Returns the absolute path, or throws if the path escapes the root.
   */
  function safePath(relativePath: string): string {
    // Normalise and resolve relative to workspace root
    const resolved = path.resolve(workspaceRoot, relativePath);
    // Ensure the resolved path starts with the workspace root (prevent traversal)
    const normalRoot = path.normalize(workspaceRoot) + path.sep;
    const normalResolved = path.normalize(resolved);
    if (
      normalResolved !== path.normalize(workspaceRoot) &&
      !normalResolved.startsWith(normalRoot)
    ) {
      throw new Error(`Path "${relativePath}" escapes the workspace root.`);
    }
    return resolved;
  }

  return [
    // ------------------------------------------------------------------ read_file
    {
      name: "read_file",
      description:
        "Read the full text contents of a workspace file. Returns the file content as a string. " +
        "Use this to read source files, specs, config files, and documentation.",
      schema: {
        type: "object",
        properties: {
          path: {
            type: "string",
            description:
              'Workspace-relative path to the file, e.g. "src/index.ts" or "README.md"',
          },
        },
        required: ["path"],
      },
      execute: async (input: unknown): Promise<string> => {
        const { path: filePath } = input as { path: string };
        try {
          const abs = safePath(filePath);
          return await fs.readFile(abs, "utf-8");
        } catch (err) {
          return `Error reading "${filePath}": ${errMsg(err)}`;
        }
      },
    },

    // ----------------------------------------------------------------- write_file
    {
      name: "write_file",
      description:
        "Create or overwrite a file in the workspace. Parent directories are created automatically. " +
        "Use this to write spec files, test files, implementation files, and documentation.",
      schema: {
        type: "object",
        properties: {
          path: {
            type: "string",
            description:
              'Workspace-relative path to the file, e.g. "specs/features/login.feature"',
          },
          content: {
            type: "string",
            description: "Full text content to write to the file",
          },
        },
        required: ["path", "content"],
      },
      execute: async (input: unknown): Promise<string> => {
        const { path: filePath, content } = input as {
          path: string;
          content: string;
        };
        try {
          const abs = safePath(filePath);
          await fs.mkdir(path.dirname(abs), { recursive: true });
          await fs.writeFile(abs, content, "utf-8");
          return `✓ Written ${filePath} (${content.length} chars)`;
        } catch (err) {
          return `Error writing "${filePath}": ${errMsg(err)}`;
        }
      },
    },

    // ----------------------------------------------------------------- file_exists
    {
      name: "file_exists",
      description:
        'Check whether a file or directory exists in the workspace. Returns "true" or "false".',
      schema: {
        type: "object",
        properties: {
          path: {
            type: "string",
            description: "Workspace-relative path to check",
          },
        },
        required: ["path"],
      },
      execute: async (input: unknown): Promise<string> => {
        const { path: filePath } = input as { path: string };
        try {
          const abs = safePath(filePath);
          await fs.access(abs);
          return "true";
        } catch {
          return "false";
        }
      },
    },

    // ---------------------------------------------------------------- list_directory
    {
      name: "list_directory",
      description:
        'List the contents of a directory. Directories are suffixed with "/". ' +
        "Returns a JSON array of entry names.",
      schema: {
        type: "object",
        properties: {
          path: {
            type: "string",
            description:
              'Workspace-relative path to the directory. Use "." for the workspace root.',
          },
        },
        required: ["path"],
      },
      execute: async (input: unknown): Promise<string> => {
        const { path: dirPath } = input as { path: string };
        try {
          const abs = safePath(dirPath || ".");
          const entries = await fs.readdir(abs, { withFileTypes: true });
          const names = entries.map(
            (e: import("fs").Dirent) => e.name + (e.isDirectory() ? "/" : ""),
          );
          return JSON.stringify(names);
        } catch (err) {
          return `Error listing "${dirPath}": ${errMsg(err)}`;
        }
      },
    },

    // ------------------------------------------------------------------ find_files
    {
      name: "find_files",
      description:
        "Find workspace files matching a glob pattern. Returns a JSON array of matching workspace-relative paths. " +
        "node_modules and .git are always excluded.",
      schema: {
        type: "object",
        properties: {
          pattern: {
            type: "string",
            description:
              "Glob pattern relative to the workspace root. " +
              'Examples: "specs/**/*.feature", "src/**/*.ts", "docs/project-profile.md"',
          },
        },
        required: ["pattern"],
      },
      execute: async (input: unknown): Promise<string> => {
        const { pattern } = input as { pattern: string };
        try {
          const matches = await glob(pattern, {
            cwd: workspaceRoot,
            ignore: ["node_modules/**", ".git/**", "dist/**", "out/**"],
            nodir: false,
          });
          return JSON.stringify(matches.sort());
        } catch (err) {
          return `Error finding files with "${pattern}": ${errMsg(err)}`;
        }
      },
    },

    // ----------------------------------------------------------------- search_text
    {
      name: "search_text",
      description:
        "Search for a text string or simple pattern across workspace files. " +
        "Returns matching file paths with the matching lines and line numbers (max 50 results). " +
        'Use include to restrict to a glob pattern (e.g. "src/**/*.ts").',
      schema: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Text to search for (case-insensitive)",
          },
          include: {
            type: "string",
            description:
              "Glob pattern to restrict which files are searched (optional). " +
              'Examples: "**/*.ts", "specs/**", "src/**/*.py"',
          },
        },
        required: ["query"],
      },
      execute: async (input: unknown): Promise<string> => {
        const { query, include: includePattern } = input as {
          query: string;
          include?: string;
        };
        try {
          const pattern = includePattern ?? "**/*";
          const files = await glob(pattern, {
            cwd: workspaceRoot,
            ignore: ["node_modules/**", ".git/**", "dist/**", "out/**"],
            nodir: true,
          });

          const results: string[] = [];
          const queryLower = query.toLowerCase();

          for (const file of files) {
            if (results.length >= 50) {
              results.push("(results truncated — more matches exist)");
              break;
            }
            const abs = path.join(workspaceRoot, file);
            let content: string;
            try {
              content = await fs.readFile(abs, "utf-8");
            } catch {
              continue; // skip unreadable files (binaries, etc.)
            }
            const lines = content.split("\n");
            const matchingLines: string[] = [];
            for (let i = 0; i < lines.length; i++) {
              if (lines[i].toLowerCase().includes(queryLower)) {
                matchingLines.push(`  L${i + 1}: ${lines[i].trimEnd()}`);
              }
            }
            if (matchingLines.length > 0) {
              results.push(
                `${file}:\n${matchingLines.slice(0, 10).join("\n")}`,
              );
            }
          }

          return results.length > 0
            ? results.join("\n\n")
            : `No matches found for "${query}" in ${includePattern ?? "workspace"}.`;
        } catch (err) {
          return `Error searching for "${query}": ${errMsg(err)}`;
        }
      },
    },

    // ----------------------------------------------------------------- delete_file
    {
      name: "delete_file",
      description:
        "Delete a file from the workspace. Use sparingly — prefer overwriting with write_file.",
      schema: {
        type: "object",
        properties: {
          path: {
            type: "string",
            description: "Workspace-relative path to the file to delete",
          },
        },
        required: ["path"],
      },
      execute: async (input: unknown): Promise<string> => {
        const { path: filePath } = input as { path: string };
        try {
          const abs = safePath(filePath);
          // Only delete files, not directories
          const stat = await fs.stat(abs);
          if (stat.isDirectory()) {
            return `Error: "${filePath}" is a directory. Only files can be deleted with this tool.`;
          }
          await fs.unlink(abs);
          return `✓ Deleted ${filePath}`;
        } catch (err) {
          return `Error deleting "${filePath}": ${errMsg(err)}`;
        }
      },
    },
  ];
}

/** Returns true if the workspace file system is accessible (basic sanity check). */
export function workspaceRootExists(workspaceRoot: string): boolean {
  return fsSync.existsSync(workspaceRoot);
}

function errMsg(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}
