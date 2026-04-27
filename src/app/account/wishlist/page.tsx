"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Trash2, ChevronRight, RefreshCw } from "lucide-react";
import { useCartStore } from "@/lib/store/cartStore";

interface WishlistItem {
  productId: string;
  name: string;
  price: number;
  image?: string;
  addedAt: string;
}

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);
  const { addItem } = useCartStore();

  const fetchWishlist = useCallback(async () => {
    const res = await fetch("/api/user/wishlist");
    if (res.ok) {
      const data = await res.json();
      setItems(data.wishlist || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchWishlist(); }, [fetchWishlist]);

  const removeItem = async (productId: string) => {
    setRemoving(productId);
    await fetch("/api/user/wishlist", { method: "DELETE", body: JSON.stringify({ productId }), headers: { "Content-Type": "application/json" } });
    setItems(prev => prev.filter(i => i.productId !== productId));
    setRemoving(null);
  };

  const moveToCart = async (item: WishlistItem) => {
    addItem({ productId: item.productId, name: item.name, price: item.price, quantity: 1, image: item.image });
    await removeItem(item.productId);
  };

  return (
    <div className="min-h-screen bg-[#faf6f0] py-12">
      <div className="container mx-auto px-5 lg:px-8 max-w-4xl">
        <div className="mb-8">
          <nav className="flex items-center gap-2 text-[#8b6a4a] text-sm mb-4">
            <Link href="/account" className="hover:text-[#3b2314]">Account</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#3b2314] font-bold">Wishlist</span>
          </nav>
          <h1 className="font-serif text-4xl font-bold text-[#3b2314]">My Wishlist</h1>
          <p className="text-[#8b6a4a] mt-1">{items.length} saved item{items.length !== 1 ? "s" : ""}</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24"><RefreshCw className="w-8 h-8 text-[#8b6a4a] animate-spin" /></div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#e8dcd0] p-16 text-center">
            <Heart className="w-16 h-16 text-[#c8a882] mx-auto mb-4" strokeWidth={1} />
            <h2 className="font-serif text-2xl font-bold text-[#3b2314] mb-2">Your wishlist is empty</h2>
            <p className="text-[#8b6a4a] mb-6">Save products you love for later</p>
            <Link href="/products" className="inline-flex items-center gap-2 bg-[#3b2314] hover:bg-[#5c3420] text-white font-bold px-6 py-3 rounded-2xl transition-all">
              Browse Collection <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {items.map((item) => (
              <div key={item.productId} className="bg-white rounded-3xl border border-[#e8dcd0] shadow-sm overflow-hidden group">
                <Link href={`/products/${item.productId}`} className="relative aspect-[16/9] block overflow-hidden bg-[#f5ede4]">
                  {item.image ? (
                    <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, 50vw" />
                  ) : (
                    <div className="flex items-center justify-center h-full"><Heart className="w-12 h-12 text-[#c8a882]" /></div>
                  )}
                </Link>
                <div className="p-5">
                  <Link href={`/products/${item.productId}`}>
                    <h3 className="font-serif text-lg font-bold text-[#3b2314] hover:text-[#c8603a] transition-colors mb-1">{item.name}</h3>
                  </Link>
                  <p className="font-mono text-xl font-bold text-[#3b2314] mb-4">₹{item.price?.toLocaleString("en-IN")}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => moveToCart(item)}
                      className="flex-1 flex items-center justify-center gap-2 bg-[#3b2314] hover:bg-[#5c3420] text-white text-xs font-bold uppercase tracking-wide py-2.5 rounded-xl transition-all"
                    >
                      <ShoppingCart className="w-4 h-4" /> Add to Cart
                    </button>
                    <button
                      onClick={() => removeItem(item.productId)}
                      disabled={removing === item.productId}
                      className="w-10 h-10 flex items-center justify-center border border-red-200 text-red-400 hover:text-red-600 hover:border-red-400 rounded-xl transition-all disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
