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
      className="relative overflow-hidden md:flex h-[600px] md:h-screen md:items-center"
    >
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* solid navy overlay sits above the image */}
        <div className="absolute inset-0 z-10 bg-black/70" />
        <motion.img
          src="/tagebg.png"
          alt="TageLabs Digital Solutions"
          style={{ y: imageY }}
          className="h-full w-full object-cover absolute  left-0"
        />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto w-full max-w-7xl px-6 pt-36  md:px-14 md:pt-28 md:pb-20"
      >
        <div className="max-w-4xl md:max-w-2xl">
          <div className="flex flex-col  gap-3">
            <motion.h1
              variants={item}
              className="font-jet text-left text-[38px] font-extrabold leading-[1.05] tracking-tight text-white md:text-6xl md:font-semibold md:leading-[1.08]"
            >
              Transforming <br className="md:hidden" /> Brands With{" "}
              <br className="md:hidden" /> Scalable Digital Solutions
            </motion.h1>

            <motion.p
              variants={item}
              className="text-xs text-left leading-relaxed text-neutral-300 md:mt-0 md:max-w-sm md:w-full w-64 md:text-sm font-sans"
            >
              At Tagelabs, we design, build, and scale digital experiences that
              turn ambitious ideas into measurable business growth.
            </motion.p>
          </div>

          <motion.div
            variants={item}
            className=" flex flex-col md:flex-row md:items-center gap-4 md:pt-10"
          >
            <button className="inline-flex md:items-center md:justify-center bg-navy text-white font-medium px-8 py-4 rounded-2xl hover:bg-blue transition-colors duration-200 text-xs md:text-sm">
              Start a project
            </button>
            <button className="inline-flex md:items-center md:justify-center border border-white/40 text-white font-medium px-8 py-4 rounded-2xl hover:border-blue hover:text-blue transition-colors duration-200 text-xs md:text-sm">
              Our Brand Story
            </button>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
