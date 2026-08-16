# PortfolioAtlas blog post team

Six-agent pipeline for humanized, fact-checked blog posts. Data locked before planning, draft locked before validation, everything locked before you. Never deploys.

## Install

Unzip at the repo root (~/Desktop/Appls/PortfolioAtlas). Files land in:

```
.claude/agents/data-analyst.md
.claude/agents/post-planner.md
.claude/agents/post-writer.md
.claude/agents/humanizer-editor.md
.claude/agents/fact-checker.md
.claude/agents/chart-qa.md
.claude/commands/blog-post.md
scripts/inject-tokens.mjs
```

Add `blog-pipeline/` to .gitignore if you don't want intermediates committed (the chart scripts inside it are worth keeping, your call).

## Run the trial

From the repo root in Claude Code:

```
/blog-post four-percent-rule-vs-backtest -- The 4% rule vs the backtest, city by city. Our preview number is monthly x 300, but the engine can solve the actual historically-safe number per city. The gap between the two is the story: where the shortcut oversaves, where it undershoots, and by how much. Include the transparency angle that our own preview figure uses the shortcut.
```

## Pipeline order and gates

1. **data-analyst** computes everything from the CLI pipeline (never the live site), writes `blog-pipeline/<slug>/data.json` with pre-formatted display tokens. Stops and asks rather than estimating.
2. **post-planner** finds the story, writes the section-level blueprint with claims and token names per section, plus SEO meta and a verified internal link map. **GATE A: you review the outline before any drafting.**
3. **post-writer** drafts from the blueprint. Never types a number; writes `{{tokens}}`.
4. **humanizer-editor** loads your humanizer SKILL.md and does the editing pass. Tokens are untouchable; it diffs the token set to prove it.
5. **hero-designer** concepts the title image, writes the text manifest with {{tokens}}, and writes bespoke render code. See the hero section below.
6. **inject-tokens.mjs** fills tokens in the draft AND the hero manifest from data.json. Hard-fails on any token problem.
7. **fact-checker** traces every numeral in the final draft and hero manifest to a token or approved literal, checks claim direction against raw data, and enforces the preview-vs-backtest framing. **GATE B: FAIL routes back, max 2 repair loops.**
8. **chart-qa** makes the matplotlib charts (1024px, #122947/#3172BF, portfolioatlas.org bottom right), runs the designer's hero render and eyeballs it, places the post, and runs build QA: dist diff, link resolution, style greps, sitemap check. **GATE C: never deploys. Ends with a summary for your voice pass.**

## Hero / title image

Every post gets a branded 1200x630 title image (og:image standard, used as the site cover and uploaded to Substack manually by Chris). A dedicated **hero-designer** agent concepts it per post:

- It reads the finished draft and data, concepts 2-3 genuinely different visual directions, picks the strongest, and writes bespoke Python rendering code. The big-figure card (scripts/make-hero-image.py) is one option in its toolkit, never the default.
- Hard constraints: brand palette (navy #122947, blue #3172BF, tints, near-white, one earned accent), wordmark bottom left, portfolioatlas.org bottom right, minimal text, no em dashes or exclamation points, generative graphics only.
- Data integrity: every text string in the image is declared in hero-manifest.json with {{tokens}} for numbers, injected and fact-checked BEFORE rendering. Graphics plotted from data.json raw are exempt because they are the data. An image can't be hotfixed after sharing, so it gets the strictest path.
- The alternates land in hero-concept.md; the final summary surfaces them so you can ask for a different direction without rerunning the pipeline.

Requires Pillow: `pip3 install pillow` if the machine doesn't have it.

## Upgrading from v1 or v2

This zip overwrites post-planner.md, fact-checker.md, chart-qa.md, blog-post.md, and README-blog-team.md, and adds hero-designer.md plus scripts/make-hero-image.py. Overwriting those is intended.

## Notes

- The analyst discovers your data pipeline by inspecting the repo. If it can't find how to compute something it stops and asks; first run will likely involve one such question. Answer it once and consider hardcoding the command into data-analyst.md afterward.
- The humanizer agent globs for `**/humanizer/SKILL.md`. If the skill lives outside the repo, put the path in `.claude/agents/humanizer-editor.md` step zero.
- iCloud: the pipeline writes many small files to `blog-pipeline/`. If iCloud eviction bites mid-run, rerun the failed phase; every phase is file-in, file-out and restartable.
- After the trial, if the token-injection trick held up, keep it for every post. It is the piece that makes fabrication structurally impossible.
