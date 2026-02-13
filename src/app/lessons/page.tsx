import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import LessonCard from "@/components/LessonCard";
import LessonsFilter from "@/components/LessonsFilter";
import { Search, Plus } from "lucide-react";

interface Props {
  searchParams: Promise<{
    q?: string;
    category?: string;
    sort?: string;
  }>;
}

export default async function LessonsPage({ searchParams }: Props) {
  const params = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("lessons")
    .select("*, author:profiles(*)");

  // Search
  if (params.q) {
    const sanitizedQ = params.q.replace(/[,.()"'\\%_]/g, "");
    if (sanitizedQ.trim()) {
      query = query.or(
        `title.ilike.%${sanitizedQ}%,situation.ilike.%${sanitizedQ}%`
      );
    }
  }

  // Category filter
  if (params.category && params.category !== "all") {
    query = query.eq("category", params.category);
  }

  // Sort
  switch (params.sort) {
    case "most_votes":
      query = query.order("vote_count", { ascending: false });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  const { data: lessons } = await query;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Lessons</h1>
          <p className="mt-2 text-muted-foreground">
            Echte Learnings von Gründern — was sie auf ihrem Weg gelernt haben.
          </p>
        </div>
        <Link
          href="/lessons/new"
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark transition-colors shrink-0 self-start"
        >
          <Plus className="h-4 w-4" />
          Lesson teilen
        </Link>
      </div>

      <LessonsFilter
        currentQuery={params.q || ""}
        currentCategory={params.category || "all"}
        currentSort={params.sort || "newest"}
      />

      {/* Results */}
      {lessons && lessons.length > 0 ? (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {lessons.map((lesson) => (
            <LessonCard key={lesson.id} lesson={lesson} />
          ))}
        </div>
      ) : (
        <div className="mt-16 text-center">
          <Search className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold">Keine Lessons gefunden</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {params.q
              ? `Keine Ergebnisse für "${params.q}". Versuche einen anderen Suchbegriff.`
              : "Sei der Erste und teile dein Learning!"}
          </p>
        </div>
      )}
    </div>
  );
}
