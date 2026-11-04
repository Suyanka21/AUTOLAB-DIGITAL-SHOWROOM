"use client";
import { useState } from "react";
import { ConfiguratorProvider } from "@/lib/state/configurator-context";
import { AtelierHeader } from "@/components/layout/AtelierHeader";
import { VisualizationStage } from "@/components/configurator/VisualizationStage";
import { ConfigurationDrawer, ConfigurationSteps } from "@/components/configurator/ConfigurationDrawer";
import { SummaryBar } from "@/components/configurator/SummaryBar";
import { StudioFooter } from "@/components/studio/StudioBrand";
import styles from "@/components/studio/studio.module.css";
export default function AtelierShowroomPage() {
  const [step,setStep]=useState(1);
  return <ConfiguratorProvider><div className={styles.root}>
    <a className={styles.skip} href="#main">Skip to content</a><AtelierHeader/>
    <main id="main" className={styles.workbench}><div className={styles.heading}><p className={styles.eyebrow}>THE INTERIOR STUDIO</p><h1>Make it <em>personal.</em></h1><p>Consider the whole. Then the smallest detail.</p></div>
      <ConfigurationSteps step={step} onStepChange={setStep}/>
      <div className={styles.atelierGrid}><VisualizationStage/><ConfigurationDrawer step={step} onStepChange={setStep} onReveal={()=>document.getElementById('specification')?.scrollIntoView()}/></div>
      <div id="specification"><SummaryBar/></div>
    </main><StudioFooter/>
  </div></ConfiguratorProvider>;
}
