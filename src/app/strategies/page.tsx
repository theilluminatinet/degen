import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { db } from "@/db";
import { strategies } from "@/db/schema";
import { asc, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Strategies & Tips — Degen Central",
  description: "Expert strategies and tips for sweepstakes casinos. Learn how to maximize your free SC and win more.",
};

async function getStrategies() {
  try {
    return await db
      .select()
      .from(strategies)
      .where(eq(strategies.published, true))
      .orderBy(asc(strategies.sortOrder));
  } catch {
    return [];
  }
}

const categoryColors: Record<string, string> = {
  "Daily Grinding": "bg-amber-500/10 text-amber-400 border-amber-500/20",
  "Gameplay": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "Advanced": "bg-purple-500/10 text-purple-400 border-purple-500/20",
  "Cashout": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  "Strategy": "bg-rose-500/10 text-rose-400 border-rose-500/20",
  "Fundamentals": "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
};

export default async function StrategiesPage() {
  const strats = await getStrategies();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero */}
      <section className="relative bg-dark-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold-900/20 via-transparent to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <span className="text-gold-500 uppercase tracking-[0.3em] text-xs font-semibold">Knowledge is Power</span>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mt-3">
            Strategies & <span className="text-gold-400">Tips</span>
          </h1>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mt-4" />
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            Master the art of sweepstakes casinos with our expert guides. From daily grinding to advanced VIP strategies.
          </p>
        </div>
      </section>

      <section className="flex-1 bg-dark-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {strats.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {strats.map((strategy) => (
                <Link
                  key={strategy.id}
                  href={`/strategies/${strategy.slug}`}
                  className="group bg-dark-700/50 border border-gold-800/20 rounded-2xl p-6 hover:border-gold-500/40 hover:bg-dark-700/80 transition-all duration-300 hover:shadow-lg hover:shadow-gold-500/5"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-4xl shrink-0">{strategy.icon}</span>
                    <div className="flex-1">
                      <span className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full border mb-2 ${categoryColors[strategy.category] || "bg-gray-500/10 text-gray-400 border-gray-500/20"}`}>
                        {strategy.category}
                      </span>
                      <h3 className="text-xl font-bold text-white group-hover:text-gold-300 transition-colors mb-2">
                        {strategy.title}
                      </h3>
                      <p className="text-sm text-gray-400 leading-relaxed">{strategy.excerpt}</p>
                      <span className="inline-flex items-center gap-1 mt-4 text-gold-400 text-sm font-medium group-hover:gap-2 transition-all">
                        Read Full Guide →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <span className="text-5xl mb-4 block">📚</span>
              <p className="text-gray-400 text-lg">Strategies are coming soon. Check back later!</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
