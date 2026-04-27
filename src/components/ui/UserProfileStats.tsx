"use client";

import { useEffect, useState } from "react";
import { Package, Heart, Award } from "lucide-react";

export default function UserProfileStats() {
  const [stats, setStats] = useState({ totalOrders: 0, wishlistItems: 0, brewPoints: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/user/stats");
        if (res.ok) {
          const data = await res.json();
          setStats({
            totalOrders: data.totalOrders || 0,
            wishlistItems: data.wishlistItems || 0,
            brewPoints: data.brewPoints || 0,
          });
        }
      } catch (error) {
        console.error("Failed to fetch user stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const QUICK_STATS = [
    { icon: Package, label: "Total Orders", value: stats.totalOrders.toString(), color: "text-coffee-700", bg: "bg-coffee-100" },
    { icon: Heart, label: "Wishlist Items", value: stats.wishlistItems.toString(), color: "text-terracotta", bg: "bg-terracotta/10" },
    { icon: Award, label: "Brew Points", value: stats.brewPoints.toString(), color: "text-gold", bg: "bg-gold/10" },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-[1.5rem] p-6 border border-coffee-100 shadow-sm animate-pulse h-32" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {QUICK_STATS.map(({ icon: Icon, label, value, color, bg }) => (
        <div key={label} className="bg-white rounded-[1.5rem] p-6 text-center border border-coffee-100 shadow-sm hover:-translate-y-1 transition-transform">
          <div className={`w-12 h-12 ${bg} rounded-2xl flex items-center justify-center mx-auto mb-3`}>
            <Icon className={`w-6 h-6 ${color}`} />
          </div>
          <p className="font-mono text-3xl font-bold text-coffee-900 leading-none mb-1">{value}</p>
          <p className="text-coffee-500 text-xs font-bold uppercase tracking-wide">{label}</p>
        </div>
      ))}
    </div>
  );
}
