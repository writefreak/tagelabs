"use client";
import { motion } from "framer-motion";
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
  return (
    <section id="about" className="py-28 px-6 bg-white">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20 items-center">
        {/* Left */}
        <div>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="text-blue text-sm font-medium tracking-widest uppercase mb-4 font-body"
          >
            About TageLabs
          </motion.p>

          <motion.h2
            variants={fadeUp}
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="font-display text-4xl md:text-5xl font-semibold text-navy leading-tight mb-8"
          >
            A studio that builds for the long game.
          </motion.h2>

          <motion.div
            variants={fadeUp}
            custom={2}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="w-16 h-0.5 bg-blue mb-8"
          />

          <motion.p
            variants={fadeUp}
            custom={3}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="font-body text-navy/60 leading-relaxed mb-6 text-sm"
          >
            TageLabs is a digital solutions studio founded on one belief — that good design and clean code are not luxuries, they are competitive advantages.
          </motion.p>

          <motion.p
            variants={fadeUp}
            custom={4}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="font-body text-navy/60 leading-relaxed text-sm"
          >
            We work with ambitious businesses and individuals who understand that their digital presence is a direct reflection of their brand. Every project we take on is treated as a partnership, not a transaction.
          </motion.p>

          <div className="mt-10 grid grid-cols-2 gap-6">
            {[
              { label: "Precision", desc: "Every detail is intentional." },
              { label: "Speed", desc: "Fast delivery without compromise." },
              { label: "Clarity", desc: "We deliver innovative results." },
              { label: "Ambition", desc: "We build for scale." },
            ].map((v, i) => (
              <motion.div
                key={v.label}
                custom={5 + i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={viewport}
                className="border-l-2 border-blue pl-4"
              >
                <p className="font-body font-semibold text-navy text-sm">{v.label}</p>
                <p className="font-body text-navy/50 text-xs mt-1">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-col gap-6 ">
          <motion.div
            variants={fadeUp}
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="rounded-2xl  p-10 bg-blue"
          >
            <p className="font-display text-2xl text-white font-semibold leading-snug">
              "Your brand does not exist until someone can find it, feel it, and trust it — that is what we build."
            </p>
            <div className="mt-6 w-10 h-0.5 bg-blue" />
            <p className="mt-4 font-body text-xs text-white/80 tracking-widest uppercase">
              TageLabs Studio
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { value: "100%", label: "Client satisfaction" },
              { value: "Fast", label: "Turnaround times" },
              { value: "Premium", label: "Services offered" },
              { value: "Global", label: "Clientele" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                custom={2 + i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={viewport}
                className="rounded-2xl border border-navy/10 p-6 flex flex-col gap-1 hover:border-blue transition-colors duration-200"
              >
                <p className="font-display text-xl font-semibold text-navy">{stat.value}</p>
                <p className="font-body text-xs text-navy/50">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}