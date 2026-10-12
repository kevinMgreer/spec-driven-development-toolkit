# `scope-retired-path-cleanup` — Rule Deltas

| Field          | Value |
| -------------- | ----- |
| **Capability** | `toolkit-installation` |
| **Rules file** | `specs/capabilities/toolkit-installation/rules.md` |

## ADDED Rules

### 1. Retired-file cleanup respects installation scope

An all-platform install may remove every path in the toolkit's retired-path list. A platform-scoped install removes only retired paths belonging to its selected platform or platforms. A docs-only install does not remove platform configuration.

**Example:** An `--agents` install leaves retired `.github/` and `.claude/` paths untouched.

### 2. Dry runs do not mutate retired paths

A dry run reports each existing retired path it would remove, but leaves those files and all parent directories unchanged.

**Example:** `--dry-run` reports a retired file while that file still exists after the command completes.

### 3. Empty-directory cleanup preserves non-empty directories

After removing a retired file, the installer prunes empty parent directories up to, but not including, the target directory. A directory containing any other entry remains.

**Example:** A retired file's empty `.claude/commands/` directory is removed; a directory containing an unrelated file is retained.

## MODIFIED Rules

None.

## REMOVED Rules

None.
