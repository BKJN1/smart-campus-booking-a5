# Release acceptance criteria (must stay true after every change)

| ID | Criterion | How it is verified |
|---|---|---|
| RC1 | All booking rules AC1–AC4 keep their current decisions for the 19 baseline cases (touching endpoints allowed, exactly 120 min allowed, 121 rejected, blocked room rejected, overlaps rejected). | `npm test` — baseline cases T01–T19 pass unchanged |
| RC2 | `checkAvailability()` never mutates the bookings it receives (AC5). | T17 (frozen input) and T19 (out-of-order input) pass |
| RC3 | Static checks and production build succeed. | `npm run lint`, `npm run typecheck`, `npm run build` exit 0 |
| RC4 | UI behaviour is preserved: defaults (now 555, 660–720) show **Available**; toggling *Room blocked* shows **Unavailable** with the blocked reason; an empty field shows **Awaiting input** with "Enter a start time". | Playwright screenshots `docs/evidence/screenshots/{baseline,final}-1..3-*.png` + `12-ui-states.txt` |
| RC5 | No secrets, real personal data or network calls in the shipped app. | `git grep` for keys / `.env`; no `fetch`/client libraries imported in `src/` |
