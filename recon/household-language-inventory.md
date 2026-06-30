# Household-Language Inventory

Feeds the later household-size feature. The cost dataset assumes **a single adult**
(now stated in UI — see Phase 2, step 2). This file catalogs prose that references a
second person, a couple, or a family so a future pass can reconcile it against a
household-size toggle.

- **Fixed now** = surgical singular-neutral swaps already applied in this pass (step 4a).
- **Inventory only** = left untouched on purpose; needs human judgment (step 4b).

Generated during Phase 2 honesty/clarity copy pass. No calculation logic, constants,
city cost numbers, routing, or config were changed.

---

## Fixed now (step 4a swaps applied)

**None.** A full sweep of the in-scope cost-data prose — `TIER_DESCRIPTIONS`
(`src/data/spendingProfile.ts`), `LIFESTYLE_DESCRIPTIONS` (`src/data/fireNumber.ts`),
all `src/data/cities/*.json` prose (`description`, per-tier `description`, `lifestyle`),
and tier/lifestyle blurbs in components (`TierBreakdown.astro`, `PersonalizedTier.astro`)
— found **no phrase that presupposes a second person sharing a cost or activity**
("your partner", "you and your partner", "as a couple", "for two", etc.).

All apparent matches were false positives and were verified, not edited:

| File:line | Token matched | Why it is NOT a second-person cost reference |
|---|---|---|
| `src/data/cities/*.json` (24 files, e.g. `lisbon.json:55`, `rome.json:55`) | "a couple of times a week" / "a couple of dollars" | Idiom meaning "a few"; not two people. |
| `src/data/cities/des-moines.json:124`, `asheville.json:124`, `fargo.json:162`, `greenville.json:162`, `wausau.json:162`, `chattanooga.json:124`, `kelowna.json:177`, `seattle.json:188` | "farm partnerships" / "winery partnership" | Business arrangement (luxury-extras prose); not a romantic partner. |
| `src/data/cities/boston.json:169` | "Partners Healthcare" | Proper noun (hospital system). |
| `src/data/cities/cuenca.json:191`, `san-jose-cr.json:191` | "gives you two distinct bases/homes" | "you" + "two distinct homes" (two *properties*, one person); not "you two". |

> Net: nothing to swap. The cost prose is already singular-neutral, so it is
> forward-compatible with a future household toggle as-is.

---

## Inventory only (step 4b — do NOT edit without human review)

### A. In-scope (city data prose)

| # | File:line | Exact phrase | Read | Suggested neutral rewrite (later) |
|---|---|---|---|---|
| 1 | `src/data/cities/ho-chi-minh-city.json:169` | "...24/7 private doctor access; **full family coverage**" (10M-tier healthcare `description`) | **Strongest candidate.** Directly attaches a *family* to the per-adult healthcare line. | "full private coverage" or "full international coverage" |
| 2 | `src/data/cities/chania.json:34` | "Daily meals at **family-run** tavernas..." | Atmospheric — describes restaurant *type*, not the user's household. Likely keep. | (none — not a contradiction) |
| 3 | `src/data/cities/chania.json:55` | "...eat at **family-run** tavernas regularly..." | Same as #2. | (none) |
| 4 | `src/data/cities/da-nang.json:109` | "...surf **school**, spa retreats..." (luxury-extras `description`) | "school" = a surf activity, not children's schooling. Keep. | (none) |
| 5 | `src/data/cities/delhi.json:79` | "Theatre at National **School** of Drama..." | Proper-noun venue. Keep. | (none) |

### B. Out of scope this pass (blog / long-form editorial — deferred)

The blog posts (`src/content/blog/*.md`) were **not** in the step-4 surfaces list, and the
references below are *factual statements* (visa eligibility, insurance pricing) rather than
the calculator's cost basis. Rewriting them to singular would change factual meaning, so
they are deferred to a human editorial pass.

| # | File:line | Exact phrase | Note |
|---|---|---|---|
| 6 | `src/content/blog/best-cities-to-retire-on-500k.md:14` | "...below the poverty line **for a couple**. In Lean FIRE cost-of-living terms, it's a full life." | Rhetorical comparison; two-person framing is intentional. |
| 7 | `src/content/blog/retiring-in-lake-chapala-mexico.md:70` | "Private health insurance typically runs $300–$500/month **for a couple**." | Factual price quote for two people. |
| 8 | `src/content/blog/retiring-in-da-nang-vietnam.md:71` | "TT (visitor) visa for **spouses**/parents of Vietnamese citizens." | Factual visa-eligibility content. |
| 9 | `src/content/blog/retiring-in-hungary-budapest.md:76` | "**Family:** **Spouse** and minor children included" | Factual visa-eligibility content. |
| 10 | `src/content/blog/retiring-in-da-nang-vietnam.md:52` | "**Household staff** including a chef, housekeeper, gardener, driver..." | Luxury staffing prose, not occupancy. |

---

## How this connects to the feature

When the household-size toggle lands, the per-category multipliers (housing ~1.0–1.3×,
healthcare ~× adults, food ~1.6× for two, plus an optional kids/education add-on) will
make item #1 ("full family coverage") accurate for the family setting and the new
single-adult UI line conditional on the selected size. Items #2–#5 are atmospheric and
likely need no change. Items #6–#10 are editorial and should be handled in a blog pass.
