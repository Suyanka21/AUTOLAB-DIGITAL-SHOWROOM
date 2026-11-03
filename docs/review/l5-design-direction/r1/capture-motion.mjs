import {chromium,expect} from '@playwright/test';
import {writeFile,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
const root=resolve('docs/review/l5-design-direction/r1');
await mkdir(`${root}/motion`,{recursive:true});
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:1440,height:1100},recordVideo:{dir:`${root}/motion`,size:{width:1440,height:1100}}});
const page=await context.newPage();
const report={at:new Date().toISOString(),browser:browser.version(),scope:'Actual recording of isolated HTML prototype; image changes are not live camera or material performance',frames:[],errors:[]};
page.on('pageerror',e=>report.errors.push(e.message));
const go=screen=>page.goto(pathToFileURL(`${root}/html/${screen}.html`).href);
async function frame(id,label){await page.waitForTimeout(750);await page.screenshot({path:`${root}/motion/${id}.png`,fullPage:true});report.frames.push({id,label,capturedAt:new Date().toISOString()});}
try{
 await go('welcome');await frame('01-welcome','Welcome: 600ms entrance; entry always available');
 await page.waitForTimeout(900);await page.getByRole('link',{name:'Create your interior'}).click();
 await frame('02-classic','Material: larger close-up with cabin context');
 await page.getByRole('button',{name:'Next treatment',exact:true}).click();
 await expect(page.getByRole('radio',{name:'Diamond Quilted',exact:true})).toHaveAttribute('aria-checked','true');
 await frame('03-diamond','Diamond: 300ms image reveal and selection feedback');
 await page.getByRole('button',{name:'Next treatment',exact:true}).click();await frame('04-perforated','Perforated: third treatment, no automatic advance');
 await page.getByRole('button',{name:'Stitch Detail',exact:true}).click();await frame('05-detail','Camera: detail view, original preset preserved');
 await page.getByRole('button',{name:'Colour',exact:true}).click();await frame('06-colour','Colour: 240ms panel entrance, unchanged captured fixture');
 await page.getByRole('button',{name:'Accent Thread',exact:true}).click();await frame('07-thread','Accent Thread: existing selection, no new decorative gold');
 await page.getByRole('button',{name:'Composition',exact:true}).click();await frame('08-composition','Composition: final step retains prior selection');
 await page.getByRole('link',{name:'Reveal specification'}).click();
 await expect(page.locator('#summary-treatment')).toHaveText('Perforated');
 await frame('09-summary','Summary: treatment retained, captured reference, copy and Spec Sheet');
 await page.getByRole('button',{name:'Spec Sheet',exact:true}).click();await frame('10-spec-sheet','Accessible Spec Sheet dialog; WhatsApp cannot send from prototype');
 report.fonts=await page.evaluate(()=>({display:document.fonts.check('24px "Baskerville Old Face"'),body:document.fonts.check('16px Bahnschrift'),canvasCount:document.querySelectorAll('canvas').length}));
}catch(e){report.errors.push(e.message);process.exitCode=1;}finally{
 const video=page.video();await context.close();await video.saveAs(`${root}/motion/walkthrough.webm`);await video.delete();await browser.close();await writeFile(`${root}/evidence/motion-capture.json`,JSON.stringify(report,null,2)+'\n');
}
console.log(JSON.stringify(report,null,2));
