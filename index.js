export const PETAL = "Harness-Gold";
export const INVARIANT = "HARNESS_STATIONARY";
export function verify(input) {
  if (!input || typeof input !== "object") {
    return {
      pass: false,
      stationary: false,
      signal: "harness-gold:INVALID_INPUT",
      reason: "input must be an object"
    };
  }
  const stationary =
    input.repo === "Riverbraid-Harness-Gold" &&
    input.petal === "Harness-Gold" &&
    input.ring === 1 &&
    input.invariant === "HARNESS_STATIONARY";
  return {
    pass: true,
    stationary,
    signal: stationary ? "harness-gold:STATIONARY" : "harness-gold:DRIFT",
    reason: stationary
      ? "Stationary fields match declared petal identity"
      : "One or more stationary fields drift from declaration"
  };
}
