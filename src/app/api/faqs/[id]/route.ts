import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { faqs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { isAuthenticated } from "@/lib/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const faq = await db
      .select()
      .from(faqs)
      .where(eq(faqs.id, parseInt(id)))
      .limit(1);

    if (faq.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(faq[0]);
  } catch {
    return NextResponse.json({ error: "Failed to fetch FAQ" }, { status: 500 });
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

    const result = await db
      .update(faqs)
      .set({ ...body, updatedAt: new Date() })
      .where(eq(faqs.id, parseInt(id)))
      .returning();

    if (result.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch {
    return NextResponse.json({ error: "Failed to update FAQ" }, { status: 500 });
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
      .delete(faqs)
      .where(eq(faqs.id, parseInt(id)))
      .returning();

    if (result.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete FAQ" }, { status: 500 });
  }
}
