import fs from 'fs';
const files = ['src/index.js', 'src/ascii.js', 'identity.contract.json'];
files.forEach(f => {
  if (!fs.existsSync(f)) { console.error(`[FAIL] Missing ${f}`); process.exit(1); }
});
console.log('[OK] Harness-Gold: Substrate Restored.');
