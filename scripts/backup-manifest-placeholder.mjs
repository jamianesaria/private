import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

// Next's type checker sees the Worker source before the snapshot is generated.
// Never replace an existing complete manifest. The snapshot step must succeed
// and replace this placeholder before the deploy command is allowed to run.
export async function ensureManifestForTypecheck(outputDirectory = '.backup-static') {
  await mkdir(outputDirectory, { recursive: true });
  try {
    await writeFile(path.join(outputDirectory, 'manifest.json'), JSON.stringify({ generatedAt: '', sourceCommit: '', routes: {} }), { flag: 'wx' });
  } catch (error) {
    if (error.code !== 'EEXIST') throw error;
  }
}
