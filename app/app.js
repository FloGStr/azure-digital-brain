(function(){
  'use strict';

  const DATA=window.AZURE_DIGITAL_BRAIN;
  const RELEASE=window.AZURE_DIGITAL_BRAIN_RELEASE||{};
  const ARCH=window.AZURE_ARCHITECTURE_SCENARIOS||{};
  const LEARNING=window.AZURE_ARCHITECTURE_LEARNING||{};
  const NAV=window.AZURE_SEMANTIC_NAVIGATION||{meta:{},classifications:[],aliases:[],link_types:{}};
  const EXPERIENCE=window.AZURE_CONTEXT_EXPERIENCE||{release_version:'3.2'};
  const CORE=window.AzureSemanticNavigationCore;
  const KB={meta:DATA?.meta||{},nodes:DATA?.nodes||[]};
  const RELS=DATA?.relations||[];
  const SOURCES=DATA?.sources||[];
  const RELATION_TYPES=DATA?.relation_types||[];
  if(!KB.nodes.length){document.body.innerHTML='<div class="error">Die kanonische Wissensbasis konnte nicht geladen werden.</div>';return;}
  if(!ARCH.scenarios?.length||!LEARNING.learning_paths?.length){document.body.innerHTML='<div class="error">Architecture- oder Learning-Runtime konnte nicht geladen werden.</div>';return;}

  const COLORS={
    'Architecture':'#ffb454','Azure Fundamentals':'#7d91a8','Compute':'#52c7ff','Cost & Lifecycle':'#f3ce58',
    'Databases':'#a889ff','Governance':'#ff7e88','Identity':'#51e1bf','Monitoring':'#ff9c54',
    'Networking':'#43a6ff','Security':'#ff5f73','Storage':'#7bd66d'
  };
  const nodeById=new Map(KB.nodes.map(n=>[n.id,{...n,childNodes:[]}])) ;
  const sourceById=new Map(SOURCES.map(s=>[s.id,s]));
  const relById=new Map(RELS.map(r=>[r.id,r]));
  const relationTypeById=new Map(RELATION_TYPES.map(type=>[type.id,type]));
  const classificationById=new Map((NAV.classifications||[]).map(item=>[item.node_id,item]));
  for(const n of nodeById.values()) n.children.forEach(id=>{const c=nodeById.get(id);if(c)n.childNodes.push(c)});
  const root=[...nodeById.values()].find(n=>!n.parent);
  const categories=[...new Set(KB.nodes.map(n=>n.category))].sort();
  const scenarioById=new Map(ARCH.scenarios.map(s=>[s.id,s]));
  const learningPathById=new Map(LEARNING.learning_paths.map(p=>[p.id,p]));
  const learningStepById=new Map(LEARNING.learning_paths.flatMap(p=>p.steps.map(s=>[s.id,{...s,path_id:p.id}])));
  const maturityById=new Map((LEARNING.maturity_levels||[]).map(m=>[m.id,m]));
  const scenariosByNode=new Map(),stepsByNode=new Map();
  for(const scenario of ARCH.scenarios){const refs=new Set([...(scenario.learning_path||[]),...(scenario.component_instances||[]).map(c=>c.node_ref).filter(Boolean),...(scenario.architecture_flow||[]).flatMap(f=>f.node_refs||[])]);for(const id of refs){if(!scenariosByNode.has(id))scenariosByNode.set(id,[]);scenariosByNode.get(id).push(scenario)}}
  for(const [id,step] of learningStepById)for(const nodeId of step.referenced_nodes||[]){if(!stepsByNode.has(nodeId))stepsByNode.set(nodeId,[]);stepsByNode.get(nodeId).push(step)}

  const el=id=>document.getElementById(id);
  const dom={
    stage:el('stage'),mind:el('mindmapCanvas'),mindViewport:el('mindViewport'),mindLinks:el('mindLinks'),mindNodes:el('mindNodes'),brain:el('brainCanvas'),
    tooltip:el('graphTooltip'),legend:el('legend'),status:el('viewStatus'),visible:el('visibleStatus'),summary:el('dataSummary'),
    mindMode:el('mindmapMode'),brainMode:el('brainMode'),architectureMode:el('architectureMode'),learningMode:el('learningMode'),search:el('searchInput'),results:el('searchResults'),expandAll:el('expandAllBtn'),collapse:el('collapseBtn'),focus:el('focusBtn'),toolbar:document.querySelector('.toolbar'),
    zoomIn:el('zoomIn'),zoomOut:el('zoomOut'),fit:el('fitView'),panel:el('detailPanel'),close:el('closeDetails'),category:el('detailCategory'),title:el('detailTitle'),
    path:el('detailPath'),audit:el('auditBox'),contextSummarySection:el('contextSummarySection'),contextSummary:el('contextSummary'),contextModeActions:el('contextModeActions'),contextMindmap:el('contextMindmap'),contextBrain:el('contextBrain'),contextArchitecture:el('contextArchitecture'),contextLearning:el('contextLearning'),simpleSection:el('simpleSection'),short:el('detailShort'),technicalSection:el('technicalSection'),technical:el('detailTechnical'),architectureSection:el('architectureSection'),architecture:el('detailArchitecture'),architectureContextList:el('architectureContextList'),whySection:el('whySection'),why:el('detailWhy'),examplesSection:el('examplesSection'),examples:el('detailExamples'),memorySection:el('memorySection'),memory:el('detailMemory'),meta:el('detailMeta'),learningSection:el('learningSection'),learning:el('learningStatus'),
    relationsSection:el('relationsSection'),relationList:el('relationList'),contextSection:el('contextSection'),contextList:el('contextList'),sourcesSection:el('sourcesSection'),sourceList:el('sourceList'),notesSection:el('notesSection'),notes:el('notes'),
    architectureView:el('architectureView'),scenarioList:el('scenarioList'),scenarioContent:el('scenarioContent'),learningView:el('learningView'),learningPathList:el('learningPathList'),learningContent:el('learningContent'),
    qualityDetails:el('qualityDetails'),qualityContent:el('qualityContent'),semanticChooser:el('semanticChooser'),semanticChooserList:el('semanticChooserList'),closeSemanticChooser:el('closeSemanticChooser'),actions:el('detailActions'),toggle:el('toggleBranch'),showRelations:el('showRelations'),back:el('backNavigation'),exportProfile:el('exportProfile'),importProfile:el('importProfile'),profileFile:el('profileFile')
  };
  const state={
    mode:'mindmap',selected:null,highlighted:null,searchMatches:new Set(),expanded:new Set([root.id,...root.children]),navigationStack:[],
    mind:{scale:1,tx:0,ty:0,positions:new Map(),visible:[],drag:false,last:null},
    graph:{scale:1,tx:0,ty:0,nodes:[],edges:[],focusId:null,drag:false,dragNode:null,last:null,hoverNode:null,hoverEdge:null},
    scenarioId:ARCH.scenarios[0]?.id||null,learningPathId:LEARNING.learning_paths[0]?.id||null,learningStepId:LEARNING.learning_paths[0]?.steps?.[0]?.id||null
  };
  const releaseSummary=`V${RELEASE.release_version} Wissensbasis · V${EXPERIENCE.release_version||'3.2'} Experience · ${Number(RELEASE.node_count).toLocaleString('de-DE')} Knoten · ${Number(RELEASE.relation_count).toLocaleString('de-DE')} Beziehungen · ${RELEASE.scenario_count} Szenarien · ${RELEASE.learning_path_count} Lernpfade`;
  dom.summary.textContent=releaseSummary;
  document.title=`${RELEASE.product_name} V${EXPERIENCE.release_version||'3.2'}`;
  dom.legend.innerHTML=categories.map(c=>`<span><i style="background:${COLORS[c]||'#8aa'}"></i>${escapeHtml(c)}</span>`).join('');

  function escapeHtml(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
  function ancestors(n){const list=[];let c=n;while(c?.parent){c=nodeById.get(c.parent);if(c)list.unshift(c)}return list}
  function currentPath(n){return [...ancestors(n),n].map(item=>item.title).join(' › ')}
  const normalizeTerm=CORE.normalizeTerm;
  function confidenceLabel(value){return value==='high'?'Hohe Sicherheit':value==='medium'?'Mittlere Sicherheit':'Niedrige Sicherheit'}
  const semanticMatcher=CORE.buildTermIndex([...nodeById.values()],NAV.aliases||[]);
  const searchRecords=CORE.buildSearchRecords([...nodeById.values()],NAV.aliases||[],NAV.classifications||[],currentPath);
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
  function color(n){return COLORS[n.category]||'#7891a5'}
  function depth(n){return n.legacy?.original?.depth??0}
  function importance(n){return Number(n.metadata?.importance||1)}
  function auditFlags(n){return n.metadata?.audit_flags||[]}
  function relationPresentation(relation,nodeId){const outgoing=relation.source===nodeId,typeId=outgoing?relation.type:relation.inverse_type,type=relationTypeById.get(typeId);return{otherId:outgoing?relation.target:relation.source,typeId,label:type?.label||typeId,color:type?.color||'#72d1ff',direction:outgoing?'outgoing':'incoming'}}
  function truncate(s,n=55){s=String(s||'').replace(/\s+/g,' ').trim();return s.length>n?s.slice(0,n-1)+'…':s}
  function semanticMatches(text,sourceNodeId){return CORE.findSemanticMatches(text,sourceNodeId,semanticMatcher)}
  function linkPresentation(match){
    const classified=match.candidates.map(candidate=>({...candidate,classification:classificationById.get(candidate.nodeId)}));
    const type=classified.length>1?'ambiguous':classified[0]?.classification?.classification==='Deprecated Concept'?'deprecated':classified[0]?.type==='historical'?'historical':'standard';
    const targets=classified.map(candidate=>{const node=nodeById.get(candidate.nodeId),classification=candidate.classification;return`${node?.title||candidate.nodeId}\nID: ${candidate.nodeId}\nPfad: ${currentPath(node)}\nZielbereich: ${classification?.proposed_target_position||'–'}`}).join('\n\n');
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
    const mind=mode==='mindmap',brain=mode==='brain',architecture=mode==='architecture',learning=mode==='learning',content=architecture||learning;
    dom.mind.classList.toggle('active',mind);dom.brain.classList.toggle('active',brain);dom.architectureView.hidden=!architecture;dom.learningView.hidden=!learning;
    for(const [button,active] of [[dom.mindMode,mind],[dom.brainMode,brain],[dom.architectureMode,architecture],[dom.learningMode,learning]]){button.classList.toggle('active',active);button.setAttribute('aria-selected',String(active))}
    dom.stage.classList.toggle('content-mode',content);dom.toolbar.classList.toggle('content-mode-controls',content);
    dom.expandAll.hidden=!mind;dom.collapse.hidden=!mind;dom.focus.hidden=!brain;
    dom.status.textContent=mind?'Hierarchische Original-Mindmap':brain?'Semantischer Knowledge Graph':architecture?'Architecture Scenarios':'Architecture Learning Paths';
    userProfile.preferences.default_mode=mode;saveProfile();
    if(brain){buildGraph(state.selected||state.graph.focusId);resizeBrain();fitGraph()}else if(mind){renderMindmap();if(state.selected)centerMindNode(state.selected);else fitMindmap()}else if(architecture)renderArchitecture();else renderLearning();if(state.selected)updateDetails(nodeById.get(state.selected));
  }

  function collectVisible(){const out=[];function walk(n){out.push(n);if(state.expanded.has(n.id))n.childNodes.forEach(walk)}walk(root);return out}
  function nodeSize(n){return depth(n)===0?[280,80]:depth(n)===1?[238,62]:[214,54]}
  function layoutMindmap(){
    const visible=collectVisible(),visibleIds=new Set(visible.map(n=>n.id)),pos=new Map(),gapX=276,gapY=70;
    const branchInfo=root.childNodes.filter(n=>visibleIds.has(n.id)).map((n,i)=>({node:n,side:i%2?'right':'left'}));
    for(const side of ['left','right']){
      let cursor=0;
      function place(n,branchSide){
        const kids=state.expanded.has(n.id)?n.childNodes.filter(c=>visibleIds.has(c.id)):[];
        let y;if(kids.length){const ys=kids.map(c=>place(c,branchSide));y=(ys[0]+ys[ys.length-1])/2}else{y=cursor*gapY;cursor++}
        const [w,h]=nodeSize(n);pos.set(n.id,{x:(branchSide==='left'?-1:1)*depth(n)*gapX,y,w,h,side:branchSide});return y;
      }
      const roots=branchInfo.filter(b=>b.side===side);roots.forEach(b=>{place(b.node,side);cursor+=.8});
      const ps=[...pos.values()].filter(p=>p.side===side);if(ps.length){const mid=(Math.min(...ps.map(p=>p.y))+Math.max(...ps.map(p=>p.y)))/2;ps.forEach(p=>p.y-=mid)}
    }
    const [w,h]=nodeSize(root);pos.set(root.id,{x:0,y:0,w,h,side:'center'});state.mind.positions=pos;state.mind.visible=visible;
  }
  function mindTransform(){dom.mindViewport.setAttribute('transform',`translate(${state.mind.tx} ${state.mind.ty}) scale(${state.mind.scale})`)}
  function renderMindmap(){
    layoutMindmap();dom.mindLinks.innerHTML='';dom.mindNodes.innerHTML='';
    for(const n of state.mind.visible){
      const p=state.mind.positions.get(n.id);if(n.parent&&state.mind.positions.has(n.parent)){
        const q=state.mind.positions.get(n.parent),dir=p.side==='left'?-1:1,startX=q.x+dir*q.w/2,endX=p.x-dir*p.w/2,mid=(startX+endX)/2;
        const path=document.createElementNS('http://www.w3.org/2000/svg','path');path.setAttribute('d',`M${startX},${q.y} C${mid},${q.y} ${mid},${p.y} ${endX},${p.y}`);path.setAttribute('stroke',color(n));dom.mindLinks.appendChild(path);
      }
      const g=document.createElementNS('http://www.w3.org/2000/svg','g');g.setAttribute('class',`node${state.selected===n.id?' selected':''}${state.highlighted===n.id?' navigated':''}${state.searchMatches.has(n.id)?' match':''}`);g.setAttribute('transform',`translate(${p.x-p.w/2} ${p.y-p.h/2})`);g.dataset.id=n.id;
      const rect=document.createElementNS('http://www.w3.org/2000/svg','rect');rect.setAttribute('width',p.w);rect.setAttribute('height',p.h);rect.setAttribute('rx',depth(n)<2?15:11);rect.setAttribute('fill',depth(n)===0?'#123b5a':'#102235');rect.setAttribute('stroke',color(n));g.appendChild(rect);
      const title=document.createElementNS('http://www.w3.org/2000/svg','text');title.setAttribute('x',16);title.setAttribute('y',depth(n)===0?34:25);title.setAttribute('font-size',depth(n)===0?17:depth(n)===1?13:12);title.textContent=truncate(n.title,depth(n)===0?35:31);g.appendChild(title);
      if(n.legacy?.current_name||auditFlags(n).length){const sub=document.createElementNS('http://www.w3.org/2000/svg','text');sub.setAttribute('class','node-sub');sub.setAttribute('x',16);sub.setAttribute('y',depth(n)===0?55:43);sub.textContent=auditFlags(n).length?'Aktualitätshinweis':'aktueller Produktname';g.appendChild(sub)}
      if(n.childNodes.length){const badge=document.createElementNS('http://www.w3.org/2000/svg','g');const cx=p.side==='left'?0:p.w;badge.setAttribute('transform',`translate(${cx} ${p.h/2})`);const c=document.createElementNS('http://www.w3.org/2000/svg','circle');c.setAttribute('r',10);c.setAttribute('fill','#07131f');c.setAttribute('stroke',color(n));badge.appendChild(c);const t=document.createElementNS('http://www.w3.org/2000/svg','text');t.setAttribute('text-anchor','middle');t.setAttribute('y',4);t.setAttribute('font-size',13);t.textContent=state.expanded.has(n.id)?'−':'+';badge.appendChild(t);g.appendChild(badge)}
      g.addEventListener('click',e=>{e.stopPropagation();selectNode(n.id)});g.addEventListener('dblclick',e=>{e.stopPropagation();toggleBranch(n.id)});dom.mindNodes.appendChild(g);
    }
    mindTransform();dom.visible.textContent=`${state.mind.visible.length.toLocaleString('de-DE')} von ${KB.nodes.length.toLocaleString('de-DE')} Knoten sichtbar`;
  }
  function toggleBranch(id){const n=nodeById.get(id);if(!n?.childNodes.length)return;if(state.expanded.has(id))state.expanded.delete(id);else state.expanded.add(id);renderMindmap();updateDetails(n)}
  function expandAll(){if(state.mode!=='mindmap')return;state.expanded=new Set([...nodeById.values()].filter(node=>node.childNodes.length).map(node=>node.id));renderMindmap();requestAnimationFrame(fitMindmap)}
  function collapseAll(){if(state.mode!=='mindmap')return;state.expanded=new Set([root.id]);renderMindmap();requestAnimationFrame(fitMindmap)}
  function openPath(id,render=true){for(const a of ancestors(nodeById.get(id)))state.expanded.add(a.id);if(render)renderMindmap()}
  function mindBounds(){const ps=[...state.mind.positions.values()];if(!ps.length)return null;return{minX:Math.min(...ps.map(p=>p.x-p.w/2)),maxX:Math.max(...ps.map(p=>p.x+p.w/2)),minY:Math.min(...ps.map(p=>p.y-p.h/2)),maxY:Math.max(...ps.map(p=>p.y+p.h/2))}}
  function fitMindmap(){const b=mindBounds();if(!b)return;const rect=dom.stage.getBoundingClientRect(),pad=80,s=Math.min((rect.width-pad)/(b.maxX-b.minX),(rect.height-pad)/(b.maxY-b.minY),1.15);state.mind.scale=Math.max(.08,s);state.mind.tx=rect.width/2-((b.minX+b.maxX)/2)*s;state.mind.ty=rect.height/2-((b.minY+b.maxY)/2)*s;mindTransform()}
  function centerMindNode(id){
    const position=state.mind.positions.get(id);if(!position)return;const rect=dom.stage.getBoundingClientRect(),scale=1.05;state.mind.scale=scale;state.mind.tx=rect.width/2-position.x*scale;state.mind.ty=rect.height/2-position.y*scale;mindTransform();
  }

  function hash(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return(h>>>0)/4294967295}
  function buildGraph(focusId=null){
    const focused=Boolean(focusId&&nodeById.has(focusId));state.graph.focusId=focused?focusId:null;const include=new Set(),firstHop=new Set(),synthetic=new Map();let contextModel=null;
    if(focused){
      contextModel=CORE.buildContextNeighborhood([...nodeById.values()],RELS,focusId,{maxNodes:EXPERIENCE.brain_context?.max_nodes||80,childLimit:18});contextModel.include.forEach(id=>include.add(id));contextModel.firstHop.forEach(id=>firstHop.add(id));
    }else{
      RELS.forEach(r=>{include.add(r.source);include.add(r.target)});
      for(const category of categories){[...nodeById.values()].filter(n=>n.category===category).sort((a,b)=>importance(b)-importance(a)).slice(0,5).forEach(n=>include.add(n.id))}
    }
    const usedCategories=new Set([...include].map(id=>nodeById.get(id)?.category).filter(Boolean));
    if(!focused)usedCategories.forEach(category=>synthetic.set(`domain:${category}`,{id:`domain:${category}`,title:category,category,type:'domain',r:17}));
    const graphNodes=[...synthetic.values(),...[...include].map(id=>nodeById.get(id)).filter(Boolean).map(n=>({id:n.id,title:n.title,category:n.category,type:'knowledge',hop:focused?(n.id===focusId?0:firstHop.has(n.id)?1:2):null,r:n.id===focusId?17:Math.max(5,Math.min(12,3+importance(n)*.55)),importance:importance(n)}))];
    const index=new Set(graphNodes.map(n=>n.id));const graphEdges=[];
    for(const n of graphNodes)if(n.type==='knowledge'&&index.has(`domain:${n.category}`))graphEdges.push({source:`domain:${n.category}`,target:n.id,type:'gehört-zu',label:'gehört zu',explanation:`${n.title} ist dem Wissensbereich ${n.category} zugeordnet.`,synthetic:true});
    for(const r of RELS)if(index.has(r.source)&&index.has(r.target))graphEdges.push({...r});
    if(focused){
      const targetNode=nodeById.get(focusId);for(const edge of contextModel.hierarchyEdges)graphEdges.push({source:edge.source,target:edge.target,type:'hierarchy',label:edge.label,explanation:edge.label==='gehört zu'?`${targetNode.title} ist dem Elternknoten ${nodeTitle(edge.source)} untergeordnet.`:`${nodeTitle(edge.target)} ist ein direktes Unterthema von ${targetNode.title}.`,synthetic:true,contextEdge:true});
      const direct=graphNodes.filter(node=>node.hop===1).sort((a,b)=>a.title.localeCompare(b.title,'de')),second=graphNodes.filter(node=>node.hop===2).sort((a,b)=>a.title.localeCompare(b.title,'de')),center=graphNodes.find(node=>node.id===focusId);center.x=0;center.y=0;
      direct.forEach((node,index)=>{const angle=index/Math.max(1,direct.length)*Math.PI*2-Math.PI/2;node.x=Math.cos(angle)*190;node.y=Math.sin(angle)*190});
      second.forEach((node,index)=>{const angle=index/Math.max(1,second.length)*Math.PI*2-Math.PI/2+hash(node.id)*.22;node.x=Math.cos(angle)*350;node.y=Math.sin(angle)*350});
    }else{
      const count=usedCategories.size,centers=new Map([...usedCategories].map((c,i)=>{const a=(i/count)*Math.PI*2-Math.PI/2;return[c,{x:Math.cos(a)*430,y:Math.sin(a)*300}]}));
      graphNodes.forEach(n=>{const c=centers.get(n.category)||{x:0,y:0};if(n.type==='domain'){n.x=c.x;n.y=c.y}else{const a=hash(n.id)*Math.PI*2,rad=55+hash(n.id+'r')*150;n.x=c.x+Math.cos(a)*rad;n.y=c.y+Math.sin(a)*rad}});
    }
    for(let iteration=0;iteration<(focused?38:80);iteration++){
      for(let i=0;i<graphNodes.length;i++)for(let j=i+1;j<graphNodes.length;j++){const a=graphNodes[i],b=graphNodes[j],dx=b.x-a.x,dy=b.y-a.y,d2=dx*dx+dy*dy+.1,min=(a.r+b.r+(focused?28:18)),d=Math.sqrt(d2);if(d<min){const f=(min-d)/d*.035,fx=dx*f,fy=dy*f;if(a.type!=='domain'&&a.id!==focusId){a.x-=fx;a.y-=fy}if(b.type!=='domain'&&b.id!==focusId){b.x+=fx;b.y+=fy}}}
      for(const e of graphEdges.filter(e=>!e.synthetic)){const a=graphNodes.find(n=>n.id===e.source),b=graphNodes.find(n=>n.id===e.target);if(!a||!b)continue;const dx=b.x-a.x,dy=b.y-a.y,d=Math.sqrt(dx*dx+dy*dy)||1,desired=(a.id===focusId||b.id===focusId)?190:145,f=(d-desired)*.0015;if(a.type!=='domain'&&a.id!==focusId){a.x+=dx/d*f;a.y+=dy/d*f}if(b.type!=='domain'&&b.id!==focusId){b.x-=dx/d*f;b.y-=dy/d*f}}
    }
    state.graph.nodes=graphNodes;state.graph.edges=graphEdges;dom.focus.textContent=focused?'Kontext lösen':'Gesamtansicht';dom.visible.textContent=focused?`${graphNodes.length} Wissensknoten · 1–2 Ebenen Kontext · ${graphEdges.filter(e=>!e.synthetic).length} semantische Kanten`:`${graphNodes.filter(n=>n.type==='knowledge').length} Wissensknoten · ${graphEdges.filter(e=>!e.synthetic).length} semantische Kanten`;drawGraph();
  }
  function resizeBrain(){const r=dom.stage.getBoundingClientRect(),dpr=Math.min(2,window.devicePixelRatio||1);dom.brain.width=Math.floor(r.width*dpr);dom.brain.height=Math.floor(r.height*dpr);dom.brain.style.width=r.width+'px';dom.brain.style.height=r.height+'px';drawGraph()}
  function graphScreen(n){return{x:n.x*state.graph.scale+state.graph.tx,y:n.y*state.graph.scale+state.graph.ty}}
  function graphWorld(x,y){return{x:(x-state.graph.tx)/state.graph.scale,y:(y-state.graph.ty)/state.graph.scale}}
  function drawGraph(){
    if(state.mode!=='brain')return;const ctx=dom.brain.getContext('2d'),dpr=Math.min(2,window.devicePixelRatio||1),w=dom.brain.width/dpr,h=dom.brain.height/dpr;ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);ctx.save();ctx.translate(state.graph.tx,state.graph.ty);ctx.scale(state.graph.scale,state.graph.scale);
    const selected=state.selected,focused=Boolean(state.graph.focusId),direct=new Set();if(selected)for(const e of state.graph.edges)if(e.source===selected||e.target===selected){direct.add(e.source);direct.add(e.target)}
    for(const e of state.graph.edges){const a=state.graph.nodes.find(n=>n.id===e.source),b=state.graph.nodes.find(n=>n.id===e.target);if(!a||!b)continue;const isDirect=selected&&(e.source===selected||e.target===selected),dim=selected&&!isDirect&&!e.contextEdge,relationColor=e.contextEdge?'#6e91aa':relationTypeById.get(e.type)?.color||'#567087';ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.strokeStyle=isDirect?relationColor:dim?'#203746':relationColor;ctx.globalAlpha=isDirect?.96:dim?(focused?.32:.18):e.synthetic?.5:.56;ctx.lineWidth=(isDirect?2.5:e.contextEdge?1.35:1.15)/state.graph.scale;ctx.stroke();if(focused&&isDirect){const label=e.label||relationTypeById.get(e.type)?.label||e.type,mx=(a.x+b.x)/2,my=(a.y+b.y)/2;ctx.globalAlpha=.92;ctx.font=`600 ${10/state.graph.scale}px Inter,system-ui`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#a9d8ee';ctx.fillText(truncate(label,24),mx,my-7/state.graph.scale)}}
    ctx.globalAlpha=1;
    for(const n of state.graph.nodes){const sel=n.id===selected,dim=selected&&n.type==='knowledge'&&!sel&&!direct.has(n.id),r=n.r*(n.type==='domain'?1.12:1);ctx.beginPath();ctx.arc(n.x,n.y,r,0,Math.PI*2);ctx.fillStyle=color(n);ctx.globalAlpha=dim?.24:1;ctx.shadowColor=color(n);ctx.shadowBlur=(sel?24:n.type==='domain'?15:6)/state.graph.scale;ctx.fill();ctx.shadowBlur=0;if(sel){ctx.strokeStyle='#fff';ctx.lineWidth=2.5/state.graph.scale;ctx.stroke()}
      const showLabel=n.type==='domain'||sel||(focused&&n.hop===1)||state.graph.scale>.82||(state.graph.scale>.55&&n.importance>=9);if(showLabel&&(!dim||focused)){ctx.font=`${n.type==='domain'?'700 14':'600 11'}px Inter,system-ui`;ctx.textAlign='center';ctx.textBaseline='top';ctx.fillStyle='#eaf6ff';ctx.globalAlpha=dim?.58:.95;ctx.fillText(truncate(n.title,n.type==='domain'?26:30),n.x,n.y+r+7/state.graph.scale)}}
    ctx.restore();ctx.globalAlpha=1;
  }
  function fitGraph(){const ns=state.graph.nodes;if(!ns.length)return;const r=dom.stage.getBoundingClientRect(),focus=state.graph.focusId&&ns.find(n=>n.id===state.graph.focusId);if(focus){const radius=Math.max(190,...ns.map(n=>Math.hypot(n.x-focus.x,n.y-focus.y)+n.r)),s=Math.max(.42,Math.min((r.width-160)/(radius*2),(r.height-160)/(radius*2),1.3));state.graph.scale=s;state.graph.tx=r.width/2-focus.x*s;state.graph.ty=r.height/2-focus.y*s}else{const minX=Math.min(...ns.map(n=>n.x-n.r)),maxX=Math.max(...ns.map(n=>n.x+n.r)),minY=Math.min(...ns.map(n=>n.y-n.r)),maxY=Math.max(...ns.map(n=>n.y+n.r)),s=Math.min((r.width-120)/(maxX-minX),(r.height-120)/(maxY-minY),1.25);state.graph.scale=Math.max(.18,s);state.graph.tx=r.width/2-((minX+maxX)/2)*s;state.graph.ty=r.height/2-((minY+maxY)/2)*s}drawGraph()}
  function graphHit(x,y){const p=graphWorld(x,y);return [...state.graph.nodes].reverse().find(n=>Math.hypot(p.x-n.x,p.y-n.y)<=n.r+5/state.graph.scale)||null}
  function edgeHit(x,y){const p=graphWorld(x,y);let best=null,dist=10/state.graph.scale;for(const e of state.graph.edges.filter(e=>!e.synthetic)){const a=state.graph.nodes.find(n=>n.id===e.source),b=state.graph.nodes.find(n=>n.id===e.target);if(!a||!b)continue;const d=pointLineDistance(p,a,b);if(d<dist){dist=d;best=e}}return best}
  function pointLineDistance(p,a,b){const dx=b.x-a.x,dy=b.y-a.y,l=dx*dx+dy*dy;if(!l)return Math.hypot(p.x-a.x,p.y-a.y);const t=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.y-a.y)*dy)/l)),x=a.x+t*dx,y=a.y+t*dy;return Math.hypot(p.x-x,p.y-y)}

  function selectNode(id){if(!nodeById.has(id))return;state.selected=id;updateDetails(nodeById.get(id));if(state.mode==='mindmap')renderMindmap();else if(state.mode==='brain')drawGraph();if(innerWidth<=760)dom.panel.classList.add('open')}
  let highlightTimer=null;
  function updateBackButton(){dom.back.hidden=!state.navigationStack.length}
  function captureNavigationContext(){return{mode:state.mode,selected:state.selected,expanded:[...state.expanded],mind:{scale:state.mind.scale,tx:state.mind.tx,ty:state.mind.ty},graph:{scale:state.graph.scale,tx:state.graph.tx,ty:state.graph.ty,focusId:state.graph.focusId},scenarioId:state.scenarioId,learningPathId:state.learningPathId,learningStepId:state.learningStepId}}
  function setNavigationHash(nodeId){const hash=`#mode=${encodeURIComponent(state.mode)}&node=${encodeURIComponent(nodeId)}`;try{history.replaceState(null,'',hash)}catch{location.hash=hash}}
  function navigateToNode(nodeId,options={}){
    if(!nodeById.has(nodeId))return false;
    if(options.remember!==false&&(state.selected!==nodeId||options.forceHistory))state.navigationStack.push(captureNavigationContext());
    openPath(nodeId,false);state.highlighted=nodeId;dom.panel.classList.add('navigation-target');
    if(state.mode!=='mindmap')renderMindmap();
    selectNode(nodeId);centerMindNode(nodeId);
    if(state.mode==='brain'){buildGraph(nodeId);fitGraph()}
    clearTimeout(highlightTimer);highlightTimer=setTimeout(()=>{dom.panel.classList.remove('navigation-target');if(state.highlighted===nodeId){state.highlighted=null;if(state.mode==='mindmap')renderMindmap()}},1800);
    updateBackButton();setNavigationHash(nodeId);return true;
  }
  function restoreNavigationContext(){
    const context=state.navigationStack.pop();if(!context)return;
    state.expanded=new Set(context.expanded);state.scenarioId=context.scenarioId;state.learningPathId=context.learningPathId;state.learningStepId=context.learningStepId;state.graph.focusId=context.graph.focusId;state.highlighted=context.selected;
    setMode(context.mode);if(context.selected)selectNode(context.selected);else clearDetails();
    state.mind={...state.mind,...context.mind};mindTransform();state.graph={...state.graph,...context.graph};if(state.mode==='brain')drawGraph();
    updateBackButton();if(context.selected)setNavigationHash(context.selected);else try{history.replaceState(null,'',location.pathname+location.search)}catch{}
  }
  window.navigateToNode=navigateToNode;
  function updateDetails(n){
    const classification=classificationById.get(n.id)||{},simple=n.description?.simple||'',technical=n.description?.technical||'',architecture=n.description?.architecture||'',flags=auditFlags(n),scenarioContexts=scenariosByNode.get(n.id)||[],stepContexts=stepsByNode.get(n.id)||[],parent=n.parent&&nodeById.get(n.parent);dom.category.textContent=n.category;dom.category.style.borderColor=color(n);dom.title.textContent=n.title;dom.path.textContent=currentPath(n);dom.audit.hidden=true;
    dom.contextModeActions.hidden=false;dom.contextArchitecture.disabled=!scenarioContexts.length;dom.contextLearning.disabled=!stepContexts.length;for(const [button,mode] of [[dom.contextMindmap,'mindmap'],[dom.contextBrain,'brain'],[dom.contextArchitecture,'architecture'],[dom.contextLearning,'learning']]){button.classList.toggle('active',state.mode===mode);button.setAttribute('aria-current',state.mode===mode?'page':'false')}
    const purpose=n.why_important||simple||`${n.title} ordnet einen bestehenden Azure-Begriff in den Wissenskontext ein.`,children=n.childNodes.slice(0,6);dom.contextSummarySection.hidden=false;dom.contextSummary.innerHTML=`<p>${escapeHtml(truncate(purpose,240))}</p><div class="context-facts">${parent?`<button data-node-id="${escapeHtml(parent.id)}"><small>Gehört zu</small><b>${escapeHtml(parent.title)}</b></button>`:''}<div><small>Unterthemen</small><b>${n.childNodes.length}</b></div><div><small>Direkte Beziehungen</small><b>${n.relations.length}</b></div></div>${children.length?`<div class="context-children"><small>Direkte Unterthemen</small>${children.map(child=>`<button data-node-id="${escapeHtml(child.id)}">${escapeHtml(child.title)}</button>`).join('')}</div>`:''}`;
    dom.contextSummary.querySelectorAll('[data-node-id]').forEach(button=>button.addEventListener('click',()=>navigateToNode(button.dataset.nodeId)));
    dom.simpleSection.hidden=!simple;renderSemanticText(dom.short,simple,n.id);dom.technicalSection.hidden=!technical;renderSemanticText(dom.technical,technical,n.id);dom.architecture.hidden=!architecture;renderSemanticText(dom.architecture,architecture,n.id);dom.architectureContextList.innerHTML=scenarioContexts.map(scenario=>{const decisions=(scenario.architecture_decisions||[]).slice(0,2);return`<article class="architecture-context-card"><span>Referenzarchitektur</span><h3>${escapeHtml(scenario.title)}</h3><p>${escapeHtml(truncate(scenario.architecture_goal||scenario.short_description,220))}</p>${decisions.map(decision=>`<div><b>${escapeHtml(decision.question||'Architekturentscheidung')}</b><small>${escapeHtml(truncate(decision.decision||'',180))}</small></div>`).join('')}<button data-scenario-id="${escapeHtml(scenario.id)}">Szenario öffnen →</button></article>`}).join('');dom.architectureSection.hidden=!architecture&&!scenarioContexts.length;dom.architectureContextList.querySelectorAll('[data-scenario-id]').forEach(button=>button.addEventListener('click',()=>openScenario(button.dataset.scenarioId)));
    dom.whySection.hidden=!n.why_important;renderSemanticText(dom.why,n.why_important||'',n.id);dom.examplesSection.hidden=!n.examples.length;renderSemanticText(dom.examples,n.examples.join('\n\n'),n.id);const memory=[n.merksatz&&`Merksatz: ${n.merksatz}`,n.analogy&&`Analogie: ${n.analogy}`].filter(Boolean);dom.memorySection.hidden=!memory.length;renderSemanticText(dom.memory,memory.join('\n\n'),n.id);
    dom.meta.innerHTML=`<span class="node-id-chip">${escapeHtml(n.id)}</span><span title="${escapeHtml(classification.proposed_target_position||'')}">Ziel: ${escapeHtml(truncate(classification.proposed_target_position||n.category,52))}</span><span>${escapeHtml(n.domain)}</span><span>${escapeHtml(n.metadata?.difficulty||'')}</span>${(n.metadata?.certifications||[]).map(c=>`<span>${escapeHtml(c)}</span>`).join('')}`;
    const saved=userState(n.id);dom.learning.value=saved.status;dom.notes.value=saved.notes;[dom.learningSection,dom.notesSection,dom.actions].forEach(x=>x.hidden=false);
    const relations=n.relations.map(id=>relById.get(id)).filter(Boolean);dom.relationsSection.hidden=!relations.length;dom.relationList.innerHTML=relations.map(r=>{const presentation=relationPresentation(r,n.id),other=nodeById.get(presentation.otherId);return`<button class="relation-item" data-id="${other?.id||''}" data-direction="${presentation.direction}"><b style="color:${escapeHtml(presentation.color)}">${escapeHtml(presentation.label)}</b><span>${escapeHtml(other?.title||'Unbekannter Knoten')}</span><small>${escapeHtml(r.explanation)}</small></button>`}).join('');
    dom.relationList.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>navigateToNode(b.dataset.id)));
    dom.contextSection.hidden=!stepContexts.length;dom.contextList.innerHTML=stepContexts.map(step=>{const path=learningPathById.get(step.path_id),prerequisites=(step.prerequisites||[]).map(id=>learningStepById.get(id)?.title).filter(Boolean),next=(step.next_learning_steps||[]).map(id=>learningStepById.get(id)?.title).filter(Boolean);return`<button class="learning-context-card" data-step-id="${escapeHtml(step.id)}"><span>${escapeHtml(path?.title||'Lernpfad')}</span><b>${escapeHtml(step.title)}</b><small>${prerequisites.length?`Vorher: ${escapeHtml(prerequisites.join(' · '))}`:'Einstieg ohne vorausgesetzten Lernschritt'}</small><small>${next.length?`Danach: ${escapeHtml(next.join(' · '))}`:'Abschluss dieses Lernpfads'}</small></button>`}).join('');
    dom.contextList.querySelectorAll('[data-step-id]').forEach(b=>b.addEventListener('click',()=>openLearningStep(b.dataset.stepId)));
    const sourceIds=new Set(n.sources);relations.forEach(r=>r.sources.forEach(s=>sourceIds.add(s)));const sources=[...sourceIds].map(id=>sourceById.get(id)).filter(Boolean);dom.sourcesSection.hidden=!sources.length;dom.sourceList.innerHTML=sources.map(s=>`<a href="${escapeHtml(s.url)}" target="_blank" rel="noreferrer">${escapeHtml(s.title)} ↗</a>`).join('');
    const qualityRelevant=flags.length||classification.classification&&classification.classification!=='Canonical Node';dom.qualityDetails.hidden=!qualityRelevant||state.mode==='learning';dom.qualityDetails.open=false;dom.qualityContent.innerHTML=qualityRelevant?`<p><b>ID:</b> ${escapeHtml(n.id)}</p><p><b>Status:</b> ${escapeHtml(classification.classification||'Canonical Node')}</p><p><b>Review:</b> ${classification.status==='awaiting_human_review'?'Erforderlich':'Kein offener Strukturreview'}</p>${flags.length?`<p><b>Audit:</b> ${escapeHtml(flags.join(' · '))}</p>`:''}`:'';
    dom.toggle.textContent=state.expanded.has(n.id)?'Ast schließen':'Ast öffnen';dom.toggle.disabled=!n.childNodes.length;dom.showRelations.disabled=!relations.length&&!n.childNodes.length;updateBackButton();
  }
  function clearDetails(){state.selected=null;dom.panel.classList.remove('open');dom.category.textContent='Azure';dom.title.textContent=RELEASE.product_name;dom.path.textContent='Wähle einen Knoten, um Lerninhalt und Zusammenhänge zu sehen.';dom.simpleSection.hidden=false;dom.short.textContent='Vier Perspektiven verbinden hierarchisches Wissen, semantische Beziehungen, Architekturszenarien und geführtes Lernen.';dom.technicalSection.hidden=false;dom.technical.textContent=releaseSummary;dom.meta.innerHTML='';dom.audit.hidden=true;dom.qualityDetails.hidden=true;dom.contextModeActions.hidden=true;dom.semanticChooser.hidden=true;[dom.contextSummarySection,dom.architectureSection,dom.whySection,dom.examplesSection,dom.memorySection,dom.learningSection,dom.relationsSection,dom.contextSection,dom.sourcesSection,dom.notesSection,dom.actions].forEach(x=>x.hidden=true);if(state.mode==='brain')drawGraph();else if(state.mode==='mindmap')renderMindmap()}

  function nodeTitle(id){return nodeById.get(id)?.title||ARCH.referenced_nodes?.[id]?.title||id}
  function scenarioTitle(id){return scenarioById.get(id)?.title||id}
  function openScenario(id){if(!scenarioById.has(id))return;state.scenarioId=id;setMode('architecture')}
  function openLearningStep(id){const step=learningStepById.get(id);if(!step)return;state.learningPathId=step.path_id;state.learningStepId=id;setMode('learning')}
  function listHtml(items){return `<ul>${(items||[]).map(item=>`<li>${escapeHtml(item)}</li>`).join('')}</ul>`}
  function architectureDiagram(scenario){
    const components=new Map((scenario.component_instances||[]).map(c=>[c.instance_id,c])),actors=new Map((scenario.actors||[]).map(a=>[a.id,a])),ids=scenario.diagram?.nodes||[];
    const resolved=ids.map(id=>{const component=components.get(id),actor=actors.get(id);return{id,title:component?.node_ref?nodeTitle(component.node_ref):actor?.label||component?.role?.replaceAll('_',' ')||id,nodeId:component?.node_ref||null,actor:Boolean(actor)}});
    const columns=Math.min(4,Math.max(1,Math.ceil(Math.sqrt(resolved.length)))),cellW=230,cellH=105,width=columns*cellW+30,rows=Math.ceil(resolved.length/columns),height=rows*cellH+60,positions=new Map(resolved.map((item,index)=>[item.id,{x:25+(index%columns)*cellW,y:25+Math.floor(index/columns)*cellH,w:185,h:54}]));
    const edges=(scenario.diagram?.edges||[]).map((edge,index)=>{const a=positions.get(edge.from),b=positions.get(edge.to);if(!a||!b)return'';const x1=a.x+a.w/2,y1=a.y+a.h/2,x2=b.x+b.w/2,y2=b.y+b.h/2,mx=(x1+x2)/2,my=(y1+y2)/2;return`<g><path class="diagram-edge" d="M${x1} ${y1} L${x2} ${y2}" marker-end="url(#arrow-${escapeHtml(scenario.id)})"/><text class="diagram-edge-label" x="${mx}" y="${my-5}" text-anchor="middle">${escapeHtml(edge.label||'')}</text></g>`}).join('');
    const nodes=resolved.map(item=>{const p=positions.get(item.id);return`<g class="diagram-node${item.actor?' actor':''}${item.nodeId?' clickable':''}" transform="translate(${p.x} ${p.y})" ${item.nodeId?`data-node-id="${escapeHtml(item.nodeId)}" role="button" tabindex="0"`:''}><rect width="${p.w}" height="${p.h}" rx="11"/><text x="${p.w/2}" y="${p.h/2+4}" text-anchor="middle">${escapeHtml(truncate(item.title,27))}</text></g>`}).join('');
    return `<svg viewBox="0 0 ${width} ${height}" aria-label="Architekturdiagramm ${escapeHtml(scenario.title)}"><defs><marker id="arrow-${escapeHtml(scenario.id)}" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#5a7d94"/></marker></defs>${edges}${nodes}</svg>`;
  }
  function renderArchitecture(){
    const scenario=scenarioById.get(state.scenarioId)||ARCH.scenarios[0];state.scenarioId=scenario.id;
    dom.scenarioList.innerHTML=ARCH.scenarios.map((item,index)=>`<button class="selection-card${item.id===scenario.id?' active':''}" data-scenario-id="${escapeHtml(item.id)}"><b>${index+1}. ${escapeHtml(item.title)}</b><small>${escapeHtml(truncate(item.short_description,86))}</small></button>`).join('');
    const decisions=(scenario.architecture_decisions||[]).map(item=>`<div class="decision-card"><b>${escapeHtml(item.question||'Entscheidung')}</b><span>${escapeHtml(item.decision||'')}</span>${item.tradeoff?`<span><em>Trade-off:</em> ${escapeHtml(item.tradeoff)}</span>`:''}</div>`).join('');
    const operations=Object.entries(scenario.operations_model||{}).map(([key,value])=>`<div class="decision-card"><b>${escapeHtml(key.replaceAll('_',' '))}</b><span>${escapeHtml(value)}</span></div>`).join('');
    const accordions=[['Architecture Decisions',decisions],['Security',listHtml(scenario.security_considerations)],['Monitoring',listHtml(scenario.monitoring_considerations)],['Reliability',listHtml(scenario.reliability_considerations)],['Costs',listHtml(scenario.cost_considerations)],['Common Mistakes',listHtml(scenario.common_mistakes)],['Operations Model',operations]].map(([title,body],index)=>`<details${index===0?' open':''}><summary>${title}</summary><div class="accordion-body">${body}</div></details>`).join('');
    dom.scenarioContent.innerHTML=`<header class="content-header"><div class="eyebrow">Architecture Scenario · V2.0 Runtime</div><h1>${escapeHtml(scenario.title)}</h1><p class="content-lead">${escapeHtml(scenario.short_description)}</p></header><div class="summary-grid"><div class="info-card"><h2>Architekturziel</h2><p>${escapeHtml(scenario.architecture_goal)}</p></div><div class="info-card"><h2>Enterprise-Beispiel</h2><p>${escapeHtml(scenario.enterprise_example)}</p></div><div class="info-card"><h2>Merksatz</h2><p>${escapeHtml(scenario.merksatz)}</p></div><div class="info-card"><h2>Komponenten</h2><p>${scenario.component_instances.length} Rollen · ${scenario.relationships.length} Szenariobeziehungen</p></div></div><section class="architecture-diagram"><h2>Architekturdiagramm</h2>${architectureDiagram(scenario)}</section><section class="content-section"><h2>Architekturperspektiven</h2><div class="accordion-list">${accordions}</div></section><section class="content-section"><h2>Lernpfad des Szenarios</h2><div class="link-grid">${scenario.learning_path.map(id=>`<button class="node-link" data-node-id="${escapeHtml(id)}">${escapeHtml(nodeTitle(id))}</button>`).join('')}</div></section>`;
    dom.scenarioList.querySelectorAll('[data-scenario-id]').forEach(button=>button.addEventListener('click',()=>{state.scenarioId=button.dataset.scenarioId;renderArchitecture()}));
    dom.scenarioContent.querySelectorAll('[data-node-id]').forEach(button=>{const open=()=>navigateToNode(button.dataset.nodeId);button.addEventListener('click',open);button.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();open()}})});
    dom.visible.textContent=`${ARCH.scenarios.length} Szenarien · ${scenario.component_instances.length} Komponenten im aktuellen Szenario`;
  }
  function pathProgress(path){const completed=path.steps.filter(step=>learningStepState(step.id).status==='completed').length;return{completed,total:path.steps.length,percent:Math.round(completed/path.steps.length*100),next:path.steps.find(step=>learningStepState(step.id).status!=='completed')||path.steps[path.steps.length-1]}}
  function renderLearning(){
    const path=learningPathById.get(state.learningPathId)||LEARNING.learning_paths[0];state.learningPathId=path.id;let step=learningStepById.get(state.learningStepId);if(!step||step.path_id!==path.id){step=pathProgress(path).next;state.learningStepId=step.id}
    const currentState=learningStepState(step.id);currentState.last_opened_at=new Date().toISOString();saveLearningStepState(step.id,currentState);
    dom.learningPathList.innerHTML=LEARNING.learning_paths.map(item=>{const progress=pathProgress(item);return`<button class="selection-card${item.id===path.id?' active':''}" data-path-id="${escapeHtml(item.id)}"><b>${escapeHtml(item.title)}</b><small>${item.steps.length} Schritte · ${progress.percent}% · Nächster: ${escapeHtml(truncate(progress.next.title,46))}</small><div class="progress-track"><i style="width:${progress.percent}%"></i></div></button>`}).join('');
    const progress=pathProgress(path),maturity=maturityById.get(step.maturity_level)||{},prerequisites=(step.prerequisites||[]).map(id=>learningStepById.get(id)).filter(Boolean),next=(step.next_learning_steps||[]).map(id=>learningStepById.get(id)).filter(Boolean);
    const stepList=path.steps.map((item,index)=>{const saved=learningStepState(item.id);return`<button class="step-card${item.id===step.id?' active':''}" data-step-id="${escapeHtml(item.id)}"><span class="step-status ${escapeHtml(saved.status)}"></span><b>${index+1}. ${escapeHtml(item.title)}</b><small>${escapeHtml(maturityById.get(item.maturity_level)?.title||item.maturity_level)}</small></button>`}).join('');
    dom.learningContent.innerHTML=`<header class="content-header"><div class="eyebrow">Architecture Learning · ${path.steps.length} Schritte · ${progress.percent}% abgeschlossen</div><h1>${escapeHtml(path.title)}</h1><p class="content-lead">${escapeHtml(path.goal)} <strong>${escapeHtml(path.outcome)}</strong></p></header><div class="learning-layout"><div class="step-list">${stepList}</div><article class="learning-step"><span class="maturity-badge">Level ${maturity.level} · ${escapeHtml(maturity.title||'')}</span><h2>${escapeHtml(step.title)}</h2><p><strong>Learning Goal:</strong> ${escapeHtml(step.learning_goal)}</p><p>${escapeHtml(step.explanation)}</p><div class="learning-controls"><label>Status<select id="stepProgressStatus"><option value="not-started">Nicht begonnen</option><option value="in-progress">In Bearbeitung</option><option value="completed">Abgeschlossen</option></select></label><label>Verständnislevel<select id="stepUnderstanding">${(LEARNING.maturity_levels||[]).map(item=>`<option value="${item.level}">Level ${item.level} – ${escapeHtml(item.title)}</option>`).join('')}</select></label><label class="full">Persönliche Notiz<textarea id="stepNote" placeholder="Nur lokal in diesem Browser gespeichert …">${escapeHtml(userProfile.notes[step.id]||'')}</textarea></label><label class="full">Zuletzt geöffnet<input value="${escapeHtml(currentState.last_opened_at?new Date(currentState.last_opened_at).toLocaleString('de-DE'):'–')}" readonly></label></div><h3>Voraussetzungen</h3><div class="link-grid">${prerequisites.length?prerequisites.map(item=>`<button class="step-link" data-step-id="${escapeHtml(item.id)}">${escapeHtml(item.title)}</button>`).join(''):'<span class="detail-path">Keine</span>'}</div><h3>Relevante Azure-Knoten</h3><div class="link-grid">${step.referenced_nodes.map(id=>`<button class="node-link" data-node-id="${escapeHtml(id)}">${escapeHtml(nodeTitle(id))}</button>`).join('')}</div><h3>Relevante Architecture Scenarios</h3><div class="link-grid">${step.referenced_scenarios.length?step.referenced_scenarios.map(id=>`<button class="scenario-link" data-scenario-id="${escapeHtml(id)}">${escapeHtml(scenarioTitle(id))}</button>`).join(''):'<span class="detail-path">Keine</span>'}</div><h3>Architecture Questions</h3>${listHtml(step.architecture_questions)}<h3>Empfohlene nächste Schritte</h3><div class="link-grid">${next.length?next.map(item=>`<button class="step-link" data-step-id="${escapeHtml(item.id)}">${escapeHtml(item.title)}</button>`).join(''):'<span class="detail-path">Pfad abgeschlossen</span>'}</div></article></div>`;
    dom.learningPathList.querySelectorAll('[data-path-id]').forEach(button=>button.addEventListener('click',()=>{state.learningPathId=button.dataset.pathId;state.learningStepId=pathProgress(learningPathById.get(state.learningPathId)).next.id;renderLearning()}));
    dom.learningContent.querySelectorAll('[data-step-id]').forEach(button=>button.addEventListener('click',()=>openLearningStep(button.dataset.stepId)));dom.learningContent.querySelectorAll('[data-node-id]').forEach(button=>button.addEventListener('click',()=>navigateToNode(button.dataset.nodeId)));dom.learningContent.querySelectorAll('[data-scenario-id]').forEach(button=>button.addEventListener('click',()=>openScenario(button.dataset.scenarioId)));
    const status=el('stepProgressStatus'),understanding=el('stepUnderstanding'),note=el('stepNote');status.value=currentState.status;understanding.value=String(currentState.understanding_level);status.addEventListener('change',()=>{const value=status.value;saveLearningStepState(step.id,{...learningStepState(step.id),status:value,progress_percent:value==='completed'?100:value==='in-progress'?50:0,completed:value==='completed',last_opened_at:new Date().toISOString(),notes:note.value});renderLearning()});understanding.addEventListener('change',()=>saveLearningStepState(step.id,{...learningStepState(step.id),understanding_level:Number(understanding.value),last_opened_at:new Date().toISOString(),notes:note.value}));note.addEventListener('input',()=>saveLearningStepState(step.id,{...learningStepState(step.id),last_opened_at:new Date().toISOString(),notes:note.value}));
    dom.visible.textContent=`${LEARNING.learning_paths.length} Lernpfade · ${LEARNING.meta.step_count} Schritte · ${progress.percent}% im aktuellen Pfad`;
  }

  function search(query){
    const q=normalizeTerm(query);state.searchMatches.clear();if(q.length<2){dom.results.hidden=true;dom.results.dataset.count='0';if(state.mode==='mindmap')renderMindmap();return}
    const scored=CORE.search(searchRecords,q);scored.slice(0,100).forEach(result=>state.searchMatches.add(result.node.id));
    const results=scored.slice(0,30);dom.results.dataset.count=String(results.length);dom.results.innerHTML=results.map(({node:n,matchType,classification,currentPath:path})=>`<button data-id="${escapeHtml(n.id)}"><span class="search-result-heading"><b>${escapeHtml(n.title)}</b><em>${escapeHtml(matchType)}</em></span><small class="search-result-id">ID: ${escapeHtml(n.id)}</small><small class="search-result-path">Aktueller Pfad: ${escapeHtml(path)}</small><small class="search-result-target">Zielbereich: ${escapeHtml(classification.proposed_target_position||n.category)}</small></button>`).join('')||'<button disabled>Keine Treffer</button>';
    dom.results.hidden=false;dom.results.querySelectorAll('[data-id]').forEach(button=>button.addEventListener('click',()=>{dom.results.hidden=true;dom.search.value='';navigateToNode(button.dataset.id)}));if(state.mode==='mindmap')renderMindmap();
  }

  function zoomMind(factor,x,y){const old=state.mind.scale,next=Math.max(.07,Math.min(2.5,old*factor));state.mind.tx=x-(x-state.mind.tx)*(next/old);state.mind.ty=y-(y-state.mind.ty)*(next/old);state.mind.scale=next;mindTransform()}
  function zoomGraph(factor,x,y){const old=state.graph.scale,next=Math.max(.12,Math.min(4,old*factor));state.graph.tx=x-(x-state.graph.tx)*(next/old);state.graph.ty=y-(y-state.graph.ty)*(next/old);state.graph.scale=next;drawGraph()}
  function pointInStage(e){const r=dom.stage.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}}

  dom.mind.addEventListener('pointerdown',e=>{if(e.target.closest?.('.node'))return;state.mind.drag=true;state.mind.last={x:e.clientX,y:e.clientY};dom.mind.setPointerCapture(e.pointerId)});
  dom.mind.addEventListener('pointermove',e=>{if(!state.mind.drag)return;state.mind.tx+=e.clientX-state.mind.last.x;state.mind.ty+=e.clientY-state.mind.last.y;state.mind.last={x:e.clientX,y:e.clientY};mindTransform()});dom.mind.addEventListener('pointerup',()=>state.mind.drag=false);
  dom.mind.addEventListener('wheel',e=>{e.preventDefault();const p=pointInStage(e);zoomMind(Math.exp(-e.deltaY*.0012),p.x,p.y)},{passive:false});
  dom.brain.addEventListener('pointerdown',e=>{const p=pointInStage(e),hit=graphHit(p.x,p.y);state.graph.drag=true;state.graph.dragNode=hit;state.graph.last={x:e.clientX,y:e.clientY};dom.brain.setPointerCapture(e.pointerId)});
  dom.brain.addEventListener('pointermove',e=>{const p=pointInStage(e);if(state.graph.drag){const dx=(e.clientX-state.graph.last.x)/state.graph.scale,dy=(e.clientY-state.graph.last.y)/state.graph.scale;if(state.graph.dragNode){state.graph.dragNode.x+=dx;state.graph.dragNode.y+=dy}else{state.graph.tx+=e.clientX-state.graph.last.x;state.graph.ty+=e.clientY-state.graph.last.y}state.graph.last={x:e.clientX,y:e.clientY};drawGraph();return}const hit=graphHit(p.x,p.y),edge=hit?null:edgeHit(p.x,p.y);state.graph.hoverNode=hit;state.graph.hoverEdge=edge;if(hit||edge){dom.tooltip.hidden=false;dom.tooltip.style.left=(p.x+14)+'px';dom.tooltip.style.top=(p.y+14)+'px';if(hit)dom.tooltip.innerHTML=`<b>${escapeHtml(hit.title)}</b><br>${escapeHtml(hit.type==='domain'?'Wissensbereich':hit.category)}`;else{const a=nodeById.get(edge.source),b=nodeById.get(edge.target),type=relationTypeById.get(edge.type);dom.tooltip.innerHTML=`<b>${escapeHtml(type?.label||edge.type)}</b><br>${escapeHtml(a?.title)} → ${escapeHtml(b?.title)}<br>${escapeHtml(edge.explanation)}`}}else dom.tooltip.hidden=true});
  dom.brain.addEventListener('pointerup',e=>{const p=pointInStage(e),hit=graphHit(p.x,p.y);if(hit&&hit.type==='knowledge'&&Math.abs(e.clientX-state.graph.last.x)<4&&Math.abs(e.clientY-state.graph.last.y)<4)navigateToNode(hit.id);state.graph.drag=false;state.graph.dragNode=null});dom.brain.addEventListener('pointerleave',()=>{state.graph.drag=false;dom.tooltip.hidden=true});
  dom.brain.addEventListener('dblclick',e=>{const p=pointInStage(e),hit=graphHit(p.x,p.y);if(hit?.type==='knowledge'){selectNode(hit.id);buildGraph(hit.id);fitGraph()}});dom.brain.addEventListener('wheel',e=>{e.preventDefault();const p=pointInStage(e);zoomGraph(Math.exp(-e.deltaY*.0012),p.x,p.y)},{passive:false});

  dom.mindMode.addEventListener('click',()=>setMode('mindmap'));dom.brainMode.addEventListener('click',()=>setMode('brain'));dom.architectureMode.addEventListener('click',()=>setMode('architecture'));dom.learningMode.addEventListener('click',()=>setMode('learning'));dom.expandAll.addEventListener('click',expandAll);dom.collapse.addEventListener('click',collapseAll);dom.focus.addEventListener('click',()=>{buildGraph(null);fitGraph()});
  dom.fit.addEventListener('click',()=>state.mode==='brain'?fitGraph():fitMindmap());dom.zoomIn.addEventListener('click',()=>{const r=dom.stage.getBoundingClientRect();state.mode==='brain'?zoomGraph(1.2,r.width/2,r.height/2):zoomMind(1.2,r.width/2,r.height/2)});dom.zoomOut.addEventListener('click',()=>{const r=dom.stage.getBoundingClientRect();state.mode==='brain'?zoomGraph(.82,r.width/2,r.height/2):zoomMind(.82,r.width/2,r.height/2)});
  dom.search.addEventListener('input',()=>search(dom.search.value));dom.search.addEventListener('keydown',e=>{if(e.key==='Escape'){dom.search.value='';search('');dom.search.blur()}else if(e.key==='Enter'){const first=dom.results.querySelector('[data-id]');if(first){e.preventDefault();first.click()}}});document.addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();dom.search.focus()}else if((e.metaKey||e.altKey)&&e.key==='ArrowLeft'&&state.navigationStack.length){e.preventDefault();restoreNavigationContext()}});document.addEventListener('click',e=>{if(!e.target.closest('.search-box'))dom.results.hidden=true});
  dom.panel.addEventListener('click',event=>{const link=event.target.closest('.semantic-link');if(!link)return;const ids=link.dataset.targetIds.split(',').filter(Boolean);if(ids.length===1)navigateToNode(ids[0]);else openSemanticChooser(link.dataset.term,ids)});
  dom.closeSemanticChooser.addEventListener('click',()=>dom.semanticChooser.hidden=true);dom.contextMindmap.addEventListener('click',()=>{if(state.selected)setMode('mindmap')});dom.contextBrain.addEventListener('click',()=>{if(state.selected)setMode('brain')});dom.contextArchitecture.addEventListener('click',()=>{const scenario=(scenariosByNode.get(state.selected)||[])[0];if(scenario)openScenario(scenario.id)});dom.contextLearning.addEventListener('click',()=>{const step=(stepsByNode.get(state.selected)||[])[0];if(step)openLearningStep(step.id)});
  dom.back.addEventListener('click',restoreNavigationContext);dom.close.addEventListener('click',clearDetails);dom.toggle.addEventListener('click',()=>{if(state.selected)toggleBranch(state.selected)});dom.showRelations.addEventListener('click',()=>{if(state.selected)setMode('brain')});
  dom.learning.addEventListener('change',()=>{if(!state.selected)return;const s=userState(state.selected);s.status=dom.learning.value;saveUserState(state.selected,s)});dom.notes.addEventListener('input',()=>{if(!state.selected)return;const s=userState(state.selected);s.notes=dom.notes.value;saveUserState(state.selected,s)});
  dom.exportProfile.addEventListener('click',exportProfile);dom.importProfile.addEventListener('click',()=>dom.profileFile.click());dom.profileFile.addEventListener('change',()=>{const file=dom.profileFile.files?.[0];if(file)importProfileFile(file);dom.profileFile.value=''});
  window.addEventListener('resize',()=>{if(state.mode==='brain'){resizeBrain();fitGraph()}else if(state.mode==='mindmap')fitMindmap()});

  renderMindmap();requestAnimationFrame(()=>{fitMindmap();const parameters=new URLSearchParams(location.hash.slice(1)),mode=parameters.get('mode'),nodeId=parameters.get('node');if(['mindmap','brain','architecture','learning'].includes(mode))setMode(mode);if(nodeId)navigateToNode(nodeId,{remember:false})});
})();
