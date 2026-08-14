import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const canonical = path.join(project, 'data/canonical');
const runtimeDir = path.join(project, 'data/runtime');
const read = name => JSON.parse(fs.readFileSync(path.join(canonical, name), 'utf8'));
const fail = message => { throw new Error(message); };

const nodesDocument = read('nodes.json');
const scenariosDocument = read('scenarios.json');
const framework = read('learning-framework.json');
const schema = read('learning-schema.json');

if (framework.schema_version !== '2.1') fail('Learning Framework muss Schema-Version 2.1 verwenden.');
if (schema.$id !== 'azure-digital-brain-learning-schema-v2.1') fail('Learning-Schema fehlt oder ist falsch.');
if (!Array.isArray(framework.learning_paths) || framework.learning_paths.length !== 5) fail('Exakt fünf Lernpfade sind erforderlich.');

const nodeById = new Map(nodesDocument.nodes.map(node => [node.id, node]));
const scenarioById = new Map(scenariosDocument.scenarios.map(scenario => [scenario.id, scenario]));
const maturityById = new Map(framework.maturity_levels.map(level => [level.id, level]));
const pathsById = new Map();
const stepsById = new Map();
const usedNodeIds = new Set();
const usedScenarioIds = new Set();
const maturityCounts = Object.fromEntries(framework.maturity_levels.map(level => [String(level.id), 0]));
const requiredStepFields = ['id','title','learning_goal','explanation','referenced_nodes','referenced_scenarios','prerequisites','next_learning_steps','architecture_questions','maturity_level'];

for (const pathEntry of framework.learning_paths) {
  if (pathsById.has(pathEntry.id)) fail(`Doppelte Lernpfad-ID ${pathEntry.id}.`);
  pathsById.set(pathEntry.id, pathEntry);
  if (!pathEntry.title?.trim() || !pathEntry.goal?.trim() || !pathEntry.outcome?.trim() || !Array.isArray(pathEntry.steps) || pathEntry.steps.length === 0) fail(`${pathEntry.id}: unvollständiger Lernpfad.`);
  for (const step of pathEntry.steps) {
    if (stepsById.has(step.id)) fail(`Doppelte Lernschritt-ID ${step.id}.`);
    for (const field of requiredStepFields) if (!(field in step)) fail(`${step.id}: Pflichtfeld ${field} fehlt.`);
    for (const field of ['title','learning_goal','explanation']) if (typeof step[field] !== 'string' || !step[field].trim()) fail(`${step.id}: ${field} fehlt.`);
    for (const field of ['referenced_nodes','referenced_scenarios','prerequisites','next_learning_steps','architecture_questions']) if (!Array.isArray(step[field])) fail(`${step.id}: ${field} muss eine Liste sein.`);
    if (step.architecture_questions.length === 0 || step.architecture_questions.some(question => typeof question !== 'string' || !question.trim())) fail(`${step.id}: architecture_questions müssen mindestens eine echte Frage enthalten.`);
    if (!maturityById.has(step.maturity_level)) fail(`${step.id}: unbekanntes Maturity Level ${step.maturity_level}.`);
    if (!Array.isArray(step.practice_references) || step.practice_references.length !== 0) fail(`${step.id}: practice_references muss für V2.1 als leere optionale Liste vorbereitet sein.`);
    if (new Set(step.referenced_nodes).size !== step.referenced_nodes.length) fail(`${step.id}: doppelte Knotenreferenz.`);
    if (new Set(step.referenced_scenarios).size !== step.referenced_scenarios.length) fail(`${step.id}: doppelte Szenarioreferenz.`);
    if (new Set(step.prerequisites).size !== step.prerequisites.length || new Set(step.next_learning_steps).size !== step.next_learning_steps.length) fail(`${step.id}: doppelte Lernschritt-Verknüpfung.`);
    for (const nodeId of step.referenced_nodes) {
      if (!nodeById.has(nodeId)) fail(`${step.id}: unbekannter kanonischer Knoten ${nodeId}.`);
      usedNodeIds.add(nodeId);
    }
    for (const scenarioId of step.referenced_scenarios) {
      if (!scenarioById.has(scenarioId)) fail(`${step.id}: unbekanntes V2.0-Szenario ${scenarioId}.`);
      usedScenarioIds.add(scenarioId);
    }
    maturityCounts[String(step.maturity_level)] += 1;
    stepsById.set(step.id, {...step, learning_path_id:pathEntry.id});
  }
}

for (const step of stepsById.values()) {
  for (const linkedId of [...step.prerequisites, ...step.next_learning_steps]) {
    if (!stepsById.has(linkedId)) fail(`${step.id}: unbekannter Lernschritt-Link ${linkedId}.`);
    if (linkedId === step.id) fail(`${step.id}: Selbstreferenz ist nicht zulässig.`);
  }
  if (step.id.startsWith('learning-step-decision-') && !step.decision_framework) fail(`${step.id}: Decision Framework fehlt.`);
  if (step.id.startsWith('learning-step-scenario-') && !step.learning_phases) fail(`${step.id}: Scenario Learning Phases fehlen.`);
}

const visitState = new Map();
const visit = id => {
  const state = visitState.get(id) || 0;
  if (state === 1) fail(`Zyklus in prerequisites bei ${id}.`);
  if (state === 2) return;
  visitState.set(id, 1);
  for (const prerequisite of stepsById.get(id).prerequisites) visit(prerequisite);
  visitState.set(id, 2);
};
for (const id of stepsById.keys()) visit(id);

const referencedNodes = Object.fromEntries([...usedNodeIds].sort().map(id => {
  const node = nodeById.get(id);
  return [id, {id:node.id,title:node.title,parent:node.parent,category:node.category,description:node.description}];
}));
const referencedScenarios = Object.fromEntries([...usedScenarioIds].sort().map(id => {
  const scenario = scenarioById.get(id);
  return [id, {id:scenario.id,title:scenario.title,short_description:scenario.short_description,architecture_goal:scenario.architecture_goal}];
}));
const stepIndex = Object.fromEntries([...stepsById.entries()].map(([id, step]) => [id, step]));
const pathIndex = Object.fromEntries(framework.learning_paths.map(pathEntry => [pathEntry.id, {
  id:pathEntry.id,
  title:pathEntry.title,
  goal:pathEntry.goal,
  outcome:pathEntry.outcome,
  step_ids:pathEntry.steps.map(step => step.id)
}]));
const generatedAt = new Date().toISOString();
const stats = {
  path_count:framework.learning_paths.length,
  step_count:stepsById.size,
  referenced_node_count:usedNodeIds.size,
  referenced_scenario_count:usedScenarioIds.size,
  node_reference_count:framework.learning_paths.flatMap(pathEntry => pathEntry.steps).reduce((sum, step) => sum + step.referenced_nodes.length, 0),
  scenario_reference_count:framework.learning_paths.flatMap(pathEntry => pathEntry.steps).reduce((sum, step) => sum + step.referenced_scenarios.length, 0),
  maturity_level_distribution:maturityCounts
};
const runtime = {
  schema_version:'2.1',
  meta:{...framework.meta,...stats,generated_from:'data/canonical/learning-framework.json',generated_at:generatedAt},
  maturity_levels:framework.maturity_levels,
  user_profile_contract:framework.user_profile_contract,
  learning_paths:framework.learning_paths,
  path_index:pathIndex,
  step_index:stepIndex,
  referenced_nodes:referencedNodes,
  referenced_scenarios:referencedScenarios
};
const manifest = {
  data_format_version:'2.1',
  title:'Azure Digital Brain Architecture Learning Framework',
  ...stats,
  generated_from:'data/canonical/learning-framework.json',
  generated_at:generatedAt,
  ui_integration_status:'prepared_not_implemented',
  github_labs_status:'not_integrated',
  knowledge_mutation_status:'none'
};

fs.mkdirSync(runtimeDir, {recursive:true});
fs.writeFileSync(path.join(runtimeDir, 'learning-runtime.js'), `window.AZURE_ARCHITECTURE_LEARNING = ${JSON.stringify(runtime, null, 2)};\n`);
fs.writeFileSync(path.join(runtimeDir, 'learning-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(JSON.stringify(manifest, null, 2));
