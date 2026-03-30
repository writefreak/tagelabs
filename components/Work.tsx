"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";

type Project = {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  live_url: string;
  status: "Published" | "Draft";
};

const accents = ["#4a8fe2", "#112369", "#4a8fe2", "#112369", "#4a8fe2"];

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
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      const { data } = await supabase
        .from("projects")
        .select("id, title, category, description, tags, live_url, status")
        .eq("status", "Published")
        .order("created_at", { ascending: false });
      setProjects(data ?? []);
      setLoading(false);
    }
    fetchProjects();
  }, []);

  return (
    <section id="work" className="py-10 md:py-17 px-6" style={{ background: "#f8f9fc" }}>
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

        {/* Loading skeleton */}
        {loading && (
          <div className="flex flex-col gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-8 md:p-12 animate-pulse">
                <div className="flex items-center gap-8">
                  <div className="hidden md:block w-16 h-16 rounded-full bg-navy/10 shrink-0" />
                  <div className="flex-1 flex flex-col gap-3">
                    <div className="h-3 w-24 bg-navy/10 rounded-full" />
                    <div className="h-5 w-48 bg-navy/10 rounded-full" />
                    <div className="h-3 w-full max-w-md bg-navy/10 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && projects.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-blue/10 flex items-center justify-center mb-6">
              <span className="text-3xl">✦</span>
            </div>
            <h3 className="font-display text-2xl font-semibold text-navy mb-3">
              Something's brewing.
            </h3>
            <p className="font-body text-navy/50 text-sm max-w-xs leading-relaxed">
              Projects are being prepared with care. Check back soon — good work takes time.
            </p>
          </motion.div>
        )}

        {/* Projects list */}
        {!loading && projects.length > 0 && (
          <div className="flex flex-col gap-6">
            {projects.map((project, i) => {
              const accent = accents[i % accents.length];
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
                    style={{ background: accent }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <p className="font-body text-xs text-blue tracking-widest uppercase mb-2">
                      {project.category}
                    </p>
                    <h3 className="font-display text-2xl font-semibold text-navy mb-3">
                      {project.title}
                    </h3>
                    <p className="font-body text-navy/60 text-sm leading-relaxed max-w-lg">
                      {project.description}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 md:justify-end">
                    {project.tags.map((t) => (
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

              return project.live_url ? (
                <Link key={project.id} href={project.live_url} target="_blank" rel="noopener noreferrer">
                  {inner}
                </Link>
              ) : (
                <div key={project.id}>{inner}</div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
