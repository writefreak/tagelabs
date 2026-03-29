"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

const works = [
  {
    title: "The Scribblr",
    category: "Full-stack Development",
    description:
      "Designed and developed a full-featured editorial blog platform with category-based browsing, trending stories, an editor's picks section, and a clean reading experience across devices.",
    tech: ["Next.js", "TypeScript"],
    accent: "#4a8fe2",
    href: "https://thescribblr.vercel.app",
  },
  {
    title: "K-Graphics",
    category: "full-stack development",
    description:
      "A creative design hub built to showcase and deliver intentional visual work — from brand identities to digital assets. Where strategy meets aesthetics.",
    tech: ["Next.js", "TypeScript", "Tailwind", "Prisma"],
    accent: "#112369",
    href: "https://kgraphics.vercel.app",
  },
  {
    title: "Youngs Solutions",
    category: "Frontend Development",
    description:
      "Collaborated on the frontend of a full-stack property and housing services platform. Delivered a clean, responsive UI across multiple sections.",
    tech: ["Next.js", "TypeScript"],
    accent: "#4a8fe2",
    href: "https://youngssolution.com/",
  },
  {
    title: "Acessyn",
    category: "React Native · Collaborator",
    description:
      "Built the cross-platform user app for a service marketplace platform using React Native, Expo, and NativeWind.",
    tech: ["React Native", "Expo", "TypeScript", "NativeWind"],
    accent: "#112369",
    href: null,
  },
  {
    title: "CV & Brand Assets",
    category: "CV Optimization · Graphics",
    description:
      "Designed modern, ATS-friendly CVs and minimalist brand assets for professionals across various industries.",
    tech: ["Design", "Brand", "Typography"],
    accent: "#4a8fe2",
    href: null,
  },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export default function Work() {
  return (
    <section id="work" className="py-28 px-6" style={{ background: "#f8f9fc" }}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-blue text-sm font-medium tracking-widest uppercase mb-4 font-body">
            Our Recent Projects
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-navy max-w-md leading-tight">
            Projects Built with Intention.
          </h2>
        </motion.div>

        <div className="flex flex-col gap-6">
          {works.map((work, i) => {
            const inner = (
              <motion.div
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, margin: "-60px" }}
                className="bg-white rounded-2xl p-8 md:p-12 flex flex-col md:flex-row md:items-center gap-8 group hover:shadow-md transition-shadow duration-300"
              >
                {/* Number */}
                <div
                  className="hidden md:flex items-center justify-center w-16 h-16 rounded-full text-white font-display font-semibold text-lg shrink-0"
                  style={{ background: work.accent }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <p className="font-body text-xs text-blue tracking-widest uppercase mb-2">
                    {work.category}
                  </p>
                  <h3 className="font-display text-2xl font-semibold text-navy mb-3">
                    {work.title}
                  </h3>
                  <p className="font-body text-navy/60 text-sm leading-relaxed max-w-lg">
                    {work.description}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 md:justify-end">
                  {work.tech.map((t) => (
                    <span
                      key={t}
                      className="text-xs font-medium border border-navy/15 text-navy/60 px-3 py-1 rounded-full"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </motion.div>
            );

            return work.href ? (
              <Link key={i} href={work.href} target="_blank" rel="noopener noreferrer">
                {inner}
              </Link>
            ) : (
              <div key={i}>{inner}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
}