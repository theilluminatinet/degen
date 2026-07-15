import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { db } from "@/db";
import { faqs } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import FaqAccordion from "./FaqAccordion";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "FAQ — Degen Central",
  description: "Frequently asked questions about sweepstakes casinos, bonuses, cashouts, and more.",
};

async function getFaqs() {
  try {
    return await db
      .select()
      .from(faqs)
      .where(eq(faqs.published, true))
      .orderBy(asc(faqs.sortOrder), asc(faqs.id));
  } catch {
    return [];
  }
}

export default async function FaqPage() {
  const faqList = await getFaqs();

  // Group by category
  const categories = faqList.reduce((acc, faq) => {
    const cat = faq.category || "General";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(faq);
    return acc;
  }, {} as Record<string, typeof faqList>);

  const categoryOrder = ["Getting Started", "Cashouts", "Casinos", "Community", "About Us"];
  const sortedCategories = Object.keys(categories).sort((a, b) => {
    const aIdx = categoryOrder.indexOf(a);
    const bIdx = categoryOrder.indexOf(b);
    if (aIdx === -1 && bIdx === -1) return a.localeCompare(b);
    if (aIdx === -1) return 1;
    if (bIdx === -1) return -1;
    return aIdx - bIdx;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero */}
      <section className="relative bg-dark-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold-900/20 via-transparent to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <span className="text-gold-500 uppercase tracking-[0.3em] text-xs font-semibold">Got Questions?</span>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mt-3">
            Frequently Asked <span className="text-gold-400">Questions</span>
          </h1>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mt-4" />
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            Everything you need to know about sweepstakes casinos, bonuses, cashouts, and more.
          </p>
        </div>
      </section>

      <section className="flex-1 bg-dark-900 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {faqList.length > 0 ? (
            <div className="space-y-10">
              {sortedCategories.map((category) => (
                <div key={category}>
                  <h2 className="text-xl font-display font-bold text-gold-400 mb-4 flex items-center gap-3">
                    <CategoryIcon category={category} />
                    {category}
                  </h2>
                  <div className="bg-dark-700/50 border border-gold-800/20 rounded-2xl overflow-hidden divide-y divide-gold-800/20">
                    {categories[category].map((faq) => (
                      <FaqAccordion key={faq.id} question={faq.question} answer={faq.answer} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <span className="text-5xl mb-4 block">❓</span>
              <p className="text-gray-400 text-lg">No FAQs available yet. Check back soon!</p>
            </div>
          )}

          {/* Still have questions */}
          <div className="mt-16 text-center bg-dark-700/50 border border-gold-800/20 rounded-2xl p-8">
            <span className="text-4xl mb-4 block">💬</span>
            <h3 className="text-xl font-display font-bold text-white mb-2">Still Have Questions?</h3>
            <p className="text-gray-400 mb-6">Join our Discord community and ask away!</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/about"
                className="px-6 py-2.5 border-2 border-gold-600/50 text-gold-400 hover:bg-gold-600/10 hover:border-gold-500 font-bold rounded-xl transition-all duration-300 uppercase tracking-wider text-sm"
              >
                About Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function CategoryIcon({ category }: { category: string }) {
  const icons: Record<string, string> = {
    "Getting Started": "🚀",
    "Cashouts": "💰",
    "Casinos": "🎰",
    "Community": "👥",
    "About Us": "ℹ️",
  };
  return <span>{icons[category] || "📋"}</span>;
}
