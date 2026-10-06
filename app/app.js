(function(){
  'use strict';

  const DATA=window.AZURE_DIGITAL_BRAIN;
  const V34=window.AZURE_KNOWLEDGE_ARCHITECTURE_V34||null;
  const RELEASE=window.AZURE_DIGITAL_BRAIN_RELEASE||{};
  const ARCH=window.AZURE_ARCHITECTURE_SCENARIOS||{};
  const LEARNING=window.AZURE_ARCHITECTURE_LEARNING||{};
  const NETWORK_FLOW=window.ADB_NETWORKING_LEARNING_V34||null;
  const CLOUD_FLOW=window.ADB_CLOUD_LEARNING_V34||null;
  const AZURE_FLOW=window.ADB_AZURE_LEARNING_V34||null;
  const ORGANIZATION_FLOW=window.ADB_ORGANIZATION_LEARNING_V34||null;
  const ACCESS_FLOW=window.ADB_ACCESS_LEARNING_V34||null;
  const GOVERNANCE_FLOW=window.ADB_GOVERNANCE_LEARNING_V34||null;
  const NAV=window.AZURE_SEMANTIC_NAVIGATION||{meta:{},classifications:[],aliases:[],link_types:{}};
  const EXPERIENCE=window.AZURE_CONTEXT_EXPERIENCE||{release_version:'3.2'};
  const PHASE3_FEATURES=window.AZURE_PHASE3_FEATURES||{};
  const CROSS_MODE_RUNTIME=window.AZURE_CROSS_MODE_CONTEXT||null;
  const CORE=window.AzureSemanticNavigationCore;
  const CROSS_MODE_CORE=window.AzureCrossModeContextCore;
  const KB={meta:DATA?.meta||{},nodes:DATA?.nodes||[]};
  const canonicalNodeIds=new Set(KB.nodes.map(node=>node.id));
  const BRAIN=window.AZURE_BRAIN_SHARED_V34;
  const RELS=DATA?.relations||[];
  const SOURCES=DATA?.sources||[];
  const RELATION_TYPES=DATA?.relation_types||[];
  const v34Active=V34?.status==='ACTIVE'&&V34?.release_version==='3.4'&&V34?.rows?.length===1057&&V34?.taxonomy_slots?.length===258&&V34?.overlays?.length===770&&V34?.resolutions?.length===1057;
  if(V34&&!v34Active){document.body.innerHTML='<div class="error">Die V3.4-Wissensarchitektur ist unvollständig; die Anwendung wurde fail-closed gestoppt.</div>';return;}
  if(!KB.nodes.length){document.body.innerHTML='<div class="error">Die kanonische Wissensbasis konnte nicht geladen werden.</div>';return;}
  if(!ARCH.scenarios?.length||!LEARNING.learning_paths?.length){document.body.innerHTML='<div class="error">Architecture- oder Learning-Runtime konnte nicht geladen werden.</div>';return;}

  const COLORS={
    'Cloud & Azure Foundations':'#7d91a8','Compute & Application Platform':'#52c7ff','Containers & Cloud Native':'#33c6b7','Networking':'#43a6ff',
    'Storage':'#7bd66d','Databases & Data Platforms':'#a889ff','Integration, Messaging & IoT':'#3fd1a5','Identity & Access':'#51e1bf',
    'Security & Protection':'#ff5f73','Governance & Resource Management':'#ff7e88','Cost Management & FinOps':'#f3ce58','Monitoring & Operations':'#ff9c54',
    'Reliability & Resilience':'#f0a35e','Migration & Modernization':'#d08cff','DevOps & Automation':'#b38cff','AI & Analytics':'#45d5d0',
    'Architecture':'#ffb454','Azure Fundamentals':'#7d91a8','Compute':'#52c7ff','Cost & Lifecycle':'#f3ce58','Databases':'#a889ff','Governance':'#ff7e88','Identity':'#51e1bf','Monitoring':'#ff9c54','Security':'#ff5f73'
  };
  const v34RowById=new Map((v34Active?V34.rows:[]).map(row=>[row.node_id,row]));
  const v34OverlayById=new Map((v34Active?V34.overlays:[]).map(overlay=>[overlay.source_node_id,overlay]));
  const v34ResolutionById=new Map((v34Active?V34.resolutions:[]).map(resolution=>[resolution.node_id,resolution]));
  const primaryDomain=n=>{const domain=n?.presentationDomain||v34RowById.get(n?.id)?.proposed_primary_domain||n?.category||'Azure';return v34Active&&n?.id!=='azure-0000'&&!Object.hasOwn(V34.domains,domain)?'Historical Context':domain};
  const nodeById=new Map(KB.nodes.map(n=>[n.id,{...n,childNodes:[]}])) ;
  const sourceById=new Map(SOURCES.map(s=>[s.id,s]));
  const relById=new Map(RELS.map(r=>[r.id,r]));
  const relationTypeById=new Map(RELATION_TYPES.map(type=>[type.id,type]));
  const classificationById=new Map(v34Active?V34.rows.map(row=>[row.node_id,{node_id:row.node_id,classification:row.resolved_classification,proposed_target_position:row.proposed_path,status:row.claim_status}]):(NAV.classifications||[]).map(item=>[item.node_id,item]));
  for(const n of nodeById.values()) n.children.forEach(id=>{const c=nodeById.get(id);if(c)n.childNodes.push(c)});
  const root=[...nodeById.values()].find(n=>!n.parent);
  const categories=(v34Active?Object.keys(V34.domains):[...new Set(KB.nodes.map(n=>n.category))]).sort();
  const scenarioById=new Map(ARCH.scenarios.map(s=>[s.id,s]));
  const learningPathById=new Map(LEARNING.learning_paths.map(p=>[p.id,p]));
  const learningStepById=new Map(LEARNING.learning_paths.flatMap(p=>p.steps.map(s=>[s.id,{...s,path_id:p.id}])));
  // Display order is independent of the legacy paths retained for cross-mode links.
  const learningChapters=[
    {number:1,title:'Cloud verstehen',flow:CLOUD_FLOW,status:'FROZEN / HUMAN REVIEW APPROVED'},
    {number:2,title:'Azure verstehen',flow:AZURE_FLOW,status:'FROZEN / HUMAN REVIEW APPROVED'},
    {number:3,title:'Azure organisieren',flow:ORGANIZATION_FLOW,status:'FROZEN / HUMAN REVIEW APPROVED'},
    {number:4,title:'Zugriff verstehen',flow:ACCESS_FLOW,status:'FROZEN / HUMAN REVIEW APPROVED'},
    {number:5,title:'Azure steuern und schützen',flow:GOVERNANCE_FLOW,status:'FROZEN / HUMAN REVIEW APPROVED'},
    {number:6,title:'Networking verstehen',flow:NETWORK_FLOW,status:'FROZEN / HUMAN REVIEW APPROVED'}
  ].filter(chapter=>chapter.flow).sort((a,b)=>a.number-b.number);
  const consistency=window.ADB_LEARNING_CONSISTENCY_V34;
  const chapterAnchorById=new Map();
  for(const entry of consistency?.primaryAnchors||[]){
    const chapter=learningChapters.find(c=>c.number===entry.primaryChapter),step=chapter?.flow.steps[entry.primaryStep-1];
    if(!canonicalNodeIds.has(entry.canonicalId)||!step||chapterAnchorById.has(entry.canonicalId)||(entry.focusTarget&&!canonicalNodeIds.has(entry.focusTarget.entityId)))throw new Error('Ungültiger Primary Learning Anchor');
    for(const value of entry.furtherContexts||[]){const [number,position]=value.split(':').map(Number);if(!learningChapters.find(c=>c.number===number)?.flow.steps[position-1])throw new Error('Ungültiger weiterer Lernkontext')}
    chapterAnchorById.set(entry.canonicalId,{chapter:chapter.number,flowId:chapter.flow.id,stepId:step.id,stepIndex:entry.primaryStep-1,focusTarget:entry.focusTarget||null,furtherContexts:entry.furtherContexts||[]});
  }
  const maturityById=new Map((LEARNING.maturity_levels||[]).map(m=>[m.id,m]));
  const scenariosByNode=new Map(),stepsByNode=new Map();
  for(const scenario of ARCH.scenarios){const refs=new Set([...(scenario.learning_path||[]),...(scenario.component_instances||[]).map(c=>c.node_ref).filter(Boolean),...(scenario.architecture_flow||[]).flatMap(f=>f.node_refs||[])]);for(const id of refs){if(!scenariosByNode.has(id))scenariosByNode.set(id,[]);scenariosByNode.get(id).push(scenario)}}
  for(const [id,step] of learningStepById)for(const nodeId of step.referenced_nodes||[]){if(!stepsByNode.has(nodeId))stepsByNode.set(nodeId,[]);stepsByNode.get(nodeId).push(step)}
  const crossModeResolver=CROSS_MODE_CORE?.createResolver({featureRuntime:PHASE3_FEATURES,runtime:CROSS_MODE_RUNTIME,knownNodeIds:new Set(nodeById.keys()),scenarioIds:new Set(scenarioById.keys()),learningStepIds:new Set(learningStepById.keys()),scenariosByNode,stepsByNode,queryString:location.search})||{enabled:false,decision:{fallback:'v3.2-direct-maps'},resolve:()=>null};
  const phase3Enabled=Boolean(crossModeResolver.enabled);
  if(PHASE3_FEATURES?.features?.cross_mode_context?.enabled===true&&!phase3Enabled)console.warn('Phase-3-Cross-Mode-Kontext ist ungültig oder wurde deaktiviert; V3.2-Fallback bleibt aktiv.',crossModeResolver.decision);

  // Portfolio pilot: this is a presentation-only hierarchy. Canonical parent/child
  // data, IDs, relations and learning content remain untouched in the runtime data.
  const NETWORKING_PRESENTATION={
    anchorId:'azure-0440',
    titleOverrides:{'azure-0440':'Networking','azure-0493':'ExpressRoute Gateway','azure-0864':'Network Security Group (NSG)'},
    capabilities:[
      {id:'presentation-network-foundations',title:'Network Foundations & DNS',description:'Adressräume, private Netze und Namensauflösung bilden die Grundlage jeder Azure-Netzwerkarchitektur.',why:'Ohne saubere Adress- und DNS-Planung funktionieren Routing, Hybridzugriff und Private Endpoints nicht zuverlässig.',children:['azure-0442','azure-0545']},
      {id:'presentation-routing-traffic',title:'Routing, Load Balancing & Delivery',description:'Diese Dienste bestimmen, welchen Weg Traffic nimmt, wie er Azure verlässt und auf welche Ziele er verteilt wird.',why:'Routing und Traffic-Verteilung entscheiden über Erreichbarkeit, Skalierung, Ausfallsicherheit und Latenz.',children:['azure-0871','azure-1059','azure-0505','azure-0519','azure-0560','azure-0562']},
      {id:'presentation-private-connectivity',title:'Service Connectivity',description:'Öffentliche und private Zugriffsmodelle verbinden Anwendungen mit Azure-Diensten.',why:'Das passende Zugriffsmodell bestimmt Netzwerkpfad und Zugriffskontrollen.',children:['azure-0878','azure-0882']},
      {id:'presentation-hybrid-global',title:'Hybrid & Transit Connectivity',description:'Azure-Netze, lokale Standorte, Benutzer und Regionen werden über private oder verschlüsselte Transitpfade verbunden.',why:'Diese Capability verbindet verteilte Umgebungen und legt fest, wer über welchen Transitpfad miteinander kommuniziert.',children:['azure-0887','azure-0462','azure-0478','azure-1058']},
      {id:'presentation-network-controls',title:'Network Security & Controls',description:'Lokale Netzwerkregeln steuern Datenverkehr; zentrale Firewall-, WAF- und DDoS-Dienste ergänzen den Schutz über Domain-Grenzen hinweg.',why:'Netzwerkpfade sind erst dann belastbar, wenn erlaubter und unerwünschter Verkehr bewusst kontrolliert wird.',children:['azure-0864'],relatedNodes:['azure-0841','azure-0852']}
    ],
    nested:{'azure-0442':['azure-0453'],'azure-0545':['azure-0558','azure-1060'],'azure-0478':['azure-0493'],'azure-0882':['azure-0881']}
  };
  const presentationParentById=new Map(),presentationCapabilityById=new Map(),presentationNodeIds=new Set();
  function applyNetworkingPresentation(){
    const anchor=nodeById.get(NETWORKING_PRESENTATION.anchorId);if(!anchor)return;
    for(const node of nodeById.values())node.originalChildNodes=[...node.childNodes];
    anchor.presentationDomain='Networking';anchor.presentationDepth=4;anchor.description={simple:'Azure Networking verbindet Azure-Ressourcen untereinander, mit lokalen Netzwerken und mit dem Internet. Die Domain bündelt Grundlagen, Routing, private Dienste, Hybridverbindungen und Netzwerksteuerung.',technical:'Azure Networking umfasst softwaredefinierte Netze, DNS, Routing, Lastverteilung, private Dienstzugriffe und hybride Transitpfade. Die sichtbare Struktur trennt fachliche Hierarchie von semantischen Querverbindungen zu Security, Operations und anderen Domains.',architecture:'Netzwerkarchitektur beginnt mit überschneidungsfreien Adressräumen und zuverlässigem DNS. Darauf folgen Routing, Egress, private Endpunkte, Hybridkonnektivität sowie mehrschichtige Kontrollen und Observability.'};anchor.why_important='Nahezu jeder Azure-Workload hängt von erreichbaren, sicheren und nachvollziehbaren Netzwerkpfaden ab.';anchor.analogy='Vereinfacht ist Azure Networking die Verkehrsplanung einer Cloud-Stadt: Straßennetze, Adressverzeichnisse, Wegweiser, Tunnel und Zugangskontrollen müssen zusammenspielen.';anchor.merksatz='Networking verbindet, lenkt und schützt die Kommunikationswege eines Azure-Workloads.';
    const capabilityNodes=NETWORKING_PRESENTATION.capabilities.map(capability=>{
      const node={id:capability.id,title:capability.title,description:{simple:capability.description,technical:'',architecture:''},why_important:capability.why||'',parent:anchor.id,children:[...capability.children],childNodes:[],originalChildNodes:[],relations:[],sources:[],examples:[],aliases:[],tags:['presentation-only'],metadata:{importance:7,status:'presentation'},category:'Networking',presentationDomain:'Networking',presentationOnly:true,presentationDepth:5,relatedNodes:capability.relatedNodes||[]};
      nodeById.set(node.id,node);presentationNodeIds.add(node.id);presentationParentById.set(node.id,anchor.id);
      for(const id of capability.children){const child=nodeById.get(id);if(!child)continue;child.presentationDepth=6;child.childNodes=[];node.childNodes.push(child);presentationParentById.set(id,node.id);presentationCapabilityById.set(id,capability.title)}
      return node;
    });
    anchor.childNodes=capabilityNodes;
    for(const [parentId,childIds] of Object.entries(NETWORKING_PRESENTATION.nested)){
      const parent=nodeById.get(parentId);if(!parent)continue;parent.childNodes=childIds.map(id=>nodeById.get(id)).filter(Boolean);
      for(const id of childIds){const child=nodeById.get(id);if(!child)continue;child.presentationDepth=7;child.childNodes=[];presentationParentById.set(id,parentId);presentationCapabilityById.set(id,presentationCapabilityById.get(parentId)||'Networking')}
    }
  }
  applyNetworkingPresentation();
  const STORAGE_PRESENTATION={
    anchorId:'azure-0566',
    titleOverrides:{'azure-0566':'Storage','azure-0579':'Azure Storage Account','azure-0574':'Blob Access Tiers (Hot, Cool, Cold, Archive)','azure-0584':'Storage Redundancy','azure-0585':'Locally Redundant Storage (LRS)','azure-0587':'Zone-Redundant Storage (ZRS)','azure-0589':'Geo-Redundant Storage (GRS)','azure-0592':'Geo-Zone-Redundant Storage (GZRS)'},
    capabilities:[
      {id:'presentation-storage-foundations',title:'Storage Foundations & Accounts',description:'Der Storage Account definiert den Verwaltungs-, Zugriffs- und Konfigurationsrahmen für Azure-Speicherdienste.',children:['azure-0579']},
      {id:'presentation-storage-object',title:'Object Storage & Data Lakes',description:'Objektspeicher nimmt unstrukturierte Daten auf; Data Lake Storage ergänzt Analysefunktionen.',children:['azure-0571','azure-0616']},
      {id:'presentation-storage-file-block',title:'File Shares & VM Disks',description:'Freigaben und VM-Datenträger erfüllen unterschiedliche Anforderungen an gemeinsamen Datei- und Blockzugriff.',children:['azure-0596','azure-0567']},
      {id:'presentation-storage-message-data',title:'Queues & NoSQL Tables',description:'Queue Storage entkoppelt Verarbeitungsschritte; Table Storage hält einfache NoSQL-Daten.',children:['azure-0624','azure-0632']},
      {id:'presentation-storage-resilience',title:'Redundancy & Data Protection',description:'Redundanz legt fest, in welchen Ausfallbereichen Azure Speicherdaten repliziert.',children:['azure-0584']},
      {id:'presentation-storage-transfer',title:'Data Transfer & Tools',description:'Werkzeuge übertragen und verwalten Daten; Data Box unterstützt große Offline-Transfers.',children:['azure-0605','azure-0609','azure-0638']}
    ],
    nested:{'azure-0571':['azure-0583','azure-0574'],'azure-0596':['azure-0601'],'azure-0584':['azure-0585','azure-0587','azure-0589','azure-0592']}
  };
  const storageVisibleIds=new Set([STORAGE_PRESENTATION.anchorId,...STORAGE_PRESENTATION.capabilities.map(capability=>capability.id),...STORAGE_PRESENTATION.capabilities.flatMap(capability=>capability.children),...Object.values(STORAGE_PRESENTATION.nested).flat()]);
  function applyStoragePresentation(){
    const anchor=nodeById.get(STORAGE_PRESENTATION.anchorId);if(!anchor)return;
    anchor.presentationDomain='Storage';anchor.presentationDepth=4;
    const capabilityNodes=STORAGE_PRESENTATION.capabilities.map(capability=>{
      const node={id:capability.id,title:capability.title,description:{simple:capability.description,technical:'',architecture:''},why_important:'',parent:anchor.id,children:[...capability.children],childNodes:[],originalChildNodes:[],relations:[],sources:[],examples:[],aliases:[],tags:['presentation-only'],metadata:{importance:7,status:'presentation'},category:'Storage',presentationDomain:'Storage',presentationOnly:true,presentationDepth:5,relatedNodes:[]};
      nodeById.set(node.id,node);presentationNodeIds.add(node.id);presentationParentById.set(node.id,anchor.id);
      for(const id of capability.children){const child=nodeById.get(id);if(!child)continue;child.presentationDepth=6;child.childNodes=[];node.childNodes.push(child);presentationParentById.set(id,node.id);presentationCapabilityById.set(id,capability.title)}
      return node;
    });
    anchor.childNodes=capabilityNodes;
    for(const [parentId,childIds] of Object.entries(STORAGE_PRESENTATION.nested)){
      const parent=nodeById.get(parentId);if(!parent)continue;parent.childNodes=childIds.map(id=>nodeById.get(id)).filter(Boolean);
      for(const id of childIds){const child=nodeById.get(id);if(!child)continue;child.presentationDepth=7;child.childNodes=[];presentationParentById.set(id,parentId);presentationCapabilityById.set(id,presentationCapabilityById.get(parentId)||'Storage')}
    }
  }
  applyStoragePresentation();
  const storageLegacyTargets={'azure-0568':'azure-0567','azure-0575':'azure-0574','azure-0576':'azure-0574','azure-0578':'azure-0574','azure-0591':'azure-0589','azure-0594':'azure-0592','azure-0595':'azure-0571','azure-0597':'azure-0596','azure-0640':'azure-0638','azure-0880':'azure-0566'};
  const COMPUTE_PRESENTATION={
    anchorId:'azure-0321',
    titleOverrides:{'azure-0321':'Compute & Application Platform','azure-0322':'Azure Virtual Machines (VMs)','azure-0387':'Azure Virtual Machine Scale Sets (VMSS)','azure-0025':'Azure Monitor Autoscale','azure-0805':'Web App','azure-0772':'Azure Functions'},
    capabilities:[
      {id:'presentation-compute-infrastructure',title:'Virtual Machines & Scaling',description:'Virtuelle Server, VM-Gruppen, Verfügbarkeit und automatische Skalierung für Workloads mit Infrastrukturkontrolle.',children:['azure-0322','azure-0387','azure-0025']},
      {id:'presentation-compute-app-service',title:'Managed Web Application Hosting',description:'App Service betreibt Webanwendungen und APIs auf verwalteter Plattformkapazität.',children:['azure-0351']},
      {id:'presentation-compute-serverless',title:'Event-Driven & Serverless Compute',description:'Azure Functions führt Code ereignisgesteuert aus, ohne dass Teams Server selbst betreiben müssen.',children:['azure-0772']}
    ],
    nested:{'azure-0322':['azure-0005'],'azure-0351':['azure-0805','azure-0363']}
  };
  const computeVisibleIds=new Set([COMPUTE_PRESENTATION.anchorId,...COMPUTE_PRESENTATION.capabilities.map(capability=>capability.id),...COMPUTE_PRESENTATION.capabilities.flatMap(capability=>capability.children),...Object.values(COMPUTE_PRESENTATION.nested).flat()]);
  function applyComputePresentation(){
    const anchor=nodeById.get(COMPUTE_PRESENTATION.anchorId);if(!anchor)return;
    anchor.presentationDomain='Compute & Application Platform';anchor.presentationDepth=4;
    const capabilityNodes=COMPUTE_PRESENTATION.capabilities.map(capability=>{
      const node={id:capability.id,title:capability.title,description:{simple:capability.description,technical:'',architecture:''},why_important:'',parent:anchor.id,children:[...capability.children],childNodes:[],originalChildNodes:[],relations:[],sources:[],examples:[],aliases:[],tags:['presentation-only'],metadata:{importance:7,status:'presentation'},category:'Compute & Application Platform',presentationDomain:'Compute & Application Platform',presentationOnly:true,presentationDepth:5,relatedNodes:[]};
      nodeById.set(node.id,node);presentationNodeIds.add(node.id);presentationParentById.set(node.id,anchor.id);
      for(const id of capability.children){const child=nodeById.get(id);if(!child)continue;child.presentationDepth=6;child.childNodes=[];node.childNodes.push(child);presentationParentById.set(id,node.id);presentationCapabilityById.set(id,capability.title)}
      return node;
    });
    anchor.childNodes=capabilityNodes;
    for(const [parentId,childIds] of Object.entries(COMPUTE_PRESENTATION.nested)){
      const parent=nodeById.get(parentId);if(!parent)continue;parent.childNodes=childIds.map(id=>nodeById.get(id)).filter(Boolean);
      for(const id of childIds){const child=nodeById.get(id);if(!child)continue;child.presentationDepth=7;child.childNodes=[];presentationParentById.set(id,parentId);presentationCapabilityById.set(id,presentationCapabilityById.get(parentId)||'Compute & Application Platform')}
    }
  }
  applyComputePresentation();
  const computeLegacyTargets={'azure-0400':'azure-0025','azure-0771':'azure-0772','azure-0774':'azure-0772'};
  const CONTAINERS_PRESENTATION={
    anchorId:'azure-0412',
    titleOverrides:{'azure-0412':'Containers & Cloud Native','azure-0413':'Container Images & Runtime','azure-0415':'Azure Container Instances (ACI)','azure-0425':'Azure Kubernetes Service (AKS)','azure-1061':'Azure Container Registry (ACR)'},
    capabilities:[
      {id:'presentation-containers-foundations',title:'Container Images & Registry',description:'Containerimages verpacken Anwendungen; eine Registry speichert und verteilt ihre Versionen.',children:['azure-0413','azure-1061']},
      {id:'presentation-containers-runtime',title:'Managed Container Execution',description:'ACI startet Containergruppen direkt; Container Apps betreibt Anwendungen und Jobs mit integrierter Skalierung.',children:['azure-0415','azure-1062']},
      {id:'presentation-containers-kubernetes',title:'Kubernetes Orchestration',description:'AKS bietet verwaltetes Kubernetes für Teams, die Kubernetes-Funktionen und Plattformkontrolle benötigen.',children:['azure-0425']}
    ],nested:{}
  };
  const containersVisibleIds=new Set([CONTAINERS_PRESENTATION.anchorId,...CONTAINERS_PRESENTATION.capabilities.map(capability=>capability.id),...CONTAINERS_PRESENTATION.capabilities.flatMap(capability=>capability.children)]);
  function applyContainersPresentation(){
    const anchor=nodeById.get(CONTAINERS_PRESENTATION.anchorId);if(!anchor)return;
    anchor.presentationDomain='Containers & Cloud Native';anchor.presentationDepth=4;
    const capabilityNodes=CONTAINERS_PRESENTATION.capabilities.map(capability=>{
      const node={id:capability.id,title:capability.title,description:{simple:capability.description,technical:'',architecture:''},why_important:'',parent:anchor.id,children:[...capability.children],childNodes:[],originalChildNodes:[],relations:[],sources:[],examples:[],aliases:[],tags:['presentation-only'],metadata:{importance:7,status:'presentation'},category:'Containers & Cloud Native',presentationDomain:'Containers & Cloud Native',presentationOnly:true,presentationDepth:5,relatedNodes:[]};
      nodeById.set(node.id,node);presentationNodeIds.add(node.id);presentationParentById.set(node.id,anchor.id);
      for(const id of capability.children){const child=nodeById.get(id);if(!child)continue;child.presentationDomain='Containers & Cloud Native';child.presentationDepth=6;child.childNodes=[];node.childNodes.push(child);presentationParentById.set(id,node.id);presentationCapabilityById.set(id,capability.title)}
      return node;
    });
    anchor.childNodes=capabilityNodes;
  }
  applyContainersPresentation();
  const containersLegacyTargets={'azure-0414':'azure-0413','azure-0416':'azure-0415','azure-0426':'azure-0425','azure-0437':'azure-0413'};
  const DATABASES_PRESENTATION={
    anchorId:'azure-0723',
    titleOverrides:{'azure-0723':'Databases & Data Platforms','azure-0743':'Azure Database for PostgreSQL','azure-0760':'Azure Synapse Analytics'},
    capabilities:[
      {id:'presentation-databases-relational',title:'Managed Relational Databases',description:'Verwaltete SQL- und Open-Source-Datenbanken für strukturierte Daten und Transaktionen.',children:['azure-0731','azure-1063','azure-0743','azure-1064']},
      {id:'presentation-databases-nosql',title:'Distributed NoSQL',description:'Flexible Datenmodelle, horizontale Skalierung und globale Verteilung für passende Anwendungsworkloads.',children:['azure-0724']},
      {id:'presentation-databases-analytics',title:'Analytics & Data Platforms',description:'Plattformen für Data Warehousing, Verarbeitung, Integration und organisationsweite Analyse.',children:['azure-0760','azure-1065']}
    ],nested:{}
  };
  const databasesVisibleIds=new Set([DATABASES_PRESENTATION.anchorId,...DATABASES_PRESENTATION.capabilities.map(capability=>capability.id),...DATABASES_PRESENTATION.capabilities.flatMap(capability=>capability.children)]);
  function applyDatabasesPresentation(){
    const anchor=nodeById.get(DATABASES_PRESENTATION.anchorId);if(!anchor)return;
    anchor.presentationDomain='Databases & Data Platforms';anchor.presentationDepth=4;
    const legacyAnalyticsParent=nodeById.get('azure-0754');if(legacyAnalyticsParent)legacyAnalyticsParent.childNodes=legacyAnalyticsParent.childNodes.filter(child=>child.id!=='azure-0759');
    const capabilityNodes=DATABASES_PRESENTATION.capabilities.map(capability=>{
      const node={id:capability.id,title:capability.title,description:{simple:capability.description,technical:'',architecture:''},why_important:'',parent:anchor.id,children:[...capability.children],childNodes:[],originalChildNodes:[],relations:[],sources:[],examples:[],aliases:[],tags:['presentation-only'],metadata:{importance:7,status:'presentation'},category:'Databases & Data Platforms',presentationDomain:'Databases & Data Platforms',presentationOnly:true,presentationDepth:5,relatedNodes:[]};
      nodeById.set(node.id,node);presentationNodeIds.add(node.id);presentationParentById.set(node.id,anchor.id);
      for(const id of capability.children){const child=nodeById.get(id);if(!child)continue;child.presentationDomain='Databases & Data Platforms';child.presentationDepth=6;child.childNodes=[];node.childNodes.push(child);presentationParentById.set(id,node.id);presentationCapabilityById.set(id,capability.title)}
      return node;
    });anchor.childNodes=capabilityNodes;
  }
  applyDatabasesPresentation();
  const databasesLegacyTargets={'azure-0650':'azure-0724','azure-0654':'azure-0724','azure-0759':'azure-0723','azure-0762':'azure-0723','azure-0764':'azure-0723'};
  const INTEGRATION_PRESENTATION={
    anchorId:'presentation-integration-domain',
    capabilities:[
      {id:'presentation-integration-messaging',title:'Reliable Messaging',description:'Dauerhafte Arbeitsnachrichten entkoppeln Anwendungen und sichern die spätere Verarbeitung.',children:['azure-1066']},
      {id:'presentation-integration-events',title:'Events & Streaming',description:'Event Grid verteilt einzelne Ereignisse; Event Hubs nimmt kontinuierliche Datenströme auf.',children:['azure-0785','azure-0779']},
      {id:'presentation-integration-api-workflow',title:'API & Workflow Integration',description:'API Management steuert API-Zugänge; Logic Apps orchestriert systemübergreifende Abläufe.',children:['azure-1067','azure-0782']},
      {id:'presentation-integration-iot',title:'Device Connectivity',description:'IoT Hub verbindet Geräte und Cloud-Anwendungen mit gerätebezogener Kommunikation.',children:['azure-0766']}
    ]
  };
  const integrationVisibleIds=new Set([INTEGRATION_PRESENTATION.anchorId,...INTEGRATION_PRESENTATION.capabilities.map(capability=>capability.id),...INTEGRATION_PRESENTATION.capabilities.flatMap(capability=>capability.children)]);
  function applyIntegrationPresentation(){
    const parent=nodeById.get('azure-0320');if(!parent)return;
    const oldSolutions=nodeById.get('azure-0754');if(oldSolutions){oldSolutions.childNodes=oldSolutions.childNodes.filter(child=>!['azure-0755','azure-1066','azure-1067'].includes(child.id));const azureSphere=nodeById.get('azure-0758');if(azureSphere&&!oldSolutions.childNodes.some(child=>child.id===azureSphere.id)){oldSolutions.childNodes.push(azureSphere);presentationParentById.set(azureSphere.id,oldSolutions.id)}}
    const oldServerless=nodeById.get('azure-0771');if(oldServerless)oldServerless.childNodes=oldServerless.childNodes.filter(child=>!['azure-0779','azure-0782','azure-0785','azure-0792'].includes(child.id));
    const anchor={id:INTEGRATION_PRESENTATION.anchorId,title:'Integration, Messaging & IoT',description:{simple:'Diese Domain verbindet Anwendungen, verteilt Nachrichten und Ereignisse, verwaltet APIs und bindet Geräte an Azure an.',technical:'Service Bus bietet dauerhafte Arbeitsnachrichten, Event Grid routet diskrete Ereignisse und Event Hubs nimmt Datenströme auf. API Management, Logic Apps und IoT Hub ergänzen API-Zugang, Workflows und Gerätekommunikation.',architecture:'Wähle nach Kommunikationsmuster: Auftrag, Ereignis, Stream, API, Workflow oder Gerätekanal. Identität, Netzwerk, Sicherheit und Betrieb bleiben bereichsübergreifende Architekturentscheidungen.'},why_important:'Die passende Integrationsform bestimmt Entkopplung, Zuverlässigkeit und Skalierung.',parent:parent.id,children:INTEGRATION_PRESENTATION.capabilities.map(c=>c.id),childNodes:[],originalChildNodes:[],relations:[],sources:[],examples:['Ein IoT-Gerät sendet Daten an IoT Hub; Event Hubs nimmt den Strom auf, während Event Grid eine Reaktion auf ein bestimmtes Ereignis auslöst.'],analogy:'Vereinfacht ist Integration das Kommunikationssystem einer Stadt: Poststelle, Ereignismelder, Datenstrom, Empfangstheke, Ablaufplan und Geräte-Leitstelle erfüllen verschiedene Aufgaben.',merksatz:'Erst das Kommunikationsmuster klären, dann den Azure-Dienst wählen.',aliases:[],tags:['presentation-only'],metadata:{importance:8,status:'presentation'},category:'Integration, Messaging & IoT',presentationDomain:'Integration, Messaging & IoT',presentationOnly:true,presentationDepth:4,relatedNodes:[]};
    nodeById.set(anchor.id,anchor);presentationNodeIds.add(anchor.id);presentationParentById.set(anchor.id,parent.id);parent.childNodes.push(anchor);
    const capabilityNodes=INTEGRATION_PRESENTATION.capabilities.map(capability=>{
      const node={id:capability.id,title:capability.title,description:{simple:capability.description,technical:'',architecture:''},why_important:'',parent:anchor.id,children:[...capability.children],childNodes:[],originalChildNodes:[],relations:[],sources:[],examples:[],aliases:[],tags:['presentation-only'],metadata:{importance:7,status:'presentation'},category:'Integration, Messaging & IoT',presentationDomain:'Integration, Messaging & IoT',presentationOnly:true,presentationDepth:5,relatedNodes:[]};
      nodeById.set(node.id,node);presentationNodeIds.add(node.id);presentationParentById.set(node.id,anchor.id);
      for(const id of capability.children){const child=nodeById.get(id);if(!child)continue;child.presentationDomain='Integration, Messaging & IoT';child.presentationDepth=6;child.childNodes=[];node.childNodes.push(child);presentationParentById.set(id,node.id);presentationCapabilityById.set(id,capability.title)}return node;
    });anchor.childNodes=capabilityNodes;
  }
  applyIntegrationPresentation();
  const IDENTITY_PRESENTATION={
    anchorId:'presentation-identity-domain',
    capabilities:[
      {id:'presentation-identity-directory',title:'Directory & Principals',description:'Entra ID verwaltet Personen, Gruppen und Anwendungsidentitäten als Grundlage für Cloud-Zugriffe.',children:['azure-0904','azure-0947']},
      {id:'presentation-identity-authentication',title:'Authentication & Access',description:'Anmeldung, Single Sign-On, MFA und Conditional Access steuern, wie Identitäten Zugang erhalten.',children:['azure-0908','azure-0928','azure-0912']},
      {id:'presentation-identity-authorization',title:'Authorization & Privileged Access',description:'Azure RBAC vergibt Ressourcenrechte; PIM begrenzt privilegierte Rollen zeitlich.',children:['azure-0964','azure-0046']},
      {id:'presentation-identity-external',title:'External Identities',description:'B2B verbindet Partneridentitäten; External ID unterstützt Kundenidentitäten in Anwendungen.',children:['azure-1069']}
    ],nested:{'azure-0904':['azure-1068','azure-0909'],'azure-1069':['azure-0925']}
  };
  const identityVisibleIds=new Set([IDENTITY_PRESENTATION.anchorId,...IDENTITY_PRESENTATION.capabilities.map(c=>c.id),...IDENTITY_PRESENTATION.capabilities.flatMap(c=>c.children),...Object.values(IDENTITY_PRESENTATION.nested).flat()]);
  function applyIdentityPresentation(){
    const parent=nodeById.get('azure-0320');if(!parent)return;
    for(const [oldParent,childId] of [['azure-0815','azure-0902'],['azure-0946','azure-0947'],['azure-0961','azure-0964'],['azure-0043','azure-0044']]){const old=nodeById.get(oldParent);if(old)old.childNodes=old.childNodes.filter(child=>child.id!==childId)}
    const anchor={id:IDENTITY_PRESENTATION.anchorId,title:'Identity & Access',description:{simple:'Identity & Access verwaltet Identitäten und entscheidet über Anmeldung und Berechtigungen für Azure-Ressourcen und Anwendungen.',technical:'Microsoft Entra ID stellt Verzeichnis und Anmeldung bereit. Conditional Access und MFA steuern den Zugang; Azure RBAC autorisiert Ressourcenzugriffe und PIM begrenzt privilegierte Rollen.',architecture:'Trenne menschliche, Anwendungs- und Kundenidentitäten. Vergib minimale Rechte, plane starke Anmeldung und berücksichtige den Tenant als zentrale Abhängigkeit.'},why_important:'Jede Azure-Architektur braucht nachvollziehbare Identitäten, sichere Anmeldungen und passende Berechtigungen.',parent:parent.id,children:IDENTITY_PRESENTATION.capabilities.map(c=>c.id),childNodes:[],originalChildNodes:[],relations:[],sources:['ms-entra-overview','ms-rbac','ms-external-identities-overview'],examples:['Eine Web-App nutzt eine Managed Identity für den Zugriff auf Storage; eine Betriebsgruppe erhält per Azure RBAC nur die nötigen Rechte.'],analogy:'Vereinfacht entspricht Entra ID dem Ausweisregister, MFA der zusätzlichen Identitätsprüfung, Conditional Access der situativen Eingangskontrolle und RBAC der Berechtigung für bestimmte Räume.',merksatz:'Identität belegt, wer anfragt; Berechtigung entscheidet, was erlaubt ist.',aliases:[],tags:['presentation-only'],metadata:{importance:8,status:'presentation'},category:'Identity & Access',presentationDomain:'Identity & Access',presentationOnly:true,presentationDepth:4,relatedNodes:[]};
    nodeById.set(anchor.id,anchor);presentationNodeIds.add(anchor.id);presentationParentById.set(anchor.id,parent.id);parent.childNodes.push(anchor);
    anchor.childNodes=IDENTITY_PRESENTATION.capabilities.map(c=>{const node={id:c.id,title:c.title,description:{simple:c.description,technical:'',architecture:''},why_important:'',parent:anchor.id,children:[...c.children],childNodes:[],originalChildNodes:[],relations:[],sources:[],examples:[],aliases:[],tags:['presentation-only'],metadata:{importance:7,status:'presentation'},category:'Identity & Access',presentationDomain:'Identity & Access',presentationOnly:true,presentationDepth:5,relatedNodes:[]};nodeById.set(node.id,node);presentationNodeIds.add(node.id);presentationParentById.set(node.id,anchor.id);for(const id of c.children){const child=nodeById.get(id);if(!child)continue;child.presentationDomain='Identity & Access';child.presentationDepth=6;child.childNodes=[];node.childNodes.push(child);presentationParentById.set(id,node.id);presentationCapabilityById.set(id,c.title)}return node});
    for(const [parentId,childIds] of Object.entries(IDENTITY_PRESENTATION.nested)){const parentNode=nodeById.get(parentId);if(!parentNode)continue;parentNode.childNodes=childIds.map(id=>nodeById.get(id)).filter(Boolean);for(const id of childIds){const child=nodeById.get(id);if(!child)continue;child.presentationDomain='Identity & Access';child.presentationDepth=7;child.childNodes=[];presentationParentById.set(id,parentId);presentationCapabilityById.set(id,presentationCapabilityById.get(parentId)||'Identity & Access')}}
  }
  applyIdentityPresentation();
  const identityLegacyTargets={'azure-0902':'azure-0904','azure-0903':'azure-0908','azure-0907':'azure-0908','azure-0913':'azure-0912','azure-0914':'azure-0912','azure-0915':'azure-0912','azure-0916':'azure-0912','azure-0930':'azure-0928','azure-0044':'azure-0964','azure-0926':'azure-1069'};

  const SECURITY_PRESENTATION={
    anchorId:'azure-0815',
    capabilities:[
      {id:'presentation-security-foundations',title:'Security Architecture',description:'Defense in Depth verbindet unabhängige Schutzschichten zu einem belastbaren Sicherheitsmodell.',children:['azure-0817']},
      {id:'presentation-security-posture',title:'Cloud Posture & Workload Protection',description:'Defender for Cloud bewertet Fehlkonfigurationen und ergänzt je nach Plan Laufzeitschutz.',children:['azure-0933']},
      {id:'presentation-security-detection',title:'Threat Detection & Response',description:'Sentinel korreliert Sicherheitsereignisse; Defender for Identity erkennt Angriffe auf Identitäten.',children:['azure-0937','azure-0960']},
      {id:'presentation-security-network',title:'Network & Web Threat Protection',description:'Firewall, DDoS-Schutz und WAF kontrollieren unterschiedliche Arten schädlichen Verkehrs.',children:['azure-0841','azure-0852','azure-0863']},
      {id:'presentation-security-secrets',title:'Secrets & Key Protection',description:'Key Vault verwaltet sensitive Schlüssel, Secrets und Zertifikate für Anwendungen und Dienste.',children:['azure-0944']}
    ]
  };
  const securityVisibleIds=new Set([SECURITY_PRESENTATION.anchorId,...SECURITY_PRESENTATION.capabilities.map(c=>c.id),...SECURITY_PRESENTATION.capabilities.flatMap(c=>c.children)]);
  function applySecurityPresentation(){
    const anchor=nodeById.get(SECURITY_PRESENTATION.anchorId);if(!anchor)return;
    const oldConceptParent=nodeById.get('azure-0070');if(oldConceptParent)oldConceptParent.childNodes=oldConceptParent.childNodes.filter(child=>child.id!=='azure-0073');
    anchor.presentationDomain='Security & Protection';anchor.presentationDepth=1;anchor.relations=['security-rel-003','security-rel-009'];
    anchor.childNodes=SECURITY_PRESENTATION.capabilities.map(c=>{const node={id:c.id,title:c.title,description:{simple:c.description,technical:'',architecture:''},why_important:'',parent:anchor.id,children:[...c.children],childNodes:[],originalChildNodes:[],relations:[],sources:[],examples:[],aliases:[],tags:['presentation-only'],metadata:{importance:7,status:'presentation'},category:'Security & Protection',presentationDomain:'Security & Protection',presentationOnly:true,presentationDepth:2,relatedNodes:[]};nodeById.set(node.id,node);presentationNodeIds.add(node.id);presentationParentById.set(node.id,anchor.id);for(const id of c.children){const child=nodeById.get(id);if(!child)continue;child.presentationDomain='Security & Protection';child.presentationDepth=3;child.childNodes=[];node.childNodes.push(child);presentationParentById.set(id,node.id);presentationCapabilityById.set(id,c.title)}return node});
  }
  applySecurityPresentation();
  const securityLegacyTargets={'azure-0073':'azure-0817','azure-0074':'azure-0815','azure-0076':'azure-0944','azure-0816':'azure-0815','azure-0932':'azure-0815','azure-0934':'azure-0933','azure-0935':'azure-0933','azure-0936':'azure-0933','azure-0959':'azure-0960','azure-0945':'azure-0944','azure-0946':'azure-0944','azure-0846':'azure-0841','azure-0848':'azure-0841','azure-0850':'azure-0841','azure-0853':'azure-0852','azure-0855':'azure-0852','azure-0860':'azure-0852'};

  const GOVERNANCE_PRESENTATION={
    anchorId:'azure-0036',
    capabilities:[
      {id:'presentation-governance-hierarchy',title:'Resource Hierarchy & Scopes',description:'Management Groups, Subscriptions und Resource Groups ordnen Ressourcen und definieren Governance-Scopes.',children:['azure-1022','azure-1011','azure-0277']},
      {id:'presentation-governance-controls',title:'Policy & Resource Guardrails',description:'Azure Policy prüft Standards; Initiatives bündeln Regeln und Locks schützen vor unbeabsichtigten Änderungen.',children:['azure-0962','azure-0970']},
      {id:'presentation-governance-control-plane',title:'Resource Management & Inventory',description:'ARM verarbeitet Verwaltungsanfragen, Resource Providers stellen Ressourcentypen bereit und Resource Graph macht Bestände abfragbar.',children:['azure-0284','azure-1071']},
      {id:'presentation-governance-standards',title:'Platform Foundations & Standards',description:'Landing Zones verbinden Plattform- und Workload-Architektur über mehrere Designbereiche; Tags standardisieren Ressourcenmetadaten.',children:['azure-0980','azure-0054']}
    ],nested:{'azure-0962':['azure-0041'],'azure-0284':['azure-1070']}
  };
  const governanceVisibleIds=new Set([GOVERNANCE_PRESENTATION.anchorId,...GOVERNANCE_PRESENTATION.capabilities.map(c=>c.id),...GOVERNANCE_PRESENTATION.capabilities.flatMap(c=>c.children),...Object.values(GOVERNANCE_PRESENTATION.nested).flat()]);
  function applyGovernancePresentation(){
    const anchor=nodeById.get(GOVERNANCE_PRESENTATION.anchorId);if(!anchor)return;
    for(const [parentId,childIds] of [['azure-0236',['azure-0277','azure-0807']],['azure-1010',['azure-1011','azure-1035']],['azure-0000',['azure-1050']]]){const old=nodeById.get(parentId);if(old)old.childNodes=old.childNodes.filter(child=>!childIds.includes(child.id))}
    for(const [newParentId,childIds] of [['azure-0002',['azure-0048']],['azure-0236',['azure-0290','azure-0300','azure-0809','azure-0810','azure-0811','azure-0814']],['azure-1010',['azure-1013','azure-1018','azure-1020']]]){const newParent=nodeById.get(newParentId);if(!newParent)continue;for(const id of childIds){const child=nodeById.get(id);if(child&&!newParent.childNodes.some(item=>item.id===id)){newParent.childNodes.push(child);presentationParentById.set(id,newParentId)}}}
    anchor.presentationDomain='Governance & Resource Management';anchor.presentationDepth=3;anchor.relations=['gov-rel-011'];
    anchor.childNodes=GOVERNANCE_PRESENTATION.capabilities.map(c=>{const node={id:c.id,title:c.title,description:{simple:c.description,technical:'',architecture:''},why_important:'',parent:anchor.id,children:[...c.children],childNodes:[],originalChildNodes:[],relations:[],sources:[],examples:[],aliases:[],tags:['presentation-only'],metadata:{importance:7,status:'presentation'},category:'Governance & Resource Management',presentationDomain:'Governance & Resource Management',presentationOnly:true,presentationDepth:4,relatedNodes:[]};nodeById.set(node.id,node);presentationNodeIds.add(node.id);presentationParentById.set(node.id,anchor.id);for(const id of c.children){const child=nodeById.get(id);if(!child)continue;child.presentationDomain='Governance & Resource Management';child.presentationDepth=5;child.childNodes=[];node.childNodes.push(child);presentationParentById.set(id,node.id);presentationCapabilityById.set(id,c.title)}return node});
    for(const [parentId,childIds] of Object.entries(GOVERNANCE_PRESENTATION.nested)){const parent=nodeById.get(parentId);if(!parent)continue;parent.childNodes=childIds.map(id=>nodeById.get(id)).filter(Boolean);for(const id of childIds){const child=nodeById.get(id);if(!child)continue;child.presentationDomain='Governance & Resource Management';child.presentationDepth=6;child.childNodes=[];presentationParentById.set(id,parentId);presentationCapabilityById.set(id,presentationCapabilityById.get(parentId)||'Governance & Resource Management')}}
  }
  applyGovernancePresentation();
  const governanceLegacyTargets={'azure-0037':'azure-0036','azure-0038':'azure-1022','azure-0039':'azure-1022','azure-0040':'azure-0962','azure-0042':'azure-0962','azure-0059':'azure-0962','azure-0293':'azure-0980','azure-0294':'azure-0970','azure-0981':'azure-0980','azure-1023':'azure-1022','azure-0961':'azure-0036','azure-0972':'azure-0036','azure-0807':'azure-0284','azure-1050':'azure-0054'};

  const COST_PRESENTATION={
    anchorId:'azure-1025',
    titleOverrides:{'azure-1025':'Cost Management & FinOps','azure-0033':'Azure Budgets & Cost Alerts','azure-1032':'Azure Pricing Calculator','azure-1033':'Azure TCO Calculator','azure-0032':'Reservations & Savings Plans','azure-0057':'FinOps Practices'},
    capabilities:[
      {id:'presentation-cost-visibility',title:'Cost Visibility & Allocation',description:'Cost Management und Cost Analysis machen Kosten nach Scope, Dienst und verantwortlichem Bereich sichtbar.',children:['azure-1034']},
      {id:'presentation-cost-planning',title:'Planning & Control',description:'Schätzungen, Budgets und Forecasts verbinden Erwartungen mit tatsächlicher Nutzung.',children:['azure-1032','azure-1033','azure-0033']},
      {id:'presentation-cost-efficiency',title:'Resource & Pricing Decisions',description:'Ressourcennutzung, Architektur und Preismodelle werden gegen Nutzen und Serviceziele geprüft.',children:['azure-1073']},
      {id:'presentation-finops-practices',title:'Cloud Value & Accountability',description:'Engineering, Finance und Business steuern Cloud-Wert gemeinsam in einem wiederkehrenden Prozess.',children:['azure-0057']}
    ],nested:{'azure-1034':['azure-1072'],'azure-1073':['azure-0032']}
  };
  const costVisibleIds=new Set([COST_PRESENTATION.anchorId,...COST_PRESENTATION.capabilities.map(c=>c.id),...COST_PRESENTATION.capabilities.flatMap(c=>c.children),...Object.values(COST_PRESENTATION.nested).flat()]);
  function applyCostPresentation(){
    const anchor=nodeById.get(COST_PRESENTATION.anchorId),rootNode=nodeById.get('azure-0000');if(!anchor||!rootNode)return;
    const old=nodeById.get('azure-1010');if(old)old.childNodes=old.childNodes.filter(child=>!['azure-1025','azure-1013','azure-1018','azure-1020'].includes(child.id));
    const cloudConcepts=nodeById.get('azure-0001');if(cloudConcepts)cloudConcepts.childNodes=cloudConcepts.childNodes.filter(child=>child.id!=='azure-0127');
    const legacyCost=nodeById.get('azure-0058');if(legacyCost)legacyCost.presentationDomain='Cost Management & FinOps';
    for(const id of ['azure-0032','azure-0033']){const n=nodeById.get(id),p=nodeById.get(n?.parent);if(p)p.childNodes=p.childNodes.filter(child=>child.id!==id)}
    anchor.presentationDomain='Cost Management & FinOps';anchor.presentationDepth=1;anchor.relations=[];
    if(!rootNode.childNodes.some(child=>child.id===anchor.id))rootNode.childNodes.push(anchor);
    presentationParentById.set(anchor.id,rootNode.id);
    anchor.childNodes=COST_PRESENTATION.capabilities.map(c=>{const node={id:c.id,title:c.title,description:{simple:c.description,technical:'',architecture:''},why_important:'',parent:anchor.id,children:[...c.children],childNodes:[],originalChildNodes:[],relations:[],sources:[],examples:[],aliases:[],tags:['presentation-only'],metadata:{importance:7,status:'presentation'},category:'Cost Management & FinOps',presentationDomain:'Cost Management & FinOps',presentationOnly:true,presentationDepth:2,relatedNodes:[]};nodeById.set(node.id,node);presentationNodeIds.add(node.id);presentationParentById.set(node.id,anchor.id);for(const id of c.children){const child=nodeById.get(id);if(!child)continue;child.presentationDomain='Cost Management & FinOps';child.presentationDepth=3;child.childNodes=[];node.childNodes.push(child);presentationParentById.set(id,node.id);presentationCapabilityById.set(id,c.title)}return node});
    for(const [parentId,childIds] of Object.entries(COST_PRESENTATION.nested)){const parent=nodeById.get(parentId);if(!parent)continue;parent.childNodes=childIds.map(id=>nodeById.get(id)).filter(Boolean);for(const id of childIds){const child=nodeById.get(id);if(!child)continue;child.presentationDomain='Cost Management & FinOps';child.presentationDepth=4;child.childNodes=[];presentationParentById.set(id,parentId);presentationCapabilityById.set(id,presentationCapabilityById.get(parentId)||'Cost Management & FinOps')}}
  }
  applyCostPresentation();
  const costLegacyTargets={'azure-0058':'azure-1034','azure-0127':'azure-1025','azure-0128':'azure-1025','azure-0132':'azure-1025','azure-1013':'azure-1025','azure-1018':'azure-1025','azure-1020':'azure-1025','azure-1030':'azure-1072'};

  const MONITORING_PRESENTATION={
    anchorId:'azure-0094',
    capabilities:[
      {id:'presentation-monitoring-telemetry',title:'Telemetry & Analysis',description:'Azure Monitor verbindet Metriken, Logs und deren Analyse für Infrastruktur und Plattform.',children:['azure-0983']},
      {id:'presentation-monitoring-applications',title:'Application Observability',description:'Application Insights zeigt Laufzeit, Abhängigkeiten und Benutzerwirkung von Anwendungen.',children:['azure-0987']},
      {id:'presentation-monitoring-alerting',title:'Alerting & Response',description:'Alertregeln und zugeordnete Reaktionswege machen relevante Abweichungen handlungsfähig.',children:['azure-0984']},
      {id:'presentation-monitoring-health',title:'Platform Health & Guidance',description:'Plattformzustände und Advisor-Empfehlungen unterstützen Diagnose und laufende Betriebsverbesserung.',children:['azure-0999','azure-0993']}
    ],nested:{'azure-0983':['azure-1074','azure-0986'],'azure-0986':['azure-0985'],'azure-0999':['azure-1075']}
  };
  const monitoringVisibleIds=new Set([MONITORING_PRESENTATION.anchorId,...MONITORING_PRESENTATION.capabilities.map(c=>c.id),...MONITORING_PRESENTATION.capabilities.flatMap(c=>c.children),...Object.values(MONITORING_PRESENTATION.nested).flat()]);
  function applyMonitoringPresentation(){
    const anchor=nodeById.get(MONITORING_PRESENTATION.anchorId),rootNode=nodeById.get('azure-0000');if(!anchor||!rootNode)return;
    const old=nodeById.get(anchor.parent);if(old)old.childNodes=old.childNodes.filter(child=>child.id!==anchor.id);
    rootNode.childNodes=rootNode.childNodes.filter(child=>child.id!=='azure-1057');
    const legacyRealtime=nodeById.get('azure-0857'),realtimeParent=nodeById.get(legacyRealtime?.parent);if(realtimeParent)realtimeParent.childNodes=realtimeParent.childNodes.filter(child=>child.id!=='azure-0857');
    anchor.presentationDomain='Monitoring & Operations';anchor.presentationDepth=1;anchor.relations=[];
    if(!rootNode.childNodes.some(child=>child.id===anchor.id))rootNode.childNodes.push(anchor);
    presentationParentById.set(anchor.id,rootNode.id);
    anchor.childNodes=MONITORING_PRESENTATION.capabilities.map(c=>{const node={id:c.id,title:c.title,description:{simple:c.description,technical:'',architecture:''},why_important:'',parent:anchor.id,children:[...c.children],childNodes:[],originalChildNodes:[],relations:[],sources:[],examples:[],aliases:[],tags:['presentation-only'],metadata:{importance:7,status:'presentation'},category:'Monitoring & Operations',presentationDomain:'Monitoring & Operations',presentationOnly:true,presentationDepth:2,relatedNodes:[]};nodeById.set(node.id,node);presentationNodeIds.add(node.id);presentationParentById.set(node.id,anchor.id);for(const id of c.children){const child=nodeById.get(id);if(!child)continue;child.presentationDomain='Monitoring & Operations';child.presentationDepth=3;child.childNodes=[];node.childNodes.push(child);presentationParentById.set(id,node.id);presentationCapabilityById.set(id,c.title)}return node});
    for(const [parentId,childIds] of Object.entries(MONITORING_PRESENTATION.nested)){const parent=nodeById.get(parentId);if(!parent)continue;parent.childNodes=childIds.map(id=>nodeById.get(id)).filter(Boolean);for(const id of childIds){const child=nodeById.get(id);if(!child)continue;child.presentationDomain='Monitoring & Operations';child.presentationDepth=(parent.presentationDepth||3)+1;child.childNodes=[];presentationParentById.set(id,parentId);presentationCapabilityById.set(id,presentationCapabilityById.get(parentId)||'Monitoring & Operations')}}
  }
  applyMonitoringPresentation();
  const monitoringLegacyTargets={'azure-0979':'azure-0094','azure-0098':'azure-0983','azure-0100':'azure-0094','azure-0857':'azure-1074','azure-0988':'azure-0987','azure-0989':'azure-0987','azure-0994':'azure-0993','azure-0998':'azure-0993','azure-1000':'azure-0999'};

  const RELIABILITY_PRESENTATION={
    anchorId:'azure-0070',
    capabilities:[
      {id:'presentation-reliability-design',title:'Reliability Goals & Design',description:'Messbare Ziele und tolerierte Fehler bestimmen das passende Verfügbarkeitsdesign.',children:['azure-1042','azure-1076','azure-0003','azure-0107']},
      {id:'presentation-reliability-backup',title:'Backup & Restore',description:'Unabhängige Wiederherstellungspunkte schützen Daten und Zustände vor Verlust und Beschädigung.',children:['azure-0116']},
      {id:'presentation-reliability-recovery',title:'Disaster Recovery & Continuity',description:'Ein getesteter Plan verbindet größere Ausfälle, Failover, Wiederanlauf und Geschäftsbetrieb.',children:['azure-0114']}
    ],
    nested:{'azure-0114':['azure-0118']}
  };
  const reliabilityVisibleIds=new Set([RELIABILITY_PRESENTATION.anchorId,...RELIABILITY_PRESENTATION.capabilities.map(c=>c.id),...RELIABILITY_PRESENTATION.capabilities.flatMap(c=>c.children),...Object.values(RELIABILITY_PRESENTATION.nested).flat()]);
  function applyReliabilityPresentation(){
    const anchor=nodeById.get(RELIABILITY_PRESENTATION.anchorId),rootNode=nodeById.get('azure-0000');if(!anchor||!rootNode)return;
    const shownIds=[...RELIABILITY_PRESENTATION.capabilities.flatMap(c=>c.children),...Object.values(RELIABILITY_PRESENTATION.nested).flat()];
    for(const id of [anchor.id,...shownIds,'azure-0083','azure-0089']){const node=nodeById.get(id),old=nodeById.get(node?.parent);if(old)old.childNodes=old.childNodes.filter(child=>child.id!==id)}
    anchor.presentationDomain='Reliability & Resilience';anchor.presentationDepth=1;anchor.relations=[];
    if(!rootNode.childNodes.some(child=>child.id===anchor.id))rootNode.childNodes.push(anchor);
    presentationParentById.set(anchor.id,rootNode.id);
    anchor.childNodes=RELIABILITY_PRESENTATION.capabilities.map(c=>{const node={id:c.id,title:c.title,description:{simple:c.description,technical:'',architecture:''},why_important:'',parent:anchor.id,children:[...c.children],childNodes:[],originalChildNodes:[],relations:[],sources:[],examples:[],aliases:[],tags:['presentation-only'],metadata:{importance:7,status:'presentation'},category:'Reliability & Resilience',presentationDomain:'Reliability & Resilience',presentationOnly:true,presentationDepth:2,relatedNodes:[]};nodeById.set(node.id,node);presentationNodeIds.add(node.id);presentationParentById.set(node.id,anchor.id);for(const id of c.children){const child=nodeById.get(id);if(!child)continue;child.presentationDomain='Reliability & Resilience';child.presentationDepth=3;child.childNodes=[];node.childNodes.push(child);presentationParentById.set(id,node.id);presentationCapabilityById.set(id,c.title)}return node});
    for(const [parentId,childIds] of Object.entries(RELIABILITY_PRESENTATION.nested)){const parent=nodeById.get(parentId);if(!parent)continue;parent.childNodes=childIds.map(id=>nodeById.get(id)).filter(Boolean);for(const id of childIds){const child=nodeById.get(id);if(!child)continue;child.presentationDomain='Reliability & Resilience';child.presentationDepth=4;child.childNodes=[];presentationParentById.set(id,parentId);presentationCapabilityById.set(id,presentationCapabilityById.get(parentId)||'Reliability & Resilience')}}
  }
  applyReliabilityPresentation();
  const reliabilityLegacyTargets={'azure-0004':'azure-0003','azure-0011':'azure-0003','azure-0012':'azure-0003','azure-0083':'azure-0114','azure-0084':'azure-0114','azure-0085':'azure-0114','azure-0086':'azure-0114','azure-0087':'azure-1076','azure-0088':'azure-1076','azure-0089':'azure-0114','azure-0090':'azure-0114','azure-0091':'azure-0114','azure-0092':'azure-0114','azure-0115':'azure-0114','azure-0117':'azure-0114','azure-0119':'azure-0114','azure-1043':'azure-1042','azure-1044':'azure-1042','azure-1045':'azure-1042','azure-1046':'azure-1042'};

  const MIGRATION_PRESENTATION={
    anchorId:'azure-1077',
    capabilities:[
      {id:'presentation-migration-strategy',title:'Strategy & Target Architecture',description:'Pro Workload die passende Strategie und Zielarchitektur wählen.',children:['azure-1078']},
      {id:'presentation-migration-assessment',title:'Discovery & Assessment',description:'Bestand, Abhängigkeiten, Eignung, Größen und Kosten ermitteln.',children:['azure-0645']},
      {id:'presentation-migration-delivery',title:'Planning & Migration Delivery',description:'Wellen, Cutover und Datenübertragung kontrolliert durchführen.',children:['azure-1079','azure-0720']},
      {id:'presentation-migration-modernization',title:'Modernization Pathways',description:'Plattform, Anwendung und Betrieb gezielt weiterentwickeln.',children:['azure-1080']}
    ],nested:{'azure-0720':['azure-0738']}
  };
  const migrationVisibleIds=new Set([MIGRATION_PRESENTATION.anchorId,...MIGRATION_PRESENTATION.capabilities.map(c=>c.id),...MIGRATION_PRESENTATION.capabilities.flatMap(c=>c.children),...Object.values(MIGRATION_PRESENTATION.nested).flat()]);
  function applyMigrationPresentation(){
    const anchor=nodeById.get(MIGRATION_PRESENTATION.anchorId),rootNode=nodeById.get('azure-0000');if(!anchor||!rootNode)return;
    const shownIds=[...MIGRATION_PRESENTATION.capabilities.flatMap(c=>c.children),...Object.values(MIGRATION_PRESENTATION.nested).flat()];
    for(const id of shownIds){const node=nodeById.get(id),old=nodeById.get(node?.parent);if(old)old.childNodes=old.childNodes.filter(child=>child.id!==id)}
    anchor.presentationDomain='Migration & Modernization';anchor.presentationDepth=1;
    if(!rootNode.childNodes.some(child=>child.id===anchor.id))rootNode.childNodes.push(anchor);
    presentationParentById.set(anchor.id,rootNode.id);
    anchor.childNodes=MIGRATION_PRESENTATION.capabilities.map(c=>{const node={id:c.id,title:c.title,description:{simple:c.description,technical:'',architecture:''},why_important:'',parent:anchor.id,children:[...c.children],childNodes:[],originalChildNodes:[],relations:[],sources:[],examples:[],aliases:[],tags:['presentation-only'],metadata:{importance:7,status:'presentation'},category:'Migration & Modernization',presentationDomain:'Migration & Modernization',presentationOnly:true,presentationDepth:2,relatedNodes:[]};nodeById.set(node.id,node);presentationNodeIds.add(node.id);presentationParentById.set(node.id,anchor.id);for(const id of c.children){const child=nodeById.get(id);if(!child)continue;child.presentationDomain='Migration & Modernization';child.presentationDepth=3;child.childNodes=[];node.childNodes.push(child);presentationParentById.set(id,node.id);presentationCapabilityById.set(id,c.title)}return node});
    for(const [parentId,childIds] of Object.entries(MIGRATION_PRESENTATION.nested)){const parent=nodeById.get(parentId);if(!parent)continue;parent.childNodes=childIds.map(id=>nodeById.get(id)).filter(Boolean);for(const id of childIds){const child=nodeById.get(id);if(!child)continue;child.presentationDomain='Migration & Modernization';child.presentationDepth=4;child.childNodes=[];presentationParentById.set(id,parentId);presentationCapabilityById.set(id,presentationCapabilityById.get(parentId)||'Migration & Modernization')}}
  }
  applyMigrationPresentation();
  const migrationLegacyTargets={'azure-0648':'azure-0738','azure-0722':'azure-0645','azure-0721':'azure-0720','azure-0646':'azure-0645','azure-0647':'azure-0645','azure-0649':'azure-0738','azure-0652':'azure-1078','azure-0655':'azure-0645','azure-0656':'azure-0645','azure-0739':'azure-0738','azure-0740':'azure-0738','azure-0741':'azure-0738','azure-0742':'azure-0738','azure-0746':'azure-0738'};

  const DEVOPS_PRESENTATION={
    anchorId:'azure-1081',
    capabilities:[
      {id:'presentation-devops-versioning',title:'Versioned Changes',description:'Git, Reviews und ein eindeutig bestimmter Commit machen Änderungen an Code und Infrastruktur nachvollziehbar.',children:['azure-1082']},
      {id:'presentation-devops-iac',title:'Infrastructure Definition & Deployment',description:'Deklarative Definitionen beschreiben Azure-Ressourcen reproduzierbar; Bicep, ARM Templates und Terraform haben unterschiedliche Ausführungsmodelle.',children:['azure-0301']},
      {id:'presentation-devops-delivery',title:'CI/CD & Controlled Release',description:'Build, Test, Artefakte, Umgebungen, Freigaben und Release-Muster steuern den Weg einer Änderung in den Betrieb.',children:['azure-1083','azure-0797','azure-1088']},
      {id:'presentation-devops-automation',title:'Operational Automation & Scripting',description:'Runbooks und Kommandozeilenwerkzeuge führen wiederkehrende Verwaltungsaufgaben aus.',children:['azure-1087','azure-0810','azure-0809']}
    ],nested:{'azure-0301':['azure-0313','azure-0300','azure-1086'],'azure-1083':['azure-1084'],'azure-0797':['azure-1085']}
  };
  const devopsVisibleIds=new Set([DEVOPS_PRESENTATION.anchorId,...DEVOPS_PRESENTATION.capabilities.map(c=>c.id),...DEVOPS_PRESENTATION.capabilities.flatMap(c=>c.children),...Object.values(DEVOPS_PRESENTATION.nested).flat()]);
  function applyDevopsPresentation(){
    const anchor=nodeById.get(DEVOPS_PRESENTATION.anchorId),rootNode=nodeById.get('azure-0000');if(!anchor||!rootNode)return;
    const domainIds=new Set((v34Active?V34.rows:[]).filter(row=>row.proposed_primary_domain==='DevOps & Automation').map(row=>row.node_id));
    for(const id of devopsVisibleIds)domainIds.add(id);
    for(const node of nodeById.values())node.childNodes=node.childNodes.filter(child=>!domainIds.has(child.id));
    anchor.presentationDomain='DevOps & Automation';anchor.presentationDepth=1;
    if(!rootNode.childNodes.some(child=>child.id===anchor.id))rootNode.childNodes.push(anchor);
    presentationParentById.set(anchor.id,rootNode.id);
    anchor.childNodes=DEVOPS_PRESENTATION.capabilities.map(c=>{const node={id:c.id,title:c.title,description:{simple:c.description,technical:'',architecture:''},why_important:'',parent:anchor.id,children:[...c.children],childNodes:[],originalChildNodes:[],relations:[],sources:[],examples:[],aliases:[],tags:['presentation-only'],metadata:{importance:7,status:'presentation'},category:'DevOps & Automation',presentationDomain:'DevOps & Automation',presentationOnly:true,presentationDepth:2,relatedNodes:[]};nodeById.set(node.id,node);presentationNodeIds.add(node.id);presentationParentById.set(node.id,anchor.id);for(const id of c.children){const child=nodeById.get(id);if(!child)continue;child.presentationDomain='DevOps & Automation';child.presentationDepth=3;child.childNodes=[];node.childNodes.push(child);presentationParentById.set(id,node.id);presentationCapabilityById.set(id,c.title)}return node});
    for(const [parentId,childIds] of Object.entries(DEVOPS_PRESENTATION.nested)){const parent=nodeById.get(parentId);if(!parent)continue;parent.childNodes=childIds.map(id=>nodeById.get(id)).filter(Boolean);for(const id of childIds){const child=nodeById.get(id);if(!child)continue;child.presentationDomain='DevOps & Automation';child.presentationDepth=4;child.childNodes=[];presentationParentById.set(id,parentId);presentationCapabilityById.set(id,presentationCapabilityById.get(parentId)||'DevOps & Automation')}}
  }
  applyDevopsPresentation();
  const devopsLegacyTargets={'azure-0048':'azure-0301','azure-0097':'azure-0301','azure-0798':'azure-0797','azure-0811':'azure-0810','azure-0814':'azure-0810','azure-0290':'azure-1081'};

  const AI_PRESENTATION={
    anchorId:'azure-1089',
    capabilities:[
      {id:'presentation-ai-lifecycle',title:'AI Lifecycle & Responsibility',description:'Training, Inferenz, MLOps und Evaluation machen Modelle und Anwendungen überprüfbar.',children:['azure-0768','azure-1090']},
      {id:'presentation-ai-generative',title:'Generative Models & Agents',description:'Foundry bündelt Modellbereitstellung und verwaltete Agents für generative Anwendungen.',children:['azure-1091']},
      {id:'presentation-ai-retrieval',title:'Retrieval & Grounding',description:'RAG verbindet Modellantworten mit gefundenen Inhalten; Azure AI Search liefert Suche und Retrieval.',children:['azure-1095','azure-1096']},
      {id:'presentation-ai-tools',title:'Prebuilt AI Capabilities',description:'Vorgefertigte AI-APIs lösen gezielte Sprach-, Bild-, Dokument- und Schutzaufgaben.',children:['azure-1097']}
    ],
    directChildren:['azure-0789'],
    nested:{'azure-1091':['azure-1092','azure-1094'],'azure-1092':['azure-1093']}
  };
  const aiVisibleIds=new Set([AI_PRESENTATION.anchorId,...AI_PRESENTATION.capabilities.map(c=>c.id),...AI_PRESENTATION.capabilities.flatMap(c=>c.children),...AI_PRESENTATION.directChildren,...Object.values(AI_PRESENTATION.nested).flat()]);
  const aiSecondaryCanonicalIds=new Set(['azure-1098','azure-1099']);
  function applyAIPresentation(){
    const anchor=nodeById.get(AI_PRESENTATION.anchorId),rootNode=nodeById.get('azure-0000');if(!anchor||!rootNode)return;
    const domainIds=new Set((v34Active?V34.rows:[]).filter(row=>row.proposed_primary_domain==='AI & Analytics').map(row=>row.node_id));
    for(const id of aiVisibleIds)domainIds.add(id);
    for(const node of nodeById.values())node.childNodes=node.childNodes.filter(child=>!domainIds.has(child.id));
    anchor.presentationDomain='AI & Analytics';anchor.presentationDepth=1;
    if(!rootNode.childNodes.some(child=>child.id===anchor.id))rootNode.childNodes.push(anchor);
    presentationParentById.set(anchor.id,rootNode.id);
    anchor.childNodes=AI_PRESENTATION.capabilities.map(c=>{const node={id:c.id,title:c.title,description:{simple:c.description,technical:'',architecture:''},why_important:'',parent:anchor.id,children:[...c.children],childNodes:[],originalChildNodes:[],relations:[],sources:[],examples:[],aliases:[],tags:['presentation-only'],metadata:{importance:7,status:'presentation'},category:'AI & Analytics',presentationDomain:'AI & Analytics',presentationOnly:true,presentationDepth:2,relatedNodes:[]};nodeById.set(node.id,node);presentationNodeIds.add(node.id);presentationParentById.set(node.id,anchor.id);for(const id of c.children){const child=nodeById.get(id);if(!child)continue;child.presentationDomain='AI & Analytics';child.presentationDepth=3;child.childNodes=[];node.childNodes.push(child);presentationParentById.set(id,node.id);presentationCapabilityById.set(id,c.title)}return node});
    for(const id of AI_PRESENTATION.directChildren){const child=nodeById.get(id);if(!child)continue;child.presentationDomain='AI & Analytics';child.presentationDepth=2;child.childNodes=[];anchor.childNodes.push(child);presentationParentById.set(id,anchor.id)}
    for(const [parentId,childIds] of Object.entries(AI_PRESENTATION.nested)){const parent=nodeById.get(parentId);if(!parent)continue;parent.childNodes=childIds.map(id=>nodeById.get(id)).filter(Boolean);for(const id of childIds){const child=nodeById.get(id);if(!child)continue;child.presentationDomain='AI & Analytics';child.presentationDepth=(parent.presentationDepth||3)+1;child.childNodes=[];presentationParentById.set(id,parentId);presentationCapabilityById.set(id,presentationCapabilityById.get(parentId)||'AI & Analytics')}}
    for(const id of aiSecondaryCanonicalIds){const child=nodeById.get(id);if(child)child.childNodes=[]}
  }
  applyAIPresentation();
  const aiLegacyTargets={'azure-0767':'azure-1089','azure-0769':'azure-0768','azure-0770':'azure-0768','azure-0790':'azure-0789','azure-0791':'azure-0789'};

  const FOUNDATIONS_PRESENTATION={
    anchorId:'azure-1100',
    capabilities:[
      {id:'presentation-found-cloud',title:'Cloud Principles & Consumption',description:'Cloud Computing stellt IT-Funktionen bei Bedarf bereit; das Verbrauchsmodell beeinflusst Kapazität und Kosten.',children:['azure-1101','azure-0137']},
      {id:'presentation-found-models',title:'Cloud Models & Responsibility',description:'Deployment- und Servicemodelle bestimmen Betriebsort, Dienstumfang und geteilte Verantwortung.',children:['azure-0151','azure-0197','azure-0229']},
      {id:'presentation-found-infrastructure',title:'Azure Global Infrastructure',description:'Regionen und optionale Availability Zones bilden die räumliche Grundlage für Standort- und Resilienzentscheidungen.',children:['azure-0237','azure-0007']}
    ],
    nested:{'azure-0151':['azure-0152','azure-0165','azure-0178'],'azure-0197':['azure-0198','azure-0209','azure-0220']}
  };
  const foundationsVisibleIds=new Set([FOUNDATIONS_PRESENTATION.anchorId,...FOUNDATIONS_PRESENTATION.capabilities.map(c=>c.id),...FOUNDATIONS_PRESENTATION.capabilities.flatMap(c=>c.children),...Object.values(FOUNDATIONS_PRESENTATION.nested).flat()]);
  function applyFoundationsPresentation(){
    const anchor=nodeById.get(FOUNDATIONS_PRESENTATION.anchorId),rootNode=nodeById.get('azure-0000');if(!anchor||!rootNode)return;
    const domainIds=new Set((v34Active?V34.rows:[]).filter(row=>row.proposed_primary_domain==='Cloud & Azure Foundations').map(row=>row.node_id));
    for(const id of foundationsVisibleIds)domainIds.add(id);
    for(const node of nodeById.values())node.childNodes=node.childNodes.filter(child=>!domainIds.has(child.id));
    anchor.presentationDomain='Cloud & Azure Foundations';anchor.presentationDepth=1;
    if(!rootNode.childNodes.some(child=>child.id===anchor.id))rootNode.childNodes.push(anchor);
    presentationParentById.set(anchor.id,rootNode.id);
    anchor.childNodes=FOUNDATIONS_PRESENTATION.capabilities.map(c=>{const node={id:c.id,title:c.title,description:{simple:c.description,technical:'',architecture:''},why_important:'',parent:anchor.id,children:[...c.children],childNodes:[],originalChildNodes:[],relations:[],sources:[],examples:[],aliases:[],tags:['presentation-only'],metadata:{importance:7,status:'presentation'},category:'Cloud & Azure Foundations',presentationDomain:'Cloud & Azure Foundations',presentationOnly:true,presentationDepth:2,relatedNodes:[]};nodeById.set(node.id,node);presentationNodeIds.add(node.id);presentationParentById.set(node.id,anchor.id);for(const id of c.children){const child=nodeById.get(id);if(!child)continue;child.presentationDomain='Cloud & Azure Foundations';child.presentationDepth=3;child.childNodes=[];node.childNodes.push(child);presentationParentById.set(id,node.id);presentationCapabilityById.set(id,c.title)}return node});
    for(const [parentId,childIds] of Object.entries(FOUNDATIONS_PRESENTATION.nested)){const parent=nodeById.get(parentId);if(!parent)continue;parent.childNodes=childIds.map(id=>nodeById.get(id)).filter(Boolean);for(const id of childIds){const child=nodeById.get(id);if(!child)continue;child.presentationDomain='Cloud & Azure Foundations';child.presentationDepth=4;child.childNodes=[];presentationParentById.set(id,parentId);presentationCapabilityById.set(id,presentationCapabilityById.get(parentId)||'Cloud & Azure Foundations')}}
  }
  applyFoundationsPresentation();
  // Approved Mindmap projection; Brain and canonical hierarchy remain unchanged.
  const visibleSets=new Map([['Cloud & Azure Foundations',foundationsVisibleIds],['Cost Management & FinOps',costVisibleIds],['Identity & Access',identityVisibleIds],['Security & Protection',securityVisibleIds]]);
  for(const [parentId,childIds] of Object.entries(consistency?.presentationChildren||{})){
    const parent=nodeById.get(parentId);if(!parent)throw new Error('Darstellungseltern fehlen');
    for(const id of childIds){const child=nodeById.get(id);if(!child||!canonicalNodeIds.has(id))throw new Error('Wissensanker fehlt');for(const node of nodeById.values())if(node.id!==parentId)node.childNodes=node.childNodes.filter(item=>item.id!==id);child.childNodes=[];child.presentationDomain=parent.presentationDomain;child.relatedNodes=id==='azure-0014'?['azure-0066']:id==='azure-0066'?['azure-0014']:child.relatedNodes||[];if(!parent.childNodes.some(item=>item.id===id))parent.childNodes.push(child);presentationParentById.set(id,parentId);presentationCapabilityById.set(id,presentationCapabilityById.get(parentId)||parent.title);visibleSets.get(child.presentationDomain)?.add(id)}
  }
  // The canonical AZ-900 tree remains in KB; the product root is a view only.
  const DOMAIN_PRESENTATIONS=[
    ['Cloud & Azure Foundations',FOUNDATIONS_PRESENTATION.anchorId],
    ['Compute & Application Platform',COMPUTE_PRESENTATION.anchorId],
    ['Containers & Cloud Native',CONTAINERS_PRESENTATION.anchorId],
    ['Networking',NETWORKING_PRESENTATION.anchorId],
    ['Storage',STORAGE_PRESENTATION.anchorId],
    ['Databases & Data Platforms',DATABASES_PRESENTATION.anchorId],
    ['Integration, Messaging & IoT',INTEGRATION_PRESENTATION.anchorId],
    ['Identity & Access',IDENTITY_PRESENTATION.anchorId],
    ['Security & Protection',SECURITY_PRESENTATION.anchorId],
    ['Governance & Resource Management',GOVERNANCE_PRESENTATION.anchorId],
    ['Cost Management & FinOps',COST_PRESENTATION.anchorId],
    ['Monitoring & Operations',MONITORING_PRESENTATION.anchorId],
    ['Reliability & Resilience',RELIABILITY_PRESENTATION.anchorId],
    ['Migration & Modernization',MIGRATION_PRESENTATION.anchorId],
    ['DevOps & Automation',DEVOPS_PRESENTATION.anchorId],
    ['AI & Analytics',AI_PRESENTATION.anchorId]
  ];
  const domainAnchorByName=new Map(DOMAIN_PRESENTATIONS);
  const domainAnchorIds=new Set(DOMAIN_PRESENTATIONS.map(([,id])=>id));
  root.title='Azure Digital Brain';
  root.aliases=[...new Set([...(root.aliases||[]),'Azure - AZ-900 (Fundamentals)'])];
  root.description={simple:'16 fachliche Domains bilden die primäre Azure-Landkarte. Historische AZ-900-Lerninhalte bleiben im Wissensbestand erhalten.',technical:'Die globale Mindmap zeigt die kuratierten V3.4-Domains; Canonical-IDs, Lerninhalte und ursprüngliche Struktur bleiben als Datenbestand erhalten.',architecture:''};
  root.presentationDomain='Azure Digital Brain';
  root.presentationDepth=0;
  root.childNodes=DOMAIN_PRESENTATIONS.map(([,id])=>nodeById.get(id)).filter(Boolean);
  const primaryPresentationIds=new Set([root.id]);
  function indexPrimaryBranch(node,level,seen=new Set()){
    if(seen.has(node.id))return;
    seen.add(node.id);primaryPresentationIds.add(node.id);node.presentationDepth=level;
    for(const child of node.childNodes){presentationParentById.set(child.id,node.id);indexPrimaryBranch(child,level+1,seen)}
  }
  for(const anchor of root.childNodes){presentationParentById.set(anchor.id,root.id);indexPrimaryBranch(anchor,1)}
  const primaryCanonicalIds=new Set([...primaryPresentationIds].filter(id=>!nodeById.get(id)?.presentationOnly&&id!==root.id));
  const brainCanonicalNodes=[...primaryCanonicalIds].map(id=>({...nodeById.get(id),parent:null,children:[]}));
  const brainCanonicalById=new Map(brainCanonicalNodes.map(node=>[node.id,node]));
  for(const node of brainCanonicalNodes){
    let parentId=presentationParentId(nodeById.get(node.id));
    while(parentId&&!primaryCanonicalIds.has(parentId))parentId=presentationParentId(nodeById.get(parentId));
    if(parentId){node.parent=parentId;brainCanonicalById.get(parentId).children.push(node.id)}
  }
  const foundationsLegacyTargets={'azure-0001':'azure-1100','azure-0002':'azure-1101','azure-0013':'azure-1101','azure-0030':'azure-1101','azure-0062':'azure-1101','azure-0078':'azure-0237','azure-0101':'azure-1101','azure-0244':'azure-0007','azure-0254':'azure-0237','azure-0267':'azure-0007','azure-0269':'azure-0237','azure-0747':'azure-1100','azure-0840':'azure-0229','azure-1007':'azure-0237','azure-1009':'azure-0237','azure-1047':'azure-1100','azure-1048':'azure-1100','azure-1049':'azure-1100'};

  const integrationLegacyTargets={'azure-0780':'azure-0779','azure-0781':'azure-0779','azure-0783':'azure-0782','azure-0784':'azure-0782','azure-0786':'azure-0785','azure-0787':'azure-0785','azure-0788':'azure-0785'};




  const el=id=>document.getElementById(id);
  if(!BRAIN)throw new Error('Gemeinsames V3.4-Brain-Modell fehlt');
  const dom={
    stage:el('stage'),mind:el('mindmapCanvas'),mindViewport:el('mindViewport'),mindLinks:el('mindLinks'),mindNodes:el('mindNodes'),brain:el('brainCanvas'),brain3d:el('brain3dViewport'),brain2dButton:el('brain2dView'),brain3dButton:el('brain3dMode'),
    tooltip:el('graphTooltip'),legend:el('legend'),status:el('viewStatus'),visible:el('visibleStatus'),summary:el('dataSummary'),
    mindMode:el('mindmapMode'),brainMode:el('brainMode'),brainViewSwitch:el('brainViewSwitch'),architectureMode:el('architectureMode'),learningMode:el('learningMode'),search:el('searchInput'),results:el('searchResults'),expandAll:el('expandAllBtn'),collapse:el('collapseBtn'),focus:el('focusBtn'),toolbar:document.querySelector('.toolbar'),mindScopeSwitch:el('mindScopeSwitch'),mindScopeFocus:el('mindScopeFocus'),mindScopeGlobal:el('mindScopeGlobal'),
    zoomIn:el('zoomIn'),zoomOut:el('zoomOut'),fit:el('fitView'),panel:el('detailPanel'),close:el('closeDetails'),category:el('detailCategory'),title:el('detailTitle'),
    path:el('detailPath'),audit:el('auditBox'),contextSummarySection:el('contextSummarySection'),contextSummary:el('contextSummary'),contextModeActions:el('contextModeActions'),contextMindmap:el('contextMindmap'),contextBrain:el('contextBrain'),contextArchitecture:el('contextArchitecture'),contextLearning:el('contextLearning'),simpleSection:el('simpleSection'),short:el('detailShort'),technicalSection:el('technicalSection'),technical:el('detailTechnical'),architectureSection:el('architectureSection'),architecture:el('detailArchitecture'),architectureLinkSection:el('architectureLinkSection'),architectureContextList:el('architectureContextList'),whySection:el('whySection'),why:el('detailWhy'),examplesSection:el('examplesSection'),examples:el('detailExamples'),analogySection:el('analogySection'),analogy:el('detailAnalogy'),merksatzSection:el('merksatzSection'),merksatz:el('detailMerksatz'),meta:el('detailMeta'),learningSection:el('learningSection'),learning:el('learningStatus'),
    relationsSection:el('relationsSection'),relationList:el('relationList'),toggleRelations:el('toggleRelations'),contextSection:el('contextSection'),contextList:el('contextList'),sourcesSection:el('sourcesSection'),sourcesDisclosure:el('sourcesDisclosure'),sourceSummary:el('sourceSummary'),sourceDisclosureLabel:el('sourceDisclosureLabel'),sourceList:el('sourceList'),notesSection:el('notesSection'),notesDisclosure:el('notesDisclosure'),notesDisclosureLabel:el('notesDisclosureLabel'),notes:el('notes'),
    architectureView:el('architectureView'),scenarioList:el('scenarioList'),scenarioContent:el('scenarioContent'),learningView:el('learningView'),learningPathList:el('learningPathList'),learningContent:el('learningContent'),
    qualityDetails:el('qualityDetails'),qualityContent:el('qualityContent'),semanticChooser:el('semanticChooser'),semanticChooserList:el('semanticChooserList'),closeSemanticChooser:el('closeSemanticChooser'),actions:el('detailActions'),toggle:el('toggleBranch'),showRelations:el('showRelations'),back:el('backNavigation'),returnToLearning:el('returnToLearning'),exportProfile:el('exportProfile'),importProfile:el('importProfile'),profileFile:el('profileFile')
  };
  const state={
    mode:'mindmap',brainRenderer:'2d',mindScope:'global',selected:null,highlighted:null,searchMatches:new Set(),expanded:new Set([root.id]),navigationStack:[],relationsExpanded:false,
    mind:{scale:1,tx:0,ty:0,positions:new Map(),visible:[],drag:false,last:null},
    graph:{scale:1,tx:0,ty:0,nodes:[],edges:[],focusId:null,drag:false,dragNode:null,last:null,hoverNode:null,hoverEdge:null},
    scenarioId:ARCH.scenarios[0]?.id||null,learningPathId:LEARNING.learning_paths[0]?.id||null,learningStepId:LEARNING.learning_paths[0]?.steps?.[0]?.id||null,crossModeOrigin:null,legacyContext:false,
    networkingPrototype:false,networkingStepIndex:0,networkingSelection:null,networkingReturn:null,
    cloudPrototype:false,cloudStepIndex:0,cloudSelection:null,cloudReturn:null,
    azurePrototype:false,azureStepIndex:0,azureSelection:null,azureReturn:null,
    organizationPrototype:false,organizationStepIndex:0,organizationSelection:null,organizationReturn:null,
    accessPrototype:false,accessStepIndex:0,accessSelection:null,accessReturn:null,
    governancePrototype:false,governanceStepIndex:0,governanceSelection:null,governanceReturn:null
  };
  const knowledgeRelease=v34Active?'3.4':RELEASE.release_version;
  const releaseSummary=`V${knowledgeRelease} Wissensarchitektur · V${EXPERIENCE.release_version||'3.2'} Experience · ${Number(RELEASE.node_count).toLocaleString('de-DE')} Bestandsdatensätze · ${BRAIN.model.counts.brainEntities} Brain-Entities · ${Number(RELEASE.relation_count).toLocaleString('de-DE')} Beziehungen · ${RELEASE.scenario_count} Szenarien · ${RELEASE.learning_path_count} Lernpfade`;
  dom.summary.textContent=releaseSummary;
  document.title=`${RELEASE.product_name} V${knowledgeRelease}`;
  dom.legend.innerHTML=DOMAIN_PRESENTATIONS.map(([name,id])=>`<button type="button" data-domain-id="${escapeHtml(id)}" aria-label="Domain ${escapeHtml(name)} auswählen"><i style="background:${COLORS[name]||'#8aa'}"></i>${escapeHtml(name)}</button>`).join('');
  dom.legend.querySelectorAll('[data-domain-id]').forEach(button=>button.addEventListener('click',()=>{
    if(state.mode==='brain'){BRAIN.focus(button.dataset.domainId);navigateToNode(button.dataset.domainId,{forceHistory:true});return}
    if(state.mode!=='mindmap')setMode('mindmap');
    state.mindScope='global';
    navigateToNode(button.dataset.domainId,{forceHistory:true});
  }));

  function escapeHtml(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
  function presentationParentId(n){return presentationParentById.get(n?.id)||n?.parent||null}
  function presentationTitle(n){return NETWORKING_PRESENTATION.titleOverrides[n?.id]||STORAGE_PRESENTATION.titleOverrides[n?.id]||COMPUTE_PRESENTATION.titleOverrides[n?.id]||CONTAINERS_PRESENTATION.titleOverrides[n?.id]||DATABASES_PRESENTATION.titleOverrides[n?.id]||({'azure-0909':'App Registrations & Service Principals','azure-0964':'Azure RBAC','azure-0046':'Microsoft Entra PIM','azure-0908':'Single Sign-On (SSO)'})[n?.id]||COST_PRESENTATION.titleOverrides[n?.id]||n?.title||''}
  function isNetworkingPresentationNode(n){return primaryDomain(n)==='Networking'&&(presentationParentById.has(n?.id)||n?.id===NETWORKING_PRESENTATION.anchorId)}
  function isStoragePresentationNode(n){return primaryDomain(n)==='Storage'&&(presentationParentById.has(n?.id)||n?.id===STORAGE_PRESENTATION.anchorId)}
  function isComputePresentationNode(n){return primaryDomain(n)==='Compute & Application Platform'&&(presentationParentById.has(n?.id)||n?.id===COMPUTE_PRESENTATION.anchorId)}
  function isContainersPresentationNode(n){return primaryDomain(n)==='Containers & Cloud Native'&&(presentationParentById.has(n?.id)||n?.id===CONTAINERS_PRESENTATION.anchorId)}
  function isDatabasesPresentationNode(n){return primaryDomain(n)==='Databases & Data Platforms'&&(presentationParentById.has(n?.id)||n?.id===DATABASES_PRESENTATION.anchorId)}
  function isIntegrationPresentationNode(n){return primaryDomain(n)==='Integration, Messaging & IoT'&&(presentationParentById.has(n?.id)||n?.id===INTEGRATION_PRESENTATION.anchorId)}
  function isIdentityPresentationNode(n){return primaryDomain(n)==='Identity & Access'&&(presentationParentById.has(n?.id)||n?.id===IDENTITY_PRESENTATION.anchorId)}
  function isSecurityPresentationNode(n){return primaryDomain(n)==='Security & Protection'&&(presentationParentById.has(n?.id)||n?.id===SECURITY_PRESENTATION.anchorId)}
  function isGovernancePresentationNode(n){return primaryDomain(n)==='Governance & Resource Management'&&(presentationParentById.has(n?.id)||n?.id===GOVERNANCE_PRESENTATION.anchorId)}
  function isCostPresentationNode(n){return primaryDomain(n)==='Cost Management & FinOps'&&(presentationParentById.has(n?.id)||n?.id===COST_PRESENTATION.anchorId)}
  function isMonitoringPresentationNode(n){return primaryDomain(n)==='Monitoring & Operations'&&(presentationParentById.has(n?.id)||n?.id===MONITORING_PRESENTATION.anchorId)}
  function isReliabilityPresentationNode(n){return primaryDomain(n)==='Reliability & Resilience'&&(presentationParentById.has(n?.id)||n?.id===RELIABILITY_PRESENTATION.anchorId)}
  function isMigrationPresentationNode(n){return primaryDomain(n)==='Migration & Modernization'&&(presentationParentById.has(n?.id)||n?.id===MIGRATION_PRESENTATION.anchorId)}
  function isDevopsPresentationNode(n){return primaryDomain(n)==='DevOps & Automation'&&(presentationParentById.has(n?.id)||n?.id===DEVOPS_PRESENTATION.anchorId)}
  function isAIPresentationNode(n){return primaryDomain(n)==='AI & Analytics'&&(presentationParentById.has(n?.id)||n?.id===AI_PRESENTATION.anchorId)}
  function isFoundationsPresentationNode(n){return primaryDomain(n)==='Cloud & Azure Foundations'&&(presentationParentById.has(n?.id)||n?.id===FOUNDATIONS_PRESENTATION.anchorId)}
  function isCuratedPresentationNode(n){return isFoundationsPresentationNode(n)||isAIPresentationNode(n)||isDevopsPresentationNode(n)||isMigrationPresentationNode(n)||isReliabilityPresentationNode(n)||isMonitoringPresentationNode(n)|| isCostPresentationNode(n)||isNetworkingPresentationNode(n)||isStoragePresentationNode(n)||isComputePresentationNode(n)||isContainersPresentationNode(n)||isDatabasesPresentationNode(n)||isIntegrationPresentationNode(n)||isIdentityPresentationNode(n)||isSecurityPresentationNode(n)||isGovernancePresentationNode(n)}
  function presentationAnchorId(n){return isFoundationsPresentationNode(n)?FOUNDATIONS_PRESENTATION.anchorId:isAIPresentationNode(n)?AI_PRESENTATION.anchorId:isDevopsPresentationNode(n)?DEVOPS_PRESENTATION.anchorId:isMigrationPresentationNode(n)?MIGRATION_PRESENTATION.anchorId:isReliabilityPresentationNode(n)?RELIABILITY_PRESENTATION.anchorId:isMonitoringPresentationNode(n)?MONITORING_PRESENTATION.anchorId:isCostPresentationNode(n)?COST_PRESENTATION.anchorId:isGovernancePresentationNode(n)?GOVERNANCE_PRESENTATION.anchorId:isSecurityPresentationNode(n)?SECURITY_PRESENTATION.anchorId:isIdentityPresentationNode(n)?IDENTITY_PRESENTATION.anchorId:isDatabasesPresentationNode(n)?DATABASES_PRESENTATION.anchorId:isContainersPresentationNode(n)?CONTAINERS_PRESENTATION.anchorId:isComputePresentationNode(n)?COMPUTE_PRESENTATION.anchorId:isStoragePresentationNode(n)?STORAGE_PRESENTATION.anchorId:NETWORKING_PRESENTATION.anchorId}
  function ancestors(n){const list=[];let c=n,seen=new Set();while(c&&presentationParentId(c)&&!seen.has(c.id)){seen.add(c.id);c=nodeById.get(presentationParentId(c));if(c)list.unshift(c)}return list}
  function currentPath(n){if(isCuratedPresentationNode(n)){const path=[...ancestors(n),n].filter(Boolean),anchorIndex=path.findIndex(item=>item.id===presentationAnchorId(n));return path.slice(Math.max(0,anchorIndex)).map(presentationTitle).join(' › ')}const target=v34RowById.get(n?.id)?.proposed_path;return target?target.replaceAll(' > ',' › '):[...ancestors(n),n].filter(Boolean).map(presentationTitle).join(' › ')}
  const normalizeTerm=CORE.normalizeTerm;
  function confidenceLabel(value){return value==='high'?'Hohe Sicherheit':value==='medium'?'Mittlere Sicherheit':'Niedrige Sicherheit'}
  const searchableNodes=[...nodeById.values()].filter(node=>!node.presentationOnly||node.id===INTEGRATION_PRESENTATION.anchorId||node.id===IDENTITY_PRESENTATION.anchorId);
  const semanticMatcher=CORE.buildTermIndex(searchableNodes,NAV.aliases||[]);
  const searchRecords=CORE.buildSearchRecords(searchableNodes,NAV.aliases||[],NAV.classifications||[],currentPath);
  const PROFILE_KEY='adb:user-profile:v1.1';
  function emptyProfile(){return{schema_version:'1.1',profile_id:'local-default',updated_at:new Date().toISOString(),notes:{},learning_status:{},favorites:[],custom_links:[],preferences:{default_mode:'mindmap'},migrations:{}}}
  function loadProfile(){
    let profile;try{profile=JSON.parse(localStorage.getItem(PROFILE_KEY)||'null')}catch{}
    if(!profile||profile.schema_version!=='1.1')profile=emptyProfile();
    profile.notes||={};profile.learning_status||={};profile.favorites||=[];profile.custom_links||=[];profile.preferences||={default_mode:'mindmap'};profile.migrations||={};
    if(!profile.migrations.legacy_node_keys){for(const id of nodeById.keys()){try{const legacy=JSON.parse(localStorage.getItem(`adb:${id}`)||'null');if(legacy?.notes&&!profile.notes[id])profile.notes[id]=legacy.notes;if(legacy?.status&&!profile.learning_status[id])profile.learning_status[id]=legacy.status}catch{}}profile.migrations.legacy_node_keys='completed';try{localStorage.setItem(PROFILE_KEY,JSON.stringify(profile))}catch{}}
    return profile;
  }
  let userProfile=loadProfile();
  function saveProfile(){try{userProfile.updated_at=new Date().toISOString();localStorage.setItem(PROFILE_KEY,JSON.stringify(userProfile))}catch{}}
  function userState(id){return{notes:userProfile.notes[id]||'',status:userProfile.learning_status[id]||'unbekannt'}}
  function saveUserState(id,value){if('notes'in value)userProfile.notes[id]=value.notes;if('status'in value)userProfile.learning_status[id]=value.status;saveProfile()}
  function learningStepState(id){const saved=userProfile.learning_status[id],value=saved&&typeof saved==='object'?saved:{};return{status:value.status||'not-started',progress_percent:Number(value.progress_percent||0),last_opened_at:value.last_opened_at||'',understanding_level:Number(value.understanding_level||1),completed:Boolean(value.completed)}}
  function saveLearningStepState(id,value){userProfile.learning_status[id]={...learningStepState(id),...value};userProfile.notes[id]=value.notes??userProfile.notes[id]??'';saveProfile()}
  function exportProfile(){const blob=new Blob([JSON.stringify(userProfile,null,2)+'\n'],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='azure-digital-brain-user-profile.json';a.hidden=true;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000)}
  function importProfileFile(file){const reader=new FileReader();reader.onload=()=>{try{const profile=JSON.parse(reader.result);if(profile.schema_version!=='1.1'||typeof profile.notes!=='object'||typeof profile.learning_status!=='object')throw new Error('Ungültiges Profilformat');userProfile={...emptyProfile(),...profile};saveProfile();if(state.selected)updateDetails(nodeById.get(state.selected));if(state.mode==='learning')renderLearning();alert('Benutzerprofil wurde importiert.')}catch(error){alert(`Profil konnte nicht importiert werden: ${error.message}`)}};reader.readAsText(file)}
  function color(n){return COLORS[primaryDomain(n)]||'#7891a5'}
  function depth(n){return n.presentationDepth??n.legacy?.original?.depth??0}
  function importance(n){return Number(n.metadata?.importance||1)}
  function auditFlags(n){return n.metadata?.audit_flags||[]}
  function relationPresentation(relation,nodeId){const outgoing=relation.source===nodeId,typeId=outgoing?relation.type:relation.inverse_type,type=relationTypeById.get(typeId);return{otherId:outgoing?relation.target:relation.source,typeId,label:type?.label||typeId,color:type?.color||'#72d1ff',direction:outgoing?'outgoing':'incoming'}}
  function truncate(s,n=55){s=String(s||'').replace(/\s+/g,' ').trim();return s.length>n?s.slice(0,n-1)+'…':s}
  function wrapMindTitle(value,max=30){const text=String(value||'').replace(/\s+/g,' ').trim();if(text.length<=max)return[text];const words=text.split(' '),lines=[''];for(const word of words){const next=(lines.at(-1)+' '+word).trim();if(next.length<=max||lines.at(-1)==='')lines[lines.length-1]=next;else if(lines.length===1)lines.push(word);else lines[1]+=' '+word}return lines.length>1?[lines[0],truncate(lines[1],max+4)]:[truncate(text,max+4)]}
  function contentSignature(value){return String(value||'').normalize('NFKC').toLocaleLowerCase('de-DE').replace(/[„“"'`.,:;!?()\[\]{}]/g,' ').replace(/\s+/g,' ').trim()}
  function contentRedundant(a,b){const left=contentSignature(a),right=contentSignature(b);if(!left||!right)return false;if(left===right)return true;if(Math.min(left.length,right.length)>45&&(left.includes(right)||right.includes(left)))return true;const aTokens=new Set(left.split(' ').filter(token=>token.length>3)),bTokens=new Set(right.split(' ').filter(token=>token.length>3));if(aTokens.size<5||bTokens.size<5)return false;const overlap=[...aTokens].filter(token=>bTokens.has(token)).length/Math.min(aTokens.size,bTokens.size),lengthRatio=Math.min(left.length,right.length)/Math.max(left.length,right.length);return overlap>=.86&&lengthRatio>=.65}
  function semanticMatches(text,sourceNodeId){return CORE.findSemanticMatches(text,sourceNodeId,semanticMatcher)}
  function linkPresentation(match){
    const classified=match.candidates.map(candidate=>({...candidate,classification:classificationById.get(candidate.nodeId)}));
    const type=classified.length>1?'ambiguous':classified[0]?.classification?.classification==='Deprecated Concept'?'deprecated':classified[0]?.type==='historical'?'historical':'standard';
    const targets=classified.map(candidate=>presentationTitle(nodeById.get(candidate.nodeId))).join(' · ');
    return{type,targets,ids:classified.map(candidate=>candidate.nodeId),categories:classified.map(candidate=>nodeById.get(candidate.nodeId)?.category).filter(Boolean)};
  }
  function renderSemanticText(target,text,sourceNodeId){
    target.replaceChildren();const value=String(text||''),matches=semanticMatches(value,sourceNodeId);let cursor=0;
    for(const match of matches){
      if(match.start>cursor)target.append(document.createTextNode(value.slice(cursor,match.start)));
      const presentation=linkPresentation(match),button=document.createElement('button');button.type='button';button.className=`semantic-link semantic-link-${presentation.type}`;button.textContent=match.term;button.dataset.targetIds=presentation.ids.join(',');button.dataset.term=match.term;button.title=presentation.targets;button.style.setProperty('--semantic-color',presentation.type==='ambiguous'?'#ffd166':color(nodeById.get(presentation.ids[0])));button.setAttribute('aria-label',`${match.term}: ${NAV.link_types?.[presentation.type]?.label||presentation.type}`);target.append(button);cursor=match.end;
    }
    if(cursor<value.length)target.append(document.createTextNode(value.slice(cursor)));
  }
  function openSemanticChooser(term,ids){
    dom.semanticChooserList.innerHTML=ids.map(id=>{const node=nodeById.get(id);return`<button type="button" data-node-id="${escapeHtml(id)}" style="--candidate-color:${escapeHtml(color(node))}"><span>${escapeHtml(node.category)}</span><b>${escapeHtml(node.title)}</b><small>${escapeHtml(id)} · ${escapeHtml(currentPath(node))}</small></button>`}).join('');dom.semanticChooser.hidden=false;dom.semanticChooser.querySelector('b').textContent=`„${term}“ zuordnen`;dom.semanticChooserList.querySelectorAll('[data-node-id]').forEach(button=>button.addEventListener('click',()=>{dom.semanticChooser.hidden=true;navigateToNode(button.dataset.nodeId)}));
  }

  function setMode(mode){
    state.mode=mode;
    updateArchitectureCaseEntry(mode);
    document.querySelector('.workspace').classList.toggle('architecture-demo-active',mode==='architecture'&&architectureCase?.ui.view!=='reference');
    if(architectureReturnButton)architectureReturnButton.hidden=!architectureBrainOrigin||!state.navigationStack.includes(architectureBrainOrigin)||(mode!=='brain'&&mode!=='mindmap');
    dom.learningView.classList.toggle('network-learning',mode==='learning'&&state.networkingPrototype);
    dom.learningView.classList.toggle('cloud-learning',mode==='learning'&&state.cloudPrototype);
    dom.learningView.classList.toggle('azure-learning',mode==='learning'&&state.azurePrototype);
    dom.learningView.classList.toggle('organization-learning',mode==='learning'&&state.organizationPrototype);
    dom.learningView.classList.toggle('access-learning',mode==='learning'&&state.accessPrototype);
    dom.learningView.classList.toggle('governance-learning',mode==='learning'&&state.governancePrototype);
    dom.returnToLearning.hidden=!(mode==='mindmap'&&(state.networkingReturn||state.cloudReturn||state.azureReturn||state.organizationReturn||state.accessReturn||state.governanceReturn));
    const mind=mode==='mindmap',brain=mode==='brain',architecture=mode==='architecture',learning=mode==='learning',content=architecture||learning;
    dom.mind.classList.toggle('active',mind);dom.brain.classList.toggle('active',brain&&state.brainRenderer==='2d');dom.brain3d.classList.toggle('active',brain&&state.brainRenderer==='3d');dom.architectureView.hidden=!architecture;dom.learningView.hidden=!learning;
    for(const [button,active] of [[dom.mindMode,mind],[dom.brainMode,brain],[dom.architectureMode,architecture],[dom.learningMode,learning]]){button.classList.toggle('active',active);button.setAttribute('aria-selected',String(active))}
    dom.stage.classList.toggle('content-mode',content);dom.stage.classList.toggle('mindmap-mode',mind);dom.stage.classList.toggle('brain-mode',brain);dom.stage.classList.toggle('brain-3d-mode',brain&&state.brainRenderer==='3d');dom.brainViewSwitch.hidden=!brain;dom.toolbar.classList.toggle('content-mode-controls',content);updateMindScopeControls();
    for(const [button,active] of [[dom.brain2dButton,state.brainRenderer==='2d'],[dom.brain3dButton,state.brainRenderer==='3d']]){button.classList.toggle('active',active);if(active)button.setAttribute('aria-current','true');else button.removeAttribute('aria-current')}
    dom.expandAll.hidden=!mind;dom.collapse.hidden=!mind;dom.focus.hidden=!brain;
    dom.status.textContent=mind?(v34Active?'V3.4 Mindmap':'Hierarchische Original-Mindmap'):brain?(v34Active?'V3.4 Knowledge Graph · 16 Primary Domains':'Semantischer Knowledge Graph'):architecture?'Architecture Scenarios':'Azure-Lernreise';
    userProfile.preferences.default_mode=mode;saveProfile();
    if(brain){if(!state.selected&&BRAIN.state.selectedEntityId)state.selected=BRAIN.state.selectedEntityId;if(state.selected&&!BRAIN.entityById.has(state.selected)){state.selected=null;BRAIN.overview()}else if(state.selected)BRAIN.select(state.selected);if(state.brainRenderer==='3d'){window.ADB3D_RENDERER.activate()}else{window.ADB3D_RENDERER.deactivate();buildGraph(BRAIN.state.contextCenterId);resizeBrain();fitGraph()}}else{window.ADB3D_RENDERER.deactivate();if(mind){renderMindmap();if(state.selected)centerMindNode(state.selected);else fitMindmap()}else if(architecture&&shouldShowCrossModeLanding('architecture'))renderCrossModeLanding('architecture');else if(learning&&shouldShowCrossModeLanding('learning'))renderCrossModeLanding('learning');else if(architecture)renderArchitecture();else renderLearning()}if(state.selected)updateDetails(nodeById.get(state.selected));
  }
  function setBrainRenderer(renderer){
    if(!['2d','3d'].includes(renderer)||state.mode==='brain'&&state.brainRenderer===renderer)return;
    state.brainRenderer=renderer;
    setMode('brain');
    setNavigationHash(state.selected);
  }
  function syncShellFromThree(shared){
    if(state.mode!=='brain'||state.brainRenderer!=='3d')return;
    const id=shared.selectedEntityId;
    if(id&&nodeById.has(id)){
      if(state.selected!==id)state.relationsExpanded=false;
      state.selected=id;
      updateDetails(nodeById.get(id));
      if(innerWidth<1200)dom.panel.classList.add('open');
    }else clearDetails({fromRenderer:true});
    dom.focus.textContent=shared.contextCenterId?'Kontext lösen':'Gesamtansicht';
    setNavigationHash(id);
  }

  function curatedSelection(){return isCuratedPresentationNode(nodeById.get(state.selected))}
  function mindRoot(){return state.mindScope==='focus'&&curatedSelection()?nodeById.get(presentationAnchorId(nodeById.get(state.selected))):root}
  function updateMindScopeControls(){
    const available=state.mode==='mindmap'&&curatedSelection();dom.mindScopeSwitch.hidden=!available;dom.stage.classList.toggle('networking-focus',available&&state.mindScope==='focus');
    for(const [button,scope] of [[dom.mindScopeFocus,'focus'],[dom.mindScopeGlobal,'global']]){const active=state.mindScope===scope;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active))}
  }
  function setMindScope(scope){
    if(!curatedSelection()||!['focus','global'].includes(scope))return;state.mindScope=scope;openPath(state.selected,false);renderMindmap();requestAnimationFrame(()=>scope==='global'?centerMindNode(state.selected):fitMindmap());
  }
  function mindDepth(n){const viewRoot=mindRoot();return viewRoot.id===root.id?depth(n):Math.max(0,depth(n)-depth(viewRoot))}
  function collectVisible(){const out=[],viewRoot=mindRoot();function walk(n){out.push(n);if(state.expanded.has(n.id))n.childNodes.forEach(walk)}walk(viewRoot);return out}
  function nodeSize(n){return mindDepth(n)===0?[280,80]:mindDepth(n)===1?[254,62]:[226,54]}
  function layoutMindmap(){
    const viewRoot=mindRoot(),visible=collectVisible(),visibleIds=new Set(visible.map(n=>n.id)),pos=new Map(),gapX=292,gapY=72;
    const branchInfo=viewRoot.childNodes.filter(n=>visibleIds.has(n.id)).map((n,i)=>({node:n,side:i%2?'right':'left'}));
    for(const side of ['left','right']){
      let cursor=0;
      function place(n,branchSide){
        const kids=state.expanded.has(n.id)?n.childNodes.filter(c=>visibleIds.has(c.id)):[];
        let y;if(kids.length){const ys=kids.map(c=>place(c,branchSide));y=(ys[0]+ys[ys.length-1])/2}else{y=cursor*gapY;cursor++}
        const [w,h]=nodeSize(n);pos.set(n.id,{x:(branchSide==='left'?-1:1)*mindDepth(n)*gapX,y,w,h,side:branchSide});return y;
      }
      const roots=branchInfo.filter(b=>b.side===side);roots.forEach(b=>{place(b.node,side);cursor+=.8});
      const ps=[...pos.values()].filter(p=>p.side===side);if(ps.length){const mid=(Math.min(...ps.map(p=>p.y))+Math.max(...ps.map(p=>p.y)))/2;ps.forEach(p=>p.y-=mid)}
    }
    const [w,h]=nodeSize(viewRoot);pos.set(viewRoot.id,{x:0,y:0,w,h,side:'center'});state.mind.positions=pos;state.mind.visible=visible;
  }
  function mindTransform(){dom.mindViewport.setAttribute('transform',`translate(${state.mind.tx} ${state.mind.ty}) scale(${state.mind.scale})`)}
  function renderMindmap(){
    layoutMindmap();dom.mindLinks.innerHTML='';dom.mindNodes.innerHTML='';
    for(const n of state.mind.visible){
      const p=state.mind.positions.get(n.id),parentId=presentationParentId(n);if(parentId&&state.mind.positions.has(parentId)){
        const q=state.mind.positions.get(parentId),dir=p.side==='left'?-1:1,startX=q.x+dir*q.w/2,endX=p.x-dir*p.w/2,mid=(startX+endX)/2;
        const path=document.createElementNS('http://www.w3.org/2000/svg','path');path.setAttribute('d',`M${startX},${q.y} C${mid},${q.y} ${mid},${p.y} ${endX},${p.y}`);path.setAttribute('stroke',color(n));dom.mindLinks.appendChild(path);
      }
      const g=document.createElementNS('http://www.w3.org/2000/svg','g');g.setAttribute('class',`node${state.selected===n.id?' selected':''}${state.highlighted===n.id?' navigated':''}${state.searchMatches.has(n.id)?' match':''}`);g.setAttribute('transform',`translate(${p.x-p.w/2} ${p.y-p.h/2})`);g.dataset.id=n.id;
      const rect=document.createElementNS('http://www.w3.org/2000/svg','rect');rect.setAttribute('width',p.w);rect.setAttribute('height',p.h);rect.setAttribute('rx',mindDepth(n)<2?15:11);rect.setAttribute('fill',mindDepth(n)===0?'#123b5a':'#102235');rect.setAttribute('stroke',color(n));g.appendChild(rect);
      const title=document.createElementNS('http://www.w3.org/2000/svg','text'),titleLines=mindRoot().id!==root.id&&mindDepth(n)>=2?wrapMindTitle(presentationTitle(n),30):[truncate(presentationTitle(n),mindDepth(n)===0?35:34)];title.setAttribute('x',16);title.setAttribute('y',titleLines.length>1?20:mindDepth(n)===0?34:25);title.setAttribute('font-size',mindDepth(n)===0?17:mindDepth(n)===1?13:12);titleLines.forEach((line,index)=>{const span=document.createElementNS('http://www.w3.org/2000/svg','tspan');span.setAttribute('x',16);span.setAttribute('dy',index?17:0);span.textContent=line;title.appendChild(span)});g.appendChild(title);
      if(n.legacy?.current_name||auditFlags(n).length){const sub=document.createElementNS('http://www.w3.org/2000/svg','text');sub.setAttribute('class','node-sub');sub.setAttribute('x',16);sub.setAttribute('y',depth(n)===0?55:43);sub.textContent=auditFlags(n).length?'Aktualitätshinweis':'aktueller Produktname';g.appendChild(sub)}
      if(n.childNodes.length){const badge=document.createElementNS('http://www.w3.org/2000/svg','g');const cx=p.side==='left'?0:p.w;badge.setAttribute('transform',`translate(${cx} ${p.h/2})`);const c=document.createElementNS('http://www.w3.org/2000/svg','circle');c.setAttribute('r',10);c.setAttribute('fill','#07131f');c.setAttribute('stroke',color(n));badge.appendChild(c);const t=document.createElementNS('http://www.w3.org/2000/svg','text');t.setAttribute('text-anchor','middle');t.setAttribute('y',4);t.setAttribute('font-size',13);t.textContent=state.expanded.has(n.id)?'−':'+';badge.appendChild(t);g.appendChild(badge)}
      g.addEventListener('click',e=>{e.stopPropagation();selectNode(n.id)});g.addEventListener('dblclick',e=>{e.stopPropagation();toggleBranch(n.id)});dom.mindNodes.appendChild(g);
    }
    mindTransform();updateMindScopeControls();dom.visible.textContent=`${state.mind.visible.length.toLocaleString('de-DE')} kuratierte Mindmap-Objekte sichtbar · ${KB.nodes.length.toLocaleString('de-DE')} Canonicals im Bestand`;
  }
  function toggleBranch(id){const n=nodeById.get(id);if(state.mode!=='mindmap'||!primaryPresentationIds.has(id)||!n?.childNodes.some(child=>primaryPresentationIds.has(child.id)))return;if(state.expanded.has(id))state.expanded.delete(id);else state.expanded.add(id);renderMindmap();updateDetails(n)}
  function expandAll(){if(state.mode!=='mindmap')return;state.expanded=new Set([...nodeById.values()].filter(node=>node.childNodes.length).map(node=>node.id));renderMindmap();requestAnimationFrame(fitMindmap)}
  function collapseAll(){if(state.mode!=='mindmap')return;state.expanded=new Set([mindRoot().id]);renderMindmap();requestAnimationFrame(fitMindmap)}
  function openPath(id,render=true){const target=nodeById.get(id);if(isCuratedPresentationNode(target)){const anchorId=presentationAnchorId(target);for(const node of nodeById.values())if(node.id===anchorId||(node.presentationOnly&&primaryDomain(node)===primaryDomain(target))||(presentationCapabilityById.has(node.id)&&primaryDomain(node)===primaryDomain(target)))state.expanded.delete(node.id)}for(const a of ancestors(target))state.expanded.add(a.id);if(target?.id===presentationAnchorId(target))state.expanded.add(target.id);if(render)renderMindmap()}
  function mindBounds(){const ps=[...state.mind.positions.values()];if(!ps.length)return null;return{minX:Math.min(...ps.map(p=>p.x-p.w/2)),maxX:Math.max(...ps.map(p=>p.x+p.w/2)),minY:Math.min(...ps.map(p=>p.y-p.h/2)),maxY:Math.max(...ps.map(p=>p.y+p.h/2))}}
  function mindLegendSpace(){return dom.legend.getBoundingClientRect().height+68}
  function fitMindmap(){const b=mindBounds();if(!b)return;const rect=dom.stage.getBoundingClientRect(),pad=80,legendSpace=mindLegendSpace(),availableHeight=Math.max(100,rect.height-legendSpace),s=Math.min((rect.width-pad)/(b.maxX-b.minX),Math.max(100,availableHeight-pad)/(b.maxY-b.minY),1.15);state.mind.scale=Math.max(.08,s);state.mind.tx=rect.width/2-((b.minX+b.maxX)/2)*s;state.mind.ty=availableHeight/2-((b.minY+b.maxY)/2)*s;mindTransform()}
  function centerMindNode(id){
    const position=state.mind.positions.get(id);if(!position)return;const rect=dom.stage.getBoundingClientRect(),scale=1.05,availableHeight=Math.max(100,rect.height-mindLegendSpace());state.mind.scale=scale;state.mind.tx=rect.width/2-position.x*scale;state.mind.ty=availableHeight/2-position.y*scale;mindTransform();
  }

  function hash(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return(h>>>0)/4294967295}
  function buildGraph(focusId=null){
    const model=BRAIN.model,entityById=BRAIN.entityById;
    const center=entityById.has(focusId)?focusId:null;
    const semantic=BRAIN.subgraph(center);
    const include=new Set(semantic.nodeIds),firstHop=new Set(semantic.firstHopIds);
    const graphNodes=[...include].map(id=>entityById.get(id)).filter(Boolean).map(entity=>({id:entity.id,canonicalId:entity.canonicalId||entity.id,title:entity.title,category:entity.domain,type:entity.kind==='domain'?'domain':'knowledge',kind:entity.kind,hop:center?(entity.id===center?0:firstHop.has(entity.id)?1:2):null,r:entity.id===center?17:entity.kind==='domain'?17:entity.kind==='capability'?9:7,importance:entity.kind==='domain'?10:entity.kind==='capability'?8:6}));
    const index=new Set(graphNodes.map(node=>node.id));
    const graphEdges=BRAIN.semanticEdges(index).map(relation=>({...relation}));
    for(const entity of model.entities)if(index.has(entity.id)&&index.has(entity.parentId))graphEdges.push({source:entity.parentId,target:entity.id,type:'hierarchy',label:'Struktur',synthetic:true,contextEdge:true});
    const nodeIndex=new Map(graphNodes.map(node=>[node.id,node]));
    if(center){
      const direct=graphNodes.filter(node=>node.hop===1).sort((a,b)=>a.title.localeCompare(b.title,'de'));
      const second=graphNodes.filter(node=>node.hop===2).sort((a,b)=>a.title.localeCompare(b.title,'de'));
      const selected=nodeIndex.get(center);selected.x=0;selected.y=0;
      direct.forEach((node,index)=>{const angle=index/Math.max(1,direct.length)*Math.PI*2-Math.PI/2;node.x=Math.cos(angle)*190;node.y=Math.sin(angle)*190});
      second.forEach((node,index)=>{const angle=index/Math.max(1,second.length)*Math.PI*2-Math.PI/2;node.x=Math.cos(angle)*350;node.y=Math.sin(angle)*350});
    }else{
      const centers=new Map(model.domains.map((domain,index)=>{const angle=index/model.domains.length*Math.PI*2-Math.PI/2;return[domain.name,{x:Math.cos(angle)*480,y:Math.sin(angle)*330}]}));
      for(const node of graphNodes){const point=centers.get(node.category)||{x:0,y:0};if(node.type==='domain'){node.x=point.x;node.y=point.y}else{const angle=hash(node.id)*Math.PI*2,radius=node.kind==='capability'?70:95+hash(node.id+'r')*100;node.x=point.x+Math.cos(angle)*radius;node.y=point.y+Math.sin(angle)*radius}}
    }
    for(let iteration=0;iteration<(center?24:28);iteration++)for(let i=0;i<graphNodes.length;i++)for(let j=i+1;j<graphNodes.length;j++){
      const a=graphNodes[i],b=graphNodes[j],dx=b.x-a.x,dy=b.y-a.y,d=Math.sqrt(dx*dx+dy*dy+.1),min=a.r+b.r+(center?25:14);if(d>=min)continue;const move=(min-d)/d*.04;if(a.type!=='domain'&&a.id!==center){a.x-=dx*move;a.y-=dy*move}if(b.type!=='domain'&&b.id!==center){b.x+=dx*move;b.y+=dy*move}
    }
    state.graph.focusId=center;state.graph.nodes=graphNodes;state.graph.edges=graphEdges;
    dom.focus.textContent=center?'Kontext lösen':'Gesamtansicht';
    dom.visible.textContent=`${graphNodes.length} Brain-Entities · ${graphEdges.filter(edge=>!edge.synthetic).length} bestehende Relationen`;
    drawGraph();
  }
  function resizeBrain(){const r=dom.stage.getBoundingClientRect(),dpr=Math.min(2,window.devicePixelRatio||1);dom.brain.width=Math.floor(r.width*dpr);dom.brain.height=Math.floor(r.height*dpr);dom.brain.style.width=r.width+'px';dom.brain.style.height=r.height+'px';drawGraph()}
  function graphScreen(n){return{x:n.x*state.graph.scale+state.graph.tx,y:n.y*state.graph.scale+state.graph.ty}}
  function graphWorld(x,y){return{x:(x-state.graph.tx)/state.graph.scale,y:(y-state.graph.ty)/state.graph.scale}}
  function drawGraph(){
    if(state.mode!=='brain')return;const ctx=dom.brain.getContext('2d'),dpr=Math.min(2,window.devicePixelRatio||1),w=dom.brain.width/dpr,h=dom.brain.height/dpr;ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);ctx.save();ctx.translate(state.graph.tx,state.graph.ty);ctx.scale(state.graph.scale,state.graph.scale);
    const selected=state.selected,focused=Boolean(state.graph.focusId),direct=new Set();if(selected)for(const e of state.graph.edges)if(e.source===selected||e.target===selected){direct.add(e.source);direct.add(e.target)}
    for(const e of state.graph.edges){const a=state.graph.nodes.find(n=>n.id===e.source),b=state.graph.nodes.find(n=>n.id===e.target);if(!a||!b)continue;const isDirect=selected&&(e.source===selected||e.target===selected),dim=selected&&!isDirect&&!e.contextEdge,relationColor=e.contextEdge?'#6e91aa':relationTypeById.get(e.type)?.color||'#567087';ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.strokeStyle=isDirect?relationColor:dim?'#203746':relationColor;ctx.globalAlpha=isDirect?.96:dim?(focused?.32:.18):e.synthetic?.5:.56;ctx.lineWidth=(isDirect?2.5:e.contextEdge?1.35:1.15)/state.graph.scale;ctx.stroke();if(focused&&isDirect){const label=e.label||relationTypeById.get(e.type)?.label||e.type,mx=(a.x+b.x)/2,my=(a.y+b.y)/2;ctx.globalAlpha=.92;ctx.font=`600 ${10/state.graph.scale}px Inter,system-ui`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#a9d8ee';ctx.fillText(truncate(label,24),mx,my-7/state.graph.scale)}}
    ctx.globalAlpha=1;const labelBoxes=[];
    for(const n of state.graph.nodes){const sel=n.id===selected,related=selected&&n.type==='knowledge'&&!sel&&direct.has(n.id),dim=selected&&n.type==='knowledge'&&!sel&&!direct.has(n.id),r=n.r*(n.type==='domain'?1.12:1);ctx.beginPath();ctx.arc(n.x,n.y,r,0,Math.PI*2);ctx.fillStyle=color(n);ctx.globalAlpha=dim?.24:1;ctx.shadowColor=color(n);ctx.shadowBlur=(sel?24:n.type==='domain'?15:6)/state.graph.scale;ctx.fill();ctx.shadowBlur=0;if(sel||related){ctx.strokeStyle=sel?'#fff':'#5de1d7';ctx.lineWidth=(sel?2.5:1.7)/state.graph.scale;ctx.stroke()}
      const showLabel=n.type==='domain'||sel||(focused&&n.hop===1)||state.graph.scale>.82||(state.graph.scale>.55&&n.importance>=9);if(showLabel&&(!dim||focused)){const fontSize=n.type==='domain'?14:11,text=truncate(n.title,n.type==='domain'?26:30),labelY=n.y+r+7/state.graph.scale,pad=6/state.graph.scale;ctx.font=`${n.type==='domain'?'700':'600'} ${fontSize}px Inter,system-ui`;const width=ctx.measureText(text).width,box={left:n.x-width/2-pad,right:n.x+width/2+pad,top:labelY-pad,bottom:labelY+fontSize+pad},overlaps=labelBoxes.some(other=>box.left<other.right&&box.right>other.left&&box.top<other.bottom&&box.bottom>other.top),underLegend=labelY*state.graph.scale+state.graph.ty>h-mindLegendSpace();if(sel||(!overlaps&&!underLegend)){ctx.textAlign='center';ctx.textBaseline='top';ctx.fillStyle='#eaf6ff';ctx.globalAlpha=dim?.58:.95;ctx.fillText(text,n.x,labelY);labelBoxes.push(box)}}}
    ctx.restore();ctx.globalAlpha=1;
  }
  function fitGraph(){
    const ns=state.graph.nodes;if(!ns.length)return;
    const rect=dom.stage.getBoundingClientRect(),reserved=mindLegendSpace(),height=Math.max(140,rect.height-reserved),focus=state.graph.focusId&&ns.find(node=>node.id===state.graph.focusId);
    if(focus){
      const radius=Math.max(190,...ns.map(node=>Math.hypot(node.x-focus.x,node.y-focus.y)+node.r));
      const scale=Math.max(.25,Math.min((rect.width-160)/(radius*2),(height-100)/(radius*2),1.3));
      state.graph.scale=scale;state.graph.tx=rect.width/2-focus.x*scale;state.graph.ty=height/2-focus.y*scale;
    }else{
      const minX=Math.min(...ns.map(node=>node.x-node.r)),maxX=Math.max(...ns.map(node=>node.x+node.r));
      const minY=Math.min(...ns.map(node=>node.y-node.r)),maxY=Math.max(...ns.map(node=>node.y+node.r));
      const scale=Math.min((rect.width-120)/(maxX-minX),(height-100)/(maxY-minY),1.25);
      state.graph.scale=Math.max(.12,scale);state.graph.tx=rect.width/2-((minX+maxX)/2)*state.graph.scale;state.graph.ty=height/2-((minY+maxY)/2)*state.graph.scale;
    }
    drawGraph();
  }
  function graphHit(x,y){const p=graphWorld(x,y);return [...state.graph.nodes].reverse().find(n=>Math.hypot(p.x-n.x,p.y-n.y)<=n.r+5/state.graph.scale)||null}
  function edgeHit(x,y){const p=graphWorld(x,y);let best=null,dist=10/state.graph.scale;for(const e of state.graph.edges.filter(e=>!e.synthetic)){const a=state.graph.nodes.find(n=>n.id===e.source),b=state.graph.nodes.find(n=>n.id===e.target);if(!a||!b)continue;const d=pointLineDistance(p,a,b);if(d<dist){dist=d;best=e}}return best}
  function pointLineDistance(p,a,b){const dx=b.x-a.x,dy=b.y-a.y,l=dx*dx+dy*dy;if(!l)return Math.hypot(p.x-a.x,p.y-a.y);const t=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.y-a.y)*dy)/l)),x=a.x+t*dx,y=a.y+t*dy;return Math.hypot(p.x-x,p.y-y)}

  function selectNode(id,learningTarget=null){if(!nodeById.has(id))return;if(state.selected!==id)state.relationsExpanded=false;state.selected=id;if(state.mode==='brain'&&BRAIN.entityById.has(id))BRAIN.select(id);if(!isCuratedPresentationNode(nodeById.get(id)))state.mindScope='global';updateMindScopeControls();updateDetails(nodeById.get(id));if(state.mode==='learning')applyLearningFocus(id,false,true,true,learningTarget);if(state.mode==='mindmap')renderMindmap();else if(state.mode==='brain'&&state.brainRenderer==='2d')drawGraph();if(innerWidth<1200)dom.panel.classList.add('open')}
  let highlightTimer=null;
  function updateBackButton(){dom.back.hidden=!state.navigationStack.length}
  function learningDisclosureSnapshot(){return state.mode==='learning'?[...dom.learningContent.querySelectorAll('details')].map(item=>Boolean(item.open)):[]}
  function restoreLearningDisclosures(values){if(state.mode==='learning')dom.learningContent.querySelectorAll('details').forEach((item,index)=>{item.open=Boolean(values?.[index])})}
  function openKnowledgeMode(mode,id=state.selected){const valid=mode==='mindmap'?primaryPresentationIds.has(id):mode==='brain'&&BRAIN.entityById.has(id);if(!valid)return false;state.navigationStack.push(captureNavigationContext());state.mindScope='focus';setMode(mode);navigateToNode(id,{remember:false});updateBackButton();return true}
  function clearLearningFocus(remember=true){
    dom.learningContent.querySelectorAll('.learning-link-target').forEach(item=>{item.classList.remove('learning-link-target');item.removeAttribute('data-learning-target')});
    if(remember)state.learningFocusId=null;
  }
  function applyLearningFocus(id,scroll=true,remember=true,local=false,preferredTarget=null){
    if(state.mode!=='learning')return false;
    clearLearningFocus(remember);
    if(state.legacyContext)return false;
    const anchor=chapterAnchorById.get(id),focus=anchor?.focusTarget;
    if(!focus)return false;
    const flags=['cloudPrototype','azurePrototype','organizationPrototype','accessPrototype','governancePrototype','networkingPrototype'];
    const chapterIndex=flags.findIndex(flag=>state[flag]);
    if(chapterIndex<0)return false;
    const activeKey=['cloudStepIndex','azureStepIndex','organizationStepIndex','accessStepIndex','governanceStepIndex','networkingStepIndex'][chapterIndex];
    if(!local&&(chapterIndex+1!==anchor.chapter||state[activeKey]!==anchor.stepIndex))return false;
    // Local clicks must highlight the selected concept itself, never an associated primary-anchor summary.
    if(local&&focus.entityId!==id)return false;
    const attr=['cloud','azure','organization','access','governance','network'][chapterIndex];
    const candidates=[...dom.learningContent.querySelectorAll(`[data-${attr}-entity="${focus.entityId||id}"]`),...dom.learningContent.querySelectorAll(`[data-learning-focus-for="${id}"]`)];
    const visible=item=>{for(let p=item.parentElement;p&&p!==dom.learningContent;p=p.parentElement)if(p.tagName==='DETAILS'&&!p.open)return false;return true};
    const target=preferredTarget&&candidates.includes(preferredTarget)?preferredTarget:candidates.find(item=>!local||visible(item));
    if(!target||local&&!visible(target))return false;
    if(!local)for(let parent=target.parentElement;parent&&parent!==dom.learningContent;parent=parent.parentElement)if(parent.tagName==='DETAILS')parent.open=true;
    target.classList.add('learning-link-target');target.setAttribute('data-learning-target','Lernziel');
    if(remember)state.learningFocusId=id;
    if(scroll)requestAnimationFrame(()=>target.scrollIntoView({block:'center',inline:'nearest',behavior:'auto'}));
    return true;
  }
  function openChapterAnchor(id=state.selected){const target=chapterAnchorById.get(id);if(!target)return false;state.navigationStack.push(captureNavigationContext());[openCloudStep,openAzureStep,openOrganizationStep,openAccessStep,openGovernanceStep,openNetworkingStep][target.chapter-1](target.stepIndex);state[['cloudSelection','azureSelection','organizationSelection','accessSelection','governanceSelection','networkingSelection'][target.chapter-1]]=id;selectNode(id);applyLearningFocus(id);setNavigationHash(id);updateBackButton();return true}
  function openLearningForNode(id=state.selected){if(openChapterAnchor(id))return;const legacy=(stepsByNode.get(id)||[])[0];if(legacy)openLearningStep(legacy.id)}
  function captureNavigationContext(){return{learningFocusId:state.learningFocusId||null,brainCenterId:BRAIN.state.contextCenterId,learningDetails:learningDisclosureSnapshot(),mindScope:state.mindScope,brainRenderer:state.brainRenderer,architectureUI:architectureCase?.snapshot()||null,mode:state.mode,selected:state.selected,expanded:[...state.expanded],mind:{scale:state.mind.scale,tx:state.mind.tx,ty:state.mind.ty},graph:{scale:state.graph.scale,tx:state.graph.tx,ty:state.graph.ty,focusId:state.graph.focusId},scenarioId:state.scenarioId,learningPathId:state.learningPathId,learningStepId:state.learningStepId,crossModeOrigin:state.crossModeOrigin?JSON.parse(JSON.stringify(state.crossModeOrigin)):null,legacyContext:state.legacyContext,cloudPrototype:state.cloudPrototype,cloudStepIndex:state.cloudStepIndex,azurePrototype:state.azurePrototype,azureStepIndex:state.azureStepIndex,organizationPrototype:state.organizationPrototype,organizationStepIndex:state.organizationStepIndex,accessPrototype:state.accessPrototype,accessStepIndex:state.accessStepIndex,governancePrototype:state.governancePrototype,governanceStepIndex:state.governanceStepIndex,networkingPrototype:state.networkingPrototype,networkingStepIndex:state.networkingStepIndex}}
  function setNavigationHash(nodeId){const parameters=new URLSearchParams();parameters.set('mode',state.mode);if(state.mode==='brain'){parameters.set('renderer',state.brainRenderer);if(BRAIN.entityById.has(nodeId)){parameters.set(BRAIN.entityById.get(nodeId).kind==='domain'?'domain':'node',nodeId);if(BRAIN.state.contextCenterId)parameters.set('center',BRAIN.state.contextCenterId);else parameters.set('view','overview')}else parameters.set('view','overview')}else if(nodeId)parameters.set('node',nodeId);if(state.mode==='architecture'){if(architectureCase?.ui.view==='case'){parameters.set('case','case-01');parameters.set('step',architectureCase.ui.step+1);if(architectureCase.ui.topic)parameters.set('topic',architectureCase.ui.topic);if(architectureCase.ui.component)parameters.set('component',architectureCase.ui.component);if(architectureCase.ui.step===1&&architectureCase.ui.focusQuestion)parameters.set('question',architectureCase.ui.focusQuestion)}else if(architectureCase?.ui.view==='reference')parameters.set('scenario',state.scenarioId);}if(state.mode==='architecture'&&state.crossModeOrigin?.selected_candidate_id)parameters.set('scenario',state.crossModeOrigin.selected_candidate_id);if(state.mode==='learning'&&(state.crossModeOrigin?.selected_candidate_id||state.legacyContext))parameters.set('learningStep',state.crossModeOrigin?.selected_candidate_id||state.learningStepId);if(state.crossModeOrigin?.node_id)parameters.set('origin',state.crossModeOrigin.node_id);if(state.mode==='learning'&&!state.legacyContext){const active=[['cloudPrototype','cloudStepIndex',CLOUD_FLOW],['azurePrototype','azureStepIndex',AZURE_FLOW],['organizationPrototype','organizationStepIndex',ORGANIZATION_FLOW],['accessPrototype','accessStepIndex',ACCESS_FLOW],['governancePrototype','governanceStepIndex',GOVERNANCE_FLOW],['networkingPrototype','networkingStepIndex',NETWORK_FLOW]].find(([flag])=>state[flag]);if(active){parameters.set('learningFlow',active[2].id);parameters.set('flowStep',active[2].steps[state[active[1]]].id)}}const hash=`#${parameters.toString()}`;try{history.replaceState(null,'',hash)}catch{location.hash=hash}}
  function navigateToNode(nodeId,options={}){
    if(nodeId==='presentation-cost-optimization')nodeId='azure-1073';
    if(nodeId==='presentation-ai-streaming')nodeId='azure-0789';
    if(!nodeById.has(nodeId))return false;
    const previousMindmapContext=state.mode==='mindmap'&&aiSecondaryCanonicalIds.has(nodeId)?captureNavigationContext():null;
    if(previousMindmapContext)setMode('brain');
    if(state.mode==='mindmap'&&!storageVisibleIds.has(nodeId)&&primaryDomain(nodeById.get(nodeId))==='Storage'){
      const resolved=v34ResolutionById.get(nodeId)?.resolved_id;
      nodeId=storageLegacyTargets[nodeId]||(resolved!==nodeId&&nodeById.has(resolved)?resolved:null)||v34OverlayById.get(nodeId)?.primary_target?.node_id||STORAGE_PRESENTATION.anchorId;
    }
    if(state.mode==='mindmap'&&!computeVisibleIds.has(nodeId)&&primaryDomain(nodeById.get(nodeId))==='Compute & Application Platform'){
      const resolved=v34ResolutionById.get(nodeId)?.resolved_id,overlayTarget=v34OverlayById.get(nodeId)?.primary_target?.node_id;
      nodeId=computeLegacyTargets[nodeId]||(resolved!==nodeId&&nodeById.has(resolved)?resolved:null)||(nodeById.has(overlayTarget)?overlayTarget:null)||nodeId;
    }
    if(state.mode==='mindmap'&&!containersVisibleIds.has(nodeId)&&primaryDomain(nodeById.get(nodeId))==='Containers & Cloud Native'){
      const resolved=v34ResolutionById.get(nodeId)?.resolved_id,overlayTarget=v34OverlayById.get(nodeId)?.primary_target?.node_id;
      nodeId=containersLegacyTargets[nodeId]||(resolved!==nodeId&&containersVisibleIds.has(resolved)?resolved:null)||(containersVisibleIds.has(overlayTarget)?overlayTarget:null)||CONTAINERS_PRESENTATION.anchorId;
    }
    if(state.mode==='mindmap'&&!databasesVisibleIds.has(nodeId)&&primaryDomain(nodeById.get(nodeId))==='Databases & Data Platforms'){
      const resolved=v34ResolutionById.get(nodeId)?.resolved_id,overlayTarget=v34OverlayById.get(nodeId)?.primary_target?.node_id;
      nodeId=databasesLegacyTargets[nodeId]||(resolved!==nodeId&&databasesVisibleIds.has(resolved)?resolved:null)||(databasesVisibleIds.has(overlayTarget)?overlayTarget:null)||DATABASES_PRESENTATION.anchorId;
    }
    if(state.mode==='mindmap'&&!integrationVisibleIds.has(nodeId)&&primaryDomain(nodeById.get(nodeId))==='Integration, Messaging & IoT'){
      const resolved=v34ResolutionById.get(nodeId)?.resolved_id,overlayTarget=v34OverlayById.get(nodeId)?.primary_target?.node_id;
      nodeId=integrationLegacyTargets[nodeId]||(resolved!==nodeId&&integrationVisibleIds.has(resolved)?resolved:null)||(integrationVisibleIds.has(overlayTarget)?overlayTarget:null)||nodeId;
    }
    if(state.mode==='mindmap'&&!identityVisibleIds.has(nodeId)&&primaryDomain(nodeById.get(nodeId))==='Identity & Access'){const resolved=v34ResolutionById.get(nodeId)?.resolved_id,overlayTarget=v34OverlayById.get(nodeId)?.primary_target?.node_id;nodeId=identityLegacyTargets[nodeId]||(identityVisibleIds.has(resolved)?resolved:null)||(identityVisibleIds.has(overlayTarget)?overlayTarget:null)||IDENTITY_PRESENTATION.anchorId;}
    if(state.mode==='mindmap'&&!securityVisibleIds.has(nodeId)&&primaryDomain(nodeById.get(nodeId))==='Security & Protection'){const resolved=v34ResolutionById.get(nodeId)?.resolved_id,overlayTarget=v34OverlayById.get(nodeId)?.primary_target?.node_id;nodeId=securityLegacyTargets[nodeId]||(securityVisibleIds.has(resolved)?resolved:null)||(securityVisibleIds.has(overlayTarget)?overlayTarget:null)||SECURITY_PRESENTATION.anchorId;}
    if(state.mode==='mindmap'&&!monitoringVisibleIds.has(nodeId)&&primaryDomain(nodeById.get(nodeId))==='Monitoring & Operations'){const resolved=v34ResolutionById.get(nodeId)?.resolved_id,overlayTarget=v34OverlayById.get(nodeId)?.primary_target?.node_id;nodeId=monitoringLegacyTargets[nodeId]||(monitoringVisibleIds.has(resolved)?resolved:null)||(monitoringVisibleIds.has(overlayTarget)?overlayTarget:null)||MONITORING_PRESENTATION.anchorId;}
    if(state.mode==='mindmap'&&!reliabilityVisibleIds.has(nodeId)&&primaryDomain(nodeById.get(nodeId))==='Reliability & Resilience'){const resolved=v34ResolutionById.get(nodeId)?.resolved_id,overlayTarget=v34OverlayById.get(nodeId)?.primary_target?.node_id;nodeId=reliabilityLegacyTargets[nodeId]||(reliabilityVisibleIds.has(resolved)?resolved:null)||(reliabilityVisibleIds.has(overlayTarget)?overlayTarget:null)||RELIABILITY_PRESENTATION.anchorId;}
    if(state.mode==='mindmap'&&!migrationVisibleIds.has(nodeId)&&primaryDomain(nodeById.get(nodeId))==='Migration & Modernization'){const resolved=v34ResolutionById.get(nodeId)?.resolved_id,overlayTarget=v34OverlayById.get(nodeId)?.primary_target?.node_id;nodeId=migrationLegacyTargets[nodeId]||(migrationVisibleIds.has(resolved)?resolved:null)||(migrationVisibleIds.has(overlayTarget)?overlayTarget:null)||MIGRATION_PRESENTATION.anchorId;}
    if(state.mode==='mindmap'&&!devopsVisibleIds.has(nodeId)&&primaryDomain(nodeById.get(nodeId))==='DevOps & Automation'){const resolved=v34ResolutionById.get(nodeId)?.resolved_id,overlayTarget=v34OverlayById.get(nodeId)?.primary_target?.node_id;nodeId=devopsLegacyTargets[nodeId]||(devopsVisibleIds.has(resolved)?resolved:null)||(devopsVisibleIds.has(overlayTarget)?overlayTarget:null)||DEVOPS_PRESENTATION.anchorId;}
    if(state.mode==='mindmap'&&!aiVisibleIds.has(nodeId)&&primaryDomain(nodeById.get(nodeId))==='AI & Analytics'){const resolved=v34ResolutionById.get(nodeId)?.resolved_id,overlayTarget=v34OverlayById.get(nodeId)?.primary_target?.node_id;nodeId=aiLegacyTargets[nodeId]||(aiVisibleIds.has(resolved)?resolved:null)||(aiVisibleIds.has(overlayTarget)?overlayTarget:null)||AI_PRESENTATION.anchorId;}
    if(state.mode==='mindmap'&&!foundationsVisibleIds.has(nodeId)&&primaryDomain(nodeById.get(nodeId))==='Cloud & Azure Foundations'){const resolved=v34ResolutionById.get(nodeId)?.resolved_id,overlayTarget=v34OverlayById.get(nodeId)?.primary_target?.node_id;nodeId=foundationsLegacyTargets[nodeId]||(foundationsVisibleIds.has(resolved)?resolved:null)||(foundationsVisibleIds.has(overlayTarget)?overlayTarget:null)||FOUNDATIONS_PRESENTATION.anchorId;}
    if(state.mode==='mindmap'&&!costVisibleIds.has(nodeId)&&primaryDomain(nodeById.get(nodeId))==='Cost Management & FinOps'){const resolved=v34ResolutionById.get(nodeId)?.resolved_id,overlayTarget=v34OverlayById.get(nodeId)?.primary_target?.node_id;nodeId=costLegacyTargets[nodeId]||(costVisibleIds.has(resolved)?resolved:null)||(costVisibleIds.has(overlayTarget)?overlayTarget:null)||COST_PRESENTATION.anchorId;}
    if(state.mode==='mindmap'&&!governanceVisibleIds.has(nodeId)&&primaryDomain(nodeById.get(nodeId))==='Governance & Resource Management'){const resolved=v34ResolutionById.get(nodeId)?.resolved_id,overlayTarget=v34OverlayById.get(nodeId)?.primary_target?.node_id;nodeId=governanceLegacyTargets[nodeId]||(governanceVisibleIds.has(resolved)?resolved:null)||(governanceVisibleIds.has(overlayTarget)?overlayTarget:null)||GOVERNANCE_PRESENTATION.anchorId;}
    if(state.mode==='brain'&&!BRAIN.entityById.has(nodeId)&&primaryPresentationIds.has(nodeId))return openKnowledgeMode('mindmap',nodeId);
    if(state.mode==='brain'&&!BRAIN.entityById.has(nodeId)){
      const target=v34OverlayById.get(nodeId)?.primary_target?.node_id;
      if(BRAIN.entityById.has(target))nodeId=target;
      else return false;
    }
    const hiddenPrimaryContext=state.mode==='mindmap'&&!primaryPresentationIds.has(nodeId)?captureNavigationContext():null;
    if(hiddenPrimaryContext)setMode('brain');
    if(options.remember!==false&&(state.selected!==nodeId||options.forceHistory))state.navigationStack.push(previousMindmapContext||hiddenPrimaryContext||captureNavigationContext());
    openPath(nodeId,false);state.highlighted=nodeId;dom.panel.classList.add('navigation-target');
    if(state.mode!=='mindmap')renderMindmap();
    selectNode(nodeId);if(state.mode==='mindmap'&&state.mindScope==='focus'&&nodeId===presentationAnchorId(nodeById.get(nodeId)))fitMindmap();else centerMindNode(nodeId);
    if(state.mode==='brain'){if(BRAIN.entityById.has(nodeId))BRAIN.focus(nodeId);if(state.brainRenderer==='3d')window.ADB3D_RENDERER.focusNode(nodeId);else{buildGraph(BRAIN.state.contextCenterId);fitGraph()}}
    clearTimeout(highlightTimer);highlightTimer=setTimeout(()=>{dom.panel.classList.remove('navigation-target');if(state.highlighted===nodeId){state.highlighted=null;if(state.mode==='mindmap')renderMindmap()}},1800);
    updateBackButton();setNavigationHash(nodeId);return true;
  }
  function restoreNavigationContext(){
    const context=state.navigationStack.pop();if(!context)return;
    architectureCase?.restore(context.architectureUI);
    state.expanded=new Set(context.expanded);state.scenarioId=context.scenarioId;state.learningPathId=context.learningPathId;state.learningStepId=context.learningStepId;state.crossModeOrigin=context.crossModeOrigin||null;state.legacyContext=Boolean(context.legacyContext);state.cloudPrototype=Boolean(context.cloudPrototype);state.cloudStepIndex=context.cloudStepIndex||0;state.azurePrototype=Boolean(context.azurePrototype);state.azureStepIndex=context.azureStepIndex||0;state.organizationPrototype=Boolean(context.organizationPrototype);state.organizationStepIndex=context.organizationStepIndex||0;state.accessPrototype=Boolean(context.accessPrototype);state.accessStepIndex=context.accessStepIndex||0;state.governancePrototype=Boolean(context.governancePrototype);state.governanceStepIndex=context.governanceStepIndex||0;state.networkingPrototype=Boolean(context.networkingPrototype);state.networkingStepIndex=context.networkingStepIndex||0;state.graph.focusId=context.graph.focusId;state.highlighted=context.selected;
    if(context.mode==='brain'){if(context.brainCenterId&&BRAIN.entityById.has(context.brainCenterId))BRAIN.focus(context.brainCenterId);else BRAIN.overview()}
    state.mindScope=context.mindScope||'global';state.brainRenderer=context.brainRenderer||state.brainRenderer;setMode(context.mode);if(context.selected)selectNode(context.selected);else clearDetails();restoreLearningDisclosures(context.learningDetails);state.learningFocusId=context.learningFocusId||null;if(state.learningFocusId)applyLearningFocus(state.learningFocusId,false,true,true);else if(state.mode==='learning')clearLearningFocus();
    state.mind={...state.mind,...context.mind};mindTransform();state.graph={...state.graph,...context.graph};if(state.mode==='brain')drawGraph();
    updateBackButton();if(context.mode==='architecture'||context.selected)setNavigationHash(context.selected);else try{history.replaceState(null,'',location.pathname+location.search)}catch{}
  }
  window.navigateToNode=navigateToNode;
  function compactContextLink(mode,count,available){
    if(!available)return'';const label=mode==='architecture'?'Architecture':'Lernen',description=mode==='architecture'?`${count} passende ${count===1?'Referenzarchitektur':'Referenzarchitekturen'}`:`${count} ${count===1?'passender Lerninhalt':'passende Lerninhalte'}`,action=mode==='architecture'?'Zum Architecture-Bereich':'Zum Lerninhalt';return`<div class="compact-context-link"><div><b>${escapeHtml(description)}</b><small>Kontext für ${escapeHtml(presentationTitle(nodeById.get(state.selected)))}</small></div><button type="button" data-compact-mode="${escapeHtml(mode)}">${escapeHtml(action)} →</button></div>`
  }
  function relationPriority(relation,nodeId,index){
    const presentation=relationPresentation(relation,nodeId),other=nodeById.get(presentation.otherId),typeScore={contains:70,requires:65,uses:62,connects_to:60,secured_by:58,alternative_to:54,hosts:44,used_by:42,monitored_by:30,governed_by:28,part_of:26,organized_by:20}[presentation.typeId]||35;return(primaryDomain(other)===primaryDomain(nodeById.get(nodeId))?100:0)+typeScore-index/1000
  }
  function renderRelations(n,relations){
    const limit=3,ranked=relations.map((relation,index)=>({relation,index,score:relationPriority(relation,n.id,index)})).sort((a,b)=>b.score-a.score||a.index-b.index),shown=state.relationsExpanded?ranked:ranked.slice(0,limit);dom.relationList.innerHTML=shown.map(({relation:r})=>{const presentation=relationPresentation(r,n.id),other=nodeById.get(presentation.otherId);return`<button class="relation-item" data-id="${other?.id||''}" data-direction="${presentation.direction}"><b style="color:${escapeHtml(presentation.color)}">${escapeHtml(presentation.label)}</b><span>${escapeHtml(presentationTitle(other)||'Unbekannter Knoten')}</span><small>${escapeHtml(r.explanation)}</small></button>`}).join('');dom.relationList.querySelectorAll('button').forEach(button=>button.addEventListener('click',()=>navigateToNode(button.dataset.id)));dom.toggleRelations.hidden=relations.length<=limit;dom.toggleRelations.textContent=state.relationsExpanded?'Beziehungen reduzieren':`Alle ${relations.length} Beziehungen anzeigen`;dom.toggleRelations.setAttribute('aria-expanded',String(state.relationsExpanded));
  }
  function updateDetails(n){
    const classification=classificationById.get(n.id)||{},v34Row=v34RowById.get(n.id),v34Overlay=v34OverlayById.get(n.id),networking=isCuratedPresentationNode(n)||n.id===root.id,acceptedSections=[],distinct=value=>{const text=String(value||'').trim();if(!text)return'';if(acceptedSections.some(previous=>contentRedundant(previous,text)))return'';acceptedSections.push(text);return text},simple=distinct(n.description?.simple||n.description?.technical),technical=distinct(n.description?.technical),why=distinct(n.why_important),architecture=distinct(n.description?.architecture),examplesText=distinct((n.examples||[]).join('\n\n')),analogy=distinct(n.analogy),merksatz=distinct(n.merksatz),flags=auditFlags(n),scenarioContexts=scenariosByNode.get(n.id)||[],stepContexts=stepsByNode.get(n.id)||[],parent=presentationParentId(n)&&nodeById.get(presentationParentId(n));dom.category.textContent=primaryDomain(n);dom.category.style.borderColor=color(n);dom.title.textContent=presentationTitle(n);dom.path.textContent=networking?currentPath(n):primaryDomain(n);dom.audit.hidden=n.id!=='azure-1056';if(n.id==='azure-1056')dom.audit.textContent='Persönlicher AZ-900-Merksatz ohne geprüfte Quelle. Als Lernkontext erhalten; fachliche Prüfung erforderlich.';
    const architectureResolution=phase3Enabled?crossModeResolver.resolve(n.id,'architecture'):null,learningResolution=phase3Enabled?crossModeResolver.resolve(n.id,'learning'):null;
    dom.contextModeActions.hidden=false;dom.contextArchitecture.disabled=!(phase3Enabled?architectureResolution?.candidates?.length:scenarioContexts.length);dom.contextLearning.disabled=!(chapterAnchorById.has(n.id)||stepContexts.length);dom.contextMindmap.disabled=!primaryPresentationIds.has(n.id);dom.contextBrain.disabled=!BRAIN.entityById.has(n.id);dom.contextLearning.textContent='Im Lernen verstehen';dom.contextLearning.hidden=true;for(const [button,mode] of [[dom.contextMindmap,'mindmap'],[dom.contextBrain,'brain'],[dom.contextArchitecture,'architecture'],[dom.contextLearning,'learning']]){button.classList.toggle('active',state.mode===mode);button.setAttribute('aria-current',state.mode===mode?'page':'false')}
    const children=primaryPresentationIds.has(n.id)?n.childNodes.filter(child=>primaryPresentationIds.has(child.id)).slice(0,8):[],relatedNodes=(n.relatedNodes||[]).map(id=>nodeById.get(id)).filter(item=>item&&primaryPresentationIds.has(item.id)),visibleParent=parent&&primaryPresentationIds.has(n.id)&&primaryPresentationIds.has(parent.id)?parent:null;
    dom.contextSummarySection.hidden=!(visibleParent||children.length||relatedNodes.length);dom.contextSummary.innerHTML=`${visibleParent?`<div class="context-facts"><button data-node-id="${escapeHtml(visibleParent.id)}"><small>Gehört zu</small><b>${escapeHtml(presentationTitle(visibleParent))}</b></button></div>`:''}${children.length?`<div class="context-children"><small>Unterthemen</small>${children.map(child=>`<button data-node-id="${escapeHtml(child.id)}">${escapeHtml(presentationTitle(child))}</button>`).join('')}</div>`:''}${relatedNodes.length?`<div class="context-children"><small>Verwandte Themen</small>${relatedNodes.map(item=>`<button data-node-id="${escapeHtml(item.id)}">${escapeHtml(presentationTitle(item))}</button>`).join('')}</div>`:''}`;
    dom.contextSummary.querySelectorAll('[data-node-id]').forEach(button=>button.addEventListener('click',()=>navigateToNode(button.dataset.nodeId)));
    const renderDetailText=(target,value)=>{if(isFoundationsPresentationNode(n)||isAIPresentationNode(n)||isDevopsPresentationNode(n)||isMigrationPresentationNode(n)||isStoragePresentationNode(n)||isComputePresentationNode(n)||isContainersPresentationNode(n)||isDatabasesPresentationNode(n)||isIntegrationPresentationNode(n)||isIdentityPresentationNode(n)||isSecurityPresentationNode(n)||isGovernancePresentationNode(n)||isCostPresentationNode(n)||isMonitoringPresentationNode(n)||isReliabilityPresentationNode(n))target.textContent=value;else renderSemanticText(target,value,n.id)};
    dom.simpleSection.hidden=!simple;renderDetailText(dom.short,simple);dom.technicalSection.hidden=!technical;renderDetailText(dom.technical,technical);dom.architecture.hidden=!architecture;renderDetailText(dom.architecture,architecture);dom.architectureSection.hidden=!architecture;
    const architectureCount=phase3Enabled?(architectureResolution?.candidates?.length||0):scenarioContexts.length;dom.architectureContextList.innerHTML=compactContextLink('architecture',architectureCount,architectureCount>0);dom.architectureLinkSection.hidden=!architectureCount;dom.architectureContextList.querySelector('[data-compact-mode]')?.addEventListener('click',()=>{if(phase3Enabled)startCrossModeContext(n.id,'architecture');else if(scenarioContexts[0])openScenario(scenarioContexts[0].id)});
    dom.whySection.hidden=!why;renderDetailText(dom.why,why);dom.examplesSection.hidden=!examplesText;renderDetailText(dom.examples,examplesText);dom.analogySection.hidden=!analogy;renderDetailText(dom.analogy,analogy);dom.merksatzSection.hidden=!merksatz;renderDetailText(dom.merksatz,merksatz);
    dom.meta.innerHTML='';dom.meta.hidden=true;
    const saved=userState(n.id);dom.learning.value=saved.status;dom.learningSection.hidden=true;dom.notes.value=saved.notes;dom.notesSection.hidden=false;dom.notesDisclosure.open=false;dom.notesDisclosureLabel.textContent='Notizen öffnen';dom.actions.hidden=false;
    const relations=n.relations.map(id=>relById.get(id)).filter(Boolean);dom.relationsSection.querySelector('h2').textContent='Wichtige Zusammenhänge';dom.relationsSection.hidden=!relations.length;renderRelations(n,relations);
    const anchor=chapterAnchorById.get(n.id),learningCount=anchor?1:stepContexts.length;dom.contextSection.hidden=!learningCount;dom.contextList.innerHTML=anchor?`<div class="compact-context-link"><div><b>Kapitel ${anchor.chapter} · Schritt ${anchor.stepIndex+1}</b><small>${escapeHtml(learningChapters.find(item=>item.number===anchor.chapter).flow.steps[anchor.stepIndex].title)}</small></div><button type="button" data-compact-mode="learning">Im Lernen verstehen →</button></div>`:compactContextLink('learning',learningCount,learningCount>0);dom.contextList.querySelector('[data-compact-mode]')?.addEventListener('click',()=>openLearningForNode(n.id));
    const sourceIds=new Set(n.sources);relations.forEach(r=>r.sources.forEach(s=>sourceIds.add(s)));const sources=[...sourceIds].map(id=>sourceById.get(id)).filter(Boolean);dom.sourcesSection.hidden=!sources.length;dom.sourceList.innerHTML=sources.map(s=>`<a href="${escapeHtml(s.url)}" target="_blank" rel="noreferrer">${escapeHtml(s.title)} ↗</a>`).join('');dom.sourceSummary.textContent=`Microsoft / offizielle Quellen (${sources.length})`;dom.sourcesDisclosure.classList.toggle('direct',!isContainersPresentationNode(n)&&!isDatabasesPresentationNode(n)&&!isIntegrationPresentationNode(n)&&!isIdentityPresentationNode(n)&&!isSecurityPresentationNode(n)&&!isGovernancePresentationNode(n)&&sources.length<=2);dom.sourcesDisclosure.open=!isContainersPresentationNode(n)&&!isDatabasesPresentationNode(n)&&!isIntegrationPresentationNode(n)&&!isIdentityPresentationNode(n)&&!isSecurityPresentationNode(n)&&!isGovernancePresentationNode(n)&&sources.length<=2;dom.sourceDisclosureLabel.textContent=dom.sourcesDisclosure.open?'':'Quellen anzeigen';
    const qualityRelevant=flags.length||classification.classification&&classification.classification!=='Canonical Node';dom.qualityDetails.hidden=true;dom.qualityDetails.open=false;dom.qualityContent.innerHTML=qualityRelevant?`<p><b>ID:</b> ${escapeHtml(n.id)}</p><p><b>Status:</b> ${escapeHtml(classification.classification||'Canonical Node')}</p><p><b>Review:</b> ${classification.status==='awaiting_human_review'?'Erforderlich':'Kein offener Strukturreview'}</p>${flags.length?`<p><b>Audit:</b> ${escapeHtml(flags.join(' · '))}</p>`:''}`:'';
    const extra=el('detailMore');extra.hidden=!(technical||architecture||examplesText||analogy||merksatz||sources.length);if(extra.dataset.nodeId!==n.id){extra.open=false;extra.dataset.nodeId=n.id}
    const branch=state.mode==='mindmap'&&primaryPresentationIds.has(n.id)&&n.childNodes.some(child=>primaryPresentationIds.has(child.id));dom.toggle.hidden=state.mode==='mindmap'?!branch:!primaryPresentationIds.has(n.id);dom.toggle.disabled=state.mode==='mindmap'?!branch:!primaryPresentationIds.has(n.id);dom.toggle.textContent=state.mode==='mindmap'?(state.expanded.has(n.id)?'Unterthemen ausblenden':'Unterthemen anzeigen'):'In Mindmap zeigen';dom.showRelations.hidden=!BRAIN.entityById.has(n.id)||state.mode==='brain';dom.showRelations.disabled=!BRAIN.entityById.has(n.id);dom.showRelations.textContent='Im Brain öffnen';updateBackButton();
  }
  function clearDetails(options={}){if(state.mode==='learning')clearLearningFocus();el('detailMore').hidden=true;state.selected=null;if(state.mode==='brain'&&!options.fromRenderer){BRAIN.overview();if(state.brainRenderer==='3d')window.ADB3D_RENDERER.overview();else buildGraph(null);setNavigationHash(null)}state.crossModeOrigin=null;state.relationsExpanded=false;updateMindScopeControls();dom.panel.classList.remove('open');dom.category.textContent='Azure';dom.title.textContent=RELEASE.product_name;dom.path.textContent='Wähle einen Knoten, um Lerninhalt und Zusammenhänge zu sehen.';dom.simpleSection.hidden=false;dom.short.textContent='Fünf Perspektiven verbinden die V3.4-Mindmap, einen 2D- und 3D-Wissensgraphen, Architekturszenarien und geführtes Lernen.';dom.technicalSection.hidden=false;dom.technical.textContent=releaseSummary;dom.meta.innerHTML='';dom.audit.hidden=true;dom.qualityDetails.hidden=true;dom.contextModeActions.hidden=true;dom.semanticChooser.hidden=true;[dom.contextSummarySection,dom.architectureSection,dom.architectureLinkSection,dom.whySection,dom.examplesSection,dom.analogySection,dom.merksatzSection,dom.learningSection,dom.relationsSection,dom.contextSection,dom.sourcesSection,dom.notesSection,dom.actions].forEach(x=>x.hidden=true);if(state.mode==='brain'&&state.brainRenderer==='2d')drawGraph();else if(state.mode==='mindmap')renderMindmap()}

  function nodeTitle(id){return nodeById.get(id)?.title||ARCH.referenced_nodes?.[id]?.title||id}
  function scenarioTitle(id){return scenarioById.get(id)?.title||id}
  function crossModePresentation(result){
    if(result.status==='direct')return{label:'Direkter Bezug',className:'direct',description:'Dieser Knoten wird vom vorhandenen Zielkontext ausdrücklich referenziert.'};
    if(result.subtype==='indirect_parent_context'){const allowlisted=result.provenance?.donor_resolution==='related';return{label:allowlisted?'Geprüfter Elternkontext · Allowlist':'Geprüfter Elternkontext',className:'indirect',description:`Kontext von ${result.provenance?.donor_title||result.provenance?.donor_node_id||'einem fachlichen Elternknoten'} · ${result.provenance?.parent_distance||'–'} Elternkante(n).`}}
    if(result.status==='related')return{label:'Verwandter Bezug',className:'related',description:'Der Zusammenhang folgt einer geprüften Struktur- oder Relationskante.'};
    return{label:'Kein geprüfter Kontext',className:'none',description:'Für diesen Knoten existiert in diesem Modus noch kein belastbarer, geprüfter Bezug.'};
  }
  function crossModeCandidateMeta(candidate,mode){const parts=[];if(mode==='learning'&&candidate.learning_path_id)parts.push(learningPathById.get(candidate.learning_path_id)?.title||candidate.learning_path_id);if(candidate.edge_count)parts.push(`${candidate.edge_count} Kante${candidate.edge_count===1?'':'n'}`);if(candidate.via_node_id)parts.push(`über ${nodeTitle(candidate.via_node_id)}`);return parts.join(' · ')}
  function crossModeContextHtml(result,mode,compact=false){
    const presentation=crossModePresentation(result),candidates=result.candidates||[],origin=nodeById.get(result.node_id),cards=candidates.map(candidate=>`<button type="button" class="cross-mode-candidate" data-cross-mode-candidate="${escapeHtml(candidate.candidate_id)}" data-cross-mode-mode="${escapeHtml(mode)}"><span>${escapeHtml(candidate.candidate_type==='scenario'?'Architecture Scenario':'Learning Step')}</span><b>${escapeHtml(candidate.title)}</b>${crossModeCandidateMeta(candidate,mode)?`<small>${escapeHtml(crossModeCandidateMeta(candidate,mode))}</small>`:''}${candidate.allowlist_reason?`<small class="allowlist-reason">Geprüft: ${escapeHtml(candidate.allowlist_reason)}</small>`:''}<em>Öffnen →</em></button>`).join('');
    return`<div class="cross-mode-context ${escapeHtml(presentation.className)}${compact?' compact':''}"><div class="cross-mode-heading"><span class="cross-mode-badge">${escapeHtml(presentation.label)}</span><small>${escapeHtml(mode==='architecture'?'Architecture':'Lernen')}</small></div><p>${escapeHtml(presentation.description)}</p>${origin&&!compact?`<div class="cross-mode-origin"><small>Ursprung</small><b>${escapeHtml(origin.title)}</b><span>${escapeHtml(origin.id)} · ${escapeHtml(currentPath(origin))}</span></div>`:''}${cards||`<div class="cross-mode-empty"><b>Kein vorhandener Kontext</b><span>Es werden bewusst keine ungeprüften Alternativen vorgeschlagen.</span></div>`}</div>`;
  }
  function shouldShowCrossModeLanding(mode){return phase3Enabled&&state.crossModeOrigin?.target_mode===mode&&!state.crossModeOrigin.selected_candidate_id}
  function bindCrossModeCandidates(container,originNodeId,mode){container.querySelectorAll('[data-cross-mode-candidate]').forEach(button=>button.addEventListener('click',()=>startCrossModeContext(originNodeId,mode,button.dataset.crossModeCandidate)))}
  function startCrossModeContext(originNodeId,mode,candidateId=null){
    if(!phase3Enabled)return false;const result=crossModeResolver.resolve(originNodeId,mode),candidate=candidateId&&result.candidates.find(item=>item.candidate_id===candidateId);if(candidateId&&!candidate)return false;const continuing=state.crossModeOrigin?.node_id===originNodeId&&state.crossModeOrigin?.target_mode===mode,sourceMode=continuing?state.crossModeOrigin.source_mode:state.mode;if(!continuing)state.navigationStack.push(captureNavigationContext());state.crossModeOrigin={node_id:originNodeId,source_mode:sourceMode,target_mode:mode,resolution_subtype:result.subtype,selected_candidate_id:candidateId||null};state.selected=originNodeId;
    if(candidateId){if(mode==='architecture'){if(!scenarioById.has(candidateId))return false;ensureArchitectureCase().reference();state.scenarioId=candidateId}else{const step=learningStepById.get(candidateId);if(!step)return false;state.networkingPrototype=false;state.cloudPrototype=false;state.azurePrototype=false;state.organizationPrototype=false;state.accessPrototype=false;state.governancePrototype=false;state.legacyContext=true;state.learningPathId=step.path_id;state.learningStepId=step.id}}
    setMode(mode);updateBackButton();setNavigationHash(originNodeId);return true;
  }
  function renderCrossModeLanding(mode){
    const originId=state.crossModeOrigin?.node_id,result=originId?crossModeResolver.resolve(originId,mode):null;if(!result){state.crossModeOrigin=null;return mode==='architecture'?renderArchitecture():renderLearning()}
    const target=mode==='architecture'?dom.scenarioContent:dom.learningContent,listTarget=mode==='architecture'?dom.scenarioList:dom.learningPathList;listTarget.innerHTML='';target.innerHTML=`<section class="cross-mode-landing"><header class="content-header"><div class="eyebrow">${mode==='architecture'?'Architecture-Kontext':'Learning-Kontext'} · V3.3 Phase 3</div><h1>${escapeHtml(nodeTitle(originId))}</h1><p class="content-lead">Wähle bewusst einen vorhandenen Kontext. Es wird nichts automatisch geöffnet.</p></header>${crossModeContextHtml(result,mode,false)}<div class="cross-mode-landing-actions"><button type="button" data-cross-mode-back>← Zurück zum Ursprung</button><button type="button" data-origin-mode="mindmap">Mindmap</button><button type="button" data-origin-mode="brain">Brain</button></div></section>`;bindCrossModeCandidates(target,originId,mode);target.querySelector('[data-cross-mode-back]')?.addEventListener('click',restoreNavigationContext);target.querySelectorAll('[data-origin-mode]').forEach(button=>button.addEventListener('click',()=>setMode(button.dataset.originMode)));dom.visible.textContent=`${result.candidates.length} geprüfte ${mode==='architecture'?'Architecture-':'Learning-'}Kontexte · keine automatische Auswahl`;
  }
  function crossModeOriginBanner(mode){const origin=state.crossModeOrigin?.target_mode===mode&&nodeById.get(state.crossModeOrigin.node_id);if(!origin)return'';const result=crossModeResolver.resolve(origin.id,mode),presentation=crossModePresentation(result);return`<aside class="cross-mode-origin-banner"><span>${escapeHtml(presentation.label)}</span><b>Ausgangspunkt: ${escapeHtml(origin.title)}</b><small>${escapeHtml(origin.id)} · ${escapeHtml(currentPath(origin))}</small><button type="button" data-cross-mode-back>← Zurück zum Ursprung</button></aside>`}
  function openScenario(id){if(!scenarioById.has(id))return;ensureArchitectureCase().reference();if(state.crossModeOrigin?.target_mode==='architecture')state.crossModeOrigin.selected_candidate_id=id;state.scenarioId=id;setMode('architecture')}
  function openLearningStep(id){const step=learningStepById.get(id);if(!step)return;if(state.mode!=='learning'){state.navigationStack.push(captureNavigationContext());updateBackButton()}state.networkingPrototype=false;state.cloudPrototype=false;state.azurePrototype=false;state.organizationPrototype=false;state.accessPrototype=false;state.governancePrototype=false;state.legacyContext=true;if(state.crossModeOrigin?.target_mode==='learning')state.crossModeOrigin.selected_candidate_id=id;state.learningPathId=step.path_id;state.learningStepId=id;setMode('learning');setNavigationHash(state.selected)}
  function listHtml(items){return `<ul>${(items||[]).map(item=>`<li>${escapeHtml(item)}</li>`).join('')}</ul>`}
  function architectureDiagram(scenario){
    const components=new Map((scenario.component_instances||[]).map(c=>[c.instance_id,c])),actors=new Map((scenario.actors||[]).map(a=>[a.id,a])),ids=scenario.diagram?.nodes||[];
    const resolved=ids.map(id=>{const component=components.get(id),actor=actors.get(id);return{id,title:component?.node_ref?nodeTitle(component.node_ref):actor?.label||component?.role?.replaceAll('_',' ')||id,nodeId:component?.node_ref||null,actor:Boolean(actor)}});
    const columns=Math.min(4,Math.max(1,Math.ceil(Math.sqrt(resolved.length)))),cellW=230,cellH=105,width=columns*cellW+30,rows=Math.ceil(resolved.length/columns),height=rows*cellH+60,positions=new Map(resolved.map((item,index)=>[item.id,{x:25+(index%columns)*cellW,y:25+Math.floor(index/columns)*cellH,w:185,h:54}]));
    const edges=(scenario.diagram?.edges||[]).map((edge,index)=>{const a=positions.get(edge.from),b=positions.get(edge.to);if(!a||!b)return'';const x1=a.x+a.w/2,y1=a.y+a.h/2,x2=b.x+b.w/2,y2=b.y+b.h/2,mx=(x1+x2)/2,my=(y1+y2)/2;return`<g><path class="diagram-edge" d="M${x1} ${y1} L${x2} ${y2}" marker-end="url(#arrow-${escapeHtml(scenario.id)})"/><text class="diagram-edge-label" x="${mx}" y="${my-5}" text-anchor="middle">${escapeHtml(edge.label||'')}</text></g>`}).join('');
    const nodes=resolved.map(item=>{const p=positions.get(item.id);return`<g class="diagram-node${item.actor?' actor':''}${item.nodeId?' clickable':''}" transform="translate(${p.x} ${p.y})" ${item.nodeId?`data-node-id="${escapeHtml(item.nodeId)}" role="button" tabindex="0"`:''}><rect width="${p.w}" height="${p.h}" rx="11"/><text x="${p.w/2}" y="${p.h/2+4}" text-anchor="middle">${escapeHtml(truncate(item.title,27))}</text></g>`}).join('');
    return `<svg viewBox="0 0 ${width} ${height}" aria-label="Architekturdiagramm ${escapeHtml(scenario.title)}"><defs><marker id="arrow-${escapeHtml(scenario.id)}" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#5a7d94"/></marker></defs>${edges}${nodes}</svg>`;
  }
  let architectureCase=null,architectureReturnButton=null,architectureBrainOrigin=null,architectureCaseEntry=null;
  function openArchitectureKnowledge(id,mode){
    if(!BRAIN.entityById.has(id))return;
    if(mode==='mindmap'&&!primaryPresentationIds.has(id))mode='brain';
    architectureBrainOrigin=captureNavigationContext();state.navigationStack.push(architectureBrainOrigin);updateBackButton();
    if(!architectureReturnButton){architectureReturnButton=document.createElement('button');architectureReturnButton.type='button';architectureReturnButton.className='ac-return';architectureReturnButton.textContent='← Zurück zu Case 01 · gleicher Schritt';dom.stage.append(architectureReturnButton);architectureReturnButton.addEventListener('click',()=>{const index=state.navigationStack.indexOf(architectureBrainOrigin);if(index<0)return;state.navigationStack.splice(index+1);restoreNavigationContext();architectureReturnButton.hidden=true;architectureBrainOrigin=null;});}
    state.selected=null;if(mode==='brain')state.brainRenderer='2d';setMode(mode);navigateToNode(id,{remember:false});architectureReturnButton.hidden=false;
  }
  function updateArchitectureCaseEntry(mode){
    if(!architectureCaseEntry){architectureCaseEntry=document.createElement('button');architectureCaseEntry.type='button';architectureCaseEntry.className='dm-case-entry';architectureCaseEntry.textContent='Case 01 · Bezug zum gewählten Baustein';architectureCaseEntry.addEventListener('click',()=>{const demo=ensureArchitectureCase(),component=demo.model.data.components.find(c=>c.canonicalId===state.selected),question=demo.model.data.questions.find(q=>q.canonicalIds.includes(state.selected));state.navigationStack.push(captureNavigationContext());updateBackButton();state.crossModeOrigin=null;demo.start(component?5:question?1:0);if(component)demo.ui.component=component.id;else if(question)demo.ui.topic=question.areaId;setMode('architecture');setNavigationHash(null);});dom.stage.append(architectureCaseEntry);}
    architectureCaseEntry.hidden=!['brain','mindmap'].includes(mode);
  }
  function ensureArchitectureCase(){
    if(architectureCase)return architectureCase;
    architectureCase=window.ADB_ARCHITECTURE_CASE_V34.create({
      content:dom.scenarioContent,view:dom.architectureView,sidebar:dom.scenarioList.closest('nav'),status:dom.visible,scenarios:ARCH.scenarios,
      render:renderArchitecture,hash:()=>setNavigationHash(null),openScenario:id=>{
        state.navigationStack.push(captureNavigationContext());updateBackButton();openScenario(id);setNavigationHash(null);
      },openBrain:id=>openArchitectureKnowledge(id,'brain'),openMindmap:id=>openArchitectureKnowledge(id,'mindmap')
    });
    architectureCase.fromHash(new URLSearchParams(location.hash.slice(1)));
    return architectureCase;
  }
  function renderArchitecture(){
    const demo=ensureArchitectureCase();
    document.querySelector('.workspace').classList.toggle('architecture-demo-active',demo.ui.view!=='reference');
    if(demo.render())return;
    renderArchitectureReference();
    const back=document.createElement('button');back.type='button';back.className='ac-reference-home';back.textContent='← Architecture-Startseite';back.addEventListener('click',()=>{state.crossModeOrigin=null;demo.home();});dom.scenarioContent.prepend(back);
  }
  function renderArchitectureReference(){
    const scenario=scenarioById.get(state.scenarioId)||ARCH.scenarios[0];state.scenarioId=scenario.id;
    dom.scenarioList.innerHTML=ARCH.scenarios.map((item,index)=>`<button class="selection-card${item.id===scenario.id?' active':''}" data-scenario-id="${escapeHtml(item.id)}"><b>${index+1}. ${escapeHtml(item.title)}</b><small>${escapeHtml(truncate(item.short_description,86))}</small></button>`).join('');
    const decisions=(scenario.architecture_decisions||[]).map(item=>`<div class="decision-card"><b>${escapeHtml(item.question||'Entscheidung')}</b><span>${escapeHtml(item.decision||'')}</span>${item.tradeoff?`<span><em>Trade-off:</em> ${escapeHtml(item.tradeoff)}</span>`:''}</div>`).join('');
    const operations=Object.entries(scenario.operations_model||{}).map(([key,value])=>`<div class="decision-card"><b>${escapeHtml(key.replaceAll('_',' '))}</b><span>${escapeHtml(value)}</span></div>`).join('');
    const accordions=[['Architecture Decisions',decisions],['Security',listHtml(scenario.security_considerations)],['Monitoring',listHtml(scenario.monitoring_considerations)],['Reliability',listHtml(scenario.reliability_considerations)],['Costs',listHtml(scenario.cost_considerations)],['Common Mistakes',listHtml(scenario.common_mistakes)],['Operations Model',operations]].map(([title,body],index)=>`<details${index===0?' open':''}><summary>${title}</summary><div class="accordion-body">${body}</div></details>`).join('');
    dom.scenarioContent.innerHTML=`${crossModeOriginBanner('architecture')}<header class="content-header"><div class="eyebrow">Architecture Scenario · V2.0 Runtime</div><h1>${escapeHtml(scenario.title)}</h1><p class="content-lead">${escapeHtml(scenario.short_description)}</p></header><div class="summary-grid"><div class="info-card"><h2>Architekturziel</h2><p>${escapeHtml(scenario.architecture_goal)}</p></div><div class="info-card"><h2>Enterprise-Beispiel</h2><p>${escapeHtml(scenario.enterprise_example)}</p></div><div class="info-card"><h2>Merksatz</h2><p>${escapeHtml(scenario.merksatz)}</p></div><div class="info-card"><h2>Komponenten</h2><p>${scenario.component_instances.length} Rollen · ${scenario.relationships.length} Szenariobeziehungen</p></div></div><section class="architecture-diagram"><h2>Architekturdiagramm</h2>${architectureDiagram(scenario)}</section><section class="content-section"><h2>Architekturperspektiven</h2><div class="accordion-list">${accordions}</div></section><section class="content-section"><h2>Lernpfad des Szenarios</h2><div class="link-grid">${scenario.learning_path.map(id=>`<button class="node-link" data-node-id="${escapeHtml(id)}">${escapeHtml(nodeTitle(id))}</button>`).join('')}</div></section>`;
    dom.scenarioContent.querySelector('[data-cross-mode-back]')?.addEventListener('click',restoreNavigationContext);
    dom.scenarioList.querySelectorAll('[data-scenario-id]').forEach(button=>button.addEventListener('click',()=>openScenario(button.dataset.scenarioId)));
    dom.scenarioContent.querySelectorAll('[data-node-id]').forEach(button=>{const open=()=>navigateToNode(button.dataset.nodeId);button.addEventListener('click',open);button.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();open()}})});
    dom.visible.textContent=`${ARCH.scenarios.length} Szenarien · ${scenario.component_instances.length} Komponenten im aktuellen Szenario`;
  }
  function pathProgress(path){const completed=path.steps.filter(step=>learningStepState(step.id).status==='completed').length;return{completed,total:path.steps.length,percent:Math.round(completed/path.steps.length*100),next:path.steps.find(step=>learningStepState(step.id).status!=='completed')||path.steps[path.steps.length-1]}}
  function learningEntityLabel(id,label){
    const title=presentationTitle(nodeById.get(id)),text=label||title;
    const normalize=value=>String(value||'').toLowerCase().replace(/[^\p{L}\p{N}]/gu,'');
    const same=normalize(text).includes(normalize(title));
    return `<span class="learning-link-label">${escapeHtml(text)}</span>${same?'':`<small class="learning-link-term">Fachbegriff: ${escapeHtml(title)}</small>`}`;
  }
  function azureEntityButton(id,label,cssClass=''){
    const node=nodeById.get(id),selected=state.azureSelection===id;
    return `<button type="button" class="${cssClass}${selected?' selected':''}" data-azure-entity="${escapeHtml(id)}" aria-pressed="${selected}" title="${escapeHtml(presentationTitle(node))} · Details öffnen">${learningEntityLabel(id,label)}</button>`;
  }
  function learningChapterSidebar(activeNumber){
    const activeIndex={1:state.cloudStepIndex,2:state.azureStepIndex,3:state.organizationStepIndex,4:state.accessStepIndex,5:state.governanceStepIndex,6:state.networkingStepIndex}[activeNumber];
    return learningChapters.map(chapter=>`<button type="button" class="network-flow-entry${chapter.number===activeNumber?' active':''}" data-chapter="${chapter.number}" ${chapter.number===activeNumber?'aria-current="page"':''}><b>Kapitel ${chapter.number} – ${escapeHtml(chapter.title)}</b><small>${chapter.flow.steps.length} Schritte · ${escapeHtml(chapter.status==='MANUAL BROWSER REVIEW REQUIRED'?'Browserprüfung offen':chapter.status)}</small></button>${chapter.number===activeNumber?`<div class="network-flow-steps">${chapter.flow.steps.map((step,index)=>`<button type="button" class="${index===activeIndex?'active':''}" data-chapter-step="${chapter.number}:${index}" ${index===activeIndex?'aria-current="step"':''}><span>${index+1}</span>${escapeHtml(step.title)}</button>`).join('')}</div>`:''}`).join('');
  }
  function bindLearningChapterSidebar(){
    const openChapter={1:openCloudStep,2:openAzureStep,3:openOrganizationStep,4:openAccessStep,5:openGovernanceStep,6:openNetworkingStep};
    dom.learningPathList.querySelectorAll('[data-chapter]').forEach(button=>button.addEventListener('click',()=>openChapter[button.dataset.chapter](0)));
    dom.learningPathList.querySelectorAll('[data-chapter-step]').forEach(button=>button.addEventListener('click',()=>{const [number,index]=button.dataset.chapterStep.split(':').map(Number);openChapter[number](index)}));
  }
  function azureScene(index){return window.ADB_DEMO_LEARNING_V34.render(2,index,azureEntityButton);}
  function openAzureStep(index){
    if(!AZURE_FLOW||!Number.isInteger(index)||index<0||index>=AZURE_FLOW.steps.length)return;
    if(state.selected)clearDetails();
    state.azurePrototype=true;state.cloudPrototype=false;state.networkingPrototype=false;state.organizationPrototype=false;state.accessPrototype=false;state.governancePrototype=false;state.legacyContext=false;state.azureStepIndex=index;state.azureSelection=null;state.crossModeOrigin=null;
    if(state.mode!=='learning')setMode('learning');else renderLearning();
  }
  function renderAzure(){
    const index=state.azureStepIndex,step=AZURE_FLOW.steps[index];
    dom.learningView.classList.remove('cloud-learning','network-learning','organization-learning');
    dom.learningView.querySelector('.content-sidebar h1').textContent='Azure verstehen';dom.learningView.querySelector('.content-sidebar>p').textContent='Kapitel 2 · Aus dem Cloud-Prinzip wird eine Plattform.';
    dom.learningView.classList.add('azure-learning');dom.learningPathList.innerHTML=learningChapterSidebar(2);bindLearningChapterSidebar();dom.learningContent.classList.add('network-flow-main');
    dom.learningContent.innerHTML=`<header class="network-flow-header"><div class="eyebrow">Azure verstehen · ${index+1} von ${AZURE_FLOW.steps.length}</div><h1>${escapeHtml(step.title)}</h1><p>${escapeHtml(step.question)}</p></header><div class="network-story"><p><b>Das Problem</b>${escapeHtml(step.problem)}</p><p><b>Warum es wichtig ist</b>${escapeHtml(step.why)}</p><p><b>Was hinzukommt</b>${escapeHtml(step.solution)}</p></div><div class="network-flow-stage">${azureScene(index)}</div><div class="network-flow-actions"><button type="button" data-azure-prev ${index===0?'disabled':''}>← Zurück</button><span class="step-count">Schritt ${index+1} / ${AZURE_FLOW.steps.length}</span><button type="button" data-azure-next ${index===AZURE_FLOW.steps.length-1?'disabled':''}>Weiter →</button><button type="button" class="mindmap-action" data-azure-mindmap ${state.azureSelection?'':'hidden'}>In Mindmap anzeigen</button></div>${index===0?'':'<p class="network-flow-note">Azure-Begriff anklicken: Die vorhandene Erklärung öffnet sich rechts.</p>'}`;
    dom.learningContent.querySelectorAll('[data-azure-entity]').forEach(button=>button.addEventListener('click',()=>{const id=button.dataset.azureEntity;if(!nodeById.has(id))return;state.azureSelection=id;selectNode(id,button);dom.learningContent.querySelectorAll('[data-azure-entity]').forEach(item=>{const active=item.dataset.azureEntity===id;item.classList.toggle('selected',active);item.setAttribute('aria-pressed',String(active))});dom.learningContent.querySelector('[data-azure-mindmap]').hidden=!primaryPresentationIds.has(id)}));
    dom.learningContent.querySelector('[data-azure-prev]').addEventListener('click',()=>openAzureStep(index-1));dom.learningContent.querySelector('[data-azure-next]').addEventListener('click',()=>openAzureStep(index+1));
    dom.learningContent.querySelector('[data-azure-mindmap]').addEventListener('click',()=>openKnowledgeMode('mindmap',state.azureSelection));
    dom.visible.textContent=`Azure verstehen · Schritt ${index+1} von ${AZURE_FLOW.steps.length}`;
    const hash=`#mode=learning&learningFlow=${encodeURIComponent(AZURE_FLOW.id)}&flowStep=${encodeURIComponent(step.id)}`;try{history.replaceState(null,'',hash)}catch{location.hash=hash}
  }
  function organizationEntityButton(id,label){
    const selected=state.organizationSelection===id;
    return `<button type="button" class="org-entity${selected?' selected':''}" data-organization-entity="${escapeHtml(id)}" aria-pressed="${selected}" title="${escapeHtml(presentationTitle(nodeById.get(id)))} · Details öffnen">${learningEntityLabel(id,label)}</button>`;
  }
  function organizationGroup(name,focus=false,test=false){
    return `<div class="org-box${focus?' org-current':' org-previous'}${test?' org-test':''}"><div class="org-heading">${organizationEntityButton('azure-0277',`Resource Group · ${name}`)}<small>logischer Container</small></div><div class="org-resources">${test?'<span>Unsere Anwendung · Test</span>':'<span>Unsere Anwendung</span><span>Daten für die Anwendung</span>'}</div></div>`;
  }
  function organizationSubscription(name,focus=false,test=false){
    return `<div class="org-box${focus?' org-current':' org-previous'}"><div class="org-heading">${organizationEntityButton('azure-1011',`Subscription · ${name}`)}<small>Verwaltungsbereich</small></div>${organizationGroup(test?'Testanwendung':'Unternehmensanwendung',false,test)}</div>`;
  }
  function organizationHierarchy(index){
    if(index===0)return organizationGroup('Unternehmensanwendung',true);
    if(index===1)return organizationSubscription('Produktion',true);
    return `<div class="org-box${index===2?' org-current':' org-previous'}"><div class="org-heading">${organizationEntityButton('azure-1022','Management Group · Unternehmen')}<small>fasst Subscriptions zusammen</small></div><div class="org-subscriptions">${organizationSubscription('Produktion')}${organizationSubscription('Test',false,true)}</div></div>`;
  }
  function organizationControls(index){
    if(index<3)return'';
    return `<div class="org-controls${index===3?' org-current':''}"><strong>Scope = Geltungsbereich wählen: Management Group, Subscription, Resource Group oder Ressource</strong><div class="org-control-row"><div>${organizationEntityButton('azure-0964','Azure Role-Based Access Control (RBAC)')}<small>Wer darf hier handeln?</small></div><div>${organizationEntityButton('azure-0962','Azure Policy')}<small>Welche Vorgaben gelten hier?</small></div></div><p class="org-note">Zuweisungen auf höherer Ebene können darunterliegende Bereiche erreichen. Die genaue Konfiguration folgt später.</p></div>`;
  }
  function organizationScene(index){
    const step=ORGANIZATION_FLOW.steps[index];
    const exampleNote=index===1?'Unser Beispiel: eigene Subscription für Produktion.':index===2?'Beispielentscheidung: Produktion und Test in getrennten Subscriptions.':'';
    return `<section class="org-scene${step.overview?' overview':''}" aria-label="Kumulatives Azure-Organisationsbild"><div class="org-scene-head"><b>Unser Unternehmen ordnet seine Azure-Anwendung</b><span>${escapeHtml(step.visualLabel)}</span></div><div class="org-bridge"><span>Aus Kapitel 2: <b>Microsoft Azure</b></span><i aria-hidden="true">→</i><span>Ressourcen für <b>unsere Anwendung</b></span></div><div class="org-hierarchy">${organizationHierarchy(index)}${exampleNote?`<p class="org-note">${exampleNote}</p>`:''}${organizationControls(index)}</div></section>${step.overview?'<p class="org-next-question"><b>Nächste Frage:</b> Wie greifen Menschen und Anwendungen sicher auf diese Umgebung zu?</p>':''}`;
  }
  function openOrganizationStep(index){
    if(!ORGANIZATION_FLOW||!Number.isInteger(index)||index<0||index>=ORGANIZATION_FLOW.steps.length)return;
    if(state.selected)clearDetails();
    state.organizationPrototype=true;state.azurePrototype=false;state.cloudPrototype=false;state.networkingPrototype=false;state.accessPrototype=false;state.governancePrototype=false;state.legacyContext=false;state.organizationStepIndex=index;state.organizationSelection=null;state.crossModeOrigin=null;
    if(state.mode!=='learning')setMode('learning');else renderLearning();
  }
  function renderOrganization(){
    const index=state.organizationStepIndex,step=ORGANIZATION_FLOW.steps[index];
    dom.learningView.classList.remove('cloud-learning','azure-learning','network-learning');dom.learningView.classList.add('organization-learning');
    dom.learningView.querySelector('.content-sidebar h1').textContent='Azure organisieren';dom.learningView.querySelector('.content-sidebar>p').textContent='Kapitel 3 · Von einzelnen Ressourcen zur gemeinsamen Struktur.';
    dom.learningPathList.innerHTML=learningChapterSidebar(3);bindLearningChapterSidebar();dom.learningContent.classList.add('network-flow-main');
    dom.learningContent.innerHTML=`<header class="network-flow-header"><div class="eyebrow">Azure organisieren · ${index+1} von ${ORGANIZATION_FLOW.steps.length}</div><h1>${escapeHtml(step.title)}</h1><p>${escapeHtml(step.question)}</p></header><div class="network-story"><p><b>Das Problem</b>${escapeHtml(step.problem)}</p><p><b>Warum es wichtig ist</b>${escapeHtml(step.why)}</p><p><b>Was hinzukommt</b>${escapeHtml(step.solution)}</p></div><div class="network-flow-stage">${organizationScene(index)}</div><div class="network-flow-actions"><button type="button" data-organization-prev ${index===0?'disabled':''}>← Zurück</button><span class="step-count">Schritt ${index+1} / ${ORGANIZATION_FLOW.steps.length}</span><button type="button" data-organization-next ${index===ORGANIZATION_FLOW.steps.length-1?'disabled':''}>Weiter →</button><button type="button" class="mindmap-action" data-organization-mindmap ${state.organizationSelection?'':'hidden'}>In Mindmap anzeigen</button></div><p class="network-flow-note">Azure-Begriff anklicken: Die vorhandene Erklärung öffnet sich rechts.</p>`;
    dom.learningContent.querySelectorAll('[data-organization-entity]').forEach(button=>button.addEventListener('click',()=>{const id=button.dataset.organizationEntity;if(!primaryPresentationIds.has(id))return;state.organizationSelection=id;selectNode(id,button);dom.learningContent.querySelectorAll('[data-organization-entity]').forEach(item=>{const active=item.dataset.organizationEntity===id;item.classList.toggle('selected',active);item.setAttribute('aria-pressed',String(active))});dom.learningContent.querySelector('[data-organization-mindmap]').hidden=false}));
    dom.learningContent.querySelector('[data-organization-prev]').addEventListener('click',()=>openOrganizationStep(index-1));dom.learningContent.querySelector('[data-organization-next]').addEventListener('click',()=>openOrganizationStep(index+1));
    dom.learningContent.querySelector('[data-organization-mindmap]').addEventListener('click',()=>openKnowledgeMode('mindmap',state.organizationSelection));
    dom.visible.textContent=`Azure organisieren · Schritt ${index+1} von ${ORGANIZATION_FLOW.steps.length}`;
    const hash=`#mode=learning&learningFlow=${encodeURIComponent(ORGANIZATION_FLOW.id)}&flowStep=${encodeURIComponent(step.id)}`;try{history.replaceState(null,'',hash)}catch{location.hash=hash}
  }
  function accessEntityButton(id,label){
    const selected=state.accessSelection===id;
    return `<button type="button" class="access-entity${selected?' selected':''}" data-access-entity="${escapeHtml(id)}" aria-pressed="${selected}" title="${escapeHtml(presentationTitle(nodeById.get(id)))} · Details öffnen">${learningEntityLabel(id,label)}</button>`;
  }
  function accessScene(index){return window.ADB_DEMO_LEARNING_V34.render(4,index,accessEntityButton);}
  function openAccessStep(index){
    if(!ACCESS_FLOW||!Number.isInteger(index)||index<0||index>=ACCESS_FLOW.steps.length)return;
    if(state.selected)clearDetails();
    state.accessPrototype=true;state.organizationPrototype=false;state.azurePrototype=false;state.cloudPrototype=false;state.networkingPrototype=false;state.governancePrototype=false;state.legacyContext=false;state.accessStepIndex=index;state.accessSelection=null;state.crossModeOrigin=null;
    if(state.mode!=='learning')setMode('learning');else renderLearning();
  }
  function renderAccess(){
    const index=state.accessStepIndex,step=ACCESS_FLOW.steps[index];
    dom.learningView.classList.remove('cloud-learning','azure-learning','organization-learning','network-learning');dom.learningView.classList.add('access-learning');
    dom.learningView.querySelector('.content-sidebar h1').textContent='Zugriff verstehen';dom.learningView.querySelector('.content-sidebar>p').textContent='Kapitel 4 · Wer greift zu, was darf die Identität und wo gilt es?';
    dom.learningPathList.innerHTML=learningChapterSidebar(4);bindLearningChapterSidebar();dom.learningContent.classList.add('network-flow-main');
    dom.learningContent.innerHTML=`<header class="network-flow-header"><div class="eyebrow">Zugriff verstehen · ${index+1} von ${ACCESS_FLOW.steps.length}</div><h1>${escapeHtml(step.title)}</h1><p>${escapeHtml(step.question)}</p></header><div class="network-story"><p><b>Das Problem</b>${escapeHtml(step.problem)}</p><p><b>Warum es wichtig ist</b>${escapeHtml(step.why)}</p><p><b>Was hinzukommt</b>${escapeHtml(step.solution)}</p></div><div class="network-flow-stage">${accessScene(index)}</div><div class="network-flow-actions"><button type="button" data-access-prev ${index===0?'disabled':''}>← Zurück</button><span class="step-count">Schritt ${index+1} / ${ACCESS_FLOW.steps.length}</span><button type="button" data-access-next ${index===ACCESS_FLOW.steps.length-1?'disabled':''}>Weiter →</button><button type="button" class="mindmap-action" data-access-mindmap ${state.accessSelection&&primaryPresentationIds.has(state.accessSelection)?'':'hidden'}>In Mindmap anzeigen</button></div>${index===0?'':'<p class="network-flow-note">Azure-Begriff anklicken: Die vorhandene Erklärung öffnet sich rechts.</p>'}`;
    dom.learningContent.querySelectorAll('[data-access-entity]').forEach(button=>button.addEventListener('click',()=>{const id=button.dataset.accessEntity;if(!nodeById.has(id))return;state.accessSelection=id;selectNode(id,button);dom.learningContent.querySelectorAll('[data-access-entity]').forEach(item=>{const active=item.dataset.accessEntity===id;item.classList.toggle('selected',active);item.setAttribute('aria-pressed',String(active))});dom.learningContent.querySelector('[data-access-mindmap]').hidden=!primaryPresentationIds.has(id)}));
    dom.learningContent.querySelector('[data-access-prev]').addEventListener('click',()=>openAccessStep(index-1));dom.learningContent.querySelector('[data-access-next]').addEventListener('click',()=>openAccessStep(index+1));
    dom.learningContent.querySelector('[data-access-mindmap]').addEventListener('click',()=>openKnowledgeMode('mindmap',state.accessSelection));
    dom.visible.textContent=`Zugriff verstehen · Schritt ${index+1} von ${ACCESS_FLOW.steps.length}`;
    const hash=`#mode=learning&learningFlow=${encodeURIComponent(ACCESS_FLOW.id)}&flowStep=${encodeURIComponent(step.id)}`;try{history.replaceState(null,'',hash)}catch{location.hash=hash}
  }
  function governanceEntityButton(id,label){
    const selected=state.governanceSelection===id;
    return `<button type="button" class="governance-entity${selected?' selected':''}" data-governance-entity="${escapeHtml(id)}" aria-pressed="${selected}" title="${escapeHtml(presentationTitle(nodeById.get(id)))} · Details öffnen">${learningEntityLabel(id,label)}</button>`;
  }
  function governanceScene(index){
    const step=GOVERNANCE_FLOW.steps[index],overview=Boolean(step.overview);
    const focus=introduced=>!overview&&index===introduced?' current':index>introduced?' previous':'';
    const policy=index>=1?`<div class="governance-control${index<3?' wide':''}${focus(1)}"><small>Vorgaben</small><div class="governance-policy-flow"><span>Unternehmensvorgabe</span><i aria-hidden="true">→</i>${governanceEntityButton('azure-0962','Azure Policy')}<i aria-hidden="true">→</i><span>Ressource bewerten</span></div><div class="governance-rule"><b>Beispiel: erlaubte Azure-Regionen</b><span>je nach Policy-Wirkung melden, blockieren oder korrigieren</span></div></div>`:'';
    const hierarchy=index>=2?`<div class="governance-scope${focus(2)}"><div class="governance-scope-title"><small>Policy-Zuweisung</small><b>Wo gilt die Regionsvorgabe?</b></div><div class="governance-definition"><span>Definition: Bedingung + Wirkung</span><span aria-hidden="true">→</span><span>Assignment: Definition + Scope</span></div><div class="governance-hierarchy">${governanceEntityButton('azure-1022','Management Group')}<i aria-hidden="true">›</i>${governanceEntityButton('azure-1011','Subscription · Produktion')}<i aria-hidden="true">›</i>${governanceEntityButton('azure-0277','Resource Group · Anwendung')}<i aria-hidden="true">›</i><span>Ressource</span></div><p>Unser Beispiel: Assignment an der Produktions-Subscription. Die darunterliegenden Bereiche sind grundsätzlich einbezogen.</p></div>`:'';
    const tags=index>=3?`<div class="governance-control${focus(3)}"><small>Kennzeichnung</small>${governanceEntityButton('azure-0980','Azure Resource Tags')}<span>Schlüssel-Wert-Metadaten der Ressource</span><div class="governance-tags"><b>Environment</b><span>Production</span><b>CostCenter</b><span>4711</span></div><p>Für Zuordnung und Kostenanalyse · keine Sicherheitsgrenze</p></div>`:'';
    const locks=index>=4?`<div class="governance-control${focus(4)}"><small>Zusätzlicher Schutz</small>${governanceEntityButton('azure-0970','Azure Resource Locks')}<span>Wichtige Ressource vor Versehen schützen</span><div class="governance-locks"><span><b>CanNotDelete</b> Löschen der geschützten Ressource verhindern</span><span><b>ReadOnly</b> Änderungen über die Azure-Verwaltungsebene verhindern</span></div><p>Wirkt zusätzlich zu RBAC und Policy.</p></div>`:'';
    const costRecap=window.ADB_DEMO_LEARNING_V34.render(5,index,governanceEntityButton);
    return (overview?'':costRecap)+`<section class="governance-scene${overview?' overview':''}" aria-label="Kumulatives Governance-Bild für die Unternehmensanwendung"><div class="governance-scene-head"><b>Unsere Unternehmensanwendung · Produktion</b><span>${escapeHtml(step.visualLabel)}</span></div><div class="governance-access${focus(0)}"><div><small>Aus Kapitel 4</small><b>Identität → Authentifizierung</b>${governanceEntityButton('azure-0964','Azure RBAC')}<span>Rolle + Scope erlauben das Bereitstellen</span></div><span class="governance-access-arrow" aria-hidden="true">→</span><div><small>Unsere Resource Group</small><b>Ressource der Anwendung</b><span>berechtigt erstellt ≠ jede Konfiguration passt</span></div></div>${index===0?'<div class="governance-need current"><b>Neue Frage</b><span>Welche Unternehmensvorgaben sollen bei der Bereitstellung gelten?</span></div>':''}<div class="governance-controls">${policy}${hierarchy}${tags}${locks}</div>${overview?`<div class="governance-synthesis"><b>${'Governance im Zusammenspiel'}</b><span>Organisation</span><span>Zugriff</span><span>Vorgaben</span><span>Kennzeichnung</span><span>Schutz</span><span>Kostenkontrolle</span></div>`:''}</section>${overview?`<details class="demo-more"><summary>Optionaler Rückblick: Kosten zuordnen und kontrollieren</summary>${costRecap}</details>`:''}${overview?'<p class="governance-next-question"><b>Nächste Frage:</b> Wie kommunizieren unsere Ressourcen sicher miteinander und mit anderen Netzen? <span>Kapitel 6 · Networking verstehen</span></p>':''}`;
  }
  function openGovernanceStep(index){
    if(!GOVERNANCE_FLOW||!Number.isInteger(index)||index<0||index>=GOVERNANCE_FLOW.steps.length)return;
    if(state.selected)clearDetails();
    state.governancePrototype=true;state.accessPrototype=false;state.organizationPrototype=false;state.azurePrototype=false;state.cloudPrototype=false;state.networkingPrototype=false;state.legacyContext=false;state.governanceStepIndex=index;state.governanceSelection=null;state.crossModeOrigin=null;
    if(state.mode!=='learning')setMode('learning');else renderLearning();
  }
  function renderGovernance(){
    const index=state.governanceStepIndex,step=GOVERNANCE_FLOW.steps[index];
    dom.learningView.classList.remove('cloud-learning','azure-learning','organization-learning','access-learning','network-learning');dom.learningView.classList.add('governance-learning');
    dom.learningView.querySelector('.content-sidebar h1').textContent='Azure steuern und schützen';dom.learningView.querySelector('.content-sidebar>p').textContent='Kapitel 5 · Berechtigung, Vorgaben, Kennzeichnung und Schutz.';
    dom.learningPathList.innerHTML=learningChapterSidebar(5);bindLearningChapterSidebar();dom.learningContent.classList.add('network-flow-main');
    dom.learningContent.innerHTML=`<header class="network-flow-header"><div class="eyebrow">Azure steuern und schützen · ${index+1} von ${GOVERNANCE_FLOW.steps.length}</div><h1>${escapeHtml(step.title)}</h1><p>${escapeHtml(step.question)}</p></header><div class="network-story"><p><b>Das Problem</b>${escapeHtml(step.problem)}</p><p><b>Warum es wichtig ist</b>${escapeHtml(step.why)}</p><p><b>Was hinzukommt</b>${escapeHtml(step.solution)}</p></div><div class="network-flow-stage${step.overview?' governance-overview':''}">${governanceScene(index)}</div><div class="network-flow-actions"><button type="button" data-governance-prev ${index===0?'disabled':''}>← Zurück</button><span class="step-count">Schritt ${index+1} / ${GOVERNANCE_FLOW.steps.length}</span><button type="button" data-governance-next ${index===GOVERNANCE_FLOW.steps.length-1?'disabled':''}>Weiter →</button><button type="button" class="mindmap-action" data-governance-mindmap ${state.governanceSelection&&primaryPresentationIds.has(state.governanceSelection)?'':'hidden'}>In Mindmap anzeigen</button></div><p class="network-flow-note">Azure-Begriff anklicken: Die vorhandene Erklärung öffnet sich rechts.</p>`;
    dom.learningContent.querySelectorAll('[data-governance-entity]').forEach(button=>button.addEventListener('click',()=>{const id=button.dataset.governanceEntity;if(!nodeById.has(id))return;state.governanceSelection=id;selectNode(id,button);dom.learningContent.querySelectorAll('[data-governance-entity]').forEach(item=>{const active=item.dataset.governanceEntity===id;item.classList.toggle('selected',active);item.setAttribute('aria-pressed',String(active))});dom.learningContent.querySelector('[data-governance-mindmap]').hidden=!primaryPresentationIds.has(id)}));
    dom.learningContent.querySelector('[data-governance-prev]').addEventListener('click',()=>openGovernanceStep(index-1));dom.learningContent.querySelector('[data-governance-next]').addEventListener('click',()=>openGovernanceStep(index+1));
    dom.learningContent.querySelector('[data-governance-mindmap]').addEventListener('click',()=>openKnowledgeMode('mindmap',state.governanceSelection));
    dom.visible.textContent=`Azure steuern und schützen · Schritt ${index+1} von ${GOVERNANCE_FLOW.steps.length}`;
    const hash=`#mode=learning&learningFlow=${encodeURIComponent(GOVERNANCE_FLOW.id)}&flowStep=${encodeURIComponent(step.id)}`;try{history.replaceState(null,'',hash)}catch{location.hash=hash}
  }
  function cloudEntityButton(id,label,cssClass=''){
    const node=nodeById.get(id),selected=state.cloudSelection===id;
    return `<button type="button" class="${cssClass}${selected?' selected':''}" data-cloud-entity="${escapeHtml(id)}" aria-pressed="${selected}" title="${escapeHtml(presentationTitle(node))} · Details öffnen">${learningEntityLabel(id,label)}</button>`;
  }
  function cloudDemandScene(index){
    if(index>2)return'';
    const need=index===0?[20,35,48,60,52,33,23]:[20,35,48,92,74,39,23];
    const capacity=index===2?[27,40,54,96,78,44,28]:[64,64,64,64,64,64,64];
    const bars=(values,tone)=>`<div class="cloud-load-bars">${values.map((value,position)=>`<i class="${tone}${index===1&&position===3?' peak':''}" style="height:${value}%"></i>`).join('')}</div>`;
    return `<div class="cloud-demand-story step-${index+1}" aria-label="Bedarf und verfügbare Kapazität im Vergleich"><div class="cloud-demand-row"><b>Bedarf</b>${bars(need,'need')}<span>schwankt</span></div><div class="cloud-demand-row"><b>${index===2?'Cloud-Kapazität':'Eigene Server'}</b>${bars(capacity,index===2?'adjustable':'fixed')}<span>${index===2?'anpassbar':'fest bereitgestellt'}</span></div>${index===1?'<p class="cloud-demand-consequence"><b>Bei der Spitze reicht die eigene Kapazität nicht.</b> Bisher: weitere Server beschaffen → bereitstellen → betreiben.</p>':index===2?'<p class="cloud-demand-consequence"><b>Kapazität kann dem Bedarf folgen.</b> Nutzung und Verbrauch werden relevant.</p>':''}</div>`;
  }
  function cloudBaseScene(index){
    const step=CLOUD_FLOW.steps[index],overview=Boolean(step.overview),cloudVisible=index>=1,capacityVisible=index>=2;
    return `<section class="cloud-system${overview?' overview':''}" aria-label="Durchgehendes Beispiel: Unternehmensanwendung und Cloud"><div class="cloud-system-head"><b>Unsere Beispielanwendung</b><span>${escapeHtml(step.visualLabel)}</span></div>${cloudDemandScene(index)}<div class="cloud-system-grid"><div class="cloud-app cloud-card"><small>Unternehmen</small><b>Unsere Anwendung</b><span>Nutzung schwankt</span>${index>2?'<div class="cloud-demand" aria-label="Schwankender Bedarf"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>':''}</div><div class="cloud-link ${index===0?'owned':'cloud'}" aria-hidden="true"><span>→</span><small>${index===0?'selbst bereitstellen':'Ressourcen beziehen'}</small></div><div class="cloud-infrastructure"><div class="cloud-card cloud-owned${index===0?' focused':''}"><small>Bisher</small><b>Eigene Server</b><span>Feste Kapazität · selbst betreiben</span></div>${cloudVisible?`<div class="cloud-card cloud-provider${index===1?' focused':''}"><small>${index===1?'Neu: ':'Cloud Computing'}</small>${cloudEntityButton('azure-1101','IT-Ressourcen bei Bedarf','cloud-core-entity')}<span>über ein Netz verfügbar</span></div>`:''}</div></div>${capacityVisible?`<div class="cloud-capacity${index===2?' focused':''}"><div class="cloud-capacity-label"><b>Bedarf</b><span>wenig → viel → wenig</span></div>${index!==2?'<div class="cloud-capacity-line" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>':''}<div class="cloud-capacity-label"><b>Cloud-Kapazität</b><span>kann angepasst werden</span></div>${cloudEntityButton('azure-0137','Nutzung und Kosten verstehen','cloud-capacity-entity')}</div>`:''}</section>`;
  }
  function cloudDeployment(index){
    if(index<3)return'';
    return `<section class="cloud-decision${index===3?' focused':''}" aria-label="Cloud-Bereitstellungsmodelle"><div class="cloud-section-title"><span>1. Entscheidung: Wo und durch wen?</span>${cloudEntityButton('azure-0151','Deployment Models','cloud-section-entity')}</div><div class="cloud-deployment-options">${CLOUD_FLOW.deployment.map(model=>`<div class="cloud-model"><div class="cloud-model-picture" aria-hidden="true">${escapeHtml(model.picture)}</div>${cloudEntityButton(model.id,model.name,'cloud-model-entity')}<small>${escapeHtml(model.note)}</small></div>`).join('')}</div></section>`;
  }
  function cloudServiceModels(index){
    if(index<4)return'';
    return `<section class="cloud-decision cloud-service${index===4?' focused':''}${index===5?' responsibility-step':''}" aria-label="Cloud-Servicemodelle und Aufgabenverteilung"><div class="cloud-section-title"><span>2. Entscheidung: Wer betreibt welche Schicht?</span>${cloudEntityButton('azure-0197','Service Models','cloud-section-entity')}</div><p class="cloud-service-intro">Gleiche Aufgabe, andere Betriebsform: Bei SaaS nutzen wir eine fertige Anwendung.</p><div class="cloud-service-grid"><div class="cloud-service-labels"><b>Gleiche Schichten</b>${CLOUD_FLOW.serviceLayers.map(layer=>`<span>${escapeHtml(layer)}</span>`).join('')}</div>${CLOUD_FLOW.serviceModels.map(model=>`<div class="cloud-service-column">${cloudEntityButton(model.id,model.short,'cloud-service-heading')}<small>${escapeHtml(model.title)}</small>${model.responsibility.map((owner,row)=>`<div class="cloud-owner ${owner==='Kunde'?'customer':'provider'}${index===5&&row===3?' responsibility-focus':''}"><b>${escapeHtml(owner)}</b><span class="cloud-mobile-layer">${escapeHtml(CLOUD_FLOW.serviceLayers[row])}</span></div>`).join('')}</div>`).join('')}</div><p class="cloud-model-footnote">Vereinfachtes Modell: Genaue Aufgaben hängen vom Dienst ab.</p></section>`;
  }
  function cloudResponsibility(index){
    if(index<5)return'';
    return `<section class="cloud-responsibility${index===5?' focused':''}"><div><small>Übergreifendes Prinzip</small>${cloudEntityButton('azure-0229','Shared Responsibility Model','cloud-responsibility-entity')}</div><p>Anbieter und Kunde teilen Aufgaben. Eigene Daten und Zugriffe bleiben auch bei SaaS unsere Verantwortung.</p></section>`;
  }
  function cloudScene(index){
    return `${cloudBaseScene(index)}${window.ADB_DEMO_LEARNING_V34.render(1,index,cloudEntityButton)}${cloudDeployment(index)}${cloudServiceModels(index)}${cloudResponsibility(index)}${index===6?'<p class="cloud-azure-bridge"><span>Allgemeines Prinzip <b>Cloud Computing</b></span><i aria-hidden="true">→</i><span>Konkrete Plattform <b>Microsoft Azure</b></span><i aria-hidden="true">→</i><span>Als Nächstes: <b>Azure verstehen</b></span></p>':''}`;
  }
  function openCloudStep(index){
    if(!CLOUD_FLOW||!Number.isInteger(index)||index<0||index>=CLOUD_FLOW.steps.length)return;
    if(state.selected)clearDetails();
    state.cloudPrototype=true;state.azurePrototype=false;state.networkingPrototype=false;state.organizationPrototype=false;state.accessPrototype=false;state.governancePrototype=false;state.legacyContext=false;state.cloudStepIndex=index;state.cloudSelection=null;state.crossModeOrigin=null;
    if(state.mode!=='learning')setMode('learning');else renderLearning();
  }
  function renderCloud(){
    const index=state.cloudStepIndex,step=CLOUD_FLOW.steps[index];
    dom.learningView.classList.remove('network-learning','azure-learning','organization-learning');
    dom.learningView.querySelector('.content-sidebar h1').textContent='Cloud verstehen';dom.learningView.querySelector('.content-sidebar>p').textContent='Kapitel 1 · Vom eigenen Server zur Cloud.';
    dom.learningView.classList.add('cloud-learning');dom.learningPathList.innerHTML=learningChapterSidebar(1);bindLearningChapterSidebar();dom.learningContent.classList.add('network-flow-main');
    dom.learningContent.innerHTML=`<header class="network-flow-header"><div class="eyebrow">Cloud verstehen · ${index+1} von ${CLOUD_FLOW.steps.length}</div><h1>${escapeHtml(step.title)}</h1><p>${escapeHtml(step.question)}</p></header><div class="network-story"><p><b>Das Problem</b>${escapeHtml(step.problem)}</p><p><b>Warum es wichtig ist</b>${escapeHtml(step.why)}</p><p><b>Was hinzukommt</b>${escapeHtml(step.solution)}</p></div><div class="network-flow-stage">${cloudScene(index)}</div><div class="network-flow-actions"><button type="button" data-cloud-prev ${index===0?'disabled':''}>← Zurück</button><span class="step-count">Schritt ${index+1} / ${CLOUD_FLOW.steps.length}</span><button type="button" data-cloud-next ${index===CLOUD_FLOW.steps.length-1?'disabled':''}>Weiter →</button><button type="button" class="mindmap-action" data-cloud-mindmap ${state.cloudSelection?'':'hidden'}>In Mindmap anzeigen</button></div><p class="network-flow-note">Azure-Begriff anklicken: Die vorhandene Erklärung öffnet sich rechts.</p>`;
    dom.learningContent.querySelectorAll('[data-cloud-entity]').forEach(button=>button.addEventListener('click',()=>{const id=button.dataset.cloudEntity;if(!nodeById.has(id))return;state.cloudSelection=id;selectNode(id,button);dom.learningContent.querySelectorAll('[data-cloud-entity]').forEach(item=>{const active=item.dataset.cloudEntity===id;item.classList.toggle('selected',active);item.setAttribute('aria-pressed',String(active))});dom.learningContent.querySelector('[data-cloud-mindmap]').hidden=!primaryPresentationIds.has(id)}));
    dom.learningContent.querySelector('[data-cloud-prev]').addEventListener('click',()=>openCloudStep(index-1));dom.learningContent.querySelector('[data-cloud-next]').addEventListener('click',()=>openCloudStep(index+1));
    dom.learningContent.querySelector('[data-cloud-mindmap]').addEventListener('click',()=>openKnowledgeMode('mindmap',state.cloudSelection));
    dom.visible.textContent=`Cloud verstehen · Schritt ${index+1} von ${CLOUD_FLOW.steps.length}`;
    const hash=`#mode=learning&learningFlow=${encodeURIComponent(CLOUD_FLOW.id)}&flowStep=${encodeURIComponent(step.id)}`;try{history.replaceState(null,'',hash)}catch{location.hash=hash}
  }
  function networkingEntityButton(id,label,cssClass=''){
    const node=nodeById.get(id),selected=state.networkingSelection===id;
    return `<button type="button" class="${cssClass}${selected?' selected':''}" data-network-entity="${escapeHtml(id)}" aria-pressed="${selected}" title="${escapeHtml(presentationTitle(node))} · Details öffnen">${learningEntityLabel(id,label)}</button>`;
  }
  function networkingOverviewMap(){
    // Step 9 presentation coordinates only. Reuse the existing concepts and edge keys.
    const positions={
      'vnet':[270,165,520,505],'subnet-app':[290,325,225,300],'subnet-other':[540,325,225,170],
      'app':[310,355,185,45],'other-workload':[560,355,185,45],
      'nsg':[310,465,185,42],'udr':[310,512,185,42],'nat':[310,559,185,42],
      'dns':[825,85,160,55],'sql':[825,420,160,60],'private-endpoint':[560,420,185,47],
      'private-dns':[825,240,160,55],'vnet-2':[20,230,160,70],'peering':[184,235,82,24],
      'onprem':[20,565,160,70],'vpn':[585,575,150,45],
      'users':[450,24,160,50],'app-gateway':[450,225,160,44]
    };
    const paths={
      'app-other':[[495,377],[560,377]],
      'app-dns':[[480,355],[480,305],[795,305],[795,115],[825,115]],
      'app-private':[[495,389],[525,389],[525,444],[560,444]],
      'private-sql':[[745,444],[825,444]],
      'private-dns-private':[[825,268],[770,268],[770,408],[652,408],[652,420]],
      'vnet2-peering':[[180,265],[225,265]],'peering-vnet':[[225,265],[270,265]],
      'onprem-vpn':[[180,600],[235,600],[235,648],[660,648],[660,620]],
      'vpn-vnet':[[735,597],[777,597],[777,520],[740,520]],
      'users-gateway':[[530,74],[645,74],[645,247],[610,247]],'gateway-app':[[450,247],[280,247],[280,377],[310,377]]
    };
    const subtext={'nsg':'prüft Verbindungen','udr':'bestimmt den Weg','nat':'optional · ausgehend',
      'dns':'öffentliche Namen','private-dns':'Name → private Adresse','private-endpoint':'private IP im VNet'};
    const controls=new Set(['nsg','udr','nat']);
    const style=([x,y,w,h])=>`left:${x/10}%;top:${y/7}%;width:${w/10}%;height:${h/7}%`;
    const nodes=NETWORK_FLOW.visual_nodes.map(node=>{
      const role=node.key==='vnet-2'?'frame':node.key==='peering'?'connection':controls.has(node.key)?'control':node.role;
      const className=`network-map-node ${role}`,label=node.key==='app-gateway'?'Application Gateway':node.short;
      const body=`<span>${escapeHtml(label)}</span>${subtext[node.key]?`<small>${escapeHtml(subtext[node.key])}</small>`:''}`;
      const common=`class="${className}" style="${style(positions[node.key])}" data-overview-node="${node.key}"`;
      return node.id?`<button type="button" ${common} data-network-entity="${escapeHtml(node.id)}" aria-pressed="${state.networkingSelection===node.id}" title="${escapeHtml(presentationTitle(nodeById.get(node.id)))} · Details öffnen">${body}</button>`:`<div ${common}>${body}</div>`;
    }).join('');
    const frame=(key,label,box)=>`<div class="network-map-node subnet" data-overview-node="${key}" style="${style(box)}">${label}</div>`;
    const edges=NETWORK_FLOW.visual_edges.map(edge=>`<polyline data-overview-edge="${edge.key}" class="network-map-edge ${edge.purpose==='resolution'?'resolution':'traffic'}" points="${paths[edge.key].map(p=>p.join(',')).join(' ')}" ${edge.key==='vnet2-peering'?'':'marker-end="url(#network-overview-arrow)"'}/>`).join('');
    return `<div class="network-map-heading overview"><b>Unsere vernetzte Beispielumgebung</b></div><div class="network-system-viewport"><div class="network-system-map grammar-overview" aria-label="Datenverkehr, Namensauflösung und Netzwerkgrenzen der Beispielumgebung"><svg viewBox="0 0 1000 700" aria-hidden="true"><defs><marker id="network-overview-arrow" markerUnits="userSpaceOnUse" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8"/></marker></defs>${edges}</svg>${nodes}${frame('gateway-subnet','Eigenes Subnet',[425,190,210,95])}${frame('vpn-subnet','GatewaySubnet',[565,535,190,110])}<span class="overview-vpn-caption" style="left:66.5%;top:${500/7}%;width:9%">ins VNet</span><span class="overview-control-caption" style="left:31%;top:${426/7}%;width:18.5%">Dem Subnet zugeordnet</span></div></div><div class="network-overview-legend" aria-label="So liest du das Bild"><span><svg viewBox="0 0 38 12" aria-hidden="true"><path d="M1 6 H33 M28 2 L33 6 L28 10"/></svg>Datenverkehr</span><span><svg viewBox="0 0 38 12" aria-hidden="true"><path class="resolution" d="M1 6 H28"/><path d="M28 2 L33 6 L28 10"/></svg>Namensauflösung</span><span><i aria-hidden="true"></i>Bereichsrahmen: VNet / Subnet</span></div><p class="network-overview-note">NSG, Route Table und NAT sind dem Subnet zugeordnete Funktionen – keine Stationen einer Pfeilkette. DNS löst Namen auf; die Daten nehmen ihren eigenen Weg.</p>`;
  }
  function networkingMap(step,index){
    if(step.overview)return networkingOverviewMap();
    const number=index+1,known=new Map(NETWORK_FLOW.visual_nodes.map(node=>[node.key,node])),relations=new Set(BRAIN.model.relations.map(relation=>[relation.source,relation.target].sort().join('|')));
    const edges=NETWORK_FLOW.visual_edges.filter(edge=>edge.fromStep<=number).map(edge=>{
      const left=known.get(edge.from),right=known.get(edge.to),pair=left?.id&&right?.id?[left.id,right.id].sort().join('|'):null;
      const semantic=edge.kind==='semantic'&&relations.has(pair);if(edge.kind==='semantic'&&!semantic)console.warn('Networking-Lernbild: semantische Relation fehlt',edge.from,edge.to);
      const emphasis=step.overview?' overview':step.focusEdges?.includes(edge.key)?' focused':' previous';
      return `<polyline class="network-map-edge ${semantic?'semantic':'didactic'}${edge.purpose==='resolution'?' resolution':''}${emphasis}" points="${edge.points.map(point=>point.join(',')).join(' ')}" marker-end="url(#network-learning-arrow)"/>`;
    }).join('');
    const nodes=NETWORK_FLOW.visual_nodes.filter(node=>node.from<=number).map(node=>{
      const focused=step.overview||step.focus.includes(node.key),style=`left:${node.x/10}%;top:${node.y/5.3}%;width:${node.w/10}%;height:${node.h/5.3}%`,className=`network-map-node ${node.role}${focused?' focused':' previous'}${node.from===number?' new':''}`;
      const label=index===0&&node.key==='vnet'?'VNet · Netzwerkraum':node.short;
      return node.id?`<button type="button" class="${className}${state.networkingSelection===node.id?' selected':''}" style="${style}" data-network-entity="${escapeHtml(node.id)}" aria-pressed="${state.networkingSelection===node.id}" title="${escapeHtml(presentationTitle(nodeById.get(node.id)))} · Details öffnen">${escapeHtml(label)}</button>`:`<div class="${className}" style="${style}">${escapeHtml(label)}</div>`;
    }).join('');
    const hints=(step.hints||[]).map(hint=>`<span class="network-map-hint ${escapeHtml(hint.tone||'focus')}" style="left:${hint.x/10}%;top:${hint.y/5.3}%;width:${hint.w/10}%">${escapeHtml(hint.text)}</span>`).join('');
    const start=index===0?'<div class="network-build-sequence" aria-label="Vom Bedarf zum Netzwerkaufbau"><span><b>1</b> Anwendung ↔ Ressource</span><i aria-hidden="true">→</i><span><b>2</b> VNet: Netzwerkraum</span><i aria-hidden="true">→</i><span><b>3</b> Subnets: Bereiche</span></div>':'';
    return `<div class="network-map-heading${step.overview?' overview':''}"><b>Unsere Beispielumgebung</b><span class="network-map-focus">${escapeHtml(step.mapFocus)}</span></div>${start}<div class="network-system-viewport"><div class="network-system-map${step.overview?' overview':step.showContext?' context-step':' focus-step'}"><svg viewBox="0 0 1000 530" aria-hidden="true"><defs><marker id="network-learning-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0 L7 3.5 L0 7"/></marker></defs>${edges}</svg>${nodes}${hints}</div></div>`;
  }
  function networkingScene(step,index){
    const map=networkingMap(step,index)+(index>=2&&!step.overview?'<p class="demo-note">Gepunktete DNS-Verbindungen beschreiben die Namensauflösung (Name → Adresse). Der Datenverkehr läuft anschließend getrennt zum Ziel.</p>':''),content=window.ADB_DEMO_LEARNING_V34.render(6,index,networkingEntityButton);
    return index<6||step.overview?map+content:`<details class="demo-more"><summary>Bereits aufgebaut: unsere vernetzte Beispielumgebung</summary>${map}</details>${content}`;
  }
  function openNetworkingStep(index){
    if(!NETWORK_FLOW||!Number.isInteger(index)||index<0||index>=NETWORK_FLOW.steps.length)return;
    if(state.selected)clearDetails();
    state.networkingPrototype=true;state.cloudPrototype=false;state.azurePrototype=false;state.organizationPrototype=false;state.accessPrototype=false;state.governancePrototype=false;state.legacyContext=false;state.networkingStepIndex=index;state.networkingSelection=null;state.crossModeOrigin=null;
    if(state.mode!=='learning')setMode('learning');else renderLearning();
  }
  function renderNetworking(){
    const step=NETWORK_FLOW.steps[state.networkingStepIndex],index=state.networkingStepIndex;
    dom.learningView.classList.remove('cloud-learning','azure-learning','organization-learning');
    dom.learningView.querySelector('.content-sidebar h1').textContent='Networking verstehen';dom.learningView.querySelector('.content-sidebar>p').textContent='Ein Netzwerk als zusammenhängendes System verstehen.';
    dom.learningView.classList.add('network-learning');dom.learningPathList.innerHTML=learningChapterSidebar(6);bindLearningChapterSidebar();
    dom.learningContent.classList.add('network-flow-main');
    dom.learningContent.innerHTML=`<header class="network-flow-header"><div class="eyebrow">Networking verstehen · ${index+1} von ${NETWORK_FLOW.steps.length}</div><h1>${escapeHtml(step.title)}</h1><p>${escapeHtml(step.question)}</p></header><div class="network-story"><p><b>Das Problem</b>${escapeHtml(step.problem)}</p><p><b>Warum es wichtig ist</b>${escapeHtml(step.why)}</p><p><b>Was hinzukommt</b>${escapeHtml(step.solution)}</p></div><div class="network-flow-stage">${networkingScene(step,index)}</div><div class="network-flow-actions"><button type="button" data-network-prev ${index===0?'disabled':''}>← Zurück</button><span class="step-count">Schritt ${index+1} / ${NETWORK_FLOW.steps.length}</span><button type="button" data-network-next ${index===NETWORK_FLOW.steps.length-1?'disabled':''}>Weiter →</button><button type="button" class="mindmap-action" data-network-mindmap ${state.networkingSelection?'':'hidden'}>In Mindmap anzeigen</button></div><p class="network-flow-note">Azure-Begriff anklicken: Die vorhandene Erklärung öffnet sich rechts.</p>`;
    dom.learningContent.querySelectorAll('[data-network-entity]').forEach(button=>button.addEventListener('click',()=>{const id=button.dataset.networkEntity;if(!nodeById.has(id))return;state.networkingSelection=id;selectNode(id,button);dom.learningContent.querySelectorAll('[data-network-entity]').forEach(item=>{const active=item.dataset.networkEntity===id;item.classList.toggle('selected',active);item.setAttribute('aria-pressed',String(active))});dom.learningContent.querySelector('[data-network-mindmap]').hidden=!primaryPresentationIds.has(id)}));
    dom.learningContent.querySelector('[data-network-prev]').addEventListener('click',()=>openNetworkingStep(index-1));dom.learningContent.querySelector('[data-network-next]').addEventListener('click',()=>openNetworkingStep(index+1));dom.learningContent.querySelector('[data-network-mindmap]').addEventListener('click',()=>openKnowledgeMode('mindmap',state.networkingSelection));
    dom.visible.textContent=`Networking verstehen · Schritt ${index+1} von ${NETWORK_FLOW.steps.length}`;
    const hash=`#mode=learning&learningFlow=${encodeURIComponent(NETWORK_FLOW.id)}&flowStep=${encodeURIComponent(step.id)}`;try{history.replaceState(null,'',hash)}catch{location.hash=hash}
  }
  function renderLearning(){
    dom.learningView.classList.toggle('governance-learning',Boolean(state.governancePrototype));
    if(state.governancePrototype&&GOVERNANCE_FLOW)return renderGovernance();
    if(state.accessPrototype&&ACCESS_FLOW)return renderAccess();
    if(state.organizationPrototype&&ORGANIZATION_FLOW)return renderOrganization();
    if(state.azurePrototype&&AZURE_FLOW)return renderAzure();
    if(state.cloudPrototype&&CLOUD_FLOW)return renderCloud();
    if(state.networkingPrototype&&NETWORK_FLOW)return renderNetworking();
    if(!state.legacyContext&&CLOUD_FLOW){state.cloudPrototype=true;return renderCloud()}
    dom.learningView.querySelector('.content-sidebar h1').textContent='Lernkontext';dom.learningView.querySelector('.content-sidebar>p').textContent='Direkt geöffneter Lernschritt aus Brain oder Mindmap.';
    dom.learningView.classList.remove('network-learning','cloud-learning','azure-learning','organization-learning','access-learning');dom.learningContent.classList.remove('network-flow-main');
    const path=learningPathById.get(state.learningPathId)||LEARNING.learning_paths[0];state.learningPathId=path.id;let step=learningStepById.get(state.learningStepId);if(!step||step.path_id!==path.id){step=pathProgress(path).next;state.learningStepId=step.id}
    const currentState=learningStepState(step.id);currentState.last_opened_at=new Date().toISOString();saveLearningStepState(step.id,currentState);
    dom.learningPathList.innerHTML=learningChapterSidebar(null)+`<div class="legacy-context-label"><small>Direkt geöffneter Lernschritt</small><b>${escapeHtml(path.title)}</b></div>`;bindLearningChapterSidebar();
    const progress=pathProgress(path),maturity=maturityById.get(step.maturity_level)||{},prerequisites=(step.prerequisites||[]).map(id=>learningStepById.get(id)).filter(Boolean),next=(step.next_learning_steps||[]).map(id=>learningStepById.get(id)).filter(Boolean);
    const stepList=path.steps.map((item,index)=>{const saved=learningStepState(item.id);return`<button class="step-card${item.id===step.id?' active':''}" data-step-id="${escapeHtml(item.id)}"><span class="step-status ${escapeHtml(saved.status)}"></span><b>${index+1}. ${escapeHtml(item.title)}</b><small>${escapeHtml(maturityById.get(item.maturity_level)?.title||item.maturity_level)}</small></button>`}).join('');
    dom.learningContent.innerHTML=`${crossModeOriginBanner('learning')}<header class="content-header"><div class="eyebrow">Architecture Learning · ${path.steps.length} Schritte · ${progress.percent}% abgeschlossen</div><h1>${escapeHtml(path.title)}</h1><p class="content-lead">${escapeHtml(path.goal)} <strong>${escapeHtml(path.outcome)}</strong></p></header><div class="learning-layout"><div class="step-list">${stepList}</div><article class="learning-step"><span class="maturity-badge">Level ${maturity.level} · ${escapeHtml(maturity.title||'')}</span><h2>${escapeHtml(step.title)}</h2><p><strong>Learning Goal:</strong> ${escapeHtml(step.learning_goal)}</p><p>${escapeHtml(step.explanation)}</p><div class="learning-controls"><label>Status<select id="stepProgressStatus"><option value="not-started">Nicht begonnen</option><option value="in-progress">In Bearbeitung</option><option value="completed">Abgeschlossen</option></select></label><label>Verständnislevel<select id="stepUnderstanding">${(LEARNING.maturity_levels||[]).map(item=>`<option value="${item.level}">Level ${item.level} – ${escapeHtml(item.title)}</option>`).join('')}</select></label><label class="full">Persönliche Notiz<textarea id="stepNote" placeholder="Nur lokal in diesem Browser gespeichert …">${escapeHtml(userProfile.notes[step.id]||'')}</textarea></label><label class="full">Zuletzt geöffnet<input value="${escapeHtml(currentState.last_opened_at?new Date(currentState.last_opened_at).toLocaleString('de-DE'):'–')}" readonly></label></div><h3>Voraussetzungen</h3><div class="link-grid">${prerequisites.length?prerequisites.map(item=>`<button class="step-link" data-step-id="${escapeHtml(item.id)}">${escapeHtml(item.title)}</button>`).join(''):'<span class="detail-path">Keine</span>'}</div><h3>Relevante Azure-Knoten</h3><div class="link-grid">${step.referenced_nodes.map(id=>`<button class="node-link" data-node-id="${escapeHtml(id)}">${escapeHtml(nodeTitle(id))}</button>`).join('')}</div><h3>Relevante Architecture Scenarios</h3><div class="link-grid">${step.referenced_scenarios.length?step.referenced_scenarios.map(id=>`<button class="scenario-link" data-scenario-id="${escapeHtml(id)}">${escapeHtml(scenarioTitle(id))}</button>`).join(''):'<span class="detail-path">Keine</span>'}</div><h3>Architecture Questions</h3>${listHtml(step.architecture_questions)}<h3>Empfohlene nächste Schritte</h3><div class="link-grid">${next.length?next.map(item=>`<button class="step-link" data-step-id="${escapeHtml(item.id)}">${escapeHtml(item.title)}</button>`).join(''):'<span class="detail-path">Pfad abgeschlossen</span>'}</div></article></div>`;
    dom.learningContent.querySelector('[data-cross-mode-back]')?.addEventListener('click',restoreNavigationContext);
    dom.learningContent.querySelectorAll('[data-step-id]').forEach(button=>button.addEventListener('click',()=>openLearningStep(button.dataset.stepId)));dom.learningContent.querySelectorAll('[data-node-id]').forEach(button=>button.addEventListener('click',()=>navigateToNode(button.dataset.nodeId)));dom.learningContent.querySelectorAll('[data-scenario-id]').forEach(button=>button.addEventListener('click',()=>openScenario(button.dataset.scenarioId)));
    const status=el('stepProgressStatus'),understanding=el('stepUnderstanding'),note=el('stepNote');status.value=currentState.status;understanding.value=String(currentState.understanding_level);status.addEventListener('change',()=>{const value=status.value;saveLearningStepState(step.id,{...learningStepState(step.id),status:value,progress_percent:value==='completed'?100:value==='in-progress'?50:0,completed:value==='completed',last_opened_at:new Date().toISOString(),notes:note.value});renderLearning()});understanding.addEventListener('change',()=>saveLearningStepState(step.id,{...learningStepState(step.id),understanding_level:Number(understanding.value),last_opened_at:new Date().toISOString(),notes:note.value}));note.addEventListener('input',()=>saveLearningStepState(step.id,{...learningStepState(step.id),last_opened_at:new Date().toISOString(),notes:note.value}));
    dom.visible.textContent=`${LEARNING.learning_paths.length} Lernpfade · ${LEARNING.meta.step_count} Schritte · ${progress.percent}% im aktuellen Pfad`;
  }

  function search(query){
    const q=normalizeTerm(query);state.searchMatches.clear();if(q.length<2){dom.results.hidden=true;dom.results.dataset.count='0';if(state.mode==='mindmap')renderMindmap();return}
    if(state.mode==='brain'){
      const results=BRAIN.search(query);results.forEach(entity=>state.searchMatches.add(entity.id));
      dom.results.dataset.count=String(results.length);
      dom.results.innerHTML=results.map(entity=>`<button data-id="${escapeHtml(entity.id)}"><span class="search-result-heading"><b>${escapeHtml(entity.title)}</b><em>${escapeHtml(entity.kind==='domain'?'Domain':entity.kind==='capability'?'Capability':'Wissensobjekt')}</em></span><small class="search-result-target">Domain: ${escapeHtml(entity.domain)}</small></button>`).join('')||'<button disabled>Keine fachliche Brain-Entity gefunden</button>';
      dom.results.hidden=false;dom.results.querySelectorAll('[data-id]').forEach(button=>button.addEventListener('click',()=>{dom.results.hidden=true;dom.search.value='';BRAIN.focus(button.dataset.id);navigateToNode(button.dataset.id)}));if(state.brainRenderer==='2d')drawGraph();return;
    }
    const rank=result=>result.matchType==='Exakte Node-ID'?2000:result.score+(primaryPresentationIds.has(result.node.id)?150:0);
    const scored=CORE.search(searchRecords,q).sort((a,b)=>rank(b)-rank(a)||a.node.title.localeCompare(b.node.title,'de'));scored.slice(0,100).filter(result=>primaryPresentationIds.has(result.node.id)).forEach(result=>state.searchMatches.add(result.node.id));
    const results=scored.slice(0,30);dom.results.dataset.count=String(results.length);dom.results.innerHTML=results.map(({node:n,matchType})=>`<button data-id="${escapeHtml(n.id)}"><span class="search-result-heading"><b>${escapeHtml(presentationTitle(n))}</b><em>${escapeHtml(matchType)}</em></span><small class="search-result-path">${escapeHtml(primaryDomain(n))}</small><small class="search-result-target">Domain: ${escapeHtml(primaryDomain(n))}</small></button>`).join('')||'<button disabled>Keine Treffer</button>';
    dom.results.hidden=false;dom.results.querySelectorAll('[data-id]').forEach(button=>button.addEventListener('click',()=>{dom.results.hidden=true;dom.search.value='';state.searchMatches.clear();navigateToNode(button.dataset.id)}));if(state.mode==='mindmap')renderMindmap();
  }

  function zoomMind(factor,x,y){const old=state.mind.scale,next=Math.max(.07,Math.min(2.5,old*factor));state.mind.tx=x-(x-state.mind.tx)*(next/old);state.mind.ty=y-(y-state.mind.ty)*(next/old);state.mind.scale=next;mindTransform()}
  function zoomGraph(factor,x,y){const old=state.graph.scale,next=Math.max(.12,Math.min(4,old*factor));state.graph.tx=x-(x-state.graph.tx)*(next/old);state.graph.ty=y-(y-state.graph.ty)*(next/old);state.graph.scale=next;drawGraph()}
  function pointInStage(e){const r=dom.stage.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}}

  dom.mind.addEventListener('pointerdown',e=>{if(e.target.closest?.('.node'))return;state.mind.drag=true;state.mind.last={x:e.clientX,y:e.clientY};dom.mind.setPointerCapture(e.pointerId)});
  dom.mind.addEventListener('pointermove',e=>{if(!state.mind.drag)return;state.mind.tx+=e.clientX-state.mind.last.x;state.mind.ty+=e.clientY-state.mind.last.y;state.mind.last={x:e.clientX,y:e.clientY};mindTransform()});dom.mind.addEventListener('pointerup',()=>state.mind.drag=false);
  dom.mind.addEventListener('wheel',e=>{e.preventDefault();const p=pointInStage(e);zoomMind(Math.exp(-e.deltaY*.0012),p.x,p.y)},{passive:false});
  dom.brain.addEventListener('pointerdown',e=>{const p=pointInStage(e),hit=graphHit(p.x,p.y);state.graph.drag=true;state.graph.dragNode=hit;state.graph.last={x:e.clientX,y:e.clientY};dom.brain.setPointerCapture(e.pointerId)});
  dom.brain.addEventListener('pointermove',e=>{const p=pointInStage(e);if(state.graph.drag){const dx=(e.clientX-state.graph.last.x)/state.graph.scale,dy=(e.clientY-state.graph.last.y)/state.graph.scale;if(state.graph.dragNode){state.graph.dragNode.x+=dx;state.graph.dragNode.y+=dy}else{state.graph.tx+=e.clientX-state.graph.last.x;state.graph.ty+=e.clientY-state.graph.last.y}state.graph.last={x:e.clientX,y:e.clientY};drawGraph();return}const hit=graphHit(p.x,p.y),edge=hit?null:edgeHit(p.x,p.y);state.graph.hoverNode=hit;state.graph.hoverEdge=edge;if(hit||edge){dom.tooltip.hidden=false;dom.tooltip.style.left=(p.x+14)+'px';dom.tooltip.style.top=(p.y+14)+'px';if(hit)dom.tooltip.innerHTML=`<b>${escapeHtml(hit.title)}</b><br>${escapeHtml(hit.type==='domain'?'Wissensbereich':hit.category)}`;else{const a=nodeById.get(edge.source),b=nodeById.get(edge.target),type=relationTypeById.get(edge.type);dom.tooltip.innerHTML=`<b>${escapeHtml(type?.label||edge.type)}</b><br>${escapeHtml(a?.title)} → ${escapeHtml(b?.title)}<br>${escapeHtml(edge.explanation)}`}}else dom.tooltip.hidden=true});
  dom.brain.addEventListener('pointerup',e=>{const p=pointInStage(e),hit=graphHit(p.x,p.y);if(hit&&Math.abs(e.clientX-state.graph.last.x)<4&&Math.abs(e.clientY-state.graph.last.y)<4)navigateToNode(hit.type==='domain'?hit.canonicalId:hit.id);state.graph.drag=false;state.graph.dragNode=null});dom.brain.addEventListener('pointerleave',()=>{state.graph.drag=false;dom.tooltip.hidden=true});
  dom.brain.addEventListener('dblclick',e=>{const p=pointInStage(e),hit=graphHit(p.x,p.y),id=hit?.type==='domain'?hit.canonicalId:hit?.id;if(id&&nodeById.has(id)){selectNode(id);buildGraph(id);fitGraph()}});dom.brain.addEventListener('wheel',e=>{e.preventDefault();const p=pointInStage(e);zoomGraph(Math.exp(-e.deltaY*.0012),p.x,p.y)},{passive:false});

  dom.mindMode.addEventListener('click',()=>setMode('mindmap'));dom.brainMode.addEventListener('click',()=>setMode('brain'));dom.architectureMode.addEventListener('click',()=>{state.crossModeOrigin=null;ensureArchitectureCase().ui.view='home';setMode('architecture');setNavigationHash(null)});dom.learningMode.addEventListener('click',()=>setMode('learning'));dom.brain2dButton.addEventListener('click',()=>setBrainRenderer('2d'));dom.brain3dButton.addEventListener('click',()=>setBrainRenderer('3d'));dom.expandAll.addEventListener('click',expandAll);dom.collapse.addEventListener('click',collapseAll);dom.focus.addEventListener('click',()=>{clearDetails();if(state.brainRenderer==='2d')fitGraph()});dom.mindScopeFocus.addEventListener('click',()=>setMindScope('focus'));dom.mindScopeGlobal.addEventListener('click',()=>setMindScope('global'));
  dom.fit.addEventListener('click',()=>state.mode==='brain'?(state.brainRenderer==='3d'?window.ADB3D_RENDERER.fit():fitGraph()):fitMindmap());dom.zoomIn.addEventListener('click',()=>{const r=dom.stage.getBoundingClientRect();state.mode==='brain'?(state.brainRenderer==='3d'?window.ADB3D_RENDERER.zoomIn():zoomGraph(1.2,r.width/2,r.height/2)):zoomMind(1.2,r.width/2,r.height/2)});dom.zoomOut.addEventListener('click',()=>{const r=dom.stage.getBoundingClientRect();state.mode==='brain'?(state.brainRenderer==='3d'?window.ADB3D_RENDERER.zoomOut():zoomGraph(.82,r.width/2,r.height/2)):zoomMind(.82,r.width/2,r.height/2)});
  dom.search.addEventListener('input',()=>search(dom.search.value));dom.search.addEventListener('keydown',e=>{if(e.key==='Escape'){dom.search.value='';search('');dom.search.blur()}else if(e.key==='Enter'){const first=dom.results.querySelector('[data-id]');if(first){e.preventDefault();first.click()}}});document.addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();dom.search.focus()}else if((e.metaKey||e.altKey)&&e.key==='ArrowLeft'&&state.navigationStack.length){e.preventDefault();restoreNavigationContext()}});document.addEventListener('click',e=>{if(!e.target.closest('.search-box'))dom.results.hidden=true});
  dom.panel.addEventListener('click',event=>{const link=event.target.closest('.semantic-link');if(!link)return;const ids=link.dataset.targetIds.split(',').filter(Boolean);if(ids.length===1)navigateToNode(ids[0]);else openSemanticChooser(link.dataset.term,ids)});
  dom.closeSemanticChooser.addEventListener('click',()=>dom.semanticChooser.hidden=true);dom.contextMindmap.addEventListener('click',()=>openKnowledgeMode('mindmap'));dom.contextBrain.addEventListener('click',()=>openKnowledgeMode('brain'));dom.contextArchitecture.addEventListener('click',()=>{if(phase3Enabled){if(state.selected)startCrossModeContext(state.selected,'architecture')}else{const scenario=(scenariosByNode.get(state.selected)||[])[0];if(scenario)openScenario(scenario.id)}});dom.contextLearning.addEventListener('click',()=>openLearningForNode());
  dom.returnToLearning.addEventListener('click',()=>{if(state.governanceReturn){const target=state.governanceReturn;state.governanceReturn=null;state.governancePrototype=true;state.accessPrototype=false;state.organizationPrototype=false;state.azurePrototype=false;state.cloudPrototype=false;state.networkingPrototype=false;state.governanceStepIndex=target.stepIndex;state.governanceSelection=target.entityId;setMode('learning');selectNode(target.entityId);dom.returnToLearning.hidden=true;return}if(state.accessReturn){const target=state.accessReturn;state.accessReturn=null;state.accessPrototype=true;state.organizationPrototype=false;state.azurePrototype=false;state.cloudPrototype=false;state.networkingPrototype=false;state.accessStepIndex=target.stepIndex;state.accessSelection=target.entityId;setMode('learning');selectNode(target.entityId);dom.returnToLearning.hidden=true;return}if(state.organizationReturn){const target=state.organizationReturn;state.organizationReturn=null;state.organizationPrototype=true;state.azurePrototype=false;state.cloudPrototype=false;state.networkingPrototype=false;state.organizationStepIndex=target.stepIndex;state.organizationSelection=target.entityId;setMode('learning');selectNode(target.entityId);dom.returnToLearning.hidden=true;return}if(state.azureReturn){const target=state.azureReturn;state.azureReturn=null;state.azurePrototype=true;state.cloudPrototype=false;state.networkingPrototype=false;state.azureStepIndex=target.stepIndex;state.azureSelection=target.entityId;setMode('learning');selectNode(target.entityId);dom.returnToLearning.hidden=true;return}if(state.cloudReturn){const target=state.cloudReturn;state.cloudReturn=null;state.cloudPrototype=true;state.networkingPrototype=false;state.cloudStepIndex=target.stepIndex;state.cloudSelection=target.entityId;setMode('learning');selectNode(target.entityId);dom.returnToLearning.hidden=true;return}const target=state.networkingReturn;if(!target)return;state.networkingReturn=null;state.networkingPrototype=true;state.networkingStepIndex=target.stepIndex;state.networkingSelection=target.entityId;setMode('learning');selectNode(target.entityId);dom.returnToLearning.hidden=true});
  dom.back.addEventListener('click',restoreNavigationContext);dom.close.addEventListener('click',clearDetails);dom.toggle.addEventListener('click',()=>{if(state.mode==='mindmap'){if(state.selected)toggleBranch(state.selected)}else openKnowledgeMode('mindmap')});dom.showRelations.addEventListener('click',()=>openKnowledgeMode('brain'));dom.toggleRelations.addEventListener('click',()=>{if(!state.selected)return;state.relationsExpanded=!state.relationsExpanded;const n=nodeById.get(state.selected),relations=n.relations.map(id=>relById.get(id)).filter(Boolean);renderRelations(n,relations)});dom.sourcesDisclosure.addEventListener('toggle',()=>{if(!dom.sourcesDisclosure.classList.contains('direct'))dom.sourceDisclosureLabel.textContent=dom.sourcesDisclosure.open?'Quellen ausblenden':'Quellen anzeigen'});dom.notesDisclosure.addEventListener('toggle',()=>dom.notesDisclosureLabel.textContent=dom.notesDisclosure.open?'Notizen schließen':'Notizen öffnen');
  dom.learning.addEventListener('change',()=>{if(!state.selected)return;const s=userState(state.selected);s.status=dom.learning.value;saveUserState(state.selected,s)});dom.notes.addEventListener('input',()=>{if(!state.selected)return;const s=userState(state.selected);s.notes=dom.notes.value;saveUserState(state.selected,s)});
  dom.exportProfile.addEventListener('click',exportProfile);dom.importProfile.addEventListener('click',()=>dom.profileFile.click());dom.profileFile.addEventListener('change',()=>{const file=dom.profileFile.files?.[0];if(file)importProfileFile(file);dom.profileFile.value=''});
  window.addEventListener('resize',()=>{if(state.mode==='brain'){if(state.brainRenderer==='3d')window.ADB3D_RENDERER.resize();else{resizeBrain();fitGraph()}}else if(state.mode==='mindmap')fitMindmap()});

  window.ADB3D_RENDERER.onChange(syncShellFromThree);
  function applyRouteFromHash(){const parameters=new URLSearchParams(location.hash.slice(1)),mode=parameters.get('mode'),nodeId=parameters.get('node')||parameters.get('domain'),scenarioId=parameters.get('scenario'),learningStepId=parameters.get('learningStep'),originId=parameters.get('origin'),flowId=parameters.get('learningFlow'),flowStepId=parameters.get('flowStep');state.learningFocusId=null;state.legacyContext=false;state.crossModeOrigin=null;for(const flag of ['cloudPrototype','azurePrototype','organizationPrototype','accessPrototype','governancePrototype','networkingPrototype'])state[flag]=false;if(parameters.get('renderer')==='3d')state.brainRenderer='3d';if(scenarioId&&scenarioById.has(scenarioId))state.scenarioId=scenarioId;if(learningStepId&&learningStepById.has(learningStepId)){const step=learningStepById.get(learningStepId);state.learningPathId=step.path_id;state.learningStepId=step.id;if(mode==='learning')state.legacyContext=true}if(mode==='learning'&&NETWORK_FLOW&&flowId===NETWORK_FLOW.id){state.networkingPrototype=true;state.networkingStepIndex=Math.max(0,NETWORK_FLOW.steps.findIndex(step=>step.id===(NETWORK_FLOW.stepAliases?.[flowStepId]||flowStepId)))}if(mode==='learning'&&CLOUD_FLOW&&flowId===CLOUD_FLOW.id){state.cloudPrototype=true;state.cloudStepIndex=Math.max(0,CLOUD_FLOW.steps.findIndex(step=>step.id===flowStepId))}if(mode==='learning'&&AZURE_FLOW&&flowId===AZURE_FLOW.id){state.azurePrototype=true;state.azureStepIndex=Math.max(0,AZURE_FLOW.steps.findIndex(step=>step.id===flowStepId))}if(mode==='learning'&&ORGANIZATION_FLOW&&flowId===ORGANIZATION_FLOW.id){state.organizationPrototype=true;state.organizationStepIndex=Math.max(0,ORGANIZATION_FLOW.steps.findIndex(step=>step.id===flowStepId))}if(mode==='learning'&&ACCESS_FLOW&&flowId===ACCESS_FLOW.id){state.accessPrototype=true;state.accessStepIndex=Math.max(0,ACCESS_FLOW.steps.findIndex(step=>step.id===flowStepId))}if(mode==='learning'&&GOVERNANCE_FLOW&&flowId===GOVERNANCE_FLOW.id){state.governancePrototype=true;state.governanceStepIndex=Math.max(0,GOVERNANCE_FLOW.steps.findIndex(step=>step.id===flowStepId))}if(phase3Enabled&&originId&&nodeById.has(originId)&&['architecture','learning'].includes(mode)){const result=crossModeResolver.resolve(originId,mode);state.crossModeOrigin={node_id:originId,source_mode:'mindmap',target_mode:mode,resolution_subtype:result.subtype,selected_candidate_id:mode==='architecture'?scenarioId:learningStepId}}if(mode==='architecture')ensureArchitectureCase().fromHash(parameters);if(['mindmap','brain','architecture','learning'].includes(mode))setMode(mode);if(nodeId){if(mode==='brain'&&(parameters.get('center')||parameters.get('view')==='overview')&&BRAIN.entityById.has(nodeId)){selectNode(nodeId);if(state.brainRenderer==='3d')window.ADB3D_RENDERER.activate();else{buildGraph(BRAIN.state.contextCenterId);fitGraph()}}else navigateToNode(nodeId,{remember:false});if(mode==='learning')applyLearningFocus(nodeId)}}
  window.addEventListener('hashchange',()=>{if(new URLSearchParams(location.hash.slice(1)).get('mode')==='architecture')applyRouteFromHash()});
  renderMindmap();requestAnimationFrame(()=>{fitMindmap();applyRouteFromHash()});
  window.addEventListener('hashchange',()=>{const p=new URLSearchParams(location.hash.slice(1));if(p.get('mode')==='learning'&&p.has('learningFlow'))applyRouteFromHash()});
})();
