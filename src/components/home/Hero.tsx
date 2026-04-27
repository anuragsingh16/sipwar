import Link from "next/link";
import Image from "next/image";
import { FallbackImage } from "@/components/ui/FallbackImage";
import { ArrowRight, Sparkles, Star } from "lucide-react";

const HERO_IMG = "/images/coffee-hero.jpg";
const BEANS_IMG = "/images/products/Filter_Coffee_Arabica_AA/pexels-esranurkalay-10101325 (1).jpg";

export default function Hero() {
  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-coffee-950">
      {/* BG image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={HERO_IMG}
          alt="Coffee brewing background"
          fill
          priority
          className="object-cover object-center opacity-40"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-coffee-950 via-coffee-950/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-coffee-950 via-transparent to-coffee-950/30" />
      </div>

      {/* Floating beans accent */}
      <div className="absolute -right-20 top-1/4 w-[400px] h-[400px] rounded-full overflow-hidden opacity-20 blur-3xl bg-gold" />

      <div className="relative z-10 container mx-auto px-5 lg:px-8 py-20 grid md:grid-cols-2 gap-16 items-center">
        {/* Left */}
        <div className="flex flex-col gap-7">
          <div className="inline-flex items-center gap-2 self-start px-4 py-1.5 rounded-full bg-gold/10 border border-gold/30 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span className="text-gold font-semibold tracking-widest text-xs uppercase">Filter Coffee Arabica AA — Now Available</span>
          </div>

          <h1 className="font-serif text-[3.5rem] md:text-[5rem] leading-[1.02] font-bold text-white">
            Brewing the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-yellow-300 to-amber-200">
              Future of Coffee
            </span>
          </h1>

          <p className="text-coffee-200 text-lg md:text-xl font-light leading-relaxed max-w-lg">
            Premium Indian specialty coffee. Ethically sourced. Wellness-driven. From the farms of Coorg to your cup.
          </p>

          {/* Rating proof */}
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-coffee-950 bg-coffee-700 overflow-hidden">
                  <FallbackImage src={`https://i.pravatar.cc/80?img=${i + 10}`} alt="Customer" width={32} height={32} className="object-cover" context="avatar" />
                </div>
              ))}
            </div>
            <div>
              <div className="flex gap-0.5 mb-0.5">
                {[1,2,3,4,5].map(s => <Star key={s} className="w-3.5 h-3.5 fill-gold text-gold" />)}
              </div>
              <p className="text-coffee-300 text-xs font-medium">4.9 from 1,200+ happy sippers</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Link href="/products">
              <button className="flex items-center justify-center gap-2 h-14 px-10 bg-gradient-to-r from-gold to-amber-500 text-coffee-950 font-bold text-base rounded-2xl shadow-[0_0_40px_rgba(207,181,59,0.25)] hover:shadow-[0_0_60px_rgba(207,181,59,0.4)] hover:-translate-y-0.5 transition-all">
                Start Your Coffee Journey <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
            <Link href="/about">
              <button className="flex items-center justify-center gap-2 h-14 px-8 bg-white/5 hover:bg-white/10 text-white font-semibold text-base rounded-2xl border border-white/20 backdrop-blur-sm transition-all">
                <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg> Our Story
              </button>
            </Link>
          </div>
        </div>

        {/* Right – Product card */}
        <div className="hidden md:flex justify-center lg:justify-end">
          <div className="relative w-full max-w-[340px]">
            {/* Floating card */}
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.6)] border border-white/10 aspect-[3/4] group">
              <Image
                src={BEANS_IMG}
                alt="Coffee Arabica AA"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="340px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-coffee-950/90 via-coffee-950/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gold text-[10px] font-bold uppercase tracking-widest">Bestseller</span>
                    <div className="flex gap-0.5">{[1,2,3,4,5].map(s => <Star key={s} className="w-3 h-3 fill-gold text-gold" />)}</div>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-white leading-tight mb-3">Filter Coffee Arabica AA</h3>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-2xl font-bold text-white">₹599</span>
                    <Link href="/products/1">
                      <button className="text-xs font-bold bg-gold text-coffee-950 px-4 py-2 rounded-xl hover:from-yellow-400 transition-all">
                        Add to Cart
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -top-4 -right-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-4 py-3 shadow-xl">
              <p className="text-xs font-bold text-coffee-300 uppercase tracking-wider mb-0.5">100% Arabica</p>
              <p className="text-white font-serif text-lg font-bold leading-none">#Indian Brand</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" />
    </section>
  );
}
