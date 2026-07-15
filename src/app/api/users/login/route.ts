import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, userSessions } from "@/db/schema";
import { eq, or } from "drizzle-orm";
import bcrypt from "bcryptjs";

function generateToken(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 64; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function POST(request: NextRequest) {
  try {
    const { login, password } = await request.json();

    if (!login || !password) {
      return NextResponse.json({ error: "Login and password are required" }, { status: 400 });
    }

    // Find user by email or username
    const userResults = await db
      .select()
      .from(users)
      .where(or(eq(users.email, login.toLowerCase()), eq(users.username, login.toLowerCase())))
      .limit(1);

    if (userResults.length === 0) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const user = userResults[0];

    if (!user.isActive) {
      return NextResponse.json({ error: "Account is deactivated" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Create session
    const token = generateToken();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await db.insert(userSessions).values({
      userId: user.id,
      token,
      expiresAt,
    });

    // Update last login
    await db.update(users).set({ lastLoginAt: new Date() }).where(eq(users.id, user.id));

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
        state: user.state,
        avatarUrl: user.avatarUrl,
        bio: user.bio,
        role: user.role,
        favoriteCasinos: user.favoriteCasinos,
      },
    });

    response.cookies.set("degen_user_token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
    });

    return response;
  } catch (e) {
    const message = e instanceof Error ? e.message : "Login failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
