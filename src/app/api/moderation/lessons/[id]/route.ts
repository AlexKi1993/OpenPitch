import { NextRequest, NextResponse } from "next/server";
import { validateApiKey } from "@/lib/moderation/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { isValidUUID } from "@/lib/moderation/sanitize";

const VALID_CATEGORIES = [
  "Marketing", "Team & Kultur", "Finanzen", "Produkt",
  "Fundraising", "Technik", "Vertrieb", "Sonstiges",
];

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
    .from("lessons")
    .select("*, author:profiles(*), lesson_comments(*, author:profiles(*))")
    .eq("id", id)
    .order("created_at", { referencedTable: "lesson_comments", ascending: true })
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}

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

  const allowedFields = ["title", "category", "situation", "learning", "advice"];

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

  if (updates.category && !VALID_CATEGORIES.includes(updates.category as string)) {
    return NextResponse.json({ error: "Invalid category value" }, { status: 400 });
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  updates.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from("lessons")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error || !data) {
    console.error("Moderation lesson update error:", error?.message);
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

  const { error } = await supabase.from("lessons").delete().eq("id", id);

  if (error) {
    console.error("Moderation lesson delete error:", error.message);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }

  return NextResponse.json({ message: "Lesson deleted" });
}
