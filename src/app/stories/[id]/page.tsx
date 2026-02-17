import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { timeAgo, getInitials } from "@/lib/utils";
import { STORY_TYPES } from "@/types/database";
import StoryVoteButton from "@/components/StoryVoteButton";
import StoryCommentSection from "@/components/StoryCommentSection";
import type { Metadata } from "next";
import {
  ArrowLeft,
  Calendar,
  Lightbulb,
  ThumbsUp,
  ThumbsDown,
  GraduationCap,
  MessageSquareHeart,
  Pencil,
} from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function fetchStoryBySlugOrId(slugOrId: string) {
  const supabase = await createClient();

  const { data: bySlug } = await supabase
    .from("stories")
    .select("*, author:profiles(*)")
    .eq("slug", slugOrId)
    .single();

  if (bySlug) return bySlug;

  if (UUID_RE.test(slugOrId)) {
    const { data: byId } = await supabase
      .from("stories")
      .select("*, author:profiles(*)")
      .eq("id", slugOrId)
      .single();

    return byId;
  }

  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const story = await fetchStoryBySlugOrId(id);

  if (!story) return { title: "Story nicht gefunden" };

  const description =
    story.idea_summary.length > 160
      ? story.idea_summary.slice(0, 157) + "..."
      : story.idea_summary;

  return {
    title: story.title,
    description,
    openGraph: {
      title: story.title,
      description,
      type: "article",
    },
  };
}

export default async function StoryDetailPage({ params }: Props) {
  const { id: slugOrId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const story = await fetchStoryBySlugOrId(slugOrId);

  if (!story) {
    notFound();
  }

  // Fetch comments
  const { data: comments } = await supabase
    .from("story_comments")
    .select("*, author:profiles(*)")
    .eq("story_id", story.id)
    .order("created_at", { ascending: true });

  // Check if user voted
  let userVoted = false;
  if (user) {
    const { data: vote } = await supabase
      .from("story_votes")
      .select("id")
      .eq("story_id", story.id)
      .eq("user_id", user.id)
      .maybeSingle();
    userVoted = !!vote;
  }

  const typeInfo = STORY_TYPES[story.story_type as keyof typeof STORY_TYPES];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <Link
        href="/stories"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Zurück zu Stories
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1fr,auto]">
        {/* Main content */}
        <div>
          {/* Header */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${typeInfo.color}`}
            >
              {typeInfo.label}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{story.title}</h1>
            {user?.id === story.author_id && (
              <Link
                href={`/stories/${story.slug}/edit`}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
              >
                <Pencil className="h-3.5 w-3.5" />
                Bearbeiten
              </Link>
            )}
          </div>

          <div className="mt-3 flex items-center gap-3 text-sm text-muted-foreground">
            <Link
              href={`/profile/${story.author_id}`}
              className="flex items-center gap-2 hover:text-foreground"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-medium">
                {getInitials(story.author?.full_name)}
              </div>
              {story.author?.full_name || "Anonym"}
            </Link>
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {timeAgo(story.created_at)}
            </div>
          </div>

          {/* Idea Summary */}
          <div className="mt-6 rounded-xl bg-muted/50 border border-border p-5">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              <h2 className="font-semibold">Die Idee / Das Projekt</h2>
            </div>
            <p className="text-base leading-relaxed">{story.idea_summary}</p>
          </div>

          {/* What went well */}
          {story.what_went_well && (
            <section className="mt-8">
              <h2 className="flex items-center gap-2 text-xl font-semibold mb-3">
                <ThumbsUp className="h-5 w-5 text-green-500" />
                Was lief gut?
              </h2>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {story.what_went_well}
              </p>
            </section>
          )}

          {/* What went wrong */}
          {story.what_went_wrong && (
            <section className="mt-8">
              <h2 className="flex items-center gap-2 text-xl font-semibold mb-3">
                <ThumbsDown className="h-5 w-5 text-red-500" />
                Was lief schlecht?
              </h2>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {story.what_went_wrong}
              </p>
            </section>
          )}

          {/* Lessons Learned */}
          {story.lessons_learned && (
            <section className="mt-8">
              <h2 className="flex items-center gap-2 text-xl font-semibold mb-3">
                <GraduationCap className="h-5 w-5 text-blue-500" />
                Was habe ich gelernt?
              </h2>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {story.lessons_learned}
              </p>
            </section>
          )}

          {/* Advice */}
          {story.advice && (
            <section className="mt-8 rounded-xl border-2 border-primary/20 bg-primary/5 p-6">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquareHeart className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Rat an andere Gründer</h2>
              </div>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {story.advice}
              </p>
            </section>
          )}

          {/* Comments */}
          <section className="mt-10 pt-8 border-t border-border">
            <StoryCommentSection
              storyId={story.id}
              comments={comments || []}
              userId={user?.id}
            />
          </section>
        </div>

        {/* Sidebar */}
        <div className="lg:w-64 space-y-4">
          <div className="sticky top-24 space-y-4">
            <StoryVoteButton
              storyId={story.id}
              slug={story.slug}
              voteCount={story.vote_count}
              userVoted={userVoted}
              userId={user?.id}
            />
            {/* Author Info */}
            <div className="rounded-xl border border-border p-4">
              <h3 className="text-sm font-medium mb-3">Autor</h3>
              <Link
                href={`/profile/${story.author_id}`}
                className="flex items-center gap-3 hover:text-primary transition-colors"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-medium">
                  {getInitials(story.author?.full_name || null)}
                </div>
                <div>
                  <div className="text-sm font-medium">
                    {story.author?.full_name || "Anonym"}
                  </div>
                  {story.author?.bio && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {story.author.bio}
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
