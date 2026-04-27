"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { signIn } from "next-auth/react";
import { Suspense } from "react";

const BG_IMG = "/images/coffee-hero.jpg";

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/account";
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setForm(prev => ({ ...prev, [e.target.id]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Something went wrong");
      setLoading(false);
    } else {
      await signIn("credentials", { redirect: false, email: form.email, password: form.password });
      router.push(redirectTo);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-16 bg-white">
        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-coffee-200">
              <Image src="/images/logo-badge.png" alt="Sipwar" fill className="object-cover" sizes="64px" />
            </div>
            <span className="font-serif text-2xl font-bold text-coffee-900">Sipwar</span>
          </Link>

          <div className="mb-10">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-coffee-900 mb-2">Join the Family.</h1>
            <p className="text-coffee-500 font-medium">Create your Sipwar account and start brewing better.</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-6 font-medium">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {[
              { id: "name", label: "Full Name", type: "text", placeholder: "Rahul Sharma" },
              { id: "email", label: "Email Address", type: "email", placeholder: "you@example.com" },
            ].map((f) => (
              <div key={f.id} className="space-y-2">
                <label htmlFor={f.id} className="block text-sm font-bold text-coffee-800 tracking-wide">{f.label}</label>
                <input
                  id={f.id}
                  type={f.type}
                  value={(form as any)[f.id]}
                  onChange={handleChange}
                  placeholder={f.placeholder}
                  required
                  className="w-full border-2 border-coffee-100 focus:border-coffee-800 bg-coffee-50 rounded-xl px-4 py-3.5 text-coffee-900 placeholder:text-coffee-300 focus:outline-none transition-all font-medium"
                />
              </div>
            ))}

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-bold text-coffee-800 tracking-wide">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  required
                  minLength={6}
                  className="w-full border-2 border-coffee-100 focus:border-coffee-800 bg-coffee-50 rounded-xl px-4 py-3.5 pr-12 text-coffee-900 placeholder:text-coffee-300 focus:outline-none transition-all font-medium"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-coffee-400 hover:text-coffee-700 transition-colors">
                  {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {/* Password strength bar */}
              {form.password && (
                <div className="h-1.5 w-full bg-coffee-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${form.password.length < 6 ? "w-1/4 bg-red-400" : form.password.length < 10 ? "w-1/2 bg-yellow-500" : "w-full bg-green-eco"}`} />
                </div>
              )}
            </div>

            <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 h-14 bg-coffee-900 hover:bg-coffee-800 text-white font-bold text-base rounded-2xl transition-all hover:shadow-xl disabled:opacity-60 mt-2">
              {loading ? (
                <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Creating account...</span>
              ) : (
                <>Create My Account <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </form>

          <div className="my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-coffee-100" />
            <span className="text-coffee-400 text-sm font-medium">or</span>
            <div className="flex-1 h-px bg-coffee-100" />
          </div>

          <button
            onClick={() => signIn("google", { callbackUrl: redirectTo })}
            className="w-full flex items-center justify-center gap-3 border-2 border-coffee-200 hover:border-coffee-400 bg-white text-coffee-800 font-semibold h-14 rounded-2xl transition-all hover:shadow-md"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </button>

          <p className="text-center text-coffee-500 mt-8 text-sm font-medium">
            Already have an account?{" "}
            <Link href={`/login?redirect=${encodeURIComponent(redirectTo)}`} className="text-coffee-900 font-bold hover:underline underline-offset-2">Sign in</Link>
          </p>
        </div>
      </div>

      {/* Right panel — image */}
      <div className="hidden lg:block relative w-1/2 overflow-hidden">
        <Image src={BG_IMG} alt="Coffee" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-coffee-950/50 to-coffee-950/80" />
        <div className="absolute bottom-12 left-12 right-12 z-10">
          <div className="flex items-center gap-3 mb-5">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white/20"><Image src="/images/logo-badge.png" alt="Sipwar" fill className="object-cover" sizes="48px" /></div>
            <span className="font-serif text-3xl font-bold text-white">Sipwar</span>
          </div>
          <blockquote className="font-serif text-2xl text-white font-bold leading-snug">
            "Every cup is a journey from farm to heart."
          </blockquote>
          <p className="text-coffee-200 text-sm mt-3">#IndianBrand — #ChuskiKiLadai</p>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-coffee-200 border-t-coffee-800 rounded-full animate-spin" /></div>}>
      <SignupForm />
    </Suspense>
  );
}
