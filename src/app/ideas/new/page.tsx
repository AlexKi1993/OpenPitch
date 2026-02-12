"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils";
import { CATEGORIES } from "@/types/database";
import type { Tag } from "@/types/database";
import { Lightbulb, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewIdeaPage() {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [problem, setProblem] = useState("");
  const [solution, setSolution] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [category, setCategory] = useState("Other");
  const [selfImplement, setSelfImplement] = useState(false);
  const [lookingFor, setLookingFor] = useState("");
  const [mvpBudget, setMvpBudget] = useState("");
  const [notSelfReason, setNotSelfReason] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase
      .from("tags")
      .select("*")
      .order("name")
      .then(({ data }) => {
        if (data) setAllTags(data);
      });
  }, []);

  function toggleTag(tagId: string) {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login?redirect=/ideas/new");
      return;
    }

    // Server-side validation
    if (title.trim().length < 3 || title.length > 200) {
      setError("Der Titel muss zwischen 3 und 200 Zeichen lang sein.");
      setLoading(false);
      return;
    }
    if (summary.trim().length < 10 || summary.length > 500) {
      setError("Die Kurzbeschreibung muss zwischen 10 und 500 Zeichen lang sein.");
      setLoading(false);
      return;
    }
    if (description.trim().length < 20 || description.length > 10000) {
      setError("Die Beschreibung muss zwischen 20 und 10.000 Zeichen lang sein.");
      setLoading(false);
      return;
    }
    if (problem.trim().length < 10 || problem.length > 5000) {
      setError("Das Problem muss zwischen 10 und 5.000 Zeichen lang sein.");
      setLoading(false);
      return;
    }
    if (solution.trim().length < 10 || solution.length > 5000) {
      setError("Die Lösung muss zwischen 10 und 5.000 Zeichen lang sein.");
      setLoading(false);
      return;
    }
    if (targetAudience.trim().length < 5 || targetAudience.length > 2000) {
      setError("Die Zielgruppe muss zwischen 5 und 2.000 Zeichen lang sein.");
      setLoading(false);
      return;
    }

    const slug = slugify(title) + "-" + Date.now().toString(36);

    const { data: idea, error: ideaError } = await supabase
      .from("ideas")
      .insert({
        author_id: user.id,
        title,
        slug,
        summary,
        description,
        problem,
        solution,
        target_audience: targetAudience,
        category,
        self_implement: selfImplement,
        looking_for: lookingFor,
        mvp_budget: mvpBudget,
        not_self_reason: notSelfReason,
      })
      .select()
      .single();

    if (ideaError) {
      setError("Beim Erstellen der Idee ist ein Fehler aufgetreten. Bitte versuche es erneut.");
      setLoading(false);
      return;
    }

    // Add tags
    if (selectedTags.length > 0) {
      await supabase.from("idea_tags").insert(
        selectedTags.map((tagId) => ({
          idea_id: idea.id,
          tag_id: tagId,
        }))
      );
    }

    router.push(`/ideas/${idea.id}`);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Link
        href="/ideas"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Zurück zu Ideen
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <Lightbulb className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Idee pitchen</h1>
          <p className="text-sm text-muted-foreground">
            Teile deine Geschäftsidee mit der Welt
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
            placeholder="z.B. KI-gestützter Lernassistent für Studenten"
            required
            maxLength={200}
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Summary */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Kurzbeschreibung <span className="text-red-500">*</span>
          </label>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Eine kurze Zusammenfassung deiner Idee in 1-2 Sätzen"
            required
            rows={2}
            maxLength={500}
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
          />
        </div>

        {/* Problem */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Problem <span className="text-red-500">*</span>
          </label>
          <textarea
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            placeholder="Welches Problem löst deine Idee? Warum ist das wichtig?"
            required
            rows={3}
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
          />
        </div>

        {/* Solution */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Lösung <span className="text-red-500">*</span>
          </label>
          <textarea
            value={solution}
            onChange={(e) => setSolution(e.target.value)}
            placeholder="Wie löst deine Idee das Problem? Was ist der Ansatz?"
            required
            rows={3}
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
          />
        </div>

        {/* Detailed Description */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Detaillierte Beschreibung <span className="text-red-500">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Beschreibe deine Idee im Detail. Features, Monetarisierung, technische Umsetzung..."
            required
            rows={6}
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
          />
        </div>

        {/* Target Audience */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Zielgruppe <span className="text-red-500">*</span>
          </label>
          <textarea
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
            placeholder="Wer sind die Nutzer? Für wen ist das Produkt gedacht?"
            required
            rows={2}
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium mb-1">Kategorie</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Self Implement Toggle */}
        <div className="rounded-xl border border-border p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium">
                Möchte ich die Idee selbst umsetzen?
              </label>
              <p className="text-xs text-muted-foreground mt-0.5">
                Suchst du aktiv nach Mitgründern oder Investoren?
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSelfImplement(!selfImplement)}
              className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors cursor-pointer ${
                selfImplement ? "bg-primary" : "bg-muted-foreground/30"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform ${
                  selfImplement ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {selfImplement ? (
            <>
              {/* Looking for */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Was suchst du? <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={lookingFor}
                  onChange={(e) => setLookingFor(e.target.value)}
                  placeholder="z.B. Einen technischen Mitgründer (CTO), Investor für die Seed-Runde, Designer für das MVP..."
                  required={selfImplement}
                  rows={3}
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                />
              </div>

              {/* MVP Budget */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Geschätztes Budget für MVP
                </label>
                <select
                  value={mvpBudget}
                  onChange={(e) => setMvpBudget(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
                >
                  <option value="">Keine Angabe</option>
                  <option value="0-1k">0 - 1.000 €</option>
                  <option value="1k-5k">1.000 - 5.000 €</option>
                  <option value="5k-15k">5.000 - 15.000 €</option>
                  <option value="15k-50k">15.000 - 50.000 €</option>
                  <option value="50k-100k">50.000 - 100.000 €</option>
                  <option value="100k+">100.000 € +</option>
                </select>
              </div>
            </>
          ) : (
            <div>
              <label className="block text-sm font-medium mb-1">
                Warum möchtest du es nicht selbst umsetzen?
              </label>
              <textarea
                value={notSelfReason}
                onChange={(e) => setNotSelfReason(e.target.value)}
                placeholder="z.B. Keine Zeit, fehlendes technisches Know-How, andere Prioritäten..."
                rows={2}
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              />
            </div>
          )}
        </div>

        {/* Tags */}
        {allTags.length > 0 && (
          <div>
            <label className="block text-sm font-medium mb-2">Tags</label>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                    selectedTags.includes(tag.id)
                      ? "ring-2 ring-offset-1"
                      : "opacity-60 hover:opacity-100"
                  }`}
                  style={{
                    backgroundColor: tag.color + "20",
                    color: tag.color,
                    ...(selectedTags.includes(tag.id)
                      ? { ringColor: tag.color }
                      : {}),
                  }}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="flex gap-3 pt-4 border-t border-border">
          <Link
            href="/ideas"
            className="rounded-lg border border-border px-6 py-2.5 text-sm font-medium hover:bg-muted transition-colors"
          >
            Abbrechen
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 rounded-lg bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {loading ? "Wird veröffentlicht..." : "Idee veröffentlichen"}
          </button>
        </div>
      </form>
    </div>
  );
}
