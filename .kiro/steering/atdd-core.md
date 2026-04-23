---
inclusion: always
---

# Spec-Driven ATDD — Core Rules

Spec-first ATDD. Language-agnostic, platform-agnostic. Golden rule: **never write production
code unless a failing acceptance test requires it**.

## First Action of Any Feature Work (Profile Bootstrap)

Before writing a spec, tests, code, or running quality gates — including ad-hoc requests like
"fix this bug" — check whether `docs/project-profile.md` exists.

- **Missing**: first action is to create it by running Phase 0 (see `docs/atdd/workflow.md`
  § Phase 0 and `docs/atdd/project-detection.md`). Tell the user: _"No project profile found —
  running Phase 0 first so I have an accurate picture of this codebase's tooling and
  conventions."_
- **Exists**: read it first; treat as authoritative.
- **Never** detect on the fly without persisting the profile.

## The Cycle

```
Analyze → Spec → Tests (Red) → Implementation (Green) → Quality Gates → Refactor → Spec & Doc Sync → PR
```

**Full procedure**: `docs/atdd/workflow.md` (read on demand).

## Non-Negotiable Rules

- Red before green; never modify tests to pass; never add logic not demanded by a failing test
- Update spec first when requirements change, then tests, then code
- Phase 0 reads existing docs (README, CONTRIBUTING, ARCHITECTURE, ADRs) before drawing
  conclusions — docs override inference; domain terms in docs must be used verbatim in specs
- Phase 0 produces `docs/project-profile.md` covering both tooling **and** conventions — not
  just tools
- Phase 1 requires explicit user approval of the spec before Phase 2 runs
- Phase 3 re-reads `docs/project-profile.md` and mirrors its conventions — no inventing
- Phase 4 runs all available quality gates before any phase is declared complete
- Phase 6 (Spec & Doc Sync) is a **blocking** gate; repair drift in-phase, including
  `README.md` and `docs/project-profile.md`

## Where Specs Live

```
specs/
├── features/       # Gherkin .feature files
└── technical/      # Markdown technical specs
```

## Reference

- `docs/atdd/workflow.md` — full cycle procedure
- `docs/atdd/project-detection.md` — Phase 0 detection
- `docs/atdd/quality-gates.md` — gate definitions
