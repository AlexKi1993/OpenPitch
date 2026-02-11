import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { timeAgo, getInitials } from "@/lib/utils";
import { STATUS_LABELS, STATUS_COLORS } from "@/types/database";
import VoteButton from "@/components/VoteButton";
import CommentSection from "@/components/CommentSection";
import CollaborateButton from "@/components/CollaborateButton";
import {
  ArrowLeft,
  Calendar,
  Tag,
  Target,
  Lightbulb,
  CheckCircle,
  Users,
  HandCoins,
  Handshake,
  CircleOff,
} from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function IdeaDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch idea with author and tags
  const { data: idea, error } = await supabase
    .from("ideas")
    .select("*, author:profiles(*), tags:idea_tags(tag:tags(*))")
    .eq("id", id)
    .single();

  if (error || !idea) {
    notFound();
  }

  // Flatten tags
  const tags =
    idea.tags?.map((t: { tag: unknown }) => t.tag).filter(Boolean) || [];

  // Fetch comments
  const { data: comments } = await supabase
    .from("comments")
    .select("*, author:profiles(*)")
    .eq("idea_id", id)
    .order("created_at", { ascending: true });

  // Check if user voted
  let userVoted = false;
  if (user) {
    const { data: vote } = await supabase
      .from("votes")
      .select("id")
      .eq("idea_id", id)
      .eq("user_id", user.id)
      .maybeSingle();
    userVoted = !!vote;
  }

  // Check if user has applied as collaborator
  let hasApplied = false;
  if (user) {
    const { data: collab } = await supabase
      .from("collaborators")
      .select("id")
      .eq("idea_id", id)
      .eq("user_id", user.id)
      .maybeSingle();
    hasApplied = !!collab;
  }

  // Fetch collaborators
  const { data: collaborators } = await supabase
    .from("collaborators")
    .select("*, user:profiles(*)")
    .eq("idea_id", id)
    .order("created_at", { ascending: true });

  const isAuthor = user?.id === idea.author_id;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <Link
        href="/ideas"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Zurück zu Ideen
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1fr,auto]">
        {/* Main content */}
        <div>
          {/* Header */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_COLORS[idea.status as keyof typeof STATUS_COLORS]}`}
            >
              {STATUS_LABELS[idea.status as keyof typeof STATUS_LABELS]}
            </span>
            <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
              {idea.category}
            </span>
          </div>

          <h1 className="text-3xl font-bold">{idea.title}</h1>

          <div className="mt-3 flex items-center gap-3 text-sm text-muted-foreground">
            <Link
              href={`/profile/${idea.author_id}`}
              className="flex items-center gap-2 hover:text-foreground"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-medium">
                {getInitials(idea.author?.full_name)}
              </div>
              {idea.author?.full_name || "Anonym"}
            </Link>
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {timeAgo(idea.created_at)}
            </div>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {tags.map((tag: { id: string; name: string; color: string }) => (
                <span
                  key={tag.id}
                  className="rounded-md px-2.5 py-1 text-xs font-medium"
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

          {/* Summary */}
          <div className="mt-6 rounded-xl bg-muted/50 border border-border p-5">
            <p className="text-base leading-relaxed">{idea.summary}</p>
          </div>

          {/* Problem */}
          {idea.problem && (
            <section className="mt-8">
              <h2 className="flex items-center gap-2 text-xl font-semibold mb-3">
                <Target className="h-5 w-5 text-red-500" />
                Problem
              </h2>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {idea.problem}
              </p>
            </section>
          )}

          {/* Solution */}
          {idea.solution && (
            <section className="mt-8">
              <h2 className="flex items-center gap-2 text-xl font-semibold mb-3">
                <Lightbulb className="h-5 w-5 text-primary" />
                Lösung
              </h2>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {idea.solution}
              </p>
            </section>
          )}

          {/* Description */}
          <section className="mt-8">
            <h2 className="flex items-center gap-2 text-xl font-semibold mb-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Beschreibung
            </h2>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {idea.description}
            </p>
          </section>

          {/* Target Audience */}
          {idea.target_audience && (
            <section className="mt-8">
              <h2 className="flex items-center gap-2 text-xl font-semibold mb-3">
                <Users className="h-5 w-5 text-blue-500" />
                Zielgruppe
              </h2>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {idea.target_audience}
              </p>
            </section>
          )}

          {/* Founder Intention */}
          <section className="mt-8 rounded-xl border-2 border-primary/20 bg-primary/5 p-6">
            {idea.self_implement ? (
              <>
                <div className="flex items-center gap-2 mb-3">
                  <Handshake className="h-6 w-6 text-primary" />
                  <h2 className="text-xl font-semibold">Suche aktiv Unterstützung</h2>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Der Ideengeber möchte diese Idee selbst umsetzen und sucht:
                </p>
                {idea.looking_for && (
                  <div className="mb-3">
                    <h3 className="text-sm font-medium mb-1">Was wird gesucht:</h3>
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {idea.looking_for}
                    </p>
                  </div>
                )}
                {idea.mvp_budget && (
                  <div className="flex items-center gap-2">
                    <HandCoins className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Geschätztes MVP-Budget:</span>
                    <span className="rounded-full bg-primary/10 px-3 py-0.5 text-sm font-medium text-primary">
                      {idea.mvp_budget === "0-1k" && "0 - 1.000 €"}
                      {idea.mvp_budget === "1k-5k" && "1.000 - 5.000 €"}
                      {idea.mvp_budget === "5k-15k" && "5.000 - 15.000 €"}
                      {idea.mvp_budget === "15k-50k" && "15.000 - 50.000 €"}
                      {idea.mvp_budget === "50k-100k" && "50.000 - 100.000 €"}
                      {idea.mvp_budget === "100k+" && "100.000 € +"}
                      {!idea.mvp_budget && "Keine Angabe"}
                    </span>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="h-6 w-6 text-amber-500" />
                  <h2 className="text-xl font-semibold">Freie Idee - Suche Umsetzer</h2>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Der Ideengeber gibt diese Idee frei und sucht jemanden, der sie umsetzt.
                </p>
                {idea.not_self_reason && (
                  <div>
                    <h3 className="text-sm font-medium mb-1 flex items-center gap-1">
                      <CircleOff className="h-3.5 w-3.5" />
                      Warum nicht selbst:
                    </h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {idea.not_self_reason}
                    </p>
                  </div>
                )}
              </>
            )}
          </section>

          {/* Collaborators */}
          {collaborators && collaborators.length > 0 && (
            <section className="mt-8">
              <h2 className="text-xl font-semibold mb-4">
                Umsetzer ({collaborators.length})
              </h2>
              <div className="space-y-3">
                {collaborators.map((collab) => (
                  <div
                    key={collab.id}
                    className="flex items-start gap-3 rounded-lg border border-border p-4"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-medium shrink-0">
                      {getInitials(collab.user?.full_name || null)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/profile/${collab.user_id}`}
                          className="text-sm font-medium hover:text-primary"
                        >
                          {collab.user?.full_name || "Anonym"}
                        </Link>
                        <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                          {collab.role}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            collab.status === "accepted"
                              ? "bg-green-100 text-green-700"
                              : collab.status === "rejected"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {collab.status === "accepted"
                            ? "Akzeptiert"
                            : collab.status === "rejected"
                              ? "Abgelehnt"
                              : "Ausstehend"}
                        </span>
                      </div>
                      {collab.message && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          {collab.message}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Comments */}
          <section className="mt-10 pt-8 border-t border-border">
            <CommentSection
              ideaId={id}
              comments={comments || []}
              userId={user?.id}
            />
          </section>
        </div>

        {/* Sidebar */}
        <div className="lg:w-64 space-y-4">
          <div className="sticky top-24 space-y-4">
            <VoteButton
              ideaId={id}
              voteCount={idea.vote_count}
              userVoted={userVoted}
              userId={user?.id}
            />
            {!isAuthor && (
              <CollaborateButton
                ideaId={id}
                userId={user?.id}
                hasApplied={hasApplied}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
