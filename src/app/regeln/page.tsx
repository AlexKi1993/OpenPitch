import { ShieldCheck, Ban, AlertTriangle, Heart } from "lucide-react";

export default function RegelnPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold mb-2">Nutzungsregeln</h1>
      <p className="text-muted-foreground mb-8">
        Damit OpenPitch ein sicherer und seriöser Ort für Geschäftsideen
        bleibt, gelten folgende Regeln.
      </p>

      {/* Erlaubt */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck className="h-6 w-6 text-green-500" />
          <h2 className="text-xl font-semibold">Was erlaubt ist</h2>
        </div>
        <ul className="space-y-3 text-sm text-muted-foreground">
          <li className="flex gap-2">
            <span className="text-green-500 font-bold">+</span>
            Seriöse Geschäftsideen aller Art (SaaS, Apps, Hardware, Social
            Impact, etc.)
          </li>
          <li className="flex gap-2">
            <span className="text-green-500 font-bold">+</span>
            Konstruktive Kritik und Feedback in den Kommentaren
          </li>
          <li className="flex gap-2">
            <span className="text-green-500 font-bold">+</span>
            Sich als Umsetzer bewerben und Teams bilden
          </li>
          <li className="flex gap-2">
            <span className="text-green-500 font-bold">+</span>
            Ideen frei übernehmen und umsetzen (wenn als &quot;Freie Idee&quot;
            markiert)
          </li>
          <li className="flex gap-2">
            <span className="text-green-500 font-bold">+</span>
            Mehrere Ideen posten
          </li>
        </ul>
      </section>

      {/* Verboten */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Ban className="h-6 w-6 text-red-500" />
          <h2 className="text-xl font-semibold">Was verboten ist</h2>
        </div>
        <ul className="space-y-3 text-sm text-muted-foreground">
          <li className="flex gap-2">
            <span className="text-red-500 font-bold">&times;</span>
            <div>
              <strong>Krypto-Spam & Token-Projekte</strong> – Keine Shitcoins,
              keine Token-Sales, keine &quot;Next Bitcoin&quot;-Ideen. Wer Krypto-Spam
              postet wird sofort und ohne Warnung gelöscht.
            </div>
          </li>
          <li className="flex gap-2">
            <span className="text-red-500 font-bold">&times;</span>
            <div>
              <strong>MLM / Network Marketing / Pyramidensysteme</strong> –
              Keinerlei Schneeballsysteme oder &quot;Werde dein eigener Boss&quot;-Schemes.
            </div>
          </li>
          <li className="flex gap-2">
            <span className="text-red-500 font-bold">&times;</span>
            <div>
              <strong>Spam & Werbung</strong> – Keine Eigenwerbung für
              bestehende Produkte, keine Affiliate-Links, kein SEO-Spam.
            </div>
          </li>
          <li className="flex gap-2">
            <span className="text-red-500 font-bold">&times;</span>
            <div>
              <strong>Illegale Inhalte</strong> – Nichts was gegen geltendes
              Recht verstößt.
            </div>
          </li>
          <li className="flex gap-2">
            <span className="text-red-500 font-bold">&times;</span>
            <div>
              <strong>Beleidigungen & Hate Speech</strong> – Respektvoller
              Umgang ist Pflicht. Konstruktive Kritik ist willkommen,
              persönliche Angriffe nicht.
            </div>
          </li>
          <li className="flex gap-2">
            <span className="text-red-500 font-bold">&times;</span>
            <div>
              <strong>Fake-Accounts & Manipulation</strong> – Keine
              Mehrfach-Accounts zum Voten, kein Vote-Farming.
            </div>
          </li>
          <li className="flex gap-2">
            <span className="text-red-500 font-bold">&times;</span>
            <div>
              <strong>Copy-Paste Ideen ohne Mehrwert</strong> – &quot;Uber aber für
              X&quot; ohne jegliche Ausarbeitung wird entfernt.
            </div>
          </li>
        </ul>
      </section>

      {/* Konsequenzen */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="h-6 w-6 text-amber-500" />
          <h2 className="text-xl font-semibold">Konsequenzen</h2>
        </div>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            <strong>Erste Warnung:</strong> Beitrag wird entfernt, Nutzer wird
            benachrichtigt.
          </p>
          <p>
            <strong>Wiederholungsfall:</strong> Account wird dauerhaft gesperrt.
          </p>
          <p>
            <strong>Krypto-Spam, MLM, illegale Inhalte:</strong> Sofortige
            Löschung ohne Vorwarnung. Null Toleranz.
          </p>
        </div>
      </section>

      {/* Melden */}
      <section className="rounded-xl border-2 border-primary/20 bg-primary/5 p-6">
        <div className="flex items-center gap-2 mb-3">
          <Heart className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Hilf uns, OpenPitch sauber zu halten</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Wenn dir ein Beitrag auffällt, der gegen diese Regeln verstößt,
          melde ihn bitte per Email an{" "}
          <a
            href="mailto:info@openpitch.eu"
            className="text-primary font-medium hover:underline"
          >
            info@openpitch.eu
          </a>
          . Wir kümmern uns schnellstmöglich darum. Danke, dass du
          OpenPitch zu einem besseren Ort machst!
        </p>
      </section>
    </div>
  );
}
