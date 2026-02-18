"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send, Pencil, Trash2, Check, X } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { timeAgo, getInitials } from "@/lib/utils";
import type { Comment } from "@/types/database";

interface CommentSectionProps {
  ideaId: string;
  comments: Comment[];
  userId?: string;
}

export default function CommentSection({
  ideaId,
  comments,
  userId,
}: CommentSectionProps) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  async function handleEdit(commentId: string) {
    if (!editContent.trim()) return;
    setLoading(true);
    const { error } = await supabase
      .from("comments")
      .update({ content: editContent.trim().slice(0, 5000) })
      .eq("id", commentId);
    if (!error) {
      setEditingId(null);
      setEditContent("");
      router.refresh();
    }
    setLoading(false);
  }

  async function handleDelete(commentId: string) {
    setLoading(true);
    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId);
    if (!error) {
      setDeletingId(null);
      router.refresh();
    }
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim() || !userId) return;
    if (content.trim().length > 5000) return;

    setLoading(true);
    const { error } = await supabase.from("comments").insert({
      idea_id: ideaId,
      author_id: userId,
      content: content.trim().slice(0, 5000),
    });

    if (!error) {
      setContent("");
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        Kommentare ({comments.length})
      </h2>

      {/* Comment Form */}
      {userId ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex gap-3">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Schreibe einen Kommentar..."
              rows={3}
              maxLength={5000}
              className="flex-1 rounded-lg border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            />
          </div>
          <div className="mt-2 flex justify-end">
            <button
              type="submit"
              disabled={loading || !content.trim()}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              Kommentieren
            </button>
          </div>
        </form>
      ) : (
        <p className="mb-6 text-sm text-muted-foreground">
          <a href="/login" className="text-primary hover:underline">
            Melde dich an
          </a>{" "}
          um zu kommentieren.
        </p>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">
            Noch keine Kommentare. Sei der Erste!
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="rounded-lg border border-border p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <Link
                  href={`/profile/${comment.author_id}`}
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-medium">
                    {getInitials(comment.author?.full_name || null)}
                  </div>
                  <span className="text-sm font-medium">
                    {comment.author?.full_name || "Anonym"}
                  </span>
                </Link>
                <span className="text-xs text-muted-foreground">
                  {timeAgo(comment.created_at)}
                </span>
                {userId === comment.author_id && editingId !== comment.id && deletingId !== comment.id && (
                  <div className="ml-auto flex gap-1">
                    <button
                      type="button"
                      onClick={() => { setEditingId(comment.id); setEditContent(comment.content); }}
                      className="p-1 text-muted-foreground hover:text-primary transition-colors"
                      title="Bearbeiten"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingId(comment.id)}
                      className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                      title="Löschen"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
              {deletingId === comment.id ? (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-destructive">Kommentar löschen?</span>
                  <button
                    type="button"
                    onClick={() => handleDelete(comment.id)}
                    disabled={loading}
                    className="flex items-center gap-1 rounded px-2 py-1 text-xs font-medium bg-destructive text-white hover:bg-destructive/90 transition-colors disabled:opacity-50"
                  >
                    <Check className="h-3 w-3" />
                    Ja
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeletingId(null)}
                    className="flex items-center gap-1 rounded px-2 py-1 text-xs font-medium border border-border hover:bg-muted transition-colors"
                  >
                    <X className="h-3 w-3" />
                    Abbrechen
                  </button>
                </div>
              ) : editingId === comment.id ? (
                <div>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={3}
                    maxLength={5000}
                    className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                  />
                  <div className="mt-2 flex gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="flex items-center gap-1 rounded px-3 py-1.5 text-xs font-medium border border-border hover:bg-muted transition-colors"
                    >
                      <X className="h-3 w-3" />
                      Abbrechen
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEdit(comment.id)}
                      disabled={loading || !editContent.trim()}
                      className="flex items-center gap-1 rounded px-3 py-1.5 text-xs font-medium bg-primary text-white hover:bg-primary-dark transition-colors disabled:opacity-50"
                    >
                      <Check className="h-3 w-3" />
                      Speichern
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
