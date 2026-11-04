"use client";
import { useRef, useState } from "react";
import { ArrowUpRight, X } from "lucide-react";
import { useConfigurator } from "@/lib/state/configurator-context";
import styles from "@/components/studio/studio.module.css";

export function SummaryBar({onEdit}:{onEdit:()=>void}) {
  const {referenceCode,upholsteryTreatment,selectedPrimaryColor,selectedSecondaryColor,selectedTrimDeck,selectedAccentThread,compositionTier,ambientLightName,whatsAppHref}=useConfigurator();
  const [copyStatus,setCopyStatus]=useState('');
  const [copying,setCopying]=useState(false);
  const code=useRef<HTMLElement>(null),dialog=useRef<HTMLDialogElement>(null);
  const treatment=upholsteryTreatment==='diamond'?'Diamond Quilted':upholsteryTreatment==='perforated'?'Perforated':'Classic Smooth';
  const composition=compositionTier==='bespoke_monotone'?'Bespoke Monotone':compositionTier==='bespoke_duotone'?'Bespoke Duotone Bolsters':'Executive Fluted & Armrest Split';
  const unavailable='WhatsApp booking is unavailable until AutoLab configures its number.';
  const fields=[['Upholstery',treatment],['Primary leather',selectedPrimaryColor.name],...(compositionTier!=='bespoke_monotone'?[['Secondary accent',selectedSecondaryColor.name]]:[]),['Accent thread',`${selectedAccentThread.name} (${selectedAccentThread.stitchPattern})`],['Composition',composition],['Trim deck',selectedTrimDeck.name],['Ambient illumination',ambientLightName]];
  const details=<dl className={styles.specFields}>{fields.map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>;
  async function copyCode(){
    if(copying)return;setCopying(true);let timer:ReturnType<typeof setTimeout>|undefined;
    try{
      if(!navigator.clipboard?.writeText)throw new Error('Clipboard unavailable');
      await Promise.race([navigator.clipboard.writeText(referenceCode),new Promise<never>((_,reject)=>{timer=setTimeout(()=>reject(new Error('Clipboard timeout')),2000);})]);
      setCopyStatus('Copied configuration code.');
    }catch{
      if(code.current){const range=document.createRange();range.selectNodeContents(code.current);const selection=window.getSelection();selection?.removeAllRanges();selection?.addRange(range);}
      setCopyStatus('Select and copy the highlighted code.');
    }finally{if(timer)clearTimeout(timer);setCopying(false);}
  }
  const booking=whatsAppHref?<a className={styles.primary} href={whatsAppHref} target="_blank" rel="noopener noreferrer">Continue on WhatsApp <ArrowUpRight aria-hidden="true"/></a>:<button className={styles.primary} type="button" disabled title={unavailable}>Continue on WhatsApp</button>;
  return <section className={styles.summaryDetails} aria-label="Configuration summary and consultation booking">
    <div className={styles.reference}><p className={styles.eyebrow}>CONFIGURATION REFERENCE</p><div><code ref={code} data-testid="reference-code">{referenceCode}</code><button type="button" onClick={copyCode} disabled={copying}>Copy Code</button></div><p className={styles.note} role="status" data-testid="copy-status">{copyStatus}</p></div>
    {details}
    <div className={styles.summaryActions}><button type="button" className={styles.secondary} onClick={()=>dialog.current?.showModal()}>Spec Sheet <ArrowUpRight size={16} aria-hidden="true"/></button>{booking}</div>
    {!whatsAppHref&&<p className={styles.note} role="status">{unavailable}</p>}
    <p className={styles.note}>Your specification starts a conversation. Confirm physical samples and availability with the studio.</p>
    <button className={styles.textButton} type="button" onClick={onEdit}>Return to your selections</button>
    <dialog ref={dialog} className={styles.specDialog} aria-labelledby="spec-title">
      <button className={styles.closeDialog} type="button" aria-label="Close Spec Sheet" onClick={()=>dialog.current?.close()}><X aria-hidden="true"/></button>
      <p className={styles.eyebrow}>AUTOLAB INTERIOR STUDIO</p><h2 id="spec-title">Your Spec Sheet</h2><p>Reference: {referenceCode}</p>{details}
      <div className={styles.summaryActions}><button className={styles.secondary} type="button" onClick={()=>window.print()}>Print Spec Sheet</button>{booking}</div>
      {!whatsAppHref&&<p className={styles.note}>{unavailable}</p>}
      <p className={styles.note}>Illustrative specification. Physical materials and availability require studio confirmation.</p>
    </dialog>
  </section>;
}
