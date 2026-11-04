import Image from "next/image";
import Link from "next/link";
import styles from "./studio.module.css";

export function StudioBrand() {
  return <Link className={styles.brand} href="/splash" aria-label="AutoLab Interior Studio welcome">
    <Image src="/brand/autolab-logo.png" alt="AutoLab" width={1000} height={810} unoptimized className={styles.logo} />
    <span>AutoLab <b>Interior Studio</b></span>
  </Link>;
}

export function StudioFooter() {
  return <footer className={styles.footer}><span>AutoLab Digital Showroom</span><span>Crafted around you · Nairobi</span></footer>;
}
