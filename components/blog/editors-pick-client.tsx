"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
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

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function EditorsPicks({
  currentSlug,
}: {
  currentSlug?: string;
}) {
  const [picks, setPicks] = useState<EditorsPickPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEditorsPicks() {
      // 1. Fetch all published editor's picks without a low limit
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
        // 2. Filter out the current active article
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

  return (
    <aside className="lg:sticky lg:top-28 h-fit max-h-[calc(100vh-8rem)] overflow-y-auto pr-1">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="pb-4 border-b md:px-0 px-6 border-navy/10 mb-6 sticky top-0 bg-white z-10"
      >
        <h2 className="font-display text-lg font-semibold text-navy">
          Editor's Picks
        </h2>
        <p className="text-xs text-navy/50 font-body mt-0.5">
          Curated stories worth reading
        </p>
      </motion.div>

      {loading ? (
        <div className="flex flex-col gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-20 rounded-xl bg-navy/5 animate-pulse w-full"
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-navy/5">
          {picks.map((post, index) => {
            const imageSrc =
              post.cover_image_url ||
              FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];

            return (
              <Link
                key={post.id}
                href={`/blogs/${post.slug}`}
                className="group py-3.5 md:px-0 px-6 first:pt-0 last:pb-0 block"
              >
                <article className="flex gap-3.5 items-center justify-between">
                  {/* Thumbnail */}
                  <div className="relative w-16 h-16 shrink-0 rounded-xl overflow-hidden bg-navy/5">
                    <img
                      src={imageSrc}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
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
        </div>
      )}
    </aside>
  );
}
