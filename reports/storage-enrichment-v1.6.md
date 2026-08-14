# Azure Digital Brain V1.6 – Storage & Data Architecture Enrichment Pilot

Stand: 11. August 2026  
Redaktionsgrundlage: Content Standard V1.0  
Leitfrage: **Wie speichern, schützen, replizieren und verwalten wir Daten in Azure?**

## Ergebnisübersicht

V1.6 reichert 24 vorhandene Storage-, Data- und Datenbankknoten an und ergänzt 26 semantische Architekturbeziehungen. Es wurden keine Knoten angelegt, entfernt oder verschoben. Alle 1.058 IDs und zehn Hierarchieebenen bleiben erhalten; Datenmodell, Buildprozess und Oberfläche sind unverändert.

| Kennzahl | V1.5 | V1.6 |
|---|---:|---:|
| Knoten gesamt | 1.058 | 1.058 |
| Hierarchieebenen | 10 | 10 |
| neue Storage-/Data-Pilotknoten | – | 24 |
| neue Erklärungstexte | – | 72 |
| neue Praxisbeispiele | – | 24 |
| neue Merksätze | – | 24 |
| Beziehungen gesamt | 159 | 185 |
| neue Storage-Beziehungen | – | 26 |
| Relationstypen gesamt | 36 | 36 |
| neue Relationstypen | – | 0 |
| Quellen gesamt | 95 | 117 |
| neue offizielle Quellen | – | 22 |
| neue oder entfernte Knoten | 0 | 0 |

## Pilotumfang und angereicherte Knoten

### Storage-Grundlagen, Account und Blob

| ID | Titel | Architekturkern |
|---|---|---|
| `azure-0566` | Azure Storage | Datenmodell, Zugriff, Schutz, Redundanz und Lifecycle gemeinsam entscheiden |
| `azure-0571` | Azure Blob Storage | Objektspeicher vs. Filesystem/Datenbank; Private Access und Data Protection |
| `azure-0579` | Storage Account | Account als Blast-Radius-, Policy-, Netzwerk-, Schlüssel- und Quotengrenze |
| `azure-0583` | Blob Container | sinnvolle Grenze für Berechtigungen, Organisation und Lifecycle |

### Lifecycle und Kosten

| ID | Titel | Architekturkern |
|---|---|---|
| `azure-0574` | Blob Access Tiers | Zugriffshäufigkeit, Abrufzeit, Aufbewahrung und Gesamtkosten |
| `azure-0575` | Hot Tier | aktive Daten, niedrige Zugriffskosten, höhere Kapazitätskosten |
| `azure-0576` | Cool Tier | seltene Online-Daten, höhere Zugriffs- und Mindestaufbewahrungskosten |
| `azure-0578` | Archive Tier | Offline-Daten, Rehydratisierung und großzügiges RTO |

Lifecycle Management wurde in den vorhandenen Access-Tier- und Blob-Knoten erklärt. Ein eigenständiger Knoten existiert in V1.5 nicht und wurde deshalb nicht erzeugt.

### Verfügbarkeit, Haltbarkeit und Disaster Recovery

| ID | Titel | Architekturkern |
|---|---|---|
| `azure-0584` | Storage-Redundanz | Redundanz vs. Backup; Ausfallmodell, RPO, RTO und Datenresidenz |
| `azure-0585` | LRS | lokale Hardwarefehler, kein Zonen- oder Regionsschutz |
| `azure-0587` | ZRS | synchroner Schutz über Zonen einer Region |
| `azure-0589` | GRS | asynchrone zweite Region und mögliches Datenverlustfenster |
| `azure-0592` | GZRS | Zonenresilienz plus Georeplikation; DR bleibt Betriebsaufgabe |

Die Architecture-Ebene trennt drei häufig vermischte Begriffe:

- **Durability:** Wahrscheinlichkeit, dass gespeicherte Daten dauerhaft erhalten bleiben.
- **Availability:** Wahrscheinlichkeit, dass der Dienst beziehungsweise Endpunkt erreichbar ist.
- **Disaster Recovery:** geplanter Prozess, um nach einem schweren Ausfall wieder arbeitsfähig zu werden.

Redundanz schützt gegen Infrastrukturfehler. Versioning, Soft Delete und Backup adressieren andere Verlustszenarien und ersetzen sich nicht gegenseitig.

### Files, Analytics und Messaging

| ID | Titel | Architekturkern |
|---|---|---|
| `azure-0596` | Azure Files | verwaltete SMB/NFS-Freigabe vs. Blob-Objektspeicher |
| `azure-0601` | Azure File Sync | Azure Files als Cloud-Hub, Windows Server als lokaler Cache |
| `azure-0616` | Azure Data Lake Storage | Blob-Basis mit hierarchischem Namespace für Analytics |
| `azure-0624` | Azure Queue Storage | einfache Work Queue, Idempotenz und Abgrenzung zu Service Bus |
| `azure-0632` | Azure Table Storage | schemaloser Key-Value-Dienst, Partition Key als Designentscheidung |

### Migration und Datenbanken

| ID | Titel | Architekturkern |
|---|---|---|
| `azure-0637` | Datenmigration nach Azure | Online/Offline, Delta, Validierung, Cutover und Rollback |
| `azure-0638` | Azure Data Box | Bulk offline; Deltas und Cutover bleiben separat |
| `azure-0645` | Azure Migrate | Discovery und Assessment statt automatischer Zielarchitektur |
| `azure-0724` | Azure Cosmos DB | Partition Key, Konsistenz, Regionen und Request-Unit-Kosten |
| `azure-0731` | Azure SQL Database | relationales PaaS und geteilte Betriebsverantwortung |
| `azure-0738` | Azure Database Migration Service | Datenübertragung vs. Kompatibilität, Cutover und Abnahme |

Die redundanten Detailnennungen `azure-0653`, `azure-0654`, `azure-0677`, `azure-0712`, `azure-0718`, `azure-0719`, `azure-0721` und `azure-0722` bleiben als historische Mindmap-Inhalte erhalten. Sie wurden weder zusammengeführt noch verschoben.

Azure Managed Disks (`azure-0567`, `azure-0568`) wurden bereits in V1.4 als Compute-Architekturbrücke angereichert. V1.6 überschreibt diese Inhalte nicht; die vorhandene Beziehung **Virtual Machine uses Azure Managed Disks** bleibt unverändert.

## Erklärungstexte und Content Standard

Jeder der 24 Pilotknoten besitzt:

- eine einfache Erklärung mit zwei bis vier verständlichen Sätzen,
- eine technische Erklärung zu Funktionsweise, Komponenten, Zugriff und Grenzen,
- eine Architecture-Erklärung zu Einsatz, Alternativen, Trade-offs und Betriebsverantwortung,
- `why_important`,
- ein Praxisbeispiel,
- einen Merksatz,
- mindestens eine offizielle Microsoft-Quelle.

Insgesamt wurden 72 Erklärungstexte, 24 Praxisbeispiele und 24 Merksätze ergänzt. Analogien wurden nicht neu erzeugt; historische Analogien bleiben im Legacy-Inhalt erhalten.

Besonders vertieft wurden:

- Public Endpoint vs. Private Endpoint,
- Microsoft Entra ID/RBAC vs. SAS vs. Storage Account Keys,
- serverseitige Verschlüsselung und Kundenverantwortung für Schlüsseloptionen,
- LRS/ZRS/GRS/GZRS einschließlich Failover- und Datenverlustfenster,
- Hot/Cool/Archive einschließlich Rehydratisierung und Lifecycle-Kosten,
- Soft Delete, Versioning und Backup als getrennte Schutzebenen,
- Azure Files vs. Blob Storage,
- Table Storage vs. Cosmos DB,
- Azure SQL Database vs. Cosmos DB,
- Online- vs. Offline-Datenmigration.

## Neue semantische Beziehungen

### Storage-Struktur und Lifecycle

| ID | Aussage |
|---|---|
| `storage-rel-001` | Azure Storage `contains` Azure Blob Storage |
| `storage-rel-002` | Azure Storage `contains` Azure Files |
| `storage-rel-003` | Azure Storage `contains` Azure Data Lake Storage |
| `storage-rel-004` | Azure Storage `contains` Azure Queue Storage |
| `storage-rel-005` | Azure Storage `contains` Azure Table Storage |
| `storage-rel-006` | Storage Account `contains` Blob Container |
| `storage-rel-007` | Blob Access Tiers `part_of` Azure Blob Storage |
| `storage-rel-008` | Hot Tier `part_of` Blob Access Tiers |
| `storage-rel-009` | Cool Tier `part_of` Blob Access Tiers |
| `storage-rel-010` | Archive Tier `part_of` Blob Access Tiers |
| `storage-rel-011` | Storage-Redundanz `part_of` Storage Account |
| `storage-rel-012` bis `015` | LRS, ZRS, GRS und GZRS `part_of` Storage-Redundanz |
| `storage-rel-016` | Azure File Sync `uses` Azure Files |

### Storage ↔ Compute

- Azure App Service `uses` Azure Blob Storage.
- Die bestehende V1.4-Beziehung Virtual Machine `uses` Azure Managed Disks bleibt unverändert.

### Storage ↔ Networking

- Private Endpoint `connects_to` Storage Account.
- Die bestehenden Beziehungen Private Endpoint `connects_to` Blob Storage und Virtual Network `connects_to` Private Endpoint bleiben erhalten.
- Private Endpoint `connects_to` Azure Cosmos DB.

Die Relation erklärt ausdrücklich, dass ein Private Endpoint eine private IP für einen konkreten Storage-Unterdienst bereitstellt und den Public Endpoint nicht automatisch deaktiviert.

### Storage ↔ Identity

- Azure RBAC `governs` Storage Account.
- Managed Identity `connects_to` Storage Account für tokenbasierte, schlüssellose Datenzugriffe.
- Azure RBAC `governs` Azure Blob Storage auf der Datenebene.

Die Erklärungen grenzen Managementrollen von Storage-Datenrollen ab und bevorzugen Microsoft Entra ID/Managed Identity gegenüber langfristigen Account Keys.

### Storage ↔ Governance

- Azure Policy `governs` Storage Account.
- Azure Resource Tags `organizes` Storage Account.

Tags klassifizieren die Azure-Ressource, nicht automatisch Blobs oder Dateiinhalte. Policy kann Storage-Konfigurationen bewerten und durchsetzen, greift aber nicht ohne passende Definition in jede Datenoperation ein.

### Storage ↔ Migration und Data

- Azure Data Box `uses` Azure Storage als unterstütztes Übertragungsziel.
- Azure Migrate `uses` Azure Database Migration Service.

Alle 26 Beziehungen besitzen:

- einen registrierten Relationstyp,
- eine gültige Gegenrichtung aus der Registry,
- eine fachliche Erklärung,
- mindestens eine offizielle Quelle,
- Confidence zwischen 0,97 und 0,99,
- Status `accepted`.

Es waren keine neuen Relationstypen nötig. Die vorhandenen Typen `contains`, `part_of`, `uses`, `connects_to`, `governs` und `organizes` decken den Pilot vollständig ab.

## Quellenbasis

Alle 22 neuen Quellen stammen aus Microsoft Learn und wurden am 11. August 2026 auf Erreichbarkeit und fachliche Passung geprüft:

1. [Introduction to Azure Storage](https://learn.microsoft.com/en-us/azure/storage/common/storage-introduction)
2. [Storage account overview](https://learn.microsoft.com/en-us/azure/storage/common/storage-account-overview)
3. [Authorize access to data in Azure Storage](https://learn.microsoft.com/en-us/azure/storage/common/authorize-data-access)
4. [Shared access signatures (SAS)](https://learn.microsoft.com/en-us/azure/storage/common/storage-sas-overview)
5. [Private endpoints for Azure Storage](https://learn.microsoft.com/en-us/azure/storage/common/storage-private-endpoints)
6. [Azure Storage encryption](https://learn.microsoft.com/en-us/azure/storage/common/storage-service-encryption)
7. [Azure Storage redundancy](https://learn.microsoft.com/en-us/azure/storage/common/storage-redundancy)
8. [Storage disaster recovery and failover](https://learn.microsoft.com/en-us/azure/storage/common/storage-disaster-recovery-guidance)
9. [Introduction to Azure Blob Storage](https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blobs-introduction)
10. [Blob access tiers](https://learn.microsoft.com/en-us/azure/storage/blobs/access-tiers-overview)
11. [Blob lifecycle management](https://learn.microsoft.com/en-us/azure/storage/blobs/lifecycle-management-overview)
12. [Blob data protection](https://learn.microsoft.com/en-us/azure/storage/blobs/data-protection-overview)
13. [Introduction to Azure Files](https://learn.microsoft.com/en-us/azure/storage/files/storage-files-introduction)
14. [Introduction to Azure File Sync](https://learn.microsoft.com/en-us/azure/storage/file-sync/file-sync-introduction)
15. [Introduction to Azure Queue Storage](https://learn.microsoft.com/en-us/azure/storage/queues/storage-queues-introduction)
16. [Introduction to Azure Table storage](https://learn.microsoft.com/en-us/azure/storage/tables/table-storage-overview)
17. [Introduction to Azure Data Lake Storage](https://learn.microsoft.com/en-us/azure/storage/blobs/data-lake-storage-introduction)
18. [Azure Data Box overview](https://learn.microsoft.com/en-us/azure/databox/data-box-overview)
19. [About Azure Migrate](https://learn.microsoft.com/en-us/azure/migrate/migrate-services-overview)
20. [What is Azure SQL?](https://learn.microsoft.com/en-us/azure/azure-sql/azure-sql-iaas-vs-paas-what-is-overview?view=azuresql)
21. [Azure Cosmos DB resource model](https://learn.microsoft.com/en-us/azure/cosmos-db/resource-model)
22. [Azure Database Migration Service](https://learn.microsoft.com/en-us/azure/dms/dms-overview)

Es wurden keine Blogs oder Drittquellen verwendet.

## Architekturmehrwert

### Beziehungen mit dem größten Mehrwert

1. **App Service → Blob Storage:** macht Zustandsauslagerung aus kurzlebigen Compute-Instanzen sichtbar.
2. **Private Endpoint → Storage Account:** verbindet Datenarchitektur mit Netzwerk- und DNS-Entscheidungen.
3. **Managed Identity/RBAC → Storage:** verbindet schlüssellosen Zugriff, Least Privilege und Datenrollen.
4. **Policy/Tags → Storage Account:** verbindet technische Guardrails mit Ownership und Kostensteuerung.
5. **Redundanz → Storage Account:** ordnet Verfügbarkeit und DR einer konkreten Accountentscheidung zu.
6. **Data Box/Azure Migrate/DMS:** trennt Bulktransfer, Assessment, Datenbanksynchronisierung und Cutover.

### Konzepte mit besonders wertvoller Architecture-Ebene

- Storage Account als Sicherheits- und Betriebsgrenze statt bloßer Behälter.
- Access Tiers als Gesamtkostenentscheidung statt einfache Preisrangfolge.
- GRS/GZRS als DR-Baustein mit asynchronem RPO statt pauschale „Regionssicherheit“.
- Blob Protection als Schichtenmodell aus Versioning, Soft Delete, Backup und Locks.
- Data Lake Storage als Speicherbasis, nicht als vollständige Analytics-Plattform.
- Cosmos DB als Partitionierungs- und Kostenentscheidung, nicht nur „schnelle NoSQL-Datenbank“.
- Azure SQL Database als PaaS mit geteilter Verantwortung.

## Vergleich V1.2 bis V1.6

| Dimension | Networking V1.2 | Identity V1.3 | Compute V1.4 | Governance V1.5 | Storage/Data V1.6 |
|---|---:|---:|---:|---:|---:|
| angereicherte Knoten | 33 | 36 | 38 | 27 | 24 |
| neue Erklärungstexte | 99 | 108 | 114 | 81 | 72 |
| neue Beziehungen | 29 | 35 | 34 | 34 | 26 |
| neue offizielle Quellen | 27* | 21 | 24 | 22 | 22 |
| Leitfrage | Wie erreicht ein Workload Ressourcen? | Wer darf was? | Wo läuft er und wer betreibt ihn? | Wie wird alles kontrolliert? | Wie werden Daten gespeichert und geschützt? |

\* V1.2 erhöhte die Quellenbasis von einer migrierten Ausgangsquelle auf insgesamt 28 Quellen.

Networking erklärt Pfade, Identity Berechtigung, Compute Laufzeit und Betriebsverantwortung, Governance Steuerung und Standardisierung. Storage/Data ergänzt dauerhaften Zustand, Datenzugriff, Schutz, Kostenlebenszyklus und Wiederherstellung. Besonders wertvoll sind Domänenübergänge, an denen ein Workload seinen Zustand auslagert, privat erreicht, identitätsbasiert autorisiert und gegen Verlust absichert.

Als nächster Pilot wird **Security & Protection** empfohlen. Diese Domäne kann die bereits vorhandenen Brücken zu Defender for Cloud, Key Vault, Verschlüsselung, Backup, Recovery, NSG, Private Endpoint, RBAC und Policy zu einem durchgängigen Schutzmodell verbinden.

## Offene fehlende Knoten

Folgende geforderte Konzepte besitzen in V1.5 keinen eigenständigen kanonischen Knoten und wurden deshalb nicht neu angelegt:

- Public vs. Private Access,
- Shared Access Signature (SAS),
- Storage Account Keys / Shared Key,
- Storage Lifecycle Management,
- Storage Encryption,
- Storage Availability und Durability als Einzelknoten,
- Storage Disaster Recovery und Account Failover,
- Blob Soft Delete,
- Blob Versioning,
- Azure Blob Backup,
- Storage Recovery,
- Storage Firewall,
- Storage Service Endpoint.

Die Inhalte sind in passenden vorhandenen Knoten erklärt und belegt. Für sichtbare Einzelknoten ist eine explizit freigegebene Hierarchiephase erforderlich.

## Qualitätssicherung

| Prüfung | Ergebnis |
|---|---|
| V1.5-Backup vollständig und bytegenau | PASS |
| 1.058 Knoten | PASS |
| IDs und ID-Reihenfolge unverändert | PASS |
| Eltern-/Kindhierarchie unverändert | PASS |
| Networking-, Identity-, Compute- und Governance-Inhalte unverändert | PASS |
| historische Relations- und Quellenobjekte unverändert | PASS |
| 24 vollständige Storage-Anreicherungen | PASS |
| Simple jeweils zwei bis vier Sätze | PASS |
| alle Quellenreferenzen gültig | PASS |
| keine erfundenen Dienste oder Knoten | PASS |
| keine doppelten Relations-IDs oder semantischen Tripel | PASS |
| Relation Registry und Gegenrichtungen gültig | PASS |
| UI, Schema, Datenmodell und Buildprozess unverändert | PASS |
| Runtime Build aus `data/canonical/` | PASS |

Bei domänenübergreifenden Knoten wurden ausschließlich neue Relationsreferenzen angehängt. Ihre bestehenden Erklärungen, Beispiele, Merksätze, Metadaten, Quellen und historischen Relationsreferenzen sind bytegleich erhalten.

## Reproduzierbarkeit

- `tools/enrich-storage-v1.6.mjs` dokumentiert die kontrollierte Anreicherung.
- `tools/qa-storage-v1.6.mjs` prüft Knoten, Hierarchie, Pilotvollständigkeit, historische Inhalte, Quellen, Relationsregistry und geschützte Dateien.
- `tools/build-runtime.mjs` erzeugt die lokale Browser-Runtime unverändert aus `data/canonical/`.
- `backups/version-1.5/` enthält die vollständige unveränderte Ausgangsbasis.

