"use client";

import { supabase } from "@/app/lib/supabase";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  X,
  FileText,
  Pencil,
  Trash2,
  Loader2,
  CheckCircle2,
  Clock,
  Search,
  Star,
  ImageIcon,
} from "lucide-react";

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image_url?: string | null;
  published: boolean;
  is_editors_pick: boolean;
  created_at: string;
  updated_at: string;
};

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [filter, setFilter] = useState<"All" | "Published" | "Draft">("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("blog_posts")
      .select(
        "id, title, slug, excerpt, cover_image_url, published, is_editors_pick, created_at, updated_at",
      )
      .order("updated_at", { ascending: false });

    if (error) setError(error.message);
    else setPosts(data ?? []);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) setError(error.message);
    else setPosts((prev) => prev.filter((p) => p.id !== id));
    setDeleteConfirm(null);
  }

  const filtered = posts.filter((p) => {
    const matchesFilter =
      filter === "All" || (filter === "Published" ? p.published : !p.published);
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.excerpt &&
        p.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="font-body w-full max-w-6xl mx-auto py-4 sm:py-8">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between border-b border-navy/10 pb-5">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-navy tracking-tight">
            Manage Our Blogs Here
          </h1>
          <p className="text-navy/50 text-xs sm:text-sm mt-0.5">
            {posts.length} total · {posts.filter((p) => p.published).length}{" "}
            published
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="flex items-center justify-center gap-2 bg-navy hover:bg-blue text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-xs w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          New post
        </Link>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-xs sm:text-sm text-red-600 flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="text-red-400 hover:text-red-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6 bg-white p-2.5 rounded-2xl border border-navy/10 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-navy/40" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search posts or slugs..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-navy/[0.02] border border-navy/10 text-xs text-navy outline-none focus:border-blue"
          />
        </div>

        <div className="flex items-center bg-navy/[0.03] p-1 rounded-xl border border-navy/10 shrink-0 justify-between sm:justify-start">
          {(["All", "Published", "Draft"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                filter === f
                  ? "bg-navy text-white shadow-xs"
                  : "text-navy/50 hover:text-navy"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Display */}
      {loading ? (
        <div className="flex items-center justify-center py-16 gap-3 text-navy/50 text-xs bg-white rounded-2xl border border-navy/10">
          <Loader2 className="w-4 h-4 animate-spin text-blue" />
          Loading posts...
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-navy/10 text-navy/40 text-xs flex flex-col items-center gap-2">
          <FileText className="w-8 h-8 opacity-30" />
          No posts found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((post) => (
            <div
              key={post.id}
              className="group bg-white rounded-2xl border border-navy/10 overflow-hidden shadow-xs hover:border-navy/30 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Cover Image Container */}
                <div className="relative w-full h-40 bg-navy/[0.04] border-b border-navy/10 overflow-hidden">
                  {post.cover_image_url ? (
                    <img
                      src={post.cover_image_url}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-navy/25">
                      <ImageIcon className="w-6 h-6" />
                      <span className="text-[10px] font-medium">
                        No cover image
                      </span>
                    </div>
                  )}

                  {/* Status Badges Overlay */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-md shadow-xs ${
                        post.published
                          ? "bg-emerald-500/90 text-white"
                          : "bg-amber-500/90 text-white"
                      }`}
                    >
                      {post.published ? (
                        <CheckCircle2 className="w-2.5 h-2.5" />
                      ) : (
                        <Clock className="w-2.5 h-2.5" />
                      )}
                      {post.published ? "Published" : "Draft"}
                    </span>

                    {post.is_editors_pick && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/90 text-blue backdrop-blur-md shadow-xs border border-blue/20">
                        <Star className="w-3 h-3 fill-blue text-blue" />
                        Pick
                      </span>
                    )}
                  </div>
                </div>

                {/* Main Content */}
                <div className="p-4 space-y-2">
                  <Link
                    href={`/admin/blog/${post.id}`}
                    className="font-display font-bold text-sm sm:text-base text-navy hover:text-blue transition-colors line-clamp-1 block"
                  >
                    {post.title}
                  </Link>

                  <p className="text-[12px] text-navy/45 font-mono truncate">
                    /{post.slug}
                  </p>

                  <p className="text-xs text-navy/60 line-clamp-2 leading-snug pt-1">
                    {post.excerpt || "No excerpt provided."}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-4 py-3 bg-navy/[0.01] border-t border-navy/10 flex items-center justify-between">
                <span className="text-[11px] text-navy/40 font-medium">
                  {new Date(post.updated_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>

                <div className="flex items-center gap-1.5">
                  <Link
                    href={`/admin/blog/${post.id}`}
                    className="w-8 h-8 rounded-lg bg-blue/[0.08] hover:bg-blue/[0.18] text-blue flex items-center justify-center transition-colors"
                    title="Edit Post"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </Link>

                  {deleteConfirm === post.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="h-8 px-2 rounded-lg bg-red-500 text-white text-xs font-semibold"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="p-1 text-navy/40 hover:text-navy"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(post.id)}
                      className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-400 flex items-center justify-center transition-colors"
                      title="Delete Post"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
