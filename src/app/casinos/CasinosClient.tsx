"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Casino } from "@/db/schema";
import { US_STATES, getBannedStatesArray, isLegalInState, getStateName } from "@/lib/states";

const tierColors: Record<string, string> = {
  S: "from-yellow-400 to-amber-600 text-black",
  A: "from-emerald-400 to-green-600 text-white",
  B: "from-blue-400 to-blue-600 text-white",
  C: "from-purple-400 to-purple-600 text-white",
  D: "from-orange-400 to-orange-600 text-white",
  F: "from-red-400 to-red-600 text-white",
};

const tierOrder = ["S", "A", "B", "C", "D", "F"];

export default function CasinosClient() {
  const searchParams = useSearchParams();
  const [casinos, setCasinos] = useState<Casino[]>([]);
  const [loading, setLoading] = useState(true);
  const [tierFilter, setTierFilter] = useState("all");
  const [stateFilter, setStateFilter] = useState(searchParams.get("state") || "");
  const [search, setSearch] = useState("");
  const [showGreylisted, setShowGreylisted] = useState(false);
  const [showOnlyLegal, setShowOnlyLegal] = useState(true);
  const [userState, setUserState] = useState("");

  useEffect(() => {
    // Try to get user's state from profile
    fetch("/api/users/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.authenticated && data.user?.state) {
          setUserState(data.user.state);
          setStateFilter(data.user.state);
        }
      })
      .catch(() => {});

    fetch("/api/casinos")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setCasinos(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = casinos.filter((c) => {
    if (c.greylisted && !showGreylisted) return false;
    if (tierFilter !== "all" && c.tier !== tierFilter) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (stateFilter && showOnlyLegal && !isLegalInState(c.bannedStates, stateFilter)) return false;
    return true;
  });

  const grouped = tierOrder
    .map((tier) => ({
      tier,
      casinos: filtered.filter((c) => c.tier === tier),
    }))
    .filter((g) => g.casinos.length > 0);

  const totalLegal = stateFilter
    ? casinos.filter((c) => !c.greylisted && isLegalInState(c.bannedStates, stateFilter)).length
    : casinos.filter((c) => !c.greylisted).length;

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
        <div className="text-gold-400 text-lg animate-pulse">Loading casinos...</div>
      </div>
    );
  }

  return (
    <section className="flex-1 bg-dark-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filters */}
        <div className="bg-dark-700/50 border border-gold-800/20 rounded-2xl p-4 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search casinos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-dark-800 border border-gold-800/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-gold-500/50 transition-colors text-sm"
              />
            </div>

            {/* State filter */}
            <div className="lg:w-56">
              <select
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
                className="w-full px-4 py-2.5 bg-dark-800 border border-gold-800/30 rounded-xl text-white focus:outline-none focus:border-gold-500/50 text-sm"
              >
                <option value="">All States</option>
                {US_STATES.map((state) => (
                  <option key={state.code} value={state.code}>
                    {state.name} ({state.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Second row */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mt-4">
            {/* Tier filter */}
            <div className="flex flex-wrap gap-2">
              <FilterBtn active={tierFilter === "all"} onClick={() => setTierFilter("all")}>All Tiers</FilterBtn>
              {tierOrder.map((t) => (
                <FilterBtn key={t} active={tierFilter === t} onClick={() => setTierFilter(t)}>
                  {t}-Tier
                </FilterBtn>
              ))}
            </div>

            {/* Checkboxes */}
            <div className="flex flex-wrap gap-4">
              {stateFilter && (
                <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showOnlyLegal}
                    onChange={(e) => setShowOnlyLegal(e.target.checked)}
                    className="rounded accent-gold-500"
                  />
                  Only legal in {stateFilter}
                </label>
              )}
              <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showGreylisted}
                  onChange={(e) => setShowGreylisted(e.target.checked)}
                  className="rounded accent-gold-500"
                />
                Show greylisted
              </label>
            </div>
          </div>
        </div>

        {/* Results info */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-400">
            Showing <span className="text-gold-400 font-semibold">{filtered.length}</span> of {totalLegal} casinos
            {stateFilter && (
              <span className="text-emerald-400"> legal in {getStateName(stateFilter)}</span>
            )}
          </p>
          {userState && stateFilter !== userState && (
            <button
              onClick={() => setStateFilter(userState)}
              className="text-xs text-gold-400 hover:text-gold-300 underline"
            >
              Use my state ({userState})
            </button>
          )}
        </div>

        {/* Casino list grouped by tier */}
        {grouped.map(({ tier, casinos: tierCasinos }) => (
          <div key={tier} className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <span className={`px-3 py-1.5 text-sm font-bold rounded-lg bg-gradient-to-r ${tierColors[tier]} shadow-sm`}>
                {tier}-Tier
              </span>
              <div className="flex-1 h-px bg-gold-800/20" />
              <span className="text-xs text-gray-500">{tierCasinos.length} casinos</span>
            </div>

            <div className="grid gap-4">
              {tierCasinos.map((casino) => (
                <CasinoCard key={casino.id} casino={casino} selectedState={stateFilter} />
              ))}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <span className="text-5xl mb-4 block">🔍</span>
            <p className="text-gray-400 text-lg">No casinos found matching your criteria.</p>
            {stateFilter && showOnlyLegal && (
              <button
                onClick={() => setShowOnlyLegal(false)}
                className="mt-4 text-gold-400 hover:text-gold-300 text-sm underline"
              >
                Show all casinos (including restricted)
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function CasinoCard({ casino, selectedState }: { casino: Casino; selectedState: string }) {
  const [expanded, setExpanded] = useState(false);
  const bannedStates = getBannedStatesArray(casino.bannedStates);
  const isLegal = !selectedState || isLegalInState(casino.bannedStates, selectedState);

  return (
    <div
      className={`bg-dark-700/50 border rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-gold-500/5 ${
        casino.greylisted
          ? "border-red-800/30 opacity-75"
          : !isLegal
          ? "border-orange-800/30 opacity-80"
          : "border-gold-800/20 hover:border-gold-500/30"
      }`}
    >
      <div className="p-5">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Name & info */}
          <div className="flex items-center gap-4 lg:w-72 shrink-0">
            <div className="w-12 h-12 bg-gradient-to-br from-gold-500/20 to-gold-700/20 rounded-xl flex items-center justify-center text-2xl border border-gold-600/20 shrink-0">
              🎰
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">{casino.name}</h3>
                {!isLegal && selectedState && (
                  <span className="text-xs px-2 py-0.5 bg-orange-500/20 text-orange-400 rounded">
                    Restricted in {selectedState}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500">{casino.parentCompany} • {casino.location}</p>
            </div>
          </div>

          {/* Promo */}
          <div className="lg:w-48 shrink-0">
            {casino.promoValue && (
              <div className="bg-gold-500/10 border border-gold-500/20 rounded-lg px-3 py-1.5 inline-block">
                <span className="text-gold-400 font-bold text-sm">🎁 {casino.promoValue}</span>
              </div>
            )}
          </div>

          {/* Features */}
          <div className="flex flex-wrap gap-1.5 flex-1">
            <MiniTag active={casino.freeScDaily ?? false} label={casino.freeScDaily ? `Daily: ${casino.dailyAmount}` : "No Daily SC"} />
            <MiniTag active={casino.cashRedeem ?? false} label="Cash" />
            <MiniTag active={casino.giftCard ?? false} label="Gift Cards" />
            <MiniTag active={casino.crypto ?? false} label="Crypto" />
            <MiniTag active={casino.vip ?? false} label="VIP" />
            <MiniTag active={casino.sportsbook ?? false} label="Sports" />
            <MiniTag active={casino.liveDealer ?? false} label="Live" />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setExpanded(!expanded)}
              className="px-3 py-2 text-xs text-gold-400 border border-gold-800/30 hover:border-gold-500/50 rounded-lg transition-colors"
            >
              {expanded ? "Less" : "More"}
            </button>
            <a
              href={casino.referralLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-black font-bold rounded-xl text-xs uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-gold-500/30 whitespace-nowrap"
            >
              Claim Bonus →
            </a>
          </div>
        </div>

        {/* Expanded details */}
        {expanded && (
          <div className="mt-4 pt-4 border-t border-gold-800/20">
            <p className="text-sm text-gray-300 leading-relaxed mb-4">{casino.notes || "No additional notes available."}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-500 mb-4">
              <div><span className="text-gray-400">Daily Amount:</span> <span className="text-gold-400">{casino.dailyAmount || "N/A"}</span></div>
              <div><span className="text-gray-400">Parent:</span> <span className="text-gold-400">{casino.parentCompany || "N/A"}</span></div>
              <div><span className="text-gray-400">Location:</span> <span className="text-gold-400">{casino.location || "N/A"}</span></div>
              <div><span className="text-gray-400">Established:</span> <span className="text-gold-400">{casino.establishedYear || "N/A"}</span></div>
            </div>

            {/* Banned states */}
            {bannedStates.length > 0 && (
              <div className="bg-dark-800/50 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-2">
                  <span className="text-orange-400">⚠️ Not available in:</span>
                </p>
                <div className="flex flex-wrap gap-1">
                  {bannedStates.map((state) => (
                    <span
                      key={state}
                      className={`px-2 py-0.5 text-xs rounded ${
                        state === selectedState
                          ? "bg-orange-500/30 text-orange-300 border border-orange-500/50"
                          : "bg-dark-700 text-gray-400"
                      }`}
                    >
                      {state}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {casino.greylisted && (
              <div className="mt-3 bg-red-900/20 border border-red-800/30 rounded-lg px-3 py-2 text-xs text-red-400">
                ⚠️ This casino is currently greylisted. Proceed with caution.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function FilterBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 uppercase tracking-wider ${
        active
          ? "bg-gold-500 text-black"
          : "bg-dark-800 text-gray-400 hover:text-gold-400 border border-gold-800/30"
      }`}
    >
      {children}
    </button>
  );
}

function MiniTag({ active, label }: { active: boolean; label: string }) {
  return (
    <span
      className={`px-2 py-1 rounded text-xs ${
        active
          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
          : "bg-gray-800/50 text-gray-600 border border-gray-700/30"
      }`}
    >
      {label}
    </span>
  );
}
