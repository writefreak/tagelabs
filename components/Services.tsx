"use client";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { Layout, FileUser, Palette, Code2 } from "lucide-react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.12,
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const services = [
  {
    icon: Layout,
    title: "Professional Website Design",
    description:
      "We build websites that are clean, intentional and designed so your visitors take action.",
  },
  {
    icon: FileUser,
    title: "CV & Portfolio Optimization",
    description:
      "Professional CVs and portfolio sites that position you for the best opportunities you desire.",
  },
  {
    icon: Palette,
    title: "Minimalist Graphics",
    description:
      "Clean, intentional graphic design for brands that want to communicate clarity and confidence.",
  },
  {
    icon: Code2,
    title: "Frontend Development",
    description:
      "Scalable, performant frontend code using modern frameworks. From component libraries to full product UIs.",
  },
];

export default function Services() {
  return (
    <section id="services" className="md:py-25 py-8 px-6 bg-white">
      <div className="max-w-6xl 2xl:max-w-[1600px] mx-auto">
        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row md:items-end justify-between pb-5 md:pb-16 gap-6"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div>
            <h2 className="font-display text-3xl md:text-5xl font-semibold text-navy max-w-md leading-tight">
              Our services are built for results.
            </h2>
          </div>
          <p className="font-body text-navy/50 max-w-sm text-sm leading-relaxed">
            Every service is designed to move your business forward in a way
            that's visible, measurable, and lasting.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4 2xl:gap-6">
          {services.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.title}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, margin: "-60px" }}
                className="group bg-navy rounded-2xl p-8 2xl:p-10 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_-20px_rgba(21,68,153,0.45)]"
              >
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-6">
                  <Icon className="w-5 h-5 text-navy" strokeWidth={1.75} />
                </div>

                <h3 className="font-display text-sm md:text-base 2xl:text-xl font-semibold text-white mb-3">
                  {s.title}
                </h3>
                <p className="font-body text-white/75 text-xs md:text-sm 2xl:text-base leading-relaxed">
                  {s.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}