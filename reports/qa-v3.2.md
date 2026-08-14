# Azure Digital Brain V3.2 – QA-Bericht

## Ergebnis

**PASS_WITH_BROWSER_LIMITATION**

- V3.1-Backup: 113/113 Dateien bytegleich
- Knoten: 1058, IDs eindeutig
- Relationen: 243, Datei bytegleich zu V3.1
- Quellen: 155, Datei bytegleich zu V3.1
- Canonical-Daten: vollständig bytegleich zu V3.1
- Availability-Set-Kontext: 24 Knoten, 3 direkte und 20 indirekte Nachbarn
- JavaScript-Syntax und Runtime-Build: PASS

## Funktionsprüfung

Der kontrollierte Kontext für `azure-0005` enthält den Elternknoten `azure-0004`, das direkte Unterthema `azure-0006`, Azure Virtual Machines `azure-0322` und die unveränderte Relation `compute-rel-012`. Die Kontextmenge bleibt unter dem Limit von 80 Knoten.

## Browser-QA

**BLOCKED_BY_TEST_ENVIRONMENT.** Die integrierte Browserprüfung blockiert direkte `file://`-Navigation. Daher wird kein automatischer Safari-/Chrome-PASS behauptet. Die manuelle Checkliste steht im JSON-Bericht.
