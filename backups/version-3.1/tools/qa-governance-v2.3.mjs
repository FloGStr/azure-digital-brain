import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const project=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const previous=path.resolve(project,'../Azure-Digital-Brain-V2.2');
const backup=path.join(project,'backups/version-2.2');
const fail=message=>{throw new Error(message)};
const read=file=>fs.readFileSync(path.join(project,file),'utf8');
const json=file=>JSON.parse(read(file));
const sha=file=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const walk=directory=>fs.readdirSync(directory,{withFileTypes:true}).flatMap(entry=>{const absolute=path.join(directory,entry.name);return entry.isDirectory()?walk(absolute):[absolute]});
const same=(left,right)=>fs.existsSync(left)&&fs.existsSync(right)&&fs.statSync(left).size===fs.statSync(right).size&&sha(left)===sha(right);

if(!fs.existsSync(previous)||!fs.existsSync(backup))fail('Freigegebene V2.2-Arbeitsversion oder vollständiges Backup fehlt.');
const previousFiles=walk(previous).sort(),backupFiles=walk(backup).sort();
if(previousFiles.length!==backupFiles.length)fail(`V2.2-Backup unvollständig: ${backupFiles.length} statt ${previousFiles.length} Dateien.`);
for(const source of previousFiles){const relative=path.relative(previous,source),target=path.join(backup,relative);if(!same(source,target))fail(`V2.2-Backup weicht ab: ${relative}`)}

const allowedChanged=new Set(['data/canonical/release.json','data/runtime/release-runtime.js','tools/build-release-runtime.mjs']);
const changedExisting=[];
for(const source of previousFiles){const relative=path.relative(previous,source),target=path.join(project,relative);if(!fs.existsSync(target))fail(`V2.2-Datei fehlt in V2.3: ${relative}`);if(!same(source,target))changedExisting.push(relative)}
const unexpected=changedExisting.filter(relative=>!allowedChanged.has(relative));
if(unexpected.length)fail(`Nicht freigegebene Änderungen gegenüber V2.2: ${unexpected.slice(0,10).join(', ')}`);
if(changedExisting.length!==allowedChanged.size||[...allowedChanged].some(file=>!changedExisting.includes(file)))fail(`Release-Dateiänderungen unvollständig: ${changedExisting.join(', ')}`);

const protectedFiles=['data/canonical/nodes.json','data/canonical/relations.json','data/canonical/relation-types.json','data/canonical/sources.json','data/canonical/schema.json','data/canonical/scenarios.json','data/canonical/scenario-schema.json','data/canonical/learning-framework.json','data/canonical/learning-schema.json','data/runtime/knowledge-runtime.js','data/runtime/architecture-runtime.js','data/runtime/learning-runtime.js','app/app.js','app/index.html','app/styles.css','START.html','data/user/user-profile.example.json'];
for(const relative of protectedFiles)if(!same(path.join(project,relative),path.join(backup,relative)))fail(`${relative} ist nicht bytegleich zu V2.2.`);

const nodes=json('data/canonical/nodes.json'),relations=json('data/canonical/relations.json'),sources=json('data/canonical/sources.json'),scenarios=json('data/canonical/scenarios.json'),learning=json('data/canonical/learning-framework.json'),release=json('data/canonical/release.json');
const expected={node_count:1058,relation_count:243,scenario_count:5,learning_path_count:5};
for(const [key,value] of Object.entries(expected))if(release[key]!==value)fail(`Release ${key} ist ${release[key]} statt ${value}.`);
if(release.release_version!=='2.3'||release.release_title!=='Project Governance & Quality Operating Model')fail('Zentrale V2.3-Release-Metadaten ungültig.');
if(nodes.nodes.length!==1058||relations.relations.length!==243||sources.sources.length!==155||scenarios.scenarios.length!==5||learning.learning_paths.length!==5)fail('Geschützte Datenzählwerte stimmen nicht.');

const governanceFiles=['PROJECT-GOVERNANCE.md','QUALITY-GATES.md','CHANGE-POLICY.md','DECISION-LOG.md'];
for(const file of governanceFiles)if(!fs.existsSync(path.join(project,file))||read(file).length<1000)fail(`${file} fehlt oder ist unvollständig.`);
const governance=read('PROJECT-GOVERNANCE.md'),gates=read('QUALITY-GATES.md'),policy=read('CHANGE-POLICY.md'),decisions=read('DECISION-LOG.md');
for(const phase of ['DISCOVER','DESIGN','BUILD','VALIDATE','HUMAN REVIEW','RELEASE','GOVERN','IMPROVE'])if(!governance.includes(phase))fail(`Governance-Phase ${phase} fehlt.`);
for(const section of ['Ziel:','Aktivitäten:','Inputs:','Outputs:','Quality Gate:','Automatisch zulässig:','Human Review:'])if((governance.match(new RegExp(section,'g'))||[]).length<8)fail(`Lifecycle-Feld ${section} ist nicht für alle Phasen definiert.`);
if(!governance.includes('Vor jeder zukünftigen Änderung')||!governance.includes('PROJECT-GOVERNANCE.md')||!governance.includes('Definition of Done'))fail('Startregel oder Definition of Done fehlt.');
for(const changeClass of ['Class A','Class B','Class C','Class D'])if(!policy.includes(changeClass)||!governance.includes(changeClass))fail(`${changeClass} ist nicht konsistent definiert.`);
for(const gate of ['Gate 1','Gate 2','Gate 3','Gate 4','Gate 5','Gate 6'])if(!gates.includes(gate))fail(`${gate} fehlt.`);
for(const pillar of ['Reliability','Security','Cost Optimization','Operational Excellence','Performance Efficiency'])if(!gates.includes(pillar))fail(`WAF-Perspektive ${pillar} fehlt.`);
for(const category of ['A | Sicheres Duplikat','B | Wahrscheinliches Duplikat','C | Legacy / persönliche Erinnerung','D | Falsche/fragwürdige Hierarchie','E | Veraltet','F | Zu granular / Fragment','G | Fehlender wichtiger Knoten','H | Unklar / Human Context Required'])if(!gates.includes(category))fail(`Knowledge-Audit-Kategorie fehlt: ${category}`);
for(const status of ['detected','awaiting_review','approved','rejected','deferred','resolved','promoted_to_rule'])if(!gates.includes(status))fail(`Finding-Status ${status} fehlt.`);
for(const status of ['PASS','PASS WITH EXCEPTIONS','BLOCKED','FAIL'])if(!governance.includes(status)||!gates.includes(status))fail(`QA-Status ${status} ist nicht konsistent.`);
if(!gates.includes('Confidence alone')&&!gates.includes('Confidence allein'))fail('Confidence-Schutzregel fehlt.');
if(!gates.includes('Kategorie H erfordert immer Human Review'))fail('Kategorie-H-Schutzregel fehlt.');
if(!policy.includes('Class D wird niemals automatisch ausgeführt')||!policy.includes('old_node_id → canonical_node_id')||!policy.includes('Active → Deprecated / Legacy → Archive'))fail('Destructive-, Merge- oder Archivierungsregel fehlt.');
if(!policy.includes('erkennen,')||!policy.includes('klassifizieren,')||!policy.includes('priorisieren,')||!policy.includes('Aktion vorschlagen'))fail('Rule-Promotion-Aktionsgrenze fehlt.');
if((decisions.match(/^## ADR-/gm)||[]).length<4)fail('Initiale Governance-Entscheidungen fehlen im Decision Log.');
if(!gates.includes('executed browser PASS')||!gates.includes('browser execution pending')||!gates.includes('static/regression PASS'))fail('Ehrliche Browser-QA-Status fehlen.');

const app=read('app/app.js'),html=read('app/index.html');
for(const token of ['expandAllBtn','collapseBtn','architectureMode','learningMode'])if(!html.includes(token)||!app.includes(token))fail(`V2.2-UI-Funktion ${token} fehlt.`);
if(!app.includes('function expandAll()')||!app.includes('function collapseAll()')||!app.includes("dom.search.addEventListener('input'"))fail('Mindmap Expand/Collapse oder Suche fehlt.');

const temp=fs.mkdtempSync(path.join(os.tmpdir(),'adb-v23-build-'));
try{
  fs.mkdirSync(path.join(temp,'data/canonical'),{recursive:true});fs.mkdirSync(path.join(temp,'data/runtime'),{recursive:true});fs.mkdirSync(path.join(temp,'tools'),{recursive:true});
  for(const file of fs.readdirSync(path.join(project,'data/canonical')))if(file.endsWith('.json'))fs.copyFileSync(path.join(project,'data/canonical',file),path.join(temp,'data/canonical',file));
  for(const builder of ['build-runtime.mjs','build-scenario-runtime.mjs','build-learning-runtime.mjs','build-release-runtime.mjs']){fs.copyFileSync(path.join(project,'tools',builder),path.join(temp,'tools',builder));const run=spawnSync(process.execPath,[path.join(temp,'tools',builder)],{encoding:'utf8'});if(run.status!==0)fail(`${builder} fehlgeschlagen: ${run.stderr||run.stdout}`)}
}finally{fs.rmSync(temp,{recursive:true,force:true})}

const exceptions=[{
  exception_id:'EX-V2.3-001',cause:'Codex-Browsersteuerung für einen echten Chrome-/Safari-Interaktionstest nicht verfügbar.',risk:'Niedrig: V2.3 verändert keine UI-Datei; statische Regression und Bytevergleich zu V2.2 sind erfolgreich.',affected_area:'Gate 5 – Browser Compatibility',decision:'Release als Governance-only mit browser execution pending; kein executed browser PASS.',owner:'Human Project Owner / nächster browserfähiger QA-Lauf',follow_up:'Ausgeführten Chrome- und Safari-Smoke-Test nachholen, sobald Browsersteuerung verfügbar ist.'
}];
const result={status:'PASS WITH EXCEPTIONS',version:'2.3',checked_at:new Date().toISOString(),backup:{version:'2.2',file_count:previousFiles.length,byte_identical:true},change_scope:{class:'B – additive governance plus central release metadata',changed_existing_files:changedExisting,unexpected_changes:0,new_governance_files:governanceFiles},protected_data:{node_count:1058,node_ids_unchanged:true,hierarchy_unchanged:true,relation_count:243,source_count:155,scenarios_byte_identical:true,learning_byte_identical:true,ui_byte_identical:true,user_profile_unchanged:true,mindmap_expand_collapse_present:true},governance:{lifecycle_phases:8,change_classes:4,quality_gates:6,audit_categories:8,finding_statuses:7,decision_entries:(decisions.match(/^## ADR-/gm)||[]).length,documents_consistent:true},builds:{knowledge:'PASS',architecture:'PASS',learning:'PASS',release:'PASS'},browser:{static_regression:'PASS',executed_browser:'PENDING'},exceptions};
fs.writeFileSync(path.join(project,'reports/governance-qa-v2.3.json'),`${JSON.stringify(result,null,2)}\n`);
console.log(JSON.stringify(result,null,2));
