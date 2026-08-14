# Azure Digital Brain V2.1 – Knowledge Navigation Report

## Ausgangslage

V2.0 besitzt eine umfangreiche hierarchische Wissensbasis und fünf Architektur-Szenarien. Für praktisches Architekturlernen reicht eine Suche nach einzelnen Diensten jedoch nicht aus: Lernende benötigen eine Reihenfolge, Voraussetzungen, Querverbindungen und Entscheidungskontexte.

V2.1 löst dieses Navigationsproblem ohne die bestehende Wissensarchitektur zu verändern.

## Navigationsmodell

Die Lernschicht stellt vier Navigationsformen bereit:

1. **Sequenz:** geordnete Schritte innerhalb eines Lernpfads.
2. **Voraussetzungen:** explizite Links zu notwendigem Vorwissen.
3. **Kontextsprünge:** Referenzen aus einem Lernschritt zu vorhandenen Knoten und V2.0-Szenarien.
4. **Reifegrad:** Einordnung von Verstehen über Verbinden und Anwenden bis Entscheiden.

Dadurch kann derselbe Wissensknoten in mehreren Denkzusammenhängen erscheinen, ohne dupliziert oder verschoben zu werden. Azure Monitor ist beispielsweise Anker der Application Journey, der Enterprise Platform und mehrerer Szenarien; seine kanonische Identität bleibt dennoch unverändert.

## Vom Servicekatalog zum Architekturdenken

| Ausgangspunkt | Navigation in V2.1 |
|---|---|
| einzelner Dienst | Problem, Abhängigkeiten und Architekturfrage |
| hierarchischer Elternpfad | mehrere kontextabhängige Lernpfade |
| Theorie | Szenario- und Entscheidungsreferenz |
| gelesen/nicht gelesen | vierstufiges Verständnisniveau im Benutzerprofil |
| isoliertes Produktwissen | Anwendungspfad und Plattformzusammenhang |

## Referenzdichte

- 127 Knotenreferenzen verbinden 33 Schritte mit 72 eindeutigen kanonischen Knoten.
- 53 Szenario-Verknüpfungen verbinden die Lernschritte mit allen fünf V2.0-Szenarien.
- 20 Schritte liegen auf den Reifegraden Anwenden oder Entscheiden.
- Die stärkste Szenariovernetzung besitzt der Enterprise-Platform-Pfad mit 18 Verknüpfungen.

Die mehrfachen Referenzen sind gewollt: Sie bilden unterschiedliche Lernkontexte ab, keine Datenduplikate.

## Abdeckung der Architekturperspektiven

- **Struktur und Governance:** Regionen, Zonen, Tenant-Kontext, Management Groups, Subscriptions, Resource Groups, ARM und Policy.
- **Anwendungsfluss:** DNS, globales und regionales Routing, Security, Compute, Datenpfade und Observability.
- **Plattform:** Landing Zone, Identity, Netzwerk, Security Baseline, Monitoring und Operations.
- **Entscheidungen:** Compute, Traffic, Hybridkonnektivität, Endpunkte und Datenhaltung.
- **Anwendung:** fünf vorhandene Enterprise-Szenarien mit Vorwissen, Verständnis und Entscheidung.

## Identifizierte Navigationslücken

| Lücke | Auswirkung | V2.1-Behandlung |
|---|---|---|
| kein eigener Tenant-Knoten | Tenant-Konzept hat keinen direkten Einzelanker | vorhandene Entra-ID- und Identity-Knoten referenziert |
| kein Azure-Container-Apps-Knoten | Compute-Entscheidung bildet nicht alle modernen Containeroptionen ab | nur vorhandene ACI- und AKS-Knoten verwendet |
| begrenzte Datenplattformauswahl | Data-Decision ist nicht umfassend | ausschließlich SQL Database, Cosmos DB und Storage Account verwendet |
| kein generischer User-Knoten | Application Journey kann den Akteur nicht kanonisch referenzieren | Einstieg beim technischen DNS-Anker |
| keine Hands-on-Referenzen | Wissen endet in V2.1 vor der Lab-Ausführung | leeres `practice_references`-Feld vorbereitet |
| keine Lern-UI | Pfade sind noch nicht interaktiv sichtbar | browserlesbare Runtime und Indizes vorbereitet |

## Empfehlung für eine spätere UI-Phase

Ohne Änderung der Wissensbasis kann eine spätere Oberfläche folgende Ansichten auf der V2.1-Runtime aufbauen:

- Pfadübersicht mit Fortschritt und Reifegrad
- Schrittansicht mit Voraussetzungen, Architekturfragen und Folgepfaden
- Sprung zu kanonischen Knoten und V2.0-Szenarien
- persönliche Notizen und zuletzt bearbeiteter Schritt aus dem bestehenden Profil
- optionaler Lab-Link erst nach separater Freigabe und Integration

V2.1 implementiert diese UI nicht; sie definiert lediglich den belastbaren Datenvertrag dafür.

