import { readFile } from 'node:fs/promises';
import path from 'node:path';
const configPath = path.join(process.env.APPDATA, 'xdg.config/.wrangler/config/default.toml');
const config = await readFile(configPath, 'utf8');
const token = config.match(/^oauth_token\s*=\s*"([^"]+)"/m)?.[1];
if (!token) throw new Error('Cloudflare CLI authorization is unavailable.');
const base = 'https://api.cloudflare.com/client/v4/accounts/359b9ee620c5a66982350a91fbce549f';
const headers = { Authorization: `Bearer ${token}` };
const scripts = await fetch(`${base}/workers/scripts`, { headers });
const body = await scripts.json();
if (!scripts.ok) { console.log(JSON.stringify({ stage: 'workers', status: scripts.status, errors: body.errors?.map(error => ({ code: error.code, message: error.message })) })); process.exit(1); }
const worker = body.result.find(worker => worker.id === 'jamia-backup');
if (!worker?.tag) throw new Error('Backup Worker tag unavailable.');
const response = await fetch(`${base}/builds/workers/${worker.tag}`, { headers });
const build = await response.json();
console.log(JSON.stringify({ stage: 'build-configuration', status: response.status, success: build.success, errors: build.errors?.map(error => ({ code: error.code, message: error.message })), fieldNames: Object.keys(build.result || {}) }));
