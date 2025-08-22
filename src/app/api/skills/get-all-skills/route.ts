import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { API_BASE_URL } from "@/lib/api";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  try {
    // Get token from server-side cookies
    const token = await requireAuth();
    if (!token) {
      return new NextResponse(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }

    // Get all cookies from server-side
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.getAll()
      .map(c => `${c.name}=${c.value}`)
      .join("; ");

    console.log("🍪 Forwarding cookies:", cookieHeader);
    console.log("🔑 Token present:", !!token);

    // Forward request to backend
    const backendRes = await fetch(`${API_BASE_URL}/skills/get-all-skills`, {
      method: "GET",
      headers: {
        "Cookie": cookieHeader,
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!backendRes.ok) {
      const errorText = await backendRes.text();
      console.error("Backend error:", backendRes.status, errorText);
      return new NextResponse(errorText, { status: backendRes.status });
    }

    const data = await backendRes.json();
    return NextResponse.json(data);

  } catch (err: any) {
    console.error("Proxy error:", err);
    return new NextResponse(JSON.stringify({ message: "Internal server error" }), { status: 500 });
  }
}
