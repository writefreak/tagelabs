"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/app/lib/supabase";

type EditorsPickPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image_url?: string | null;
  created_at: string;
};

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&q=80",
  "https://images.unsplash.com/photo-1432821596592-e2c18b78144f?w=600&q=80",
  "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&q=80",
];

const ITEMS_PER_PAGE = 3;

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Swipe animation variants based on direction
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 100 : -100,
    opacity: 0,
  }),
};

export default function EditorsPicks({
  currentSlug,
}: {
  currentSlug?: string;
}) {
  const [picks, setPicks] = useState<EditorsPickPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [[page, direction], setPage] = useState([0, 0]);

  useEffect(() => {
    async function fetchEditorsPicks() {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, title, slug, excerpt, cover_image_url, created_at")
        .eq("published", true)
        .eq("is_editors_pick", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching editor picks:", error);
      }

      if (data) {
        const filtered = currentSlug
          ? data.filter((post) => post.slug !== currentSlug)
          : data;

        setPicks(filtered);
      }
      setLoading(false);
    }

    fetchEditorsPicks();
  }, [currentSlug]);

  if (!loading && picks.length === 0) return null;

  const totalPages = Math.ceil(picks.length / ITEMS_PER_PAGE);

  const paginate = (newDirection: number) => {
    let newPage = page + newDirection;
    if (newPage < 0) newPage = totalPages - 1;
    if (newPage >= totalPages) newPage = 0;
    setPage([newPage, newDirection]);
  };

  const handleDragEnd = (
    _: unknown,
    info: { offset: { x: number }; velocity: { x: number } },
  ) => {
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold) {
      paginate(1);
    } else if (info.offset.x > swipeThreshold) {
      paginate(-1);
    }
  };

  const currentPicks = picks.slice(
    page * ITEMS_PER_PAGE,
    (page + 1) * ITEMS_PER_PAGE,
  );

  return (
    <aside className="lg:sticky lg:top-28 h-fit pr-1">
      {/* Header with Nav Controls */}
      <div className="pb-4 border-b md:px-0 px-6 border-navy/10 mb-4 flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-semibold text-navy">
            Editor's Picks
          </h2>
          <p className="text-xs text-navy/50 font-body mt-0.5">
            Curated stories worth reading
          </p>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => paginate(-1)}
              className="p-1.5 rounded-full border border-navy/10 hover:border-navy/30 text-navy/60 hover:text-navy transition-colors"
              aria-label="Previous picks"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => paginate(1)}
              className="p-1.5 rounded-full border border-navy/10 hover:border-navy/30 text-navy/60 hover:text-navy transition-colors"
              aria-label="Next picks"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 rounded-xl bg-navy/5 animate-pulse w-full"
            />
          ))}
        </div>
      ) : (
        <div className="relative overflow-hidden touch-pan-y min-h-[260px]">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={page}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              className="flex flex-col divide-y divide-navy/5 cursor-grab active:cursor-grabbing select-none"
            >
              {currentPicks.map((post, index) => {
                const globalIndex = page * ITEMS_PER_PAGE + index;
                const imageSrc =
                  post.cover_image_url ||
                  FALLBACK_IMAGES[globalIndex % FALLBACK_IMAGES.length];

                return (
                  <Link
                    key={post.id}
                    href={`/blogs/${post.slug}`}
                    className="group py-3.5 md:px-0 px-6 first:pt-0 last:pb-0 block"
                    draggable={false}
                  >
                    <article className="flex gap-3.5 items-center justify-between">
                      {/* Thumbnail */}
                      <div className="relative w-16 h-16 shrink-0 rounded-xl overflow-hidden bg-navy/5">
                        <img
                          src={imageSrc}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          draggable={false}
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <h3 className="font-display text-xs md:text-sm font-semibold text-navy leading-snug line-clamp-2 group-hover:text-navy/70 transition-colors">
                            {post.title}
                          </h3>
                          <ArrowUpRight
                            size={14}
                            className="shrink-0 text-navy/30 group-hover:text-navy group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200 mt-0.5"
                          />
                        </div>
                        <span className="text-[11px] text-navy/40 font-body block mt-1">
                          {formatDate(post.created_at)}
                        </span>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* Pagination Dot Indicators */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-1.5 pt-4">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setPage([idx, idx > page ? 1 : -1])}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === page ? "w-6 bg-navy" : "w-1.5 bg-navy/20"
              }`}
              aria-label={`Go to page ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </aside>
  );
}
