# Task #03 — Focused pattern decision

## Maintainability problem (observed at commit 554fa93)
`src/App.tsx` re-derives the same three-way state — *available / unavailable / awaiting input* — from
`result?.available` **five separate times** with nested ternaries (lines 127–129 card colour, 137–139 badge colour,
144–146 icon, 155–157 title colour, 162–164 title text). `grep -c "result?.available" src/App.tsx` → **12**.

Consequence: adding a fourth state (e.g. "invalid input" or "warning") or restyling one state means editing five
places in JSX and keeping them consistent by hand; one missed branch silently shows a wrong colour/icon.
This is the "duplicated conditionals" smell from the brief.

## Options evaluated
| Option | Verdict | Why |
|---|---|---|
| Do nothing | Rejected | The duplication is real and is the next thing anyone touching the result card must change. |
| **Strategy (classic)** — interface `StatusPresenter` + 3 classes | Rejected as too heavy | Three tiny behaviour-free objects; classes add ceremony with no polymorphic behaviour to vary. |
| **Strategy, table-driven** — derive status once, look up a per-status presentation object | **Chosen** | Same benefit (each state owns its presentation, App picks one) with a `Record<Status, Presentation>` — compile-time exhaustive (TypeScript errors if a state is missing). |
| Adapter (for the time inputs) | Not needed here | There is a single input source (text fields); a plain function is enough. Input parsing is handled as mitigation M2, not as a pattern. |
| Strategy for booking rules (AC1–AC4 as rule objects) | Rejected | Four fixed rules in one 50-line pure function, fully tested; a rule chain would add indirection without a requirement for pluggable rules. |

## Refactoring (the only one)
- New `src/components/resultStatus.ts`: `getResultStatus(result)` → `'available' | 'unavailable' | 'pending'`, and
  `RESULT_STATUS_VIEW: Record<ResultStatus, {title, icon, card, badge, titleText, reasonText}>`.
- `App.tsx` computes `const view = RESULT_STATUS_VIEW[getResultStatus(result)]` once and uses `view.*` in the JSX.
- New `src/components/resultStatus.test.ts` pins the mapping (3 statuses, exhaustiveness).
- No change to `src/lib/booking.ts`, to any test case, or to rendered classes/text.

## Before / after and proof that acceptance criteria still hold
Evidence in `docs/evidence/refactor/`:
- Structure: three-way status ternaries **5 → 0**; `result?.available` occurrences **12 → 2** (the two left are the
  "You can book…" box and the Timeline prop, which need only the boolean); `App.tsx` **245 → 206 lines**;
  presentation now lives in one 50-line table (`resultStatus.ts`).
- RC1–RC3: `npm run check` → lint/typecheck OK, **23/23 tests** (19 baseline unchanged + 4 new S01–S04), build OK.
- RC4: Playwright UI states give the same text before/after for all 5 scenarios; screenshots 1–2 are pixel-identical,
  3–4 differ in ~6k pixels by at most 1/255 (rendering noise, visually identical).
