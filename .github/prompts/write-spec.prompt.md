---
description: "Generate a Gherkin feature file and paired technical spec from requirements or a user story. Creates specs/features/<name>.feature and specs/technical/<name>-spec.md."
agent: agent
tools: [read, edit, search]
argument-hint: "Describe the feature or paste requirements / user story"
---

Write a complete spec for the following feature or requirement:

${input}

## Steps

1. Search `specs/` for any related existing specs (context and step vocabulary reuse)
2. Search the codebase for relevant domain terms, existing entities, and naming conventions
3. Create `specs/features/<kebab-case-name>.feature` with:
   - Feature block: `As a / I want / So that`
   - Background block for shared preconditions (only if they apply to all scenarios)
   - Scenario coverage:
     - **1** `@smoke` scenario (single most critical happy path)
     - **1–2** `@happy-path` scenarios (primary success flows)
     - **2–4** `@edge-case` scenarios (boundaries, unusual-but-valid inputs)
     - **2–3** `@error` scenarios (invalid input, unauthorized, system failure)
   - Use `Scenario Outline` for data-driven variations
4. Create `specs/technical/<kebab-case-name>-spec.md` with:
   - Overview and scope (in-scope / out-of-scope)
   - Business rules (numbered, each with an example)
   - API contract (if applicable)
   - Data constraints table
   - Dependencies

Follow the [Gherkin conventions](../instructions/gherkin.instructions.md) and
[spec writing guidelines](../instructions/spec-writing.instructions.md).

After creating the spec files, present them to the user and ask:
_"Do these specs look correct? Any changes before I proceed?"_

**Do not generate tests or implementation code.** The spec must be explicitly approved by the user
before the next phase begins. If the user requests changes, update and re-present until approved.

Report: paths created, scenario count by tag, any assumptions made.
