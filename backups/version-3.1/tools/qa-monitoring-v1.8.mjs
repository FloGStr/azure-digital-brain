import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const baseline = path.join(project, 'backups/version-1.7');
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
const pilotNodes = afterNodes.nodes.filter(node => node.metadata?.enrichment?.version === '1.8');
const pilotRelations = afterRelations.relations.filter(relation => relation.id.startsWith('monitoring-rel-'));
const pilotSources = afterSources.sources.filter(source => !beforeSources.sources.some(item => item.id === source.id));

if (beforeNodes.nodes.length !== 1058 || afterNodes.nodes.length !== 1058) fail('Knotenanzahl ist nicht 1.058.');
if (stable([...beforeById.keys()]) !== stable([...afterById.keys()])) fail('IDs oder ID-Reihenfolge wurden verändert.');
for (const [id, before] of beforeById) {
  const after = afterById.get(id);
  if (before.parent !== after.parent || stable(before.children) !== stable(after.children)) fail(`${id}: Hierarchie verändert.`);
  if (after.metadata?.enrichment?.version !== '1.8') {
    const b = structuredClone(before);
    const a = structuredClone(after);
    delete b.relations;
    delete a.relations;
    if (stable(b) !== stable(a)) fail(`${id}: Inhalt außerhalb des V1.8-Piloten verändert.`);
  }
  const priorRefs = before.relations || [];
  const currentPriorRefs = (after.relations || []).filter(reference => !reference.startsWith('monitoring-rel-'));
  if (stable(priorRefs) !== stable(currentPriorRefs)) fail(`${id}: Historische Relationsreferenzen verändert.`);
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

if (pilotNodes.length !== 31) fail(`Pilotknoten: ${pilotNodes.length} statt 31.`);
if (pilotRelations.length !== 24) fail(`Pilotrelationen: ${pilotRelations.length} statt 24.`);
if (pilotSources.length !== 19) fail(`Pilotquellen: ${pilotSources.length} statt 19.`);
for (const node of pilotNodes) {
  for (const field of ['simple','technical','architecture']) if (!node.description?.[field]?.trim()) fail(`${node.id}: ${field} fehlt.`);
  const simpleSentences = (node.description.simple.match(/[.!?](?:\s|$)/g) || []).length;
  if (simpleSentences < 2 || simpleSentences > 4) fail(`${node.id}: Simple hat ${simpleSentences} statt 2–4 Sätzen.`);
  if (!node.why_important?.trim() || !node.examples?.length || !node.merksatz?.trim()) fail(`${node.id}: Why, Praxisbeispiel oder Merksatz fehlt.`);
  if (!node.sources?.length) fail(`${node.id}: Quelle fehlt.`);
  for (const source of node.sources) if (!sourceIds.has(source)) fail(`${node.id}: unbekannte Quelle ${source}.`);
}

const sourceIdSeen = new Set();
for (const source of afterSources.sources) {
  if (sourceIdSeen.has(source.id)) fail(`Doppelte Quellen-ID ${source.id}.`);
  sourceIdSeen.add(source.id);
}
for (const source of pilotSources) {
  if (!/^https:\/\/learn\.microsoft\.com\//.test(source.url)) fail(`${source.id}: Quelle ist keine Microsoft-Learn-URL.`);
  if (source.type !== 'official' || source.publisher !== 'Microsoft Learn') fail(`${source.id}: Quellenklassifikation ungültig.`);
}

const relationIds = new Set();
const triples = new Set();
for (const relation of afterRelations.relations) {
  if (relationIds.has(relation.id)) fail(`Doppelte Relations-ID ${relation.id}.`);
  relationIds.add(relation.id);
  const triple = `${relation.source}|${relation.type}|${relation.target}`;
  if (triples.has(triple)) fail(`Doppelte Relation ${triple}.`);
  triples.add(triple);
  if (!afterById.has(relation.source) || !afterById.has(relation.target)) fail(`${relation.id}: unbekannter Endpunkt.`);
  const type = typeById.get(relation.type);
  if (!type || relation.inverse_type !== type.inverse_type) fail(`${relation.id}: ungültige Gegenrichtung.`);
  if (!relation.explanation?.trim() || !relation.sources?.length || relation.confidence == null || relation.status !== 'accepted') fail(`${relation.id}: Relationspflichtfelder fehlen.`);
  for (const source of relation.sources) if (!sourceIds.has(source)) fail(`${relation.id}: unbekannte Quelle ${source}.`);
}

for (const node of afterNodes.nodes) {
  for (const reference of node.relations || []) if (!relationIds.has(reference)) fail(`${node.id}: unbekannte Relationsreferenz ${reference}.`);
}

const protectedFiles = ['START.html','app/app.js','app/index.html','app/styles.css','data/canonical/schema.json','tools/build-runtime.mjs','reports/content-standard-v1.md'];
for (const file of protectedFiles) if (hash(path.join(baseline,file)) !== hash(path.join(project,file))) fail(`${file}: geschützte Datei verändert.`);

const runtime = read(project, 'data/runtime/manifest.json');
if (runtime.node_count !== 1058 || runtime.relation_count !== afterRelations.relations.length || runtime.source_count !== afterSources.sources.length || runtime.relation_type_count !== afterTypes.relation_types.length || runtime.max_depth !== 10) fail('Runtime-Manifest passt nicht zur kanonischen Basis.');

console.log(JSON.stringify({
  status:'PASS',
  nodes:afterNodes.nodes.length,
  hierarchy_unchanged:true,
  ids_unchanged:true,
  enriched_nodes:pilotNodes.length,
  explanation_texts:pilotNodes.length * 3,
  new_relations:pilotRelations.length,
  total_relations:afterRelations.relations.length,
  new_sources:pilotSources.length,
  total_sources:afterSources.sources.length,
  relation_types:afterTypes.relation_types.length,
  duplicate_relation_ids:0,
  duplicate_relation_triples:0,
  official_sources_validated:true,
  previous_pilot_content_unchanged:true,
  protected_runtime_and_ui_contracts:true,
  runtime_build_consistent:true
}, null, 2));
