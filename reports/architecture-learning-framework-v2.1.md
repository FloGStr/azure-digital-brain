# Azure Digital Brain V2.1 – Architecture Learning Framework

## Ergebnis

V2.1 ergänzt das unveränderte Azure Digital Brain V2.0 um eine additive Lern- und Navigationsschicht. Sie ordnet vorhandenes Wissen in Lernreihenfolgen, macht Voraussetzungen sichtbar und verbindet Konzepte mit Architekturfragen und den fünf vorhandenen V2.0-Szenarien.

Die Schicht ist ausdrücklich keine Prüfungsvorbereitung und enthält keine neuen Azure-Produktknoten oder fachlichen Primärinhalte. Fachwissen bleibt in den 1.058 kanonischen Knoten und den V2.0-Szenarien; das Learning Framework referenziert diese ausschließlich.

## Kennzahlen

| Kennzahl | Ergebnis |
|---|---:|
| Lernpfade | 5 |
| Lernschritte | 33 |
| eindeutig referenzierte Wissensknoten | 72 |
| Knotenreferenzen insgesamt | 127 |
| eindeutig referenzierte V2.0-Szenarien | 5 von 5 |
| Szenario-Verknüpfungen insgesamt | 53 |
| neue Azure-Produktknoten | 0 |
| Änderungen an V2.0-Dateien | 0 |
| vorbereitete externe Practice-Integrationen | 0 |

## Architektur

```text
data/canonical/nodes.json ───────────────┐
data/canonical/scenarios.json ───────────┼─> learning-framework.json
                                        │          │
learning-schema.json ───────────────────┘          v
                                      build-learning-runtime.mjs
                                                   │
                                                   v
                                      data/runtime/learning-runtime.js
```

`learning-framework.json` ist die kanonische Source of Truth der Lernschicht. `learning-schema.json` dokumentiert ihren Vertrag. Der Builder validiert alle Knoten-, Szenario- und Lernschritt-Referenzen und erzeugt daraus eine browserlesbare Runtime mit Pfad-, Schritt-, Knoten- und Szenarioindizes.

## Datenvertrag eines Lernschritts

Jeder Schritt enthält:

- stabile Lernschritt-ID und Titel
- Lernziel und kurze Einordnung
- Referenzen auf bestehende Knoten und Szenarien
- Voraussetzungen und nächste Lernschritte
- Architekturfragen zur Selbstprüfung
- Reifegrad von Verstehen bis Entscheiden
- leeres optionales Feld `practice_references` für eine spätere, noch nicht implementierte Hands-on-Anbindung

Entscheidungsschritte ergänzen strukturierte Optionen, Kriterien, Trade-offs und Einsatzfälle. Szenarioschritte ergänzen die Phasen Vorwissen, Architektur verstehen und Designentscheidung treffen. Diese Felder organisieren vorhandenes Wissen; sie erweitern nicht die Azure-Wissensbasis.

## Maturity Model

| Level | Bedeutung | Selbstprüfung | Schritte |
|---|---|---|---:|
| 1 | Verstehen | Ich weiß, was es ist. | 2 |
| 2 | Zusammenhänge verstehen | Ich weiß, womit es verbunden ist. | 11 |
| 3 | Anwenden | Ich kann es in einem Szenario einsetzen. | 10 |
| 4 | Architektur entscheiden | Ich kann Alternativen bewerten. | 10 |

Die Verteilung ist absichtlich praxisorientiert: 20 der 33 Schritte liegen auf den Ebenen Anwenden oder Entscheiden.

## Persönlicher Lernstatus

Es wurde kein neues Profilschema eingeführt. Das Beispiel `data/user/user-profile-learning-v2.1.example.json` nutzt ausschließlich die vorhandenen V1.1-Profilbereiche:

- `learning_status[learning_step_id]` für Fortschritt, zuletzt geöffnet, Verständnislevel und Abschlussstatus
- `notes[learning_step_id]` für persönliche Notizen

Persönliche Daten bleiben außerhalb der kanonischen Wissensbasis.

## Domänenabdeckung

Die 72 eindeutigen Knotenreferenzen verteilen sich über die vorhandenen Kategorien:

| Domäne/Kategorie | referenzierte Knoten |
|---|---:|
| Governance | 13 |
| Architecture | 12 |
| Networking | 11 |
| Security | 10 |
| Identity | 9 |
| Monitoring | 6 |
| Compute | 4 |
| Cost & Lifecycle | 2 |
| Databases | 2 |
| Storage | 2 |
| Azure Fundamentals | 1 |

Die Abdeckung ist kein Vollständigkeitsmaß der Wissensbasis. Sie zeigt, welche kanonischen Anker für die Lernnavigation ausgewählt wurden.

## Wissenslücken und Grenzen

- Für den Tenant existiert kein eigenständiger kanonischer Tenant-Knoten. Der Lernschritt verweist deshalb auf vorhandene Entra-ID- und Identity-Boundary-Knoten.
- Azure Container Apps existiert nicht als kanonischer Knoten. Der Compute-Vergleich nutzt nur die vorhandenen Optionen Virtual Machines, App Service, Azure Container Instances und AKS.
- Die Data-Entscheidung kann nur die vorhandenen Anker Azure SQL Database, Cosmos DB und Storage Account vergleichen; weitere Datenplattformen wurden regelkonform nicht ergänzt.
- Ein expliziter generischer Endnutzer-Knoten existiert nicht. Die Application Journey beginnt deshalb mit dem ersten vorhandenen technischen Anker Azure DNS.
- Hands-on-Labs, Lernstands-UI und GitHub-Integration sind vorbereitet, aber nicht implementiert.

Diese Punkte sind dokumentierte Navigationslücken, keine Freigabe zum Erzeugen neuer Produktknoten.

## Dateien

- `data/canonical/learning-framework.json`
- `data/canonical/learning-schema.json`
- `data/runtime/learning-runtime.js`
- `data/runtime/learning-manifest.json`
- `data/user/user-profile-learning-v2.1.example.json`
- `tools/build-learning-runtime.mjs`
- `tools/qa-learning-framework-v2.1.mjs`

