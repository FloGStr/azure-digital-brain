# Azure Digital Brain V3.1 – QA-Bericht

## Ergebnis

**PASS_WITH_BROWSER_LIMITATION**

- Knoten: 1058/1.058, IDs eindeutig
- Relationen: 243, unverändert
- Quellen: 155, unverändert
- V3.0-Klassifikationen: 1058/1.058
- Navigations-Aliase: 24, alle Ziele vorhanden
- Canonical-Hashes V2.4 ↔ V3.1: identisch
- JavaScript-Syntax: PASS
- Runtime-Build: PASS

## Funktionstests

| Test | Ergebnis |
| --- | --- |
| Exakte Node-ID `azure-0005` | azure-0005 · Exakte Node-ID · Score 1200 |
| Exakter Titel `Azure Virtual Machines` | azure-0322 · Exakter Titel · Score 1000 |
| Alias `VM` | azure-0322 · Alias · Score 900 |
| Historisch `Azure AD` | azure-0904 · Historischer Begriff · Score 850 |
| Kontextalias `Fault Domains` | azure-0326 · Alias · Score 900 |

Der Beispielsatz erkennt Availability Sets, Virtual Machines, Fault Domains und Update Domains. Alle Linkziele sind bestehende Node-IDs.

## Browser-QA

**BLOCKED_BY_TEST_ENVIRONMENT.** Die integrierte Browser-Sicherheitsrichtlinie blockiert direkte `file://`-Navigation. Entsprechend wird kein Safari-/Chrome-PASS behauptet. Die manuelle Checkliste steht in `qa-v3.1.json`.

## Historische QA-Skripte

Die alten QA-Skripte verlangen vollständig rekursive Backups bis V1.x/V2.x. Der daraus entstandene V2.4-Backupbaum umfasst rund 22 GB und wurde nicht erneut vervielfältigt. Für V3.1 werden stattdessen alle kanonischen Dateien bytegenau gegen V2.4 verglichen.
