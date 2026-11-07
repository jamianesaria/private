import { spawn } from 'node:child_process';
import path from 'node:path';

// Print aggregate timings only. Request headers, visitor identifiers, form
// data, URLs and raw log messages are never printed or retained by this check.
const child = spawn(process.execPath, [path.resolve('node_modules/wrangler/bin/wrangler.js'), 'tail', 'jamia-backup', '--format', 'json'], { stdio: ['ignore', 'pipe', 'pipe'] });
let buffer = '';
const samples = [];
child.stdout.on('data', chunk => {
  buffer += chunk.toString();
  let end;
  while ((end = buffer.indexOf('\n}\n')) >= 0) {
    const part = buffer.slice(0, end + 2);
    buffer = buffer.slice(end + 3);
    const begin = part.indexOf('{');
    if (begin < 0) continue;
    try {
      const event = JSON.parse(part.slice(begin));
      if (event.cpuTime !== undefined) samples.push({ cpuMs: event.cpuTime, wallMs: event.wallTime, outcome: event.outcome, exceptionCount: event.exceptions?.length || 0 });
    } catch { /* Ignore CLI status output, never replay request data. */ }
  }
});
child.stderr.on('data', () => {});
console.log('Sampling backup CPU for 45 seconds.');
const timer = setTimeout(() => child.kill(), 45000);
child.on('exit', () => { clearTimeout(timer); console.log(JSON.stringify({ samples, maxCpuMs: Math.max(0, ...samples.map(sample => sample.cpuMs)), errors: samples.filter(sample => sample.outcome !== 'ok' || sample.exceptionCount).length })); });
