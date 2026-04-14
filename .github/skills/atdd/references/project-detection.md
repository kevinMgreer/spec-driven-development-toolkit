# Project Detection

How to analyze any project — greenfield or legacy — to discover its language, frameworks,
test runner, linter, formatter, build system, and conventions. This is the first step when
the toolkit is used in a new repository.

---

## Detection Procedure

Run these checks in order. Each check builds on the previous findings.

### Step 1 — Language and Package Manager

| Indicator                                   | Language      | Package manager         |
| ------------------------------------------- | ------------- | ----------------------- |
| `package.json`                              | JavaScript/TS | npm / yarn / pnpm / bun |
| `yarn.lock`                                 | JS/TS         | Yarn                    |
| `pnpm-lock.yaml`                            | JS/TS         | pnpm                    |
| `bun.lockb`                                 | JS/TS         | Bun                     |
| `tsconfig.json`                             | TypeScript    | (see `package.json`)    |
| `pyproject.toml` / `setup.py` / `setup.cfg` | Python        | pip / poetry / uv / pdm |
| `poetry.lock`                               | Python        | Poetry                  |
| `requirements.txt`                          | Python        | pip                     |
| `Pipfile`                                   | Python        | Pipenv                  |
| `*.csproj` / `*.sln`                        | C# / .NET     | dotnet / NuGet          |
| `go.mod`                                    | Go            | go mod                  |
| `Cargo.toml`                                | Rust          | Cargo                   |
| `Gemfile`                                   | Ruby          | Bundler                 |
| `pom.xml`                                   | Java          | Maven                   |
| `build.gradle` / `build.gradle.kts`         | Java/Kotlin   | Gradle                  |
| `mix.exs`                                   | Elixir        | Mix                     |
| `Package.swift`                             | Swift         | Swift PM                |
| `composer.json`                             | PHP           | Composer                |
| `pubspec.yaml`                              | Dart/Flutter  | pub                     |

If multiple languages are found, identify the primary language (most code) and note secondary ones.

### Step 2 — Test Framework

| Indicator                                   | Test framework | Run command             |
| ------------------------------------------- | -------------- | ----------------------- |
| `package.json` → `jest` in deps/devDeps     | Jest           | `npx jest` / `npm test` |
| `package.json` → `vitest` in deps/devDeps   | Vitest         | `npx vitest run`        |
| `package.json` → `mocha` in deps/devDeps    | Mocha          | `npx mocha`             |
| `package.json` → `@cucumber/cucumber`       | Cucumber.js    | `npx cucumber-js`       |
| `package.json` → `@playwright/test`         | Playwright     | `npx playwright test`   |
| `package.json` → `cypress`                  | Cypress        | `npx cypress run`       |
| `pyproject.toml` → `[tool.pytest]`          | pytest         | `pytest`                |
| `requirements.txt` with `pytest`            | pytest         | `pytest`                |
| `pyproject.toml` → `behave` or `behave.ini` | behave         | `behave`                |
| `*.csproj` → `NUnit` / `xUnit` / `MSTest`   | .NET test      | `dotnet test`           |
| `*.csproj` → `SpecFlow`                     | SpecFlow       | `dotnet test`           |
| `Gemfile` → `rspec`                         | RSpec          | `bundle exec rspec`     |
| `Gemfile` → `cucumber`                      | Cucumber-Ruby  | `bundle exec cucumber`  |
| `go.mod` (any Go project)                   | Go testing     | `go test ./...`         |
| `Cargo.toml`                                | Rust testing   | `cargo test`            |
| `pom.xml` → `junit` or `testng`             | JUnit / TestNG | `mvn test`              |

Also scan for existing test files to discover:

- Test directory conventions (e.g., `__tests__/`, `tests/`, `test/`, `spec/`, `*_test.go`)
- Test file naming patterns (e.g., `*.test.ts`, `*.spec.ts`, `test_*.py`, `*_test.py`)
- Import conventions and test utilities already in use

### Step 3 — Linter

| Indicator                                          | Linter           | Run command         |
| -------------------------------------------------- | ---------------- | ------------------- |
| `.eslintrc*` / `eslint.config.*` / deps → `eslint` | ESLint           | `npx eslint .`      |
| `biome.json` / `biome.jsonc`                       | Biome            | `npx biome check .` |
| `pyproject.toml` → `[tool.ruff]` or deps → `ruff`  | Ruff             | `ruff check .`      |
| `pyproject.toml` → `[tool.flake8]` or `.flake8`    | Flake8           | `flake8 .`          |
| `pyproject.toml` → `[tool.pylint]`                 | Pylint           | `pylint`            |
| `.rubocop.yml`                                     | RuboCop          | `rubocop`           |
| `.golangci.yml` / `.golangci.yaml`                 | golangci-lint    | `golangci-lint run` |
| `Cargo.toml`                                       | Clippy           | `cargo clippy`      |
| `phpcs.xml` / `phpstan.neon`                       | PHP CS / PHPStan | `phpcs` / `phpstan` |

### Step 4 — Formatter

| Indicator                               | Formatter | Check command                |
| --------------------------------------- | --------- | ---------------------------- |
| `.prettierrc*` / deps → `prettier`      | Prettier  | `npx prettier --check .`     |
| `biome.json`                            | Biome     | `npx biome format --check .` |
| `pyproject.toml` → `[tool.black]`       | Black     | `black --check .`            |
| `pyproject.toml` → `[tool.ruff.format]` | Ruff      | `ruff format --check .`      |
| `rustfmt.toml` / `.rustfmt.toml`        | rustfmt   | `cargo fmt -- --check`       |
| `go.mod`                                | gofmt     | `gofmt -l .`                 |

### Step 5 — Build System

| Indicator                              | Build command      |
| -------------------------------------- | ------------------ |
| `package.json` → `scripts.build`       | `npm run build`    |
| `tsconfig.json` (with no build script) | `npx tsc --noEmit` |
| `*.csproj`                             | `dotnet build`     |
| `go.mod`                               | `go build ./...`   |
| `Cargo.toml`                           | `cargo build`      |
| `pom.xml`                              | `mvn compile`      |
| `build.gradle` / `build.gradle.kts`    | `gradle build`     |
| `Makefile` with `build` target         | `make build`       |

### Step 6 — Source and Test Directory Structure

Scan the project to discover:

- **Source directory**: `src/`, `lib/`, `app/`, `pkg/`, `internal/`, or root-level source files
- **Test directory**: `test/`, `tests/`, `__tests__/`, `spec/`, or co-located with source
- **Config directory**: `config/`, `.config/`
- **Existing specs**: Check if `specs/` already exists

### Step 7 — CI/CD Pipeline

| File                      | Platform        |
| ------------------------- | --------------- |
| `.github/workflows/*.yml` | GitHub Actions  |
| `.gitlab-ci.yml`          | GitLab CI       |
| `Jenkinsfile`             | Jenkins         |
| `.circleci/config.yml`    | CircleCI        |
| `azure-pipelines.yml`     | Azure Pipelines |
| `bitbucket-pipelines.yml` | Bitbucket       |
| `.travis.yml`             | Travis CI       |

Read the CI config to understand what checks run on PRs — quality gates should match.

### Step 8 — Git and Branching

- Check for `.gitignore` (confirms Git)
- Check for branch protection rules (via CI config or README mentions)
- Detect default branch name (`main` vs `master` vs other)
- Check for conventional commits (`commitlint.config.*`, `.czrc`, `.commitlintrc.*`)

---

## Detection Output Format

After running detection, produce a summary:

```markdown
## Project Profile

| Category        | Detected                        |
| --------------- | ------------------------------- |
| Language        | TypeScript                      |
| Package manager | npm                             |
| Test framework  | Vitest                          |
| Test command    | `npx vitest run`                |
| Test directory  | `src/__tests__/`                |
| Linter          | ESLint                          |
| Lint command    | `npx eslint .`                  |
| Formatter       | Prettier                        |
| Format command  | `npx prettier --check .`        |
| Type checker    | TypeScript (`npx tsc --noEmit`) |
| Build command   | `npm run build`                 |
| CI platform     | GitHub Actions                  |
| Source dir      | `src/`                          |
| Specs dir       | `specs/` (created by toolkit)   |
```

---

## Handling Ambiguity

If multiple options are detected for the same category (e.g., both Jest and Vitest in deps):

1. Check `package.json` `scripts.test` — whatever `npm test` runs is the primary framework
2. Check which test files exist — if `*.test.ts` files exist, match that pattern
3. Check CI config — whatever CI runs is authoritative
4. If still ambiguous, ask the user (max 1 question per category)

---

## Greenfield Projects

If no project files are detected (empty repo or only docs), prompt the user for their preferences
before writing any specs or code. This is the **only time** for tooling decisions — once confirmed,
do not revisit unless the user asks.

### Required Preferences (always ask)

| Category         | Example choices                                                                          |
| ---------------- | ---------------------------------------------------------------------------------------- |
| Language/runtime | TypeScript, Python, C#/.NET, Go, Rust, Java, Ruby, etc.                                  |
| Test framework   | Jest vs Vitest vs Mocha, pytest vs unittest, xUnit vs NUnit vs MSTest, RSpec, Go testing |
| Package manager  | npm vs yarn vs pnpm vs bun, pip vs poetry vs uv, NuGet, Cargo, etc.                      |

### Optional Preferences (ask if the user hasn't specified)

| Category            | Example choices                                                 |
| ------------------- | --------------------------------------------------------------- |
| Linter              | ESLint vs Biome, Ruff vs Flake8, RuboCop, golangci-lint, Clippy |
| Formatter           | Prettier vs Biome, Black vs Ruff format, rustfmt, gofmt         |
| Directory structure | `src/` + `tests/`, co-located tests, `lib/` + `spec/`, monorepo |
| Code style          | Semicolons/no semicolons, tabs/spaces, single/double quotes     |
| CI/CD platform      | GitHub Actions, GitLab CI, none for now                         |

### How to Ask

Present all preference questions **in a single prompt** as a concise checklist. Do not ask one
question at a time. Example:

> Before we start, I need a few preferences for your new project:
>
> 1. **Language**: TypeScript, Python, C#, Go, or something else?
> 2. **Test framework**: (depends on language — e.g., Jest vs Vitest for TS, xUnit vs NUnit for .NET)
> 3. **Package manager**: (depends on language — e.g., npm vs pnpm for JS/TS)
> 4. **Linter/formatter**: Any preference, or should I pick sensible defaults?
> 5. **Project structure**: `src/` + `tests/`, co-located tests, or other?

If the user says "just pick defaults" or similar, choose the most common/recommended tooling
for the language and note the choices in the project profile.

### After Preferences are Confirmed

1. Record all choices in the project profile
2. Set up minimum viable config files (e.g., `package.json`, `tsconfig.json`, `.eslintrc`)
3. Do NOT install packages or run init commands until the spec is approved (Phase 1 gate)
4. Proceed to Phase 1 (Spec Writing)

---

## Related

- [Quality Gates](./quality-gates.md) — how detected tools become automated gates
- [Legacy Integration](./legacy-integration.md) — special considerations for existing projects
- [ATDD Workflow](./workflow.md) — where project detection fits in the cycle
