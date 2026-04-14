---
description: "Use when implementing features, writing tests, or following the TDD/ATDD development cycle. Covers the spec-first workflow, red-green-refactor cycle, and how specs, tests, and implementation relate. Trigger phrases: ATDD, TDD, spec-first, acceptance tests, red-green-refactor, feature implementation, test-driven."
---

# ATDD Workflow

## The Cycle

```
Requirements → Spec → Acceptance Tests → Red → Green → Refactor → Review
```

## Phase Rules

### Spec Phase

- Every feature starts with a spec in `specs/`
- Gherkin feature files: `specs/features/<name>.feature`
- Technical specs: `specs/technical/<name>-spec.md`
- Specs define **behavior** (what), not implementation (how)
- Spec is the source of truth; code must match the spec, not the reverse

### Test Phase (Red)

- Write test stubs for every Gherkin scenario before writing any production code
- Run tests to confirm they fail **for the right reason**
  - "Wrong-reason" failures (syntax errors, import errors) must be fixed before implementing
  - A test that passes without implementation is invalid — the test itself is broken
- Do not proceed to implementation until all stubs are confirmed red

### Implementation Phase (Green)

- Implement only what is required to make failing tests pass
- Work scenario by scenario, in priority order: `@smoke` → `@happy-path` → `@edge-case` → `@error`
- Never add logic not demanded by a failing test
- If you find yourself writing "just in case" code — stop and delete it

### Refactor Phase

- Refactor only when **all** tests are green
- Run tests after every change — if tests break, revert the change
- Refactoring changes structure without changing behavior
- Do not add features during refactor

### Review Phase

- Every scenario must have a corresponding test that would fail if behavior were removed
- Implementations without test coverage must have explicit justification

---

## Spec Change Protocol

When requirements change:

1. Update `specs/features/*.feature` first
2. Update `specs/technical/*-spec.md` if needed
3. Update or add tests to match the new spec
4. Confirm new/changed tests are red
5. Update implementation to pass the new tests
6. Confirm all tests green

**Never** update implementation to accommodate changed behavior without first updating the spec.

---

## Tag Priority Order

When implementing incrementally, work in this order:

| Tag           | Priority     | Description                  |
| ------------- | ------------ | ---------------------------- |
| `@smoke`      | 1st          | Must-pass critical path      |
| `@happy-path` | 2nd          | Primary success scenarios    |
| `@edge-case`  | 3rd          | Boundary and unusual inputs  |
| `@error`      | 4th          | Error handling and sad paths |
| `@wip`        | Skip         | Not yet ready to implement   |
| `@regression` | After errors | Previously found bugs        |
