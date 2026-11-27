"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { ArrowRight, X } from "lucide-react";

const links = ["About", "Services", "Work", "Reviews", "Blogs", "Contact"];

const listVariants: Variants = {
  hidden: {
    transition: { staggerChildren: 0.04, staggerDirection: -1 },
  },
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
};
const WHATSAPP_NUMBER = "2349041281560";
const WHATSAPP_MESSAGE =
  "Hi TageLabs, I'd like to start a project with you. Can we talk?";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  WHATSAPP_MESSAGE,
)}`;

const itemVariants: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0 },
};

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pendingAction = useRef<(() => void) | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, close]);

  const goToSection = (id: string) => {
    const sectionId = id.toLowerCase();

    pendingAction.current = () => {
      if (pathname === "/") {
        document
          .getElementById(sectionId)
          ?.scrollIntoView({ behavior: "smooth" });
      } else {
        router.push(`/#${sectionId}`);
      }
    };

    close();
  };

  const goToCvOrder = () => {
    pendingAction.current = () => router.push("/cv-order");
    close();
  };

  const runPendingAction = () => {
    pendingAction.current?.();
    pendingAction.current = null;
  };

  return (
    <>
      {/* <div className="fixed top-0 left-0 right-0 z-[60] flex items-center justify-between px-4 pt-5 md:px-14 md:pt-7 2xl:px-24"> */}
      <div className="absolute top-0 left-0 right-0 z-[60] flex items-center justify-between px-4 pt-5 md:px-14 md:pt-7 2xl:px-24">
        <Link
          href="/"
          className={`h-12 w-32 md:h-14 md:w-36 ${pathname === "/blogs" ? "hidden" : "block"}`}
        >
          <img
            src="/tagelabslogo.png"
            alt="TageLabs"
            className="h-full w-auto object-contain"
          />
        </Link>

        <div
          className={`flex items-start ${pathname === "/blogs" ? "ml-auto" : ""}`}
        >
          <motion.button
            type="button"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen(true)}
            whileTap={{ scale: 0.95 }}
            className="group flex h-10 w-10 md:h-12 md:w-12 items-center justify-center text-navy transition-colors duration-200 hover:text-blue"
          >
            <span className="flex w-6 flex-col items-end gap-[7px]">
              <span className="h-[2px] w-full rounded-full bg-current" />
              <span className="h-[2px] w-3/5 rounded-full bg-current transition-all duration-300 ease-out group-hover:w-full" />
            </span>
          </motion.button>
        </div>
      </div>

      <AnimatePresence onExitComplete={runPendingAction}>
        {open && (
          <>
            <motion.div
              key="nav-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={close}
              aria-hidden="true"
              className="fixed inset-0 z-[70] bg-navy/40 backdrop-blur-sm"
            />

            <motion.aside
              key="nav-sheet"
              role="dialog"
              aria-modal="true"
              aria-label="Site navigation"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 32 }}
              className="fixed inset-y-0 right-0 z-[80] flex w-full flex-col bg-offwhite px-8 py-6 shadow-2xl md:max-w-md"
            >
              <div className="flex items-center justify-between">
                {/* <img
                  src="/tagelabslogo.png"
                  alt="TageLabs"
                  className="h-10 w-auto object-contain"
                /> */}

                <motion.button
                  type="button"
                  aria-label="Close menu"
                  onClick={close}
                  whileHover={{ rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="flex h-11 w-11 items-center justify-center rounded-full text-navy transition-colors duration-200 hover:text-blue"
                >
                  <X size={22} />
                </motion.button>
              </div>

              <motion.nav
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={listVariants}
                className="flex flex-1 flex-col justify-center items-center gap-6"
              >
                {links.map((link) => (
                  <motion.div
                    key={link}
                    variants={itemVariants}
                    transition={{ duration: 0.3 }}
                  >
                    <a
                      href={`#${link.toLowerCase()}`}
                      onClick={(event) => {
                        event.preventDefault();
                        goToSection(link);
                      }}
                      className="inline-block text-center cursor-pointer text-3xl font-medium text-navy/70 transition-all duration-200 hover:translate-x-2 hover:text-blue"
                    >
                      {link}
                    </a>
                  </motion.div>
                ))}

                <motion.div
                  variants={itemVariants}
                  transition={{ duration: 0.3 }}
                  className="pt-4 md:hidden"
                >
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 rounded-md bg-navy px-5 py-3 text-xs font-medium text-white transition-colors duration-200 hover:bg-blue md:gap-2 md:px-8 md:py-4 md:text-sm"
                  >
                    Start a project
                    <ArrowRight size={14} />
                  </a>
                </motion.div>
              </motion.nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
