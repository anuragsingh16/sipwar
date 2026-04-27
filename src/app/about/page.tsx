import { FallbackImage } from "@/components/ui/FallbackImage";
import Link from "next/link";
import { ArrowRight, Leaf, Droplet, Sun, Users, MapPin, Heart, Coffee } from "lucide-react";

const HERO_IMG    = "/images/our_story/pexels-michael-burrows-7125765.jpg";
const FARMER_IMG  = "/images/our_story/direct_trade.jpg";
const PROCESS_IMG = "/images/coffee-hero.jpg";
const TEAM_IMG    = "/images/journal/meet_the_budangiri.jpg";

const STANDARDS = [
  { icon: Sun, color: "text-gold", bg: "bg-gold/10", title: "Shade Grown", desc: "Cultivated under natural forest canopy for slower maturation and richer flavor." },
  { icon: Droplet, color: "text-blue-400", bg: "bg-blue-400/10", title: "Mountain Water", desc: "Processed using pristine natural springs from the Ghats." },
  { icon: Leaf, color: "text-green-eco", bg: "bg-green-eco/10", title: "Zero Pesticides", desc: "100% organic-certified estates with no chemical intervention." },
  { icon: Users, color: "text-terracotta", bg: "bg-terracotta/10", title: "Community First", desc: "25% of profits fund education and healthcare in farming communities." },
];

const REGIONS = [
  { name: "Coorg, Karnataka", elevation: "1,000–1,500m", note: "Bold, chocolatey, full-bodied", count: "200+ Farmers" },
  { name: "Chikmagalur, Karnataka", elevation: "900–2,000m", note: "Floral, wine, complex", count: "150+ Farmers" },
  { name: "Nilgiris, Tamil Nadu", elevation: "1,200–1,800m", note: "Light, aromatic, citrus notes", count: "80+ Farmers" },
  { name: "Wayanad, Kerala", elevation: "700–1,400m", note: "Spicy, earthy, smooth", count: "70+ Farmers" },
];

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <div className="relative h-[65vh] min-h-[400px] flex items-end overflow-hidden">
        <FallbackImage src={HERO_IMG} alt="Coffee farm" fill className="object-cover" sizes="100vw" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-coffee-950/30 via-coffee-950/40 to-coffee-950/90" />
        <div className="relative z-10 container mx-auto px-5 lg:px-8 pb-16">
          <p className="text-gold font-bold uppercase tracking-widest text-xs mb-4">Est. 2022 · South India</p>
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-white leading-[1.0] mb-4">Our Story</h1>
          <p className="text-coffee-200 text-xl font-light max-w-2xl">Rooted in tradition, driven by wellness. The journey of Sipwar Coffee — from farm to your cup.</p>
        </div>
      </div>

      {/* Origin Story */}
      <div className="py-28 bg-white">
        <div className="container mx-auto px-5 lg:px-8 max-w-4xl text-center">
          <p className="text-gold font-bold uppercase tracking-widest text-xs mb-5">How it began</p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-coffee-900 mb-8 leading-tight">Born from the Western Ghats</h2>
          <p className="text-lg text-coffee-600 leading-relaxed mb-6">
            Sipwar began with a simple question: <em>How can we make our daily ritual of coffee healthier without sacrificing the rich, robust flavor we love?</em> Our journey took us to the lush hills of Coorg, Karnataka, where coffee has been cultivated under the shade of native trees for generations.
          </p>
          <p className="text-lg text-coffee-600 leading-relaxed">
            We discovered small-holder farmers with extraordinary, world-class coffee — but no premium market access. That gap became our mission. "Chuski Ki Ladai" — the battle of the sip — became more than a tagline. It became a war cry for quality, fairness, and wellness in every cup.
          </p>
        </div>
      </div>

      {/* Farmer Partnership */}
      <div className="py-24 bg-cream">
        <div className="container mx-auto px-5 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="rounded-[3rem] overflow-hidden aspect-[4/5] shadow-2xl">
                <FallbackImage src={FARMER_IMG} alt="Coffee farmer" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
              </div>
              <div className="absolute -bottom-6 -right-4 lg:-right-8 bg-coffee-900 text-white rounded-2xl p-5 shadow-xl">
                <p className="font-mono text-4xl font-bold text-gold leading-none mb-1">30%</p>
                <p className="text-coffee-200 text-xs font-medium">above Fair Trade minimum</p>
              </div>
            </div>

            <div className="space-y-6">
              <p className="text-gold font-bold uppercase tracking-widest text-xs">Direct Trade Promise</p>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-coffee-900 leading-tight">Sustainable &amp; Direct Trade</h2>
              <p className="text-lg text-coffee-600 leading-relaxed">
                We skip the middlemen. By partnering directly with over 500 small-holder farmers across South India, we ensure that the people who grow our coffee receive a premium price — often 30% higher than fair-trade standards.
              </p>
              <p className="text-lg text-coffee-600 leading-relaxed">
                This direct relationship allows us to collaborate on regenerative agricultural practices, ensuring the soil remains fertile and local wildlife thrives alongside the coffee plants.
              </p>

              {/* Regions */}
              <div className="space-y-3 pt-4">
                {REGIONS.map((r, i) => (
                  <div key={i} className="flex items-center gap-4 bg-white rounded-2xl p-4 border border-coffee-100 shadow-sm hover:-translate-y-0.5 transition-transform">
                    <div className="w-10 h-10 bg-coffee-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-coffee-700" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-bold text-coffee-900 text-sm">{r.name}</p>
                        <span className="text-[10px] font-bold text-coffee-500 bg-coffee-50 border border-coffee-200 px-2 py-0.5 rounded-full flex-shrink-0">{r.count}</span>
                      </div>
                      <p className="text-coffee-500 text-xs mt-0.5">{r.elevation} · {r.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Process */}
      <div className="py-24 bg-white">
        <div className="container mx-auto px-5 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-gold font-bold uppercase tracking-widest text-xs mb-5">Roasting &amp; Processing</p>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-coffee-900 leading-tight mb-6">Roasted to Order, Every Time</h2>
              <p className="text-lg text-coffee-600 leading-relaxed mb-6">
                We don't maintain stale warehouse stock. Every batch is roasted fresh within 48 hours of your order, ensuring maximum flavor and aroma reach your doorstep.
              </p>
              <div className="space-y-4">
                {[
                  { step: "01", label: "Green bean sourcing", desc: "Direct from partner farms, hand-sorted for grade" },
                  { step: "02", label: "Small-batch roasting", desc: "Roasted to profile by our certified Q-Graders" },
                  { step: "03", label: "48-hour degassing", desc: "Allowing CO₂ to escape for optimum flavor extraction" },
                  { step: "04", label: "Nitrogen-flush sealing", desc: "Preserving freshness until it reaches you" },
                ].map(s => (
                  <div key={s.step} className="flex gap-4 items-start">
                    <span className="font-mono text-sm font-bold text-gold flex-shrink-0 mt-0.5">{s.step}</span>
                    <div>
                      <p className="font-bold text-coffee-900 text-sm">{s.label}</p>
                      <p className="text-coffee-500 text-xs mt-0.5">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[3rem] overflow-hidden aspect-[4/5] shadow-2xl relative">
              <FallbackImage src={PROCESS_IMG} alt="Coffee roasting" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
            </div>
          </div>
        </div>
      </div>

      {/* Standards */}
      <div className="py-24 bg-coffee-950">
        <div className="container mx-auto px-5 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-gold font-bold uppercase tracking-widest text-xs mb-3">Our Non-Negotiables</p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-white">The Sipwar Standard</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {STANDARDS.map(({ icon: Icon, color, bg, title, desc }, i) => (
              <div key={i} className="bg-coffee-900 border border-coffee-800 rounded-[2rem] p-8 flex flex-col gap-4 hover:border-gold/30 hover:-translate-y-1 transition-all">
                <div className={`w-14 h-14 ${bg} rounded-2xl flex items-center justify-center`}>
                  <Icon className={`w-7 h-7 ${color}`} strokeWidth={1.5} />
                </div>
                <h4 className="font-bold text-white text-lg">{title}</h4>
                <p className="text-coffee-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="py-24 bg-white">
        <div className="container mx-auto px-5 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative rounded-[3rem] overflow-hidden aspect-video shadow-2xl">
              <FallbackImage src={TEAM_IMG} alt="Sipwar team" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-coffee-950/60 to-transparent" />
              <div className="absolute bottom-6 left-6">
                <p className="text-white font-serif text-xl font-bold">The Sipwar Team</p>
                <p className="text-coffee-300 text-sm">Phagwara, Punjab – 2026</p>
              </div>
            </div>
            <div>
              <p className="text-gold font-bold uppercase tracking-widest text-xs mb-5">The People Behind the Cup</p>
              <h2 className="font-serif text-4xl font-bold text-coffee-900 mb-6 leading-tight">Built by coffee lovers, for coffee lovers.</h2>
              <p className="text-lg text-coffee-600 leading-relaxed mb-6">
                Sipwar was founded by a team of coffee enthusiasts, health professionals, and social entrepreneurs who believed India deserved a specialty coffee brand truly its own. We are certified Q-Graders, former farmers, nutritionists, and yes — serious coffee addicts.
              </p>
              <Link href="/products">
                <button className="inline-flex items-center gap-2 bg-coffee-900 hover:bg-coffee-800 text-white font-bold px-8 py-4 rounded-2xl transition-all hover:shadow-xl text-sm">
                  Shop Our Blends <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="relative py-28 overflow-hidden">
        <FallbackImage src={HERO_IMG} alt="Coffee pour" fill className="object-cover opacity-20" sizes="100vw" />
        <div className="absolute inset-0 bg-coffee-950/90" />
        <div className="relative z-10 container mx-auto px-5 lg:px-8 text-center">
          <Coffee className="w-12 h-12 text-gold mx-auto mb-6" strokeWidth={1} />
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">Taste the Difference</h2>
          <p className="text-coffee-300 max-w-md mx-auto mb-8 leading-relaxed text-lg">Every cup you brew supports a farmer, a family, and a future.</p>
          <Link href="/products">
            <button className="bg-gradient-to-r from-gold to-amber-500 text-coffee-950 font-bold px-10 py-4 rounded-2xl hover:shadow-[0_0_40px_rgba(207,181,59,0.3)] transition-all">
              Start Your Coffee Journey
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
