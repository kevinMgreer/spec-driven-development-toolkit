---
description: Generate a Gherkin feature file and paired technical spec from requirements or a user story. Creates specs/features/<name>.feature and specs/technical/<name>-spec.md, then waits for explicit user approval.
argument-hint: "<feature description, requirements, or user story>"
---

Write a complete spec for the following feature or requirement:

$ARGUMENTS

Use the **spec-writer** subagent if available; otherwise follow the steps below directly.

## Steps

1. **Read `docs/project-profile.md` — mandatory.** Note the public API style, error format,
   naming conventions, and domain vocabulary. If the profile does not exist, **stop** and run
   `/analyze-project` first — specs that don't match repo vocabulary cause drift.
2. Search `specs/` for any related existing specs (context and step vocabulary reuse)
3. Search the codebase for relevant domain terms, existing entities, and naming conventions
4. Create `specs/features/<kebab-case-name>.feature` with:
   - Feature block: `As a / I want / So that`
   - Background block for shared preconditions (only if they apply to all scenarios)
   - Scenario coverage:
     - **1** `@smoke` scenario (single most critical happy path)
     - **1–2** `@happy-path` scenarios (primary success flows)
     - **2–4** `@edge-case` scenarios (boundaries, unusual-but-valid inputs)
     - **2–3** `@error` scenarios (invalid input, unauthorized, system failure)
   - Use `Scenario Outline` for data-driven variations
5. Create `specs/technical/<kebab-case-name>-spec.md` with:
   - Overview and scope (in-scope / out-of-scope)
   - Business rules (numbered, each with an example)
   - API contract (if applicable)
   - Data constraints table
   - Dependencies

Follow `docs/atdd/gherkin.md` and `docs/atdd/spec-writing.md`. Templates:
`docs/atdd/templates/feature.template.md` and `docs/atdd/templates/tech-spec.template.md`.

After creating the spec files, present them to the user and ask:
_"Do these specs look correct? Any changes before I proceed?"_

**Do not generate tests or implementation code.** The spec must be explicitly approved by the user
before the next phase begins. If the user requests changes, update and re-present until approved.

Report: paths created, scenario count by tag, any assumptions made.
