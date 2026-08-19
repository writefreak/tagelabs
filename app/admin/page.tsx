"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { supabase } from "@/app/lib/supabase";
import {
  FolderKanban,
  FileText,
  Mail,
  Users,
  Loader2,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

type BlogPost = {
  id: string;
  title: string;
  cover_image_url?: string | null;
  published: boolean;
  created_at: string;
};

type Project = {
  id: string;
  title: string;
  category: string;
  status: "Published" | "Draft";
  image_url?: string | null;
  created_at: string;
};

const FALLBACK_BLOG_IMAGE =
  "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=300&q=80";

/* Fixed Mobile-Safe Area Component */
function ProjectsChart({ projects }: { projects: Project[] }) {
  const chartData = useMemo(() => {
    const monthsMap = new Map<
      string,
      { month: string; Total: number; Published: number }
    >();
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      const month = d.toLocaleDateString("en-US", { month: "short" });
      monthsMap.set(key, { month, Total: 0, Published: 0 });
    }

    projects.forEach((p) => {
      const d = new Date(p.created_at);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (monthsMap.has(key)) {
        const current = monthsMap.get(key)!;
        current.Total += 1;
        if (p.status === "Published") current.Published += 1;
      }
    });

    return Array.from(monthsMap.values());
  }, [projects]);

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-navy/10 shadow-2xs mb-6 sm:mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="font-display font-semibold text-sm sm:text-base text-navy flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue shrink-0" />
            Project Growth & Velocity
          </h3>
          <p className="text-[11px] sm:text-xs text-navy/40 mt-0.5">
            Real-time project additions over the last 6 months
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 sm:gap-4 text-[11px] sm:text-xs font-medium text-navy/60">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-blue inline-block" />
            <span>Total Projects</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-500 inline-block" />
            <span>Published</span>
          </div>
        </div>
      </div>

      {/* Explicit Height Container so Recharts Never Collapses to 0px */}
      <div className="w-full h-[220px] sm:h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorPublished" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#0B192C"
              strokeOpacity={0.06}
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#0B192C", fontSize: 11, opacity: 0.5 }}
              dy={6}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#0B192C", fontSize: 11, opacity: 0.5 }}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0B192C",
                borderColor: "#0B192C",
                borderRadius: "8px",
                color: "#fff",
                fontSize: "11px",
              }}
              itemStyle={{ color: "#fff" }}
            />
            <Area
              type="monotone"
              dataKey="Total"
              stroke="#2563EB"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorTotal)"
            />
            <Area
              type="monotone"
              dataKey="Published"
              stroke="#10B981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorPublished)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
export default function AdminDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [cvOrders, setCvOrders] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      const [
        { data: p },
        { data: b },
        { count: unreadMsgs },
        { count: users },
        { count: orders },
      ] = await Promise.all([
        supabase
          .from("projects")
          .select("id, title, category, status, image_url, created_at")
          .order("created_at", { ascending: false }),
        supabase
          .from("blog_posts")
          .select("id, title, cover_image_url, published, created_at")
          .order("created_at", { ascending: false }),
        supabase
          .from("contacts")
          .select("*", { count: "exact", head: true })
          .eq("read", false),
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("cv_orders").select("*", { count: "exact", head: true }),
      ]);

      setProjects(p ?? []);
      setBlogs(b ?? []);
      setUnreadCount(unreadMsgs ?? 0);
      setUserCount(users ?? 0);
      setCvOrders(orders ?? 0);
      setLoading(false);
    }
    fetchAll();
  }, []);

  const publishedProjects = projects.filter(
    (p) => p.status === "Published",
  ).length;

  const stats = [
    {
      label: "Total Projects",
      value: projects.length,
      change: `${publishedProjects} published`,
      href: "/admin/projects",
      iconBg: "bg-blue/10",
      iconColor: "text-blue",
      icon: <FolderKanban className="w-4 h-4 sm:w-5 sm:h-5" />,
    },
    {
      label: "CV Orders",
      value: cvOrders,
      change: "All time orders",
      href: "/admin/cv-orders",
      iconBg: "bg-blue/10",
      iconColor: "text-blue",
      icon: <FileText className="w-4 h-4 sm:w-5 sm:h-5" />,
    },
    {
      label: "Unread Messages",
      value: unreadCount,
      change: unreadCount > 0 ? "Needs attention" : "All caught up ✓",
      href: "/admin/contacts",
      iconBg: "bg-red-100",
      iconColor: "text-red-400",
      icon: <Mail className="w-4 h-4 sm:w-5 sm:h-5" />,
    },
    {
      label: "Admin Users",
      value: userCount,
      change: "Registered admins",
      href: "/admin/users",
      iconBg: "bg-green-100",
      iconColor: "text-green-500",
      icon: <Users className="w-4 h-4 sm:w-5 sm:h-5" />,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 gap-2 text-navy/40 text-sm min-h-screen bg-white">
        <Loader2 className="w-4 h-4 animate-spin" />
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="font-body max-w-[1200px] mx-auto min-h-screen bg-white px-2 py-4 sm:px-6 md:p-8">
      {/* Header */}
      <div className="mb-4 sm:mb-6 md:mb-8 px-1 sm:px-0">
        <h2 className="font-display font-bold text-xl sm:text-2xl md:text-3xl text-navy">
          Dashboard
        </h2>
        <p className="text-navy/50 text-xs sm:text-sm mt-0.5">
          Here's what's happening with TageLabs today.
        </p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 mb-5 sm:mb-6 md:mb-9">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-navy/[0.07] shadow-2xs hover:shadow-md transition-all duration-200 block"
          >
            <div
              className={`w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl ${stat.iconBg} ${stat.iconColor} flex items-center justify-center mb-2 sm:mb-3`}
            >
              {stat.icon}
            </div>
            <p className="font-display font-bold text-xl sm:text-2xl md:text-[32px] text-navy leading-none">
              {stat.value}
            </p>
            <p className="text-navy/60 text-[11px] sm:text-[13px] font-medium mt-1.5 truncate">
              {stat.label}
            </p>
            <p
              className={`text-[10px] sm:text-xs mt-1 sm:mt-2 font-medium truncate ${
                stat.label === "Unread Messages" && unreadCount > 0
                  ? "text-red-400"
                  : "text-navy/40"
              }`}
            >
              {stat.change}
            </p>
          </Link>
        ))}
      </div>

      {/* Area Chart Component */}
      <ProjectsChart projects={projects} />

      {/* Responsive Two Columns for Blogs & Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Blogs */}
        <div className="bg-white pt-4 md:p-3.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 sm:mb-5">
              <div>
                <h3 className="font-display font-semibold text-sm sm:text-base text-navy">
                  Recent Blogs
                </h3>
                <p className="text-[10px] sm:text-xs text-navy/40">
                  Latest editorial posts and insights
                </p>
              </div>
              <Link
                href="/admin/blogs"
                className="text-xs flex items-center gap-1 text-blue font-medium hover:underline shrink-0"
              >
                View all
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="flex flex-col gap-2 sm:gap-3">
              {blogs.slice(0, 4).map((b) => {
                const blogImg = b.cover_image_url || FALLBACK_BLOG_IMAGE;
                return (
                  <div
                    key={b.id}
                    className="flex items-center gap-2.5 sm:gap-3.5 p-2 sm:p-3 rounded-lg sm:rounded-xl border border-navy/5 hover:border-navy/15 bg-white transition-all duration-200"
                  >
                    <div className="relative w-9 h-9 sm:w-12 sm:h-12 rounded-md sm:rounded-lg overflow-hidden bg-navy/5 shrink-0">
                      <img
                        src={blogImg}
                        alt={b.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0 pr-1">
                      <p className="text-xs sm:text-[13px] font-semibold text-navy truncate leading-snug">
                        {b.title}
                      </p>
                      <p className="text-[10px] sm:text-[11px] text-navy/40 mt-0.5">
                        {new Date(b.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>

                    <div className="shrink-0">
                      <span
                        className={`text-[9px] sm:text-[11px] font-semibold px-2 py-0.5 sm:py-1 rounded-full ${
                          b.published
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-200/50"
                            : "bg-amber-50 text-amber-600 border border-amber-200/50"
                        }`}
                      >
                        {b.published ? "Published" : "Draft"}
                      </span>
                    </div>
                  </div>
                );
              })}

              {blogs.length === 0 && (
                <p className="text-xs sm:text-sm text-navy/35 text-center py-6">
                  No blogs published yet.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Projects */}
        <div className="bg-white pt-4 md:p-3.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 sm:mb-5">
              <div>
                <h3 className="font-display font-semibold text-sm sm:text-base text-navy">
                  Recent Projects
                </h3>
                <p className="text-[10px] sm:text-xs text-navy/40">
                  Portfolio builds and updates
                </p>
              </div>
              <Link
                href="/admin/projects"
                className="text-xs flex items-center gap-1 text-blue font-medium hover:underline shrink-0"
              >
                View all
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="flex flex-col gap-2 sm:gap-3">
              {projects.slice(0, 4).map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-2.5 sm:gap-3.5 p-2 sm:p-3 rounded-lg sm:rounded-xl border border-navy/5 hover:border-navy/15 bg-white transition-all duration-200"
                >
                  <div className="relative w-9 h-9 sm:w-12 sm:h-12 rounded-md sm:rounded-lg overflow-hidden bg-navy/5 shrink-0 flex items-center justify-center">
                    {p.image_url ? (
                      <img
                        src={p.image_url}
                        alt={p.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-blue/10 text-blue font-semibold flex items-center justify-center text-xs">
                        ✦
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 pr-1">
                    <p className="text-xs sm:text-[13px] font-semibold text-navy truncate leading-snug">
                      {p.title}
                    </p>
                    <p className="text-[10px] sm:text-[11px] text-navy/40 mt-0.5 truncate">
                      {p.category}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-0.5 shrink-0">
                    <span
                      className={`text-[9px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        p.status === "Published"
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-200/50"
                          : "bg-red-50 text-red-500 border border-red-200/50"
                      }`}
                    >
                      {p.status}
                    </span>
                    <span className="text-[9px] sm:text-[11px] text-navy/35">
                      {new Date(p.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              ))}

              {projects.length === 0 && (
                <p className="text-xs sm:text-sm text-navy/35 text-center py-6">
                  No projects added yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
