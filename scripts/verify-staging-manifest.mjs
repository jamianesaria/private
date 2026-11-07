export function stagingMatchesSnapshot(status, manifest) {
  return Boolean(status && manifest && status.mode === 'static-public-pages' &&
    typeof manifest.generatedAt === 'string' && manifest.generatedAt.length > 0 &&
    typeof manifest.sourceCommit === 'string' && manifest.sourceCommit.length > 0 &&
    manifest.routes && Object.keys(manifest.routes).length > 0 &&
    status.generatedAt === manifest.generatedAt && status.sourceCommit === manifest.sourceCommit &&
    status.pageCount === Object.keys(manifest.routes).length);
}
