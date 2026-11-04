"use client";
import { useEffect, useRef, useState } from "react";
import { ConfiguratorProvider } from "@/lib/state/configurator-context";
import { AtelierHeader } from "@/components/layout/AtelierHeader";
import { VisualizationStage } from "@/components/configurator/VisualizationStage";
import { ConfigurationDrawer, ConfigurationSteps } from "@/components/configurator/ConfigurationDrawer";
import { SummaryBar } from "@/components/configurator/SummaryBar";
import { StudioFooter } from "@/components/studio/StudioBrand";
import styles from "@/components/studio/studio.module.css";
export default function AtelierShowroomPage() {
  const [step,setStep]=useState(1);
  const [review,setReview]=useState(false);
  const heading=useRef<HTMLHeadingElement>(null),previousReview=useRef(review);
  useEffect(()=>{if(previousReview.current!==review){heading.current?.focus();previousReview.current=review;}},[review]);
  return <ConfiguratorProvider><div className={styles.root}>
    <a className={styles.skip} href="#main">Skip to content</a><AtelierHeader onSummary={()=>setReview(true)}/>
    <main id="main" className={`${styles.workbench} ${review?styles.summaryMode:''}`}><div className={styles.heading}><p className={styles.eyebrow}>{review?'YOUR PERSONAL SPECIFICATION':'THE INTERIOR STUDIO'}</p><h1 ref={heading} tabIndex={-1}>{review?<>A signature, <br/><em>considered in detail.</em></>:<>Make it <em>personal.</em></>}</h1><p>{review?'Bring your interior into the conversation.':'Consider the whole. Then the smallest detail.'}</p></div>
      <div hidden={review}><ConfigurationSteps step={step} onStepChange={setStep}/></div>
      <div className={styles.atelierGrid}><VisualizationStage/>
        <div hidden={review}><ConfigurationDrawer step={step} onStepChange={setStep} onReveal={()=>setReview(true)}/></div>
        <div hidden={!review} id="specification"><SummaryBar onEdit={()=>setReview(false)}/></div>
      </div>
    </main><StudioFooter/>
  </div></ConfiguratorProvider>;
}
