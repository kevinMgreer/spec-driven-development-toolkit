# Contributing — Spec-Driven ATDD Toolkit

This toolkit is designed to be dropped into any project to enable spec-first AI-assisted
development. It supports VS Code (Copilot), Cursor, Kiro, Claude, and any AGENTS.md-compatible tool.

---

## Repository Layout

```
spec-driven-development-toolkit/
│
├── docs/atdd/                     # 🟢 SINGLE SOURCE OF TRUTH (platform-agnostic)
│   ├── workflow.md                #    Full ATDD cycle procedure (all 8 phases)
│   ├── quality-gates.md           #    Quality gate definitions, detection, execution
│   ├── project-detection.md       #    Language/framework detection for any project
│   ├── legacy-integration.md      #    Integrating into existing projects
│   ├── spec-writing.md            #    How to write clear, testable specs
│   ├── gherkin.md                 #    Gherkin syntax, formatting, anti-patterns
│   ├── checklist.md               #    Per-feature tracking checklist
│   └── templates/
│       ├── feature.template.md    #    Gherkin feature file template
│       └── tech-spec.template.md  #    Technical spec template
│
├── specs/                         # 📋 Example specs (copy into target project)
│   ├── features/
│   │   └── task-management.feature
│   └── technical/
│       └── task-management-spec.md
│
├── AGENTS.md                      # 🤖 Universal AI instruction file (AGENTS.md standard)
├── CLAUDE.md                      # 🟣 Claude Code / Claude Projects root instruction
│
├── .github/                       # 🔵 VS Code Copilot configuration
│   ├── copilot-instructions.md
│   ├── agents/
│   │   ├── atdd-cycle.agent.md
│   │   ├── spec-writer.agent.md
│   │   └── spec-reviewer.agent.md
│   ├── instructions/
│   │   ├── atdd-workflow.instructions.md
│   │   ├── spec-writing.instructions.md
│   │   ├── gherkin.instructions.md
│   │   ├── quality-gates.instructions.md
│   │   └── project-detection.instructions.md
│   ├── prompts/
│   │   ├── analyze-project.prompt.md
│   │   ├── write-spec.prompt.md
│   │   ├── write-acceptance-tests.prompt.md
│   │   ├── implement-from-spec.prompt.md
│   │   ├── run-quality-gates.prompt.md
│   │   ├── verify-spec-coverage.prompt.md
│   │   ├── refactor-passing-tests.prompt.md
│   │   ├── create-pull-request.prompt.md
│   │   └── address-review-comments.prompt.md
│   └── skills/atdd/
│       ├── SKILL.md
│       ├── assets/
│       └── references/
│
├── .cursor/rules/                 # 🟡 Cursor configuration
│   ├── atdd-core.mdc
│   ├── atdd-workflow.mdc
│   ├── gherkin.mdc
│   ├── quality-gates.mdc
│   └── project-detection.mdc
│
├── .kiro/steering/                # 🟠 Kiro IDE configuration
│   ├── atdd-core.md
│   ├── atdd-workflow.md
│   ├── gherkin.md
│   ├── spec-writing.md
│   ├── quality-gates.md
│   ├── project-detection.md
│   └── legacy-integration.md
│
├── install.sh                     # 🔧 Install script (macOS / Linux)
├── install.ps1                    # 🔧 Install script (Windows PowerShell)
├── README.md
└── CONTRIBUTING.md                # This file
```

---

## How the Architecture Works

```
docs/atdd/                          ← Single source of truth (Markdown)
  ┌──────────┬──────────┬──────────┬──────────┐
  ▼          ▼          ▼          ▼          ▼
.github/   .cursor/   .kiro/     CLAUDE.md  AGENTS.md
(VS Code)  (Cursor)   (Kiro)     (Claude)   (Universal)
```

The real content lives in `docs/atdd/`. Each platform gets a thin adapter that either:

- **References** the source files (Kiro uses `#[[file:...]]` directives, Cursor/VS Code embed key rules and point to docs)
- **Embeds** the essential rules with a pointer to the full docs for anything beyond the summary

This means you maintain knowledge in **one place** and all platforms stay in sync.

---

## Installing into a Target Project

### Using the Install Scripts (Recommended)

```bash
# macOS / Linux — all platforms
./install.sh /path/to/your-project

# macOS / Linux — specific platforms only
./install.sh /path/to/your-project --vscode --cursor

# Dry run — see what would be copied without copying
./install.sh /path/to/your-project --dry-run
```

```powershell
# Windows PowerShell — all platforms
.\install.ps1 -Target C:\repos\your-project

# Windows PowerShell — specific platforms
.\install.ps1 -Target C:\repos\your-project -Platforms vscode,cursor

# Dry run
.\install.ps1 -Target C:\repos\your-project -DryRun
```

The install scripts merge into existing projects without overwriting — they skip files that already
exist unless `--force` (bash) or `-Force` (PowerShell) is specified.

### Manual Install

Copy everything:

```bash
# macOS / Linux
cp -r spec-driven-development-toolkit/.github    your-project/.github
cp -r spec-driven-development-toolkit/.cursor    your-project/.cursor
cp -r spec-driven-development-toolkit/.kiro      your-project/.kiro
cp -r spec-driven-development-toolkit/docs       your-project/docs
cp -r spec-driven-development-toolkit/specs      your-project/specs
cp    spec-driven-development-toolkit/AGENTS.md  your-project/AGENTS.md
cp    spec-driven-development-toolkit/CLAUDE.md  your-project/CLAUDE.md
```

```powershell
# Windows (PowerShell)
Copy-Item -Recurse .\spec-driven-development-toolkit\.github   your-project\.github
Copy-Item -Recurse .\spec-driven-development-toolkit\.cursor   your-project\.cursor
Copy-Item -Recurse .\spec-driven-development-toolkit\.kiro     your-project\.kiro
Copy-Item -Recurse .\spec-driven-development-toolkit\docs      your-project\docs
Copy-Item -Recurse .\spec-driven-development-toolkit\specs     your-project\specs
Copy-Item .\spec-driven-development-toolkit\AGENTS.md          your-project\AGENTS.md
Copy-Item .\spec-driven-development-toolkit\CLAUDE.md          your-project\CLAUDE.md
```

### Platform-Specific Install

Only copy what you need:

| Your IDE               | Copy these                     |
| ---------------------- | ------------------------------ |
| **VS Code (Copilot)**  | `.github/`, `docs/`, `specs/`  |
| **Cursor**             | `.cursor/`, `docs/`, `specs/`  |
| **Kiro**               | `.kiro/`, `docs/`, `specs/`    |
| **Claude Code**        | `CLAUDE.md`, `docs/`, `specs/` |
| **Any AGENTS.md tool** | `AGENTS.md`, `docs/`, `specs/` |
| **Multiple IDEs**      | Full install (above)           |

**Always copy `docs/` and `specs/`** — the platform configs reference `docs/` and `specs/` contains the example features.

---

## Editing the Knowledge Base

### I want to change ATDD rules or workflow

1. Edit the relevant file in `docs/atdd/`
2. Check if any platform adapter summarizes that content and needs updating:
   - `.github/copilot-instructions.md` and `.github/instructions/*.instructions.md`
   - `.github/skills/atdd/references/` (copies of docs for the skill)
   - `.cursor/rules/*.mdc`
   - `.kiro/steering/*.md`
   - `CLAUDE.md`
   - `AGENTS.md`
3. Platform adapters that use file references (Kiro's `#[[file:...]]`) pick up changes automatically
4. Platform adapters that embed summaries need manual syncing

### I want to change quality gates or project detection

1. Edit `docs/atdd/quality-gates.md` or `docs/atdd/project-detection.md`
2. Update the corresponding platform files:
   - `.github/instructions/quality-gates.instructions.md` or `project-detection.instructions.md`
   - `.github/skills/atdd/references/quality-gates.md` or `project-detection.md`
   - `.cursor/rules/quality-gates.mdc` or `project-detection.mdc`
   - `.kiro/steering/quality-gates.md` or `project-detection.md`

### I want to add support for a new IDE

1. Research the IDE's convention for AI configuration files
2. Create a thin adapter that references `docs/atdd/` content
3. Add the directory to the layout in this file
4. Add install instructions to the table above

---

## Platform Reference

| Platform              | Config Location         | Format                                                    | Auto-loading                                                                         |
| --------------------- | ----------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| **VS Code (Copilot)** | `.github/`              | `.agent.md`, `.prompt.md`, `.instructions.md`, `SKILL.md` | `instructions.md` via `applyTo`; agents/prompts by user invocation; skills on demand |
| **Cursor**            | `.cursor/rules/`        | `.mdc` with YAML frontmatter                              | `alwaysApply: true` or by `globs` match                                              |
| **Kiro**              | `.kiro/steering/`       | `.md` with YAML frontmatter                               | `inclusion: always`, `fileMatch`, `auto`, or `manual`                                |
| **Claude Code**       | `CLAUDE.md` (repo root) | Markdown                                                  | Always loaded for the project                                                        |
| **AGENTS.md**         | `AGENTS.md` (repo root) | Markdown                                                  | IDE-dependent (Kiro reads it; others vary)                                           |

---

## Development Workflow for the Toolkit Itself

This is a toolkit about spec-first development — follow the process it teaches:

1. Write a spec for any toolkit feature you want to add
2. Create acceptance criteria
3. Implement the feature
4. Verify all platform adapters are consistent
5. Test in at least one IDE before submitting a PR
