"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/store/cartStore";
import { useRouter } from "next/navigation";
import { ShieldCheck, Truck, ShieldAlert } from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotals, clearCart } = useCartStore();
  const { subtotal } = getTotals();
  const total = subtotal + (subtotal < 500 ? 50 : 0);
  
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    city: "",
    state: "",
    pincode: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress({ ...address, [e.target.id]: e.target.value });
  };

  const loadRazorpay = async () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Ensure keys exist in frontend
      const rzpKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      if (!rzpKey) {
        throw new Error("Razorpay Key ID is missing! Update Vercel settings and REDEPLOY.");
      }

      // 2. Load SDK
      const sdkLoaded = await loadRazorpay();
      if (!sdkLoaded) {
          throw new Error("Razorpay SDK could not be loaded.");
      }

      // 3. Create Order
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          address,
          totalAmount: total,
          paymentMethod: "razorpay"
        }),
      });

      const orderData = await response.json();
      if (!response.ok) {
          throw new Error(orderData.error || "Failed to create order on server.");
      }

      // 4. Verification Check: Stop if server didn't generate a real Razorpay ID
      if (!orderData.id || orderData.id.startsWith("COD-")) {
          throw new Error("Server failed to generate a Razorpay Order. Check your RAZORPAY_KEY_SECRET on Vercel.");
      }

      // 5. Open Razorpay
      const options = {
        key: rzpKey,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Sipwar Coffee",
        description: "Premium Coffee Purchase",
        order_id: orderData.id,
        handler: async function (rzpRes: any) {
          try {
            const verifyRes = await fetch("/api/orders/verify", {
               method: "POST",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify({
                 razorpay_payment_id: rzpRes.razorpay_payment_id,
                 razorpay_order_id: rzpRes.razorpay_order_id,
                 razorpay_signature: rzpRes.razorpay_signature,
                 dbOrderId: orderData.dbOrderId,
               }),
            });
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              clearCart();
              router.push(`/order-success?orderId=${orderData.dbOrderId}&amount=${total}`);
            } else {
              alert("Payment verification failed! Order not confirmed.");
            }
          } catch (vErr) {
            alert("Payment verification server error.");
          }
        },
        prefill: {
          name: address.fullName,
          contact: address.phone,
        },
        theme: { color: "#3b2314" },
        modal: {
          ondismiss: () => setLoading(false)
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();

    } catch (err: any) {
      console.error("Payment Step Error:", err);
      alert(err.message || "An unexpected error occurred during checkout.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
       <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 bg-white">
        <h2 className="text-3xl font-serif text-coffee-900 mb-8 font-bold">Your cart is empty</h2>
        <Button onClick={() => router.push("/products")} className="px-8 py-6 rounded-xl text-lg bg-coffee-800 hover:bg-coffee-900">Back to Shop</Button>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen py-12 md:py-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-4xl md:text-[3rem] font-serif text-coffee-900 font-bold mb-12">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Checkout Form */}
          <div className="lg:col-span-7">
            <h2 className="text-2xl font-serif font-bold text-coffee-900 mb-6">Shipping Address</h2>
            <form id="checkout-form" onSubmit={handleCheckout} className="space-y-6 bg-coffee-50/30 p-6 sm:p-8 rounded-3xl border border-coffee-100 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" required value={address.fullName} onChange={handleChange} className="bg-white border-coffee-200 h-12" />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" required value={address.phone} onChange={handleChange} className="bg-white border-coffee-200 h-12" />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="addressLine1">Address Line 1</Label>
                <Input id="addressLine1" required value={address.addressLine1} onChange={handleChange} className="bg-white border-coffee-200 h-12" />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="space-y-3 md:col-span-1">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" required value={address.city} onChange={handleChange} className="bg-white border-coffee-200 h-12" />
                </div>
                <div className="space-y-3 md:col-span-1">
                  <Label htmlFor="state">State</Label>
                  <Input id="state" required value={address.state} onChange={handleChange} className="bg-white border-coffee-200 h-12" />
                </div>
                <div className="space-y-3 col-span-2 md:col-span-1">
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input id="pincode" required value={address.pincode} onChange={handleChange} className="bg-white border-coffee-200 h-12" />
                </div>
              </div>

              <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-xl flex gap-3 text-green-800">
                <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-sm font-medium leading-relaxed">Your data is handled securely. We never store your full payment details on our servers.</p>
              </div>
            </form>
          </div>

          {/* Order Summary Checkout side */}
          <div className="lg:col-span-5">
            <div className="bg-coffee-50/50 p-8 rounded-3xl border border-coffee-100 shadow-sm sticky top-[120px]">
              <h3 className="text-2xl font-serif font-bold text-coffee-900 mb-6">Order Summary</h3>
              
              <div className="space-y-4 max-h-[350px] overflow-y-auto mb-8 pr-2 custom-scrollbar">
                {items.map(item => (
                   <div key={item.id} className="flex gap-4">
                     <div className="w-16 h-16 bg-coffee-50 rounded-xl border border-coffee-200 flex-shrink-0 shadow-sm relative overflow-hidden">
                       {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />}
                     </div>
                     <div className="flex-1">
                       <h4 className="font-semibold text-coffee-900 text-sm line-clamp-1">{item.name}</h4>
                       <div className="text-xs text-gray-500 mt-1 font-medium pb-1">Qty: {item.quantity} {item.weight && `| ${item.weight}`}</div>
                       <div className="font-mono font-bold text-coffee-900 text-sm">₹{(item.price * item.quantity).toLocaleString('en-IN')}</div>
                     </div>
                   </div>
                ))}
              </div>

              <hr className="border-coffee-200 mb-6" />

              <div className="space-y-4 text-coffee-900 mb-8">
                <div className="flex justify-between font-medium text-lg">
                  <span>Subtotal</span>
                  <span className="font-mono">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between font-medium text-lg">
                  <span>Shipping</span>
                  {subtotal >= 500 ? (
                     <span className="text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded text-sm">Free</span>
                  ) : (
                     <span className="font-mono">₹50</span>
                  )}
                </div>
                <hr className="border-coffee-200 my-4" />
                <div className="flex justify-between font-bold text-2xl text-coffee-900 pt-2">
                  <span>Total</span>
                  <span className="font-mono">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <Button type="submit" form="checkout-form" disabled={loading} className="w-full bg-coffee-800 hover:bg-coffee-900 text-white py-8 text-xl font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
                {loading ? "Processing..." : `Pay ₹${total.toLocaleString('en-IN')}`}
              </Button>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="flex items-center gap-2 justify-center text-xs font-medium text-coffee-800"><Truck className="w-4 h-4" /> Free shipping ₹500+</div>
                <div className="flex items-center gap-2 justify-center text-xs font-medium text-coffee-800"><ShieldCheck className="w-4 h-4" /> Secure Payment</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
