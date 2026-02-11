"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Was ist OpenPitch?",
    answer:
      "OpenPitch ist eine kostenlose, non-profit Plattform, auf der du Geschäftsideen veröffentlichen kannst. Egal ob du die Idee selbst umsetzen willst und Mitgründer suchst, oder ob du die Idee einfach mit der Welt teilen möchtest - hier ist der richtige Ort dafür.",
  },
  {
    question: "Kostet OpenPitch etwas?",
    answer:
      "Nein, OpenPitch ist und bleibt 100% kostenlos. Es gibt kein Geschäftsmodell, keine Werbung, keine Premium-Features und keine versteckten Kosten. Die Plattform wird ehrenamtlich betrieben.",
  },
  {
    question: "Kann jemand meine Idee klauen?",
    answer:
      "Ideen an sich sind nicht schützbar - die Umsetzung macht den Unterschied. OpenPitch basiert auf dem Gedanken, dass geteilte Ideen mehr Wert schaffen als geheime. Wenn du eine Idee hier postest, gibst du sie bewusst frei. Wenn du eine Idee selbst umsetzen willst und nur Unterstützung suchst, markiere sie entsprechend.",
  },
  {
    question: "Wer darf Ideen posten?",
    answer:
      "Jeder mit einem Account kann Ideen posten. Wir bitten jedoch darum, nur seriöse Geschäftsideen zu veröffentlichen. Spam, Krypto-Scams, MLM-Systeme und unseriöse Inhalte werden sofort gelöscht. Details findest du in unseren Nutzungsregeln.",
  },
  {
    question: "Wie funktioniert das Voting?",
    answer:
      "Jedes Mitglied kann pro Idee einmal voten. Je mehr Votes eine Idee bekommt, desto höher wird sie gerankt. So steigen die besten Ideen automatisch nach oben.",
  },
  {
    question: "Was bedeutet \"Ich will das umsetzen\"?",
    answer:
      "Wenn dich eine Idee begeistert und du sie umsetzen möchtest, kannst du dich als Umsetzer bewerben. Du gibst an, welche Rolle du übernehmen willst (Developer, Designer, Marketing etc.) und schreibst eine kurze Nachricht an den Ideengeber. Dieser kann dann entscheiden, ob er mit dir zusammenarbeiten möchte.",
  },
  {
    question: "Ist OpenPitch Open Source?",
    answer:
      "Ja! Der gesamte Code ist öffentlich auf GitHub verfügbar. Jeder kann beitragen, Bugs melden oder neue Features vorschlagen. Wir glauben an Transparenz und Community-Driven Development.",
  },
  {
    question: "Wie kann ich OpenPitch unterstützen?",
    answer:
      "Die beste Unterstützung ist, die Plattform zu nutzen und sie weiterzuempfehlen. Wenn du Developer bist, freuen wir uns über Beiträge auf GitHub. Da wir non-profit sind, nehmen wir keine Spenden an.",
  },
];

function FaqItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-border">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-5 text-left"
      >
        <span className="text-base font-medium pr-4">{question}</span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <p className="pb-5 text-sm text-muted-foreground leading-relaxed">
          {answer}
        </p>
      )}
    </div>
  );
}

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold mb-2">Häufige Fragen (FAQ)</h1>
      <p className="text-muted-foreground mb-8">
        Alles was du über OpenPitch wissen musst
      </p>

      <div>
        {faqs.map((faq, i) => (
          <FaqItem key={i} question={faq.question} answer={faq.answer} />
        ))}
      </div>

      <div className="mt-10 rounded-xl bg-muted/50 border border-border p-6 text-center">
        <p className="text-sm text-muted-foreground">
          Noch Fragen? Schreib uns an{" "}
          <a
            href="mailto:info@openpitch.eu"
            className="text-primary font-medium hover:underline"
          >
            info@openpitch.eu
          </a>
        </p>
      </div>
    </div>
  );
}
