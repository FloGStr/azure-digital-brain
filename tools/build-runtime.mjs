import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const canonical = path.join(project, 'data/canonical');
const runtime = path.join(project, 'data/runtime');

const read = name => JSON.parse(fs.readFileSync(path.join(canonical, name), 'utf8'));
const nodesDocument = read('nodes.json');
const relationsDocument = read('relations.json');
const sourcesDocument = read('sources.json');
const typesDocument = read('relation-types.json');
const nodes = nodesDocument.nodes;
const relations = relationsDocument.relations;
const sources = sourcesDocument.sources;
const relationTypes = typesDocument.relation_types;

const errors = [];
const nodeIds = new Set();
for (const node of nodes) {
  if (!node.id || nodeIds.has(node.id)) errors.push(`Ungültige oder doppelte Knoten-ID: ${node.id}`);
  nodeIds.add(node.id);
  for (const key of ['title','domain','category','description','metadata','origin','created_at','updated_at']) if (!(key in node)) errors.push(`${node.id}: Feld ${key} fehlt`);
  for (const key of ['simple','technical','architecture']) if (!(key in (node.description || {}))) errors.push(`${node.id}: description.${key} fehlt`);
}
for (const node of nodes) {
  if (node.parent && !nodeIds.has(node.parent)) errors.push(`${node.id}: Elternknoten ${node.parent} fehlt`);
  for (const child of node.children || []) if (!nodeIds.has(child)) errors.push(`${node.id}: Kind ${child} fehlt`);
}
const nodeById = new Map(nodes.map(node => [node.id, node]));
if (nodes.filter(node => !node.parent).length !== 1) errors.push('Die Wissenshierarchie benötigt genau einen Wurzelknoten.');
for (const node of nodes) {
  if (node.parent && !nodeById.get(node.parent)?.children.includes(node.id)) errors.push(`${node.id}: Eltern-/Kindreferenz ist nicht wechselseitig`);
  for (const child of node.children || []) if (nodeById.get(child)?.parent !== node.id) errors.push(`${node.id}: Kind ${child} verweist auf einen anderen Elternknoten`);
}
const relationTypeIds = new Set(relationTypes.map(type => type.id));
const relationTypeById = new Map(relationTypes.map(type => [type.id, type]));
for (const type of relationTypes) {
  if (!relationTypeIds.has(type.inverse_type)) errors.push(`${type.id}: Gegenrichtung ${type.inverse_type} fehlt`);
  else if (relationTypeById.get(type.inverse_type)?.inverse_type !== type.id) errors.push(`${type.id}: Gegenrichtung ist nicht reziprok definiert`);
}
const relationIds = new Set();
for (const relation of relations) {
  if (!relation.id || relationIds.has(relation.id)) errors.push(`Ungültige oder doppelte Relations-ID: ${relation.id}`);
  relationIds.add(relation.id);
  if (!nodeIds.has(relation.source) || !nodeIds.has(relation.target)) errors.push(`${relation.id}: Relationsendpunkt fehlt`);
  if (!relationTypeIds.has(relation.type)) errors.push(`${relation.id}: Relationstyp ${relation.type} fehlt im Register`);
  if (!relationTypeIds.has(relation.inverse_type)) errors.push(`${relation.id}: Gegenrichtung ${relation.inverse_type} fehlt im Register`);
  if (!relation.explanation) errors.push(`${relation.id}: Erklärung fehlt`);
}
const sourceIds = new Set();
for (const source of sources) { if (!source.id || sourceIds.has(source.id)) errors.push(`Ungültige oder doppelte Quellen-ID: ${source.id}`); sourceIds.add(source.id); }
for (const node of nodes) for (const source of node.sources || []) if (!sourceIds.has(source)) errors.push(`${node.id}: Quelle ${source} fehlt`);
for (const relation of relations) for (const source of relation.sources || []) if (!sourceIds.has(source)) errors.push(`${relation.id}: Quelle ${source} fehlt`);
for (const node of nodes) for (const relation of node.relations || []) if (!relationIds.has(relation)) errors.push(`${node.id}: Relation ${relation} fehlt`);
for (const relation of relations) {
  if (!nodeById.get(relation.source)?.relations.includes(relation.id)) errors.push(`${relation.id}: Quellknoten referenziert die Relation nicht`);
  if (!nodeById.get(relation.target)?.relations.includes(relation.id)) errors.push(`${relation.id}: Zielknoten referenziert die Relation nicht`);
}

if (errors.length) throw new Error(`Kanonische Daten sind ungültig:\n${errors.slice(0,50).join('\n')}`);

const maxDepth = Math.max(...nodes.map(node => node.legacy?.original?.depth ?? 0));
const runtimeBundle = {
  meta:{
    data_format_version:'1.1',
    title:'Azure Digital Brain',
    node_count:nodes.length,
    relation_count:relations.length,
    relation_type_count:relationTypes.length,
    source_count:sources.length,
    max_depth:maxDepth,
    generated_from:'data/canonical',
    generated_at:new Date().toISOString()
  },
  nodes,
  relations,
  sources,
  relation_types:relationTypes
};

fs.mkdirSync(runtime, { recursive:true });
fs.writeFileSync(path.join(runtime, 'knowledge-runtime.js'), `window.AZURE_DIGITAL_BRAIN = ${JSON.stringify(runtimeBundle)};\n`);
fs.writeFileSync(path.join(runtime, 'manifest.json'), JSON.stringify(runtimeBundle.meta, null, 2) + '\n');
console.log(JSON.stringify(runtimeBundle.meta, null, 2));
