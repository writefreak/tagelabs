"use client";
import { useMemo } from "react";
import { BarChart2 } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

type Project = {
  id: string;
  title: string;
  category: string;
  status: "Published" | "Draft";
  image_url?: string | null;
  created_at: string;
};

interface ProjectsChartProps {
  projects: Project[];
}

export default function ProjectsChart({ projects }: ProjectsChartProps) {
  // Aggregate projects by month (last 6 months)
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h3 className="font-display font-semibold text-base text-navy flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-blue shrink-0" />
            Project Velocity
          </h3>
          <p className="text-xs text-navy/40 mt-0.5">
            Total project additions over the last 6 months
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-medium text-navy/60">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue inline-block" />
            <span>Total Added</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            <span>Published</span>
          </div>
        </div>
      </div>

      {/* Recharts Area */}
      <div className="h-60 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
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
              tick={{ fill: "#0B192C", fontSize: 12, opacity: 0.5 }}
              dy={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#0B192C", fontSize: 12, opacity: 0.5 }}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0B192C",
                borderColor: "#0B192C",
                borderRadius: "8px",
                color: "#fff",
                fontSize: "12px",
              }}
              itemStyle={{ color: "#fff" }}
              cursor={{ fill: "rgba(11, 25, 44, 0.03)" }}
            />
            <Bar
              dataKey="Total"
              fill="#2563EB"
              radius={[4, 4, 0, 0]}
              barSize={20}
            />
            <Bar
              dataKey="Published"
              fill="#10B981"
              radius={[4, 4, 0, 0]}
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
