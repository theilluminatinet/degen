import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { faqs } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get("all") === "true";

    let query = db.select().from(faqs);
    
    if (!all) {
      query = query.where(eq(faqs.published, true)) as typeof query;
    }

    const results = await query.orderBy(asc(faqs.sortOrder), asc(faqs.id));
    return NextResponse.json(results);
  } catch {
    return NextResponse.json({ error: "Failed to fetch FAQs" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const result = await db.insert(faqs).values(body).returning();
    return NextResponse.json(result[0], { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to create FAQ";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
