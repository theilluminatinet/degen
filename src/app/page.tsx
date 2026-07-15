import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { db } from "@/db";
import { casinos, strategies } from "@/db/schema";
import { eq, asc, desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

async function getFeaturedCasinos() {
  try {
    return await db.select().from(casinos).where(eq(casinos.featured, true)).orderBy(asc(casinos.sortOrder)).limit(6);
  } catch {
    return [];
  }
}

async function getStrategies() {
  try {
    return await db.select().from(strategies).where(eq(strategies.published, true)).orderBy(asc(strategies.sortOrder)).limit(3);
  } catch {
    return [];
  }
}

async function getCasinoCount() {
  try {
    const all = await db.select().from(casinos);
    return all.length;
  } catch {
    return 0;
  }
}

const tierColors: Record<string, string> = {
  S: "from-yellow-400 to-amber-600 text-black",
  A: "from-emerald-400 to-green-600 text-white",
  B: "from-blue-400 to-blue-600 text-white",
  C: "from-purple-400 to-purple-600 text-white",
  D: "from-orange-400 to-orange-600 text-white",
  F: "from-red-400 to-red-600 text-white",
};

export default async function HomePage() {
  const [featured, strats, casinoCount] = await Promise.all([
    getFeaturedCasinos(),
    getStrategies(),
    getCasinoCount(),
  ]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold-900/20 via-transparent to-transparent" />

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 text-6xl opacity-10 animate-float">♠</div>
        <div className="absolute top-40 right-20 text-5xl opacity-10 animate-float" style={{ animationDelay: "1s" }}>♦</div>
        <div className="absolute bottom-20 left-1/4 text-4xl opacity-10 animate-float" style={{ animationDelay: "2s" }}>♣</div>
        <div className="absolute bottom-40 right-1/3 text-5xl opacity-10 animate-float" style={{ animationDelay: "0.5s" }}>♥</div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 text-center">
          <div className="inline-block mb-6 px-4 py-1.5 bg-gold-500/10 border border-gold-500/30 rounded-full">
            <span className="text-gold-400 text-sm font-medium tracking-wide">
              ✨ The #1 Trusted Sweepstakes Casino Guide
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-6 leading-tight">
            <span className="gold-shimmer">Degen Central</span>
          </h1>

          <p className="text-2xl md:text-3xl text-gold-300/80 font-display italic mb-4">
            Live life like a <span className="text-gold-400 font-bold not-italic">KING</span> 👑
          </p>

          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Your definitive guide to {casinoCount > 0 ? `${casinoCount}+` : ""} sweepstakes casinos.
            Free daily SC, exclusive bonuses, expert strategies, and winning tips — all in one royal destination.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/casinos"
              className="px-8 py-4 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-black font-bold rounded-xl shadow-lg shadow-gold-500/25 hover:shadow-gold-500/40 transition-all duration-300 uppercase tracking-wider text-sm"
            >
              View All Casinos
            </Link>
            <Link
              href="/strategies"
              className="px-8 py-4 border-2 border-gold-600/50 text-gold-400 hover:bg-gold-600/10 hover:border-gold-500 font-bold rounded-xl transition-all duration-300 uppercase tracking-wider text-sm"
            >
              Winning Strategies
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-dark-700/50 border-y border-gold-800/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <StatItem value={casinoCount > 0 ? `${casinoCount}+` : "14+"} label="Casinos Listed" />
            <StatItem value="Free" label="Daily SC Available" />
            <StatItem value="100%" label="Trusted Reviews" />
            <StatItem value="24/7" label="Updated Regularly" />
          </div>
        </div>
      </section>

      {/* Featured Casinos */}
      {featured.length > 0 && (
        <section className="py-20 bg-dark-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-gold-500 uppercase tracking-[0.3em] text-xs font-semibold">Handpicked for You</span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white mt-3">
                Featured <span className="text-gold-400">Casinos</span>
              </h2>
              <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mt-4" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((casino) => (
                <div
                  key={casino.id}
                  className="group bg-dark-700/50 border border-gold-800/20 rounded-2xl p-6 hover:border-gold-500/40 hover:bg-dark-700/80 transition-all duration-300 hover:shadow-lg hover:shadow-gold-500/5"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-gold-500/20 to-gold-700/20 rounded-xl flex items-center justify-center text-2xl border border-gold-600/20">
                        🎰
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-gold-300 transition-colors">
                          {casino.name}
                        </h3>
                        <p className="text-xs text-gray-500">{casino.parentCompany}</p>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-lg bg-gradient-to-r ${tierColors[casino.tier]} shadow-sm`}>
                      {casino.tier}-Tier
                    </span>
                  </div>

                  {casino.promoValue && (
                    <div className="bg-gold-500/10 border border-gold-500/20 rounded-lg px-4 py-2.5 mb-4">
                      <span className="text-gold-400 font-bold text-sm">🎁 {casino.promoValue}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                    <FeatureTag active={casino.freeScDaily ?? false} label="Free Daily SC" />
                    <FeatureTag active={casino.cashRedeem ?? false} label="Cash Redeem" />
                    <FeatureTag active={casino.crypto ?? false} label="Crypto" />
                    <FeatureTag active={casino.vip ?? false} label="VIP Program" />
                  </div>

                  {casino.notes && (
                    <p className="text-xs text-gray-400 mb-4 line-clamp-2">{casino.notes}</p>
                  )}

                  <a
                    href={casino.referralLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center py-3 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-black font-bold rounded-xl text-sm uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-gold-500/30"
                  >
                    Claim Bonus →
                  </a>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link
                href="/casinos"
                className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 font-medium transition-colors"
              >
                View All Casinos
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Strategies Section */}
      {strats.length > 0 && (
        <section className="py-20 bg-dark-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-gold-500 uppercase tracking-[0.3em] text-xs font-semibold">Level Up Your Game</span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white mt-3">
                Winning <span className="text-gold-400">Strategies</span>
              </h2>
              <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mt-4" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {strats.map((strategy) => (
                <Link
                  key={strategy.id}
                  href={`/strategies/${strategy.slug}`}
                  className="group bg-dark-700/50 border border-gold-800/20 rounded-2xl p-6 hover:border-gold-500/40 hover:bg-dark-700/80 transition-all duration-300"
                >
                  <span className="text-4xl mb-4 block">{strategy.icon}</span>
                  <span className="text-xs text-gold-500 uppercase tracking-wider font-semibold">{strategy.category}</span>
                  <h3 className="text-lg font-bold text-white mt-2 mb-3 group-hover:text-gold-300 transition-colors">
                    {strategy.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{strategy.excerpt}</p>
                  <span className="inline-flex items-center gap-1 mt-4 text-gold-400 text-sm font-medium group-hover:gap-2 transition-all">
                    Read More →
                  </span>
                </Link>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link
                href="/strategies"
                className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 font-medium transition-colors"
              >
                View All Strategies
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Discord Section */}
      <section className="py-16 bg-[#5865F2] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-8xl">💬</div>
          <div className="absolute bottom-10 right-10 text-8xl">👑</div>
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            Join the Community
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Connect with fellow degens, get exclusive promo alerts, share strategies, and chat with the Degen Central team.
          </p>
          <a
            href="#"
            id="discord-cta"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-gray-100 text-[#5865F2] font-bold rounded-xl shadow-lg transition-all duration-300 uppercase tracking-wider text-sm"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
            Join Our Discord
          </a>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-dark-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-gold-900/15 via-transparent to-transparent" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-6xl mb-6 block">💎</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            Ready to Start <span className="text-gold-400">Winning</span>?
          </h2>
          <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
            Join thousands of players who use Degen Central to find the best sweepstakes casinos
            and maximize their free SC every single day.
          </p>
          <Link
            href="/casinos"
            className="inline-block px-10 py-4 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-black font-bold rounded-xl shadow-lg shadow-gold-500/25 hover:shadow-gold-500/40 transition-all duration-300 uppercase tracking-wider text-sm"
          >
            Browse Casinos Now
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-2xl md:text-3xl font-display font-bold text-gold-400">{value}</div>
      <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">{label}</div>
    </div>
  );
}

function FeatureTag({ active, label }: { active: boolean; label: string }) {
  return (
    <span
      className={`px-2 py-1 rounded-md text-center ${
        active
          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
          : "bg-gray-800/50 text-gray-600 border border-gray-700/30"
      }`}
    >
      {active ? "✓" : "✗"} {label}
    </span>
  );
}
