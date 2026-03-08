// Spending profile configuration for personalizing cost estimates.
// Multipliers are applied to specific cost categories based on user selections.
// Offsets are flat monthly amounts added/subtracted.
// These values are intentionally easy to tune — adjust as needed.

export interface SpendingOption {
  label: string;
  value: string;
}

export interface SpendingQuestion {
  id: string;
  title: string;
  options: SpendingOption[];
  defaultValue: string;
}

export interface SpendingMultiplier {
  // Which cost categories this affects. Keys match TierCostBreakdown fields.
  housing?: number;
  dining?: number;
  groceries?: number;
  healthcare?: number;
  transportation?: number;
  entertainment?: number;
  utilities?: number;
  // Flat monthly offset (added to total, can be negative)
  monthlyOffset?: number;
}

export const SPENDING_QUESTIONS: SpendingQuestion[] = [
  {
    id: 'housing',
    title: 'Housing preference',
    options: [
      { label: 'I plan to rent', value: 'rent' },
      { label: 'I prefer to own', value: 'own' },
      { label: "I'm flexible", value: 'flexible' },
    ],
    defaultValue: 'flexible',
  },
  {
    id: 'dining',
    title: 'Dining habits',
    options: [
      { label: 'Mostly cook at home', value: 'cook' },
      { label: 'Mix of cooking and eating out', value: 'mix' },
      { label: 'Eat out most meals', value: 'eatout' },
    ],
    defaultValue: 'mix',
  },
  {
    id: 'transport',
    title: 'Transportation',
    options: [
      { label: "I don't want a car", value: 'nocar' },
      { label: "I'll need a car", value: 'car' },
      { label: 'Prefer public transit', value: 'transit' },
    ],
    defaultValue: 'transit',
  },
  {
    id: 'healthcare',
    title: 'Healthcare priority',
    options: [
      { label: 'Basic coverage is fine', value: 'basic' },
      { label: 'I want good quality care', value: 'good' },
      { label: 'Top-tier healthcare is essential', value: 'top' },
    ],
    defaultValue: 'good',
  },
  {
    id: 'travel',
    title: 'Travel frequency',
    options: [
      { label: 'Mostly stay local', value: 'local' },
      { label: 'A few trips per year', value: 'some' },
      { label: 'Frequent traveler', value: 'frequent' },
    ],
    defaultValue: 'some',
  },
];

// Multipliers for each option. Values of 1.0 = no change. Missing keys = no effect.
// e.g. dining.eatout has dining: 1.4 meaning +40% on dining costs.
export const SPENDING_MULTIPLIERS: Record<string, Record<string, SpendingMultiplier>> = {
  housing: {
    rent: {},                          // baseline — no change
    own: { housing: 1.25 },            // ownership adds ~25% (mortgage, maintenance, taxes)
    flexible: {},                      // no change
  },
  dining: {
    cook: { dining: 0.4, groceries: 1.3 },   // 60% less dining, 30% more groceries
    mix: {},                                   // baseline
    eatout: { dining: 1.4, groceries: 0.7 },  // 40% more dining, 30% less groceries
  },
  transport: {
    nocar: { transportation: 0.7 },           // 30% less on transport
    car: { transportation: 1.5 },             // 50% more (car payment, insurance, fuel)
    transit: {},                               // baseline
  },
  healthcare: {
    basic: { healthcare: 0.7 },               // 30% less
    good: {},                                  // baseline
    top: { healthcare: 1.5 },                 // 50% more for premium coverage
  },
  travel: {
    local: { entertainment: 0.8 },                          // less entertainment spend
    some: {},                                                // baseline
    frequent: { entertainment: 1.3, monthlyOffset: 400 },   // +30% entertainment + $400/mo travel budget
  },
};

// Default spending profile (used when user skips the questionnaire)
export const DEFAULT_SPENDING_PROFILE: Record<string, string> = {
  housing: 'flexible',
  dining: 'mix',
  transport: 'transit',
  healthcare: 'good',
  travel: 'some',
};

// Tier descriptions — concrete lifestyle descriptions replacing abstract labels.
// Used on city cards, comparison tool, and tier selection UI.
export const TIER_DESCRIPTIONS: Record<string, string> = {
  'Lean FIRE': 'Modest 1-bedroom rental, cooking most meals at home, local transport only, minimal extras',
  'Lean FIRE+': 'Comfortable 1-bedroom, a mix of home cooking and dining out, basic healthcare',
  'FIRE': 'Nice 1-bedroom in a good neighborhood, dining out a few times a week, occasional weekend trips',
  Premium: 'Spacious apartment or house, regular dining out, travel several times a year, quality health coverage',
  'Fat FIRE': 'Premium apartment or house, regular fine dining, frequent travel, full private health coverage',
};

// Data recency and confidence configuration
export const DATA_RECENCY = 'Q1 2026';

// Per-city confidence level. Cities not listed default to 'Estimated'.
// 'High' = abundant, well-sourced cost-of-living data
// 'Medium' = moderate data availability
// 'Estimated' = limited data, values are estimates
export type ConfidenceLevel = 'High' | 'Medium' | 'Estimated';

export const CITY_CONFIDENCE: Record<string, ConfidenceLevel> = {
  // Southeast Asia
  'chiang-mai': 'High',
  'bangkok': 'High',
  'bali': 'High',
  'kuala-lumpur': 'High',
  'ho-chi-minh-city': 'Medium',
  'da-nang': 'Medium',
  'george-town': 'Medium',
  'cebu': 'Medium',
  'singapore': 'High',
  // East Asia
  'tokyo': 'High',
  'seoul': 'High',
  'taipei': 'High',
  'hong-kong': 'High',
  // South Asia
  'goa': 'Medium',
  'colombo': 'Estimated',
  'kathmandu': 'Estimated',
  'delhi': 'Medium',
  // Europe
  'lisbon': 'High',
  'porto': 'High',
  'barcelona': 'High',
  'athens': 'High',
  'dubrovnik': 'Medium',
  'budapest': 'High',
  'valencia': 'High',
  'chania': 'Medium',
  'tbilisi': 'Medium',
  'paris': 'High',
  'london': 'High',
  'amsterdam': 'High',
  'prague': 'High',
  'split': 'Medium',
  'tallinn': 'Medium',
  'malaga': 'Medium',
  'nice': 'High',
  'rome': 'High',
  'edinburgh': 'High',
  // Latin America
  'mexico-city': 'High',
  'medellin': 'High',
  'playa-del-carmen': 'Medium',
  'buenos-aires': 'High',
  'montevideo': 'Medium',
  'cuenca': 'Medium',
  'panama-city': 'Medium',
  'san-jose-cr': 'Medium',
  'lake-chapala': 'Estimated',
  'cartagena': 'Medium',
  'quito': 'Medium',
  'santiago': 'High',
  // Caribbean
  'san-juan': 'Medium',
  'barbados': 'Estimated',
  'cozumel': 'Estimated',
  // North America
  'austin': 'High',
  'boise': 'Medium',
  'asheville': 'Medium',
  'tucson': 'Medium',
  'sarasota': 'Medium',
  'halifax': 'Medium',
  'kelowna': 'Estimated',
  'quebec-city': 'Medium',
  'tampa': 'High',
  'san-antonio': 'High',
  'knoxville': 'Medium',
  'madison': 'Medium',
  'omaha': 'Medium',
  'des-moines': 'Medium',
  'sioux-falls': 'Estimated',
  'raleigh': 'Medium',
  'pittsburgh': 'High',
  'chattanooga': 'Estimated',
  'greenville': 'Estimated',
  'albuquerque': 'Medium',
  'reno': 'Medium',
  'fargo': 'Estimated',
  'midland-mi': 'Estimated',
  'seattle': 'High',
  'new-york': 'High',
  'los-angeles': 'High',
  'chicago': 'High',
  'miami': 'High',
  'san-francisco': 'High',
  'denver': 'High',
  'victoria': 'Medium',
  'san-diego': 'High',
  'portland': 'High',
  'boston': 'High',
  'honolulu': 'High',
  'charleston': 'Medium',
  'savannah': 'Medium',
  'nashville': 'High',
  'scottsdale': 'Medium',
  'washington-dc': 'High',
  'philadelphia': 'High',
  'minneapolis': 'High',
  'salt-lake-city': 'Medium',
  'las-vegas': 'High',
  'charlotte': 'High',
  'jacksonville': 'Medium',
  'santa-fe': 'Estimated',
  'fort-worth': 'Medium',
  'san-jose-ca': 'High',
  // Oceania
  'sydney': 'High',
  'melbourne': 'High',
  'auckland': 'High',
  // Middle East
  'dubai': 'High',
  'muscat': 'Medium',
  'amman': 'Medium',
  // Africa
  'cape-town': 'High',
  'marrakech': 'Medium',
  'nairobi': 'Medium',
  'accra': 'Estimated',
  'tunis': 'Estimated',
};

// Spending profile score map — used to derive lifestyle tier from answers.
// Each answer is scored 0 (low-spend), 1 (mid), 2 (high-spend).
// Sum across 5 questions: 0-3 → Budget (1M), 4-6 → Comfortable (3M), 7-10 → Luxury (10M).
// Default profile (all mid options) scores 5 → Comfortable.
export const SPENDING_SCORE_MAP: Record<string, Record<string, number>> = {
  housing: { rent: 0, flexible: 1, own: 2 },
  dining: { cook: 0, mix: 1, eatout: 2 },
  transport: { nocar: 0, transit: 1, car: 2 },
  healthcare: { basic: 0, good: 1, top: 2 },
  travel: { local: 0, some: 1, frequent: 2 },
};

export function getCityConfidenceLevel(slug: string): ConfidenceLevel {
  return CITY_CONFIDENCE[slug] || 'Estimated';
}

// Compute adjusted cost for a single line item given spending profile selections
export function applySpendingProfile(
  baseCosts: Record<string, number>,
  profile: Record<string, string>,
): { adjustedCosts: Record<string, number>; totalOffset: number } {
  const adjustedCosts = { ...baseCosts };
  let totalOffset = 0;

  for (const [questionId, selectedValue] of Object.entries(profile)) {
    const multipliers = SPENDING_MULTIPLIERS[questionId]?.[selectedValue];
    if (!multipliers) continue;

    for (const [costKey, multiplier] of Object.entries(multipliers)) {
      if (costKey === 'monthlyOffset') {
        totalOffset += multiplier as number;
      } else if (costKey in adjustedCosts) {
        adjustedCosts[costKey] = Math.round(adjustedCosts[costKey] * (multiplier as number));
      }
    }
  }

  return { adjustedCosts, totalOffset };
}
