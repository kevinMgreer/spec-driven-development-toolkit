# Spec-Driven ATDD Toolkit

A **language-agnostic, IDE-agnostic** toolkit for spec-first **Acceptance Test-Driven Development**.
Drop it into any project — greenfield or legacy, any language, any framework — to enable structured
AI-assisted development with automated quality gates throughout.

Works with **VS Code (Copilot) · Cursor · Kiro · Claude Code** — and any tool that reads `AGENTS.md`.

> **Companion:** [spec-mcp-server](https://github.com/kevinMgreer/spec-mcp-server) — an MCP server that exposes your `specs/` directory to AI assistants directly.
> The VS Code install below configures it automatically. Install it globally once: `npm install -g spec-mcp-server`

---

## The Core Idea

> Never write production code unless a failing acceptance test requires it.

```
Analyze → Spec → Tests (Red) → Implementation (Green) → Quality Gates → Refactor → Review → PR
```

Feed requirements to the AI. It writes the spec (you approve). Then everything from test generation
through implementation, quality gates, refactoring, review, and pull request is handled autonomously.

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

**Or copy manually** — the files for your IDE(s), plus shared docs and specs:

| Your IDE               | Copy these directories/files                                                  |
| ---------------------- | ----------------------------------------------------------------------------- |
| **VS Code (Copilot)**  | `.github/`, `docs/`, `specs/`                                                 |
| **Cursor**             | `.cursor/`, `docs/`, `specs/`                                                 |
| **Kiro**               | `.kiro/`, `docs/`, `specs/`                                                   |
| **Claude Code**        | `CLAUDE.md`, `docs/`, `specs/`                                                |
| **Multiple IDEs**      | Everything (see [CONTRIBUTING.md](CONTRIBUTING.md) for full install commands) |
| **Any AGENTS.md tool** | `AGENTS.md`, `docs/`, `specs/`                                                |

**Always include `docs/` and `specs/`** — platform configs reference `docs/` for the full procedures,
and `specs/` contains working examples.

### 2. Use it

**VS Code (Copilot)** — choose your automation level:

| Mode                 | Agent                    | What stops for human input                                                             |
| -------------------- | ------------------------ | -------------------------------------------------------------------------------------- |
| **Supervised**       | `@atdd-cycle`            | Spec approval + asks before PR                                                         |
| **Fully autonomous** | `@full-autonomous-cycle` | Spec approval only — then hands-off through PR, Copilot review, and comment resolution |

```
# Supervised — you approve the spec, then decide on each next step
@atdd-cycle Implement a user login feature with email/password authentication
that locks accounts after 5 failed attempts within 15 minutes

# Fully autonomous — you approve the spec, then it runs to completion
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

### 3. Enable full autonomy (optional one-time setup)

To unlock hands-off PR creation and Copilot review, set up these three things once per project:

**Spec MCP server** — gives AI assistants direct access to your `specs/` directory (installed automatically by the VS Code install script):

```bash
npm install -g spec-mcp-server   # install once globally
# .vscode/mcp.json is written automatically by install.sh / install.ps1
```

**GitHub MCP** — lets the agent interact with GitHub directly (create PRs, fetch review comments):

```
# Merge docs/atdd/templates/mcp-github.json into .vscode/mcp.json
# Set a GITHUB_TOKEN env var:
# - classic PAT: repo scope
# - fine-grained PAT: repository permissions for Pull requests and Contents
```

**CI quality gates** — enforces gates on every push and auto-requests Copilot review on PRs:

```
# Copy docs/atdd/templates/atdd-ci.yml to .github/workflows/atdd-ci.yml
```

**Local git hooks** (optional) — blocks push if quality gates fail locally:

```
# Copy docs/atdd/templates/lefthook.yml to lefthook.yml
# Run: lefthook install   (install once: npm i -g @evilmartians/lefthook)
```

**Cursor / Kiro / Claude** — describe what you want to build. The AI reads the ATDD rules
automatically and follows the spec-first workflow.

---

## What's Included

### Platform-Agnostic Documentation (`docs/atdd/`)

The single source of truth — all platform adapters reference or embed content from here.

| File                              | Contents                                                                            |
| --------------------------------- | ----------------------------------------------------------------------------------- |
| `workflow.md`                     | Complete ATDD cycle procedure (all 8 phases)                                        |
| `quality-gates.md`                | Quality gate definitions, detection, and execution                                  |
| `project-detection.md`            | Language/framework detection for any project                                        |
| `legacy-integration.md`           | Integrating into existing projects                                                  |
| `spec-writing.md`                 | How to write clear, testable, behavior-focused specifications                       |
| `gherkin.md`                      | Gherkin syntax, formatting, step rules, and anti-patterns                           |
| `checklist.md`                    | Per-feature progress tracking checklist                                             |
| `templates/feature.template.md`   | Gherkin feature file template                                                       |
| `templates/tech-spec.template.md` | Technical spec template                                                             |
| `templates/atdd-ci.yml`           | GitHub Actions CI — auto-detects stack, runs quality gates, requests Copilot review |
| `templates/lefthook.yml`          | Git pre-push hooks — enforces quality gates locally                                 |
| `templates/mcp-github.json`       | GitHub MCP server config — enables agent-driven PR/review                           |

### Universal AI Configuration

| File        | What reads it                                           |
| ----------- | ------------------------------------------------------- |
| `AGENTS.md` | Kiro, GitHub Copilot, and any AGENTS.md-compatible tool |
| `CLAUDE.md` | Claude Code, Claude Projects                            |

### VS Code (Copilot) — `.github/`

| File                                             | Purpose                                                                     |
| ------------------------------------------------ | --------------------------------------------------------------------------- |
| `copilot-instructions.md`                        | Project-wide spec-first rules                                               |
| `agents/atdd-cycle.agent.md`                     | **Supervised**: analyze → spec → tests → implement → PR (asks before PR)    |
| `agents/full-autonomous-cycle.agent.md`          | **Autonomous**: spec approval only → runs to PR + Copilot review resolution |
| `agents/spec-writer.agent.md`                    | Writes Gherkin features + technical specs                                   |
| `agents/spec-reviewer.agent.md`                  | Validates implementation against specs                                      |
| `instructions/atdd-workflow.instructions.md`     | Red-green-refactor rules                                                    |
| `instructions/spec-writing.instructions.md`      | Behavior-focused spec writing guide                                         |
| `instructions/gherkin.instructions.md`           | Auto-applied to `*.feature` files                                           |
| `instructions/quality-gates.instructions.md`     | Quality gate detection and execution                                        |
| `instructions/project-detection.instructions.md` | Language/framework detection guide                                          |
| `prompts/analyze-project.prompt.md`              | `/analyze-project` — detect project stack                                   |
| `prompts/write-spec.prompt.md`                   | `/write-spec` — generate spec from requirements                             |
| `prompts/write-acceptance-tests.prompt.md`       | `/write-acceptance-tests` — failing test stubs                              |
| `prompts/implement-from-spec.prompt.md`          | `/implement-from-spec` — minimum code to pass                               |
| `prompts/run-quality-gates.prompt.md`            | `/run-quality-gates` — lint/format/build/test gates                         |
| `prompts/verify-spec-coverage.prompt.md`         | `/verify-spec-coverage` — compliance check                                  |
| `prompts/refactor-passing-tests.prompt.md`       | `/refactor-passing-tests` — safe refactor                                   |
| `prompts/create-pull-request.prompt.md`          | `/create-pull-request` — branch, commit, push, PR                           |
| `prompts/address-review-comments.prompt.md`      | `/address-review-comments` — handle PR feedback                             |
| `skills/atdd/`                                   | On-demand ATDD skill with templates and references                          |

### Cursor — `.cursor/rules/`

| File                    | Behavior                                     |
| ----------------------- | -------------------------------------------- |
| `atdd-core.mdc`         | Always applied — core ATDD rules             |
| `atdd-workflow.mdc`     | Auto-applied when implementing features      |
| `gherkin.mdc`           | Applied when editing `*.feature` files       |
| `quality-gates.mdc`     | Applied when running tests or quality checks |
| `project-detection.mdc` | Applied when starting work in a new project  |

### Kiro — `.kiro/steering/`

| File                    | Inclusion mode                                 |
| ----------------------- | ---------------------------------------------- |
| `atdd-core.md`          | Always included                                |
| `atdd-workflow.md`      | Auto — when ATDD/spec-related work is detected |
| `gherkin.md`            | File match — when editing `*.feature` files    |
| `spec-writing.md`       | Manual — invoke with `#spec-writing` in chat   |
| `quality-gates.md`      | Auto — when running tests or quality checks    |
| `project-detection.md`  | Auto — when detecting project stack            |
| `legacy-integration.md` | Manual — invoke with `#legacy-integration`     |

### Example Specs (`specs/`)

| File                                              | Purpose                                     |
| ------------------------------------------------- | ------------------------------------------- |
| `specs/features/example-task-management.feature`  | Complete Gherkin example with all tag types |
| `specs/technical/example-task-management-spec.md` | Complete technical spec example             |

---

## How the Architecture Works

```
docs/atdd/                       ← Single source of truth (Markdown)
  ┌────────┬────────┬────────┬────────┬──────────┐
  ▼        ▼        ▼        ▼        ▼          ▼
.github/ .cursor/ .kiro/  CLAUDE.md AGENTS.md  (future IDEs)
VS Code  Cursor   Kiro    Claude    Universal
```

The real knowledge lives in `docs/atdd/`. Each IDE gets a **thin adapter** that either:

- References the source docs directly (Kiro's `#[[file:...]]` directives)
- Embeds the essential rules with pointers to the full docs

Update content in one place; all platforms stay in sync.

---

## The ATDD Cycle

```
Requirements
     │
     ▼
  0. Analyze Project ────────► detect language, frameworks, tools, conventions
     │
     ▼
  1. Spec Writing ───────────► specs/features/*.feature
     (Given/When/Then)          specs/technical/*-spec.md
     │  confirm with requester
     ▼
  2. Acceptance Tests ───────► tests/**  (step stubs — RED)
     │  confirm red
     ▼
  3. Implementation ─────────► src/**  (minimum code to pass)
     │
     ▼
  4. Quality Gates ──────────► lint, format, typecheck, build, test
     │  iterate until all pass
     ▼
  5. Refactor  (tests stay green, re-run gates)
     │
     ▼
  6. Spec Review  (compliance check)
     │
     ▼
  7. Pull Request  (branch, commit, push, PR)
```

Full procedure: [docs/atdd/workflow.md](docs/atdd/workflow.md)

---

## Tag Convention

| Tag           | Meaning                                        | Count per feature |
| ------------- | ---------------------------------------------- | ----------------- |
| `@smoke`      | Single most critical path — run on every build | Exactly 1         |
| `@happy-path` | Primary success flows                          | 1–2               |
| `@edge-case`  | Boundary and unusual-but-valid inputs          | 2–4               |
| `@error`      | Invalid inputs, auth failures, system errors   | 2–3               |
| `@wip`        | Not yet implemented — intentionally failing    | Temporary         |
| `@regression` | Added to prevent recurrence of a specific bug  | As needed         |

---

## Core Principles

1. **Spec is the source of truth** — change spec first, then tests, then code
2. **Red before green** — never implement without a confirmed-failing test
3. **Minimum viable implementation** — only write code a failing test demands
4. **Behavior, not implementation** — specs describe what users observe, not how code works
5. **Living documentation** — specs are always accurate because they're executable
6. **Quality gates are mandatory** — lint, format, typecheck, build, test must all pass before done
7. **Detect, don't assume** — always analyze the project's stack before generating code

---

## Requirements

- Any AI-powered IDE: VS Code + Copilot, Cursor, Kiro, Claude Code, or similar
- The AI must have file read/write access (agent or agentic mode)
