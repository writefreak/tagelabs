import type { Metadata } from "next";
import { Lato, Oxygen } from "next/font/google";
import "./globals.css";
import LayoutShell from "@/components/layout-shell";

const jet = Oxygen({
  subsets: ["latin"],
  weight: ["400", "300", "700"],
  variable: "--font-jet",
  display: "swap",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
  variable: "--font-lato",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tagelabs.vercel.app"),
  title: {
    default:
      "TageLabs — Transforming businesses with scalable digital solutions",
    template: "%s | TageLabs",
  },
  description:
    "TageLabs builds landing pages, CVs, portfolio sites, and digital products for ambitious businesses worldwide.",
  openGraph: {
    title: "TageLabs",
    description: "Transforming businesses with scalable digital solutions.",
    url: "https://tagelabs.vercel.app",
    siteName: "TageLabs",
    type: "website",
    images: [
      {
        url: "https://tagelabs.vercel.app/og-tage.png",
        width: 1200,
        height: 630,
        alt: "TageLabs",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TageLabs",
    description: "Transforming businesses with scalable digital solutions.",
    images: ["https://tagelabs.vercel.app/og-tage.png"],
  },
  // twitter: {
  //   card: "summary_large_image",
  //   title: "TageLabs",
  //   description: "Transforming businesses with scalable digital solutions.",
  //   images: ["/og-tage.png"],
  // },
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
    <html lang="en" className={`${jet.variable} ${lato.variable}`}>
      <body suppressHydrationWarning>
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
