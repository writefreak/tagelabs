"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Contact from "./Contact";

export default function LayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideChrome =
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/login") ||
    pathname?.startsWith("/signup") ||
    pathname?.startsWith("/forgotten-password") ||
    pathname?.startsWith("/not-found");

  return (
    <>
      {!hideChrome && <Navbar />}
      {children}
      {!hideChrome && <Contact />}
      {!hideChrome && <Footer />}
    </>
  );
}
