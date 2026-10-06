window.ADB_CASE01_DATA_V1 = {
  "id": "case-01",
  "version": 1,
  "title": "Unternehmens-Webanwendung nach Azure",
  "provenance": "Alle Ausgangsangaben sind Vorgaben des Demo-Auftrags, keine verifizierten echten Kundendaten. Lokale Änderungen bleiben ausdrücklich simuliert.",
  "canonicalRefs": {
    "app": "azure-0351",
    "containers": "azure-1062",
    "vm": "azure-0322",
    "entra": "azure-0904",
    "gateway": "azure-0519",
    "firewall": "azure-0863",
    "vnet": "azure-0442",
    "endpoint": "azure-0881",
    "dns": "azure-0558",
    "sql": "azure-0731",
    "monitor": "azure-0983",
    "insights": "azure-0987",
    "vpn": "azure-0462",
    "recovery": "azure-1076",
    "cost": "azure-1073",
    "landing": "azure-0054",
    "managedIdentity": "azure-0947",
    "keyVault": "azure-0944",
    "rbac": "azure-0964",
    "migration": "azure-1078"
  },
  "areas": [
    {
      "id": "compute",
      "label": "Compute / Plattform",
      "decisionQuestion": "Welche Plattform eignet sich für die Webanwendung?",
      "brainKey": "app"
    },
    {
      "id": "database",
      "label": "Datenbank",
      "decisionQuestion": "Welche Datenbank-Zielplattform und Zugriffsarchitektur sind geeignet?",
      "brainKey": "sql"
    },
    {
      "id": "network",
      "label": "Netzwerk / On-Prem-Verbindung",
      "decisionQuestion": "Wie verbinden wir Anwendung, Datenbank und das eigene Rechenzentrum?",
      "brainKey": "vnet"
    },
    {
      "id": "identity",
      "label": "Identität & Zugriff",
      "decisionQuestion": "Wie greifen Mitarbeiter, Partner und Anwendungen sicher zu?",
      "brainKey": "entra"
    },
    {
      "id": "recovery",
      "label": "Resilienz / Recovery",
      "decisionQuestion": "Wie stellen wir die Anwendung und ihre Daten nach einem Ausfall wieder her?",
      "brainKey": "recovery"
    },
    {
      "id": "privacy",
      "label": "Datenschutz / Fachprüfung",
      "decisionQuestion": "Welche technischen Anforderungen ergeben sich aus der zuständigen Fachprüfung?",
      "brainKey": "entra"
    },
    {
      "id": "operations",
      "label": "Betrieb & Kosten",
      "decisionQuestion": "Wie betreiben wir die Lösung innerhalb des Kostenrahmens?",
      "brainKey": "cost"
    }
  ],
  "questions": [
    {
      "id": "app-baseline",
      "areaId": "compute",
      "prompt": "Welche Anwendung betreiben wir heute?",
      "canonicalIds": [
        "azure-0351"
      ],
      "criterionId": "criterion-app-baseline",
      "impact": "blocking",
      "requiredForEvaluation": true,
      "kind": "text",
      "why": "Die Plattform muss zur bestehenden Anwendung passen. Ein Betriebsziel allein beweist die Kompatibilität nicht.",
      "initialAnswer": {
        "type": "fact",
        "value": ".NET-Webanwendung auf Windows / IIS",
        "origin": "demo_spec",
        "evidence": "Vorgabe im Demo-Auftrag",
        "reviewer": "",
        "verdict": "unknown"
      }
    },
    {
      "id": "user-count",
      "areaId": "compute",
      "prompt": "Wie viele Menschen nutzen die Anwendung?",
      "canonicalIds": [
        "azure-0351"
      ],
      "criterionId": "criterion-user-count",
      "impact": "non_blocking",
      "requiredForEvaluation": false,
      "kind": "text",
      "why": "Die Plattform muss zur bestehenden Anwendung passen. Ein Betriebsziel allein beweist die Kompatibilität nicht.",
      "initialAnswer": {
        "type": "fact",
        "value": "Ca. 450 Mitarbeiter und ca. 50 externe Partner",
        "origin": "demo_spec",
        "evidence": "Vorgabe im Demo-Auftrag",
        "reviewer": "",
        "verdict": "unknown"
      }
    },
    {
      "id": "dotnet-version",
      "areaId": "compute",
      "prompt": "Welche konkrete .NET-Version wird verwendet?",
      "canonicalIds": [
        "azure-0351"
      ],
      "criterionId": "criterion-dotnet-version",
      "impact": "blocking",
      "requiredForEvaluation": false,
      "kind": "text",
      "why": "Die konkrete Version bestimmt, welche Laufzeit geprüft werden muss. Ohne Versionsangabe bleibt die Eignungsbewertung offen.",
      "initialAnswer": {
        "type": "open_question",
        "value": "",
        "origin": "unanswered",
        "evidence": "",
        "reviewer": "",
        "verdict": "unknown"
      }
    },
    {
      "id": "dotnet-family",
      "areaId": "compute",
      "prompt": "Handelt es sich um .NET Framework oder modernes .NET?",
      "canonicalIds": [
        "azure-0351"
      ],
      "criterionId": "criterion-dotnet-family",
      "impact": "blocking",
      "requiredForEvaluation": false,
      "kind": "text",
      "why": "Die ältere .NET-Framework-Familie und modernes .NET haben unterschiedliche Laufzeitbedingungen. Die verwendete Familie ist noch nicht dokumentiert.",
      "initialAnswer": {
        "type": "open_question",
        "value": "",
        "origin": "unanswered",
        "evidence": "",
        "reviewer": "",
        "verdict": "unknown"
      }
    },
    {
      "id": "iis-dependencies",
      "areaId": "compute",
      "prompt": "Welche Funktionen des heutigen IIS-Webservers benötigt die Anwendung?",
      "canonicalIds": [
        "azure-0351"
      ],
      "criterionId": "criterion-iis-dependencies",
      "impact": "blocking",
      "requiredForEvaluation": false,
      "kind": "text",
      "why": "IIS ist der heutige Windows-Webserver. Benötigte Module und Einstellungen müssen im Ziel berücksichtigt werden.",
      "initialAnswer": {
        "type": "open_question",
        "value": "",
        "origin": "unanswered",
        "evidence": "",
        "reviewer": "",
        "verdict": "unknown"
      }
    },
    {
      "id": "native-apis",
      "areaId": "compute",
      "prompt": "Welche Windows-APIs oder nativen Bibliotheken benötigt die Anwendung?",
      "canonicalIds": [
        "azure-0351"
      ],
      "criterionId": "criterion-native-apis",
      "impact": "blocking",
      "requiredForEvaluation": false,
      "kind": "text",
      "why": "APIs sind Programmierschnittstellen. Native Bibliotheken sind an ein Betriebssystem gebundene Programmteile; ihre Anforderungen können die Plattformwahl beeinflussen.",
      "initialAnswer": {
        "type": "open_question",
        "value": "",
        "origin": "unanswered",
        "evidence": "",
        "reviewer": "",
        "verdict": "unknown"
      }
    },
    {
      "id": "com-registry-gdi",
      "areaId": "compute",
      "prompt": "Werden COM, Registry, GDI oder vergleichbare Windows-Funktionen verwendet?",
      "canonicalIds": [
        "azure-0351"
      ],
      "criterionId": "criterion-com-registry-gdi",
      "impact": "blocking",
      "requiredForEvaluation": false,
      "kind": "text",
      "why": "COM (Component Object Model) verbindet Windows-Komponenten; die Registry enthält Systemeinstellungen; GDI (Graphics Device Interface) stellt Grafikfunktionen bereit. Solche Abhängigkeiten müssen konkret auf Eignung geprüft werden.",
      "initialAnswer": {
        "type": "open_question",
        "value": "",
        "origin": "unanswered",
        "evidence": "",
        "reviewer": "",
        "verdict": "unknown"
      }
    },
    {
      "id": "local-files",
      "areaId": "compute",
      "prompt": "Welche lokalen Dateien müssen gelesen, geschrieben oder dauerhaft gespeichert werden?",
      "canonicalIds": [
        "azure-0351"
      ],
      "criterionId": "criterion-local-files",
      "impact": "blocking",
      "requiredForEvaluation": false,
      "kind": "text",
      "why": "Lokale Dateien können für Speicherung, Austausch oder Verarbeitung notwendig sein. Ein Plattformwechsel braucht dafür ein geprüftes Konzept.",
      "initialAnswer": {
        "type": "open_question",
        "value": "",
        "origin": "unanswered",
        "evidence": "",
        "reviewer": "",
        "verdict": "unknown"
      }
    },
    {
      "id": "session-state",
      "areaId": "compute",
      "prompt": "Wo wird der Zustand angemeldeter Benutzer zwischen Anfragen gespeichert?",
      "canonicalIds": [
        "azure-0351"
      ],
      "criterionId": "criterion-session-state",
      "impact": "blocking",
      "requiredForEvaluation": false,
      "kind": "text",
      "why": "Sitzungszustand sind Informationen zwischen Benutzeranfragen. Speicherung und Verhalten bei Neustart oder mehreren Instanzen müssen bekannt sein.",
      "initialAnswer": {
        "type": "open_question",
        "value": "",
        "origin": "unanswered",
        "evidence": "",
        "reviewer": "",
        "verdict": "unknown"
      }
    },
    {
      "id": "background-jobs",
      "areaId": "compute",
      "prompt": "Welche Hintergrundjobs oder geplanten Aufgaben müssen laufen?",
      "canonicalIds": [
        "azure-0351"
      ],
      "criterionId": "criterion-background-jobs",
      "impact": "blocking",
      "requiredForEvaluation": false,
      "kind": "text",
      "why": "Arbeiten außerhalb einer Webanfrage brauchen ein geeignetes Ausführungs- und Betriebskonzept. Wir nehmen hier keine nicht genannten Jobs an.",
      "initialAnswer": {
        "type": "open_question",
        "value": "",
        "origin": "unanswered",
        "evidence": "",
        "reviewer": "",
        "verdict": "unknown"
      }
    },
    {
      "id": "deployment",
      "areaId": "compute",
      "prompt": "Wie wird die Anwendung heute und künftig bereitgestellt?",
      "canonicalIds": [
        "azure-0351"
      ],
      "criterionId": "criterion-deployment",
      "impact": "blocking",
      "requiredForEvaluation": false,
      "kind": "text",
      "why": "Bereitstellung bezeichnet den Weg vom neuen Programmstand zur laufenden Anwendung. Rechte, Verfahren und Rückfall müssen zum Betrieb passen.",
      "initialAnswer": {
        "type": "open_question",
        "value": "",
        "origin": "unanswered",
        "evidence": "",
        "reviewer": "",
        "verdict": "unknown"
      }
    },
    {
      "id": "containerized",
      "areaId": "compute",
      "prompt": "Ist die Anwendung bereits containerisiert?",
      "canonicalIds": [
        "azure-0351"
      ],
      "criterionId": "criterion-containerized",
      "impact": "blocking",
      "requiredForEvaluation": false,
      "kind": "text",
      "why": "Container bündeln eine Anwendung mit ihrer Laufzeitumgebung. Ob dieser Weg für die bestehende Anwendung bereits vorbereitet ist, bleibt offen.",
      "initialAnswer": {
        "type": "open_question",
        "value": "",
        "origin": "unanswered",
        "evidence": "",
        "reviewer": "",
        "verdict": "unknown"
      }
    },
    {
      "id": "runtime-requirements",
      "areaId": "compute",
      "prompt": "Welche besonderen Laufzeit- oder Betriebssystemanforderungen bestehen?",
      "canonicalIds": [
        "azure-0351"
      ],
      "criterionId": "criterion-runtime-requirements",
      "impact": "blocking",
      "requiredForEvaluation": false,
      "kind": "text",
      "why": "Besondere Laufzeit- oder Betriebssystemanforderungen können die Plattformeignung begrenzen. Keine Anforderungen angegeben bedeutet noch nicht, dass keine existieren.",
      "initialAnswer": {
        "type": "open_question",
        "value": "",
        "origin": "unanswered",
        "evidence": "",
        "reviewer": "",
        "verdict": "unknown"
      }
    },
    {
      "id": "app-fit",
      "areaId": "compute",
      "prompt": "Welche dokumentierte Kompatibilitätsbewertung liegt für diese Plattform vor?",
      "canonicalIds": [
        "azure-0351"
      ],
      "criterionId": "criterion-app-fit",
      "impact": "blocking",
      "requiredForEvaluation": false,
      "kind": "assessment",
      "why": "Die Plattform muss zur bestehenden Anwendung passen. Ein Betriebsziel allein beweist die Kompatibilität nicht.",
      "initialAnswer": {
        "type": "open_question",
        "value": "",
        "origin": "unanswered",
        "evidence": "",
        "reviewer": "",
        "verdict": "unknown"
      },
      "optionId": "app"
    },
    {
      "id": "container-fit",
      "areaId": "compute",
      "prompt": "Welche dokumentierte Kompatibilitätsbewertung liegt für diese Plattform vor?",
      "canonicalIds": [
        "azure-1062"
      ],
      "criterionId": "criterion-container-fit",
      "impact": "blocking",
      "requiredForEvaluation": false,
      "kind": "assessment",
      "why": "Die Plattform muss zur bestehenden Anwendung passen. Ein Betriebsziel allein beweist die Kompatibilität nicht.",
      "initialAnswer": {
        "type": "open_question",
        "value": "",
        "origin": "unanswered",
        "evidence": "",
        "reviewer": "",
        "verdict": "unknown"
      },
      "optionId": "containers"
    },
    {
      "id": "vm-fit",
      "areaId": "compute",
      "prompt": "Welche dokumentierte Kompatibilitätsbewertung liegt für diese Plattform vor?",
      "canonicalIds": [
        "azure-0322"
      ],
      "criterionId": "criterion-vm-fit",
      "impact": "blocking",
      "requiredForEvaluation": false,
      "kind": "assessment",
      "why": "Die Plattform muss zur bestehenden Anwendung passen. Ein Betriebsziel allein beweist die Kompatibilität nicht.",
      "initialAnswer": {
        "type": "open_question",
        "value": "",
        "origin": "unanswered",
        "evidence": "",
        "reviewer": "",
        "verdict": "unknown"
      },
      "optionId": "vm"
    },
    {
      "id": "sql-baseline",
      "areaId": "database",
      "prompt": "Welche Datenbank wird heute eingesetzt?",
      "canonicalIds": [
        "azure-0731"
      ],
      "criterionId": "criterion-sql-baseline",
      "impact": "blocking",
      "requiredForEvaluation": true,
      "kind": "text",
      "why": "Die Zielplattform muss Funktionen, Leistung und Wiederherstellung der bestehenden Datenbank abdecken. Der private Zugang beweist die Migrationseignung nicht.",
      "initialAnswer": {
        "type": "fact",
        "value": "SQL Server",
        "origin": "demo_spec",
        "evidence": "Vorgabe im Demo-Auftrag",
        "reviewer": "",
        "verdict": "unknown"
      }
    },
    {
      "id": "sql-version",
      "areaId": "database",
      "prompt": "Welche SQL-Server-Version wird verwendet?",
      "canonicalIds": [
        "azure-0731"
      ],
      "criterionId": "criterion-sql-version",
      "impact": "blocking",
      "requiredForEvaluation": false,
      "kind": "text",
      "why": "Die Zielplattform muss Funktionen, Leistung und Wiederherstellung der bestehenden Datenbank abdecken. Der private Zugang beweist die Migrationseignung nicht.",
      "initialAnswer": {
        "type": "open_question",
        "value": "",
        "origin": "unanswered",
        "evidence": "",
        "reviewer": "",
        "verdict": "unknown"
      }
    },
    {
      "id": "db-size",
      "areaId": "database",
      "prompt": "Wie groß ist die Datenbank und wie schnell wächst sie?",
      "canonicalIds": [
        "azure-0731"
      ],
      "criterionId": "criterion-db-size",
      "impact": "blocking",
      "requiredForEvaluation": false,
      "kind": "text",
      "why": "Die Zielplattform muss Funktionen, Leistung und Wiederherstellung der bestehenden Datenbank abdecken. Der private Zugang beweist die Migrationseignung nicht.",
      "initialAnswer": {
        "type": "open_question",
        "value": "",
        "origin": "unanswered",
        "evidence": "",
        "reviewer": "",
        "verdict": "unknown"
      }
    },
    {
      "id": "sql-features",
      "areaId": "database",
      "prompt": "Welche besonderen SQL-Funktionen oder Erweiterungen werden verwendet?",
      "canonicalIds": [
        "azure-0731"
      ],
      "criterionId": "criterion-sql-features",
      "impact": "blocking",
      "requiredForEvaluation": false,
      "kind": "text",
      "why": "Die Zielplattform muss Funktionen, Leistung und Wiederherstellung der bestehenden Datenbank abdecken. Der private Zugang beweist die Migrationseignung nicht.",
      "initialAnswer": {
        "type": "open_question",
        "value": "",
        "origin": "unanswered",
        "evidence": "",
        "reviewer": "",
        "verdict": "unknown"
      }
    },
    {
      "id": "sql-agent",
      "areaId": "database",
      "prompt": "Welche Aufgaben werden durch SQL Agent ausgeführt?",
      "canonicalIds": [
        "azure-0731"
      ],
      "criterionId": "criterion-sql-agent",
      "impact": "blocking",
      "requiredForEvaluation": false,
      "kind": "text",
      "why": "SQL Agent führt geplante Datenbankaufgaben aus. Vor einem Wechsel müssen vorhandene Jobs und das künftige Ausführungsmodell bekannt sein.",
      "initialAnswer": {
        "type": "open_question",
        "value": "",
        "origin": "unanswered",
        "evidence": "",
        "reviewer": "",
        "verdict": "unknown"
      }
    },
    {
      "id": "sql-clr",
      "areaId": "database",
      "prompt": "Wird SQL CLR verwendet?",
      "canonicalIds": [
        "azure-0731"
      ],
      "criterionId": "criterion-sql-clr",
      "impact": "blocking",
      "requiredForEvaluation": false,
      "kind": "text",
      "why": "CLR bedeutet Common Language Runtime: .NET-Code innerhalb der Datenbank. Ob und wie er genutzt wird, gehört in die Migrationseignungsprüfung.",
      "initialAnswer": {
        "type": "open_question",
        "value": "",
        "origin": "unanswered",
        "evidence": "",
        "reviewer": "",
        "verdict": "unknown"
      }
    },
    {
      "id": "linked-servers",
      "areaId": "database",
      "prompt": "Werden Linked Servers verwendet?",
      "canonicalIds": [
        "azure-0731"
      ],
      "criterionId": "criterion-linked-servers",
      "impact": "blocking",
      "requiredForEvaluation": false,
      "kind": "text",
      "why": "Linked Servers verbinden SQL Server mit anderen Datenquellen. Solche Abhängigkeiten dürfen bei der Migration nicht unbemerkt bleiben.",
      "initialAnswer": {
        "type": "open_question",
        "value": "",
        "origin": "unanswered",
        "evidence": "",
        "reviewer": "",
        "verdict": "unknown"
      }
    },
    {
      "id": "cross-database",
      "areaId": "database",
      "prompt": "Welche Abhängigkeiten zwischen Datenbanken bestehen?",
      "canonicalIds": [
        "azure-0731"
      ],
      "criterionId": "criterion-cross-database",
      "impact": "blocking",
      "requiredForEvaluation": false,
      "kind": "text",
      "why": "Die Zielplattform muss Funktionen, Leistung und Wiederherstellung der bestehenden Datenbank abdecken. Der private Zugang beweist die Migrationseignung nicht.",
      "initialAnswer": {
        "type": "open_question",
        "value": "",
        "origin": "unanswered",
        "evidence": "",
        "reviewer": "",
        "verdict": "unknown"
      }
    },
    {
      "id": "db-performance",
      "areaId": "database",
      "prompt": "Welche Datenbankleistung und Antwortzeiten werden benötigt?",
      "canonicalIds": [
        "azure-0731"
      ],
      "criterionId": "criterion-db-performance",
      "impact": "blocking",
      "requiredForEvaluation": false,
      "kind": "text",
      "why": "Die Zielplattform muss Funktionen, Leistung und Wiederherstellung der bestehenden Datenbank abdecken. Der private Zugang beweist die Migrationseignung nicht.",
      "initialAnswer": {
        "type": "open_question",
        "value": "",
        "origin": "unanswered",
        "evidence": "",
        "reviewer": "",
        "verdict": "unknown"
      }
    },
    {
      "id": "db-maintenance",
      "areaId": "database",
      "prompt": "Welche Wartungsanforderungen bestehen?",
      "canonicalIds": [
        "azure-0731"
      ],
      "criterionId": "criterion-db-maintenance",
      "impact": "blocking",
      "requiredForEvaluation": false,
      "kind": "text",
      "why": "Die Zielplattform muss Funktionen, Leistung und Wiederherstellung der bestehenden Datenbank abdecken. Der private Zugang beweist die Migrationseignung nicht.",
      "initialAnswer": {
        "type": "open_question",
        "value": "",
        "origin": "unanswered",
        "evidence": "",
        "reviewer": "",
        "verdict": "unknown"
      }
    },
    {
      "id": "db-backup",
      "areaId": "database",
      "prompt": "Welche Anforderungen bestehen an Datenbanksicherung und Wiederherstellung?",
      "canonicalIds": [
        "azure-0731"
      ],
      "criterionId": "criterion-db-backup",
      "impact": "blocking",
      "requiredForEvaluation": false,
      "kind": "text",
      "why": "Die Zielplattform muss Funktionen, Leistung und Wiederherstellung der bestehenden Datenbank abdecken. Der private Zugang beweist die Migrationseignung nicht.",
      "initialAnswer": {
        "type": "open_question",
        "value": "",
        "origin": "unanswered",
        "evidence": "",
        "reviewer": "",
        "verdict": "unknown"
      }
    },
    {
      "id": "db-migration",
      "areaId": "database",
      "prompt": "Ist die Migration zur vorgeschlagenen Azure SQL Database geprüft?",
      "canonicalIds": [
        "azure-0731"
      ],
      "criterionId": "criterion-db-migration",
      "impact": "blocking",
      "requiredForEvaluation": false,
      "kind": "assessment",
      "why": "Die Zielplattform muss Funktionen, Leistung und Wiederherstellung der bestehenden Datenbank abdecken. Der private Zugang beweist die Migrationseignung nicht.",
      "initialAnswer": {
        "type": "open_question",
        "value": "",
        "origin": "unanswered",
        "evidence": "",
        "reviewer": "",
        "verdict": "unknown"
      }
    },
    {
      "id": "private-db",
      "areaId": "database",
      "prompt": "Wie darf die Datenbank erreichbar sein?",
      "canonicalIds": [
        "azure-0881"
      ],
      "criterionId": "criterion-private-db",
      "impact": "blocking",
      "requiredForEvaluation": false,
      "kind": "text",
      "why": "Die Zielplattform muss Funktionen, Leistung und Wiederherstellung der bestehenden Datenbank abdecken. Der private Zugang beweist die Migrationseignung nicht.",
      "initialAnswer": {
        "type": "fact",
        "value": "Datenbank nicht direkt öffentlich erreichbar; private Anbindung gewünscht",
        "origin": "demo_spec",
        "evidence": "Vorgabe im Demo-Auftrag",
        "reviewer": "",
        "verdict": "unknown"
      }
    },
    {
      "id": "vpn-present",
      "areaId": "network",
      "prompt": "Besteht eine Verbindung zwischen Azure und dem Rechenzentrum?",
      "canonicalIds": [
        "azure-0462"
      ],
      "criterionId": "criterion-vpn-present",
      "impact": "blocking",
      "requiredForEvaluation": true,
      "kind": "text",
      "why": "Die Anwendung muss Datenbank und ERP sicher erreichen können. Eine vorhandene Standortverbindung beantwortet diese Detailfrage noch nicht.",
      "initialAnswer": {
        "type": "fact",
        "value": "Bestehendes Site-to-Site VPN",
        "origin": "demo_spec",
        "evidence": "Vorgabe im Demo-Auftrag",
        "reviewer": "",
        "verdict": "unknown"
      }
    },
    {
      "id": "erp-stays",
      "areaId": "network",
      "prompt": "Welche Abhängigkeit bleibt im Rechenzentrum?",
      "canonicalIds": [
        "azure-0462"
      ],
      "criterionId": "criterion-erp-stays",
      "impact": "blocking",
      "requiredForEvaluation": false,
      "kind": "text",
      "why": "Die Anwendung muss Datenbank und ERP sicher erreichen können. Eine vorhandene Standortverbindung beantwortet diese Detailfrage noch nicht.",
      "initialAnswer": {
        "type": "fact",
        "value": "ERP bleibt On-Premises; die Anwendung muss es erreichen",
        "origin": "demo_spec",
        "evidence": "Vorgabe im Demo-Auftrag",
        "reviewer": "",
        "verdict": "unknown"
      }
    },
    {
      "id": "vpn-capacity",
      "areaId": "network",
      "prompt": "Reicht die Kapazität der bestehenden Verbindung?",
      "canonicalIds": [
        "azure-0462"
      ],
      "criterionId": "criterion-vpn-capacity",
      "impact": "blocking",
      "requiredForEvaluation": false,
      "kind": "text",
      "why": "Die Anwendung muss Datenbank und ERP sicher erreichen können. Eine vorhandene Standortverbindung beantwortet diese Detailfrage noch nicht.",
      "initialAnswer": {
        "type": "open_question",
        "value": "",
        "origin": "unanswered",
        "evidence": "",
        "reviewer": "",
        "verdict": "unknown"
      }
    },
    {
      "id": "routing",
      "areaId": "network",
      "prompt": "Welche Wege nehmen Verbindungen zu Datenbank und ERP?",
      "canonicalIds": [
        "azure-0442"
      ],
      "criterionId": "criterion-routing",
      "impact": "blocking",
      "requiredForEvaluation": false,
      "kind": "text",
      "why": "Die Anwendung muss Datenbank und ERP sicher erreichen können. Eine vorhandene Standortverbindung beantwortet diese Detailfrage noch nicht.",
      "initialAnswer": {
        "type": "open_question",
        "value": "",
        "origin": "unanswered",
        "evidence": "",
        "reviewer": "",
        "verdict": "unknown"
      }
    },
    {
      "id": "dns",
      "areaId": "network",
      "prompt": "Wie werden private Dienstnamen aufgelöst?",
      "canonicalIds": [
        "azure-0558"
      ],
      "criterionId": "criterion-dns",
      "impact": "blocking",
      "requiredForEvaluation": false,
      "kind": "text",
      "why": "DNS (Domain Name System) ordnet Namen Netzwerkadressen zu. Die private Namensauflösung muss zum geplanten Datenzugriff passen.",
      "initialAnswer": {
        "type": "open_question",
        "value": "",
        "origin": "unanswered",
        "evidence": "",
        "reviewer": "",
        "verdict": "unknown"
      }
    },
    {
      "id": "erp-interface",
      "areaId": "network",
      "prompt": "Welche ERP-Schnittstellen und Netzwerkfreigaben werden benötigt?",
      "canonicalIds": [
        "azure-0462"
      ],
      "criterionId": "criterion-erp-interface",
      "impact": "blocking",
      "requiredForEvaluation": false,
      "kind": "text",
      "why": "Die Anwendung muss Datenbank und ERP sicher erreichen können. Eine vorhandene Standortverbindung beantwortet diese Detailfrage noch nicht.",
      "initialAnswer": {
        "type": "open_question",
        "value": "",
        "origin": "unanswered",
        "evidence": "",
        "reviewer": "",
        "verdict": "unknown"
      }
    },
    {
      "id": "outbound",
      "areaId": "network",
      "prompt": "Welche weiteren ausgehenden Verbindungen benötigt die Anwendung?",
      "canonicalIds": [
        "azure-0442"
      ],
      "criterionId": "criterion-outbound",
      "impact": "blocking",
      "requiredForEvaluation": false,
      "kind": "text",
      "why": "Die Anwendung muss Datenbank und ERP sicher erreichen können. Eine vorhandene Standortverbindung beantwortet diese Detailfrage noch nicht.",
      "initialAnswer": {
        "type": "open_question",
        "value": "",
        "origin": "unanswered",
        "evidence": "",
        "reviewer": "",
        "verdict": "unknown"
      }
    },
    {
      "id": "partner-network",
      "areaId": "network",
      "prompt": "Über welchen Eingang greifen Partner auf die Anwendung zu?",
      "canonicalIds": [
        "azure-0519"
      ],
      "criterionId": "criterion-partner-network",
      "impact": "blocking",
      "requiredForEvaluation": false,
      "kind": "text",
      "why": "Die Anwendung muss Datenbank und ERP sicher erreichen können. Eine vorhandene Standortverbindung beantwortet diese Detailfrage noch nicht.",
      "initialAnswer": {
        "type": "open_question",
        "value": "",
        "origin": "unanswered",
        "evidence": "",
        "reviewer": "",
        "verdict": "unknown"
      }
    },
    {
      "id": "network-boundaries",
      "areaId": "network",
      "prompt": "Welche Netzwerkgrenzen und Zugangsbeschränkungen sind erforderlich?",
      "canonicalIds": [
        "azure-0442"
      ],
      "criterionId": "criterion-network-boundaries",
      "impact": "blocking",
      "requiredForEvaluation": false,
      "kind": "text",
      "why": "Die Anwendung muss Datenbank und ERP sicher erreichen können. Eine vorhandene Standortverbindung beantwortet diese Detailfrage noch nicht.",
      "initialAnswer": {
        "type": "open_question",
        "value": "",
        "origin": "unanswered",
        "evidence": "",
        "reviewer": "",
        "verdict": "unknown"
      }
    },
    {
      "id": "entra-present",
      "areaId": "identity",
      "prompt": "Welche Identitätsgrundlage ist vorhanden?",
      "canonicalIds": [
        "azure-0904"
      ],
      "criterionId": "criterion-entra-present",
      "impact": "blocking",
      "requiredForEvaluation": true,
      "kind": "text",
      "why": "Die vorhandene Identitätsplattform ist nur die Grundlage. Der tatsächliche Zugriff von Mitarbeitern, Partnern und Anwendungen muss gesondert festgelegt werden.",
      "initialAnswer": {
        "type": "fact",
        "value": "Microsoft Entra ID vorhanden",
        "origin": "demo_spec",
        "evidence": "Vorgabe im Demo-Auftrag",
        "reviewer": "",
        "verdict": "unknown"
      }
    },
    {
      "id": "employees",
      "areaId": "identity",
      "prompt": "Welche internen Benutzer greifen zu?",
      "canonicalIds": [
        "azure-0904"
      ],
      "criterionId": "criterion-employees",
      "impact": "blocking",
      "requiredForEvaluation": false,
      "kind": "text",
      "why": "Die vorhandene Identitätsplattform ist nur die Grundlage. Der tatsächliche Zugriff von Mitarbeitern, Partnern und Anwendungen muss gesondert festgelegt werden.",
      "initialAnswer": {
        "type": "fact",
        "value": "Mitarbeiter des Unternehmens",
        "origin": "demo_spec",
        "evidence": "Vorgabe im Demo-Auftrag",
        "reviewer": "",
        "verdict": "unknown"
      }
    },
    {
      "id": "partners",
      "areaId": "identity",
      "prompt": "Welche externen Benutzer greifen zu?",
      "canonicalIds": [
        "azure-0904"
      ],
      "criterionId": "criterion-partners",
      "impact": "blocking",
      "requiredForEvaluation": false,
      "kind": "text",
      "why": "Die vorhandene Identitätsplattform ist nur die Grundlage. Der tatsächliche Zugriff von Mitarbeitern, Partnern und Anwendungen muss gesondert festgelegt werden.",
      "initialAnswer": {
        "type": "fact",
        "value": "Ca. 50 externe Partner",
        "origin": "demo_spec",
        "evidence": "Vorgabe im Demo-Auftrag",
        "reviewer": "",
        "verdict": "unknown"
      }
    },
    {
      "id": "partner-b2b",
      "areaId": "identity",
      "prompt": "Wie werden Partnerkonten und deren Lebenszyklus verwaltet?",
      "canonicalIds": [
        "azure-0904"
      ],
      "criterionId": "criterion-partner-b2b",
      "impact": "blocking",
      "requiredForEvaluation": false,
      "kind": "text",
      "why": "Die vorhandene Identitätsplattform ist nur die Grundlage. Der tatsächliche Zugriff von Mitarbeitern, Partnern und Anwendungen muss gesondert festgelegt werden.",
      "initialAnswer": {
        "type": "open_question",
        "value": "",
        "origin": "unanswered",
        "evidence": "",
        "reviewer": "",
        "verdict": "unknown"
      }
    },
    {
      "id": "app-auth",
      "areaId": "identity",
      "prompt": "Wie meldet die Anwendung Benutzer an?",
      "canonicalIds": [
        "azure-0904"
      ],
      "criterionId": "criterion-app-auth",
      "impact": "blocking",
      "requiredForEvaluation": false,
      "kind": "text",
      "why": "Die vorhandene Identitätsplattform ist nur die Grundlage. Der tatsächliche Zugriff von Mitarbeitern, Partnern und Anwendungen muss gesondert festgelegt werden.",
      "initialAnswer": {
        "type": "open_question",
        "value": "",
        "origin": "unanswered",
        "evidence": "",
        "reviewer": "",
        "verdict": "unknown"
      }
    },
    {
      "id": "authorization",
      "areaId": "identity",
      "prompt": "Welche Aktionen dürfen Mitarbeiter und Partner ausführen?",
      "canonicalIds": [
        "azure-0904"
      ],
      "criterionId": "criterion-authorization",
      "impact": "blocking",
      "requiredForEvaluation": false,
      "kind": "text",
      "why": "Die vorhandene Identitätsplattform ist nur die Grundlage. Der tatsächliche Zugriff von Mitarbeitern, Partnern und Anwendungen muss gesondert festgelegt werden.",
      "initialAnswer": {
        "type": "open_question",
        "value": "",
        "origin": "unanswered",
        "evidence": "",
        "reviewer": "",
        "verdict": "unknown"
      }
    },
    {
      "id": "managed-identity",
      "areaId": "identity",
      "prompt": "Wie authentifiziert sich die Anwendung gegenüber anderen Diensten?",
      "canonicalIds": [
        "azure-0947"
      ],
      "criterionId": "criterion-managed-identity",
      "impact": "blocking",
      "requiredForEvaluation": false,
      "kind": "text",
      "why": "Die vorhandene Identitätsplattform ist nur die Grundlage. Der tatsächliche Zugriff von Mitarbeitern, Partnern und Anwendungen muss gesondert festgelegt werden.",
      "initialAnswer": {
        "type": "open_question",
        "value": "",
        "origin": "unanswered",
        "evidence": "",
        "reviewer": "",
        "verdict": "unknown"
      }
    },
    {
      "id": "rbac",
      "areaId": "identity",
      "prompt": "Welche technischen Rollen und Berechtigungen sind erforderlich?",
      "canonicalIds": [
        "azure-0964"
      ],
      "criterionId": "criterion-rbac",
      "impact": "blocking",
      "requiredForEvaluation": false,
      "kind": "text",
      "why": "Die vorhandene Identitätsplattform ist nur die Grundlage. Der tatsächliche Zugriff von Mitarbeitern, Partnern und Anwendungen muss gesondert festgelegt werden.",
      "initialAnswer": {
        "type": "open_question",
        "value": "",
        "origin": "unanswered",
        "evidence": "",
        "reviewer": "",
        "verdict": "unknown"
      }
    },
    {
      "id": "secrets",
      "areaId": "identity",
      "prompt": "Welche geheimen Werte werden benötigt und wie werden sie verwaltet?",
      "canonicalIds": [
        "azure-0944"
      ],
      "criterionId": "criterion-secrets",
      "impact": "blocking",
      "requiredForEvaluation": false,
      "kind": "text",
      "why": "Die vorhandene Identitätsplattform ist nur die Grundlage. Der tatsächliche Zugriff von Mitarbeitern, Partnern und Anwendungen muss gesondert festgelegt werden.",
      "initialAnswer": {
        "type": "open_question",
        "value": "",
        "origin": "unanswered",
        "evidence": "",
        "reviewer": "",
        "verdict": "unknown"
      }
    },
    {
      "id": "ingress",
      "areaId": "identity",
      "prompt": "Welcher Eingang ist vorgesehen und wie wird direkter App-Zugriff begrenzt?",
      "canonicalIds": [
        "azure-0519"
      ],
      "criterionId": "criterion-ingress",
      "impact": "blocking",
      "requiredForEvaluation": false,
      "kind": "text",
      "why": "Die vorhandene Identitätsplattform ist nur die Grundlage. Der tatsächliche Zugriff von Mitarbeitern, Partnern und Anwendungen muss gesondert festgelegt werden.",
      "initialAnswer": {
        "type": "open_question",
        "value": "",
        "origin": "unanswered",
        "evidence": "",
        "reviewer": "",
        "verdict": "unknown"
      }
    },
    {
      "id": "rto",
      "areaId": "recovery",
      "prompt": "Wie lange darf die Anwendung bei einem größeren Ausfall maximal nicht verfügbar sein?",
      "canonicalIds": [
        "azure-1076"
      ],
      "criterionId": "criterion-rto",
      "impact": "blocking",
      "requiredForEvaluation": true,
      "kind": "text",
      "why": "RTO (Recovery Time Objective) bezeichnet die maximal tolerierte Ausfallzeit. Das Ziel von vier Stunden bestätigt noch kein getestetes Wiederanlaufverfahren.",
      "initialAnswer": {
        "type": "fact",
        "value": "4 Stunden",
        "origin": "demo_spec",
        "evidence": "Vorgabe im Demo-Auftrag",
        "reviewer": "",
        "verdict": "unknown"
      }
    },
    {
      "id": "rpo",
      "areaId": "recovery",
      "prompt": "Wie viele Daten dürften im schlimmsten Fall verloren gehen?",
      "canonicalIds": [
        "azure-1076"
      ],
      "criterionId": "criterion-rpo",
      "impact": "blocking",
      "requiredForEvaluation": true,
      "kind": "text",
      "why": "RPO (Recovery Point Objective) bezeichnet den tolerierten Datenverlust als Zeitraum. Das Ziel von einer Stunde bestätigt noch keine passende Sicherungsstrategie.",
      "initialAnswer": {
        "type": "fact",
        "value": "Höchstens 1 Stunde",
        "origin": "demo_spec",
        "evidence": "Vorgabe im Demo-Auftrag",
        "reviewer": "",
        "verdict": "unknown"
      }
    },
    {
      "id": "backup-strategy",
      "areaId": "recovery",
      "prompt": "Wie werden Anwendung und Daten gesichert?",
      "canonicalIds": [
        "azure-1076"
      ],
      "criterionId": "criterion-backup-strategy",
      "impact": "blocking",
      "requiredForEvaluation": false,
      "kind": "text",
      "why": "Bekannte Ausfall- und Datenverlustziele reichen nicht aus. Das Wiederherstellungsverfahren muss dazu passen und getestet werden.",
      "initialAnswer": {
        "type": "open_question",
        "value": "",
        "origin": "unanswered",
        "evidence": "",
        "reviewer": "",
        "verdict": "unknown"
      }
    },
    {
      "id": "restore",
      "areaId": "recovery",
      "prompt": "Wie werden Daten und Anwendung wiederhergestellt?",
      "canonicalIds": [
        "azure-1076"
      ],
      "criterionId": "criterion-restore",
      "impact": "blocking",
      "requiredForEvaluation": false,
      "kind": "text",
      "why": "Bekannte Ausfall- und Datenverlustziele reichen nicht aus. Das Wiederherstellungsverfahren muss dazu passen und getestet werden.",
      "initialAnswer": {
        "type": "open_question",
        "value": "",
        "origin": "unanswered",
        "evidence": "",
        "reviewer": "",
        "verdict": "unknown"
      }
    },
    {
      "id": "restart",
      "areaId": "recovery",
      "prompt": "Wie läuft die Anwendung einschließlich Abhängigkeiten wieder an?",
      "canonicalIds": [
        "azure-1076"
      ],
      "criterionId": "criterion-restart",
      "impact": "blocking",
      "requiredForEvaluation": false,
      "kind": "text",
      "why": "Bekannte Ausfall- und Datenverlustziele reichen nicht aus. Das Wiederherstellungsverfahren muss dazu passen und getestet werden.",
      "initialAnswer": {
        "type": "open_question",
        "value": "",
        "origin": "unanswered",
        "evidence": "",
        "reviewer": "",
        "verdict": "unknown"
      }
    },
    {
      "id": "failure-strategy",
      "areaId": "recovery",
      "prompt": "Welche Ausfallszenarien muss die Lösung abdecken?",
      "canonicalIds": [
        "azure-1076"
      ],
      "criterionId": "criterion-failure-strategy",
      "impact": "blocking",
      "requiredForEvaluation": false,
      "kind": "text",
      "why": "Bekannte Ausfall- und Datenverlustziele reichen nicht aus. Das Wiederherstellungsverfahren muss dazu passen und getestet werden.",
      "initialAnswer": {
        "type": "open_question",
        "value": "",
        "origin": "unanswered",
        "evidence": "",
        "reviewer": "",
        "verdict": "unknown"
      }
    },
    {
      "id": "erp-recovery",
      "areaId": "recovery",
      "prompt": "Wie werden ERP- und VPN-Abhängigkeiten beim Wiederanlauf behandelt?",
      "canonicalIds": [
        "azure-1076"
      ],
      "criterionId": "criterion-erp-recovery",
      "impact": "blocking",
      "requiredForEvaluation": false,
      "kind": "text",
      "why": "Bekannte Ausfall- und Datenverlustziele reichen nicht aus. Das Wiederherstellungsverfahren muss dazu passen und getestet werden.",
      "initialAnswer": {
        "type": "open_question",
        "value": "",
        "origin": "unanswered",
        "evidence": "",
        "reviewer": "",
        "verdict": "unknown"
      }
    },
    {
      "id": "redundancy",
      "areaId": "recovery",
      "prompt": "Welche Redundanz ist für die Geschäftsziele erforderlich?",
      "canonicalIds": [
        "azure-1076"
      ],
      "criterionId": "criterion-redundancy",
      "impact": "blocking",
      "requiredForEvaluation": false,
      "kind": "text",
      "why": "Bekannte Ausfall- und Datenverlustziele reichen nicht aus. Das Wiederherstellungsverfahren muss dazu passen und getestet werden.",
      "initialAnswer": {
        "type": "open_question",
        "value": "",
        "origin": "unanswered",
        "evidence": "",
        "reviewer": "",
        "verdict": "unknown"
      }
    },
    {
      "id": "recovery-test",
      "areaId": "recovery",
      "prompt": "Ist der Wiederanlauf gegen RTO und RPO getestet und dokumentiert?",
      "canonicalIds": [
        "azure-1076"
      ],
      "criterionId": "criterion-recovery-test",
      "impact": "blocking",
      "requiredForEvaluation": false,
      "kind": "text",
      "why": "Bekannte Ausfall- und Datenverlustziele reichen nicht aus. Das Wiederherstellungsverfahren muss dazu passen und getestet werden.",
      "initialAnswer": {
        "type": "open_question",
        "value": "",
        "origin": "unanswered",
        "evidence": "",
        "reviewer": "",
        "verdict": "unknown"
      }
    },
    {
      "id": "personal-data",
      "areaId": "privacy",
      "prompt": "Welche sensiblen Daten werden verarbeitet?",
      "canonicalIds": [
        "azure-0904"
      ],
      "criterionId": "criterion-personal-data",
      "impact": "blocking",
      "requiredForEvaluation": true,
      "kind": "text",
      "why": "Die zuständige Fachstelle muss aus dem Datenkontext konkrete technische Anforderungen ableiten. Das Werkzeug erteilt keine rechtliche Freigabe.",
      "initialAnswer": {
        "type": "fact",
        "value": "Personenbezogene Kundendaten und interne Unternehmensdaten",
        "origin": "demo_spec",
        "evidence": "Vorgabe im Demo-Auftrag",
        "reviewer": "",
        "verdict": "unknown"
      }
    },
    {
      "id": "eu-constraint",
      "areaId": "privacy",
      "prompt": "Welche räumliche Vorgabe gilt?",
      "canonicalIds": [
        "azure-0904"
      ],
      "criterionId": "criterion-eu-constraint",
      "impact": "blocking",
      "requiredForEvaluation": false,
      "kind": "text",
      "why": "Die zuständige Fachstelle muss aus dem Datenkontext konkrete technische Anforderungen ableiten. Das Werkzeug erteilt keine rechtliche Freigabe.",
      "initialAnswer": {
        "type": "fact",
        "value": "Daten innerhalb des definierten EU-Rahmens",
        "origin": "demo_spec",
        "evidence": "Vorgabe im Demo-Auftrag",
        "reviewer": "",
        "verdict": "unknown"
      }
    },
    {
      "id": "privacy-review",
      "areaId": "privacy",
      "prompt": "Welche technischen Vorgaben hat die zuständige Fachstelle dokumentiert?",
      "canonicalIds": [
        "azure-0904"
      ],
      "criterionId": "criterion-privacy-review",
      "impact": "specialist",
      "requiredForEvaluation": false,
      "kind": "specialist",
      "why": "Die zuständige Fachstelle muss aus dem Datenkontext konkrete technische Anforderungen ableiten. Das Werkzeug erteilt keine rechtliche Freigabe.",
      "initialAnswer": {
        "type": "specialist_review",
        "value": "",
        "origin": "unanswered",
        "evidence": "",
        "reviewer": "",
        "verdict": "unknown"
      }
    },
    {
      "id": "less-operations",
      "areaId": "operations",
      "prompt": "Welchen Betriebsaufwand möchte der Kunde reduzieren?",
      "canonicalIds": [
        "azure-0351"
      ],
      "criterionId": "criterion-less-operations",
      "impact": "blocking",
      "requiredForEvaluation": true,
      "kind": "text",
      "why": "Der Betrieb muss für die kleine IT und das Budget tragfähig sein. Zuständigkeiten und belastbare Abschätzungen fehlen bislang.",
      "initialAnswer": {
        "type": "fact",
        "value": "Möglichst wenig Server selbst betreiben",
        "origin": "demo_spec",
        "evidence": "Vorgabe im Demo-Auftrag",
        "reviewer": "",
        "verdict": "unknown"
      }
    },
    {
      "id": "small-it",
      "areaId": "operations",
      "prompt": "Welche interne Betriebskapazität besteht?",
      "canonicalIds": [
        "azure-0983"
      ],
      "criterionId": "criterion-small-it",
      "impact": "blocking",
      "requiredForEvaluation": false,
      "kind": "text",
      "why": "Der Betrieb muss für die kleine IT und das Budget tragfähig sein. Zuständigkeiten und belastbare Abschätzungen fehlen bislang.",
      "initialAnswer": {
        "type": "fact",
        "value": "Kleine interne IT; Monitoring aktuell schwach",
        "origin": "demo_spec",
        "evidence": "Vorgabe im Demo-Auftrag",
        "reviewer": "",
        "verdict": "unknown"
      }
    },
    {
      "id": "budget",
      "areaId": "operations",
      "prompt": "Welcher monatliche Zielrahmen gilt?",
      "canonicalIds": [
        "azure-1073"
      ],
      "criterionId": "criterion-budget",
      "impact": "blocking",
      "requiredForEvaluation": true,
      "kind": "text",
      "why": "Der Betrieb muss für die kleine IT und das Budget tragfähig sein. Zuständigkeiten und belastbare Abschätzungen fehlen bislang.",
      "initialAnswer": {
        "type": "fact",
        "value": "Grob unter 5.000 EUR / Monat",
        "origin": "demo_spec",
        "evidence": "Vorgabe im Demo-Auftrag",
        "reviewer": "",
        "verdict": "unknown"
      }
    },
    {
      "id": "patch-ownership",
      "areaId": "operations",
      "prompt": "Wer trägt welche Patch- und Betriebsverantwortung?",
      "canonicalIds": [
        "azure-0351"
      ],
      "criterionId": "criterion-patch-ownership",
      "impact": "blocking",
      "requiredForEvaluation": false,
      "kind": "text",
      "why": "Der Betrieb muss für die kleine IT und das Budget tragfähig sein. Zuständigkeiten und belastbare Abschätzungen fehlen bislang.",
      "initialAnswer": {
        "type": "open_question",
        "value": "",
        "origin": "unanswered",
        "evidence": "",
        "reviewer": "",
        "verdict": "unknown"
      }
    },
    {
      "id": "ops-deployment",
      "areaId": "operations",
      "prompt": "Wer verantwortet Bereitstellung und Änderungen?",
      "canonicalIds": [
        "azure-0351"
      ],
      "criterionId": "criterion-ops-deployment",
      "impact": "blocking",
      "requiredForEvaluation": false,
      "kind": "text",
      "why": "Der Betrieb muss für die kleine IT und das Budget tragfähig sein. Zuständigkeiten und belastbare Abschätzungen fehlen bislang.",
      "initialAnswer": {
        "type": "open_question",
        "value": "",
        "origin": "unanswered",
        "evidence": "",
        "reviewer": "",
        "verdict": "unknown"
      }
    },
    {
      "id": "monitoring",
      "areaId": "operations",
      "prompt": "Welche Betriebszustände müssen überwacht werden?",
      "canonicalIds": [
        "azure-0983"
      ],
      "criterionId": "criterion-monitoring",
      "impact": "blocking",
      "requiredForEvaluation": false,
      "kind": "text",
      "why": "Der Betrieb muss für die kleine IT und das Budget tragfähig sein. Zuständigkeiten und belastbare Abschätzungen fehlen bislang.",
      "initialAnswer": {
        "type": "open_question",
        "value": "",
        "origin": "unanswered",
        "evidence": "",
        "reviewer": "",
        "verdict": "unknown"
      }
    },
    {
      "id": "logging",
      "areaId": "operations",
      "prompt": "Welche Protokolle werden gebraucht und wie lange aufbewahrt?",
      "canonicalIds": [
        "azure-0987"
      ],
      "criterionId": "criterion-logging",
      "impact": "blocking",
      "requiredForEvaluation": false,
      "kind": "text",
      "why": "Der Betrieb muss für die kleine IT und das Budget tragfähig sein. Zuständigkeiten und belastbare Abschätzungen fehlen bislang.",
      "initialAnswer": {
        "type": "open_question",
        "value": "",
        "origin": "unanswered",
        "evidence": "",
        "reviewer": "",
        "verdict": "unknown"
      }
    },
    {
      "id": "alerts",
      "areaId": "operations",
      "prompt": "Welche Alarme benötigen Zuständigkeiten und Reaktionen?",
      "canonicalIds": [
        "azure-0983"
      ],
      "criterionId": "criterion-alerts",
      "impact": "blocking",
      "requiredForEvaluation": false,
      "kind": "text",
      "why": "Der Betrieb muss für die kleine IT und das Budget tragfähig sein. Zuständigkeiten und belastbare Abschätzungen fehlen bislang.",
      "initialAnswer": {
        "type": "open_question",
        "value": "",
        "origin": "unanswered",
        "evidence": "",
        "reviewer": "",
        "verdict": "unknown"
      }
    },
    {
      "id": "runbooks",
      "areaId": "operations",
      "prompt": "Welche Runbooks und Verantwortlichkeiten sind festgelegt?",
      "canonicalIds": [
        "azure-0983"
      ],
      "criterionId": "criterion-runbooks",
      "impact": "blocking",
      "requiredForEvaluation": false,
      "kind": "text",
      "why": "Der Betrieb muss für die kleine IT und das Budget tragfähig sein. Zuständigkeiten und belastbare Abschätzungen fehlen bislang.",
      "initialAnswer": {
        "type": "open_question",
        "value": "",
        "origin": "unanswered",
        "evidence": "",
        "reviewer": "",
        "verdict": "unknown"
      }
    },
    {
      "id": "cost-assumptions",
      "areaId": "operations",
      "prompt": "Welche Last-, Nutzungs- und Kostenannahmen wurden dokumentiert?",
      "canonicalIds": [
        "azure-1073"
      ],
      "criterionId": "criterion-cost-assumptions",
      "impact": "blocking",
      "requiredForEvaluation": false,
      "kind": "text",
      "why": "Der Betrieb muss für die kleine IT und das Budget tragfähig sein. Zuständigkeiten und belastbare Abschätzungen fehlen bislang.",
      "initialAnswer": {
        "type": "open_question",
        "value": "",
        "origin": "unanswered",
        "evidence": "",
        "reviewer": "",
        "verdict": "unknown"
      }
    },
    {
      "id": "region-sizing",
      "areaId": "operations",
      "prompt": "Welche Region, Tarife und Dimensionierung sind vorgesehen?",
      "canonicalIds": [
        "azure-1073"
      ],
      "criterionId": "criterion-region-sizing",
      "impact": "blocking",
      "requiredForEvaluation": false,
      "kind": "text",
      "why": "Der Betrieb muss für die kleine IT und das Budget tragfähig sein. Zuständigkeiten und belastbare Abschätzungen fehlen bislang.",
      "initialAnswer": {
        "type": "open_question",
        "value": "",
        "origin": "unanswered",
        "evidence": "",
        "reviewer": "",
        "verdict": "unknown"
      }
    },
    {
      "id": "cost-estimate",
      "areaId": "operations",
      "prompt": "Welche belastbare Kostenabschätzung liegt vor?",
      "canonicalIds": [
        "azure-1073"
      ],
      "criterionId": "criterion-cost-estimate",
      "impact": "blocking",
      "requiredForEvaluation": false,
      "kind": "text",
      "why": "Die Abschätzung muss Region, Tarif, Dimensionierung und Betriebsannahmen nennen. Das Budgetziel allein ist keine Kostenzusage.",
      "initialAnswer": {
        "type": "open_question",
        "value": "",
        "origin": "unanswered",
        "evidence": "",
        "reviewer": "",
        "verdict": "unknown"
      }
    },
    {
      "id": "landing-context",
      "areaId": "operations",
      "prompt": "In welchem bestehenden Umgebungs-/Landing-Zone-Rahmen wird die Anwendung betrieben?",
      "canonicalIds": [
        "azure-0054"
      ],
      "criterionId": "criterion-landing-context",
      "impact": "blocking",
      "requiredForEvaluation": false,
      "kind": "text",
      "why": "Der Betrieb muss für die kleine IT und das Budget tragfähig sein. Zuständigkeiten und belastbare Abschätzungen fehlen bislang.",
      "initialAnswer": {
        "type": "open_question",
        "value": "",
        "origin": "unanswered",
        "evidence": "",
        "reviewer": "",
        "verdict": "unknown"
      }
    },
    {
      "id": "governance-owner",
      "areaId": "operations",
      "prompt": "Wer verantwortet Governance und die technischen Leitplanken?",
      "canonicalIds": [
        "azure-0054"
      ],
      "criterionId": "criterion-governance-owner",
      "impact": "blocking",
      "requiredForEvaluation": false,
      "kind": "text",
      "why": "Der Betrieb muss für die kleine IT und das Budget tragfähig sein. Zuständigkeiten und belastbare Abschätzungen fehlen bislang.",
      "initialAnswer": {
        "type": "open_question",
        "value": "",
        "origin": "unanswered",
        "evidence": "",
        "reviewer": "",
        "verdict": "unknown"
      }
    },
    {
      "id": "migration-plan",
      "areaId": "operations",
      "prompt": "Wie werden Migration, Umstellung und Rückfall abgestimmt?",
      "canonicalIds": [
        "azure-1078"
      ],
      "criterionId": "criterion-migration-plan",
      "impact": "blocking",
      "requiredForEvaluation": false,
      "kind": "text",
      "why": "Der Betrieb muss für die kleine IT und das Budget tragfähig sein. Zuständigkeiten und belastbare Abschätzungen fehlen bislang.",
      "initialAnswer": {
        "type": "open_question",
        "value": "",
        "origin": "unanswered",
        "evidence": "",
        "reviewer": "",
        "verdict": "unknown"
      }
    }
  ],
  "criteria": [
    {
      "id": "criterion-app-baseline",
      "areaId": "compute",
      "questionIds": [
        "app-baseline"
      ],
      "impact": "blocking",
      "requiredForEvaluation": true
    },
    {
      "id": "criterion-user-count",
      "areaId": "compute",
      "questionIds": [
        "user-count"
      ],
      "impact": "non_blocking",
      "requiredForEvaluation": false
    },
    {
      "id": "criterion-dotnet-version",
      "areaId": "compute",
      "questionIds": [
        "dotnet-version"
      ],
      "impact": "blocking",
      "requiredForEvaluation": false
    },
    {
      "id": "criterion-dotnet-family",
      "areaId": "compute",
      "questionIds": [
        "dotnet-family"
      ],
      "impact": "blocking",
      "requiredForEvaluation": false
    },
    {
      "id": "criterion-iis-dependencies",
      "areaId": "compute",
      "questionIds": [
        "iis-dependencies"
      ],
      "impact": "blocking",
      "requiredForEvaluation": false
    },
    {
      "id": "criterion-native-apis",
      "areaId": "compute",
      "questionIds": [
        "native-apis"
      ],
      "impact": "blocking",
      "requiredForEvaluation": false
    },
    {
      "id": "criterion-com-registry-gdi",
      "areaId": "compute",
      "questionIds": [
        "com-registry-gdi"
      ],
      "impact": "blocking",
      "requiredForEvaluation": false
    },
    {
      "id": "criterion-local-files",
      "areaId": "compute",
      "questionIds": [
        "local-files"
      ],
      "impact": "blocking",
      "requiredForEvaluation": false
    },
    {
      "id": "criterion-session-state",
      "areaId": "compute",
      "questionIds": [
        "session-state"
      ],
      "impact": "blocking",
      "requiredForEvaluation": false
    },
    {
      "id": "criterion-background-jobs",
      "areaId": "compute",
      "questionIds": [
        "background-jobs"
      ],
      "impact": "blocking",
      "requiredForEvaluation": false
    },
    {
      "id": "criterion-deployment",
      "areaId": "compute",
      "questionIds": [
        "deployment"
      ],
      "impact": "blocking",
      "requiredForEvaluation": false
    },
    {
      "id": "criterion-containerized",
      "areaId": "compute",
      "questionIds": [
        "containerized"
      ],
      "impact": "blocking",
      "requiredForEvaluation": false
    },
    {
      "id": "criterion-runtime-requirements",
      "areaId": "compute",
      "questionIds": [
        "runtime-requirements"
      ],
      "impact": "blocking",
      "requiredForEvaluation": false
    },
    {
      "id": "criterion-app-fit",
      "areaId": "compute",
      "questionIds": [
        "app-fit"
      ],
      "impact": "blocking",
      "requiredForEvaluation": false
    },
    {
      "id": "criterion-container-fit",
      "areaId": "compute",
      "questionIds": [
        "container-fit"
      ],
      "impact": "blocking",
      "requiredForEvaluation": false
    },
    {
      "id": "criterion-vm-fit",
      "areaId": "compute",
      "questionIds": [
        "vm-fit"
      ],
      "impact": "blocking",
      "requiredForEvaluation": false
    },
    {
      "id": "criterion-sql-baseline",
      "areaId": "database",
      "questionIds": [
        "sql-baseline"
      ],
      "impact": "blocking",
      "requiredForEvaluation": true
    },
    {
      "id": "criterion-sql-version",
      "areaId": "database",
      "questionIds": [
        "sql-version"
      ],
      "impact": "blocking",
      "requiredForEvaluation": false
    },
    {
      "id": "criterion-db-size",
      "areaId": "database",
      "questionIds": [
        "db-size"
      ],
      "impact": "blocking",
      "requiredForEvaluation": false
    },
    {
      "id": "criterion-sql-features",
      "areaId": "database",
      "questionIds": [
        "sql-features"
      ],
      "impact": "blocking",
      "requiredForEvaluation": false
    },
    {
      "id": "criterion-sql-agent",
      "areaId": "database",
      "questionIds": [
        "sql-agent"
      ],
      "impact": "blocking",
      "requiredForEvaluation": false
    },
    {
      "id": "criterion-sql-clr",
      "areaId": "database",
      "questionIds": [
        "sql-clr"
      ],
      "impact": "blocking",
      "requiredForEvaluation": false
    },
    {
      "id": "criterion-linked-servers",
      "areaId": "database",
      "questionIds": [
        "linked-servers"
      ],
      "impact": "blocking",
      "requiredForEvaluation": false
    },
    {
      "id": "criterion-cross-database",
      "areaId": "database",
      "questionIds": [
        "cross-database"
      ],
      "impact": "blocking",
      "requiredForEvaluation": false
    },
    {
      "id": "criterion-db-performance",
      "areaId": "database",
      "questionIds": [
        "db-performance"
      ],
      "impact": "blocking",
      "requiredForEvaluation": false
    },
    {
      "id": "criterion-db-maintenance",
      "areaId": "database",
      "questionIds": [
        "db-maintenance"
      ],
      "impact": "blocking",
      "requiredForEvaluation": false
    },
    {
      "id": "criterion-db-backup",
      "areaId": "database",
      "questionIds": [
        "db-backup"
      ],
      "impact": "blocking",
      "requiredForEvaluation": false
    },
    {
      "id": "criterion-db-migration",
      "areaId": "database",
      "questionIds": [
        "db-migration"
      ],
      "impact": "blocking",
      "requiredForEvaluation": false
    },
    {
      "id": "criterion-private-db",
      "areaId": "database",
      "questionIds": [
        "private-db"
      ],
      "impact": "blocking",
      "requiredForEvaluation": false
    },
    {
      "id": "criterion-vpn-present",
      "areaId": "network",
      "questionIds": [
        "vpn-present"
      ],
      "impact": "blocking",
      "requiredForEvaluation": true
    },
    {
      "id": "criterion-erp-stays",
      "areaId": "network",
      "questionIds": [
        "erp-stays"
      ],
      "impact": "blocking",
      "requiredForEvaluation": false
    },
    {
      "id": "criterion-vpn-capacity",
      "areaId": "network",
      "questionIds": [
        "vpn-capacity"
      ],
      "impact": "blocking",
      "requiredForEvaluation": false
    },
    {
      "id": "criterion-routing",
      "areaId": "network",
      "questionIds": [
        "routing"
      ],
      "impact": "blocking",
      "requiredForEvaluation": false
    },
    {
      "id": "criterion-dns",
      "areaId": "network",
      "questionIds": [
        "dns"
      ],
      "impact": "blocking",
      "requiredForEvaluation": false
    },
    {
      "id": "criterion-erp-interface",
      "areaId": "network",
      "questionIds": [
        "erp-interface"
      ],
      "impact": "blocking",
      "requiredForEvaluation": false
    },
    {
      "id": "criterion-outbound",
      "areaId": "network",
      "questionIds": [
        "outbound"
      ],
      "impact": "blocking",
      "requiredForEvaluation": false
    },
    {
      "id": "criterion-partner-network",
      "areaId": "network",
      "questionIds": [
        "partner-network"
      ],
      "impact": "blocking",
      "requiredForEvaluation": false
    },
    {
      "id": "criterion-network-boundaries",
      "areaId": "network",
      "questionIds": [
        "network-boundaries"
      ],
      "impact": "blocking",
      "requiredForEvaluation": false
    },
    {
      "id": "criterion-entra-present",
      "areaId": "identity",
      "questionIds": [
        "entra-present"
      ],
      "impact": "blocking",
      "requiredForEvaluation": true
    },
    {
      "id": "criterion-employees",
      "areaId": "identity",
      "questionIds": [
        "employees"
      ],
      "impact": "blocking",
      "requiredForEvaluation": false
    },
    {
      "id": "criterion-partners",
      "areaId": "identity",
      "questionIds": [
        "partners"
      ],
      "impact": "blocking",
      "requiredForEvaluation": false
    },
    {
      "id": "criterion-partner-b2b",
      "areaId": "identity",
      "questionIds": [
        "partner-b2b"
      ],
      "impact": "blocking",
      "requiredForEvaluation": false
    },
    {
      "id": "criterion-app-auth",
      "areaId": "identity",
      "questionIds": [
        "app-auth"
      ],
      "impact": "blocking",
      "requiredForEvaluation": false
    },
    {
      "id": "criterion-authorization",
      "areaId": "identity",
      "questionIds": [
        "authorization"
      ],
      "impact": "blocking",
      "requiredForEvaluation": false
    },
    {
      "id": "criterion-managed-identity",
      "areaId": "identity",
      "questionIds": [
        "managed-identity"
      ],
      "impact": "blocking",
      "requiredForEvaluation": false
    },
    {
      "id": "criterion-rbac",
      "areaId": "identity",
      "questionIds": [
        "rbac"
      ],
      "impact": "blocking",
      "requiredForEvaluation": false
    },
    {
      "id": "criterion-secrets",
      "areaId": "identity",
      "questionIds": [
        "secrets"
      ],
      "impact": "blocking",
      "requiredForEvaluation": false
    },
    {
      "id": "criterion-ingress",
      "areaId": "identity",
      "questionIds": [
        "ingress"
      ],
      "impact": "blocking",
      "requiredForEvaluation": false
    },
    {
      "id": "criterion-rto",
      "areaId": "recovery",
      "questionIds": [
        "rto"
      ],
      "impact": "blocking",
      "requiredForEvaluation": true
    },
    {
      "id": "criterion-rpo",
      "areaId": "recovery",
      "questionIds": [
        "rpo"
      ],
      "impact": "blocking",
      "requiredForEvaluation": true
    },
    {
      "id": "criterion-backup-strategy",
      "areaId": "recovery",
      "questionIds": [
        "backup-strategy"
      ],
      "impact": "blocking",
      "requiredForEvaluation": false
    },
    {
      "id": "criterion-restore",
      "areaId": "recovery",
      "questionIds": [
        "restore"
      ],
      "impact": "blocking",
      "requiredForEvaluation": false
    },
    {
      "id": "criterion-restart",
      "areaId": "recovery",
      "questionIds": [
        "restart"
      ],
      "impact": "blocking",
      "requiredForEvaluation": false
    },
    {
      "id": "criterion-failure-strategy",
      "areaId": "recovery",
      "questionIds": [
        "failure-strategy"
      ],
      "impact": "blocking",
      "requiredForEvaluation": false
    },
    {
      "id": "criterion-erp-recovery",
      "areaId": "recovery",
      "questionIds": [
        "erp-recovery"
      ],
      "impact": "blocking",
      "requiredForEvaluation": false
    },
    {
      "id": "criterion-redundancy",
      "areaId": "recovery",
      "questionIds": [
        "redundancy"
      ],
      "impact": "blocking",
      "requiredForEvaluation": false
    },
    {
      "id": "criterion-recovery-test",
      "areaId": "recovery",
      "questionIds": [
        "recovery-test"
      ],
      "impact": "blocking",
      "requiredForEvaluation": false
    },
    {
      "id": "criterion-personal-data",
      "areaId": "privacy",
      "questionIds": [
        "personal-data"
      ],
      "impact": "blocking",
      "requiredForEvaluation": true
    },
    {
      "id": "criterion-eu-constraint",
      "areaId": "privacy",
      "questionIds": [
        "eu-constraint"
      ],
      "impact": "blocking",
      "requiredForEvaluation": false
    },
    {
      "id": "criterion-privacy-review",
      "areaId": "privacy",
      "questionIds": [
        "privacy-review"
      ],
      "impact": "specialist",
      "requiredForEvaluation": false
    },
    {
      "id": "criterion-less-operations",
      "areaId": "operations",
      "questionIds": [
        "less-operations"
      ],
      "impact": "blocking",
      "requiredForEvaluation": true
    },
    {
      "id": "criterion-small-it",
      "areaId": "operations",
      "questionIds": [
        "small-it"
      ],
      "impact": "blocking",
      "requiredForEvaluation": false
    },
    {
      "id": "criterion-budget",
      "areaId": "operations",
      "questionIds": [
        "budget"
      ],
      "impact": "blocking",
      "requiredForEvaluation": true
    },
    {
      "id": "criterion-patch-ownership",
      "areaId": "operations",
      "questionIds": [
        "patch-ownership"
      ],
      "impact": "blocking",
      "requiredForEvaluation": false
    },
    {
      "id": "criterion-ops-deployment",
      "areaId": "operations",
      "questionIds": [
        "ops-deployment"
      ],
      "impact": "blocking",
      "requiredForEvaluation": false
    },
    {
      "id": "criterion-monitoring",
      "areaId": "operations",
      "questionIds": [
        "monitoring"
      ],
      "impact": "blocking",
      "requiredForEvaluation": false
    },
    {
      "id": "criterion-logging",
      "areaId": "operations",
      "questionIds": [
        "logging"
      ],
      "impact": "blocking",
      "requiredForEvaluation": false
    },
    {
      "id": "criterion-alerts",
      "areaId": "operations",
      "questionIds": [
        "alerts"
      ],
      "impact": "blocking",
      "requiredForEvaluation": false
    },
    {
      "id": "criterion-runbooks",
      "areaId": "operations",
      "questionIds": [
        "runbooks"
      ],
      "impact": "blocking",
      "requiredForEvaluation": false
    },
    {
      "id": "criterion-cost-assumptions",
      "areaId": "operations",
      "questionIds": [
        "cost-assumptions"
      ],
      "impact": "blocking",
      "requiredForEvaluation": false
    },
    {
      "id": "criterion-region-sizing",
      "areaId": "operations",
      "questionIds": [
        "region-sizing"
      ],
      "impact": "blocking",
      "requiredForEvaluation": false
    },
    {
      "id": "criterion-cost-estimate",
      "areaId": "operations",
      "questionIds": [
        "cost-estimate"
      ],
      "impact": "blocking",
      "requiredForEvaluation": false
    },
    {
      "id": "criterion-landing-context",
      "areaId": "operations",
      "questionIds": [
        "landing-context"
      ],
      "impact": "blocking",
      "requiredForEvaluation": false
    },
    {
      "id": "criterion-governance-owner",
      "areaId": "operations",
      "questionIds": [
        "governance-owner"
      ],
      "impact": "blocking",
      "requiredForEvaluation": false
    },
    {
      "id": "criterion-migration-plan",
      "areaId": "operations",
      "questionIds": [
        "migration-plan"
      ],
      "impact": "blocking",
      "requiredForEvaluation": false
    }
  ],
  "constraints": [
    {
      "id": "budget-limit",
      "questionId": "budget",
      "areaId": "operations"
    },
    {
      "id": "private-access",
      "questionId": "private-db",
      "areaId": "database"
    },
    {
      "id": "eu-data",
      "questionId": "eu-constraint",
      "areaId": "privacy"
    }
  ],
  "options": [
    {
      "id": "app",
      "canonicalId": "azure-0351",
      "label": "Azure App Service",
      "fitQuestion": "app-fit",
      "rationaleIds": [
        "less-operations",
        "app-baseline",
        "small-it"
      ],
      "criteria": {
        "operations": "Weniger eigener Serverbetrieb passt zum Kundenziel.",
        "compatibility": "Plattformgrenzen müssen zur konkreten Anwendung passen.",
        "change": "Ziel ist möglichst wenig Umbau; tatsächlicher Aufwand ist offen.",
        "expertise": "Plattformbetrieb sinkt; Anwendungsbetrieb bleibt zu klären."
      }
    },
    {
      "id": "containers",
      "canonicalId": "azure-1062",
      "label": "Azure Container Apps",
      "fitQuestion": "container-fit",
      "rationaleIds": [
        "containerized",
        "deployment",
        "runtime-requirements"
      ],
      "criteria": {
        "operations": "Verwaltete Plattform; Containerbetrieb und Zuständigkeiten prüfen.",
        "compatibility": "Containerisierbarkeit und Laufzeit müssen geprüft werden.",
        "change": "Containerisierung kann zusätzliche Arbeit erfordern.",
        "expertise": "Container-Know-how und Bereitstellungsmodell müssen vorhanden sein."
      }
    },
    {
      "id": "vm",
      "canonicalId": "azure-0322",
      "label": "Azure Virtual Machines",
      "fitQuestion": "vm-fit",
      "rationaleIds": [
        "runtime-requirements",
        "iis-dependencies",
        "less-operations"
      ],
      "criteria": {
        "operations": "Mehr eigener Betrieb steht dem Reduktionsziel entgegen.",
        "compatibility": "Mehr Betriebssystemkontrolle kann bei Abhängigkeiten relevant sein.",
        "change": "Übernahme des Bestands möglich, Aufwand ist dennoch zu prüfen.",
        "expertise": "Patchen, Betriebssystem und Serverbetrieb benötigen Zuständigkeiten."
      }
    }
  ],
  "comparisonCriteria": [
    {
      "id": "operations",
      "label": "Eigener Betriebsaufwand",
      "questionIds": [
        "less-operations",
        "patch-ownership"
      ]
    },
    {
      "id": "compatibility",
      "label": "Anwendungskompatibilität",
      "questionIds": [
        "dotnet-version",
        "iis-dependencies",
        "runtime-requirements"
      ]
    },
    {
      "id": "change",
      "label": "Änderungsaufwand",
      "questionIds": [
        "containerized",
        "local-files",
        "background-jobs"
      ]
    },
    {
      "id": "expertise",
      "label": "Benötigtes Know-how",
      "questionIds": [
        "small-it",
        "deployment"
      ]
    }
  ],
  "initialDecisions": [
    {
      "id": "decision-compute",
      "areaId": "compute",
      "status": "recommendation",
      "optionId": "app",
      "rationaleIds": [
        "less-operations",
        "app-baseline",
        "small-it"
      ],
      "evidence": "",
      "confirmedFingerprint": null
    },
    {
      "id": "decision-database",
      "areaId": "database",
      "status": "recommendation",
      "optionId": null,
      "rationaleIds": [],
      "evidence": "",
      "confirmedFingerprint": null
    },
    {
      "id": "decision-network",
      "areaId": "network",
      "status": "recommendation",
      "optionId": null,
      "rationaleIds": [],
      "evidence": "",
      "confirmedFingerprint": null
    },
    {
      "id": "decision-identity",
      "areaId": "identity",
      "status": "recommendation",
      "optionId": null,
      "rationaleIds": [],
      "evidence": "",
      "confirmedFingerprint": null
    },
    {
      "id": "decision-recovery",
      "areaId": "recovery",
      "status": "recommendation",
      "optionId": null,
      "rationaleIds": [],
      "evidence": "",
      "confirmedFingerprint": null
    },
    {
      "id": "decision-privacy",
      "areaId": "privacy",
      "status": "recommendation",
      "optionId": null,
      "rationaleIds": [],
      "evidence": "",
      "confirmedFingerprint": null
    },
    {
      "id": "decision-operations",
      "areaId": "operations",
      "status": "recommendation",
      "optionId": null,
      "rationaleIds": [],
      "evidence": "",
      "confirmedFingerprint": null
    }
  ],
  "components": [
    {
      "id": "entra",
      "canonicalId": "azure-0904",
      "areaId": "identity",
      "decisionId": "decision-identity",
      "rationaleQuestionId": "entra-present",
      "role": "Bestehende Identitätsgrundlage",
      "initialStatus": "confirmed"
    },
    {
      "id": "gateway",
      "canonicalId": "azure-0519",
      "areaId": "identity",
      "decisionId": "decision-identity",
      "rationaleQuestionId": "ingress",
      "role": "Vorgeschlagener Eingang für Webanfragen",
      "initialStatus": "proposed"
    },
    {
      "id": "firewall",
      "canonicalId": "azure-0863",
      "areaId": "identity",
      "decisionId": "decision-identity",
      "rationaleQuestionId": "ingress",
      "role": "Vorgeschlagene Prüfung von Webanfragen",
      "initialStatus": "proposed"
    },
    {
      "id": "app",
      "canonicalId": "azure-0351",
      "areaId": "compute",
      "decisionId": "decision-compute",
      "rationaleQuestionId": "less-operations",
      "role": "Vorläufige Plattformpräferenz",
      "initialStatus": "proposed"
    },
    {
      "id": "vnet",
      "canonicalId": "azure-0442",
      "areaId": "network",
      "decisionId": "decision-network",
      "rationaleQuestionId": "network-boundaries",
      "role": "Vorgeschlagener Rahmen für private Zugriffe",
      "initialStatus": "proposed"
    },
    {
      "id": "endpoint",
      "canonicalId": "azure-0881",
      "areaId": "database",
      "decisionId": "decision-database",
      "rationaleQuestionId": "private-db",
      "role": "Vorgeschlagener privater Datenbankzugang",
      "initialStatus": "proposed"
    },
    {
      "id": "dns",
      "canonicalId": "azure-0558",
      "areaId": "network",
      "decisionId": "decision-network",
      "rationaleQuestionId": "dns",
      "role": "Private Namensauflösung noch auszuarbeiten",
      "initialStatus": "open"
    },
    {
      "id": "sql",
      "canonicalId": "azure-0731",
      "areaId": "database",
      "decisionId": "decision-database",
      "rationaleQuestionId": "db-migration",
      "role": "Datenbank-Zielplattform noch auf Eignung zu prüfen",
      "initialStatus": "proposed"
    },
    {
      "id": "monitor",
      "canonicalId": "azure-0983",
      "areaId": "operations",
      "decisionId": "decision-operations",
      "rationaleQuestionId": "small-it",
      "role": "Beobachtbarer Betrieb für die kleine IT",
      "initialStatus": "proposed"
    },
    {
      "id": "insights",
      "canonicalId": "azure-0987",
      "areaId": "operations",
      "decisionId": "decision-operations",
      "rationaleQuestionId": "logging",
      "role": "Anwendungsbeobachtung noch festzulegen",
      "initialStatus": "proposed"
    },
    {
      "id": "vpn",
      "canonicalId": "azure-0462",
      "areaId": "network",
      "decisionId": "decision-network",
      "rationaleQuestionId": "vpn-present",
      "role": "Azure-seitige Anbindung noch zu prüfen; die Standortverbindung besteht",
      "initialStatus": "proposed"
    }
  ],
  "reviewChecks": [
    {
      "id": "review-security",
      "pillar": "Security",
      "label": "Sicherheit",
      "areaIds": [
        "identity",
        "privacy",
        "network"
      ]
    },
    {
      "id": "review-reliability",
      "pillar": "Reliability",
      "label": "Zuverlässigkeit",
      "areaIds": [
        "recovery"
      ]
    },
    {
      "id": "review-cost",
      "pillar": "Cost Optimization",
      "label": "Kosten",
      "areaIds": [
        "operations"
      ]
    },
    {
      "id": "review-operations",
      "pillar": "Operational Excellence",
      "label": "Betrieb",
      "areaIds": [
        "operations"
      ]
    },
    {
      "id": "review-performance",
      "pillar": "Performance Efficiency",
      "label": "Leistung",
      "areaIds": [
        "compute",
        "database"
      ]
    }
  ],
  "adoptionChecks": [
    {
      "id": "adoption-environment",
      "label": "Umgebungsrahmen / Landing Zone",
      "questionId": "landing-context",
      "canonicalId": "azure-0054"
    },
    {
      "id": "adoption-governance",
      "label": "Governance-Verantwortung",
      "questionId": "governance-owner",
      "canonicalId": "azure-0054"
    },
    {
      "id": "adoption-operations",
      "label": "Betriebsmodell und Zuständigkeiten",
      "questionId": "runbooks",
      "canonicalId": "azure-0983"
    },
    {
      "id": "adoption-migration",
      "label": "Migration / Umstellung / Rückfall",
      "questionId": "migration-plan",
      "canonicalId": "azure-1078"
    }
  ]
};
