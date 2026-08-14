# Azure Digital Brain V2.2 – UI Integration

## Ergebnis

V2.2 integriert die vorhandenen Architecture Scenarios aus V2.0 und das Architecture Learning Framework aus V2.1 in die lokale Benutzeroberfläche. Die Navigation bietet jetzt vier Perspektiven:

- **Mindmap** – unveränderte hierarchische Wissensnavigation
- **Brain** – unveränderter semantischer Knowledge Graph
- **Architecture** – fünf vorhandene Enterprise-Szenarien
- **Lernen** – fünf vorhandene Architecture Learning Paths

Die Integration erzeugt keine neuen Azure-Inhalte, Produktknoten, Szenarien oder Lernschritte.

## Geänderte UI-Dateien

| Datei | Änderung |
|---|---|
| `START.html` | veralteten statischen V1.3-Hinweis entfernt; lokaler Einstieg bleibt unverändert |
| `app/index.html` | zwei Modusschalter, Architecture-/Learning-Container, Kontextbereich und lokale Runtimes eingebunden |
| `app/styles.css` | bestehendes Dark Design um responsive Szenario-, Diagramm-, Lern- und Fortschrittskomponenten ergänzt |
| `app/app.js` | Architecture-/Learning-Rendering, Kontextnavigation, Lernfortschritt und Release-Anzeige ergänzt |

Mindmap und Brain verwenden weiterhin ihre bestehenden SVG-/Canvas-Implementierungen, Layouts, Zoom-, Pan-, Fokus- und Detailmechanismen.

### Globale Mindmap-Steuerung

Die obere Steuerleiste enthält zusätzlich `Alles aufklappen` und `Alles zuklappen`. Aufklappen markiert alle vorhandenen Elternknoten in einem Schritt als geöffnet und startet danach genau einen Layout-/Renderlauf. So werden alle 1.058 Knoten bis Ebene 10 dargestellt, ohne Zweige einzeln nacheinander zu rendern. Zuklappen setzt denselben Darstellungszustand in einem Schritt auf Root plus erste Hauptäste zurück. Anschließend bleiben einzelne Zweige normal bedienbar.

Die Schaltflächen sind ausschließlich im Mindmap-Modus sichtbar und verändern weder kanonische Daten noch Hierarchie, Brain, Architecture oder Lernen.

## Neue Komponenten

- Szenarioauswahl mit fünf V2.0-Szenarien
- Szenarioübersicht und klickbarer Diagrammgraph
- einklappbare Architekturperspektiven
- Learning-Path-Auswahl mit Fortschrittsanzeige
- Learning-Step-Ansicht mit Voraussetzungen, Reifegrad, Fragen und Folgepfaden
- lokaler Statuseditor mit Notiz und Verständnislevel
- Kontextlinks in der bestehenden Knotendetailansicht
- zentrale Release-Metadatenanzeige
- globale Mindmap-Aktionen zum vollständigen Auf- und Zuklappen

Alle Komponenten sind ohne Framework und ohne externe Bibliothek umgesetzt. Die Anwendung bleibt über `START.html` unter `file://` startbar.

## Kontextnavigation

```text
Learning Step ──> Azure Node ──> bestehende Knotendetailansicht
      │                │
      v                ├──> relevante Learning Steps
Architecture Scenario <└──> relevante Architecture Scenarios
      │
      └──> Azure Node ──> bestehende Knotendetailansicht
```

Die Rückverweise werden zur Laufzeit aus den vorhandenen Referenzen aufgebaut. Es werden keine Relationen in die kanonische Knowledge Base geschrieben.

## Zentrale Release-Metadaten

Source of Truth: `data/canonical/release.json`

Builder: `tools/build-release-runtime.mjs`

Browser-Runtime: `data/runtime/release-runtime.js`

Die Oberfläche liest daraus Produktname, Release-Version, Knoten-, Relations-, Szenario- und Lernpfadanzahl sowie den Betriebsmodus. Die Kopfleiste zeigt:

`V2.2 · 1.058 Knoten · 243 Beziehungen · 5 Szenarien · 5 Lernpfade · Local`

Statische V1.3-Hinweise wurden entfernt. Künftige Release-Anpassungen erfolgen an einer zentralen Quelle.

## Lokaler Betrieb

- keine externen Scripts
- kein `fetch`
- keine Cloud-Synchronisation
- keine AI-Integration
- keine GitHub-Integration
- alle Runtime-Dateien werden relativ aus dem Projektordner geladen

## Responsive Verhalten

Desktop verwendet eine seitliche Szenario-/Pfadauswahl und einen scrollbaren Inhaltsbereich. Auf schmalen Viewports werden Auswahl und Lernschritte horizontal scrollbar; die bestehende Knotendetailansicht bleibt als einblendbares Panel erhalten.
