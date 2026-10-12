# Proposal: `scope-retired-path-cleanup`

| Field          | Value |
| -------------- | ----- |
| **Capability** | `toolkit-installation` — new capability |
| **Status**     | Draft |
| **Created**    | 2026-10-12 |

## Why

Re-running an installer with a limited platform selection currently removes retired files belonging to other platforms. This can erase configuration the user did not ask the installer to manage, and makes `--docs-only` and other scoped installs unexpectedly destructive.

## What changes

Define retired-file cleanup as part of toolkit installation. Full installs may remove all known retired toolkit paths; scoped installs remove only retired paths belonging to selected platforms, and docs-only installs leave platform configuration untouched. Dry runs report cleanup without deleting anything.

## In scope

- Remove known retired files during full installs and prune their empty parent directories.
- Restrict cleanup during platform-scoped installs to the selected platform paths.
- Skip platform cleanup for docs-only installs.
- Report planned removals during dry runs without changing files or directories.
- Document the behavior and the distinction between the current installer and an older target installation.

## Out of scope

- Removing arbitrary files not listed as retired.
- Adding or changing platform installation contents unrelated to retired-path cleanup.

## Capability impact

Creates `specs/capabilities/toolkit-installation/behavior.feature` when archived. All scenarios in this delta are additions.
