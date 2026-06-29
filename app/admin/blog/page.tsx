"use client";
import { supabase } from "@/app/lib/supabase";
import { useState, useEffect } from "react";
import Link from "next/link";

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"All" | "Published" | "Draft">("All");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("blog_posts")
      .select("id, title, slug, excerpt, published, created_at, updated_at")
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

  const filtered = posts.filter(
    (p) =>
      filter === "All" || (filter === "Published" ? p.published : !p.published),
  );

  return (
    <div className="font-body max-w-[1100px]">
      {error && (
        <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-500">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-4 mb-7 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="font-display font-bold text-2xl text-navy">Blog</h2>
          <p className="text-navy/50 text-sm mt-1">
            {posts.length} total · {posts.filter((p) => p.published).length}{" "}
            published
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="flex items-center justify-center gap-2 bg-navy hover:bg-blue text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors duration-200 w-full sm:w-auto"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New post
        </Link>
      </div>

      <div className="flex gap-2 mb-5">
        {(["All", "Published", "Draft"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-all duration-200 ${
              filter === f
                ? "bg-navy text-white"
                : "bg-white text-navy/50 border border-navy/10 hover:border-navy/25"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-navy/[0.07] shadow-sm overflow-hidden">
        <div className="hidden md:grid grid-cols-[2fr_1fr_120px_100px] px-6 py-3.5 bg-navy/[0.03] border-b border-navy/[0.07]">
          {["Title", "Updated", "Status", "Actions"].map((h) => (
            <span
              key={h}
              className="text-[11px] font-semibold text-navy/40 uppercase tracking-wider"
            >
              {h}
            </span>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 gap-2 text-navy/40 text-sm">
            <svg
              className="animate-spin w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
            Loading posts...
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#112369"
              strokeWidth="1.5"
              opacity="0.2"
            >
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <path d="M14 2v6h6" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            <p className="text-navy/35 text-sm">No posts found.</p>
          </div>
        ) : (
          filtered.map((post, i) => (
            <div
              key={post.id}
              className={
                i < filtered.length - 1 ? "border-b border-navy/[0.06]" : ""
              }
            >
              {/* Desktop row */}
              <div className="hidden md:grid grid-cols-[2fr_1fr_120px_100px] px-6 py-4 items-center hover:bg-navy/[0.02] transition-colors">
                <div className="min-w-0">
                  <Link
                    href={`/admin/blog/${post.id}`}
                    className="text-sm font-semibold text-navy hover:text-blue transition-colors truncate block"
                  >
                    {post.title}
                  </Link>
                  <p className="text-[12px] text-navy/45 mt-0.5 truncate">
                    /{post.slug}
                  </p>
                </div>
                <p className="text-[13px] text-navy/40">
                  {new Date(post.updated_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                <span
                  className={`inline-flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1 rounded-full w-fit ${
                    post.published
                      ? "bg-green-100 text-green-600"
                      : "bg-red-50 text-red-400"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      post.published ? "bg-green-500" : "bg-red-400"
                    }`}
                  />
                  {post.published ? "Published" : "Draft"}
                </span>
                <div className="flex gap-2">
                  <Link
                    href={`/admin/blog/${post.id}`}
                    className="w-8 h-8 rounded-lg bg-blue/[0.08] hover:bg-blue/[0.18] text-blue flex items-center justify-center transition-colors"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </Link>
                  {deleteConfirm === post.id ? (
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="h-8 px-2.5 rounded-lg bg-red-500 text-white text-xs font-semibold"
                    >
                      Confirm
                    </button>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(post.id)}
                      className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-400 flex items-center justify-center transition-colors"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Mobile card */}
              <div className="md:hidden px-5 py-4 hover:bg-navy/[0.02] transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <Link
                    href={`/admin/blog/${post.id}`}
                    className="flex-1 min-w-0 text-left"
                  >
                    <p className="text-sm font-semibold text-navy truncate hover:text-blue transition-colors">
                      {post.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <p className="text-[12px] text-navy/50 truncate">
                        /{post.slug}
                      </p>
                      <span className="text-navy/20">·</span>
                      <p className="text-[12px] text-navy/40">
                        {new Date(post.updated_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </Link>
                  <div className="flex flex-col items-end gap-2.5 shrink-0">
                    <span
                      className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                        post.published
                          ? "bg-green-100 text-green-600"
                          : "bg-red-50 text-red-400"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          post.published ? "bg-green-500" : "bg-red-400"
                        }`}
                      />
                      {post.published ? "Published" : "Draft"}
                    </span>
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/blog/${post.id}`}
                        className="w-8 h-8 rounded-lg bg-blue/[0.08] hover:bg-blue/[0.18] text-blue flex items-center justify-center transition-colors"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </Link>
                      {deleteConfirm === post.id ? (
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="h-8 px-2.5 rounded-lg bg-red-500 text-white text-xs font-semibold"
                        >
                          Confirm
                        </button>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(post.id)}
                          className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-400 flex items-center justify-center transition-colors"
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
