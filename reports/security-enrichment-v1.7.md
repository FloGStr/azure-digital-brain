# Azure Digital Brain V1.7 – Security & Protection Architecture Enrichment Pilot

Stand: 11. August 2026  
Redaktionsgrundlage: Content Standard V1.0  
Leitfrage: **Wie schützen wir Identitäten, Netzwerke, Workloads und Daten über ihren gesamten Lebenszyklus?**

## Ergebnisübersicht

V1.7 ergänzt Security & Protection als verbindende Architekturperspektive über Identity, Networking, Compute, Storage, Governance und Recovery. 25 vorhandene, bisher nicht pilotierte Knoten wurden angereichert und 34 semantische Beziehungen ergänzt. Es wurden keine Knoten angelegt, entfernt oder verschoben.

| Kennzahl | V1.6 | V1.7 |
|---|---:|---:|
| Knoten gesamt | 1.058 | 1.058 |
| Hierarchieebenen | 10 | 10 |
| neue Security-Pilotknoten | – | 25 |
| neue Erklärungstexte | – | 75 |
| neue Praxisbeispiele | – | 25 |
| neue Merksätze | – | 25 |
| Beziehungen gesamt | 185 | 219 |
| neue Security-Beziehungen | – | 34 |
| Relationstypen gesamt | 36 | 36 |
| neue Relationstypen | – | 0 |
| Quellen gesamt | 117 | 136 |
| neue offizielle Quellen | – | 19 |
| neue oder entfernte Knoten | 0 | 0 |

## Schutz der bisherigen Piloten

Mehrere geforderte Services waren bereits in früheren Piloten vollständig angereichert und wurden deshalb nicht überschrieben:

- Conditional Access, MFA, PIM, Managed Identity, Microsoft Entra ID und Azure RBAC aus V1.3,
- NSG, Azure Firewall, Azure DDoS Protection, WAF und Private Endpoint aus V1.2,
- VM Security Responsibility, Azure VM Backup und Azure Site Recovery aus V1.4,
- Microsoft Defender for Cloud, Security Posture, Azure Policy und Security Governance aus V1.5,
- Storage Account, Blob Storage, Encryption-Kontext und Storage Data Protection aus V1.6.

Diese Knoten werden ausschließlich als stabile Beziehungspartner verwendet. Ihre Erklärungstexte, Beispiele, Merksätze, Quellen und Metadaten sind bytegleich erhalten; nur neue V1.7-Relationsreferenzen wurden append-only ergänzt.

## Pilotumfang und angereicherte Knoten

### Security-Grundlagen und Operating Model

| ID | Titel | Architekturkern |
|---|---|---|
| `azure-0070` | Reliability und Security | Security, Availability und Recovery gemeinsam planen |
| `azure-0073` | Security-Ziele: Vertraulichkeit, Integrität und Verfügbarkeit | risikobasierte CIA-Trade-offs |
| `azure-0074` | Azure Security Controls im Zusammenspiel | präventive, detektive und wiederherstellende Controls |
| `azure-0815` | Azure Security & Protection Architecture | Zero Trust und Security-Lifecycle |
| `azure-0817` | Defense in Depth | unabhängige Schutzschichten und Blast Radius |
| `azure-0840` | Shared Responsibility for Security | Verantwortung nach IaaS, PaaS und SaaS |
| `azure-0932` | Azure Security Tools and Features | Tools, Signale, Prozesse und Ownership |

### Identity Security

| ID | Titel | Architekturkern |
|---|---|---|
| `azure-0821` | Identity & Access Security | AuthN vs. AuthZ, Least Privilege und Zero Trust |

Die fachlichen Services Conditional Access, MFA, PIM, Managed Identity, Entra ID und RBAC bleiben als V1.3-Inhalte unverändert. Neue Beziehungen machen ihre Rolle innerhalb von Defense in Depth sichtbar, ohne ihre Texte neu zu schreiben.

### Network Security

| ID | Titel | Architekturkern |
|---|---|---|
| `azure-0816` | Network Security Architecture | Layer 3/4 vs. Layer 7, zentrale vs. dezentrale Modelle |
| `azure-0824` | Perimeter Security | DDoS, Firewall und WAF an Trust Boundaries |
| `azure-0827` | Internal Network Security und Segmentierung | Ost-West-Schutz, NSG/ASG, Routing und Private Endpoints |

Das zentrale Firewallmodell vereinheitlicht Inspection, Logging und Egress-Regeln, erzeugt aber Routing-, Kosten- und Fehlerdomänenrisiken. Dezentrale Controls bleiben näher am Workload, benötigen jedoch Policy, Templates und Ownership gegen Regelwildwuchs. V1.7 modelliert beide Ebenen gemeinsam statt „Firewall statt NSG“.

### Application und Workload Protection

| ID | Titel | Architekturkern |
|---|---|---|
| `azure-0833` | Application Security | Code, APIs, Abhängigkeiten, AuthZ und Runtime-Konfiguration |
| `azure-0834` | Application Security Controls | DevSecOps, Scanning, WAF, Managed Identity und Remediation |
| `azure-0934` | Defender for Cloud Recommendations and Workload Protection | Secure Score, CSPM, Findings und Vulnerability Management |

Secure Score wird als Orientierungs- und Verbesserungsmaß erklärt, nicht als Sicherheitszertifikat. Empfehlungen benötigen risikobasierte Priorisierung, Owner, Frist und Remediation. Vulnerability Assessment ist ein kontinuierlicher Finding-Prozess und kein einmaliger Projektcheck.

### Data Security und Key Management

| ID | Titel | Architekturkern |
|---|---|---|
| `azure-0076` | Customer-Managed Keys (CMK) | Kontrolle vs. Schlüsselverfügbarkeit und Betriebsrisiko |
| `azure-0836` | Data Security | Schutz beim Speichern, Übertragen, Verarbeiten und Wiederherstellen |
| `azure-0837` | Protection of Data at Rest | Encryption, Authorization und Recovery als getrennte Controls |
| `azure-0838` | Data Protection Controls | Verschlüsselung, Zugriff, Versionierung, Backup und Immutability |
| `azure-0944` | Azure Key Vault | Vault als Security- und Blast-Radius-Grenze |
| `azure-0945` | Secrets Management | vermeiden, zentral schützen, minimal freigeben und rotieren |
| `azure-0946` | Keys, Secrets and Certificates | getrennte Objekte, Operationen und Lifecycle |

Die Architecture-Ebene trennt:

- **Microsoft-Managed Keys:** Azure betreibt den Schlüssel-Lifecycle als robuste Standardverschlüsselung.
- **Customer-Managed Keys:** Der Kunde kontrolliert Schlüssel und Widerruf, übernimmt aber Rotation, Berechtigungen, Löschschutz und Availability.
- **Key Management:** umfasst Erzeugung oder Import, Speicherung, Versionierung, Rotation, Zugriff, Audit, Recovery und kontrollierte Außerbetriebnahme.
- **Access Control:** entscheidet, welche Identität welche Operation an Key Vault oder verschlüsselten Daten ausführen darf.

### Backup, Recovery und Cyber-Resilience

| ID | Titel | Architekturkern |
|---|---|---|
| `azure-0114` | Disaster Recovery (DR) | Cyber-Recovery, RPO/RTO, Failover und Restore |
| `azure-0115` | Recovery-Planung und Wiederherstellbarkeit | Runbook, Abhängigkeiten, Rollen und Restore-Tests |
| `azure-0117` | Replikation, Failover und Failback | Replikation vs. unabhängiger Recovery Point |

Der Pilot erklärt Immutable Backup, Soft Delete, getrennte Administration und Wiederherstellung nach Ransomware innerhalb vorhandener DR- und Data-Protection-Knoten. Azure VM Backup und Site Recovery bleiben bytegleich als V1.4-Knoten erhalten.

### Provider-Schutz

| ID | Titel | Architekturkern |
|---|---|---|
| `azure-0818` | Physical Security | Microsoft-Verantwortung für Datacenter und physische Infrastruktur |

## Content Standard

Jeder der 25 Pilotknoten besitzt:

- eine einfache Erklärung mit zwei bis vier Sätzen,
- eine technische Erklärung zu Funktionsweise, Komponenten und Grenzen,
- eine Architecture-Erklärung zu Entscheidung, Trade-offs und Betriebsverantwortung,
- `why_important`,
- ein Praxisbeispiel,
- einen Merksatz,
- mindestens eine offizielle Microsoft-Quelle.

Insgesamt wurden 75 Erklärungstexte, 25 Praxisbeispiele und 25 Merksätze ergänzt. Es wurden keine neuen Analogien erzwungen.

## Neue semantische Beziehungen

### Security-Grundstruktur

- Security Architecture `contains` Network Security Architecture.
- Security Architecture `contains` Security Tools and Features.
- Security Architecture `contains` Azure Key Vault.
- Identity, Perimeter, Internal Network, Application und Data Security sind jeweils `part_of` Defense in Depth.
- Shared Responsibility ist `part_of` Security Architecture.
- Least Privilege ist `part_of` Defense in Depth.

### Security ↔ Identity

Die vorhandenen V1.3-Beziehungen bleiben erhalten:

- MFA `secures` Authentication.
- Conditional Access `requires` MFA und `part_of` Entra ID.
- PIM `governs` privilegierte Rollen und Global Administrator.
- Least Privilege `part_of` Azure RBAC.
- Managed Identity `connects_to` Key Vault.

V1.7 ergänzt Least Privilege als Defense-in-Depth-Prinzip und ordnet alle Identity Controls in die neue Security-Architektur ein.

### Security ↔ Networking

- Perimeter Security `uses` Azure DDoS Protection.
- Perimeter Security `uses` Azure Firewall.
- Perimeter Security `uses` Web Application Firewall.
- Internal Network Security `uses` NSG.
- Internal Network Security `uses` ASG.
- Internal Network Security `uses` Private Endpoint.

Die bestehenden Beziehungen Azure Firewall `secures` VNet, DDoS Protection `secures` VNet und VNet `secured_by` NSG bleiben unverändert.

### Security ↔ Storage und Data

- Data Security `uses` Azure Key Vault.
- Key Vault `contains` Secrets Management.
- Key Vault `contains` Keys, Secrets and Certificates.
- Key Vault `contains` Customer-Managed Keys.
- Storage Account `uses` Customer-Managed Keys.
- Data Protection Controls `secures` Storage Account.

Die bereits vorhandenen Beziehungen RBAC `governs` Storage Account und Blob Storage bleiben erhalten.

### Security ↔ Compute und Workloads

- Application Security `uses` WAF.
- Application Security `uses` Key Vault.
- Defender for Cloud `secures` Azure Virtual Machines.
- Defender Recommendations and Workload Protection `part_of` Defender for Cloud.
- Defender Recommendations `part_of` Security Posture und Compliance Monitoring.
- Azure Backup `secures` Azure Virtual Machines.

Monitoring und Protection werden getrennt: Defender kann Findings und Telemetrie liefern, während aktivierte Defender-Pläne zusätzliche Workload-Protection-Funktionen bereitstellen.

### Security ↔ Governance

- Azure Policy `governs` Defense in Depth und technische Security-Baselines.
- Die bestehenden Beziehungen Defender for Cloud `monitors` Compliance und `integrates_with` Azure Policy bleiben erhalten.
- Policy verhindert oder meldet Konfigurationsdrift; Defender bewertet, priorisiert und liefert Security Findings.

### Security ↔ Backup und Recovery

- Disaster Recovery `uses` Azure Backup.
- Disaster Recovery `uses` Azure Site Recovery.
- Recovery-Planung `part_of` Disaster Recovery.
- Replikation, Failover und Failback `part_of` Disaster Recovery.
- Data Protection Controls `uses` Azure Backup.

Alle 34 neuen Beziehungen besitzen registrierten Typ, gültige Gegenrichtung, Erklärung, offizielle Quelle, Confidence zwischen 0,98 und 0,99 sowie Status `accepted`. Es waren keine neuen Relationstypen nötig.

## Quellenbasis

Alle 19 neuen Quellen stammen aus Microsoft Learn und wurden am 11. August 2026 auf Erreichbarkeit und fachliche Passung geprüft:

1. [Shared responsibility in the cloud](https://learn.microsoft.com/en-us/azure/security/fundamentals/shared-responsibility)
2. [Introduction to Azure security](https://learn.microsoft.com/en-us/azure/security/fundamentals/overview)
3. [Azure Well-Architected Framework – Security](https://learn.microsoft.com/en-us/azure/well-architected/security/)
4. [Security architecture design patterns](https://learn.microsoft.com/en-us/azure/well-architected/security/design-patterns)
5. [Secure infrastructure with Zero Trust](https://learn.microsoft.com/en-us/security/zero-trust/deploy/infrastructure)
6. [Azure infrastructure security](https://learn.microsoft.com/en-us/azure/security/fundamentals/infrastructure)
7. [Physical security of Azure datacenters](https://learn.microsoft.com/en-us/azure/security/fundamentals/physical-security)
8. [Azure networking services overview](https://learn.microsoft.com/en-us/azure/networking/networking-overview)
9. [Azure Key Vault basic concepts](https://learn.microsoft.com/en-us/azure/key-vault/general/basic-concepts)
10. [Key Vault keys, secrets and certificates](https://learn.microsoft.com/en-us/azure/key-vault/general/about-keys-secrets-certificates)
11. [Secure your Azure Key Vault](https://learn.microsoft.com/en-us/azure/key-vault/general/secure-key-vault)
12. [Choose a key management solution](https://learn.microsoft.com/en-us/azure/security/fundamentals/key-management-choose)
13. [Secure score in Defender for Cloud](https://learn.microsoft.com/en-us/azure/defender-for-cloud/secure-score-security-controls)
14. [Defender for Cloud security recommendations](https://learn.microsoft.com/en-us/azure/defender-for-cloud/security-recommendations)
15. [Enable Defender Vulnerability Management scanning](https://learn.microsoft.com/en-us/azure/defender-for-cloud/deploy-vulnerability-assessment-defender-vulnerability-management)
16. [Azure Backup security best practices](https://learn.microsoft.com/en-us/azure/backup/azure-backup-data-protection-best-practices)
17. [Azure Backup Immutable vault](https://learn.microsoft.com/en-us/azure/backup/backup-azure-immutable-vault-how-to-manage)
18. [Recovery Services vault](https://learn.microsoft.com/en-us/azure/backup/backup-create-recovery-services-vault)
19. [Business continuity, HA and DR](https://learn.microsoft.com/en-us/azure/reliability/concept-business-continuity-high-availability-disaster-recovery)

Zusätzlich werden bestehende Microsoft-Quellen der früheren Piloten referenziert. Es wurden keine Blogs oder Drittquellen verwendet.

## Architekturmehrwert

### Beziehungen mit dem größten Mehrwert

1. **Defense in Depth → Identity/Perimeter/Network/Application/Data:** macht Schutzschichten und Blast Radius sichtbar.
2. **Storage Account → CMK → Key Vault:** verbindet Datenverschlüsselung mit Identität, Schlüsselverfügbarkeit und Betriebsverantwortung.
3. **Defender → VM → Recommendations/Posture:** trennt kontinuierliche Bewertung, Workload Protection und Remediation.
4. **Policy ↔ Defender:** trennt präventive Guardrails von detektiver Bewertung und risikobasierter Priorisierung.
5. **DR → Backup/Site Recovery:** trennt Recovery Points, Replikation, Failover und getesteten Geschäftsprozess.
6. **Network Security → NSG/Firewall/WAF/DDoS/Private Endpoint:** ordnet Controls der richtigen Protokoll- und Architekturebene zu.

### Besonders wichtige Architecture-Ebenen

- Zero Trust als Betriebsprinzip statt Produkt.
- Authentication vs. Authorization und Least Privilege.
- Layer 3/4 vs. Layer 7 und zentrale vs. dezentrale Firewallmodelle.
- Microsoft-Managed Keys vs. Customer-Managed Keys.
- Encryption vs. Access Control vs. Backup.
- Secure Score als Signal statt Zertifikat.
- Replikation vs. unveränderbarer Recovery Point.
- Shared Responsibility nach Servicemodell.

## Vergleich V1.2 bis V1.7

| Dimension | Networking V1.2 | Identity V1.3 | Compute V1.4 | Governance V1.5 | Storage V1.6 | Security V1.7 |
|---|---:|---:|---:|---:|---:|---:|
| angereicherte Knoten | 33 | 36 | 38 | 27 | 24 | 25 |
| neue Erklärungstexte | 99 | 108 | 114 | 81 | 72 | 75 |
| neue Beziehungen | 29 | 35 | 34 | 34 | 26 | 34 |
| neue offizielle Quellen | 27* | 21 | 24 | 22 | 22 | 19 |
| Leitfrage | Wie erreicht ein Workload Ressourcen? | Wer darf was? | Wo läuft er? | Wie wird alles kontrolliert? | Wie werden Daten geschützt? | Wie schützen wir den gesamten Lebenszyklus? |

\* V1.2 erhöhte die Quellenbasis von einer migrierten Ausgangsquelle auf insgesamt 28 Quellen.

Security V1.7 ist der erste Pilot, dessen primärer Mehrwert nicht in einem einzelnen Azure-Produktbereich liegt. Er verbindet die vorherigen Domänen als durchgängiges Schutz- und Recovery-System.

Als nächster kontrollierter Pilot wird **Monitoring, Observability & Operations** empfohlen. Diese Domäne kann Security Findings, Azure Monitor, Log Analytics, Application Insights, Alerts, Service Health, Backup Jobs und operative Ownership zu einem gemeinsamen Betriebsmodell verbinden.

## Offene Scope-Lücken

Folgende geforderte Konzepte besitzen in V1.6 keinen eigenständigen kanonischen Knoten und wurden deshalb nicht neu angelegt:

- Zero Trust,
- Microsoft-Managed Keys,
- Key Rotation,
- Secure Score,
- Security Recommendations,
- Vulnerability Assessment,
- Cloud Security Posture Management als eigener Knoten,
- Security Baselines,
- Recovery Services Vault,
- Backup Vault,
- Immutable Backup / Immutable Vault,
- Ransomware Protection,
- Restore Testing,
- zentrale vs. dezentrale Firewallarchitektur als Einzelknoten,
- Layer-3/4- und Layer-7-Kontrolle als Einzelknoten.

Die Inhalte sind innerhalb geeigneter vorhandener Knoten erklärt und belegt. Sichtbare Einzelknoten erfordern eine ausdrücklich freigegebene Hierarchiephase.

## Qualitätssicherung

| Prüfung | Ergebnis |
|---|---|
| V1.6-Backup vollständig und bytegenau | PASS |
| 1.058 Knoten | PASS |
| IDs und ID-Reihenfolge unverändert | PASS |
| Eltern-/Kindhierarchie unverändert | PASS |
| V1.2–V1.6 Pilotinhalte unverändert | PASS |
| historische Relations- und Quellenobjekte unverändert | PASS |
| 25 vollständige Security-Anreicherungen | PASS |
| Simple jeweils zwei bis vier Sätze | PASS |
| alle Quellenreferenzen gültig | PASS |
| keine erfundenen Dienste oder Knoten | PASS |
| keine doppelten Relations-IDs oder semantischen Tripel | PASS |
| Relation Registry und Gegenrichtungen gültig | PASS |
| keine neuen Relationstypen | PASS |
| UI, Schema, Datenmodell und Buildprozess unverändert | PASS |
| Runtime Build aus `data/canonical/` | PASS |

## Reproduzierbarkeit

- `tools/enrich-security-v1.7.mjs` dokumentiert die kontrollierte Anreicherung.
- `tools/qa-security-v1.7.mjs` prüft Knoten, Hierarchie, Pilotvollständigkeit, historische Inhalte, Quellen, Relationsregistry und geschützte Dateien.
- `tools/build-runtime.mjs` erzeugt die lokale Browser-Runtime unverändert aus `data/canonical/`.
- `backups/version-1.6/` enthält die vollständige unveränderte Ausgangsbasis.
