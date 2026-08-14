# Azure Digital Brain V1.2 – Networking Enrichment Pilot

Stand: 11. August 2026

## Ergebnis in Kürze

Der Pilot reichert 33 vorhandene Networking-Knoten an, ohne Knoten-IDs, Eltern-/Kindbeziehungen, Ebenen oder die technische Architektur zu verändern. Jeder Pilotknoten besitzt jetzt eine einfache, eine technische und eine Architektur-Erklärung sowie mindestens ein Beispiel und offizielle Microsoft-Quellen. 29 neue semantische Beziehungen ergänzen die 27 vorhandenen Beziehungen.

| Kennzahl | Ergebnis |
|---|---:|
| Knoten gesamt | 1.058 |
| Hierarchieebenen | 10 |
| angereicherte Pilotknoten | 33 |
| neue Erklärungstexte | 99 |
| Beispiele | 34 |
| Merksätze | 33 |
| bewusst ausgewählte Analogien | 16 |
| Beziehungen vorher | 27 |
| neue Networking-Beziehungen | 29 |
| Beziehungen gesamt | 56 |
| Quellen vorher | 11 |
| neue offizielle Quellen | 17 |
| Quellen gesamt | 28 |
| neue Knoten | 0 |
| entfernte Knoten oder Inhalte | 0 |

## Bearbeitete Knoten

### Netzwerkgrundlagen und Hybridverbindungen

| ID | Titel |
|---|---|
| azure-0442 | Virtual Network (VNet) |
| azure-0453 | Subnet |
| azure-0461 | Virtual Network Gateway |
| azure-0462 | VPN Gateway |
| azure-0467 | Point-to-Site VPN (P2S) |
| azure-0468 | Site-to-Site VPN (S2S) |
| azure-0473 | GatewaySubnet |
| azure-0478 | ExpressRoute |
| azure-0493 | ExpressRoute Gateway (ER Gateway) |
| azure-0871 | Route Table / User-Defined Routes (UDR) |
| azure-0887 | Virtual Network Peering |

### Traffic Management und DNS

| ID | Titel |
|---|---|
| azure-0505 | Load Balancer |
| azure-0510 | Load Balancer Health Probes |
| azure-0519 | Application Gateway |
| azure-0521 | Layer-7-Routing |
| azure-0523 | Application Gateway WAF-Integration |
| azure-0545 | Azure DNS |
| azure-0548 | DNS-Zonen und DNS-Einträge |
| azure-0558 | Private DNS |
| azure-0560 | Traffic Manager |
| azure-0562 | Front Door |

### Netzwerksicherheit und private Zugriffe

| ID | Titel |
|---|---|
| azure-0841 | Azure Firewall |
| azure-0846 | Azure Firewall NAT Rules |
| azure-0848 | Azure Firewall Network Rules |
| azure-0850 | Azure Firewall Application Rules |
| azure-0852 | Azure DDoS Protection |
| azure-0863 | Web Application Firewall (WAF) |
| azure-0864 | NSG (Network Security Group) |
| azure-0875 | Application Security Group (ASG) |
| azure-0878 | Service Endpoint |
| azure-0881 | Private Endpoint |
| azure-0882 | Azure Private Link |
| azure-0884 | Public Endpoint |

Einige ursprünglich satzförmige Titel wurden fachlich normalisiert. Die stabilen IDs, die originale Information unter `legacy.original` und die Hierarchie bleiben erhalten; die früheren Titel sind zusätzlich als Aliase auffindbar.

## Neue semantische Beziehungen

### Struktur und Routing

- VNet `contains` Subnet
- Subnet `secured_by` NSG
- Subnet `uses` Route Table / UDR
- Load Balancer Health Probes `part_of` Load Balancer
- Layer-7-Routing `part_of` Application Gateway
- DNS-Zonen und DNS-Einträge `part_of` Azure DNS
- Private DNS `part_of` Azure DNS
- Azure Firewall NAT Rules `part_of` Azure Firewall
- Azure Firewall Network Rules `part_of` Azure Firewall
- Azure Firewall Application Rules `part_of` Azure Firewall

### Verbindung

- VPN Gateway `connects_to` VNet
- GatewaySubnet `required_by` VPN Gateway
- Point-to-Site VPN `part_of` VPN Gateway
- Site-to-Site VPN `part_of` VPN Gateway
- ExpressRoute `uses` ExpressRoute Gateway
- ExpressRoute Gateway `connects_to` VNet
- VPN Gateway `alternative_to` ExpressRoute
- Virtual Network Peering `connects_to` VNet

### Sicherheit, DNS und Endpunkte

- Application Gateway `uses` WAF
- Front Door `uses` WAF
- Traffic Manager `uses` Azure DNS
- Azure Firewall `secures` VNet
- UDR `routes_to` Azure Firewall
- Azure DDoS Protection `secures` VNet
- ASG `used_by` NSG
- Service Endpoint `connects_to` Blob Storage
- Private Endpoint `uses` Azure Private Link
- Service Endpoint `alternative_to` Private Endpoint
- Public Endpoint `alternative_to` Private Endpoint

Jede neue Beziehung besitzt Typ, Quell- und Zielknoten, Gegenrichtung aus der bestehenden Relation Registry, eine fachliche Erklärung, mindestens eine offizielle Quelle, Konfidenz sowie Review-Status. Vier vorhandene Networking-Beziehungen (`rel-001`, `rel-008`, `rel-009`, `rel-010`) wurden nicht entfernt oder umgedeutet, aber mit passenderen offiziellen Belegen und präziseren Erklärungen versehen.

## Quellenbasis

Verwendet wurden ausschließlich Microsoft Learn und der Azure Architecture Center. Neu aufgenommen wurden offizielle Dokumentationen zu VNets/Subnetzen, IP Services, NSG/ASG, Routing/UDR, VNet Peering, Service Endpoints, VPN Gateway, ExpressRoute, Load-Balancing-Entscheidungen, Load-Balancer-Komponenten, Traffic Manager, Azure DNS, Private DNS, Azure Firewall, DDoS Protection und WAF. Bereits vorhandene offizielle Quellen zu Application Gateway, Front Door, Private Link und Private Endpoint DNS wurden weiterverwendet.

## Qualitätsprüfung

### Automatisierte Integritätsprüfung

- 1.058 eindeutige Knoten-IDs; Zahl und Reihenfolge gegenüber V1.1 unverändert
- genau ein Wurzelknoten und weiterhin maximal 10 Ebenen
- alle Eltern-/Kindreferenzen wechselseitig und unverändert
- alle 33 Pilotknoten mit nichtleeren `simple`, `technical` und `architecture`-Feldern
- alle Simple-Texte mit 2–4 Sätzen
- alle Pilotknoten mit Beispiel, Begründung und mindestens einer gültigen Quelle
- 56 eindeutige Relations-IDs; keine doppelten semantischen Tripel
- alle neuen Beziehungen mit gültigem Registry-Typ, Gegenrichtung, Erklärung, Quelle und Konfidenz von mindestens 0,96
- alle Quellenreferenzen auf vorhandene Source-IDs aufgelöst
- Runtime-Build erfolgreich; App-JavaScript und beide Build-Werkzeuge syntaktisch gültig
- unveränderte V1.1-Sicherung für kanonische Knoten, Beziehungen und Quellen per Dateivergleich bestätigt

### Inhaltliches Review

- Die drei Ebenen trennen Alltagsverständnis, technische Funktionsweise und Architekturentscheidung konsequent.
- Layer-4- und Layer-7-Dienste werden klar unterschieden.
- Private Endpoint, Private Link, Private DNS und Service Endpoint werden nicht gleichgesetzt.
- NSG, ASG, Azure Firewall, WAF und DDoS Protection erhalten klar abgegrenzte Rollen.
- VPN Gateway und ExpressRoute werden als unterschiedliche, bei Bedarf kombinierbare Hybridpfade erklärt.
- Traffic Manager wird korrekt als DNS-Steuerung ohne Datenpfad-Proxy beschrieben; Front Door als globaler HTTP(S)-Proxy/CDN.
- Aussagen mit zeitabhängigen Produktbezeichnungen wurden gegen die am 11. August 2026 verfügbare Microsoft-Dokumentation geprüft.

## Offene Punkte und bewusst nicht vorgenommene Änderungen

1. **Fehlende eigene Kernknoten:** IP Addressing, Public IP, Private IP, Virtual WAN, NAT Gateway, Network Watcher und Connection Monitor sind im Bestand nicht als geeignete eigenständige Knoten vorhanden. Weil der Pilot keine neuen Knoten erfinden soll, wurden sie nicht ergänzt.
2. **Historische DDoS-Unterknoten:** Die unveränderte Hierarchie enthält noch „Basic“ und „Standard“. Die aktuelle zentrale Erklärung verwendet korrekt infrastrukturellen Standardschutz, DDoS Network Protection und DDoS IP Protection. Die alten Kinder sollten in einer ausdrücklich autorisierten Bereinigungsphase umbenannt oder migriert werden.
3. **WAF-Hierarchie:** Der vorhandene WAF-Knoten liegt historisch unter dem DDoS-Ast. Seine semantischen Beziehungen zu Application Gateway und Front Door sind jetzt korrekt, die Elternposition wurde im Pilot aber nicht verändert.
4. **Private-Link-Hierarchie:** Der vorhandene Private-Link-Knoten liegt unter Private Endpoint. Das semantische Modell erklärt nun korrekt, dass Private Endpoint die Private-Link-Technik verwendet; die Alt-Hierarchie bleibt aus Stabilitätsgründen unangetastet.
5. **Azure-DNS-Altast:** Der ursprüngliche Titel vermischte Azure DNS und Domain Services. Der Pilot normalisiert den Pilotknoten auf Azure DNS; ein historischer Domain-Services-Unterpunkt bleibt bis zu einer späteren Hierarchiebereinigung erhalten.
6. **Visueller Doppelklick-Test:** Die Codex-Browserrichtlinie blockiert lokale `file://`-Navigation. Der Offline-Startcode wurde nicht verändert; Build, Referenzpfade, JavaScript-Syntax und Datenvertrag wurden stattdessen vollständig statisch validiert.

## Bewertung der Pilotfragen

### 1. Ist das Drei-Ebenen-Modell sinnvoll?

Ja. Die Ebenen beantworten drei unterschiedliche Fragen: „Was ist das?“, „Wie funktioniert es?“ und „Welche Designentscheidung folgt daraus?“. Der Mehrwert ist besonders hoch bei Private Endpoint, DNS, Firewall, Routing und den vier Traffic-Management-Diensten. Voraussetzung für eine Ausweitung ist ein einheitlicher Redaktionsstandard wie in diesem Pilot.

### 2. Verbessert der Brain-Modus das Verständnis?

Strukturell ja: Er zeigt Zusammenhänge über getrennte Hierarchieäste hinweg, etwa UDR → Azure Firewall, Application Gateway → WAF oder Private Endpoint → Private DNS. Ob das Bedienerlebnis den Lernerfolg messbar verbessert, sollte als Nächstes mit konkreten Such- und Erklärungsaufgaben getestet werden; aus Datenqualität allein lässt sich keine Nutzungswirkung beweisen.

### 3. Sind semantische Beziehungen hilfreicher als reine Hierarchie?

Ja. `contains`, `uses`, `secured_by`, `routes_to` oder `alternative_to` drücken eine konkrete Aussage aus. Erklärung, Gegenrichtung und Quelle machen die Kante nachvollziehbar und verhindern, dass eine bloße Linie fälschlich als beliebiger Zusammenhang gelesen wird.

### 4. Welche Felder bringen den größten Mehrwert?

1. Relationstyp plus Relationserklärung
2. getrennte technische und Architektur-Erklärung
3. offizielle Quellen
4. konkretes Beispiel
5. einfache Erklärung und `why_important`

Merksätze und Analogien helfen beim Einstieg, sollten aber weiterhin selektiv bleiben. Deshalb besitzen nur 16 der 33 Pilotknoten eine Analogie.

## Empfehlungen

1. Den Pilot mit 5–8 typischen Lernaufgaben testen, zum Beispiel „Warum braucht Private Endpoint DNS?“ oder „Wann Load Balancer statt Application Gateway?“.
2. Vor einer Massenausweitung ein kurzes redaktionelles Template aus den drei Ebenen, Quellenregeln und Relationskriterien festschreiben.
3. Die fünf genannten historischen Hierarchieprobleme in einer separaten, rückverfolgbaren Datenbereinigung behandeln; nicht beiläufig im Content-Pilot.
4. Fehlende Networking-Kernknoten erst nach ausdrücklicher Freigabe als neue kanonische Knoten anlegen.
5. Danach einen zweiten Pilotbereich mit vielen Querverbindungen wählen, vorzugsweise Identity oder Governance, und die Ergebnisse mit Networking vergleichen.

## Reproduzierbarkeit und Sicherung

Die V1.1-Ausgangsversion liegt vollständig unter `backups/version-1.1/`. Die Anreicherung kann mit `node tools/enrich-networking-v1.2.mjs` reproduziert und danach mit `node tools/build-runtime.mjs` validiert werden. Der normale Build liest ausschließlich `data/canonical/` und schreibt ausschließlich nach `data/runtime/`; die Anwendungsarchitektur bleibt V1.1-kompatibel.
