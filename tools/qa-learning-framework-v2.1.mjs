import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const baseline = path.join(project, 'backups/version-2.0');
const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const fail = message => { throw new Error(message); };
const walk = directory => fs.readdirSync(directory, {withFileTypes:true}).flatMap(entry => {
  const absolute = path.join(directory, entry.name);
  return entry.isDirectory() ? walk(absolute) : [absolute];
});
const hashFile = file => {
  const hash = crypto.createHash('sha256');
  hash.update(fs.readFileSync(file));
  return hash.digest('hex');
};

if (!fs.existsSync(baseline)) fail('Vollständiges Backup backups/version-2.0 fehlt.');
const baselineFiles = walk(baseline).sort();
const changedBaselineFiles = [];
const missingBaselineFiles = [];
for (const source of baselineFiles) {
  const relative = path.relative(baseline, source);
  const target = path.join(project, relative);
  if (!fs.existsSync(target)) {
    missingBaselineFiles.push(relative);
    continue;
  }
  const sourceStat = fs.statSync(source);
  const targetStat = fs.statSync(target);
  if (sourceStat.size !== targetStat.size || hashFile(source) !== hashFile(target)) changedBaselineFiles.push(relative);
}
if (missingBaselineFiles.length) fail(`V2.0-Dateien fehlen: ${missingBaselineFiles.slice(0,5).join(', ')}`);
if (changedBaselineFiles.length) fail(`V2.0-Dateien wurden verändert: ${changedBaselineFiles.slice(0,5).join(', ')}`);

const nodes = readJson(path.join(project, 'data/canonical/nodes.json'));
const relations = readJson(path.join(project, 'data/canonical/relations.json'));
const sources = readJson(path.join(project, 'data/canonical/sources.json'));
const scenarios = readJson(path.join(project, 'data/canonical/scenarios.json'));
const framework = readJson(path.join(project, 'data/canonical/learning-framework.json'));
const schema = readJson(path.join(project, 'data/canonical/learning-schema.json'));
const manifest = readJson(path.join(project, 'data/runtime/learning-manifest.json'));
const baseNodes = readJson(path.join(baseline, 'data/canonical/nodes.json'));
const baseRelations = readJson(path.join(baseline, 'data/canonical/relations.json'));
const baseSources = readJson(path.join(baseline, 'data/canonical/sources.json'));
const baseScenarios = readJson(path.join(baseline, 'data/canonical/scenarios.json'));

if (nodes.nodes.length !== 1058 || baseNodes.nodes.length !== 1058) fail('Knotenanzahl ist nicht 1.058.');
if (JSON.stringify(nodes) !== JSON.stringify(baseNodes)) fail('Kanonische Knoten oder Hierarchie wurden verändert.');
if (JSON.stringify(relations) !== JSON.stringify(baseRelations)) fail('Bestehende Relationen wurden verändert.');
if (JSON.stringify(sources) !== JSON.stringify(baseSources)) fail('Bestehende Quellen wurden verändert.');
if (JSON.stringify(scenarios) !== JSON.stringify(baseScenarios)) fail('V2.0 Architecture Scenario Layer wurde verändert.');
if (schema.$id !== 'azure-digital-brain-learning-schema-v2.1') fail('Learning Schema V2.1 ungültig.');
if (framework.schema_version !== '2.1' || framework.learning_paths.length !== 5) fail('Learning Framework V2.1 ungültig.');

const nodeIds = new Set(nodes.nodes.map(node => node.id));
const scenarioIds = new Set(scenarios.scenarios.map(scenario => scenario.id));
const pathIds = new Set();
const stepIds = new Set();
const allSteps = framework.learning_paths.flatMap(pathEntry => {
  if (pathIds.has(pathEntry.id)) fail(`Doppelte Lernpfad-ID ${pathEntry.id}.`);
  pathIds.add(pathEntry.id);
  return pathEntry.steps;
});
for (const step of allSteps) {
  if (stepIds.has(step.id)) fail(`Doppelte Lernschritt-ID ${step.id}.`);
  stepIds.add(step.id);
  for (const nodeId of step.referenced_nodes) if (!nodeIds.has(nodeId)) fail(`${step.id}: ungültige Knotenreferenz ${nodeId}.`);
  for (const scenarioId of step.referenced_scenarios) if (!scenarioIds.has(scenarioId)) fail(`${step.id}: ungültige Szenarioreferenz ${scenarioId}.`);
  if (!Array.isArray(step.practice_references) || step.practice_references.length !== 0) fail(`${step.id}: unerwartete externe Practice-Integration.`);
}
for (const step of allSteps) for (const linkedId of [...step.prerequisites, ...step.next_learning_steps]) if (!stepIds.has(linkedId)) fail(`${step.id}: ungültiger Lernschritt-Link ${linkedId}.`);
if (stepIds.size !== 33) fail(`Erwartet 33 Lernschritte, gefunden ${stepIds.size}.`);
if (new Set(allSteps.flatMap(step => step.referenced_scenarios)).size !== 5) fail('Nicht alle fünf V2.0-Szenarien werden referenziert.');

const profileBase = readJson(path.join(project, 'data/user/user-profile.example.json'));
const profileLearning = readJson(path.join(project, 'data/user/user-profile-learning-v2.1.example.json'));
const baseKeys = Object.keys(profileBase).sort().join('|');
const learningKeys = Object.keys(profileLearning).sort().join('|');
if (profileLearning.schema_version !== profileBase.schema_version || baseKeys !== learningKeys) fail('Lernprofil erweitert die bestehende Profilstruktur unzulässig.');
if (!profileLearning.learning_status || !profileLearning.notes) fail('Lernstatus oder persönliche Notizen fehlen im Profilbeispiel.');

const runtimeFile = path.join(project, 'data/runtime/learning-runtime.js');
if (!fs.existsSync(runtimeFile) || !fs.readFileSync(runtimeFile, 'utf8').startsWith('window.AZURE_ARCHITECTURE_LEARNING = ')) fail('Learning Runtime wurde nicht erfolgreich erzeugt.');
if (manifest.path_count !== 5 || manifest.step_count !== 33 || manifest.referenced_scenario_count !== 5) fail('Learning Manifest stimmt nicht mit Canonical Data überein.');

const result = {
  status:'PASS',
  version:'2.1',
  checked_at:new Date().toISOString(),
  baseline:{version:'2.0',file_count:baselineFiles.length,missing_files:0,changed_files:0,byte_identical:true},
  canonical:{node_count:nodes.nodes.length,node_ids_unchanged:true,hierarchy_unchanged:true,relation_count:relations.relations.length,relations_unchanged:true,source_count:sources.sources.length,sources_unchanged:true},
  scenario_layer:{scenario_count:scenarios.scenarios.length,byte_identical:true},
  learning_framework:{path_count:pathIds.size,step_count:stepIds.size,referenced_node_count:manifest.referenced_node_count,referenced_scenario_count:manifest.referenced_scenario_count,all_references_valid:true,duplicate_ids:0,practice_integrations:0},
  profile:{schema_reused:true,canonical_mutation:false},
  runtime_build:{status:'PASS',file:'data/runtime/learning-runtime.js'}
};
fs.mkdirSync(path.join(project, 'reports'), {recursive:true});
fs.writeFileSync(path.join(project, 'reports/qa-v2.1.json'), `${JSON.stringify(result, null, 2)}\n`);
console.log(JSON.stringify(result, null, 2));
