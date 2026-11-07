import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const base = process.env.QA_BASE_URL || 'https://static-test-jamia-backup.jamianesaria.workers.dev';
const manifest = JSON.parse(await readFile('.backup-static/manifest.json', 'utf8'));
const timings = [];
for (const [route, entry] of Object.entries(manifest.routes)) {
  const start = performance.now();
  const response = await fetch(base + route, { redirect: 'manual', signal: AbortSignal.timeout(10000) });
  await response.arrayBuffer();
  assert.equal(response.status, entry.status || 200, route);
  timings.push(performance.now() - start);
  if (entry.rsc) {
    const flight = await fetch(base + route + '?_rsc=qa', { headers: { RSC: '1' }, signal: AbortSignal.timeout(10000) });
    assert.equal(flight.status, 200, route + ' RSC');
    assert.match(flight.headers.get('content-type'), /text\/x-component/);
    await flight.arrayBuffer();
  }
}
for (let index = 0; index < 30; index++) {
  const start = performance.now();
  const response = await fetch(base, { signal: AbortSignal.timeout(10000) });
  assert.equal(response.status, 200, `Repeat ${index}`);
  await response.arrayBuffer();
  timings.push(performance.now() - start);
}
for (const route of ['/api/apply', '/api/contact', '/api/badri']) {
  const response = await fetch(base + route, { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://untrusted.example' }, body: '{}' });
  assert.equal(response.status, 403);
}
const missing = await fetch(base + '/definitely-missing-backup-page');
assert.equal(missing.status, 404);
timings.sort((a,b) => a-b);
console.log(JSON.stringify({ routes: Object.keys(manifest.routes).length, repeatedHomeRequests: 30, medianMs: Math.round(timings[Math.floor(timings.length/2)]), p95Ms: Math.round(timings[Math.floor(timings.length*.95)]), maxMs: Math.round(timings.at(-1)), crossOriginFormsRejected: true, missingPageStatus: missing.status }));
