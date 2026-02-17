"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils";
import { GraduationCap, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { LESSON_CATEGORIES } from "@/types/database";

export default function NewLessonPage() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Sonstiges");
  const [situation, setSituation] = useState("");
  const [learning, setLearning] = useState("");
  const [advice, setAdvice] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login?redirect=/lessons/new");
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
      setError("Die Erkenntnis muss zwischen 10 und 5.000 Zeichen lang sein.");
      setLoading(false);
      return;
    }
    if (advice.length > 3000) {
      setError("Der Rat darf maximal 3.000 Zeichen lang sein.");
      setLoading(false);
      return;
    }

    const slug = slugify(title) + "-" + Date.now().toString(36);

    const { data: lesson, error: lessonError } = await supabase
      .from("lessons")
      .insert({
        author_id: user.id,
        title,
        slug,
        category,
        situation,
        learning,
        advice,
      })
      .select()
      .single();

    if (lessonError) {
      setError("Beim Erstellen der Lesson ist ein Fehler aufgetreten. Bitte versuche es erneut.");
      setLoading(false);
      return;
    }

    router.push(`/lessons/${lesson.slug}`);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Link
        href="/lessons"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Zurück zu Lessons
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <GraduationCap className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Lesson teilen</h1>
          <p className="text-sm text-muted-foreground">
            Teile dein Gründer-Learning mit der Community
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
            href="/lessons"
            className="rounded-lg border border-border px-6 py-2.5 text-sm font-medium hover:bg-muted transition-colors"
          >
            Abbrechen
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 rounded-lg bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {loading ? "Wird veröffentlicht..." : "Lesson veröffentlichen"}
          </button>
        </div>
      </form>
    </div>
  );
}
