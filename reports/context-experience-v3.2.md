# Azure Digital Brain V3.2 – Context Navigation & Experience Layer

## Ergebnisübersicht

V3.2 verbindet die in V3.1 geschaffene semantische Navigation mit den vorhandenen Mindmap-, Brain-, Architecture- und Learning-Modi. Ein ausgewählter Wissensknoten bleibt der gemeinsame Kontext: Die Mindmap erklärt seine Einordnung, der Brain Mode zeigt sein unmittelbares Wissensumfeld, Architecture ordnet vorhandene Szenarien und Entscheidungen zu und Lernen zeigt vorhandene Lernpfade.

Die Umsetzung ist nicht-destruktiv. Die 1.058 Node-IDs, Hierarchie, 243 kanonischen Relationen und 155 Quellen wurden nicht verändert. Das vollständige V3.1-Projekt liegt bytegleich unter `backups/version-3.1/`.

## Umgesetzte UX-Verbesserungen

### Brain Mode als Kontextansicht

Der bisherige Brain Mode wurde für ausgewählte Knoten von der dominanten Oberstruktur auf einen lokalen Kontext umgestellt:

- Zielknoten automatisch zentriert und deutlich hervorgehoben
- direkte Nachbarn als erste Kontextstufe
- Nachbarn der direkten Nachbarn als zweite Kontextstufe
- Eltern- und Kindknoten als struktureller Kontext
- vorhandene semantische Relationen mit Relationstyp an direkten Verbindungen
- dynamische Zoomstufe passend zur Größe des Kontextes
- visuelle Abstufung zwischen Ziel, direktem Kontext und zweiter Ebene

Die Kontextberechnung ist eine reine Darstellungsschicht. Zusätzlich sichtbare Hierarchielinien werden nicht als neue kanonische Beziehungen gespeichert.

### Gemeinsamer Wissenskontext über vier Modi

Das Detailpanel enthält eine kompakte Modusnavigation:

- **Mindmap:** öffnet die strukturelle Einordnung des aktuellen Knotens.
- **Brain:** zeigt den lokalen semantischen und hierarchischen Zusammenhang.
- **Architecture:** öffnet das erste bereits vorhandene Referenzszenario des Knotens.
- **Lernen:** öffnet den ersten bereits vorhandenen Lernschritt des Knotens.

Der ausgewählte Knoten wird beim Moduswechsel nicht verworfen. Rücknavigation und bestehende `navigateToNode(nodeId)`-Sprünge bleiben erhalten.

### Detailpanel als Wissensschnittstelle

Das Panel wurde um folgende kontextabhängige Bereiche ergänzt:

- **Kontext:** Zweck beziehungsweise Bedeutung, Elternbegriff, direkte Unterbegriffe und Anzahl wichtiger Verbindungen
- **Verbindungen:** vorhandene semantische Beziehungen und erreichbare Zielknoten
- **Architektur-Relevanz:** vorhandene Architektur-Erklärung, Referenzszenarien und Entscheidungen
- **Lernpfad:** Pfadname, aktueller Schritt, vorausgesetzte Konzepte und nächste Schritte

Die Inhalte werden ausschließlich aus vorhandenen Knoten-, Relations-, Szenario- und Lernpfaddaten abgeleitet.

### Semantische Links

- Links werden entsprechend der vorhandenen Knotenkategorie eingefärbt.
- Hover und Tastaturfokus zeigen weiterhin Zielname, Node-ID und Elternpfad.
- Eindeutige Links navigieren direkt über `navigateToNode(nodeId)`.
- Mehrdeutige Begriffe öffnen eine Auswahl mit Titel, ID, Kategorie und Pfad.
- Historical- und Deprecated-Kennzeichnungen bleiben visuell unterscheidbar.

### Qualitätsinformationen

Interne Klassifikationen wie „Duplicate Candidate“ erscheinen nicht mehr prominent in Suchtreffern oder im Lernkontext. Falls Auditinformationen vorhanden sind, stehen sie in einem eingeklappten Bereich „Interne Qualitätsinformationen“. Im Learning Mode wird dieser Bereich vollständig ausgeblendet.

## Performance-Entscheidungen

Der Brain-Kontext wird in einem Berechnungsschritt erzeugt und anschließend einmal gerendert. Zur stabilen Darstellung großer Wissensbestände gelten folgende reine Anzeigegrenzen:

- maximal zwei Nachbarschaftsebenen,
- maximal 80 sichtbare Kontextknoten,
- maximal 18 direkte Kindknoten pro Fokusaufbau.

Die Ausgangsdaten werden dadurch weder gekürzt noch verändert. Weitere Knoten bleiben über Suche, Mindmap und direkte Navigation erreichbar.

## Bewusst nicht umgesetzt

- keine Umordnung, Zusammenführung oder Löschung von Knoten
- keine Änderung an IDs, Hierarchie, Relationen oder Quellen
- keine neuen Relationstypen und keine Persistierung visueller Hierarchielinien
- keine Ergänzung fehlender Referenzarchitekturen oder Lernpfade durch Annahmen
- keine automatische Generierung von Mentorantworten
- keine neue Qualitäts- oder Auditoberfläche; vorhandene Hinweise wurden nur zurückgenommen
- keine inhaltliche Vollständigkeitsmigration für sämtliche Azure-Dienste

Architecture- und Learning-Aktionen bleiben bei fehlendem Datenbezug deaktiviert. Das macht vorhandene Wissenslücken sichtbar, ohne neue Inhalte zu erfinden.

## Bekannte Einschränkungen

- Die Qualität eines Brain-Kontextes hängt von den vorhandenen 243 Relationen sowie der Hierarchie ab. Schwach vernetzte Knoten zeigen entsprechend weniger semantische Nachbarn.
- Referenzarchitektur- und Lernkontext erscheint nur, wenn der ausgewählte Knoten bereits in den vorhandenen Szenario- beziehungsweise Lernpfaddaten referenziert wird.
- Kategorie-Farben nutzen moderne CSS-Farbmischung. Aktuelle Safari- und Chrome-Versionen unterstützen dies; ältere Browser können auf die Standard-Linkfarbe zurückfallen.
- Die integrierte Browser-Testumgebung darf lokale `file://`-Seiten nicht öffnen. Safari und Chrome müssen deshalb anhand der Checkliste im QA-Bericht manuell mit `START.html` geprüft werden.

## Architekturwirkung

V3.2 verändert das Produktmodell von einer Ansammlung getrennter Ansichten zu einer gemeinsamen Wissensreise:

```text
Strukturell einordnen → Zusammenhänge erkennen → Entscheidung verstehen → gezielt weiterlernen
       Mindmap                 Brain                 Architecture              Lernen
```

Der zentrale Schlüssel bleibt die unveränderte Node-ID. Dadurch ist die Experience Layer austauschbar und erweiterbar, während die kanonische Wissensbasis stabil und für spätere KI-Auswertung nutzbar bleibt.
