import {execFileSync} from 'node:child_process';
import {readFile,writeFile,stat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve,dirname} from 'node:path';
const root='docs/review/l5-design-direction';
const changed=execFileSync('git',['diff','--name-only','ff9dabf'],{encoding:'utf8'}).trim().split(/\r?\n/).filter(Boolean);
const prohibited=changed.filter(f=>f!=='docs/STATE.md'&&!f.startsWith(`${root}/`));
const report={base:'ff9dabf',checkedAt:new Date().toISOString(),trackedChanges:changed,unexpectedChanges:prohibited,documentLinks:0,assets:[],contrast:[],errors:[]};
for(const file of ['README.md','REPOSITORIES.md','IMPLEMENTATION-PLAN.md','index.html']){
 const text=await readFile(`${root}/${file}`,'utf8');
 const links=file.endsWith('.html')?[...text.matchAll(/(?:href|src)="([^"]+)"/g)].map(m=>m[1]):[...text.matchAll(/\]\(([^)]+)\)/g)].map(m=>m[1]);
 for(const link of links){if(/^(https?:|#)/.test(link))continue;const local=resolve(dirname(`${root}/${file}`),link.split(/[?#]/)[0]);if(local.endsWith('consistency.json'))continue;try{await stat(local);report.documentLinks++;}catch{report.errors.push(`Missing ${file}: ${link}`);}}
}
for(const name of ['interior-l4-classic.glb','interior-l4-diamond.glb','interior-l4-perforated.glb','interior-l2b.glb']){
 const path=`public/assets/3d/lexus-rx350/${name}`;
 try{const bytes=await readFile(path);const gitBlob=execFileSync('git',['hash-object',path],{encoding:'utf8'}).trim();const baseBlob=execFileSync('git',['rev-parse',`ff9dabf:${path}`],{encoding:'utf8'}).trim();report.assets.push({path,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex'),unchanged:gitBlob===baseBlob});if(gitBlob!==baseBlob)report.errors.push(`Changed asset ${name}`);}catch(e){report.errors.push(`${name}: ${e.message}`);}
}
const lum=hex=>{const rgb=hex.match(/[a-f\d]{2}/gi).map(c=>parseInt(c,16)/255).map(n=>n<=.04045?n/12.92:((n+.055)/1.055)**2.4);return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;};
for(const [foreground,background] of [['242724','f4f0e8'],['60635e','f4f0e8'],['00647b','f4f0e8'],['38b6ff','101115']]){const a=lum(foreground),b=lum(background);const ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);report.contrast.push({foreground,background,ratio:Number(ratio.toFixed(2)),normalText:ratio>=4.5});}
report.stateLines=(await readFile('docs/STATE.md','utf8')).trimEnd().split(/\r?\n/).length;
if(report.stateLines>20)report.errors.push('STATE exceeds 20 lines');
if(prohibited.length)report.errors.push('Unexpected tracked changes');
await writeFile(`${root}/evidence/consistency.json`,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));if(report.errors.length)process.exitCode=1;
