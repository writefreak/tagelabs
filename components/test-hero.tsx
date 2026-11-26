"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";

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

const imageReveal = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const WHATSAPP_NUMBER = "2349041281560";
const WHATSAPP_MESSAGE =
  "Hi TageLabs, I'd like to start a project with you. Can we talk?";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  WHATSAPP_MESSAGE,
)}`;

const BRAND_STORY_PATH = "/brand-story.pdf";

export default function TestHero() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  async function handleBrandStoryDownload() {
    try {
      const res = await fetch(BRAND_STORY_PATH);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "TageLabs-Brand-Story.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Brand story download failed:", err);
    }
  }

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative overflow-hidden md:flex md:min-h-screen md:items-center"
    >
      <div className="absolute inset-0">
        <img
          src="/bg.jpg"
          alt=""
          className="h-full w-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/50 to-white/10" />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="relative mx-auto grid w-full max-w-7xl items-center gap-8 px-4 pb-16 pt-32 md:grid-cols-2 md:gap-10 md:px-14 md:pt-24"
      >
        <div className="contents md:flex md:flex-col">
          <div className="flex flex-col gap-4">
            <motion.h1
              variants={item}
              className="font-jet text-left text-[38px] leading-[1.05] tracking-tight text-navy md:text-6xl font-semibold md:leading-[1.08]"
            >
              Transforming Brands With Scalable Digital Solutions
            </motion.h1>

            <motion.p
              variants={item}
              className="max-w-sm text-left font-sans text-sm leading-relaxed text-neutral-600"
            >
              At Tagelabs, we design, build, and scale digital experiences that
              turn ambitious ideas into measurable business growth.
            </motion.p>
          </div>

          <motion.div
            variants={item}
            className="flex flex-col items-start gap-3 md:max-w-full md:flex-row md:items-center md:pt-5"
          >
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 rounded-md bg-navy px-5 py-3 text-xs font-medium text-white transition-colors duration-200 hover:bg-blue md:gap-2 md:px-8 md:py-4 md:text-sm"
            >
              Start a project
              <ArrowRight size={14} />
            </a>
          </motion.div>
        </div>

        {/* <motion.div
          variants={imageReveal}
          className="relative h-[340px] overflow-hidden rounded-3xl sm:h-[440px] md:h-[560px]"
        >
          <motion.img
            src="/type.png"
            alt="TageLabs Digital Solutions"
            loading="eager"
            decoding="sync"
            fetchPriority="high"
            style={{ y: imageY }}
            className="absolute inset-x-0 -top-[10%] h-[120%] w-full object-cover"
          />
        </motion.div> */}
        <motion.div
          variants={imageReveal}
          className="relative order-2 h-[340px] overflow-hidden rounded-xl sm:h-[440px] md:order-none md:h-[520px]"
        >
          <motion.video
            src="/typev.mp4"
            poster="/typev.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            style={{ y: imageY }}
            className="absolute inset-x-0 -top-[10%] h-[120%] w-full object-cover"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
