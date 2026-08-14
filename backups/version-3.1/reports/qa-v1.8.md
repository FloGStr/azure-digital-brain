# Azure Digital Brain V1.8 – QA-Bericht

Stand: 11. August 2026  
Prüfskript: `tools/qa-monitoring-v1.8.mjs`  
Ergebnis: **PASS**

## Geprüfter Datenstand

| Prüfung | Ergebnis |
|---|---:|
| Knoten | 1.058 |
| maximale Hierarchietiefe | 10 |
| V1.8-Pilotknoten | 31 |
| V1.8-Erklärungstexte | 93 |
| V1.8-Beziehungen | 24 |
| Beziehungen gesamt | 243 |
| neue Quellen | 19 |
| Quellen gesamt | 155 |
| Relationstypen | 36 |

## Unveränderbarkeit

- Knotenanzahl unverändert: **PASS**
- IDs und ID-Reihenfolge unverändert: **PASS**
- Eltern-/Kindhierarchie unverändert: **PASS**
- frühere V1.2–V1.7-Knoten außerhalb der append-only Relationsreferenzen unverändert: **PASS**
- historische Relationen bytegleich: **PASS**
- historische Quellen bytegleich: **PASS**
- Relationstyp-Registry bytegleich: **PASS**
- UI-Dateien, Schema, Content Standard und Buildskript bytegleich: **PASS**
- vollständiges Backup `backups/version-1.7/` gegen freigegebene V1.7-Ausgabe: **PASS**, 3.169 Dateien, keine Abweichung

## Content Standard V1.0

Für alle 31 V1.8-Knoten wurde geprüft:

- Simple-Erklärung vorhanden und zwei bis vier Sätze lang,
- Technical-Erklärung vorhanden,
- Architecture-Erklärung vorhanden,
- `why_important` vorhanden,
- mindestens ein Praxisbeispiel vorhanden,
- Merksatz vorhanden,
- alle Quellenreferenzen auflösbar.

Ergebnis: **PASS**

## Beziehungen

Für alle 243 Beziehungen wurde geprüft:

- Relations-ID eindeutig,
- Kombination aus Quelle, Typ und Ziel eindeutig,
- beide Endpunkte vorhanden,
- Relationstyp in Registry vorhanden,
- Gegenrichtung entspricht Registry,
- Erklärung vorhanden,
- mindestens eine Quelle vorhanden,
- Confidence vorhanden,
- Status `accepted`,
- Relationsreferenzen in Knoten auflösbar.

Ergebnis: **PASS**  
Doppelte Relations-IDs: **0**  
Doppelte Relations-Tripel: **0**  
Neue Relationstypen: **0**

## Quellen

Die 19 neuen V1.8-Quellen wurden auf folgende Kriterien geprüft:

- eindeutige Quellen-ID,
- `https://learn.microsoft.com/` als Domain,
- Publisher `Microsoft Learn`,
- Typ `official`,
- fachliche Passung zum Pilotinhalt.

Historische MindMeister- und Microsoft-Quellen wurden nicht umklassifiziert, sondern auf Bytegleichheit geprüft.

Ergebnis: **PASS**

## Runtime Build

Der unveränderte Buildprozess wurde auf Basis von `data/canonical/` ausgeführt. Das Runtime-Manifest bestätigt:

```json
{
  "data_format_version": "1.1",
  "node_count": 1058,
  "relation_count": 243,
  "relation_type_count": 36,
  "source_count": 155,
  "max_depth": 10,
  "generated_from": "data/canonical"
}
```

Ergebnis: **PASS**

## Paketprüfung

Nach Erstellung des Ausgabepakets werden zusätzlich geprüft und in der Abschlussausgabe dokumentiert:

- ZIP-Struktur und Lesbarkeit,
- vollständige Entpackbarkeit,
- Paketdateizahl,
- SHA-256 des ZIP-Archivs.

## Gesamturteil

V1.8 erfüllt die harten Grenzen des Piloten. Die Anreicherung ist fachlich auf vorhandene Knoten begrenzt, frühere Pilotinhalte bleiben geschützt, die Source of Truth bleibt `data/canonical/`, und die Browser-Runtime wurde ausschließlich über den unveränderten Buildprozess erzeugt.
