import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { timeAgo } from "@/lib/utils";
import { STATUS_LABELS, STATUS_COLORS } from "@/types/database";
import { STORY_TYPES } from "@/types/database";
import {
  Lightbulb,
  Plus,
  ArrowUp,
  MessageCircle,
  Users,
  Settings,
  BookOpen,
  GraduationCap,
} from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Fetch user's ideas
  const { data: myIdeas } = await supabase
    .from("ideas")
    .select("*, slug")
    .eq("author_id", user.id)
    .order("created_at", { ascending: false });

  // Fetch collaborations
  const { data: myCollabs } = await supabase
    .from("collaborators")
    .select("*, idea:ideas(id, slug, title, status, author:profiles(full_name))")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // Fetch collaboration requests on user's ideas
  const { data: requests } = await supabase
    .from("collaborators")
    .select(
      "*, user:profiles(id, full_name), idea:ideas!inner(id, title, author_id)"
    )
    .eq("idea.author_id", user.id)
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  // Fetch user's stories
  const { data: myStories } = await supabase
    .from("stories")
    .select("*")
    .eq("author_id", user.id)
    .order("created_at", { ascending: false });

  // Fetch user's lessons
  const { data: myLessons } = await supabase
    .from("lessons")
    .select("*")
    .eq("author_id", user.id)
    .order("created_at", { ascending: false });

  const totalVotes =
    myIdeas?.reduce((sum, idea) => sum + idea.vote_count, 0) || 0;
  const totalComments =
    myIdeas?.reduce((sum, idea) => sum + idea.comment_count, 0) || 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            Verwalte deine Ideen und Kollaborationen
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href={`/profile/${user.id}`}
            className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm hover:bg-muted transition-colors"
          >
            <Settings className="h-4 w-4" />
            Profil
          </Link>
          <Link
            href="/ideas/new"
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark transition-colors"
          >
            <Plus className="h-4 w-4" />
            Neue Idee
          </Link>
          <Link
            href="/stories/new"
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark transition-colors"
          >
            <Plus className="h-4 w-4" />
            Neue Story
          </Link>
          <Link
            href="/lessons/new"
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark transition-colors"
          >
            <Plus className="h-4 w-4" />
            Neue Lesson
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-8">
        <div className="rounded-xl border border-border bg-card p-4">
          <Lightbulb className="h-5 w-5 text-primary mb-2" />
          <div className="text-2xl font-bold">{myIdeas?.length || 0}</div>
          <div className="text-xs text-muted-foreground">Meine Ideen</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <ArrowUp className="h-5 w-5 text-green-500 mb-2" />
          <div className="text-2xl font-bold">{totalVotes}</div>
          <div className="text-xs text-muted-foreground">Votes erhalten</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <MessageCircle className="h-5 w-5 text-blue-500 mb-2" />
          <div className="text-2xl font-bold">{totalComments}</div>
          <div className="text-xs text-muted-foreground">Kommentare</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <Users className="h-5 w-5 text-purple-500 mb-2" />
          <div className="text-2xl font-bold">{myCollabs?.length || 0}</div>
          <div className="text-xs text-muted-foreground">Kollaborationen</div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* My Ideas */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Meine Ideen</h2>
          {myIdeas && myIdeas.length > 0 ? (
            <div className="space-y-3">
              {myIdeas.map((idea) => (
                <Link
                  key={idea.id}
                  href={`/ideas/${idea.slug}`}
                  className="block rounded-lg border border-border p-4 hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-medium truncate">{idea.title}</h3>
                      <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[idea.status as keyof typeof STATUS_COLORS]}`}
                        >
                          {STATUS_LABELS[idea.status as keyof typeof STATUS_LABELS]}
                        </span>
                        <span>{timeAgo(idea.created_at)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground shrink-0">
                      <span className="flex items-center gap-1">
                        <ArrowUp className="h-3.5 w-3.5" />
                        {idea.vote_count}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-3.5 w-3.5" />
                        {idea.comment_count}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-border p-8 text-center">
              <Lightbulb className="mx-auto h-8 w-8 text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground">
                Du hast noch keine Ideen gepitcht.
              </p>
              <Link
                href="/ideas/new"
                className="mt-3 inline-block text-sm text-primary font-medium hover:underline"
              >
                Erste Idee erstellen
              </Link>
            </div>
          )}
        </section>

        {/* My Stories */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Meine Stories</h2>
          {myStories && myStories.length > 0 ? (
            <div className="space-y-3">
              {myStories.map((story) => {
                const typeInfo = STORY_TYPES[story.story_type as keyof typeof STORY_TYPES];
                return (
                  <Link
                    key={story.id}
                    href={`/stories/${story.slug}`}
                    className="block rounded-lg border border-border p-4 hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="font-medium truncate">{story.title}</h3>
                        <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${typeInfo.color}`}
                          >
                            {typeInfo.label}
                          </span>
                          <span>{timeAgo(story.created_at)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground shrink-0">
                        <span className="flex items-center gap-1">
                          <ArrowUp className="h-3.5 w-3.5" />
                          {story.vote_count}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="h-3.5 w-3.5" />
                          {story.comment_count}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-border p-8 text-center">
              <BookOpen className="mx-auto h-8 w-8 text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground">
                Du hast noch keine Stories geteilt.
              </p>
              <Link
                href="/stories/new"
                className="mt-3 inline-block text-sm text-primary font-medium hover:underline"
              >
                Erste Story teilen
              </Link>
            </div>
          )}
        </section>

        {/* My Lessons */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Meine Lessons</h2>
          {myLessons && myLessons.length > 0 ? (
            <div className="space-y-3">
              {myLessons.map((lesson) => (
                <Link
                  key={lesson.id}
                  href={`/lessons/${lesson.slug}`}
                  className="block rounded-lg border border-border p-4 hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-medium truncate">{lesson.title}</h3>
                      <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="rounded-full px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800">
                          {lesson.category}
                        </span>
                        <span>{timeAgo(lesson.created_at)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground shrink-0">
                      <span className="flex items-center gap-1">
                        <ArrowUp className="h-3.5 w-3.5" />
                        {lesson.vote_count}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-3.5 w-3.5" />
                        {lesson.comment_count}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-border p-8 text-center">
              <GraduationCap className="mx-auto h-8 w-8 text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground">
                Du hast noch keine Lessons geteilt.
              </p>
              <Link
                href="/lessons/new"
                className="mt-3 inline-block text-sm text-primary font-medium hover:underline"
              >
                Erste Lesson teilen
              </Link>
            </div>
          )}
        </section>

        {/* Collaboration Requests */}
        <section>
          <h2 className="text-xl font-semibold mb-4">
            Bewerbungen ({requests?.length || 0})
          </h2>
          {requests && requests.length > 0 ? (
            <div className="space-y-3">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className="rounded-lg border border-border p-4"
                >
                  <div className="flex items-center gap-2 text-sm">
                    <Link
                      href={`/profile/${req.user_id}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {req.user?.full_name || "Jemand"}
                    </Link>
                    <span className="text-muted-foreground">
                      will bei &quot;{req.idea?.title}&quot; mitmachen
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="rounded-full bg-muted px-2 py-0.5">
                      {req.role}
                    </span>
                    <span>{timeAgo(req.created_at)}</span>
                  </div>
                  {req.message && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      {req.message}
                    </p>
                  )}
                  <div className="mt-3">
                    <Link
                      href={`/inbox/${req.id}`}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors"
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                      Antworten
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-border p-8 text-center">
              <Users className="mx-auto h-8 w-8 text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground">
                Keine offenen Bewerbungen.
              </p>
            </div>
          )}

          {/* My Collaborations */}
          <h2 className="text-xl font-semibold mb-4 mt-8">
            Meine Kollaborationen
          </h2>
          {myCollabs && myCollabs.length > 0 ? (
            <div className="space-y-3">
              {myCollabs.map((collab) => (
                <Link
                  key={collab.id}
                  href={`/ideas/${collab.idea?.slug}`}
                  className="block rounded-lg border border-border p-4 hover:border-primary/50 transition-colors"
                >
                  <h3 className="font-medium text-sm">
                    {collab.idea?.title}
                  </h3>
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="rounded-full bg-muted px-2 py-0.5">
                      {collab.role}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 font-medium ${
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
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-border p-8 text-center">
              <p className="text-sm text-muted-foreground">
                Du bist noch bei keiner Idee dabei.
              </p>
              <Link
                href="/ideas"
                className="mt-3 inline-block text-sm text-primary font-medium hover:underline"
              >
                Ideen entdecken
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
