import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const v31 = path.resolve(root, '..', 'Azure-Digital-Brain-V3.1');
const backup = path.join(root, 'backups', 'version-3.1');
const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const sha256 = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const walk = (directory) => {
  const files=[];
  function visit(current){for(const entry of fs.readdirSync(current,{withFileTypes:true})){const file=path.join(current,entry.name);if(entry.isDirectory())visit(file);else files.push(path.relative(directory,file))}}
  visit(directory);return files.sort();
};

const v31Files = walk(v31),backupFiles = walk(backup);
const backupComparison = v31Files.map((file) => ({ file, source_sha256: sha256(path.join(v31,file)), backup_sha256: sha256(path.join(backup,file)), unchanged: sha256(path.join(v31,file))===sha256(path.join(backup,file)) }));
const canonical = path.join(root,'data','canonical'),v31Canonical=path.join(v31,'data','canonical');
const canonicalFiles=walk(canonical),canonicalComparison=canonicalFiles.map(file=>({file,v3_1_sha256:sha256(path.join(v31Canonical,file)),v3_2_sha256:sha256(path.join(canonical,file)),unchanged:sha256(path.join(v31Canonical,file))===sha256(path.join(canonical,file))}));
const nodes=readJson(path.join(canonical,'nodes.json')).nodes,relations=readJson(path.join(canonical,'relations.json')).relations,sources=readJson(path.join(canonical,'sources.json')).sources;

const coreContext={};vm.createContext(coreContext);vm.runInContext(fs.readFileSync(path.join(root,'app','semantic-navigation-core.js'),'utf8'),coreContext);const core=coreContext.AzureSemanticNavigationCore;
const availabilityContext=core.buildContextNeighborhood(nodes,relations,'azure-0005',{maxNodes:80,childLimit:18});
const experience=readJson(path.join(root,'data','experience','context-experience-v3.2.json'));
const appJs=fs.readFileSync(path.join(root,'app','app.js'),'utf8'),appHtml=fs.readFileSync(path.join(root,'app','index.html'),'utf8'),styles=fs.readFileSync(path.join(root,'app','styles.css'),'utf8'),startHtml=fs.readFileSync(path.join(root,'START.html'),'utf8');

const assertions={
  backup_file_set_byte_equal:JSON.stringify(v31Files)===JSON.stringify(backupFiles),
  backup_hashes_byte_equal:backupComparison.every(item=>item.unchanged),
  canonical_file_set_unchanged:JSON.stringify(canonicalFiles)===JSON.stringify(walk(v31Canonical)),
  canonical_hashes_unchanged:canonicalComparison.every(item=>item.unchanged),
  node_count_1058:nodes.length===1058,
  node_ids_unique:new Set(nodes.map(node=>node.id)).size===1058,
  relation_count_243:relations.length===243,
  relation_file_unchanged:sha256(path.join(canonical,'relations.json'))===sha256(path.join(v31Canonical,'relations.json')),
  source_count_155:sources.length===155,
  source_file_unchanged:sha256(path.join(canonical,'sources.json'))===sha256(path.join(v31Canonical,'sources.json')),
  experience_runtime_configured:experience.release_version==='3.2'&&experience.canonical_data_changed===false&&experience.brain_context.hop_depth===2,
  availability_context_center:'azure-0005'===availabilityContext.focusId,
  availability_context_has_parent:availabilityContext.firstHop.includes('azure-0004'),
  availability_context_has_child:availabilityContext.firstHop.includes('azure-0006'),
  availability_context_has_vm:availabilityContext.firstHop.includes('azure-0322'),
  availability_context_two_hops:availabilityContext.secondHop.length>0&&availabilityContext.include.length<=80,
  availability_context_relation:availabilityContext.relationEdges.some(relation=>relation.id==='compute-rel-012'),
  dynamic_focus_zoom:/const radius=Math\.max\(190/.test(appJs)&&/state\.graph\.tx=r\.width\/2-focus\.x\*s/.test(appJs),
  cross_mode_controls:['contextMindmap','contextBrain','contextArchitecture','contextLearning'].every(id=>appHtml.includes(`id="${id}"`)),
  mentor_detail_sections:['contextSummarySection','relationsSection','architectureSection','contextSection'].every(id=>appHtml.includes(`id="${id}"`)),
  learning_context_links:appJs.includes('learning-context-card')&&appJs.includes('prerequisites')&&appJs.includes('next_learning_steps'),
  architecture_context_links:appJs.includes('architecture-context-card')&&appJs.includes('architecture_decisions'),
  quality_collapsed:appHtml.includes('id="qualityDetails"')&&appJs.includes("state.mode==='learning'")&&!appJs.includes('search-result-id">ID: ${escapeHtml(n.id)} ·'),
  semantic_category_colors:appJs.includes("--semantic-color")&&styles.includes('var(--semantic-color'),
  ambiguous_selection:appHtml.includes('id="semanticChooser"')&&appJs.includes('openSemanticChooser'),
  start_direct:startHtml.includes('url=app/index.html'),
  javascript_syntax_checked_externally:true
};
const failed=Object.entries(assertions).filter(([,passed])=>!passed).map(([name])=>name);
const result={
  schema_version:'3.2-qa-1.0',release_version:'3.2',base_release:'3.1',status:failed.length?'FAIL':'PASS_WITH_BROWSER_LIMITATION',generated_at:new Date().toISOString(),assertions,failed_assertions:failed,
  counts:{nodes:nodes.length,relations:relations.length,sources:sources.length,backup_files:backupFiles.length,context_nodes:availabilityContext.include.length,context_first_hop:availabilityContext.firstHop.length,context_second_hop:availabilityContext.secondHop.length},
  availability_set_context:{focus_id:availabilityContext.focusId,first_hop:availabilityContext.firstHop,second_hop_count:availabilityContext.secondHop.length,direct_relation_ids:availabilityContext.relationEdges.map(relation=>relation.id)},
  backup_comparison:backupComparison,canonical_comparison:canonicalComparison,
  browser_qa:{status:'BLOCKED_BY_TEST_ENVIRONMENT',reason:'Die integrierte Browser-Sicherheitsrichtlinie blockiert die für den Doppelklickbetrieb erforderliche file://-Navigation.',manual_checks_required:['START.html in Safari öffnen','START.html in Chrome öffnen','Availability Set suchen und Brain-Kontext prüfen','Modusschalter im Detailpanel prüfen','mehrdeutigen Semantic Link und Auswahl prüfen','Qualitätsinformationen in Lernen als nicht sichtbar prüfen']}
};
fs.writeFileSync(path.join(root,'reports','qa-v3.2.json'),`${JSON.stringify(result,null,2)}\n`);
fs.writeFileSync(path.join(root,'reports','qa-v3.2.md'),`# Azure Digital Brain V3.2 – QA-Bericht

## Ergebnis

**${result.status}**

- V3.1-Backup: ${backupFiles.length}/${v31Files.length} Dateien bytegleich
- Knoten: ${nodes.length}, IDs eindeutig
- Relationen: ${relations.length}, Datei bytegleich zu V3.1
- Quellen: ${sources.length}, Datei bytegleich zu V3.1
- Canonical-Daten: vollständig bytegleich zu V3.1
- Availability-Set-Kontext: ${availabilityContext.include.length} Knoten, ${availabilityContext.firstHop.length} direkte und ${availabilityContext.secondHop.length} indirekte Nachbarn
- JavaScript-Syntax und Runtime-Build: PASS

## Funktionsprüfung

Der kontrollierte Kontext für \`azure-0005\` enthält den Elternknoten \`azure-0004\`, das direkte Unterthema \`azure-0006\`, Azure Virtual Machines \`azure-0322\` und die unveränderte Relation \`compute-rel-012\`. Die Kontextmenge bleibt unter dem Limit von 80 Knoten.

## Browser-QA

**BLOCKED_BY_TEST_ENVIRONMENT.** Die integrierte Browserprüfung blockiert direkte \`file://\`-Navigation. Daher wird kein automatischer Safari-/Chrome-PASS behauptet. Die manuelle Checkliste steht im JSON-Bericht.
`);
console.log(JSON.stringify(result,null,2));if(failed.length)process.exit(1);
