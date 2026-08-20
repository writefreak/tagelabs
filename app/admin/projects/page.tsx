"use client";
import { supabase } from "@/app/lib/supabase";
import { useState, useEffect, useRef } from "react";
import {
  Plus,
  X,
  Upload,
  Image as ImageIcon,
  ExternalLink,
  GripVertical,
  Pencil,
  Trash2,
  Loader2,
  CheckCircle2,
  Clock,
  Search,
  ChevronDown,
} from "lucide-react";

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
  order_index: number;
};

const categories = [
  "Landing Page",
  "Web App",
  "Frontend Dev",
  "Design",
  "Portfolio",
  "E-commerce",
];

const emptyForm = {
  title: "",
  category: "",
  description: "",
  tags: "",
  live_url: "",
  image_url: "",
  status: "Draft" as "Published" | "Draft",
};

const inputClass =
  "w-full px-4 py-3 rounded-xl border border-navy/15 bg-offwhite text-sm text-navy font-body outline-none focus:border-blue focus:bg-white transition-all shadow-xs";
const labelClass =
  "block text-xs font-bold text-navy/70 uppercase tracking-wider mb-2";

// Custom Dropdown Component to eliminate native select
function CustomSelect({
  value,
  onChange,
  options,
  placeholder = "Select Option",
}: {
  value: string;
  onChange: (val: string) => void;
  options: string[];
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`${inputClass} flex items-center justify-between text-left cursor-pointer`}
      >
        <span className={value ? "text-navy" : "text-navy/40"}>
          {value || placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-navy/50 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-navy/15 rounded-xl shadow-lg max-h-56 overflow-y-auto py-1">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className={`w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-navy/5 ${
                value === opt ? "font-bold text-blue bg-blue/5" : "text-navy"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Drag state
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [reordering, setReordering] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("order_index", { ascending: true });
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

    const tagArray = form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

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
      const { error } = await supabase
        .from("projects")
        .update(payload)
        .eq("id", editId)
        .select();
      if (error) setError(error.message);
    } else {
      const { error } = await supabase
        .from("projects")
        .insert(payload)
        .select();
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
      title: p.title,
      category: p.category,
      description: p.description,
      tags: p.tags.join(", "),
      live_url: p.live_url,
      image_url: p.image_url,
      status: p.status,
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

  // Drag handlers specifically targeting isolated card
  function handleDragStart(e: React.DragEvent<HTMLDivElement>, index: number) {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDragEnter(index: number) {
    if (dragIndex === null || dragIndex === index) return;
    setDragOverIndex(index);
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>, dropIndex: number) {
    e.preventDefault();
    if (dragIndex === null || dragIndex === dropIndex) return;

    const reordered = [...projects];
    const [moved] = reordered.splice(dragIndex, 1);
    reordered.splice(dropIndex, 0, moved);
    setProjects(reordered);

    saveOrder(reordered);
  }

  function handleDragEnd() {
    setDragIndex(null);
    setDragOverIndex(null);
  }

  async function saveOrder(ordered: Project[]) {
    setReordering(true);
    const updates = ordered.map((p, i) =>
      supabase.from("projects").update({ order_index: i }).eq("id", p.id),
    );
    await Promise.all(updates);
    setReordering(false);
  }

  const filtered = projects.filter((p) => {
    const matchesFilter = filter === "All" || p.status === filter;
    const matchesCategory =
      selectedCategory === "All" || p.category === selectedCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesCategory && matchesSearch;
  });

  const previewTags = form.tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const hasPreview = form.title || form.category || imagePreview;

  return (
    <div className="font-body w-full max-w-6xl mx-auto px-2 md:px-8 py-4 sm:py-8">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between border-b border-navy/10 pb-5">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-navy tracking-tight">
            Projects Dashboard
          </h1>
          <p className="text-navy/60 text-xs sm:text-sm mt-0.5">
            Manage your portfolio showcase items and control display sequence.
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditId(null);
            setForm(emptyForm);
            setImageFile(null);
            setImagePreview(null);
          }}
          className="flex items-center justify-center gap-2 bg-navy hover:bg-blue text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-xs w-full sm:w-auto"
        >
          {showForm && !editId ? (
            <>
              <X className="w-4 h-4" />
              Cancel
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Add Project
            </>
          )}
        </button>
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

      {/* Form Section */}
      {showForm && (
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-navy/10 shadow-lg mb-8 transition-all">
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-navy/10">
            <h2 className="font-display font-bold text-lg text-navy">
              {editId ? "Edit Project Details" : "Add New Project"}
            </h2>
            <button
              onClick={() => {
                setShowForm(false);
                setEditId(null);
              }}
              className="p-1 rounded-lg hover:bg-navy/5 text-navy/50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-4">
              <div>
                <label className={labelClass}>Project Title *</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Heart of Gold Jewels E-commerce"
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Category *</label>
                  <CustomSelect
                    value={form.category}
                    onChange={(val) => setForm({ ...form, category: val })}
                    options={categories}
                    placeholder="Select category"
                  />
                </div>

                <div>
                  <label className={labelClass}>Publishing Status</label>
                  <CustomSelect
                    value={form.status}
                    onChange={(val) =>
                      setForm({
                        ...form,
                        status: val as "Published" | "Draft",
                      })
                    }
                    options={["Draft", "Published"]}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Brief summary of the architecture and delivered business value..."
                  rows={3}
                  className={`${inputClass} resize-y`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Tags (Comma Separated)</label>
                  <input
                    value={form.tags}
                    onChange={(e) => setForm({ ...form, tags: e.target.value })}
                    placeholder="Next.js, TypeScript, Tailwind"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Live Preview URL</label>
                  <input
                    value={form.live_url}
                    onChange={(e) =>
                      setForm({ ...form, live_url: e.target.value })
                    }
                    placeholder="https://example.com"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Cover Image</label>
                {!imagePreview ? (
                  <label className="flex flex-col items-center justify-center w-full h-36 rounded-xl border-2 border-dashed border-navy/20 bg-offwhite hover:border-blue hover:bg-blue/5 transition-all cursor-pointer group">
                    <div className="flex flex-col items-center gap-1.5 text-center">
                      <Upload className="w-5 h-5 text-navy/50 group-hover:text-blue" />
                      <p className="text-xs font-semibold text-navy/70 group-hover:text-blue">
                        Upload thumbnail
                      </p>
                      <p className="text-[10px] text-navy/40">
                        PNG, JPG, or WEBP
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="relative w-full h-36 rounded-xl overflow-hidden border border-navy/15 group">
                    <img
                      src={imagePreview}
                      alt="Cover preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-navy/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <label className="px-3 py-1.5 rounded-lg bg-white text-navy text-xs font-bold cursor-pointer hover:bg-offwhite transition-colors">
                        Replace
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={clearImage}
                        className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Preview Section */}
            <div className="lg:col-span-5 flex flex-col">
              <label className={labelClass}>Live Display Preview</label>
              <div className="flex-1 bg-offwhite/50 border border-navy/10 rounded-xl p-3 flex flex-col justify-center">
                {hasPreview ? (
                  <div className="bg-white border border-navy/10 rounded-xl overflow-hidden shadow-xs flex flex-col">
                    <div className="relative h-36 w-full bg-navy/5 overflow-hidden">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-navy/30">
                          <ImageIcon className="w-8 h-8" />
                        </div>
                      )}
                      {form.category && (
                        <span className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-navy text-white">
                          {form.category}
                        </span>
                      )}
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="font-display text-sm font-bold text-navy mb-1">
                        {form.title || "Project Title"}
                      </h3>
                      <p className="text-navy/60 text-xs line-clamp-2 mb-3">
                        {form.description || "Description preview..."}
                      </p>
                      {previewTags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {previewTags.map((t) => (
                            <span
                              key={t}
                              className="text-[10px] bg-navy/5 text-navy/70 px-2 py-0.5 rounded-md"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="py-8 px-4 text-center text-navy/40 text-xs">
                    Fill out fields to view live card preview.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-navy/10">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditId(null);
                setForm(emptyForm);
                setImageFile(null);
                setImagePreview(null);
              }}
              className="px-4 py-2 rounded-xl border border-navy/20 text-navy/70 text-xs font-semibold hover:bg-navy/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving}
              className="flex items-center justify-center gap-2 bg-navy hover:bg-blue disabled:opacity-50 text-white text-xs font-semibold px-6 py-2 rounded-xl transition-colors shadow-xs"
            >
              {saving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Saving...
                </>
              ) : editId ? (
                "Save Changes"
              ) : (
                "Upload Project"
              )}
            </button>
          </div>
        </div>
      )}

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6 bg-white p-2.5 rounded-2xl border border-navy/10 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-navy/40" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects or tags..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-offwhite border border-navy/10 text-xs text-navy outline-none focus:border-blue"
          />
        </div>

        <div className="w-full sm:w-48">
          <CustomSelect
            value={selectedCategory === "All" ? "" : selectedCategory}
            onChange={(val) => setSelectedCategory(val)}
            options={["All", ...categories]}
            placeholder="All Categories"
          />
        </div>

        <div className="flex items-center bg-offwhite p-1 rounded-xl border border-navy/10 shrink-0">
          {(["All", "Published", "Draft"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                filter === f
                  ? "bg-white text-navy shadow-xs"
                  : "text-navy/50 hover:text-navy"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {reordering && (
        <span className="flex items-center gap-2 text-xs font-medium text-navy/60 bg-navy/5 px-3 py-1 rounded-lg border border-navy/10 mb-4 w-fit">
          <Loader2 className="w-3 h-3 animate-spin text-blue" />
          Updating order...
        </span>
      )}

      {/* Sleek, Streamlined Cards Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-16 gap-3 text-navy/50 text-xs bg-white rounded-2xl border border-navy/10">
          <Loader2 className="w-4 h-4 animate-spin text-blue" />
          Loading projects...
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-navy/10 text-navy/40 text-xs">
          No matching projects found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p, i) => (
            <div
              key={p.id}
              draggable
              onDragStart={(e) => handleDragStart(e, i)}
              onDragEnter={() => handleDragEnter(i)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, i)}
              onDragEnd={handleDragEnd}
              className={`group bg-white rounded-2xl border border-navy/10 overflow-hidden shadow-xs hover:border-navy/30 transition-all flex flex-col justify-between ${
                dragIndex === i
                  ? "opacity-40 scale-95 border-dashed border-blue"
                  : dragOverIndex === i
                    ? "border-2 border-blue bg-blue/5"
                    : ""
              }`}
            >
              <div>
                {/* Header Image & Drag Handle */}
                <div className="relative h-36 w-full bg-navy/5 border-b border-navy/10 overflow-hidden">
                  {p.image_url ? (
                    <img
                      src={p.image_url}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-navy/20">
                      <ImageIcon className="w-7 h-7" />
                    </div>
                  )}

                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-navy/90 text-white backdrop-blur-xs">
                      {p.category}
                    </span>
                    <div className="pointer-events-auto p-1 rounded-md bg-white/90 backdrop-blur-xs text-navy/50 cursor-grab active:cursor-grabbing hover:text-navy shadow-xs">
                      <GripVertical className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-3.5 space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-display font-bold text-sm text-navy truncate">
                      {p.title}
                    </h3>
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-md shrink-0 ${
                        p.status === "Published"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {p.status === "Published" ? (
                        <CheckCircle2 className="w-2.5 h-2.5" />
                      ) : (
                        <Clock className="w-2.5 h-2.5" />
                      )}
                      {p.status}
                    </span>
                  </div>

                  <p className="text-xs text-navy/60 line-clamp-2 leading-snug">
                    {p.description || "No description provided."}
                  </p>

                  {p.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {p.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] bg-navy/5 text-navy/70 px-2 py-0.5 rounded-md font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Minimal Card Footer */}
              <div className="px-3.5 py-2.5 bg-offwhite/40 border-t border-navy/10 flex items-center justify-between">
                <div>
                  {p.live_url ? (
                    <a
                      href={p.live_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-blue hover:underline"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Visit Site
                    </a>
                  ) : (
                    <span className="text-[10px] text-navy/40">No link</span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleEdit(p)}
                    className="p-1 rounded-md text-navy/60 hover:text-blue hover:bg-blue/10 transition-colors"
                    title="Edit Project"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>

                  {deleteConfirm === p.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="px-1.5 py-0.5 rounded-md bg-red-600 text-white text-[10px] font-bold"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="p-0.5 text-navy/40 hover:text-navy"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(p.id)}
                      className="p-1 rounded-md text-navy/60 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete Project"
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
