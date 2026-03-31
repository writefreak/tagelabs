"use client";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/app/lib/supabase";

type Review = {
  id: string;
  name: string;
  role: string;
  review: string;
};

const fallback: Review[] = [
  { id: "1", name: "Amara Okafor", role: "Founder, Studio Amara", review: "TageLabs completely transformed how our brand shows up online. Every pixel felt intentional. Delivered ahead of schedule too." },
  { id: "2", name: "Tunde Fasanya", role: "Product Designer", review: "I needed a portfolio that reflected the quality of my work. The result was cleaner and sharper than anything I imagined." },
  { id: "3", name: "Claire Mensah", role: "Senior UX Designer", review: "My CV went from getting ignored to landing three interviews in a week. Strategic, not just aesthetic." },
  { id: "4", name: "Emeka Nwosu", role: "CTO, BrandNG", review: "Clean code, zero hand-holding, polished on first delivery. Will work with them again without hesitation." },
  { id: "5", name: "Zara Abioye", role: "Startup Founder", review: "A pitch deck that made investors lean forward. Minimal, powerful, and done in three days." },
  { id: "6", name: "Seun Adeyemi", role: "Creative Director", review: "They think before they build. The landing page didn't just look good — it converted. That's rare." },
  { id: "7", name: "Seun Adeyemi", role: "Creative Director", review: "They think before they build. The landing page didn't just look good — it converted. That's rare." },
  { id: "8", name: "Seun Adeyemi", role: "Creative Director", review: "They think before they build. The landing page didn't just look good — it converted. That's rare." },
  { id: "9", name: "Seun Adeyemi", role: "Creative Director", review: "They think before they build. The landing page didn't just look good — it converted. That's rare." },
];

const PAGE_SIZE = 6;
const emptyForm = { name: "", role: "", review: "" };

const inputClass = "w-full bg-navy/[0.03] border border-navy/10 rounded-xl px-4 py-3 text-navy text-sm font-body placeholder:text-navy/30 focus:outline-none focus:border-blue transition-colors";

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [page, setPage] = useState(0);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchReviews() {
      const { data } = await supabase
        .from("reviews")
        .select("id, name, role, review")
        .eq("approved", true)
        .order("created_at", { ascending: false });
      setReviews(data && data.length >= 3 ? data : fallback);
    }
    fetchReviews();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.review) return;
    setSubmitting(true);
    setError(null);
    const { error } = await supabase.from("reviews").insert({
      name: form.name,
      role: form.role,
      review: form.review,
      approved: false,
    });
    setSubmitting(false);
    if (error) setError("Something went wrong. Please try again.");
    else { setSubmitted(true); setForm(emptyForm); }
  }

  const displayed = reviews.length > 0 ? reviews : fallback;
  const totalPages = Math.ceil(displayed.length / PAGE_SIZE);
  const paginated = displayed.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);
  const showPagination = displayed.length > PAGE_SIZE;

  function handlePageChange(next: number) {
    setPage(next);
    // Scroll the reviews section into view smoothly on page change
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  return (
    <section id="reviews" className="py-14 md:py-17 px-6 bg-white">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-blue text-sm font-medium tracking-widest uppercase mb-4 font-body">
            Client Reviews
          </p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-navy max-w-md leading-tight">
              Words from people we've built for.
            </h2>
            <p className="font-body text-navy/45 text-sm max-w-xs leading-relaxed">
              Real feedback from clients across design, development, and everything in between.
            </p>
          </div>
        </motion.div>

        {/* Reviews — horizontal scroll on mobile, grid on md+ */}
        <div ref={scrollRef}>
          {/* Mobile: horizontal scroll strip */}
          <div
            className="
              md:hidden
              flex gap-4
              overflow-x-auto
              
              -mx-2 px-6
              [scrollbar-width:none]
              [&::-webkit-scrollbar]:hidden
              snap-x snap-mandatory
            "
          >
            {paginated.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: "-30px" }}
                transition={{ delay: i * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="
                  flex-none w-[80vw] max-w-[320px]
                  snap-start
                  bg-white rounded-2xl p-6 flex flex-col gap-4
                  border border-navy/[0.07]
                "
              >
                <ReviewCardInner r={r} />
              </motion.div>
            ))}
          </div>

          {/* Desktop: grid */}
          <div className="hidden md:grid md:grid-cols-3 gap-4">
            {paginated.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: "-30px" }}
                transition={{ delay: i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="bg-white rounded-2xl p-6 flex flex-col gap-4 border border-navy/[0.07] hover:border-navy/15 hover:-translate-y-0.5 hover:shadow-sm transition-all duration-300"
              >
                <ReviewCardInner r={r} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Pagination breadcrumbs — only when more than PAGE_SIZE reviews */}
        {showPagination && (
          <div className="flex items-center justify-center gap-2 mt-10">
            {/* Prev arrow */}
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 0}
              aria-label="Previous page"
              className="w-8 h-8 flex items-center justify-center rounded-full border border-navy/10 text-navy/40 hover:border-navy/30 hover:text-navy disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-200"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            {/* Dots */}
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i)}
                aria-label={`Page ${i + 1}`}
                className={`
                  rounded-full transition-all duration-300
                  ${i === page
                    ? "w-6 h-2 bg-navy"
                    : "w-2 h-2 bg-navy/20 hover:bg-navy/40"
                  }
                `}
              />
            ))}

            {/* Next arrow */}
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages - 1}
              aria-label="Next page"
              className="w-8 h-8 flex items-center justify-center rounded-full border border-navy/10 text-navy/40 hover:border-navy/30 hover:text-navy disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-200"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        )}

        {/* Divider */}
        <div className="h-px bg-navy/[0.07] my-10 md:mt-20 md:mb-20" />

        {/* Submit form */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="grid md:grid-cols-2 gap-12 items-start"
        >
          {/* Left copy */}
          <div>
            <h3 className="font-display text-2xl md:text-3xl font-semibold text-navy leading-tight mb-3">
              Worked with us?<br />Tell the world.
            </h3>
            <p className="font-body text-sm text-navy/50 leading-relaxed max-w-sm">
              Every project we take on is built on trust and hearing from the people we've built for means everything to us.
            </p>
          </div>

          {/* Right form */}
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-3 py-4"
              >
                <div className="w-11 h-11 rounded-full bg-navy/[0.06] flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#112369" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h4 className="font-display font-semibold text-lg text-navy">Thanks for sharing.</h4>
                <p className="font-body text-sm text-navy/50">Your review is pending approval and will appear shortly.</p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-sm text-blue font-medium font-body hover:underline w-fit mt-1"
                >
                  Leave another →
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="flex flex-col gap-4"
              >
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-body text-xs text-navy/50 mb-2 tracking-wide">Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="John Doe"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block font-body text-xs text-navy/50 mb-2 tracking-wide">Role</label>
                    <input
                      type="text"
                      placeholder="Founder, Acme Co."
                      value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-body text-xs text-navy/50 mb-2 tracking-wide">Your review *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Share your experience working with TageLabs..."
                    value={form.review}
                    onChange={(e) => setForm({ ...form, review: e.target.value })}
                    className={`${inputClass} resize-none`}
                  />
                </div>

                {error && <p className="text-sm text-red-400 font-body">{error}</p>}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-navy hover:bg-blue disabled:opacity-50 text-white font-medium py-3 rounded-full text-sm transition-colors duration-200 font-body"
                >
                  {submitting ? "Submitting..." : "Submit Review →"}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
}

// Extracted card inner so it's shared between mobile/desktop layouts
function ReviewCardInner({ r }: { r: Review }) {
  return (
    <>
      {/* Stars */}
      <div className="flex gap-1">
        {[...Array(5)].map((_, j) => (
          <svg key={j} width="12" height="12" viewBox="0 0 24 24" fill="#4a8fe2" stroke="none">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        ))}
      </div>

      <p className="font-body text-sm text-navy/65 leading-relaxed flex-1">
        "{r.review}"
      </p>

      <div className="h-px bg-navy/[0.06]" />

      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-navy flex items-center justify-center shrink-0">
          <span className="text-white text-xs font-semibold font-display">{r.name.charAt(0)}</span>
        </div>
        <div>
          <p className="text-[13px] font-semibold text-navy font-body">{r.name}</p>
          <p className="text-[11px] text-navy/40 font-body mt-0.5">{r.role}</p>
        </div>
      </div>
    </>
  );
}