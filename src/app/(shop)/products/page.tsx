"use client";

import Link from "next/link";
import Image from "next/image";
import { FallbackImage } from "@/components/ui/FallbackImage";
import { useState, useCallback, useEffect } from "react";
import { SlidersHorizontal, Search, Star, Heart, ShoppingCart, X } from "lucide-react";
import { useCartStore } from "@/lib/store/cartStore";
import { useSession } from "next-auth/react";

const PRODUCTS = [
  {
    id: "1",
    name: "Filter Coffee Arabica AA",
    desc: "Single-origin Coorg, bold & smooth",
    rating: 4.9, reviews: 240, badge: "Bestseller", cat: "Arabica",
    image: "/images/products/Filter_Coffee_Arabica_AA/pexels-esranurkalay-10101325 (1).jpg",
    sizes: { "250g": 599, "500g": 1099, "1kg": 1999 },
    originalSizes: { "250g": 799, "500g": 1399, "1kg": 2599 },
  },
  {
    id: "2",
    name: "Adaptogenic Morning Blend",
    desc: "Ashwagandha-infused, zero crash energy",
    rating: 4.8, reviews: 89, badge: "New", cat: "Blends",
    image: "/images/products/Adaptogenic_Morning_Blend/pexels-cihanyuce-30349811.jpg",
    sizes: { "250g": 799, "500g": 1449, "1kg": 2699 },
    originalSizes: {},
  },
  {
    id: "3",
    name: "Monsoon Malabar Dark Roast",
    desc: "Earthy, intense, and unforgettable",
    rating: 4.7, reviews: 210, badge: null, cat: "Robusta",
    image: "/images/products/Monsoon_Malabar_Dark_Roast/pexels-melike-2157605065-36765363 (1).jpg",
    sizes: { "250g": 499, "500g": 929, "1kg": 1749 },
    originalSizes: {},
  },
  {
    id: "4",
    name: "Heritage South Indian Filter",
    desc: "Traditional decoction concentrate",
    rating: 4.6, reviews: 340, badge: "Sale", cat: "Filter Coffee",
    image: "/images/products/Heritage_South_Indian_Filter/pexels-rahimegul-15067736.jpg",
    sizes: { "250g": 349, "500g": 649, "1kg": 1199 },
    originalSizes: { "250g": 449, "500g": 829, "1kg": 1549 },
  },
  {
    id: "5",
    name: "Chikmagalur Estate Reserve",
    desc: "Floral, bright, wine-processed Arabica",
    rating: 4.9, reviews: 126, badge: "Limited", cat: "Arabica",
    image: "/images/products/Chikmagalur_Estate_Reserve/pexels-melike-2157605065-36765363.jpg",
    sizes: { "250g": 699, "500g": 1299, "1kg": 2499 },
    originalSizes: {},
  },
  {
    id: "6",
    name: "Nilgiri Breakfast Blend",
    desc: "Light, aromatic, perfect with milk",
    rating: 4.5, reviews: 178, badge: null, cat: "Blends",
    image: "/images/products/Nilgiri_Breakfast_Blend/pexels-cmrcn-30226618.jpg",
    sizes: { "250g": 449, "500g": 829, "1kg": 1549 },
    originalSizes: {},
  },
];

const CATEGORIES = ["All", "Arabica", "Robusta", "Filter Coffee", "Blends"];

const BADGE_STYLES: Record<string, string> = {
  Bestseller: "bg-[#cfb53b] text-[#1a0e0a]",
  New: "bg-green-600 text-white",
  Sale: "bg-[#c8603a] text-white",
  Limited: "bg-[#3b2314] text-white",
};

export default function ProductsPage() {
  const { addItem } = useCartStore();
  const { data: session } = useSession();
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("Popularity");
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>(
    () => Object.fromEntries(PRODUCTS.map(p => [p.id, "250g"]))
  );
  const [addedIds, setAddedIds] = useState<string[]>([]);

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
    const selectedSize = selectedSizes[id] || "250g";
    try {
      await fetch("/api/user/wishlist", {
        method: isWishlisted ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: id,
          name: product?.name,
          price: product?.sizes[selectedSize as keyof typeof product.sizes] ?? product?.sizes["250g"],
          image: product?.image,
        }),
      });
    } catch {
      setWishlist(prev => isWishlisted ? [...prev, id] : prev.filter(x => x !== id));
    }
  }, [session, wishlist, selectedSizes]);

  const selectSize = (productId: string, size: string) => {
    setSelectedSizes(prev => ({ ...prev, [productId]: size }));
  };

  const handleAddToCart = (p: typeof PRODUCTS[0]) => {
    const size = selectedSizes[p.id] || "250g";
    const price = p.sizes[size as keyof typeof p.sizes];
    addItem({ productId: p.id, name: p.name, price, quantity: 1, weight: size, image: p.image });
    setAddedIds(prev => [...prev, p.id]);
    setTimeout(() => setAddedIds(prev => prev.filter(id => id !== p.id)), 2000);
  };

  const filtered = PRODUCTS
    .filter(p => activeCategory === "All" || p.cat === activeCategory)
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const sizeA = selectedSizes[a.id] || "250g";
      const sizeB = selectedSizes[b.id] || "250g";
      if (sortBy === "Price: Low to High") return a.sizes[sizeA as keyof typeof a.sizes] - b.sizes[sizeB as keyof typeof b.sizes];
      if (sortBy === "Price: High to Low") return b.sizes[sizeB as keyof typeof b.sizes] - a.sizes[sizeA as keyof typeof a.sizes];
      if (sortBy === "Rating") return b.rating - a.rating;
      return 0;
    });

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <div className="relative h-[45vh] min-h-[280px] flex items-end overflow-hidden bg-[#1a0e0a]">
        <Image
          src="/images/coffee-hero.jpg"
          alt="Coffee beans"
          fill
          className="object-cover opacity-40"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a0e0a]/20 to-[#1a0e0a]/80" />
        <div className="relative z-10 container mx-auto px-5 lg:px-8 pb-12">
          <nav className="flex items-center gap-2 text-[#c8a882] text-sm font-medium mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white">Shop</span>
          </nav>
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-white">Our Coffee Collection</h1>
          <p className="text-[#c8a882] text-lg mt-3 font-light">Single-origin. Freshly roasted. Ethically sourced.</p>
        </div>
      </div>

      {/* Sticky filter bar */}
      <div className="sticky top-[80px] z-40 bg-white/95 backdrop-blur-md border-b border-[#e8dcd0] shadow-sm">
        <div className="container mx-auto px-5 lg:px-8 py-3 flex flex-wrap gap-3 items-center justify-between">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <SlidersHorizontal className="w-4 h-4 text-[#8b6a4a] flex-shrink-0" />
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-bold transition-all border ${
                  activeCategory === cat
                    ? "bg-[#3b2314] text-white border-[#3b2314]"
                    : "border-[#e8dcd0] text-[#8b6a4a] hover:border-[#8b6a4a] hover:text-[#3b2314]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#c8a882]" />
              <input
                type="text"
                placeholder="Search blends…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 pr-3 py-2 rounded-xl border border-[#e8dcd0] text-sm bg-[#faf6f0] focus:outline-none focus:border-[#3b2314] w-48 transition-all"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#c8a882]">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="border border-[#e8dcd0] rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-[#3b2314] bg-transparent cursor-pointer font-medium text-[#8b6a4a]"
            >
              <option>Popularity</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Rating</option>
            </select>
            <span className="text-sm text-[#c8a882] hidden lg:block font-medium">{filtered.length} products</span>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="container mx-auto px-5 lg:px-8 py-16">
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-serif text-3xl text-[#3b2314] mb-3">No blends found.</p>
            <p className="text-[#8b6a4a]">Try a different filter or search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {filtered.map((p) => {
              const selectedSize = selectedSizes[p.id] || "250g";
              const currentPrice = p.sizes[selectedSize as keyof typeof p.sizes];
              const originalPrice = p.originalSizes?.[selectedSize as keyof typeof p.originalSizes];
              const isAdded = addedIds.includes(p.id);

              return (
                <div key={p.id} className="group flex flex-col bg-white rounded-[2rem] border border-[#e8dcd0] shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-400 overflow-hidden relative">
                  {/* Wishlist */}
                  <button
                    onClick={() => toggleWishlist(p.id)}
                    className={`absolute top-4 right-4 z-30 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md border shadow-lg transition-all ${
                      wishlist.includes(p.id)
                        ? "bg-[#c8603a] border-[#c8603a] text-white"
                        : "bg-white/80 border-white/40 text-[#c8a882] hover:text-[#c8603a]"
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${wishlist.includes(p.id) ? "fill-white" : ""}`} />
                  </button>

                  {p.badge && (
                    <div className={`absolute top-4 left-4 z-30 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest shadow-md ${BADGE_STYLES[p.badge] || "bg-[#3b2314] text-white"}`}>
                      {p.badge}
                    </div>
                  )}

                  <Link href={`/products/${p.id}`} className="block relative aspect-[4/5] overflow-hidden bg-[#f5ede4]">
                  <FallbackImage
                      src={p.image}
                      alt={p.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      context="product"
                    />
                  </Link>

                  <div className="p-6 flex flex-col flex-grow gap-3">
                    <Link href={`/products/${p.id}`}>
                      <h3 className="font-serif text-xl font-bold text-[#3b2314] hover:text-[#c8603a] transition-colors line-clamp-1">{p.name}</h3>
                    </Link>
                    <p className="text-[#8b6a4a] text-sm line-clamp-1">{p.desc}</p>

                    {/* Size selector — interactive */}
                    <div className="flex gap-2 flex-wrap">
                      {Object.entries(p.sizes).map(([size, price]) => (
                        <button
                          key={size}
                          onClick={() => selectSize(p.id, size)}
                          className={`px-3 py-1 text-xs font-bold border rounded-full transition-all ${
                            selectedSize === size
                              ? "bg-[#3b2314] border-[#3b2314] text-white"
                              : "border-[#e8dcd0] text-[#8b6a4a] hover:border-[#3b2314] hover:text-[#3b2314]"
                          }`}
                        >
                          {size} · ₹{price}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-1.5 mt-auto">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} className={`w-3.5 h-3.5 ${s <= Math.floor(p.rating) ? "fill-[#cfb53b] text-[#cfb53b]" : "fill-[#f0e6d8] text-[#f0e6d8]"}`} />
                      ))}
                      <span className="text-xs text-[#8b6a4a] ml-1 font-medium">({p.reviews})</span>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-[#f0e6d8] mt-2">
                      <div>
                        <span className="font-mono text-2xl font-bold text-[#3b2314]">₹{currentPrice}</span>
                        {originalPrice && (
                          <span className="text-sm text-[#c8a882] line-through ml-2 font-mono">₹{originalPrice}</span>
                        )}
                      </div>
                      <button
                        onClick={() => handleAddToCart(p)}
                        className={`flex items-center gap-1.5 text-white text-xs font-bold uppercase tracking-widest px-4 py-2.5 rounded-xl transition-all active:scale-95 ${
                          isAdded ? "bg-green-600" : "bg-[#3b2314] hover:bg-[#5c3420]"
                        }`}
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        {isAdded ? "Added ✓" : "Add"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="bg-[#1a0e0a] py-20 text-center">
        <p className="text-[#cfb53b] font-bold uppercase tracking-widest text-xs mb-4">Can't decide?</p>
        <h2 className="font-serif text-4xl font-bold text-white mb-6">Try our Coffee Discovery Box</h2>
        <p className="text-[#c8a882] max-w-md mx-auto mb-8 leading-relaxed">Get 4 surprise single-origin samples hand-picked by our roasters, delivered to your door.</p>
        <button className="bg-gradient-to-r from-[#cfb53b] to-amber-500 text-[#1a0e0a] font-bold px-10 py-4 rounded-2xl hover:shadow-[0_0_40px_rgba(207,181,59,0.3)] transition-all">
          Order Discovery Box — ₹799
        </button>
      </div>
    </div>
  );
}
