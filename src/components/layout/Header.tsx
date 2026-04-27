"use client";

import Link from "next/link";
import Image from "next/image";
import { FallbackImage } from "@/components/ui/FallbackImage";
import { ShoppingBag, User, Menu, X, LogOut, ChevronDown, Heart } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { useCartStore } from "@/lib/store/cartStore";

export default function Header() {
  const { data: session } = useSession();
  const { getTotals } = useCartStore();
  const { itemCount } = getTotals();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropOpen, setUserDropOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setUserDropOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const navLinks = [
    { href: "/products", label: "Shop" },
    { href: "/about", label: "Our Story" },
    { href: "/blog", label: "Journal" },
  ];

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-coffee-100" : "bg-white"}`}>
      <div className="container mx-auto px-5 lg:px-8 h-20 flex items-center justify-between gap-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 flex-shrink-0 group">
          <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 shadow-md border border-coffee-200">
            <Image src="/images/logo-badge.png" alt="Sipwar Logo" fill className="object-cover" sizes="40px" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-serif text-2xl font-bold text-coffee-900 tracking-tight group-hover:text-coffee-700 transition-colors">Sipwar</span>
            <span className="text-[9px] uppercase tracking-[0.25em] text-coffee-500 font-medium hidden sm:block">Chuski Ki Ladai</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-7 flex-1 justify-center">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} className="text-sm font-semibold text-coffee-700 hover:text-coffee-900 transition-colors tracking-wide uppercase">
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-5">
          {/* User */}
          <div className="relative" ref={dropRef}>
            <button
              onClick={() => setUserDropOpen(!userDropOpen)}
              className="flex items-center gap-1.5 text-coffee-700 hover:text-coffee-900 transition-colors"
            >
              {session?.user?.image ? (
                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-coffee-200">
                  <FallbackImage src={session.user.image} alt="Avatar" width={32} height={32} className="object-cover" context="avatar" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-coffee-100 border border-coffee-200 flex items-center justify-center">
                  <User className="w-4 h-4 text-coffee-700" />
                </div>
              )}
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${userDropOpen ? "rotate-180" : ""}`} />
            </button>

            {userDropOpen && (
              <div className="absolute right-0 top-full mt-3 w-52 bg-white rounded-2xl shadow-xl border border-coffee-100 py-2 overflow-hidden animate-in zoom-in-95 fade-in duration-150">
                {session ? (
                  <>
                    <div className="px-4 py-3 border-b border-coffee-50">
                      <p className="text-sm font-bold text-coffee-900 truncate">{session.user?.name}</p>
                      <p className="text-xs text-coffee-500 truncate">{session.user?.email}</p>
                    </div>
                    <Link href="/account" className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-coffee-800 hover:bg-coffee-50 transition-colors" onClick={() => setUserDropOpen(false)}>
                      <User className="w-4 h-4" /> My Account
                    </Link>
                    <button
                      onClick={() => { signOut({ callbackUrl: "/" }); setUserDropOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-coffee-800 hover:bg-coffee-50 transition-colors" onClick={() => setUserDropOpen(false)}>
                      Sign In
                    </Link>
                    <Link href="/signup" className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-coffee-800 hover:bg-coffee-50 transition-colors" onClick={() => setUserDropOpen(false)}>
                      Create Account
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Wishlist */}
          <Link href="/account/wishlist" className="relative group">
            <Heart className="w-6 h-6 text-coffee-700 group-hover:text-terracotta transition-colors" />
          </Link>

          {/* Cart */}
          <Link href="/cart" className="relative group">
            <ShoppingBag className="w-6 h-6 text-coffee-700 group-hover:text-coffee-900 transition-colors" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-terracotta text-white text-[9px] font-bold w-[18px] h-[18px] flex items-center justify-center rounded-full shadow-sm border-2 border-white">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile toggle */}
        <div className="flex md:hidden items-center gap-4">
          <Link href="/account/wishlist" className="relative">
            <Heart className="w-6 h-6 text-coffee-800" />
          </Link>
          <Link href="/cart" className="relative">
            <ShoppingBag className="w-6 h-6 text-coffee-800" />
            {itemCount > 0 && <span className="absolute -top-2 -right-2 bg-terracotta text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold border-2 border-white">{itemCount}</span>}
          </Link>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-coffee-800">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-coffee-100 p-6 flex flex-col gap-5 shadow-lg animate-in slide-in-from-top duration-200">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)} className="text-lg font-semibold text-coffee-800 hover:text-coffee-600 transition-colors">
              {link.label}
            </Link>
          ))}
          <hr className="border-coffee-100" />
          {session ? (
            <>
              <Link href="/account" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-coffee-800 flex items-center gap-2">
                <User className="w-5 h-5" /> My Account
              </Link>
              <button onClick={() => { signOut({ callbackUrl: "/" }); setMobileMenuOpen(false); }} className="text-left text-lg font-medium text-red-600 flex items-center gap-2">
                <LogOut className="w-5 h-5" /> Sign Out
              </button>
            </>
          ) : (
            <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-coffee-800">Sign In / Register</Link>
          )}
        </div>
      )}
    </header>
  );
}
