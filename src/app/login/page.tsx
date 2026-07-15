"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ login: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      router.push("/profile");
    } else {
      setError(data.error || "Login failed");
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
              <h1 className="text-2xl font-display font-bold text-gold-400 mt-4">Welcome Back</h1>
              <p className="text-sm text-gray-400 mt-1">Sign in to your Degen Central account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Email or Username</label>
                <input
                  type="text"
                  value={form.login}
                  onChange={(e) => setForm((f) => ({ ...f, login: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-dark-800 border border-gold-800/30 rounded-xl text-white focus:outline-none focus:border-gold-500/50"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Password</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
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
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400 text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="text-gold-400 hover:text-gold-300">
                  Create one
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
