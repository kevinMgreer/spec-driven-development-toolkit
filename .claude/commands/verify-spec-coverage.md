---
description: Hard spec & doc sync gate. Verifies every scenario has a test, every business rule is enforced, and the spec / README / project profile match the implementation. Fixes any drift in-place — does not just report it.
argument-hint: "<feature name or path to .feature file>"
---

Run the **Spec & Doc Sync hard gate** for:

$ARGUMENTS

This command does more than report — it **fixes drift in-place** so the spec, README, and
project profile match what the code now does. The cycle is not done until this gate passes.

Use the **spec-reviewer** subagent for the read-only compliance review (sub-phase A), then
apply the repairs yourself.

## Steps

1. Read `specs/features/<name>.feature`.
2. Read `specs/technical/<name>-spec.md` if it exists.
3. Find the test file(s) for this feature (search for the header comment
   `// Spec: specs/features/<name>.feature` or equivalent, or files named after the feature).
4. Find the implementation file(s) exercised by those tests.

---

### Sub-phase A — Spec Compliance Check

For every scenario in the feature file, determine:

- Does a test exist for this scenario?
- Does the test actually exercise the described behavior (not just named after it)?
- Would the test **fail** if the production code for that behavior were removed?

For every numbered business rule in the technical spec:

- Is the rule enforced in the production code?
- Is the rule covered by at least one scenario whose test would catch a violation?

For non-trivial logic in the production code:

- Is it exercised by a scenario?
- If not, treat it as **drift** (sub-phase B).

---

### Sub-phase B — Spec Drift Repair (mandatory if A fails)

For each gap or drift item found in sub-phase A, **fix it now**:

| Drift type                                                  | Repair action                                                                                                     |
| ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Implementation supports inputs/outputs not in any scenario  | Add an `@edge-case` or `@happy-path` scenario describing the behavior, add a test, confirm it passes              |
| A business rule was relaxed/tightened during implementation | Update the rule in `specs/technical/<name>-spec.md`, add or adjust the scenario, confirm test catches regression  |
| Validation messages, status codes, error shapes differ      | Update the spec to match the code (or update the code to match the spec — ask the user only if ambiguous)         |
| New edge case handled but no `@edge-case` scenario          | Add the scenario and test                                                                                          |
| Scenario exists but no test                                 | Add the test, confirm it passes                                                                                    |
| Test exists but is shallow (passes against a no-op)         | Strengthen the assertion so it would catch a regression                                                            |

After each repair, re-run the affected tests. After all repairs, re-run the full test suite.

---

### Sub-phase C — Documentation Sync (mandatory)

Read `docs/project-profile.md` and walk the **`Sources consulted`** list. For every doc listed
there that could describe the changed behavior, either update it or mark it ⏭️ with reason.
Do not create new doc files unless the user explicitly asks.

Work through them in this order:

1. **`README.md`** — if the feature is user-visible, confirm the feature list, usage examples,
   configuration table, environment variables, or CLI flags are accurate. Update them now if not.
2. **`CONTRIBUTING.md`** — if the change affects how contributors build, test, or submit work
   (new commands, new gates, changed conventions), update it.
3. **`ARCHITECTURE.md` / `docs/architecture.md`** — if a new module, layer, or integration
   pattern was introduced, record it here.
4. **`docs/adr/` or `docs/decisions/`** — if an architectural decision was made that isn't
   already captured, add a new ADR. Never silently diverge from an existing ADR.
5. **Style guides, coding standards, or runbooks** — if a new pattern was established that
   future contributors should follow, record it in whichever doc the project uses.
6. **`docs/project-profile.md`** — update the `Conventions`, `Reference Files`, or
   `Anti-patterns to avoid in this repo` sections if Phase 3 introduced anything new.
7. **Any other doc in `Sources consulted`** that describes the changed behavior — review it;
   update if stale.

For each source: confirm it is accurate, update it, or record N/A with a reason. Do not skip
sources silently. If the feature has no user-visible surface (internal refactor, infra change),
README sync is ⏭️ — note the reason in the report.

---

### Sub-phase D — Final Verification

After every repair and doc update:

1. Re-run the full test suite — must be green.
2. Re-run all available quality gates — must pass.

---

### Report Format

Return a structured **Spec & Doc Sync** report. The cycle is not done until every row is ✅
or has an explicit ⏭️ with a reason.

```markdown
## Spec & Doc Sync: <Feature Name>

**Result**: ✅ In sync | ❌ Repairs needed (still failing)

### Sub-phase A — Spec Compliance

| Scenario | Tag    | Test Exists | Tests Behavior | Would Catch Regression |
| -------- | ------ | ----------- | -------------- | ---------------------- |
| "..."    | @smoke | ✅          | ✅             | ✅                     |

| Rule    | Enforced | Tested |
| ------- | -------- | ------ |
| 1. ...  | ✅       | ✅     |

### Sub-phase B — Spec Drift Repaired

| Drift item | Repair action taken | Files changed                |
| ---------- | ------------------- | ---------------------------- |
| ...        | ...                 | `specs/features/...feature`  |

(or "⏭️ no drift found")

### Sub-phase C — Documentation Sync

| Doc                       | Status                                          |
| ------------------------- | ----------------------------------------------- |
| `README.md`               | ✅ Updated / ⏭️ not user-visible                |
| `CONTRIBUTING.md`         | ✅ Updated / ⏭️ no contributor impact           |
| `ARCHITECTURE.md`         | ✅ Updated / ⏭️ no structural change            |
| ADRs                      | ✅ Added ADR-N / ⏭️ no new decision             |
| Style guides / runbooks   | ✅ Updated / ⏭️ none                            |
| `docs/project-profile.md` | ✅ Updated / ⏭️ no changes                     |
| Other consulted docs      | ✅ \<files\> / ⏭️ none                          |

### Sub-phase D — Final Verification

- Tests: ✅ N/N passing
- Quality gates: ✅ all passing

### Remaining Issues

(empty — gate must not pass with remaining issues)
```

---

## Rules

- **Repair, don't just report.** If you find drift, fix it before producing the report.
- **Update the spec to match the code** unless the spec was clearly correct and the
  implementation is wrong. If ambiguous, ask the user one focused question.
- **Never modify tests** to mask drift — adjust the spec and the implementation, then add a
  test that would catch a regression.
- **Don't create new doc files** unless explicitly asked — only update what exists.
- The cycle is **not** done while any row in the report is unresolved.
