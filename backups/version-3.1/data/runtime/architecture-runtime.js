window.AZURE_ARCHITECTURE_SCENARIOS = {
  "schema_version": "2.0",
  "meta": {
    "title": "Azure Digital Brain Architecture Scenario Layer",
    "version": "2.0",
    "scenario_count": 5,
    "created_at": "2026-08-11",
    "content_standard": "Architecture Scenario Standard V2.0",
    "source_policy": "official_microsoft_only",
    "node_reference_policy": "existing_canonical_nodes_only",
    "relationship_policy": "existing_relation_types_only",
    "ui_status": "prepared_not_implemented",
    "ai_status": "not_implemented",
    "used_node_count": 44,
    "relationship_count": 50,
    "generated_from": "data/canonical/scenarios.json",
    "generated_at": "2026-08-11T07:09:34.152Z"
  },
  "scenarios": [
    {
      "id": "scenario-secure-web-application",
      "title": "Secure Web Application Architecture",
      "short_description": "Eine moderne Enterprise-Webanwendung mit kontrolliertem Internet-Einstieg, geschützter Anwendungsschicht, privaten Datenpfaden und durchgängiger Observability.",
      "architecture_goal": "Öffentlichen HTTPS-Zugriff ermöglichen, Angriffsfläche und laterale Bewegung begrenzen, Workload-Identitäten ohne statische Secrets betreiben und den gesamten Benutzerfluss messbar machen.",
      "actors": [
        {
          "id": "actor-internet-user",
          "label": "Internet User",
          "type": "external_actor"
        },
        {
          "id": "actor-platform-team",
          "label": "Platform Team",
          "type": "organizational_actor"
        },
        {
          "id": "actor-application-team",
          "label": "Application Team",
          "type": "organizational_actor"
        },
        {
          "id": "actor-security-operations",
          "label": "Security Operations",
          "type": "organizational_actor"
        }
      ],
      "architecture_flow": [
        {
          "order": 1,
          "from": "Internet User",
          "to": "Global Entry Point",
          "node_refs": [
            "azure-0562"
          ],
          "explanation": "Azure Front Door ist bei globalem Routing, Edge-Beschleunigung und globalem Entry Point eine Option; für rein regionale Anforderungen kann Application Gateway direkt übernehmen."
        },
        {
          "order": 2,
          "from": "Global Entry Point",
          "to": "Web Application Firewall",
          "node_refs": [
            "azure-0863"
          ],
          "explanation": "WAF prüft HTTP/S-Anfragen auf bekannte Webangriffe, bevor sie die Anwendung erreichen."
        },
        {
          "order": 3,
          "from": "Web Application Firewall",
          "to": "Regional Routing",
          "node_refs": [
            "azure-0519",
            "azure-0505"
          ],
          "explanation": "Application Gateway routet auf Layer 7; Azure Load Balancer ist eine Layer-4-Alternative für VM- oder AKS-basierte Pfade."
        },
        {
          "order": 4,
          "from": "Regional Routing",
          "to": "Application Layer",
          "node_refs": [
            "azure-0351",
            "azure-0322",
            "azure-0425"
          ],
          "explanation": "App Service ist der bevorzugte PaaS-Ausgangspunkt; VMs bieten maximale Betriebskontrolle, AKS eine Kubernetes-Plattform für komplexe Containerlandschaften."
        },
        {
          "order": 5,
          "from": "Application Layer",
          "to": "Database Layer",
          "node_refs": [
            "azure-0731"
          ],
          "explanation": "Azure SQL Database stellt relationale Daten als PaaS bereit und wird über private Namensauflösung und Private Endpoint erreicht."
        },
        {
          "order": 6,
          "from": "Application Layer",
          "to": "Storage Layer",
          "node_refs": [
            "azure-0579"
          ],
          "explanation": "Ein Storage Account hält Dateien, Objekte oder Integrationsdaten getrennt von kurzlebigen Compute-Instanzen."
        }
      ],
      "component_instances": [
        {
          "instance_id": "edge",
          "role": "global_entry",
          "node_ref": "azure-0562",
          "requirement": "conditional"
        },
        {
          "instance_id": "waf",
          "role": "web_traffic_protection",
          "node_ref": "azure-0863",
          "requirement": "required"
        },
        {
          "instance_id": "regional-ingress",
          "role": "layer7_routing",
          "node_ref": "azure-0519",
          "requirement": "required"
        },
        {
          "instance_id": "app",
          "role": "application_compute",
          "node_ref": "azure-0351",
          "alternatives": [
            "azure-0322",
            "azure-0425"
          ],
          "requirement": "required"
        },
        {
          "instance_id": "database",
          "role": "relational_data",
          "node_ref": "azure-0731",
          "requirement": "required"
        },
        {
          "instance_id": "storage",
          "role": "object_and_file_data",
          "node_ref": "azure-0579",
          "requirement": "conditional"
        },
        {
          "instance_id": "network",
          "role": "private_network_boundary",
          "node_ref": "azure-0442",
          "requirement": "required"
        },
        {
          "instance_id": "private-access",
          "role": "private_paas_access",
          "node_ref": "azure-0881",
          "requirement": "required"
        },
        {
          "instance_id": "identity",
          "role": "workload_identity",
          "node_ref": "azure-0947",
          "requirement": "required"
        },
        {
          "instance_id": "observability",
          "role": "end_to_end_monitoring",
          "node_ref": "azure-0983",
          "requirement": "required"
        }
      ],
      "diagram": {
        "layout": "left_to_right_with_cross_cutting_controls",
        "nodes": [
          "actor-internet-user",
          "edge",
          "waf",
          "regional-ingress",
          "app",
          "database",
          "storage",
          "network",
          "private-access",
          "identity",
          "observability"
        ],
        "edges": [
          {
            "from": "actor-internet-user",
            "to": "edge",
            "label": "HTTPS"
          },
          {
            "from": "edge",
            "to": "waf",
            "label": "inspect"
          },
          {
            "from": "waf",
            "to": "regional-ingress",
            "label": "approved traffic"
          },
          {
            "from": "regional-ingress",
            "to": "app",
            "label": "private route"
          },
          {
            "from": "app",
            "to": "database",
            "label": "managed identity + private endpoint"
          },
          {
            "from": "app",
            "to": "storage",
            "label": "managed identity + private endpoint"
          },
          {
            "from": "observability",
            "to": "app",
            "label": "metrics, logs, traces"
          }
        ]
      },
      "technical_explanation": [
        "Das VNet wird in Ingress-, App-Integration- und Private-Endpoint-Subnets segmentiert; NSGs erlauben nur notwendige Pfade, UDRs steuern kontrollierten Egress und Private DNS löst PaaS-Namen auf private IP-Adressen auf.",
        "Microsoft Entra ID authentifiziert Benutzer; Managed Identity authentifiziert die Anwendung gegenüber SQL und Storage; RBAC und Least Privilege begrenzen Management- und Datenaktionen.",
        "Azure Monitor sammelt Plattformmetriken und Ressourcenlogs, Application Insights instrumentiert den Anwendungsfluss, Log Analytics korreliert Daten und Alerts verbinden Zustände mit Action Groups und Runbooks."
      ],
      "architecture_decisions": [
        {
          "question": "Front Door oder regionaler Einstieg?",
          "decision": "Front Door bei globalen Nutzern, Edge-WAF und regionsübergreifendem Routing; Application Gateway direkt bei regionaler Architektur und tiefem VNet-Bezug.",
          "tradeoff": "Eine zusätzliche Edge-Schicht verbessert globale Resilienz, erhöht aber Kosten und Routingkomplexität."
        },
        {
          "question": "App Service, VM oder AKS?",
          "decision": "App Service als Standard für Web-PaaS, VM für nicht abstrahierbare Betriebssystemanforderungen, AKS für eine bewusst betriebene Kubernetes-Plattform.",
          "tradeoff": "Mehr Kontrolle verschiebt Patching, Skalierung und Plattformbetrieb zum Kunden."
        },
        {
          "question": "Öffentliche oder private PaaS-Endpunkte?",
          "decision": "SQL und Storage privat anbinden und öffentliche Datenpfade deaktivieren, wenn Enterprise-Isolation gefordert ist.",
          "tradeoff": "Private Endpoints erhöhen DNS-, Netzwerk- und Deployment-Aufwand."
        }
      ],
      "security_considerations": [
        "WAF schützt Layer 7, DDoS Protection den öffentlichen Netzwerkendpunkt und Azure Firewall kontrolliert zentralen Egress.",
        "Managed Identity vermeidet statische Secrets; RBAC, Least Privilege und Policy schützen die Steuerungsebene.",
        "Defender for Cloud bewertet Posture und Workload-Risiken; Verschlüsselung schützt Transport und gespeicherte Daten."
      ],
      "monitoring_considerations": [
        "App-, Runtime- und Plattformtelemetrie getrennt erfassen und über Korrelations-IDs verbinden.",
        "Alerts nur mit Owner, Severity, Runbook und Geschäftsbezug aktivieren.",
        "WAF-, Application-Gateway-, App-Service-, SQL- und Storage-Logs in einem bewusst gestalteten Workspace-Modell zusammenführen."
      ],
      "reliability_considerations": [
        "Ingress und Compute zonenredundant mit ausreichender Mindestkapazität bereitstellen.",
        "Health Checks müssen kritische Flows abbilden und dürfen nicht nur Prozess-Liveness prüfen.",
        "SQL- und Storage-Redundanz, Backups und ein getesteter DR-Pfad folgen SLO, RPO und RTO."
      ],
      "cost_considerations": [
        "Front Door, WAF, Application Gateway, Firewall, Private Endpoints und Log-Ingestion sind eigenständige Kostenblöcke.",
        "PaaS reduziert Betriebsaufwand, nicht automatisch Gesamtkosten; Logvolumen, Retention und Compute-Mindestinstanzen aktiv steuern."
      ],
      "common_mistakes": [
        "Front Door, Application Gateway und Load Balancer ohne klare Layer- und Routingaufgabe stapeln.",
        "Private Endpoints konfigurieren, aber Public Access oder Private DNS falsch belassen.",
        "Managed Identity anlegen, jedoch überbreite RBAC-Rollen vergeben.",
        "Nur Infrastrukturmetriken beobachten und den Benutzerfluss nicht instrumentieren."
      ],
      "enterprise_example": "Ein europaweit genutztes Kundenportal verwendet Front Door als globalen Einstieg, WAF und Application Gateway vor einem zonenredundanten App Service. SQL Database und Storage sind ausschließlich über Private Endpoints erreichbar; Managed Identity, Policy, Defender und ein gemeinsames Observability-Modell verbinden Security und Betrieb.",
      "operations_model": {
        "platform_team": "VNet, Ingress, Policy, zentrale Logs und Baselines",
        "application_team": "Code, App Service, Instrumentierung, SLO und Runbooks",
        "security_team": "WAF/Defender-Regeln, Findings und Ausnahmen",
        "shared": "Incident Response, Kapazitäts- und DR-Tests"
      },
      "learning_path": [
        "azure-0562",
        "azure-0863",
        "azure-0519",
        "azure-0442",
        "azure-0881",
        "azure-0351",
        "azure-0947",
        "azure-0731",
        "azure-0579",
        "azure-0983",
        "azure-0987",
        "azure-0984"
      ],
      "merksatz": "Ein sicherer Webpfad verbindet kontrollierten Einstieg, private Abhängigkeiten, identitätsbasierten Zugriff und messbaren Betrieb.",
      "relationships": [
        {
          "id": "scenario-rel-web-001",
          "source": "scenario-secure-web-application",
          "target": "azure-0562",
          "type": "uses",
          "inverse_type": "used_by",
          "explanation": "Das Szenario verwendet Front Door optional als globalen Entry Point.",
          "sources": [
            "ms-front-door",
            "ms-ref-webapp-baseline"
          ],
          "confidence": 0.97,
          "status": "accepted"
        },
        {
          "id": "scenario-rel-web-002",
          "source": "scenario-secure-web-application",
          "target": "azure-0863",
          "type": "secured_by",
          "inverse_type": "secures",
          "explanation": "WAF schützt den öffentlichen Webpfad vor verbreiteten Layer-7-Angriffen.",
          "sources": [
            "ms-waf",
            "ms-ref-webapp-baseline"
          ],
          "confidence": 0.99,
          "status": "accepted"
        },
        {
          "id": "scenario-rel-web-003",
          "source": "scenario-secure-web-application",
          "target": "azure-0519",
          "type": "uses",
          "inverse_type": "used_by",
          "explanation": "Application Gateway übernimmt regionales Layer-7-Routing und TLS/WAF-Integration.",
          "sources": [
            "ms-app-gateway",
            "ms-ref-webapp-baseline"
          ],
          "confidence": 0.99,
          "status": "accepted"
        },
        {
          "id": "scenario-rel-web-004",
          "source": "scenario-secure-web-application",
          "target": "azure-0351",
          "type": "uses",
          "inverse_type": "used_by",
          "explanation": "App Service ist die primäre PaaS-Compute-Variante des Referenzszenarios.",
          "sources": [
            "ms-ref-webapp-baseline"
          ],
          "confidence": 0.99,
          "status": "accepted"
        },
        {
          "id": "scenario-rel-web-005",
          "source": "scenario-secure-web-application",
          "target": "azure-0442",
          "type": "depends_on",
          "inverse_type": "depended_on_by",
          "explanation": "Private Segmentierung und PaaS-Zugriff hängen von einer geplanten VNet-Architektur ab.",
          "sources": [
            "ms-ref-webapp-baseline"
          ],
          "confidence": 0.99,
          "status": "accepted"
        },
        {
          "id": "scenario-rel-web-006",
          "source": "scenario-secure-web-application",
          "target": "azure-0881",
          "type": "uses",
          "inverse_type": "used_by",
          "explanation": "Private Endpoints halten App-, SQL- und Storage-Datenpfade im privaten Netzwerk.",
          "sources": [
            "ms-ref-webapp-baseline",
            "ms-private-link"
          ],
          "confidence": 0.99,
          "status": "accepted"
        },
        {
          "id": "scenario-rel-web-007",
          "source": "scenario-secure-web-application",
          "target": "azure-0947",
          "type": "secured_by",
          "inverse_type": "secures",
          "explanation": "Managed Identity ermöglicht credentiallosen Zugriff der Anwendung auf abhängige Dienste.",
          "sources": [
            "ms-ref-webapp-baseline",
            "ms-managed-identities"
          ],
          "confidence": 0.99,
          "status": "accepted"
        },
        {
          "id": "scenario-rel-web-008",
          "source": "scenario-secure-web-application",
          "target": "azure-0731",
          "type": "uses",
          "inverse_type": "used_by",
          "explanation": "Azure SQL Database bildet die relationale Datenebene.",
          "sources": [
            "ms-ref-webapp-baseline"
          ],
          "confidence": 0.99,
          "status": "accepted"
        },
        {
          "id": "scenario-rel-web-009",
          "source": "scenario-secure-web-application",
          "target": "azure-0579",
          "type": "uses",
          "inverse_type": "used_by",
          "explanation": "Storage Account lagert Objekte und Dateien aus der Compute-Schicht aus.",
          "sources": [
            "ms-ref-webapp-baseline"
          ],
          "confidence": 0.98,
          "status": "accepted"
        },
        {
          "id": "scenario-rel-web-010",
          "source": "scenario-secure-web-application",
          "target": "azure-0983",
          "type": "monitored_by",
          "inverse_type": "monitors",
          "explanation": "Azure Monitor sammelt und korreliert Plattform- und Ressourcensignale.",
          "sources": [
            "ms-ref-webapp-baseline",
            "ms-azure-monitor-overview"
          ],
          "confidence": 0.99,
          "status": "accepted"
        },
        {
          "id": "scenario-rel-web-011",
          "source": "scenario-secure-web-application",
          "target": "azure-0987",
          "type": "monitored_by",
          "inverse_type": "monitors",
          "explanation": "Application Insights verfolgt Requests, Fehler und Abhängigkeiten der Webanwendung.",
          "sources": [
            "ms-ref-webapp-baseline",
            "ms-application-insights"
          ],
          "confidence": 0.99,
          "status": "accepted"
        },
        {
          "id": "scenario-rel-web-012",
          "source": "scenario-secure-web-application",
          "target": "azure-0962",
          "type": "governed_by",
          "inverse_type": "governs",
          "explanation": "Azure Policy hält Netzwerk-, Security- und Monitoring-Baselines prüfbar.",
          "sources": [
            "ms-ref-webapp-baseline",
            "ms-policy-overview"
          ],
          "confidence": 0.99,
          "status": "accepted"
        }
      ],
      "sources": [
        "ms-ref-webapp-baseline",
        "ms-front-door",
        "ms-waf",
        "ms-app-gateway",
        "ms-azure-monitor-overview"
      ],
      "status": "published"
    },
    {
      "id": "scenario-enterprise-hub-spoke",
      "title": "Enterprise Hub-Spoke Architecture",
      "short_description": "Eine skalierbare Netzwerktopologie, in der ein Hub gemeinsame Konnektivitäts- und Security-Dienste bereitstellt und Spokes Workloads nach Umgebung, Team oder Schutzbedarf isolieren.",
      "architecture_goal": "Zentrale Kontrolle über Hybridkonnektivität, Egress, DNS, Security und Logging schaffen, ohne die technische und organisatorische Isolation der Workloads aufzugeben.",
      "actors": [
        {
          "id": "actor-platform-network-team",
          "label": "Platform Network Team",
          "type": "organizational_actor"
        },
        {
          "id": "actor-workload-teams",
          "label": "Workload Teams",
          "type": "organizational_actor"
        },
        {
          "id": "actor-onprem-network",
          "label": "On-Premises Network",
          "type": "external_actor"
        }
      ],
      "architecture_flow": [
        {
          "order": 1,
          "from": "On-Premises Network",
          "to": "Hub Connectivity",
          "node_refs": [
            "azure-0478",
            "azure-0462"
          ],
          "explanation": "ExpressRoute ist die private, leistungsorientierte Option; VPN Gateway eignet sich als verschlüsselter Internetpfad, Einstieg oder Backup."
        },
        {
          "order": 2,
          "from": "Hub Connectivity",
          "to": "Hub VNet",
          "node_refs": [
            "azure-0442"
          ],
          "explanation": "Der Hub ist eine Rolle eines VNet und hostet gemeinsame Gateways, Firewall und DNS-Dienste."
        },
        {
          "order": 3,
          "from": "Hub VNet",
          "to": "Spoke VNets",
          "node_refs": [
            "azure-0887",
            "azure-0442"
          ],
          "explanation": "VNet Peering verbindet Hub und Spokes; UDRs erzwingen bei Bedarf Inspection über die zentrale Firewall."
        },
        {
          "order": 4,
          "from": "Spoke VNets",
          "to": "Workloads",
          "node_refs": [
            "azure-0453",
            "azure-0864"
          ],
          "explanation": "Subnets und NSGs segmentieren Workloads innerhalb jedes Spokes."
        }
      ],
      "component_instances": [
        {
          "instance_id": "hub-vnet",
          "role": "shared_connectivity_hub",
          "node_ref": "azure-0442",
          "requirement": "required"
        },
        {
          "instance_id": "spoke-prod",
          "role": "production_spoke",
          "node_ref": "azure-0442",
          "requirement": "required"
        },
        {
          "instance_id": "spoke-nonprod",
          "role": "nonproduction_spoke",
          "node_ref": "azure-0442",
          "requirement": "required"
        },
        {
          "instance_id": "peering",
          "role": "hub_spoke_connection",
          "node_ref": "azure-0887",
          "requirement": "required"
        },
        {
          "instance_id": "firewall",
          "role": "central_traffic_inspection",
          "node_ref": "azure-0841",
          "requirement": "required"
        },
        {
          "instance_id": "hybrid-gateway",
          "role": "cross_premises_connectivity",
          "node_ref": "azure-0478",
          "alternatives": [
            "azure-0462"
          ],
          "requirement": "conditional"
        },
        {
          "instance_id": "routing",
          "role": "forced_tunneling",
          "node_ref": "azure-0871",
          "requirement": "required"
        },
        {
          "instance_id": "dns",
          "role": "shared_private_name_resolution",
          "node_ref": "azure-0558",
          "requirement": "required"
        },
        {
          "instance_id": "logging",
          "role": "central_log_analytics",
          "node_ref": "azure-0985",
          "requirement": "required"
        }
      ],
      "diagram": {
        "layout": "hub_and_spoke",
        "nodes": [
          "actor-onprem-network",
          "hybrid-gateway",
          "hub-vnet",
          "firewall",
          "dns",
          "peering",
          "spoke-prod",
          "spoke-nonprod",
          "logging"
        ],
        "edges": [
          {
            "from": "actor-onprem-network",
            "to": "hybrid-gateway",
            "label": "ExpressRoute or VPN"
          },
          {
            "from": "hybrid-gateway",
            "to": "hub-vnet",
            "label": "gateway transit"
          },
          {
            "from": "hub-vnet",
            "to": "spoke-prod",
            "label": "peering + UDR"
          },
          {
            "from": "hub-vnet",
            "to": "spoke-nonprod",
            "label": "peering + UDR"
          },
          {
            "from": "spoke-prod",
            "to": "firewall",
            "label": "controlled egress"
          },
          {
            "from": "spoke-nonprod",
            "to": "firewall",
            "label": "controlled egress"
          },
          {
            "from": "logging",
            "to": "hub-vnet",
            "label": "diagnostics"
          }
        ]
      },
      "technical_explanation": [
        "VNet Peering ist nicht transitiv; gewünschter Spoke-zu-Spoke- oder On-Premises-Verkehr benötigt korrekte Gateway-Transit-, UDR- und Firewallkonfiguration.",
        "Private DNS wird gemeinsam geplant, damit Private Endpoints in Spokes und On-Premises konsistent aufgelöst werden.",
        "Diagnostikeinstellungen senden zentrale Netzwerk- und Security-Logs an Log Analytics, während Workloadteams ihre anwendungsspezifische Telemetrie verantworten."
      ],
      "architecture_decisions": [
        {
          "question": "Customer-managed Hub oder Virtual WAN?",
          "decision": "Klassischer Hub bei hoher Topologiekontrolle und überschaubarer Skalierung; Virtual WAN bei vielen Regionen, Branches und gewünschtem Managed Routing.",
          "tradeoff": "Mehr Eigenkontrolle bedeutet mehr UDR-, Peering- und Betriebsverantwortung."
        },
        {
          "question": "Zentrale oder dezentrale Security?",
          "decision": "Zentrale Firewall für gemeinsame Transit- und Egress-Regeln, NSGs für workloadnahe Segmentierung.",
          "tradeoff": "Nur zentral erzeugt großen Blast Radius; nur dezentral erhöht Regelwildwuchs."
        },
        {
          "question": "ExpressRoute oder VPN?",
          "decision": "ExpressRoute für planbare private Konnektivität und hohe Anforderungen; VPN für schnellere Bereitstellung, geringere Kosten oder Resilienzpfad.",
          "tradeoff": "ExpressRoute benötigt Provider-, Circuit- und Gatewaydesign; VPN hängt vom Internetpfad ab."
        }
      ],
      "security_considerations": [
        "Azure Firewall prüft zentralen Transit und Egress, NSGs begrenzen lokale Ost-West-Pfade.",
        "Private Endpoints reduzieren öffentliche PaaS-Angriffsfläche, benötigen aber zentrale DNS-Governance.",
        "Policy und Management Groups erzwingen Baselines über Connectivity- und Workload-Subscriptions."
      ],
      "monitoring_considerations": [
        "Firewall-, Gateway-, Peering-, DNS- und Route-Signale zentral erfassen.",
        "Plattformlogs und Workloadlogs logisch trennen, aber für Incidents korrelierbar halten.",
        "Kapazität und SNAT-Port-Nutzung der zentralen Komponenten überwachen."
      ],
      "reliability_considerations": [
        "Der Hub ist regional; bei Multi-Region pro Region einen passenden Hub und Inter-Hub-Pfad planen.",
        "Gateway und Firewall zonenredundant bereitstellen, wo unterstützt.",
        "ExpressRoute und VPN können bewusst getrennte Konnektivitätspfade bilden, ersetzen aber keine End-to-End-Tests."
      ],
      "cost_considerations": [
        "Zentrale Firewall, Gateways, ExpressRoute, Log-Ingestion und Peering-Datentransfer dominieren häufig die Plattformkosten.",
        "Geteilte Dienste sparen Duplikate, können aber interne Kostenallokation und Skalierungsgrenzen erfordern."
      ],
      "common_mistakes": [
        "VNet Peering fälschlich als transitiv annehmen.",
        "Überlappende IP-Adressräume vergeben.",
        "UDRs konfigurieren, ohne Rückweg und asymmetrisches Routing zu prüfen.",
        "Zentrale Logs sammeln, aber Ownership und Retention nicht definieren."
      ],
      "enterprise_example": "Ein Konzern betreibt pro Azure-Region einen Connectivity-Hub mit ExpressRoute, VPN-Backup, Azure Firewall und Private DNS. Produktions- und Nichtproduktionsspokes liegen in getrennten Subscriptions; Plattformteams verantworten Transit und Baselines, Workloadteams ihre Spoke-Ressourcen.",
      "operations_model": {
        "platform_team": "Hub, Gateways, Firewall, DNS, Peering und zentrale Diagnostik",
        "workload_teams": "Spoke-Adressierung, lokale NSGs, Private Endpoints und App-Telemetrie",
        "security_team": "zentrale Policies, Firewall-Baselines und Findings",
        "shared": "Routingänderungen, Incident Response und Kapazitätsplanung"
      },
      "learning_path": [
        "azure-0442",
        "azure-0453",
        "azure-0887",
        "azure-0871",
        "azure-0841",
        "azure-0478",
        "azure-0462",
        "azure-0558",
        "azure-0985",
        "azure-0962",
        "azure-1022"
      ],
      "merksatz": "Der Hub zentralisiert gemeinsame Kontrolle; Spokes bewahren Workload-Isolation und Verantwortung.",
      "relationships": [
        {
          "id": "scenario-rel-hub-001",
          "source": "scenario-enterprise-hub-spoke",
          "target": "azure-0442",
          "type": "uses",
          "inverse_type": "used_by",
          "explanation": "Hub und Spokes sind getrennte Rollen vorhandener Azure VNets.",
          "sources": [
            "ms-ref-hub-spoke"
          ],
          "confidence": 0.99,
          "status": "accepted"
        },
        {
          "id": "scenario-rel-hub-002",
          "source": "scenario-enterprise-hub-spoke",
          "target": "azure-0887",
          "type": "depends_on",
          "inverse_type": "depended_on_by",
          "explanation": "Hub und Spokes benötigen VNet Peering oder eine verwaltete Hub-Verbindung.",
          "sources": [
            "ms-ref-hub-spoke"
          ],
          "confidence": 0.99,
          "status": "accepted"
        },
        {
          "id": "scenario-rel-hub-003",
          "source": "scenario-enterprise-hub-spoke",
          "target": "azure-0841",
          "type": "secured_by",
          "inverse_type": "secures",
          "explanation": "Azure Firewall kontrolliert zentrale Transit- und Egress-Pfade.",
          "sources": [
            "ms-ref-hub-spoke",
            "ms-firewall"
          ],
          "confidence": 0.99,
          "status": "accepted"
        },
        {
          "id": "scenario-rel-hub-004",
          "source": "scenario-enterprise-hub-spoke",
          "target": "azure-0871",
          "type": "uses",
          "inverse_type": "used_by",
          "explanation": "UDRs lenken ausgewählte Spoke-Pfade durch die zentrale Inspection.",
          "sources": [
            "ms-ref-hub-spoke"
          ],
          "confidence": 0.99,
          "status": "accepted"
        },
        {
          "id": "scenario-rel-hub-005",
          "source": "scenario-enterprise-hub-spoke",
          "target": "azure-0478",
          "type": "uses",
          "inverse_type": "used_by",
          "explanation": "ExpressRoute ist die private Enterprise-Konnektivitätsoption zum Hub.",
          "sources": [
            "ms-ref-hub-spoke",
            "ms-expressroute"
          ],
          "confidence": 0.99,
          "status": "accepted"
        },
        {
          "id": "scenario-rel-hub-006",
          "source": "scenario-enterprise-hub-spoke",
          "target": "azure-0462",
          "type": "uses",
          "inverse_type": "used_by",
          "explanation": "VPN Gateway dient als alternative oder ergänzende Hybridverbindung.",
          "sources": [
            "ms-ref-hub-spoke",
            "ms-vpn-gateway"
          ],
          "confidence": 0.99,
          "status": "accepted"
        },
        {
          "id": "scenario-rel-hub-007",
          "source": "scenario-enterprise-hub-spoke",
          "target": "azure-0558",
          "type": "depends_on",
          "inverse_type": "depended_on_by",
          "explanation": "Private Konnektivität benötigt konsistente private DNS-Auflösung über Hub, Spokes und On-Premises.",
          "sources": [
            "ms-ref-hub-spoke"
          ],
          "confidence": 0.98,
          "status": "accepted"
        },
        {
          "id": "scenario-rel-hub-008",
          "source": "scenario-enterprise-hub-spoke",
          "target": "azure-0985",
          "type": "monitored_by",
          "inverse_type": "monitors",
          "explanation": "Log Analytics bildet die zentrale Analyseebene für Netzwerk- und Security-Logs.",
          "sources": [
            "ms-ref-hub-spoke",
            "ms-log-analytics"
          ],
          "confidence": 0.99,
          "status": "accepted"
        },
        {
          "id": "scenario-rel-hub-009",
          "source": "scenario-enterprise-hub-spoke",
          "target": "azure-0962",
          "type": "governed_by",
          "inverse_type": "governs",
          "explanation": "Policy erzwingt Topologie-, Security- und Monitoring-Baselines.",
          "sources": [
            "ms-ref-hub-spoke",
            "ms-policy-overview"
          ],
          "confidence": 0.99,
          "status": "accepted"
        },
        {
          "id": "scenario-rel-hub-010",
          "source": "scenario-enterprise-hub-spoke",
          "target": "azure-1022",
          "type": "governed_by",
          "inverse_type": "governs",
          "explanation": "Management Groups organisieren Plattform- und Workload-Subscriptions für vererbte Governance.",
          "sources": [
            "ms-ref-landing-zone-design"
          ],
          "confidence": 0.98,
          "status": "accepted"
        }
      ],
      "sources": [
        "ms-ref-hub-spoke",
        "ms-ref-landing-zone-design",
        "ms-expressroute",
        "ms-vpn-gateway",
        "ms-firewall"
      ],
      "status": "published"
    },
    {
      "id": "scenario-hybrid-cloud",
      "title": "Hybrid Cloud Architecture",
      "short_description": "Ein kontrolliertes Betriebsmodell, in dem ein On-Premises-Rechenzentrum und Azure während Migration oder dauerhaft verbunden bleiben.",
      "architecture_goal": "Netzwerk, DNS, Identität, Security und Monitoring über beide Umgebungen konsistent gestalten, ohne kritische Abhängigkeiten oder Ausfallpfade zu verdecken.",
      "actors": [
        {
          "id": "actor-onprem-datacenter",
          "label": "On-Premises Datacenter",
          "type": "external_actor"
        },
        {
          "id": "actor-cloud-platform-team",
          "label": "Cloud Platform Team",
          "type": "organizational_actor"
        },
        {
          "id": "actor-enterprise-users",
          "label": "Enterprise Users",
          "type": "external_actor"
        }
      ],
      "architecture_flow": [
        {
          "order": 1,
          "from": "On-Premises Datacenter",
          "to": "Hybrid Connectivity",
          "node_refs": [
            "azure-0462",
            "azure-0478"
          ],
          "explanation": "VPN oder ExpressRoute verbindet lokale Netze mit dem Azure VNet."
        },
        {
          "order": 2,
          "from": "Hybrid Connectivity",
          "to": "Azure Network",
          "node_refs": [
            "azure-0442",
            "azure-0461"
          ],
          "explanation": "Gateway, Routing und nicht überlappende IP-Adressräume bilden den Netzpfad."
        },
        {
          "order": 3,
          "from": "Enterprise Identity",
          "to": "Microsoft Entra ID",
          "node_refs": [
            "azure-0904"
          ],
          "explanation": "Hybrid Identity stellt konsistente Benutzeridentitäten bereit; die konkrete Synchronisationsmethode bleibt eine separate Architekturentscheidung."
        },
        {
          "order": 4,
          "from": "Existing Workloads",
          "to": "Azure Assessment and Migration",
          "node_refs": [
            "azure-0645"
          ],
          "explanation": "Azure Migrate inventarisiert, bewertet und gruppiert abhängige Workloads vor Migrationswellen."
        },
        {
          "order": 5,
          "from": "Both Environments",
          "to": "Unified Operations",
          "node_refs": [
            "azure-0983",
            "azure-0985"
          ],
          "explanation": "Azure Monitor und Log Analytics korrelieren Cloud- und Hybridtelemetrie."
        }
      ],
      "component_instances": [
        {
          "instance_id": "onprem",
          "role": "source_and_remaining_estate",
          "external_actor_ref": "actor-onprem-datacenter",
          "requirement": "required"
        },
        {
          "instance_id": "vpn",
          "role": "encrypted_connectivity",
          "node_ref": "azure-0462",
          "requirement": "alternative"
        },
        {
          "instance_id": "expressroute",
          "role": "private_connectivity",
          "node_ref": "azure-0478",
          "requirement": "alternative"
        },
        {
          "instance_id": "azure-network",
          "role": "cloud_network",
          "node_ref": "azure-0442",
          "requirement": "required"
        },
        {
          "instance_id": "hybrid-dns",
          "role": "cross_environment_name_resolution",
          "node_ref": "azure-0558",
          "requirement": "required"
        },
        {
          "instance_id": "hybrid-identity",
          "role": "common_identity_plane",
          "node_ref": "azure-0904",
          "requirement": "required"
        },
        {
          "instance_id": "migration",
          "role": "discovery_assessment_migration",
          "node_ref": "azure-0645",
          "requirement": "conditional"
        },
        {
          "instance_id": "hybrid-monitor",
          "role": "unified_monitoring",
          "node_ref": "azure-0983",
          "requirement": "required"
        }
      ],
      "diagram": {
        "layout": "two_estates_with_shared_planes",
        "nodes": [
          "onprem",
          "vpn",
          "expressroute",
          "azure-network",
          "hybrid-dns",
          "hybrid-identity",
          "migration",
          "hybrid-monitor"
        ],
        "edges": [
          {
            "from": "onprem",
            "to": "vpn",
            "label": "IPsec option"
          },
          {
            "from": "onprem",
            "to": "expressroute",
            "label": "private circuit option"
          },
          {
            "from": "vpn",
            "to": "azure-network",
            "label": "routed connectivity"
          },
          {
            "from": "expressroute",
            "to": "azure-network",
            "label": "routed connectivity"
          },
          {
            "from": "hybrid-dns",
            "to": "onprem",
            "label": "resolve"
          },
          {
            "from": "hybrid-dns",
            "to": "azure-network",
            "label": "resolve"
          },
          {
            "from": "migration",
            "to": "azure-network",
            "label": "migration waves"
          },
          {
            "from": "hybrid-monitor",
            "to": "onprem",
            "label": "hybrid telemetry"
          }
        ]
      },
      "technical_explanation": [
        "BGP, Gateways, Routen und IP-Adressplanung bestimmen die Erreichbarkeit; DNS-Forwarding und Private DNS müssen private Endpunkte in beiden Richtungen korrekt auflösen.",
        "Hybrid Identity kann Verzeichnisobjekte synchronisieren, doch Authentifizierungsabhängigkeit und Resilienz unterscheiden sich je Verfahren.",
        "Azure Migrate nutzt Discovery, Assessment und Dependency Analysis, bevor Workloads in koordinierte Waves überführt werden."
      ],
      "architecture_decisions": [
        {
          "question": "VPN oder ExpressRoute?",
          "decision": "VPN für schnelle, verschlüsselte Internetkonnektivität; ExpressRoute für private, planbare Enterprise-Verbindungen; bei Kritikalität getrennte Pfade kombinieren.",
          "tradeoff": "Zusätzliche Pfade erhöhen Resilienz und gleichzeitig Routing- und Testkomplexität."
        },
        {
          "question": "Cloud- oder On-Premises-Abhängigkeit der Authentifizierung?",
          "decision": "Die Hybrid-Identity-Methode so wählen, dass erforderliche lokale Komponenten und deren Ausfallverhalten bekannt sind.",
          "tradeoff": "Starke lokale Abhängigkeit kann Cloudzugriff bei Standortausfall beeinträchtigen."
        },
        {
          "question": "Temporär oder dauerhaft hybrid?",
          "decision": "Für jede Verbindung und jeden gemeinsamen Dienst Zielzustand, Owner und Exit-Kriterium festlegen.",
          "tradeoff": "Unbefristeter Hybridbetrieb verdoppelt häufig Betriebs- und Security-Komplexität."
        }
      ],
      "security_considerations": [
        "Vertrauensgrenzen zwischen On-Premises und Azure explizit segmentieren; Hybridverbindung ist kein implizit vertrauenswürdiges LAN.",
        "Identity, RBAC und Conditional Access für Cloudzugriffe standardisieren.",
        "Defender und zentrale Logs zur gemeinsamen Security-Posture- und Incident-Sicht nutzen."
      ],
      "monitoring_considerations": [
        "Konnektivität, Gatewayzustand, DNS, Identity-Synchronisation, Migrationsjobs und Workload-Health gemeinsam überwachen.",
        "Logs beider Umgebungen zeitlich und semantisch korrelierbar machen.",
        "End-to-End-Synthetics über den Hybridpfad ergänzen, nicht nur einzelne Geräte überwachen."
      ],
      "reliability_considerations": [
        "Internet, Provider, Circuit, Gateway, DNS und lokale Identitätskomponenten sind getrennte Fehlerdomänen.",
        "Backup- und DR-Pläne müssen beide Umgebungen und die Wiederanlaufreihenfolge enthalten.",
        "Failoverpfade regelmäßig testen und asymmetrisches Routing ausschließen."
      ],
      "cost_considerations": [
        "ExpressRoute-Port, Provider, Gateways, Firewall, Egress und doppelte Betriebswerkzeuge berücksichtigen.",
        "Lange Parallelbetriebsphasen erhöhen Lizenz-, Personal- und Infrastrukturkosten."
      ],
      "common_mistakes": [
        "Überlappende Adressräume erst während der Migration entdecken.",
        "Private Endpoints ohne hybrides DNS-Konzept einsetzen.",
        "Cloudauthentifizierung unnötig an einen einzelnen On-Premises-Dienst koppeln.",
        "Abhängige Server getrennt migrieren und dadurch stille Ausfälle verursachen."
      ],
      "enterprise_example": "Ein Produktionsunternehmen verbindet zwei Werke zunächst per VPN und später per ExpressRoute mit einem Azure-Hub. Entra Hybrid Identity, zentraler DNS-Forwarding-Pfad, Azure Migrate Dependency Analysis und gemeinsame Monitor-Workspaces ermöglichen gestaffelte Migrationswellen bei fortbestehendem Fabrikbetrieb.",
      "operations_model": {
        "network_team": "Circuits, VPN, BGP, Routing und DNS",
        "identity_team": "Hybrid Identity, Synchronisation und Authentifizierungsresilienz",
        "migration_factory": "Discovery, Waves, Tests und Cutover",
        "operations": "gemeinsame Telemetrie, Incident und Capacity",
        "security": "Trust Boundaries, Baselines und Findings"
      },
      "learning_path": [
        "azure-0178",
        "azure-0462",
        "azure-0478",
        "azure-0442",
        "azure-0558",
        "azure-0904",
        "azure-0645",
        "azure-0933",
        "azure-0983",
        "azure-0985"
      ],
      "merksatz": "Hybrid ist ein bewusst betriebenes Zusammenspiel zweier Umgebungen, kein dauerhaftes Provisorium ohne Zielbild.",
      "relationships": [
        {
          "id": "scenario-rel-hybrid-001",
          "source": "scenario-hybrid-cloud",
          "target": "azure-0178",
          "type": "depends_on",
          "inverse_type": "depended_on_by",
          "explanation": "Das Szenario basiert auf einem expliziten Hybrid-Cloud-Zielbild für lokale und Azure-Ressourcen.",
          "sources": [
            "ms-ref-hybrid-networking"
          ],
          "confidence": 0.98,
          "status": "accepted"
        },
        {
          "id": "scenario-rel-hybrid-002",
          "source": "scenario-hybrid-cloud",
          "target": "azure-0462",
          "type": "uses",
          "inverse_type": "used_by",
          "explanation": "VPN Gateway stellt eine verschlüsselte Hybridverbindung bereit.",
          "sources": [
            "ms-ref-hybrid-networking",
            "ms-vpn-gateway"
          ],
          "confidence": 0.99,
          "status": "accepted"
        },
        {
          "id": "scenario-rel-hybrid-003",
          "source": "scenario-hybrid-cloud",
          "target": "azure-0478",
          "type": "uses",
          "inverse_type": "used_by",
          "explanation": "ExpressRoute stellt die private Hybridkonnektivitätsoption bereit.",
          "sources": [
            "ms-ref-hybrid-networking",
            "ms-expressroute"
          ],
          "confidence": 0.99,
          "status": "accepted"
        },
        {
          "id": "scenario-rel-hybrid-004",
          "source": "scenario-hybrid-cloud",
          "target": "azure-0558",
          "type": "depends_on",
          "inverse_type": "depended_on_by",
          "explanation": "Private Azure-Dienste benötigen eine konsistente hybride DNS-Auflösung.",
          "sources": [
            "ms-ref-hybrid-networking"
          ],
          "confidence": 0.98,
          "status": "accepted"
        },
        {
          "id": "scenario-rel-hybrid-005",
          "source": "scenario-hybrid-cloud",
          "target": "azure-0904",
          "type": "depends_on",
          "inverse_type": "depended_on_by",
          "explanation": "Microsoft Entra ID bildet die Cloud-Identity-Ebene des Hybridmodells.",
          "sources": [
            "ms-ref-hybrid-identity"
          ],
          "confidence": 0.99,
          "status": "accepted"
        },
        {
          "id": "scenario-rel-hybrid-006",
          "source": "scenario-hybrid-cloud",
          "target": "azure-0645",
          "type": "uses",
          "inverse_type": "used_by",
          "explanation": "Azure Migrate unterstützt Discovery, Assessment, Dependency Analysis und Migration bestehender Workloads.",
          "sources": [
            "ms-ref-migrate-workloads",
            "ms-ref-migrate-dependencies",
            "ms-azure-migrate"
          ],
          "confidence": 0.99,
          "status": "accepted"
        },
        {
          "id": "scenario-rel-hybrid-007",
          "source": "scenario-hybrid-cloud",
          "target": "azure-0933",
          "type": "secured_by",
          "inverse_type": "secures",
          "explanation": "Defender for Cloud ergänzt die Posture- und Workload-Sicht über hybride Ressourcen.",
          "sources": [
            "ms-defender-overview"
          ],
          "confidence": 0.96,
          "status": "accepted"
        },
        {
          "id": "scenario-rel-hybrid-008",
          "source": "scenario-hybrid-cloud",
          "target": "azure-0983",
          "type": "monitored_by",
          "inverse_type": "monitors",
          "explanation": "Azure Monitor verbindet Cloud- und Hybridtelemetrie in einem gemeinsamen Betriebsmodell.",
          "sources": [
            "ms-azure-monitor-overview"
          ],
          "confidence": 0.99,
          "status": "accepted"
        }
      ],
      "sources": [
        "ms-ref-hybrid-networking",
        "ms-ref-hybrid-identity",
        "ms-ref-migrate-workloads",
        "ms-ref-migrate-dependencies"
      ],
      "status": "published"
    },
    {
      "id": "scenario-highly-available-application",
      "title": "Highly Available Application Architecture",
      "short_description": "Eine Anwendung, die lokale Komponentenfehler über Zonen toleriert und für schwere Ausfälle einen getrennten Disaster-Recovery-Pfad besitzt.",
      "architecture_goal": "Ein geschäftlich festgelegtes SLO erreichen, RPO und RTO einhalten und Fehler über Health-Signale, Redundanz, Skalierung, Failover und Recovery kontrolliert behandeln.",
      "actors": [
        {
          "id": "actor-application-users",
          "label": "Application Users",
          "type": "external_actor"
        },
        {
          "id": "actor-sre-team",
          "label": "SRE / Operations Team",
          "type": "organizational_actor"
        },
        {
          "id": "actor-business-owner",
          "label": "Business Owner",
          "type": "organizational_actor"
        }
      ],
      "architecture_flow": [
        {
          "order": 1,
          "from": "Application Users",
          "to": "Global Routing",
          "node_refs": [
            "azure-0562",
            "azure-0560"
          ],
          "explanation": "Front Door oder Traffic Manager lenkt Traffic abhängig von Protokoll, Health und Regionsstrategie."
        },
        {
          "order": 2,
          "from": "Global Routing",
          "to": "Regional Load Balancing",
          "node_refs": [
            "azure-0505",
            "azure-0519"
          ],
          "explanation": "Regionale Load Balancer verteilen auf gesunde Instanzen."
        },
        {
          "order": 3,
          "from": "Regional Load Balancing",
          "to": "Zone-Redundant Compute",
          "node_refs": [
            "azure-0007",
            "azure-0387",
            "azure-0351"
          ],
          "explanation": "Compute wird über Zonen verteilt und mit Autoscale auf Last und Restkapazität angepasst."
        },
        {
          "order": 4,
          "from": "Primary Region",
          "to": "Recovery Region",
          "node_refs": [
            "azure-0254",
            "azure-0114",
            "azure-0118"
          ],
          "explanation": "Ein separater DR-Pfad schützt vor regionalen oder schweren Workload-Ausfällen."
        },
        {
          "order": 5,
          "from": "All Layers",
          "to": "Health and Recovery Signals",
          "node_refs": [
            "azure-0983",
            "azure-0984",
            "azure-0987"
          ],
          "explanation": "Monitoring validiert SLO, erkennt Degradation und unterstützt Failover- und Recovery-Entscheidungen."
        }
      ],
      "component_instances": [
        {
          "instance_id": "global-router",
          "role": "global_failover",
          "node_ref": "azure-0562",
          "alternatives": [
            "azure-0560"
          ],
          "requirement": "conditional"
        },
        {
          "instance_id": "regional-lb",
          "role": "health_based_distribution",
          "node_ref": "azure-0505",
          "alternatives": [
            "azure-0519"
          ],
          "requirement": "required"
        },
        {
          "instance_id": "zones",
          "role": "in_region_fault_domains",
          "node_ref": "azure-0007",
          "requirement": "required"
        },
        {
          "instance_id": "autoscale",
          "role": "capacity_adaptation",
          "node_ref": "azure-0025",
          "requirement": "required"
        },
        {
          "instance_id": "region-strategy",
          "role": "regional_recovery_scope",
          "node_ref": "azure-0254",
          "requirement": "conditional"
        },
        {
          "instance_id": "backup",
          "role": "independent_recovery_points",
          "node_ref": "azure-0116",
          "requirement": "required"
        },
        {
          "instance_id": "dr",
          "role": "disaster_recovery_process",
          "node_ref": "azure-0114",
          "requirement": "required"
        },
        {
          "instance_id": "monitor",
          "role": "health_model",
          "node_ref": "azure-0983",
          "requirement": "required"
        }
      ],
      "diagram": {
        "layout": "two_regions_with_zones",
        "nodes": [
          "actor-application-users",
          "global-router",
          "regional-lb",
          "zones",
          "autoscale",
          "region-strategy",
          "backup",
          "dr",
          "monitor"
        ],
        "edges": [
          {
            "from": "actor-application-users",
            "to": "global-router",
            "label": "request"
          },
          {
            "from": "global-router",
            "to": "regional-lb",
            "label": "healthy region"
          },
          {
            "from": "regional-lb",
            "to": "zones",
            "label": "healthy instance"
          },
          {
            "from": "autoscale",
            "to": "zones",
            "label": "capacity"
          },
          {
            "from": "zones",
            "to": "region-strategy",
            "label": "replication"
          },
          {
            "from": "dr",
            "to": "region-strategy",
            "label": "failover/failback"
          },
          {
            "from": "monitor",
            "to": "global-router",
            "label": "health signal"
          }
        ]
      },
      "technical_explanation": [
        "High Availability behandelt erwartete lokale Fehler durch Redundanz und automatische Umleitung; Disaster Recovery behandelt größere Ausfälle durch Wiederherstellung oder Regionsumschaltung.",
        "RPO begrenzt tolerierbaren Datenverlust, RTO die Wiederanlaufzeit; Replikation, Backup, DNS und Abhängigkeitsreihenfolge müssen dazu passen.",
        "Autoscale reagiert auf Last, ersetzt aber keine vorgehaltene Kapazität für Zonenfehler oder plötzliche Ereignisse."
      ],
      "architecture_decisions": [
        {
          "question": "Single-Region zonenredundant oder Multi-Region?",
          "decision": "Zonen für lokale Resilienz als Standard prüfen; Multi-Region nur bei begründetem regionalem Risiko und passendem RTO.",
          "tradeoff": "Multi-Region erhöht Kosten, Datenkonsistenz- und Betriebsaufwand deutlich."
        },
        {
          "question": "Active/Active, Active/Passive oder Restore?",
          "decision": "Nach RTO, RPO, Datenmodell und Traffic wählen.",
          "tradeoff": "Schnelleres Recovery benötigt mehr laufende Kapazität und komplexere Synchronisation."
        },
        {
          "question": "Automatischer oder manueller Failover?",
          "decision": "Nur bei eindeutigen Health-Signalen und sicherem Ziel automatisieren; datenrelevante oder mehrdeutige Ereignisse kontrolliert freigeben.",
          "tradeoff": "Automatik reduziert Zeit und kann bei falschem Signal den Incident vergrößern."
        }
      ],
      "security_considerations": [
        "DR-Ziel, Backups, Identitäten und Schlüssel mit demselben oder stärkerem Schutz wie Produktion betreiben.",
        "Failover darf Sicherheitsgrenzen und Private-Endpoint-/DNS-Regeln nicht umgehen.",
        "Recovery-Zugriffe per Least Privilege und getrennten Break-Glass-Prozessen schützen."
      ],
      "monitoring_considerations": [
        "SLIs aus kritischen Benutzerflüssen statt nur Host-Uptime bilden.",
        "Zonen-, Regions-, Dependency-, Capacity- und Replication-Signale korrelieren.",
        "Alerts mit Runbooks und klarer Failover-Entscheidung verbinden."
      ],
      "reliability_considerations": [
        "Fehlerdomänen, gemeinsame Abhängigkeiten und Restkapazität explizit modellieren.",
        "Backups und Restore, Failover und Failback regelmäßig getrennt testen.",
        "Region Pairs sind Kontext, aber kein automatischer DR-Mechanismus für jede Workload."
      ],
      "cost_considerations": [
        "Zonenredundanz, Mindestinstanzen, sekundäre Region, Replikation, Backup und Logvolumen verursachen dauerhafte Kosten.",
        "Das wirtschaftliche Design folgt Business Impact und Error Budget, nicht maximaler Verfügbarkeit."
      ],
      "common_mistakes": [
        "High Availability und Disaster Recovery gleichsetzen.",
        "Autoscale als sofort verfügbare Fehlerreserve behandeln.",
        "Region Pairing ohne service-spezifische Replikation und Runbook voraussetzen.",
        "Failover testen, aber Failback, Identität oder DNS vergessen."
      ],
      "enterprise_example": "Ein B2B-Portal läuft zonenredundant in der Primärregion, hält eine Warm-Standby-Anwendung und replizierte Daten in einer zweiten Region bereit und nutzt Front Door, synthetische Tests und einen freigegebenen Failover-Runbook. Quartalsweise werden RPO, RTO, Restore und Failback gemessen.",
      "operations_model": {
        "business_owner": "SLO, RPO, RTO und akzeptiertes Restrisiko",
        "application_team": "Health-Modell, zustandsarme App und Dependency-Verhalten",
        "platform_team": "Zonen, globales Routing, Backup und DR-Plattform",
        "operations": "Alerts, Failoverentscheidung, Kommunikation und Tests"
      },
      "learning_path": [
        "azure-1042",
        "azure-0007",
        "azure-0254",
        "azure-0505",
        "azure-0025",
        "azure-0107",
        "azure-0114",
        "azure-0116",
        "azure-0118",
        "azure-0983",
        "azure-0984"
      ],
      "merksatz": "HA hält lokale Fehler aus; DR stellt nach schweren Ausfällen wieder her – beide brauchen messbare Ziele und Tests.",
      "relationships": [
        {
          "id": "scenario-rel-ha-001",
          "source": "scenario-highly-available-application",
          "target": "azure-0007",
          "type": "uses",
          "inverse_type": "used_by",
          "explanation": "Availability Zones verteilen unterstützte Komponenten über getrennte Fehlerdomänen einer Region.",
          "sources": [
            "ms-zones-overview",
            "ms-bcdr-concepts"
          ],
          "confidence": 0.99,
          "status": "accepted"
        },
        {
          "id": "scenario-rel-ha-002",
          "source": "scenario-highly-available-application",
          "target": "azure-0254",
          "type": "depends_on",
          "inverse_type": "depended_on_by",
          "explanation": "Die Regionsstrategie berücksichtigt gepaarte und nicht gepaarte Regionen, ersetzt aber keine service-spezifische DR-Planung.",
          "sources": [
            "ms-regions-overview",
            "ms-bcdr-concepts"
          ],
          "confidence": 0.97,
          "status": "accepted"
        },
        {
          "id": "scenario-rel-ha-003",
          "source": "scenario-highly-available-application",
          "target": "azure-0505",
          "type": "uses",
          "inverse_type": "used_by",
          "explanation": "Load Balancing verteilt Traffic auf gesunde regionale Ziele.",
          "sources": [
            "ms-load-balancing"
          ],
          "confidence": 0.99,
          "status": "accepted"
        },
        {
          "id": "scenario-rel-ha-004",
          "source": "scenario-highly-available-application",
          "target": "azure-0025",
          "type": "uses",
          "inverse_type": "used_by",
          "explanation": "Autoscale passt Kapazität an beobachtete Lastsignale an.",
          "sources": [
            "ms-vmss-autoscale"
          ],
          "confidence": 0.99,
          "status": "accepted"
        },
        {
          "id": "scenario-rel-ha-005",
          "source": "scenario-highly-available-application",
          "target": "azure-0116",
          "type": "uses",
          "inverse_type": "used_by",
          "explanation": "Azure Backup stellt unabhängige Recovery Points für unterstützte VM-Szenarien bereit.",
          "sources": [
            "ms-vm-backup",
            "ms-backup-security"
          ],
          "confidence": 0.99,
          "status": "accepted"
        },
        {
          "id": "scenario-rel-ha-006",
          "source": "scenario-highly-available-application",
          "target": "azure-0114",
          "type": "depends_on",
          "inverse_type": "depended_on_by",
          "explanation": "Regionale Ausfallvorsorge benötigt einen vollständigen Disaster-Recovery-Prozess.",
          "sources": [
            "ms-bcdr-concepts",
            "ms-failover-failback"
          ],
          "confidence": 0.99,
          "status": "accepted"
        },
        {
          "id": "scenario-rel-ha-007",
          "source": "scenario-highly-available-application",
          "target": "azure-0118",
          "type": "uses",
          "inverse_type": "used_by",
          "explanation": "Site Recovery ist eine Option für VM-Replikation, Failover und Failback.",
          "sources": [
            "ms-site-recovery"
          ],
          "confidence": 0.99,
          "status": "accepted"
        },
        {
          "id": "scenario-rel-ha-008",
          "source": "scenario-highly-available-application",
          "target": "azure-0983",
          "type": "monitored_by",
          "inverse_type": "monitors",
          "explanation": "Azure Monitor liefert Health-, Capacity- und Recovery-Signale.",
          "sources": [
            "ms-azure-monitor-overview",
            "ms-reliability-targets"
          ],
          "confidence": 0.99,
          "status": "accepted"
        },
        {
          "id": "scenario-rel-ha-009",
          "source": "scenario-highly-available-application",
          "target": "azure-0984",
          "type": "monitored_by",
          "inverse_type": "monitors",
          "explanation": "Alerts übersetzen qualifizierte Health-Abweichungen in operative Reaktion.",
          "sources": [
            "ms-monitor-alerts",
            "ms-reliability-targets"
          ],
          "confidence": 0.99,
          "status": "accepted"
        },
        {
          "id": "scenario-rel-ha-010",
          "source": "scenario-highly-available-application",
          "target": "azure-1042",
          "type": "depends_on",
          "inverse_type": "depended_on_by",
          "explanation": "Die Architektur wird aus SLA-, SLO- und SLI-Zielen abgeleitet.",
          "sources": [
            "ms-reliability-targets",
            "ms-sla-concepts"
          ],
          "confidence": 0.99,
          "status": "accepted"
        }
      ],
      "sources": [
        "ms-bcdr-concepts",
        "ms-zones-overview",
        "ms-regions-overview",
        "ms-failover-failback",
        "ms-reliability-targets"
      ],
      "status": "published"
    },
    {
      "id": "scenario-cloud-migration",
      "title": "Cloud Migration Architecture",
      "short_description": "Ein kontrollierter Migrationspfad von einer bestehenden On-Premises-Anwendung über Assessment und Landing Zone bis zu Cutover, Validierung und Optimierung.",
      "architecture_goal": "Abhängigkeiten vollständig erfassen, eine sichere Zielplattform vorbereiten, Workloads in getesteten Wellen migrieren und danach Kosten, Reliability und Betriebsmodell verbessern.",
      "actors": [
        {
          "id": "actor-source-application",
          "label": "On-Premises Application",
          "type": "external_actor"
        },
        {
          "id": "actor-migration-factory",
          "label": "Migration Factory",
          "type": "organizational_actor"
        },
        {
          "id": "actor-platform-governance",
          "label": "Platform & Governance Teams",
          "type": "organizational_actor"
        },
        {
          "id": "actor-business-stakeholders",
          "label": "Business Stakeholders",
          "type": "organizational_actor"
        }
      ],
      "architecture_flow": [
        {
          "order": 1,
          "from": "On-Premises Application",
          "to": "Discovery and Assessment",
          "node_refs": [
            "azure-0645"
          ],
          "explanation": "Inventar, Performance, Readiness, Kosten und Abhängigkeiten werden vor der Zielentscheidung erfasst."
        },
        {
          "order": 2,
          "from": "Discovery and Assessment",
          "to": "Azure Landing Zone",
          "node_refs": [
            "azure-0054",
            "azure-1022",
            "azure-0962"
          ],
          "explanation": "Identity, Netzwerk, Subscription-Struktur, Security, Governance und Management werden vor dem Cutover bereitgestellt."
        },
        {
          "order": 3,
          "from": "Azure Landing Zone",
          "to": "Migration Wave",
          "node_refs": [
            "azure-0322",
            "azure-0351",
            "azure-0731"
          ],
          "explanation": "Rehost, Replatform oder Modernisierung wird pro Anwendung und Abhängigkeit gewählt; nicht jede Quelle wird zu einer VM."
        },
        {
          "order": 4,
          "from": "Migration Wave",
          "to": "Validation and Cutover",
          "node_refs": [
            "azure-0983",
            "azure-0987"
          ],
          "explanation": "Funktion, Performance, Security, Kosten und SLO werden gegen die Ausgangsbaseline geprüft."
        },
        {
          "order": 5,
          "from": "Validation and Cutover",
          "to": "Optimization",
          "node_refs": [
            "azure-0993",
            "azure-1034"
          ],
          "explanation": "Advisor und Cost Management unterstützen Rightsizing und kontinuierliche Verbesserung nach stabiler Migration."
        }
      ],
      "component_instances": [
        {
          "instance_id": "source-app",
          "role": "migration_source",
          "external_actor_ref": "actor-source-application",
          "requirement": "required"
        },
        {
          "instance_id": "assessment",
          "role": "discovery_assessment_dependencies",
          "node_ref": "azure-0645",
          "requirement": "required"
        },
        {
          "instance_id": "landing-zone",
          "role": "target_platform_foundation",
          "node_ref": "azure-0054",
          "requirement": "required"
        },
        {
          "instance_id": "governance",
          "role": "policy_guardrails",
          "node_ref": "azure-0962",
          "requirement": "required"
        },
        {
          "instance_id": "identity",
          "role": "target_identity",
          "node_ref": "azure-0904",
          "requirement": "required"
        },
        {
          "instance_id": "network",
          "role": "target_connectivity",
          "node_ref": "azure-0442",
          "requirement": "required"
        },
        {
          "instance_id": "security",
          "role": "security_baseline",
          "node_ref": "azure-0933",
          "requirement": "required"
        },
        {
          "instance_id": "monitor",
          "role": "migration_validation",
          "node_ref": "azure-0983",
          "requirement": "required"
        },
        {
          "instance_id": "cost",
          "role": "financial_optimization",
          "node_ref": "azure-1034",
          "requirement": "required"
        }
      ],
      "diagram": {
        "layout": "phased_pipeline",
        "nodes": [
          "source-app",
          "assessment",
          "landing-zone",
          "governance",
          "identity",
          "network",
          "security",
          "monitor",
          "cost"
        ],
        "edges": [
          {
            "from": "source-app",
            "to": "assessment",
            "label": "discover + assess"
          },
          {
            "from": "assessment",
            "to": "landing-zone",
            "label": "target design"
          },
          {
            "from": "governance",
            "to": "landing-zone",
            "label": "guardrails"
          },
          {
            "from": "identity",
            "to": "landing-zone",
            "label": "access model"
          },
          {
            "from": "network",
            "to": "landing-zone",
            "label": "connectivity"
          },
          {
            "from": "landing-zone",
            "to": "monitor",
            "label": "migrate + validate"
          },
          {
            "from": "monitor",
            "to": "cost",
            "label": "optimize"
          }
        ]
      },
      "technical_explanation": [
        "Azure Migrate Discovery and Assessment erfasst Bestand, Performance und TCP-Abhängigkeiten; daraus entstehen Anwendungsgruppen und Migrationswellen.",
        "Die Landing Zone stellt Management Groups, Subscriptions, Identity, Netzwerk, Policy, Security und Monitoring vor der Workloadmigration bereit.",
        "Cutover erfolgt nach Tests und Rollback-Kriterien; danach werden Quelle kontrolliert außer Betrieb genommen und Azure-Ziele anhand realer Telemetrie optimiert."
      ],
      "architecture_decisions": [
        {
          "question": "Rehost, Replatform oder Refactor?",
          "decision": "Pro Workload nach Geschäftsdruck, Kompatibilität, Zielbetrieb und Modernisierungspotenzial wählen.",
          "tradeoff": "Rehost ist schneller, konserviert aber Betriebsaufwand; PaaS reduziert Plattformarbeit, verlangt häufig Anwendungsänderung."
        },
        {
          "question": "Migrationseinheit?",
          "decision": "Abhängige Anwendungsbestandteile gemeinsam gruppieren und in Wellen mit klaren Exit-Kriterien bewegen.",
          "tradeoff": "Größere Waves reduzieren Übergangsschnittstellen, erhöhen aber Cutover-Risiko."
        },
        {
          "question": "Wann optimieren?",
          "decision": "Offensichtliches Rightsizing im Assessment, tiefe Optimierung nach stabiler funktionaler Migration.",
          "tradeoff": "Zu frühe Modernisierung verlängert Projekte; zu spätes Rightsizing erzeugt unnötige Kosten."
        }
      ],
      "security_considerations": [
        "Security Baseline, Identity, RBAC, Policy und Logging vor der ersten Produktionswave bereitstellen.",
        "Migrationstools, temporäre Staging-Daten und privilegierte Konten als eigene Angriffsfläche schützen.",
        "Defender Findings und Compliance vor und nach Cutover vergleichen."
      ],
      "monitoring_considerations": [
        "Quellbaseline für Performance, Fehler und Nutzung vor der Migration erfassen.",
        "Während Cutover synthetische und technische Health-Signale gegen Abnahmekriterien prüfen.",
        "Nach Migration Kosten, Capacity, Security und SLO kontinuierlich beobachten."
      ],
      "reliability_considerations": [
        "Abhängigkeiten und Migrationsreihenfolge bestimmen Verfügbarkeit während der Wave.",
        "Rollback, Datenkonsistenz, DNS-Umschaltung und Wiederanlaufzeit testen.",
        "Backup und DR im Ziel vor Abschaltung der Quelle nachweisen."
      ],
      "cost_considerations": [
        "Assessment nutzt Performance-Daten für Rightsizing und Kostenmodell; Parallelbetrieb bleibt zeitlich begrenzt.",
        "Reserved Capacity oder Savings erst nach stabiler Nutzung und Zielarchitektur entscheiden."
      ],
      "common_mistakes": [
        "Serverliste statt Anwendungs- und Abhängigkeitsmodell migrieren.",
        "Landing Zone erst nach den ersten Workloads aufbauen.",
        "Security und Monitoring als Post-Migration-Aufgabe verschieben.",
        "Quelle ohne bestätigten Restore-, Rollback- und Abnahmeprozess abschalten."
      ],
      "enterprise_example": "Ein Versicherer inventarisiert 400 Server, gruppiert sie per Dependency Analysis in Anwendungen und migriert zuerst risikoarme Waves in eine policy-gesteuerte Landing Zone. Jede Wave besitzt Business Owner, Cutover-Runbook, Telemetrievergleich und ein definiertes Decommission-Datum.",
      "operations_model": {
        "migration_factory": "Discovery, Assessment, Waves, Cutover und Rollback",
        "platform_team": "Landing Zone, Netzwerk, Identity, Policy und Monitoring",
        "workload_team": "Funktion, Daten, Tests und Zielbetrieb",
        "security_governance": "Baseline, Ausnahmen und Compliance",
        "finance": "Business Case, Parallelkosten und Optimierung"
      },
      "learning_path": [
        "azure-0645",
        "azure-0054",
        "azure-1022",
        "azure-0904",
        "azure-0442",
        "azure-0962",
        "azure-0933",
        "azure-0983",
        "azure-0993",
        "azure-1034"
      ],
      "merksatz": "Erst verstehen und vorbereiten, dann in Abhängigkeiten migrieren, messen und gezielt optimieren.",
      "relationships": [
        {
          "id": "scenario-rel-migration-001",
          "source": "scenario-cloud-migration",
          "target": "azure-0645",
          "type": "uses",
          "inverse_type": "used_by",
          "explanation": "Azure Migrate unterstützt Discovery, Assessment, Dependency Analysis und Migration Planning.",
          "sources": [
            "ms-ref-migrate-workloads",
            "ms-ref-migrate-dependencies",
            "ms-azure-migrate"
          ],
          "confidence": 0.99,
          "status": "accepted"
        },
        {
          "id": "scenario-rel-migration-002",
          "source": "scenario-cloud-migration",
          "target": "azure-0054",
          "type": "depends_on",
          "inverse_type": "depended_on_by",
          "explanation": "Eine vorbereitete Landing Zone ist die kontrollierte Zielplattform für Migrationswaves.",
          "sources": [
            "ms-ref-landing-zone",
            "ms-ref-migrate-workloads"
          ],
          "confidence": 0.99,
          "status": "accepted"
        },
        {
          "id": "scenario-rel-migration-003",
          "source": "scenario-cloud-migration",
          "target": "azure-1022",
          "type": "governed_by",
          "inverse_type": "governs",
          "explanation": "Management Groups ordnen Plattform- und Workload-Subscriptions für Governance.",
          "sources": [
            "ms-ref-landing-zone-design"
          ],
          "confidence": 0.99,
          "status": "accepted"
        },
        {
          "id": "scenario-rel-migration-004",
          "source": "scenario-cloud-migration",
          "target": "azure-0962",
          "type": "governed_by",
          "inverse_type": "governs",
          "explanation": "Azure Policy erzwingt die Zielbaseline über Migrationswaves hinweg.",
          "sources": [
            "ms-ref-landing-zone",
            "ms-policy-overview"
          ],
          "confidence": 0.99,
          "status": "accepted"
        },
        {
          "id": "scenario-rel-migration-005",
          "source": "scenario-cloud-migration",
          "target": "azure-0904",
          "type": "depends_on",
          "inverse_type": "depended_on_by",
          "explanation": "Microsoft Entra ID bildet die Zielidentität für Plattform- und Workloadzugriff.",
          "sources": [
            "ms-ref-landing-zone-design"
          ],
          "confidence": 0.99,
          "status": "accepted"
        },
        {
          "id": "scenario-rel-migration-006",
          "source": "scenario-cloud-migration",
          "target": "azure-0442",
          "type": "depends_on",
          "inverse_type": "depended_on_by",
          "explanation": "Zielnetzwerk, Hybridkonnektivität, DNS und Adressräume müssen vor Cutover bereitstehen.",
          "sources": [
            "ms-ref-migrate-workloads",
            "ms-ref-landing-zone-design"
          ],
          "confidence": 0.99,
          "status": "accepted"
        },
        {
          "id": "scenario-rel-migration-007",
          "source": "scenario-cloud-migration",
          "target": "azure-0933",
          "type": "secured_by",
          "inverse_type": "secures",
          "explanation": "Defender for Cloud unterstützt Security Posture und Workload Protection im Ziel.",
          "sources": [
            "ms-ref-landing-zone-design",
            "ms-defender-overview"
          ],
          "confidence": 0.98,
          "status": "accepted"
        },
        {
          "id": "scenario-rel-migration-008",
          "source": "scenario-cloud-migration",
          "target": "azure-0983",
          "type": "monitored_by",
          "inverse_type": "monitors",
          "explanation": "Azure Monitor validiert Zielbetrieb, Performance und Reliability gegen die Ausgangsbaseline.",
          "sources": [
            "ms-ref-migrate-workloads",
            "ms-azure-monitor-overview"
          ],
          "confidence": 0.99,
          "status": "accepted"
        },
        {
          "id": "scenario-rel-migration-009",
          "source": "scenario-cloud-migration",
          "target": "azure-1034",
          "type": "monitored_by",
          "inverse_type": "monitors",
          "explanation": "Cost Management misst Parallelbetrieb und Zielkosten nach der Migration.",
          "sources": [
            "ms-ref-migrate-workloads",
            "ms-cost-management"
          ],
          "confidence": 0.98,
          "status": "accepted"
        },
        {
          "id": "scenario-rel-migration-010",
          "source": "scenario-cloud-migration",
          "target": "azure-0993",
          "type": "uses",
          "inverse_type": "used_by",
          "explanation": "Azure Advisor unterstützt die kontinuierliche Optimierung nach stabiler Migration.",
          "sources": [
            "ms-advisor-overview"
          ],
          "confidence": 0.98,
          "status": "accepted"
        }
      ],
      "sources": [
        "ms-ref-migrate-workloads",
        "ms-ref-migrate-plan",
        "ms-ref-migrate-dependencies",
        "ms-ref-landing-zone",
        "ms-ref-landing-zone-design"
      ],
      "status": "published"
    }
  ],
  "referenced_nodes": {
    "azure-0007": {
      "id": "azure-0007",
      "title": "Availability Zones",
      "parent": "azure-0004",
      "description": {
        "simple": "Availability Zones sind physisch getrennte Standorte innerhalb einer Azure-Region. Mehrere Instanzen über Zonen hinweg schützen eine Anwendung vor dem Ausfall eines einzelnen Rechenzentrums.",
        "technical": "Jede Zone besitzt unabhängige Stromversorgung, Kühlung und Netzwerkkomponenten, ist aber über regionale Netzwerke mit den anderen Zonen verbunden. Ressourcen können zonal in einer bestimmten Zone oder zonenredundant über mehrere Zonen bereitgestellt werden. Die Anwendung muss Daten, Netzwerkpfade und Zustände passend replizieren.",
        "architecture": "Architekten wählen Zonen für geschäftskritische Workloads mit höherem Resilienzziel als ein Availability Set. Der Gewinn an Ausfallsicherheit steht zusätzlicher Architekturkomplexität, möglicher zonenübergreifender Latenz und Datentransferkosten gegenüber. Eine Zone schützt nicht vor einem kompletten Regionsausfall."
      },
      "tags": [
        "AZ-900",
        "Architecture",
        "availability-zone",
        "resilience",
        "region",
        "compute-pilot-v1.4"
      ],
      "sources": [
        "ms-zones-overview",
        "ms-vmss-overview"
      ]
    },
    "azure-0025": {
      "id": "azure-0025",
      "title": "Azure Autoscale",
      "parent": "azure-0014",
      "description": {
        "simple": "Azure Autoscale passt die Anzahl oder Kapazität unterstützter Ressourcen automatisch an. Regeln reagieren beispielsweise auf CPU-Last, Warteschlangen oder einen Zeitplan.",
        "technical": "Autoscale wertet Metriken und Zeitfenster aus und führt Scale-out- oder Scale-in-Aktionen innerhalb definierter Mindest-, Standard- und Höchstwerte aus. Cooldown-Phasen verhindern zu schnelle Gegenbewegungen. Bei VM Scale Sets ändert es typischerweise die Instanzzahl.",
        "architecture": "Autoscale senkt Leerlaufkosten und erhöht Reaktionsfähigkeit, ersetzt aber keine Kapazitätsplanung. Schwellen, Aufwärmzeit, Abhängigkeiten und sichere Scale-in-Semantik müssen getestet werden. Vorhersehbare Spitzen können zeitgesteuert vorgewärmt werden; unvorhersehbare Last benötigt metrische Regeln."
      },
      "tags": [
        "AZ-900",
        "Architecture",
        "autoscale",
        "elasticity",
        "azure-monitor",
        "compute-pilot-v1.4"
      ],
      "sources": [
        "ms-vmss-autoscale"
      ]
    },
    "azure-0054": {
      "id": "azure-0054",
      "title": "Landing Zones (als modernes Gesamt-Konzept)",
      "parent": "azure-0047",
      "description": {
        "simple": "",
        "technical": "Landing Zones (als modernes Gesamt-Konzept)",
        "architecture": ""
      },
      "tags": [
        "AZ-900",
        "Architecture"
      ],
      "sources": []
    },
    "azure-0107": {
      "id": "azure-0107",
      "title": "Fault Tolerance und Fehlerbetrieb",
      "parent": "azure-0002",
      "description": {
        "simple": "Fault Tolerance lässt einen Dienst trotz Ausfall einzelner Komponenten weiterarbeiten. Sie nutzt Redundanz, Erkennung und Umschaltung. Monitoring zeigt, wann die vorgesehenen Fehlermodi tatsächlich eintreten.",
        "technical": "Mehrere Instanzen, Health Probes, Load Balancing, Replikation und Failover begrenzen einzelne Fehler. Telemetrie erkennt Ausfälle und Degradation, während Automatisierung Traffic umleiten oder Instanzen ersetzen kann. Gemeinsame Abhängigkeiten und falsche Health-Signale können die Toleranz aufheben.",
        "architecture": "Architekten definieren erwartete Fehlerdomänen und gewünschte Degradation statt pauschal maximale Redundanz zu kaufen. Schnellere automatische Reaktion reduziert Ausfallzeit, kann aber bei fehlerhaften Signalen Folgeschäden auslösen. Failoverlogik, Zustandskonsistenz und Rückkehrbetrieb müssen getestet werden."
      },
      "tags": [
        "AZ-900",
        "Azure Fundamentals",
        "fault-tolerance",
        "health-signals",
        "failover",
        "monitoring-operations-pilot-v1.8"
      ],
      "sources": [
        "ms-bcdr-concepts",
        "ms-failover-failback",
        "ms-reliability-targets"
      ]
    },
    "azure-0114": {
      "id": "azure-0114",
      "title": "Disaster Recovery (DR)",
      "parent": "azure-0002",
      "description": {
        "simple": "Disaster Recovery beschreibt, wie ein Dienst nach einem schweren Ausfall oder Sicherheitsvorfall wieder arbeitsfähig wird. Dazu gehören Wiederherstellung, Failover, Kommunikation und Rückkehr zum Normalbetrieb. Backup allein ist noch kein vollständiger DR-Plan.",
        "technical": "DR kombiniert Recovery Points, Replikation, Failover/Failback, alternative Betriebsumgebungen und dokumentierte Runbooks. RPO begrenzt tolerierbaren Datenverlust, RTO die Wiederanlaufzeit. Recovery muss Identitäten, Schlüssel, Netzwerk, Abhängigkeiten, Datenkonsistenz und Cyber-Recovery nach einer Kompromittierung berücksichtigen.",
        "architecture": "Die Strategie folgt Business Impact und Ausfallszenarien: Restore, Active/Passive oder Active/Active haben unterschiedliche Kosten und Komplexität. Backups sollten getrennt, zugriffsgeschützt, überwacht und möglichst unveränderbar sein. Ein regionaler Failover hilft nicht, wenn kompromittierte Daten oder Identitäten ungeprüft repliziert werden."
      },
      "tags": [
        "AZ-900",
        "Architecture",
        "disaster-recovery",
        "cyber-recovery",
        "rpo-rto",
        "security-pilot-v1.7"
      ],
      "sources": [
        "ms-bcdr-concepts",
        "ms-backup-security",
        "ms-site-recovery"
      ]
    },
    "azure-0116": {
      "id": "azure-0116",
      "title": "Azure Backup für VMs",
      "parent": "azure-0115",
      "description": {
        "simple": "Azure Backup erstellt unabhängige Wiederherstellungspunkte für virtuelle Maschinen. Damit lassen sich nach Löschung, Beschädigung oder Fehlkonfiguration ganze VMs oder Daten wiederherstellen.",
        "technical": "Eine Backup Policy steuert Zeitplan und Aufbewahrung; Recovery Points werden in einem Vault verwaltet. Für anwendungs- oder dateisystemkonsistente Sicherungen koordiniert eine VM-Erweiterung Snapshots, danach werden geänderte Datenblöcke in den Vault übertragen. Backup-Konsistenz und Restore-Fähigkeit müssen zur Workload passen.",
        "architecture": "Backup schützt gegen logische Fehler und Datenverlust, während Availability Zones laufende Verfügbarkeit und Site Recovery Disaster Recovery adressieren. Architekten definieren RPO, Aufbewahrung, Unveränderbarkeit, Zugriffsschutz und regelmäßige Restore-Tests. Backup ist ein eigener Kosten- und Betriebsbaustein, nicht im VM-Preis enthalten."
      },
      "tags": [
        "AZ-900",
        "Storage",
        "azure-backup",
        "vm",
        "recovery",
        "compute-pilot-v1.4"
      ],
      "sources": [
        "ms-vm-backup"
      ]
    },
    "azure-0118": {
      "id": "azure-0118",
      "title": "Azure Site Recovery für VM-Disaster-Recovery",
      "parent": "azure-0115",
      "description": {
        "simple": "Azure Site Recovery repliziert virtuelle Maschinen an einen zweiten Standort und orchestriert Failover und Failback. Es wird eingesetzt, um Anwendungen nach einem Standort- oder Regionsausfall wieder in Betrieb zu nehmen.",
        "technical": "Site Recovery repliziert Änderungen kontinuierlich von der Primär- zur Zielumgebung und verwaltet Recovery Points. Recovery Plans ordnen abhängige Maschinen und Automatisierungsschritte. Bei einem Ausfall werden Ziel-VMs aus den replizierten Daten gestartet und Netzwerkpfade angepasst.",
        "architecture": "Site Recovery adressiert RTO und RPO für Disaster Recovery, ersetzt aber weder lokale Hochverfügbarkeit noch Backup. Zielregion, Kapazität, IP- und DNS-Umschaltung, Datenkonsistenz, Runbooks und regelmäßige Test-Failovers gehören in das Design. Der Kunde verantwortet die anwendungsspezifische Wiederanlaufreihenfolge."
      },
      "tags": [
        "AZ-900",
        "Compute",
        "site-recovery",
        "disaster-recovery",
        "bcdr",
        "compute-pilot-v1.4"
      ],
      "sources": [
        "ms-site-recovery"
      ]
    },
    "azure-0178": {
      "id": "azure-0178",
      "title": "Hybrid Cloud",
      "parent": "azure-0151",
      "description": {
        "simple": "",
        "technical": "Hybrid Cloud",
        "architecture": ""
      },
      "tags": [
        "AZ-900",
        "Azure Fundamentals"
      ],
      "sources": []
    },
    "azure-0254": {
      "id": "azure-0254",
      "title": "Region Pairs",
      "parent": "azure-0236",
      "description": {
        "simple": "",
        "technical": "Region Pairs",
        "architecture": ""
      },
      "tags": [
        "AZ-900",
        "Architecture"
      ],
      "sources": []
    },
    "azure-0322": {
      "id": "azure-0322",
      "title": "Azure Virtual Machines",
      "parent": "azure-0321",
      "description": {
        "simple": "Azure Virtual Machines stellen Windows- oder Linux-Server als flexibel konfigurierbare Cloud-Ressourcen bereit. Sie werden genutzt, wenn eine Anwendung Kontrolle über Betriebssystem, Laufzeit oder installierte Software benötigt.",
        "technical": "Eine VM kombiniert eine gewählte VM-Größe mit einem Betriebssystem-Image, Netzwerkschnittstelle, VNet-Anbindung und OS- sowie Daten-Datenträgern. Azure virtualisiert und betreibt die physische Infrastruktur; der Kunde konfiguriert, patcht und überwacht Gastbetriebssystem und Workload. Verfügbarkeit und Skalierung entstehen erst durch mehrere Instanzen und ergänzende Dienste.",
        "architecture": "VMs passen zu Lift-and-Shift, Spezialsoftware, Appliances und strikten OS-Anforderungen. Gegenüber App Service oder Containerplattformen bieten sie maximale Kontrolle, verursachen aber den höchsten Betriebsaufwand für Patching, Backup, Hardening, Skalierung und Hochverfügbarkeit. Die Architektur sollte VNet, NSG, Managed Identity, RBAC, Managed Disks, Azure Monitor und eine Resilienzstrategie gemeinsam entwerfen."
      },
      "tags": [
        "AZ-900",
        "Compute",
        "azure-vm",
        "iaas",
        "architecture-bridge",
        "compute-pilot-v1.4"
      ],
      "sources": [
        "ms-vm-overview",
        "ms-managed-disks",
        "ms-monitor-vm"
      ]
    },
    "azure-0351": {
      "id": "azure-0351",
      "title": "Azure App Service",
      "parent": "azure-0321",
      "description": {
        "simple": "Azure App Service hostet Webanwendungen, APIs und mobile Backends als verwaltete Plattform. Entwickler stellen Code oder Container bereit, ohne die zugrunde liegenden Server selbst zu verwalten.",
        "technical": "Apps laufen auf Windows- oder Linux-Workern eines App Service Plans und nutzen integrierte Deployment-, Skalierungs-, TLS-, Identitäts- und Monitoringfunktionen. Azure verwaltet Host, Gastbetriebssystem und unterstützte Plattformlaufzeiten. Der Kunde verwaltet Anwendung, Konfiguration, Daten, Abhängigkeiten und Zugriffsmodell.",
        "architecture": "App Service ist oft die erste PaaS-Wahl für HTTP-basierte Anwendungen mit unterstützten Laufzeiten. Gegenüber VMs reduziert es Patch- und Infrastrukturaufwand, bietet aber weniger OS-Kontrolle; gegenüber AKS ist es einfacher, aber weniger flexibel für komplexe Containerorchestrierung. Plan-Tier, Zonenunterstützung, VNet-Integration, Managed Identity, Deployment Slots und Observability bestimmen das Produktionsdesign."
      },
      "tags": [
        "AZ-900",
        "Compute",
        "app-service",
        "paas",
        "web-apps",
        "architecture-bridge",
        "compute-pilot-v1.4"
      ],
      "sources": [
        "ms-app-service",
        "ms-app-service-plan"
      ]
    },
    "azure-0387": {
      "id": "azure-0387",
      "title": "Azure Virtual Machine Scale Sets",
      "parent": "azure-0321",
      "description": {
        "simple": "VM Scale Sets erstellen und verwalten Gruppen virtueller Maschinen als gemeinsame Skalierungs- und Verfügbarkeitseinheit. Die Instanzzahl kann automatisch an Bedarf oder Zeitpläne angepasst werden.",
        "technical": "Ein Scale Set beschreibt Instanzkonfiguration, Orchestrierungsmodus, VM-Größe, Image, Netzwerk und Datenträger. Instanzen können über Fault Domains oder Availability Zones verteilt, mit Load Balancer oder Application Gateway verbunden und durch Autoscale gesteuert werden. Flexible und Uniform Orchestration bieten unterschiedliche Kontrollmodelle.",
        "architecture": "VMSS ist die Wahl, wenn eine Anwendung VM-Kontrolle benötigt, aber horizontal skalieren und redundant laufen soll. Gegenüber einzelnen VMs standardisiert es Instanzen und Lifecycle; gegenüber App Service oder AKS bleibt der Gastbetrieb aufwendiger. Orchestrierungsmodus, zustandsarmer Workload, Image-Pipeline, Health-Signal, Scale-in und Zonenstrategie sind entscheidend."
      },
      "tags": [
        "AZ-900",
        "Compute",
        "vmss",
        "horizontal-scaling",
        "high-availability",
        "architecture-bridge",
        "compute-pilot-v1.4"
      ],
      "sources": [
        "ms-vmss-overview",
        "ms-vmss-autoscale"
      ]
    },
    "azure-0425": {
      "id": "azure-0425",
      "title": "Azure Kubernetes Service (AKS)",
      "parent": "azure-0414",
      "description": {
        "simple": "AKS ist ein verwalteter Kubernetes-Dienst für containerisierte Anwendungen. Azure betreibt die Kubernetes-Control-Plane; Teams verwenden Kubernetes-Funktionen für Deployment, Skalierung, Netzwerk und Betrieb ihrer Workloads.",
        "technical": "Ein AKS-Cluster besteht aus einer von Azure verwalteten Control Plane und Node Pools, auf denen Pods laufen. AKS integriert Azure-Netzwerk, Microsoft Entra, Azure RBAC, Workload Identity, Container Registry und Azure Monitor. AKS Automatic übernimmt mehr Node-, Upgrade-, Security- und Monitoringaufgaben als AKS Standard.",
        "architecture": "AKS ist sinnvoll, wenn Kubernetes-API, Portabilität, komplexe Orchestrierung oder ein Plattformteam benötigt werden. Gegenüber ACI und Container Apps bietet es mehr Kontrolle, aber deutlich mehr Betriebs- und Governanceaufwand; gegenüber App Service ist es flexibler, aber komplexer. Netzwerkmodell, Identität, Policies, Node-Lifecycle, Upgrades, Observability und Kosten sind gemeinsame Architekturentscheidungen."
      },
      "tags": [
        "AZ-900",
        "Compute",
        "AKS",
        "aks",
        "kubernetes",
        "containers",
        "architecture-bridge",
        "compute-pilot-v1.4"
      ],
      "sources": [
        "ms-aks-overview",
        "ms-aks-support",
        "ms-monitor-aks"
      ]
    },
    "azure-0442": {
      "id": "azure-0442",
      "title": "Virtual Network (VNet)",
      "parent": "azure-0441",
      "description": {
        "simple": "Ein Virtual Network ist dein eigenes privates Netzwerk in Azure. Darin können Azure-Ressourcen miteinander kommunizieren, ähnlich wie Geräte in einem Firmennetz. Du teilst es in Subnetze auf, um Bereiche voneinander zu trennen.",
        "technical": "Ein VNet ist ein regionales, softwaredefiniertes Netzwerk mit einem oder mehreren privaten CIDR-Adressbereichen. Subnetze segmentieren den Adressraum; Systemrouten ermöglichen zunächst interne Kommunikation, während NSGs, benutzerdefinierte Routen, Peering und Gateways den Verkehrsfluss steuern.",
        "architecture": "Das VNet bildet eine zentrale Netzwerk- und Segmentierungsgrenze für Azure-Workloads. Adressräume müssen früh geplant und bei Peering oder Hybridanbindung überschneidungsfrei sein. In größeren Umgebungen werden VNets häufig als Hub-and-Spoke-Topologie mit zentraler Firewall, Private Endpoints und DNS-Auflösung kombiniert."
      },
      "tags": [
        "AZ-900",
        "Networking",
        "VNet",
        "network-foundation",
        "segmentation",
        "address-space",
        "networking-pilot-v1.2"
      ],
      "sources": [
        "ms-vnet-subnets"
      ]
    },
    "azure-0453": {
      "id": "azure-0453",
      "title": "Subnet",
      "parent": "azure-0452",
      "description": {
        "simple": "Ein Subnet ist ein abgegrenzter Teil eines Virtual Networks. Du kannst damit zum Beispiel Webserver und Datenbanken in getrennte Netzwerkbereiche legen.",
        "technical": "Ein Subnet ist ein zusammenhängender IP-Adressbereich innerhalb eines VNet-Adressraums. Netzwerkschnittstellen erhalten private IP-Adressen aus diesem Bereich. NSGs, Route Tables, Service Endpoints und delegierte Azure-Dienste werden typischerweise auf Subnetzebene zugeordnet.",
        "architecture": "Subnetze bilden Sicherheits- und Routingzonen, nicht automatisch eigenständige Vertrauensgrenzen. Größe und Zweck sollten Reserven für Skalierung und Azure-reservierte Adressen berücksichtigen. Bestimmte Plattformdienste wie VPN Gateway, Azure Firewall oder Application Gateway benötigen dedizierte Subnetze."
      },
      "tags": [
        "AZ-900",
        "Networking",
        "VNet",
        "subnet",
        "segmentation",
        "cidr",
        "networking-pilot-v1.2"
      ],
      "sources": [
        "ms-vnet-subnets"
      ]
    },
    "azure-0461": {
      "id": "azure-0461",
      "title": "Virtual Network Gateway",
      "parent": "azure-0460",
      "description": {
        "simple": "Ein Virtual Network Gateway verbindet ein VNet mit anderen Netzwerken. Je nach Typ transportiert es VPN- oder ExpressRoute-Verkehr.",
        "technical": "Ein Virtual Network Gateway besteht aus von Azure verwalteten Gatewayinstanzen in einem dedizierten GatewaySubnet. Der Gatewaytyp Vpn terminiert verschlüsselte VPN-Verbindungen; der Typ ExpressRoute verbindet ein VNet mit einem ExpressRoute Circuit.",
        "architecture": "Der Gatewaytyp ist eine grundlegende Designentscheidung für Hybridkonnektivität. Kapazität, Hochverfügbarkeit, Zonenredundanz und Koexistenz von VPN- und ExpressRoute-Gateways müssen anhand von Durchsatz- und Resilienzzielen gewählt werden."
      },
      "tags": [
        "AZ-900",
        "Networking",
        "gateway",
        "hybrid-connectivity",
        "networking-pilot-v1.2"
      ],
      "sources": [
        "ms-vpn-settings",
        "ms-expressroute"
      ]
    },
    "azure-0462": {
      "id": "azure-0462",
      "title": "VPN Gateway",
      "parent": "azure-0441",
      "description": {
        "simple": "VPN Gateway verbindet Azure verschlüsselt mit einem Standort, einzelnen Geräten oder einem anderen VNet. Der Verkehr kann dabei über das öffentliche Internet laufen, bleibt aber durch den VPN-Tunnel geschützt.",
        "technical": "Azure VPN Gateway ist ein Virtual Network Gateway vom Typ Vpn. Es unterstützt unter anderem Site-to-Site-, Point-to-Site- und VNet-to-VNet-Verbindungen mit IPsec/IKE. Die verwalteten Gatewayinstanzen werden im GatewaySubnet bereitgestellt.",
        "architecture": "VPN Gateway eignet sich für schnelle Hybridanbindungen, Remotezugriff und kleinere bis mittlere Produktionsszenarien. SKU, aktiv-aktiv-Konfiguration, Zonenredundanz, Routingtyp und redundante lokale Geräte bestimmen Durchsatz und Ausfallsicherheit. Für planbare private Konnektivität mit höherer Bandbreite kann ExpressRoute geeigneter sein."
      },
      "tags": [
        "AZ-900",
        "Networking",
        "vpn",
        "hybrid-connectivity",
        "ipsec",
        "networking-pilot-v1.2"
      ],
      "sources": [
        "ms-vpn-gateway",
        "ms-vpn-settings"
      ]
    },
    "azure-0478": {
      "id": "azure-0478",
      "title": "ExpressRoute",
      "parent": "azure-0441",
      "description": {
        "simple": "ExpressRoute verbindet ein lokales Netzwerk privat mit Microsoft-Cloud-Diensten. Die Verbindung läuft über einen Konnektivitätsanbieter und nicht über das öffentliche Internet.",
        "technical": "ExpressRoute stellt Layer-3-Konnektivität über einen Provider, eine Ethernet-Punkt-zu-Punkt-Verbindung oder eine Colocation bereit. BGP tauscht Routen aus; jeder Circuit besitzt redundante Verbindungen zu Microsoft-Edge-Routern.",
        "architecture": "ExpressRoute ist für planbare Bandbreite, konsistente Latenz und hohe Zuverlässigkeit geeignet. Das Design umfasst Circuit-Redundanz, getrennte Peeringstandorte, BGP, Gatewaykapazität und häufig ein zusätzliches Site-to-Site-VPN als unabhängigen Ausweichpfad."
      },
      "tags": [
        "AZ-900",
        "Networking",
        "expressroute",
        "private-connectivity",
        "bgp",
        "networking-pilot-v1.2"
      ],
      "sources": [
        "ms-expressroute"
      ]
    },
    "azure-0505": {
      "id": "azure-0505",
      "title": "Load Balancer",
      "parent": "azure-0441",
      "description": {
        "simple": "Azure Load Balancer verteilt TCP- oder UDP-Verbindungen auf mehrere gesunde Backend-Systeme. Dadurch bleibt ein Dienst verfügbar, wenn eine Instanz ausfällt oder viel Last entsteht.",
        "technical": "Load Balancer arbeitet auf Layer 4 und verwendet Frontend-IP-Konfigurationen, Backend Pools, Load-Balancing-Regeln und Health Probes. Er kann öffentlich oder intern sein; die Verteilungsentscheidung erfolgt pro Netzwerkflow.",
        "architecture": "Load Balancer ist passend für sehr performante regionale oder globale Layer-4-Szenarien ohne HTTP-Inhaltsrouting. Backend-Redundanz, Zonenmodell, Probe-Design und Outbound-Konnektivität müssen bewusst geplant werden. Für HTTP(S)-Routing auf Layer 7 ist Application Gateway oder Front Door geeigneter."
      },
      "tags": [
        "AZ-900",
        "Networking",
        "load-balancing",
        "layer-4",
        "tcp",
        "udp",
        "networking-pilot-v1.2"
      ],
      "sources": [
        "ms-load-balancing",
        "ms-load-balancer-components"
      ]
    },
    "azure-0519": {
      "id": "azure-0519",
      "title": "Application Gateway",
      "parent": "azure-0441",
      "description": {
        "simple": "Application Gateway verteilt Webanfragen innerhalb einer Azure-Region. Es kann anhand von Webadresse oder Hostnamen entscheiden, welches Backend eine Anfrage erhält.",
        "technical": "Application Gateway ist ein Layer-7-Web-Traffic-Load-Balancer mit Listenern, Routingregeln, Backend Pools, Health Probes und HTTP-Einstellungen. Es unterstützt URL- und hostbasiertes Routing, TLS-Terminierung, Autoscaling, Zonenredundanz und WAF-Integration.",
        "architecture": "Application Gateway eignet sich als regionaler HTTP(S)-Einstiegspunkt für öffentliche oder private Anwendungen. TLS-Ende-zu-Ende, Backend-Namensauflösung, Skalierung und WAF-Policies müssen gemeinsam geplant werden. In globalen Architekturen kann Front Door davor liegen."
      },
      "tags": [
        "AZ-900",
        "Networking",
        "application-gateway",
        "layer-7",
        "http",
        "routing",
        "networking-pilot-v1.2"
      ],
      "sources": [
        "ms-app-gateway",
        "ms-load-balancing"
      ]
    },
    "azure-0558": {
      "id": "azure-0558",
      "title": "Private DNS",
      "parent": "azure-0545",
      "description": {
        "simple": "Azure Private DNS löst interne Namen für verbundene Virtual Networks auf. So können Ressourcen private Ziele über Namen statt über feste IP-Adressen erreichen.",
        "technical": "Private DNS Zones werden mit VNets verknüpft und unterstützen gängige DNS-Recordtypen. Optional kann ein Link VM-Records automatisch registrieren. Für Private Endpoints werden dienstspezifische privatelink-Zonen verwendet, damit der öffentliche Dienstname zur privaten IP aufgelöst wird.",
        "architecture": "Private DNS ist ein eigener Architekturbaustein für Private Link, Peering und Hybridnetze. Zonenlinks, zentrale oder verteilte Zuständigkeit, Split-Horizon-Verhalten und Auflösung von On-Premises über Private Resolver müssen konsistent geplant werden."
      },
      "tags": [
        "AZ-900",
        "Networking",
        "private-dns",
        "name-resolution",
        "private-link",
        "networking-pilot-v1.2"
      ],
      "sources": [
        "ms-private-dns-overview",
        "ms-private-dns"
      ]
    },
    "azure-0560": {
      "id": "azure-0560",
      "title": "Traffic Manager",
      "parent": "azure-0545",
      "description": {
        "simple": "Traffic Manager lenkt Benutzer per DNS zu einem passenden öffentlichen Endpunkt. Kriterien können Nähe, Priorität, Gewichtung oder geografische Regeln sein.",
        "technical": "Traffic Manager ist ein DNS-basierter globaler Traffic Load Balancer. Ein Profil enthält Endpunkte, eine Routingmethode und Health Monitoring. Der Datenverkehr läuft nicht durch Traffic Manager; DNS liefert dem Client das ausgewählte Ziel.",
        "architecture": "Traffic Manager eignet sich für protokollunabhängige, globale Endpunktauswahl und hybride Ziele. DNS-Caching und TTL verzögern jedoch Failover. Für HTTP(S)-Proxyfunktionen, TLS-Terminierung, WAF oder Edge-Caching ist Front Door passender."
      },
      "tags": [
        "AZ-900",
        "Networking",
        "traffic-manager",
        "dns-routing",
        "global",
        "networking-pilot-v1.2"
      ],
      "sources": [
        "ms-traffic-manager",
        "ms-load-balancing"
      ]
    },
    "azure-0562": {
      "id": "azure-0562",
      "title": "Front Door",
      "parent": "azure-0545",
      "description": {
        "simple": "Azure Front Door ist ein globaler Einstiegspunkt für Webanwendungen. Benutzer werden über Microsofts Edge-Netzwerk schnell und sicher zu einem gesunden Backend geleitet.",
        "technical": "Front Door Standard/Premium ist ein globaler Layer-7-Proxy und CDN für HTTP(S). Es bietet Anycast-basierten Einstieg, Origin Health Probes, Routing, TLS, Caching und WAF-Integration; Premium unterstützt zusätzlich private Origin-Anbindung per Private Link.",
        "architecture": "Front Door eignet sich für weltweit verteilte, internetorientierte Webanwendungen und schnelle regionsübergreifende Umschaltung. Origins sollten gegen direkten Zugriff geschützt, TLS-Ende-zu-Ende und WAF-Policies geplant werden. Regional kann Front Door an Application Gateway oder andere Origins weiterleiten."
      },
      "tags": [
        "AZ-900",
        "Networking",
        "front-door",
        "cdn",
        "global",
        "layer-7",
        "networking-pilot-v1.2"
      ],
      "sources": [
        "ms-front-door",
        "ms-load-balancing"
      ]
    },
    "azure-0579": {
      "id": "azure-0579",
      "title": "Storage Account",
      "parent": "azure-0571",
      "description": {
        "simple": "Ein Storage Account ist der Verwaltungs- und Sicherheitsrahmen für Azure-Storage-Daten. Er enthält Dienstendpunkte für Blobs, Files, Queues und Tables und besitzt einen weltweit eindeutigen Namen. Einstellungen für Region, Redundanz, Netzwerk und Zugriff wirken auf die enthaltenen Dienste.",
        "technical": "Der Storage Account stellt einen eindeutigen Namespace und getrennte Datenendpunkte bereit. Auf Account-Ebene werden Typ, Performance, Redundanz, Verschlüsselungsoptionen, Firewall, Private Endpoints und Shared-Key-Zulassung konfiguriert; Datenzugriffe werden über Entra ID/RBAC, SAS oder Account Keys autorisiert. Account Keys geben weitreichenden Zugriff und sollten zugunsten identitätsbasierter Verfahren vermieden oder streng geschützt werden.",
        "architecture": "Accountgrenzen sind zugleich Blast-Radius-, Policy-, Netzwerk-, Schlüssel-, Quota- und teilweise Kosten-/Lifecycle-Grenzen. Workloads mit unterschiedlichen Sicherheits-, Verfügbarkeits- oder Betriebsanforderungen sollten nicht blind einen Account teilen. Private Endpoints vermeiden öffentliche Datenpfade, benötigen aber pro Storage-Dienst passende Endpunkte und DNS-Auflösung."
      },
      "tags": [
        "AZ-900",
        "Storage",
        "storage-account",
        "account-boundary",
        "shared-key",
        "sas",
        "storage-pilot-v1.6"
      ],
      "sources": [
        "ms-storage-account",
        "ms-storage-authorization",
        "ms-storage-sas",
        "ms-storage-private-endpoints"
      ]
    },
    "azure-0645": {
      "id": "azure-0645",
      "title": "Azure Migrate",
      "parent": "azure-0637",
      "description": {
        "simple": "Azure Migrate hilft, bestehende Server, Anwendungen und Datenbanken für Azure zu erfassen, zu bewerten und zu migrieren. Die Plattform bündelt Inventar, Abhängigkeitsanalyse, Zielbewertung und Migrationswerkzeuge. Sie unterstützt damit die Planung eines kontrollierten Umzugs.",
        "technical": "Ein Azure-Migrate-Projekt sammelt Discovery- und Assessmentdaten über Appliances, Agents oder integrierte Werkzeuge. Assessments bewerten Readiness, Sizing, Abhängigkeiten und Kosten; spezialisierte Tools führen Server-, Web-App- und Datenbankmigrationen aus. Unterstützte Quellen, Zielpfade und Downtime unterscheiden sich je Workload.",
        "architecture": "Azure Migrate ist ein Steuerungs- und Entscheidungsrahmen, kein automatischer Ersatz für Zielarchitektur. Vor jeder Welle ist zwischen Rehost, Replatform und Refactor abzuwägen und eine passende Landing Zone bereitzustellen. Daten, Identität, Netzwerk, Sicherheit, Betrieb und Rollback müssen gemeinsam geplant werden."
      },
      "tags": [
        "AZ-900",
        "Storage",
        "azure-migrate",
        "assessment",
        "migration-wave",
        "storage-pilot-v1.6"
      ],
      "sources": [
        "ms-azure-migrate",
        "ms-dms-overview"
      ]
    },
    "azure-0731": {
      "id": "azure-0731",
      "title": "Azure SQL Database",
      "parent": "azure-0723",
      "description": {
        "simple": "Azure SQL Database ist eine vollständig verwaltete relationale Datenbank in Azure. Sie speichert strukturierte Daten in Tabellen und unterstützt SQL sowie Transaktionen. Azure übernimmt viele Aufgaben wie Patching, Hochverfügbarkeit und automatische Backups.",
        "technical": "Azure SQL Database ist ein PaaS-Datenbankdienst mit logischen Servern, einzelnen Datenbanken und Elastic Pools. Die Engine stellt T-SQL, ACID-Transaktionen, integrierte Hochverfügbarkeit, automatische Sicherungen, Skalierungsoptionen und Sicherheitsfunktionen bereit. Der Kunde verantwortet Schema, Abfragen, Zugriffsmodell, Leistungsdimensionierung und Wiederherstellungsanforderungen.",
        "architecture": "Azure SQL Database ist die Standardwahl für relationale Anwendungen, die keine Betriebssystem- oder vollständige SQL-Server-Instanzkontrolle benötigen. Gegenüber SQL auf einer VM reduziert sie Betriebsverantwortung, bringt aber Plattformgrenzen und weniger Instanzkontrolle. Private Endpoint, Entra-Authentifizierung, Datenklassifikation, Skalierungsmodell und Geo-DR gehören zum Design."
      },
      "tags": [
        "AZ-900",
        "Databases",
        "azure-sql-database",
        "relational-database",
        "paas",
        "storage-pilot-v1.6"
      ],
      "sources": [
        "ms-azure-sql-overview",
        "ms-storage-private-endpoints"
      ]
    },
    "azure-0841": {
      "id": "azure-0841",
      "title": "Azure Firewall",
      "parent": "azure-0816",
      "description": {
        "simple": "Azure Firewall ist eine zentral verwaltete Netzwerk-Firewall für Azure. Sie kontrolliert und protokolliert erlaubte oder blockierte Verbindungen zwischen Netzwerken und zum Internet.",
        "technical": "Azure Firewall ist ein zustandsbehafteter, cloudnativer Firewall-as-a-Service-Dienst. Er verarbeitet Netzwerk-, Anwendungs- und NAT-Regeln und kann je nach SKU Funktionen wie Threat Intelligence, TLS Inspection und IDPS bereitstellen.",
        "architecture": "Azure Firewall wird häufig zentral in einem Hub-VNet bereitgestellt; UDRs leiten Spoke-Verkehr zur Inspektion dorthin. SKU, dediziertes AzureFirewallSubnet, Hochverfügbarkeit, DNS, Policy-Hierarchie und symmetrisches Routing sind zentrale Designpunkte. NSGs bleiben ergänzend für lokale Segmentierung sinnvoll."
      },
      "tags": [
        "AZ-900",
        "Security",
        "azure-firewall",
        "network-security",
        "hub-spoke",
        "networking-pilot-v1.2"
      ],
      "sources": [
        "ms-firewall"
      ]
    },
    "azure-0863": {
      "id": "azure-0863",
      "title": "Web Application Firewall (WAF)",
      "parent": "azure-0860",
      "description": {
        "simple": "Eine WAF schützt Webanwendungen vor typischen Angriffen wie SQL Injection und Cross-Site Scripting. Sie prüft HTTP(S)-Anfragen und kann verdächtige Anfragen protokollieren oder blockieren.",
        "technical": "Azure WAF wird mit Application Gateway oder Front Door bereitgestellt. WAF Policies kombinieren verwaltete OWASP-Regelsätze, eigene Regeln, Ausnahmen und Detection- oder Prevention-Modus.",
        "architecture": "WAF gehört an öffentliche oder sensible HTTP(S)-Einstiegspunkte und ergänzt DDoS-, Netzwerk- und Anwendungsschutz. Policy-Lebenszyklus, Tuning gegen False Positives, Logging und getrennte Regeln pro Anwendung sind für den stabilen Betrieb entscheidend."
      },
      "tags": [
        "AZ-900",
        "Security",
        "waf",
        "web-security",
        "layer-7",
        "networking-pilot-v1.2"
      ],
      "sources": [
        "ms-waf"
      ]
    },
    "azure-0864": {
      "id": "azure-0864",
      "title": "NSG (Network Security Group)",
      "parent": "azure-0816",
      "description": {
        "simple": "Eine Network Security Group ist eine Liste von Erlaubnis- und Sperrregeln für Netzwerkverkehr. Sie kann ein Subnet oder die Netzwerkschnittstelle einer VM schützen.",
        "technical": "NSGs enthalten priorisierte, zustandsbehaftete Regeln für eingehenden und ausgehenden Verkehr. Regeln verwenden Quelle, Ziel, Port, Protokoll sowie optional Service Tags oder Application Security Groups. Eine NSG kann Subnetzen und Netzwerkschnittstellen zugeordnet werden.",
        "architecture": "NSGs eignen sich für verteilte Mikrosegmentierung nahe am Workload. Regeln sollten rollenbasiert, minimal und mit ASGs oder Service Tags statt wechselnder Einzel-IPs formuliert werden. Zentrale Firewallkontrolle und NSGs erfüllen unterschiedliche, ergänzende Aufgaben."
      },
      "tags": [
        "AZ-900",
        "Security",
        "NSG",
        "nsg",
        "network-security",
        "segmentation",
        "networking-pilot-v1.2"
      ],
      "sources": [
        "ms-nsg-asg"
      ]
    },
    "azure-0871": {
      "id": "azure-0871",
      "title": "Route Table / User-Defined Routes (UDR)",
      "parent": "azure-0816",
      "description": {
        "simple": "Eine Route Table legt fest, welchen Weg Netzwerkverkehr aus einem Subnet nimmt. Eigene Routen können Azure-Standardwege überschreiben, zum Beispiel um Verkehr über eine Firewall zu führen.",
        "technical": "Azure erstellt Systemrouten für jedes Subnet. Eine zugeordnete Route Table enthält User-Defined Routes mit Adresspräfix und Next-Hop-Typ. Azure wählt Routen anhand Präfixlänge, Quelle und weiteren Routingregeln.",
        "architecture": "UDRs erzwingen Inspektions- und Transitpfade in Hub-and-Spoke-Netzen. Rückweg und Hinweg müssen symmetrisch sein; BGP-Propagation, Service Endpoints und spezifischere Präfixe können die effektive Route beeinflussen. Effektive Routen sollten betrieblich geprüft werden."
      },
      "tags": [
        "AZ-900",
        "Security",
        "udr",
        "route-table",
        "routing",
        "networking-pilot-v1.2"
      ],
      "sources": [
        "ms-route-tables"
      ]
    },
    "azure-0881": {
      "id": "azure-0881",
      "title": "Private Endpoint",
      "parent": "azure-0877",
      "description": {
        "simple": "Ein Private Endpoint gibt einem Azure-Dienst eine private IP-Adresse in deinem VNet. Der Dienst kann dadurch intern erreichbar sein, ohne dass der Datenpfad über das öffentliche Internet führen muss.",
        "technical": "Ein Private Endpoint ist eine Netzwerkschnittstelle in einem Subnet, die über Azure Private Link einer konkreten Dienstressource zugeordnet ist. Datenverkehr läuft über das Microsoft-Backbone. Passende Private-DNS-Konfiguration sorgt dafür, dass der Dienstname zur privaten IP aufgelöst wird.",
        "architecture": "Private Endpoints reduzieren öffentliche Exposition und unterstützen Zero-Trust- und Datenabflusskontrollen. Zentralisierung, DNS-Zonen, Genehmigungsworkflow, Netzwerkrichtlinien, Kosten und die Deaktivierung öffentlicher Zugriffe müssen pro Dienst geplant werden. Hybrid- und Peeringnetze können den Endpoint über private Konnektivität erreichen."
      },
      "tags": [
        "AZ-900",
        "Networking",
        "private-endpoint",
        "private-link",
        "zero-trust",
        "networking-pilot-v1.2"
      ],
      "sources": [
        "ms-private-link",
        "ms-private-dns"
      ]
    },
    "azure-0887": {
      "id": "azure-0887",
      "title": "Virtual Network Peering",
      "parent": "azure-0816",
      "description": {
        "simple": "VNet Peering verbindet zwei Virtual Networks privat miteinander. Ressourcen kommunizieren über das Microsoft-Backbone, als wären die Netzwerke direkt verbunden.",
        "technical": "Peering stellt private, niedrig-latente IP-Konnektivität zwischen VNets in derselben oder in unterschiedlichen Regionen bereit. Die Adressräume dürfen sich nicht überschneiden. Peering ist standardmäßig nicht transitiv; Weiterleitung, Gateway Transit und DNS müssen separat konfiguriert werden.",
        "architecture": "Peering ist der Standardbaustein für Hub-and-Spoke-Topologien und direkte VNet-Konnektivität. Adressmanagement, nichttransitive Pfade, zentrale Inspektion, Gateway Transit, Cross-Subscription- oder Cross-Tenant-Berechtigungen und Kosten müssen geplant werden."
      },
      "tags": [
        "AZ-900",
        "Networking",
        "vnet-peering",
        "backbone",
        "hub-spoke",
        "networking-pilot-v1.2"
      ],
      "sources": [
        "ms-vnet-peering",
        "ms-vnet-subnets"
      ]
    },
    "azure-0904": {
      "id": "azure-0904",
      "title": "Microsoft Entra ID",
      "parent": "azure-0902",
      "description": {
        "simple": "Microsoft Entra ID ist Microsofts cloudbasierter Dienst für Identitäten und Zugriffe. Er verwaltet unter anderem Benutzer, Gruppen, Geräte und Anwendungen und prüft Anmeldungen für Azure, Microsoft 365 und integrierte Apps.",
        "technical": "Entra ID stellt Verzeichnis-, Authentifizierungs-, Token- und Policyfunktionen für Workforce- und Workload-Identitäten bereit. Ein Tenant ist eine dedizierte Instanz mit Objekten, Domains, Anwendungen, Rollen und Richtlinien. Moderne Anwendungen integrieren typischerweise OAuth 2.0, OpenID Connect oder SAML.",
        "architecture": "Entra ID ist die Identitäts-Control-Plane und damit eine geschäftskritische Abhängigkeit. Tenant-Struktur, administrative Rollen, Authentifizierungsmethoden, Conditional Access, Workload-Identitäten und Notfallzugang müssen als Plattformstandard betrieben werden. Ein Entra Tenant ist nicht dasselbe wie eine Azure Subscription, besitzt aber Vertrauensbeziehungen zu ihr."
      },
      "tags": [
        "AZ-900",
        "Identity",
        "entra-id",
        "identity-provider",
        "tenant",
        "identity-pilot-v1.3"
      ],
      "sources": [
        "ms-entra-name",
        "ms-entra-overview",
        "ms-identity-fundamentals"
      ]
    },
    "azure-0933": {
      "id": "azure-0933",
      "title": "Microsoft Defender for Cloud",
      "parent": "azure-0932",
      "description": {
        "simple": "Microsoft Defender for Cloud bewertet die Sicherheitslage von Cloud-Ressourcen und zeigt Risiken, Empfehlungen und Compliance-Ergebnisse. Je nach aktiviertem Plan ergänzt der Dienst außerdem Schutz für laufende Workloads.",
        "technical": "Defender for Cloud verbindet Cloud Security Posture Management mit Workload Protection für Azure, Hybrid- und Multicloudressourcen. Es inventarisiert Assets, bewertet Konfigurationen, priorisiert Empfehlungen und ordnet Findings unterstützten Standards zu. Regulatory Compliance basiert auf zugewiesenen Azure-Policy-Initiatives und scopespezifischer Bewertung.",
        "architecture": "Defender for Cloud ist eine zentrale Security-Governance-Sicht, aber keine automatische Risikobehebung. Scope-Onboarding, Pläne, Policy Assignments, Exemptions, Datenquellen, Kosten und Alert-Ownership müssen bewusst betrieben werden. Governance-Teams definieren Standards; Workload- und Security-Teams beheben Findings nach Risiko."
      },
      "tags": [
        "AZ-900",
        "Security",
        "defender-for-cloud",
        "cspm",
        "security-governance",
        "governance-pilot-v1.5"
      ],
      "sources": [
        "ms-defender-overview",
        "ms-defender-posture",
        "ms-defender-regulatory"
      ]
    },
    "azure-0947": {
      "id": "azure-0947",
      "title": "Managed Identity",
      "parent": "azure-0946",
      "description": {
        "simple": "Eine Managed Identity gibt einem Azure-Dienst eine automatisch verwaltete Identität in Entra ID. Anwendungen können damit auf andere Dienste zugreifen, ohne Passwörter oder Client Secrets im Code zu speichern.",
        "technical": "System-assigned Managed Identities sind an den Lebenszyklus einer Azure-Ressource gebunden; user-assigned Identitäten sind eigenständige Ressourcen und können mehreren Workloads zugeordnet werden. Intern werden spezielle Service Principals verwendet. Der Workload fordert ein Access Token an und benötigt anschließend die passende Zielberechtigung, beispielsweise eine Azure-RBAC-Rolle.",
        "architecture": "Managed Identity ist für Azure-Workloads meist statischen Credentials vorzuziehen. Die Wahl system- oder user-assigned beeinflusst Lebenszyklus, Wiederverwendung und Berechtigungsverwaltung. Identität ersetzt keine Autorisierung: Zielrollen, Netzwerkzugriff und Secret-freie Anwendungskonfiguration bleiben separat zu planen."
      },
      "tags": [
        "AZ-900",
        "Identity",
        "managed-identity",
        "workload-identity",
        "secretless",
        "identity-pilot-v1.3"
      ],
      "sources": [
        "ms-managed-identities",
        "ms-app-objects"
      ]
    },
    "azure-0962": {
      "id": "azure-0962",
      "title": "Azure Policy",
      "parent": "azure-0961",
      "description": {
        "simple": "Azure Policy bewertet Azure-Ressourcen gegen organisatorische Regeln und kann unerwünschte Konfigurationen melden, blockieren oder korrigieren. Der Dienst wird verwendet, um Standards und Compliance über viele Scopes konsistent umzusetzen.",
        "technical": "Policy Definitions beschreiben Bedingungen und Effects; Policy Assignments binden Definitionen oder Initiatives an Management Groups, Subscriptions, Resource Groups oder Ressourcen. Policy Insights erzeugt Compliance States für anwendbare Ressourcen. Exclusions, Exemptions, Parameter und Enforcement Mode steuern die konkrete Anwendung.",
        "architecture": "Policy ergänzt RBAC: RBAC entscheidet, wer Managementaktionen ausführen darf, Policy bewertet, was als Ressourcenzustand zulässig ist. Breite Assignments benötigen gestufte Einführung, versionierten Policy-as-Code-Workflow und klare Exemption-Governance. Nicht jeder Security- oder Anwendungskontrollpunkt ist über Resource-Manager-Eigenschaften prüfbar."
      },
      "tags": [
        "AZ-900",
        "Governance",
        "azure-policy",
        "resource-governance",
        "compliance",
        "governance-pilot-v1.5"
      ],
      "sources": [
        "ms-policy-overview",
        "ms-policy-definitions",
        "ms-policy-assignments",
        "ms-policy-compliance"
      ]
    },
    "azure-0983": {
      "id": "azure-0983",
      "title": "Azure Monitor",
      "parent": "azure-0979",
      "description": {
        "simple": "Azure Monitor ist der zentrale Azure-Dienst für Telemetrie und Observability. Er sammelt und verarbeitet Metriken, Logs, Traces und Events aus Anwendungen, Azure-Ressourcen und hybriden Umgebungen. Analysen, Visualisierungen und Alerts machen daraus Betriebsinformationen.",
        "technical": "Metrics speichert numerische Zeitreihen für schnelle Auswertung; Azure Monitor Logs speichert strukturierte Datensätze in Log Analytics Workspaces und wird mit KQL abgefragt. Application Insights instrumentiert Anwendungen. Diagnostic Settings und Data Collection Rules steuern ausgewählte Datenpfade, wobei Retention, Limits und Kosten je Datentyp variieren.",
        "architecture": "Architekten entscheiden Scope, Workspace-Topologie, Datengrenzen, Aufbewahrung, Zugriffsmodell und Ausfallsicht. Metrics eignen sich für schnelle Erkennung, Logs und Traces für Kontext und Root-Cause-Analyse. Der Kunde verantwortet Instrumentierung, relevante Diagnostic Settings, Alertregeln, Zugriff und Reaktion."
      },
      "tags": [
        "AZ-900",
        "Monitoring",
        "azure-monitor",
        "metrics",
        "logs",
        "traces",
        "monitoring-operations-pilot-v1.8"
      ],
      "sources": [
        "ms-azure-monitor-overview",
        "ms-azure-monitor-data-platform",
        "ms-operations-observability"
      ]
    },
    "azure-0984": {
      "id": "azure-0984",
      "title": "Azure Monitor Alerts",
      "parent": "azure-0983",
      "description": {
        "simple": "Azure Monitor Alerts benachrichtigen oder automatisieren, wenn eine definierte Bedingung erfüllt ist. Ein Alert ist ein technisches Signal, noch kein vollständig bearbeiteter Incident. Gute Alerts sind relevant, eindeutig zugeordnet und handlungsfähig.",
        "technical": "Alert Rules werten Metriken, Logabfragen, Activity Logs oder andere unterstützte Signale aus. Action Groups versenden Benachrichtigungen oder starten Automatisierung. Stateful-Verhalten, Auswertungsfenster, Häufigkeit und Schwellen beeinflussen Verzögerung, Fehlalarme und Kosten.",
        "architecture": "Alerts werden aus SLOs, Health-Zuständen und konkreten Runbooks abgeleitet. Zu empfindliche Regeln erzeugen Alarmmüdigkeit, zu grobe Regeln erkennen Störungen zu spät. Ein Incident beginnt, wenn Menschen oder Automatisierung die Auswirkung koordinieren, priorisieren und beheben."
      },
      "tags": [
        "AZ-900",
        "Monitoring",
        "alerts",
        "incident-response",
        "action-groups",
        "monitoring-operations-pilot-v1.8"
      ],
      "sources": [
        "ms-monitor-alerts",
        "ms-operations-observability"
      ]
    },
    "azure-0985": {
      "id": "azure-0985",
      "title": "Log Analytics Workspace",
      "parent": "azure-0984",
      "description": {
        "simple": "Ein Log Analytics Workspace ist der zentrale Datenspeicher für Azure Monitor Logs. Er organisiert Telemetrie in Tabellen und macht sie mit Kusto Query Language analysierbar. Zugriff, Aufbewahrung und Kosten werden am Workspace und an Tabellen gesteuert.",
        "technical": "Daten werden über Diagnostic Settings, Agents, Data Collection Rules, APIs und integrierte Dienste aufgenommen. Tabellen besitzen Schema, Plan und Retention; Abfragen nutzen KQL. Workspace- und Ressourcenkontext sowie Azure RBAC bestimmen, welche Datensätze ein Benutzer lesen darf.",
        "architecture": "Die Workspace-Topologie balanciert zentrale Korrelation gegen Isolation, Datenresidenz, Security-Grenzen und Kostenverantwortung. Ein Workspace pro Ressource verhindert oft sinnvolle Korrelation; ein einziger globaler Workspace kann Zugriff und Governance erschweren. Aufbewahrung folgt Diagnose-, Compliance- und Kostenbedarf."
      },
      "tags": [
        "AZ-900",
        "Monitoring",
        "log-analytics-workspace",
        "kql",
        "log-architecture",
        "monitoring-operations-pilot-v1.8"
      ],
      "sources": [
        "ms-monitor-logs",
        "ms-log-analytics",
        "ms-cloud-estate-monitor"
      ]
    },
    "azure-0987": {
      "id": "azure-0987",
      "title": "Application Insights",
      "parent": "azure-0983",
      "description": {
        "simple": "Application Insights überwacht Laufzeit, Leistung und Nutzung von Anwendungen. Es sammelt Requests, Abhängigkeiten, Ausnahmen, Traces und weitere Telemetrie. Dadurch sehen Entwickler Probleme aus Sicht der Anwendung und ihrer Benutzerflüsse.",
        "technical": "Instrumentierung erfolgt über OpenTelemetry, SDKs oder unterstützte automatische Instrumentierung. Telemetrie wird in Azure Monitor verarbeitet und workspacebasiert in Log Analytics gespeichert; Application Map korreliert Komponenten und Abhängigkeiten. Sampling, Instrumentierungsabdeckung und Kardinalität begrenzen Genauigkeit und Kosten.",
        "architecture": "Application Insights eignet sich für Code- und Transaktionsebene, ersetzt aber weder Infrastruktur- noch Service-Health-Monitoring. Architekten definieren kritische Flows, Korrelationskontext und Datenfilterung. Mehr Telemetrie verbessert Diagnose, muss aber gegen Performance, Datenschutz und Ingestionskosten abgewogen werden."
      },
      "tags": [
        "AZ-900",
        "Monitoring",
        "application-insights",
        "apm",
        "distributed-tracing",
        "monitoring-operations-pilot-v1.8"
      ],
      "sources": [
        "ms-application-insights",
        "ms-application-map",
        "ms-operations-observability"
      ]
    },
    "azure-0993": {
      "id": "azure-0993",
      "title": "Azure Advisor",
      "parent": "azure-0979",
      "description": {
        "simple": "Azure Advisor analysiert Azure-Konfigurationen und gibt personalisierte Empfehlungen. Die Hinweise betreffen unter anderem Zuverlässigkeit, Sicherheit, Leistung, Kosten und Operational Excellence. Eine Empfehlung ist eine Entscheidungshilfe, keine automatische Architekturfreigabe.",
        "technical": "Advisor bewertet unterstützte Ressourcen und Konfigurationen gegen Microsoft-Heuristiken und Best Practices. Empfehlungen besitzen Kategorie, Auswirkung und mögliche Maßnahme; Advisor Score zeigt Optimierungsfortschritt. Abdeckung, Aktualität und Kontext unterscheiden sich je Dienst und ersetzen keine workloadbezogene Telemetrie.",
        "architecture": "Advisor eignet sich für proaktive Hygiene und regelmäßige Optimierungszyklen. Empfehlungen werden nach Geschäftsrisiko, Abhängigkeiten, Testbarkeit und Aufwand priorisiert; Ausnahmen benötigen Begründung und Ablaufdatum. Blinde Umsetzung kann Kosten oder Risiko an anderer Stelle erhöhen."
      },
      "tags": [
        "AZ-900",
        "Identity",
        "azure-advisor",
        "proactive-operations",
        "optimization",
        "monitoring-operations-pilot-v1.8"
      ],
      "sources": [
        "ms-advisor-overview",
        "ms-advisor-score",
        "ms-cloud-estate-monitor"
      ]
    },
    "azure-1022": {
      "id": "azure-1022",
      "title": "Azure Management Groups",
      "parent": "azure-1011",
      "description": {
        "simple": "Management Groups ordnen mehrere Azure-Subscriptions in einer Hierarchie. Richtlinien und Zugriffszuweisungen an einer Management Group können auf die darunterliegenden Subscriptions vererbt werden.",
        "technical": "Management Groups bilden einen Azure-Resource-Manager-Scope oberhalb von Subscriptions und sind an einen Microsoft-Entra-Tenant gebunden. Jede Subscription hat in der Hierarchie genau einen direkten Management-Group-Elternknoten. Azure Policy und Azure RBAC können auf diesem Scope zugewiesen werden.",
        "architecture": "Die Hierarchie sollte gemeinsame Governanceanforderungen wie Security, Konnektivität, Compliance und Workloadtyp abbilden. Sie sollte stabil bleiben und nicht jede organisatorische Umstrukturierung nachziehen. Root-Zuweisungen sind besonders weitreichend und sollten auf wenige unverzichtbare Kontrollen begrenzt werden."
      },
      "tags": [
        "AZ-900",
        "Governance",
        "management-group",
        "hierarchy",
        "inheritance",
        "governance-pilot-v1.5"
      ],
      "sources": [
        "ms-management-groups",
        "ms-management-group-design"
      ]
    },
    "azure-1034": {
      "id": "azure-1034",
      "title": "Microsoft Cost Management",
      "parent": "azure-1025",
      "description": {
        "simple": "Microsoft Cost Management hilft, Cloudkosten zu analysieren, zu überwachen und zu optimieren. Teams können Kosten nach Scopes und Metadaten untersuchen, Budgets setzen und Daten exportieren.",
        "technical": "Cost Management verarbeitet bewertete Kosten- und Nutzungsdaten und stellt Cost Analysis, Budgets, Alerts, Exports, Cost Details API, Anomalieerkennung und Optimierungshinweise bereit. Berechtigungen und verfügbare Funktionen hängen vom Abrechnungs- und Ressourcenscope ab. Tags und Cost Allocation unterstützen feinere Zuordnung.",
        "architecture": "Cost Management ist die Datengrundlage eines FinOps-Prozesses, aber kein autonomer Kostenoptimierer. Eine skalierbare Lösung verbindet Managementhierarchie, Tagging, Zugriff auf Kostendaten, Budgets, Reports und verantwortete Maßnahmen. Shared Costs und zentrale Plattformen benötigen transparente Allokationsregeln."
      },
      "tags": [
        "AZ-900",
        "Cost & Lifecycle",
        "cost-management",
        "finops",
        "cost-analysis",
        "governance-pilot-v1.5"
      ],
      "sources": [
        "ms-cost-management",
        "ms-cost-analysis"
      ]
    },
    "azure-1042": {
      "id": "azure-1042",
      "title": "Service Level Agreements, Objectives und Indicators",
      "parent": "azure-1010",
      "description": {
        "simple": "Ein SLA ist eine vertragliche Zusage zwischen Anbieter und Kunde. Ein SLO ist ein internes messbares Ziel, ein SLI der dazu verwendete Messwert. Azure-SLAs ersetzen nicht das End-to-End-Ziel einer eigenen Anwendung.",
        "technical": "SLIs messen beispielsweise Erfolgsrate, Latenz, Verfügbarkeit oder Kapazität in einem definierten Beobachtungsfenster. SLOs setzen Schwellen auf diese Indikatoren; Alerts warnen vor Zielverletzungen. Microsoft-SLAs besitzen konkrete Bedingungen, Messmethoden und Ausschlüsse je Dienst.",
        "architecture": "Architekten leiten Workload-SLOs aus kritischen Geschäftsflüssen ab und berücksichtigen Plattform, Code, Konfiguration, Betrieb und Abhängigkeiten. Ein höheres Ziel erhöht typischerweise Kosten und Komplexität. SLA, SLO und Error Budget benötigen getrennte Ownership zwischen Business, Engineering und Provider."
      },
      "tags": [
        "AZ-900",
        "Cost & Lifecycle",
        "sla",
        "slo",
        "sli",
        "reliability-targets",
        "monitoring-operations-pilot-v1.8"
      ],
      "sources": [
        "ms-reliability-targets",
        "ms-sla-concepts",
        "ms-operations-observability"
      ]
    }
  },
  "relationship_types": {
    "depends_on": {
      "id": "depends_on",
      "label": "hängt ab von",
      "inverse_type": "depended_on_by",
      "inverse_label": "ist Abhängigkeit für",
      "description": "Die Funktionsfähigkeit oder Ausgestaltung des Quellobjekts hängt vom Zielobjekt ab.",
      "color": "#ffb454",
      "priority": 90,
      "symmetric": false
    },
    "governed_by": {
      "id": "governed_by",
      "label": "wird gesteuert durch",
      "inverse_type": "governs",
      "inverse_label": "steuert",
      "description": "Das Objekt unterliegt Regeln oder Berechtigungen des verbundenen Objekts.",
      "color": "#ff7e88",
      "priority": 90,
      "symmetric": false
    },
    "monitored_by": {
      "id": "monitored_by",
      "label": "wird überwacht durch",
      "inverse_type": "monitors",
      "inverse_label": "überwacht",
      "description": "Das Objekt wird durch den verbundenen Monitoringdienst überwacht.",
      "color": "#ff9c54",
      "priority": 80,
      "symmetric": false
    },
    "secured_by": {
      "id": "secured_by",
      "label": "wird geschützt durch",
      "inverse_type": "secures",
      "inverse_label": "schützt",
      "description": "Das Objekt wird durch die verbundene Sicherheitsfunktion geschützt.",
      "color": "#ff5f73",
      "priority": 100,
      "symmetric": false
    },
    "uses": {
      "id": "uses",
      "label": "verwendet",
      "inverse_type": "used_by",
      "inverse_label": "wird verwendet von",
      "description": "Ein Service verwendet eine Ressource, Technologie oder Funktion.",
      "color": "#52c7ff",
      "priority": 80,
      "symmetric": false
    }
  },
  "scenario_sources": {
    "ms-ref-webapp-baseline": {
      "id": "ms-ref-webapp-baseline",
      "title": "Baseline highly available zone-redundant web application",
      "url": "https://learn.microsoft.com/en-us/azure/architecture/web-apps/app-service/architectures/baseline-zone-redundant",
      "publisher": "Microsoft Learn",
      "type": "official",
      "accessed_at": "2026-08-11"
    },
    "ms-ref-hub-spoke": {
      "id": "ms-ref-hub-spoke",
      "title": "Hub-spoke network topology in Azure",
      "url": "https://learn.microsoft.com/en-us/azure/architecture/networking/architecture/hub-spoke",
      "publisher": "Microsoft Learn",
      "type": "official",
      "accessed_at": "2026-08-11"
    },
    "ms-ref-hybrid-networking": {
      "id": "ms-ref-hybrid-networking",
      "title": "Connect an on-premises network to Azure",
      "url": "https://learn.microsoft.com/en-us/azure/architecture/reference-architectures/hybrid-networking/",
      "publisher": "Microsoft Learn",
      "type": "official",
      "accessed_at": "2026-08-11"
    },
    "ms-ref-landing-zone": {
      "id": "ms-ref-landing-zone",
      "title": "What is an Azure landing zone?",
      "url": "https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/landing-zone/",
      "publisher": "Microsoft Learn",
      "type": "official",
      "accessed_at": "2026-08-11"
    },
    "ms-ref-landing-zone-design": {
      "id": "ms-ref-landing-zone-design",
      "title": "Azure landing zone design areas and conceptual architecture",
      "url": "https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/landing-zone/design-areas",
      "publisher": "Microsoft Learn",
      "type": "official",
      "accessed_at": "2026-08-11"
    },
    "ms-ref-migrate-workloads": {
      "id": "ms-ref-migrate-workloads",
      "title": "Migrate workloads to Azure",
      "url": "https://learn.microsoft.com/en-us/azure/migration/migrate-to-azure",
      "publisher": "Microsoft Learn",
      "type": "official",
      "accessed_at": "2026-08-11"
    },
    "ms-ref-migrate-plan": {
      "id": "ms-ref-migrate-plan",
      "title": "Plan your migration",
      "url": "https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/migrate/plan-migration",
      "publisher": "Microsoft Learn",
      "type": "official",
      "accessed_at": "2026-08-11"
    },
    "ms-ref-migrate-dependencies": {
      "id": "ms-ref-migrate-dependencies",
      "title": "Dependency analysis in Azure Migrate",
      "url": "https://learn.microsoft.com/en-us/azure/migrate/concepts-dependency-visualization?view=migrate",
      "publisher": "Microsoft Learn",
      "type": "official",
      "accessed_at": "2026-08-11"
    },
    "ms-ref-hybrid-identity": {
      "id": "ms-ref-hybrid-identity",
      "title": "Hybrid identity documentation",
      "url": "https://learn.microsoft.com/en-us/entra/identity/hybrid/",
      "publisher": "Microsoft Learn",
      "type": "official",
      "accessed_at": "2026-08-11"
    }
  }
};
