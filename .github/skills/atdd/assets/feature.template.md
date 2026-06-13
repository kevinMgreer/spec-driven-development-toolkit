# Gherkin Feature File Template

Copy to `specs/features/<feature-name>.feature` and replace all placeholders.

---

```gherkin
Feature: <Short imperative noun phrase — e.g. "User Registration", "Password Reset">
  As a <role: "registered user" / "admin" / "API client" / "guest">
  I want to <goal: what the actor wants to accomplish>
  So that <benefit: the business or user value delivered>

  # Remove Background if preconditions differ between scenarios
  Background:
    Given <common precondition shared by ALL scenarios below>
    And <another shared precondition if applicable>

  # ─── SMOKE ────────────────────────────────────────────────────────────────
  # One scenario — the single most critical path. Run on every build.
  @smoke @happy-path
  Scenario: <Most critical success path — title states the expected outcome>
    Given <initial state>
    When <primary action taken by actor>
    Then <primary observable outcome>
    And <secondary observable outcome, if any>

  # ─── HAPPY PATH ───────────────────────────────────────────────────────────
  # Primary success flows beyond the smoke scenario
  @happy-path
  Scenario: <Another valid success variation>
    Given <state>
    When <action>
    Then <outcome>

  # ─── EDGE CASES ───────────────────────────────────────────────────────────
  # Boundary conditions, unusual-but-valid inputs
  @edge-case
  Scenario: <Boundary condition — e.g. "maximum allowed value">
    Given <state at boundary>
    When <action>
    Then <expected outcome at boundary>

  # Use Scenario Outline for multiple related input variations
  @edge-case
  Scenario Outline: <Shared behavior with varying inputs>
    Given <state involving <input>>
    When <action>
    Then <expected outcome is <expected>>

    Examples:
      | input         | expected                  |
      | <value_1>     | <expected_outcome_1>      |
      | <value_2>     | <expected_outcome_2>      |
      | <boundary>    | <expected_at_boundary>    |

  # ─── ERROR CASES ──────────────────────────────────────────────────────────
  # Invalid inputs, unauthorized access, system failures
  @error
  Scenario: <Invalid input — name the specific invalid condition>
    Given <state>
    When <action with invalid input>
    Then I should see an error "<specific error message>"

  @error
  Scenario: <Unauthorized access>
    Given I am not authenticated
    When <action that requires authentication>
    Then I should be denied access
    And I should see "<specific message or redirect>"

  @error
  Scenario: <Dependent system failure>
    Given <external dependency> is unavailable
    When <action that depends on it>
    Then <graceful failure behavior — user-visible error or fallback>
```

---

## Checklist Before Submitting

- [ ] Feature block has role / goal / benefit
- [ ] Exactly **1** `@smoke` scenario (the most critical path)
- [ ] At least **1** `@happy-path` scenario
- [ ] At least **2** `@edge-case` scenarios (boundaries and unusual inputs)
- [ ] At least **2** `@error` scenarios (invalid, auth failure, system failure)
- [ ] `Scenario Outline` used where multiple inputs share the same behavior
- [ ] All step text describes behavior, not implementation internals
- [ ] All `Then` values are concrete (not "the expected value")
- [ ] Consistent step vocabulary with other feature files in `specs/`
