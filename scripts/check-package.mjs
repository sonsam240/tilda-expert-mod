import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const root = path.resolve(process.argv[2] || path.join(path.dirname(fileURLToPath(import.meta.url)), '..'));
let errors = 0, links = 0, scripts = 0;
function fail(message) { errors++; console.error('FAIL:', message); }
function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e =>
    e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]);
}
for (const required of ['SKILL.md', 'agents/openai.yaml']) {
  if (!fs.existsSync(path.join(root, required))) fail('Missing ' + required);
}
const files = walk(root);
for (const file of files) {
  try { new TextDecoder('utf-8', { fatal: true }).decode(fs.readFileSync(file)); }
  catch { fail(path.relative(root, file) + ': invalid UTF-8'); }
  if (file.endsWith('.md')) {
    const content = fs.readFileSync(file, 'utf8');
    for (const match of content.matchAll(/\]\(([^\s)]+)(?:\s+"[^"]*")?\)/g)) {
      const href = match[1];
      if (/^[a-z]+:/i.test(href) || href.startsWith('#')) continue;
      // GSAP URL parentheses in external links are excluded above.
      const local = href.split('#')[0];
      links++;
      const resolved = path.resolve(path.dirname(file), decodeURIComponent(local));
      if (!fs.existsSync(resolved)) fail(path.relative(root, file) + ': broken link ' + href);
    }
  }
  if (/\.(js|mjs|cjs)$/.test(file)) {
    scripts++;
    const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
    if (result.status !== 0) fail(path.relative(root, file) + ': ' + result.stderr);
  }
  if (file.endsWith('.json')) {
    try { JSON.parse(fs.readFileSync(file, 'utf8')); }
    catch (error) { fail(path.relative(root, file) + ': ' + error.message); }
  }
}
console.log(JSON.stringify({ root, files: files.length, localLinks: links, parsedScripts: scripts, errors }, null, 2));
process.exitCode = errors ? 1 : 0;
