"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import AdminHeader from "@/components/admin/admin-header";
import {
  LayoutDashboard,
  FolderKanban,
  Mail,
  Star,
  FileText,
  ClipboardCheck,
  Newspaper,
  Users,
  UsersRound,
} from "lucide-react";

const navItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: <LayoutDashboard size={18} />,
  },
  {
    label: "Projects",
    href: "/admin/projects",
    icon: <FolderKanban size={18} />,
  },
  {
    label: "Contacts",
    href: "/admin/contacts",
    icon: <Mail size={18} />,
  },
  {
    label: "Reviews",
    href: "/admin/reviews",
    icon: <Star size={18} />,
  },
  {
    label: "CV Manager",
    href: "/admin/cv-project",
    icon: <FileText size={18} />,
  },
  {
    label: "CV Orders",
    href: "/admin/cv-orders",
    icon: <ClipboardCheck size={18} />,
  },
  {
    label: "Blogs",
    href: "/admin/blog",
    icon: <Newspaper size={18} />,
  },
  {
    label: "Team",
    href: "/admin/team",
    icon: <UsersRound size={18} />,
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: <Users size={18} />,
  },
];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userInitial, setUserInitial] = useState("?");

  useEffect(() => {
    async function fetchUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user?.email) return;
      setUserInitial(user.email.charAt(0).toUpperCase());
    }
    fetchUser();
  }, []);

  const currentPage =
    navItems.find((n) => n.href === pathname)?.label ?? "Admin";

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
                isActive
                  ? "bg-blue/[0.12] text-blue"
                  : "text-white/55 hover:bg-blue/[0.08] hover:text-blue"
              }`}
            >
              <span className="shrink-0">{item.icon}</span>
              {!collapsed && (
                <span className="text-sm font-medium whitespace-nowrap">
                  {item.label}
                </span>
              )}
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
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
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
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
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
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
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
    <div className="min-h-screen flex bg-white font-body">
      <aside
        className={`hidden md:flex flex-col bg-navy min-h-screen fixed top-0 shrink-0 overflow-hidden transition-all duration-300 ${collapsed ? "w-[72px]" : "w-60"}`}
      >
        <SidebarContent />
      </aside>

      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-navy z-50 flex flex-col transition-transform duration-300 md:hidden ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <SidebarContent onLinkClick={() => setMobileOpen(false)} />
      </aside>

      {/* <main
        className={`flex-1 min-h-screen bg-white overflow-auto transition-all duration-300 ${collapsed ? "md:pl-[72px]" : "md:pl-60"}`}
      > */}
      <main
        className={`flex-1 min-h-screen  transition-all duration-300 ${collapsed ? "md:pl-[72px]" : "md:pl-60"}`}
      >
        <AdminHeader onMobileMenuToggle={() => setMobileOpen(true)} />
        <div className="p-5 md:p-9">{children}</div>
      </main>
    </div>
  );
}
