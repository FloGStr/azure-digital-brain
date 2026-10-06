/* Pure, case-scoped decision evaluation. No Brain mutations, persistence or external calls. */
(function(root){
'use strict';
const clone=x=>JSON.parse(JSON.stringify(x));
const statusText={ready:'Entscheidungsreif',partial:'Teilweise entscheidungsreif',blocked:'Nicht entscheidungsreif',review:'Fachprüfung erforderlich'};
function create(data){
 const questions=new Map(data.questions.map(q=>[q.id,q]));
 const state={answers:Object.fromEntries(data.questions.map(q=>[q.id,clone(q.initialAnswer)])),decisions:Object.fromEntries(data.initialDecisions.map(d=>[d.areaId,clone(d)]))};
 function resolved(q){const a=state.answers[q.id];return q.kind==='specialist'?a.type==='specialist_review'&&a.reviewStatus==='completed'&&!!a.value.trim()&&!!a.reviewer.trim()&&!!a.evidence.trim():a.type==='fact'&&!!a.value.trim()&&!!a.evidence.trim()&&(q.kind!=='assessment'||a.verdict!=='unknown');}
 function applicable(q,areaId){return !q.optionId||q.optionId===state.decisions[areaId].optionId;}
 function area(id){
  const definition=data.areas.find(a=>a.id===id);if(!definition)throw Error('Unknown decision area');
  const all=data.questions.filter(q=>q.areaId===id&&applicable(q,id));const pending=all.filter(q=>!resolved(q));
  const specialist=pending.filter(q=>q.impact==='specialist');const blocking=pending.filter(q=>q.impact==='blocking');const notes=pending.filter(q=>q.impact==='non_blocking');
  const incompatible=all.filter(q=>q.kind==='assessment'&&resolved(q)&&state.answers[q.id].verdict==='unsuitable');
  const essential=pending.filter(q=>q.requiredForEvaluation);const status=specialist.length?'review':essential.length||incompatible.length?'blocked':blocking.length?'partial':'ready';
  const reason=status==='review'?'Die zuständige Fachstelle muss ihre Prüfung und technischen Vorgaben dokumentieren.':incompatible.length?'Eine dokumentierte Eignungsprüfung spricht gegen die vorgeschlagene Option.':status==='blocked'?'Eine Grundlage für eine belastbare Bewertung fehlt.':status==='partial'?'Eine vorläufige Bewertung ist möglich; die Bestätigung bleibt durch offene oder angenommene Angaben blockiert.':'Die festgelegten Kriterien dieses Demo-Modells sind geklärt. Eine Entscheidung benötigt weiterhin eine ausdrückliche Bestätigung.';
  return {id,label:definition.label,status,labelStatus:statusText[status],reason,blocking,specialist,notes,incompatible,pending,next:specialist[0]?.prompt||essential[0]?.prompt||incompatible[0]?.prompt||blocking[0]?.prompt||notes[0]?.prompt||'Bewertung fachlich prüfen und Entscheidung ausdrücklich dokumentieren.',known:all.filter(resolved).length,total:all.length};
 }
 function fingerprint(id){const dependentIds=id==='compute'?data.areas.map(a=>a.id):[id];return JSON.stringify({option:state.decisions[id].optionId,answers:dependentIds.flatMap(areaId=>data.questions.filter(q=>q.areaId===areaId&&applicable(q,areaId)).map(q=>[q.id,state.answers[q.id]]))});}
 function canConfirm(id){return area(id).status==='ready'&&(id!=='compute'||data.areas.every(a=>area(a.id).status==='ready'));}
 function decision(id){const d=state.decisions[id];const valid=d.status==='confirmed'&&canConfirm(id)&&d.confirmedFingerprint===fingerprint(id);return {...d,status:valid?'confirmed':d.status==='confirmed'?'needs_review':'recommendation',readiness:area(id),canConfirm:canConfirm(id),rationale:d.rationaleIds.map(qid=>({question:questions.get(qid),answer:state.answers[qid]}))};}
 function updateAnswer(id,patch){const q=questions.get(id);if(!q)throw Error('Unknown question');const allowed=q.kind==='specialist'?['specialist_review']:['fact','assumption','open_question'];if(!allowed.includes(patch.type))throw Error('Invalid information type');
  const answer={type:patch.type,value:String(patch.value||'').trim(),evidence:String(patch.evidence||'').trim(),reviewer:String(patch.reviewer||'').trim(),origin:'local_demo',verdict:['suitable','unsuitable','unknown'].includes(patch.verdict)?patch.verdict:'unknown',reviewStatus:patch.reviewStatus==='completed'?'completed':'open'};
  if((answer.type==='fact'||answer.reviewStatus==='completed')&&(!answer.value||!answer.evidence))throw Error('Antwort und Nachweis sind erforderlich.');
  if(answer.reviewStatus==='completed'&&!answer.reviewer)throw Error('Zuständige Fachstelle angeben.');
  if(answer.type==='fact'&&q.kind==='assessment'&&answer.verdict==='unknown')throw Error('Eignung ausdrücklich bewerten.');
  state.answers[id]=answer;return area(q.areaId);
 }
 function selectOption(id){if(!data.options.some(o=>o.id===id))throw Error('Unknown option');const d=state.decisions.compute;d.optionId=id;d.status='recommendation';d.evidence='';d.confirmedFingerprint=null;d.rationaleIds=data.options.find(o=>o.id===id).rationaleIds;}
 function confirm(id,evidence){if(id==='privacy')throw Error('Fachprüfung wird dokumentiert, nicht durch das Tool rechtlich entschieden.');if(!canConfirm(id))throw Error('Offene Entscheidungsbedingungen verhindern die Bestätigung.');if(!String(evidence).trim())throw Error('Entscheidungsbegründung erforderlich.');const d=state.decisions[id];d.status='confirmed';d.evidence=String(evidence).trim();d.confirmedFingerprint=fingerprint(id);}
 function component(id){const c=data.components.find(c=>c.id===id);const a=area(c.areaId),d=decision(c.areaId);const source=questions.get(c.rationaleQuestionId);
  let status=c.initialStatus;
  if(c.id==='entra')status=resolved(source)?'confirmed':'open';
  else if(c.id==='app'&&state.decisions.compute.optionId!=='app')status='optional';
  else if(a.status==='blocked'||a.status==='review')status='open';
  else if(d.status==='confirmed')status='confirmed';
  return {...c,status,readiness:a,decision:d,rationale:{question:source,answer:state.answers[source.id]}};
 }
 function review(id){const check=data.reviewChecks.find(c=>c.id===id);const areas=check.areaIds.map(area);const pending=areas.flatMap(a=>[...a.pending,...a.incompatible]);return {...check,status:areas.some(a=>a.status==='review')?'review':pending.length?'partial':'ready',pending:[...new Map(pending.map(q=>[q.id,q])).values()],reason:areas.some(a=>a.status==='review')?'Eine zuständige Fachprüfung ist offen; weitere Case-Prüfpunkte bleiben separat sichtbar.':pending.length?'Zugehörige Case-Prüfpunkte sind noch offen.':'Case-Prüfpunkte dokumentiert; kein automatisches Bestehen des WAF-Quality-Gate.'};}
 function reset(){const next=create(data);state.answers=next.state.answers;state.decisions=next.state.decisions;}
 return {data,state,questions,resolved,area,decision,component,review,updateAnswer,selectOption,confirm,reset,summary(){const areas=data.areas.map(a=>area(a.id));return {areas,status:areas.some(a=>a.status==='review')?'review':areas.some(a=>a.status==='blocked')?'blocked':areas.some(a=>a.status==='partial')?'partial':'ready'};}};
}
root.ADB_DECISION_MODEL_V1={create,statusText};
})(typeof window!=='undefined'?window:globalThis);
