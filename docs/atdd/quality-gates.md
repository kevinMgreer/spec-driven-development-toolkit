# Quality Gates

Automated checks that must pass at defined points in the ATDD cycle. Quality gates run
automatically — the agent iterates until all gates pass before proceeding to the next phase.

---

## When Quality Gates Run

| Phase                    | Gate                                         | Pass criteria                               |
| ------------------------ | -------------------------------------------- | ------------------------------------------- |
| After test stubs (Red)   | **Stubs fail correctly**                     | All stubs red for "not implemented" reasons |
| After each scenario      | **Incremental test**                         | Target scenario green, no regressions       |
| After all scenarios      | **Full test suite**                          | All non-`@wip` scenarios green              |
| Before refactor          | **Lint + format + typecheck + build + test** | All pass                                    |
| After each refactor step | **Full test suite**                          | All tests still green                       |
| Before PR                | **All gates**                                | Every gate below passes                     |

---

## Gate Definitions

### 1. Tests

Run the project's test suite. All non-`@wip` acceptance tests must pass, plus any pre-existing
tests in the project.

**Detection**: See [Project Detection](./project-detection.md) for how to find the test command.

### 2. Lint

Run the project's linter with the existing configuration. Fix all auto-fixable issues. Report
any remaining issues for manual resolution.

**Detection**:

| Indicator                                             | Linter                |
| ----------------------------------------------------- | --------------------- |
| `package.json` → `eslint` or `scripts.lint`           | ESLint                |
| `.eslintrc*` / `eslint.config.*`                      | ESLint                |
| `pyproject.toml` → `[tool.ruff]` or `[tool.flake8]`   | Ruff, Flake8          |
| `.rubocop.yml`                                        | RuboCop               |
| `*.csproj` with analyzers                             | .NET Analyzers        |
| `golangci-lint` config or `Makefile` with lint target | golangci-lint         |
| No linter found                                       | Skip gate (warn user) |

### 3. Format

Check code formatting against the project's formatter configuration.

**Detection**:

| Indicator                                          | Formatter       |
| -------------------------------------------------- | --------------- |
| `.prettierrc*` / `package.json` → `prettier`       | Prettier        |
| `pyproject.toml` → `[tool.black]` or `[tool.ruff]` | Black, Ruff     |
| `.editorconfig`                                    | EditorConfig    |
| `rustfmt.toml` / `.rustfmt.toml`                   | rustfmt         |
| `gofmt` / `goimports`                              | Go format tools |
| No formatter found                                 | Skip gate       |

### 4. Type Check

Run static type checking where the project uses it.

**Detection**:

| Indicator                                            | Type checker  |
| ---------------------------------------------------- | ------------- |
| `tsconfig.json`                                      | TypeScript    |
| `pyproject.toml` → `[tool.mypy]` or `[tool.pyright]` | mypy, pyright |
| `*.csproj` (C# is always typed)                      | .NET compiler |
| `go.mod` (Go is always typed)                        | Go compiler   |
| No type checker found                                | Skip gate     |

### 5. Build

Compile or build the project to verify no build errors.

**Detection**:

| Indicator                           | Build command                  |
| ----------------------------------- | ------------------------------ |
| `package.json` → `scripts.build`    | `npm run build` / `yarn build` |
| `tsconfig.json` (no build script)   | `npx tsc --noEmit`             |
| `*.csproj`                          | `dotnet build`                 |
| `go.mod`                            | `go build ./...`               |
| `Cargo.toml`                        | `cargo build`                  |
| `Makefile` with `build` target      | `make build`                   |
| `pom.xml`                           | `mvn compile`                  |
| `build.gradle` / `build.gradle.kts` | `gradle build`                 |
| No build step found                 | Skip gate                      |

---

## Gate Execution Strategy

### Iteration Loop

When a quality gate fails:

1. Read the error output carefully
2. Diagnose the root cause
3. Fix the issue (in production code — never in tests)
4. Re-run the failing gate
5. If the gate passes, run all gates to check for regressions
6. Repeat until all gates pass

### Maximum Iterations

Set a practical limit to avoid infinite loops:

- Per-gate retry limit: **3 attempts**
- If a gate still fails after 3 fix attempts, report the issue to the user with:
  - The exact error output
  - What was tried
  - A recommended manual fix

### Parallel vs Sequential

Run independent gates in parallel where possible:

```
lint ──┐
format ─┤──► all pass? ──► tests
type ───┤
build ──┘
```

Lint, format, type check, and build can run in parallel. Tests run after all others pass.

---

## Adapting to the Target Project

Quality gates adapt to whatever the target project has. The agent:

1. Runs project detection (see [Project Detection](./project-detection.md))
2. Records which gates are available
3. Only enforces gates that the project supports
4. Warns when no gates are found for a category

A project with no linter still passes the lint gate (with a warning).
A project with no build step still passes the build gate.
Tests are the only mandatory gate — every project must have tests.

---

## CI/CD Integration

If the project has CI/CD configuration, quality gates should match what CI checks:

| CI file                   | Platform        |
| ------------------------- | --------------- |
| `.github/workflows/*.yml` | GitHub Actions  |
| `.gitlab-ci.yml`          | GitLab CI       |
| `Jenkinsfile`             | Jenkins         |
| `.circleci/config.yml`    | CircleCI        |
| `azure-pipelines.yml`     | Azure Pipelines |
| `bitbucket-pipelines.yml` | Bitbucket       |

Read the CI config to understand what the pipeline checks. Ensure local quality gates cover
(at minimum) the same checks so the PR won't fail in CI.

---

## Related

- [Project Detection](./project-detection.md) — how tools and frameworks are discovered
- [ATDD Workflow](./workflow.md) — where quality gates fit in the cycle
- [Legacy Integration](./legacy-integration.md) — adapting gates for existing projects
