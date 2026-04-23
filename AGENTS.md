# Spec-Driven ATDD Toolkit

This project uses **spec-first Acceptance Test-Driven Development (ATDD)**.

> **Golden Rule:** Never write production code unless a failing acceptance test requires it.

Language-agnostic, platform-agnostic. Works in any project — greenfield or legacy. Follows
the [AGENTS.md](https://agents.md/) standard and is read by Kiro, Copilot, Cursor, Claude, and
any AGENTS.md-aware tool.

---

## First Action of Any Feature Work (Profile Bootstrap)

Before writing a spec, tests, code, or running quality gates — including ad-hoc requests like
"fix this bug" — **check whether `docs/project-profile.md` exists**.

- **Missing**: your first action is to create it (run Phase 0 — see
  `docs/atdd/workflow.md` § Phase 0 and `docs/atdd/project-detection.md`). Tell the user:
  _"No project profile found — running Phase 0 first so I have an accurate picture of this
  codebase's tooling and conventions."_
- **Exists**: read it first; treat as authoritative.
- **Never** detect tools/conventions on the fly without persisting the profile to disk. Silent
  fallback is why conventions drift between sessions.

---

## The Cycle

```
Analyze → Spec → Tests (Red) → Implementation (Green) → Quality Gates → Refactor → Spec & Doc Sync → PR
```

Never skip or reorder. **Full procedure for every phase is in
[`docs/atdd/workflow.md`](docs/atdd/workflow.md)** — read that file before executing a phase
unless you have it in recent context.

---

## Hard Rules

- Never write production code before acceptance tests exist and fail (red for the right reason)
- Never modify tests to make them pass — fix the implementation
- Never add logic not demanded by a failing test
- Always update the spec first when requirements change, then tests, then code
- Always re-read `docs/project-profile.md` before Phase 3 and mirror its conventions
- Always read existing project docs (README, CONTRIBUTING, ARCHITECTURE, ADRs) during Phase 0
  — they override inference
- Never proceed past Phase 1 without explicit user approval of the spec
- Never declare done while spec, README, or `docs/project-profile.md` drift exists
  (Phase 6 is a blocking gate, not a recommendation)

---

## Spec Directory

```
specs/
├── features/       # Gherkin .feature files  — behavior, business-facing
└── technical/      # Markdown technical specs — rules, API contracts, constraints
```

Tag convention: `@smoke` (exactly 1) → `@happy-path` (1–2) → `@edge-case` (2–4) →
`@error` (2–3).

---

## Spec Change Protocol

Spec → tests → code → docs — in that order. Never update implementation to accommodate new
behavior without updating the spec first. `README.md` and `docs/project-profile.md` updates
are part of the change, not a follow-up. Full protocol in
[`docs/atdd/workflow.md`](docs/atdd/workflow.md) § Spec Change Protocol.

---

## Quick Command Reference

| Command                    | Purpose                                                        |
| -------------------------- | -------------------------------------------------------------- |
| `/analyze-project`         | Detect tooling + conventions; write `docs/project-profile.md`  |
| `/write-spec`              | Generate Gherkin + technical spec from requirements            |
| `/write-acceptance-tests`  | Generate failing test stubs from a spec                        |
| `/implement-from-spec`     | Implement code to make failing tests pass                      |
| `/run-quality-gates`       | Run lint, format, typecheck, build, test — iterate until green |
| `/refactor-passing-tests`  | Safe refactor with all tests green                             |
| `/verify-spec-coverage`    | Hard spec & doc sync gate — repairs spec/README/profile drift  |
| `/create-pull-request`     | Create branch, commit, push, open PR                           |
| `/address-review-comments` | Handle PR review feedback                                      |
| `@atdd-cycle`              | Full automated cycle from requirements → PR                    |
| `@spec-writer`             | Dedicated spec writing subagent                                |
| `@spec-reviewer`           | Read-only spec & doc compliance review                         |

---

## Reference Documentation

Canonical sources — read on demand, not upfront:

| File                                        | Contents                                    |
| ------------------------------------------- | ------------------------------------------- |
| `docs/atdd/workflow.md`                     | Full ATDD cycle procedure (authoritative)   |
| `docs/atdd/project-detection.md`            | Phase 0 — tooling and conventions detection |
| `docs/atdd/quality-gates.md`                | Quality gate definitions and execution      |
| `docs/atdd/legacy-integration.md`           | Integrating into existing projects          |
| `docs/atdd/spec-writing.md`                 | How to write clear, testable specifications |
| `docs/atdd/gherkin.md`                      | Gherkin syntax and anti-patterns            |
| `docs/atdd/checklist.md`                    | Per-feature progress checklist              |
| `docs/atdd/templates/feature.template.md`   | Gherkin feature file template               |
| `docs/atdd/templates/tech-spec.template.md` | Technical spec template                     |
