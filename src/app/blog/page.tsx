"use client";

import Link from "next/link";
import { FallbackImage } from "@/components/ui/FallbackImage";
import { useState } from "react";
import { Clock, ArrowRight } from "lucide-react";

const POSTS = [
  {
    slug: "science-adaptogenic-coffee",
    title: "The Science Behind Adaptogenic Coffee",
    date: "Oct 12, 2024",
    category: "Health",
    readTime: "5 min",
    excerpt: "How Ashwagandha and Lion's Mane combined with premium Arabica can eliminate the caffeine crash while tripling cognitive performance.",
    featured: true,
    image: "/images/products/Adaptogenic_Morning_Blend/pexels-cihanyuce-30349811.jpg",
  },
  {
    slug: "mastering-south-indian-filter",
    title: "Mastering the South Indian Filter",
    date: "Sep 28, 2024",
    category: "Brewing",
    readTime: "8 min",
    excerpt: "A step-by-step guide to achieving the perfect decoction using our Heritage Filter Blend and a traditional brass filter.",
    image: "/images/products/Heritage_South_Indian_Filter/pexels-sureyya-993677887-30909888.jpg",
  },
  {
    slug: "farmers-of-baba-budangiri",
    title: "Meet the Farmers of Baba Budangiri",
    date: "Sep 15, 2024",
    category: "Stories",
    readTime: "12 min",
    excerpt: "Journey with us to the birthplace of coffee in India and meet the families who have been cultivating these beans since 1890.",
    image: "/images/journal/meet_the_budangiri.jpg",
  },
  {
    slug: "robustas-renaissance",
    title: "Robusta's Renaissance",
    date: "Aug 30, 2024",
    category: "Education",
    readTime: "6 min",
    excerpt: "Why high-quality Indian Robusta is finally getting the respect it deserves in the specialty coffee world.",
    image: "/images/products/Monsoon_Malabar_Dark_Roast/pexels-ibro-6804316.jpg",
  },
  {
    slug: "coffee-processing-methods",
    title: "Deciphering Coffee Processing Methods",
    date: "Aug 14, 2024",
    category: "Education",
    readTime: "7 min",
    excerpt: "Washed, Natural, or Honey processed? How the method chosen at the farm fundamentally alters the flavor in your cup.",
    image: "/images/products/Chikmagalur_Estate_Reserve/pexels-teysa-tugadi-1282097472-29305567.jpg",
  },
  {
    slug: "sustainability-zero-waste",
    title: "Sustainability at Sipwar: Our Zero Waste Goal",
    date: "Jul 22, 2024",
    category: "Stories",
    readTime: "4 min",
    excerpt: "Our aggressive new timeline to ensure 100% of our packaging is compostable by the end of 2025.",
    image: "/images/journal/sustainability.jpg",
  },
];

const CATS = ["All", "Brewing", "Health", "Education", "Stories"];

const CAT_COLORS: Record<string, string> = {
  Health: "bg-green-eco/90 text-white",
  Brewing: "bg-terracotta/90 text-white",
  Education: "bg-coffee-800/90 text-white",
  Stories: "bg-gold/90 text-coffee-950",
};

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const featured = POSTS.find(p => p.featured);
  const regular = POSTS.filter(p => !p.featured && (activeCategory === "All" || p.category === activeCategory));

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <div className="relative h-[40vh] min-h-[260px] flex items-end overflow-hidden bg-coffee-950">
        <FallbackImage
          src="/images/coffee-hero.jpg"
          alt="Coffee journal"
          fill
          className="object-cover opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-coffee-950/20 to-coffee-950/90" />
        <div className="relative z-10 container mx-auto px-5 lg:px-8 pb-12">
          <p className="text-gold font-bold uppercase tracking-widest text-xs mb-3">Know Your Coffee</p>
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-white">The Coffee Journal</h1>
          <p className="text-coffee-200 text-lg mt-2 font-light">Brewing guides, farm stories, and the science of wellness coffee.</p>
        </div>
      </div>

      {/* Category pills */}
      <div className="sticky top-[80px] z-40 bg-white/95 backdrop-blur-md border-b border-coffee-100 shadow-sm">
        <div className="container mx-auto px-5 lg:px-8 py-3 flex gap-3 overflow-x-auto no-scrollbar">
          {CATS.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-bold transition-all border ${
                activeCategory === cat
                  ? "bg-coffee-900 text-white border-coffee-900"
                  : "border-coffee-200 text-coffee-600 hover:border-coffee-500 hover:text-coffee-900"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-5 lg:px-8 py-16 max-w-7xl">
        {/* Featured post */}
        {featured && activeCategory === "All" && (
          <div className="mb-16">
            <p className="text-gold font-bold uppercase tracking-widest text-xs mb-6">Featured Article</p>
            <Link href={`/blog/${featured.slug}`} className="group grid md:grid-cols-2 gap-8 bg-white rounded-[2.5rem] border border-coffee-100 shadow-sm hover:shadow-2xl transition-all overflow-hidden">
              <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[360px] overflow-hidden">
                <FallbackImage src={featured.image} alt={featured.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 768px) 100vw, 50vw" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/5" />
                <div className={`absolute top-6 left-6 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest ${CAT_COLORS[featured.category]}`}>
                  {featured.category}
                </div>
              </div>
              <div className="p-10 flex flex-col gap-4 justify-center">
                <div className="flex items-center gap-3 text-xs text-coffee-400 font-medium uppercase tracking-wider">
                  <span>{featured.date}</span>
                  <span className="w-1 h-1 bg-coffee-300 rounded-full" />
                  <Clock className="w-3 h-3" />
                  <span>{featured.readTime} read</span>
                </div>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-coffee-900 group-hover:text-terracotta transition-colors leading-tight">{featured.title}</h2>
                <p className="text-coffee-500 leading-relaxed text-base">{featured.excerpt}</p>
                <div className="flex items-center gap-2 text-coffee-800 font-bold text-sm mt-2 group-hover:gap-4 transition-all">
                  Read Full Article <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Post grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {regular.map((post, i) => (
            <Link href={`/blog/${post.slug}`} key={i} className="group flex flex-col bg-white rounded-[2rem] border border-coffee-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
              <div className="relative aspect-[4/3] overflow-hidden">
                <FallbackImage src={post.image} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest shadow ${CAT_COLORS[post.category] || "bg-coffee-800 text-white"}`}>
                  {post.category}
                </div>
              </div>
              <div className="p-7 flex flex-col flex-grow gap-3">
                <div className="flex items-center gap-2 text-[10px] text-coffee-400 font-bold uppercase tracking-wider">
                  <span>{post.date}</span>
                  <span>·</span>
                  <Clock className="w-3 h-3" />
                  <span>{post.readTime}</span>
                </div>
                <h3 className="font-serif text-xl font-bold text-coffee-900 group-hover:text-terracotta transition-colors line-clamp-2 leading-snug">{post.title}</h3>
                <p className="text-coffee-500 text-sm leading-relaxed line-clamp-3 flex-grow">{post.excerpt}</p>
                <div className="flex items-center gap-1.5 text-coffee-800 font-bold text-sm mt-3 group-hover:gap-3 transition-all">
                  Read More <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {regular.length === 0 && activeCategory !== "All" && (
          <div className="text-center py-16">
            <p className="font-serif text-2xl text-coffee-700">No articles in this category yet.</p>
            <button onClick={() => setActiveCategory("All")} className="mt-4 text-coffee-500 underline text-sm">View all articles</button>
          </div>
        )}
      </div>

      {/* Newsletter block */}
      <div className="bg-coffee-950 py-24 text-center">
        <p className="text-gold font-bold uppercase tracking-widest text-xs mb-4">Never Miss a Sip</p>
        <h2 className="font-serif text-4xl font-bold text-white mb-4">Weekly Brewing Tips in Your Inbox</h2>
        <p className="text-coffee-300 max-w-md mx-auto mb-8">Join 12,000+ coffee enthusiasts getting exclusive guides every Tuesday morning.</p>
        <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto px-4" onSubmit={e => e.preventDefault()}>
          <input type="email" placeholder="your@email.com" className="flex-1 bg-coffee-800 border border-coffee-700 rounded-xl px-4 py-3 text-white placeholder:text-coffee-500 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50" />
          <button type="submit" className="bg-gradient-to-r from-gold to-amber-500 text-coffee-950 font-bold px-7 py-3 rounded-xl hover:from-yellow-400 transition-all text-sm flex-shrink-0">
            Subscribe Free
          </button>
        </form>
      </div>
    </div>
  );
}
