import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import IdeaCard from "@/components/IdeaCard";
import IdeasFilter from "@/components/IdeasFilter";
import { Search, Plus } from "lucide-react";
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
    .select("*, author:profiles(*), tags:idea_tags(tag:tags(*)), images:idea_images(*)");

  // Search (sanitize to prevent PostgREST filter injection)
  if (params.q) {
    const sanitizedQ = params.q.replace(/[,.()"'\\%_]/g, "");
    if (sanitizedQ.trim()) {
      query = query.or(
        `title.ilike.%${sanitizedQ}%,summary.ilike.%${sanitizedQ}%,description.ilike.%${sanitizedQ}%`
      );
    }
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Ideen entdecken</h1>
          <p className="mt-2 text-muted-foreground">
            Durchsuche alle gepitchten Geschäftsideen und finde die, die dich
            begeistert.
          </p>
        </div>
        <Link
          href="/ideas/new"
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark transition-colors"
        >
          <Plus className="h-4 w-4" />
          Idee pitchen
        </Link>
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
