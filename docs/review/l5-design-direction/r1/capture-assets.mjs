import {chromium,expect} from '@playwright/test';
import {writeFile} from 'node:fs/promises';
const root='docs/review/l5-design-direction/r1';
const browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const report={at:new Date().toISOString(),browser:browser.version(),method:'Read-only existing app; screenshot crop excludes bottom DOM badges. No pixel retouching, scene edits or camera-coordinate edits.',errors:[],captures:[]};
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 page.on('pageerror',e=>report.errors.push(e.message));
 await page.goto('http://127.0.0.1:3101');
 await expect(page.getByTestId('viewer-status')).toHaveCount(0,{timeout:60000});
 report.referenceCode=(await page.locator('body').innerText()).match(/AL-RX-2026-[A-Z0-9]+/)?.[0];
 for(const treatment of ['classic','diamond','perforated']){
  await page.getByTestId(`treatment-${treatment}`).click();
  await expect(page.getByTestId('viewer-status')).toHaveCount(0,{timeout:60000});
  for(const [id,label] of [['hero_driver','Driver Hero'],['cabin_pair','Cabin Pair'],['driver_cockpit','Cockpit & Dash'],['seam_macro','Stitch Detail']]){
   await page.getByRole('button',{name:label,exact:true}).click();
   await page.waitForTimeout(500);
   const box=await page.getByTestId('spike-viewer').locator('canvas').boundingBox();
   if(!box)throw new Error('Canvas missing');
   const clip={x:box.x,y:box.y,width:box.width,height:Math.floor(box.height-78)};
   await page.screenshot({path:`${root}/assets/${treatment}-${id}.png`,clip});
   report.captures.push({treatment,camera:id,label,clip});
  }
 }
}finally{await browser.close();await writeFile(`${root}/evidence/asset-captures.json`,JSON.stringify(report,null,2)+'\n');}
console.log(JSON.stringify(report,null,2));if(report.errors.length)process.exitCode=1;
