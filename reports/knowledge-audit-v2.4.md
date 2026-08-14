# Azure Digital Brain V2.4 – Knowledge Base Audit

> V2.4 ist ausschließlich ein nicht-destruktiver Audit. Kein Finding ist eine Änderungsfreigabe. Knoten, IDs, Hierarchie, Relationen, Quellen, Szenarien und Lernpfade bleiben unverändert.

## Executive Summary

Der vollständige Scan hat **1058/1058 Knoten**, **243 Beziehungen**, **155 Quellen**, Szenario-Referenzen und Lernpfad-Referenzen geprüft. Aus mehreren Signalen wurden bewusst nur **77 reviewfähige Findings** erzeugt; pauschale Kurztext- oder Keyword-Treffer wurden nicht als Findings übernommen.

| Kategorie | Anzahl |
| --- | --- |
| A – Sicheres Duplikat | 16 |
| B – Wahrscheinliches Duplikat | 6 |
| C – Legacy/Reminder | 8 |
| D – Hierarchie | 8 |
| E – Veraltet | 8 |
| F – Fragment | 14 |
| G – Fehlender Knoten | 12 |
| H – Human Context | 5 |

| Priorität | Anzahl |
| --- | --- |
| P1 | 34 |
| P2 | 25 |
| P3 | 18 |

| Confidence | Anzahl |
| --- | --- |
| high | 54 |
| low | 6 |
| medium | 17 |

- Human Context Required (H): **5**
- Awaiting Review: **21**
- Finding-Cluster: **15**
- Automatische Änderungen: **0**

## Audit-Abdeckung

- Node-Felder: id, title, domain, category, subcategory, description.simple, description.technical, description.architecture, why_important, parent, children, tags, aliases, relations, examples, merksatz, analogy, sources, metadata, origin, legacy
- Hierarchietiefe: Level 0: 1; Level 1: 7; Level 2: 22; Level 3: 88; Level 4: 186; Level 5: 185; Level 6: 198; Level 7: 140; Level 8: 148; Level 9: 76; Level 10: 7
- Eindeutige Szenario-Knotenreferenzen: 44
- Eindeutige Lernpfad-Knotenreferenzen: 72
- Kanonische Quellen: 155; ungültiges URL-Format: 0; doppelte URLs: 0; ungenutzte Quellen: 0
- Für Current-State-/Gap-Findings geprüfte offizielle Quellen: 20
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
| QF-2026-0017 | B | P1 | medium | azure-0007, azure-0244, azure-0267 | Availability Zones in drei Lernkontexten | Möglichen kanonischen Zielknoten azure-0007 prüfen; einzigartige Inhalte und alle Referenzen vor einer späteren Merge-Entscheidung sichern. | detected |
| QF-2026-0018 | B | P1 | medium | azure-0215, azure-0351 | Azure App Services / Azure App Service | Möglichen kanonischen Zielknoten azure-0351 prüfen; einzigartige Inhalte und alle Referenzen vor einer späteren Merge-Entscheidung sichern. | detected |
| QF-2026-0019 | B | P1 | medium | azure-0254, azure-0269 | Region Pairs / Region Pair | Möglichen kanonischen Zielknoten azure-0254 prüfen; einzigartige Inhalte und alle Referenzen vor einer späteren Merge-Entscheidung sichern. | detected |
| QF-2026-0020 | B | P1 | medium | azure-0597, azure-0713 | SMB-Protokoll / SMB Protocol | Möglichen kanonischen Zielknoten azure-0597 prüfen; einzigartige Inhalte und alle Referenzen vor einer späteren Merge-Entscheidung sichern. | detected |
| QF-2026-0021 | B | P1 | medium | azure-0566, azure-0657 | Zwei Azure-Storage-Einstiege | Möglichen kanonischen Zielknoten azure-0566 prüfen; einzigartige Inhalte und alle Referenzen vor einer späteren Merge-Entscheidung sichern. | detected |
| QF-2026-0022 | B | P1 | low | azure-0442, azure-0864 | VNet-Konzept in Core- und Security-Kontext | Möglichen kanonischen Zielknoten azure-0442 prüfen; einzigartige Inhalte und alle Referenzen vor einer späteren Merge-Entscheidung sichern. | detected |
| QF-2026-0023 | C | P3 | high | azure-0310 | Persönlich formulierte Idempotenz-Eselsbrücke | Als Lernnotiz/Analogie kennzeichnen oder bei späterer Freigabe in den kanonischen Idempotenz-Knoten integrieren; Originaltext archivieren. | detected |
| QF-2026-0024 | C | P2 | medium | azure-0050 | Frageform als kanonischer Fachknoten | Human Review, ob die Frage als Lernfrage erhalten oder später in einen neutral benannten Vergleichsknoten überführt werden soll. | detected |
| QF-2026-0025 | C | P3 | high | azure-0982 | Tags als persönliche Frageform | Human Review; keine automatische Änderung. | detected |
| QF-2026-0026 | C | P3 | high | azure-0366, azure-0386 | Doppelte Koch-Analogie im App-Service-Ast | Späteren Review auf einmalige Analogie plus Verweise prüfen; keine automatische Änderung. | detected |
| QF-2026-0027 | C | P3 | high | azure-0374, azure-0382 | Doppelte Wohnblock/Hausmeister-Analogie | Human Review; keine automatische Änderung. | detected |
| QF-2026-0028 | C | P3 | high | azure-0392, azure-0406 | Doppelte Burger-Skalierungsanalogie | Human Review; keine automatische Änderung. | detected |
| QF-2026-0029 | C | P3 | medium | azure-0190, azure-0823 | Historische Azure-AD-Bezeichnung in Erinnerungstexten | Aktuelle Bezeichnung Microsoft Entra ID priorisieren und Azure AD nur als dokumentierten historischen Alias erhalten, falls freigegeben. | detected |
| QF-2026-0030 | C | P2 | high | azure-0959, azure-0960 | Azure ATP als historischer Produktname | Legacy-Alias erhalten, aber Navigation langfristig auf den aktuellen Produktnamen ausrichten; nur nach Human Review. | detected |
| QF-2026-0031 | D | P1 | high | azure-1022 | Management Groups unter Pricing/Subscriptions | Vorgeschlagenen Zielkontext fachlich prüfen: Azure > Governance > Resource organization > Management Groups. Keine Verschiebung in V2.4. | detected |
| QF-2026-0032 | D | P1 | high | azure-0645, azure-0722 | Azure Migrate unter Azure Storage | Vorgeschlagenen Zielkontext fachlich prüfen: Azure > Migration and modernization > Azure Migrate. Keine Verschiebung in V2.4. | detected |
| QF-2026-0033 | D | P2 | medium | azure-0738 | Database Migration Service im allgemeinen Datenbankast | Vorgeschlagenen Zielkontext fachlich prüfen: Azure > Migration and modernization > Database migration. Keine Verschiebung in V2.4. | detected |
| QF-2026-0034 | D | P1 | high | azure-0979 | Monitoring/Operations unter Security-Hauptbereich | Vorgeschlagenen Zielkontext fachlich prüfen: Azure > Management and Governance > Monitoring, Observability and Operations. Keine Verschiebung in V2.4. | detected |
| QF-2026-0035 | D | P2 | high | azure-0766 | IoT Hub als Kind eines Data-Lake-Analytics-Beispiels | Vorgeschlagenen Zielkontext fachlich prüfen: Azure > Integration / IoT > IoT Hub oder als reines Beispielfeld beim Analytics-Knoten. Keine Verschiebung in V2.4. | detected |
| QF-2026-0036 | D | P2 | high | azure-0803 | Azure Lab Services unter Azure DevOps | Vorgeschlagenen Zielkontext fachlich prüfen: Azure > Specialized services > Lab environments. Keine Verschiebung in V2.4. | detected |
| QF-2026-0037 | D | P2 | medium | azure-0336 | Service Fabric pauschal als Legacy/optional unter Compute | Vorgeschlagenen Zielkontext fachlich prüfen: Azure > Compute > Container and distributed systems > Service Fabric. Keine Verschiebung in V2.4. | detected |
| QF-2026-0038 | D | P3 | medium | azure-0948 | Azure Information Protection im Security-Tool-Ast ohne Purview-Kontext | Vorgeschlagenen Zielkontext fachlich prüfen: Microsoft Security > Data security and compliance > Microsoft Purview Information Protection. Keine Verschiebung in V2.4. | detected |
| QF-2026-0039 | E | P1 | high | azure-0764, azure-0765, azure-0766 | Azure Data Lake Analytics ist eingestellt | Als historischen/retired Dienst kennzeichnen und aktuelle Analysealternativen erst nach separater fachlicher Freigabe verlinken. | detected |
| QF-2026-0040 | E | P1 | high | azure-0803, azure-0804 | Azure Lab Services wird eingestellt | Retirement-Status und Übergangsbedarf in einem späteren Content-Change ergänzen; keine automatische Entfernung. | detected |
| QF-2026-0041 | E | P1 | high | azure-0049, azure-0972, azure-0973 | Azure Blueprints Retirement-Zeitplan aktualisieren | Historische Inhalte erhalten, Retirement-Datum und aktuelle Migrationsrichtung nach Review ergänzen. | detected |
| QF-2026-0042 | E | P2 | high | azure-0926 | Azure AD B2C Status präzisieren | Formulierung und Zeitbezug regelmäßig verifizieren; External ID als aktuelle Richtung beibehalten. | detected |
| QF-2026-0043 | E | P2 | high | azure-0959 | Azure Advanced Threat Protection ist historischer Name | Langfristig aktuellen Produktknoten als Navigationseinstieg prüfen und Legacy-Namen als Alias bewahren. | detected |
| QF-2026-0044 | E | P2 | medium | azure-1003, azure-1004 | Trust Center / Trust Portal Terminologie unklar | Gegen aktuelle Microsoft-Terminologie prüfen; Bedeutung beider historischen Knoten vor jeder Konsolidierung klären. | detected |
| QF-2026-0045 | E | P2 | medium | azure-0336, azure-0346, azure-0348 | Service Fabric als pauschal Legacy dargestellt | Pauschale Legacy-Aussage fachlich reviewen und gegebenenfalls als Architektur-Trade-off statt Produktstatus formulieren. | detected |
| QF-2026-0046 | E | P2 | medium | azure-0948 | AIP-Bezeichnung benötigt Purview-Einordnung | Aktuellen Produktkontext und historischen Alias nach fachlicher Prüfung dokumentieren. | detected |
| QF-2026-0047 | F | P2 | high | azure-0706, azure-0707, azure-0708, azure-0710 | Redundanz-Akronyme als isolierte Kurzfragmente | Als mögliche Aliase/Navigationseinträge gegen die angereicherten Knoten prüfen; keine automatische Konsolidierung. | detected |
| QF-2026-0048 | F | P3 | high | azure-0704 | Eigener Knoten nur für „Merksatz“ | Human Review; keine automatische Änderung. | detected |
| QF-2026-0049 | F | P3 | high | azure-0416, azure-0426 | Generischer Container „Beschreibung“ | Human Review; keine automatische Änderung. | detected |
| QF-2026-0050 | F | P3 | high | azure-0619 | „Big Data & KI“ als isoliertes Blatt | Human Review; keine automatische Änderung. | detected |
| QF-2026-0051 | F | P3 | high | azure-0788, azure-0781, azure-0791 | Analogie-Blätter unter Eventdiensten | Human Review; keine automatische Änderung. | detected |
| QF-2026-0052 | F | P3 | medium | azure-0290 | SDK-Analogie als eigener Fachknoten | Human Review; keine automatische Änderung. | detected |
| QF-2026-0053 | F | P3 | medium | azure-0845 | „Netzwerkfilter“ als eigenes Blatt | Human Review; keine automatische Änderung. | detected |
| QF-2026-0054 | F | P3 | high | azure-1006 | „Dashboard“ als unqualifiziertes Blatt | Human Review; keine automatische Änderung. | detected |
| QF-2026-0055 | F | P3 | high | azure-0876 | „Groups NSG“ als unklarer Kurzpunkt | Human Review; keine automatische Änderung. | detected |
| QF-2026-0056 | F | P2 | high | azure-1044 | Externer Bildlink als eigener Knoten | Bildherkunft, Lizenz und dauerhafte lokale/Quellenablage prüfen; nicht automatisch entfernen. | detected |
| QF-2026-0057 | F | P2 | high | azure-1051, azure-1052, azure-1053, azure-1054 | CAF-Phasen nur als nummerierte Kurzblätter | Human Review; keine automatische Änderung. | detected |
| QF-2026-0058 | F | P3 | high | azure-0606 | „CLI-Tool (Kommandozeile)“ als eigenes Blatt | Human Review; keine automatische Änderung. | detected |
| QF-2026-0059 | F | P3 | medium | azure-0641 | „Offline-Import nach Azure Storage“ als isoliertes Blatt | Human Review; keine automatische Änderung. | detected |
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
| QF-2026-0071 | G | P2 | medium | azure-0934 | Fehlender kanonischer Knoten: Vulnerability Assessment | Class-B-Proposal für einen eigenständigen Knoten „Vulnerability Assessment“ erstellen; erst nach Human Review und expliziter Freigabe umsetzen. | detected |
| QF-2026-0072 | G | P1 | high | azure-0979, azure-0984, azure-1000 | Fehlender kanonischer Knoten: Incident Response und Runbooks | Class-B-Proposal für einen eigenständigen Knoten „Incident Response und Runbooks“ erstellen; erst nach Human Review und expliziter Freigabe umsetzen. | detected |
| QF-2026-0073 | H | P2 | low | azure-0907 | Unklarer Knoten „Autentication“ | Owner klärt die ursprüngliche Bedeutung und entscheidet zwischen Korrektur, Alias, Verknüpfung oder Archivierung. | awaiting_review |
| QF-2026-0074 | H | P2 | low | azure-1003, azure-1004 | Bedeutungsabgrenzung Trust Center / Trust Portal | Ursprüngliche Quelle/Absicht durch Human Owner klären; bis dahin beide IDs behalten. | awaiting_review |
| QF-2026-0075 | H | P2 | low | azure-0336 | Bedeutung von „Legacy / optional“ bei Service Fabric | Owner klärt beabsichtigte Aussage; Microsoft-Produktstatus separat fachlich prüfen. | awaiting_review |
| QF-2026-0076 | H | P2 | low | azure-0941 | Sentinel-Zuordnung zur Defender-XDR-Suite | Beabsichtigte Aussage und aktuelle Microsoft-Terminologie durch Security-Owner klären. | awaiting_review |
| QF-2026-0077 | H | P3 | low | azure-1018 | Unklare Subscription-Option „BizPark“ | Originalkontext durch Owner klären; nicht automatisch korrigieren oder löschen. | awaiting_review |

## Grenzen

- Der Audit bewertet die kanonische Projektbasis, nicht private Browser-Speicherstände.
- Eine semantische Ähnlichkeit ist keine Merge-Freigabe.
- Current-State-Checks sind eine Momentaufnahme vom 13. August 2026 und benötigen vor späteren Änderungen erneute Quellenprüfung.
- Der Audit endet bei Review Package; es wurden keine Cleanup-Aktionen ausgeführt.
