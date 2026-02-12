export default function ImpressumPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold mb-8">Impressum</h1>

      <div className="prose prose-sm max-w-none space-y-6 text-muted-foreground">
        <section>
          <h2 className="text-lg font-semibold text-foreground">
            Angaben gemäß § 5 DDG
          </h2>
          <p>
            Alexander Kirchner
            <br />
            Binsenhohlstraße 7
            <br />
            76891 Erlenbach bei Dahn
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">Kontakt</h2>
          <p>
            Telefon: +49 178 333 8650
            <br />
            E-Mail: info@openpitch.eu
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            Hinweis zur Plattform
          </h2>
          <p>
            OpenPitch ist ein nicht-kommerzielles, gemeinnütziges Open-Source-Projekt.
            Es werden keine Einnahmen erzielt und es besteht kein Geschäftsmodell.
            Die Plattform dient ausschließlich dem Zweck, Geschäftsideen frei
            zugänglich zu teilen.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            Haftung für Inhalte
          </h2>
          <p>
            Als Diensteanbieter sind wir gemäß § 7 Abs.1 DDG für eigene Inhalte
            auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach
            §§ 8 bis 10 DDG sind wir als Diensteanbieter jedoch nicht
            verpflichtet, übermittelte oder gespeicherte fremde Informationen zu
            überwachen oder nach Umständen zu forschen, die auf eine
            rechtswidrige Tätigkeit hinweisen.
          </p>
          <p>
            Verpflichtungen zur Entfernung oder Sperrung der Nutzung von
            Informationen nach den allgemeinen Gesetzen bleiben hiervon
            unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem
            Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei
            Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese
            Inhalte umgehend entfernen.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            Haftung für Links
          </h2>
          <p>
            Unser Angebot enthält Links zu externen Websites Dritter, auf deren
            Inhalte wir keinen Einfluss haben. Deshalb können wir für diese
            fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der
            verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber
            der Seiten verantwortlich.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">Urheberrecht</h2>
          <p>
            Die durch die Seitenbetreiber erstellten Inhalte und Werke auf
            diesen Seiten unterliegen dem deutschen Urheberrecht. Der
            Quellcode der Plattform ist Open Source und frei verfügbar.
            Die von Nutzern eingestellten Ideen und Inhalte unterliegen den
            jeweiligen Rechten ihrer Verfasser.
          </p>
        </section>
      </div>
    </div>
  );
}
