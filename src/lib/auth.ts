import { cookies } from "next/headers";
import { NextResponse } from "next/server";

/**
 * Get the access token from cookies
 */
export async function getAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value ?? null;
  return token;
}

/**
 * Require authentication for server-side routes
 * Returns the token if valid, or returns a 401 NextResponse if not
 */
export async function requireAuth(): Promise<string | NextResponse> {
  const token = await getAccessToken();
  
  if (!token) {
    console.warn("Unauthorized access - no token found");
    return new NextResponse(
      JSON.stringify({ message: "Unauthorized" }),
      { 
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
  
  return token;
}

/**
 * Alternative: Create a custom error class if you prefer throwing errors
 */
export class AuthError extends Error {
  constructor(message: string, public statusCode: number = 401) {
    super(message);
    this.name = "AuthError";
  }
}

/**
 * Alternative requireAuth that throws a custom error
 */
export async function requireAuthWithError(): Promise<string> {
  const token = await getAccessToken();
  
  if (!token) {
    console.warn("Unauthorized access - no token found");
    throw new AuthError("Unauthorized");
  }
  
  return token;
}
