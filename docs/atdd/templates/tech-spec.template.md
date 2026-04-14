# Technical Spec Template

Copy to `specs/technical/<feature-name>-spec.md` and fill in the placeholders.

---

# `<Feature Name>` — Technical Spec

| Field            | Value                                   |
| ---------------- | --------------------------------------- |
| **Status**       | Draft \| In Review \| Approved          |
| **Version**      | 1.0                                     |
| **Feature file** | `specs/features/<feature-name>.feature` |
| **Author**       |                                         |
| **Last updated** | YYYY-MM-DD                              |

---

## Overview

> 2–4 sentences describing what this feature does, who it serves, and why it exists.

---

## Actors

| Actor    | Role in this feature |
| -------- | -------------------- |
| `<role>` | `<what they do>`     |
| `<role>` | `<what they do>`     |

---

## Scope

### In Scope

- `<What this spec covers>`
- `<What will be built>`

### Out of Scope

- `<What is explicitly NOT covered by this spec>`
- `<Related features or future work intentionally excluded>`

---

## Business Rules

> Numbered rules the implementation MUST enforce. Each rule needs a concrete example.

1. **`<Rule Name>`**: `<Description>`.
   - Example: `<Concrete example showing the rule in action>`

2. **`<Rule Name>`**: `<Description>`.
   - Example: `<Example>`

3. **`<Rule Name>`**: `<Description>`.
   - Example: `<Example>`

---

## API Contract _(remove section if not applicable)_

### `<METHOD> /api/<path>`

**Request body**:

```json
{
  "field": "string — description (required)",
  "field2": "number — description (optional, default: 0)"
}
```

**Success response** (`200 OK` / `201 Created`):

```json
{
  "id": "string — unique identifier",
  "field": "string — description"
}
```

**Error responses**:

| HTTP Status               | Condition                        | Response body                                    |
| ------------------------- | -------------------------------- | ------------------------------------------------ |
| `400 Bad Request`         | `<Validation failure condition>` | `{ "error": "<message>" }`                       |
| `401 Unauthorized`        | `<Auth failure>`                 | `{ "error": "Unauthorized" }`                    |
| `404 Not Found`           | `<Resource missing>`             | `{ "error": "Not found" }`                       |
| `409 Conflict`            | `<Conflict condition>`           | `{ "error": "<message>" }`                       |
| `503 Service Unavailable` | `<Dependency failure>`           | `{ "error": "Service temporarily unavailable" }` |

---

## Data Constraints

| Field     | Type     | Required | Constraints                       |
| --------- | -------- | -------- | --------------------------------- |
| `<field>` | `string` | ✅       | Non-empty, max 255 characters     |
| `<field>` | `string` | ✅       | Valid email format                |
| `<field>` | `number` | ✅       | Integer, min 1, max 999           |
| `<field>` | `string` | ❌       | ISO 8601 date format, if provided |

---

## Dependencies

| Dependency          | Type                                | Purpose                |
| ------------------- | ----------------------------------- | ---------------------- |
| `<Service/Library>` | External API \| Database \| Library | `<What it's used for>` |

---

## Security Considerations

- `<Authentication requirement — who can call this?>`
- `<Authorization requirement — what roles are allowed?>`
- `<Input validation — what sanitization is required?>`
 - `<Sensitive data handling — PII, secrets, etc.>`

---

## Open Questions

> Remove when resolved. Add resolution date and decision.

- [ ] `<Question that needs resolution before or during implementation>`
- [ ] `<Another open question>`
