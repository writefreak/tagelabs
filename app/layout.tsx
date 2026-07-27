import type { Metadata } from "next";
import { Sora, DM_Sans, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import LayoutShell from "@/components/layout-shell";

const display = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display-raw",
  display: "swap",
});

const body = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body-raw",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tagelabs.vercel.app"),
  title: {
    default: "TageLabs — Transforming businesses with scalable digital solutions",
    template: "%s | TageLabs",
  },
  description: "TageLabs builds landing pages, CVs, portfolio sites, and digital products for ambitious businesses worldwide.",
  openGraph: {
    title: "TageLabs",
    description: "Transforming businesses with scalable digital solutions.",
    url: "https://tagelabs.vercel.app",
    siteName: "TageLabs",
    type: "website",
    images: [
      {
        url: "/og-tage.png",
        width: 1200,
        height: 630,
        alt: "TageLabs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TageLabs",
    description: "Transforming businesses with scalable digital solutions.",
    images: ["/og-tage.png"],
  },
  icons: {
    icon: "/icon.png",
    apple: "/tagelabs.png",
  },
  verification: {
    google: "umQeoteQzhgFrR7-xPAkZndZZ4zzjK8Z7DMgM9tpQhk",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body suppressHydrationWarning>
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}