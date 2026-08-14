# Azure Digital Brain V2.4 – Review Package

> V2.4 ist ausschließlich ein nicht-destruktiver Audit. Kein Finding ist eine Änderungsfreigabe. Knoten, IDs, Hierarchie, Relationen, Quellen, Szenarien und Lernpfade bleiben unverändert.

## Executive Review Queue

- Gesamtfindings: **77**
- High Confidence: **54**
- P1: **34**
- Human Context Required: **5**
- Awaiting Review: **21**

## Empfohlene Review-Reihenfolge

1. P1 + High Confidence: Retirement, klare Duplikate und zentrale Hierarchieprobleme.
2. Kategorie H: ursprünglichen Owner-Kontext sichern, bevor spätere Bereinigung geplant wird.
3. Knowledge Gaps: fachlichen Scope und gewünschte Knotengranularität freigeben oder ablehnen.
4. Fragmente/Analogien: Lernwert gegen Navigationskomplexität abwägen.

## High-Confidence Findings

| ID | Kat. | Prio | Confidence | Knoten | Finding | Vorschlag | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| QF-2026-0001 | A | P1 | high | azure-0005, azure-0265 | Availability Set doppelt modelliert | Möglichen kanonischen Zielknoten azure-0005 prüfen; einzigartige Inhalte und alle Referenzen vor einer späteren Merge-Entscheidung sichern. | awaiting_review |
| QF-2026-0002 | A | P1 | high | azure-0591, azure-0709 | RA-GRS doppelt modelliert | Möglichen kanonischen Zielknoten azure-0591 prüfen; einzigartige Inhalte und alle Referenzen vor einer späteren Merge-Entscheidung sichern. | awaiting_review |
| QF-2026-0003 | A | P1 | high | azure-0594, azure-0711 | RA-GZRS doppelt modelliert | Möglichen kanonischen Zielknoten azure-0594 prüfen; einzigartige Inhalte und alle Referenzen vor einer späteren Merge-Entscheidung sichern. | awaiting_review |
| QF-2026-0004 | A | P1 | high | azure-0601, azure-0714 | Azure File Sync doppelt modelliert | Möglichen kanonischen Zielknoten azure-0601 prüfen; einzigartige Inhalte und alle Referenzen vor einer späteren Merge-Entscheidung sichern. | awaiting_review |
| QF-2026-0005 | A | P1 | high | azure-0605, azure-0715 | AzCopy doppelt modelliert | Möglichen kanonischen Zielknoten azure-0605 prüfen; einzigartige Inhalte und alle Referenzen vor einer späteren Merge-Entscheidung sichern. | awaiting_review |
| QF-2026-0006 | A | P1 | high | azure-0609, azure-0716 | Azure Storage Explorer doppelt modelliert | Möglichen kanonischen Zielknoten azure-0609 prüfen; einzigartige Inhalte und alle Referenzen vor einer späteren Merge-Entscheidung sichern. | awaiting_review |
| QF-2026-0007 | A | P1 | high | azure-0638, azure-0721 | Azure Data Box doppelt modelliert | Möglichen kanonischen Zielknoten azure-0638 prüfen; einzigartige Inhalte und alle Referenzen vor einer späteren Merge-Entscheidung sichern. | awaiting_review |
| QF-2026-0008 | A | P1 | high | azure-0645, azure-0722 | Azure Migrate doppelt modelliert | Möglichen kanonischen Zielknoten azure-0645 prüfen; einzigartige Inhalte und alle Referenzen vor einer späteren Merge-Entscheidung sichern. | awaiting_review |
| QF-2026-0009 | A | P1 | high | azure-0648, azure-0738 | Azure Database Migration Service doppelt modelliert | Möglichen kanonischen Zielknoten azure-0738 prüfen; einzigartige Inhalte und alle Referenzen vor einer späteren Merge-Entscheidung sichern. | awaiting_review |
| QF-2026-0010 | A | P1 | high | azure-0039, azure-1022 | Management Groups doppelt modelliert | Möglichen kanonischen Zielknoten azure-1022 prüfen; einzigartige Inhalte und alle Referenzen vor einer späteren Merge-Entscheidung sichern. | awaiting_review |
| QF-2026-0011 | A | P1 | high | azure-0292, azure-0962 | Azure Policy doppelt modelliert | Möglichen kanonischen Zielknoten azure-0962 prüfen; einzigartige Inhalte und alle Referenzen vor einer späteren Merge-Entscheidung sichern. | awaiting_review |
| QF-2026-0012 | A | P1 | high | azure-0571, azure-0677 | Blob Storage doppelt modelliert | Möglichen kanonischen Zielknoten azure-0571 prüfen; einzigartige Inhalte und alle Referenzen vor einer späteren Merge-Entscheidung sichern. | awaiting_review |
| QF-2026-0013 | A | P1 | high | azure-0616, azure-0717 | Data Lake Storage doppelt modelliert | Möglichen kanonischen Zielknoten azure-0616 prüfen; einzigartige Inhalte und alle Referenzen vor einer späteren Merge-Entscheidung sichern. | awaiting_review |
| QF-2026-0014 | A | P1 | high | azure-0624, azure-0718 | Queue Storage doppelt modelliert | Möglichen kanonischen Zielknoten azure-0624 prüfen; einzigartige Inhalte und alle Referenzen vor einer späteren Merge-Entscheidung sichern. | awaiting_review |
| QF-2026-0015 | A | P1 | high | azure-0632, azure-0719 | Table Storage doppelt modelliert | Möglichen kanonischen Zielknoten azure-0632 prüfen; einzigartige Inhalte und alle Referenzen vor einer späteren Merge-Entscheidung sichern. | awaiting_review |
| QF-2026-0016 | A | P1 | high | azure-0654, azure-0724 | Cosmos DB doppelt modelliert | Möglichen kanonischen Zielknoten azure-0724 prüfen; einzigartige Inhalte und alle Referenzen vor einer späteren Merge-Entscheidung sichern. | awaiting_review |
| QF-2026-0023 | C | P3 | high | azure-0310 | Persönlich formulierte Idempotenz-Eselsbrücke | Als Lernnotiz/Analogie kennzeichnen oder bei späterer Freigabe in den kanonischen Idempotenz-Knoten integrieren; Originaltext archivieren. | detected |
| QF-2026-0025 | C | P3 | high | azure-0982 | Tags als persönliche Frageform | Human Review; keine automatische Änderung. | detected |
| QF-2026-0026 | C | P3 | high | azure-0366, azure-0386 | Doppelte Koch-Analogie im App-Service-Ast | Späteren Review auf einmalige Analogie plus Verweise prüfen; keine automatische Änderung. | detected |
| QF-2026-0027 | C | P3 | high | azure-0374, azure-0382 | Doppelte Wohnblock/Hausmeister-Analogie | Human Review; keine automatische Änderung. | detected |
| QF-2026-0028 | C | P3 | high | azure-0392, azure-0406 | Doppelte Burger-Skalierungsanalogie | Human Review; keine automatische Änderung. | detected |
| QF-2026-0030 | C | P2 | high | azure-0959, azure-0960 | Azure ATP als historischer Produktname | Legacy-Alias erhalten, aber Navigation langfristig auf den aktuellen Produktnamen ausrichten; nur nach Human Review. | detected |
| QF-2026-0031 | D | P1 | high | azure-1022 | Management Groups unter Pricing/Subscriptions | Vorgeschlagenen Zielkontext fachlich prüfen: Azure > Governance > Resource organization > Management Groups. Keine Verschiebung in V2.4. | detected |
| QF-2026-0032 | D | P1 | high | azure-0645, azure-0722 | Azure Migrate unter Azure Storage | Vorgeschlagenen Zielkontext fachlich prüfen: Azure > Migration and modernization > Azure Migrate. Keine Verschiebung in V2.4. | detected |
| QF-2026-0034 | D | P1 | high | azure-0979 | Monitoring/Operations unter Security-Hauptbereich | Vorgeschlagenen Zielkontext fachlich prüfen: Azure > Management and Governance > Monitoring, Observability and Operations. Keine Verschiebung in V2.4. | detected |
| QF-2026-0035 | D | P2 | high | azure-0766 | IoT Hub als Kind eines Data-Lake-Analytics-Beispiels | Vorgeschlagenen Zielkontext fachlich prüfen: Azure > Integration / IoT > IoT Hub oder als reines Beispielfeld beim Analytics-Knoten. Keine Verschiebung in V2.4. | detected |
| QF-2026-0036 | D | P2 | high | azure-0803 | Azure Lab Services unter Azure DevOps | Vorgeschlagenen Zielkontext fachlich prüfen: Azure > Specialized services > Lab environments. Keine Verschiebung in V2.4. | detected |
| QF-2026-0039 | E | P1 | high | azure-0764, azure-0765, azure-0766 | Azure Data Lake Analytics ist eingestellt | Als historischen/retired Dienst kennzeichnen und aktuelle Analysealternativen erst nach separater fachlicher Freigabe verlinken. | detected |
| QF-2026-0040 | E | P1 | high | azure-0803, azure-0804 | Azure Lab Services wird eingestellt | Retirement-Status und Übergangsbedarf in einem späteren Content-Change ergänzen; keine automatische Entfernung. | detected |
| QF-2026-0041 | E | P1 | high | azure-0049, azure-0972, azure-0973 | Azure Blueprints Retirement-Zeitplan aktualisieren | Historische Inhalte erhalten, Retirement-Datum und aktuelle Migrationsrichtung nach Review ergänzen. | detected |
| QF-2026-0042 | E | P2 | high | azure-0926 | Azure AD B2C Status präzisieren | Formulierung und Zeitbezug regelmäßig verifizieren; External ID als aktuelle Richtung beibehalten. | detected |
| QF-2026-0043 | E | P2 | high | azure-0959 | Azure Advanced Threat Protection ist historischer Name | Langfristig aktuellen Produktknoten als Navigationseinstieg prüfen und Legacy-Namen als Alias bewahren. | detected |
| QF-2026-0047 | F | P2 | high | azure-0706, azure-0707, azure-0708, azure-0710 | Redundanz-Akronyme als isolierte Kurzfragmente | Als mögliche Aliase/Navigationseinträge gegen die angereicherten Knoten prüfen; keine automatische Konsolidierung. | detected |
| QF-2026-0048 | F | P3 | high | azure-0704 | Eigener Knoten nur für „Merksatz“ | Human Review; keine automatische Änderung. | detected |
| QF-2026-0049 | F | P3 | high | azure-0416, azure-0426 | Generischer Container „Beschreibung“ | Human Review; keine automatische Änderung. | detected |
| QF-2026-0050 | F | P3 | high | azure-0619 | „Big Data & KI“ als isoliertes Blatt | Human Review; keine automatische Änderung. | detected |
| QF-2026-0051 | F | P3 | high | azure-0788, azure-0781, azure-0791 | Analogie-Blätter unter Eventdiensten | Human Review; keine automatische Änderung. | detected |
| QF-2026-0054 | F | P3 | high | azure-1006 | „Dashboard“ als unqualifiziertes Blatt | Human Review; keine automatische Änderung. | detected |
| QF-2026-0055 | F | P3 | high | azure-0876 | „Groups NSG“ als unklarer Kurzpunkt | Human Review; keine automatische Änderung. | detected |
| QF-2026-0056 | F | P2 | high | azure-1044 | Externer Bildlink als eigener Knoten | Bildherkunft, Lizenz und dauerhafte lokale/Quellenablage prüfen; nicht automatisch entfernen. | detected |
| QF-2026-0057 | F | P2 | high | azure-1051, azure-1052, azure-1053, azure-1054 | CAF-Phasen nur als nummerierte Kurzblätter | Human Review; keine automatische Änderung. | detected |
| QF-2026-0058 | F | P3 | high | azure-0606 | „CLI-Tool (Kommandozeile)“ als eigenes Blatt | Human Review; keine automatische Änderung. | detected |
| QF-2026-0060 | F | P2 | high | azure-0653, azure-0654 | Migrationsziele als tiefe Produkt-Duplikate | Spätere semantische Referenzen zu bestehenden Produktknoten prüfen; keine automatische Änderung. | detected |
| QF-2026-0061 | G | P1 | high | azure-0412, azure-0415, azure-0425 | Fehlender kanonischer Knoten: Azure Container Apps | Class-B-Proposal für einen eigenständigen Knoten „Azure Container Apps“ erstellen; erst nach Human Review und expliziter Freigabe umsetzen. | detected |
| QF-2026-0062 | G | P1 | high | azure-0579 | Fehlender kanonischer Knoten: Shared Access Signatures (SAS) | Class-B-Proposal für einen eigenständigen Knoten „Shared Access Signatures (SAS)“ erstellen; erst nach Human Review und expliziter Freigabe umsetzen. | detected |
| QF-2026-0063 | G | P1 | high | azure-0579 | Fehlender kanonischer Knoten: Storage Account Access Keys / Shared Key | Class-B-Proposal für einen eigenständigen Knoten „Storage Account Access Keys / Shared Key“ erstellen; erst nach Human Review und expliziter Freigabe umsetzen. | detected |
| QF-2026-0064 | G | P2 | high | azure-0573 | Fehlender kanonischer Knoten: Storage Lifecycle Management | Class-B-Proposal für einen eigenständigen Knoten „Storage Lifecycle Management“ erstellen; erst nach Human Review und expliziter Freigabe umsetzen. | detected |
| QF-2026-0065 | G | P1 | high | azure-0983, azure-0985 | Fehlender kanonischer Knoten: Diagnostic Settings | Class-B-Proposal für einen eigenständigen Knoten „Diagnostic Settings“ erstellen; erst nach Human Review und expliziter Freigabe umsetzen. | detected |
| QF-2026-0066 | G | P2 | high | azure-0983, azure-0985 | Fehlender kanonischer Knoten: Data Collection Rules | Class-B-Proposal für einen eigenständigen Knoten „Data Collection Rules“ erstellen; erst nach Human Review und expliziter Freigabe umsetzen. | detected |
| QF-2026-0067 | G | P2 | high | azure-0979, azure-0988 | Fehlender kanonischer Knoten: Azure Workbooks | Class-B-Proposal für einen eigenständigen Knoten „Azure Workbooks“ erstellen; erst nach Human Review und expliziter Freigabe umsetzen. | detected |
| QF-2026-0068 | G | P1 | high | azure-0999 | Fehlender kanonischer Knoten: Azure Resource Health | Class-B-Proposal für einen eigenständigen Knoten „Azure Resource Health“ erstellen; erst nach Human Review und expliziter Freigabe umsetzen. | detected |
| QF-2026-0069 | G | P2 | high | azure-0815, azure-0821 | Fehlender kanonischer Knoten: Zero Trust | Class-B-Proposal für einen eigenständigen Knoten „Zero Trust“ erstellen; erst nach Human Review und expliziter Freigabe umsetzen. | detected |
| QF-2026-0070 | G | P2 | high | azure-0934, azure-0936 | Fehlender kanonischer Knoten: Secure Score | Class-B-Proposal für einen eigenständigen Knoten „Secure Score“ erstellen; erst nach Human Review und expliziter Freigabe umsetzen. | detected |
| QF-2026-0072 | G | P1 | high | azure-0979, azure-0984, azure-1000 | Fehlender kanonischer Knoten: Incident Response und Runbooks | Class-B-Proposal für einen eigenständigen Knoten „Incident Response und Runbooks“ erstellen; erst nach Human Review und expliziter Freigabe umsetzen. | detected |

## Alle Human-Context-Required-Findings


### QF-2026-0073 – Unklarer Knoten „Autentication“

- IDs: `azure-0907`
- Kontextproblem: Der Tippfehler kann Authentication, einen Oberbegriff oder eine persönliche Kapitelmarke meinen. Ohne Kontext darf weder umbenannt noch mit einem bestehenden Identity-Knoten zusammengeführt werden.
- Evidenz: Azure - AZ-900 (Fundamentals) > Azure Security & Protection Architecture > Cloud Azure identity Services > Microsoft Entra ID > Autentication
- Erforderliche Entscheidung: Owner klärt die ursprüngliche Bedeutung und entscheidet zwischen Korrektur, Alias, Verknüpfung oder Archivierung.


### QF-2026-0074 – Bedeutungsabgrenzung Trust Center / Trust Portal

- IDs: `azure-1003`, `azure-1004`
- Kontextproblem: Beide Knoten sind leer und ähnlich benannt. Es ist nicht erkennbar, ob zwei verschiedene Portale, historische Bezeichnungen oder ein Duplikat gemeint sind.
- Evidenz: Azure - AZ-900 (Fundamentals) > Azure Security & Protection Architecture > Privacy, compliance and data protection standards > Trust Center; Azure - AZ-900 (Fundamentals) > Azure Security & Protection Architecture > Privacy, compliance and data protection standards > Trust Portal
- Erforderliche Entscheidung: Ursprüngliche Quelle/Absicht durch Human Owner klären; bis dahin beide IDs behalten.


### QF-2026-0075 – Bedeutung von „Legacy / optional“ bei Service Fabric

- IDs: `azure-0336`
- Kontextproblem: Unklar ist, ob „Legacy“ eine persönliche Architekturpräferenz, eine Prüfungsnotiz oder ein behaupteter Produktstatus ist.
- Evidenz: Azure - AZ-900 (Fundamentals) > Core Azure Services > Azure Architectural Components > Azure Services and Products > Azure Compute > Azure Service Fabric (Legacy / optional)
- Erforderliche Entscheidung: Owner klärt beabsichtigte Aussage; Microsoft-Produktstatus separat fachlich prüfen.


### QF-2026-0076 – Sentinel-Zuordnung zur Defender-XDR-Suite

- IDs: `azure-0941`
- Kontextproblem: Die knappe Aussage „part of Microsoft Defender XDR suite“ kann Portal-Integration, Produktzugehörigkeit oder Lizenzierung meinen und ist ohne Kontext riskant.
- Evidenz: Azure - AZ-900 (Fundamentals) > Azure Security & Protection Architecture > Azure Security Tools and Features > Microsoft Sentinel (SIEM-security information and event management) > detects threats using AI and built-in analytics > part of the Microsoft Defender XDR suite
- Erforderliche Entscheidung: Beabsichtigte Aussage und aktuelle Microsoft-Terminologie durch Security-Owner klären.


### QF-2026-0077 – Unklare Subscription-Option „BizPark“

- IDs: `azure-1018`
- Kontextproblem: Die Bezeichnung kann ein Tippfehler, historisches Programm oder persönliche Erinnerung sein. Eine sichere fachliche Zuordnung ist aus dem Knoten nicht möglich.
- Evidenz: Azure - AZ-900 (Fundamentals) > Azure Pricing, Service level agreements and Lifecycle > Azure Subscriptions > Subscriptions Options > Visual Studio Enterprise: BizPark
- Erforderliche Entscheidung: Originalkontext durch Owner klären; nicht automatisch korrigieren oder löschen.


## Cluster

| Cluster | Findings | Gemeinsame Review-Aktion |
| --- | --- | --- |
| CL-ANALOGIES | 3 | Späteren Review auf einmalige Analogie plus Verweise prüfen; keine automatische Änderung. |
| CL-ANALOGY-FRAGMENTS | 2 | Human Review; keine automatische Änderung. |
| CL-ASSET-FRAGMENTS | 1 | Bildherkunft, Lizenz und dauerhafte lokale/Quellenablage prüfen; nicht automatisch entfernen. |
| CL-CAF-FRAGMENTS | 1 | Human Review; keine automatische Änderung. |
| CL-DUPLICATES | 22 | Möglichen kanonischen Zielknoten azure-0005 prüfen; einzigartige Inhalte und alle Referenzen vor einer späteren Merge-Entscheidung sichern. |
| CL-GENERIC-CONTAINERS | 2 | Human Review; keine automatische Änderung. |
| CL-HIERARCHY | 8 | Vorgeschlagenen Zielkontext fachlich prüfen: Azure > Governance > Resource organization > Management Groups. Keine Verschiebung in V2.4. |
| CL-HUMAN-CONTEXT | 5 | Owner klärt die ursprüngliche Bedeutung und entscheidet zwischen Korrektur, Alias, Verknüpfung oder Archivierung. |
| CL-KNOWLEDGE-GAPS | 12 | Class-B-Proposal für einen eigenständigen Knoten „Azure Container Apps“ erstellen; erst nach Human Review und expliziter Freigabe umsetzen. |
| CL-LEGACY-NAMING | 2 | Aktuelle Bezeichnung Microsoft Entra ID priorisieren und Azure AD nur als dokumentierten historischen Alias erhalten, falls freigegeben. |
| CL-MIGRATION-FRAGMENTS | 1 | Spätere semantische Referenzen zu bestehenden Produktknoten prüfen; keine automatische Änderung. |
| CL-OUTDATED | 8 | Als historischen/retired Dienst kennzeichnen und aktuelle Analysealternativen erst nach separater fachlicher Freigabe verlinken. |
| CL-PERSONAL-REMINDERS | 3 | Als Lernnotiz/Analogie kennzeichnen oder bei späterer Freigabe in den kanonischen Idempotenz-Knoten integrieren; Originaltext archivieren. |
| CL-SHORT-FRAGMENTS | 4 | Human Review; keine automatische Änderung. |
| CL-STORAGE-FRAGMENTS | 3 | Als mögliche Aliase/Navigationseinträge gegen die angereicherten Knoten prüfen; keine automatische Konsolidierung. |

## Cleanup Proposal Summary

- Phase 1 (nur nach Freigabe): Retirement- und Terminologiehinweise aktualisieren, ohne IDs zu entfernen.
- Phase 2 (separater Class-C/D-Change): Duplikate feldweise vergleichen, Mapping und Referenzmigration entwerfen.
- Phase 3 (separater Class-C-Change): Hierarchieverschiebungen als navigationsbezogene Migration planen.
- Phase 4 (Class-B-Proposals): fehlende Architekturbegriffe einzeln genehmigen oder ablehnen.
- Phase 5: bestätigte Muster als Detection Rules vorschlagen; weiterhin ohne automatische Bereinigung.

Keine dieser Phasen ist durch V2.4 freigegeben.
