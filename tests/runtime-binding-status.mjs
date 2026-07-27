import assert from "node:assert/strict";
import fs from "node:fs";

const status = JSON.parse(fs.readFileSync("RUNTIME_BINDING_STATUS.json", "utf8"));
const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));

const entrypoints = ["runtime-binding.js", "src/runtime-binding.js"];
const missingDependencies = ["bin/verify-swarm.cjs", "riverbraid-shield.js"].filter(
  (file) => !fs.existsSync(file)
);

const moduleFormatMismatches = [];
for (const file of entrypoints) {
  assert.equal(fs.existsSync(file), true, `${file} must exist`);
  const source = fs.readFileSync(file, "utf8");
  const usesCommonJs = source.includes("require(") || source.includes("module.exports");
  if (pkg.type === "module" && usesCommonJs && file.endsWith(".js")) {
    moduleFormatMismatches.push(file);
  }
}

const observedBlockerCodes = new Set(status.observed_blockers.map((item) => item.code));

if (missingDependencies.length > 0) {
  assert.equal(observedBlockerCodes.has("MISSING_VERIFY_SWARM_IMPLEMENTATION"), true);
  assert.equal(observedBlockerCodes.has("MISSING_SHIELD_IMPLEMENTATION"), true);
}

if (moduleFormatMismatches.length > 0) {
  assert.equal(observedBlockerCodes.has("MODULE_FORMAT_MISMATCH"), true);
}

const isBlocked = missingDependencies.length > 0 || moduleFormatMismatches.length > 0;

if (isBlocked) {
  assert.equal(status.status, "BLOCKED_BY_SOURCE_CONTRACT");
  assert.equal(status.gpg_execution_evidence, "NOT_ASSESSED");
  console.log(JSON.stringify({
    status: "RUNTIME_BINDING_BLOCKED_STATE_CONFIRMED",
    missing_dependencies: missingDependencies,
    module_format_mismatches: moduleFormatMismatches,
    gpg_execution_evidence: status.gpg_execution_evidence
  }, null, 2));
} else {
  assert.notEqual(
    status.status,
    "BLOCKED_BY_SOURCE_CONTRACT",
    "The status record must be reviewed when all observed source blockers are removed."
  );
  console.log("RUNTIME_BINDING_SOURCE_BLOCKERS_REMOVED_REVIEW_REQUIRED");
}
