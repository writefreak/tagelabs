import type { Metadata } from "next";
import "./globals.css";
import LayoutShell from "@/components/layout-shell";

export const metadata: Metadata = {
  metadataBase: new URL("https://tagelabs.com"),
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
    url: "https://tagelabs.com",
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
