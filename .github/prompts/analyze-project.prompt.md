---
description: "Analyze a project to detect its language, test framework, linter, formatter, build system, and conventions. Use before starting ATDD in a new or existing project."
agent: agent
tools: [read, search, execute]
argument-hint: "Optional: path to the project root (defaults to workspace root)"
---

Analyze this project and produce a project profile.

## Steps

1. **Language and package manager**: Search for `package.json`, `pyproject.toml`, `*.csproj`,
   `go.mod`, `Cargo.toml`, `Gemfile`, `pom.xml`, `build.gradle`, `composer.json`, `mix.exs`,
   `pubspec.yaml`, `Package.swift`. Check for lock files (`yarn.lock`, `pnpm-lock.yaml`,
   `poetry.lock`, `bun.lockb`).

2. **Test framework**: Check package dependencies, config files, and scan for existing test files
   to detect the framework AND the directory/naming conventions being used.

3. **Linter**: Check for ESLint, Biome, Ruff, Flake8, RuboCop, golangci-lint, Clippy configs.

4. **Formatter**: Check for Prettier, Black, Ruff format, rustfmt, gofmt configs.

5. **Type checker**: Check for `tsconfig.json`, mypy, pyright configs.

6. **Build system**: Check `scripts.build` in `package.json`, `Makefile`, `*.csproj`, `go.mod`,
   `Cargo.toml`, `pom.xml`, `build.gradle`.

7. **CI/CD**: Check for `.github/workflows/`, `.gitlab-ci.yml`, `Jenkinsfile`,
   `.circleci/config.yml`, `azure-pipelines.yml`.

8. **Directory structure**: Identify `src/`, `lib/`, `test/`, `tests/`, `__tests__/`, `spec/`
   directories and any existing `specs/` directory.

9. **Git**: Check default branch, `.gitignore`, conventional commits config.

10. **Greenfield detection**: If no project files are found (empty repo or docs only), this is a
    greenfield project. Prompt the user for their tooling preferences in a **single prompt**:

    **Required** (always ask):
    - Language/runtime (TypeScript, Python, C#/.NET, Go, Rust, Java, Ruby, etc.)
    - Test framework (e.g., Jest vs Vitest vs Mocha, xUnit vs NUnit vs MSTest, pytest vs unittest)
    - Package manager (e.g., npm vs pnpm vs yarn, pip vs poetry vs uv)

    **Optional** (ask unless the user has already specified):
    - Linter (e.g., ESLint vs Biome, Ruff vs Flake8)
    - Formatter (e.g., Prettier vs Biome, Black vs Ruff format)
    - Directory structure (`src/` + `tests/`, co-located tests, etc.)
    - CI/CD platform (GitHub Actions, GitLab CI, or none)

    If the user says "pick defaults," choose the most common tooling for the language.
    Record all choices in the project profile output.

    Do NOT set up config files or install packages yet — that happens after the spec is approved.

## Output

Write the profile to **`docs/project-profile.md`** (create the file, overwriting any existing
version), then print it to chat so the user can see it.

The file must contain exactly:

```markdown
## Project Profile

| Category          | Detected |
| ----------------- | -------- |
| Language          | ...      |
| Package manager   | ...      |
| Test framework    | ...      |
| Test command      | `...`    |
| Test directory    | ...      |
| Test file pattern | ...      |
| Linter            | ...      |
| Lint command      | `...`    |
| Lint fix command  | `...`    |
| Formatter         | ...      |
| Format command    | `...`    |
| Type checker      | ...      |
| Type check cmd    | `...`    |
| Build command     | `...`    |
| CI platform       | ...      |
| Source dir        | ...      |
| Specs dir         | ...      |

### Quality Gates Available

- [x] Tests: `<command>`
- [x] Lint: `<command>`
- [ ] Format: not detected
- [x] Type check: `<command>`
- [x] Build: `<command>`

### Conventions Detected

- Test naming: `*.test.ts`
- Import style: ES modules with path aliases
- Code style: semicolons, single quotes
```

Saving to `docs/project-profile.md` means subsequent prompts (`/write-acceptance-tests`,
`/run-quality-gates`, etc.) can read it directly instead of re-detecting the stack from scratch.

Reference: `docs/atdd/project-detection.md`
