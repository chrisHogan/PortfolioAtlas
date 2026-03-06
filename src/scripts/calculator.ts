import type { TierKey } from '../data/types';
import { TIER_MONTHLY_BUDGET, SAFE_WITHDRAWAL_RATE } from '../data/types';

const TIER_VALUES: { key: TierKey; value: number }[] = [
  { key: '1M', value: 1_000_000 },
  { key: '2M', value: 2_000_000 },
  { key: '3M', value: 3_000_000 },
  { key: '5M', value: 5_000_000 },
  { key: '10M', value: 10_000_000 },
];

export function getMonthlyBudget(netWorth: number): number {
  return Math.round((netWorth * SAFE_WITHDRAWAL_RATE) / 12);
}

export function getClosestTierKey(netWorth: number): TierKey {
  let closest = TIER_VALUES[0];
  let minDiff = Math.abs(netWorth - closest.value);

  for (const tier of TIER_VALUES) {
    const diff = Math.abs(netWorth - tier.value);
    if (diff < minDiff) {
      minDiff = diff;
      closest = tier;
    }
  }

  return closest.key;
}

export function getNetWorthFromURL(): number | null {
  const params = new URLSearchParams(window.location.search);
  const nw = params.get('nw');
  if (!nw) return null;
  const value = parseInt(nw, 10);
  if (isNaN(value) || value <= 0) return null;
  return value;
}

export function formatNetWorthShort(netWorth: number): string {
  if (netWorth >= 1_000_000) {
    const millions = netWorth / 1_000_000;
    return millions % 1 === 0 ? `$${millions}M` : `$${millions.toFixed(1)}M`;
  }
  return `$${(netWorth / 1000).toFixed(0)}K`;
}
