(function(root){
  'use strict';

  function normalizeTerm(value){return String(value||'').normalize('NFKC').toLocaleLowerCase('de-DE').replace(/\s+/g,' ').trim()}
  function isWordCharacter(char){return Boolean(char&&/[\p{L}\p{N}_-]/u.test(char))}

  function buildTermIndex(nodes,overlayAliases=[]){
    const terms=new Map();
    const nodeIds=new Set(nodes.map(node=>node.id));
    function add(term,nodeId,type='standard'){
      const normalized=normalizeTerm(term);if(!nodeIds.has(nodeId)||normalized.length<2)return;
      if(!terms.has(normalized))terms.set(normalized,{term:String(term),candidates:new Map()});
      const entry=terms.get(normalized),existing=entry.candidates.get(nodeId);if(!existing||type==='historical')entry.candidates.set(nodeId,{nodeId,type});
    }
    for(const node of nodes){
      add(node.title,node.id,'standard');
      for(const alias of node.aliases||[])add(alias,node.id,'standard');
      if(node.legacy?.current_name)add(node.legacy.current_name,node.id,'historical');
    }
    for(const alias of overlayAliases)add(alias.term,alias.target_node_id,alias.alias_type==='historical'?'historical':'standard');
    return[...terms.entries()].filter(([term])=>term.length>=4||/^[a-z0-9]{2,5}$/.test(term)).map(([term,entry])=>[term,{term:entry.term,candidates:[...entry.candidates.values()]}]).sort((a,b)=>b[0].length-a[0].length);
  }

  function findSemanticMatches(text,sourceNodeId,matcher){
    const original=String(text||''),normalized=original.toLocaleLowerCase('de-DE'),matches=[];
    for(const [term,entry] of matcher){
      let start=0;while((start=normalized.indexOf(term,start))!==-1){
        const end=start+term.length;if(!isWordCharacter(normalized[start-1])&&!isWordCharacter(normalized[end])){
          const candidates=entry.candidates.filter(candidate=>candidate.nodeId!==sourceNodeId);
          if(candidates.length&&!matches.some(match=>start<match.end&&end>match.start))matches.push({start,end,term:original.slice(start,end),candidates});
        }start=end;
      }
    }
    return matches.sort((a,b)=>a.start-b.start||b.end-a.end);
  }

  function buildSearchRecords(nodes,overlayAliases=[],classifications=[],pathResolver=()=> ''){
    const aliasesByNode=new Map();for(const alias of overlayAliases){if(!aliasesByNode.has(alias.target_node_id))aliasesByNode.set(alias.target_node_id,[]);aliasesByNode.get(alias.target_node_id).push(alias)}
    const classificationById=new Map(classifications.map(item=>[item.node_id,item]));
    return nodes.map(node=>{
      const overlay=aliasesByNode.get(node.id)||[],classification=classificationById.get(node.id)||{};
      const historicalAliases=[...overlay.filter(alias=>alias.alias_type==='historical').map(alias=>normalizeTerm(alias.term)),normalizeTerm(node.legacy?.current_name)].filter(Boolean),historicalSet=new Set(historicalAliases);
      return{node,classification,currentPath:pathResolver(node),id:normalizeTerm(node.id),title:normalizeTerm(node.title),aliases:(node.aliases||[]).map(normalizeTerm).filter(alias=>!historicalSet.has(alias)),standardAliases:overlay.filter(alias=>alias.alias_type!=='historical').map(alias=>normalizeTerm(alias.term)),historicalAliases,tags:(node.tags||[]).map(normalizeTerm),body:normalizeTerm([node.description?.simple,node.description?.technical,node.description?.architecture,node.why_important,(node.examples||[]).join(' '),node.merksatz,node.analogy].join(' '))};
    });
  }

  function search(records,query){
    const q=normalizeTerm(query);if(q.length<2)return[];const tokens=q.split(/\s+/),results=[];
    for(const record of records){
      const hay=[record.id,record.title,...record.aliases,...record.standardAliases,...record.historicalAliases,...record.tags,record.body].join(' ');if(!tokens.every(token=>hay.includes(token)))continue;
      let score=0,matchType='Erklärungstext';
      if(record.id===q){score=1200;matchType='Exakte Node-ID'}else if(record.id.startsWith(q)){score=1080;matchType='Node-ID'}else if(record.title===q){score=1000;matchType='Exakter Titel'}else if(record.standardAliases.includes(q)||record.aliases.includes(q)){score=900;matchType='Alias'}else if(record.historicalAliases.includes(q)){score=850;matchType='Historischer Begriff'}else if(record.title.startsWith(q)){score=780;matchType='Titel'}else if(record.title.includes(q)){score=720;matchType='Titel'}else if([...record.standardAliases,...record.aliases].some(alias=>alias.includes(q))){score=680;matchType='Alias'}else if(record.historicalAliases.some(alias=>alias.includes(q))){score=650;matchType='Historischer Begriff'}else if(record.tags.some(tag=>tag===q)){score=600;matchType='Tag'}else if(record.tags.some(tag=>tag.includes(q))){score=520;matchType='Tag'}else{score=200;matchType='Erklärungstext'}
      results.push({...record,score,matchType});
    }
    return results.sort((a,b)=>b.score-a.score||Number(a.node.legacy?.original?.depth||0)-Number(b.node.legacy?.original?.depth||0)||a.node.title.localeCompare(b.node.title,'de'));
  }

  function buildContextNeighborhood(nodes,relations,focusId,options={}){
    const byId=new Map(nodes.map(node=>[node.id,node])),target=byId.get(focusId),maxNodes=Number(options.maxNodes||80),childLimit=Number(options.childLimit||18),include=new Set(),firstHop=new Set(),relationEdges=[];
    if(!target)return{focusId:null,include:[],firstHop:[],secondHop:[],relationEdges:[],hierarchyEdges:[]};
    include.add(focusId);if(target.parent&&byId.has(target.parent)){include.add(target.parent);firstHop.add(target.parent)}
    for(const childId of (target.children||[]).slice(0,childLimit))if(byId.has(childId)){include.add(childId);firstHop.add(childId)}
    for(const relation of relations)if(relation.source===focusId||relation.target===focusId){const other=relation.source===focusId?relation.target:relation.source;if(byId.has(other)){include.add(other);firstHop.add(other);relationEdges.push(relation)}}
    for(const id of [...firstHop])for(const relation of relations){if(include.size>=maxNodes)break;if(relation.source===id||relation.target===id){const other=relation.source===id?relation.target:relation.source;if(other!==focusId&&byId.has(other))include.add(other)}}
    const hierarchyEdges=[];if(target.parent&&include.has(target.parent))hierarchyEdges.push({source:target.parent,target:focusId,label:'gehört zu'});for(const childId of target.children||[])if(include.has(childId))hierarchyEdges.push({source:focusId,target:childId,label:'enthält'});
    return{focusId,include:[...include],firstHop:[...firstHop],secondHop:[...include].filter(id=>id!==focusId&&!firstHop.has(id)),relationEdges,hierarchyEdges};
  }

  root.AzureSemanticNavigationCore={normalizeTerm,buildTermIndex,findSemanticMatches,buildSearchRecords,search,buildContextNeighborhood};
})(typeof globalThis!=='undefined'?globalThis:window);
