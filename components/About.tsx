"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  animate,
} from "framer-motion";
import { ArrowRight } from "lucide-react";

// TODO: replace with TageLabs' real numbers
const STATS = [
  { value: 3, suffix: "+", label: "Years", desc: "building since 2023" },
  {
    value: 20,
    suffix: "+",
    label: "Projects Shipped",
    desc: "landing pages, sites, portfolios",
  },
  {
    value: 15,
    suffix: "+",
    label: "Clients",
    desc: "across web and design work",
  },
  {
    value: 3,
    suffix: "",
    label: "Team Members",
    desc: "hands-on with every build",
  },
];

function Counter({
  target,
  suffix = "",
  duration = 1.6,
  delay = 0,
}: {
  target: number;
  suffix?: string;
  duration?: number;
  delay?: number;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(0, target, {
      duration,
      delay,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setCount(Math.floor(v)),
    });
    return () => controls.stop();
  }, [isInView, target, duration, delay]);

  return (
    <p
      ref={ref}
      className="font-display text-3xl font-semibold text-navy sm:text-4xl"
    >
      {count.toLocaleString()}
      {suffix}
    </p>
  );
}

function StatGrid() {
  return (
    <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 sm:gap-x-10">
      {STATS.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.2 + i * 0.08 }}
          className="flex flex-col"
        >
          <Counter
            target={stat.value}
            suffix={stat.suffix}
            delay={0.1 + i * 0.1}
          />
          <p className="mt-1 font-sans text-xs md:text-sm text-navy/60">
            {stat.label}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

function ParallaxImage({ className }: { className: string }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  return (
    <motion.div
      ref={wrapperRef}
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={className}
    >
      <motion.img
        src="/code.jpg"
        alt="TageLabs studio"
        style={{ y: imageY }}
        className="absolute left-0 -top-[15%] h-[130%] w-full object-cover"
      />
    </motion.div>
  );
}

export default function About() {
  return (
    <section
      id="about"
      className="bg-white px-6 py-20 sm:py-24 lg:px-10 lg:py-36 border-t border-t-gray-100"
    >
      <div className="mx-auto max-w-6xl gap-16 lg:grid lg:grid-cols-2">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, delay: 0.05 }}
          className="py-3 font-display md:hidden text-2xl md:text-5xl md:max-w-full max-w-xs font-semibold leading-tight text-navy"
        >
          About Us
        </motion.h2>
        <div className="h-1 w-20 md:hidden  bg-blue" />

        <ParallaxImage className="relative hidden md:block aspect-[4/3] w-full overflow-hidden rounded-3xl shadow-sm" />

        <div className="flex flex-col md:gap-12">
          <div className="flex flex-col gap-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, delay: 0.05 }}
              className="mt-3 font-display hidden md:block text-2xl md:text-5xl md:max-w-full max-w-xs font-semibold leading-tight text-navy"
            >
              About Us
            </motion.h2>

            <div className="h-1 w-20 hidden md:block bg-blue" />

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, delay: 0.15 }}
              className="font-sans pt-5 text-sm leading-relaxed text-navy/60 md:max-w-xl"
            >
              We work with startups launching their first digital product, job
              seekers and creatives who need a CV/portfolio that reflects the
              pure quality of their work and businesses that want a website
              experience their users will remember. Whether the need is a single
              landing page, a portfolio or an entire digital revamp, TageLabs
              meets you where you are, thinks with you, and builds for the long
              game.
            </motion.p>
          </div>
          <div className="md:hidden py-6">
            <ParallaxImage className="relative  aspect-[4/3] w-full overflow-hidden rounded-3xl shadow-sm" />
          </div>
          <div className="flex md:items-end">
            <button className="inline-flex  items-center justify-center bg-navy text-white font-medium px-8 py-4 rounded-2xl hover:bg-blue transition-colors duration-200 text-xs md:text-sm">
              Start a project
            </button>
          </div>

          {/* <StatGrid /> */}
        </div>
      </div>
    </section>
  );
}
