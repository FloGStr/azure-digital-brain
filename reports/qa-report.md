# QA Report – Azure Digital Brain V1.1

Stand: 2026-08-11

## Datenintegrität

| Prüfung | Ergebnis |
|---|---|
| migrierte Knoten | 1.058 von 1.058 |
| eindeutige Knoten-IDs | 1.058 |
| maximale Hierarchietiefe | 10 |
| Originalinhalt in `description.technical` erhalten | bestanden |
| Originaltext in `legacy.original` erhalten | bestanden |
| Eltern-/Kindbeziehungen erhalten und wechselseitig | bestanden |
| migrierte Beziehungen | 27 von 27 |
| Relationserklärungen, Quellen und Konfidenzen erhalten | bestanden |
| registrierte Beziehungstypen | 26 |
| reziproke Gegenrichtungen | bestanden |
| Quellen | 11 von 11 |

## Architekturschutz

- `build-runtime.mjs` verändert keine kanonische Datei.
- Die einmalige Migration bricht ab, sobald `data/canonical/nodes.json` existiert.
- Der Build lehnt defekte Knoten-, Hierarchie-, Relations-, Typ- und Quellenreferenzen ab.
- Die Runtime verweist ausdrücklich auf `generated_from: data/canonical`.
- Die Anwendung lädt nur `data/runtime/knowledge-runtime.js`, keine alte Wissensdatei.

## Browserprüfung

Geprüft in der lokalen Offline-Anwendung:

- Start über `START.html`
- 30 initial sichtbare Mindmap-Knoten
- Suche und vollständige Pfadöffnung für `Private Endpoint`
- strukturierte technische Erklärung und fachliche Metadaten
- Relationslabel `benötigt` von Private Endpoint zu Private DNS
- korrektes Gegenlabel `wird benötigt von` aus Sicht von Private DNS
- Relationsquellen werden im Detailpanel zusammengeführt
- Brain-Gesamtansicht mit 78 Wissensknoten und 27 semantischen Kanten
- Fokuswechsel über eine Relationskarte baut den Graph für den Zielknoten neu auf
- persönlicher Lernstatus und eigene Notiz bleiben nach Neuladen erhalten
- temporäre QA-Profildaten anschließend entfernt
- Profilimport über lokales JSON-Format ohne Konsolenfehler
- keine JavaScript-Fehler oder Warnungen im Browser

## Laufzeitprüfung

- JavaScript-Syntax von App, Migration und Runtime-Build gültig
- keine externen Bibliotheken, Fonts oder Laufzeitressourcen
- Doppelklick-kompatible relative Dateipfade
- Mindmap und Brain verwenden dieselben kanonisch erzeugten Knoten und Relationen

## Bewusste Grenzen

- Die Architektur-Erklärungsebene ist vorbereitet, wird aber nicht automatisch mit erfundenem Inhalt befüllt.
- KI-Vorschläge sind ein dokumentiertes Austausch- und Prüfmodell; keine KI ist direkt integriert.
- Persönliche Daten bleiben lokal; es gibt keine Cloud-Synchronisation.
- Die kanonischen JSON-Dateien werden derzeit weiterhin außerhalb der App redaktionell bearbeitet.
