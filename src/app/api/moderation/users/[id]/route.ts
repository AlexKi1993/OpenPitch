import { NextRequest, NextResponse } from "next/server";
import { validateApiKey } from "@/lib/moderation/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { isValidUUID } from "@/lib/moderation/sanitize";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = validateApiKey(request);
  if (authError) return authError;

  const { id } = await params;
  if (!isValidUUID(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const supabase = createAdminClient();

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !profile) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const [ideas, stories, lessons, comments, storyComments, lessonComments] =
    await Promise.all([
      supabase.from("ideas").select("id", { count: "exact", head: true }).eq("author_id", id),
      supabase.from("stories").select("id", { count: "exact", head: true }).eq("author_id", id),
      supabase.from("lessons").select("id", { count: "exact", head: true }).eq("author_id", id),
      supabase.from("comments").select("id", { count: "exact", head: true }).eq("author_id", id),
      supabase.from("story_comments").select("id", { count: "exact", head: true }).eq("author_id", id),
      supabase.from("lesson_comments").select("id", { count: "exact", head: true }).eq("author_id", id),
    ]);

  return NextResponse.json({
    ...profile,
    stats: {
      ideas: ideas.count || 0,
      stories: stories.count || 0,
      lessons: lessons.count || 0,
      comments: (comments.count || 0) + (storyComments.count || 0) + (lessonComments.count || 0),
    },
  });
}
