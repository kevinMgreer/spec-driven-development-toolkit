#!/usr/bin/env bash
set -euo pipefail

# install.sh — Install the Spec-Driven ATDD Toolkit into a target project
#
# Usage:
#   ./install.sh <target-project-path> [options]
#
# Options:
#   --all          Install all platform configs (default)
#   --vscode       Install VS Code (Copilot) config only
#   --cursor       Install Cursor config only
#   --kiro         Install Kiro config only
#   --claude       Install Claude config only
#   --agents       Install AGENTS.md only
#   --docs-only    Install only docs/ and specs/ (no platform config)
#   --no-examples  Skip example specs in specs/
#   --force        Overwrite existing files without prompting
#   --dry-run      Show what would be copied without actually copying

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET=""
PLATFORMS=()
DOCS_ONLY=false
NO_EXAMPLES=false
FORCE=false
DRY_RUN=false

usage() {
    echo "Usage: $0 <target-project-path> [options]"
    echo ""
    echo "Options:"
    echo "  --all          Install all platform configs (default)"
    echo "  --vscode       Install VS Code (Copilot) config"
    echo "  --cursor       Install Cursor config"
    echo "  --kiro         Install Kiro config"
    echo "  --claude       Install Claude config"
    echo "  --agents       Install AGENTS.md"
    echo "  --docs-only    Install only docs/ and specs/"
    echo "  --no-examples  Skip example specs"
    echo "  --force        Overwrite without prompting"
    echo "  --dry-run      Show what would be copied"
    exit 1
}

# Parse arguments
while [[ $# -gt 0 ]]; do
    case "$1" in
        --all)        PLATFORMS=(vscode cursor kiro claude agents); shift ;;
        --vscode)     PLATFORMS+=(vscode); shift ;;
        --cursor)     PLATFORMS+=(cursor); shift ;;
        --kiro)       PLATFORMS+=(kiro); shift ;;
        --claude)     PLATFORMS+=(claude); shift ;;
        --agents)     PLATFORMS+=(agents); shift ;;
        --docs-only)  DOCS_ONLY=true; PLATFORMS=(); shift ;;
        --no-examples) NO_EXAMPLES=true; shift ;;
        --force)      FORCE=true; shift ;;
        --dry-run)    DRY_RUN=true; shift ;;
        --help|-h)    usage ;;
        -*)           echo "Unknown option: $1"; usage ;;
        *)
            if [[ -z "$TARGET" ]]; then
                TARGET="$1"
            else
                echo "Unexpected argument: $1"; usage
            fi
            shift
            ;;
    esac
done

if [[ -z "$TARGET" ]]; then
    echo "Error: target project path is required."
    usage
fi

# Default to all platforms if none specified and user didn't request docs-only
if [[ ${#PLATFORMS[@]} -eq 0 && "$DOCS_ONLY" != "true" ]]; then
    PLATFORMS=(vscode cursor kiro claude agents)
fi

# Resolve target to absolute path
TARGET="$(cd "$TARGET" 2>/dev/null && pwd || echo "$TARGET")"

if [[ ! -d "$TARGET" ]]; then
    echo "Error: target directory '$TARGET' does not exist."
    exit 1
fi

copy_dir() {
    local src="$1"
    local dest="$2"
    local label="$3"

    if [[ ! -d "$src" ]]; then
        echo "  SKIP $label (source not found)"
        return
    fi

    if [[ "$DRY_RUN" == true ]]; then
        echo "  WOULD COPY $label → $dest"
        return
    fi

    if [[ -d "$dest" ]] && [[ "$FORCE" != true ]]; then
        echo "  MERGE $label → $dest (existing files preserved)"
        cp -rn "$src/." "$dest/" 2>/dev/null || cp -r --no-clobber "$src/." "$dest/" 2>/dev/null || {
            # Fallback: rsync if cp -n not supported
            rsync -a --ignore-existing "$src/" "$dest/"
        }
    else
        mkdir -p "$dest"
        cp -r "$src/." "$dest/"
        echo "  COPY  $label → $dest"
    fi
}

copy_file() {
    local src="$1"
    local dest="$2"
    local label="$3"

    if [[ ! -f "$src" ]]; then
        echo "  SKIP $label (source not found)"
        return
    fi

    if [[ "$DRY_RUN" == true ]]; then
        echo "  WOULD COPY $label → $dest"
        return
    fi

    if [[ -f "$dest" ]] && [[ "$FORCE" != true ]]; then
        echo "  EXISTS $label (skipped — use --force to overwrite)"
        return
    fi

    mkdir -p "$(dirname "$dest")"
    cp "$src" "$dest"
    echo "  COPY  $label → $dest"
}

echo "Installing Spec-Driven ATDD Toolkit"
echo "  Source: $SCRIPT_DIR"
echo "  Target: $TARGET"
echo ""

# Always install docs and specs structure
echo "Core (always installed):"
copy_dir "$SCRIPT_DIR/docs/atdd" "$TARGET/docs/atdd" "docs/atdd/"
mkdir -p "$TARGET/specs/features" "$TARGET/specs/technical" 2>/dev/null || true
echo "  ENSURE specs/features/ and specs/technical/ exist"

if [[ "$NO_EXAMPLES" != true ]]; then
    copy_dir "$SCRIPT_DIR/specs" "$TARGET/specs" "specs/ (examples)"
fi

echo ""

# Install platform-specific configs
for platform in "${PLATFORMS[@]}"; do
    case "$platform" in
        vscode)
            echo "VS Code (Copilot):"
            copy_dir "$SCRIPT_DIR/.github/agents" "$TARGET/.github/agents" ".github/agents/"
            copy_dir "$SCRIPT_DIR/.github/instructions" "$TARGET/.github/instructions" ".github/instructions/"
            copy_dir "$SCRIPT_DIR/.github/prompts" "$TARGET/.github/prompts" ".github/prompts/"
            copy_dir "$SCRIPT_DIR/.github/skills" "$TARGET/.github/skills" ".github/skills/"
            copy_file "$SCRIPT_DIR/.github/copilot-instructions.md" "$TARGET/.github/copilot-instructions.md" "copilot-instructions.md"
            # Write .vscode/mcp.json for spec-mcp-server if not already present
            MCP_CONFIG="$TARGET/.vscode/mcp.json"
            if [[ ! -f "$MCP_CONFIG" ]] || [[ "$FORCE" == true ]]; then
                if [[ "$DRY_RUN" == true ]]; then
                    echo "  WOULD WRITE .vscode/mcp.json (spec-mcp-server config)"
                else
                    mkdir -p "$TARGET/.vscode"
                    cat > "$MCP_CONFIG" << 'EOF'
{
  "servers": {
    "spec-mcp-server": {
      "type": "stdio",
      "command": "spec-mcp-server",
      "env": {
        "SPECS_DIR": "${workspaceFolder}/specs"
      }
    }
  }
}
EOF
                    echo "  WRITE .vscode/mcp.json (spec-mcp-server config)"
                fi
            else
                echo "  EXISTS .vscode/mcp.json (skipped — use --force to overwrite)"
            fi
            ;;
        cursor)
            echo "Cursor:"
            copy_dir "$SCRIPT_DIR/.cursor/rules" "$TARGET/.cursor/rules" ".cursor/rules/"
            ;;
        kiro)
            echo "Kiro:"
            copy_dir "$SCRIPT_DIR/.kiro/steering" "$TARGET/.kiro/steering" ".kiro/steering/"
            ;;
        claude)
            echo "Claude:"
            copy_file "$SCRIPT_DIR/CLAUDE.md" "$TARGET/CLAUDE.md" "CLAUDE.md"
            ;;
        agents)
            echo "AGENTS.md:"
            copy_file "$SCRIPT_DIR/AGENTS.md" "$TARGET/AGENTS.md" "AGENTS.md"
            ;;
    esac
    echo ""
done

echo "Done. Run '/analyze-project' in your IDE to detect the project's stack."
