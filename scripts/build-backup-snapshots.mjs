import { cp, mkdir, readFile, writeFile, readdir, mkdtemp, rename, rm } from 'node:fs/promises';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import env from '@next/env';
import { createClient } from '@sanity/client';

env.loadEnvConfig(process.cwd());
const base = process.env.BACKUP_RENDER_ORIGIN || 'http://127.0.0.1:3037';
if (!/^http:\/\/(127\.0\.0\.1|localhost):\d+$/.test(base)) throw new Error('Snapshots must be rendered from the isolated local build.');
const output = path.resolve('.backup-static');
await mkdir(output, { recursive: true });
const staging = await mkdtemp(path.join(output, 'pending-'));
const assets = path.join(staging, 'assets');
await mkdir(assets, { recursive: true });
await cp('public', assets, { recursive: true });
await mkdir(path.join(assets, '_next'), { recursive: true });
await cp('.next/static', path.join(assets, '_next/static'), { recursive: true });
const client = createClient({ projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID, dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production', apiVersion: '2026-03-01', token: process.env.SANITY_API_READ_TOKEN, useCdn: false, timeout: 15000, maxRetries: 0 });
const posts = await client.fetch('*[_type=="blogPost" && !defined(archivedAt) && defined(slug.current)]{"slug":slug.current,title}', {}, { perspective: 'published' });
const coverage = JSON.parse(await readFile('src/content/coverage.json', 'utf8'));
const paths = [...new Set([...Object.keys(coverage).filter(route => !route.includes('[')), ...posts.map(post => `/blog/${encodeURIComponent(post.slug)}`), '/studio'])];
const manifest = { generatedAt: new Date().toISOString(), sourceCommit: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(), routes: {} };
let index = 0;
for (const route of paths) {
  const response = await fetch(base + route, { redirect: 'manual', signal: AbortSignal.timeout(45000) });
  if ([301, 302, 307, 308].includes(response.status)) {
    const location = response.headers.get('location');
    if (!location || new URL(location, base).origin !== base) throw new Error(`Unexpected redirect for ${route}`);
    const redirected = new URL(location, base);
    manifest.routes[route] = { location: redirected.pathname + redirected.search + redirected.hash, status: response.status };
    continue;
  }
  if (!response.ok) throw new Error(`Snapshot failed: ${route} ${response.status}`);
  let html = await response.text();
  if (!html.includes('</html>') || html.includes('NEXT_HTTP_ERROR_FALLBACK;500')) throw new Error(`Incomplete HTML: ${route}`);
  const post = posts.find(post => route === `/blog/${encodeURIComponent(post.slug)}`);
  if (post && !html.includes(post.title)) throw new Error(`Published blog is missing: ${route}`);
  const file = `/_snapshot-pages/${index++}`;
  await mkdir(path.join(assets, '_snapshot-pages'), { recursive: true });
  // Prevent prefetch from causing dynamic rendering. Full RSC responses are
  // captured separately for client navigation, with no runtime CMS credentials.
  const flight = await fetch(base + route, { headers: { RSC: '1' }, signal: AbortSignal.timeout(45000) });
  if (!flight.ok || !(flight.headers.get('content-type') || '').includes('text/x-component')) throw new Error(`RSC capture failed: ${route}`);
  const rsc = await flight.text();
  await writeFile(path.join(assets, file + '.html'), html);
  await writeFile(path.join(assets, file + '.rsc'), rsc);
  manifest.routes[route] = { html: file + '.html', rsc: file + '.rsc' };
  console.log(`Prepared ${route}`);
}
for (const route of ['/robots.txt', '/sitemap.xml', '/manifest.webmanifest', '/icon.png', '/apple-icon.png', '/favicon.ico']) {
  const response = await fetch(base + route, { signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error(`Asset capture failed: ${route}`);
  await writeFile(path.join(assets, route), Buffer.from(await response.arrayBuffer()));
}
const notFound = await fetch(base + '/backup-test-missing-page', { signal: AbortSignal.timeout(30000) });
if (notFound.status !== 404) throw new Error('404 capture did not return 404.');
await writeFile(path.join(assets, '404.html'), await notFound.text());
const secrets = ['SANITY_API_TOKEN', 'SANITY_API_READ_TOKEN', 'SANITY_SUBMISSIONS_WRITE_TOKEN'].map(key => process.env[key]).filter(value => value && value.length > 12);
async function scan(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) await scan(file);
    else if (/\.(html|rsc|json|js|txt)$/.test(entry.name)) {
      const text = await readFile(file, 'utf8');
      if (secrets.some(secret => text.includes(secret))) throw new Error('A credential was found in generated public assets. Deployment stopped.');
    }
  }
}
await scan(assets);
// Publish only a complete, scanned snapshot. Failed builds leave the last
// working local snapshot intact. Never merge old deleted pages into a new build.
const currentAssets = path.join(output, 'assets');
const previousAssets = path.join(output, 'previous-assets');
await rm(previousAssets, { recursive: true, force: true });
await rename(currentAssets, previousAssets).catch(error => { if (error.code !== 'ENOENT') throw error; });
await rename(assets, currentAssets);
await rm(staging, { recursive: true, force: true });
await writeFile(path.join(output, 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log(`Prepared ${Object.keys(manifest.routes).length} routes; public asset secret scan passed.`);
