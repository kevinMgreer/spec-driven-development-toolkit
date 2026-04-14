---
description: "Generate acceptance test stubs from a Gherkin feature file. Creates step definitions for every scenario that fail with 'not implemented' — ready for the green phase. Output will be red (failing tests)."
agent: agent
tools: [read, edit, search, execute]
argument-hint: "Path to .feature file (e.g. specs/features/user-login.feature) or feature name"
---

Generate acceptance test stubs for:

${input:specs/features/}

## Steps

1. Read the specified `.feature` file (or find the most recently modified in `specs/features/`)

2. **Read `docs/project-profile.md`** if it exists — use the test framework, test command,
   test directory, and test file pattern from there. If the file does not exist, detect the
   project's test framework by searching for:
   - `package.json` → Jest, Vitest, Mocha, Cucumber.js
   - `pyproject.toml` / `setup.py` → pytest, behave
   - `*.csproj` → NUnit, xUnit, SpecFlow
   - `Gemfile` → RSpec, Cucumber-Ruby
   - `go.mod` → Go testing, godog
   - Find existing test files to confirm conventions (directory, naming, imports)

3. Generate a test file with:
   - **Header comment**: `// Spec: specs/features/<name>.feature` (or language equivalent)
   - Step definitions for **every** Given/When/Then step in the feature file
   - Each stub must **fail** with a clear "not implemented" error — not be empty or skipped
   - Import and setup boilerplate matching project conventions

4. Place the test file in the correct location following project conventions

5. Run the tests and confirm they are **red** (failing for the right reason — not import/syntax
   errors)

6. Report: "X step definitions created, all failing ✓"

The stubs must fail because the implementation doesn't exist yet — not because of setup errors.
If there are setup errors, fix them before reporting.
