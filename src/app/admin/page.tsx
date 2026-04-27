"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Users, Package, ShoppingCart, DollarSign,
  LayoutDashboard, LogOut, TrendingUp, RefreshCw, ChevronRight, AlertTriangle
} from "lucide-react";
import { signOut } from "next-auth/react";

interface ChartDay { date: string; revenue: number; orders: number }
interface StatusDist { status: string; count: number }

interface DashboardStats {
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  recentOrders: Array<{
    _id: string;
    orderNumber?: string;
    shippingAddress?: { fullName?: string };
    totalAmount: number;
    paymentStatus: string;
    orderStatus?: string;
    createdAt: string;
  }>;
  last7Days: ChartDay[];
  ordersByStatus: StatusDist[];
}

const STATUS_PILL: Record<string, string> = {
  paid:      "bg-green-100 text-green-700 border border-green-200",
  pending:   "bg-yellow-100 text-yellow-700 border border-yellow-200",
  failed:    "bg-red-100 text-red-700 border border-red-200",
  confirmed: "bg-blue-100 text-blue-700 border border-blue-200",
  cancelled: "bg-red-100 text-red-600 border border-red-200",
  delivered: "bg-green-100 text-green-700 border border-green-200",
  processing:"bg-purple-100 text-purple-700 border border-purple-200",
  shipped:   "bg-indigo-100 text-indigo-700 border border-indigo-200",
};

const STATUS_COLORS: Record<string, string> = {
  pending:    "#f59e0b",
  confirmed:  "#3b82f6",
  processing: "#8b5cf6",
  shipped:    "#6366f1",
  delivered:  "#22c55e",
  cancelled:  "#ef4444",
};

// Bar chart using pure SVG
function BarChart({ data }: { data: ChartDay[] }) {
  const maxRev = Math.max(...data.map(d => d.revenue), 1);
  const W = 520, H = 180, PAD = 24, BAR_W = 40, GAP = (W - PAD * 2) / data.length;

  return (
    <svg viewBox={`0 0 ${W} ${H + 32}`} className="w-full">
      {data.map((d, i) => {
        const barH = Math.max(4, (d.revenue / maxRev) * H);
        const x = PAD + i * GAP + (GAP - BAR_W) / 2;
        const y = H - barH + 4;
        return (
          <g key={d.date}>
            <rect x={x} y={y} width={BAR_W} height={barH} rx={8}
              fill={d.revenue > 0 ? "#3b2314" : "#f0e6d8"} />
            {d.revenue > 0 && (
              <text x={x + BAR_W / 2} y={y - 6} textAnchor="middle" fontSize={10} fill="#8b6a4a" fontWeight="600">
                ₹{d.revenue >= 1000 ? `${(d.revenue / 1000).toFixed(1)}k` : d.revenue}
              </text>
            )}
            <text x={x + BAR_W / 2} y={H + 22} textAnchor="middle" fontSize={11} fill="#c8a882" fontWeight="600">
              {d.date}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// Donut / Pie chart using SVG
function DonutChart({ data }: { data: StatusDist[] }) {
  const total = data.reduce((s, d) => s + d.count, 0) || 1;
  const R = 60, CX = 80, CY = 80;
  let angle = -90;

  const slices = data.map(d => {
    const pct = d.count / total;
    const deg = pct * 360;
    const start = angle;
    angle += deg;
    return { ...d, pct, startDeg: start, endDeg: angle };
  });

  function polarToXY(cx: number, cy: number, r: number, angle: number) {
    const rad = (angle * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  function describeArc(startDeg: number, endDeg: number) {
    const s = polarToXY(CX, CY, R, startDeg);
    const e = polarToXY(CX, CY, R, endDeg - 0.5);
    const large = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${R} ${R} 0 ${large} 1 ${e.x} ${e.y} L ${CX} ${CY} Z`;
  }

  return (
    <div className="flex items-center gap-8">
      <svg viewBox={`0 0 ${CX * 2} ${CY * 2}`} className="w-40 h-40 flex-shrink-0">
        {data.length === 0 ? (
          <circle cx={CX} cy={CY} r={R} fill="#f0e6d8" />
        ) : (
          slices.map((s, i) => (
            <path key={i} d={describeArc(s.startDeg, s.endDeg)}
              fill={STATUS_COLORS[s.status] || "#c8a882"} />
          ))
        )}
        <circle cx={CX} cy={CY} r={R * 0.55} fill="white" />
        <text x={CX} y={CY - 5} textAnchor="middle" fontSize={14} fontWeight="bold" fill="#3b2314">{total}</text>
        <text x={CX} y={CY + 12} textAnchor="middle" fontSize={9} fill="#8b6a4a">TOTAL</text>
      </svg>
      <div className="flex flex-col gap-2 flex-1 flex-wrap">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: STATUS_COLORS[d.status] || "#c8a882" }} />
            <span className="text-gray-500 capitalize">{d.status}</span>
            <span className="font-bold text-gray-800 ml-auto">{d.count}</span>
          </div>
        ))}
        {data.length === 0 && <p className="text-gray-400 text-sm">No orders yet</p>}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = useCallback(async () => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/admin/stats");
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Failed"); }
      setStats(await res.json());
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") { router.push("/admin-login"); return; }
    if (status === "authenticated") {
      if ((session?.user as { role?: string })?.role !== "admin") { router.push("/"); return; }
      fetchStats();
    }
  }, [status, session, router, fetchStats]);

  const statCards = [
    { label: "Total Revenue",  value: stats ? `₹${stats.totalRevenue.toLocaleString("en-IN")}` : "—", icon: DollarSign,  bg: "bg-blue-50",   color: "text-blue-600" },
    { label: "Total Orders",   value: stats?.totalOrders ?? "—",   icon: ShoppingCart, bg: "bg-green-50",  color: "text-green-600" },
    { label: "Customers",      value: stats?.totalUsers ?? "—",    icon: Users,        bg: "bg-purple-50", color: "text-purple-600" },
    { label: "Avg Order",      value: stats && stats.totalOrders > 0 ? `₹${Math.round(stats.totalRevenue / stats.totalOrders).toLocaleString("en-IN")}` : "—", icon: TrendingUp, bg: "bg-orange-50", color: "text-orange-600" },
  ];

  if (status === "loading" || loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center"><div className="w-12 h-12 border-4 border-[#3b2314]/20 border-t-[#3b2314] rounded-full animate-spin mx-auto mb-4" /><p className="text-[#8b6a4a] font-medium">Loading dashboard...</p></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1a0e0a] text-white flex-col hidden md:flex min-h-screen">
        <div className="p-8 border-b border-white/10">
          <div>
            <h2 className="text-2xl font-serif font-bold text-[#cfb53b]">Sipwar</h2>
            <p className="text-[#8b6a4a] text-xs mt-1 tracking-widest uppercase">Admin Portal</p>
          </div>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {[
            { label: "Overview",  icon: LayoutDashboard, href: "/admin",            active: true },
            { label: "Orders",    icon: ShoppingCart,    href: "/admin/orders" },
            { label: "Customers", icon: Users,           href: "/admin/customers" },
            { label: "Products",  icon: Package,         href: "/admin/products" },
          ].map(({ label, icon: Icon, href, active }) => (
            <Link key={label} href={href}
              className={`px-4 py-3 rounded-xl font-medium flex items-center gap-3 transition-colors ${active ? "bg-[#3b2314] text-white" : "text-[#8b6a4a] hover:bg-[#3b2314]/60 hover:text-white"}`}
            ><Icon className="w-5 h-5" />{label}</Link>
          ))}
        </nav>
        <div className="px-4 pb-6 border-t border-white/10 pt-4">
          <div className="flex items-center gap-3 px-4 py-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-[#cfb53b] flex items-center justify-center text-[#1a0e0a] font-bold text-sm">{session?.user?.name?.[0] || "A"}</div>
            <div className="overflow-hidden"><p className="text-sm font-bold text-white truncate">{session?.user?.name || "Admin"}</p><p className="text-xs text-[#8b6a4a] truncate">{session?.user?.email}</p></div>
          </div>
          <button onClick={() => signOut({ callbackUrl: "/admin-login" })} className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-[#8b6a4a] hover:bg-red-900/30 hover:text-red-400 transition-colors text-sm font-medium">
            <LogOut className="w-4 h-4" />Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-400 mt-0.5">{new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={fetchStats} disabled={refreshing} className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:border-[#3b2314] hover:text-[#3b2314] transition-colors">
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />Refresh
            </button>
            <Link href="/admin/orders" className="flex items-center gap-2 px-4 py-2 bg-[#3b2314] text-white rounded-xl text-sm font-bold hover:bg-[#5c3420] transition-colors">
              Manage Orders <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="p-6 lg:p-10 space-y-8">
          {error && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl px-5 py-4">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <div><p className="font-bold text-sm">Failed to load live data</p><p className="text-xs mt-0.5">{error}</p></div>
            </div>
          )}

          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {statCards.map(({ label, value, icon: Icon, bg, color }) => (
              <div key={label} className="bg-white rounded-3xl border border-gray-100 p-7 shadow-sm hover:shadow-md transition-shadow flex items-start gap-5">
                <div className={`w-14 h-14 ${bg} ${color} rounded-2xl flex items-center justify-center flex-shrink-0`}><Icon className="w-7 h-7" /></div>
                <div className="overflow-hidden">
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1 truncate">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Revenue Bar Chart */}
            <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm p-7">
              <h2 className="text-lg font-bold text-gray-900 mb-1">Revenue — Last 7 Days</h2>
              <p className="text-sm text-gray-400 mb-5">Daily paid order revenue</p>
              {stats?.last7Days && stats.last7Days.length > 0 ? (
                <BarChart data={stats.last7Days} />
              ) : (
                <div className="h-48 flex items-center justify-center text-gray-300">
                  <div className="text-center"><TrendingUp className="w-10 h-10 mx-auto mb-2" /><p className="text-sm">No data yet</p></div>
                </div>
              )}
            </div>

            {/* Orders by Status Donut */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-7">
              <h2 className="text-lg font-bold text-gray-900 mb-1">Orders by Status</h2>
              <p className="text-sm text-gray-400 mb-5">Distribution breakdown</p>
              <DonutChart data={stats?.ordersByStatus || []} />
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-8 py-6 border-b border-gray-50">
              <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
              <Link href="/admin/orders" className="text-sm font-bold text-[#3b2314] hover:underline flex items-center gap-1">
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[700px]">
                <thead>
                  <tr className="border-b border-gray-50 text-gray-400 text-xs font-bold uppercase tracking-wider">
                    <th className="pb-4 pt-4 px-8">Order</th>
                    <th className="pb-4 pt-4 px-4">Customer</th>
                    <th className="pb-4 pt-4 px-4">Date</th>
                    <th className="pb-4 pt-4 px-4">Amount</th>
                    <th className="pb-4 pt-4 px-4">Payment</th>
                    <th className="pb-4 pt-4 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 divide-y divide-gray-50">
                  {!stats?.recentOrders?.length ? (
                    <tr><td colSpan={6} className="py-16 text-center text-gray-400">
                      <ShoppingCart className="w-8 h-8 mx-auto mb-3 text-gray-200" />
                      <p className="font-medium">No orders yet</p>
                    </td></tr>
                  ) : stats.recentOrders.map(order => (
                    <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-5 px-8 font-mono text-sm font-bold text-[#3b2314]">
                        #{order.orderNumber || order._id.slice(-6).toUpperCase()}
                      </td>
                      <td className="py-5 px-4 font-medium text-gray-800">{order.shippingAddress?.fullName || "—"}</td>
                      <td className="py-5 px-4 text-gray-400 text-sm">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td>
                      <td className="py-5 px-4 font-mono font-bold text-gray-900">₹{order.totalAmount?.toLocaleString("en-IN")}</td>
                      <td className="py-5 px-4">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${STATUS_PILL[order.paymentStatus] || "bg-gray-100 text-gray-600"}`}>{order.paymentStatus}</span>
                      </td>
                      <td className="py-5 px-4">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${STATUS_PILL[order.orderStatus || "pending"] || "bg-gray-100 text-gray-600"}`}>{order.orderStatus || "pending"}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
