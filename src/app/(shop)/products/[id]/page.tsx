"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Star, Minus, Plus, ShoppingCart, Award, Leaf, Package, ArrowLeft, Heart, Truck } from "lucide-react";
import { useCartStore } from "@/lib/store/cartStore";
import { useSession } from "next-auth/react";
import ProductReviews from "@/components/products/ProductReviews";

const PRODUCTS: Record<string, {
  id: string; name: string; origin: string; roast: string; process: string;
  description: string; longDesc: string; rating: number; reviews: number;
  prices: Record<string, number>; badge?: string; category: string;
  images: string[]; tastingNotes: string[]; brews: string[];
}> = {
  "1": {
    id: "1",
    name: "Filter Coffee Arabica AA",
    origin: "Coorg, Karnataka",
    roast: "Medium-Dark",
    process: "Washed",
    description: "Bold, rich, smooth — Coorg's finest, world-class specialty grade Arabica.",
    longDesc: "Our flagship blend is sourced from small estates nestled at 1,200m above sea level in the verdant hills of Coorg. Shade-grown under native silveroak trees, the cherries mature slowly, developing a deep, complex flavour with just a hint of sweetness. Roasted in small batches to a medium-dark profile to preserve origin character.",
    rating: 4.9, reviews: 240,
    prices: { "100g": 249, "250g": 599, "500g": 1099, "1kg": 1999 },
    badge: "Bestseller", category: "Arabica",
    images: [
      "/images/products/Filter_Coffee_Arabica_AA/pexels-esranurkalay-10101325 (1).jpg",
      "/images/products/Filter_Coffee_Arabica_AA/pexels-merve-arli-842967267-30404822.jpg",
    ],
    tastingNotes: ["Dark Chocolate", "Caramel", "Roasted Hazelnut", "Subtle Berry"],
    brews: ["South Indian Filter", "French Press", "Moka Pot", "AeroPress"],
  },
  "2": {
    id: "2",
    name: "Adaptogenic Morning Blend",
    origin: "Chikmagalur, Karnataka",
    roast: "Light-Medium",
    process: "Natural",
    description: "Ashwagandha-infused premium Arabica for clean, crash-free energy.",
    longDesc: "We've taken our finest Chikmagalur Arabica and blended it with clinically-dosed, organic Ashwagandha KSM-66® and Lion's Mane mushroom extract. The result is a smooth, earthy cup that delivers sustained focus without jitters or a 3 PM crash. Perfect for fitness enthusiasts and professionals.",
    rating: 4.8, reviews: 89,
    prices: { "100g": 349, "250g": 799, "500g": 1449, "1kg": 2699 },
    badge: "New", category: "Blends",
    images: [
      "/images/products/Adaptogenic_Morning_Blend/pexels-cihanyuce-30349811.jpg",
      "/images/products/Adaptogenic_Morning_Blend/pexels-esranurkalay-10101325.jpg",
    ],
    tastingNotes: ["Earthy Nuttiness", "Mild Spice", "Clean Finish", "Floral Aftertaste"],
    brews: ["Pour Over", "French Press", "Cold Brew", "AeroPress"],
  },
  "3": {
    id: "3",
    name: "Monsoon Malabar Dark Roast",
    origin: "Malabar Coast, Kerala",
    roast: "Dark",
    process: "Monsoon Processed",
    description: "Earthy, intense — a unique Indian coffee experience like no other.",
    longDesc: "Monsoon Malabar is one of India's most distinctive coffees. Green beans are exposed to the monsoon winds and rains of the Malabar coast for 12-16 weeks, dramatically swelling them and transforming the flavour profile into something uniquely earthy and low-acid. A bold, full-bodied experience that defines Indian coffee culture.",
    rating: 4.7, reviews: 210,
    prices: { "100g": 199, "250g": 499, "500g": 929, "1kg": 1749 },
    badge: undefined, category: "Robusta",
    images: [
      "/images/products/Monsoon_Malabar_Dark_Roast/pexels-melike-2157605065-36765363 (1).jpg",
      "/images/products/Monsoon_Malabar_Dark_Roast/pexels-ibro-6804316.jpg",
    ],
    tastingNotes: ["Tobacco", "Dark Earth", "Woody Oak", "Dried Fruit"],
    brews: ["French Press", "Moka Pot", "Espresso", "South Indian Filter"],
  },
  "4": {
    id: "4",
    name: "Heritage South Indian Filter",
    origin: "Nilgiris, Tamil Nadu",
    roast: "Medium",
    process: "Natural + Chicory blend (30%)",
    description: "The authentic decoction concentrate — just like paati used to make.",
    longDesc: "A traditional South Indian filter coffee blend of 70% Arabica and 30% chicory, inspired by the iconic café decoction passed down through generations. It's balanced, full-bodied and pairs beautifully with hot milk and sugar, exactly like your grandmother made it every morning.",
    rating: 4.6, reviews: 340,
    prices: { "100g": 149, "250g": 349, "500g": 649, "1kg": 1199 },
    badge: "Sale", category: "Filter Coffee",
    images: [
      "/images/products/Heritage_South_Indian_Filter/pexels-rahimegul-15067736.jpg",
      "/images/products/Heritage_South_Indian_Filter/pexels-sureyya-993677887-30909888.jpg",
    ],
    tastingNotes: ["Caramel Sweetness", "Slight Bitterness", "Creamy Body", "Earthy Chicory"],
    brews: ["South Indian Filter (traditional)", "Moka Pot"],
  },
  "5": {
    id: "5",
    name: "Chikmagalur Estate Reserve",
    origin: "Chikmagalur, Karnataka",
    roast: "Light",
    process: "Wine Process (Carbonic Maceration)",
    description: "Floral, bright, wine-processed single-estate Arabica at its peak.",
    longDesc: "Our most experimental and limited offering — a micro-lot processed using carbonic maceration at the Thaneerhulla Estate. The result is a complex, wine-like cup bursting with tropical fruit notes, hibiscus florals and a long, juicy finish. Available only while stock lasts.",
    rating: 4.9, reviews: 126,
    prices: { "100g": 299, "250g": 699, "500g": 1299, "1kg": 2499 },
    badge: "Limited", category: "Arabica",
    images: [
      "/images/products/Chikmagalur_Estate_Reserve/pexels-melike-2157605065-36765363.jpg",
      "/images/products/Chikmagalur_Estate_Reserve/pexels-teysa-tugadi-1282097472-29305567.jpg",
    ],
    tastingNotes: ["Hibiscus", "Strawberry Jam", "Red Wine", "Orange Zest"],
    brews: ["Pour Over", "AeroPress", "Chemex", "Cold Brew"],
  },
  "6": {
    id: "6",
    name: "Nilgiri Breakfast Blend",
    origin: "Nilgiris, Tamil Nadu",
    roast: "Medium",
    process: "Washed",
    description: "Light, aromatic, perfectly balanced — made for milk and mornings.",
    longDesc: "A classic medium-roast blend from the cool, misty Nilgiri hills. Designed to pair beautifully with hot milk, this coffee delivers a smooth, gentle cup with bright citrus highlights and a clean finish. Ideal for the everyday morning ritual.",
    rating: 4.5, reviews: 178,
    prices: { "100g": 179, "250g": 449, "500g": 829, "1kg": 1549 },
    badge: undefined, category: "Blends",
    images: [
      "/images/products/Nilgiri_Breakfast_Blend/pexels-cmrcn-30226618.jpg",
      "/images/products/Nilgiri_Breakfast_Blend/pexels-marek-kupiec-1696944-9892392.jpg",
    ],
    tastingNotes: ["Citrus Brightness", "Mild Sweetness", "Smooth Body", "Clean Finish"],
    brews: ["South Indian Filter", "Drip Coffee", "Pour Over", "French Press"],
  },
};

const GRIND_OPTIONS = ["Whole Bean", "Coarse (French Press)", "Medium (Filter)", "Fine (Espresso)", "Extra Fine (Moka)"];

const BADGE_STYLES: Record<string, string> = {
  Bestseller: "bg-gold text-coffee-950",
  New: "bg-green-eco text-white",
  Sale: "bg-terracotta text-white",
  Limited: "bg-coffee-800 text-white",
};

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const product = PRODUCTS[id];
  const { addItem } = useCartStore();
  const [activeImg, setActiveImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState("250g");
  const [selectedGrind, setSelectedGrind] = useState("Whole Bean");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [wishlist, setWishlist] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    if (session && product) {
      fetch("/api/user/wishlist")
        .then(res => res.json())
        .then(data => {
          if (data.wishlist) {
            setWishlist(data.wishlist.some((item: any) => item.productId === product.id));
          }
        })
        .catch(console.error);
    }
  }, [session, product]);

  const toggleWishlist = async () => {
    if (!session) return;
    const isWishlisted = wishlist;
    setWishlist(!isWishlisted);
    try {
      await fetch("/api/user/wishlist", {
        method: isWishlisted ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          name: product.name,
          price: product.prices[selectedSize],
          image: product.images[0],
        }),
      });
    } catch {
      setWishlist(isWishlisted);
    }
  };

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <h2 className="font-serif text-4xl text-coffee-900 font-bold mb-4">Product Not Found</h2>
        <Link href="/products"><button className="bg-coffee-900 text-white px-8 py-3 rounded-2xl font-bold">Back to Shop</button></Link>
      </div>
    );
  }

  const currentPrice = product.prices[selectedSize];

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: currentPrice,
      quantity,
      weight: selectedSize,
      grind: selectedGrind,
      image: product.images[0],
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-cream border-b border-coffee-100">
        <div className="container mx-auto px-5 lg:px-8 py-4 flex items-center gap-2 text-sm text-coffee-500 font-medium">
          <Link href="/" className="hover:text-coffee-900 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-coffee-900 transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-coffee-900">{product.name}</span>
        </div>
      </div>

      <div className="container mx-auto px-5 lg:px-8 py-12 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Image Gallery */}
          <div className="flex flex-col gap-4">
            <div className="relative aspect-square rounded-[2.5rem] overflow-hidden bg-coffee-50 shadow-xl group">
              <Image
                src={product.images[activeImg]}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {product.badge && (
                <div className={`absolute top-6 left-6 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest shadow-lg ${BADGE_STYLES[product.badge]}`}>
                  {product.badge}
                </div>
              )}
              <button
                onClick={toggleWishlist}
                className={`absolute top-6 right-6 w-10 h-10 rounded-full shadow-lg border flex items-center justify-center transition-all ${wishlist ? "bg-terracotta border-terracotta text-white" : "bg-white/80 border-white/40 text-coffee-400 hover:text-terracotta"}`}
              >
                <Heart className={`w-5 h-5 ${wishlist ? "fill-white" : ""}`} />
              </button>
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${i === activeImg ? "border-coffee-800 shadow-md" : "border-transparent hover:border-coffee-300"}`}
                  >
                    <Image src={img} alt={`View ${i+1}`} fill className="object-cover" sizes="80px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-gold font-bold uppercase tracking-widest text-xs">{product.category}</span>
                <span className="text-coffee-200">·</span>
                <span className="text-coffee-500 text-xs font-medium">{product.origin}</span>
              </div>
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-coffee-900 leading-tight mb-3">{product.name}</h1>
              <p className="text-coffee-500 text-lg leading-relaxed">{product.description}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} className={`w-5 h-5 ${s <= Math.floor(product.rating) ? "fill-gold text-gold" : "fill-coffee-100 text-coffee-100"}`} />
                ))}
              </div>
              <span className="font-bold text-coffee-900">{product.rating}</span>
              <span className="text-coffee-400 text-sm font-medium">({product.reviews} reviews)</span>
            </div>

            {/* Price display */}
            <div className="flex items-baseline gap-3 bg-cream rounded-2xl px-5 py-4 border border-coffee-100">
              <span className="font-mono text-4xl font-bold text-coffee-900">₹{currentPrice}</span>
              <span className="text-coffee-400 text-sm font-medium">/ {selectedSize}</span>
              {product.badge === "Sale" && (
                <span className="text-[10px] font-bold text-terracotta bg-terracotta/10 border border-terracotta/20 px-2 py-1 rounded-full uppercase tracking-wider">Save 20%</span>
              )}
            </div>

            {/* Size Selection */}
            <div>
              <p className="text-sm font-bold text-coffee-800 uppercase tracking-widest mb-3">Select Size</p>
              <div className="flex flex-wrap gap-3">
                {Object.entries(product.prices).map(([size, price]) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`flex flex-col items-center px-5 py-3 rounded-2xl border-2 transition-all min-w-[80px] ${
                      selectedSize === size
                        ? "border-coffee-900 bg-coffee-900 text-white shadow-lg"
                        : "border-coffee-200 hover:border-coffee-500 text-coffee-700 hover:text-coffee-900"
                    }`}
                  >
                    <span className="font-bold text-sm">{size}</span>
                    <span className={`font-mono text-xs mt-0.5 ${selectedSize === size ? "text-coffee-200" : "text-coffee-500"}`}>₹{price}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Grind Selection */}
            <div>
              <p className="text-sm font-bold text-coffee-800 uppercase tracking-widest mb-3">Grind Type</p>
              <div className="flex flex-wrap gap-2">
                {GRIND_OPTIONS.map(g => (
                  <button
                    key={g}
                    onClick={() => setSelectedGrind(g)}
                    className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                      selectedGrind === g
                        ? "border-coffee-900 bg-coffee-100 text-coffee-900 font-bold"
                        : "border-coffee-200 text-coffee-600 hover:border-coffee-400"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity + Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <div className="flex items-center border-2 border-coffee-200 rounded-2xl overflow-hidden h-14 w-fit">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-5 hover:bg-coffee-50 text-coffee-800 transition-colors h-full text-xl">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-bold text-coffee-900 text-lg select-none">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} className="px-5 hover:bg-coffee-50 text-coffee-800 transition-colors h-full text-xl">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center gap-3 h-14 font-bold text-base rounded-2xl transition-all shadow-lg ${
                  added
                    ? "bg-green-eco text-white"
                    : "bg-coffee-900 hover:bg-coffee-800 text-white hover:shadow-xl"
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                {added ? "Added to Cart! ✓" : `Add to Cart — ₹${(currentPrice * quantity).toLocaleString("en-IN")}`}
              </button>
            </div>

            {/* Trust line */}
            <div className="flex items-center gap-2 text-coffee-500 text-sm font-medium">
              <Truck className="w-4 h-4 text-green-eco" />
              <span>Free shipping on orders ₹500+. Ships within 2 business days.</span>
            </div>

            {/* Product meta */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              {[
                { icon: Award, label: "Roast", val: product.roast },
                { icon: Leaf, label: "Process", val: product.process },
                { icon: Package, label: "Origin", val: product.origin },
              ].map(({ icon: Icon, label, val }) => (
                <div key={label} className="bg-cream rounded-2xl p-4 border border-coffee-100">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="w-4 h-4 text-coffee-500" strokeWidth={1.5} />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-coffee-400">{label}</span>
                  </div>
                  <p className="font-bold text-coffee-900 text-sm leading-tight">{val}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Details section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h2 className="font-serif text-3xl font-bold text-coffee-900 mb-5">About This Coffee</h2>
            <p className="text-coffee-600 text-lg leading-relaxed">{product.longDesc}</p>

            <h3 className="font-serif text-2xl font-bold text-coffee-900 mt-10 mb-4">Best Brewed With</h3>
            <div className="flex flex-wrap gap-3">
              {product.brews.map(b => (
                <span key={b} className="px-4 py-2 bg-cream border border-coffee-200 rounded-xl text-coffee-700 text-sm font-bold">☕ {b}</span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-serif text-2xl font-bold text-coffee-900 mb-5">Tasting Notes</h3>
            <div className="space-y-3">
              {product.tastingNotes.map((note, i) => (
                <div key={note} className="flex items-center gap-3">
                  <div className="w-full bg-coffee-100 rounded-full h-2 overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-coffee-600 to-gold rounded-full" style={{ width: `${100 - i * 15}%` }} />
                  </div>
                  <span className="text-sm font-bold text-coffee-700 whitespace-nowrap min-w-[110px]">{note}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        {/* We use a valid ObjectId string for testing if the id is a short string like "1" */}
        <ProductReviews 
          productId={product.id.length < 24 ? product.id.padStart(24, '0') : product.id} 
          initialAvgRating={product.rating} 
          initialReviewCount={product.reviews} 
        />

        {/* Back link */}
        <div className="mt-16 border-t border-coffee-100 pt-10">
          <Link href="/products" className="inline-flex items-center gap-2 text-coffee-700 font-bold hover:text-coffee-900 transition-colors">
            <ArrowLeft className="w-5 h-5" /> Back to All Blends
          </Link>
        </div>
      </div>
    </div>
  );
}
