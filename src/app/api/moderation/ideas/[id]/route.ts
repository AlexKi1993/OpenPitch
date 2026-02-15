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
    .from("ideas")
    .select("*, author:profiles(*), comments(*, author:profiles(*))")
    .eq("id", id)
    .order("created_at", { referencedTable: "comments", ascending: true })
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Idea not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}

const VALID_STATUSES = ["open", "in_progress", "implemented", "archived"];

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
    "title", "summary", "description", "problem", "solution",
    "target_audience", "category", "status",
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

  if (updates.status && !VALID_STATUSES.includes(updates.status as string)) {
    return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  updates.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from("ideas")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error || !data) {
    console.error("Moderation idea update error:", error?.message);
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

  const { error } = await supabase.from("ideas").delete().eq("id", id);

  if (error) {
    console.error("Moderation idea delete error:", error.message);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }

  return NextResponse.json({ message: "Idea deleted" });
}
