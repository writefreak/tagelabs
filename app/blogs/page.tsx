"use client";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { ArrowLeft, ArrowUpRight, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/app/lib/supabase";

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image_url?: string;
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

// ── Landscape Card Component ──────────────────────────────────────────────
function LandscapeBlogCard({
  post,
  imageSrc,
}: {
  post: BlogPost;
  imageSrc: string;
}) {
  return (
    <Link href={`/blogs/${post.slug}`} className="block h-full group">
      <article className="h-full flex flex-col sm:flex-row overflow-hidden rounded-2xl border border-navy/10 bg-white shadow-sm hover:shadow-md transition-all duration-300">
        {/* Card Image */}
        <div className="relative sm:w-2/5 aspect-[16/10] sm:aspect-auto overflow-hidden shrink-0">
          <img
            src={imageSrc}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        </div>

        {/* Card Body */}
        <div className="p-4 sm:p-5 sm:w-3/5 flex flex-col justify-between flex-1 gap-3">
          <div className="space-y-1.5">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-display text-sm md:text-base font-semibold text-navy leading-snug line-clamp-2 group-hover:text-navy/80 transition-colors">
                {post.title}
              </h3>
            </div>

            <p className="text-xs text-navy/60 font-body line-clamp-2 leading-relaxed">
              {post.excerpt || "Read the full post to learn more."}
            </p>
          </div>

          <div className="pt-2 border-t border-navy/5 flex items-center justify-between text-[11px] text-navy/40 font-medium">
            <span>{formatDate(post.created_at)}</span>
          </div>
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
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchPosts() {
      const { data } = await supabase
        .from("blog_posts")
        .select("id, title, slug, excerpt, cover_image_url, created_at")
        .eq("published", true)
        .order("created_at", { ascending: false });
      setPosts(data ?? []);
      setLoading(false);
    }
    fetchPosts();
  }, []);

  const visiblePosts = posts.slice(0, visibleCount);
  const hasMore = visibleCount < posts.length;

  const handleSeeMore = () => {
    setVisibleCount((prev) => prev + BATCH_SIZE);
  };

  const handleSeeLess = () => {
    setVisibleCount(INITIAL_VISIBLE_COUNT);
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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
          className="pb-10 md:pb-12"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="font-jet text-2xl md:text-5xl font-semibold text-navy leading-tight">
            Our Thoughts, Worth Sharing
          </h1>
        </motion.div>

        {/* Skeleton Loader */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-44 rounded-2xl animate-pulse bg-navy/10 w-full"
              />
            ))}
          </div>
        )}

        {/* Empty State */}
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

        {/* Blog Post Landscape Grid (3-Columns) */}
        {!loading && posts.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    <LandscapeBlogCard post={post} imageSrc={imageSrc} />
                  </motion.div>
                );
              })}
            </div>

            {/* See More / See Less Controls */}
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
      </div>
    </section>
  );
}
