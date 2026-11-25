import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import LayoutShell from "@/components/layout-shell";
import { Inter, Lato } from "next/font/google";

const paperlogy = localFont({
  src: [
    { path: "./fonts/Paperlogy-1Thin.ttf", weight: "100", style: "normal" },
    {
      path: "./fonts/Paperlogy-2ExtraLight.ttf",
      weight: "200",
      style: "normal",
    },
    { path: "./fonts/Paperlogy-3Light.ttf", weight: "300", style: "normal" },
    { path: "./fonts/Paperlogy-4Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/Paperlogy-5Medium.ttf", weight: "500", style: "normal" },
    {
      path: "./fonts/Paperlogy-6SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    { path: "./fonts/Paperlogy-7Bold.ttf", weight: "700", style: "normal" },
    {
      path: "./fonts/Paperlogy-8ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
    { path: "./fonts/Paperlogy-9Black.ttf", weight: "900", style: "normal" },
  ],
  variable: "--font-jet",
  display: "swap",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
  variable: "--font-lato",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
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
    <html
      lang="en"
      className={`${paperlogy.variable} ${inter.variable} ${lato.variable}`}
    >
      <body suppressHydrationWarning>
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}

// const jet = Oxygen({
//   subsets: ["latin"],
//   weight: ["400", "300", "700"],
//   variable: "--font-jet",
//   display: "swap",
// });

// const lato = Lato({
//   subsets: ["latin"],
//   weight: ["100", "300", "400", "700", "900"],
//   variable: "--font-lato",
//   display: "swap",
// });
