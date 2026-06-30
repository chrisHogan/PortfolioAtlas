// Single source of truth for the "can you retire here?" verdict — driven by ONE
// confidence threshold the user picks (the confidence-level control). The same
// threshold gates the green/"You can retire here" cutoff AND sizes the dollar
// target (requiredPortfolio) on every surface. Do NOT hardcode a second cutoff.

import { runBacktest } from './backtest';

/** User-selectable confidence stops. `pct` is the URL value (?conf=). */
export const CONF_STOPS = [
  { key: 'aggressive', label: 'Aggressive', pct: 80, threshold: 0.80 },
  { key: 'balanced', label: 'Balanced', pct: 90, threshold: 0.90 },
  { key: 'conservative', label: 'Conservative', pct: 95, threshold: 0.95 },
] as const;

export const DEFAULT_THRESHOLD = 0.90; // "Balanced"
export const CAUTION_BAND = 0.10;      // "Close" = within 10 points below the threshold

/** Resolve a ?conf percent (80/90/95) to a threshold; falls back to Balanced. */
export function thresholdFromConf(confPct: number | null | undefined): number {
  const stop = CONF_STOPS.find((s) => s.pct === confPct);
  return stop ? stop.threshold : DEFAULT_THRESHOLD;
}

export type RetireBand = 'retire' | 'caution' | 'not-yet';

/**
 * Classify a backtest survival rate (0..1, or null) against the chosen threshold.
 *   survival >= threshold              -> retire
 *   threshold-0.10 <= survival < t     -> caution ("Close")
 *   else / null                        -> not-yet
 */
export function classifySurvival(survival: number | null, threshold: number = DEFAULT_THRESHOLD): RetireBand {
  if (survival === null) return 'not-yet';
  if (survival >= threshold) return 'retire';
  if (survival >= threshold - CAUTION_BAND) return 'caution';
  return 'not-yet';
}

/** True only when the verdict is the positive "you can retire here" (green). */
export function isRetire(survival: number | null, threshold: number = DEFAULT_THRESHOLD): boolean {
  return classifySurvival(survival, threshold) === 'retire';
}

export const BAND_LABEL: Record<RetireBand, string> = {
  retire: 'You can retire here',
  caution: 'Close — worth a closer look',
  'not-yet': 'Not quite yet',
};

/**
 * Minimum portfolio (rounded to $1,000) whose backtest survival reaches
 * `targetSurvival` for a given spend + horizon. Found by bisection on the frozen
 * engine, which is monotonic in portfolio (more money never lowers survival).
 * Returns 0 when there is no net spending, and null when even a very large
 * portfolio can't reach the target (spend too high for the horizon).
 */
export function requiredPortfolio({
  annualSpending,
  horizonYears,
  targetSurvival,
  stock = 0.75,
  bond = 0.25,
}: {
  annualSpending: number;
  horizonYears: number;
  targetSurvival: number;
  stock?: number;
  bond?: number;
}): number | null {
  if (annualSpending <= 0) return 0;
  const survivalAt = (p: number): number | null =>
    runBacktest({ initialPortfolio: p, annualSpending, horizonYears, stockAllocation: stock, bondAllocation: bond }).successRate;

  let lo = annualSpending;       // ~100% withdrawal -> ~0% survival
  let hi = annualSpending * 60;  // ~1.7% withdrawal -> ~100% survival
  const top = survivalAt(hi);
  if (top === null || top < targetSurvival) return null; // unreachable at this horizon
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    const s = survivalAt(mid);
    if (s !== null && s >= targetSurvival) hi = mid; else lo = mid;
  }
  // hi always satisfies the target; round UP so the $1,000-rounded figure still does.
  return Math.ceil(hi / 1000) * 1000;
}
