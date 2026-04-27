import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Package, User, Heart, Settings, LogOut, Coffee, Award, MapPin } from "lucide-react";
import Link from "next/link";
import { FallbackImage } from "@/components/ui/FallbackImage";
import LogoutButton from "./LogoutButton";
import { OrderTrackerBox } from "@/components/ui/OrderTrackerBox";
import UserProfileStats from "@/components/ui/UserProfileStats";

const NAV_LINKS = [
  { href: "/account", icon: User, label: "Dashboard", active: true },
  { href: "/account/orders", icon: Package, label: "My Orders" },
  { href: "/account/wishlist", icon: Heart, label: "Wishlist" },
  { href: "/account/settings", icon: Settings, label: "Settings" },
];

// QUICK_STATS logic moved to a discrete client component UserProfileStats or we fetch server-side

export default async function AccountPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const firstName = session.user?.name?.split(" ")[0] || "Coffee Lover";
  const initials = session.user?.name?.split(" ").map((n: string) => n[0]).join("").toUpperCase() || "?";

  return (
    <div className="bg-cream min-h-screen py-12">
      <div className="container mx-auto px-5 lg:px-8 max-w-6xl">
        {/* Page title */}
        <div className="mb-10">
          <p className="text-gold font-bold uppercase tracking-widest text-xs mb-2">Member Portal</p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-coffee-900">My Account</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Profile card */}
            <div className="bg-coffee-900 rounded-[2rem] p-6 text-center shadow-xl">
              {session.user?.image ? (
                <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-gold/30 mx-auto mb-4 shadow-lg">
                  <FallbackImage src={session.user.image} alt="Avatar" fill className="object-cover" sizes="80px" context="avatar" />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gold to-amber-500 text-coffee-950 font-bold text-2xl flex items-center justify-center mx-auto mb-4 shadow-lg border-4 border-gold/30">
                  {initials}
                </div>
              )}
              <p className="font-serif text-xl font-bold text-white">{session.user?.name || "Coffee Lover"}</p>
              <p className="text-coffee-400 text-sm mt-1 truncate">{session.user?.email}</p>
              <div className="mt-4 inline-flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-full px-3 py-1.5">
                <Coffee className="w-3.5 h-3.5 text-gold" />
                <span className="text-gold text-[10px] font-bold uppercase tracking-widest">Brew Member</span>
              </div>
            </div>

            {/* Nav links */}
            <div className="bg-white rounded-[2rem] p-4 shadow-sm border border-coffee-100 space-y-1">
              {NAV_LINKS.map(({ href, icon: Icon, label, active }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                    active ? "bg-coffee-900 text-white shadow-sm" : "text-coffee-600 hover:bg-coffee-50 hover:text-coffee-900"
                  }`}
                >
                  <Icon className="w-4 h-4" /> {label}
                </Link>
              ))}
              <div className="pt-2 mt-2 border-t border-coffee-100">
                <LogoutButton />
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Welcome */}
            <div className="bg-gradient-to-br from-coffee-900 to-coffee-950 rounded-[2rem] p-8 shadow-xl relative overflow-hidden">
              <div className="absolute -right-8 -top-8 w-40 h-40 bg-gold/5 rounded-full" />
              <div className="absolute right-4 bottom-4 w-20 h-20 bg-gold/5 rounded-full" />
              <p className="text-gold font-bold uppercase tracking-widest text-xs mb-2 relative z-10">Welcome back!</p>
              <h2 className="font-serif text-3xl font-bold text-white mb-3 relative z-10">Hello, {firstName}! ☕</h2>
              <p className="text-coffee-300 leading-relaxed max-w-lg relative z-10">
                From here you can track your orders, manage your profile, and explore your wishlist. Happy brewing!
              </p>
            </div>

            {/* Stats row */}
            <UserProfileStats />

            {/* Live Order Tracker */}
            <OrderTrackerBox />

            {/* Action cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                {
                  icon: Package, color: "text-coffee-700", bg: "bg-coffee-100",
                  title: "Recent Orders", desc: "Track the status of your purchases and view invoices.",
                  href: "/account/orders", cta: "View Orders",
                },
                {
                  icon: Settings, color: "text-gold", bg: "bg-gold/10",
                  title: "Account Details", desc: "Update your email, password, and delivery addresses.",
                  href: "/account/settings", cta: "Edit Profile",
                },
              ].map(card => (
                <div key={card.title} className="bg-white rounded-[2rem] p-8 border border-coffee-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all relative overflow-hidden group">
                  <div className={`w-14 h-14 ${card.bg} rounded-2xl flex items-center justify-center mb-5`}>
                    <card.icon className={`w-7 h-7 ${card.color}`} strokeWidth={1.5} />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-coffee-900 mb-3">{card.title}</h3>
                  <p className="text-coffee-500 text-sm leading-relaxed mb-6">{card.desc}</p>
                  <Link href={card.href} className="inline-flex items-center gap-2 bg-coffee-900 hover:bg-coffee-800 text-white font-bold text-xs uppercase tracking-widest px-5 py-2.5 rounded-xl transition-all">
                    {card.cta}
                  </Link>
                </div>
              ))}
            </div>

            {/* Call to shop */}
            <div className="bg-cream border border-coffee-200 rounded-[2rem] p-8 flex flex-col sm:flex-row items-center gap-6">
              <div className="w-16 h-16 bg-gold/10 border border-gold/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Coffee className="w-8 h-8 text-gold" strokeWidth={1.5} />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="font-serif text-xl font-bold text-coffee-900 mb-1">Ready for your next brew?</h3>
                <p className="text-coffee-500 text-sm">Explore our freshly roasted single-origin selection.</p>
              </div>
              <Link href="/products">
                <button className="flex-shrink-0 bg-coffee-900 hover:bg-coffee-800 text-white font-bold px-7 py-3 rounded-2xl transition-all text-sm">Shop Now</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
