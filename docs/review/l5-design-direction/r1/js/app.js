/* Isolated proposal only. No production state, WebGL or outbound messaging. */
(() => {
 'use strict';
 const treatments=[{id:'classic',name:'Classic',description:'An uninterrupted surface. Grain and stitch lines take the lead.'},{id:'diamond',name:'Diamond Quilted',description:'A measured rhythm of diamonds, framed by smooth bolsters.'},{id:'perforated',name:'Perforated',description:'A finer surface rhythm. Small perforations, quiet contrast.'}];
 const cameras={hero_driver:'Driver Hero',cabin_pair:'Cabin Pair',driver_cockpit:'Cockpit & Dash',seam_macro:'Stitch Detail'};
 const $=s=>document.querySelector(s);
 const query=new URLSearchParams(location.search);
 let selected=Math.max(0,treatments.findIndex(t=>t.id===query.get('treatment'))),camera='hero_driver',step=0,request=0;
 const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
 const announce=text=>{if($('#announcement'))$('#announcement').textContent=text;};
 const animate=el=>{if(!el||reduced())return;el.classList.remove('changed');void el.offsetWidth;el.classList.add('changed');};
 const asset=(t,c)=>`../assets/${t.id}-${c}.png`;
 function links(){const suffix=`?treatment=${treatments[selected].id}`;document.querySelectorAll('a[href^="summary.html"],a[href^="configurator.html"]').forEach(a=>a.href=a.getAttribute('href').split('?')[0]+suffix);}
 function loadStage(){
  const target=$('#stage-image');if(!target)return;
  const token=++request,t=treatments[selected],url=asset(t,camera),view=camera;
  const img=new Image();let finished=false;
  const timer=setTimeout(()=>finish(false),6000);
  const finish=ok=>{if(finished)return;finished=true;clearTimeout(timer);if(token!==request)return;
   $('#image-error').hidden=ok;
   if(ok){target.src=url;target.alt=`${t.name}, ${cameras[view]} recorded view`;$('#view-caption').textContent=cameras[view];animate(target);}
  };
  img.onload=()=>finish(true);img.onerror=()=>finish(false);img.src=url;
 }
 function select(index,focus=false){
  selected=Math.max(0,Math.min(treatments.length-1,index));const t=treatments[selected];
  document.querySelectorAll('[data-treatment]').forEach((el,i)=>{el.setAttribute('aria-checked',String(i===selected));el.tabIndex=i===selected?0:-1;if(focus&&i===selected)el.focus();});
  if($('#material-image')){
   $('#material-image').src=asset(t,'seam_macro');$('#material-image').alt=`${t.name} close-up from the existing showroom`;animate($('#material-image'));
   $('#material-title').textContent=t.name;$('#material-description').textContent=t.description;$('#material-count').textContent=`0${selected+1} / 03`;
   $('#previous').disabled=selected===0;$('#next').disabled=selected===2;
  }
  links();loadStage();announce(`${t.name} selected. ${selected+1} of 3.`);
 }
 function chooseCamera(id){if(!Object.hasOwn(cameras,id))return;camera=id;document.querySelectorAll('[data-camera]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.camera===id)));loadStage();announce(`${cameras[id]} view selected.`);}
 document.querySelectorAll('[data-treatment]').forEach((b,i)=>{
  b.addEventListener('click',()=>select(i));
  b.addEventListener('keydown',e=>{let next;if(e.key==='ArrowRight'||e.key==='ArrowDown')next=selected+1;if(e.key==='ArrowLeft'||e.key==='ArrowUp')next=selected-1;if(e.key==='Home')next=0;if(e.key==='End')next=2;if(next!==undefined){e.preventDefault();select(next,true);}});
 });
 $('#previous')?.addEventListener('click',()=>select(selected-1));$('#next')?.addEventListener('click',()=>select(selected+1));
 let pointer=null;
 $('#material-card')?.addEventListener('pointerdown',e=>{if(e.isPrimary===false)return;pointer={id:e.pointerId,x:e.clientX,y:e.clientY};});
 $('#material-card')?.addEventListener('pointerup',e=>{if(!pointer||pointer.id!==e.pointerId)return;const dx=e.clientX-pointer.x,dy=e.clientY-pointer.y;pointer=null;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.3)select(selected+(dx<0?1:-1));});
 $('#material-card')?.addEventListener('pointercancel',()=>{pointer=null;});
 document.querySelectorAll('[data-camera]').forEach(b=>b.addEventListener('click',()=>chooseCamera(b.dataset.camera)));
 $('#inspect-detail')?.addEventListener('click',()=>chooseCamera('seam_macro'));$('#retry')?.addEventListener('click',loadStage);
 const steps=['Material','Colour','Accent Thread','Composition'],titles=['Start with the surface.','A colour that feels yours.','Follow the finest line.','Consider the whole.'];
 function setStep(next){step=Math.max(0,Math.min(3,next));document.querySelectorAll('[data-step]').forEach((b,i)=>{if(i===step)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');});document.querySelectorAll('.step-panel').forEach((panel,i)=>{panel.hidden=i!==step;panel.classList.remove('arriving');if(i===step&&!reduced()){void panel.offsetWidth;panel.classList.add('arriving');}});$('#step-title').textContent=titles[step];$('#step-title').focus({preventScroll:true});$('#step-count').textContent=`0${step+1} / ${steps[step].toUpperCase()}`;$('#continue').hidden=step===3;$('#reveal').hidden=step!==3;if(step<3)$('#continue').innerHTML=`Continue to ${steps[step+1]} <span>→</span>`;announce(`Step ${step+1} of 4: ${steps[step]}`);}
 document.querySelectorAll('[data-step]').forEach(b=>b.addEventListener('click',()=>setStep(Number(b.dataset.step))));$('#continue')?.addEventListener('click',()=>setStep(step+1));
 if($('#material-image'))select(selected);
 if($('#summary-treatment')){const t=treatments[selected];$('#summary-treatment').textContent=t.name;$('#sheet-treatment').textContent=t.name;$('#summary-image').src=asset(t,'hero_driver');links();}
 $('#spec')?.addEventListener('click',()=>$('#spec-dialog').showModal());$('#close-spec')?.addEventListener('click',()=>$('#spec-dialog').close());$('#print')?.addEventListener('click',()=>window.print());
 $('#copy')?.addEventListener('click',async()=>{
  const output=$('#copy-status');const code=$('#reference-code').textContent;
  try{if(!navigator.clipboard?.writeText)throw Error('Clipboard unavailable');let timer;try{await Promise.race([navigator.clipboard.writeText(code),new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('Clipboard timed out')),2000);})]);}finally{clearTimeout(timer);}output.textContent='Copied configuration code.';}
  catch{const range=document.createRange();range.selectNodeContents($('#reference-code'));const selection=window.getSelection();selection?.removeAllRanges();selection?.addRange(range);output.textContent='Select and copy the highlighted code.';}
 });
})();
