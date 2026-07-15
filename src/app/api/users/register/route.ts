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
    const { email, username, password, displayName, state } = await request.json();

    if (!email || !username || !password) {
      return NextResponse.json({ error: "Email, username, and password are required" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    if (username.length < 3 || username.length > 20) {
      return NextResponse.json({ error: "Username must be 3-20 characters" }, { status: 400 });
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return NextResponse.json({ error: "Username can only contain letters, numbers, and underscores" }, { status: 400 });
    }

    // Check if user exists
    const existing = await db
      .select()
      .from(users)
      .where(or(eq(users.email, email.toLowerCase()), eq(users.username, username.toLowerCase())))
      .limit(1);

    if (existing.length > 0) {
      if (existing[0].email === email.toLowerCase()) {
        return NextResponse.json({ error: "Email already registered" }, { status: 400 });
      }
      return NextResponse.json({ error: "Username already taken" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await db
      .insert(users)
      .values({
        email: email.toLowerCase(),
        username: username.toLowerCase(),
        passwordHash,
        displayName: displayName || username,
        state: state || null,
        emailVerified: false,
        isActive: true,
        role: "user",
      })
      .returning();

    // Create session
    const token = generateToken();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    await db.insert(userSessions).values({
      userId: newUser[0].id,
      token,
      expiresAt,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: newUser[0].id,
        email: newUser[0].email,
        username: newUser[0].username,
        displayName: newUser[0].displayName,
        state: newUser[0].state,
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
    const message = e instanceof Error ? e.message : "Registration failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
