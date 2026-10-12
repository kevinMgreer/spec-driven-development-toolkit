# `scope-retired-path-cleanup` — Tasks

## 1. Tests (Red)

- [x] 1.1 Add installer integration coverage for all-platform removal and empty-directory pruning
- [x] 1.2 Cover scoped-platform preservation, docs-only preservation, and dry-run reporting/non-mutation
- [x] 1.3 Confirm the new scope regression fails against the current installers

## 2. Implementation (Green)

- [x] 2.1 Re-read `docs/project-profile.md` and follow the recorded shell and PowerShell conventions
- [x] 2.2 Filter retired-path cleanup by the selected installer scope
- [x] 2.3 Keep Bash and PowerShell behavior consistent

## 3. Quality

- [x] 3.1 Run the available CI-equivalent checks and installer integration coverage
- [x] 3.2 Validate PowerShell installer behavior where the runtime is available

## 4. Sync

- [x] 4.1 Update README and CONTRIBUTING with cleanup and dry-run behavior
- [x] 4.2 Verify the spec and documentation match the implemented behavior
