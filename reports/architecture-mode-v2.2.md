# Azure Digital Brain V2.2 – Architecture Mode

## Datenbasis

Der Architecture Mode liest ausschließlich `data/runtime/architecture-runtime.js`. Die kanonischen V2.0-Szenariodaten und die Runtime sind gegenüber V2.1 bytegleich geblieben.

Verfügbare Szenarien:

1. Secure Web Application
2. Enterprise Hub-Spoke
3. Hybrid Cloud
4. Highly Available Application
5. Cloud Migration

## Szenarioansicht

Jedes Szenario zeigt vorhandene Felder:

- Titel und Kurzbeschreibung
- Architekturziel
- Enterprise-Beispiel
- Merksatz
- Anzahl Komponenten und Szenariobeziehungen

Es werden keine Produktinformationen kopiert. Komponentendetails stammen weiterhin aus der bestehenden Knotendetailansicht.

## Diagrammgraph

Der Graph verwendet unmittelbar:

- `diagram.nodes`
- `diagram.edges`
- `component_instances`
- `actors`
- vorhandene `node_ref`-Verweise

Alle Diagrammknoten und -kanten der fünf Szenarien wurden auf Auflösbarkeit geprüft. Azure-Komponenten sind per Klick und Tastatur aktivierbar und öffnen die bestehende Knotendetailansicht. Externe oder organisatorische Akteure bleiben nicht klickbare Kontextobjekte.

## Architekturperspektiven

Folgende vorhandene Bereiche sind als einklappbare Abschnitte sichtbar:

- Architecture Decisions
- Security
- Monitoring
- Reliability
- Costs
- Common Mistakes
- Operations Model

Der erste Abschnitt ist zur Orientierung geöffnet; alle weiteren können unabhängig ein- und ausgeklappt werden.

## Szenario-Lernpfad

`learning_path` wird als Folge klickbarer kanonischer Knoten dargestellt. Ein Klick öffnet dieselbe Detailansicht wie in Mindmap und Brain.

## Navigation

- Szenario → Azure-Komponente → Knotendetails
- Szenario → Lernpfadknoten → Knotendetails
- Knotendetails → relevantes Szenario → Architecture Mode
- Learning Step → Szenario → Architecture Mode

Die Navigation verändert weder Szenario- noch Knowledge-Daten.

