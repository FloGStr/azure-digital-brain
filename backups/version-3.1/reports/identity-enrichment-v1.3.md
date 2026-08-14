# Azure Digital Brain V1.3 – Identity Enrichment Pilot

Stand: 11. August 2026  
Redaktionsgrundlage: Content Standard V1.0

## Ergebnis

Der zweite Pilot reichert 36 vorhandene Identity-Knoten an. IDs, Reihenfolge, Hierarchie, technische Architektur und alle 33 Networking-Pilotinhalte aus V1.2 bleiben unverändert. Der Pilot ergänzt 108 Erklärungstexte, 36 Szenarien, 35 semantische Beziehungen und 21 offizielle Quellen.

| Kennzahl | V1.2 | V1.3 |
|---|---:|---:|
| Knoten gesamt | 1.058 | 1.058 |
| Hierarchieebenen | 10 | 10 |
| Networking-Pilotknoten | 33 | 33 unverändert |
| neue Identity-Pilotknoten | – | 36 |
| neue Identity-Erklärungstexte | – | 108 |
| Identity-Beispiele | – | 36 |
| Identity-Merksätze | – | 36 |
| bewusst ausgewählte Identity-Analogien | – | 7 |
| Beziehungen gesamt | 56 | 91 |
| neue Identity-Beziehungen | – | 35 |
| Relationstypen gesamt | 26 | 30 |
| neue Relationstypen | – | 4 |
| Quellen gesamt | 28 | 49 |
| neue offizielle Quellen | – | 21 |
| neue oder entfernte Knoten | 0 | 0 |

## Bearbeitete Knoten

### Grundlagen, Anwendungen und Zugriff

| ID | normalisierter Titel |
|---|---|
| azure-0822 | Authentifizierung und Autorisierung |
| azure-0903 | Authentifizierung (AuthN) |
| azure-0904 | Microsoft Entra ID |
| azure-0908 | Single Sign-On (SSO) |
| azure-0909 | Anwendungsverwaltung, App Registration und Service Principal |
| azure-0925 | Microsoft Entra B2B Collaboration |
| azure-0926 | Azure AD B2C (Legacy) und Microsoft Entra External ID |
| azure-0927 | Geräteidentitäten in Microsoft Entra ID |
| azure-0929 | Microsoft-Entra-Lizenzierung |

### Adaptive Sicherheit und privilegierter Zugriff

| ID | normalisierter Titel |
|---|---|
| azure-0046 | Privileged Identity Management (PIM) |
| azure-0910 | Microsoft Entra ID Protection |
| azure-0911 | Identity-Risikodetektionen |
| azure-0912 | Conditional Access |
| azure-0913 | Conditional-Access-Signale |
| azure-0914 | Conditional-Access-Zugriffskontrollen |
| azure-0915 | Risikobasierter Zugriff |
| azure-0916 | Conditional-Access-Policy-Management |
| azure-0928 | Microsoft Entra Multifactor Authentication (MFA) |
| azure-0931 | Global Administrator |
| azure-0959 | Azure Advanced Threat Protection (Legacy) |
| azure-0960 | Microsoft Defender for Identity |

### Tokens und Workload Identity

| ID | normalisierter Titel |
|---|---|
| azure-0917 | Security Tokens |
| azure-0918 | Access Token |
| azure-0919 | Ressourcenzugriff mit Access Token |
| azure-0920 | ID Token |
| azure-0921 | Identitätsclaims im ID Token |
| azure-0922 | Refresh Token |
| azure-0923 | Token-Erneuerung |
| azure-0924 | Token-Signatur und -Validierung |
| azure-0947 | Managed Identity |

### Azure RBAC

| ID | normalisierter Titel |
|---|---|
| azure-0045 | Role-Based Access Control – Grundprinzip |
| azure-0964 | Azure Role-Based Access Control (Azure RBAC) |
| azure-0965 | Role Assignment |
| azure-0966 | Least Privilege |
| azure-0967 | Role Definition |
| azure-0968 | Azure-RBAC-Scope |

Vorherige Titel bleiben als Aliase sowie unter `legacy.original` erhalten. Die Normalisierung korrigiert Tippfehler, satzförmige Titel und historische Produktnamen, ohne IDs oder Elternpositionen zu verändern.

## Neue semantische Beziehungen

### Identity Control Plane

- Authentifizierung `part_of` Authentifizierung und Autorisierung
- SSO `uses` Microsoft Entra ID
- Anwendungsverwaltung `part_of` Microsoft Entra ID
- Anwendungsverwaltung `uses` Security Tokens
- Microsoft Entra ID `issues` Security Tokens
- B2B Collaboration `part_of` Microsoft Entra ID
- Azure AD B2C / External ID `part_of` Microsoft Entra ID
- Geräteidentitäten `part_of` Microsoft Entra ID
- Managed Identity `part_of` Microsoft Entra ID

### Conditional Access und Risiko

- Identity Protection `monitors` Microsoft Entra ID
- Identity Protection `integrates_with` Conditional Access
- Risikodetektionen `part_of` Identity Protection
- Conditional Access `uses` Conditional-Access-Signale
- Zugriffskontrollen `part_of` Conditional Access
- risikobasierter Zugriff `part_of` Conditional Access
- Policy Management `part_of` Conditional Access
- Conditional Access `requires` MFA
- Conditional Access `uses` Geräteidentitäten
- MFA `secures` Authentifizierung

### Tokens

- Access Token `part_of` Security Tokens
- ID Token `part_of` Security Tokens
- Refresh Token `part_of` Security Tokens
- Refresh Token `refreshes` Access Token
- Ressourcenzugriff `uses` Access Token
- Identitätsclaims `part_of` ID Token
- Tokenvalidierung `secures` Security Tokens

### Privilegien, Workloads und Erkennung

- PIM `governs` Global Administrator
- Managed Identity `connects_to` Key Vault
- Azure Advanced Threat Protection `replaced_by` Defender for Identity
- Defender for Identity `monitors` Microsoft Entra ID

### Azure RBAC

- RBAC-Grundprinzip `similar_to` Azure RBAC
- Role Assignment `part_of` Azure RBAC
- Role Assignment `uses` Role Definition
- Role Assignment `uses` RBAC Scope
- Least Privilege `part_of` Azure RBAC

Vier bestehende Identity-Beziehungen (`rel-012`, `rel-013`, `rel-024`, `rel-025`) bleiben mit ihren IDs und ihrer Bedeutung bestehen, wurden aber mit präziseren Erklärungen, offiziellen Quellen und Reviewdatum versehen.

## Erweiterung der Relation Registry

Das vorhandene Register konnte die Tokenbeziehungen nicht präzise ausdrücken. Deshalb wurden genau zwei reziproke Typenpaare ergänzt:

| Typ | Gegenrichtung | Zweck |
|---|---|---|
| `issues` | `issued_by` | Identitätsdienst stellt Token oder Sicherheitsartefakt aus |
| `refreshes` | `refreshed_by` | langlebigeres Artefakt ermöglicht Erneuerung eines Zielartefakts |

Die Erweiterung ist eine kanonische Datenregistrierung, keine Architektur- oder UI-Änderung.

## Quellenbasis

Alle neuen Quellen stammen von Microsoft Learn. Verwendet wurden aktuelle Dokumentationen zu:

- Microsoft Entra und Identity-Grundlagen
- Azure RBAC, Role Assignments, Scope und Least Privilege
- Privileged Identity Management
- Managed Identities
- App Registrations, Application Objects und Service Principals
- Conditional Access, MFA und Identity Protection
- Access-, ID- und Refresh-Tokens
- B2B Collaboration und Microsoft Entra External ID
- Geräteidentitäten
- Microsoft Defender for Identity
- SSO, Entra Roles und Key-Vault-Authentifizierung

Zeitabhängige Produktinformationen wurden mit Stand 11. August 2026 geprüft. Insbesondere ist Azure AD B2C seit 1. Mai 2025 nicht mehr für Neukunden erhältlich; der Pilot kennzeichnet es als Legacy und nennt Microsoft Entra External ID als aktuelle Richtung für neue CIAM-Szenarien.

## Qualitätsprüfung

### Automatisierte Integrität

- 1.058 eindeutige Knoten-IDs und unveränderte Reihenfolge
- exakt unveränderte Eltern-/Kindbeziehungen und weiterhin 10 Ebenen
- 36 Identity-Pilotknoten mit vollständigen drei Erklärungsebenen
- alle Simple-Erklärungen innerhalb der verbindlichen 2–4 Sätze
- jeder Pilotknoten mit `why_important`, realem Beispiel, Merksatz und offizieller Quelle
- nur 7 Analogien; keine erzwungene Vollbelegung
- 91 eindeutige Relations-IDs und keine doppelten semantischen Tripel
- alle 35 Pilotbeziehungen mit Explanation, offizieller Quelle, Status `accepted`, Reviewdatum und Confidence mindestens 0,96
- 30 gültige Relationstypen mit reziproken Gegenrichtungen
- 49 auflösbare Source-IDs; alle 21 neuen Quellen offiziell
- alle 33 Networking-Pilotknoten inhaltlich unverändert
- V1.2-Sicherung für Knoten, Beziehungen, Relationstypen und Quellen rückvergleichbar
- Runtime-Build erfolgreich
- App- und Tool-JavaScript syntaktisch gültig

### Inhaltliches Review

- Authentifizierung und Autorisierung werden konsequent getrennt.
- Azure RBAC und Microsoft Entra Directory Roles werden nicht gleichgesetzt.
- App Registration, Application Object, Enterprise Application und Service Principal werden in ihrer Beziehung erklärt.
- Managed Identity wird als spezielle Workload-Identität ohne eingebettete Credentials beschrieben, nicht als automatische Berechtigung.
- ID-, Access- und Refresh-Tokens besitzen klar getrennte Zwecke.
- Conditional Access setzt Entscheidungen durch; Identity Protection liefert Risikosignale.
- MFA wird als Kombination unabhängiger Faktorkategorien und nicht als beliebige zweite Eingabe beschrieben.
- PIM wird als zeitlich begrenzte Aktivierung privilegierter Rollen und nicht als Ersatz für RBAC beschrieben.
- historische Begriffe Azure ATP und Azure AD B2C sind mit aktuellem Status kenntlich gemacht.

## Offene Scope-Lücken

Die folgenden priorisierten Konzepte existieren im Bestand nicht als eigenständige, geeignete Knoten und wurden deshalb nicht neu erfunden:

- Microsoft Entra Tenant
- User
- Group
- Microsoft Entra Directory Role als allgemeiner Knoten
- Service Principal als eigenständiger Knoten
- App Registration als eigenständiger Knoten
- Workload Identity als Oberbegriff
- Just-in-Time Access als eigenständiger Knoten

App Registration und Service Principal werden im vorhandenen Knoten „Anwendungsverwaltung“ sauber erklärt; Tenant ist Teil der Entra-ID-Erklärungen; Just-in-Time ist Bestandteil von PIM. Für einen langfristig präzisen Graph sollten diese Konzepte in einer separat autorisierten Knoten-Erweiterung eigenständig modelliert werden.

Weitere Altlasten:

1. Zwei RBAC-Äste beschreiben dasselbe Grundkonzept. Sie bleiben wegen der eingefrorenen Hierarchie bestehen und sind nun über `similar_to` verbunden.
2. Azure AD B2C bleibt als historischer Knoten erhalten; eine spätere Migration sollte External ID als eigenen Knoten ergänzen.
3. Azure ATP und Defender for Identity liegen als getrennte Hierarchieknoten vor; die Nachfolgerbeziehung macht dies semantisch sichtbar.
4. Einige fachliche Token-Details liegen weiterhin als tiefe Satzknoten vor. Titel wurden normalisiert, die Hierarchie blieb unangetastet.

## Vergleich Networking und Identity

### 1. Wo funktioniert das Drei-Ebenen-Modell besser?

**Simple:** Networking profitiert stärker von räumlichen Vorstellungen wie VNet, Subnet und Routing. Identity benötigt präzisere Begriffsabgrenzungen; gute Simple-Texte sind dort wichtiger, aber schwieriger.

**Technical:** Identity gewinnt besonders viel. Die Trennung von AuthN/AuthZ, Tokenarten, App Object/Service Principal und Risiko/Policy wird erst durch die technische Ebene zuverlässig verständlich. Networking zeigt auf dieser Ebene vor allem Datenpfad und Protokollschicht.

**Architecture:** Beide Bereiche profitieren stark. Networking beantwortet Topologie, Segmentierung und Datenpfade; Identity beantwortet Trust Boundary, Blast Radius, Privilegien, Tenantbetrieb und Lebenszyklus. Identity erzeugt häufiger organisationsweite Governancefolgen, Networking häufiger konkrete Pfad- und Verfügbarkeitsentscheidungen.

### 2. Welche Beziehungstypen sind besonders wertvoll?

| Networking | Identity |
|---|---|
| `contains` / `part_of` | `part_of` für Policy-, Token- und RBAC-Bestandteile |
| `routes_to` | `uses` für Signale, Tokens, Rollen und Scopes |
| `connects_to` | `governs` für PIM und RBAC |
| `secured_by` / `secures` | `secures` für MFA und Tokenvalidierung |
| `alternative_to` | `integrates_with` für Risiko und Conditional Access |
| – | `issues` und `refreshes` für Tokenlebenszyklen |

In Identity ist die Relationsrichtung noch wichtiger, weil „stellt Token aus“, „verwendet Token“ und „erneuert Token“ fachlich völlig unterschiedliche Aussagen sind.

### 3. Welche Felder bringen den größten Lernnutzen?

1. `description.technical` für die Trennung ähnlich klingender Identitätsobjekte
2. Relationstyp plus Relationserklärung für Kontroll- und Tokenflüsse
3. `description.architecture` für Least Privilege, Tenantrisiko und Betriebsmodell
4. `why_important` für die Sicherheitsfolge eines Konzepts
5. konkrete Beispiele für die Übersetzung abstrakter Policies in reale Entscheidungen
6. offizielle Quellen und Aliase für aktuelle beziehungsweise historische Produktnamen

Analogien helfen in Networking häufiger. In Identity können sie Sicherheitsmechanismen zu stark vereinfachen und wurden deshalb selektiver eingesetzt.

### 4. Welche Inhalte eignen sich für spätere KI-Vorschläge?

Gut geeignet:

- erster Entwurf einer Simple-Erklärung aus registrierten Quellen
- Erkennung veralteter Produktnamen und Tippfehler
- Vorschläge für realistische Beispiele
- Kandidaten für `part_of`, `uses` oder `similar_to`
- Erkennung doppelter Konzepte wie der beiden RBAC-Äste
- Hinweise auf fehlende eigenständige Konzepte

Nur mit strengem menschlichem Review:

- Architecture-Level und Sicherheits-Trade-offs
- neue Relationstypen
- Token-, Authentifizierungs- und Autorisierungslogik
- Lizenz-, Retirement- und Migrationsaussagen
- Hierarchie- oder ID-Änderungen
- automatische Veröffentlichung einer KI-Antwort

## Empfehlungen

1. Den Content Standard V1.0 als Pflichtgrundlage für jeden weiteren Pilot verwenden.
2. Vor einer Massenausweitung die acht fehlenden Identity-Grundknoten in einer eigenen Datenmodellierungsphase genehmigen oder bewusst ablehnen.
3. Mit Lernaufgaben testen: „ID Token oder Access Token?“, „PIM oder RBAC?“, „Identity Protection oder Conditional Access?“ und „Managed Identity oder Service Principal mit Secret?“.
4. Für neue Produktnamen einen regelmäßigen Source-Review etablieren.
5. Als dritten Pilot einen Bereich wählen, der Networking und Identity verbindet, beispielsweise Compute oder Governance.

## Reproduzierbarkeit und Sicherung

Die vollständige V1.2 liegt unter `backups/version-1.2/`. Die Identity-Anreicherung kann mit `node tools/enrich-identity-v1.3.mjs` reproduziert und anschließend mit `node tools/build-runtime.mjs` validiert werden. Der Build liest ausschließlich `data/canonical/` und schreibt ausschließlich `data/runtime/`; die technische Architektur bleibt unverändert.
