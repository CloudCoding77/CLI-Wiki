import type { GuideTranslation } from './intune-guides-de'

const m365GuidesDe: Record<string, GuideTranslation> = {
  // ── 1. Nachrichtenflussregeln erstellen (9 Schritte) ─────────────
  'm365-exchange-mailflow': {
    title: 'Nachrichtenflussregeln erstellen',
    description:
      'Konfigurieren Sie Nachrichtenflussregeln (Transportregeln) in Exchange Online, um den E-Mail-Fluss in Ihrer Organisation zu steuern. Lernen Sie, Regeln fuer Haftungsausschluesse, Verschluesselung, Header-Aenderungen und bedingtes Routing zu erstellen.',
    prerequisites: [
      'Exchange Online-Lizenz (Plan 1 oder Plan 2)',
      'Exchange-Administrator- oder Organisationsverwaltungsrolle',
      'Exchange Online PowerShell-Modul (ExchangeOnlineManagement)',
    ],
    steps: [
      {
        title: 'Verbindung zu Exchange Online PowerShell herstellen',
        description:
          'Oeffnen Sie ein PowerShell-Fenster und verbinden Sie sich mit Exchange Online ueber das ExchangeOnlineManagement-Modul. Dadurch wird eine Remote-Sitzung eingerichtet, mit der Sie Nachrichtenflussregeln programmatisch verwalten koennen.',
        note: 'Sie koennen auch das Exchange Admin Center (EAC) fuer eine grafische Oberflaeche verwenden, aber PowerShell bietet Ihnen eine detailliertere Kontrolle und unterstuetzt Automatisierung.',
      },
      {
        title: 'Vorhandene Nachrichtenflussregeln ueberpruefen',
        description:
          'Ueberpruefen Sie vor dem Erstellen neuer Regeln den aktuellen Regelsatz, um Konflikte oder doppelte Verarbeitung zu vermeiden. Regeln werden in der Prioritaetsreihenfolge verarbeitet, daher ist das Verstaendnis der bestehenden Konfiguration entscheidend.',
      },
      {
        title: 'Haftungsausschluss-Regel erstellen',
        description:
          'Erstellen Sie eine Nachrichtenflussregel, die allen ausgehenden Nachrichten einen rechtlichen Haftungsausschluss anfuegt. Dies ist einer der haeufigsten Anwendungsfaelle fuer Transportregeln in Unternehmensumgebungen.',
        note: 'Die FallbackAction bestimmt, was passiert, wenn der Haftungsausschluss nicht hinzugefuegt werden kann (z. B. bei verschluesselten Nachrichten). "Wrap" schliesst die Originalnachricht als Anhang mit dem Haftungsausschluss im neuen Nachrichtentext ein.',
      },
      {
        title: 'Bedingtes Routing konfigurieren',
        description:
          'Richten Sie eine Regel ein, die Nachrichten basierend auf bestimmten Bedingungen umleitet, z. B. alle Nachrichten mit "Rechnung" im Betreff an ein gemeinsames Postfach zur Ueberpruefung weiterleiten.',
        warning: 'Fuegen Sie immer Ausnahmen hinzu, um Routing-Schleifen zu verhindern. Ohne den ExceptIfSentTo-Parameter koennten umgeleitete Nachrichten erneut die Regel ausloesen und Endlosschleifen verursachen.',
      },
      {
        title: 'Verschluesselungsregel erstellen',
        description:
          'Konfigurieren Sie eine Regel, die automatisch Office 365-Nachrichtenverschluesselung (OME) auf Nachrichten anwendet, die sensible Daten enthalten oder mit bestimmten Schluesselwoertern an externe Empfaenger gesendet werden.',
      },
      {
        title: 'Header-Aenderungsregel erstellen',
        description:
          'Fuegen Sie Nachrichtenheader hinzu, aendern oder entfernen Sie diese, um die Interoperabilitaet mit Drittsystemen, Spam-Filterung oder Compliance-Nachverfolgung zu unterstuetzen. Benutzerdefinierte Header sind fuer Endbenutzer unsichtbar, koennen aber von Mailservern und Gateways gelesen werden.',
      },
      {
        title: 'Regelprioriaet und Aktivierung festlegen',
        description:
          'Passen Sie die Prioritaet Ihrer neuen Regeln an, um sicherzustellen, dass sie in der richtigen Reihenfolge ausgewertet werden. Niedrigere Prioritaetsnummern werden zuerst verarbeitet. Aktivieren oder deaktivieren Sie Regeln nach Bedarf zum Testen.',
        note: 'Verwenden Sie den "Audit"-Modus, um Regeln zu testen, ohne tatsaechlich Aktionen anzuwenden. Audit-Ergebnisse erscheinen in den Nachrichtenverfolgungsprotokollen.',
      },
      {
        title: 'Nachrichtenflussregeln testen',
        description:
          'Senden Sie Testnachrichten, die jede Regelbedingung erfuellen, und ueberpruefen Sie, ob die erwarteten Aktionen angewendet werden. Verwenden Sie die Nachrichtenverfolgung, um die Regelverarbeitung zu bestaetigen und Probleme zu diagnostizieren.',
        warning: 'Nachrichtenverfolgungsdaten koennen bis zu 10 Minuten dauern, bis sie angezeigt werden. Fuer Echtzeittests ueberpruefen Sie das Empfaengerpostfach direkt.',
      },
      {
        title: 'Regeln ueberwachen und pflegen',
        description:
          'Etablieren Sie einen regelmaessigen Ueberpruefungszyklus fuer Ihre Nachrichtenflussregeln. Exportieren Sie die aktuelle Konfiguration zur Dokumentation und Notfallwiederherstellung. Entfernen oder deaktivieren Sie nicht mehr benoetigte Regeln, um die Verarbeitung effizient zu halten.',
      },
    ],
  },

  // ── 2. Freigegebenes Postfach einrichten (6 Schritte) ────────────
  'm365-shared-mailbox': {
    title: 'Freigegebenes Postfach einrichten',
    description:
      'Erstellen und konfigurieren Sie ein freigegebenes Postfach in Exchange Online fuer die Teamzusammenarbeit. Umfasst Postfacherstellung, Berechtigungszuweisung, automatische Antworten, Gesendete-Elemente-Verhalten und Outlook-Profileinrichtung.',
    prerequisites: [
      'Exchange Online-Lizenz',
      'Exchange-Administrator- oder Globaler-Administrator-Rolle',
    ],
    steps: [
      {
        title: 'Freigegebenes Postfach erstellen',
        description:
          'Erstellen Sie ein neues freigegebenes Postfach ueber das Microsoft 365 Admin Center oder PowerShell. Freigegebene Postfaecher benoetigen keine Lizenz, solange sie unter dem 50-GB-Speicherlimit bleiben.',
        note: 'Freigegebene Postfaecher, die 50 GB ueberschreiten, benoetigen eine Exchange Online Plan 2-Lizenz oder ein Exchange Online-Archivierungs-Add-On.',
      },
      {
        title: 'Vollzugriff und Senden-als-Berechtigungen zuweisen',
        description:
          'Gewaehren Sie Teammitgliedern Vollzugriffsberechtigungen zum Lesen und Verwalten des Postfachs sowie Senden-als-Berechtigungen, um E-Mails zu senden, die von der Adresse des freigegebenen Postfachs zu stammen scheinen.',
        warning: 'Vollzugriffsberechtigungen ermoeglichen Benutzern das Lesen aller vorhandenen E-Mails im freigegebenen Postfach. Gewaehren Sie dies nur autorisierten Teammitgliedern.',
      },
      {
        title: 'Gesendete-Elemente-Verhalten konfigurieren',
        description:
          'Standardmaessig werden Nachrichten, die von einem freigegebenen Postfach gesendet werden, nur im Ordner "Gesendete Elemente" des Absenders gespeichert. Konfigurieren Sie das Postfach so, dass auch eine Kopie in den gesendeten Elementen des freigegebenen Postfachs gespeichert wird, damit das Team den Ueberblick behaelt.',
        note: 'Diese Einstellung stellt sicher, dass alle Teammitglieder den vollstaendigen Gespraechsverlauf im freigegebenen Postfach sehen koennen.',
      },
      {
        title: 'Automatische Antworten einrichten',
        description:
          'Konfigurieren Sie automatische Antworten (Abwesenheitsnachrichten) fuer das freigegebene Postfach, um eingehende Nachrichten zu bestaetigen und Erwartungen an die Antwortzeit zu setzen.',
      },
      {
        title: 'Freigegebenes Postfach zu Outlook hinzufuegen',
        description:
          'Freigegebene Postfaecher mit Vollzugriffsberechtigungen werden innerhalb von 30-60 Minuten automatisch in Outlook zugeordnet. Wenn die automatische Zuordnung nicht gewuenscht ist, deaktivieren Sie sie und fuegen Sie das Postfach manuell als zusaetzliches Konto in Outlook hinzu.',
        note: 'Die automatische Zuordnung funktioniert nur mit Outlook Desktop. Fuer Outlook im Web muessen Benutzer das freigegebene Postfach manuell oeffnen ueber Datei > Weiteres Postfach oeffnen.',
      },
      {
        title: 'Konfiguration ueberpruefen und auditieren',
        description:
          'Bestaetigen Sie die Berechtigungen, testen Sie das Senden und Empfangen und ueberpruefen Sie die Postfachkonfiguration. Richten Sie ein Ueberwachungsprotokoll ein, um nachzuverfolgen, wer auf das freigegebene Postfach zugreift.',
      },
    ],
  },

  // ── 3. Aufbewahrungsrichtlinien konfigurieren (8 Schritte) ───────
  'm365-exchange-retention': {
    title: 'Aufbewahrungsrichtlinien konfigurieren',
    description:
      'Richten Sie Aufbewahrungsrichtlinien in Microsoft 365 ein, um den Datenlebenszyklus zu verwalten, einschliesslich E-Mail-Aufbewahrung, Loeschzeitplaene und Compliance-Aufbewahrung. Umfasst sowohl Microsoft Purview-Aufbewahrungsrichtlinien als auch Exchange Online-Aufbewahrungstags.',
    prerequisites: [
      'Microsoft 365 E3/E5- oder Exchange Online Plan 2-Lizenz',
      'Compliance-Administrator- oder Globaler-Administrator-Rolle',
      'Exchange Online PowerShell-Modul',
    ],
    steps: [
      {
        title: 'Aufbewahrungsstrategie planen',
        description:
          'Definieren Sie vor dem Erstellen von Richtlinien die Datenaufbewahrungsanforderungen Ihrer Organisation. Identifizieren Sie, welche Inhaltstypen aufbewahrt werden muessen (E-Mail, Teams-Nachrichten, SharePoint-Dokumente), wie lange sie aufbewahrt werden sollen und was nach Ablauf des Aufbewahrungszeitraums passieren soll.',
        note: 'Konsultieren Sie Ihre Rechts- und Compliance-Teams, um sicherzustellen, dass die Aufbewahrungszeitraeume den regulatorischen Anforderungen entsprechen (z. B. DSGVO, HIPAA, SOX).',
      },
      {
        title: 'Microsoft Purview-Aufbewahrungsrichtlinie erstellen',
        description:
          'Navigieren Sie zum Microsoft Purview Compliance Portal und erstellen Sie eine neue Aufbewahrungsrichtlinie. Purview-Aufbewahrungsrichtlinien gelten umfassend fuer Microsoft 365-Workloads und sind der empfohlene Ansatz fuer organisationsweite Aufbewahrung.',
        warning: 'Aufbewahrungsrichtlinien koennen bis zu 7 Tage benoetigen, um vollstaendig auf alle Postfaecher und Websites angewendet zu werden. Gehen Sie nicht von sofortiger Durchsetzung aus.',
      },
      {
        title: 'Exchange Online-Aufbewahrungsumfang konfigurieren',
        description:
          'Legen Sie den Umfang der Aufbewahrungsrichtlinie auf Exchange Online-Postfaecher fest. Waehlen Sie, ob die Richtlinie auf alle Postfaecher oder bestimmte Benutzer und Gruppen angewendet werden soll. Legen Sie den Aufbewahrungszeitraum und die Aktion bei Ablauf fest.',
      },
      {
        title: 'Aufbewahrungstags fuer granulare Kontrolle erstellen',
        description:
          'Erstellen Sie fuer detailliertere Kontrolle Exchange Online-Aufbewahrungstags. Diese ermoeglichen es Benutzern oder Administratoren, spezifische Aufbewahrungseinstellungen auf einzelne Ordner oder Nachrichten mithilfe der Messaging Records Management (MRM) anzuwenden.',
        note: 'Persoenliche Tags erscheinen in Outlook und OWA und ermoeglichen es Benutzern, die Standardaufbewahrung fuer einzelne Elemente oder Ordner zu ueberschreiben.',
      },
      {
        title: 'Aufbewahrungsrichtlinie mit Tags erstellen und zuweisen',
        description:
          'Buendeln Sie die Aufbewahrungstags in einer Aufbewahrungsrichtlinie und weisen Sie sie Postfaechern zu. Jedem Postfach kann nur eine MRM-Aufbewahrungsrichtlinie gleichzeitig zugewiesen werden.',
        warning: 'Das Aendern der Aufbewahrungsrichtlinie eines Postfachs loest den Assistenten fuer verwaltete Ordner aus, um das Postfach erneut zu verarbeiten, was bis zu 7 Tage dauern kann.',
      },
      {
        title: 'Beweissicherungsverfahren fuer Compliance konfigurieren',
        description:
          'Setzen Sie Postfaecher in ein Beweissicherungsverfahren, wenn Sie alle Postfachinhalte fuer die rechtliche Ermittlung aufbewahren muessen, unabhaengig von Aufbewahrungsrichtlinien. Das Beweissicherungsverfahren verhindert die dauerhafte Loeschung von Elementen.',
        warning: 'Das Beweissicherungsverfahren bewahrt ALLE Daten auf, einschliesslich geloeschter Elemente. Dies kann den Postfachspeicher erheblich erhoehen. Ueberwachen Sie die Postfachgroessen regelmaessig.',
      },
      {
        title: 'Assistenten fuer verwaltete Ordner starten',
        description:
          'Der Assistent fuer verwaltete Ordner verarbeitet Postfaecher und wendet Aufbewahrungstags an. Standardmaessig laeuft er alle 7 Tage. Sie koennen ihn waehrend des Testens manuell ausloesen, um eine sofortige Verarbeitung zu ermoeglichen.',
        note: 'Das gleichzeitige Ausfuehren des Assistenten fuer verwaltete Ordner auf allen Postfaechern kann Leistungsprobleme verursachen. Verarbeiten Sie bei grossen Mandanten in Stapeln.',
      },
      {
        title: 'Aufbewahrung ueberwachen und Berichte erstellen',
        description:
          'Erstellen Sie Berichte ueber Aufbewahrungsrichtlinienzuweisungen, Aufbewahrungsstatus und Postfachgroessen, um die Compliance sicherzustellen. Verwenden Sie diese Berichte fuer die Auditierung und um zu ueberpruefen, ob Richtlinien korrekt angewendet werden.',
      },
    ],
  },

  // ── 4. Teams-Richtlinien konfigurieren (9 Schritte) ──────────────
  'm365-teams-policies': {
    title: 'Teams-Richtlinien konfigurieren',
    description:
      'Richten Sie Microsoft Teams-Richtlinien ein und verwalten Sie diese, um Messaging, Besprechungen, App-Berechtigungen und Anruffunktionen in Ihrer Organisation zu steuern. Umfasst Richtlinienerstellung, Zuweisung und Best Practices fuer Governance.',
    prerequisites: [
      'Microsoft Teams-Lizenz',
      'Teams-Administrator- oder Globaler-Administrator-Rolle',
      'Microsoft Teams PowerShell-Modul (MicrosoftTeams)',
    ],
    steps: [
      {
        title: 'Verbindung zu Microsoft Teams PowerShell herstellen',
        description:
          'Installieren Sie das Microsoft Teams PowerShell-Modul und verbinden Sie sich damit. Dies ist erforderlich, um Teams-Richtlinien im grossen Massstab zu verwalten und Richtlinienzuweisungen zu automatisieren.',
        note: 'Das MicrosoftTeams-Modul ersetzt den veralteten Skype for Business Online Connector fuer alle Teams-Verwaltungsaufgaben.',
      },
      {
        title: 'Messaging-Richtlinie konfigurieren',
        description:
          'Erstellen Sie eine Messaging-Richtlinie, um Chat-Funktionen wie Nachrichtenbearbeitung, Loeschung, Lesebestaetigungen und die Verwendung von GIFs, Memes und Stickern zu steuern. Verschiedene Richtlinien koennen verschiedenen Benutzergruppen zugewiesen werden.',
      },
      {
        title: 'Besprechungsrichtlinie konfigurieren',
        description:
          'Erstellen Sie Besprechungsrichtlinien, um zu steuern, wer Besprechungen starten kann, Aufzeichnungsberechtigungen, Lobby-Einstellungen und Bildschirmfreigabefunktionen. Dies ist entscheidend fuer die Sicherung von Besprechungen mit externen Teilnehmern.',
        warning: 'Das Setzen von AutoAdmittedUsers auf "Everyone" erlaubt anonymen Benutzern den Beitritt ohne Warten in der Lobby. Verwenden Sie dies nur fuer oeffentliche Webinare.',
      },
      {
        title: 'App-Berechtigungsrichtlinie konfigurieren',
        description:
          'Steuern Sie, welche Drittanbieter- und benutzerdefinierten Apps Benutzer in Teams installieren koennen. Erstellen Sie Erlaubnislisten oder Sperrlisten, um die App-Verfuegbarkeit organisationsweit oder fuer bestimmte Gruppen zu regeln.',
      },
      {
        title: 'Anrufrichtlinie konfigurieren',
        description:
          'Richten Sie Anrufrichtlinien ein, um Anrufweiterleitung, Delegierung, Voicemail und Besetzt-bei-Besetzt-Einstellungen fuer Benutzer mit Teams Phone-Lizenzen zu verwalten.',
        note: 'Anrufrichtlinien betreffen nur Benutzer mit einer Teams Phone-Lizenz. Benutzer ohne diese Lizenz sehen keine Anruffunktionen, unabhaengig von der Richtlinie.',
      },
      {
        title: 'Liveereignis-Richtlinie erstellen',
        description:
          'Konfigurieren Sie Liveereignis-Richtlinien, um zu steuern, wer Liveereignisse planen kann, die maximale Zielgruppengroesse, Aufzeichnungsoptionen und ob Teilnehmer waehrend des Ereignisses Fragen stellen koennen.',
      },
      {
        title: 'Richtlinien Benutzern und Gruppen zuweisen',
        description:
          'Weisen Sie die erstellten Richtlinien einzelnen Benutzern, Sicherheitsgruppen zu oder legen Sie sie als organisationsweiten Standard fest. Die gruppenbasierte Richtlinienzuweisung ist der empfohlene Ansatz fuer grosse Organisationen.',
        note: 'Gruppenrichtlinienzuweisungen koennen bis zu 72 Stunden benoetigen, um an alle Gruppenmitglieder weitergegeben zu werden. Einzelne Zuweisungen werden innerhalb weniger Stunden wirksam.',
      },
      {
        title: 'Richtlinienzuweisungen testen und validieren',
        description:
          'Ueberpruefen Sie, ob Richtlinien korrekt zugewiesen und wirksam sind. Verwenden Sie PowerShell, um die effektive Richtlinie fuer einen Benutzer zu ueberpruefen, die direkte Zuweisungen, Gruppenzuweisungen und den globalen Standard beruecksichtigt.',
      },
      {
        title: 'Richtlinienkonfiguration auditieren und dokumentieren',
        description:
          'Exportieren Sie alle Teams-Richtlinien und deren Zuweisungen fuer Dokumentations- und Compliance-Zwecke. Regelmaessige Audits helfen, die Richtlinienkonsistenz sicherzustellen und Abweichungen zu identifizieren.',
      },
    ],
  },

  // ── 5. Teams Rooms einrichten (11 Schritte) ──────────────────────
  'm365-teams-rooms': {
    title: 'Teams Rooms einrichten',
    description:
      'Bereitstellen und konfigurieren Sie Microsoft Teams Rooms-Geraete fuer Konferenzraeume, einschliesslich Ressourcenkonto-Erstellung, Lizenzzuweisung, Geraeteeinrichtung, Peripheriekonfiguration und Ueberwachung.',
    prerequisites: [
      'Microsoft Teams Rooms Basic- oder Pro-Lizenz',
      'Teams-Administrator- und Exchange-Administrator-Rollen',
      'Teams Rooms-zertifizierte Hardware (Logitech, Poly, Yealink usw.)',
      'Netzwerkverbindung mit erforderlichen Firewallregeln',
    ],
    steps: [
      {
        title: 'Ressourcenkonto fuer den Raum erstellen',
        description:
          'Erstellen Sie ein dediziertes Ressourcenkonto in Microsoft 365 fuer den Teams Room. Dieses Konto repraesentiert den physischen Raum und verwaltet seinen Kalender. Das Konto muss vom Typ Raumpostfach sein.',
        warning: 'Verwenden Sie ein starkes, eindeutiges Passwort fuer jedes Raumkonto. Speichern Sie Passwoerter in einem sicheren Tresor, da sie waehrend der Geraeteeinrichtung benoetigt werden.',
      },
      {
        title: 'Raumpostfach-Einstellungen konfigurieren',
        description:
          'Legen Sie Kalenderverarbeitungsoptionen fest, um Besprechungseinladungen automatisch zu akzeptieren, den Betreff fuer den Datenschutz zu entfernen und das Buchungsfenster zu konfigurieren. Diese Einstellungen stellen sicher, dass der Raumkalender genau bleibt.',
        note: 'Das Setzen von DeleteSubject auf $false ermoeglicht es dem Raumdisplay, Besprechungstitel anzuzeigen. Einige Organisationen bevorzugen $true fuer den Datenschutz.',
      },
      {
        title: 'Teams Rooms-Lizenz zuweisen',
        description:
          'Weisen Sie dem Ressourcenkonto die entsprechende Teams Rooms-Lizenz zu. Teams Rooms Basic ist fuer bis zu 25 Raeume kostenlos; Teams Rooms Pro bietet erweiterte Verwaltungs- und Ueberwachungsfunktionen.',
      },
      {
        title: 'Kennwortablaufrichtlinie konfigurieren',
        description:
          'Deaktivieren Sie den Kennwortablauf fuer das Raumkonto, um zu verhindern, dass das Geraet die Konnektivitaet verliert, wenn das Kennwort ablaeuft. Teams Rooms-Geraete koennen keine Aufforderungen zum Kennwortwechsel bearbeiten.',
        warning: 'Wenn Ihre Organisation den Kennwortablauf ueber bedingten Zugriff erzwingt, muessen Sie eine Ausnahme fuer Teams Rooms-Konten erstellen.',
      },
      {
        title: 'Ausnahmen fuer bedingten Zugriff konfigurieren',
        description:
          'Schliessen Sie Teams Rooms-Konten von Richtlinien fuer bedingten Zugriff aus, die MFA oder Geraetekonformitaet erfordern, da diese Geraete keine interaktiven Eingabeaufforderungen bearbeiten koennen. Erstellen Sie eine dedizierte Ausschlussgruppe fuer Raumkonten.',
        note: 'Erstellen Sie eine Sicherheitsgruppe namens "Teams Rooms-Konten" und fuegen Sie alle Raumkonten hinzu. Verwenden Sie diese Gruppe fuer Ausschleusse in allen relevanten CA-Richtlinien.',
      },
      {
        title: 'Physisches Geraet einrichten',
        description:
          'Schalten Sie das Teams Rooms-Geraet ein und fuehren Sie den Ersteinrichtungsassistenten durch. Verbinden Sie das Geraet mit dem Netzwerk, melden Sie sich mit den Ressourcenkonto-Anmeldedaten an und koppeln Sie Peripheriegeraete (Kamera, Mikrofon, Lautsprecher, Display).',
        warning: 'Stellen Sie sicher, dass die Geraete-Firmware aktuell ist, bevor Sie sich anmelden. Veraltete Firmware kann Konnektivitaets- oder Funktionsprobleme verursachen.',
      },
      {
        title: 'Raumperipheriegeraete konfigurieren',
        description:
          'Konfigurieren Sie in den Teams Rooms-Geraeteeinstellungen die angeschlossenen Peripheriegeraete. Legen Sie die Standardkamera, das Standardmikrofon und den Standardlautsprecher fest. Aktivieren Sie intelligente Lautsprecherfunktionen, wenn die Hardware dies unterstuetzt, fuer die Sprecherzuordnung in Transkripten.',
        note: 'Verwenden Sie Teams Rooms-zertifizierte Peripheriegeraete, um volle Kompatibilitaet sicherzustellen. Nicht-zertifizierte Geraete koennen funktionieren, werden aber von Microsoft nicht unterstuetzt.',
      },
      {
        title: 'Proximity Join und Bluetooth-Beaconing konfigurieren',
        description:
          'Aktivieren Sie Bluetooth-Beaconing, damit Benutzer im Raum das Teams Room-Geraet erkennen und Besprechungen direkt von ihrem Laptop oder Mobilgeraet mit einem Klick beitreten koennen.',
      },
      {
        title: 'Teams Rooms Pro Management einrichten',
        description:
          'Konfigurieren Sie bei Verwendung von Teams Rooms Pro-Lizenzen das Teams Rooms Pro Management Portal fuer Remote-Ueberwachung, Alarmierung und Geraeteverwaltung ueber alle Ihre Raeume hinweg.',
        note: 'Teams Rooms Pro Management bietet automatische Vorfallerkennung, Update-Verwaltung und detaillierte Analyse-Dashboards.',
      },
      {
        title: 'Raumeinrichtung testen',
        description:
          'Planen Sie eine Testbesprechung von Outlook aus, treten Sie der Besprechung auf dem Raumgeraet bei und ueberpruefen Sie Audio-, Video-, Bildschirmfreigabe- und Whiteboard-Funktionalitaet. Testen Sie Proximity Join von einem Laptop im Raum.',
      },
      {
        title: 'Raumkonfiguration dokumentieren',
        description:
          'Dokumentieren Sie die Einrichtungsdetails des Raumes, einschliesslich Hardwaremodell, Firmware-Version, Peripheriegeraeteliste, Netzwerkkonfiguration und Kontoanmeldedaten (sicher gespeichert). Diese Dokumentation ist fuer die Fehlerbehebung und zukuenftige Bereitstellungen unabdingbar.',
      },
    ],
  },

  // ── 6. Teams-Telefonsystem konfigurieren (12 Schritte) ───────────
  'm365-teams-phone': {
    title: 'Teams-Telefonsystem konfigurieren',
    description:
      'Richten Sie das Microsoft Teams-Telefonsystem mit Anrufplaenen oder Direct Routing ein. Umfasst Lizenzzuweisung, Rufnummernerwerb, Waehlplaene, automatische Telefonzentralen, Anrufwarteschlangen, Voicemail und Notrufikonfiguration.',
    prerequisites: [
      'Microsoft Teams Phone-Lizenz (eigenstaendig oder als Teil von E5)',
      'Anrufplan-Lizenz oder SBC fuer Direct Routing',
      'Teams-Administrator- und Globaler-Administrator-Rollen',
      'Bei Microsoft registrierte Notfalladresse',
    ],
    steps: [
      {
        title: 'Telefoniebereitstellung planen',
        description:
          'Entscheiden Sie zwischen Microsoft-Anrufplaenen (cloudbasiertes PSTN) und Direct Routing (eigener SBC/Carrier). Anrufplaene sind einfacher bereitzustellen, aber in weniger Laendern verfuegbar. Direct Routing bietet Carrier-Flexibilitaet, erfordert aber einen lokalen oder Cloud-SBC.',
        note: 'Fuer Organisationen mit bestehenden Telefonievertraegen oder in Laendern ohne Anrufplan-Verfuegbarkeit ist Direct Routing der empfohlene Ansatz. Operator Connect ist eine hybride Option, die von zertifizierten Carriern verwaltet wird.',
      },
      {
        title: 'Teams Phone-Lizenzen zuweisen',
        description:
          'Weisen Sie allen Benutzern, die PSTN-Anrufe benoetigen, Microsoft Teams Phone System-Lizenzen zu. Wenn Sie Anrufplaene verwenden, weisen Sie zusaetzlich eine Lizenz fuer einen nationalen oder internationalen Anrufplan zu.',
      },
      {
        title: 'Telefonnummern erwerben',
        description:
          'Beziehen Sie Telefonnummern von Microsoft (fuer Anrufplaene) oder portieren Sie vorhandene Nummern von Ihrem aktuellen Carrier. Fuer Direct Routing werden Telefonnummern von Ihrem SBC/Carrier verwaltet.',
        warning: 'Die Rufnummernportierung kann 2-4 Wochen dauern. Planen Sie Ihren Migrationszeitplan entsprechend und behalten Sie Ihren bestehenden Telefondienst bei, bis die Portierung abgeschlossen ist.',
      },
      {
        title: 'Telefonnummern Benutzern zuweisen',
        description:
          'Weisen Sie die erworbenen Telefonnummern lizenzierten Benutzern zu. Jedem Benutzer kann eine Telefonnummer zugewiesen werden. Die Nummer wird zur Durchwahlnummer (DID) des Benutzers.',
      },
      {
        title: 'Waehlplan konfigurieren',
        description:
          'Erstellen Sie einen Waehlplan, um gewaehlte Nummern zu normalisieren. Waehlplaene uebersetzen kurze Nebenstellen oder lokale Waehlmuster in vollstaendige E.164-Nummern fuer die Anrufweiterleitung.',
      },
      {
        title: 'Automatische Telefonzentrale einrichten',
        description:
          'Erstellen Sie eine automatische Telefonzentrale, um Anrufer zu begruessen und sie an die richtige Abteilung oder Person weiterzuleiten. Konfigurieren Sie Geschaeftszeiten, Begruessung ausserhalb der Geschaeftszeiten und Menueooptionen.',
        note: 'Die Anwendungs-ID ce933385-9390-45d1-9512-c8d228074e07 ist die feste ID fuer automatische Telefonzentralen. Verwenden Sie 11cd3e2e-fccb-42ad-ad00-878b93575e07 fuer Anrufwarteschlangen.',
      },
      {
        title: 'Anrufwarteschlange einrichten',
        description:
          'Erstellen Sie eine Anrufwarteschlange, um eingehende Anrufe auf eine Gruppe von Agenten zu verteilen. Konfigurieren Sie die Routing-Methode, Wartemusik, Timeout-Aktionen und Ueberlaufbehandlung.',
      },
      {
        title: 'Voicemail-Richtlinien konfigurieren',
        description:
          'Richten Sie Voicemail-Richtlinien ein, um Transkription, Begruesungslaenge und Voicemail-Empfangsregeln fuer Ihre Organisation zu steuern.',
      },
      {
        title: 'Notrufkonfiguration einrichten',
        description:
          'Richten Sie Notrufadressen und -richtlinien ein. Dies ist in den meisten Laendern eine regulatorische Anforderung. Konfigurieren Sie dynamische Notrufe, um den Standort des Anrufers automatisch anhand von Netzwerkinformationen zu bestimmen.',
        warning: 'Die Notrufkonfiguration ist eine gesetzliche Anforderung. Eine falsche Einrichtung kann zu fehlgeschlagenen Notrufen und regulatorischen Strafen fuehren. Testen Sie gruendlich und ueberpruefen Sie die Konfiguration mit Ihrem lokalen Notdienstanbieter.',
      },
      {
        title: 'Direct Routing konfigurieren (falls zutreffend)',
        description:
          'Konfigurieren Sie bei Verwendung von Direct Routing die SBC-Verbindung und Sprach-Routing-Richtlinien. Der SBC muss ein oeffentliches Zertifikat besitzen und von Microsoft 365 aus erreichbar sein.',
        note: 'Stellen Sie sicher, dass Ihr SBC TLS 1.2 unterstuetzt und ein Zertifikat einer vertrauenswuerdigen Zertifizierungsstelle besitzt. Selbstsignierte Zertifikate werden fuer Direct Routing nicht unterstuetzt.',
      },
      {
        title: 'Telefonsystem testen und validieren',
        description:
          'Fuehren Sie End-to-End-Tests fuer eingehende und ausgehende Anrufe, Navigation der automatischen Telefonzentrale, Verteilung der Anrufwarteschlange, Voicemail und Notrufe durch. Dokumentieren Sie die Testergebnisse fuer die Compliance.',
        warning: 'Testen Sie Notrufe immer in Abstimmung mit Ihrem SBC-Anbieter und den oertlichen Rettungsdiensten. Setzen Sie keine Test-Notrufe (110/112) ohne vorherige Absprache ab.',
      },
    ],
  },

  // ── 7. SharePoint-Website erstellen und verwalten (7 Schritte) ───
  'm365-sharepoint-site': {
    title: 'SharePoint-Website erstellen und verwalten',
    description:
      'Erstellen Sie eine SharePoint Online-Websitesammlung, konfigurieren Sie die Navigation, legen Sie Berechtigungen fest, aktivieren Sie Versionierung und passen Sie die Website fuer Teamzusammenarbeit oder Veroeffentlichung an.',
    prerequisites: [
      'SharePoint Online-Lizenz',
      'SharePoint-Administrator- oder Globaler-Administrator-Rolle',
      'PnP PowerShell-Modul (optional, fuer erweiterte Verwaltung)',
    ],
    steps: [
      {
        title: 'Neue SharePoint-Website erstellen',
        description:
          'Erstellen Sie eine neue Teamwebsite oder Kommunikationswebsite ueber das SharePoint Admin Center oder PowerShell. Teamwebsites sind mit Microsoft 365-Gruppen verbunden; Kommunikationswebsites sind eigenstaendig und fuer die Informationsverbreitung konzipiert.',
        note: 'Teamwebsites erstellen automatisch eine zugehoerige Microsoft 365-Gruppe, ein Teams-Team und ein freigegebenes Postfach. Kommunikationswebsites tun dies nicht.',
      },
      {
        title: 'Websiteberechtigungen konfigurieren',
        description:
          'Richten Sie die Berechtigungsstruktur fuer die Website ein. SharePoint verwendet eine Hierarchie von Websitebesitzern, Mitgliedern und Besuchern. Unterbrechen Sie die Berechtigungsvererbung bei Bibliotheken oder Ordnern, wenn unterschiedliche Zugriffsebenen erforderlich sind.',
        warning: 'Vermeiden Sie das Unterbrechen der Berechtigungsvererbung, es sei denn, es ist unbedingt erforderlich. Dies macht die Berechtigungsverwaltung komplex und kann zu Sicherheitsluecken fuehren.',
      },
      {
        title: 'Versionierung und Inhaltsgenehmigung aktivieren',
        description:
          'Aktivieren Sie den Versionsverlauf fuer Dokumentbibliotheken, um Aenderungen nachzuverfolgen und Ruecksetzungen zu ermoeglichen. Konfigurieren Sie die Inhaltsgenehmigung, wenn Dokumente vor der Sichtbarkeit fuer alle Websitemitglieder ueberprueft werden muessen.',
        note: 'Hauptversionen (1.0, 2.0) sind fuer alle Benutzer sichtbar. Nebenversionen (1.1, 1.2) sind nur fuer Redakteure sichtbar, bis sie als Hauptversion veroeffentlicht werden.',
      },
      {
        title: 'Websitenavigation konfigurieren',
        description:
          'Passen Sie die Websitenavigation an, um Benutzern beim Auffinden von Inhalten zu helfen. Konfigurieren Sie die obere Navigationsleiste fuer Hauptbereiche und den Schnellstart (linke Navigation) fuer haeufig verwendete Bibliotheken und Seiten.',
      },
      {
        title: 'Dokumentbibliotheken und Listen erstellen',
        description:
          'Erstellen Sie zusaetzliche Dokumentbibliotheken zum Organisieren von Inhalten nach Thema oder Abteilung. Fuegen Sie Bibliotheken und Listen benutzerdefinierte Spalten fuer Metadaten-Tagging und Filterung hinzu.',
      },
      {
        title: 'Websitedesign und Branding anwenden',
        description:
          'Wenden Sie ein Websitedesign an, um das Erscheinungsbild in Ihrer Organisation zu standardisieren. Konfigurieren Sie das Website-Logo, die Designfarben und das Header-Layout fuer Markenkonsistenz.',
      },
      {
        title: 'Website ueberpruefen und testen',
        description:
          'Testen Sie die Website durch Hochladen von Dokumenten, Ueberpruefen der Berechtigungen mit verschiedenen Benutzerkonten, Verifizieren der Navigationslinks und Bestaetigen, dass Versionierung und Inhaltsgenehmigung wie erwartet funktionieren.',
      },
    ],
  },

  // ── 8. OneDrive-Synchronisierungsrichtlinien konfigurieren (8 Schritte) ──
  'm365-onedrive-policies': {
    title: 'OneDrive-Synchronisierungsrichtlinien konfigurieren',
    description:
      'Richten Sie OneDrive for Business-Synchronisierungsrichtlinien ueber Gruppenrichtlinien, Intune und das SharePoint Admin Center ein. Umfasst Sync-Client-Konfiguration, Verschiebung bekannter Ordner, Speicherlimits, Freigabeeinschraenkungen und Files-On-Demand-Einstellungen.',
    prerequisites: [
      'OneDrive for Business-Lizenz (in Microsoft 365 enthalten)',
      'SharePoint-Administrator- oder Globaler-Administrator-Rolle',
      'Gruppenrichtlinien-Verwaltungstools oder Microsoft Intune fuer Client-Einstellungen',
    ],
    steps: [
      {
        title: 'Mandantenweite OneDrive-Einstellungen konfigurieren',
        description:
          'Legen Sie globale OneDrive-Richtlinien im SharePoint Admin Center fest. Konfigurieren Sie Standard-Speicherlimits, Freigabestandards und Synchronisierungseinschraenkungen, die fuer alle Benutzer gelten.',
      },
      {
        title: 'Freigaberichtlinien konfigurieren',
        description:
          'Legen Sie Freigabeeinschraenkungen fest, um zu steuern, wie Benutzer OneDrive-Dateien extern freigeben. Konfigurieren Sie Linktypen, Ablaufdaten und ob Benutzer mit jedem oder nur mit authentifizierten Gaesten teilen koennen.',
        warning: 'Das Aendern von Freigaberichtlinien wirkt sich auf alle vorhandenen freigegebenen Links aus. Ueberpruefen Sie die aktuelle Freigabeaktivitaet, bevor Sie restriktive Aenderungen vornehmen, um aktive Zusammenarbeiten nicht zu unterbrechen.',
      },
      {
        title: 'Verschiebung bekannter Ordner (KFM) aktivieren',
        description:
          'Konfigurieren Sie die Verschiebung bekannter Ordner, um Desktop-, Dokumente- und Bilder-Ordner automatisch zu OneDrive umzuleiten. Dies bietet automatisches Backup und ermoeglicht das Roaming zwischen Geraeten.',
        note: 'KFM leitet Ordner unbemerkt um, ohne Benutzerinteraktion. Benutzer, die Dateien in diesen Ordnern haben, sehen, dass diese automatisch mit OneDrive synchronisiert werden. Testen Sie zuerst mit einer Pilotgruppe.',
      },
      {
        title: 'Files On-Demand konfigurieren',
        description:
          'Aktivieren Sie Files On-Demand, um lokalen Speicherplatz zu sparen. Dateien erscheinen im Datei-Explorer, werden aber erst beim Oeffnen heruntergeladen. Dies ist besonders wichtig fuer Geraete mit begrenztem Speicher.',
        note: 'Files On-Demand erfordert Windows 10 1709 oder hoeher. Unter macOS erfordert es macOS 12.1 oder hoeher mit der eigenstaendigen OneDrive-App.',
      },
      {
        title: 'Synchronisierung auf verwaltete Geraete beschraenken',
        description:
          'Verhindern Sie, dass Benutzer OneDrive mit nicht verwalteten persoenlichen Geraeten synchronisieren. Dies stellt sicher, dass Unternehmensdaten nur auf konformen, von der IT verwalteten Geraeten verfuegbar sind.',
        warning: 'Das Einschraenken der Synchronisierung auf verwaltete Geraete stoppt die Synchronisierung auf nicht verwalteten Geraeten sofort. Warnen Sie Benutzer, bevor Sie diese Einstellung aktivieren.',
      },
      {
        title: 'Bandbreitendrosselung konfigurieren',
        description:
          'Legen Sie Upload- und Download-Bandbreitenlimits fuer den OneDrive-Sync-Client fest, um eine Netzwerksaettigung zu verhindern, insbesondere waehrend der ersten KFM-Einfuehrung oder an Standorten mit begrenzter Bandbreite.',
        note: 'Die automatische Bandbreitenverwaltung verwendet das LEDBAT-Protokoll, um die verfuegbare Bandbreite zu erkennen und passt sich dynamisch an. Dies ist in den meisten Szenarien festen Limits vorzuziehen.',
      },
      {
        title: 'OneDrive-Aufbewahrung und Compliance einrichten',
        description:
          'Konfigurieren Sie Aufbewahrungsrichtlinien fuer OneDrive-Dateien nach der Loeschung eines Benutzerkontos. Standardmaessig werden geloeschte Benutzer-OneDrive-Inhalte 30 Tage aufbewahrt, koennen aber auf bis zu 10 Jahre verlaengert werden.',
      },
      {
        title: 'OneDrive-Nutzung ueberwachen und berichten',
        description:
          'Verwenden Sie die Berichte des Microsoft 365 Admin Centers und PowerShell, um die OneDrive-Akzeptanz, Speichernutzung, Synchronisierungsstatus und Freigabeaktivitaet in Ihrer Organisation zu ueberwachen.',
      },
    ],
  },

  // ── 9. Lizenzzuweisung automatisieren (7 Schritte) ───────────────
  'm365-license-management': {
    title: 'Lizenzzuweisung automatisieren',
    description:
      'Automatisieren Sie die Microsoft 365-Lizenzzuweisung mithilfe der gruppenbasierten Azure AD-Lizenzierung, Microsoft Graph PowerShell und Ueberwachungsskripten. Umfasst Lizenzbestand, gruppenbasierte Zuweisung, Dienstplananpassung und Fehlerbehandlung.',
    prerequisites: [
      'Azure AD Premium P1- oder P2-Lizenz (fuer gruppenbasierte Lizenzierung)',
      'Globaler Administrator oder Lizenzadministrator',
      'Microsoft Graph PowerShell-Modul',
    ],
    steps: [
      {
        title: 'Aktuellen Lizenzbestand ueberpruefen',
        description:
          'Beginnen Sie mit der Ueberpruefung Ihrer aktuellen Lizenzzuweisungen und Verfuegbarkeit. Verstehen Sie, welche SKUs verwendet werden, wie viele verbraucht sind und wie viele fuer die Zuweisung verfuegbar sind.',
        note: 'Fuehren Sie diese Ueberpruefung monatlich durch, um ungenutzte Lizenzen zu identifizieren, die zurueckgefordert oder neu zugewiesen werden koennen.',
      },
      {
        title: 'Gruppenbasierte Lizenzierung einrichten',
        description:
          'Erstellen Sie Azure AD-Sicherheitsgruppen fuer jeden Lizenztyp. Wenn Benutzer diesen Gruppen hinzugefuegt werden, werden Lizenzen automatisch zugewiesen. Beim Entfernen werden Lizenzen automatisch zurueckgefordert.',
      },
      {
        title: 'Lizenzen mit Dienstplananpassung Gruppen zuweisen',
        description:
          'Weisen Sie Gruppen Lizenz-SKUs zu und deaktivieren Sie optional bestimmte Dienstplaene. Weisen Sie beispielsweise eine E3-Lizenz zu, deaktivieren Sie aber Yammer oder Sway, wenn diese Dienste nicht benoetigt werden.',
        note: 'Deaktivierte Dienstplaene koennen spaeter erneut aktiviert werden, ohne die Lizenz entfernen und neu zuweisen zu muessen. Dies ist nuetzlich fuer phasenweise Dienstrollouts.',
      },
      {
        title: 'Dynamische Gruppenregeln fuer automatische Mitgliedschaft erstellen',
        description:
          'Verwenden Sie dynamische Mitgliedschaftsregeln, um Benutzer basierend auf Attributen wie Abteilung, Berufsbezeichnung oder Standort automatisch zu Lizenzgruppen hinzuzufuegen. Dies automatisiert den Lizenzlebenszyklus vollstaendig.',
        warning: 'Testen Sie dynamische Gruppenregeln zuerst mit einem kleinen Umfang. Eine falsche Regel koennte allen Benutzern in Ihrem Mandanten Lizenzen zuweisen und Ihren gesamten Lizenzpool verbrauchen.',
      },
      {
        title: 'Lizenzzuweisungsfehler behandeln',
        description:
          'Ueberwachen Sie die gruppenbasierte Lizenzierung auf Fehler. Haeufige Probleme sind unzureichende Lizenzen, widersprüchliche Dienstplaene und nicht gesetzte Nutzungsstandorte. Erstellen Sie ein Skript zur Erkennung und Meldung dieser Fehler.',
        note: 'Der haeufigste Fehler ist ein fehlender UsageLocation. Setzen Sie dieses Attribut fuer alle Benutzer, bevor Sie Lizenzen zuweisen.',
      },
      {
        title: 'Nutzungsstandort fuer Benutzer massenweise festlegen',
        description:
          'Der Nutzungsstandort ist fuer die Lizenzzuweisung erforderlich. Erstellen Sie ein Skript, um den Nutzungsstandort fuer alle Benutzer festzulegen, bei denen er fehlt, basierend auf ihrem Buerostandort oder einem Standard-Laendercode.',
      },
      {
        title: 'Lizenznutzung ueberwachen und berichten',
        description:
          'Erstellen Sie automatisierte Berichte, um den Lizenzverbrauch zu verfolgen, ungenutzte Lizenzen zu identifizieren und zukuenftigen Bedarf zu prognostizieren. Planen Sie die woechentliche oder monatliche Ausfuehrung dieser Berichte.',
      },
    ],
  },

  // ── 10. DLP-Richtlinie erstellen (10 Schritte) ──────────────────
  'm365-dlp-policy': {
    title: 'DLP-Richtlinie erstellen',
    description:
      'Konfigurieren Sie Richtlinien zur Verhinderung von Datenverlust (DLP) in Microsoft Purview, um sensible Informationen in Exchange, SharePoint, OneDrive und Teams zu erkennen und zu schuetzen. Umfasst Richtlinienerstellung, Typen sensibler Informationen, benutzerdefinierte Regeln und Incident-Management.',
    prerequisites: [
      'Microsoft 365 E3/E5- oder Microsoft Purview Information Protection-Lizenz',
      'Compliance-Administrator- oder Globaler-Administrator-Rolle',
      'Security & Compliance PowerShell-Modul',
    ],
    steps: [
      {
        title: 'DLP-Strategie planen',
        description:
          'Identifizieren Sie die Arten sensibler Informationen, die Ihre Organisation verarbeitet (Kreditkartennummern, Sozialversicherungsnummern, Gesundheitsdaten, Finanzdaten) und bestimmen Sie, welche Speicherorte geschuetzt werden muessen. Ordnen Sie regulatorische Anforderungen (DSGVO, HIPAA, PCI-DSS) spezifischen Typen sensibler Informationen zu.',
        note: 'Beginnen Sie mit einer Testrichtlinie im Simulationsmodus, bevor Sie sie durchsetzen. Dies ermoeglicht es Ihnen, False-Positive-Raten zu messen und Regeln anzupassen, ohne Benutzer zu beeintraechtigen.',
      },
      {
        title: 'Verbindung zu Security & Compliance PowerShell herstellen',
        description:
          'Verbinden Sie sich mit der Security & Compliance Center PowerShell, um DLP-Richtlinien programmatisch zu verwalten. Dies bietet vollstaendigen Zugriff auf DLP-Cmdlets, die in der GUI nicht verfuegbar sind.',
      },
      {
        title: 'Integrierte Typen sensibler Informationen ueberpruefen',
        description:
          'Microsoft 365 enthaelt ueber 300 integrierte Typen sensibler Informationen (SITs). Ueberpruefen Sie die verfuegbaren Typen, um solche zu finden, die Ihren Datenklassifizierungsanforderungen entsprechen, bevor Sie benutzerdefinierte Typen erstellen.',
      },
      {
        title: 'Benutzerdefinierten Typ sensibler Informationen erstellen (optional)',
        description:
          'Wenn integrierte Typen Ihre Anforderungen nicht abdecken, erstellen Sie einen benutzerdefinierten Typ sensibler Informationen mit regulaeren Ausdruecken, Schluesselwortlisten oder exakter Datenuebereinstimmung. Dies ist ueblich fuer Mitarbeiter-IDs, Projektcodes oder proprietaere Datenformate.',
        note: 'Benutzerdefinierte SITs unterstuetzen Regex, Schluesselwort-Woerterbueccher und exakte Datenuebereinstimmung (EDM). EDM wird fuer grosse Datensaetze wie Kundendatenbanken empfohlen.',
      },
      {
        title: 'DLP-Richtlinie erstellen',
        description:
          'Erstellen Sie eine neue DLP-Richtlinie, die auf die gewuenschten Speicherorte abzielt (Exchange, SharePoint, OneDrive, Teams). Beginnen Sie im Simulationsmodus, um die Auswirkungen vor der Durchsetzung zu bewerten.',
        warning: 'Beginnen Sie immer im TestWithNotifications-Modus (Simulation). Ein direkter Wechsel zur Durchsetzung kann legitime Geschaeftskommunikation blockieren.',
      },
      {
        title: 'DLP-Regeln mit Bedingungen und Aktionen erstellen',
        description:
          'Fuegen Sie der Richtlinie Regeln hinzu, die definieren, welche sensiblen Daten erkannt und welche Aktionen ergriffen werden sollen. Konfigurieren Sie Regeln fuer niedrige und hohe Anzahlen mit unterschiedlichen Schweregrade.',
        note: 'Der Vertrauensstufen-Parameter steuert, wie streng die Erkennung ist. Hoehere Werte reduzieren Fehlalarme, koennten aber einige Treffer verpassen. 85 ist ein guter Standardwert fuer die meisten SITs.',
      },
      {
        title: 'Benutzerbenachrichtigungen und Richtlinientipps konfigurieren',
        description:
          'Richten Sie Richtlinientipps ein, die Benutzer in Echtzeit warnen, wenn sie sensible Daten teilen wollen. Konfigurieren Sie E-Mail-Benachrichtigungen fuer Compliance-Beauftragte, wenn Vorfaelle erkannt werden.',
      },
      {
        title: 'Ausser-Kraft-Setzung und Geschaeftsbegruendung konfigurieren',
        description:
          'Ermoeglichen Sie Benutzern, DLP-Blockierungen mit einer Geschaeftsbegruendung ausser Kraft zu setzen. Dies bietet Flexibilitaet bei gleichzeitiger Aufrechterhaltung eines Audit-Trails aller Entscheidungen zur Ausser-Kraft-Setzung.',
        warning: 'Ausser-Kraft-Setzungsaktivitaeten werden protokolliert und sind ueberpruefbar. Ueberpruefen Sie regelmaessig die Berichte zu Ausser-Kraft-Setzungen, um Benutzer zu identifizieren, die DLP-Richtlinien haeufig umgehen.',
      },
      {
        title: 'Simulationsergebnisse ueberpruefen und Richtlinie optimieren',
        description:
          'Ueberpruefen Sie nach 1-2 Wochen im Simulationsmodus die DLP-Berichte, um die Wirksamkeit der Richtlinie zu bewerten. Passen Sie Vertrauensstufen an, fuegen Sie Ausnahmen hinzu oder aendern Sie Regeln basierend auf den Simulationsdaten.',
        note: 'Konzentrieren Sie sich auf die False-Positive-Raten. Wenn eine Regel mehr als 5 % Fehlalarme generiert, erwaegen Sie eine Erhoehung der Vertrauensstufe oder das Hinzufuegen von Ausschleussen.',
      },
      {
        title: 'Durchsetzung aktivieren und laufende Ueberwachung',
        description:
          'Wenn Sie mit den Simulationsergebnissen zufrieden sind, wechseln Sie die Richtlinie in den Durchsetzungsmodus. Richten Sie fortlaufende Ueberwachungs-Dashboards und Alarmregeln fuer DLP-Vorfaelle ein.',
        warning: 'Ueberwachen Sie nach der Aktivierung der Durchsetzung die Alarmwarteschlange in den ersten 48 Stunden genau. Seien Sie darauf vorbereitet, bei uebermassigen Fehlalarmen, die den Geschaeftsbetrieb stoeren, in den Simulationsmodus zurueckzuwechseln.',
      },
    ],
  },
}

export default m365GuidesDe
