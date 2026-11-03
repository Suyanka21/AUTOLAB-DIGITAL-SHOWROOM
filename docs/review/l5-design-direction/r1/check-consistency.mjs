import {execFileSync} from 'node:child_process';
import {readFile,writeFile,readdir,stat} from 'node:fs/promises';
import {resolve,dirname,relative} from 'node:path';
import {createHash} from 'node:crypto';
const root='docs/review/l5-design-direction/r1';
const git=args=>execFileSync('git',args,{encoding:'utf8'}).trim();
const lines=s=>s.split(/\r?\n/).filter(Boolean);
const changed=[...new Set([...lines(git(['diff','--name-only','d9d1492'])),...lines(git(['ls-files','--others','--exclude-standard']))])];
const report={at:new Date().toISOString(),base:'d9d1492',branch:git(['branch','--show-current']),changed:changed.length,unexpected:changed.filter(p=>p!=='docs/STATE.md'&&!p.startsWith('docs/review/l5-design-direction/')),links:0,assets:[],contrast:[],errors:[]};
async function walk(dir){const all=[];for(const e of await readdir(dir,{withFileTypes:true})){const p=`${dir}/${e.name}`;if(e.isDirectory())all.push(...await walk(p));else all.push(p);}return all;}
for(const p of (await walk(root)).filter(p=>/\.(html|md)$/.test(p))){
 const text=await readFile(p,'utf8');
 const links=p.endsWith('.html')?[...text.matchAll(/(?:src|href)="([^"]+)"/g)].map(m=>m[1]):[...text.matchAll(/\]\(([^)]+)\)/g)].map(m=>m[1]);
 for(const href of links){if(/^(https?:|#)/.test(href))continue;const local=resolve(dirname(p),href.split(/[?#]/)[0]);if(local.endsWith('consistency.json'))continue;try{await stat(local);report.links++;}catch{report.errors.push(`Broken link ${p}: ${href}`);}}
}
for(const path of ['public/AUTOLAB LOGO .pdf',...['interior-l4-classic.glb','interior-l4-diamond.glb','interior-l4-perforated.glb','interior-l2b.glb'].map(n=>`public/assets/3d/lexus-rx350/${n}`)]){
 const bytes=await readFile(path),same=git(['hash-object',path])===git(['rev-parse',`d9d1492:${path}`]);report.assets.push({path,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex'),unchanged:same});if(!same)report.errors.push(`Changed original ${path}`);
}
const lum=hex=>{const rgb=hex.match(/../g).map(x=>parseInt(x,16)/255).map(n=>n<=.04045?n/12.92:((n+.055)/1.055)**2.4);return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;};
for(const [fg,bg] of [['252425','f3f0e9'],['65615b','f3f0e9'],['17596d','f3f0e9'],['72c4e1','101114']]){const a=lum(fg),b=lum(bg),ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);report.contrast.push({fg,bg,ratio:+ratio.toFixed(2),normalText:ratio>=4.5});if(ratio<4.5)report.errors.push(`Contrast ${fg}/${bg}`);}
report.stateLines=(await readFile('docs/STATE.md','utf8')).trimEnd().split(/\r?\n/).length;
report.foundationSha256=createHash('sha256').update(await readFile(`${root}/css/foundation.css`)).digest('hex');
report.installedFonts={baskerville:await stat('C:/Windows/Fonts/BASKVILL.TTF').then(()=>true,()=>false),bahnschrift:await stat('C:/Windows/Fonts/bahnschrift.ttf').then(()=>true,()=>false)};
if(report.stateLines>20)report.errors.push('STATE exceeds 20 lines');if(report.unexpected.length)report.errors.push('Out-of-scope files');
await writeFile(`${root}/evidence/consistency.json`,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));if(report.errors.length)process.exitCode=1;
