import Link from "next/link";
import { ArrowUp, MessageCircle, Users } from "lucide-react";
import { timeAgo, getInitials } from "@/lib/utils";
import type { Idea } from "@/types/database";
import { STATUS_LABELS, STATUS_COLORS } from "@/types/database";

interface IdeaCardProps {
  idea: Idea;
}

export default function IdeaCard({ idea }: IdeaCardProps) {
  return (
    <Link
      href={`/ideas/${idea.id}`}
      className="group block rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
    >
      <div className="flex gap-4">
        {/* Vote count */}
        <div className="flex flex-col items-center gap-1 pt-1">
          <ArrowUp className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
          <span className="text-lg font-bold">{idea.vote_count}</span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span
              className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[idea.status]}`}
            >
              {STATUS_LABELS[idea.status]}
            </span>
            <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
              {idea.category}
            </span>
          </div>

          <h3 className="text-lg font-semibold group-hover:text-primary transition-colors truncate">
            {idea.title}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {idea.summary}
          </p>

          {/* Tags */}
          {idea.tags && idea.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {idea.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="rounded-md px-2 py-0.5 text-xs font-medium"
                  style={{
                    backgroundColor: tag.color + "20",
                    color: tag.color,
                  }}
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}

          {/* Meta */}
          <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-medium">
                {getInitials(idea.author?.full_name || null)}
              </div>
              <span>{idea.author?.full_name || "Anonym"}</span>
            </div>
            <span>{timeAgo(idea.created_at)}</span>
            <div className="flex items-center gap-1">
              <MessageCircle className="h-3.5 w-3.5" />
              {idea.comment_count}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
