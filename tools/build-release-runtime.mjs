import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const project=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const canonical=path.join(project,'data/canonical');
const runtime=path.join(project,'data/runtime');
const read=name=>JSON.parse(fs.readFileSync(path.join(canonical,name),'utf8'));
const release=read('release.json');
const nodes=read('nodes.json');
const relations=read('relations.json');
const scenarios=read('scenarios.json');
const learning=read('learning-framework.json');
const expected={node_count:nodes.nodes.length,relation_count:relations.relations.length,scenario_count:scenarios.scenarios.length,learning_path_count:learning.learning_paths.length};
for(const [key,value] of Object.entries(expected))if(release[key]!==value)throw new Error(`${key}: Release-Metadaten ${release[key]} stimmen nicht mit ${value} überein.`);
if(release.release_version!=='2.4'||release.operating_mode!=='Local'||release.offline_capable!==true)throw new Error('Release-Version oder lokaler Betriebsmodus ungültig.');
fs.mkdirSync(runtime,{recursive:true});
fs.writeFileSync(path.join(runtime,'release-runtime.js'),`window.AZURE_DIGITAL_BRAIN_RELEASE = ${JSON.stringify(release,null,2)};\n`);
console.log(JSON.stringify(release,null,2));
