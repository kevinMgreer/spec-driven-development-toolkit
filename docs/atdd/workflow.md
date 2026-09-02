# ATDD Workflow — The Spec-Driven Development Cycle

This document is the **single source of truth** for the Spec-Driven ATDD cycle.
All platform configurations (VS Code Copilot, Claude Code) reference or embed this procedure.

The toolkit is **language-agnostic** and **platform-agnostic** — it works in any project regardless
of language, framework, or existing setup (greenfield or legacy).

---

## The Cycle

```
Requirements
     │
     ▼
  0. Analyze Project ──────────► Project profile (language, tools, conventions)
     │
     ▼
  1. Write Spec ──────────────► specs/changes/<name>/ (proposal, delta.feature,
                                  delta-rules.md, tasks.md)
     │  (confirm spec is correct)
     ▼
  2. Generate Tests ───────────► tests/ (step stubs — all RED)
     │  (confirm red for right reason)
     ▼
  3. Implement ────────────────► src/ (minimum code, scenario by scenario)
     │  (run tests after each scenario)
     ▼
  4. Quality Gates ────────────► lint, format, typecheck, build, test
     │  (iterate until all pass)
     ▼
  5. Refactor (tests stay green, re-run all gates)
     │
     ▼
  6. Spec & Doc Sync (hard gate — repair drift in-place)
     │
     ▼
  7. Archive & Merge (delta → capability; change → dated archive)
     │
     ▼
  8. PR (branch, commit, push, PR — asks first in mode (b))
     │
     ▼
  9. Review + Address Comments
```

---

## Hard Rules — Never Break These

| Rule                                                        | Why                                                             |
| ----------------------------------------------------------- | --------------------------------------------------------------- |
| Never write production code before acceptance tests are red | Ensures the test actually validates something                   |
| Never modify tests to make them pass                        | Fixes the symptom not the cause; the spec becomes meaningless   |
| Never narrow the spec without confirmation                  | "Match the code" must not silently delete a guarantee the spec made |
| Never add logic not required by a failing test              | Speculation; increases maintenance burden with no specification |
| Always update spec first when requirements change           | Code must match spec, not the reverse                           |
| Always confirm tests are red _for the right reason_         | A test that passes due to a broken import is not actually red   |
| Never proceed past spec without explicit user approval      | The spec gate is the mandatory human checkpoint                 |
| Never declare done with spec, README, profile, or any consulted doc drift | Phase 6 is a hard gate — fix drift in-phase, do not defer |
| Always re-read `docs/project-profile.md` before Phase 3     | New code must mirror existing architecture, not invent new ones |

---

## Phase 0 — Analyze the Project

**Input**: a new or existing repository
**Output**: `docs/project-profile.md` containing **both** tooling and conventions, plus a list
of reference files the agent will mirror in Phase 3.

This phase is intentionally heavyweight. The most common failure mode of AI-assisted ATDD is
code that passes the tests but does not look like the surrounding codebase. The fix is a deep
project profile that the agent must re-read before writing implementation in Phase 3.

### Step A — Tooling Detection

Detect the project's stack:

1. **Language and package manager** — `package.json`, `pyproject.toml`, `*.csproj`, `go.mod`, etc.
2. **Test framework** — Jest, Vitest, pytest, NUnit, RSpec, Go testing, etc.
3. **Linter** — ESLint, Ruff, RuboCop, golangci-lint, Clippy, etc.
4. **Formatter** — Prettier, Black, rustfmt, gofmt, etc.
5. **Type checker** — TypeScript, mypy, pyright, etc.
6. **Build system** — npm build, dotnet build, go build, cargo build, etc.
7. **CI/CD** — GitHub Actions, GitLab CI, Jenkins, etc.

### Step B — Existing Documentation Scan (mandatory if any docs exist)

Read the project's own documentation before sampling code. Docs carry architectural rationale,
domain vocabulary, and explicit conventions that code samples alone do not reveal. Check, and
when present read:

- `README.md` (and variants) — setup/run/test commands, domain vocabulary, project purpose
- `CONTRIBUTING.md` — commit conventions, branch naming, PR process, local dev steps
- `ARCHITECTURE.md` / `docs/architecture.md` — architecture style, module boundaries
- `docs/adr/` or `docs/decisions/` — accepted architectural decisions (**authoritative**)
- `docs/` (other top-level docs) — dev setup, glossary, runbooks, style guides
- `.github/PULL_REQUEST_TEMPLATE.md` — PR hygiene
- `STYLE.md` / `STYLEGUIDE.md` / `CODING_STANDARDS.md` — explicit conventions
- `SECURITY.md` — constraints the agent must respect

Precedence when documentation and code disagree:

- README commands **override** inferred commands.
- ADRs and `ARCHITECTURE.md` **override** architecture style inferred from samples.
- `CONTRIBUTING.md` **overrides** commit/branch conventions inferred from git history.
- Domain terms in README/docs **must** be used in specs and tests.
- True conflicts go under `Known inconsistencies` in the profile — never silently pick one.

Record every doc you read under `Sources consulted` in the profile. If no docs exist, record
`none detected`.

### Step C — Conventions Discovery (mandatory for legacy projects)

Using hints from Step B to identify canonical examples, sample **2–4 representative source
files** (e.g., a controller/handler, a service, a repository, a test) and extract the patterns
the codebase actually uses. Skip only for empty greenfield projects.

For each of the following, record either the observed pattern or "none detected" — never guess:

- Architecture style (layered, hexagonal, MVC, vertical slice, modular monolith, etc.)
- Module layout (folder-by-feature vs folder-by-layer; co-located vs separated tests)
- Dependency wiring (constructor DI, container, factories, plain imports)
- Error handling (exceptions vs Result/Either; custom error types; boundary mapping)
- Validation (where and which library)
- Async patterns and cancellation conventions
- Logging library and conventions
- Configuration loading and secret management
- Naming (files, classes, functions, constants, tests)
- Public API style (REST/GraphQL/gRPC; URL casing; error format)
- Persistence (ORM, migrations, transactions)
- Comment and doc style
- Commit and branch conventions

Full reference: [Project Detection — Conventions Discovery](./project-detection.md#step-9--conventions-discovery-mandatory-for-legacy-projects).

### Step D — Write the Profile

Write all findings to **`docs/project-profile.md`** using the template (`Tooling`,
`Conventions`, `Reference Files`, `Sources consulted`, and optionally `Anti-patterns to avoid
in this repo` and `Known inconsistencies`) defined in
[Project Detection — Detection Output Format](./project-detection.md#detection-output-format).

If `docs/project-profile.md` already exists, **read it first** and treat it as authoritative.
Only update it if (a) the user asks, or (b) you discover the project has materially changed
since the profile was written (new architecture, new tools, new docs, etc.).

### Step E — Greenfield vs Legacy

For greenfield projects: prompt the user for tooling preferences (language, test framework,
package manager, linter, formatter) in a **single** prompt before writing any specs. Skip
conventions discovery (there are none yet) and add an empty `Conventions` section that will be
filled in as the project grows.

For legacy projects: conventions discovery is **non-negotiable**. The agent must not generate
implementation code without first recording the conventions it will follow. See
[Legacy Integration](./legacy-integration.md).

---

## Phase 1 — Write the Spec

**Input**: requirements, user story, or feature description  
**Output**: a change folder — `specs/changes/<name>/` containing `proposal.md`,
`delta.feature`, `delta-rules.md`, and `tasks.md`

### Identify the capability first

Before writing anything, decide which capability this change belongs to:

- Read `specs/capabilities/` and pick the domain the change modifies
- If it modifies more than one, that is usually two changes — split unless they genuinely must
  ship together
- If no capability fits, this change **creates** one. Say so explicitly in `proposal.md`; the
  delta's scenarios will all be `@added` and Phase 7 will create the capability file

Then read that capability's `behavior.feature` and `rules.md` in full. You cannot write a correct
`@modified:` or `@removed:` tag without knowing what is there.

### What to Clarify Before Writing

If any of these are unclear, ask before writing (maximum 3 questions):

- **Actor** — who is performing this action? (user, admin, API client, background job)
- **Goal** — what are they trying to accomplish?
- **Success criteria** — what does "done" look like from the outside?
- **Error cases** — what inputs are invalid? what external failures can occur?

### What the Spec Contains

**Proposal** (`specs/changes/<name>/proposal.md`):

- Why this change exists, and which capability it targets
- In scope and out of scope
- Whether it creates a new capability

**Delta feature** (`specs/changes/<name>/delta.feature`):

- Only the scenarios this change touches, each carrying exactly one delta tag
  (`@added`, `@modified:"..."`, `@removed:"..."`, `@renamed:"..."`)
- Priority tags apply to the **merged** capability: `@smoke` (1 total), `@happy-path` (1–2),
  `@edge-case` (2–4), `@error` (2–3)
- Grammar and rules: [Gherkin Conventions § Delta Tags](./gherkin.md#delta-tags)

**Delta rules** (`specs/changes/<name>/delta-rules.md`):

- Only the numbered rules this change adds, alters, or removes — mark each ADDED / MODIFIED /
  REMOVED, keeping the capability's existing numbering
- API contract and data constraint changes, if applicable

**Tasks** (`specs/changes/<name>/tasks.md`):

- Implementation checklist, grouped, with `- [ ]` checkboxes

**Confirm with the requester before proceeding.** Spec changes after tests exist are expensive.

### Spec Approval Gate (Mandatory)

This is the **mandatory human checkpoint** in the cycle. Everything after this point is autonomous.

It is also where the **autonomy level** is chosen. Do not ask for it earlier as a separate
question — the user has not seen anything yet, and a second stop before Phase 0 buys nothing.
Bundling it here keeps the cycle at one mandatory interruption.

1. Present the complete spec (feature file + technical spec) to the user
2. Ask approval and autonomy together, in one message:

   > Do these specs look correct? Any changes before I proceed?
   >
   > And after approval, should I:
   > **[a]** run hands-off through implementation, quality gates, PR and review, or
   > **[b]** check with you once before opening the PR?

3. **Wait for explicit approval.** Do not proceed to Phase 2 until the user confirms.
4. If the user requests changes:
   a. Update the spec files
   b. Re-present the updated spec
   c. Ask for approval again
   d. Repeat until the user approves
5. If the spec is approved but the mode question goes unanswered, default to **(b)** and say
   which mode you are using before continuing.
6. Only after approval: proceed to Phase 2 (test generation) and the autonomous remainder

---

## Phase 2 — Generate Acceptance Tests (Red)

**Input**: `specs/changes/<name>/delta.feature`  
**Output**: test stubs in the project's test directory — every stub must fail

### Detect the Test Framework

| File found                                                     | Framework                              |
| -------------------------------------------------------------- | -------------------------------------- |
| `package.json` with `jest` / `vitest` / `@cucumber/cucumber`   | JS/TS — Jest, Vitest, Cucumber.js      |
| `pyproject.toml` / `requirements.txt` with `pytest` / `behave` | Python — pytest, behave                |
| `*.csproj`                                                     | .NET — NUnit, xUnit, SpecFlow          |
| `Gemfile` with `rspec` / `cucumber`                            | Ruby — RSpec, Cucumber                 |
| `go.mod`                                                       | Go — testing, godog                    |
| Existing test files                                            | Match directory and naming conventions |

### Stub Requirements

Every Gherkin scenario must have a corresponding test stub that:

1. Has a header pointing at the **capability**, not the change:
   `// Spec: specs/capabilities/<domain>/behavior.feature` (adjust comment syntax per language).
   The change folder is archived once merged; the test outlives it, so it must reference the
   durable location
2. Contains a step definition or test case for every Given / When / Then
3. Throws an explicit "not implemented" error (`throw new Error("not implemented")`, `pytest.fail("not implemented")`, etc.)
4. Does **not** silently pass or skip

### Confirm Red

Run the tests. Every stub must fail. If any fail for the wrong reason (import error, syntax, misconfiguration), fix the setup before implementing — do not treat broken setup as an acceptable "red."

---

## Phase 3 — Implement (Green)

**Input**: failing tests  
**Output**: production code that makes tests pass, scenario by scenario

### Step 0 — Re-read the Project Profile (mandatory)

Before creating or editing any production file in Phase 3, **re-read `docs/project-profile.md`**
— specifically the `Conventions` and `Reference Files` sections. Then **open at least one
reference file from the same layer you are about to write** (e.g., if you are writing a service,
open the listed service example).

State explicitly which conventions you will follow before writing code, e.g.:

> Following profile: layered architecture, constructor DI, custom `AppError` for business
> failures, zod validation at controller boundary, JSDoc on public exports, kebab-case files.
> Mirroring `src/features/orders/orders.service.ts`.

If the profile is missing, stop and run Phase 0 first.

### Order of Implementation

Work through scenarios in priority order:

| Priority | Tag           | Description                     |
| -------- | ------------- | ------------------------------- |
| 1st      | `@smoke`      | Critical path — must pass first |
| 2nd      | `@happy-path` | Primary success flows           |
| 3rd      | `@edge-case`  | Boundary and unusual inputs     |
| 4th      | `@error`      | Error handling and sad paths    |
| Skip     | `@wip`        | Not yet ready — leave failing   |

### Discipline

- Implement only the minimum code to pass the current failing test
- **Mirror** the patterns recorded in the project profile — do not introduce a new architecture,
  error-handling style, validation library, or naming scheme without explicit user approval
- Run the full test suite after each implementation unit
- If a test you haven't implemented yet turns green, investigate — you may have implemented more than needed
- Do not add logging, caching, metrics, or "nice-to-have" features unless a test requires it

---

## Phase 4 — Quality Gates

**Input**: implementation code with all tests green
**Output**: all available quality gates passing

Run all available quality gates and iterate until they pass:

1. **Lint** — run the project's linter. Auto-fix where possible.
2. **Format** — check/fix code formatting. Auto-fix where possible.
3. **Type check** — run the type checker if available.
4. **Build** — compile/build the project.
5. **Test** — run the full test suite (acceptance + existing).

For each failing gate:

- Read the error output carefully
- Fix the issue (in production code, never in tests)
- Re-run the gate
- After fixing, re-run ALL gates to check for regressions
- Maximum 3 fix attempts per gate — escalate to user if still failing

Skip gates the project doesn't have (note as N/A). Tests are the only mandatory gate.

Full quality gate reference: [Quality Gates](./quality-gates.md).

---

## Phase 5 — Refactor

**Precondition**: all tests are green AND all quality gates pass
**Goal**: improve code structure without changing behavior

- Run tests after every change — if any turn red, revert
- Refactoring changes _structure_ (naming, duplication, organization), never _behavior_
- Do not add features during refactor; that requires a new spec
- Re-run all quality gates after refactoring is complete

---

## Phase 6 — Spec & Doc Sync (Hard Gate)

This is a **hard, blocking gate**. The cycle does not complete until every check below either
passes or has been **fixed in this phase** (not deferred). Spec drift is the most common silent
failure of AI-assisted development; the cure is to require the agent to repair drift before
declaring done, not to surface it as a "recommendation."

### Sub-phase 6a — Spec Compliance

Verify that the implementation actually satisfies the spec:

- Every scenario in the `.feature` file has a corresponding test
- Every numbered business rule in the technical spec is enforced (with a test that would catch
  a violation)
- No implementation behavior exists without a spec scenario
- The `.feature` file remains accurate documentation of current behavior — every `Then` step
  describes what the code actually does today

### Sub-phase 6b — Spec Drift Repair (mandatory if drift found)

Drift exists when, for example:

- The implementation supports inputs/outputs not described in any scenario
- A business rule was relaxed, tightened, or removed during implementation
- Validation messages, status codes, or error shapes differ from the spec
- A new edge case was handled but no `@edge-case` scenario describes it

For each drift item: **update the spec file first** (`.feature` and/or `-spec.md`), then add or
adjust a test that would catch a regression, then re-run the full test suite. Do not declare
Phase 6 complete with known drift.

#### Classify every repair before applying it

"Update the spec to match the code" is safe in one direction and dangerous in the other. A rule
quietly relaxed during implementation, then written back into the spec, makes the weakening
invisible and permanently blessed. So every repair is classified first:

| Class          | Meaning                                                          | Authority to apply     |
| -------------- | ---------------------------------------------------------------- | ---------------------- |
| **ADDED**      | The spec gains a scenario or rule it did not have                | Apply freely           |
| **MODIFIED**   | An existing scenario or rule changes shape, keeping every guarantee | Apply freely        |
| **REMOVED**    | A guarantee the spec made is no longer promised                  | **Confirmation first** |

**The test for REMOVED:** _would a test written against the old spec still pass against the new
one?_ If no, the repair is a **spec weakening**. This covers a deleted scenario, a deleted `Then`
step, a widened accepted range, a removed validation, a relaxed limit, an error case that becomes
a permitted case, or a status code that changes from failure to success.

A **MODIFIED** repair must preserve every `Then` step the current spec has for that scenario.
Dropping one is a REMOVED, not a MODIFIED, no matter how the rest of the scenario is rewritten.

#### Handling a spec weakening

A weakening is never applied silently under "match the code." How it resolves depends on the
autonomy mode chosen at the Phase 1 gate:

- **Mode (b) — check first**: stop on that item, show what the spec promises today, what the code
  actually does, and which of the two you believe is the mistake. Ask whether to narrow the spec
  or fix the code to honor it. Apply only the answer given. Continue repairing other items
  meanwhile.
- **Mode (a) — hands-off**: do not stop. Default to **preserving the spec** — change the
  implementation to honor what the spec promises, and record the item as
  _"code corrected to honor spec"_. Hands-off authorizes uninterrupted work; it never authorizes
  narrowing the spec. Stop only if honoring the spec is genuinely impossible (an external
  constraint makes it unachievable) — that is a real gate, not a routine interruption.

Every weakening, however resolved, is recorded in the Spec Weakenings table of the Phase 6
report. The gate does not pass while a row lacks a resolution.

### Sub-phase 6c — Documentation Sync

Verify the user-facing documentation reflects what the code now does. Work through the
`Sources consulted` list recorded in `docs/project-profile.md` and check every doc that could
describe the changed behavior. Update in this order:

1. **`README.md`** — if the feature is user-visible, confirm the README's feature list, usage
   examples, configuration table, or CLI flags are accurate. Update them in this phase if not.
2. **`CONTRIBUTING.md`** — if the change affects how contributors build, test, or submit work
   (new commands, new gates, changed branch conventions), update it.
3. **`ARCHITECTURE.md` / `docs/architecture.md`** — if a new module, layer, or integration
   pattern was introduced, record it here.
4. **`docs/adr/` or `docs/decisions/`** — if the implementation required an architectural
   decision that isn't already captured, add a new ADR. Never silently diverge from an existing
   ADR without recording the override.
5. **Style guides, coding standards, or runbooks** — if a new pattern was established that
   future contributors should follow, record it in whichever doc the project uses.
6. **`docs/project-profile.md`** — if Phase 3 introduced new conventions, dependencies, or
   reference files, update the profile so future runs match.
7. **Any other doc listed under `Sources consulted`** that describes the changed behavior —
   review it; update if stale. Do not create new doc files unless the user asks.

For each doc in `Sources consulted`: either confirm it is still accurate, update it, or record
it as N/A with a reason. Do not skip sources silently.

If a user-visible behavior change has no doc update, the gate has not passed.

### Sub-phase 6d — Final Verification

After every fix above:

- Re-run the full test suite — must be green
- Re-run all available quality gates — must pass
- Produce the Spec & Doc Sync report — a table where every row (spec compliance, drift
  repaired, spec weakenings, README, project profile, other docs, tests, quality gates) is ✅ or
  an explicit ⏭️ with a reason (the `/verify-spec-coverage` prompt/command defines the full format)
- The **Spec Weakenings** table must be empty, or every row must carry a recorded resolution

Only when all four sub-phases pass does the cycle proceed to Phase 7.

---

## Phase 7 — Archive & Merge

**Precondition**: Phase 6 passed with no unresolved rows.

The change has been built and verified; now it becomes part of the truth. Merge
`specs/changes/<name>/delta.feature` into `specs/capabilities/<domain>/behavior.feature`, merge
the rule deltas into `rules.md`, then move the change folder to
`specs/changes/archive/<YYYY-MM-DD>-<name>/`.

This runs **before** the PR so the merged capability and the archived change ship together —
otherwise archiving needs a pull request of its own.

Key guarantees, in full in the `/archive-change` command:

- **Preflight before mutating.** Resolve every delta tag against the capability, check
  `@modified:` completeness and the merged tag budget, and settle the archive destination first.
  Any failure leaves the tree untouched — a half-merged capability is worse than a refused archive.
- **No guessing.** An `@modified:`/`@removed:`/`@renamed:` naming a scenario the capability does
  not have is an error to report, not an intent to infer.
- **No silent narrowing.** A `@modified:` missing a `Then` the capability has is a blocked
  archive.
- **No stacked date prefixes** on a change name that already carries one.
- **No stray delta tags** left in a capability file.
- **No capability deletion** without `retire_capability: true` in the change's `.atdd.yaml`.
- **Idempotent.** Running it twice produces an identical tree.

## Phase 8 — PR

1. Create a feature branch: `feat/<feature-name>`
2. Commit with a meaningful message referencing the change
3. Push and create a PR with the proposal as the description
4. Include quality gate results and the archive summary in the PR body

Whether to ask first depends on the autonomy mode chosen at the Phase 1 gate:

- **Mode (a) — hands-off**: proceed automatically. Do not ask.
- **Mode (b) — check first**: this is the one additional stop. Show the branch name, commit
  message, and PR title, ask _"Ready to push and open the PR?"_, then proceed on approval.

## Phase 9 — Review + Address Comments

Runs automatically in **both** modes — mode (b)'s single stop was Phase 8, so do not stop again.

1. Poll for the review (every 60s, up to 5 minutes) if one was requested
2. Address every comment: style/naming → fix implementation; bug → test first, then fix;
   behavior change → **spec first**, then test, then implement; question → reply on the PR
3. Re-run all quality gates, commit, and push to the same branch
4. If no review arrives within the timeout, do not block — report the PR URL and point the user
   at `/address-review-comments <PR-number>`

---

## Spec Change Protocol

When requirements change _after_ tests have been written:

1. Update the spec first — `specs/changes/<name>/delta.feature` while the change is in flight,
   or `specs/capabilities/<domain>/behavior.feature` if it was already archived
2. Update `delta-rules.md` (or the capability's `rules.md`) if rules/contracts changed
3. Update or add test stubs to match the new spec
4. Confirm new/changed tests are red
5. Update implementation to pass the new tests
6. Confirm all tests are green
7. Walk the `Sources consulted` list in `docs/project-profile.md` and update every doc that
   describes the changed behavior (README, CONTRIBUTING, ARCHITECTURE, ADRs, style guides,
   runbooks) — this is part of the change, not a follow-up
8. Update `docs/project-profile.md` if the change introduced a new convention or dependency

**Never** update implementation to accommodate new behavior without first updating the spec and
confirming red tests. **Never** declare a behavior change "done" while the spec, README, or
project profile still describe the old behavior.

---

## Spec Directory Layout

Specs are two-tier: **capabilities** hold current truth, **changes** hold work in flight.

```
specs/
├── capabilities/                    # Source of truth — what the system does today
│   └── <domain>/                    #   e.g. task-management, billing, auth
│       ├── behavior.feature         #   complete current Gherkin, no delta tags
│       └── rules.md                 #   numbered business rules and contracts
└── changes/                         # Proposed modifications, one folder each
    ├── <change-name>/
    │   ├── proposal.md              #   why and scope
    │   ├── delta.feature            #   only the scenarios this change touches
    │   ├── delta-rules.md           #   only the rules this change touches
    │   ├── tasks.md                 #   implementation checklist
    │   └── .atdd.yaml               #   optional declarations (see below)
    └── archive/                     # Merged and preserved
        └── <YYYY-MM-DD>-<name>/
```

### Change metadata (`.atdd.yaml`)

Optional, and absent for most changes. It exists to make three judgement calls checkable rather
than leaving them as prose in a report. Template:
[`templates/atdd-metadata.template.yaml`](./templates/atdd-metadata.template.yaml).

| Key                 | Effect                                                                                          |
| ------------------- | ----------------------------------------------------------------------------------------------- |
| `skip_specs`        | Declares the change alters no behavior. Phase 6 accepts an empty delta; Phase 7 merges nothing. Setting it while the delta files carry content is an **error** — the files win |
| `retire_capability` | Authorizes Phase 7 to delete a capability this change empties. Without it, archive stops         |
| `spec_weakenings`   | Every guarantee narrowed under Phase 6b, with how it resolved and on whose authority             |

`spec_weakenings` is what gives Phase 6b's confirmations a durable home: it travels with the
change into the archive, so the reason a guarantee was dropped outlives the conversation that
agreed to it.

**Why two tiers.** With one file per feature, the second change touching a domain produces a
second file, and nothing says which is authoritative. Phase 6 can verify a file against the code
but never files against each other, so contradictions between them are structurally invisible.
Capabilities give every domain exactly one current description; changes stay separate until
Phase 7 merges them in.

A change never edits a capability file directly. It writes a delta, gets approved, gets built,
and merges at archive time. Delta grammar: [Gherkin Conventions § Delta Tags](./gherkin.md#delta-tags).

---

## Related Documents

- [Quality gates](./quality-gates.md) — quality gate definitions and execution
- [Project detection](./project-detection.md) — language and framework detection for any project
- [Legacy integration](./legacy-integration.md) — integrating into existing projects
- [Spec writing guide](./spec-writing.md) — how to write clear, testable specifications
- [Gherkin conventions](./gherkin.md) — syntax, formatting, step writing, anti-patterns
- [ATDD checklist](./checklist.md) — per-feature tracking checklist
- [Feature file template](./templates/feature.template.md)
- [Technical spec template](./templates/tech-spec.template.md)
