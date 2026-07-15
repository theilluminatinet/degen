import { ALL_CASINOS } from "@/lib/casinoData";
import { US_STATES, type StateCode } from "@/lib/states";

const EXCLUDED_FROM_STATE_POSTS = new Set(["DC"]);

function getLegalCasinosForState(stateCode: StateCode) {
  return ALL_CASINOS.filter((casino) => {
    const banned = (casino.bannedStates || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    return !banned.includes(stateCode);
  });
}

function getTopNames(stateCode: StateCode) {
  return getLegalCasinosForState(stateCode)
    .slice(0, 8)
    .map((casino) => casino.name);
}

function buildStateGuideContent(stateName: string, stateCode: StateCode) {
  const legalCasinos = getLegalCasinosForState(stateCode);
  const totalCasinos = ALL_CASINOS.length;
  const featuredCount = legalCasinos.filter((c) => c.featured).length;
  const dailyCount = legalCasinos.filter((c) => c.freeScDaily).length;
  const redeemCount = legalCasinos.filter((c) => c.cashRedeem).length;
  const cryptoCount = legalCasinos.filter((c) => c.crypto).length;
  const topNames = getTopNames(stateCode);

  return `## ${stateName} Social Casinos Overview

Based on Degen Central's current tracked operator list, **${legalCasinos.length} of ${totalCasinos}** sweepstakes / social casinos do **not** currently list **${stateName}** among their restricted states.

That means players in **${stateName}** generally have a solid number of options, but operator rules can change at any time. Always verify the casino's terms and state restrictions before signing up or redeeming prizes.

### Quick Facts for ${stateName}

- **Available casinos tracked:** ${legalCasinos.length}
- **Featured casinos available:** ${featuredCount}
- **Casinos with daily free SC:** ${dailyCount}
- **Casinos with cash redemption:** ${redeemCount}
- **Casinos with crypto support:** ${cryptoCount}

### Best ${stateName} Social Casinos Right Now

${topNames.map((name, index) => `${index + 1}. **${name}**`).join("\n")}

### How We Determine Availability

We track each operator's published restricted-state list and exclude casinos that currently list **${stateCode}** as unavailable. This article is informational only and should not be treated as legal advice.

### What ${stateName} Players Should Look For

- **Daily SC claims** so you can build a bankroll without spending
- **Reasonable redemption minimums** for cashouts
- **Strong VIP programs** if you plan to play regularly
- **Game variety** across slots, table games, and live dealer titles
- **Clear terms** about redemption, KYC, and geographic restrictions

### Final Word

If you live in **${stateName}**, your best move is to compare the casino list below, sort by bonuses and features, and double-check the operator's current state terms before you register.

For broader strategy advice, check our **Strategies** section and keep an eye on the **Blog** for updates as restrictions change.`;
}

export function createStateGuidePosts() {
  return US_STATES.filter((state) => !EXCLUDED_FROM_STATE_POSTS.has(state.code)).map((state) => {
    const legalCasinos = getLegalCasinosForState(state.code);
    const topCasinoNames = getTopNames(state.code).slice(0, 4).join(", ");

    return {
      title: `${state.name} Social Casinos`,
      excerpt: `See which sweepstakes and social casinos currently do not list ${state.name} as a restricted state, including ${topCasinoNames}${topCasinoNames ? ", and more" : ""}.`,
      content: buildStateGuideContent(state.name, state.code),
      author: "Degen Central",
      tags: `state-guide,${state.code},${state.name.toLowerCase().replace(/\s+/g, "-")},social-casinos`,
      featured: false,
      published: true,
      stateCode: state.code,
      legalCasinoCount: legalCasinos.length,
    };
  });
}

export function getStateCodeFromBlogTags(tags: string | null): string | null {
  if (!tags) return null;

  const tagList = tags
    .split(",")
    .map((tag) => tag.trim().toUpperCase())
    .filter(Boolean);

  const stateCodes = new Set<string>(US_STATES.map((state) => state.code));
  return tagList.find((tag) => stateCodes.has(tag)) ?? null;
}
