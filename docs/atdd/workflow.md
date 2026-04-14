# ATDD Workflow — The Spec-Driven Development Cycle

This document is the **single source of truth** for the Spec-Driven ATDD cycle.
All platform configurations (VS Code, Cursor, Kiro, Claude) reference or embed this procedure.

The toolkit is **language-agnostic** and **platform-agnostic** — it works in any project regardless
of language, framework, or existing setup (greenfield or legacy).

---

## The Cycle

```
Requirements
     │
     ▼
  0. Analyze Project ──────────► Project profile (language, tools, conventions)
     │
     ▼
  1. Write Spec ──────────────► specs/features/<name>.feature
                                  specs/technical/<name>-spec.md
     │  (confirm spec is correct)
     ▼
  2. Generate Tests ───────────► tests/ (step stubs — all RED)
     │  (confirm red for right reason)
     ▼
  3. Implement ────────────────► src/ (minimum code, scenario by scenario)
     │  (run tests after each scenario)
     ▼
  4. Quality Gates ────────────► lint, format, typecheck, build, test
     │  (iterate until all pass)
     ▼
  5. Refactor (tests stay green, re-run all gates)
     │
     ▼
  6. Spec Review (compliance check)
     │
     ▼
  7. PR (optional — branch, commit, push, PR)
```

---

## Hard Rules — Never Break These

| Rule                                                        | Why                                                             |
| ----------------------------------------------------------- | --------------------------------------------------------------- |
| Never write production code before acceptance tests are red | Ensures the test actually validates something                   |
| Never modify tests to make them pass                        | Fixes the symptom not the cause; the spec becomes meaningless   |
| Never add logic not required by a failing test              | Speculation; increases maintenance burden with no specification |
| Always update spec first when requirements change           | Code must match spec, not the reverse                           |
| Always confirm tests are red _for the right reason_         | A test that passes due to a broken import is not actually red   |
| Never proceed past spec without explicit user approval      | The spec gate is the mandatory human checkpoint                 |

---

## Phase 0 — Analyze the Project

**Input**: a new or existing repository
**Output**: project profile documenting language, tools, and conventions

Before writing any code, detect the project's stack:

1. **Language and package manager** — `package.json`, `pyproject.toml`, `*.csproj`, `go.mod`, etc.
2. **Test framework** — Jest, Vitest, pytest, NUnit, RSpec, Go testing, etc.
3. **Linter** — ESLint, Ruff, RuboCop, golangci-lint, Clippy, etc.
4. **Formatter** — Prettier, Black, rustfmt, gofmt, etc.
5. **Type checker** — TypeScript, mypy, pyright, etc.
6. **Build system** — npm build, dotnet build, go build, cargo build, etc.
7. **CI/CD** — GitHub Actions, GitLab CI, Jenkins, etc.
8. **Conventions** — test directory, file naming, import style, code style

For greenfield projects: prompt the user for tooling preferences (language, test framework,
package manager, linter, formatter) before writing any specs. Present all questions in a single
prompt. See [Project Detection](./project-detection.md) for the full preference questionnaire.

For legacy projects: match all existing conventions. See [Legacy Integration](./legacy-integration.md).

Full detection procedure: [Project Detection](./project-detection.md).

---

## Phase 1 — Write the Spec

**Input**: requirements, user story, or feature description  
**Output**: `specs/features/<name>.feature` + `specs/technical/<name>-spec.md`

### What to Clarify Before Writing

If any of these are unclear, ask before writing (maximum 3 questions):

- **Actor** — who is performing this action? (user, admin, API client, background job)
- **Goal** — what are they trying to accomplish?
- **Success criteria** — what does "done" look like from the outside?
- **Error cases** — what inputs are invalid? what external failures can occur?

### What the Spec Contains

**Feature file** (`specs/features/<name>.feature`):

- `@smoke` (1) — single most critical happy path
- `@happy-path` (1–2) — primary success flows
- `@edge-case` (2–4) — boundary conditions, unusual-but-valid inputs
- `@error` (2–3) — invalid inputs, unauthorized access, system failures

**Technical spec** (`specs/technical/<name>-spec.md`):

- Overview and in-scope/out-of-scope
- Business rules (numbered, each with a concrete example)
- API contract (request/response shapes, status codes) if applicable
- Data constraints (types, required/optional, formats, limits)

**Confirm with the requester before proceeding.** Spec changes after tests exist are expensive.

### Spec Approval Gate (Mandatory)

This is the **mandatory human checkpoint** in the cycle. Everything after this point is autonomous.

1. Present the complete spec (feature file + technical spec) to the user
2. Ask explicitly: _"Do these specs look correct? Any changes before I proceed?"_
3. **Wait for explicit approval.** Do not proceed to Phase 2 until the user confirms.
4. If the user requests changes:
   a. Update the spec files
   b. Re-present the updated spec
   c. Ask for approval again
   d. Repeat until the user approves
5. Only after approval: proceed to Phase 2 (test generation) and the autonomous remainder

---

## Phase 2 — Generate Acceptance Tests (Red)

**Input**: `specs/features/<name>.feature`  
**Output**: test stubs in the project's test directory — every stub must fail

### Detect the Test Framework

| File found                                                     | Framework                              |
| -------------------------------------------------------------- | -------------------------------------- |
| `package.json` with `jest` / `vitest` / `@cucumber/cucumber`   | JS/TS — Jest, Vitest, Cucumber.js      |
| `pyproject.toml` / `requirements.txt` with `pytest` / `behave` | Python — pytest, behave                |
| `*.csproj`                                                     | .NET — NUnit, xUnit, SpecFlow          |
| `Gemfile` with `rspec` / `cucumber`                            | Ruby — RSpec, Cucumber                 |
| `go.mod`                                                       | Go — testing, godog                    |
| Existing test files                                            | Match directory and naming conventions |

### Stub Requirements

Every Gherkin scenario must have a corresponding test stub that:

1. Has a header: `// Spec: specs/features/<name>.feature` (adjust comment syntax per language)
2. Contains a step definition or test case for every Given / When / Then
3. Throws an explicit "not implemented" error (`throw new Error("not implemented")`, `pytest.fail("not implemented")`, etc.)
4. Does **not** silently pass or skip

### Confirm Red

Run the tests. Every stub must fail. If any fail for the wrong reason (import error, syntax, misconfiguration), fix the setup before implementing — do not treat broken setup as an acceptable "red."

---

## Phase 3 — Implement (Green)

**Input**: failing tests  
**Output**: production code that makes tests pass, scenario by scenario

### Order of Implementation

Work through scenarios in priority order:

| Priority | Tag           | Description                     |
| -------- | ------------- | ------------------------------- |
| 1st      | `@smoke`      | Critical path — must pass first |
| 2nd      | `@happy-path` | Primary success flows           |
| 3rd      | `@edge-case`  | Boundary and unusual inputs     |
| 4th      | `@error`      | Error handling and sad paths    |
| Skip     | `@wip`        | Not yet ready — leave failing   |

### Discipline

- Implement only the minimum code to pass the current failing test
- Run the full test suite after each implementation unit
- If a test you haven't implemented yet turns green, investigate — you may have implemented more than needed
- Do not add logging, caching, metrics, or "nice-to-have" features unless a test requires it

---

## Phase 4 — Quality Gates

**Input**: implementation code with all tests green
**Output**: all available quality gates passing

Run all available quality gates and iterate until they pass:

1. **Lint** — run the project's linter. Auto-fix where possible.
2. **Format** — check/fix code formatting. Auto-fix where possible.
3. **Type check** — run the type checker if available.
4. **Build** — compile/build the project.
5. **Test** — run the full test suite (acceptance + existing).

For each failing gate:

- Read the error output carefully
- Fix the issue (in production code, never in tests)
- Re-run the gate
- After fixing, re-run ALL gates to check for regressions
- Maximum 3 fix attempts per gate — escalate to user if still failing

Skip gates the project doesn't have (note as N/A). Tests are the only mandatory gate.

Full quality gate reference: [Quality Gates](./quality-gates.md).

---

## Phase 5 — Refactor

**Precondition**: all tests are green AND all quality gates pass
**Goal**: improve code structure without changing behavior

- Run tests after every change — if any turn red, revert
- Refactoring changes _structure_ (naming, duplication, organization), never _behavior_
- Do not add features during refactor; that requires a new spec
- Re-run all quality gates after refactoring is complete

---

## Phase 6 — Spec Review

Verify that the implementation actually satisfies the spec:

- Every scenario in the `.feature` file has a corresponding test
- Every named business rule in the technical spec is enforced (with a test that would catch a violation)
- No implementation behavior exists without a spec scenario
- The `.feature` file remains accurate documentation of current behavior

---

## Phase 7 — PR (Optional)

If the user wants a pull request:

1. Create a feature branch: `feat/<feature-name>`
2. Commit with a meaningful message referencing the spec
3. Push and create a PR with the spec as the description
4. Include quality gate results and scenario summary in the PR body

Ask the user before pushing or creating the PR.

---

## Spec Change Protocol

When requirements change _after_ tests have been written:

1. Update `specs/features/<name>.feature` first
2. Update `specs/technical/<name>-spec.md` if rules/contracts changed
3. Update or add test stubs to match the new spec
4. Confirm new/changed tests are red
5. Update implementation to pass the new tests
6. Confirm all tests are green

**Never** update implementation to accommodate new behavior without first updating the spec and confirming red tests.

---

## Spec Directory Layout

```
specs/
├── features/           # Gherkin .feature files (behavior, business-facing)
│   └── *.feature
└── technical/          # Markdown technical specs (rules, API contracts, constraints)
    └── *-spec.md
```

---

## Related Documents

- [Quality gates](./quality-gates.md) — quality gate definitions and execution
- [Project detection](./project-detection.md) — language and framework detection for any project
- [Legacy integration](./legacy-integration.md) — integrating into existing projects
- [Spec writing guide](./spec-writing.md) — how to write clear, testable specifications
- [Gherkin conventions](./gherkin.md) — syntax, formatting, step writing, anti-patterns
- [ATDD checklist](./checklist.md) — per-feature tracking checklist
- [Feature file template](./templates/feature.template.md)
- [Technical spec template](./templates/tech-spec.template.md)
