"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, ArrowRight } from "lucide-react";

const FOOTER_LINKS = {
  shop: [
    { label: "Filter Coffee", href: "/products" },
    { label: "Arabica AA", href: "/products" },
    { label: "Blends", href: "/products" },
    { label: "Brewing Gear", href: "/products" },
    { label: "Subscriptions", href: "/account" },
  ],
  journal: [
    { label: "Brewing Guides", href: "/blog" },
    { label: "Farm Stories", href: "/blog" },
    { label: "Health & Coffee", href: "/blog" },
    { label: "Tasting Notes", href: "/blog" },
  ],
  support: [
    { label: "Track Order", href: "/account" },
    { label: "Shipping Policy", href: "/about" },
    { label: "Returns", href: "/about" },
    { label: "FAQ", href: "/about" },
    { label: "Contact Us", href: "/about" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-coffee-950 text-coffee-100">
      {/* Newsletter banner */}
      <div className="bg-coffee-900 border-b border-coffee-800">
        <div className="container mx-auto px-5 lg:px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-serif text-2xl md:text-3xl font-bold text-white mb-1">Brewing tips & exclusive offers</h3>
            <p className="text-coffee-300 text-sm">Join 12,000+ coffee lovers. No spam, only great content.</p>
          </div>
          <form className="flex gap-3 w-full md:w-auto" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 md:w-72 bg-coffee-800 border border-coffee-700 rounded-xl px-4 py-3 text-sm text-white placeholder:text-coffee-500 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all"
            />
            <button type="submit" className="flex items-center gap-2 bg-gradient-to-r from-gold to-yellow-600 text-coffee-950 font-bold px-5 py-3 rounded-xl hover:from-yellow-400 hover:to-yellow-500 transition-all text-sm flex-shrink-0">
              Subscribe <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Main footer */}
      <div className="container mx-auto px-5 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
          {/* Brand column */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-5">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border border-coffee-700 flex-shrink-0">
                <Image src="/images/logo-badge.png" alt="Sipwar" fill className="object-cover" sizes="80px" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-serif text-3xl font-bold text-white">Sipwar</span>
                <span className="text-[9px] uppercase tracking-[0.25em] text-coffee-400 font-medium">Chuski Ki Ladai</span>
              </div>
            </Link>
            <p className="text-coffee-400 text-sm leading-relaxed mb-6 max-w-xs">
              Premium Indian specialty coffee, ethically sourced from the farms of South India. Every sip tells a story.
            </p>
            <div className="flex items-center gap-3">
              {[
                { label: "In", href: "https://instagram.com/sipwar_india" },
                { label: "X", href: "#" },
                { label: "Fb", href: "#" },
              ].map(({ href, label }) => (
                <a key={label} href={href} aria-label={label} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 bg-coffee-800 hover:bg-gold hover:text-coffee-950 text-coffee-300 rounded-full flex items-center justify-center transition-all text-xs font-bold">
                  {label}
                </a>
              ))}
              <a href="mailto:hello@sipwar.in" aria-label="Email" className="w-10 h-10 bg-coffee-800 hover:bg-gold hover:text-coffee-950 text-coffee-300 rounded-full flex items-center justify-center transition-all">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {[
            { title: "Shop", links: FOOTER_LINKS.shop },
            { title: "Journal", links: FOOTER_LINKS.journal },
            { title: "Support", links: FOOTER_LINKS.support },
          ].map(col => (
            <div key={col.title}>
              <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-5">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map(l => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-sm text-coffee-400 hover:text-white transition-colors">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-coffee-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-coffee-500">© 2025 Sipwar Coffee. All rights reserved. #IndianBrand</p>
          <div className="flex items-center gap-6">
            {["Privacy Policy", "Terms of Service", "Shipping Policy"].map(t => (
              <Link key={t} href="/about" className="text-xs text-coffee-500 hover:text-white transition-colors">{t}</Link>
            ))}
          </div>
          <div className="flex items-center gap-2">
            {/* Payment logos as text badges */}
            {["UPI", "Visa", "Mastercard", "Razorpay", "COD"].map(p => (
              <span key={p} className="text-[9px] border border-coffee-700 text-coffee-500 px-2 py-1 rounded-md font-mono">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
