"use client";
import { supabase } from "@/app/lib/supabase";
import { useState, useEffect } from "react";

type Project = {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  live_url: string;
  image_url: string;
  status: "Published" | "Draft";
  created_at: string;
};

const categories = ["Landing Page", "Web App", "Frontend Dev", "Design", "Portfolio", "E-commerce"];

const emptyForm = {
  title: "", category: "", description: "",
  tags: "", live_url: "", image_url: "", status: "Draft" as "Published" | "Draft",
};

const inputClass = "w-full px-3.5 py-2.5 rounded-[10px] border border-navy/15 bg-offwhite text-sm text-navy font-body outline-none focus:border-blue transition-colors";
const labelClass = "block text-[11px] font-semibold text-navy/60 uppercase tracking-wider mb-1.5";
const pillClass = (active: boolean) =>
  `px-3.5 py-2 rounded-[10px] text-xs font-semibold font-body border transition-all duration-200 ${
    active
      ? "bg-navy border-navy text-white"
      : "bg-offwhite border-navy/15 text-navy/50 hover:border-navy/30 hover:text-navy/70"
  }`;

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [filter, setFilter] = useState<"All" | "Published" | "Draft">("All");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => { fetchProjects(); }, []);

  async function fetchProjects() {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) setError(error.message);
    else setProjects(data ?? []);
    setLoading(false);
  }

  async function handleSubmit() {
    if (!form.title || !form.category) return;
    setSaving(true);
    setError(null);

    let image_url = form.image_url;

    if (imageFile) {
      const ext = imageFile.name.split(".").pop();
      const fileName = `${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("project-images")
        .upload(fileName, imageFile, { upsert: true });

      if (uploadError) {
        setError(uploadError.message);
        setSaving(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("project-images")
        .getPublicUrl(fileName);

      image_url = urlData.publicUrl;
    }

    const tagArray = form.tags.split(",").map((t) => t.trim()).filter(Boolean);

    const payload = {
      title: form.title,
      category: form.category,
      description: form.description,
      tags: tagArray,
      live_url: form.live_url,
      image_url,
      status: form.status,
    };

    if (editId) {
      const { error } = await supabase.from("projects").update(payload).eq("id", editId).select();
      if (error) setError(error.message);
    } else {
      const { error } = await supabase.from("projects").insert(payload).select();
      if (error) setError(error.message);
    }

    setSaving(false);
    setForm(emptyForm);
    setImageFile(null);
    setImagePreview(null);
    setShowForm(false);
    setEditId(null);
    fetchProjects();
  }

  function handleEdit(p: Project) {
    setForm({
      title: p.title, category: p.category, description: p.description,
      tags: p.tags.join(", "), live_url: p.live_url, image_url: p.image_url, status: p.status,
    });
    setImagePreview(p.image_url || null);
    setEditId(p.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id: string) {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) setError(error.message);
    else setProjects((prev) => prev.filter((p) => p.id !== id));
    setDeleteConfirm(null);
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  }

  function clearImage() {
    setImageFile(null);
    setImagePreview(null);
    setForm((f) => ({ ...f, image_url: "" }));
  }

  const filtered = projects.filter((p) => filter === "All" || p.status === filter);
  const previewTags = form.tags.split(",").map((t) => t.trim()).filter(Boolean);
  const hasPreview = form.title || form.category || imagePreview;

  return (
    <div className="font-body max-w-[1100px]">

      {/* Header */}
      <div className="flex flex-col gap-4 mb-7 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="font-display font-bold text-2xl text-navy">Projects</h2>
          <p className="text-navy/50 text-sm mt-1">
            {projects.length} total · {projects.filter((p) => p.status === "Published").length} published
          </p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setEditId(null); setForm(emptyForm); setImageFile(null); setImagePreview(null); }}
          className="flex items-center justify-center gap-2 bg-navy hover:bg-blue text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors duration-200 w-full sm:w-auto"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          {showForm && !editId ? "Cancel" : "Add Project"}
        </button>
      </div>

      {error && (
        <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-500">{error}</div>
      )}

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-2xl p-5 sm:p-7 border border-navy/10 shadow-md mb-7">
          <h3 className="font-display font-semibold text-lg text-navy mb-6">
            {editId ? "Edit Project" : "Upload New Project"}
          </h3>

          {/* Form + Preview side by side on large screens */}
          <div className="flex flex-col lg:flex-row gap-7">

            {/* Left: fields */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Title */}
              <div className="col-span-1 sm:col-span-2">
                <label className={labelClass}>Project Title *</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. BrandKit Agency Site" className={inputClass} />
              </div>

              {/* Category */}
              <div>
                <label className={labelClass}>Category *</label>
                <div className="flex flex-wrap gap-2 sm:hidden">
                  {categories.map((c) => (
                    <button key={c} type="button" onClick={() => setForm({ ...form, category: c })} className={pillClass(form.category === c)}>
                      {c}
                    </button>
                  ))}
                </div>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={`${inputClass} hidden sm:block`}>
                  <option value="">Select category</option>
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Status */}
              <div>
                <label className={labelClass}>Status</label>
                <div className="flex gap-2 sm:hidden">
                  {(["Draft", "Published"] as const).map((s) => (
                    <button key={s} type="button" onClick={() => setForm({ ...form, status: s })} className={pillClass(form.status === s)}>
                      {s}
                    </button>
                  ))}
                </div>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as "Published" | "Draft" })} className={`${inputClass} hidden sm:block`}>
                  <option value="Draft">Draft</option>
                  <option value="Published">Published</option>
                </select>
              </div>

              {/* Description */}
              <div className="col-span-1 sm:col-span-2">
                <label className={labelClass}>Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Brief description..." rows={3} className={`${inputClass} resize-y`} />
              </div>

              {/* Tags */}
              <div>
                <label className={labelClass}>Tags (comma-separated)</label>
                <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="Next.js, Tailwind, Framer Motion" className={inputClass} />
              </div>

              {/* Live URL */}
              <div>
                <label className={labelClass}>Live URL</label>
                <input value={form.live_url} onChange={(e) => setForm({ ...form, live_url: e.target.value })} placeholder="https://yourproject.com" className={inputClass} />
              </div>

              {/* Cover Image Upload */}
              <div className="col-span-1 sm:col-span-2">
                <label className={labelClass}>Cover Image</label>
                {!imagePreview ? (
                  <label className="flex flex-col items-center justify-center w-full h-36 rounded-[10px] border-2 border-dashed border-navy/20 bg-offwhite hover:border-blue hover:bg-blue/[0.03] transition-all duration-200 cursor-pointer group">
                    <div className="flex flex-col items-center gap-2 pointer-events-none">
                      <div className="w-10 h-10 rounded-full bg-blue/10 flex items-center justify-center group-hover:bg-blue/20 transition-colors">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4a8fe2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="17 8 12 3 7 8" />
                          <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-navy/50 group-hover:text-blue transition-colors">
                        Click to upload image
                      </p>
                      <p className="text-[11px] text-navy/30">PNG, JPG, WEBP up to 10MB</p>
                    </div>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                ) : (
                  <div className="relative w-full h-36 rounded-[10px] overflow-hidden border border-navy/10 group">
                    <img src={imagePreview} alt="Cover preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-navy/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-navy text-xs font-semibold cursor-pointer hover:bg-offwhite transition-colors">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                        Replace
                        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                      </label>
                      <button type="button" onClick={clearImage} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-semibold hover:bg-red-600 transition-colors">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2" />
                        </svg>
                        Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Right: live card preview */}
            <div className="lg:w-72 shrink-0">
              <p className={labelClass}>Card Preview</p>
              {hasPreview ? (
                <div className="bg-white border border-navy/10 rounded-2xl overflow-hidden flex flex-col shadow-sm">
                  {/* Image */}
                  <div className="relative h-40 w-full bg-navy/5 overflow-hidden">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#112369" strokeWidth="1.5" opacity="0.2">
                          <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                          <polyline points="21 15 16 10 5 21"/>
                        </svg>
                      </div>
                    )}
                    {form.category && (
                      <span className="absolute top-2.5 left-2.5 text-[10px] font-medium uppercase tracking-widest px-2.5 py-1 rounded-full bg-black/50 text-white backdrop-blur-sm">
                        {form.category}
                      </span>
                    )}
                    <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-semibold bg-[#4a8fe2]">
                      01
                    </div>
                  </div>

                  {/* Body */}
                  <div className="flex flex-col flex-1 p-4">
                    <h3 className="font-display text-base font-semibold text-navy mb-1.5 leading-snug">
                      {form.title || <span className="text-navy/25">Project title</span>}
                    </h3>
                    <p className="font-body text-navy/50 text-xs leading-relaxed flex-1">
                      {form.description || <span className="text-navy/25">Your description will appear here...</span>}
                    </p>
                    {previewTags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {previewTags.slice(0, 4).map((t) => (
                          <span key={t} className="text-[10px] font-medium border border-navy/15 text-navy/50 px-2.5 py-0.5 rounded-full">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                    {form.live_url && (
                      <div className="flex items-center gap-1 mt-3 pt-3 border-t border-navy/10 text-[11px] text-navy/40">
                        View project
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="h-64 rounded-2xl border-2 border-dashed border-navy/10 flex flex-col items-center justify-center gap-2 text-center px-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#112369" strokeWidth="1.5" opacity="0.2">
                    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                  <p className="text-[12px] text-navy/25 leading-relaxed">
                    Fill in the form to<br />see a card preview
                  </p>
                </div>
              )}
            </div>

          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="bg-navy hover:bg-blue disabled:opacity-50 text-white text-sm font-semibold px-7 py-2.5 rounded-xl transition-colors w-full sm:w-auto"
            >
              {saving ? "Saving..." : editId ? "Save Changes" : "Upload Project"}
            </button>
            <button
              onClick={() => { setShowForm(false); setEditId(null); setForm(emptyForm); setImageFile(null); setImagePreview(null); }}
              className="border border-navy/15 text-navy/50 text-sm px-5 py-2.5 rounded-xl hover:border-navy/30 transition-colors w-full sm:w-auto"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5">
        {(["All", "Published", "Draft"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-all duration-200 ${
              filter === f ? "bg-navy text-white" : "bg-white text-navy/50 border border-navy/10 hover:border-navy/25"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-navy/[0.07] shadow-sm overflow-hidden">
        <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_120px_100px] px-6 py-3.5 bg-navy/[0.03] border-b border-navy/[0.07]">
          {["Project", "Category", "Date", "Status", "Actions"].map((h) => (
            <span key={h} className="text-[11px] font-semibold text-navy/40 uppercase tracking-wider">{h}</span>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 gap-2 text-navy/40 text-sm">
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
            Loading projects...
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center py-12 text-navy/35 text-sm">No projects found.</p>
        ) : (
          filtered.map((p, i) => (
            <div key={p.id} className={`${i < filtered.length - 1 ? "border-b border-navy/[0.06]" : ""}`}>

              {/* Desktop row */}
              <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_120px_100px] px-6 py-4 items-center hover:bg-navy/[0.02] transition-colors">
                <div>
                  <p className="text-sm font-semibold text-navy">{p.title}</p>
                  <div className="flex gap-1.5 mt-1.5 flex-wrap">
                    {p.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-[11px] px-2 py-0.5 rounded-full bg-blue/[0.08] text-blue font-medium">{tag}</span>
                    ))}
                  </div>
                </div>
                <p className="text-[13px] text-navy/55">{p.category}</p>
                <p className="text-[13px] text-navy/40">
                  {new Date(p.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </p>
                <span className={`inline-flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1 rounded-full w-fit ${
                  p.status === "Published" ? "bg-green-100 text-green-600" : "bg-red-50 text-red-400"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${p.status === "Published" ? "bg-green-500" : "bg-red-400"}`} />
                  {p.status}
                </span>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(p)} className="w-8 h-8 rounded-lg bg-blue/[0.08] hover:bg-blue/[0.18] text-blue flex items-center justify-center transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                  {deleteConfirm === p.id ? (
                    <button onClick={() => handleDelete(p.id)} className="h-8 px-2.5 rounded-lg bg-red-500 text-white text-xs font-semibold">Confirm</button>
                  ) : (
                    <button onClick={() => setDeleteConfirm(p.id)} className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-400 flex items-center justify-center transition-colors">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Mobile card */}
              <div className="md:hidden px-5 py-4 hover:bg-navy/[0.02] transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-navy truncate">{p.title}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <p className="text-[12px] text-navy/50">{p.category}</p>
                      <span className="text-navy/20">·</span>
                      <p className="text-[12px] text-navy/40">
                        {new Date(p.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </p>
                    </div>
                    <div className="flex gap-1.5 mt-2 flex-wrap">
                      {p.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-[11px] px-2 py-0.5 rounded-full bg-blue/[0.08] text-blue font-medium">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2.5 shrink-0">
                    <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                      p.status === "Published" ? "bg-green-100 text-green-600" : "bg-red-50 text-red-400"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${p.status === "Published" ? "bg-green-500" : "bg-red-400"}`} />
                      {p.status}
                    </span>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(p)} className="w-8 h-8 rounded-lg bg-blue/[0.08] hover:bg-blue/[0.18] text-blue flex items-center justify-center transition-colors">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      {deleteConfirm === p.id ? (
                        <button onClick={() => handleDelete(p.id)} className="h-8 px-2.5 rounded-lg bg-red-500 text-white text-xs font-semibold">Confirm</button>
                      ) : (
                        <button onClick={() => setDeleteConfirm(p.id)} className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-400 flex items-center justify-center transition-colors">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2" />
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