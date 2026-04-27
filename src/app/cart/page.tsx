"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store/cartStore";

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotals } = useCartStore();
  const { subtotal, total, itemCount } = getTotals();

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <div className="w-24 h-24 bg-coffee-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
          <ShoppingBag className="w-10 h-10 text-coffee-300" />
        </div>
        <h2 className="text-4xl font-serif text-coffee-900 mb-4 font-bold">Your cup is empty.</h2>
        <p className="text-gray-500 mb-10 max-w-md text-center text-lg leading-relaxed">Let's fill it! Explore our premium specialty roasts.</p>
        <Link href="/products" className="block">
          <Button className="bg-coffee-800 hover:bg-coffee-900 text-white px-10 py-6 text-xl rounded-xl shadow-lg hover:scale-105 transition-transform font-semibold">
            Explore Our Blends
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen py-12 md:py-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-4xl md:text-[3rem] font-serif text-coffee-900 font-bold mb-12">Your Cart ({itemCount})</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row gap-6 p-6 border border-gray-100 bg-white rounded-2xl shadow-sm relative pr-12 sm:pr-8 hover:shadow-md transition-shadow">
                <button 
                  onClick={() => removeItem(item.id)} 
                  className="absolute top-6 right-6 text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                
                <div className="w-32 h-32 bg-coffee-50 rounded-xl flex-shrink-0 relative overflow-hidden">
                  {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" sizes="128px" />}
                </div>
                
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-coffee-900 mb-2 pr-8 line-clamp-1">{item.name}</h3>
                    <div className="flex flex-wrap gap-2 text-sm text-coffee-700 mb-4 font-medium">
                      {item.weight && <span className="bg-coffee-50 border border-coffee-100 px-3 py-1 rounded-md">{item.weight}</span>}
                      {item.grind && <span className="bg-coffee-50 border border-coffee-100 px-3 py-1 rounded-md">{item.grind}</span>}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center justify-between gap-4 mt-auto">
                    <div className="flex items-center bg-white border-2 border-coffee-200 rounded-xl overflow-hidden h-[48px] max-w-[140px] shadow-sm">
                      <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="px-4 hover:bg-coffee-50 text-coffee-800 transition-colors h-full flex items-center justify-center flex-1"><Minus className="w-4 h-4" /></button>
                      <span className="w-10 text-center font-bold text-coffee-900 text-lg">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-4 hover:bg-coffee-50 text-coffee-800 transition-colors h-full flex items-center justify-center flex-1"><Plus className="w-4 h-4" /></button>
                    </div>
                    <span className="text-2xl font-bold text-coffee-800 font-mono">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-coffee-50/50 p-8 rounded-3xl border border-coffee-100 shadow-sm sticky top-[120px]">
              <h3 className="text-2xl font-serif font-bold text-coffee-900 mb-8">Order Summary</h3>
              
              <div className="space-y-4 text-lg mb-8 text-coffee-900">
                <div className="flex justify-between font-medium">
                  <span>Subtotal</span>
                  <span className="font-mono">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Shipping</span>
                  {subtotal >= 500 ? (
                     <span className="text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded">Free</span>
                  ) : (
                     <span className="font-mono">₹50</span>
                  )}
                </div>
                <div className="flex justify-between font-medium">
                  <span>Taxes</span>
                  <span className="text-gray-500 font-mono text-base pt-1">Included</span>
                </div>
                <hr className="border-coffee-200 my-4" />
                <div className="flex justify-between font-bold text-[1.75rem] text-coffee-900 pt-2">
                  <span>Total</span>
                  <span className="font-mono">₹{(total + (subtotal < 500 ? 50 : 0)).toLocaleString('en-IN')}</span>
                </div>
              </div>

              {subtotal >= 500 && (
                <div className="bg-white p-5 rounded-2xl mb-8 flex gap-4 items-center border border-green-100 shadow-sm">
                  <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center shrink-0">
                    <ShoppingBag className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-coffee-900 text-sm">You've unlocked Free Shipping!</h4>
                    <p className="text-xs text-gray-500 mt-1 font-medium">Enjoy our premium delivery</p>
                  </div>
                </div>
              )}

              <Link href="/checkout" className="block w-full">
                <Button className="w-full bg-coffee-800 hover:bg-coffee-900 text-white py-8 text-xl font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all group flex justify-between items-center px-8">
                  <span>Checkout</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              
              <div className="mt-8">
                <p className="text-center text-sm font-medium text-gray-500 flex items-center justify-center gap-2">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Secure SSL Encrypted Checkout
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
