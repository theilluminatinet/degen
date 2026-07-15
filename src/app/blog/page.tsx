import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { db } from "@/db";
import { blogPosts } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Blog — Degen Central",
  description: "Latest news, updates, and insights from the sweepstakes casino world.",
};

async function getBlogPosts() {
  try {
    return await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.published, true))
      .orderBy(desc(blogPosts.featured), desc(blogPosts.publishedAt));
  } catch {
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getBlogPosts();

  const featuredPost = posts.find((p) => p.featured);
  const regularPosts = posts.filter((p) => !p.featured);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero */}
      <section className="relative bg-dark-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold-900/20 via-transparent to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <span className="text-gold-500 uppercase tracking-[0.3em] text-xs font-semibold">Latest Updates</span>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mt-3">
            The <span className="text-gold-400">Blog</span>
          </h1>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mt-4" />
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            News, insights, and tips from the sweepstakes casino world. Stay ahead of the game.
          </p>
        </div>
      </section>

      <section className="flex-1 bg-dark-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {posts.length > 0 ? (
            <>
              {/* Featured Post */}
              {featuredPost && (
                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className="block mb-12 group"
                >
                  <div className="bg-gradient-to-r from-gold-900/20 to-dark-700/50 border border-gold-500/30 rounded-2xl p-8 md:p-10 hover:border-gold-400/50 transition-all duration-300">
                    <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-gold-500/20 text-gold-400 border border-gold-500/30 mb-4">
                      ⭐ Featured
                    </span>
                    <h2 className="text-2xl md:text-3xl font-display font-bold text-white group-hover:text-gold-300 transition-colors mb-4">
                      {featuredPost.title}
                    </h2>
                    <p className="text-gray-400 leading-relaxed mb-4 max-w-3xl">
                      {featuredPost.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>By {featuredPost.author}</span>
                      {featuredPost.publishedAt && (
                        <>
                          <span>•</span>
                          <span>{new Date(featuredPost.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                        </>
                      )}
                    </div>
                    <span className="inline-flex items-center gap-1 mt-6 text-gold-400 font-medium group-hover:gap-2 transition-all">
                      Read Article →
                    </span>
                  </div>
                </Link>
              )}

              {/* Regular Posts */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regularPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group bg-dark-700/50 border border-gold-800/20 rounded-2xl p-6 hover:border-gold-500/40 hover:bg-dark-700/80 transition-all duration-300 flex flex-col"
                  >
                    <div className="flex-1">
                      {post.tags && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {post.tags.split(",").slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 text-xs rounded-full bg-dark-600 text-gray-400"
                            >
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                      <h3 className="text-lg font-bold text-white group-hover:text-gold-300 transition-colors mb-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-400 leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gold-800/20 flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {post.publishedAt
                          ? new Date(post.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                          : "Draft"}
                      </span>
                      <span className="text-gold-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
                        Read →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <span className="text-5xl mb-4 block">📝</span>
              <p className="text-gray-400 text-lg">No blog posts yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
