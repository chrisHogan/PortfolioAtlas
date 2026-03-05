export type ClimateTag = 'tropical' | 'subtropical' | 'mediterranean' | 'continental' | 'desert' | 'arid';

export interface CityTags {
  climate: ClimateTag;
  english: 'high' | 'moderate' | 'low';
}

export interface CityQuickFacts {
  visa: string;
  timezone: string;
  language: string;
  internetSpeed: string;
  safetyRating: string;
  nearestAirport: string;
  climate: string;
  englishFriendly: 'High' | 'Moderate' | 'Low';
  currency: string;
  averageTemp: string;
}

export interface TierCostBreakdown {
  monthlyBudget: number;
  housing: {
    description: string;
    monthlyCost: number;
  };
  dining: {
    description: string;
    monthlyCost: number;
  };
  groceries: {
    monthlyCost: number;
  };
  healthcare: {
    description: string;
    monthlyCost: number;
  };
  transportation: {
    description: string;
    monthlyCost: number;
  };
  entertainment: {
    description: string;
    monthlyCost: number;
  };
  utilities: {
    monthlyCost: number;
  };
  domesticHelp?: {
    description: string;
    monthlyCost: number;
  };
  luxuryExtras?: {
    description: string;
    monthlyCost: number;
  };
  lifestyle: string;
}

export type TierKey = '1M' | '2M' | '3M' | '5M' | '10M';

export type Region = 'Southeast Asia' | 'East Asia' | 'Oceania' | 'Europe' | 'Latin America' | 'North America' | 'Middle East' | 'Africa' | 'South Asia' | 'Caribbean';

export interface CityData {
  name: string;
  country: string;
  region: Region;
  slug: string;
  emoji: string;
  fireScore: number;
  tagline: string;
  description: string;
  tags: CityTags;
  quickFacts: CityQuickFacts;
  tiers: Record<TierKey, TierCostBreakdown>;
}

export const TIER_LABELS: Record<TierKey, string> = {
  '1M': '$1 Million',
  '2M': '$2 Million',
  '3M': '$3 Million',
  '5M': '$5 Million',
  '10M': '$10 Million',
};

export const TIER_MONTHLY_BUDGET: Record<TierKey, number> = {
  '1M': 3333,
  '2M': 6667,
  '3M': 10000,
  '5M': 16667,
  '10M': 33333,
};

export const REGION_ORDER: Region[] = [
  'North America',
  'Europe',
  'Latin America',
  'Southeast Asia',
  'East Asia',
  'South Asia',
  'Oceania',
  'Middle East',
  'Africa',
  'Caribbean',
];

export function getFireScoreClass(score: number): string {
  if (score >= 7.5) return 'fire-score-high';
  if (score >= 5.5) return 'fire-score-mid';
  return 'fire-score-low';
}

export function getTotalSpend(tier: TierCostBreakdown): number {
  return (
    tier.housing.monthlyCost +
    tier.dining.monthlyCost +
    tier.groceries.monthlyCost +
    tier.healthcare.monthlyCost +
    tier.transportation.monthlyCost +
    tier.entertainment.monthlyCost +
    tier.utilities.monthlyCost +
    (tier.domesticHelp?.monthlyCost || 0) +
    (tier.luxuryExtras?.monthlyCost || 0)
  );
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
