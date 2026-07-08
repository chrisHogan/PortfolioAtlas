# PortfolioAtlas — context for AI sessions

A FIRE retirement-location explorer (https://portfolioatlas.org). Enter a portfolio
value → see where in 100+ cities you could retire, judged by a **historical backtest**
(not the 4% rule). Tagline: "What kind of lifestyle can your portfolio buy you around
the world?"

## Stack
- **Astro 5** (`^5.18.0`), **static / fully prerendered** (no `output`/adapter set → `output:'static'`), `build.format:'file'` (emits `page.html`). **No UI framework** — interactivity is vanilla `<script>` islands inside `.astro` files.
- **Tailwind 3** (+ typography), **Sharp** (OG images), **@astrojs/sitemap**.
- **Node 20** (`.nvmrc`). TypeScript strict.
- No test framework, no linter/prettier, **no Zod/schema validation on city data** (the only Zod is `src/content/config.ts`, for the blog).

## Commands
```bash
npm run dev               # astro dev → http://localhost:4321  (4322+ if 4321 is busy)
npm run build             # astro build → dist/  (this is the only "does it compile?" gate)
npm run preview           # wrangler pages dev dist
npm run validate:backtest # runs the backtest engine self-check vs Trinity/cFIREsim benchmarks
                          # (uses esbuild to run the .ts — there is NO tsx/ts-node installed)
```
`npm run build` catches import errors, JSON parse errors, and render throws — but **not**
city-JSON shape (see below). There are no tests.

## Deploy (prod)
- **Prod auto-deploys from a push to GitHub `main`** (Cloudflare Pages git integration). So **`git push origin main` IS the deploy.** It builds fast (~1–2 min) and goes live at portfolioatlas.org.
- Manual fallback: `npx wrangler pages deploy dist` — but wrangler is **not logged in** in CI/sandbox, and there's **no `wrangler.toml`**, so it needs `--project-name=<pages-project>` and interactive auth. Prefer the git-push path.
- Workflow: branch off `main`, PR, then merge to `main` to ship. Don't commit straight to `main` unless asked.

## Household money: one composition function, per-page repaint choke points
Session household state (`pa:adults`, `pa:hcusd`) affects money displays on the
homepage, city pages, AND compare. Two invariants (added 2026-07-05 after a
family of stale-display bugs):
- **All composition goes through `adjustedMonthlyTotal()` / `fireNumberPreview()`
  in `src/data/household.ts`** — module scripts import them; define:vars scripts
  (homepage, compare) reach them via `window.__paAdjustedMonthly` /
  `__paFirePreview` bridges. Never re-implement scaling/override math at a call site.
- **Each page has ONE repaint choke point** that owns every household-sensitive
  money element: city page `repaintHouseholdMoney()` (table, lifestyle cards,
  RelatedCities via `data-rc-lines`), compare `tierView()` + the
  `pa:household-ready`/`pageshow` repaints, homepage `adjustedMonthlyOf()`.
  A new money element gets wired into the page's choke point, not a handler.
Deliberately single-adult (do NOT scale): FAQ text/JSON-LD, meta descriptions,
retire-in/retire-on hub pages.

(The old `/compare` duplicate-route build warning is gone — `compare.astro` was
deleted 2026-07-05; `/compare` is served by `compare/index.astro`.)

## Where things live (and a gotcha)
- **Engine/calc modules are in `src/data/*.ts`** — `types.ts`, `fireNumber.ts`, `sustainability.ts`, `backtest.ts`, `retirementBands.ts`. **NOT** `src/data/cities/*.ts` (that's just `index.ts` + the JSON). An earlier survey got this wrong; don't repeat it.
- `src/data/cities/*.json` — one file per city (~113). `src/data/cities/index.ts` imports + aggregates them into `allCities`.
- `src/pages/index.astro` — the homepage calculator (huge: ~1.5k lines incl. a big inline script).
- `src/pages/cities/[slug].astro` — city detail pages.
- `src/components/FireStatusCard.astro` — the "You could retire here today" box (USED, on city pages).

## The retirement model (current, post-"Phase B")
The verdict is a **historical backtest**, not the 4% rule:
- **`src/data/backtest.ts`** — FROZEN engine. `runBacktest({initialPortfolio, annualSpending, horizonYears, stockAllocation=0.75, bondAllocation=0.25})` → `{ successRate, ... }`. Survival is **monotonic in portfolio**. **Do not modify** this file or `src/data/historicalReturns.json` (Shiller US data 1871–2022, ODC-PDDL public-domain license).
- **`src/data/retirementBands.ts`** — the single source of truth for the verdict:
  - `classifySurvival(survival, threshold)` → `'retire' | 'caution' | 'not-yet'`. "Close"/caution = within 10 points below the threshold.
  - `requiredPortfolio({annualSpending, horizonYears, targetSurvival, ...})` → the $ a city needs (bisects the engine, rounds UP, returns `null` if unreachable). This powers "Needed to retire here".
  - `CONF_STOPS` / `thresholdFromConf()` — the confidence control (Aggressive 80 / Balanced 90 / Conservative 95).
- **ONE threshold drives everything**: the green "you can retire here" cutoff AND every `requiredPortfolio` target, on the homepage map and city pages. It comes from the `?conf` URL param. There is intentionally **no second hardcoded 0.90 cutoff** anywhere — keep it that way.
- The 4% rule is now only a small **reference benchmark**, not a gate. The old withdrawal-rate slider was replaced by the confidence control; **`?swr` is retired**, use `?conf`.

## Cross-page state = URL query params (no localStorage)
The site is multi-page static, so state travels via the URL (deliberate — the homepage avoids localStorage for a clean-slate feel):
`?portfolio=` `?passive=` `?horizon=` `?conf=` (80/90/95) `?tier=` (leanfire/fire/fatfire) `?hcusd=` `?adults=` (2 only).
`carryQuery()`/`buildShareUrl()`/`restore()` in `index.astro` handle this; city pages + `FireStatusCard` read the same params.
**One deliberate exception:** the personal inputs (portfolio, passive, save, conf, horizon, tier, hcusd, adults) are
also **session-sticky** via `sessionStorage` keys `pa:<param>` — so clean-URL navigation (header search, typed URLs,
back button) keeps the user's numbers. Precedence: on the **homepage the URL wins** and updates the session (it's the
entry point — shared links + the retire-on `/?portfolio=` presets are intentional input); on **city/compare pages the
session wins** (their URLs can be stale after back-nav) and a URL param only seeds an unset key. City pages mirror the
resolved values back into the URL (`replaceState`) for the Share buttons; both pages re-sync adults/hcusd on bfcache
restore via `pageshow`. The header ✕ badge clears all `pa:*` keys (logo is plain navigation now, NOT a reset).
sessionStorage dies with the tab, so return visits still start clean. Do NOT add localStorage.

## The define:vars / module-script bridge (important quirk)
Astro `<script define:vars={...}>` is rendered **inline** and **cannot use `import`**. The homepage calculator and `FireStatusCard` are define:vars scripts. To give them the bundled engine, there's a tiny **module** `<script>` that imports and exposes globals:
`window.__paBacktest`, `window.__paRequired`, `window.__paClassify`, `window.__paThreshold`, and dispatches events `pa:engine-ready` (homepage) / `pa:survival-ready` (city page → FireStatusCard). Define:vars scripts wait on those events. If you add engine use to an inline script, go through this bridge — don't re-implement the engine (single-source rule).

## The "5 tiers" are really 3 (vestigial naming)
City JSON has 5 tier keys (`1M/2M/3M/5M/10M`), but the **live UI only renders 3** via `LIFESTYLE_TIER_MAP` (`fireNumber.ts`): **Lean FIRE→`1M`, FIRE→`3M`, Fat FIRE→`10M`**. `2M` and `5M` are referenced only by **orphaned** components (`TierBreakdown`, `TierNav`, `PersonalizedTier` — imported nowhere). The dollar names in the keys (`"3M"`) are **vestigial labels** — the verdict uses the user's typed portfolio vs the backtest of that tier's cost; the key's "$3M" means nothing now.

## Authoring a new city (quick version)
1. Create `src/data/cities/<slug>.json` (filename = `slug`, lowercase-hyphenated, unique).
2. Register in `src/data/cities/index.ts`: add an `import` + an entry in the `allCities` array (region-grouped).
3. Schema = `CityData` in `src/data/types.ts`. **`fireScore` is authored but MUST equal `computeFireScore(scores)`** (0.30·safety + 0.30·healthcare + 0.20·infra + 0.20·expat, rounded to 0.1). `region` must be one of the `Region` enum values; `tags.climate` one of `ClimateTag`. `monthlyBudget` per tier is a fixed nominal constant (`TIER_MONTHLY_BUDGET`: 3333/6667/10000/16667/33333) and is NOT the cost — the real cost is the **sum of the tier line items** (`getTotalSpend`).
4. Only `1M/3M/10M` are actually used (see above), so research those three; `2M/5M` can be interpolations or omitted (TS won't catch it — `index.ts` uses `as CityData[]`).
5. Country pages (`retire-in/[country]`) auto-derive from the `country` string (match existing spelling exactly). `CITY_CONFIDENCE` (slug→data-quality label, default "Estimated") and `VISA_EASE_BY_COUNTRY` (country→visa ease, default "Moderate") are optional. No build step validates JSON shape — validate it yourself.

## Misc gotchas
- **zsh**: `grep --include='*.astro'` patterns must be **quoted** (zsh globs them otherwise). Paths with `[slug]` must be quoted: `"src/pages/cities/[slug].astro"`.
- Analytics: GA4 `G-SKTV1C0JRK` in `src/layouts/Layout.astro`; custom events guarded with `if (typeof gtag === 'function')`. Match that pattern.
- Newsletter: `src/components/SubscribeCTA.astro` (Substack, no backend; inline iframe on homepage only, link variant elsewhere). Feedback form → Cloudflare Function `functions/api/feedback.js` → Resend.
- `recon/household-language-inventory.md` and `Documents/` (RECON_MEMO.md) are notes/artifacts, not app code.

# Reader-facing prose: voice rules (single source of truth)

All reader-facing prose — blog posts, city pages, FAQs, site copy, meta
descriptions — must follow the voice rules in the humanizer skill fork at
**`.claude/skills/humanizer/SKILL.md`** (hard constraints H1–H7 + voice rules
V1–V7). That file is the ONLY place these rules are maintained; do not copy
them here or into memory — link to the file instead. Run the skill (or apply
its rules manually) before presenting any new or rewritten prose for review.

# Code-quality agent team

This project ships a specialist agent team in `.claude/agents/` plus an orchestrator skill in `.claude/skills/dev-pipeline/`.

## Policy

- For any non-trivial feature, refactor, or bug fix, run the **dev-pipeline** skill rather than implementing directly in the main thread.
- Before committing or opening a PR, route the staged changes through the three reviewers (`reviewer-security`, `reviewer-performance`, `reviewer-correctness`) in parallel.
- Reviewers are **read-only**. All fixes go through the `coder` subagent, never the reviewer.
- Stop and ask the human before proceeding when a design flags high-risk work (auth, payments, data integrity, migrations) or when the tester surfaces a real bug.

## The team

- `designer` — plans the change; no implementation code.
- `coder` — implements from the design; matches existing conventions.
- `reviewer-security` / `reviewer-performance` / `reviewer-correctness` — three parallel read-only reviewers, distinct lenses.
- `tester` — writes and runs tests; reports pass/fail.

You can also invoke any specialist by name, e.g. "Have reviewer-correctness look at the staged changes."
