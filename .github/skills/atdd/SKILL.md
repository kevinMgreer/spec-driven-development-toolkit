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
Analyze → Spec → Tests (Red) → Implementation (Green) → Quality Gates → Refactor → Spec & Doc Sync → PR
```

## Quick Commands

| Command                    | Purpose                                                                         |
| -------------------------- | ------------------------------------------------------------------------------- |
| `/analyze-project`         | Detect language, frameworks, tools, AND code conventions; write project profile |
| `/write-spec`              | Generate Gherkin + technical spec from requirements                             |
| `/write-acceptance-tests`  | Generate failing test stubs from a spec file                                    |
| `/implement-from-spec`     | Implement code to make failing tests pass (re-reads project profile first)      |
| `/run-quality-gates`       | Run lint, format, typecheck, build, test — iterate until green                  |
| `/refactor-passing-tests`  | Safe refactor after all tests are green                                         |
| `/verify-spec-coverage`    | Hard spec & doc sync gate — repairs spec/README/profile drift in-place          |
| `/create-pull-request`     | Create branch, commit, push, open PR                                            |
| `/address-review-comments` | Handle PR review feedback, update spec if needed                                |
| `@atdd-cycle`              | Full automated cycle (analyze → spec → tests → implement → gates → sync → PR)   |
| `@spec-writer`             | Dedicated spec writing agent                                                    |
| `@spec-reviewer`           | Dedicated spec & doc compliance review agent                                    |

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
5. **Mirror the codebase** — Phase 3 re-reads `docs/project-profile.md` and follows the
   conventions already in use
6. **Sync or stop** — Phase 6 (Spec & Doc Sync) is a hard gate; the cycle is not done while
   the spec, README, or project profile drift from what the code does

## Profile Bootstrap (First Action)

If `docs/project-profile.md` does not exist, your first action is `/analyze-project` — even
for ad-hoc requests. Tell the user: _"No project profile found — running Phase 0 first so I
have an accurate picture of this codebase's tooling and conventions."_

## Cycle — Pointer

```
Analyze → Spec → Tests (Red) → Implement (Green) → Quality Gates → Refactor → Spec & Doc Sync → PR
```

**Full procedure: [`docs/atdd/workflow.md`](../../../docs/atdd/workflow.md)** (authoritative).

Per-phase prompt mapping:

| Phase | Trigger                                    | Key output / gate                                                      |
| ----- | ------------------------------------------ | ---------------------------------------------------------------------- |
| 0     | `/analyze-project`                         | `docs/project-profile.md` with Tooling, Conventions, Sources consulted |
| 1     | `/write-spec` / `@spec-writer`             | `specs/features/*.feature` + `specs/technical/*-spec.md` — USER GATE   |
| 2     | `/write-acceptance-tests`                  | All scenarios have failing stubs; "all red ✓" reported                 |
| 3     | `/implement-from-spec`                     | Minimum code, mirror profile, `@smoke` first                           |
| 4     | `/run-quality-gates`                       | lint / format / typecheck / build / test all pass                      |
| 5     | `/refactor-passing-tests`                  | Structure only, tests stay green                                       |
| 6     | `/verify-spec-coverage` / `@spec-reviewer` | No spec/README/profile drift (hard gate)                               |
| 7     | `/create-pull-request`                     | Branch, commit, push, PR                                               |

## Spec Directory Layout

```
specs/
├── features/          # Gherkin .feature files
│   └── *.feature
└── technical/         # Markdown technical specs
    └── *-spec.md
```
