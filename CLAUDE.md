# Spec-Driven ATDD Toolkit

This project uses **spec-first Acceptance Test-Driven Development (ATDD)**. Every feature begins
with a specification. No production code is written before acceptance tests exist and are failing.

This toolkit is **language-agnostic** and **platform-agnostic** — it works in any project regardless
of language, framework, or existing setup (greenfield or legacy).

## Core Rule

> Never write production code unless a failing acceptance test requires it.

---

## The Cycle

```
Analyze → Spec → Tests (Red) → Implementation (Green) → Quality Gates → Refactor → Review
```

**Phase 0 — Analyze**: Detect the project's language, test framework, linter, formatter, build
system, and conventions. For greenfield projects, prompt the user for tooling preferences
(language, test framework, package manager, linter, formatter) in a single prompt before writing
specs. See `docs/atdd/project-detection.md`. For legacy projects, match all existing
conventions — see `docs/atdd/legacy-integration.md`.

**Phase 1 — Spec**: Write `specs/features/<name>.feature` and `specs/technical/<name>-spec.md`.
**Mandatory gate**: confirm with the requester and wait for explicit approval before proceeding.
If the user requests changes, update and re-present. Everything after approval is autonomous.

**Phase 2 — Tests (Red)**: Generate a stub test for every scenario step using the detected test
framework. Run the tests and confirm every stub fails with a "not implemented" error — not an
import or syntax error.

**Phase 3 — Implement (Green)**: Implement the minimum code to make failing tests pass, scenario
by scenario. Work in order: `@smoke` → `@happy-path` → `@edge-case` → `@error`.

**Phase 4 — Quality Gates**: Run all available gates (lint, format, typecheck, build, test) and
iterate until all pass. Max 3 fix attempts per gate. See `docs/atdd/quality-gates.md`.

**Phase 5 — Refactor**: Clean up structure with all tests green. Run tests after every change.
Re-run all quality gates after refactoring.

**Phase 6 — Review**: Verify every scenario has a test. Verify every business rule in the
technical spec is enforced.

---

## Hard Rules

| Rule                                              | Reason                                          |
| ------------------------------------------------- | ----------------------------------------------- |
| Never write production code before tests are red  | Ensures the test validates real behavior        |
| Never modify tests to make them pass              | Makes tests meaningless; fix the implementation |
| Never add logic not demanded by a failing test    | Speculation that increases maintenance cost     |
| Always update spec first when requirements change | Code must match spec, not the reverse           |
| Never proceed past spec without user approval     | The spec gate is the mandatory human checkpoint |

---

## Spec Directory

```
specs/
├── features/       # Gherkin .feature files  — behavior, business-facing
└── technical/      # Markdown technical specs — rules, API contracts, constraints
```

All feature files use this tag convention:

| Tag           | Meaning                                           |
| ------------- | ------------------------------------------------- |
| `@smoke`      | Single most critical path — exactly 1 per feature |
| `@happy-path` | Primary success flows                             |
| `@edge-case`  | Boundary conditions and unusual-but-valid inputs  |
| `@error`      | Invalid inputs, auth failures, system failures    |

---

## Templates & Reference Docs

All shared documentation (platform-agnostic) lives in `docs/atdd/`:

| Document                                    | Purpose                                       |
| ------------------------------------------- | --------------------------------------------- |
| `docs/atdd/workflow.md`                     | Full ATDD cycle procedure                     |
| `docs/atdd/quality-gates.md`                | Quality gate definitions and execution        |
| `docs/atdd/project-detection.md`            | Language/framework detection for any project  |
| `docs/atdd/legacy-integration.md`           | Integrating into existing projects            |
| `docs/atdd/spec-writing.md`                 | How to write clear, testable specifications   |
| `docs/atdd/gherkin.md`                      | Gherkin syntax, formatting, and anti-patterns |
| `docs/atdd/checklist.md`                    | Per-feature progress checklist                |
| `docs/atdd/templates/feature.template.md`   | Gherkin feature file template                 |
| `docs/atdd/templates/tech-spec.template.md` | Technical spec template                       |

---

## Answering "How do I implement this feature?"

Read `docs/atdd/workflow.md` for the full procedure, then:

1. Ask clarifying questions if actor, goal, or error cases are unclear (max 3 questions)
2. Write the spec — confirm before writing tests
3. Generate test stubs — confirm they are red
4. Implement scenario by scenario — confirm green after each
5. Refactor with tests green
6. Verify spec compliance

Do not skip or reorder phases.
