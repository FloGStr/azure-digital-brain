# Azure Digital Brain V2.1 – Learning Path Overview

## Überblick

| Pfad | Schritte | eindeutige Knoten | Szenario-Verknüpfungen | Ergebnis |
|---|---:|---:|---:|---|
| Azure Mental Model | 9 | 26 | 9 | Azure strukturell verstehen |
| Application Journey | 7 | 22 | 11 | den Weg einer Anwendung erklären |
| Enterprise Platform Architecture | 7 | 28 | 18 | die Plattform hinter Workloads verstehen |
| Architecture Decision Making | 5 | 18 | 10 | Architekturentscheidungen begründen |
| Enterprise Scenario Learning | 5 | 25 | 5 | Anforderungen bis Architektur nachvollziehen |

Knoten werden pfadübergreifend wiederverwendet; die Pfadsummen sind deshalb größer als die 72 eindeutigen Knoten des Gesamtframeworks.

## Path 1 – Azure Mental Model

1. Cloud-Grundlagen als Ausgangspunkt
2. Regionen als Standort- und Fehlerentscheidung
3. Availability Zones als lokale Fehlerdomänen
4. Tenant als Identity- und Vertrauensgrenze
5. Management Groups als Governance-Hierarchie
6. Subscriptions als Management-, Abrechnungs- und Skalierungsgrenze
7. Resource Groups als Workload-Lifecycle-Grenze
8. Azure Resource Manager und Ressourcenmodell
9. Governance-Grundprinzipien als Leitplanken

Der Pfad baut ein mentales Modell vom Cloud-Betriebsprinzip über physische und logische Grenzen bis zu Governance auf.

## Path 2 – Application Journey

1. DNS: Namen werden zu erreichbaren Endpunkten
2. Traffic Management: global, regional oder Layer 4
3. Security Layer: prüfen, segmentieren und begrenzen
4. Application Layer: wo läuft die Logik?
5. Data Layer: relational, verteilt oder objektbasiert
6. Private Access: Datenpfad und Identität zusammenführen
7. Monitoring: den vollständigen Nutzerfluss sichtbar machen

Der Pfad folgt dem Daten- und Kontrollfluss einer Anwendung. Er verbindet DNS, Front Door, Application Gateway, WAF, Compute, Datenhaltung, Private Endpoint, Managed Identity und Monitoring.

## Path 3 – Enterprise Platform Architecture

1. Landing Zone als vorbereitete Zielplattform
2. Governance Foundation
3. Identity Foundation
4. Network Foundation
5. Security Baseline
6. Monitoring Foundation
7. Operations und kontinuierliche Verbesserung

Der Pfad zeigt die gemeinsame Plattformverantwortung hinter einzelnen Workloads und verbindet alle fünf V2.0-Szenarien mit wiederverwendbaren Plattformfähigkeiten.

## Path 4 – Architecture Decision Making

1. Virtual Machines versus App Service versus Container
2. Load Balancer versus Application Gateway versus Front Door
3. VPN versus ExpressRoute
4. Public Endpoint versus Private Endpoint
5. Azure SQL Database versus andere vorhandene Datenlösungen

Jeder Schritt enthält Optionen, Entscheidungskriterien, Trade-offs und typische Einsatzfälle. Die Reihenfolge führt von Workload-Ausführung über Traffic und Konnektivität bis zu Sicherheits- und Datenentscheidungen.

## Path 5 – Enterprise Scenario Learning

1. Secure Web Application
2. Enterprise Hub-Spoke
3. Hybrid Cloud
4. Highly Available Application
5. Cloud Migration

Jeder Szenarioschritt folgt demselben Lernmuster:

```text
Vorwissen benötigt
        ↓
Architektur verstehen
        ↓
Designentscheidung treffen
```

## Pfadübergreifende Navigation

- Das Azure Mental Model öffnet die Application Journey und die Enterprise Platform Architecture.
- Application Journey und Enterprise Platform Architecture liefern die Voraussetzungen für Architecture Decision Making.
- Entscheidungswissen führt in die fünf V2.0-Szenarien.
- Voraussetzungen sind als referenzielle Abhängigkeiten modelliert; `next_learning_steps` erlaubt empfohlene Fortsetzungen und Querverbindungen.

