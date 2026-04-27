import { FallbackImage } from "@/components/ui/FallbackImage";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const FARM_IMG = "/images/our_story/direct_trade.jpg";

export default function BrandPhilosophy() {
  return (
    <section className="py-28 bg-cream overflow-hidden">
      <div className="container mx-auto px-5 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image side */}
          <div className="relative">
            <div className="rounded-[3rem] overflow-hidden aspect-[4/5] shadow-2xl">
              <FallbackImage src={FARM_IMG} alt="Coffee Farm" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-coffee-950/60 via-transparent to-transparent" />
            </div>
            {/* Floating stat card */}
            <div className="absolute -bottom-6 -right-4 lg:-right-10 bg-white rounded-2xl shadow-xl p-5 border border-coffee-100 max-w-[180px]">
              <p className="font-mono text-4xl font-bold text-coffee-900 leading-none mb-1">500+</p>
              <p className="text-coffee-500 text-xs font-medium">Farmers supported across South India</p>
            </div>
            {/* Floating stat 2 */}
            <div className="absolute -top-4 -left-4 lg:-left-8 bg-coffee-900 rounded-2xl shadow-xl p-4 border border-coffee-800">
              <p className="text-gold text-xs font-bold uppercase tracking-widest mb-1">Since 2025</p>
              <p className="font-serif text-xl font-bold text-white leading-tight">#IndianBrand</p>
            </div>
          </div>

          {/* Text side */}
          <div className="flex flex-col gap-7">
            <div>
              <p className="text-gold font-bold uppercase tracking-widest text-xs mb-4">Our Philosophy</p>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-coffee-900 leading-[1.1] mb-6">Coffee with<br/> Purpose.</h2>
              <p className="text-coffee-600 text-lg leading-relaxed mb-4">
                We believe great coffee starts with the people who grow it. By partnering directly with 500+ small-holder farmers across Coorg, Chikmagalur, Nilgiris, and Wayanad, we ensure fair wages and sustainable agriculture.
              </p>
              <p className="text-coffee-600 text-lg leading-relaxed">
                Our unique wellness blends combine premium Indian Arabica and Robusta with powerful adaptogens — creating a cup that doesn't just taste good, it makes you feel extraordinary.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                { val: "500+", label: "Farmers" },
                { val: "5", label: "States" },
                { val: "0%", label: "Waste" },
              ].map(({ val, label }, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 text-center shadow-sm border border-coffee-100 hover:-translate-y-1 transition-transform">
                  <span className="font-mono text-3xl font-bold text-coffee-900 block">{val}</span>
                  <span className="text-xs font-bold uppercase tracking-widest text-coffee-500 mt-1 block">{label}</span>
                </div>
              ))}
            </div>

            <Link href="/about">
              <button className="inline-flex items-center gap-2 text-coffee-900 font-bold text-base border-b-2 border-coffee-900 pb-1 hover:gap-4 transition-all w-fit">
                Read Our Story <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
