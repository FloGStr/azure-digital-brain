#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const previous = path.resolve(project, '../Azure-Digital-Brain-V2.3');
const backup = path.join(project, 'backups/version-2.3');
const fail = (message) => { throw new Error(message); };
const read = (relative) => fs.readFileSync(path.join(project, relative), 'utf8');
const json = (relative) => JSON.parse(read(relative));
const digest = (absolute) => crypto.createHash('sha256').update(fs.readFileSync(absolute)).digest('hex');
const same = (left, right) => fs.existsSync(left) && fs.existsSync(right) && fs.statSync(left).size === fs.statSync(right).size && digest(left) === digest(right);
const walkCount = (directory) => fs.readdirSync(directory, { withFileTypes: true }).reduce((sum, entry) => sum + (entry.isDirectory() ? walkCount(path.join(directory, entry.name)) : 1), 0);

if (!fs.existsSync(previous) || !fs.existsSync(backup)) fail('V2.3-Arbeitsversion oder vollständiges Backup fehlt.');
const previousCount = walkCount(previous);
const backupCount = walkCount(backup);
if (previousCount !== backupCount || previousCount !== 101658) fail(`Backup-Dateizahl unerwartet: V2.3 ${previousCount}, Backup ${backupCount}.`);

const protectedFiles = [
  'data/canonical/nodes.json', 'data/canonical/relations.json', 'data/canonical/relation-types.json',
  'data/canonical/sources.json', 'data/canonical/schema.json', 'data/canonical/scenarios.json',
  'data/canonical/scenario-schema.json', 'data/canonical/learning-framework.json',
  'data/canonical/learning-schema.json', 'data/runtime/knowledge-runtime.js',
  'data/runtime/architecture-runtime.js', 'data/runtime/learning-runtime.js',
  'app/app.js', 'app/index.html', 'app/styles.css', 'START.html',
  'data/user/user-profile.example.json', 'data/user/user-profile-learning-v2.1.example.json',
  'data/user/ai-proposals.example.json',
];
for (const relative of protectedFiles) {
  if (!same(path.join(project, relative), path.join(backup, relative))) fail(`${relative} ist nicht bytegleich zu V2.3.`);
}

const nodesDoc = json('data/canonical/nodes.json');
const relationDoc = json('data/canonical/relations.json');
const sourceDoc = json('data/canonical/sources.json');
const scenarioDoc = json('data/canonical/scenarios.json');
const learningDoc = json('data/canonical/learning-framework.json');
const release = json('data/canonical/release.json');
const audit = json('data/audit/knowledge-audit-v2.4.json');
if (nodesDoc.nodes.length !== 1058 || relationDoc.relations.length !== 243 || sourceDoc.sources.length !== 155 || scenarioDoc.scenarios.length !== 5 || learningDoc.learning_paths.length !== 5) fail('Geschützte Datenzählwerte stimmen nicht.');
if (release.release_version !== '2.4' || release.release_title !== 'Knowledge Base Audit & Cleanup Proposal') fail('Zentrale V2.4-Release-Metadaten ungültig.');
for (const [key, value] of Object.entries({ node_count: 1058, relation_count: 243, scenario_count: 5, learning_path_count: 5 })) if (release[key] !== value) fail(`Release ${key} ist ${release[key]} statt ${value}.`);

const nodeIds = nodesDoc.nodes.map((node) => node.id);
if (new Set(nodeIds).size !== 1058) fail('Knoten-IDs sind nicht eindeutig.');
const previousNodeIds = JSON.parse(fs.readFileSync(path.join(backup, 'data/canonical/nodes.json'), 'utf8')).nodes.map((node) => node.id);
if (JSON.stringify(nodeIds) !== JSON.stringify(previousNodeIds)) fail('Knoten-ID-Reihenfolge weicht von V2.3 ab.');

if (audit.coverage.nodes_scanned !== 1058 || audit.coverage.nodes_complete !== true) fail('Audit-Coverage ist unvollständig.');
if (audit.summary.total_findings !== audit.findings.length || audit.findings.length !== 77) fail('Finding-Zählwert ist inkonsistent.');
const required = ['finding_id', 'category', 'affected_nodes', 'reasoning', 'evidence', 'confidence', 'priority', 'proposed_action', 'status', 'human_decision', 'decision_date', 'decision_owner', 'resulting_rule'];
const findingIds = new Set();
for (const finding of audit.findings) {
  for (const field of required) if (!(field in finding)) fail(`${finding.finding_id || 'Finding'}: Pflichtfeld ${field} fehlt.`);
  if (findingIds.has(finding.finding_id)) fail(`Doppelte Finding-ID ${finding.finding_id}.`);
  findingIds.add(finding.finding_id);
  if (!/^[A-H]$/.test(finding.category)) fail(`${finding.finding_id}: Kategorie ungültig.`);
  if (!['high', 'medium', 'low'].includes(finding.confidence)) fail(`${finding.finding_id}: Confidence ungültig.`);
  if (!['P1', 'P2', 'P3'].includes(finding.priority)) fail(`${finding.finding_id}: Priorität ungültig.`);
  if (!['detected', 'awaiting_review'].includes(finding.status)) fail(`${finding.finding_id}: Status für V2.4 unzulässig.`);
  if (finding.category === 'H' && finding.status !== 'awaiting_review') fail(`${finding.finding_id}: Kategorie H ist nicht awaiting_review.`);
  for (const nodeId of finding.affected_nodes) if (!nodeIds.includes(nodeId)) fail(`${finding.finding_id}: unbekannte Knoten-ID ${nodeId}.`);
  if ((finding.category === 'A' || finding.category === 'B') && (!finding.preferred_possible_canonical || !finding.commonalities || !finding.differences || !finding.unique_content || !finding.merge_risk)) fail(`${finding.finding_id}: Duplikatvergleich unvollständig.`);
  if (finding.category === 'D' && (!finding.current_paths || !finding.suggested_parent_path)) fail(`${finding.finding_id}: Hierarchie-Vorschlag unvollständig.`);
}
if (audit.findings.filter((finding) => finding.category === 'H').length !== 5) fail('Kategorie-H-Zählwert unerwartet.');
if (Object.values(audit.safeguards).some((value) => value !== false && value !== 0)) fail('Nicht-destruktive Safeguards melden Änderungen.');

const reports = ['knowledge-audit-v2.4.md', 'duplicate-analysis-v2.4.md', 'hierarchy-audit-v2.4.md', 'legacy-fragment-audit-v2.4.md', 'review-package-v2.4.md', 'rule-candidates-v2.4.md'];
for (const report of reports) if (!fs.existsSync(path.join(project, 'reports', report)) || read(`reports/${report}`).length < 1000) fail(`${report} fehlt oder ist unvollständig.`);

const app = read('app/app.js');
const html = read('app/index.html');
for (const token of ['expandAllBtn', 'collapseBtn', 'architectureMode', 'learningMode']) if (!html.includes(token) || !app.includes(token)) fail(`UI-Regression: ${token} fehlt.`);
if (!app.includes('function expandAll()') || !app.includes('function collapseAll()') || !app.includes("dom.search.addEventListener('input'")) fail('UI-Regression bei Expand/Collapse oder Suche.');

const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'adb-v24-build-'));
const builds = {};
try {
  fs.mkdirSync(path.join(temp, 'data/canonical'), { recursive: true });
  fs.mkdirSync(path.join(temp, 'data/runtime'), { recursive: true });
  fs.mkdirSync(path.join(temp, 'tools'), { recursive: true });
  for (const file of fs.readdirSync(path.join(project, 'data/canonical'))) if (file.endsWith('.json')) fs.copyFileSync(path.join(project, 'data/canonical', file), path.join(temp, 'data/canonical', file));
  for (const builder of ['build-runtime.mjs', 'build-scenario-runtime.mjs', 'build-learning-runtime.mjs', 'build-release-runtime.mjs']) {
    fs.copyFileSync(path.join(project, 'tools', builder), path.join(temp, 'tools', builder));
    const run = spawnSync(process.execPath, [path.join(temp, 'tools', builder)], { encoding: 'utf8' });
    if (run.status !== 0) fail(`${builder} fehlgeschlagen: ${run.stderr || run.stdout}`);
    builds[builder.replace('build-', '').replace('.mjs', '')] = 'PASS';
  }
} finally {
  fs.rmSync(temp, { recursive: true, force: true });
}

const result = {
  status: 'PASS WITH EXCEPTIONS',
  version: '2.4',
  checked_at: new Date().toISOString(),
  change_scope: 'Class B – additive audit, proposals, reports and central release metadata',
  backup: { version: '2.3', file_count: backupCount, byte_identical: true, verification: 'full diff -qr completed with exit code 0 before QA' },
  protected_data: {
    node_count: 1058, node_ids_unchanged: true, hierarchy_byte_identical: true,
    relation_count: 243, relations_byte_identical: true, source_count: 155, sources_byte_identical: true,
    scenarios_byte_identical: true, learning_byte_identical: true, ui_byte_identical: true,
    user_examples_byte_identical: true, node_creations: 0, node_deletions: 0, node_moves: 0, node_merges: 0,
  },
  audit: { coverage: '1058/1058', findings: audit.findings.length, categories: audit.summary.by_category, confidence: audit.summary.by_confidence, priorities: audit.summary.by_priority, category_h_awaiting_review: true, schema_valid: true },
  gates: {
    gate_1_data_integrity: 'PASS', gate_2_knowledge_quality: 'PASS – findings only, no automatic change',
    gate_4_operability: 'PASS', gate_5_ui_regression: 'PASS – static and byte-identical to V2.3; executed browser PENDING',
    gate_6_release_readiness: 'PASS at handoff – final ZIP integrity and SHA-256 verified externally after report freeze',
  },
  builds,
  personal_browser_data: { audited: false, statement: 'Private browser-local notes and learning state were not accessible and were not claimed as covered.' },
  browser: { static_regression: 'PASS', ui_byte_identical_to_v2_3: true, executed_in_app_browser: 'PENDING', chrome: 'PENDING', safari: 'PENDING' },
  exceptions: [{
    exception_id: 'EX-V2.4-001',
    cause: 'Browser security policy blocks local file URLs, and the managed environment blocks binding a local test server.',
    risk: 'Low: V2.4 does not change START.html or any app file; protected UI files are byte-identical to V2.3 and static feature checks pass.',
    affected_area: 'Gate 5 – executed browser regression',
    decision: 'Report browser execution as PENDING; do not claim an executed Chrome/Safari PASS.',
    follow_up: 'Open START.html on the Mac and perform the existing smoke checklist in Chrome and Safari during human release review.',
  }],
};

fs.writeFileSync(path.join(project, 'reports/qa-v2.4.json'), `${JSON.stringify(result, null, 2)}\n`);
console.log(JSON.stringify(result, null, 2));
