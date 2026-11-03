// Capture the actual application failure before changing its loading code.
import {chromium} from '@playwright/test';
import {writeFile, mkdir} from 'node:fs/promises';
const url=process.argv[2]??'http://127.0.0.1:3101';
const label=process.argv[3]??'incoming-production';
const dir='docs/review/lexus-l4b-recovery-2026-10-31';
await mkdir(dir,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--enable-unsafe-swiftshader']});
const report={url,label,browser:await browser.version(),errors:[],console:[],requests:[],exceptions:[]};
try {
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 page.on('pageerror',e=>report.errors.push({message:e.message,stack:e.stack}));
 page.on('console',m=>report.console.push({type:m.type(),text:m.text(),location:m.location()}));
 page.on('response',r=>{if(/\.(glb|wasm)|\/basis\/|\/draco\//.test(r.url()))report.requests.push({url:r.url(),status:r.status()});});
 const cdp=await page.context().newCDPSession(page);
 await cdp.send('Debugger.enable');await cdp.send('Debugger.setPauseOnExceptions',{state:'all'});
 cdp.on('Debugger.paused',async event=>{
  try {
   if(/KTX2|GLTFLoader/.test(event.data?.description??'')) {
    const frames=event.callFrames.map(f=>({function:f.functionName,url:f.url,location:f.location}));
    report.exceptions.push({description:event.data?.description,frames});
   }
  } finally {await cdp.send('Debugger.resume').catch(()=>{});}
 });
 await page.goto(url,{waitUntil:'domcontentloaded',timeout:90000});
 await page.waitForFunction(()=>window.__autolab?.snapshot().status==='success'||document.querySelector('[data-testid="viewer-status"]')?.textContent?.includes('unavailable'),{},{timeout:90000}).catch(e=>{report.waitError=e.message;});
 report.snapshot=await page.evaluate(()=>window.__autolab?.snapshot());
 report.status=await page.locator('[data-testid="viewer-status"]').textContent().catch(()=>null);
 await page.screenshot({path:dir+'/'+label+'.png'});
 for(const path of ['/basis/basis_transcoder.js','/basis/basis_transcoder.wasm','/draco/draco_wasm_wrapper.js','/draco/draco_decoder.wasm']){
  const r=await page.request.get(url+path);report.requests.push({url:url+path,status:r.status(),bytes:(await r.body()).length});
 }
} finally {await browser.close();await writeFile(dir+'/'+label+'.json',JSON.stringify(report,null,2)+'\n');}
console.log(JSON.stringify(report,null,2));
