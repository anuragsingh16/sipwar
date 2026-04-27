import Image from "next/image";
import Link from "next/link";
import { FallbackImage } from "@/components/ui/FallbackImage";
import { ArrowLeft, Clock } from "lucide-react";

export default function FarmersOfBudangiri() {
  return (
    <div className="bg-white min-h-screen pb-24">
      {/* Hero Banner */}
      <div className="relative h-[60vh] min-h-[400px] flex items-end overflow-hidden">
        <FallbackImage 
          src="/images/journal/meet_the_budangiri.jpg" 
          alt="Coffee Farmers in Budangiri" 
          fill 
          className="object-cover" 
          priority 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-coffee-950 via-coffee-950/40 to-transparent" />
        <div className="relative z-10 container mx-auto px-5 lg:px-8 pb-16 max-w-4xl">
          <Link href="/blog" className="inline-flex items-center gap-2 text-gold hover:text-white transition-colors text-sm font-bold uppercase tracking-wider mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Journal
          </Link>
          <div className="flex items-center gap-4 text-coffee-200 text-sm font-medium uppercase tracking-wider mb-4">
            <span className="bg-gold text-coffee-950 px-3 py-1 rounded-full font-bold text-[10px]">Stories</span>
            <span>Sep 15, 2024</span>
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 12 min read</span>
          </div>
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-white leading-tight mb-4">
            Meet the Farmers of Baba Budangiri
          </h1>
          <p className="text-xl text-coffee-200 font-light max-w-2xl">
            Journey with us to the birthplace of coffee in India and meet the families who have been cultivating these beans since 1890.
          </p>
        </div>
      </div>

      {/* Content */}
      <article className="container mx-auto px-5 lg:px-8 max-w-3xl py-16 prose prose-lg prose-p:text-coffee-600 prose-headings:text-coffee-900 prose-headings:font-serif">
        <p className="lead text-xl text-coffee-700 italic border-l-4 border-gold pl-6 mb-10">
          Legend has it that in the 17th century, the Sufi saint Baba Budan smuggled seven coffee beans from Yemen out of the Middle East, strapping them to his chest. He planted them in the hills of Chikmagalur, Karnataka. Today, these very hills produce some of the finest specialty coffee in the world.
        </p>

        <h2>A Legacy Etched in the Hills</h2>
        <p>
          As we drove up the winding, misty roads of the Western Ghats, the air grew crisp and heavy with the scent of wet earth and jasmine. This is Baba Budangiri—the literal cradle of Indian coffee. For our latest sourcing trip, we wanted to go back to our roots and reconnect with the smallholder farmers who have maintained this sacred soil for over a century.
        </p>

        <figure className="my-12">
          <div className="relative aspect-video rounded-[2rem] overflow-hidden shadow-xl">
            <FallbackImage src="/images/our_story/direct_trade.jpg" alt="Lush green coffee estate" fill className="object-cover" />
          </div>
          <figcaption className="text-center text-sm text-coffee-400 mt-4 font-medium italic">
            The shade-grown canopy of a traditional Indian coffee estate ensures slow bean maturation.
          </figcaption>
        </figure>

        <h2>Generations of Cultivation</h2>
        <p>
          We met with Rajesh and Geeta, fourth-generation coffee planters whose estate spans 40 acres of prime altitude land. Unlike commercial plantations in other parts of the world, their farm looks more like a dense forest. 
        </p>
        <p>
          "Coffee here isn't grown in isolation," Rajesh explained, pointing to the towering silver oak and jackfruit trees above us. "It grows alongside pepper vines, cardamom, and citrus. The soil shares everything. That's why our Arabica has those distinct spicy and fruity notes."
        </p>

        <h2>The Direct Trade Difference</h2>
        <p>
          For decades, farmers like Rajesh were at the mercy of volatile commodity markets and middlemen who drastically cut into their margins. By bringing their single-origin beans directly to Sipwar, we ensure they are paid a premium for their sustainable practices. This direct relationship means they can reinvest in the land—using natural compost instead of chemical fertilizers and hand-picking only the ripest cherries.
        </p>

        <h2>Looking Forward</h2>
        <p>
          As climate change continues to alter weather patterns across the Ghats, the traditional shade-grown methods used in Baba Budangiri are proving to be remarkably resilient. The deep roots and forest canopy protect the coffee plants from erratic temperature spikes.
        </p>
        <p>
          When you brew a cup of our Filter Coffee Arabica AA, you are tasting the history, dedication, and resilient spirit of the Budangiri farmers. It's more than just a morning routine; it's a connection to the very origins of Indian coffee.
        </p>
      </article>

      {/* Author & Share */}
      <div className="container mx-auto px-5 lg:px-8 max-w-3xl pt-8 border-t border-coffee-100">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <p className="text-coffee-500 text-sm">Written by</p>
            <p className="font-bold text-coffee-900">Sipwar Editorial Team</p>
          </div>
          <Link href="/products" className="bg-coffee-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-gold transition-colors">
            Shop Budangiri Blends
          </Link>
        </div>
      </div>
    </div>
  );
}
