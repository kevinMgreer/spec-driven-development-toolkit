import { exec, ExecException } from "child_process";
import type { WorkspaceTool } from "./types";

/** Maximum number of characters to return from command stdout/stderr */
const MAX_OUTPUT_CHARS = 12_000;
/** Command timeout in milliseconds */
const COMMAND_TIMEOUT_MS = 120_000;

/**
 * Build the run_command workspace tool.
 * Commands run in the workspace root directory using the system shell.
 */
export function buildTerminalTool(workspaceRoot: string): WorkspaceTool {
  return {
    name: "run_command",
    description:
      "Run a shell command in the workspace root directory. " +
      "Returns an object with stdout, stderr, and exitCode. " +
      "Use this to run tests, lint, format, typecheck, build, and git commands. " +
      "Output is truncated to 12,000 characters. Timeout is 120 seconds.",
    schema: {
      type: "object",
      properties: {
        command: {
          type: "string",
          description:
            'The shell command to run. Examples: "npm test", "npx eslint .", "git status", "npx tsc --noEmit"',
        },
      },
      required: ["command"],
    },
    execute: (input: unknown): Promise<string> => {
      const { command } = input as { command: string };

      return new Promise((resolve) => {
        exec(
          command,
          {
            cwd: workspaceRoot,
            timeout: COMMAND_TIMEOUT_MS,
            // Pass the OS default shell name explicitly (string, not boolean)
            shell: process.platform === "win32" ? "cmd.exe" : "/bin/sh",
          },
          (error: ExecException | null, stdout: string, stderr: string) => {
            const result = {
              exitCode: error?.code ?? 0,
              stdout: truncate(stdout, MAX_OUTPUT_CHARS),
              stderr: truncate(stderr, MAX_OUTPUT_CHARS),
            };

            // Handle timeout specifically
            if (error?.killed) {
              result.stderr = `Command timed out after ${COMMAND_TIMEOUT_MS / 1000}s.\n${result.stderr}`;
              result.exitCode = 124;
            }

            resolve(JSON.stringify(result, null, 2));
          },
        );
      });
    },
  };
}

function truncate(text: string, maxChars: number): string {
  if (text.length <= maxChars) {
    return text;
  }
  return (
    text.slice(0, maxChars) +
    `\n... (truncated, ${text.length - maxChars} more chars)`
  );
}
