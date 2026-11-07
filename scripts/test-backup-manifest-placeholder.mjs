import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { ensureManifestForTypecheck } from './backup-manifest-placeholder.mjs';

test('creates the typecheck manifest without overwriting an existing snapshot', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'backup-manifest-test-'));
  try {
    await ensureManifestForTypecheck(dir);
    assert.deepEqual(JSON.parse(await readFile(path.join(dir, 'manifest.json'), 'utf8')).routes, {});
    await writeFile(path.join(dir, 'manifest.json'), '{"routes":{"/":{"html":"safe"}}}');
    await ensureManifestForTypecheck(dir);
    assert.equal(JSON.parse(await readFile(path.join(dir, 'manifest.json'), 'utf8')).routes['/'].html, 'safe');
  } finally { await rm(dir, { recursive: true, force: true }); }
});
