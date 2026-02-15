import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// In-memory rate limiter for moderation API
const modRateLimitMap = new Map<string, { count: number; resetAt: number }>();

setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of modRateLimitMap) {
    if (now > entry.resetAt) modRateLimitMap.delete(key);
  }
}, 60000);

export async function middleware(request: NextRequest) {
  // Rate limit + skip session middleware for moderation API
  if (request.nextUrl.pathname.startsWith("/api/moderation")) {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const key = `mod:${ip}`;
    const now = Date.now();
    const entry = modRateLimitMap.get(key);

    if (!entry || now > entry.resetAt) {
      modRateLimitMap.set(key, { count: 1, resetAt: now + 60000 });
    } else {
      entry.count++;
      if (entry.count > 60) {
        return NextResponse.json(
          { error: "Too many requests" },
          { status: 429 }
        );
      }
    }

    return NextResponse.next();
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
