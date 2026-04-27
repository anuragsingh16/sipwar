import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar, User } from "lucide-react";

export const metadata = {
  title: "Robusta's Renaissance | Sipwar Journal",
  description:
    "Why high-quality Indian Robusta is finally getting the respect it deserves in the specialty coffee world.",
};

export default function RobustaRenaissanceArticle() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Banner */}
      <div className="relative h-[55vh] min-h-[340px] overflow-hidden bg-coffee-950">
        <Image
          src="/images/products/Monsoon_Malabar_Dark_Roast/pexels-ibro-6804316.jpg"
          alt="Robusta Coffee Beans"
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
            <span className="text-white">Robusta&apos;s Renaissance</span>
          </nav>
          <span className="inline-block bg-coffee-800/90 text-white text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full mb-4 w-fit">
            Education
          </span>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-4xl">
            Robusta&apos;s Renaissance
          </h1>
        </div>
      </div>

      {/* Meta bar */}
      <div className="border-b border-coffee-100 bg-cream/60">
        <div className="container mx-auto px-5 lg:px-8 py-4 flex flex-wrap items-center gap-6 text-sm text-coffee-500">
          <span className="flex items-center gap-1.5"><User className="w-4 h-4" /> Sipwar Editorial</span>
          <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Aug 30, 2024</span>
          <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> 6 min read</span>
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
            For two decades, the specialty coffee world treated Robusta as a dirty word — an inferior, bitter bean fit only for instant coffee and filler blends. But something remarkable is happening in the hills of Chikmagalur and Coorg. Indian Robusta is earning a standing ovation from the same critics who once dismissed it.
          </p>

          <h2 className="font-serif text-3xl font-bold text-coffee-900 mt-10 mb-4">The Unfair Reputation</h2>
          <p>
            Robusta (Coffea canephora) got its bad reputation honestly — most Robusta historically was grown at low elevations under full sun, harvested without selectiveness, and processed poorly. The result was a harsh, rubbery-bitter bean with high caffeine (nearly 2× Arabica) that overwhelmed the palate.
          </p>
          <p>
            The coffee world responded by making Arabica the gold standard of specialty coffee. Arabica commands premium prices, earns competition medals, and fills the cups of connoisseurs worldwide. Robusta was left behind.
          </p>

          <h2 className="font-serif text-3xl font-bold text-coffee-900 mt-10 mb-4">What Changed in India</h2>
          <p>
            Indian farmers, particularly in Karnataka's Baba Budangiri region — the birthplace of Indian coffee — never gave up on Robusta. While global markets priced it low, these farmers continued shade-growing their Robusta at elevations above 1,000 metres, selectively harvesting only ripe cherries, and wet-processing the beans with meticulous care.
          </p>
          <p>
            The result at these elevations is dramatically different from lowland Robusta. The cooler temperatures slow bean maturation, allowing more complex sugars to develop. The wet processing removes the harsh outer fruit compounds that cause bitterness. What emerges is a bean with:
          </p>
          <ul className="list-disc list-inside space-y-2 pl-4 text-coffee-700">
            <li>Deep, dark chocolate and treacle notes</li>
            <li>A velvety, espresso-crema body unmatched by Arabica</li>
            <li>Earthy, woodsy complexity akin to aged Sumatran coffee</li>
            <li>High natural caffeine — providing genuine, long-lasting energy</li>
            <li>Remarkable antioxidant density — nearly 50% more chlorogenic acids than Arabica</li>
          </ul>

          <h2 className="font-serif text-3xl font-bold text-coffee-900 mt-10 mb-4">The Monsoon Malabar Effect</h2>
          <p>
            Our Monsoon Malabar Dark Roast showcases India's most distinctive Robusta processing technique. During the monsoon months, green Robusta beans from the Malabar coast of Karnataka are deliberately exposed to moist, salt-laden monsoon winds in open warehouses for 12–16 weeks.
          </p>
          <p>
            This process — unique to India — causes the beans to swell, lose acidity, and develop an extraordinary earthy, spicy, almost wild character that no other processing method can replicate. The result became one of India's most sought-after specialty coffees among European roasters.
          </p>

          <div className="bg-coffee-50 border border-coffee-200 rounded-2xl p-6 my-8">
            <p className="font-bold text-coffee-900 text-lg mb-2">The Numbers Tell the Story</p>
            <div className="grid grid-cols-3 gap-4 mt-4">
              {[
                { val: "2×", label: "More Caffeine vs Arabica" },
                { val: "50%", label: "More Antioxidants" },
                { val: "12–16", label: "Weeks of Monsooning" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="font-mono text-2xl font-bold text-coffee-900">{s.val}</p>
                  <p className="text-coffee-500 text-xs mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <h2 className="font-serif text-3xl font-bold text-coffee-900 mt-10 mb-4">A New Certification Frontier</h2>
          <p>
            The Specialty Coffee Association (SCA) recently expanded its cupping protocols to include a Robusta track — a significant acknowledgment that excellent Robusta deserves the same evaluation framework as Arabica. Several Indian Robustas from Baba Budangiri have scored above 80 points on the SCA scale, placing them firmly in "specialty" territory.
          </p>
          <p>
            We are committed to sourcing only from farms that score above 78 on the Robusta cupping protocol — a threshold that is genuinely difficult to achieve and reflects true commitment to quality at the farm level.
          </p>

          <p className="font-medium text-coffee-800">
            Robusta's renaissance is not a marketing narrative. It is a long-overdue recognition of what skilled Indian farmers have known for generations: that Robusta, grown well and processed with care, is one of the great coffees of the world.
          </p>
        </div>

        {/* CTA */}
        <div className="mt-16 bg-coffee-950 rounded-[2rem] p-8 text-center">
          <p className="text-gold font-bold uppercase tracking-widest text-xs mb-3">Experience It</p>
          <h3 className="font-serif text-2xl font-bold text-white mb-4">Monsoon Malabar Dark Roast</h3>
          <p className="text-coffee-300 mb-6 text-sm">250g · ₹499 · Monsooned Robusta from Malabar Coast.</p>
          <Link href="/products/3">
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
