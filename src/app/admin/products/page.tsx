"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard, ShoppingCart, Users, Package, LogOut,
  Plus, Edit, Trash2, Search, AlertCircle
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
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/admin-login");
    if (status === "authenticated" && (session?.user as any)?.role !== "admin") router.push("/");
  }, [status, session, router]);

  useEffect(() => {
    if (status === "authenticated" && (session?.user as any)?.role === "admin") {
      fetchProducts();
    }
  }, [status, session]);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      if (res.ok) {
        setProducts(data);
      } else {
        setError(data.error || "Failed to fetch products");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProducts(products.filter(p => p._id !== id));
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete product");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred");
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1a0e0a] text-white flex-col hidden md:flex min-h-screen fixed h-full">
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
        <div className="px-4 pb-6 border-t border-white/10 pt-4 mt-auto">
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
      <main className="flex-1 ml-64 overflow-auto min-h-screen">
        <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-6 py-4 shadow-sm flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
            <p className="text-sm text-gray-400 mt-0.5">Manage your catalog</p>
          </div>
          <Link href="/admin/products/new">
            <button className="flex items-center gap-2 bg-[#1a0e0a] hover:bg-[#3b2314] text-white px-5 py-2.5 rounded-xl font-medium transition-colors text-sm">
              <Plus className="w-4 h-4" /> Add Product
            </button>
          </Link>
        </div>

        <div className="p-6 lg:p-10">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3b2314]/20 focus:border-[#3b2314]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 text-red-600 flex items-center gap-2 border-b border-red-100">
                <AlertCircle className="w-4 h-4" /> {error}
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 text-gray-700 font-medium border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 rounded-tl-2xl">Product</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Price / Variants</th>
                    <th className="px-6 py-4">Stock</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 rounded-tr-2xl text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-10 text-center text-gray-400">
                        <div className="w-6 h-6 border-2 border-[#cfb53b] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                        Loading products...
                      </td>
                    </tr>
                  ) : filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-10 text-center text-gray-400">
                        No products found.
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((p) => {
                      const totalStock = p.variants?.reduce((acc: number, v: any) => acc + (v.stock || 0), 0) || 0;
                      return (
                        <tr key={p._id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {p.images?.[0]?.url ? (
                                <img src={p.images[0].url} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-gray-100 border border-gray-200" />
                              ) : (
                                <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center">
                                  <Package className="w-4 h-4 text-gray-400" />
                                </div>
                              )}
                              <div>
                                <p className="font-bold text-gray-900">{p.name}</p>
                                <p className="text-xs text-gray-400 mt-0.5">{p.slug}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="bg-amber-50 text-amber-700 px-2.5 py-1 rounded-md text-xs font-semibold capitalize border border-amber-100">
                              {p.category}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {p.variants?.length ? (
                              <div>
                                <p className="font-medium text-gray-900">₹{p.variants[0].price}</p>
                                <p className="text-xs text-gray-400">{p.variants.length} variant(s)</p>
                              </div>
                            ) : (
                              <span className="text-gray-400 italic">No variants</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`font-medium ${totalStock > 0 ? "text-green-600" : "text-red-500"}`}>
                              {totalStock} in stock
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${p.isActive ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"}`}>
                              {p.isActive ? "Active" : "Draft"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link href={`/admin/products/${p._id}`}>
                                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                  <Edit className="w-4 h-4" />
                                </button>
                              </Link>
                              <button 
                                onClick={() => handleDelete(p._id)}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
