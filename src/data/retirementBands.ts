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
