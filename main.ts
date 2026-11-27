import { copyFileSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const project = fileURLToPath(new URL('.', import.meta.url));
const destination = resolve(process.env.MAKEFUN_OUTPUT_DIR ?? '/output');

function copyDirectory(from: string, to: string): void {
  mkdirSync(to, { recursive: true });
  const children = readdirSync(from, { withFileTypes: true });
  for (const child of children) {
    const input = join(from, child.name);
    const output = join(to, child.name);
    if (child.isDirectory()) copyDirectory(input, output);
    else if (child.isFile()) copyFileSync(input, output);
    else throw new Error('The entry can only package plain files and directories: ' + child.name);
  }
}

const captures = join(project, 'screenshots');
const images = readdirSync(captures, { withFileTypes: true });
if (images.length < 3 || images.length > 4 || images.some(item => !item.isFile() || !/^[a-z0-9][a-z0-9._-]*\.(?:png|jpe?g)$/i.test(item.name))) {
  throw new Error('Provide three or four native PNG or JPEG captures, named in cover-first order.');
}

copyDirectory(join(project, 'app'), join(destination, 'app'));
copyDirectory(captures, join(destination, 'screenshots'));
const dossier = buildDossier(destination, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216
});
if (dossier.byteLength > 1572864) throw new Error('The dossier exceeds the 1.5 MiB contest cap.');
writeFileSync(join(destination, 'dossier.json'), dossier);
