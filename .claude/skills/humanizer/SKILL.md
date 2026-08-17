---
name: humanizer
version: 3.0.0-pa.1
description: |
  Rewrite and edit PortfolioAtlas reader-facing prose in Chris's voice. This is
  the lean rule set that replaced the old layered pattern catalog after checker
  experiments (2026-08-16): drafts edited under v2.x still scored ~90% AI, while
  a full rebuild under this rule set scored 100% human on one checker and 69% on
  another. Core method: calibrate against Chris's actual writing in
  docs/voice-sample.md and rebuild paragraph architecture, don't patch
  sentences. Applies to any blog post, roundup, city page, country guide, or
  FAQ copy. Hard data-integrity and house-style rules included.
license: MIT
compatibility: any-agent
allowed-tools:
  - Read
  - Write
  - Edit
  - Grep
  - Glob
  - AskUserQuestion
---

# Humanizer: PortfolioAtlas voice (lean core)

Provenance: v2.x layered a large AI-tell catalog with incremental voice rules;
posts edited under it still scored ~90% AI on external checkers. A full rebuild
under this lean set (validated 2026-08-16) scored 100% human on one checker and
69% on another. This file is that winning rule set promoted to the whole skill.
The old catalog lives in git history; do not resurrect it piecemeal.

## How to use

1. Identify the content type (map below).
2. For full-treatment content, read `docs/voice-sample.md` FIRST, both
   exhibits. That file is the target voice; imitate its sentence and paragraph
   architecture directly, not a description of it.
3. **Rebuild, don't patch.** Reconstruct each paragraph from its meaning up in
   the sample's architecture. Lightly edited sentences keep their machine
   skeleton, and untouched structure is exactly what reads as AI.
4. Run the deletion pass and final test (Restraint section) before delivering.
5. File-editing mode: write only the final rewrite into content files; report
   audit notes, data flags, and per-file status in the summary. Never deploy,
   build for deploy, or push; output stops at edited files for review.

## Content-type map

| Content type | Treatment |
|---|---|
| Blog posts, roundups, spotlight posts | Full treatment: Chris's voice + structure + restraint. |
| City pages, country guides, FAQ copy | Tell-removal only (checklist below). No personality injection. Keep FAQ schema, templated sections, and programmatic layouts intact; humanize the template once, never one-off pages. |
| Announcements, disclaimers, banner copy | Tell-removal only, and preserve required hedging. |

Roundup structure rule: top ten entries plus one full table, no supplementary
sections.

## Hard constraints (override everything else)

1. **Data integrity.** Never alter, round, convert, reformat, or remove
   figures, currency amounts, percentages, dates, dataset sizes, visa
   thresholds, rankings, or program names. In pipeline work, numbers exist
   only as {{tokens}} or approved literals from the locked data file. A figure
   may be DROPPED where the style defers precision (log every drop); it may
   never be changed. If a figure looks wrong, flag it in the audit notes and
   leave it unchanged; fixing data is never part of a style pass.
2. **Never invent.** No fabricated anecdotes, trips, conversations, research
   actions, or reactions. Voice comes from opinionated framing of real data.
   Genuine investigation traces are welcome ONLY when the source material
   records them (data-notes, analyst reports, Chris's own comments).
3. **Load-bearing hedges survive.** Risk caveats, "not financial advice"
   language, visa caveats, and data-freshness disclaimers are required; never
   strip or soften them. Only decorative qualifier-stacking gets cut.
4. **House style.** No em or en dashes anywhere; Chris's dash is the spaced
   hyphen " - ". No exclamation points. Straight quotes. Figures over
   adjectives.
5. **Domain vocabulary.** FIRE terms of art (withdrawal rate, safe withdrawal
   rate, geo-arbitrage, FIRE number, cost of living, portfolio, Fat/Lean/coast
   FIRE) are never tells; don't synonym-cycle them. Conversely, zero tolerance
   for travel-brochure words on city copy: nestled, vibrant, breathtaking,
   stunning, must-visit, hidden gem, rich culture/heritage, boasts, in the
   heart of, digital nomad paradise, expat haven.
6. **Household-agnostic prose** on site content: never "solo"/"for one"/"for
   two", no couple/family framing; costs are single-adult. Never imply local
   markets or local inflation were modeled; the engine holds the market
   constant and the city sets the spending level.
7. **Calibration is mandatory.** `docs/voice-sample.md` is the voice ground
   truth for full-treatment content. Its Exhibit B carries a data warning:
   calibrate on voice only, figures always come from the engine and the locked
   data file.

## The voice (Chris's, from his own writing)

All quotes verbatim from `docs/voice-sample.md`.

1. **Open scenarios as invitations, never imperative chains.** "Let's say you
   have $1,000,000 and put it in a standard 75/25 split", "We'll assume all
   variables are held constant except two". Walk the reader into the setup;
   don't order them through it.
2. **Dual voice.** "We" is PortfolioAtlas, proudly owning the work: "At
   PortfolioAtlas we ran that experiment with our own backtest engine", "Our
   model", "We cover PortfolioAtlas' methodology at the end". The reader is
   "you", throughout the post. Don't hide behind impersonal site-references.
3. **Inline numbered enumerations.** "except two: 1) the year you stop working
   and 2) where you retire". Keep the casual 1) / 2) form.
4. **Simplify the concept, defer the precision.** Plain words for the idea in
   body prose ("where you retire"); mechanism detail waits for the methodology
   section. Not every sentence carries its maximum data payload: "all of our
   cities" is fine where the count isn't the point (the count still appears
   where it IS the point).
5. **Plain outcomes in finance vernacular.** "Those two inputs alone determine
   whether you end up broke after 30 years or with multiples on your wealth."
   Cut ornate flourishes.
6. **Casual convention glosses.** "a standard 75/25 split", "the conventional
   'safe' withdrawal rate".
7. **Teases only as direct reader questions with a hedged plain answer.**
   "Wondering the worst year to retire? It's probably not the one you
   expect." Flat declarative teases ("The worst year isn't the one you'd
   guess") are banned. Questions generally must be ones the reader is
   genuinely asking; if a question exists only to be answered by the next
   clause, write the statement.
8. **Ambling sentences.** Swerve mid-sentence on ", however" and "which"
   clauses; carry emphasis in " - " asides; at most one short dramatic lander
   ("It wasn't.") in an entire post. Contrast comes from sentence shape, not
   punch.
9. **Casual connective tissue.** Contractions always. So/And/But/Now sentence
   openers. "Quick aside - ", "Back to our...", occasional trailing ellipsis,
   and guided-tour handoffs ("but first let's cover our methodology"). These
   are functional, not hype; empty signposting ("Let's dive in") stays banned.
10. **Mechanical tics to leave alone.** Unhyphenated numeric compounds ("a 30
    year retirement", "10 year LTR visa") - never "correct" them. No scare
    quotes around hypotheticals. Mild setup passives are fine. His ", however"
    splices stay; don't formalize them into semicolons. Never introduce actual
    errors: no typos, fake uncertainty, or forced fragments.
11. **Parallel bullet runs keep their repeated scaffold.** "Retiring in Lisbon
    gets them 10.9 years back / Porto 12.5 / Valencia 13.1" is a Chris device,
    a table in prose form. In running prose, vary sentence frames instead.
12. **One earned aphorism at the close, if any.** "The Swiss FIRE paradox is a
    menu, not a trap." Closing paragraph only, compressing the post's actual
    argument. Mid-post reversal framings ("X, not Y", "Same X, different Y",
    "It's not A. It's B.") are rationed hard.
13. **Steelman the other side before the end.** "This isn't an ad for Lisbon,
    Porto, or Valencia either." A post that only sells one direction is
    off-voice.

## Structure (the biggest detector tell)

1. Rebuild every paragraph from its meaning up in the sample's architecture.
2. Vary section shapes: some mostly data, some short, one narrative. Narrative
   treatment (characters, tension, resolution) goes to the single most
   illustrative example; report the rest plainly.
3. Uneven attention and density are good: one result may get 500 words,
   another 80; some paragraphs carry several numbers, some none. Don't balance
   sections rhetorically or visually.
4. Plain transitions ("We also looked at this by decade."). No
   claim-support-punchline paragraph units; a paragraph may just stop, or hand
   off plainly.
5. Vary paragraph length: a single-sentence paragraph next to a six-sentence
   one reads human; three same-size paragraphs in a row read machined.

## Restraint (do not optimize every sentence)

Human writing contains excellent sentences, ordinary sentences, plain
transitions, and facts left unconverted into rhetoric. It should sound like
someone who discovered something interesting and is explaining it clearly, not
someone trying to write a great article.

1. Boring sentences are allowed. Not every statistic needs an interpretation;
   let some results stand and trust the reader.
2. Ration rhetoric: a handful of highlightable lines per post, not twenty. A
   strong line feels strong because its neighbors aren't competing with it.
3. Ration metaphor: literal verbs by default. Portfolios don't constantly
   bleed, inflation doesn't bite, cohorts don't march.
4. Never restate a figure for emphasis in prose. Designated pull-quote
   blockquotes are the sanctioned echo; prose must not state the same figure a
   third time or form its own pull-quote-shaped echo.
5. Deletion pass before finishing: cut repeated conclusions, mini-summaries,
   duplicate statistics, sentences that merely interpret the previous
   sentence, and punchlines attached to already-strong facts. Keep the
   genuinely good lines; the objective is contrast, not flatness.
6. Final test: Does every paragraph feel suspiciously well-written? Simplify
   some. Does nearly every section contain a reversal or punchline? Remove
   most. Is any number stated twice in prose? Delete the repeat. Does every
   result come with an interpretation? Let some stand.

## Residual AI-tell checklist (all content types)

Sweep for these on every pass; they are the surviving essentials of the old
catalog:

- Significance inflation: stands as a testament, pivotal, underscores,
  reflects broader trends, marking a key moment, evolving landscape.
- Tacked-on "-ing" analyses: highlighting..., showcasing..., reflecting...
- AI-default vocabulary: delve, robust, seamless, comprehensive, crucial,
  landscape/tapestry (abstract), leverage/navigate (figurative), elevate,
  transformative, vibrant, notable, nuanced, realm. Not banned when genuinely
  the best word; never defaults.
- Canned transitions: That said, It's worth noting, Importantly, Notably,
  Interestingly, Ultimately, At its core, In other words. Usually delete and
  start with the information.
- Vague attributions: experts argue, observers note, industry reports.
- Rule-of-three runs and rhetorical adjective triplets; false ranges ("from
  the Big Bang to dark matter"); negative parallelisms ("not just X, but Y").
- Copula avoidance: serves as / stands as / boasts instead of is/has.
- Filler and decorative hedging: "it is important to note", "could potentially
  possibly"; generic upbeat conclusions ("exciting times ahead").
- Chatbot artifacts leaking into copy: "I hope this helps", cutoff
  disclaimers, "Would you like...". Cut and flag the file.
- Fake-candid hooks ("Here's the thing", "Honestly?"), manufactured suspense
  teasers, staccato drama runs, mid-post aphorism formulas ("X is the Y of
  Z").
- Emojis, curly quotes, mechanical boldface, title-case headings (match the
  site template), inline-header bullet lists in blog prose (fine in site
  templates).
- Diff-anchored writing outside changelogs ("this was added to replace...").

False-positive guardrails: judge by clusters, not isolated hits; never rewrite
watched phrases inside quotations, titles, or proper names; preserve signs of
a real writer (specific hard-to-fabricate detail, mixed feelings, dated
references, sentence-length variety, genuine asides).

## Reference

Distantly based on Wikipedia's "Signs of AI writing" (WikiProject AI Cleanup)
via blader/humanizer 2.8.2. Rebuilt 2026-08-16 around Chris's own writing
(`docs/voice-sample.md`) after external-checker experiments; see git history
for the v2.x layered catalog and the experiment trail.
