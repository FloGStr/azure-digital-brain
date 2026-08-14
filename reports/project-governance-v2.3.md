# Azure Digital Brain V2.3 – Project Governance Report

## Ergebnis

V2.3 führt ein verbindliches, schlankes Project Governance & Quality Operating Model ein. Dieser Release verändert keine Azure-Wissensinhalte und führt keinen Knowledge Cleanup durch.

## Operating Model

```text
DISCOVER
   ↓
DESIGN
   ↓
BUILD
   ↓
VALIDATE
   ↓
HUMAN REVIEW
   ↓
RELEASE
   ↓
GOVERN
   ↓
IMPROVE ────────────> nächster kontrollierter Zyklus
```

Jede Phase definiert Ziel, Aktivitäten, Inputs, Outputs, Quality Gate, automatisch zulässige Schritte und zwingende Human Reviews. Der Prozess verbindet iterative Produktentwicklung mit expliziter Risiko- und Qualitätssteuerung.

## Verbindliche Dateien

| Dokument | Funktion |
|---|---|
| `PROJECT-GOVERNANCE.md` | Lebenszyklus, Rollen, Arbeitsfluss, Definition of Done und Release-Hand-off |
| `QUALITY-GATES.md` | sechs Gates, Audit-Kategorien, Confidence, Findings und Statusmodell |
| `CHANGE-POLICY.md` | Change-Klassen, Stop-Regeln, Safe Delete/Merge, Archivierung und Rule Promotion |
| `DECISION-LOG.md` | langfristig relevante Entscheidungen mit Kontext und Auswirkungen |

Vor jeder zukünftigen Änderung muss Work zuerst `PROJECT-GOVERNANCE.md` lesen. Governance-Konflikte werden dokumentiert und bei Risiko oder fehlendem Kontext an Human Review übergeben.

## Change-Klassen

| Klasse | Kernregel |
|---|---|
| A – Safe / Presentation | nach relevanter QA weitgehend automatisierbar |
| B – Additive | Backup, Validierung, Referenzprüfung und Release-Dokumentation |
| C – Structural | immer Proposal, Impact Analysis und Human Review |
| D – Destructive | niemals automatisch; explizite Freigabe vor kontrollierter Änderung |

Bei gemischter Wirkung gilt die höchste Klasse.

## Human-in-the-loop

Human Review ist zwingend bei:

- strukturellen und destruktiven Änderungen,
- Governance-Ausnahmen,
- neuer aktiver Quality Rule,
- unklarem ursprünglichem Kontext,
- Risiko einzigartiger oder persönlicher Informationsverluste,
- ungelösten High-Risk-Exceptions.

Automatisierung darf Qualität erkennen, klassifizieren, priorisieren und Aktionen vorschlagen. Confidence allein erlaubt keine Datenänderung.

## Safe Change und Continual Improvement

Künftige Knowledge Audits laufen getrennt von Bereinigungen:

```text
Quality Scan → Findings → Priorisierung → Human Review
             → freigegebene Changes → Rule Learning
```

Rule Promotion benötigt mehrere bestätigte Entscheidungen, ein Proposal und Human Approval. Eine aktive Regel bleibt zunächst detektiv und vorschlagend.

## Definition of Done

Ein Release benötigt Scope-Erfüllung, Governance-Nachweis, anwendbare Gates, vollständiges Backup, Datenintegrität, Regression, zentrale Version, Reports, geprüftes ZIP, SHA-256 sowie direkte Links auf bestehenden Projektordner und dessen `START.html`.

## V2.3-Änderungsumfang

V2.3 ist ein Class-B-Change: additive Governance-Dokumente und zentrale Release-Metadaten.

Geänderte bestehende Dateien:

- `data/canonical/release.json`
- `data/runtime/release-runtime.js`
- `tools/build-release-runtime.mjs`

Neue Dateien:

- vier Governance-Kerndokumente
- `README-V2.3.md`
- V2.3-Reports und Governance-QA
- vollständiges `backups/version-2.2/`

Alle anderen V2.2-Dateien bleiben bytegleich.

## Referenzrahmen

Das Modell ist für dieses Projekt zugeschnitten und orientiert sich an Microsofts wiederkehrendem Cloud-Adoption-Lebenszyklus und an den fünf Well-Architected-Säulen. Microsoft beschreibt das Cloud Adoption Framework als strukturierte Roadmap mit grundlegenden und operativen Methodologien; das Well-Architected Framework betont fünf miteinander abzuwägende Qualitätsdimensionen und iterative Verbesserung. Quellen: [Microsoft Cloud Adoption Framework](https://learn.microsoft.com/azure/cloud-adoption-framework/overview), [Azure Well-Architected Framework](https://learn.microsoft.com/azure/well-architected/what-is-well-architected-framework), [Well-Architected pillars](https://learn.microsoft.com/azure/well-architected/pillars).

