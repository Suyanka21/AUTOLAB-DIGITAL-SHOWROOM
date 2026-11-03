import {chromium} from '@playwright/test';
import {readFile,writeFile,stat} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {pathToFileURL} from 'node:url';
const root=resolve('docs/review/l5-design-direction/concepts');
const manifest=JSON.parse(await readFile(`${root}/manifest.json`,'utf8'));
const results={capturedAt:new Date().toISOString(),type:'Static design review; no live configurator behaviour is claimed',errors:[],pages:[],assetLinks:0};
for(const path of manifest.html){const html=await readFile(`${root}/${path}`,'utf8');for(const [,url] of html.matchAll(/(?:src|href)="([^"]+)"/g)){if(/^(https?:|#)/.test(url))continue;await stat(resolve(dirname(`${root}/${path}`),url.split('?')[0]));results.assetLinks++;}}
const browser=await chromium.launch({headless:true});
try{
 for(const platform of ['desktop','mobile']){
  const width=platform==='desktop'?1440:390; const height=platform==='desktop'?1000:844;
  const page=await browser.newPage({viewport:{width,height}});page.on('pageerror',e=>results.errors.push(e.message));
  for(const screen of ['welcome','configurator','summary']){
   await page.goto(pathToFileURL(`${root}/html/${platform}-${screen}.html`).href);
   await page.screenshot({path:`${root}/screenshots/${platform}-${screen}.png`,fullPage:platform==='desktop'||screen!=='configurator'});
   if(platform==='mobile'&&screen==='configurator') await page.screenshot({path:`${root}/screenshots/mobile-configurator-full.png`,fullPage:true});
   const audit=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,missingImages:[...document.images].filter(i=>!i.complete||i.naturalWidth===0).length,h1:document.querySelectorAll('h1').length}));
   results.pages.push({platform,screen,...audit});
   if(audit.scrollWidth>width||audit.missingImages||audit.h1!==1)results.errors.push(`${platform}-${screen}: layout/assets/heading failure`);
  }
  for(const step of [1,2,3]){await page.goto(pathToFileURL(`${root}/html/${platform}-configurator.html`).href+`?step=${step}`);await page.screenshot({path:`${root}/screenshots/${platform}-${['material','colour','thread','composition'][step]}.png`,fullPage:true});}
  for(const state of ['loading','empty','error']){await page.goto(pathToFileURL(`${root}/html/${platform}-configurator.html`).href+`?state=${state}`);if(!await page.locator('.state-panel').isVisible())results.errors.push(`${platform}: missing ${state}`);await page.screenshot({path:`${root}/screenshots/${platform}-${state}.png`,fullPage:true});}
  await page.close();
 }
 // Narrow layout sanity and reduced-motion inspection; not a full WCAG audit.
 const narrow=await browser.newPage({viewport:{width:320,height:844},reducedMotion:'reduce'});
 await narrow.goto(pathToFileURL(`${root}/html/mobile-configurator.html`).href);
 results.narrow={width:320,scrollWidth:await narrow.evaluate(()=>document.documentElement.scrollWidth)};
 if(results.narrow.scrollWidth>320)results.errors.push('320px overflow');
 await narrow.keyboard.press('Tab');results.keyboardFocus=await narrow.evaluate(()=>document.activeElement?.tagName);
 await narrow.close();
}finally{await browser.close();await writeFile(`${root}/../evidence/concept-checks.json`,JSON.stringify(results,null,2)+'\n');}
console.log(JSON.stringify(results,null,2));if(results.errors.length)process.exitCode=1;
