import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { casinos } from "@/db/schema";
import { eq } from "drizzle-orm";
import { isAuthenticated } from "@/lib/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const casino = await db
      .select()
      .from(casinos)
      .where(eq(casinos.id, parseInt(id)))
      .limit(1);

    if (casino.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(casino[0]);
  } catch {
    return NextResponse.json({ error: "Failed to fetch casino" }, { status: 500 });
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
      .update(casinos)
      .set({ ...body, updatedAt: new Date() })
      .where(eq(casinos.id, parseInt(id)))
      .returning();

    if (result.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch {
    return NextResponse.json({ error: "Failed to update casino" }, { status: 500 });
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
      .delete(casinos)
      .where(eq(casinos.id, parseInt(id)))
      .returning();

    if (result.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete casino" }, { status: 500 });
  }
}
