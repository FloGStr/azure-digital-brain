# Azure Digital Brain – Quality Gates

**Verbindlich ab:** V2.3  
**Anwendung:** risikobasiert nach Change-Klasse; Gate 6 gilt für jeden Release.

## 1. Gate-Regeln

Jedes anwendbare Gate benötigt:

- Scope und Ausgangsversion,
- konkrete Checks und erwartete Werte,
- nachvollziehbaren Nachweis,
- Status `PASS`, `PASS WITH EXCEPTIONS`, `BLOCKED` oder `FAIL`,
- bei Exceptions: Ursache, Risiko, betroffener Bereich, Entscheidung, Owner und Follow-up.

Ein nicht ausgeführter Check erhält `pending`, `not executed` oder `not applicable`, niemals `PASS`.

## 2. Gate 1 – Data Integrity

**Ziel:** Identität, Referenzen und Struktur schützen.

Pflichtchecks bei Datenänderungen:

- IDs eindeutig und erwartete Anzahl plausibel,
- bestehende IDs gemäß Scope unverändert,
- Eltern-/Kindreferenzen gegenseitig konsistent,
- keine Zyklen oder verwaisten Knoten,
- Relations-IDs eindeutig; Source, Target, Typ und Gegenrichtung gültig,
- Scenario-, Learning-, Practice- und Runtime-Referenzen auflösbar,
- Quellen-IDs eindeutig und referenzierbar,
- geschützte Vorgängerdaten per Hash oder strukturellem Vergleich geprüft,
- persönliche Benutzerdaten nicht in Canonical Data geschrieben.

**PASS:** keine ungültige oder ungeklärte Referenz.  
**Blocker:** fehlende IDs, defekte Hierarchie oder unbekannter Datenverlust.

## 3. Gate 2 – Knowledge Quality

**Ziel:** fachliche Qualität erkennen, ohne unsichere Findings direkt in Änderungen zu verwandeln.

Prüfkategorien:

- mögliche oder wahrscheinliche Duplikate,
- widersprüchliche Inhalte,
- veraltete Begriffe und Produktnamen,
- fragmentierte Inhalte und übermäßig kleine Knoten,
- unklare Titel,
- fragwürdige Hierarchiepositionen,
- fachlich ähnliche Knoten,
- möglicherweise fehlende wichtige eigenständige Begriffe.

Findings werden nach Abschnitt 8 klassifiziert. Ein Finding allein erlaubt weder Merge noch Delete.

**PASS:** keine High-Confidence-Auffälligkeit im Change-Scope ohne Review.  
**PASS WITH EXCEPTIONS:** bekannte Auffälligkeiten sind dokumentiert und bewusst zurückgestellt.  
**Blocker:** fachlicher Widerspruch mit hohem Risiko oder ungeklärter Inhaltsverlust.

## 4. Gate 3 – Architecture Quality

**Ziel:** Architekturänderungen und Szenarien entlang der fünf Azure-Well-Architected-Perspektiven bewerten.

| Perspektive | Leitfragen |
|---|---|
| Reliability | Sind Verfügbarkeit, Resilienz, Recovery und Fehlerannahmen nachvollziehbar? |
| Security | Sind Identitäten, Daten, Netzwerkpfade, Least Privilege und Schutzgrenzen berücksichtigt? |
| Cost Optimization | Sind Kostentreiber, Skalierung, Nutzung und Trade-offs sichtbar? |
| Operational Excellence | Sind Observability, sichere Änderungen, Verantwortung, Runbooks und Verbesserung berücksichtigt? |
| Performance Efficiency | Passen Kapazität, Skalierungsmodell, Latenz und Performance-Tests zum Bedarf? |

Zusätzlich prüfen:

- Architekturentscheidungen benennen Alternativen und Trade-offs,
- Komponenten und Beziehungen referenzieren vorhandene kanonische Einträge,
- keine Architektur wird als universell „beste“ Lösung dargestellt,
- Betriebsverantwortung und Grenzen sind erkennbar.

**PASS:** alle relevanten Perspektiven geprüft; nicht relevante Perspektiven begründet als `not applicable` markiert.

## 5. Gate 4 – Source Quality

**Ziel:** Aussagen nachvollziehbar und aktuell halten.

Checks:

- offizielle Microsoft-Quellen bevorzugt,
- Quelle passt konkret zur Aussage,
- URL syntaktisch gültig und erreichbar, sofern Netzwerkprüfung möglich,
- Aktualität und Produktbezeichnung geprüft,
- fehlende Quellen als Finding dokumentiert,
- keine Suchergebnis-URL als Quelle,
- tote oder umgeleitete Links dokumentiert; nicht stillschweigend entfernt.

**PASS:** alle neuen oder geänderten fachlichen Aussagen haben angemessene Quellen.  
**Browser/Netzwerk nicht verfügbar:** Linkprüfung als `execution pending`, nicht als `PASS`.

## 6. Gate 5 – UX / Runtime

**Ziel:** lokale Nutzbarkeit und Regressionen schützen.

Je nach Scope prüfen:

- Mindmap: Anzeige, Pan/Zoom, Einzelzweige, `Alles aufklappen`, `Alles zuklappen`, Suche,
- Brain: Fokus, Pan/Zoom, Kanten und Detailnavigation,
- Architecture: Auswahl, Diagramm, Komponentenlinks und Perspektiven,
- Lernen: Pfade, Schritte, Fortschritt und Kontextlinks,
- bestehende Knotendetailansicht,
- Profilimport/-export, Notizen und lokale Lernstände,
- `START.html` und relative Offline-Ressourcen,
- zentrale Release Runtime,
- responsive Darstellung,
- Safari und Chrome.

Browserstatus werden getrennt ausgewiesen:

- `static/regression PASS` – Syntax, DOM, Referenzen und statische Kompatibilität geprüft,
- `executed browser PASS` – Browser tatsächlich gestartet und Interaktionen ausgeführt,
- `browser execution pending` – echter Lauf nicht möglich oder noch offen.

Ein `executed browser PASS` darf nur bei nachweislich ausgeführtem Lauf verwendet werden.

## 7. Gate 6 – Release Integrity

**Ziel:** eine vollständige, reproduzierbare und direkt nutzbare Version ausliefern.

Pflichtchecks:

- vollständiges Vorgänger-Backup vorhanden und bytegleich geprüft,
- anwendbare Builds erfolgreich,
- QA-Report mit ehrlichem Gesamtstatus vorhanden,
- zentrale Release-Metadaten stimmen mit Datenzählwerten überein,
- ZIP enthält Projekt, Backup und Reports,
- ZIP-Integrität vollständig getestet,
- SHA-256 des final unveränderten ZIPs erstellt und geprüft,
- aktueller Projektordner und aktuelle `START.html` vorhanden,
- direkte Links und absolute Pfade werden ausgegeben,
- keine unnötige Kopie oder erneute Entpackung im Hand-off.

**PASS:** alle Pflichtchecks erfolgreich.  
**PASS WITH EXCEPTIONS:** ausschließlich dokumentierte, akzeptierte nichtkritische Abweichungen.  
**BLOCKED/FAIL:** fehlendes Backup, fehlerhaftes ZIP, falsche Prüfsumme oder ungeklärte geschützte Datenabweichung.

## 8. Knowledge-Audit-Kategorien

Ein späterer Knowledge Audit darf Findings erkennen und kategorisieren, aber noch keine Bereinigung durchführen.

| Code | Kategorie | Bedeutung | Automatische Änderung |
|---|---|---|---|
| A | Sicheres Duplikat | sehr hohe Wahrscheinlichkeit desselben Konzepts | nein |
| B | Wahrscheinliches Duplikat | ähnlich, aber nicht eindeutig | nein |
| C | Legacy / persönliche Erinnerung | Eselsbrücke, Prüfungsnotiz, Reminder oder persönliche Kurznotiz | niemals ungeprüft |
| D | Falsche/fragwürdige Hierarchie | Position scheint fachlich ungeeignet | nein; Class C |
| E | Veraltet | Begriff, Dienst, Feature oder Aussage könnte veraltet sein | nein |
| F | Zu granular / Fragment | möglicherweise kein sinnvoller eigener Fachknoten | nein |
| G | Fehlender wichtiger Knoten | relevanter eigenständiger Begriff könnte fehlen | Proposal; Class B |
| H | Unklar / Human Context Required | ursprüngliche Bedeutung nicht sicher erkennbar | niemals automatisch ändern oder löschen |

Kategorie H erfordert immer Human Review. Kategorie A ist trotz hoher Sicherheit kein Delete- oder Merge-Auftrag.

## 9. Confidence-System

- **High Confidence:** starke, überprüfbare Evidenz; sehr wahrscheinlich korrekt.
- **Medium Confidence:** plausible Auffälligkeit, aber fachlicher oder struktureller Kontext fehlt teilweise.
- **Low Confidence:** schwache Indikatoren oder unklarer ursprünglicher Kontext.

Confidence priorisiert Review. Confidence allein darf nie Löschen, Merge, Umleitung oder andere destruktive Aktionen auslösen.

## 10. Finding-Datenvertrag

Jedes Finding besitzt mindestens:

```json
{
  "finding_id": "QF-YYYY-NNNN",
  "category": "A|B|C|D|E|F|G|H",
  "affected_nodes": [],
  "reasoning": "",
  "evidence": [],
  "confidence": "high|medium|low",
  "proposed_action": "",
  "status": "detected",
  "human_decision": null,
  "decision_date": null,
  "decision_owner": null,
  "resulting_rule": null
}
```

Zulässige Status:

- `detected`
- `awaiting_review`
- `approved`
- `rejected`
- `deferred`
- `resolved`
- `promoted_to_rule`

Nur Human Review darf `approved`, `rejected` oder `promoted_to_rule` setzen. `resolved` erfordert einen verlinkten Change- oder Decision-Nachweis.

## 11. Rule Promotion

Wiederkehrende bestätigte Findings folgen:

`Detection Rule → mehrfach bestätigt → Rule Proposal → Human Approval → Active Quality Rule`

Eine aktive Quality Rule darf zunächst nur erkennen, klassifizieren, priorisieren und eine Aktion vorschlagen. Sie darf niemals selbst destruktiv ändern. Details stehen in `CHANGE-POLICY.md`.

