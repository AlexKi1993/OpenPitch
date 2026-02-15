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

  const { data, error } = await supabase
    .from("stories")
    .select("*, author:profiles(*), story_comments(*, author:profiles(*))")
    .eq("id", id)
    .order("created_at", { referencedTable: "story_comments", ascending: true })
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Story not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}

const VALID_STORY_TYPES = ["success", "fuckup"];

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = validateApiKey(request);
  if (authError) return authError;

  const { id } = await params;
  if (!isValidUUID(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const supabase = createAdminClient();

  const allowedFields = [
    "title", "story_type", "idea_summary", "what_went_well",
    "what_went_wrong", "lessons_learned", "advice",
  ];

  const updates: Record<string, unknown> = {};
  for (const field of allowedFields) {
    if (field in body) {
      if (typeof body[field] !== "string") {
        return NextResponse.json({ error: `${field} must be a string` }, { status: 400 });
      }
      if (body[field].length > 5000) {
        return NextResponse.json({ error: `${field} exceeds max length` }, { status: 400 });
      }
      updates[field] = body[field];
    }
  }

  if (updates.story_type && !VALID_STORY_TYPES.includes(updates.story_type as string)) {
    return NextResponse.json({ error: "Invalid story_type value" }, { status: 400 });
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  updates.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from("stories")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error || !data) {
    console.error("Moderation story update error:", error?.message);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(
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

  const { error } = await supabase.from("stories").delete().eq("id", id);

  if (error) {
    console.error("Moderation story delete error:", error.message);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }

  return NextResponse.json({ message: "Story deleted" });
}
