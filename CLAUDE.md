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

## Known harmless build warning
`[router] The route "/compare" is defined in both compare/index.astro and compare.astro` — **pre-existing**, not from your changes. Build still succeeds. (Cleanup item: dedupe those two files. It will become a hard error in a future Astro major.)

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
`?portfolio=` `?passive=` `?horizon=` `?conf=` (80/90/95) `?tier=` (leanfire/fire/fatfire).
`carryQuery()`/`buildShareUrl()`/`restore()` in `index.astro` handle this; city pages + `FireStatusCard` read the same params.

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
