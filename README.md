# Smart Campus Room Availability

Small React + TypeScript app (originally generated in Bolt.new, then tested and fixed in Practices 6–8) that checks whether
Room B-204 is free for a requested time interval. Times are minutes after midnight (600 = 10:00).
Sample data only — no backend, no accounts, no real bookings.

Used for **Software Engineering Assignment #05**: agent instructions, pattern decision, AI risk review, mitigations
and release decision. The report material lives in [`docs/`](docs/).

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
src/lib/booking.test.ts     19 Vitest cases for AC1–AC5
AGENTS.md / CLAUDE.md       instructions for coding agents
docs/                       assignment evidence (baseline/final outputs, risk register, audit)
.claude/skills/             two Claude Code skills from Practice 8 (bug-detector, regression-tester)
.bolt/                      Bolt.new template metadata
```

## Booking rules
AC1 integer interval 0 ≤ start < end ≤ 1440, start after current time · AC2 ≤ 120 min · AC3 blocked room rejected ·
AC4 no overlap (touching allowed) · AC5 inputs never mutated.
