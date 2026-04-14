# ATDD Patterns & Anti-Patterns

## Foundational Patterns

### Pattern: Spec First

**Problem**: The team writes code and then writes tests to match the code. Tests become a
documentation exercise, not a design tool.

**Solution**: Write the `.feature` file before any code exists. The spec forces you to think about
behavior from the outside before thinking about implementation.

```
Requirements → Feature file → Tests (RED) → Implementation → GREEN
```

### Pattern: Outside-In Development

**Problem**: Starting from data models or database schemas leads to inside-out design that serves
the storage layer, not the user.

**Solution**: Start from the user/caller perspective. Write the Gherkin scenario as the user
experiences it. Let the test drive the discovery of what internal components are needed.

### Pattern: Three Amigos

**Problem**: Developers implement features that technically pass tests but miss business intent.

**Solution**: Before writing any spec, involve three perspectives:

1. **Product / Business** — What are the acceptance criteria? What are the business rules?
2. **QA / Testing** — What are the edge cases? What breaks easily?
3. **Development** — What are the technical constraints or unknowns?

In an agentic workflow, include these perspectives explicitly in your requirements prompt to
`@spec-writer`.

### Pattern: Living Documentation

**Problem**: Specs in wikis or tickets rot — they diverge from the actual implementation over time.

**Solution**: Gherkin specs are executable. If the implementation changes without updating the spec,
a test fails. The specs are always accurate documentation of current behavior.

---

## Implementation Patterns

### Pattern: Minimum Implementation

After writing tests and confirming they are red, implement only what the test demands.

```
Test: "Then the response status should be 201"
Implementation: return the correct status code — nothing else yet
```

Resist the urge to implement "while you're in here." Every non-test-driven line is speculation.

### Pattern: Triangulation

When a scenario is too simple and you risk hardcoding the answer, add a second scenario with
different data to force a real implementation:

```gherkin
Scenario: Addition of positive numbers
  When I add 3 and 4
  Then the result should be 7

Scenario: Addition with zero
  When I add 5 and 0
  Then the result should be 5
```

Both scenarios together prevent `return 7` from passing.

### Pattern: Scenario as Contract

Treat each scenario as a contract between the spec author and the implementer. The scenario says:
"If the system is in this state (`Given`) and this event occurs (`When`), then I assert the system
will produce this observable behavior (`Then`)."

Breaking the contract requires updating the spec first.

### Pattern: Tag-Driven Implementation Order

Implement scenarios in priority order — most critical first:

1. `@smoke` — get the critical path working
2. `@happy-path` — cover all the success cases
3. `@edge-case` — harden the boundaries
4. `@error` — handle failures gracefully

This ensures the most important behavior is always working, even if development is interrupted.

---

## Anti-Patterns

### Anti-Pattern: Scenario Glut

**Symptom**: Dozens of scenarios, many nearly identical.

**Problem**: Expensive to maintain, slow to run, hard to read.

**Fix**: Use `Scenario Outline` for data-driven variations. Write focused scenarios for each
distinct behavior, not for every possible input combination.

---

### Anti-Pattern: Asserting Internal State

**Symptom**: `Then` steps that check database records, log output, or internal variables.

**Problem**: Locks tests to the current implementation. Prevents refactoring.

**Fix**: Assert behavior through the same interface the user uses. If the user can't observe it,
the spec probably shouldn't test it directly.

```gherkin
# ❌ Tests implementation
Then the "users" table should have 1 row with email "test@example.com"

# ✅ Tests behavior
Then I should receive a welcome email at "test@example.com"
And I should be able to log in with "test@example.com"
```

---

### Anti-Pattern: Shared Mutable State Between Scenarios

**Symptom**: Scenarios fail in isolation but pass in sequence, or vice versa.

**Problem**: Order-dependent tests are unreliable. Failures are hard to diagnose.

**Fix**: Each scenario must set up its own preconditions in `Given` steps (or `Background`).
The test framework should reset state between scenarios.

---

### Anti-Pattern: Writing Tests After Implementation

**Symptom**: Tests pass immediately when first run.

**Problem**: Tests written after implementation tend to test what _was_ built, not what _should_
be built. The red phase is skipped and the design-driving value of ATDD is lost.

**Fix**: Write the failing test first. See it fail. Then implement. See it pass.

---

### Anti-Pattern: Modifying Tests to Pass

**Symptom**: A test is failing. The implementer changes the assertion to match the wrong behavior.

**Problem**: Tests become worthless. Specs no longer reflect requirements.

**Fix**: Tests are sacred. Only the implementation changes to satisfy a test. If a test is wrong,
update the spec first, get sign-off, then update the test, then update the code.

---

### Anti-Pattern: The God Scenario

**Symptom**: One scenario with 20+ steps that covers an entire workflow.

**Problem**: One failure is ambiguous. It's not clear which step failed or what behavior is broken.

**Fix**: One behavior per scenario. Break workflows into focused scenarios.

---

## Agentic Workflow Patterns

### Pattern: Spec Review Before Proceeding

After `@spec-writer` creates specs, review them before generating tests. It's much cheaper to fix
a scenario at the spec stage than after tests and implementation have been written.

### Pattern: Explicit Red Confirmation

Before implementing, always run the tests and explicitly confirm they are red _for the right reason_.
"Not implemented" is the right reason. "Import error" or "undefined variable" means the test
infrastructure has a bug that must be fixed first.

### Pattern: Incremental Greenification

Don't try to implement all scenarios at once. Go `@smoke` → green, then `@happy-path` → green,
etc. This gives you a working (partial) implementation at every step.

### Pattern: Spec as the PR Description

When opening a pull request, reference the feature file as the description of what was built:

> Implements `specs/features/user-registration.feature`. All 8 scenarios pass.

This makes the spec the review artifact, not the code diff alone.
