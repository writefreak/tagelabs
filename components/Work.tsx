"use client";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
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

const PAGE_SIZE = 4;

// ── Project card (portrait, same structure as Zufeet ProductCard) ──────────
function ProjectCard({
  project,
  index,
  imageSrc,
}: {
  project: Project;
  index: number;
  imageSrc: string;
}) {
  const inner = (
    <article className="group relative overflow-hidden rounded-2xl aspect-[2/3] w-full">
      <img
        src={imageSrc}
        alt={project.title}
        className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
        <div className="bg-black/40 backdrop-blur-md border border-white/20 rounded-xl p-3 flex flex-col gap-2">
          <div className="flex items-end justify-between">
            <div className="min-w-0 flex-1 pr-2">
              {/* <span className="block text-[7px] font-medium uppercase tracking-widest text-white/50 mb-0.5">
                {project.category}
              </span> */}
              <h3 className="font-display text-sm font-semibold text-white leading-snug truncate">
                {project.title}
              </h3>

              {/* <p className="text-xs line-clamp-2 pt-5 text-white/60">
                {project.description}
              </p> */}
            </div>
            <div className="shrink-0 w-7 h-7 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
              <ArrowUpRight size={13} color="white" />
            </div>
          </div>

          <div className="bg-black/30 border border-white/10 rounded-lg px-2.5 py-2 flex items-center justify-between gap-2">
            <div className="flex flex-wrap gap-1.5 min-w-0">
              {project.tags.slice(0, 2).map((t) => (
                <span key={t} className="text-[10px] text-white/55 font-medium">
                  {t}
                </span>
              ))}
            </div>
            <span className="shrink-0 text-[10px] text-white/40 whitespace-nowrap">
              {project.live_url ? "View project" : "Delivered."}
            </span>
          </div>
        </div>
      </div>
    </article>
  );

  return project.live_url ? (
    <a
      href={toAbsoluteUrl(project.live_url)}
      target="_blank"
      rel="noopener noreferrer"
    >
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

  const mobileScrollRef = useRef<HTMLDivElement>(null);
  const [mobileScrollPage, setMobileScrollPage] = useState(0);

  useEffect(() => {
    async function fetchProjects() {
      const { data } = await supabase
        .from("projects")
        .select(
          "id, title, category, description, tags, live_url, image_url, status",
        )
        .eq("status", "Published")
        .order("order_index", { ascending: true });
      setProjects(data ?? []);
      setLoading(false);
    }
    fetchProjects();
  }, []);

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
  const paginated = projects.slice(
    page * PAGE_SIZE,
    page * PAGE_SIZE + PAGE_SIZE,
  );
  const showPagination = projects.length > PAGE_SIZE;

  function handlePageChange(next: number) {
    setPage(next);
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  return (
    <section
      id="work"
      className="py-16 md:pt-32  md:pb-17 px-6"
      style={{ background: "#ffffff" }}
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="pb-5 md:pb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="font-display text-3xl md:text-5xl font-semibold text-navy max-w-md leading-tight">
            Higlighted Projects
          </h2>
        </motion.div>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden animate-pulse bg-navy/10 aspect-[2/3]"
              />
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
              Projects are being prepared with care. Check back soon — good work
              takes time.
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
                  const imageSrc =
                    project.image_url ||
                    FALLBACK_IMAGES[i % FALLBACK_IMAGES.length];
                  return (
                    <div
                      key={project.id}
                      className="shrink-0 snap-center"
                      style={{ width: "60vw" }}
                    >
                      <ProjectCard
                        project={project}
                        index={i}
                        imageSrc={imageSrc}
                      />
                    </div>
                  );
                })}
              </div>

              {projects.length > 1 && (
                <div className="flex items-center justify-center gap-2 pt-3 md:pt-5">
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

            {/* ── DESKTOP: 4-column portrait grid ── */}
            <div
              ref={scrollRef}
              className="hidden sm:grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {paginated.map((project, i) => {
                const globalIndex = page * PAGE_SIZE + i;
                const imageSrc =
                  project.image_url ??
                  FALLBACK_IMAGES[globalIndex % FALLBACK_IMAGES.length];

                return (
                  <motion.div
                    key={project.id}
                    custom={i}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, margin: "-60px" }}
                  >
                    <ProjectCard
                      project={project}
                      index={globalIndex}
                      imageSrc={imageSrc}
                    />
                  </motion.div>
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
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>

                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    aria-label={`Page ${i + 1}`}
                    className={`rounded-full transition-all duration-300 ${
                      i === page
                        ? "w-6 h-2 bg-navy"
                        : "w-2 h-2 bg-navy/20 hover:bg-navy/40"
                    }`}
                  />
                ))}

                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages - 1}
                  aria-label="Next page"
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-navy/10 text-navy/40 hover:border-navy/30 hover:text-navy disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
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
