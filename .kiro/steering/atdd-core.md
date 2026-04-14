---
inclusion: always
---

# Spec-Driven ATDD — Core Rules

This project uses **spec-first ATDD**. These rules apply to every feature, in every session.
The toolkit is **language-agnostic** and **platform-agnostic** — it works in any project.

## Non-Negotiable Rules

- **Never write production code** before acceptance tests exist and are failing (red)
- **Never modify tests** to make them pass — fix the implementation instead
- **Never add logic** not required by a failing test
- **Always update the spec first** when requirements change, then tests, then code
- **Always confirm tests are red** _for the right reason_ before implementing (not due to broken imports or misconfiguration)
- **Always run project detection** before generating code in a new repository
- **Always run quality gates** (lint, format, typecheck, build, test) before declaring a phase complete
- **Never proceed past spec without explicit user approval** — this is the mandatory human gate
- **Always prompt for tooling preferences** in greenfield projects before writing specs

## Where Specs Live

```
specs/
├── features/       # Gherkin .feature files  — behavior, business-facing
└── technical/      # Markdown technical specs — rules, API contracts, constraints
```

## The Cycle

```
Analyze → Spec → Tests (Red) → Implementation (Green) → Quality Gates → Refactor → Review → PR
```

For the full procedure, see: `docs/atdd/workflow.md`
For quality gates: `docs/atdd/quality-gates.md`
For project detection: `docs/atdd/project-detection.md`
