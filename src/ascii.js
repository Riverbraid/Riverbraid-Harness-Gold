export function banner() { return "RIVERBRAID_HARNESS_GOLD"; }
export function enforceAscii(str) { return /^[\x00-\x7F]*$/.test(str); }
export function validateLineEndings(str) { return !/\r/.test(str); }
