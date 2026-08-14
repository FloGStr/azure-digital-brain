# Azure Digital Brain V3.1

Die aktuelle Version implementiert Semantic Navigation & Knowledge Linking auf Basis der unveränderten V2.4-Wissensstruktur. Einstieg, Bedienung, Build und QA sind in `README-V3.1.md` dokumentiert. Der Änderungsbericht liegt unter `reports/semantic-navigation-v3.1.md`.

`START.html` kann direkt per Doppelklick geöffnet werden; Installation und Server sind nicht erforderlich.

---

## Historische Projektdokumentation bis V1.8

Offline-Wissensplattform mit hierarchischer Mindmap, semantischem Knowledge Graph und einer stabilisierten, KI-fähigen Wissensarchitektur.

## Start auf dem Mac

1. `START.html` doppelklicken.
2. Safari, Chrome oder Firefox auswählen.
3. Es ist keine Installation und kein Server erforderlich.

## Technische Basis V1.1

- eine einzige kanonische Wissensquelle unter `data/canonical/`
- 1.058 vollständig erhaltene Originalknoten und stabile IDs
- 27 migrierte semantische Beziehungen
- zentrales Register mit gerichteten Beziehungstypen und Gegenrichtungen
- drei vorbereitete Erklärungsebenen: einfach, technisch, Architektur
- klare Trennung von Fachwissen und persönlichen Daten
- versioniertes Benutzerprofil mit Export und Import
- validierter Runtime-Build, der die kanonischen Daten niemals verändert
- prüfbarer Vorschlagsstatus für eine spätere KI-Integration

## Networking-Pilot V1.2

V1.2 verändert die stabile Architektur nicht. Der Pilot reichert 33 vorhandene Networking-Knoten mit einfachen, technischen und architektonischen Erklärungen, Beispielen, ausgewählten Merksätzen/Analogien und offiziellen Microsoft-Quellen an. 29 neue geprüfte Beziehungen ergänzen den Knowledge Graph; insgesamt enthält das Paket 56 Beziehungen und 28 Quellen.

Die Anreicherung ist in `tools/enrich-networking-v1.2.mjs` reproduzierbar dokumentiert. Der Ergebnis- und Qualitätsbericht liegt unter `reports/networking-enrichment-v1.2.md`.

## Content Standard und Identity-Pilot V1.3

V1.3 führt mit `reports/content-standard-v1.md` einen verbindlichen Redaktionsstandard ein. 36 vorhandene Identity-Knoten wurden danach mit 108 Erklärungstexten, realen Beispielen, Merksätzen und offiziellen Microsoft-Quellen angereichert. 35 neue Identity-Beziehungen erweitern den Graph auf insgesamt 91 Beziehungen.

Der Identity-Pilot ist in `tools/enrich-identity-v1.3.mjs` reproduzierbar. Auswertung, QA und Vergleich mit Networking stehen unter `reports/identity-enrichment-v1.3.md`.

## Compute & Architecture Enrichment Pilot V1.4

V1.4 modelliert Compute als Architektur-Brücke zu Networking, Identity, Security und Monitoring. 38 vorhandene Knoten wurden nach Content Standard V1.0 mit 114 Erklärungsebenen, Praxisbeispielen und Merksätzen angereichert. 34 neue geprüfte Beziehungen erweitern den Graph auf 125 Beziehungen; 24 zusätzliche Microsoft-Learn-Quellen erhöhen die Quellenbasis auf 73.

Es wurden keine Knoten ergänzt. Da V1.3 keinen eigenständigen Azure-Container-Apps-Knoten enthält, dokumentiert der Pilot diese Scope-Lücke, statt die bestehende Hierarchie umzudeuten. Die reproduzierbare Anreicherung liegt in `tools/enrich-compute-v1.4.mjs`, der vollständige Pilotbericht in `reports/compute-enrichment-v1.4.md`.

## Governance & Management Enrichment Pilot V1.5

V1.5 ergänzt Governance als vierte Architekturperspektive: Wie werden Azure-Ressourcen über viele Umgebungen kontrolliert, standardisiert und überwacht? 27 vorhandene Governance-Knoten wurden nach Content Standard V1.0 mit 81 Erklärungsebenen, Praxisbeispielen und Merksätzen angereichert. 34 neue Beziehungen erweitern den Knowledge Graph auf 159 Beziehungen; 22 zusätzliche offizielle Quellen erhöhen die Quellenbasis auf 95.

Bestehende Networking-, Identity- und Compute-Inhalte wurden nicht überschrieben. Fehlende Einzelknoten für Policy Definitions, Policy Assignments, Compliance Status, Naming Standards, Security Baselines und Cost Analysis werden als dokumentierte Scope-Lücken behandelt. Die reproduzierbare Anreicherung liegt in `tools/enrich-governance-v1.5.mjs`, der Pilotbericht in `reports/governance-enrichment-v1.5.md`.

## Storage & Data Architecture Enrichment Pilot V1.6

V1.6 ergänzt Storage und Data Architecture als fünfte Architekturperspektive: Wie werden Daten in Azure gespeichert, geschützt, repliziert und verwaltet? 24 vorhandene Knoten wurden nach Content Standard V1.0 mit 72 Erklärungstexten, Praxisbeispielen und Merksätzen angereichert. 26 neue geprüfte Beziehungen erweitern den Knowledge Graph auf 185 Beziehungen; 22 zusätzliche Microsoft-Learn-Quellen erhöhen die Quellenbasis auf 117.

Managed Disks und alle früheren Pilotinhalte wurden nicht überschrieben. Fehlende Einzelknoten für SAS, Access Keys, Lifecycle Management, Verschlüsselung, Soft Delete, Versioning und Blob Backup werden als dokumentierte Scope-Lücken behandelt und nur innerhalb geeigneter vorhandener Knoten erklärt. Die reproduzierbare Anreicherung liegt in `tools/enrich-storage-v1.6.mjs`, die V1.6-QA in `tools/qa-storage-v1.6.mjs` und der vollständige Pilotbericht in `reports/storage-enrichment-v1.6.md`.

## Security & Protection Architecture Enrichment Pilot V1.7

V1.7 verbindet Identity, Networking, Compute, Storage, Governance und Recovery als durchgängige Security-&-Protection-Architektur. 25 vorhandene, bisher nicht pilotierte Knoten wurden nach Content Standard V1.0 mit 75 Erklärungstexten, Praxisbeispielen und Merksätzen angereichert. 34 neue geprüfte Beziehungen erweitern den Knowledge Graph auf 219 Beziehungen; 19 zusätzliche Microsoft-Learn-Quellen erhöhen die Quellenbasis auf 136.

Bereits angereicherte Dienste wie Conditional Access, MFA, PIM, RBAC, Firewall, NSG, DDoS Protection, Private Endpoint, Defender for Cloud, Policy, Azure Backup, Site Recovery und Storage wurden nicht überschrieben. Fehlende Einzelknoten für Secure Score, Vulnerability Assessment, Recovery Services Vault und Immutable Backup werden als Scope-Lücken dokumentiert und innerhalb geeigneter bestehender Knoten erklärt. Die reproduzierbare Anreicherung liegt in `tools/enrich-security-v1.7.mjs`, die QA in `tools/qa-security-v1.7.mjs` und der Pilotbericht in `reports/security-enrichment-v1.7.md`.

## Monitoring, Observability & Operations Architecture Enrichment V1.8

V1.8 schließt den operativen Regelkreis **Plan → Build → Secure → Monitor → Operate → Improve**. 31 vorhandene Monitoring-, Operations-, Reliability- und SLA-Knoten wurden nach Content Standard V1.0 mit 93 Erklärungstexten, Praxisbeispielen und Merksätzen angereichert. 24 neue semantische Beziehungen erweitern den Knowledge Graph auf 243 Beziehungen; 19 zusätzliche Microsoft-Learn-Quellen erhöhen die Quellenbasis auf 155.

Metrics, Logs, Diagnostic Settings, Workbooks, Traces, Resource Health und Incident Response werden in vorhandenen fachlich passenden Knoten erklärt. Da dafür keine eigenständigen kanonischen Knoten existieren, wurden keine neuen Knoten erzeugt. Alle V1.2–V1.7-Inhalte bleiben unverändert; neue Verknüpfungen wurden append-only ergänzt. Die reproduzierbare Anreicherung liegt in `tools/enrich-monitoring-v1.8.mjs`, die QA in `tools/qa-monitoring-v1.8.mjs`, der Pilotbericht in `reports/monitoring-enrichment-v1.8.md` und der Domänenvergleich in `reports/monitoring-comparison-v1.8.md`.

## Datenfluss

```text
data/canonical/                 einzige fachliche Source of Truth
        │
        ▼
tools/build-runtime.mjs         validiert IDs, Hierarchie, Quellen und Relationen
        │
        ▼
data/runtime/knowledge-runtime.js
        │
        ▼
Mindmap + Brain + Suche + Detailansicht
```

Die Runtime-Datei ist ausschließlich eine automatisch erzeugte, doppelklick-kompatible Projektion. Sie darf nicht manuell gepflegt werden.

## Ordnerstruktur

```text
Azure-Digital-Brain-V1.8/
├── START.html
├── app/                         Oberfläche und Renderer
├── data/
│   ├── canonical/               kanonisches Fachwissen
│   │   ├── nodes.json
│   │   ├── relations.json
│   │   ├── relation-types.json
│   │   ├── sources.json
│   │   └── schema.json
│   ├── runtime/                 generierte Browser-Laufzeitdaten
│   └── user/                    Benutzerprofil- und KI-Vorschlagsformate
├── tools/
│   ├── build-runtime.mjs
│   ├── migrate-v1-to-v1.1.mjs   einmalige, geschützte Migration
│   ├── enrich-networking-v1.2.mjs kontrollierte Networking-Anreicherung
│   ├── enrich-identity-v1.3.mjs  standardisierte Identity-Anreicherung
│   ├── enrich-compute-v1.4.mjs   Compute als Architektur-Brücke
│   ├── enrich-governance-v1.5.mjs Governance & Management
│   ├── enrich-storage-v1.6.mjs    Storage & Data Architecture
│   ├── qa-storage-v1.6.mjs        V1.6-Integritätsprüfung
│   ├── enrich-security-v1.7.mjs   Security & Protection Architecture
│   ├── qa-security-v1.7.mjs       V1.7-Integritätsprüfung
│   ├── enrich-monitoring-v1.8.mjs Monitoring, Observability & Operations
│   └── qa-monitoring-v1.8.mjs     V1.8-Integritätsprüfung
├── reports/
└── backups/version-1.7/         vollständige unveränderte Vorgängerversion
```

## Fachwissen erweitern

Neue Wissensknoten werden ausschließlich in `data/canonical/nodes.json` ergänzt. Neue Beziehungen gehören nach `relations.json`; neue Beziehungstypen zuerst in `relation-types.json`; Quellen in `sources.json`.

Anschließend kann mit installiertem Node.js die Runtime neu erzeugt werden:

```text
node tools/build-runtime.mjs
```

Der Build bricht bei ungültigen oder doppelten IDs, defekten Eltern-/Kindbeziehungen, unbekannten Beziehungstypen, fehlenden Gegenrichtungen oder ungültigen Quellenreferenzen ab. Er schreibt ausschließlich nach `data/runtime/`.

Die fertige Anwendung selbst benötigt Node.js nicht.

## Persönliche Daten

Notizen und Lernstände liegen getrennt vom Fachwissen im lokalen, versionierten Browserprofil. Über `Profil ↓` kann es gesichert und über `Profil ↑` wieder importiert werden. Das Austauschformat ist unter `data/user/user-profile.example.json` dokumentiert.

Es findet keine Cloud-Synchronisation und keine Übertragung an externe Dienste statt.

## KI-Vorbereitung

KI darf die kanonische Wissensbasis nicht direkt ändern. `data/user/ai-proposals.example.json` zeigt das vorgesehene Verfahren:

```text
Vorschlag → Prüfung → Annehmen oder Ablehnen → kontrollierte Aktualisierung
```

Jeder Vorschlag besitzt Begründung, Quellen, Konfidenz und Status.

## Dokumentation

- `reports/architecture-v1.1.md`
- `reports/data-model.md`
- `reports/migration-report.md`
- `reports/qa-report.md`
- `reports/networking-enrichment-v1.2.md`
- `reports/content-standard-v1.md`
- `reports/identity-enrichment-v1.3.md`
- `reports/compute-enrichment-v1.4.md`
- `reports/governance-enrichment-v1.5.md`
- `reports/storage-enrichment-v1.6.md`
- `reports/security-enrichment-v1.7.md`
- `reports/monitoring-enrichment-v1.8.md`
- `reports/monitoring-comparison-v1.8.md`
- `reports/qa-v1.8.md`
