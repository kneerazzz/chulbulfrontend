import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/api";

export async function GET(req: NextRequest) {
  try {
    // ✅ Extract cookies from incoming request headers
    const cookieHeader = req.headers.get("cookie") || "";

    const backendRes = await fetch(`${API_BASE_URL}/skills/get-all-skills`, {
      method: "GET",
      headers: {
        "Cookie": cookieHeader, // forward cookies to backend
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!backendRes.ok) {
      const errorText = await backendRes.text();
      return new NextResponse(errorText, { status: backendRes.status });
    }

    const data = await backendRes.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return new NextResponse(JSON.stringify({ message: "Internal server error" }), { status: 500 });
  }
}
