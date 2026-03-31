"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { useEffect, useState, useRef } from "react";
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

function toAbsoluteUrl(url: string) {
  if (!url) return url;
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

const PAGE_SIZE = 3;

export default function Work() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

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

  const totalPages = Math.ceil(projects.length / PAGE_SIZE);
  const paginated = projects.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);
  const showPagination = projects.length > PAGE_SIZE;

  function handlePageChange(next: number) {
    setPage(next);
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  return (
    <section id="work" className="py-10 md:py-17 px-6" style={{ background: "#ffff" }}>
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
          <>
            <div ref={scrollRef} className="flex flex-col gap-6">
              {paginated.map((project, i) => {
                const globalIndex = page * PAGE_SIZE + i;
                const accent = accents[globalIndex % accents.length];
                const inner = (
                  <motion.div
                    custom={i}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, margin: "-60px" }}
                    className="bg-white border rounded-2xl p-8 md:p-12 flex flex-col md:flex-row md:items-center gap-8 group hover:shadow-md transition-shadow duration-300"
                  >
                    {/* Number */}
                    <div
                      className="hidden md:flex items-center justify-center w-16 h-16 rounded-full text-white font-display font-semibold text-lg shrink-0"
                      style={{ background: accent }}
                    >
                      {String(globalIndex + 1).padStart(2, "0")}
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
                  <a
                    key={project.id}
                    href={toAbsoluteUrl(project.live_url)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {inner}
                  </a>
                ) : (
                  <div key={project.id}>{inner}</div>
                );
              })}
            </div>

            {/* Pagination */}
            {showPagination && (
              <div className="flex items-center justify-center gap-2 mt-10">
                {/* Prev arrow */}
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 0}
                  aria-label="Previous page"
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-navy/10 text-navy/40 hover:border-navy/30 hover:text-navy disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>

                {/* Dots */}
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    aria-label={`Page ${i + 1}`}
                    className={`rounded-full transition-all duration-300 ${
                      i === page ? "w-6 h-2 bg-navy" : "w-2 h-2 bg-navy/20 hover:bg-navy/40"
                    }`}
                  />
                ))}

                {/* Next arrow */}
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages - 1}
                  aria-label="Next page"
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-navy/10 text-navy/40 hover:border-navy/30 hover:text-navy disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}