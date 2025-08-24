// 🔧 FIXED AUTH HELPER (lib/auth.ts)

import { cookies } from "next/headers";
import { NextResponse } from "next/server";


export async function getAccessToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value ?? null;
    return token;
  } catch (error) {
    console.error("Error getting access token:", error);
    return null;
  }
}
export async function requireAuth(): Promise<string | null> {
  const token = await getAccessToken();
  
  if (!token) {
    console.warn("Unauthorized access - no token found");
    return null; // ✅ Return null instead of NextResponse
  }
  
  return token;
}

/**
 * Alternative: Create auth response for routes that need it
 */
export function createAuthErrorResponse(message = "Unauthorized"): NextResponse {
  return new NextResponse(
    JSON.stringify({ message }),
    { 
      status: 401,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}