"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const viewport = { once: false, margin: "-60px" };

export default function About() {
  const [openAccordion, setOpenAccordion] = useState<"mission" | "vision">(
    "mission",
  );

  const accordionItems = [
    {
      id: "mission" as const,
      title: "Our Mission",
      content:
        "TageLabs is a digital solutions studio founded on the belief that good design and clean code are competitive advantages. Every project we take on is treated as a partnership, not a transaction.",
    },
    {
      id: "vision" as const,
      title: "Our Vision",
      content:
        "We work with ambitious businesses and individuals who understand that their digital presence is a direct reflection of their brand. A studio that builds for the long game.",
    },
  ];

  return (
    <section id="about" className="py-20 md:py-28 px-4 md:px-14 bg-white">
      <div className="max-w-6xl">
        {/* Header Section: Title + Description */}
        <div className="flex flex-col gap-3 md:gap-4">
          <motion.h2
            variants={fadeUp}
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="font-display max-w-sm md:max-w-xl text-4xl sm:text-5xl lg:text-5xl font-semibold text-navy leading-tight"
          >
            A studio that builds for the long game.
          </motion.h2>

          <motion.div
            variants={fadeUp}
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="flex flex-col gap-4"
          >
            <p className="font-sans md:max-w-sm text-navy/60 leading-relaxed text-sm">
              TageLabs is a digital solutions studio founded on the belief that
              good design and clean code are competitive advantages.
            </p>
          </motion.div>
        </div>

        {/* Content Section: 2 Equal Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-7  items-start">
          {/* Overlapping Media Area */}
          <motion.div
            variants={fadeUp}
            custom={2}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="relative w-full h-[380px] sm:h-[450px]"
          >
            {/* Main Image Frame */}
            <div className="absolute top-0 left-0 w-full h-[85%] rounded-3xl overflow-hidden bg-offwhite border border-navy/10 shadow-sm">
              <img
                src="/tageimg.png"
                alt="TageLabs Studio"
                className="h-full w-full object-cover"
              />
            </div>
          </motion.div>

          {/* Accordion List */}
          <div className="flex flex-col gap-4 w-full">
            {accordionItems.map((item, index) => {
              const isOpen = openAccordion === item.id;
              return (
                <motion.div
                  key={item.id}
                  variants={fadeUp}
                  custom={3 + index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewport}
                  className={`rounded-2xl transition-all duration-300 border ${
                    isOpen
                      ? "bg-offwhite border-navy/10 shadow-sm p-6 lg:p-8"
                      : "bg-white border-navy/10 hover:border-blue/50 p-6"
                  }`}
                >
                  <button
                    onClick={() => setOpenAccordion(item.id)}
                    className="w-full flex items-center justify-between text-left focus:outline-none"
                  >
                    <h3 className="font-display text-lg lg:text-2xl font-semibold text-navy">
                      {item.title}
                    </h3>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <p className="font-body text-navy/70 text-xs md:text-sm leading-relaxed mt-4">
                          {item.content}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
