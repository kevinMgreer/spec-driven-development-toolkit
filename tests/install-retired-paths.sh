#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TEMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TEMP_DIR"' EXIT

fail() {
    echo "FAIL: $*" >&2
    exit 1
}

assert_exists() {
    [[ -e "$1" ]] || fail "expected path to exist: $1"
}

assert_missing() {
    [[ ! -e "$1" ]] || fail "expected path to be absent: $1"
}

seed_retired_paths() {
    local target="$1"
    mkdir -p "$target/.github/agents" "$target/.claude/commands" \
        "$target/.cursor/rules" "$target/.kiro/steering"
    touch "$target/.github/agents/full-autonomous-cycle.agent.md"
    touch "$target/.claude/commands/full-autonomous-cycle.md"
    touch "$target/.cursor/rules/atdd-core.mdc"
    touch "$target/.kiro/steering/atdd-core.md"
}

echo "Testing full install cleanup and empty-directory pruning"
target="$TEMP_DIR/full"
mkdir -p "$target"
seed_retired_paths "$target"
mkdir -p "$target/.claude/commands"
touch "$target/.claude/commands/keep.txt"
"$SCRIPT_DIR/install.sh" "$target" --all >/dev/null
assert_missing "$target/.github/agents/full-autonomous-cycle.agent.md"
assert_missing "$target/.claude/commands/full-autonomous-cycle.md"
assert_missing "$target/.cursor/rules/atdd-core.mdc"
assert_missing "$target/.kiro/steering/atdd-core.md"
assert_missing "$target/.cursor"
assert_missing "$target/.kiro"
assert_exists "$target/.claude/commands/keep.txt"

echo "Testing VS Code scope"
target="$TEMP_DIR/vscode"
mkdir -p "$target"
seed_retired_paths "$target"
"$SCRIPT_DIR/install.sh" "$target" --vscode >/dev/null
assert_missing "$target/.github/agents/full-autonomous-cycle.agent.md"
assert_exists "$target/.claude/commands/full-autonomous-cycle.md"
assert_exists "$target/.cursor/rules/atdd-core.mdc"
assert_exists "$target/.kiro/steering/atdd-core.md"

echo "Testing Claude scope"
target="$TEMP_DIR/claude"
mkdir -p "$target"
seed_retired_paths "$target"
"$SCRIPT_DIR/install.sh" "$target" --claude >/dev/null
assert_exists "$target/.github/agents/full-autonomous-cycle.agent.md"
assert_missing "$target/.claude/commands/full-autonomous-cycle.md"
assert_exists "$target/.cursor/rules/atdd-core.mdc"
assert_exists "$target/.kiro/steering/atdd-core.md"

echo "Testing agents scope"
target="$TEMP_DIR/agents"
mkdir -p "$target"
seed_retired_paths "$target"
"$SCRIPT_DIR/install.sh" "$target" --agents >/dev/null
assert_exists "$target/.github/agents/full-autonomous-cycle.agent.md"
assert_exists "$target/.claude/commands/full-autonomous-cycle.md"
assert_exists "$target/.cursor/rules/atdd-core.mdc"
assert_exists "$target/.kiro/steering/atdd-core.md"

echo "Testing docs-only scope"
target="$TEMP_DIR/docs-only"
mkdir -p "$target"
seed_retired_paths "$target"
"$SCRIPT_DIR/install.sh" "$target" --docs-only --vscode --all >/dev/null
assert_exists "$target/.github/agents/full-autonomous-cycle.agent.md"
assert_exists "$target/.claude/commands/full-autonomous-cycle.md"
assert_exists "$target/.cursor/rules/atdd-core.mdc"
assert_exists "$target/.kiro/steering/atdd-core.md"
assert_exists "$target/.cursor/rules"
assert_exists "$target/.kiro/steering"

echo "Testing dry-run reporting and non-mutation"
target="$TEMP_DIR/dry-run"
mkdir -p "$target"
seed_retired_paths "$target"
output="$("$SCRIPT_DIR/install.sh" "$target" --all --dry-run)"
[[ "$output" == *"WOULD REMOVE (retired) .claude/commands/full-autonomous-cycle.md"* ]] ||
    fail "dry run did not report a retired path"
assert_exists "$target/.github/agents/full-autonomous-cycle.agent.md"
assert_exists "$target/.claude/commands/full-autonomous-cycle.md"
assert_exists "$target/.cursor/rules/atdd-core.mdc"
assert_exists "$target/.kiro/steering/atdd-core.md"
assert_exists "$target/.github/agents"
assert_exists "$target/.claude/commands"
assert_exists "$target/.cursor/rules"
assert_exists "$target/.kiro/steering"

echo "All retired-path installer checks passed."
