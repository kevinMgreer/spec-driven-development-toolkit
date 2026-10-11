# Tasks Template

Copy to `specs/changes/<change-name>/tasks.md` and fill in the placeholders.

Phase 7 (Archive) checks these: in mode (b) it stops and asks before archiving with boxes left
unchecked, and in mode (a) it reports the count and continues. Either way the count is reported,
so keep this current as you work.

---

# `<Change Name>` — Tasks

## 1. Tests (Red)

- [ ] 1.1 Write the test file, header `// Spec: specs/capabilities/<domain>/behavior.feature`
- [ ] 1.2 One test per delta scenario, each throwing "not implemented"
- [ ] 1.3 Confirm every test fails for the right reason

## 2. Implementation (Green)

- [ ] 2.1 Re-read `docs/project-profile.md`; state the conventions being followed
- [ ] 2.2 `@smoke` scenario passing
- [ ] 2.3 `@happy-path` scenarios passing
- [ ] 2.4 `@edge-case` scenarios passing
- [ ] 2.5 `@error` scenarios passing

## 3. Quality

- [ ] 3.1 Lint, format, typecheck, build, test all green
- [ ] 3.2 Refactor with tests green; re-run all gates

## 4. Sync

- [ ] 4.1 Phase 6 Spec & Doc Sync report has no unresolved rows
- [ ] 4.2 Spec Weakenings table empty or fully resolved
