# AGENTS.md — Smart Campus Room Availability

Instructions for AI coding agents (Claude Code, Codex, Copilot agent, etc.) working in this repository.
Humans: see `README.md`. Claude Code loads this file through `CLAUDE.md` (`@AGENTS.md` import).

## 1. Purpose
A single-page React app that answers one question: *is Room B-204 free for the requested interval?*
Times are integers = minutes after midnight (600 = 10:00, day = 0–1440). Data is in-memory sample data only;
there is no backend, no login, no network call and no persistence.

## 2. Architecture (keep this shape)
| Layer | File | Rule |
|---|---|---|
| Domain (pure) | `src/lib/booking.ts` | `checkAvailability()` = all booking rules (AC1–AC5). No React, no I/O, never mutates inputs. |
| UI | `src/App.tsx`, `src/components/*` | Presentation only. Do not put booking rules in components. |
| Tests | `src/lib/*.test.ts` (Vitest) | One test file per lib module. |

Domain rules (do not change without an explicit request): AC1 valid integer interval 0 ≤ start < end ≤ 1440 and
start > current time · AC2 duration ≤ 120 min · AC3 blocked room rejected · AC4 no overlap, touching endpoints allowed ·
AC5 existing bookings never mutated.

## 3. Setup
- Node.js 24.x (verified with v24.13.1, npm 11.8.0).
- Install **only** from the lockfile: `npm ci` (never `npm install <pkg>` without approval, see §6).

## 4. Safe commands (allowed without asking)
| Purpose | Command | Expected |
|---|---|---|
| Unit tests | `npm test` | all tests pass |
| Lint | `npm run lint` | exit 0, no errors |
| Type check | `npm run typecheck` | exit 0 |
| Production build | `npm run build` | exit 0, writes `dist/` |
| All gates | `npm run check` | runs the four above in order |
| Dev server (local only) | `npm run dev` | http://localhost:5173 |
| Read-only inspection | `git status`, `git diff`, `git log`, `npm ls`, `npm audit` | — |

## 5. Coding conventions
- TypeScript strict mode; no `any`, no `@ts-ignore`, no disabling ESLint rules.
- Import from `src` with the `@/` alias (`@/lib/booking`).
- Keep functions pure in `src/lib`; UI state lives in `App.tsx` only.
- Tailwind classes for styling; icons from `lucide-react`; no new UI libraries.
- Small diffs: one concern per commit, message style `type: summary` (`fix:`, `refactor:`, `docs:`, `test:`, `chore:`).

## 6. Forbidden actions (never do these)
1. **Secrets** — never create, read, print or commit `.env*`, API keys, tokens or real personal data. Sample data must stay fictional.
2. **Deployments** — never deploy, publish or push to production / Bolt hosting / any remote. No `npm publish`, no `git push` unless the human asks.
3. **Destructive commands** — no `rm -rf`, `git reset --hard`, `git push --force`, `git clean -fd`, branch deletion, or history rewrite.
4. **Unreviewed dependency changes** — no `npm install/uninstall/update`, `npm audit fix`, or edits to `package.json` dependencies or `package-lock.json` without written human approval of the exact change.
5. **Weakening checks** — never delete, skip (`.skip`/`.only`) or loosen a test or lint rule to make a gate pass.
6. **Scope creep** — never change domain rules AC1–AC5 or the public signature of `checkAvailability()` unless the task says so.

## 7. Test expectations and review gates
- Every behaviour change needs a test that fails before and passes after (state which in the summary).
- Before handing work back, run `npm run check` and paste the **real** pass/fail totals. Never claim a result you did not run; list any check not executed.
- Gate 1 (agent): `npm run check` green. Gate 2 (human): reads the full diff and approves. Gate 3 (human): merge. Agents never merge.
- Report format: change summary · files touched · commands run + results · risks / open questions.
