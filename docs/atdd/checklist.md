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

**Tooling**

- [ ] Language and package manager detected
- [ ] Test framework identified
- [ ] Linter detected (or noted as N/A)
- [ ] Formatter detected (or noted as N/A)
- [ ] Type checker detected (or noted as N/A)
- [ ] Build system detected (or noted as N/A)
- [ ] CI/CD platform detected (or noted as N/A)

**Existing documentation** (mandatory if any docs exist — read before sampling code)

- [ ] `README.md` / variants read (if present)
- [ ] `CONTRIBUTING.md` read (if present)
- [ ] `ARCHITECTURE.md` / `docs/architecture.md` read (if present)
- [ ] `docs/adr/` or `docs/decisions/` read (if present)
- [ ] `STYLE.md` / `STYLEGUIDE.md` / `CODING_STANDARDS.md` / `SECURITY.md` read (if present)
- [ ] `.github/PULL_REQUEST_TEMPLATE.md` read (if present)
- [ ] Precedence applied (README commands, ADRs, `CONTRIBUTING.md` override inference)
- [ ] Any conflicts between docs and code recorded under `Known inconsistencies`

**Conventions** (mandatory unless greenfield — sample 2–4 representative source files)

- [ ] Architecture style recorded
- [ ] Module layout recorded
- [ ] Dependency wiring recorded
- [ ] Error handling style recorded
- [ ] Validation approach recorded
- [ ] Async/cancellation patterns recorded
- [ ] Logging library and conventions recorded
- [ ] Configuration loading recorded
- [ ] Naming conventions recorded (files, classes, functions, constants, tests)
- [ ] Public API style recorded (or N/A)
- [ ] Persistence style recorded (or N/A)
- [ ] Commit and branch conventions recorded

**Profile written**

- [ ] `docs/project-profile.md` contains `Tooling`, `Conventions`, `Reference Files`, and
      `Sources consulted` sections
- [ ] At least one reference file listed per layer the agent will mirror in Phase 3
- [ ] Every doc and code file read during analysis is listed under `Sources consulted`
- [ ] Verification message printed: `✓ Wrote docs/project-profile.md (...)`

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

**Pre-implementation convention sync (mandatory)**

- [ ] `docs/project-profile.md` re-read (`Conventions`, `Reference Files`, `Anti-patterns`)
- [ ] At least one reference file from each affected layer opened
- [ ] Conventions-to-follow statement produced before any production file was created

**Implementation**

- [ ] `@smoke` scenario(s) implemented — test green ✅
- [ ] `@happy-path` scenario(s) implemented — test green ✅
- [ ] `@edge-case` scenario(s) implemented — test green ✅
- [ ] `@error` scenario(s) implemented — test green ✅
- [ ] All new code mirrors the architecture, error style, validation, and naming patterns in
      the project profile
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

### Phase 6 — Spec & Doc Sync (Hard Gate) ✔️

**6a Compliance**

- [ ] Every scenario has a corresponding test
- [ ] Every numbered business rule in the technical spec is enforced by a test
- [ ] No implementation behavior exists without a spec scenario
- [ ] The `.feature` file accurately documents current behavior
- [ ] Spec review run (via `/verify-spec-coverage` or `@spec-reviewer`)

**6b Spec drift repair (any drift fixed in-phase, not deferred)**

- [ ] Extra inputs/outputs not in spec → scenario added or code removed
- [ ] Relaxed/tightened business rules → spec updated, test catches regression
- [ ] Changed validation messages, status codes, error shapes → spec updated
- [ ] New edge cases → `@edge-case` scenario added

**6c Documentation sync**

- [ ] `README.md` updated (or marked ⏭️ "feature not user-visible" with reason)
- [ ] `docs/project-profile.md` updated if Phase 3 introduced a new convention or dependency
- [ ] Any other docs that describe the changed behavior updated

**6d Final verification**

- [ ] Full test suite re-run after all repairs — green
- [ ] All quality gates re-run after all repairs — passing
- [ ] Spec & Doc Sync report produced (every row ✅ or explicit ⏭️)

---

### Phase 7 — PR 🚀 (Optional)

- [ ] Feature branch created: `feat/<name>`
- [ ] Changes committed with meaningful message referencing the spec
- [ ] Pushed to remote
- [ ] PR created with spec, quality gate results, and scenario summary
- [ ] PR approved
