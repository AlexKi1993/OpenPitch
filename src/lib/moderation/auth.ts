import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";

export function validateApiKey(request: NextRequest): NextResponse | null {
  const authHeader = request.headers.get("authorization");

  if (!authHeader) {
    return NextResponse.json({ error: "Missing Authorization header" }, { status: 401 });
  }

  const token = authHeader.replace(/^Bearer\s+/i, "");
  const expectedKey = process.env.MODERATION_API_KEY;

  if (!expectedKey) {
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  // Timing-safe comparison to prevent timing attacks
  try {
    const tokenBuffer = Buffer.from(token, "utf-8");
    const expectedBuffer = Buffer.from(expectedKey, "utf-8");

    if (tokenBuffer.length !== expectedBuffer.length || !timingSafeEqual(tokenBuffer, expectedBuffer)) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 403 });
    }
  } catch {
    return NextResponse.json({ error: "Invalid API key" }, { status: 403 });
  }

  return null; // Auth OK
}
