# Azure Digital Brain V2.2 – QA Report

## Gesamtstatus

**PASS WITH BROWSER EXECUTION PENDING**

Die Daten-, Referenz-, Build-, Offline- und statischen Kompatibilitätsprüfungen sind erfolgreich. Ein ausgeführter Interaktionstest in Chrome und Safari konnte aus Codex heraus nicht abgeschlossen werden, weil die Chrome-Browser-Erweiterung nicht verbunden war und die Browsersteuerung keinen Safari-Kanal bereitstellt. Chrome  und Safari sind auf dem Mac installiert. Dieser Status wird bewusst nicht als ausgeführter Browser-PASS dargestellt.

## Geschützte Daten

| Prüfung | Ergebnis |
|---|---|
| vollständiges V2.1-Backup | PASS – 25.407 Dateien |
| Backup gegenüber freigegebener V2.1-Arbeitsversion | bytegleich |
| kanonische Knoten | 1.058, bytegleich |
| Node-IDs und Hierarchie | unverändert |
| Knowledge-Graph-Relationen | 243, bytegleich |
| Wissensquellen | 155, bytegleich |
| V2.0-Szenarien | 5, bytegleich |
| V2.1-Lernpfade | 5 mit 33 Schritten, bytegleich |
| Knowledge-/Architecture-/Learning-Runtimes | bytegleich |
| Benutzerprofil-Beispiele | bytegleich |

## Referenzen

| Prüfung | Ergebnis |
|---|---|
| Node Links | PASS |
| Scenario Links | PASS |
| Learning-Step Links | PASS |
| Parent-/Child-Hierarchie | PASS |
| Diagrammknoten | PASS – alle fünf Graphen vollständig aufgelöst |
| doppelte DOM-IDs | keine |
| fehlende DOM-Referenzen | keine |

## Runtime Builds

Die Builder wurden in einer temporären, isolierten Projektkopie ausgeführt, damit die freigegebenen V2.0-/V2.1-Runtimes im Release nicht neu geschrieben werden.

| Build | Ergebnis |
|---|---|
| Knowledge Runtime | PASS |
| Architecture Runtime | PASS |
| Learning Runtime | PASS |
| Release Runtime | PASS |

## Funktionsabdeckung

| Bereich | Prüfmethode | Ergebnis |
|---|---|---|
| Mindmap | bestehende Implementierung erhalten, Syntax/DOM/Runtime geprüft | PASS static/regression |
| Brain | bestehende Implementierung erhalten, Syntax/DOM/Runtime geprüft | PASS static/regression |
| Architecture | Daten- und Graphreferenzen, DOM und Events geprüft | PASS static |
| Lernen | Pfad-/Schrittlinks, Profilvertrag, DOM und Events geprüft | PASS static |
| START.html | lokales Redirect und relative Scriptkette geprüft | PASS static |
| Profil/Notizen | bestehender V1.1-Schlüssel, Import/Export und lokale Speicherung erhalten | PASS static |
| Alles aufklappen | Zustandsmodell öffnet alle Elternzweige; 1.058 Knoten sichtbar; ein Renderlauf | PASS model/static |
| Alles zuklappen | Root und sieben Hauptäste sichtbar; ein Renderlauf | PASS model/static |
| Einzelzweig danach | erster Hauptzweig lässt sich nach globalem Zuklappen wieder öffnen | PASS model/static |
| Suche | bestehende Suchverdrahtung unverändert vorhanden | PASS static/regression |

## Offline- und Sicherheitsgrenzen

- keine externen Scripts
- keine HTTP-Abhängigkeit
- kein `fetch`
- keine AI-Integration
- keine GitHub-Integration
- `START.html` verweist relativ auf `app/index.html`
- Runtime-Dateien werden relativ aus `data/runtime` geladen

## Browserstatus

| Ziel | Status |
|---|---|
| Chrome macOS | installiert; automatisierter Lauf ausstehend, da ChatGPT-Browser-Erweiterung nicht verbunden |
| Safari macOS | installiert; statische Safari-Kompatibilitätsprüfung bestanden, ausgeführter Lauf ausstehend |

Für einen echten Chrome-Lauf muss in Codex unter **Settings → Computer use** die ChatGPT-Browser-Erweiterung verbunden werden. Anschließend sollten mindestens Moduswechsel, Diagrammklick, Szenariosprung, Lernstatus, Profilpersistenz, Mindmap-Zoom und Brain-Fokus manuell beziehungsweise automatisiert bestätigt werden.

Für die globale Mindmap-Steuerung soll der Browserlauf zusätzlich vollständiges Aufklappen, vollständiges Zuklappen, anschließendes Öffnen eines Einzelzweigs und Suche bei vollständig aufgeklappter Map abdecken. Das Datenmodell bestätigt, dass der vollständige Zustand exakt 1.058 Knoten umfasst; der Code führt pro globaler Aktion nur einen Renderlauf aus.

## Maschinenlesbarer Nachweis

`reports/qa-v2.2.json`

Reproduzierbarer Lauf:

```text
node tools/qa-ui-v2.2.mjs
```
