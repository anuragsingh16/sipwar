"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronRight, Save, Eye, EyeOff, AlertCircle, CheckCircle2, User, Lock, Phone } from "lucide-react";

interface UserProfile {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  authProvider?: string;
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<UserProfile>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/user/profile");
    if (res.ok) {
      const data = await res.json();
      setProfile(data.user || {});
      setFirstName(data.user?.firstName || "");
      setLastName(data.user?.lastName || "");
      setPhone(data.user?.phone || "");
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword && newPassword !== confirmPassword) {
      setMsg({ type: "error", text: "New passwords do not match" });
      return;
    }
    setSaving(true);
    setMsg(null);
    const body: Record<string, string> = { firstName, lastName, phone };
    if (newPassword) { body.currentPassword = currentPassword; body.newPassword = newPassword; }
    const res = await fetch("/api/user/profile", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const data = await res.json();
    setMsg(res.ok ? { type: "success", text: data.message } : { type: "error", text: data.error });
    if (res.ok) { setCurrentPassword(""); setNewPassword(""); setConfirmPassword(""); }
    setSaving(false);
  };

  if (loading) return <div className="min-h-screen bg-[#faf6f0] flex items-center justify-center"><div className="w-8 h-8 border-4 border-[#3b2314]/20 border-t-[#3b2314] rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-[#faf6f0] py-12">
      <div className="container mx-auto px-5 lg:px-8 max-w-2xl">
        <div className="mb-8">
          <nav className="flex items-center gap-2 text-[#8b6a4a] text-sm mb-4">
            <Link href="/account" className="hover:text-[#3b2314]">Account</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#3b2314] font-bold">Settings</span>
          </nav>
          <h1 className="font-serif text-4xl font-bold text-[#3b2314]">Account Settings</h1>
        </div>

        {msg && (
          <div className={`flex items-center gap-3 rounded-2xl px-5 py-4 mb-6 border ${msg.type === "success" ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"}`}>
            {msg.type === "success" ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
            <p className="font-medium text-sm">{msg.text}</p>
          </div>
        )}

        <form onSubmit={saveProfile} className="space-y-6">
          {/* Personal Info */}
          <div className="bg-white rounded-3xl border border-[#e8dcd0] p-7 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#3b2314]/10 rounded-2xl flex items-center justify-center">
                <User className="w-5 h-5 text-[#3b2314]" />
              </div>
              <h2 className="font-bold text-[#3b2314] text-lg">Personal Information</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#8b6a4a] uppercase tracking-wider mb-2">First Name</label>
                <input value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full border-2 border-[#e8dcd0] focus:border-[#3b2314] rounded-xl px-4 py-3 text-[#3b2314] focus:outline-none transition-all font-medium" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#8b6a4a] uppercase tracking-wider mb-2">Last Name</label>
                <input value={lastName} onChange={e => setLastName(e.target.value)} className="w-full border-2 border-[#e8dcd0] focus:border-[#3b2314] rounded-xl px-4 py-3 text-[#3b2314] focus:outline-none transition-all font-medium" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#8b6a4a] uppercase tracking-wider mb-2">Email Address</label>
                <input value={profile.email || ""} disabled className="w-full border-2 border-[#e8dcd0] bg-[#faf6f0] rounded-xl px-4 py-3 text-[#8b6a4a] cursor-not-allowed font-medium" />
                <p className="text-xs text-[#c8a882] mt-1">Email cannot be changed</p>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#8b6a4a] uppercase tracking-wider mb-2">
                  <Phone className="inline w-3.5 h-3.5 mr-1" />Phone Number
                </label>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="10-digit mobile number" className="w-full border-2 border-[#e8dcd0] focus:border-[#3b2314] rounded-xl px-4 py-3 text-[#3b2314] focus:outline-none transition-all font-medium" />
              </div>
            </div>
          </div>

          {/* Change Password — only for email users */}
          {profile.authProvider !== "google" && (
            <div className="bg-white rounded-3xl border border-[#e8dcd0] p-7 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#3b2314]/10 rounded-2xl flex items-center justify-center">
                  <Lock className="w-5 h-5 text-[#3b2314]" />
                </div>
                <h2 className="font-bold text-[#3b2314] text-lg">Change Password</h2>
              </div>
              <div className="space-y-4">
                {[
                  { label: "Current Password", value: currentPassword, set: setCurrentPassword },
                  { label: "New Password", value: newPassword, set: setNewPassword, hint: "Minimum 6 characters" },
                  { label: "Confirm New Password", value: confirmPassword, set: setConfirmPassword },
                ].map(({ label, value, set, hint }) => (
                  <div key={label}>
                    <label className="block text-xs font-bold text-[#8b6a4a] uppercase tracking-wider mb-2">{label}</label>
                    <div className="relative">
                      <input type={showPwd ? "text" : "password"} value={value} onChange={e => set(e.target.value)} placeholder="••••••••" className="w-full border-2 border-[#e8dcd0] focus:border-[#3b2314] rounded-xl px-4 py-3 pr-12 text-[#3b2314] focus:outline-none transition-all font-medium" />
                      <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#c8a882] hover:text-[#3b2314]">
                        {showPwd ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {hint && <p className="text-xs text-[#c8a882] mt-1">{hint}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          <button type="submit" disabled={saving} className="w-full flex items-center justify-center gap-2 h-14 bg-[#3b2314] hover:bg-[#5c3420] text-white font-bold text-base rounded-2xl transition-all disabled:opacity-60">
            {saving ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Saving...</> : <><Save className="w-5 h-5" /> Save Changes</>}
          </button>
        </form>
      </div>
    </div>
  );
}
