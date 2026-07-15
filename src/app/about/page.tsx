import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export const metadata = {
  title: "About — Degen Central",
  description: "Learn about Degen Central, the #1 trusted sweepstakes casino guide.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero */}
      <section className="relative bg-dark-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold-900/20 via-transparent to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <span className="text-gold-500 uppercase tracking-[0.3em] text-xs font-semibold">Our Story</span>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mt-3">
            About <span className="text-gold-400">Degen Central</span>
          </h1>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mt-4" />
        </div>
      </section>

      <section className="flex-1 bg-dark-900 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-dark-700/50 border border-gold-800/20 rounded-2xl p-8 md:p-12 space-y-8">
            {/* Mission */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">👑</span>
                <h2 className="text-2xl font-display font-bold text-gold-400">Our Mission</h2>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Degen Central was created with one goal: to be the <strong className="text-white">most trusted and comprehensive</strong> sweepstakes casino
                resource on the internet. We meticulously review every casino, track their daily bonuses,
                and provide honest assessments so you can make informed decisions.
              </p>
            </div>

            {/* What We Do */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">🎯</span>
                <h2 className="text-2xl font-display font-bold text-gold-400">What We Do</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { icon: "📋", title: "Comprehensive Listings", desc: "Every legitimate sweepstakes casino, categorized and rated by tier." },
                  { icon: "💰", title: "Bonus Tracking", desc: "Daily updated promo values, free SC amounts, and bonus codes." },
                  { icon: "📊", title: "Expert Strategies", desc: "In-depth guides to help you maximize your earnings and play smarter." },
                  { icon: "⚡", title: "Real-Time Updates", desc: "We keep our listings current with the latest changes and new casinos." },
                ].map((item) => (
                  <div key={item.title} className="bg-dark-800/50 border border-gold-800/10 rounded-xl p-4">
                    <span className="text-2xl">{item.icon}</span>
                    <h3 className="text-white font-bold mt-2 mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-400">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tier System */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">🏆</span>
                <h2 className="text-2xl font-display font-bold text-gold-400">Our Tier System</h2>
              </div>
              <p className="text-gray-300 leading-relaxed mb-4">
                We rate casinos using a straightforward tier system based on game quality, bonus generosity,
                cashout speed, trustworthiness, and overall user experience:
              </p>
              <div className="space-y-2">
                {[
                  { tier: "S", color: "from-yellow-400 to-amber-600 text-black", desc: "Exceptional in every way. Our highest recommendation." },
                  { tier: "A", color: "from-emerald-400 to-green-600 text-white", desc: "Excellent casino with minor room for improvement." },
                  { tier: "B", color: "from-blue-400 to-blue-600 text-white", desc: "Good overall experience. Solid choice for most players." },
                  { tier: "C", color: "from-purple-400 to-purple-600 text-white", desc: "Average. Has some notable drawbacks." },
                  { tier: "D", color: "from-orange-400 to-orange-600 text-white", desc: "Below average. Proceed with caution." },
                  { tier: "F", color: "from-red-400 to-red-600 text-white", desc: "Not recommended. Significant issues." },
                ].map((item) => (
                  <div key={item.tier} className="flex items-center gap-4 bg-dark-800/50 rounded-lg p-3">
                    <span className={`px-3 py-1 text-sm font-bold rounded-lg bg-gradient-to-r ${item.color} w-16 text-center shrink-0`}>
                      {item.tier}-Tier
                    </span>
                    <p className="text-sm text-gray-300">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-gold-500/5 border border-gold-500/20 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">⚠️</span>
                <h3 className="text-lg font-bold text-gold-400">Disclaimer</h3>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Degen Central contains referral links to sweepstakes casinos. We may earn a commission when you
                sign up through our links, at no extra cost to you. This helps support the site and keeps our
                content free. We only recommend casinos we genuinely believe are worth your time. All reviews
                and ratings are our honest opinions. Please play responsibly. Sweepstakes casinos operate
                legally in most US states, but verify the legality in your specific jurisdiction.
                18+ only. No purchase necessary.
              </p>
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/casinos"
              className="inline-block px-8 py-3 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-black font-bold rounded-xl shadow-lg shadow-gold-500/25 hover:shadow-gold-500/40 transition-all duration-300 uppercase tracking-wider text-sm"
            >
              Start Exploring Casinos
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
