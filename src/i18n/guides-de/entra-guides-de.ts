import type { GuideTranslation } from './intune-guides-de'

const entraGuidesDe: Record<string, GuideTranslation> = {
  // ── 1. Conditional Access-Richtlinie erstellen (10 Schritte) ─────────────
  'entra-conditional-access': {
    title: 'Conditional Access-Richtlinie erstellen',
    description:
      'Entwerfen und implementieren Sie eine Conditional Access-Richtlinie in Microsoft Entra ID, um adaptive Zugriffskontrollen basierend auf Benutzer-, Geräte-, Standort- und Risikosignalen durchzusetzen. Umfasst Richtlinienplanung, Konfiguration, Report-Only-Tests und Produktivrollout.',
    prerequisites: [
      'Microsoft Entra ID P1- oder P2-Lizenz',
      'Conditional Access-Administrator oder Sicherheitsadministrator-Rolle',
      'Mindestens ein Testbenutzerkonto, das nicht von der Richtlinie ausgeschlossen ist',
      'Break-Glass-Notfallzugangskonto konfiguriert',
    ],
    steps: [
      {
        title: 'Richtlinienumfang und Ziele planen',
        description:
          'Definieren Sie vor dem Erstellen einer Richtlinie, welche Benutzer und Anwendungen sie betrifft, welche Bedingungen sie auswertet und welche Gewährungs- oder Sitzungssteuerungen sie durchsetzt. Dokumentieren Sie die geschäftliche Anforderung.',
        note: 'Pflegen Sie stets mindestens zwei Break-Glass-Notfallzugangskonten, die von allen Conditional Access-Richtlinien ausgeschlossen sind, um eine Mandantensperre zu verhindern.',
      },
      {
        title: 'Conditional Access-Blade öffnen',
        description:
          'Melden Sie sich im Microsoft Entra Admin Center an und navigieren Sie zur Conditional Access-Richtlinienliste. Überprüfen Sie vorhandene Richtlinien, um Konflikte mit der neuen Richtlinie zu vermeiden.',
      },
      {
        title: 'Neue Richtlinie erstellen',
        description:
          'Klicken Sie auf "+ Neue Richtlinie" und vergeben Sie einen beschreibenden Namen, der den Zweck widerspiegelt (z. B. "MFA erforderlich – Alle Cloud-Apps – Externe Netzwerke"). Eine klare Namenskonvention erleichtert die Verwaltung von Richtlinien im großen Maßstab.',
      },
      {
        title: 'Benutzer- und Gruppenzuweisungen konfigurieren',
        description:
          'Wählen Sie unter Zuweisungen > Benutzer die Zielbenutzer oder -gruppen aus. Sie können "Alle Benutzer" einschließen und dann Ausnahmen für Notfallzugangskonten und Dienstkonten hinzufügen. Verwenden Sie Gruppen für eine einfachere Verwaltung anstelle einzelner Benutzer.',
        warning: 'Wenden Sie niemals eine Richtlinie auf alle Benutzer an, ohne Ihre Break-Glass-Konten auszuschließen. Dies kann zu einer vollständigen Mandantensperre führen.',
      },
      {
        title: 'Ziel-Cloud-Apps oder -Aktionen auswählen',
        description:
          'Wählen Sie unter Zuweisungen > Zielressourcen aus, für welche Cloud-Anwendungen die Richtlinie gilt. Sie können "Alle Cloud-Apps" für eine breite Abdeckung wählen oder bestimmte Apps auswählen.',
        note: 'Die Auswahl von "Alle Cloud-Apps" umfasst auch das Azure-Portal, Microsoft Graph und andere Microsoft-Dienste. Testen Sie gründlich, bevor Sie die Richtlinie erzwingen.',
      },
      {
        title: 'Bedingungen definieren',
        description:
          'Konfigurieren Sie eine oder mehrere Bedingungen, um einzuschränken, wann die Richtlinie gilt. Häufige Bedingungen sind: benannte Standorte (vertrauenswürdige vs. nicht vertrauenswürdige Netzwerke), Geräteplattformen (Windows, iOS, Android), Client-Apps und Anmelderisikostufe.',
      },
      {
        title: 'Gewährungssteuerungen konfigurieren',
        description:
          'Definieren Sie unter Zugriffssteuerungen > Gewähren, was für den Zugriff erforderlich ist. Häufige Optionen: "Mehrstufige Authentifizierung erforderlich", "Gerät muss als konform markiert sein" oder "Genehmigte Client-App erforderlich".',
      },
      {
        title: 'Sitzungssteuerungen konfigurieren (optional)',
        description:
          'Konfigurieren Sie unter Zugriffssteuerungen > Sitzung optional Sitzungssteuerungen wie Anmeldehäufigkeit, persistente Browsersitzungseinstellungen oder Conditional Access App Control zur Echtzeitüberwachung.',
        note: 'Die Anmeldehäufigkeit beeinflusst die Benutzererfahrung. Ein zu niedriger Wert verursacht häufige erneute Authentifizierungsaufforderungen und kann die Produktivität beeinträchtigen.',
      },
      {
        title: 'Richtlinie im Report-Only-Modus aktivieren',
        description:
          'Setzen Sie den Richtlinienstatus auf "Nur Bericht" statt "Ein". So können Sie überwachen, wie sich die Richtlinie auf Anmeldungen auswirken würde, ohne Benutzer tatsächlich zu blockieren oder herauszufordern.',
        warning: 'Überspringen Sie die Report-Only-Tests nicht. Das Aktivieren einer ungetesteten Richtlinie kann legitime Benutzer blockieren und den Geschäftsbetrieb stören.',
      },
      {
        title: 'Report-Only-Ergebnisse analysieren und Richtlinie aktivieren',
        description:
          'Überprüfen Sie nach der Testphase die Conditional Access-Insights-Arbeitsmappe und Anmeldeprotokolle. Filtern Sie nach "Nur Bericht: Fehler"-Einträgen, um betroffene Benutzer zu identifizieren. Beheben Sie Probleme und schalten Sie die Richtlinie dann von "Nur Bericht" auf "Ein" um.',
      },
    ],
  },

  // ── 2. MFA für alle Benutzer aktivieren (8 Schritte) ────────────────────
  'entra-mfa-setup': {
    title: 'MFA für alle Benutzer aktivieren',
    description:
      'Führen Sie die mehrstufige Authentifizierung in Ihrer gesamten Organisation mit Microsoft Entra ID-Sicherheitsstandards oder Conditional Access-Richtlinien ein. Umfasst Registrierung von Authentifizierungsmethoden, Benutzerkommunikation und Überwachung der Einführung.',
    prerequisites: [
      'Microsoft Entra ID P1-Lizenz (für Conditional Access-Ansatz) oder beliebige Entra ID-Stufe (für Sicherheitsstandards)',
      'Globaler Administrator oder Authentifizierungsrichtlinien-Administrator',
      'Benutzer mit gültigen Telefonnummern oder installierter Microsoft Authenticator-App',
    ],
    steps: [
      {
        title: 'Zwischen Sicherheitsstandards und Conditional Access wählen',
        description:
          'Sicherheitsstandards bieten eine einfache Ein-Klick-Möglichkeit, MFA für alle Benutzer durchzusetzen, bieten aber keine Anpassungsmöglichkeiten. Conditional Access-Richtlinien bieten granulare Kontrolle. Für Produktivmandanten mit P1- oder höherer Lizenzierung wird Conditional Access empfohlen.',
        note: 'Sicherheitsstandards und Conditional Access-Richtlinien schließen sich gegenseitig aus. Das Aktivieren der Sicherheitsstandards deaktiviert alle benutzerdefinierten Conditional Access-Richtlinien.',
      },
      {
        title: 'Authentifizierungsmethoden konfigurieren',
        description:
          'Navigieren Sie zum Blade für Authentifizierungsmethoden und aktivieren Sie die gewünschten Methoden: Microsoft Authenticator (Push-Benachrichtigungen, kennwortlos), FIDO2-Sicherheitsschlüssel, Telefon (SMS oder Sprachanruf) und/oder temporärer Zugangscode für das Onboarding.',
      },
      {
        title: 'Microsoft Authenticator-Registrierungskampagne aktivieren',
        description:
          'Aktivieren Sie die Registrierungskampagne, um Benutzer aufzufordern, die Authenticator-App einzurichten, wenn sie nur schwächere Methoden wie SMS registriert haben.',
      },
      {
        title: 'MFA-Conditional Access-Richtlinie erstellen',
        description:
          'Erstellen Sie eine neue Richtlinie mit dem Namen "MFA erforderlich – Alle Benutzer – Alle Cloud-Apps". Weisen Sie sie allen Benutzern zu (unter Ausschluss der Break-Glass-Konten), zielen Sie auf alle Cloud-Apps ab und wählen Sie unter Gewährungssteuerungen "Mehrstufige Authentifizierung erforderlich". Setzen Sie die Richtlinie zunächst auf "Nur Bericht".',
        warning: 'Schließen Sie Notfallzugangskonten immer von MFA-Richtlinien aus, um Sperrszenarien zu verhindern.',
      },
      {
        title: 'Einführung an Endbenutzer kommunizieren',
        description:
          'Senden Sie eine organisationsweite E-Mail oder Teams-Nachricht, in der erklärt wird, dass MFA aktiviert wird, wann es wirksam wird und wie man sich registriert. Stellen Sie einen direkten Link zu https://aka.ms/mfasetup bereit.',
        note: 'Geben Sie den Benutzern mindestens zwei Wochen Vorlauf, bevor Sie die Richtlinie von "Nur Bericht" auf "Ein" umschalten. Dies reduziert Helpdesk-Anrufe erheblich.',
      },
      {
        title: 'Registrierungsfortschritt überwachen',
        description:
          'Verwenden Sie den Aktivitätsbericht der Authentifizierungsmethoden, um zu verfolgen, wie viele Benutzer MFA-Methoden registriert haben. Identifizieren Sie Benutzer, die sich noch nicht registriert haben, und senden Sie gezielte Erinnerungen.',
      },
      {
        title: 'Richtlinie zur MFA-Erzwingung umschalten',
        description:
          'Nachdem die Testphase abgeschlossen ist und die Registrierungsrate über 90 % liegt, ändern Sie den Status der Conditional Access-Richtlinie von "Nur Bericht" auf "Ein". Überwachen Sie die Anmeldeprotokolle in den ersten 48 Stunden genau.',
      },
      {
        title: 'MFA-Betrugswarnungen und Berichterstellung einrichten',
        description:
          'Aktivieren Sie die Betrugswarnung, damit Benutzer verdächtige MFA-Aufforderungen melden können. Konfigurieren Sie die automatische Kontosperrung bei gemeldtem Betrug und richten Sie Benachrichtigungen für Ihr Sicherheitsteam ein.',
        warning: 'Wenn MFA-Betrugswarnungen nicht konfiguriert sind, können Angreifer, die ein Kennwort kompromittiert haben, wiederholt MFA-Aufforderungen senden (MFA-Ermüdungsangriffe), ohne entdeckt zu werden.',
      },
    ],
  },

  // ── 3. App-Registrierung erstellen (9 Schritte) ─────────────────────────
  'entra-app-registration': {
    title: 'App-Registrierung erstellen',
    description:
      'Registrieren Sie eine neue Anwendung in Microsoft Entra ID, um Authentifizierung und Autorisierung zu ermöglichen. Umfasst die Konfiguration von Umleitungs-URIs, API-Berechtigungen, Clientgeheimnissen, Zertifikaten und Token-Einstellungen.',
    prerequisites: [
      'Microsoft Entra ID (beliebige Stufe)',
      'Anwendungsadministrator oder Cloudanwendungsadministrator-Rolle',
      'Verständnis der OAuth 2.0 / OpenID Connect-Flows für Ihren Anwendungstyp',
    ],
    steps: [
      {
        title: 'Zu App-Registrierungen navigieren',
        description:
          'Melden Sie sich im Microsoft Entra Admin Center an und öffnen Sie das App-Registrierungen-Blade. Überprüfen Sie vorhandene Registrierungen, um sicherzustellen, dass Sie kein Duplikat erstellen.',
      },
      {
        title: 'Anwendung registrieren',
        description:
          'Klicken Sie auf "+ Neue Registrierung". Geben Sie einen Anzeigenamen an, der die Anwendung eindeutig identifiziert. Wählen Sie unter "Unterstützte Kontotypen" die passende Option: "Nur Konten in diesem Organisationsverzeichnis" für Einzelmandanten-LOB-Apps oder "Konten in einem beliebigen Organisationsverzeichnis" für Multi-Mandanten-SaaS-Apps.',
        note: 'Sie können die unterstützten Kontotypen später ändern, aber der Wechsel von Einzelmandant zu Multi-Mandant erfordert eine sorgfältige Überprüfung Ihrer Autorisierungslogik.',
      },
      {
        title: 'Umleitungs-URIs konfigurieren',
        description:
          'Gehen Sie auf der App-Übersichtsseite zu Authentifizierung und fügen Sie Umleitungs-URIs hinzu. Wählen Sie die Plattform: Web (für serverseitige Apps), Single-Page Application (für React/Angular/Vue), Mobil/Desktop (für native Apps).',
        warning: 'Verwenden Sie niemals Platzhalter-Umleitungs-URIs in der Produktion. Dies erzeugt eine Open-Redirect-Schwachstelle, die Angreifer zum Stehlen von Token ausnutzen können.',
      },
      {
        title: 'API-Berechtigungen konfigurieren',
        description:
          'Navigieren Sie zu API-Berechtigungen und fügen Sie die erforderlichen Berechtigungen hinzu. Wählen Sie für Microsoft Graph zwischen delegierten Berechtigungen (im Namen eines angemeldeten Benutzers) und Anwendungsberechtigungen (Daemon/Dienst). Beginnen Sie mit den geringstmöglichen Berechtigungen.',
      },
      {
        title: 'Administratoreinwilligung erteilen (falls erforderlich)',
        description:
          'Anwendungsberechtigungen und einige hochprivilegierte delegierte Berechtigungen erfordern eine Administratoreinwilligung. Klicken Sie auf "Administratoreinwilligung für [Mandant] erteilen", um die Berechtigungen im Namen aller Benutzer zu genehmigen.',
        note: 'Erteilen Sie die Administratoreinwilligung nur für Berechtigungen, die Ihre Anwendung tatsächlich benötigt. Übermäßige Berechtigungen vergrößern den Schadensradius bei einer Kompromittierung der App.',
      },
      {
        title: 'Clientgeheimnis erstellen oder Zertifikat hochladen',
        description:
          'Navigieren Sie zu Zertifikate und Geheimnisse. Erstellen Sie für die Entwicklung ein Clientgeheimnis (wählen Sie 6, 12, 18 oder 24 Monate Gültigkeit). Laden Sie für Produktionsworkloads ein X.509-Zertifikat hoch, das sicherer ist als Geheimnisse. Kopieren Sie den Geheimniswert sofort, da er nicht erneut angezeigt wird.',
        warning: 'Speichern Sie Clientgeheimnisse sicher in Azure Key Vault oder Ihrem CI/CD-Geheimnisverwaltungssystem. Committen Sie Geheimnisse niemals in die Quellcodeverwaltung oder betten Sie sie in clientseitigen Code ein.',
      },
      {
        title: 'Token-Einstellungen konfigurieren',
        description:
          'Fügen Sie unter Token-Konfiguration optionale Ansprüche zum ID-Token und Zugriffstoken hinzu, falls erforderlich. Häufige optionale Ansprüche sind E-Mail, UPN, Gruppen und bevorzugter Benutzername.',
      },
      {
        title: 'Eine API verfügbar machen (optional)',
        description:
          'Wenn Ihre Anwendung eine eigene API bereitstellt, navigieren Sie zu "Eine API verfügbar machen". Legen Sie die Anwendungs-ID-URI fest und definieren Sie Bereiche, die Clientanwendungen anfordern können.',
      },
      {
        title: 'Authentifizierung end-to-end testen',
        description:
          'Verwenden Sie ein Tool wie Postman, die MSAL-Bibliothek in Ihrem Anwendungscode oder direkt den OAuth 2.0-Token-Endpunkt, um zu überprüfen, ob die Authentifizierung funktioniert.',
        note: 'Verwenden Sie für die Produktion zertifikatbasierte Authentifizierung oder verwaltete Identitäten anstelle von Clientgeheimnissen in der Token-Anforderung.',
      },
    ],
  },

  // ── 4. SSO für Enterprise App konfigurieren (11 Schritte) ───────────────
  'entra-enterprise-app-sso': {
    title: 'SSO für Enterprise App konfigurieren',
    description:
      'Richten Sie Single Sign-On für eine Drittanbieter-Unternehmensanwendung mit SAML oder OIDC in Microsoft Entra ID ein. Umfasst Galerie-App-Bereitstellung, SSO-Konfiguration, Attributzuordnung, Zertifikatsverwaltung und Benutzerzuweisung.',
    prerequisites: [
      'Microsoft Entra ID P1- oder P2-Lizenz',
      'Anwendungsadministrator oder Cloudanwendungsadministrator-Rolle',
      'Administratorzugriff auf die Drittanbieteranwendung für die SSO-Konfiguration',
      'Die Drittanbieteranwendung unterstützt SAML 2.0 oder OIDC für SSO',
    ],
    steps: [
      {
        title: 'Unternehmensanwendung aus der Galerie hinzufügen',
        description:
          'Navigieren Sie zu Unternehmensanwendungen und klicken Sie auf "+ Neue Anwendung". Durchsuchen Sie die Entra ID-Anwendungsgalerie nach der Drittanbieter-App. Wenn die App nicht in der Galerie ist, wählen Sie "Eigene Anwendung erstellen".',
      },
      {
        title: 'SSO-Methode auswählen',
        description:
          'Öffnen Sie die neu erstellte Unternehmensanwendung und navigieren Sie zu Einmaliges Anmelden. Wählen Sie die von der Drittanbieter-App unterstützte SSO-Methode: SAML ist am häufigsten für Unternehmensanwendungen, OIDC ist neuer und einfacher.',
      },
      {
        title: 'Grundlegende SAML-Einstellungen konfigurieren',
        description:
          'Bearbeiten Sie in der SAML-basierten Anmeldekonfiguration den Abschnitt "Grundlegende SAML-Konfiguration". Geben Sie die Kennung (Entitäts-ID) und die Antwort-URL (Assertion Consumer Service-URL) ein, die von der Drittanbieteranwendung bereitgestellt werden.',
        note: 'Die Werte für Kennung und Antwort-URL müssen exakt mit den Erwartungen der Drittanbieteranwendung übereinstimmen. Selbst ein abweichender Schrägstrich kann dazu führen, dass SSO fehlschlägt.',
      },
      {
        title: 'Attribute und Ansprüche konfigurieren',
        description:
          'Bearbeiten Sie den Abschnitt "Attribute und Ansprüche", um Entra ID-Benutzerattribute den von der Anwendung erwarteten Ansprüchen zuzuordnen. Der Standard-NameID ist normalerweise user.userprincipalname.',
      },
      {
        title: 'SAML-Signaturzertifikat herunterladen',
        description:
          'Laden Sie im Abschnitt "SAML-Signaturzertifikat" das Zertifikat im von der Drittanbieteranwendung benötigten Format herunter (normalerweise Base64 oder PEM). Überprüfen Sie das Ablaufdatum des Zertifikats und setzen Sie eine Kalendererinnerung zur Erneuerung.',
        warning: 'SAML-Signaturzertifikate laufen ab. Wenn das Zertifikat ohne Erneuerung abläuft, funktioniert SSO für alle Benutzer der Anwendung nicht mehr. Richten Sie Benachrichtigungen zum Zertifikatsablauf ein.',
      },
      {
        title: 'Entra ID SSO-URLs kopieren',
        description:
          'Kopieren Sie im Abschnitt "Einrichten" die Anmelde-URL, den Azure AD-Bezeichner (Entitäts-ID) und die Abmelde-URL. Diese Werte müssen in die SSO-Konfigurationsseite der Drittanbieteranwendung eingegeben werden.',
      },
      {
        title: 'SSO auf der Seite der Drittanbieteranwendung konfigurieren',
        description:
          'Melden Sie sich in der Administrationskonsole der Drittanbieteranwendung an und suchen Sie die SSO- oder SAML-Konfigurationseinstellungen. Fügen Sie die Anmelde-URL, den Entra ID-Bezeichner und die Abmelde-URL in die entsprechenden Felder ein. Laden Sie das SAML-Signaturzertifikat hoch.',
        note: 'Jede Anwendung hat eine andere Administratoroberfläche. Konsultieren Sie die Herstellerdokumentation für genaue Feldnamen und Speicherorte. Microsoft bietet anwendungsspezifische Tutorials für Galerie-Anwendungen.',
      },
      {
        title: 'Benutzer und Gruppen zuweisen',
        description:
          'Navigieren Sie zu Benutzer und Gruppen für die Unternehmensanwendung. Fügen Sie die Benutzer oder Gruppen hinzu, die Zugriff auf die Anwendung haben sollen.',
      },
      {
        title: 'SSO mit einem Testbenutzer testen',
        description:
          'Klicken Sie in der SSO-Konfiguration auf die Schaltfläche "Testen". Melden Sie sich mit einem Testkonto an, das der Anwendung zugewiesen ist. Überprüfen Sie, ob der Benutzer erfolgreich ohne zusätzliche Anmeldedaten weitergeleitet wird.',
        warning: 'Wenn der Test fehlschlägt, verwenden Sie den Fehlerbehebungslink zur Diagnose. Häufige Probleme sind nicht übereinstimmende Antwort-URLs, falsches NameID-Format oder fehlende Ansprüche.',
      },
      {
        title: 'Bereitstellung aktivieren (optional)',
        description:
          'Wenn die Anwendung SCIM-Bereitstellung unterstützt, navigieren Sie zum Bereitstellungs-Blade und konfigurieren Sie die automatische Benutzerbereitstellung.',
      },
      {
        title: 'SSO-Anmeldeaktivität überwachen',
        description:
          'Überwachen Sie nach der Aktivierung von SSO für Produktionsbenutzer die Anmeldeprotokolle auf Fehler. Filtern Sie nach dem Anwendungsnamen, um alle SSO-Versuche zu sehen. Richten Sie Warnungen für wiederholte SSO-Fehler ein.',
      },
    ],
  },

  // ── 5. Automatische Benutzerbereitstellung einrichten (8 Schritte) ───────
  'entra-user-provisioning': {
    title: 'Automatische Benutzerbereitstellung einrichten',
    description:
      'Konfigurieren Sie die SCIM-basierte automatische Benutzerbereitstellung von Microsoft Entra ID zu einer SaaS-Drittanbieteranwendung. Umfasst die Verbindung des Bereitstellungsdienstes, Attributzuordnung, Bereichsfilter und Überwachung der Bereitstellungszyklen.',
    prerequisites: [
      'Microsoft Entra ID P1- oder P2-Lizenz',
      'Anwendungsadministrator-Rolle',
      'Unternehmensanwendung bereits zum Mandanten hinzugefügt',
      'SCIM-Endpunkt-URL und Authentifizierungstoken von der Drittanbieteranwendung',
    ],
    steps: [
      {
        title: 'Zu den Bereitstellungseinstellungen der Unternehmensanwendung navigieren',
        description:
          'Öffnen Sie die Unternehmensanwendung, für die Sie die Bereitstellung konfigurieren möchten, und navigieren Sie zum Bereitstellungs-Blade.',
      },
      {
        title: 'Bereitstellungsmodus auf Automatisch setzen',
        description:
          'Klicken Sie auf "Erste Schritte" oder "Bereitstellung bearbeiten" und setzen Sie den Bereitstellungsmodus auf "Automatisch". Dies ermöglicht Entra ID, Benutzerkonten in der Zielanwendung automatisch über das SCIM-Protokoll zu erstellen, zu aktualisieren und zu deaktivieren.',
        note: 'Wenn die Anwendung SCIM nicht unterstützt, ist die einzige Option "Manuell", die keine Automatisierung bietet. Erkundigen Sie sich beim Anbieter nach SCIM-Unterstützung.',
      },
      {
        title: 'Administratoranmeldeinformationen konfigurieren',
        description:
          'Geben Sie im Abschnitt Administratoranmeldeinformationen die Mandanten-URL (SCIM-Endpunkt) und das Geheimnistoken ein, das von der Drittanbieteranwendung bereitgestellt wird. Klicken Sie auf "Verbindung testen", um die Erreichbarkeit und Authentifizierung zu überprüfen.',
        warning: 'Speichern Sie das SCIM-Geheimnistoken sicher. Wenn das Token auf der Anwendungsseite abläuft oder rotiert wird, stoppt die Bereitstellung, bis es aktualisiert wird.',
      },
      {
        title: 'Attributzuordnungen konfigurieren',
        description:
          'Erweitern Sie den Abschnitt Zuordnungen und bearbeiten Sie die Benutzerattributzuordnungen. Ordnen Sie Entra ID-Attribute den entsprechenden Attributen in der Zielanwendung zu. Entfernen Sie Zuordnungen für Attribute, die nicht synchronisiert werden sollen.',
        note: 'Das Abgleichsattribut (normalerweise userPrincipalName oder mail) ist entscheidend. Es bestimmt, wie Entra ID Benutzer zwischen den Systemen abgleicht. Eine Änderung nach der Erstsynchronisierung kann zu Duplikaten führen.',
      },
      {
        title: 'Bereichsfilter konfigurieren',
        description:
          'Definieren Sie, welche Benutzer bereitgestellt werden sollen, indem Sie Bereichsfilter festlegen. Setzen Sie den Bereich auf "Nur zugewiesene Benutzer und Gruppen synchronisieren" (empfohlen) oder "Alle Benutzer und Gruppen synchronisieren".',
      },
      {
        title: 'Benutzer und Gruppen für die Bereitstellung zuweisen',
        description:
          'Wenn der Bereich auf "Nur zugewiesene Benutzer und Gruppen synchronisieren" gesetzt ist, navigieren Sie zu Benutzer und Gruppen und weisen Sie die bereitzustellenden Benutzer oder Gruppen der Anwendung zu.',
      },
      {
        title: 'Ersten Bereitstellungszyklus starten',
        description:
          'Setzen Sie den Bereitstellungsstatus auf "Ein" und klicken Sie auf Speichern. Der erste Bereitstellungszyklus verarbeitet alle Benutzer im Bereich und kann je nach Benutzeranzahl 20 Minuten bis mehrere Stunden dauern.',
      },
      {
        title: 'Bereitstellungsprotokolle überwachen und Fehler beheben',
        description:
          'Navigieren Sie zu den Bereitstellungsprotokollen, um den Status jeder Benutzeroperation zu überprüfen. Filtern Sie nach dem Status "Fehler", um Bereitstellungsfehler zu identifizieren und zu beheben. Richten Sie E-Mail-Benachrichtigungen für Bereitstellungsfehler ein.',
        warning: 'Wenn der erste Zyklus viele Fehler aufweist, beheben Sie die Ursache (normalerweise Attributzuordnungsprobleme) und starten Sie den Zyklus neu, anstatt ihn mit Fehlern durchlaufen zu lassen.',
      },
    ],
  },

  // ── 6. Dynamische Gruppen erstellen (7 Schritte) ────────────────────────
  'entra-group-management': {
    title: 'Dynamische Gruppen erstellen',
    description:
      'Erstellen und verwalten Sie Gruppen mit dynamischer Mitgliedschaft in Microsoft Entra ID, die Mitglieder basierend auf Benutzer- oder Geräteattributregeln automatisch hinzufügen und entfernen.',
    prerequisites: [
      'Microsoft Entra ID P1- oder P2-Lizenz',
      'Gruppenadministrator oder Benutzeradministrator-Rolle',
      'Benutzer mit ausgefüllten Attributen (Abteilung, Berufsbezeichnung usw.) in Entra ID',
    ],
    steps: [
      {
        title: 'Zu Gruppen navigieren',
        description:
          'Melden Sie sich im Microsoft Entra Admin Center an und navigieren Sie zum Gruppen-Blade. Überprüfen Sie vorhandene Gruppen, um Ihre aktuelle Gruppenstruktur zu verstehen.',
      },
      {
        title: 'Neue Gruppe mit dynamischer Mitgliedschaft erstellen',
        description:
          'Klicken Sie auf "+ Neue Gruppe". Setzen Sie den Gruppentyp auf "Sicherheit" (oder "Microsoft 365" für Zusammenarbeitsszenarien). Setzen Sie den Mitgliedschaftstyp auf "Dynamischer Benutzer" oder "Dynamisches Gerät". Vergeben Sie einen beschreibenden Gruppennamen.',
        note: 'Dynamische Microsoft 365-Gruppen sind nützlich für die automatische Verwaltung von Teams-Mitgliedschaften, freigegebenen Postfächern und SharePoint-Zugriff basierend auf Benutzerattributen.',
      },
      {
        title: 'Dynamische Mitgliedschaftsregel erstellen',
        description:
          'Klicken Sie auf "Dynamische Abfrage hinzufügen", um den Regel-Editor zu öffnen. Verwenden Sie den einfachen Regel-Editor für grundlegende Regeln oder wechseln Sie zum erweiterten Editor für komplexe Ausdrücke.',
      },
      {
        title: 'Regel überprüfen',
        description:
          'Verwenden Sie die Registerkarte "Regeln überprüfen", um die dynamische Mitgliedschaftsregel vor dem Speichern gegen bestimmte Benutzer zu testen. Wählen Sie einige Testbenutzer aus und klicken Sie auf "Überprüfen".',
        note: 'Der Regelvalidierer prüft eine begrenzte Anzahl von Benutzern. Überwachen Sie nach dem Erstellen der Gruppe die tatsächliche Mitgliedschaft, um sicherzustellen, dass die Regel wie erwartet funktioniert.',
      },
      {
        title: 'Speichern und auf Verarbeitung warten',
        description:
          'Klicken Sie auf "Speichern", um die Gruppe zu erstellen. Die Engine zur Auswertung dynamischer Mitgliedschaften beginnt mit der Verarbeitung. Die Erstverarbeitung kann je nach Verzeichnisgröße einige Minuten bis mehrere Stunden dauern.',
        warning: 'Weisen Sie die Gruppe nicht Richtlinien oder Anwendungen zu, bevor die Erstverarbeitung abgeschlossen ist. Die Zuweisung einer leeren oder teilweise gefüllten Gruppe kann zu unbeabsichtigten Zugangsverweigerungen führen.',
      },
      {
        title: 'Gruppenmitgliedschaft überprüfen',
        description:
          'Navigieren Sie nach Abschluss der Verarbeitung zur Registerkarte Mitglieder der Gruppe, um zu überprüfen, ob die erwarteten Benutzer erscheinen. Gleichen Sie mit den Benutzerattributen ab.',
      },
      {
        title: 'Mitgliedschaftsänderungen überwachen und Fehler beheben',
        description:
          'Dynamische Gruppen werden bei jeder Änderung von Benutzerattributen neu ausgewertet. Verwenden Sie die Überwachungsprotokolle, um Mitgliedschaftsänderungen zu verfolgen. Filtern Sie nach "Mitglied zu Gruppe hinzufügen" und "Mitglied aus Gruppe entfernen".',
      },
    ],
  },

  // ── 7. Benutzerdefinierte RBAC-Rollen erstellen (9 Schritte) ────────────
  'entra-rbac-roles': {
    title: 'Benutzerdefinierte RBAC-Rollen erstellen',
    description:
      'Erstellen und weisen Sie benutzerdefinierte rollenbasierte Zugriffssteuerungsrollen in Microsoft Entra ID zu, um fein abgestufte Administratorberechtigungen zu delegieren. Umfasst die Identifizierung erforderlicher Berechtigungen, den Aufbau benutzerdefinierter Rollendefinitionen und die Überwachung.',
    prerequisites: [
      'Microsoft Entra ID P1- oder P2-Lizenz',
      'Administrator für privilegierte Rollen oder Globaler Administrator',
      'Verständnis des Prinzips der geringsten Berechtigung und Ihrer Delegierungsanforderungen',
    ],
    steps: [
      {
        title: 'Delegierungsszenario identifizieren',
        description:
          'Definieren Sie klar, welche administrativen Aufgaben die Rolle ermöglichen soll. Überprüfen Sie zuerst die integrierten Rollen, ob eine vorhandene Rolle bereits Ihren Anforderungen entspricht.',
        note: 'Microsoft Entra ID verfügt über mehr als 80 integrierte Rollen. Verwenden Sie das Rollenvergleichstool, um die nächste Übereinstimmung zu finden, bevor Sie eine benutzerdefinierte Rolle erstellen.',
      },
      {
        title: 'Verfügbare Berechtigungen überprüfen',
        description:
          'Durchsuchen Sie die verfügbaren Entra ID-Berechtigungen, um festzustellen, welche Ihre benutzerdefinierte Rolle benötigt. Berechtigungen folgen dem Muster microsoft.directory/resource/action.',
      },
      {
        title: 'Benutzerdefinierte Rollendefinition erstellen',
        description:
          'Navigieren Sie zu Rollen und Administratoren und klicken Sie auf "+ Neue benutzerdefinierte Rolle". Geben Sie einen beschreibenden Namen und eine Beschreibung an. Suchen und fügen Sie auf der Registerkarte Berechtigungen nur die spezifisch benötigten Berechtigungen hinzu.',
        warning: 'Wenden Sie das Prinzip der geringsten Berechtigung an. Fügen Sie nur Berechtigungen hinzu, die für die Rolle unbedingt erforderlich sind. Zu weitreichende benutzerdefinierte Rollen verfehlen den Zweck der feingranularen Delegierung.',
      },
      {
        title: 'Berechtigungen zur Rolle hinzufügen',
        description:
          'Suchen Sie nach Berechtigungen per Stichwort oder durchsuchen Sie nach Ressourcenkategorie. Überprüfen Sie die vollständige Liste der ausgewählten Berechtigungen, bevor Sie fortfahren.',
      },
      {
        title: 'Rolle überprüfen und erstellen',
        description:
          'Überprüfen Sie auf der Registerkarte "Überprüfen + erstellen" den Rollennamen, die Beschreibung und die Berechtigungen. Nach der Erstellung erscheint die Rolle in der Rollenliste neben den integrierten Rollen.',
      },
      {
        title: 'Benutzerdefinierte Rolle Benutzern oder Gruppen zuweisen',
        description:
          'Öffnen Sie die benutzerdefinierte Rolle und klicken Sie auf "+ Zuweisungen hinzufügen". Wählen Sie die Benutzer oder Gruppen aus. Legen Sie den Zuweisungsbereich fest: verzeichnisweit oder auf eine bestimmte Verwaltungseinheit beschränkt.',
        note: 'Die Beschränkung von Rollenzuweisungen auf Verwaltungseinheiten bietet eine zusätzliche Zugriffssteuerungsebene. Zum Beispiel kann ein Helpdesk-Operator, der auf die Verwaltungseinheit "EMEA" beschränkt ist, nur Kennwörter für Benutzer in dieser Einheit zurücksetzen.',
      },
      {
        title: 'Verwaltungseinheiten für bereichsbezogene Zuweisungen konfigurieren (optional)',
        description:
          'Wenn Sie die Rolle auf bestimmte Benutzer oder Geräte beschränken müssen, erstellen Sie zuerst eine Verwaltungseinheit. Navigieren Sie zu Verwaltungseinheiten, erstellen Sie eine neue Einheit, fügen Sie Mitglieder hinzu und erstellen Sie dann eine bereichsbezogene Rollenzuweisung.',
      },
      {
        title: 'Benutzerdefinierte Rolle testen',
        description:
          'Melden Sie sich mit einem Testbenutzer an, dem die benutzerdefinierte Rolle zugewiesen ist. Überprüfen Sie, ob der Benutzer die erlaubten Aktionen durchführen kann und keine Aktionen außerhalb der Rolle ausführen kann.',
        warning: 'Testen Sie benutzerdefinierte Rollen immer mit einem Nicht-Admin-Testkonto, bevor Sie sie für Produktionsbenutzer ausrollen. Falsch konfigurierte Rollen können entweder übermäßigen Zugriff gewähren oder nicht genügend Zugriff für die beabsichtigten Aufgaben bieten.',
      },
      {
        title: 'Rollenzuweisungen und Nutzung überwachen',
        description:
          'Überwachen Sie die Nutzung benutzerdefinierter Rollen über die Überwachungsprotokolle. Überprüfen Sie regelmäßig, wer benutzerdefinierte Rollenzuweisungen hat, und entfernen Sie veraltete Zuweisungen. Erwägen Sie die Verwendung von Zugriffsüberprüfungen zur Automatisierung des Überprüfungsprozesses.',
      },
    ],
  },

  // ── 8. Privileged Identity Management einrichten (10 Schritte) ──────────
  'entra-pim-setup': {
    title: 'Privileged Identity Management einrichten',
    description:
      'Konfigurieren Sie Microsoft Entra Privileged Identity Management (PIM), um Just-in-Time-Zugriff auf privilegierte Rollen durchzusetzen, Genehmigungsworkflows zu erfordern und die Nutzung erhöhter Rollen zu überwachen.',
    prerequisites: [
      'Microsoft Entra ID P2-Lizenz',
      'Globaler Administrator oder Administrator für privilegierte Rollen',
      'Break-Glass-Notfallzugangskonten mit permanenten Rollenzuweisungen',
    ],
    steps: [
      {
        title: 'Zu Privileged Identity Management navigieren',
        description:
          'Melden Sie sich im Microsoft Entra Admin Center an und navigieren Sie zum PIM-Blade. Bei der erstmaligen Nutzung von PIM müssen Sie dem PIM-Dienst möglicherweise zustimmen.',
        note: 'Nur ein Globaler Administrator kann PIM zum ersten Mal zustimmen. Nach der Erstzustimmung können Administratoren für privilegierte Rollen die PIM-Einstellungen verwalten.',
      },
      {
        title: 'Aktuelle permanente Rollenzuweisungen überprüfen',
        description:
          'Klicken Sie auf "Microsoft Entra-Rollen" und dann auf "Rollen", um alle Rollenzuweisungen anzuzeigen. Identifizieren Sie Benutzer mit permanenten (aktiven) Zuweisungen zu privilegierten Rollen. Das Ziel ist es, die meisten permanenten Zuweisungen in berechtigte Zuweisungen umzuwandeln.',
        warning: 'Entfernen Sie keine permanenten Globaler-Administrator-Zuweisungen von Break-Glass-Konten. Diese Konten müssen für Notfallszenarien immer permanenten Zugriff behalten.',
      },
      {
        title: 'Rolleneinstellungen für Globalen Administrator konfigurieren',
        description:
          'Klicken Sie auf die Rolle "Globaler Administrator", dann auf "Rolleneinstellungen" und "Bearbeiten". Konfigurieren Sie die maximale Aktivierungsdauer (empfohlen: 1-4 Stunden), fordern Sie MFA bei der Aktivierung an, verlangen Sie eine Begründung und fordern Sie optional eine Genehmigung an.',
      },
      {
        title: 'Genehmigungsworkflows konfigurieren',
        description:
          'Aktivieren Sie für hochprivilegierte Rollen die Einstellung "Genehmigung zur Aktivierung erforderlich". Bestimmen Sie bestimmte Benutzer oder Gruppen als Genehmiger. Genehmiger erhalten eine E-Mail-Benachrichtigung und können die Anfrage über das PIM-Portal genehmigen oder ablehnen.',
        note: 'Konfigurieren Sie mindestens zwei Genehmiger für jede Rolle, um Engpässe zu vermeiden, wenn ein Genehmiger nicht verfügbar ist. Wenn keine Genehmiger konfiguriert sind, fungieren Administratoren für privilegierte Rollen als Standardgenehmiger.',
      },
      {
        title: 'Rolleneinstellungen für andere privilegierte Rollen konfigurieren',
        description:
          'Wiederholen Sie die Konfiguration der Rolleneinstellungen für andere privilegierte Rollen in Ihrer Organisation: Benutzeradministrator, Exchange-Administrator, SharePoint-Administrator, Sicherheitsadministrator usw.',
      },
      {
        title: 'Permanente Zuweisungen in berechtigte umwandeln',
        description:
          'Wählen Sie für jede privilegierte Rolle Benutzer mit permanenten (aktiven) Zuweisungen aus und wandeln Sie sie in "Berechtigt" um. Legen Sie ein angemessenes Ablaufdatum für die berechtigte Zuweisung fest.',
        warning: 'Stellen Sie vor der Umwandlung sicher, dass betroffene Benutzer den neuen Aktivierungsprozess verstehen. Eine Umwandlung ohne Benachrichtigung kann zu Störungen führen, wenn Administratoren plötzlich ihren permanenten Zugriff verlieren.',
      },
      {
        title: 'PIM-Warnungen einrichten',
        description:
          'Konfigurieren Sie PIM-Sicherheitswarnungen zur Erkennung riskanter Muster. Überprüfen Sie die integrierten Warnungsregeln: "Rollen werden außerhalb von PIM zugewiesen", "Potenziell veraltete Rollenzuweisung", "Zu viele Globale Administratoren". Aktivieren Sie E-Mail-Benachrichtigungen für kritische Warnungen.',
      },
      {
        title: 'Benachrichtigungen konfigurieren',
        description:
          'Richten Sie E-Mail-Benachrichtigungen für PIM-Ereignisse ein. Konfigurieren Sie, wer Benachrichtigungen erhält, wenn Rollen aktiviert werden, wenn eine Aktivierung eine Genehmigung erfordert und wenn Zuweisungen ablaufen.',
      },
      {
        title: 'Aktivierungsworkflow testen',
        description:
          'Melden Sie sich als Testbenutzer mit einer berechtigten Rollenzuweisung an. Navigieren Sie zu PIM und klicken Sie auf "Aktivieren". Geben Sie die erforderliche Begründung an, schließen Sie MFA ab und senden Sie die Aktivierungsanfrage.',
        note: 'Testen Sie den gesamten Workflow einschließlich Aktivierung, Durchführung von Administratoraufgaben und Deaktivierung. Überprüfen Sie, ob die Rolle nach Ablauf der konfigurierten Dauer automatisch deaktiviert wird.',
      },
      {
        title: 'Wiederkehrende Zugriffsüberprüfungen für PIM-Rollen planen',
        description:
          'Erstellen Sie Zugriffsüberprüfungen für berechtigte Rollenzuweisungen, um sicherzustellen, dass nur autorisierte Benutzer ihren privilegierten Zugriff über die Zeit behalten.',
      },
    ],
  },

  // ── 9. Zugriffsüberprüfungen konfigurieren (8 Schritte) ────────────────
  'entra-access-reviews': {
    title: 'Zugriffsüberprüfungen konfigurieren',
    description:
      'Richten Sie wiederkehrende Zugriffsüberprüfungen in Microsoft Entra ID ein, um regelmäßig zu verifizieren, dass Benutzer ihre Gruppenmitgliedschaften, Anwendungszuweisungen und Rollenzuweisungen weiterhin benötigen.',
    prerequisites: [
      'Microsoft Entra ID P2-Lizenz (oder Entra ID Governance-Lizenz)',
      'Globaler Administrator, Identity Governance-Administrator oder Benutzeradministrator-Rolle',
      'Gruppen, Anwendungen oder Rollen, die eine regelmäßige Überprüfung erfordern',
    ],
    steps: [
      {
        title: 'Zu Zugriffsüberprüfungen navigieren',
        description:
          'Melden Sie sich im Microsoft Entra Admin Center an und navigieren Sie zum Blade Zugriffsüberprüfungen unter Identity Governance. Überprüfen Sie vorhandene Zugriffsüberprüfungen.',
      },
      {
        title: 'Neue Zugriffsüberprüfung erstellen',
        description:
          'Klicken Sie auf "+ Neue Zugriffsüberprüfung". Wählen Sie den Überprüfungstyp: "Teams + Gruppen" zur Überprüfung von Gruppen- und Teams-Mitgliedschaften, "Anwendungen" zur Überprüfung von Anwendungszuweisungen oder "Azure-Ressourcen / Entra-Rollen" zur Überprüfung von Rollenzuweisungen.',
      },
      {
        title: 'Überprüfungsbereich konfigurieren',
        description:
          'Wählen Sie aus, welche Gruppen oder Anwendungen überprüft werden sollen. Setzen Sie den Bereich auf "Nur Gastbenutzer", wenn der Fokus auf externem Zugriff liegt, oder "Alle Benutzer" für eine umfassende Überprüfung.',
        note: 'Die Fokussierung von Zugriffsüberprüfungen auf Gastbenutzer ist ein schneller Gewinn für die Sicherheit. Gastkonten sammeln sich oft im Laufe der Zeit ohne regelmäßige Bereinigung an.',
      },
      {
        title: 'Prüfer auswählen',
        description:
          'Wählen Sie aus, wer die Überprüfung durchführen soll: "Gruppenbesitzer" (empfohlen für Self-Service), "Ausgewählte Benutzer oder Gruppen" (für zentrale Überprüfung), "Benutzer überprüfen ihren eigenen Zugriff" (Selbstbestätigung) oder "Vorgesetzte der Benutzer".',
        warning: 'Selbstbestätigung (Benutzer überprüfen ihren eigenen Zugriff) bietet die schwächste Sicherheitsgewährleistung. Verwenden Sie sie nur als Ergänzung zu Vorgesetzten- oder Gruppenbesitzerüberprüfungen, nicht als alleinigen Überprüfungsmechanismus.',
      },
      {
        title: 'Wiederholung und Dauer konfigurieren',
        description:
          'Legen Sie fest, dass die Überprüfung nach einem Zeitplan wiederholt wird: wöchentlich, monatlich, vierteljährlich, halbjährlich oder jährlich. Definieren Sie die Überprüfungsdauer und das Startdatum. Vierteljährliche Überprüfungen bieten eine gute Balance zwischen Sicherheit und Prüferermüdung.',
      },
      {
        title: 'Abschlusseinstellungen konfigurieren',
        description:
          'Konfigurieren Sie unter Einstellungen, was nach Abschluss der Überprüfung geschieht: Aktivieren Sie "Ergebnisse automatisch auf Ressource anwenden", um abgelehnte Benutzer automatisch zu entfernen. Legen Sie die Standardaktion für nicht reagierende Prüfer fest. Aktivieren Sie "Begründung erforderlich".',
        note: 'Das Festlegen der Standardaktion für nicht reagierende Prüfer auf "Zugriff entfernen" bietet die stärkste Sicherheitshaltung, kann aber den Zugriff stören, wenn Prüfer nachlässig sind. Wägen Sie Sicherheit gegen die Risikobereitschaft Ihrer Organisation ab.',
      },
      {
        title: 'Überprüfen und erstellen',
        description:
          'Überprüfen Sie alle Einstellungen auf der Zusammenfassungsseite und klicken Sie auf "Erstellen". Die erste Überprüfungsinstanz wird sofort (oder am Startdatum) erstellt. Prüfer erhalten E-Mail-Benachrichtigungen mit einem Link zum Abschluss ihrer Überprüfungen.',
      },
      {
        title: 'Überprüfungsfortschritt überwachen und Ergebnisse analysieren',
        description:
          'Überwachen Sie nach Beginn des Überprüfungszeitraums den Abschlussfortschritt. Analysieren Sie nach Abschluss der Überprüfung die Ergebnisse und exportieren Sie sie für die Compliance-Berichterstellung.',
      },
    ],
  },

  // ── 10. B2B-Gastbenutzer einladen und verwalten (6 Schritte) ────────────
  'entra-b2b-guest': {
    title: 'B2B-Gastbenutzer einladen und verwalten',
    description:
      'Laden Sie externe Partner und Mitarbeiter als B2B-Gastbenutzer in Microsoft Entra ID ein. Umfasst Einzel- und Masseneinladungen, Gastzugriffseinstellungen, mandantenübergreifende Zugriffsrichtlinien und Lebenszyklusverwaltung externer Identitäten.',
    prerequisites: [
      'Microsoft Entra ID (beliebige Stufe; P1/P2 für erweiterte Funktionen wie Conditional Access für Gäste)',
      'Gasteinlader-Rolle oder höher',
      'Einstellungen für externe Zusammenarbeit zur Erlaubnis von Einladungen konfiguriert',
    ],
    steps: [
      {
        title: 'Einstellungen für externe Zusammenarbeit überprüfen',
        description:
          'Überprüfen und konfigurieren Sie vor dem Einladen von Gästen die Einstellungen für externe Zusammenarbeit. Legen Sie fest, wer Gäste einladen kann. Konfigurieren Sie erlaubte oder verweigerte Domänen und die Zugriffsbeschränkungen für Gastbenutzer.',
        note: 'Die Beschränkung von Gasteinladungen auf Administratoren und Benutzer in der Gasteinlader-Rolle bietet die meiste Kontrolle. Allen Mitgliedern das Einladen von Gästen zu erlauben ist praktisch, kann aber zu unkontrolliertem externen Zugriff führen.',
      },
      {
        title: 'Einzelnen Gastbenutzer einladen',
        description:
          'Navigieren Sie zu Benutzer und klicken Sie auf "+ Externen Benutzer einladen". Geben Sie die E-Mail-Adresse des Gasts, eine persönliche Einladungsnachricht ein und wählen Sie Gruppen oder Anwendungen aus, denen der Gast hinzugefügt werden soll.',
      },
      {
        title: 'Gastbenutzer in großen Mengen einladen',
        description:
          'Verwenden Sie für die Einladung vieler Gäste gleichzeitig die Masseneinladungsfunktion oder ein PowerShell-Skript. Bereiten Sie eine CSV-Datei mit Spalten für E-Mail-Adresse, Anzeigename und Umleitungs-URL vor.',
        note: 'Erwägen Sie bei umfangreichen Einladungen (100+ Benutzer) eine Drosselung der API-Aufrufe, um Microsoft Graph-Ratenbegrenzungen zu vermeiden. Fügen Sie eine kurze Verzögerung zwischen den Einladungen hinzu.',
      },
      {
        title: 'Mandantenübergreifende Zugriffsrichtlinien konfigurieren',
        description:
          'Konfigurieren Sie für laufende Partnerschaften mandantenübergreifende Zugriffseinstellungen. Fügen Sie die Partnerorganisation per Mandanten-ID oder Domäne hinzu. Konfigurieren Sie eingehende und ausgehende Einstellungen.',
        warning: 'Mandantenübergreifende Zugriffsrichtlinien können externen Organisationen erheblichen Zugriff gewähren. Überprüfen Sie die eingehenden Vertrauenseinstellungen sorgfältig, insbesondere die Option, die MFA- und Gerätekonformitätsansprüche des Partners zu vertrauen.',
      },
      {
        title: 'Gäste Anwendungen und Gruppen zuweisen',
        description:
          'Fügen Sie Gastbenutzer den entsprechenden Sicherheitsgruppen und Anwendungszuweisungen hinzu. Verwenden Sie eine dedizierte Gruppe für externe Benutzer, um Conditional Access-Richtlinien und Zugriffsüberprüfungen gezielt auf Gastkonten anzuwenden.',
      },
      {
        title: 'Gast-Lebenszyklusverwaltung einrichten',
        description:
          'Konfigurieren Sie Zugriffsüberprüfungen speziell für Gastbenutzer. Richten Sie eine Conditional Access-Richtlinie ein, die MFA für alle Gastanmeldungen erfordert. Erwägen Sie die Konfiguration automatischer Gastkontoablaufzeiten. Überwachen Sie die Gastanmeldeaktivität und entfernen Sie veraltete Gastkonten.',
        warning: 'Benachrichtigen Sie vor dem Löschen veralteter Gastkonten den internen Sponsor oder Projektverantwortlichen. Einige Gastkonten können für Dienst-zu-Dienst-Integrationen verwendet werden, die keine interaktive Anmeldeaktivität erzeugen.',
      },
    ],
  },
}

export default entraGuidesDe
