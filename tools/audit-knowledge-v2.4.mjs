#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const canonical = path.join(root, 'data', 'canonical');
const auditDir = path.join(root, 'data', 'audit');
const read = (name) => JSON.parse(fs.readFileSync(path.join(canonical, name), 'utf8'));
const nodeDoc = read('nodes.json');
const relationDoc = read('relations.json');
const sourceDoc = read('sources.json');
const scenarioDoc = read('scenarios.json');
const learningDoc = read('learning-framework.json');
const nodes = nodeDoc.nodes;
const byId = new Map(nodes.map((node) => [node.id, node]));

function nodePath(id) {
  const result = [];
  let node = byId.get(id);
  const seen = new Set();
  while (node && !seen.has(node.id)) {
    seen.add(node.id);
    result.unshift(node.title);
    node = node.parent ? byId.get(node.parent) : null;
  }
  return result.join(' > ');
}

function contentSummary(id) {
  const node = byId.get(id);
  if (!node) return null;
  return {
    id,
    title: node.title,
    path: nodePath(id),
    children: node.children.length,
    relations: node.relations.length,
    sources: node.sources.length,
    content_fields: {
      simple: Boolean(node.description?.simple),
      technical: Boolean(node.description?.technical),
      architecture: Boolean(node.description?.architecture),
      why_important: Boolean(node.why_important),
      examples: node.examples?.length || 0,
      merksatz: Boolean(node.merksatz),
      analogy: Boolean(node.analogy),
    },
  };
}

const categoryNames = {
  A: 'Sicheres Duplikat',
  B: 'Wahrscheinliches Duplikat',
  C: 'Legacy / persönliche Erinnerung',
  D: 'Falsche/fragwürdige Hierarchie',
  E: 'Veraltet',
  F: 'Zu granular / Fragment',
  G: 'Fehlender wichtiger Knoten',
  H: 'Unklar / Human Context Required',
};

const findings = [];
let serial = 1;
function add(category, affectedNodes, title, details = {}) {
  const item = {
    finding_id: `QF-2026-${String(serial++).padStart(4, '0')}`,
    category,
    category_name: categoryNames[category],
    title,
    affected_nodes: affectedNodes,
    reasoning: details.reasoning || '',
    evidence: details.evidence || [],
    confidence: details.confidence || 'medium',
    priority: details.priority || 'P2',
    cluster_id: details.cluster_id || null,
    proposed_action: details.proposed_action || 'Human Review; keine automatische Änderung.',
    status: details.status || (category === 'H' || category === 'A' ? 'awaiting_review' : 'detected'),
    human_decision: null,
    decision_date: null,
    decision_owner: null,
    resulting_rule: null,
    node_context: affectedNodes.map(contentSummary).filter(Boolean),
  };
  for (const [key, value] of Object.entries(details)) {
    if (!(key in item)) item[key] = value;
  }
  findings.push(item);
}

function duplicate(category, ids, title, preferred, commonalities, differences, uniqueContent, mergeRisk, confidence = 'high', priority = 'P1', cluster = 'CL-DUPLICATES') {
  add(category, ids, title, {
    reasoning: `${commonalities} Die Knoten bleiben unverändert und benötigen einen feldweisen Human Review.`,
    evidence: ids.map((id) => `${id}: ${nodePath(id)}`),
    confidence,
    priority,
    cluster_id: cluster,
    proposed_action: `Möglichen kanonischen Zielknoten ${preferred} prüfen; einzigartige Inhalte und alle Referenzen vor einer späteren Merge-Entscheidung sichern.`,
    preferred_possible_canonical: preferred,
    commonalities,
    differences,
    unique_content: uniqueContent,
    merge_risk: mergeRisk,
  });
}

// A – strong same-concept candidates. No merge is performed.
duplicate('A', ['azure-0005', 'azure-0265'], 'Availability Set doppelt modelliert', 'azure-0005', 'Beide Knoten benennen dasselbe Azure-Verfügbarkeitskonzept.', 'azure-0005 ist vollständig angereichert; azure-0265 ist ein historischer Kurzast mit eigenem Analogie-Kind.', 'Die Analogie unter azure-0265 muss bei einer späteren Entscheidung erhalten oder bewusst archiviert werden.', 'medium');
duplicate('A', ['azure-0591', 'azure-0709'], 'RA-GRS doppelt modelliert', 'azure-0591', 'Titel und Redundanzkonzept sind identisch.', 'azure-0591 besitzt fachlichen Kontext; azure-0709 ist ein sehr kurzer Knoten in einer parallelen Storage-Struktur.', 'Kein erkennbarer einzigartiger Fachinhalt im zweiten Knoten; Pfadkontext bleibt historisch relevant.', 'low');
duplicate('A', ['azure-0594', 'azure-0711'], 'RA-GZRS doppelt modelliert', 'azure-0594', 'Titel und Redundanzkonzept sind identisch.', 'azure-0594 besitzt fachlichen Kontext; azure-0711 ist ein sehr kurzer Knoten in einer parallelen Storage-Struktur.', 'Kein erkennbarer einzigartiger Fachinhalt im zweiten Knoten; Pfadkontext bleibt historisch relevant.', 'low');
duplicate('A', ['azure-0601', 'azure-0714'], 'Azure File Sync doppelt modelliert', 'azure-0601', 'Beide Knoten bezeichnen Azure File Sync.', 'azure-0601 ist angereichert und verknüpft; azure-0714 ist ein Kurzfragment im parallelen Storage-Ast.', 'Der historische Pfad des Kurzfragments bleibt als Herkunftskontext relevant.', 'low');
duplicate('A', ['azure-0605', 'azure-0715'], 'AzCopy doppelt modelliert', 'azure-0605', 'Beide Knoten bezeichnen dasselbe Kommandozeilenwerkzeug.', 'azure-0605 besitzt Unterpunkte; azure-0715 ist ein leerer Kurzast.', 'Unterknoten und ursprüngliche Position von azure-0605 dürfen später nicht verloren gehen.', 'low');
duplicate('A', ['azure-0609', 'azure-0716'], 'Azure Storage Explorer doppelt modelliert', 'azure-0609', 'Beide Knoten bezeichnen dasselbe Verwaltungswerkzeug.', 'azure-0609 besitzt Unterpunkte; azure-0716 ist ein paralleler Kurzast.', 'Unterknoten und ursprünglicher Kontext müssen erhalten bleiben.', 'low');
duplicate('A', ['azure-0638', 'azure-0721'], 'Azure Data Box doppelt modelliert', 'azure-0638', 'Beide Knoten bezeichnen Azure Data Box.', 'azure-0638 ist angereichert; azure-0721 ist ein knapper paralleler Knoten.', 'Migrationskontext beider Pfade muss erhalten bleiben.', 'low');
duplicate('A', ['azure-0645', 'azure-0722'], 'Azure Migrate doppelt modelliert', 'azure-0645', 'Beide Knoten bezeichnen Azure Migrate.', 'azure-0645 ist vollständig angereichert; azure-0722 ist ein knapper paralleler Knoten.', 'azure-0645 besitzt Quellen, Beziehungen und Kinder; alle Referenzen wären später zu prüfen.', 'high');
duplicate('A', ['azure-0648', 'azure-0738'], 'Azure Database Migration Service doppelt modelliert', 'azure-0738', 'Beide Knoten bezeichnen denselben Migrationsdienst.', 'azure-0738 ist angereichert und referenziert; azure-0648 liegt als Kurzpunkt im Azure-Migrate-Ast.', 'Der Kontext als Teil eines Migrationsablaufs ist in azure-0648 einzigartig.', 'medium');
duplicate('A', ['azure-0039', 'azure-1022'], 'Management Groups doppelt modelliert', 'azure-1022', 'Beide Knoten erklären die Management-Group-Hierarchie.', 'azure-1022 ist vollständig angereichert, liegt aber unter dem Pricing-/Subscription-Ast; azure-0039 ist kürzer und steht im Governance-Ast.', 'Der Governance-Pfad von azure-0039 und die reichen Inhalte/Relationen von azure-1022 sind jeweils einzigartig.', 'high');
duplicate('A', ['azure-0292', 'azure-0962'], 'Azure Policy doppelt modelliert', 'azure-0962', 'Beide Knoten stehen für Azure Policy als Governance-Kontrolle.', 'azure-0962 ist umfassend angereichert; azure-0292 ist ein knapper Funktionspunkt unter ARM.', 'Der ARM-Funktionskontext von azure-0292 ist einzigartig.', 'medium');
duplicate('A', ['azure-0571', 'azure-0677'], 'Blob Storage doppelt modelliert', 'azure-0571', 'Beide Knoten repräsentieren Blob Storage.', 'azure-0571 ist angereichert und verknüpft; azure-0677 führt einen eigenständigen ausführlichen Lernast.', 'Die komplette Unterstruktur von azure-0677 enthält einzigartige Erklärschritte und darf nicht stillschweigend verloren gehen.', 'high');
duplicate('A', ['azure-0616', 'azure-0717'], 'Data Lake Storage doppelt modelliert', 'azure-0616', 'Beide Knoten repräsentieren Azure Data Lake Storage.', 'azure-0616 ist angereichert; azure-0717 ist ein Kurzpunkt in einer parallelen Übersicht.', 'Der parallele Übersichtskontext bleibt Herkunftsinformation.', 'low');
duplicate('A', ['azure-0624', 'azure-0718'], 'Queue Storage doppelt modelliert', 'azure-0624', 'Beide Knoten repräsentieren Azure Queue Storage.', 'azure-0624 ist angereichert; azure-0718 ist ein Kurzpunkt.', 'Der parallele Übersichtskontext bleibt Herkunftsinformation.', 'low');
duplicate('A', ['azure-0632', 'azure-0719'], 'Table Storage doppelt modelliert', 'azure-0632', 'Beide Knoten repräsentieren Azure Table Storage.', 'azure-0632 ist angereichert; azure-0719 ist ein Kurzpunkt.', 'Der parallele Übersichtskontext bleibt Herkunftsinformation.', 'low');
duplicate('A', ['azure-0654', 'azure-0724'], 'Cosmos DB doppelt modelliert', 'azure-0724', 'Beide Knoten bezeichnen Azure Cosmos DB/NoSQL.', 'azure-0724 ist angereichert; azure-0654 dient als Zielsystem-Beispiel in einem tiefen Migrationspfad.', 'Der Migrationsziel-Kontext von azure-0654 ist einzigartig.', 'medium');

// B – probable overlap where scope or path semantics may justify both nodes.
duplicate('B', ['azure-0007', 'azure-0244', 'azure-0267'], 'Availability Zones in drei Lernkontexten', 'azure-0007', 'Alle drei Knoten behandeln Availability Zones.', 'Die Knoten tragen unterschiedliche Detail-, Architektur- und Analogie-Kontexte.', 'Unterknoten von azure-0244 sowie die Analogie unter azure-0267 sind eigenständig.', 'high', 'medium');
duplicate('B', ['azure-0215', 'azure-0351'], 'Azure App Services / Azure App Service', 'azure-0351', 'Beide Titel und Inhalte verweisen auf App Service.', 'azure-0215 ist eine kurze PaaS-Einordnung; azure-0351 ist der angereicherte Produktknoten.', 'Die PaaS-Modell-Einordnung ist als Kontext eigenständig.', 'medium', 'medium');
duplicate('B', ['azure-0254', 'azure-0269'], 'Region Pairs / Region Pair', 'azure-0254', 'Beide Knoten erklären Azure-Regionspaare.', 'Ein Knoten ist ein strukturierter Ast, der andere ein knapper Vergleichspunkt.', 'Vergleichs- und Analogieinhalte im zweiten Pfad können lernrelevant sein.', 'medium', 'medium');
duplicate('B', ['azure-0597', 'azure-0713'], 'SMB-Protokoll / SMB Protocol', 'azure-0597', 'Beide Knoten benennen SMB im Azure-Files-Kontext.', 'Sprache und Granularität unterscheiden sich; beide sind knapp.', 'Der englische Titel kann als Suchalias statt als eigener Knoten sinnvoll sein, ist aber nicht automatisch redundant.', 'medium', 'medium');
duplicate('B', ['azure-0566', 'azure-0657'], 'Zwei Azure-Storage-Einstiege', 'azure-0566', 'Beide Äste strukturieren Storage-Wissen und teilen zahlreiche Konzepte.', 'Der erste Ast ist fachlich angereichert; der zweite bewahrt eine ausführliche ursprüngliche Lernstruktur.', 'Die gesamte zweite Hierarchie enthält viele einzigartige Lern- und Analogieelemente.', 'high', 'medium');
duplicate('B', ['azure-0442', 'azure-0864'], 'VNet-Konzept in Core- und Security-Kontext', 'azure-0442', 'Beide Bereiche modellieren Netzwerkgrenzen und Segmentierung rund um Virtual Network.', 'azure-0442 ist der eigentliche VNet-Produktknoten; azure-0864 ist ein Security-orientierter Segmentierungskontext.', 'Security-Sicht darf nicht in einer Produktkonsolidierung verloren gehen.', 'high', 'low');

// C – legacy/reminder/analogy clusters, grouped rather than generating hundreds of weak findings.
add('C', ['azure-0310'], 'Persönlich formulierte Idempotenz-Eselsbrücke', {reasoning: 'Der Knoten besteht aus einer umgangssprachlichen Erinnerung und dupliziert denselben Satz in mehreren Inhaltsfeldern.', evidence: [nodePath('azure-0310')], confidence: 'high', priority: 'P3', cluster_id: 'CL-PERSONAL-REMINDERS', proposed_action: 'Als Lernnotiz/Analogie kennzeichnen oder bei späterer Freigabe in den kanonischen Idempotenz-Knoten integrieren; Originaltext archivieren.'});
add('C', ['azure-0050'], 'Frageform als kanonischer Fachknoten', {reasoning: '„Terraform statt ARM/Bicep – wann?“ ist eher eine Lern- oder Entscheidungsfrage als ein stabil benannter Fachknoten.', evidence: [nodePath('azure-0050'), 'Der Knoten besitzt drei fachliche Kinder und darf daher nicht als bloßer Reminder gelöscht werden.'], confidence: 'medium', priority: 'P2', cluster_id: 'CL-PERSONAL-REMINDERS', proposed_action: 'Human Review, ob die Frage als Lernfrage erhalten oder später in einen neutral benannten Vergleichsknoten überführt werden soll.'});
add('C', ['azure-0982'], 'Tags als persönliche Frageform', {reasoning: 'Der Titel ist eine prüfungsartige Frage/Eselsbrücke und kein neutraler Fachbegriff.', evidence: [nodePath('azure-0982')], confidence: 'high', priority: 'P3', cluster_id: 'CL-PERSONAL-REMINDERS'});
add('C', ['azure-0366', 'azure-0386'], 'Doppelte Koch-Analogie im App-Service-Ast', {reasoning: 'Derselbe Analogiegedanke erscheint in zwei tiefen Lernpfaden.', evidence: ['Beide Texte verwenden die Gemeinschaftsküche/Abwasch-Metapher.'], confidence: 'high', priority: 'P3', cluster_id: 'CL-ANALOGIES', proposed_action: 'Späteren Review auf einmalige Analogie plus Verweise prüfen; keine automatische Änderung.'});
add('C', ['azure-0374', 'azure-0382'], 'Doppelte Wohnblock/Hausmeister-Analogie', {reasoning: 'Der identische Analogie-Titel wird in zwei benachbarten App-Service-Pfaden geführt.', evidence: ['Exakter normalisierter Titel in beiden Knoten.'], confidence: 'high', priority: 'P3', cluster_id: 'CL-ANALOGIES'});
add('C', ['azure-0392', 'azure-0406'], 'Doppelte Burger-Skalierungsanalogie', {reasoning: 'Die gleiche Analogie zur horizontalen Skalierung ist mehrfach als eigener Knoten vorhanden.', evidence: ['Exakter normalisierter Titel in beiden Knoten.'], confidence: 'high', priority: 'P3', cluster_id: 'CL-ANALOGIES'});
add('C', ['azure-0190', 'azure-0823'], 'Historische Azure-AD-Bezeichnung in Erinnerungstexten', {reasoning: 'Die Texte führen „Azure AD / Entra ID“ parallel. Das kann für ältere Lernunterlagen nützlich sein, ist aber als aktuelle Terminologie prüfbedürftig.', evidence: [nodePath('azure-0190'), nodePath('azure-0823')], confidence: 'medium', priority: 'P3', cluster_id: 'CL-LEGACY-NAMING', proposed_action: 'Aktuelle Bezeichnung Microsoft Entra ID priorisieren und Azure AD nur als dokumentierten historischen Alias erhalten, falls freigegeben.'});
add('C', ['azure-0959', 'azure-0960'], 'Azure ATP als historischer Produktname', {reasoning: 'Der Elternknoten ist bewusst als Legacy markiert; das aktuelle Produkt ist als Kind dokumentiert.', evidence: ['Microsoft Defender for Identity ist die aktuelle Produktlinie.', 'https://learn.microsoft.com/en-us/defender-for-identity/what-is'], confidence: 'high', priority: 'P2', cluster_id: 'CL-LEGACY-NAMING', proposed_action: 'Legacy-Alias erhalten, aber Navigation langfristig auf den aktuellen Produktnamen ausrichten; nur nach Human Review.'});

// D – hierarchy concerns; each includes current and suggested path.
function hierarchy(ids, title, suggested, reasoning, confidence = 'medium', priority = 'P2') {
  add('D', ids, title, {reasoning, evidence: ids.map((id) => `Aktuell: ${nodePath(id)}`), confidence, priority, cluster_id: 'CL-HIERARCHY', proposed_action: `Vorgeschlagenen Zielkontext fachlich prüfen: ${suggested}. Keine Verschiebung in V2.4.`, current_paths: ids.map(nodePath), suggested_parent_path: suggested});
}
hierarchy(['azure-1022'], 'Management Groups unter Pricing/Subscriptions', 'Azure > Governance > Resource organization > Management Groups', 'Der Knoten ist ein Governance-Scope oberhalb von Subscriptions; seine aktuelle Einordnung im Pricing-Hauptast erschwert fachliche Navigation.', 'high', 'P1');
hierarchy(['azure-0645', 'azure-0722'], 'Azure Migrate unter Azure Storage', 'Azure > Migration and modernization > Azure Migrate', 'Azure Migrate bewertet und migriert Server, Anwendungen und Datenbanken und ist nicht auf Storage beschränkt.', 'high', 'P1');
hierarchy(['azure-0738'], 'Database Migration Service im allgemeinen Datenbankast', 'Azure > Migration and modernization > Database migration', 'Der Dienst ist ein Migrationswerkzeug; die aktuelle Nähe zu produktiven Datenbankdiensten kann den Zweck verschleiern.', 'medium');
hierarchy(['azure-0979'], 'Monitoring/Operations unter Security-Hauptbereich', 'Azure > Management and Governance > Monitoring, Observability and Operations', 'Monitoring ist querschnittlich und nicht ausschließlich Security. Der Knoten selbst beschreibt einen vollständigen Operations-Lifecycle.', 'high', 'P1');
hierarchy(['azure-0766'], 'IoT Hub als Kind eines Data-Lake-Analytics-Beispiels', 'Azure > Integration / IoT > IoT Hub oder als reines Beispielfeld beim Analytics-Knoten', 'IoT Hub ist ein eigenständiger Integrationsdienst; hier wird er als tiefer Analogie-/Flow-Knoten unter einem stillgelegten Dienst geführt.', 'high');
hierarchy(['azure-0803'], 'Azure Lab Services unter Azure DevOps', 'Azure > Specialized services > Lab environments', 'Lab Services ist kein Azure-DevOps-Unterdienst; zusätzlich ist der Dienst zur Einstellung angekündigt.', 'high');
hierarchy(['azure-0336'], 'Service Fabric pauschal als Legacy/optional unter Compute', 'Azure > Compute > Container and distributed systems > Service Fabric', 'Der Dienst ist weiterhin dokumentiert; die Bezeichnung „Legacy“ ist eine Bewertung und sollte getrennt vom neutralen Produktknoten geführt werden.', 'medium');
hierarchy(['azure-0948'], 'Azure Information Protection im Security-Tool-Ast ohne Purview-Kontext', 'Microsoft Security > Data security and compliance > Microsoft Purview Information Protection', 'Der historische Azure-Produktname kann ohne aktuellen Purview-Kontext fachlich missverständlich sein.', 'medium', 'P3');

// E – current-state checks use official Microsoft sources and remain proposals.
function outdated(ids, title, reasoning, url, proposed, priority = 'P1', confidence = 'high') {
  add('E', ids, title, {reasoning, evidence: [url, ...ids.map(nodePath)], confidence, priority, cluster_id: 'CL-OUTDATED', proposed_action: proposed, official_source: url, verified_on: '2026-08-13'});
}
outdated(['azure-0764', 'azure-0765', 'azure-0766'], 'Azure Data Lake Analytics ist eingestellt', 'Microsoft dokumentiert die Einstellung zum 29. Februar 2024; der aktuelle Ast präsentiert den Dienst ohne sichtbaren Retirement-Hinweis.', 'https://learn.microsoft.com/en-us/sql/integration-services/connection-manager/azure-data-lake-analytics-connection-manager?view=sql-server-ver17', 'Als historischen/retired Dienst kennzeichnen und aktuelle Analysealternativen erst nach separater fachlicher Freigabe verlinken.');
outdated(['azure-0803', 'azure-0804'], 'Azure Lab Services wird eingestellt', 'Microsoft kündigt die vollständige Einstellung zum 28. Juni 2027 an; Neukunden können den Dienst bereits nicht mehr beziehen.', 'https://learn.microsoft.com/en-us/azure/lab-services/retirement-guide', 'Retirement-Status und Übergangsbedarf in einem späteren Content-Change ergänzen; keine automatische Entfernung.');
outdated(['azure-0049', 'azure-0972', 'azure-0973'], 'Azure Blueprints Retirement-Zeitplan aktualisieren', 'Microsoft dokumentiert die Einstellung am 31. Januar 2027 mit phasenweisem Beginn am 31. Juli 2026 und empfiehlt Deployment Stacks/Template Specs.', 'https://learn.microsoft.com/en-us/azure/governance/blueprints/overview', 'Historische Inhalte erhalten, Retirement-Datum und aktuelle Migrationsrichtung nach Review ergänzen.');
outdated(['azure-0926'], 'Azure AD B2C Status präzisieren', 'Der Knoten ist grundsätzlich aktuell, aber der Status sollte „für Neukunden nicht mehr kaufbar“ und nicht pauschal „retired“ bedeuten; Bestandskunden werden weiter unterstützt.', 'https://learn.microsoft.com/en-us/azure/active-directory-b2c/faq', 'Formulierung und Zeitbezug regelmäßig verifizieren; External ID als aktuelle Richtung beibehalten.', 'P2');
outdated(['azure-0959'], 'Azure Advanced Threat Protection ist historischer Name', 'Aktuelle Microsoft-Dokumentation führt den Dienst als Microsoft Defender for Identity; der Legacy-Hinweis ist richtig, aber der historische Knoten bleibt prominent.', 'https://learn.microsoft.com/en-us/defender-for-identity/what-is', 'Langfristig aktuellen Produktknoten als Navigationseinstieg prüfen und Legacy-Namen als Alias bewahren.', 'P2');
outdated(['azure-1003', 'azure-1004'], 'Trust Center / Trust Portal Terminologie unklar', 'Zwei sehr knappe Knoten verwenden ähnliche ältere Bezeichnungen, ohne Service Trust Portal oder Quellen zu erläutern.', 'https://learn.microsoft.com/en-us/purview/get-started-with-service-trust-portal', 'Gegen aktuelle Microsoft-Terminologie prüfen; Bedeutung beider historischen Knoten vor jeder Konsolidierung klären.', 'P2', 'medium');
outdated(['azure-0336', 'azure-0346', 'azure-0348'], 'Service Fabric als pauschal Legacy dargestellt', 'Die Inhalte behaupten eine generelle Ablösung durch AKS, während Microsoft Service Fabric weiterhin als Produkt dokumentiert; die konkrete Aussage braucht Scope und Quelle.', 'https://learn.microsoft.com/en-us/azure/service-fabric/service-fabric-overview', 'Pauschale Legacy-Aussage fachlich reviewen und gegebenenfalls als Architektur-Trade-off statt Produktstatus formulieren.', 'P2', 'medium');
outdated(['azure-0948'], 'AIP-Bezeichnung benötigt Purview-Einordnung', '„Azure Information Protection“ ist ohne aktuelle Microsoft-Purview-Information-Protection-Einordnung als eigenständiger aktueller Produktknoten missverständlich.', 'https://learn.microsoft.com/en-us/purview/information-protection', 'Aktuellen Produktkontext und historischen Alias nach fachlicher Prüfung dokumentieren.', 'P2', 'medium');

// F – meaningful fragments, not a blanket length rule.
add('F', ['azure-0706', 'azure-0707', 'azure-0708', 'azure-0710'], 'Redundanz-Akronyme als isolierte Kurzfragmente', {reasoning: 'Die Knoten enthalten nur Akronyme und liegen parallel zu bereits fachlich angereicherten LRS/ZRS/GRS/GZRS-Knoten.', evidence: ['Je Knoten nur Akronym/technische Wiederholung, keine Quellen oder Beziehungen.'], confidence: 'high', priority: 'P2', cluster_id: 'CL-STORAGE-FRAGMENTS', proposed_action: 'Als mögliche Aliase/Navigationseinträge gegen die angereicherten Knoten prüfen; keine automatische Konsolidierung.'});
add('F', ['azure-0704'], 'Eigener Knoten nur für „Merksatz“', {reasoning: 'Der Knoten ist ein strukturelles Feldlabel statt eines Fachkonzepts.', evidence: [nodePath('azure-0704')], confidence: 'high', priority: 'P3', cluster_id: 'CL-GENERIC-CONTAINERS'});
add('F', ['azure-0416', 'azure-0426'], 'Generischer Container „Beschreibung“', {reasoning: 'Die Knoten tragen nur den Feldnamen „Beschreibung“ und verlängern den Pfad ohne eigenständiges Konzept.', evidence: [nodePath('azure-0416'), nodePath('azure-0426')], confidence: 'high', priority: 'P3', cluster_id: 'CL-GENERIC-CONTAINERS'});
add('F', ['azure-0619'], '„Big Data & KI“ als isoliertes Blatt', {reasoning: 'Der Knoten ist eine sehr breite Themenmarke ohne Erklärung, Quelle, Kind oder Beziehung.', evidence: [nodePath('azure-0619')], confidence: 'high', priority: 'P3', cluster_id: 'CL-SHORT-FRAGMENTS'});
add('F', ['azure-0788', 'azure-0781', 'azure-0791'], 'Analogie-Blätter unter Eventdiensten', {reasoning: '„Event-Verteiler“, „Event-Sammelstelle“ und „Echtzeit-Auswertung“ sind Eselsbrücken, aber als eigene Fachknoten modelliert.', evidence: ['Alle drei sind tiefe Blätter ohne Quellen oder Relationen.'], confidence: 'high', priority: 'P3', cluster_id: 'CL-ANALOGY-FRAGMENTS'});
add('F', ['azure-0290'], 'SDK-Analogie als eigener Fachknoten', {reasoning: 'Der Inhalt ist eine Analogie/Begriffsauflösung unter einem API-Pfad, nicht ein Azure-Fachknoten.', evidence: [nodePath('azure-0290')], confidence: 'medium', priority: 'P3', cluster_id: 'CL-ANALOGY-FRAGMENTS'});
add('F', ['azure-0845'], '„Netzwerkfilter“ als eigenes Blatt', {reasoning: 'Der Knoten paraphrasiert die Regelwirkung der Azure Firewall, besitzt aber keinen eigenständigen Scope.', evidence: [nodePath('azure-0845')], confidence: 'medium', priority: 'P3', cluster_id: 'CL-SHORT-FRAGMENTS'});
add('F', ['azure-1006'], '„Dashboard“ als unqualifiziertes Blatt', {reasoning: 'Der Titel bezeichnet ein UI-Element ohne fachliche Erklärung oder Quellenkontext.', evidence: [nodePath('azure-1006')], confidence: 'high', priority: 'P3', cluster_id: 'CL-SHORT-FRAGMENTS'});
add('F', ['azure-0876'], '„Groups NSG“ als unklarer Kurzpunkt', {reasoning: 'Der Knoten reduziert Application Security Groups auf zwei Wörter und besitzt keine Erklärung.', evidence: [nodePath('azure-0876')], confidence: 'high', priority: 'P3', cluster_id: 'CL-SHORT-FRAGMENTS'});
add('F', ['azure-1044'], 'Externer Bildlink als eigener Knoten', {reasoning: 'Ein reiner URL-Titel ist ein Asset-/Quellenverweis und kein stabiler Wissensknoten.', evidence: [nodePath('azure-1044')], confidence: 'high', priority: 'P2', cluster_id: 'CL-ASSET-FRAGMENTS', proposed_action: 'Bildherkunft, Lizenz und dauerhafte lokale/Quellenablage prüfen; nicht automatisch entfernen.'});
add('F', ['azure-1051', 'azure-1052', 'azure-1053', 'azure-1054'], 'CAF-Phasen nur als nummerierte Kurzblätter', {reasoning: 'Die Knoten „#1–#4“ sind Navigationsfragmente ohne eigenständige Erklärung, Quellen oder Beziehungen.', evidence: ['Die Phasen sind als einzelne Blätter vorhanden, aber unvollständig beschrieben.'], confidence: 'high', priority: 'P2', cluster_id: 'CL-CAF-FRAGMENTS'});
add('F', ['azure-0606'], '„CLI-Tool (Kommandozeile)“ als eigenes Blatt', {reasoning: 'Der Knoten ist eine Eigenschaft von AzCopy, kein eigenständiges Fachkonzept.', evidence: [nodePath('azure-0606')], confidence: 'high', priority: 'P3', cluster_id: 'CL-STORAGE-FRAGMENTS'});
add('F', ['azure-0641'], '„Offline-Import nach Azure Storage“ als isoliertes Blatt', {reasoning: 'Der Text ist eine Data-Box-Eigenschaft und könnte als Erklärung statt als Knoten geeigneter sein.', evidence: [nodePath('azure-0641')], confidence: 'medium', priority: 'P3', cluster_id: 'CL-STORAGE-FRAGMENTS'});
add('F', ['azure-0653', 'azure-0654'], 'Migrationsziele als tiefe Produkt-Duplikate', {reasoning: 'Azure SQL Database und Cosmos DB werden als bloße Zielsystem-Blätter unter Azure Migrate erneut modelliert.', evidence: [nodePath('azure-0653'), nodePath('azure-0654')], confidence: 'high', priority: 'P2', cluster_id: 'CL-MIGRATION-FRAGMENTS', proposed_action: 'Spätere semantische Referenzen zu bestehenden Produktknoten prüfen; keine automatische Änderung.'});

// G – missing canonical nodes. Mention in text does not equal a canonical node.
function gap(title, reasoning, source, priority = 'P2', confidence = 'high', related = []) {
  add('G', related, `Fehlender kanonischer Knoten: ${title}`, {reasoning, evidence: [source], confidence, priority, cluster_id: 'CL-KNOWLEDGE-GAPS', proposed_action: `Class-B-Proposal für einen eigenständigen Knoten „${title}“ erstellen; erst nach Human Review und expliziter Freigabe umsetzen.`, proposed_node_title: title, official_source: source, textual_mentions_are_not_nodes: true});
}
gap('Azure Container Apps', 'Container Apps wird in Compute-Texten bewusst erwähnt, aber es existiert kein gleichnamiger kanonischer Produktknoten. Damit fehlt eine zentrale Architekturentscheidung zwischen ACI, Container Apps und AKS.', 'https://learn.microsoft.com/en-us/azure/container-apps/overview', 'P1', 'high', ['azure-0412', 'azure-0415', 'azure-0425']);
gap('Shared Access Signatures (SAS)', 'Storage-Inhalte erwähnen Zugriffskontrollen, aber SAS ist kein eigener kanonischer Knoten. Die Abgrenzung User Delegation SAS, Service SAS und Account SAS ist architektonisch relevant.', 'https://learn.microsoft.com/en-us/azure/storage/common/storage-sas-overview', 'P1', 'high', ['azure-0579']);
gap('Storage Account Access Keys / Shared Key', 'Access Keys und Shared Key fehlen als eigenständiges Konzept, obwohl sie eine zentrale Security- und Migrationsentscheidung gegenüber Microsoft Entra ID darstellen.', 'https://learn.microsoft.com/en-us/azure/storage/common/shared-key-authorization-prevent', 'P1', 'high', ['azure-0579']);
gap('Storage Lifecycle Management', 'Hot/Cool/Archive sind vorhanden, aber der regelbasierte Lifecycle für Tiering und Löschung ist kein eigener kanonischer Knoten.', 'https://learn.microsoft.com/en-us/azure/storage/blobs/lifecycle-management-overview', 'P2', 'high', ['azure-0573']);
gap('Diagnostic Settings', 'Diagnostic Settings werden in Erklärtexten genannt, sind aber kein eigener Knoten. Sie sind die zentrale Routing-Konfiguration für viele Plattformlogs und Metriken.', 'https://learn.microsoft.com/en-us/azure/azure-monitor/essentials/diagnostic-settings', 'P1', 'high', ['azure-0983', 'azure-0985']);
gap('Data Collection Rules', 'DCRs erscheinen nur in Textfeldern. Als eigene Steuerung für Erfassung, Transformation und Routing fehlen sie im Navigationsmodell.', 'https://learn.microsoft.com/en-us/azure/azure-monitor/data-collection/data-collection-rule-overview', 'P2', 'high', ['azure-0983', 'azure-0985']);
gap('Azure Workbooks', 'Workbooks werden erwähnt, besitzen aber keinen kanonischen Knoten für interaktive Visualisierung und Untersuchung.', 'https://learn.microsoft.com/en-us/azure/azure-monitor/visualize/workbooks-overview', 'P2', 'high', ['azure-0979', 'azure-0988']);
gap('Azure Resource Health', 'Service Health ist vorhanden; Resource Health wird nur im Inhalt erwähnt. Die Unterscheidung Plattformereignis versus Zustand einer konkreten Ressource ist lernrelevant.', 'https://learn.microsoft.com/en-us/azure/service-health/resource-health-overview', 'P1', 'high', ['azure-0999']);
gap('Zero Trust', 'Zero Trust wird in Security-Erklärungen genannt, ist aber kein navigierbarer, eigenständiger Architekturgrundsatz.', 'https://learn.microsoft.com/en-us/security/zero-trust/zero-trust-overview', 'P2', 'high', ['azure-0815', 'azure-0821']);
gap('Secure Score', 'Secure Score ist nur Teil von Defender-Texten. Ein eigener Knoten könnte Posture-Messung, Grenzen und Priorisierung erklären.', 'https://learn.microsoft.com/en-us/azure/defender-for-cloud/secure-score-security-controls', 'P2', 'high', ['azure-0934', 'azure-0936']);
gap('Vulnerability Assessment', 'Vulnerability Assessment wird in Workload-Protection-Texten erwähnt, ist aber nicht als eigenständiges Konzept modelliert.', 'https://learn.microsoft.com/en-us/azure/defender-for-cloud/concept-agentless-data-collection', 'P2', 'medium', ['azure-0934']);
gap('Incident Response und Runbooks', 'Incident Response und Runbooks sind in mehreren Architekturtexten erwähnt, aber nicht als eigenständige Operations-Knoten vorhanden. Dadurch fehlt der Übergang von Alert zu verantworteter Reaktion.', 'https://learn.microsoft.com/en-us/azure/well-architected/operational-excellence/incident-response', 'P1', 'high', ['azure-0979', 'azure-0984', 'azure-1000']);

// H – original intent cannot be resolved safely.
add('H', ['azure-0907'], 'Unklarer Knoten „Autentication“', {reasoning: 'Der Tippfehler kann Authentication, einen Oberbegriff oder eine persönliche Kapitelmarke meinen. Ohne Kontext darf weder umbenannt noch mit einem bestehenden Identity-Knoten zusammengeführt werden.', evidence: [nodePath('azure-0907')], confidence: 'low', priority: 'P2', cluster_id: 'CL-HUMAN-CONTEXT', proposed_action: 'Owner klärt die ursprüngliche Bedeutung und entscheidet zwischen Korrektur, Alias, Verknüpfung oder Archivierung.'});
add('H', ['azure-1003', 'azure-1004'], 'Bedeutungsabgrenzung Trust Center / Trust Portal', {reasoning: 'Beide Knoten sind leer und ähnlich benannt. Es ist nicht erkennbar, ob zwei verschiedene Portale, historische Bezeichnungen oder ein Duplikat gemeint sind.', evidence: [nodePath('azure-1003'), nodePath('azure-1004')], confidence: 'low', priority: 'P2', cluster_id: 'CL-HUMAN-CONTEXT', proposed_action: 'Ursprüngliche Quelle/Absicht durch Human Owner klären; bis dahin beide IDs behalten.'});
add('H', ['azure-0336'], 'Bedeutung von „Legacy / optional“ bei Service Fabric', {reasoning: 'Unklar ist, ob „Legacy“ eine persönliche Architekturpräferenz, eine Prüfungsnotiz oder ein behaupteter Produktstatus ist.', evidence: [nodePath('azure-0336')], confidence: 'low', priority: 'P2', cluster_id: 'CL-HUMAN-CONTEXT', proposed_action: 'Owner klärt beabsichtigte Aussage; Microsoft-Produktstatus separat fachlich prüfen.'});
add('H', ['azure-0941'], 'Sentinel-Zuordnung zur Defender-XDR-Suite', {reasoning: 'Die knappe Aussage „part of Microsoft Defender XDR suite“ kann Portal-Integration, Produktzugehörigkeit oder Lizenzierung meinen und ist ohne Kontext riskant.', evidence: [nodePath('azure-0941')], confidence: 'low', priority: 'P2', cluster_id: 'CL-HUMAN-CONTEXT', proposed_action: 'Beabsichtigte Aussage und aktuelle Microsoft-Terminologie durch Security-Owner klären.'});
add('H', ['azure-1018'], 'Unklare Subscription-Option „BizPark“', {reasoning: 'Die Bezeichnung kann ein Tippfehler, historisches Programm oder persönliche Erinnerung sein. Eine sichere fachliche Zuordnung ist aus dem Knoten nicht möglich.', evidence: [nodePath('azure-1018')], confidence: 'low', priority: 'P3', cluster_id: 'CL-HUMAN-CONTEXT', proposed_action: 'Originalkontext durch Owner klären; nicht automatisch korrigieren oder löschen.'});

const scenarioNodeRefs = new Set();
for (const scenario of scenarioDoc.scenarios) {
  for (const item of scenario.component_instances || []) if (item.node_ref) scenarioNodeRefs.add(item.node_ref);
  for (const id of scenario.learning_path || []) scenarioNodeRefs.add(id);
  for (const flow of scenario.architecture_flow || []) for (const id of flow.node_refs || []) scenarioNodeRefs.add(id);
}
const learningNodeRefs = new Set();
for (const learningPath of learningDoc.learning_paths) {
  for (const step of learningPath.steps || []) for (const id of step.referenced_nodes || []) learningNodeRefs.add(id);
}
const canonicalSourceUsage = new Map(sourceDoc.sources.map((source) => [source.id, 0]));
for (const node of nodes) for (const sourceId of node.sources || []) canonicalSourceUsage.set(sourceId, (canonicalSourceUsage.get(sourceId) || 0) + 1);
for (const relation of relationDoc.relations) for (const sourceId of relation.sources || []) canonicalSourceUsage.set(sourceId, (canonicalSourceUsage.get(sourceId) || 0) + 1);
const sourceUrls = new Map();
for (const source of sourceDoc.sources) sourceUrls.set(source.url, [...(sourceUrls.get(source.url) || []), source.id]);

const depths = {};
for (const node of nodes) {
  let depth = 0;
  let current = node;
  const seen = new Set();
  while (current.parent && !seen.has(current.id)) {
    seen.add(current.id);
    current = byId.get(current.parent);
    depth += 1;
  }
  depths[depth] = (depths[depth] || 0) + 1;
}

const countBy = (key) => Object.fromEntries([...new Set(findings.map((f) => f[key]))].filter(Boolean).sort().map((value) => [value, findings.filter((f) => f[key] === value).length]));
const clusters = [...new Set(findings.map((f) => f.cluster_id).filter(Boolean))].sort().map((clusterId) => {
  const members = findings.filter((f) => f.cluster_id === clusterId);
  return {
    cluster_id: clusterId,
    finding_count: members.length,
    finding_ids: members.map((f) => f.finding_id),
    common_review_action: members[0].proposed_action,
  };
});

const result = {
  schema_version: '2.4-audit-1.0',
  title: 'Azure Digital Brain Knowledge Base Audit V2.4',
  generated_at: new Date().toISOString(),
  operating_mode: 'non-destructive scan and proposal only',
  base_version: '2.3',
  release_version: '2.4',
  status: 'awaiting_human_review',
  coverage: {
    nodes_scanned: nodes.length,
    nodes_expected: 1058,
    nodes_complete: nodes.length === 1058,
    node_fields_scanned: ['id', 'title', 'domain', 'category', 'subcategory', 'description.simple', 'description.technical', 'description.architecture', 'why_important', 'parent', 'children', 'tags', 'aliases', 'relations', 'examples', 'merksatz', 'analogy', 'sources', 'metadata', 'origin', 'legacy'],
    hierarchy_depth_distribution: depths,
    relations_scanned: relationDoc.relations.length,
    sources_scanned: sourceDoc.sources.length,
    source_audit: {
      valid_http_url_format: sourceDoc.sources.filter((source) => /^https?:\/\//.test(source.url)).length,
      invalid_url_format: sourceDoc.sources.filter((source) => !/^https?:\/\//.test(source.url)).length,
      duplicate_urls: [...sourceUrls.values()].filter((ids) => ids.length > 1).length,
      unused_canonical_sources: [...canonicalSourceUsage.values()].filter((count) => count === 0).length,
      unresolved_node_or_relation_source_references: [...canonicalSourceUsage.keys()].filter((id) => !sourceDoc.sources.some((source) => source.id === id)).length,
    },
    scenario_referenced_nodes: scenarioNodeRefs.size,
    learning_referenced_nodes: learningNodeRefs.size,
    personal_notes: {audited: false, reason: 'Browser-local personal data is outside the canonical project files and was not inspected.'},
  },
  summary: {
    total_findings: findings.length,
    by_category: countBy('category'),
    by_confidence: countBy('confidence'),
    by_priority: countBy('priority'),
    awaiting_review: findings.filter((f) => f.status === 'awaiting_review').length,
    human_context_required: findings.filter((f) => f.category === 'H').length,
    cluster_count: clusters.length,
    official_sources_checked_for_current_state_findings: new Set(findings.map((finding) => finding.official_source).filter(Boolean)).size,
  },
  clusters,
  findings,
  rule_candidates: [
    {id: 'RC-001', title: 'Exact product title with distinct IDs', scope: 'Detection only', logic: 'Normalize product titles, exclude generic labels, then require same-concept evidence and fieldwise comparison.', tested_against: '1058 canonical nodes', result: 'Useful for Storage tool/redundancy duplicates; generic labels create false positives and must be excluded.', activation: 'not_active_requires_human_approval'},
    {id: 'RC-002', title: 'Deprecated service source check', scope: 'Detection only', logic: 'Flag only when a current official Microsoft source explicitly states retirement/end-of-sale or renaming.', tested_against: 'Blueprints, Data Lake Analytics, Lab Services, B2C, Defender for Identity', result: 'High precision with official source; requires review of exact wording and date.', activation: 'not_active_requires_human_approval'},
    {id: 'RC-003', title: 'Structural field-label node', scope: 'Detection only', logic: 'Flag exact generic titles such as Beschreibung or Merksatz only when they add no independent content and are used as hierarchy containers.', tested_against: 'Generic label groups in 1058 nodes', result: 'Useful but must preserve child content and original learning order.', activation: 'not_active_requires_human_approval'},
    {id: 'RC-004', title: 'Canonical gap despite text mention', scope: 'Proposal only', logic: 'A text mention does not count as a navigable canonical node; require architectural significance plus official source.', tested_against: 'Known V2.4 gap checklist', result: 'Identified 12 candidates; every creation remains Class B and requires explicit approval.', activation: 'not_active_requires_human_approval'},
  ],
  safeguards: {
    automatic_changes: false,
    node_deletions: 0,
    node_moves: 0,
    node_merges: 0,
    node_creations: 0,
    hierarchy_changes: 0,
    relation_changes: 0,
    source_changes: 0,
    scenario_changes: 0,
    learning_changes: 0,
  },
};

fs.mkdirSync(auditDir, { recursive: true });
fs.writeFileSync(path.join(auditDir, 'knowledge-audit-v2.4.json'), `${JSON.stringify(result, null, 2)}\n`);
console.log(JSON.stringify(result.summary, null, 2));
