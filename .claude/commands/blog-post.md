---
description: Run the PortfolioAtlas agentic blog post pipeline (data -> plan -> write -> humanize -> inject -> fact-check -> charts/QA -> local preview) with review gates. Ends with the dev server running and a localhost URL to the post for review. Never deploys.
argument-hint: <slug> -- <one-paragraph post brief>
---

Run the blog post pipeline for: $ARGUMENTS

Parse a slug and a brief from the arguments. Create `blog-pipeline/<slug>/` as the working directory for all intermediate files. Run the phases below IN ORDER using the named subagents. Each phase's output file must exist and be valid before the next phase starts. Treat the whole pipeline as atomic: if any phase fails and cannot be fixed by routing back, stop and report rather than shipping a partial result.

## Phase 1: Data (subagent: data-analyst)
Produce `data.json` and `data-notes.md`. If the analyst cannot source a number from the repo's data pipeline, the pipeline stops here and asks Chris. No estimates.

## GATE A: Outline review (hard stop)
Run subagent post-planner to produce `outline.md` from the locked data. Then STOP and show Chris the outline (thesis, title, H2 blueprint, link map). Do not start drafting until Chris approves or amends it. If he amends, update outline.md to match before proceeding.

## Phase 2: Draft (subagent: post-writer)
Produce `draft-tokens.md` from the approved outline. Numbers appear only as {{tokens}} or approved literals.

## Phase 3: Edit (subagent: humanizer-editor)
Produce `draft-humanized.md` and `edit-report.md`. Verify the edit report confirms the token set is unchanged; if not, route back to the humanizer once, then stop if still broken.

## Phase 3.5: Hero design (subagent: hero-designer)
Before this phase, locate the site logo asset (check public/ and src/assets/) and pass its path to the designer. The designer produces `hero-concept.md`, `hero-manifest.json` (text with {{tokens}}), and `charts/hero-render.py`, and test-renders its own work before finishing.

## Phase 4: Inject (script, not an agent)
Run both:
`node scripts/inject-tokens.mjs blog-pipeline/<slug>/draft-humanized.md blog-pipeline/<slug>/data.json blog-pipeline/<slug>/draft-final.md`
`node scripts/inject-tokens.mjs blog-pipeline/<slug>/hero-manifest.json blog-pipeline/<slug>/data.json blog-pipeline/<slug>/hero-manifest-final.json`
The script hard-fails on unknown or leftover tokens. If it fails, the writer, humanizer, or designer broke a token (or the planner spec'd a token the analyst never made); route back with the script's error output.

## GATE B: Fact-check (subagent: fact-checker)
Produce `factcheck-report.md` on draft-final.md and hero-manifest-final.json. FAIL means route the report back to the responsible agent (writer for missing evidence, humanizer for mangled prose claims, analyst for bad data), rerun from that phase INCLUDING re-injection and re-fact-check. Maximum 2 repair loops, then stop and hand Chris the report.

## Phase 5: Charts, placement, QA (subagent: chart-qa)
Only after fact-check PASS. Produce charts, place the post, run the build QA suite, write `qa-report.md`.

## Phase 6: Local preview server (orchestrator, NOT a subagent)
The pipeline's final deliverable is the post running locally in a browser, not a file path. After QA passes, YOU (the main session) do this yourself; do not delegate it, because a background server started inside a subagent dies when that subagent finishes.

1. Start the dev server in the background from the repo root: `npm run dev`.
2. Read the server's startup output to capture the ACTUAL port. It is 4321 by default but Astro auto-increments (4322, 4323, ...) if the port is busy. Never assume 4321.
3. Verify the post is actually being served: fetch `http://localhost:<port>/blog/<slug>` and confirm it returns the post (check for the title in the HTML). If it 404s or errors, fix the placement (route back to chart-qa if needed) before finishing.
4. LEAVE THE SERVER RUNNING. Do not kill it at the end of the pipeline. It is the review environment.

## GATE C: Review on localhost, do not deploy (hard stop, always)
Never push, never deploy, never trigger a Pages build. The FIRST line of the final handoff is the clickable local preview URL:

> Read the post here: `http://localhost:<port>/blog/<slug>`

Chris reads the post at that URL to evaluate it and decide what to change. The dev server hot-reloads, so when he asks for edits, apply them to the placed post (and blog-pipeline copies as appropriate) and tell him to refresh the same URL. This local review loop continues until he is satisfied; only then does anything get committed or shipped, and only when he says so.

After the URL, give Chris the rest of the handoff: the thesis and title, the QA report summary, the fact-check PASS line, chart inventory, the hero image path for Substack upload (blog-pipeline/<slug>/hero.png) along with the one-line alternates from hero-concept.md in case he wants a different direction rendered, and the path to the final copy for his voice pass. Chris is the final voice pass, the Substack upload, and the deploy decision.
