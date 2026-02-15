import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { timeAgo, getInitials } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import InboxReplyForm from "@/components/InboxReplyForm";
import CollaboratorActions from "@/components/CollaboratorActions";

export default async function InboxConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Fetch collaborator with idea and applicant profile
  const { data: collab } = await supabase
    .from("collaborators")
    .select(
      "*, user:profiles!collaborators_user_id_fkey(id, full_name, avatar_url), idea:ideas!inner(id, title, slug, author_id, author:profiles!ideas_author_id_fkey(id, full_name, avatar_url))"
    )
    .eq("id", id)
    .single();

  if (!collab) notFound();

  const idea = collab.idea as any;
  const applicant = collab.user as any;
  const ideaAuthor = idea?.author;

  // Auth check: only the applicant or the idea author can access
  const isApplicant = collab.user_id === user.id;
  const isAuthor = idea?.author_id === user.id;
  if (!isApplicant && !isAuthor) notFound();

  // Determine the "other" person
  const otherName = isAuthor
    ? applicant?.full_name || "Unbekannt"
    : ideaAuthor?.full_name || "Unbekannt";
  const otherUserId = isAuthor ? collab.user_id : idea?.author_id;

  // Fetch all messages for this collaboration
  const { data: messages } = await supabase
    .from("messages")
    .select("*, sender:profiles!messages_sender_id_fkey(id, full_name, avatar_url)")
    .eq("collaborator_id", id)
    .order("created_at", { ascending: true });

  // Mark unread messages from the other person as read
  await supabase
    .from("messages")
    .update({ is_read: true })
    .eq("collaborator_id", id)
    .neq("sender_id", user.id)
    .eq("is_read", false);

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
      {/* Header */}
      <div className="flex items-start gap-3 mb-6">
        <Link
          href="/inbox"
          className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border hover:bg-muted transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href={`/profile/${otherUserId}`}
              className="font-semibold text-lg hover:text-primary transition-colors"
            >
              {otherName}
            </Link>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColor[collab.status]}`}
            >
              {statusLabel[collab.status]}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            <Link
              href={`/ideas/${idea?.id}`}
              className="hover:text-primary transition-colors"
            >
              {idea?.title}
            </Link>
            <span>&middot;</span>
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
              {collab.role}
            </span>
          </div>
        </div>
      </div>

      {/* Actions for idea author */}
      {isAuthor && (
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-border bg-muted/50 p-3">
          <span className="text-sm text-muted-foreground">Bewerbung:</span>
          <CollaboratorActions
            collaboratorId={collab.id}
            currentStatus={collab.status}
          />
        </div>
      )}

      {/* Messages Thread */}
      <div className="space-y-4 mb-6">
        {/* Initial application message */}
        {collab.message && (
          <div className={`flex ${isApplicant ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                isApplicant
                  ? "bg-primary text-white"
                  : "border border-border bg-card"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium opacity-80">
                  {applicant?.full_name || "Bewerber"} &middot; Bewerbung
                </span>
              </div>
              <p className="text-sm whitespace-pre-wrap">{collab.message}</p>
              <span className="block text-xs opacity-60 mt-1">
                {timeAgo(collab.created_at)}
              </span>
            </div>
          </div>
        )}

        {/* Thread messages */}
        {messages?.map((msg) => {
          const isMine = msg.sender_id === user.id;
          const sender = msg.sender as any;
          return (
            <div
              key={msg.id}
              className={`flex ${isMine ? "justify-end" : "justify-start"}`}
            >
              <div className="flex items-end gap-2 max-w-[80%]">
                {!isMine && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-medium">
                    {getInitials(sender?.full_name)}
                  </div>
                )}
                <div
                  className={`rounded-lg p-3 ${
                    isMine
                      ? "bg-primary text-white"
                      : "border border-border bg-card"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  <span className="block text-xs opacity-60 mt-1">
                    {timeAgo(msg.created_at)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {(!messages || messages.length === 0) && !collab.message && (
          <p className="text-center text-sm text-muted-foreground py-8">
            Noch keine Nachrichten. Schreib die erste!
          </p>
        )}
      </div>

      {/* Reply Form */}
      <div className="sticky bottom-0 bg-background pt-4 pb-2 border-t border-border">
        <InboxReplyForm collaboratorId={collab.id} userId={user.id} />
      </div>
    </div>
  );
}
