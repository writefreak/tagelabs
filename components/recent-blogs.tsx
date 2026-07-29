"use client";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
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

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

// ── Blog card (same structure as Work's ProjectCard) ────────────────────────
function BlogCard({ post, imageSrc }: { post: BlogPost; imageSrc: string }) {
  return (
    <Link href={`/blogs/${post.slug}`}>
      <article className="group relative overflow-hidden rounded-2xl aspect-[3/4] w-full">
        <img
          src={imageSrc}
          alt={post.title}
          className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
          <div className="bg-black/40 backdrop-blur-md border border-white/20 rounded-xl p-3 flex flex-col gap-2">
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

            <div className="bg-black/30 border border-white/10 rounded-lg px-2.5 py-2 flex items-center justify-between gap-2">
              <span className="text-[10px] text-white/55 font-medium truncate min-w-0">
                {post.excerpt || "Read the post"}
              </span>
              <span className="shrink-0 text-[10px] text-white/40 whitespace-nowrap">
                {formatDate(post.created_at)}
              </span>
            </div>
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

  return (
    <section
      id="blog"
      className="py-16 bg-white border-y border-t-gray-100 md:py-28 px-6"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="pb-5 md:pb-16 flex items-end justify-between gap-4 flex-wrap"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="font-display text-3xl md:text-5xl font-semibold text-navy  leading-tight">
            Our Timeless Thoughts
          </h2>
          <Link
            href="/blogs"
            className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-navy/50 hover:text-navy transition-colors"
          >
            View all posts
            <ArrowUpRight size={14} />
          </Link>
        </motion.div>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
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
            {/* ── MOBILE: horizontal snap scroll ── */}
            <div className="sm:hidden">
              <div
                ref={mobileScrollRef}
                className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {posts.map((post, i) => {
                  const imageSrc =
                    post.cover_image_url ||
                    FALLBACK_IMAGES[i % FALLBACK_IMAGES.length];
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

              <div className="flex justify-center pt-6 sm:hidden">
                <Link
                  href="/blogs"
                  className="flex items-center gap-1.5 text-xs font-medium text-navy/50 hover:text-navy transition-colors"
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
                          ? "w-5 h-1.5 bg-navy"
                          : "w-1.5 h-1.5 bg-navy/20"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* ── DESKTOP: 3-column portrait grid ── */}
            <div className="hidden sm:grid grid-cols-2 md:grid-cols-4 gap-4">
              {posts.map((post, i) => {
                const imageSrc =
                  post.cover_image_url ||
                  FALLBACK_IMAGES[i % FALLBACK_IMAGES.length];

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
          </>
        )}
      </div>
    </section>
  );
}
