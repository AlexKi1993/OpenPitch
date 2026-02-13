"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Lightbulb, Heart, Flame } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();
  const isManifestPage = pathname === "/manifest";

  return (
    <footer className="border-t border-border bg-muted/50">
      {/* Manifest Teaser — nicht auf der Manifest-Seite selbst */}
      {!isManifestPage && <div className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
            <Flame className="h-8 w-8 text-primary mb-3" />
            <blockquote className="text-lg sm:text-xl font-semibold leading-snug">
              &ldquo;Bauen ist wichtiger als Planen. Kollaboration ist wichtiger
              als Konkurrenz. Machen ist wichtiger als Reden.&rdquo;
            </blockquote>
            <p className="mt-3 text-sm text-muted-foreground">
              Wir glauben, dass gute Ideen der Welt gehören &ndash; nicht der
              Bürokratie.
            </p>
            <Link
              href="/manifest"
              className="mt-4 inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-5 py-2 text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
            >
              <Flame className="h-4 w-4" />
              Unser Manifest lesen
            </Link>
          </div>
        </div>
      </div>}

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 font-bold text-lg">
              <Lightbulb className="h-5 w-5 text-primary" />
              <span>Open<span className="text-primary">Pitch</span></span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              Die Open-Source-Plattform für Geschäftsideen. Teile deine Ideen
              mit der Welt und hilf anderen, sie umzusetzen.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-3">Plattform</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/ideas" className="hover:text-foreground transition-colors">
                  Ideen entdecken
                </Link>
              </li>
              <li>
                <Link href="/ideas/new" className="hover:text-foreground transition-colors">
                  Idee pitchen
                </Link>
              </li>
              <li>
                <Link href="/stories" className="hover:text-foreground transition-colors">
                  Storyboard
                </Link>
              </li>
              <li>
                <Link href="/lessons" className="hover:text-foreground transition-colors">
                  Lessons
                </Link>
              </li>
              <li>
                <Link href="/ueber-uns" className="hover:text-foreground transition-colors">
                  Über uns
                </Link>
              </li>
              <li>
                <Link href="/manifest" className="hover:text-foreground transition-colors">
                  Manifest
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-foreground transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/regeln" className="hover:text-foreground transition-colors">
                  Nutzungsregeln
                </Link>
              </li>
            </ul>
          </div>

          {/* Rechtliches */}
          <div>
            <h3 className="font-semibold mb-3">Rechtliches</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/impressum" className="hover:text-foreground transition-colors">
                  Impressum
                </Link>
              </li>
              <li>
                <Link href="/datenschutz" className="hover:text-foreground transition-colors">
                  Datenschutzerklärung
                </Link>
              </li>
              <li>Made with <Heart className="inline h-3 w-3 text-red-500" /> for Founders</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} OpenPitch. Keine Rechte vorbehalten. Frei für alle.</p>
        </div>
      </div>
    </footer>
  );
}
