// Captures the actual production build; does not enable the E2E viewer hook.
import { chromium, expect } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
const output='docs/review/l5-integration/evidence';
const base=process.env.L5_CAPTURE_URL??'http://127.0.0.1:3101';
await mkdir(output,{recursive:true});
const browser=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const measurements=[];
async function ready(page){
  await expect(page.getByTestId('svg-fallback')).toBeHidden({timeout:60000});
  await expect(page.getByTestId('renderer-stats')).toContainText('Triangles 76548',{timeout:30000});
  await expect(page.locator('canvas')).toHaveCount(1);
  expect(await page.evaluate(()=>typeof window.__autolab)).toBe('undefined');
}
async function photograph(page,name){
  await page.keyboard.press('Control+Home');
  await page.screenshot({path:`${output}/${name}.png`,fullPage:true,animations:'disabled'});
}
try{
  for(const mobile of [false,true]){
    const prefix=mobile?'mobile':'desktop';
    const context=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1440,height:1000},isMobile:mobile,hasTouch:mobile,deviceScaleFactor:1,...(!mobile?{recordVideo:{dir:output,size:{width:1440,height:1000}}}:{})});
    const page=await context.newPage();
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
    const video=page.video();
    await page.goto(`${base}/splash`);
    await expect(page.getByRole('heading',{level:1})).toContainText('A signature.');
    await page.waitForTimeout(700);
    await photograph(page,`${prefix}-welcome`);
    const start=Date.now();
    await page.getByRole('link',{name:'Create your interior',exact:true}).click();
    await ready(page);
    const localReadyMs=Date.now()-start;
    await photograph(page,`${prefix}-configurator`);
    const canvas=await page.locator('canvas').elementHandle();
    if(!mobile){
      for(const treatment of ['diamond','perforated']){
        await page.getByTestId(`treatment-${treatment}`).click();
        await ready(page);
        await page.waitForTimeout(800);
      }
      await page.getByTestId('treatment-diamond').click();await ready(page);
      await page.getByRole('button',{name:'Stitch Detail',exact:true}).click();
      await page.waitForTimeout(600);
      await photograph(page,'desktop-diamond-detail');
      await page.getByTestId('step-2').click();
      await page.getByRole('button',{name:/Macchiato Beige/}).click();
      await page.waitForTimeout(600);
      await page.getByTestId('step-3').click();
      await page.getByRole('button',{name:/Silver Shadow Tech Stitch/}).click();
      await page.waitForTimeout(600);
      await page.getByTestId('step-4').click();
      await page.getByRole('button',{name:'Bespoke Monotone',exact:true}).click();
      await page.getByRole('button',{name:'Driver Hero',exact:true}).click();
    }
    await page.getByRole('button',{name:'Your specification',exact:true}).click();
    await expect(page.getByTestId('reference-code')).toHaveText(/^AL-RX-2026-[A-Z2-9]{4}$/);
    await photograph(page,`${prefix}-summary`);
    await page.getByRole('button',{name:'Spec Sheet',exact:true}).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.screenshot({path:`${output}/${prefix}-spec-sheet.png`,animations:'disabled'});
    await page.keyboard.press('Escape');
    expect(await canvas.evaluate(el=>el.isConnected)).toBe(true);
    const renderer=await page.getByTestId('renderer-stats').textContent();
    const resources=await page.evaluate(()=>performance.getEntriesByType('resource').filter(e=>/\.glb|\/basis\/|\/draco\//.test(e.name)).map(e=>({url:e.name,durationMs:e.duration,transferBytes:e.transferSize})));
    expect(errors).toEqual([]);
    measurements.push({viewport:prefix,localReadyMs,renderer,resources,errors,context:'Production build, local server, Chromium SwiftShader, no throttling. Mobile viewport emulation, not a physical phone. No GPU memory measurement.'});
    await context.close();
    if(video){await video.saveAs(`${output}/showroom-interactions.webm`);await video.delete();}
  }
  await writeFile(`${output}/production-browser.json`,JSON.stringify({capturedAt:new Date().toISOString(),measurements},null,2));
  console.log(JSON.stringify(measurements,null,2));
}finally{await browser.close();}
