export interface GuideTranslation {
  title: string
  description: string
  prerequisites?: string[]
  steps: {
    title: string
    description: string
    note?: string
    warning?: string
  }[]
}

const intuneGuidesDe: Record<string, GuideTranslation> = {
  // ── 1. Windows Autopilot einrichten (12 Schritte) ─────────────
  'intune-autopilot-setup': {
    title: 'Windows Autopilot einrichten',
    description:
      'Konfigurieren Sie Windows Autopilot für die automatisierte Gerätebereitstellung, einschließlich Hardware-Hash-Registrierung, Bereitstellungsprofile, Enrollment Status Page und End-to-End-Tests.',
    prerequisites: [
      'Azure AD Premium P1- oder P2-Lizenz',
      'Microsoft Intune-Lizenz (eigenständig oder als Teil von EMS E3/E5)',
      'Globaler Administrator oder Intune-Administrator',
      'Netzwerkzugriff auf Microsoft-Registrierungsendpunkte',
    ],
    steps: [
      {
        title: 'Lizenzierung und Voraussetzungen prüfen',
        description:
          'Bestätigen Sie, dass Azure AD Premium P1 und Intune-Lizenzen dem Mandanten zugewiesen sind. Öffnen Sie das Microsoft 365 Admin Center und navigieren Sie zu Abrechnung > Lizenzen, um den Abonnementstatus zu überprüfen.',
        note: 'Wenn Sie Windows Autopilot für Vorabbereitstellung (White Glove) verwenden, wird Azure AD Premium P2 empfohlen.',
      },
      {
        title: 'Automatische MDM-Registrierung aktivieren',
        description:
          'Konfigurieren Sie in Azure Active Directory die automatische MDM-Registrierung, damit Geräte, die Azure AD beitreten, automatisch in Intune registriert werden.',
      },
      {
        title: 'Hardware-Hashes von vorhandenen Geräten erfassen',
        description:
          'Führen Sie ein PowerShell-Skript auf jedem Zielgerät aus, um den Hardware-Hash in eine CSV-Datei zu exportieren.',
        note: 'Sie können Hardware-Hashes auch von Ihrem OEM oder Hardwareanbieter anfordern. Dell, HP und Lenovo unterstützen alle den direkten Upload der Hashes in Ihren Mandanten.',
      },
      {
        title: 'Hashes von mehreren Geräten sammeln',
        description:
          'Führen Sie für große Bereitstellungen das Sammelskript auf vielen Rechnern aus und führen Sie die Ergebnisse in einer einzigen CSV zusammen.',
      },
      {
        title: 'Hardware-Hashes in Intune importieren',
        description:
          'Navigieren Sie im Intune Admin Center zur Windows-Registrierung und importieren Sie die CSV-Datei. Der Importvorgang kann bis zu 15 Minuten dauern.',
        warning: 'Schließen Sie den Browser-Tab während des Imports nicht. Wenn der Import fehlschlägt, überprüfen Sie, ob das CSV-Format dem erwarteten Drei-Spalten-Schema entspricht.',
      },
      {
        title: 'Dynamische Azure AD-Gerätegruppe erstellen',
        description:
          'Erstellen Sie eine Azure AD-Gruppe mit einer dynamischen Geräte-Mitgliedschaftsregel, die auf Autopilot-Geräte abzielt.',
        note: 'Die Auswertung der dynamischen Gruppenmitgliedschaft kann 5-15 Minuten nach dem Import eines Geräts dauern.',
      },
      {
        title: 'Autopilot-Bereitstellungsprofil erstellen',
        description:
          'Erstellen Sie ein neues Windows Autopilot-Bereitstellungsprofil. Wählen Sie zwischen benutzergesteuertem oder selbstbereitstellendem Modus je nach Szenario.',
      },
      {
        title: 'Out-of-Box Experience (OOBE) konfigurieren',
        description:
          'Passen Sie im Bereitstellungsprofil die OOBE-Einstellungen an. Blenden Sie Datenschutzeinstellungen, EULA und Kontoänderungsoptionen nach Bedarf aus.',
        note: 'Verwenden Sie für Kiosk- oder gemeinsam genutzte Geräte den selbstbereitstellenden Profilmodus und überspringen Sie die Benutzerkontenzuweisung.',
      },
      {
        title: 'Enrollment Status Page (ESP) konfigurieren',
        description:
          'Aktivieren Sie die ESP, um den Bereitstellungsfortschritt während des Autopilot-Setups anzuzeigen. Konfigurieren Sie ein angemessenes Timeout (30-60 Minuten).',
        warning: 'Das Festlegen zu vieler erforderlicher Apps auf der ESP kann zu langen Wartezeiten oder Timeouts führen. Beginnen Sie mit 5-10 kritischen Apps und fügen Sie schrittweise weitere hinzu.',
      },
      {
        title: 'Bereitstellungsprofil der Gerätegruppe zuweisen',
        description:
          'Weisen Sie das Autopilot-Bereitstellungsprofil der zuvor erstellten dynamischen Azure AD-Gruppe zu.',
      },
      {
        title: 'Apps und Konfigurationsrichtlinien zuweisen',
        description:
          'Weisen Sie die erforderlichen Anwendungen und Konfigurationsprofile derselben Gerätegruppe zu. Diese werden während der ESP-Phase oder unmittelbar nach der Registrierung installiert.',
        note: 'Markieren Sie kritische Apps als "Erforderlich" und setzen Sie sie als blockierend auf der ESP. Nicht-kritische Apps können als "Verfügbar" für Benutzer-Self-Service festgelegt werden.',
      },
      {
        title: 'Autopilot-Bereitstellung testen',
        description:
          'Setzen Sie ein Testgerät auf Werkseinstellungen zurück und verbinden Sie es mit dem Internet. Das Gerät sollte automatisch das Autopilot-Profil empfangen.',
        warning: 'Das Zurücksetzen auf Werkseinstellungen löscht alle Daten auf dem Gerät. Führen Sie dies nur auf Testgeräten oder Geräten mit gesicherten Daten durch.',
      },
    ],
  },

  // ── 2. Win32 App deployen (10 Schritte) ───────────────────────
  'intune-win32-app-deploy': {
    title: 'Win32 App deployen',
    description:
      'Paketieren und Bereitstellen einer Win32-Anwendung über Intune mit dem IntuneWinAppUtil-Tool, einschließlich Erkennungsregeln, Anforderungsregeln und Gruppenzuweisung.',
    prerequisites: [
      'Microsoft Win32 Content Prep Tool (IntuneWinAppUtil.exe) heruntergeladen',
      'Anwendungsquelldateien (Installer, Konfigurationsdateien) in einem Ordner vorbereitet',
      'Intune-Administratorrolle',
    ],
    steps: [
      {
        title: 'Anwendungsquellordner vorbereiten',
        description:
          'Erstellen Sie einen dedizierten Ordner mit allen Dateien, die für die Anwendungsinstallation benötigt werden.',
        note: 'Halten Sie die Ordnerstruktur möglichst flach. Verschachtelte Ordner werden unterstützt, erhöhen aber die Paketkomplexität.',
      },
      {
        title: 'App mit IntuneWinAppUtil paketieren',
        description:
          'Führen Sie IntuneWinAppUtil.exe aus, um den Quellordner in ein .intunewin-Paket umzuwandeln.',
        note: 'Der Parameter -q führt das Tool im stillen Modus aus. -c ist der Quellordner, -s der Name der Setup-Datei und -o der Ausgabeordner.',
      },
      {
        title: 'Neue Win32-App in Intune erstellen',
        description:
          'Starten Sie im Intune Admin Center den Win32-App-Erstellungsassistenten. Wählen Sie die im vorherigen Schritt generierte .intunewin-Datei aus.',
      },
      {
        title: 'App-Informationen konfigurieren',
        description:
          'Füllen Sie den App-Namen, die Beschreibung, den Herausgeber und die Version aus. Fügen Sie bei Bedarf ein Logo hinzu.',
        note: 'Der App-Name und Herausgeber sind für Endbenutzer in der Unternehmensportal-App sichtbar.',
      },
      {
        title: 'Installations- und Deinstallationsbefehle definieren',
        description:
          'Geben Sie die Befehlszeilen für die stille Installation und Deinstallation an. Verwenden Sie die entsprechenden Schalter für Ihren Installer-Typ.',
        warning: 'Falsche Installationsbefehle sind die häufigste Ursache für Bereitstellungsfehler. Testen Sie den stillen Installationsbefehl immer manuell auf einem Testgerät, bevor Sie ihn über Intune bereitstellen.',
      },
      {
        title: 'Anforderungsregeln festlegen',
        description:
          'Definieren Sie die Mindest-OS-Version, Architektur (32-Bit oder 64-Bit) und Speicherplatzanforderungen.',
        note: 'Die Einstellung der OS-Architektur ist obligatorisch. Wählen Sie 64-Bit, es sei denn, die App erfordert ausdrücklich 32-Bit.',
      },
      {
        title: 'Erkennungsregeln konfigurieren',
        description:
          'Fügen Sie Erkennungsregeln hinzu, damit Intune feststellen kann, ob die App bereits installiert ist.',
        warning: 'Wenn Erkennungsregeln falsch konfiguriert sind, wird die App bei jedem Synchronisierungszyklus neu installiert oder nie als installiert angezeigt. Testen Sie Erkennungsregeln gründlich.',
      },
      {
        title: 'Rückgabecodes konfigurieren',
        description:
          'Überprüfen Sie die Standard-Rückgabecodes und fügen Sie bei Bedarf benutzerdefinierte hinzu.',
      },
      {
        title: 'App Gruppen zuweisen',
        description:
          'Weisen Sie die App als "Erforderlich" für Gruppen zu, die sie automatisch erhalten sollen, oder als "Verfügbar" für Self-Service-Installation.',
        note: 'Verwenden Sie "Verfügbar"-Zuweisungen für optionale Software, um Bandbreite zu sparen und Benutzern die Wahl zu lassen. Verwenden Sie "Erforderlich" für geschäftskritische Apps.',
      },
      {
        title: 'Bereitstellungsstatus überwachen',
        description:
          'Überwachen Sie die Bereitstellung über die App-Übersichtsseite. Prüfen Sie den Geräte- und Benutzerinstallationsstatus.',
      },
    ],
  },

  // ── 3. LOB App (MSI) deployen (7 Schritte) ────────────────────
  'intune-lob-msi-deploy': {
    title: 'LOB App (MSI) deployen',
    description:
      'Hochladen und Bereitstellen einer Branchenanwendung im MSI-Format über Intune mit minimaler Konfiguration, einschließlich Zuweisung und Installationsüberwachung.',
    prerequisites: [
      'MSI-Installationsdatei zum Upload bereit',
      'Intune-Administratorrolle',
    ],
    steps: [
      {
        title: 'LOB-App-Upload starten',
        description:
          'Fügen Sie im Intune Admin Center eine neue Branchenanwendung hinzu. Wählen Sie die MSI-Datei von Ihrem lokalen Rechner aus.',
      },
      {
        title: 'Auf Dateiverarbeitung warten',
        description:
          'Nach Auswahl der MSI-Datei verarbeitet und lädt Intune diese hoch. Schließen Sie den Browser-Tab nicht.',
        warning: 'Wenn der Upload fehlschlägt, überprüfen Sie Ihre Netzwerkverbindung und stellen Sie sicher, dass die MSI-Datei nicht beschädigt ist.',
      },
      {
        title: 'App-Informationen konfigurieren',
        description:
          'Überprüfen Sie die automatisch erkannten App-Informationen. Intune liest Name, Version, Herausgeber und Produktcode aus den MSI-Metadaten.',
        note: 'Der MSI-Produktcode wird automatisch für die Erkennung verwendet, sodass Sie keine Erkennungsregeln manuell konfigurieren müssen.',
      },
      {
        title: 'Befehlszeilenargumente festlegen (optional)',
        description:
          'Fügen Sie bei Bedarf zusätzliche msiexec-Befehlszeilenargumente hinzu.',
      },
      {
        title: 'App Gruppen zuweisen',
        description:
          'Weisen Sie die App als "Erforderlich" für automatische Bereitstellung oder als "Verfügbar" für Self-Service zu.',
      },
      {
        title: 'Installationsstatus überwachen',
        description:
          'Überprüfen Sie den Geräteinstallationsstatus, um zu verfolgen, welche Geräte die App erfolgreich installiert haben.',
      },
      {
        title: 'Auf einem Zielgerät überprüfen',
        description:
          'Lösen Sie auf einem Testgerät eine manuelle Intune-Synchronisierung aus und überprüfen Sie, ob die Anwendung installiert wurde.',
      },
    ],
  },

  // ── 4. Microsoft Store App zuweisen (6 Schritte) ──────────────
  'intune-store-app': {
    title: 'Microsoft Store App zuweisen',
    description:
      'Hinzufügen und Zuweisen einer Microsoft Store App über die neue in Intune integrierte Store-Oberfläche mit automatischen Updates und Lizenzverwaltung.',
    prerequisites: [
      'Intune-Administratorrolle',
      'Zielgeräte mit Windows 10 1809 oder höher',
    ],
    steps: [
      {
        title: 'Microsoft Store Apps-Bereich öffnen',
        description:
          'Navigieren Sie im Intune Admin Center zum Apps-Bereich und fügen Sie eine neue App hinzu. Wählen Sie "Microsoft Store App (neu)" als App-Typ.',
      },
      {
        title: 'Nach der App suchen',
        description:
          'Verwenden Sie die integrierte Suche, um die gewünschte App aus dem Microsoft Store-Katalog zu finden.',
        note: 'Nur Apps, die Offline-Lizenzierung oder die neue Store-Integration unterstützen, werden angezeigt. Einige reine Verbraucher-Apps sind möglicherweise nicht verfügbar.',
      },
      {
        title: 'App-Einstellungen konfigurieren',
        description:
          'Überprüfen Sie die App-Informationen und wählen Sie den Installer-Typ. Stellen Sie das Installationsverhalten auf Systemkontext ein.',
        note: 'Der winget-Installer-Typ ermöglicht es Intune, Win32-Desktop-Apps aus dem Store mit besserer Zuverlässigkeit und Update-Verwaltung zu installieren.',
      },
      {
        title: 'App Gruppen zuweisen',
        description:
          'Weisen Sie die App Ihren Azure AD-Zielgruppen zu. Wählen Sie "Erforderlich" für automatische Bereitstellung oder "Verfügbar" für Self-Service.',
      },
      {
        title: 'Update-Verhalten konfigurieren',
        description:
          'Über Intune konfigurierte Microsoft Store Apps erhalten standardmäßig automatische Updates. Für die meisten Organisationen wird empfohlen, automatische Updates aktiviert zu lassen.',
        note: 'Automatische Updates reduzieren das Sicherheitsrisiko und den Verwaltungsaufwand. Deaktivieren Sie sie nur, wenn Sie einen bestimmten Compliance-Grund haben.',
      },
      {
        title: 'Bereitstellung überprüfen',
        description:
          'Überprüfen Sie den App-Installationsstatus im Intune-Portal. Warten Sie bis zu einem Synchronisierungszyklus, bis die Zuweisung die Geräte erreicht.',
      },
    ],
  },

  // ── 5. Compliance-Richtlinie erstellen (9 Schritte) ───────────
  'intune-compliance-policy': {
    title: 'Compliance-Richtlinie erstellen',
    description:
      'Definieren und Bereitstellen einer Geräte-Compliance-Richtlinie für Geräteintegrität, Systemsicherheit, Kennwortanforderungen und Aktionen bei Nichtkonformität mit Integration des bedingten Zugriffs.',
    prerequisites: [
      'Intune-Administratorrolle',
      'Azure AD-Gruppen für die Richtlinienausrichtung',
      'Verständnis der organisatorischen Sicherheitsanforderungen',
    ],
    steps: [
      {
        title: 'Zu Compliance-Richtlinien navigieren',
        description:
          'Öffnen Sie das Intune Admin Center und navigieren Sie zum Bereich Compliance-Richtlinien. Überprüfen Sie vorhandene Richtlinien, um Konflikte zu vermeiden.',
      },
      {
        title: 'Plattform auswählen und Richtlinie erstellen',
        description:
          'Wählen Sie die Zielplattform (Windows 10 und höher, iOS/iPadOS, Android oder macOS). Geben Sie einen beschreibenden Richtliniennamen ein.',
      },
      {
        title: 'Geräteintegrität konfigurieren',
        description:
          'Aktivieren Sie die relevanten Geräteintegritätsprüfungen. Konfigurieren Sie BitLocker-Anforderung, Secure Boot und Codeintegrität.',
        note: 'Die Geräteintegritätsbestätigung erfordert, dass Geräte mit dem Microsoft Health Attestation Service kommunizieren. Stellen Sie sicher, dass der Endpunkt nicht durch Ihre Firewall blockiert wird.',
      },
      {
        title: 'Geräteeigenschaften konfigurieren',
        description:
          'Legen Sie die minimal und maximal zulässigen Betriebssystemversionen fest, um sicherzustellen, dass Geräte unterstützte Builds ausführen.',
      },
      {
        title: 'Systemsicherheitseinstellungen konfigurieren',
        description:
          'Legen Sie Kennwortanforderungen fest, einschließlich Mindestlänge, Komplexität und Ablauf. Aktivieren Sie Firewall-, Antivirus- und Antispyware-Anforderungen.',
        warning: 'Zu strenge Kennwortrichtlinien (z. B. 16+ Zeichen, 30-Tage-Ablauf) können zu Benutzerfrustration und Umgehungsversuchen führen. Wägen Sie Sicherheit und Benutzerfreundlichkeit ab.',
      },
      {
        title: 'Microsoft Defender-Einstellungen konfigurieren',
        description:
          'Legen Sie bei Verwendung von Microsoft Defender for Endpoint die maximal zulässige Geräterisikostufe fest.',
        note: 'Diese Einstellung erfordert, dass Microsoft Defender for Endpoint eingebunden und mit Intune verbunden ist.',
      },
      {
        title: 'Aktionen bei Nichtkonformität konfigurieren',
        description:
          'Definieren Sie, was passiert, wenn ein Gerät nicht mehr konform ist. Fügen Sie Aktionen wie E-Mail-Benachrichtigungen, Remote-Sperrung oder Außerbetriebnahme nach einer Übergangsfrist hinzu.',
        note: 'Ein gängiges Muster ist: Tag 0 – als nicht konform markieren und Benutzer benachrichtigen, Tag 3 – Erinnerung senden, Tag 7 – Zugriff über bedingten Zugriff blockieren, Tag 14 – Gerät außer Betrieb nehmen.',
      },
      {
        title: 'Richtlinie Gruppen zuweisen',
        description:
          'Weisen Sie die Compliance-Richtlinie den Azure AD-Zielgruppen zu. Erwägen Sie einen stufenweisen Rollout.',
      },
      {
        title: 'Compliance-Status überwachen',
        description:
          'Überwachen Sie nach der Zuweisung das Compliance-Dashboard für die Ergebnisse der Richtlinienauswertung.',
      },
    ],
  },

  // ── 6. Konfigurationsprofil erstellen (10 Schritte) ───────────
  'intune-config-profile': {
    title: 'Konfigurationsprofil erstellen',
    description:
      'Erstellen und Bereitstellen von Gerätekonfigurationsprofilen mit dem Einstellungskatalog oder Vorlagen zur Verwaltung von Geräteeinstellungen, Einschränkungen und Funktionen.',
    prerequisites: [
      'Intune-Administratorrolle',
      'Verständnis der zu konfigurierenden Einstellungen',
      'Azure AD-Gruppen für die Profilausrichtung',
    ],
    steps: [
      {
        title: 'Zwischen Einstellungskatalog und Vorlagen wählen',
        description:
          'Intune bietet zwei Ansätze: den Einstellungskatalog (granular, durchsuchbar, empfohlen) und Vorlagen (vorgefertigte Gruppierungen wie Geräteeinschränkungen, WLAN, VPN).',
        note: 'Der Einstellungskatalog ersetzt viele ältere vorlagenbasierte Profile. Microsoft empfiehlt seine Verwendung für neue Bereitstellungen. Vorlagen sind weiterhin nützlich für WLAN, VPN, Zertifikate und SCEP-Profile.',
      },
      {
        title: 'Neues Konfigurationsprofil erstellen',
        description:
          'Navigieren Sie zum Bereich Konfigurationsprofile und erstellen Sie ein neues Profil. Wählen Sie die Zielplattform und den Profiltyp.',
      },
      {
        title: 'Einstellungen hinzufügen (Einstellungskatalog)',
        description:
          'Klicken Sie bei Verwendung des Einstellungskatalogs auf "Einstellungen hinzufügen" und suchen oder durchsuchen Sie Kategorien.',
        note: 'Verwenden Sie die Suchfunktion, um Einstellungen schnell zu finden. Suchen Sie beispielsweise nach "Kennwort", um alle kennwortbezogenen Einstellungen über alle Kategorien hinweg zu finden.',
      },
      {
        title: 'Vorlageneinstellungen konfigurieren (bei Verwendung von Vorlagen)',
        description:
          'Konfigurieren Sie bei Verwendung eines Vorlagenprofils jede Einstellungsseite im Assistenten.',
      },
      {
        title: 'Bereichstags konfigurieren',
        description:
          'Weisen Sie Bereichstags zu, um die Profilsichtbarkeit auf bestimmte Administratoren zu beschränken.',
        note: 'Bereichstags sind optional, werden aber für Organisationen mit mehreren IT-Teams oder regionalen Administratoren empfohlen.',
      },
      {
        title: 'Profil Gruppen zuweisen',
        description:
          'Weisen Sie das Konfigurationsprofil den Azure AD-Zielgruppen zu. Erwägen Sie, separate Profile für verschiedene Benutzergruppen zu erstellen.',
      },
      {
        title: 'Anwendbarkeitsregeln festlegen (optional)',
        description:
          'Konfigurieren Sie Anwendbarkeitsregeln, um weitere Filter basierend auf Betriebssystemversion oder -edition festzulegen.',
      },
      {
        title: 'Überprüfen und erstellen',
        description:
          'Überprüfen Sie alle konfigurierten Einstellungen auf der Zusammenfassungsseite, bevor Sie das Profil erstellen.',
        warning: 'Falsche Konfigurationsprofile können Benutzer von ihren Geräten aussperren oder Funktionen beeinträchtigen. Testen Sie immer zuerst mit einer kleinen Pilotgruppe.',
      },
      {
        title: 'Profilbereitstellung überwachen',
        description:
          'Überprüfen Sie den Bereitstellungsstatus im Intune-Portal. Die Übersicht zeigt Erfolgs-, Fehler-, Konflikt- und ausstehende Zählungen.',
      },
      {
        title: 'Konflikte und Fehler beheben',
        description:
          'Verwenden Sie bei Geräten mit Fehlern oder Konflikten die gerätebasierte Detailansicht, um fehlgeschlagene Einstellungen zu identifizieren.',
        note: 'Verwenden Sie den Intune-Diagnosebericht auf dem Gerät (Einstellungen > Konten > Auf Geschäfts-, Schul- oder Unikonto zugreifen > Info > Bericht erstellen) für detaillierte Richtlinienanwendungsprotokolle.',
      },
    ],
  },

  // ── 7. Windows Update Ring konfigurieren (8 Schritte) ─────────
  'intune-update-ring': {
    title: 'Windows Update Ring konfigurieren',
    description:
      'Erstellen und Bereitstellen einer Windows Update Ring-Richtlinie zur Steuerung von Update-Verzögerungszeiträumen, Benutzererfahrungseinstellungen und automatischem Update-Verhalten.',
    prerequisites: [
      'Intune-Administratorrolle',
      'Geräte mit Windows 10 1709 oder höher',
      'Azure AD-Gruppen für die Update-Ring-Ausrichtung',
    ],
    steps: [
      {
        title: 'Update-Ring-Strategie planen',
        description:
          'Planen Sie vor dem Erstellen von Update-Ringen Ihre Rollout-Strategie. Ein gängiger Ansatz ist drei Ringe: Vorschau (IT-Team, 0-Tage), Breit (Early Adopter, 7 Tage) und Allgemein (alle Benutzer, 14 Tage).',
        note: 'Microsoft empfiehlt mindestens zwei Update-Ringe, um einen gestaffelten Rollout und die Validierung von Updates zu ermöglichen.',
      },
      {
        title: 'Neuen Update Ring erstellen',
        description:
          'Navigieren Sie zum Windows Update-Bereich und erstellen Sie eine neue Update Ring-Richtlinie mit einem beschreibenden Namen.',
      },
      {
        title: 'Update-Verzögerungszeiträume konfigurieren',
        description:
          'Legen Sie die Verzögerungszeiträume für Qualitätsupdates (Sicherheitspatches) und Funktionsupdates (größere Windows-Releases) fest.',
        note: 'Für die meisten Organisationen bietet eine Verzögerung der Qualitätsupdates um 7-14 Tage und der Funktionsupdates um 60-90 Tage eine gute Balance zwischen Sicherheit und Stabilität.',
      },
      {
        title: 'Wartungskanal konfigurieren',
        description:
          'Wählen Sie den Windows-Wartungskanal für den Update Ring. Der General Availability Channel wird für die meisten Geräte empfohlen.',
      },
      {
        title: 'Benutzererfahrungseinstellungen konfigurieren',
        description:
          'Steuern Sie, wie Updates den Benutzern präsentiert werden. Konfigurieren Sie Auto-Neustart-Verhalten, aktive Stunden und Neustartbenachrichtigungen.',
        warning: 'Das Erzwingen von Neustarts während der Geschäftszeiten kann zu Datenverlust führen, wenn Benutzer nicht gespeicherte Arbeit haben. Konfigurieren Sie aktive Stunden oder verwenden Sie fristbasierte Neustarts.',
      },
      {
        title: 'Automatisches Update-Verhalten konfigurieren',
        description:
          'Legen Sie das automatische Update-Verhalten fest. Für die meisten verwalteten Umgebungen bietet "Automatisch installieren und zum geplanten Zeitpunkt neu starten" die beste Balance.',
      },
      {
        title: 'Update Ring Gruppen zuweisen',
        description:
          'Weisen Sie den Update Ring den entsprechenden Azure AD-Gruppen zu. Jedes Gerät sollte nur einen Update Ring erhalten, um Konflikte zu vermeiden.',
        warning: 'Vermeiden Sie die Zuweisung mehrerer Update Ringe an dasselbe Gerät. Verwenden Sie exklusive Gruppenmitgliedschaft, um Konflikte zu verhindern.',
      },
      {
        title: 'Update-Compliance überwachen',
        description:
          'Verwenden Sie die Windows Update-Compliance-Berichte, um zu verfolgen, welche Geräte die neuesten Updates installiert haben.',
      },
    ],
  },

  // ── 8. PowerShell-Skript bereitstellen (8 Schritte) ───────────
  'intune-powershell-script': {
    title: 'PowerShell-Skript bereitstellen',
    description:
      'Hochladen und Bereitstellen eines PowerShell-Skripts auf verwalteten Geräten über Intune, einschließlich Ausführungskontextkonfiguration, Wiederholungseinstellungen und Bereitstellungsüberwachung.',
    prerequisites: [
      'Intune-Administratorrolle',
      'PowerShell-Skriptdatei (.ps1) vorbereitet und lokal getestet',
      'Zielgeräte mit Windows 10 1709 oder höher',
    ],
    steps: [
      {
        title: 'PowerShell-Skript vorbereiten',
        description:
          'Schreiben und testen Sie Ihr PowerShell-Skript lokal, bevor Sie es über Intune bereitstellen. Stellen Sie sicher, dass das Skript Fehler korrekt behandelt und Protokollierung enthält.',
        note: 'Fügen Sie immer Fehlerbehandlung und Protokollierung hinzu. Skripte, die stillschweigend fehlschlagen, sind über Intune extrem schwer zu debuggen.',
      },
      {
        title: 'Zur Skriptbereitstellung navigieren',
        description:
          'Öffnen Sie das Intune Admin Center und navigieren Sie zum Bereich Plattformskripte.',
      },
      {
        title: 'Skriptdatei hochladen',
        description:
          'Geben Sie einen beschreibenden Namen und eine optionale Beschreibung ein. Laden Sie die .ps1-Datei hoch.',
      },
      {
        title: 'Skriptausführungseinstellungen konfigurieren',
        description:
          'Legen Sie den Ausführungskontext auf System (als SYSTEM-Konto) oder Benutzer (als angemeldeter Benutzer) fest.',
        note: 'Skripte im Systemkontext haben volle Administratorrechte. Skripte im Benutzerkontext werden mit den Berechtigungen des angemeldeten Benutzers ausgeführt.',
      },
      {
        title: 'Signatur- und 64-Bit-Einstellungen konfigurieren',
        description:
          'Wählen Sie, ob die Skriptsignaturprüfung erzwungen werden soll. Wählen Sie "Skript im 64-Bit PowerShell-Host ausführen", wenn Ihr Skript 64-Bit-spezifische Module verwendet.',
        warning: 'Der 32-Bit PowerShell-Host leitet HKLM\\SOFTWARE nach HKLM\\SOFTWARE\\WOW6432Node um. Verwenden Sie immer den 64-Bit-Host, es sei denn, Sie benötigen ausdrücklich 32-Bit-Kompatibilität.',
      },
      {
        title: 'Skript Gruppen zuweisen',
        description:
          'Weisen Sie das Skript den Azure AD-Zielgruppen zu. Skripte werden standardmäßig einmal pro Gerät ausgeführt.',
      },
      {
        title: 'Wiederholungs- und Neuausführungsverhalten verstehen',
        description:
          'Intune versucht, das Skript einmal auszuführen und wiederholt es bis zu dreimal bei Fehlschlag.',
        note: 'Um eine Neuausführung auf einem bestimmten Gerät zu erzwingen, können Sie die Skriptausführungseinträge aus der Intune Management Extension-Registrierung auf diesem Gerät löschen.',
      },
      {
        title: 'Skriptausführungsstatus überwachen',
        description:
          'Überprüfen Sie den Bereitstellungsstatus im Intune-Portal. Die Übersichtsseite zeigt, wie viele Geräte das Skript erfolgreich ausgeführt haben.',
      },
    ],
  },

  // ── 9. BitLocker über Intune aktivieren (9 Schritte) ──────────
  'intune-bitlocker': {
    title: 'BitLocker über Intune aktivieren',
    description:
      'Konfigurieren und Bereitstellen der BitLocker-Laufwerkverschlüsselung über Intune-Endpunktschutzprofile, einschließlich OS-Laufwerkverschlüsselung, Wiederherstellungsoptionen und Azure AD-Schlüsselsicherung.',
    prerequisites: [
      'Intune-Administratorrolle',
      'Geräte mit TPM 1.2 oder höher (TPM 2.0 empfohlen)',
      'Geräte mit Windows 10 Pro, Enterprise oder Education',
      'Azure AD Premium für die Wiederherstellungsschlüssel-Sicherung',
    ],
    steps: [
      {
        title: 'Geräte-Hardware-Bereitschaft prüfen',
        description:
          'Stellen Sie sicher, dass Zielgeräte einen kompatiblen TPM-Chip haben und die Firmware-Anforderungen für BitLocker erfüllen.',
      },
      {
        title: 'Endpunktschutzprofil erstellen',
        description:
          'Erstellen Sie im Intune Admin Center ein neues Endpunktschutz-Konfigurationsprofil. Die BitLocker-Einstellungen befinden sich in der Endpunktschutzvorlage.',
      },
      {
        title: 'Windows-Verschlüsselungs-Basiseinstellungen konfigurieren',
        description:
          'Setzen Sie im Bereich Windows-Verschlüsselung "Geräte verschlüsseln" auf "Erforderlich". Wählen Sie als Verschlüsselungsmethode XTS-AES 256-Bit.',
        warning: 'Wenn auf Geräten bereits eine Drittanbieter-Verschlüsselungslösung installiert ist (z. B. Symantec Endpoint Encryption), muss diese vor der Aktivierung von BitLocker entfernt werden. Konkurrierende Verschlüsselungsprodukte können Startfehler verursachen.',
      },
      {
        title: 'Betriebssystem-Laufwerkverschlüsselung konfigurieren',
        description:
          'Konfigurieren Sie die Einstellungen für das Betriebssystem-Laufwerk. Legen Sie die Startauthentifizierungsmethode fest: nur TPM (nahtloseste Option) oder TPM + PIN (sicherer).',
        note: 'Nur-TPM-Authentifizierung bietet transparente Verschlüsselung. TPM + PIN fügt eine Pre-Boot-Authentifizierung für Hochsicherheitsumgebungen hinzu, erfordert aber bei jedem Start eine Benutzerinteraktion.',
      },
      {
        title: 'Wiederherstellungsoptionen konfigurieren',
        description:
          'Aktivieren Sie die Sicherung des Wiederherstellungsschlüssels in Azure AD, damit Administratoren Schlüssel abrufen können, wenn Benutzer gesperrt sind.',
        warning: 'Wenn die Azure AD-Wiederherstellungsschlüssel-Sicherung fehlschlägt und keine andere Wiederherstellungsmethode konfiguriert ist, kann es zu Datenverlust kommen. Überprüfen Sie immer, ob Wiederherstellungsschlüssel erfolgreich hinterlegt werden.',
      },
      {
        title: 'Festplatten- und Wechseldatenträger-Einstellungen konfigurieren',
        description:
          'Konfigurieren Sie optional die Verschlüsselung für feste Datenlaufwerke und Richtlinien für Wechseldatenträger (USB-Sticks).',
        note: 'Das Erzwingen der Verschlüsselung für Wechseldatenträger kann die Produktivität beeinträchtigen. Erwägen Sie zunächst eine Nur-Warnung-Richtlinie und wechseln Sie nach Benutzerschulung zur Erzwingung.',
      },
      {
        title: 'Profil Gerätegruppen zuweisen',
        description:
          'Weisen Sie das Endpunktschutzprofil den Azure AD-Zielgerätegruppen zu. Beginnen Sie mit einer Pilotgruppe.',
      },
      {
        title: 'Wiederherstellungsschlüssel-Sicherung in Azure AD überprüfen',
        description:
          'Überprüfen Sie nach der Verschlüsselung, ob Wiederherstellungsschlüssel in Azure AD gespeichert werden.',
      },
      {
        title: 'Verschlüsselungsstatus überwachen',
        description:
          'Überwachen Sie den BitLocker-Verschlüsselungsstatus über den Intune-Verschlüsselungsbericht.',
      },
    ],
  },

  // ── 10. Geräte remote zurücksetzen (6 Schritte) ───────────────
  'intune-remote-actions': {
    title: 'Geräte remote zurücksetzen',
    description:
      'Ausführen von Remoteaktionen auf verwalteten Geräten, einschließlich vollständigem Zurücksetzen, selektiver Außerbetriebnahme und Neustart, mit klarer Anleitung zur Verwendung jeder Option.',
    prerequisites: [
      'Intune-Administratorrolle oder entsprechende RBAC-Berechtigungen für Remoteaktionen',
      'Gerät in Intune registriert und erreichbar',
    ],
    steps: [
      {
        title: 'Unterschied zwischen Zurücksetzen, Außerbetriebnahme und Neustart verstehen',
        description:
          '"Zurücksetzen" führt einen vollständigen Werksreset durch. "Außerbetriebnahme" entfernt nur Unternehmensdaten. "Neustart" installiert Windows neu und entfernt vorinstallierte OEM-Apps.',
        note: 'Wählen Sie "Außerbetriebnahme" für BYOD und persönliche Geräte. Wählen Sie "Zurücksetzen" für unternehmenseigene Geräte, die neu verwendet werden. Wählen Sie "Neustart" zum Bereinigen von Bloatware.',
      },
      {
        title: 'Gerät in Intune suchen',
        description:
          'Navigieren Sie zur Geräteliste im Intune Admin Center. Suchen Sie nach dem Zielgerät anhand von Name, Seriennummer oder Benutzername.',
        warning: 'Überprüfen Sie immer den Gerätenamen, die Seriennummer und den registrierten Benutzer, bevor Sie eine Remoteaktion ausführen. Das Zurücksetzen des falschen Geräts ist nicht rückgängig zu machen.',
      },
      {
        title: 'Zurücksetzen ausführen (vollständiger Werksreset)',
        description:
          'Klicken Sie in der Geräte-Symbolleiste auf die Aktion "Zurücksetzen". Sie werden zur Bestätigung aufgefordert.',
        warning: 'Ein vollständiges Zurücksetzen löscht ALLE Daten auf dem Gerät dauerhaft, einschließlich persönlicher Dateien, Apps und Einstellungen. Diese Aktion kann nicht rückgängig gemacht werden.',
      },
      {
        title: 'Außerbetriebnahme ausführen (selektives Zurücksetzen)',
        description:
          'Klicken Sie auf "Außerbetriebnahme", um nur Unternehmensdaten und Verwaltungsprofile zu entfernen. Persönliche Daten bleiben erhalten.',
        note: 'Nach einer Außerbetriebnahme wird das Gerät aus der Intune-Verwaltung entfernt. Der Benutzer kann sich bei Bedarf erneut registrieren. Über Intune als "Erforderlich" bereitgestellte Unternehmens-Apps werden entfernt.',
      },
      {
        title: 'Neustart ausführen (nur Windows)',
        description:
          'Klicken Sie auf "Neustart", um Windows neu zu installieren und vorinstallierte Hersteller-Apps zu entfernen. Das Gerät bleibt in Intune und Azure AD registriert.',
        note: 'Neustart erfordert Windows 10 Version 1709 oder höher. Das Gerät lädt während des Vorgangs die neueste Windows-Version herunter, was eine aktive Internetverbindung erfordert.',
      },
      {
        title: 'Aktionsstatus überprüfen',
        description:
          'Überwachen Sie nach dem Initiieren einer Remoteaktion deren Status im Bereich "Geräteaktionen" auf der Gerätedetailseite.',
      },
    ],
  },
}

export default intuneGuidesDe
