"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

function CustomSelect({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (val: string) => void;
  options: string[];
  placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`${inputClass} flex items-center justify-between text-left ${
          value ? "text-[#112369]" : "text-[#112369]/30"
        }`}
      >
        <span>{value || placeholder}</span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`shrink-0 transition-transform duration-200 text-[#112369]/40 ${open ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="absolute z-50 mt-1.5 w-full bg-white border border-[#112369]/10 rounded-xl shadow-lg overflow-hidden"
          >
            {options.map((opt) => (
              <li key={opt}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(opt);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 text-sm transition-colors duration-150 ${
                    value === opt
                      ? "bg-[#4a8fe2]/8 text-[#4a8fe2] font-medium"
                      : "text-[#112369] hover:bg-[#f9f8f6]"
                  }`}
                >
                  {opt}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

const CV_TIERS = [
  {
    id: "essential",
    name: "Essential",
    price: "₦7,000",
    desc: "Clean, professional layout for entry-level roles and fresh graduates.",
    includes: ["1-page design", "ATS-friendly format", "PDF delivery", "1 revision"],
  },
  {
    id: "professional",
    name: "Professional",
    price: "₦12,000",
    desc: "Polished, detailed design for mid-level professionals who want to stand out.",
    includes: ["Up to 2 pages", "Custom layout", "PDF + Word delivery", "2 revisions"],
  },
  {
    id: "executive",
    name: "Executive",
    price: "₦15,000",
    desc: "Premium, bespoke design for senior professionals, leaders, and creatives.",
    includes: ["Up to 3 pages", "Branded design", "PDF + Word + editable source", "Unlimited revisions"],
  },
];

const JOB_FIELDS = [
  "Technology & Engineering",
  "Design & Creative",
  "Finance & Accounting",
  "Marketing & Communications",
  "Healthcare & Medicine",
  "Law & Legal Services",
  "Education & Academia",
  "Business & Management",
  "Sales & Business Development",
  "Other",
];

type FormData = {
  name: string;
  email: string;
  whatsapp: string;
  jobField: string;
  currentRole: string;
  targetRole: string;
  tier: string;
  notes: string;
};

const initial: FormData = {
  name: "",
  email: "",
  whatsapp: "",
  jobField: "",
  currentRole: "",
  targetRole: "",
  tier: "",
  notes: "",
};

export default function CVOrderPage() {
  const [form, setForm] = useState<FormData>(initial);
  const [step, setStep] = useState(0); // 0 = form, 1 = success
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function set(key: keyof FormData, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  const isValid =
    form.name.trim() &&
    form.email.trim() &&
    form.whatsapp.trim() &&
    form.jobField &&
    form.tier;

  async function handleSubmit() {
    if (!isValid) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/cv-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      setStep(1);
    } catch {
      setError("Something went wrong. Please try again or reach out on WhatsApp.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f9f8f6] px-5 py-16 md:py-24 font-sans">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12"
        >
          {/* <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#4a8fe2] mb-4">
            TageLabs · CV Design
          </p> */}
          <h1 className="font-display text-4xl md:text-5xl pt-6 font-semibold text-[#112369] leading-tight mb-4">
            Your CV, crafted with intention.
          </h1>
          <p className="text-[#112369]/55 text-sm md:text-base leading-relaxed max-w-lg">
            Fill in the details below and we'll get back to you on WhatsApp within 24 hours to begin. Every CV is designed with accuracy and precision.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {step === 0 ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col gap-8"
            >
              {/* Personal info */}
              <div className="bg-white rounded-2xl border border-[#112369]/8 p-6 md:p-8 flex flex-col gap-5">
                <h2 className="text-sm font-semibold tracking-widest uppercase text-[#112369]/40">
                  Your Details
                </h2>

                <Field label="Full name" required>
                  <input
                    type="text"
                    placeholder="e.g. Adaeze Okonkwo"
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    className={inputClass}
                  />
                </Field>

                <Field label="Email address" required>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    className={inputClass}
                  />
                </Field>

                <Field label="WhatsApp number" required hint="Include country code, e.g. +234...">
                  <input
                    type="tel"
                    placeholder="+234 800 000 0000"
                    value={form.whatsapp}
                    onChange={(e) => set("whatsapp", e.target.value)}
                    className={inputClass}
                  />
                </Field>
              </div>

              {/* Role info */}
              <div className="bg-white rounded-2xl border border-[#112369]/8 p-6 md:p-8 flex flex-col gap-5">
                <h2 className="text-sm font-semibold tracking-widest uppercase text-[#112369]/40">
                  Your Career Context
                </h2>

                <Field label="Job field / industry" required>
                  <CustomSelect
                    value={form.jobField}
                    onChange={(val) => set("jobField", val)}
                    options={JOB_FIELDS}
                    placeholder="Select your field"
                  />
                </Field>

                <Field label="Current role or last held position" hint="Leave blank if you're a fresh graduate">
                  <input
                    type="text"
                    placeholder="e.g. Marketing Associate at Flutterwave"
                    value={form.currentRole}
                    onChange={(e) => set("currentRole", e.target.value)}
                    className={inputClass}
                  />
                </Field>

                <Field label="Role or level you're targeting" hint="Helps us pitch the CV's tone correctly">
                  <input
                    type="text"
                    placeholder="e.g. Senior Product Designer, Entry-level Finance roles"
                    value={form.targetRole}
                    onChange={(e) => set("targetRole", e.target.value)}
                    className={inputClass}
                  />
                </Field>
              </div>

              {/* Tier selection */}
              <div className="bg-white rounded-2xl border border-[#112369]/8 p-6 md:p-8 flex flex-col gap-5">
                <h2 className="text-sm font-semibold tracking-widest uppercase text-[#112369]/40">
                  Choose a Package <span className="text-[#4a8fe2]">*</span>
                </h2>

                <div className="flex flex-col gap-3">
                  {CV_TIERS.map((tier) => (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => set("tier", tier.id)}
                      className={`text-left rounded-xl border p-5 transition-all duration-200 ${
                        form.tier === tier.id
                          ? "border-[#4a8fe2] bg-[#4a8fe2]/5"
                          : "border-[#112369]/10 hover:border-[#112369]/25"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-[#112369] text-base">{tier.name}</span>
                        <span className="text-[#4a8fe2] font-semibold text-sm">{tier.price}</span>
                      </div>
                      <p className="text-[#112369]/50 text-xs leading-relaxed mb-3">{tier.desc}</p>
                      <ul className="flex flex-wrap gap-2">
                        {tier.includes.map((item) => (
                          <li
                            key={item}
                            className="text-[10px] font-medium px-2.5 py-1 rounded-full border border-[#112369]/10 text-[#112369]/45"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="bg-white rounded-2xl border border-[#112369]/8 p-6 md:p-8 flex flex-col gap-5">
                <h2 className="text-sm font-semibold tracking-widest uppercase text-[#112369]/40">
                  Anything else?
                </h2>
                <Field label="Additional notes" hint="Specific requirements, style preferences, urgency, etc.">
                  <textarea
                    rows={4}
                    placeholder="e.g. I need this urgently for a Friday deadline, I prefer a minimal dark theme..."
                    value={form.notes}
                    onChange={(e) => set("notes", e.target.value)}
                    className={`${inputClass} resize-none`}
                  />
                </Field>
              </div>

              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

              <button
                onClick={handleSubmit}
                disabled={!isValid || loading}
                className="w-full py-4 rounded-xl bg-[#112369] text-white font-semibold text-sm tracking-wide transition-all duration-200 hover:bg-[#112369]/90 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {loading ? "Sending..." : "Submit Order"}
              </button>

              <p className="text-center text-[#112369]/35 text-xs leading-relaxed">
                No payment yet. We'll reach out on WhatsApp to confirm details and share payment info before we begin.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white rounded-2xl border border-[#112369]/8 p-10 md:p-16 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-[#4a8fe2]/10 flex items-center justify-center mx-auto mb-6">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4a8fe2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h2 className="font-display text-2xl font-semibold text-[#112369] mb-3">Order received.</h2>
              <p className="text-[#112369]/50 text-sm leading-relaxed max-w-sm mx-auto">
                We've got your details and will reach out on WhatsApp within 24 hours. Good things take a little time.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

const inputClass =
  "w-full rounded-lg border border-[#112369]/12 bg-[#f9f8f6] px-4 py-3 text-sm text-[#112369] placeholder:text-[#112369]/30 focus:outline-none focus:border-[#4a8fe2] transition-colors duration-200";

function Field({
  label,
  children,
  hint,
  required,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-[#112369]/60 tracking-wide">
        {label} {required && <span className="text-[#4a8fe2]">*</span>}
      </label>
      {children}
      {hint && <p className="text-[10px] text-[#112369]/35 leading-relaxed">{hint}</p>}
    </div>
  );
}