# Azure Digital Brain V2.4 – Hierarchy Audit

> V2.4 ist ausschließlich ein nicht-destruktiver Audit. Kein Finding ist eine Änderungsfreigabe. Knoten, IDs, Hierarchie, Relationen, Quellen, Szenarien und Lernpfade bleiben unverändert.

## Findings


### QF-2026-0031 – Management Groups unter Pricing/Subscriptions

- Betroffene IDs: `azure-1022`
- Aktuell: Azure - AZ-900 (Fundamentals) > Azure Pricing, Service level agreements and Lifecycle > Azure Subscriptions > Azure Management Groups
- Vorgeschlagener Zielkontext: Azure > Governance > Resource organization > Management Groups
- Begründung: Der Knoten ist ein Governance-Scope oberhalb von Subscriptions; seine aktuelle Einordnung im Pricing-Hauptast erschwert fachliche Navigation.
- Confidence/Priorität: high / P1
- Review-Aktion: Vorgeschlagenen Zielkontext fachlich prüfen: Azure > Governance > Resource organization > Management Groups. Keine Verschiebung in V2.4.


### QF-2026-0032 – Azure Migrate unter Azure Storage

- Betroffene IDs: `azure-0645`, `azure-0722`
- Aktuell: Azure - AZ-900 (Fundamentals) > Core Azure Services > Azure Architectural Components > Azure Services and Products > Azure Storage > Datenmigration nach Azure > Azure Migrate / Azure - AZ-900 (Fundamentals) > Core Azure Services > Azure Architectural Components > Azure Services and Products > Azure Storage > Speichert, verwaltet und schützt Daten – von Dateien über Backups bis hin zu Big Data. > Datenmigration > Azure Migrate
- Vorgeschlagener Zielkontext: Azure > Migration and modernization > Azure Migrate
- Begründung: Azure Migrate bewertet und migriert Server, Anwendungen und Datenbanken und ist nicht auf Storage beschränkt.
- Confidence/Priorität: high / P1
- Review-Aktion: Vorgeschlagenen Zielkontext fachlich prüfen: Azure > Migration and modernization > Azure Migrate. Keine Verschiebung in V2.4.


### QF-2026-0033 – Database Migration Service im allgemeinen Datenbankast

- Betroffene IDs: `azure-0738`
- Aktuell: Azure - AZ-900 (Fundamentals) > Core Azure Services > Azure Architectural Components > Azure Services and Products > Azure Database > Azure Database Migration Service
- Vorgeschlagener Zielkontext: Azure > Migration and modernization > Database migration
- Begründung: Der Dienst ist ein Migrationswerkzeug; die aktuelle Nähe zu produktiven Datenbankdiensten kann den Zweck verschleiern.
- Confidence/Priorität: medium / P2
- Review-Aktion: Vorgeschlagenen Zielkontext fachlich prüfen: Azure > Migration and modernization > Database migration. Keine Verschiebung in V2.4.


### QF-2026-0034 – Monitoring/Operations unter Security-Hauptbereich

- Betroffene IDs: `azure-0979`
- Aktuell: Azure - AZ-900 (Fundamentals) > Azure Security & Protection Architecture > Monitoring, Observability und Operations in Azure
- Vorgeschlagener Zielkontext: Azure > Management and Governance > Monitoring, Observability and Operations
- Begründung: Monitoring ist querschnittlich und nicht ausschließlich Security. Der Knoten selbst beschreibt einen vollständigen Operations-Lifecycle.
- Confidence/Priorität: high / P1
- Review-Aktion: Vorgeschlagenen Zielkontext fachlich prüfen: Azure > Management and Governance > Monitoring, Observability and Operations. Keine Verschiebung in V2.4.


### QF-2026-0035 – IoT Hub als Kind eines Data-Lake-Analytics-Beispiels

- Betroffene IDs: `azure-0766`
- Aktuell: Azure - AZ-900 (Fundamentals) > Core Azure Services > Azure Architectural Components > Azure Solutions > Big Data and Analytics > Azure Data Lake Analytics > On-demand analytics job service > IoT Hub
- Vorgeschlagener Zielkontext: Azure > Integration / IoT > IoT Hub oder als reines Beispielfeld beim Analytics-Knoten
- Begründung: IoT Hub ist ein eigenständiger Integrationsdienst; hier wird er als tiefer Analogie-/Flow-Knoten unter einem stillgelegten Dienst geführt.
- Confidence/Priorität: high / P2
- Review-Aktion: Vorgeschlagenen Zielkontext fachlich prüfen: Azure > Integration / IoT > IoT Hub oder als reines Beispielfeld beim Analytics-Knoten. Keine Verschiebung in V2.4.


### QF-2026-0036 – Azure Lab Services unter Azure DevOps

- Betroffene IDs: `azure-0803`
- Aktuell: Azure - AZ-900 (Fundamentals) > Core Azure Services > Azure Architectural Components > Azure Solutions > Azure DevOps > Azure Lab Services
- Vorgeschlagener Zielkontext: Azure > Specialized services > Lab environments
- Begründung: Lab Services ist kein Azure-DevOps-Unterdienst; zusätzlich ist der Dienst zur Einstellung angekündigt.
- Confidence/Priorität: high / P2
- Review-Aktion: Vorgeschlagenen Zielkontext fachlich prüfen: Azure > Specialized services > Lab environments. Keine Verschiebung in V2.4.


### QF-2026-0037 – Service Fabric pauschal als Legacy/optional unter Compute

- Betroffene IDs: `azure-0336`
- Aktuell: Azure - AZ-900 (Fundamentals) > Core Azure Services > Azure Architectural Components > Azure Services and Products > Azure Compute > Azure Service Fabric (Legacy / optional)
- Vorgeschlagener Zielkontext: Azure > Compute > Container and distributed systems > Service Fabric
- Begründung: Der Dienst ist weiterhin dokumentiert; die Bezeichnung „Legacy“ ist eine Bewertung und sollte getrennt vom neutralen Produktknoten geführt werden.
- Confidence/Priorität: medium / P2
- Review-Aktion: Vorgeschlagenen Zielkontext fachlich prüfen: Azure > Compute > Container and distributed systems > Service Fabric. Keine Verschiebung in V2.4.


### QF-2026-0038 – Azure Information Protection im Security-Tool-Ast ohne Purview-Kontext

- Betroffene IDs: `azure-0948`
- Aktuell: Azure - AZ-900 (Fundamentals) > Azure Security & Protection Architecture > Azure Security Tools and Features > AIP (Azure Information Protection)
- Vorgeschlagener Zielkontext: Microsoft Security > Data security and compliance > Microsoft Purview Information Protection
- Begründung: Der historische Azure-Produktname kann ohne aktuellen Purview-Kontext fachlich missverständlich sein.
- Confidence/Priorität: medium / P3
- Review-Aktion: Vorgeschlagenen Zielkontext fachlich prüfen: Microsoft Security > Data security and compliance > Microsoft Purview Information Protection. Keine Verschiebung in V2.4.


## Muster

- Historische Mindmap-Pfade mischen Produkt-, Lern-, Prüfungs- und Architekturperspektiven.
- Hochwertige angereicherte Knoten können trotzdem an einem historisch ungünstigen Ort liegen.
- Jede spätere Verschiebung ist Class C und benötigt Referenzprüfung, Backup und explizite Freigabe.
