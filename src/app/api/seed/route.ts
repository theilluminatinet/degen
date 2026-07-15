import { NextResponse } from "next/server";
import { db } from "@/db";
import { casinos, strategies, adminUsers, blogPosts, faqs, siteSettings } from "@/db/schema";
import bcrypt from "bcryptjs";
import { sql } from "drizzle-orm";
import { ALL_CASINOS } from "@/lib/casinoData";
import { createStateGuidePosts } from "@/lib/stateGuidePosts";

async function getCount(table: typeof casinos | typeof strategies | typeof adminUsers | typeof blogPosts | typeof faqs | typeof siteSettings) {
  const result = await db.select({ count: sql<number>`count(*)` }).from(table);
  return Number(result[0].count);
}

export async function POST() {
  try {
    const [casinoCount, strategyCount, adminCount, blogCount, faqCount] = await Promise.all([
      getCount(casinos),
      getCount(strategies),
      getCount(adminUsers),
      getCount(blogPosts),
      getCount(faqs),
    ]);

    let seededSections = 0;

    // Create default admin user
    if (adminCount === 0) {
      const passwordHash = await bcrypt.hash("admin123", 10);
      await db.insert(adminUsers).values({
        username: "admin",
        passwordHash,
      }).onConflictDoNothing();
      seededSections += 1;
    }

    // Seed all casinos from comprehensive list
    if (casinoCount === 0) {
      for (let i = 0; i < ALL_CASINOS.length; i++) {
        const c = ALL_CASINOS[i];
        const slug = c.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        await db.insert(casinos).values({
          name: c.name,
          slug,
          tier: c.tier as "S" | "A" | "B" | "C" | "D" | "F",
          referralLink: "#",
          promoValue: c.promoValue,
          freeScDaily: c.freeScDaily,
          dailyAmount: c.dailyAmount,
          cashRedeem: c.cashRedeem,
          giftCard: c.giftCard,
          crypto: c.crypto,
          vip: c.vip,
          sportsbook: c.sportsbook,
          liveDealer: c.liveDealer,
          parentCompany: c.parentCompany,
          location: c.location,
          establishedYear: c.establishedYear,
          notes: c.notes,
          featured: c.featured,
          bannedStates: c.bannedStates,
          sortOrder: i + 1,
        });
      }
      seededSections += 1;
    }

    // Seed strategies
    if (strategyCount === 0) {
      const strategyData = [
        {
          title: "Maximize Daily Free SC Collection",
          category: "Daily Grinding",
          icon: "💰",
          excerpt: "Learn how to efficiently collect free Sweeps Coins across all platforms every single day.",
          content: `## Daily SC Collection Strategy\n\nThe foundation of sweepstakes success is **consistency**. Here's your daily playbook:\n\n### Morning Routine (10 minutes)\n1. **Login to every casino** — Most sites give free SC just for logging in\n2. **Claim mail/inbox bonuses** — Check your in-app mailbox for bonus coins\n3. **Spin the daily wheel** — Sites like Stake.us offer daily spins\n4. **Complete social media tasks** — Follow, like, share for bonus SC\n\n### Key Tips\n- Set phone alarms for daily resets (usually midnight EST)\n- Create a spreadsheet to track which sites you've claimed from\n- Prioritize S-tier and A-tier casinos first\n- Some sites have 4-hour claim windows — set multiple alarms\n\n### Expected Daily Income\n- With 10+ casinos: **3-8 SC per day** passively\n- With social media bonuses: **5-15 SC per day**\n- Monthly passive: **$90-$450 worth of SC**`,
          sortOrder: 1,
        },
        {
          title: "Low-Volatility Grinding Strategy",
          category: "Gameplay",
          icon: "🎰",
          excerpt: "Play smarter with low-volatility slots to steadily build your SC balance with minimal risk.",
          content: `## Low-Volatility Grinding\n\nWhen playing with free SC, **preservation is king**. Here's how to grind effectively:\n\n### Choosing the Right Games\n- Look for slots with **96%+ RTP** (Return to Player)\n- Choose **low volatility** games — smaller wins, but more frequent\n- Avoid jackpot slots — they eat your balance fast\n- Table games like Blackjack have the best mathematical odds\n\n### Bet Sizing\n- **Never bet more than 2% of your balance** on a single spin\n- Start with minimum bets to understand the game\n- If you double your balance, consider reducing bets\n\n### When to Stop\n- Set a **win target** (e.g., 2x your starting balance)\n- Set a **loss limit** (e.g., 50% of starting balance)\n- Never chase losses — walk away and come back tomorrow\n\n### Top Low-Vol Slots\n1. Starburst (NetEnt) — 96.1% RTP\n2. Blood Suckers (NetEnt) — 98% RTP\n3. Thunderstruck II (Microgaming) — 96.65% RTP`,
          sortOrder: 2,
        },
        {
          title: "VIP Program Optimization",
          category: "Advanced",
          icon: "👑",
          excerpt: "Unlock the best rewards by strategically climbing VIP tiers across multiple casinos.",
          content: `## VIP Program Mastery\n\nVIP programs are where the **real money** is. Here's how to maximize them:\n\n### Understanding VIP Tiers\n- Most casinos have 5-10 VIP levels\n- Higher tiers = better bonuses, faster cashouts, personal account managers\n- **Focus your play on 2-3 casinos** rather than spreading thin\n\n### Earning VIP Points Faster\n- Play during **double XP events** (usually weekends)\n- Focus on slots over table games (usually earn more points)\n- Make purchases during promotional periods for bonus GC/SC\n- Engage with the casino's social media and community events\n\n### VIP Benefits Worth Targeting\n- **Rakeback/Cashback** — Getting % of losses back\n- **Exclusive tournaments** — Less competition, bigger prizes\n- **Faster redemptions** — Priority processing\n- **Personal bonuses** — Tailored offers based on your play\n\n### Best VIP Programs\n1. **Stake.us** — Excellent rakeback system\n2. **WOW Vegas** — Generous tier rewards\n3. **McLuck** — Surprise bonuses for active players`,
          sortOrder: 3,
        },
        {
          title: "Redemption & Cashout Guide",
          category: "Cashout",
          icon: "🏦",
          excerpt: "Everything you need to know about redeeming your Sweeps Coins for real prizes and cash.",
          content: `## Cashout Mastery\n\nYou've built up your SC — now here's how to **cash out efficiently**:\n\n### Redemption Requirements\n- Most sites require **50-100 SC minimum** to redeem\n- You must **play through** (wager) your SC at least 1x before redeeming\n- Some sites have **daily/weekly redemption limits**\n- KYC verification is required on first redemption\n\n### KYC (Know Your Customer) Tips\n- Have your **government ID** ready\n- **Utility bill or bank statement** for address verification\n- Selfie with your ID may be required\n- Process takes 24-72 hours on average\n\n### Cashout Methods\n1. **Direct bank transfer** — Most common, 3-5 business days\n2. **Gift cards** — Often faster, good for Amazon/Visa\n3. **Crypto** — Fastest option where available (often same-day)\n\n### Pro Tips\n- Start KYC verification **before** you need to cash out\n- Keep records of all purchases for tax purposes\n- In the US, winnings over $600 may be reported to the IRS\n- Choose crypto cashouts for fastest processing where available`,
          sortOrder: 4,
        },
        {
          title: "Multi-Account Strategy (Legitimate)",
          category: "Strategy",
          icon: "📱",
          excerpt: "How to legitimately use multiple platforms to maximize your earning potential.",
          content: `## Multi-Platform Strategy\n\n**Important:** This is about using multiple DIFFERENT casino platforms, NOT multiple accounts on the same site (which is against ToS).\n\n### Why Multi-Platform?\n- Collect free SC from **every site** daily\n- Take advantage of **different promotions** across platforms\n- Diversify your play to find where you run best\n- Access **exclusive games** only available on certain platforms\n\n### Organization is Key\n- Create a **dedicated email** for sweepstakes signups\n- Use a **password manager** to track all accounts\n- Build a **daily checklist** of sites to visit\n- Track your P&L per site in a spreadsheet\n\n### Recommended Portfolio\n**Core (daily play):** Stake.us, WOW Vegas, Sweeptastic\n**Secondary (check daily):** McLuck, Crown Coins, Zula\n**Occasional (weekly check):** Chumba, Pulsz, Funrize\n\n### Time Management\n- Morning round: 10-15 minutes to claim dailies\n- Play sessions: Focus on 1-2 sites per session\n- Weekly review: Check promotions across all sites`,
          sortOrder: 5,
        },
        {
          title: "Bankroll Management Fundamentals",
          category: "Fundamentals",
          icon: "📊",
          excerpt: "The golden rules of managing your Sweeps Coins to ensure long-term profitability.",
          content: `## Bankroll Management 101\n\nThe **#1 mistake** new players make is poor bankroll management. Fix that here:\n\n### The Golden Rules\n1. **Never risk more than 5% of your total SC on one session**\n2. **Never bet more than 2% of session bankroll per spin**\n3. **Set daily, weekly, and monthly limits**\n4. **Track every transaction**\n\n### The 50/30/20 Rule\n- **50%** of your SC → Low-volatility grinding\n- **30%** of your SC → Medium-volatility fun play\n- **20%** of your SC → High-risk/high-reward shots\n\n### When to Cash Out\n- Hit your target? **Cash out immediately**\n- Won big? Take at least **50% off the table**\n- On a heater? Keep playing but **move your profit to a "bank"**\n\n### Red Flags (Stop Playing If...)\n- You're chasing losses\n- You're playing tired or emotional\n- You've exceeded your session limit\n- You're considering purchasing more GC than planned\n\n### Tracking Template\nKeep a simple log:\n| Date | Casino | Starting SC | Ending SC | P&L | Notes |\n| ---- | ------ | ----------- | --------- | --- | ----- |`,
          sortOrder: 6,
        },
      ];

      for (const s of strategyData) {
        const slug = s.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        await db.insert(strategies).values({ ...s, slug, published: true });
      }
      seededSections += 1;
    }

    // Seed blog posts, including one state guide per state
    if (blogCount === 0) {
      const baseBlogData = [
        {
          title: "Welcome to Degen Central: Your Ultimate Sweepstakes Guide",
          excerpt: "Introducing Degen Central — your new home for sweepstakes casino news, strategies, and exclusive bonuses.",
          content: `## Welcome to Degen Central! 👑\n\nWe're thrilled to launch **Degen Central**, the ultimate destination for sweepstakes casino enthusiasts.\n\n### What We Offer\n\n- **Comprehensive Casino Listings** — Every legitimate sweepstakes casino, rated and reviewed\n- **Expert Strategies** — Battle-tested tips to maximize your free SC\n- **Daily Updates** — Fresh promo codes and bonus information\n- **Community** — Join our Discord to connect with fellow degens\n\n### Why Trust Us?\n\nWe've been in the sweepstakes space for years. We know which casinos pay out fast, which have the best VIP programs, and which ones to avoid.\n\n### Get Started\n\nHead over to our [Casino Listings](/casinos) to find your next favorite sweeps casino, or check out our [Strategies](/strategies) to level up your game.\n\nLive life like a KING! 👑`,
          author: "Degen Central",
          tags: "announcement,welcome,sweepstakes",
          featured: true,
          published: true,
        },
        {
          title: "State-by-State Sweepstakes Casino Legality Guide 2026",
          excerpt: "A complete breakdown of which states allow sweepstakes casinos and which have restrictions.",
          content: `## Sweepstakes Casino Legality by State\n\nSweepstakes casinos operate in most US states, but there are some key exceptions.\n\n### Completely Banned States (Red Zone)\n\nThese states have explicitly banned sweepstakes casinos:\n\n- **Washington** — Long-standing ban\n- **Idaho** — Constitutional prohibition\n- **Michigan** — Enforced by MGCB\n- **Nevada** — Recent 2025 legislation\n- **Montana** — SB 555 effective October 2025\n- **Connecticut** — Banned October 2025\n- **New Jersey** — A 5447 effective August 2025\n- **New York** — S 5935A effective December 2025\n- **California** — AB 831 effective January 2026\n- **Indiana** — HB 1052 effective July 2026\n\n### Restricted States (Operator Rules Vary)\n\nIn several other states, operator restrictions vary widely by brand and can change over time.\n\n### Always Check Individual Casino Terms\n\nEach casino has its own list of restricted states. Always verify before signing up!`,
          author: "Degen Central",
          tags: "legal,states,guide",
          featured: false,
          published: true,
        },
      ];

      const stateGuidePosts = createStateGuidePosts();
      const allBlogData = [...baseBlogData, ...stateGuidePosts];

      for (let i = 0; i < allBlogData.length; i++) {
        const post = allBlogData[i];
        const slug = post.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        await db.insert(blogPosts).values({
          title: post.title,
          slug,
          excerpt: post.excerpt,
          content: post.content,
          author: post.author,
          tags: post.tags,
          featured: post.featured,
          published: post.published,
          sortOrder: i + 1,
          publishedAt: new Date(),
        });
      }
      seededSections += 1;
    }

    // Seed FAQs
    if (faqCount === 0) {
      const faqData = [
        { question: "What are sweepstakes casinos?", answer: "Sweepstakes casinos are online gaming platforms that operate legally in most US states using a dual-currency model. You play with Gold Coins (GC) for fun and Sweeps Coins (SC) which can be redeemed for real cash prizes. No purchase is necessary to obtain SC — they're given away for free through various promotions.", category: "Getting Started", sortOrder: 1 },
        { question: "Are sweepstakes casinos legal?", answer: "Yes! Sweepstakes casinos operate legally in most US states because they use a sweepstakes model rather than traditional gambling. However, some states like Washington, Idaho, Michigan, Nevada, and New York have banned them. Always verify legality in your specific jurisdiction.", category: "Getting Started", sortOrder: 2 },
        { question: "Which states have banned sweepstakes casinos?", answer: "As of 2026, sweepstakes casinos are banned in: Washington, Idaho, Michigan, Nevada, Montana, Connecticut, New Jersey, New York, California, and Indiana. Several other states have partial restrictions. Always check the specific casino's terms for their banned states list.", category: "Getting Started", sortOrder: 3 },
        { question: "How do I get free Sweeps Coins?", answer: "There are many ways to get free SC: daily login bonuses, mail-in requests (AMOE), social media giveaways, referring friends, completing challenges, and promotional events. We recommend signing up at multiple casinos and collecting daily bonuses from each one.", category: "Getting Started", sortOrder: 4 },
        { question: "How do I cash out my winnings?", answer: "Most sweepstakes casinos require a minimum of 50-100 SC to redeem. You'll need to complete KYC verification (ID and address proof) on your first redemption. Cashout methods include direct bank transfer (3-5 business days), gift cards, or cryptocurrency where available.", category: "Cashouts", sortOrder: 5 },
        { question: "What is KYC verification?", answer: "KYC (Know Your Customer) is identity verification required before your first cashout. You'll typically need to provide a government-issued ID (driver's license or passport) and proof of address (utility bill or bank statement). The process usually takes 24-72 hours.", category: "Cashouts", sortOrder: 6 },
        { question: "Which casino has the best bonuses?", answer: "Bonus values vary, but currently McLuck offers one of the best welcome packages with 57,000 GC + 27.5 SC free. Stake.us offers $25 Stake Cash free. Fortune Coins has massive 650,000 GC + 1,400 SC. Check our Casino Listings for up-to-date information.", category: "Casinos", sortOrder: 7 },
        { question: "What does 'greylisted' mean?", answer: "Greylisted casinos are sites receiving negative or inconsistent feedback that we no longer actively recommend. This doesn't mean they're scams, but we suggest proceeding with caution and sticking to fully recommended casinos.", category: "Casinos", sortOrder: 8 },
        { question: "How do the tier ratings work?", answer: "We rate casinos from S-tier (exceptional) to F-tier (not recommended) based on game quality, bonus generosity, cashout speed, trustworthiness, and user experience. S and A tier casinos are our top recommendations.", category: "Casinos", sortOrder: 9 },
        { question: "Can I play from multiple states?", answer: "Your account is typically tied to your verified address. While some casinos may allow play while traveling, redemptions and verification are tied to your home state. Never try to circumvent state restrictions — this can result in account closure.", category: "Legal", sortOrder: 10 },
        { question: "Do I have to pay taxes on winnings?", answer: "In the US, gambling winnings are taxable income. Casinos may issue a W-2G form for winnings over $600. You're responsible for reporting all winnings, regardless of whether you receive a tax form. Consult a tax professional for specific advice.", category: "Legal", sortOrder: 11 },
        { question: "How can I join the community?", answer: "Join our Discord server to connect with fellow sweepstakes enthusiasts! Share strategies, get alerts on new promotions, and chat with the Degen Central team. Click the Discord button in the navigation to join.", category: "Community", sortOrder: 12 },
      ];

      for (const f of faqData) {
        await db.insert(faqs).values({ ...f, published: true });
      }
      seededSections += 1;
    }

    // Seed default settings
    await db.insert(siteSettings).values({ key: "discord_url", value: "https://discord.gg/your-invite-link" }).onConflictDoNothing();
    await db.insert(siteSettings).values({ key: "discord_enabled", value: "true" }).onConflictDoNothing();

    if (seededSections === 0) {
      return NextResponse.json({ message: "Already seeded" });
    }

    return NextResponse.json({
      message: `Database seeded successfully`,
      casinos: ALL_CASINOS.length,
      stateGuides: createStateGuidePosts().length,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Seed failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
