# Wie Monitoring die bisherigen Architekturperspektiven ergänzt

Stand: 11. August 2026  
Vergleich: Networking V1.2, Identity V1.3, Compute V1.4, Governance V1.5, Storage V1.6, Security V1.7 und Monitoring V1.8

## Kernaussage

Die bisherigen Piloten beantworten, wie eine Azure-Architektur aufgebaut, verbunden, autorisiert, kontrolliert, gespeichert und geschützt wird. V1.8 ergänzt die Rückkopplung: **Funktioniert die Architektur unter realer Last, bei Änderungen und im Fehlerfall wie geplant?**

Monitoring liefert Signale, Observability verbindet diese Signale zu Erklärungen, Operations setzt die Erkenntnisse in Stabilisierung und Verbesserung um. Damit wird das Digital Brain von einer statischen Architekturkarte zu einem Lifecycle-Modell.

## Vergleich der Domänen

| Version | Domäne | angereicherte Knoten | neue Erklärungstexte | neue Beziehungen | neue offizielle Quellen |
|---|---|---:|---:|---:|---:|
| V1.2 | Networking | 33 | 99 | 29 | 27* |
| V1.3 | Identity | 36 | 108 | 35 | 21 |
| V1.4 | Compute | 38 | 114 | 34 | 24 |
| V1.5 | Governance | 27 | 81 | 34 | 22 |
| V1.6 | Storage | 24 | 72 | 26 | 22 |
| V1.7 | Security | 25 | 75 | 34 | 19 |
| V1.8 | Monitoring & Operations | 31 | 93 | 24 | 19 |

\* V1.2 erhöhte die Quellenbasis von einer migrierten Ursprungsquelle auf insgesamt 28 Quellen.

| Perspektive | Leitfrage | Monitoring-Ergänzung | besonders wertvolle Signale |
|---|---|---|---|
| Networking V1.2 | Wie erreicht ein Workload Ressourcen? | Sind Pfad, Latenz, Erreichbarkeit und Health der Endpunkte wie entworfen? | Connectivity, Flow Logs, DNS, Probe-Status, Latenz |
| Identity V1.3 | Wer darf was? | Funktionieren Anmeldung und Autorisierung, und gibt es riskante oder fehlerhafte Zugriffsmuster? | Sign-ins, Audit Logs, Auth-Fehler, Rollenänderungen |
| Compute V1.4 | Wo und in welchem Betriebsmodell läuft die Anwendung? | Reichen Kapazität und Skalierung, sind Instanzen gesund, und zeigt die Anwendung gute Nutzerqualität? | CPU, Memory, Requests, Queue, Restart, App-Traces |
| Governance V1.5 | Wie werden Ressourcen kontrolliert und standardisiert? | Sind Policies konform, Änderungen nachvollziehbar, Ressourcen inventarisiert und Kosten im Ziel? | Compliance State, Activity Log, Advisor, Cost Trends |
| Storage V1.6 | Wie werden Daten gespeichert, geschützt und repliziert? | Sind Latenz, Fehler, Kapazität, Replikation und Recovery-Signale innerhalb der Ziele? | Transactions, Availability, Latency, Capacity, Replication |
| Security V1.7 | Wie schützen wir Identitäten, Netzwerke, Workloads und Daten? | Welche Findings, Alerts und Anomalien zeigen Schwächen oder Angriffe, und wie reagieren wir? | Defender Findings, Security Alerts, Audit und Compliance |
| Monitoring V1.8 | Wie erkennen, messen, analysieren und betreiben wir zuverlässig? | verbindet alle Signale mit Health-Modell, Incident Response, SLO und Verbesserung | Metrics, Logs, Traces, Events, Health und Changes |

## Networking ↔ Monitoring

Networking definiert erlaubte Pfade, Routing, Segmentierung und private Erreichbarkeit. Monitoring prüft, ob diese Pfade tatsächlich funktionieren und ob Latenz, Paketverlust, Health Probes oder DNS den Benutzerfluss beeinträchtigen.

Der Architekturmehrwert entsteht durch die Trennung:

- eine erlaubte NSG-Regel beweist keine funktionierende Verbindung,
- ein erreichbarer Endpunkt beweist keine akzeptable Anwendungsantwort,
- eine grüne Probe beweist nicht die Gesundheit aller Abhängigkeiten,
- ein Netzwerkfehler kann in Application Insights als Dependency-Fehler sichtbar werden.

## Identity ↔ Monitoring

Identity entwirft Authentication, Authorization, Least Privilege und privilegierten Zugriff. Monitoring macht daraus einen betreibbaren Regelkreis: fehlgeschlagene Anmeldungen, riskante Sign-ins, Rollenänderungen und Autorisierungsfehler werden erkannt, korreliert und untersucht.

Detection ersetzt Prevention nicht. MFA, Conditional Access, PIM und RBAC reduzieren Risiko; Logs, Alerts und Security Findings zeigen Fehlkonfiguration, Missbrauch oder unerwartetes Verhalten. Operations benötigt für beides unterschiedliche Owner und Runbooks.

## Compute ↔ Monitoring

Compute entscheidet zwischen VM, PaaS und Containerplattform sowie über Skalierung und Verfügbarkeit. Monitoring zeigt, ob diese Entscheidung in der Realität trägt:

- vertikale Grenzen werden über Sättigung und Throttling sichtbar,
- horizontale Skalierung benötigt Last- und Queue-Signale,
- VMSS-Reparatur benötigt Health-Signale,
- App Service und AKS benötigen zusätzlich Anwendungstelemetrie,
- Plattformmetriken allein zeigen keinen fehlerhaften Geschäftsfluss.

Die wichtigste Brücke ist **Application Insights → Log Analytics → Alert → Runbook**.

## Storage ↔ Monitoring

Storage-Architektur entscheidet über Zugriff, Redundanz, Tiering, Schutz und Recovery. Monitoring beobachtet die wirksamen Eigenschaften: Verfügbarkeit, Latenz, Transaktionsfehler, Kapazität, Drosselung und Recovery-Signale.

Ein repliziertes Storage-Design kann verfügbar sein und trotzdem falsche oder gelöschte Daten enthalten. Deshalb müssen Betriebsdaten, Data-Protection-Signale und Restore-Tests zusammen betrachtet werden. Logs und Metrics beantworten unterschiedliche Teile dieser Frage.

## Governance ↔ Monitoring

Governance setzt Standards über Management Groups, Policy, RBAC, Tags und Kostensteuerung. Operations misst, ob diese Standards wirken:

- Azure Policy zeigt Compliance State,
- Activity Logs zeigen Steuerungsebenenänderungen,
- Advisor liefert proaktive Optimierungsempfehlungen,
- Cost Management liefert Kosten- und Nutzungstrends,
- Monitor-Baselines können über Policy geprüft oder bereitgestellt werden.

Governance ohne Monitoring kennt die tatsächliche Abweichung nicht; Monitoring ohne Governance erkennt Abweichung, kann aber keine verbindliche Baseline erklären.

## Security ↔ Monitoring

Security kombiniert präventive, detektive und wiederherstellende Controls. V1.8 schärft besonders:

- **Prevention:** Identity, Segmentierung, Verschlüsselung, Policy und Härtung.
- **Detection:** Defender Findings, Logs, Anomalien und Alerts.
- **Response:** Triage, Incident, Containment und Kommunikation.
- **Recovery:** Backup, Failover, Restore und Validierung.

Defender for Cloud und Azure Monitor teilen Daten- und Integrationspfade, erfüllen aber unterschiedliche Aufgaben. Ein Security Finding ist kein allgemeiner Availability-Alert; ein Performance-Alert ist kein bestätigter Security Incident. Korrelation schafft Kontext, ohne diese Bedeutungen zu vermischen.

## Größter Architekturmehrwert der V1.8-Beziehungen

1. **Azure Monitor monitors Workloads:** verbindet Compute, Netzwerk und Storage mit einer gemeinsamen Signaleebene.
2. **Application Insights logs_to Log Analytics:** verbindet Code und verteilte Abhängigkeiten mit zentraler Analyse.
3. **Log Analytics triggers Alerts:** übersetzt Beobachtung in handlungsfähige Detection.
4. **Monitor supports Fault Tolerance and DR:** verbindet Health mit automatisierter oder menschlich freigegebener Recovery.
5. **Policy governs Monitor:** macht Telemetrieerfassung zu einer prüfbaren Plattformbaseline.
6. **Defender integrates_with Monitor:** bringt Security Findings in den operativen Zusammenhang.
7. **SLA/SLO depends_on Monitoring:** verbindet Vertrags- und Architekturziele mit realen Indicators.

## Lifecycle

| Phase | Beitrag des Digital Brain | Rückkopplung aus V1.8 |
|---|---|---|
| Plan | Ziele, Risiken, SLO, Verantwortungsmodell | messbare Indicators und Beobachtungsfenster definieren |
| Build | Netzwerk, Identity, Compute, Storage | Instrumentierung und Diagnostic Settings mitbauen |
| Secure | präventive und detektive Controls | Findings, Alerts und Compliance-Signale korrelieren |
| Monitor | Metrics, Logs, Traces, Events, Health | Zustand und Abweichung sichtbar machen |
| Operate | Triage, Incident, Failover, Recovery | Owner, Runbook, Kommunikation und Validierung |
| Improve | Advisor, Reviews, Lessons Learned | Architektur, Baselines und Automatisierung anpassen |

## Fazit

V1.8 ergänzt keine siebte isolierte Produktdomäne. Monitoring wird als Querschnitt modelliert, der jede frühere Architekturentscheidung messbar macht. Dadurch kann das Digital Brain nicht nur erklären, **wie Azure aufgebaut ist**, sondern auch, **wie Teams erkennen, ob das Design funktioniert, warum es scheitert und was als Nächstes verbessert werden muss**.
