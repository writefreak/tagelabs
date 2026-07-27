"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function TestHero() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-40%", "40%"]);

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative flex md:h-screen h-[500px] items-center overflow-hidden"
    >
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* solid navy overlay sits above the image */}
        <div className="absolute inset-0 z-10 bg-[#112369]/70" />
        <motion.img
          src="/tagebg.png"
          alt="TageLabs Digital Solutions"
          style={{ y: imageY }}
          className="h-[140%] w-full object-cover absolute -top-[20%] left-0"
        />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto w-full max-w-7xl px-4 pt-28 pb-20 lg:px-14 lg:pt-28"
      >
        <div className="max-w-4xl md:max-w-3xl">
          <div className="flex flex-col gap-3">
            <motion.h1
              variants={item}
              className="font-display text-center md:text-left text-2xl font-semibold leading-[1.08] text-white sm:text-4xl lg:text-7xl"
            >
              Transforming Brands With Scalable Digital Solutions.
            </motion.h1>
            <p className="text-xs text-center md:text-left md:text-sm text-gray-300 max-w-sm font-sans">
              At Tagelabs, we design, build, and scale digital experiences that
              turn ambitious ideas into measurable business growth.
            </p>
          </div>
          <motion.div
            variants={item}
            className="pt-6 md:pt-10 flex flex-col sm:flex-row md:items-center gap-2 md:gap-4"
          >
            <button className="inline-flex  items-center justify-center bg-navy text-white font-medium px-8 py-4 rounded-2xl hover:bg-blue transition-colors duration-200 text-xs md:text-sm">
              Start a project
            </button>
            <button className="inline-flex items-center justify-center border border-white/40 text-white font-medium px-8 py-4 rounded-2xl hover:border-blue hover:text-blue transition-colors duration-200 text-xs md:text-sm">
              Our Brand Story
            </button>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
