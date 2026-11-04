"use client";
import { useCallback, useState } from "react";
import { useConfigurator, type CameraViewId } from "@/lib/state/configurator-context";
import { SpikeViewer, type RendererStats } from "./SpikeViewer";
import { StudioFallback } from "./StudioFallback";
import styles from "@/components/studio/studio.module.css";

const cameras: {id: CameraViewId; label: string}[] = [
  {id:'hero_driver',label:'Driver Hero'}, {id:'cabin_pair',label:'Cabin Pair'},
  {id:'driver_cockpit',label:'Cockpit & Dash'}, {id:'seam_macro',label:'Stitch Detail'},
];
export function VisualizationStage() {
  const {activeCameraView,setActiveCameraView,selectedPrimaryColor,selectedSecondaryColor,selectedTrimDeck,selectedAccentThread,compositionTier,ambientLightHex,upholsteryTreatment}=useConfigurator();
  const [status,setStatus]=useState<'loading'|'success'|'empty'|'error'>('loading');
  const [stats,setStats]=useState<RendererStats|null>(null);
  const onStatus=useCallback((value:'loading'|'success'|'empty'|'error')=>setStatus(value),[]);
  const onStats=useCallback((value:RendererStats|null)=>setStats(value),[]);
  const primaryHex=selectedPrimaryColor?.hexCode||'#75452B';
  const secondaryHex=compositionTier==='bespoke_monotone'?primaryHex:selectedSecondaryColor?.hexCode||'#151618';
  const threadHex=selectedAccentThread?.hexCode||'#D4AF37';
  const trimHex=selectedTrimDeck?.id==='open-pore-poplar'?'#2A2B2E':selectedTrimDeck?.id==='open-pore-walnut'?'#543825':selectedTrimDeck?.id==='piano-lacquer-flowing-lines'?'#101012':'#1D1E22';
  return <section className={styles.stage} aria-label="Live interior preview">
    <div className={styles.stageTop}><span>YOUR INTERIOR</span><span key={activeCameraView} className={styles.viewLabel}>{cameras.find(c=>c.id===activeCameraView)?.label}</span></div>
    <div className={styles.liveViewport}>
      <SpikeViewer view={activeCameraView} treatment={upholsteryTreatment} primaryHex={primaryHex} secondaryHex={secondaryHex} threadHex={threadHex} trimHex={trimHex} steeringHex={secondaryHex} onStatus={onStatus} onStats={onStats}/>
      <StudioFallback hidden={status==='success'} primaryHex={primaryHex} secondaryHex={secondaryHex} threadHex={threadHex} trimHex={trimHex} ambientLightHex={ambientLightHex} compositionTier={compositionTier} cameraLabel={cameras.find(c=>c.id===activeCameraView)?.label||'Driver Hero'}/>
    </div>
    <div className={styles.stageNote}><span>{selectedPrimaryColor.name.split(' (')[0]} / {compositionTier==='bespoke_monotone'?selectedPrimaryColor.name.split(' (')[0]:selectedSecondaryColor.name.split(' (')[0]}</span><span>Drag to explore · scroll to zoom</span></div>
    <div className={styles.cameraNav} role="group" aria-label="Camera presets">
      {cameras.map((camera,index)=><button key={camera.id} type="button" aria-pressed={activeCameraView===camera.id} onClick={()=>setActiveCameraView(camera.id)}><span aria-hidden="true">0{index+1}</span>{camera.label}</button>)}
    </div>
    <details className={styles.diagnostics}><summary>Preview information</summary><p>Illustrative interior. Confirm materials and availability with the studio.</p><p data-testid="renderer-stats">{stats?`Calls ${stats.calls} · Triangles ${stats.triangles} · Textures ${stats.textures} · Geometries ${stats.geometries}`:'Renderer data pending'}</p></details>
  </section>;
}
