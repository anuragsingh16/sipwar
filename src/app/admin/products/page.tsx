"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import {
  LayoutDashboard, ShoppingCart, Users, Package, LogOut,
  Layers, Plus, Upload, Tags, BarChart2
} from "lucide-react";

const SIDEBAR_LINKS = [
  { label: "Overview",  icon: LayoutDashboard, href: "/admin" },
  { label: "Orders",    icon: ShoppingCart,    href: "/admin/orders" },
  { label: "Customers", icon: Users,           href: "/admin/customers" },
  { label: "Products",  icon: Package,         href: "/admin/products", active: true },
];

export default function AdminProductsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/admin-login");
    if (status === "authenticated" && (session?.user as any)?.role !== "admin") router.push("/");
  }, [status, session, router]);

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
        <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-6 py-4 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage your catalog</p>
        </div>

        <div className="p-6 lg:p-10">
          {/* Coming Soon banner */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-12 text-center">
            <div className="w-20 h-20 bg-[#3b2314]/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-10 h-10 text-[#3b2314]/40" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Product Management</h2>
            <p className="text-gray-400 max-w-md mx-auto mb-8 leading-relaxed">
              Full product catalog management (add, edit, remove products, manage inventory, pricing, and images) is coming in the next update.
            </p>

            {/* Feature preview cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {[
                { icon: Plus,     label: "Add Products",     desc: "Create new listings" },
                { icon: Upload,   label: "Image Upload",     desc: "Manage product photos" },
                { icon: Tags,     label: "Pricing & Variants", desc: "Weights, grinds, prices" },
                { icon: BarChart2, label: "Inventory",       desc: "Stock tracking" },
              ].map(({ icon: Icon, label, desc }) => (
                <div key={label} className="bg-gray-50 rounded-2xl p-5 text-left border border-gray-100">
                  <div className="w-10 h-10 bg-white rounded-xl border border-gray-200 flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-gray-400" />
                  </div>
                  <p className="font-semibold text-gray-700 text-sm">{label}</p>
                  <p className="text-xs text-gray-400 mt-1">{desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <span className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-sm font-medium px-4 py-2 rounded-full">
                <Layers className="w-4 h-4" />
                Currently products are managed via the database directly
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
