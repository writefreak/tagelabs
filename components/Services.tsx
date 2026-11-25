"use client";
import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Palette, Code2, Globe, FileUser } from "lucide-react";

type Service = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const services: Service[] = [
  {
    icon: Globe,
    title: "Professional Website Design",
    description:
      "We build websites that are clean and intentional, and we shape every page so that the people visiting it understand what you offer and feel ready to take the next step.",
  },
  {
    icon: FileUser,
    title: "CV & Portfolio Optimization",
    description:
      "A well made CV and portfolio site presents your experience clearly and positions you for the opportunities you actually want, rather than the ones that happen to come along.",
  },
  {
    icon: Palette,
    title: "Minimalist Graphics",
    description:
      "Graphic design for brands that want to communicate with clarity and confidence, using restrained layouts and considered detail instead of decoration for its own sake.",
  },
  {
    icon: Code2,
    title: "Frontend Development",
    description:
      "Scalable and performant frontend code built on modern frameworks, covering everything from reusable component libraries to complete product interfaces.",
  },
];

const easing = [0.22, 1, 0.36, 1] as const;
const itemViewport = { once: true, margin: "0px 0px -120px 0px" };

function TimelineItem({
  service,
  isRight,
}: {
  service: Service;
  isRight: boolean;
}) {
  const Icon = service.icon;

  return (
    <li className="relative pb-5 pl-12 last:pb-0 md:grid md:grid-cols-2 md:gap-x-20 md:pl-0">
      <div className="absolute left-0 top-0 md:left-1/2 md:-translate-x-1/2">
        <motion.div
          className="flex h-10 w-10 items-center justify-center rounded-md border-2 border-white/20 bg-blue text-white shadow-lg md:h-12 md:w-12"
          initial={{ opacity: 0, scale: 0.6 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={itemViewport}
          transition={{ duration: 0.45, ease: easing }}
        >
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </motion.div>
      </div>

      <motion.div
        className={`rounded-md border border-white/25 bg-white/10 p-6 shadow-lg backdrop-blur-md md:p-8 ${
          isRight ? "md:col-start-2" : ""
        }`}
        initial={{ opacity: 0, x: isRight ? 32 : -32 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={itemViewport}
        transition={{ duration: 0.6, delay: 0.1, ease: easing }}
      >
        <h3 className="font-display text-base font-semibold text-white md:text-xl">
          {service.title}
        </h3>
        <p className="mt-3 font-sans text-xs leading-relaxed text-white/70 md:text-sm">
          {service.description}
        </p>
      </motion.div>
    </li>
  );
}

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLOListElement>(null);

  const { scrollYProgress: sectionProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(sectionProgress, [0, 1], ["-15%", "15%"]);

  const { scrollYProgress: timelineProgress } = useScroll({
    target: timelineRef,
    offset: ["start 70%", "end 60%"],
  });

  const progress = useSpring(timelineProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001,
  });

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative isolate overflow-hidden border-t border-gray-100 px-4 py-24 md:px-14 md:py-28"
    >
      <motion.img
        src="/tagebg.png"
        alt=""
        style={{ y: imageY }}
        className="absolute -top-[15%] left-0 -z-20 h-[130%] w-full object-cover"
      />
      <div aria-hidden className="absolute inset-0 -z-10 bg-navy/60" />

      <div className="mx-auto max-w-5xl">
        <motion.div
          className="mx-auto mb-14 max-w-2xl md:mb-20 md:text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -80px 0px" }}
          transition={{ duration: 0.6, ease: easing }}
        >
          <h2 className="font-display text-4xl font-semibold leading-tight text-white md:text-5xl">
            Explore our services
          </h2>

          <p className="mx-auto mt-5 max-w-xl font-sans text-xs leading-relaxed text-white/70 md:text-sm">
            Whether the need is a single landing page, a portfolio or an entire
            digital revamp, TageLabs meets you where you are, thinks with you,
            and builds for the long game.
          </p>
        </motion.div>

        <ol ref={timelineRef} className="relative">
          <div
            aria-hidden
            className="absolute bottom-0 left-5 top-5 w-0.5 -translate-x-1/2 bg-white/25 md:left-1/2 md:top-6"
          >
            <motion.div
              style={{ scaleY: progress }}
              className="h-full w-full origin-top bg-white"
            />
          </div>

          {services.map((service, index) => (
            <TimelineItem
              key={service.title}
              service={service}
              isRight={index % 2 === 1}
            />
          ))}
        </ol>
      </div>
    </section>
  );
}
