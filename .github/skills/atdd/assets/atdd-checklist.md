# ATDD Cycle Checklist

Use this checklist for every feature to track progress and ensure the full ATDD cycle is followed.
Copy and paste into a PR description, issue, or tracking document.

---

## Feature: `<feature name>`

**Spec file**: `specs/features/<name>.feature`
**Tech spec**: `specs/technical/<name>-spec.md`
**Test file**: `<test-file-path>`
**Implementation**: `<src-file-path(s)>`

---

## Phase 0: Analyze 🔍

- [ ] Language and package manager detected
- [ ] Test framework identified
- [ ] Linter detected (or N/A)
- [ ] Formatter detected (or N/A)
- [ ] Type checker detected (or N/A)
- [ ] Build system detected (or N/A)
- [ ] Existing conventions discovered (test naming, directory structure, code style)

---

## Phase 1: Spec ✍️

- [ ] Requirements clarified (actor, goal, success criteria, edge and error cases identified)
- [ ] `specs/features/<name>.feature` created
  - [ ] Feature block: `As a / I want / So that`
  - [ ] 1x `@smoke` scenario (single most critical path)
  - [ ] 1–2x `@happy-path` scenarios
  - [ ] 2–4x `@edge-case` scenarios
  - [ ] 2–3x `@error` scenarios
  - [ ] `Scenario Outline` used for data-driven variations
  - [ ] Steps describe behavior, not implementation
- [ ] `specs/technical/<name>-spec.md` created
  - [ ] Business rules listed and numbered
  - [ ] API contract documented (if applicable)
  - [ ] Data constraints table filled in
  - [ ] Out-of-scope explicitly defined
- [ ] Spec reviewed and confirmed accurate before proceeding

---

## Phase 2: Acceptance Tests (Red) 🔴

- [ ] Test framework detected from Phase 0
- [ ] Test file created at `<path>` using project conventions
  - [ ] Header: `// Spec: specs/features/<name>.feature`
  - [ ] Step definition stub for every Given/When/Then
  - [ ] Each stub fails with a clear "not implemented" message (not empty/skipped)
- [ ] Tests executed
- [ ] All stubs confirmed **red** for the right reason
- [ ] No setup errors (syntax, imports, config) — only "not implemented" failures

---

## Phase 3: Implementation (Green) 🟡 → 🟢

- [ ] `@smoke` scenario(s) implemented → test green ✅
- [ ] `@happy-path` scenario(s) implemented → test green ✅
- [ ] `@edge-case` scenario(s) implemented → test green ✅
- [ ] `@error` scenario(s) implemented → test green ✅
- [ ] `@wip` scenarios intentionally skipped (list them below if any)
- [ ] No code added beyond what failing tests required
- [ ] No test files modified during implementation

**Skipped `@wip` scenarios**:

- _none_ / `"<scenario name>"`

---

## Phase 4: Quality Gates ✅

- [ ] Lint gate passed (or N/A)
- [ ] Format gate passed (or N/A)
- [ ] Type check gate passed (or N/A)
- [ ] Build gate passed (or N/A)
- [ ] Full test suite passed (acceptance + existing)
- [ ] No pre-existing tests broken by new implementation
- [ ] All gates re-run after fixes — no regressions

---

## Phase 5: Refactor ♻️

- [ ] Implementation reviewed for duplication, naming clarity, and complexity
- [ ] Refactor changes made one at a time
- [ ] Tests run after each change
- [ ] All tests green after final refactor
- [ ] All quality gates re-run and passing after refactor

---

## Phase 6: Spec Review 📋

- [ ] Every scenario has a corresponding test that would fail if behavior were removed
- [ ] Every business rule from technical spec is enforced in the implementation
- [ ] No non-trivial code path is untested
- [ ] Spec review passed (via `/verify-spec-coverage` or `@spec-reviewer`)

---

## Phase 7: PR 🚀 (Optional)

- [ ] Feature branch created: `feat/<name>`
- [ ] Changes committed with meaningful message referencing the spec
- [ ] Pushed to remote
- [ ] PR created with spec, quality gate results, and scenario summary
- [ ] PR approved

---

## Definition of Done

A feature is **done** when all of the following are true:

- [ ] `specs/features/<name>.feature` exists and accurately describes current behavior
- [ ] `specs/technical/<name>-spec.md` exists with current business rules
- [ ] All scenarios (except `@wip`) have passing acceptance tests
- [ ] All quality gates pass (lint, format, typecheck, build, test)
- [ ] No test was modified to make it pass
- [ ] Spec compliance review passed with no gaps or violations
