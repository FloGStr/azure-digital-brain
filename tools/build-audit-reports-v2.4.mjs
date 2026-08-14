#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const audit = JSON.parse(fs.readFileSync(path.join(root, 'data/audit/knowledge-audit-v2.4.json'), 'utf8'));
const reports = path.join(root, 'reports');
fs.mkdirSync(reports, { recursive: true });
const esc = (value) => String(value ?? '').replaceAll('|', '\\|').replaceAll('\n', ' ');
const table = (headers, rows) => [
  `| ${headers.join(' | ')} |`,
  `| ${headers.map(() => '---').join(' | ')} |`,
  ...rows.map((row) => `| ${row.map(esc).join(' | ')} |`),
].join('\n');
const write = (name, content) => fs.writeFileSync(path.join(reports, name), `${content.trim()}\n`);
const findings = audit.findings;
const cat = (code) => findings.filter((item) => item.category === code);
const statusNote = '> V2.4 ist ausschließlich ein nicht-destruktiver Audit. Kein Finding ist eine Änderungsfreigabe. Knoten, IDs, Hierarchie, Relationen, Quellen, Szenarien und Lernpfade bleiben unverändert.';
const findingTable = (items) => table(
  ['ID', 'Kat.', 'Prio', 'Confidence', 'Knoten', 'Finding', 'Vorschlag', 'Status'],
  items.map((item) => [item.finding_id, item.category, item.priority, item.confidence, item.affected_nodes.join(', ') || '– (Gap)', item.title, item.proposed_action, item.status]),
);

write('knowledge-audit-v2.4.md', `
# Azure Digital Brain V2.4 – Knowledge Base Audit

${statusNote}

## Executive Summary

Der vollständige Scan hat **${audit.coverage.nodes_scanned}/${audit.coverage.nodes_expected} Knoten**, **${audit.coverage.relations_scanned} Beziehungen**, **${audit.coverage.sources_scanned} Quellen**, Szenario-Referenzen und Lernpfad-Referenzen geprüft. Aus mehreren Signalen wurden bewusst nur **${audit.summary.total_findings} reviewfähige Findings** erzeugt; pauschale Kurztext- oder Keyword-Treffer wurden nicht als Findings übernommen.

${table(['Kategorie', 'Anzahl'], Object.entries(audit.summary.by_category).map(([key, value]) => [`${key} – ${({'A':'Sicheres Duplikat','B':'Wahrscheinliches Duplikat','C':'Legacy/Reminder','D':'Hierarchie','E':'Veraltet','F':'Fragment','G':'Fehlender Knoten','H':'Human Context'})[key]}`, value]))}

${table(['Priorität', 'Anzahl'], Object.entries(audit.summary.by_priority))}

${table(['Confidence', 'Anzahl'], Object.entries(audit.summary.by_confidence))}

- Human Context Required (H): **${audit.summary.human_context_required}**
- Awaiting Review: **${audit.summary.awaiting_review}**
- Finding-Cluster: **${audit.summary.cluster_count}**
- Automatische Änderungen: **0**

## Audit-Abdeckung

- Node-Felder: ${audit.coverage.node_fields_scanned.join(', ')}
- Hierarchietiefe: ${Object.entries(audit.coverage.hierarchy_depth_distribution).map(([depth, count]) => `Level ${depth}: ${count}`).join('; ')}
- Eindeutige Szenario-Knotenreferenzen: ${audit.coverage.scenario_referenced_nodes}
- Eindeutige Lernpfad-Knotenreferenzen: ${audit.coverage.learning_referenced_nodes}
- Kanonische Quellen: ${audit.coverage.sources_scanned}; ungültiges URL-Format: ${audit.coverage.source_audit.invalid_url_format}; doppelte URLs: ${audit.coverage.source_audit.duplicate_urls}; ungenutzte Quellen: ${audit.coverage.source_audit.unused_canonical_sources}
- Für Current-State-/Gap-Findings geprüfte offizielle Quellen: ${audit.summary.official_sources_checked_for_current_state_findings}
- Persönliche Browser-Notizen: **nicht auditiert**. Sie liegen außerhalb der kanonischen Projektdateien; der Audit macht dazu keine Vollständigkeitsbehauptung.

## Methodik

1. Vollständige Inventarisierung aller kanonischen Knoten und Felder.
2. Duplikatsuche mit Titel, normalisiertem Konzept, Hierarchiepfad, Inhaltsdichte, Quellen, Beziehungen, Kindern und Referenzrisiko.
3. Hierarchieprüfung anhand fachlicher Semantik und Navigierbarkeit.
4. Konservative Legacy-/Fragmentanalyse; unklare persönliche Absicht wird Kategorie H.
5. Prüfung zeitkritischer Aussagen und Lücken mit offiziellen Microsoft-Quellen.
6. Clustering, Confidence und P1/P2/P3-Priorisierung.

## Wichtigste Ergebnisse

- Der klarste Duplikat-Cluster liegt im Storage-Bereich: mehrere Werkzeuge, Redundanzvarianten und Dienste erscheinen sowohl angereichert als auch in einem parallelen historischen Lernast.
- Management Groups und Monitoring/Operations besitzen hochwertige Inhalte, stehen aber in fachlich fragwürdigen Hauptpfaden.
- Data Lake Analytics ist bereits eingestellt; Azure Blueprints und Azure Lab Services besitzen aktive Retirement-Zeitpläne.
- Zwölf architektonisch wichtige Begriffe werden zwar teilweise in Fließtexten erwähnt, besitzen jedoch keinen eigenen navigierbaren Knoten. Das ist nur ein Proposal, keine Erlaubnis zur Knotenerstellung.
- Fünf Findings benötigen zwingend ursprünglichen menschlichen Kontext.

## Alle Findings

${findingTable(findings)}

## Grenzen

- Der Audit bewertet die kanonische Projektbasis, nicht private Browser-Speicherstände.
- Eine semantische Ähnlichkeit ist keine Merge-Freigabe.
- Current-State-Checks sind eine Momentaufnahme vom 13. August 2026 und benötigen vor späteren Änderungen erneute Quellenprüfung.
- Der Audit endet bei Review Package; es wurden keine Cleanup-Aktionen ausgeführt.
`);

write('duplicate-analysis-v2.4.md', `
# Azure Digital Brain V2.4 – Duplicate Analysis

${statusNote}

## Ergebnis

Es wurden **${cat('A').length} sichere** und **${cat('B').length} wahrscheinliche** Duplikat-/Überlappungskandidaten dokumentiert. Generische Strukturwörter wie „Merksatz“ oder „Beispiel“ wurden nicht als Produktduplikate gewertet.

## Findings

${[...cat('A'), ...cat('B')].map((item) => `
### ${item.finding_id} – ${item.title}

- Knoten: ${item.affected_nodes.map((id) => `\`${id}\``).join(', ')}
- Möglicher kanonischer Zielknoten: \`${item.preferred_possible_canonical}\`
- Gemeinsamkeiten: ${item.commonalities}
- Unterschiede: ${item.differences}
- Einzigartige Inhalte: ${item.unique_content}
- Merge-Risiko: ${item.merge_risk}
- Confidence/Priorität: ${item.confidence} / ${item.priority}
- Vorschlag: ${item.proposed_action}
`).join('\n')}

## Review-Regeln

- Vor einem späteren Merge sind Kinder, Relationen, Szenario-/Lernreferenzen, Quellen, Aliase, Legacy-Kontext und persönliche Daten zu prüfen.
- Eine Original-ID darf nicht stillschweigend verschwinden; ein dauerhaftes old-ID-zu-canonical-ID-Mapping wäre Pflicht.
- Bei parallelen Lernpfaden ist Konsolidierung häufig riskanter als bei leeren, identischen Produktknoten.
`);

write('hierarchy-audit-v2.4.md', `
# Azure Digital Brain V2.4 – Hierarchy Audit

${statusNote}

## Findings

${cat('D').map((item) => `
### ${item.finding_id} – ${item.title}

- Betroffene IDs: ${item.affected_nodes.map((id) => `\`${id}\``).join(', ')}
- Aktuell: ${item.current_paths.join(' / ')}
- Vorgeschlagener Zielkontext: ${item.suggested_parent_path}
- Begründung: ${item.reasoning}
- Confidence/Priorität: ${item.confidence} / ${item.priority}
- Review-Aktion: ${item.proposed_action}
`).join('\n')}

## Muster

- Historische Mindmap-Pfade mischen Produkt-, Lern-, Prüfungs- und Architekturperspektiven.
- Hochwertige angereicherte Knoten können trotzdem an einem historisch ungünstigen Ort liegen.
- Jede spätere Verschiebung ist Class C und benötigt Referenzprüfung, Backup und explizite Freigabe.
`);

write('legacy-fragment-audit-v2.4.md', `
# Azure Digital Brain V2.4 – Legacy & Fragment Audit

${statusNote}

## Kategorien C, E, F und H

${findingTable([...cat('C'), ...cat('E'), ...cat('F'), ...cat('H')])}

## Konservative Bewertung

- Persönlich formulierte Merksätze und Analogien können lernwirksam sein und werden nicht als Abfall behandelt.
- Kurze Knoten sind nicht automatisch schlecht. Ein Finding entstand nur bei zusätzlichem Signal: paralleler Produktknoten, reines Feldlabel, Asset-Link, unklare Abkürzung oder fehlender eigenständiger Scope.
- Legacy-Begriffe bleiben als historische Aliase wertvoll. Current-State-Quellen begründen höchstens einen Review, nie eine automatische Entfernung.
- Kategorie H bewahrt die ursprüngliche Bedeutung, wenn Automation sie nicht sicher bestimmen kann.

## Offizielle Current-State-Quellen

${cat('E').map((item) => `- ${item.finding_id}: [${item.title}](${item.official_source})`).join('\n')}
`);

const high = findings.filter((item) => item.confidence === 'high');
write('review-package-v2.4.md', `
# Azure Digital Brain V2.4 – Review Package

${statusNote}

## Executive Review Queue

- Gesamtfindings: **${audit.summary.total_findings}**
- High Confidence: **${high.length}**
- P1: **${audit.summary.by_priority.P1}**
- Human Context Required: **${audit.summary.human_context_required}**
- Awaiting Review: **${audit.summary.awaiting_review}**

## Empfohlene Review-Reihenfolge

1. P1 + High Confidence: Retirement, klare Duplikate und zentrale Hierarchieprobleme.
2. Kategorie H: ursprünglichen Owner-Kontext sichern, bevor spätere Bereinigung geplant wird.
3. Knowledge Gaps: fachlichen Scope und gewünschte Knotengranularität freigeben oder ablehnen.
4. Fragmente/Analogien: Lernwert gegen Navigationskomplexität abwägen.

## High-Confidence Findings

${findingTable(high)}

## Alle Human-Context-Required-Findings

${cat('H').map((item) => `
### ${item.finding_id} – ${item.title}

- IDs: ${item.affected_nodes.map((id) => `\`${id}\``).join(', ')}
- Kontextproblem: ${item.reasoning}
- Evidenz: ${item.evidence.join('; ')}
- Erforderliche Entscheidung: ${item.proposed_action}
`).join('\n')}

## Cluster

${table(['Cluster', 'Findings', 'Gemeinsame Review-Aktion'], audit.clusters.map((cluster) => [cluster.cluster_id, cluster.finding_count, cluster.common_review_action]))}

## Cleanup Proposal Summary

- Phase 1 (nur nach Freigabe): Retirement- und Terminologiehinweise aktualisieren, ohne IDs zu entfernen.
- Phase 2 (separater Class-C/D-Change): Duplikate feldweise vergleichen, Mapping und Referenzmigration entwerfen.
- Phase 3 (separater Class-C-Change): Hierarchieverschiebungen als navigationsbezogene Migration planen.
- Phase 4 (Class-B-Proposals): fehlende Architekturbegriffe einzeln genehmigen oder ablehnen.
- Phase 5: bestätigte Muster als Detection Rules vorschlagen; weiterhin ohne automatische Bereinigung.

Keine dieser Phasen ist durch V2.4 freigegeben.
`);

write('rule-candidates-v2.4.md', `
# Azure Digital Brain V2.4 – Rule Candidates

${statusNote}

Keine Regel ist aktiviert. Jede Kandidatenregel erkennt und priorisiert höchstens; sie verändert niemals Daten.

${audit.rule_candidates.map((rule) => `
## ${rule.id} – ${rule.title}

- Scope: ${rule.scope}
- Logik: ${rule.logic}
- Getestet gegen: ${rule.tested_against}
- Ergebnis/Grenzen: ${rule.result}
- Aktivierung: ${rule.activation}
`).join('\n')}

## Promotion-Prozess

Detection Rule → mehrfach bestätigte Findings → Rule Proposal → Human Approval → aktive Quality Rule. Auch eine aktive Regel bleibt nicht-destruktiv.
`);

console.log(`Generated V2.4 reports from ${findings.length} findings.`);
