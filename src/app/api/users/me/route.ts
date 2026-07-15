import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/db";
import { users, userSessions } from "@/db/schema";
import { eq, and, gt } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("degen_user_token")?.value;

  if (!token) return null;

  const sessions = await db
    .select()
    .from(userSessions)
    .where(and(eq(userSessions.token, token), gt(userSessions.expiresAt, new Date())))
    .limit(1);

  if (sessions.length === 0) return null;

  const userResults = await db
    .select()
    .from(users)
    .where(eq(users.id, sessions[0].userId))
    .limit(1);

  return userResults[0] || null;
}

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ authenticated: false });
    }

    return NextResponse.json({
      authenticated: true,
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
        createdAt: user.createdAt,
      },
    });
  } catch {
    return NextResponse.json({ authenticated: false });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const updates: Partial<typeof users.$inferInsert> = {};

    if (body.displayName !== undefined) updates.displayName = body.displayName;
    if (body.state !== undefined) updates.state = body.state || null;
    if (body.avatarUrl !== undefined) updates.avatarUrl = body.avatarUrl || null;
    if (body.bio !== undefined) updates.bio = body.bio || null;
    if (body.favoriteCasinos !== undefined) updates.favoriteCasinos = body.favoriteCasinos || null;

    // Password change
    if (body.newPassword && body.currentPassword) {
      const valid = await bcrypt.compare(body.currentPassword, user.passwordHash);
      if (!valid) {
        return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
      }
      if (body.newPassword.length < 6) {
        return NextResponse.json({ error: "New password must be at least 6 characters" }, { status: 400 });
      }
      updates.passwordHash = await bcrypt.hash(body.newPassword, 10);
    }

    updates.updatedAt = new Date();

    const updated = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, user.id))
      .returning();

    return NextResponse.json({
      success: true,
      user: {
        id: updated[0].id,
        email: updated[0].email,
        username: updated[0].username,
        displayName: updated[0].displayName,
        state: updated[0].state,
        avatarUrl: updated[0].avatarUrl,
        bio: updated[0].bio,
        role: updated[0].role,
        favoriteCasinos: updated[0].favoriteCasinos,
      },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Update failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
