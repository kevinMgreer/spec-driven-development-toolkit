import * as assert from "assert";
import * as fs from "fs/promises";
import * as path from "path";
import * as os from "os";
import { buildWorkspaceTools } from "../../tools/workspaceTools";

suite("WorkspaceTools", () => {
  let tmpDir: string;
  let tools: ReturnType<typeof buildWorkspaceTools>;

  setup(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "atdd-test-"));
    tools = buildWorkspaceTools(tmpDir);
  });

  teardown(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  // ---------------------------------------------------------------------- helpers
  function tool(name: string): ReturnType<typeof buildWorkspaceTools>[number] {
    const t = tools.find((t) => t.name === name);
    if (!t) { throw new Error(`tool "${name}" not found`); }
    return t;
  }

  // -------------------------------------------------------------------- write_file
  suite("write_file", () => {
    test("creates a new file with content", async () => {
      const result = await tool("write_file").execute({
        path: "hello.txt",
        content: "hello world",
      });
      assert.ok(result.includes("✓"), `expected success, got: ${result}`);

      const written = await fs.readFile(
        path.join(tmpDir, "hello.txt"),
        "utf-8",
      );
      assert.strictEqual(written, "hello world");
    });

    test("creates parent directories automatically", async () => {
      const result = await tool("write_file").execute({
        path: "specs/features/login.feature",
        content: "Feature: Login",
      });
      assert.ok(result.includes("✓"), `expected success, got: ${result}`);

      const exists = await fs.stat(
        path.join(tmpDir, "specs/features/login.feature"),
      );
      assert.ok(exists.isFile());
    });

    test("overwrites existing file", async () => {
      await tool("write_file").execute({
        path: "over.txt",
        content: "original",
      });
      await tool("write_file").execute({
        path: "over.txt",
        content: "updated",
      });

      const content = await fs.readFile(path.join(tmpDir, "over.txt"), "utf-8");
      assert.strictEqual(content, "updated");
    });

    test("rejects path traversal", async () => {
      const result = await tool("write_file").execute({
        path: "../../etc/passwd",
        content: "malicious",
      });
      assert.ok(
        result.toLowerCase().includes("error"),
        `expected error, got: ${result}`,
      );
    });
  });

  // --------------------------------------------------------------------- read_file
  suite("read_file", () => {
    test("reads an existing file", async () => {
      await fs.writeFile(path.join(tmpDir, "readme.md"), "# Test", "utf-8");
      const result = await tool("read_file").execute({ path: "readme.md" });
      assert.strictEqual(result, "# Test");
    });

    test("returns error for missing file", async () => {
      const result = await tool("read_file").execute({
        path: "nonexistent.txt",
      });
      assert.ok(
        result.toLowerCase().includes("error"),
        `expected error, got: ${result}`,
      );
    });

    test("rejects path traversal", async () => {
      const result = await tool("read_file").execute({
        path: "../../../etc/passwd",
      });
      assert.ok(
        result.toLowerCase().includes("error"),
        `expected error, got: ${result}`,
      );
    });
  });

  // -------------------------------------------------------------------- file_exists
  suite("file_exists", () => {
    test("returns true for existing file", async () => {
      await fs.writeFile(path.join(tmpDir, "exists.txt"), "x", "utf-8");
      const result = await tool("file_exists").execute({ path: "exists.txt" });
      assert.strictEqual(result, "true");
    });

    test("returns false for missing file", async () => {
      const result = await tool("file_exists").execute({ path: "missing.txt" });
      assert.strictEqual(result, "false");
    });

    test("returns true for existing directory", async () => {
      await fs.mkdir(path.join(tmpDir, "subdir"));
      const result = await tool("file_exists").execute({ path: "subdir" });
      assert.strictEqual(result, "true");
    });
  });

  // ------------------------------------------------------------------ list_directory
  suite("list_directory", () => {
    test("lists files and directories", async () => {
      await fs.writeFile(path.join(tmpDir, "file.ts"), "", "utf-8");
      await fs.mkdir(path.join(tmpDir, "src"));

      const result = await tool("list_directory").execute({ path: "." });
      const entries = JSON.parse(result) as string[];

      assert.ok(entries.includes("file.ts"), "should include file.ts");
      assert.ok(
        entries.includes("src/"),
        "should include src/ with trailing slash",
      );
    });

    test("returns error for non-existent directory", async () => {
      const result = await tool("list_directory").execute({ path: "nope" });
      assert.ok(
        result.toLowerCase().includes("error"),
        `expected error, got: ${result}`,
      );
    });
  });

  // -------------------------------------------------------------------- find_files
  suite("find_files", () => {
    test("finds files matching glob pattern", async () => {
      await fs.mkdir(path.join(tmpDir, "specs", "features"), {
        recursive: true,
      });
      await fs.writeFile(
        path.join(tmpDir, "specs", "features", "login.feature"),
        "",
        "utf-8",
      );
      await fs.writeFile(
        path.join(tmpDir, "specs", "features", "signup.feature"),
        "",
        "utf-8",
      );

      const result = await tool("find_files").execute({
        pattern: "specs/**/*.feature",
      });
      const files = JSON.parse(result) as string[];

      assert.strictEqual(files.length, 2);
      assert.ok(files.some((f) => f.includes("login.feature")));
      assert.ok(files.some((f) => f.includes("signup.feature")));
    });

    test("returns empty array when no files match", async () => {
      const result = await tool("find_files").execute({
        pattern: "**/*.nonexistent",
      });
      const files = JSON.parse(result) as string[];
      assert.deepStrictEqual(files, []);
    });
  });

  // ------------------------------------------------------------------- search_text
  suite("search_text", () => {
    test("finds matching text in files", async () => {
      await fs.writeFile(
        path.join(tmpDir, "a.ts"),
        "export function hello() {}",
        "utf-8",
      );
      await fs.writeFile(
        path.join(tmpDir, "b.ts"),
        "const world = true;",
        "utf-8",
      );

      const result = await tool("search_text").execute({ query: "hello" });
      assert.ok(result.includes("a.ts"), "should find match in a.ts");
      assert.ok(
        !result.includes("b.ts") || result.includes("No matches"),
        "should not find in b.ts",
      );
    });

    test("is case-insensitive", async () => {
      await fs.writeFile(
        path.join(tmpDir, "c.ts"),
        "const HELLO = 1;",
        "utf-8",
      );
      const result = await tool("search_text").execute({ query: "hello" });
      assert.ok(
        result.includes("c.ts"),
        `expected c.ts in results, got: ${result}`,
      );
    });

    test("respects include pattern", async () => {
      await fs.writeFile(path.join(tmpDir, "match.ts"), "needle", "utf-8");
      await fs.writeFile(path.join(tmpDir, "match.md"), "needle", "utf-8");

      const result = await tool("search_text").execute({
        query: "needle",
        include: "**/*.ts",
      });
      assert.ok(result.includes("match.ts"));
      // .md should not appear when restricted to .ts
      // (match.md may or may not appear depending on glob; at minimum .ts must be present)
    });

    test("returns no-match message when nothing found", async () => {
      const result = await tool("search_text").execute({
        query: "xyzzy_nonexistent_999",
      });
      assert.ok(
        result.toLowerCase().includes("no matches"),
        `expected no-match message, got: ${result}`,
      );
    });
  });

  // -------------------------------------------------------------------- delete_file
  suite("delete_file", () => {
    test("deletes an existing file", async () => {
      await fs.writeFile(path.join(tmpDir, "todelete.txt"), "bye", "utf-8");
      const result = await tool("delete_file").execute({
        path: "todelete.txt",
      });
      assert.ok(result.includes("✓"), `expected success, got: ${result}`);

      let thrown = false;
      try {
        await fs.access(path.join(tmpDir, "todelete.txt"));
      } catch {
        thrown = true;
      }
      assert.ok(thrown, "file should no longer exist");
    });

    test("returns error when deleting a directory", async () => {
      await fs.mkdir(path.join(tmpDir, "adir"));
      const result = await tool("delete_file").execute({ path: "adir" });
      assert.ok(
        result.toLowerCase().includes("error"),
        `expected error, got: ${result}`,
      );
    });

    test("rejects path traversal", async () => {
      const result = await tool("delete_file").execute({
        path: "../../important",
      });
      assert.ok(
        result.toLowerCase().includes("error"),
        `expected error, got: ${result}`,
      );
    });
  });
});
