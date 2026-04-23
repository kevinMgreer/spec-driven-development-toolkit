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

### Step 9 — Conventions Discovery (mandatory for legacy projects)

Tooling alone is not enough — the agent must also understand **how this codebase is written**
so its output looks like it belongs. Skip this step only for empty greenfield projects.

Sample **2–4 representative source files** (a controller/handler, a service, a repository or
data-access file, and a test) and record the patterns you observe. Do not enumerate the entire
codebase — pick examples and extract patterns from them.

| Convention area    | What to look for                                                                                  |
| ------------------ | ------------------------------------------------------------------------------------------------- |
| Architecture style | Layered (controller/service/repo), hexagonal, MVC, vertical slice, modular monolith, microservice |
| Module layout      | Folder-by-feature vs folder-by-layer; barrel files; co-located vs separated tests                 |
| Dependency wiring  | Constructor DI, DI container, factory functions, plain imports, service locator                   |
| Error handling     | Exceptions vs Result/Either types; custom error classes; error mapping at boundaries              |
| Validation         | Where input is validated (controller, service, schema), what library (zod, joi, pydantic, etc.)   |
| Async patterns     | async/await, Promises, callbacks, channels, futures; cancellation conventions                     |
| Logging            | Library, log levels, correlation IDs, structured vs unstructured                                  |
| Configuration      | env vars, config files, secret management, runtime config objects                                 |
| Naming             | File names (kebab/camel/Pascal/snake), classes, functions, constants, test names                  |
| Public API style   | REST/GraphQL/gRPC/RPC; URL casing; status code conventions; pagination shape                      |
| Persistence style  | ORM/active record/data mapper/raw SQL; migration tool; transaction patterns                       |
| Comment style      | Doc comments (JSDoc/docstrings/XML doc), license headers, TODO/FIXME conventions                  |
| Commit conventions | Conventional Commits, prefixes (`feat:`/`fix:`/etc.), scopes, sign-off                            |
| Branch naming      | `feat/`, `feature/`, `fix/`, ticket prefixes (`ABC-123`)                                          |

For each item, record either the observed pattern or **"none detected"**. Do not invent a
convention that is not actually present in the code.

### Step 10 — Existing Project Documentation

If the project already has docs, **read them before finalizing the profile**. They often carry
context the code alone cannot reveal — architectural rationale, intentional patterns,
constraints, and the project's own vocabulary. In practice, start this pass early so the docs
can point you to canonical reference files to sample in Step 9 — but always complete it before
Step 11.

Look for these files (check if each exists, then read the ones that do):

| File / location                                       | What to extract                                                                         |
| ----------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `README.md` (or `README.rst`, `README.adoc`)          | Setup commands, scripts, project purpose, domain vocabulary, canonical example snippets |
| `CONTRIBUTING.md`                                     | Commit conventions, branch naming, PR process, local dev commands, review expectations  |
| `ARCHITECTURE.md` / `docs/architecture.md`            | Architecture style, module boundaries, dependency direction, intentional constraints    |
| `docs/adr/` or `docs/decisions/` (ADRs)               | Accepted architectural decisions (use these as authoritative — they beat code samples)  |
| `docs/` folder (any other top-level docs)             | Dev setup, deployment, domain glossary, runbooks, style guides                          |
| `.github/PULL_REQUEST_TEMPLATE.md` / `ISSUE_TEMPLATE` | PR/issue hygiene expectations, required checkboxes                                      |
| `CHANGELOG.md`                                        | Versioning scheme (SemVer? CalVer?), changelog format (Keep-a-Changelog?)               |
| `STYLE.md` / `STYLEGUIDE.md` / `CODING_STANDARDS.md`  | Explicit coding conventions that override inferred ones                                 |
| `SECURITY.md`                                         | Security constraints the agent must respect (e.g., no logging PII)                      |

How to use what you find:

1. **Commands in README override guesses.** If the README says `pnpm dev` or `make test`, that
   is the command — use it exactly, even if you also detected another option.
2. **ADRs and ARCHITECTURE.md are authoritative for the `Conventions` table.** If an ADR says
   "we use hexagonal architecture," record that, even if a sample file looks layered. Then flag
   the mismatch for the user.
3. **CONTRIBUTING.md beats inference for commit/branch conventions.** Do not guess Conventional
   Commits from 3 commit messages if CONTRIBUTING.md says otherwise.
4. **Domain vocabulary from README/docs → spec writing.** The Gherkin feature file and the
   technical spec must use the project's own terms (e.g., "order" vs "purchase", "customer" vs
   "client"). Note these terms in the profile so the spec-writer uses them.
5. **If docs conflict with code**, record both in the profile and note the conflict under
   `Anti-patterns to avoid in this repo` or a new `Known inconsistencies` subsection — do not
   silently pick one.
6. **If no docs exist**, record `none detected` under `Documentation sources consulted`. Do not
   invent rationale.

Record in the profile which files you read (see `Sources consulted` in the output template) so
the user can audit what informed the profile and future sessions know which docs to re-check.

### Step 11 — Finalize

Consolidate findings from Steps 1–10 into `docs/project-profile.md` using the output template
below. Prefer documentation over inference, code samples over guesses, and explicit user
statements over both.

---

## Detection Output Format

After running detection, write a complete profile to `docs/project-profile.md`. The profile has
**three required sections** — `Tooling`, `Conventions`, and `Reference Files`. The conventions
section is what makes the agent's output blend into the existing codebase; do not skip it.

```markdown
## Project Profile

_Last updated: <YYYY-MM-DD>_

### Tooling

| Category          | Detected                        |
| ----------------- | ------------------------------- |
| Language          | TypeScript                      |
| Package manager   | npm                             |
| Test framework    | Vitest                          |
| Test command      | `npx vitest run`                |
| Test directory    | `src/__tests__/`                |
| Test file pattern | `*.test.ts`                     |
| Linter            | ESLint                          |
| Lint command      | `npx eslint .`                  |
| Lint fix command  | `npx eslint . --fix`            |
| Formatter         | Prettier                        |
| Format command    | `npx prettier --check .`        |
| Format fix cmd    | `npx prettier --write .`        |
| Type checker      | TypeScript (`npx tsc --noEmit`) |
| Build command     | `npm run build`                 |
| CI platform       | GitHub Actions                  |
| Source dir        | `src/`                          |
| Specs dir         | `specs/` (created by toolkit)   |

### Quality Gates Available

- [x] Tests: `<command>`
- [x] Lint: `<command>`
- [ ] Format: not detected
- [x] Type check: `<command>`
- [x] Build: `<command>`

### Conventions

> Sampled from `<file 1>`, `<file 2>`, `<file 3>`. Update this section if new patterns emerge.

| Convention area    | Pattern in this codebase                                                 |
| ------------------ | ------------------------------------------------------------------------ |
| Architecture style | Layered: controller → service → repository                               |
| Module layout      | Folder-by-feature under `src/features/`; tests co-located                |
| Dependency wiring  | Constructor DI, manually composed in `src/composition-root.ts`           |
| Error handling     | Custom `AppError` subclasses; thrown from services; mapped in middleware |
| Validation         | `zod` schemas at controller boundary                                     |
| Async patterns     | `async`/`await` everywhere; no top-level `.then` chains                  |
| Logging            | `pino` structured logger; child loggers per module                       |
| Configuration      | `env-var` parsed at startup into typed `Config` object                   |
| Naming             | Files kebab-case; classes PascalCase; functions camelCase                |
| Public API style   | REST, JSON; kebab-case URLs; RFC 7807 problem+json errors                |
| Persistence style  | Prisma ORM; transactions via `prisma.$transaction`                       |
| Comment style      | JSDoc on public exports; no license headers                              |
| Commit conventions | Conventional Commits (`feat:`, `fix:`, `chore:`)                         |
| Branch naming      | `feat/<name>`, `fix/<name>`                                              |

### Reference Files

When implementing new code, mirror the patterns in:

- Controller example: `src/features/orders/orders.controller.ts`
- Service example: `src/features/orders/orders.service.ts`
- Repository example: `src/features/orders/orders.repository.ts`
- Test example: `src/features/orders/orders.service.test.ts`

### Anti-patterns to avoid in this repo

- Do not introduce a second DI container — the manual composition root is intentional.
- Do not use `try/catch` to translate errors inside services — let the middleware map them.
- Do not add new top-level folders without updating this profile.

### Sources consulted

_What informed this profile. Future sessions should re-check these for drift._

**Documentation:**

- `README.md` — setup commands, domain vocabulary
- `CONTRIBUTING.md` — Conventional Commits, `feat/<name>` branches
- `docs/adr/0003-layered-architecture.md` — authoritative for architecture style
- `ARCHITECTURE.md` — module boundary rules

**Code samples:**

- `src/features/orders/orders.controller.ts`
- `src/features/orders/orders.service.ts`
- `src/features/orders/orders.repository.ts`
- `src/features/orders/orders.service.test.ts`

**Other signals:**

- `.github/workflows/ci.yml` — CI gate commands
- `package.json` scripts
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
