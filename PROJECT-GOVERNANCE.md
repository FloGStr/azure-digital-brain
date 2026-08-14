# Azure Digital Brain – Project Governance & Quality Operating Model

**Verbindlich ab:** V2.3  
**Geltungsbereich:** alle zukünftigen Analyse-, Daten-, Runtime-, UI-, Dokumentations- und Release-Schritte  
**Owner:** Human Project Owner

## 1. Verbindliche Startregel

Vor jeder zukünftigen Änderung am Azure Digital Brain muss Work zuerst die aktuelle `PROJECT-GOVERNANCE.md` vollständig lesen und die darin referenzierten Regeln berücksichtigen.

Steht ein Auftrag im Konflikt mit diesen Regeln, gilt:

1. Konflikt und betroffene Regel benennen.
2. Risiko und mögliche Optionen dokumentieren.
3. Keine riskante, strukturelle oder destruktive Änderung stillschweigend durchführen.
4. Die notwendige Human-Review-Entscheidung abwarten.

Ein neuer Auftrag kann Governance-Regeln nur durch eine ausdrückliche, dokumentierte Human-Entscheidung ändern oder für einen klar abgegrenzten Fall außer Kraft setzen.

## 2. Zweck und Leitprinzipien

Das Operating Model hält Änderungen reproduzierbar, sicher, nachvollziehbar und schrittweise automatisierbar. Es ist bewusst leichtgewichtig und orientiert sich an:

- dem iterativen, wiederkehrenden Vorgehen des Microsoft Cloud Adoption Framework,
- den fünf Qualitätsdimensionen des Azure Well-Architected Framework,
- Continual Improvement und überprüfbaren Service-Management-Prinzipien,
- einem begrenzten Arbeitsfluss nach Kanban-Prinzipien,
- Human-in-the-loop bei Unsicherheit, strukturellen und destruktiven Eingriffen,
- Quality Gates sowie nachvollziehbarem Change- und Decision-Management.

Projektgrundsätze:

- **Canonical first:** `data/canonical/` bleibt die fachliche Source of Truth.
- **Additive before destructive:** Ergänzen oder archivieren ist sicherer als überschreiben oder löschen.
- **Evidence before confidence:** Behauptungen benötigen prüfbare Daten, Quellen oder Testergebnisse.
- **No silent loss:** Eindeutige Inhalte, persönliche Notizen, Legacy-Kontext und Referenzen dürfen nicht stillschweigend verloren gehen.
- **One controlled release:** Jede freigegebene Version besitzt Backup, QA, Berichte, ZIP, Prüfsumme und direkte lokale Zugriffe.
- **Honest status:** Ein nicht ausgeführter Test ist niemals `PASS`.

## 3. Rollen und Verantwortung

| Rolle | Verantwortung |
|---|---|
| Human Project Owner | Scope, Risikoakzeptanz, Class-C-/Class-D-Freigaben, Governance-Ausnahmen, finale fachliche Entscheidung |
| Work / Implementer | Governance lesen, Change klassifizieren, Backup und Umsetzung durchführen, Gates belegen, Konflikte melden |
| Quality Reviewer | Prüfergebnisse, Referenzen, Regressionen und Exceptions bewerten; kann dieselbe technische Instanz sein, aber Nachweise müssen getrennt dokumentiert sein |
| Domain Reviewer | fachliche Azure- und Architekturentscheidungen bei Class B/C/D oder unsicheren Findings bestätigen |

Bei einem Ein-Personen-Projekt darf eine Person mehrere Rollen übernehmen. Die Entscheidung und ihre Begründung müssen trotzdem nachvollziehbar bleiben.

## 4. Verbindlicher Lebenszyklus

```text
DISCOVER → DESIGN → BUILD → VALIDATE → HUMAN REVIEW → RELEASE → GOVERN → IMPROVE
```

### DISCOVER

- **Ziel:** Auftrag, Ist-Zustand, Risiken, Abhängigkeiten und Governance-Konflikte verstehen.
- **Aktivitäten:** Governance lesen; aktuelle Version und Arbeitsordner bestimmen; Change-Klasse wählen; betroffene Daten/UI/Reports inventarisieren; offene Annahmen benennen.
- **Inputs:** Nutzerauftrag, aktuelle Release-Metadaten, Governance, vorhandene QA und Datenverträge.
- **Outputs:** abgegrenzter Scope, Change-Klasse, Impact Map, erste Akzeptanzkriterien.
- **Quality Gate:** Scope und Klassifikation sind eindeutig; Konflikte sind sichtbar.
- **Automatisch zulässig:** read-only Inventar, Hashes, Referenzzählung, statische Analyse.
- **Human Review:** unklarer Scope, widersprüchliche Regeln, Class C/D oder bedeutende fachliche Unsicherheit.

### DESIGN

- **Ziel:** kleinstmögliche sichere Änderung und passende Prüfmethode festlegen.
- **Aktivitäten:** Datenfluss, Migration, UI-Auswirkung, Rollback/Archivierung, Gates und Ausnahmen entwerfen; Trade-offs nach WAF betrachten.
- **Inputs:** Discover-Ergebnis, Datenmodelle, bestehende Builder und Tests.
- **Outputs:** Implementierungsplan, Referenz- und Testplan, Review-Punkte.
- **Quality Gate:** Design schützt Source of Truth, IDs, Referenzen und persönliche Daten; keine verdeckte Scope-Erweiterung.
- **Automatisch zulässig:** Entwurf für Class A und klar additive Class B.
- **Human Review:** jedes Class-C-/Class-D-Design sowie neue fachliche Regeln, Relationstypen oder Schemawechsel.

### BUILD

- **Ziel:** genehmigten Scope minimal und reproduzierbar umsetzen.
- **Aktivitäten:** vollständiges Backup nach Change-Klasse; additive oder freigegebene Änderung; Builder/Runtime aktualisieren; Änderungsnachweis führen.
- **Inputs:** genehmigtes Design und Ausgangsversion.
- **Outputs:** Arbeitsversion, Build-Artefakte, Change-Liste.
- **Quality Gate:** nur genehmigte Dateien/Datensätze geändert; Build reproduzierbar.
- **Automatisch zulässig:** Class A; Class B innerhalb ausdrücklich freigegebenen Scopes.
- **Human Review:** Abweichung vom Design, unbekannte Datenverluste, Class C/D.

### VALIDATE

- **Ziel:** Integrität, Qualität, Regression und Release-Fähigkeit evidenzbasiert prüfen.
- **Aktivitäten:** anwendbare Gates aus `QUALITY-GATES.md`; Referenz- und Hashvergleich; isolierte Builds; Browser-/Runtime-Status korrekt erfassen.
- **Inputs:** Arbeitsversion, Backup, Akzeptanzkriterien.
- **Outputs:** maschinenlesbare und lesbare QA, Findings, Exceptions.
- **Quality Gate:** alle Pflichtgates `PASS` oder dokumentierte, akzeptierbare Exceptions.
- **Automatisch zulässig:** nichtdestruktive Prüfungen, Klassifizierung und Vorschläge.
- **Human Review:** Medium/Low Confidence mit Änderungsfolge, Gate-Ausnahme, fachliche Widersprüche.

### HUMAN REVIEW

- **Ziel:** Entscheidungen treffen, die Kontext, Risikoakzeptanz oder irreversible Wirkung besitzen.
- **Aktivitäten:** Diff, Findings, Exceptions und Trade-offs prüfen; approve/reject/defer; Entscheidung protokollieren.
- **Inputs:** Validierungsnachweise und Proposal.
- **Outputs:** Freigabe, Ablehnung, Zurückstellung oder Änderungsauftrag; ggf. Decision-Log-Eintrag.
- **Quality Gate:** erforderliche Entscheidung ist explizit und einem Scope zugeordnet.
- **Automatisch zulässig:** Vorbereitung und Zusammenfassung der Entscheidungsgrundlage.
- **Human Review:** zwingend für Class C, Class D, Governance-Ausnahmen, neue aktive Quality Rules und ungelöste High-Risk-Exceptions.

### RELEASE

- **Ziel:** eine identifizierbare, vollständige und prüfbare Version ausliefern.
- **Aktivitäten:** Release-Version zentral aktualisieren; Reports finalisieren; QA-Status setzen; ZIP einmalig erzeugen und testen; SHA-256 erstellen; Direktlinks liefern.
- **Inputs:** freigegebene Arbeitsversion.
- **Outputs:** Projektordner, `START.html`, ZIP, SHA-256, Reports und vollständiges Vorgänger-Backup.
- **Quality Gate:** Gate 6 sowie Definition of Done erfüllt.
- **Automatisch zulässig:** Packaging und Hashing nach erfolgreicher Freigabe.
- **Human Review:** Release mit Exceptions oder abweichendem Scope.

### GOVERN

- **Ziel:** Regeln, Entscheidungen, Findings und Ausnahmen nachvollziehbar halten.
- **Aktivitäten:** Decision Log aktualisieren; offene Findings/Follow-ups festhalten; Regelwirkung beobachten; Referenzstand benennen.
- **Inputs:** Release-Nachweise und Review-Entscheidungen.
- **Outputs:** aktueller Governance-Stand, Decision Log, offene Backlog-Punkte.
- **Quality Gate:** keine wesentliche Entscheidung oder Exception ohne Verantwortlichkeit und Follow-up.
- **Automatisch zulässig:** Statusaggregation und unveränderliche Nachweiserfassung.
- **Human Review:** Rule Promotion, Policy-Änderung oder Risikoakzeptanz.

### IMPROVE

- **Ziel:** wiederkehrende Probleme und Reviews in bessere Checks und Arbeitsweisen übersetzen.
- **Aktivitäten:** Quality Scan; Muster in Findings/Entscheidungen auswerten; Regelvorschläge erstellen; unnötige Prozesslast entfernen.
- **Inputs:** mehrere Releases, Findings, Entscheidungen und Betriebserfahrung.
- **Outputs:** priorisierte Verbesserungsvorschläge, Rule Proposals, ggf. Governance-Änderung.
- **Quality Gate:** Verbesserung ist evidenzbasiert und verändert nichts destruktiv ohne neuen Lebenszyklus.
- **Automatisch zulässig:** erkennen, klassifizieren, priorisieren, vorschlagen.
- **Human Review:** Aktivierung einer Regel oder jede Änderung mit Class-C-/Class-D-Wirkung.

## 5. Arbeitsfluss und WIP

Der schlanke Statusfluss lautet:

`Backlog → Discovering → Designed → Building → Validating → Awaiting Human Review → Ready for Release → Released → Follow-up`

- Pro Release bleibt möglichst nur ein fachlicher Change-Scope gleichzeitig in `Building`.
- Findings sind keine Änderungen. Sie gelangen zuerst in Review.
- Blocker und Exceptions werden sichtbar gemacht, nicht durch Scope-Ausweitung verborgen.
- Ein Release darf Governance-Follow-ups besitzen, solange diese als akzeptierte Exceptions dokumentiert sind.

## 6. Change-Klassen und Genehmigung

| Klasse | Bedeutung | Beispiele | Mindestanforderung | Automatisierung |
|---|---|---|---|---|
| A | Safe / Presentation | UI-Text, Layout, Expand/Collapse, Navigation, Darstellung | relevante Regression, Gate 5/6 | nach QA weitgehend automatisch |
| B | Additive | neue Runtime Layer, Szenarien, Lernpfade, Beziehungen, Quellen | Backup, Schema-/Referenzprüfung, fachliche Validierung, Release-Dokumentation | innerhalb freigegebenem Scope möglich |
| C | Structural | Knoten verschieben, Hierarchie/IDs/Relationenziele fachlich ändern | Proposal, Impact Analysis, Human Review, Migration/Rollback | nie ohne explizite Freigabe |
| D | Destructive | Knoten/Inhalte/Relationen/Quellen löschen oder Originale nach Merge entfernen | Proposal → Human Review → explizite Freigabe → kontrollierte Änderung | nie automatisch |

Bei mehreren Wirkungen gilt die höchste Klasse. Details stehen in `CHANGE-POLICY.md`.

## 7. Quality Gates, Status und Exceptions

`QUALITY-GATES.md` definiert sechs wiederverwendbare Gates. Zulässige Gesamtstatus:

- `PASS`
- `PASS WITH EXCEPTIONS`
- `BLOCKED`
- `FAIL`

Eine Exception enthält mindestens Ursache, Risiko, betroffenen Bereich, Entscheidung, Owner und Follow-up. Ein ausstehender Browserlauf ist kein Browser-`PASS`.

## 8. Definition of Done

Ein Release ist erst fertig, wenn:

- fachlicher Scope und Akzeptanzkriterien erfüllt sind,
- Governance gelesen und eingehalten wurde,
- Change-Klasse und geänderte Dateien dokumentiert sind,
- anwendbare Quality Gates bestanden oder Exceptions genehmigt sind,
- vollständiges Vorgänger-Backup vorhanden und geprüft ist,
- Datenintegrität und relevante Regressionen geprüft sind,
- zentrale Release-Version aktualisiert ist,
- Reports und QA vorhanden sind,
- ZIP vollständig geprüft und SHA-256 erstellt ist,
- der aktuelle Projektordner und seine aktuelle `START.html` vorhanden sind,
- die direkte Übergabe nach Abschnitt 9 erfolgt ist.

## 9. Verbindlicher Release-Hand-off

Nach jedem Release stellt Work direkt bereit:

1. anklickbaren Link auf den bestehenden aktuellen Projektordner,
2. anklickbaren Link auf die `START.html` in genau diesem Ordner,
3. absoluten lokalen Pfad zum Projektordner,
4. absoluten lokalen Pfad zur `START.html`,
5. ZIP-Datei,
6. SHA-256-Prüfdatei,
7. Reports.

Dabei wird das Projekt nicht erneut kopiert, das ZIP nicht erneut entpackt und `START.html` nicht aus dem Projektordner herausgelöst.

## 10. Continual Improvement

Nach mehreren Releases oder bei erkennbaren Qualitätsmustern wird ein schlanker Zyklus durchgeführt:

`Quality Scan → Findings → Priorisierung → Human Review → freigegebene Changes → Rule Learning`

Es wird kein fester Kalender und keine externe Automation eingeführt. Der nächste geplante Schritt ist ein separater, nichtdestruktiver Knowledge Base Audit nach diesen Regeln.

## 11. Normative Projektdokumente

- `PROJECT-GOVERNANCE.md` – Operating Model und verbindlicher Workflow
- `QUALITY-GATES.md` – Gates, Findings, Confidence und QA-Status
- `CHANGE-POLICY.md` – Change-Klassen, Safe Delete/Merge, Archivierung und Rule Promotion
- `DECISION-LOG.md` – wesentliche menschliche Entscheidungen

Bei Widerspruch gilt: explizite Human-Entscheidung > `PROJECT-GOVERNANCE.md` > `CHANGE-POLICY.md` > `QUALITY-GATES.md` > ältere Reports. Der Konflikt muss im `DECISION-LOG.md` dokumentiert werden.

## 12. Referenzrahmen

- Microsoft Cloud Adoption Framework: https://learn.microsoft.com/azure/cloud-adoption-framework/overview
- Azure Well-Architected Framework: https://learn.microsoft.com/azure/well-architected/what-is-well-architected-framework
- Azure Well-Architected pillars: https://learn.microsoft.com/azure/well-architected/pillars

Diese externen Frameworks sind Orientierung, keine zusätzliche Produktdatenquelle der kanonischen Knowledge Base.
