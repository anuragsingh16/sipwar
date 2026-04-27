import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar, User } from "lucide-react";

export const metadata = {
  title: "The Science Behind Adaptogenic Coffee | Sipwar Journal",
  description:
    "How Ashwagandha and Lion's Mane combined with premium Arabica can eliminate the caffeine crash while tripling cognitive performance.",
};

export default function AdaptogenicCoffeeArticle() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Banner */}
      <div className="relative h-[55vh] min-h-[340px] overflow-hidden bg-coffee-950">
        <Image
          src="/images/products/Adaptogenic_Morning_Blend/pexels-cihanyuce-30349811.jpg"
          alt="Adaptogenic Coffee Science"
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
            <span className="text-white">Adaptogenic Coffee</span>
          </nav>
          <span className="inline-block bg-green-eco/90 text-white text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full mb-4 w-fit">
            Health
          </span>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-4xl">
            The Science Behind Adaptogenic Coffee
          </h1>
        </div>
      </div>

      {/* Meta bar */}
      <div className="border-b border-coffee-100 bg-cream/60">
        <div className="container mx-auto px-5 lg:px-8 py-4 flex flex-wrap items-center gap-6 text-sm text-coffee-500">
          <span className="flex items-center gap-1.5"><User className="w-4 h-4" /> Sipwar Research Team</span>
          <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Oct 12, 2024</span>
          <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> 5 min read</span>
        </div>
      </div>

      {/* Article Body */}
      <div className="container mx-auto px-5 lg:px-8 py-16 max-w-3xl">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-coffee-600 hover:text-coffee-900 text-sm font-semibold mb-10 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Journal
        </Link>

        <div className="prose prose-lg max-w-none text-coffee-700 leading-relaxed space-y-6">
          <p className="text-xl text-coffee-800 font-medium leading-relaxed">
            For centuries, healers across India have understood that certain plants — Ashwagandha, Brahmi, Lion's Mane — have a profound ability to help the body adapt to stress. Now, modern neuroscience is catching up, and the results are reshaping what we know about our daily cup of coffee.
          </p>

          <h2 className="font-serif text-3xl font-bold text-coffee-900 mt-10 mb-4">What Are Adaptogens?</h2>
          <p>
            Adaptogens are a specific class of plants and fungi that help the body resist physical, chemical, and biological stressors. They work by modulating the hypothalamic-pituitary-adrenal (HPA) axis — the central stress response system — bringing it back into balance whether it's overactive or underactive.
          </p>
          <p>
            Unlike stimulants that force your body into a heightened state, adaptogens guide it toward equilibrium. This is why they pair so powerfully with caffeine, which is itself a stimulant that can spike cortisol when taken without modulation.
          </p>

          <h2 className="font-serif text-3xl font-bold text-coffee-900 mt-10 mb-4">The Caffeine Problem</h2>
          <p>
            Standard coffee triggers a significant rise in cortisol — especially when consumed on an empty stomach in the morning. This cortisol spike accelerates heart rate, sharpens alertness, and then precipitates the dreaded "crash" 2–3 hours later: fatigue, brain fog, and sometimes anxiety.
          </p>
          <p>
            The mechanism: caffeine blocks adenosine receptors (the tiredness signal), which accumulates behind the scenes. When caffeine wears off, all that pent-up adenosine floods your system simultaneously — hence the crash.
          </p>

          <h2 className="font-serif text-3xl font-bold text-coffee-900 mt-10 mb-4">Ashwagandha: The Cortisol Modulator</h2>
          <p>
            Withania somnifera (Ashwagandha) is perhaps the most research-backed adaptogen on the planet. A 2019 double-blind randomised controlled trial published in Medicine found that 240mg of ashwagandha extract daily reduced cortisol levels by 22.2% vs. placebo over 60 days.
          </p>
          <p>
            When added to coffee, ashwagandha's withanolides — the active compounds — work to buffer the cortisol spike caused by caffeine. The result is a steadier, more sustained energy curve with less anxiety and a significantly reduced crash. Our Adaptogenic Morning Blend contains precisely 200mg of KSM-66 Ashwagandha extract, the most bioavailable form available.
          </p>

          <h2 className="font-serif text-3xl font-bold text-coffee-900 mt-10 mb-4">Lion's Mane: The Cognitive Enhancer</h2>
          <p>
            Hericium erinaceus (Lion's Mane mushroom) contains compounds called hericenones and erinacines that stimulate Nerve Growth Factor (NGF) synthesis in the brain. NGF is critical for the growth, maintenance, and survival of neurons.
          </p>
          <p>
            A landmark 2009 study by Mori et al. found significant improvement in mild cognitive impairment among subjects consuming Lion's Mane daily for 16 weeks, with improvements in cognitive function scores continuing to rise throughout the study period.
          </p>
          <p>
            In the context of coffee, Lion's Mane doesn't just add to the cognitive benefits of caffeine — it synergises with them. Caffeine opens blood-brain barrier pathways; Lion's Mane compounds use those pathways more efficiently. The result: sharper focus, faster recall, and longer concentration windows.
          </p>

          <h2 className="font-serif text-3xl font-bold text-coffee-900 mt-10 mb-4">The Sipwar Approach</h2>
          <p>
            Our Adaptogenic Morning Blend starts with 100% single-origin Arabica from Coorg, Karnataka — chosen specifically for its inherently lower caffeine content compared to Robusta, which means less cortisol stimulation from the base itself.
          </p>
          <p>
            To this we add a precise blend of KSM-66 Ashwagandha (200mg), Organic Lion's Mane extract (250mg), and a trace of Black Pepper Extract (Bioperine, 5mg) to increase the bioavailability of all compounds by up to 20×.
          </p>
          <p>
            The taste profile is rich, chocolatey, and smooth — the adaptogens are imperceptible in flavour but profoundly present in effect.
          </p>

          <div className="bg-coffee-50 border border-coffee-200 rounded-2xl p-6 my-8">
            <p className="font-bold text-coffee-900 text-lg mb-2">Key Takeaway</p>
            <p className="text-coffee-700">
              Adaptogenic coffee doesn't suppress caffeine's benefits — it amplifies them while removing the negatives. Less crash. More clarity. Longer-lasting energy. That's not marketing. That's biochemistry.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 bg-coffee-950 rounded-[2rem] p-8 text-center">
          <p className="text-gold font-bold uppercase tracking-widest text-xs mb-3">Try It Yourself</p>
          <h3 className="font-serif text-2xl font-bold text-white mb-4">Adaptogenic Morning Blend</h3>
          <p className="text-coffee-300 mb-6 text-sm">250g · ₹799 · Roasted to order within 48 hours.</p>
          <Link href="/products/2">
            <button className="bg-gradient-to-r from-gold to-amber-500 text-coffee-950 font-bold px-8 py-3 rounded-xl hover:shadow-lg transition-all">
              Shop Now
            </button>
          </Link>
        </div>

        {/* Back */}
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
