"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUp } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface VoteButtonProps {
  ideaId: string;
  slug?: string;
  voteCount: number;
  userVoted: boolean;
  userId?: string;
}

export default function VoteButton({
  ideaId,
  slug,
  voteCount,
  userVoted,
  userId,
}: VoteButtonProps) {
  const [voted, setVoted] = useState(userVoted);
  const [count, setCount] = useState(voteCount);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleVote() {
    if (!userId) {
      router.push("/login?redirect=/ideas/" + (slug || ideaId));
      return;
    }

    setLoading(true);

    if (voted) {
      const { error } = await supabase
        .from("votes")
        .delete()
        .eq("idea_id", ideaId)
        .eq("user_id", userId);

      if (!error) {
        setVoted(false);
        setCount((c) => c - 1);
      }
    } else {
      const { error } = await supabase
        .from("votes")
        .insert({ idea_id: ideaId, user_id: userId });

      if (!error) {
        setVoted(true);
        setCount((c) => c + 1);
      }
    }

    setLoading(false);
  }

  return (
    <button
      onClick={handleVote}
      disabled={loading}
      className={`flex flex-col items-center gap-1 rounded-xl border-2 px-4 py-3 transition-all ${
        voted
          ? "border-primary bg-primary/10 text-primary"
          : "border-border hover:border-primary/50 text-muted-foreground hover:text-primary"
      } ${loading ? "opacity-50" : ""}`}
    >
      <ArrowUp className={`h-6 w-6 ${voted ? "fill-current" : ""}`} />
      <span className="text-xl font-bold">{count}</span>
      <span className="text-xs">Votes</span>
    </button>
  );
}
