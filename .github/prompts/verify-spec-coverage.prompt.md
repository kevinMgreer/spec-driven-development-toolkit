---
description: "Verify that the implementation fully covers the spec. Checks every scenario has a test, every business rule is enforced, and no behavior is undocumented. Returns a compliance report."
agent: agent
tools: [read, search]
argument-hint: "Feature name or path to .feature file (e.g. specs/features/user-login.feature)"
---

Perform a spec compliance review for:

${input}

## Steps

1. Read `specs/features/<name>.feature`
2. Read `specs/technical/<name>-spec.md` if it exists
3. Find the test file(s) for this feature (search for header comment or file naming conventions)
4. Find the implementation file(s) exercised by those tests

### Check 1: Scenario Coverage

For each scenario in the feature file, determine:

- Does a test exist for this scenario?
- Does the test actually exercise the described behavior?
- Would the test **fail** if the production code for that behavior were removed?

### Check 2: Business Rule Enforcement

For each business rule in the technical spec:

- Is the rule enforced in the production code?
- Is the rule tested by at least one scenario?

### Check 3: Uncovered Behavior

For non-trivial logic in the production code:

- Is it exercised by a scenario?
- If not, flag it as potentially undocumented behavior

### Report Format

Return a structured compliance report:

```markdown
## Spec Compliance: <Feature Name>

**Result**: ✅ Compliant | ⚠️ Partial | ❌ Non-compliant

### Scenario Coverage

| Scenario | Tag    | Test Exists | Tests Behavior | Would Catch Regression |
| -------- | ------ | ----------- | -------------- | ---------------------- |
| "..."    | @smoke | ✅          | ✅             | ✅                     |

### Business Rule Compliance

| Rule   | Enforced | Tested |
| ------ | -------- | ------ |
| 1. ... | ✅       | ✅     |

### Gaps

- ...

### Recommendations

- ...
```
