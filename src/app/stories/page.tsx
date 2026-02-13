import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import StoryCard from "@/components/StoryCard";
import StoriesFilter from "@/components/StoriesFilter";
import { Search, Plus } from "lucide-react";

interface Props {
  searchParams: Promise<{
    q?: string;
    type?: string;
    sort?: string;
  }>;
}

export default async function StoriesPage({ searchParams }: Props) {
  const params = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("stories")
    .select("*, author:profiles(*)");

  // Search
  if (params.q) {
    const sanitizedQ = params.q.replace(/[,.()"'\\%_]/g, "");
    if (sanitizedQ.trim()) {
      query = query.or(
        `title.ilike.%${sanitizedQ}%,idea_summary.ilike.%${sanitizedQ}%`
      );
    }
  }

  // Type filter
  if (params.type && params.type !== "all") {
    query = query.eq("story_type", params.type);
  }

  // Sort
  switch (params.sort) {
    case "most_votes":
      query = query.order("vote_count", { ascending: false });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  const { data: stories } = await query;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Storyboard</h1>
          <p className="mt-2 text-muted-foreground">
            Echte Erfahrungsberichte von Gründern — Erfolgsgeschichten und FuckUps.
          </p>
        </div>
        <Link
          href="/stories/new"
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark transition-colors shrink-0 self-start"
        >
          <Plus className="h-4 w-4" />
          Story teilen
        </Link>
      </div>

      <StoriesFilter
        currentQuery={params.q || ""}
        currentType={params.type || "all"}
        currentSort={params.sort || "newest"}
      />

      {/* Results */}
      {stories && stories.length > 0 ? (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {stories.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      ) : (
        <div className="mt-16 text-center">
          <Search className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold">Keine Stories gefunden</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {params.q
              ? `Keine Ergebnisse für "${params.q}". Versuche einen anderen Suchbegriff.`
              : "Sei der Erste und teile deine Erfahrung!"}
          </p>
        </div>
      )}
    </div>
  );
}
