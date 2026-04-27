"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Package, ArrowRight, Coffee } from "lucide-react";
import { Suspense } from "react";

function SuccessContent() {
  const params = useSearchParams();
  const orderId = params.get("orderId");
  const amount = params.get("amount");

  return (
    <div className="min-h-screen bg-[#faf6f0] flex items-center justify-center p-6">
      <div className="w-full max-w-lg text-center">
        {/* Animated success ring */}
        <div className="relative inline-flex items-center justify-center mb-8">
          <div className="w-32 h-32 rounded-full bg-green-50 border-4 border-green-100 flex items-center justify-center animate-pulse-once">
            <CheckCircle2 className="w-16 h-16 text-green-500" strokeWidth={1.5} />
          </div>
        </div>

        <p className="text-green-600 font-bold uppercase tracking-widest text-xs mb-3">Payment Successful</p>
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#3b2314] mb-4">
          Order Confirmed! ☕
        </h1>
        <p className="text-[#8b6a4a] text-lg leading-relaxed mb-2">
          Thank you for your purchase. Your coffee is being freshly roasted!
        </p>
        {amount && (
          <p className="text-[#3b2314] font-bold text-xl mb-6">
            Amount paid: <span className="font-mono">₹{Number(amount).toLocaleString("en-IN")}</span>
          </p>
        )}

        {/* Order ID badge */}
        {orderId && (
          <div className="inline-flex items-center gap-2 bg-[#3b2314]/5 border border-[#3b2314]/10 rounded-2xl px-5 py-3 mb-8">
            <Package className="w-4 h-4 text-[#8b6a4a]" />
            <span className="text-[#8b6a4a] text-sm font-medium">Order ID:</span>
            <span className="font-mono text-[#3b2314] font-bold text-sm">#{String(orderId).slice(-8).toUpperCase()}</span>
          </div>
        )}

        {/* Info steps */}
        <div className="bg-white rounded-3xl border border-[#e8dcd0] p-6 mb-8 text-left space-y-4">
          {[
            { step: "1", title: "Order Received", desc: "Your order has been placed and confirmed." },
            { step: "2", title: "Freshly Roasted", desc: "We'll roast your beans to perfection (1-2 days)." },
            { step: "3", title: "Shipped to You", desc: "Your order will be shipped within 2-3 business days." },
          ].map(({ step, title, desc }) => (
            <div key={step} className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-[#cfb53b]/10 border border-[#cfb53b]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-[#cfb53b] text-xs font-bold">{step}</span>
              </div>
              <div>
                <p className="font-bold text-[#3b2314] text-sm">{title}</p>
                <p className="text-[#8b6a4a] text-sm">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/account/orders" className="flex items-center justify-center gap-2 bg-[#3b2314] hover:bg-[#5c3420] text-white font-bold px-7 py-4 rounded-2xl transition-all">
            <Package className="w-5 h-5" /> Track Orders
          </Link>
          <Link href="/products" className="flex items-center justify-center gap-2 border-2 border-[#e8dcd0] hover:border-[#3b2314] text-[#3b2314] font-bold px-7 py-4 rounded-2xl transition-all">
            <Coffee className="w-5 h-5" /> Shop More <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
