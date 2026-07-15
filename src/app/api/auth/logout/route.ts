import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { removeToken, ADMIN_TOKEN_NAME } from "@/lib/auth";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_TOKEN_NAME)?.value;
  if (token) {
    removeToken(token);
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_TOKEN_NAME, "", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}
