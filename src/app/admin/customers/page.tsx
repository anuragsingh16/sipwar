"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard, ShoppingCart, Users, Package,
  RefreshCw, Search, ChevronLeft, ChevronRight, LogOut,
  Mail, ShoppingBag, TrendingUp, UserCheck, UserX
} from "lucide-react";

interface Customer {
  _id: string;
  firstName: string;
  lastName:  string;
  email:     string;
  role:      string;
  isActive:  boolean;
  createdAt: string;
  lastLogin?: string;
  orderCount: number;
  totalSpend: number;
}

const SIDEBAR_LINKS = [
  { label: "Overview",   icon: LayoutDashboard, href: "/admin" },
  { label: "Orders",     icon: ShoppingCart,    href: "/admin/orders" },
  { label: "Customers",  icon: Users,           href: "/admin/customers", active: true },
  { label: "Products",   icon: Package,         href: "/admin/products" },
];

export default function AdminCustomersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [total, setTotal]         = useState(0);
  const [page, setPage]           = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");

  // Protect route
  useEffect(() => {
    if (status === "unauthenticated") router.push("/admin-login");
    if (status === "authenticated" && (session?.user as any)?.role !== "admin") router.push("/");
  }, [status, session, router]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => { setDebouncedQ(search); setPage(1); }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    if (debouncedQ) params.set("q", debouncedQ);
    const res = await fetch(`/api/admin/customers?${params}`);
    if (res.ok) {
      const data = await res.json();
      setCustomers(data.customers || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    }
    setLoading(false);
  }, [page, debouncedQ]);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

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
          {SIDEBAR_LINKS.map(({ label, icon: Icon, href, active }) => (
            <Link key={label} href={href}
              className={`px-4 py-3 rounded-xl font-medium flex items-center gap-3 transition-colors ${
                active ? "bg-[#3b2314] text-white" : "text-[#8b6a4a] hover:bg-[#3b2314]/60 hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5" /> {label}
            </Link>
          ))}
        </nav>
        <div className="px-4 pb-6 border-t border-white/10 pt-4">
          <div className="flex items-center gap-3 px-4 py-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-[#cfb53b] flex items-center justify-center text-[#1a0e0a] font-bold text-sm">
              {session?.user?.name?.[0] || "A"}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white truncate">{session?.user?.name || "Admin"}</p>
              <p className="text-xs text-[#8b6a4a] truncate">{session?.user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/admin-login" })}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-[#8b6a4a] hover:bg-red-900/30 hover:text-red-400 transition-colors text-sm font-medium"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
            <p className="text-sm text-gray-400 mt-0.5">{total} total customers</p>
          </div>
          <button
            onClick={fetchCustomers}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:border-[#3b2314] hover:text-[#3b2314] transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
        </div>

        <div className="p-6 lg:p-10 space-y-6">
          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { label: "Total Customers", value: total, icon: Users,      color: "text-purple-600", bg: "bg-purple-50" },
              { label: "Active",          value: customers.filter(c => c.isActive).length, icon: UserCheck, color: "text-green-600",  bg: "bg-green-50" },
              { label: "Inactive",        value: customers.filter(c => !c.isActive).length, icon: UserX,    color: "text-red-600",    bg: "bg-red-50" },
            ].map(({ label, value, icon: Icon, color, bg }) => (
              <div key={label} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm flex items-center gap-5">
                <div className={`w-12 h-12 ${bg} ${color} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-0.5">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Search */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#3b2314] transition-colors"
              />
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[800px]">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 text-xs font-bold uppercase tracking-wider">
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-4 py-4">Email</th>
                    <th className="px-4 py-4">Orders</th>
                    <th className="px-4 py-4">Total Spend</th>
                    <th className="px-4 py-4">Status</th>
                    <th className="px-4 py-4">Joined</th>
                    <th className="px-4 py-4">Last Login</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="py-16 text-center text-gray-400">
                        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                        Loading customers...
                      </td>
                    </tr>
                  ) : customers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-16 text-center text-gray-400">
                        <Users className="w-8 h-8 mx-auto mb-3 text-gray-200" />
                        <p className="font-medium">No customers found</p>
                      </td>
                    </tr>
                  ) : customers.map(c => (
                    <tr key={c._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#cfb53b] to-amber-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                            {(c.firstName?.[0] || c.email[0]).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800 text-sm">
                              {c.firstName || ""} {c.lastName || ""}
                            </p>
                            <p className="text-xs text-gray-400 capitalize">{c.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-5">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
                          {c.email}
                        </div>
                      </td>
                      <td className="px-4 py-5">
                        <div className="flex items-center gap-1.5">
                          <ShoppingBag className="w-3.5 h-3.5 text-gray-300" />
                          <span className="font-semibold text-gray-800">{c.orderCount}</span>
                        </div>
                      </td>
                      <td className="px-4 py-5">
                        <div className="flex items-center gap-1.5">
                          <TrendingUp className="w-3.5 h-3.5 text-gray-300" />
                          <span className="font-mono font-bold text-gray-900 text-sm">
                            ₹{c.totalSpend.toLocaleString("en-IN")}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-5">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                          c.isActive
                            ? "bg-green-100 text-green-700 border border-green-200"
                            : "bg-red-100 text-red-700 border border-red-200"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${c.isActive ? "bg-green-500" : "bg-red-500"}`} />
                          {c.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-5 text-gray-400 text-sm">
                        {c.createdAt
                          ? new Date(c.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                          : "—"}
                      </td>
                      <td className="px-4 py-5 text-gray-400 text-sm">
                        {c.lastLogin
                          ? new Date(c.lastLogin).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
                          : "Never"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                <p className="text-sm text-gray-400">Page {page} of {totalPages}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2 rounded-xl border border-gray-200 disabled:opacity-40 hover:border-[#3b2314] transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-2 rounded-xl border border-gray-200 disabled:opacity-40 hover:border-[#3b2314] transition-colors"
                  >
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
