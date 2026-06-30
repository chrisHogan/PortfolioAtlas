// Self-validation for the historical backtest engine.
// Runs the three published-benchmark cases and asserts each lands in its
// expected range. Exits non-zero if any case fails — a failing engine must not
// be handed over. Run with: npm run validate:backtest
//
// Expected ranges (Trinity Study / cFIREsim ballpark):
//   A) $1M, $40k (4%), 30yr, 75/25  -> successRate 0.93..1.00
//   B) $1M, $80k (8%), 30yr, 75/25  -> successRate < 0.50 (clearly failing)
//   C) $1M, $40k (4%), 50yr, 75/25  -> successRate visibly LOWER than A

import { runBacktest, DATASET_COVERAGE } from '../src/data/backtest';

interface Check {
  label: string;
  result: ReturnType<typeof runBacktest>;
  ok: boolean;
  expectation: string;
}

function pct(x: number | null): string {
  return x === null ? 'null' : `${(x * 100).toFixed(2)}%`;
}

function money(x: number | null): string {
  return x === null ? 'null' : `$${Math.round(x).toLocaleString('en-US')}`;
}

console.log('Dataset coverage:', DATASET_COVERAGE);
console.log('');

const A = runBacktest({ initialPortfolio: 1_000_000, annualSpending: 40_000, horizonYears: 30, stockAllocation: 0.75, bondAllocation: 0.25 });
const B = runBacktest({ initialPortfolio: 1_000_000, annualSpending: 80_000, horizonYears: 30, stockAllocation: 0.75, bondAllocation: 0.25 });
const C = runBacktest({ initialPortfolio: 1_000_000, annualSpending: 40_000, horizonYears: 50, stockAllocation: 0.75, bondAllocation: 0.25 });

const checks: Check[] = [
  {
    label: 'A) $1M, $40k (4%), 30yr, 75/25',
    result: A,
    ok: A.successRate !== null && A.successRate >= 0.93 && A.successRate <= 1.0,
    expectation: 'successRate in [0.93, 1.00]',
  },
  {
    label: 'B) $1M, $80k (8%), 30yr, 75/25',
    result: B,
    ok: B.successRate !== null && B.successRate < 0.5,
    expectation: 'successRate < 0.50',
  },
  {
    label: 'C) $1M, $40k (4%), 50yr, 75/25',
    result: C,
    ok: C.successRate !== null && A.successRate !== null && C.successRate < A.successRate,
    expectation: 'successRate visibly LOWER than case A',
  },
];

for (const c of checks) {
  const r = c.result;
  console.log(c.label);
  console.log(`   successRate   : ${pct(r.successRate)}  (${r.survivedSequences}/${r.totalSequences} sequences)`);
  console.log(`   worstEnding   : ${money(r.worstCaseEndingBalance)}`);
  console.log(`   medianEnding  : ${money(r.medianEndingBalance)}`);
  console.log(`   expect        : ${c.expectation}`);
  console.log(`   => ${c.ok ? 'PASS' : 'FAIL'}`);
  console.log('');
}

const allPass = checks.every((c) => c.ok);
console.log(`Horizon sensitivity: A=${pct(A.successRate)} (30yr) vs C=${pct(C.successRate)} (50yr)`);
console.log(allPass ? '\nALL BENCHMARKS PASSED' : '\nBENCHMARK FAILURE');

if (!allPass) {
  process.exit(1);
}
