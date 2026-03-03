export const runInHarness = (fn, context) => {
    if (context.merkle_root !== "08e829") throw new Error("HARNESS_UNSAFE_ROOT");
    return fn();
};
