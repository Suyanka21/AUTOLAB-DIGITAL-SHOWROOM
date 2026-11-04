"use client";
import { Check } from "lucide-react";
import { useConfigurator, type CompositionTier } from "@/lib/state/configurator-context";
import colours from "@/config/materials/colors.json";
import materials from "@/config/materials/catalogue.json";
import threads from "@/config/materials/accent-threads.json";
import styles from "@/components/studio/studio.module.css";

export function LeatherFamilies(){
  const {primaryMaterialId,setPrimaryColor}=useConfigurator();
  return <details className={styles.moreOptions}><summary>Explore leather families</summary><p className={styles.note}>Illustrative choices. Confirm hide availability with the studio.</p>
    {materials.filter(m=>m.category==='leather').map(m=><button className={styles.option} type="button" key={m.id} aria-pressed={m.id===primaryMaterialId} onClick={()=>{const c=colours.find(c=>c.compatibleMaterialIds.includes(m.id));if(c)setPrimaryColor(c.id);}}><span>{m.name}</span>{m.id===primaryMaterialId&&<Check size={16} aria-hidden="true"/>}</button>)}
  </details>;
}
export function ColourOptions(){
  const {primaryMaterialId,primaryColorId,setPrimaryColor}=useConfigurator();
  const candidates=colours.filter(c=>c.compatibleMaterialIds.includes(primaryMaterialId));
  return <><p className={styles.note}>Explore the palette in the live cabin. Final colour and availability are confirmed against a physical sample.</p><div className={styles.swatches}>
    {candidates.map(c=><button type="button" className={styles.option} key={c.id} aria-pressed={c.id===primaryColorId} onClick={()=>setPrimaryColor(c.id)}><span className={styles.swatch} style={{backgroundColor:c.hexCode}} aria-hidden="true"/><span>{c.name}</span>{c.id===primaryColorId&&<Check size={16} aria-hidden="true"/>}</button>)}
    {!candidates.length&&<p role="status">No colours are available for this leather family.</p>}
  </div></>;
}
export function ThreadOptions(){
  const {accentThreadId,setAccentThread}=useConfigurator();
  return <><p className={styles.note}>A fine line, connecting every panel. Preview the thread colour in the live cabin.</p><div className={styles.optionList}>{threads.map(t=><button type="button" className={styles.option} key={t.id} aria-pressed={accentThreadId===t.id} onClick={()=>setAccentThread(t.id)}><span className={styles.threadSwatch} style={{borderColor:t.hexCode}} aria-hidden="true"/><span>{t.name}<small>{t.stitchPattern}</small></span>{accentThreadId===t.id&&<Check size={16} aria-hidden="true"/>}</button>)}</div></>;
}
const compositions:{id:CompositionTier;name:string;description:string}[]=[
  {id:'bespoke_monotone',name:'Bespoke Monotone',description:'One colour across the configured leather zones.'},
  {id:'bespoke_duotone',name:'Bespoke Duotone Bolsters',description:'A primary colour framed by a contrasting secondary hide.'},
  {id:'executive_fluted',name:'Executive Fluted & Armrest Split',description:'The existing split composition, with a secondary accent.'},
];
export function CompositionOptions(){
  const {compositionTier,setCompositionTier,secondaryColorId,setSecondaryColor}=useConfigurator();
  const secondary=colours.filter(c=>c.compatibleMaterialIds.includes('nappa-exclusive')||c.compatibleMaterialIds.includes('autolab-heritage-hide')).slice(0,6);
  return <><div className={styles.optionList}>{compositions.map(c=><button type="button" className={styles.option} key={c.id} aria-label={c.name} aria-pressed={compositionTier===c.id} onClick={()=>setCompositionTier(c.id)}><span>{c.name}<small>{c.description}</small></span>{compositionTier===c.id&&<Check size={16} aria-hidden="true"/>}</button>)}</div>
    {compositionTier!=='bespoke_monotone'&&<section className={styles.secondaryChoices} aria-label="Secondary accent colours"><h3>Secondary accent</h3><div className={styles.swatches}>{secondary.map(c=><button type="button" className={styles.option} key={c.id} aria-pressed={secondaryColorId===c.id} onClick={()=>setSecondaryColor(c.id)}><span className={styles.swatch} style={{backgroundColor:c.hexCode}} aria-hidden="true"/><span>{c.name.split(' (')[0]}</span>{secondaryColorId===c.id&&<Check size={16} aria-hidden="true"/>}</button>)}</div></section>}
    <ExtendedOptions/>
  </>;
}
function ExtendedOptions(){
  const {trimDeckId,setTrimDeck,ambientLightHex,setAmbientLight}=useConfigurator();
  const ambient=[{hex:'#38B6FF',name:'AutoLab Electric Cyan',label:'Cyan Signature'},{hex:'#FF5722',name:'Sunset Amber Ambient',label:'Sunset Amber'},{hex:'#E91E63',name:'Miami Rose Ambient',label:'Miami Rose'},{hex:'#00BCD4',name:'Ocean Blue Ambient',label:'Ocean Blue'},{hex:'#D4AF37',name:'Champagne Luminescence',label:'Champagne Glow'}];
  return <details className={styles.moreOptions}><summary>Further interior details</summary><p className={styles.note}>Existing illustrative options; availability requires studio confirmation. The ambient selection is recorded in your specification.</p><h3>Trim deck</h3>
    <div className={styles.optionList}>{materials.filter(m=>m.category==='wood'||m.category==='carbon').map(m=><button type="button" className={styles.option} key={m.id} aria-pressed={trimDeckId===m.id} onClick={()=>setTrimDeck(m.id)}>{m.name}{trimDeckId===m.id&&<Check size={16} aria-hidden="true"/>}</button>)}</div>
    <h3>Ambient selection</h3><div className={styles.optionList}>{ambient.map(a=><button type="button" className={styles.option} key={a.hex} aria-pressed={ambientLightHex===a.hex} onClick={()=>setAmbientLight(a.hex,a.name)}><span className={styles.swatch} style={{backgroundColor:a.hex}} aria-hidden="true"/>{a.label}{ambientLightHex===a.hex&&<Check size={16} aria-hidden="true"/>}</button>)}</div>
  </details>;
}
