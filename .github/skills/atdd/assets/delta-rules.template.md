# Delta Rules Template

Copy to `specs/changes/<change-name>/delta-rules.md` and fill in the placeholders.

Only the rules this change touches. Keep the capability's existing numbering — a MODIFIED rule
keeps its number, an ADDED rule takes the next free one. Phase 7 merges these into
`specs/capabilities/<domain>/rules.md`.

---

# `<Change Name>` — Rule Deltas

| Field          | Value                                         |
| -------------- | --------------------------------------------- |
| **Capability** | `<domain>`                                     |
| **Rules file** | `specs/capabilities/<domain>/rules.md`         |

---

## ADDED Rules

### <N>. <Rule statement>

<The rule, stated so a violation is detectable. Follow with a concrete example.>

**Example:** <input → expected outcome>

## MODIFIED Rules

### <N>. <Rule statement, as it will read after this change>

**Was:** <the rule as it reads in the capability today>
**Now:** <the rule as it will read>
**Direction:** Tightened \| Same strictness, different shape

<A tightened rule rejects more than before, and applies freely. A rule that accepts more than
before is a **relaxation** — that is a REMOVED, not a MODIFIED, and needs confirmation. See
workflow.md § Phase 6b.>

**Example:** <input → expected outcome>

## REMOVED Rules

### <N>. <Rule statement being removed>

**Why it is safe to remove:** <reason>
**Confirmed by:** <who approved narrowing the spec, and when>

## Contract changes

<Request/response shape, status code, or data constraint changes. Omit the section if none.>
