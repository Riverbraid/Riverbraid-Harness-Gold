/**
 * Riverbraid-Harness-Gold: src/index.js
 * Test Harness and Pipeline Verification (v1.3.0)
 */

export const RB_PETAL_ID = 'Riverbraid-Harness-Gold';

export function runTest(name, fn) {
  if (typeof fn !== 'function') {
    return { name, passed: false, reason: 'TEST_ERROR: fn must be a function' };
  }
  try {
    const result = fn();
    if (result !== true) {
      return { name, passed: false, reason: `TEST_FAILED: returned ${JSON.stringify(result)} instead of true` };
    }
    return { name, passed: true };
  } catch (err) {
    return { name, passed: false, reason: err.message };
  }
}

export function runSuite(suiteName, tests) {
  if (!Array.isArray(tests) || tests.length === 0) {
    throw new TypeError('HARNESS_ERROR: tests must be a non-empty array');
  }
  const results = tests.map(t => runTest(t.name, t.fn));
  const passed = results.filter(r => r.passed).length;
  return { suite: suiteName, passed, failed: results.length - passed, results };
}

export function getStatus() {
  return { status: 'STATIONARY', petal: RB_PETAL_ID };
}
