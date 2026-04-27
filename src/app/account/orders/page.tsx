"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Package, ChevronRight, X, Clock, CheckCircle2, Truck, XCircle, AlertCircle, RefreshCw } from "lucide-react";

interface Order {
  _id: string;
  orderNumber?: string;
  items: Array<{ name: string; quantity: number; price: number; weight?: string }>;
  totalAmount: number;
  paymentStatus: string;
  orderStatus?: string;
  status?: string;
  createdAt: string;
  shippingAddress?: { fullName?: string; city?: string; state?: string };
}

const STATUS_CONFIG: Record<string, { label: string; icon: typeof Clock; color: string; bg: string }> = {
  pending:   { label: "Pending",    icon: Clock,         color: "text-yellow-700", bg: "bg-yellow-50 border-yellow-200" },
  confirmed: { label: "Confirmed",  icon: CheckCircle2,  color: "text-blue-700",   bg: "bg-blue-50 border-blue-200" },
  processing:{ label: "Processing", icon: Package,       color: "text-purple-700", bg: "bg-purple-50 border-purple-200" },
  shipped:   { label: "Shipped",    icon: Truck,         color: "text-indigo-700", bg: "bg-indigo-50 border-indigo-200" },
  delivered: { label: "Delivered",  icon: CheckCircle2,  color: "text-green-700",  bg: "bg-green-50 border-green-200" },
  cancelled: { label: "Cancelled",  icon: XCircle,       color: "text-red-700",    bg: "bg-red-50 border-red-200" },
};

const CANCELLABLE = ["pending", "confirmed", "processing"];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [confirmCancel, setConfirmCancel] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/user/orders");
    if (res.ok) {
      const data = await res.json();
      setOrders(data.orders || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const cancelOrder = async (id: string) => {
    setCancellingId(id);
    const res = await fetch(`/api/user/orders/${id}/cancel`, { method: "POST" });
    if (res.ok) {
      setOrders(prev => prev.map(o => o._id === id ? { ...o, orderStatus: "cancelled", status: "cancelled" } : o));
    }
    setCancellingId(null);
    setConfirmCancel(null);
  };

  if (loading) return (
    <div className="min-h-screen bg-[#faf6f0] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <RefreshCw className="w-8 h-8 text-[#8b6a4a] animate-spin" />
        <p className="text-[#8b6a4a] font-medium">Loading your orders...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#faf6f0] py-12">
      <div className="container mx-auto px-5 lg:px-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <nav className="flex items-center gap-2 text-[#8b6a4a] text-sm mb-4">
            <Link href="/account" className="hover:text-[#3b2314]">Account</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#3b2314] font-bold">My Orders</span>
          </nav>
          <h1 className="font-serif text-4xl font-bold text-[#3b2314]">My Orders</h1>
          <p className="text-[#8b6a4a] mt-1">{orders.length} order{orders.length !== 1 ? "s" : ""} total</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#e8dcd0] p-16 text-center">
            <Package className="w-16 h-16 text-[#c8a882] mx-auto mb-4" strokeWidth={1} />
            <h2 className="font-serif text-2xl font-bold text-[#3b2314] mb-2">No orders yet</h2>
            <p className="text-[#8b6a4a] mb-6">Start your coffee journey today!</p>
            <Link href="/products" className="inline-flex items-center gap-2 bg-[#3b2314] hover:bg-[#5c3420] text-white font-bold px-6 py-3 rounded-2xl transition-all">
              Shop Coffee <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const statusKey = order.orderStatus || order.status || "pending";
              const cfg = STATUS_CONFIG[statusKey] || STATUS_CONFIG.pending;
              const StatusIcon = cfg.icon;
              const canCancel = CANCELLABLE.includes(statusKey);
              const dateStr = new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

              return (
                <div key={order._id} className="bg-white rounded-3xl border border-[#e8dcd0] shadow-sm overflow-hidden">
                  {/* Header row */}
                  <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-[#f0e6d8]">
                    <div>
                      <span className="font-mono text-sm font-bold text-[#3b2314]">
                        #{order.orderNumber || order._id.slice(-8).toUpperCase()}
                      </span>
                      <span className="text-[#c8a882] text-sm ml-3">{dateStr}</span>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${cfg.bg} ${cfg.color}`}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      {cfg.label}
                    </span>
                  </div>

                  {/* Items */}
                  <div className="px-6 py-4 space-y-2">
                    {order.items?.slice(0, 3).map((item, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-[#3b2314] font-medium">
                          {item.name} {item.weight && <span className="text-[#8b6a4a]">({item.weight})</span>} × {item.quantity}
                        </span>
                        <span className="font-mono text-[#3b2314] font-bold">₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                      </div>
                    ))}
                    {(order.items?.length || 0) > 3 && (
                      <p className="text-[#8b6a4a] text-xs">+{order.items.length - 3} more items</p>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="px-6 py-4 bg-[#faf6f0] flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <span className="text-sm text-[#8b6a4a]">Total: </span>
                      <span className="font-mono font-bold text-[#3b2314] text-lg">₹{order.totalAmount?.toLocaleString("en-IN")}</span>
                      <span className={`ml-3 text-xs font-bold px-2 py-1 rounded-full ${order.paymentStatus === "paid" ? "bg-green-100 text-green-700" : order.paymentStatus === "refunded" ? "bg-blue-100 text-blue-700" : "bg-yellow-100 text-yellow-700"}`}>
                        {order.paymentStatus}
                      </span>
                    </div>
                    {canCancel && (
                      confirmCancel === order._id ? (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-[#8b6a4a]">Cancel this order?</span>
                          <button
                            onClick={() => cancelOrder(order._id)}
                            disabled={cancellingId === order._id}
                            className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all disabled:opacity-60"
                          >
                            {cancellingId === order._id ? "Cancelling..." : "Yes, Cancel"}
                          </button>
                          <button onClick={() => setConfirmCancel(null)} className="text-[#8b6a4a] text-xs font-bold px-3 py-2 hover:text-[#3b2314]">
                            Keep Order
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmCancel(order._id)}
                          className="flex items-center gap-1.5 text-red-600 hover:text-red-700 border border-red-200 hover:border-red-400 text-xs font-bold px-4 py-2 rounded-xl transition-all"
                        >
                          <X className="w-3.5 h-3.5" /> Cancel Order
                        </button>
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Info box */}
        <div className="mt-6 flex items-start gap-3 bg-[#cfb53b]/10 border border-[#cfb53b]/20 rounded-2xl px-5 py-4">
          <AlertCircle className="w-5 h-5 text-[#cfb53b] flex-shrink-0 mt-0.5" />
          <p className="text-[#8b6a4a] text-sm">
            Orders can be cancelled only while in <strong>Pending, Confirmed,</strong> or <strong>Processing</strong> status. Once shipped, cancellations are not available.
          </p>
        </div>
      </div>
    </div>
  );
}
