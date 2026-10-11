# Change Proposal Template

Copy to `specs/changes/<change-name>/proposal.md` and fill in the placeholders.

---

# Proposal: `<Change Name>`

| Field          | Value                                          |
| -------------- | ---------------------------------------------- |
| **Capability** | `<domain>` — or _"new capability"_             |
| **Status**     | Draft \| Approved                              |
| **Created**    | YYYY-MM-DD                                     |

---

## Why

<The problem this change solves, in two or three sentences. What is wrong or missing today,
and who it affects. Not the solution — the reason a solution is needed.>

## What changes

<A short prose summary of the behavior change, readable without opening the delta. Name the
capability being modified, and say whether this creates it.>

## In scope

- <Behavior this change delivers>
- <Behavior this change delivers>

## Out of scope

- <Adjacent thing a reader might reasonably assume is included, and is not>
- <Deferred follow-up work>

## Capability impact

<If this change creates a new capability, say so — every delta scenario will be `@added` and
Phase 7 will create `specs/capabilities/<domain>/`. If it modifies an existing one, note which
scenarios and rules it touches, and whether any behavior is removed.>
