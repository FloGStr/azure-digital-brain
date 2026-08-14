# Azure Digital Brain V3.2

V3.2 erweitert die V3.1-Navigation um eine gemeinsame Experience Layer für Mindmap, Brain, Architecture und Lernen. Die 1.058 Wissensknoten, ihre IDs, die Hierarchie, kanonischen Relationen und Quellen bleiben unverändert.

## Öffnen

`START.html` doppelklicken. Die Anwendung funktioniert lokal ohne Installation und ohne Server.

## Neu in V3.2

- echte Brain-Kontextansicht mit dem ausgewählten Knoten im Zentrum
- direkte Nachbarn und eine zweite Kontextstufe statt einer statischen Oberstruktur
- dynamisches Zentrieren, Zoomen und visuelles Hervorheben des Ziels
- gemeinsame Knotenauswahl über Mindmap, Brain, Architecture und Lernen
- Kontextaktionen im Detailpanel für den direkten Moduswechsel
- neue Wissensbereiche „Kontext“, „Verbindungen“, „Architektur-Relevanz“ und „Lernpfad“
- Architecture-Kontext aus bereits vorhandenen Referenzszenarien und Entscheidungen
- Learning-Kontext mit Lernpfad, aktuellem Schritt, Voraussetzungen und nächsten Schritten
- semantische Links mit Kategorie-Farben und eigener Auswahl bei mehreren Zielen
- Qualitäts- und Auditinformationen nur noch eingeklappt; im Lernmodus ausgeblendet

## Bedienung

1. Einen Begriff über die Mindmap, Brain-Ansicht, Suche oder einen semantischen Textlink öffnen.
2. Im Detailpanel die strukturelle Einordnung, Verbindungen, Architektur-Relevanz und vorhandene Lernpfade ansehen.
3. Über „Mindmap“, „Brain“, „Architecture“ oder „Lernen“ denselben Wissensknoten im passenden Kontext weiter untersuchen.
4. Mit „Zurück“ zum vorherigen Wissenskontext wechseln.

Die Schaltflächen „Architecture“ und „Lernen“ werden nur aktiviert, wenn für den Knoten bereits ein kanonischer Szenario- oder Lernpfadbezug existiert.

## Brain-Kontext

Bei einem ausgewählten Knoten zeigt der Brain Mode:

- den Zielknoten im Zentrum,
- direkte semantische Beziehungen,
- vorhandene Eltern- und Kindbeziehungen,
- eine zweite Nachbarschaftsebene,
- Relationstypen an den direkten Verbindungen.

Zur Stabilität werden höchstens 80 Knoten und höchstens 18 direkte Kindknoten je Kontextaufbau dargestellt. Es werden keine Wissensknoten oder Relationen entfernt; die Grenze betrifft nur die gleichzeitig sichtbare Darstellung.

## Datenprinzip

`data/canonical/` bleibt die unveränderte Source of Truth. Die V3.2-Konfiguration liegt unter `data/experience/` und wird additiv nach `data/runtime/context-experience-runtime.js` gebaut. Hierarchische Kontextlinien im Brain Mode sind rein visuelle Runtime-Verbindungen und verändern die kanonische Relationsliste nicht.

Das vollständige V3.1-Projekt ist unter `backups/version-3.1/` bytegleich enthalten.

## Runtime neu bauen

```text
node tools/build-context-experience-v3.2.mjs
```

## Qualität prüfen

```text
node --check app/semantic-navigation-core.js
node --check app/app.js
node tools/qa-context-experience-v3.2.mjs
```

Der automatisierte Test prüft das bytegleiche V3.1-Backup, alle kanonischen Dateien, Node-IDs, Relationen, Quellen, den zweistufigen Brain-Kontext und die V3.2-Oberflächenbausteine. Die lokale Doppelklick-Ausführung muss zusätzlich einmal in Safari und Chrome geprüft werden, weil die integrierte Testumgebung `file://`-Navigation blockiert.

## Bewusst nicht umgesetzt

- keine strukturelle Migration oder neue Wissensknoten
- keine neuen oder veränderten kanonischen Relationen
- keine automatisch erfundenen Architekturentscheidungen oder Lernpfade
- keine KI-generierten Mentorantworten
- keine vollständige Produktabdeckung, wenn die Ausgangsdaten keinen geeigneten Kontext enthalten

Weitere Details stehen in `reports/context-experience-v3.2.md` und `reports/qa-v3.2.md`.

## Mobile First und Responsive Design

Die V3.2-Oberfläche ist für Smartphone-Breiten von 320 bis 430 Pixeln optimiert, ohne die Desktop-Darstellung oder die Datenstruktur zu verändern.

- `START.html` und `app/index.html` berücksichtigen Display-Safe-Areas über `viewport-fit=cover`.
- Die App-Höhe folgt mit `dvh` und `svh` den dynamischen Browserleisten von iOS Safari und Android Chrome.
- Die vier Ansichtsmodi werden auf schmalen Displays als vollständig sichtbares 2×2-Raster dargestellt.
- Die Desktop-Werkzeugleiste bleibt mobil als horizontal bedienbare Aktionsleiste erreichbar.
- Detailansicht, Suche, Inhaltskarten und Lernansichten nutzen die gesamte verfügbare Breite und sichere Bildschirmränder.
- Touch-Ziele sind auf mobilen Breakpoints mindestens 44 Pixel hoch; aktive Zustände ersetzen reine Hover-Rückmeldungen.
- Horizontales Scrollen bleibt ausschließlich bei funktional breiten Auswahllisten und Architekturdiagrammen erhalten.
- Abgebrochene Pointer-Gesten setzen Mindmap- und Brain-Drag-Zustände zuverlässig zurück.

Die Änderungen betreffen ausschließlich `START.html`, `app/index.html`, `app/mobile-responsive.css`, `app/app.js` und diese Dokumentation. Die bestehende `app/styles.css` sowie alle Dateien unter `data/` bleiben unverändert.
