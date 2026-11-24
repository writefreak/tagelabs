"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";

const STATS = [
  { value: 20, suffix: "+", label: "PROJECTS SHIPPED" },
  { value: 15, suffix: "+", label: "HAPPY CLIENTS" },
];

const WHATSAPP_NUMBER = "2349041281560";
const WHATSAPP_MESSAGE =
  "Hi TageLabs, I'd like to start a project with you. Can we talk?";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  WHATSAPP_MESSAGE,
)}`;

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
  const isInView = useInView(ref, { once: true, margin: "-60px" });
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
      className="font-display text-4xl font-semibold tracking-tight text-neutral-950 sm:text-5xl"
    >
      {count.toLocaleString()}
      {suffix}
    </p>
  );
}

export default function About() {
  return (
    <section
      id="about"
      className="overflow-hidden bg-[#0037FF] px-6 py-20 text-white sm:px-10 sm:py-28 lg:py-32"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10">
        {/* Left Column */}
        <div className="flex flex-col items-start lg:col-span-5">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45 }}
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/95"
          >
            <svg
              width="10"
              height="10"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M6 0L7.35 4.65L12 6L7.35 7.35L6 12L4.65 7.35L0 6L4.65 4.65L6 0Z"
                fill="currentColor"
              />
            </svg>
            <span>OUR STUDIO</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.06 }}
            className="mt-4 font-display text-5xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-[4.25rem]"
          >
            About Us
          </motion.h2>

          {/* Left Description */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="mt-5 max-w-md font-sans text-base leading-relaxed text-white/85 sm:text-[17px]"
          >
            From strategy to execution, we bring the technical depth and design
            clarity to build digital products that last.
          </motion.p>

          {/* Split Button */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="mt-9"
          >
            <button
              onClick={() =>
                window.open(WHATSAPP_URL, "_blank", "noopener,noreferrer")
              }
              className="group inline-flex items-stretch gap-[2px] text-sm font-medium text-neutral-950 focus:outline-none"
            >
              <span className="flex items-center bg-white px-7 py-4 transition-colors duration-200 group-hover:bg-neutral-100">
                Start a project
              </span>
              <span className="flex items-center justify-center bg-white px-4 py-4 text-neutral-600 transition-all duration-200 group-hover:bg-neutral-100 group-hover:text-neutral-950">
                <ArrowRight
                  size={16}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </span>
            </button>
          </motion.div>
        </div>

        {/* Right Feature Card */}
        <motion.div
          initial={{ opacity: 0, y: 24, rotate: 0 }}
          whileInView={{ opacity: 1, y: 0, rotate: 0.6 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-7"
        >
          <div className="grid grid-cols-1 overflow-hidden bg-white p-3 text-neutral-950 shadow-[0_24px_60px_rgba(0,18,110,0.32)] sm:p-4 md:grid-cols-12 md:gap-4">
            {/* Card Text & Metrics Column */}
            <div className="flex flex-col justify-between p-4 sm:p-6 md:col-span-6">
              <div>
                <h3 className="font-display text-2xl font-medium tracking-tight text-neutral-950 sm:text-3xl">
                  TageLabs Studio
                </h3>
                <p className="mt-3.5 font-sans text-sm leading-relaxed text-neutral-500 sm:text-[15px]">
                  We work with startups launching their first digital product,
                  creatives who need a portfolio that reflects the pure quality
                  of their work, and businesses that want a web experience users
                  remember.
                </p>
              </div>

              <div className="mt-8 border-t border-neutral-200 pt-7">
                {/* Octagon Action Icon */}
                <button
                  onClick={() =>
                    window.open(WHATSAPP_URL, "_blank", "noopener,noreferrer")
                  }
                  aria-label="Start a project with TageLabs"
                  className="group flex h-11 w-11 items-center justify-center bg-[#0037FF] text-white transition-transform duration-200 hover:scale-105"
                  style={{
                    clipPath:
                      "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
                  }}
                >
                  <ArrowUpRight
                    size={18}
                    className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </button>

                {/* Two-Column Stats */}
                <div className="mt-8 grid grid-cols-2 gap-6">
                  {STATS.map((stat, i) => (
                    <div key={stat.label} className="flex flex-col">
                      <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-400">
                        {stat.label}
                      </span>
                      <div className="mt-2">
                        <Counter
                          target={stat.value}
                          suffix={stat.suffix}
                          delay={0.15 + i * 0.12}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Card Right Image Column */}
            <div className="relative min-h-[300px] overflow-hidden bg-neutral-100 sm:min-h-[360px] md:col-span-6 md:min-h-[430px]">
              <img
                src="/type.png"
                alt="TageLabs studio workspace"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
