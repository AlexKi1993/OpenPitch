import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Simple in-memory rate limiter (per-instance, resets on cold start)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(
  key: string,
  maxRequests: number,
  windowMs: number
): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  entry.count++;
  return entry.count > maxRequests;
}

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap) {
    if (now > entry.resetAt) rateLimitMap.delete(key);
  }
}, 60000);

export async function updateSession(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  const pathname = request.nextUrl.pathname;

  // Rate limit auth endpoints: 10 requests per minute per IP
  const authRatePaths = ["/login", "/register", "/forgot-password"];
  const isAuthPath = authRatePaths.some((p) => pathname.startsWith(p));

  if (isAuthPath && isRateLimited(`auth:${ip}`, 10, 60000)) {
    return new NextResponse("Zu viele Anfragen. Bitte warte kurz.", {
      status: 429,
    });
  }

  // Rate limit API-heavy pages: 30 requests per minute per IP
  if (
    (pathname.startsWith("/ideas/new") || pathname.startsWith("/stories/new")) &&
    isRateLimited(`write:${ip}`, 30, 60000)
  ) {
    return new NextResponse("Zu viele Anfragen. Bitte warte kurz.", {
      status: 429,
    });
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protected routes - redirect to login if not authenticated
  const protectedPaths = ["/dashboard", "/ideas/new", "/stories/new", "/lessons/new", "/profile"];
  const isProtected = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // Ban check: block banned users from write paths
  if (user) {
    const writePaths = ["/ideas/new", "/stories/new", "/lessons/new"];
    const isWritePath = writePaths.some((path) =>
      request.nextUrl.pathname.startsWith(path)
    );

    if (isWritePath) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("is_banned")
        .eq("id", user.id)
        .single();

      if (profile?.is_banned) {
        const url = request.nextUrl.clone();
        url.pathname = "/dashboard";
        url.searchParams.set("banned", "true");
        return NextResponse.redirect(url);
      }
    }
  }

  // Redirect logged-in users away from auth pages
  const authPaths = ["/login", "/register"];
  const isAuthPage = authPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isAuthPage && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
