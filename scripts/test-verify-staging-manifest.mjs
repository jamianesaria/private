import test from 'node:test';
import assert from 'node:assert/strict';
import { stagingMatchesSnapshot } from './verify-staging-manifest.mjs';

test('a backup release requires the exact complete staging snapshot', () => {
  const manifest = { generatedAt: '2026-11-07T00:00:00Z', sourceCommit: 'abc', routes: { '/': {} } };
  const status = { mode: 'static-public-pages', generatedAt: manifest.generatedAt, sourceCommit: 'abc', pageCount: 1 };
  assert.equal(stagingMatchesSnapshot(status, manifest), true);
  assert.equal(stagingMatchesSnapshot({ ...status, sourceCommit: 'old' }, manifest), false);
  assert.equal(stagingMatchesSnapshot({ ...status, generatedAt: 'old' }, manifest), false);
  assert.equal(stagingMatchesSnapshot({ ...status, pageCount: 0 }, manifest), false);
  assert.equal(stagingMatchesSnapshot({ ...status, mode: 'other' }, manifest), false);
  assert.equal(stagingMatchesSnapshot(status, { ...manifest, routes: {} }), false);
});
