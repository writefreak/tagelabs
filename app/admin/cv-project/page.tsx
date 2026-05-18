"use client";
import { supabase } from "@/app/lib/supabase";
import { useState, useEffect } from "react";

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
  company: "", role: "", start_date: "", end_date: "", current: false, description: "",
});
const emptyEdu = (): EducationEntry => ({
  institution: "", degree: "", field: "", start_date: "", end_date: "",
});
const emptyForm = () => ({
  full_name: "", job_title: "", email: "", phone: "",
  location: "", website: "", summary: "",
  experience: [] as ExperienceEntry[],
  education: [] as EducationEntry[],
  skills: "",
  status: "Draft" as "Published" | "Draft",
});

// Mobile steps config
const MOBILE_STEPS = [
  { id: 0, label: "Personal" },
  { id: 1, label: "Experience" },
  { id: 2, label: "Education" },
  { id: 3, label: "Skills" },
  { id: 4, label: "Preview" },
];

// ── CV Viewer Dialog ───────────────────────────────────────────────────────

function CVDialog({ cv, onClose, onEdit }: { cv: CV; onClose: () => void; onEdit: () => void }) {
  const initials = cv.full_name
    .split(" ").map((w) => w[0] ?? "").join("").slice(0, 2).toUpperCase() || "?";

  // Close on backdrop click
  function handleBackdrop(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose();
  }

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
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
            <p className="text-base font-bold text-navy leading-tight">{cv.full_name}</p>
            <p className="text-[13px] text-navy/50 mt-0.5">{cv.job_title || "—"}</p>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                cv.status === "Published" ? "bg-green-100 text-green-600" : "bg-red-50 text-red-400"
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${cv.status === "Published" ? "bg-green-500" : "bg-red-400"}`} />
                {cv.status}
              </span>
              <span className="text-[12px] text-navy/30">
                {new Date(cv.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </span>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={onEdit}
              className="w-8 h-8 rounded-lg bg-blue/[0.08] hover:bg-blue/[0.18] text-blue flex items-center justify-center transition-colors"
              title="Edit CV"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-navy/[0.06] hover:bg-navy/[0.12] text-navy/50 flex items-center justify-center transition-colors"
              title="Close"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-6 pb-8">

          {/* Contact Info */}
          {(cv.email || cv.phone || cv.location || cv.website) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {cv.email && (
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-navy/[0.05] flex items-center justify-center shrink-0">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#112369" strokeWidth="2" opacity="0.45">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </div>
                  <span className="text-[12px] text-navy/55 truncate">{cv.email}</span>
                </div>
              )}
              {cv.phone && (
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-navy/[0.05] flex items-center justify-center shrink-0">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#112369" strokeWidth="2" opacity="0.45">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.77 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                  </div>
                  <span className="text-[12px] text-navy/55">{cv.phone}</span>
                </div>
              )}
              {cv.location && (
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-navy/[0.05] flex items-center justify-center shrink-0">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#112369" strokeWidth="2" opacity="0.45">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                  </div>
                  <span className="text-[12px] text-navy/55">{cv.location}</span>
                </div>
              )}
              {cv.website && (
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-navy/[0.05] flex items-center justify-center shrink-0">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#112369" strokeWidth="2" opacity="0.45">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="2" y1="12" x2="22" y2="12"/>
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                    </svg>
                  </div>
                  <a href={cv.website.startsWith("http") ? cv.website : `https://${cv.website}`} target="_blank" rel="noopener noreferrer" className="text-[12px] text-blue/70 hover:text-blue transition-colors truncate">
                    {cv.website}
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Summary */}
          {cv.summary && (
            <div>
              <p className="text-[10px] font-bold text-navy/35 uppercase tracking-widest mb-2">Summary</p>
              <p className="text-[13px] text-navy/60 leading-relaxed">{cv.summary}</p>
            </div>
          )}

          {/* Experience */}
          {cv.experience?.length > 0 && (
            <div>
              <p className="text-[10px] font-bold text-navy/35 uppercase tracking-widest mb-3 pb-2 border-b border-navy/[0.07]">Experience</p>
              <div className="flex flex-col gap-4">
                {cv.experience.map((exp, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center pt-1">
                      <div className="w-2 h-2 rounded-full bg-blue/40 shrink-0" />
                      {i < cv.experience.length - 1 && <div className="w-px flex-1 bg-navy/[0.07] mt-1.5" />}
                    </div>
                    <div className="flex-1 min-w-0 pb-1">
                      <div className="flex items-baseline justify-between gap-2 flex-wrap">
                        <p className="text-[13px] font-semibold text-navy">
                          {exp.role} <span className="font-normal text-navy/45">@ {exp.company}</span>
                        </p>
                        <span className="text-[11px] text-navy/35 shrink-0">
                          {exp.start_date}{exp.current ? " – Present" : exp.end_date ? ` – ${exp.end_date}` : ""}
                        </span>
                      </div>
                      {exp.description && (
                        <p className="text-[12px] text-navy/50 leading-relaxed mt-1">{exp.description}</p>
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
              <p className="text-[10px] font-bold text-navy/35 uppercase tracking-widest mb-3 pb-2 border-b border-navy/[0.07]">Education</p>
              <div className="flex flex-col gap-3">
                {cv.education.map((edu, i) => (
                  <div key={i} className="flex items-start justify-between gap-3">
                    <div className="flex gap-3 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-navy/[0.05] flex items-center justify-center shrink-0 mt-0.5">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#112369" strokeWidth="2" opacity="0.4">
                          <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                          <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13px] font-semibold text-navy truncate">{edu.institution}</p>
                        <p className="text-[12px] text-navy/50">{[edu.degree, edu.field].filter(Boolean).join(" · ")}</p>
                      </div>
                    </div>
                    <span className="text-[11px] text-navy/35 shrink-0 mt-0.5">
                      {edu.start_date}{edu.end_date ? ` – ${edu.end_date}` : ""}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {cv.skills?.length > 0 && (
            <div>
              <p className="text-[10px] font-bold text-navy/35 uppercase tracking-widest mb-3 pb-2 border-b border-navy/[0.07]">Skills</p>
              <div className="flex flex-wrap gap-1.5">
                {cv.skills.map((s) => (
                  <span key={s} className="text-[12px] font-medium border border-navy/15 text-navy/55 px-3 py-1 rounded-full bg-navy/[0.02]">{s}</span>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// ── Component ──────────────────────────────────────────────────────────────

export default function CVsPage() {
  const [cvs, setCvs] = useState<CV[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<"list" | "form">("list");
  const [form, setForm] = useState(emptyForm());
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [filter, setFilter] = useState<"All" | "Published" | "Draft">("All");
  const [mobileStep, setMobileStep] = useState(0);
  const [viewCV, setViewCV] = useState<CV | null>(null);

  useEffect(() => { fetchCVs(); }, []);

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

  async function handleSubmit() {
    if (!form.full_name) return;
    setSaving(true);
    setError(null);

    const skillArray = form.skills.split(",").map((s) => s.trim()).filter(Boolean);
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
    };

    if (editId) {
      const { error } = await supabase.from("cvs").update(payload).eq("id", editId).select();
      if (error) { setError(error.message); setSaving(false); return; }
    } else {
      const { error } = await supabase.from("cvs").insert(payload).select();
      if (error) { setError(error.message); setSaving(false); return; }
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
    setForm((f) => ({ ...f, experience: f.experience.filter((_, idx) => idx !== i) }));
  }
  function updateExp(i: number, field: keyof ExperienceEntry, value: string | boolean) {
    setForm((f) => {
      const updated = f.experience.map((e, idx) =>
        idx === i ? { ...e, [field]: value } : e
      );
      return { ...f, experience: updated };
    });
  }

  // ── Education helpers ─────────────────────────────────────────────────────

  function addEdu() {
    setForm((f) => ({ ...f, education: [...f.education, emptyEdu()] }));
  }
  function removeEdu(i: number) {
    setForm((f) => ({ ...f, education: f.education.filter((_, idx) => idx !== i) }));
  }
  function updateEdu(i: number, field: keyof EducationEntry, value: string) {
    setForm((f) => {
      const updated = f.education.map((e, idx) =>
        idx === i ? { ...e, [field]: value } : e
      );
      return { ...f, education: updated };
    });
  }

  // ── Derived ───────────────────────────────────────────────────────────────

  const previewSkills = form.skills.split(",").map((s) => s.trim()).filter(Boolean);
  const initials = form.full_name
    .split(" ").map((w) => w[0] ?? "").join("").slice(0, 2).toUpperCase() || "?";
  const filtered = cvs.filter((c) => filter === "All" || c.status === filter);
  const hasPreviewContent =
    form.full_name || form.job_title || form.summary ||
    form.experience.length > 0 || form.education.length > 0 || previewSkills.length > 0;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="font-body max-w-[1100px]">

      {/* CV Viewer Dialog */}
      {viewCV && (
        <CVDialog
          cv={viewCV}
          onClose={() => setViewCV(null)}
          onEdit={() => handleEdit(viewCV)}
        />
      )}

      {error && (
        <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-500">
          {error}
        </div>
      )}

      {/* ── LIST VIEW ──────────────────────────────────────────────────────── */}
      {view === "list" && (
        <>
          <div className="flex flex-col gap-4 mb-7 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="font-display font-bold text-2xl text-navy">CV Manager</h2>
              <p className="text-navy/50 text-sm mt-1">
                {cvs.length} total · {cvs.filter((c) => c.status === "Published").length} published
              </p>
            </div>
            <button
              onClick={openCreate}
              className="flex items-center justify-center gap-2 bg-navy hover:bg-blue text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors duration-200 w-full sm:w-auto"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Create CV
            </button>
          </div>

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

          <div className="bg-white rounded-2xl border border-navy/[0.07] shadow-sm overflow-hidden">
            <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_120px_100px] px-6 py-3.5 bg-navy/[0.03] border-b border-navy/[0.07]">
              {["Name", "Location", "Date", "Status", "Actions"].map((h) => (
                <span key={h} className="text-[11px] font-semibold text-navy/40 uppercase tracking-wider">{h}</span>
              ))}
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-16 gap-2 text-navy/40 text-sm">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                Loading CVs...
              </div>
            ) : filtered.length === 0 ? (
              <p className="text-center py-12 text-navy/35 text-sm">No CVs found.</p>
            ) : (
              filtered.map((cv, i) => (
                <div key={cv.id} className={i < filtered.length - 1 ? "border-b border-navy/[0.06]" : ""}>

                  {/* Desktop row */}
                  <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_120px_100px] px-6 py-4 items-center hover:bg-navy/[0.02] transition-colors">
                    <div>
                      <button
                        onClick={() => setViewCV(cv)}
                        className="text-sm font-semibold text-navy hover:text-blue transition-colors text-left"
                      >
                        {cv.full_name}
                      </button>
                      <p className="text-[12px] text-navy/45 mt-0.5">{cv.job_title || "—"}</p>
                    </div>
                    <p className="text-[13px] text-navy/55">{cv.location || "—"}</p>
                    <p className="text-[13px] text-navy/40">
                      {new Date(cv.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </p>
                    <span className={`inline-flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1 rounded-full w-fit ${
                      cv.status === "Published" ? "bg-green-100 text-green-600" : "bg-red-50 text-red-400"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${cv.status === "Published" ? "bg-green-500" : "bg-red-400"}`} />
                      {cv.status}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(cv)}
                        className="w-8 h-8 rounded-lg bg-blue/[0.08] hover:bg-blue/[0.18] text-blue flex items-center justify-center transition-colors"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      {deleteConfirm === cv.id ? (
                        <button onClick={() => handleDelete(cv.id)} className="h-8 px-2.5 rounded-lg bg-red-500 text-white text-xs font-semibold">Confirm</button>
                      ) : (
                        <button onClick={() => setDeleteConfirm(cv.id)} className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-400 flex items-center justify-center transition-colors">
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
                      <button
                        onClick={() => setViewCV(cv)}
                        className="flex-1 min-w-0 text-left"
                      >
                        <p className="text-sm font-semibold text-navy truncate hover:text-blue transition-colors">{cv.full_name}</p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <p className="text-[12px] text-navy/50">{cv.job_title || "—"}</p>
                          <span className="text-navy/20">·</span>
                          <p className="text-[12px] text-navy/40">
                            {new Date(cv.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </p>
                        </div>
                      </button>
                      <div className="flex flex-col items-end gap-2.5 shrink-0">
                        <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                          cv.status === "Published" ? "bg-green-100 text-green-600" : "bg-red-50 text-red-400"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${cv.status === "Published" ? "bg-green-500" : "bg-red-400"}`} />
                          {cv.status}
                        </span>
                        <div className="flex gap-2">
                          <button onClick={() => handleEdit(cv)} className="w-8 h-8 rounded-lg bg-blue/[0.08] hover:bg-blue/[0.18] text-blue flex items-center justify-center transition-colors">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                          {deleteConfirm === cv.id ? (
                            <button onClick={() => handleDelete(cv.id)} className="h-8 px-2.5 rounded-lg bg-red-500 text-white text-xs font-semibold">Confirm</button>
                          ) : (
                            <button onClick={() => setDeleteConfirm(cv.id)} className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-400 flex items-center justify-center transition-colors">
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
        </>
      )}

      {/* ── FORM VIEW ──────────────────────────────────────────────────────── */}
      {view === "form" && (
        <>
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-7">
            <button
              onClick={() => { setView("list"); setEditId(null); setForm(emptyForm()); setMobileStep(0); }}
              className="flex items-center gap-1.5 text-[13px] text-navy/45 hover:text-navy transition-colors font-body"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
              </svg>
              CV Manager
            </button>
            <span className="text-navy/20 text-sm">/</span>
            <span className="text-[13px] font-semibold text-navy">
              {editId ? "Edit CV" : "Create CV"}
            </span>
          </div>

          {/* ── MOBILE: Step-by-step ── */}
          <div className="lg:hidden">

            {/* Step indicator */}
            <div className="flex items-center gap-0 mb-6">
              {MOBILE_STEPS.map((step, i) => (
                <div key={step.id} className="flex items-center flex-1 last:flex-none">
                  <button
                    onClick={() => setMobileStep(step.id)}
                    className="flex flex-col items-center gap-1 flex-1"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold transition-all duration-200 ${
                      mobileStep === step.id
                        ? "bg-navy text-white shadow-md"
                        : mobileStep > step.id
                        ? "bg-blue/20 text-blue"
                        : "bg-navy/[0.07] text-navy/30"
                    }`}>
                      {mobileStep > step.id ? (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      ) : (
                        step.id + 1
                      )}
                    </div>
                    <span className={`text-[10px] font-semibold transition-colors ${
                      mobileStep === step.id ? "text-navy" : mobileStep > step.id ? "text-blue" : "text-navy/30"
                    }`}>
                      {step.label}
                    </span>
                  </button>
                  {i < MOBILE_STEPS.length - 1 && (
                    <div className={`h-[2px] flex-1 mx-1 mb-4 rounded-full transition-colors duration-300 ${
                      mobileStep > step.id ? "bg-blue/40" : "bg-navy/[0.08]"
                    }`} />
                  )}
                </div>
              ))}
            </div>

            {/* Step card */}
            <div className="bg-white rounded-2xl p-5 border border-navy/10 shadow-sm mb-5">
              <h3 className="font-display font-semibold text-base text-navy mb-5">
                {MOBILE_STEPS[mobileStep].label}
              </h3>

              {/* Step 0 — Personal */}
              {mobileStep === 0 && (
                <div className="flex flex-col gap-4">
                  <div>
                    <label className={labelClass}>Full Name *</label>
                    <input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} placeholder="e.g. Adaeze Nwosu" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Job Title</label>
                    <input value={form.job_title} onChange={(e) => setForm({ ...form, job_title: e.target.value })} placeholder="e.g. Product Designer" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Email</label>
                    <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="hello@example.com" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Phone</label>
                    <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+234 800 000 0000" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Location</label>
                    <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Lagos, Nigeria" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Website / Portfolio</label>
                    <input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="yoursite.com" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Professional Summary</label>
                    <textarea value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} placeholder="Brief professional overview..." rows={3} className={`${inputClass} resize-y`} />
                  </div>
                </div>
              )}

              {/* Step 1 — Experience */}
              {mobileStep === 1 && (
                <div className="flex flex-col gap-4">
                  {form.experience.map((exp, i) => (
                    <div key={i} className="relative border border-navy/10 rounded-xl p-4 bg-offwhite/60">
                      <button onClick={() => removeExp(i)} className="absolute top-3 right-3 w-6 h-6 rounded-md flex items-center justify-center text-navy/30 hover:text-red-400 hover:bg-red-50 transition-colors">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      </button>
                      <div className="flex flex-col gap-3">
                        <div>
                          <label className={labelClass}>Company</label>
                          <input value={exp.company} onChange={(e) => updateExp(i, "company", e.target.value)} placeholder="e.g. Flutterwave" className={inputClass} />
                        </div>
                        <div>
                          <label className={labelClass}>Role / Title</label>
                          <input value={exp.role} onChange={(e) => updateExp(i, "role", e.target.value)} placeholder="e.g. Frontend Developer" className={inputClass} />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className={labelClass}>Start</label>
                            <input value={exp.start_date} onChange={(e) => updateExp(i, "start_date", e.target.value)} placeholder="2022" className={inputClass} />
                          </div>
                          <div>
                            <label className={labelClass}>End</label>
                            <input value={exp.end_date} onChange={(e) => updateExp(i, "end_date", e.target.value)} placeholder="2024" disabled={exp.current} className={`${inputClass} disabled:opacity-40`} />
                          </div>
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" checked={exp.current} onChange={(e) => { updateExp(i, "current", e.target.checked); if (e.target.checked) updateExp(i, "end_date", ""); }} className="accent-navy w-3.5 h-3.5" />
                          <span className="text-[12px] text-navy/50">Currently working here</span>
                        </label>
                        <div>
                          <label className={labelClass}>Description</label>
                          <textarea value={exp.description} onChange={(e) => updateExp(i, "description", e.target.value)} placeholder="Brief role description..." rows={2} className={`${inputClass} resize-y`} />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button onClick={addExp} className="w-full flex items-center justify-center gap-2 border border-dashed border-navy/20 rounded-xl py-3 text-[13px] text-navy/40 hover:border-blue hover:text-blue transition-colors font-body">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Add experience
                  </button>
                </div>
              )}

              {/* Step 2 — Education */}
              {mobileStep === 2 && (
                <div className="flex flex-col gap-4">
                  {form.education.map((edu, i) => (
                    <div key={i} className="relative border border-navy/10 rounded-xl p-4 bg-offwhite/60">
                      <button onClick={() => removeEdu(i)} className="absolute top-3 right-3 w-6 h-6 rounded-md flex items-center justify-center text-navy/30 hover:text-red-400 hover:bg-red-50 transition-colors">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      </button>
                      <div className="flex flex-col gap-3">
                        <div>
                          <label className={labelClass}>Institution</label>
                          <input value={edu.institution} onChange={(e) => updateEdu(i, "institution", e.target.value)} placeholder="e.g. University of Lagos" className={inputClass} />
                        </div>
                        <div>
                          <label className={labelClass}>Degree</label>
                          <input value={edu.degree} onChange={(e) => updateEdu(i, "degree", e.target.value)} placeholder="B.Sc / HND / MBA" className={inputClass} />
                        </div>
                        <div>
                          <label className={labelClass}>Field of Study</label>
                          <input value={edu.field} onChange={(e) => updateEdu(i, "field", e.target.value)} placeholder="Computer Science" className={inputClass} />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className={labelClass}>Start</label>
                            <input value={edu.start_date} onChange={(e) => updateEdu(i, "start_date", e.target.value)} placeholder="2018" className={inputClass} />
                          </div>
                          <div>
                            <label className={labelClass}>End</label>
                            <input value={edu.end_date} onChange={(e) => updateEdu(i, "end_date", e.target.value)} placeholder="2022" className={inputClass} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button onClick={addEdu} className="w-full flex items-center justify-center gap-2 border border-dashed border-navy/20 rounded-xl py-3 text-[13px] text-navy/40 hover:border-blue hover:text-blue transition-colors font-body">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Add education
                  </button>
                </div>
              )}

              {/* Step 3 — Skills */}
              {mobileStep === 3 && (
                <div className="flex flex-col gap-4">
                  <div>
                    <label className={labelClass}>Skills (comma-separated)</label>
                    <input value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} placeholder="React, Figma, Tailwind CSS, TypeScript" className={inputClass} />
                    {previewSkills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {previewSkills.map((s) => (
                          <span key={s} className="text-[11px] font-medium border border-navy/15 text-navy/50 px-2.5 py-0.5 rounded-full">{s}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 4 — Preview + Save */}
              {mobileStep === 4 && (
                <div className="flex flex-col gap-5">
                  {/* CV Preview */}
                  {hasPreviewContent ? (
                    <div className="bg-offwhite rounded-xl border border-navy/10 p-4">
                      {/* Header */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-11 h-11 rounded-full bg-blue/[0.12] flex items-center justify-center text-sm font-bold text-blue shrink-0">
                          {initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-navy truncate">{form.full_name || <span className="text-navy/25">Full name</span>}</p>
                          <p className="text-xs text-navy/50 truncate">{form.job_title || <span className="text-navy/25">Job title</span>}</p>
                        </div>
                      </div>
                      {(form.email || form.phone || form.location || form.website) && (
                        <div className="flex flex-col gap-0.5 mb-4 pb-4 border-b border-navy/[0.07]">
                          {form.email && <span className="text-[11px] text-navy/45">{form.email}</span>}
                          {form.phone && <span className="text-[11px] text-navy/45">{form.phone}</span>}
                          {form.location && <span className="text-[11px] text-navy/45">{form.location}</span>}
                          {form.website && <span className="text-[11px] text-blue/70">{form.website}</span>}
                        </div>
                      )}
                      {form.summary && (
                        <div className="mb-4">
                          <p className="text-[10px] font-bold text-navy/35 uppercase tracking-widest mb-1.5">Summary</p>
                          <p className="text-[11px] text-navy/55 leading-relaxed">{form.summary}</p>
                        </div>
                      )}
                      {form.experience.length > 0 && (
                        <div className="mb-4">
                          <p className="text-[10px] font-bold text-navy/35 uppercase tracking-widest mb-2 pb-1 border-b border-navy/[0.07]">Experience</p>
                          {form.experience.map((e, i) => (
                            <div key={i} className="mb-3">
                              <div className="flex justify-between items-baseline gap-2">
                                <p className="text-[12px] font-semibold text-navy truncate">
                                  {e.role || "Role"} <span className="font-normal text-navy/45">@ {e.company || "Company"}</span>
                                </p>
                                <span className="text-[10px] text-navy/35 shrink-0">
                                  {e.start_date}{e.current ? " – Present" : e.end_date ? ` – ${e.end_date}` : ""}
                                </span>
                              </div>
                              {e.description && <p className="text-[11px] text-navy/50 leading-relaxed mt-0.5">{e.description}</p>}
                            </div>
                          ))}
                        </div>
                      )}
                      {form.education.length > 0 && (
                        <div className="mb-4">
                          <p className="text-[10px] font-bold text-navy/35 uppercase tracking-widest mb-2 pb-1 border-b border-navy/[0.07]">Education</p>
                          {form.education.map((e, i) => (
                            <div key={i} className="flex justify-between items-start gap-2 mb-2">
                              <div className="min-w-0">
                                <p className="text-[12px] font-semibold text-navy truncate">{e.institution || "Institution"}</p>
                                <p className="text-[11px] text-navy/50">{[e.degree, e.field].filter(Boolean).join(", ") || "Degree · Field"}</p>
                              </div>
                              <span className="text-[10px] text-navy/35 shrink-0">{e.start_date}{e.end_date ? ` – ${e.end_date}` : ""}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {previewSkills.length > 0 && (
                        <div>
                          <p className="text-[10px] font-bold text-navy/35 uppercase tracking-widest mb-2 pb-1 border-b border-navy/[0.07]">Skills</p>
                          <div className="flex flex-wrap gap-1.5">
                            {previewSkills.map((s) => (
                              <span key={s} className="text-[11px] border border-navy/15 text-navy/50 px-2.5 py-0.5 rounded-full">{s}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="h-40 rounded-xl border-2 border-dashed border-navy/10 flex items-center justify-center">
                      <p className="text-[12px] text-navy/25">No content to preview yet</p>
                    </div>
                  )}

                  {/* Status + Save */}
                  <div className="border-t border-navy/[0.07] pt-4">
                    <p className={labelClass}>Status</p>
                    <div className="flex gap-2 mb-4">
                      {(["Draft", "Published"] as const).map((s) => (
                        <button key={s} type="button" onClick={() => setForm({ ...form, status: s })} className={pillClass(form.status === s)}>{s}</button>
                      ))}
                    </div>
                    <button
                      onClick={handleSubmit}
                      disabled={saving || !form.full_name}
                      className="w-full bg-navy hover:bg-blue disabled:opacity-50 text-white text-sm font-semibold py-3 rounded-xl transition-colors"
                    >
                      {saving ? "Saving..." : editId ? "Save Changes" : "Create CV"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Step nav buttons */}
            <div className="flex gap-3 pb-8">
              {mobileStep > 0 ? (
                <button
                  onClick={() => { setMobileStep((s) => s - 1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  className="flex-1 border border-navy/15 text-navy/60 text-sm font-medium py-3 rounded-xl hover:border-navy/30 transition-colors"
                >
                  ← Back
                </button>
              ) : (
                <button
                  onClick={() => { setView("list"); setEditId(null); setForm(emptyForm()); setMobileStep(0); }}
                  className="flex-1 border border-navy/15 text-navy/60 text-sm font-medium py-3 rounded-xl hover:border-navy/30 transition-colors"
                >
                  Cancel
                </button>
              )}
              {mobileStep < MOBILE_STEPS.length - 1 && (
                <button
                  onClick={() => { setMobileStep((s) => s + 1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  disabled={mobileStep === 0 && !form.full_name}
                  className="flex-1 bg-navy hover:bg-blue disabled:opacity-40 text-white text-sm font-semibold py-3 rounded-xl transition-colors"
                >
                  Next →
                </button>
              )}
            </div>
          </div>

          {/* ── DESKTOP: Original layout (unchanged) ── */}
          <div className="hidden lg:flex gap-6 items-start">

            {/* Left: Form panels */}
            <div className="flex-1 min-w-0 flex flex-col gap-5">

              {/* Personal Info */}
              <div className="bg-white rounded-2xl p-5 sm:p-7 border border-navy/10 shadow-sm">
                <h3 className="font-display font-semibold text-base text-navy mb-5">Personal Info</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Full Name *</label>
                    <input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} placeholder="e.g. Adaeze Nwosu" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Job Title</label>
                    <input value={form.job_title} onChange={(e) => setForm({ ...form, job_title: e.target.value })} placeholder="e.g. Product Designer" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Email</label>
                    <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="hello@example.com" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Phone</label>
                    <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+234 800 000 0000" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Location</label>
                    <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Lagos, Nigeria" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Website / Portfolio</label>
                    <input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="yoursite.com" className={inputClass} />
                  </div>
                  <div className="col-span-2">
                    <label className={labelClass}>Professional Summary</label>
                    <textarea value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} placeholder="Brief professional overview..." rows={3} className={`${inputClass} resize-y`} />
                  </div>
                </div>
              </div>

              {/* Work Experience */}
              <div className="bg-white rounded-2xl p-5 sm:p-7 border border-navy/10 shadow-sm">
                <h3 className="font-display font-semibold text-base text-navy mb-5">Work Experience</h3>
                <div className="flex flex-col gap-4">
                  {form.experience.map((exp, i) => (
                    <div key={i} className="relative border border-navy/10 rounded-xl p-4 bg-offwhite/60">
                      <button onClick={() => removeExp(i)} className="absolute top-3 right-3 w-6 h-6 rounded-md flex items-center justify-center text-navy/30 hover:text-red-400 hover:bg-red-50 transition-colors">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      </button>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                        <div>
                          <label className={labelClass}>Company</label>
                          <input value={exp.company} onChange={(e) => updateExp(i, "company", e.target.value)} placeholder="e.g. Flutterwave" className={inputClass} />
                        </div>
                        <div>
                          <label className={labelClass}>Role / Title</label>
                          <input value={exp.role} onChange={(e) => updateExp(i, "role", e.target.value)} placeholder="e.g. Frontend Developer" className={inputClass} />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-3 mb-3">
                        <div>
                          <label className={labelClass}>Start</label>
                          <input value={exp.start_date} onChange={(e) => updateExp(i, "start_date", e.target.value)} placeholder="2022" className={inputClass} />
                        </div>
                        <div>
                          <label className={labelClass}>End</label>
                          <input value={exp.end_date} onChange={(e) => updateExp(i, "end_date", e.target.value)} placeholder="2024" disabled={exp.current} className={`${inputClass} disabled:opacity-40`} />
                        </div>
                        <div className="flex items-end pb-1">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={exp.current} onChange={(e) => { updateExp(i, "current", e.target.checked); if (e.target.checked) updateExp(i, "end_date", ""); }} className="accent-navy w-3.5 h-3.5" />
                            <span className="text-[12px] text-navy/50">Current</span>
                          </label>
                        </div>
                      </div>
                      <div>
                        <label className={labelClass}>Description</label>
                        <textarea value={exp.description} onChange={(e) => updateExp(i, "description", e.target.value)} placeholder="Brief role description..." rows={2} className={`${inputClass} resize-y`} />
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={addExp} className="mt-4 w-full flex items-center justify-center gap-2 border border-dashed border-navy/20 rounded-xl py-2.5 text-[13px] text-navy/40 hover:border-blue hover:text-blue transition-colors font-body">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  Add experience
                </button>
              </div>

              {/* Education */}
              <div className="bg-white rounded-2xl p-5 sm:p-7 border border-navy/10 shadow-sm">
                <h3 className="font-display font-semibold text-base text-navy mb-5">Education</h3>
                <div className="flex flex-col gap-4">
                  {form.education.map((edu, i) => (
                    <div key={i} className="relative border border-navy/10 rounded-xl p-4 bg-offwhite/60">
                      <button onClick={() => removeEdu(i)} className="absolute top-3 right-3 w-6 h-6 rounded-md flex items-center justify-center text-navy/30 hover:text-red-400 hover:bg-red-50 transition-colors">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      </button>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                        <div>
                          <label className={labelClass}>Institution</label>
                          <input value={edu.institution} onChange={(e) => updateEdu(i, "institution", e.target.value)} placeholder="e.g. University of Lagos" className={inputClass} />
                        </div>
                        <div>
                          <label className={labelClass}>Degree</label>
                          <input value={edu.degree} onChange={(e) => updateEdu(i, "degree", e.target.value)} placeholder="B.Sc / HND / MBA" className={inputClass} />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className={labelClass}>Field of Study</label>
                          <input value={edu.field} onChange={(e) => updateEdu(i, "field", e.target.value)} placeholder="Computer Science" className={inputClass} />
                        </div>
                        <div>
                          <label className={labelClass}>Start</label>
                          <input value={edu.start_date} onChange={(e) => updateEdu(i, "start_date", e.target.value)} placeholder="2018" className={inputClass} />
                        </div>
                        <div>
                          <label className={labelClass}>End</label>
                          <input value={edu.end_date} onChange={(e) => updateEdu(i, "end_date", e.target.value)} placeholder="2022" className={inputClass} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={addEdu} className="mt-4 w-full flex items-center justify-center gap-2 border border-dashed border-navy/20 rounded-xl py-2.5 text-[13px] text-navy/40 hover:border-blue hover:text-blue transition-colors font-body">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  Add education
                </button>
              </div>

              {/* Skills */}
              <div className="bg-white rounded-2xl p-5 sm:p-7 border border-navy/10 shadow-sm">
                <h3 className="font-display font-semibold text-base text-navy mb-5">Skills</h3>
                <label className={labelClass}>Skills (comma-separated)</label>
                <input value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} placeholder="React, Figma, Tailwind CSS, TypeScript" className={inputClass} />
                {previewSkills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {previewSkills.map((s) => (
                      <span key={s} className="text-[11px] font-medium border border-navy/15 text-navy/50 px-2.5 py-0.5 rounded-full">{s}</span>
                    ))}
                  </div>
                )}
              </div>

              {/* Save bar */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pb-8">
                <div className="flex gap-2">
                  {(["Draft", "Published"] as const).map((s) => (
                    <button key={s} type="button" onClick={() => setForm({ ...form, status: s })} className={pillClass(form.status === s)}>{s}</button>
                  ))}
                </div>
                <div className="flex gap-3 sm:ml-auto w-full sm:w-auto">
                  <button onClick={() => { setView("list"); setEditId(null); setForm(emptyForm()); }} className="border border-navy/15 text-navy/50 text-sm px-5 py-2.5 rounded-xl hover:border-navy/30 transition-colors flex-1 sm:flex-none">Cancel</button>
                  <button onClick={handleSubmit} disabled={saving || !form.full_name} className="bg-navy hover:bg-blue disabled:opacity-50 text-white text-sm font-semibold px-7 py-2.5 rounded-xl transition-colors flex-1 sm:flex-none">
                    {saving ? "Saving..." : editId ? "Save Changes" : "Create CV"}
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Skeleton preview */}
            <div className="lg:w-72 shrink-0 sticky top-4">
              <p className={labelClass}>CV Skeleton Preview</p>

              {hasPreviewContent ? (
                <div className="bg-white border border-navy/10 rounded-2xl p-5 shadow-sm">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-blue/[0.1] flex items-center justify-center text-[13px] font-bold text-blue shrink-0">
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-bold text-navy truncate">{form.full_name || <span className="text-navy/20">Full name</span>}</p>
                      <p className="text-[11px] text-navy/45 truncate">{form.job_title || <span className="text-navy/20">Job title</span>}</p>
                    </div>
                  </div>
                  {(form.email || form.phone || form.location) && (
                    <div className="flex flex-col gap-0.5 mb-4 pb-4 border-b border-navy/[0.07]">
                      {form.email && <span className="text-[9px] text-navy/40">{form.email}</span>}
                      {form.phone && <span className="text-[9px] text-navy/40">{form.phone}</span>}
                      {form.location && <span className="text-[9px] text-navy/40">{form.location}</span>}
                      {form.website && <span className="text-[9px] text-blue/70">{form.website}</span>}
                    </div>
                  )}
                  {form.summary && (
                    <div className="mb-4">
                      <p className="text-[9px] font-bold text-navy/35 uppercase tracking-widest mb-1.5">Summary</p>
                      <p className="text-[9px] text-navy/50 leading-relaxed line-clamp-3">{form.summary}</p>
                    </div>
                  )}
                  {form.experience.length > 0 && (
                    <div className="mb-4">
                      <p className="text-[9px] font-bold text-navy/35 uppercase tracking-widest mb-2 pb-1 border-b border-navy/[0.07]">Experience</p>
                      {form.experience.map((e, i) => (
                        <div key={i} className="mb-2.5">
                          <div className="flex justify-between items-baseline gap-1">
                            <p className="text-[10px] font-semibold text-navy truncate">
                              {e.role || "Role"} <span className="font-normal text-navy/40">@ {e.company || "Company"}</span>
                            </p>
                            <span className="text-[8px] text-navy/30 shrink-0">
                              {e.start_date}{e.current ? " – Present" : e.end_date ? ` – ${e.end_date}` : ""}
                            </span>
                          </div>
                          {e.description && <p className="text-[8.5px] text-navy/45 leading-relaxed mt-0.5 line-clamp-2">{e.description}</p>}
                        </div>
                      ))}
                    </div>
                  )}
                  {form.education.length > 0 && (
                    <div className="mb-4">
                      <p className="text-[9px] font-bold text-navy/35 uppercase tracking-widest mb-2 pb-1 border-b border-navy/[0.07]">Education</p>
                      {form.education.map((e, i) => (
                        <div key={i} className="flex justify-between items-start gap-1 mb-2">
                          <div className="min-w-0">
                            <p className="text-[10px] font-semibold text-navy truncate">{e.institution || "Institution"}</p>
                            <p className="text-[8.5px] text-navy/45">{[e.degree, e.field].filter(Boolean).join(", ") || "Degree · Field"}</p>
                          </div>
                          <span className="text-[8px] text-navy/30 shrink-0">{e.start_date}{e.end_date ? ` – ${e.end_date}` : ""}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {previewSkills.length > 0 && (
                    <div>
                      <p className="text-[9px] font-bold text-navy/35 uppercase tracking-widest mb-2 pb-1 border-b border-navy/[0.07]">Skills</p>
                      <div className="flex flex-wrap gap-1">
                        {previewSkills.slice(0, 10).map((s) => (
                          <span key={s} className="text-[9px] border border-navy/15 text-navy/45 px-2 py-0.5 rounded-full">{s}</span>
                        ))}
                        {previewSkills.length > 10 && (
                          <span className="text-[9px] border border-navy/15 text-navy/45 px-2 py-0.5 rounded-full">+{previewSkills.length - 10}</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-64 rounded-2xl border-2 border-dashed border-navy/10 flex flex-col items-center justify-center gap-2 text-center px-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#112369" strokeWidth="1.5" opacity="0.2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10 9 9 9 8 9"/>
                  </svg>
                  <p className="text-[12px] text-navy/25 leading-relaxed">Fill in the form to<br />see the CV skeleton</p>
                </div>
              )}
            </div>

          </div>
        </>
      )}
    </div>
  );
}