---
description: Fully autonomous ATDD cycle — runs from requirements through spec approval, test generation, implementation, quality gates, PR creation, and review comment resolution without stopping. The ONLY human gate is spec approval.
argument-hint: "<feature or user story to implement>"
---

Run the **fully autonomous** ATDD cycle for:

$ARGUMENTS

You run the **complete** cycle — requirements → spec approval → implementation → PR → review
resolution — with **one human gate**: spec approval. After spec approval, no further
interruptions.

> **Choosing between commands:**
>
> - `/atdd-cycle` — supervised mode: asks before PR, pauses at key decisions
> - `/full-autonomous-cycle` — autonomous mode: spec approval only, then hands-off

**Authoritative procedure for Phases 0–6: `docs/atdd/workflow.md`.** Read it before executing
a phase. This command covers **orchestration only** — including the additional autonomous
PR / review handling in Phases 7–8.

Track progress through each phase with the todo/task list.

## Hard Constraints

- Never write production code before tests are red for the right reason
- Never modify tests to make them pass; never add logic not demanded by a failing test
- Never proceed past Phase 1 without explicit user approval of the spec
- Never write Phase 3 production code without re-reading `docs/project-profile.md` and
  stating which conventions you will follow
- Never open a PR while spec, README, or profile drift exists — Phase 6 is blocking
- Always detect stack AND conventions before generating code; always read existing project
  docs (README, CONTRIBUTING, ARCHITECTURE, ADRs) — they override inference
- Always run the full test suite after each implementation unit and after every refactor change

### The Test-First Rule (non-negotiable)

The **first files you create after spec approval must be test files**. No DTOs, entities,
interfaces, services, or repositories before a test file exists. If a missing type prevents
compilation, add the minimum empty shell (no fields, no logic) needed — nothing more.

## Cycle

```
Analyze → Spec → [HUMAN GATE] → Tests (Red) → Implement (Green) →
Quality Gates → Refactor → Spec & Doc Sync → PR → Review → Address Comments
```

## Phases 0–6

Follow `docs/atdd/workflow.md` § Phases 0–6 in full. Key orchestration reminders:

- **Phase 0**: check for `docs/project-profile.md` first; if missing, run the full Phase 0
  procedure (including reading existing project docs before sampling code), actually persist
  the profile to disk, verify by re-read, and print:

  > ✓ Wrote `docs/project-profile.md` (Tooling: N rows, Conventions: N rows, Reference
  > Files: N entries). Future sessions will read this instead of re-detecting.

  If the write fails, stop and tell the user.

- **Phase 1**: invoke the **spec-writer** subagent. The spec approval step is the **only**
  human gate. Iterate the spec until approved.
- **Phase 2**: test file first. Run the test command (not just build). Print test output.
  Report `"X scenarios, all red ✓"`.
- **Phase 3**: required output — re-read the profile, open a reference file from the same
  layer, state the conventions you will follow. Mirror them; do not invent.
- **Phase 4**: all available gates pass. Max 3 fix attempts per gate; re-run all after each.
- **Phase 5**: refactor only with tests green; re-run all gates after.
- **Phase 6 (blocking)**: invoke the **spec-reviewer** subagent for the compliance review,
  then repair drift → sync docs (README, `docs/project-profile.md`, other project docs) →
  final verification. Do not open a PR until every row in the Spec & Doc Sync report is ✅
  or an explicit ⏭️ with reason.

## Phase 7 — Create PR (Automatic)

Do NOT ask the user — proceed automatically.

1. Determine Git state: current branch, default branch (`main`/`master`), remote.
2. Create feature branch (if not already on one): `git checkout -b feat/<feature-name>`.
3. Stage and commit:

   ```
   feat: <short description>

   Implements specs/features/<name>.feature

   - N scenarios (smoke, happy-path, edge-case, error)
   - All acceptance tests passing
   - Quality gates: lint ✅ format ✅ typecheck ✅ build ✅ tests ✅
   ```

4. Push: `git push -u origin feat/<feature-name>`.
5. Create the PR with the `gh` CLI (or the GitHub MCP server if available):

   ```bash
   gh pr create --title "feat: <feature description>" \
     --body "<spec content + quality gate summary>" --base main
   ```

   If the project uses an AI reviewer (e.g., Copilot), request it:
   `gh pr edit <number> --add-reviewer Copilot`.

6. Record the PR number and URL for Phase 8.

## Phase 8 — Review + Address Comments (Automatic)

1. **Wait for the automated review** (if one was requested) — poll every 60 seconds, up to
   5 minutes: `gh pr view <number> --json reviews,comments`.

2. **If a review arrives within the timeout**, address all comments:
   - **Style/naming** → fix in implementation
   - **Bug fix** → verify with test → fix implementation
   - **Behavior change** → update spec first → update test → implement → green
   - **Question** → respond via `gh pr comment`

   After all changes: run all quality gates, commit
   `fix: address review feedback`, push to the same branch.

3. **If no review within 5 minutes**, do not block. Report:

   > "PR created at `<URL>`. The review has been requested but has not yet completed.
   > When the review is ready, run `/address-review-comments <PR-number>`."

## Completion Summary

End every run with this table:

| Phase           | Artifact                         | Status                         |
| --------------- | -------------------------------- | ------------------------------ |
| Analysis        | Project profile                  | ✅ `<language>`, `<framework>` |
| Spec            | `specs/features/<name>.feature`  | ✅ N scenarios                 |
| Spec            | `specs/technical/<name>-spec.md` | ✅ Created                     |
| Tests           | `<test-file-path>`               | ✅ Red → Green (N/N)           |
| Implementation  | `<src-file-path(s)>`             | ✅ Implemented                 |
| Quality Gates   | lint/format/typecheck/build/test | ✅ All passed                  |
| Spec & Doc Sync | Spec / README / Profile          | ✅ In sync (drift repaired)    |
| PR              | `feat/<name>` #N                 | ✅ Created                     |
| Review          | Comments addressed               | ✅ Done / ⏳ Awaiting review   |
