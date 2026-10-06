// Existing canonical IDs, ordered for the six-chapter Demo Learning revision.
window.ADB_GOVERNANCE_LEARNING_V34 = {
  "id": "azure-steuern-und-schuetzen",
  "title": "Azure steuern und schützen",
  "steps": [
    {
      "id": "permission-and-rules",
      "title": "Berechtigt heißt noch nicht regelkonform",
      "question": "Reicht die Berechtigung zum Bereitstellen einer Ressource aus?",
      "problem": "Unser Mitarbeiter ist angemeldet und darf in der Resource Group der Anwendung eine Ressource bereitstellen.",
      "why": "Azure RBAC klärt, wer was und wo tun darf. Die mögliche Konfiguration der neuen Ressource muss deshalb noch nicht den Unternehmensvorgaben entsprechen.",
      "solution": "Unser Beispielunternehmen braucht zusätzlich gemeinsame Vorgaben für Ressourcen. Wie diese Vorgaben systematisch angewendet werden, klären wir als Nächstes.",
      "visualLabel": "Neu: Bedarf nach gemeinsamen Vorgaben",
      "conceptIds": [
        "azure-0904",
        "azure-0964",
        "azure-0965",
        "azure-0277"
      ]
    },
    {
      "id": "azure-policy",
      "title": "Gemeinsame Regeln festlegen",
      "question": "Wie prüfen wir Ressourcenkonfigurationen gegen gemeinsame Vorgaben?",
      "problem": "Ein berechtigter Mitarbeiter könnte eine Ressource in einer Konfiguration erstellen, die nicht zum vereinbarten Standard passt.",
      "why": "Eine dokumentierte Vorgabe allein macht Abweichungen bei vielen Ressourcen noch nicht zuverlässig sichtbar.",
      "solution": "Azure Policy bewertet Azure-Ressourcen gegen organisatorische Regeln. Je nach Policy-Wirkung können Abweichungen gemeldet, blockiert oder korrigiert werden. Unser einfaches Beispiel ist eine Vorgabe für zulässige Azure-Regionen.",
      "visualLabel": "Neu: Azure Policy bewertet Vorgaben",
      "conceptIds": [
        "azure-0962",
        "azure-0963",
        "azure-0042"
      ]
    },
    {
      "id": "policy-scope",
      "title": "Wo sollen die Regeln gelten?",
      "question": "Wo wenden wir die Vorgabe unseres Unternehmens an?",
      "problem": "Die Regionsvorgabe soll in unserem Beispiel für die Produktionsanwendung gelten. Sie soll nicht unbemerkt an einem zu breiten oder zu engen Bereich hängen.",
      "why": "Die Policy-Definition beschreibt Bedingung und Wirkung. Erst eine Policy-Zuweisung (Assignment) bindet sie an einen Scope der bekannten Azure-Hierarchie.",
      "solution": "Unser Beispielunternehmen weist die Regionsvorgabe der Produktions-Subscription zu. Damit gilt sie grundsätzlich auch für darunterliegende Resource Groups und Ressourcen. Andere Scopes sind je nach Vorgabe möglich.",
      "visualLabel": "Neu: Policy-Zuweisung bestimmt den Scope",
      "conceptIds": [
        "azure-0962",
        "azure-0038",
        "azure-1022",
        "azure-1011",
        "azure-0277"
      ]
    },
    {
      "id": "tags",
      "title": "Ressourcen sinnvoll kennzeichnen",
      "question": "Wie ordnen wir die Ressourcen später einer Umgebung und Kostenstelle zu?",
      "problem": "Die Ressource ist bereitgestellt. Für Inventar und Kostenanalyse möchten wir sie nachvollziehbar zuordnen.",
      "why": "Die Verwaltungshierarchie allein sagt nicht jede organisatorische Eigenschaft einer einzelnen Ressource aus.",
      "solution": "Azure Resource Tags sind Schlüssel-Wert-Metadaten. Zum Beispiel kennzeichnet Environment=Production unsere Ressource; CostCenter kann eine Kostenstelle benennen. Tags helfen bei Zuordnung und Analyse, sind aber keine Sicherheitsgrenze. Microsoft Cost Management wertet verfügbare Kostendaten nach diesen Zuordnungen aus. Cost Analysis zeigt die Kosten; ein Budget mit Kostenwarnung informiert bei Schwellen, stoppt aber keine Ressourcen.",
      "visualLabel": "Neu: Tags kennzeichnen Ressourcen",
      "conceptIds": [
        "azure-0980",
        "azure-0981",
        "azure-1034",
        "azure-1072",
        "azure-0033"
      ]
    },
    {
      "id": "resource-locks",
      "title": "Wichtige Ressourcen vor Versehen schützen",
      "question": "Wie vermeiden wir versehentliches Löschen einer wichtigen Ressource?",
      "problem": "Auch ein berechtigter Administrator kann eine produktive Ressource versehentlich löschen.",
      "why": "RBAC gewährt eine Berechtigung; Policy prüft Vorgaben. Beides ersetzt keinen zusätzlichen Schutz vor bestimmten versehentlichen Verwaltungsaktionen.",
      "solution": "Ein Azure Resource Lock kann eine wichtige Ressource zusätzlich schützen. CanNotDelete verhindert das Löschen der geschützten Ressource; ReadOnly verhindert auch Änderungen über die Azure-Verwaltungsebene. Locks ersetzen weder RBAC noch Azure Policy.",
      "visualLabel": "Neu: Resource Lock schützt die wichtige Ressource",
      "conceptIds": [
        "azure-0970",
        "azure-0964",
        "azure-0962"
      ]
    },
    {
      "id": "overview",
      "title": "Azure Governance als Gesamtbild",
      "question": "Wie wirken Organisation, Zugriff, Vorgaben, Kennzeichnung und Schutz zusammen?",
      "problem": "Unsere Anwendung benötigt mehr als eine sinnvolle Struktur und passende Zugriffsrechte.",
      "why": "Jeder Mechanismus beantwortet eine andere Frage. Zusammen entsteht ein nachvollziehbar geführter Betrieb der Azure-Umgebung.",
      "solution": "Management Groups, Subscriptions und Resource Groups organisieren. Entra ID und Azure RBAC regeln Identität und Zugriff. Azure Policy bewertet Vorgaben am gewählten Scope, Tags kennzeichnen Ressourcen und Resource Locks schützen wichtige Ressourcen vor bestimmten Verwaltungsaktionen. Dieses Zusammenspiel ist Azure Governance – kein einzelner Azure-Dienst. Die Kennzeichnungen helfen auch bei Kostenkontrolle: Kosten auswerten, einen Budgetrahmen setzen und bei Schwellen das Team informieren.",
      "visualLabel": "Das Zusammenspiel als Ganzes",
      "overview": true,
      "conceptIds": [
        "azure-0961",
        "azure-1022",
        "azure-1011",
        "azure-0277",
        "azure-0904",
        "azure-0964",
        "azure-0962",
        "azure-0980",
        "azure-0970",
        "azure-1034",
        "azure-1072",
        "azure-0033"
      ]
    }
  ]
};
