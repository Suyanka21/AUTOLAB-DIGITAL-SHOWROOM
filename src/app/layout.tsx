import type { Metadata } from "next";
import { AuthProvider } from "@/lib/auth/auth-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "AutoLab Digital Showroom | 2020 Lexus RX 350 AWD Atelier",
  description:
    "Interactive 3D Bespoke Interior Configurator for the 2020 Lexus RX 350 AWD. Curate handcrafted hides, contrast tailoring, and bespoke compositions at the AutoLab Atelier.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="min-h-screen bg-background text-slate-100 antialiased selection:bg-accent-sky selection:text-black">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
