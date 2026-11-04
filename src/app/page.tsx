"use client";
import { ConfiguratorProvider } from "@/lib/state/configurator-context";
import { AtelierHeader } from "@/components/layout/AtelierHeader";
import { VisualizationStage } from "@/components/configurator/VisualizationStage";
import { ConfigurationDrawer } from "@/components/configurator/ConfigurationDrawer";
import { SummaryBar } from "@/components/configurator/SummaryBar";
import { StudioFooter } from "@/components/studio/StudioBrand";
import styles from "@/components/studio/studio.module.css";
export default function AtelierShowroomPage() {
  return <ConfiguratorProvider><div className={styles.root}>
    <a className={styles.skip} href="#main">Skip to content</a><AtelierHeader/>
    <main id="main" className={styles.workbench}><div className={styles.heading}><p className={styles.eyebrow}>THE INTERIOR STUDIO</p><h1>Make it <em>personal.</em></h1><p>Consider the whole. Then the smallest detail.</p></div>
      <div className={styles.atelierGrid}><VisualizationStage/><ConfigurationDrawer/></div>
      <div id="specification"><SummaryBar/></div>
    </main><StudioFooter/>
  </div></ConfiguratorProvider>;
}
