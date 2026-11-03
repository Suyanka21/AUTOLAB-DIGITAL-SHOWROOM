import { chromium, expect } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
const root = 'docs/review/l5-design-direction';
await mkdir(`${root}/evidence`, {recursive:true});
const browser = await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const report = {capturedAt:new Date().toISOString(),browser:browser.version(),renderer:'Headless Chromium / SwiftShader; not a phone benchmark',errors:[],screens:[]};
try {
 for(const [label,width,height] of [['desktop',1440,1000],['mobile',390,844]]) {
  const page = await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
  page.on('pageerror',e=>report.errors.push(e.message));
  await page.goto('http://127.0.0.1:3101');
  await expect(page.getByTestId('viewer-status')).toHaveCount(0,{timeout:60000});
  await expect(page.getByTestId('spike-viewer').locator('canvas')).toBeVisible();
  await page.screenshot({path:`${root}/evidence/current-${label}.png`,fullPage:true});
  await page.screenshot({path:`${root}/evidence/current-${label}-viewport.png`});
  report.screens.push({label,width,height,scrollWidth:await page.evaluate(()=>document.documentElement.scrollWidth)});
  if(label==='desktop') {
   await page.getByRole('button',{name:'Driver Hero',exact:true}).click();
   await page.waitForTimeout(1500);
   await page.getByTestId('spike-viewer').locator('canvas').screenshot({path:`${root}/evidence/actual-driver-stage.png`});
   await page.getByRole('button',{name:'Stitch Detail',exact:true}).click();
   await page.waitForTimeout(1500);
   await page.getByTestId('spike-viewer').locator('canvas').screenshot({path:`${root}/evidence/actual-detail-stage.png`});
  }
  await page.goto('http://127.0.0.1:3101/splash');
  await page.waitForTimeout(2200);
  await page.screenshot({path:`${root}/evidence/current-welcome-${label}.png`,fullPage:true});
  await page.close();
 }
} finally {await browser.close();await writeFile(`${root}/evidence/current-capture.json`,JSON.stringify(report,null,2)+'\n');}
console.log(JSON.stringify(report,null,2));
