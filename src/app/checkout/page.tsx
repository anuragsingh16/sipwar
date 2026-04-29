"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/lib/store/cartStore";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ShieldCheck, Truck, ShieldAlert, Lock, LogIn } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  // Helper to load Razorpay script
  const loadScript = (src: string) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };
  const { items, getTotals, clearCart } = useCartStore();
  const { subtotal } = getTotals();
  const shipping = subtotal < 500 ? 50 : 0;
  const total = subtotal + shipping;

  const [loading, setLoading] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    city: "",
    state: "",
    pincode: "",
  });

  // Pre-fill name from session
  useEffect(() => {
    if (session?.user?.name && !address.fullName) {
      setAddress((prev) => ({ ...prev, fullName: session.user!.name! }));
    }
  }, [session]);

  // Read error from URL (e.g. payment_failed redirect back)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const err = params.get("error");
    if (err === "payment_failed") setPaymentError("Payment was not completed. Please try again.");
    if (err === "signature_mismatch") setPaymentError("Payment verification failed. Please contact support.");
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress({ ...address, [e.target.id]: e.target.value });
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setPaymentError("");

    const isScriptLoaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
    if (!isScriptLoaded) {
      setPaymentError("Razorpay SDK failed to load. Are you online?");
      setLoading(false);
      return;
    }

    try {
      // 1. Create Razorpay order on backend
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, address, totalAmount: total }),
      });

      const orderData = await res.json();
      if (!res.ok) throw new Error(orderData.error || "Failed to create order.");

      // 2. Clear cart since order is generated (though payment is pending)
      clearCart();

      // 3. Initialize Razorpay Modal Options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "Sipwar Coffee",
        description: "Premium Coffee Order",
        order_id: orderData.order_id, // This is the order_id created in the backend
        handler: async function (response: any) {
          // 4. Verify payment signature on backend
          try {
            const verifyRes = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                dbOrderId: orderData.dbOrderId,
              }),
            });

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) throw new Error(verifyData.error || "Verification failed");

            // Redirect to success page
            router.push(`/order-success?orderId=${orderData.orderNumber}`);
          } catch (verErr: any) {
            console.error("Verification error:", verErr);
            router.push("/checkout?error=signature_mismatch");
          }
        },
        prefill: {
          name: address.fullName,
          email: session?.user?.email || "",
          contact: address.phone,
        },
        theme: {
          color: "#3b2314",
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      
      paymentObject.on("payment.failed", function (response: any) {
        console.error("Payment failed:", response.error.description);
        router.push("/checkout?error=payment_failed");
      });

      paymentObject.open();
      setLoading(false); // Modal is open, stop loading spinner
    } catch (err: any) {
      console.error("Checkout Error:", err);
      setPaymentError(err.message || "Failed to initialize payment. Please try again.");
      setLoading(false);
    }
  };

  // ── Empty cart ──────────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 bg-white">
        <h2 className="text-3xl font-serif text-coffee-900 mb-8 font-bold">Your cart is empty</h2>
        <Button onClick={() => router.push("/products")} className="px-8 py-6 rounded-xl text-lg bg-coffee-800 hover:bg-coffee-900">
          Back to Shop
        </Button>
      </div>
    );
  }

  // ── Auth gate — must be logged in ─────────────────────────────────────────
  if (status === "unauthenticated") {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 bg-[#fff5f5]">
        <div className="w-full max-w-md bg-white rounded-3xl border border-coffee-100 shadow-lg p-10 text-center">
          <div className="w-20 h-20 bg-coffee-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-coffee-100">
            <Lock className="w-9 h-9 text-coffee-700" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-coffee-900 mb-3">Sign in to Checkout</h2>
          <p className="text-coffee-600 mb-8 leading-relaxed">
            You need to be logged in to place an order. Your cart is saved and will be waiting for you.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/login?redirect=/checkout"
              className="flex items-center justify-center gap-2 bg-coffee-800 hover:bg-coffee-900 text-white font-bold px-6 py-4 rounded-2xl transition-all"
            >
              <LogIn className="w-5 h-5" /> Sign In
            </Link>
            <Link
              href="/signup?redirect=/checkout"
              className="flex items-center justify-center gap-2 border-2 border-coffee-200 hover:border-coffee-400 text-coffee-800 font-bold px-6 py-4 rounded-2xl transition-all"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Loading session ───────────────────────────────────────────────────────
  if (status === "loading") {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#fff5f5]">
        <div className="w-10 h-10 border-4 border-coffee-200 border-t-coffee-800 rounded-full animate-spin" />
      </div>
    );
  }

  // ── Main checkout form ────────────────────────────────────────────────────
  return (
    <div className="bg-[#fff5f5] min-h-screen py-12 md:py-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-4xl md:text-[3rem] font-serif text-coffee-900 font-bold mb-12">Checkout</h1>

        {paymentError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl flex gap-3 items-center">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium">{paymentError}</p>
          </div>
        )}

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

              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl flex gap-3 text-green-800">
                <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-sm font-medium leading-relaxed">
                  You'll be redirected to Razorpay's secure payment page. We never see your card details.
                </p>
              </div>
            </form>
          </div>

          {/* Order Summary */}
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
                      <div className="text-xs text-gray-500 mt-1 font-medium pb-1">
                        Qty: {item.quantity} {item.weight && `| ${item.weight}`}
                      </div>
                      <div className="font-mono font-bold text-coffee-900 text-sm">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <hr className="border-coffee-200 mb-6" />

              <div className="space-y-4 text-coffee-900 mb-8">
                <div className="flex justify-between font-medium text-lg">
                  <span>Subtotal</span>
                  <span className="font-mono">₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between font-medium text-lg">
                  <span>Shipping</span>
                  {shipping === 0 ? (
                    <span className="text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded text-sm">Free</span>
                  ) : (
                    <span className="font-mono">₹{shipping}</span>
                  )}
                </div>
                <hr className="border-coffee-200 my-4" />
                <div className="flex justify-between font-bold text-2xl text-coffee-900 pt-2">
                  <span>Total</span>
                  <span className="font-mono">₹{total.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <Button
                type="submit"
                form="checkout-form"
                disabled={loading}
                className="w-full bg-[#3b2314] hover:bg-[#5c3420] text-white py-8 text-xl font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                {loading
                  ? "Redirecting to Payment..."
                  : `Pay ₹${total.toLocaleString("en-IN")} →`}
              </Button>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="flex items-center gap-2 justify-center text-xs font-medium text-coffee-800">
                  <Truck className="w-4 h-4" /> Free shipping ₹500+
                </div>
                <div className="flex items-center gap-2 justify-center text-xs font-medium text-coffee-800">
                  <ShieldCheck className="w-4 h-4" /> Razorpay Secured
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
