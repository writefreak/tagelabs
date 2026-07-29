"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const links = ["About", "Services", "Work", "Reviews", "Blogs", "Contact"];

const linkListVariants = {
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
  hidden: {
    transition: { staggerChildren: 0.04, staggerDirection: -1 },
  },
};

const linkItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const scrollToSection = (id: string) => {
    const sectionId = id.toLowerCase();

    if (pathname === "/") {
      document
        .getElementById(sectionId)
        ?.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push(`/#${sectionId}`);
    }
  };

  const goToCvOrder = () => {
    setMobileOpen(false);
    router.push("/cv-order");
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-[80] flex items-center justify-center gap-3 px-4 pt-5 md:px-14 md:pt-7 2xl:px-24 transition-opacity duration-300">
      {/* Desktop pill nav */}
      <div className="hidden md:flex border border-navy/10 bg-offwhite backdrop-blur-md shadow-md max-w-8xl p-1 px-2 rounded-2xl items-center justify-between">
        <Link href="/" className="h-10 md:pr-4">
          <img
            src="/tagelabslogo.png"
            alt="TageLabs"
            className="object-contain h-full w-full"
          />
        </Link>

        <div className="flex items-center gap-10">
          <div className="flex gap-8 2xl:gap-10 justify-between">
            {links.map((link) => (
              <div key={link} className="group relative">
                <a
                  href={`#${link.toLowerCase()}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(link);
                  }}
                  className="font-sans text-sm text-navy/70 hover:text-navy relative after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:bg-blue after:scale-x-0 after:opacity-0 group-hover:after:opacity-100 group-hover:after:scale-x-100 after:transition-all after:duration-300 cursor-pointer transition-colors duration-200"
                >
                  {link}
                </a>
              </div>
            ))}
          </div>

          <div>
            <button
              onClick={goToCvOrder}
              className="rounded-2xl py-3 px-3 text-white text-xs font-medium bg-navy hover:bg-blue hover:-translate-y-1 transition-all duration-500"
            >
              Preorder a Modern CV
            </button>
          </div>
        </div>
      </div>

      {/* Mobile bar */}
      <div className="relative z-[90] flex md:hidden w-full items-center justify-between border border-navy/10 bg-offwhite/80 backdrop-blur-md shadow-md p-2 pl-3 rounded-2xl">
        <Link href="/" className="h-9">
          <img
            src="/tagelabslogo.png"
            alt="TageLabs"
            className="object-contain h-full w-full"
          />
        </Link>

        <button
          aria-label="Toggle menu"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="h-10 w-10 flex items-center justify-center rounded-full text-navy transition-colors duration-200"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Full-screen mobile sheet */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="nav-sheet"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            className="fixed inset-0 z-[70] bg-offwhite flex flex-col items-center justify-center gap-8 px-6 md:hidden"
          >
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={linkListVariants}
              className="flex flex-col items-center gap-8"
            >
              {links.map((link) => (
                <motion.div
                  key={link}
                  variants={linkItemVariants}
                  transition={{ duration: 0.3 }}
                >
                  <a
                    href={`#${link.toLowerCase()}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setMobileOpen(false);
                      scrollToSection(link);
                    }}
                    className="font-display text-2xl font-medium text-neutral-600 hover:text-blue cursor-pointer transition-colors duration-200"
                  >
                    {link}
                  </a>
                </motion.div>
              ))}

              <motion.div
                variants={linkItemVariants}
                transition={{ duration: 0.3 }}
              >
                <button
                  onClick={goToCvOrder}
                  className="rounded-2xl py-3 px-6 text-white text-xs md:text-sm font-medium bg-navy hover:bg-blue hover:-translate-y-1 transition-all duration-500"
                >
                  Preorder a Modern CV
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
