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
  const category = searchParams.get("category") || "";
  const status = searchParams.get("status") || "";
  const authorId = searchParams.get("author_id") || "";
  const limit = safeLimit(searchParams.get("limit"));
  const offset = safeOffset(searchParams.get("offset"));

  let query = supabase
    .from("ideas")
    .select("*, author:profiles(*)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (search) {
    query = query.or(`title.ilike.%${search}%,summary.ilike.%${search}%`);
  }
  if (category) query = query.eq("category", category);
  if (status) query = query.eq("status", status);
  if (authorId) query = query.eq("author_id", authorId);

  const { data, error, count } = await query;

  if (error) {
    console.error("Moderation ideas list error:", error.message);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }

  return NextResponse.json({ ideas: data, total: count });
}
