import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const canonical = path.join(project, 'data/canonical');
const today = '2026-08-11';

const read = name => JSON.parse(fs.readFileSync(path.join(canonical, name), 'utf8'));
const write = (name, value) => fs.writeFileSync(path.join(canonical, name), `${JSON.stringify(value, null, 2)}\n`);

const nodesDocument = read('nodes.json');
const relationsDocument = read('relations.json');
const sourcesDocument = read('sources.json');
const typesDocument = read('relation-types.json');
const nodeById = new Map(nodesDocument.nodes.map(node => [node.id, node]));
const typeById = new Map(typesDocument.relation_types.map(type => [type.id, type]));

const officialSources = [
  { id:'ms-vnet-subnets', title:'Azure virtual networks and subnets', url:'https://learn.microsoft.com/en-us/azure/networking/design-guide/vnets-subnets', publisher:'Microsoft Learn', accessed_at:today, type:'official' },
  { id:'ms-ip-services', title:'What is Azure Virtual Network IP Services?', url:'https://learn.microsoft.com/en-us/azure/virtual-network/ip-services/ip-services-overview', publisher:'Microsoft Learn', accessed_at:today, type:'official' },
  { id:'ms-nsg-asg', title:'Network security groups and application security groups', url:'https://learn.microsoft.com/en-us/azure/networking/design-guide/network-application-security-groups', publisher:'Microsoft Learn', accessed_at:today, type:'official' },
  { id:'ms-route-tables', title:'Azure virtual network traffic routing', url:'https://learn.microsoft.com/en-us/azure/virtual-network/virtual-networks-udr-overview', publisher:'Microsoft Learn', accessed_at:today, type:'official' },
  { id:'ms-vnet-peering', title:'Connect virtual networks with virtual network peering', url:'https://learn.microsoft.com/en-us/azure/virtual-network/tutorial-connect-virtual-networks', publisher:'Microsoft Learn', accessed_at:today, type:'official' },
  { id:'ms-service-endpoints', title:'Azure virtual network service endpoints', url:'https://learn.microsoft.com/en-us/azure/virtual-network/virtual-network-service-endpoints-overview', publisher:'Microsoft Learn', accessed_at:today, type:'official' },
  { id:'ms-vpn-gateway', title:'What is Azure VPN Gateway?', url:'https://learn.microsoft.com/en-us/azure/vpn-gateway/vpn-gateway-about-vpngateways', publisher:'Microsoft Learn', accessed_at:today, type:'official' },
  { id:'ms-vpn-settings', title:'About Azure VPN Gateway configuration settings', url:'https://learn.microsoft.com/en-us/azure/vpn-gateway/vpn-gateway-about-vpn-gateway-settings', publisher:'Microsoft Learn', accessed_at:today, type:'official' },
  { id:'ms-expressroute', title:'What is Azure ExpressRoute?', url:'https://learn.microsoft.com/en-us/azure/expressroute/expressroute-introduction', publisher:'Microsoft Learn', accessed_at:today, type:'official' },
  { id:'ms-load-balancing', title:'Load-balancing options in Azure', url:'https://learn.microsoft.com/en-us/azure/architecture/guide/technology-choices/load-balancing-overview', publisher:'Azure Architecture Center', accessed_at:today, type:'official' },
  { id:'ms-load-balancer-components', title:'Azure Load Balancer components', url:'https://learn.microsoft.com/en-us/azure/load-balancer/components', publisher:'Microsoft Learn', accessed_at:today, type:'official' },
  { id:'ms-traffic-manager', title:'Azure Traffic Manager overview', url:'https://learn.microsoft.com/en-us/azure/traffic-manager/traffic-manager-overview', publisher:'Microsoft Learn', accessed_at:today, type:'official' },
  { id:'ms-dns', title:'Azure DNS overview', url:'https://learn.microsoft.com/en-us/azure/dns/dns-overview', publisher:'Microsoft Learn', accessed_at:today, type:'official' },
  { id:'ms-private-dns-overview', title:'What is Azure Private DNS?', url:'https://learn.microsoft.com/en-us/azure/dns/private-dns-overview', publisher:'Microsoft Learn', accessed_at:today, type:'official' },
  { id:'ms-firewall', title:'Azure Firewall and traffic inspection', url:'https://learn.microsoft.com/en-us/azure/networking/design-guide/azure-firewall', publisher:'Microsoft Learn', accessed_at:today, type:'official' },
  { id:'ms-ddos', title:'What is Azure DDoS Protection?', url:'https://learn.microsoft.com/en-us/azure/ddos-protection/ddos-protection-overview', publisher:'Microsoft Learn', accessed_at:today, type:'official' },
  { id:'ms-waf', title:'What is Azure Web Application Firewall?', url:'https://learn.microsoft.com/en-us/azure/web-application-firewall/overview', publisher:'Microsoft Learn', accessed_at:today, type:'official' }
];

const E = {
  'azure-0442': {
    title:'Virtual Network (VNet)',
    simple:'Ein Virtual Network ist dein eigenes privates Netzwerk in Azure. Darin können Azure-Ressourcen miteinander kommunizieren, ähnlich wie Geräte in einem Firmennetz. Du teilst es in Subnetze auf, um Bereiche voneinander zu trennen.',
    technical:'Ein VNet ist ein regionales, softwaredefiniertes Netzwerk mit einem oder mehreren privaten CIDR-Adressbereichen. Subnetze segmentieren den Adressraum; Systemrouten ermöglichen zunächst interne Kommunikation, während NSGs, benutzerdefinierte Routen, Peering und Gateways den Verkehrsfluss steuern.',
    architecture:'Das VNet bildet eine zentrale Netzwerk- und Segmentierungsgrenze für Azure-Workloads. Adressräume müssen früh geplant und bei Peering oder Hybridanbindung überschneidungsfrei sein. In größeren Umgebungen werden VNets häufig als Hub-and-Spoke-Topologie mit zentraler Firewall, Private Endpoints und DNS-Auflösung kombiniert.',
    why:'VNets sind die Grundlage für private Kommunikation, Segmentierung und Hybridkonnektivität in Azure.',
    examples:['Eine dreistufige Anwendung nutzt getrennte Subnetze für Web-, Anwendungs- und Datenbankkomponenten.','Ein Hub-VNet stellt zentrale Firewall- und VPN-Dienste bereit; Spoke-VNets enthalten die Workloads.'],
    merksatz:'VNet = dein privates Netzwerkgrundstück in Azure.',
    analogy:'Das VNet ist ein Firmengelände; Subnetze sind getrennte Gebäudeabschnitte und Netzwerkregeln kontrollieren die Wege dazwischen.',
    sources:['ms-vnet-subnets'], tags:['network-foundation','segmentation','address-space'], aliases:['VNet','Azure Virtual Network']
  },
  'azure-0453': {
    title:'Subnet',
    simple:'Ein Subnet ist ein abgegrenzter Teil eines Virtual Networks. Du kannst damit zum Beispiel Webserver und Datenbanken in getrennte Netzwerkbereiche legen.',
    technical:'Ein Subnet ist ein zusammenhängender IP-Adressbereich innerhalb eines VNet-Adressraums. Netzwerkschnittstellen erhalten private IP-Adressen aus diesem Bereich. NSGs, Route Tables, Service Endpoints und delegierte Azure-Dienste werden typischerweise auf Subnetzebene zugeordnet.',
    architecture:'Subnetze bilden Sicherheits- und Routingzonen, nicht automatisch eigenständige Vertrauensgrenzen. Größe und Zweck sollten Reserven für Skalierung und Azure-reservierte Adressen berücksichtigen. Bestimmte Plattformdienste wie VPN Gateway, Azure Firewall oder Application Gateway benötigen dedizierte Subnetze.',
    why:'Saubere Subnetzplanung schafft kontrollierbare Sicherheitszonen und verhindert spätere Adressengpässe.',
    examples:['Web-Tier in 10.10.1.0/24, App-Tier in 10.10.2.0/24 und Daten-Tier in 10.10.3.0/24.'],
    merksatz:'Subnetze teilen ein VNet in steuerbare Netzwerkzonen.',
    analogy:'Ein Subnet ist ein Raum auf dem VNet-Firmengelände; Zugang und Wege lassen sich pro Raum regeln.',
    sources:['ms-vnet-subnets'], tags:['subnet','segmentation','cidr'], aliases:['Subnetz']
  },
  'azure-0461': {
    title:'Virtual Network Gateway',
    simple:'Ein Virtual Network Gateway verbindet ein VNet mit anderen Netzwerken. Je nach Typ transportiert es VPN- oder ExpressRoute-Verkehr.',
    technical:'Ein Virtual Network Gateway besteht aus von Azure verwalteten Gatewayinstanzen in einem dedizierten GatewaySubnet. Der Gatewaytyp Vpn terminiert verschlüsselte VPN-Verbindungen; der Typ ExpressRoute verbindet ein VNet mit einem ExpressRoute Circuit.',
    architecture:'Der Gatewaytyp ist eine grundlegende Designentscheidung für Hybridkonnektivität. Kapazität, Hochverfügbarkeit, Zonenredundanz und Koexistenz von VPN- und ExpressRoute-Gateways müssen anhand von Durchsatz- und Resilienzzielen gewählt werden.',
    why:'Das Gateway ist der Übergabepunkt zwischen dem VNet und hybriden oder privaten Weitverkehrsverbindungen.',
    examples:['Ein VNet besitzt ein VPN Gateway für den Standorttunnel und zusätzlich ein ExpressRoute Gateway für die private Leitung.'],
    merksatz:'Virtual Network Gateway ist der Oberbegriff; VPN und ExpressRoute sind die Gatewaytypen.',
    sources:['ms-vpn-settings','ms-expressroute'], tags:['gateway','hybrid-connectivity'], aliases:['VNet Gateway']
  },
  'azure-0462': {
    simple:'VPN Gateway verbindet Azure verschlüsselt mit einem Standort, einzelnen Geräten oder einem anderen VNet. Der Verkehr kann dabei über das öffentliche Internet laufen, bleibt aber durch den VPN-Tunnel geschützt.',
    technical:'Azure VPN Gateway ist ein Virtual Network Gateway vom Typ Vpn. Es unterstützt unter anderem Site-to-Site-, Point-to-Site- und VNet-to-VNet-Verbindungen mit IPsec/IKE. Die verwalteten Gatewayinstanzen werden im GatewaySubnet bereitgestellt.',
    architecture:'VPN Gateway eignet sich für schnelle Hybridanbindungen, Remotezugriff und kleinere bis mittlere Produktionsszenarien. SKU, aktiv-aktiv-Konfiguration, Zonenredundanz, Routingtyp und redundante lokale Geräte bestimmen Durchsatz und Ausfallsicherheit. Für planbare private Konnektivität mit höherer Bandbreite kann ExpressRoute geeigneter sein.',
    why:'VPN Gateway ermöglicht Hybridkonnektivität ohne dedizierte private Leitung.',
    examples:['Eine Niederlassung verbindet ihr lokales Netzwerk per Site-to-Site-IPsec-Tunnel mit einem Azure-VNet.'],
    merksatz:'VPN Gateway = verschlüsselter Netzwerkweg nach Azure.',
    analogy:'Wie ein verschlüsselter Tunnel durch ein öffentliches Straßennetz.',
    sources:['ms-vpn-gateway','ms-vpn-settings'], tags:['vpn','hybrid-connectivity','ipsec']
  },
  'azure-0467': {
    title:'Point-to-Site VPN (P2S)',
    simple:'Point-to-Site verbindet einen einzelnen Computer sicher mit einem Azure-VNet. Das ist praktisch für Homeoffice, Administration oder Entwicklung.',
    technical:'Bei P2S baut ein Client eine verschlüsselte Verbindung zum VPN Gateway auf. Je nach Konfiguration werden OpenVPN, IKEv2 oder SSTP sowie Zertifikats-, RADIUS- oder Microsoft-Entra-Authentifizierung verwendet.',
    architecture:'P2S ist für benutzer- oder gerätebezogenen Zugriff geeignet, ersetzt aber keine standortweite Netzwerkanbindung. Adresspool, Authentifizierung, Namensauflösung und Routenpropagierung sollten mit Zero-Trust- und Betriebsanforderungen abgestimmt werden.',
    why:'P2S ermöglicht sicheren Einzelzugriff auf private Azure-Ressourcen.',
    examples:['Ein Administrator verbindet sein MacBook per P2S mit internen VMs ohne öffentliche VM-IP.'],
    merksatz:'P2S verbindet ein Gerät mit dem VNet.',
    sources:['ms-vpn-gateway'], tags:['vpn','remote-access'], aliases:['P2S']
  },
  'azure-0468': {
    title:'Site-to-Site VPN (S2S)',
    simple:'Site-to-Site verbindet ein ganzes lokales Netzwerk mit einem Azure-VNet. Geräte auf beiden Seiten können die privaten Netzwerke über einen verschlüsselten Tunnel erreichen.',
    technical:'S2S verwendet eine IPsec/IKE-Verbindung zwischen Azure VPN Gateway und einem kompatiblen lokalen VPN-Gerät mit öffentlicher IP. Statische oder dynamische Routen bestimmen, welche Präfixe über den Tunnel erreichbar sind.',
    architecture:'S2S ist ein typischer Einstieg in Hybrid Cloud und eine mögliche Ausweichverbindung für ExpressRoute. Für hohe Verfügbarkeit werden redundante lokale Geräte, aktiv-aktive Gateways und getrennte Verbindungen geplant; überlappende Adressräume sind zu vermeiden.',
    why:'S2S bindet Standorte ohne Einzelclient-Konfiguration an Azure an.',
    examples:['Das Firmennetz 10.0.0.0/16 erreicht Azure-Workloads im VNet 10.20.0.0/16 über IPsec.'],
    merksatz:'S2S verbindet Netzwerk mit Netzwerk.',
    sources:['ms-vpn-gateway'], tags:['vpn','site-to-site','hybrid-connectivity'], aliases:['S2S']
  },
  'azure-0473': {
    title:'GatewaySubnet',
    simple:'GatewaySubnet ist das reservierte Subnet für ein Azure Virtual Network Gateway. Normale Workloads gehören nicht hinein.',
    technical:'Das Subnet muss exakt GatewaySubnet heißen. Azure stellt dort die verwalteten Gatewayinstanzen und ihre Routingfunktionen bereit. Die Größe muss ausreichend Reserven für die gewählte SKU, Skalierung und mögliche Koexistenz bieten.',
    architecture:'GatewaySubnet wird früh und ausreichend groß geplant; Microsoft empfiehlt für viele aktuelle Szenarien /27 oder größer. Eigene Workloads und unbedachte NSG- oder Routenzuordnungen können den Gatewaybetrieb stören und sollten vermieden werden.',
    why:'Ohne korrekt geplantes GatewaySubnet kann kein VPN- oder ExpressRoute-Gateway zuverlässig betrieben werden.',
    examples:['Ein VNet reserviert 10.20.255.0/27 ausschließlich als GatewaySubnet.'],
    merksatz:'GatewaySubnet ist die reservierte Stellfläche für das VNet-Gateway.',
    sources:['ms-vnet-subnets','ms-vpn-settings'], tags:['gateway-subnet','gateway','subnet']
  },
  'azure-0478': {
    simple:'ExpressRoute verbindet ein lokales Netzwerk privat mit Microsoft-Cloud-Diensten. Die Verbindung läuft über einen Konnektivitätsanbieter und nicht über das öffentliche Internet.',
    technical:'ExpressRoute stellt Layer-3-Konnektivität über einen Provider, eine Ethernet-Punkt-zu-Punkt-Verbindung oder eine Colocation bereit. BGP tauscht Routen aus; jeder Circuit besitzt redundante Verbindungen zu Microsoft-Edge-Routern.',
    architecture:'ExpressRoute ist für planbare Bandbreite, konsistente Latenz und hohe Zuverlässigkeit geeignet. Das Design umfasst Circuit-Redundanz, getrennte Peeringstandorte, BGP, Gatewaykapazität und häufig ein zusätzliches Site-to-Site-VPN als unabhängigen Ausweichpfad.',
    why:'ExpressRoute bietet private, leistungsfähige Hybridkonnektivität für geschäftskritische Workloads.',
    examples:['Ein Rechenzentrum verbindet geschäftskritische Systeme über zwei redundante ExpressRoute Circuits mit Azure.'],
    merksatz:'ExpressRoute = privater Providerweg zur Microsoft Cloud.',
    analogy:'Anders als der VPN-Tunnel über öffentliche Wege ist ExpressRoute eine privat bereitgestellte Zufahrt.',
    sources:['ms-expressroute'], tags:['expressroute','private-connectivity','bgp']
  },
  'azure-0493': {
    simple:'Das ExpressRoute Gateway verbindet ein Azure-VNet mit einem ExpressRoute Circuit. Ohne dieses Gateway kann das VNet die privaten ExpressRoute-Routen nicht nutzen.',
    technical:'Es ist ein Virtual Network Gateway vom Typ ExpressRoute im GatewaySubnet. Das Gateway tauscht über den Circuit gelernte Routen mit dem VNet aus und ist in verschiedenen SKUs und Redundanzoptionen verfügbar.',
    architecture:'Gateway-SKU und Bereitstellungsmodell müssen zu Bandbreite, Anzahl der Verbindungen, FastPath-Optionen und Resilienzzielen passen. Für hohe Verfügbarkeit werden zonenredundante Gateways und redundante Circuits betrachtet.',
    why:'Das ExpressRoute Gateway ist die logische Brücke vom Circuit in das VNet.',
    examples:['Ein ExpressRoute Circuit wird über eine Connection an das ExpressRoute Gateway des Hub-VNet angebunden.'],
    merksatz:'Circuit ist die private Strecke; ExpressRoute Gateway ist der VNet-Anschluss.',
    sources:['ms-expressroute','ms-vpn-settings'], tags:['expressroute','gateway']
  },
  'azure-0505': {
    simple:'Azure Load Balancer verteilt TCP- oder UDP-Verbindungen auf mehrere gesunde Backend-Systeme. Dadurch bleibt ein Dienst verfügbar, wenn eine Instanz ausfällt oder viel Last entsteht.',
    technical:'Load Balancer arbeitet auf Layer 4 und verwendet Frontend-IP-Konfigurationen, Backend Pools, Load-Balancing-Regeln und Health Probes. Er kann öffentlich oder intern sein; die Verteilungsentscheidung erfolgt pro Netzwerkflow.',
    architecture:'Load Balancer ist passend für sehr performante regionale oder globale Layer-4-Szenarien ohne HTTP-Inhaltsrouting. Backend-Redundanz, Zonenmodell, Probe-Design und Outbound-Konnektivität müssen bewusst geplant werden. Für HTTP(S)-Routing auf Layer 7 ist Application Gateway oder Front Door geeigneter.',
    why:'Load Balancer erhöht Verfügbarkeit und Skalierbarkeit für TCP/UDP-Dienste.',
    examples:['Ein interner Load Balancer verteilt Datenbank-Proxy-Verbindungen auf zwei VMs.'],
    merksatz:'Load Balancer verteilt Netzwerkflows; er versteht nicht den Inhalt einer Webseite.',
    analogy:'Ein Verteiler weist eingehende Lieferungen einem verfügbaren Schalter zu.',
    sources:['ms-load-balancing','ms-load-balancer-components'], tags:['load-balancing','layer-4','tcp','udp']
  },
  'azure-0510': {
    title:'Load Balancer Health Probes',
    simple:'Health Probes prüfen regelmäßig, ob ein Backend erreichbar und gesund ist. Nicht erreichbare Instanzen erhalten keine neuen Verbindungen.',
    technical:'Eine Health Probe testet einen konfigurierten TCP-, HTTP- oder HTTPS-Endpunkt in einem Intervall. Ihr Ergebnis steuert, welche Backend-Pool-Mitglieder für neue Flows in die Lastverteilung aufgenommen werden.',
    architecture:'Die Probe muss die tatsächliche Dienstgesundheit abbilden, ohne durch abhängige Systeme unnötig instabil zu werden. Pfad, Port, Schwellenwerte und Graceful Shutdown beeinflussen Failoverzeit und Benutzererlebnis.',
    why:'Eine falsche Probe kann gesunde Instanzen entfernen oder fehlerhafte Instanzen weiter bedienen.',
    examples:['Die Probe ruft /health auf Port 443 auf und entfernt eine VM nach mehreren fehlgeschlagenen Antworten.'],
    merksatz:'Die Health Probe entscheidet, wer neue Arbeit erhält.',
    sources:['ms-load-balancer-components'], tags:['health-probe','load-balancer','availability']
  },
  'azure-0519': {
    simple:'Application Gateway verteilt Webanfragen innerhalb einer Azure-Region. Es kann anhand von Webadresse oder Hostnamen entscheiden, welches Backend eine Anfrage erhält.',
    technical:'Application Gateway ist ein Layer-7-Web-Traffic-Load-Balancer mit Listenern, Routingregeln, Backend Pools, Health Probes und HTTP-Einstellungen. Es unterstützt URL- und hostbasiertes Routing, TLS-Terminierung, Autoscaling, Zonenredundanz und WAF-Integration.',
    architecture:'Application Gateway eignet sich als regionaler HTTP(S)-Einstiegspunkt für öffentliche oder private Anwendungen. TLS-Ende-zu-Ende, Backend-Namensauflösung, Skalierung und WAF-Policies müssen gemeinsam geplant werden. In globalen Architekturen kann Front Door davor liegen.',
    why:'Application Gateway verbindet Webrouting, Lastverteilung und optionalen Anwendungsschutz.',
    examples:['/images wird an einen Bilddienst und /api an einen API-Backend-Pool weitergeleitet.'],
    merksatz:'Application Gateway versteht HTTP(S) und routet nach Inhalt.',
    analogy:'Ein Empfang liest Ziel und Anliegen einer Anfrage und schickt sie an die richtige Abteilung.',
    sources:['ms-app-gateway','ms-load-balancing'], tags:['application-gateway','layer-7','http','routing']
  },
  'azure-0521': {
    title:'Layer-7-Routing',
    simple:'Layer-7-Routing entscheidet anhand von Informationen aus einer Webanfrage, wohin sie geleitet wird. Dazu gehören zum Beispiel der Hostname oder der URL-Pfad.',
    technical:'Application Gateway wertet HTTP(S)-Attribute wie Host Header und URL-Pfad aus und ordnet die Anfrage über Listener und Regeln einem Backend Pool zu. Dies unterscheidet es von reinem Layer-4-Routing nach IP, Port und Protokoll.',
    architecture:'Layer-7-Routing ermöglicht mehrere Anwendungen oder Dienste hinter einem gemeinsamen Einstiegspunkt. Regeln sollten eindeutig, testbar und zusammen mit TLS-, Probe- und WAF-Konfiguration versioniert werden.',
    why:'Inhaltsbasiertes Routing vereinfacht Webarchitekturen und reduziert öffentliche Einstiegspunkte.',
    examples:['api.contoso.com wird an API-Server, shop.contoso.com an Shop-Server geroutet.'],
    merksatz:'Layer 7 sieht die Webanfrage, Layer 4 nur den Netzwerkflow.',
    sources:['ms-app-gateway'], tags:['layer-7','http-routing','application-gateway']
  },
  'azure-0523': {
    title:'Application Gateway WAF-Integration',
    simple:'Application Gateway kann eine Web Application Firewall verwenden. Sie prüft Webanfragen auf bekannte Angriffe und kann schädliche Anfragen blockieren.',
    technical:'Eine WAF Policy wird mit Application Gateway, einem Listener oder einer pfadbasierten Regel verknüpft. Verwaltete OWASP-Regelsätze und eigene Regeln arbeiten im Detection- oder Prevention-Modus und prüfen unter anderem Header und Request Body.',
    architecture:'WAF-Policies sollten zunächst beobachtbar eingeführt, auf False Positives abgestimmt und anschließend kontrolliert in den Prevention-Modus überführt werden. WAF ergänzt, aber ersetzt weder sicheren Anwendungscode noch Layer-3/4-Schutz.',
    why:'Die Integration stellt zentralen Layer-7-Schutz unmittelbar am regionalen Web-Einstiegspunkt bereit.',
    examples:['Eine WAF Policy blockiert typische SQL-Injection-Muster vor dem Web-Backend.'],
    merksatz:'Application Gateway routet; WAF prüft den Webinhalt.',
    sources:['ms-app-gateway','ms-waf'], tags:['waf','application-gateway','web-security']
  },
  'azure-0545': {
    title:'Azure DNS',
    simple:'DNS übersetzt leicht merkbare Namen in IP-Adressen. Azure DNS hostet öffentliche und private DNS-Zonen auf der Azure-Infrastruktur.',
    technical:'Azure DNS verwaltet DNS-Zonen und Record Sets über Azure Resource Manager. Public DNS beantwortet Internetanfragen autoritativ; Private DNS löst Namen in verknüpften VNets auf. Azure DNS registriert keine Domainnamen selbst.',
    architecture:'DNS ist eine kritische Abhängigkeit für Dienstauffindbarkeit und Failover. Öffentliche und private Namensräume, Delegation, TTLs, Split-Horizon-DNS und Hybridauflösung sollten bewusst geplant werden. Für Hybridauflösung kann Azure DNS Private Resolver eingesetzt werden.',
    why:'Ohne zuverlässige Namensauflösung sind Anwendungen trotz funktionierender Netzwerkpfade oft nicht erreichbar.',
    examples:['contoso.com wird an Azure DNS delegiert; interne privatelink-Zonen lösen nur im verbundenen Netzwerk auf.'],
    merksatz:'DNS übersetzt Namen in erreichbare Ziele.',
    analogy:'DNS ist das Telefonbuch des Netzwerks.',
    sources:['ms-dns'], tags:['dns','name-resolution','network-foundation'], aliases:['Azure DNS & Domain Services']
  },
  'azure-0548': {
    title:'DNS-Zonen und DNS-Einträge',
    simple:'Eine DNS-Zone verwaltet Namen für einen bestimmten Bereich wie contoso.com. Einträge ordnen Namen zum Beispiel IP-Adressen oder anderen Namen zu.',
    technical:'Azure DNS unterstützt Record Sets wie A, AAAA, CNAME, MX, TXT, PTR, SOA und SRV. Die Zone wird über Nameserver-Delegation autoritativ; TTL-Werte bestimmen, wie lange Resolver Antworten zwischenspeichern.',
    architecture:'Zonenverantwortung, Delegation, Automatisierung und TTLs beeinflussen Betrieb und Failover. Änderungen sollten wie Infrastrukturcode verwaltet und gegen versehentliche Löschung geschützt werden.',
    why:'Zonen und Records bilden das verwaltbare Datenmodell der Namensauflösung.',
    examples:['Der A-Record api.contoso.com verweist auf eine öffentliche IPv4-Adresse.'],
    merksatz:'Zone ist der Namensbereich; Record ist ein Eintrag darin.',
    sources:['ms-dns'], tags:['dns-zone','dns-records']
  },
  'azure-0558': {
    simple:'Azure Private DNS löst interne Namen für verbundene Virtual Networks auf. So können Ressourcen private Ziele über Namen statt über feste IP-Adressen erreichen.',
    technical:'Private DNS Zones werden mit VNets verknüpft und unterstützen gängige DNS-Recordtypen. Optional kann ein Link VM-Records automatisch registrieren. Für Private Endpoints werden dienstspezifische privatelink-Zonen verwendet, damit der öffentliche Dienstname zur privaten IP aufgelöst wird.',
    architecture:'Private DNS ist ein eigener Architekturbaustein für Private Link, Peering und Hybridnetze. Zonenlinks, zentrale oder verteilte Zuständigkeit, Split-Horizon-Verhalten und Auflösung von On-Premises über Private Resolver müssen konsistent geplant werden.',
    why:'Private Verbindungen funktionieren operativ nur zuverlässig, wenn Namen auf die privaten Endpunkte zeigen.',
    examples:['Ein Azure-SQL-Name löst innerhalb des VNet auf die private Endpoint-IP auf.'],
    merksatz:'Private Verbindung braucht passende private Namensauflösung.',
    analogy:'Ein internes Telefonbuch, das nur für verbundene Netzwerke gilt.',
    sources:['ms-private-dns-overview','ms-private-dns'], tags:['private-dns','name-resolution','private-link']
  },
  'azure-0560': {
    simple:'Traffic Manager lenkt Benutzer per DNS zu einem passenden öffentlichen Endpunkt. Kriterien können Nähe, Priorität, Gewichtung oder geografische Regeln sein.',
    technical:'Traffic Manager ist ein DNS-basierter globaler Traffic Load Balancer. Ein Profil enthält Endpunkte, eine Routingmethode und Health Monitoring. Der Datenverkehr läuft nicht durch Traffic Manager; DNS liefert dem Client das ausgewählte Ziel.',
    architecture:'Traffic Manager eignet sich für protokollunabhängige, globale Endpunktauswahl und hybride Ziele. DNS-Caching und TTL verzögern jedoch Failover. Für HTTP(S)-Proxyfunktionen, TLS-Terminierung, WAF oder Edge-Caching ist Front Door passender.',
    why:'Traffic Manager erhöht globale Verfügbarkeit ohne als Datenpfad-Proxy zu arbeiten.',
    examples:['Bei Ausfall der primären Region liefert DNS den Endpunkt der sekundären Region.'],
    merksatz:'Traffic Manager gibt per DNS die Richtung vor, transportiert aber keine Anfrage.',
    sources:['ms-traffic-manager','ms-load-balancing'], tags:['traffic-manager','dns-routing','global']
  },
  'azure-0562': {
    simple:'Azure Front Door ist ein globaler Einstiegspunkt für Webanwendungen. Benutzer werden über Microsofts Edge-Netzwerk schnell und sicher zu einem gesunden Backend geleitet.',
    technical:'Front Door Standard/Premium ist ein globaler Layer-7-Proxy und CDN für HTTP(S). Es bietet Anycast-basierten Einstieg, Origin Health Probes, Routing, TLS, Caching und WAF-Integration; Premium unterstützt zusätzlich private Origin-Anbindung per Private Link.',
    architecture:'Front Door eignet sich für weltweit verteilte, internetorientierte Webanwendungen und schnelle regionsübergreifende Umschaltung. Origins sollten gegen direkten Zugriff geschützt, TLS-Ende-zu-Ende und WAF-Policies geplant werden. Regional kann Front Door an Application Gateway oder andere Origins weiterleiten.',
    why:'Front Door kombiniert globale Webverteilung, Beschleunigung und Edge-Schutz.',
    examples:['Benutzer weltweit greifen über Front Door auf zwei regionale Web-Backends mit automatischem Failover zu.'],
    merksatz:'Front Door ist die globale Eingangstür für HTTP(S).',
    analogy:'Ein weltweites Empfangsnetz leitet Besucher zum nächstbesten geöffneten Standort.',
    sources:['ms-front-door','ms-load-balancing'], tags:['front-door','cdn','global','layer-7']
  },
  'azure-0841': {
    simple:'Azure Firewall ist eine zentral verwaltete Netzwerk-Firewall für Azure. Sie kontrolliert und protokolliert erlaubte oder blockierte Verbindungen zwischen Netzwerken und zum Internet.',
    technical:'Azure Firewall ist ein zustandsbehafteter, cloudnativer Firewall-as-a-Service-Dienst. Er verarbeitet Netzwerk-, Anwendungs- und NAT-Regeln und kann je nach SKU Funktionen wie Threat Intelligence, TLS Inspection und IDPS bereitstellen.',
    architecture:'Azure Firewall wird häufig zentral in einem Hub-VNet bereitgestellt; UDRs leiten Spoke-Verkehr zur Inspektion dorthin. SKU, dediziertes AzureFirewallSubnet, Hochverfügbarkeit, DNS, Policy-Hierarchie und symmetrisches Routing sind zentrale Designpunkte. NSGs bleiben ergänzend für lokale Segmentierung sinnvoll.',
    why:'Eine zentrale Firewall schafft konsistente Kontrolle und Protokollierung über mehrere Netzwerke hinweg.',
    examples:['Spoke-Subnetze senden Internetverkehr über eine Default Route an Azure Firewall im Hub.'],
    merksatz:'NSG segmentiert lokal; Azure Firewall inspiziert zentral.',
    analogy:'Die Firewall ist die zentrale Sicherheitskontrolle an den Hauptverkehrswegen.',
    sources:['ms-firewall'], tags:['azure-firewall','network-security','hub-spoke']
  },
  'azure-0846': {
    title:'Azure Firewall NAT Rules',
    simple:'NAT-Regeln übersetzen öffentliche oder private Adressen und Ports. Damit kann Azure Firewall eingehende Verbindungen gezielt an ein internes Ziel weitergeben.',
    technical:'Destination-NAT-Regeln übersetzen Ziel-IP und Zielport eines eingehenden Flows zu einer privaten Zieladresse. Azure Firewall verarbeitet NAT-, Netzwerk- und Anwendungsregeln nach definierter Regelverarbeitungslogik.',
    architecture:'Eingehende NAT-Veröffentlichung sollte auf notwendige Ziele und Ports begrenzt, protokolliert und mit NSGs sowie Anwendungsschutz kombiniert werden. Für HTTP(S)-Anwendungen ist ein WAF-fähiger Proxy oft die passendere öffentliche Eintrittsschicht.',
    why:'NAT-Regeln ermöglichen kontrollierte Adress- und Portübersetzung am zentralen Firewallpunkt.',
    examples:['Die öffentliche Firewall-IP auf Port 443 wird an einen privaten Reverse Proxy weitergeleitet.'],
    merksatz:'NAT übersetzt Adressen; es bewertet nicht den Inhalt der Webanfrage.',
    sources:['ms-firewall'], tags:['firewall','nat','dnat']
  },
  'azure-0848': {
    title:'Azure Firewall Network Rules',
    simple:'Network Rules erlauben oder blockieren Verbindungen anhand von Adressen, Ports und Protokollen. Sie eignen sich für Netzwerkverkehr, der nicht als Webadresse geregelt wird.',
    technical:'Network Rule Collections definieren Quell- und Zieladressen oder Service Tags, Protokoll und Ports für Layer-3/4-Verkehr. Azure Firewall wertet sie zustandsbehaftet innerhalb der Policy- und Prioritätslogik aus.',
    architecture:'Regeln sollten dem Least-Privilege-Prinzip folgen, logisch gruppiert und zentral versioniert werden. Breite Any-Regeln erschweren Audit und Segmentierung; Logs und Threat-Intelligence-Signale gehören in das Betriebsmodell.',
    why:'Network Rules bilden die zentrale L3/L4-Verkehrspolitik der Firewall.',
    examples:['Ein App-Subnetz darf TCP 1433 nur zum Datenbank-Subnetz senden.'],
    merksatz:'Network Rule = wer darf über welches Protokoll und welchen Port wohin?',
    sources:['ms-firewall'], tags:['firewall','network-rules','layer-4']
  },
  'azure-0850': {
    title:'Azure Firewall Application Rules',
    simple:'Application Rules steuern ausgehenden Webzugriff anhand von Namen wie microsoft.com. Das ist verständlicher und wartbarer als viele einzelne IP-Adressen.',
    technical:'Application Rule Collections filtern unterstützte Protokolle anhand von FQDNs, FQDN Tags oder Webkategorien. Azure Firewall löst Namen auf und wendet die Regeln im zustandsbehafteten Datenpfad an.',
    architecture:'FQDN-basierte Egress-Policies eignen sich für kontrollierten Internetzugriff aus Workloads. DNS-Konsistenz, TLS Inspection bei erforderlicher Inhaltsprüfung, Ausnahmen und Protokollauswertung müssen Teil des Designs sein.',
    why:'Application Rules drücken aus, zu welchen benannten Webzielen Workloads kommunizieren dürfen.',
    examples:['Build-Agenten dürfen HTTPS nur zu github.com und benötigten Microsoft-Endpunkten senden.'],
    merksatz:'Application Rule steuert benannte Anwendungsziele statt nur IP und Port.',
    sources:['ms-firewall'], tags:['firewall','application-rules','fqdn']
  },
  'azure-0852': {
    title:'Azure DDoS Protection',
    simple:'Azure DDoS Protection hilft, öffentlich erreichbare Azure-Ressourcen gegen sehr große Mengen schädlichen Netzwerkverkehrs zu schützen. Der Dienst erkennt Angriffe und mindert sie automatisch auf Netzwerk- und Transportebene.',
    technical:'Azure bietet standardmäßig infrastrukturellen DDoS-Schutz. DDoS Network Protection schützt unterstützte öffentliche IP-Ressourcen in aktivierten VNets mit adaptiver Abstimmung, Telemetrie und Zusatzleistungen; DDoS IP Protection gilt pro geschützter öffentlicher IP. Der Schutz wirkt auf Layer 3 und 4.',
    architecture:'DDoS-Schutz ist Teil eines mehrschichtigen Verfügbarkeitsdesigns für öffentlich exponierte Workloads. Network- oder IP-Protection wird nach Anzahl öffentlicher IPs und Betriebsanforderungen gewählt; WAF ergänzt Layer-7-Schutz. Private Endpoints reduzieren die öffentliche Angriffsfläche.',
    why:'DDoS-Angriffe bedrohen die Verfügbarkeit öffentlich erreichbarer Anwendungen.',
    examples:['Ein öffentliches Application Gateway wird durch DDoS Network Protection auf L3/L4 und durch WAF auf L7 geschützt.'],
    merksatz:'DDoS schützt Verfügbarkeit auf L3/L4; WAF schützt Webanfragen auf L7.',
    sources:['ms-ddos'], tags:['ddos','availability','network-security']
  },
  'azure-0863': {
    title:'Web Application Firewall (WAF)',
    simple:'Eine WAF schützt Webanwendungen vor typischen Angriffen wie SQL Injection und Cross-Site Scripting. Sie prüft HTTP(S)-Anfragen und kann verdächtige Anfragen protokollieren oder blockieren.',
    technical:'Azure WAF wird mit Application Gateway oder Front Door bereitgestellt. WAF Policies kombinieren verwaltete OWASP-Regelsätze, eigene Regeln, Ausnahmen und Detection- oder Prevention-Modus.',
    architecture:'WAF gehört an öffentliche oder sensible HTTP(S)-Einstiegspunkte und ergänzt DDoS-, Netzwerk- und Anwendungsschutz. Policy-Lebenszyklus, Tuning gegen False Positives, Logging und getrennte Regeln pro Anwendung sind für den stabilen Betrieb entscheidend.',
    why:'WAF reduziert das Risiko verbreiteter Webangriffe zentral vor den Anwendungen.',
    examples:['Eine verwaltete Regel erkennt ein SQL-Injection-Muster und blockiert die Anfrage im Prevention-Modus.'],
    merksatz:'WAF versteht Webanfragen; NSG und Netzwerk-Firewall sehen vor allem Netzwerkverkehr.',
    analogy:'Ein Sicherheitsprüfer liest den Inhalt eines Pakets, bevor es die Webanwendung erreicht.',
    sources:['ms-waf'], tags:['waf','web-security','layer-7']
  },
  'azure-0864': {
    simple:'Eine Network Security Group ist eine Liste von Erlaubnis- und Sperrregeln für Netzwerkverkehr. Sie kann ein Subnet oder die Netzwerkschnittstelle einer VM schützen.',
    technical:'NSGs enthalten priorisierte, zustandsbehaftete Regeln für eingehenden und ausgehenden Verkehr. Regeln verwenden Quelle, Ziel, Port, Protokoll sowie optional Service Tags oder Application Security Groups. Eine NSG kann Subnetzen und Netzwerkschnittstellen zugeordnet werden.',
    architecture:'NSGs eignen sich für verteilte Mikrosegmentierung nahe am Workload. Regeln sollten rollenbasiert, minimal und mit ASGs oder Service Tags statt wechselnder Einzel-IPs formuliert werden. Zentrale Firewallkontrolle und NSGs erfüllen unterschiedliche, ergänzende Aufgaben.',
    why:'NSGs begrenzen seitliche Bewegung und unerwünschte Ein- oder Ausgänge im VNet.',
    examples:['Nur das Web-Subnetz darf den App-Tier auf TCP 443 erreichen.'],
    merksatz:'NSG = zustandsbehaftete Türregeln für Subnet oder NIC.',
    analogy:'Ein Türsteher prüft Richtung, Absender, Ziel und erlaubten Eingang.',
    sources:['ms-nsg-asg'], tags:['nsg','network-security','segmentation']
  },
  'azure-0871': {
    title:'Route Table / User-Defined Routes (UDR)',
    simple:'Eine Route Table legt fest, welchen Weg Netzwerkverkehr aus einem Subnet nimmt. Eigene Routen können Azure-Standardwege überschreiben, zum Beispiel um Verkehr über eine Firewall zu führen.',
    technical:'Azure erstellt Systemrouten für jedes Subnet. Eine zugeordnete Route Table enthält User-Defined Routes mit Adresspräfix und Next-Hop-Typ. Azure wählt Routen anhand Präfixlänge, Quelle und weiteren Routingregeln.',
    architecture:'UDRs erzwingen Inspektions- und Transitpfade in Hub-and-Spoke-Netzen. Rückweg und Hinweg müssen symmetrisch sein; BGP-Propagation, Service Endpoints und spezifischere Präfixe können die effektive Route beeinflussen. Effektive Routen sollten betrieblich geprüft werden.',
    why:'UDRs machen den beabsichtigten Netzwerkpfad steuerbar und auditierbar.',
    examples:['0.0.0.0/0 eines Spoke-Subnets zeigt als Virtual Appliance auf die private IP von Azure Firewall.'],
    merksatz:'Route Table bestimmt den nächsten Weg ab dem Subnet.',
    analogy:'Ein Wegweiser schickt Verkehr über die gewünschte Kontrollstelle.',
    sources:['ms-route-tables'], tags:['udr','route-table','routing']
  },
  'azure-0875': {
    title:'Application Security Group (ASG)',
    simple:'Eine ASG fasst Netzwerkschnittstellen nach ihrer Rolle zusammen, zum Beispiel Webserver oder Datenbankserver. NSG-Regeln können dann diese verständlichen Gruppen statt einzelner IP-Adressen verwenden.',
    technical:'ASGs sind logische Gruppen von NICs innerhalb eines VNet und können als Quelle oder Ziel in NSG-Regeln referenziert werden. Dadurch bleiben Regeln stabil, wenn Instanzen skalieren oder private IP-Adressen wechseln.',
    architecture:'ASGs verbessern die Lesbarkeit rollenbasierter Segmentierungsregeln. Gruppenzuschnitt und Benennung sollten Architekturrollen abbilden; ASGs ersetzen keine NSG, sondern sind Operanden ihrer Regeln.',
    why:'ASGs entkoppeln Sicherheitsregeln von wechselnden IP-Adressen.',
    examples:['Die NSG-Regel erlaubt HTTPS von ASG-Web zu ASG-App, unabhängig von der Anzahl der VMs.'],
    merksatz:'ASG gruppiert Rollen; NSG setzt die Regeln zwischen ihnen um.',
    analogy:'ASG ist eine Personengruppe mit gleicher Rolle, NSG die Zutrittsordnung.',
    sources:['ms-nsg-asg'], tags:['asg','nsg','microsegmentation']
  },
  'azure-0878': {
    simple:'Ein Service Endpoint erlaubt einem Subnet, unterstützte Azure-Dienste direkt über das Azure-Backbone zu erreichen. Der Dienst bleibt dabei über seinen öffentlichen Endpunkt adressiert, kann den Zugriff aber auf bestimmte VNets beschränken.',
    technical:'Service Endpoints werden pro Dienst auf einem Subnet aktiviert und erweitern die VNet-Identität zum PaaS-Dienst. Der Quellverkehr verwendet seine private VNet-Adresse; DNS bleibt grundsätzlich beim öffentlichen Dienstnamen und dessen öffentlicher IP. Dienstseitige VNet-Regeln begrenzen den Zugriff.',
    architecture:'Service Endpoints sind einfach und kostengünstig, liefern aber keine private IP im VNet und sind für On-Premises-Zugriff eingeschränkt. Microsoft empfiehlt für viele private Zugriffsszenarien Private Link und Private Endpoints; Auswahl und Migrationspfad sollten bewusst dokumentiert werden.',
    why:'Service Endpoints beschränken PaaS-Zugriff auf ausgewählte Subnetze ohne zusätzliche Appliance.',
    examples:['Ein Storage Account erlaubt Zugriffe nur aus einem Subnet mit Microsoft.Storage-Service-Endpoint.'],
    merksatz:'Service Endpoint: privater Azure-Pfad zum weiterhin öffentlichen Dienstendpunkt.',
    sources:['ms-service-endpoints'], tags:['service-endpoint','paas','network-isolation']
  },
  'azure-0881': {
    simple:'Ein Private Endpoint gibt einem Azure-Dienst eine private IP-Adresse in deinem VNet. Der Dienst kann dadurch intern erreichbar sein, ohne dass der Datenpfad über das öffentliche Internet führen muss.',
    technical:'Ein Private Endpoint ist eine Netzwerkschnittstelle in einem Subnet, die über Azure Private Link einer konkreten Dienstressource zugeordnet ist. Datenverkehr läuft über das Microsoft-Backbone. Passende Private-DNS-Konfiguration sorgt dafür, dass der Dienstname zur privaten IP aufgelöst wird.',
    architecture:'Private Endpoints reduzieren öffentliche Exposition und unterstützen Zero-Trust- und Datenabflusskontrollen. Zentralisierung, DNS-Zonen, Genehmigungsworkflow, Netzwerkrichtlinien, Kosten und die Deaktivierung öffentlicher Zugriffe müssen pro Dienst geplant werden. Hybrid- und Peeringnetze können den Endpoint über private Konnektivität erreichen.',
    why:'Private Endpoints machen PaaS-Dienste über eine private VNet-Adresse erreichbar.',
    examples:['Azure SQL erhält einen Private Endpoint; Public Network Access wird deaktiviert und eine privatelink-DNS-Zone mit dem VNet verknüpft.'],
    merksatz:'Private Endpoint = private IP für eine konkrete Dienstressource.',
    analogy:'Ein privater Seiteneingang zu genau einem Dienst statt des öffentlichen Haupteingangs.',
    sources:['ms-private-link','ms-private-dns'], tags:['private-endpoint','private-link','zero-trust']
  },
  'azure-0882': {
    title:'Azure Private Link',
    simple:'Azure Private Link ist die Technik hinter privaten Verbindungen zu unterstützten Azure- und Partnerdiensten. Verbraucher greifen über einen Private Endpoint im eigenen VNet auf den Dienst zu.',
    technical:'Private Link verbindet einen Private Endpoint mit einer konkreten PaaS-Ressource oder einem Private Link Service über das Microsoft-Backbone. Die Plattform unterstützt ressourcenspezifische Zuordnung, Genehmigungsworkflows und Zugriff aus peered oder hybrid verbundenen Netzen.',
    architecture:'Private Link ist ein strategischer Baustein zur Reduktion öffentlicher Endpunkte und zur Begrenzung von Datenabfluss. DNS, Endpoint-Platzierung, zentraler oder verteilter Betrieb, Cross-Tenant-Freigaben und Dienstverfügbarkeit müssen in Plattformstandards festgelegt werden.',
    why:'Private Link stellt die Plattform für private, ressourcenspezifische Dienstzugriffe bereit.',
    examples:['Ein Storage Account wird über Private Link an einen Private Endpoint im Consumer-VNet gebunden.'],
    merksatz:'Private Link ist die Verbindungstechnik; Private Endpoint ist die private Netzwerkschnittstelle im Consumer-VNet.',
    sources:['ms-private-link'], tags:['private-link','private-endpoint','paas']
  },
  'azure-0884': {
    simple:'Ein Public Endpoint ist über eine öffentliche Adresse oder einen öffentlichen Dienstnamen erreichbar. Ohne zusätzliche Einschränkungen kann der Zugriff aus dem Internet erfolgen.',
    technical:'Öffentliche Azure-Dienstendpunkte werden über öffentliche DNS-Namen und IP-Adressen erreicht. Zugriffskontrollen wie Dienstfirewalls, IP-Regeln, Authentifizierung, WAF oder DDoS-Schutz begrenzen das Risiko; der Endpunkt bleibt jedoch öffentlich routbar.',
    architecture:'Öffentliche Endpunkte sind sinnvoll für bewusst internetorientierte Dienste, sollten aber minimiert und mehrschichtig geschützt werden. Für interne PaaS-Zugriffe sind Private Endpoints häufig die bevorzugte Alternative; Service Endpoints schränken den öffentlichen PaaS-Endpunkt auf VNets ein.',
    why:'Die Entscheidung öffentlich oder privat bestimmt Angriffsfläche, DNS, Zugriffsmodell und Betrieb.',
    examples:['Eine öffentliche Webanwendung wird über Front Door und WAF veröffentlicht, während ihre Datenbank nur einen Private Endpoint besitzt.'],
    merksatz:'Öffentlich erreichbar heißt nicht ungeschützt, aber öffentlich routbar.',
    sources:['ms-ip-services','ms-private-link','ms-service-endpoints'], tags:['public-endpoint','internet','exposure']
  },
  'azure-0887': {
    simple:'VNet Peering verbindet zwei Virtual Networks privat miteinander. Ressourcen kommunizieren über das Microsoft-Backbone, als wären die Netzwerke direkt verbunden.',
    technical:'Peering stellt private, niedrig-latente IP-Konnektivität zwischen VNets in derselben oder in unterschiedlichen Regionen bereit. Die Adressräume dürfen sich nicht überschneiden. Peering ist standardmäßig nicht transitiv; Weiterleitung, Gateway Transit und DNS müssen separat konfiguriert werden.',
    architecture:'Peering ist der Standardbaustein für Hub-and-Spoke-Topologien und direkte VNet-Konnektivität. Adressmanagement, nichttransitive Pfade, zentrale Inspektion, Gateway Transit, Cross-Subscription- oder Cross-Tenant-Berechtigungen und Kosten müssen geplant werden.',
    why:'Peering verbindet isolierte Azure-Netzwerke performant ohne VPN-Tunnel über das Internet.',
    examples:['Ein Spoke-VNet nutzt Peering zum Hub-VNet und erreicht dort zentrale Firewall- und DNS-Dienste.'],
    merksatz:'Peering verbindet VNets direkt, aber nicht automatisch transitiv.',
    analogy:'Zwei Grundstücke erhalten eine private Verbindungsstraße; zu einem dritten führt sie nicht automatisch weiter.',
    sources:['ms-vnet-peering','ms-vnet-subnets'], tags:['vnet-peering','backbone','hub-spoke']
  }
};

const relationDefinitions = [
  ['net-rel-001','azure-0442','azure-0453','contains','Ein VNet enthält einen oder mehrere Subnetz-Adressbereiche.',['ms-vnet-subnets'],0.99],
  ['net-rel-002','azure-0453','azure-0864','secured_by','Eine NSG kann einem Subnet zugeordnet werden und dessen eingehenden sowie ausgehenden Verkehr filtern.',['ms-nsg-asg'],0.99],
  ['net-rel-003','azure-0453','azure-0871','uses','Eine Route Table wird einem Subnet zugeordnet und beeinflusst dessen ausgehende Routen.',['ms-route-tables'],0.99],
  ['net-rel-004','azure-0462','azure-0442','connects_to','VPN Gateway verbindet ein VNet verschlüsselt mit On-Premises-Netzen, Clients oder anderen VNets.',['ms-vpn-gateway'],0.98],
  ['net-rel-005','azure-0473','azure-0462','required_by','Azure VPN Gateway benötigt ein dediziertes Subnet mit dem Namen GatewaySubnet.',['ms-vpn-settings'],0.99],
  ['net-rel-006','azure-0467','azure-0462','part_of','Point-to-Site ist ein von Azure VPN Gateway unterstütztes Verbindungsszenario.',['ms-vpn-gateway'],0.99],
  ['net-rel-007','azure-0468','azure-0462','part_of','Site-to-Site ist ein von Azure VPN Gateway unterstütztes Verbindungsszenario.',['ms-vpn-gateway'],0.99],
  ['net-rel-008','azure-0478','azure-0493','uses','Ein VNet wird über ein ExpressRoute Gateway mit dem ExpressRoute Circuit verbunden.',['ms-expressroute'],0.98],
  ['net-rel-009','azure-0493','azure-0442','connects_to','Das ExpressRoute Gateway stellt die Verbindung zwischen ExpressRoute und dem VNet her.',['ms-expressroute'],0.99],
  ['net-rel-010','azure-0462','azure-0478','alternative_to','VPN Gateway und ExpressRoute sind alternative beziehungsweise kombinierbare Wege für Hybridkonnektivität.',['ms-vpn-gateway','ms-expressroute'],0.96],
  ['net-rel-011','azure-0510','azure-0505','part_of','Health Probes bestimmen, welche Backend-Pool-Mitglieder neue Load-Balancer-Flows erhalten.',['ms-load-balancer-components'],0.99],
  ['net-rel-012','azure-0521','azure-0519','part_of','Application Gateway verwendet Layer-7-Routing für HTTP(S)-Anfragen.',['ms-app-gateway'],0.99],
  ['net-rel-013','azure-0519','azure-0863','uses','Application Gateway kann eine WAF Policy zur Prüfung und Blockierung schädlicher Webanfragen verwenden.',['ms-app-gateway','ms-waf'],0.99],
  ['net-rel-014','azure-0562','azure-0863','uses','Front Door Standard/Premium kann Azure WAF am globalen Edge-Einstiegspunkt einsetzen.',['ms-front-door','ms-waf'],0.98],
  ['net-rel-015','azure-0560','azure-0545','uses','Traffic Manager verwendet DNS-Antworten, um Clients zu einem geeigneten Endpunkt zu lenken.',['ms-traffic-manager','ms-dns'],0.98],
  ['net-rel-016','azure-0548','azure-0545','part_of','DNS-Zonen und ihre Einträge werden durch Azure DNS gehostet und verwaltet.',['ms-dns'],0.99],
  ['net-rel-017','azure-0558','azure-0545','part_of','Azure Private DNS ist der Azure-DNS-Dienst für private Namensauflösung in VNets.',['ms-dns','ms-private-dns-overview'],0.99],
  ['net-rel-018','azure-0841','azure-0442','secures','Azure Firewall kann VNet-Verkehr zentral inspizieren und anhand von Policies filtern.',['ms-firewall'],0.98],
  ['net-rel-019','azure-0871','azure-0841','routes_to','Eine UDR kann Subnet-Verkehr zur Inspektion an Azure Firewall als nächsten Hop leiten.',['ms-route-tables','ms-firewall'],0.98],
  ['net-rel-020','azure-0846','azure-0841','part_of','NAT Rules sind ein Regeltyp von Azure Firewall.',['ms-firewall'],0.99],
  ['net-rel-021','azure-0848','azure-0841','part_of','Network Rules sind ein Regeltyp von Azure Firewall für L3/L4-Verkehr.',['ms-firewall'],0.99],
  ['net-rel-022','azure-0850','azure-0841','part_of','Application Rules sind ein Regeltyp von Azure Firewall für benannte Anwendungsziele.',['ms-firewall'],0.99],
  ['net-rel-023','azure-0852','azure-0442','secures','DDoS Network Protection schützt unterstützte öffentliche IP-Ressourcen in aktivierten VNets auf Layer 3 und 4.',['ms-ddos'],0.98],
  ['net-rel-024','azure-0875','azure-0864','used_by','Application Security Groups werden in NSG-Regeln als logische Quellen oder Ziele verwendet.',['ms-nsg-asg'],0.99],
  ['net-rel-025','azure-0878','azure-0571','connects_to','Ein Storage Service Endpoint ermöglicht einem Subnet den direkten Zugriff auf Blob Storage über das Azure-Backbone.',['ms-service-endpoints'],0.97],
  ['net-rel-026','azure-0881','azure-0882','uses','Ein Private Endpoint verwendet Azure Private Link für die private Verbindung zur konkreten Dienstressource.',['ms-private-link'],0.99],
  ['net-rel-027','azure-0878','azure-0881','alternative_to','Service Endpoint und Private Endpoint sind unterschiedliche Optionen zur Absicherung des Zugriffs auf unterstützte Azure-PaaS-Dienste.',['ms-service-endpoints','ms-private-link'],0.97],
  ['net-rel-028','azure-0884','azure-0881','alternative_to','Ein öffentlicher und ein privater Endpunkt stellen unterschiedliche Erreichbarkeits- und Expositionsmodelle dar.',['ms-private-link','ms-ip-services'],0.96],
  ['net-rel-029','azure-0887','azure-0442','connects_to','VNet Peering verbindet Virtual Networks privat über das Microsoft-Backbone.',['ms-vnet-peering'],0.99]
];

for (const source of officialSources) {
  const index = sourcesDocument.sources.findIndex(item => item.id === source.id);
  if (index >= 0) sourcesDocument.sources[index] = source;
  else sourcesDocument.sources.push(source);
}

for (const [id, enrichment] of Object.entries(E)) {
  const node = nodeById.get(id);
  if (!node) throw new Error(`Pilotknoten fehlt: ${id}`);
  const originalTitle = node.title;
  if (enrichment.title) node.title = enrichment.title;
  node.description = {
    simple: enrichment.simple,
    technical: enrichment.technical,
    architecture: enrichment.architecture
  };
  node.why_important = enrichment.why;
  node.examples = enrichment.examples || [];
  node.merksatz = enrichment.merksatz || '';
  node.analogy = enrichment.analogy || '';
  node.sources = [...new Set([...(node.sources || []), ...enrichment.sources])];
  node.tags = [...new Set([...(node.tags || []), ...(enrichment.tags || []), 'networking-pilot-v1.2'])];
  node.aliases = [...new Set([...(node.aliases || []), ...(enrichment.aliases || []), ...(originalTitle !== node.title ? [originalTitle] : [])])];
  node.metadata = {
    ...node.metadata,
    status:'published',
    audit_flags:(node.metadata.audit_flags || []).filter(flag => flag !== 'description_generated_from_title'),
    enrichment:{ version:'1.2', pilot:'networking', reviewed_at:today, source_policy:'official_microsoft_only' }
  };
  node.updated_at = today;
}

const pilotRelationIds = new Set(relationDefinitions.map(([id]) => id));
relationsDocument.relations = relationsDocument.relations.filter(relation => !pilotRelationIds.has(relation.id));
for (const node of nodesDocument.nodes) node.relations = (node.relations || []).filter(id => !pilotRelationIds.has(id));

for (const [id, source, target, type, explanation, sources, confidence] of relationDefinitions) {
  if (!nodeById.has(source) || !nodeById.has(target)) throw new Error(`${id}: Endpunkt fehlt`);
  const typeDefinition = typeById.get(type);
  if (!typeDefinition) throw new Error(`${id}: Typ ${type} fehlt`);
  const relation = {
    schema_version:'1.1', id, source, target, type,
    inverse_type:typeDefinition.inverse_type,
    explanation, sources, confidence, status:'accepted',
    created_by:'knowledge_enrichment_v1.2', created_at:today, reviewed_at:today
  };
  relationsDocument.relations.push(relation);
  for (const nodeId of [source, target]) {
    const node = nodeById.get(nodeId);
    node.relations = [...new Set([...(node.relations || []), id])];
  }
}

const legacyNetworkingRefinements = {
  'rel-001': {
    explanation:'NSGs filtern Verkehr für Subnetze oder Netzwerkschnittstellen innerhalb eines VNet; sie werden nicht direkt dem gesamten VNet zugeordnet.',
    sources:['ms-nsg-asg'], confidence:0.96, reviewed_at:today
  },
  'rel-008': {
    explanation:'Beide kontrollieren Netzwerkpfade, aber Application Gateway arbeitet anwendungsbezogen auf Layer 7, während NSGs zustandsbehaftete L3/L4-Regeln auf Subnet- oder NIC-Ebene anwenden.',
    sources:['ms-app-gateway','ms-nsg-asg'], confidence:0.98, reviewed_at:today
  },
  'rel-009': {
    explanation:'Load Balancer verteilt TCP/UDP-Flows auf Layer 4; Application Gateway trifft inhaltsbezogene Routingentscheidungen für HTTP(S) auf Layer 7.',
    sources:['ms-load-balancing','ms-app-gateway'], confidence:0.99, reviewed_at:today
  },
  'rel-010': {
    explanation:'Traffic Manager lenkt Clients DNS-basiert zu Endpunkten; Front Door ist ein globaler HTTP(S)-Proxy und CDN mit Layer-7-Funktionen.',
    sources:['ms-traffic-manager','ms-front-door','ms-load-balancing'], confidence:0.99, reviewed_at:today
  }
};
for (const relation of relationsDocument.relations) {
  if (legacyNetworkingRefinements[relation.id]) Object.assign(relation, legacyNetworkingRefinements[relation.id]);
}

nodesDocument.meta = {
  ...nodesDocument.meta,
  enrichment_version:'1.2',
  networking_pilot:{ node_count:Object.keys(E).length, relation_count:relationDefinitions.length, reviewed_at:today }
};
relationsDocument.meta = {
  ...relationsDocument.meta,
  relation_count:relationsDocument.relations.length,
  enrichment_version:'1.2',
  networking_relation_count:relationDefinitions.length
};
sourcesDocument.meta = {
  ...sourcesDocument.meta,
  count:sourcesDocument.sources.length,
  generated_at:today,
  enrichment_version:'1.2'
};

write('nodes.json', nodesDocument);
write('relations.json', relationsDocument);
write('sources.json', sourcesDocument);

console.log(JSON.stringify({ enriched_nodes:Object.keys(E).length, added_relations:relationDefinitions.length, total_relations:relationsDocument.relations.length, total_sources:sourcesDocument.sources.length }, null, 2));
