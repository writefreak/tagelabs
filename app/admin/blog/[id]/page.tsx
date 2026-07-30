"use client";
import { supabase } from "@/app/lib/supabase";
import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { FileText, Star } from "lucide-react";

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
  published: boolean;
  is_editors_pick: boolean; // ← add
};
const inputClass =
  "w-full px-3.5 py-2.5 rounded-[10px] border border-navy/15 bg-offwhite text-sm text-navy font-body outline-none focus:border-blue transition-colors";
const labelClass =
  "block text-[11px] font-semibold text-navy/60 uppercase tracking-wider mb-1.5";
const pillClass = (active: boolean) =>
  `px-3.5 py-2 rounded-[10px] text-xs font-semibold font-body border transition-all duration-200 ${
    active
      ? "bg-navy border-navy text-white"
      : "bg-offwhite border-navy/15 text-navy/50 hover:border-navy/30 hover:text-navy/70"
  }`;

const emptySection = (): Section => ({ heading: "", body: "" });
const emptyForm = () => ({
  title: "",
  slug: "",
  excerpt: "",
  cover_image_url: "" as string,
  sections: [emptySection()] as Section[],
  published: false,
  is_editors_pick: false, // ← add
});

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

// ── Component ─────────────────────────────────────────────────────────────

export default function BlogEditorPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const isNew = id === "new";
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState(emptyForm());
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

  async function fetchPost() {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("blog_posts")
      .select(
        "id, title, slug, excerpt, cover_image_url, sections, published, is_editors_pick",
      ) // ← added is_editors_pick
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
        is_editors_pick: data.is_editors_pick ?? false, // ← add
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

  async function handleRemoveImage() {
    setForm((f) => ({ ...f, cover_image_url: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
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
      is_editors_pick: form.is_editors_pick, // ← add
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

  const wordCount = form.sections
    .map((s) => s.body.trim().split(/\s+/).filter(Boolean).length)
    .reduce((a, b) => a + b, 0);

  if (loading) {
    return (
      <div className="font-body max-w-[1100px] flex items-center justify-center py-16 gap-2 text-navy/40 text-sm">
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
    );
  }

  return (
    <div className="font-body max-w-[1100px]">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-7">
        <Link
          href="/admin/blog"
          className="flex items-center gap-1.5 text-[13px] text-navy/45 hover:text-navy transition-colors font-body"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Blog
        </Link>
        <span className="text-navy/20 text-sm">/</span>
        <span className="text-[13px] font-semibold text-navy">
          {isNew ? "New post" : "Edit post"}
        </span>
      </div>

      {error && (
        <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-500">
          {error}
        </div>
      )}

      <div className="flex gap-6 items-start">
        {/* Left: form */}
        <div className="flex-1 min-w-0 flex flex-col gap-5">
          {/* Post details */}
          <div className="bg-white rounded-2xl p-5 sm:p-7 border border-navy/10 shadow-sm">
            <h3 className="font-display font-semibold text-base text-navy mb-5">
              Post details
            </h3>
            <div className="flex flex-col gap-4">
              <div>
                <label className={labelClass}>Cover image</label>

                {form.cover_image_url ? (
                  <div className="relative rounded-xl overflow-hidden border border-navy/10 aspect-[16/9] max-w-md">
                    <img
                      src={form.cover_image_url}
                      alt="Cover"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors"
                    >
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="w-full max-w-md aspect-[16/9] rounded-xl border-2 border-dashed border-navy/15 bg-offwhite hover:border-blue hover:bg-blue/[0.03] transition-colors flex flex-col items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {uploading ? (
                      <>
                        <svg
                          className="animate-spin w-5 h-5 text-navy/40"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                        </svg>
                        <span className="text-[12px] text-navy/40">
                          Uploading...
                        </span>
                      </>
                    ) : (
                      <>
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#112369"
                          strokeWidth="1.5"
                          opacity="0.3"
                        >
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <circle cx="9" cy="9" r="2" />
                          <path d="M21 15l-5-5L5 21" />
                        </svg>
                        <span className="text-[12px] text-navy/40">
                          Click to upload a cover image
                        </span>
                        <span className="text-[10px] text-navy/25">
                          JPG, PNG, WEBP up to {MAX_FILE_SIZE_MB}MB
                        </span>
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
              <div>
                <label className={labelClass}>Title *</label>
                <input
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Why your business needs a real website"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Slug</label>
                <input
                  value={form.slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    setForm((f) => ({ ...f, slug: e.target.value }));
                  }}
                  placeholder="why-your-business-needs-a-website"
                  className={`${inputClass} text-navy/60`}
                />
              </div>
              <div>
                <label className={labelClass}>
                  Excerpt (used for SEO description and previews)
                </label>
                <textarea
                  value={form.excerpt}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, excerpt: e.target.value }))
                  }
                  rows={2}
                  maxLength={160}
                  className={`${inputClass} resize-y`}
                />
                <p className="text-[11px] text-navy/35 mt-1">
                  {form.excerpt.length}/160
                </p>
              </div>
              <div className="rounded-[10px] border border-navy/15 bg-offwhite p-3.5">
                <label className={labelClass}>Post status</label>
                <div className="relative grid grid-cols-2 gap-1 p-1 rounded-[9px] bg-navy/[0.06]">
                  <div
                    className="absolute inset-y-1 z-0 w-[calc(50%-4px)] rounded-[7px] bg-white shadow-[0_1px_3px_rgba(17,35,105,0.12)] transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                    style={{
                      transform: form.is_editors_pick
                        ? "translateX(calc(100% + 8px))"
                        : "translateX(0)",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setForm((f) => ({ ...f, is_editors_pick: false }))
                    }
                    className={`relative z-10 flex items-center justify-center gap-1.5 py-2.5 rounded-[7px] text-[12.5px] font-semibold font-body transition-colors duration-200 ${
                      !form.is_editors_pick
                        ? "text-navy"
                        : "text-navy/35 hover:text-navy/55"
                    }`}
                  >
                    <FileText size={13} strokeWidth={2} />
                    Standard
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setForm((f) => ({ ...f, is_editors_pick: true }))
                    }
                    className={`relative z-10 flex items-center justify-center gap-1.5 py-2.5 rounded-[7px] text-[12.5px] font-semibold font-body transition-colors duration-200 ${
                      form.is_editors_pick
                        ? "text-navy"
                        : "text-navy/35 hover:text-navy/55"
                    }`}
                  >
                    <Star
                      size={13}
                      strokeWidth={2}
                      fill={form.is_editors_pick ? "#4a8fe2" : "none"}
                      color={form.is_editors_pick ? "#4a8fe2" : "currentColor"}
                      className="transition-all duration-200"
                    />
                    Editor's Pick
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sections */}
          <div className="bg-white rounded-2xl p-5 sm:p-7 border border-navy/10 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-semibold text-base text-navy">
                Sections
              </h3>
              <span className="text-[12px] text-navy/40">
                {wordCount} words total
              </span>
            </div>

            <div className="flex flex-col gap-4">
              {form.sections.map((section, index) => (
                <div
                  key={index}
                  className="relative border border-navy/10 rounded-xl p-4 bg-offwhite/60"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-semibold text-navy/40 uppercase tracking-wider">
                      Section {index + 1}
                    </span>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => moveSection(index, -1)}
                        disabled={index === 0}
                        className="w-6 h-6 rounded-md flex items-center justify-center text-navy/30 hover:text-navy hover:bg-navy/[0.06] disabled:opacity-25 transition-colors"
                      >
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <polyline points="18 15 12 9 6 15" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => moveSection(index, 1)}
                        disabled={index === form.sections.length - 1}
                        className="w-6 h-6 rounded-md flex items-center justify-center text-navy/30 hover:text-navy hover:bg-navy/[0.06] disabled:opacity-25 transition-colors"
                      >
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => removeSection(index)}
                        disabled={form.sections.length === 1}
                        className="w-6 h-6 rounded-md flex items-center justify-center text-navy/30 hover:text-red-400 hover:bg-red-50 disabled:opacity-25 transition-colors"
                      >
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <input
                      value={section.heading}
                      onChange={(e) =>
                        updateSection(index, "heading", e.target.value)
                      }
                      placeholder="Subheading (optional)"
                      className={`${inputClass} font-medium`}
                    />
                    <textarea
                      value={section.body}
                      onChange={(e) =>
                        updateSection(index, "body", e.target.value)
                      }
                      placeholder="Paragraph text"
                      rows={4}
                      className={`${inputClass} resize-y`}
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addSection}
              className="mt-4 w-full flex items-center justify-center gap-2 border border-dashed border-navy/20 rounded-xl py-2.5 text-[13px] text-navy/40 hover:border-blue hover:text-blue transition-colors font-body"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add section
            </button>
          </div>

          {/* Save bar */}
          {/* Save bar */}
          {/* Save bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pb-8">
            <div className="flex gap-2">
              {([false, true] as const).map((val) => (
                <button
                  key={String(val)}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, published: val }))}
                  className={pillClass(form.published === val)}
                >
                  {val ? "Published" : "Draft"}
                </button>
              ))}
            </div>

            <div className="flex gap-3 sm:ml-auto w-full sm:w-auto">
              {!isNew &&
                (deleteConfirm ? (
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors flex-1 sm:flex-none"
                  >
                    {deleting ? "Deleting..." : "Confirm delete"}
                  </button>
                ) : (
                  <button
                    onClick={() => setDeleteConfirm(true)}
                    className="border border-red-200 text-red-400 text-sm px-5 py-2.5 rounded-xl hover:bg-red-50 transition-colors flex-1 sm:flex-none"
                  >
                    Delete
                  </button>
                ))}
              <Link
                href="/admin/blog"
                className="border border-navy/15 text-navy/50 text-sm px-5 py-2.5 rounded-xl hover:border-navy/30 transition-colors flex-1 sm:flex-none text-center"
              >
                Cancel
              </Link>
              <button
                onClick={handleSubmit}
                disabled={saving || !form.title.trim() || !form.slug.trim()}
                className="bg-navy hover:bg-blue disabled:opacity-50 text-white text-sm font-semibold px-7 py-2.5 rounded-xl transition-colors flex-1 sm:flex-none"
              >
                {saving ? "Saving..." : isNew ? "Create post" : "Save changes"}
              </button>
            </div>
          </div>
        </div>

        {/* Right: skeleton preview */}
        <div className="hidden lg:block lg:w-72 shrink-0 sticky top-4">
          <p className={labelClass}>Post preview</p>

          {form.title || form.sections.some((s) => s.body) ? (
            <div className="bg-white border border-navy/10 rounded-2xl overflow-hidden shadow-sm">
              {form.cover_image_url && (
                <div className="aspect-[16/9] w-full">
                  <img
                    src={form.cover_image_url}
                    alt="Cover"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-5">
                <p className="text-[13px] font-bold text-navy mb-3">
                  {form.title || (
                    <span className="text-navy/20">Post title</span>
                  )}
                </p>
                {form.sections.map((s, i) =>
                  s.body || s.heading ? (
                    <div key={i} className="mb-3">
                      {s.heading && (
                        <p className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-1">
                          {s.heading}
                        </p>
                      )}
                      {s.body && (
                        <p className="text-[9px] text-navy/50 leading-relaxed line-clamp-3">
                          {s.body}
                        </p>
                      )}
                    </div>
                  ) : null,
                )}
              </div>
            </div>
          ) : (
            <div className="h-64 rounded-2xl border-2 border-dashed border-navy/10 flex flex-col items-center justify-center gap-2 text-center px-4">
              <svg
                width="24"
                height="24"
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
              <p className="text-[12px] text-navy/25 leading-relaxed">
                Fill in the form to
                <br />
                see the post preview
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
