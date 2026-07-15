import { cookies } from "next/headers";

const ADMIN_TOKEN_NAME = "degen_admin_token";

// Simple token-based auth. In production, use JWT or session-based auth.
export function generateToken(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 64; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// We store valid tokens in memory (resets on server restart)
const validTokens = new Set<string>();

export function addToken(token: string) {
  validTokens.add(token);
}

export function removeToken(token: string) {
  validTokens.delete(token);
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_TOKEN_NAME)?.value;
  if (!token) return false;
  return validTokens.has(token);
}

export { ADMIN_TOKEN_NAME };
