"use client";

import { supabase } from "@/app/lib/supabase";
import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  UploadCloud,
  X,
  Trash2,
  ChevronUp,
  ChevronDown,
  Plus,
  Star,
  Loader2,
  Check,
} from "lucide-react";

type Section = {
  heading: string;
  body: string;
};

const emptySection = (): Section => ({ heading: "", body: "" });

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const MAX_FILE_SIZE_MB = 5;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export default function BlogEditorPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const isNew = id === "new";
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    cover_image_url: "",
    sections: [emptySection()],
    published: false,
    is_editors_pick: false,
  });

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!isNew) fetchPost();
  }, [isNew, id]);

  function autoResize(e: React.FormEvent<HTMLTextAreaElement>) {
    const target = e.currentTarget;
    target.style.height = "auto";
    target.style.height = `${target.scrollHeight}px`;
  }

  async function fetchPost() {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("blog_posts")
      .select(
        "id, title, slug, excerpt, cover_image_url, sections, published, is_editors_pick",
      )
      .eq("id", id)
      .single();

    if (error || !data) {
      setError(error?.message ?? "Post not found.");
    } else {
      setForm({
        title: data.title ?? "",
        slug: data.slug ?? "",
        excerpt: data.excerpt ?? "",
        cover_image_url: data.cover_image_url ?? "",
        sections: data.sections?.length ? data.sections : [emptySection()],
        published: data.published ?? false,
        is_editors_pick: data.is_editors_pick ?? false,
      });
      setSlugTouched(true);
    }
    setLoading(false);
  }

  function handleTitleChange(value: string) {
    setForm((f) => ({
      ...f,
      title: value,
      slug: slugTouched ? f.slug : slugify(value),
    }));
  }

  async function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Please upload a JPG, PNG, WEBP, or GIF image.");
      return;
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`Image must be under ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }

    setUploading(true);
    setError(null);

    const ext = file.name.split(".").pop();
    const path = `${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("blog-images")
      .upload(path, file, { cacheControl: "3600", upsert: false });

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from("blog-images")
      .getPublicUrl(path);

    setForm((f) => ({ ...f, cover_image_url: publicUrlData.publicUrl }));
    setUploading(false);
  }

  function updateSection(index: number, field: keyof Section, value: string) {
    setForm((f) => {
      const sections = f.sections.map((s, i) =>
        i === index ? { ...s, [field]: value } : s,
      );
      return { ...f, sections };
    });
  }

  function addSection() {
    setForm((f) => ({ ...f, sections: [...f.sections, emptySection()] }));
  }

  function removeSection(index: number) {
    setForm((f) => ({
      ...f,
      sections: f.sections.filter((_, i) => i !== index),
    }));
  }

  function moveSection(index: number, direction: number) {
    setForm((f) => {
      const next = [...f.sections];
      const target = index + direction;
      if (target < 0 || target >= next.length) return f;
      [next[index], next[target]] = [next[target], next[index]];
      return { ...f, sections: next };
    });
  }

  async function handleSubmit() {
    if (!form.title.trim() || !form.slug.trim()) return;
    setSaving(true);
    setError(null);

    const payload = {
      title: form.title,
      slug: form.slug,
      excerpt: form.excerpt,
      cover_image_url: form.cover_image_url || null,
      sections: form.sections.filter((s) => s.body.trim().length > 0),
      published: form.published,
      is_editors_pick: form.is_editors_pick,
    };

    if (isNew) {
      const { data, error } = await supabase
        .from("blog_posts")
        .insert(payload)
        .select("id")
        .single();
      if (error) {
        setError(error.message);
        setSaving(false);
        return;
      }
      setSaving(false);
      router.push(`/admin/blog/${data.id}`);
    } else {
      const { error } = await supabase
        .from("blog_posts")
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) {
        setError(error.message);
        setSaving(false);
        return;
      }
      setSaving(false);
      router.push("/admin/blog");
    }
  }

  async function handleDelete() {
    setDeleting(true);
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) {
      setError(error.message);
      setDeleting(false);
      return;
    }
    router.push("/admin/blog");
  }

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-2 text-navy/40 font-body">
        <Loader2 className="animate-spin w-5 h-5 text-navy/60" />
        <span className="text-xs font-medium">Loading content...</span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 py-4 font-body text-navy min-h-screen">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-navy/10 mb-6">
        <div className="flex items-center gap-2">
          <Link
            href="/admin/blog"
            className="p-1.5 -ml-1.5 rounded-lg text-navy/60 hover:text-navy hover:bg-navy/5 transition-all"
          >
            <ArrowLeft size={18} />
          </Link>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-navy tracking-tight">
            Add New Blog
          </h1>
        </div>

        <div className="flex items-center gap-2 flex-wrap md:ml-auto">
          <button
            type="button"
            onClick={() =>
              setForm((f) => ({ ...f, is_editors_pick: !f.is_editors_pick }))
            }
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all flex items-center gap-1 border ${
              form.is_editors_pick
                ? "border-blue bg-blue/10 text-blue"
                : "border-navy/15 text-navy/60 hover:text-navy"
            }`}
          >
            <Star
              size={13}
              className={form.is_editors_pick ? "fill-blue" : ""}
            />
            Featured
          </button>

          <button
            type="button"
            onClick={() => setForm((f) => ({ ...f, published: !f.published }))}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all flex items-center gap-1 border ${
              form.published
                ? "border-emerald-600 bg-emerald-50 text-emerald-600"
                : "border-navy/15 text-navy/60 hover:text-navy"
            }`}
          >
            <Check size={13} />
            {form.published ? "Published" : "Draft"}
          </button>

          {!isNew && (
            <button
              type="button"
              onClick={() =>
                deleteConfirm ? handleDelete() : setDeleteConfirm(true)
              }
              disabled={deleting}
              className={`p-1.5 rounded-md text-xs transition-all border ${
                deleteConfirm
                  ? "bg-red-500 text-white border-red-500"
                  : "border-navy/15 text-navy/40 hover:text-red-500 hover:border-red-200"
              }`}
            >
              {deleting ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Trash2 size={14} />
              )}
            </button>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving || !form.title.trim() || !form.slug.trim()}
            className="bg-navy hover:bg-blue disabled:opacity-40 text-white text-xs font-semibold px-3 py-1 rounded-md transition-all flex items-center gap-1"
          >
            {saving && <Loader2 size={13} className="animate-spin" />}
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-500 flex items-center justify-between">
          <span>{error}</span>
          <button type="button" onClick={() => setError(null)}>
            <X size={14} />
          </button>
        </div>
      )}

      {/* Editor Main Content */}
      <div className="flex flex-col gap-5">
        {/* Cover Image Upload */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-navy/50">
            Cover Image
          </label>
          {form.cover_image_url ? (
            <div className="relative rounded-lg overflow-hidden aspect-[21/9] w-full border border-navy/10">
              <img
                src={form.cover_image_url}
                alt="Cover"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => {
                  setForm((f) => ({ ...f, cover_image_url: "" }));
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="absolute top-2 right-2 p-1 rounded bg-black/60 hover:bg-black text-white transition-all"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full py-4 rounded-lg border border-dashed border-navy/20 hover:border-navy/40 transition-all flex items-center justify-center gap-2 text-navy/50 text-xs"
            >
              {uploading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <>
                  <UploadCloud size={14} />
                  <span>Upload cover image</span>
                </>
              )}
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_TYPES.join(",")}
            onChange={handleImageSelect}
            className="hidden"
          />
        </div>

        {/* Title */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-navy/50">Title</label>
          <textarea
            value={form.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            onInput={autoResize}
            placeholder="Post title..."
            rows={1}
            className="w-full bg-transparent text-lg sm:text-xl font-display font-semibold text-navy placeholder:text-navy/20 outline-none resize-none overflow-hidden border-b border-navy/10 pb-1 focus:border-navy/30"
          />
        </div>

        {/* Slug */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-navy/50">URL Slug</label>
          <input
            value={form.slug}
            onChange={(e) => {
              setSlugTouched(true);
              setForm((f) => ({ ...f, slug: e.target.value }));
            }}
            placeholder="post-url-slug"
            className="w-full bg-transparent text-xs text-navy/80 outline-none border-b border-navy/10 pb-1 focus:border-navy/30"
          />
        </div>

        {/* Excerpt */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-navy/50">Excerpt</label>
          <textarea
            value={form.excerpt}
            onChange={(e) =>
              setForm((f) => ({ ...f, excerpt: e.target.value }))
            }
            onInput={autoResize}
            placeholder="Brief excerpt or description..."
            rows={1}
            className="w-full bg-transparent text-xs sm:text-sm text-navy/80 placeholder:text-navy/20 outline-none resize-none overflow-hidden border-b border-navy/10 pb-1 focus:border-navy/30 leading-relaxed"
          />
        </div>

        {/* Body Blocks */}
        <div className="flex flex-col gap-4 pt-2">
          {form.sections.map((section, index) => (
            <div
              key={index}
              className="flex flex-col gap-2 p-3 rounded-lg border border-navy/10 bg-white/50 focus-within:border-navy/30 transition-all"
            >
              <div className="flex items-center justify-between pb-1">
                <label className="text-xs font-medium text-navy/50">
                  Block {index + 1}
                </label>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveSection(index, -1)}
                    disabled={index === 0}
                    className="p-1 text-navy/30 hover:text-navy disabled:opacity-10"
                  >
                    <ChevronUp size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveSection(index, 1)}
                    disabled={index === form.sections.length - 1}
                    className="p-1 text-navy/30 hover:text-navy disabled:opacity-10"
                  >
                    <ChevronDown size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeSection(index)}
                    disabled={form.sections.length === 1}
                    className="p-1 text-navy/30 hover:text-red-500 disabled:opacity-10"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

              <input
                value={section.heading}
                onChange={(e) =>
                  updateSection(index, "heading", e.target.value)
                }
                placeholder="Section heading (optional)"
                className="w-full bg-transparent text-xs sm:text-sm font-semibold text-navy placeholder:text-navy/20 outline-none border-b border-navy/10 pb-1"
              />

              <textarea
                value={section.body}
                onChange={(e) => updateSection(index, "body", e.target.value)}
                onInput={autoResize}
                placeholder="Section body text..."
                rows={2}
                className="w-full bg-transparent text-xs sm:text-sm text-navy/80 placeholder:text-navy/20 outline-none resize-none overflow-hidden leading-relaxed pt-1"
              />
            </div>
          ))}

          <button
            type="button"
            onClick={addSection}
            className="w-full py-2.5 border border-dashed border-navy/20 hover:border-navy/40 rounded-lg text-xs font-medium text-navy/60 hover:text-navy flex items-center justify-center gap-1.5 transition-all"
          >
            <Plus size={14} />
            Add Section Block
          </button>
        </div>
      </div>
    </div>
  );
}
