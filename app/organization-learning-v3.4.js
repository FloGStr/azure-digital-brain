// Existing canonical IDs, ordered for the six-chapter Demo Learning revision.
window.ADB_ORGANIZATION_LEARNING_V34 = {
  "id": "azure-organisieren",
  "title": "Azure organisieren",
  "steps": [
    {
      "id": "resource-group",
      "title": "Ressourcen einer Anwendung zusammenhalten",
      "question": "Wohin gehören die Ressourcen unserer Anwendung?",
      "problem": "In Kapitel 2 haben wir Azure-Ressourcen für unsere Anwendung angefordert. Wenn weitere Ressourcen hinzukommen, brauchen wir eine nachvollziehbare Zuordnung.",
      "why": "Zusammengehörige Ressourcen sollen als Einheit auffindbar und verwaltbar sein, ohne dass ihre technische Kommunikation davon abhängt.",
      "solution": "Eine Resource Group ist ein logischer Container für zusammengehörige Azure-Ressourcen. Unsere Anwendung und ihre Daten bekommen damit einen gemeinsamen organisatorischen Platz. In unserer Resource Group halten wir App Service, die SQL-Datenbank und den Storage Account der Anwendung zusammen.",
      "visualLabel": "Neu: Resource Group als logischer Container",
      "conceptIds": [
        "azure-0277",
        "azure-0284"
      ]
    },
    {
      "id": "subscription",
      "title": "Ein übergeordneter Verwaltungsrahmen",
      "question": "In welchem größeren Rahmen liegt unsere Resource Group?",
      "problem": "Unser Unternehmen möchte die Produktion seiner Anwendung verwalten und Kosten sowie Zuständigkeiten nachvollziehbar abgrenzen.",
      "why": "Eine Resource Group ordnet zusammengehörige Ressourcen; darüber kann eine Subscription den Verwaltungsrahmen bilden.",
      "solution": "Eine Azure Subscription ist ein übergeordneter Verwaltungs- und oft Abrechnungsbereich. Sie enthält Resource Groups und damit Ressourcen. Unser Unternehmen nutzt in diesem Beispiel eine eigene Subscription für Produktion.",
      "visualLabel": "Neu: Subscription enthält Resource Groups",
      "conceptIds": [
        "azure-1011",
        "azure-0277"
      ]
    },
    {
      "id": "management-group",
      "title": "Mehrere Umgebungen gemeinsam ordnen",
      "question": "Wie ordnen wir Produktion und Test gemeinsam?",
      "problem": "Zur Produktion kommt eine Testumgebung derselben Anwendung. Unser Unternehmen entscheidet sich im Beispiel für getrennte Subscriptions.",
      "why": "Subscriptions können Umgebungen, organisatorische Bereiche oder andere Verwaltungsgrenzen trennen. Für gemeinsame Vorgaben hilft eine übergeordnete Struktur.",
      "solution": "Management Groups können mehrere Subscriptions hierarchisch zusammenfassen. In unserem Beispiel liegen Produktion und Test als getrennte Subscriptions darunter; jede enthält ihre eigenen Resource Groups.",
      "visualLabel": "Neu: Management Group über mehreren Subscriptions",
      "conceptIds": [
        "azure-1022",
        "azure-1011",
        "azure-0277"
      ]
    },
    {
      "id": "scopes",
      "title": "Zugriff und Regeln am passenden Bereich",
      "question": "Wo legen wir fest, wer etwas darf und welche Vorgaben gelten?",
      "problem": "Die Teams für Produktion und Test brauchen passende Rechte. Gleichzeitig sollen gemeinsame Organisationsregeln gelten.",
      "why": "Eine Vorgabe auf höherer Ebene kann darunterliegende Bereiche erreichen; eine gezielte Zuweisung kann enger begrenzt werden.",
      "solution": "Der Scope ist der Geltungsbereich einer Zuweisung. Wer darf dort welche Aktionen ausführen? Das regelt Azure Role-Based Access Control (RBAC), das Berechtigungsmodell für Azure-Ressourcen. Azure Policy prüft dort gemeinsame Ressourcenvorgaben.",
      "visualLabel": "Neu: Scopes für Zugriff und Regeln",
      "conceptIds": [
        "azure-1022",
        "azure-1011",
        "azure-0277",
        "azure-0964",
        "azure-0962"
      ]
    },
    {
      "id": "overview",
      "title": "Die Azure-Organisation als Ganzes",
      "question": "Wo steht jetzt jede Ressource unserer Anwendung?",
      "problem": "Unsere Anwendung hat Ressourcen in Produktion und Test. In unserem Beispiel liegen diese Umgebungen in getrennten Subscriptions desselben Unternehmens.",
      "why": "Erst die ganze Struktur zeigt, wo Ressourcen liegen und auf welcher Ebene Zuständigkeiten oder Vorgaben ansetzen.",
      "solution": "Management Group → Subscription → Resource Group → Ressource: So lässt sich die Anwendung strukturell einordnen. Rechte und Regeln wirken an passenden Scopes. Als Nächstes fragen wir, wie Menschen und Anwendungen sicher auf die Umgebung zugreifen.",
      "visualLabel": "Das Organisationsbild als Ganzes",
      "overview": true,
      "conceptIds": [
        "azure-1022",
        "azure-1011",
        "azure-0277",
        "azure-0964",
        "azure-0962"
      ]
    }
  ]
};
