export default function DatenschutzPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold mb-8">Datenschutzerklärung</h1>

      <div className="prose prose-sm max-w-none space-y-6 text-muted-foreground">
        <section>
          <h2 className="text-lg font-semibold text-foreground">
            1. Verantwortlicher
          </h2>
          <p>
            Alexander Kirchner
            <br />
            Binsenhohlstraße 7
            <br />
            76891 Erlenbach bei Dahn
            <br />
            E-Mail: alex@makeit4u.de
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            2. Übersicht der Verarbeitungen
          </h2>
          <p>
            Diese Datenschutzerklärung informiert über die Art, den Umfang und
            die Zwecke der Erhebung und Verwendung personenbezogener Daten auf
            der Plattform OpenPitch (openpitch.eu).
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            3. Erhobene Daten
          </h2>
          <p>Wir erheben folgende Daten:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>Registrierungsdaten:</strong> E-Mail-Adresse und Passwort
              (verschlüsselt gespeichert) bei der Kontoerstellung.
            </li>
            <li>
              <strong>Profildaten:</strong> Name, Bio, Website, Skills – diese
              Angaben sind freiwillig und öffentlich sichtbar.
            </li>
            <li>
              <strong>Nutzungsdaten:</strong> Veröffentlichte Ideen, Kommentare,
              Votes und Kollaborationsanfragen.
            </li>
            <li>
              <strong>Technische Daten:</strong> IP-Adresse, Browsertyp,
              Zugriffszeit – diese werden durch den Hosting-Anbieter (Vercel)
              automatisch erfasst.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            4. Rechtsgrundlage
          </h2>
          <p>Die Verarbeitung erfolgt auf Grundlage von:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>Art. 6 Abs. 1 lit. a DSGVO</strong> – Einwilligung
              (Registrierung und freiwillige Profilangaben)
            </li>
            <li>
              <strong>Art. 6 Abs. 1 lit. b DSGVO</strong> – Vertragserfüllung
              (Bereitstellung der Plattform)
            </li>
            <li>
              <strong>Art. 6 Abs. 1 lit. f DSGVO</strong> – Berechtigtes
              Interesse (Sicherheit und Betrieb der Plattform)
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            5. Hosting und Dienstleister
          </h2>
          <p>
            <strong>Vercel Inc.</strong> (340 S Lemon Ave #4133, Walnut, CA
            91789, USA) – Hosting der Website. Vercel verarbeitet technische
            Zugriffsdaten. Datenschutzrichtlinie:{" "}
            <a
              href="https://vercel.com/legal/privacy-policy"
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              vercel.com/legal/privacy-policy
            </a>
          </p>
          <p>
            <strong>Supabase Inc.</strong> (970 Toa Payoh North #07-04,
            Singapore 318992) – Datenbank und Authentifizierung.
            Datenschutzrichtlinie:{" "}
            <a
              href="https://supabase.com/privacy"
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              supabase.com/privacy
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            6. Cookies
          </h2>
          <p>
            Wir verwenden ausschließlich technisch notwendige Cookies für die
            Authentifizierung (Login-Session). Es werden keine Tracking-,
            Analyse- oder Werbe-Cookies eingesetzt.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            7. Deine Rechte
          </h2>
          <p>Du hast jederzeit das Recht auf:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>Auskunft</strong> über deine gespeicherten Daten (Art. 15
              DSGVO)
            </li>
            <li>
              <strong>Berichtigung</strong> unrichtiger Daten (Art. 16 DSGVO)
            </li>
            <li>
              <strong>Löschung</strong> deiner Daten (Art. 17 DSGVO)
            </li>
            <li>
              <strong>Einschränkung</strong> der Verarbeitung (Art. 18 DSGVO)
            </li>
            <li>
              <strong>Datenübertragbarkeit</strong> (Art. 20 DSGVO)
            </li>
            <li>
              <strong>Widerspruch</strong> gegen die Verarbeitung (Art. 21
              DSGVO)
            </li>
          </ul>
          <p>
            Zur Ausübung deiner Rechte wende dich an: alex@makeit4u.de
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            8. Beschwerderecht
          </h2>
          <p>
            Du hast das Recht, dich bei einer Datenschutz-Aufsichtsbehörde zu
            beschweren. Zuständig ist der Landesbeauftragte für den Datenschutz
            und die Informationsfreiheit Rheinland-Pfalz.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            9. Änderungen
          </h2>
          <p>
            Wir behalten uns vor, diese Datenschutzerklärung anzupassen, um sie
            stets den aktuellen rechtlichen Anforderungen anzupassen oder
            Änderungen unserer Leistungen umzusetzen.
          </p>
          <p className="text-xs">Stand: Februar 2026</p>
        </section>
      </div>
    </div>
  );
}
