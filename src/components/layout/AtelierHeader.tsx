"use client";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { StudioBrand } from "@/components/studio/StudioBrand";
import styles from "@/components/studio/studio.module.css";
export function AtelierHeader({onSummary}: {onSummary?:()=>void}) {
  return <header className={styles.header}><StudioBrand/><p className={styles.headerNote}>A considered interior. A personal expression.</p>
    {onSummary?<button type="button" className={styles.headerAction} onClick={onSummary}>Your specification <ArrowUpRight aria-hidden="true"/></button>:<Link className={styles.headerAction} href="#specification">Your specification <ArrowUpRight aria-hidden="true"/></Link>}
  </header>;
}
