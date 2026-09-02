---
description: Run the complete ATDD cycle from requirements to a verified, spec-compliant, quality-gated implementation — through to PR and review resolution. Spec approval is the only mandatory stop; autonomy after that is chosen at the approval gate.
argument-hint: "<feature or user story to implement> [--auto]"
---

Run the complete ATDD cycle for:

$ARGUMENTS

**Authoritative procedure for every phase: `docs/atdd/workflow.md`.** Read that file before
executing a phase (or when you need the full step list). This command covers **orchestration
only** — subagent choices, gates, and reporting.

Track progress through each phase with the todo/task list.

## Autonomy Mode

This command runs at one of two autonomy levels. **Do not ask which one up front** — the user
has not seen anything yet, and an extra question before Phase 0 is an interruption for nothing.
The choice is made at the spec approval gate, which is the one stop that already exists (Phase 1).

| Mode                | After spec approval                                            |
| ------------------- | -------------------------------------------------------------- |
| **(a) Hands-off**   | Runs through PR creation and review resolution without stopping |
| **(b) Check first** | Stops once before opening the PR, then finishes                  |

If `--auto` appears anywhere in the arguments above, skip the mode question entirely and use
mode (a). Otherwise ask for it as part of spec approval — see Phase 1, step 5.

Whichever mode is chosen, **spec approval is the only mandatory human gate**. Mode (b) adds
exactly one more stop, immediately before the PR. Never introduce a third.

## Hard Constraints

- Never write production code before tests are red for the right reason
- Never modify tests to make them pass; never add logic not demanded by a failing test
- Never proceed past Phase 1 without explicit user approval of the spec
- Never write Phase 3 production code without re-reading `docs/project-profile.md` and
  stating which conventions you will follow
- Never declare done — or open a PR — while spec, README, profile, or any doc listed under
  `Sources consulted` in `docs/project-profile.md` has drift; Phase 6 is blocking
- Always detect stack AND conventions before generating code; always read existing project
  docs (README, CONTRIBUTING, ARCHITECTURE, ADRs) — they override inference
- Always prompt for tooling preferences in greenfield projects before writing specs
- Always run the full test suite after each implementation unit and after every refactor change

### The Test-First Rule (non-negotiable)

The **first files you create after spec approval must be test files**. No DTOs, entities,
interfaces, services, or repositories before a test file exists. If a missing type prevents
compilation, add the minimum empty shell (no fields, no logic) needed — nothing more. If the
test file is not the first Phase 2 artifact, you broke the rule.

## Cycle

```
Analyze → Spec → [HUMAN GATE] → Tests (Red) → Implement (Green) →
Quality Gates → Refactor → Spec & Doc Sync → PR → Review → Address Comments
```

## Phase 0 — Project Analysis

**Start here — do not browse files speculatively.**

1. Check for `docs/project-profile.md`. If it exists, read it and treat as authoritative —
   skip detection unless the user asked to re-analyze.
2. If missing: follow `docs/atdd/workflow.md` § Phase 0 and `docs/atdd/project-detection.md`
   in full — this includes reading existing project docs (README, CONTRIBUTING, ARCHITECTURE,
   ADRs, etc.) **before** sampling code.
3. Write the profile to `docs/project-profile.md`. Actually persist the file — do not keep it
   in reasoning. Re-read to verify, then print verbatim:

   > ✓ Wrote `docs/project-profile.md` (Tooling: N rows, Conventions: N rows, Reference
   > Files: N entries). Future sessions will read this instead of re-detecting.

   If the write fails, stop the cycle and tell the user.

4. Greenfield vs. legacy:
   - **Greenfield**: prompt for tooling preferences in a single prompt (required: language,
     test framework, package manager; optional: linter, formatter, structure, CI/CD). Record
     choices in the profile. Do not set up configs yet.
   - **Legacy**: conventions discovery is mandatory. Match all existing conventions exactly.

## Phase 1 — Spec

1. Check `specs/changes/` for an in-flight change covering this work; if found, read it and skip
   to step 4.
2. **Identify the target capability.** List `specs/capabilities/` and pick the domain this change
   modifies, then read its `behavior.feature` and `rules.md` in full. If none fits, this change
   creates a capability — note that; every delta scenario will be `@added`.
3. Parse requirements. Ask at most 3 questions if actor, acceptance criteria, or critical
   error/edge cases are unclear. Then invoke the **spec-writer** subagent with the full context.
   It produces the change folder `specs/changes/<name>/` — `proposal.md`, `delta.feature`,
   `delta-rules.md`, and `tasks.md`.
4. Show the user the delta, grouped by operation (added / modified / removed / renamed) so the
   shape of the change reads at a glance.
5. **MANDATORY GATE — ask for approval and autonomy level together**, in one message. If
   `--auto` was passed, ask only the approval half and proceed in mode (a).

   > Do these specs look correct? Any adjustments before I generate tests?
   >
   > And after approval, should I:
   > **[a]** run hands-off through implementation, quality gates, PR and review, or
   > **[b]** check with you once before opening the PR?

6. **Wait for explicit approval.** Iterate on the spec until approved. If the user approves the
   spec without answering the mode question, default to **(b)** — the more cautious reading of
   an ambiguous answer — and say which mode you are using before continuing.
7. Record the chosen mode. Everything from here runs uninterrupted until the mode's stopping
   point (mode (a): none; mode (b): before the PR).

## Phase 2 — Acceptance Tests (Red)

**Order: test file first, everything else second.** See `docs/atdd/workflow.md` § Phase 2.

1. Write the test file first, using the profile's framework and conventions. One test per
   scenario. Each body throws a "not implemented" error. Header:
   `// Spec: specs/capabilities/<domain>/behavior.feature`.
2. Add minimum empty shells only if needed for compilation (no fields, no logic).
3. Run the **test command** (not the build command). Every test must fail for the right
   reason (not compile/import errors).
4. **Quality gate**: print the test runner output. Report: _"X scenarios, all red ✓"_.

## Phase 3 — Implementation (Green)

**Step 0 — Convention sync (mandatory before any production file is created or edited):**

a. Re-read `docs/project-profile.md` — `Conventions`, `Reference Files`, `Anti-patterns`.
b. Open at least one reference file from the same layer you are about to write.
c. **State explicitly which conventions you will follow.** This statement is required output.
d. If `docs/project-profile.md` is missing, stop and run Phase 0 first.

Then implement in priority order: `@smoke` → `@happy-path` → `@edge-case` → `@error`. Minimum
code per scenario, mirror the profile, run the full test suite after each scenario, never
modify tests. Full procedure: `docs/atdd/workflow.md` § Phase 3.

## Phase 4 — Quality Gates

Run lint, format, typecheck, build, test. Iterate until all pass (max 3 fix attempts per gate,
re-run all gates after each fix). Reference: `docs/atdd/quality-gates.md`. **Quality gate**:
report the gate results table. Do not proceed until all available gates pass.

## Phase 5 — Refactor

Only with tests green. One focused change at a time; run tests after each. Stop when clean —
no speculative abstractions. **Quality gate**: re-run all gates after refactoring.

## Phase 6 — Spec & Doc Sync (Hard Gate)

**Blocking.** Do not proceed with any unresolved drift — repair in-phase. This gate blocks the
PR in both modes.

**6a. Spec compliance.** Invoke the **spec-reviewer** subagent to validate implementation
against the spec and produce a drift report.

**6b. Spec drift repair.** Classify each flagged item **ADDED / MODIFIED / REMOVED** before
touching a file. ADDED and MODIFIED: update the `.feature` or `-spec.md` → add/adjust a test →
re-run the full suite. A **REMOVED** item is a spec weakening — never apply it under "match the
code":

- **Mode (b)**: stop on that item, show what the spec promises versus what the code does, and ask
  whether to narrow the spec or fix the code. Keep repairing other items meanwhile.
- **Mode (a)**: do not stop. Preserve the spec — correct the implementation to honor it. Stop
  only if honoring it is genuinely impossible. Hands-off never authorizes narrowing the spec.

Full procedure: `docs/atdd/workflow.md` § Phase 6b.

**6c. Documentation sync.** Walk the `Sources consulted` list in `docs/project-profile.md`.
For every doc listed there that could describe the changed behavior, update it or mark ⏭️
with reason. Work through: README → CONTRIBUTING → ARCHITECTURE → ADRs → style guides /
runbooks → `docs/project-profile.md` → any other consulted doc. Do not skip sources silently.

**6d. Final verification.** Re-run the suite and all quality gates. Produce this report:

```markdown
## Spec & Doc Sync — <feature>

| Item                            | Status                                    |
| ------------------------------- | ----------------------------------------- |
| Spec compliance                 | ✅ Compliant                              |
| Spec drift repaired             | ✅ N items (A:n M:n R:n) / ⏭️ none found  |
| Spec weakenings                 | ⏭️ none / ✅ N resolved (see table)       |
| README updated                  | ✅ \<section\> / ⏭️ not user-visible      |
| CONTRIBUTING updated            | ✅ \<section\> / ⏭️ no contributor impact |
| ARCHITECTURE updated            | ✅ \<section\> / ⏭️ no structural change  |
| ADRs updated                    | ✅ ADR-N added / ⏭️ no new decision       |
| Style guides / runbooks updated | ✅ \<files\> / ⏭️ none                    |
| docs/project-profile.md updated | ✅ \<new convention\> / ⏭️ no changes     |
| Other consulted docs updated    | ✅ \<files\> / ⏭️ none                    |
| Tests green                     | ✅ N/N                                    |
| Quality gates                   | ✅ all passing                            |
```

Do not proceed to Phase 7 unless every row is ✅ or has an explicit ⏭️ with reason.

## Phase 7 — Create PR

**Mode (a):** proceed automatically. Do not ask.
**Mode (b):** this is the one additional stop. Show the branch name, commit message, and PR
title you intend to use, and ask: _"Ready to push and open the PR?"_ Then proceed on approval.

1. Determine Git state: current branch, default branch (`main`/`master`), remote.
2. Create feature branch (if not already on one): `git checkout -b feat/<feature-name>`.
3. Stage and commit:

   ```
   feat: <short description>

   Implements specs/changes/<name>/delta.feature

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

Detailed procedure: the `/create-pull-request` command.

## Phase 8 — Review + Address Comments

**Mode (a):** run automatically.
**Mode (b):** run automatically as well — the mode (b) stop was Phase 7. Do not stop again.

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
| Analysis        | Project profile                  | ✅ <language>, <framework>     |
| Capability      | `specs/capabilities/<domain>/`        | ✅ Targeted / ✨ Created       |
| Spec            | `specs/changes/<name>/delta.feature`  | ✅ N scenarios (A:n M:n R:n)   |
| Spec            | `specs/changes/<name>/delta-rules.md` | ✅ Created                     |
| Tests           | `<test-file-path>`               | ✅ Red → Green (N scenarios)   |
| Implementation  | `<src-file-path(s)>`             | ✅ Implemented                 |
| Quality Gates   | lint/format/typecheck/build/test | ✅ All passed                  |
| Spec & Doc Sync | Spec / all consulted docs        | ✅ In sync (drift repaired)    |
| PR              | `feat/<name>` #N                 | ✅ Created                     |
| Review          | Comments addressed               | ✅ Done / ⏳ Awaiting review   |

Name the autonomy mode used in the line above the table, e.g.
_"Ran in mode (a) — hands-off after spec approval."_
