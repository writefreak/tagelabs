"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";
import { SearchIcon } from "lucide-react";

type OrderStatus = "pending" | "completed" | "cancelled";

type CVOrder = {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  job_field: string;
  current_role: string | null;
  target_role: string | null;
  tier: string;
  notes: string | null;
  status: OrderStatus;
  created_at: string;
};

const TIER_STYLES: Record<string, { label: string; bg: string; text: string }> =
  {
    essential: {
      label: "Essential",
      bg: "bg-navy/[0.06]",
      text: "text-navy/60",
    },
    professional: {
      label: "Professional",
      bg: "bg-blue/10",
      text: "text-blue",
    },
    executive: {
      label: "Executive",
      bg: "bg-amber-50",
      text: "text-amber-600",
    },
  };

const STATUS_STYLES: Record<
  OrderStatus,
  { label: string; bg: string; text: string; dot: string }
> = {
  pending: {
    label: "Pending",
    bg: "bg-amber-50",
    text: "text-amber-600",
    dot: "bg-amber-400",
  },
  completed: {
    label: "Completed",
    bg: "bg-green-50",
    text: "text-green-600",
    dot: "bg-green-500",
  },
  cancelled: {
    label: "Cancelled",
    bg: "bg-red-50",
    text: "text-red-400",
    dot: "bg-red-400",
  },
};

function TierBadge({ tier }: { tier: string }) {
  const style = TIER_STYLES[tier] ?? {
    label: tier,
    bg: "bg-navy/[0.06]",
    text: "text-navy/60",
  };
  return (
    <span
      className={`text-[11px] font-semibold px-2.5 py-1 rounded-full shrink-0 ${style.bg} ${style.text}`}
    >
      {style.label}
    </span>
  );
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const style = STATUS_STYLES[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full shrink-0 ${style.bg} ${style.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {style.label}
    </span>
  );
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }
  return (
    <button
      onClick={copy}
      className="ml-1 p-2.5 -m-1 touch-manipulation text-navy/25 hover:text-blue active:scale-90 transition-all duration-150 shrink-0"
      title="Copy"
    >
      {copied ? (
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      )}
    </button>
  );
}

function StatusSelector({
  current,
  onChange,
  loading,
}: {
  current: OrderStatus;
  onChange: (s: OrderStatus) => void;
  loading: boolean;
}) {
  const statuses: OrderStatus[] = ["pending", "completed", "cancelled"];
  return (
    <div className="flex gap-2">
      {statuses.map((s) => {
        const style = STATUS_STYLES[s];
        const isActive = current === s;
        return (
          <button
            key={s}
            onClick={() => onChange(s)}
            disabled={loading || isActive}
            className={`flex-1 py-3 rounded-xl text-xs font-semibold transition-all duration-150 border touch-manipulation active:scale-[0.97] ${
              isActive
                ? `${style.bg} ${style.text} border-transparent`
                : "bg-transparent text-navy/40 border-navy/10 hover:border-navy/20 hover:text-navy/60"
            } disabled:cursor-not-allowed`}
          >
            {loading && isActive ? "Saving..." : style.label}
          </button>
        );
      })}
    </div>
  );
}

function OrderDrawer({
  order,
  onClose,
  onStatusChange,
}: {
  order: CVOrder;
  onClose: () => void;
  onStatusChange: (id: string, status: OrderStatus) => void;
}) {
  const [statusLoading, setStatusLoading] = useState(false);
  const [localStatus, setLocalStatus] = useState<OrderStatus>(order.status);

  useEffect(() => {
    setLocalStatus(order.status);
  }, [order.status]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  async function handleStatusChange(newStatus: OrderStatus) {
    if (newStatus === localStatus) return;
    setStatusLoading(true);
    const { error } = await supabase
      .from("cv_orders")
      .update({ status: newStatus })
      .eq("id", order.id);
    if (!error) {
      setLocalStatus(newStatus);
      onStatusChange(order.id, newStatus);
    }
    setStatusLoading(false);
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-navy/20 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      <div className="fixed right-0 top-0 h-dvh w-full max-w-[480px] bg-white z-50 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div
          className="flex items-start justify-between gap-3 px-5 sm:px-6 py-5 border-b border-navy/[0.07]"
          style={{ paddingTop: "calc(1.25rem + env(safe-area-inset-top))" }}
        >
          <div className="min-w-0">
            <p className="text-xs font-semibold tracking-widest uppercase text-navy/35 mb-0.5">
              Order Detail
            </p>
            <h3 className="font-display font-semibold text-navy text-lg leading-tight break-words">
              {order.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-lg bg-navy/[0.05] flex items-center justify-center text-navy/40 hover:bg-navy/10 hover:text-navy active:scale-90 transition-all duration-150 shrink-0 touch-manipulation"
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
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 sm:px-6 py-6 flex flex-col gap-6">
          {/* Tier + date */}
          <div className="flex items-center justify-between gap-3">
            <TierBadge tier={order.tier} />
            <span className="text-xs text-navy/35 shrink-0">
              {new Date(order.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>

          {/* Status */}
          <div className="bg-[#f9f8f6] rounded-xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[10px] font-semibold tracking-widest uppercase text-navy/35">
                Order Status
              </p>
              <StatusBadge status={localStatus} />
            </div>
            <StatusSelector
              current={localStatus}
              onChange={handleStatusChange}
              loading={statusLoading}
            />
          </div>

          {/* Contact */}
          <div className="bg-[#f9f8f6] rounded-xl p-4 flex flex-col gap-3">
            <p className="text-[10px] font-semibold tracking-widest uppercase text-navy/35">
              Contact
            </p>
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-navy/45 shrink-0">Email</span>
                <div className="flex items-center min-w-0">
                  <span className="text-xs font-medium text-navy truncate">
                    {order.email}
                  </span>
                  <CopyButton value={order.email} />
                </div>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-navy/45 shrink-0">WhatsApp</span>
                <div className="flex items-center min-w-0">
                  <a
                    href={`https://wa.me/${order.whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-blue hover:underline truncate touch-manipulation"
                  >
                    {order.whatsapp}
                  </a>
                  <CopyButton value={order.whatsapp} />
                </div>
              </div>
            </div>
          </div>

          {/* Career context */}
          <div className="bg-[#f9f8f6] rounded-xl p-4 flex flex-col gap-3">
            <p className="text-[10px] font-semibold tracking-widest uppercase text-navy/35">
              Career Context
            </p>
            <div className="flex flex-col gap-2.5">
              <div className="flex items-start justify-between gap-4">
                <span className="text-xs text-navy/45 shrink-0">Field</span>
                <span className="text-xs font-medium text-navy text-right break-words min-w-0">
                  {order.job_field}
                </span>
              </div>
              <div className="flex items-start justify-between gap-4">
                <span className="text-xs text-navy/45 shrink-0">
                  Current role
                </span>
                <span className="text-xs font-medium text-navy text-right break-words min-w-0">
                  {order.current_role || (
                    <span className="text-navy/30 font-normal">
                      Not provided
                    </span>
                  )}
                </span>
              </div>
              <div className="flex items-start justify-between gap-4">
                <span className="text-xs text-navy/45 shrink-0">
                  Target role
                </span>
                <span className="text-xs font-medium text-navy text-right break-words min-w-0">
                  {order.target_role || (
                    <span className="text-navy/30 font-normal">
                      Not provided
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="bg-[#f9f8f6] rounded-xl p-4 flex flex-col gap-2">
              <p className="text-[10px] font-semibold tracking-widest uppercase text-navy/35">
                Notes
              </p>
              <p className="text-xs text-navy/70 leading-relaxed break-words">
                {order.notes}
              </p>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div
          className="px-5 sm:px-6 pt-5 border-t border-navy/[0.07] flex gap-3 shrink-0"
          style={{
            paddingBottom: "calc(1.25rem + env(safe-area-inset-bottom))",
          }}
        >
          <a
            href={`https://wa.me/${order.whatsapp.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3.5 rounded-xl bg-[#112369] text-white text-xs font-semibold text-center hover:bg-[#112369]/90 active:scale-[0.98] transition-all duration-200 touch-manipulation"
          >
            Open in WhatsApp
          </a>
          <a
            href={`mailto:${order.email}`}
            className="flex-1 py-3.5 rounded-xl border border-navy/15 text-navy text-xs font-semibold text-center hover:bg-navy/[0.04] active:scale-[0.98] transition-all duration-200 touch-manipulation"
          >
            Send Email
          </a>
        </div>
      </div>
    </>
  );
}

const TIERS = ["All", "Essential", "Professional", "Executive"];
const STATUSES = ["All", "Pending", "Completed", "Cancelled"];

export default function CVOrdersPage() {
  const [orders, setOrders] = useState<CVOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<CVOrder | null>(null);
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    async function fetchOrders() {
      const { data } = await supabase
        .from("cv_orders")
        .select("*")
        .order("created_at", { ascending: false });
      setOrders(data ?? []);
      setLoading(false);
    }
    fetchOrders();
  }, []);

  function handleStatusChange(id: string, status: OrderStatus) {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    setSelected((prev) => (prev?.id === id ? { ...prev, status } : prev));
  }

  const filtered = orders.filter((o) => {
    const matchesTier =
      tierFilter === "All" || o.tier === tierFilter.toLowerCase();
    const matchesStatus =
      statusFilter === "All" || o.status === statusFilter.toLowerCase();
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      o.name.toLowerCase().includes(q) ||
      o.email.toLowerCase().includes(q) ||
      o.job_field.toLowerCase().includes(q) ||
      (o.target_role ?? "").toLowerCase().includes(q);
    return matchesTier && matchesStatus && matchesSearch;
  });

  const counts = {
    pending: orders.filter((o) => o.status === "pending").length,
    completed: orders.filter((o) => o.status === "completed").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 gap-2 text-navy/40 text-sm">
        <svg
          className="animate-spin w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
        Loading orders...
      </div>
    );
  }

  return (
    <div className="font-body w-full min-w-0 max-w-[1100px] overflow-x-hidden">
      {/* Page header */}
      <div className="mb-8">
        <h2 className="font-display font-bold text-2xl text-navy">CV Orders</h2>
        <p className="text-navy/50 text-sm mt-1">
          {orders.length} {orders.length === 1 ? "order" : "orders"} received so
          far.
        </p>
      </div>

      {/* Status summary pills */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6 w-full min-w-0">
        {(["pending", "completed", "cancelled"] as OrderStatus[]).map((s) => {
          const style = STATUS_STYLES[s];
          return (
            <button
              key={s}
              onClick={() =>
                setStatusFilter(
                  statusFilter === style.label ? "All" : style.label,
                )
              }
              className={`rounded-2xl shadow-sm border p-3 sm:p-4 text-left transition-all duration-200 min-w-0 w-full overflow-hidden touch-manipulation active:scale-[0.97] ${
                statusFilter === style.label
                  ? `${style.bg} border-transparent`
                  : "bg-white border-navy/[0.07] hover:border-navy/15"
              }`}
            >
              <p
                className={`font-display font-bold text-xl sm:text-2xl ${statusFilter === style.label ? style.text : "text-navy"}`}
              >
                {counts[s]}
              </p>
              <p
                className={`text-[11px] sm:text-xs font-medium mt-1 truncate ${statusFilter === style.label ? style.text : "text-navy/40"}`}
              >
                {style.label}
              </p>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2.5 mb-6 w-full">
        {/* Search Input */}
        <div className="relative flex-1 min-w-0">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-navy/30 pointer-events-none w-3.5 h-3.5" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-xs sm:text-sm rounded-lg border border-navy/10 bg-white text-navy placeholder:text-navy/30 focus:outline-none focus:border-blue transition-colors duration-200"
          />
        </div>

        {/* Filter Pill List */}
        <div className="flex gap-1 bg-navy/[0.04] p-1 rounded-lg overflow-x-auto no-scrollbar shrink-0 max-w-full">
          {TIERS.map((t) => (
            <button
              key={t}
              onClick={() => setTierFilter(t)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap shrink-0 transition-all duration-150 touch-manipulation ${
                tierFilter === t
                  ? "bg-white text-navy shadow-sm"
                  : "text-navy/50 hover:text-navy"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Table — desktop */}
      <div className="hidden md:block bg-white rounded-2xl border border-navy/[0.07] shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-navy/[0.06]">
              {[
                "Client",
                "Field",
                "Target Role",
                "Package",
                "Status",
                "Date",
                "",
              ].map((h) => (
                <th
                  key={h}
                  className="text-left px-5 py-3.5 text-[11px] font-semibold tracking-widest uppercase text-navy/35"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-16 text-navy/30 text-sm"
                >
                  No orders found.
                </td>
              </tr>
            ) : (
              filtered.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-navy/[0.04] last:border-none hover:bg-[#f9f8f6] transition-colors duration-150 cursor-pointer"
                  onClick={() => setSelected(order)}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-navy flex items-center justify-center shrink-0">
                        <span className="text-white text-xs font-semibold">
                          {order.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-navy text-[13px]">
                          {order.name}
                        </p>
                        <p className="text-[11px] text-navy/40">
                          {order.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[13px] text-navy/60">
                    {order.job_field}
                  </td>
                  <td className="px-5 py-4 text-[13px] text-navy/60">
                    {order.target_role || (
                      <span className="text-navy/25">—</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <TierBadge tier={order.tier} />
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-5 py-4 text-[12px] text-navy/40 whitespace-nowrap">
                    {new Date(order.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-[11px] font-medium text-blue hover:underline">
                      View
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Cards — mobile */}
      <div className="flex flex-col gap-3 md:hidden min-w-0">
        {filtered.length === 0 ? (
          <p className="text-center text-navy/30 text-sm py-16">
            No orders found.
          </p>
        ) : (
          filtered.map((order) => (
            <button
              key={order.id}
              onClick={() => setSelected(order)}
              className="w-full min-w-0 text-left bg-white rounded-2xl border border-navy/[0.07] shadow-sm p-4 sm:p-5 hover:shadow-md active:scale-[0.99] transition-all duration-200 overflow-hidden touch-manipulation"
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-navy flex items-center justify-center shrink-0">
                    <span className="text-white text-sm font-semibold">
                      {order.name.charAt(0)}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold truncate text-navy text-sm">
                      {order.name}
                    </p>
                    <p className="text-xs md:text-[11px] text-navy/40 truncate">
                      {order.email}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-1.5 pl-0 sm:pl-12">
                <p className="text-xs text-navy/50 truncate">
                  {order.job_field}
                </p>
                {order.target_role && (
                  <p className="text-xs text-navy/40 truncate">
                    Targeting: {order.target_role}
                  </p>
                )}
                <div className="flex items-center gap-1.5 pt-5 shrink-0">
                  <TierBadge tier={order.tier} />
                  <StatusBadge status={order.status} />
                </div>
                <div className="flex items-end justify-end">
                  <p className="text-[11px] text-navy/30 mt-1">
                    {new Date(order.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </button>
          ))
        )}
      </div>

      {/* Drawer */}
      {selected && (
        <OrderDrawer
          order={selected}
          onClose={() => setSelected(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}
