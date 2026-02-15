import Link from "next/link";
import { ArrowUp, MessageCircle } from "lucide-react";
import { timeAgo, getInitials } from "@/lib/utils";
import type { Lesson } from "@/types/database";

interface LessonCardProps {
  lesson: Lesson;
}

export default function LessonCard({ lesson }: LessonCardProps) {
  return (
    <Link
      href={`/lessons/${lesson.id}`}
      className="group block overflow-hidden rounded-xl border border-border bg-card p-4 sm:p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
    >
      <div className="flex gap-4">
        {/* Vote count */}
        <div className="flex flex-col items-center gap-1 pt-1">
          <ArrowUp className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
          <span className="text-lg font-bold">{lesson.vote_count}</span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800">
              {lesson.category}
            </span>
          </div>

          <h3 className="text-lg font-semibold group-hover:text-primary transition-colors truncate">
            {lesson.title}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {lesson.situation}
          </p>

          {/* Meta */}
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <Link
              href={`/profile/${lesson.author_id}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 min-w-0 hover:text-primary transition-colors"
            >
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-medium">
                {getInitials(lesson.author?.full_name || null)}
              </div>
              <span className="truncate">{lesson.author?.full_name || "Anonym"}</span>
            </Link>
            <span className="shrink-0">{timeAgo(lesson.created_at)}</span>
            <div className="flex items-center gap-1 shrink-0">
              <MessageCircle className="h-3.5 w-3.5" />
              {lesson.comment_count}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
