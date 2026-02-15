import { NextRequest, NextResponse } from "next/server";
import { validateApiKey } from "@/lib/moderation/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { isValidUUID } from "@/lib/moderation/sanitize";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = validateApiKey(request);
  if (authError) return authError;

  const { id } = await params;
  if (!isValidUUID(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const body = await request.json().catch(() => ({}));
  const reason = typeof body.reason === "string" ? body.reason.slice(0, 1000) : null;

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("profiles")
    .update({ is_banned: true, ban_reason: reason })
    .eq("id", id)
    .select()
    .single();

  if (error || !data) {
    console.error("Moderation ban error:", error?.message);
    return NextResponse.json({ error: "Ban failed" }, { status: 500 });
  }

  return NextResponse.json({ message: "User banned", user: data });
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

  const { data, error } = await supabase
    .from("profiles")
    .update({ is_banned: false, ban_reason: null })
    .eq("id", id)
    .select()
    .single();

  if (error || !data) {
    console.error("Moderation unban error:", error?.message);
    return NextResponse.json({ error: "Unban failed" }, { status: 500 });
  }

  return NextResponse.json({ message: "User unbanned", user: data });
}
