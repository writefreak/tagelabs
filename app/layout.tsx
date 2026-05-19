import type { Metadata } from "next";
import "./globals.css";
import LayoutShell from "@/components/layout-shell";

export const metadata: Metadata = {
  title: "TageLabs — Transforming businesses with scalable digital solutions",
  description:
    "TageLabs builds landing pages, CVs, portfolio sites, and digital products for ambitious businesses worldwide.",
  openGraph: {
    title: "TageLabs",
    description: "Transforming businesses with scalable digital solutions.",
    url: "https://tagelabs.com",
    siteName: "TageLabs",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}