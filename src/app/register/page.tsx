"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { US_STATES } from "@/lib/states";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    displayName: "",
    state: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.email,
        username: form.username,
        password: form.password,
        displayName: form.displayName || form.username,
        state: form.state,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      router.push("/profile");
    } else {
      setError(data.error || "Registration failed");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <section className="flex-1 bg-dark-900 flex items-center justify-center py-12">
        <div className="w-full max-w-md px-4">
          <div className="bg-dark-700/50 border border-gold-800/20 rounded-2xl p-8">
            <div className="text-center mb-8">
              <span className="text-5xl">👑</span>
              <h1 className="text-2xl font-display font-bold text-gold-400 mt-4">Join Degen Central</h1>
              <p className="text-sm text-gray-400 mt-1">Create your account and live like a KING</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-dark-800 border border-gold-800/30 rounded-xl text-white focus:outline-none focus:border-gold-500/50"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Username</label>
                <input
                  type="text"
                  value={form.username}
                  onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-dark-800 border border-gold-800/30 rounded-xl text-white focus:outline-none focus:border-gold-500/50"
                  placeholder="3-20 characters, letters/numbers/underscore"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Display Name (optional)</label>
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
                  <option value="">Select state (optional)</option>
                  {US_STATES.map((s) => (
                    <option key={s.code} value={s.code}>{s.name}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">Helps filter casinos by availability</p>
              </div>
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Password</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-dark-800 border border-gold-800/30 rounded-xl text-white focus:outline-none focus:border-gold-500/50"
                  placeholder="Minimum 6 characters"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Confirm Password</label>
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-dark-800 border border-gold-800/30 rounded-xl text-white focus:outline-none focus:border-gold-500/50"
                  required
                />
              </div>

              {error && (
                <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-gold-600 to-gold-500 text-black font-bold rounded-xl uppercase tracking-wider text-sm hover:from-gold-500 hover:to-gold-400 transition-all disabled:opacity-50"
              >
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400 text-sm">
                Already have an account?{" "}
                <Link href="/login" className="text-gold-400 hover:text-gold-300">
                  Sign in
                </Link>
              </p>
            </div>

            <div className="mt-4 text-center">
              <Link href="/" className="text-sm text-gray-500 hover:text-gold-400">← Back to Home</Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
