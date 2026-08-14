# Azure Digital Brain – Content Standard V1.0

Status: verbindlich  
Gültig ab: Azure Digital Brain V1.3  
Stand: 11. August 2026

## Zweck

Dieser Standard definiert, wann ein Wissensknoten als redaktionell angereichert und veröffentlichungsfähig gilt. Er verhindert unterschiedliche Qualitätsniveaus zwischen Themenbereichen und macht manuelle sowie spätere KI-gestützte Vorschläge vergleichbar und prüfbar.

Der Standard verändert weder Datenarchitektur noch Benutzeroberfläche. Er nutzt die vorhandenen Felder des kanonischen V1.1-Datenvertrags und die bestehende Relation Registry.

## Grundprinzipien

1. **Verstehen vor Vollständigkeit:** wenige präzise Knoten sind wertvoller als viele oberflächliche Texte.
2. **Eine Aussage pro Ebene:** Simple erklärt das Konzept, Technical seine Funktionsweise, Architecture seine Designfolgen.
3. **Quelle statt Autoritätsbehauptung:** fachliche Kernaussagen müssen auf offizielle Dokumentation zurückführbar sein.
4. **Semantik statt Linien:** jede Querverbindung braucht einen eindeutigen Relationstyp und eine erklärbare Aussage.
5. **Stabile Herkunft:** IDs, Hierarchie und `legacy.original` bleiben erhalten, solange keine eigene Migrationsphase freigegeben ist.
6. **Keine Scheingenauigkeit:** zeitabhängige Produktnamen, Lizenzdetails, Limits und Preview-Status werden nur mit aktueller Quelle genannt.
7. **Redaktionelle Synthese:** Microsoft-Dokumentation wird fachlich zusammengefasst, nicht kopiert.

## Pflichtfelder eines angereicherten Knotens

### 1. Kurz erklärt – `description.simple`

**Zielgruppe:** Einsteiger und AZ-900-Level.

**Muss:**

- 2–4 vollständige Sätze
- in einfacher, konkreter Sprache erklären, was das Konzept ist
- den Existenzgrund oder unmittelbaren Nutzen nennen
- Abkürzungen beim ersten Auftreten ausschreiben

**Darf:**

- eine kurze Alltagseinordnung enthalten
- einen wichtigen Unterschied zu einem leicht verwechselbaren Konzept nennen

**Darf nicht:**

- Konfigurationsdetails, SKU-Listen oder Marketingformulierungen dominieren lassen
- unerklärte Fachbegriffe aneinanderreihen
- „sicher“, „hochverfügbar“ oder „intelligent“ ohne konkrete Bedeutung verwenden

### 2. Technische Erklärung – `description.technical`

**Zielgruppe:** technische Anwender und AZ-104-Level.

**Muss:**

- die tatsächliche Funktionsweise beschreiben
- zentrale Komponenten und Fachbegriffe einordnen
- typische Konfigurationselemente nennen
- technische Abgrenzungen korrekt formulieren

**Soll:**

- Daten- oder Kontrollfluss erläutern
- relevante Geltungsbereiche, Protokolle oder Objektbeziehungen nennen
- Sicherheits- und Betriebsverhalten konkretisieren

**Darf nicht:**

- lediglich die Simple-Erklärung mit mehr Wörtern wiederholen
- Dokumentationstext kopieren
- variable Limits, Preise oder Lizenzdetails ohne aktuelle Quelle festschreiben

### 3. Architekturverständnis – `description.architecture`

**Zielgruppe:** Cloud Engineer und Cloud Architect.

**Muss mindestens drei der folgenden Fragen beantworten:**

- Wann wird das Konzept eingesetzt?
- Welche Designentscheidung hängt davon ab?
- Welche Alternative oder Ergänzung existiert?
- Welche Sicherheitsauswirkung entsteht?
- Welche Auswirkung hat es auf Skalierung, Kosten, Governance oder Betrieb?
- Welche typische Fehlentscheidung soll vermieden werden?

**Muss:**

- Entscheidungen und Trade-offs ausdrücken
- das Konzept mit benachbarten Architekturbausteinen verbinden
- zwischen Produktfunktion und Verantwortlichkeit des Kunden unterscheiden

**Darf nicht:**

- zum unkonkreten Best-Practice-Absatz werden
- eine universelle Empfehlung geben, wenn die Wahl vom Szenario abhängt

### 4. Relevanz – `why_important`

**Umfang:** 1–3 Sätze.

Beantwortet: Warum muss ein Azure-Architekt dieses Konzept verstehen? Die Aussage soll eine konkrete Folge benennen, etwa Sicherheitsrisiko, Betriebsabhängigkeit, Kostenwirkung oder Designgrenze.

### 5. Beispiele – `examples[]`

**Muss:**

- mindestens ein realistisches Szenario enthalten
- Akteur, Ziel und Wirkung konkret machen
- zum beschriebenen Konzept passen, nicht nur dessen Namen wiederholen

**Gutes Muster:**

> Eine Entwicklergruppe erhält die Rolle Reader auf einer Ressourcengruppe. Dadurch kann sie Ressourcen prüfen, aber weder Konfigurationen ändern noch Rollen vergeben.

**Schlechtes Muster:**

> Ein Benutzer nutzt RBAC.

Mehrere Beispiele sind sinnvoll, wenn sie unterschiedliche Betriebs- oder Architekturvarianten zeigen.

### 6. Merksatz – `merksatz`

Ein kurzer, fachlich korrekter Satz. Er soll einen Kernunterschied oder Entscheidungsanker verankern und darf keine Ausnahme als absolute Regel darstellen.

### 7. Analogie – `analogy`

Optional. Eine Analogie wird nur verwendet, wenn sie das mentale Modell verbessert. Sie muss danach technisch auflösbar bleiben und darf keine falsche Gleichsetzung erzeugen. Für Protokolle, Lizenzmodelle oder feine Sicherheitsmechanismen ist häufig keine Analogie besser als eine irreführende.

### 8. Quellen – `sources[]`

Zulässig sind ausschließlich:

- Microsoft Learn
- Azure Architecture Center

**Regeln:**

- mindestens eine offizielle Quelle pro angereichertem Knoten
- möglichst die spezifische Konzept- oder Übersichtsseite, nicht nur eine Dokumentations-Startseite
- Zugriffsdatum in `data/canonical/sources.json`
- zeitabhängige Aussagen mit der direkt passenden Quelle belegen
- Quellen werden als IDs referenziert; URLs stehen nur im zentralen Quellenregister

## Titel, Aliase und historische Begriffe

- Die kanonische Knoten-ID bleibt unverändert.
- Ein veralteter, fehlerhafter oder satzförmiger Titel darf fachlich normalisiert werden.
- Der vorherige Titel wird automatisch als Alias erhalten.
- `legacy.original` bleibt unverändert.
- Produktumbenennungen werden mit aktuellem Namen im Titel und historischem Namen als Alias abgebildet.
- Eine Titelkorrektur darf keinen fachlich fremden Knoten erzeugen. Fehlende Konzepte werden als Scope-Lücke dokumentiert statt in einen unpassenden Knoten hineinzudeuten.

## Tags und Metadaten

Ein Pilotknoten erhält:

- ein Pilot-Tag im Format `<domain>-pilot-v<version>`
- wenige fachlich nützliche Tags, keine Synonymliste
- `metadata.status = "published"` nach bestandenem Review
- `metadata.enrichment` mit Version, Pilotname, Reviewdatum und Quellenrichtlinie
- `updated_at` mit dem Reviewdatum

Die Felder `origin`, `created_at`, ID, Elternknoten und Kinder werden nicht redaktionell verändert.

## Standard für semantische Beziehungen

Jede akzeptierte Beziehung benötigt:

- stabile Relations-ID
- Quellknoten
- Zielknoten
- registrierten Relationstyp
- registrierte Gegenrichtung
- eine konkrete Erklärung
- mindestens eine offizielle Quelle
- Confidence zwischen 0 und 1
- Status `accepted`
- Ersteller und Reviewdatum

### Qualitätsregeln

1. Die Aussage muss auch ohne Grafik als Satz verständlich sein: „Quelle **Typ** Ziel, weil …“.
2. Die Richtung muss zum Relationstyp passen. `contains` und `part_of` dürfen nicht vertauscht werden.
3. Eine Beziehung beschreibt genau eine fachliche Aussage.
4. Die Erklärung nennt den Mechanismus oder Grund, nicht nur beide Knotennamen.
5. Beziehungen zwischen Sammelknoten werden vermieden, wenn ein präziserer Unterknoten existiert.
6. Symmetrische Typen werden nur für tatsächlich symmetrische Aussagen verwendet.
7. Alternative Dienste sind nur `alternative_to`, wenn sie dasselbe Architekturproblem in unterschiedlichen Szenarien lösen.
8. Neue Relationstypen werden nur ergänzt, wenn das vorhandene Register die Aussage nicht präzise ausdrücken kann. Gegenrichtung, Beschreibung, Farbe und Priorität sind Pflicht.
9. Pilotbeziehungen benötigen eine Confidence von mindestens 0,95. Unsichere Aussagen bleiben Vorschläge und werden nicht veröffentlicht.
10. Keine doppelte Beziehung mit identischem Quellknoten, Typ und Zielknoten.

## Inhaltliche Prüfliste

Für jeden Knoten prüft ein Review:

- fachliche Richtigkeit gegen die verknüpften Quellen
- klare Trennung der drei Ebenen
- keine Widersprüche zwischen Erklärung, Beispiel und Beziehungen
- korrekte aktuelle Produktbezeichnung
- verständliche deutsche Sprache und konsistente Azure-Fachbegriffe
- Beispiel bildet ein mögliches reales Szenario ab
- Merksatz übertreibt nicht
- Analogie ist optional und technisch nicht irreführend
- keine ungeprüften Preise, Limits, Lizenz- oder Preview-Aussagen

Für jede Beziehung prüft das Review:

- Existenz beider Endpunkte
- registrierter Typ und reziproke Gegenrichtung
- richtige Richtung
- nachvollziehbarer Mechanismus
- passende Quelle
- keine semantische Dublette

## Technische Definition of Done

Ein Enrichment-Paket ist fertig, wenn:

1. Knotenanzahl und ID-Reihenfolge gegenüber der gesicherten Vorversion unverändert sind.
2. Alle Eltern-/Kindbeziehungen unverändert und wechselseitig gültig sind.
3. Nicht zum Pilot gehörende angereicherte Bereiche unverändert bleiben.
4. Alle Pflichtfelder der Pilotknoten gefüllt sind.
5. Alle Quellen- und Relationsreferenzen auflösbar sind.
6. Relationstypen und Gegenrichtungen im Register gültig sind.
7. Der Runtime-Build ohne Fehler läuft.
8. App- und Tool-JavaScript syntaktisch gültig sind.
9. Ein Pilotbericht Statistik, Änderungen, offene Punkte und Empfehlungen dokumentiert.
10. Eine vollständige Sicherung der Vorversion im Paket liegt.

## Redaktionsworkflow

```text
Scope inventarisieren
        ↓
vorhandene Knoten priorisieren
        ↓
offizielle Quellen registrieren
        ↓
drei Ebenen + Relevanz + Beispiel schreiben
        ↓
Relationen als semantische Sätze modellieren
        ↓
fachliches und automatisiertes Review
        ↓
Runtime bauen
        ↓
Pilotbericht und Paket freigeben
```

## Regeln für spätere KI-Vorschläge

KI darf Vorschläge vorbereiten, aber nicht direkt veröffentlichen. Besonders geeignet sind:

- Entwürfe für `description.simple` aus bereits registrierten Quellen
- Vorschläge für Beispiele mit klar gekennzeichnetem Szenario
- Kandidaten für fehlende Querverbindungen
- Erkennung veralteter Produktnamen
- Hinweise auf widersprüchliche oder doppelte Knoten

Menschliches Review bleibt verpflichtend für:

- Architektur- und Sicherheitsentscheidungen
- neue Relationstypen
- Produktmigrationen und Deprecations
- Lizenz-, Kosten-, Limit- und Preview-Aussagen
- Änderungen an IDs oder Hierarchie
- Annahme oder Ablehnung eines KI-Vorschlags

## Anti-Patterns

- drei nahezu identische Erklärungsebenen
- generische Aussagen wie „ist wichtig für Sicherheit“
- Beispiele ohne Ergebnis oder Entscheidung
- Quellen-URLs direkt in jedem Knoten statt zentraler Source-ID
- Sammelrelationen wie „hat mit Sicherheit zu tun“
- Analogien als Ersatz für die technische Erklärung
- historische Produktnamen ohne Aktualitätshinweis
- fehlende Konzepte durch Umdeutung fachlich fremder Knoten verstecken
- Massenanreicherung ohne Pilot, Review und Rückvergleich
