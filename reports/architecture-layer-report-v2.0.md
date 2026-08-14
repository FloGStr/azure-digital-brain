# Azure Digital Brain V2.0 – Architecture Scenario Layer Report

Stand: 11. August 2026

## Ergebnisübersicht

| Kennzahl | V1.8 | V2.0 |
|---|---:|---:|
| bestehende Mindmap-Knoten | 1.058 | 1.058 |
| bestehende Hierarchieebenen | 10 | 10 |
| bestehende Knowledge-Graph-Relationen | 243 | 243 |
| Szenarien | 0 | 5 |
| eindeutig referenzierte Bestandsknoten | 0 | 44 |
| Szenario-Beziehungen | 0 | 50 |
| verwendete Relationstypen | – | 5 |
| neue Relationstypen | 0 | 0 |
| neue offizielle Architekturquellen | 0 | 9 |
| neue Azure-Produktknoten | 0 | 0 |
| UI-Änderungen | 0 | 0 |

## Architekturentscheidung der V2.0-Schicht

Szenarien werden **nicht** als Mindmap-Knoten modelliert. Ein Szenario ist eine kuratierte Komposition aus:

- externen Akteuren,
- Rolleninstanzen vorhandener Knoten,
- einem gerichteten Architekturfluss,
- einem renderbaren Diagrammgraph,
- Architekturentscheidungen und Trade-offs,
- Security-, Monitoring-, Reliability- und Kostenbetrachtung,
- Betriebsmodell und Lernpfad,
- semantischen Beziehungen vom Szenario zu vorhandenen Knoten.

Damit bleibt das Produktwissen ausschließlich in `nodes.json`. Wenn sich beispielsweise die Erklärung zu App Service ändert, referenziert das Webszenario weiterhin denselben Knoten und benötigt keine parallele Produktbeschreibung.

## Datenmodell

```text
data/canonical/scenarios.json
├── meta
├── sources[9]
└── scenarios[5]
    ├── actors
    ├── architecture_flow
    ├── component_instances
    ├── diagram
    ├── technical_explanation
    ├── architecture_decisions
    ├── security_considerations
    ├── monitoring_considerations
    ├── reliability_considerations
    ├── cost_considerations
    ├── common_mistakes
    ├── enterprise_example
    ├── operations_model
    ├── learning_path
    ├── merksatz
    ├── relationships
    └── sources
```

`scenario-schema.json` definiert den V2.0-Vertrag. Das Buildskript validiert zusätzlich alle Referenzen gegen die vorhandenen Knoten, Quellen und Relationstypen.

## Semantische Beziehungen

Die 50 Szenario-Beziehungen verwenden ausschließlich:

- `uses` / `used_by`,
- `depends_on` / `depended_on_by`,
- `secured_by` / `secures`,
- `monitored_by` / `monitors`,
- `governed_by` / `governs`.

Jede Beziehung besitzt Szenario als Quelle, vorhandenen kanonischen Knoten als Ziel, registrierte Gegenrichtung, Erklärung, Quelle, Confidence und Status `accepted`. Die bestehende `relations.json` bleibt unverändert, weil Szenarien keine Wissensknoten sind. Die Beziehungen gehören fachlich zur Scenario Layer und werden dort validiert.

## Architecture Mode – vorbereitete Benutzerfunktion

`data/runtime/architecture-runtime.js` stellt den späteren UI-Vertrag offline bereit:

```text
window.AZURE_ARCHITECTURE_SCENARIOS
├── meta
├── scenarios
├── referenced_nodes
├── relationship_types
└── scenario_sources
```

Ein zukünftiger Architecture Mode kann damit:

1. eine Szenarioliste anzeigen,
2. den Diagrammgraph rendern,
3. eine Komponente öffnen und über `node_ref` die bestehende Detailansicht verwenden,
4. Security, Monitoring, Reliability, Kosten und Fehler als Filter einblenden,
5. den `learning_path` schrittweise navigieren,
6. Alternativen und Trade-offs aus `architecture_decisions` darstellen.

V2.0 implementiert bewusst noch keine Schaltfläche, kein UI-Rendering und keine KI-Funktion.

## Änderungen gegenüber V1.8

Neu hinzugefügt wurden ausschließlich:

- zwei kanonische Scenario-Layer-Dateien,
- zwei generierte Architecture-Runtime-Dateien,
- zwei Build-/QA-Werkzeuge,
- vier angeforderte Reports,
- `README-V2.0.md`,
- vollständiges Backup `backups/version-1.8/`.

Alle 6.343 V1.8-Dateien im Hauptbestand sind bytegleich erhalten.

## Quellen

Neue offizielle Quellen:

1. [Baseline zone-redundant web application](https://learn.microsoft.com/en-us/azure/architecture/web-apps/app-service/architectures/baseline-zone-redundant)
2. [Hub-spoke network topology](https://learn.microsoft.com/en-us/azure/architecture/networking/architecture/hub-spoke)
3. [Hybrid networking reference architectures](https://learn.microsoft.com/en-us/azure/architecture/reference-architectures/hybrid-networking/)
4. [Azure landing zone](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/landing-zone/)
5. [Landing zone design areas](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/landing-zone/design-areas)
6. [Migrate workloads to Azure](https://learn.microsoft.com/en-us/azure/migration/migrate-to-azure)
7. [Plan your migration](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/migrate/plan-migration)
8. [Azure Migrate dependency analysis](https://learn.microsoft.com/en-us/azure/migrate/concepts-dependency-visualization?view=migrate)
9. [Microsoft Entra hybrid identity](https://learn.microsoft.com/en-us/entra/identity/hybrid/)

Alle Links wurden am 11. August 2026 online geöffnet und fachlich geprüft.

## Fazit

V2.0 ergänzt eine echte Referenzarchitektur-Ebene, ohne die stabile Wissensbasis umzubauen. Das Digital Brain kann damit dieselben Komponenten in unterschiedlichen Unternehmenskontexten erklären und später in einem eigenen Modus interaktiv darstellen.
