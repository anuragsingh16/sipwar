import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar, User } from "lucide-react";

export const metadata = {
  title: "Mastering the South Indian Filter | Sipwar Journal",
  description:
    "A step-by-step guide to achieving the perfect decoction using our Heritage Filter Blend and a traditional brass filter.",
};

export default function SouthIndianFilterArticle() {
  const steps = [
    { num: "01", title: "Assemble Your Filter", desc: "Place the perforated disc (press) inside the upper chamber. Use a traditional brass filter for best results — steel works, but brass imparts nothing." },
    { num: "02", title: "Measure the Coffee", desc: "Use 2–3 heaped tablespoons (20–25g) of medium-fine ground Heritage Filter Blend per 150ml of water. Our pre-ground filter roast is calibrated for this exactly." },
    { num: "03", title: "Load and Press", desc: "Add the ground coffee above the perforated disc. Press the disc down gently — firm enough to compact slightly, but not so hard no water can percolate. This is the most critical step." },
    { num: "04", title: "Add Boiling Water", desc: "Pour 80°C water (just off the boil) above the press. The decoction will slowly drip through over 10–15 minutes. Don't rush it with hotter water — 80°C is optimal." },
    { num: "05", title: "Serve as Kumbakonam Degree", desc: "For the classic experience, add 1–2 tablespoons of the dark decoction to a stainless steel tumbler. Top with hot full-fat milk. Aerate by pouring between tumbler and davara from a height." },
    { num: "06", title: "Sweeten to Taste", desc: "Traditionally sweetened with cane sugar. Jaggery powder adds an earthy sweetness that pairs particularly well with our blend." },
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Banner */}
      <div className="relative h-[55vh] min-h-[340px] overflow-hidden bg-coffee-950">
        <Image
          src="/images/products/Heritage_South_Indian_Filter/pexels-sureyya-993677887-30909888.jpg"
          alt="South Indian Filter Coffee"
          fill
          priority
          className="object-cover opacity-50"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-coffee-950/20 to-coffee-950/90" />
        <div className="relative z-10 container mx-auto px-5 lg:px-8 h-full flex flex-col justify-end pb-12">
          <nav className="flex items-center gap-2 text-coffee-300 text-sm mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-white transition-colors">Journal</Link>
            <span>/</span>
            <span className="text-white">South Indian Filter</span>
          </nav>
          <span className="inline-block bg-terracotta/90 text-white text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full mb-4 w-fit">
            Brewing
          </span>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-4xl">
            Mastering the South Indian Filter
          </h1>
        </div>
      </div>

      {/* Meta bar */}
      <div className="border-b border-coffee-100 bg-cream/60">
        <div className="container mx-auto px-5 lg:px-8 py-4 flex flex-wrap items-center gap-6 text-sm text-coffee-500">
          <span className="flex items-center gap-1.5"><User className="w-4 h-4" /> Sipwar Brewing Lab</span>
          <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Sep 28, 2024</span>
          <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> 8 min read</span>
        </div>
      </div>

      {/* Article Body */}
      <div className="container mx-auto px-5 lg:px-8 py-16 max-w-3xl">
        <Link href="/blog" className="inline-flex items-center gap-2 text-coffee-600 hover:text-coffee-900 text-sm font-semibold mb-10 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Journal
        </Link>

        <div className="space-y-6 text-coffee-700 leading-relaxed">
          <p className="text-xl text-coffee-800 font-medium leading-relaxed">
            The South Indian filter (or "degree coffee filter") is one of the oldest and most sophisticated brewing devices in the world — predating the French press, the AeroPress, and even the Italian moka pot. When used correctly, it produces a concentrate of extraordinary depth and complexity.
          </p>

          <p>The secret lies not in the device, but in the quality of the coffee and the precision of the technique. Our Heritage South Indian Filter Blend is a traditional 80:20 Arabica-Robusta ratio — the Robusta providing body and crema, the Arabica providing flavour complexity and aroma.</p>

          <h2 className="font-serif text-3xl font-bold text-coffee-900 mt-10 mb-6">The Complete Brewing Guide</h2>

          <div className="space-y-5">
            {steps.map((step) => (
              <div key={step.num} className="flex gap-5 bg-cream rounded-2xl p-5">
                <span className="font-mono text-2xl font-bold text-gold flex-shrink-0 w-8">{step.num}</span>
                <div>
                  <p className="font-bold text-coffee-900 mb-1">{step.title}</p>
                  <p className="text-coffee-600 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <h2 className="font-serif text-3xl font-bold text-coffee-900 mt-10 mb-4">Common Mistakes</h2>
          <p><strong className="text-coffee-900">Too fine a grind:</strong> Blocks percolation entirely. Your coffee will never drip through. Medium-fine is the sweet spot.</p>
          <p><strong className="text-coffee-900">Over-pressing the disc:</strong> Compacts the coffee too tightly, resulting in under-extraction and weak decoction. Press until you feel slight resistance, then stop.</p>
          <p><strong className="text-coffee-900">Boiling water:</strong> Scalds the grounds and extracts harsh bitter compounds. Let the kettle sit for 2 minutes after boiling.</p>
          <p><strong className="text-coffee-900">Wrong milk ratio:</strong> The decoction is intensely concentrated. 1 part decoction to 3 parts hot milk is the traditional ratio. For a stronger cup, 1:2.</p>

          <div className="bg-coffee-900 text-white rounded-2xl p-6 my-8">
            <p className="font-bold text-gold text-sm uppercase tracking-widest mb-2">Pro Tip</p>
            <p>If your decoction takes longer than 20 minutes to drip through, your grind is too fine. If it finishes in under 8 minutes, grind finer or press the disc down more firmly.</p>
          </div>

          <h2 className="font-serif text-3xl font-bold text-coffee-900 mt-10 mb-4">Why Our Blend Works</h2>
          <p>
            Most South Indian filter coffees use chicory as a filler — it stretches the coffee volume but diminishes flavour. Our Heritage Blend contains zero chicory. Instead, we use a high-quality Robusta from Chikmagalur's lower elevations that provides the same body and crema that chicory is typically added to achieve.
          </p>
          <p>The result is a filter coffee that tastes richer, cleaner, and more complex than any chicory-laced commercial blend.</p>
        </div>

        {/* CTA */}
        <div className="mt-16 bg-coffee-950 rounded-[2rem] p-8 text-center">
          <p className="text-gold font-bold uppercase tracking-widest text-xs mb-3">Perfect Your Filter</p>
          <h3 className="font-serif text-2xl font-bold text-white mb-4">Heritage South Indian Filter Blend</h3>
          <p className="text-coffee-300 mb-6 text-sm">250g · ₹349 · Medium-fine ground, roasted to order.</p>
          <Link href="/products/4">
            <button className="bg-gradient-to-r from-gold to-amber-500 text-coffee-950 font-bold px-8 py-3 rounded-xl hover:shadow-lg transition-all">
              Shop Now
            </button>
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-coffee-100">
          <Link href="/blog" className="inline-flex items-center gap-2 text-coffee-600 hover:text-coffee-900 font-semibold group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to The Coffee Journal
          </Link>
        </div>
      </div>
    </div>
  );
}
