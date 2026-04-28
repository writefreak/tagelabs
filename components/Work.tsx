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
  image_url?: string;
  status: "Published" | "Draft";
};

const accents = ["#4a8fe2", "#112369", "#4a8fe2", "#112369", "#4a8fe2"];

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&q=80",
  "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&q=80",
  "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&q=80",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80",
  "https://images.unsplash.com/photo-1559028012-481c04fa702d?w=600&q=80",
  "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=600&q=80",
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

function toAbsoluteUrl(url: string) {
  if (!url) return url;
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

const PAGE_SIZE = 3;

// ── Mobile card component ──────────────────────────────────────────────────
function MobileCard({
  project,
  index,
  accent,
  imageSrc,
}: {
  project: Project;
  index: number;
  accent: string;
  imageSrc: string;
}) {
  const inner = (
    <div className="bg-white border border-navy/10 rounded-2xl overflow-hidden flex flex-col group">
      {/* Image */}
      <div className="relative overflow-hidden h-44 w-full">
        <img
          src={imageSrc}
          alt={project.title}
          className="w-full h-full object-cover"
        />
        <span className="absolute top-3 left-3 text-[10px] font-medium uppercase tracking-widest px-3 py-1 rounded-full bg-black/50 text-white backdrop-blur-sm">
          {project.category}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="font-display line-clamp-1 text-lg font-semibold text-navy mb-2 leading-snug">
          {project.title}
        </h3>
        <p className="font-body text-navy/55 text-[12px] line-clamp-2 leading-relaxed flex-1">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-4">
          {project.tags.map((t) => (
            <span
              key={t}
              className="text-[11px] font-medium border border-navy/15 text-navy/50 px-3 py-1 rounded-full"
            >
              {t}
            </span>
          ))}
        </div>

        {/* CHANGED: always show footer — arrow link for website cards, "Delivered." for others */}
        <div className="flex items-center gap-1 mt-4 pt-4 border-t border-navy/10 text-xs text-navy/40">
          {project.live_url ? (
            <>
              View project
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </>
          ) : (
            "Crafted and Delivered."
          )}
        </div>
      </div>
    </div>
  );

  return project.live_url ? (
    <a href={toAbsoluteUrl(project.live_url)} target="_blank" rel="noopener noreferrer">
      {inner}
    </a>
  ) : (
    <div>{inner}</div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
export default function Work() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Mobile scroll
  const mobileScrollRef = useRef<HTMLDivElement>(null);
  const [mobileScrollPage, setMobileScrollPage] = useState(0);

  useEffect(() => {
    async function fetchProjects() {
      const { data } = await supabase
        .from("projects")
        .select("id, title, category, description, tags, live_url, image_url, status")
        .eq("status", "Published")
        // CHANGED: fetch by order_index so drag order from admin is respected
        .order("order_index", { ascending: true });
      setProjects(data ?? []);
      setLoading(false);
    }
    fetchProjects();
  }, []);

  // Track active dot on mobile as user scrolls
  useEffect(() => {
    const el = mobileScrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const cardWidth = el.scrollWidth / (projects.length || 1);
      const index = Math.round(el.scrollLeft / cardWidth);
      setMobileScrollPage(index);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [projects.length]);

  function scrollMobileTo(index: number) {
    const el = mobileScrollRef.current;
    if (!el) return;
    const cardWidth = el.scrollWidth / projects.length;
    el.scrollTo({ left: cardWidth * index, behavior: "smooth" });
    setMobileScrollPage(index);
  }

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
              <div
                key={i}
                className="bg-white rounded-2xl overflow-hidden border animate-pulse flex"
              >
                <div className="w-48 md:w-56 bg-navy/10 shrink-0" />
                <div className="flex-1 p-8 md:p-12 flex flex-col gap-3 justify-center">
                  <div className="h-3 w-24 bg-navy/10 rounded-full" />
                  <div className="h-5 w-48 bg-navy/10 rounded-full" />
                  <div className="h-3 w-full max-w-md bg-navy/10 rounded-full" />
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

        {!loading && projects.length > 0 && (
          <>
            {/* ── MOBILE: horizontal snap scroll ── */}
            <div className="sm:hidden">
              <div
                ref={mobileScrollRef}
                className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {projects.map((project, i) => {
                  const accent = accents[i % accents.length];
                  const imageSrc =
                    project.image_url || FALLBACK_IMAGES[i % FALLBACK_IMAGES.length];
                  return (
                    <div
                      key={project.id}
                      className="shrink-0 snap-center"
                      style={{ width: "78vw" }}
                    >
                      <MobileCard
                        project={project}
                        index={i}
                        accent={accent}
                        imageSrc={imageSrc}
                      />
                    </div>
                  );
                })}
              </div>

              {projects.length > 1 && (
                <div className="flex items-center justify-center gap-2 mt-5">
                  {projects.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => scrollMobileTo(i)}
                      aria-label={`Go to project ${i + 1}`}
                      className={`rounded-full transition-all duration-300 ${
                        i === mobileScrollPage
                          ? "w-5 h-1.5 bg-navy"
                          : "w-1.5 h-1.5 bg-navy/20"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* ── DESKTOP: paginated grid (unchanged) ── */}
            <div ref={scrollRef} className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {paginated.map((project, i) => {
                const globalIndex = page * PAGE_SIZE + i;
                const accent = accents[globalIndex % accents.length];
                const imageSrc =
                  project.image_url ?? FALLBACK_IMAGES[globalIndex % FALLBACK_IMAGES.length];

                const inner = (
                  <motion.div
                    custom={i}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, margin: "-60px" }}
                    className="bg-white border border-navy/10 rounded-2xl overflow-hidden flex flex-col group hover:-translate-y-1 hover:shadow-md transition-all duration-300"
                  >
                    {/* Image */}
                    <div className="relative overflow-hidden h-48 w-full">
                      <img
                        src={imageSrc}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                      />
                      <span className="absolute top-3 left-3 text-[10px] font-medium uppercase tracking-widest px-3 py-1 rounded-full bg-black/50 text-white backdrop-blur-sm">
                        {project.category}
                      </span>
                    </div>

                    {/* Body */}
                    <div className="flex flex-col flex-1 p-5">
                      <h3 className="font-display line-clamp-1 text-lg font-semibold text-navy mb-2 leading-snug">
                        {project.title}
                      </h3>
                      <p className="font-body text-navy/55 text-[12px] line-clamp-2 leading-relaxed flex-1">
                        {project.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mt-4">
                        {project.tags.map((t) => (
                          <span
                            key={t}
                            className="text-[11px] font-medium border border-navy/15 text-navy/50 px-3 py-1 rounded-full"
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      {/* CHANGED: always show footer — arrow link for website cards, "Delivered." for others */}
                      <div className="flex items-center gap-1 mt-4 pt-4 border-t border-navy/10 text-xs text-navy/40 group-hover:text-navy/60 transition-colors">
                        {project.live_url ? (
                          <>
                            View project
                            <svg
                              width="11"
                              height="11"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <line x1="7" y1="17" x2="17" y2="7" />
                              <polyline points="7 7 17 7 17 17" />
                            </svg>
                          </>
                        ) : (
                          "Crafted and Delivered"
                        )}
                      </div>
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

            {/* Pagination (desktop only) */}
            {showPagination && (
              <div className="hidden sm:flex items-center justify-center gap-2 mt-10">
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