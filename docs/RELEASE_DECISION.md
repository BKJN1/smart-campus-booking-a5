# Task #09 — Release decision for `main` @ final commit

## Decision: **CONDITIONAL**

| Evidence | Result |
|---|---|
| Critical checks | lint ✅ · typecheck ✅ · **34/34 tests** ✅ · build ✅ · `npm audit --omit=dev` **0** ✅ |
| Acceptance criteria | RC1 ✅ (T01–T19 unchanged, pass) · RC2 ✅ (T17, T19) · RC3 ✅ · RC4 ✅ (UI states same text; screenshots identical / ≤2/255) · RC5 ✅ (no secrets, no network calls) |
| Risk register | Top risks R-01 (6→3) and R-03 (4→1) mitigated and verified; R-02 4→1. No confirmed open risk above 4. |
| Readiness | Level 2 — Documented |

Why not **GO**: known limitations remain that need explicit controls — open dev-toolchain advisories (R-07, includes
2 critical), agent rules not enforced (R-06), no CI.
Why not **NO-GO**: none of them affects the shipped bundle or a user's booking decision; every critical check passes
and the two highest confirmed risks are closed with failing-before / passing-after tests.

## Conditions (each with owner and control)
| # | Condition | Control | Owner | Due |
|---|---|---|---|---|
| C1 | Release only the static `dist/` build; dev server never exposed beyond localhost | Build with `npm ci && npm run check`; deploy step done by a human | Argin Bekezhan | every release |
| C2 | R-07 dev advisories | Isolated upgrade per `docs/BACKGROUND_AGENT_TASK.md`; no untrusted test inputs meanwhile | Argin Bekezhan | next iteration |
| C3 | R-06 rules not enforced | Human reviews every agent diff before merge (AGENTS.md §7); add deny rules next | Argin Bekezhan | next iteration |
| C4 | R-08 data validation | Must be done before bookings come from any real data source | Argin Bekezhan | before backend work |
