import { NextRequest, NextResponse } from "next/server";
import { validateApiKey } from "@/lib/moderation/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { isValidUUID } from "@/lib/moderation/sanitize";

export async function POST(request: NextRequest) {
  const authError = validateApiKey(request);
  if (authError) return authError;

  const miraProfileId = process.env.MIRA_PROFILE_ID;
  if (!miraProfileId) {
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { lesson_id, content } = body;

  if (!lesson_id || !content || typeof content !== "string") {
    return NextResponse.json({ error: "lesson_id and content (string) are required" }, { status: 400 });
  }

  if (!isValidUUID(lesson_id)) {
    return NextResponse.json({ error: "Invalid lesson_id" }, { status: 400 });
  }

  if (content.length > 5000) {
    return NextResponse.json({ error: "Content exceeds 5000 characters" }, { status: 400 });
  }

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("lesson_comments")
    .insert({ lesson_id, author_id: miraProfileId, content })
    .select("*, author:profiles(*)")
    .single();

  if (error) {
    console.error("Moderation lesson comment create error:", error.message);
    return NextResponse.json({ error: "Comment creation failed" }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
