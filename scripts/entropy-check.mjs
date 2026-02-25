import fs from 'fs';
import path from 'path';

const HIGH_ENTROPY_PATTERNS = [/Math\.random\(\)/g, /new Date\(\)/g, /Date\.now\(\)/g];

function scan(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!fullPath.includes('node_modules') && !fullPath.includes('.git')) scan(fullPath);
    } else if (fullPath.endsWith('.js') || fullPath.endsWith('.mjs')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      HIGH_ENTROPY_PATTERNS.forEach(pattern => {
        if (pattern.test(content)) {
          console.error(`❌ Entropy Violation: ${fullPath} contains ${pattern}`);
          process.exit(1);
        }
      });
    }
  }
}

console.log("🔍 Scanning for non-deterministic entropy...");
scan('../../'); // Scan from workspaces level
console.log("✅ No non-deterministic entropy detected.");
