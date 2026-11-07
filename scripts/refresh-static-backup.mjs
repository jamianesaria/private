import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire(import.meta.url);
const next = require.resolve('next/dist/bin/next');
const wrangler = path.resolve('node_modules/wrangler/bin/wrangler.js');
const port = 3039;
const base = `http://127.0.0.1:${port}`;
const prepareOnly = process.argv.includes('--prepare-only');
async function run(args, environment = {}) {
  await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, args, { stdio: 'inherit', env: { ...process.env, ...environment } });
    child.on('error', reject);
    child.on('exit', code => code === 0 ? resolve() : reject(new Error(`Build step failed with exit ${code}; existing deployed backup was not changed.`)));
  });
}
await run([next, 'build', '--webpack']);
const server = spawn(process.execPath, [next, 'start', '-p', String(port), '-H', '127.0.0.1'], { stdio: 'inherit' });
try {
  let ready = false;
  for (let attempt = 0; attempt < 60; attempt++) {
    try { ready = (await fetch(base + '/robots.txt', { signal: AbortSignal.timeout(1000) })).ok; } catch {}
    if (ready) break;
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  if (!ready) throw new Error('Isolated local render server did not become ready.');
  await run(['scripts/build-backup-snapshots.mjs'], { BACKUP_RENDER_ORIGIN: base });
} finally { server.kill(); }
if (prepareOnly) {
  console.log('Snapshot prepared and credential scan passed; no deployment was performed.');
  process.exit(0);
}
await run([wrangler, 'versions', 'upload', '--config', 'wrangler.static.jsonc', '--preview-alias', 'static-test']);
const testEnv = { QA_BASE_URL: 'https://static-test-jamia-backup.jamianesaria.workers.dev' };
await run(['scripts/check-static-backup-routes.mjs'], testEnv);
await run(['scripts/check-cloudflare-content.mjs'], testEnv);
console.log('New snapshot uploaded and public checks passed. Existing active backup is unchanged.');
console.log('Review the printed version ID and preview before promoting that exact version.');
