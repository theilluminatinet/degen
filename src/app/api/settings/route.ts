import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const settings = await db.select().from(siteSettings);
    const settingsMap: Record<string, string> = {};
    settings.forEach((s) => {
      settingsMap[s.key] = s.value || "";
    });
    return NextResponse.json(settingsMap);
  } catch {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    // Upsert each setting
    for (const [key, value] of Object.entries(body)) {
      const existing = await db.select().from(siteSettings).where(eq(siteSettings.key, key)).limit(1);
      
      if (existing.length > 0) {
        await db.update(siteSettings).set({ value: value as string, updatedAt: new Date() }).where(eq(siteSettings.key, key));
      } else {
        await db.insert(siteSettings).values({ key, value: value as string });
      }
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to save settings";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
