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
  const storyType = searchParams.get("story_type") || "";
  const authorId = searchParams.get("author_id") || "";
  const limit = safeLimit(searchParams.get("limit"));
  const offset = safeOffset(searchParams.get("offset"));

  let query = supabase
    .from("stories")
    .select("*, author:profiles(*)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (search) {
    query = query.or(`title.ilike.%${search}%,idea_summary.ilike.%${search}%`);
  }
  if (storyType) query = query.eq("story_type", storyType);
  if (authorId) query = query.eq("author_id", authorId);

  const { data, error, count } = await query;

  if (error) {
    console.error("Moderation stories list error:", error.message);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }

  return NextResponse.json({ stories: data, total: count });
}
