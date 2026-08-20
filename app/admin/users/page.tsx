"use client";
import { supabase } from "@/app/lib/supabase";
import { useState, useEffect } from "react";
import { Loader2, Trash2 } from "lucide-react";

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
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    async function init() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      setCurrentUserId(user.id);

      const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      setIsSuperAdmin(data?.role === "super_admin");

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
    const res = await fetch("/api/delete-user", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });
    const result = await res.json();
    if (result.error) {
      setError(result.error);
    } else {
      setUsers((prev) => prev.filter((u) => u.id !== id));
    }
    setDeleting(null);
    setDeleteConfirm(null);
  }

  return (
    <div className="font-body max-w-[1100px] px-1 sm:px-4 py-4">
      <div className="mb-6 px-1 sm:px-0">
        <h2 className="font-display font-bold text-xl sm:text-2xl text-navy">
          Users
        </h2>
        <p className="text-navy/50 text-xs sm:text-sm mt-0.5">
          {users.length} registered admin{users.length !== 1 ? "s" : ""}
        </p>
      </div>

      {error && (
        <div className="mb-5 px-3 py-2.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-500">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16 gap-2 text-navy/40 text-xs font-medium">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading users...
        </div>
      ) : users.length === 0 ? (
        <p className="text-center py-12 text-navy/35 text-xs">
          No users found.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {users.map((u) => {
            const isCurrentUser = u.id === currentUserId;
            return (
              <div
                key={u.id}
                className="bg-white rounded-xl border border-navy/[0.08] p-3 sm:p-4 flex flex-col justify-between gap-4 shadow-sm hover:border-navy/20 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-navy flex items-center justify-center shrink-0">
                      <span className="text-white text-xs font-semibold">
                        {u.email.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p
                        className="text-xs sm:text-sm font-semibold text-navy truncate"
                        title={u.email}
                      >
                        {u.email}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue/[0.08] text-blue capitalize">
                          {u.role}
                        </span>
                        {isCurrentUser && (
                          <span className="text-[10px] text-blue font-semibold">
                            You
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-navy/[0.06] mt-auto">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-navy/40">Joined</span>
                    <span className="text-xs text-navy/70 font-medium">
                      {new Date(u.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <div>
                    {isCurrentUser ? (
                      <span className="text-xs text-navy/25 italic">—</span>
                    ) : !isSuperAdmin ? null : deleteConfirm === u.id ? (
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleDelete(u.id)}
                          disabled={deleting === u.id}
                          className="h-7 px-2 rounded-md bg-red-500 text-white text-xs font-semibold disabled:opacity-50"
                        >
                          {deleting === u.id ? "..." : "Confirm"}
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="h-7 px-2 rounded-md bg-navy/[0.06] text-navy/60 text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(u.id)}
                        className="w-7 h-7 rounded-md bg-red-50 hover:bg-red-100 text-red-400 flex items-center justify-center transition-colors"
                        title="Delete User"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
