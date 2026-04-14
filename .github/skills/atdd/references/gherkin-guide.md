# Gherkin Reference Guide

## Overview

Gherkin is a plain-language format for writing executable specifications. It bridges business
requirements and automated tests, making specs readable by both humans and test frameworks.

## Keyword Reference

| Keyword             | Purpose                                                      |
| ------------------- | ------------------------------------------------------------ |
| `Feature:`          | Names the capability being specified                         |
| `Background:`       | Shared preconditions for all scenarios in the file           |
| `Scenario:`         | A single testable behavior                                   |
| `Scenario Outline:` | A parameterized scenario, run once per `Examples` row        |
| `Examples:`         | Data table for `Scenario Outline`                            |
| `Given`             | Establishes preconditions / initial context                  |
| `When`              | Describes the event or action under test                     |
| `Then`              | Describes the expected observable outcome                    |
| `And`               | Continues the previous keyword (same type)                   |
| `But`               | Contrast continuation (e.g., `But I should not see "Error"`) |
| `#`                 | Comment                                                      |

## Step Types In Depth

### Given — Set the Stage

Establish the preconditions. Everything that must be true _before_ the action happens.

```gherkin
Given I am logged in as an admin
Given the shopping cart contains 2 items totaling $29.98
Given the system time is "2026-01-01T00:00:00Z"
```

**Avoid**: Using `Given` for actions (that's `When`).

### When — The Action

The single event or action that triggers the behavior under test. Ideally one `When` per scenario.

```gherkin
When I submit the checkout form
When the payment processor returns a timeout error
When I request "GET /api/users/999"
```

**Avoid**: Multiple `When` steps (split into separate scenarios).

### Then — The Observable Outcome

What the user or calling system can observe after the `When`. Never assert internal state.

```gherkin
Then I should see "Order confirmed — #12345"
Then the response status should be 201
Then I should receive a confirmation email at "user@example.com"
```

**Avoid**: `Then the database should have record with status=1`.

---

## Background

Use `Background:` for preconditions that apply to **every** scenario in the file. Executed before
each scenario as if the steps were part of that scenario's `Given` block.

```gherkin
Background:
  Given the API server is running
  And the database is empty
```

**When NOT to use Background**:

- When only some scenarios need the precondition — put it in those scenarios directly
- When more than 5–6 steps are needed — consider a higher-level `Given` step instead

---

## Scenario Outline

Runs the same scenario logic multiple times with different data from an `Examples` table.

```gherkin
@edge-case
Scenario Outline: Transfer fails when amount exceeds balance
  Given my account balance is $<balance>
  When I transfer $<amount>
  Then I should see the error "<error>"

  Examples:
    | balance | amount  | error                              |
    | 100.00  | 100.01  | "Insufficient funds"               |
    | 100.00  | 999.99  | "Insufficient funds"               |
    | 0.00    | 0.01    | "Insufficient funds"               |
    | 100.00  | 0.00    | "Amount must be greater than zero" |
```

**When to use**: Same behavior tested with multiple input variations.
**When NOT to use**: Testing genuinely different behaviors (write separate scenarios).

---

## Step Reuse Best Practices

Steps are matched to step definitions by **exact text**. Maintain a consistent vocabulary.

```gherkin
# All of these are DIFFERENT step definitions — avoid this:
Given I am logged in
Given the user is authenticated
Given I have logged in
Given a logged-in user

# Pick ONE phrasing and use it everywhere:
Given I am authenticated as "<role>"
```

Create a shared step vocabulary in your project's documentation and stick to it.

---

## Tags Strategy

Tags serve dual purposes: documentation and test filtering.

### Mandatory Tags (apply to every scenario)

| Tag           | Count per feature | Meaning                                             |
| ------------- | ----------------- | --------------------------------------------------- |
| `@smoke`      | Exactly 1         | Most critical path — if this fails, stop everything |
| `@happy-path` | 1–2               | Primary success scenarios                           |
| `@edge-case`  | 2–4               | Boundary and unusual-but-valid inputs               |
| `@error`      | 2–3               | Invalid input, auth failures, system errors         |

### Status Tags (apply temporarily)

| Tag           | Meaning                                         |
| ------------- | ----------------------------------------------- |
| `@wip`        | Not yet implemented — intentionally failing     |
| `@regression` | Added to prevent reoccurrence of a specific bug |

### Running Subsets

Most test runners support tag filters:

```bash
# Run only smoke tests
cucumber --tags @smoke

# Run everything except wip
cucumber --tags "not @wip"

# Run smoke and happy-path
cucumber --tags "@smoke or @happy-path"
```

---

## Common Mistakes

| Mistake                                    | Why it's a problem                  | Fix                                         |
| ------------------------------------------ | ----------------------------------- | ------------------------------------------- |
| Testing multiple behaviors in one scenario | Hard to diagnose failures           | Split into separate scenarios               |
| `Then` checks database / internal state    | Tests implementation, not behavior  | Assert via the same interface the user uses |
| Scenarios that share state                 | Order-dependent, fragile            | Use Background or explicit Given steps      |
| Step text that mentions code/classes       | Couples spec to implementation      | Use business-language terms                 |
| Vague outcome: "Then it should work"       | Not testable                        | Specify exact observable output             |
| Long scenarios (10+ steps)                 | Hard to read, tests too many things | Split into smaller focused scenarios        |
