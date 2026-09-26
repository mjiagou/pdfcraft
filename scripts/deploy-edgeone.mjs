#!/usr/bin/env node
/**
 * Deploy PDFCraft to EdgeOne Pages using a PREBUILT static export.
 *
 * Why this exists:
 *   EdgeOne's Git auto-build stages the whole repo on a tmpfs (/dev/shm) and
 *   runs `next build` there. With node_modules ~1.1GB + .next + the public->out
 *   copy it runs out of disk (ENOSPC) and the build fails.
 *   Solution: build on a REAL disk (local / CI runner) and upload the finished
 *   `out/` directory. No build step runs in EdgeOne's sandbox.
 *
 * Usage:
 *   node scripts/deploy-edgeone.mjs                       # build + deploy (needs --name)
 *   node scripts/deploy-edgeone.mjs --name pdfcraft       # build + deploy to project "pdfcraft"
 *   node scripts/deploy-edgeone.mjs --name pdfcraft --token $EDGEONE_API_TOKEN   # CI
 *   node scripts/deploy-edgeone.mjs --no-build --name pdfcraft   # deploy existing out/
 *   node scripts/deploy-edgeone.mjs --zip                 # only package out/ into out.zip (console upload)
 *
 * Prereqs for CLI deploy:
 *   npm install -g edgeone
 *   edgeone login            # or: edgeone login --site china
 */
import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';

const args = process.argv.slice(2);
const get = (n) => { const i = args.indexOf(n); return i !== -1 ? args[i + 1] : undefined; };
const name = get('--name') || process.env.EDGEONE_PROJECT_NAME;
const token = get('--token') || process.env.EDGEONE_API_TOKEN;
const noBuild = args.includes('--no-build');
const zipOnly = args.includes('--zip');

if (!noBuild) {
  console.log('[deploy] Running `npm run build` (local, real disk)...');
  execSync('npm run build', { stdio: 'inherit' });
}

if (!existsSync('out')) {
  console.error('[deploy] `out/` missing — build did not complete. Aborting.');
  process.exit(1);
}

if (zipOnly) {
  try {
    execSync('zip -r -q out.zip out', { stdio: 'inherit' });
    console.log('[deploy] Created out.zip — upload it via the EdgeOne Pages console (Upload / drag-drop).');
  } catch {
    console.log('[deploy] `zip` not available. Just upload the `out/` folder directly in the EdgeOne console.');
  }
  process.exit(0);
}

if (!name) {
  console.error('[deploy] No project name provided.');
  console.error('[deploy]   Use --name <project> or set EDGEONE_PROJECT_NAME.');
  console.error('[deploy]   Or run with --zip and drag out.zip into the EdgeOne console.');
  process.exit(1);
}

const cmd = `npx -y edgeone makers deploy ./out -n ${name}${token ? ` -t ${token}` : ''}`;
console.log(`[deploy] Deploying ./out -> EdgeOne project "${name}" ...`);
try {
  execSync(cmd, { stdio: 'inherit' });
} catch {
  console.error('[deploy] CLI deploy failed (CLI/login/token issue).');
  console.error('[deploy] Fallback: `npm run deploy:edgeone -- --zip` then upload out.zip in the EdgeOne console.');
  process.exit(1);
}
