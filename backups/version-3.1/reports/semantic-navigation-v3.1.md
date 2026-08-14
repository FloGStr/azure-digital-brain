# Azure Digital Brain V3.1 – Änderungsbericht

## Scope

V3.1 ist ausschließlich eine UX- und Navigationsverbesserung. Es wurden keine Knoten verschoben, gelöscht, ergänzt oder vereinigt. IDs, Hierarchie, Relationen, Quellen, Szenarien und Lernpfade bleiben bytegleich zur V2.4-Basis.

## Umsetzung

### Node-ID und Suche

Die globale Suche priorisiert:

1. exakte Node-ID
2. exakten Titel
3. Alias
4. historischen Begriff
5. Tags
6. Erklärungstext

Treffer zeigen Titel, Node-ID, aktuellen Elternpfad, V3.0-Klassifikation, vorgeschlagenen Zielbereich und Trefferart. Enter öffnet den ersten Treffer.

### Zentrale Navigation

`window.navigateToNode(nodeId)` ist die gemeinsame Navigation für Suchtreffer, Relationskarten, Architecture-Komponenten, Learning-Verweise und semantische Textlinks. Die Funktion öffnet den Ahnenpfad, zentriert den Mindmap-Zielknoten, hebt Map und Detailpanel hervor, öffnet die Details und aktualisiert einen lokalen Deep Link.

Der aktuelle Modus bleibt erhalten. In Architecture und Lernen wird der Zielknoten im Detailpanel geöffnet und die Mindmap intern auf den Zielpfad vorbereitet. Beim späteren Wechsel zur Mindmap wird der ausgewählte Knoten zentriert.

### Rücknavigation

Vor jedem semantischen Sprung werden Modus, Auswahl, aufgeklappte Zweige, Mindmap-Transformation, Brain-Fokus, Szenario und Lernschritt gespeichert. „← Zurück“ stellt diesen Kontext wieder her. Zusätzlich funktioniert `⌘/Alt + ←` innerhalb der Anwendung.

### Semantic Linking

Erklärungstexte bleiben als Strings unverändert. Die Runtime erzeugt beim Anzeigen sichere DOM-Buttons über den Texten. Verlinkt werden ausschließlich bestehende Node-IDs. Längere Begriffe gewinnen vor kürzeren; überlappende Treffer werden vermieden.

Linktypen:

- Standard – bestehender Wissensknoten
- Historical – frühere Bezeichnung
- Deprecated – laut V3.0-Audit veraltetes Ziel
- Ambiguous – mehrere vorhandene Zielknoten; Klick öffnet die Suche zur Auswahl

Hover beziehungsweise Tastaturfokus zeigt Zielname, Node-ID, aktuellen Elternpfad und vorgeschlagenen Zielbereich.

### Runtime-Overlay

- 1.058 V3.0-Klassifikationen
- 20 Aliasvorschläge aus V3.0
- vier kontextuelle V3.1-Aliase für Fault Domain(s) und Update Domain(s)
- keine automatische Knotenerstellung

Die vier kontextuellen Aliase zeigen auf `azure-0326`, weil dafür kein eigenständiger kanonischer Knoten existiert. Dadurch wird der geforderte Beispielsatz vollständig verlinkbar, ohne Wissen oder Hierarchie zu erfinden.

## Geänderte oder neue Runtime-Dateien

- `app/app.js`
- `app/index.html`
- `app/styles.css`
- `app/semantic-navigation-core.js`
- `data/navigation/*`
- `data/runtime/semantic-navigation-runtime.js`
- `data/runtime/semantic-navigation-manifest.json`
- `tools/build-semantic-navigation-v3.1.mjs`
- `tools/qa-semantic-navigation-v3.1.mjs`

## Qualität und Einschränkung

Build, Syntax, Suchprioritäten, Linkerkennung, Linkziele, Runtime-Abdeckung und alle kanonischen Hashes sind automatisiert geprüft. Die integrierte Browser-Testumgebung blockiert direkte `file://`-Navigation; deshalb wird kein automatischer Safari-/Chrome-PASS behauptet. Eine manuelle Doppelklick-Checkliste steht im QA-Bericht.

