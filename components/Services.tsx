"use client";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import type { Variants } from "framer-motion";
import { useRef } from "react";
import { Layout, FileUser, Palette, Code2, Globe } from "lucide-react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const services = [
  {
    icon: Globe,
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
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative overflow-hidden md:py-28 py-16 px-6 border-t border-t-gray-100"
    >
      <motion.div
        style={{ y: imageY }}
        className="absolute inset-0 -z-10 h-[130%] -top-[15%]"
      >
        <Image
          src="/office.jpg"
          alt=""
          fill
          priority={false}
          className="object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 -z-10 bg-black/60" />

      <div className="max-w-6xl md:max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row md:items-end justify-between pb-5 md:pb-16 gap-6"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex flex-col gap-2 pb-2">
            <h2 className="font-display text-3xl md:text-5xl font-semibold text-white leading-tight">
              Explore Our services
            </h2>

            <p className="font-body text-white/70 max-w-sm text-xs md:text-sm leading-relaxed">
              Every service is designed to move your business forward in a way
              that's visible, measurable, and lasting.
            </p>
          </div>
        </motion.div>

        {/* Grid */}
        <div className="grid md:grid-cols-4 gap-2 md:gap-4">
          {services.map((s) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, margin: "-60px" }}
                className="group border border-white/25 bg-white/10 backdrop-blur-md shadow-lg rounded-2xl p-8 2xl:p-10 transition-all duration-300 hover:-translate-y-1 hover:bg-white/15"
              >
                <div className="w-12 h-12 rounded-full bg-blue/30 flex items-center justify-center mb-6">
                  <Icon className="w-5 h-5 text-white" strokeWidth={1.75} />
                </div>

                <h3 className="font-jet text-sm md:text-base 2xl:text-xl font-semibold text-white mb-3">
                  {s.title}
                </h3>
                <p className="font-body text-white/70 text-xs md:text-sm 2xl:text-base leading-relaxed">
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
