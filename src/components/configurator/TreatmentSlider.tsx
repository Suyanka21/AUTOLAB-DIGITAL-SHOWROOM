"use client";
import Image from "next/image";
import { useRef } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { useConfigurator, type UpholsteryTreatment } from "@/lib/state/configurator-context";
import styles from "@/components/studio/studio.module.css";

const treatments: {id:UpholsteryTreatment;name:string;description:string}[]=[
  {id:'classic',name:'Classic',description:'An uninterrupted surface. Grain and stitch lines take the lead.'},
  {id:'diamond',name:'Diamond Quilted',description:'A measured rhythm of diamonds, framed by smooth bolsters.'},
  {id:'perforated',name:'Perforated',description:'A finer surface rhythm. Small perforations, quiet contrast.'},
];
export function TreatmentSlider() {
  const {upholsteryTreatment,setUpholsteryTreatment,setActiveCameraView}=useConfigurator();
  const selected=Math.max(0,treatments.findIndex(t=>t.id===upholsteryTreatment));
  const current=treatments[selected];
  const options=useRef<(HTMLButtonElement|null)[]>([]);
  const pointer=useRef<{id:number;x:number;y:number}|null>(null);
  function select(index:number,focus=false){const next=Math.max(0,Math.min(2,index));setUpholsteryTreatment(treatments[next].id);if(focus)options.current[next]?.focus();}
  return <section aria-label="Upholstery treatment">
    <div className={styles.materialCard} data-testid="material-card"
      onPointerDown={e=>{if(!e.isPrimary)return;pointer.current={id:e.pointerId,x:e.clientX,y:e.clientY};e.currentTarget.setPointerCapture(e.pointerId);}}
      onPointerCancel={()=>{pointer.current=null;}}
      onPointerUp={e=>{const start=pointer.current;pointer.current=null;if(!start||start.id!==e.pointerId)return;const dx=e.clientX-start.x,dy=e.clientY-start.y;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.3)select(selected+(dx<0?1:-1));}}>
      <Image key={current.id} className={styles.materialImage} src={`/showroom/${current.id}-seam_macro.png`} alt={`${current.name} surface study in Sienna Brown; the live cabin shows your selected colour`} width={697} height={397} unoptimized draggable={false}/>
      <div className={styles.cardCaption}><span>0{selected+1} / 03</span><span>DETAIL STUDY · SIENNA BROWN</span></div>
    </div>
    <div className={styles.materialTitle}><h3>{current.name}</h3><div className={styles.arrows}><button type="button" aria-label="Previous treatment" disabled={selected===0} onClick={()=>select(selected-1)}><ArrowLeft size={18}/></button><button type="button" aria-label="Next treatment" disabled={selected===2} onClick={()=>select(selected+1)}><ArrowRight size={18}/></button></div></div>
    <p className={styles.materialDescription}>{current.description}</p>
    <div className={styles.treatmentOptions} role="radiogroup" aria-label="Upholstery treatment selection">
      {treatments.map((t,i)=><button key={t.id} ref={el=>{options.current[i]=el;}} type="button" role="radio" data-testid={`treatment-${t.id}`} aria-checked={i===selected} tabIndex={i===selected?0:-1} onClick={()=>select(i)}
        onKeyDown={e=>{const next=e.key==='Home'?0:e.key==='End'?2:['ArrowRight','ArrowDown'].includes(e.key)?selected+1:['ArrowLeft','ArrowUp'].includes(e.key)?selected-1:null;if(next!==null){e.preventDefault();select(next,true);}}}><span className={styles.radioMark} aria-hidden="true"/>{t.name}</button>)}
    </div>
    <p className="sr-only" role="status">{current.name} selected, {selected+1} of 3.</p>
    <button type="button" className={styles.detailLink} onClick={()=>setActiveCameraView('seam_macro')}>View the stitch detail <ArrowUpRight size={16} aria-hidden="true"/></button>
  </section>;
}

