# Spec-Driven ATDD Toolkit

This project uses **spec-first Acceptance Test-Driven Development (ATDD)**. The golden rule:

> Never write production code unless a failing acceptance test requires it.

This toolkit is **language-agnostic** and **platform-agnostic**. It works in any project — greenfield
or legacy — regardless of language, framework, or existing tooling.

This file follows the [AGENTS.md](https://agents.md/) standard and is read automatically by Kiro,
GitHub Copilot, Cursor, Claude, and any other AGENTS.md-aware AI tool.

---

## The Cycle

```
Analyze → Spec → Tests (Red) → Implementation (Green) → Quality Gates → Refactor → Review → PR
```

**Never skip or reorder these phases.**

---

## Phase Procedures

### Phase 0 — Analyze the Project

Before writing any code, detect the project's stack. Check for:

- Language and package manager (`package.json`, `pyproject.toml`, `*.csproj`, `go.mod`, etc.)
- Test framework (Jest, Vitest, pytest, NUnit, RSpec, Go testing, etc.)
- Linter (ESLint, Ruff, RuboCop, golangci-lint, etc.)
- Formatter (Prettier, Black, rustfmt, gofmt, etc.)
- Type checker (TypeScript, mypy, pyright, etc.)
- Build system (`npm run build`, `dotnet build`, `go build`, etc.)
- CI/CD pipeline (GitHub Actions, GitLab CI, etc.)
- Existing conventions (test directory, file naming, import style)

For greenfield projects, prompt the user for tooling preferences (language, test framework,
package manager, linter, formatter) in a single prompt before writing any specs.
For legacy projects, match all existing conventions. See `docs/atdd/project-detection.md`.

### Phase 1 — Write the Spec

Clarify, then write. If actor, goal, or acceptance criteria are unclear, ask **at most 3 questions**.
Then create, without further interruption:

- `specs/features/<name>.feature` — Gherkin scenarios covering all behaviors
- `specs/technical/<name>-spec.md` — Business rules, API contract, data constraints

**Confirm the spec with the requester before writing any tests.**
This is a **mandatory gate** — do not proceed to test generation until the user explicitly approves.
If the user requests changes, update the spec and re-present until approved.
Everything after spec approval is autonomous.

Required scenario coverage:

- `@smoke` (exactly 1) — the single most critical happy path
- `@happy-path` (1–2) — primary success flows
- `@edge-case` (2–4) — boundary conditions, unusual-but-valid inputs
- `@error` (2–3) — invalid inputs, unauthorized access, system failures

Templates:

- Feature file: `docs/atdd/templates/feature.template.md`
- Technical spec: `docs/atdd/templates/tech-spec.template.md`

### Phase 2 — Generate Tests (Red)

Detect the project's test framework:

| Indicator                                                   | Framework                 |
| ----------------------------------------------------------- | ------------------------- |
| `package.json` → `jest` / `vitest` / `@cucumber/cucumber`   | Jest, Vitest, Cucumber.js |
| `pyproject.toml` / `requirements.txt` → `pytest` / `behave` | pytest, behave            |
| `*.csproj`                                                  | NUnit, xUnit, SpecFlow    |
| `Gemfile` → `rspec` / `cucumber`                            | RSpec, Cucumber-Ruby      |
| `go.mod`                                                    | Go testing, godog         |

Create a stub test for **every** scenario step. Each stub must:

- Add this header (adjust comment syntax per language): `// Spec: specs/features/<name>.feature`
- Throw a clear "not implemented" error — silent skips are not acceptable

Run the tests. **Every stub must be red for the right reason.**
If any fail due to import errors, missing config, or broken setup — fix the environment before implementing.

### Phase 3 — Implement (Green)

Work scenario by scenario in priority order:

1. `@smoke` — implement and confirm green before moving on
2. `@happy-path`
3. `@edge-case`
4. `@error`

Rules:

- Implement only the minimum code to pass the current failing test
- Run the full test suite after each implementation unit
- Never modify test files during implementation

### Phase 4 — Quality Gates

Run all available quality gates and iterate until they pass:

1. **Lint** — run the project's linter. Auto-fix where possible.
2. **Format** — check/fix formatting. Auto-fix where possible.
3. **Type check** — run the type checker if available.
4. **Build** — compile/build the project.
5. **Test** — run the full test suite (acceptance + existing tests).

For each failure: read the error, fix the issue (never modify tests), re-run the gate, then
re-run all gates to check for regressions. Max 3 fix attempts per gate.

Skip gates the project doesn't have (note as N/A). Tests are the only mandatory gate.
See `docs/atdd/quality-gates.md`.

### Phase 5 — Refactor

Precondition: all tests are green.

- Run tests after every structural change
- Refactoring changes structure, never behavior
- Do not add features during refactor
- Re-run all quality gates after refactoring

### Phase 6 — Spec Review

Verify:

- Every scenario has a corresponding passing test
- Every business rule in the technical spec is enforced by a test that would fail if the rule were removed
- No production behavior exists without a spec scenario
- The `.feature` file still accurately documents current behavior

### Phase 7 — PR (Optional)

If the user wants a pull request:

1. Create a feature branch: `feat/<feature-name>`
2. Commit with a meaningful message referencing the spec
3. Push and create a PR with the spec as the description
4. Include quality gate results and scenario summary in the PR body

Ask the user before pushing or creating the PR.

### Phase 8 — Address Review Comments

When PR review feedback arrives:

1. Categorize comments: style fix, bug fix, behavior change, missing coverage, question
2. For behavior changes: update spec first → update tests → update implementation
3. For bug fixes: verify with a failing test → fix implementation
4. For style/naming: make changes → re-run quality gates
5. Commit and push fixup changes

---

## Spec Change Protocol

When requirements change after tests have been written:

1. Update `specs/features/<name>.feature`
2. Update `specs/technical/<name>-spec.md` if rules or contracts changed
3. Update or add test stubs — confirm they are red
4. Update implementation — confirm all tests are green

**Never** update implementation to accommodate new behavior without first updating the spec.

---

## Reference Documentation

All shared documentation lives in `docs/atdd/` and is platform-agnostic:

| File                                        | Contents                                              |
| ------------------------------------------- | ----------------------------------------------------- |
| `docs/atdd/workflow.md`                     | Full ATDD cycle procedure (this doc, long form)       |
| `docs/atdd/quality-gates.md`                | Quality gate definitions and execution                |
| `docs/atdd/project-detection.md`            | Language/framework detection for any project          |
| `docs/atdd/legacy-integration.md`           | Integrating into existing projects                    |
| `docs/atdd/spec-writing.md`                 | How to write clear, testable specifications           |
| `docs/atdd/gherkin.md`                      | Gherkin syntax, formatting, step rules, anti-patterns |
| `docs/atdd/checklist.md`                    | Per-feature tracking checklist                        |
| `docs/atdd/templates/feature.template.md`   | Gherkin feature file template                         |
| `docs/atdd/templates/tech-spec.template.md` | Technical spec template                               |
