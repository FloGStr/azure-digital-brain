# Azure Digital Brain – Change Policy

**Verbindlich ab:** V2.3

## 1. Zweck

Diese Policy bestimmt, welche Änderungen automatisiert, reviewpflichtig oder ausschließlich nach ausdrücklicher Human-Freigabe durchgeführt werden dürfen.

## 2. Klassifikation vor Umsetzung

Jeder Change erhält vor `BUILD`:

- Change-ID und Titel,
- Ausgangsversion und Zielversion,
- Scope und ausdrücklich ausgeschlossene Bereiche,
- Klasse A, B, C oder D,
- betroffene Dateien, IDs und Referenzarten,
- Backup-, Validierungs- und Rollbackplan,
- notwendige Reviewer.

Enthält ein Change mehrere Wirkungen, gilt die höchste Klasse.

## 3. Class A – Safe / Presentation Change

Beispiele: UI-Text, Layout, Expand/Collapse, Navigation, reine Darstellung.

Regeln:

- keine Canonical- oder User-Daten fachlich verändern,
- bestehende Modi und lokale Startfähigkeit regressionsprüfen,
- nach Gate 5 und Gate 6 weitgehend automatisiert freigabefähig,
- unerwartete Daten- oder Schemawirkung hebt den Change auf Class B/C an.

## 4. Class B – Additive Change

Beispiele: neue Runtime Layer, Szenarien, Lernpfade, Beziehungen oder Quellen.

Regeln:

- vollständiges Backup vor Änderung,
- neue IDs kollisionsfrei und Referenzen gültig,
- Schema- und Builder-Unterstützung vorhanden,
- fachliche Quellen und Architecture Gate anwenden,
- keine bestehende Information überschreiben,
- Release- und Change-Dokumentation erforderlich.

Neue fachliche Inhalte können innerhalb eines explizit freigegebenen Scopes umgesetzt werden. Neue Relationstypen, Schemas oder weitreichende Regeln benötigen Human Review.

## 5. Class C – Structural Change

Beispiele: Knoten verschieben, Hierarchie verändern, IDs zusammenführen, Relationsziele umleiten, fachlich bedeutsam umbenennen.

Regeln:

- immer Proposal und Impact Analysis,
- alle Parent-/Child-, Relations-, Scenario-, Learning-, Practice-, Source-, Alias-, Legacy- und User-Verweise prüfen,
- Migrations- und Rückfallpfad dokumentieren,
- Human Review vor Build und vor Release,
- keine stillschweigende ID-Wiederverwendung.

## 6. Class D – Destructive Change

Beispiele: Knoten, Inhalte, Relationen oder Quellen löschen; Originale nach Merge entfernen.

Verbindlicher Ablauf:

`Proposal → Human Review → explizite Freigabe → vollständiges Backup → kontrollierte Änderung → Validierung → zweite Release-Freigabe`

Class D wird niemals automatisch ausgeführt. Ohne ausdrückliche, konkrete Freigabe bleibt der Change `BLOCKED` oder das Finding `awaiting_review`/`deferred`.

## 7. Safe Delete Policy

Vor jeder späteren Löschung eines Knotens müssen geprüft und dokumentiert werden:

- Kinder und Elternreferenz,
- Knowledge Relations in beide Richtungen,
- Scenario References,
- Learning References,
- persönliche Notizen und Lernstatus,
- Practice References,
- Quellen,
- Aliase,
- Legacy Content und ursprünglicher Mindmap-Kontext.

Pflichtbedingungen:

- eindeutiger Human-Owner und explizite Freigabe,
- keine ungelöste Referenz,
- keine einzigartige Information ohne Archiv/Migration,
- Backup und Wiederherstellungsplan,
- Decision-Log-Eintrag mit betroffenen IDs.

Confidence, Kategorie A oder eine aktive Detection Rule reichen nie als Löschfreigabe.

## 8. Safe Merge Policy

Bei einem späteren Merge:

1. Zielknoten und fachliche Begründung festlegen.
2. Inhalte feldweise vergleichen; einzigartige Inhalte übernehmen oder archivieren.
3. alle Referenzarten und persönlichen Daten migrieren oder bewusst erhalten.
4. Alias- und Legacy-Kontext bewahren.
5. dauerhaftes Mapping erstellen:

```text
old_node_id → canonical_node_id
```

Das Mapping dokumentiert:

- Merge-Grund und Human-Entscheidung,
- übernommene Inhalte,
- archivierte oder bewusst nicht übernommene Informationen,
- umgeleitete Referenzen,
- Zeitpunkt und Release.

Die Original-ID darf nicht stillschweigend verschwinden oder später für ein anderes Konzept wiederverwendet werden.

## 9. Archivierung vor Löschung

Bevorzugter Lebenszyklus:

`Active → Deprecated / Legacy → Archive → optional später Delete`

Archivierung ist Standard, wenn historische, persönliche oder kontextuelle Information möglich ist. Archivierte Inhalte bleiben auffindbar, begründet und referenziell nachvollziehbar. Ein späterer Delete ist ein neuer Class-D-Change.

## 10. Human Context und persönliche Daten

- Kategorie C und H werden nie ungeprüft gelöscht oder zusammengeführt.
- Persönliche Notizen bleiben außerhalb von `data/canonical/`.
- Eine Migration persönlicher Daten muss verlustfrei, lokal und rückwärtskompatibel sein.
- Ist ein Browserprofil nicht automatisiert inventarisierbar, wird die Löschung/der Merge blockiert oder eine sichere Alias-/Mapping-Strategie gewählt.

## 11. Quality Rule Promotion

Eine Detection Rule kann vorgeschlagen werden, wenn mehrere gleichartige Findings durch Menschen konsistent entschieden wurden.

Ein Rule Proposal enthält:

- Rule-ID und Name, zum Beispiel `legacy_exam_note_detection`,
- Trainings-/Beispielmenge bestätigter Findings,
- Erkennungslogik und Scope,
- erwartete False Positives/Negatives,
- Confidence-Berechnung,
- Tests und Rücknahmeplan,
- ausdrücklich erlaubte Aktionen.

Nach Human Approval erhält die Regel den Status `active`. Erlaubt sind ausschließlich:

- erkennen,
- klassifizieren,
- priorisieren,
- Aktion vorschlagen.

Nicht erlaubt sind automatische Löschung, Merge, Umleitung, Inhaltsänderung oder Archivierung. Eine solche Wirkung wäre ein separater Class-C-/Class-D-Change.

## 12. Scope Drift und Stop-Regel

Während Build oder Validate wird gestoppt und Human Review angefordert, wenn:

- sich die Change-Klasse erhöht,
- unerwartete geschützte Dateien abweichen,
- Datenverlust oder Referenzbruch möglich ist,
- eine Governance-Regel dem Auftrag widerspricht,
- eine benötigte menschliche Bedeutung nicht aus den Daten hervorgeht.

Der Zustand wird nicht durch improvisierte Zusatzänderungen „repariert“.

## 13. Exceptions

Eine Policy-Ausnahme benötigt:

- betroffene Regel und Scope,
- Ursache und Alternativen,
- Risiko und zeitliche Gültigkeit,
- Human-Entscheidung und Owner,
- Follow-up oder Ablaufbedingung,
- Eintrag im `DECISION-LOG.md`.

