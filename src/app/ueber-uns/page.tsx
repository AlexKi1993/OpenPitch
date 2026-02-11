import { Lightbulb, Heart, Code, Globe, Rocket, Users } from "lucide-react";
import Link from "next/link";

export default function UeberUnsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold mb-2">Über OpenPitch</h1>
      <p className="text-muted-foreground mb-10">
        Die Geschichte hinter der Plattform
      </p>

      {/* Origin Story */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Wie alles begann</h2>
        <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
          <p>
            Kennst du das? Du liegst abends im Bett und plötzlich hast du
            eine geniale Geschäftsidee. Du denkst sie durch, bist begeistert
            - und am nächsten Morgen verschwindet sie wieder im Alltag. Keine
            Zeit, kein Team, kein Kapital. Die Idee stirbt leise in deinem
            Kopf.
          </p>
          <p>
            Genau so ging es mir immer wieder. Dutzende Ideen, die nie das
            Licht der Welt erblickt haben. Irgendwann dachte ich: Was wenn
            es einen Ort gäbe, wo man diese Ideen einfach raushauen kann?
            Wo andere Menschen sie finden und umsetzen können? Wie GitHub,
            aber für Startup-Ideen statt Code.
          </p>
          <p>
            So entstand OpenPitch. Eine einfache Plattform mit einem
            einfachen Ziel: Keine Idee soll mehr verloren gehen.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="mb-10 rounded-xl border-2 border-primary/20 bg-primary/5 p-6">
        <div className="flex items-center gap-2 mb-3">
          <Rocket className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-semibold">Unsere Mission</h2>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Wir glauben, dass die besten Ideen nicht in den Köpfen Einzelner
          eingesperrt bleiben sollten. OpenPitch verbindet Ideengeber mit
          Umsetzern. Menschen die Visionen haben mit Menschen die sie
          Wirklichkeit werden lassen können. Kostenlos, offen und für
          alle.
        </p>
      </section>

      {/* Values */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Wofür wir stehen</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border p-5">
            <Heart className="h-6 w-6 text-red-500 mb-2" />
            <h3 className="font-medium mb-1">100% Non-Profit</h3>
            <p className="text-xs text-muted-foreground">
              Kein Geschäftsmodell, keine Werbung, keine Investoren.
              OpenPitch gehört niemandem und allen gleichzeitig.
            </p>
          </div>
          <div className="rounded-xl border border-border p-5">
            <Code className="h-6 w-6 text-primary mb-2" />
            <h3 className="font-medium mb-1">Open Source</h3>
            <p className="text-xs text-muted-foreground">
              Der gesamte Code liegt offen auf GitHub. Transparenz ist
              kein Feature, sondern unsere Grundlage.
            </p>
          </div>
          <div className="rounded-xl border border-border p-5">
            <Globe className="h-6 w-6 text-green-500 mb-2" />
            <h3 className="font-medium mb-1">Für alle</h3>
            <p className="text-xs text-muted-foreground">
              Egal ob 16 oder 60, Student oder CEO - jede Idee zählt und
              jeder Mensch kann hier beitragen.
            </p>
          </div>
          <div className="rounded-xl border border-border p-5">
            <Users className="h-6 w-6 text-blue-500 mb-2" />
            <h3 className="font-medium mb-1">Community First</h3>
            <p className="text-xs text-muted-foreground">
              Die Community entscheidet was gut ist. Durch Votes,
              Kommentare und Kollaboration entstehen die besten Projekte.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-xl bg-muted/50 border border-border p-8 text-center">
        <Lightbulb className="mx-auto h-8 w-8 text-primary mb-3" />
        <h2 className="text-lg font-semibold mb-2">Mach mit!</h2>
        <p className="text-sm text-muted-foreground mb-4">
          OpenPitch lebt von der Community. Ob du eine Idee hast, eine
          umsetzen willst oder einfach nur voten und kommentieren möchtest
          - jeder Beitrag zählt.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/register"
            className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-dark transition-colors"
          >
            Kostenlos registrieren
          </Link>
          <a
            href="https://github.com/AlexKi1993/OpenPitch"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-border px-6 py-2.5 text-sm font-medium hover:bg-muted transition-colors"
          >
            Code auf GitHub
          </a>
        </div>
      </section>
    </div>
  );
}
