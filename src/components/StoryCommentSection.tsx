"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { timeAgo, getInitials } from "@/lib/utils";
import type { StoryComment } from "@/types/database";

interface StoryCommentSectionProps {
  storyId: string;
  comments: StoryComment[];
  userId?: string;
}

export default function StoryCommentSection({
  storyId,
  comments,
  userId,
}: StoryCommentSectionProps) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim() || !userId) return;
    if (content.trim().length > 5000) return;

    setLoading(true);
    const { error } = await supabase.from("story_comments").insert({
      story_id: storyId,
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
              </div>
              <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
