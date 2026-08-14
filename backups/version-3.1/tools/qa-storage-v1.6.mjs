import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const baseline = path.join(project, 'backups/version-1.5');
const read = (root, file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const fail = message => { throw new Error(message); };
const stable = value => JSON.stringify(value);
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');

const beforeNodes = read(baseline, 'data/canonical/nodes.json');
const afterNodes = read(project, 'data/canonical/nodes.json');
const beforeRelations = read(baseline, 'data/canonical/relations.json');
const afterRelations = read(project, 'data/canonical/relations.json');
const beforeSources = read(baseline, 'data/canonical/sources.json');
const afterSources = read(project, 'data/canonical/sources.json');
const beforeTypes = read(baseline, 'data/canonical/relation-types.json');
const afterTypes = read(project, 'data/canonical/relation-types.json');
const sourceIds = new Set(afterSources.sources.map(source => source.id));
const typeById = new Map(afterTypes.relation_types.map(type => [type.id, type]));
const beforeById = new Map(beforeNodes.nodes.map(node => [node.id, node]));
const afterById = new Map(afterNodes.nodes.map(node => [node.id, node]));
const pilotNodes = afterNodes.nodes.filter(node => node.metadata?.enrichment?.version === '1.6');
const pilotRelations = afterRelations.relations.filter(relation => relation.id.startsWith('storage-rel-'));

if (beforeNodes.nodes.length !== 1058 || afterNodes.nodes.length !== 1058) fail('Knotenanzahl ist nicht 1.058.');
if (stable([...beforeById.keys()]) !== stable([...afterById.keys()])) fail('IDs oder ID-Reihenfolge wurden verändert.');
for (const [id, before] of beforeById) {
  const after = afterById.get(id);
  if (before.parent !== after.parent || stable(before.children) !== stable(after.children)) fail(`${id}: Hierarchie verändert.`);
  if (after.metadata?.enrichment?.version !== '1.6') {
    const b = structuredClone(before);
    const a = structuredClone(after);
    delete b.relations;
    delete a.relations;
    if (stable(b) !== stable(a)) fail(`${id}: Inhalt außerhalb des V1.6-Piloten verändert.`);
    const priorRefs = before.relations || [];
    if (stable(priorRefs) !== stable((after.relations || []).filter(rel => !rel.startsWith('storage-rel-')))) fail(`${id}: Historische Relationsreferenzen verändert.`);
  }
}
if (stable(beforeTypes.relation_types) !== stable(afterTypes.relation_types)) fail('Relationstyp-Registry wurde verändert.');
for (const relation of beforeRelations.relations) {
  const current = afterRelations.relations.find(item => item.id === relation.id);
  if (!current || stable(current) !== stable(relation)) fail(`${relation.id}: Historische Relation verändert.`);
}
for (const source of beforeSources.sources) {
  const current = afterSources.sources.find(item => item.id === source.id);
  if (!current || stable(current) !== stable(source)) fail(`${source.id}: Historische Quelle verändert.`);
}

for (const node of pilotNodes) {
  for (const field of ['simple','technical','architecture']) if (!node.description?.[field]?.trim()) fail(`${node.id}: ${field} fehlt.`);
  const simpleSentences = (node.description.simple.match(/[.!?](?:\s|$)/g) || []).length;
  if (simpleSentences < 2 || simpleSentences > 4) fail(`${node.id}: Simple hat ${simpleSentences} statt 2–4 Sätzen.`);
  if (!node.why_important?.trim() || !node.examples?.length || !node.merksatz?.trim()) fail(`${node.id}: Why, Praxisbeispiel oder Merksatz fehlt.`);
  if (!node.sources?.length) fail(`${node.id}: Quelle fehlt.`);
  for (const source of node.sources) if (!sourceIds.has(source)) fail(`${node.id}: unbekannte Quelle ${source}.`);
}

const ids = new Set();
const triples = new Set();
for (const relation of afterRelations.relations) {
  if (ids.has(relation.id)) fail(`Doppelte Relations-ID ${relation.id}.`);
  ids.add(relation.id);
  const triple = `${relation.source}|${relation.type}|${relation.target}`;
  if (triples.has(triple)) fail(`Doppelte Relation ${triple}.`);
  triples.add(triple);
  const type = typeById.get(relation.type);
  if (!type || relation.inverse_type !== type.inverse_type) fail(`${relation.id}: ungültige Gegenrichtung.`);
  if (!relation.explanation?.trim() || !relation.sources?.length || relation.confidence == null || relation.status !== 'accepted') fail(`${relation.id}: Relationspflichtfelder fehlen.`);
  for (const source of relation.sources) if (!sourceIds.has(source)) fail(`${relation.id}: unbekannte Quelle ${source}.`);
}

const protectedFiles = ['START.html','app/app.js','app/index.html','app/styles.css','data/canonical/schema.json','tools/build-runtime.mjs','reports/content-standard-v1.md'];
for (const file of protectedFiles) if (hash(path.join(baseline,file)) !== hash(path.join(project,file))) fail(`${file}: geschützte Datei verändert.`);
const runtime = read(project, 'data/runtime/manifest.json');
if (runtime.node_count !== 1058 || runtime.relation_count !== afterRelations.relations.length || runtime.source_count !== afterSources.sources.length) fail('Runtime-Manifest passt nicht zur kanonischen Basis.');

console.log(JSON.stringify({
  status:'PASS',
  nodes:afterNodes.nodes.length,
  hierarchy_unchanged:true,
  ids_unchanged:true,
  enriched_nodes:pilotNodes.length,
  explanation_texts:pilotNodes.length * 3,
  new_relations:pilotRelations.length,
  total_relations:afterRelations.relations.length,
  new_sources:afterSources.sources.length - beforeSources.sources.length,
  total_sources:afterSources.sources.length,
  relation_types:afterTypes.relation_types.length,
  previous_pilot_content_unchanged:true,
  protected_runtime_and_ui_contracts:true
}, null, 2));
