import type { Metadata } from "next";
import { AuthProvider } from "@/lib/auth/auth-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "AutoLab Digital Showroom | Mercedes-Benz S-Class (V223 LWB) Atelier",
  description:
    "Interactive 2D Bespoke Interior Configurator for the Mercedes-Benz S-Class V223. Curate handcrafted hides, contrast tailoring, and bespoke compositions at the AutoLab Atelier.",
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
