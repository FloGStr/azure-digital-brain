# Azure Digital Brain V1.5 – Governance & Management Enrichment Pilot

Stand: 11. August 2026  
Redaktionsgrundlage: Content Standard V1.0  
Leitfrage: **Wie kontrollieren, standardisieren und überwachen wir Azure-Ressourcen über viele Umgebungen hinweg?**

## Ergebnisübersicht

Der vierte kontrollierte Pilot reichert 27 vorhandene Governance- und Managementknoten an. IDs, Reihenfolge, Hierarchie, Datenmodell, Buildprozess, Oberfläche und sämtliche bisherigen Networking-, Identity- und Compute-Erklärungen bleiben unverändert. Der Pilot verbindet Managementhierarchie, Policy, Kostensteuerung und Security Governance mit den bereits modellierten Architekturdomänen.

| Kennzahl | V1.4 | V1.5 |
|---|---:|---:|
| Knoten gesamt | 1.058 | 1.058 |
| Hierarchieebenen | 10 | 10 |
| Networking-Pilotknoten | 33 | 33 unverändert |
| Identity-Pilotknoten | 36 | 36 unverändert |
| Compute-Pilotknoten | 38 | 38 unverändert |
| neue Governance-Pilotknoten | – | 27 |
| neue Governance-Erklärungstexte | – | 81 |
| Governance-Praxisbeispiele | – | 27 |
| Governance-Merksätze | – | 27 |
| bewusst eingesetzte Analogien | – | 0 |
| Beziehungen gesamt | 125 | 159 |
| neue Governance-Beziehungen | – | 34 |
| Relationstypen gesamt | 34 | 36 |
| neue Relationstypen | – | 2 |
| Quellen gesamt | 73 | 95 |
| neue offizielle Quellen | – | 22 |
| neue oder entfernte Knoten | 0 | 0 |

## Pilotumfang

### Governance-Grundlagen und Guardrails

| ID | normalisierter Titel |
|---|---|
| `azure-0036` | Azure Governance |
| `azure-0037` | Governance-Regeln, Standards und Kontrollen |
| `azure-0038` | Governance-Scopes und Managementhierarchie |
| `azure-0040` | Governance Guardrails |
| `azure-0047` | Standards, Naming und Wiederverwendbarkeit |
| `azure-0961` | Azure Governance-Methoden |

### Azure Policy und Compliance

| ID | normalisierter Titel |
|---|---|
| `azure-0041` | Azure Policy und Initiatives |
| `azure-0042` | Azure-Policy-Effects |
| `azure-0059` | Governance Compliance und Reporting |
| `azure-0060` | Policy Compliance und regulatorische Security Governance |
| `azure-0962` | Azure Policy |
| `azure-0963` | Policy-Durchsetzung für Naming, Regionen und Compliance |

### Managementhierarchie und Control Plane

| ID | normalisierter Titel |
|---|---|
| `azure-0277` | Azure Resource Groups |
| `azure-0284` | Azure Resource Manager (ARM) |
| `azure-0970` | Azure Resource Locks |
| `azure-1011` | Azure Subscriptions |
| `azure-1022` | Azure Management Groups |
| `azure-1023` | Ressourcenorganisation mit Management Groups |

### Tags und Kostensteuerung

| ID | normalisierter Titel |
|---|---|
| `azure-0033` | Budgets und Kostenwarnungen |
| `azure-0057` | Kostensteuerung und FinOps-Governance |
| `azure-0980` | Azure Resource Tags |
| `azure-0981` | Tags für Klassifikation, Kostenanalyse und Filterung |
| `azure-1025` | Azure-Kosten planen und steuern |
| `azure-1030` | Nutzungsmessung und Kostenentstehung |
| `azure-1034` | Microsoft Cost Management |

### Security Governance

| ID | normalisierter Titel |
|---|---|
| `azure-0933` | Microsoft Defender for Cloud |
| `azure-0936` | Security Posture und Compliance Monitoring |

Historische Titel bleiben als Aliase und unverändert unter `legacy.original` erhalten. Bereits angereicherte RBAC-, Role-Assignment- und Scope-Knoten aus V1.3 wurden nicht neu geschrieben.

## Managementhierarchie als Governance-System

```text
Microsoft Entra Tenant
        ↓
Management Groups
        ↓
Subscriptions
        ↓
Resource Groups
        ↓
Resources
```

Die Hierarchie ist nicht nur Ablage. Sie bestimmt, wie Policy und RBAC über Scopes vererbt, Kosten zugeordnet, Verantwortlichkeiten delegiert und Änderungen begrenzt werden.

- **Management Groups** bündeln Subscriptions nach gemeinsamen Governanceanforderungen.
- **Subscriptions** bilden zentrale Grenzen für Delegation, Policy, Kosten, Quotas und Risiko.
- **Resource Groups** bündeln Ressourcen mit gemeinsamem Lifecycle und Verwaltungsbedarf.
- **Ressourcen** sind die konkreten Compute-, Netzwerk-, Storage- und Plattformobjekte.

Der Architecture-Layer warnt ausdrücklich davor, die Hierarchie als Kopie des Organigramms zu verwenden. Stabile technische und regulatorische Anforderungen sind bessere Trennkriterien als häufig wechselnde Abteilungsstrukturen.

## Policy-Verständnis

V1.5 erklärt Azure Policy als Zusammenspiel mehrerer Objekte:

| Objekt | Aufgabe |
|---|---|
| Policy Definition | beschreibt Bedingung und Effect |
| Policy Assignment | bindet Definition oder Initiative an Scope und Parameter |
| Initiative | bündelt mehrere Definitions zu einem Standard |
| Effect | bestimmt Audit, Blockierung, Änderung oder ergänzende Bereitstellung |
| Compliance State | beschreibt das Bewertungsergebnis einer anwendbaren Ressource |
| Exemption/Exclusion | nimmt begründete Scopes oder Ressourcen kontrolliert aus |
| Remediation | bearbeitet bestehende Non-Compliance bei unterstützten Effects |

Wichtig ist die Abgrenzung zu Azure RBAC:

- **RBAC:** Wer darf Managementaktionen ausführen?
- **Policy:** Welcher Ressourcenzustand ist zulässig oder konform?

Policy und RBAC ergänzen sich, ersetzen einander aber nicht.

## Semantische Architekturbeziehungen

### Governance ↔ Identity

- Azure RBAC `governs` Management Groups
- Azure RBAC `governs` Subscriptions
- bestehende RBAC-Beziehung zur Resource Group bleibt unverändert
- Role Assignment `governs` Azure Virtual Machines über Principal, Role Definition und Scope
- Azure Policy `part_of` Azure Governance und wird klar von RBAC abgegrenzt

### Governance ↔ Compute

- Resource Group `contains` Azure Virtual Machines
- Azure Policy `governs` Azure Virtual Machines
- Azure Policy `governs` Azure App Service
- Azure Policy `governs` Azure Kubernetes Service
- Tags `organizes` Azure Virtual Machines
- Azure Policy `governs` Compute Security Responsibility als technische Baseline

### Governance ↔ Networking

- Resource Group `contains` Virtual Network
- Azure Policy `governs` Virtual Network
- Azure Policy `governs` Network Security Groups
- Naming Standards `organizes` Virtual Network
- Tags `organizes` Virtual Network

### Governance ↔ Security

- Defender for Cloud `monitors` regulatorische Security Governance
- Defender for Cloud `integrates_with` Azure Policy
- Resource Locks `secures` Resource Groups gegen versehentliche Control-Plane-Änderungen
- Policy Compliance und Microsoft Cloud Security Benchmark werden als technische Evidenz, nicht als pauschales Zertifikat erklärt

### Governance ↔ Cost

- Budget `monitors` Subscription-Kosten
- Cost Management `monitors` Subscriptions
- Cost Management `monitors` Resource Groups
- Cost Management `uses` Tags zur feineren Kostenallokation
- Nutzungsmessung `part_of` Cost Management
- Kostensteuerung `uses` Cost Management

### Hierarchiebeziehungen

- Governance `contains` Scope-Modell
- Scope-Modell `contains` Management Groups
- Management Group `contains` Subscriptions
- Subscription `contains` Resource Groups
- Azure Resource Manager `governs` Resource Groups als Control Plane

Alle neuen Beziehungen besitzen stabile ID, registrierten Relationstyp, Gegenrichtung, konkrete Erklärung, offizielle Quelle, Confidence zwischen 0,97 und 0,99 sowie Status `accepted`.

## Erweiterung der Relation Registry

Die vorhandenen Typen `governs`, `monitors`, `contains`, `part_of`, `depends_on`, `secures`, `uses` und `integrates_with` decken fast alle Aussagen ab. Für Klassifikation und Taxonomie war ein eigenes Paar erforderlich:

| Typ | Gegenrichtung | Zweck |
|---|---|---|
| `organizes` | `organized_by` | Tags, Naming oder Taxonomien strukturieren Ressourcen |

`contains` wäre fachlich falsch, weil ein Tag keine Ressource enthält. `governs` wäre zu stark, weil ein Tag allein keine Konfiguration erzwingt.

## Fehlende eigenständige Knoten

Folgende geforderte Konzepte besitzen in V1.4 keinen eigenen kanonischen Knoten und wurden deshalb nicht ergänzt:

- Policy Definitions
- Policy Assignments
- Policy Compliance Status
- Naming Standards
- Security Baselines
- Regulatory Compliance als eigener Produktknoten
- Cost Analysis

Die Konzepte sind jeweils in passenden vorhandenen Knoten fachlich erklärt und durch Quellen belegt. Für eine spätere eigene Knotenergänzung ist eine explizit freigegebene Hierarchiephase erforderlich.

Zusätzlich bestehen historische Dubletten für Management Groups, Azure Policy, Tags und Resource Locks. V1.5 reichert jeweils den fachlich geeignetsten vorhandenen Hauptknoten an und dokumentiert die Dubletten, statt sie zusammenzuführen oder zu verschieben.

## Quellenbasis

Alle 22 neuen Quellen stammen aus Microsoft Learn oder dem Azure Cloud Adoption Framework:

- Azure Management und Management Groups
- Management-Group- und Subscription-Design für Landing Zones
- Azure Resource Manager und Resource Groups
- Azure Policy Overview
- Policy Definition-, Assignment- und Initiative-Struktur
- Policy Effects, Compliance States und Regulatory Compliance
- Naming Convention und Tagging Strategy
- Azure Resource Tags und Resource Locks
- Microsoft Cost Management, Kostenplanung und Cost Analysis
- Microsoft Defender for Cloud Posture und Regulatory Compliance
- Microsoft Cloud Security Benchmark

Die URLs wurden am 11. August 2026 auf Erreichbarkeit und fachliche Passung geprüft. Es wurden keine Blogs oder Drittquellen verwendet.

## Architekturmehrwert

### Beziehungen mit dem größten Mehrwert

1. **Management Group → Subscription → Resource Group → Resource:** macht Vererbung und organisatorischen Blast Radius sichtbar.
2. **RBAC vs. Policy:** trennt Akteursberechtigung von erlaubtem Ressourcenzustand.
3. **Policy ↔ Compute/Networking/Security:** zeigt Governance als technische Architekturbrücke statt als isoliertes Verwaltungsportal.
4. **Tags ↔ Cost Management:** verbindet Ressourcenklassifikation mit finanzieller Verantwortlichkeit.
5. **Defender for Cloud ↔ Policy/Compliance:** verbindet Security Findings, Standards und Remediation-Ownership.

### Besonders wichtige Architecture-Ebenen

- Management Groups: Struktur nach Governancebedarf statt Organigramm.
- Subscriptions: bewusste Grenze für Delegation, Kosten, Quotas und Risiko.
- Azure Policy: Audit-first, Effects, Remediation und Exemption-Governance.
- Tags: Taxonomie und Datenqualität statt beliebiger Schlüssel-Wert-Sammlung.
- Cost Management: Datengrundlage eines FinOps-Prozesses, kein autonomer Optimierer.
- Defender for Cloud: zentrale Posture-Sicht, aber keine automatische Verantwortungsübernahme.

## Vergleich der vier Piloten

| Dimension | Networking V1.2 | Identity V1.3 | Compute V1.4 | Governance V1.5 |
|---|---:|---:|---:|---:|
| angereicherte Knoten | 33 | 36 | 38 | 27 |
| neue Erklärungstexte | 99 | 108 | 114 | 81 |
| neue Beziehungen | 29 | 35 | 34 | 34 |
| neue offizielle Quellen | 27* | 21 | 24 | 22 |
| Leitfrage | Wie erreicht ein Workload Ressourcen? | Wer darf was? | Wo läuft er und wer betreibt ihn? | Wie wird alles skalierbar kontrolliert? |

\* V1.2 erhöhte die Quellenbasis von einer migrierten Ausgangsquelle auf insgesamt 28 Quellen.

Networking erklärt Pfade und Grenzen, Identity Akteure und Berechtigungen, Compute Laufzeit und Betriebsverantwortung. Governance verbindet diese drei Perspektiven über Scopes, Standards, Compliance, Kosten und zentrale Kontrollsignale.

## Bewusste Nichtänderungen

- keine neuen Knoten
- keine neuen oder geänderten Knoten-IDs
- keine Verschiebung oder Hierarchieänderung
- keine Änderung an UI, Schema oder Datenmodell
- keine Änderung am Runtime-Buildprozess
- keine Überschreibung vorhandener V1.2-, V1.3- oder V1.4-Erklärungen
- keine Änderung bestehender Relationsaussagen oder Relations-IDs
- keine Entfernung historischer Inhalte oder Dubletten
- keine ungeprüften Preis-, Limit- oder Lizenzwerte

Domänenübergreifende Zielknoten erhielten ausschließlich neue Relations-ID-Referenzen. Ihre Titel, Erklärungen, Beispiele, Merksätze, Quellen und Metadaten blieben unverändert.

## Qualitätssicherung

### Daten und Content

- 1.058 eindeutige Knoten und unveränderte ID-Reihenfolge
- Eltern-/Kindhierarchie exakt bytegleich zu V1.4 und weiterhin zehn Ebenen
- 27 Governance-Pilotknoten mit Simple, Technical und Architecture
- alle Simple-Erklärungen mit zwei bis vier vollständigen Sätzen
- jeder Pilotknoten mit `why_important`, Praxisbeispiel, Merksatz und offizieller Quelle
- keine erzwungenen Analogien
- frühere Pilotinhalte außerhalb der Relationsreferenzen bytegleich

### Beziehungen und Quellen

- 159 eindeutige Beziehungen
- keine doppelte Kombination aus Quelle, Typ und Ziel
- 36 Relationstypen mit vollständig reziproken Gegenrichtungen
- jede Beziehung mit Erklärung, Quelle, Confidence und Status
- 95 auflösbare Quellenreferenzen
- alle 22 neuen Quellen offiziell und erreichbar

### Runtime und Schutz der Vorversion

- Runtime-Build erfolgreich
- Runtime: 1.058 Knoten, 159 Beziehungen, 36 Relationstypen, 95 Quellen, Tiefe 10
- statische Offline-Startkette erfolgreich geprüft: `START.html` verweist auf die vorhandene App, alle lokalen CSS-/JavaScript-Dateien sind auflösbar und syntaktisch gültig, das Runtime-Global ist vorhanden
- `app/app.js`, `app/index.html`, `app/styles.css` und `START.html` bytegleich zu V1.4
- `data/canonical/schema.json` und `tools/build-runtime.mjs` bytegleich zu V1.4
- vollständiges, bytegenaues V1.4-Backup unter `backups/version-1.4/`

Ein visueller `file://`-Smoke-Test im integrierten Prüfbrowser war nicht möglich, weil dessen Sicherheitsrichtlinie lokale Dateinavigation blockiert. Es wurde kein alternativer Browserweg zur Umgehung dieser Sperre verwendet. Da die vollständige Start- und UI-Schicht bytegleich zu V1.4 ist und nur die validierte Runtime-Projektion erneuert wurde, entsteht aus V1.5 keine neue UI-Startregression; die verbleibende manuelle Endprüfung besteht aus dem Doppelklick auf `START.html` auf dem Ziel-Mac.

## Empfohlene zukünftige Erweiterung

Als nächster kontrollierter Schritt bietet sich **Storage & Data Architecture** an. Nach Netzwerk, Identität, Compute und Governance fehlen vor allem Datenklassifikation, Redundanz, Zugriffspfade, Verschlüsselung, Backupgrenzen und Kosten-/Lifecycle-Entscheidungen als zusammenhängende Architekturperspektive. Eine eigene Hierarchiephase für die dokumentierten Governance-Lücken sollte davon getrennt und ausdrücklich freigegeben werden.

## Reproduzierbarkeit

`data/canonical/` bleibt die einzige fachliche Source of Truth. Die idempotente Transformation liegt in `tools/enrich-governance-v1.5.mjs`; `tools/build-runtime.mjs` validiert die kanonischen Daten und erzeugt ausschließlich die Browserprojektion unter `data/runtime/`.
