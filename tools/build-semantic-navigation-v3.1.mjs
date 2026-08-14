import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const navigationDir = path.join(root, 'data', 'navigation');
const runtimeDir = path.join(root, 'data', 'runtime');
const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const sha256 = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const writeText = (file, content) => fs.writeFileSync(file, content);

const classificationFile = path.join(navigationDir, 'node-classification-v3.0.json');
const semanticFile = path.join(navigationDir, 'semantic-linking-proposal-v3.0.json');
const runtimeAliasesFile = path.join(navigationDir, 'semantic-aliases-v3.1.json');
const classifications = readJson(classificationFile);
const semantic = readJson(semanticFile);
const runtimeAliases = readJson(runtimeAliasesFile);
const aliases = [...semantic.alias_registry_sample, ...runtimeAliases.aliases];

const runtime = {
  meta: {
    release_version: '3.1',
    feature: 'Semantic Navigation & Knowledge Linking',
    base_release: '2.4',
    proposal_release: '3.0',
    operating_mode: 'additive-runtime-overlay',
    generated_at: new Date().toISOString(),
    node_count: classifications.nodes.length,
    alias_count: aliases.length,
    source_hashes: {
      'node-classification-v3.0.json': sha256(classificationFile),
      'semantic-linking-proposal-v3.0.json': sha256(semanticFile),
      'semantic-aliases-v3.1.json': sha256(runtimeAliasesFile),
    },
  },
  classifications: classifications.nodes.map((node) => ({
    node_id: node.node_id,
    classification: node.classification,
    proposed_target_position: node.proposed_target_position,
    current_position: node.current_position,
    confidence: node.confidence,
    status: node.status,
  })),
  aliases: aliases.map((alias) => ({
    term: alias.term,
    normalized_term: alias.normalized_term,
    target_node_id: alias.target_node_id,
    alias_type: alias.alias_type,
    match_policy: alias.match_policy,
    status: alias.status,
  })),
  link_types: {
    standard: { label: 'Wissensknoten', description: 'Verweist auf einen bestehenden kanonischen Wissensknoten.' },
    historical: { label: 'Historischer Begriff', description: 'Alte oder frühere Bezeichnung eines bestehenden Wissensknotens.' },
    deprecated: { label: 'Veraltetes Konzept', description: 'Der Zielknoten ist im V3.0-Audit als veraltet eingeordnet.' },
    ambiguous: { label: 'Mehrdeutig', description: 'Der Begriff kann auf mehrere bestehende Wissensknoten verweisen.' },
  },
};

const runtimeFile = path.join(runtimeDir, 'semantic-navigation-runtime.js');
writeText(runtimeFile, `window.AZURE_SEMANTIC_NAVIGATION=${JSON.stringify(runtime)};\n`);

const manifest = {
  schema_version: '3.1-navigation-runtime-1.0',
  release_version: '3.1',
  base_release: '2.4',
  proposal_release: '3.0',
  generated_at: runtime.meta.generated_at,
  operating_mode: runtime.meta.operating_mode,
  canonical_data_changed: false,
  node_count: runtime.meta.node_count,
  alias_count: runtime.meta.alias_count,
  runtime_file: 'semantic-navigation-runtime.js',
  runtime_sha256: sha256(runtimeFile),
  source_hashes: runtime.meta.source_hashes,
};
writeText(path.join(runtimeDir, 'semantic-navigation-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);

console.log(JSON.stringify(manifest, null, 2));
