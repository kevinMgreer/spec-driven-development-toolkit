# Spec-Driven ATDD Toolkit

A **language-agnostic, IDE-agnostic** toolkit for spec-first **Acceptance Test-Driven Development**.
Drop it into any project — greenfield or legacy, any language, any framework — to enable structured
AI-assisted development with automated quality gates throughout.

Works with **VS Code (Copilot)** and **Claude Code** — and any tool that reads `AGENTS.md`.

> **Companion:** [spec-mcp-server](https://github.com/kevinMgreer/spec-mcp-server) — an MCP server
> that exposes your `specs/` directory to AI assistants directly.

---

## The Core Idea

> Never write production code unless a failing acceptance test requires it.

```
Analyze → Spec → Tests (Red) → Implementation (Green) → Quality Gates → Refactor →
Spec & Doc Sync → Archive → PR → Review
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
./install.sh /path/to/your-project --vscode --claude

# Windows PowerShell — all platforms
.\install.ps1 -Target C:\repos\your-project

# Windows PowerShell — specific platforms
.\install.ps1 -Target C:\repos\your-project -Platforms vscode,claude

# Dry run — see what would be copied
./install.sh /path/to/your-project --dry-run
```

**Or copy manually:**

| Your IDE               | Copy these                                          |
| ---------------------- | --------------------------------------------------- |
| **VS Code (Copilot)**  | `.github/`, `docs/`, `specs/`                       |
| **Claude Code**        | `CLAUDE.md`, `.claude/`, `docs/`, `specs/`          |
| **Both**               | Everything (see [CONTRIBUTING.md](CONTRIBUTING.md)) |
| **Any AGENTS.md tool** | `AGENTS.md`, `docs/`, `specs/`                      |

Always include `docs/` and `specs/` — platform configs reference `docs/` for the full procedures.

### 2. Use it

**VS Code (Copilot)** — one agent, `@atdd-cycle`:

```
@atdd-cycle Implement a user login feature with email/password authentication
that locks accounts after 5 failed attempts within 15 minutes
```

You choose the automation level at the spec approval gate — the one stop that already exists —
so there is nothing extra to decide up front:

| Mode                | What happens after spec approval                                    |
| ------------------- | -------------------------------------------------------------------- |
| **(a) Hands-off**   | Runs through PR creation and review resolution without stopping     |
| **(b) Check first** | Stops once before opening the PR, then finishes                      |

Pass `--auto` to skip the question and go straight to hands-off.

Or step by step with slash commands:

```
/analyze-project        → detect project stack
/write-spec             → /write-acceptance-tests → /implement-from-spec
/run-quality-gates      → /refactor-passing-tests → /verify-spec-coverage
/archive-change         → /create-pull-request → /address-review-comments
```

**Claude Code** — the same single command:

```
/atdd-cycle Implement a user login feature with email/password authentication
/atdd-cycle --auto Implement a user login feature with email/password authentication
```

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
| Claude Code        | `.claude/` + `CLAUDE.md` | Commands and subagents                            |
| Any AGENTS.md tool | `AGENTS.md`              | Universal rules and command reference             |

### Templates (`docs/atdd/templates/`)

| File                        | Purpose                                             |
| --------------------------- | --------------------------------------------------- |
| `feature.template.md`       | Capability behavior template (current truth)        |
| `tech-spec.template.md`     | Capability rules template                           |
| `proposal.template.md`      | Change proposal — why, scope, capability impact     |
| `delta.template.feature`    | Delta feature — tagged additions, edits, removals   |
| `delta-rules.template.md`   | Rule deltas — ADDED / MODIFIED / REMOVED            |
| `tasks.template.md`         | Change task checklist                               |
| `atdd-metadata.template.yaml` | Change metadata — skip_specs, retire, weakenings  |
| `atdd-ci.yml`               | GitHub Actions CI — quality gates + Copilot review  |
| `lefthook.yml`              | Git pre-push hooks — local quality gate enforcement |
| `mcp-github.json`           | GitHub MCP server config for agent-driven PR/review |

### Example specs (`specs/`)

Specs are two-tier. **Capabilities** hold current truth — one folder per domain, each with a
complete `behavior.feature` and its numbered `rules.md`. **Changes** hold work in flight — each
a folder with a proposal, a `delta.feature` describing only what that change adds, alters, or
removes, its rule deltas, and a task list. A change never edits a capability directly; the delta
merges in when the work is done, and the change folder moves to `changes/archive/`.

```
specs/
├── capabilities/task-management/
│   ├── behavior.feature       ← everything the system does today
│   └── rules.md
└── changes/add-due-dates/
    ├── proposal.md
    ├── delta.feature          ← @added / @modified: / @removed: only
    ├── delta-rules.md
    └── tasks.md
```

This is what keeps the spec set from fragmenting: with one file per feature, the second change
touching a domain leaves two files and no way to tell which is authoritative.

A worked example ships in `specs/capabilities/task-management/`.

---

## How the Architecture Works

```
docs/atdd/                    ← Single source of truth (Markdown)
  ┌───────────────┬───────────────────────┬──────────────┐
  ▼               ▼                       ▼              ▼
.github/     .claude/ + CLAUDE.md     AGENTS.md     (future tools)
VS Code      Claude Code              Universal
```

The real knowledge lives in `docs/atdd/`. Each tool gets a thin adapter that references or embeds
the essential rules with pointers to the full docs. Update content in one place; both platforms
stay in sync.

---

## Requirements

- VS Code with Copilot, or Claude Code (or any tool that reads `AGENTS.md`)
- The AI must have file read/write access (agent or agentic mode)
