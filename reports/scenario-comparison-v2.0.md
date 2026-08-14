# Azure Digital Brain V2.0 – Szenariovergleich

## Vergleichsmatrix

| Szenario | primäres Ziel | zentrale Entscheidung | dominante Risiken | typisches Operating Model |
|---|---|---|---|---|
| Secure Web Application | sicherer öffentlicher Webpfad | Front Door/App Gateway und PaaS/VM/AKS | öffentliche Angriffsfläche, DNS, Secrets, fehlende App-Telemetrie | Plattform + App + SecOps |
| Enterprise Hub-Spoke | zentrale Konnektivität bei Workload-Isolation | customer-managed Hub oder Virtual WAN | Routing, IP-Überlappung, zentraler Blast Radius, Logkosten | zentrales Netzwerkteam + Workloadteams |
| Hybrid Cloud | konsistenter Betrieb über zwei Umgebungen | VPN/ExpressRoute, Hybrid Identity, temporär/dauerhaft | lokale Abhängigkeiten, DNS, Provider, Parallelbetrieb | Netzwerk + Identity + Operations + Migration Factory |
| Highly Available Application | SLO, RPO und RTO erfüllen | Zonen/Multi-Region, Active/Active/Passive/Restore | falsche Health-Signale, Datenkonsistenz, ungetesteter Failback | Business Owner + SRE + Plattform/App |
| Cloud Migration | kontrolliert verstehen, bewegen und optimieren | Rehost/Replatform/Refactor und Wave-Schnitt | fehlende Dependencies, unvorbereitete Landing Zone, Cutover | Migration Factory + Plattform + Workload + Governance |

## Gemeinsame Architekturprinzipien

Alle fünf Szenarien teilen sechs Muster:

1. **Identity vor Secret:** Managed Identity, Entra ID, RBAC und Least Privilege.
2. **Explizite Netzwerkpfade:** Segmentierung, Routing, DNS und Private Access gemeinsam planen.
3. **Governance als Plattformfähigkeit:** Management Groups und Policy vor Workloadwachstum oder Migration.
4. **Observability mit Geschäftsbezug:** Metrics, Logs und Traces an kritischen Flows und SLOs ausrichten.
5. **Reliability als getesteter Prozess:** Redundanz, Capacity, Backup, Failover und Restore unterscheiden.
6. **Geteilte Verantwortung:** Plattformteams liefern Leitplanken, Workloadteams verantworten Anwendung und SLO, Security und Operations arbeiten querschnittlich.

## Wann welches Szenario als Lernpfad dient

- Beginne mit **Secure Web Application**, wenn Komponenten eines konkreten Workloads zusammengesetzt werden sollen.
- Nutze **Hub-Spoke**, wenn mehrere Teams, Subscriptions oder hybride Pfade eine gemeinsame Plattform benötigen.
- Nutze **Hybrid Cloud**, wenn On-Premises-Abhängigkeiten während Migration oder dauerhaft bestehen.
- Nutze **Highly Available Application**, wenn Verfügbarkeits-, RPO- und RTO-Ziele Architektur und Kosten bestimmen.
- Nutze **Cloud Migration**, wenn die Reise vom Ist-Zustand zur Zielplattform strukturiert werden soll.

## Abgrenzungen

### Hub-Spoke versus Secure Web Application

Hub-Spoke ist eine Plattform- und Netzwerktopologie für viele Workloads. Secure Web Application ist eine workloadbezogene Referenzarchitektur. Eine Enterprise-Webanwendung kann in einem Spoke laufen, ohne dass beide Modelle zu einem einzigen Szenario verschmolzen werden müssen.

### Hybrid Cloud versus Cloud Migration

Hybrid Cloud beschreibt einen Betriebszustand über On-Premises und Azure. Cloud Migration beschreibt einen Veränderungsprozess. Hybrid kann ein Zwischenschritt, ein dauerhafter Zielzustand oder eine technische Voraussetzung der Migration sein.

### High Availability versus Secure Web Application

Die Webarchitektur enthält Reliability Controls, doch das HA-Szenario vertieft Fehlerdomänen, SLO, RPO/RTO, Regionsstrategie und Recovery. Die Szenarien teilen Knoten, aber beantworten unterschiedliche Architekturfragen.

## Komponentenüberschneidung

| Komponente/Perspektive | Web | Hub-Spoke | Hybrid | HA | Migration |
|---|:---:|:---:|:---:|:---:|:---:|
| VNet / Routing / DNS | ✓ | ✓ | ✓ | bedingt | ✓ |
| Entra ID / RBAC | ✓ | Governance | ✓ | Recovery-Zugriff | ✓ |
| Firewall / WAF / NSG | ✓ | ✓ | ✓ | bedingt | Baseline |
| Compute-Varianten | ✓ | Workloads | Migrationstarget | ✓ | ✓ |
| SQL / Storage | ✓ | Workloads | Migrationstarget | Datenresilienz | ✓ |
| Azure Monitor | ✓ | ✓ | ✓ | ✓ | ✓ |
| Policy / Governance | ✓ | ✓ | ✓ | Baseline | ✓ |
| Backup / DR | ✓ | Plattform-DR | ✓ | ✓ | Zielnachweis |
| Cost Management / Advisor | Kostenmodell | Plattformkosten | Parallelkosten | Resilienzkosten | ✓ |

## Ergebnis

Die Szenarien bilden keine fünf getrennten Wissensinseln. Sie sind fünf gefilterte Sichten auf dieselben 1.058 Knoten. Dadurch kann ein späterer Architecture Mode vom Szenario zu Komponenten, Beziehungen, Lernpfad und Entscheidung springen, ohne Wissen zu duplizieren.
