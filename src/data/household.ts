// Household-size scaling for city cost line items.
//
// All stored city costs are on a SINGLE-ADULT basis (Q3 2026 migration). This
// module scales a tier's line items UP for larger households with
// category-aware multipliers — housing is largely shared, food and healthcare
// scale per person. It never modifies stored data: callers pass the serialized
// line array and get back a new scaled copy.
//
// LINE ORDER (fixed — every serialization and consumption point uses it):
//   [housing, dining, groceries, healthcare, transportation, entertainment,
//    utilities, domesticHelp?, luxuryExtras?]
// The optional pair is appended only when the tier has either line (the 10M /
// Fat FIRE tier today); a missing member of the pair serializes as 0.
//
// Every money surface MUST compose through adjustedMonthlyTotal() below —
// define:vars scripts (homepage calculator, compare tool) reach it via the
// window.__paAdjustedMonthly bridge; module scripts (city page) import it
// directly. One table, one composition function, no drift.

import type { TierCostBreakdown } from './types';

/** Single-adult → two-adult multiplier per line, in LINE ORDER. */
export const HOUSEHOLD_MULTIPLIERS: readonly number[] = [
  1.30, // housing
  1.80, // dining
  1.80, // groceries
  2.00, // healthcare
  1.40, // transportation
  1.70, // entertainment
  1.25, // utilities
  1.15, // domesticHelp
  1.50, // luxuryExtras
];

/** Index of the healthcare line in LINE ORDER — the hcusd override replaces
 *  the SCALED value at this index (the user's stated healthcare cost is
 *  authoritative and is never multiplied). */
export const HEALTHCARE_LINE_INDEX = 3;

// Lines that scale per head beyond 2 adults (dining, groceries, healthcare,
// entertainment — LINE ORDER indexes); every other line is largely shared.
const PER_HEAD_INDEXES = new Set([1, 2, 3, 5]);

/**
 * Scale a tier's serialized line items from the stored single-adult basis to
 * an `adults`-person household. adults <= 1 returns the lines untouched (a
 * copy) — exactly today's single-adult behavior. Adults 3–4 apply incremental
 * factors on top of the 2-adult result: ×(1 + 0.35(n−2)) on per-head lines,
 * ×(1 + 0.15(n−2)) on shared lines. Each scaled line is rounded to the nearest
 * dollar; the adjusted tier total is the sum of the returned lines.
 */
export function adjustedLines(lines: number[], adults: number): number[] {
  if (adults <= 1) return lines.slice();
  return lines.map((cost, i) => {
    let m = HOUSEHOLD_MULTIPLIERS[i] ?? 1;
    if (adults > 2) m *= 1 + (PER_HEAD_INDEXES.has(i) ? 0.35 : 0.15) * (adults - 2);
    return Math.round(cost * m);
  });
}

/**
 * The ONE money-composition function every household-sensitive surface must
 * use: scale the single-adult lines for the household, then apply the
 * healthcare override (which replaces the SCALED healthcare line and is never
 * multiplied). Returns the adjusted monthly total. adults <= 1 with no
 * override returns exactly the stored total — the untouched single-adult path.
 *
 * Surfaces (homepage map + reverse flow, city page table/cards/related
 * cities, compare tool + matrix) either import this directly (module scripts)
 * or reach it via the window.__paAdjustedMonthly bridge (define:vars scripts).
 * Do NOT re-implement the scaling or override composition at a call site.
 */
export function adjustedMonthlyTotal(lines: number[], adults: number, hcOverride: number | null = null): number {
  const scaled = adjustedLines(lines, adults);
  const total = scaled.reduce((sum, n) => sum + n, 0);
  if (hcOverride == null) return total;
  return (total - (scaled[HEALTHCARE_LINE_INDEX] || 0)) + Math.max(0, hcOverride);
}

/**
 * 4%-rule preview of the portfolio needed for a monthly spend — the number
 * shown wherever the backtest solver has not (yet) produced a target: the
 * city page at rest, the compare tool, related-cities cards. Matches
 * getFireNumber()'s rounding exactly, so at single-adult defaults it
 * reproduces the SSR values byte-for-byte.
 */
export function fireNumberPreview(monthly: number): number {
  return Math.round((monthly * 300) / 1000) * 1000;
}

/**
 * Serialize a tier's line items for the client, in LINE ORDER. The single
 * builder both pages use — keep it the only place the array is assembled.
 * Sum of the returned lines === getTotalSpend(tier) by construction.
 */
export function tierLines(tier: TierCostBreakdown): number[] {
  const lines = [
    tier.housing.monthlyCost,
    tier.dining.monthlyCost,
    tier.groceries.monthlyCost,
    tier.healthcare.monthlyCost,
    tier.transportation.monthlyCost,
    tier.entertainment.monthlyCost,
    tier.utilities.monthlyCost,
  ];
  if (tier.domesticHelp || tier.luxuryExtras) {
    lines.push(tier.domesticHelp?.monthlyCost || 0, tier.luxuryExtras?.monthlyCost || 0);
  }
  return lines;
}
