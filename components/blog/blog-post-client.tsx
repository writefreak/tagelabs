"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import BlogPostActions from "../blog-post-actions";

type Section = {
  heading: string;
  body: string;
};

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image_url: string | null;
  sections: Section[];
  created_at: string;
  updated_at: string;
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function BlogPostClient({
  post,
}: {
  post: BlogPost | null;
  slug: string;
}) {
  if (!post) {
    return (
      <section className="py-24 px-4 md:px-6 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 rounded-2xl bg-navy/5 border border-navy/10 flex items-center justify-center mb-6 mx-auto">
            <span className="text-2xl text-navy">✦</span>
          </div>
          <h1 className="font-display text-2xl font-semibold text-navy mb-3">
            We couldn't find that post.
          </h1>
          <p className="font-body text-navy/50 text-sm mb-8">
            It may have been moved, unpublished, or never existed.
          </p>
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-sm font-medium text-navy/60 hover:text-navy transition-colors"
          >
            <ArrowLeft size={16} />
            Back to all posts
          </Link>
        </div>
      </section>
    );
  }

  return (
    <article className="py-8 md:py-16 px-4 md:px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Back Button */}
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-xs md:text-sm font-medium text-navy/45 hover:text-navy transition-colors mb-6 md:mb-8 group"
          >
            <ArrowLeft
              size={15}
              className="group-hover:-translate-x-0.5 transition-transform duration-200"
            />
            All posts
          </Link>

          {/* Article Header */}
          <header className="mb-8">
            <h1 className="font-display text-2xl md:text-4xl lg:text-5xl font-semibold text-navy leading-[1.15] tracking-tight mb-4">
              {post.title}
            </h1>
            <p className="text-xs md:text-sm text-navy/40 font-mono uppercase tracking-wider">
              {formatDate(post.created_at)}
            </p>
          </header>

          {/* Cover Image */}
          {post.cover_image_url && (
            <div className="rounded-2xl overflow-hidden mb-10 aspect-[16/9] border border-navy/10 bg-navy/5 shadow-sm">
              <img
                src={post.cover_image_url}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Actions (Desktop) */}
          <div className="hidden md:block mb-10">
            <BlogPostActions title={post.title} slug={post.slug} />
          </div>

          {/* Body Content Sections */}
          <div className="flex flex-col gap-8 md:gap-10">
            {post.sections.map((section, i) => (
              <div key={i} className="flex flex-col gap-3">
                {section.heading && (
                  <h2 className="font-display text-lg md:text-2xl font-semibold text-navy leading-snug">
                    {section.heading}
                  </h2>
                )}
                <p className="font-sans text-navy/70 text-sm md:text-base leading-relaxed whitespace-pre-line">
                  {section.body}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Actions (Mobile) */}
        <div className="pt-10 md:hidden mt-6">
          <BlogPostActions title={post.title} slug={post.slug} />
        </div>
      </div>
    </article>
  );
}
