// Existing canonical IDs, ordered for the six-chapter Demo Learning revision.
window.ADB_NETWORKING_LEARNING_V34 = {
  "id": "networking-verstehen",
  "title": "Networking verstehen",
  "scenario": "Eine Anwendung in Azure wächst von einem internen Workload zu einer vernetzten, erreichbaren und betreibbaren Umgebung.",
  "steps": [
    {
      "id": "network-space",
      "title": "Netzwerkraum schaffen",
      "question": "Wie können unsere Ressourcen miteinander kommunizieren?",
      "problem": "Unsere Anwendung soll eine weitere Ressource erreichen. Beide müssen miteinander kommunizieren.",
      "why": "Sie brauchen einen gemeinsamen, begrenzten Netzwerkraum. Unterschiedliche Aufgaben sollen darin eigene Bereiche erhalten.",
      "solution": "Ein Virtual Network (VNet) bildet diesen Raum. Subnets teilen ihn in Bereiche; die Anwendung liegt in einem davon.",
      "mapFocus": "Vom Kommunikationsbedarf zum Netzwerkraum",
      "focus": [
        "vnet",
        "subnet-app",
        "subnet-other",
        "app",
        "other-workload"
      ],
      "focusEdges": [
        "app-other"
      ]
    },
    {
      "id": "traffic-routing",
      "title": "Kommunikation und Wege steuern",
      "question": "Wer darf kommunizieren und welchen Weg nimmt der Verkehr?",
      "problem": "Unsere Anwendung und andere Ressourcen liegen nun in Subnets. Vernetzung allein legt aber noch nicht fest, welcher Verkehr erlaubt ist.",
      "why": "Bei mehreren möglichen Wegen muss außerdem entschieden werden, wohin bestimmter Verkehr geleitet wird.",
      "solution": "Darf die Verbindung stattfinden? Das prüft eine Network Security Group (NSG). Eine Route Table mit User Defined Routes (UDR), also eigenen Routen, bestimmt den Weg. Ein Network Address Translation Gateway (NAT Gateway) stellt optional den Internet-Ausgang bereit; Azure Firewall prüft zentral Netzwerkregeln.",
      "mapFocus": "Wer darf kommunizieren? Welchen Weg nimmt der Verkehr?",
      "focus": [
        "nsg",
        "udr"
      ],
      "focusEdges": [],
      "hints": [
        {
          "text": "prüft: erlaubt?",
          "x": 303,
          "y": 401,
          "w": 145,
          "tone": "focus"
        },
        {
          "text": "entscheidet: wohin?",
          "x": 540,
          "y": 401,
          "w": 170,
          "tone": "focus"
        }
      ]
    },
    {
      "id": "dns",
      "title": "Namen statt IP-Adressen",
      "question": "Wie wird aus einem Namen die passende Zieladresse?",
      "problem": "Bisher könnten Ressourcen Ziele über IP-Adressen erreichen. Menschen und Anwendungen sollen diese Adressen aber nicht ständig kennen und pflegen müssen.",
      "why": "Ein Name muss zuverlässig zur passenden Adresse aufgelöst werden. Erst dann findet die Anwendung ihr Ziel.",
      "solution": "Das Domain Name System (DNS) löst Namen in Internet-Protocol-Adressen (IP-Adressen) auf. Erst danach verbindet sich die Anwendung mit dem Ziel. Azure DNS hostet DNS-Zonen; Private DNS verwaltet private Namen für verknüpfte Netze.",
      "mapFocus": "Name anfragen → Adresse erhalten → Ziel erreichen",
      "focus": [
        "app",
        "dns",
        "other-workload"
      ],
      "focusEdges": [
        "app-dns",
        "app-other"
      ],
      "hints": [
        {
          "text": "1 · Name anfragen",
          "x": 425,
          "y": 181,
          "w": 150,
          "tone": "focus"
        },
        {
          "text": "2 · Anwendung erhält Adresse",
          "x": 755,
          "y": 91,
          "w": 195,
          "tone": "focus"
        },
        {
          "text": "3 · Ziel erreichen",
          "x": 450,
          "y": 326,
          "w": 145,
          "tone": "traffic"
        }
      ]
    },
    {
      "id": "private-connectivity",
      "title": "Daten privat anbinden",
      "question": "Wie erreicht unsere Anwendung einen Azure-Datendienst privat?",
      "problem": "Die Anwendung benötigt nun Azure SQL Database. Wir möchten den Dienst nutzen, ohne den Zugriff unnötig über einen öffentlichen Endpunkt zu führen.",
      "why": "Der Netzwerkpfad und der verwendete Dienstname müssen zum privaten Ziel passen. Sonst erreicht die Anwendung möglicherweise nicht den gewünschten Endpunkt.",
      "solution": "Ein Private Endpoint kann Azure SQL über Private Link privat erreichbar machen. Der Dienstname muss zum privaten Ziel führen; Private DNS ist dafür ein häufiger, aber nicht der einzige Weg.",
      "mapFocus": "Anwendung → privater Zugang → Datenbank",
      "focus": [
        "app",
        "private-endpoint",
        "sql",
        "private-dns"
      ],
      "focusEdges": [
        "app-private",
        "private-sql",
        "private-dns-private"
      ],
      "hints": [
        {
          "text": "Dienstname → Private DNS → private Adresse",
          "x": 750,
          "y": 78,
          "w": 230,
          "tone": "resolution"
        },
        {
          "text": "Namensauflösung",
          "x": 795,
          "y": 183,
          "w": 155,
          "tone": "resolution"
        },
        {
          "text": "Datenverkehr",
          "x": 448,
          "y": 340,
          "w": 95,
          "tone": "traffic"
        }
      ]
    },
    {
      "id": "connect-networks",
      "title": "Weitere Netze verbinden",
      "question": "Was ändert sich mit einem zweiten VNet oder einem Rechenzentrum?",
      "problem": "Unser Azure-VNet steht nicht mehr allein: Ein zweites VNet und möglicherweise lokale Infrastruktur müssen mit der Anwendung kommunizieren.",
      "why": "Diese Verbindungen brauchen einen passenden Weg. Die Wahl hängt davon ab, welche Netze verbunden werden und welche Anforderungen an die Verbindung gelten.",
      "solution": "Azure-VNets lassen sich per Peering verbinden. Zwischen lokalem Netz und Azure zeigen wir einen verschlüsselten Standort-Tunnel: Site-to-Site Virtual Private Network (VPN). Als Alternative erläutern wir ExpressRoute samt eigenem Gateway. Namen zwischen beiden Seiten löst ein passend eingerichteter DNS Private Resolver auf.",
      "mapFocus": "Zweites VNet oder On-Premises: zwei Verbindungsaufgaben",
      "focus": [
        "vnet-2",
        "peering",
        "onprem",
        "vpn"
      ],
      "focusEdges": [
        "vnet2-peering",
        "peering-vnet",
        "onprem-vpn",
        "vpn-vnet"
      ]
    },
    {
      "id": "traffic-distribution",
      "title": "Benutzer zur Anwendung führen",
      "question": "Wie gelangen Benutzer zur richtigen Anwendung?",
      "problem": "Intern funktioniert die Anwendung. Jetzt sollen Benutzer über das Internet auf sie zugreifen.",
      "why": "Je nach Protokoll, regionalem oder globalem Zugriff und Zahl der Instanzen entstehen unterschiedliche Verteilungsaufgaben.",
      "solution": "Für unsere regionale Webanwendung zeigen wir Application Gateway mit Web Application Firewall (WAF). Für mehrere Instanzen, weltweite Webzugriffe oder reine DNS-Zielauswahl sind andere Rollen nötig. Die aufklappbaren Abläufe zeigen die Unterschiede.",
      "mapFocus": "Benutzer → Application Gateway → Anwendung",
      "focus": [
        "users",
        "app-gateway",
        "app"
      ],
      "focusEdges": [
        "users-gateway",
        "gateway-app"
      ]
    },
    {
      "id": "monitoring",
      "title": "Wissen, was gerade passiert",
      "question": "Wie sehen wir, ob unsere Anwendung und ihr Netzwerk funktionieren?",
      "problem": "Das System ist vernetzt. Ein langsamer Aufruf oder Fehler fällt aber nicht allein durch ein fertiges Architekturbild auf.",
      "why": "Unser Team braucht Beobachtungsdaten, verständliche Zusammenhänge und einen Hinweis, wenn eine Bedingung erfüllt ist.",
      "solution": "Azure Monitor sammelt passende Beobachtungsdaten. Metrics zeigen Messwerte, Logs Ereignisse. Application Insights macht die Anwendungssicht verständlich. Alerts informieren das Team anhand definierter Bedingungen.",
      "mapFocus": "Neu: beobachten → verstehen → reagieren",
      "focus": [],
      "focusEdges": [],
      "showContext": true,
      "conceptIds": [
        "azure-0983",
        "azure-1074",
        "azure-0986",
        "azure-0987",
        "azure-0984"
      ]
    },
    {
      "id": "recovery",
      "title": "Was passiert bei einem Ausfall?",
      "question": "Wie bleiben wir arbeitsfähig oder nehmen den Betrieb wieder auf?",
      "problem": "Auch eine überwachte Anwendung kann ausfallen oder Daten verlieren.",
      "why": "Weiterbetrieb bei Teilausfällen und Wiederanlauf nach größeren Störungen brauchen unterschiedliche Vorbereitungen und klare Ziele.",
      "solution": "Zuverlässigkeit und Widerstandsfähigkeit verbinden Weiterbetrieb, Datensicherung und geplanten Wiederanlauf. Wir klären zuerst tolerierbare Ausfallzeit und Datenverlust und unterscheiden anschließend Messwert, internes Ziel und vertragliche Zusage.",
      "mapFocus": "Neu: Ausfälle verkraften und Wiederanlauf planen",
      "focus": [],
      "focusEdges": [],
      "showContext": true,
      "conceptIds": [
        "azure-0070",
        "azure-0003",
        "azure-1076",
        "azure-0116",
        "azure-0114",
        "azure-1042"
      ]
    },
    {
      "id": "whole-system",
      "title": "Die vernetzte Umgebung als Gesamtsystem",
      "question": "Wie greifen alle Teile unserer Beispielumgebung ineinander?",
      "problem": "Unsere Anwendung ist inzwischen intern vernetzt, nutzt einen Datendienst, kann weitere Standorte anbinden und ist für Benutzer erreichbar.",
      "why": "Erst im Gesamtbild wird erkennbar, welche Teile die Grundstruktur bilden und welche erst durch eine konkrete Anforderung hinzukommen.",
      "solution": "Unsere bekannte Umgebung verbindet Benutzer, Anwendung, private Daten und weitere Netze. Azure Monitor beobachtet sie; Reliability und Resilience beschreiben den Umgang mit Ausfällen. Mehrere Schutzschichten ergänzen einander. Nichts ist hier als neuer Fokus hervorgehoben.",
      "mapFocus": "Alle Teile unserer Beispielumgebung",
      "focus": [],
      "focusEdges": [],
      "showContext": true,
      "overview": true,
      "contextFocus": [],
      "conceptIds": [
        "azure-0817",
        "azure-0983",
        "azure-0070"
      ]
    }
  ],
  "visual_nodes": [
    {
      "key": "vnet",
      "id": "azure-0442",
      "short": "VNet",
      "x": 235,
      "y": 160,
      "w": 535,
      "h": 310,
      "from": 1,
      "role": "frame"
    },
    {
      "key": "subnet-app",
      "id": "azure-0453",
      "short": "Subnet · Anwendung",
      "x": 265,
      "y": 220,
      "w": 220,
      "h": 205,
      "from": 1,
      "role": "subnet"
    },
    {
      "key": "subnet-other",
      "id": "azure-0453",
      "short": "Subnet · weitere Aufgaben",
      "x": 515,
      "y": 220,
      "w": 220,
      "h": 205,
      "from": 1,
      "role": "subnet"
    },
    {
      "key": "app",
      "short": "Anwendung",
      "x": 310,
      "y": 270,
      "w": 130,
      "h": 48,
      "from": 1,
      "role": "context"
    },
    {
      "key": "other-workload",
      "short": "weitere Ressource",
      "x": 560,
      "y": 270,
      "w": 130,
      "h": 48,
      "from": 1,
      "role": "context"
    },
    {
      "key": "nsg",
      "id": "azure-0864",
      "short": "NSG",
      "x": 305,
      "y": 355,
      "w": 140,
      "h": 43,
      "from": 2,
      "role": "entity"
    },
    {
      "key": "udr",
      "id": "azure-0871",
      "short": "Route Table / UDR",
      "x": 545,
      "y": 355,
      "w": 160,
      "h": 43,
      "from": 2,
      "role": "entity"
    },
    {
      "key": "nat",
      "id": "azure-1059",
      "short": "NAT Gateway",
      "x": 585,
      "y": 430,
      "w": 140,
      "h": 38,
      "from": 2,
      "role": "option"
    },
    {
      "key": "dns",
      "id": "azure-0545",
      "short": "Azure DNS",
      "x": 595,
      "y": 82,
      "w": 145,
      "h": 50,
      "from": 3,
      "role": "entity"
    },
    {
      "key": "sql",
      "id": "azure-0731",
      "short": "Azure SQL Database",
      "x": 835,
      "y": 250,
      "w": 145,
      "h": 53,
      "from": 4,
      "role": "entity"
    },
    {
      "key": "private-endpoint",
      "id": "azure-0881",
      "short": "Private Endpoint",
      "x": 690,
      "y": 250,
      "w": 135,
      "h": 53,
      "from": 4,
      "role": "option"
    },
    {
      "key": "private-dns",
      "id": "azure-0558",
      "short": "Private DNS",
      "x": 810,
      "y": 135,
      "w": 155,
      "h": 43,
      "from": 4,
      "role": "option"
    },
    {
      "key": "vnet-2",
      "short": "zweites Azure-VNet",
      "x": 15,
      "y": 225,
      "w": 135,
      "h": 68,
      "from": 5,
      "role": "context"
    },
    {
      "key": "peering",
      "id": "azure-0887",
      "short": "VNet Peering",
      "x": 155,
      "y": 245,
      "w": 90,
      "h": 44,
      "from": 5,
      "role": "option"
    },
    {
      "key": "onprem",
      "short": "On-Premises",
      "x": 15,
      "y": 440,
      "w": 135,
      "h": 60,
      "from": 5,
      "role": "context"
    },
    {
      "key": "vpn",
      "id": "azure-0462",
      "short": "VPN Gateway",
      "x": 155,
      "y": 445,
      "w": 115,
      "h": 45,
      "from": 5,
      "role": "option"
    },
    {
      "key": "users",
      "short": "Benutzer / Internet",
      "x": 395,
      "y": 12,
      "w": 175,
      "h": 50,
      "from": 6,
      "role": "context"
    },
    {
      "key": "app-gateway",
      "id": "azure-0519",
      "short": "Application Gateway · eigenes Subnet",
      "x": 390,
      "y": 173,
      "w": 185,
      "h": 43,
      "from": 6,
      "role": "option"
    }
  ],
  "visual_edges": [
    {
      "key": "app-other",
      "from": "app",
      "to": "other-workload",
      "fromStep": 1,
      "kind": "didactic",
      "points": [
        [
          440,
          294
        ],
        [
          560,
          294
        ]
      ]
    },
    {
      "key": "app-dns",
      "from": "app",
      "to": "dns",
      "fromStep": 3,
      "kind": "didactic",
      "purpose": "resolution",
      "points": [
        [
          430,
          270
        ],
        [
          430,
          255
        ],
        [
          585,
          255
        ],
        [
          585,
          107
        ],
        [
          595,
          107
        ]
      ]
    },
    {
      "key": "app-private",
      "from": "app",
      "to": "private-endpoint",
      "fromStep": 4,
      "kind": "didactic",
      "points": [
        [
          430,
          318
        ],
        [
          430,
          335
        ],
        [
          757,
          335
        ],
        [
          757,
          303
        ]
      ]
    },
    {
      "key": "private-sql",
      "from": "private-endpoint",
      "to": "sql",
      "fromStep": 4,
      "kind": "semantic",
      "points": [
        [
          825,
          277
        ],
        [
          835,
          277
        ]
      ]
    },
    {
      "key": "private-dns-private",
      "from": "private-dns",
      "to": "private-endpoint",
      "fromStep": 4,
      "kind": "didactic",
      "purpose": "resolution",
      "points": [
        [
          885,
          178
        ],
        [
          885,
          215
        ],
        [
          757,
          215
        ],
        [
          757,
          250
        ]
      ]
    },
    {
      "key": "vnet2-peering",
      "from": "vnet-2",
      "to": "peering",
      "fromStep": 5,
      "kind": "didactic",
      "points": [
        [
          150,
          266
        ],
        [
          155,
          266
        ]
      ]
    },
    {
      "key": "peering-vnet",
      "from": "peering",
      "to": "vnet",
      "fromStep": 5,
      "kind": "semantic",
      "points": [
        [
          245,
          267
        ],
        [
          265,
          267
        ]
      ]
    },
    {
      "key": "onprem-vpn",
      "from": "onprem",
      "to": "vpn",
      "fromStep": 5,
      "kind": "didactic",
      "points": [
        [
          150,
          465
        ],
        [
          155,
          465
        ]
      ]
    },
    {
      "key": "vpn-vnet",
      "from": "vpn",
      "to": "vnet",
      "fromStep": 5,
      "kind": "semantic",
      "points": [
        [
          270,
          468
        ],
        [
          285,
          468
        ],
        [
          285,
          425
        ]
      ]
    },
    {
      "key": "users-gateway",
      "from": "users",
      "to": "app-gateway",
      "fromStep": 6,
      "kind": "didactic",
      "points": [
        [
          482,
          62
        ],
        [
          482,
          173
        ]
      ]
    },
    {
      "key": "gateway-app",
      "from": "app-gateway",
      "to": "app",
      "fromStep": 6,
      "kind": "didactic",
      "points": [
        [
          430,
          216
        ],
        [
          430,
          270
        ]
      ]
    }
  ],
  "context": [
    {
      "id": "azure-0904",
      "need": "Identität",
      "placement": "top"
    },
    {
      "id": "azure-0841",
      "need": "Schutz",
      "placement": "top"
    },
    {
      "id": "azure-0962",
      "need": "Regeln",
      "placement": "top"
    },
    {
      "id": "azure-0322",
      "need": "Workload / Compute",
      "placement": "bottom"
    },
    {
      "id": "azure-0731",
      "need": "Daten",
      "placement": "bottom"
    },
    {
      "id": "azure-0983",
      "need": "Überwachung",
      "placement": "bottom"
    },
    {
      "id": "azure-0070",
      "need": "Ausfallsicherheit",
      "placement": "bottom"
    }
  ],
  "stepAliases": {
    "other-domains": "monitoring"
  }
};
