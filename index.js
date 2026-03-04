/**
 * Riverbraid-Harness-Gold: index.js
 * The Execution Floor (v1.3.0)
 */

export const runInHarness = async (task, context) => {
    const REQUIRED_ROOT = "08e829";
    
    console.log(`[HARNESS] Initializing task: ${task.name}`);

    // Safety Gate: Check context integrity
    if (context.merkle_root !== REQUIRED_ROOT) {
        throw new Error(`HARNESS_FATAL: Integrity Mismatch. Expected ${REQUIRED_ROOT}, got ${context.merkle_root}`);
    }

    // Entropy Check: Ensure the task itself is stationary
    const taskString = task.toString();
    if (taskString.includes("Math.random()") || taskString.includes("Date.now()")) {
        throw new Error("HARNESS_FATAL: Task contains banned entropy sources.");
    }

    try {
        console.log(`[HARNESS] Executing under Stationary State...`);
        const result = await task();
        return { success: true, result, timestamp: new Date().toISOString() };
    } catch (err) {
        return { success: false, error: err.message };
    }
};
