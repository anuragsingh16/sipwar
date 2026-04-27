import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar, User, Leaf } from "lucide-react";

export const metadata = {
  title: "Sustainability at Sipwar: Our Zero Waste Goal | Sipwar Journal",
  description:
    "Our aggressive timeline to ensure 100% of our packaging is compostable by the end of 2025, and what we're doing across the supply chain.",
};

export default function SustainabilityArticle() {
  const pillars = [
    {
      title: "Compostable Packaging",
      status: "In Progress — 60% Complete",
      statusColor: "text-amber-700 bg-amber-50 border-amber-200",
      desc: "We have transitioned our inner liners to 100% PLA (polylactic acid) bioplastic derived from sugarcane. The outer kraft pouches are already FSC-certified, acid-free, and compostable. The final step — moving our degassing valves from plastic to plant-based alternatives — is in pilot testing and we expect full completion by Q2 2025.",
    },
    {
      title: "Zero Waste Roasting",
      status: "Complete",
      statusColor: "text-green-700 bg-green-50 border-green-200",
      desc: "Our roasting facility operates on 100% renewable energy through a solar installation completed in March 2024. Chaff (the silvery skin that comes off beans during roasting) is collected and donated to local farmers as high-nitrogen compost. We produce literally zero landfill waste in the roasting process.",
    },
    {
      title: "Farm-Level Sustainability",
      status: "Complete",
      statusColor: "text-green-700 bg-green-50 border-green-200",
      desc: "All 500+ of our partner farms are certified organic by the Agricultural and Processed Food Products Export Development Authority (APEDA). Shade-grown under native tree canopy, our farms function as micro-biodiversity corridors. Several have been designated important bird habitats by the Bombay Natural History Society.",
    },
    {
      title: "Water Neutral Processing",
      status: "2025 Target",
      statusColor: "text-blue-700 bg-blue-50 border-blue-200",
      desc: "Wet-processing coffee is water-intensive. We are piloting a closed-loop water recirculation system at our Chikmagalur processing facility that reduces water consumption by 85%. Wastewater treatment using natural bioremediation (vetiver grass beds) completes the loop. Full deployment across all facilities is targeted for Q4 2025.",
    },
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Banner */}
      <div className="relative h-[55vh] min-h-[340px] overflow-hidden bg-coffee-950">
        <Image
          src="/images/journal/sustainability.jpg"
          alt="Sustainability and nature"
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
            <span className="text-white">Sustainability</span>
          </nav>
          <span className="inline-block bg-gold/90 text-coffee-950 text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full mb-4 w-fit">
            Stories
          </span>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-4xl">
            Sustainability at Sipwar: Our Zero Waste Goal
          </h1>
        </div>
      </div>

      {/* Meta bar */}
      <div className="border-b border-coffee-100 bg-cream/60">
        <div className="container mx-auto px-5 lg:px-8 py-4 flex flex-wrap items-center gap-6 text-sm text-coffee-500">
          <span className="flex items-center gap-1.5"><User className="w-4 h-4" /> Sipwar Sustainability Team</span>
          <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Jul 22, 2024</span>
          <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> 4 min read</span>
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
            We are publishing this article not because our sustainability journey is complete — it isn't — but because we believe brands should be held accountable to their promises in public. This is our progress report. Unvarnished.
          </p>

          <h2 className="font-serif text-3xl font-bold text-coffee-900 mt-10 mb-4">Why Zero Waste?</h2>
          <p>
            Coffee is one of the world's most traded commodities, and with that comes an enormous environmental footprint. From the water used to process coffee cherries, to the plastic packaging that ends up in landfills, to the carbon emitted during roasting and shipping — the industry has a significant debt to the planet.
          </p>
          <p>
            When we founded Sipwar, we made a commitment: by the end of 2025, every material that leaves our facility — packaging, chaff, wastewater — will either return to the earth as nutrient-rich compost, be reused in our production process, or be converted to clean energy. No net addition to landfill. Zero.
          </p>

          <h2 className="font-serif text-3xl font-bold text-coffee-900 mt-10 mb-6">The Four Pillars of Our Strategy</h2>

          <div className="space-y-5">
            {pillars.map((pillar, i) => (
              <div key={i} className="bg-cream rounded-2xl p-6 border border-coffee-100">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h3 className="font-bold text-coffee-900 text-lg flex items-center gap-2">
                    <Leaf className="w-5 h-5 text-green-eco flex-shrink-0" />
                    {pillar.title}
                  </h3>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border flex-shrink-0 ${pillar.statusColor}`}>
                    {pillar.status}
                  </span>
                </div>
                <p className="text-coffee-600 text-sm leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>

          <h2 className="font-serif text-3xl font-bold text-coffee-900 mt-10 mb-4">Our Honest Shortfalls</h2>
          <p>
            We have not yet solved the problem of the degassing valve. Every coffee bag needs a one-way valve to allow CO₂ to escape (fresh-roasted coffee off-gases significantly) without letting oxygen in. Current sustainable valve alternatives are either not reliable enough for our quality standards or prohibitively expensive for a startup. We are testing three alternatives and will share results in a Q3 2025 update.
          </p>
          <p>
            We also currently ship via third-party logistics partners who do not yet have fully electric fleets. We offset these emissions through Gold Standard-certified carbon credits while actively seeking logistics partners aligned with our values.
          </p>

          <div className="bg-green-eco/10 border border-green-eco/20 rounded-2xl p-6 my-8">
            <p className="font-bold text-green-eco text-lg mb-2">Our 2025 Commitment</p>
            <p className="text-coffee-700 text-sm">
              Every Sipwar order placed in 2025 will ship in 100% compostable packaging — outer kraft pouch, inner liner, mailer box, and void fill. If we miss this deadline, we will publicly announce it, refund 5% of Q4 orders as store credit, and explain exactly why in full. No excuses.
            </p>
          </div>

          <p>
            Sustainability in coffee is not a feature. It is a prerequisite for the industry's long-term survival. Climate change is already altering where Arabica can be grown — projections suggest 50% of current growing regions will be unsuitable by 2050. Every purchase of ethically sourced, sustainably grown coffee is a vote for a world where coffee continues to exist.
          </p>
          <p className="font-medium text-coffee-800">
            Thank you for being part of this. Your support makes the economics of sustainability viable for small farms that otherwise cannot afford the investment.
          </p>
        </div>

        {/* CTA */}
        <div className="mt-16 bg-coffee-950 rounded-[2rem] p-8 text-center">
          <p className="text-gold font-bold uppercase tracking-widest text-xs mb-3">Shop Sustainably</p>
          <h3 className="font-serif text-2xl font-bold text-white mb-4">Every Order Supports Our Mission</h3>
          <p className="text-coffee-300 mb-6 text-sm">Sustainably grown · Freshly roasted · Zero compromise.</p>
          <Link href="/products">
            <button className="bg-gradient-to-r from-gold to-amber-500 text-coffee-950 font-bold px-8 py-3 rounded-xl hover:shadow-lg transition-all">
              Browse All Blends
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
