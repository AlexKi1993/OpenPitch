import Link from "next/link";
import {
  Lightbulb,
  Users,
  Rocket,
  ArrowRight,
  Heart,
  Globe,
  Code,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import IdeaCard from "@/components/IdeaCard";
import StoryCard from "@/components/StoryCard";

export default async function Home() {
  const supabase = await createClient();

  const { data: ideas } = await supabase
    .from("ideas")
    .select("*, author:profiles(*), images:idea_images(*)")
    .order("created_at", { ascending: false })
    .limit(6);

  const { count: ideaCount } = await supabase
    .from("ideas")
    .select("*", { count: "exact", head: true });

  const { count: userCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  const { data: stories } = await supabase
    .from("stories")
    .select("*, author:profiles(*)")
    .order("created_at", { ascending: false })
    .limit(4);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Heart className="h-4 w-4" />
              100% Non-Profit & Open Source
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Deine Idee verdient es,
              <br />
              <span className="text-primary">umgesetzt zu werden</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Du hast eine geniale Geschäftsidee, aber keine Zeit oder
              Ressourcen sie umzusetzen? Pitche sie hier und finde Menschen, die
              sie zum Leben erwecken.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/ideas"
                className="flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-primary/25 hover:bg-primary-dark transition-all hover:shadow-xl hover:shadow-primary/30"
              >
                Ideen entdecken
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/register"
                className="flex items-center gap-2 rounded-xl border-2 border-border px-8 py-3.5 text-base font-semibold hover:border-primary hover:text-primary transition-colors"
              >
                Kostenlos mitmachen
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary">
                {ideaCount || 0}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">Ideen gepitcht</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">
                {userCount || 0}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">Mitglieder</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">100%</div>
              <div className="mt-1 text-sm text-muted-foreground">Kostenlos</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold">So funktioniert&apos;s</h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground">
          In drei einfachen Schritten von der Idee zur Umsetzung
        </p>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <Lightbulb className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">1. Idee pitchen</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Beschreibe deine Geschäftsidee: das Problem, die Lösung und die
              Zielgruppe. Je detaillierter, desto besser.
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">
              2. Community entdeckt
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Andere Mitglieder entdecken deine Idee, voten dafür und
              diskutieren in den Kommentaren.
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <Rocket className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">3. Team bilden</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Motivierte Umsetzer bewerben sich und bilden Teams, um die Idee
              gemeinsam Wirklichkeit werden zu lassen.
            </p>
          </div>
        </div>
      </section>

      {/* Latest Ideas */}
      {ideas && ideas.length > 0 && (
        <section className="border-t border-border bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Neueste Ideen</h2>
              <Link
                href="/ideas"
                className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                Alle anzeigen
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {ideas.map((idea) => (
                <IdeaCard key={idea.id} idea={idea} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Stories */}
      {stories && stories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Neueste Stories</h2>
            <Link
              href="/stories"
              className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              Alle anzeigen
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {stories.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        </section>
      )}

      {/* Values */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold">Unsere Werte</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-border p-6">
            <Heart className="h-8 w-8 text-red-500 mb-3" />
            <h3 className="font-semibold">Non-Profit</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              OpenPitch ist und bleibt kostenlos. Kein Geschäftsmodell, keine
              Werbung, keine versteckten Kosten.
            </p>
          </div>
          <div className="rounded-xl border border-border p-6">
            <Code className="h-8 w-8 text-primary mb-3" />
            <h3 className="font-semibold">Open Source</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Der gesamte Code ist offen. Jeder kann beitragen, verbessern und
              die Plattform mitgestalten.
            </p>
          </div>
          <div className="rounded-xl border border-border p-6">
            <Globe className="h-8 w-8 text-green-500 mb-3" />
            <h3 className="font-semibold">Für alle</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Egal ob Schüler, Student oder erfahrener Unternehmer - jede Idee
              verdient eine Chance.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold">
            Bereit, deine Idee zu pitchen?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            Es kostet nichts, ist anonym möglich und könnte die Welt verändern.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-primary/25 hover:bg-primary-dark transition-all"
          >
            Jetzt loslegen
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
