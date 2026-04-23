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
  6. Spec & Doc Sync (hard gate — repair drift in-place)
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
| Never declare done with spec, README, or profile drift      | Phase 6 is a hard gate — fix drift in-phase, do not defer       |
| Always re-read `docs/project-profile.md` before Phase 3     | New code must mirror existing architecture, not invent new ones |

---

## Phase 0 — Analyze the Project

**Input**: a new or existing repository
**Output**: `docs/project-profile.md` containing **both** tooling and conventions, plus a list
of reference files the agent will mirror in Phase 3.

This phase is intentionally heavyweight. The most common failure mode of AI-assisted ATDD is
code that passes the tests but does not look like the surrounding codebase. The fix is a deep
project profile that the agent must re-read before writing implementation in Phase 3.

### Step A — Tooling Detection

Detect the project's stack:

1. **Language and package manager** — `package.json`, `pyproject.toml`, `*.csproj`, `go.mod`, etc.
2. **Test framework** — Jest, Vitest, pytest, NUnit, RSpec, Go testing, etc.
3. **Linter** — ESLint, Ruff, RuboCop, golangci-lint, Clippy, etc.
4. **Formatter** — Prettier, Black, rustfmt, gofmt, etc.
5. **Type checker** — TypeScript, mypy, pyright, etc.
6. **Build system** — npm build, dotnet build, go build, cargo build, etc.
7. **CI/CD** — GitHub Actions, GitLab CI, Jenkins, etc.

### Step B — Existing Documentation Scan (mandatory if any docs exist)

Read the project's own documentation before sampling code. Docs carry architectural rationale,
domain vocabulary, and explicit conventions that code samples alone do not reveal. Check, and
when present read:

- `README.md` (and variants) — setup/run/test commands, domain vocabulary, project purpose
- `CONTRIBUTING.md` — commit conventions, branch naming, PR process, local dev steps
- `ARCHITECTURE.md` / `docs/architecture.md` — architecture style, module boundaries
- `docs/adr/` or `docs/decisions/` — accepted architectural decisions (**authoritative**)
- `docs/` (other top-level docs) — dev setup, glossary, runbooks, style guides
- `.github/PULL_REQUEST_TEMPLATE.md` — PR hygiene
- `STYLE.md` / `STYLEGUIDE.md` / `CODING_STANDARDS.md` — explicit conventions
- `SECURITY.md` — constraints the agent must respect

Precedence when documentation and code disagree:

- README commands **override** inferred commands.
- ADRs and `ARCHITECTURE.md` **override** architecture style inferred from samples.
- `CONTRIBUTING.md` **overrides** commit/branch conventions inferred from git history.
- Domain terms in README/docs **must** be used in specs and tests.
- True conflicts go under `Known inconsistencies` in the profile — never silently pick one.

Record every doc you read under `Sources consulted` in the profile. If no docs exist, record
`none detected`.

### Step C — Conventions Discovery (mandatory for legacy projects)

Using hints from Step B to identify canonical examples, sample **2–4 representative source
files** (e.g., a controller/handler, a service, a repository, a test) and extract the patterns
the codebase actually uses. Skip only for empty greenfield projects.

For each of the following, record either the observed pattern or "none detected" — never guess:

- Architecture style (layered, hexagonal, MVC, vertical slice, modular monolith, etc.)
- Module layout (folder-by-feature vs folder-by-layer; co-located vs separated tests)
- Dependency wiring (constructor DI, container, factories, plain imports)
- Error handling (exceptions vs Result/Either; custom error types; boundary mapping)
- Validation (where and which library)
- Async patterns and cancellation conventions
- Logging library and conventions
- Configuration loading and secret management
- Naming (files, classes, functions, constants, tests)
- Public API style (REST/GraphQL/gRPC; URL casing; error format)
- Persistence (ORM, migrations, transactions)
- Comment and doc style
- Commit and branch conventions

Full reference: [Project Detection — Conventions Discovery](./project-detection.md#step-9--conventions-discovery-mandatory-for-legacy-projects).

### Step D — Write the Profile

Write all findings to **`docs/project-profile.md`** using the template (`Tooling`,
`Conventions`, `Reference Files`, `Sources consulted`, and optionally `Anti-patterns to avoid
in this repo` and `Known inconsistencies`) defined in
[Project Detection — Detection Output Format](./project-detection.md#detection-output-format).

If `docs/project-profile.md` already exists, **read it first** and treat it as authoritative.
Only update it if (a) the user asks, or (b) you discover the project has materially changed
since the profile was written (new architecture, new tools, new docs, etc.).

### Step E — Greenfield vs Legacy

For greenfield projects: prompt the user for tooling preferences (language, test framework,
package manager, linter, formatter) in a **single** prompt before writing any specs. Skip
conventions discovery (there are none yet) and add an empty `Conventions` section that will be
filled in as the project grows.

For legacy projects: conventions discovery is **non-negotiable**. The agent must not generate
implementation code without first recording the conventions it will follow. See
[Legacy Integration](./legacy-integration.md).

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

### Step 0 — Re-read the Project Profile (mandatory)

Before creating or editing any production file in Phase 3, **re-read `docs/project-profile.md`**
— specifically the `Conventions` and `Reference Files` sections. Then **open at least one
reference file from the same layer you are about to write** (e.g., if you are writing a service,
open the listed service example).

State explicitly which conventions you will follow before writing code, e.g.:

> Following profile: layered architecture, constructor DI, custom `AppError` for business
> failures, zod validation at controller boundary, JSDoc on public exports, kebab-case files.
> Mirroring `src/features/orders/orders.service.ts`.

If the profile is missing, stop and run Phase 0 first.

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
- **Mirror** the patterns recorded in the project profile — do not introduce a new architecture,
  error-handling style, validation library, or naming scheme without explicit user approval
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

## Phase 6 — Spec & Doc Sync (Hard Gate)

This is a **hard, blocking gate**. The cycle does not complete until every check below either
passes or has been **fixed in this phase** (not deferred). Spec drift is the most common silent
failure of AI-assisted development; the cure is to require the agent to repair drift before
declaring done, not to surface it as a "recommendation."

### Sub-phase 6a — Spec Compliance

Verify that the implementation actually satisfies the spec:

- Every scenario in the `.feature` file has a corresponding test
- Every numbered business rule in the technical spec is enforced (with a test that would catch
  a violation)
- No implementation behavior exists without a spec scenario
- The `.feature` file remains accurate documentation of current behavior — every `Then` step
  describes what the code actually does today

### Sub-phase 6b — Spec Drift Repair (mandatory if drift found)

Drift exists when, for example:

- The implementation supports inputs/outputs not described in any scenario
- A business rule was relaxed, tightened, or removed during implementation
- Validation messages, status codes, or error shapes differ from the spec
- A new edge case was handled but no `@edge-case` scenario describes it

For each drift item: **update the spec file first** (`.feature` and/or `-spec.md`), then add or
adjust a test that would catch a regression, then re-run the full test suite. Do not declare
Phase 6 complete with known drift.

### Sub-phase 6c — Documentation Sync

Verify the user-facing documentation reflects what the code now does. Update in this order:

1. **`README.md`** — if the feature is user-visible, confirm the README's feature list, usage
   examples, configuration table, or CLI flags are accurate. Update them in this phase if not.
2. **`docs/project-profile.md`** — if Phase 3 introduced new conventions, dependencies, or
   reference files, update the profile so future runs match.
3. **Any other docs the project maintains** that describe the changed behavior (only update what
   exists; do not create new doc files unless the user asks).

If a user-visible behavior change has no doc update, the gate has not passed.

### Sub-phase 6d — Final Verification

After every fix above:

- Re-run the full test suite — must be green
- Re-run all available quality gates — must pass
- Produce the compliance report (see [verify-spec-coverage prompt](../../.github/prompts/verify-spec-coverage.prompt.md))
  including the `Documentation Sync` section

Only when all four sub-phases pass does the cycle proceed to Phase 7.

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
7. Update `README.md` and any other user-facing docs that describe the changed behavior — this
   is part of the change, not a follow-up
8. Update `docs/project-profile.md` if the change introduced a new convention or dependency

**Never** update implementation to accommodate new behavior without first updating the spec and
confirming red tests. **Never** declare a behavior change "done" while the spec, README, or
project profile still describe the old behavior.

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
