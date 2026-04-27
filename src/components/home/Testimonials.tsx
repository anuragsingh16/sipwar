import { FallbackImage } from "@/components/ui/FallbackImage";
import { Star, Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Priya Menon",
    role: "Coffee Enthusiast, Phagwara, Punjab – 2026",
    review: "I've tried so many brands — Sipwar is just incomparable. The aroma hits you instantly, and that smooth finish makes every morning sacred.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?img=47",
    verified: true,
    product: "Filter Coffee Arabica AA",
  },
  {
    name: "Rahul Sharma",
    role: "Fitness Coach, Phagwara, Punjab – 2026",
    review: "The Adaptogenic Morning Blend changed my life. No jitters, no crash, just clean, focused energy. Perfect for my early 5AM sessions.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?img=12",
    verified: true,
    product: "Adaptogenic Morning Blend",
  },
  {
    name: "Aishwarya Nair",
    role: "Food Blogger, Phagwara, Punjab – 2026",
    review: "As someone from Kerala, I'm extremely particular about filter coffee. Sipwar's decoction blend nails that traditional South Indian taste beautifully.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?img=44",
    verified: true,
    product: "Heritage Filter Coffee",
  },
];

export default function Testimonials() {
  return (
    <section className="py-28 bg-coffee-950 overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(207,181,59,0.05)_0%,_transparent_70%)] pointer-events-none" />
      <div className="container mx-auto px-5 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <p className="text-gold font-bold uppercase tracking-widest text-xs mb-3">What Our Sippers Say</p>
          <h2 className="font-serif text-4xl md:text-[3rem] font-bold text-white">12,000+ Happy Brews</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="bg-coffee-900 border border-coffee-800 rounded-[2rem] p-8 flex flex-col gap-5 hover:border-gold/30 hover:-translate-y-1 transition-all duration-300 relative">
              <Quote className="w-8 h-8 text-gold/20 absolute top-8 right-8" />

              {/* Stars */}
              <div className="flex gap-1">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} className={`w-4 h-4 ${s <= t.rating ? "fill-gold text-gold" : "text-coffee-700"}`} />
                ))}
              </div>

              {/* Quote */}
              <p className="text-coffee-200 text-lg leading-relaxed font-light italic flex-grow">
                "{t.review}"
              </p>

              {/* Product tag */}
              <span className="self-start text-[10px] font-bold uppercase tracking-widest text-gold bg-gold/10 border border-gold/20 px-3 py-1 rounded-full">
                {t.product}
              </span>

              {/* Author */}
              <div className="flex items-center gap-4 pt-4 border-t border-coffee-800">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-coffee-700 flex-shrink-0">
                  <FallbackImage src={t.avatar} alt={t.name} fill className="object-cover" sizes="48px" context="avatar" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-white text-sm">{t.name}</p>
                    {t.verified && (
                      <span className="text-[9px] font-bold text-green-eco bg-green-eco/10 border border-green-eco/20 px-1.5 py-0.5 rounded-full">✓ Verified</span>
                    )}
                  </div>
                  <p className="text-coffee-500 text-xs font-medium mt-0.5">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
