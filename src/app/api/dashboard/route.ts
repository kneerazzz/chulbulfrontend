import { NextResponse, NextRequest } from "next/server";
import { API_BASE_URL } from "@/lib/api";
// ✅ FIXED DASHBOARD PROXY ROUTE

export async function GET(req: NextRequest) {
    try {
        // Get cookies from incoming request
        const cookieHeader = req.headers.get("cookie") || "";
        console.log("📥 Received cookies:", cookieHeader);
        
        // Check if cookies exist (basic validation)
        if (!cookieHeader || !cookieHeader.includes('accessToken')) {
            console.warn("⚠️ No access token in cookies");
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Make request to backend with cookies
        const backendRes = await fetch(`${API_BASE_URL}/dashboard`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Cookie": cookieHeader, // ✅ Capital C is correct
                // Don't add Authorization header - let cookies handle auth
            },
            // ✅ Remove credentials: 'include' - not needed server-side
        });

        console.log("🔄 Backend response status:", backendRes.status);

        if (!backendRes.ok) {
            const errorText = await backendRes.text();
            console.error("❌ Backend error:", backendRes.status, errorText);
            return new NextResponse(errorText, { status: backendRes.status });
        }

        const data = await backendRes.json();
        
        // ✅ Create response and forward any new cookies
        const response = NextResponse.json(data);
        
        // Forward Set-Cookie headers if backend sends any
        const setCookieHeader = backendRes.headers.get('set-cookie');
        if (setCookieHeader) {
            response.headers.set('Set-Cookie', setCookieHeader);
            console.log("🍪 Forwarded set-cookie:", setCookieHeader);
        }

        return response;

    } catch (error) {
        console.error("💥 Proxy error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}