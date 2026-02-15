import { NextRequest, NextResponse } from "next/server";
import { validateApiKey } from "@/lib/moderation/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { sanitizeSearch, safeOffset, safeLimit } from "@/lib/moderation/sanitize";

export async function GET(request: NextRequest) {
  const authError = validateApiKey(request);
  if (authError) return authError;

  const supabase = createAdminClient();
  const { searchParams } = new URL(request.url);

  const search = sanitizeSearch(searchParams.get("search") || "");
  const banned = searchParams.get("banned");
  const limit = safeLimit(searchParams.get("limit"));
  const offset = safeOffset(searchParams.get("offset"));

  let query = supabase
    .from("profiles")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (search) {
    query = query.ilike("full_name", `%${search}%`);
  }

  if (banned === "true") {
    query = query.eq("is_banned", true);
  } else if (banned === "false") {
    query = query.eq("is_banned", false);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error("Moderation users list error:", error.message);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }

  return NextResponse.json({ users: data, total: count });
}
