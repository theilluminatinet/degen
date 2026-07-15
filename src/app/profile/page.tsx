"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { US_STATES } from "@/lib/states";
import Link from "next/link";

interface UserProfile {
  id: number;
  email: string;
  username: string;
  displayName: string | null;
  state: string | null;
  avatarUrl: string | null;
  bio: string | null;
  role: string;
  favoriteCasinos: string | null;
  createdAt: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    displayName: "",
    state: "",
    bio: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetch("/api/users/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setUser(data.user);
          setForm((f) => ({
            ...f,
            displayName: data.user.displayName || "",
            state: data.user.state || "",
            bio: data.user.bio || "",
          }));
        } else {
          router.push("/login");
        }
        setLoading(false);
      })
      .catch(() => {
        router.push("/login");
      });
  }, [router]);

  const handleSave = async () => {
    setSaving(true);
    setMessage("");

    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      setMessage("Passwords don't match");
      setSaving(false);
      return;
    }

    const body: Record<string, string> = {
      displayName: form.displayName,
      state: form.state,
      bio: form.bio,
    };

    if (form.newPassword && form.currentPassword) {
      body.currentPassword = form.currentPassword;
      body.newPassword = form.newPassword;
    }

    const res = await fetch("/api/users/me", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage("Profile updated successfully!");
      setUser(data.user);
      setEditing(false);
      setForm((f) => ({ ...f, currentPassword: "", newPassword: "", confirmPassword: "" }));
    } else {
      setMessage(data.error || "Failed to update profile");
    }
    setSaving(false);
  };

  const handleLogout = async () => {
    await fetch("/api/users/logout", { method: "POST" });
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <p className="text-gold-400 animate-pulse">Loading...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <section className="flex-1 bg-dark-900 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-dark-700/50 border border-gold-800/20 rounded-2xl p-8">
            {/* Header */}
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-gold-500/30 to-gold-700/30 rounded-2xl flex items-center justify-center text-4xl border border-gold-600/30">
                  👑
                </div>
                <div>
                  <h1 className="text-2xl font-display font-bold text-white">{user.displayName || user.username}</h1>
                  <p className="text-gray-400">@{user.username}</p>
                  <p className="text-xs text-gray-500 mt-1">Member since {new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex gap-2">
                {!editing && (
                  <button
                    onClick={() => setEditing(true)}
                    className="px-4 py-2 text-sm text-gold-400 border border-gold-800/30 rounded-lg hover:bg-gold-500/10 transition-colors"
                  >
                    Edit Profile
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm text-red-400 border border-red-800/30 rounded-lg hover:bg-red-500/10 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>

            {message && (
              <div className={`mb-6 p-3 rounded-lg text-sm ${message.includes("success") ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
                {message}
              </div>
            )}

            {editing ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Display Name</label>
                    <input
                      type="text"
                      value={form.displayName}
                      onChange={(e) => setForm((f) => ({ ...f, displayName: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-dark-800 border border-gold-800/30 rounded-xl text-white focus:outline-none focus:border-gold-500/50"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Your State</label>
                    <select
                      value={form.state}
                      onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-dark-800 border border-gold-800/30 rounded-xl text-white focus:outline-none focus:border-gold-500/50"
                    >
                      <option value="">Select state...</option>
                      {US_STATES.map((s) => (
                        <option key={s.code} value={s.code}>{s.name}</option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Used to filter casinos by availability</p>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Bio</label>
                  <textarea
                    value={form.bio}
                    onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-2.5 bg-dark-800 border border-gold-800/30 rounded-xl text-white focus:outline-none focus:border-gold-500/50 resize-y"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                {/* Password change */}
                <div className="pt-6 border-t border-gold-800/20">
                  <h3 className="text-lg font-bold text-gold-400 mb-4">Change Password</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Current Password</label>
                      <input
                        type="password"
                        value={form.currentPassword}
                        onChange={(e) => setForm((f) => ({ ...f, currentPassword: e.target.value }))}
                        className="w-full px-4 py-2.5 bg-dark-800 border border-gold-800/30 rounded-xl text-white focus:outline-none focus:border-gold-500/50"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">New Password</label>
                      <input
                        type="password"
                        value={form.newPassword}
                        onChange={(e) => setForm((f) => ({ ...f, newPassword: e.target.value }))}
                        className="w-full px-4 py-2.5 bg-dark-800 border border-gold-800/30 rounded-xl text-white focus:outline-none focus:border-gold-500/50"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Confirm Password</label>
                      <input
                        type="password"
                        value={form.confirmPassword}
                        onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))}
                        className="w-full px-4 py-2.5 bg-dark-800 border border-gold-800/30 rounded-xl text-white focus:outline-none focus:border-gold-500/50"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-2.5 bg-gold-500 text-black font-bold rounded-xl text-sm uppercase tracking-wider hover:bg-gold-400 disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="px-6 py-2.5 border border-gold-800/30 text-gray-400 rounded-xl text-sm uppercase tracking-wider hover:text-white"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Email</p>
                    <p className="text-white">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Your State</p>
                    <p className="text-white">{user.state ? US_STATES.find((s) => s.code === user.state)?.name || user.state : "Not set"}</p>
                  </div>
                </div>
                {user.bio && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Bio</p>
                    <p className="text-gray-300">{user.bio}</p>
                  </div>
                )}

                <div className="pt-6 border-t border-gold-800/20">
                  <h3 className="text-lg font-bold text-gold-400 mb-4">Quick Links</h3>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={user.state ? `/casinos?state=${user.state}` : "/casinos"}
                      className="px-4 py-2 bg-gold-500/10 text-gold-400 rounded-lg text-sm hover:bg-gold-500/20 transition-colors"
                    >
                      🎰 Casinos in My State
                    </Link>
                    <Link
                      href="/strategies"
                      className="px-4 py-2 bg-gold-500/10 text-gold-400 rounded-lg text-sm hover:bg-gold-500/20 transition-colors"
                    >
                      📚 Strategies
                    </Link>
                    <Link
                      href="/blog"
                      className="px-4 py-2 bg-gold-500/10 text-gold-400 rounded-lg text-sm hover:bg-gold-500/20 transition-colors"
                    >
                      📝 Blog
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
