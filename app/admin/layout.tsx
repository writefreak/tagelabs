"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

const navItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    label: "Projects",
    href: "/admin/projects",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    label: "Contacts",
    href: "/admin/contacts",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    label: "Reviews",
    href: "/admin/reviews",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentPage = navItems.find((n) => n.href === pathname)?.label ?? "Admin";

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const SidebarContent = ({ onLinkClick }: { onLinkClick?: () => void }) => (
    <>
      <div className="px-5 pt-7 pb-5 border-b border-white/[0.08]">
        <div className="flex items-center gap-2.5">
          <div className={`h-10 w-32 ${collapsed ? "hidden" : ""}`}>
            <img src="/tagelabswhite.png" alt="" className="h-full w-full" />
          </div>
        </div>
        
      </div>

      <nav className="flex-1 p-3 flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onLinkClick}
              className={`flex items-center gap-3 rounded-[10px] transition-all duration-200 ${
                collapsed ? "justify-center px-3 py-2.5" : "px-3.5 py-2.5"
              } ${
                isActive ? "bg-blue/[0.12] text-blue" : "text-white/55 hover:bg-blue/[0.08] hover:text-blue"
              }`}
            >
              <span className="shrink-0">{item.icon}</span>
              {!collapsed && <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/[0.08] flex flex-col gap-2">
        {!collapsed && (
          <Link
            href="/"
            onClick={onLinkClick}
            className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-[10px] text-white/40 text-[13px] hover:bg-blue/[0.08] hover:text-blue transition-all duration-200"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Back to site
          </Link>
        )}
        <button
          onClick={handleLogout}
          className={`flex items-center gap-2.5 rounded-[10px] px-3.5 py-2.5 text-white/40 hover:bg-red-500/20 hover:text-red-400 transition-all duration-200 w-full ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          {!collapsed && <span className="text-[13px]">Sign out</span>}
        </button>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`hidden md:flex items-center gap-2.5 rounded-[10px] px-3.5 py-2.5 text-white/40 hover:bg-blue/[0.08] hover:text-blue transition-all duration-200 w-full ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <svg
            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className={`transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          {!collapsed && <span className="text-[13px]">Collapse</span>}
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-offwhite font-body">
      <aside className={`hidden md:flex flex-col bg-navy min-h-screen sticky top-0 shrink-0 overflow-hidden transition-all duration-300 ${collapsed ? "w-[72px]" : "w-60"}`}>
        <SidebarContent />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <aside className={`fixed top-0 left-0 h-full w-64 bg-navy z-50 flex flex-col transition-transform duration-300 md:hidden ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <SidebarContent onLinkClick={() => setMobileOpen(false)} />
      </aside>

      <main className="flex-1 min-h-screen overflow-auto">
        <header className="px-5 md:px-9 py-4 md:py-5 bg-white border-b border-navy/[0.08] flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden flex flex-col justify-center items-center gap-[5px] w-9 h-9 rounded-xl hover:bg-navy/[0.06] transition-colors"
            >
              <span className="w-5 h-0.5 bg-navy rounded-full" />
              <span className="w-5 h-0.5 bg-navy rounded-full" />
              <span className="w-3.5 h-0.5 bg-navy rounded-full self-start ml-[5px]" />
            </button>
            <div>
              <h1 className="font-display font-bold text-lg md:text-xl text-navy leading-tight">{currentPage}</h1>
              <p className="text-navy/40 text-[12px] md:text-[13px] mt-0.5 hidden sm:block">
                {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
          </div>
          <div className="w-9 h-9 rounded-full bg-navy flex items-center justify-center cursor-pointer shrink-0">
            <span className="text-white text-[13px] font-semibold">H</span>
          </div>
        </header>

        <div className="p-5 md:p-9">{children}</div>
      </main>
    </div>
  );
}