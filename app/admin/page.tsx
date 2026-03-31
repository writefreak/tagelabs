"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/app/lib/supabase";

type Contact = { id: string; name: string; email: string; subject: string; read: boolean; created_at: string; };
type Project = { id: string; title: string; category: string; status: "Published" | "Draft"; created_at: string; };

export default function AdminDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [userCount, setUserCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      const [{ data: p }, { data: c }, { count }] = await Promise.all([
        supabase.from("projects").select("id, title, category, status, created_at").order("created_at", { ascending: false }),
        supabase.from("contacts").select("id, name, email, subject, read, created_at").order("created_at", { ascending: false }),
        supabase.from("profiles").select("*", { count: "exact", head: true }),
      ]);
      setProjects(p ?? []);
      setContacts(c ?? []);
      setUserCount(count ?? 0);
      setLoading(false);
    }
    fetchAll();
  }, []);

  const published = projects.filter((p) => p.status === "Published").length;
  const unread = contacts.filter((c) => !c.read).length;

  const stats = [
    {
      label: "Total Projects", value: projects.length,
      change: `${published} published`, href: "/admin/projects",
      iconBg: "bg-blue/10", iconColor: "text-blue",
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>,
    },
    {
      label: "Contact Submissions", value: contacts.length,
      change: `${unread} unread`, href: "/admin/contacts",
      iconBg: "bg-navy/10", iconColor: "text-navy",
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>,
    },
    {
      label: "Unread Messages", value: unread,
      change: unread > 0 ? "Needs attention" : "All caught up ✓", href: "/admin/contacts",
      iconBg: "bg-red-100", iconColor: "text-red-400",
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>,
    },
    {
      label: "Admin Users", value: userCount,
      change: "Registered admins", href: "/admin/users",
      iconBg: "bg-green-100", iconColor: "text-green-500",
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 gap-2 text-navy/40 text-sm">
        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="font-body max-w-[1100px]">
      <div className="mb-8">
        <h2 className="font-display font-bold text-2xl text-navy">Dashboard</h2>
        <p className="text-navy/50 text-sm mt-1">Here's what's happening with TageLabs today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-9">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="bg-white rounded-2xl p-6 border border-navy/[0.07] shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 block">
            <div className={`w-10 h-10 rounded-xl ${stat.iconBg} ${stat.iconColor} flex items-center justify-center mb-4`}>
              {stat.icon}
            </div>
            <p className="font-display font-bold text-[32px] text-navy leading-none">{stat.value}</p>
            <p className="text-navy/50 text-[13px] mt-1.5">{stat.label}</p>
            <p className={`text-xs mt-2.5 font-medium ${
              stat.label === "Unread Messages" && unread > 0 ? "text-red-400" : "text-navy/40"
            }`}>
              {stat.change}
            </p>
          </Link>
        ))}
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent contacts */}
        <div className="bg-white rounded-2xl p-6 border border-navy/[0.07] shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display font-semibold text-base text-navy">Recent Contacts</h3>
            <Link href="/admin/contacts" className="text-xs text-blue font-medium hover:underline">View all →</Link>
          </div>
          <div className="flex flex-col gap-3">
            {contacts.slice(0, 4).map((c) => (
              <div key={c.id} className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${c.read ? "border-transparent bg-transparent" : "border-blue/10 bg-blue/[0.04]"}`}>
                <div className="w-9 h-9 rounded-full bg-navy flex items-center justify-center shrink-0">
                  <span className="text-white text-[13px] font-semibold">{c.name.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-[13px] font-semibold text-navy truncate">{c.name}</p>
                    {!c.read && <span className="w-1.5 h-1.5 rounded-full bg-blue shrink-0" />}
                  </div>
                  <p className="text-xs text-navy/45 mt-0.5 truncate">{c.subject}</p>
                </div>
                <span className="text-[11px] text-navy/35 shrink-0">
                  {new Date(c.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
              </div>
            ))}
            {contacts.length === 0 && <p className="text-sm text-navy/35 text-center py-6">No submissions yet.</p>}
          </div>
        </div>

        {/* Recent projects */}
        <div className="bg-white rounded-2xl p-6 border border-navy/[0.07] shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display font-semibold text-base text-navy">Recent Projects</h3>
            <Link href="/admin/projects" className="text-xs text-blue font-medium hover:underline">View all →</Link>
          </div>
          <div className="flex flex-col gap-2.5">
            {projects.slice(0, 4).map((p) => (
              <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl bg-navy/[0.02] border border-navy/[0.06]">
                <div className="w-9 h-9 rounded-xl bg-blue/10 flex items-center justify-center shrink-0 text-blue text-base">✦</div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-navy truncate">{p.title}</p>
                  <p className="text-xs text-navy/45 mt-0.5">{p.category}</p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${p.status === "Published" ? "bg-green-100 text-green-600" : "bg-red-50 text-red-400"}`}>
                    {p.status}
                  </span>
                  <span className="text-[11px] text-navy/35">
                    {new Date(p.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                </div>
              </div>
            ))}
            {projects.length === 0 && <p className="text-sm text-navy/35 text-center py-6">No projects yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}


