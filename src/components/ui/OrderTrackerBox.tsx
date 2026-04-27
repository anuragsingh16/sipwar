"use client";

import { useEffect, useState } from "react";
import { Package, Truck, CheckCircle2, Clock } from "lucide-react";
import Link from "next/link";

interface Order {
  _id: string;
  orderNumber?: string;
  createdAt: string;
  totalAmount: number;
  orderStatus?: string;
  status?: string;
}

export function OrderTrackerBox() {
  const [recentOrder, setRecentOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/user/orders");
        if (res.ok) {
          const data = await res.json();
          if (data.orders && data.orders.length > 0) {
            setRecentOrder(data.orders[0]); // Get most recent order
          }
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-[2rem] p-8 border border-coffee-100 shadow-sm animate-pulse h-48">
        <div className="h-6 bg-coffee-100 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-coffee-50 rounded w-1/2"></div>
      </div>
    );
  }

  if (!recentOrder) {
    return null; // Don't show the box if no orders
  }

  const steps = [
    { label: "Pending", icon: Clock },
    { label: "Processing", icon: Package },
    { label: "Shipped", icon: Truck },
    { label: "Delivered", icon: CheckCircle2 },
  ];

  const statusKey = (recentOrder.orderStatus || recentOrder.status || "pending").toLowerCase();
  const currentStepIndex = Math.max(0, steps.findIndex((s) => s.label.toLowerCase() === statusKey));

  return (
    <div className="bg-white rounded-[2rem] p-8 border border-coffee-100 shadow-sm relative overflow-hidden group">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-gold font-bold uppercase tracking-widest text-xs mb-1">Active Order</p>
          <h3 className="font-serif text-2xl font-bold text-coffee-900">
            Order #{recentOrder.orderNumber?.replace("ORD-", "") || recentOrder._id.slice(-6).toUpperCase()}
          </h3>
        </div>
        <Link href={`/account/orders`} className="text-coffee-600 text-sm font-bold hover:text-coffee-900 transition-colors underline underline-offset-4">
          View Details
        </Link>
      </div>

      {/* Tracking Steps */}
      <div className="relative flex justify-between items-center mb-4">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-coffee-100 rounded-full z-0"></div>
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-terracotta rounded-full z-0 transition-all duration-1000"
          style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
        ></div>

        {steps.map((step, index) => {
          const isActive = index <= currentStepIndex;
          const Icon = step.icon;
          return (
            <div key={step.label} className="relative z-10 flex flex-col items-center gap-2 bg-white px-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  isActive ? "bg-terracotta text-white" : "bg-coffee-50 text-coffee-300"
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? "text-terracotta" : "text-coffee-400"}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
      
      <p className="text-center text-sm text-coffee-500 mt-6">
        Ordered on {new Date(recentOrder.createdAt).toLocaleDateString()} • Total: ₹{recentOrder.totalAmount?.toLocaleString("en-IN")}
      </p>
    </div>
  );
}
