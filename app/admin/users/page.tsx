"use client";
import { supabase } from "@/app/lib/supabase";
import { useState, useEffect } from "react";

type Profile = {
  id: string;
  email: string;
  role: string;
  created_at: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id ?? null);
      fetchUsers();
    }
    init();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) setError(error.message);
    else setUsers(data ?? []);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    setDeleting(id);
    // Delete from profiles table (auth.users cascade will handle the rest)
    const { error } = await supabase.from("profiles").delete().eq("id", id);
    if (error) {
      setError(error.message);
    } else {
      setUsers((prev) => prev.filter((u) => u.id !== id));
    }
    setDeleting(null);
    setDeleteConfirm(null);
  }

  return (
    <div className="font-body max-w-[1100px]">
      <div className="mb-7">
        <h2 className="font-display font-bold text-2xl text-navy">Users</h2>
        <p className="text-navy/50 text-sm mt-1">{users.length} registered admin{users.length !== 1 ? "s" : ""}</p>
      </div>

      {error && (
        <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-500">{error}</div>
      )}

     <div className="bg-white rounded-2xl border border-navy/[0.07] shadow-sm overflow-hidden">
  {/* Desktop header */}
  <div className="hidden md:grid grid-cols-[1fr_120px_160px_80px] px-6 py-3.5 bg-navy/[0.03] border-b border-navy/[0.07]">
    {["User", "Role", "Joined", ""].map((h) => (
      <span key={h} className="text-[11px] font-semibold text-navy/40 uppercase tracking-wider">{h}</span>
    ))}
  </div>

  {loading ? (
    <div className="flex items-center justify-center py-16 gap-2 text-navy/40 text-sm">
      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
      Loading users...
    </div>
  ) : users.length === 0 ? (
    <p className="text-center py-12 text-navy/35 text-sm">No users found.</p>
  ) : (
    users.map((u, i) => {
      const isCurrentUser = u.id === currentUserId;
      return (
        <div key={u.id} className={i < users.length - 1 ? "border-b border-navy/[0.06]" : ""}>
          {/* Desktop row */}
          <div className="hidden md:grid grid-cols-[1fr_120px_160px_80px] px-6 py-4 items-center hover:bg-navy/[0.02] transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-navy flex items-center justify-center shrink-0">
                <span className="text-white text-[13px] font-semibold">{u.email.charAt(0).toUpperCase()}</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-navy">{u.email}</p>
                {isCurrentUser && <span className="text-[11px] text-blue font-medium">You</span>}
              </div>
            </div>
            <span className="inline-flex items-center text-[12px] font-semibold px-3 py-1 rounded-full w-fit bg-blue/[0.08] text-blue capitalize">
              {u.role}
            </span>
            <p className="text-[13px] text-navy/40">
              {new Date(u.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </p>
            <div>
              {isCurrentUser ? (
                <span className="text-[11px] text-navy/25 italic">—</span>
              ) : deleteConfirm === u.id ? (
                <div className="flex gap-1.5">
                  <button onClick={() => handleDelete(u.id)} disabled={deleting === u.id} className="h-7 px-2.5 rounded-lg bg-red-500 text-white text-xs font-semibold disabled:opacity-50">
                    {deleting === u.id ? "..." : "Confirm"}
                  </button>
                  <button onClick={() => setDeleteConfirm(null)} className="h-7 px-2 rounded-lg bg-navy/[0.06] text-navy/50 text-xs">Cancel</button>
                </div>
              ) : (
                <button onClick={() => setDeleteConfirm(u.id)} className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-400 flex items-center justify-center transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Mobile card */}
          <div className="md:hidden px-5 py-4 hover:bg-navy/[0.02] transition-colors">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full bg-navy flex items-center justify-center shrink-0">
                  <span className="text-white text-[13px] font-semibold">{u.email.charAt(0).toUpperCase()}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-navy truncate">{u.email}</p>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className="inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue/[0.08] text-blue capitalize">{u.role}</span>
                    {isCurrentUser && <span className="text-[11px] text-blue font-medium">You</span>}
                    <span className="text-[11px] text-navy/35">
                      {new Date(u.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                </div>
              </div>
              <div className="shrink-0">
                {isCurrentUser ? (
                  <span className="text-[11px] text-navy/25 italic">—</span>
                ) : deleteConfirm === u.id ? (
                  <div className="flex gap-1.5">
                    <button onClick={() => handleDelete(u.id)} disabled={deleting === u.id} className="h-7 px-2.5 rounded-lg bg-red-500 text-white text-xs font-semibold disabled:opacity-50">
                      {deleting === u.id ? "..." : "Confirm"}
                    </button>
                    <button onClick={() => setDeleteConfirm(null)} className="h-7 px-2 rounded-lg bg-navy/[0.06] text-navy/50 text-xs">Cancel</button>
                  </div>
                ) : (
                  <button onClick={() => setDeleteConfirm(u.id)} className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-400 flex items-center justify-center transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    })
  )}
</div>
    </div>
  );
}