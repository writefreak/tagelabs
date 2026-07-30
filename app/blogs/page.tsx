"use client";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/app/lib/supabase";

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image_url?: string;
  created_at: string;
  is_editors_pick?: boolean;
};

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&q=80",
  "https://images.unsplash.com/photo-1432821596592-e2c18b78144f?w=600&q=80",
  "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&q=80",
  "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&q=80",
  "https://images.unsplash.com/photo-1517842645767-c639042777db?w=600&q=80",
  "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600&q=80",
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

const PAGE_SIZE = 4;

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

// ── Blog card ────────────────────────────────────────────────────────────
function BlogCard({ post, imageSrc }: { post: BlogPost; imageSrc: string }) {
  return (
    <Link href={`/blogs/${post.slug}`}>
      <article className="group relative overflow-hidden rounded-2xl aspect-[2/3] w-full">
        <img
          src={imageSrc}
          alt={post.title}
          className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
          <div className="bg-black/40 backdrop-blur-md border border-white/20 rounded-xl p-3 flex flex-col gap-1">
            <div className="flex items-end justify-between">
              <div className="min-w-0 flex-1 pr-2">
                <h3 className="font-display text-sm font-semibold text-white leading-snug truncate">
                  {post.title}
                </h3>
              </div>
              <div className="shrink-0 w-7 h-7 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
                <ArrowUpRight size={13} color="white" />
              </div>
            </div>

            <span className="text-[10px] text-white/55 font-medium truncate min-w-0">
              {post.excerpt || "Read the post"}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

// ── Shared page-level pagination controls (prev/next + page dots) ─────────
function PagePagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (next: number) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-2 mt-6 md:mt-10">
      <button
        onClick={() => onChange(page - 1)}
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
          onClick={() => onChange(i)}
          aria-label={`Page ${i + 1}`}
          className={`rounded-full transition-all duration-300 ${
            i === page
              ? "w-6 h-2 bg-navy"
              : "w-2 h-2 bg-navy/20 hover:bg-navy/40"
          }`}
        />
      ))}

      <button
        onClick={() => onChange(page + 1)}
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
  );
}

// ── Main page ────────────────────────────────────────────────────────────
export default function BlogArchivePage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const mobileScrollRef = useRef<HTMLDivElement>(null);
  const [mobileScrollPage, setMobileScrollPage] = useState(0);

  // Editor's Picks gets its own independent pagination, separate from the main list.
  const [editorsPage, setEditorsPage] = useState(0);
  const editorsScrollRef = useRef<HTMLDivElement>(null);
  const editorsMobileScrollRef = useRef<HTMLDivElement>(null);
  const [editorsMobileScrollPage, setEditorsMobileScrollPage] = useState(0);

  useEffect(() => {
    async function fetchPosts() {
      const { data } = await supabase
        .from("blog_posts")
        .select(
          "id, title, slug, excerpt, cover_image_url, created_at, is_editors_pick",
        )
        .eq("published", true)
        .order("created_at", { ascending: false });
      setPosts(data ?? []);
      setLoading(false);
    }
    fetchPosts();
  }, []);

  const editorsPicks = posts.filter((p) => p.is_editors_pick);

  const totalPages = Math.ceil(posts.length / PAGE_SIZE);
  const paginated = posts.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  const editorsTotalPages = Math.ceil(editorsPicks.length / PAGE_SIZE);
  const editorsPaginated = editorsPicks.slice(
    editorsPage * PAGE_SIZE,
    editorsPage * PAGE_SIZE + PAGE_SIZE,
  );

  useEffect(() => {
    const el = mobileScrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const cardWidth = el.scrollWidth / (paginated.length || 1);
      const index = Math.round(el.scrollLeft / cardWidth);
      setMobileScrollPage(index);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [paginated.length]);

  // Reset mobile scroll position whenever the page changes so the snap
  // container always starts at the first card of the new page.
  useEffect(() => {
    const el = mobileScrollRef.current;
    if (!el) return;
    el.scrollTo({ left: 0, behavior: "auto" });
    setMobileScrollPage(0);
  }, [page]);

  useEffect(() => {
    const el = editorsMobileScrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const cardWidth = el.scrollWidth / (editorsPaginated.length || 1);
      const index = Math.round(el.scrollLeft / cardWidth);
      setEditorsMobileScrollPage(index);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [editorsPaginated.length]);

  useEffect(() => {
    const el = editorsMobileScrollRef.current;
    if (!el) return;
    el.scrollTo({ left: 0, behavior: "auto" });
    setEditorsMobileScrollPage(0);
  }, [editorsPage]);

  function scrollEditorsMobileTo(index: number) {
    const el = editorsMobileScrollRef.current;
    if (!el) return;
    const cardWidth = el.scrollWidth / editorsPaginated.length;
    el.scrollTo({ left: cardWidth * index, behavior: "smooth" });
    setEditorsMobileScrollPage(index);
  }

  function handleEditorsPageChange(next: number) {
    setEditorsPage(next);
    setEditorsMobileScrollPage(0);
    editorsScrollRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function scrollMobileTo(index: number) {
    const el = mobileScrollRef.current;
    if (!el) return;
    const cardWidth = el.scrollWidth / paginated.length;
    el.scrollTo({ left: cardWidth * index, behavior: "smooth" });
    setMobileScrollPage(index);
  }

  function handlePageChange(next: number) {
    setPage(next);
    setMobileScrollPage(0);
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <section className="py-16 md:py-24 px-6" style={{ background: "#ffffff" }}>
      <div className="max-w-6xl mx-auto pt-12">
        <Link
          href="/"
          className="inline-flex pb-4 items-center gap-1.5 text-sm font-medium text-navy/60 hover:text-navy transition-colors"
        >
          <ArrowLeft size={14} />
          Back to home
        </Link>
        <motion.div
          ref={scrollRef}
          className="pb-10 md:pb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="font-jet text-2xl md:text-5xl font-semibold text-navy leading-tight">
            Our Thoughts, Worth Sharing
          </h1>
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
        {!loading && posts.length === 0 && (
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
              Posts are being prepared with care. Check back soon — good writing
              takes time.
            </p>
          </motion.div>
        )}

        {!loading && posts.length > 0 && (
          <>
            {/* ── MOBILE: horizontal snap scroll (paginated, same slice as desktop) ── */}
            <div className="sm:hidden">
              <div
                ref={mobileScrollRef}
                className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {paginated.map((post, i) => {
                  const globalIndex = page * PAGE_SIZE + i;
                  const imageSrc =
                    post.cover_image_url ||
                    FALLBACK_IMAGES[globalIndex % FALLBACK_IMAGES.length];
                  return (
                    <div
                      key={post.id}
                      className="shrink-0 snap-center"
                      style={{ width: "60vw" }}
                    >
                      <BlogCard post={post} imageSrc={imageSrc} />
                    </div>
                  );
                })}
              </div>

              {paginated.length > 1 && (
                <div className="flex items-center justify-center gap-2 pt-3 md:pt-5">
                  {paginated.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => scrollMobileTo(i)}
                      aria-label={`Go to post ${i + 1}`}
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
            <div className="hidden sm:grid sm:grid-cols-4 gap-4">
              {paginated.map((post, i) => {
                const globalIndex = page * PAGE_SIZE + i;
                const imageSrc =
                  post.cover_image_url ||
                  FALLBACK_IMAGES[globalIndex % FALLBACK_IMAGES.length];

                return (
                  <motion.div
                    key={post.id}
                    custom={i}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, margin: "-60px" }}
                  >
                    <BlogCard post={post} imageSrc={imageSrc} />
                  </motion.div>
                );
              })}
            </div>

            {/* Editor's Picks — now below the main list, fully browsable */}
            {editorsPicks.length > 0 && (
              <div className="pt-10 md:pt-16">
                <motion.div
                  ref={editorsScrollRef}
                  className="flex flex-col gap-1 pb-7"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, margin: "-80px" }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <h2 className="font-display text-lg md:text-2xl font-semibold text-navy">
                    Editor's Picks
                  </h2>
                  <p className="text-xs md:text-sm text-neutral-700">
                    A curated list of our favorite topics to keep you updated on
                    what's trending
                  </p>
                </motion.div>

                {/* Mobile: horizontal snap scroll, paginated same as main list */}
                <div className="sm:hidden">
                  <div
                    ref={editorsMobileScrollRef}
                    className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                  >
                    {editorsPaginated.map((post, i) => {
                      const globalIndex = editorsPage * PAGE_SIZE + i;
                      const imageSrc =
                        post.cover_image_url ||
                        FALLBACK_IMAGES[globalIndex % FALLBACK_IMAGES.length];
                      return (
                        <div
                          key={post.id}
                          className="shrink-0 snap-center"
                          style={{ width: "60vw" }}
                        >
                          <BlogCard post={post} imageSrc={imageSrc} />
                        </div>
                      );
                    })}
                  </div>

                  {editorsPaginated.length > 1 && (
                    <div className="flex items-center justify-center gap-2 pt-3 md:pt-5">
                      {editorsPaginated.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => scrollEditorsMobileTo(i)}
                          aria-label={`Go to editor's pick ${i + 1}`}
                          className={`rounded-full transition-all duration-300 ${
                            i === editorsMobileScrollPage
                              ? "w-5 h-1.5 bg-navy"
                              : "w-1.5 h-1.5 bg-navy/20"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Desktop: 4-column grid, no intermediate 2-col step */}
                <div className="hidden sm:grid sm:grid-cols-4 gap-4">
                  {editorsPaginated.map((post, i) => {
                    const globalIndex = editorsPage * PAGE_SIZE + i;
                    const imageSrc =
                      post.cover_image_url ||
                      FALLBACK_IMAGES[globalIndex % FALLBACK_IMAGES.length];
                    return (
                      <motion.div
                        key={post.id}
                        custom={i}
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, margin: "-60px" }}
                      >
                        <BlogCard post={post} imageSrc={imageSrc} />
                      </motion.div>
                    );
                  })}
                </div>

                <div className="hidden sm:block"></div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
