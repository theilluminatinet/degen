import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { blogPosts } from "@/db/schema";
import { asc, desc, eq } from "drizzle-orm";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get("all") === "true";

    let query = db.select().from(blogPosts);
    
    if (!all) {
      query = query.where(eq(blogPosts.published, true)) as typeof query;
    }

    const posts = await query.orderBy(desc(blogPosts.featured), desc(blogPosts.publishedAt), asc(blogPosts.sortOrder));
    return NextResponse.json(posts);
  } catch {
    return NextResponse.json({ error: "Failed to fetch blog posts" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const slug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const result = await db
      .insert(blogPosts)
      .values({
        ...body,
        slug,
        publishedAt: body.published ? new Date() : null,
      })
      .returning();

    return NextResponse.json(result[0], { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to create blog post";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
