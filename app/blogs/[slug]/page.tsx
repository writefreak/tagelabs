"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/app/lib/supabase";

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

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchPost() {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .single();

      if (error || !data) {
        setNotFound(true);
      } else {
        setPost(data as BlogPost);
      }
      setLoading(false);
    }
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <section className="py-24 px-6" style={{ background: "#ffffff" }}>
        <div className="max-w-2xl mx-auto flex items-center justify-center gap-2 text-navy/40 text-sm">
          <svg
            className="animate-spin w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
          Loading post...
        </div>
      </section>
    );
  }

  if (notFound || !post) {
    return (
      <section className="py-24 px-6" style={{ background: "#ffffff" }}>
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-20 h-20 rounded-full bg-blue/10 flex items-center justify-center mb-6 mx-auto">
            <span className="text-3xl">✦</span>
          </div>
          <h1 className="font-display text-2xl font-semibold text-navy mb-3">
            We couldn't find that post.
          </h1>
          <p className="font-body text-navy/50 text-sm mb-8">
            It may have been moved, unpublished, or never existed.
          </p>
          <Link
            href="/blogs"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-navy/60 hover:text-navy transition-colors"
          >
            <ArrowLeft size={14} />
            Back to all posts
          </Link>
        </div>
      </section>
    );
  }

  return (
    <article className="py-16 md:py-24 px-6" style={{ background: "#ffffff" }}>
      <div className="max-w-2xl md:max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link
            href="/blogs"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-navy/45 hover:text-navy transition-colors mb-8"
          >
            <ArrowLeft size={14} />
            All posts
          </Link>

          <h1 className="font-display text-3xl md:text-4xl font-semibold text-navy leading-tight mb-3">
            {post.title}
          </h1>

          <p className="text-sm text-navy/40 mb-8">
            {formatDate(post.created_at)}
          </p>

          {post.cover_image_url && (
            <div className="rounded-2xl overflow-hidden mb-10 aspect-[16/9]">
              <img
                src={post.cover_image_url}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="flex flex-col gap-7">
            {post.sections.map((section, i) => (
              <div key={i}>
                {section.heading && (
                  <h2 className="font-display text-lg md:text-xl font-semibold text-navy mb-3">
                    {section.heading}
                  </h2>
                )}
                <p className="font-body text-navy/65 text-xs md:text-sm leading-relaxed">
                  {section.body}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </article>
  );
}
