"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  LayoutDashboard, ShoppingCart, Users, Package,
  ChevronLeft, ChevronRight, RefreshCw, Search, Filter
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

interface Order {
  _id: string;
  orderNumber?: string;
  shippingAddress?: { fullName?: string; city?: string; state?: string };
  items?: Array<{ name: string; quantity: number }>;
  totalAmount: number;
  paymentStatus: string;
  orderStatus?: string;
  status?: string;
  createdAt: string;
}

const ORDER_STATUSES = ["all", "pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];
const PAYMENT_STATUSES = ["pending", "paid", "failed", "refunded"];

const STATUS_PILL: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700 border border-yellow-200",
  confirmed: "bg-blue-100 text-blue-700 border border-blue-200",
  processing: "bg-purple-100 text-purple-700 border border-purple-200",
  shipped: "bg-indigo-100 text-indigo-700 border border-indigo-200",
  delivered: "bg-green-100 text-green-700 border border-green-200",
  cancelled: "bg-red-100 text-red-700 border border-red-200",
  paid: "bg-green-100 text-green-700 border border-green-200",
  failed: "bg-red-100 text-red-700 border border-red-200",
  refunded: "bg-blue-100 text-blue-700 border border-blue-200",
};

export default function AdminOrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterStatus, setFilterStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/admin-login");
    if (status === "authenticated" && (session?.user as { role?: string })?.role !== "admin") router.push("/");
  }, [status, session, router]);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "15", status: filterStatus });
    const res = await fetch(`/api/admin/orders?${params}`);
    if (res.ok) {
      const data = await res.json();
      setOrders(data.orders || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    }
    setLoading(false);
  }, [page, filterStatus]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const updateStatus = async (orderId: string, orderStatus: string) => {
    setUpdatingId(orderId);
    await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, orderStatus }),
    });
    setOrders(prev => prev.map(o => o._id === orderId ? { ...o, orderStatus, status: orderStatus } : o));
    setUpdatingId(null);
  };

  const updatePayment = async (orderId: string, paymentStatus: string) => {
    setUpdatingId(orderId + "-pay");
    await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, paymentStatus }),
    });
    setOrders(prev => prev.map(o => o._id === orderId ? { ...o, paymentStatus } : o));
    setUpdatingId(null);
  };

  const filtered = search
    ? orders.filter(o =>
        (o.orderNumber || o._id).toLowerCase().includes(search.toLowerCase()) ||
        (o.shippingAddress?.fullName || "").toLowerCase().includes(search.toLowerCase())
      )
    : orders;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1a0e0a] text-white flex-col hidden md:flex min-h-screen">
        <div className="p-8 border-b border-white/10">
          <Link href="/" className="block">
            <h2 className="text-2xl font-serif font-bold text-[#cfb53b]">Sipwar</h2>
            <p className="text-[#8b6a4a] text-xs mt-1 tracking-widest uppercase">Admin Portal</p>
          </Link>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {[
            { label: "Overview", icon: LayoutDashboard, href: "/admin" },
            { label: "Orders", icon: ShoppingCart, href: "/admin/orders", active: true },
            { label: "Products", icon: Package, href: "/admin" },
            { label: "Customers", icon: Users, href: "/admin" },
          ].map(({ label, icon: Icon, href, active }) => (
            <Link key={label} href={href}
              className={`px-4 py-3 rounded-xl font-medium flex items-center gap-3 transition-colors ${active ? "bg-[#3b2314] text-white" : "text-[#8b6a4a] hover:bg-[#3b2314]/60 hover:text-white"}`}
            >
              <Icon className="w-5 h-5" /> {label}
            </Link>
          ))}
        </nav>
        <div className="px-4 pb-6 border-t border-white/10 pt-4">
          <button onClick={() => signOut({ callbackUrl: "/admin-login" })} className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-[#8b6a4a] hover:bg-red-900/30 hover:text-red-400 transition-colors text-sm font-medium">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
            <p className="text-sm text-gray-400 mt-0.5">{total} total orders</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={fetchOrders} className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:border-[#3b2314] hover:text-[#3b2314] transition-colors">
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
            </button>
            <Link href="/admin" className="flex items-center gap-2 px-4 py-2 bg-[#3b2314] text-white rounded-xl text-sm font-bold hover:bg-[#5c3420] transition-colors">
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </Link>
          </div>
        </div>

        <div className="p-6 lg:p-10 space-y-6">
          {/* Filters */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 flex flex-wrap gap-4 items-center">
            <div className="relative flex-1 min-w-52">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Search by order ID or customer…" value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#3b2314] transition-colors"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1); }}
                className="border border-gray-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-[#3b2314] bg-white cursor-pointer"
              >
                {ORDER_STATUSES.map(s => <option key={s} value={s}>{s === "all" ? "All Statuses" : s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[900px]">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 text-xs font-bold uppercase tracking-wider">
                    <th className="px-6 py-4">Order</th>
                    <th className="px-4 py-4">Customer</th>
                    <th className="px-4 py-4">Items</th>
                    <th className="px-4 py-4">Amount</th>
                    <th className="px-4 py-4">Order Status</th>
                    <th className="px-4 py-4">Payment</th>
                    <th className="px-4 py-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading ? (
                    <tr><td colSpan={7} className="py-16 text-center text-gray-400">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />Loading orders...
                    </td></tr>
                  ) : filtered.length === 0 ? (
                    <tr><td colSpan={7} className="py-16 text-center text-gray-400">No orders found</td></tr>
                  ) : filtered.map(order => {
                    const statusKey = order.orderStatus || order.status || "pending";
                    return (
                      <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-5 font-mono text-sm font-bold text-[#3b2314]">
                          #{order.orderNumber || order._id.slice(-6).toUpperCase()}
                        </td>
                        <td className="px-4 py-5">
                          <p className="font-medium text-gray-800 text-sm">{order.shippingAddress?.fullName || "—"}</p>
                          <p className="text-gray-400 text-xs">{order.shippingAddress?.city}, {order.shippingAddress?.state}</p>
                        </td>
                        <td className="px-4 py-5 text-sm text-gray-500">
                          {order.items?.map((i, idx) => <div key={idx}>{i.name} ×{i.quantity}</div>)}
                        </td>
                        <td className="px-4 py-5 font-mono font-bold text-gray-900">₹{order.totalAmount?.toLocaleString("en-IN")}</td>
                        <td className="px-4 py-5">
                          <select
                            value={statusKey}
                            onChange={e => updateStatus(order._id, e.target.value)}
                            disabled={updatingId === order._id}
                            className={`text-xs font-bold px-3 py-1.5 rounded-full border cursor-pointer focus:outline-none transition-all ${STATUS_PILL[statusKey] || ""}`}
                          >
                            {ORDER_STATUSES.filter(s => s !== "all").map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                          </select>
                        </td>
                        <td className="px-4 py-5">
                          <select
                            value={order.paymentStatus}
                            onChange={e => updatePayment(order._id, e.target.value)}
                            disabled={updatingId === order._id + "-pay"}
                            className={`text-xs font-bold px-3 py-1.5 rounded-full border cursor-pointer focus:outline-none transition-all ${STATUS_PILL[order.paymentStatus] || ""}`}
                          >
                            {PAYMENT_STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                          </select>
                        </td>
                        <td className="px-4 py-5 text-gray-400 text-sm">
                          {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                <p className="text-sm text-gray-400">Page {page} of {totalPages}</p>
                <div className="flex gap-2">
                  <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1} className="p-2 rounded-xl border border-gray-200 disabled:opacity-40 hover:border-[#3b2314] transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages} className="p-2 rounded-xl border border-gray-200 disabled:opacity-40 hover:border-[#3b2314] transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
