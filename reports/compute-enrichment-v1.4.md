# Azure Digital Brain V1.4 – Compute & Architecture Enrichment Pilot

Stand: 11. August 2026  
Redaktionsgrundlage: Content Standard V1.0  
Leitidee: **Compute als Architektur-Brücke modellieren**

## Ergebnis

Der dritte kontrollierte Pilot reichert 38 vorhandene Compute- und compute-nahe Architekturknoten an. IDs, Reihenfolge, Hierarchie, Datenmodell, Runtime-Buildprozess, Oberfläche und sämtliche historischen Inhalte bleiben erhalten. Die neue Wissensebene verbindet Compute gezielt mit Networking, Identity, Security, Monitoring, Storage und Business Continuity.

| Kennzahl | V1.3 | V1.4 |
|---|---:|---:|
| Knoten gesamt | 1.058 | 1.058 |
| Hierarchieebenen | 10 | 10 |
| Networking-Pilotknoten | 33 | 33 unverändert |
| Identity-Pilotknoten | 36 | 36 unverändert |
| neue Compute-Pilotknoten | – | 38 |
| neue Compute-Erklärungstexte | – | 114 |
| Compute-Praxisbeispiele | – | 38 |
| Compute-Merksätze | – | 38 |
| bewusst eingesetzte Analogien | – | 0 |
| Beziehungen gesamt | 91 | 125 |
| neue Compute-Beziehungen | – | 34 |
| Relationstypen gesamt | 30 | 34 |
| neue Relationstypen | – | 4 |
| Quellen gesamt | 49 | 73 |
| neue offizielle Quellen | – | 24 |
| neue oder entfernte Knoten | 0 | 0 |

## Scope und bewusst gesetzte Grenzen

Die vorhandene V1.3-Struktur enthält belastbare Knoten für Azure Virtual Machines, VM-Größen/SKUs, Managed Disks, VM Scale Sets, Availability Sets, Availability Zones, Azure App Service, App Service Plan, Web-Workloads, Deployment Slots, Azure Container Instances und Azure Kubernetes Service.

Zwei im Auftrag genannte Konzepte liegen in V1.3 nicht als eigenständige Wissensknoten vor:

- **Azure Container Apps:** kein kanonischer Knoten vorhanden; deshalb weder neu angelegt noch in einen fremden Knoten umgedeutet. Der Dienst wird nur dort als Entscheidungsalternative erwähnt, wo die Architektur-Ebene vorhandener Container-Auswahlknoten dies verlangt.
- **Azure Web Apps als eigener Produktknoten:** vorhanden ist der fachlich passende Use-Case-Knoten `azure-0376` für Websites, Web APIs und REST-Dienste auf App Service. Dieser wurde ohne Änderung seiner Hierarchie als „Web Apps und APIs auf App Service“ normalisiert.

Damit bleiben die harten Grenzen eingehalten: keine neuen Knoten, keine neuen IDs, keine Hierarchieänderung und keine versteckte Scope-Erweiterung.

## Angereicherte Knoten

### Skalierung, Verfügbarkeit und Servicemodell

| ID | normalisierter Titel |
|---|---|
| `azure-0005` | Availability Set |
| `azure-0007` | Availability Zones |
| `azure-0015` | Vertikale Skalierung (Scale up / down) |
| `azure-0020` | Horizontale Skalierung (Scale out / in) |
| `azure-0025` | Azure Autoscale |
| `azure-0034` | Compute-SKU und VM-Größe |
| `azure-0116` | Azure Backup für VMs |
| `azure-0118` | Azure Site Recovery für VM-Disaster-Recovery |
| `azure-0198` | Infrastructure as a Service (IaaS) |

### Virtual Machines und Betrieb

| ID | normalisierter Titel |
|---|---|
| `azure-0322` | Azure Virtual Machines |
| `azure-0324` | Lift-and-Shift mit Azure VMs |
| `azure-0329` | Kundenverantwortung bei Azure VMs |
| `azure-0567` | Azure Managed Disks |
| `azure-0568` | Managed-Disk-Typen und VM-Anbindung |
| `azure-0831` | Compute Security Responsibility |
| `azure-0832` | VM Security Operations |

### Application Platform

| ID | normalisierter Titel |
|---|---|
| `azure-0351` | Azure App Service |
| `azure-0354` | Azure-Verantwortung in App Service |
| `azure-0357` | App-Service-Patching und Updates |
| `azure-0358` | App-Service-Sicherheit und Plattformmonitoring |
| `azure-0362` | Kundenverantwortung in App Service |
| `azure-0363` | App Service Plan |
| `azure-0369` | App Service Autoscale |
| `azure-0370` | App Service Monitoring und Logging |
| `azure-0371` | Deployment Slots, TLS und Custom Domains |
| `azure-0376` | Web Apps und APIs auf App Service |

### VM Scale Sets

| ID | normalisierter Titel |
|---|---|
| `azure-0387` | Azure Virtual Machine Scale Sets |
| `azure-0395` | VMSS-Instanzmodell und Orchestrierung |
| `azure-0399` | Automatische VMSS-Instanzreparatur |
| `azure-0400` | VMSS Autoscale |

### Container und Kubernetes

| ID | normalisierter Titel |
|---|---|
| `azure-0412` | Azure-Containerdienste |
| `azure-0413` | Container-Modell |
| `azure-0415` | Azure Container Instances (ACI) |
| `azure-0425` | Azure Kubernetes Service (AKS) |
| `azure-0427` | Verwaltete Kubernetes-Orchestrierung |
| `azure-0428` | AKS Skalierung, Load Balancing und Upgrades |
| `azure-0429` | AKS Worker Nodes auf virtuellen Maschinen |
| `azure-0430` | AKS für produktive Microservice-Plattformen |

Vorherige Titel bleiben als Aliase sowie unverändert unter `legacy.original` erhalten. Satzförmige historische Knoten wurden fachlich präzisiert, aber weder verschoben noch zusammengeführt.

## Architekturentscheidungen

### IaaS vs. PaaS vs. Containerplattform

| Entscheidung | Geeignet, wenn … | Azure übernimmt | Kunde verantwortet besonders | Haupt-Trade-off |
|---|---|---|---|---|
| **Virtual Machine** | OS-Kontrolle, Appliances, Lift-and-Shift oder nicht unterstützte Laufzeiten nötig sind | Rechenzentrum, Host, Virtualisierung | Gast-OS, Patches, Runtime, Hardening, Backup, Monitoring und Anwendung | höchste Kontrolle, größte Betriebsfläche |
| **App Service** | standardisierte Websites und HTTP-APIs auf unterstützten Stacks laufen | zusätzlich Gast-OS, Plattform-Stack und Plattformpatching | Anwendung, Daten, Konfiguration, Identität, Netzwerk- und Telemetrieeinstellungen | geringer Betrieb, weniger OS-Freiheit |
| **ACI** | einzelne oder kurzlebige Containergruppen ohne vollständige Orchestrierung genügen | Containerhost und Scheduling der Gruppe | Image, Workload, Daten, Netzwerk und fehlende Plattformfunktionen | sehr einfach, begrenzte Orchestrierung |
| **AKS** | Kubernetes-API, komplexe Orchestrierung oder eine gemeinsame Containerplattform benötigt wird | Control Plane; in Automatic zusätzlich mehr Node- und Plattformbetrieb | Workloads, Policies, Identität, Netzwerk, Daten und je nach Modus Node-/Upgradebetrieb | maximale Kubernetes-Flexibilität, hohe Plattformkomplexität |

Azure Container Apps wäre in dieser Entscheidungsmatrix eine wichtige verwaltete Microservice-Alternative zwischen ACI/App Service und AKS. Aufgrund der unveränderlichen V1.3-Hierarchie bleibt dies eine dokumentierte Inhaltslücke.

### Skalierung

- **Vertikal:** verändert die Leistung einer Instanz oder eines Plans; einfach, aber endlich und ohne zusätzliche Redundanz.
- **Horizontal:** verändert die Anzahl der Instanzen; unterstützt Elastizität und Verfügbarkeit, verlangt verteilungsfähige oder zustandsarme Anwendungen.
- **VM Scale Sets:** verbinden horizontale VM-Skalierung mit gemeinsamem Instanzmodell, Health, Reparatur und Zonenverteilung.
- **Autoscale:** automatisiert Kapazität anhand von Metriken oder Zeitplänen; Schwellen, Aufwärmzeit, Cooldown, Quota und Scale-in-Sicherheit bleiben Architekturverantwortung.

### Verfügbarkeit

- **Availability Set:** trennt Fault und Update Domains innerhalb eines Rechenzentrums; schützt nicht vor dessen vollständigem Ausfall.
- **Availability Zone:** trennt physische Rechenzentren innerhalb einer Region; verlangt eine tatsächlich redundante, zonenfähige Anwendung.
- **Region:** ist die Grenze für regionale Störungen; regionsübergreifende Disaster-Recovery- oder aktive Mehrregionsstrategien sind zusätzliche Entscheidungen.

### Betrieb und Security Responsibility

- VM-Patching bleibt Kundenverantwortung; Plattformdienste wie Update Manager helfen bei Standardisierung und Nachweis.
- Azure Backup schützt Wiederherstellbarkeit, Availability-Mechanismen schützen laufende Erreichbarkeit, Site Recovery orchestriert Disaster Recovery. Diese Ziele sind nicht austauschbar.
- Azure Monitor liefert Host- und konfigurierte Gasttelemetrie; Log Analytics stellt den zentralen Analysekontext bereit.
- Defender for Cloud/Defender for Servers ergänzt Posture Management, Schwachstellen- und Bedrohungserkennung.
- Managed Identity vermeidet langlebige Workload-Secrets; Azure RBAC steuert Managementzugriff; beide erfüllen unterschiedliche Aufgaben.

## Neue semantische Architektur-Brücken

### Compute ↔ Networking

- Azure Virtual Machines `deployed_in` Virtual Network
- Azure Load Balancer `routes_to` Azure Virtual Machines
- Azure Virtual Machines `secured_by` Network Security Group
- vorhandene Beziehung AKS `uses` Virtual Network mit gleicher ID präzisiert
- vorhandene Beziehung Application Gateway `routes_to` App Service mit gleicher ID präzisiert
- vorhandene Beziehung VM Scale Sets `depends_on` Load Balancer mit gleicher ID präzisiert

### Compute ↔ Identity und Governance

- Azure Virtual Machines `uses` Managed Identity
- Azure RBAC `governs` Azure Virtual Machines
- Azure App Service `uses` Managed Identity
- Azure RBAC `governs` Azure App Service
- Azure Kubernetes Service `uses` Managed Identity
- Azure RBAC `governs` Azure Kubernetes Service

### Compute ↔ Security

- Network Security Group `secures` Azure Virtual Machines über die kanonische Gegenrichtung `secured_by`
- Defender for Cloud `monitors` Azure Virtual Machines
- Compute Security Responsibility `secures` Azure Virtual Machines

### Compute ↔ Monitoring

- Azure Monitor `monitors` Azure Virtual Machines
- Azure Virtual Machines `logs_to` Log Analytics Workspace
- Azure Monitor `monitors` Azure App Service
- Azure App Service `logs_to` Log Analytics Workspace
- Azure Kubernetes Service `logs_to` Log Analytics Workspace
- vorhandene Beziehung AKS `monitored_by` Azure Monitor mit gleicher ID präzisiert

### Compute-interne und betriebliche Beziehungen

- VM `uses` Managed Disks, Azure Backup, Site Recovery, Availability Set und Availability Zones
- VM Scale Sets `contains` Virtual Machines und `uses` Availability Zones sowie Autoscale
- Autoscale `uses` horizontale Skalierung; vertikale Skalierung `alternative_to` horizontale Skalierung
- App Service `uses` App Service Plan; Web Apps/APIs und Deployment Slots `part_of` App Service
- App Service Autoscale `uses` Azure Autoscale
- ACI `alternative_to` AKS; beide `part_of` Azure-Containerdienste
- AKS Worker Nodes `part_of` AKS

Jede neue Beziehung besitzt Typ, registrierte Gegenrichtung, konkrete Erklärung, mindestens eine offizielle Quelle, Confidence zwischen 0,97 und 0,99 sowie Status `accepted`.

## Erweiterung der Relation Registry

Das bestehende Register konnte Bereitstellungskontext und Telemetriefluss nicht präzise genug ausdrücken. Ergänzt wurden genau zwei reziproke Typenpaare:

| Typ | Gegenrichtung | Zweck |
|---|---|---|
| `deployed_in` | `hosts` | Compute-Ressource liegt in einem Infrastruktur- oder Plattformkontext |
| `logs_to` | `receives_logs_from` | Quelle sendet Logs oder Telemetrie an einen Analysekontext |

Die Registry-Erweiterung nutzt das vorhandene Datenmodell und erfordert keine Runtime- oder UI-Änderung.

## Quellenbasis

Alle 24 neuen Quellen stammen aus Microsoft Learn und wurden am 11. August 2026 geprüft. Abgedeckt sind:

- Azure Virtual Machines, VM-Größen und Managed Disks
- Availability Sets und Availability Zones
- Virtual Machine Scale Sets, Autoscale und automatische Reparatur
- Azure App Service, App Service Plans, Plattformpatching und Deployment Slots
- Azure Container Instances und Container Groups
- Azure Kubernetes Service, Verantwortungsmodell und Monitoring
- offizieller Vergleich der Azure-Containeroptionen einschließlich Container Apps
- Azure Monitor für VMs, AKS und Log Analytics
- Defender for Servers und Just-in-Time VM Access
- Azure VM Backup und Azure Site Recovery
- VM-Gastupdates und Hostwartung

Zeitabhängige Produkt- und Betriebsinformationen wurden aus den aktuellen Microsoft-Learn-Seiten übernommen. Preise oder variable Produktlimits wurden bewusst nicht in die Lerninhalte festgeschrieben.

## Vergleich der drei Piloten

| Dimension | Networking V1.2 | Identity V1.3 | Compute V1.4 |
|---|---:|---:|---:|
| angereicherte Knoten | 33 | 36 | 38 |
| neue Erklärungstexte | 99 | 108 | 114 |
| neue Beziehungen | 29 | 35 | 34 |
| Schwerpunkt | Netzwerkfluss und Grenzen | Identität, Token und Autorisierung | Entscheidungen und Domänenbrücken |
| stärkster Architekturwert | Pfad, Filter, Routing und private Erreichbarkeit | Wer darf was in welchem Scope? | Wer betreibt was, wo läuft es und wie wird es geschützt/überwacht? |

### Beziehungen mit dem größten Architekturmehrwert

1. **Compute ↔ Identity:** Managed Identity plus RBAC trennt Workload-Authentifizierung von Managementautorisierung und verhindert die pauschale Aussage „Identity ist eingerichtet“.
2. **Compute ↔ Networking:** `deployed_in`, `routes_to` und `secured_by` machen den tatsächlichen Erreichbarkeitspfad sichtbar.
3. **Compute ↔ Monitoring/Security:** `monitors` und `logs_to` verbinden Ressourcenbetrieb mit Signalquelle und Analyseziel.
4. **Compute ↔ Availability/BCDR:** Availability, Backup und Site Recovery zeigen drei unterschiedliche Schutzziele statt einer unscharfen „hochverfügbar“-Linie.

### Konzepte mit besonderem Gewinn aus der Architecture-Ebene

- **Virtual Machines:** Erst die Betriebs- und Verantwortungsfläche erklärt, wann IaaS sinnvoll oder nur bequem erscheint.
- **App Service:** Der Wert liegt primär in der verschobenen Verantwortung, nicht in einer Liste integrierter Funktionen.
- **AKS:** Der Unterschied zwischen verwalteter Control Plane und produktionsreifer Plattform verhindert die typische „managed = kein Betrieb“-Fehlannahme.
- **VM Scale Sets:** Instanzmodell, Health, Scale-in und Zustandsfreiheit sind wichtiger als die reine Aussage „skaliert automatisch“.
- **Availability Sets/Zones:** Die konkrete Fehlergrenze wird zur Designentscheidung statt zu zwei ähnlich klingenden Prüfungsbegriffen.

### Für Cloud Architects entscheidende Abgrenzungen

- VM vs. VM Scale Set: Einzelinstanzkontrolle gegen reproduzierbare, skalierbare Flotte.
- Availability Set vs. Availability Zone: Rack-/Wartungsdomänen gegen getrennte Rechenzentren.
- vertikal vs. horizontal: größere Einzelinstanz gegen verteilte Kapazität und Redundanz.
- Backup vs. Availability vs. Site Recovery: Wiederherstellbarkeit gegen laufende Erreichbarkeit gegen orchestrierten Standortwiederanlauf.
- App Service vs. VM: Plattformabstraktion gegen Betriebssystemkontrolle.
- ACI vs. AKS: einfache Containergruppe gegen vollständige Kubernetes-Orchestrierung.
- Management Plane RBAC vs. Gast-/Workloadzugriff: Ressourcenverwaltung gegen Anmeldung und Autorisierung innerhalb der Workload.

### Empfohlene nächste Domäne

**Governance & Management** sollte als nächster Pilot folgen. Nach Networking, Identity und Compute kann diese Domäne Azure Policy, Management Groups, Resource Groups, Tags, Cost Management und Defender-for-Cloud-Governance als übergreifende Steuerungsschicht verbinden. Sie liefert besonders hohen Mehrwert, weil sie vorhandene Architekturentscheidungen nicht nur beschreibt, sondern als Plattformstandard, Scope und Kontrollnachweis organisierbar macht.

## Qualitätssicherung

### Automatisierte Integrität

- 1.058 eindeutige Knoten-IDs; ID-Reihenfolge gegenüber V1.3 exakt unverändert
- Eltern-/Kindbeziehungen und weiterhin zehn Hierarchieebenen exakt unverändert
- 38 Pilotknoten mit vollständigen drei Erklärungsebenen
- alle Simple-Erklärungen mit zwei bis vier vollständigen Sätzen
- jeder Pilotknoten mit `why_important`, Praxisbeispiel, Merksatz und offizieller Quelle
- keine erzwungenen Analogien
- 125 eindeutige Beziehungen; keine doppelte Kombination aus Quelle, Typ und Ziel
- alle Beziehungen mit registriertem Typ, reziproker Gegenrichtung, Erklärung, Quelle, Confidence und Status
- 34 gültige Relationstypen und 73 auflösbare Quellenreferenzen
- Runtime-Build erfolgreich: 1.058 Knoten, 125 Beziehungen, 34 Relationstypen, 73 Quellen, Tiefe 10

### Schutz der Vorversion und des Scopes

- vollständiges V1.3-Backup unter `backups/version-1.3/`
- kanonische V1.3-Knoten, Relationen und Quellen im Backup unverändert
- App-Dateien `app/app.js`, `app/index.html`, `app/styles.css` und `START.html` bytegenau identisch zu V1.3
- Buildskript `tools/build-runtime.mjs` bytegenau identisch zu V1.3
- keine Datenmodell- oder Schemaänderung
- keine Änderungen an Networking- oder Identity-Erklärungsinhalten
- acht domänenübergreifende Zielknoten erhielten ausschließlich die technisch erforderlichen Relations-ID-Referenzen; Titel, Erklärungen und Metadaten blieben unverändert
- vier vorhandene Compute-Brücken wurden unter ihren bestehenden Relations-IDs nur fachlich präzisiert

## Offene Punkte

1. Azure Container Apps benötigt für eine vollständige ACI-vs.-Container-Apps-vs.-AKS-Abgrenzung einen eigenen Knoten. Eine Ergänzung erfordert explizite Freigabe in einer separaten Hierarchiephase.
2. Die V1.3-Hierarchie verteilt Skalierungs-, BCDR- und Security-Responsibility-Konzepte über mehrere Hauptbereiche. Semantische Beziehungen gleichen dies im Brain-Modus aus; die Hierarchie wurde bewusst nicht „bereinigt“.
3. Einige historische Satzknoten tragen weiterhin sehr spezifische Elternkontexte. Die Normalisierung verbessert Auffindbarkeit, ohne ihre historische Position zu ändern.

## Reproduzierbarkeit

Die redaktionelle Transformation ist in `tools/enrich-compute-v1.4.mjs` idempotent dokumentiert. `data/canonical/` bleibt die einzige fachliche Source of Truth. `tools/build-runtime.mjs` validiert die kanonischen Dateien und erzeugt ausschließlich die lokale Browserprojektion unter `data/runtime/`.
