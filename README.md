# Spec-Driven ATDD Toolkit

A **language-agnostic, IDE-agnostic** toolkit for spec-first **Acceptance Test-Driven Development**.
Drop it into any project — greenfield or legacy, any language, any framework — to enable structured
AI-assisted development with automated quality gates throughout.

Works with **VS Code (Copilot) · Cursor · Kiro · Claude Code** — and any tool that reads `AGENTS.md`.

> **Companion:** [spec-mcp-server](https://github.com/kevinMgreer/spec-mcp-server) — an MCP server
> that exposes your `specs/` directory to AI assistants directly.

---

## The Core Idea

> Never write production code unless a failing acceptance test requires it.

```
Analyze → Spec → Tests (Red) → Implementation (Green) → Quality Gates → Refactor → Spec & Doc Sync → PR
```

Feed requirements to the AI. It writes the spec (you approve). Then everything from test generation
through implementation, quality gates, refactoring, doc sync, and pull request is handled autonomously.

Full procedure: [docs/atdd/workflow.md](docs/atdd/workflow.md)

---

## Quick Start

### 1. Install into your project

**Using the install script** (recommended):

```bash
# macOS / Linux — all platforms
./install.sh /path/to/your-project

# macOS / Linux — specific platforms
./install.sh /path/to/your-project --vscode --cursor

# Windows PowerShell — all platforms
.\install.ps1 -Target C:\repos\your-project

# Windows PowerShell — specific platforms
.\install.ps1 -Target C:\repos\your-project -Platforms vscode,cursor

# Dry run — see what would be copied
./install.sh /path/to/your-project --dry-run
```

**Or copy manually:**

| Your IDE               | Copy these                                          |
| ---------------------- | --------------------------------------------------- |
| **VS Code (Copilot)**  | `.github/`, `docs/`, `specs/`                       |
| **Cursor**             | `.cursor/`, `docs/`, `specs/`                       |
| **Kiro**               | `.kiro/`, `docs/`, `specs/`                         |
| **Claude Code**        | `CLAUDE.md`, `.claude/`, `docs/`, `specs/`          |
| **Multiple IDEs**      | Everything (see [CONTRIBUTING.md](CONTRIBUTING.md)) |
| **Any AGENTS.md tool** | `AGENTS.md`, `docs/`, `specs/`                      |

Always include `docs/` and `specs/` — platform configs reference `docs/` for the full procedures.

### 2. Use it

**VS Code (Copilot)** — choose your automation level:

| Mode                 | Agent                    | What stops for human input                                                             |
| -------------------- | ------------------------ | -------------------------------------------------------------------------------------- |
| **Supervised**       | `@atdd-cycle`            | Spec approval + asks before PR                                                         |
| **Fully autonomous** | `@full-autonomous-cycle` | Spec approval only — then hands-off through PR, Copilot review, and comment resolution |

```
@atdd-cycle Implement a user login feature with email/password authentication
that locks accounts after 5 failed attempts within 15 minutes

@full-autonomous-cycle Implement a user login feature with email/password authentication
that locks accounts after 5 failed attempts within 15 minutes
```

Or step by step with slash commands:

```
/analyze-project        → detect project stack
/write-spec             → /write-acceptance-tests → /implement-from-spec
/run-quality-gates      → /refactor-passing-tests → /verify-spec-coverage
/create-pull-request    → /address-review-comments
```

**Claude Code** — same two levels, as slash commands:

```
/atdd-cycle Implement a user login feature with email/password authentication
/full-autonomous-cycle Implement a user login feature with email/password authentication
```

**Cursor / Kiro** — describe what you want to build. The AI reads the ATDD rules automatically.

### 3. Enable full autonomy (optional one-time setup)

For hands-off PR creation and Copilot review, set up these once per project:

- **Spec MCP server** — gives AI assistants direct access to your `specs/` directory.
  See [spec-mcp-server](https://github.com/kevinMgreer/spec-mcp-server) for setup.
  The VS Code install script writes `.vscode/mcp.json` automatically.

- **GitHub MCP** — lets the agent create PRs and fetch review comments directly.
  Merge `docs/atdd/templates/mcp-github.json` into `.vscode/mcp.json` and set a
  `GITHUB_TOKEN` env var (classic PAT with `repo` scope, or fine-grained with PR + Contents).

- **CI quality gates** — enforces gates on every push and auto-requests Copilot review on PRs.
  Copy `docs/atdd/templates/atdd-ci.yml` to `.github/workflows/atdd-ci.yml`.

- **Local git hooks** (optional) — blocks push if quality gates fail locally.
  Copy `docs/atdd/templates/lefthook.yml` to `lefthook.yml`, then run `lefthook install`.
  Install lefthook once: `npm i -g @evilmartians/lefthook`.

---

## What's Included

### Platform-agnostic documentation (`docs/atdd/`)

The single source of truth — all platform adapters reference content from here. Covers the full
ATDD cycle, quality gate detection, project conventions discovery, legacy integration, spec writing
guide, Gherkin conventions, per-feature checklist, and spec/feature templates.

### Platform adapters

| Platform           | Directory                | What's there                                      |
| ------------------ | ------------------------ | ------------------------------------------------- |
| VS Code (Copilot)  | `.github/`               | Agents, instructions, prompts, CI workflow, skill |
| Cursor             | `.cursor/rules/`         | `.mdc` rules, auto-applied per context            |
| Kiro               | `.kiro/steering/`        | Steering docs with include-mode metadata          |
| Claude Code        | `.claude/` + `CLAUDE.md` | Commands and subagents                            |
| Any AGENTS.md tool | `AGENTS.md`              | Universal rules and command reference             |

### Templates (`docs/atdd/templates/`)

| File                    | Purpose                                             |
| ----------------------- | --------------------------------------------------- |
| `feature.template.md`   | Gherkin feature file template                       |
| `tech-spec.template.md` | Technical spec template                             |
| `atdd-ci.yml`           | GitHub Actions CI — quality gates + Copilot review  |
| `lefthook.yml`          | Git pre-push hooks — local quality gate enforcement |
| `mcp-github.json`       | GitHub MCP server config for agent-driven PR/review |

### Example specs (`specs/`)

Working examples of a Gherkin feature file and technical spec you can use as references.

---

## How the Architecture Works

```
docs/atdd/                       ← Single source of truth (Markdown)
  ┌────────┬────────┬────────┬──────────┬──────────┬──────────────┐
  ▼        ▼        ▼        ▼          ▼          ▼              ▼
.github/ .cursor/ .kiro/  .claude/ + CLAUDE.md  AGENTS.md   (future IDEs)
VS Code  Cursor   Kiro    Claude Code            Universal
```

The real knowledge lives in `docs/atdd/`. Each IDE gets a thin adapter that references or embeds
the essential rules with pointers to the full docs. Update content in one place; all platforms
stay in sync.

---

## Requirements

- Any AI-powered IDE: VS Code + Copilot, Cursor, Kiro, Claude Code, or similar
- The AI must have file read/write access (agent or agentic mode)
