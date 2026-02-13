"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { BookOpen, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditStoryPage() {
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = useState("");
  const [storyType, setStoryType] = useState<"success" | "fuckup">("success");
  const [ideaSummary, setIdeaSummary] = useState("");
  const [whatWentWell, setWhatWentWell] = useState("");
  const [whatWentWrong, setWhatWentWrong] = useState("");
  const [lessonsLearned, setLessonsLearned] = useState("");
  const [advice, setAdvice] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function loadData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push(`/login?redirect=/stories/${id}/edit`);
        return;
      }

      const { data: story, error: storyError } = await supabase
        .from("stories")
        .select("*")
        .eq("id", id)
        .single();

      if (storyError || !story) {
        router.push("/stories");
        return;
      }

      if (story.author_id !== user.id) {
        router.push(`/stories/${id}`);
        return;
      }

      setTitle(story.title || "");
      setStoryType(story.story_type || "success");
      setIdeaSummary(story.idea_summary || "");
      setWhatWentWell(story.what_went_well || "");
      setWhatWentWrong(story.what_went_wrong || "");
      setLessonsLearned(story.lessons_learned || "");
      setAdvice(story.advice || "");

      setInitialLoading(false);
    }

    loadData();
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push(`/login?redirect=/stories/${id}/edit`);
      return;
    }

    // Validation
    if (title.trim().length < 3 || title.length > 200) {
      setError("Der Titel muss zwischen 3 und 200 Zeichen lang sein.");
      setLoading(false);
      return;
    }
    if (ideaSummary.trim().length < 10 || ideaSummary.length > 500) {
      setError(
        "Die Zusammenfassung muss zwischen 10 und 500 Zeichen lang sein."
      );
      setLoading(false);
      return;
    }
    if (whatWentWell.trim().length < 10 || whatWentWell.length > 5000) {
      setError(
        "'Was lief gut?' muss zwischen 10 und 5.000 Zeichen lang sein."
      );
      setLoading(false);
      return;
    }
    if (whatWentWrong.trim().length < 10 || whatWentWrong.length > 5000) {
      setError(
        "'Was lief schlecht?' muss zwischen 10 und 5.000 Zeichen lang sein."
      );
      setLoading(false);
      return;
    }
    if (lessonsLearned.trim().length < 10 || lessonsLearned.length > 5000) {
      setError(
        "'Lessons Learned' muss zwischen 10 und 5.000 Zeichen lang sein."
      );
      setLoading(false);
      return;
    }
    if (advice.length > 3000) {
      setError("Der Rat darf maximal 3.000 Zeichen lang sein.");
      setLoading(false);
      return;
    }

    const { error: updateError } = await supabase
      .from("stories")
      .update({
        title,
        story_type: storyType,
        idea_summary: ideaSummary,
        what_went_well: whatWentWell,
        what_went_wrong: whatWentWrong,
        lessons_learned: lessonsLearned,
        advice,
      })
      .eq("id", id);

    if (updateError) {
      setError(
        "Beim Speichern der Story ist ein Fehler aufgetreten. Bitte versuche es erneut."
      );
      setLoading(false);
      return;
    }

    router.push(`/stories/${id}`);
  }

  if (initialLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-muted rounded" />
          <div className="h-12 bg-muted rounded" />
          <div className="h-32 bg-muted rounded" />
          <div className="h-32 bg-muted rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Link
        href={`/stories/${id}`}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Zurück zur Story
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <BookOpen className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Story bearbeiten</h1>
          <p className="text-sm text-muted-foreground">
            Aktualisiere deine Gründer-Erfahrung
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Story Type Toggle */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Art der Story
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStoryType("success")}
              className={`flex-1 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all ${
                storyType === "success"
                  ? "border-green-500 bg-green-50 text-green-700"
                  : "border-border hover:border-green-300 text-muted-foreground"
              }`}
            >
              Erfolgsgeschichte
            </button>
            <button
              type="button"
              onClick={() => setStoryType("fuckup")}
              className={`flex-1 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all ${
                storyType === "fuckup"
                  ? "border-red-500 bg-red-50 text-red-700"
                  : "border-border hover:border-red-300 text-muted-foreground"
              }`}
            >
              FuckUp
            </button>
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Titel <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="z.B. Wie wir mit 500€ eine profitable SaaS gebaut haben"
            required
            maxLength={200}
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Idea Summary */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Was war die Idee / das Projekt?{" "}
            <span className="text-red-500">*</span>
          </label>
          <textarea
            value={ideaSummary}
            onChange={(e) => setIdeaSummary(e.target.value)}
            placeholder="Beschreibe kurz die Idee oder das Projekt, um das es geht"
            required
            rows={2}
            maxLength={500}
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
          />
        </div>

        {/* What went well */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Was lief gut? <span className="text-red-500">*</span>
          </label>
          <textarea
            value={whatWentWell}
            onChange={(e) => setWhatWentWell(e.target.value)}
            placeholder="Welche Entscheidungen, Strategien oder Zufälle haben zum Erfolg beigetragen?"
            required
            rows={4}
            maxLength={5000}
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
          />
        </div>

        {/* What went wrong */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Was lief schlecht? <span className="text-red-500">*</span>
          </label>
          <textarea
            value={whatWentWrong}
            onChange={(e) => setWhatWentWrong(e.target.value)}
            placeholder="Welche Fehler wurden gemacht? Was hätte besser laufen können?"
            required
            rows={4}
            maxLength={5000}
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
          />
        </div>

        {/* Lessons Learned */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Was habe ich gelernt? <span className="text-red-500">*</span>
          </label>
          <textarea
            value={lessonsLearned}
            onChange={(e) => setLessonsLearned(e.target.value)}
            placeholder="Welche Erkenntnisse nimmst du aus dieser Erfahrung mit?"
            required
            rows={4}
            maxLength={5000}
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
          />
        </div>

        {/* Advice */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Rat an andere Gründer
          </label>
          <textarea
            value={advice}
            onChange={(e) => setAdvice(e.target.value)}
            placeholder="Was würdest du anderen Gründern raten, die in einer ähnlichen Situation sind?"
            rows={3}
            maxLength={3000}
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
          />
        </div>

        {/* Submit */}
        <div className="flex gap-3 pt-4 border-t border-border">
          <Link
            href={`/stories/${id}`}
            className="rounded-lg border border-border px-6 py-2.5 text-sm font-medium hover:bg-muted transition-colors"
          >
            Abbrechen
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 rounded-lg bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {loading ? "Wird gespeichert..." : "Änderungen speichern"}
          </button>
        </div>
      </form>
    </div>
  );
}
