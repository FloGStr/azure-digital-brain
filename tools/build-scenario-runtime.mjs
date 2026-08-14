import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const canonical = path.join(project, 'data/canonical');
const runtimeDir = path.join(project, 'data/runtime');
const read = name => JSON.parse(fs.readFileSync(path.join(canonical, name), 'utf8'));
const fail = message => { throw new Error(message); };

const nodesDocument = read('nodes.json');
const typesDocument = read('relation-types.json');
const baseSourcesDocument = read('sources.json');
const scenarioDocument = read('scenarios.json');
const schemaDocument = read('scenario-schema.json');

if (scenarioDocument.schema_version !== '2.0') fail('Scenario Layer muss Schema-Version 2.0 verwenden.');
if (schemaDocument.$id !== 'azure-digital-brain-scenario-schema-v2.0') fail('Scenario-Schema fehlt oder ist falsch.');
if (scenarioDocument.scenarios.length !== scenarioDocument.meta.scenario_count) fail('scenario_count stimmt nicht.');

const nodeById = new Map(nodesDocument.nodes.map(node => [node.id, node]));
const typeById = new Map(typesDocument.relation_types.map(type => [type.id, type]));
const sourceById = new Map([...baseSourcesDocument.sources, ...scenarioDocument.sources].map(source => [source.id, source]));
const scenarioIds = new Set();
const relationshipIds = new Set();
const usedNodeIds = new Set();
let relationshipCount = 0;

const requireNode = (id, context) => {
  if (!nodeById.has(id)) fail(`${context}: unbekannter kanonischer Knoten ${id}.`);
  usedNodeIds.add(id);
};
const requireSource = (id, context) => {
  if (!sourceById.has(id)) fail(`${context}: unbekannte Quelle ${id}.`);
};

for (const source of scenarioDocument.sources) {
  if (!/^https:\/\/learn\.microsoft\.com\//.test(source.url)) fail(`${source.id}: nur Microsoft Learn ist zulässig.`);
  if (source.type !== 'official' || source.publisher !== 'Microsoft Learn') fail(`${source.id}: ungültige Quellenklassifikation.`);
  if (baseSourcesDocument.sources.some(existing => existing.id === source.id)) fail(`${source.id}: Szenarioquelle kollidiert mit bestehender Quellen-ID.`);
}

for (const scenario of scenarioDocument.scenarios) {
  if (scenarioIds.has(scenario.id)) fail(`Doppelte Szenario-ID ${scenario.id}.`);
  scenarioIds.add(scenario.id);
  if (scenario.status !== 'published') fail(`${scenario.id}: Status muss published sein.`);
  for (const field of ['short_description','architecture_goal','enterprise_example','merksatz']) if (!scenario[field]?.trim()) fail(`${scenario.id}: ${field} fehlt.`);
  for (const field of ['architecture_flow','component_instances','technical_explanation','architecture_decisions','security_considerations','monitoring_considerations','reliability_considerations','cost_considerations','common_mistakes','learning_path','relationships','sources']) if (!Array.isArray(scenario[field]) || scenario[field].length === 0) fail(`${scenario.id}: ${field} fehlt oder ist leer.`);

  for (const step of scenario.architecture_flow) for (const id of step.node_refs || []) requireNode(id, `${scenario.id}/flow`);
  for (const component of scenario.component_instances) {
    if (component.node_ref) requireNode(component.node_ref, `${scenario.id}/component/${component.instance_id}`);
    for (const id of component.alternatives || []) requireNode(id, `${scenario.id}/component/${component.instance_id}/alternative`);
    if (!component.node_ref && !component.external_actor_ref) fail(`${scenario.id}/${component.instance_id}: node_ref oder external_actor_ref fehlt.`);
  }
  for (const id of scenario.learning_path) requireNode(id, `${scenario.id}/learning_path`);
  for (const id of scenario.sources) requireSource(id, `${scenario.id}/sources`);

  for (const relation of scenario.relationships) {
    relationshipCount += 1;
    if (relationshipIds.has(relation.id)) fail(`Doppelte Szenario-Relations-ID ${relation.id}.`);
    relationshipIds.add(relation.id);
    if (relation.source !== scenario.id) fail(`${relation.id}: Quelle muss das Szenario selbst sein.`);
    requireNode(relation.target, relation.id);
    const type = typeById.get(relation.type);
    if (!type) fail(`${relation.id}: unbekannter Relationstyp ${relation.type}.`);
    if (relation.inverse_type !== type.inverse_type) fail(`${relation.id}: Gegenrichtung ${relation.inverse_type} passt nicht zu ${relation.type}.`);
    if (!relation.explanation?.trim() || relation.status !== 'accepted' || relation.confidence == null) fail(`${relation.id}: Pflichtfelder fehlen.`);
    for (const id of relation.sources || []) requireSource(id, relation.id);
  }
}

const referencedNodes = Object.fromEntries([...usedNodeIds].sort().map(id => {
  const node = nodeById.get(id);
  return [id, {id:node.id,title:node.title,parent:node.parent,description:node.description,tags:node.tags,sources:node.sources}];
}));
const relationshipTypes = Object.fromEntries([...new Set(scenarioDocument.scenarios.flatMap(scenario => scenario.relationships.map(relation => relation.type)))].sort().map(id => [id, typeById.get(id)]));
const runtime = {
  schema_version:'2.0',
  meta:{...scenarioDocument.meta,used_node_count:usedNodeIds.size,relationship_count:relationshipCount,generated_from:'data/canonical/scenarios.json',generated_at:new Date().toISOString()},
  scenarios:scenarioDocument.scenarios,
  referenced_nodes:referencedNodes,
  relationship_types:relationshipTypes,
  scenario_sources:Object.fromEntries(scenarioDocument.sources.map(source => [source.id, source]))
};
const manifest = {
  data_format_version:'2.0',
  title:'Azure Digital Brain Architecture Scenario Layer',
  scenario_count:scenarioDocument.scenarios.length,
  used_node_count:usedNodeIds.size,
  relationship_count:relationshipCount,
  new_source_count:scenarioDocument.sources.length,
  relation_type_count:Object.keys(relationshipTypes).length,
  generated_from:'data/canonical/scenarios.json',
  generated_at:runtime.meta.generated_at,
  architecture_mode_status:'prepared_not_implemented',
  ai_integration_status:'not_implemented'
};

fs.mkdirSync(runtimeDir, {recursive:true});
fs.writeFileSync(path.join(runtimeDir, 'architecture-runtime.js'), `window.AZURE_ARCHITECTURE_SCENARIOS = ${JSON.stringify(runtime, null, 2)};\n`);
fs.writeFileSync(path.join(runtimeDir, 'architecture-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(JSON.stringify(manifest, null, 2));
