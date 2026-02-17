"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { GraduationCap, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { LESSON_CATEGORIES } from "@/types/database";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default function EditLessonPage() {
  const { id: slugOrId } = useParams<{ id: string }>();
  const [lessonUuid, setLessonUuid] = useState("");
  const [lessonSlug, setLessonSlug] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Sonstiges");
  const [situation, setSituation] = useState("");
  const [learning, setLearning] = useState("");
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
        router.push(`/login?redirect=/lessons/${slugOrId}/edit`);
        return;
      }

      // Try slug first, then UUID fallback
      let lesson = null;
      const { data: bySlug } = await supabase
        .from("lessons")
        .select("*")
        .eq("slug", slugOrId)
        .single();

      if (bySlug) {
        lesson = bySlug;
      } else if (UUID_RE.test(slugOrId)) {
        const { data: byId } = await supabase
          .from("lessons")
          .select("*")
          .eq("id", slugOrId)
          .single();
        lesson = byId;
      }

      if (!lesson) {
        router.push("/lessons");
        return;
      }

      setLessonUuid(lesson.id);
      setLessonSlug(lesson.slug);

      if (lesson.author_id !== user.id) {
        router.push(`/lessons/${lesson.slug}`);
        return;
      }

      setTitle(lesson.title || "");
      setCategory(lesson.category || "Sonstiges");
      setSituation(lesson.situation || "");
      setLearning(lesson.learning || "");
      setAdvice(lesson.advice || "");

      setInitialLoading(false);
    }

    loadData();
  }, [slugOrId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push(`/login?redirect=/lessons/${lessonSlug}/edit`);
      return;
    }

    // Validation
    if (title.trim().length < 3 || title.length > 200) {
      setError("Der Titel muss zwischen 3 und 200 Zeichen lang sein.");
      setLoading(false);
      return;
    }
    if (situation.trim().length < 10 || situation.length > 5000) {
      setError("Die Situation muss zwischen 10 und 5.000 Zeichen lang sein.");
      setLoading(false);
      return;
    }
    if (learning.trim().length < 10 || learning.length > 5000) {
      setError(
        "Die Erkenntnis muss zwischen 10 und 5.000 Zeichen lang sein."
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
      .from("lessons")
      .update({
        title,
        category,
        situation,
        learning,
        advice,
      })
      .eq("id", lessonUuid);

    if (updateError) {
      setError(
        "Beim Speichern der Lesson ist ein Fehler aufgetreten. Bitte versuche es erneut."
      );
      setLoading(false);
      return;
    }

    router.push(`/lessons/${lessonSlug}`);
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
        href={`/lessons/${lessonSlug}`}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Zurück zur Lesson
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <GraduationCap className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Lesson bearbeiten</h1>
          <p className="text-sm text-muted-foreground">
            Aktualisiere dein Gründer-Learning
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Titel <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="z.B. Warum wir zu spät auf Kundenfeedback gehört haben"
            required
            maxLength={200}
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Kategorie <span className="text-red-500">*</span>
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {LESSON_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Situation */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Was ist passiert? <span className="text-red-500">*</span>
          </label>
          <textarea
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
            placeholder="Beschreibe die Situation oder das Problem, das du erlebt hast"
            required
            rows={4}
            maxLength={5000}
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
          />
        </div>

        {/* Learning */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Was habe ich gelernt? <span className="text-red-500">*</span>
          </label>
          <textarea
            value={learning}
            onChange={(e) => setLearning(e.target.value)}
            placeholder="Welche Erkenntnis nimmst du aus dieser Erfahrung mit?"
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
            href={`/lessons/${lessonSlug}`}
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
