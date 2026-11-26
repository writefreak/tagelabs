"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  MotionValue,
  useInView,
  useScroll,
  useSpring,
  useTransform,
  animate,
} from "framer-motion";
import { ArrowRight } from "lucide-react";

interface AboutCardData {
  id: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  stats?: { value: number; suffix: string; label: string }[];
}

const ABOUT_CARDS: AboutCardData[] = [
  {
    id: "studio",
    title: "Who We Are",
    description:
      "We work with startups launching their first digital product, creatives who need a portfolio that reflects the pure quality of their work, and businesses that want a web experience users remember.",
    image: "/type.png",
    imageAlt: "TageLabs studio workspace",
    stats: [
      { value: 20, suffix: "+", label: "PROJECTS SHIPPED" },
      { value: 15, suffix: "+", label: "HAPPY CLIENTS" },
    ],
  },
  {
    id: "mission",
    title: "Our Mission",
    description: `We aim to swiftly bridge the gap between vision and execution by delivering
design and innovative solutions that are visually compelling.
Through every project we embark on, we treat every client as
a partner while building something that works,
communicates precisely, and lasts. `,
    image: "/tageimg2.png",
    imageAlt: "TageLabs design and engineering detail",
  },
  {
    id: "vision",
    title: "Our Vision",
    description: `We envision a world where no ambitious business or individual is invisible
online. We exist to make intentional, high-performance digital
work the standard for growing businesses and individuals
across Nigeria and beyond. `,
    image: "/tageimg2.png",
    imageAlt: "TageLabs design and engineering detail",
  },
];

const WHATSAPP_NUMBER = "2349041281560";
const WHATSAPP_MESSAGE =
  "Hi TageLabs, I'd like to start a project with you. Can we talk?";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  WHATSAPP_MESSAGE,
)}`;

const MOBILE_QUERY = "(max-width: 767px)";
const MOBILE_HOLD = 0.5;
const DESKTOP_HOLD = 0;
const MOBILE_SCROLL_PER_CARD = 130;
const DESKTOP_SCROLL_PER_CARD = 100;

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(MOBILE_QUERY);
    const update = () => setIsMobile(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return isMobile;
}

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
      className="font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl"
    >
      {count.toLocaleString()}
      {suffix}
    </p>
  );
}

function AboutCardPanel({
  card,
  index,
  total,
  progress,
  hold,
}: {
  card: AboutCardData;
  index: number;
  total: number;
  progress: MotionValue<number>;
  hold: number;
}) {
  const first = index === 0;
  const last = index === total - 1;
  const segment = 1 / total;

  const inRange = first
    ? [0, 0.001]
    : [(index - 1) * segment + segment * hold, index * segment];
  const inOut = first ? [1, 1] : [0, 1];
  const outRange = last
    ? [0.998, 1]
    : [index * segment + segment * hold, (index + 1) * segment];
  const outOut = last ? [1, 1] : [1, 0];

  const enter = useTransform(progress, inRange, inOut);
  const exit = useTransform(progress, outRange, outOut);

  const clip = useTransform(enter, (v) => `inset(${(1 - v) * 100}% 0% 0% 0%)`);
  const imgScale = useTransform(enter, [0, 1], [1.25, 1]);
  const textY = useTransform(enter, [0, 1], [60, 0]);
  const textOpacity = useTransform(enter, [0.35, 1], [0, 1]);
  const panelScale = useTransform(exit, [0, 1], [0.9, 1]);
  const dim = useTransform(exit, [0, 1], [0.55, 0]);

  return (
    <motion.div
      className="relative col-start-1 row-start-1 flex items-stretch md:absolute md:inset-0 md:items-center"
      style={{ zIndex: index + 1, scale: panelScale }}
    >
      <motion.div
        className="relative grid w-full grid-cols-1 rounded-md overflow-hidden bg-[#4486E0] p-3 text-white shadow-[0_24px_60px_rgba(0,18,110,0.32)] sm:p-4 md:grid-cols-12 md:gap-4"
        style={{ clipPath: clip }}
      >
        {/* Card Text & Metrics Column */}
        <motion.div
          className="flex flex-col justify-between p-4 sm:p-6 md:col-span-6"
          style={{ y: textY, opacity: textOpacity }}
        >
          <div>
            <h3 className="font-display text-2xl font-medium tracking-tight text-white sm:text-3xl">
              {card.title}
            </h3>
            <p className="mt-3.5 font-sans text-xs leading-relaxed text-neutral-100 md:text-sm">
              {card.description}
            </p>
          </div>

          <div className="mt-8 border-t border-white/20 pt-7">
            {/* Two-Column Stats */}
            <div className="mt-8 grid grid-cols-2 gap-6">
              {card.stats?.map((stat, i) => (
                <div key={stat.label} className="flex flex-col">
                  <span className="font-sans text-[11px] font-semibold uppercase text-neutral-200">
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
        </motion.div>

        {/* Card Right Image Column */}
        <div className="relative min-h-[220px] overflow-hidden bg-neutral-100 sm:min-h-[340px] md:col-span-6 md:min-h-[430px]">
          <motion.img
            src={card.image}
            alt={card.imageAlt}
            className="h-full w-full object-cover"
            style={{ scale: imgScale }}
          />
        </div>

        {/* Retreat Overlay When Covered by Next Card */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[#1d4ed8]"
          style={{ opacity: dim }}
        />
      </motion.div>
    </motion.div>
  );
}

export default function About() {
  const total = ABOUT_CARDS.length;
  const trackRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    mass: 0.4,
  });

  const hold = isMobile ? MOBILE_HOLD : DESKTOP_HOLD;
  const scrollPerCard = isMobile
    ? MOBILE_SCROLL_PER_CARD
    : DESKTOP_SCROLL_PER_CARD;

  return (
    <section
      id="about"
      className="px-6 py-24 text-white md:px-14 sm:py-28 lg:py-36"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-10">
        {/* Left Column */}
        <div className="flex flex-col items-start lg:sticky lg:top-1/2 lg:col-span-5 lg:-translate-y-1/2">
          {/* Main Heading */}
          <h2 className="mt-4 font-display text-navy text-4xl font-semibold leading-[1.05] tracking-tight text-blue-950 md:text-5xl">
            About Us
          </h2>

          {/* Left Description */}
          <p className="mt-5 max-w-md font-sans text-xs leading-relaxed text-neutral-700 md:text-sm">
            From strategy to execution, we pair technical depth and design
            clarity to build lasting digital products for ambitious teams and
            creators in Nigeria and beyond.
          </p>

          {/* Split Button */}
          <div className="mt-9 md:block hidden">
            <button
              onClick={() =>
                window.open(WHATSAPP_URL, "_blank", "noopener,noreferrer")
              }
              className="group inline-flex items-stretch gap-[2px] text-sm font-medium text-neutral-950 focus:outline-none"
            >
              <span className="flex items-center gap-2 rounded-md bg-navy px-7 py-4 text-white transition-colors duration-200 group-hover:bg-neutral-100">
                Start a project{" "}
                <ArrowRight
                  size={16}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </span>
            </button>
          </div>
        </div>

        {/* Right Feature Card Pinned Stack */}
        <div
          ref={trackRef}
          style={{ height: `${total * scrollPerCard}svh` }}
          className="relative lg:col-span-7"
        >
          <div className="sticky top-20 flex items-center md:min-h-[480px] lg:top-28">
            <div className="relative grid w-full md:block md:min-h-[460px]">
              {ABOUT_CARDS.map((card, i) => (
                <AboutCardPanel
                  key={`${card.id}-${hold}`}
                  card={card}
                  index={i}
                  total={total}
                  progress={progress}
                  hold={hold}
                />
              ))}

              <motion.div className="md:hidden pt-7 flex flex-col items-start gap-3 md:max-w-full md:flex-row md:items-center md:pt-5">
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
          </div>
        </div>
      </div>
    </section>
  );
}
