import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { API_BASE_URL } from "@/lib/api";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  try {
    const authResult = await requireAuth();
    
    // Handle the case where requireAuth returns NextResponse (401)
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    
    const token = authResult;
    
    // ✅ PRODUCTION FIX: Use both methods for compatibility
    let cookieHeader = '';
    
    try {
      // Method 1: Next.js cookies() function (recommended for production)
      const cookieStore = await cookies();
      cookieHeader = cookieStore.toString();
    } catch (cookieError) {
      // Method 2: Fallback to request cookies (for older versions)
      cookieHeader = req.cookies.toString();
    }
    
    // ✅ Alternative: Manual cookie extraction that works in both dev and prod
    if (!cookieHeader) {
      const cookieStore = await cookies();
      const allCookies = cookieStore.getAll();
      cookieHeader = allCookies
        .map(cookie => `${cookie.name}=${cookie.value}`)
        .join('; ');
    }
    
    // Debug logs
    console.log("🍪 Cookie header:", cookieHeader);
    console.log("🔑 Token:", token ? "Present" : "Missing");
    
    const backendRes = await fetch(`${API_BASE_URL}/skills/get-all-skills`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // ✅ FIXED: Proper header name capitalization
        ...(cookieHeader ? { "Cookie": cookieHeader } : {}),
        ...(token ? { "Authorization": `Bearer ${token}` } : {}),
      },
      credentials: 'include'
    });

    if (!backendRes.ok) {
      const errorText = await backendRes.text();
      console.error("Backend error:", backendRes.status, errorText);
      return new NextResponse(errorText, { status: backendRes.status });
    }

    const data = await backendRes.json();
    return NextResponse.json(data);
    
  } catch (error: any) {
    console.error("Error in skills API:", error);
    return NextResponse.json(
      { message: "Internal server error" }, 
      { status: 500 }
    );
  }
}
