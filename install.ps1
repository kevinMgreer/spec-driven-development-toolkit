# install.ps1 — Install the Spec-Driven ATDD Toolkit into a target project
#
# Usage:
#   .\install.ps1 -Target <target-project-path> [options]
#
# Examples:
#   .\install.ps1 -Target C:\repos\my-project
#   .\install.ps1 -Target ..\my-project -Platforms vscode
#   .\install.ps1 -Target ..\my-project -Platforms vscode,cursor -NoExamples
#   .\install.ps1 -Target ..\my-project -DryRun

[CmdletBinding()]
param(
    [Parameter(Mandatory = $true, Position = 0)]
    [string]$Target,

    [ValidateSet('all', 'vscode', 'cursor', 'kiro', 'claude', 'agents', 'docs-only')]
    [string[]]$Platforms = @('all'),

    [switch]$NoExamples,
    [switch]$Force,
    [switch]$DryRun
)

$ErrorActionPreference = 'Stop'
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$Target = Resolve-Path -Path $Target -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Path

if (-not $Target) {
    $Target = $PSBoundParameters['Target']
    if (-not (Test-Path $Target)) {
        Write-Error "Target directory '$($PSBoundParameters['Target'])' does not exist."
        return
    }
    $Target = (Resolve-Path $Target).Path
}

# Expand 'all' to all platforms
if ($Platforms -contains 'all') {
    $Platforms = @('vscode', 'cursor', 'kiro', 'claude', 'agents')
}
if ($Platforms -contains 'docs-only') {
    $Platforms = @()
}

function Copy-Directory {
    param([string]$Source, [string]$Destination, [string]$Label)

    if (-not (Test-Path $Source)) {
        Write-Host "  SKIP $Label (source not found)" -ForegroundColor Yellow
        return
    }

    if ($DryRun) {
        Write-Host "  WOULD COPY $Label -> $Destination" -ForegroundColor Cyan
        return
    }

    if ((Test-Path $Destination) -and -not $Force) {
        # Merge: copy only files that don't exist
        Write-Host "  MERGE $Label -> $Destination (existing files preserved)" -ForegroundColor Green
        $files = Get-ChildItem -Path $Source -Recurse -File
        foreach ($file in $files) {
            $relativePath = $file.FullName.Substring($Source.Length)
            $destFile = Join-Path $Destination $relativePath
            if (-not (Test-Path $destFile)) {
                $destDir = Split-Path -Parent $destFile
                if (-not (Test-Path $destDir)) {
                    New-Item -ItemType Directory -Path $destDir -Force | Out-Null
                }
                Copy-Item $file.FullName $destFile
            }
        }
    }
    else {
        if (-not (Test-Path $Destination)) {
            New-Item -ItemType Directory -Path $Destination -Force | Out-Null
        }
        Copy-Item -Path "$Source\*" -Destination $Destination -Recurse -Force
        Write-Host "  COPY  $Label -> $Destination" -ForegroundColor Green
    }
}

function Copy-SingleFile {
    param([string]$Source, [string]$Destination, [string]$Label)

    if (-not (Test-Path $Source)) {
        Write-Host "  SKIP $Label (source not found)" -ForegroundColor Yellow
        return
    }

    if ($DryRun) {
        Write-Host "  WOULD COPY $Label -> $Destination" -ForegroundColor Cyan
        return
    }

    if ((Test-Path $Destination) -and -not $Force) {
        Write-Host "  EXISTS $Label (skipped - use -Force to overwrite)" -ForegroundColor Yellow
        return
    }

    $destDir = Split-Path -Parent $Destination
    if (-not (Test-Path $destDir)) {
        New-Item -ItemType Directory -Path $destDir -Force | Out-Null
    }
    Copy-Item $Source $Destination -Force
    Write-Host "  COPY  $Label -> $Destination" -ForegroundColor Green
}

Write-Host "Installing Spec-Driven ATDD Toolkit" -ForegroundColor White
Write-Host "  Source: $ScriptDir"
Write-Host "  Target: $Target"
Write-Host ""

# Always install docs and specs structure
Write-Host "Core (always installed):" -ForegroundColor White
Copy-Directory "$ScriptDir\docs\atdd" "$Target\docs\atdd" "docs/atdd/"

# Ensure specs directories exist
@("$Target\specs\features", "$Target\specs\technical") | ForEach-Object {
    if (-not (Test-Path $_)) {
        if (-not $DryRun) { New-Item -ItemType Directory -Path $_ -Force | Out-Null }
    }
}
Write-Host "  ENSURE specs/features/ and specs/technical/ exist" -ForegroundColor Green

if (-not $NoExamples) {
    Copy-Directory "$ScriptDir\specs" "$Target\specs" "specs/ (examples)"
}

Write-Host ""

# Install platform-specific configs
foreach ($platform in $Platforms) {
    switch ($platform) {
        'vscode' {
            Write-Host "VS Code (Copilot):" -ForegroundColor White
            Copy-Directory "$ScriptDir\.github\agents" "$Target\.github\agents" ".github/agents/"
            Copy-Directory "$ScriptDir\.github\instructions" "$Target\.github\instructions" ".github/instructions/"
            Copy-Directory "$ScriptDir\.github\prompts" "$Target\.github\prompts" ".github/prompts/"
            Copy-Directory "$ScriptDir\.github\skills" "$Target\.github\skills" ".github/skills/"
            Copy-SingleFile "$ScriptDir\.github\copilot-instructions.md" "$Target\.github\copilot-instructions.md" "copilot-instructions.md"
        }
        'cursor' {
            Write-Host "Cursor:" -ForegroundColor White
            Copy-Directory "$ScriptDir\.cursor\rules" "$Target\.cursor\rules" ".cursor/rules/"
        }
        'kiro' {
            Write-Host "Kiro:" -ForegroundColor White
            Copy-Directory "$ScriptDir\.kiro\steering" "$Target\.kiro\steering" ".kiro/steering/"
        }
        'claude' {
            Write-Host "Claude:" -ForegroundColor White
            Copy-SingleFile "$ScriptDir\CLAUDE.md" "$Target\CLAUDE.md" "CLAUDE.md"
        }
        'agents' {
            Write-Host "AGENTS.md:" -ForegroundColor White
            Copy-SingleFile "$ScriptDir\AGENTS.md" "$Target\AGENTS.md" "AGENTS.md"
        }
    }
    Write-Host ""
}

Write-Host "Done. Run '/analyze-project' in your IDE to detect the project's stack." -ForegroundColor Green
