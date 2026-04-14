# ATDD Cycle Checklist

Track progress through every phase of the ATDD cycle for each feature.
Copy into a PR description, issue, or tracking document.

---

## Feature: `<feature name>`

| Item           | Path                             |
| -------------- | -------------------------------- |
| Spec file      | `specs/features/<name>.feature`  |
| Tech spec      | `specs/technical/<name>-spec.md` |
| Test file      | `<test-file-path>`               |
| Implementation | `<src-file-path(s)>`             |

---

### Phase 0 — Analyze 🔍

- [ ] Language and package manager detected
- [ ] Test framework identified
- [ ] Linter detected (or noted as N/A)
- [ ] Formatter detected (or noted as N/A)
- [ ] Type checker detected (or noted as N/A)
- [ ] Build system detected (or noted as N/A)
- [ ] Existing conventions discovered (test naming, directory structure, code style)

---

### Phase 1 — Spec ✍️

- [ ] Actor, goal, and success criteria are clear
- [ ] `specs/features/<name>.feature` created
  - [ ] Feature block: `As a / I want / So that`
  - [ ] 1× `@smoke` scenario (most critical path)
  - [ ] 1–2× `@happy-path` scenarios
  - [ ] 2–4× `@edge-case` scenarios
  - [ ] 2–3× `@error` scenarios
  - [ ] `Scenario Outline` used for data-driven variations
  - [ ] Steps describe behavior, not implementation
  - [ ] All `Then` values are concrete (no vague placeholders)
- [ ] `specs/technical/<name>-spec.md` created
  - [ ] Business rules numbered with examples
  - [ ] API contract documented (if applicable)
  - [ ] Data constraints table filled in
  - [ ] Out-of-scope explicitly listed
- [ ] Spec reviewed and confirmed before tests are written

---

### Phase 2 — Acceptance Tests (Red) 🔴

- [ ] Test framework identified
- [ ] Test file created at `<path>`
  - [ ] Header comment: `// Spec: specs/features/<name>.feature`
  - [ ] Stub for every Given / When / Then in every scenario
  - [ ] Each stub throws a clear "not implemented" error (not silent skip)
- [ ] Tests executed
- [ ] All stubs are **red for the right reason** (not import/syntax errors)

---

### Phase 3 — Implementation (Green) 🟡 → 🟢

- [ ] `@smoke` scenario(s) implemented — test green ✅
- [ ] `@happy-path` scenario(s) implemented — test green ✅
- [ ] `@edge-case` scenario(s) implemented — test green ✅
- [ ] `@error` scenario(s) implemented — test green ✅
- [ ] No code added beyond what failing tests required
- [ ] No test files modified during implementation

## **Intentionally skipped `@wip` scenarios** (list any):

---

### Phase 4 — Quality Gates ✅

- [ ] Lint gate passed (or N/A)
- [ ] Format gate passed (or N/A)
- [ ] Type check gate passed (or N/A)
- [ ] Build gate passed (or N/A)
- [ ] Full test suite passed
- [ ] All gates re-run after fixes — no regressions

---

### Phase 5 — Refactor 🔵

- [ ] All tests were green before refactoring began
- [ ] Tests run after every structural change
- [ ] No behavior changed during refactor
- [ ] No features added during refactor
- [ ] All quality gates re-run and passing after refactor

---

### Phase 6 — Spec Review ✔️

- [ ] Every scenario has a corresponding test
- [ ] Every business rule in the technical spec is enforced by a test
- [ ] No implementation behavior exists without a spec scenario
- [ ] The `.feature` file accurately documents current behavior
- [ ] Spec review passed (via `/verify-spec-coverage` or `@spec-reviewer`)

---

### Phase 7 — PR 🚀 (Optional)

- [ ] Feature branch created: `feat/<name>`
- [ ] Changes committed with meaningful message referencing the spec
- [ ] Pushed to remote
- [ ] PR created with spec, quality gate results, and scenario summary
- [ ] PR approved
