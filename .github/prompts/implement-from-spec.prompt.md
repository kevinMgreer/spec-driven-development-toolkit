---
description: "Implement production code to make failing acceptance tests pass. Works scenario by scenario in priority order. Only adds code that tests require. Never modifies test files."
agent: agent
tools: [read, edit, search, execute]
argument-hint: "Feature name or path to .feature file (e.g. specs/features/user-login.feature)"
---

Implement the production code needed to make the failing acceptance tests pass for:

${input}

## Steps

1. Read the `.feature` file and `specs/technical/<name>-spec.md`

2. **Check whether acceptance tests exist** — search for a test file that references the feature
   (look for the header comment `// Spec: specs/features/<name>.feature` or equivalent).

   **If no test file exists** — stop and run `/write-acceptance-tests` first:
   - Invoke `/write-acceptance-tests ${input}` to generate, run, and confirm red stubs
   - Do not proceed with implementation until every stub fails for the right reason
   - Return here once stubs are confirmed red

   **If test file(s) exist** — read them in full before writing any code:
   - Open every file that references the feature spec
   - Understand the assertion structure, helpers, and setup — implementation must satisfy the
     assertions as written, not just pass runner output

3. Run the current tests to see which are failing and why
4. Implement in priority order: `@smoke` → `@happy-path` → `@edge-case` → `@error`

5. For each scenario:
   a. Read the scenario carefully — understand the expected behavior
   b. Write the **minimum** code that makes this scenario's test pass
   c. Run the test — if green, move to the next scenario
   d. If a test fails unexpectedly, diagnose and fix before moving on

6. **Rules** (enforced strictly):
   - Do NOT write code not required by a failing test
   - Do NOT modify test files — fix the implementation
   - Do NOT implement `@wip`-tagged scenarios
   - Do NOT add error handling for cases not covered by an `@error` scenario

7. When all non-`@wip` scenarios are green, report:
   - Which files were created and modified
   - How many scenarios went from red to green
   - Any `@wip` scenarios skipped (and their descriptions)
