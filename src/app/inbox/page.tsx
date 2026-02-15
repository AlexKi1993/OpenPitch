import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { timeAgo, getInitials } from "@/lib/utils";
import { Mail, ArrowLeft } from "lucide-react";

export default async function InboxPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Fetch all collaborator entries where user is applicant or idea author
  const { data: asApplicant } = await supabase
    .from("collaborators")
    .select(
      "id, user_id, role, message, status, created_at, idea:ideas!inner(id, title, author_id, author:profiles!ideas_author_id_fkey(id, full_name, avatar_url))"
    )
    .eq("user_id", user.id);

  const { data: asAuthor } = await supabase
    .from("collaborators")
    .select(
      "id, user_id, role, message, status, created_at, user:profiles!collaborators_user_id_fkey(id, full_name, avatar_url), idea:ideas!inner(id, title, author_id)"
    )
    .eq("idea.author_id", user.id);

  // Build a unified conversation list
  type Conversation = {
    collaboratorId: string;
    otherName: string;
    otherAvatar: string | null;
    otherUserId: string;
    ideaTitle: string;
    ideaId: string;
    status: string;
    createdAt: string;
    lastMessage: string | null;
    lastMessageAt: string | null;
    unreadCount: number;
    role: string;
  };

  const conversations: Conversation[] = [];

  // Process conversations where user is the applicant
  for (const c of asApplicant || []) {
    const idea = c.idea as any;
    const author = idea?.author;

    // Get last message
    const { data: lastMsg } = await supabase
      .from("messages")
      .select("content, created_at")
      .eq("collaborator_id", c.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    // Get unread count (messages from the other person that user hasn't read)
    const { count: unread } = await supabase
      .from("messages")
      .select("*", { count: "exact", head: true })
      .eq("collaborator_id", c.id)
      .neq("sender_id", user.id)
      .eq("is_read", false);

    conversations.push({
      collaboratorId: c.id,
      otherName: author?.full_name || "Unbekannt",
      otherAvatar: author?.avatar_url || null,
      otherUserId: idea?.author_id,
      ideaTitle: idea?.title || "Unbekannte Idee",
      ideaId: idea?.id,
      status: c.status,
      createdAt: c.created_at,
      lastMessage: lastMsg?.content || c.message || null,
      lastMessageAt: lastMsg?.created_at || c.created_at,
      unreadCount: unread || 0,
      role: c.role,
    });
  }

  // Process conversations where user is the idea author
  for (const c of asAuthor || []) {
    const applicant = c.user as any;
    const idea = c.idea as any;

    const { data: lastMsg } = await supabase
      .from("messages")
      .select("content, created_at")
      .eq("collaborator_id", c.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    const { count: unread } = await supabase
      .from("messages")
      .select("*", { count: "exact", head: true })
      .eq("collaborator_id", c.id)
      .neq("sender_id", user.id)
      .eq("is_read", false);

    conversations.push({
      collaboratorId: c.id,
      otherName: applicant?.full_name || "Unbekannt",
      otherAvatar: applicant?.avatar_url || null,
      otherUserId: c.user_id,
      ideaTitle: idea?.title || "Unbekannte Idee",
      ideaId: idea?.id,
      status: c.status,
      createdAt: c.created_at,
      lastMessage: lastMsg?.content || c.message || null,
      lastMessageAt: lastMsg?.created_at || c.created_at,
      unreadCount: unread || 0,
      role: c.role,
    });
  }

  // Deduplicate (user could be both if they applied to own idea, unlikely but safe)
  const seen = new Set<string>();
  const uniqueConversations = conversations.filter((c) => {
    if (seen.has(c.collaboratorId)) return false;
    seen.add(c.collaboratorId);
    return true;
  });

  // Sort by latest activity
  uniqueConversations.sort((a, b) => {
    const dateA = a.lastMessageAt || a.createdAt;
    const dateB = b.lastMessageAt || b.createdAt;
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });

  const statusLabel: Record<string, string> = {
    pending: "Ausstehend",
    accepted: "Akzeptiert",
    rejected: "Abgelehnt",
  };

  const statusColor: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    accepted: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/dashboard"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border hover:bg-muted transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Inbox</h1>
          <p className="text-sm text-muted-foreground">
            Deine Konversationen zu Bewerbungen
          </p>
        </div>
      </div>

      {uniqueConversations.length > 0 ? (
        <div className="space-y-2">
          {uniqueConversations.map((conv) => (
            <Link
              key={conv.collaboratorId}
              href={`/inbox/${conv.collaboratorId}`}
              className="flex items-center gap-4 rounded-lg border border-border p-4 hover:border-primary/50 hover:bg-muted/50 transition-colors"
            >
              {/* Avatar */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-medium">
                {getInitials(conv.otherName)}
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm truncate">
                    {conv.otherName}
                  </span>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${statusColor[conv.status]}`}
                  >
                    {statusLabel[conv.status]}
                  </span>
                  {conv.unreadCount > 0 && (
                    <span className="shrink-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-medium text-white">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate mt-0.5">
                  {conv.ideaTitle} &middot; {conv.role}
                </p>
                {conv.lastMessage && (
                  <p className="text-sm text-muted-foreground truncate mt-1">
                    {conv.lastMessage}
                  </p>
                )}
              </div>

              {/* Time */}
              <span className="shrink-0 text-xs text-muted-foreground">
                {timeAgo(conv.lastMessageAt || conv.createdAt)}
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-border p-12 text-center">
          <Mail className="mx-auto h-10 w-10 text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground">
            Noch keine Konversationen vorhanden.
          </p>
          <Link
            href="/ideas"
            className="mt-3 inline-block text-sm text-primary font-medium hover:underline"
          >
            Ideen entdecken
          </Link>
        </div>
      )}
    </div>
  );
}
