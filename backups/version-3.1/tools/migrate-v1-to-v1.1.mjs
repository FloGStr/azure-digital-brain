import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const legacyData = path.join(project, 'backups/version-1.0/data');
const canonical = path.join(project, 'data/canonical');
const targetNodes = path.join(canonical, 'nodes.json');

if (fs.existsSync(targetNodes)) {
  throw new Error('Migration abgebrochen: Die kanonische Wissensbasis existiert bereits und wird niemals automatisch überschrieben.');
}

const legacyKb = JSON.parse(fs.readFileSync(path.join(legacyData, 'knowledge-base.json'), 'utf8'));
const legacyRelations = JSON.parse(fs.readFileSync(path.join(legacyData, 'relations.json'), 'utf8'));
const legacySources = JSON.parse(fs.readFileSync(path.join(legacyData, 'sources.json'), 'utf8'));
const migratedAt = '2026-08-11';

const relationTypes = [
  { id:'contains', label:'enthält', inverse_type:'part_of', inverse_label:'ist Teil von', description:'Ein Wissensobjekt enthält ein anderes als strukturellen oder fachlichen Bestandteil.', color:'#8ea6bd', priority:70, symmetric:false },
  { id:'part_of', label:'ist Teil von', inverse_type:'contains', inverse_label:'enthält', description:'Ein Wissensobjekt ist Bestandteil eines übergeordneten Konzepts.', color:'#8ea6bd', priority:70, symmetric:false },
  { id:'depends_on', label:'hängt ab von', inverse_type:'depended_on_by', inverse_label:'ist Abhängigkeit für', description:'Die Funktionsfähigkeit oder Ausgestaltung des Quellobjekts hängt vom Zielobjekt ab.', color:'#ffb454', priority:90, symmetric:false },
  { id:'depended_on_by', label:'ist Abhängigkeit für', inverse_type:'depends_on', inverse_label:'hängt ab von', description:'Das Quellobjekt ist eine Abhängigkeit des verbundenen Zielobjekts.', color:'#ffb454', priority:90, symmetric:false },
  { id:'requires', label:'benötigt', inverse_type:'required_by', inverse_label:'wird benötigt von', description:'Das Quellobjekt benötigt das Zielobjekt für die beschriebene Funktion.', color:'#ffc266', priority:95, symmetric:false },
  { id:'required_by', label:'wird benötigt von', inverse_type:'requires', inverse_label:'benötigt', description:'Das Quellobjekt wird vom Zielobjekt benötigt.', color:'#ffc266', priority:95, symmetric:false },
  { id:'uses', label:'verwendet', inverse_type:'used_by', inverse_label:'wird verwendet von', description:'Ein Service verwendet eine Ressource, Technologie oder Funktion.', color:'#52c7ff', priority:80, symmetric:false },
  { id:'used_by', label:'wird verwendet von', inverse_type:'uses', inverse_label:'verwendet', description:'Eine Ressource oder Technologie wird vom verbundenen Service verwendet.', color:'#52c7ff', priority:80, symmetric:false },
  { id:'secures', label:'schützt', inverse_type:'secured_by', inverse_label:'wird geschützt durch', description:'Ein Objekt schützt den Zugriff, die Daten oder den Betrieb eines anderen Objekts.', color:'#ff5f73', priority:100, symmetric:false },
  { id:'secured_by', label:'wird geschützt durch', inverse_type:'secures', inverse_label:'schützt', description:'Das Objekt wird durch die verbundene Sicherheitsfunktion geschützt.', color:'#ff5f73', priority:100, symmetric:false },
  { id:'connects_to', label:'verbindet mit', inverse_type:'connects_to', inverse_label:'verbindet mit', description:'Zwei Dienste oder Netzwerkbereiche werden miteinander verbunden.', color:'#43a6ff', priority:90, symmetric:true },
  { id:'routes_to', label:'leitet weiter an', inverse_type:'receives_from', inverse_label:'empfängt von', description:'Anfragen oder Datenverkehr werden an das Ziel weitergeleitet.', color:'#55d9d0', priority:85, symmetric:false },
  { id:'receives_from', label:'empfängt von', inverse_type:'routes_to', inverse_label:'leitet weiter an', description:'Anfragen oder Datenverkehr werden vom verbundenen Objekt empfangen.', color:'#55d9d0', priority:85, symmetric:false },
  { id:'replaces', label:'ersetzt', inverse_type:'replaced_by', inverse_label:'wird ersetzt durch', description:'Das Quellobjekt ist der fachliche oder technische Nachfolger des Ziels.', color:'#a889ff', priority:75, symmetric:false },
  { id:'replaced_by', label:'wird ersetzt durch', inverse_type:'replaces', inverse_label:'ersetzt', description:'Das Quellobjekt wird durch das Ziel abgelöst.', color:'#a889ff', priority:75, symmetric:false },
  { id:'alternative_to', label:'ist Alternative zu', inverse_type:'alternative_to', inverse_label:'ist Alternative zu', description:'Die verbundenen Objekte lösen ähnliche Anforderungen mit unterschiedlichen Eigenschaften.', color:'#f3ce58', priority:65, symmetric:true },
  { id:'monitors', label:'überwacht', inverse_type:'monitored_by', inverse_label:'wird überwacht durch', description:'Das Quellobjekt erfasst oder bewertet Signale des Zielobjekts.', color:'#ff9c54', priority:80, symmetric:false },
  { id:'monitored_by', label:'wird überwacht durch', inverse_type:'monitors', inverse_label:'überwacht', description:'Das Objekt wird durch den verbundenen Monitoringdienst überwacht.', color:'#ff9c54', priority:80, symmetric:false },
  { id:'deploys', label:'stellt bereit', inverse_type:'deployed_by', inverse_label:'wird bereitgestellt durch', description:'Das Quellobjekt stellt das Zielobjekt bereit.', color:'#b38cff', priority:75, symmetric:false },
  { id:'deployed_by', label:'wird bereitgestellt durch', inverse_type:'deploys', inverse_label:'stellt bereit', description:'Das Objekt wird durch das verbundene Werkzeug bereitgestellt.', color:'#b38cff', priority:75, symmetric:false },
  { id:'governs', label:'steuert', inverse_type:'governed_by', inverse_label:'wird gesteuert durch', description:'Regeln oder Berechtigungen des Quellobjekts steuern das Zielobjekt.', color:'#ff7e88', priority:90, symmetric:false },
  { id:'governed_by', label:'wird gesteuert durch', inverse_type:'governs', inverse_label:'steuert', description:'Das Objekt unterliegt Regeln oder Berechtigungen des verbundenen Objekts.', color:'#ff7e88', priority:90, symmetric:false },
  { id:'integrates_with', label:'integriert mit', inverse_type:'integrates_with', inverse_label:'integriert mit', description:'Die Dienste tauschen Funktionen oder Daten in einer gemeinsamen Lösung aus.', color:'#51e1bf', priority:70, symmetric:true },
  { id:'triggers', label:'löst aus', inverse_type:'triggered_by', inverse_label:'wird ausgelöst durch', description:'Ein Ereignis des Quellobjekts startet eine Aktion im Zielobjekt.', color:'#68d391', priority:85, symmetric:false },
  { id:'triggered_by', label:'wird ausgelöst durch', inverse_type:'triggers', inverse_label:'löst aus', description:'Das Objekt wird durch ein Ereignis des verbundenen Objekts ausgelöst.', color:'#68d391', priority:85, symmetric:false },
  { id:'similar_to', label:'ist ähnlich zu', inverse_type:'similar_to', inverse_label:'ist ähnlich zu', description:'Die verbundenen Konzepte besitzen wesentliche fachliche Gemeinsamkeiten.', color:'#9aaabd', priority:45, symmetric:true }
];

const typeMap = {
  'gesichert-durch':'secured_by', 'verbindet-mit':'connects_to', 'abhängig-von':'depends_on',
  'leitet-an':'routes_to', 'ähnlich-zu':'similar_to', 'alternativ-zu':'alternative_to',
  'steuert':'governs', 'bereitgestellt-durch':'deployed_by', 'verwendet':'uses',
  'überwacht-durch':'monitored_by', 'Teil-von':'part_of', 'integriert-mit':'integrates_with', 'löst-aus':'triggers'
};
const registry = new Map(relationTypes.map(type => [type.id, type]));

const nodes = legacyKb.nodes.map(node => {
  const originalText = node.original?.text ?? node.full_content ?? '';
  const short = node.short_description || (originalText !== node.title && originalText.length <= 240 ? originalText : '');
  return {
    schema_version:'1.1',
    id:node.id,
    title:node.title,
    domain:'Azure',
    category:node.category,
    subcategory:node.sub_category || '',
    description:{ simple:short, technical:originalText, architecture:'' },
    why_important:'',
    parent:node.parent,
    children:[...node.children],
    tags:[...node.tags],
    aliases:[...node.aliases],
    relations:[...node.relations],
    examples:[...node.examples],
    merksatz:node.merksatz || '',
    analogy:node.analogy || '',
    sources:[...node.sources],
    metadata:{
      difficulty:node.difficulty,
      importance:node.importance,
      status:'published',
      certifications:[...node.certifications],
      audit_flags:[...node.audit_flags]
    },
    origin:node.origin,
    created_at:node.created_at,
    updated_at:migratedAt,
    legacy:{
      original_title:node.original_title,
      current_name:node.current_name,
      main_branch:node.main_branch,
      original:node.original,
      migrated_from_data_format:'2'
    }
  };
});

const relations = legacyRelations.relations.map(relation => {
  const privateDnsCorrection = relation.id === 'rel-003';
  const type = privateDnsCorrection ? 'requires' : (typeMap[relation.type] || relation.type);
  const definition = registry.get(type);
  return {
    schema_version:'1.1',
    id:relation.id,
    source:privateDnsCorrection ? relation.target : relation.source,
    target:privateDnsCorrection ? relation.source : relation.target,
    type,
    inverse_type:definition?.inverse_type || type,
    explanation:relation.explanation,
    sources:[...relation.sources],
    confidence:Number(relation.confidence),
    status:'accepted',
    created_by:relation.origin,
    created_at:relation.created_at,
    reviewed_at:null,
    legacy_type:relation.type
  };
});

const nodeDocument = {
  meta:{ schema_version:'1.1', title:'Azure Digital Brain – Canonical Nodes', node_count:nodes.length, migrated_at:migratedAt, source:'version-1.0', canonical:true },
  nodes
};
const relationDocument = {
  meta:{ schema_version:'1.1', title:'Azure Digital Brain – Canonical Relations', relation_count:relations.length, migrated_at:migratedAt, canonical:true },
  relations
};
const sourceDocument = {
  meta:{ ...legacySources.meta, schema_version:'1.1', canonical:true, migrated_at:migratedAt },
  sources:legacySources.sources
};
const typeDocument = {
  meta:{ schema_version:'1.1', title:'Semantic Relation Type Registry', type_count:relationTypes.length, canonical:true, updated_at:migratedAt },
  relation_types:relationTypes
};

fs.mkdirSync(canonical, { recursive:true });
fs.writeFileSync(targetNodes, JSON.stringify(nodeDocument, null, 2) + '\n');
fs.writeFileSync(path.join(canonical, 'relations.json'), JSON.stringify(relationDocument, null, 2) + '\n');
fs.writeFileSync(path.join(canonical, 'sources.json'), JSON.stringify(sourceDocument, null, 2) + '\n');
fs.writeFileSync(path.join(canonical, 'relation-types.json'), JSON.stringify(typeDocument, null, 2) + '\n');

console.log(JSON.stringify({ nodes:nodes.length, relations:relations.length, sources:sourceDocument.sources.length, relation_types:relationTypes.length }, null, 2));
