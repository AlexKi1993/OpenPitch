import { createClient } from "@/lib/supabase/server";
import IdeaCard from "@/components/IdeaCard";
import IdeasFilter from "@/components/IdeasFilter";
import { Search } from "lucide-react";
import { CATEGORIES } from "@/types/database";

interface Props {
  searchParams: Promise<{
    q?: string;
    category?: string;
    status?: string;
    sort?: string;
  }>;
}

export default async function IdeasPage({ searchParams }: Props) {
  const params = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("ideas")
    .select("*, author:profiles(*), tags:idea_tags(tag:tags(*))");

  // Search
  if (params.q) {
    query = query.or(
      `title.ilike.%${params.q}%,summary.ilike.%${params.q}%,description.ilike.%${params.q}%`
    );
  }

  // Category filter
  if (params.category && params.category !== "all") {
    query = query.eq("category", params.category);
  }

  // Status filter
  if (params.status && params.status !== "all") {
    query = query.eq("status", params.status);
  }

  // Sort
  switch (params.sort) {
    case "oldest":
      query = query.order("created_at", { ascending: true });
      break;
    case "most_votes":
      query = query.order("vote_count", { ascending: false });
      break;
    case "most_comments":
      query = query.order("comment_count", { ascending: false });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  const { data: ideas } = await query;

  // Flatten tags from join
  const flatIdeas = ideas?.map((idea) => ({
    ...idea,
    tags: idea.tags?.map((t: { tag: unknown }) => t.tag).filter(Boolean) || [],
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Ideen entdecken</h1>
        <p className="mt-2 text-muted-foreground">
          Durchsuche alle gepitchten Geschäftsideen und finde die, die dich
          begeistert.
        </p>
      </div>

      <IdeasFilter
        currentQuery={params.q || ""}
        currentCategory={params.category || "all"}
        currentStatus={params.status || "all"}
        currentSort={params.sort || "newest"}
      />

      {/* Results */}
      {flatIdeas && flatIdeas.length > 0 ? (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {flatIdeas.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} />
          ))}
        </div>
      ) : (
        <div className="mt-16 text-center">
          <Search className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold">Keine Ideen gefunden</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {params.q
              ? `Keine Ergebnisse für "${params.q}". Versuche einen anderen Suchbegriff.`
              : "Sei der Erste und pitche eine Idee!"}
          </p>
        </div>
      )}
    </div>
  );
}
