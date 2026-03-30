"use client";
import { supabase } from "@/app/lib/supabase";
import { useState, useEffect } from "react";

type Review = {
  id: string;
  name: string;
  role: string;
  review: string;
  approved: boolean;
  created_at: string;
};

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"All" | "Approved" | "Pending">("All");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => { fetchReviews(); }, []);

  async function fetchReviews() {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) setError(error.message);
    else setReviews(data ?? []);
    setLoading(false);
  }

  async function handleApprove(id: string, current: boolean) {
    const { error } = await supabase
      .from("reviews")
      .update({ approved: !current })
      .eq("id", id);
    if (error) setError(error.message);
    else setReviews((prev) =>
      prev.map((r) => r.id === id ? { ...r, approved: !current } : r)
    );
  }

  async function handleDelete(id: string) {
    const { error } = await supabase.from("reviews").delete().eq("id", id);
    if (error) setError(error.message);
    else setReviews((prev) => prev.filter((r) => r.id !== id));
    setDeleteConfirm(null);
  }

  const filtered = reviews.filter((r) =>
    filter === "All" ? true : filter === "Approved" ? r.approved : !r.approved
  );

  const pendingCount = reviews.filter((r) => !r.approved).length;

  return (
    <div className="font-body max-w-[1100px]">

      {/* Header */}
      <div className="mb-7">
        <h2 className="font-display font-bold text-2xl text-navy">Reviews</h2>
        <p className="text-navy/50 text-sm mt-1">
          {reviews.length} total · {pendingCount} pending approval
        </p>
      </div>

      {error && (
        <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-500">{error}</div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {(["All", "Pending", "Approved"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[13px] font-medium transition-all duration-200 ${
              filter === f ? "bg-navy text-white" : "bg-white text-navy/50 border border-navy/10 hover:border-navy/25"
            }`}
          >
            {f}
            {f === "Pending" && pendingCount > 0 && (
              <span className={`text-[11px] font-bold px-1.5 rounded-full ${filter === "Pending" ? "bg-white/25 text-white" : "bg-blue text-white"}`}>
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-navy/[0.07] shadow-sm overflow-hidden">
        <div className="grid grid-cols-[1fr_180px_100px_110px] px-6 py-3.5 bg-navy/[0.03] border-b border-navy/[0.07]">
          {["Review", "Author", "Status", "Actions"].map((h) => (
            <span key={h} className="text-[11px] font-semibold text-navy/40 uppercase tracking-wider">{h}</span>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 gap-2 text-navy/40 text-sm">
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
            Loading reviews...
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center py-12 text-navy/35 text-sm">No reviews found.</p>
        ) : (
          filtered.map((r, i) => (
            <div
              key={r.id}
              className={`grid grid-cols-[1fr_180px_100px_110px] px-6 py-4 items-start hover:bg-navy/[0.02] transition-colors ${
                i < filtered.length - 1 ? "border-b border-navy/[0.06]" : ""
              }`}
            >
              {/* Review text */}
              <div className="pr-6">
                <p className="text-sm text-navy/70 leading-relaxed line-clamp-2">"{r.review}"</p>
                <p className="text-[11px] text-navy/35 mt-1.5">
                  {new Date(r.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </p>
              </div>

              {/* Author */}
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-navy flex items-center justify-center shrink-0">
                  <span className="text-white text-[12px] font-semibold">{r.name.charAt(0)}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold text-navy truncate">{r.name}</p>
                  <p className="text-[11px] text-navy/40 truncate">{r.role}</p>
                </div>
              </div>

              {/* Status badge */}
              <div>
                <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                  r.approved
                    ? "bg-green-100 text-green-600"
                    : "bg-amber-50 text-amber-500"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${r.approved ? "bg-green-500" : "bg-amber-400"}`} />
                  {r.approved ? "Approved" : "Pending"}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {/* Approve / Unapprove toggle */}
                <button
                  onClick={() => handleApprove(r.id, r.approved)}
                  title={r.approved ? "Unapprove" : "Approve"}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                    r.approved
                      ? "bg-navy/[0.06] hover:bg-navy/[0.12] text-navy/50"
                      : "bg-green-50 hover:bg-green-100 text-green-500"
                  }`}
                >
                  {r.approved ? (
                    // X / unapprove
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  ) : (
                    // Checkmark / approve
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>

                {/* Delete */}
                {deleteConfirm === r.id ? (
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="h-8 px-2.5 rounded-lg bg-red-500 text-white text-xs font-semibold"
                  >
                    Confirm
                  </button>
                ) : (
                  <button
                    onClick={() => setDeleteConfirm(r.id)}
                    className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-400 flex items-center justify-center transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}