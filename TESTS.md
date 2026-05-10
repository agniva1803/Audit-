# Tests

All tests are in `__tests__/audit-engine.test.ts` and cover the audit engine specifically.

## Run tests

```bash
npm test
# or
npx jest --no-coverage
```

## Test list

| File | Test name | What it covers |
|---|---|---|
| `__tests__/audit-engine.test.ts` | flags overspend: Team plan with single user | Rule 1: Team/Business plan with fewer seats than minimum triggers downgrade recommendation |
| `__tests__/audit-engine.test.ts` | flags large API spend for potential discount | Rule 5: API spend >$500/mo triggers an audit recommendation with non-zero savings |
| `__tests__/audit-engine.test.ts` | flags coding tool for non-coding team | Rule 2: Coding-specific tools (Cursor) used by non-coding teams get flagged with full spend as savings |
| `__tests__/audit-engine.test.ts` | returns isOptimal for single low-spend tool on right plan | Baseline: a single seat on a per-seat plan reports correct current spend |
| `__tests__/audit-engine.test.ts` | each audit gets a unique id | IDs are generated per call and differ across runs |
| `__tests__/audit-engine.test.ts` | totalMonthlySavings equals sum of per-tool savings | Aggregation: top-level savings is exactly the sum of per-recommendation savings |
| `__tests__/audit-engine.test.ts` | annualSavings is exactly 12x monthlySavings per recommendation | Math: annual is monthly × 12 with no rounding errors |
| `__tests__/audit-engine.test.ts` | handles empty tools array without throwing | Edge case: zero tools returns an empty result without throwing |

## CI

Tests run automatically on every push to `main` via `.github/workflows/ci.yml`.
