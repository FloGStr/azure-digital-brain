# Azure Digital Brain V2.3 – Quality Gates Report

## Gate-Modell

| Gate | Zweck | Typische Nachweise |
|---|---|---|
| 1 – Data Integrity | IDs, Hierarchie und Referenzen schützen | ID-/Referenzprüfung, Hashvergleich, Schema-/Builder-Test |
| 2 – Knowledge Quality | fachliche Auffälligkeiten erkennen | Findings, Duplikat-/Legacy-/Fragment-Klassifizierung |
| 3 – Architecture Quality | Trade-offs über fünf WAF-Perspektiven prüfen | Reliability-, Security-, Cost-, Operations- und Performance-Review |
| 4 – Source Quality | Aussagen nachvollziehbar und aktuell halten | offizielle Quelle, fachliche Passung, URL-/Aktualitätsstatus |
| 5 – UX / Runtime | lokale Nutzbarkeit und Regression schützen | Mindmap, Brain, Architecture, Lernen, Profil, START, Browserstatus |
| 6 – Release Integrity | vollständige und prüfbare Auslieferung | Backup, Builds, QA, ZIP-Test, SHA-256 und Direktlinks |

Zulässige Gesamtstatus:

- `PASS`
- `PASS WITH EXCEPTIONS`
- `BLOCKED`
- `FAIL`

Jede Exception erfasst Ursache, Risiko, Bereich, Entscheidung, Owner und Follow-up.

## Architecture Quality

Gate 3 verwendet die fünf Azure-Well-Architected-Perspektiven:

- Reliability
- Security
- Cost Optimization
- Operational Excellence
- Performance Efficiency

Sie werden als Trade-off-Rahmen verwendet, nicht als Behauptung, jede Empfehlung müsse in jeder Architektur identisch umgesetzt werden. Referenz: [Azure Well-Architected Framework](https://learn.microsoft.com/azure/well-architected/what-is-well-architected-framework).

## Knowledge-Audit-System

| Code | Kategorie | Standardaktion |
|---|---|---|
| A | Sicheres Duplikat | priorisiertes Review, kein automatischer Merge |
| B | Wahrscheinliches Duplikat | fachlichen Kontext prüfen |
| C | Legacy / persönliche Erinnerung | niemals ungeprüft löschen |
| D | falsche/fragwürdige Hierarchie | Class-C-Proposal |
| E | veraltet | Quelle und Produktstatus prüfen |
| F | zu granular / Fragment | Kontext und einzigartigen Inhalt prüfen |
| G | fehlender wichtiger Knoten | additives Class-B-Proposal |
| H | unklar / Human Context Required | immer Human Review; keine automatische Änderung |

Confidence dient nur der Priorisierung:

- High – starke, überprüfbare Evidenz
- Medium – plausibel, aber teilweise unklar
- Low – schwache Indikatoren oder fehlender Kontext

Keine Confidence-Stufe löst selbst Löschen, Merge oder Umleitung aus.

## Finding-Lebenszyklus

```text
detected → awaiting_review → approved | rejected | deferred
                              ↓
                           resolved
                              ↓
                  optional promoted_to_rule
```

Ein Finding enthält ID, Kategorie, betroffene Knoten, Begründung, Evidenz, Confidence, vorgeschlagene Aktion und Human Decision. `promoted_to_rule` benötigt Human Approval.

## Safe Delete/Merge

Vor Delete oder Merge werden Kinder, Parent, Knowledge Relations, Scenario-, Learning- und Practice-Referenzen, persönliche Notizen, Quellen, Aliase und Legacy Content geprüft. Archivierung wird gegenüber Löschung bevorzugt. Ein Merge benötigt ein dauerhaftes `old_node_id → canonical_node_id`-Mapping.

## Browser-QA

Die Nachweisstufen bleiben getrennt:

- `static/regression PASS`
- `executed browser PASS`
- `browser execution pending`

V2.3 hat keinen ausgeführten Browser-PASS. Die UI ist gegenüber V2.2 bytegleich und statisch regressionsgeprüft; der echte Browserlauf bleibt als Exception offen.

