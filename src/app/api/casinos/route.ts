import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { casinos } from "@/db/schema";
import { asc, desc } from "drizzle-orm";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const allCasinos = await db
      .select()
      .from(casinos)
      .orderBy(asc(casinos.sortOrder), desc(casinos.featured), asc(casinos.name));

    return NextResponse.json(allCasinos);
  } catch {
    return NextResponse.json({ error: "Failed to fetch casinos" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const slug = body.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const result = await db
      .insert(casinos)
      .values({
        ...body,
        slug,
      })
      .returning();

    return NextResponse.json(result[0], { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to create casino";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
