# Azure Digital Brain V2.2 – Learning Mode

## Datenbasis

Der Learning Mode liest ausschließlich `data/runtime/learning-runtime.js`. Das V2.1 Learning Framework und seine Runtime sind bytegleich geblieben.

Verfügbare Lernpfade:

1. Azure Mental Model
2. Application Journey
3. Enterprise Platform Architecture
4. Architecture Decision Making
5. Enterprise Scenario Learning

## Pfadübersicht

Pro Pfad werden angezeigt:

- Titel und Ziel
- Anzahl Schritte
- abgeschlossener Anteil
- aktueller beziehungsweise nächster offener Schritt

Der Fortschritt wird aus dem vorhandenen lokalen Benutzerprofil berechnet.

## Learning-Step-Ansicht

Die Ansicht zeigt ausschließlich vorhandene V2.1-Felder:

- Titel
- Learning Goal
- Erklärung
- Maturity Level
- Voraussetzungen
- referenzierte Azure-Knoten
- referenzierte Architecture Scenarios
- Architecture Questions
- empfohlene nächste Schritte

Knoten öffnen die bestehende Detailansicht. Szenarien wechseln gezielt in den Architecture Mode. Voraussetzungen und Folgepfade öffnen den referenzierten Learning Step.

## Maturity Levels

| Level | Bedeutung | Selbstprüfung |
|---:|---|---|
| 1 | Verstehen | Ich weiß, was es ist. |
| 2 | Zusammenhänge verstehen | Ich weiß, womit es verbunden ist. |
| 3 | Anwenden | Ich kann es in einem Szenario einsetzen. |
| 4 | Architektur entscheiden | Ich kann Alternativen bewerten. |

Es wurden keine neuen Levels angelegt.

## Persönlicher Lernfortschritt

Der vorhandene Profilschlüssel `adb:user-profile:v1.1` bleibt unverändert. Für Learning Steps werden die bereits vorbereiteten Bereiche genutzt:

- `learning_status[learning_step_id]`
- `notes[learning_step_id]`

Ein Lernstatus enthält:

- `status`: `not-started`, `in-progress` oder `completed`
- `progress_percent`: 0, 50 oder 100
- `last_opened_at`
- `understanding_level`: 1 bis 4
- `completed`

Die persönliche Notiz liegt im vorhandenen `notes`-Objekt. Profilimport und -export sichern damit bestehende Knotennotizen und neue Lernstände gemeinsam. Alle Daten bleiben im lokalen Browser; es gibt keine Synchronisation.

## Practice References

`practice_references` bleibt unberührt und leer. GitHub und Labs wurden nicht integriert.

