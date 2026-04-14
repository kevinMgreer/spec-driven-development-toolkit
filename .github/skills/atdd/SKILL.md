---
name: atdd
description: "Spec-Driven ATDD workflow skill. Use for running the full ATDD cycle, writing Gherkin feature files, creating technical specs, generating acceptance tests, or reviewing spec compliance. Trigger phrases: ATDD, BDD, Gherkin, spec-first, acceptance test, feature file, Given When Then, red-green-refactor, spec coverage, write scenarios."
argument-hint: "Describe the feature or ATDD task (e.g. 'write spec for user login')"
---

# ATDD — Acceptance Test-Driven Development

## When to Use

- Starting a new feature (write specs before any code)
- Converting requirements to Gherkin scenarios
- Generating acceptance test stubs from a spec
- Implementing code to pass failing tests
- Verifying spec compliance after implementation
- Running the full automated ATDD cycle end-to-end

## Workflow

```
Requirements → Spec → Tests (Red) → Implementation (Green) → Refactor → Review
```

## Quick Commands

| Command                    | Purpose                                                                         |
| -------------------------- | ------------------------------------------------------------------------------- |
| `/analyze-project`         | Detect language, frameworks, tools, and conventions                             |
| `/write-spec`              | Generate Gherkin + technical spec from requirements                             |
| `/write-acceptance-tests`  | Generate failing test stubs from a spec file                                    |
| `/implement-from-spec`     | Implement code to make failing tests pass                                       |
| `/run-quality-gates`       | Run lint, format, typecheck, build, test — iterate until green                  |
| `/verify-spec-coverage`    | Check implementation against spec                                               |
| `/refactor-passing-tests`  | Safe refactor after all tests are green                                         |
| `/create-pull-request`     | Create branch, commit, push, open PR                                            |
| `/address-review-comments` | Handle PR review feedback, update spec if needed                                |
| `@atdd-cycle`              | Full automated cycle (analyze → spec → tests → implement → gates → verify → PR) |
| `@spec-writer`             | Dedicated spec writing agent                                                    |
| `@spec-reviewer`           | Dedicated spec compliance review agent                                          |

## Templates & References

- [Gherkin feature template](./assets/feature.template.md)
- [Technical spec template](./assets/tech-spec.template.md)
- [ATDD cycle checklist](./assets/atdd-checklist.md)
- [Gherkin guide](./references/gherkin-guide.md)
- [ATDD patterns](./references/atdd-patterns.md)
- [Quality gates](./references/quality-gates.md)
- [Project detection](./references/project-detection.md)
- [Legacy integration](./references/legacy-integration.md)

## Core Principles

1. **Spec is the source of truth** — change spec first, then tests, then code
2. **Red before green** — never implement without a confirmed-failing test
3. **Minimum viable implementation** — only write code that a failing test demands
4. **Behavior, not implementation** — specs describe observable outcomes, not internal mechanics

## Full Cycle Procedure

### 0. Analyze Project

Use `/analyze-project` to detect the project's language, frameworks, and conventions.
Critical for first-time use in a new repository. See `docs/atdd/project-detection.md`.

For **greenfield projects**, prompt the user for tooling preferences (language, test framework,
package manager, linter, formatter) in a single prompt before writing any specs.

### 1. Write Spec

Use `/write-spec` or `@spec-writer` to create:

- `specs/features/<name>.feature` — Gherkin scenarios with full coverage
- `specs/technical/<name>-spec.md` — Business rules, API contract, data constraints

**Mandatory gate**: Present the spec to the user and wait for explicit approval before proceeding.
If the user requests changes, update and re-present. Everything after approval is autonomous.

### 2. Generate Tests (Red)

Use `/write-acceptance-tests` to create failing test stubs.
Run and confirm: all stubs are **red** for the right reason.

### 3. Implement (Green)

Use `/implement-from-spec` to implement scenario by scenario.
Work in order: `@smoke` → `@happy-path` → `@edge-case` → `@error`.
Run tests after each unit of work.

### 4. Quality Gates

Use `/run-quality-gates` to run lint, format, typecheck, build, and test. Iterate until all
gates pass. See `docs/atdd/quality-gates.md`.

### 5. Verify

Use `/verify-spec-coverage` or `@spec-reviewer` to confirm all scenarios are covered and all
business rules are enforced.

### 6. Refactor

Use `/refactor-passing-tests` to clean up with all tests green.
Run tests after every change. Re-run quality gates when done.

### 7. PR (Optional)

Use `/create-pull-request` to create a branch, commit, push, and open a PR.
Use `/address-review-comments` to handle review feedback.

## Spec Directory Layout

```
specs/
├── features/          # Gherkin .feature files
│   └── *.feature
└── technical/         # Markdown technical specs
    └── *-spec.md
```
