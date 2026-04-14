# Legacy Integration Guide

How to integrate the ATDD toolkit into an existing project — whether it has AI tooling or not,
regardless of language, framework, age, or test coverage.

---

## Principles

1. **Respect what exists** — don't overwrite or restructure existing conventions
2. **Add, don't replace** — the toolkit adds `specs/` and `docs/atdd/`; it doesn't move tests or change src layout
3. **Adapt to the project** — use the project's existing test framework, linter, and directory structure
4. **Coexist with existing tests** — new acceptance tests live alongside existing unit/integration tests
5. **Gradual adoption** — start with one feature; don't try to retrofit the entire codebase

---

## Integration Steps

### 1. Run Project Detection

Use `/analyze-project` to discover the project's stack. See [Project Detection](./project-detection.md).

### 2. Add Toolkit Files

Copy only the platform-specific config you need, plus `docs/atdd/` and `specs/`:

```
your-project/
├── .github/            ← VS Code config (merge with existing .github/)
├── .cursor/            ← Cursor config (if using Cursor)
├── .kiro/              ← Kiro config (if using Kiro)
├── docs/atdd/          ← ATDD knowledge base (NEW)
├── specs/              ← Spec files (NEW)
│   ├── features/
│   └── technical/
├── AGENTS.md           ← Add or merge (if already exists)
├── CLAUDE.md           ← Add or merge (if already exists)
├── src/                ← EXISTING — do not touch
├── tests/              ← EXISTING — do not touch
└── ...
```

### 3. Handle Merge Conflicts

If the target project already has some of these files:

| File exists               | Strategy                                                      |
| ------------------------- | ------------------------------------------------------------- |
| `.github/` has workflows  | Add toolkit files alongside — don't modify existing workflows |
| `AGENTS.md` exists        | Append ATDD rules section to existing file                    |
| `CLAUDE.md` exists        | Append ATDD rules section to existing file                    |
| `docs/` exists            | Create `docs/atdd/` subdirectory — don't conflict with other docs |
| `specs/` exists           | Use existing directory — add `features/` and `technical/` if missing |
| `.eslintrc` exists        | Use it — don't create a new one                               |
| Test config exists        | Use it — generate tests compatible with existing framework    |

### 4. Match Existing Conventions

When generating test stubs or implementation code, match:

- **File naming**: If tests use `*.spec.ts`, generate `*.spec.ts`, not `*.test.ts`
- **Directory structure**: If tests are in `__tests__/`, put acceptance tests there too
- **Import style**: If the project uses path aliases (`@/`), use the same aliases
- **Code style**: If the project uses semicolons, use semicolons. If tabs, tabs.
- **Test utilities**: If the project has test helpers, fixtures, or factories — use them

### 5. Create an Acceptance Test Directory (Optional)

For larger projects, you may want a dedicated directory for ATDD acceptance tests to keep them
separate from existing unit/integration tests:

```
tests/
├── unit/              ← existing
├── integration/       ← existing
└── acceptance/        ← NEW — toolkit-generated acceptance tests
```

Or co-locate them with the naming convention:

```
tests/
├── user.test.ts               ← existing unit test
├── user.acceptance.test.ts    ← NEW acceptance test
```

Use whatever convention the team prefers — the toolkit adapts.

---

## Common Legacy Scenarios

### Project with no tests

1. Set up a test framework based on the project's language
2. Start the ATDD cycle normally — the first feature is also the first test
3. Add test runner to `package.json` scripts (or equivalent)

### Project with unit tests but no acceptance tests

1. Keep existing unit tests as-is
2. Add acceptance tests in a new directory or with a distinguishing naming convention
3. Configure test runner to include both unit and acceptance test paths

### Project with existing Cucumber/Gherkin

1. Use the existing Cucumber setup — don't create a new one
2. Add new `.feature` files to the project's existing feature directory
3. Follow the existing step definition patterns and directory structure
4. Add `specs/technical/` for technical specs (Gherkin projects rarely have this)

### Project with CI/CD

1. Read the CI config to understand existing checks
2. Ensure quality gates cover (at minimum) what CI already checks
3. New tests should run in the same CI pipeline — add test paths if needed
4. The toolkit does not create or modify CI configuration

### Project using different AI tools (Copilot, Cursor, etc.)

1. Merge carefully — don't overwrite existing AI instructions
2. If the project already has `copilot-instructions.md`, append the ATDD rules
3. If the project already has Cursor rules, add ATDD rules as new `.mdc` files
4. The toolkit's ATDD rules coexist with existing AI instructions

### Monorepo

1. Run project detection for each package/service
2. Place `specs/` at the monorepo root or in each package, depending on team preference
3. Quality gates run per-package using the package's own tooling
4. Shared `docs/atdd/` at the root level

---

## What NOT to Do

- Don't delete or rename existing test files
- Don't restructure the `src/` directory
- Don't change the CI pipeline
- Don't update existing test configurations to use Cucumber if the project doesn't use it
- Don't force a test framework the project doesn't already use (unless there's no test framework at all)
- Don't modify `.gitignore` (unless adding genuinely new patterns like `specs/drafts/`)

---

## Gradual Rollout Strategy

For large legacy projects, roll out the toolkit incrementally:

1. **Week 1**: Install toolkit files, run project detection, write spec for one small new feature
2. **Week 2**: Run the full ATDD cycle for that feature — validate the workflow works
3. **Ongoing**: Use ATDD for all new features; gradually add specs for critical existing features
4. **Never**: Retroactively spec the entire codebase — only spec things when they change

---

## Related

- [Project Detection](./project-detection.md) — how to analyze the target project
- [Quality Gates](./quality-gates.md) — how detected tools become automated checks
- [ATDD Workflow](./workflow.md) — the full development cycle
