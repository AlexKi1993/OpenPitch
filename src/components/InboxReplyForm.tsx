"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Send } from "lucide-react";

interface InboxReplyFormProps {
  collaboratorId: string;
  userId: string;
}

export default function InboxReplyForm({ collaboratorId, userId }: InboxReplyFormProps) {
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed || sending) return;

    setSending(true);
    const { error } = await supabase.from("messages").insert({
      collaborator_id: collaboratorId,
      sender_id: userId,
      content: trimmed,
    });

    if (!error) {
      setContent("");
      router.refresh();
    }
    setSending(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 items-end">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Nachricht schreiben..."
        maxLength={5000}
        rows={2}
        className="flex-1 rounded-lg border border-border bg-background px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
          }
        }}
      />
      <button
        type="submit"
        disabled={!content.trim() || sending}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Send className="h-4 w-4" />
      </button>
    </form>
  );
}
