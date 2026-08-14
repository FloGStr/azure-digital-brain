import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const project=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const backup=path.join(project,'backups/version-2.1');
const original=path.resolve(project,'../Azure-Digital-Brain-V2.1');
const readJson=relative=>JSON.parse(fs.readFileSync(path.join(project,relative),'utf8'));
const fail=message=>{throw new Error(message)};
const hash=file=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const walk=directory=>fs.readdirSync(directory,{withFileTypes:true}).flatMap(entry=>{const absolute=path.join(directory,entry.name);return entry.isDirectory()?walk(absolute):[absolute]});
const assertExact=relative=>{const current=path.join(project,relative),baseline=path.join(backup,relative);if(!fs.existsSync(baseline)||hash(current)!==hash(baseline))fail(`${relative} ist nicht bytegleich zu V2.1.`)};

if(!fs.existsSync(backup))fail('Vollständiges Backup backups/version-2.1 fehlt.');
let backupVerification={status:'internal_present',file_count:walk(backup).length,byte_identical_to_source:null};
if(fs.existsSync(original)){
  const originalFiles=walk(original).sort(),backupFiles=walk(backup).sort();
  if(originalFiles.length!==backupFiles.length)fail(`V2.1-Backup unvollständig: ${backupFiles.length} statt ${originalFiles.length} Dateien.`);
  for(const source of originalFiles){const relative=path.relative(original,source),target=path.join(backup,relative);if(!fs.existsSync(target)||fs.statSync(source).size!==fs.statSync(target).size||hash(source)!==hash(target))fail(`V2.1-Backup weicht ab: ${relative}`)}
  backupVerification={status:'PASS',file_count:originalFiles.length,byte_identical_to_source:true};
}

const protectedFiles=['data/canonical/nodes.json','data/canonical/relations.json','data/canonical/relation-types.json','data/canonical/sources.json','data/canonical/schema.json','data/canonical/scenarios.json','data/canonical/scenario-schema.json','data/canonical/learning-framework.json','data/canonical/learning-schema.json','data/runtime/knowledge-runtime.js','data/runtime/architecture-runtime.js','data/runtime/learning-runtime.js','data/user/user-profile.example.json','data/user/user-profile-learning-v2.1.example.json'];
protectedFiles.forEach(assertExact);

const nodes=readJson('data/canonical/nodes.json'),relations=readJson('data/canonical/relations.json'),sources=readJson('data/canonical/sources.json'),scenarios=readJson('data/canonical/scenarios.json'),learning=readJson('data/canonical/learning-framework.json'),release=readJson('data/canonical/release.json');
if(nodes.nodes.length!==1058||relations.relations.length!==243||sources.sources.length!==155||scenarios.scenarios.length!==5||learning.learning_paths.length!==5)fail('Release-Zählwerte der geschützten Daten stimmen nicht.');
const nodeIds=new Set(nodes.nodes.map(node=>node.id)),scenarioIds=new Set(scenarios.scenarios.map(scenario=>scenario.id)),steps=learning.learning_paths.flatMap(pathEntry=>pathEntry.steps),stepIds=new Set(steps.map(step=>step.id));
if(nodeIds.size!==1058||stepIds.size!==steps.length)fail('Doppelte Node- oder Learning-Step-ID.');
for(const node of nodes.nodes){if(node.parent&&!nodeIds.has(node.parent))fail(`${node.id}: ungültiger Parent.`);for(const child of node.children)if(!nodeIds.has(child))fail(`${node.id}: ungültiges Kind ${child}.`)}
for(const scenario of scenarios.scenarios){for(const id of scenario.learning_path)if(!nodeIds.has(id))fail(`${scenario.id}: ungültiger Node-Link ${id}.`);for(const component of scenario.component_instances)if(component.node_ref&&!nodeIds.has(component.node_ref))fail(`${scenario.id}: ungültige Komponente ${component.node_ref}.`)}
for(const step of steps){for(const id of step.referenced_nodes)if(!nodeIds.has(id))fail(`${step.id}: ungültiger Node-Link ${id}.`);for(const id of step.referenced_scenarios)if(!scenarioIds.has(id))fail(`${step.id}: ungültiger Scenario-Link ${id}.`);for(const id of [...step.prerequisites,...step.next_learning_steps])if(!stepIds.has(id))fail(`${step.id}: ungültiger Learning-Step-Link ${id}.`);if(step.practice_references.length)fail(`${step.id}: unerlaubte GitHub-/Practice-Integration.`)}
for(const [key,value] of Object.entries({node_count:1058,relation_count:243,scenario_count:5,learning_path_count:5}))if(release[key]!==value)fail(`Release-Metadatum ${key} ist falsch.`);

const html=fs.readFileSync(path.join(project,'app/index.html'),'utf8'),start=fs.readFileSync(path.join(project,'START.html'),'utf8'),app=fs.readFileSync(path.join(project,'app/app.js'),'utf8');
for(const id of ['mindmapMode','brainMode','architectureMode','learningMode','expandAllBtn','collapseBtn','architectureView','scenarioList','scenarioContent','learningView','learningPathList','learningContent','contextSection','contextList'])if(!html.includes(`id="${id}"`))fail(`UI-Element ${id} fehlt.`);
const htmlIds=new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(match=>match[1]));
const dynamicIds=new Set(['stepProgressStatus','stepUnderstanding','stepNote']);
for(const match of app.matchAll(/\bel\('([^']+)'\)/g))if(!htmlIds.has(match[1])&&!dynamicIds.has(match[1]))fail(`app.js referenziert fehlendes DOM-Element ${match[1]}.`);
for(const src of [...html.matchAll(/<script src="([^"]+)"/g)].map(match=>match[1])){if(/^https?:/i.test(src))fail(`Externe Script-Verbindung ${src}.`);if(!fs.existsSync(path.resolve(project,'app',src)))fail(`Script fehlt: ${src}.`)}
if(!start.includes('url=app/index.html')||!start.includes('href="app/index.html"'))fail('START.html verweist nicht lokal auf app/index.html.');
if(/V1\.3/.test(start+html+app))fail('Veralteter statischer Versionshinweis V1.3 gefunden.');
if(app.includes('OpenAI')||app.includes('ChatGPT')||app.includes('Claude')||app.includes('fetch('))fail('Unerlaubte AI- oder Netzwerk-Integration in app.js.');
if(!app.includes("const PROFILE_KEY='adb:user-profile:v1.1'")||!app.includes('localStorage.setItem(PROFILE_KEY'))fail('Bestehender lokaler Profilvertrag wird nicht verwendet.');
const expandBody=app.match(/function expandAll\(\)\{([^}]*)\}/)?.[1]||'',collapseBody=app.match(/function collapseAll\(\)\{([^}]*)\}/)?.[1]||'';
if(!expandBody.includes('node.childNodes.length')||!expandBody.includes('renderMindmap()')||(expandBody.match(/renderMindmap\(\)/g)||[]).length!==1)fail('Alles aufklappen fehlt oder löst mehr als einen Renderlauf aus.');
if(!collapseBody.includes('new Set([root.id])')||!collapseBody.includes('renderMindmap()')||(collapseBody.match(/renderMindmap\(\)/g)||[]).length!==1)fail('Alles zuklappen fehlt oder löst mehr als einen Renderlauf aus.');
if(!app.includes("dom.expandAll.addEventListener('click',expandAll)")||!app.includes("dom.collapse.addEventListener('click',collapseAll)")||!app.includes('function toggleBranch(id)')||!app.includes("dom.search.addEventListener('input'"))fail('Mindmap-Steuerung, Einzelzweige oder Suche sind nicht vollständig verdrahtet.');
const mapNodes=new Map(nodes.nodes.map(node=>[node.id,node])),mapRoot=nodes.nodes.find(node=>!node.parent);
const collectVisible=expanded=>{const visible=[];const visit=id=>{const node=mapNodes.get(id);visible.push(id);if(expanded.has(id))for(const child of node.children)visit(child)};visit(mapRoot.id);return visible};
const allBranches=new Set(nodes.nodes.filter(node=>node.children.length).map(node=>node.id)),fullyVisible=collectVisible(allBranches),collapsedVisible=collectVisible(new Set([mapRoot.id])),firstBranch=mapRoot.children.find(id=>mapNodes.get(id).children.length),singleBranchVisible=collectVisible(new Set([mapRoot.id,firstBranch]));
if(fullyVisible.length!==1058)fail(`Alles aufklappen erreicht nur ${fullyVisible.length} von 1.058 Knoten.`);
if(collapsedVisible.length!==1+mapRoot.children.length||singleBranchVisible.length<=collapsedVisible.length)fail('Zuklappen oder anschließendes Öffnen eines Einzelzweigs ist inkonsistent.');

const temp=fs.mkdtempSync(path.join(os.tmpdir(),'adb-v22-build-'));
try{
  fs.mkdirSync(path.join(temp,'data/canonical'),{recursive:true});fs.mkdirSync(path.join(temp,'data/runtime'),{recursive:true});fs.mkdirSync(path.join(temp,'tools'),{recursive:true});
  for(const file of fs.readdirSync(path.join(project,'data/canonical')))if(file.endsWith('.json'))fs.copyFileSync(path.join(project,'data/canonical',file),path.join(temp,'data/canonical',file));
  const builders=['build-runtime.mjs','build-scenario-runtime.mjs','build-learning-runtime.mjs','build-release-runtime.mjs'];
  for(const builder of builders){fs.copyFileSync(path.join(project,'tools',builder),path.join(temp,'tools',builder));const result=spawnSync(process.execPath,[path.join(temp,'tools',builder)],{encoding:'utf8'});if(result.status!==0)fail(`${builder} fehlgeschlagen: ${result.stderr||result.stdout}`)}
}finally{fs.rmSync(temp,{recursive:true,force:true})}

const result={
  status:'PASS_WITH_BROWSER_EXECUTION_PENDING',version:'2.2',checked_at:new Date().toISOString(),
  backup:backupVerification,
  protected_data:{node_count:1058,node_ids_unchanged:true,hierarchy_unchanged:true,relation_count:243,source_count:155,scenario_count:5,scenario_data_byte_identical:true,learning_path_count:5,learning_data_byte_identical:true,runtimes_byte_identical:true,user_profile_examples_byte_identical:true},
  ui:{modes:['mindmap','brain','architecture','learning'],dom_references_valid:true,node_links_valid:true,scenario_links_valid:true,learning_step_links_valid:true,release_metadata_central:true,local_profile_contract_reused:true,external_scripts:0,ai_integration:false,github_integration:false,start_html_local:true,mindmap_expand_all:{status:'PASS',visible_nodes:fullyVisible.length,render_cycles:1},mindmap_collapse_all:{status:'PASS',visible_nodes:collapsedVisible.length,render_cycles:1},single_branch_after_global_control:'PASS',search_wiring:'PASS'},
  builds:{knowledge:'PASS',architecture:'PASS',learning:'PASS',release:'PASS'},
  compatibility:{offline_file_protocol:'PASS_STATIC',safari:'COMPATIBILITY_REVIEW_PASS_EXECUTION_PENDING',chrome:'INSTALLED_AUTOMATION_EXTENSION_UNAVAILABLE'},
  note:'Chrome und Safari müssen für einen ausgeführten Interaktionstest manuell geöffnet werden; die Codex-Chrome-Verbindung war nicht verfügbar.'
};
fs.writeFileSync(path.join(project,'reports/qa-v2.2.json'),`${JSON.stringify(result,null,2)}\n`);
console.log(JSON.stringify(result,null,2));
