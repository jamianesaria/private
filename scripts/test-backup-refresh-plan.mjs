import test from 'node:test';
import assert from 'node:assert/strict';
import { planRefresh } from './backup-refresh-plan.mjs';

const routes = ['/', '/notices', '/exam-routine', '/functions/class-routine', '/results/academic', '/results/admission', '/about'];

test('notice changes include homepage and notice board', () => {
  assert.deepEqual(planRefresh([{ types: ['notice'] }], routes).routes, ['/', '/notices']);
});
test('multiple changes refresh the union, including both result pages', () => {
  assert.deepEqual(planRefresh([{ types: ['examResult'] }, { types: ['notice'] }], routes).routes,
    ['/', '/notices', '/results/academic', '/results/admission']);
});
test('unknown and shared content never silently skips affected pages', () => {
  assert.equal(planRefresh([{ types: ['siteSettings'] }], routes).mode, 'full');
  assert.equal(planRefresh([{ types: ['notice', 'futureType'] }], routes).mode, 'full');
  assert.equal(planRefresh([{}], routes).mode, 'full');
});
test('missing routes require a full refresh', () => {
  assert.equal(planRefresh([{ types: ['notice'] }], ['/']).mode, 'full');
});
test('invalid inputs fail closed', () => {
  assert.throws(() => planRefresh([], routes));
  assert.throws(() => planRefresh([{ types: ['notice'] }], []));
});
