import Link from "next/link";
import {
  Flame,
  Cpu,
  AlertTriangle,
  Lightbulb,
  HeartHandshake,
  Rocket,
  ArrowLeft,
} from "lucide-react";

export default function ManifestPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Zurück zur Startseite
      </Link>

      {/* Hero */}
      <div className="mb-12 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <Flame className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">
          Das OpenPitch Manifest
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Warum OpenPitch existiert
        </p>
      </div>

      {/* Das Problem */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">
          Das Problem, das niemand laut ausspricht
        </h2>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            Stell dir vor, du hast eine Idee. Eine echte Idee. Eine, die Dinge
            verändern könnte.
          </p>
          <p>
            Du erzählst sie deinen Freunden. Die nicken. Sagen:{" "}
            <em>&ldquo;Interessant.&rdquo;</em>
            <br />
            Du erzählst es deiner Familie. Die sagen:{" "}
            <em>&ldquo;Aber ist das nicht riskant?&rdquo;</em>
            <br />
            Du gehst zu deinem Chef. Der sagt:{" "}
            <em>&ldquo;Interessant &ndash; aber erstmal abklären.&rdquo;</em>
          </p>
          <p>Und genau hier passiert das, was in Deutschland passiert:</p>
          <div className="rounded-xl border-l-4 border-primary bg-muted/50 p-5 space-y-1 text-foreground font-medium">
            <p>
              Aus &ldquo;interessant&rdquo; wird &ldquo;kompliziert&rdquo;.
            </p>
            <p>
              Aus &ldquo;probieren wir es&rdquo; wird &ldquo;müssen wir erst
              klären&rdquo;.
            </p>
            <p>
              Aus &ldquo;machen wir es&rdquo; wird &ldquo;dafür brauchen wir
              eine Genehmigung&rdquo;.
            </p>
          </div>
          <p>
            Nicht, weil irgendjemand böswillig ist. Sondern weil das{" "}
            <strong>das deutsche Betriebssystem</strong> ist.
          </p>
        </div>
      </section>

      {/* Das deutsche Betriebssystem */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <Cpu className="h-6 w-6 text-muted-foreground" />
          <h2 className="text-2xl font-bold">
            Was das deutsche Betriebssystem macht
          </h2>
        </div>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            Deutschland hat ein Betriebssystem. Und dieses Betriebssystem ist
            darauf ausgelegt:
          </p>
          <ol className="list-decimal list-inside space-y-2 pl-2">
            <li>
              <strong className="text-foreground">Probleme zu analysieren</strong>{" "}
              &ndash; Wir können Probleme zerlegen wie niemand sonst
            </li>
            <li>
              <strong className="text-foreground">Sie zu definieren</strong>{" "}
              &ndash; Wir finden für alles den richtigen Begriff
            </li>
            <li>
              <strong className="text-foreground">Sie zu regulieren</strong>{" "}
              &ndash; Wir haben Regeln für fast alles
            </li>
          </ol>
          <p>
            Das ist nicht schlecht. Es hat uns Wohlstand, Stabilität und
            Sicherheit gebracht.
          </p>
          <p>
            Aber dieses Betriebssystem hat einen{" "}
            <strong>eingebauten Fehler</strong>: Es kann{" "}
            <strong>dynamische Probleme nicht gut lösen</strong>.
          </p>
          <p>
            Weil dynamische Probleme Bewegung brauchen. Iterationen. Schnelles
            Scheitern und schnelles Lernen. &ldquo;Probieren wir es&rdquo; statt
            &ldquo;Definieren wir es erstmal&rdquo;.
          </p>
        </div>
      </section>

      {/* Das Problem mit "erst klären" */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="h-6 w-6 text-yellow-500" />
          <h2 className="text-2xl font-bold">
            Das Problem mit &ldquo;erst klären&rdquo;
          </h2>
        </div>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>Kennst du das Gefühl?</p>
          <p>
            Du willst etwas machen. Etwas Neues. Etwas, das es so noch nicht
            gibt.
          </p>
          <div className="rounded-xl bg-muted/50 border border-border p-5 space-y-1 text-sm italic">
            <p>&ldquo;Ja, aber hast du das schon bedacht?&rdquo;</p>
            <p>&ldquo;Ja, aber gibt es dafür nicht eine Richtlinie?&rdquo;</p>
            <p>
              &ldquo;Ja, aber wer haftet, wenn etwas schiefgeht?&rdquo;
            </p>
            <p>
              &ldquo;Ja, aber erstmal brauchen wir einen Workshop.&rdquo;
            </p>
          </div>
          <p>
            Workshop. Analyse. Pilotprojekt. Evaluierung. Noch ein Workshop.
            Noch eine Analyse.
          </p>
          <p className="text-foreground font-semibold">Das ist das Problem.</p>
          <p>
            Wir versuchen,{" "}
            <strong>
              dynamische Probleme mit statischen Werkzeugen
            </strong>{" "}
            zu lösen.
          </p>
        </div>
      </section>

      {/* Was OpenPitch ist */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <Lightbulb className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Was OpenPitch ist</h2>
        </div>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>OpenPitch ist unsere Antwort darauf.</p>
          <p>
            Wir sind keine Firma. Wir sind keine Organisation.
            <br />
            Wir sind ein <strong>Gegen-Narrativ</strong>.
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-5">
            <p className="font-bold text-foreground mb-1">
              Bauen &gt; Planen
            </p>
            <p className="text-sm text-muted-foreground">
              Ein Prototyp ist lauter als ein Konzept. Ein Experiment sagt mehr
              als zehn Analysen.
            </p>
          </div>
          <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-5">
            <p className="font-bold text-foreground mb-1">
              Kollaboration &gt; Konkurrenz
            </p>
            <p className="text-sm text-muted-foreground">
              Gute Ideen gehören der Welt. Nicht einem Menschen im Kopf.
            </p>
          </div>
          <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-5">
            <p className="font-bold text-foreground mb-1">
              Iteration &gt; Perfektion
            </p>
            <p className="text-sm text-muted-foreground">
              Fertig ist besser als perfekt. Scheitern ist Lernen. Lernen ist
              Fortschritt.
            </p>
          </div>
          <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-5">
            <p className="font-bold text-foreground mb-1">
              Machen &gt; Reden
            </p>
            <p className="text-sm text-muted-foreground">
              Tausend Experimente sind wertvoller als eine perfekte
              Präsentation.
            </p>
          </div>
        </div>
      </section>

      {/* Was OpenPitch macht */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <Rocket className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Was OpenPitch macht</h2>
        </div>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            OpenPitch ist ein Ort für Ideen. Nicht um sie wegzusperren. Sondern
            um sie <strong>wandern</strong> zu lassen.
          </p>
          <div className="rounded-xl bg-muted/50 border border-border p-5 space-y-3">
            <p>
              Du hast eine Idee? <strong className="text-foreground">Pitch sie.</strong>
            </p>
            <p>
              Jemand anderes findet sie cool?{" "}
              <strong className="text-foreground">Die Person kann sie weiterdenken.</strong>
            </p>
            <p>
              Ihr zusammen baut etwas?{" "}
              <strong className="text-foreground">Genau darum geht es.</strong>
            </p>
          </div>
          <p className="font-medium text-foreground">
            Aus &ldquo;ich hab da mal eine Idee&rdquo; wird &ldquo;wir haben
            das zusammen gebaut&rdquo;.
          </p>
        </div>
      </section>

      {/* Warum das wichtig ist */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Warum das wichtig ist</h2>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p className="text-lg font-medium text-foreground">
            Weil in Deutschland Millionen von Ideen sterben.
          </p>
          <p>
            Nicht weil sie schlecht sind.
            <br />
            Nicht weil die Menschen faul sind.
            <br />
            Sondern weil das System sie nicht zulässt.
          </p>
          <div className="rounded-xl border-l-4 border-red-400 bg-red-50 dark:bg-red-950/20 p-5 space-y-1">
            <p>Das System sagt: &ldquo;Erst klären.&rdquo;</p>
            <p>Das System sagt: &ldquo;Erst definieren.&rdquo;</p>
            <p>
              Das System sagt: &ldquo;Erst eine Genehmigung holen.&rdquo;
            </p>
          </div>
          <p>
            Und am Ende stirbt die Idee. Mit dem Menschen, der sie hatte.
          </p>
          <p className="text-xl font-bold text-foreground">
            OpenPitch sagt: Nein.
          </p>
          <p>
            Die Idee gehört nicht dem System.
            <br />
            Die Idee gehört nicht der Bürokratie.
            <br />
            <strong>Die Idee gehört der Welt.</strong>
          </p>
        </div>
      </section>

      {/* Unser Versprechen */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <HeartHandshake className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Unser Versprechen</h2>
        </div>
        <ul className="space-y-3">
          {[
            "Wir werden deine Idee nicht begraben.",
            "Wir werden sie sichtbar machen.",
            "Wir werden Menschen verbinden, die sie weiterdenken können.",
            "Wir werden niemals Geld damit verdienen (wir sind Non-Profit).",
            "Wir werden sie niemals besitzen (sie bleibt bei dir).",
          ].map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 rounded-lg border border-border p-3"
            >
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">
                &#10003;
              </span>
              <span className="text-sm text-muted-foreground">{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Der Aufruf */}
      <section className="rounded-2xl border-2 border-primary/30 bg-primary/5 p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Der Aufruf</h2>
        <div className="space-y-4 text-muted-foreground leading-relaxed max-w-xl mx-auto">
          <p>
            Deutschland braucht ein neues Betriebssystem. Nicht gegen das alte.{" "}
            <strong className="text-foreground">Neben das alte.</strong>
          </p>
          <p>
            Denn manche Probleme brauchen Regeln.
            <br />
            Und manche brauchen Bewegung.
          </p>
          <p className="text-foreground font-medium">
            OpenPitch ist für die, die Bewegung wollen.
          </p>
          <p className="text-xl font-bold text-foreground pt-2">
            Pitch deine Idee. Finde Menschen. Baue zusammen.
          </p>
          <p className="text-sm italic">
            Denn gute Ideen gehören der Welt. Nicht nur dir.
          </p>
        </div>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/ideas/new"
            className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-dark transition-colors"
          >
            Jetzt Idee pitchen
          </Link>
          <Link
            href="/register"
            className="rounded-lg border border-border px-6 py-2.5 text-sm font-medium hover:bg-muted transition-colors"
          >
            Kostenlos registrieren
          </Link>
        </div>
        <p className="mt-6 text-xs text-muted-foreground italic">
          OpenPitch &ndash; Ideas for Everyone
        </p>
      </section>
    </div>
  );
}
