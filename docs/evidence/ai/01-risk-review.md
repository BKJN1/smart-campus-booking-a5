# AI read-only risk review (Task #04) — prompt and raw output

- Tool / model: Claude Code (desktop app), sub-agent of type `Explore` running Claude Opus 5.5 (`claude-opus-5-5`).
  The `Explore` agent type has **no Edit/Write tools**, so "without modifying files" was enforced by the tool, not only asked for.
- Date: 2026-11-22. Code reviewed: commit `554fa93` (baseline + docs; before refactor and mitigations).
- Disclosure: the sub-agent does not necessarily load `AGENTS.md`, so its relevant rules were **pasted into the prompt explicitly** (Task #02 requirement).

## Prompt (verbatim)
> You are doing a READ-ONLY risk review of a small software repository for a university assignment. Do NOT modify, create or delete any file, and do not run npm install/audit fix or any command that changes the working tree. You may read files and run read-only commands (git log/diff/grep, npm ls, npm audit, npx vitest run, npm run lint/typecheck — these do not modify sources).
> Repository: …\smart-campus-booking (git commit 554fa93). React 18 + TypeScript + Vite app "Smart Campus Room Availability": checks if a room is free for an interval given in minutes after midnight. Sample data only.
> The repository's agent instructions (AGENTS.md) are pasted here explicitly because you may not load them automatically — relevant rules: never touch secrets/.env; never deploy or push; no destructive commands; no dependency changes; never weaken tests; domain rules AC1 integer interval 0<=start<end<=1440 and start>current time, AC2 duration<=120, AC3 blocked room rejected, AC4 no overlap (touching allowed), AC5 never mutate inputs.
> Task: propose candidate risks. Give at least 8 candidates spanning these categories: correctness, maintainability, security, dependency, agent operations. For each candidate output exactly: ID (AI-01...), category, one-line claim; cause -> event -> consequence; affected file(s)/component and line numbers; evidence you actually observed (quote code or command output). If you did NOT verify it, say "unverified" explicitly — do not present guesses as facts; your confidence (high/medium/low); suggested minimal mitigation. Keep the whole answer under 1200 words. Be skeptical; include issues even if you think they are minor, but label speculation clearly.

## Output (verbatim, formatting lightly normalised)
Read-only risk review of smart-campus-booking @ 554fa93. No files were changed. I ran `npx vitest run` (19/19 passed), `npm run lint` (exit 0, no output) and `npm run typecheck` (exit 0). `git status` shows one untracked file: docs/BACKGROUND_AGENT_TASK.md. I did not re-run `npm audit`; the audit findings below come from the committed evidence files.

**AI-01 | correctness | The UI misreads exponent input and can show "Available" for an interval that overlaps a booking.**
Cause→event→consequence: `parseInt` stops at "e", so "6e2" becomes 6 and "7e2" becomes 7 → the check runs on 6–7 instead of 600–700 → the screen says Available although 600–700 overlaps Intro CS 600–660. Location: src/App.tsx:19-21; src/components/TimeField.tsx:13; input is `type="number"`, which accepts "6e2". Evidence: docs/evidence/baseline/12-ui-states.txt (not reproduced in a browser by the agent). Confidence: high. Mitigation: parse with `Number(raw)` and reject anything that is not an integer; add a test.

**AI-02 | correctness | The domain function does not enforce the "integer" part of AC1.** No `Number.isInteger` check → 660.5 passes, and in the UI "660.9" is silently cut to 660. Location: src/lib/booking.ts:31-45. Evidence: grep found no `Number.isInteger`; 12-ui-states.txt `start=660.9 end=720 -> Available`; direct call unverified. Confidence: high. Mitigation: integer guard + test.

**AI-03 | correctness (minor) | `currentTime` and stored bookings are never range-checked.** currentTime −100 or 5000 accepted; malformed booking (end ≤ start) makes the overlap test meaningless. Location: booking.ts:34-40, 58-59. Runtime effect unverified (speculative). Confidence: low. Mitigation: validate 0 ≤ currentTime ≤ 1440; test.

**AI-04 | maintainability | Tests miss the failing input cases; specs disagree on how many criteria exist.** No test for non-integer, negative start, Infinity or App parsing; no UI test. booking.test.ts line 1 says "AC1-AC6", regression-tester SKILL.md says "AC1-AC6", AGENTS.md defines AC1–AC5; no case for start = −1. Confidence: high. Mitigation: add tests; unify AC numbering.

**AI-05 | maintainability | Day length and a validation rule are defined in several places.** 1440 literal in booking.ts:34, `DAY_MINUTES` in Timeline.tsx:10, `DAY_MAX` in TimeField.tsx:46 (declared after use at line 37); Timeline.tsx:38-42 repeats part of AC1. Confidence: medium. Mitigation: single exported constant/helper.

**AI-06 | dependency/security | Unused production dependency brings a high-severity vulnerability.** `@supabase/supabase-js` never imported → pulls `ws@8.18.3` (GHSA-58qx…, high). Evidence: 09-grep-supabase.txt (exit 1, no matches), 07-audit-prod.txt (1 high, ws), 08-npm-ls-ws.txt (supabase-js → realtime-js → ws). Agent's own `grep -c supabase dist/assets/*.js` → 0, so not in the shipped bundle; real exposure low. Confidence: high. Mitigation: remove it, only after the human approves the exact change (AGENTS §6.4).

**AI-07 | dependency | Dev toolchain has 25 known vulnerabilities, 2 critical.** vitest 3.x → tinypool ≤2.1.1 (critical); "vite 5.4 uses an esbuild version whose dev server lets any website send requests to it and read the responses → running `npm run dev` exposes local source code to a malicious site". Evidence: 06-audit.txt (not re-run); exploitability unverified. Confidence: medium. Mitigation: approved isolated upgrade (docs/BACKGROUND_AGENT_TASK.md); dev server on localhost only.

**AI-08 | security | `.gitignore` ignores `.env` but not other `.env.*` files.** `.env.production` could be staged by `git add .`. Evidence: read .gitignore; no such file exists (speculative). Confidence: medium. Mitigation: `.env*` + `!.env.example`.

**AI-09 | agent operations | Agent rules are advisory only; nothing enforces them.** AGENTS.md reaches Claude only via `@AGENTS.md` import; no `.claude/settings.json` deny rules or hooks → `npm audit fix`, `git push` not blocked. Evidence: `ls .claude/settings*` → no such file. Confidence: medium. Mitigation: permission deny rules for push/publish/install/audit fix and `.env*` reads.

**AI-10 | agent operations | Agent instruction files contradict each other.** `.bolt/prompt` says "worthy for production" and allows installing packages "unless absolutely necessary" (conflicts with AGENTS §6.4/§6.6); docs/BACKGROUND_AGENT_TASK.md says "Pre-approved by the human for this task only…" and lists `npm install -D vitest` as allowed → an agent could treat these as permission. Confidence: medium (whether an agent would act is speculative). Mitigation: AGENTS.md is the only authority; approval only from the human in chat; label the task doc "hypothetical – not an authorization".

**AI-11 | agent operations (minor) | Evidence can go stale and claims can go unchecked.** Committed audit/UI snapshots; RC4 relies on Playwright screenshots but no Playwright script is in the repo → an agent cannot re-run the UI check. Confidence: medium. Mitigation: add a reproducible UI check script, or mark RC4 manual.

Top two (agent's ranking): AI-01 and AI-02 — confirmed rule problems no current gate catches.
