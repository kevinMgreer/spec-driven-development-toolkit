## Project Profile

_Last updated: 2026-10-12_

### Tooling

| Category          | Detected                                                                       |
| ----------------- | ------------------------------------------------------------------------------ |
| Language          | Documentation/configuration toolkit; installer scripts use Bash and PowerShell |
| Package manager   | none detected                                                                  |
| Test framework    | none detected; standalone integration scripts                                  |
| Test command      | `bash tests/install-retired-paths.sh`; `.\tests\install-retired-paths.ps1`     |
| Test directory    | `tests/`                                                                        |
| Test file pattern | `install-retired-paths.{sh,ps1}`                                                |
| Linter            | none detected                                                                  |
| Lint command      | none detected                                                                  |
| Lint fix command  | none detected                                                                  |
| Formatter         | none detected                                                                  |
| Format command    | none detected                                                                  |
| Format fix cmd    | none detected                                                                  |
| Type checker      | none detected                                                                  |
| Build command     | none detected                                                                  |
| CI platform       | GitHub Actions                                                                 |
| Source dir        | Root-level installer scripts and toolkit configuration                         |
| Specs dir         | `specs/`                                                                       |

### Quality Gates Available

- [x] GitHub Actions checks mirrored skill documentation against canonical docs
- [x] GitHub Actions runs `bash -n install.sh`
- [x] GitHub Actions performs a full Bash install and verifies expected files
- [x] GitHub Actions verifies `--dry-run` leaves the target empty
- [x] Bash and PowerShell installer integration checks run in GitHub Actions
- [ ] Unit/acceptance test framework: not detected; install behavior uses standalone integration scripts
- [ ] Lint, format, type check, or build commands: not detected

### Conventions

> Sampled from `install.sh`, `install.ps1`, `.github/workflows/toolkit-ci.yml`, and `tests/install-retired-paths.sh`.

| Convention area    | Pattern in this codebase                                                                                                       |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| Architecture style | Standalone installer scripts orchestrate copying toolkit files into a target project                                           |
| Module layout      | Root-level install scripts; docs, specs, and platform adapters in dedicated directories                                        |
| Dependency wiring  | Shell functions within each installer; no external runtime dependencies observed                                               |
| Error handling     | Bash uses `set -euo pipefail`; PowerShell uses `$ErrorActionPreference = 'Stop'`; invalid target paths are reported            |
| Validation         | Bash validates CLI options and target directory; PowerShell uses `ValidateSet` and checks the target                           |
| Async patterns     | none detected                                                                                                                  |
| Logging            | Installer progress and dry-run actions are written to standard output                                                          |
| Configuration      | Installer behavior is controlled by command-line options and script-level path lists                                           |
| Naming             | Bash functions and variables use snake_case / uppercase constants; PowerShell functions use Verb-Noun and PascalCase variables |
| Public API style   | Command-line interfaces for Bash and PowerShell installers                                                                     |
| Persistence style  | Filesystem copy, merge, and targeted removal                                                                                   |
| Comment style      | Shell comments describe usage and non-obvious behavior                                                                         |
| Commit conventions | Recent history uses Conventional Commit-style prefixes; `CONTRIBUTING.md` does not specify a commit convention                 |
| Branch naming      | Current branch uses `fix/<name>`; no explicit repository rule detected                                                         |

### Reference Files

- Bash installer: `install.sh`
- PowerShell installer: `install.ps1`
- Installer integration checks: `tests/install-retired-paths.sh`, `tests/install-retired-paths.ps1`
- CI install checks: `.github/workflows/toolkit-ci.yml`
- Gherkin formatting conventions: `.github/instructions/gherkin.instructions.md`

### Sources consulted

**Documentation:**

- `README.md`
- `CONTRIBUTING.md`
- `SECURITY.md`
- `AGENTS.md`
- `docs/atdd/project-detection.md`
- `docs/atdd/workflow.md`

**Code and configuration samples:**

- `install.sh`
- `install.ps1`
- `.github/workflows/toolkit-ci.yml`
- `tests/install-retired-paths.sh`
- `tests/install-retired-paths.ps1`
- `.github/instructions/gherkin.instructions.md`
- `specs/capabilities/task-management/behavior.feature`
- `specs/capabilities/task-management/rules.md`

**Other signals:**

- `.gitignore`
- Recent Git history and current branch
