# Azure Digital Brain V2.2

V2.2 macht die bereits vorhandenen Architecture Scenarios und Architecture Learning Paths in der lokalen Oberfläche nutzbar.

## Direkt starten

Doppelklick auf `START.html`. Kein Server und keine Installation sind erforderlich.

## Vier Perspektiven

- Mindmap – hierarchisches Wissen
- Brain – semantische Zusammenhänge
- Architecture – reale Azure-Architekturen
- Lernen – geführtes Architekturverständnis

Im Mindmap-Modus öffnen beziehungsweise schließen die Aktionen `Alles aufklappen` und `Alles zuklappen` die gesamte vorhandene Hierarchie in jeweils einem Renderlauf. Einzelne Zweige bleiben danach normal bedienbar.

## Schutzstatus

- 1.058 Knoten unverändert
- 243 Relationen unverändert
- 155 Wissensquellen unverändert
- fünf V2.0-Szenarien unverändert
- fünf V2.1-Lernpfade mit 33 Schritten unverändert
- vollständiges V2.1-Backup unter `backups/version-2.1`

## Lokale Daten

Notizen und Lernfortschritt werden im vorhandenen lokalen V1.1-Benutzerprofil gespeichert. Profilimport und -export bleiben verfügbar. Es gibt keine Cloud-, AI- oder GitHub-Verbindung.

## Release-Metadaten

`data/canonical/release.json` ist die zentrale Quelle für Versions- und Release-Zähler. `node tools/build-release-runtime.mjs` erzeugt daraus die Browser-Runtime.

## QA

`node tools/qa-ui-v2.2.mjs`

Der Daten- und statische UI-Test ist bestanden. Der ausgeführte Chrome-/Safari-Interaktionstest ist im QA-Bericht als ausstehend dokumentiert.
