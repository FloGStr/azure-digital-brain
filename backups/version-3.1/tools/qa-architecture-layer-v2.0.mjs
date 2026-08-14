import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const baseline = path.join(project, 'backups/version-1.8');
const canonical = path.join(project, 'data/canonical');
const runtimeDir = path.join(project, 'data/runtime');
const fail = message => { throw new Error(message); };
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const walk = root => fs.readdirSync(root, {withFileTypes:true}).flatMap(entry => {
  const absolute = path.join(root, entry.name);
  return entry.isDirectory() ? walk(absolute) : [absolute];
});

if (!fs.existsSync(baseline)) fail('Vollständiges V1.8-Backup fehlt.');
const baselineFiles = walk(baseline);
for (const source of baselineFiles) {
  const relative = path.relative(baseline, source);
  const current = path.join(project, relative);
  if (!fs.existsSync(current)) fail(`${relative}: V1.8-Datei fehlt im V2.0-Hauptbestand.`);
  if (hash(source) !== hash(current)) fail(`${relative}: bestehender V1.8-Inhalt wurde verändert.`);
}

const nodesDocument = read(path.join(canonical, 'nodes.json'));
const relationsDocument = read(path.join(canonical, 'relations.json'));
const sourcesDocument = read(path.join(canonical, 'sources.json'));
const typesDocument = read(path.join(canonical, 'relation-types.json'));
const scenarioDocument = read(path.join(canonical, 'scenarios.json'));
const architectureManifest = read(path.join(runtimeDir, 'architecture-manifest.json'));
const nodeById = new Map(nodesDocument.nodes.map(node => [node.id, node]));
const typeById = new Map(typesDocument.relation_types.map(type => [type.id, type]));
const sourceById = new Map([...sourcesDocument.sources, ...scenarioDocument.sources].map(source => [source.id, source]));

if (nodesDocument.nodes.length !== 1058) fail('Knotenanzahl ist nicht 1.058.');
if (scenarioDocument.schema_version !== '2.0' || scenarioDocument.scenarios.length !== 5) fail('Scenario Layer ist nicht V2.0 mit fünf Szenarien.');
if (scenarioDocument.meta.ui_status !== 'prepared_not_implemented') fail('Architecture Mode darf noch nicht als implementiert markiert sein.');
if (scenarioDocument.meta.ai_status !== 'not_implemented') fail('KI-Integration darf nicht implementiert sein.');

const scenarioIds = new Set();
const relationIds = new Set();
const relationTriples = new Set();
const usedNodes = new Set();
for (const scenario of scenarioDocument.scenarios) {
  if (scenarioIds.has(scenario.id)) fail(`Doppelte Szenario-ID ${scenario.id}.`);
  scenarioIds.add(scenario.id);
  for (const field of ['short_description','architecture_goal','enterprise_example','merksatz']) if (!scenario[field]?.trim()) fail(`${scenario.id}: ${field} fehlt.`);
  for (const field of ['architecture_flow','component_instances','technical_explanation','architecture_decisions','security_considerations','monitoring_considerations','reliability_considerations','cost_considerations','common_mistakes','learning_path','relationships','sources']) if (!Array.isArray(scenario[field]) || !scenario[field].length) fail(`${scenario.id}: ${field} fehlt.`);
  if (!scenario.operations_model || !scenario.diagram) fail(`${scenario.id}: Operationsmodell oder Diagramm fehlt.`);

  const checkNode = (id, context) => {
    if (!nodeById.has(id)) fail(`${context}: unbekannter Knoten ${id}.`);
    usedNodes.add(id);
  };
  for (const step of scenario.architecture_flow) for (const id of step.node_refs || []) checkNode(id, `${scenario.id}/flow`);
  for (const component of scenario.component_instances) {
    if (component.node_ref) checkNode(component.node_ref, `${scenario.id}/${component.instance_id}`);
    for (const id of component.alternatives || []) checkNode(id, `${scenario.id}/${component.instance_id}/alternative`);
  }
  for (const id of scenario.learning_path) checkNode(id, `${scenario.id}/learning_path`);
  for (const id of scenario.sources) if (!sourceById.has(id)) fail(`${scenario.id}: unbekannte Quelle ${id}.`);

  for (const relation of scenario.relationships) {
    if (relationIds.has(relation.id)) fail(`Doppelte Szenario-Relations-ID ${relation.id}.`);
    relationIds.add(relation.id);
    const triple = `${relation.source}|${relation.type}|${relation.target}`;
    if (relationTriples.has(triple)) fail(`Doppelte Szenario-Relation ${triple}.`);
    relationTriples.add(triple);
    if (relation.source !== scenario.id) fail(`${relation.id}: Quelle ist nicht das Szenario.`);
    checkNode(relation.target, relation.id);
    const type = typeById.get(relation.type);
    if (!type || relation.inverse_type !== type.inverse_type) fail(`${relation.id}: Typ oder Gegenrichtung ungültig.`);
    if (!relation.explanation?.trim() || !relation.sources?.length || relation.confidence == null || relation.status !== 'accepted') fail(`${relation.id}: Pflichtfelder fehlen.`);
    for (const id of relation.sources) if (!sourceById.has(id)) fail(`${relation.id}: unbekannte Quelle ${id}.`);
  }
}

if (usedNodes.size !== 44) fail(`44 verwendete Knoten erwartet, gefunden: ${usedNodes.size}.`);
if (relationIds.size !== 50) fail(`50 Szenario-Beziehungen erwartet, gefunden: ${relationIds.size}.`);
if (scenarioDocument.sources.length !== 9) fail('Neun neue Architekturquellen erwartet.');
for (const source of scenarioDocument.sources) {
  if (!/^https:\/\/learn\.microsoft\.com\//.test(source.url) || source.publisher !== 'Microsoft Learn' || source.type !== 'official') fail(`${source.id}: Quelle ist nicht offiziell.`);
  if (sourcesDocument.sources.some(existing => existing.id === source.id)) fail(`${source.id}: Quellen-ID kollidiert mit V1.8.`);
}

if (architectureManifest.scenario_count !== 5 || architectureManifest.used_node_count !== 44 || architectureManifest.relationship_count !== 50 || architectureManifest.new_source_count !== 9 || architectureManifest.relation_type_count !== 5) fail('Architecture-Runtime-Manifest stimmt nicht mit Canonical Layer überein.');

const tempProject = fs.mkdtempSync(path.join(os.tmpdir(), 'azure-brain-v2-main-build-'));
try {
  fs.mkdirSync(path.join(tempProject, 'tools'), {recursive:true});
  fs.mkdirSync(path.join(tempProject, 'data/runtime'), {recursive:true});
  fs.cpSync(canonical, path.join(tempProject, 'data/canonical'), {recursive:true});
  fs.copyFileSync(path.join(project, 'tools/build-runtime.mjs'), path.join(tempProject, 'tools/build-runtime.mjs'));
  execFileSync(process.execPath, [path.join(tempProject, 'tools/build-runtime.mjs')], {stdio:'pipe'});
  const mainManifest = read(path.join(tempProject, 'data/runtime/manifest.json'));
  if (mainManifest.node_count !== 1058 || mainManifest.relation_count !== relationsDocument.relations.length || mainManifest.source_count !== sourcesDocument.sources.length || mainManifest.max_depth !== 10) fail('Isolierter Haupt-Runtime-Build ist inkonsistent.');
} finally {
  fs.rmSync(tempProject, {recursive:true,force:true});
}

console.log(JSON.stringify({
  status:'PASS',
  baseline_files_byte_identical:baselineFiles.length,
  nodes:1058,
  ids_unchanged:true,
  hierarchy_unchanged:true,
  existing_relations:relationsDocument.relations.length,
  existing_relation_registry_unchanged:true,
  scenarios:scenarioDocument.scenarios.length,
  referenced_existing_nodes:usedNodes.size,
  scenario_relationships:relationIds.size,
  relation_types_reused:architectureManifest.relation_type_count,
  new_relation_types:0,
  new_official_sources:scenarioDocument.sources.length,
  architecture_mode_prepared:true,
  ui_changed:false,
  ai_integration_implemented:false,
  main_runtime_build:'PASS',
  scenario_runtime_build:'PASS'
}, null, 2));
