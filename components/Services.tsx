"use client";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

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
    number: "01",
    title: "Landing Page Design",
    description:
      "We build landing pages that are clean, intentional and designed so your visitors take action.",
    tags: ["Next.js", "Tailwind", "Framer Motion"],
  },
  {
    number: "02",
    title: "CV & Portfolio Optimization",
    description:
      "Professional CVs and portfolio sites that position you for the best opportunities you desire.",
    tags: ["Design", "Copywriting", "Web"],
  },
  {
    number: "03",
    title: "Minimalist Graphics",
    description:
      "Clean, intentional graphic design for brands that want to communicate clarity and confidence.",
    tags: ["Brand", "Visual Identity", "Design"],
  },
  {
    number: "04",
    title: "Frontend Development",
    description:
      "Scalable, performant frontend code using modern frameworks. From component libraries to full product UIs.",
    tags: ["React", "TypeScript", "React Native"],
  },
];

export default function Services() {
  return (
    <section id="services" className="md:py-25 py-8 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
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
              Services built for <br className="md:hidden" /> results.
            </h2>
          </div>
          <p className="font-body text-navy/50 max-w-sm text-sm leading-relaxed">
            Every service is designed to move your business forward in a way
            that's visible, measurable, and lasting.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 gap-px bg-navy/10">
          {services.map((s, i) => (
            <motion.div
              key={s.number}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, margin: "-60px" }}
              className="bg-white p-10 group hover:bg-offwhite transition-colors duration-300"
            >
              {/* <span className="font-body text-xs text-blue tracking-widest">
                {s.number}
              </span> */}
              <h3 className="font-display text-xl md:text-2xl font-semibold text-navy mt-4 mb-4 group-hover:text-blue transition-colors duration-200">
                {s.title}
              </h3>
              <p className="font-body text-navy/60 text-xs md:text-sm leading-relaxed mb-6">
                {s.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {s.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-medium bg-blue/10 text-blue px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
