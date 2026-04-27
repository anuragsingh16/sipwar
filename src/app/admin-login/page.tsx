"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Shield, ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError("Invalid credentials. Admin access denied.");
      setLoading(false);
      return;
    }

    // After signIn succeeds, check if user is admin via session
    // Retrieve a fresh, un-cached session instead of risking Next.js' fetch cache
    const sessionRes = await fetch(`/api/auth/session?v=${Date.now()}`);
    const session = await sessionRes.json();

    if (session?.user?.role !== "admin") {
      setError("Access denied. This login is for administrators only.");
      setLoading(false);
      return;
    }

    router.push("/admin");
  };

  return (
    <div className="min-h-screen bg-[#0d0804] flex items-center justify-center p-6">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#3b2314_0%,_#0d0804_70%)] opacity-60" />

      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#cfb53b]/10 border border-[#cfb53b]/20 mb-5">
            <Shield className="w-8 h-8 text-[#cfb53b]" />
          </div>
          <h1 className="font-serif text-4xl font-bold text-white mb-2">Admin Portal</h1>
          <p className="text-[#8b6a4a] font-medium">Sipwar Coffee · Restricted Access</p>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 backdrop-blur-md shadow-2xl">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3 mb-6 font-medium flex items-center gap-2">
              <Shield className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-xs font-bold text-[#8b6a4a] uppercase tracking-widest">
                Admin Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@sipwar.com"
                required
                className="w-full bg-white/[0.05] border border-white/10 focus:border-[#cfb53b]/50 rounded-xl px-4 py-3.5 text-white placeholder:text-white/20 focus:outline-none transition-all font-medium"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-xs font-bold text-[#8b6a4a] uppercase tracking-widest">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full bg-white/[0.05] border border-white/10 focus:border-[#cfb53b]/50 rounded-xl px-4 py-3.5 pr-12 text-white placeholder:text-white/20 focus:outline-none transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 h-14 bg-gradient-to-r from-[#cfb53b] to-amber-500 text-[#1a0e0a] font-bold text-base rounded-2xl transition-all hover:shadow-[0_0_30px_rgba(207,181,59,0.3)] disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-[#1a0e0a]/30 border-t-[#1a0e0a] rounded-full animate-spin" />
                  Verifying...
                </span>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  Access Dashboard
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-[#8b6a4a]/50 text-xs mt-6 font-medium">
            This is a secure area. All access attempts are logged.
          </p>
        </div>

        <p className="text-center mt-6">
          <a href="/" className="text-[#8b6a4a] text-sm hover:text-white transition-colors font-medium">
            ← Back to Sipwar Coffee
          </a>
        </p>
      </div>
    </div>
  );
}
