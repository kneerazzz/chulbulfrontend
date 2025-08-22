import { cookies } from "next/headers";
import { NextResponse } from "next/server";

/**
 * Get the access token from cookies
 */
export async function getAccessToken(): Promise<string | null> {
  const cookieStore = cookies();
  const token = cookieStore.get("accessToken")?.value ?? null;
  return token;
}

/**
 * Require authentication for server-side routes
 * Throws a NextResponse with 401 if no valid token is found
 */
export async function requireAuth(): Promise<string> {
  const token = await getAccessToken();

  if (!token) {
    console.warn("Unauthorized access - no token found");
    throw new NextResponse(
      JSON.stringify({ message: "Unauthorized" }),
      { status: 401 }
    );
  }

  return token;
}
