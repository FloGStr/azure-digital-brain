# Azure Digital Brain V2.1 – QA Report

## Ergebnis

**PASS**

## Prüfmatrix

| Prüfung | Ergebnis | Nachweis |
|---|---|---|
| vollständiges V2.0-Backup | PASS | 12.697 Dateien in `backups/version-2.0` |
| V2.0 bytegleich erhalten | PASS | 0 fehlende, 0 veränderte Dateien |
| kanonische Knoten | PASS | 1.058, IDs und Hierarchie unverändert |
| bestehende Relationen | PASS | 243, unverändert |
| bestehende Quellen | PASS | 155, unverändert |
| Architecture Scenario Layer V2.0 | PASS | 5 Szenarien, bytegleich |
| Learning Path IDs | PASS | 5 eindeutig |
| Learning Step IDs | PASS | 33 eindeutig |
| Knotenreferenzen | PASS | 72 eindeutige Ziele, alle gültig |
| Szenarioreferenzen | PASS | 5 eindeutige Ziele, alle gültig |
| Lernschritt-Links | PASS | alle Voraussetzungen und Folge-IDs gültig |
| Practice-Integration | PASS | 0 Integrationen, alle Felder leer |
| Benutzerprofil | PASS | vorhandenes Schema V1.1 und vorhandene Bereiche wiederverwendet |
| Runtime Build | PASS | `data/runtime/learning-runtime.js` erzeugt |

## Unverändertheitsnachweis

Der automatisierte QA-Lauf vergleicht jede Datei des vollständigen V2.0-Backups mit ihrem Gegenstück in V2.1 anhand Größe und SHA-256. Damit sind nicht nur `nodes.json`, IDs und Hierarchie, sondern auch Relationen, Quellen, bestehende Runtime, UI, Berichte und die gesamte V2.0 Architecture Scenario Layer abgedeckt.

## Validierungsumfang der Lernschicht

- Schema- und Versionskennung
- exakt fünf Lernpfade
- eindeutige Pfad- und Schritt-IDs
- Pflichtfelder jedes Lernschritts
- gültige kanonische Knotenreferenzen
- gültige V2.0-Szenarioreferenzen
- gültige Voraussetzungen und nächste Schritte
- keine Selbstreferenzen oder Zyklen in Voraussetzungen
- gültige Maturity Levels
- Decision Framework für alle fünf Entscheidungsschritte
- Learning Phases für alle fünf Szenarioschritte
- leere `practice_references` ohne externe Integration
- Wiederverwendung des vorhandenen Benutzerprofilschemas

## Reproduzierbarkeit

Im Projektverzeichnis:

```text
node tools/build-learning-runtime.mjs
node tools/qa-learning-framework-v2.1.mjs
```

Die maschinenlesbare QA-Ausgabe befindet sich zusätzlich in `reports/qa-v2.1.json`.

## Paketprüfung

Nach der finalen Paketerzeugung wird das ZIP vollständig getestet. Der SHA-256-Wert des unveränderlichen Endarchivs wird als externe Schwesterdatei `Azure-Digital-Brain-V2.1.zip.sha256` ausgeliefert; ein Hash des ZIPs kann aus technischen Gründen nicht verlässlich in dasselbe, danach unverändert bleibende ZIP eingebettet werden.
