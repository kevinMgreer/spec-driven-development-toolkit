Feature: Toolkit Installation
  # delta for change: scope-retired-path-cleanup
  # capability: specs/capabilities/toolkit-installation/behavior.feature
  As a toolkit user
  I want installer cleanup to respect the selected installation scope
  So that upgrades remove stale toolkit files without disturbing unrelated configuration

  @added @smoke @happy-path
  Scenario: A full install removes all known retired files
    Given the target project contains files listed as retired by the toolkit
    When I run the installer for all platforms
    Then the retired files should be removed
    And their empty parent directories should be pruned

  @added @edge-case
  Scenario: A platform-scoped install removes only that platform's retired files
    Given the target project contains retired files for multiple platforms
    When I run the installer for one selected platform
    Then only retired files belonging to that platform should be removed
    And retired files belonging to other platforms should remain

  @added @edge-case
  Scenario: A docs-only install preserves platform configuration
    Given the target project contains retired platform configuration
    When I run the installer in docs-only mode
    Then the platform configuration should remain unchanged

  @added @edge-case
  Scenario: A dry run reports cleanup without changing the target
    Given the target project contains files listed as retired by the toolkit
    When I run the installer in dry-run mode
    Then the planned retired-file removals should be reported
    And the retired files and their parent directories should remain unchanged

  @added @edge-case
  Scenario: Non-empty parent directories are preserved
    Given a retired file and an unrelated file share a parent directory
    When I run the installer for all platforms
    Then the retired file should be removed
    And the parent directory and unrelated file should remain
