// FIRE Number utilities.
// The FIRE Number is the portfolio value required to sustain a given lifestyle
// in a given city, using the 4% safe withdrawal rate.
//
// FIRE Number = (Monthly Cost × 12) ÷ SWR = Monthly Cost × 300

import { getTotalSpend, SAFE_WITHDRAWAL_RATE, formatCurrency } from './types';
import type { CityData, TierKey } from './types';

// --- Lifestyle Tiers ---

export type LifestyleTier = 'budget' | 'comfortable' | 'luxury';

/** Maps the 3 simplified lifestyle tiers to existing data tier keys */
export const LIFESTYLE_TIER_MAP: Record<LifestyleTier, TierKey> = {
  budget: '1M',
  comfortable: '3M',
  luxury: '10M',
};

export const LIFESTYLE_LABELS: Record<LifestyleTier, string> = {
  budget: 'Lean FIRE',
  comfortable: 'FIRE',
  luxury: 'Fat FIRE',
};

export const LIFESTYLE_DESCRIPTIONS: Record<LifestyleTier, string> = {
  budget: 'Modest living, local transport, cooking at home',
  comfortable: 'Nice apartment, dining out regularly, occasional travel',
  luxury: 'Premium living, frequent travel, full private healthcare',
};

export const ALL_LIFESTYLE_TIERS: LifestyleTier[] = ['budget', 'comfortable', 'luxury'];

// --- FIRE Number Calculations ---

/** Calculate FIRE Number from monthly cost, rounded to nearest $1,000 */
export function getFireNumber(monthlyCost: number): number {
  return Math.round((monthlyCost * 12) / SAFE_WITHDRAWAL_RATE / 1000) * 1000;
}

/** Get monthly cost for a city at a lifestyle tier */
export function getLifestyleMonthlyCost(city: CityData, lifestyle: LifestyleTier): number {
  const tierKey = LIFESTYLE_TIER_MAP[lifestyle];
  const tier = city.tiers[tierKey];
  return getTotalSpend(tier);
}

/** Get FIRE Number for a city at a lifestyle tier */
export function getCityFireNumber(city: CityData, lifestyle: LifestyleTier): number {
  return getFireNumber(getLifestyleMonthlyCost(city, lifestyle));
}

/** Get all three FIRE Numbers for a city */
export function getAllFireNumbers(city: CityData): Record<LifestyleTier, { fireNumber: number; monthlyCost: number }> {
  return {
    budget: {
      fireNumber: getCityFireNumber(city, 'budget'),
      monthlyCost: getLifestyleMonthlyCost(city, 'budget'),
    },
    comfortable: {
      fireNumber: getCityFireNumber(city, 'comfortable'),
      monthlyCost: getLifestyleMonthlyCost(city, 'comfortable'),
    },
    luxury: {
      fireNumber: getCityFireNumber(city, 'luxury'),
      monthlyCost: getLifestyleMonthlyCost(city, 'luxury'),
    },
  };
}

// --- Portfolio vs FIRE Number comparison ---

export interface FireComparison {
  affordable: boolean;
  gap: number; // positive = surplus, negative = shortfall
  percentAway: number; // 0 if affordable, positive % if not
}

/** Compare a portfolio against a FIRE Number */
export function comparePortfolio(portfolio: number, fireNumber: number): FireComparison {
  const gap = portfolio - fireNumber;
  const affordable = gap >= 0;
  const percentAway = affordable ? 0 : Math.round((Math.abs(gap) / fireNumber) * 100);
  return { affordable, gap, percentAway };
}

// --- Display Helpers ---

/** Format a FIRE Number for compact display: $709K, $1.14M, $2.07M */
export function formatFireNumber(amount: number): string {
  if (amount >= 1_000_000) {
    const millions = amount / 1_000_000;
    // Show up to 2 decimal places, but trim trailing zeros
    const formatted = millions.toFixed(2).replace(/\.?0+$/, '');
    return `$${formatted}M`;
  }
  if (amount >= 1_000) {
    const thousands = Math.round(amount / 1_000);
    return `$${thousands}K`;
  }
  return formatCurrency(amount);
}

/** Format gap amount: "+$340K" or "-$340K" */
export function formatGap(gap: number): string {
  const prefix = gap >= 0 ? '+' : '-';
  return `${prefix}${formatFireNumber(Math.abs(gap))}`;
}

// --- City Tags (derived from existing data) ---

export type HealthcareRating = 'Excellent' | 'Good' | 'Adequate' | 'Basic';
export type SafetyRating = 'Very safe' | 'Safe' | 'Exercise caution';
export type VisaEase = 'Easy' | 'Moderate' | 'Complex';
export type ClimateDisplay = 'Warm' | 'Mild' | 'Cold' | 'Tropical' | 'Mediterranean' | 'Desert';
export type EnglishDisplay = 'Widely spoken' | 'Common' | 'Limited' | 'Rare';

export interface CityDisplayTags {
  climate: ClimateDisplay;
  healthcare: HealthcareRating;
  english: EnglishDisplay;
  safety: SafetyRating;
  visa: VisaEase;
}

/** Derive healthcare rating from score (1-10) */
export function getHealthcareRating(score: number): HealthcareRating {
  if (score >= 8) return 'Excellent';
  if (score >= 6) return 'Good';
  if (score >= 4) return 'Adequate';
  return 'Basic';
}

/** Derive safety rating from score (1-10) */
export function getSafetyRating(score: number): SafetyRating {
  if (score >= 8) return 'Very safe';
  if (score >= 6) return 'Safe';
  return 'Exercise caution';
}

/** Map internal climate tag to display label */
export function getClimateDisplay(climate: string): ClimateDisplay {
  switch (climate) {
    case 'tropical': return 'Tropical';
    case 'subtropical': return 'Warm';
    case 'mediterranean': return 'Mediterranean';
    case 'continental': return 'Mild';
    case 'desert':
    case 'arid': return 'Desert';
    default: return 'Mild';
  }
}

/** Map internal english tag to display label */
export function getEnglishDisplay(english: string): EnglishDisplay {
  switch (english) {
    case 'high': return 'Widely spoken';
    case 'moderate': return 'Common';
    case 'low': return 'Limited';
    default: return 'Limited';
  }
}

// Visa ease lookup by country — best-effort classification for retirees
const VISA_EASE_BY_COUNTRY: Record<string, VisaEase> = {
  // Easy — dedicated retirement/passive income visas or no visa needed
  'Portugal': 'Easy',
  'Spain': 'Easy',
  'Mexico': 'Easy',
  'Panama': 'Easy',
  'Costa Rica': 'Easy',
  'Ecuador': 'Easy',
  'Colombia': 'Easy',
  'Thailand': 'Easy',
  'Malaysia': 'Easy',
  'Philippines': 'Easy',
  'Indonesia': 'Easy',
  'Georgia': 'Easy',
  'Uruguay': 'Easy',
  'Paraguay': 'Easy',
  'Barbados': 'Easy',
  'United States': 'Easy', // citizens
  'Canada': 'Moderate',
  'Puerto Rico': 'Easy', // US territory

  // Moderate — possible but paperwork-heavy
  'France': 'Moderate',
  'Italy': 'Moderate',
  'Greece': 'Moderate',
  'Croatia': 'Moderate',
  'Czech Republic': 'Moderate',
  'Hungary': 'Moderate',
  'Estonia': 'Moderate',
  'United Kingdom': 'Moderate',
  'Netherlands': 'Moderate',
  'Chile': 'Moderate',
  'Argentina': 'Moderate',
  'India': 'Moderate',
  'Sri Lanka': 'Moderate',
  'Nepal': 'Moderate',
  'Vietnam': 'Moderate',
  'Taiwan': 'Moderate',
  'South Korea': 'Moderate',
  'UAE': 'Moderate',
  'Oman': 'Moderate',
  'Jordan': 'Moderate',
  'Morocco': 'Moderate',
  'Tunisia': 'Moderate',
  'South Africa': 'Moderate',
  'Kenya': 'Moderate',
  'Ghana': 'Moderate',
  'New Zealand': 'Moderate',
  'Australia': 'Moderate',

  // Complex — difficult for retirees
  'Japan': 'Complex',
  'Singapore': 'Complex',
  'Hong Kong': 'Complex',
  'China': 'Complex',
};

/** Get visa ease for a city */
export function getVisaEase(country: string): VisaEase {
  return VISA_EASE_BY_COUNTRY[country] || 'Moderate';
}

/** Get all display tags for a city */
export function getCityDisplayTags(city: CityData): CityDisplayTags {
  return {
    climate: getClimateDisplay(city.tags.climate),
    healthcare: getHealthcareRating(city.scores.healthcare),
    english: getEnglishDisplay(city.tags.english),
    safety: getSafetyRating(city.scores.safety),
    visa: getVisaEase(city.country),
  };
}

// --- Portfolio Fit ---

export type PortfolioFitTier = 'perfect_fit' | 'within_reach' | 'over_resourced' | 'not_affordable';

/** Determine how well a portfolio fits a city's FIRE Number */
export function getPortfolioFit(portfolioValue: number, cityFireNumber: number): PortfolioFitTier {
  if (cityFireNumber <= 0) return 'over_resourced';
  const ratio = portfolioValue / cityFireNumber;
  if (ratio < 1) return 'not_affordable';
  if (ratio <= 2.5) return 'perfect_fit';
  if (ratio <= 5) return 'within_reach';
  return 'over_resourced';
}

/** Unlock thresholds for premium cities — portfolio must exceed this for "Now in range" boost */
export const PREMIUM_UNLOCK_THRESHOLDS: Record<string, number> = {
  // $3M+ tier
  'tokyo': 3_000_000,
  'dubai': 3_000_000,
  'singapore': 3_000_000,
  'sydney': 3_000_000,
  'hong-kong': 3_000_000,
  'honolulu': 3_000_000,
  // $2M+ tier
  'paris': 2_000_000,
  'amsterdam': 2_000_000,
  'london': 2_000_000,
  'new-york': 2_000_000,
  'san-francisco': 2_000_000,
  'boston': 2_000_000,
  'los-angeles': 2_000_000,
  'nice': 2_000_000,
  'edinburgh': 2_000_000,
  'rome': 2_000_000,
  'barcelona': 2_000_000,
  'auckland': 2_000_000,
  'melbourne': 2_000_000,
  'seoul': 2_000_000,
  'taipei': 2_000_000,
  'miami': 2_000_000,
  'washington-dc': 2_000_000,
  'seattle': 2_000_000,
  'san-diego': 2_000_000,
};


/** Get tag pill color classes */
export function getTagColor(category: string, value: string): string {
  switch (category) {
    case 'climate':
      if (['Tropical', 'Warm', 'Desert'].includes(value)) return 'bg-amber-50 text-amber-700';
      if (value === 'Mediterranean') return 'bg-sky-50 text-sky-700';
      return 'bg-slate-50 text-slate-600';
    case 'healthcare':
      if (value === 'Excellent') return 'bg-emerald-50 text-emerald-700';
      if (value === 'Good') return 'bg-green-50 text-green-700';
      return 'bg-gray-50 text-gray-600';
    case 'english':
      if (value === 'Widely spoken') return 'bg-blue-50 text-blue-700';
      if (value === 'Common') return 'bg-indigo-50 text-indigo-600';
      return 'bg-gray-50 text-gray-500';
    case 'safety':
      if (value === 'Very safe') return 'bg-emerald-50 text-emerald-700';
      if (value === 'Safe') return 'bg-green-50 text-green-700';
      return 'bg-orange-50 text-orange-600';
    case 'visa':
      if (value === 'Easy') return 'bg-emerald-50 text-emerald-700';
      if (value === 'Moderate') return 'bg-amber-50 text-amber-700';
      return 'bg-red-50 text-red-600';
    default:
      return 'bg-gray-50 text-gray-600';
  }
}
