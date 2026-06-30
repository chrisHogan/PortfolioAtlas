// ============================================================================
// Historical-sequence retirement backtest engine (cFIREsim-style).
//
// PURE, isolated module. No DOM, no network, no Node-only APIs. Importable at
// build time and in the browser. Consumes the committed annual dataset in
// ./historicalReturns.json (nominal US returns + realized CPI, 1871-2022).
//
// ---------------------------------------------------------------------------
// ASSUMPTIONS / MECHANICS (implemented exactly; not improvised)
// ---------------------------------------------------------------------------
// 1. SEQUENCES: one sequence per historical start year that has a COMPLETE
//    `horizonYears`-length window in the dataset. With data 1871..2022 and a
//    30-year horizon, start years are 1871..1993 (i.e. i + horizonYears <= n).
//
// 2. ALLOCATION: fixed stock/bond split, rebalanced annually, modeled as a
//    single blended nominal return each year:
//        blended = stockAllocation * stockReturn[yr] + bondAllocation * bondReturn[yr]
//    Defaults: 75% stocks / 25% bonds. (Caller-supplied allocations are used
//    verbatim; they are NOT renormalized.)
//
// 3. WITHDRAWAL TIMING: withdraw at the START of the year, then grow the
//    remainder for the full year:
//        balance = (balance - withdrawalThisYear) * (1 + blended)
//
// 4. SPENDING: `annualSpending` is the year-0 net withdrawal in today's dollars.
//    It is inflated in NOMINAL terms by the REALIZED CPI of each sequence:
//        withdrawal(year 0) = annualSpending
//        withdrawal(year t) = annualSpending * Π_{k=0..t-1} (1 + cpiInflation[startYear+k])
//
// 5. FAILURE: a sequence fails if, in ANY year, (balance - withdrawalThisYear) < 0
//    (the portfolio cannot fund that year's withdrawal). Otherwise it SURVIVES,
//    i.e. balance stays >= 0 through all `horizonYears`.
//        successRate = survivedSequences / totalSequences
//
// 6. ENDING BALANCE: nominal balance after the final year. A FAILED sequence is
//    recorded with an ending balance of 0 (the portfolio was depleted; it cannot
//    go negative in reality). worstCaseEndingBalance / medianEndingBalance are
//    computed across ALL sequences (failed counted as 0).
//
// 7. EVERYTHING IS NOMINAL: nominal market returns paired with CPI-inflated
//    nominal spending. No real-return conversion is applied anywhere.
//
// 8. DEGENERATE CASE: if `horizonYears` exceeds the available complete windows
//    (totalSequences === 0), successRate / worstCaseEndingBalance /
//    medianEndingBalance are returned as null rather than dividing by zero.
// ============================================================================

import historical from './historicalReturns.json';

interface HistoricalRow {
  year: number;
  stockReturn: number;
  bondReturn: number;
  cpiInflation: number;
}

/** Committed annual nominal dataset (1871..2022). See historicalReturns.json manifest. */
const DATA: readonly HistoricalRow[] = historical.data as HistoricalRow[];

export interface BacktestParams {
  /** Starting portfolio balance (nominal dollars). */
  initialPortfolio: number;
  /** Year-0 net withdrawal in today's dollars. */
  annualSpending: number;
  /** Number of years the portfolio must last. */
  horizonYears: number;
  /** Fraction in stocks. Default 0.75. */
  stockAllocation?: number;
  /** Fraction in bonds. Default 0.25. */
  bondAllocation?: number;
}

export interface BacktestResult {
  /** survived / total, in 0..1. null when there are no complete windows. */
  successRate: number | null;
  totalSequences: number;
  survivedSequences: number;
  /** Min nominal ending balance across all sequences (failed = 0). null when no sequences. */
  worstCaseEndingBalance: number | null;
  /** Median nominal ending balance across all sequences (failed = 0). null when no sequences. */
  medianEndingBalance: number | null;
}

const DEFAULT_STOCK_ALLOCATION = 0.75;
const DEFAULT_BOND_ALLOCATION = 0.25;

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

/**
 * Run a historical-sequence backtest over every complete `horizonYears` window
 * in the dataset. See the assumptions block at the top of this file.
 */
export function runBacktest(params: BacktestParams): BacktestResult {
  const {
    initialPortfolio,
    annualSpending,
    horizonYears,
    stockAllocation = DEFAULT_STOCK_ALLOCATION,
    bondAllocation = DEFAULT_BOND_ALLOCATION,
  } = params;

  const n = DATA.length;
  const endingBalances: number[] = [];
  let totalSequences = 0;
  let survivedSequences = 0;

  // Each start index i must have a complete window [i, i + horizonYears - 1].
  for (let i = 0; i + horizonYears <= n; i++) {
    totalSequences++;

    let balance = initialPortfolio;
    let withdrawal = annualSpending; // year-0 withdrawal, in nominal today's dollars
    let survived = true;

    for (let t = 0; t < horizonYears; t++) {
      const row = DATA[i + t];

      // Withdraw at the start of the year.
      const afterWithdrawal = balance - withdrawal;
      if (afterWithdrawal < 0) {
        survived = false;
        break;
      }

      // Grow the remainder by the blended nominal return.
      const blended = stockAllocation * row.stockReturn + bondAllocation * row.bondReturn;
      balance = afterWithdrawal * (1 + blended);

      // Inflate next year's withdrawal by THIS year's realized CPI.
      withdrawal = withdrawal * (1 + row.cpiInflation);
    }

    if (survived) {
      survivedSequences++;
      endingBalances.push(balance);
    } else {
      endingBalances.push(0); // depleted
    }
  }

  if (totalSequences === 0) {
    return {
      successRate: null,
      totalSequences: 0,
      survivedSequences: 0,
      worstCaseEndingBalance: null,
      medianEndingBalance: null,
    };
  }

  return {
    successRate: survivedSequences / totalSequences,
    totalSequences,
    survivedSequences,
    worstCaseEndingBalance: Math.min(...endingBalances),
    medianEndingBalance: median(endingBalances),
  };
}

/** Number of complete `horizonYears` windows available in the dataset. */
export function availableSequences(horizonYears: number): number {
  return Math.max(0, DATA.length - horizonYears + 1);
}

/** Coverage of the committed dataset, for callers that want to show provenance. */
export const DATASET_COVERAGE = {
  firstYear: DATA[0]?.year ?? null,
  lastYear: DATA[DATA.length - 1]?.year ?? null,
  count: DATA.length,
} as const;
