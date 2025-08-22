import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { API_BASE_URL } from "@/lib/api";

export async function GET(req: NextRequest) {
  try {
    const token = await requireAuth(); // must return valid JWT or throw
    const cookieHeader = Object.entries(req.cookies)
      .map(([key, val]) => `${key}=${val}`)
      .join("; ");

    const backendRes = await fetch(`${API_BASE_URL}/skills/get-all-skills`, {
      method: "GET",
      headers: {
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: 'include'
    });

    if (!backendRes.ok) {
      const text = await backendRes.text();
      return new NextResponse(text, { status: backendRes.status });
    }

    const data = await backendRes.json();
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("Proxy route error:", err);
    return new NextResponse(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
  }
}
