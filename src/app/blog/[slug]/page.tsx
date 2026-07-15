import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { db } from "@/db";
import { blogPosts, casinos } from "@/db/schema";
import { eq, asc, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import { getStateCodeFromBlogTags } from "@/lib/stateGuidePosts";
import { getStateName, isLegalInState } from "@/lib/states";

export const dynamic = "force-dynamic";

async function getBlogPost(slug: string) {
  try {
    const results = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.slug, slug))
      .limit(1);
    return results[0] || null;
  } catch {
    return null;
  }
}

async function getLegalCasinosForState(stateCode: string) {
  try {
    const allCasinos = await db
      .select()
      .from(casinos)
      .orderBy(desc(casinos.featured), asc(casinos.sortOrder), asc(casinos.name));

    return allCasinos.filter((casino) => isLegalInState(casino.bannedStates, stateCode));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return { title: "Post Not Found — Degen Central" };
  return {
    title: `${post.title} — Degen Central`,
    description: post.excerpt,
  };
}

function renderMarkdown(content: string) {
  const lines = content.split("\n");
  const html: string[] = [];
  let inList = false;

  for (const line of lines) {
    if (line.startsWith("## ")) {
      if (inList) { html.push("</ul>"); inList = false; }
      html.push(`<h2 class="text-2xl font-display font-bold text-gold-400 mt-8 mb-4">${line.slice(3)}</h2>`);
    } else if (line.startsWith("### ")) {
      if (inList) { html.push("</ul>"); inList = false; }
      html.push(`<h3 class="text-xl font-bold text-white mt-6 mb-3">${line.slice(4)}</h3>`);
    } else if (/^\d+\.\s/.test(line)) {
      if (inList) { html.push("</ul>"); inList = false; }
      const text = line.replace(/^\d+\.\s/, "");
      html.push(`<div class="flex gap-3 mb-2 text-gray-300"><span class="text-gold-500 font-bold shrink-0">${line.match(/^\d+/)![0]}.</span><span>${formatInline(text)}</span></div>`);
    } else if (line.startsWith("- ")) {
      if (!inList) { html.push('<ul class="space-y-2 mb-4">'); inList = true; }
      html.push(`<li class="flex gap-2 text-gray-300"><span class="text-gold-500 mt-1 shrink-0">•</span><span>${formatInline(line.slice(2))}</span></li>`);
    } else if (line.startsWith("---")) {
      if (inList) { html.push("</ul>"); inList = false; }
      html.push(`<hr class="border-gold-800/30 my-8" />`);
    } else if (line.trim() === "") {
      if (inList) { html.push("</ul>"); inList = false; }
    } else {
      if (inList) { html.push("</ul>"); inList = false; }
      html.push(`<p class="text-gray-300 leading-relaxed mb-4">${formatInline(line)}</p>`);
    }
  }

  if (inList) html.push("</ul>");
  return html.join("\n");
}

function formatInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-gold-400 hover:text-gold-300 underline">$1</a>');
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post || !post.published) {
    notFound();
  }

  const htmlContent = renderMarkdown(post.content);
  const stateCode = getStateCodeFromBlogTags(post.tags);
  const legalCasinos = stateCode ? await getLegalCasinosForState(stateCode) : [];
  const stateName = stateCode ? getStateName(stateCode) : null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero */}
      <section className="relative bg-dark-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold-900/20 via-transparent to-transparent" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 text-sm mb-6 transition-colors"
          >
            ← Back to Blog
          </Link>

          {post.tags && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.split(",").map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs rounded-full bg-gold-500/10 text-gold-400 border border-gold-500/20"
                >
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}

          <h1 className="text-3xl md:text-4xl font-display font-bold text-white">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
            <span>By {post.author}</span>
            {post.publishedAt && (
              <>
                <span>•</span>
                <span>
                  {new Date(post.publishedAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </>
            )}
          </div>

          {post.excerpt && (
            <p className="text-lg text-gray-400 mt-4 leading-relaxed">{post.excerpt}</p>
          )}
        </div>
      </section>

      {/* Content */}
      <section className="flex-1 bg-dark-900 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="bg-dark-700/50 border border-gold-800/20 rounded-2xl p-8 md:p-12">
            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
          </div>

          {/* Dynamic state guide casino listings */}
          {stateCode && stateName && (
            <div className="bg-dark-700/50 border border-gold-800/20 rounded-2xl p-8 md:p-10">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-gold-500 font-semibold">Live Casino Availability</p>
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-white mt-2">
                    Casinos currently available in <span className="text-gold-400">{stateName}</span>
                  </h2>
                </div>
                <div className="text-sm text-gray-400">
                  <span className="text-gold-400 font-semibold">{legalCasinos.length}</span> tracked casinos available
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                <StatCard label="Featured" value={String(legalCasinos.filter((casino) => casino.featured).length)} />
                <StatCard label="Daily SC" value={String(legalCasinos.filter((casino) => casino.freeScDaily).length)} />
                <StatCard label="Cash Redeem" value={String(legalCasinos.filter((casino) => casino.cashRedeem).length)} />
                <StatCard label="Crypto" value={String(legalCasinos.filter((casino) => casino.crypto).length)} />
              </div>

              <div className="space-y-3">
                {legalCasinos.slice(0, 24).map((casino) => (
                  <div
                    key={casino.id}
                    className="flex flex-col md:flex-row md:items-center gap-4 justify-between p-4 rounded-xl border border-gold-800/20 bg-dark-800/60"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-gold-500/20 to-gold-700/20 border border-gold-600/20 flex items-center justify-center text-xl shrink-0">
                        🎰
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-white font-bold">{casino.name}</h3>
                          <span className="px-2 py-0.5 rounded bg-gold-500/15 text-gold-400 text-xs font-semibold">
                            {casino.tier}-Tier
                          </span>
                          {casino.featured && (
                            <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 text-xs font-semibold">
                              Featured
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-400 truncate">
                          {casino.promoValue || "Bonus varies"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap md:justify-end">
                      {casino.freeScDaily && <Badge label={`Daily ${casino.dailyAmount || "SC"}`} color="emerald" />}
                      {casino.cashRedeem && <Badge label="Cashout" color="blue" />}
                      {casino.crypto && <Badge label="Crypto" color="purple" />}
                      <a
                        href={casino.referralLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-black font-bold rounded-lg text-xs uppercase tracking-wider transition-all duration-300"
                      >
                        Visit Casino
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Link
                  href={`/casinos?state=${stateCode}`}
                  className="px-6 py-3 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-black font-bold rounded-xl text-sm uppercase tracking-wider text-center transition-all duration-300"
                >
                  View All {stateName} Casinos
                </Link>
                <Link
                  href="/casinos"
                  className="px-6 py-3 border border-gold-700/40 text-gold-400 hover:bg-gold-500/10 rounded-xl text-sm uppercase tracking-wider text-center transition-all duration-300"
                >
                  Browse Full Casino Directory
                </Link>
              </div>
            </div>
          )}

          {/* Share / CTA */}
          <div className="text-center">
            <p className="text-gray-400 mb-4">Ready to start winning?</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/casinos"
                className="px-8 py-3 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-black font-bold rounded-xl shadow-lg shadow-gold-500/25 hover:shadow-gold-500/40 transition-all duration-300 uppercase tracking-wider text-sm"
              >
                Browse Casinos
              </Link>
              <Link
                href="/blog"
                className="px-8 py-3 border-2 border-gold-600/50 text-gold-400 hover:bg-gold-600/10 hover:border-gold-500 font-bold rounded-xl transition-all duration-300 uppercase tracking-wider text-sm"
              >
                More Articles
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-gold-800/20 bg-dark-800/60 p-4 text-center">
      <div className="text-2xl font-display font-bold text-gold-400">{value}</div>
      <div className="text-xs uppercase tracking-wider text-gray-500 mt-1">{label}</div>
    </div>
  );
}

function Badge({ label, color }: { label: string; color: "emerald" | "blue" | "purple" }) {
  const styles = {
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  };

  return <span className={`px-2.5 py-1 text-xs rounded border ${styles[color]}`}>{label}</span>;
}
