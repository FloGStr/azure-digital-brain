# Azure Digital Brain V2.4 – Rule Candidates

> V2.4 ist ausschließlich ein nicht-destruktiver Audit. Kein Finding ist eine Änderungsfreigabe. Knoten, IDs, Hierarchie, Relationen, Quellen, Szenarien und Lernpfade bleiben unverändert.

Keine Regel ist aktiviert. Jede Kandidatenregel erkennt und priorisiert höchstens; sie verändert niemals Daten.


## RC-001 – Exact product title with distinct IDs

- Scope: Detection only
- Logik: Normalize product titles, exclude generic labels, then require same-concept evidence and fieldwise comparison.
- Getestet gegen: 1058 canonical nodes
- Ergebnis/Grenzen: Useful for Storage tool/redundancy duplicates; generic labels create false positives and must be excluded.
- Aktivierung: not_active_requires_human_approval


## RC-002 – Deprecated service source check

- Scope: Detection only
- Logik: Flag only when a current official Microsoft source explicitly states retirement/end-of-sale or renaming.
- Getestet gegen: Blueprints, Data Lake Analytics, Lab Services, B2C, Defender for Identity
- Ergebnis/Grenzen: High precision with official source; requires review of exact wording and date.
- Aktivierung: not_active_requires_human_approval


## RC-003 – Structural field-label node

- Scope: Detection only
- Logik: Flag exact generic titles such as Beschreibung or Merksatz only when they add no independent content and are used as hierarchy containers.
- Getestet gegen: Generic label groups in 1058 nodes
- Ergebnis/Grenzen: Useful but must preserve child content and original learning order.
- Aktivierung: not_active_requires_human_approval


## RC-004 – Canonical gap despite text mention

- Scope: Proposal only
- Logik: A text mention does not count as a navigable canonical node; require architectural significance plus official source.
- Getestet gegen: Known V2.4 gap checklist
- Ergebnis/Grenzen: Identified 12 candidates; every creation remains Class B and requires explicit approval.
- Aktivierung: not_active_requires_human_approval


## Promotion-Prozess

Detection Rule → mehrfach bestätigte Findings → Rule Proposal → Human Approval → aktive Quality Rule. Auch eine aktive Regel bleibt nicht-destruktiv.
