import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const canonical = path.join(project, 'data/canonical');
const today = '2026-08-11';
const read = name => JSON.parse(fs.readFileSync(path.join(canonical, name), 'utf8'));
const write = (name, value) => fs.writeFileSync(path.join(canonical, name), `${JSON.stringify(value, null, 2)}\n`);

const nodesDocument = read('nodes.json');
const relationsDocument = read('relations.json');
const sourcesDocument = read('sources.json');
const typesDocument = read('relation-types.json');
const nodeById = new Map(nodesDocument.nodes.map(node => [node.id, node]));

const officialSources = [
  {id:'ms-entra-overview',title:'What is Microsoft Entra?',url:'https://learn.microsoft.com/en-us/entra/fundamentals/what-is-entra',publisher:'Microsoft Learn',accessed_at:today,type:'official'},
  {id:'ms-identity-fundamentals',title:'Identity and access management fundamental concepts',url:'https://learn.microsoft.com/en-us/entra/fundamentals/identity-fundamental-concepts',publisher:'Microsoft Learn',accessed_at:today,type:'official'},
  {id:'ms-role-assignments',title:'Understand Azure role assignments',url:'https://learn.microsoft.com/en-us/azure/role-based-access-control/role-assignments',publisher:'Microsoft Learn',accessed_at:today,type:'official'},
  {id:'ms-role-assignment-steps',title:'Steps to assign an Azure role',url:'https://learn.microsoft.com/en-us/azure/role-based-access-control/role-assignments-steps',publisher:'Microsoft Learn',accessed_at:today,type:'official'},
  {id:'ms-pim',title:'What is Microsoft Entra Privileged Identity Management?',url:'https://learn.microsoft.com/en-us/entra/id-governance/privileged-identity-management/pim-configure',publisher:'Microsoft Learn',accessed_at:today,type:'official'},
  {id:'ms-managed-identities',title:'Managed identities for Azure resources',url:'https://learn.microsoft.com/en-us/entra/identity/managed-identities-azure-resources/',publisher:'Microsoft Learn',accessed_at:today,type:'official'},
  {id:'ms-app-objects',title:'Application and service principal objects in Microsoft Entra ID',url:'https://learn.microsoft.com/en-us/entra/identity-platform/app-objects-and-service-principals',publisher:'Microsoft Learn',accessed_at:today,type:'official'},
  {id:'ms-app-management',title:'What is application management in Microsoft Entra ID?',url:'https://learn.microsoft.com/en-us/entra/identity/enterprise-apps/what-is-application-management',publisher:'Microsoft Learn',accessed_at:today,type:'official'},
  {id:'ms-conditional-access',title:'What is Conditional Access?',url:'https://learn.microsoft.com/en-us/azure/active-directory/conditional-access/overview',publisher:'Microsoft Learn',accessed_at:today,type:'official'},
  {id:'ms-mfa',title:'Microsoft Entra multifactor authentication overview',url:'https://learn.microsoft.com/en-us/entra/identity/authentication/concept-mfa-howitworks',publisher:'Microsoft Learn',accessed_at:today,type:'official'},
  {id:'ms-id-protection',title:'What is Microsoft Entra ID Protection?',url:'https://learn.microsoft.com/en-us/entra/id-protection/overview-identity-protection',publisher:'Microsoft Learn',accessed_at:today,type:'official'},
  {id:'ms-access-tokens',title:'Access tokens in the Microsoft identity platform',url:'https://learn.microsoft.com/en-us/entra/identity-platform/access-tokens',publisher:'Microsoft Learn',accessed_at:today,type:'official'},
  {id:'ms-id-tokens',title:'OpenID Connect on the Microsoft identity platform',url:'https://learn.microsoft.com/en-us/entra/identity-platform/v2-protocols-oidc',publisher:'Microsoft Learn',accessed_at:today,type:'official'},
  {id:'ms-refresh-tokens',title:'Refresh tokens in the Microsoft identity platform',url:'https://learn.microsoft.com/en-us/entra/identity-platform/refresh-tokens',publisher:'Microsoft Learn',accessed_at:today,type:'official'},
  {id:'ms-b2b',title:'What is Microsoft Entra B2B collaboration?',url:'https://learn.microsoft.com/en-us/entra/external-id/what-is-b2b',publisher:'Microsoft Learn',accessed_at:today,type:'official'},
  {id:'ms-external-id',title:'Introduction to Microsoft Entra External ID',url:'https://learn.microsoft.com/en-us/entra/external-id/external-identities-overview',publisher:'Microsoft Learn',accessed_at:today,type:'official'},
  {id:'ms-device-identity',title:'What is a device identity?',url:'https://learn.microsoft.com/en-us/entra/identity/devices/overview',publisher:'Microsoft Learn',accessed_at:today,type:'official'},
  {id:'ms-defender-identity',title:'Microsoft Defender for Identity overview',url:'https://learn.microsoft.com/en-us/defender-for-identity/what-is',publisher:'Microsoft Learn',accessed_at:today,type:'official'},
  {id:'ms-sso',title:'Plan a single sign-on deployment',url:'https://learn.microsoft.com/en-us/entra/identity/enterprise-apps/plan-sso-deployment',publisher:'Microsoft Learn',accessed_at:today,type:'official'},
  {id:'ms-entra-rbac',title:'Microsoft Entra RBAC documentation',url:'https://learn.microsoft.com/en-us/entra/identity/role-based-access-control/',publisher:'Microsoft Learn',accessed_at:today,type:'official'}
  ,{id:'ms-keyvault-auth',title:'Authentication in Azure Key Vault',url:'https://learn.microsoft.com/en-us/azure/key-vault/general/authentication',publisher:'Microsoft Learn',accessed_at:today,type:'official'}
];

const extraRelationTypes = [
  {id:'issues',label:'stellt aus',inverse_type:'issued_by',inverse_label:'wird ausgestellt von',description:'Das Quellobjekt stellt das Zielobjekt als Identitäts- oder Sicherheitsartefakt aus.',color:'#b38cff',priority:88,symmetric:false},
  {id:'issued_by',label:'wird ausgestellt von',inverse_type:'issues',inverse_label:'stellt aus',description:'Das Objekt wird durch den verbundenen Identitätsdienst ausgestellt.',color:'#b38cff',priority:88,symmetric:false},
  {id:'refreshes',label:'erneuert',inverse_type:'refreshed_by',inverse_label:'wird erneuert durch',description:'Das Quellobjekt wird verwendet, um ein kurzlebigeres Zielartefakt erneut zu beziehen.',color:'#68d391',priority:82,symmetric:false},
  {id:'refreshed_by',label:'wird erneuert durch',inverse_type:'refreshes',inverse_label:'erneuert',description:'Das Objekt kann mithilfe des verbundenen Artefakts erneut bezogen werden.',color:'#68d391',priority:82,symmetric:false}
];

const E = {
  'azure-0045':{
    title:'Role-Based Access Control – Grundprinzip',
    simple:'Role-Based Access Control verteilt Berechtigungen über Rollen statt über einzelne Aktionen. Dadurch erhalten Personen und Anwendungen nur die Zugriffe, die zu ihrer Aufgabe passen.',
    technical:'Azure RBAC autorisiert Zugriffe auf Azure-Ressourcen über Role Assignments. Eine Zuweisung verbindet einen Security Principal, eine Role Definition und einen Scope. Berechtigungen werden von höheren Scopes an untergeordnete Ressourcen vererbt.',
    architecture:'RBAC ist die zentrale Autorisierungsschicht der Azure Control Plane. Rollen sollten möglichst an Gruppen oder Workload-Identitäten und auf dem kleinsten sinnvollen Scope vergeben werden. Direkte Benutzerzuweisungen und dauerhaft breite Owner-Rechte erhöhen Betriebs- und Sicherheitsrisiken.',
    why:'Ohne ein klares RBAC-Modell entstehen überprivilegierte Identitäten, unübersichtliche Verantwortlichkeiten und schwer auditierbare Zugriffe.',
    examples:['Eine Entwicklergruppe erhält Contributor auf einer Anwendungs-Ressourcengruppe, aber keine Rechte auf der gesamten Subscription.'],
    merksatz:'RBAC verbindet Wer, Was und Wo.',analogy:'Eine Stellenbeschreibung bestimmt, welche Türen eine Rolle in einem bestimmten Gebäudebereich öffnen darf.',sources:['ms-rbac','ms-role-assignments'],tags:['rbac','authorization','access-control']
  },
  'azure-0046':{
    title:'Privileged Identity Management (PIM)',
    simple:'PIM macht privilegierte Rollen zeitlich begrenzt statt dauerhaft aktiv. Administratoren aktivieren ihre Rechte bei Bedarf und können dabei Genehmigung, Begründung oder MFA erfüllen müssen.',
    technical:'Microsoft Entra PIM verwaltet eligible und aktive Zuweisungen für Microsoft-Entra-Rollen, Azure-Ressourcenrollen und weitere unterstützte Ressourcen. Aktivierungsregeln können Laufzeit, Genehmigung, MFA, Begründung, Benachrichtigung und Access Reviews vorgeben.',
    architecture:'PIM reduziert stehende Administratorrechte und unterstützt Just-in-Time- sowie Just-Enough-Access. Kritische Rollen sollten eligible, zeitlich begrenzt und überwacht sein; Notfallkonten benötigen ein getrenntes Betriebsmodell. PIM ergänzt Least Privilege, ersetzt aber keine saubere Rollendefinition.',
    why:'Dauerhaft aktive Administratorrechte vergrößern den Schaden kompromittierter Konten; PIM verkürzt dieses Risikofenster.',
    examples:['Ein Administrator aktiviert die Rolle Contributor für zwei Stunden, bestätigt MFA und dokumentiert die Ticketnummer als Begründung.'],
    merksatz:'PIM macht privilegierten Zugriff berechtigt, zeitlich begrenzt und nachvollziehbar.',analogy:'Der Generalschlüssel liegt im Tresor und wird nur für einen genehmigten Zeitraum ausgegeben.',sources:['ms-pim'],tags:['pim','just-in-time','privileged-access']
  },
  'azure-0822':{
    title:'Authentifizierung und Autorisierung',
    simple:'Authentifizierung prüft, wer oder was sich anmeldet. Autorisierung entscheidet danach, welche Aktionen diese Identität ausführen darf.',
    technical:'Authentication (AuthN) validiert eine Identität mit Anmeldeinformationen oder kryptografischen Nachweisen. Authorization (AuthZ) wertet anschließend Rollen, Berechtigungen, Claims, Policies und den Zielkontext aus. Microsoft Entra ID stellt Identität und Tokens bereit; Azure RBAC autorisiert Azure-Ressourcenzugriffe.',
    architecture:'Beide Kontrollen müssen getrennt entworfen und gemeinsam betrieben werden. Starke Anmeldung verhindert nicht automatisch übermäßige Berechtigungen, und korrektes RBAC schützt nicht vor einer kompromittierten Anmeldung. Zero Trust verlangt explizite Prüfung beider Ebenen.',
    why:'Die Verwechslung von Anmeldung und Berechtigung führt zu falschen Sicherheitsannahmen und lückenhaften Kontrollen.',
    examples:['MFA bestätigt die Identität einer Administratorin; RBAC entscheidet anschließend, ob sie eine VM ändern darf.'],
    merksatz:'AuthN fragt „Wer bist du?“, AuthZ fragt „Was darfst du?“',sources:['ms-identity-fundamentals','ms-rbac'],tags:['authentication','authorization','zero-trust']
  },
  'azure-0903':{
    title:'Authentifizierung (AuthN)',
    simple:'Authentifizierung weist nach, dass eine Person, ein Gerät oder eine Anwendung die behauptete Identität besitzt. Dafür werden zum Beispiel Passwort, Passkey, Zertifikat oder biometrischer Faktor geprüft.',
    technical:'Microsoft Entra ID führt Authentifizierung über unterstützte Protokolle und Methoden durch und erzeugt nach erfolgreicher Prüfung eine Sitzung oder Tokens. MFA kombiniert Nachweise aus mindestens zwei Faktorkategorien und Conditional Access kann zusätzliche Anforderungen festlegen.',
    architecture:'Authentifizierungsmethoden sollten phishing-resistent, zentral verwaltet und an Risiko sowie Benutzergruppe angepasst werden. Passwortlose Verfahren, MFA, Notfallzugänge und Legacy-Authentifizierung benötigen ein gemeinsames Migrations- und Betriebsmodell.',
    why:'Jede Autorisierung setzt voraus, dass die zugrunde liegende Identität zuverlässig festgestellt wurde.',
    examples:['Eine Administratorin meldet sich mit Passkey an und erfüllt damit eine phishing-resistente MFA-Anforderung.'],
    merksatz:'Authentifizierung beweist Identität, nicht Berechtigung.',sources:['ms-identity-fundamentals','ms-mfa'],tags:['authentication','authn','identity']
  },
  'azure-0904':{
    title:'Microsoft Entra ID',
    simple:'Microsoft Entra ID ist Microsofts cloudbasierter Dienst für Identitäten und Zugriffe. Er verwaltet unter anderem Benutzer, Gruppen, Geräte und Anwendungen und prüft Anmeldungen für Azure, Microsoft 365 und integrierte Apps.',
    technical:'Entra ID stellt Verzeichnis-, Authentifizierungs-, Token- und Policyfunktionen für Workforce- und Workload-Identitäten bereit. Ein Tenant ist eine dedizierte Instanz mit Objekten, Domains, Anwendungen, Rollen und Richtlinien. Moderne Anwendungen integrieren typischerweise OAuth 2.0, OpenID Connect oder SAML.',
    architecture:'Entra ID ist die Identitäts-Control-Plane und damit eine geschäftskritische Abhängigkeit. Tenant-Struktur, administrative Rollen, Authentifizierungsmethoden, Conditional Access, Workload-Identitäten und Notfallzugang müssen als Plattformstandard betrieben werden. Ein Entra Tenant ist nicht dasselbe wie eine Azure Subscription, besitzt aber Vertrauensbeziehungen zu ihr.',
    why:'Fehlkonfigurationen im zentralen Identitätsdienst wirken auf viele Cloud-Ressourcen und Anwendungen gleichzeitig.',
    examples:['Ein Unternehmen verwendet einen Workforce Tenant für Mitarbeitende, Geräte, Microsoft 365 und den Zugriff auf Azure-Subscriptions.'],
    merksatz:'Entra ID ist die Identitäts- und Zugriffssteuerung, nicht die Azure-Ressourcenverwaltung.',analogy:'Ein zentrales digitales Melderegister stellt Identitäten bereit; andere Systeme entscheiden damit über Zutritt.',sources:['ms-entra-overview','ms-identity-fundamentals'],tags:['entra-id','identity-provider','tenant'],aliases:['Azure Active Directory','Azure AD']
  },
  'azure-0908':{
    simple:'Single Sign-On erlaubt eine einmalige Anmeldung für mehrere verbundene Anwendungen. Nutzer müssen dadurch nicht für jede App erneut ein eigenes Kennwort eingeben.',
    technical:'Bei föderiertem SSO vertraut eine Anwendung einem Identity Provider wie Entra ID und akzeptiert signierte Tokens oder Assertions über OIDC, OAuth, SAML oder andere unterstützte Verfahren. Sitzung, Tokenlebensdauer und Anwendungszuweisung bestimmen das konkrete Anmeldeerlebnis.',
    architecture:'SSO reduziert Passwortverwendung und zentralisiert Zugriffsrichtlinien, vergrößert aber die Bedeutung des Identity Providers und der Sitzungssicherheit. Anwendungen sollten moderne Föderation, Conditional Access und einen geregelten Provisionierungs- sowie Deprovisionierungsprozess unterstützen.',
    why:'SSO verbessert Nutzung und zentrale Kontrolle, macht aber starke Identitätssicherung unverzichtbar.',
    examples:['Ein Mitarbeitender meldet sich einmal bei Entra ID an und öffnet anschließend Salesforce und Microsoft 365 ohne erneute Kennworteingabe.'],
    merksatz:'SSO bedeutet einmal authentifizieren, mehreren vertrauenden Apps gegenüber angemeldet sein.',sources:['ms-identity-fundamentals','ms-sso'],tags:['sso','federation','authentication']
  },
  'azure-0909':{
    title:'Anwendungsverwaltung, App Registration und Service Principal',
    simple:'Entra ID gibt Anwendungen eine eigene Identität und steuert, wie sie sich anmelden oder auf APIs zugreifen. Eine App Registration beschreibt die Anwendung; ein Service Principal ist ihre lokale Identität in einem Tenant.',
    technical:'Eine App Registration erzeugt ein Application Object im Home Tenant und normalerweise einen Service Principal. Das Application Object ist die globale Definition mit Redirect URIs, Berechtigungen und Anmeldeoptionen; Service Principals repräsentieren die nutzbare Instanz in jedem Tenant. Enterprise Applications verwalten diese lokalen Instanzen, Zuweisungen, Consent und SSO.',
    architecture:'App Registrations und Enterprise Applications müssen getrennt inventarisiert und mit Besitzern, minimalen API-Berechtigungen, sicheren Credentials und Consent-Governance betrieben werden. Zertifikate oder föderierte Credentials sind statischen Client Secrets vorzuziehen; für Azure-Workloads ist Managed Identity oft die bessere Wahl.',
    why:'Unkontrollierte Anwendungsidentitäten und Berechtigungen sind eine häufige Quelle dauerhafter, schwer sichtbarer Zugriffe.',
    examples:['Eine interne API wird registriert; ihre Web-App erhält einen Service Principal und nur den benötigten delegierten API-Scope.'],
    merksatz:'App Object ist der Bauplan, Service Principal die Tenant-Instanz.',analogy:'Der Bauplan beschreibt das Produkt; jede Filiale besitzt eine lokale Betriebslizenz.',sources:['ms-app-objects','ms-app-management'],tags:['app-registration','service-principal','enterprise-application']
  },
  'azure-0910':{
    title:'Microsoft Entra ID Protection',
    simple:'Identity Protection erkennt Hinweise auf kompromittierte Identitäten und riskante Anmeldungen. Administratoren können Risiken untersuchen und über Richtlinien eine sichere Bestätigung oder Sperre auslösen.',
    technical:'ID Protection erzeugt Risk Detections, Sign-in Risk und User Risk aus Microsoft-Signalen. Berichte unterstützen Untersuchung und Remediation; Risikostufen können als Bedingungen in Conditional Access verwendet werden, um MFA, sichere Kennwortänderung oder Blockierung zu verlangen.',
    architecture:'Identity Protection liefert adaptive Risikosignale und sollte mit Conditional Access, SIEM/XDR, Incident Response und Benutzer-Self-Remediation integriert werden. Lizenzabhängige Funktionen und False Positives müssen im Betriebsmodell berücksichtigt werden.',
    why:'Statische Richtlinien erkennen nicht, ob eine konkrete Anmeldung oder Identität wahrscheinlich kompromittiert ist.',
    examples:['Eine Anmeldung über eine anonyme IP wird als riskant bewertet und löst über Conditional Access MFA aus.'],
    merksatz:'Identity Protection erkennt Risiko; Conditional Access setzt die Reaktion durch.',sources:['ms-id-protection','ms-conditional-access'],tags:['identity-protection','risk','adaptive-access']
  },
  'azure-0911':{
    title:'Identity-Risikodetektionen',
    simple:'Risikodetektionen sind Hinweise darauf, dass eine Anmeldung oder ein Konto möglicherweise kompromittiert ist. Beispiele sind anonyme IP-Adressen, ungewöhnliche Anmeldeeigenschaften oder geleakte Zugangsdaten.',
    technical:'ID Protection erzeugt Echtzeit- und Offline-Detektionen und verdichtet sie zu Sign-in Risk und User Risk. Administratoren prüfen Risk Detections, risky sign-ins und risky users; Richtlinien können Risiken automatisch blockieren oder remediieren.',
    architecture:'Einzelne Detektionen sind Signale, kein abschließender Beweis. Reaktionsprozesse benötigen Risikoschwellen, Ausnahme- und Break-Glass-Regeln, Telemetrie sowie eine Verbindung zu Conditional Access und Security Operations.',
    why:'Risikodetektionen machen kompromittierungsnahe Signale für adaptive Zugriffskontrollen nutzbar.',
    examples:['Mehrere atypische Anmeldeinformationen erhöhen den Sign-in Risk und führen zu einer zusätzlichen MFA-Prüfung.'],
    merksatz:'Risikodetektion ist ein Signal; Policy und Untersuchung bestimmen die Reaktion.',sources:['ms-id-protection'],tags:['risk-detection','sign-in-risk','user-risk']
  },
  'azure-0912':{
    simple:'Conditional Access entscheidet anhand von Bedingungen, ob und wie ein Zugriff erlaubt wird. Eine Richtlinie kann beispielsweise MFA verlangen, unsichere Anmeldungen blockieren oder ein verwaltetes Gerät fordern.',
    technical:'Conditional Access ist die Zero-Trust-Policy-Engine von Entra ID. Policies kombinieren Zuweisungen wie Benutzer, Workload-Identitäten und Zielressourcen mit Bedingungen wie Risiko, Gerät, Standort oder Client und wenden Grant- oder Session Controls an.',
    architecture:'Policies sollten als abgestufte Baseline geplant, zunächst im Report-only-Modus ausgewertet und mit ausgeschlossenen Notfallkonten abgesichert werden. Abdeckung, Überschneidungen, Lizenzierung und Betriebsverantwortung sind wichtiger als eine große Zahl einzelner Regeln.',
    why:'Conditional Access verbindet Identitätssignale mit durchsetzbaren, kontextabhängigen Zugriffsentscheidungen.',
    examples:['Administratoren müssen phishing-resistente MFA verwenden; Anmeldungen von Legacy-Clients werden blockiert.'],
    merksatz:'Conditional Access ist eine Wenn-Dann-Entscheidung für Zugriff.',analogy:'Eine intelligente Zugangskontrolle prüft Person, Ziel, Gerät und Risiko, bevor sie Bedingungen für den Eintritt festlegt.',sources:['ms-conditional-access'],tags:['conditional-access','zero-trust','policy']
  },
  'azure-0913':{
    title:'Conditional-Access-Signale',
    simple:'Conditional Access betrachtet Signale wie Identität, Zielanwendung, Gerät, Standort und Risiko. Aus dieser Kombination entsteht der Kontext für die Zugriffsentscheidung.',
    technical:'Assignments und Conditions können Benutzer oder Workload-Identitäten, Target Resources, Network Location, Device Platform, Client App, Device State sowie User- oder Sign-in-Risk einbeziehen. Nicht jedes Signal steht in jeder Lizenz oder für jeden Identitätstyp zur Verfügung.',
    architecture:'Signale müssen zuverlässig, datenschutzgerecht und betrieblich beherrschbar sein. Standort allein ist kein Vertrauensbeweis; starke Authentifizierung, Gerätezustand und Risiko sollten zu einem mehrschichtigen Modell kombiniert werden.',
    why:'Die Qualität der Eingangssignale bestimmt, ob adaptive Zugriffsentscheidungen wirksam und nachvollziehbar sind.',
    examples:['Eine Anmeldung eines Administrators von einem unbekannten Gerät mit hohem Sign-in Risk wird strenger behandelt als der Normalfall.'],
    merksatz:'Conditional Access entscheidet nur so gut wie seine Signale.',sources:['ms-conditional-access'],tags:['conditional-access','signals','risk']
  },
  'azure-0914':{
    title:'Conditional-Access-Zugriffskontrollen',
    simple:'Zugriffskontrollen legen fest, welche Bedingung für den Zugriff erfüllt sein muss. Sie können Zugriff blockieren oder zum Beispiel MFA, ein kompatibles Gerät oder bestimmte Authentifizierungsstärke verlangen.',
    technical:'Grant Controls bestimmen Block oder Grant mit Anforderungen; mehrere Anforderungen können mit AND oder OR kombiniert werden. Session Controls beeinflussen die laufende Sitzung, beispielsweise Anmeldehäufigkeit oder App-enforced Restrictions.',
    architecture:'Kontrollen müssen zum Schutzbedarf der Zielressource passen und dürfen Notfall- sowie Wiederherstellungswege nicht unbrauchbar machen. Phishing-resistente Authentifizierungsstärke ist für privilegierte Zugriffe stärker als generische MFA.',
    why:'Erst die Zugriffskontrolle übersetzt erkannte Signale in eine durchgesetzte Sicherheitswirkung.',
    examples:['Für das Azure-Managementportal verlangt die Policy phishing-resistente MFA und ein compliant device.'],
    merksatz:'Signale beschreiben die Lage; Grant Controls setzen die Konsequenz.',sources:['ms-conditional-access'],tags:['grant-controls','session-controls','conditional-access']
  },
  'azure-0915':{
    title:'Risikobasierter Zugriff',
    simple:'Risikobasierter Zugriff reagiert unterschiedlich auf normale und verdächtige Anmeldungen. Identity Protection liefert das Risiko, Conditional Access verlangt daraufhin zum Beispiel MFA oder blockiert den Zugriff.',
    technical:'Conditional Access kann User Risk und Sign-in Risk aus Entra ID Protection als Bedingung auswerten. Richtlinien kombinieren Risikoschwellen mit Grant Controls und können Selbstremediation wie MFA oder sichere Kennwortänderung ermöglichen.',
    architecture:'Risikobasierte Policies sollten definierte Schwellen, Ausnahmeprozesse, Monitoring und Incident-Response-Pfade besitzen. Sie ergänzen Baseline-Policies und dürfen nicht der einzige Schutz privilegierter Identitäten sein.',
    why:'Adaptive Reaktionen erhöhen Schutz, ohne jede normale Anmeldung maximal zu belasten.',
    examples:['Mittleres Sign-in Risk verlangt MFA; hohes User Risk blockiert den Zugriff bis zur Untersuchung.'],
    merksatz:'Riskosignal plus Policy ergibt adaptive Zugriffskontrolle.',sources:['ms-id-protection','ms-conditional-access'],tags:['risk-based-access','conditional-access','identity-protection']
  },
  'azure-0916':{
    title:'Conditional-Access-Policy-Management',
    simple:'Conditional-Access-Richtlinien werden zentral im Entra Tenant verwaltet. Dort lassen sie sich testen, aktivieren und anhand von Anmeldeprotokollen überprüfen.',
    technical:'Policies besitzen Zielgruppen, Zielressourcen, Bedingungen und Controls sowie die Zustände off, report-only oder on. What-if, Sign-in Logs und Report-only-Ergebnisse unterstützen Auswirkungsanalyse und Fehlersuche.',
    architecture:'Policies sollten versioniert, mit Namenskonventionen, Verantwortlichen und Break-Glass-Ausnahmen betrieben werden. Änderungen brauchen gestufte Einführung, Peer Review, Telemetrie und einen Rückfallplan, damit Fehlkonfigurationen keinen tenantweiten Lockout verursachen.',
    why:'Conditional Access wirkt zentral; ein unkontrollierter Policy-Fehler kann viele Benutzer und Anwendungen gleichzeitig betreffen.',
    examples:['Eine neue MFA-Policy läuft zwei Wochen in Report-only, bevor sie stufenweise für Benutzergruppen aktiviert wird.'],
    merksatz:'Zentrale Policy braucht zentralen Änderungs- und Notfallprozess.',sources:['ms-conditional-access'],tags:['conditional-access','policy-management','operations']
  },
  'azure-0917':{
    title:'Security Tokens',
    simple:'Security Tokens sind zeitlich begrenzte digitale Nachweise für Identität oder Zugriff. Anwendungen verwenden sie, damit Passwörter nicht bei jeder Anfrage übertragen werden müssen.',
    technical:'Die Microsoft Identity Platform stellt unter anderem ID-, Access- und Refresh-Tokens aus. Tokens enthalten oder referenzieren Claims, Zielgruppe, Aussteller und Gültigkeit; ihre genaue Rolle hängt vom Protokoll ab. Access- und ID-Tokens sind nicht austauschbar.',
    architecture:'Tokens sind Credentials und müssen vor Diebstahl, Replay und falscher Validierung geschützt werden. Anwendungen sollten etablierte Bibliotheken verwenden, minimale Scopes anfordern, Zielgruppe und Aussteller prüfen und Sitzungs- sowie Revocation-Verhalten berücksichtigen.',
    why:'Fehler bei Tokenverwendung oder -validierung können Authentifizierung und Autorisierung vollständig umgehen.',
    examples:['Eine Web-App erhält ein ID Token für die Anmeldung und ein separates Access Token für den Aufruf einer API.'],
    merksatz:'ID Token beschreibt Anmeldung, Access Token autorisiert eine API, Refresh Token holt neue Tokens.',sources:['ms-access-tokens','ms-id-tokens','ms-refresh-tokens'],tags:['tokens','oauth','openid-connect']
  },
  'azure-0918':{
    title:'Access Token',
    simple:'Ein Access Token erlaubt einem Client, eine bestimmte geschützte API im Namen einer Identität aufzurufen. Es ist für die Ziel-API bestimmt und nur begrenzt gültig.',
    technical:'Access Tokens enthalten Autorisierungsinformationen wie Audience, Scopes oder Rollen und werden vom Authorization Server ausgestellt. Der Client behandelt sie als vertrauliche, möglichst opake Zeichenfolge; die Resource API validiert Signatur, Aussteller, Audience, Gültigkeit und erforderliche Berechtigungen.',
    architecture:'Tokens müssen auf minimale Zielressourcen und Berechtigungen begrenzt, sicher gespeichert und nur über TLS übertragen werden. Eine Anwendung darf kein Token akzeptieren, dessen Audience für eine andere API bestimmt ist. Bibliotheken und Managed Identity reduzieren fehlerhafte Eigenimplementierungen.',
    why:'Access Tokens sind der tatsächliche Berechtigungsnachweis gegenüber APIs und damit ein attraktives Angriffsziel.',
    examples:['Eine Web-App sendet ein Access Token mit passendem API-Scope an eine geschützte interne REST-API.'],
    merksatz:'Access Token ist für die API, nicht als Benutzerprofil für den Client.',sources:['ms-access-tokens'],tags:['access-token','oauth','authorization']
  },
  'azure-0919':{
    title:'Ressourcenzugriff mit Access Token',
    simple:'Eine geschützte Ressource akzeptiert einen Zugriff erst, wenn sie ein gültiges Access Token erhält. Das Token muss für genau diese Ressource bestimmt sein und die benötigte Berechtigung enthalten.',
    technical:'Eine Web API validiert Signatur, Issuer, Audience, Ablaufzeit und relevante Scopes oder App Roles. Der Client verwendet das Token, entscheidet aber nicht selbst über seine Gültigkeit. Die Resource ist Eigentümerin ihres Tokenformats und ihrer Autorisierungsregeln.',
    architecture:'API-Grenzen benötigen eine klare Audience und ein minimales Berechtigungsmodell. Tokenprüfung gehört in bewährte Middleware; eigene Parser, Tokens für fremde Audiences und Autorisierung nur anhand unvalidierter Claims sind zu vermeiden.',
    why:'Die Zielressource ist die letzte Kontrollstelle, die einen gestohlenen oder falsch ausgestellten Nachweis ablehnen kann.',
    examples:['Eine Storage-nahe API akzeptiert nur Tokens mit ihrer eigenen Audience und dem Scope data.read.'],
    merksatz:'Nur die Ziel-API darf ihr Access Token als Berechtigungsnachweis akzeptieren.',sources:['ms-access-tokens'],tags:['resource-api','token-validation','authorization']
  },
  'azure-0920':{
    title:'ID Token',
    simple:'Ein ID Token bestätigt einer Client-Anwendung, dass eine Benutzeranmeldung stattgefunden hat. Es enthält Identitätsinformationen für die Sitzung, ist aber kein allgemeiner API-Zugriffsschlüssel.',
    technical:'OpenID Connect stellt ID Tokens als signierte JWTs aus. Claims wie Issuer, Audience, Subject, Zeitstempel und Nonce werden von der vertraulichen Client-Anwendung validiert. ID Tokens sind für den Client bestimmt; APIs erwarten Access Tokens.',
    architecture:'ID Tokens dienen dem Aufbau einer Anwendungssitzung und der Identitätsdarstellung. Anwendungen sollten Claims sparsam verwenden, keine dauerhafte Benutzeridentität allein aus veränderlichen Anzeigenamen ableiten und standardisierte Bibliotheken für Validierung sowie Key Rollover einsetzen.',
    why:'Die klare Trennung vom Access Token verhindert, dass Identitätsnachweise fälschlich als API-Berechtigung akzeptiert werden.',
    examples:['Eine Web-App validiert das ID Token und eröffnet danach eine Sitzung für den angemeldeten Benutzer.'],
    merksatz:'ID Token ist für den Client und die Anmeldung; Access Token ist für die API.',sources:['ms-id-tokens'],tags:['id-token','openid-connect','authentication']
  },
  'azure-0921':{
    title:'Identitätsclaims im ID Token',
    simple:'Claims sind Aussagen im Token, zum Beispiel über Aussteller, Zielanwendung oder angemeldete Identität. Die App nutzt sie, nachdem sie das Token korrekt validiert hat.',
    technical:'ID-Token-Claims umfassen unter anderem `iss`, `aud`, `sub`, `iat`, `nbf`, `exp` und häufig `nonce`. Optionale Profilclaims hängen von Scopes und Tenantkonfiguration ab. Eine stabile fachliche Identifikation sollte geeignete unveränderliche IDs statt Anzeigenamen verwenden.',
    architecture:'Claims sind Eingabedaten, keine automatisch ausreichende Autorisierungsentscheidung. Datenschutz, Tokenumfang, optionale Claims und Identifierstrategie müssen mit dem Anwendungsdatenmodell abgestimmt werden.',
    why:'Falsch interpretierte oder unvalidierte Claims führen zu Benutzerverwechslungen und Sicherheitslücken.',
    examples:['Eine App ordnet das validierte `sub` ihrer internen Benutzerkennung zu und zeigt den Namen nur als Profilinformation an.'],
    merksatz:'Erst Token validieren, dann Claims verwenden.',sources:['ms-id-tokens'],tags:['claims','id-token','identity']
  },
  'azure-0922':{
    title:'Refresh Token',
    simple:'Ein Refresh Token ermöglicht einer Anwendung, neue Access Tokens zu erhalten, ohne den Benutzer jedes Mal erneut anzumelden. Es ist länger nutzbar und deshalb besonders schützenswert.',
    technical:'Die Microsoft Identity Platform stellt Refresh Tokens an berechtigte Clients aus und bindet sie an Benutzer- und Clientkontext. Der Client tauscht sie am Token Endpoint gegen neue Access- und Refresh-Token-Paare. Ablauf, Rotation und Widerruf hängen von Clienttyp, Richtlinien und Ereignissen ab.',
    architecture:'Refresh Tokens benötigen sichere Speicherung, Rotation und eine robuste Reauthentication-Strategie. Browseranwendungen sollten etablierte Bibliotheken und den Authorization Code Flow mit PKCE verwenden; gestohlene langlebige Sitzungstokens sind ein hohes Persistenzrisiko.',
    why:'Refresh Tokens verlängern Sitzungen, können bei Diebstahl aber wiederholt neue Zugriffsrechte erzeugen.',
    examples:['Eine mobile App verwendet ihr Refresh Token, um nach Ablauf des Access Tokens im Hintergrund ein neues Tokenpaar zu beziehen.'],
    merksatz:'Refresh Token verlängert die Sitzung, nicht die Lebenszeit eines alten Access Tokens.',sources:['ms-refresh-tokens'],tags:['refresh-token','oauth','session']
  },
  'azure-0923':{
    title:'Token-Erneuerung',
    simple:'Wenn ein Access Token abläuft, kann die Anwendung mit einem gültigen Refresh Token ein neues anfordern. Schlägt das fehl, muss der Benutzer sich erneut anmelden.',
    technical:'Der Client sendet das Refresh Token an den Token Endpoint und erhält bei Erfolg ein neues Access Token und häufig ein neues Refresh Token. Alte Tokens müssen sicher verworfen werden; Clients müssen Ablauf, Widerruf, Consentänderungen und Interaktionsanforderungen behandeln.',
    architecture:'Token-Erneuerung gehört in eine gepflegte Identity Library statt in eigene Sitzungslogik. Fehlerpfade müssen zwischen vorübergehendem Problem und erforderlicher Reauthentication unterscheiden und dürfen keine Endlosschleifen erzeugen.',
    why:'Saubere Erneuerung verbindet gute Benutzererfahrung mit kontrollierter, widerrufbarer Sitzungssicherheit.',
    examples:['Nach einem Widerruf verwirft die App ihren Cache und startet einen interaktiven Authorization-Code-Flow.'],
    merksatz:'Erneuern, rotieren, bei Fehler sicher neu authentifizieren.',sources:['ms-refresh-tokens'],tags:['token-renewal','refresh-token','session']
  },
  'azure-0924':{
    title:'Token-Signatur und -Validierung',
    simple:'Microsoft Entra signiert Tokens, damit Anwendungen Manipulationen erkennen können. Die Anwendung muss zusätzlich prüfen, wer das Token ausgestellt hat, für wen es bestimmt ist und ob es noch gültig ist.',
    technical:'Validierung verwendet OpenID-Connect-Metadaten und veröffentlichte Signaturschlüssel. Abhängig vom Token werden Signatur, `iss`, `aud`, Zeitclaims, Nonce sowie erforderliche Scopes oder Rollen geprüft. Bibliotheken berücksichtigen Key Rollover und Protokolldetails.',
    architecture:'Tokenvalidierung ist eine Trust Boundary und darf nicht als bloßes JWT-Decoding umgesetzt werden. Mandantenmodell, erlaubte Issuer, Audience und Schlüsselrotation müssen explizit sein; APIs dürfen keine Tokens akzeptieren, die für andere Ressourcen ausgestellt wurden.',
    why:'Ein lesbares JWT ist noch kein vertrauenswürdiger Berechtigungsnachweis.',
    examples:['Eine API lehnt ein korrekt signiertes Token ab, weil dessen `aud` eine andere API bezeichnet.'],
    merksatz:'Signatur allein reicht nicht: Issuer, Audience, Zeit und Berechtigung prüfen.',sources:['ms-access-tokens','ms-id-tokens'],tags:['token-validation','jwt','signature']
  },
  'azure-0925':{
    title:'Microsoft Entra B2B Collaboration',
    simple:'B2B Collaboration ermöglicht Partnern und Gästen den Zugriff auf ausgewählte Unternehmensressourcen mit ihrer eigenen Identität. Das Unternehmen behält dabei Kontrolle über Anwendungen, Berechtigungen und Zugriffsrichtlinien.',
    technical:'Externe Personen werden typischerweise als Guest User im Workforce Tenant repräsentiert und authentifizieren sich über ihre Home-Organisation oder einen unterstützten Identity Provider. Einladungen, Self-Service Sign-up, Cross-Tenant Access Settings, Conditional Access und Entitlement Management steuern den Lebenszyklus.',
    architecture:'B2B vermeidet separat verwaltete Partnerkennwörter, benötigt aber Governance für Einladung, Sponsor, Ablauf, Access Reviews und Cross-Tenant-Trust. MFA- und Device-Claims anderer Entra Tenants dürfen nur bewusst vertraut werden.',
    why:'Externe Zusammenarbeit erweitert die Identitäts- und Datenfreigabegrenze über die eigene Organisation hinaus.',
    examples:['Ein Beratungsunternehmen lädt eine Projektleiterin als Gast ein und vergibt zeitlich begrenzten Zugriff auf eine Teams-Site.'],
    merksatz:'B2B: Partner nutzt die eigene Identität, dein Tenant kontrolliert den Zugriff.',sources:['ms-b2b','ms-external-id'],tags:['b2b','external-identities','guest']
  },
  'azure-0926':{
    title:'Azure AD B2C (Legacy) und Microsoft Entra External ID',
    simple:'Azure AD B2C ist Microsofts ältere Lösung für Kundenidentitäten in Verbraucher-Apps. Für neue Customer-Identity-Szenarien ist Microsoft Entra External ID die aktuelle Plattformrichtung; Azure AD B2C ist seit Mai 2025 nicht mehr für Neukunden erhältlich.',
    technical:'Azure AD B2C verwendet getrennte Consumer Tenants und anpassbare User Journeys. Microsoft Entra External ID unterstützt CIAM in extern konfigurierten Tenants mit App Registrations, Sign-up-Flows und Kundenkonten. Bestehende B2C-Kunden können den Dienst weiter nutzen, müssen Roadmap und Funktionsunterschiede aber separat bewerten.',
    architecture:'Neue CIAM-Architekturen sollten External ID bewerten und Workforce-Identitäten strikt von Kundenidentitäten trennen. Bestehende B2C-Lösungen benötigen eine dokumentierte Betriebs- und Migrationsstrategie statt einer unkontrollierten Neuentwicklung auf der Legacy-Plattform.',
    why:'Die Produktwahl beeinflusst Tenantmodell, Benutzerreisen, Anpassbarkeit und langfristige Wartbarkeit einer Kundenplattform.',
    examples:['Ein neuer Kundenportal-Dienst verwendet einen External Tenant; eine bestehende B2C-Anwendung bleibt bis zu einer geplanten Migration im Legacy Tenant.'],
    merksatz:'B2C ist Legacy für Bestandskunden; External ID ist die Richtung für neue CIAM-Lösungen.',sources:['ms-external-id'],tags:['azure-ad-b2c','external-id','ciam','legacy'],aliases:['B2C - Business to Custormers']
  },
  'azure-0927':{
    title:'Geräteidentitäten in Microsoft Entra ID',
    simple:'Eine Geräteidentität stellt einen Computer, ein Smartphone oder ein anderes Gerät in Entra ID dar. Ihr Zustand kann bei Zugriffsentscheidungen berücksichtigt werden.',
    technical:'Geräteobjekte entstehen durch Entra Registration, Entra Join oder Hybrid Join. Attribute und Compliance-Signale können zusammen mit Intune in gerätebasierten Conditional-Access-Policies verwendet werden. Geräteidentität und Benutzeridentität bleiben getrennte Objekte.',
    architecture:'Gerätevertrauen ist ein zusätzlicher Zero-Trust-Nachweis, kein Ersatz für Benutzer- oder Workload-Authentifizierung. Join-Modell, BYOD, MDM-Verantwortung, Compliance und Plattformunterstützung müssen vor Policy-Erzwingung geplant werden.',
    why:'Gerätekontext hilft, Zugriff von verwalteten und unbekannten Endpunkten unterschiedlich zu behandeln.',
    examples:['Nur compliant und Entra-joined Firmenlaptops dürfen auf eine sensible Verwaltungsanwendung zugreifen.'],
    merksatz:'Geräteidentität liefert Kontext über den Endpunkt, nicht über die Person.',sources:['ms-device-identity','ms-conditional-access'],tags:['device-identity','entra-join','conditional-access']
  },
  'azure-0928':{
    title:'Microsoft Entra Multifactor Authentication (MFA)',
    simple:'MFA verlangt mindestens zwei unterschiedliche Nachweise für eine Anmeldung. Ein gestohlenes Passwort allein reicht dadurch nicht mehr aus.',
    technical:'Entra MFA kombiniert Faktoren aus Wissen, Besitz und biometrischen Merkmalen. Conditional Access kann MFA abhängig von Benutzer, Ressource, Risiko oder Gerät verlangen. Unterstützte Methoden unterscheiden sich in Sicherheit; Passkeys und zertifikatsbasierte Verfahren können phishing-resistent sein.',
    architecture:'MFA sollte tenantweit geplant und für privilegierte Zugriffe mit phishing-resistenter Authentifizierungsstärke umgesetzt werden. Registrierung, Recovery, Temporary Access Pass, Notfallkonten und Abschaltung schwacher Methoden gehören zum Betriebsmodell.',
    why:'Passwortangriffe sind häufig; MFA reduziert das Risiko, dass ein einzelnes kompromittiertes Geheimnis genügt.',
    examples:['Conditional Access verlangt für Administratoren einen FIDO2-Passkey, bevor das Azure-Portal geöffnet wird.'],
    merksatz:'MFA kombiniert unabhängige Faktoren; zwei Passwörter wären weiterhin nur ein Faktor.',analogy:'Zutritt erfordert Schlüsselkarte und persönlichen Fingerabdruck statt nur eines Türcodes.',sources:['ms-mfa','ms-conditional-access'],tags:['mfa','authentication','phishing-resistant']
  },
  'azure-0929':{
    title:'Microsoft-Entra-Lizenzierung',
    simple:'Microsoft Entra bietet unterschiedliche Lizenzstufen für Basis- und Premiumfunktionen. Funktionen wie erweiterte Conditional-Access-, Identity-Protection- oder Governance-Möglichkeiten können zusätzliche Lizenzen benötigen.',
    technical:'Lizenzierung wird pro Produkt und Funktion geprüft, beispielsweise Entra ID Free, P1, P2, ID Governance oder Entra Suite. Technische Verfügbarkeit, Nutzungsrecht und Lizenzzuweisung sind getrennte Fragen; Dokumentation und Vertragsstand müssen vor produktiver Nutzung geprüft werden.',
    architecture:'Identity-Design darf Premiumkontrollen nicht voraussetzen, ohne Lizenzabdeckung, Kosten und Betriebsmodell zu bestätigen. Sicherheitsanforderungen sollten zuerst definiert und anschließend mit aktuellen Lizenzoptionen abgedeckt werden, nicht umgekehrt.',
    why:'Eine technisch konfigurierte Identity-Funktion kann lizenzrechtlich oder organisatorisch nicht ausreichend abgedeckt sein.',
    examples:['Vor der Einführung risikobasierter Policies prüft das Unternehmen, welche Benutzer Entra ID P2 benötigen.'],
    merksatz:'Sicherheitsanforderung zuerst, aktuelle Lizenzabdeckung danach prüfen.',sources:['ms-entra-overview','ms-id-protection','ms-pim'],tags:['licensing','entra-id','governance'],aliases:['Azure Active Directory Premium Licences']
  },
  'azure-0931':{
    title:'Global Administrator',
    simple:'Global Administrator ist eine besonders mächtige Microsoft-Entra-Rolle. Sie kann fast alle Einstellungen im Tenant verwalten und sollte deshalb nur sehr wenigen Personen zur Verfügung stehen.',
    technical:'Die Rolle besitzt weitreichende Berechtigungen für Entra ID und kann sich unter bestimmten Bedingungen Zugriff auf Azure-Ressourcenverwaltung verschaffen. Zuweisungen werden über Entra Roles verwaltet und sollten mit PIM, starker Authentifizierung, Audit und getrennten Notfallkonten abgesichert werden.',
    architecture:'Global Administrator ist keine Alltagsrolle. Organisationen sollten aufgabenspezifische Least-Privilege-Rollen verwenden, dauerhaft aktive Zuweisungen minimieren und mindestens zwei cloud-only Break-Glass-Konten mit strengem Monitoring getrennt betreiben.',
    why:'Eine kompromittierte globale Administratoridentität kann den gesamten Identitäts-Tenant und abhängige Dienste gefährden.',
    examples:['Ein Identity-Administrator aktiviert Global Administrator über PIM nur für eine genehmigte Tenant-Wiederherstellung.'],
    merksatz:'Global Administrator ist Notfall- und Ausnahmerolle, keine Standard-Arbeitsrolle.',sources:['ms-entra-rbac','ms-pim'],tags:['global-administrator','privileged-role','least-privilege'],aliases:['Azure Active Diretory Global administrators']
  },
  'azure-0947':{
    title:'Managed Identity',
    simple:'Eine Managed Identity gibt einem Azure-Dienst eine automatisch verwaltete Identität in Entra ID. Anwendungen können damit auf andere Dienste zugreifen, ohne Passwörter oder Client Secrets im Code zu speichern.',
    technical:'System-assigned Managed Identities sind an den Lebenszyklus einer Azure-Ressource gebunden; user-assigned Identitäten sind eigenständige Ressourcen und können mehreren Workloads zugeordnet werden. Intern werden spezielle Service Principals verwendet. Der Workload fordert ein Access Token an und benötigt anschließend die passende Zielberechtigung, beispielsweise eine Azure-RBAC-Rolle.',
    architecture:'Managed Identity ist für Azure-Workloads meist statischen Credentials vorzuziehen. Die Wahl system- oder user-assigned beeinflusst Lebenszyklus, Wiederverwendung und Berechtigungsverwaltung. Identität ersetzt keine Autorisierung: Zielrollen, Netzwerkzugriff und Secret-freie Anwendungskonfiguration bleiben separat zu planen.',
    why:'Managed Identities vermeiden langlebige Anwendungsgeheimnisse und reduzieren Credential-Rotation sowie Leckagerisiken.',
    examples:['Eine Azure Function liest mit ihrer system-assigned Managed Identity ein Secret aus Key Vault, nachdem ihr die passende Key-Vault-Rolle zugewiesen wurde.'],
    merksatz:'Managed Identity entfernt das Secret aus dem Code, nicht die Notwendigkeit einer Berechtigung.',analogy:'Der Azure-Dienst erhält einen verwalteten Dienstausweis statt eines im Code hinterlegten Generalschlüssels.',sources:['ms-managed-identities','ms-app-objects'],tags:['managed-identity','workload-identity','secretless']
  },
  'azure-0959':{
    title:'Azure Advanced Threat Protection (Legacy)',
    simple:'Azure Advanced Threat Protection war der frühere Name eines Dienstes zur Erkennung identitätsbezogener Angriffe. Das Produkt heißt heute Microsoft Defender for Identity.',
    technical:'Der historische Dienst analysierte Active-Directory-Signale und verdächtige Identitätsaktivitäten. Seine heutige Produktlinie ist in Microsoft Defender for Identity und Microsoft Defender XDR weiterentwickelt; neue Dokumentation und Architekturentscheidungen sollten den aktuellen Namen verwenden.',
    architecture:'Legacy-Bezeichnungen bleiben für alte Prüfungsunterlagen und Betriebsdokumente auffindbar, dürfen aber keine neue Zielarchitektur bestimmen. Bestandsreferenzen sollten auf aktuellen Funktionsumfang, Sensorarchitektur und Portalbetrieb überprüft werden.',
    why:'Produktumbenennungen ohne klare Zuordnung führen zu Doppelplanung und veralteten Betriebsanweisungen.',
    examples:['Eine alte Betriebsanleitung mit „Azure ATP Sensor“ wird fachlich gegen die aktuelle Defender-for-Identity-Dokumentation geprüft.'],
    merksatz:'Azure ATP ist der historische Name; aktuell heißt der Dienst Defender for Identity.',sources:['ms-defender-identity'],tags:['azure-atp','legacy','defender-for-identity']
  },
  'azure-0960':{
    title:'Microsoft Defender for Identity',
    simple:'Defender for Identity erkennt und untersucht Angriffe auf Identitäten in lokalen, hybriden und Cloudumgebungen. Es hilft Sicherheitsteams, verdächtige Aktivitäten und riskante Identitätskonfigurationen zu verstehen.',
    technical:'Defender for Identity sammelt Signale über Sensoren und API-Verbindungen, analysiert Verhalten und Angriffsmuster und korreliert Identitätskontext im Microsoft Defender Portal. Funktionen umfassen Posture Assessments, Echtzeitdetektion, Untersuchung und Reaktionsmöglichkeiten.',
    architecture:'Der Dienst ist eine Detection-and-Response-Schicht und ersetzt weder sichere Entra-Konfiguration noch Conditional Access. Sensorabdeckung, Berechtigungen, Health Monitoring, XDR-Integration, Incident Ownership und Datenschutz müssen geplant werden.',
    why:'Identitätsangriffe nutzen häufig lokale Verzeichnis- und Hybridpfade, die reine Cloud-Anmeldepolicies nicht vollständig sichtbar machen.',
    examples:['Defender for Identity erkennt eine verdächtige Privilegieneskalation im lokalen Active Directory und korreliert sie mit einem XDR-Incident.'],
    merksatz:'Defender for Identity erkennt Identitätsangriffe; Entra Controls verhindern oder begrenzen Zugriff.',sources:['ms-defender-identity'],tags:['defender-for-identity','itdr','xdr']
  },
  'azure-0964':{
    title:'Azure Role-Based Access Control (Azure RBAC)',
    simple:'Azure RBAC steuert, wer Azure-Ressourcen ansehen oder verändern darf. Zugriffe werden über Rollen an einem bestimmten Geltungsbereich vergeben.',
    technical:'Azure RBAC ist das Autorisierungssystem für Azure Resource Manager. Ein Role Assignment verbindet Security Principal, Role Definition und Scope; Scopes reichen von Management Group über Subscription und Resource Group bis zur einzelnen Ressource. Vererbte und direkte Zuweisungen ergeben die effektiven Berechtigungen.',
    architecture:'RBAC-Design beginnt mit Aufgaben und Verantwortlichkeiten, nicht mit Personen. Gruppen, Managed Identities, minimale Scopes, Built-in Roles und PIM reduzieren Zuweisungswachstum und stehende Privilegien. Azure RBAC ist von Microsoft Entra Directory Roles zu unterscheiden.',
    why:'Azure RBAC entscheidet über Änderungen an produktiven Ressourcen und ist damit eine zentrale Sicherheits- und Governancekontrolle.',
    examples:['Eine Betriebsgruppe erhält Virtual Machine Contributor auf einer Ressourcengruppe, aber keine Rechte zur Rollenvergabe.'],
    merksatz:'Azure RBAC steuert Azure-Ressourcen; Entra Roles steuern den Identitäts-Tenant.',sources:['ms-rbac','ms-role-assignments'],tags:['azure-rbac','authorization','azure-resource-manager']
  },
  'azure-0965':{
    title:'Role Assignment',
    simple:'Ein Role Assignment vergibt einer Identität eine Rolle für einen bestimmten Azure-Bereich. Erst diese Verbindung macht aus einer Rollendefinition einen tatsächlichen Zugriff.',
    technical:'Eine Role Assignment Resource verbindet einen Principal wie User, Group, Service Principal oder Managed Identity mit einer Role Definition und einem Scope. Der Scope bestimmt Reichweite und Vererbung; das Entfernen der Zuweisung entzieht den Zugriff.',
    architecture:'Zuweisungen sollten vorzugsweise an Gruppen oder Workload-Identitäten, mit Begründung und minimalem Scope erfolgen. Direkte Benutzerzuweisungen, unbekannte Principals und redundante Vererbung erschweren Reviews. Privilegierte Assignments sollten über PIM zeitlich begrenzt werden.',
    why:'Role Assignments sind die konkreten, auditierbaren Entscheidungen, die Zugriff tatsächlich gewähren.',
    examples:['Die Gruppe Cloud-Ops erhält Reader auf Subscription A; die Berechtigung wird an deren Ressourcengruppen vererbt.'],
    merksatz:'Role Assignment = Principal + Role Definition + Scope.',sources:['ms-role-assignments','ms-role-assignment-steps'],tags:['role-assignment','rbac','access']
  },
  'azure-0966':{
    title:'Least Privilege',
    simple:'Least Privilege bedeutet, nur die Berechtigungen zu vergeben, die für eine Aufgabe wirklich nötig sind. Rechte sollen außerdem nur so lange und so weit gelten wie erforderlich.',
    technical:'Das Prinzip wird in Azure durch passende Role Definitions, kleinstmögliche Scopes, Gruppen- oder Workload-Zuweisungen, PIM und regelmäßige Reviews umgesetzt. Effektive Berechtigungen umfassen direkte, geerbte und gruppenbasierte Zuweisungen und müssen gemeinsam betrachtet werden.',
    architecture:'Least Privilege ist ein kontinuierlicher Governanceprozess, keine einmalige Rollenauswahl. Telemetrie, Aufgabentrennung, Access Reviews, Just-in-Time-Aktivierung und kontrollierte Ausnahmeprozesse reduzieren Privilege Creep, ohne den Betrieb zu blockieren.',
    why:'Übermäßige Rechte vergrößern den möglichen Schaden von Fehlern und kompromittierten Identitäten.',
    examples:['Ein Deployment-Workload erhält nur die benötigte Custom Role auf einer Ressourcengruppe statt Owner auf der Subscription.'],
    merksatz:'So wenig Berechtigung wie möglich, so viel wie für die Aufgabe nötig.',sources:['ms-role-assignment-steps','ms-pim'],tags:['least-privilege','zero-trust','authorization'],aliases:['RBAC = Wer darf was tun?']
  },
  'azure-0967':{
    title:'Role Definition',
    simple:'Eine Role Definition beschreibt, welche Aktionen eine Rolle erlaubt oder ausschließt. Azure stellt Built-in Roles bereit; bei Bedarf können eigene Rollen erstellt werden.',
    technical:'Role Definitions enthalten Management-Plane-Aktionen und Nicht-Aktionen sowie optional Data Actions und NotDataActions. Assignable Scopes begrenzen, wo eine Custom Role zugewiesen werden kann. Owner, Contributor und Reader sind verbreitete Built-in Roles mit unterschiedlicher Reichweite.',
    architecture:'Built-in Roles sind wartungsärmer; Custom Roles sind sinnvoll, wenn keine bestehende Rolle Least Privilege erfüllt. Custom Roles benötigen Ownership, Versionierung, Tests und Überprüfung bei neuen Azure-Funktionen. Owner sollte wegen möglicher Rollenvergabe besonders begrenzt werden.',
    why:'Die Rollendefinition bestimmt den tatsächlichen Berechtigungsumfang jeder Zuweisung.',
    examples:['Eine Custom Role erlaubt das Starten und Stoppen von VMs, aber weder Löschen noch Rollenvergabe.'],
    merksatz:'Role Definition sagt was erlaubt ist; Role Assignment sagt wem und wo.',sources:['ms-rbac','ms-role-assignments'],tags:['role-definition','built-in-role','custom-role']
  },
  'azure-0968':{
    title:'Azure-RBAC-Scope',
    simple:'Der Scope bestimmt, für welchen Teil von Azure eine Rollenzuweisung gilt. Er kann eine Management Group, Subscription, Resource Group oder einzelne Ressource sein.',
    technical:'Scopes sind hierarchisch und Berechtigungen werden von Eltern an Kinder vererbt. Eine Zuweisung auf Subscription-Ebene wirkt daher grundsätzlich auch auf untergeordnete Resource Groups und Ressourcen. Mehrere Zuweisungen können sich zu effektiven Berechtigungen addieren.',
    architecture:'Der kleinste praktikable Scope reduziert Blast Radius, darf aber nicht tausende Einzelzuweisungen erzeugen. Plattformrollen gehören häufig auf höhere, Workloadrollen auf engere Scopes; Management Groups unterstützen konsistente Enterprise-Strukturen.',
    why:'Eine passende Rolle am falschen Scope kann dennoch weit über den beabsichtigten Bereich hinaus Zugriff gewähren.',
    examples:['Reader wird auf eine Ressourcengruppe statt auf die gesamte Subscription vergeben.'],
    merksatz:'Scope beantwortet, wo die Rolle gilt und vererbt wird.',sources:['ms-role-assignment-steps','ms-role-assignments'],tags:['rbac-scope','resource-group','subscription']
  }
};

const relationDefinitions = [
  ['id-rel-001','azure-0903','azure-0822','part_of','Authentifizierung ist die Identitätsprüfung innerhalb des umfassenderen Modells aus Authentifizierung und Autorisierung.',['ms-identity-fundamentals'],0.99],
  ['id-rel-002','azure-0908','azure-0904','uses','Single Sign-On verwendet Microsoft Entra ID als vertrauenswürdigen Identity Provider für verbundene Anwendungen.',['ms-sso','ms-entra-overview'],0.98],
  ['id-rel-003','azure-0909','azure-0904','part_of','App Registrations, Service Principals und Enterprise Applications werden in Microsoft Entra ID verwaltet.',['ms-app-objects','ms-app-management'],0.99],
  ['id-rel-004','azure-0909','azure-0917','uses','Integrierte Anwendungen verwenden Security Tokens für Anmeldung und API-Zugriff.',['ms-app-objects','ms-access-tokens','ms-id-tokens'],0.98],
  ['id-rel-005','azure-0910','azure-0904','monitors','Entra ID Protection erkennt und bewertet identitätsbezogene Risiken im Microsoft-Entra-Tenant.',['ms-id-protection'],0.98],
  ['id-rel-006','azure-0910','azure-0912','integrates_with','Identity Protection liefert User- und Sign-in-Risk an Conditional Access für adaptive Entscheidungen.',['ms-id-protection','ms-conditional-access'],0.99],
  ['id-rel-007','azure-0911','azure-0910','part_of','Risikodetektionen sind die einzelnen Signale, aus denen Identity Protection Risiko ableitet.',['ms-id-protection'],0.99],
  ['id-rel-008','azure-0912','azure-0913','uses','Conditional Access verwendet Signale zu Identität, Ressource, Gerät, Standort und Risiko.',['ms-conditional-access'],0.99],
  ['id-rel-009','azure-0914','azure-0912','part_of','Grant und Session Controls sind die durchsetzenden Zugriffskontrollen einer Conditional-Access-Policy.',['ms-conditional-access'],0.99],
  ['id-rel-010','azure-0915','azure-0912','part_of','Risikobasierter Zugriff ist ein Conditional-Access-Szenario mit User- oder Sign-in-Risk als Bedingung.',['ms-id-protection','ms-conditional-access'],0.99],
  ['id-rel-011','azure-0916','azure-0912','part_of','Policy Management steuert Lebenszyklus, Test und Aktivierung von Conditional-Access-Richtlinien.',['ms-conditional-access'],0.98],
  ['id-rel-012','azure-0912','azure-0928','requires','Conditional-Access-Policies können Microsoft Entra MFA als Grant Control verlangen.',['ms-conditional-access','ms-mfa'],0.99],
  ['id-rel-013','azure-0904','azure-0917','issues','Die Microsoft Identity Platform in Entra ID stellt Security Tokens für Anwendungen und Ressourcen aus.',['ms-access-tokens','ms-id-tokens','ms-refresh-tokens'],0.99],
  ['id-rel-014','azure-0918','azure-0917','part_of','Access Tokens sind Security Tokens zur Autorisierung geschützter Ressourcen.',['ms-access-tokens'],0.99],
  ['id-rel-015','azure-0920','azure-0917','part_of','ID Tokens sind OpenID-Connect-Security-Tokens für den Client und die Benutzeranmeldung.',['ms-id-tokens'],0.99],
  ['id-rel-016','azure-0922','azure-0917','part_of','Refresh Tokens sind Security Tokens zur Erneuerung einer Clientsitzung.',['ms-refresh-tokens'],0.99],
  ['id-rel-017','azure-0922','azure-0918','refreshes','Ein gültiges Refresh Token kann verwendet werden, um ein neues Access Token zu beziehen.',['ms-refresh-tokens'],0.99],
  ['id-rel-018','azure-0919','azure-0918','uses','Eine geschützte Resource API validiert und verwendet das für sie bestimmte Access Token als Autorisierungsnachweis.',['ms-access-tokens'],0.99],
  ['id-rel-019','azure-0921','azure-0920','part_of','Identitätsclaims sind Bestandteile eines ID Tokens und werden erst nach dessen Validierung verwendet.',['ms-id-tokens'],0.98],
  ['id-rel-020','azure-0924','azure-0917','secures','Korrekte Signatur-, Issuer-, Audience- und Zeitvalidierung schützt die Verwendung von Security Tokens.',['ms-access-tokens','ms-id-tokens'],0.98],
  ['id-rel-021','azure-0925','azure-0904','part_of','B2B Collaboration ist eine External-ID-Funktion für Gäste in einem Microsoft-Entra-Workforce-Tenant.',['ms-b2b','ms-external-id'],0.99],
  ['id-rel-022','azure-0926','azure-0904','part_of','Azure AD B2C und Microsoft Entra External ID gehören zur Microsoft-Identitätsplattform für externe Kundenidentitäten.',['ms-external-id'],0.96],
  ['id-rel-023','azure-0927','azure-0904','part_of','Geräteidentitäten werden als Objekte in Microsoft Entra ID geführt.',['ms-device-identity'],0.99],
  ['id-rel-024','azure-0912','azure-0927','uses','Conditional Access kann Registrierung, Join und Compliance eines Geräteobjekts als Zugriffssignal verwenden.',['ms-device-identity','ms-conditional-access'],0.98],
  ['id-rel-025','azure-0928','azure-0903','secures','MFA stärkt die Authentifizierung, indem mindestens zwei unabhängige Faktorkategorien erforderlich sind.',['ms-mfa'],0.99],
  ['id-rel-026','azure-0046','azure-0931','governs','PIM kann die Aktivierung hochprivilegierter Rollen wie Global Administrator zeitlich begrenzen und überwachen.',['ms-pim'],0.98],
  ['id-rel-027','azure-0947','azure-0904','part_of','Eine Managed Identity wird durch einen speziellen Service Principal in Microsoft Entra ID repräsentiert.',['ms-managed-identities','ms-app-objects'],0.99],
  ['id-rel-028','azure-0947','azure-0944','connects_to','Ein Azure-Workload kann seine Managed Identity verwenden, um ein Access Token für Key Vault zu beziehen; Key Vault prüft anschließend die Berechtigung.',['ms-managed-identities','ms-keyvault-auth'],0.99],
  ['id-rel-029','azure-0959','azure-0960','replaced_by','Azure Advanced Threat Protection ist die historische Produktbezeichnung der heutigen Defender-for-Identity-Produktlinie.',['ms-defender-identity'],0.97],
  ['id-rel-030','azure-0960','azure-0904','monitors','Defender for Identity analysiert Identitätssignale aus lokalen, hybriden und Cloud-Identitätsumgebungen.',['ms-defender-identity'],0.98],
  ['id-rel-031','azure-0045','azure-0964','similar_to','Beide Knoten beschreiben Azure RBAC; der erste erklärt das Grundprinzip, der zweite das kanonische Autorisierungssystem für Azure-Ressourcen.',['ms-rbac'],0.99],
  ['id-rel-032','azure-0965','azure-0964','part_of','Role Assignments sind die konkreten Zugriffszuweisungen innerhalb von Azure RBAC.',['ms-role-assignments'],0.99],
  ['id-rel-033','azure-0965','azure-0967','uses','Eine Role Assignment verweist auf eine Role Definition, die den Berechtigungsumfang beschreibt.',['ms-role-assignments'],0.99],
  ['id-rel-034','azure-0965','azure-0968','uses','Eine Role Assignment verwendet einen Scope, der Reichweite und Vererbung bestimmt.',['ms-role-assignments','ms-role-assignment-steps'],0.99],
  ['id-rel-035','azure-0966','azure-0964','part_of','Least Privilege ist das zentrale Gestaltungsprinzip für Rollen, Zuweisungen und Scopes in Azure RBAC.',['ms-role-assignment-steps'],0.98]
];

for (const source of officialSources) {
  const index = sourcesDocument.sources.findIndex(item => item.id === source.id);
  if (index >= 0) sourcesDocument.sources[index] = source;
  else sourcesDocument.sources.push(source);
}

for (const type of extraRelationTypes) {
  const index = typesDocument.relation_types.findIndex(item => item.id === type.id);
  if (index >= 0) typesDocument.relation_types[index] = type;
  else typesDocument.relation_types.push(type);
}
const typeById = new Map(typesDocument.relation_types.map(type => [type.id, type]));

for (const [id, enrichment] of Object.entries(E)) {
  const node = nodeById.get(id);
  if (!node) throw new Error(`Pilotknoten fehlt: ${id}`);
  const originalTitle = node.title;
  if (enrichment.title) node.title = enrichment.title;
  node.description = {simple:enrichment.simple,technical:enrichment.technical,architecture:enrichment.architecture};
  node.why_important = enrichment.why;
  node.examples = enrichment.examples || [];
  node.merksatz = enrichment.merksatz || '';
  node.analogy = enrichment.analogy || '';
  node.sources = [...new Set([...(node.sources || []), ...enrichment.sources])];
  node.tags = [...new Set([...(node.tags || []), ...(enrichment.tags || []), 'identity-pilot-v1.3'])];
  node.aliases = [...new Set([...(node.aliases || []), ...(enrichment.aliases || []), ...(originalTitle !== node.title ? [originalTitle] : [])])];
  node.metadata = {...node.metadata,status:'published',audit_flags:(node.metadata.audit_flags || []).filter(flag => flag !== 'description_generated_from_title'),enrichment:{version:'1.3',pilot:'identity',content_standard:'1.0',reviewed_at:today,source_policy:'official_microsoft_only'}};
  node.updated_at = today;
}

const pilotRelationIds = new Set(relationDefinitions.map(([id]) => id));
relationsDocument.relations = relationsDocument.relations.filter(relation => !pilotRelationIds.has(relation.id));
for (const node of nodesDocument.nodes) node.relations = (node.relations || []).filter(id => !pilotRelationIds.has(id));

for (const [id, source, target, type, explanation, sources, confidence] of relationDefinitions) {
  if (!nodeById.has(source) || !nodeById.has(target)) throw new Error(`${id}: Endpunkt fehlt`);
  const typeDefinition = typeById.get(type);
  if (!typeDefinition) throw new Error(`${id}: Typ ${type} fehlt`);
  const relation = {schema_version:'1.1',id,source,target,type,inverse_type:typeDefinition.inverse_type,explanation,sources,confidence,status:'accepted',created_by:'knowledge_enrichment_v1.3',created_at:today,reviewed_at:today};
  relationsDocument.relations.push(relation);
  for (const nodeId of [source,target]) {
    const node = nodeById.get(nodeId);
    node.relations = [...new Set([...(node.relations || []), id])];
  }
}

const legacyIdentityRefinements = {
  'rel-012':{explanation:'Azure RBAC autorisiert Security Principals über Role Assignments an Azure-Ressourcen-Scopes wie einer Resource Group.',sources:['ms-rbac','ms-role-assignments'],confidence:0.99,reviewed_at:today},
  'rel-013':{explanation:'PIM ermöglicht zeitlich begrenzte, genehmigte und überwachte Aktivierung privilegierter Azure-RBAC-Rollen.',sources:['ms-pim','ms-rbac'],confidence:0.99,reviewed_at:today},
  'rel-024':{explanation:'Key Vault verwendet Microsoft Entra ID zur Authentifizierung des aufrufenden Security Principals und prüft anschließend dessen Autorisierung.',sources:['ms-keyvault-auth'],confidence:0.99,reviewed_at:today},
  'rel-025':{explanation:'Conditional Access ist die kontextabhängige Zero-Trust-Policy-Engine von Microsoft Entra ID.',sources:['ms-conditional-access'],confidence:0.99,reviewed_at:today}
};
for (const relation of relationsDocument.relations) if (legacyIdentityRefinements[relation.id]) Object.assign(relation, legacyIdentityRefinements[relation.id]);

nodesDocument.meta = {...nodesDocument.meta,enrichment_version:'1.3',identity_pilot:{node_count:Object.keys(E).length,relation_count:relationDefinitions.length,content_standard:'1.0',reviewed_at:today}};
relationsDocument.meta = {...relationsDocument.meta,relation_count:relationsDocument.relations.length,enrichment_version:'1.3',identity_relation_count:relationDefinitions.length};
sourcesDocument.meta = {...sourcesDocument.meta,count:sourcesDocument.sources.length,generated_at:today,enrichment_version:'1.3'};
typesDocument.meta = {...typesDocument.meta,type_count:typesDocument.relation_types.length,updated_at:today,enrichment_version:'1.3'};

write('nodes.json',nodesDocument);
write('relations.json',relationsDocument);
write('sources.json',sourcesDocument);
write('relation-types.json',typesDocument);

console.log(JSON.stringify({enriched_nodes:Object.keys(E).length,added_relations:relationDefinitions.length,total_relations:relationsDocument.relations.length,added_relation_types:extraRelationTypes.length,total_relation_types:typesDocument.relation_types.length,total_sources:sourcesDocument.sources.length},null,2));
