"use client";

import { useState, useEffect, useCallback } from "react";
import type { Casino, Strategy, BlogPost, Faq } from "@/db/schema";
import Link from "next/link";
import { US_STATES, getBannedStatesArray, COMMON_BANNED_PRESETS } from "@/lib/states";

type Tab = "casinos" | "strategies" | "blog" | "faqs" | "settings";

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [tab, setTab] = useState<Tab>("casinos");
  const [casinos, setCasinos] = useState<Casino[]>([]);
  const [strats, setStrats] = useState<Strategy[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [faqList, setFaqList] = useState<Faq[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [editingCasino, setEditingCasino] = useState<Partial<Casino> | null>(null);
  const [editingStrategy, setEditingStrategy] = useState<Partial<Strategy> | null>(null);
  const [editingBlog, setEditingBlog] = useState<Partial<BlogPost> | null>(null);
  const [editingFaq, setEditingFaq] = useState<Partial<Faq> | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const loadData = useCallback(async () => {
    const [cr, sr, br, fr, st] = await Promise.all([
      fetch("/api/casinos").then((r) => r.json()),
      fetch("/api/strategies").then((r) => r.json()),
      fetch("/api/blog?all=true").then((r) => r.json()),
      fetch("/api/faqs?all=true").then((r) => r.json()),
      fetch("/api/settings").then((r) => r.json()),
    ]);
    if (Array.isArray(cr)) setCasinos(cr);
    if (Array.isArray(sr)) setStrats(sr);
    if (Array.isArray(br)) setBlogPosts(br);
    if (Array.isArray(fr)) setFaqList(fr);
    if (typeof st === "object" && !Array.isArray(st)) setSettings(st);
  }, []);

  useEffect(() => {
    fetch("/api/auth/check")
      .then((r) => r.json())
      .then((data) => {
        setAuthenticated(data.authenticated);
        setChecking(false);
        if (data.authenticated) loadData();
      })
      .catch(() => setChecking(false));
  }, [loadData]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginForm),
    });
    if (res.ok) {
      setAuthenticated(true);
      loadData();
    } else {
      setLoginError("Invalid credentials");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setAuthenticated(false);
  };

  const handleSeed = async () => {
    setSaving(true);
    const res = await fetch("/api/seed", { method: "POST" });
    const data = await res.json();
    setMessage(data.message || data.error || "Done");
    await loadData();
    setSaving(false);
  };

  // Casino CRUD
  const saveCasino = async () => {
    if (!editingCasino) return;
    setSaving(true);
    const isEdit = editingCasino.id;
    const url = isEdit ? `/api/casinos/${editingCasino.id}` : "/api/casinos";
    const method = isEdit ? "PUT" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(editingCasino) });
    if (res.ok) { setEditingCasino(null); setMessage("Casino saved!"); await loadData(); }
    else { const data = await res.json(); setMessage(data.error || "Failed to save"); }
    setSaving(false);
  };

  const deleteCasino = async (id: number) => {
    if (!confirm("Delete this casino?")) return;
    const res = await fetch(`/api/casinos/${id}`, { method: "DELETE" });
    if (res.ok) { setMessage("Casino deleted"); await loadData(); }
  };

  // Strategy CRUD
  const saveStrategy = async () => {
    if (!editingStrategy) return;
    setSaving(true);
    const isEdit = editingStrategy.id;
    const url = isEdit ? `/api/strategies/${editingStrategy.id}` : "/api/strategies";
    const method = isEdit ? "PUT" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(editingStrategy) });
    if (res.ok) { setEditingStrategy(null); setMessage("Strategy saved!"); await loadData(); }
    else { const data = await res.json(); setMessage(data.error || "Failed to save"); }
    setSaving(false);
  };

  const deleteStrategy = async (id: number) => {
    if (!confirm("Delete this strategy?")) return;
    const res = await fetch(`/api/strategies/${id}`, { method: "DELETE" });
    if (res.ok) { setMessage("Strategy deleted"); await loadData(); }
  };

  // Blog CRUD
  const saveBlog = async () => {
    if (!editingBlog) return;
    setSaving(true);
    const isEdit = editingBlog.id;
    const url = isEdit ? `/api/blog/${editingBlog.id}` : "/api/blog";
    const method = isEdit ? "PUT" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(editingBlog) });
    if (res.ok) { setEditingBlog(null); setMessage("Blog post saved!"); await loadData(); }
    else { const data = await res.json(); setMessage(data.error || "Failed to save"); }
    setSaving(false);
  };

  const deleteBlog = async (id: number) => {
    if (!confirm("Delete this blog post?")) return;
    const res = await fetch(`/api/blog/${id}`, { method: "DELETE" });
    if (res.ok) { setMessage("Blog post deleted"); await loadData(); }
  };

  // FAQ CRUD
  const saveFaq = async () => {
    if (!editingFaq) return;
    setSaving(true);
    const isEdit = editingFaq.id;
    const url = isEdit ? `/api/faqs/${editingFaq.id}` : "/api/faqs";
    const method = isEdit ? "PUT" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(editingFaq) });
    if (res.ok) { setEditingFaq(null); setMessage("FAQ saved!"); await loadData(); }
    else { const data = await res.json(); setMessage(data.error || "Failed to save"); }
    setSaving(false);
  };

  const deleteFaq = async (id: number) => {
    if (!confirm("Delete this FAQ?")) return;
    const res = await fetch(`/api/faqs/${id}`, { method: "DELETE" });
    if (res.ok) { setMessage("FAQ deleted"); await loadData(); }
  };

  // Settings
  const saveSettings = async () => {
    setSaving(true);
    const res = await fetch("/api/settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(settings) });
    if (res.ok) { setMessage("Settings saved!"); }
    else { setMessage("Failed to save settings"); }
    setSaving(false);
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <p className="text-gold-400 animate-pulse">Loading...</p>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="bg-dark-700/50 border border-gold-800/20 rounded-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <span className="text-4xl">👑</span>
            <h1 className="text-2xl font-display font-bold text-gold-400 mt-2">Admin Login</h1>
            <p className="text-sm text-gray-400 mt-1">Degen Central Dashboard</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wider">Username</label>
              <input type="text" value={loginForm.username} onChange={(e) => setLoginForm((f) => ({ ...f, username: e.target.value }))} className="w-full mt-1 px-4 py-2.5 bg-dark-800 border border-gold-800/30 rounded-xl text-white focus:outline-none focus:border-gold-500/50" />
            </div>
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wider">Password</label>
              <input type="password" value={loginForm.password} onChange={(e) => setLoginForm((f) => ({ ...f, password: e.target.value }))} className="w-full mt-1 px-4 py-2.5 bg-dark-800 border border-gold-800/30 rounded-xl text-white focus:outline-none focus:border-gold-500/50" />
            </div>
            {loginError && <p className="text-red-400 text-sm">{loginError}</p>}
            <button type="submit" className="w-full py-3 bg-gradient-to-r from-gold-600 to-gold-500 text-black font-bold rounded-xl uppercase tracking-wider text-sm hover:from-gold-500 hover:to-gold-400 transition-all">Login</button>
          </form>
          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-gold-400 hover:text-gold-300">← Back to Site</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Admin header */}
      <div className="bg-dark-800 border-b border-gold-800/20 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">👑</span>
          <h1 className="text-xl font-display font-bold text-gold-400">Admin Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={handleSeed} disabled={saving} className="text-xs text-gray-400 hover:text-gold-400 transition-colors border border-gold-800/30 px-3 py-1.5 rounded-lg disabled:opacity-50">Seed Data</button>
          <Link href="/" className="text-xs text-gray-400 hover:text-gold-400 transition-colors">View Site</Link>
          <button onClick={handleLogout} className="text-xs text-red-400 hover:text-red-300 transition-colors">Logout</button>
        </div>
      </div>

      {message && (
        <div className="bg-gold-500/10 border-b border-gold-500/20 px-6 py-2 flex items-center justify-between">
          <p className="text-sm text-gold-400">{message}</p>
          <button onClick={() => setMessage("")} className="text-gold-400 hover:text-gold-300 text-sm">✕</button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {(["casinos", "strategies", "blog", "faqs", "settings"] as Tab[]).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`px-5 py-2.5 text-sm font-semibold rounded-xl transition-all uppercase tracking-wider ${tab === t ? "bg-gold-500 text-black" : "bg-dark-700 text-gray-400 hover:text-gold-400"}`}>
              {t === "casinos" && `Casinos (${casinos.length})`}
              {t === "strategies" && `Strategies (${strats.length})`}
              {t === "blog" && `Blog (${blogPosts.length})`}
              {t === "faqs" && `FAQs (${faqList.length})`}
              {t === "settings" && "Settings"}
            </button>
          ))}
        </div>

        {/* CASINOS TAB */}
        {tab === "casinos" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display font-bold text-white">Casino Listings</h2>
              <button onClick={() => setEditingCasino({ name: "", referralLink: "", tier: "B", promoValue: "", freeScDaily: false, dailyAmount: "", cashRedeem: true, giftCard: false, crypto: false, vip: false, sportsbook: false, parentCompany: "", location: "", notes: "", featured: false, greylisted: false, sortOrder: 0 })} className="px-4 py-2 bg-gold-500 text-black font-bold rounded-xl text-sm uppercase tracking-wider">+ Add Casino</button>
            </div>
            {editingCasino && <CasinoForm casino={editingCasino} onChange={setEditingCasino} onSave={saveCasino} onCancel={() => setEditingCasino(null)} saving={saving} />}
            <div className="space-y-3">
              {casinos.map((casino) => (
                <div key={casino.id} className={`bg-dark-700/50 border rounded-xl p-4 flex items-center justify-between ${casino.greylisted ? "border-red-800/30" : "border-gold-800/20"}`}>
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">🎰</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-white font-bold">{casino.name}</h3>
                        <span className="text-xs px-2 py-0.5 bg-gold-500/20 text-gold-400 rounded">{casino.tier}-Tier</span>
                        {casino.featured && <span className="text-xs px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded">Featured</span>}
                        {casino.greylisted && <span className="text-xs px-2 py-0.5 bg-red-500/20 text-red-400 rounded">Greylisted</span>}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{casino.promoValue} • Order: {casino.sortOrder}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setEditingCasino({ ...casino })} className="px-3 py-1.5 text-xs text-gold-400 border border-gold-800/30 rounded-lg hover:bg-gold-500/10">Edit</button>
                    <button onClick={() => deleteCasino(casino.id)} className="px-3 py-1.5 text-xs text-red-400 border border-red-800/30 rounded-lg hover:bg-red-500/10">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STRATEGIES TAB */}
        {tab === "strategies" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display font-bold text-white">Strategy Guides</h2>
              <button onClick={() => setEditingStrategy({ title: "", category: "", icon: "📝", excerpt: "", content: "", sortOrder: 0, published: true })} className="px-4 py-2 bg-gold-500 text-black font-bold rounded-xl text-sm uppercase tracking-wider">+ Add Strategy</button>
            </div>
            {editingStrategy && <StrategyForm strategy={editingStrategy} onChange={setEditingStrategy} onSave={saveStrategy} onCancel={() => setEditingStrategy(null)} saving={saving} />}
            <div className="space-y-3">
              {strats.map((strategy) => (
                <div key={strategy.id} className="bg-dark-700/50 border border-gold-800/20 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{strategy.icon}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-white font-bold">{strategy.title}</h3>
                        <span className="text-xs px-2 py-0.5 bg-gold-500/20 text-gold-400 rounded">{strategy.category}</span>
                        {!strategy.published && <span className="text-xs px-2 py-0.5 bg-gray-500/20 text-gray-400 rounded">Draft</span>}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{strategy.excerpt}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setEditingStrategy({ ...strategy })} className="px-3 py-1.5 text-xs text-gold-400 border border-gold-800/30 rounded-lg hover:bg-gold-500/10">Edit</button>
                    <button onClick={() => deleteStrategy(strategy.id)} className="px-3 py-1.5 text-xs text-red-400 border border-red-800/30 rounded-lg hover:bg-red-500/10">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BLOG TAB */}
        {tab === "blog" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display font-bold text-white">Blog Posts</h2>
              <button onClick={() => setEditingBlog({ title: "", excerpt: "", content: "", author: "Degen Central", tags: "", published: false, featured: false, sortOrder: 0 })} className="px-4 py-2 bg-gold-500 text-black font-bold rounded-xl text-sm uppercase tracking-wider">+ Add Post</button>
            </div>
            {editingBlog && <BlogForm post={editingBlog} onChange={setEditingBlog} onSave={saveBlog} onCancel={() => setEditingBlog(null)} saving={saving} />}
            <div className="space-y-3">
              {blogPosts.map((post) => (
                <div key={post.id} className="bg-dark-700/50 border border-gold-800/20 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">📝</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-white font-bold">{post.title}</h3>
                        {post.featured && <span className="text-xs px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded">Featured</span>}
                        {!post.published && <span className="text-xs px-2 py-0.5 bg-gray-500/20 text-gray-400 rounded">Draft</span>}
                        {post.published && <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-400 rounded">Published</span>}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{post.author} • {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : "Not published"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setEditingBlog({ ...post })} className="px-3 py-1.5 text-xs text-gold-400 border border-gold-800/30 rounded-lg hover:bg-gold-500/10">Edit</button>
                    <button onClick={() => deleteBlog(post.id)} className="px-3 py-1.5 text-xs text-red-400 border border-red-800/30 rounded-lg hover:bg-red-500/10">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAQS TAB */}
        {tab === "faqs" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display font-bold text-white">FAQs</h2>
              <button onClick={() => setEditingFaq({ question: "", answer: "", category: "General", sortOrder: 0, published: true })} className="px-4 py-2 bg-gold-500 text-black font-bold rounded-xl text-sm uppercase tracking-wider">+ Add FAQ</button>
            </div>
            {editingFaq && <FaqForm faq={editingFaq} onChange={setEditingFaq} onSave={saveFaq} onCancel={() => setEditingFaq(null)} saving={saving} />}
            <div className="space-y-3">
              {faqList.map((faq) => (
                <div key={faq.id} className="bg-dark-700/50 border border-gold-800/20 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 bg-gold-500/20 text-gold-400 rounded">{faq.category}</span>
                      {!faq.published && <span className="text-xs px-2 py-0.5 bg-gray-500/20 text-gray-400 rounded">Hidden</span>}
                    </div>
                    <h3 className="text-white font-medium mt-1">{faq.question}</h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">{faq.answer}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button onClick={() => setEditingFaq({ ...faq })} className="px-3 py-1.5 text-xs text-gold-400 border border-gold-800/30 rounded-lg hover:bg-gold-500/10">Edit</button>
                    <button onClick={() => deleteFaq(faq.id)} className="px-3 py-1.5 text-xs text-red-400 border border-red-800/30 rounded-lg hover:bg-red-500/10">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {tab === "settings" && (
          <div>
            <h2 className="text-2xl font-display font-bold text-white mb-6">Site Settings</h2>
            <div className="bg-dark-800 border border-gold-800/30 rounded-2xl p-6 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gold-400 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.04.001-.088-.041-.104a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.373-.291a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
                  Discord Integration
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Discord Invite URL</label>
                    <input type="text" value={settings.discord_url || ""} onChange={(e) => setSettings((s) => ({ ...s, discord_url: e.target.value }))} placeholder="https://discord.gg/your-invite" className="w-full px-3 py-2 bg-dark-900 border border-gold-800/30 rounded-lg text-white text-sm focus:outline-none focus:border-gold-500/50" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Show Discord Button</label>
                    <select value={settings.discord_enabled || "true"} onChange={(e) => setSettings((s) => ({ ...s, discord_enabled: e.target.value }))} className="w-full px-3 py-2 bg-dark-900 border border-gold-800/30 rounded-lg text-white text-sm focus:outline-none focus:border-gold-500/50">
                      <option value="true">Yes, show Discord button</option>
                      <option value="false">No, hide Discord button</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-gold-800/20">
                <button onClick={saveSettings} disabled={saving} className="px-6 py-2.5 bg-gold-500 text-black font-bold rounded-xl text-sm uppercase tracking-wider hover:bg-gold-400 disabled:opacity-50">
                  {saving ? "Saving..." : "Save Settings"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ==================== Casino Form ==================== */
function CasinoForm({ casino, onChange, onSave, onCancel, saving }: { casino: Partial<Casino>; onChange: (c: Partial<Casino>) => void; onSave: () => void; onCancel: () => void; saving: boolean }) {
  const bannedStates = getBannedStatesArray(casino.bannedStates || null);
  
  const toggleState = (code: string) => {
    const current = getBannedStatesArray(casino.bannedStates || null);
    const newStates = current.includes(code) 
      ? current.filter(s => s !== code)
      : [...current, code];
    onChange({ ...casino, bannedStates: newStates.join(",") });
  };

  const applyPreset = (preset: keyof typeof COMMON_BANNED_PRESETS) => {
    onChange({ ...casino, bannedStates: COMMON_BANNED_PRESETS[preset].join(",") });
  };

  return (
    <div className="bg-dark-800 border border-gold-800/30 rounded-2xl p-6 mb-8">
      <h3 className="text-lg font-bold text-gold-400 mb-4">{casino.id ? "Edit Casino" : "Add New Casino"}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <FormInput label="Casino Name" value={casino.name || ""} onChange={(v) => onChange({ ...casino, name: v })} />
        <FormInput label="Referral Link" value={casino.referralLink || ""} onChange={(v) => onChange({ ...casino, referralLink: v })} />
        <FormSelect label="Tier" value={casino.tier || "B"} options={["S", "A", "B", "C", "D", "F"]} onChange={(v) => onChange({ ...casino, tier: v as Casino["tier"] })} />
        <FormInput label="Promo Value" value={casino.promoValue || ""} onChange={(v) => onChange({ ...casino, promoValue: v })} placeholder="e.g., $55 SC Free" />
        <FormInput label="Daily Amount" value={casino.dailyAmount || ""} onChange={(v) => onChange({ ...casino, dailyAmount: v })} placeholder="e.g., 1 SC" />
        <FormInput label="Established Year" value={casino.establishedYear || ""} onChange={(v) => onChange({ ...casino, establishedYear: v })} placeholder="e.g., 2023" />
        <FormInput label="Parent Company" value={casino.parentCompany || ""} onChange={(v) => onChange({ ...casino, parentCompany: v })} />
        <FormInput label="Location" value={casino.location || ""} onChange={(v) => onChange({ ...casino, location: v })} />
        <FormInput label="Sort Order" value={String(casino.sortOrder || 0)} onChange={(v) => onChange({ ...casino, sortOrder: parseInt(v) || 0 })} />
      </div>
      <div className="flex flex-wrap gap-4 mt-4">
        <FormCheckbox label="Free SC Daily" checked={casino.freeScDaily ?? false} onChange={(v) => onChange({ ...casino, freeScDaily: v })} />
        <FormCheckbox label="Cash Redeem" checked={casino.cashRedeem ?? true} onChange={(v) => onChange({ ...casino, cashRedeem: v })} />
        <FormCheckbox label="Gift Card" checked={casino.giftCard ?? false} onChange={(v) => onChange({ ...casino, giftCard: v })} />
        <FormCheckbox label="Crypto" checked={casino.crypto ?? false} onChange={(v) => onChange({ ...casino, crypto: v })} />
        <FormCheckbox label="VIP" checked={casino.vip ?? false} onChange={(v) => onChange({ ...casino, vip: v })} />
        <FormCheckbox label="Sportsbook" checked={casino.sportsbook ?? false} onChange={(v) => onChange({ ...casino, sportsbook: v })} />
        <FormCheckbox label="Live Dealer" checked={casino.liveDealer ?? false} onChange={(v) => onChange({ ...casino, liveDealer: v })} />
        <FormCheckbox label="Featured" checked={casino.featured ?? false} onChange={(v) => onChange({ ...casino, featured: v })} />
        <FormCheckbox label="Greylisted" checked={casino.greylisted ?? false} onChange={(v) => onChange({ ...casino, greylisted: v })} />
      </div>
      
      {/* Banned States Section */}
      <div className="mt-6 pt-4 border-t border-gold-800/20">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-gold-400">Banned States ({bannedStates.length} selected)</label>
          <div className="flex gap-2">
            <button type="button" onClick={() => applyPreset("moderate")} className="px-2 py-1 text-xs bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30">Moderate (4)</button>
            <button type="button" onClick={() => applyPreset("standard")} className="px-2 py-1 text-xs bg-orange-500/20 text-orange-400 rounded hover:bg-orange-500/30">Standard (9)</button>
            <button type="button" onClick={() => applyPreset("strict")} className="px-2 py-1 text-xs bg-red-500/20 text-red-400 rounded hover:bg-red-500/30">Strict (15)</button>
            <button type="button" onClick={() => onChange({ ...casino, bannedStates: "" })} className="px-2 py-1 text-xs bg-gray-500/20 text-gray-400 rounded hover:bg-gray-500/30">Clear All</button>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5 p-3 bg-dark-900 rounded-xl max-h-40 overflow-y-auto">
          {US_STATES.map((state) => (
            <button
              key={state.code}
              type="button"
              onClick={() => toggleState(state.code)}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                bannedStates.includes(state.code)
                  ? "bg-red-500/30 text-red-300 border border-red-500/50"
                  : "bg-dark-700 text-gray-400 hover:bg-dark-600"
              }`}
            >
              {state.code}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">Click states to toggle. Red = banned in that state.</p>
      </div>

      <div className="mt-4">
        <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Notes</label>
        <textarea value={casino.notes || ""} onChange={(e) => onChange({ ...casino, notes: e.target.value })} rows={3} className="w-full px-4 py-2.5 bg-dark-900 border border-gold-800/30 rounded-xl text-white text-sm focus:outline-none focus:border-gold-500/50 resize-y" />
      </div>
      <div className="flex gap-3 mt-6">
        <button onClick={onSave} disabled={saving} className="px-6 py-2.5 bg-gold-500 text-black font-bold rounded-xl text-sm uppercase tracking-wider hover:bg-gold-400 disabled:opacity-50">{saving ? "Saving..." : "Save Casino"}</button>
        <button onClick={onCancel} className="px-6 py-2.5 border border-gold-800/30 text-gray-400 rounded-xl text-sm uppercase tracking-wider hover:text-white">Cancel</button>
      </div>
    </div>
  );
}

/* ==================== Strategy Form ==================== */
function StrategyForm({ strategy, onChange, onSave, onCancel, saving }: { strategy: Partial<Strategy>; onChange: (s: Partial<Strategy>) => void; onSave: () => void; onCancel: () => void; saving: boolean }) {
  return (
    <div className="bg-dark-800 border border-gold-800/30 rounded-2xl p-6 mb-8">
      <h3 className="text-lg font-bold text-gold-400 mb-4">{strategy.id ? "Edit Strategy" : "Add New Strategy"}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <FormInput label="Title" value={strategy.title || ""} onChange={(v) => onChange({ ...strategy, title: v })} />
        <FormInput label="Category" value={strategy.category || ""} onChange={(v) => onChange({ ...strategy, category: v })} />
        <FormInput label="Icon (emoji)" value={strategy.icon || ""} onChange={(v) => onChange({ ...strategy, icon: v })} />
        <FormInput label="Sort Order" value={String(strategy.sortOrder || 0)} onChange={(v) => onChange({ ...strategy, sortOrder: parseInt(v) || 0 })} />
      </div>
      <div className="mt-4">
        <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Excerpt</label>
        <textarea value={strategy.excerpt || ""} onChange={(e) => onChange({ ...strategy, excerpt: e.target.value })} rows={2} className="w-full px-4 py-2.5 bg-dark-900 border border-gold-800/30 rounded-xl text-white text-sm focus:outline-none focus:border-gold-500/50 resize-y" />
      </div>
      <div className="mt-4">
        <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Content (Markdown)</label>
        <textarea value={strategy.content || ""} onChange={(e) => onChange({ ...strategy, content: e.target.value })} rows={12} className="w-full px-4 py-2.5 bg-dark-900 border border-gold-800/30 rounded-xl text-white text-sm font-mono focus:outline-none focus:border-gold-500/50 resize-y" />
      </div>
      <div className="mt-4"><FormCheckbox label="Published" checked={strategy.published ?? true} onChange={(v) => onChange({ ...strategy, published: v })} /></div>
      <div className="flex gap-3 mt-6">
        <button onClick={onSave} disabled={saving} className="px-6 py-2.5 bg-gold-500 text-black font-bold rounded-xl text-sm uppercase tracking-wider hover:bg-gold-400 disabled:opacity-50">{saving ? "Saving..." : "Save Strategy"}</button>
        <button onClick={onCancel} className="px-6 py-2.5 border border-gold-800/30 text-gray-400 rounded-xl text-sm uppercase tracking-wider hover:text-white">Cancel</button>
      </div>
    </div>
  );
}

/* ==================== Blog Form ==================== */
function BlogForm({ post, onChange, onSave, onCancel, saving }: { post: Partial<BlogPost>; onChange: (b: Partial<BlogPost>) => void; onSave: () => void; onCancel: () => void; saving: boolean }) {
  return (
    <div className="bg-dark-800 border border-gold-800/30 rounded-2xl p-6 mb-8">
      <h3 className="text-lg font-bold text-gold-400 mb-4">{post.id ? "Edit Blog Post" : "Add New Blog Post"}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <FormInput label="Title" value={post.title || ""} onChange={(v) => onChange({ ...post, title: v })} />
        <FormInput label="Author" value={post.author || ""} onChange={(v) => onChange({ ...post, author: v })} />
        <FormInput label="Tags (comma-separated)" value={post.tags || ""} onChange={(v) => onChange({ ...post, tags: v })} placeholder="news, tips, announcement" />
        <FormInput label="Cover Image URL" value={post.coverImage || ""} onChange={(v) => onChange({ ...post, coverImage: v })} />
        <FormInput label="Sort Order" value={String(post.sortOrder || 0)} onChange={(v) => onChange({ ...post, sortOrder: parseInt(v) || 0 })} />
      </div>
      <div className="mt-4">
        <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Excerpt</label>
        <textarea value={post.excerpt || ""} onChange={(e) => onChange({ ...post, excerpt: e.target.value })} rows={2} className="w-full px-4 py-2.5 bg-dark-900 border border-gold-800/30 rounded-xl text-white text-sm focus:outline-none focus:border-gold-500/50 resize-y" />
      </div>
      <div className="mt-4">
        <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Content (Markdown)</label>
        <textarea value={post.content || ""} onChange={(e) => onChange({ ...post, content: e.target.value })} rows={15} className="w-full px-4 py-2.5 bg-dark-900 border border-gold-800/30 rounded-xl text-white text-sm font-mono focus:outline-none focus:border-gold-500/50 resize-y" />
      </div>
      <div className="flex flex-wrap gap-4 mt-4">
        <FormCheckbox label="Published" checked={post.published ?? false} onChange={(v) => onChange({ ...post, published: v })} />
        <FormCheckbox label="Featured" checked={post.featured ?? false} onChange={(v) => onChange({ ...post, featured: v })} />
      </div>
      <div className="flex gap-3 mt-6">
        <button onClick={onSave} disabled={saving} className="px-6 py-2.5 bg-gold-500 text-black font-bold rounded-xl text-sm uppercase tracking-wider hover:bg-gold-400 disabled:opacity-50">{saving ? "Saving..." : "Save Post"}</button>
        <button onClick={onCancel} className="px-6 py-2.5 border border-gold-800/30 text-gray-400 rounded-xl text-sm uppercase tracking-wider hover:text-white">Cancel</button>
      </div>
    </div>
  );
}

/* ==================== FAQ Form ==================== */
function FaqForm({ faq, onChange, onSave, onCancel, saving }: { faq: Partial<Faq>; onChange: (f: Partial<Faq>) => void; onSave: () => void; onCancel: () => void; saving: boolean }) {
  return (
    <div className="bg-dark-800 border border-gold-800/30 rounded-2xl p-6 mb-8">
      <h3 className="text-lg font-bold text-gold-400 mb-4">{faq.id ? "Edit FAQ" : "Add New FAQ"}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput label="Category" value={faq.category || ""} onChange={(v) => onChange({ ...faq, category: v })} placeholder="Getting Started, Cashouts, etc." />
        <FormInput label="Sort Order" value={String(faq.sortOrder || 0)} onChange={(v) => onChange({ ...faq, sortOrder: parseInt(v) || 0 })} />
      </div>
      <div className="mt-4">
        <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Question</label>
        <input type="text" value={faq.question || ""} onChange={(e) => onChange({ ...faq, question: e.target.value })} className="w-full px-4 py-2.5 bg-dark-900 border border-gold-800/30 rounded-xl text-white text-sm focus:outline-none focus:border-gold-500/50" />
      </div>
      <div className="mt-4">
        <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Answer</label>
        <textarea value={faq.answer || ""} onChange={(e) => onChange({ ...faq, answer: e.target.value })} rows={4} className="w-full px-4 py-2.5 bg-dark-900 border border-gold-800/30 rounded-xl text-white text-sm focus:outline-none focus:border-gold-500/50 resize-y" />
      </div>
      <div className="mt-4"><FormCheckbox label="Published" checked={faq.published ?? true} onChange={(v) => onChange({ ...faq, published: v })} /></div>
      <div className="flex gap-3 mt-6">
        <button onClick={onSave} disabled={saving} className="px-6 py-2.5 bg-gold-500 text-black font-bold rounded-xl text-sm uppercase tracking-wider hover:bg-gold-400 disabled:opacity-50">{saving ? "Saving..." : "Save FAQ"}</button>
        <button onClick={onCancel} className="px-6 py-2.5 border border-gold-800/30 text-gray-400 rounded-xl text-sm uppercase tracking-wider hover:text-white">Cancel</button>
      </div>
    </div>
  );
}

/* ==================== Form Components ==================== */
function FormInput({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">{label}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full px-3 py-2 bg-dark-900 border border-gold-800/30 rounded-lg text-white text-sm focus:outline-none focus:border-gold-500/50" />
    </div>
  );
}

function FormSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-3 py-2 bg-dark-900 border border-gold-800/30 rounded-lg text-white text-sm focus:outline-none focus:border-gold-500/50">
        {options.map((opt) => (<option key={opt} value={opt}>{opt}</option>))}
      </select>
    </div>
  );
}

function FormCheckbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-300 hover:text-white transition-colors">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="rounded accent-gold-500" />
      {label}
    </label>
  );
}
