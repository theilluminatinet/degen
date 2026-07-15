import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { db } from "@/db";
import { strategies } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

async function getStrategy(slug: string) {
  try {
    const results = await db
      .select()
      .from(strategies)
      .where(eq(strategies.slug, slug))
      .limit(1);
    return results[0] || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const strategy = await getStrategy(slug);
  if (!strategy) return { title: "Strategy Not Found — Degen Central" };
  return {
    title: `${strategy.title} — Degen Central`,
    description: strategy.excerpt,
  };
}

function renderMarkdown(content: string) {
  // Simple markdown-to-HTML renderer
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
    } else if (line.startsWith("|")) {
      // Simple table rendering
      if (inList) { html.push("</ul>"); inList = false; }
      const cells = line.split("|").filter(Boolean).map((c) => c.trim());
      if (cells.every((c) => /^-+$/.test(c))) continue; // separator row
      const isHeader = !html.some(h => h.includes("<table"));
      if (isHeader && !html.some(h => h.includes("<table"))) {
        html.push('<div class="overflow-x-auto mt-4 mb-4"><table class="w-full text-sm text-left text-gray-300 border-collapse"><thead><tr>');
        cells.forEach((c) => html.push(`<th class="px-3 py-2 bg-dark-700 text-gold-400 border border-gold-800/20">${c}</th>`));
        html.push("</tr></thead><tbody>");
      } else {
        html.push("<tr>");
        cells.forEach((c) => html.push(`<td class="px-3 py-2 border border-gold-800/20">${c}</td>`));
        html.push("</tr>");
      }
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
    .replace(/\*(.+?)\*/g, '<em>$1</em>');
}

export default async function StrategyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const strategy = await getStrategy(slug);

  if (!strategy) {
    notFound();
  }

  const htmlContent = renderMarkdown(strategy.content);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero */}
      <section className="relative bg-dark-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold-900/20 via-transparent to-transparent" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Link
            href="/strategies"
            className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 text-sm mb-6 transition-colors"
          >
            ← Back to Strategies
          </Link>
          <span className="text-5xl block mb-4">{strategy.icon}</span>
          <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-gold-500/10 text-gold-400 border border-gold-500/20 mb-4">
            {strategy.category}
          </span>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white">
            {strategy.title}
          </h1>
          {strategy.excerpt && (
            <p className="text-lg text-gray-400 mt-4 leading-relaxed">{strategy.excerpt}</p>
          )}
        </div>
      </section>

      {/* Content */}
      <section className="flex-1 bg-dark-900 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-dark-700/50 border border-gold-800/20 rounded-2xl p-8 md:p-12">
            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
          </div>

          {/* CTA */}
          <div className="mt-10 text-center">
            <p className="text-gray-400 mb-4">Ready to put this strategy to work?</p>
            <Link
              href="/casinos"
              className="inline-block px-8 py-3 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-black font-bold rounded-xl shadow-lg shadow-gold-500/25 hover:shadow-gold-500/40 transition-all duration-300 uppercase tracking-wider text-sm"
            >
              Browse Casinos
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
