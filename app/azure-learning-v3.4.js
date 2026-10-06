// Existing canonical IDs, ordered for the six-chapter Demo Learning revision.
window.ADB_AZURE_LEARNING_V34 = {
  "id": "azure-verstehen",
  "title": "Azure verstehen",
  "steps": [
    {
      "id": "platform",
      "title": "Aus Cloud wird eine konkrete Plattform",
      "question": "Wer stellt Cloud-Dienste für unser Unternehmen konkret bereit?",
      "problem": "Wir wissen, warum unsere Anwendung Cloud-Ressourcen nutzen könnte. „Cloud“ allein benennt aber noch keinen Anbieter.",
      "why": "Wir brauchen eine konkrete Plattform, bei der wir Ressourcen anfordern und betreiben können.",
      "solution": "Microsoft Azure ist die Cloud-Plattform von Microsoft. Sie setzt das allgemeine Cloud-Prinzip in konkrete Dienste und Ressourcen um.",
      "visualLabel": "Neu: Microsoft Azure als Plattform",
      "conceptIds": [
        "azure-1101",
        "azure-1100"
      ]
    },
    {
      "id": "resource-types",
      "title": "Eine Plattform – viele Arten von IT-Ressourcen",
      "question": "Welche Aufgaben unserer Anwendung soll Azure übernehmen?",
      "problem": "Unsere Anwendung braucht mehr als Rechenleistung: Sie verarbeitet Daten, kommuniziert und muss betrieben und geschützt werden.",
      "why": "Eine Plattform muss verschiedene Aufgaben abdecken, damit daraus eine nutzbare Umgebung entstehen kann.",
      "solution": "Für unsere Webanwendung übernimmt App Service die Webplattform. Azure SQL Database speichert strukturierte Daten; Blob Storage im Storage Account unsere Dateien. Andere Ausführungsformen zeigen wir an derselben Aufgabe – einzeln aufklappbar.",
      "visualLabel": "Neu: unterschiedliche IT-Bausteine",
      "conceptIds": [
        "azure-0351",
        "azure-0322",
        "azure-0567",
        "azure-0413",
        "azure-1062",
        "azure-0772",
        "azure-0771",
        "azure-0731",
        "azure-0579",
        "azure-0571"
      ]
    },
    {
      "id": "physical",
      "title": "Die Cloud ist trotzdem physisch",
      "question": "Wo laufen diese Ressourcen tatsächlich?",
      "problem": "„Cloud“ kann so klingen, als hätten Anwendungen und Daten keinen physischen Ort.",
      "why": "Unsere Ressourcen benötigen reale Infrastruktur. Ihr Standort kann für die Anwendung und ihre Daten wichtig sein.",
      "solution": "Auch App Service, SQL und Storage benötigen reale Computer, Datenträger und Netzwerke in Azure-Rechenzentren. Cloud-Ressourcen machen diese Infrastruktur nutzbar; sie machen sie nicht unphysisch.",
      "visualLabel": "Neu: reale Infrastruktur an geografischen Standorten",
      "conceptIds": [
        "azure-1100"
      ]
    },
    {
      "id": "regions-zones",
      "title": "Regionen und Zonen unterscheiden",
      "question": "Ist jeder Azure-Standort dasselbe?",
      "problem": "Eine global verteilte Plattform braucht benannte Bereiche, in denen Ressourcen bereitgestellt werden.",
      "why": "Wir müssen verstehen, welcher Bereich ein geografischer Standort ist und was innerhalb dieses Bereichs getrennt sein kann.",
      "solution": "Eine Region ist ein geografischer Azure-Bereich. Availability Zones trennen darin Infrastruktur. Eine geeignete Architektur kann beim Ausfall einer Zone über eine andere weiterarbeiten: High Availability, also hohe Verfügbarkeit.",
      "visualLabel": "Neu: Region enthält optionale Zonen",
      "conceptIds": [
        "azure-0237",
        "azure-0007",
        "azure-0003"
      ]
    },
    {
      "id": "management",
      "title": "Wie arbeiten wir mit Azure?",
      "question": "Wie teilen wir Azure mit, welche Ressource wir benötigen?",
      "problem": "Unser Team möchte eine Ressource bereitstellen oder ändern. Dafür braucht es einen Steuerungsweg zur Plattform.",
      "why": "Es gibt mehrere Zugangswege zu Azure. Dahinter liegt eine gemeinsame Ebene, über die Ressourcen bereitgestellt und verwaltet werden.",
      "solution": "Wir fordern Ressourcen über eine Oberfläche, Befehle oder eine Programmschnittstelle an. Die gemeinsame Verwaltungsebene heißt Azure Resource Manager (ARM). Statt Einzelklicks lässt sich der gewünschte Zustand als Code beschreiben: Infrastructure as Code (IaC).",
      "visualLabel": "Neu: Wege zur Ressourcenverwaltung",
      "conceptIds": [
        "azure-0284",
        "azure-0810",
        "azure-0809",
        "azure-0301"
      ]
    },
    {
      "id": "overview",
      "title": "Azure als Plattform verstehen",
      "question": "Welche Frage entsteht, wenn wir immer mehr Ressourcen nutzen?",
      "problem": "Aus unserer Anwendung können mehrere Azure-Ressourcen an verschiedenen Standorten und über verschiedene Zugangswege entstehen.",
      "why": "Wir können jetzt Plattform, Dienste, physische Orte und Steuerung auseinanderhalten.",
      "solution": "Microsoft Azure verbindet diese Bausteine als Cloud-Plattform. Als Nächstes fragen wir, wie viele Ressourcen, Teams und Umgebungen geordnet werden.",
      "visualLabel": "Das Plattformbild als Ganzes",
      "overview": true,
      "conceptIds": [
        "azure-1100",
        "azure-1032"
      ]
    }
  ]
};
