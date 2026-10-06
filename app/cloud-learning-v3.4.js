// Existing canonical IDs, ordered for the six-chapter Demo Learning revision.
window.ADB_CLOUD_LEARNING_V34 = {
  "id": "cloud-verstehen",
  "title": "Cloud verstehen",
  "steps": [
    {
      "id": "own-infrastructure",
      "title": "Eine Anwendung selbst betreiben",
      "question": "Was passiert, wenn unsere Anwendung mehr oder weniger genutzt wird?",
      "problem": "Unser Unternehmen betreibt eine Anwendung auf eigenen Servern. Mal kommen wenige, mal viele Nutzer.",
      "why": "Für Spitzen brauchen wir genug Kapazität. Kaufen wir sie dauerhaft, steht ein Teil oft ungenutzt bereit; Beschaffung und Betrieb bleiben bei uns.",
      "solution": "Wir beginnen mit diesem festen Ausgangsbild: Anwendung, eigene Server und schwankender Bedarf.",
      "focus": "owned",
      "visualLabel": "Eigene Server · feste Kapazität"
    },
    {
      "id": "cloud-computing",
      "title": "IT-Leistung bei Bedarf beziehen",
      "question": "Wie kommen wir bei wachsendem Bedarf schneller zu Kapazität?",
      "problem": "Die Anwendung benötigt zeitweise mehr Rechenleistung. Neue eigene Server brauchen Planung, Kauf und Einrichtung.",
      "why": "Die benötigte Kapazität soll verfügbar sein, ohne für jede Last zuerst Hardware aufzubauen.",
      "solution": "Cloud Computing stellt Ressourcen der Informationstechnologie (IT) über ein Netz bei Bedarf bereit. Unsere Anwendung kann statt eigener Server solche Ressourcen nutzen.",
      "focus": "cloud",
      "visualLabel": "Neu: Ressourcen bei Bedarf",
      "conceptIds": [
        "azure-1101"
      ]
    },
    {
      "id": "consumption",
      "title": "Kapazität passend nutzen",
      "question": "Was ändert sich, wenn der Bedarf wieder sinkt?",
      "problem": "Nach einer Nutzungsspitze braucht unsere Anwendung weniger Kapazität. Dauerhaft gekaufte Server bleiben trotzdem vorhanden.",
      "why": "Wir möchten Ressourcen an den Bedarf anpassen und Kosten anhand der tatsächlichen Nutzung verstehen.",
      "solution": "Wir können die Kapazität verändern: eine Ressource größer machen oder mehr Instanzen nutzen. Elastizität lässt die Kapazität dynamisch dem tatsächlichen Bedarf folgen. Das hilft, nicht dauerhaft mehr zu bezahlen als benötigt.",
      "focus": "capacity",
      "visualLabel": "Neu: Kapazität anpassen",
      "conceptIds": [
        "azure-0137",
        "azure-0014",
        "azure-0015",
        "azure-0020",
        "azure-0066",
        "azure-0128",
        "azure-0132",
        "azure-1073"
      ]
    },
    {
      "id": "deployment",
      "title": "Wo wird die Cloud bereitgestellt?",
      "question": "Muss jede Cloud-Umgebung am selben Ort und für dieselben Kunden laufen?",
      "problem": "Ein Teil unserer Umgebung soll vielleicht in einer dedizierten Umgebung bleiben, während andere Ressourcen beim Cloud-Anbieter laufen.",
      "why": "Wo und durch wen Infrastruktur bereitgestellt wird, ist eine eigene Entscheidung.",
      "solution": "Public, Private und Hybrid Cloud beschreiben diese Bereitstellung. Hybrid verbindet private oder lokale Infrastruktur mit Public Cloud.",
      "focus": "deployment",
      "visualLabel": "Neu: Ort und Bereitstellung",
      "conceptIds": [
        "azure-0151",
        "azure-0152",
        "azure-0165",
        "azure-0178"
      ]
    },
    {
      "id": "service-models",
      "title": "Wie viel betreiben wir selbst?",
      "question": "Wer kümmert sich um Betriebssystem, Plattform und Anwendung?",
      "problem": "Auch wenn unsere Anwendung Cloud-Ressourcen nutzt, müssen Aufgaben für ihre technischen Schichten verteilt werden.",
      "why": "Nicht jedes Angebot nimmt unserem Team gleich viel Betriebsarbeit ab.",
      "solution": "Wie viel Betriebsarbeit übernehmen wir selbst? Infrastructure as a Service (IaaS) liefert die Basis; Platform as a Service (PaaS) eine verwaltete Plattform; Software as a Service (SaaS) eine fertige Anwendung. Das Bild vergleicht dieselben Schichten.",
      "focus": "service",
      "visualLabel": "Neu: Wer betreibt welche Schicht?",
      "conceptIds": [
        "azure-0197",
        "azure-0198",
        "azure-0209",
        "azure-0220"
      ]
    },
    {
      "id": "responsibility",
      "title": "Verantwortung bleibt geteilt",
      "question": "Übernimmt der Anbieter nun alles?",
      "problem": "Je nach Servicemodell betreibt der Anbieter mehr Schichten. Unsere Anwendung und ihre Nutzer brauchen dennoch passende Zugriffe und Schutz.",
      "why": "Mehr verwaltete Technik bedeutet nicht, dass unsere Verantwortung für eigene Daten, Konten und Entscheidungen verschwindet.",
      "solution": "Das Shared Responsibility Model ordnet Aufgaben zwischen Anbieter und Kunde zu. Die Grenze verschiebt sich mit IaaS, PaaS und SaaS.",
      "focus": "responsibility",
      "visualLabel": "Neu: Aufgaben bleiben auf beiden Seiten",
      "conceptIds": [
        "azure-0229"
      ]
    },
    {
      "id": "azure-bridge",
      "title": "Cloud verstehen – Azure einordnen",
      "question": "Wo steht Microsoft Azure in diesem Bild?",
      "problem": "Wir kennen jetzt den Bedarf, Cloud-Ressourcen und die Entscheidungen zu Bereitstellung, Servicemodell und Verantwortung.",
      "why": "Für die nächste Frage brauchen wir eine konkrete Plattform, auf der solche Angebote bereitgestellt werden.",
      "solution": "Microsoft Azure ist eine solche Cloud-Plattform. Als Nächstes betrachten wir Azure selbst; seine einzelnen Dienste und Strukturen folgen später.",
      "focus": "overview",
      "visualLabel": "Das Grundprinzip als Ganzes",
      "overview": true,
      "conceptIds": [
        "azure-1101"
      ]
    }
  ],
  "deployment": [
    {
      "id": "azure-0152",
      "name": "Public Cloud",
      "picture": "Anbieter → viele Kunden",
      "note": "Beim Cloud-Anbieter"
    },
    {
      "id": "azure-0165",
      "name": "Private Cloud",
      "picture": "dedizierte Umgebung",
      "note": "Für eine Organisation"
    },
    {
      "id": "azure-0178",
      "name": "Hybrid Cloud",
      "picture": "Privat ↔ Public",
      "note": "Beide verbunden"
    }
  ],
  "serviceModels": [
    {
      "id": "azure-0198",
      "short": "IaaS",
      "title": "Infrastructure as a Service (IaaS)",
      "responsibility": [
        "Anbieter",
        "Kunde",
        "Kunde",
        "Kunde"
      ]
    },
    {
      "id": "azure-0209",
      "short": "PaaS",
      "title": "Platform as a Service (PaaS)",
      "responsibility": [
        "Anbieter",
        "Anbieter",
        "Kunde",
        "Kunde"
      ]
    },
    {
      "id": "azure-0220",
      "short": "SaaS",
      "title": "Software as a Service (SaaS)",
      "responsibility": [
        "Anbieter",
        "Anbieter",
        "Anbieter",
        "Kunde"
      ]
    }
  ],
  "serviceLayers": [
    "Hardware & Basis",
    "Betriebssystem & Laufzeit",
    "Anwendung",
    "Eigene Daten & Zugriffe"
  ]
};
