"use client";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { useEffect, useState, useRef, useMemo } from "react";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
} from "lucide-react";
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
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: (i % 6) * 0.08,
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const INITIAL_VISIBLE_COUNT = 6;
const BATCH_SIZE = 6;

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ── Hero Banner Component ──────────────────────────────────────────
function FeaturedPostBanner({
  featuredPosts,
  searchQuery,
  setSearchQuery,
}: {
  featuredPosts: BlogPost[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMultiLine, setIsMultiLine] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const activePost = featuredPosts[activeIndex] || featuredPosts[0];
  const bgImage = activePost?.cover_image_url || FALLBACK_IMAGES[0];

  // Check if the title spans 2 or more lines on the current screen size
  useEffect(() => {
    const checkLines = () => {
      if (titleRef.current) {
        const style = window.getComputedStyle(titleRef.current);
        const lineHeight = parseFloat(style.lineHeight) || 28; // Fallback line-height estimate
        const lines = Math.round(titleRef.current.offsetHeight / lineHeight);
        setIsMultiLine(lines >= 2);
      }
    };

    checkLines();
    window.addEventListener("resize", checkLines);
    return () => window.removeEventListener("resize", checkLines);
  }, [activePost]);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % featuredPosts.length);
  };

  const handlePrev = () => {
    setActiveIndex(
      (prev) => (prev - 1 + featuredPosts.length) % featuredPosts.length,
    );
  };

  return (
    <div className="relative w-full h-[468px] md:h-[600px] flex flex-col justify-between overflow-hidden bg-black text-white pb-12 md:pt-20 px-4 sm:px-8 md:px-16">
      {/* Background Image */}
      <AnimatePresence mode="wait">
        {activePost && (
          <motion.img
            key={activePost.id}
            src={bgImage}
            alt={activePost.title}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 w-full h-full object-cover z-0"
          />
        )}
      </AnimatePresence>

      {/* Horizontal Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/95 to-transparent z-0" />

      {/* Top Bar: Back Button */}
      <div className="relative pt-10 md:pt-4 z-10 w-full max-w-7xl mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-white/80 hover:text-white bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 transition-all"
        >
          <ArrowLeft size={14} />
          Back to home
        </Link>
      </div>

      {/* Hero Content Area */}
      {activePost ? (
        <div className="relative z-10 w-full max-w-7xl mx-auto my-auto pt-8 pb-4">
          <div className="max-w-xl sm:max-w-2xl md:max-w-3xl space-y-4 sm:space-y-6">
            <Link href={`/blogs/${activePost.slug}`} className="block group">
              <h1
                ref={titleRef}
                className="font-display text-2xl md:text-[50px] max-w-sm md:max-w-xl font-bold text-white leading-tight tracking-tight group-hover:text-white/90 transition-colors line-clamp-3"
              >
                {activePost.title}
              </h1>
            </Link>

            {/* Rendered only on mobile when title enters 2+ lines */}
            {isMultiLine && (
              <p className="block md:hidden text-xs text-white/80 font-body leading-relaxed line-clamp-1">
                {activePost.excerpt ||
                  "Read this highlighted post to discover valuable perspectives."}
              </p>
            )}

            {/* Embedded Searchbar */}
            <div className="pt-2 w-full max-w-md">
              <div className="relative flex items-center w-full rounded-full bg-black/50 backdrop-blur-md border border-white/20 px-4 py-2.5 text-white shadow-inner focus-within:border-white/50 focus-within:bg-black/70 transition-all">
                <Search size={16} className="text-white/70 mr-2 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search all posts..."
                  className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-white/60 outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors ml-1"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
              <div className="pt-4">
                <Link
                  href={`/blogs/${activePost.slug}`}
                  className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-white text-navy font-semibold text-xs sm:text-sm shadow-xl hover:bg-white/90 transition-all transform hover:-translate-y-0.5"
                >
                  Read Article
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative z-10 p-8 text-white/70 text-sm my-auto">
          No featured posts currently highlighted.
        </div>
      )}

      {/* Navigation Controls */}
      {featuredPosts.length > 1 && (
        <div className="relative z-10 w-full max-w-7xl mx-auto flex items-center justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={handlePrev}
            className="w-8 md:w-10 h-8 md:h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white flex items-center justify-center transition-all active:scale-95"
            aria-label="Previous featured post"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="w-8 md:w-10 h-8 md:h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white flex items-center justify-center transition-all active:scale-95"
            aria-label="Next featured post"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

// ── Blog Card Component ──────────────────────────────────────────────
function ModernBlogCard({
  post,
  imageSrc,
}: {
  post: BlogPost;
  imageSrc: string;
}) {
  return (
    <Link href={`/blogs/${post.slug}`} className="block h-full group">
      <article className="h-full flex flex-col justify-between rounded-2xl border border-navy/10 bg-white p-3.5 shadow-sm hover:shadow-xl hover:border-navy/20 transition-all duration-300">
        <div className="space-y-4">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-navy/5">
            <img
              src={imageSrc}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
          </div>

          <div className="px-1 space-y-2">
            <h3 className="font-display text-base sm:text-lg font-semibold text-navy leading-snug line-clamp-2 group-hover:text-navy/80 transition-colors">
              {post.title}
            </h3>

            <p className="text-xs sm:text-sm text-navy/60 font-body line-clamp-2 leading-relaxed">
              {post.excerpt || "Read the full post to learn more."}
            </p>
          </div>
        </div>

        <div className="mt-4 pt-3 px-1 border-t border-navy/5 flex items-center justify-between text-[11px] text-navy/40 font-medium">
          <span>{formatDate(post.created_at)}</span>
        </div>
      </article>
    </Link>
  );
}

// ── Main Page Component ──────────────────────────────────────────────────
export default function BlogArchivePage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
  const [searchQuery, setSearchQuery] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

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

  const featuredPosts = useMemo(() => {
    return posts.filter((p) => p.is_editors_pick);
  }, [posts]);

  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return posts;
    const q = searchQuery.toLowerCase();
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt?.toLowerCase().includes(q),
    );
  }, [posts, searchQuery]);

  const visiblePosts = filteredPosts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPosts.length;

  const handleSeeMore = () => {
    setVisibleCount((prev) => prev + BATCH_SIZE);
  };

  const handleSeeLess = () => {
    setVisibleCount(INITIAL_VISIBLE_COUNT);
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="w-full bg-white min-h-screen">
      {/* 1. Fullscreen Hero Banner */}
      {!loading && featuredPosts.length > 0 && (
        <FeaturedPostBanner
          featuredPosts={featuredPosts}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      )}

      {/* Main Grid Container */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Search Bar Fallback when no featured posts exist */}
        {!loading && featuredPosts.length === 0 && (
          <div className="mb-8 pt-12">
            <Link
              href="/"
              className="inline-flex pb-6 items-center gap-1.5 text-sm font-medium text-navy/60 hover:text-navy transition-colors"
            >
              <ArrowLeft size={14} />
              Back to home
            </Link>
            <div className="relative max-w-md">
              <div className="relative flex items-center w-full rounded-xl bg-navy/5 border border-navy/10 px-3.5 py-2.5 text-navy">
                <Search size={16} className="text-navy/50 mr-2 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search blog posts..."
                  className="w-full bg-transparent text-xs sm:text-sm text-navy placeholder-navy/40 outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="p-1 rounded-full text-navy/50 hover:text-navy transition-colors ml-1"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 2. Page Section Title */}
        <motion.div
          ref={scrollRef}
          className="pb-8 sm:pb-12"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="font-jet text-2xl sm:text-3xl md:text-5xl font-semibold text-navy leading-tight">
            Our Thoughts, Worth Sharing
          </h2>
        </motion.div>

        {/* Skeleton Loader */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-12">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-80 rounded-2xl animate-pulse bg-navy/10 w-full"
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredPosts.length === 0 && (
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
              {searchQuery
                ? "No matching posts found."
                : "Something's brewing."}
            </h3>
            <p className="font-body text-navy/50 text-sm max-w-xs leading-relaxed">
              {searchQuery
                ? "Try searching for another keyword or clear your query."
                : "Posts are being prepared with care. Check back soon — good writing takes time."}
            </p>
          </motion.div>
        )}

        {/* Modern Blog Post Grid */}
        {!loading && filteredPosts.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {visiblePosts.map((post, i) => {
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
                    viewport={{ once: true, margin: "-40px" }}
                  >
                    <ModernBlogCard post={post} imageSrc={imageSrc} />
                  </motion.div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            <div className="mt-12 flex justify-center items-center">
              {hasMore ? (
                <button
                  onClick={handleSeeMore}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-navy/20 bg-white text-navy font-medium text-sm hover:border-navy hover:bg-navy/5 transition-all duration-200"
                >
                  See More
                  <ChevronDown size={16} />
                </button>
              ) : visibleCount > INITIAL_VISIBLE_COUNT ? (
                <button
                  onClick={handleSeeLess}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-navy/20 bg-white text-navy font-medium text-sm hover:border-navy hover:bg-navy/5 transition-all duration-200"
                >
                  See Less
                  <ChevronUp size={16} />
                </button>
              ) : null}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
