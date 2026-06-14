# Gherkin Conventions

Reference guide for writing `.feature` files in this project.

---

## File Conventions

- Location: `specs/features/`
- Naming: `kebab-case.feature` matching the feature name (e.g. `user-registration.feature`)
- One feature per file

---

## Syntax Reference

### Feature Block

```gherkin
Feature: Password Reset
  As a registered user
  I want to reset my password via email
  So that I can regain access to my account
```

The `As a / I want / So that` narrative is required — it provides context for why the feature exists.

### Background

Use `Background:` for preconditions shared by **every** scenario in the file:

```gherkin
Background:
  Given the application is running
  And a user account exists for "alice@example.com"
```

Do not use Background for preconditions that apply to only some scenarios — repeat them inline.
A Background with more than 4–5 steps is a warning sign that the feature file is too broad.

### Scenario

```gherkin
@smoke @happy-path
Scenario: Successful password reset
  Given I am on the password reset page
  When I enter "alice@example.com" and submit the form
  Then I should receive a password reset email
  And the email should contain a reset link valid for 1 hour
```

### Scenario Outline (data-driven)

Use when multiple input sets test the same behavior:

```gherkin
@edge-case
Scenario Outline: Login fails with invalid credentials
  Given I am on the login page
  When I enter email "<email>" and password "<password>"
  Then I should see the error "<message>"

  Examples:
    | email              | password | message                    |
    | not-an-email       | pass123  | "Invalid email format"     |
    | alice@example.com  |          | "Password is required"     |
    |                    | pass123  | "Email is required"        |
```

---

## Tags

Apply tags on the line immediately before `Scenario:` or `Scenario Outline:`:

```gherkin
@smoke @happy-path
Scenario: ...
```

| Tag           | Meaning                                              | Count per feature |
| ------------- | ---------------------------------------------------- | ----------------- |
| `@smoke`      | Single most critical path — run on every build       | Exactly 1         |
| `@happy-path` | Primary success flows                                | 1–2               |
| `@edge-case`  | Boundary conditions, unusual-but-valid inputs        | 2–4               |
| `@error`      | Invalid inputs, unauthorized access, system failures | 2–3               |
| `@wip`        | Not yet implemented — expected to fail               | Temporary only    |
| `@regression` | Added to catch a previously found bug                | As needed         |

The smoke scenario often also carries `@happy-path` since it is both.

---

## Formatting Rules

- 2-space indent for all content inside `Feature:`, `Background:`, `Scenario:`
- Blank line between each scenario
- Use `And` / `But` for additional steps of the same keyword type — do not repeat `Given`/`When`/`Then`
- Keep step text under 100 characters
- Use double quotes for literal string values: `"expected text"`
- Use angle brackets for Scenario Outline variables: `<variable_name>`
- Steps are sentence case with no trailing period

---

## Step Reuse

Identical step text across scenarios reuses the same step definition. Even small wording differences create separate definitions. Establish a step vocabulary early and stick to it.

**Consistent vocabulary example:**

```
# Always use the same form:
Given I am logged in as "alice@example.com"   ✅
Given alice is logged in                       ❌ (different step definition)
Given I'm authenticated as alice               ❌ (different step definition)
```

---

## Anti-Patterns

| Anti-pattern                                        | Problem                            | Fix                                                       |
| --------------------------------------------------- | ---------------------------------- | --------------------------------------------------------- |
| Multiple `When` steps in one scenario               | Scenarios should test one action   | Split into separate scenarios                             |
| `Then` asserts database rows or internal state      | Tests implementation, not behavior | Assert via the same surface the user observes             |
| One scenario depends on state from another          | Order-dependent, fragile           | Use Background or explicit `Given` setup                  |
| Vague `Then`: `"Then it works"` or `"Then success"` | Not automatable                    | Specify the exact observable outcome with concrete values |
| `Background` with 8+ steps                          | Context is overwhelming            | Break into a named `Given` step that encapsulates setup   |
| `Given` used for an action                          | Misuse of keyword semantics        | Move actions to `When`                                    |

---

## Good vs. Bad Examples

**❌ Tests internal state:**

```gherkin
Then the users table should have a row where active=true and email_verified=1
```

**✅ Tests observable behavior:**

```gherkin
Then I should see a "Welcome! Your account is ready." confirmation message
```

---

**❌ Vague and untestable:**

```gherkin
Then the login should succeed
```

**✅ Specific and testable:**

```gherkin
Then I should be redirected to the dashboard
And I should see "Welcome back, Alice"
```
