# Smart Campus Room Availability

Small React + TypeScript app (originally generated in Bolt.new, then tested and fixed in Practices 6–8) that checks whether
Room B-204 is free for a requested time interval. Times are minutes after midnight (600 = 10:00).
Sample data only — no backend, no accounts, no real bookings.

Used for **Software Engineering Assignment #05**. Baseline = tag [`baseline`](../../tree/baseline); final = `main`.

| Deliverable | File |
|---|---|
| Acceptance criteria | [docs/ACCEPTANCE_CRITERIA.md](docs/ACCEPTANCE_CRITERIA.md) |
| Agent instructions | [AGENTS.md](AGENTS.md), [CLAUDE.md](CLAUDE.md) |
| Pattern decision | [docs/PATTERN_DECISION.md](docs/PATTERN_DECISION.md) |
| Risk register (13 findings) | [docs/RISK_REGISTER.md](docs/RISK_REGISTER.md) |
| Mitigations M1, M2 + before/after | [docs/MITIGATIONS.md](docs/MITIGATIONS.md) |
| Agent-readiness audit | [docs/READINESS_AUDIT.md](docs/READINESS_AUDIT.md) |
| Background-agent safeguards | [docs/BACKGROUND_AGENT_TASK.md](docs/BACKGROUND_AGENT_TASK.md) |
| Release decision (CONDITIONAL) | [docs/RELEASE_DECISION.md](docs/RELEASE_DECISION.md) |
| AI reflection / AI-use record | [docs/AI_REFLECTION.md](docs/AI_REFLECTION.md), [docs/AI_USE_RECORD.md](docs/AI_USE_RECORD.md) |
| Raw command output | [docs/evidence/](docs/evidence/) |

## Quick start
```bash
npm ci            # install exactly what package-lock.json pins (Node 24.x)
npm run dev       # http://localhost:5173
```

## Commands
| Command | What it does |
|---|---|
| `npm test` | Vitest unit tests (`src/lib/*.test.ts`) |
| `npm run lint` | ESLint (typescript-eslint + react-hooks) |
| `npm run typecheck` | `tsc --noEmit -p tsconfig.app.json` |
| `npm run build` | Vite production build to `dist/` |
| `npm run check` | lint → typecheck → test → build (the release gate) |

## Repository map
```
index.html                  Vite entry HTML
src/main.tsx                React entry point (mounts <App/>)
src/App.tsx                 page: inputs, result card, timeline, bookings list
src/components/TimeField.tsx  number input with HH:MM hint
src/components/Timeline.tsx   24h bar with bookings and the requested interval
src/lib/booking.ts          domain rules: checkAvailability(), minutesToLabel()
src/lib/booking.test.ts     21 Vitest cases for AC1–AC5 (T01–T21)
src/lib/time.ts             parseMinutes(): strict text → whole minutes
src/components/resultStatus.ts  result card status view (table-driven)
scripts/ui-states.py        Playwright UI check for RC4
scripts/probe-risks.ts      read-only probe used to verify risk claims
AGENTS.md / CLAUDE.md       instructions for coding agents
docs/                       assignment evidence (baseline/final outputs, risk register, audit)
.claude/skills/             two Claude Code skills from Practice 8 (bug-detector, regression-tester)
.bolt/                      Bolt.new template metadata
```

## Booking rules
AC1 integer interval 0 ≤ start < end ≤ 1440, start after current time · AC2 ≤ 120 min · AC3 blocked room rejected ·
AC4 no overlap (touching allowed) · AC5 inputs never mutated.
