import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { strategies } from "@/db/schema";
import { asc } from "drizzle-orm";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const allStrategies = await db
      .select()
      .from(strategies)
      .orderBy(asc(strategies.sortOrder), asc(strategies.title));

    return NextResponse.json(allStrategies);
  } catch {
    return NextResponse.json({ error: "Failed to fetch strategies" }, { status: 500 });
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
      .insert(strategies)
      .values({ ...body, slug })
      .returning();

    return NextResponse.json(result[0], { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to create strategy";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
