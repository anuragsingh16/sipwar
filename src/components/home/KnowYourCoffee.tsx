import Link from "next/link";
import { FallbackImage } from "@/components/ui/FallbackImage";
import { ArrowRight } from "lucide-react";

const ARTICLES = [
  {
    badge: "Stories",
    badgeColor: "bg-coffee-800 text-white",
    title: "Farm to Cup Journey",
    desc: "Discover the path our coffee takes from sustainable farms in Coorg to your morning cup.",
    link: "/blog",
    image: "/images/our_story/direct_trade.jpg",
  },
  {
    badge: "Health",
    badgeColor: "bg-green-eco text-white",
    title: "Health Benefits",
    desc: "How our adaptogenic blends boost energy naturally, support immunity, and reduce inflammation.",
    link: "/blog",
    image: "/images/products/Adaptogenic_Morning_Blend/pexels-cihanyuce-30349811.jpg",
  },
  {
    badge: "Brewing",
    badgeColor: "bg-terracotta text-white",
    title: "Brewing Mastery",
    desc: "Master the art of the perfect pour-over with our step-by-step specialist guide.",
    link: "/blog",
    image: "/images/products/Heritage_South_Indian_Filter/pexels-sureyya-993677887-30909888.jpg",
  },
];

export default function KnowYourCoffee() {
  return (
    <section className="py-28 bg-cream">
      <div className="container mx-auto px-5 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-14">
          <div>
            <p className="text-gold font-bold uppercase tracking-widest text-xs mb-3">The Coffee Journal</p>
            <h2 className="font-serif text-4xl md:text-[3.25rem] font-bold text-coffee-900 leading-tight">Know Your Coffee</h2>
          </div>
          <Link href="/blog" className="flex items-center gap-2 text-coffee-800 font-bold text-sm border-b-2 border-coffee-800 pb-1 hover:gap-4 transition-all self-start md:self-end flex-shrink-0">
            View All Articles <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ARTICLES.map((a, i) => (
            <div key={i} className="group bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl border border-coffee-100 transition-all duration-300 hover:-translate-y-1 flex flex-col">
              <Link href={a.link} className="block relative aspect-[4/3] overflow-hidden">
                <FallbackImage src={a.image} alt={a.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 768px) 100vw, 33vw" />
                <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest shadow ${a.badgeColor}`}>
                  {a.badge}
                </div>
              </Link>

              <div className="p-7 flex flex-col flex-grow">
                <Link href={a.link}>
                  <h3 className="font-serif text-2xl font-bold text-coffee-900 mb-3 group-hover:text-terracotta transition-colors line-clamp-2">{a.title}</h3>
                </Link>
                <p className="text-coffee-500 text-sm leading-relaxed mb-6 flex-grow">{a.desc}</p>
                <Link href={a.link} className="inline-flex items-center gap-1.5 text-coffee-800 font-bold text-sm hover:gap-3 transition-all">
                  Read Article <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
