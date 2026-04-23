# Spec-Driven ATDD Toolkit

> **Golden Rule:** Never write production code unless a failing acceptance test requires it.

Language-agnostic, platform-agnostic ATDD toolkit. Works in any project — greenfield or legacy.

---

## First Action of Any Feature Work (Profile Bootstrap)

Before writing a spec, tests, code, or running quality gates — including ad-hoc requests —
**check whether `docs/project-profile.md` exists**.

- **Missing**: first action is to create it (run Phase 0 — see `docs/atdd/workflow.md` § Phase 0
  and `docs/atdd/project-detection.md`). Tell the user: _"No project profile found — running
  Phase 0 first so I have an accurate picture of this codebase's tooling and conventions."_
- **Exists**: read it first; treat as authoritative.
- **Never** detect tools/conventions on the fly without persisting the profile to disk.

---

## The Cycle

```
Analyze → Spec → Tests (Red) → Implementation (Green) → Quality Gates → Refactor → Spec & Doc Sync → PR
```

**Full procedure: [`docs/atdd/workflow.md`](docs/atdd/workflow.md)** (authoritative).
Hard rules, command reference, and reference docs: [`AGENTS.md`](AGENTS.md).

Non-negotiables, in brief:

- Red before green; never modify tests to pass; never add logic not demanded by a failing test
- Phase 1 requires explicit user approval of the spec before Phase 2 runs
- Phase 3 re-reads `docs/project-profile.md` and mirrors its conventions — no inventing
- Phase 6 (Spec & Doc Sync) is a **blocking** gate; repair drift in-phase

Do not skip or reorder phases.
