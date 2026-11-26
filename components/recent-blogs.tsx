"use client";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { ArrowUpRight, Ghost } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/app/lib/supabase";

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image_url?: string;
  published: boolean;
  created_at: string;
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

const RECENT_COUNT = 6;
const PAGE_SIZE = 4;

// ── Blog card (same structure as Work's ProjectCard) ────────────────────────
function BlogCard({ post, imageSrc }: { post: BlogPost; imageSrc: string }) {
  return (
    <Link href={`/blogs/${post.slug}`} className="block">
      <article className="group relative aspect-[2/3] w-full overflow-hidden rounded-2xl">
        <img
          src={imageSrc}
          alt={post.title}
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
          <div className="flex flex-col gap-2 rounded-xl border border-white/20 bg-black/40 p-4 backdrop-blur-md">
            <h3 className="truncate font-display text-sm font-semibold leading-snug text-white">
              {post.title}
            </h3>

            <p className="line-clamp-2 text-[10px] font-medium text-white/55">
              {post.excerpt || "Read the post"}
            </p>
          </div>
        </div>
      </article>
    </Link>
  );
}
// ── Main component ──────────────────────────────────────────────────────────
export default function RecentBlogs() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const desktopScrollRef = useRef<HTMLDivElement>(null);

  const mobileScrollRef = useRef<HTMLDivElement>(null);
  const [mobileScrollPage, setMobileScrollPage] = useState(0);

  useEffect(() => {
    async function fetchPosts() {
      const { data } = await supabase
        .from("blog_posts")
        .select(
          "id, title, slug, excerpt, cover_image_url, published, created_at",
        )
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(RECENT_COUNT);
      setPosts(data ?? []);
      setLoading(false);
    }
    fetchPosts();
  }, []);

  useEffect(() => {
    const el = mobileScrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const cardWidth = el.scrollWidth / (posts.length || 1);
      const index = Math.round(el.scrollLeft / cardWidth);
      setMobileScrollPage(index);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [posts.length]);

  function scrollMobileTo(index: number) {
    const el = mobileScrollRef.current;
    if (!el) return;
    const cardWidth = el.scrollWidth / posts.length;
    el.scrollTo({ left: cardWidth * index, behavior: "smooth" });
    setMobileScrollPage(index);
  }

  const totalPages = Math.ceil(posts.length / PAGE_SIZE);
  // const paginated = posts.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);
  const pages = Array.from({ length: totalPages }, (_, p) =>
    posts.slice(p * PAGE_SIZE, p * PAGE_SIZE + PAGE_SIZE),
  );
  const showPagination = posts.length > PAGE_SIZE;

  function handlePageChange(next: number) {
    setPage(next);
    desktopScrollRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }

  return (
    <section
      id="blogs"
      className="border-y border-t-gray-100 bg-white px-6 py-16 md:px-16 md:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="flex flex-wrap items-end justify-between gap-4 pb-7 md:pb-14"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex flex-col gap-2 md:gap-3">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55 }}
              className="font-display text-4xl font-semibold leading-tight text-navy md:text-5xl"
            >
              Our Timeless Thoughts
            </motion.h2>
            {/* <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "" }}
              transition={{ duration: 0.55 }}
              className="max-w-sm font-sans text-xs leading-relaxed text-neutral-600 md:text-sm"
            >
              Click each card to explore a thoughtful curation of topics and
              interesting updates from us
            </motion.p> */}
          </div>
          <Link
            href="/blogs"
            className="hidden items-center gap-1.5 text-sm font-medium text-navy/50 transition-colors hover:text-navy sm:flex"
          >
            View all posts
            <ArrowUpRight size={14} />
          </Link>
        </motion.div>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="aspect-[2/3] animate-pulse overflow-hidden rounded-2xl bg-navy/10"
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
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue/10">
              <span className="text-3xl">
                <Ghost />
              </span>
            </div>
            <h3 className="mb-3 font-display text-2xl font-semibold text-navy">
              Something's brewing.
            </h3>
            <p className="max-w-xs font-body text-sm leading-relaxed text-navy/50">
              Posts are being prepared with care. Check back soon because good
              writing takes time.
            </p>
          </motion.div>
        )}

        {!loading && posts.length > 0 && (
          <>
            {/* ── MOBILE: horizontal snap scroll ── */}
            <div className="sm:hidden">
              <div
                ref={mobileScrollRef}
                className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {posts.map((post, i) => {
                  const imageSrc =
                    post.cover_image_url ||
                    FALLBACK_IMAGES[i % FALLBACK_IMAGES.length];
                  return (
                    <div
                      key={post.id}
                      className="w-[60vw] shrink-0 snap-center"
                    >
                      <BlogCard post={post} imageSrc={imageSrc} />
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-center pt-6 sm:hidden">
                <Link
                  href="/blogs"
                  className="flex items-center gap-1.5 text-xs font-medium text-navy/50 transition-colors hover:text-navy"
                >
                  View all posts
                  <ArrowUpRight size={14} />
                </Link>
              </div>

              {posts.length > 1 && (
                <div className="flex items-center justify-center gap-2 pt-3 md:pt-5">
                  {posts.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => scrollMobileTo(i)}
                      aria-label={`Go to post ${i + 1}`}
                      className={`rounded-full transition-all duration-300 ${
                        i === mobileScrollPage
                          ? "h-1.5 w-5 bg-navy"
                          : "h-1.5 w-1.5 bg-navy/20"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* ── DESKTOP: 4-column portrait grid ── */}
            {/* ── DESKTOP: sliding 4-column portrait grid ── */}
            <div
              ref={desktopScrollRef}
              className="-my-3 hidden overflow-hidden py-3 sm:block"
            >
              <motion.div
                className="flex"
                initial={false}
                animate={{ x: `-${page * 100}%` }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                {pages.map((pagePosts, pageIndex) => (
                  <div
                    key={pageIndex}
                    className="grid w-full shrink-0 grid-cols-2 gap-4 md:grid-cols-4"
                  >
                    {pagePosts.map((post, i) => {
                      const globalIndex = pageIndex * PAGE_SIZE + i;
                      const imageSrc =
                        post.cover_image_url ||
                        FALLBACK_IMAGES[globalIndex % FALLBACK_IMAGES.length];

                      const entrance =
                        pageIndex === 0
                          ? {
                              custom: i,
                              variants: fadeUp,
                              initial: "hidden",
                              whileInView: "visible",
                              viewport: { once: true, margin: "-60px" },
                            }
                          : {};

                      return (
                        <motion.div key={post.id} {...entrance}>
                          <BlogCard post={post} imageSrc={imageSrc} />
                        </motion.div>
                      );
                    })}
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Pagination (desktop only) */}
            {showPagination && (
              <div className="mt-10 hidden items-center justify-center gap-2 sm:flex">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 0}
                  aria-label="Previous page"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-navy/10 text-navy/40 transition-all duration-200 hover:border-navy/30 hover:text-navy disabled:cursor-not-allowed disabled:opacity-20"
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
                        ? "h-2 w-6 bg-navy"
                        : "h-2 w-2 bg-navy/20 hover:bg-navy/40"
                    }`}
                  />
                ))}

                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages - 1}
                  aria-label="Next page"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-navy/10 text-navy/40 transition-all duration-200 hover:border-navy/30 hover:text-navy disabled:cursor-not-allowed disabled:opacity-20"
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
