const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const BASE = '/workspaces';

function must(cmd, cwd) {
    process.stdout.write(`[RUN] ${path.basename(cwd)}: ${cmd}... `);
    try {
        cp.execSync(cmd, { cwd, stdio: 'pipe' });
        console.log("OK");
    } catch (e) {
        console.log("FAILED");
        console.error(e.stderr?.toString() || e.message);
        throw e;
    }
}

const agents = fs.readdirSync(BASE)
    .filter(n => n.startsWith('Riverbraid-') && n.endsWith('-Gold'))
    .map(n => path.join(BASE, n))
    .filter(p => fs.existsSync(path.join(p, 'run-vectors.cjs')));

async function recoverAll() {
    console.log("[START] Hardened Swarm Recovery");
    for (const agent of agents) {
        must('node run-vectors.cjs snapshot', agent);
        must('node run-vectors.cjs sign', agent);
    }
    console.log("[DONE] Recovery complete");
}

recoverAll().catch(() => process.exit(1));
