import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { timeAgo, getInitials } from "@/lib/utils";
import LessonVoteButton from "@/components/LessonVoteButton";
import LessonCommentSection from "@/components/LessonCommentSection";
import type { Metadata } from "next";
import {
  ArrowLeft,
  Calendar,
  AlertCircle,
  GraduationCap,
  MessageSquareHeart,
  Pencil,
} from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function fetchLessonBySlugOrId(slugOrId: string) {
  const supabase = await createClient();

  const { data: bySlug } = await supabase
    .from("lessons")
    .select("*, author:profiles(*)")
    .eq("slug", slugOrId)
    .single();

  if (bySlug) return bySlug;

  if (UUID_RE.test(slugOrId)) {
    const { data: byId } = await supabase
      .from("lessons")
      .select("*, author:profiles(*)")
      .eq("id", slugOrId)
      .single();

    return byId;
  }

  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const lesson = await fetchLessonBySlugOrId(id);

  if (!lesson) return { title: "Lesson nicht gefunden" };

  const description =
    lesson.situation.length > 160
      ? lesson.situation.slice(0, 157) + "..."
      : lesson.situation;

  return {
    title: lesson.title,
    description,
    openGraph: {
      title: lesson.title,
      description,
      type: "article",
    },
  };
}

export default async function LessonDetailPage({ params }: Props) {
  const { id: slugOrId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const lesson = await fetchLessonBySlugOrId(slugOrId);

  if (!lesson) {
    notFound();
  }

  // Fetch comments
  const { data: comments } = await supabase
    .from("lesson_comments")
    .select("*, author:profiles(*)")
    .eq("lesson_id", lesson.id)
    .order("created_at", { ascending: true });

  // Check if user voted
  let userVoted = false;
  if (user) {
    const { data: vote } = await supabase
      .from("lesson_votes")
      .select("id")
      .eq("lesson_id", lesson.id)
      .eq("user_id", user.id)
      .maybeSingle();
    userVoted = !!vote;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <Link
        href="/lessons"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Zurück zu Lessons
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1fr,auto]">
        {/* Main content */}
        <div>
          {/* Header */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="rounded-full px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800">
              {lesson.category}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{lesson.title}</h1>
            {user?.id === lesson.author_id && (
              <Link
                href={`/lessons/${lesson.slug}/edit`}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
              >
                <Pencil className="h-3.5 w-3.5" />
                Bearbeiten
              </Link>
            )}
          </div>

          <div className="mt-3 flex items-center gap-3 text-sm text-muted-foreground">
            <Link
              href={`/profile/${lesson.author_id}`}
              className="flex items-center gap-2 hover:text-foreground"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-medium">
                {getInitials(lesson.author?.full_name)}
              </div>
              {lesson.author?.full_name || "Anonym"}
            </Link>
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {timeAgo(lesson.created_at)}
            </div>
          </div>

          {/* Situation */}
          <div className="mt-6 rounded-xl bg-muted/50 border border-border p-5">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              <h2 className="font-semibold">Was ist passiert?</h2>
            </div>
            <p className="text-base leading-relaxed whitespace-pre-wrap">{lesson.situation}</p>
          </div>

          {/* Learning */}
          {lesson.learning && (
            <section className="mt-8">
              <h2 className="flex items-center gap-2 text-xl font-semibold mb-3">
                <GraduationCap className="h-5 w-5 text-blue-500" />
                Was habe ich gelernt?
              </h2>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {lesson.learning}
              </p>
            </section>
          )}

          {/* Advice */}
          {lesson.advice && (
            <section className="mt-8 rounded-xl border-2 border-primary/20 bg-primary/5 p-6">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquareHeart className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Rat an andere Gründer</h2>
              </div>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {lesson.advice}
              </p>
            </section>
          )}

          {/* Comments */}
          <section className="mt-10 pt-8 border-t border-border">
            <LessonCommentSection
              lessonId={lesson.id}
              comments={comments || []}
              userId={user?.id}
            />
          </section>
        </div>

        {/* Sidebar */}
        <div className="lg:w-64 space-y-4">
          <div className="sticky top-24 space-y-4">
            <LessonVoteButton
              lessonId={lesson.id}
              slug={lesson.slug}
              voteCount={lesson.vote_count}
              userVoted={userVoted}
              userId={user?.id}
            />
            {/* Author Info */}
            <div className="rounded-xl border border-border p-4">
              <h3 className="text-sm font-medium mb-3">Autor</h3>
              <Link
                href={`/profile/${lesson.author_id}`}
                className="flex items-center gap-3 hover:text-primary transition-colors"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-medium">
                  {getInitials(lesson.author?.full_name || null)}
                </div>
                <div>
                  <div className="text-sm font-medium">
                    {lesson.author?.full_name || "Anonym"}
                  </div>
                  {lesson.author?.bio && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {lesson.author.bio}
                    </p>
                  )}
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
