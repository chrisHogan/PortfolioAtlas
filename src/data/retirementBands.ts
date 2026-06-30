// Single source of truth for the "can you retire here?" verdict bands.
// The historical backtest (src/data/backtest.ts) is the engine; this maps its
// survival rate (0..1) to a verdict shared by the homepage map AND city pages.
//
//   survival >= 0.90          -> "You can retire here"          (retire / green)
//   0.75 <= survival < 0.90   -> "Close — worth a closer look"  (caution / amber)
//   survival < 0.90 (or null) -> "Not quite yet"                (not-yet / neutral)
//
// Homepage map is BINARY: green iff band === 'retire'. The caution band is a
// city-page nuance only. Do NOT introduce a second threshold elsewhere — import
// these constants instead.

export const RETIRE_SURVIVAL = 0.90;
export const CAUTION_SURVIVAL = 0.75;

export type RetireBand = 'retire' | 'caution' | 'not-yet';

/** Classify a backtest survival rate (0..1, or null for "not enough history"). */
export function classifySurvival(survival: number | null): RetireBand {
  if (survival === null) return 'not-yet';
  if (survival >= RETIRE_SURVIVAL) return 'retire';
  if (survival >= CAUTION_SURVIVAL) return 'caution';
  return 'not-yet';
}

/** True only when the verdict is the positive "you can retire here" (green). */
export function isRetire(survival: number | null): boolean {
  return classifySurvival(survival) === 'retire';
}

export const BAND_LABEL: Record<RetireBand, string> = {
  retire: 'You can retire here',
  caution: 'Close — worth a closer look',
  'not-yet': 'Not quite yet',
};

/**
 * Smallest portfolio (rounded to $1,000) at which `survivalAt(portfolio)` reaches
 * `target` — i.e. the portfolio you'd actually need to clear the "retire" line for a
 * given spend and horizon. Found by bisection on the frozen backtest engine, which
 * is monotonic in portfolio (more money never lowers survival). Returns 0 when there
 * is no net spending (passive income covers it). This is the number that is, by
 * construction, consistent with the verdict: portfolio >= needed iff survival >= target.
 */
export function portfolioNeededFor(
  survivalAt: (portfolio: number) => number | null,
  annualSpending: number,
  target = RETIRE_SURVIVAL,
): number {
  if (annualSpending <= 0) return 0;
  let lo = annualSpending;       // ~100% withdrawal -> ~0% survival
  let hi = annualSpending * 60;  // ~1.7% withdrawal -> ~100% survival
  const top = survivalAt(hi);
  if (top === null || top < target) return Math.round(hi / 1000) * 1000; // best effort
  for (let i = 0; i < 22; i++) {
    const mid = (lo + hi) / 2;
    const s = survivalAt(mid);
    if (s !== null && s >= target) hi = mid; else lo = mid;
  }
  return Math.round(hi / 1000) * 1000;
}
