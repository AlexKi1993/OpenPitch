import Link from "next/link";
import { ArrowUp, MessageCircle } from "lucide-react";
import { timeAgo, getInitials } from "@/lib/utils";
import type { Story } from "@/types/database";
import { STORY_TYPES } from "@/types/database";

interface StoryCardProps {
  story: Story;
}

export default function StoryCard({ story }: StoryCardProps) {
  const typeInfo = STORY_TYPES[story.story_type];

  return (
    <Link
      href={`/stories/${story.id}`}
      className="group block rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
    >
      <div className="flex gap-4">
        {/* Vote count */}
        <div className="flex flex-col items-center gap-1 pt-1">
          <ArrowUp className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
          <span className="text-lg font-bold">{story.vote_count}</span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span
              className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${typeInfo.color}`}
            >
              {typeInfo.label}
            </span>
          </div>

          <h3 className="text-lg font-semibold group-hover:text-primary transition-colors truncate">
            {story.title}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {story.idea_summary}
          </p>

          {/* Meta */}
          <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-medium">
                {getInitials(story.author?.full_name || null)}
              </div>
              <span>{story.author?.full_name || "Anonym"}</span>
            </div>
            <span>{timeAgo(story.created_at)}</span>
            <div className="flex items-center gap-1">
              <MessageCircle className="h-3.5 w-3.5" />
              {story.comment_count}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
