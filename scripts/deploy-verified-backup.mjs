import { spawn } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { stagingMatchesSnapshot } from './verify-staging-manifest.mjs';

// This is an opt-in deployment command. It first deploys and checks the
// isolated staging Worker. A failed build or check never deploys the backup.
const staging = 'https://jamia-backup-ci-preview.jamianesaria.workers.dev';
const wrangler = path.resolve('node_modules/wrangler/bin/wrangler.js');
const manifest = JSON.parse(await readFile('.backup-static/manifest.json', 'utf8'));
if (!manifest.generatedAt || !manifest.sourceCommit || !Object.keys(manifest.routes || {}).length) {
  throw new Error('Refusing to deploy an incomplete snapshot.');
}
async function run(args, extraEnv = {}) {
  await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, args, { stdio: 'inherit', env: { ...process.env, ...extraEnv } });
    child.on('error', reject);
    child.on('exit', code => code === 0 ? resolve() : reject(new Error(`Verification or deployment failed (${code}); no further deployment attempted.`)));
  });
}

await run([wrangler, 'deploy', '--config', 'wrangler.staging.jsonc']);
const response = await fetch(`${staging}/api/backup-status`, { headers: { 'Cache-Control': 'no-cache' }, signal: AbortSignal.timeout(15000) });
if (!response.ok) throw new Error('Staging status check failed; backup was not changed.');
const status = await response.json();
if (!stagingMatchesSnapshot(status, manifest)) {
  throw new Error('Staging version does not match the generated snapshot; backup was not changed.');
}
await run(['scripts/check-static-backup-routes.mjs'], { QA_BASE_URL: staging });
await run([wrangler, 'deploy', '--config', 'wrangler.static.jsonc']);
console.log('Verified snapshot deployed to the Cloudflare backup.');
