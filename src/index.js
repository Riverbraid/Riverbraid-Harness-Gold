/**
 * Riverbraid-Harness-Gold: src/index.js
 * Test Harness Implementation (v1.3.0)
 */
export const RB_PETAL_ID = 'Riverbraid-Harness-Gold';

export function runTest(name, fn) {
  try {
    const result = fn();
    return { name, passed: result === true };
  } catch (err) {
    return { name, passed: false, reason: err.message };
  }
}

export function runSuite(suiteName, tests) {
  const results = tests.map(t => runTest(t.name, t.fn));
  return {
    suite: suiteName,
    passed: results.filter(r => r.passed).length,
    failed: results.filter(r => !r.passed).length,
    results
  };
}
