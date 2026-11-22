# Task #10 — AI reflection

I used Claude Code in the Claude desktop app with Claude Opus 5.5 (`claude-opus-5-5`) on 22 November 2026. For the risk review it launched a read-only sub-agent of the same model with no file-editing tools. The sub-agent received the assignment PDF, the repository at commit 554fa93, the baseline outputs and the AGENTS.md rules. The rules were pasted into its prompt because a sub-agent may not load AGENTS.md by itself.

The most useful suggestion was AI-01: `parseInt("6e2")` returns 6. I reproduced it in the browser. Entering 6e2–7e2, which means 600–700, showed **Available** although that time overlaps Intro CS. The 19 old tests could not catch this because they never go through the UI's parsing.

One weak suggestion was AI-07, the claim that the esbuild advisory lets any website read my dev server. The advisory affects esbuild's `serve` mode, and Vite only calls `esbuild.context()`, so I marked the claim unsupported. I also rejected the AI's fix for AI-01, `Number(raw)`, because `Number("6e2")` is 600 and `Number("")` is 0.

I checked every finding myself with the probe script, `git check-ignore`, `npm ls`, `npm audit`, by reading the files and with screenshots. The tests changed my decisions. I wrote the new tests first and saw 5 of them fail on the old code, which proved that M1 fixed the real cause. A pixel comparison of screenshots then showed the refactor left the UI unchanged.

The repository instructions helped. The safe-command table and the dependency rule kept the changes small, and the review gate made me inspect the lockfile diff. The AI also found a flaw in my own instructions: the background-task document sounded like an approval. Next time, I would enforce these rules with permission settings and CI instead of only writing them down.
