# AI evidence appendix / AI-use record

**AI assistant used: Claude (Anthropic) — Claude Code desktop app, model Claude Opus 5.5 (`claude-opus-5-5`).**
No other assistant (ChatGPT, Gemini, Copilot, Grok, Perplexity) was used. Date of all work: 2026-11-22.

| # | Step | Prompt summary | Output used | Problems found in the AI output | Human decision / change | Verification source |
|---|---|---|---|---|---|---|
| 1 | Plan | Read the assignment PDF, propose a repository and workflow | Reuse my Smart Campus project (Practice 8 state); task order | — | Chose the repository myself; confirmed the practice dates (12 and 19 Nov) | Assignment PDF slides 5–28 |
| 2 | Baseline | Run install/test/lint/typecheck/build/audit and save the real output | `docs/evidence/baseline/*` | `npm test` did not exist (missing script) | Recorded it as a weakness instead of hiding it | Exit codes stored in each file |
| 3 | AGENTS.md | Draft AGENTS.md with purpose, architecture, setup, safe/forbidden commands and review gates | `AGENTS.md`, `CLAUDE.md` (`@AGENTS.md` import) | The first draft listed modules that did not exist yet | Removed those rows and added them only in the commits that created the modules | `git log -p AGENTS.md` |
| 4 | Pattern | Evaluate Strategy and Adapter for App.tsx | Table-driven status view | — | Rejected classic Strategy and Adapter as too heavy (see PATTERN_DECISION) | `npm run check` 23/23; pixel compare |
| 5 | Risk review | Read-only sub-agent (`Explore`, no edit tools): at least 8 risks with evidence, label anything unverified | AI-01…AI-11 (`evidence/ai/01-risk-review.md`) | AI-07 esbuild claim not supported; AI-10's reading of `.bolt/prompt` reversed its meaning; AI-01's `Number(raw)` fix is unsafe | Classified 13 findings: 11 confirmed, 1 plausible, 1 unsupported | `evidence/verification/01–07` |
| 6 | M1 | Implement strict parsing and an integer guard; tests first | `time.ts`, guard, 11 tests | The AI's `Number()` idea accepted "6e2" and "" | Used a regex parser; reviewed the diff (`mitigation-M1/05-M1.diff`) | 5 tests failed before, 34/34 passed after |
| 7 | M2 | Remove the unused Supabase dependency | `npm uninstall` | The first package diff summary was wrong (it mixed + and − lines) | Recomputed the lockfile key difference: exactly 15 removed, 0 added | `mitigation-M2/04, 06` |
| 8 | Docs | Draft the risk register, audit, release decision and reflection from the evidence files | `docs/*.md` | — | Checked every number against the evidence files; trimmed the reflection to 200–300 words | Self-review checklist (below) |

## Human verification checklist (done before submission)
- [x] Every number in the slides appears in a file under `docs/evidence/`.
- [x] No credentials, `.env`, tokens or real personal data are in the repo (`verification/06-bundle-secrets.txt`).
- [x] Tests not executed are listed in `MITIGATIONS.md` ("Not executed").
- [x] The baseline and final versions are both available (tag `baseline`, branch `main`).
