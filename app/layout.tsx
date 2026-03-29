import type { Metadata } from "next";
import "./globals.css";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
