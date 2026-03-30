"use client";
import { supabase } from "@/app/lib/supabase";
import { useState, useEffect } from "react";

type Contact = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  created_at: string;
};

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Contact | null>(null);
  const [filter, setFilter] = useState<"All" | "Unread" | "Read">("All");
  const [search, setSearch] = useState("");

  useEffect(() => { fetchContacts(); }, []);

  async function fetchContacts() {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("contacts")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) setError(error.message);
    else setContacts(data ?? []);
    setLoading(false);
  }

  async function handleSelect(contact: Contact) {
    setSelected(contact);
    if (!contact.read) {
      await supabase.from("contacts").update({ read: true }).eq("id", contact.id);
      setContacts((prev) => prev.map((c) => c.id === contact.id ? { ...c, read: true } : c));
    }
  }

  async function handleDelete(id: string) {
    const { error } = await supabase.from("contacts").delete().eq("id", id);
    if (error) setError(error.message);
    else {
      setContacts((prev) => prev.filter((c) => c.id !== id));
      if (selected?.id === id) setSelected(null);
    }
  }

  const filtered = contacts.filter((c) => {
    const matchFilter = filter === "All" || (filter === "Unread" && !c.read) || (filter === "Read" && c.read);
    const matchSearch = search === "" || c.name.toLowerCase().includes(search.toLowerCase()) || c.subject?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const unreadCount = contacts.filter((c) => !c.read).length;

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  }

  return (
    <div className="font-body max-w-[1100px]">
      <div className="mb-7">
        <h2 className="font-display font-bold text-2xl text-navy">Contact Submissions</h2>
        <p className="text-navy/50 text-sm mt-1">
          {contacts.length} total · {unreadCount > 0 ? `${unreadCount} unread` : "all caught up ✓"}
        </p>
      </div>

      {error && (
        <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-500">{error}</div>
      )}

      {/* Filters + Search */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="flex gap-2">
          {(["All", "Unread", "Read"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[13px] font-medium transition-all duration-200 ${
                filter === f ? "bg-navy text-white" : "bg-white text-navy/50 border border-navy/10 hover:border-navy/25"
              }`}
            >
              {f}
              {f === "Unread" && unreadCount > 0 && (
                <span className={`text-[11px] font-bold px-1.5 rounded-full ${filter === "Unread" ? "bg-white/25 text-white" : "bg-blue text-white"}`}>
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 bg-white border border-navy/10 rounded-xl px-3.5 py-2 max-w-xs flex-1">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-navy/35 shrink-0">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or subject..."
            className="border-none outline-none bg-transparent text-[13px] text-navy w-full font-body placeholder:text-navy/35"
          />
        </div>
      </div>

      {/* Split view */}
      <div className={`grid gap-4 ${selected ? "grid-cols-1 lg:grid-cols-[380px_1fr]" : "grid-cols-1"}`}>

        {/* List */}
        <div className="bg-white rounded-2xl border border-navy/[0.07] shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16 gap-2 text-navy/40 text-sm">
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              Loading messages...
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center py-12 text-navy/35 text-sm">No submissions found.</p>
          ) : (
            filtered.map((c, i) => (
              <div
                key={c.id}
                onClick={() => handleSelect(c)}
                className={`px-5 py-4 cursor-pointer transition-colors border-l-[3px] ${
                  i < filtered.length - 1 ? "border-b border-navy/[0.06]" : ""
                } ${
                  selected?.id === c.id
                    ? "bg-blue/[0.07] border-l-blue"
                    : c.read
                    ? "bg-transparent border-l-transparent hover:bg-navy/[0.02]"
                    : "bg-blue/[0.04] border-l-transparent hover:bg-blue/[0.07]"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-navy flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-white text-sm font-semibold">{c.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <p className={`text-[13px] truncate ${c.read ? "font-medium text-navy" : "font-bold text-navy"}`}>{c.name}</p>
                      {!c.read && <span className="w-1.5 h-1.5 rounded-full bg-blue shrink-0" />}
                    </div>
                    <p className={`text-[13px] mt-0.5 truncate ${c.read ? "text-navy/45 font-normal" : "text-navy font-semibold"}`}>{c.subject}</p>
                    <p className="text-xs text-navy/35 mt-1 truncate">{c.message}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Detail */}
        {selected && (
          <div className="bg-white rounded-2xl border border-navy/[0.07] shadow-sm p-7 flex flex-col">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full bg-navy flex items-center justify-center">
                  <span className="text-white text-lg font-semibold">{selected.name.charAt(0)}</span>
                </div>
                <div>
                  <h3 className="font-display font-semibold text-lg text-navy">{selected.name}</h3>
                  <a href={`mailto:${selected.email}`} className="text-[13px] text-blue hover:underline">{selected.email}</a>
                </div>
              </div>
              <div className="flex gap-2">
                <a
                  href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}
                  className="flex items-center gap-1.5 bg-navy hover:bg-blue text-white text-[13px] font-semibold px-4 py-2 rounded-xl transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  Reply
                </a>
                <button onClick={() => handleDelete(selected.id)} className="w-9 h-9 rounded-xl bg-red-50 hover:bg-red-100 text-red-400 flex items-center justify-center transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2" />
                  </svg>
                </button>
                <button onClick={() => setSelected(null)} className="w-9 h-9 rounded-xl bg-navy/[0.06] hover:bg-navy/10 text-navy/50 flex items-center justify-center transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="h-px bg-navy/[0.07] mb-6" />

            <div className="mb-5">
              <p className="text-[11px] uppercase tracking-wider font-semibold text-navy/40 mb-1.5">Subject</p>
              <p className="font-display font-semibold text-navy text-lg">{selected.subject}</p>
              <p className="text-xs text-navy/35 mt-1.5">{formatDate(selected.created_at)}</p>
            </div>

            <div className="bg-navy/[0.02] rounded-xl p-5 border border-navy/[0.06]">
              <p className="text-sm text-navy leading-relaxed">{selected.message}</p>
            </div>

            <p className="text-xs text-navy/35 text-center mt-auto pt-6">
              Click <strong>Reply</strong> to respond via your email client.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}