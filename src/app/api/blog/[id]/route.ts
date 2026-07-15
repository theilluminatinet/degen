import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { blogPosts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { isAuthenticated } from "@/lib/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const post = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.id, parseInt(id)))
      .limit(1);

    if (post.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(post[0]);
  } catch {
    return NextResponse.json({ error: "Failed to fetch blog post" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    // Get existing post to check if publish status changed
    const existing = await db.select().from(blogPosts).where(eq(blogPosts.id, parseInt(id))).limit(1);
    
    const updateData: Record<string, unknown> = { ...body, updatedAt: new Date() };
    
    // If newly published, set publishedAt
    if (body.published && existing[0] && !existing[0].published) {
      updateData.publishedAt = new Date();
    }

    const result = await db
      .update(blogPosts)
      .set(updateData)
      .where(eq(blogPosts.id, parseInt(id)))
      .returning();

    if (result.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch {
    return NextResponse.json({ error: "Failed to update blog post" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const result = await db
      .delete(blogPosts)
      .where(eq(blogPosts.id, parseInt(id)))
      .returning();

    if (result.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete blog post" }, { status: 500 });
  }
}
