import type { Metadata } from "next";
import { AuthProvider } from "@/lib/auth/auth-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "AutoLab Interior Studio | AutoLab Digital Showroom",
  description:
    "Explore leather, colour and the details of your interior in the AutoLab Digital Showroom. Create a personal specification for your Nairobi atelier consultation.",
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
