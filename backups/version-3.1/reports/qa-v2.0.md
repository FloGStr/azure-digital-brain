# Azure Digital Brain V2.0 – QA-Bericht

Stand: 11. August 2026  
Prüfskript: `tools/qa-architecture-layer-v2.0.mjs`  
Ergebnis: **PASS**

## V1.8-Unveränderbarkeit

| Prüfung | Ergebnis |
|---|---|
| vollständiges Backup `backups/version-1.8/` vorhanden | PASS |
| 6.343 V1.8-Dateien im V2.0-Hauptbestand bytegleich | PASS |
| Knotenanzahl 1.058 | PASS |
| IDs und ID-Reihenfolge unverändert | PASS |
| Eltern-/Kindhierarchie unverändert | PASS |
| bestehende Relationen 243 bytegleich | PASS |
| Relationstyp-Registry bytegleich | PASS |
| Quellenregister V1.8 bytegleich | PASS |
| UI, bestehende Runtime und Buildprozess bytegleich | PASS |

## Scenario Layer

| Prüfung | Ergebnis |
|---|---:|
| Szenarien | 5 |
| eindeutig referenzierte Bestandsknoten | 44 |
| Szenario-Beziehungen | 50 |
| verwendete bestehende Relationstypen | 5 |
| neue Relationstypen | 0 |
| neue offizielle Quellen | 9 |
| neue Azure-Produktknoten | 0 |
| doppelte Szenario-IDs | 0 |
| doppelte Szenario-Relations-IDs | 0 |
| doppelte Beziehungstripel | 0 |
| ungültige Knotenreferenzen | 0 |
| ungültige Quellenreferenzen | 0 |

Für jedes Szenario wurden Kurzbeschreibung, Architekturziel, Akteure, Komponenten, Ablauf, Diagramm, technische Erklärung, Entscheidungen, Security, Monitoring, Reliability, Kosten, Fehler, Enterprise-Beispiel, Betriebsmodell, Lernpfad und Merksatz validiert.

## Beziehungen

Jede der 50 Beziehungen wurde geprüft auf:

- eindeutige ID,
- Szenario als Quelle,
- vorhandenen kanonischen Knoten als Ziel,
- Relationstyp aus der unveränderten Registry,
- korrekte Gegenrichtung,
- Erklärung,
- auflösbare offizielle Quelle,
- Confidence,
- Status `accepted`.

Ergebnis: **PASS**

## Quellen

Alle neun neuen Quellen verwenden `https://learn.microsoft.com/`, Publisher `Microsoft Learn` und Typ `official`. Die URLs wurden zusätzlich online geöffnet. Historische Quellen bleiben bytegleich in der V1.8-Basis.

Ergebnis: **PASS**

## Builds

- bestehender Haupt-Runtime-Build in isolierter Umgebung: **PASS**
- neue Architecture-Runtime aus `scenarios.json`: **PASS**
- Architecture-Manifest: 5 Szenarien, 44 Knoten, 50 Beziehungen, 9 Quellen, 5 Relationstypen

## Funktionsgrenzen

- Architecture Mode als Runtime-Vertrag vorbereitet: **PASS**
- UI geändert: **NEIN**
- KI-Integration implementiert: **NEIN**

## ZIP- und Paketprüfung

- ZIP-Struktur mit direktem Top-Level-Ordner `Azure-Digital-Brain-V2.0/`: **PASS**
- vollständige ZIP-Datenprüfung: **PASS**
- SHA-256-Nachweis: wird als gleichnamige `.sha256`-Datei neben dem ZIP veröffentlicht

## Gesamturteil

V2.0 erfüllt die append-only-Grenzen. Es erweitert die Wissensplattform um eine eigenständige, referenzierende Szenarioschicht, ohne einen bestehenden Knoten, eine ID, eine Hierarchiebeziehung, eine Alt-Relation oder eine UI-Datei zu verändern.
