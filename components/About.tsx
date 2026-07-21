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
    <section id="about" className="py-20 md:py-28 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header Section: Title on Left, Subtext & Action on Right */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16">
          <motion.h2
            variants={fadeUp}
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-navy leading-tight max-w-xl"
          >
            A studio that builds for the long game.
          </motion.h2>

          <motion.div
            variants={fadeUp}
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-start sm:items-center md:items-start lg:items-center gap-6 max-w-lg"
          >
            <p className="font-body text-navy/60 leading-relaxed text-sm">
              TageLabs is a digital solutions studio founded on the belief that
              good design and clean code are competitive advantages.
            </p>
            <a
              href="#contact"
              className="px-6 py-3 bg-blue text-white font-body font-medium text-sm rounded-full whitespace-nowrap hover:bg-navy transition-colors duration-300 shadow-sm"
            >
              Learn More
            </a>
          </motion.div>
        </div>

        {/* Content Layout: Overlapping Media Grid (Left) + Accordion (Right) */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Overlapping Image Container */}
          <motion.div
            variants={fadeUp}
            custom={2}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="lg:col-span-6 relative w-full h-[380px] sm:h-[450px]"
          >
            {/* Primary Background Card/Image */}
            <div className="absolute top-0 left-0 w-[80%] h-[85%] rounded-3xl overflow-hidden bg-offwhite border border-navy/10 shadow-sm flex items-center justify-center p-8">
              <div className="text-center">
                <img src="" alt="" />
              </div>
            </div>

            {/* Overlapping Secondary Card */}
            <div className="absolute bottom-0 right-0 w-[60%] h-[65%] rounded-3xl overflow-hidden bg-navy p-6 lg:p-8 flex flex-col justify-between shadow-xl border-4 border-white">
              <p className="font-display text-lg lg:text-xl text-white font-semibold leading-snug">
                "Your brand doesn't exist until someone can find it, feel it,
                and trust it."
              </p>
              <div>
                <div className="w-8 h-0.5 bg-blue mb-2" />
                <p className="font-body text-[10px] text-white/70 tracking-widest uppercase">
                  Endwell Heritage
                </p>
              </div>
            </div>
          </motion.div>

          {/* Accordion Column */}
          <div className="lg:col-span-6 flex flex-col gap-4">
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
                    <h3 className="font-display text-base lg:text-3xl font-semibold text-navy">
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
                        <p className="font-body text-navy/70 text-xs md:text-sm lg:text-base leading-relaxed mt-4">
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
