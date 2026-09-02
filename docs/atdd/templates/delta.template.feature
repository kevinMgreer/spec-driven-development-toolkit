Feature: <Capability name — must match the capability's Feature: line exactly>
  # delta for change: <change-name>
  # capability: specs/capabilities/<domain>/behavior.feature
  #
  # Only the scenarios this change touches. Every scenario carries exactly one delta tag
  # plus its usual priority tag. Delta grammar: docs/atdd/gherkin.md § Delta Tags.
  #
  # Before writing @modified:/@removed:/@renamed:, read the capability file — the quoted
  # name must match a scenario there exactly.

  # ─── ADDED ────────────────────────────────────────────────────────────────
  # Scenarios the capability does not have yet. Priority tags count toward the
  # MERGED capability's budget: @smoke stays at exactly 1 overall.

  @added @edge-case
  Scenario: <New scenario name>
    Given <precondition>
    When <action>
    Then <observable outcome>

  # ─── MODIFIED ─────────────────────────────────────────────────────────────
  # Replaces the named scenario wholesale. Carry EVERY Then step the capability
  # already has for it — dropping one removes a guarantee, which belongs in a
  # @removed: with confirmation (workflow.md § Phase 6b).

  @modified:"<exact existing scenario name>"
  @happy-path
  Scenario: <same name, or the new name if also renaming>
    Given <precondition>
    When <action>
    Then <every Then the capability had>
    And <plus whatever this change adds>

  # ─── REMOVED ──────────────────────────────────────────────────────────────
  # Steps are optional and ignored. Removing behavior narrows the spec — confirm
  # before proposing one.

  @removed:"<exact existing scenario name>"
  Scenario: <exact existing scenario name>

  # ─── RENAMED ──────────────────────────────────────────────────────────────
  # Retitled in place, not reordered.

  @renamed:"<exact existing scenario name>"
  Scenario: <new scenario name>
