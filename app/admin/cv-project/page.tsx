"use client";
import { supabase } from "@/app/lib/supabase";
import { useState, useEffect, useRef } from "react";

// ── Types ─────────────────────────────────────────────────────────────────

type ExperienceEntry = {
  company: string;
  role: string;
  start_date: string;
  end_date: string;
  current: boolean;
  description: string;
};

type EducationEntry = {
  institution: string;
  degree: string;
  field: string;
  start_date: string;
  end_date: string;
};

type CV = {
  id: string;
  full_name: string;
  job_title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  summary: string;
  experience: ExperienceEntry[];
  education: EducationEntry[];
  skills: string[];
  status: "Published" | "Draft";
  created_at: string;
  order_index: number;
  cv_url?: string | null;
};

// ── Helpers ────────────────────────────────────────────────────────────────

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

const emptyExp = (): ExperienceEntry => ({
  company: "",
  role: "",
  start_date: "",
  end_date: "",
  current: false,
  description: "",
});
const emptyEdu = (): EducationEntry => ({
  institution: "",
  degree: "",
  field: "",
  start_date: "",
  end_date: "",
});
const emptyForm = () => ({
  full_name: "",
  job_title: "",
  email: "",
  phone: "",
  location: "",
  website: "",
  summary: "",
  experience: [] as ExperienceEntry[],
  education: [] as EducationEntry[],
  skills: "",
  status: "Draft" as "Published" | "Draft",
  cv_url: "" as string,
});

// Mobile steps config
const MOBILE_STEPS = [
  { id: 0, label: "Personal" },
  { id: 1, label: "Experience" },
  { id: 2, label: "Education" },
  { id: 3, label: "Skills & File" },
  { id: 4, label: "Preview" },
];

// ── CV Viewer Dialog ───────────────────────────────────────────────────────

function CVDialog({
  cv,
  onClose,
  onEdit,
}: {
  cv: CV;
  onClose: () => void;
  onEdit: () => void;
}) {
  const initials =
    cv.full_name
      .split(" ")
      .map((w) => w[0] ?? "")
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?";

  function handleBackdrop(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose();
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      onClick={handleBackdrop}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-navy/40 backdrop-blur-sm px-0 sm:px-4"
    >
      <div className="relative bg-white w-full sm:max-w-xl max-h-[92dvh] sm:max-h-[88vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col">
        {/* Drag pill (mobile) */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-navy/15" />
        </div>

        {/* Header */}
        <div className="flex items-start gap-4 px-6 pt-5 pb-5 border-b border-navy/[0.07] sticky top-0 bg-white z-10 rounded-t-3xl sm:rounded-t-2xl">
          <div className="w-12 h-12 rounded-full bg-blue/[0.1] flex items-center justify-center text-base font-bold text-blue shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-bold text-navy leading-tight">
              {cv.full_name}
            </p>
            <p className="text-[13px] text-navy/50 mt-0.5">
              {cv.job_title || "—"}
            </p>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span
                className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                  cv.status === "Published"
                    ? "bg-green-100 text-green-600"
                    : "bg-red-50 text-red-400"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${cv.status === "Published" ? "bg-green-500" : "bg-red-400"}`}
                />
                {cv.status}
              </span>
              <span className="text-[12px] text-navy/30">
                {new Date(cv.created_at).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            {cv.cv_url && (
              <a
                href={cv.cv_url}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="w-8 h-8 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-600 flex items-center justify-center transition-colors"
                title="Download PDF"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </a>
            )}
            <button
              onClick={onEdit}
              className="w-8 h-8 rounded-lg bg-blue/[0.08] hover:bg-blue/[0.18] text-blue flex items-center justify-center transition-colors"
              title="Edit CV"
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
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-navy/[0.06] hover:bg-navy/[0.12] text-navy/50 flex items-center justify-center transition-colors"
              title="Close"
            >
              <svg
                width="14"
                height="14"
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

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-6 pb-8">
          {cv.cv_url && (
            <div className="flex items-center justify-between p-3.5 bg-navy/[0.03] border border-navy/10 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center shrink-0">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold text-navy">
                    Attached PDF Document
                  </p>
                  <p className="text-[11px] text-navy/40">
                    Ready to view or download
                  </p>
                </div>
              </div>
              <a
                href={cv.cv_url}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="px-3 py-1.5 rounded-lg bg-navy text-white text-xs font-semibold hover:bg-blue transition-colors flex items-center gap-1.5"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download
              </a>
            </div>
          )}

          {/* Contact Info */}
          {(cv.email || cv.phone || cv.location || cv.website) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {cv.email && (
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-navy/[0.05] flex items-center justify-center shrink-0">
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#112369"
                      strokeWidth="2"
                      opacity="0.45"
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                  <span className="text-[12px] text-navy/55 truncate">
                    {cv.email}
                  </span>
                </div>
              )}
              {cv.phone && (
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-navy/[0.05] flex items-center justify-center shrink-0">
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#112369"
                      strokeWidth="2"
                      opacity="0.45"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.77 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>
                  <span className="text-[12px] text-navy/55">{cv.phone}</span>
                </div>
              )}
              {cv.location && (
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-navy/[0.05] flex items-center justify-center shrink-0">
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#112369"
                      strokeWidth="2"
                      opacity="0.45"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <span className="text-[12px] text-navy/55">
                    {cv.location}
                  </span>
                </div>
              )}
              {cv.website && (
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-navy/[0.05] flex items-center justify-center shrink-0">
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#112369"
                      strokeWidth="2"
                      opacity="0.45"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="2" y1="12" x2="22" y2="12" />
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                  </div>
                  <a
                    href={
                      cv.website.startsWith("http")
                        ? cv.website
                        : `https://${cv.website}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[12px] text-blue/70 hover:text-blue transition-colors truncate"
                  >
                    {cv.website}
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Summary */}
          {cv.summary && (
            <div>
              <p className="text-[10px] font-bold text-navy/35 uppercase tracking-widest mb-2">
                Summary
              </p>
              <p className="text-[13px] text-navy/60 leading-relaxed">
                {cv.summary}
              </p>
            </div>
          )}

          {/* Experience */}
          {cv.experience?.length > 0 && (
            <div>
              <p className="text-[10px] font-bold text-navy/35 uppercase tracking-widest mb-3 pb-2 border-b border-navy/[0.07]">
                Experience
              </p>
              <div className="flex flex-col gap-4">
                {cv.experience.map((exp, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center pt-1">
                      <div className="w-2 h-2 rounded-full bg-blue/40 shrink-0" />
                      {i < cv.experience.length - 1 && (
                        <div className="w-px flex-1 bg-navy/[0.07] mt-1.5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 pb-1">
                      <div className="flex items-baseline justify-between gap-2 flex-wrap">
                        <p className="text-[13px] font-semibold text-navy">
                          {exp.role}{" "}
                          <span className="font-normal text-navy/45">
                            @ {exp.company}
                          </span>
                        </p>
                        <span className="text-[11px] text-navy/35 shrink-0">
                          {exp.start_date}
                          {exp.current
                            ? " – Present"
                            : exp.end_date
                              ? ` – ${exp.end_date}`
                              : ""}
                        </span>
                      </div>
                      {exp.description && (
                        <p className="text-[12px] text-navy/50 leading-relaxed mt-1">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {cv.education?.length > 0 && (
            <div>
              <p className="text-[10px] font-bold text-navy/35 uppercase tracking-widest mb-3 pb-2 border-b border-navy/[0.07]">
                Education
              </p>
              <div className="flex flex-col gap-3">
                {cv.education.map((edu, i) => (
                  <div
                    key={i}
                    className="flex items-start justify-between gap-3"
                  >
                    <div className="flex gap-3 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-navy/[0.05] flex items-center justify-center shrink-0 mt-0.5">
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#112369"
                          strokeWidth="2"
                          opacity="0.4"
                        >
                          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                          <path d="M6 12v5c3 3 9 3 12 0v-5" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13px] font-semibold text-navy truncate">
                          {edu.institution}
                        </p>
                        <p className="text-[12px] text-navy/50">
                          {[edu.degree, edu.field].filter(Boolean).join(" · ")}
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] text-navy/35 shrink-0 mt-0.5">
                      {edu.start_date}
                      {edu.end_date ? ` – ${edu.end_date}` : ""}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {cv.skills?.length > 0 && (
            <div>
              <p className="text-[10px] font-bold text-navy/35 uppercase tracking-widest mb-3 pb-2 border-b border-navy/[0.07]">
                Skills
              </p>
              <div className="flex flex-wrap gap-1.5">
                {cv.skills.map((s) => (
                  <span
                    key={s}
                    className="text-[12px] font-medium border border-navy/15 text-navy/55 px-3 py-1 rounded-full bg-navy/[0.02]"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────

export default function CVsPage() {
  const [cvs, setCvs] = useState<CV[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<"list" | "form">("list");
  const [form, setForm] = useState(emptyForm());
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [filter, setFilter] = useState<"All" | "Published" | "Draft">("All");
  const [mobileStep, setMobileStep] = useState(0);
  const [viewCV, setViewCV] = useState<CV | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    fetchCVs();
  }, []);

  // ── Data ──────────────────────────────────────────────────────────────────

  async function fetchCVs() {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("cvs")
      .select("*")
      .order("order_index", { ascending: true });
    if (error) setError(error.message);
    else setCvs(data ?? []);
    setLoading(false);
  }

  async function handleFileUpload(file: File) {
    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `documents/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("cvs")
        .upload(filePath, file, { cacheControl: "3600", upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("cvs").getPublicUrl(filePath);

      setForm((prev) => ({ ...prev, cv_url: data.publicUrl }));
    } catch (err: any) {
      setError(err.message || "Failed to upload file");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit() {
    if (!form.full_name) return;
    setSaving(true);
    setError(null);

    const skillArray = form.skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const payload = {
      full_name: form.full_name,
      job_title: form.job_title,
      email: form.email,
      phone: form.phone,
      location: form.location,
      website: form.website,
      summary: form.summary,
      experience: form.experience,
      education: form.education,
      skills: skillArray,
      status: form.status,
      cv_url: form.cv_url || null,
    };

    if (editId) {
      const { error } = await supabase
        .from("cvs")
        .update(payload)
        .eq("id", editId)
        .select();
      if (error) {
        setError(error.message);
        setSaving(false);
        return;
      }
    } else {
      const { error } = await supabase.from("cvs").insert(payload).select();
      if (error) {
        setError(error.message);
        setSaving(false);
        return;
      }
    }

    setSaving(false);
    setForm(emptyForm());
    setEditId(null);
    setMobileStep(0);
    setView("list");
    fetchCVs();
  }

  function handleEdit(cv: CV) {
    setViewCV(null);
    setForm({
      full_name: cv.full_name,
      job_title: cv.job_title ?? "",
      email: cv.email ?? "",
      phone: cv.phone ?? "",
      location: cv.location ?? "",
      website: cv.website ?? "",
      summary: cv.summary ?? "",
      experience: cv.experience ?? [],
      education: cv.education ?? [],
      skills: (cv.skills ?? []).join(", "),
      status: cv.status,
      cv_url: cv.cv_url ?? "",
    });
    setEditId(cv.id);
    setMobileStep(0);
    setView("form");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id: string) {
    const { error } = await supabase.from("cvs").delete().eq("id", id);
    if (error) setError(error.message);
    else setCvs((prev) => prev.filter((c) => c.id !== id));
    setDeleteConfirm(null);
  }

  function openCreate() {
    setForm(emptyForm());
    setEditId(null);
    setMobileStep(0);
    setView("form");
  }

  // ── Experience helpers ────────────────────────────────────────────────────

  function addExp() {
    setForm((f) => ({ ...f, experience: [...f.experience, emptyExp()] }));
  }
  function removeExp(i: number) {
    setForm((f) => ({
      ...f,
      experience: f.experience.filter((_, idx) => idx !== i),
    }));
  }
  function updateExp(
    i: number,
    field: keyof ExperienceEntry,
    value: string | boolean,
  ) {
    setForm((f) => {
      const updated = f.experience.map((e, idx) =>
        idx === i ? { ...e, [field]: value } : e,
      );
      return { ...f, experience: updated };
    });
  }

  // ── Education helpers ─────────────────────────────────────────────────────

  function addEdu() {
    setForm((f) => ({ ...f, education: [...f.education, emptyEdu()] }));
  }
  function removeEdu(i: number) {
    setForm((f) => ({
      ...f,
      education: f.education.filter((_, idx) => idx !== i),
    }));
  }
  function updateEdu(i: number, field: keyof EducationEntry, value: string) {
    setForm((f) => {
      const updated = f.education.map((e, idx) =>
        idx === i ? { ...e, [field]: value } : e,
      );
      return { ...f, education: updated };
    });
  }

  // ── Derived ───────────────────────────────────────────────────────────────

  const previewSkills = form.skills
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const initials =
    form.full_name
      .split(" ")
      .map((w) => w[0] ?? "")
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?";
  const filtered = cvs.filter((c) => filter === "All" || c.status === filter);
  const hasPreviewContent =
    form.full_name ||
    form.job_title ||
    form.summary ||
    form.experience.length > 0 ||
    form.education.length > 0 ||
    previewSkills.length > 0 ||
    form.cv_url;

  // ── Render Form Fields Partial ───────────────────────────────────────────

  const renderPersonalFields = () => (
    <div className="flex flex-col gap-4">
      <div>
        <label className={labelClass}>Full Name *</label>
        <input
          value={form.full_name}
          onChange={(e) => setForm({ ...form, full_name: e.target.value })}
          placeholder="e.g. Adaeze Nwosu"
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass}>Job Title</label>
        <input
          value={form.job_title}
          onChange={(e) => setForm({ ...form, job_title: e.target.value })}
          placeholder="e.g. Product Designer"
          className={inputClass}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Email</label>
          <input
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="hello@example.com"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Phone</label>
          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="+234 800 000 0000"
            className={inputClass}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Location</label>
          <input
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            placeholder="Lagos, Nigeria"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Website / Portfolio</label>
          <input
            value={form.website}
            onChange={(e) => setForm({ ...form, website: e.target.value })}
            placeholder="https://myportfolio.com"
            className={inputClass}
          />
        </div>
      </div>
      <div>
        <label className={labelClass}>Professional Summary</label>
        <textarea
          rows={3}
          value={form.summary}
          onChange={(e) => setForm({ ...form, summary: e.target.value })}
          placeholder="Brief summary of experience and focus..."
          className={`${inputClass} resize-none`}
        />
      </div>
    </div>
  );

  const renderExperienceFields = () => (
    <div className="flex flex-col gap-5">
      {form.experience.map((exp, i) => (
        <div
          key={i}
          className="p-4 bg-navy/[0.02] border border-navy/10 rounded-xl flex flex-col gap-3 relative group"
        >
          <button
            type="button"
            onClick={() => removeExp(i)}
            className="absolute top-3 right-3 text-red-400 hover:text-red-600 text-xs font-semibold p-1"
          >
            Remove
          </button>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-12">
            <div>
              <label className={labelClass}>Company</label>
              <input
                value={exp.company}
                onChange={(e) => updateExp(i, "company", e.target.value)}
                placeholder="Google"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Role</label>
              <input
                value={exp.role}
                onChange={(e) => updateExp(i, "role", e.target.value)}
                placeholder="Senior Frontend Engineer"
                className={inputClass}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Start Date</label>
              <input
                value={exp.start_date}
                onChange={(e) => updateExp(i, "start_date", e.target.value)}
                placeholder="Jan 2022"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>End Date</label>
              <input
                value={exp.end_date}
                disabled={exp.current}
                onChange={(e) => updateExp(i, "end_date", e.target.value)}
                placeholder={exp.current ? "Present" : "Dec 2023"}
                className={`${inputClass} ${exp.current ? "opacity-50" : ""}`}
              />
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer w-fit text-xs text-navy font-medium">
            <input
              type="checkbox"
              checked={exp.current}
              onChange={(e) => updateExp(i, "current", e.target.checked)}
              className="rounded text-navy focus:ring-0"
            />
            I currently work here
          </label>
          <div>
            <label className={labelClass}>Description</label>
            <textarea
              rows={2}
              value={exp.description}
              onChange={(e) => updateExp(i, "description", e.target.value)}
              placeholder="Key responsibilities and achievements..."
              className={`${inputClass} resize-none`}
            />
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={addExp}
        className="w-full py-2.5 border border-dashed border-navy/20 hover:border-navy/40 rounded-xl text-xs font-semibold text-navy/60 hover:text-navy transition-colors flex items-center justify-center gap-1.5"
      >
        + Add Experience
      </button>
    </div>
  );

  const renderEducationFields = () => (
    <div className="flex flex-col gap-5">
      {form.education.map((edu, i) => (
        <div
          key={i}
          className="p-4 bg-navy/[0.02] border border-navy/10 rounded-xl flex flex-col gap-3 relative"
        >
          <button
            type="button"
            onClick={() => removeEdu(i)}
            className="absolute top-3 right-3 text-red-400 hover:text-red-600 text-xs font-semibold p-1"
          >
            Remove
          </button>
          <div>
            <label className={labelClass}>Institution</label>
            <input
              value={edu.institution}
              onChange={(e) => updateEdu(i, "institution", e.target.value)}
              placeholder="University of Lagos"
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Degree</label>
              <input
                value={edu.degree}
                onChange={(e) => updateEdu(i, "degree", e.target.value)}
                placeholder="B.Sc."
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Field of Study</label>
              <input
                value={edu.field}
                onChange={(e) => updateEdu(i, "field", e.target.value)}
                placeholder="Computer Science"
                className={inputClass}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Start Date</label>
              <input
                value={edu.start_date}
                onChange={(e) => updateEdu(i, "start_date", e.target.value)}
                placeholder="2018"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>End Date</label>
              <input
                value={edu.end_date}
                onChange={(e) => updateEdu(i, "end_date", e.target.value)}
                placeholder="2022"
                className={inputClass}
              />
            </div>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={addEdu}
        className="w-full py-2.5 border border-dashed border-navy/20 hover:border-navy/40 rounded-xl text-xs font-semibold text-navy/60 hover:text-navy transition-colors flex items-center justify-center gap-1.5"
      >
        + Add Education
      </button>
    </div>
  );

  const renderSkillsAndFileFields = () => (
    <div className="flex flex-col gap-6">
      <div>
        <label className={labelClass}>Skills (comma-separated)</label>
        <input
          value={form.skills}
          onChange={(e) => setForm({ ...form, skills: e.target.value })}
          placeholder="React, TypeScript, UI Design, Figma, Node.js"
          className={inputClass}
        />
        <p className="text-[11px] text-navy/40 mt-1">
          Separate multiple skills with commas
        </p>
      </div>

      <div>
        <label className={labelClass}>Status</label>
        <div className="flex gap-2">
          {(["Draft", "Published"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setForm({ ...form, status: s })}
              className={pillClass(form.status === s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* PDF Upload */}
      <div>
        <label className={labelClass}>PDF Document</label>
        <input
          type="file"
          ref={fileInputRef}
          accept="application/pdf"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFileUpload(f);
          }}
          className="hidden"
        />

        {form.cv_url ? (
          <div className="p-3.5 bg-navy/[0.03] border border-navy/10 rounded-xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center shrink-0">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-navy truncate">
                  PDF Uploaded
                </p>
                <a
                  href={form.cv_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-blue/70 hover:underline truncate block"
                >
                  View PDF
                </a>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setForm({ ...form, cv_url: "" })}
              className="text-xs text-red-400 hover:text-red-600 font-semibold shrink-0"
            >
              Remove
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full py-6 border border-dashed border-navy/20 hover:border-navy/40 rounded-xl text-xs font-semibold text-navy/60 hover:text-navy transition-colors flex flex-col items-center gap-2 bg-navy/[0.01]"
          >
            {uploading ? (
              <span className="text-blue">Uploading PDF...</span>
            ) : (
              <>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <span>Click to upload PDF CV</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );

  const renderLivePreviewCard = () => (
    <div className="bg-white border border-navy/10 rounded-2xl p-5 sm:p-6 flex flex-col gap-6 shadow-sm">
      <div className="flex items-start gap-4 pb-4 border-b border-navy/[0.07]">
        <div className="w-12 h-12 rounded-full bg-blue/[0.1] flex items-center justify-center text-base font-bold text-blue shrink-0">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-base font-bold text-navy truncate">
            {form.full_name || "Your Name"}
          </p>
          <p className="text-[13px] text-navy/50">
            {form.job_title || "Job Title"}
          </p>
          {(form.email || form.phone || form.location || form.website) && (
            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-[11px] text-navy/40">
              {form.email && <span>{form.email}</span>}
              {form.phone && <span>{form.phone}</span>}
              {form.location && <span>{form.location}</span>}
              {form.website && (
                <span className="text-blue/70">{form.website}</span>
              )}
            </div>
          )}
        </div>
      </div>

      {form.summary && (
        <div>
          <p className="text-[10px] font-bold text-navy/35 uppercase tracking-widest mb-1.5">
            Summary
          </p>
          <p className="text-xs text-navy/60 leading-relaxed font-body">
            {form.summary}
          </p>
        </div>
      )}

      {form.experience.length > 0 && (
        <div>
          <p className="text-[10px] font-bold text-navy/35 uppercase tracking-widest mb-2.5 pb-1 border-b border-navy/[0.07]">
            Experience
          </p>
          <div className="flex flex-col gap-3">
            {form.experience.map((exp, i) => (
              <div key={i} className="text-xs">
                <div className="flex justify-between items-baseline gap-2">
                  <p className="font-semibold text-navy">
                    {exp.role || "Role"}{" "}
                    <span className="font-normal text-navy/45">
                      @ {exp.company || "Company"}
                    </span>
                  </p>
                  <span className="text-[11px] text-navy/35">
                    {exp.start_date}
                    {exp.current
                      ? " – Present"
                      : exp.end_date
                        ? ` – ${exp.end_date}`
                        : ""}
                  </span>
                </div>
                {exp.description && (
                  <p className="text-navy/50 text-[11px] mt-1 leading-relaxed">
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {form.education.length > 0 && (
        <div>
          <p className="text-[10px] font-bold text-navy/35 uppercase tracking-widest mb-2.5 pb-1 border-b border-navy/[0.07]">
            Education
          </p>
          <div className="flex flex-col gap-2">
            {form.education.map((edu, i) => (
              <div key={i} className="flex justify-between items-start text-xs">
                <div>
                  <p className="font-semibold text-navy">
                    {edu.institution || "Institution"}
                  </p>
                  <p className="text-navy/50 text-[11px]">
                    {[edu.degree, edu.field].filter(Boolean).join(" · ")}
                  </p>
                </div>
                <span className="text-[11px] text-navy/35">
                  {edu.start_date}
                  {edu.end_date ? ` – ${edu.end_date}` : ""}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {previewSkills.length > 0 && (
        <div>
          <p className="text-[10px] font-bold text-navy/35 uppercase tracking-widest mb-2 pb-1 border-b border-navy/[0.07]">
            Skills
          </p>
          <div className="flex flex-wrap gap-1">
            {previewSkills.map((s) => (
              <span
                key={s}
                className="text-[11px] border border-navy/15 text-navy/60 px-2.5 py-0.5 rounded-full bg-navy/[0.02]"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {form.cv_url && (
        <div className="flex items-center gap-2 text-xs text-navy/60 pt-2 border-t border-navy/[0.07]">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-red-500"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          <span className="truncate">PDF Document Attached</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen  text-navy font-body md:p-4">
      {/* Dialog */}
      {viewCV && (
        <CVDialog
          cv={viewCV}
          onClose={() => setViewCV(null)}
          onEdit={() => handleEdit(viewCV)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl flex flex-col gap-4">
            <h3 className="text-base font-bold text-navy">Delete CV?</h3>
            <p className="text-xs text-navy/60">
              Are you sure you want to delete this CV entry? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 rounded-xl border border-navy/15 text-xs font-semibold text-navy/70 hover:bg-navy/5"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2 rounded-xl bg-red-500 text-white text-xs font-semibold hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto flex flex-col gap-6 sm:gap-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-navy">
              CVs & Resumes
            </h1>
            <p className="text-xs sm:text-sm text-navy/50 mt-1">
              Manage, publish, and curate CV profiles.
            </p>
          </div>

          {view === "list" ? (
            <button
              onClick={openCreate}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-navy text-white text-xs sm:text-sm font-semibold hover:bg-blue transition-colors flex items-center justify-center gap-2"
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
              Create New CV
            </button>
          ) : (
            <button
              onClick={() => {
                setView("list");
                setEditId(null);
                setForm(emptyForm());
              }}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-navy/15 text-xs sm:text-sm font-semibold text-navy/70 hover:bg-navy/5 transition-colors flex items-center justify-center gap-2"
            >
              ← Back to List
            </button>
          )}
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="font-bold underline ml-2"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* ── LIST VIEW ─────────────────────────────────────────────────── */}
        {view === "list" && (
          <div className="flex flex-col gap-6">
            {/* Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {(["All", "Published", "Draft"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={pillClass(filter === f)}
                >
                  {f}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="py-20 text-center text-xs text-navy/40">
                Loading CVs...
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-20 text-center bg-white border border-navy/10 rounded-2xl flex flex-col items-center justify-center gap-3">
                <p className="text-sm font-semibold text-navy/60">
                  No CVs found
                </p>
                <p className="text-xs text-navy/40">
                  Create your first CV or adjust the current filter.
                </p>
                <button
                  onClick={openCreate}
                  className="mt-2 px-4 py-2 bg-navy text-white text-xs font-semibold rounded-xl hover:bg-blue transition-colors"
                >
                  + Create CV
                </button>
              </div>
            ) : (
              <>
                {/* Desktop Table View */}
                <div className="hidden md:block bg-white border border-navy/10 rounded-2xl overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-navy/[0.08] bg-navy/[0.02]">
                        <th className="py-3.5 px-5 text-[11px] font-semibold text-navy/50 uppercase tracking-wider">
                          Name & Title
                        </th>
                        <th className="py-3.5 px-5 text-[11px] font-semibold text-navy/50 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="py-3.5 px-5 text-[11px] font-semibold text-navy/50 uppercase tracking-wider">
                          PDF File
                        </th>
                        <th className="py-3.5 px-5 text-[11px] font-semibold text-navy/50 uppercase tracking-wider">
                          Created
                        </th>
                        <th className="py-3.5 px-5 text-[11px] font-semibold text-navy/50 uppercase tracking-wider text-right">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-navy/[0.06]">
                      {filtered.map((cv) => (
                        <tr
                          key={cv.id}
                          className="hover:bg-navy/[0.01] transition-colors"
                        >
                          <td className="py-4 px-5">
                            <div>
                              <p className="text-sm font-bold text-navy">
                                {cv.full_name}
                              </p>
                              <p className="text-xs text-navy/50 mt-0.5">
                                {cv.job_title || "—"}
                              </p>
                            </div>
                          </td>
                          <td className="py-4 px-5">
                            <span
                              className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                                cv.status === "Published"
                                  ? "bg-green-100 text-green-600"
                                  : "bg-red-50 text-red-400"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  cv.status === "Published"
                                    ? "bg-green-500"
                                    : "bg-red-400"
                                }`}
                              />
                              {cv.status}
                            </span>
                          </td>
                          <td className="py-4 px-5">
                            {cv.cv_url ? (
                              <a
                                href={cv.cv_url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs text-blue hover:underline font-medium"
                              >
                                <svg
                                  width="14"
                                  height="14"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                >
                                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                  <polyline points="14 2 14 8 20 8" />
                                </svg>
                                View PDF
                              </a>
                            ) : (
                              <span className="text-xs text-navy/30">None</span>
                            )}
                          </td>
                          <td className="py-4 px-5 text-xs text-navy/50">
                            {new Date(cv.created_at).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </td>
                          <td className="py-4 px-5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setViewCV(cv)}
                                className="p-2 text-navy/60 hover:text-navy hover:bg-navy/5 rounded-lg transition-colors"
                                title="View Details"
                              >
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                >
                                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                  <circle cx="12" cy="12" r="3" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleEdit(cv)}
                                className="p-2 text-blue hover:bg-blue/10 rounded-lg transition-colors"
                                title="Edit"
                              >
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                >
                                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(cv.id)}
                                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete"
                              >
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                >
                                  <polyline points="3 6 5 6 21 6" />
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Responsive Cards View */}
                <div className="grid grid-cols-1 gap-4 md:hidden">
                  {filtered.map((cv) => {
                    const cardInitials =
                      cv.full_name
                        .split(" ")
                        .map((w) => w[0] ?? "")
                        .join("")
                        .slice(0, 2)
                        .toUpperCase() || "?";

                    return (
                      <div
                        key={cv.id}
                        className="bg-white border border-navy/10 rounded-2xl p-4 flex flex-col gap-4 shadow-sm"
                      >
                        {/* Top info */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-full bg-blue/[0.1] flex items-center justify-center text-xs font-bold text-blue shrink-0 mt-0.5">
                              {cardInitials}
                            </div>
                            <div className="min-w-0">
                              <h3 className="text-sm font-bold text-navy truncate">
                                {cv.full_name}
                              </h3>
                              <p className="text-xs text-navy/50 truncate mt-0.5">
                                {cv.job_title || "—"}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`shrink-0 inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              cv.status === "Published"
                                ? "bg-green-100 text-green-600"
                                : "bg-red-50 text-red-400"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                cv.status === "Published"
                                  ? "bg-green-500"
                                  : "bg-red-400"
                              }`}
                            />
                            {cv.status}
                          </span>
                        </div>

                        {/* Mid Meta */}
                        <div className="flex items-center justify-between text-xs pt-2 border-t border-navy/[0.06]">
                          <span className="text-navy/40 text-[11px]">
                            {new Date(cv.created_at).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </span>

                          {cv.cv_url ? (
                            <a
                              href={cv.cv_url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] font-medium text-blue hover:underline"
                            >
                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                              </svg>
                              PDF Attachment
                            </a>
                          ) : (
                            <span className="text-[11px] text-navy/30">
                              No PDF
                            </span>
                          )}
                        </div>

                        {/* Bottom Actions */}
                        <div className="grid grid-cols-3 gap-2 pt-1 border-t border-navy/[0.06]">
                          <button
                            onClick={() => setViewCV(cv)}
                            className="py-2 rounded-xl bg-navy/[0.03] hover:bg-navy/[0.08] text-navy/70 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                            View
                          </button>

                          <button
                            onClick={() => handleEdit(cv)}
                            className="py-2 rounded-xl bg-blue/10 hover:bg-blue/20 text-blue text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
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
                            Edit
                          </button>

                          <button
                            onClick={() => setDeleteConfirm(cv.id)}
                            className="py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
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
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {/* ── FORM VIEW ─────────────────────────────────────────────────── */}
        {view === "form" && (
          <div className="flex flex-col gap-6">
            {/* Mobile Wizard Stepper Header */}
            <div className="lg:hidden bg-white border border-navy/10 rounded-2xl p-3 shadow-sm">
              <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1">
                {MOBILE_STEPS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setMobileStep(s.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                      mobileStep === s.id
                        ? "bg-navy text-white"
                        : "text-navy/50 hover:text-navy hover:bg-navy/5"
                    }`}
                  >
                    {s.id + 1}. {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Single-Step Render View */}
            <div className="lg:hidden flex flex-col gap-6">
              <div className="bg-white border border-navy/10 rounded-2xl p-5 shadow-sm">
                <h2 className="text-base font-bold text-navy mb-4">
                  {MOBILE_STEPS[mobileStep]?.label}
                </h2>
                {mobileStep === 0 && renderPersonalFields()}
                {mobileStep === 1 && renderExperienceFields()}
                {mobileStep === 2 && renderEducationFields()}
                {mobileStep === 3 && renderSkillsAndFileFields()}
                {mobileStep === 4 && (
                  <div>
                    {hasPreviewContent ? (
                      renderLivePreviewCard()
                    ) : (
                      <p className="text-xs text-navy/40 text-center py-8">
                        Fill in basic details to generate a preview.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Wizard Nav Actions */}
              <div className="flex items-center justify-between gap-3 bg-white border border-navy/10 rounded-2xl p-4 shadow-sm">
                <button
                  type="button"
                  disabled={mobileStep === 0}
                  onClick={() => setMobileStep((prev) => Math.max(0, prev - 1))}
                  className="px-4 py-2 rounded-xl border border-navy/15 text-xs font-semibold text-navy disabled:opacity-30 disabled:pointer-events-none"
                >
                  Previous
                </button>

                {mobileStep < MOBILE_STEPS.length - 1 ? (
                  <button
                    type="button"
                    onClick={() =>
                      setMobileStep((prev) =>
                        Math.min(MOBILE_STEPS.length - 1, prev + 1),
                      )
                    }
                    className="px-5 py-2 rounded-xl bg-navy text-white text-xs font-semibold hover:bg-blue transition-colors"
                  >
                    Next Step →
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={saving || !form.full_name}
                    className="px-5 py-2 rounded-xl bg-blue text-white text-xs font-semibold disabled:opacity-50 hover:bg-navy transition-colors"
                  >
                    {saving ? "Saving..." : editId ? "Update CV" : "Publish CV"}
                  </button>
                )}
              </div>
            </div>

            {/* Desktop Two-Column Layout */}
            <div className="hidden lg:grid lg:grid-cols-12 gap-8 items-start">
              {/* Form Input Side */}
              <div className="lg:col-span-7 bg-white border border-navy/10 rounded-2xl p-6 sm:p-8 flex flex-col gap-8 shadow-sm">
                <div className="flex items-center justify-between border-b border-navy/[0.07] pb-4">
                  <h2 className="text-lg font-bold text-navy">
                    {editId ? "Edit CV Profile" : "Create CV Profile"}
                  </h2>
                  <span className="text-xs text-navy/40">
                    * Required fields
                  </span>
                </div>

                <div className="flex flex-col gap-8">
                  {/* Personal Section */}
                  <div>
                    <h3 className="text-xs font-bold text-navy/40 uppercase tracking-widest mb-4">
                      1. Personal Information
                    </h3>
                    {renderPersonalFields()}
                  </div>

                  {/* Experience Section */}
                  <div>
                    <h3 className="text-xs font-bold text-navy/40 uppercase tracking-widest mb-4">
                      2. Work Experience
                    </h3>
                    {renderExperienceFields()}
                  </div>

                  {/* Education Section */}
                  <div>
                    <h3 className="text-xs font-bold text-navy/40 uppercase tracking-widest mb-4">
                      3. Education
                    </h3>
                    {renderEducationFields()}
                  </div>

                  {/* Skills and File Section */}
                  <div>
                    <h3 className="text-xs font-bold text-navy/40 uppercase tracking-widest mb-4">
                      4. Skills & Attachment
                    </h3>
                    {renderSkillsAndFileFields()}
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-end gap-3 pt-6 border-t border-navy/[0.07]">
                  <button
                    type="button"
                    onClick={() => {
                      setView("list");
                      setEditId(null);
                      setForm(emptyForm());
                    }}
                    className="px-5 py-2.5 rounded-xl border border-navy/15 text-xs font-semibold text-navy/70 hover:bg-navy/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={saving || !form.full_name}
                    className="px-6 py-2.5 rounded-xl bg-navy text-white text-xs font-semibold hover:bg-blue transition-colors disabled:opacity-50"
                  >
                    {saving
                      ? "Saving..."
                      : editId
                        ? "Update CV Profile"
                        : "Save CV Profile"}
                  </button>
                </div>
              </div>

              {/* Desktop Sticky Live Preview */}
              <div className="lg:col-span-5 sticky top-8 flex flex-col gap-3">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-xs font-bold text-navy/40 uppercase tracking-widest">
                    Live Preview
                  </h3>
                  <span className="text-[11px] text-navy/40">
                    Real-time updates
                  </span>
                </div>

                {hasPreviewContent ? (
                  renderLivePreviewCard()
                ) : (
                  <div className="bg-white border border-navy/10 rounded-2xl p-8 text-center text-xs text-navy/40 flex flex-col items-center justify-center gap-2 min-h-[300px]">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="text-navy/20"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                    Start typing on the left to see your CV preview here.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
