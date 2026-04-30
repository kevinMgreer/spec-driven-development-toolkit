import * as assert from "assert";
import { buildSystemPrompt } from "../../prompts/systemPrompts";

/**
 * Unit tests for the system prompt builder.
 * These tests verify that prompts contain the expected key content
 * and that the command intro injection works correctly.
 */
suite("SystemPrompts", () => {
  // -------------------------------------------------------- buildSystemPrompt
  suite("buildSystemPrompt", () => {
    test("returns a non-empty string for every participant", () => {
      const participants = [
        "atdd-cycle",
        "full-autonomous-cycle",
        "spec-writer",
        "spec-reviewer",
      ] as const;

      for (const p of participants) {
        const prompt = buildSystemPrompt(p);
        assert.ok(
          prompt.length > 100,
          `prompt for "${p}" is unexpectedly short`,
        );
      }
    });

    test("atdd-cycle prompt contains hard rules", () => {
      const prompt = buildSystemPrompt("atdd-cycle");
      assert.ok(
        prompt.includes("Never write production code"),
        "missing rule 1",
      );
      assert.ok(prompt.includes("Never modify test files"), "missing rule 2");
      assert.ok(
        prompt.includes("Never add logic not demanded"),
        "missing rule 3",
      );
      assert.ok(
        prompt.includes("EXPLICIT user approval"),
        "missing spec gate rule",
      );
    });

    test("atdd-cycle prompt documents all workspace tools", () => {
      const prompt = buildSystemPrompt("atdd-cycle");
      const expectedTools = [
        "read_file",
        "write_file",
        "file_exists",
        "list_directory",
        "find_files",
        "search_text",
        "run_command",
      ];
      for (const tool of expectedTools) {
        assert.ok(prompt.includes(tool), `prompt is missing tool "${tool}"`);
      }
    });

    test("atdd-cycle prompt covers all 7 phases", () => {
      const prompt = buildSystemPrompt("atdd-cycle");
      for (let phase = 0; phase <= 6; phase++) {
        assert.ok(
          prompt.includes(`Phase ${phase}`),
          `prompt is missing Phase ${phase}`,
        );
      }
    });

    test("spec-writer prompt contains spec approval gate language", () => {
      const prompt = buildSystemPrompt("spec-writer");
      assert.ok(
        prompt.includes("explicit"),
        "missing explicit approval language",
      );
      assert.ok(
        prompt.includes("Do NOT generate tests"),
        "spec-writer should not write tests",
      );
    });

    test("spec-reviewer prompt contains read-only constraint", () => {
      const prompt = buildSystemPrompt("spec-reviewer");
      assert.ok(
        prompt.includes("read-only"),
        "spec-reviewer must be read-only",
      );
      assert.ok(
        prompt.includes("do NOT modify"),
        "spec-reviewer must not modify files",
      );
    });

    test("full-autonomous-cycle prompt mentions PR creation", () => {
      const prompt = buildSystemPrompt("full-autonomous-cycle");
      assert.ok(
        prompt.includes("PR"),
        "full-autonomous-cycle should mention PR",
      );
      assert.ok(
        prompt.includes("autonomous"),
        "should mention autonomous behavior",
      );
    });

    test("command intro is prepended when a valid command is given", () => {
      const commands = [
        "analyze",
        "spec",
        "tests",
        "implement",
        "gates",
        "refactor",
        "verify",
        "pr",
        "review",
      ];
      for (const cmd of commands) {
        const withCmd = buildSystemPrompt("atdd-cycle", cmd);
        const withoutCmd = buildSystemPrompt("atdd-cycle");
        // With command should be longer (prepended intro) or at least different
        assert.notStrictEqual(
          withCmd,
          withoutCmd,
          `command "${cmd}" should change the prompt`,
        );
      }
    });

    test("unknown command does not crash — returns base prompt unchanged", () => {
      const withUnknown = buildSystemPrompt(
        "atdd-cycle",
        "nonexistent-command",
      );
      const withoutCmd = buildSystemPrompt("atdd-cycle");
      assert.strictEqual(
        withUnknown,
        withoutCmd,
        "unknown command should not modify prompt",
      );
    });

    test("all prompts contain the workspace root requirement", () => {
      const participants = [
        "atdd-cycle",
        "spec-writer",
        "spec-reviewer",
      ] as const;
      for (const p of participants) {
        const prompt = buildSystemPrompt(p);
        assert.ok(
          prompt.includes("docs/project-profile.md"),
          `"${p}" prompt must reference docs/project-profile.md`,
        );
      }
    });
  });
});
