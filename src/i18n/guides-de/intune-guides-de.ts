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
      'Erfahren Sie, wie Sie Windows Autopilot konfigurieren, um eine automatisierte, benutzerfreundliche Gerätebereitstellung in Ihrer Organisation zu ermöglichen.',
    prerequisites: [
      'Azure AD Premium P1- oder P2-Lizenz',
      'Microsoft Intune-Abonnement',
      'Geräte mit Windows 10/11 Pro, Enterprise oder Education',
      'Netzwerkzugriff auf Microsoft-Dienste',
      'Globaler Administrator oder Intune-Administrator',
    ],
    steps: [
      {
        title: 'Hardware-Hashes erfassen',
        description:
          'Exportieren Sie die Hardware-Hashes Ihrer Geräte mithilfe eines PowerShell-Skripts oder über den OEM-Partner, um sie für Autopilot zu registrieren.',
        note: 'Der Befehl Get-WindowsAutopilotInfo kann direkt auf dem Gerät oder remote ausgeführt werden.',
      },
      {
        title: 'CSV-Datei mit Hardware-Hashes erstellen',
        description:
          'Erstellen Sie eine CSV-Datei mit den Spalten Seriennummer, Windows-Produkt-ID und Hardware-Hash für den Import.',
      },
      {
        title: 'Geräte in Autopilot importieren',
        description:
          'Laden Sie die CSV-Datei im Intune-Portal hoch, um die Geräte als Autopilot-Geräte zu registrieren.',
        note: 'Der Import kann bis zu 15 Minuten dauern. Aktualisieren Sie die Ansicht, um den Status zu prüfen.',
      },
      {
        title: 'Autopilot-Bereitstellungsprofil erstellen',
        description:
          'Erstellen Sie ein neues Bereitstellungsprofil und definieren Sie die grundlegenden Einstellungen wie Profilname und Beschreibung.',
      },
      {
        title: 'OOBE-Erfahrung konfigurieren',
        description:
          'Legen Sie die Out-of-Box Experience fest: Datenschutzeinstellungen, Lizenzbedingungen, Kontoänderungsoptionen und den Bereitstellungsmodus (benutzergesteuert oder selbstbereitstellend).',
        warning:
          'Der selbstbereitstellende Modus erfordert ein TPM 2.0 und eine kabelgebundene Netzwerkverbindung.',
      },
      {
        title: 'Enrollment Status Page (ESP) einrichten',
        description:
          'Konfigurieren Sie die ESP, um den Fortschritt der Geräteeinrichtung anzuzeigen und sicherzustellen, dass alle Apps und Richtlinien angewendet werden, bevor der Benutzer auf den Desktop zugreifen kann.',
      },
      {
        title: 'Dynamische Azure AD-Gruppe erstellen',
        description:
          'Erstellen Sie eine dynamische Gerätegruppe mit einer Mitgliedschaftsregel, die Autopilot-Geräte automatisch einschließt.',
        note: 'Verwenden Sie das Attribut device.devicePhysicalIDs, um Autopilot-Geräte zu filtern.',
      },
      {
        title: 'Bereitstellungsprofil zuweisen',
        description:
          'Weisen Sie das erstellte Autopilot-Bereitstellungsprofil der dynamischen Gerätegruppe zu.',
      },
      {
        title: 'Netzwerkanforderungen prüfen',
        description:
          'Stellen Sie sicher, dass die erforderlichen URLs und Ports für Autopilot in Ihrer Firewall freigegeben sind.',
        note: 'Die vollständige Liste der benötigten Endpunkte finden Sie in der Microsoft-Dokumentation.',
      },
      {
        title: 'Testgerät vorbereiten',
        description:
          'Setzen Sie ein registriertes Gerät auf die Werkseinstellungen zurück, um den Autopilot-Ablauf zu testen.',
        warning:
          'Alle lokalen Daten auf dem Testgerät werden gelöscht. Sichern Sie wichtige Dateien vorher.',
      },
      {
        title: 'Autopilot-Ablauf testen',
        description:
          'Starten Sie das Testgerät, verbinden Sie es mit dem Netzwerk und durchlaufen Sie den Autopilot-OOBE-Prozess, um die Konfiguration zu überprüfen.',
      },
      {
        title: 'Bereitstellung überwachen',
        description:
          'Überprüfen Sie den Bereitstellungsstatus im Intune-Portal und analysieren Sie eventuelle Fehler anhand der Diagnoseprotokolle.',
        note: 'Unter "Geräte > Windows > Windows-Registrierung > Bereitstellungen" finden Sie detaillierte Statusinformationen.',
      },
    ],
  },

  // ── 2. Win32 App deployen (10 Schritte) ───────────────────────
  'intune-win32-app-deploy': {
    title: 'Win32 App deployen',
    description:
      'Erfahren Sie, wie Sie eine klassische Win32-Anwendung als .intunewin-Paket vorbereiten und über Microsoft Intune bereitstellen.',
    prerequisites: [
      'Microsoft Intune-Abonnement',
      'Microsoft Win32 Content Prep Tool (IntuneWinAppUtil.exe)',
      'Installationsquelldateien der Anwendung',
      'Intune-Administratorrolle',
    ],
    steps: [
      {
        title: 'Quelldateien vorbereiten',
        description:
          'Legen Sie alle Installationsdateien der Anwendung in einem einzelnen Ordner ab. Stellen Sie sicher, dass die Setup-Datei und alle Abhängigkeiten vorhanden sind.',
      },
      {
        title: 'IntuneWinAppUtil herunterladen',
        description:
          'Laden Sie das Microsoft Win32 Content Prep Tool von GitHub herunter und entpacken Sie es in einen lokalen Ordner.',
      },
      {
        title: 'Anwendung paketieren',
        description:
          'Führen Sie IntuneWinAppUtil.exe aus und geben Sie den Quellordner, die Setup-Datei und den Ausgabeordner an, um die .intunewin-Datei zu erstellen.',
        note: 'Verwenden Sie den Parameter -q für den stillen Modus ohne Benutzerabfragen.',
      },
      {
        title: 'Neue Win32 App im Portal anlegen',
        description:
          'Navigieren Sie im Intune-Portal zu den Apps und erstellen Sie eine neue Windows-App (Win32). Laden Sie die erstellte .intunewin-Datei hoch.',
      },
      {
        title: 'App-Informationen konfigurieren',
        description:
          'Geben Sie Name, Beschreibung, Herausgeber, App-Version und optional ein Symbol für die Anwendung ein.',
      },
      {
        title: 'Installations- und Deinstallationsbefehle festlegen',
        description:
          'Definieren Sie die Kommandozeilenbefehle für die stille Installation und Deinstallation der Anwendung.',
        note: 'Für MSI-basierte Installationen verwenden Sie msiexec /i mit dem /qn-Parameter für eine stille Installation.',
      },
      {
        title: 'Anforderungen definieren',
        description:
          'Legen Sie die Mindestanforderungen an das Betriebssystem, die Architektur (32/64-Bit) und den Festplattenspeicher fest.',
      },
      {
        title: 'Erkennungsregeln erstellen',
        description:
          'Konfigurieren Sie Regeln, anhand derer Intune erkennt, ob die Anwendung bereits installiert ist. Sie können MSI-Produktcodes, Dateien/Ordner oder Registrierungsschlüssel verwenden.',
        warning:
          'Fehlerhafte Erkennungsregeln können dazu führen, dass die App wiederholt installiert oder als nicht installiert gemeldet wird.',
      },
      {
        title: 'Zuweisung konfigurieren',
        description:
          'Weisen Sie die App als erforderliche Installation, verfügbare Installation oder als Deinstallation den gewünschten Benutzer- oder Gerätegruppen zu.',
      },
      {
        title: 'Bereitstellung überwachen',
        description:
          'Überprüfen Sie den Installationsstatus im Intune-Portal. Analysieren Sie fehlgeschlagene Installationen anhand der Fehler-Codes und der Intune Management Extension-Protokolle.',
        note: 'Die Intune Management Extension-Protokolle befinden sich unter C:\\ProgramData\\Microsoft\\IntuneManagementExtension\\Logs.',
      },
    ],
  },

  // ── 3. LOB App (MSI) deployen (7 Schritte) ────────────────────
  'intune-lob-msi-deploy': {
    title: 'LOB App (MSI) deployen',
    description:
      'Erfahren Sie, wie Sie eine Line-of-Business-Anwendung im MSI-Format direkt über Intune bereitstellen, ohne das Win32 Content Prep Tool verwenden zu müssen.',
    prerequisites: [
      'Microsoft Intune-Abonnement',
      'MSI-Installationsdatei der Anwendung',
      'Intune-Administratorrolle',
    ],
    steps: [
      {
        title: 'MSI-Datei vorbereiten',
        description:
          'Stellen Sie sicher, dass die MSI-Datei gültig ist und alle erforderlichen Abhängigkeiten enthält. Prüfen Sie die Dateigröße (maximal 8 GB).',
      },
      {
        title: 'Neue LOB-App erstellen',
        description:
          'Navigieren Sie im Intune-Portal zu den Apps und erstellen Sie eine neue Line-of-Business-App. Wählen Sie den App-Typ "Branchenspezifische App" aus.',
      },
      {
        title: 'MSI-Datei hochladen',
        description:
          'Laden Sie die MSI-Datei hoch. Intune extrahiert automatisch die App-Informationen wie Produktname, Version und Herausgeber aus der MSI-Datei.',
        note: 'Der Upload kann je nach Dateigröße und Internetgeschwindigkeit einige Minuten dauern.',
      },
      {
        title: 'App-Informationen konfigurieren',
        description:
          'Überprüfen und ergänzen Sie die automatisch erkannten App-Informationen. Fügen Sie bei Bedarf eine Beschreibung, Kategorie und ein App-Symbol hinzu.',
      },
      {
        title: 'Befehlszeilenargumente festlegen',
        description:
          'Definieren Sie optionale Befehlszeilenargumente für die MSI-Installation, z. B. zusätzliche Properties oder Transformationsdateien.',
      },
      {
        title: 'Zuweisung konfigurieren',
        description:
          'Weisen Sie die App den gewünschten Benutzer- oder Gerätegruppen als erforderliche oder verfügbare Installation zu.',
      },
      {
        title: 'Installation überwachen',
        description:
          'Überwachen Sie den Installationsstatus über das Intune-Portal und stellen Sie sicher, dass die App auf den Zielgeräten erfolgreich installiert wurde.',
        note: 'Bei Fehlern prüfen Sie die Ereignisprotokolle auf dem Gerät unter "Anwendungs- und Dienstprotokolle > Microsoft > Windows > DeviceManagement-Enterprise-Diagnostics-Provider".',
      },
    ],
  },

  // ── 4. Microsoft Store App zuweisen (6 Schritte) ──────────────
  'intune-store-app': {
    title: 'Microsoft Store App zuweisen',
    description:
      'Erfahren Sie, wie Sie Anwendungen aus dem Microsoft Store über die neue Store-Integration in Intune suchen, konfigurieren und Ihren Benutzern zuweisen.',
    prerequisites: [
      'Microsoft Intune-Abonnement',
      'Geräte mit Windows 10 (Version 1903) oder höher',
      'Intune-Administratorrolle',
    ],
    steps: [
      {
        title: 'Neue Microsoft Store App hinzufügen',
        description:
          'Navigieren Sie im Intune-Portal zu den Apps und wählen Sie den App-Typ "Microsoft Store App (neu)" aus, um die neue Store-Integration zu nutzen.',
      },
      {
        title: 'App im Store suchen',
        description:
          'Verwenden Sie die integrierte Suchfunktion, um die gewünschte Anwendung im Microsoft Store zu finden. Wählen Sie die korrekte App aus den Suchergebnissen aus.',
        note: 'Sie können auch direkt eine Store-URL einfügen, um eine bestimmte App zu finden.',
      },
      {
        title: 'App-Informationen überprüfen',
        description:
          'Überprüfen Sie die automatisch ausgefüllten App-Informationen wie Name, Herausgeber und Beschreibung. Passen Sie diese bei Bedarf an.',
      },
      {
        title: 'Installationsverhalten konfigurieren',
        description:
          'Wählen Sie, ob die App im System- oder Benutzerkontext installiert werden soll. Legen Sie fest, ob die App automatisch aktualisiert werden soll.',
      },
      {
        title: 'Zuweisung konfigurieren',
        description:
          'Weisen Sie die App den gewünschten Benutzer- oder Gerätegruppen zu. Sie können die App als erforderlich oder als im Unternehmensportal verfügbar zuweisen.',
      },
      {
        title: 'Bereitstellung überprüfen',
        description:
          'Überwachen Sie den Installationsstatus im Intune-Portal und stellen Sie sicher, dass die App auf den Zielgeräten erfolgreich bereitgestellt wurde.',
        note: 'Die neue Store-Integration erfordert keine Microsoft Store for Business-Konfiguration.',
      },
    ],
  },

  // ── 5. Compliance-Richtlinie erstellen (9 Schritte) ───────────
  'intune-compliance-policy': {
    title: 'Compliance-Richtlinie erstellen',
    description:
      'Erfahren Sie, wie Sie in Intune eine Compliance-Richtlinie erstellen, die den Gerätezustand, die Systemsicherheit und Kennwortanforderungen überprüft und Aktionen bei Nichtkonformität auslöst.',
    prerequisites: [
      'Microsoft Intune-Abonnement',
      'Azure AD Premium für bedingten Zugriff (empfohlen)',
      'Intune-Administratorrolle',
    ],
    steps: [
      {
        title: 'Neue Compliance-Richtlinie erstellen',
        description:
          'Navigieren Sie im Intune-Portal zu den Compliance-Richtlinien und erstellen Sie eine neue Richtlinie. Wählen Sie die Plattform "Windows 10 und höher" aus.',
      },
      {
        title: 'Geräteintegrität konfigurieren',
        description:
          'Legen Sie Anforderungen an die Geräteintegrität fest, z. B. ob BitLocker aktiviert sein muss, ob Secure Boot erforderlich ist und ob die Codeintegrität aktiviert sein muss.',
      },
      {
        title: 'Geräteeigenschaften festlegen',
        description:
          'Definieren Sie Anforderungen an die Betriebssystemversion, z. B. Mindest- und Maximalversion des Betriebssystems.',
      },
      {
        title: 'Systemsicherheit konfigurieren',
        description:
          'Legen Sie Sicherheitsanforderungen fest: Firewall, TPM, Antivirenprogramm und Antispyware müssen aktiviert sein.',
        warning:
          'Stellen Sie sicher, dass alle Zielgeräte die konfigurierten Sicherheitsanforderungen erfüllen können, bevor Sie die Richtlinie zuweisen.',
      },
      {
        title: 'Kennwortanforderungen definieren',
        description:
          'Konfigurieren Sie die Kennwortrichtlinie: Mindestkennwortlänge, Kennwortkomplexität, maximales Kennwortalter und die Anzahl der vorherigen Kennwörter, die nicht wiederverwendet werden dürfen.',
      },
      {
        title: 'Microsoft Defender for Endpoint konfigurieren',
        description:
          'Legen Sie optional eine maximale Risikostufe für Geräte fest, die über Microsoft Defender for Endpoint gemeldet wird.',
        note: 'Diese Einstellung erfordert eine aktive Microsoft Defender for Endpoint-Integration.',
      },
      {
        title: 'Aktionen bei Nichtkonformität festlegen',
        description:
          'Definieren Sie die Aktionen, die ausgeführt werden, wenn ein Gerät die Compliance-Anforderungen nicht erfüllt: Gerät als nicht konform markieren, E-Mail-Benachrichtigung senden, Gerät remote sperren oder außer Betrieb nehmen.',
        note: 'Sie können Zeitverzögerungen für jede Aktion festlegen, z. B. das Gerät erst nach 3 Tagen als nicht konform markieren.',
      },
      {
        title: 'Zuweisung konfigurieren',
        description:
          'Weisen Sie die Compliance-Richtlinie den gewünschten Benutzer- oder Gerätegruppen zu. Schließen Sie bei Bedarf bestimmte Gruppen von der Richtlinie aus.',
      },
      {
        title: 'Compliance-Status überwachen',
        description:
          'Überprüfen Sie den Compliance-Status der Geräte im Intune-Portal. Analysieren Sie nicht konforme Geräte und die spezifischen Regeln, die verletzt wurden.',
        note: 'Kombinieren Sie Compliance-Richtlinien mit bedingtem Zugriff in Azure AD, um den Zugriff auf Unternehmensressourcen auf konforme Geräte zu beschränken.',
      },
    ],
  },

  // ── 6. Konfigurationsprofil erstellen (10 Schritte) ───────────
  'intune-config-profile': {
    title: 'Konfigurationsprofil erstellen',
    description:
      'Erfahren Sie, wie Sie in Intune ein Gerätekonfigurationsprofil erstellen, um Einstellungen auf verwalteten Geräten zentral zu verwalten. Lernen Sie den Unterschied zwischen dem Einstellungskatalog und administrativen Vorlagen kennen.',
    prerequisites: [
      'Microsoft Intune-Abonnement',
      'Intune-Administratorrolle',
      'Zielgeräte mit Windows 10/11',
    ],
    steps: [
      {
        title: 'Profiltyp auswählen',
        description:
          'Wählen Sie zwischen dem Einstellungskatalog (empfohlen für granulare Kontrolle) und administrativen Vorlagen (ADMX-basiert). Der Einstellungskatalog bietet eine flache, durchsuchbare Liste aller verfügbaren Einstellungen.',
        note: 'Der Einstellungskatalog wird von Microsoft bevorzugt und erhält regelmäßig neue Einstellungen.',
      },
      {
        title: 'Neues Konfigurationsprofil erstellen',
        description:
          'Navigieren Sie im Intune-Portal zu den Konfigurationsprofilen und erstellen Sie ein neues Profil. Wählen Sie die Plattform und den gewünschten Profiltyp aus.',
      },
      {
        title: 'Profilname und Beschreibung festlegen',
        description:
          'Vergeben Sie einen aussagekräftigen Namen und eine Beschreibung für das Profil, damit es später leicht identifiziert werden kann.',
      },
      {
        title: 'Einstellungen im Einstellungskatalog suchen',
        description:
          'Verwenden Sie die Suchfunktion des Einstellungskatalogs, um die gewünschten Einstellungen zu finden. Fügen Sie die relevanten Einstellungen zum Profil hinzu.',
      },
      {
        title: 'Einstellungen konfigurieren',
        description:
          'Konfigurieren Sie die hinzugefügten Einstellungen mit den gewünschten Werten. Überprüfen Sie die Beschreibung jeder Einstellung, um ihre Auswirkungen zu verstehen.',
        warning:
          'Falsch konfigurierte Einstellungen können die Benutzererfahrung beeinträchtigen oder Sicherheitslücken verursachen. Testen Sie Profile immer zuerst an einer Pilotgruppe.',
      },
      {
        title: 'Administrative Vorlagen verwenden (optional)',
        description:
          'Alternativ können Sie administrative Vorlagen nutzen, die auf ADMX-Dateien basieren und die gleiche Struktur wie Gruppenrichtlinien bieten.',
      },
      {
        title: 'Bereichstags zuweisen',
        description:
          'Weisen Sie dem Profil Bereichstags zu, um die Verwaltung auf bestimmte IT-Administratorengruppen einzuschränken.',
        note: 'Bereichstags sind optional, aber empfehlenswert für größere Organisationen mit delegierter Administration.',
      },
      {
        title: 'Zuweisung konfigurieren',
        description:
          'Weisen Sie das Konfigurationsprofil den gewünschten Benutzer- oder Gerätegruppen zu. Verwenden Sie Ausschlussgruppen, um bestimmte Geräte von der Konfiguration auszunehmen.',
      },
      {
        title: 'Anwendbarkeitsregeln definieren',
        description:
          'Definieren Sie optional Anwendbarkeitsregeln, um das Profil nur auf Geräte mit bestimmten Betriebssystemversionen oder -editionen anzuwenden.',
      },
      {
        title: 'Profilbereitstellung überwachen',
        description:
          'Überprüfen Sie den Bereitstellungsstatus im Intune-Portal. Analysieren Sie Fehler und Konflikte zwischen verschiedenen Profilen.',
        note: 'Bei Konflikten zwischen Profilen wird der restriktivere Wert angewendet. Prüfen Sie die Berichtsansicht auf Konfliktwarnungen.',
      },
    ],
  },

  // ── 7. Windows Update Ring konfigurieren (8 Schritte) ─────────
  'intune-update-ring': {
    title: 'Windows Update Ring konfigurieren',
    description:
      'Erfahren Sie, wie Sie einen Windows Update Ring in Intune konfigurieren, um Funktions- und Qualitätsupdates mit definierten Verzögerungsfristen und Benutzererfahrungseinstellungen zu verwalten.',
    prerequisites: [
      'Microsoft Intune-Abonnement',
      'Windows 10/11 Pro, Enterprise oder Education',
      'Intune-Administratorrolle',
    ],
    steps: [
      {
        title: 'Neuen Update Ring erstellen',
        description:
          'Navigieren Sie im Intune-Portal zu den Windows Update Ringen und erstellen Sie einen neuen Update Ring. Vergeben Sie einen aussagekräftigen Namen.',
      },
      {
        title: 'Updatekanaleinstellungen festlegen',
        description:
          'Wählen Sie den Wartungskanal (z. B. Halbjährlicher Kanal) und konfigurieren Sie den Microsoft-Produktupdateservice.',
        note: 'Der Halbjährliche Kanal wird für die meisten Produktionsumgebungen empfohlen.',
      },
      {
        title: 'Verzögerungsfristen konfigurieren',
        description:
          'Legen Sie die Verzögerungszeiträume für Qualitätsupdates (in Tagen) und Funktionsupdates (in Tagen) fest. Die Verzögerung bestimmt, wie lange nach der Veröffentlichung ein Update angeboten wird.',
        warning:
          'Zu lange Verzögerungen können Sicherheitslücken offenlassen. Empfohlen: 7-14 Tage für Qualitätsupdates, 30-60 Tage für Funktionsupdates.',
      },
      {
        title: 'Fristen und Neustartzeiträume festlegen',
        description:
          'Konfigurieren Sie die Frist, bis zu der Updates installiert sein müssen, und definieren Sie die Kulanzzeit für automatische Neustarts.',
      },
      {
        title: 'Benutzererfahrung konfigurieren',
        description:
          'Legen Sie fest, wie Benutzer über ausstehende Updates und Neustarts benachrichtigt werden. Konfigurieren Sie aktive Nutzungszeiten, in denen keine automatischen Neustarts erfolgen.',
      },
      {
        title: 'Automatische Updateeinstellungen festlegen',
        description:
          'Wählen Sie das automatische Updateverhalten: automatisch herunterladen und installieren, nur herunterladen oder Benutzer benachrichtigen.',
      },
      {
        title: 'Zuweisung konfigurieren',
        description:
          'Weisen Sie den Update Ring den gewünschten Gerätegruppen zu. Verwenden Sie verschiedene Update Ringe für Pilotgruppen und Produktionsgeräte.',
        note: 'Erstellen Sie einen separaten Ring mit kürzeren Verzögerungen für die IT-Abteilung als Pilotgruppe.',
      },
      {
        title: 'Update-Compliance überwachen',
        description:
          'Überwachen Sie den Update-Status über das Intune-Portal und die Windows Update for Business-Berichte. Identifizieren Sie Geräte, die Updates nicht erfolgreich installieren konnten.',
      },
    ],
  },

  // ── 8. PowerShell-Skript bereitstellen (8 Schritte) ───────────
  'intune-powershell-script': {
    title: 'PowerShell-Skript bereitstellen',
    description:
      'Erfahren Sie, wie Sie ein PowerShell-Skript über Intune auf verwalteten Geräten bereitstellen, um Aufgaben zu automatisieren, die über Standard-Konfigurationsprofile hinausgehen.',
    prerequisites: [
      'Microsoft Intune-Abonnement',
      'PowerShell-Skript (.ps1-Datei)',
      'Intune-Administratorrolle',
      'Geräte mit Windows 10/11 und der Intune Management Extension',
    ],
    steps: [
      {
        title: 'PowerShell-Skript vorbereiten',
        description:
          'Erstellen und testen Sie das PowerShell-Skript lokal. Stellen Sie sicher, dass das Skript keine Benutzerinteraktion erfordert und entsprechende Exit-Codes zurückgibt.',
        warning:
          'Skripte werden im SYSTEM-Kontext oder im Benutzerkontext ausgeführt. Testen Sie das Skript im entsprechenden Kontext, bevor Sie es bereitstellen.',
      },
      {
        title: 'Skriptanforderungen prüfen',
        description:
          'Stellen Sie sicher, dass das Skript die Anforderungen erfüllt: maximale Dateigröße 200 KB, UTF-8-Kodierung (mit oder ohne BOM) und keine interaktiven Elemente.',
      },
      {
        title: 'Neues Skript im Portal erstellen',
        description:
          'Navigieren Sie im Intune-Portal zu den PowerShell-Skripts und erstellen Sie einen neuen Skripteintrag. Vergeben Sie einen aussagekräftigen Namen und eine Beschreibung.',
      },
      {
        title: 'Skriptdatei hochladen',
        description:
          'Laden Sie die vorbereitete .ps1-Datei hoch und konfigurieren Sie die Skripteinstellungen.',
      },
      {
        title: 'Ausführungskontext konfigurieren',
        description:
          'Legen Sie fest, ob das Skript im Benutzerkontext oder im SYSTEM-Kontext ausgeführt werden soll. Konfigurieren Sie, ob die Signaturprüfung erzwungen werden soll.',
        note: 'Wählen Sie den SYSTEM-Kontext, wenn das Skript Administratorrechte benötigt.',
      },
      {
        title: 'Wiederholungsverhalten festlegen',
        description:
          'Konfigurieren Sie, ob das Skript bei einem Fehler wiederholt werden soll und in welchen Intervallen die Wiederholung stattfindet. Standardmäßig werden Skripte einmal ausgeführt.',
      },
      {
        title: 'Zuweisung konfigurieren',
        description:
          'Weisen Sie das Skript den gewünschten Benutzer- oder Gerätegruppen zu. Beachten Sie, dass Skripte standardmäßig einmal pro Gerät ausgeführt werden.',
      },
      {
        title: 'Ausführungsstatus überwachen',
        description:
          'Überwachen Sie den Ausführungsstatus im Intune-Portal. Prüfen Sie die Exit-Codes und die Ausgabeprotokolle, um erfolgreiche und fehlgeschlagene Ausführungen zu identifizieren.',
        note: 'Detaillierte Protokolle finden Sie auf dem Gerät unter C:\\ProgramData\\Microsoft\\IntuneManagementExtension\\Logs.',
      },
    ],
  },

  // ── 9. BitLocker über Intune aktivieren (9 Schritte) ──────────
  'intune-bitlocker': {
    title: 'BitLocker über Intune aktivieren',
    description:
      'Erfahren Sie, wie Sie die BitLocker-Laufwerkverschlüsselung über ein Intune-Endpunktschutzprofil konfigurieren und bereitstellen, einschließlich der Wiederherstellungsoptionen.',
    prerequisites: [
      'Microsoft Intune-Abonnement',
      'Windows 10/11 Pro, Enterprise oder Education',
      'TPM 1.2 oder höher (TPM 2.0 empfohlen)',
      'Intune-Administratorrolle',
      'UEFI-Firmware mit Secure Boot (empfohlen)',
    ],
    steps: [
      {
        title: 'Endpunktschutzprofil erstellen',
        description:
          'Navigieren Sie im Intune-Portal zu den Endpunktsicherheitsrichtlinien und erstellen Sie ein neues Datenträgerverschlüsselungsprofil für BitLocker.',
      },
      {
        title: 'BitLocker-Basiseinstellungen konfigurieren',
        description:
          'Aktivieren Sie die Verschlüsselung und konfigurieren Sie die grundlegenden BitLocker-Einstellungen. Legen Sie fest, ob Benutzer zur Verschlüsselung aufgefordert werden oder ob diese automatisch erfolgt.',
        warning:
          'Die automatische Verschlüsselung erfordert, dass das Gerät die Modern Standby- oder HSTI-Anforderungen erfüllt.',
      },
      {
        title: 'Betriebssystem-Laufwerkverschlüsselung konfigurieren',
        description:
          'Konfigurieren Sie die Verschlüsselungseinstellungen für das Betriebssystem-Laufwerk: Verschlüsselungsmethode (AES-XTS 256-Bit empfohlen), Startauthentifizierung und TPM-Konfiguration.',
      },
      {
        title: 'Wiederherstellungsoptionen für das Betriebssystem-Laufwerk festlegen',
        description:
          'Definieren Sie die Wiederherstellungsoptionen: Wiederherstellungsschlüssel und Wiederherstellungskennwort. Konfigurieren Sie die Speicherung des Wiederherstellungsschlüssels in Azure AD.',
        note: 'Empfehlung: Aktivieren Sie die Speicherung des Wiederherstellungsschlüssels in Azure AD, bevor BitLocker aktiviert wird.',
      },
      {
        title: 'Festplattenlaufwerke konfigurieren',
        description:
          'Konfigurieren Sie optional die Verschlüsselungseinstellungen für zusätzliche Festplattenlaufwerke. Legen Sie fest, ob diese automatisch oder manuell verschlüsselt werden.',
      },
      {
        title: 'Wechseldatenträger konfigurieren',
        description:
          'Konfigurieren Sie optional die BitLocker To Go-Einstellungen für Wechseldatenträger (USB-Sticks). Sie können den Schreibzugriff auf unverschlüsselte Wechseldatenträger blockieren.',
      },
      {
        title: 'Zuweisung konfigurieren',
        description:
          'Weisen Sie das BitLocker-Profil den gewünschten Gerätegruppen zu. Beginnen Sie mit einer Pilotgruppe, bevor Sie die Richtlinie organisationsweit bereitstellen.',
        warning:
          'Stellen Sie sicher, dass die Wiederherstellungsschlüssel-Hinterlegung in Azure AD funktioniert, bevor Sie die Verschlüsselung organisationsweit aktivieren.',
      },
      {
        title: 'Verschlüsselungsstatus überwachen',
        description:
          'Überprüfen Sie den Verschlüsselungsstatus der Geräte im Intune-Portal unter den Verschlüsselungsberichten.',
      },
      {
        title: 'Wiederherstellungsschlüssel verwalten',
        description:
          'Verwalten Sie die BitLocker-Wiederherstellungsschlüssel im Intune-Portal oder in Azure AD. Stellen Sie sicher, dass Helpdesk-Mitarbeiter Zugriff auf die Wiederherstellungsschlüssel haben.',
        note: 'Benutzer können ihre eigenen Wiederherstellungsschlüssel auch über die Seite "Mein Konto" (myaccount.microsoft.com) einsehen.',
      },
    ],
  },

  // ── 10. Geräte remote zurücksetzen (6 Schritte) ───────────────
  'intune-remote-actions': {
    title: 'Geräte remote zurücksetzen',
    description:
      'Erfahren Sie, wie Sie Intune-Remoteaktionen verwenden, um Geräte zurückzusetzen, außer Betrieb zu nehmen oder neu zu starten, und wann welche Aktion die richtige Wahl ist.',
    prerequisites: [
      'Microsoft Intune-Abonnement',
      'Intune-Administratorrolle (mindestens Helpdeskoperator für eingeschränkte Aktionen)',
      'Gerät muss in Intune registriert und erreichbar sein',
    ],
    steps: [
      {
        title: 'Unterschiede der Remoteaktionen verstehen',
        description:
          'Machen Sie sich mit den verschiedenen Remoteaktionen vertraut: "Zurücksetzen" setzt das Gerät auf Werkseinstellungen zurück, "Außerbetriebnahme" entfernt nur Unternehmensdaten, und "Neustart" startet das Gerät remote neu.',
        warning:
          '"Zurücksetzen" löscht alle Daten auf dem Gerät unwiderruflich. Verwenden Sie "Außerbetriebnahme" für BYOD-Geräte, um persönliche Daten zu erhalten.',
      },
      {
        title: 'Gerät im Portal suchen',
        description:
          'Suchen Sie das betroffene Gerät im Intune-Portal über den Gerätenamen, die Seriennummer oder den Benutzernamen.',
      },
      {
        title: 'Remoteaktion auswählen und ausführen',
        description:
          'Wählen Sie die gewünschte Remoteaktion aus dem Aktionsmenü des Geräts. Bestätigen Sie die Aktion, wenn Sie dazu aufgefordert werden.',
        warning:
          'Überprüfen Sie vor dem Zurücksetzen eines Geräts, ob der Benutzer alle wichtigen Daten gesichert hat.',
      },
      {
        title: 'Zurücksetzen mit Optionen konfigurieren',
        description:
          'Beim Zurücksetzen können Sie zusätzliche Optionen angeben: Registrierungsstatus und Benutzerkonto beibehalten, oder das Gerät auch dann zurücksetzen, wenn es keinen Strom hat (wird nach dem nächsten Start ausgeführt).',
        note: 'Die Option "Registrierungsstatus beibehalten" ist hilfreich, wenn das Gerät nach dem Zurücksetzen automatisch wieder über Autopilot bereitgestellt werden soll.',
      },
      {
        title: 'Aktionsstatus überprüfen',
        description:
          'Überwachen Sie den Status der Remoteaktion im Intune-Portal. Der Status zeigt an, ob die Aktion ausstehend, aktiv oder abgeschlossen ist.',
      },
      {
        title: 'Abschluss bestätigen und Gerät nachverfolgen',
        description:
          'Bestätigen Sie, dass die Aktion erfolgreich abgeschlossen wurde. Prüfen Sie den Gerätestatus und stellen Sie sicher, dass das Gerät ggf. wieder ordnungsgemäß registriert und konfiguriert wird.',
        note: 'Gelöschte Geräte können unter "Alle Geräte" mit dem Filter "Ausstehend" oder "Zurückgesetzt" nachverfolgt werden.',
      },
    ],
  },
}

export default intuneGuidesDe
