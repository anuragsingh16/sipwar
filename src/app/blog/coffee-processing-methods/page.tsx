import Image from "next/image";
import Link from "next/link";
import { FallbackImage } from "@/components/ui/FallbackImage";
import { ArrowLeft, Clock } from "lucide-react";

export default function CoffeeProcessingMethods() {
  return (
    <div className="bg-white min-h-screen pb-24">
      {/* Hero Banner */}
      <div className="relative h-[60vh] min-h-[400px] flex items-end overflow-hidden">
        <FallbackImage 
          src="/images/products/Chikmagalur_Estate_Reserve/pexels-melike-2157605065-36765363.jpg" 
          alt="Coffee Processing Methods" 
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
            <span className="bg-coffee-800 text-white px-3 py-1 rounded-full font-bold text-[10px]">Education</span>
            <span>Aug 14, 2024</span>
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 7 min read</span>
          </div>
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-white leading-tight mb-4">
            Deciphering Coffee Processing Methods
          </h1>
          <p className="text-xl text-coffee-200 font-light max-w-2xl">
            Washed, Natural, or Honey processed? How the method chosen at the farm fundamentally alters the flavor in your cup.
          </p>
        </div>
      </div>

      {/* Content */}
      <article className="container mx-auto px-5 lg:px-8 max-w-3xl py-16 prose prose-lg prose-p:text-coffee-600 prose-headings:text-coffee-900 prose-headings:font-serif">
        <p className="lead text-xl text-coffee-700 italic border-l-4 border-coffee-300 pl-6 mb-10">
          When you buy a bag of specialty coffee, you'll often see words like "Washed," "Natural," or "Honey" stamped on the label. But what do these terms mean? Long before the beans reach the roaster, the method used to extract them from the coffee cherry dictates much of what you'll eventually taste.
        </p>

        <h2>The Anatomy of a Coffee Cherry</h2>
        <p>
          To understand processing, we must first look at the fruit itself. A coffee bean is actually the seed of a cherry. Surrounding the seed is a layer of mucilage (a sticky, honey-like substance), the pulp (fruit), and the outer skin. Coffee processing is simply the act of removing these layers to get to the seed.
        </p>

        <figure className="my-12">
          <div className="relative aspect-video rounded-[2rem] overflow-hidden shadow-xl">
            <FallbackImage src="/images/our_story/pexels-michael-burrows-7125765.jpg" alt="Coffee beans drying" fill className="object-cover" />
          </div>
          <figcaption className="text-center text-sm text-coffee-400 mt-4 font-medium italic">
            Coffee cherries laid out to dry on raised beds—a key step in the Natural process.
          </figcaption>
        </figure>

        <h2>The Natural (Dry) Process</h2>
        <p>
          This is the oldest method in the world. Whole coffee cherries are laid out on raised beds or brick patios to dry in the sun for several weeks. Because the seed ferments inside the fruit, it absorbs immense sweetness and fruity characteristics.
        </p>
        <p>
          <strong>What to expect in the cup:</strong> Heavy body, pronounced sweetness, and wild, berry-like fruity flavors (think strawberry or blueberry). It can sometimes be polarizing due to its fermented, winey notes.
        </p>

        <h2>The Washed (Wet) Process</h2>
        <p>
          In the washed process, the fruit is stripped away quickly. The cherries are passed through a depulper, removing the skin and pulp. The seeds are then submerged in water tanks where fermentation breaks down the sticky mucilage. Finally, they are washed clean and dried.
        </p>
        <p>
          <strong>What to expect in the cup:</strong> Clarity. Washed coffees highlight the true character of the bean—the soil, the altitude, and the variety. Look for crisp acidity, floral notes, and a clean finish. Most of our Sipwar Arabica AA blends use this method to emphasize their high-altitude crispness.
        </p>

        <h2>The Honey Process</h2>
        <p>
          No, there is no actual honey involved! The honey process sits halfway between washed and natural. The skin is removed, but some of the sticky mucilage (the "honey") is left on the seed while it dries. The more mucilage left on, the darker the honey (Yellow, Red, or Black Honey).
        </p>
        <p>
          <strong>What to expect in the cup:</strong> A complex middle ground. It has the rounded, syrupy body and sweetness of a natural, combined with the approachability and clarity of a washed coffee.
        </p>

        <h2>Which is Best?</h2>
        <p>
          There is no "best" method. It entirely depends on what flavor profile you enjoy in the morning. If you like a clean, bright, and easy-drinking cup, look for Washed coffees. If you want a bold, fruit-forward explosion of flavor, try a Natural. At Sipwar, we curate a mix of processing methods so you can explore the full spectrum of what Indian specialty coffee has to offer.
        </p>
      </article>

      {/* Author & Share */}
      <div className="container mx-auto px-5 lg:px-8 max-w-3xl pt-8 border-t border-coffee-100">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <p className="text-coffee-500 text-sm">Written by</p>
            <p className="font-bold text-coffee-900">Sipwar Coffee Masters</p>
          </div>
          <Link href="/products" className="bg-coffee-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-gold transition-colors">
            Explore Washed Arabica
          </Link>
        </div>
      </div>
    </div>
  );
}
