import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceFile = path.join(root, 'data', 'experience', 'context-experience-v3.2.json');
const runtimeFile = path.join(root, 'data', 'runtime', 'context-experience-runtime.js');
const manifestFile = path.join(root, 'data', 'runtime', 'context-experience-manifest.json');
const source = JSON.parse(fs.readFileSync(sourceFile, 'utf8'));
const sha256 = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');

fs.writeFileSync(runtimeFile, `window.AZURE_CONTEXT_EXPERIENCE=${JSON.stringify(source)};\n`);
const manifest = {
  schema_version: '3.2-context-experience-runtime-1.0',
  release_version: '3.2',
  base_release: '3.1',
  generated_at: new Date().toISOString(),
  canonical_data_changed: false,
  source_file: 'data/experience/context-experience-v3.2.json',
  source_sha256: sha256(sourceFile),
  runtime_file: 'data/runtime/context-experience-runtime.js',
  runtime_sha256: sha256(runtimeFile)
};
fs.writeFileSync(manifestFile, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(JSON.stringify(manifest, null, 2));
