import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { StudioBrand, StudioFooter } from "@/components/studio/StudioBrand";
import styles from "@/components/studio/studio.module.css";

export default function SplashPage() {
  return <div className={styles.root}>
    <a className={styles.skip} href="#main">Skip to content</a>
    <header className={styles.header}><StudioBrand /><p className={styles.headerNote}>A considered interior. A personal expression.</p><Link className={styles.headerAction} href="/">Enter the studio <ArrowUpRight aria-hidden="true" /></Link></header>
    <main id="main" className={styles.welcome}>
      <section className={styles.welcomeCopy}>
        <p className={`${styles.eyebrow} ${styles.entrance}`}>AutoLab Interior Studio</p>
        <h1 className={styles.entrance}>An interior.<br />A signature.<br /><em>Yours.</em></h1>
        <p className={`${styles.intro} ${styles.entrance}`}>Explore leather, colour and the details that make a cabin feel personal.</p>
        <Link className={`${styles.primary} ${styles.entrance}`} href="/">Create your interior <ArrowUpRight aria-hidden="true" /></Link>
        <p className={styles.welcomeFoot}>Three treatments. Four considered steps.<br />Your specification, ready for a conversation.</p>
      </section>
      <section className={styles.welcomeStage} aria-label="Interior preview">
        <div className={styles.brandSignature}><Image className={`${styles.logo} ${styles.entrance}`} src="/brand/autolab-logo.png" alt="AutoLab" width={1000} height={810} unoptimized /><span>THE ART OF THE INTERIOR</span></div>
        <Image className={styles.hero} src="/showroom/welcome-cabin.png" alt="Sienna Brown and Exclusive Black cabin from the working showroom" width={697} height={397} loading="eager" unoptimized />
        <div className={styles.welcomeCaption}><span>01 / THE CABIN</span><p>Begin with how it feels.</p><Link href="/">Enter the studio <ArrowUpRight size={16} aria-hidden="true" /></Link></div>
      </section>
    </main><StudioFooter />
  </div>;
}
