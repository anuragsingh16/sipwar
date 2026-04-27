"use client";

import Link from "next/link";
import { FallbackImage } from "@/components/ui/FallbackImage";
import { Star, Heart, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/lib/store/cartStore";
import { useState, useCallback, useEffect } from "react";
import { useSession } from "next-auth/react";

const PRODUCTS = [
  {
    id: "1",
    name: "Filter Coffee Arabica AA",
    shortDesc: "Bold, rich, smooth — Coorg's finest",
    price: 599,
    originalPrice: 799,
    rating: 4.8,
    reviews: 240,
    badge: "Bestseller",
    badgeColor: "bg-gold text-coffee-950",
    image: "/images/products/Filter_Coffee_Arabica_AA/pexels-esranurkalay-10101325 (1).jpg",
  },
  {
    id: "2",
    name: "Adaptogenic Morning Blend",
    shortDesc: "Ashwagandha-infused, zero crash",
    price: 799,
    originalPrice: null,
    rating: 4.9,
    reviews: 89,
    badge: "New",
    badgeColor: "bg-green-eco text-white",
    image: "/images/products/Adaptogenic_Morning_Blend/pexels-cihanyuce-30349811.jpg",
  },
  {
    id: "3",
    name: "Monsoon Malabar Dark Roast",
    shortDesc: "Earthy, intense, unforgettable",
    price: 499,
    originalPrice: null,
    rating: 4.7,
    reviews: 210,
    badge: null,
    badgeColor: "",
    image: "/images/products/Monsoon_Malabar_Dark_Roast/pexels-ibro-6804316.jpg",
  },
  {
    id: "4",
    name: "Heritage South Indian Filter",
    shortDesc: "Traditional decoction concentrate",
    price: 349,
    originalPrice: 449,
    rating: 4.6,
    reviews: 340,
    badge: "Sale",
    badgeColor: "bg-terracotta text-white",
    image: "/images/products/Heritage_South_Indian_Filter/pexels-rahimegul-15067736.jpg",
  },
];

export default function FeaturedProducts() {
  const { addItem } = useCartStore();
  const { data: session } = useSession();
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    if (session) {
      fetch("/api/user/wishlist")
        .then(res => res.json())
        .then(data => {
          if (data.wishlist) {
            setWishlist(data.wishlist.map((item: any) => item.productId));
          }
        })
        .catch(console.error);
    }
  }, [session]);

  const toggleWishlist = useCallback(async (id: string) => {
    if (!session) return;
    const isWishlisted = wishlist.includes(id);
    setWishlist(prev => isWishlisted ? prev.filter(x => x !== id) : [...prev, id]);
    const product = PRODUCTS.find(p => p.id === id);
    try {
      await fetch("/api/user/wishlist", {
        method: isWishlisted ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: id,
          name: product?.name,
          price: product?.price,
          image: product?.image,
        }),
      });
    } catch {
      setWishlist(prev => isWishlisted ? [...prev, id] : prev.filter(x => x !== id));
    }
  }, [session, wishlist]);

  return (
    <section className="py-28 bg-white">
      <div className="container mx-auto px-5 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-gold font-bold uppercase tracking-widest text-xs mb-3">Our Blends</p>
          <h2 className="font-serif text-4xl md:text-[3.25rem] font-bold text-coffee-900 leading-tight">Crafted for Every Palate</h2>
          <p className="text-coffee-500 text-lg mt-4 max-w-xl mx-auto font-light">Single-origin, sustainably sourced, roasted to order.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {PRODUCTS.map((p) => (
            <div key={p.id} className="group flex flex-col bg-white rounded-[2rem] border border-coffee-100 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden relative">
              {/* Wishlist */}
              <button
                onClick={() => toggleWishlist(p.id)}
                className={`absolute top-4 right-4 z-30 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md border border-white/40 transition-all shadow-lg ${wishlist.includes(p.id) ? "bg-terracotta text-white" : "bg-white/80 text-coffee-400 hover:text-terracotta"}`}
              >
                <Heart className={`w-4 h-4 ${wishlist.includes(p.id) ? "fill-white" : ""}`} />
              </button>

              {/* Badge */}
              {p.badge && (
                <div className={`absolute top-4 left-4 z-30 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest shadow-md ${p.badgeColor}`}>
                  {p.badge}
                </div>
              )}

              {/* Image */}
              <Link href={`/products/${p.id}`} className="block relative aspect-[4/5] overflow-hidden bg-coffee-100">
                <FallbackImage
                  src={p.image}
                  alt={p.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </Link>

              {/* Details */}
              <div className="p-6 flex flex-col flex-grow gap-3">
                <Link href={`/products/${p.id}`}>
                  <h3 className="font-serif text-xl font-bold text-coffee-900 hover:text-terracotta transition-colors line-clamp-1">{p.name}</h3>
                </Link>
                <p className="text-coffee-500 text-sm leading-relaxed line-clamp-1">{p.shortDesc}</p>

                <div className="flex items-center gap-1.5">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} className={`w-3.5 h-3.5 ${s <= Math.floor(p.rating) ? "fill-gold text-gold" : "text-coffee-200"}`} />
                  ))}
                  <span className="text-xs text-coffee-500 ml-1 font-medium">({p.reviews})</span>
                </div>

                <div className="flex items-end justify-between mt-auto pt-3 border-t border-coffee-50">
                  <div>
                    <span className="font-mono text-2xl font-bold text-coffee-900">₹{p.price}</span>
                    {p.originalPrice && (
                      <span className="text-sm text-coffee-400 line-through ml-2 font-mono">₹{p.originalPrice}</span>
                    )}
                  </div>
                  <button
                    onClick={() => addItem({ productId: p.id, name: p.name, price: p.price, quantity: 1, image: p.image })}
                    className="flex items-center gap-2 bg-coffee-900 hover:bg-coffee-800 text-white text-xs font-bold uppercase tracking-widest px-4 py-2.5 rounded-xl transition-all hover:shadow-lg active:scale-95"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/products">
            <button className="border-2 border-coffee-900 text-coffee-900 hover:bg-coffee-900 hover:text-white font-bold px-10 py-4 rounded-2xl transition-all text-sm uppercase tracking-widest">
              View All Blends
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
