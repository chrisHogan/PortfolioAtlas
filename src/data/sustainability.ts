// Sustainability signal utilities.
// Three pure functions that derive whether a given portfolio can sustain
// a given lifestyle in a given city, replacing surplus/deficit dollar amounts.

import { SAFE_WITHDRAWAL_RATE, getTotalSpend } from './types';
import type { CityData, TierKey, TierCostBreakdown } from './types';
import { applySpendingProfile } from './spendingProfile';

export type SustainabilitySignal = 'sustainable' | 'borderline' | 'not-sustainable';

/**
 * Monthly budget from a portfolio value using the 4% SWR.
 */
export function getMonthlyBudget(portfolioValue: number): number {
  return Math.round((portfolioValue * SAFE_WITHDRAWAL_RATE) / 12);
}

/**
 * Total monthly cost for a city at a given lifestyle tier,
 * optionally adjusted by a spending profile.
 */
export function getCityCost(
  cityData: CityData,
  lifestyleTier: TierKey,
  spendingProfile?: Record<string, string>,
): number {
  const tier = cityData.tiers[lifestyleTier];
  if (!tier) return 0;

  if (!spendingProfile) {
    return getTotalSpend(tier);
  }

  // Build a cost map from the tier data
  const baseCosts: Record<string, number> = {
    housing: tier.housing.monthlyCost,
    dining: tier.dining.monthlyCost,
    groceries: tier.groceries.monthlyCost,
    healthcare: tier.healthcare.monthlyCost,
    transportation: tier.transportation.monthlyCost,
    entertainment: tier.entertainment.monthlyCost,
    utilities: tier.utilities.monthlyCost,
  };

  const { adjustedCosts, totalOffset } = applySpendingProfile(baseCosts, spendingProfile);

  return (
    Object.values(adjustedCosts).reduce((sum, v) => sum + v, 0) +
    totalOffset +
    (tier.domesticHelp?.monthlyCost || 0) +
    (tier.luxuryExtras?.monthlyCost || 0)
  );
}

/**
 * Sustainability signal for a portfolio + city + tier combination.
 * - "sustainable": cost ≤ 95% of monthly budget (green)
 * - "borderline": cost between 95% and 100% of budget (amber)
 * - "not-sustainable": cost > 100% of budget (grey)
 */
export function getSustainabilitySignal(
  portfolioValue: number,
  cityData: CityData,
  lifestyleTier: TierKey,
  spendingProfile?: Record<string, string>,
): SustainabilitySignal {
  const budget = getMonthlyBudget(portfolioValue);
  const cost = getCityCost(cityData, lifestyleTier, spendingProfile);

  if (cost <= budget * 0.95) return 'sustainable';
  if (cost <= budget) return 'borderline';
  return 'not-sustainable';
}

/** Display config for each signal level. */
export const SIGNAL_DISPLAY: Record<SustainabilitySignal, { label: string; colorClass: string; dotClass: string }> = {
  'sustainable': { label: 'Sustainable', colorClass: 'text-emerald-600', dotClass: 'bg-emerald-500' },
  'borderline': { label: 'Borderline', colorClass: 'text-amber-600', dotClass: 'bg-amber-400' },
  'not-sustainable': { label: 'Not sustainable', colorClass: 'text-gray-500', dotClass: 'bg-gray-400' },
};

export const SUSTAINABILITY_FOOTNOTE = 'Based on 4% withdrawal rate with 90% historical success rate';
