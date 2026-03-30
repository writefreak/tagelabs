"use client";
import { supabase } from "@/app/lib/supabase";
import { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", service: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const services = [
    "Landing Page Design",
    "CV & Portfolio Optimization",
    "Minimalist Graphics",
    "Frontend Development",
    "Other",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError(null);

    const { error } = await supabase.from("contacts").insert({
      name: form.name,
      email: form.email,
      subject: form.service,
      message: form.message,
      read: false,
    });

    setSending(false);

    if (error) {
      setError("Something went wrong. Please try again.");
    } else {
      setSent(true);
    }
  };

  return (
    <section
      id="contact"
      className="py-28 px-6"
      style={{ background: "#112369" }}
    >
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20">
        {/* Left */}
        <div>
          <p className="text-blue text-sm font-medium tracking-widest uppercase mb-4 font-body">
            Get in touch
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-white leading-tight mb-6">
            Ready to build something great?
          </h2>
          <p className="font-body text-white/50 text-sm leading-relaxed mb-10">
            Tell us what you need and we'll get back to you within 24 hours.
          </p>

          <div className="flex flex-col gap-4">
            <a
              href="mailto:tagelabstudios@gmail.com"
              className="font-body text-sm text-white/70 hover:text-blue transition-colors"
            >
              tagelabstudios@gmail.com
            </a>
            <a
              href="tel:+2349169615448"
              className="font-body text-sm text-white/70 hover:text-blue transition-colors"
            >
              +234 916 961 5448
            </a>
            <p className="font-body text-sm text-white/70">
              Port Harcourt, Nigeria · Available globally
            </p>
          </div>
        </div>

        {/* Form */}
        <div>
          {sent ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-16 h-16 rounded-full bg-blue/20 flex items-center justify-center mb-4">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4a8fe2" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h3 className="font-display text-2xl font-semibold text-white mb-2">Message sent.</h3>
              <p className="font-body text-white/50 text-sm">We'll be in touch within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {[
                { id: "name", label: "Full name", type: "text", placeholder: "John Doe" },
                { id: "email", label: "Email address", type: "email", placeholder: "john@company.com" },
              ].map((f) => (
                <div key={f.id}>
                  <label className="block font-body text-xs text-white/50 mb-2 tracking-wide">
                    {f.label}
                  </label>
                  <input
                    type={f.type}
                    placeholder={f.placeholder}
                    required
                    value={form[f.id as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [f.id]: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-body placeholder:text-white/20 focus:outline-none focus:border-blue transition-colors"
                  />
                </div>
              ))}

              <div>
                <label className="block font-body text-xs text-white/50 mb-2 tracking-wide">
                  Service needed
                </label>
                <select
                  required
                  value={form.service}
                  onChange={(e) => setForm({ ...form, service: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-body focus:outline-none focus:border-blue transition-colors"
                >
                  <option value="" disabled className="bg-navy">Select a service</option>
                  {services.map((s) => (
                    <option key={s} value={s} className="bg-navy">{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-body text-xs text-white/50 mb-2 tracking-wide">
                  Tell us about your project
                </label>
                <textarea
                  rows={4}
                  placeholder="Brief description of what you need..."
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-body placeholder:text-white/20 focus:outline-none focus:border-blue transition-colors resize-none"
                />
              </div>

              {error && (
                <p className="text-red-400 text-sm font-body">{error}</p>
              )}

              <button
                type="submit"
                disabled={sending}
                className="w-full bg-blue text-white font-medium py-4 rounded-full text-sm hover:bg-white hover:text-navy transition-colors duration-200 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {sending ? "Sending..." : "Send message →"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}