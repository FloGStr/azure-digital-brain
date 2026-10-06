// Existing canonical IDs, ordered for the six-chapter Demo Learning revision.
window.ADB_ACCESS_LEARNING_V34 = {
  "id": "zugriff-verstehen",
  "title": "Zugriff verstehen",
  "steps": [
    {
      "id": "actors",
      "title": "Wer möchte auf unsere Umgebung zugreifen?",
      "question": "Woher weiß Azure, wer oder was Zugriff möchte?",
      "problem": "Die Azure-Umgebung unserer Anwendung ist organisiert. Jetzt möchten Mitarbeiter, Administratoren und die Anwendung selbst mit Ressourcen arbeiten.",
      "why": "Eine Resource Group zeigt, wo Ressourcen liegen. Sie beantwortet noch nicht, wer darauf zugreifen möchte.",
      "solution": "Vor jedem Zugriff steht ein Akteur: ein Mensch oder eine Anwendung. Im nächsten Schritt braucht dieser Akteur eine digitale Identität.",
      "visualLabel": "Neu: Akteure möchten zugreifen",
      "conceptIds": [
        "azure-0904",
        "azure-0277"
      ]
    },
    {
      "id": "identity",
      "title": "Eine Identität für den Zugriff",
      "question": "Welche digitale Identität steckt hinter dem Zugriff?",
      "problem": "Ein Name allein sagt Azure noch nicht, welcher Mensch oder welche Anwendung tatsächlich anfragt.",
      "why": "Zugriffe müssen einer digitalen Identität zugeordnet werden können.",
      "solution": "Microsoft Entra ID ist die Identitätsbasis: Benutzerkonten repräsentieren Mitarbeiter, Gruppen bündeln ein Team. Unsere Azure-Anwendung kann eine Managed Identity erhalten: eine verwaltete Identität ohne Passwort im Anwendungscode.",
      "visualLabel": "Neu: Identität in Microsoft Entra ID",
      "conceptIds": [
        "azure-0904",
        "azure-1068",
        "azure-0947"
      ]
    },
    {
      "id": "authentication",
      "title": "Wer bist du?",
      "question": "Wie wird eine behauptete Identität überprüft?",
      "problem": "Ein Mitarbeiter gibt an, zu unserem Unternehmen zu gehören. Azure muss diese Behauptung prüfen.",
      "why": "Eine vorhandene Identität ist noch kein Nachweis, dass die anfragende Person wirklich dahintersteht.",
      "solution": "Authentifizierung prüft: Wer bist du? Ein zusätzlicher Nachweis heißt Multi-Factor Authentication (MFA). Conditional Access, also bedingter Zugriff, kann etwa MFA oder ein verwaltetes Gerät verlangen. Azure-Ressourcenrechte sind eine getrennte Prüfung.",
      "visualLabel": "Neu: Authentifizierung prüft die Identität",
      "conceptIds": [
        "azure-0903",
        "azure-0904",
        "azure-0928",
        "azure-0822",
        "azure-0912"
      ]
    },
    {
      "id": "authorization",
      "title": "Was darfst du?",
      "question": "Was folgt nach einer erfolgreichen Anmeldung?",
      "problem": "Unser Mitarbeiter ist angemeldet. Trotzdem soll er eine Ressource vielleicht nur ansehen, aber nicht verändern.",
      "why": "Eine bestätigte Identität bedeutet nicht, dass jede Aktion erlaubt ist.",
      "solution": "Azure RBAC ist das Autorisierungssystem für Azure-Ressourcen. Eine Rolle beschreibt erlaubte Aktionen: In unserem Beispiel ist Ansehen erlaubt, Ändern nicht.",
      "visualLabel": "Neu: Autorisierung mit Azure RBAC",
      "conceptIds": [
        "azure-0822",
        "azure-0964",
        "azure-0967"
      ]
    },
    {
      "id": "scope",
      "title": "Wo darfst du es?",
      "question": "Für welchen Bereich gilt die Berechtigung?",
      "problem": "Der Mitarbeiter soll die Ressourcen unserer Anwendung ansehen, aber nicht automatisch alle Ressourcen des Unternehmens.",
      "why": "Die Rolle beantwortet, welche Aktionen erlaubt sind. Der Scope beantwortet, wo die Zuweisung gilt.",
      "solution": "Ein Role Assignment verbindet eine Identität mit einer Rolle an einem bestimmten Scope. In unserem Beispiel ist das die Resource Group der Unternehmensanwendung: Dort und darunter kann die zugewiesene Rolle wirken. Least Privilege heißt: nur so viele Rechte wie nötig – nur dort und so lange wie nötig.",
      "visualLabel": "Neu: Rolle + Scope bestimmen die Reichweite",
      "conceptIds": [
        "azure-0964",
        "azure-0965",
        "azure-0967",
        "azure-0968",
        "azure-0277",
        "azure-0966"
      ]
    },
    {
      "id": "overview",
      "title": "Sicherer Zugriff als Gesamtbild",
      "question": "Wie kommt ein Akteur zu einer wirksamen Berechtigung?",
      "problem": "Menschen und Anwendungen wollen mit den organisierten Azure-Ressourcen arbeiten.",
      "why": "Identität, Anmeldung und Berechtigung beantworten unterschiedliche Fragen und gehören erst zusammen als verständlicher Zugriffspfad.",
      "solution": "Menschen und Anwendungen greifen mit einer digitalen Identität zu. Die Authentifizierung prüft diese Identität; eine Managed Identity nutzt dafür keine interaktive Mitarbeiter-Anmeldung. Azure RBAC gewährt passende Rechte über eine Rolle am gewählten Scope. So wird der Zugriff auf eine Zielressource möglich.",
      "visualLabel": "Der Zugriff als Ganzes",
      "overview": true,
      "conceptIds": [
        "azure-0904",
        "azure-0903",
        "azure-0822",
        "azure-0964",
        "azure-0965",
        "azure-0968",
        "azure-0277",
        "azure-0351",
        "azure-0947",
        "azure-0944",
        "azure-0945"
      ]
    }
  ]
};
