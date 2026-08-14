window.AZURE_ARCHITECTURE_LEARNING = {
  "schema_version": "2.1",
  "meta": {
    "title": "Azure Digital Brain Architecture Learning Framework",
    "version": "2.1",
    "path_count": 5,
    "created_at": "2026-08-11",
    "learning_mode": "architecture_understanding_not_exam_preparation",
    "knowledge_policy": "references_existing_nodes_and_v2_scenarios_only",
    "new_domain_content": false,
    "github_labs_status": "reference_field_prepared_no_integration",
    "ui_status": "runtime_prepared_not_implemented",
    "step_count": 33,
    "referenced_node_count": 72,
    "referenced_scenario_count": 5,
    "node_reference_count": 127,
    "scenario_reference_count": 53,
    "maturity_level_distribution": {
      "level-1-understand": 2,
      "level-2-connect": 11,
      "level-3-apply": 10,
      "level-4-decide": 10
    },
    "generated_from": "data/canonical/learning-framework.json",
    "generated_at": "2026-08-11T08:25:34.831Z"
  },
  "maturity_levels": [
    {
      "id": "level-1-understand",
      "level": 1,
      "title": "Verstehen",
      "self_check": "Ich weiß, was es ist."
    },
    {
      "id": "level-2-connect",
      "level": 2,
      "title": "Zusammenhänge verstehen",
      "self_check": "Ich weiß, womit es verbunden ist."
    },
    {
      "id": "level-3-apply",
      "level": 3,
      "title": "Anwenden",
      "self_check": "Ich kann es in einem Szenario einsetzen."
    },
    {
      "id": "level-4-decide",
      "level": 4,
      "title": "Architektur entscheiden",
      "self_check": "Ich kann Alternativen bewerten."
    }
  ],
  "user_profile_contract": {
    "profile_schema_version": "1.1",
    "profile_file": "data/user/user-profile.example.json",
    "progress_path": "learning_status[learning_step_id]",
    "progress_fields": [
      "progress_percent",
      "last_opened_at",
      "understanding_level",
      "completed"
    ],
    "notes_path": "notes[learning_step_id]",
    "storage_policy": "personal_data_only_never_canonical",
    "example_file": "data/user/user-profile-learning-v2.1.example.json"
  },
  "learning_paths": [
    {
      "id": "learning-path-azure-mental-model",
      "title": "Azure Mental Model",
      "goal": "Azure als strukturierte Plattform statt als Liste einzelner Dienste verstehen.",
      "outcome": "Ich verstehe, wie eine Azure-Umgebung strukturell aufgebaut ist.",
      "sequence": 1,
      "steps": [
        {
          "id": "learning-step-cloud-foundations",
          "title": "Cloud-Grundlagen als Ausgangspunkt",
          "learning_goal": "Das Betriebs- und Verantwortungsmodell als Grundlage jeder späteren Azure-Entscheidung einordnen.",
          "explanation": "Der Schritt aktiviert vorhandenes Grundlagenwissen und richtet den Blick auf Verantwortung, Skalierung und Verbrauch statt auf Prüfungsdefinitionen.",
          "referenced_nodes": [
            "azure-0001",
            "azure-0197",
            "azure-0229"
          ],
          "referenced_scenarios": [],
          "prerequisites": [],
          "next_learning_steps": [
            "learning-step-azure-regions"
          ],
          "architecture_questions": [
            "Welche Verantwortung bleibt bei welchem Servicemodell beim Kunden?",
            "Welche Anforderungen sollen durch Cloud-Eigenschaften gelöst werden?"
          ],
          "maturity_level": "level-1-understand",
          "practice_references": []
        },
        {
          "id": "learning-step-azure-regions",
          "title": "Regionen als Standort- und Fehlerentscheidung",
          "learning_goal": "Regionen als Grundlage für Latenz, Datenresidenz, Serviceverfügbarkeit und Recovery einordnen.",
          "explanation": "Nicht Regionsnamen lernen, sondern verstehen, welche Geschäfts- und Betriebsanforderungen die Standortwahl beeinflussen.",
          "referenced_nodes": [
            "azure-0237",
            "azure-0236"
          ],
          "referenced_scenarios": [],
          "prerequisites": [
            "learning-step-cloud-foundations"
          ],
          "next_learning_steps": [
            "learning-step-availability-zones"
          ],
          "architecture_questions": [
            "Welche Nutzer, Daten- und Compliance-Anforderungen bestimmen die Region?",
            "Welche Abhängigkeiten sind regional?"
          ],
          "maturity_level": "level-1-understand",
          "practice_references": []
        },
        {
          "id": "learning-step-availability-zones",
          "title": "Availability Zones als lokale Fehlerdomänen",
          "learning_goal": "Zonen von Regionen und von Disaster Recovery abgrenzen.",
          "explanation": "Der Schritt verbindet physische Trennung mit der Frage, welche Komponenten tatsächlich zonenredundant betrieben werden müssen.",
          "referenced_nodes": [
            "azure-0007",
            "azure-0244",
            "azure-0112"
          ],
          "referenced_scenarios": [
            "scenario-highly-available-application"
          ],
          "prerequisites": [
            "learning-step-azure-regions"
          ],
          "next_learning_steps": [
            "learning-step-tenant-boundary"
          ],
          "architecture_questions": [
            "Welche Ausfälle deckt Zonenredundanz ab?",
            "Welche Restkapazität bleibt nach einem Zonenausfall?"
          ],
          "maturity_level": "level-2-connect",
          "practice_references": []
        },
        {
          "id": "learning-step-tenant-boundary",
          "title": "Tenant als Identity- und Vertrauensgrenze",
          "learning_goal": "Die Entra-ID-Ebene als Identitätskontext für Azure-Verwaltung einordnen.",
          "explanation": "Ein dedizierter Tenant-Knoten existiert nicht; der Schritt navigiert bewusst zum vorhandenen Entra-ID-Knoten und vermeidet neues Produktwissen.",
          "referenced_nodes": [
            "azure-0904",
            "azure-0821"
          ],
          "referenced_scenarios": [
            "scenario-hybrid-cloud"
          ],
          "prerequisites": [
            "learning-step-availability-zones"
          ],
          "next_learning_steps": [
            "learning-step-management-groups"
          ],
          "architecture_questions": [
            "Wo beginnt und endet die organisatorische Vertrauensgrenze?",
            "Welche Identitäten verwalten Plattform und Workloads?"
          ],
          "maturity_level": "level-2-connect",
          "practice_references": []
        },
        {
          "id": "learning-step-management-groups",
          "title": "Management Groups als Governance-Hierarchie",
          "learning_goal": "Verstehen, wie Regeln und Zuständigkeiten oberhalb einzelner Subscriptions strukturiert werden.",
          "explanation": "Der Schritt ordnet Management Groups in das Gesamtmodell aus Tenant, Subscriptions und vererbten Guardrails ein.",
          "referenced_nodes": [
            "azure-1022",
            "azure-1023",
            "azure-0038"
          ],
          "referenced_scenarios": [
            "scenario-enterprise-hub-spoke",
            "scenario-cloud-migration"
          ],
          "prerequisites": [
            "learning-step-tenant-boundary"
          ],
          "next_learning_steps": [
            "learning-step-subscriptions"
          ],
          "architecture_questions": [
            "Welche Struktur folgt Governance statt dem Organigramm?",
            "Wo sollen Policies und Zugriffe vererbt werden?"
          ],
          "maturity_level": "level-2-connect",
          "practice_references": []
        },
        {
          "id": "learning-step-subscriptions",
          "title": "Subscriptions als Management-, Abrechnungs- und Skalierungsgrenze",
          "learning_goal": "Subscriptions als bewusste Plattformgrenze statt als bloßen Kostencontainer verstehen.",
          "explanation": "Der Schritt verbindet Organisation, Governance, Zugriff, Quoten und Kostenverantwortung.",
          "referenced_nodes": [
            "azure-1011",
            "azure-1016",
            "azure-0968"
          ],
          "referenced_scenarios": [
            "scenario-enterprise-hub-spoke",
            "scenario-cloud-migration"
          ],
          "prerequisites": [
            "learning-step-management-groups"
          ],
          "next_learning_steps": [
            "learning-step-resource-groups"
          ],
          "architecture_questions": [
            "Welche Workloads benötigen getrennte Subscription-Grenzen?",
            "Wer verantwortet Kosten, Zugriff und Limits?"
          ],
          "maturity_level": "level-2-connect",
          "practice_references": []
        },
        {
          "id": "learning-step-resource-groups",
          "title": "Resource Groups als Workload-Lifecycle-Grenze",
          "learning_goal": "Ressourcen nach gemeinsamem Lifecycle, Verantwortung und Bereitstellung gruppieren.",
          "explanation": "Nicht jede organisatorische Kategorie wird eine Resource Group; entscheidend ist, was zusammen verwaltet und geändert wird.",
          "referenced_nodes": [
            "azure-0277",
            "azure-0281"
          ],
          "referenced_scenarios": [],
          "prerequisites": [
            "learning-step-subscriptions"
          ],
          "next_learning_steps": [
            "learning-step-resource-model"
          ],
          "architecture_questions": [
            "Welche Ressourcen werden gemeinsam bereitgestellt und gelöscht?",
            "Welche Zugriffs- und Monitoringgrenzen entstehen?"
          ],
          "maturity_level": "level-2-connect",
          "practice_references": []
        },
        {
          "id": "learning-step-resource-model",
          "title": "Azure Resource Manager und Ressourcenmodell",
          "learning_goal": "Control Plane, Ressourcenanbieter, deklarative Bereitstellung und Verwaltung als gemeinsames Modell verstehen.",
          "explanation": "Der Schritt verbindet Resource Groups mit ARM, wiederholbarer Bereitstellung und Governance.",
          "referenced_nodes": [
            "azure-0284",
            "azure-0296",
            "azure-0298"
          ],
          "referenced_scenarios": [
            "scenario-cloud-migration"
          ],
          "prerequisites": [
            "learning-step-resource-groups"
          ],
          "next_learning_steps": [
            "learning-step-governance-foundations"
          ],
          "architecture_questions": [
            "Welche Änderungen gehören in automatisierte Deployments?",
            "Wie werden Drift und manuelle Ausnahmen behandelt?"
          ],
          "maturity_level": "level-2-connect",
          "practice_references": []
        },
        {
          "id": "learning-step-governance-foundations",
          "title": "Governance-Grundprinzipien als Leitplanken",
          "learning_goal": "Struktur, Policy, Zugriff, Kosten und Compliance als zusammenhängendes Steuerungsmodell verstehen.",
          "explanation": "Der Abschluss des Mental Models verbindet alle organisatorischen Ebenen mit verbindlichen Guardrails und Verantwortungen.",
          "referenced_nodes": [
            "azure-0036",
            "azure-0037",
            "azure-0040",
            "azure-0962",
            "azure-1034"
          ],
          "referenced_scenarios": [
            "scenario-enterprise-hub-spoke",
            "scenario-cloud-migration"
          ],
          "prerequisites": [
            "learning-step-resource-model"
          ],
          "next_learning_steps": [
            "learning-step-application-dns",
            "learning-step-platform-landing-zone"
          ],
          "architecture_questions": [
            "Welche Leitplanken müssen zentral gelten?",
            "Wo sind Ausnahmen erlaubt und wie werden sie überprüft?"
          ],
          "maturity_level": "level-2-connect",
          "practice_references": []
        }
      ]
    },
    {
      "id": "learning-path-application-journey",
      "title": "Application Journey",
      "goal": "Den Weg einer Benutzeranfrage durch Azure von DNS bis Observability erklären.",
      "outcome": "Ich kann den Weg einer Anwendung durch Azure erklären.",
      "sequence": 2,
      "steps": [
        {
          "id": "learning-step-application-dns",
          "title": "DNS: Namen werden zu erreichbaren Endpunkten",
          "learning_goal": "Namensauflösung als ersten technischen Pfad einer Anwendung einordnen.",
          "explanation": "Der Fokus liegt auf der Frage, welcher Name öffentlich oder privat zu welchem Einstiegspunkt aufgelöst werden soll.",
          "referenced_nodes": [
            "azure-0545",
            "azure-0558"
          ],
          "referenced_scenarios": [
            "scenario-secure-web-application"
          ],
          "prerequisites": [
            "learning-step-governance-foundations"
          ],
          "next_learning_steps": [
            "learning-step-application-traffic-management"
          ],
          "architecture_questions": [
            "Wer ist autoritativ für den Namen?",
            "Wie unterscheidet sich öffentliche von privater Auflösung?"
          ],
          "maturity_level": "level-2-connect",
          "practice_references": []
        },
        {
          "id": "learning-step-application-traffic-management",
          "title": "Traffic Management: global, regional oder Layer 4",
          "learning_goal": "Front Door, Application Gateway und Load Balancer nach Traffic-Aufgabe abgrenzen.",
          "explanation": "Der Schritt folgt der Anfrage und wählt den Einstieg nicht nach Produktnamen, sondern nach Scope, Protokoll und Routingbedarf.",
          "referenced_nodes": [
            "azure-0562",
            "azure-0519",
            "azure-0505"
          ],
          "referenced_scenarios": [
            "scenario-secure-web-application",
            "scenario-highly-available-application"
          ],
          "prerequisites": [
            "learning-step-application-dns"
          ],
          "next_learning_steps": [
            "learning-step-application-security-layer"
          ],
          "architecture_questions": [
            "Ist das Routing global oder regional?",
            "Werden HTTP-Inhalte oder nur Netzwerkflüsse ausgewertet?"
          ],
          "maturity_level": "level-3-apply",
          "practice_references": []
        },
        {
          "id": "learning-step-application-security-layer",
          "title": "Security Layer: prüfen, segmentieren und begrenzen",
          "learning_goal": "WAF, Firewall, NSG und DDoS als unterschiedliche Schutzaufgaben im Pfad verstehen.",
          "explanation": "Die Anfrage durchläuft Controls auf unterschiedlichen Ebenen; kein einzelner Dienst ersetzt alle anderen.",
          "referenced_nodes": [
            "azure-0863",
            "azure-0841",
            "azure-0864",
            "azure-0852"
          ],
          "referenced_scenarios": [
            "scenario-secure-web-application",
            "scenario-enterprise-hub-spoke"
          ],
          "prerequisites": [
            "learning-step-application-traffic-management"
          ],
          "next_learning_steps": [
            "learning-step-application-compute"
          ],
          "architecture_questions": [
            "Welche Schicht kontrolliert welchen Traffic?",
            "Wo entstehen zentrale und workloadnahe Verantwortungen?"
          ],
          "maturity_level": "level-3-apply",
          "practice_references": []
        },
        {
          "id": "learning-step-application-compute",
          "title": "Application Layer: wo läuft die Logik?",
          "learning_goal": "VM, App Service und AKS als Betriebsmodelle für dieselbe fachliche Anwendung vergleichen.",
          "explanation": "Der Schritt betrachtet die verbleibende Kundenverantwortung, benötigte Kontrolle und Plattformkomplexität.",
          "referenced_nodes": [
            "azure-0322",
            "azure-0351",
            "azure-0425"
          ],
          "referenced_scenarios": [
            "scenario-secure-web-application"
          ],
          "prerequisites": [
            "learning-step-application-security-layer"
          ],
          "next_learning_steps": [
            "learning-step-application-data"
          ],
          "architecture_questions": [
            "Welche Betriebssystem- oder Orchestrierungskontrolle ist wirklich nötig?",
            "Welche Skalierungs- und Deploymentanforderungen bestehen?"
          ],
          "maturity_level": "level-3-apply",
          "practice_references": []
        },
        {
          "id": "learning-step-application-data",
          "title": "Data Layer: relational, verteilt oder objektbasiert",
          "learning_goal": "Datenanforderungen vor der Produktauswahl strukturieren.",
          "explanation": "SQL Database, Cosmos DB und Storage Account werden als unterschiedliche Datenmodelle und Betriebsentscheidungen betrachtet.",
          "referenced_nodes": [
            "azure-0731",
            "azure-0724",
            "azure-0579"
          ],
          "referenced_scenarios": [
            "scenario-secure-web-application"
          ],
          "prerequisites": [
            "learning-step-application-compute"
          ],
          "next_learning_steps": [
            "learning-step-application-private-access"
          ],
          "architecture_questions": [
            "Welche Konsistenz, Abfrage, Skalierung und Transaktion wird benötigt?",
            "Welche Daten gehören nicht in die Compute-Schicht?"
          ],
          "maturity_level": "level-3-apply",
          "practice_references": []
        },
        {
          "id": "learning-step-application-private-access",
          "title": "Private Access: Datenpfad und Identität zusammenführen",
          "learning_goal": "Public und Private Endpoint zusammen mit DNS, Routing und Managed Identity bewerten.",
          "explanation": "Privater Netzwerkzugriff und Autorisierung lösen verschiedene Probleme und müssen gemeinsam funktionieren.",
          "referenced_nodes": [
            "azure-0884",
            "azure-0881",
            "azure-0558",
            "azure-0947"
          ],
          "referenced_scenarios": [
            "scenario-secure-web-application",
            "scenario-enterprise-hub-spoke"
          ],
          "prerequisites": [
            "learning-step-application-data"
          ],
          "next_learning_steps": [
            "learning-step-application-observability"
          ],
          "architecture_questions": [
            "Muss der Dienst öffentlich erreichbar sein?",
            "Wie werden Name, Route und Berechtigung konsistent?"
          ],
          "maturity_level": "level-3-apply",
          "practice_references": []
        },
        {
          "id": "learning-step-application-observability",
          "title": "Monitoring: den vollständigen Nutzerfluss sichtbar machen",
          "learning_goal": "Metrics, Logs, Traces und Alerts mit dem Application Journey verbinden.",
          "explanation": "Der Pfad endet nicht beim erfolgreichen Deployment, sondern bei der Fähigkeit, Nutzerwirkung und Ursachen zu erkennen.",
          "referenced_nodes": [
            "azure-0983",
            "azure-0987",
            "azure-0985",
            "azure-0984"
          ],
          "referenced_scenarios": [
            "scenario-secure-web-application",
            "scenario-highly-available-application"
          ],
          "prerequisites": [
            "learning-step-application-private-access"
          ],
          "next_learning_steps": [
            "learning-step-decision-compute",
            "learning-step-scenario-secure-web"
          ],
          "architecture_questions": [
            "Welche Signale zeigen den Geschäftsfluss?",
            "Welche Alerts führen zu einer konkreten Handlung?"
          ],
          "maturity_level": "level-3-apply",
          "practice_references": []
        }
      ]
    },
    {
      "id": "learning-path-enterprise-platform",
      "title": "Enterprise Platform Architecture",
      "goal": "Die gemeinsame Plattform hinter einzelnen Workloads verstehen.",
      "outcome": "Ich verstehe die Plattform hinter einzelnen Workloads.",
      "sequence": 3,
      "steps": [
        {
          "id": "learning-step-platform-landing-zone",
          "title": "Landing Zone als vorbereitete Zielplattform",
          "learning_goal": "Landing Zone als Zusammenspiel mehrerer Designbereiche verstehen.",
          "explanation": "Der Einstieg verbindet Organisation, Identity, Netzwerk, Security, Governance und Management vor dem ersten Workload.",
          "referenced_nodes": [
            "azure-0054",
            "azure-1022",
            "azure-1011"
          ],
          "referenced_scenarios": [
            "scenario-cloud-migration",
            "scenario-enterprise-hub-spoke"
          ],
          "prerequisites": [
            "learning-step-governance-foundations"
          ],
          "next_learning_steps": [
            "learning-step-platform-governance"
          ],
          "architecture_questions": [
            "Welche Plattformfähigkeiten müssen vor Workloads bereitstehen?",
            "Wer besitzt Plattform- und Application-Landing-Zones?"
          ],
          "maturity_level": "level-2-connect",
          "practice_references": []
        },
        {
          "id": "learning-step-platform-governance",
          "title": "Governance Foundation",
          "learning_goal": "Managementstruktur, Policy, Kosten und Compliance als Plattformvertrag einordnen.",
          "explanation": "Governance stellt wiederholbare Leitplanken bereit, ohne jede Workloadentscheidung zentral zu übernehmen.",
          "referenced_nodes": [
            "azure-0036",
            "azure-0962",
            "azure-1022",
            "azure-1034"
          ],
          "referenced_scenarios": [
            "scenario-cloud-migration",
            "scenario-enterprise-hub-spoke"
          ],
          "prerequisites": [
            "learning-step-platform-landing-zone"
          ],
          "next_learning_steps": [
            "learning-step-platform-identity"
          ],
          "architecture_questions": [
            "Welche Entscheidungen sind zentral verbindlich?",
            "Wie werden Ausnahmen und Kosten verantwortet?"
          ],
          "maturity_level": "level-2-connect",
          "practice_references": []
        },
        {
          "id": "learning-step-platform-identity",
          "title": "Identity Foundation",
          "learning_goal": "Benutzer-, Workload- und privilegierte Identitäten als Plattformgrenze verstehen.",
          "explanation": "Entra ID, RBAC, PIM und Managed Identity bilden zusammen Authentifizierung, Autorisierung und Betriebszugriff.",
          "referenced_nodes": [
            "azure-0904",
            "azure-0964",
            "azure-0046",
            "azure-0947",
            "azure-0966"
          ],
          "referenced_scenarios": [
            "scenario-secure-web-application",
            "scenario-hybrid-cloud",
            "scenario-cloud-migration"
          ],
          "prerequisites": [
            "learning-step-platform-governance"
          ],
          "next_learning_steps": [
            "learning-step-platform-network"
          ],
          "architecture_questions": [
            "Welche Identitäten benötigen welchen Scope?",
            "Wie werden dauerhafte Privilegien und Secrets vermieden?"
          ],
          "maturity_level": "level-2-connect",
          "practice_references": []
        },
        {
          "id": "learning-step-platform-network",
          "title": "Network Foundation",
          "learning_goal": "Adressierung, Hub-Spoke, Hybridpfade, DNS und zentrale Inspection als Plattformfähigkeit verbinden.",
          "explanation": "Das Netzwerk wird als wiederverwendbarer Connectivity-Vertrag für Workloads betrachtet.",
          "referenced_nodes": [
            "azure-0442",
            "azure-0887",
            "azure-0841",
            "azure-0478",
            "azure-0462",
            "azure-0558"
          ],
          "referenced_scenarios": [
            "scenario-enterprise-hub-spoke",
            "scenario-hybrid-cloud"
          ],
          "prerequisites": [
            "learning-step-platform-identity"
          ],
          "next_learning_steps": [
            "learning-step-platform-security"
          ],
          "architecture_questions": [
            "Welche Pfade werden zentral bereitgestellt?",
            "Wo bleiben Isolation und Verantwortung beim Workload?"
          ],
          "maturity_level": "level-3-apply",
          "practice_references": []
        },
        {
          "id": "learning-step-platform-security",
          "title": "Security Baseline",
          "learning_goal": "Präventive, detektive und wiederherstellende Controls als Plattformbaseline einordnen.",
          "explanation": "Policy, Defender, Netzwerk- und Identity-Controls bilden eine gemeinsame Schutzarchitektur.",
          "referenced_nodes": [
            "azure-0815",
            "azure-0817",
            "azure-0933",
            "azure-0074"
          ],
          "referenced_scenarios": [
            "scenario-secure-web-application",
            "scenario-enterprise-hub-spoke",
            "scenario-cloud-migration"
          ],
          "prerequisites": [
            "learning-step-platform-network"
          ],
          "next_learning_steps": [
            "learning-step-platform-monitoring"
          ],
          "architecture_questions": [
            "Welche Baselines sind zentral, welche workloadbezogen?",
            "Wie werden Findings priorisiert und behoben?"
          ],
          "maturity_level": "level-3-apply",
          "practice_references": []
        },
        {
          "id": "learning-step-platform-monitoring",
          "title": "Monitoring Foundation",
          "learning_goal": "Workspace-, Telemetrie-, Alert- und Health-Standards als Plattformservice verstehen.",
          "explanation": "Zentrale Observability schafft Korrelation, während Workloadteams Instrumentierung und fachliche Interpretation behalten.",
          "referenced_nodes": [
            "azure-0979",
            "azure-0983",
            "azure-0985",
            "azure-0984"
          ],
          "referenced_scenarios": [
            "scenario-enterprise-hub-spoke",
            "scenario-hybrid-cloud",
            "scenario-highly-available-application"
          ],
          "prerequisites": [
            "learning-step-platform-security"
          ],
          "next_learning_steps": [
            "learning-step-platform-operations"
          ],
          "architecture_questions": [
            "Welche Daten werden zentral gesammelt?",
            "Wie bleiben Zugriff, Kosten und Ownership beherrschbar?"
          ],
          "maturity_level": "level-3-apply",
          "practice_references": []
        },
        {
          "id": "learning-step-platform-operations",
          "title": "Operations und kontinuierliche Verbesserung",
          "learning_goal": "Owner, Runbooks, Incident, Advisor, Kosten und Lessons Learned als Regelkreis verbinden.",
          "explanation": "Die Plattform wird nicht nur bereitgestellt, sondern über messbare Betriebsziele und Verbesserungszyklen weiterentwickelt.",
          "referenced_nodes": [
            "azure-0094",
            "azure-0993",
            "azure-0999",
            "azure-1034"
          ],
          "referenced_scenarios": [
            "scenario-enterprise-hub-spoke",
            "scenario-hybrid-cloud",
            "scenario-cloud-migration"
          ],
          "prerequisites": [
            "learning-step-platform-monitoring"
          ],
          "next_learning_steps": [
            "learning-step-decision-compute",
            "learning-step-scenario-hub-spoke"
          ],
          "architecture_questions": [
            "Wer reagiert auf welches Signal?",
            "Wie fließen Incidents und Empfehlungen zurück in Baselines?"
          ],
          "maturity_level": "level-3-apply",
          "practice_references": []
        }
      ]
    },
    {
      "id": "learning-path-architecture-decisions",
      "title": "Architecture Decision Making",
      "goal": "Architekturentscheidungen aus Anforderungen, Alternativen und Trade-offs begründen.",
      "outcome": "Ich kann begründen, warum eine Architektur gewählt wird.",
      "sequence": 4,
      "steps": [
        {
          "id": "learning-step-decision-compute",
          "title": "VM versus App Service versus Container",
          "learning_goal": "Compute nach Betriebsverantwortung, Portabilität, Orchestrierung und Skalierung wählen.",
          "explanation": "Die Entscheidung beginnt mit Anforderungen an Kontrolle und Betrieb, nicht mit einem bevorzugten Dienst.",
          "referenced_nodes": [
            "azure-0322",
            "azure-0351",
            "azure-0415",
            "azure-0425"
          ],
          "referenced_scenarios": [
            "scenario-secure-web-application",
            "scenario-cloud-migration"
          ],
          "prerequisites": [
            "learning-step-application-observability",
            "learning-step-platform-operations"
          ],
          "next_learning_steps": [
            "learning-step-decision-traffic"
          ],
          "architecture_questions": [
            "Welche OS-Kontrolle und Plattformverantwortung wird benötigt?",
            "Ist Kubernetes-Komplexität fachlich gerechtfertigt?",
            "Wie ändern sich Patching, Skalierung und Deployment?"
          ],
          "maturity_level": "level-4-decide",
          "decision_framework": {
            "options": [
              "azure-0322",
              "azure-0351",
              "azure-0415",
              "azure-0425"
            ],
            "criteria": [
              "OS control",
              "operating responsibility",
              "orchestration",
              "scaling",
              "deployment model"
            ],
            "tradeoffs": [
              "control versus managed platform",
              "portability versus operational complexity"
            ],
            "typical_use_cases": [
              "legacy or specialized VM workload",
              "managed web application",
              "single container job",
              "microservice platform"
            ]
          },
          "practice_references": []
        },
        {
          "id": "learning-step-decision-traffic",
          "title": "Load Balancer versus Application Gateway versus Front Door",
          "learning_goal": "Trafficdienste nach globalem Scope, Protokoll, Layer und Security-Funktion wählen.",
          "explanation": "Die Optionen bilden unterschiedliche Teile eines Pfads und sind nicht automatisch Alternativen auf derselben Ebene.",
          "referenced_nodes": [
            "azure-0505",
            "azure-0519",
            "azure-0562",
            "azure-0863"
          ],
          "referenced_scenarios": [
            "scenario-secure-web-application",
            "scenario-highly-available-application"
          ],
          "prerequisites": [
            "learning-step-decision-compute"
          ],
          "next_learning_steps": [
            "learning-step-decision-hybrid-connectivity"
          ],
          "architecture_questions": [
            "Ist der Scope global oder regional?",
            "Ist Layer 4 oder Layer 7 erforderlich?",
            "Wo sollen WAF, TLS und Health-Entscheidungen liegen?"
          ],
          "maturity_level": "level-4-decide",
          "decision_framework": {
            "options": [
              "azure-0505",
              "azure-0519",
              "azure-0562"
            ],
            "criteria": [
              "scope",
              "protocol",
              "routing depth",
              "WAF",
              "origin topology"
            ],
            "tradeoffs": [
              "simplicity versus application-aware routing",
              "regional versus global control"
            ],
            "typical_use_cases": [
              "TCP/UDP distribution",
              "regional web ingress",
              "global web entry"
            ]
          },
          "practice_references": []
        },
        {
          "id": "learning-step-decision-hybrid-connectivity",
          "title": "VPN versus ExpressRoute",
          "learning_goal": "Hybridkonnektivität nach Privatheit, Durchsatz, Bereitstellungszeit, Kosten und Resilienz wählen.",
          "explanation": "Die Entscheidung bewertet den gesamten Pfad einschließlich Provider, Gateway, Routing und Backup-Option.",
          "referenced_nodes": [
            "azure-0462",
            "azure-0478",
            "azure-0461"
          ],
          "referenced_scenarios": [
            "scenario-enterprise-hub-spoke",
            "scenario-hybrid-cloud"
          ],
          "prerequisites": [
            "learning-step-decision-traffic"
          ],
          "next_learning_steps": [
            "learning-step-decision-endpoints"
          ],
          "architecture_questions": [
            "Welche Verfügbarkeit und Bandbreite sind erforderlich?",
            "Muss der Pfad privat sein?",
            "Welcher zweite Fehlerpfad existiert?"
          ],
          "maturity_level": "level-4-decide",
          "decision_framework": {
            "options": [
              "azure-0462",
              "azure-0478"
            ],
            "criteria": [
              "privacy",
              "bandwidth",
              "latency predictability",
              "lead time",
              "cost",
              "resilience"
            ],
            "tradeoffs": [
              "fast deployment versus private circuit",
              "lower cost versus predictable connectivity"
            ],
            "typical_use_cases": [
              "initial or backup hybrid path",
              "mission-critical enterprise connectivity"
            ]
          },
          "practice_references": []
        },
        {
          "id": "learning-step-decision-endpoints",
          "title": "Public Endpoint versus Private Endpoint",
          "learning_goal": "Erreichbarkeit, Angriffsfläche, DNS, Routing und Betriebsaufwand gemeinsam bewerten.",
          "explanation": "Privatheit ist eine Architekturentscheidung mit Netzwerk- und DNS-Folgen, nicht nur ein Schalter am Dienst.",
          "referenced_nodes": [
            "azure-0884",
            "azure-0881",
            "azure-0558",
            "azure-0864"
          ],
          "referenced_scenarios": [
            "scenario-secure-web-application",
            "scenario-enterprise-hub-spoke"
          ],
          "prerequisites": [
            "learning-step-decision-hybrid-connectivity"
          ],
          "next_learning_steps": [
            "learning-step-decision-data"
          ],
          "architecture_questions": [
            "Wer muss den Dienst von wo erreichen?",
            "Wie werden DNS und Public Access kontrolliert?",
            "Ist der zusätzliche Netzwerkbetrieb gerechtfertigt?"
          ],
          "maturity_level": "level-4-decide",
          "decision_framework": {
            "options": [
              "azure-0884",
              "azure-0881"
            ],
            "criteria": [
              "reachability",
              "data sensitivity",
              "exfiltration risk",
              "DNS model",
              "operations"
            ],
            "tradeoffs": [
              "simple reachability versus private isolation",
              "lower complexity versus reduced public exposure"
            ],
            "typical_use_cases": [
              "controlled public API",
              "private PaaS dependency"
            ]
          },
          "practice_references": []
        },
        {
          "id": "learning-step-decision-data",
          "title": "SQL Database versus andere Datenlösungen",
          "learning_goal": "Datenservice aus Datenmodell, Konsistenz, Zugriff, Skalierung und Betrieb ableiten.",
          "explanation": "Die Auswahl trennt relationale Transaktionen, global verteilte NoSQL-Anforderungen und objektbasierte Speicherung.",
          "referenced_nodes": [
            "azure-0731",
            "azure-0724",
            "azure-0579"
          ],
          "referenced_scenarios": [
            "scenario-secure-web-application",
            "scenario-cloud-migration"
          ],
          "prerequisites": [
            "learning-step-decision-endpoints"
          ],
          "next_learning_steps": [
            "learning-step-scenario-secure-web"
          ],
          "architecture_questions": [
            "Welche Transaktionen und Abfragen sind erforderlich?",
            "Welche Konsistenz und globale Verteilung wird benötigt?",
            "Welche Daten sind Objekte statt Datensätze?"
          ],
          "maturity_level": "level-4-decide",
          "decision_framework": {
            "options": [
              "azure-0731",
              "azure-0724",
              "azure-0579"
            ],
            "criteria": [
              "data model",
              "transactions",
              "consistency",
              "distribution",
              "query pattern",
              "cost model"
            ],
            "tradeoffs": [
              "relational guarantees versus flexible distribution",
              "query capability versus object simplicity"
            ],
            "typical_use_cases": [
              "relational line-of-business data",
              "globally distributed NoSQL",
              "files and objects"
            ]
          },
          "practice_references": []
        }
      ]
    },
    {
      "id": "learning-path-enterprise-scenarios",
      "title": "Enterprise Scenario Learning",
      "goal": "Vorwissen, Architekturverständnis und Designentscheidung an realen Enterprise-Szenarien verbinden.",
      "outcome": "Ich kann eine Azure-Lösung von Anforderungen bis Architektur nachvollziehen.",
      "sequence": 5,
      "steps": [
        {
          "id": "learning-step-scenario-secure-web",
          "title": "Szenario anwenden: Secure Web Application",
          "learning_goal": "Den vollständigen Webpfad aus Anforderungen, Komponenten und Trade-offs erklären und Varianten begründen.",
          "explanation": "Vorwissen: Application Journey und Compute/Traffic/Endpoint/Data-Entscheidungen. Danach wird das V2.0-Szenario gelesen und eine begründete Compute- und Entry-Point-Variante gewählt.",
          "referenced_nodes": [
            "azure-0562",
            "azure-0863",
            "azure-0519",
            "azure-0351",
            "azure-0731",
            "azure-0983"
          ],
          "referenced_scenarios": [
            "scenario-secure-web-application"
          ],
          "prerequisites": [
            "learning-step-application-observability",
            "learning-step-decision-data"
          ],
          "next_learning_steps": [
            "learning-step-scenario-hub-spoke"
          ],
          "architecture_questions": [
            "Welche Anforderungen rechtfertigen Front Door?",
            "Warum ist App Service oder eine Alternative geeignet?",
            "Welche Datenpfade müssen privat sein?"
          ],
          "maturity_level": "level-4-decide",
          "learning_phases": {
            "prerequisite": "Application Journey und Decision Path",
            "understand": "Architekturfluss, Controls und Betriebsmodell erklären",
            "decide": "Compute-, Entry-, Endpoint- und Monitoring-Variante begründen"
          },
          "practice_references": []
        },
        {
          "id": "learning-step-scenario-hub-spoke",
          "title": "Szenario anwenden: Enterprise Hub-Spoke",
          "learning_goal": "Plattform- und Workloadverantwortung in einer Hub-Spoke-Landschaft erklären.",
          "explanation": "Vorwissen: Enterprise Platform und Hybridentscheidung. Danach werden zentrale Konnektivität, Security, DNS, Logging und Spoke-Isolation bewertet.",
          "referenced_nodes": [
            "azure-0442",
            "azure-0887",
            "azure-0841",
            "azure-0871",
            "azure-0985",
            "azure-0962"
          ],
          "referenced_scenarios": [
            "scenario-enterprise-hub-spoke"
          ],
          "prerequisites": [
            "learning-step-platform-operations",
            "learning-step-decision-hybrid-connectivity"
          ],
          "next_learning_steps": [
            "learning-step-scenario-hybrid"
          ],
          "architecture_questions": [
            "Welche Dienste gehören in den Hub?",
            "Wann ist Virtual WAN statt customer-managed Hub sinnvoll?",
            "Wie bleiben Spokes autonom und kontrolliert?"
          ],
          "maturity_level": "level-4-decide",
          "learning_phases": {
            "prerequisite": "Enterprise Platform und Hybrid Connectivity",
            "understand": "Hub-, Spoke-, Routing- und Governance-Rollen erklären",
            "decide": "Hub-Modell, Security-Verteilung und Logging-Ownership begründen"
          },
          "practice_references": []
        },
        {
          "id": "learning-step-scenario-hybrid",
          "title": "Szenario anwenden: Hybrid Cloud",
          "learning_goal": "Netzwerk-, DNS-, Identity-, Migration- und Betriebsabhängigkeiten über zwei Umgebungen bewerten.",
          "explanation": "Vorwissen: Network Foundation und VPN/ExpressRoute. Danach wird ein temporäres oder dauerhaftes Hybridzielbild mit Resilienzpfaden entworfen.",
          "referenced_nodes": [
            "azure-0462",
            "azure-0478",
            "azure-0558",
            "azure-0904",
            "azure-0645",
            "azure-0983"
          ],
          "referenced_scenarios": [
            "scenario-hybrid-cloud"
          ],
          "prerequisites": [
            "learning-step-platform-network",
            "learning-step-decision-hybrid-connectivity"
          ],
          "next_learning_steps": [
            "learning-step-scenario-high-availability"
          ],
          "architecture_questions": [
            "Welche lokalen Abhängigkeiten bleiben?",
            "Wie funktionieren DNS und Authentifizierung bei Verbindungsverlust?",
            "Was ist das Exit-Kriterium des Hybridbetriebs?"
          ],
          "maturity_level": "level-4-decide",
          "learning_phases": {
            "prerequisite": "Network Foundation und Hybrid Connectivity",
            "understand": "gemeinsame und getrennte Betriebsabhängigkeiten erklären",
            "decide": "Konnektivitäts-, Identity- und Zielbetriebsmodell begründen"
          },
          "practice_references": []
        },
        {
          "id": "learning-step-scenario-high-availability",
          "title": "Szenario anwenden: Highly Available Application",
          "learning_goal": "SLO, Fehlerdomänen, Kapazität, Failover und Recovery zu einem Reliability-Design verbinden.",
          "explanation": "Vorwissen: Regionen, Zonen und Monitoring. Danach werden Single- oder Multi-Region, Active/Passive/Active und Recovery-Verfahren begründet.",
          "referenced_nodes": [
            "azure-0007",
            "azure-0254",
            "azure-0025",
            "azure-0114",
            "azure-0983",
            "azure-1042"
          ],
          "referenced_scenarios": [
            "scenario-highly-available-application"
          ],
          "prerequisites": [
            "learning-step-availability-zones",
            "learning-step-application-observability"
          ],
          "next_learning_steps": [
            "learning-step-scenario-cloud-migration"
          ],
          "architecture_questions": [
            "Welches SLO, RPO und RTO gilt?",
            "Welche Fehlerdomäne muss toleriert werden?",
            "Wann ist automatischer Failover sicher?"
          ],
          "maturity_level": "level-4-decide",
          "learning_phases": {
            "prerequisite": "Regions-/Zonenmodell und Observability",
            "understand": "HA, DR, RPO/RTO und Health-Signale erklären",
            "decide": "Redundanz-, Regions- und Recovery-Strategie begründen"
          },
          "practice_references": []
        },
        {
          "id": "learning-step-scenario-cloud-migration",
          "title": "Szenario anwenden: Cloud Migration",
          "learning_goal": "Von Assessment und Abhängigkeiten zu Landing Zone, Wave, Cutover und Optimierung argumentieren.",
          "explanation": "Vorwissen: Azure Mental Model und Enterprise Platform. Danach werden Migrationsstrategie, Sequenz, Zielservice und Betriebsübergang bewertet.",
          "referenced_nodes": [
            "azure-0645",
            "azure-0054",
            "azure-0962",
            "azure-0933",
            "azure-0983",
            "azure-1034"
          ],
          "referenced_scenarios": [
            "scenario-cloud-migration"
          ],
          "prerequisites": [
            "learning-step-platform-operations",
            "learning-step-decision-compute"
          ],
          "next_learning_steps": [],
          "architecture_questions": [
            "Welche Abhängigkeiten bestimmen die Wave?",
            "Wann ist Rehost, Replatform oder Modernisierung sinnvoll?",
            "Welche Nachweise erlauben Cutover und Decommission?"
          ],
          "maturity_level": "level-4-decide",
          "learning_phases": {
            "prerequisite": "Mental Model, Landing Zone und Compute Decision",
            "understand": "Assessment, Prepare, Execute, Validate und Improve erklären",
            "decide": "Migrationsstrategie, Wave und Abnahmekriterien begründen"
          },
          "practice_references": []
        }
      ]
    }
  ],
  "path_index": {
    "learning-path-azure-mental-model": {
      "id": "learning-path-azure-mental-model",
      "title": "Azure Mental Model",
      "goal": "Azure als strukturierte Plattform statt als Liste einzelner Dienste verstehen.",
      "outcome": "Ich verstehe, wie eine Azure-Umgebung strukturell aufgebaut ist.",
      "step_ids": [
        "learning-step-cloud-foundations",
        "learning-step-azure-regions",
        "learning-step-availability-zones",
        "learning-step-tenant-boundary",
        "learning-step-management-groups",
        "learning-step-subscriptions",
        "learning-step-resource-groups",
        "learning-step-resource-model",
        "learning-step-governance-foundations"
      ]
    },
    "learning-path-application-journey": {
      "id": "learning-path-application-journey",
      "title": "Application Journey",
      "goal": "Den Weg einer Benutzeranfrage durch Azure von DNS bis Observability erklären.",
      "outcome": "Ich kann den Weg einer Anwendung durch Azure erklären.",
      "step_ids": [
        "learning-step-application-dns",
        "learning-step-application-traffic-management",
        "learning-step-application-security-layer",
        "learning-step-application-compute",
        "learning-step-application-data",
        "learning-step-application-private-access",
        "learning-step-application-observability"
      ]
    },
    "learning-path-enterprise-platform": {
      "id": "learning-path-enterprise-platform",
      "title": "Enterprise Platform Architecture",
      "goal": "Die gemeinsame Plattform hinter einzelnen Workloads verstehen.",
      "outcome": "Ich verstehe die Plattform hinter einzelnen Workloads.",
      "step_ids": [
        "learning-step-platform-landing-zone",
        "learning-step-platform-governance",
        "learning-step-platform-identity",
        "learning-step-platform-network",
        "learning-step-platform-security",
        "learning-step-platform-monitoring",
        "learning-step-platform-operations"
      ]
    },
    "learning-path-architecture-decisions": {
      "id": "learning-path-architecture-decisions",
      "title": "Architecture Decision Making",
      "goal": "Architekturentscheidungen aus Anforderungen, Alternativen und Trade-offs begründen.",
      "outcome": "Ich kann begründen, warum eine Architektur gewählt wird.",
      "step_ids": [
        "learning-step-decision-compute",
        "learning-step-decision-traffic",
        "learning-step-decision-hybrid-connectivity",
        "learning-step-decision-endpoints",
        "learning-step-decision-data"
      ]
    },
    "learning-path-enterprise-scenarios": {
      "id": "learning-path-enterprise-scenarios",
      "title": "Enterprise Scenario Learning",
      "goal": "Vorwissen, Architekturverständnis und Designentscheidung an realen Enterprise-Szenarien verbinden.",
      "outcome": "Ich kann eine Azure-Lösung von Anforderungen bis Architektur nachvollziehen.",
      "step_ids": [
        "learning-step-scenario-secure-web",
        "learning-step-scenario-hub-spoke",
        "learning-step-scenario-hybrid",
        "learning-step-scenario-high-availability",
        "learning-step-scenario-cloud-migration"
      ]
    }
  },
  "step_index": {
    "learning-step-cloud-foundations": {
      "id": "learning-step-cloud-foundations",
      "title": "Cloud-Grundlagen als Ausgangspunkt",
      "learning_goal": "Das Betriebs- und Verantwortungsmodell als Grundlage jeder späteren Azure-Entscheidung einordnen.",
      "explanation": "Der Schritt aktiviert vorhandenes Grundlagenwissen und richtet den Blick auf Verantwortung, Skalierung und Verbrauch statt auf Prüfungsdefinitionen.",
      "referenced_nodes": [
        "azure-0001",
        "azure-0197",
        "azure-0229"
      ],
      "referenced_scenarios": [],
      "prerequisites": [],
      "next_learning_steps": [
        "learning-step-azure-regions"
      ],
      "architecture_questions": [
        "Welche Verantwortung bleibt bei welchem Servicemodell beim Kunden?",
        "Welche Anforderungen sollen durch Cloud-Eigenschaften gelöst werden?"
      ],
      "maturity_level": "level-1-understand",
      "practice_references": [],
      "learning_path_id": "learning-path-azure-mental-model"
    },
    "learning-step-azure-regions": {
      "id": "learning-step-azure-regions",
      "title": "Regionen als Standort- und Fehlerentscheidung",
      "learning_goal": "Regionen als Grundlage für Latenz, Datenresidenz, Serviceverfügbarkeit und Recovery einordnen.",
      "explanation": "Nicht Regionsnamen lernen, sondern verstehen, welche Geschäfts- und Betriebsanforderungen die Standortwahl beeinflussen.",
      "referenced_nodes": [
        "azure-0237",
        "azure-0236"
      ],
      "referenced_scenarios": [],
      "prerequisites": [
        "learning-step-cloud-foundations"
      ],
      "next_learning_steps": [
        "learning-step-availability-zones"
      ],
      "architecture_questions": [
        "Welche Nutzer, Daten- und Compliance-Anforderungen bestimmen die Region?",
        "Welche Abhängigkeiten sind regional?"
      ],
      "maturity_level": "level-1-understand",
      "practice_references": [],
      "learning_path_id": "learning-path-azure-mental-model"
    },
    "learning-step-availability-zones": {
      "id": "learning-step-availability-zones",
      "title": "Availability Zones als lokale Fehlerdomänen",
      "learning_goal": "Zonen von Regionen und von Disaster Recovery abgrenzen.",
      "explanation": "Der Schritt verbindet physische Trennung mit der Frage, welche Komponenten tatsächlich zonenredundant betrieben werden müssen.",
      "referenced_nodes": [
        "azure-0007",
        "azure-0244",
        "azure-0112"
      ],
      "referenced_scenarios": [
        "scenario-highly-available-application"
      ],
      "prerequisites": [
        "learning-step-azure-regions"
      ],
      "next_learning_steps": [
        "learning-step-tenant-boundary"
      ],
      "architecture_questions": [
        "Welche Ausfälle deckt Zonenredundanz ab?",
        "Welche Restkapazität bleibt nach einem Zonenausfall?"
      ],
      "maturity_level": "level-2-connect",
      "practice_references": [],
      "learning_path_id": "learning-path-azure-mental-model"
    },
    "learning-step-tenant-boundary": {
      "id": "learning-step-tenant-boundary",
      "title": "Tenant als Identity- und Vertrauensgrenze",
      "learning_goal": "Die Entra-ID-Ebene als Identitätskontext für Azure-Verwaltung einordnen.",
      "explanation": "Ein dedizierter Tenant-Knoten existiert nicht; der Schritt navigiert bewusst zum vorhandenen Entra-ID-Knoten und vermeidet neues Produktwissen.",
      "referenced_nodes": [
        "azure-0904",
        "azure-0821"
      ],
      "referenced_scenarios": [
        "scenario-hybrid-cloud"
      ],
      "prerequisites": [
        "learning-step-availability-zones"
      ],
      "next_learning_steps": [
        "learning-step-management-groups"
      ],
      "architecture_questions": [
        "Wo beginnt und endet die organisatorische Vertrauensgrenze?",
        "Welche Identitäten verwalten Plattform und Workloads?"
      ],
      "maturity_level": "level-2-connect",
      "practice_references": [],
      "learning_path_id": "learning-path-azure-mental-model"
    },
    "learning-step-management-groups": {
      "id": "learning-step-management-groups",
      "title": "Management Groups als Governance-Hierarchie",
      "learning_goal": "Verstehen, wie Regeln und Zuständigkeiten oberhalb einzelner Subscriptions strukturiert werden.",
      "explanation": "Der Schritt ordnet Management Groups in das Gesamtmodell aus Tenant, Subscriptions und vererbten Guardrails ein.",
      "referenced_nodes": [
        "azure-1022",
        "azure-1023",
        "azure-0038"
      ],
      "referenced_scenarios": [
        "scenario-enterprise-hub-spoke",
        "scenario-cloud-migration"
      ],
      "prerequisites": [
        "learning-step-tenant-boundary"
      ],
      "next_learning_steps": [
        "learning-step-subscriptions"
      ],
      "architecture_questions": [
        "Welche Struktur folgt Governance statt dem Organigramm?",
        "Wo sollen Policies und Zugriffe vererbt werden?"
      ],
      "maturity_level": "level-2-connect",
      "practice_references": [],
      "learning_path_id": "learning-path-azure-mental-model"
    },
    "learning-step-subscriptions": {
      "id": "learning-step-subscriptions",
      "title": "Subscriptions als Management-, Abrechnungs- und Skalierungsgrenze",
      "learning_goal": "Subscriptions als bewusste Plattformgrenze statt als bloßen Kostencontainer verstehen.",
      "explanation": "Der Schritt verbindet Organisation, Governance, Zugriff, Quoten und Kostenverantwortung.",
      "referenced_nodes": [
        "azure-1011",
        "azure-1016",
        "azure-0968"
      ],
      "referenced_scenarios": [
        "scenario-enterprise-hub-spoke",
        "scenario-cloud-migration"
      ],
      "prerequisites": [
        "learning-step-management-groups"
      ],
      "next_learning_steps": [
        "learning-step-resource-groups"
      ],
      "architecture_questions": [
        "Welche Workloads benötigen getrennte Subscription-Grenzen?",
        "Wer verantwortet Kosten, Zugriff und Limits?"
      ],
      "maturity_level": "level-2-connect",
      "practice_references": [],
      "learning_path_id": "learning-path-azure-mental-model"
    },
    "learning-step-resource-groups": {
      "id": "learning-step-resource-groups",
      "title": "Resource Groups als Workload-Lifecycle-Grenze",
      "learning_goal": "Ressourcen nach gemeinsamem Lifecycle, Verantwortung und Bereitstellung gruppieren.",
      "explanation": "Nicht jede organisatorische Kategorie wird eine Resource Group; entscheidend ist, was zusammen verwaltet und geändert wird.",
      "referenced_nodes": [
        "azure-0277",
        "azure-0281"
      ],
      "referenced_scenarios": [],
      "prerequisites": [
        "learning-step-subscriptions"
      ],
      "next_learning_steps": [
        "learning-step-resource-model"
      ],
      "architecture_questions": [
        "Welche Ressourcen werden gemeinsam bereitgestellt und gelöscht?",
        "Welche Zugriffs- und Monitoringgrenzen entstehen?"
      ],
      "maturity_level": "level-2-connect",
      "practice_references": [],
      "learning_path_id": "learning-path-azure-mental-model"
    },
    "learning-step-resource-model": {
      "id": "learning-step-resource-model",
      "title": "Azure Resource Manager und Ressourcenmodell",
      "learning_goal": "Control Plane, Ressourcenanbieter, deklarative Bereitstellung und Verwaltung als gemeinsames Modell verstehen.",
      "explanation": "Der Schritt verbindet Resource Groups mit ARM, wiederholbarer Bereitstellung und Governance.",
      "referenced_nodes": [
        "azure-0284",
        "azure-0296",
        "azure-0298"
      ],
      "referenced_scenarios": [
        "scenario-cloud-migration"
      ],
      "prerequisites": [
        "learning-step-resource-groups"
      ],
      "next_learning_steps": [
        "learning-step-governance-foundations"
      ],
      "architecture_questions": [
        "Welche Änderungen gehören in automatisierte Deployments?",
        "Wie werden Drift und manuelle Ausnahmen behandelt?"
      ],
      "maturity_level": "level-2-connect",
      "practice_references": [],
      "learning_path_id": "learning-path-azure-mental-model"
    },
    "learning-step-governance-foundations": {
      "id": "learning-step-governance-foundations",
      "title": "Governance-Grundprinzipien als Leitplanken",
      "learning_goal": "Struktur, Policy, Zugriff, Kosten und Compliance als zusammenhängendes Steuerungsmodell verstehen.",
      "explanation": "Der Abschluss des Mental Models verbindet alle organisatorischen Ebenen mit verbindlichen Guardrails und Verantwortungen.",
      "referenced_nodes": [
        "azure-0036",
        "azure-0037",
        "azure-0040",
        "azure-0962",
        "azure-1034"
      ],
      "referenced_scenarios": [
        "scenario-enterprise-hub-spoke",
        "scenario-cloud-migration"
      ],
      "prerequisites": [
        "learning-step-resource-model"
      ],
      "next_learning_steps": [
        "learning-step-application-dns",
        "learning-step-platform-landing-zone"
      ],
      "architecture_questions": [
        "Welche Leitplanken müssen zentral gelten?",
        "Wo sind Ausnahmen erlaubt und wie werden sie überprüft?"
      ],
      "maturity_level": "level-2-connect",
      "practice_references": [],
      "learning_path_id": "learning-path-azure-mental-model"
    },
    "learning-step-application-dns": {
      "id": "learning-step-application-dns",
      "title": "DNS: Namen werden zu erreichbaren Endpunkten",
      "learning_goal": "Namensauflösung als ersten technischen Pfad einer Anwendung einordnen.",
      "explanation": "Der Fokus liegt auf der Frage, welcher Name öffentlich oder privat zu welchem Einstiegspunkt aufgelöst werden soll.",
      "referenced_nodes": [
        "azure-0545",
        "azure-0558"
      ],
      "referenced_scenarios": [
        "scenario-secure-web-application"
      ],
      "prerequisites": [
        "learning-step-governance-foundations"
      ],
      "next_learning_steps": [
        "learning-step-application-traffic-management"
      ],
      "architecture_questions": [
        "Wer ist autoritativ für den Namen?",
        "Wie unterscheidet sich öffentliche von privater Auflösung?"
      ],
      "maturity_level": "level-2-connect",
      "practice_references": [],
      "learning_path_id": "learning-path-application-journey"
    },
    "learning-step-application-traffic-management": {
      "id": "learning-step-application-traffic-management",
      "title": "Traffic Management: global, regional oder Layer 4",
      "learning_goal": "Front Door, Application Gateway und Load Balancer nach Traffic-Aufgabe abgrenzen.",
      "explanation": "Der Schritt folgt der Anfrage und wählt den Einstieg nicht nach Produktnamen, sondern nach Scope, Protokoll und Routingbedarf.",
      "referenced_nodes": [
        "azure-0562",
        "azure-0519",
        "azure-0505"
      ],
      "referenced_scenarios": [
        "scenario-secure-web-application",
        "scenario-highly-available-application"
      ],
      "prerequisites": [
        "learning-step-application-dns"
      ],
      "next_learning_steps": [
        "learning-step-application-security-layer"
      ],
      "architecture_questions": [
        "Ist das Routing global oder regional?",
        "Werden HTTP-Inhalte oder nur Netzwerkflüsse ausgewertet?"
      ],
      "maturity_level": "level-3-apply",
      "practice_references": [],
      "learning_path_id": "learning-path-application-journey"
    },
    "learning-step-application-security-layer": {
      "id": "learning-step-application-security-layer",
      "title": "Security Layer: prüfen, segmentieren und begrenzen",
      "learning_goal": "WAF, Firewall, NSG und DDoS als unterschiedliche Schutzaufgaben im Pfad verstehen.",
      "explanation": "Die Anfrage durchläuft Controls auf unterschiedlichen Ebenen; kein einzelner Dienst ersetzt alle anderen.",
      "referenced_nodes": [
        "azure-0863",
        "azure-0841",
        "azure-0864",
        "azure-0852"
      ],
      "referenced_scenarios": [
        "scenario-secure-web-application",
        "scenario-enterprise-hub-spoke"
      ],
      "prerequisites": [
        "learning-step-application-traffic-management"
      ],
      "next_learning_steps": [
        "learning-step-application-compute"
      ],
      "architecture_questions": [
        "Welche Schicht kontrolliert welchen Traffic?",
        "Wo entstehen zentrale und workloadnahe Verantwortungen?"
      ],
      "maturity_level": "level-3-apply",
      "practice_references": [],
      "learning_path_id": "learning-path-application-journey"
    },
    "learning-step-application-compute": {
      "id": "learning-step-application-compute",
      "title": "Application Layer: wo läuft die Logik?",
      "learning_goal": "VM, App Service und AKS als Betriebsmodelle für dieselbe fachliche Anwendung vergleichen.",
      "explanation": "Der Schritt betrachtet die verbleibende Kundenverantwortung, benötigte Kontrolle und Plattformkomplexität.",
      "referenced_nodes": [
        "azure-0322",
        "azure-0351",
        "azure-0425"
      ],
      "referenced_scenarios": [
        "scenario-secure-web-application"
      ],
      "prerequisites": [
        "learning-step-application-security-layer"
      ],
      "next_learning_steps": [
        "learning-step-application-data"
      ],
      "architecture_questions": [
        "Welche Betriebssystem- oder Orchestrierungskontrolle ist wirklich nötig?",
        "Welche Skalierungs- und Deploymentanforderungen bestehen?"
      ],
      "maturity_level": "level-3-apply",
      "practice_references": [],
      "learning_path_id": "learning-path-application-journey"
    },
    "learning-step-application-data": {
      "id": "learning-step-application-data",
      "title": "Data Layer: relational, verteilt oder objektbasiert",
      "learning_goal": "Datenanforderungen vor der Produktauswahl strukturieren.",
      "explanation": "SQL Database, Cosmos DB und Storage Account werden als unterschiedliche Datenmodelle und Betriebsentscheidungen betrachtet.",
      "referenced_nodes": [
        "azure-0731",
        "azure-0724",
        "azure-0579"
      ],
      "referenced_scenarios": [
        "scenario-secure-web-application"
      ],
      "prerequisites": [
        "learning-step-application-compute"
      ],
      "next_learning_steps": [
        "learning-step-application-private-access"
      ],
      "architecture_questions": [
        "Welche Konsistenz, Abfrage, Skalierung und Transaktion wird benötigt?",
        "Welche Daten gehören nicht in die Compute-Schicht?"
      ],
      "maturity_level": "level-3-apply",
      "practice_references": [],
      "learning_path_id": "learning-path-application-journey"
    },
    "learning-step-application-private-access": {
      "id": "learning-step-application-private-access",
      "title": "Private Access: Datenpfad und Identität zusammenführen",
      "learning_goal": "Public und Private Endpoint zusammen mit DNS, Routing und Managed Identity bewerten.",
      "explanation": "Privater Netzwerkzugriff und Autorisierung lösen verschiedene Probleme und müssen gemeinsam funktionieren.",
      "referenced_nodes": [
        "azure-0884",
        "azure-0881",
        "azure-0558",
        "azure-0947"
      ],
      "referenced_scenarios": [
        "scenario-secure-web-application",
        "scenario-enterprise-hub-spoke"
      ],
      "prerequisites": [
        "learning-step-application-data"
      ],
      "next_learning_steps": [
        "learning-step-application-observability"
      ],
      "architecture_questions": [
        "Muss der Dienst öffentlich erreichbar sein?",
        "Wie werden Name, Route und Berechtigung konsistent?"
      ],
      "maturity_level": "level-3-apply",
      "practice_references": [],
      "learning_path_id": "learning-path-application-journey"
    },
    "learning-step-application-observability": {
      "id": "learning-step-application-observability",
      "title": "Monitoring: den vollständigen Nutzerfluss sichtbar machen",
      "learning_goal": "Metrics, Logs, Traces und Alerts mit dem Application Journey verbinden.",
      "explanation": "Der Pfad endet nicht beim erfolgreichen Deployment, sondern bei der Fähigkeit, Nutzerwirkung und Ursachen zu erkennen.",
      "referenced_nodes": [
        "azure-0983",
        "azure-0987",
        "azure-0985",
        "azure-0984"
      ],
      "referenced_scenarios": [
        "scenario-secure-web-application",
        "scenario-highly-available-application"
      ],
      "prerequisites": [
        "learning-step-application-private-access"
      ],
      "next_learning_steps": [
        "learning-step-decision-compute",
        "learning-step-scenario-secure-web"
      ],
      "architecture_questions": [
        "Welche Signale zeigen den Geschäftsfluss?",
        "Welche Alerts führen zu einer konkreten Handlung?"
      ],
      "maturity_level": "level-3-apply",
      "practice_references": [],
      "learning_path_id": "learning-path-application-journey"
    },
    "learning-step-platform-landing-zone": {
      "id": "learning-step-platform-landing-zone",
      "title": "Landing Zone als vorbereitete Zielplattform",
      "learning_goal": "Landing Zone als Zusammenspiel mehrerer Designbereiche verstehen.",
      "explanation": "Der Einstieg verbindet Organisation, Identity, Netzwerk, Security, Governance und Management vor dem ersten Workload.",
      "referenced_nodes": [
        "azure-0054",
        "azure-1022",
        "azure-1011"
      ],
      "referenced_scenarios": [
        "scenario-cloud-migration",
        "scenario-enterprise-hub-spoke"
      ],
      "prerequisites": [
        "learning-step-governance-foundations"
      ],
      "next_learning_steps": [
        "learning-step-platform-governance"
      ],
      "architecture_questions": [
        "Welche Plattformfähigkeiten müssen vor Workloads bereitstehen?",
        "Wer besitzt Plattform- und Application-Landing-Zones?"
      ],
      "maturity_level": "level-2-connect",
      "practice_references": [],
      "learning_path_id": "learning-path-enterprise-platform"
    },
    "learning-step-platform-governance": {
      "id": "learning-step-platform-governance",
      "title": "Governance Foundation",
      "learning_goal": "Managementstruktur, Policy, Kosten und Compliance als Plattformvertrag einordnen.",
      "explanation": "Governance stellt wiederholbare Leitplanken bereit, ohne jede Workloadentscheidung zentral zu übernehmen.",
      "referenced_nodes": [
        "azure-0036",
        "azure-0962",
        "azure-1022",
        "azure-1034"
      ],
      "referenced_scenarios": [
        "scenario-cloud-migration",
        "scenario-enterprise-hub-spoke"
      ],
      "prerequisites": [
        "learning-step-platform-landing-zone"
      ],
      "next_learning_steps": [
        "learning-step-platform-identity"
      ],
      "architecture_questions": [
        "Welche Entscheidungen sind zentral verbindlich?",
        "Wie werden Ausnahmen und Kosten verantwortet?"
      ],
      "maturity_level": "level-2-connect",
      "practice_references": [],
      "learning_path_id": "learning-path-enterprise-platform"
    },
    "learning-step-platform-identity": {
      "id": "learning-step-platform-identity",
      "title": "Identity Foundation",
      "learning_goal": "Benutzer-, Workload- und privilegierte Identitäten als Plattformgrenze verstehen.",
      "explanation": "Entra ID, RBAC, PIM und Managed Identity bilden zusammen Authentifizierung, Autorisierung und Betriebszugriff.",
      "referenced_nodes": [
        "azure-0904",
        "azure-0964",
        "azure-0046",
        "azure-0947",
        "azure-0966"
      ],
      "referenced_scenarios": [
        "scenario-secure-web-application",
        "scenario-hybrid-cloud",
        "scenario-cloud-migration"
      ],
      "prerequisites": [
        "learning-step-platform-governance"
      ],
      "next_learning_steps": [
        "learning-step-platform-network"
      ],
      "architecture_questions": [
        "Welche Identitäten benötigen welchen Scope?",
        "Wie werden dauerhafte Privilegien und Secrets vermieden?"
      ],
      "maturity_level": "level-2-connect",
      "practice_references": [],
      "learning_path_id": "learning-path-enterprise-platform"
    },
    "learning-step-platform-network": {
      "id": "learning-step-platform-network",
      "title": "Network Foundation",
      "learning_goal": "Adressierung, Hub-Spoke, Hybridpfade, DNS und zentrale Inspection als Plattformfähigkeit verbinden.",
      "explanation": "Das Netzwerk wird als wiederverwendbarer Connectivity-Vertrag für Workloads betrachtet.",
      "referenced_nodes": [
        "azure-0442",
        "azure-0887",
        "azure-0841",
        "azure-0478",
        "azure-0462",
        "azure-0558"
      ],
      "referenced_scenarios": [
        "scenario-enterprise-hub-spoke",
        "scenario-hybrid-cloud"
      ],
      "prerequisites": [
        "learning-step-platform-identity"
      ],
      "next_learning_steps": [
        "learning-step-platform-security"
      ],
      "architecture_questions": [
        "Welche Pfade werden zentral bereitgestellt?",
        "Wo bleiben Isolation und Verantwortung beim Workload?"
      ],
      "maturity_level": "level-3-apply",
      "practice_references": [],
      "learning_path_id": "learning-path-enterprise-platform"
    },
    "learning-step-platform-security": {
      "id": "learning-step-platform-security",
      "title": "Security Baseline",
      "learning_goal": "Präventive, detektive und wiederherstellende Controls als Plattformbaseline einordnen.",
      "explanation": "Policy, Defender, Netzwerk- und Identity-Controls bilden eine gemeinsame Schutzarchitektur.",
      "referenced_nodes": [
        "azure-0815",
        "azure-0817",
        "azure-0933",
        "azure-0074"
      ],
      "referenced_scenarios": [
        "scenario-secure-web-application",
        "scenario-enterprise-hub-spoke",
        "scenario-cloud-migration"
      ],
      "prerequisites": [
        "learning-step-platform-network"
      ],
      "next_learning_steps": [
        "learning-step-platform-monitoring"
      ],
      "architecture_questions": [
        "Welche Baselines sind zentral, welche workloadbezogen?",
        "Wie werden Findings priorisiert und behoben?"
      ],
      "maturity_level": "level-3-apply",
      "practice_references": [],
      "learning_path_id": "learning-path-enterprise-platform"
    },
    "learning-step-platform-monitoring": {
      "id": "learning-step-platform-monitoring",
      "title": "Monitoring Foundation",
      "learning_goal": "Workspace-, Telemetrie-, Alert- und Health-Standards als Plattformservice verstehen.",
      "explanation": "Zentrale Observability schafft Korrelation, während Workloadteams Instrumentierung und fachliche Interpretation behalten.",
      "referenced_nodes": [
        "azure-0979",
        "azure-0983",
        "azure-0985",
        "azure-0984"
      ],
      "referenced_scenarios": [
        "scenario-enterprise-hub-spoke",
        "scenario-hybrid-cloud",
        "scenario-highly-available-application"
      ],
      "prerequisites": [
        "learning-step-platform-security"
      ],
      "next_learning_steps": [
        "learning-step-platform-operations"
      ],
      "architecture_questions": [
        "Welche Daten werden zentral gesammelt?",
        "Wie bleiben Zugriff, Kosten und Ownership beherrschbar?"
      ],
      "maturity_level": "level-3-apply",
      "practice_references": [],
      "learning_path_id": "learning-path-enterprise-platform"
    },
    "learning-step-platform-operations": {
      "id": "learning-step-platform-operations",
      "title": "Operations und kontinuierliche Verbesserung",
      "learning_goal": "Owner, Runbooks, Incident, Advisor, Kosten und Lessons Learned als Regelkreis verbinden.",
      "explanation": "Die Plattform wird nicht nur bereitgestellt, sondern über messbare Betriebsziele und Verbesserungszyklen weiterentwickelt.",
      "referenced_nodes": [
        "azure-0094",
        "azure-0993",
        "azure-0999",
        "azure-1034"
      ],
      "referenced_scenarios": [
        "scenario-enterprise-hub-spoke",
        "scenario-hybrid-cloud",
        "scenario-cloud-migration"
      ],
      "prerequisites": [
        "learning-step-platform-monitoring"
      ],
      "next_learning_steps": [
        "learning-step-decision-compute",
        "learning-step-scenario-hub-spoke"
      ],
      "architecture_questions": [
        "Wer reagiert auf welches Signal?",
        "Wie fließen Incidents und Empfehlungen zurück in Baselines?"
      ],
      "maturity_level": "level-3-apply",
      "practice_references": [],
      "learning_path_id": "learning-path-enterprise-platform"
    },
    "learning-step-decision-compute": {
      "id": "learning-step-decision-compute",
      "title": "VM versus App Service versus Container",
      "learning_goal": "Compute nach Betriebsverantwortung, Portabilität, Orchestrierung und Skalierung wählen.",
      "explanation": "Die Entscheidung beginnt mit Anforderungen an Kontrolle und Betrieb, nicht mit einem bevorzugten Dienst.",
      "referenced_nodes": [
        "azure-0322",
        "azure-0351",
        "azure-0415",
        "azure-0425"
      ],
      "referenced_scenarios": [
        "scenario-secure-web-application",
        "scenario-cloud-migration"
      ],
      "prerequisites": [
        "learning-step-application-observability",
        "learning-step-platform-operations"
      ],
      "next_learning_steps": [
        "learning-step-decision-traffic"
      ],
      "architecture_questions": [
        "Welche OS-Kontrolle und Plattformverantwortung wird benötigt?",
        "Ist Kubernetes-Komplexität fachlich gerechtfertigt?",
        "Wie ändern sich Patching, Skalierung und Deployment?"
      ],
      "maturity_level": "level-4-decide",
      "decision_framework": {
        "options": [
          "azure-0322",
          "azure-0351",
          "azure-0415",
          "azure-0425"
        ],
        "criteria": [
          "OS control",
          "operating responsibility",
          "orchestration",
          "scaling",
          "deployment model"
        ],
        "tradeoffs": [
          "control versus managed platform",
          "portability versus operational complexity"
        ],
        "typical_use_cases": [
          "legacy or specialized VM workload",
          "managed web application",
          "single container job",
          "microservice platform"
        ]
      },
      "practice_references": [],
      "learning_path_id": "learning-path-architecture-decisions"
    },
    "learning-step-decision-traffic": {
      "id": "learning-step-decision-traffic",
      "title": "Load Balancer versus Application Gateway versus Front Door",
      "learning_goal": "Trafficdienste nach globalem Scope, Protokoll, Layer und Security-Funktion wählen.",
      "explanation": "Die Optionen bilden unterschiedliche Teile eines Pfads und sind nicht automatisch Alternativen auf derselben Ebene.",
      "referenced_nodes": [
        "azure-0505",
        "azure-0519",
        "azure-0562",
        "azure-0863"
      ],
      "referenced_scenarios": [
        "scenario-secure-web-application",
        "scenario-highly-available-application"
      ],
      "prerequisites": [
        "learning-step-decision-compute"
      ],
      "next_learning_steps": [
        "learning-step-decision-hybrid-connectivity"
      ],
      "architecture_questions": [
        "Ist der Scope global oder regional?",
        "Ist Layer 4 oder Layer 7 erforderlich?",
        "Wo sollen WAF, TLS und Health-Entscheidungen liegen?"
      ],
      "maturity_level": "level-4-decide",
      "decision_framework": {
        "options": [
          "azure-0505",
          "azure-0519",
          "azure-0562"
        ],
        "criteria": [
          "scope",
          "protocol",
          "routing depth",
          "WAF",
          "origin topology"
        ],
        "tradeoffs": [
          "simplicity versus application-aware routing",
          "regional versus global control"
        ],
        "typical_use_cases": [
          "TCP/UDP distribution",
          "regional web ingress",
          "global web entry"
        ]
      },
      "practice_references": [],
      "learning_path_id": "learning-path-architecture-decisions"
    },
    "learning-step-decision-hybrid-connectivity": {
      "id": "learning-step-decision-hybrid-connectivity",
      "title": "VPN versus ExpressRoute",
      "learning_goal": "Hybridkonnektivität nach Privatheit, Durchsatz, Bereitstellungszeit, Kosten und Resilienz wählen.",
      "explanation": "Die Entscheidung bewertet den gesamten Pfad einschließlich Provider, Gateway, Routing und Backup-Option.",
      "referenced_nodes": [
        "azure-0462",
        "azure-0478",
        "azure-0461"
      ],
      "referenced_scenarios": [
        "scenario-enterprise-hub-spoke",
        "scenario-hybrid-cloud"
      ],
      "prerequisites": [
        "learning-step-decision-traffic"
      ],
      "next_learning_steps": [
        "learning-step-decision-endpoints"
      ],
      "architecture_questions": [
        "Welche Verfügbarkeit und Bandbreite sind erforderlich?",
        "Muss der Pfad privat sein?",
        "Welcher zweite Fehlerpfad existiert?"
      ],
      "maturity_level": "level-4-decide",
      "decision_framework": {
        "options": [
          "azure-0462",
          "azure-0478"
        ],
        "criteria": [
          "privacy",
          "bandwidth",
          "latency predictability",
          "lead time",
          "cost",
          "resilience"
        ],
        "tradeoffs": [
          "fast deployment versus private circuit",
          "lower cost versus predictable connectivity"
        ],
        "typical_use_cases": [
          "initial or backup hybrid path",
          "mission-critical enterprise connectivity"
        ]
      },
      "practice_references": [],
      "learning_path_id": "learning-path-architecture-decisions"
    },
    "learning-step-decision-endpoints": {
      "id": "learning-step-decision-endpoints",
      "title": "Public Endpoint versus Private Endpoint",
      "learning_goal": "Erreichbarkeit, Angriffsfläche, DNS, Routing und Betriebsaufwand gemeinsam bewerten.",
      "explanation": "Privatheit ist eine Architekturentscheidung mit Netzwerk- und DNS-Folgen, nicht nur ein Schalter am Dienst.",
      "referenced_nodes": [
        "azure-0884",
        "azure-0881",
        "azure-0558",
        "azure-0864"
      ],
      "referenced_scenarios": [
        "scenario-secure-web-application",
        "scenario-enterprise-hub-spoke"
      ],
      "prerequisites": [
        "learning-step-decision-hybrid-connectivity"
      ],
      "next_learning_steps": [
        "learning-step-decision-data"
      ],
      "architecture_questions": [
        "Wer muss den Dienst von wo erreichen?",
        "Wie werden DNS und Public Access kontrolliert?",
        "Ist der zusätzliche Netzwerkbetrieb gerechtfertigt?"
      ],
      "maturity_level": "level-4-decide",
      "decision_framework": {
        "options": [
          "azure-0884",
          "azure-0881"
        ],
        "criteria": [
          "reachability",
          "data sensitivity",
          "exfiltration risk",
          "DNS model",
          "operations"
        ],
        "tradeoffs": [
          "simple reachability versus private isolation",
          "lower complexity versus reduced public exposure"
        ],
        "typical_use_cases": [
          "controlled public API",
          "private PaaS dependency"
        ]
      },
      "practice_references": [],
      "learning_path_id": "learning-path-architecture-decisions"
    },
    "learning-step-decision-data": {
      "id": "learning-step-decision-data",
      "title": "SQL Database versus andere Datenlösungen",
      "learning_goal": "Datenservice aus Datenmodell, Konsistenz, Zugriff, Skalierung und Betrieb ableiten.",
      "explanation": "Die Auswahl trennt relationale Transaktionen, global verteilte NoSQL-Anforderungen und objektbasierte Speicherung.",
      "referenced_nodes": [
        "azure-0731",
        "azure-0724",
        "azure-0579"
      ],
      "referenced_scenarios": [
        "scenario-secure-web-application",
        "scenario-cloud-migration"
      ],
      "prerequisites": [
        "learning-step-decision-endpoints"
      ],
      "next_learning_steps": [
        "learning-step-scenario-secure-web"
      ],
      "architecture_questions": [
        "Welche Transaktionen und Abfragen sind erforderlich?",
        "Welche Konsistenz und globale Verteilung wird benötigt?",
        "Welche Daten sind Objekte statt Datensätze?"
      ],
      "maturity_level": "level-4-decide",
      "decision_framework": {
        "options": [
          "azure-0731",
          "azure-0724",
          "azure-0579"
        ],
        "criteria": [
          "data model",
          "transactions",
          "consistency",
          "distribution",
          "query pattern",
          "cost model"
        ],
        "tradeoffs": [
          "relational guarantees versus flexible distribution",
          "query capability versus object simplicity"
        ],
        "typical_use_cases": [
          "relational line-of-business data",
          "globally distributed NoSQL",
          "files and objects"
        ]
      },
      "practice_references": [],
      "learning_path_id": "learning-path-architecture-decisions"
    },
    "learning-step-scenario-secure-web": {
      "id": "learning-step-scenario-secure-web",
      "title": "Szenario anwenden: Secure Web Application",
      "learning_goal": "Den vollständigen Webpfad aus Anforderungen, Komponenten und Trade-offs erklären und Varianten begründen.",
      "explanation": "Vorwissen: Application Journey und Compute/Traffic/Endpoint/Data-Entscheidungen. Danach wird das V2.0-Szenario gelesen und eine begründete Compute- und Entry-Point-Variante gewählt.",
      "referenced_nodes": [
        "azure-0562",
        "azure-0863",
        "azure-0519",
        "azure-0351",
        "azure-0731",
        "azure-0983"
      ],
      "referenced_scenarios": [
        "scenario-secure-web-application"
      ],
      "prerequisites": [
        "learning-step-application-observability",
        "learning-step-decision-data"
      ],
      "next_learning_steps": [
        "learning-step-scenario-hub-spoke"
      ],
      "architecture_questions": [
        "Welche Anforderungen rechtfertigen Front Door?",
        "Warum ist App Service oder eine Alternative geeignet?",
        "Welche Datenpfade müssen privat sein?"
      ],
      "maturity_level": "level-4-decide",
      "learning_phases": {
        "prerequisite": "Application Journey und Decision Path",
        "understand": "Architekturfluss, Controls und Betriebsmodell erklären",
        "decide": "Compute-, Entry-, Endpoint- und Monitoring-Variante begründen"
      },
      "practice_references": [],
      "learning_path_id": "learning-path-enterprise-scenarios"
    },
    "learning-step-scenario-hub-spoke": {
      "id": "learning-step-scenario-hub-spoke",
      "title": "Szenario anwenden: Enterprise Hub-Spoke",
      "learning_goal": "Plattform- und Workloadverantwortung in einer Hub-Spoke-Landschaft erklären.",
      "explanation": "Vorwissen: Enterprise Platform und Hybridentscheidung. Danach werden zentrale Konnektivität, Security, DNS, Logging und Spoke-Isolation bewertet.",
      "referenced_nodes": [
        "azure-0442",
        "azure-0887",
        "azure-0841",
        "azure-0871",
        "azure-0985",
        "azure-0962"
      ],
      "referenced_scenarios": [
        "scenario-enterprise-hub-spoke"
      ],
      "prerequisites": [
        "learning-step-platform-operations",
        "learning-step-decision-hybrid-connectivity"
      ],
      "next_learning_steps": [
        "learning-step-scenario-hybrid"
      ],
      "architecture_questions": [
        "Welche Dienste gehören in den Hub?",
        "Wann ist Virtual WAN statt customer-managed Hub sinnvoll?",
        "Wie bleiben Spokes autonom und kontrolliert?"
      ],
      "maturity_level": "level-4-decide",
      "learning_phases": {
        "prerequisite": "Enterprise Platform und Hybrid Connectivity",
        "understand": "Hub-, Spoke-, Routing- und Governance-Rollen erklären",
        "decide": "Hub-Modell, Security-Verteilung und Logging-Ownership begründen"
      },
      "practice_references": [],
      "learning_path_id": "learning-path-enterprise-scenarios"
    },
    "learning-step-scenario-hybrid": {
      "id": "learning-step-scenario-hybrid",
      "title": "Szenario anwenden: Hybrid Cloud",
      "learning_goal": "Netzwerk-, DNS-, Identity-, Migration- und Betriebsabhängigkeiten über zwei Umgebungen bewerten.",
      "explanation": "Vorwissen: Network Foundation und VPN/ExpressRoute. Danach wird ein temporäres oder dauerhaftes Hybridzielbild mit Resilienzpfaden entworfen.",
      "referenced_nodes": [
        "azure-0462",
        "azure-0478",
        "azure-0558",
        "azure-0904",
        "azure-0645",
        "azure-0983"
      ],
      "referenced_scenarios": [
        "scenario-hybrid-cloud"
      ],
      "prerequisites": [
        "learning-step-platform-network",
        "learning-step-decision-hybrid-connectivity"
      ],
      "next_learning_steps": [
        "learning-step-scenario-high-availability"
      ],
      "architecture_questions": [
        "Welche lokalen Abhängigkeiten bleiben?",
        "Wie funktionieren DNS und Authentifizierung bei Verbindungsverlust?",
        "Was ist das Exit-Kriterium des Hybridbetriebs?"
      ],
      "maturity_level": "level-4-decide",
      "learning_phases": {
        "prerequisite": "Network Foundation und Hybrid Connectivity",
        "understand": "gemeinsame und getrennte Betriebsabhängigkeiten erklären",
        "decide": "Konnektivitäts-, Identity- und Zielbetriebsmodell begründen"
      },
      "practice_references": [],
      "learning_path_id": "learning-path-enterprise-scenarios"
    },
    "learning-step-scenario-high-availability": {
      "id": "learning-step-scenario-high-availability",
      "title": "Szenario anwenden: Highly Available Application",
      "learning_goal": "SLO, Fehlerdomänen, Kapazität, Failover und Recovery zu einem Reliability-Design verbinden.",
      "explanation": "Vorwissen: Regionen, Zonen und Monitoring. Danach werden Single- oder Multi-Region, Active/Passive/Active und Recovery-Verfahren begründet.",
      "referenced_nodes": [
        "azure-0007",
        "azure-0254",
        "azure-0025",
        "azure-0114",
        "azure-0983",
        "azure-1042"
      ],
      "referenced_scenarios": [
        "scenario-highly-available-application"
      ],
      "prerequisites": [
        "learning-step-availability-zones",
        "learning-step-application-observability"
      ],
      "next_learning_steps": [
        "learning-step-scenario-cloud-migration"
      ],
      "architecture_questions": [
        "Welches SLO, RPO und RTO gilt?",
        "Welche Fehlerdomäne muss toleriert werden?",
        "Wann ist automatischer Failover sicher?"
      ],
      "maturity_level": "level-4-decide",
      "learning_phases": {
        "prerequisite": "Regions-/Zonenmodell und Observability",
        "understand": "HA, DR, RPO/RTO und Health-Signale erklären",
        "decide": "Redundanz-, Regions- und Recovery-Strategie begründen"
      },
      "practice_references": [],
      "learning_path_id": "learning-path-enterprise-scenarios"
    },
    "learning-step-scenario-cloud-migration": {
      "id": "learning-step-scenario-cloud-migration",
      "title": "Szenario anwenden: Cloud Migration",
      "learning_goal": "Von Assessment und Abhängigkeiten zu Landing Zone, Wave, Cutover und Optimierung argumentieren.",
      "explanation": "Vorwissen: Azure Mental Model und Enterprise Platform. Danach werden Migrationsstrategie, Sequenz, Zielservice und Betriebsübergang bewertet.",
      "referenced_nodes": [
        "azure-0645",
        "azure-0054",
        "azure-0962",
        "azure-0933",
        "azure-0983",
        "azure-1034"
      ],
      "referenced_scenarios": [
        "scenario-cloud-migration"
      ],
      "prerequisites": [
        "learning-step-platform-operations",
        "learning-step-decision-compute"
      ],
      "next_learning_steps": [],
      "architecture_questions": [
        "Welche Abhängigkeiten bestimmen die Wave?",
        "Wann ist Rehost, Replatform oder Modernisierung sinnvoll?",
        "Welche Nachweise erlauben Cutover und Decommission?"
      ],
      "maturity_level": "level-4-decide",
      "learning_phases": {
        "prerequisite": "Mental Model, Landing Zone und Compute Decision",
        "understand": "Assessment, Prepare, Execute, Validate und Improve erklären",
        "decide": "Migrationsstrategie, Wave und Abnahmekriterien begründen"
      },
      "practice_references": [],
      "learning_path_id": "learning-path-enterprise-scenarios"
    }
  },
  "referenced_nodes": {
    "azure-0001": {
      "id": "azure-0001",
      "title": "Cloud Conecpts",
      "parent": "azure-0000",
      "category": "Architecture",
      "description": {
        "simple": "1- Cloud Conecpts",
        "technical": "1- Cloud Conecpts",
        "architecture": ""
      }
    },
    "azure-0007": {
      "id": "azure-0007",
      "title": "Availability Zones",
      "parent": "azure-0004",
      "category": "Architecture",
      "description": {
        "simple": "Availability Zones sind physisch getrennte Standorte innerhalb einer Azure-Region. Mehrere Instanzen über Zonen hinweg schützen eine Anwendung vor dem Ausfall eines einzelnen Rechenzentrums.",
        "technical": "Jede Zone besitzt unabhängige Stromversorgung, Kühlung und Netzwerkkomponenten, ist aber über regionale Netzwerke mit den anderen Zonen verbunden. Ressourcen können zonal in einer bestimmten Zone oder zonenredundant über mehrere Zonen bereitgestellt werden. Die Anwendung muss Daten, Netzwerkpfade und Zustände passend replizieren.",
        "architecture": "Architekten wählen Zonen für geschäftskritische Workloads mit höherem Resilienzziel als ein Availability Set. Der Gewinn an Ausfallsicherheit steht zusätzlicher Architekturkomplexität, möglicher zonenübergreifender Latenz und Datentransferkosten gegenüber. Eine Zone schützt nicht vor einem kompletten Regionsausfall."
      }
    },
    "azure-0025": {
      "id": "azure-0025",
      "title": "Azure Autoscale",
      "parent": "azure-0014",
      "category": "Architecture",
      "description": {
        "simple": "Azure Autoscale passt die Anzahl oder Kapazität unterstützter Ressourcen automatisch an. Regeln reagieren beispielsweise auf CPU-Last, Warteschlangen oder einen Zeitplan.",
        "technical": "Autoscale wertet Metriken und Zeitfenster aus und führt Scale-out- oder Scale-in-Aktionen innerhalb definierter Mindest-, Standard- und Höchstwerte aus. Cooldown-Phasen verhindern zu schnelle Gegenbewegungen. Bei VM Scale Sets ändert es typischerweise die Instanzzahl.",
        "architecture": "Autoscale senkt Leerlaufkosten und erhöht Reaktionsfähigkeit, ersetzt aber keine Kapazitätsplanung. Schwellen, Aufwärmzeit, Abhängigkeiten und sichere Scale-in-Semantik müssen getestet werden. Vorhersehbare Spitzen können zeitgesteuert vorgewärmt werden; unvorhersehbare Last benötigt metrische Regeln."
      }
    },
    "azure-0036": {
      "id": "azure-0036",
      "title": "Azure Governance",
      "parent": "azure-0002",
      "category": "Governance",
      "description": {
        "simple": "Azure Governance umfasst Regeln, Strukturen und Verantwortlichkeiten für den kontrollierten Betrieb von Cloud-Ressourcen. Sie sorgt dafür, dass Teams Azure sicher, konform und kostenbewusst nutzen können, ohne jede Entscheidung einzeln abzustimmen.",
        "technical": "Governance kombiniert Managementhierarchie, Azure Policy, Azure RBAC, Tags, Resource Locks, Cost Management und Security-Posture-Dienste. Einstellungen werden an Scopes wie Management Group, Subscription, Resource Group oder Ressource angewendet und teilweise nach unten vererbt. Compliance- und Kostendaten machen Abweichungen sichtbar.",
        "architecture": "Enterprise Governance trennt verbindliche Guardrails von teamnahen Freiräumen. Die Hierarchie sollte stabil nach gemeinsamen Policy-, Zugriffs-, Netzwerk- und Complianceanforderungen aufgebaut werden, nicht als Kopie des Organigramms. Zu viele globale Regeln erhöhen Konflikte und Ausnahmen; zu wenig Steuerung erzeugt Drift und Wildwuchs."
      }
    },
    "azure-0037": {
      "id": "azure-0037",
      "title": "Governance-Regeln, Standards und Kontrollen",
      "parent": "azure-0036",
      "category": "Governance",
      "description": {
        "simple": "Governance-Regeln beschreiben, welche Cloud-Nutzung erlaubt, erforderlich oder zu überwachen ist. Standards machen wiederkehrende Entscheidungen einheitlich, während Kontrollen ihre Einhaltung prüfen oder durchsetzen.",
        "technical": "Anforderungen werden über Policy Definitions und Initiatives, RBAC-Zuweisungen, Tags, Locks, Budgets und Security-Empfehlungen umgesetzt. Präventive Kontrollen blockieren unerwünschte Änderungen; detektive Kontrollen melden Abweichungen; korrektive Mechanismen unterstützen Remediation. Jede Kontrolle benötigt Scope, Owner, Ausnahmeprozess und Messsignal.",
        "architecture": "Ein gutes Kontrollsystem folgt dem Risiko und setzt möglichst wenige Regeln am breitesten sinnvollen Scope. Globale Guardrails sollten stabil und testbar sein; workload-spezifische Regeln gehören näher an die Subscription oder Resource Group. Kontrollen ohne Ownership erzeugen Reports, aber keine Verbesserung."
      }
    },
    "azure-0038": {
      "id": "azure-0038",
      "title": "Governance-Scopes und Managementhierarchie",
      "parent": "azure-0037",
      "category": "Governance",
      "description": {
        "simple": "Azure ordnet Governance in mehrere Ebenen: Management Groups, Subscriptions, Resource Groups und einzelne Ressourcen. Eine Regel an einer höheren Ebene kann für darunterliegende Bereiche gelten.",
        "technical": "Azure Resource Manager stellt diese vier Managementscopes bereit. Management Groups gruppieren Subscriptions; Subscriptions enthalten Resource Groups; Resource Groups enthalten die meisten Ressourcen. Policy- und RBAC-Zuweisungen können vererbt werden, während Tags nicht automatisch von Resource Groups auf Ressourcen vererbt werden.",
        "architecture": "Die Scopewahl bestimmt Reichweite, Delegation und Fehlerauswirkung einer Kontrolle. Stabile, gemeinsame Vorgaben gehören höher; workload- oder teamspezifische Regeln tiefer. Überbreite Assignments erschweren Ausnahmen und Fehleranalyse, während zu tiefe Zuweisungen Konsistenz und Betriebsskalierung verschlechtern."
      }
    },
    "azure-0040": {
      "id": "azure-0040",
      "title": "Governance Guardrails",
      "parent": "azure-0037",
      "category": "Governance",
      "description": {
        "simple": "Guardrails sind verbindliche Leitplanken, innerhalb derer Teams Azure selbstständig nutzen können. Sie verhindern oder melden besonders riskante und unerwünschte Konfigurationen.",
        "technical": "Azure Policy liefert präventive und detektive Effects wie deny, audit und modify; RBAC begrenzt Managementaktionen und Resource Locks schützen vor Löschung oder Änderung. Guardrails können auf Management-Group-, Subscription- oder Resource-Group-Ebene zugewiesen werden. Compliance-Daten und Ausnahmen gehören zum Lifecycle.",
        "architecture": "Guardrails sollten wenige, risikobasierte Mindestanforderungen durchsetzen und über Sandboxen oder gestufte Rollouts getestet werden. Zu strikte Regeln blockieren Lieferung und erzeugen Schattenprozesse; reine Audit-Regeln ohne Remediation tolerieren dauerhafte Drift. Landing-Zone-Teams benötigen einen transparenten Ausnahme- und Änderungsprozess."
      }
    },
    "azure-0046": {
      "id": "azure-0046",
      "title": "Privileged Identity Management (PIM)",
      "parent": "azure-0044",
      "category": "Identity",
      "description": {
        "simple": "PIM macht privilegierte Rollen zeitlich begrenzt statt dauerhaft aktiv. Administratoren aktivieren ihre Rechte bei Bedarf und können dabei Genehmigung, Begründung oder MFA erfüllen müssen.",
        "technical": "Microsoft Entra PIM verwaltet eligible und aktive Zuweisungen für Microsoft-Entra-Rollen, Azure-Ressourcenrollen und weitere unterstützte Ressourcen. Aktivierungsregeln können Laufzeit, Genehmigung, MFA, Begründung, Benachrichtigung und Access Reviews vorgeben.",
        "architecture": "PIM reduziert stehende Administratorrechte und unterstützt Just-in-Time- sowie Just-Enough-Access. Kritische Rollen sollten eligible, zeitlich begrenzt und überwacht sein; Notfallkonten benötigen ein getrenntes Betriebsmodell. PIM ergänzt Least Privilege, ersetzt aber keine saubere Rollendefinition."
      }
    },
    "azure-0054": {
      "id": "azure-0054",
      "title": "Landing Zones (als modernes Gesamt-Konzept)",
      "parent": "azure-0047",
      "category": "Architecture",
      "description": {
        "simple": "",
        "technical": "Landing Zones (als modernes Gesamt-Konzept)",
        "architecture": ""
      }
    },
    "azure-0074": {
      "id": "azure-0074",
      "title": "Azure Security Controls im Zusammenspiel",
      "parent": "azure-0073",
      "category": "Identity",
      "description": {
        "simple": "Azure schützt Identitäten, Netzwerke, Anwendungen und Daten mit mehreren zusammenwirkenden Kontrollen. Dazu gehören Entra ID, RBAC, PIM, NSGs, Firewall, Private Endpoints, Verschlüsselung, Key Vault, Defender for Cloud, Policy und Backup. Kein einzelner Dienst deckt alle Risiken ab.",
        "technical": "Identity Controls authentifizieren Akteure und autorisieren Aktionen; Network Controls filtern und segmentieren Datenpfade; Workload Controls härten Konfiguration und erkennen Bedrohungen; Data Controls verschlüsseln, versionieren und sichern Informationen. Azure Policy und Defender bewerten den Zustand kontinuierlich. Logs, Alerts und Incident-Prozesse schließen den Regelkreis.",
        "architecture": "Controls werden nach Angriffspfad und Schutzobjekt geschichtet, nicht nach Portalmenü. Zentrale Guardrails schaffen Mindeststandards, workloadnahe Regeln berücksichtigen lokale Anforderungen. Zu viele überlappende Kontrollen erhöhen Komplexität; fehlende Unabhängigkeit erzeugt gemeinsame Ausfall- oder Kompromittierungswege."
      }
    },
    "azure-0094": {
      "id": "azure-0094",
      "title": "Manageability und Cloud Operations",
      "parent": "azure-0002",
      "category": "Azure Fundamentals",
      "description": {
        "simple": "Manageability beschreibt, wie Azure-Ressourcen zentral bereitgestellt, gesteuert und überwacht werden. Gute Verwaltbarkeit macht Betrieb wiederholbar und nachvollziehbar. Sie verbindet Werkzeuge, Automatisierung, Governance und Monitoring.",
        "technical": "Azure Portal, CLI, PowerShell, REST APIs und Infrastructure as Code greifen auf die Azure-Steuerungsebene zu. Azure Monitor sammelt Betriebsdaten, während Policy und RBAC Grenzen für Änderungen setzen. Die Plattform stellt Werkzeuge bereit, aber der Kunde definiert Standards, Zuständigkeiten und Reaktionsprozesse.",
        "architecture": "Architekten standardisieren Bereitstellung, Telemetrie, Zugriff und Betriebsabläufe über Plattformteams und Workloadteams hinweg. Zentralisierung verbessert Konsistenz, kann jedoch Teamautonomie und Datengrenzen einschränken. Ein föderiertes Betriebsmodell kombiniert zentrale Leitplanken mit workloadnaher Verantwortung."
      }
    },
    "azure-0112": {
      "id": "azure-0112",
      "title": "Multi-Zone und Multi-Region nach Kritikalität",
      "parent": "azure-0108",
      "category": "Architecture",
      "description": {
        "simple": "Mehrere Zonen schützen vor lokalen Rechenzentrumsausfällen, mehrere Regionen vor größeren regionalen Ereignissen. Nicht jede Anwendung benötigt beide Ebenen. Die Wahl folgt Geschäftsrisiko und Wiederherstellungsziel.",
        "technical": "Zonenredundanz verteilt Komponenten innerhalb einer Region mit geringer Latenz; Multi-Region benötigt zusätzlich Replikation, globales Routing und abgestimmte Abhängigkeiten. Monitoring muss den Zustand je Standort und den gesamten Benutzerfluss zeigen. Failover und Datenkonsistenz unterscheiden sich je Dienst.",
        "architecture": "Multi-Region kann RTO verbessern, erhöht aber Kosten, Betriebsaufwand und Testbedarf erheblich. Architekten wählen Active/Active, Active/Passive oder Restore nach SLO, RPO/RTO und Datenanforderungen. Telemetrie und Runbooks müssen dieselben Fehlergrenzen abdecken wie das Design."
      }
    },
    "azure-0114": {
      "id": "azure-0114",
      "title": "Disaster Recovery (DR)",
      "parent": "azure-0002",
      "category": "Architecture",
      "description": {
        "simple": "Disaster Recovery beschreibt, wie ein Dienst nach einem schweren Ausfall oder Sicherheitsvorfall wieder arbeitsfähig wird. Dazu gehören Wiederherstellung, Failover, Kommunikation und Rückkehr zum Normalbetrieb. Backup allein ist noch kein vollständiger DR-Plan.",
        "technical": "DR kombiniert Recovery Points, Replikation, Failover/Failback, alternative Betriebsumgebungen und dokumentierte Runbooks. RPO begrenzt tolerierbaren Datenverlust, RTO die Wiederanlaufzeit. Recovery muss Identitäten, Schlüssel, Netzwerk, Abhängigkeiten, Datenkonsistenz und Cyber-Recovery nach einer Kompromittierung berücksichtigen.",
        "architecture": "Die Strategie folgt Business Impact und Ausfallszenarien: Restore, Active/Passive oder Active/Active haben unterschiedliche Kosten und Komplexität. Backups sollten getrennt, zugriffsgeschützt, überwacht und möglichst unveränderbar sein. Ein regionaler Failover hilft nicht, wenn kompromittierte Daten oder Identitäten ungeprüft repliziert werden."
      }
    },
    "azure-0197": {
      "id": "azure-0197",
      "title": "Cloud Services (Type of clouds)",
      "parent": "azure-0001",
      "category": "Architecture",
      "description": {
        "simple": "",
        "technical": "Cloud Services (Type of clouds)",
        "architecture": ""
      }
    },
    "azure-0229": {
      "id": "azure-0229",
      "title": "Shared Responsibility Model",
      "parent": "azure-0197",
      "category": "Architecture",
      "description": {
        "simple": "",
        "technical": "Shared Responsibility Model",
        "architecture": ""
      }
    },
    "azure-0236": {
      "id": "azure-0236",
      "title": "Azure Architectural Components",
      "parent": "azure-0235",
      "category": "Architecture",
      "description": {
        "simple": "",
        "technical": "Azure Architectural Components",
        "architecture": ""
      }
    },
    "azure-0237": {
      "id": "azure-0237",
      "title": "Regions",
      "parent": "azure-0236",
      "category": "Architecture",
      "description": {
        "simple": "",
        "technical": "Regions",
        "architecture": ""
      }
    },
    "azure-0244": {
      "id": "azure-0244",
      "title": "Availability Zones (AZ)",
      "parent": "azure-0236",
      "category": "Architecture",
      "description": {
        "simple": "",
        "technical": "Availability Zones (AZ)",
        "architecture": ""
      }
    },
    "azure-0254": {
      "id": "azure-0254",
      "title": "Region Pairs",
      "parent": "azure-0236",
      "category": "Architecture",
      "description": {
        "simple": "",
        "technical": "Region Pairs",
        "architecture": ""
      }
    },
    "azure-0277": {
      "id": "azure-0277",
      "title": "Azure Resource Groups",
      "parent": "azure-0236",
      "category": "Governance",
      "description": {
        "simple": "Eine Resource Group ist ein logischer Container für zusammengehörige Azure-Ressourcen. Sie bildet eine wichtige Grenze für Bereitstellung, Zugriff, Policy, Tags, Locks und gemeinsamen Lebenszyklus.",
        "technical": "Die meisten Azure-Ressourcen gehören genau einer Resource Group innerhalb einer Subscription an. Ressourcen können miteinander kommunizieren, obwohl sie in unterschiedlichen Gruppen liegen, und viele Ressourcentypen lassen sich zwischen Gruppen verschieben. Beim Löschen einer Resource Group orchestriert Resource Manager auch die Löschung ihrer enthaltenen Ressourcen.",
        "architecture": "Ressourcen sollten nach gemeinsamem Lifecycle, Ownership und Verwaltungsbedarf gruppiert werden, nicht allein nach Ressourcentyp. Eine zu große Gruppe erhöht Ausfallradius und unklare Verantwortung; zu viele kleine Gruppen erzeugen Verwaltungsaufwand. Shared Services mit anderem Lifecycle gehören häufig in getrennte Gruppen."
      }
    },
    "azure-0281": {
      "id": "azure-0281",
      "title": "Ermöglicht gemeinsame Verwaltung von Policies, Monitoring, Billing, Access Control.",
      "parent": "azure-0277",
      "category": "Monitoring",
      "description": {
        "simple": "• Ermöglicht gemeinsame Verwaltung von Policies, Monitoring, Billing, Access Control.",
        "technical": "• Ermöglicht gemeinsame Verwaltung von Policies, Monitoring, Billing, Access Control.",
        "architecture": ""
      }
    },
    "azure-0284": {
      "id": "azure-0284",
      "title": "Azure Resource Manager (ARM)",
      "parent": "azure-0277",
      "category": "Governance",
      "description": {
        "simple": "Azure Resource Manager ist die zentrale Bereitstellungs- und Verwaltungsschicht für Azure-Ressourcen. Portal, Befehlszeile, SDKs und Templates verwenden diese einheitliche Control Plane.",
        "technical": "Resource Manager authentifiziert und autorisiert Managementanfragen, leitet sie an Resource Provider weiter und verwaltet Scopes, Deployments sowie Abhängigkeiten. Managementfunktionen wie RBAC, Policy, Tags und Locks wirken über diese Ebene. ARM Templates und Bicep beschreiben deklarative Zielzustände für verschiedene Scopes.",
        "architecture": "ARM ist die gemeinsame Governance-Enforcement- und Automatisierungsgrenze, nicht der Datenpfad der Anwendung. Architekturstandards sollten über Infrastructure as Code, Policy und kontrollierte Rollen reproduzierbar an ARM angebunden werden. Direkte Portaländerungen ohne Code und Review erzeugen Drift, obwohl sie dieselbe API verwenden."
      }
    },
    "azure-0296": {
      "id": "azure-0296",
      "title": "Organisiert Ressourcen in Resource Groups",
      "parent": "azure-0284",
      "category": "Governance",
      "description": {
        "simple": "• Organisiert Ressourcen in Resource Groups",
        "technical": "• Organisiert Ressourcen in Resource Groups",
        "architecture": ""
      }
    },
    "azure-0298": {
      "id": "azure-0298",
      "title": "ARM = zentrale Steuerebene für Deployments, Governance und Konsistenz.",
      "parent": "azure-0297",
      "category": "Identity",
      "description": {
        "simple": "",
        "technical": "ARM = zentrale Steuerebene für Deployments, Governance und Konsistenz.",
        "architecture": ""
      }
    },
    "azure-0322": {
      "id": "azure-0322",
      "title": "Azure Virtual Machines",
      "parent": "azure-0321",
      "category": "Compute",
      "description": {
        "simple": "Azure Virtual Machines stellen Windows- oder Linux-Server als flexibel konfigurierbare Cloud-Ressourcen bereit. Sie werden genutzt, wenn eine Anwendung Kontrolle über Betriebssystem, Laufzeit oder installierte Software benötigt.",
        "technical": "Eine VM kombiniert eine gewählte VM-Größe mit einem Betriebssystem-Image, Netzwerkschnittstelle, VNet-Anbindung und OS- sowie Daten-Datenträgern. Azure virtualisiert und betreibt die physische Infrastruktur; der Kunde konfiguriert, patcht und überwacht Gastbetriebssystem und Workload. Verfügbarkeit und Skalierung entstehen erst durch mehrere Instanzen und ergänzende Dienste.",
        "architecture": "VMs passen zu Lift-and-Shift, Spezialsoftware, Appliances und strikten OS-Anforderungen. Gegenüber App Service oder Containerplattformen bieten sie maximale Kontrolle, verursachen aber den höchsten Betriebsaufwand für Patching, Backup, Hardening, Skalierung und Hochverfügbarkeit. Die Architektur sollte VNet, NSG, Managed Identity, RBAC, Managed Disks, Azure Monitor und eine Resilienzstrategie gemeinsam entwerfen."
      }
    },
    "azure-0351": {
      "id": "azure-0351",
      "title": "Azure App Service",
      "parent": "azure-0321",
      "category": "Compute",
      "description": {
        "simple": "Azure App Service hostet Webanwendungen, APIs und mobile Backends als verwaltete Plattform. Entwickler stellen Code oder Container bereit, ohne die zugrunde liegenden Server selbst zu verwalten.",
        "technical": "Apps laufen auf Windows- oder Linux-Workern eines App Service Plans und nutzen integrierte Deployment-, Skalierungs-, TLS-, Identitäts- und Monitoringfunktionen. Azure verwaltet Host, Gastbetriebssystem und unterstützte Plattformlaufzeiten. Der Kunde verwaltet Anwendung, Konfiguration, Daten, Abhängigkeiten und Zugriffsmodell.",
        "architecture": "App Service ist oft die erste PaaS-Wahl für HTTP-basierte Anwendungen mit unterstützten Laufzeiten. Gegenüber VMs reduziert es Patch- und Infrastrukturaufwand, bietet aber weniger OS-Kontrolle; gegenüber AKS ist es einfacher, aber weniger flexibel für komplexe Containerorchestrierung. Plan-Tier, Zonenunterstützung, VNet-Integration, Managed Identity, Deployment Slots und Observability bestimmen das Produktionsdesign."
      }
    },
    "azure-0415": {
      "id": "azure-0415",
      "title": "Azure Container Instances (ACI)",
      "parent": "azure-0414",
      "category": "Compute",
      "description": {
        "simple": "Azure Container Instances führt Container ohne selbst verwaltete VMs oder Kubernetes-Cluster aus. Der Dienst eignet sich für einfache, isolierte oder kurzlebige Aufgaben, die schnell starten sollen.",
        "technical": "ACI plant eine Containergruppe auf Azure-Infrastruktur; Container der Gruppe teilen Lifecycle, Ressourcen, Netzwerk und Volumes. CPU und Arbeitsspeicher werden bei Bereitstellung angegeben, Abrechnung erfolgt nach Ressourcennutzung. Höhere Orchestrierungsfunktionen wie integriertes Scale-out, revisionsbasiertes Routing oder Kubernetes-API fehlen.",
        "architecture": "ACI ist ein schlanker Baustein für Batchjobs, Tests, Bursting oder einfache Dienste. Gegenüber Container Apps fehlen anwendungsbezogene Skalierung und Microservicefunktionen; gegenüber AKS fehlen Clusterkontrolle und umfassende Orchestrierung. Für dauerhafte, komplexe Produktionssysteme muss der Kunde fehlende Routing-, Skalierungs- und Lifecyclefunktionen selbst ergänzen."
      }
    },
    "azure-0425": {
      "id": "azure-0425",
      "title": "Azure Kubernetes Service (AKS)",
      "parent": "azure-0414",
      "category": "Compute",
      "description": {
        "simple": "AKS ist ein verwalteter Kubernetes-Dienst für containerisierte Anwendungen. Azure betreibt die Kubernetes-Control-Plane; Teams verwenden Kubernetes-Funktionen für Deployment, Skalierung, Netzwerk und Betrieb ihrer Workloads.",
        "technical": "Ein AKS-Cluster besteht aus einer von Azure verwalteten Control Plane und Node Pools, auf denen Pods laufen. AKS integriert Azure-Netzwerk, Microsoft Entra, Azure RBAC, Workload Identity, Container Registry und Azure Monitor. AKS Automatic übernimmt mehr Node-, Upgrade-, Security- und Monitoringaufgaben als AKS Standard.",
        "architecture": "AKS ist sinnvoll, wenn Kubernetes-API, Portabilität, komplexe Orchestrierung oder ein Plattformteam benötigt werden. Gegenüber ACI und Container Apps bietet es mehr Kontrolle, aber deutlich mehr Betriebs- und Governanceaufwand; gegenüber App Service ist es flexibler, aber komplexer. Netzwerkmodell, Identität, Policies, Node-Lifecycle, Upgrades, Observability und Kosten sind gemeinsame Architekturentscheidungen."
      }
    },
    "azure-0442": {
      "id": "azure-0442",
      "title": "Virtual Network (VNet)",
      "parent": "azure-0441",
      "category": "Networking",
      "description": {
        "simple": "Ein Virtual Network ist dein eigenes privates Netzwerk in Azure. Darin können Azure-Ressourcen miteinander kommunizieren, ähnlich wie Geräte in einem Firmennetz. Du teilst es in Subnetze auf, um Bereiche voneinander zu trennen.",
        "technical": "Ein VNet ist ein regionales, softwaredefiniertes Netzwerk mit einem oder mehreren privaten CIDR-Adressbereichen. Subnetze segmentieren den Adressraum; Systemrouten ermöglichen zunächst interne Kommunikation, während NSGs, benutzerdefinierte Routen, Peering und Gateways den Verkehrsfluss steuern.",
        "architecture": "Das VNet bildet eine zentrale Netzwerk- und Segmentierungsgrenze für Azure-Workloads. Adressräume müssen früh geplant und bei Peering oder Hybridanbindung überschneidungsfrei sein. In größeren Umgebungen werden VNets häufig als Hub-and-Spoke-Topologie mit zentraler Firewall, Private Endpoints und DNS-Auflösung kombiniert."
      }
    },
    "azure-0461": {
      "id": "azure-0461",
      "title": "Virtual Network Gateway",
      "parent": "azure-0460",
      "category": "Networking",
      "description": {
        "simple": "Ein Virtual Network Gateway verbindet ein VNet mit anderen Netzwerken. Je nach Typ transportiert es VPN- oder ExpressRoute-Verkehr.",
        "technical": "Ein Virtual Network Gateway besteht aus von Azure verwalteten Gatewayinstanzen in einem dedizierten GatewaySubnet. Der Gatewaytyp Vpn terminiert verschlüsselte VPN-Verbindungen; der Typ ExpressRoute verbindet ein VNet mit einem ExpressRoute Circuit.",
        "architecture": "Der Gatewaytyp ist eine grundlegende Designentscheidung für Hybridkonnektivität. Kapazität, Hochverfügbarkeit, Zonenredundanz und Koexistenz von VPN- und ExpressRoute-Gateways müssen anhand von Durchsatz- und Resilienzzielen gewählt werden."
      }
    },
    "azure-0462": {
      "id": "azure-0462",
      "title": "VPN Gateway",
      "parent": "azure-0441",
      "category": "Networking",
      "description": {
        "simple": "VPN Gateway verbindet Azure verschlüsselt mit einem Standort, einzelnen Geräten oder einem anderen VNet. Der Verkehr kann dabei über das öffentliche Internet laufen, bleibt aber durch den VPN-Tunnel geschützt.",
        "technical": "Azure VPN Gateway ist ein Virtual Network Gateway vom Typ Vpn. Es unterstützt unter anderem Site-to-Site-, Point-to-Site- und VNet-to-VNet-Verbindungen mit IPsec/IKE. Die verwalteten Gatewayinstanzen werden im GatewaySubnet bereitgestellt.",
        "architecture": "VPN Gateway eignet sich für schnelle Hybridanbindungen, Remotezugriff und kleinere bis mittlere Produktionsszenarien. SKU, aktiv-aktiv-Konfiguration, Zonenredundanz, Routingtyp und redundante lokale Geräte bestimmen Durchsatz und Ausfallsicherheit. Für planbare private Konnektivität mit höherer Bandbreite kann ExpressRoute geeigneter sein."
      }
    },
    "azure-0478": {
      "id": "azure-0478",
      "title": "ExpressRoute",
      "parent": "azure-0441",
      "category": "Networking",
      "description": {
        "simple": "ExpressRoute verbindet ein lokales Netzwerk privat mit Microsoft-Cloud-Diensten. Die Verbindung läuft über einen Konnektivitätsanbieter und nicht über das öffentliche Internet.",
        "technical": "ExpressRoute stellt Layer-3-Konnektivität über einen Provider, eine Ethernet-Punkt-zu-Punkt-Verbindung oder eine Colocation bereit. BGP tauscht Routen aus; jeder Circuit besitzt redundante Verbindungen zu Microsoft-Edge-Routern.",
        "architecture": "ExpressRoute ist für planbare Bandbreite, konsistente Latenz und hohe Zuverlässigkeit geeignet. Das Design umfasst Circuit-Redundanz, getrennte Peeringstandorte, BGP, Gatewaykapazität und häufig ein zusätzliches Site-to-Site-VPN als unabhängigen Ausweichpfad."
      }
    },
    "azure-0505": {
      "id": "azure-0505",
      "title": "Load Balancer",
      "parent": "azure-0441",
      "category": "Networking",
      "description": {
        "simple": "Azure Load Balancer verteilt TCP- oder UDP-Verbindungen auf mehrere gesunde Backend-Systeme. Dadurch bleibt ein Dienst verfügbar, wenn eine Instanz ausfällt oder viel Last entsteht.",
        "technical": "Load Balancer arbeitet auf Layer 4 und verwendet Frontend-IP-Konfigurationen, Backend Pools, Load-Balancing-Regeln und Health Probes. Er kann öffentlich oder intern sein; die Verteilungsentscheidung erfolgt pro Netzwerkflow.",
        "architecture": "Load Balancer ist passend für sehr performante regionale oder globale Layer-4-Szenarien ohne HTTP-Inhaltsrouting. Backend-Redundanz, Zonenmodell, Probe-Design und Outbound-Konnektivität müssen bewusst geplant werden. Für HTTP(S)-Routing auf Layer 7 ist Application Gateway oder Front Door geeigneter."
      }
    },
    "azure-0519": {
      "id": "azure-0519",
      "title": "Application Gateway",
      "parent": "azure-0441",
      "category": "Networking",
      "description": {
        "simple": "Application Gateway verteilt Webanfragen innerhalb einer Azure-Region. Es kann anhand von Webadresse oder Hostnamen entscheiden, welches Backend eine Anfrage erhält.",
        "technical": "Application Gateway ist ein Layer-7-Web-Traffic-Load-Balancer mit Listenern, Routingregeln, Backend Pools, Health Probes und HTTP-Einstellungen. Es unterstützt URL- und hostbasiertes Routing, TLS-Terminierung, Autoscaling, Zonenredundanz und WAF-Integration.",
        "architecture": "Application Gateway eignet sich als regionaler HTTP(S)-Einstiegspunkt für öffentliche oder private Anwendungen. TLS-Ende-zu-Ende, Backend-Namensauflösung, Skalierung und WAF-Policies müssen gemeinsam geplant werden. In globalen Architekturen kann Front Door davor liegen."
      }
    },
    "azure-0545": {
      "id": "azure-0545",
      "title": "Azure DNS",
      "parent": "azure-0441",
      "category": "Networking",
      "description": {
        "simple": "DNS übersetzt leicht merkbare Namen in IP-Adressen. Azure DNS hostet öffentliche und private DNS-Zonen auf der Azure-Infrastruktur.",
        "technical": "Azure DNS verwaltet DNS-Zonen und Record Sets über Azure Resource Manager. Public DNS beantwortet Internetanfragen autoritativ; Private DNS löst Namen in verknüpften VNets auf. Azure DNS registriert keine Domainnamen selbst.",
        "architecture": "DNS ist eine kritische Abhängigkeit für Dienstauffindbarkeit und Failover. Öffentliche und private Namensräume, Delegation, TTLs, Split-Horizon-DNS und Hybridauflösung sollten bewusst geplant werden. Für Hybridauflösung kann Azure DNS Private Resolver eingesetzt werden."
      }
    },
    "azure-0558": {
      "id": "azure-0558",
      "title": "Private DNS",
      "parent": "azure-0545",
      "category": "Networking",
      "description": {
        "simple": "Azure Private DNS löst interne Namen für verbundene Virtual Networks auf. So können Ressourcen private Ziele über Namen statt über feste IP-Adressen erreichen.",
        "technical": "Private DNS Zones werden mit VNets verknüpft und unterstützen gängige DNS-Recordtypen. Optional kann ein Link VM-Records automatisch registrieren. Für Private Endpoints werden dienstspezifische privatelink-Zonen verwendet, damit der öffentliche Dienstname zur privaten IP aufgelöst wird.",
        "architecture": "Private DNS ist ein eigener Architekturbaustein für Private Link, Peering und Hybridnetze. Zonenlinks, zentrale oder verteilte Zuständigkeit, Split-Horizon-Verhalten und Auflösung von On-Premises über Private Resolver müssen konsistent geplant werden."
      }
    },
    "azure-0562": {
      "id": "azure-0562",
      "title": "Front Door",
      "parent": "azure-0545",
      "category": "Networking",
      "description": {
        "simple": "Azure Front Door ist ein globaler Einstiegspunkt für Webanwendungen. Benutzer werden über Microsofts Edge-Netzwerk schnell und sicher zu einem gesunden Backend geleitet.",
        "technical": "Front Door Standard/Premium ist ein globaler Layer-7-Proxy und CDN für HTTP(S). Es bietet Anycast-basierten Einstieg, Origin Health Probes, Routing, TLS, Caching und WAF-Integration; Premium unterstützt zusätzlich private Origin-Anbindung per Private Link.",
        "architecture": "Front Door eignet sich für weltweit verteilte, internetorientierte Webanwendungen und schnelle regionsübergreifende Umschaltung. Origins sollten gegen direkten Zugriff geschützt, TLS-Ende-zu-Ende und WAF-Policies geplant werden. Regional kann Front Door an Application Gateway oder andere Origins weiterleiten."
      }
    },
    "azure-0579": {
      "id": "azure-0579",
      "title": "Storage Account",
      "parent": "azure-0571",
      "category": "Storage",
      "description": {
        "simple": "Ein Storage Account ist der Verwaltungs- und Sicherheitsrahmen für Azure-Storage-Daten. Er enthält Dienstendpunkte für Blobs, Files, Queues und Tables und besitzt einen weltweit eindeutigen Namen. Einstellungen für Region, Redundanz, Netzwerk und Zugriff wirken auf die enthaltenen Dienste.",
        "technical": "Der Storage Account stellt einen eindeutigen Namespace und getrennte Datenendpunkte bereit. Auf Account-Ebene werden Typ, Performance, Redundanz, Verschlüsselungsoptionen, Firewall, Private Endpoints und Shared-Key-Zulassung konfiguriert; Datenzugriffe werden über Entra ID/RBAC, SAS oder Account Keys autorisiert. Account Keys geben weitreichenden Zugriff und sollten zugunsten identitätsbasierter Verfahren vermieden oder streng geschützt werden.",
        "architecture": "Accountgrenzen sind zugleich Blast-Radius-, Policy-, Netzwerk-, Schlüssel-, Quota- und teilweise Kosten-/Lifecycle-Grenzen. Workloads mit unterschiedlichen Sicherheits-, Verfügbarkeits- oder Betriebsanforderungen sollten nicht blind einen Account teilen. Private Endpoints vermeiden öffentliche Datenpfade, benötigen aber pro Storage-Dienst passende Endpunkte und DNS-Auflösung."
      }
    },
    "azure-0645": {
      "id": "azure-0645",
      "title": "Azure Migrate",
      "parent": "azure-0637",
      "category": "Storage",
      "description": {
        "simple": "Azure Migrate hilft, bestehende Server, Anwendungen und Datenbanken für Azure zu erfassen, zu bewerten und zu migrieren. Die Plattform bündelt Inventar, Abhängigkeitsanalyse, Zielbewertung und Migrationswerkzeuge. Sie unterstützt damit die Planung eines kontrollierten Umzugs.",
        "technical": "Ein Azure-Migrate-Projekt sammelt Discovery- und Assessmentdaten über Appliances, Agents oder integrierte Werkzeuge. Assessments bewerten Readiness, Sizing, Abhängigkeiten und Kosten; spezialisierte Tools führen Server-, Web-App- und Datenbankmigrationen aus. Unterstützte Quellen, Zielpfade und Downtime unterscheiden sich je Workload.",
        "architecture": "Azure Migrate ist ein Steuerungs- und Entscheidungsrahmen, kein automatischer Ersatz für Zielarchitektur. Vor jeder Welle ist zwischen Rehost, Replatform und Refactor abzuwägen und eine passende Landing Zone bereitzustellen. Daten, Identität, Netzwerk, Sicherheit, Betrieb und Rollback müssen gemeinsam geplant werden."
      }
    },
    "azure-0724": {
      "id": "azure-0724",
      "title": "Azure Cosmos DB",
      "parent": "azure-0723",
      "category": "Databases",
      "description": {
        "simple": "Azure Cosmos DB ist eine vollständig verwaltete NoSQL-Datenbank für moderne, global verteilte Anwendungen. Sie speichert flexible Datenmodelle und kann Durchsatz sowie Daten über Regionen verteilen. Der Dienst ist für niedrige Latenz und hohe Skalierung ausgelegt.",
        "technical": "Ein Cosmos-DB-Account enthält Datenbanken, Container und Items und kann mehrere Regionen sowie APIs unterstützen. Container verteilen Daten anhand eines Partition Keys; Throughput wird manuell oder per Autoscale bereitgestellt, Konsistenz ist wählbar. Azure übernimmt Infrastruktur, Patching, Replikation und Backups, während Datenmodell und Partitionierung beim Kunden bleiben.",
        "architecture": "Cosmos DB passt zu globalen NoSQL-Workloads mit vorhersehbarer niedriger Latenz, elastischem Durchsatz und flexiblen Schemas. Partition Key, Konsistenz, Regionslayout und Request Units bestimmen Skalierbarkeit und Kosten. Für relationale Transaktionen, komplexe Joins oder klassische SQL-Workloads ist Azure SQL Database oft geeigneter."
      }
    },
    "azure-0731": {
      "id": "azure-0731",
      "title": "Azure SQL Database",
      "parent": "azure-0723",
      "category": "Databases",
      "description": {
        "simple": "Azure SQL Database ist eine vollständig verwaltete relationale Datenbank in Azure. Sie speichert strukturierte Daten in Tabellen und unterstützt SQL sowie Transaktionen. Azure übernimmt viele Aufgaben wie Patching, Hochverfügbarkeit und automatische Backups.",
        "technical": "Azure SQL Database ist ein PaaS-Datenbankdienst mit logischen Servern, einzelnen Datenbanken und Elastic Pools. Die Engine stellt T-SQL, ACID-Transaktionen, integrierte Hochverfügbarkeit, automatische Sicherungen, Skalierungsoptionen und Sicherheitsfunktionen bereit. Der Kunde verantwortet Schema, Abfragen, Zugriffsmodell, Leistungsdimensionierung und Wiederherstellungsanforderungen.",
        "architecture": "Azure SQL Database ist die Standardwahl für relationale Anwendungen, die keine Betriebssystem- oder vollständige SQL-Server-Instanzkontrolle benötigen. Gegenüber SQL auf einer VM reduziert sie Betriebsverantwortung, bringt aber Plattformgrenzen und weniger Instanzkontrolle. Private Endpoint, Entra-Authentifizierung, Datenklassifikation, Skalierungsmodell und Geo-DR gehören zum Design."
      }
    },
    "azure-0815": {
      "id": "azure-0815",
      "title": "Azure Security & Protection Architecture",
      "parent": "azure-0000",
      "category": "Security",
      "description": {
        "simple": "Azure Security & Protection verbindet Identitäts-, Netzwerk-, Workload-, Daten- und Recovery-Schutz zu einer durchgängigen Architektur. Ziel ist, Angriffe zu verhindern, früh zu erkennen, ihre Auswirkung zu begrenzen und den Betrieb wiederherzustellen. Security bleibt dabei eine gemeinsame Verantwortung von Microsoft und Kunde.",
        "technical": "Die Architektur kombiniert Entra ID, Conditional Access, MFA, PIM, RBAC, Netzwerksegmentierung, Firewall, DDoS/WAF, Private Link, Key Vault, Verschlüsselung, Defender for Cloud, Policy, Monitoring und Backup. Controls liefern Prävention, Erkennung, Reaktion und Recovery über Management- und Datenebene. Telemetrie und Ownership verbinden Findings mit Remediation.",
        "architecture": "Das Schutzmodell folgt Zero Trust: explizit prüfen, Least Privilege verwenden und Kompromittierung annehmen. Sicherheitsgrenzen werden nach Workload, Umgebung, Datenklassifikation und Blast Radius gestaltet. Zentral verantwortete Baselines und dezentrale Workload-Controls benötigen einen gemeinsamen Ausnahme-, Test- und Incident-Prozess."
      }
    },
    "azure-0817": {
      "id": "azure-0817",
      "title": "Defense in Depth",
      "parent": "azure-0816",
      "category": "Security",
      "description": {
        "simple": "Defense in Depth schützt ein System mit mehreren unabhängigen Sicherheitsschichten. Wenn eine Kontrolle versagt oder umgangen wird, begrenzen weitere Schichten den Angriff. Die Schichten reichen von physischer Infrastruktur bis zu Identität, Netzwerk, Anwendung, Daten und Recovery.",
        "technical": "Typische Ebenen sind Physical, Identity and Access, Perimeter, Internal Network, Compute, Application, Data und Recovery. Jede Ebene kombiniert präventive, detektive und korrektive Controls und liefert Telemetrie. Unabhängige Identitäten, Schlüssel und Backups verhindern, dass eine einzige Kompromittierung alle Schutzschichten zugleich aufhebt.",
        "architecture": "Mehr Schichten sind nicht automatisch besser; sie müssen unterschiedliche Fehler- und Angriffswege adressieren. Doppelte Kontrollen ohne klare Verantwortung erhöhen Betriebslast, während gemeinsame Administratoren oder Secrets scheinbar unabhängige Schichten koppeln. Threat Modeling und Attack Paths bestimmen die sinnvolle Staffelung."
      }
    },
    "azure-0821": {
      "id": "azure-0821",
      "title": "Identity & Access Security",
      "parent": "azure-0817",
      "category": "Identity",
      "description": {
        "simple": "Identity & Access Security prüft, wer oder was auf Ressourcen zugreifen möchte und was erlaubt ist. Authentication bestätigt die Identität, Authorization entscheidet über Berechtigungen. MFA, Conditional Access, PIM, Managed Identity und RBAC reduzieren missbräuchlichen Zugriff.",
        "technical": "Entra ID authentifiziert Benutzer, Anwendungen und Workloadidentitäten und stellt Tokens aus. Conditional Access bewertet Signale und erzwingt Controls, MFA erhöht die Sicherheit der Anmeldung, PIM begrenzt privilegierte Rollen zeitlich und RBAC autorisiert Azure-Aktionen an Scopes. Managed Identities vermeiden gespeicherte Anwendungscredentials.",
        "architecture": "Zero Trust verlangt explizite Prüfung, Least Privilege und Annahme einer Kompromittierung. Menschliche und Workloadidentitäten werden getrennt, privilegierte Zugriffe sind zeitlich begrenzt und Notfallkonten gesondert geschützt. Zu breite Rollen und dauerhafte Secrets schaffen Angriffswege über alle anderen Schichten."
      }
    },
    "azure-0841": {
      "id": "azure-0841",
      "title": "Azure Firewall",
      "parent": "azure-0816",
      "category": "Security",
      "description": {
        "simple": "Azure Firewall ist eine zentral verwaltete Netzwerk-Firewall für Azure. Sie kontrolliert und protokolliert erlaubte oder blockierte Verbindungen zwischen Netzwerken und zum Internet.",
        "technical": "Azure Firewall ist ein zustandsbehafteter, cloudnativer Firewall-as-a-Service-Dienst. Er verarbeitet Netzwerk-, Anwendungs- und NAT-Regeln und kann je nach SKU Funktionen wie Threat Intelligence, TLS Inspection und IDPS bereitstellen.",
        "architecture": "Azure Firewall wird häufig zentral in einem Hub-VNet bereitgestellt; UDRs leiten Spoke-Verkehr zur Inspektion dorthin. SKU, dediziertes AzureFirewallSubnet, Hochverfügbarkeit, DNS, Policy-Hierarchie und symmetrisches Routing sind zentrale Designpunkte. NSGs bleiben ergänzend für lokale Segmentierung sinnvoll."
      }
    },
    "azure-0852": {
      "id": "azure-0852",
      "title": "Azure DDoS Protection",
      "parent": "azure-0816",
      "category": "Security",
      "description": {
        "simple": "Azure DDoS Protection hilft, öffentlich erreichbare Azure-Ressourcen gegen sehr große Mengen schädlichen Netzwerkverkehrs zu schützen. Der Dienst erkennt Angriffe und mindert sie automatisch auf Netzwerk- und Transportebene.",
        "technical": "Azure bietet standardmäßig infrastrukturellen DDoS-Schutz. DDoS Network Protection schützt unterstützte öffentliche IP-Ressourcen in aktivierten VNets mit adaptiver Abstimmung, Telemetrie und Zusatzleistungen; DDoS IP Protection gilt pro geschützter öffentlicher IP. Der Schutz wirkt auf Layer 3 und 4.",
        "architecture": "DDoS-Schutz ist Teil eines mehrschichtigen Verfügbarkeitsdesigns für öffentlich exponierte Workloads. Network- oder IP-Protection wird nach Anzahl öffentlicher IPs und Betriebsanforderungen gewählt; WAF ergänzt Layer-7-Schutz. Private Endpoints reduzieren die öffentliche Angriffsfläche."
      }
    },
    "azure-0863": {
      "id": "azure-0863",
      "title": "Web Application Firewall (WAF)",
      "parent": "azure-0860",
      "category": "Security",
      "description": {
        "simple": "Eine WAF schützt Webanwendungen vor typischen Angriffen wie SQL Injection und Cross-Site Scripting. Sie prüft HTTP(S)-Anfragen und kann verdächtige Anfragen protokollieren oder blockieren.",
        "technical": "Azure WAF wird mit Application Gateway oder Front Door bereitgestellt. WAF Policies kombinieren verwaltete OWASP-Regelsätze, eigene Regeln, Ausnahmen und Detection- oder Prevention-Modus.",
        "architecture": "WAF gehört an öffentliche oder sensible HTTP(S)-Einstiegspunkte und ergänzt DDoS-, Netzwerk- und Anwendungsschutz. Policy-Lebenszyklus, Tuning gegen False Positives, Logging und getrennte Regeln pro Anwendung sind für den stabilen Betrieb entscheidend."
      }
    },
    "azure-0864": {
      "id": "azure-0864",
      "title": "NSG (Network Security Group)",
      "parent": "azure-0816",
      "category": "Security",
      "description": {
        "simple": "Eine Network Security Group ist eine Liste von Erlaubnis- und Sperrregeln für Netzwerkverkehr. Sie kann ein Subnet oder die Netzwerkschnittstelle einer VM schützen.",
        "technical": "NSGs enthalten priorisierte, zustandsbehaftete Regeln für eingehenden und ausgehenden Verkehr. Regeln verwenden Quelle, Ziel, Port, Protokoll sowie optional Service Tags oder Application Security Groups. Eine NSG kann Subnetzen und Netzwerkschnittstellen zugeordnet werden.",
        "architecture": "NSGs eignen sich für verteilte Mikrosegmentierung nahe am Workload. Regeln sollten rollenbasiert, minimal und mit ASGs oder Service Tags statt wechselnder Einzel-IPs formuliert werden. Zentrale Firewallkontrolle und NSGs erfüllen unterschiedliche, ergänzende Aufgaben."
      }
    },
    "azure-0871": {
      "id": "azure-0871",
      "title": "Route Table / User-Defined Routes (UDR)",
      "parent": "azure-0816",
      "category": "Security",
      "description": {
        "simple": "Eine Route Table legt fest, welchen Weg Netzwerkverkehr aus einem Subnet nimmt. Eigene Routen können Azure-Standardwege überschreiben, zum Beispiel um Verkehr über eine Firewall zu führen.",
        "technical": "Azure erstellt Systemrouten für jedes Subnet. Eine zugeordnete Route Table enthält User-Defined Routes mit Adresspräfix und Next-Hop-Typ. Azure wählt Routen anhand Präfixlänge, Quelle und weiteren Routingregeln.",
        "architecture": "UDRs erzwingen Inspektions- und Transitpfade in Hub-and-Spoke-Netzen. Rückweg und Hinweg müssen symmetrisch sein; BGP-Propagation, Service Endpoints und spezifischere Präfixe können die effektive Route beeinflussen. Effektive Routen sollten betrieblich geprüft werden."
      }
    },
    "azure-0881": {
      "id": "azure-0881",
      "title": "Private Endpoint",
      "parent": "azure-0877",
      "category": "Networking",
      "description": {
        "simple": "Ein Private Endpoint gibt einem Azure-Dienst eine private IP-Adresse in deinem VNet. Der Dienst kann dadurch intern erreichbar sein, ohne dass der Datenpfad über das öffentliche Internet führen muss.",
        "technical": "Ein Private Endpoint ist eine Netzwerkschnittstelle in einem Subnet, die über Azure Private Link einer konkreten Dienstressource zugeordnet ist. Datenverkehr läuft über das Microsoft-Backbone. Passende Private-DNS-Konfiguration sorgt dafür, dass der Dienstname zur privaten IP aufgelöst wird.",
        "architecture": "Private Endpoints reduzieren öffentliche Exposition und unterstützen Zero-Trust- und Datenabflusskontrollen. Zentralisierung, DNS-Zonen, Genehmigungsworkflow, Netzwerkrichtlinien, Kosten und die Deaktivierung öffentlicher Zugriffe müssen pro Dienst geplant werden. Hybrid- und Peeringnetze können den Endpoint über private Konnektivität erreichen."
      }
    },
    "azure-0884": {
      "id": "azure-0884",
      "title": "Public Endpoint",
      "parent": "azure-0877",
      "category": "Security",
      "description": {
        "simple": "Ein Public Endpoint ist über eine öffentliche Adresse oder einen öffentlichen Dienstnamen erreichbar. Ohne zusätzliche Einschränkungen kann der Zugriff aus dem Internet erfolgen.",
        "technical": "Öffentliche Azure-Dienstendpunkte werden über öffentliche DNS-Namen und IP-Adressen erreicht. Zugriffskontrollen wie Dienstfirewalls, IP-Regeln, Authentifizierung, WAF oder DDoS-Schutz begrenzen das Risiko; der Endpunkt bleibt jedoch öffentlich routbar.",
        "architecture": "Öffentliche Endpunkte sind sinnvoll für bewusst internetorientierte Dienste, sollten aber minimiert und mehrschichtig geschützt werden. Für interne PaaS-Zugriffe sind Private Endpoints häufig die bevorzugte Alternative; Service Endpoints schränken den öffentlichen PaaS-Endpunkt auf VNets ein."
      }
    },
    "azure-0887": {
      "id": "azure-0887",
      "title": "Virtual Network Peering",
      "parent": "azure-0816",
      "category": "Networking",
      "description": {
        "simple": "VNet Peering verbindet zwei Virtual Networks privat miteinander. Ressourcen kommunizieren über das Microsoft-Backbone, als wären die Netzwerke direkt verbunden.",
        "technical": "Peering stellt private, niedrig-latente IP-Konnektivität zwischen VNets in derselben oder in unterschiedlichen Regionen bereit. Die Adressräume dürfen sich nicht überschneiden. Peering ist standardmäßig nicht transitiv; Weiterleitung, Gateway Transit und DNS müssen separat konfiguriert werden.",
        "architecture": "Peering ist der Standardbaustein für Hub-and-Spoke-Topologien und direkte VNet-Konnektivität. Adressmanagement, nichttransitive Pfade, zentrale Inspektion, Gateway Transit, Cross-Subscription- oder Cross-Tenant-Berechtigungen und Kosten müssen geplant werden."
      }
    },
    "azure-0904": {
      "id": "azure-0904",
      "title": "Microsoft Entra ID",
      "parent": "azure-0902",
      "category": "Identity",
      "description": {
        "simple": "Microsoft Entra ID ist Microsofts cloudbasierter Dienst für Identitäten und Zugriffe. Er verwaltet unter anderem Benutzer, Gruppen, Geräte und Anwendungen und prüft Anmeldungen für Azure, Microsoft 365 und integrierte Apps.",
        "technical": "Entra ID stellt Verzeichnis-, Authentifizierungs-, Token- und Policyfunktionen für Workforce- und Workload-Identitäten bereit. Ein Tenant ist eine dedizierte Instanz mit Objekten, Domains, Anwendungen, Rollen und Richtlinien. Moderne Anwendungen integrieren typischerweise OAuth 2.0, OpenID Connect oder SAML.",
        "architecture": "Entra ID ist die Identitäts-Control-Plane und damit eine geschäftskritische Abhängigkeit. Tenant-Struktur, administrative Rollen, Authentifizierungsmethoden, Conditional Access, Workload-Identitäten und Notfallzugang müssen als Plattformstandard betrieben werden. Ein Entra Tenant ist nicht dasselbe wie eine Azure Subscription, besitzt aber Vertrauensbeziehungen zu ihr."
      }
    },
    "azure-0933": {
      "id": "azure-0933",
      "title": "Microsoft Defender for Cloud",
      "parent": "azure-0932",
      "category": "Security",
      "description": {
        "simple": "Microsoft Defender for Cloud bewertet die Sicherheitslage von Cloud-Ressourcen und zeigt Risiken, Empfehlungen und Compliance-Ergebnisse. Je nach aktiviertem Plan ergänzt der Dienst außerdem Schutz für laufende Workloads.",
        "technical": "Defender for Cloud verbindet Cloud Security Posture Management mit Workload Protection für Azure, Hybrid- und Multicloudressourcen. Es inventarisiert Assets, bewertet Konfigurationen, priorisiert Empfehlungen und ordnet Findings unterstützten Standards zu. Regulatory Compliance basiert auf zugewiesenen Azure-Policy-Initiatives und scopespezifischer Bewertung.",
        "architecture": "Defender for Cloud ist eine zentrale Security-Governance-Sicht, aber keine automatische Risikobehebung. Scope-Onboarding, Pläne, Policy Assignments, Exemptions, Datenquellen, Kosten und Alert-Ownership müssen bewusst betrieben werden. Governance-Teams definieren Standards; Workload- und Security-Teams beheben Findings nach Risiko."
      }
    },
    "azure-0947": {
      "id": "azure-0947",
      "title": "Managed Identity",
      "parent": "azure-0946",
      "category": "Identity",
      "description": {
        "simple": "Eine Managed Identity gibt einem Azure-Dienst eine automatisch verwaltete Identität in Entra ID. Anwendungen können damit auf andere Dienste zugreifen, ohne Passwörter oder Client Secrets im Code zu speichern.",
        "technical": "System-assigned Managed Identities sind an den Lebenszyklus einer Azure-Ressource gebunden; user-assigned Identitäten sind eigenständige Ressourcen und können mehreren Workloads zugeordnet werden. Intern werden spezielle Service Principals verwendet. Der Workload fordert ein Access Token an und benötigt anschließend die passende Zielberechtigung, beispielsweise eine Azure-RBAC-Rolle.",
        "architecture": "Managed Identity ist für Azure-Workloads meist statischen Credentials vorzuziehen. Die Wahl system- oder user-assigned beeinflusst Lebenszyklus, Wiederverwendung und Berechtigungsverwaltung. Identität ersetzt keine Autorisierung: Zielrollen, Netzwerkzugriff und Secret-freie Anwendungskonfiguration bleiben separat zu planen."
      }
    },
    "azure-0962": {
      "id": "azure-0962",
      "title": "Azure Policy",
      "parent": "azure-0961",
      "category": "Governance",
      "description": {
        "simple": "Azure Policy bewertet Azure-Ressourcen gegen organisatorische Regeln und kann unerwünschte Konfigurationen melden, blockieren oder korrigieren. Der Dienst wird verwendet, um Standards und Compliance über viele Scopes konsistent umzusetzen.",
        "technical": "Policy Definitions beschreiben Bedingungen und Effects; Policy Assignments binden Definitionen oder Initiatives an Management Groups, Subscriptions, Resource Groups oder Ressourcen. Policy Insights erzeugt Compliance States für anwendbare Ressourcen. Exclusions, Exemptions, Parameter und Enforcement Mode steuern die konkrete Anwendung.",
        "architecture": "Policy ergänzt RBAC: RBAC entscheidet, wer Managementaktionen ausführen darf, Policy bewertet, was als Ressourcenzustand zulässig ist. Breite Assignments benötigen gestufte Einführung, versionierten Policy-as-Code-Workflow und klare Exemption-Governance. Nicht jeder Security- oder Anwendungskontrollpunkt ist über Resource-Manager-Eigenschaften prüfbar."
      }
    },
    "azure-0964": {
      "id": "azure-0964",
      "title": "Azure Role-Based Access Control (Azure RBAC)",
      "parent": "azure-0961",
      "category": "Identity",
      "description": {
        "simple": "Azure RBAC steuert, wer Azure-Ressourcen ansehen oder verändern darf. Zugriffe werden über Rollen an einem bestimmten Geltungsbereich vergeben.",
        "technical": "Azure RBAC ist das Autorisierungssystem für Azure Resource Manager. Ein Role Assignment verbindet Security Principal, Role Definition und Scope; Scopes reichen von Management Group über Subscription und Resource Group bis zur einzelnen Ressource. Vererbte und direkte Zuweisungen ergeben die effektiven Berechtigungen.",
        "architecture": "RBAC-Design beginnt mit Aufgaben und Verantwortlichkeiten, nicht mit Personen. Gruppen, Managed Identities, minimale Scopes, Built-in Roles und PIM reduzieren Zuweisungswachstum und stehende Privilegien. Azure RBAC ist von Microsoft Entra Directory Roles zu unterscheiden."
      }
    },
    "azure-0966": {
      "id": "azure-0966",
      "title": "Least Privilege",
      "parent": "azure-0965",
      "category": "Identity",
      "description": {
        "simple": "Least Privilege bedeutet, nur die Berechtigungen zu vergeben, die für eine Aufgabe wirklich nötig sind. Rechte sollen außerdem nur so lange und so weit gelten wie erforderlich.",
        "technical": "Das Prinzip wird in Azure durch passende Role Definitions, kleinstmögliche Scopes, Gruppen- oder Workload-Zuweisungen, PIM und regelmäßige Reviews umgesetzt. Effektive Berechtigungen umfassen direkte, geerbte und gruppenbasierte Zuweisungen und müssen gemeinsam betrachtet werden.",
        "architecture": "Least Privilege ist ein kontinuierlicher Governanceprozess, keine einmalige Rollenauswahl. Telemetrie, Aufgabentrennung, Access Reviews, Just-in-Time-Aktivierung und kontrollierte Ausnahmeprozesse reduzieren Privilege Creep, ohne den Betrieb zu blockieren."
      }
    },
    "azure-0968": {
      "id": "azure-0968",
      "title": "Azure-RBAC-Scope",
      "parent": "azure-0964",
      "category": "Governance",
      "description": {
        "simple": "Der Scope bestimmt, für welchen Teil von Azure eine Rollenzuweisung gilt. Er kann eine Management Group, Subscription, Resource Group oder einzelne Ressource sein.",
        "technical": "Scopes sind hierarchisch und Berechtigungen werden von Eltern an Kinder vererbt. Eine Zuweisung auf Subscription-Ebene wirkt daher grundsätzlich auch auf untergeordnete Resource Groups und Ressourcen. Mehrere Zuweisungen können sich zu effektiven Berechtigungen addieren.",
        "architecture": "Der kleinste praktikable Scope reduziert Blast Radius, darf aber nicht tausende Einzelzuweisungen erzeugen. Plattformrollen gehören häufig auf höhere, Workloadrollen auf engere Scopes; Management Groups unterstützen konsistente Enterprise-Strukturen."
      }
    },
    "azure-0979": {
      "id": "azure-0979",
      "title": "Monitoring, Observability und Operations in Azure",
      "parent": "azure-0815",
      "category": "Monitoring",
      "description": {
        "simple": "Dieser Wissensbereich zeigt, wie Azure-Systeme erkannt, gemessen, analysiert und betrieben werden. Monitoring prüft bekannte Zustände, Observability hilft auch unbekannte Ursachen aus Telemetrie abzuleiten. Operations verbindet Erkenntnisse mit Verantwortung, Reaktion und Verbesserung.",
        "technical": "Azure Monitor vereint Metriken, Logs, Traces und Events; Log Analytics, Application Insights, Alerts und Workbooks analysieren oder visualisieren sie. Advisor, Service Health und Resource Health ergänzen Optimierungs- und Plattformsignale. Die Signale besitzen unterschiedliche Aktualität, Granularität und Zuständigkeit.",
        "architecture": "Eine Observability-Architektur beginnt bei kritischen Flows und Health-Modellen und definiert dann Instrumentierung, Sammlung, Korrelation, Aufbewahrung und Reaktion. Mehr Daten verbessern nicht automatisch Diagnose und erhöhen Kosten sowie Datenschutzrisiken. Zentraler Plattformbetrieb und workloadnahe Interpretation müssen zusammenarbeiten."
      }
    },
    "azure-0983": {
      "id": "azure-0983",
      "title": "Azure Monitor",
      "parent": "azure-0979",
      "category": "Monitoring",
      "description": {
        "simple": "Azure Monitor ist der zentrale Azure-Dienst für Telemetrie und Observability. Er sammelt und verarbeitet Metriken, Logs, Traces und Events aus Anwendungen, Azure-Ressourcen und hybriden Umgebungen. Analysen, Visualisierungen und Alerts machen daraus Betriebsinformationen.",
        "technical": "Metrics speichert numerische Zeitreihen für schnelle Auswertung; Azure Monitor Logs speichert strukturierte Datensätze in Log Analytics Workspaces und wird mit KQL abgefragt. Application Insights instrumentiert Anwendungen. Diagnostic Settings und Data Collection Rules steuern ausgewählte Datenpfade, wobei Retention, Limits und Kosten je Datentyp variieren.",
        "architecture": "Architekten entscheiden Scope, Workspace-Topologie, Datengrenzen, Aufbewahrung, Zugriffsmodell und Ausfallsicht. Metrics eignen sich für schnelle Erkennung, Logs und Traces für Kontext und Root-Cause-Analyse. Der Kunde verantwortet Instrumentierung, relevante Diagnostic Settings, Alertregeln, Zugriff und Reaktion."
      }
    },
    "azure-0984": {
      "id": "azure-0984",
      "title": "Azure Monitor Alerts",
      "parent": "azure-0983",
      "category": "Monitoring",
      "description": {
        "simple": "Azure Monitor Alerts benachrichtigen oder automatisieren, wenn eine definierte Bedingung erfüllt ist. Ein Alert ist ein technisches Signal, noch kein vollständig bearbeiteter Incident. Gute Alerts sind relevant, eindeutig zugeordnet und handlungsfähig.",
        "technical": "Alert Rules werten Metriken, Logabfragen, Activity Logs oder andere unterstützte Signale aus. Action Groups versenden Benachrichtigungen oder starten Automatisierung. Stateful-Verhalten, Auswertungsfenster, Häufigkeit und Schwellen beeinflussen Verzögerung, Fehlalarme und Kosten.",
        "architecture": "Alerts werden aus SLOs, Health-Zuständen und konkreten Runbooks abgeleitet. Zu empfindliche Regeln erzeugen Alarmmüdigkeit, zu grobe Regeln erkennen Störungen zu spät. Ein Incident beginnt, wenn Menschen oder Automatisierung die Auswirkung koordinieren, priorisieren und beheben."
      }
    },
    "azure-0985": {
      "id": "azure-0985",
      "title": "Log Analytics Workspace",
      "parent": "azure-0984",
      "category": "Monitoring",
      "description": {
        "simple": "Ein Log Analytics Workspace ist der zentrale Datenspeicher für Azure Monitor Logs. Er organisiert Telemetrie in Tabellen und macht sie mit Kusto Query Language analysierbar. Zugriff, Aufbewahrung und Kosten werden am Workspace und an Tabellen gesteuert.",
        "technical": "Daten werden über Diagnostic Settings, Agents, Data Collection Rules, APIs und integrierte Dienste aufgenommen. Tabellen besitzen Schema, Plan und Retention; Abfragen nutzen KQL. Workspace- und Ressourcenkontext sowie Azure RBAC bestimmen, welche Datensätze ein Benutzer lesen darf.",
        "architecture": "Die Workspace-Topologie balanciert zentrale Korrelation gegen Isolation, Datenresidenz, Security-Grenzen und Kostenverantwortung. Ein Workspace pro Ressource verhindert oft sinnvolle Korrelation; ein einziger globaler Workspace kann Zugriff und Governance erschweren. Aufbewahrung folgt Diagnose-, Compliance- und Kostenbedarf."
      }
    },
    "azure-0987": {
      "id": "azure-0987",
      "title": "Application Insights",
      "parent": "azure-0983",
      "category": "Monitoring",
      "description": {
        "simple": "Application Insights überwacht Laufzeit, Leistung und Nutzung von Anwendungen. Es sammelt Requests, Abhängigkeiten, Ausnahmen, Traces und weitere Telemetrie. Dadurch sehen Entwickler Probleme aus Sicht der Anwendung und ihrer Benutzerflüsse.",
        "technical": "Instrumentierung erfolgt über OpenTelemetry, SDKs oder unterstützte automatische Instrumentierung. Telemetrie wird in Azure Monitor verarbeitet und workspacebasiert in Log Analytics gespeichert; Application Map korreliert Komponenten und Abhängigkeiten. Sampling, Instrumentierungsabdeckung und Kardinalität begrenzen Genauigkeit und Kosten.",
        "architecture": "Application Insights eignet sich für Code- und Transaktionsebene, ersetzt aber weder Infrastruktur- noch Service-Health-Monitoring. Architekten definieren kritische Flows, Korrelationskontext und Datenfilterung. Mehr Telemetrie verbessert Diagnose, muss aber gegen Performance, Datenschutz und Ingestionskosten abgewogen werden."
      }
    },
    "azure-0993": {
      "id": "azure-0993",
      "title": "Azure Advisor",
      "parent": "azure-0979",
      "category": "Identity",
      "description": {
        "simple": "Azure Advisor analysiert Azure-Konfigurationen und gibt personalisierte Empfehlungen. Die Hinweise betreffen unter anderem Zuverlässigkeit, Sicherheit, Leistung, Kosten und Operational Excellence. Eine Empfehlung ist eine Entscheidungshilfe, keine automatische Architekturfreigabe.",
        "technical": "Advisor bewertet unterstützte Ressourcen und Konfigurationen gegen Microsoft-Heuristiken und Best Practices. Empfehlungen besitzen Kategorie, Auswirkung und mögliche Maßnahme; Advisor Score zeigt Optimierungsfortschritt. Abdeckung, Aktualität und Kontext unterscheiden sich je Dienst und ersetzen keine workloadbezogene Telemetrie.",
        "architecture": "Advisor eignet sich für proaktive Hygiene und regelmäßige Optimierungszyklen. Empfehlungen werden nach Geschäftsrisiko, Abhängigkeiten, Testbarkeit und Aufwand priorisiert; Ausnahmen benötigen Begründung und Ablaufdatum. Blinde Umsetzung kann Kosten oder Risiko an anderer Stelle erhöhen."
      }
    },
    "azure-0999": {
      "id": "azure-0999",
      "title": "Azure Service Health",
      "parent": "azure-0979",
      "category": "Security",
      "description": {
        "simple": "Azure Service Health informiert personalisiert über Azure-Ereignisse, geplante Wartung und Hinweise, die verwendete Dienste und Regionen betreffen. Resource Health betrachtet dagegen den Zustand einzelner Ressourcen. Beide ergänzen das eigene Workload-Monitoring.",
        "technical": "Service Health liefert abonnements- und regionsbezogene Service Issues, Planned Maintenance und Advisories. Resource Health meldet Zustände wie Available, Degraded, Unavailable oder Unknown für unterstützte Ressourcen. Die Signale stammen aus der Plattform und kennen nicht automatisch die End-to-End-Auswirkung auf den Geschäftsfluss.",
        "architecture": "Plattform-Health ist ein externer Health Signal, keine Root-Cause-Analyse der gesamten Anwendung. Teams korrelieren es mit Application Insights, Ressourcenlogs und synthetischen Tests. Eskalation, Kommunikationsweg und regionale Recovery-Entscheidung werden in Incident-Runbooks festgelegt."
      }
    },
    "azure-1011": {
      "id": "azure-1011",
      "title": "Azure Subscriptions",
      "parent": "azure-1010",
      "category": "Governance",
      "description": {
        "simple": "Eine Azure Subscription ist ein Verwaltungs- und häufig auch Abrechnungsscope für Azure-Ressourcen. Sie enthält Resource Groups und bildet eine zentrale Grenze für Zugriff, Policy, Kosten, Quotas und Verantwortlichkeit.",
        "technical": "Eine Subscription ist einem Microsoft-Entra-Tenant zugeordnet und besitzt eine eindeutige Subscription-ID. Azure RBAC, Azure Policy, Budgets und viele Servicequotas können auf Subscription-Ebene gelten. Management Groups ordnen mehrere Subscriptions in eine übergeordnete Governancehierarchie ein.",
        "architecture": "Subscriptions sind Skalierungs-, Delegations-, Kosten- und Risikogrenzen. Unternehmen trennen häufig Produktion, Nichtproduktion, Plattformen oder regulierte Workloads, wenn unterschiedliche Policies, Owner, Netzwerke oder Abrechnungsanforderungen bestehen. Zu wenige Subscriptions vergrößern Blast Radius; zu viele erhöhen Plattform- und Betriebsaufwand."
      }
    },
    "azure-1016": {
      "id": "azure-1016",
      "title": "Subscriptions Options",
      "parent": "azure-1011",
      "category": "Governance",
      "description": {
        "simple": "",
        "technical": "Subscriptions Options",
        "architecture": ""
      }
    },
    "azure-1022": {
      "id": "azure-1022",
      "title": "Azure Management Groups",
      "parent": "azure-1011",
      "category": "Governance",
      "description": {
        "simple": "Management Groups ordnen mehrere Azure-Subscriptions in einer Hierarchie. Richtlinien und Zugriffszuweisungen an einer Management Group können auf die darunterliegenden Subscriptions vererbt werden.",
        "technical": "Management Groups bilden einen Azure-Resource-Manager-Scope oberhalb von Subscriptions und sind an einen Microsoft-Entra-Tenant gebunden. Jede Subscription hat in der Hierarchie genau einen direkten Management-Group-Elternknoten. Azure Policy und Azure RBAC können auf diesem Scope zugewiesen werden.",
        "architecture": "Die Hierarchie sollte gemeinsame Governanceanforderungen wie Security, Konnektivität, Compliance und Workloadtyp abbilden. Sie sollte stabil bleiben und nicht jede organisatorische Umstrukturierung nachziehen. Root-Zuweisungen sind besonders weitreichend und sollten auf wenige unverzichtbare Kontrollen begrenzt werden."
      }
    },
    "azure-1023": {
      "id": "azure-1023",
      "title": "Ressourcenorganisation mit Management Groups",
      "parent": "azure-1022",
      "category": "Governance",
      "description": {
        "simple": "Management Groups strukturieren Subscriptions nach gemeinsamen Governanceanforderungen. Dadurch können unterschiedliche Workloadtypen passende Regeln erhalten, ohne jedes Konto einzeln zu verwalten.",
        "technical": "Subscriptions werden als Kinder in eine baumförmige Hierarchie eingeordnet und erben unterstützte Policy- und RBAC-Zuweisungen von übergeordneten Management Groups. Verschiebungen verändern den geerbten Governancekontext. Die Hierarchie liegt innerhalb eines Microsoft-Entra-Tenants.",
        "architecture": "Geeignete Trennkriterien sind Plattformfunktion, Internetexposition, regulatorische Anforderungen, Datenresidenz oder Sandboxstatus. Eine direkte Abbildung von Abteilungen führt häufig zu instabiler Struktur und unnötigen Policy-Duplikaten. Änderungen benötigen Impactanalyse, weil geerbte Controls und Zugriffe wechseln können."
      }
    },
    "azure-1034": {
      "id": "azure-1034",
      "title": "Microsoft Cost Management",
      "parent": "azure-1025",
      "category": "Cost & Lifecycle",
      "description": {
        "simple": "Microsoft Cost Management hilft, Cloudkosten zu analysieren, zu überwachen und zu optimieren. Teams können Kosten nach Scopes und Metadaten untersuchen, Budgets setzen und Daten exportieren.",
        "technical": "Cost Management verarbeitet bewertete Kosten- und Nutzungsdaten und stellt Cost Analysis, Budgets, Alerts, Exports, Cost Details API, Anomalieerkennung und Optimierungshinweise bereit. Berechtigungen und verfügbare Funktionen hängen vom Abrechnungs- und Ressourcenscope ab. Tags und Cost Allocation unterstützen feinere Zuordnung.",
        "architecture": "Cost Management ist die Datengrundlage eines FinOps-Prozesses, aber kein autonomer Kostenoptimierer. Eine skalierbare Lösung verbindet Managementhierarchie, Tagging, Zugriff auf Kostendaten, Budgets, Reports und verantwortete Maßnahmen. Shared Costs und zentrale Plattformen benötigen transparente Allokationsregeln."
      }
    },
    "azure-1042": {
      "id": "azure-1042",
      "title": "Service Level Agreements, Objectives und Indicators",
      "parent": "azure-1010",
      "category": "Cost & Lifecycle",
      "description": {
        "simple": "Ein SLA ist eine vertragliche Zusage zwischen Anbieter und Kunde. Ein SLO ist ein internes messbares Ziel, ein SLI der dazu verwendete Messwert. Azure-SLAs ersetzen nicht das End-to-End-Ziel einer eigenen Anwendung.",
        "technical": "SLIs messen beispielsweise Erfolgsrate, Latenz, Verfügbarkeit oder Kapazität in einem definierten Beobachtungsfenster. SLOs setzen Schwellen auf diese Indikatoren; Alerts warnen vor Zielverletzungen. Microsoft-SLAs besitzen konkrete Bedingungen, Messmethoden und Ausschlüsse je Dienst.",
        "architecture": "Architekten leiten Workload-SLOs aus kritischen Geschäftsflüssen ab und berücksichtigen Plattform, Code, Konfiguration, Betrieb und Abhängigkeiten. Ein höheres Ziel erhöht typischerweise Kosten und Komplexität. SLA, SLO und Error Budget benötigen getrennte Ownership zwischen Business, Engineering und Provider."
      }
    }
  },
  "referenced_scenarios": {
    "scenario-cloud-migration": {
      "id": "scenario-cloud-migration",
      "title": "Cloud Migration Architecture",
      "short_description": "Ein kontrollierter Migrationspfad von einer bestehenden On-Premises-Anwendung über Assessment und Landing Zone bis zu Cutover, Validierung und Optimierung.",
      "architecture_goal": "Abhängigkeiten vollständig erfassen, eine sichere Zielplattform vorbereiten, Workloads in getesteten Wellen migrieren und danach Kosten, Reliability und Betriebsmodell verbessern."
    },
    "scenario-enterprise-hub-spoke": {
      "id": "scenario-enterprise-hub-spoke",
      "title": "Enterprise Hub-Spoke Architecture",
      "short_description": "Eine skalierbare Netzwerktopologie, in der ein Hub gemeinsame Konnektivitäts- und Security-Dienste bereitstellt und Spokes Workloads nach Umgebung, Team oder Schutzbedarf isolieren.",
      "architecture_goal": "Zentrale Kontrolle über Hybridkonnektivität, Egress, DNS, Security und Logging schaffen, ohne die technische und organisatorische Isolation der Workloads aufzugeben."
    },
    "scenario-highly-available-application": {
      "id": "scenario-highly-available-application",
      "title": "Highly Available Application Architecture",
      "short_description": "Eine Anwendung, die lokale Komponentenfehler über Zonen toleriert und für schwere Ausfälle einen getrennten Disaster-Recovery-Pfad besitzt.",
      "architecture_goal": "Ein geschäftlich festgelegtes SLO erreichen, RPO und RTO einhalten und Fehler über Health-Signale, Redundanz, Skalierung, Failover und Recovery kontrolliert behandeln."
    },
    "scenario-hybrid-cloud": {
      "id": "scenario-hybrid-cloud",
      "title": "Hybrid Cloud Architecture",
      "short_description": "Ein kontrolliertes Betriebsmodell, in dem ein On-Premises-Rechenzentrum und Azure während Migration oder dauerhaft verbunden bleiben.",
      "architecture_goal": "Netzwerk, DNS, Identität, Security und Monitoring über beide Umgebungen konsistent gestalten, ohne kritische Abhängigkeiten oder Ausfallpfade zu verdecken."
    },
    "scenario-secure-web-application": {
      "id": "scenario-secure-web-application",
      "title": "Secure Web Application Architecture",
      "short_description": "Eine moderne Enterprise-Webanwendung mit kontrolliertem Internet-Einstieg, geschützter Anwendungsschicht, privaten Datenpfaden und durchgängiger Observability.",
      "architecture_goal": "Öffentlichen HTTPS-Zugriff ermöglichen, Angriffsfläche und laterale Bewegung begrenzen, Workload-Identitäten ohne statische Secrets betreiben und den gesamten Benutzerfluss messbar machen."
    }
  }
};
