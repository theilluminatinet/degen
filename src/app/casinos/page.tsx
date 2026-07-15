import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CasinosClient from "./CasinosClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "All Sweepstakes Casinos — Degen Central",
  description: "Browse our complete list of trusted sweepstakes casinos with free daily SC, exclusive bonuses, and honest reviews.",
};

export default function CasinosPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero */}
      <section className="relative bg-dark-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold-900/20 via-transparent to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <span className="text-gold-500 uppercase tracking-[0.3em] text-xs font-semibold">Complete Directory</span>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mt-3">
            Sweepstakes <span className="text-gold-400">Casinos</span>
          </h1>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mt-4" />
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            The most comprehensive and trusted list of sweepstakes casinos. Filter by tier, features, and more.
          </p>
        </div>
      </section>

      <CasinosClient />

      <Footer />
    </div>
  );
}
