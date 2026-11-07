import env from '@next/env';
import { createClient } from '@sanity/client';
import { pathToFileURL } from 'node:url';

env.loadEnvConfig(process.cwd());
export async function checkSnapshotInputs() {
  const { SANITY_API_READ_TOKEN: token, NEXT_PUBLIC_SANITY_PROJECT_ID: projectId, NEXT_PUBLIC_SANITY_DATASET: dataset = 'production' } = process.env;
  if (!token || !projectId) throw new Error('Snapshot build requires the project ID and a server-only Sanity read token.');
  const client = createClient({ projectId, dataset, apiVersion: '2026-03-01', token, useCdn: false, timeout: 15000, maxRetries: 0 });
  const id = 'copy.ui.NavigationBar';
  const found = await client.fetch('*[_id == $id][0]._id', { id }, { perspective: 'published' });
  if (found !== id) throw new Error('Published protected page content is unavailable; refusing to build a fallback snapshot.');
  return client;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await checkSnapshotInputs();
  console.log('Required published Sanity content is accessible.');
}
