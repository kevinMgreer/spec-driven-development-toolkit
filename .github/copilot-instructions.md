# Spec-Driven ATDD Development

This project uses **Spec-Driven ATDD** (Acceptance Test-Driven Development): all features must be
specified and acceptance-tested before any implementation begins. The toolkit is language-agnostic
and platform-agnostic — it works in any project regardless of language, framework, or existing setup.

## Core Rule

> Never write production code unless a failing acceptance test requires it.

## Directory Structure

```
specs/
├── features/     # Gherkin .feature files (business-facing scenarios)
└── technical/    # Markdown technical specs (API contracts, business rules)
```

## The ATDD Cycle

**Analyze → Spec → Tests (Red) → Implement (Green) → Quality Gates → Refactor → Review → PR**

1. **Analyze**: Detect language, test framework, linter, formatter, build system, conventions
2. **Spec First**: Write `specs/features/<name>.feature` and `specs/technical/<name>-spec.md`
3. **Acceptance Tests**: Generate test stubs — run them to confirm they are **red**
4. **Implement**: Write the minimum code to go **green**
5. **Quality Gates**: Run lint, format, typecheck, build, test — iterate until all pass
6. **Refactor**: Clean up while keeping tests green
7. **Review**: Verify all spec scenarios are covered
8. **PR**: Create branch, commit, push, open PR (optional)

## Rules for Agents

- Always run project detection before generating code in a new repository
- For greenfield projects, prompt the user for tooling preferences (language, test framework, package manager) before writing specs
- Always check `specs/` before implementing any feature
- If a spec does not exist, write it before proceeding
- **Never proceed past spec without explicit user approval** — this is the mandatory human gate
- If the user requests spec changes, update and re-present until approved
- Reference the spec in test files: `// Spec: specs/features/<name>.feature`
- Never modify tests to make them pass — fix the implementation
- Tags mark scenario priority: `@smoke` → `@happy-path` → `@edge-case` → `@error`
- Run quality gates (lint, format, typecheck, build, test) before declaring a phase complete
- Match existing project conventions (test patterns, code style, directory structure)

## Workflow Agents & Prompts

- `@atdd-cycle` — Full automated cycle from requirements to verified, quality-gated implementation
- `@spec-writer` — Write Gherkin features and technical specs from requirements
- `@spec-reviewer` — Validate implementation against spec
- `/analyze-project` — Detect project language, frameworks, tools, and conventions
- `/write-spec` — Generate spec from requirements
- `/write-acceptance-tests` — Generate test code from a spec file
- `/implement-from-spec` — Implement code to make failing tests pass
- `/run-quality-gates` — Run all quality gates and iterate until passing
- `/verify-spec-coverage` — Check spec compliance
- `/refactor-passing-tests` — Safe refactor after green
- `/create-pull-request` — Create branch, commit, push, open PR
- `/address-review-comments` — Handle PR review feedback

## Full Documentation

All ATDD workflow knowledge is in `docs/atdd/`:

| Document                          | Contents                                     |
| --------------------------------- | -------------------------------------------- |
| `docs/atdd/workflow.md`           | Complete ATDD cycle procedure                |
| `docs/atdd/quality-gates.md`      | Quality gate definitions and execution       |
| `docs/atdd/project-detection.md`  | Language/framework detection for any project |
| `docs/atdd/legacy-integration.md` | Integrating into existing projects           |
| `docs/atdd/spec-writing.md`       | Spec writing guide                           |
| `docs/atdd/gherkin.md`            | Gherkin conventions                          |
| `docs/atdd/checklist.md`          | Per-feature tracking checklist               |
| `docs/atdd/templates/`            | Feature and tech-spec templates              |
