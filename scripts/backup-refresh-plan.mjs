// Conservative planning only: this does not deploy or change any content.
// Unknown dependencies require a full refresh rather than silently stale pages.
const knownTypes = Object.freeze({
  notice: ['/', '/notices'],
  classRoutine: ['/functions/class-routine'],
  examRoutine: ['/exam-routine'],
  examResult: ['/results/academic', '/results/admission'],
});

export function planRefresh(changes, routes) {
  if (!Array.isArray(changes) || !changes.length || !Array.isArray(routes) || !routes.length) {
    throw new TypeError('A nonempty change list and route list are required.');
  }
  const all = [...new Set(routes)].sort();
  const selected = new Set();
  for (const change of changes) {
    // A Sanity webhook may include before and after types. Handle both when
    // present, and fall back when its shape or dependencies are uncertain.
    if (!change || typeof change !== 'object' || !Array.isArray(change.types) || !change.types.length) {
      return { mode: 'full', routes: all, reason: 'Missing change type' };
    }
    for (const type of change.types) {
      if (typeof type !== 'string' || !Object.hasOwn(knownTypes, type)) {
        return { mode: 'full', routes: all, reason: 'Unknown or shared dependency' };
      }
      for (const route of knownTypes[type]) {
        if (!all.includes(route)) return { mode: 'full', routes: all, reason: 'Route inventory changed' };
        selected.add(route);
      }
    }
  }
  return { mode: 'selective', routes: [...selected].sort(), reason: 'Known content dependencies' };
}
