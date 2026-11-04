"use client";
import { useEffect,useRef } from "react";
import { ArrowRight,ArrowUpRight } from "lucide-react";
import { TreatmentSlider } from "./TreatmentSlider";
import { LeatherFamilies,ColourOptions,ThreadOptions,CompositionOptions } from "./StudioOptions";
import styles from "@/components/studio/studio.module.css";
export const STUDIO_STEPS=['Material','Colour','Accent Thread','Composition'];
const titles=['Start with the surface.','A colour that feels yours.','Follow the finest line.','Consider the whole.'];
export function ConfigurationSteps({step,onStepChange}:{step:number;onStepChange:(step:number)=>void}){
  return <nav className={styles.steps} aria-label="Configuration steps">{STUDIO_STEPS.map((label,i)=><button type="button" key={label} data-testid={`step-${i+1}`} aria-label={`${i+1}. ${label}`} aria-current={step===i+1?'step':undefined} onClick={()=>onStepChange(i+1)}><span aria-hidden="true">0{i+1}</span>{label}<i aria-hidden="true"/></button>)}</nav>;
}
export function ConfigurationDrawer({step,onStepChange,onReveal}:{step:number;onStepChange:(step:number)=>void;onReveal:()=>void}){
  const heading=useRef<HTMLHeadingElement>(null),previous=useRef(step);
  useEffect(()=>{if(step!==previous.current){heading.current?.focus({preventScroll:true});previous.current=step;}},[step]);
  return <aside className={styles.selection} aria-label="Interior customisation">
    <p className={styles.eyebrow}>0{step} / {STUDIO_STEPS[step-1]}</p><h2 ref={heading} tabIndex={-1}>{titles[step-1]}</h2>
    <div key={step} className={styles.stepPanel}>
      {step===1&&<><TreatmentSlider/><LeatherFamilies/></>}
      {step===2&&<ColourOptions/>}{step===3&&<ThreadOptions/>}{step===4&&<CompositionOptions/>}
    </div>
    <div className={styles.selectionBottom}>
      {step<4?<button type="button" className={styles.primary} onClick={()=>onStepChange(step+1)}>Continue to {STUDIO_STEPS[step]} <ArrowRight aria-hidden="true"/></button>:<button type="button" className={styles.primary} onClick={onReveal}>Reveal specification <ArrowUpRight aria-hidden="true"/></button>}
      <div>{step>1&&<button type="button" className={styles.textButton} onClick={()=>onStepChange(step-1)}>Previous step</button>}<span>Selections remain editable.</span></div>
    </div>
  </aside>;
}
