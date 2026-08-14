# Azure Digital Brain V2.0 – Architecture Scenario Layer

V2.0 ergänzt die unveränderte V1.8-Wissensbasis um fünf Enterprise-Referenzszenarien. Die Szenarien sind keine neuen Mindmap-Knoten und keine parallele Azure-Wissensbasis. Sie komponieren ausschließlich vorhandene kanonische IDs zu nachvollziehbaren Architekturflüssen, Entscheidungen, Security-, Monitoring-, Reliability- und Betriebsmodellen.

## Enthaltene Szenarien

1. Secure Web Application Architecture
2. Enterprise Hub-Spoke Architecture
3. Hybrid Cloud Architecture
4. Highly Available Application Architecture
5. Cloud Migration Architecture

## Anwendung starten

Der bestehende Mindmap- und Brain-Modus bleibt unverändert:

1. `START.html` doppelklicken.
2. Einen lokalen Browser auswählen.
3. Es ist keine Installation und kein Server erforderlich.

Der neue Architecture Mode ist in V2.0 **als Daten- und Runtime-Vertrag vorbereitet, aber noch nicht in die UI eingebaut**. Es wurde keine KI-Integration implementiert.

## Neue V2.0-Dateien

```text
data/canonical/
├── scenarios.json                 kanonische Scenario Layer
└── scenario-schema.json           Datenvertrag V2.0

data/runtime/
├── architecture-runtime.js        offline ladbare Browser-Projektion
└── architecture-manifest.json     Build-Kennzahlen

tools/
├── build-scenario-runtime.mjs     validiert und baut die Projektion
└── qa-architecture-layer-v2.0.mjs vollständige Integritätsprüfung

reports/
├── architecture-scenarios-v2.0.md
├── scenario-comparison-v2.0.md
├── architecture-layer-report-v2.0.md
└── qa-v2.0.md
```

## Architecture Mode – vorbereiteter Vertrag

Ein zukünftiger UI-Modus kann `data/runtime/architecture-runtime.js` laden. Die Datei stellt offline bereit:

```text
window.AZURE_ARCHITECTURE_SCENARIOS
├── meta
├── scenarios
├── referenced_nodes
├── relationship_types
└── scenario_sources
```

Jedes Szenario enthält Architekturfluss, Komponenteninstanzen, Diagrammgraph, Entscheidungen, Security, Monitoring, Reliability, Kosten, typische Fehler, Enterprise-Beispiel, Betriebsmodell, Lernpfad und semantische Beziehungen.

## Scenario Layer neu bauen

Nur für spätere redaktionelle Erweiterungen mit installiertem Node.js:

```text
node tools/build-scenario-runtime.mjs
node tools/qa-architecture-layer-v2.0.mjs
```

Die fertige Anwendung und die generierte Architecture-Runtime benötigen keinen Server.

## Schutz der V1.8-Basis

- 1.058 Knoten unverändert
- IDs und Hierarchie unverändert
- 243 bestehende Relationen unverändert
- keine neuen Azure-Produktknoten
- keine neuen Relationstypen
- keine Änderungen an UI, Schema oder bisheriger Runtime
- vollständiges bytegleiches Backup unter `backups/version-1.8/`

Die ursprüngliche `README.md` ist als Bestandteil der bytegleichen V1.8-Basis erhalten. Dieses Dokument beschreibt ausschließlich die additive V2.0-Erweiterung.
