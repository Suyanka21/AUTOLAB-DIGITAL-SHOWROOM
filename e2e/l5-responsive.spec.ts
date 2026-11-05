import { expect, test } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const evidence='docs/review/l5-integration/evidence';
test('mobile touch, narrow layouts, reduced motion and clipboard denial remain usable',async({page,context})=>{
  test.setTimeout(180000);
  await mkdir(evidence,{recursive:true});
  await page.setViewportSize({width:390,height:844});
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/');
  await expect.poll(()=>page.evaluate(()=>window.__autolab?.snapshot().status),{timeout:60000}).toBe('success');
  const card=page.getByTestId('material-card');
  await card.scrollIntoViewIfNeeded();
  const box=(await card.boundingBox())!;
  const cdp=await context.newCDPSession(page);
  const start={x:box.x+box.width*.8,y:box.y+box.height*.5};
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[start]});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:start.x-110,y:start.y}]});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  await expect(page.getByTestId('treatment-diamond')).toHaveAttribute('aria-checked','true');
  await expect.poll(()=>page.evaluate(()=>window.__autolab?.snapshot().materialState?.quiltThread),{timeout:60000}).toBe(true);
  await page.getByTestId('treatment-diamond').focus();
  await page.keyboard.press('End');
  await expect(page.getByTestId('treatment-perforated')).toBeFocused();
  await expect(page.getByRole('button',{name:'Next treatment',exact:true})).toBeDisabled();
  await page.keyboard.press('Home');
  await expect(page.getByTestId('treatment-classic')).toBeFocused();
  await expect(page.getByRole('button',{name:'Previous treatment',exact:true})).toBeDisabled();
  for(const width of [320,390,768]){
    await page.setViewportSize({width,height:844});
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  }
  await page.setViewportSize({width:390,height:844});
  await page.getByRole('button',{name:'Your specification',exact:true}).click();
  await cdp.send('Browser.setPermission',{permission:{name:'clipboard-write'},setting:'denied',origin:'http://127.0.0.1:3100'});
  await page.getByRole('button',{name:'Copy Code',exact:true}).click();
  await expect(page.getByTestId('copy-status')).toHaveText('Select and copy the highlighted code.');
  expect(await page.evaluate(()=>window.getSelection()?.toString())).toMatch(/^AL-RX-2026-/);
  await page.getByRole('button',{name:'Spec Sheet',exact:true}).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button',{name:'Spec Sheet',exact:true})).toBeFocused();
  expect(await page.evaluate(()=>document.getAnimations().filter(a=>a.playState==='running').length)).toBe(0);
  await page.screenshot({path:`${evidence}/mobile-summary-reduced-motion.png`,fullPage:true});
});

test('delayed loading and injected failure expose accessible feedback before Retry',async({page})=>{
  await mkdir(evidence,{recursive:true});
  let release:()=>void=()=>{};
  const waiting=new Promise<void>(resolve=>{release=resolve;});
  let first=true,requestStarted=false;
  await page.route('**/interior-l4-classic.glb',async route=>{
    if(!first)return route.continue();
    first=false;requestStarted=true;await waiting;
    await route.fulfill({status:503,body:'L5 recovery test'});
  });
  await page.goto('/');
  await expect.poll(()=>requestStarted,{timeout:60000}).toBe(true);
  await expect(page.getByTestId('viewer-status')).toContainText('Loading your interior');
  await page.screenshot({path:`${evidence}/loading-state.png`});
  release();
  await expect(page.getByRole('button',{name:'Retry 3D',exact:true})).toBeVisible({timeout:60000});
  await page.screenshot({path:`${evidence}/error-state.png`});
  await page.getByRole('button',{name:'Retry 3D',exact:true}).click();
  await expect.poll(()=>page.evaluate(()=>window.__autolab?.snapshot().status),{timeout:60000}).toBe('success');
});
