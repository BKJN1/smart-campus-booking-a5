# Task #06 — Agent-readiness audit (final version)

| Area | Baseline (d5af111) | Final | Evidence |
|---|---|---|---|
| Readable structure | ✅ clear `lib/` vs `components/`; domain is pure | ✅ + parsing and status view separated | README repo map |
| README accuracy | ❌ no README | ✅ commands, map, rules — every command in it was run | `final/*.txt` |
| Reproducible setup | ⚠️ lockfile present, but no Node version, `npm install` habit | ✅ `npm ci` + Node 24.13.1 documented; `npm ci` re-run from clean | `final/00-npm-ci.txt` |
| Pinned dependencies | ⚠️ `^` ranges in package.json, exact versions only in lockfile | ⚠️ same (lockfile is the pin) | `package-lock.json` |
| Tests | ⚠️ 19 domain tests, **no `npm test` script** | ✅ `npm test`, 34 tests incl. parser + view-model | `baseline/02-npm-test.txt` vs `final/01-test.txt` |
| Lint / type checks | ✅ both exit 0 | ✅ + single gate `npm run check` | `final/02,03` |
| Build | ✅ | ✅ | `final/04-build.txt` |
| UI verification | ❌ manual only | ⚠️ scripted (`scripts/ui-states.py`) but needs Python Playwright; not in CI | `final/07-ui-states.txt` |
| Logging | ⚠️ none — acceptable for a client-only demo; no error reporting | ⚠️ unchanged | — |
| Security safeguards | ⚠️ `.env` only; prod dep with high vuln | ✅ `.env.*` ignored, prod audit 0, no secrets (`git grep`), no network calls | `verification/06`, `final/05` |
| CI | ❌ none | ❌ none | — |
| AGENTS.md: permissions / safe commands | ❌ no file | ✅ §4 safe-command table with expected results | `AGENTS.md` |
| AGENTS.md: prohibited actions | ❌ | ✅ §6: secrets, deploys, destructive cmds, dependency changes, weakening tests, scope | `AGENTS.md` |
| AGENTS.md: review gates | ❌ | ✅ §7: agent gate (`npm run check`), human diff review, human merge | `AGENTS.md` |
| Enforcement of rules | ❌ | ❌ no `.claude/settings.json` deny rules / hooks (R-06) | `verification/04` |

## Readiness level: **2 — Documented** (baseline was **1 — Baseline**)
Why not 1: purpose, architecture, setup, safe commands, prohibited actions, review gates and a one-command gate exist
and were executed with recorded results.
Why not 3 (Agent-ready): an agent's work cannot yet be verified and constrained **automatically**:
1. No CI running `npm run check` on every branch/PR.
2. Rules are advisory — no permission deny rules or hooks (R-06).
3. UI check not automated in the test runner; Python Playwright not pinned in the repo.
4. 24 dev-dependency advisories incl. 2 critical (R-07) open.
5. No logging/error reporting to diagnose failures of agent-made changes at runtime.
