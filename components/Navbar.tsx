"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const links = ["About", "Services", "Work", "Reviews", "Blogs", "Contact"];

  // Icon is white on a transparent/dark navbar, navy once we're scrolled or the
  // (white) sheet is open, so it always stays legible against its background.
  const iconIsDark = menuOpen || scrolled;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[80] transition-all duration-300 ${
          scrolled ? "bg-white/95 backdrop-blur-sm shadow-sm" : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="font-display font-700 text-xl text-navy tracking-tight"
          >
            <div className="h-10 w-32">
              <img
                src={scrolled ? "/tagelabslogo.png" : "/tagelabswhite.png"}
                alt="TageLabs"
                className="h-full w-full object-contain"
              />
            </div>
          </Link>

          {/* Sheet toggle — same on desktop and mobile */}
          <button
            className="relative z-[70] flex h-10 w-10 items-center justify-center"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            <motion.span
              className="absolute block h-0.5 w-6 rounded-full"
              animate={{
                rotate: menuOpen ? 45 : 0,
                y: menuOpen ? 0 : -4,
                backgroundColor: iconIsDark ? "#0a1a2f" : "#ffffff",
              }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            />
            <motion.span
              className="absolute block h-0.5 w-6 rounded-full"
              animate={{
                rotate: menuOpen ? -45 : 0,
                y: menuOpen ? 0 : 4,
                backgroundColor: iconIsDark ? "#0a1a2f" : "#ffffff",
              }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            />
          </button>
        </div>
      </nav>

      {/* Full-screen sheet — desktop and mobile alike */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="nav-sheet"
            className="fixed inset-0 z-[60] bg-white flex flex-col items-center justify-center gap-8"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease: [0.65, 0, 0.35, 1] }}
          >
            <motion.div
              className="flex flex-col items-center gap-8"
              variants={{
                open: {
                  transition: { staggerChildren: 0.06, delayChildren: 0.15 },
                },
                closed: {
                  transition: { staggerChildren: 0.04, staggerDirection: -1 },
                },
              }}
              initial="closed"
              animate="open"
              exit="closed"
            >
              {links.map((link) => (
                <motion.button
                  key={link}
                  onClick={() => scrollTo(link.toLowerCase())}
                  className="text-2xl md:text-3xl font-display font-semibold text-navy/70 hover:text-blue transition-colors text-center"
                  variants={{
                    open: { opacity: 1, x: 0 },
                    closed: { opacity: 0, x: -24 },
                  }}
                  transition={{ duration: 0.35 }}
                >
                  {link}
                </motion.button>
              ))}

              <motion.button
                onClick={() => {
                  setMenuOpen(false);
                  router.push("/cv-order");
                }}
                className="text-base font-medium bg-blue text-white px-8 py-3 rounded-full text-center hover:bg-blue transition-colors"
                variants={{
                  open: { opacity: 1, x: 0 },
                  closed: { opacity: 0, x: -24 },
                }}
                transition={{ duration: 0.35 }}
              >
                Preorder a Modern CV
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
