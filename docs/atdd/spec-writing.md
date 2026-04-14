# Spec Writing Guide

Specifications describe **observable behavior**, not internal implementation.
A good spec can be read and validated by a non-technical stakeholder.

---

## Core Principle: Behavior, Not Implementation

| ❌ Implementation-focused                               | ✅ Behavior-focused                          |
| ------------------------------------------------------- | -------------------------------------------- |
| `Given the UserService validates the hash using bcrypt` | `Given I enter an incorrect password`        |
| `Then the DB record should have status=1`               | `Then my account should be locked`           |
| `When the MessageBroker publishes to order.created`     | `When I place an order`                      |
| `Then EmailService.send() should be called once`        | `Then I should receive a confirmation email` |

---

## Feature File

### Structure

```gherkin
Feature: <Short imperative noun phrase, e.g. "User Login">
  As a <actor: user / admin / API client / background job>
  I want to <goal: what the actor is trying to do>
  So that <benefit: the business or user value>

  Background:
    Given <precondition shared by ALL scenarios>

  @smoke @happy-path
  Scenario: <Most critical success path>
    Given <initial state>
    When <primary action>
    Then <observable outcome>
```

### Step Writing Rules

**Given** — establishes context and preconditions (state, not action)

- ✅ `Given I am logged in as an admin`
- ✅ `Given the cart contains 3 items`
- ❌ `Given I click the login button` ← that is a When

**When** — the action or event being tested (present tense, active voice)

- ✅ `When I submit the registration form`
- ✅ `When the payment processor is unavailable`
- ❌ `When the system processes the request internally` ← implementation detail

**Then** — the observable outcome from the user's or caller's perspective

- ✅ `Then I should see "Account created successfully"`
- ✅ `Then the order total should be $15.99`
- ❌ `Then the database should contain a row with user_id=42` ← internal detail

### What Makes a Good Scenario

- **Single behavior**: tests exactly one thing
- **Independent**: can run in any order, does not depend on other scenarios
- **Readable**: a non-technical stakeholder can understand it without explanation
- **Specific**: uses concrete values (`$15.99`, `"Password is required"`) — never vague placeholders
- **Testable**: can be automated without ambiguity about what to assert

### Required Coverage Per Feature

| Scenarios     | Count     | Description                                                              |
| ------------- | --------- | ------------------------------------------------------------------------ |
| `@smoke`      | exactly 1 | The single most critical happy path                                      |
| `@happy-path` | 1–2       | All primary success variations                                           |
| `@edge-case`  | 2–4       | Boundary values, empty inputs, maximum lengths, unusual-but-valid inputs |
| `@error`      | 2–3       | Invalid inputs, unauthorized access, dependent system failures           |

Use `Scenario Outline` when multiple inputs share the same behavior — avoid duplicating near-identical scenarios.

---

## Technical Spec

The technical spec (`specs/technical/<name>-spec.md`) captures the rules and contracts that the feature file scenarios enforce. It bridges business requirements and implementation.

### Required Sections

**Scope** — what is in and out of scope for this spec. Explicit out-of-scope prevents scope creep.

**Business Rules** — numbered list. Each rule must:

- Be a testable assertion (avoid "the system should be performant")
- Have a concrete example showing the rule in action
- Map to at least one scenario in the feature file

Example:

```
3. **Account lockout**: An account is locked after 5 consecutive failed login
   attempts within a 15-minute window.
   - Example: Attempts 1–4 return "Invalid credentials." Attempt 5 locks the
     account. Attempt 6 returns "Account locked. Try again in 15 minutes."
```

**API Contract** — for features that expose an API: request/response shapes, status codes, error formats.

**Data Constraints** — field types, required vs optional, length limits, format requirements.

### What to Exclude

- Implementation details (which ORM, which hash algorithm, which queue)
- Performance targets (unless they are verifiable acceptance criteria)
- Internal state that the consumer cannot observe

---

## Checklist Before Finalizing a Spec

- [ ] Every scenario describes behavior observable by the actor, not internal state
- [ ] All values in `Then` steps are concrete, not placeholders
- [ ] At least 1 `@smoke`, 1 `@happy-path`, 2 `@edge-case`, 2 `@error` scenarios
- [ ] `Scenario Outline` used where multiple inputs share the same flow
- [ ] Every business rule in the technical spec has a corresponding scenario
- [ ] Out-of-scope is explicitly stated
- [ ] Spec reviewed and confirmed before test generation begins

---

## Related

- [Gherkin conventions](./gherkin.md) — syntax, formatting, step reuse
- [Feature file template](./templates/feature.template.md) — ready-to-copy template
- [Technical spec template](./templates/tech-spec.template.md) — ready-to-copy template
