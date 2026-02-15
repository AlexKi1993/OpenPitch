import { NextRequest, NextResponse } from "next/server";
import { validateApiKey } from "@/lib/moderation/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  const authError = validateApiKey(request);
  if (authError) return authError;

  const miraProfileId = process.env.MIRA_PROFILE_ID;
  if (!miraProfileId) {
    return NextResponse.json({ error: "MIRA_PROFILE_ID not configured" }, { status: 500 });
  }

  const body = await request.json();
  const { story_id, content } = body;

  if (!story_id || !content) {
    return NextResponse.json({ error: "story_id and content are required" }, { status: 400 });
  }

  if (content.length > 5000) {
    return NextResponse.json({ error: "Content exceeds 5000 characters" }, { status: 400 });
  }

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("story_comments")
    .insert({ story_id, author_id: miraProfileId, content })
    .select("*, author:profiles(*)")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
