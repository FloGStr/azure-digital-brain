# Azure Digital Brain – Decision Log

Dieses Log dokumentiert wesentliche, langfristig relevante Entscheidungen. Es ersetzt keine vollständigen Release-Reports.

## Eintragsformat

```text
## ADR-YYYY-NNN – Kurztitel
- Datum:
- Version:
- Status: proposed | accepted | rejected | superseded
- Entscheidung:
- Kontext:
- Begründung:
- Auswirkung:
- Betroffene IDs/Dateien:
- Genehmigt durch:
- Folgemaßnahmen:
```

## ADR-2026-001 – Governance Operating Model wird verbindlicher Projektstandard

- **Datum:** 2026-08-13
- **Version:** V2.3
- **Status:** accepted
- **Entscheidung:** Der Lebenszyklus `DISCOVER → DESIGN → BUILD → VALIDATE → HUMAN REVIEW → RELEASE → GOVERN → IMPROVE` und die vier Governance-Kerndokumente werden ab V2.3 verbindlich.
- **Kontext:** Das Projekt besitzt inzwischen mehrere Daten-, Architektur-, Lern- und UI-Layer. Zukünftige Änderungen benötigen einen stabilen, nachvollziehbaren Qualitäts- und Freigaberahmen.
- **Begründung:** Ein schlanker gemeinsamer Standard reduziert stille Scope-Erweiterung, Datenverlust, inkonsistente QA-Aussagen und nicht nachvollziehbare Entscheidungen.
- **Auswirkung:** Work liest vor zukünftigen Änderungen zuerst `PROJECT-GOVERNANCE.md`; Konflikte und erforderliche Human Reviews werden sichtbar gemacht.
- **Betroffene IDs/Dateien:** `PROJECT-GOVERNANCE.md`, `QUALITY-GATES.md`, `CHANGE-POLICY.md`, `DECISION-LOG.md`
- **Genehmigt durch:** Human Project Owner durch V2.3-Auftrag
- **Folgemaßnahmen:** Nächster Knowledge Base Audit arbeitet ausschließlich erkennend und vorschlagend nach diesen Gates.

## ADR-2026-002 – Destruktive Bereinigung bleibt ausschließlich menschlich freigabepflichtig

- **Datum:** 2026-08-13
- **Version:** V2.3
- **Status:** accepted
- **Entscheidung:** Detection Confidence oder Duplikatkategorie darf nie selbst Löschen, Merge oder Referenzumleitung auslösen. Class D bleibt vollständig Human-in-the-loop.
- **Kontext:** Die Wissensbasis enthält Original-Mindmap-, Legacy- und potenziell persönliche Kontexte, deren Bedeutung automatisiert nicht immer sicher erkennbar ist.
- **Begründung:** Reversibilität, Referenzintegrität und Erhalt einzigartiger Informationen haben Vorrang vor automatischer Bereinigung.
- **Auswirkung:** Künftige Audits erzeugen Findings und Proposals. Safe Delete/Merge folgt `CHANGE-POLICY.md`.
- **Betroffene IDs/Dateien:** alle kanonischen Knoten und Referenzarten; keine Datenänderung in V2.3
- **Genehmigt durch:** Human Project Owner durch V2.3-Auftrag
- **Folgemaßnahmen:** Finding-Datenvertrag im Audit verwenden.

## ADR-2026-003 – Browser-QA-Status wird nach tatsächlicher Ausführung getrennt ausgewiesen

- **Datum:** 2026-08-13
- **Version:** V2.3
- **Status:** accepted
- **Entscheidung:** `static/regression PASS`, `executed browser PASS` und `browser execution pending` werden getrennt dokumentiert.
- **Kontext:** In V2.2 waren statische Prüfungen möglich, ein echter Chrome-/Safari-Interaktionstest jedoch nicht vollständig automatisierbar.
- **Begründung:** Ein ehrlicher Teststatus verhindert falsche Freigabesicherheit.
- **Auswirkung:** Ein nicht ausgeführter Browserlauf darf nicht als Browser-PASS erscheinen.
- **Betroffene IDs/Dateien:** `QUALITY-GATES.md`, künftige QA-Reports
- **Genehmigt durch:** Human Project Owner durch V2.3-Auftrag
- **Folgemaßnahmen:** Browserläufe nachholen, sobald Steuerung verfügbar ist, oder als Exception mit Risiko dokumentieren.

## ADR-2026-004 – Archivierung und ID-Mapping haben Vorrang vor stillem Entfernen

- **Datum:** 2026-08-13
- **Version:** V2.3
- **Status:** accepted
- **Entscheidung:** Nicht mehr aktive Inhalte durchlaufen bevorzugt `Active → Deprecated / Legacy → Archive`; bei Merge bleibt ein dauerhaftes `old_node_id → canonical_node_id`-Mapping.
- **Kontext:** Szenarien, Lernpfade, Relationen und persönliche Daten können langfristig auf bestehende IDs verweisen.
- **Begründung:** Historie und Referenzen müssen nachvollziehbar und wiederherstellbar bleiben.
- **Auswirkung:** Löschen ist der letzte und separat freizugebende Schritt.
- **Betroffene IDs/Dateien:** zukünftige Knoten-, Relations- und Migrationsänderungen
- **Genehmigt durch:** Human Project Owner durch V2.3-Auftrag
- **Folgemaßnahmen:** Vor dem ersten freigegebenen Merge ein konkretes Mapping-Format versionieren.

## ADR-2026-005 – V2.4 endet mit einem nicht-destruktiven Review Package

- **Datum:** 2026-08-13
- **Version:** V2.4
- **Status:** accepted
- **Entscheidung:** Der Knowledge Base Audit scannt, klassifiziert und priorisiert Findings, führt aber keine Knoten-, Hierarchie-, Relations-, Quellen-, Szenario- oder Lernänderung durch.
- **Kontext:** 1.058 historisch gewachsene Knoten enthalten wertvolle Fach-, Lern-, Analogie- und persönliche Kontexte. Duplikat- oder Legacy-Signale reichen nicht für eine sichere Bereinigung.
- **Begründung:** Der getrennte Review-Schritt schützt eindeutige IDs, Referenzen und einzigartige Inhalte und macht die nächsten Entscheidungen prüfbar.
- **Auswirkung:** 77 Findings werden als Vorschläge geliefert. Kategorie H bleibt zwingend Human Review; alle Cleanup-Phasen benötigen eigene Freigaben.
- **Betroffene IDs/Dateien:** `data/audit/knowledge-audit-v2.4.json`, V2.4-Reports; keine Wissens-IDs verändert
- **Genehmigt durch:** Human Project Owner durch V2.4-Auftrag
- **Folgemaßnahmen:** Review Package bearbeiten; bestätigte Änderungen nur als neue, klassifizierte Changes planen.
