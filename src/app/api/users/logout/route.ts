import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/db";
import { userSessions } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("degen_user_token")?.value;

    if (token) {
      await db.delete(userSessions).where(eq(userSessions.token, token));
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set("degen_user_token", "", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}
