# Azure Digital Brain V2.4 – Legacy & Fragment Audit

> V2.4 ist ausschließlich ein nicht-destruktiver Audit. Kein Finding ist eine Änderungsfreigabe. Knoten, IDs, Hierarchie, Relationen, Quellen, Szenarien und Lernpfade bleiben unverändert.

## Kategorien C, E, F und H

| ID | Kat. | Prio | Confidence | Knoten | Finding | Vorschlag | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| QF-2026-0023 | C | P3 | high | azure-0310 | Persönlich formulierte Idempotenz-Eselsbrücke | Als Lernnotiz/Analogie kennzeichnen oder bei späterer Freigabe in den kanonischen Idempotenz-Knoten integrieren; Originaltext archivieren. | detected |
| QF-2026-0024 | C | P2 | medium | azure-0050 | Frageform als kanonischer Fachknoten | Human Review, ob die Frage als Lernfrage erhalten oder später in einen neutral benannten Vergleichsknoten überführt werden soll. | detected |
| QF-2026-0025 | C | P3 | high | azure-0982 | Tags als persönliche Frageform | Human Review; keine automatische Änderung. | detected |
| QF-2026-0026 | C | P3 | high | azure-0366, azure-0386 | Doppelte Koch-Analogie im App-Service-Ast | Späteren Review auf einmalige Analogie plus Verweise prüfen; keine automatische Änderung. | detected |
| QF-2026-0027 | C | P3 | high | azure-0374, azure-0382 | Doppelte Wohnblock/Hausmeister-Analogie | Human Review; keine automatische Änderung. | detected |
| QF-2026-0028 | C | P3 | high | azure-0392, azure-0406 | Doppelte Burger-Skalierungsanalogie | Human Review; keine automatische Änderung. | detected |
| QF-2026-0029 | C | P3 | medium | azure-0190, azure-0823 | Historische Azure-AD-Bezeichnung in Erinnerungstexten | Aktuelle Bezeichnung Microsoft Entra ID priorisieren und Azure AD nur als dokumentierten historischen Alias erhalten, falls freigegeben. | detected |
| QF-2026-0030 | C | P2 | high | azure-0959, azure-0960 | Azure ATP als historischer Produktname | Legacy-Alias erhalten, aber Navigation langfristig auf den aktuellen Produktnamen ausrichten; nur nach Human Review. | detected |
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
| QF-2026-0073 | H | P2 | low | azure-0907 | Unklarer Knoten „Autentication“ | Owner klärt die ursprüngliche Bedeutung und entscheidet zwischen Korrektur, Alias, Verknüpfung oder Archivierung. | awaiting_review |
| QF-2026-0074 | H | P2 | low | azure-1003, azure-1004 | Bedeutungsabgrenzung Trust Center / Trust Portal | Ursprüngliche Quelle/Absicht durch Human Owner klären; bis dahin beide IDs behalten. | awaiting_review |
| QF-2026-0075 | H | P2 | low | azure-0336 | Bedeutung von „Legacy / optional“ bei Service Fabric | Owner klärt beabsichtigte Aussage; Microsoft-Produktstatus separat fachlich prüfen. | awaiting_review |
| QF-2026-0076 | H | P2 | low | azure-0941 | Sentinel-Zuordnung zur Defender-XDR-Suite | Beabsichtigte Aussage und aktuelle Microsoft-Terminologie durch Security-Owner klären. | awaiting_review |
| QF-2026-0077 | H | P3 | low | azure-1018 | Unklare Subscription-Option „BizPark“ | Originalkontext durch Owner klären; nicht automatisch korrigieren oder löschen. | awaiting_review |

## Konservative Bewertung

- Persönlich formulierte Merksätze und Analogien können lernwirksam sein und werden nicht als Abfall behandelt.
- Kurze Knoten sind nicht automatisch schlecht. Ein Finding entstand nur bei zusätzlichem Signal: paralleler Produktknoten, reines Feldlabel, Asset-Link, unklare Abkürzung oder fehlender eigenständiger Scope.
- Legacy-Begriffe bleiben als historische Aliase wertvoll. Current-State-Quellen begründen höchstens einen Review, nie eine automatische Entfernung.
- Kategorie H bewahrt die ursprüngliche Bedeutung, wenn Automation sie nicht sicher bestimmen kann.

## Offizielle Current-State-Quellen

- QF-2026-0039: [Azure Data Lake Analytics ist eingestellt](https://learn.microsoft.com/en-us/sql/integration-services/connection-manager/azure-data-lake-analytics-connection-manager?view=sql-server-ver17)
- QF-2026-0040: [Azure Lab Services wird eingestellt](https://learn.microsoft.com/en-us/azure/lab-services/retirement-guide)
- QF-2026-0041: [Azure Blueprints Retirement-Zeitplan aktualisieren](https://learn.microsoft.com/en-us/azure/governance/blueprints/overview)
- QF-2026-0042: [Azure AD B2C Status präzisieren](https://learn.microsoft.com/en-us/azure/active-directory-b2c/faq)
- QF-2026-0043: [Azure Advanced Threat Protection ist historischer Name](https://learn.microsoft.com/en-us/defender-for-identity/what-is)
- QF-2026-0044: [Trust Center / Trust Portal Terminologie unklar](https://learn.microsoft.com/en-us/purview/get-started-with-service-trust-portal)
- QF-2026-0045: [Service Fabric als pauschal Legacy dargestellt](https://learn.microsoft.com/en-us/azure/service-fabric/service-fabric-overview)
- QF-2026-0046: [AIP-Bezeichnung benötigt Purview-Einordnung](https://learn.microsoft.com/en-us/purview/information-protection)
