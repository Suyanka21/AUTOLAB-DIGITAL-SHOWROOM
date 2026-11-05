import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {readFileSync,writeFileSync} from 'node:fs';
const baseline='8fd1693';
const files=['public/AUTOLAB LOGO .pdf',...['classic','diamond','perforated'].map(t=>`public/assets/3d/lexus-rx350/interior-l4-${t}.glb`),'public/assets/3d/lexus-rx350/interior-l2b.glb'];
const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
const hashes=files.map(file=>{
  const current=readFileSync(file);
  const original=execFileSync('git',['show',`${baseline}:${file}`],{maxBuffer:20*1024*1024});
  return {file,bytes:current.length,sha256:digest(current),baselineSha256:digest(original),unchanged:current.equals(original)};
});
const protectedPaths=['package.json','package-lock.json','src/lib/state/configurator-context.tsx','src/config','src/lib/three','public/basis','public/draco','public/assets/3d'];
const protectedDiff=execFileSync('git',['diff','--name-only',baseline,'--',...protectedPaths],{encoding:'utf8'}).trim();
const passed=hashes.every(h=>h.unchanged)&&!protectedDiff;
const report={baseline,passed,protectedPaths,protectedDiff,hashes};
writeFileSync('docs/review/l5-integration/evidence/preservation.json',JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
if(!passed)process.exitCode=1;
