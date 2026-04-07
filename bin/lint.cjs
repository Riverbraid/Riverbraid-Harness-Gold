const fs = require('fs');
const path = require('path');

const isAscii = (buf) => {
    for (let i = 0; i < buf.length; i++) {
        const b = buf[i];
        if (!(b === 9 || b === 10 || b === 13 || (b >= 32 && b <= 126))) return false;
    }
    return true;
};

const walk = (dir, files = []) => {
    fs.readdirSync(dir).forEach(f => {
        const p = path.join(dir, f);
        if (f === '.git' || f === 'node_modules') return;
        if (fs.statSync(p).isDirectory()) walk(p, files);
        else if (f.endsWith('.js') || f.endsWith('.cjs') || f.endsWith('.json')) files.push(p);
    });
    return files;
};

const files = walk(process.cwd());
let failed = false;

files.forEach(f => {
    const buf = fs.readFileSync(f);
    if (!isAscii(buf)) {
        console.error(`[FAIL] Non-ASCII byte detected: ${f}`);
        failed = true;
    }
});

if (failed) {
    console.log("\n[!] Byte-floor violation detected. Run sanitization before commit.");
    process.exit(1);
} else {
    console.log("[OK] Byte-floor clean.");
}
