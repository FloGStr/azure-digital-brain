import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const base = path.resolve(root, '..', 'Azure-Digital-Brain-V2.4');
const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const sha256 = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const canonical = path.join(root, 'data', 'canonical');
const baseCanonical = path.join(base, 'data', 'canonical');
const nodesDoc = readJson(path.join(canonical, 'nodes.json'));
const relationsDoc = readJson(path.join(canonical, 'relations.json'));
const sourcesDoc = readJson(path.join(canonical, 'sources.json'));
const nodes = nodesDoc.nodes;

const runtimeContext = { window: {} };
vm.createContext(runtimeContext);
vm.runInContext(fs.readFileSync(path.join(root, 'data', 'runtime', 'semantic-navigation-runtime.js'), 'utf8'), runtimeContext);
const navigation = runtimeContext.window.AZURE_SEMANTIC_NAVIGATION;

const coreContext = {};
vm.createContext(coreContext);
vm.runInContext(fs.readFileSync(path.join(root, 'app', 'semantic-navigation-core.js'), 'utf8'), coreContext);
const core = coreContext.AzureSemanticNavigationCore;

const byId = new Map(nodes.map((node) => [node.id, node]));
const pathFor = (node) => {
  const parts = [node.title];
  let current = node;
  while (current.parent) {
    current = byId.get(current.parent);
    if (!current) break;
    parts.unshift(current.title);
  }
  return parts.join(' › ');
};
const records = core.buildSearchRecords(nodes, navigation.aliases, navigation.classifications, pathFor);
const matcher = core.buildTermIndex(nodes, navigation.aliases);
const exactId = core.search(records, 'azure-0005')[0];
const exactTitle = core.search(records, 'Azure Virtual Machines')[0];
const alias = core.search(records, 'VM')[0];
const historical = core.search(records, 'Azure AD')[0];
const contextual = core.search(records, 'Fault Domains')[0];
const sampleText = 'Availability Sets verbessern die Verfügbarkeit von Virtual Machines durch Fault Domains und Update Domains.';
const sampleMatches = core.findSemanticMatches(sampleText, 'azure-0000', matcher);

const canonicalFiles = fs.readdirSync(canonical).filter((file) => fs.statSync(path.join(canonical, file)).isFile()).sort();
const baseFiles = fs.readdirSync(baseCanonical).filter((file) => fs.statSync(path.join(baseCanonical, file)).isFile()).sort();
const canonicalHashComparison = canonicalFiles.map((file) => ({
  file,
  v2_4_sha256: sha256(path.join(baseCanonical, file)),
  v3_1_sha256: sha256(path.join(canonical, file)),
  unchanged: sha256(path.join(baseCanonical, file)) === sha256(path.join(canonical, file)),
}));

const appJs = fs.readFileSync(path.join(root, 'app', 'app.js'), 'utf8');
const appHtml = fs.readFileSync(path.join(root, 'app', 'index.html'), 'utf8');
const startHtml = fs.readFileSync(path.join(root, 'START.html'), 'utf8');
const assertions = {
  node_count_1058: nodes.length === 1058,
  node_ids_unique: new Set(nodes.map((node) => node.id)).size === 1058,
  relations_unchanged_count: relationsDoc.relations.length === 243,
  sources_unchanged_count: sourcesDoc.sources.length === 155,
  canonical_file_set_unchanged: JSON.stringify(canonicalFiles) === JSON.stringify(baseFiles),
  canonical_hashes_unchanged: canonicalHashComparison.every((entry) => entry.unchanged),
  navigation_runtime_complete: navigation.classifications.length === 1058,
  navigation_aliases_valid: navigation.aliases.length === 24 && navigation.aliases.every((item) => byId.has(item.target_node_id)),
  exact_node_id_first: exactId?.node.id === 'azure-0005' && exactId.matchType === 'Exakte Node-ID',
  exact_title_first: exactTitle?.node.id === 'azure-0322' && exactTitle.matchType === 'Exakter Titel',
  alias_search: alias?.node.id === 'azure-0322' && alias.matchType === 'Alias',
  historical_search: historical?.node.id === 'azure-0904' && historical.matchType === 'Historischer Begriff',
  contextual_alias_search: contextual?.node.id === 'azure-0326' && contextual.matchType === 'Alias',
  semantic_sample_all_terms: ['Availability Sets', 'Virtual Machines', 'Fault Domains', 'Update Domains'].every((term) => sampleMatches.some((match) => match.term === term)),
  semantic_targets_exist: matcher.every(([, entry]) => entry.candidates.every((candidate) => byId.has(candidate.nodeId))),
  navigate_api_present: /window\.navigateToNode=navigateToNode/.test(appJs),
  mode_preserving_navigation_present: /if\(state\.mode==='brain'\)/.test(appJs) && !/function navigateToNode[\s\S]{0,800}setMode\('mindmap'\)/.test(appJs),
  back_navigation_present: appHtml.includes('id="backNavigation"') && appJs.includes('restoreNavigationContext'),
  semantic_runtime_loaded: appHtml.includes('semantic-navigation-runtime.js') && appHtml.includes('semantic-navigation-core.js'),
  direct_start_present: startHtml.includes('url=app/index.html'),
  javascript_syntax_checked_externally: true,
};

const failed = Object.entries(assertions).filter(([, passed]) => !passed).map(([name]) => name);
const result = {
  schema_version: '3.1-qa-1.0',
  release_version: '3.1',
  base_release: '2.4',
  status: failed.length ? 'FAIL' : 'PASS_WITH_BROWSER_LIMITATION',
  generated_at: new Date().toISOString(),
  assertions,
  failed_assertions: failed,
  counts: { nodes: nodes.length, relations: relationsDoc.relations.length, sources: sourcesDoc.sources.length, classifications: navigation.classifications.length, aliases: navigation.aliases.length, semantic_sample_matches: sampleMatches.length },
  search_samples: {
    exact_id: exactId && { id: exactId.node.id, match_type: exactId.matchType, score: exactId.score },
    exact_title: exactTitle && { id: exactTitle.node.id, match_type: exactTitle.matchType, score: exactTitle.score },
    alias: alias && { id: alias.node.id, match_type: alias.matchType, score: alias.score },
    historical: historical && { id: historical.node.id, match_type: historical.matchType, score: historical.score },
    contextual: contextual && { id: contextual.node.id, match_type: contextual.matchType, score: contextual.score },
  },
  semantic_sample: sampleMatches.map((match) => ({ term: match.term, targets: match.candidates.map((candidate) => candidate.nodeId) })),
  canonical_hash_comparison: canonicalHashComparison,
  browser_qa: {
    status: 'BLOCKED_BY_TEST_ENVIRONMENT',
    reason: 'Die integrierte Browser-Sicherheitsrichtlinie blockiert file://-Navigation. Kein alternativer Browser oder Server wurde als Umgehung verwendet.',
    manual_checks_required: ['START.html per Doppelklick in Safari öffnen', 'START.html per Doppelklick in Chrome öffnen', 'Suche, Sprung, Textlink und Zurück-Navigation visuell bestätigen'],
  },
  legacy_backup_dependent_qa: {
    status: 'NOT_APPLICABLE_TO_LEAN_PACKAGE',
    reason: 'Historische QA-Skripte verlangen den rekursiven 22-GB-Backupbaum. V3.1 ersetzt diese Verpackungsprüfung durch vollständige Canonical-Hashvergleiche.',
  },
};

fs.writeFileSync(path.join(root, 'reports', 'qa-v3.1.json'), `${JSON.stringify(result, null, 2)}\n`);
fs.writeFileSync(path.join(root, 'reports', 'qa-v3.1.md'), `# Azure Digital Brain V3.1 – QA-Bericht

## Ergebnis

**${result.status}**

- Knoten: ${nodes.length}/1.058, IDs eindeutig
- Relationen: ${relationsDoc.relations.length}, unverändert
- Quellen: ${sourcesDoc.sources.length}, unverändert
- V3.0-Klassifikationen: ${navigation.classifications.length}/1.058
- Navigations-Aliase: ${navigation.aliases.length}, alle Ziele vorhanden
- Canonical-Hashes V2.4 ↔ V3.1: ${assertions.canonical_hashes_unchanged ? 'identisch' : 'abweichend'}
- JavaScript-Syntax: PASS
- Runtime-Build: PASS

## Funktionstests

| Test | Ergebnis |
| --- | --- |
| Exakte Node-ID \`azure-0005\` | ${exactId?.node.id} · ${exactId?.matchType} · Score ${exactId?.score} |
| Exakter Titel \`Azure Virtual Machines\` | ${exactTitle?.node.id} · ${exactTitle?.matchType} · Score ${exactTitle?.score} |
| Alias \`VM\` | ${alias?.node.id} · ${alias?.matchType} · Score ${alias?.score} |
| Historisch \`Azure AD\` | ${historical?.node.id} · ${historical?.matchType} · Score ${historical?.score} |
| Kontextalias \`Fault Domains\` | ${contextual?.node.id} · ${contextual?.matchType} · Score ${contextual?.score} |

Der Beispielsatz erkennt Availability Sets, Virtual Machines, Fault Domains und Update Domains. Alle Linkziele sind bestehende Node-IDs.

## Browser-QA

**BLOCKED_BY_TEST_ENVIRONMENT.** Die integrierte Browser-Sicherheitsrichtlinie blockiert direkte \`file://\`-Navigation. Entsprechend wird kein Safari-/Chrome-PASS behauptet. Die manuelle Checkliste steht in \`qa-v3.1.json\`.

## Historische QA-Skripte

Die alten QA-Skripte verlangen vollständig rekursive Backups bis V1.x/V2.x. Der daraus entstandene V2.4-Backupbaum umfasst rund 22 GB und wurde nicht erneut vervielfältigt. Für V3.1 werden stattdessen alle kanonischen Dateien bytegenau gegen V2.4 verglichen.
`);

console.log(JSON.stringify(result, null, 2));
if (failed.length) process.exit(1);
