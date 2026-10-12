$ErrorActionPreference = 'Stop'
$Installer = Join-Path (Split-Path -Parent $PSScriptRoot) 'install.ps1'
$TempRoot = Join-Path ([System.IO.Path]::GetTempPath()) ("toolkit-install-tests-" + [guid]::NewGuid())

function Assert-Exists {
    param([string]$Path)
    if (-not (Test-Path $Path)) {
        throw "Expected path to exist: $Path"
    }
}

function Assert-Missing {
    param([string]$Path)
    if (Test-Path $Path) {
        throw "Expected path to be absent: $Path"
    }
}

function New-Target {
    param([string]$Name)
    $Target = Join-Path $TempRoot $Name
    New-Item -ItemType Directory -Path $Target -Force | Out-Null
    return $Target
}

function Add-RetiredPaths {
    param([string]$Target)
    $Paths = @(
        '.github\agents\full-autonomous-cycle.agent.md',
        '.claude\commands\full-autonomous-cycle.md',
        '.cursor\rules\atdd-core.mdc',
        '.kiro\steering\atdd-core.md'
    )
    foreach ($RelativePath in $Paths) {
        $Path = Join-Path $Target $RelativePath
        New-Item -ItemType Directory -Path (Split-Path -Parent $Path) -Force | Out-Null
        New-Item -ItemType File -Path $Path -Force | Out-Null
    }
}

try {
    New-Item -ItemType Directory -Path $TempRoot -Force | Out-Null

    Write-Host 'Testing full install cleanup and empty-directory pruning'
    $Target = New-Target 'full'
    Add-RetiredPaths $Target
    $Keep = Join-Path $Target '.claude\commands\keep.txt'
    New-Item -ItemType File -Path $Keep -Force | Out-Null
    & $Installer -Target $Target -Platforms all | Out-Null
    Assert-Missing (Join-Path $Target '.github\agents\full-autonomous-cycle.agent.md')
    Assert-Missing (Join-Path $Target '.claude\commands\full-autonomous-cycle.md')
    Assert-Missing (Join-Path $Target '.cursor\rules\atdd-core.mdc')
    Assert-Missing (Join-Path $Target '.kiro\steering\atdd-core.md')
    Assert-Missing (Join-Path $Target '.cursor')
    Assert-Missing (Join-Path $Target '.kiro')
    Assert-Exists $Keep

    Write-Host 'Testing VS Code scope'
    $Target = New-Target 'vscode'
    Add-RetiredPaths $Target
    & $Installer -Target $Target -Platforms vscode | Out-Null
    Assert-Missing (Join-Path $Target '.github\agents\full-autonomous-cycle.agent.md')
    Assert-Exists (Join-Path $Target '.claude\commands\full-autonomous-cycle.md')
    Assert-Exists (Join-Path $Target '.cursor\rules\atdd-core.mdc')
    Assert-Exists (Join-Path $Target '.kiro\steering\atdd-core.md')

    Write-Host 'Testing Claude scope'
    $Target = New-Target 'claude'
    Add-RetiredPaths $Target
    & $Installer -Target $Target -Platforms claude | Out-Null
    Assert-Exists (Join-Path $Target '.github\agents\full-autonomous-cycle.agent.md')
    Assert-Missing (Join-Path $Target '.claude\commands\full-autonomous-cycle.md')
    Assert-Exists (Join-Path $Target '.cursor\rules\atdd-core.mdc')
    Assert-Exists (Join-Path $Target '.kiro\steering\atdd-core.md')

    Write-Host 'Testing agents scope'
    $Target = New-Target 'agents'
    Add-RetiredPaths $Target
    & $Installer -Target $Target -Platforms agents | Out-Null
    Assert-Exists (Join-Path $Target '.github\agents\full-autonomous-cycle.agent.md')
    Assert-Exists (Join-Path $Target '.claude\commands\full-autonomous-cycle.md')
    Assert-Exists (Join-Path $Target '.cursor\rules\atdd-core.mdc')
    Assert-Exists (Join-Path $Target '.kiro\steering\atdd-core.md')

    Write-Host 'Testing docs-only scope'
    $Target = New-Target 'docs-only'
    Add-RetiredPaths $Target
    & $Installer -Target $Target -Platforms docs-only, vscode, all | Out-Null
    Assert-Exists (Join-Path $Target '.github\agents\full-autonomous-cycle.agent.md')
    Assert-Exists (Join-Path $Target '.claude\commands\full-autonomous-cycle.md')
    Assert-Exists (Join-Path $Target '.cursor\rules\atdd-core.mdc')
    Assert-Exists (Join-Path $Target '.kiro\steering\atdd-core.md')
    Assert-Exists (Join-Path $Target '.cursor\rules')
    Assert-Exists (Join-Path $Target '.kiro\steering')

    Write-Host 'Testing dry-run reporting and non-mutation'
    $Target = New-Target 'dry-run'
    Add-RetiredPaths $Target
    $Output = & $Installer -Target $Target -Platforms all -DryRun 6>&1 | Out-String
    if ($Output -notmatch 'WOULD REMOVE \(retired\) \.claude\\commands\\full-autonomous-cycle\.md') {
        throw 'Dry run did not report a retired path'
    }
    Assert-Exists (Join-Path $Target '.github\agents\full-autonomous-cycle.agent.md')
    Assert-Exists (Join-Path $Target '.claude\commands\full-autonomous-cycle.md')
    Assert-Exists (Join-Path $Target '.cursor\rules\atdd-core.mdc')
    Assert-Exists (Join-Path $Target '.kiro\steering\atdd-core.md')
    Assert-Exists (Join-Path $Target '.github\agents')
    Assert-Exists (Join-Path $Target '.claude\commands')
    Assert-Exists (Join-Path $Target '.cursor\rules')
    Assert-Exists (Join-Path $Target '.kiro\steering')

    Write-Host 'All retired-path installer checks passed.'
}
finally {
    if (Test-Path $TempRoot) {
        Remove-Item $TempRoot -Recurse -Force
    }
}
