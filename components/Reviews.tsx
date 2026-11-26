"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import type { MotionValue } from "framer-motion";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  MessageSquarePlus,
  Quote,
  Star,
  X,
} from "lucide-react";
import { supabase } from "@/app/lib/supabase";

type Review = {
  id: string;
  name: string;
  role: string;
  review: string;
};

const fallback: Review[] = [
  {
    id: "1",
    name: "Amara Okafor",
    role: "Founder, Studio Amara",
    review:
      "TageLabs completely transformed how our brand shows up online. Every pixel felt intentional. Delivered ahead of schedule too.",
  },
  {
    id: "2",
    name: "Tunde Fasanya",
    role: "Product Designer",
    review:
      "I needed a portfolio that reflected the quality of my work. The result was cleaner and sharper than anything I imagined.",
  },
  {
    id: "3",
    name: "Claire Mensah",
    role: "Senior UX Designer",
    review:
      "My CV went from getting ignored to landing three interviews in a week. Strategic, not just aesthetic.",
  },
  {
    id: "4",
    name: "Emeka Nwosu",
    role: "CTO, BrandNG",
    review:
      "Clean code, zero hand-holding, polished on first delivery. Will work with them again without hesitation.",
  },
  {
    id: "5",
    name: "Zara Abioye",
    role: "Startup Founder",
    review:
      "A pitch deck that made investors lean forward. Minimal, powerful, and done in three days.",
  },
  {
    id: "6",
    name: "Seun Adeyemi",
    role: "Creative Director",
    review:
      "They think before they build. The landing page didn't just look good, it converted. That's rare.",
  },
];

const SCROLL_PER_REVIEW_VH = 55;
const HOLD_RATIO = 0.45;
const emptyForm = { name: "", role: "", review: "" };

const inputClass =
  "w-full bg-navy/[0.03] border border-navy/10 rounded-xl px-4 py-3 text-navy text-sm font-body placeholder:text-navy/30 focus:outline-none focus:border-blue transition-colors";

function ReviewCardPanel({
  item,
  index,
  total,
  progress,
  hold,
}: {
  item: Review;
  index: number;
  total: number;
  progress: MotionValue<number>;
  hold: number;
}) {
  const first = index === 0;
  const last = index === total - 1;
  const segment = 1 / total;

  const inRange = first
    ? [0, 0.001]
    : [(index - 1) * segment + segment * hold, index * segment];
  const inOut = first ? [1, 1] : [0, 1];

  const outRange = last
    ? [0.998, 1]
    : [index * segment + segment * hold, (index + 1) * segment];
  const outOut = last ? [1, 1] : [1, 0];

  const enter = useTransform(progress, inRange, inOut);
  const exit = useTransform(progress, outRange, outOut);

  const clip = useTransform(enter, (v) => `inset(${(1 - v) * 100}% 0% 0% 0%)`);
  const cardScale = useTransform(enter, [0, 1], [1.06, 1]);
  const textY = useTransform(enter, [0, 1], [36, 0]);
  const textOpacity = useTransform(enter, [0.3, 1], [0, 1]);
  const panelScale = useTransform(exit, [0, 1], [0.94, 1]);
  const dim = useTransform(exit, [0, 1], [0.5, 0]);

  return (
    <motion.div
      className="absolute inset-0 flex items-center"
      style={{ zIndex: index + 1, scale: panelScale }}
    >
      <motion.article
        className="relative flex h-full w-full flex-col overflow-hidden rounded-xl bg-navy p-6 text-white shadow-[0_24px_60px_rgba(0,18,110,0.28)] md:p-9"
        style={{ clipPath: clip, scale: cardScale }}
      >
        <Quote
          aria-hidden
          strokeWidth={1.5}
          className="absolute right-5 top-5 h-14 w-14 text-white/[0.06] md:h-24 md:w-24"
        />

        <motion.div
          className="relative flex h-full flex-col"
          style={{ y: textY, opacity: textOpacity }}
        >
          <div className="flex gap-1">
            {[...Array(5)].map((_, j) => (
              <Star
                key={j}
                className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500"
                strokeWidth={0}
              />
            ))}
          </div>

          <blockquote className="mt-4 line-clamp-6 font-display text-sm font-medium leading-relaxed md:mt-5 md:line-clamp-5 md:text-lg md:leading-relaxed">
            {item.review}
          </blockquote>

          <div className="mt-auto flex items-center gap-3 pt-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 font-display text-sm font-semibold">
              {item.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="truncate font-body text-sm font-semibold">
                {item.name}
              </p>
              {item.role && (
                <p className="mt-0.5 truncate font-body text-xs text-white/55">
                  {item.role}
                </p>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-3xl bg-navy"
          style={{ opacity: dim }}
        />
      </motion.article>
    </motion.div>
  );
}

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [active, setActive] = useState(0);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const pinTrackRef = useRef<HTMLDivElement>(null);

  const displayed = reviews.length > 0 ? reviews : fallback;
  const total = displayed.length;
  const safeActive = Math.min(active, total - 1);

  const { scrollYProgress } = useScroll({
    target: pinTrackRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    const next = Math.min(total - 1, Math.max(0, Math.floor(progress * total)));
    setActive((prev) => (next === prev ? prev : next));
  });

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

  useEffect(() => {
    document.body.style.overflow = formOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [formOpen]);

  function goTo(index: number) {
    const track = pinTrackRef.current;
    if (!track) return;
    const normalized = ((index % total) + total) % total;
    const targetProgress = (normalized + 0.5) / total;
    const distance = Math.max(0, track.offsetHeight - window.innerHeight);
    const top =
      track.getBoundingClientRect().top +
      window.scrollY +
      distance * targetProgress;
    window.scrollTo({ top, behavior: "smooth" });
  }

  function closeForm() {
    setFormOpen(false);
    setSubmitted(false);
    setError(null);
  }

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
    if (error) {
      setError("Something went wrong. Please try again.");
      return;
    }
    setSubmitted(true);
    setForm(emptyForm);
  }

  return (
    <section ref={sectionRef} id="reviews" className="relative bg-white">
      {/* Section enters naturally first, then pinTrackRef drives the scroll-linked card deck */}
      <div className="px-6 pt-20 pb-2 md:px-14 md:pt-28 md:pb-3">
        <motion.div
          className="mx-auto flex max-w-xl flex-col gap-2 md:text-center md:items-center md:gap-3"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="font-display text-3xl font-semibold leading-tight text-navy md:text-5xl">
            Client Testimonials
          </h2>
          {/* <p className="font-sans text-xs leading-relaxed text-neutral-600 md:text-sm">
            Hearing from the people we have worked with helps us know if we're
            doing our job well
          </p> */}
        </motion.div>
      </div>

      <div
        ref={pinTrackRef}
        className="relative"
        style={{ height: `${100 + total * SCROLL_PER_REVIEW_VH}vh` }}
      >
        <div className="sticky top-0 flex flex-col justify-start px-6 pt-4 pb-16 md:items-center md:px-14 md:pt-6 md:pb-20">
          <div className="w-full max-w-3xl">
            <div className="relative min-h-72 w-full md:min-h-80 rounded-xl">
              {displayed.map((item, idx) => (
                <ReviewCardPanel
                  key={item.id}
                  item={item}
                  index={idx}
                  total={total}
                  progress={scrollYProgress}
                  hold={HOLD_RATIO}
                />
              ))}
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3 md:gap-4">
                <button
                  type="button"
                  onClick={() => goTo(safeActive - 1)}
                  aria-label="Previous review"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-navy/15 text-navy/60 transition-colors duration-300 hover:bg-navy hover:text-white"
                >
                  <ChevronLeft size={16} />
                </button>

                <button
                  type="button"
                  onClick={() => goTo(safeActive + 1)}
                  aria-label="Next review"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-navy/15 text-navy/60 transition-colors duration-300 hover:bg-navy hover:text-white"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              <button
                type="button"
                onClick={() => setFormOpen(true)}
                className="inline-flex items-center gap-2 rounded-2xl border border-navy/15 px-4 py-2.5 font-body text-sm font-medium text-navy transition-colors duration-300 hover:bg-navy hover:text-white md:px-5"
              >
                <MessageSquarePlus size={15} />
                Leave a review
              </button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {formOpen && (
          <>
            <motion.div
              key="form-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeForm}
              className="fixed inset-0 z-50 bg-navy/40 backdrop-blur-sm"
            />

            <motion.div
              key="form-dialog"
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center px-6"
            >
              <div className="pointer-events-auto relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl md:p-8">
                <button
                  type="button"
                  onClick={closeForm}
                  aria-label="Close"
                  className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-2xl border border-navy/10 text-navy/40 transition-all duration-200 hover:border-navy/25 hover:text-navy"
                >
                  <X size={14} />
                </button>

                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center gap-3 py-2"
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-navy/[0.06]">
                        <Check size={20} className="text-navy" />
                      </div>
                      <h4 className="font-display text-lg font-semibold text-navy">
                        Thanks for sharing.
                      </h4>
                      <p className="font-body text-sm text-navy/50">
                        Your review is pending approval and will appear shortly.
                      </p>
                      <button
                        type="button"
                        onClick={() => setSubmitted(false)}
                        className="mt-1 flex w-fit items-center gap-2 font-body text-sm font-medium text-blue hover:underline"
                      >
                        Leave another <ArrowRight size={12} />
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
                      <div className="pr-8">
                        <h3 className="font-display text-2xl font-semibold leading-tight text-navy">
                          Worked with us? Tell the world.
                        </h3>
                        <p className="mt-2 font-body text-xs leading-relaxed text-neutral-600 md:text-sm">
                          Every project we accept is built on client trust, and
                          hearing from the people we have built for means
                          everything to us.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                          <label className="mb-2 block font-body text-xs tracking-wide text-navy/50">
                            Name *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="John Doe"
                            value={form.name}
                            onChange={(e) =>
                              setForm({ ...form, name: e.target.value })
                            }
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className="mb-2 block font-body text-xs tracking-wide text-navy/50">
                            Role
                          </label>
                          <input
                            type="text"
                            placeholder="Founder, Acme Co."
                            value={form.role}
                            onChange={(e) =>
                              setForm({ ...form, role: e.target.value })
                            }
                            className={inputClass}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-2 block font-body text-xs tracking-wide text-navy/50">
                          Your review *
                        </label>
                        <textarea
                          required
                          rows={4}
                          placeholder="Share your experience working with TageLabs..."
                          value={form.review}
                          onChange={(e) =>
                            setForm({ ...form, review: e.target.value })
                          }
                          className={`${inputClass} resize-none`}
                        />
                      </div>

                      {error && (
                        <p className="font-body text-sm text-red-400">
                          {error}
                        </p>
                      )}

                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full rounded-2xl bg-navy py-3 font-body text-sm font-medium text-white transition-colors duration-200 hover:bg-blue disabled:opacity-50"
                      >
                        {submitting ? "Submitting..." : "Submit Review"}
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
