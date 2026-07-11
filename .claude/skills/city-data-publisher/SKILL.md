---
name: city-data-publisher
description: >-
  Author PortfolioAtlas city records into the live dataset FROM AN
  ALREADY-VALIDATED research dossier (produced by the research CLI /
  city-research-orchestrator). Invoke when the user says things like "author the
  India dossier", "make the batch-B dossier shippable", "turn this research into
  city files", "publish the dossier", or "convert the dossier into production
  data". This skill WRITES to the dataset (creates/overwrites city JSON, wires
  index.ts) and is the validation layer the repo lacks — it refuses to write
  malformed records. It does NOT research, invent, or change figures: it
  faithfully transcribes the dossier, validated against the LIVE schema. It
  builds green, commits one stacked commit, and STOPS before deploy.
---

# Author PortfolioAtlas city data from a research dossier

You transcribe a validated research dossier into production PortfolioAtlas city
records. Repo: `/Users/chrishogan/Desktop/Apps/PortfolioAtlas`. You are the
validation and authoring layer — **the repo has NO runtime schema validation, so
you are the last line of defense against a malformed record reaching the live
site.** Precision and safety over speed.

## Core principles (these override convenience)

1. **You transcribe; you do not invent.** Every value you author comes from the
   dossier. Do NOT research, estimate, "improve", coerce, or fill gaps with your
   own numbers or word choices. If the dossier is missing or ambiguous on a
   required field, **STOP and report the gap** — do not fabricate or guess it.
   The only value you compute yourself is `fireScore` (it is derived — see below).
2. **Validate before writing, refuse on failure.** Build every city object in
   memory, validate against the live schema, and write files ONLY if EVERY city
   passes. One malformed field → STOP and report. Author nothing rather than
   something broken. No partial batches.
3. **Read the schema live, every run.** Never rely on a remembered schema.
   Re-read `src/data/types.ts` at the start of every invocation and validate
   against what it says *now* — the schema evolves (e.g. `dataRecency?` was added
   on a feature branch and may or may not be present on the branch you're on).
4. **Overwrites are deliberate and announced.** Creating a new city is low-risk;
   overwriting an existing one changes a live page. For any city whose file
   already exists, show the old→new per-tier comparison and confirm the dossier
   intends to refresh it BEFORE overwriting. Never silently replace a record.
5. **Commit only a green build; never deploy.** Author → wire `index.ts` → prove
   the build is green → then ONE stacked commit on top of the current branch.
   STOP there. Present the diff, the commit, and the deploy command (printed, not
   run). A stacked commit is reversible with `git reset`; a deploy is not.

## Inputs

- **A dossier** (path in `research-dossiers/` or wherever the user points; if not
  given, ask which one). It may be **markdown, rtf, or a PDF**.
  - **PDF gotcha (real):** research dossiers are often exported as PDFs whose text
    is vector/outlined — `pdftotext`/pypdf/PyMuPDF `get_text()` return almost
    nothing. If text extraction yields little, **render each page to PNG and read
    it visually**: `python3 -c "import fitz; ..."` (PyMuPDF, `get_pixmap(matrix=fitz.Matrix(150/72,150/72))`)
    at ~150 DPI, then Read the PNGs. Do not proceed on a half-extracted dossier.
- The dossier contains, per city: identity (name, country, region, emoji,
  tagline, description), tags (climate, english), all 10 quickFacts, the four
  scores + a stated fireScore, five cost tiers with per-line-item monthly USD
  (**single-person basis** — see "Cost basis" below) + descriptions + lifestyle
  narratives, a stated per-tier total, optionally a recommended `dataRecency`,
  and (for refreshes) old-vs-new comparisons.

## The schema contract (confirm against `types.ts` live — anchors are for orientation)

For EACH city, a `CityData` object (`types.ts` ~line 71) requires:

- **Identity:** `name`; `country` (**exact** string — must match an existing
  country's spelling verbatim if that country already exists, or it silently
  creates a split country group on the `retire-in/[country]` page); `region` ∈
  the `Region` enum (`types.ts` ~line 62: Southeast Asia, East Asia, Oceania,
  Europe, Latin America, North America, Middle East, Africa, South Asia,
  Caribbean); `emoji`; `tagline`; `description`; `slug` (lowercase, hyphenated,
  **ASCII — strip accents**, e.g. Florianópolis → `florianopolis`).
- **tags:** `climate` ∈ `ClimateTag` enum (`types.ts` line 1: tropical,
  subtropical, mediterranean, continental, desert, arid); `english` ∈
  (high|moderate|low).
- **quickFacts (all 10 present, non-empty):** visa, timezone, language,
  internetSpeed, safetyRating, nearestAirport, climate (free-text string),
  englishFriendly ∈ (High|Moderate|Low), currency, averageTemp (**both °F and
  °C**). `englishFriendly` (capitalized) and `tags.english` (lowercase) MUST be
  the same value in different casing — enforce it.
- **scores:** safety, healthcare, infrastructure, expatFriendliness — each a
  number in [1,10].
- **fireScore:** MUST equal `round((0.30·safety + 0.30·healthcare +
  0.20·infrastructure + 0.20·expatFriendliness)·10)/10` for THIS city's scores.
  **Recompute it yourself — do not trust the dossier's stated value.** If the
  dossier disagrees, the COMPUTED value wins and you flag the discrepancy.
  ⚠️ **JS floating point matters here:** `6.85 * 10` is `68.4999…` → rounds to
  `6.8`, not `6.9`. Do not hand-arithmetic — compute with the actual JS engine
  (see validation-script tip below) so your value matches what the site computes.
- **Five tiers** keyed `1M/2M/3M/5M/10M` (dossier's Lean / Comfortable+ / FIRE /
  Premium / FatFIRE map to these keys in order). Each tier: the 7 required line
  items (housing, dining, groceries, healthcare, transportation, entertainment,
  utilities) — `housing/dining/healthcare/transportation/entertainment` each have
  `{description, monthlyCost}`; `groceries/utilities` have `{monthlyCost}` only
  (no description); plus a `lifestyle` narrative and `monthlyBudget` = the fixed
  nominal constant (1M 3333, 2M 6667, 3M 10000, 5M 16667, 10M 33333 — **NOT** the
  cost sum). `domesticHelp` and `luxuryExtras` (`{description, monthlyCost}`)
  appear ONLY at 5M and 10M, never at 1M/2M/3M.
- **dataRecency** (`dataRecency?: string`, e.g. 'Q3 2026'): **optional and
  branch-dependent.** Author it ONLY if the live `types.ts` declares it AND the
  dossier supplies a value. If the field isn't in the current schema, skip it
  (authoring a field not in the schema violates principle 1).

### There is no "total" field — the site sums the line items

The schema has no per-tier total field. The live model uses `getTotalSpend(tier)`
= the SUM of all line-item `monthlyCost` values (+ domesticHelp + luxuryExtras
where present) — see `types.ts` (`getTotalSpend`, ~line 128). The dossier's stated
tier total is therefore a **cross-check**, not a field you write. If a tier's
line items don't sum to the dossier's stated total, that's a dossier defect →
**STOP and report the specific tier and the gap.** Never nudge a line item to
force the sum. (If a human has already decided a reconciliation — e.g. "raise
housing by $400" — it must arrive in the dossier or explicit instructions; you do
not originate it.)

### Cost basis: one adult, not a household

PortfolioAtlas cost tiers are authored on a **single-person (one adult)** basis —
every line-item cost is what ONE adult pays, not a couple or family. This is the
current standard; earlier records were built on a household basis, so new and
refreshed dossiers are explicitly single-person.

- **Transcribe the dossier's figures, but the dossier's declared basis MUST be
  single-person.** If a dossier is labeled or clearly built on a household /
  family / couple basis (e.g. it says "household" or its lean-tier costs look
  household-sized), that's a basis mismatch → **STOP and report.** Do not silently
  mix bases in the dataset.
- The `monthlyBudget` constants (3333 / 6667 / 10000 / 16667 / 33333) are fixed
  nominal tier labels, unrelated to the cost sum — they do NOT change with the
  basis. Leave them as the constants regardless.
- **Cross-city comparability (surface, don't block, don't rebalance):** some
  existing live records may still be on the older household basis. When you author
  single-person cities next to household-basis neighbors, their lean-tier totals
  will legitimately look much lower than comparable existing cities — this is a
  basis difference, not an error. Note it in your plan/report so the human sees
  it; do NOT adjust any figure to "match" existing cities (that would be
  inventing data).

## Validation gate (run per city; ALL must pass or STOP)

- Every required `CityData` field present; **no extra fields** that aren't in the
  live schema.
- `region` ∈ Region enum (exact); `climate` ∈ ClimateTag enum (exact);
  `englishFriendly` ∈ {High,Moderate,Low} AND `tags.english` is its lowercase
  match.
- **Common dossier defects that MUST trigger STOP (not a self-fix):**
  - A **range/hyphenated** englishFriendly like "Moderate-High" or "Low-Moderate"
    → invalid; needs a human coercion decision. STOP.
  - A climate not in the enum (e.g. "oceanic", "humid subtropical") → the dossier
    must carry the resolved enum value; if it doesn't, STOP. Do not coerce.
- All 10 quickFacts present and non-empty; `averageTemp` contains both °F and °C.
- 4 scores are numbers in [1,10]; `fireScore` recomputed (real JS) and matches.
- All 5 tiers present. Per tier: 7 required line items present; optional lines
  ONLY at 5M/10M; `getTotalSpend` reconciles to the dossier's stated total (else
  STOP). Totals strictly monotonic 1M < 2M < 3M < 5M < 10M.
- `slug` is unique (NEW) or an intended overwrite; `country` matches existing
  spelling where that country already exists.
- Every tier has a `lifestyle` narrative present AND it is HOUSEHOLD-AGNOSTIC — grep each
  narrative for occupancy/headcount language in EITHER direction: single-person framing
  ("solo", "single", "for one", "living alone", "a studio for one") OR multi-person framing
  ("dinner for two", "partner", "spouse", "couple", "family", "kids", "for two"). Either is
  a defect — the numbers are single-adult but the prose must stay neutral so it survives the
  future household multiplier. If a narrative is missing OR contains headcount framing,
  → STOP and report (do NOT rewrite it yourself; corrected neutral prose must come from the
  dossier). Wealth/luxury language at high tiers is fine and expected — only headcount
  framing is the defect.

### Tip: make the in-memory gate a throwaway script

The most reliable way to run this gate is a small `.mjs` that **mirrors
`computeFireScore` and `getTotalSpend` copied from the live `types.ts`** (copy the
expressions fresh each run — don't hardcode from memory), builds each city object,
runs every check, and writes the JSON files **only if `errors.length === 0`**
(otherwise `process.exit(1)` and print exactly what failed). This gives you real
JS float behavior for fireScore, an exact `getTotalSpend`, and an all-or-nothing
write in one pass. Put it in the scratchpad, not the repo.

## Workflow

### Phase 0 — Orient
- Confirm the **current git branch** (`git branch --show-current`) and that it's
  the intended one for this batch — this work rides a diff-stack and other CLIs
  may have moved the branch. If it's not where the user expects, surface it and
  confirm before proceeding.

### Phase 1 — Load & plan
1. Read the dossier (render to images first if it's an image/vector PDF). Read
   `src/data/types.ts` (live schema). Read `src/data/cities/index.ts` (existing
   cities/countries/regions and the region-block layout).
2. For each dossier city: **NEW** (no `src/data/cities/<slug>.json`) or
   **OVERWRITE** (file exists). List which are which; grep the slug list for
   collisions.
3. For OVERWRITE cities, read the existing file and prepare an old→new per-tier
   total comparison. Confirm the dossier is an intentional refresh. If a city
   exists but the dossier doesn't clearly intend to overwrite it → STOP and ask.
4. **Report the plan** (X new, Y overwrites, the overwrite diffs, new country
   groups, target region blocks, and the dossier's declared **cost basis** —
   confirm it's single-person) BEFORE writing anything.

### Phase 2 — Build & validate in memory
5. Construct the full `CityData` object per city from the dossier; map the five
   tiers to 1M/2M/3M/5M/10M; apply `monthlyBudget` constants.
6. Run the full validation gate (the throwaway script). Recompute every
   `fireScore`. Reconcile every tier sum.
7. If ANY city fails ANY check → **STOP.** Report the exact city, field, check,
   and values. Write nothing.

### Phase 3 — Write (only if every city passed)
8. Write each city to `src/data/cities/<slug>.json` (filename slug == in-file
   slug), 2-space JSON matching the existing files' shape.
9. Register each in `src/data/cities/index.ts`: add
   `import <camelCaseId> from './<slug>.json';` in the correct region-comment
   block, AND add `<camelCaseId>,` to the `allCities` array in that same block —
   matching the file's existing style. Don't duplicate registration for OVERWRITE
   cities already registered. Place per the existing region-block layout.

### Phase 4 — Verify with evidence (prove; don't assert)
10. Run `npm run build`. It MUST succeed. The pre-existing `/compare` route
    warning is expected; any NEW warning/error is a problem to report.
11. For each authored city: print its five `getTotalSpend` tier totals showing
    monotonicity, and confirm each matches the dossier.
12. Re-print each city's recomputed `fireScore` == authored `fireScore`.
13. Confirm new country groups generate `retire-in/<country>.html` and that
    additions to existing countries group into ONE page (grep the `dist/` HTML —
    no split from a spelling mismatch).
14. If the schema has `dataRecency`, confirm it renders on a sample authored
    city page (`grep "Cost data:" dist/cities/<slug>.html`).
15. For OVERWRITE cities, print the final old→new tier-total deltas.

### Phase 5 — Commit the green batch, then stop
16. ONLY after Phase 4's build passed and every city passed: commit ONE stacked
    commit on top of the current branch (do NOT rebase mid-stack). Stage ONLY the
    city JSONs and `index.ts` — nothing else. Message e.g.
    `feat: add <cities> — single-person basis (<recency>)` or, for a refresh,
    `feat: refresh <batch> city data to single-person basis (<recency>)`.
17. Present: commit hash + message, files created/overwritten, the `index.ts`
    edits, the build result, per-city evidence (tier sums/monotonicity,
    recomputed fireScores, dataRecency, old→new deltas), and the exact deploy
    command **printed, not run**.
18. If any city failed Phase 2 or the build failed Phase 4: do NOT commit. Hand
    off a precise gap report (which cities/fields/checks failed, and what the
    dossier must supply). Author nothing, commit nothing.

## Optional cross-references (surface for the human; do NOT block on them)

These don't break the build and are not required, but list them so the human can
decide:
- **`VISA_EASE_BY_COUNTRY`** (`src/data/fireNumber.ts` ~line 166): a NEW country
  isn't in the map and defaults to `'Moderate'`. Note new countries so the human
  can add an explicit entry if desired.
- **`CITY_CONFIDENCE`** (`src/data/spendingProfile.ts` ~line 142): a NEW slug
  isn't in the map and defaults to `'Estimated'`. If the dossier flags a city as
  low-confidence, recommend an explicit `'Estimated'` entry.

## Repo facts worth knowing (from `CLAUDE.md`)

- Static Astro site; `npm run build` is the ONLY "does it compile / does the data
  render" gate — there are no tests and no runtime schema check on city data.
- The live UI renders only **3 of the 5 tiers** (Lean→1M, FIRE→3M, FatFIRE→10M);
  2M/5M are authored but not shown. Still author all five (the schema requires
  them), but a reconciliation defect in 1M/3M/10M is higher-stakes than in 2M/5M.
- Prod auto-deploys on push to `main`. That's why you commit but never push.
- **Cost basis is single-person (one adult)** for new/refreshed dossiers. Some
  older records may still be household-basis — surface the difference, never
  rebalance figures to hide it (see "Cost basis" above).

## Never do

- Never invent, estimate, or coerce a value that isn't in the dossier (recomputing
  `fireScore` is the sole exception — it's derived). Tempted to fill a gap? STOP
  and report it.
- Never write a record that fails validation. Never force a tier sum by nudging a
  line item. Never author a field the live schema doesn't have.
- Never silently overwrite an existing city. Never commit a batch whose build
  failed or whose validation didn't pass. Never deploy.
- Never edit anything unrelated to authoring these cities (no engine, no other
  cities, no unrelated config). The only files you touch are the city JSONs and
  `index.ts`.
- Never author a tier narrative that specifies household size in EITHER direction (neither
  "solo/for one" nor "couple/family/kids"), and never write or "fix" a narrative yourself —
  missing or headcount-specific narratives are a STOP, and corrected neutral prose must come
  from the dossier.
