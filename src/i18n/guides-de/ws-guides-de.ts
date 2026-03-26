import type { GuideTranslation } from './intune-guides-de'

const wsGuidesDe: Record<string, GuideTranslation> = {
  // ── 1. Active Directory-Domäne einrichten (12 Schritte) ─────────────
  'ws-ad-domain-setup': {
    title: 'Active Directory-Domäne einrichten',
    description:
      'Active Directory-Domänendienste (AD DS) auf Windows Server installieren und konfigurieren, den Server zum Domänencontroller hochstufen, DNS-Integration konfigurieren, erste Organisationseinheiten erstellen und Replikation sowie Domänenintegrität überprüfen.',
    prerequisites: [
      'Windows Server 2019 oder 2022 mit statischer IP-Adresse installiert',
      'Lokaler Administratorzugriff',
      'Ein geplanter Domänenname (z. B. corp.contoso.com)',
      'Netzwerkkonnektivität und DNS-Auflösung zu Upstream-Weiterleitungen',
    ],
    steps: [
      {
        title: 'Statische IP-Adresse zuweisen',
        description:
          'Stellen Sie vor der Hochstufung sicher, dass der Server eine statische IPv4-Adresse, Subnetzmaske, Standardgateway und bevorzugtes DNS auf sich selbst (127.0.0.1) hat. Ein Domänencontroller darf niemals DHCP für seine eigene Adresse verwenden.',
        warning: 'Das Ändern der IP-Adresse während einer Remotesitzung trennt die Verbindung. Führen Sie diesen Schritt über die Konsole durch oder stellen Sie sicher, dass Sie sich mit der neuen IP erneut verbinden können.',
      },
      {
        title: 'Server umbenennen',
        description:
          'Legen Sie einen aussagekräftigen Hostnamen für den Domänencontroller fest, bevor Sie die Hochstufung durchführen. Der Name kann nach der AD DS-Installation nicht mehr einfach geändert werden.',
        note: 'Wählen Sie einen Namen gemäß Ihrer Namenskonvention (z. B. DC01, DC-SITE1). Der Server wird automatisch neu gestartet.',
      },
      {
        title: 'AD DS-Rolle installieren',
        description:
          'Installieren Sie die Active Directory-Domänendienste-Rolle und die Verwaltungstools. Dieser Schritt installiert nur die Binärdateien; die Hochstufung erfolgt später.',
      },
      {
        title: 'AD DS-Bereitstellungsvoraussetzungen prüfen',
        description:
          'Führen Sie die Voraussetzungsprüfung aus, um sicherzustellen, dass der Server alle Anforderungen für die Domänencontroller-Hochstufung erfüllt. Dies validiert die Gesamtstruktur- und Domänenfunktionsebenen, NTDS- und SYSVOL-Pfade sowie die DNS-Delegation.',
        note: 'WinThreshold entspricht der Funktionsebene von Windows Server 2016. Verwenden Sie Win2012R2, wenn Sie Abwärtskompatibilität mit älteren DCs benötigen.',
      },
      {
        title: 'Server zum Domänencontroller hochstufen',
        description:
          'Erstellen Sie eine neue Active Directory-Gesamtstruktur und stufen Sie diesen Server als ersten Domänencontroller hoch. Der Befehl installiert DNS Server automatisch, legt das DSRM-Kennwort fest und konfiguriert die SYSVOL-Replikation.',
        warning: 'Der Server wird nach der Hochstufung automatisch neu gestartet. Bewahren Sie das DSRM-Kennwort sicher auf — Sie benötigen es für Verzeichnis-Wiederherstellungsszenarien.',
      },
      {
        title: 'AD DS-Installation überprüfen',
        description:
          'Melden Sie sich nach dem Neustart des Servers mit dem Domänenadministratorkonto an und überprüfen Sie, ob AD DS und DNS korrekt ausgeführt werden.',
      },
      {
        title: 'DNS-Reverse-Lookupzone konfigurieren',
        description:
          'Erstellen Sie eine Reverse-Lookupzone, damit die IP-zu-Name-Auflösung korrekt funktioniert. Dies ist für viele AD-integrierte Dienste erforderlich.',
        note: 'Passen Sie die Netzwerk-ID an Ihr Subnetz an. Für mehrere Subnetze erstellen Sie eine Reverse-Zone für jedes einzelne.',
      },
      {
        title: 'Organisationseinheiten (OUs) erstellen',
        description:
          'Entwerfen und erstellen Sie eine OU-Struktur, die Ihre Organisation widerspiegelt. Ein gängiges Layout trennt Benutzer, Computer, Server und Gruppen in separate OUs, um die Gruppenrichtlinien-Zuweisung zu vereinfachen.',
      },
      {
        title: 'Erstes Domänenadministratorkonto erstellen',
        description:
          'Erstellen Sie ein benanntes Domänenadministratorkonto anstelle des integrierten Administrator-Kontos. Fügen Sie es den Gruppen Domänen-Admins und Organisations-Admins hinzu.',
        warning: 'Verwenden Sie niemals das integrierte Administrator-Konto für die tägliche Verwaltung. Verwenden Sie immer benannte Konten für die Nachverfolgbarkeit.',
      },
      {
        title: 'AD-Standorte und Subnetze konfigurieren',
        description:
          'Wenn Sie mehrere physische Standorte haben, erstellen Sie AD-Standorte und verknüpfen Sie die entsprechenden Subnetze. Dies optimiert den Authentifizierungsdatenverkehr und die Replikationstopologie.',
        note: 'Für eine Einzelstandort-Bereitstellung können Sie diesen Schritt überspringen und den Default-First-Site-Name beibehalten.',
      },
      {
        title: 'Domänenintegritätsdiagnose ausführen',
        description:
          'Verwenden Sie dcdiag und repadmin, um den Zustand des Domänencontrollers, die Replikation und die DNS-Integration zu validieren.',
      },
      {
        title: 'AD-Papierkorb aktivieren',
        description:
          'Aktivieren Sie den Active Directory-Papierkorb, um die einfache Wiederherstellung versehentlich gelöschter AD-Objekte ohne autoritative Wiederherstellung zu ermöglichen.',
        warning: 'Das Aktivieren des Papierkorbs ist nicht rückgängig zu machen. Die Gesamtstruktur-Funktionsebene muss Windows Server 2008 R2 oder höher sein.',
      },
    ],
  },

  // ── 2. Gruppenrichtlinie erstellen und zuweisen (9 Schritte) ────────
  'ws-gpo-create': {
    title: 'Gruppenrichtlinie erstellen und zuweisen',
    description:
      'Ein Gruppenrichtlinienobjekt (GPO) erstellen, gängige Einstellungen wie Kennwortrichtlinien, Laufwerkzuordnungen und Softwareeinschränkungen konfigurieren, das GPO mit einer Organisationseinheit verknüpfen und die Anwendung auf Clientcomputern überprüfen.',
    prerequisites: [
      'Eine Active Directory-Domäne mit mindestens einem Domänencontroller',
      'Mitgliedschaft in Domänen-Admins oder Gruppenrichtlinienersteller-Besitzer',
      'RSAT installiert, wenn die Verwaltung von einer Arbeitsstation aus erfolgt',
    ],
    steps: [
      {
        title: 'Gruppenrichtlinien-Verwaltungskonsole öffnen',
        description:
          'Starten Sie die GPMC über den Server-Manager oder durch Ausführen des Snap-Ins gpmc.msc. Erweitern Sie die Gesamtstruktur und Domäne, um die aktuelle OU- und GPO-Struktur zu sehen.',
      },
      {
        title: 'Neues GPO erstellen',
        description:
          'Erstellen Sie ein neues Gruppenrichtlinienobjekt mit einem aussagekräftigen Namen. Verwenden Sie als Konvention Präfixe für den Zweck (z. B. SEC- für Sicherheit, CFG- für Konfiguration).',
        note: 'Das Erstellen eines GPOs wendet es nirgendwo an — Sie müssen es in einem späteren Schritt mit einer OU, einem Standort oder einer Domäne verknüpfen.',
      },
      {
        title: 'Kennwortrichtlinieneinstellungen konfigurieren',
        description:
          'Bearbeiten Sie das GPO, um die Kontorichtlinie / Kennwortrichtlinie zu konfigurieren. Legen Sie Mindestkennwortlänge, Komplexitätsanforderungen, Kennwortverlauf und maximales Kennwortalter fest.',
        note: 'Die Standard-Domänenkennwortrichtlinie wird über das GPO der Standarddomänenrichtlinie festgelegt. Differenzierte Kennwortrichtlinien ermöglichen unterschiedliche Einstellungen für verschiedene Gruppen und erfordern die Domänenfunktionsebene Windows Server 2008 oder höher.',
      },
      {
        title: 'Laufwerkzuordnung über Gruppenrichtlinieneinstellungen konfigurieren',
        description:
          'Fügen Sie eine Laufwerkzuordnung über die Gruppenrichtlinieneinstellungen unter Benutzerkonfiguration > Einstellungen > Windows-Einstellungen > Laufwerkzuordnungen hinzu. Dies ordnet einen Netzwerkfreigabebuchstaben zu, wenn Benutzer sich anmelden.',
      },
      {
        title: 'Windows-Firewall-Regeln konfigurieren',
        description:
          'Verwenden Sie ein GPO, um Windows-Firewall-Regeln in der gesamten Domäne bereitzustellen. Dies gewährleistet einheitliche Firewall-Einstellungen auf allen domänenverbundenen Computern.',
      },
      {
        title: 'GPO mit einer Organisationseinheit verknüpfen',
        description:
          'Verknüpfen Sie das GPO mit der entsprechenden OU, damit die Richtlinie auf Benutzer oder Computer in diesem Container angewendet wird. Sie können dasselbe GPO mit mehreren OUs verknüpfen.',
      },
      {
        title: 'GPO-Sicherheitsfilterung festlegen',
        description:
          'Standardmäßig wird ein GPO auf alle authentifizierten Benutzer angewendet. Sie können es auf bestimmte Sicherheitsgruppen beschränken, indem Sie die Sicherheitsfilterung ändern.',
        warning: 'Wenn Sie "Authentifizierte Benutzer" entfernen, ohne eine andere Gruppe hinzuzufügen, wird das GPO auf niemanden angewendet. Fügen Sie immer zuerst die Zielgruppe hinzu, bevor Sie den Standard entfernen.',
      },
      {
        title: 'Gruppenrichtlinienaktualisierung auf Clients erzwingen',
        description:
          'Lösen Sie eine sofortige Gruppenrichtlinienaktualisierung auf Clientcomputern aus, um die neue Richtlinie zu testen, anstatt auf das standardmäßige 90-Minuten-Aktualisierungsintervall zu warten.',
      },
      {
        title: 'GPO-Anwendung mit gpresult überprüfen',
        description:
          'Führen Sie gpresult auf einem Clientcomputer aus, um einen RSoP-Bericht (Resultant Set of Policy) zu generieren und zu bestätigen, dass das GPO korrekt angewendet wird.',
        note: 'Wenn das GPO nicht in gpresult erscheint, überprüfen Sie die OU-Verknüpfung, Sicherheitsfilterung, WMI-Filter und ob das Computer-/Benutzerobjekt in der richtigen OU ist.',
      },
    ],
  },

  // ── 3. AD-Benutzer per Massenimport anlegen (8 Schritte) ────────────
  'ws-ad-user-bulk': {
    title: 'AD-Benutzer per Massenimport anlegen',
    description:
      'Hunderte oder Tausende von Active Directory-Benutzerkonten aus einer CSV-Datei mit PowerShell importieren, einschließlich Gruppenmitgliedschaftszuweisung, OU-Platzierung und Validierung der importierten Konten.',
    prerequisites: [
      'Eine Active Directory-Domäne mit bereits erstellten Ziel-OUs',
      'Eine CSV-Datei mit Benutzerdetails (Name, SamAccountName, UPN, Abteilung usw.)',
      'ActiveDirectory PowerShell-Modul installiert',
      'Berechtigung zum Erstellen von Benutzerkonten (Konten-Operatoren oder Domänen-Admins)',
    ],
    steps: [
      {
        title: 'CSV-Vorlage vorbereiten',
        description:
          'Erstellen Sie eine CSV-Datei mit Spalten für alle benötigten Benutzerattribute. Mindestens sollten Vorname, Nachname, SamAccountName, UserPrincipalName, Abteilung und Kennwort enthalten sein.',
        warning: 'Speichern Sie niemals echte Kennwörter in Klartext-CSV-Dateien in der Produktion. Verwenden Sie ein temporäres Kennwort und erzwingen Sie die Änderung bei der ersten Anmeldung.',
      },
      {
        title: 'CSV-Daten validieren',
        description:
          'Validieren Sie die CSV vor dem Import auf Duplikate, fehlende Felder und ungültige Zeichen im SamAccountName. Dies verhindert Teil-Importe und Fehler.',
        note: 'SamAccountName hat eine maximale Länge von 20 Zeichen. UserPrincipalName kann bis zu 1024 Zeichen lang sein.',
      },
      {
        title: 'Vorhandene Konten prüfen',
        description:
          'Fragen Sie AD ab, um sicherzustellen, dass keiner der SamAccountNames in der CSV bereits existiert, was den Import für diese Einträge fehlschlagen lassen würde.',
      },
      {
        title: 'Massenimport-Skript ausführen',
        description:
          'Importieren Sie alle Benutzer aus der CSV mit New-ADUser. Das Skript erstellt jedes Konto, setzt das Kennwort und platziert den Benutzer in der richtigen OU.',
        note: 'Verwenden Sie -ChangePasswordAtLogon $true, damit jeder Benutzer sein eigenes Kennwort bei der ersten Anmeldung festlegt.',
      },
      {
        title: 'Benutzer zu Sicherheitsgruppen hinzufügen',
        description:
          'Fügen Sie die importierten Benutzer den entsprechenden Sicherheitsgruppen basierend auf ihrer Abteilung oder Rolle mit PowerShell hinzu.',
      },
      {
        title: 'Zusätzliche Benutzerattribute setzen',
        description:
          'Aktualisieren Sie Telefonnummern, Bürostandorte, Vorgesetzte und andere Attribute, die bei der Erstanlage möglicherweise nicht gesetzt wurden.',
      },
      {
        title: 'Importbericht erstellen',
        description:
          'Fragen Sie AD ab und exportieren Sie einen Bericht aller neu erstellten Benutzer, um zu überprüfen, ob der Import erfolgreich war und alle Attribute korrekt sind.',
      },
      {
        title: 'Beispielbenutzerkonto testen',
        description:
          'Melden Sie sich mit einem der neu erstellten Konten an, um zu überprüfen, ob die Authentifizierung funktioniert, die Kennwortänderungsaufforderung erscheint und die Gruppenmitgliedschaften korrekt sind.',
        note: 'Wenn sich der Benutzer nicht anmelden kann, überprüfen Sie, ob das Konto aktiviert ist, die OU nicht durch ein restriktives GPO blockiert wird und das Kennwort die Komplexitätsanforderungen erfüllt.',
      },
    ],
  },

  // ── 4. DNS-Server konfigurieren (9 Schritte) ───────────────────────
  'ws-dns-config': {
    title: 'DNS-Server konfigurieren',
    description:
      'Die DNS-Server-Rolle auf Windows Server installieren und konfigurieren, Forward- und Reverse-Lookupzonen erstellen, bedingte Weiterleitungen konfigurieren, DNS-Richtlinien einrichten und die Namensauflösung im gesamten Netzwerk überprüfen.',
    prerequisites: [
      'Windows Server 2019 oder 2022 mit statischer IP-Adresse',
      'Lokaler Administrator- oder Domänen-Admin-Zugriff',
      'Netzwerkkonnektivität zu Upstream-DNS-Weiterleitungen (z. B. 8.8.8.8)',
    ],
    steps: [
      {
        title: 'DNS-Server-Rolle installieren',
        description:
          'Installieren Sie die DNS-Server-Rolle, falls sie nicht während der AD DS-Hochstufung installiert wurde. Auf eigenständigen Servern kann DNS unabhängig installiert werden.',
        note: 'Wenn dieser Server auch ein Domänencontroller ist, wurde DNS wahrscheinlich während der Hochstufung installiert. Überprüfen Sie dies mit Get-WindowsFeature DNS.',
      },
      {
        title: 'Primäre Forward-Lookupzone erstellen',
        description:
          'Erstellen Sie eine AD-integrierte primäre Forward-Lookupzone für Ihre Domäne. AD-integrierte Zonen bieten sichere dynamische Aktualisierungen und automatische Replikation zwischen Domänencontrollern.',
      },
      {
        title: 'Reverse-Lookupzone erstellen',
        description:
          'Erstellen Sie eine Reverse-Lookupzone für PTR-Eintragsauflösung. Dies ermöglicht IP-zu-Hostname-Abfragen, die von vielen Diensten und Sicherheitstools benötigt werden.',
        note: 'Erstellen Sie eine Reverse-Zone pro Subnetz. Wenn Ihr Netzwerk 10.0.0.0/24 und 10.1.0.0/24 hat, benötigen Sie zwei Reverse-Zonen.',
      },
      {
        title: 'DNS-Weiterleitungen konfigurieren',
        description:
          'Richten Sie Weiterleitungen ein, damit der DNS-Server externe Namen auflösen kann, indem er Abfragen an Upstream-Resolver weiterleitet.',
        warning: 'Fügen Sie nicht zu viele Weiterleitungen hinzu. Der DNS-Server fragt sie der Reihe nach ab, und übermäßig viele Weiterleitungen können die externe Auflösung verlangsamen.',
      },
      {
        title: 'Bedingte Weiterleitungen hinzufügen',
        description:
          'Erstellen Sie bedingte Weiterleitungen für Partnerdomänen oder andere interne Zonen, die von verschiedenen DNS-Servern verwaltet werden. Dies leitet Abfragen für bestimmte Domänen an festgelegte Server weiter.',
      },
      {
        title: 'Statische DNS-Einträge erstellen',
        description:
          'Fügen Sie manuell A-, CNAME-, MX- und TXT-Einträge für Dienste hinzu, die keine dynamische DNS-Registrierung verwenden.',
      },
      {
        title: 'DNS-Aufräumung konfigurieren',
        description:
          'Aktivieren Sie Alterung und Aufräumung, um veraltete DNS-Einträge automatisch zu entfernen, die nicht mehr gültig sind, und DNS-Aufblähung zu verhindern.',
        note: 'Die Aufräumung entfernt nur Einträge, bei denen sowohl die Alterung aktiviert ist als auch das Nicht-Aktualisierungs- + Aktualisierungsintervall überschritten wurde. Testen Sie zunächst an einer Nicht-Produktionszone.',
      },
      {
        title: 'DNS-Protokollierung und -Diagnose konfigurieren',
        description:
          'Aktivieren Sie die DNS-Debug-Protokollierung und -Analyse, um Auflösungsprobleme zu beheben und Abfragemuster zu überwachen.',
        warning: 'DNS-Debug-Protokollierung kann auf stark ausgelasteten Servern große Protokolldateien erzeugen. Aktivieren Sie sie nur während der Fehlerbehebung und deaktivieren Sie sie danach.',
      },
      {
        title: 'DNS-Auflösung überprüfen',
        description:
          'Testen Sie Forward- und Reverse-Auflösung, Zonentransfers und externe Namensauflösung, um zu bestätigen, dass der DNS-Server korrekt funktioniert.',
      },
    ],
  },

  // ── 5. DHCP-Server einrichten (8 Schritte) ─────────────────────────
  'ws-dhcp-setup': {
    title: 'DHCP-Server einrichten',
    description:
      'Die DHCP-Server-Rolle auf Windows Server installieren und konfigurieren, IPv4-Bereiche erstellen, Optionen für DNS, Gateway und Domäne festlegen, Reservierungen und Ausschlüsse konfigurieren und den Server in Active Directory autorisieren.',
    prerequisites: [
      'Windows Server 2019 oder 2022 mit statischer IP-Adresse',
      'Domänen-Admin- oder DHCP-Administratoren-Gruppenmitgliedschaft',
      'Ein geplanter IP-Adressbereich für den DHCP-Bereich',
      'DNS-Serveradressen und Standard-Gateway-IP',
    ],
    steps: [
      {
        title: 'DHCP-Server-Rolle installieren',
        description:
          'Installieren Sie die DHCP-Server-Rolle und Verwaltungstools über den Server-Manager oder PowerShell.',
      },
      {
        title: 'DHCP-Server in Active Directory autorisieren',
        description:
          'Nur autorisierte DHCP-Server können in einer AD-Umgebung Adressen vergeben. Dies verhindert, dass nicht autorisierte DHCP-Server das Netzwerk stören.',
        warning: 'Ein nicht autorisierter DHCP-Server in einem AD-Netzwerk antwortet nicht auf Client-Anfragen. Autorisieren Sie ihn immer nach der Installation.',
      },
      {
        title: 'Nachinstallationskonfiguration abschließen',
        description:
          'Führen Sie die Nachinstallationsaufgaben aus, um die DHCP-Sicherheitsgruppen zu erstellen und die Serverkonfiguration abzuschließen.',
      },
      {
        title: 'IPv4-Bereich erstellen',
        description:
          'Erstellen Sie einen DHCP-Bereich, der den Bereich der an Clients zu vergebenden IP-Adressen definiert. Der Bereich umfasst eine Start- und Endadresse, Subnetzmaske, Leasedauer und einen beschreibenden Namen.',
        note: 'Die Leasedauer sollte zwischen Adresskonservierung (kürzere Leases) und reduziertem DHCP-Datenverkehr (längere Leases) abwägen. 8 Stunden sind üblich für Büroumgebungen.',
      },
      {
        title: 'Bereichsoptionen konfigurieren',
        description:
          'Legen Sie DHCP-Optionen fest, die Clients zusammen mit ihrer IP-Adresse erhalten, wie das Standardgateway (Option 003), DNS-Server (Option 006) und den Domänennamen (Option 015).',
      },
      {
        title: 'Ausschlussbereiche und Reservierungen hinzufügen',
        description:
          'Schließen Sie IP-Bereiche aus, die von Servern, Druckern oder anderen statischen Geräten verwendet werden. Erstellen Sie Reservierungen für Geräte, die eine konsistente IP benötigen, aber dennoch DHCP für die Konfiguration verwenden sollen.',
        note: 'Die ClientId ist die MAC-Adresse des Geräts. Verwenden Sie Get-NetAdapter auf dem Gerät oder überprüfen Sie die Switch-ARP-Tabelle, um sie zu finden.',
      },
      {
        title: 'DHCP-Failover konfigurieren',
        description:
          'Richten Sie ein DHCP-Failover zwischen zwei DHCP-Servern für Hochverfügbarkeit ein. Verwenden Sie den Hot-Standby-Modus für ein Primär-/Sekundär-Setup oder den Lastausgleichsmodus zur Lastverteilung.',
        warning: 'Beide DHCP-Server müssen in AD autorisiert sein. Stellen Sie sicher, dass der Partnerserver die DHCP-Rolle installiert hat und derselbe Bereich definiert ist, bevor Sie das Failover konfigurieren.',
      },
      {
        title: 'DHCP-Betrieb überprüfen',
        description:
          'Testen Sie den DHCP-Server, indem Sie eine IP auf einem Client freigeben und erneuern, und überprüfen Sie dann die Lease-Tabelle auf dem Server, um zu bestätigen, dass Adressen verteilt werden.',
      },
    ],
  },

  // ── 6. Zertifizierungsstelle einrichten (11 Schritte) ──────────────
  'ws-ca-setup': {
    title: 'Zertifizierungsstelle einrichten',
    description:
      'Active Directory-Zertifikatsdienste (AD CS) als Unternehmens-Stammzertifizierungsstelle oder untergeordnete Zertifizierungsstelle installieren und konfigurieren, Zertifikatvorlagen konfigurieren, automatische Registrierung aktivieren und den Zertifikatslebenszyklus verwalten.',
    prerequisites: [
      'Windows Server 2019 oder 2022, der einer Active Directory-Domäne beigetreten ist',
      'Organisations-Admin- oder Domänen-Admin-Mitgliedschaft',
      'Eine geplante CA-Namenskonvention und Schlüssellänge (mindestens 2048 Bit, 4096 Bit empfohlen)',
      'Dedizierter Server empfohlen (nicht auf einem Domänencontroller in der Produktion)',
    ],
    steps: [
      {
        title: 'PKI-Hierarchie planen',
        description:
          'Entscheiden Sie sich zwischen einer einstufigen (nur Stamm-CA) oder zweistufigen (Offline-Stamm-CA + Online-Untergeordnete-CA) Architektur. Für die Produktion wird eine zweistufige Hierarchie mit einer Offline-Stamm-CA dringend empfohlen.',
        note: 'Eine einstufige Architektur ist für Labor- und Testumgebungen akzeptabel. Verwenden Sie für die Produktion immer eine zwei- oder dreistufige PKI-Hierarchie mit der Stamm-CA offline.',
        warning: 'Der CA-Name und die Schlüssellänge können nach der Installation nicht mehr geändert werden, ohne die gesamte CA neu aufzubauen. Planen Sie sorgfältig, bevor Sie fortfahren.',
      },
      {
        title: 'AD CS-Rolle installieren',
        description:
          'Installieren Sie die Active Directory-Zertifikatsdienste mit der Zertifizierungsstelle und optionalen Komponenten wie dem CA-Webregistrierungsdienst.',
      },
      {
        title: 'Unternehmens-Stammzertifizierungsstelle konfigurieren',
        description:
          'Führen Sie den AD CS-Konfigurationsassistenten aus, um den CA-Typ, die Schlüssellänge, den Hash-Algorithmus und den Gültigkeitszeitraum festzulegen.',
        note: 'Verwenden Sie für eine untergeordnete CA -CAType EnterpriseSubordinateCA und senden Sie die Zertifikatanforderung an die Stamm-CA.',
      },
      {
        title: 'CA-Webregistrierungsdienst konfigurieren',
        description:
          'Falls installiert, konfigurieren Sie die Webregistrierungsschnittstelle, damit Benutzer Zertifikate über einen Browser anfordern können.',
      },
      {
        title: 'CRL- und AIA-Verteilungspunkte konfigurieren',
        description:
          'Legen Sie die Zertifikatsperrlisten- (CRL) und Stelleninformationszugriffs- (AIA) Verteilungspunkt-URLs fest. Diese sind entscheidend für die Zertifikatvalidierung durch Clients.',
        warning: 'Wenn CRL-Verteilungspunkte nicht erreichbar sind, können Clients Zertifikate ablehnen oder lange Verzögerungen bei der Validierung erfahren. Testen Sie immer die CRL-Erreichbarkeit von Client-Computern aus.',
      },
      {
        title: 'Benutzerdefinierte Zertifikatvorlage erstellen',
        description:
          'Duplizieren Sie eine vorhandene Vorlage und passen Sie sie für Ihre Anforderungen an, z. B. Webserver-Zertifikate, Benutzerauthentifizierung oder Codesignierung.',
        note: 'Die Bearbeitung von Zertifikatvorlagen erfordert das MMC-Snap-In für Zertifikatvorlagen. PowerShell kann Vorlagen veröffentlichen und zurückziehen, aber die detaillierte Bearbeitung erfolgt über die GUI.',
      },
      {
        title: 'Automatische Registrierung über Gruppenrichtlinie konfigurieren',
        description:
          'Aktivieren Sie die automatische Zertifikatregistrierung, damit domänenverbundene Computer und Benutzer automatisch Zertifikate basierend auf Vorlagenberechtigungen anfordern und erneuern.',
      },
      {
        title: 'Zertifikat manuell anfordern',
        description:
          'Testen Sie die CA, indem Sie ein Zertifikat manuell mit PowerShell oder certreq anfordern. Dies validiert, dass die CA Zertifikate korrekt ausstellt.',
      },
      {
        title: 'Zertifikatwiderruf konfigurieren',
        description:
          'Lernen Sie, Zertifikate zu widerrufen und aktualisierte CRLs zu veröffentlichen. Dies ist wesentlich, um das Vertrauen von kompromittierten oder außer Dienst gestellten Zertifikaten zu entfernen.',
        note: 'Widerrufsgründe: 0=Nicht angegeben, 1=Schlüsselkompromittierung, 2=CA-Kompromittierung, 3=Zugehörigkeitsänderung, 4=Ersetzt, 5=Betriebseinstellung.',
      },
      {
        title: 'CA sichern',
        description:
          'Sichern Sie die CA-Datenbank und den privaten Schlüssel. Dies ist entscheidend für die Notfallwiederherstellung — der Verlust des privaten CA-Schlüssels bedeutet, dass alle ausgestellten Zertifikate unwiederbringlich sind.',
        warning: 'Bewahren Sie die CA-Sicherung und das Kennwort für den privaten Schlüssel an einem sicheren, offline Ort auf (z. B. einem Tresor oder Hardware-Sicherheitsmodul). Wenn der private Schlüssel verloren geht, muss die gesamte PKI neu aufgebaut werden.',
      },
      {
        title: 'CA-Integrität und ausgestellte Zertifikate überwachen',
        description:
          'Überprüfen Sie regelmäßig ausgestellte Zertifikate, ausstehende Anforderungen und fehlgeschlagene Anforderungen, um sicherzustellen, dass die CA ordnungsgemäß funktioniert.',
      },
    ],
  },

  // ── 7. WSUS-Server einrichten (10 Schritte) ────────────────────────
  'ws-wsus-setup': {
    title: 'WSUS-Server einrichten',
    description:
      'Windows Server Update Services (WSUS) installieren und konfigurieren, um Windows-Updates im gesamten Netzwerk zu verwalten und zu verteilen, einschließlich Klassifizierungsauswahl, Computergruppen-Targeting, Genehmigungsregeln und Berichterstellung.',
    prerequisites: [
      'Windows Server 2019 oder 2022 mit mindestens 40 GB freiem Speicherplatz für Updates',
      'SQL Server Express (integrierte WID) oder eine vollständige SQL Server-Instanz',
      'Internetzugang zum Herunterladen von Updates von Microsoft Update',
      'Domänen-Admin-Zugriff für GPO-Konfiguration',
    ],
    steps: [
      {
        title: 'WSUS-Rolle installieren',
        description:
          'Installieren Sie Windows Server Update Services mit den erforderlichen Unterfunktionen. Wählen Sie zwischen WID (Windows Internal Database) für kleinere Umgebungen oder SQL Server für größere Bereitstellungen.',
        note: 'WID unterstützt bis zu 20.000 Clients. Für größere Umgebungen oder Berichtsanforderungen verwenden Sie SQL Server.',
      },
      {
        title: 'WSUS-Nachinstallationsaufgaben ausführen',
        description:
          'Schließen Sie die Erstkonfiguration ab, indem Sie das Inhaltsverzeichnis angeben, in dem Update-Dateien gespeichert werden.',
        warning: 'Wählen Sie ein Volume mit ausreichend Speicherplatz. WSUS-Inhalt kann je nach Anzahl der ausgewählten Produkte und Klassifizierungen auf Hunderte von Gigabyte anwachsen.',
      },
      {
        title: 'WSUS-Synchronisierungsquelle konfigurieren',
        description:
          'Konfigurieren Sie, woher WSUS Updates herunterlädt. In der Regel ist dies Microsoft Update, aber nachgelagerte WSUS-Server können von einem vorgelagerten WSUS-Server synchronisieren.',
      },
      {
        title: 'Produkte und Klassifizierungen auswählen',
        description:
          'Wählen Sie aus, welche Microsoft-Produkte und Update-Klassifizierungen synchronisiert werden sollen. Seien Sie selektiv, um Speicherplatz und Bandbreite zu sparen.',
        note: 'Vermeiden Sie die Auswahl von "Treiber", es sei denn, Sie benötigen speziell die Treiberverteilung. Treiber erhöhen die Speicheranforderungen und die Synchronisierungszeit erheblich.',
      },
      {
        title: 'Erste Synchronisierung durchführen',
        description:
          'Starten Sie die erste WSUS-Synchronisierung. Dies lädt die Update-Metadaten von Microsoft Update herunter und kann je nach Anzahl der ausgewählten Produkte mehrere Stunden dauern.',
        warning: 'Die erste Synchronisierung kann mehrere Stunden dauern. Unterbrechen Sie sie nicht. Planen Sie sie möglichst außerhalb der Geschäftszeiten.',
      },
      {
        title: 'Computer-Zielgruppen erstellen',
        description:
          'Erstellen Sie Gruppen, um Computer nach Abteilung, Standort oder Rolle zu organisieren. Dies ermöglicht es, Updates zuerst für Testgruppen zu genehmigen und dann in die Produktion auszurollen.',
      },
      {
        title: 'GPO für WSUS-Client-Targeting konfigurieren',
        description:
          'Erstellen Sie eine Gruppenrichtlinie, um Domänencomputer auf den WSUS-Server zu verweisen und sie mithilfe von Client-seitigem Targeting der richtigen Zielgruppe zuzuweisen.',
      },
      {
        title: 'Automatische Genehmigungsregeln konfigurieren',
        description:
          'Richten Sie automatische Genehmigungsregeln ein, um kritische und Sicherheitsupdates für bestimmte Gruppen zu genehmigen und den manuellen Genehmigungsaufwand zu reduzieren.',
        note: 'Testen Sie Updates immer zuerst in einer Pilotgruppe, bevor Sie sie für die Produktion genehmigen. Dies erkennt Probleme, bevor sie die gesamte Organisation betreffen.',
      },
      {
        title: 'WSUS-Server-Bereinigung ausführen',
        description:
          'Bereinigen Sie regelmäßig die WSUS-Datenbank und den Inhalt, um abgelaufene Updates, ersetzte Updates und nicht verwendeten Inhalt zu entfernen.',
        note: 'Planen Sie die Bereinigung monatlich als geplante Aufgabe. WSUS-Datenbanken können ohne regelmäßige Wartung sehr groß werden.',
      },
      {
        title: 'Client-Berichterstellung überprüfen',
        description:
          'Bestätigen Sie, dass Client-Computer an WSUS berichten und in den richtigen Zielgruppen erscheinen.',
      },
    ],
  },

  // ── 8. Dateiserver mit DFS einrichten (9 Schritte) ─────────────────
  'ws-file-server': {
    title: 'Dateiserver mit DFS einrichten',
    description:
      'Einen Windows-Dateiserver mit NTFS-Berechtigungen, SMB-Dateifreigaben und DFS-Namespaces (Distributed File System) und -Replikation für zentralisierten und redundanten Dateizugriff über mehrere Standorte konfigurieren.',
    prerequisites: [
      'Windows Server 2019 oder 2022, der einer Active Directory-Domäne beigetreten ist',
      'Ein dediziertes Datenvolume (D: oder E:) getrennt vom Betriebssystemvolume',
      'Domänen-Admin- oder Dateiserveradministratoren-Gruppenmitgliedschaft',
      'Für DFS-Replikation: zwei oder mehr Dateiserver',
    ],
    steps: [
      {
        title: 'Dateiserver- und DFS-Rollen installieren',
        description:
          'Installieren Sie die Dateiserverrolle zusammen mit DFS-Namespaces und DFS-Replikation für zentralisierte Namespaceverwaltung und Multistandort-Replikation.',
      },
      {
        title: 'Ordnerstruktur erstellen',
        description:
          'Erstellen Sie eine gut organisierte Ordnerstruktur auf dem Datenvolume. Verwenden Sie abteilungs- oder projektbasierte Ordner auf oberster Ebene.',
      },
      {
        title: 'NTFS-Berechtigungen konfigurieren',
        description:
          'Legen Sie NTFS-Berechtigungen für jeden Ordner fest, um den Zugriff auf die entsprechenden Sicherheitsgruppen zu beschränken. Entfernen Sie die Vererbung von den Basisordnern und wenden Sie explizite Berechtigungen an.',
        warning: 'Planen und dokumentieren Sie Ihr Berechtigungsmodell immer vor der Anwendung. Falsche Berechtigungen können Benutzer aussperren oder sensible Daten offenlegen.',
      },
      {
        title: 'SMB-Dateifreigaben erstellen',
        description:
          'Geben Sie die Ordner über das Netzwerk mittels SMB frei. Legen Sie Freigabeberechtigungen fest, die die NTFS-Berechtigungen ergänzen.',
        note: 'Eine gängige Best Practice ist es, auf Freigabeebene Ändern oder Vollzugriff zu gewähren und den granularen Zugriff über NTFS-Berechtigungen zu steuern. Die restriktivere Berechtigung hat Vorrang.',
      },
      {
        title: 'Zugriffsbasierte Aufzählung aktivieren',
        description:
          'Aktivieren Sie ABE, damit Benutzer nur Ordner und Dateien sehen, auf die sie Zugriff haben, was eine übersichtlichere Ansicht der Dateifreigabe bietet.',
      },
      {
        title: 'DFS-Namespace erstellen',
        description:
          'Richten Sie einen domänenbasierten DFS-Namespace ein, der einen einheitlichen UNC-Pfad bereitstellt (z. B. \\\\corp.contoso.com\\Files), unabhängig davon, welcher Server die tatsächlichen Daten hostet.',
      },
      {
        title: 'DFS-Replikation konfigurieren',
        description:
          'Richten Sie DFS-R ein, um Dateifreigaben zwischen zwei oder mehr Servern für Redundanz und lokalen Zugriff an Zweigstellen zu replizieren.',
        warning: 'Während der Erstreplikation hat der Inhalt des primären Mitglieds Vorrang. Stellen Sie sicher, dass der primäre Server die korrekten und vollständigen Daten hat, bevor Sie die Replikation starten.',
      },
      {
        title: 'Kontingente mit dem Ressourcen-Manager konfigurieren',
        description:
          'Richten Sie Kontingente ein, um zu verhindern, dass eine einzelne Abteilung den gesamten verfügbaren Speicherplatz verbraucht.',
        note: 'Kontingente können hart (blockiert Schreibvorgänge) oder weich (nur Berichterstellung) sein. Beginnen Sie mit weichen Kontingenten, um Nutzungsmuster zu verstehen, bevor Sie harte Grenzen durchsetzen.',
      },
      {
        title: 'Dateifreigabezugriff und DFS-Auflösung überprüfen',
        description:
          'Testen Sie, ob Benutzer über den DFS-Namespace auf Freigaben zugreifen können und ob Berechtigungen korrekt angewendet werden.',
      },
    ],
  },

  // ── 9. RDP-Gateway konfigurieren (10 Schritte) ─────────────────────
  'ws-rdp-gateway': {
    title: 'RDP-Gateway konfigurieren',
    description:
      'Ein Remotedesktop-Gateway (RD Gateway) installieren und konfigurieren, um sicheren, verschlüsselten RDP-Zugriff auf interne Server über HTTPS bereitzustellen, einschließlich SSL-Zertifikatkonfiguration, Verbindungsautorisierungsrichtlinien und Ressourcenautorisierungsrichtlinien.',
    prerequisites: [
      'Windows Server 2019 oder 2022 mit einer öffentlichen oder internen statischen IP',
      'Ein SSL/TLS-Zertifikat für den Gateway-Hostnamen (z. B. rdgw.contoso.com)',
      'Active Directory-Domänenmitgliedschaft',
      'Port 443 (HTTPS) in der Firewall von externen Netzwerken geöffnet',
    ],
    steps: [
      {
        title: 'Remotedesktop-Gateway-Rolle installieren',
        description:
          'Installieren Sie RD Gateway zusammen mit der Rolle Netzwerkrichtlinien- und Zugriffsdienste, die die Richtlinien-Engine bereitstellt.',
      },
      {
        title: 'SSL-Zertifikat beschaffen und installieren',
        description:
          'Importieren oder fordern Sie ein SSL-Zertifikat für den RD-Gateway-Servernamen an. Der allgemeine Name oder SAN des Zertifikats muss mit dem externen DNS-Namen übereinstimmen, den Clients verwenden.',
        warning: 'Das Zertifikat muss von allen verbindenden Clients als vertrauenswürdig eingestuft werden. Verwenden Sie eine öffentliche CA für externen Zugriff oder stellen Sie sicher, dass das Stammzertifikat der internen CA an alle Clients verteilt wird.',
      },
      {
        title: 'SSL-Zertifikat an RD Gateway binden',
        description:
          'Verknüpfen Sie das SSL-Zertifikat mit dem RD-Gateway-Dienst unter Verwendung des Zertifikat-Fingerabdrucks.',
      },
      {
        title: 'Verbindungsautorisierungsrichtlinie (CAP) erstellen',
        description:
          'Eine CAP definiert, WER sich über das RD-Gateway verbinden darf. Sie legt fest, welche Benutzergruppen Verbindungen herstellen dürfen, und kann Geräteumleitung einschränken.',
        note: 'Beschränken Sie die CAP für höhere Sicherheit auf eine bestimmte Gruppe wie RDP-Gateway-Benutzer anstelle aller Domänenbenutzer.',
      },
      {
        title: 'Ressourcenautorisierungsrichtlinie (RAP) erstellen',
        description:
          'Eine RAP definiert, auf WELCHE internen Ressourcen Benutzer über das RD-Gateway zugreifen können. Sie ordnet Benutzergruppen den erlaubten Zielservern zu.',
        warning: 'Vermeiden Sie es, Verbindungen zu ALLEN Netzwerkressourcen zuzulassen. Beschränken Sie immer auf bestimmte Servergruppen nach dem Prinzip der geringsten Berechtigung.',
      },
      {
        title: 'RD-Gateway-Verbindungslimits konfigurieren',
        description:
          'Legen Sie maximale Verbindungslimits und Leerlauf-Timeout-Werte fest, um Serverressourcen zu schützen und Sitzungsdisziplin durchzusetzen.',
      },
      {
        title: 'NPS-Protokollierung (Network Policy Server) konfigurieren',
        description:
          'Aktivieren Sie die Protokollierung auf der NPS-Komponente, um alle Verbindungsversuche, Erfolge und Fehlschläge für die Sicherheitsüberwachung zu verfolgen.',
        note: 'Überprüfen Sie NPS-Protokolle regelmäßig auf nicht autorisierte Zugriffsversuche. Erwägen Sie die Weiterleitung der Protokolle an ein SIEM für zentralisierte Überwachung.',
      },
      {
        title: 'Firewall-Regeln konfigurieren',
        description:
          'Stellen Sie sicher, dass die Windows-Firewall und alle Netzwerk-Firewalls HTTPS (443) eingehend zum RD-Gateway-Server zulassen.',
      },
      {
        title: 'RDP-Clients für die Verwendung des Gateways konfigurieren',
        description:
          'Richten Sie den Remotedesktopverbindungs-Client ein oder stellen Sie Gateway-Einstellungen über Gruppenrichtlinie bereit, um RDP-Verbindungen über das Gateway zu leiten.',
        note: 'Benutzer können das RD-Gateway auch manuell in der Remotedesktopverbindungs-App konfigurieren unter Erweitert > Einstellungen > Diese RD-Gateway-Servereinstellungen verwenden.',
      },
      {
        title: 'RDP-Gateway-Konnektivität testen und überprüfen',
        description:
          'Testen Sie die End-to-End-Verbindung, indem Sie sich von einem externen Netzwerk über das RD-Gateway mit einem internen Server verbinden.',
      },
    ],
  },

  // ── 10. Windows Server-Sicherung einrichten (8 Schritte) ───────────
  'ws-backup-recovery': {
    title: 'Windows Server-Sicherung einrichten',
    description:
      'Windows Server-Sicherung für vollständige Server-, Systemstatus- und Dateiebenen-Sicherungen installieren und konfigurieren, automatisierte Sicherungsaufträge planen, Sicherungsziele konfigurieren und Testwiederherstellungen durchführen, um Wiederherstellungsverfahren zu validieren.',
    prerequisites: [
      'Windows Server 2019 oder 2022',
      'Lokaler Administratorzugriff',
      'Ein dediziertes Sicherungsziel (externe Festplatte, Netzwerkfreigabe oder sekundäres Volume)',
      'Ausreichend Speicherplatz für mindestens zwei vollständige Sicherungen',
    ],
    steps: [
      {
        title: 'Windows Server-Sicherungsfunktion installieren',
        description:
          'Installieren Sie die Windows Server-Sicherungsfunktion, die das Befehlszeilentool wbadmin und das Sicherungs-MMC-Snap-In bereitstellt.',
      },
      {
        title: 'Vollständige Serversicherung auf Netzwerkfreigabe konfigurieren',
        description:
          'Richten Sie eine einmalige vollständige Serversicherung auf eine Netzwerkfreigabe ein. Dies sichert alle Volumes, den Systemstatus und Bare-Metal-Recovery-Daten.',
        note: 'Netzwerkbasierte Sicherungen behalten nur die neueste Sicherung. Für Versionshistorie verwenden Sie eine dedizierte Sicherungslösung oder rotieren Sie die Zielordner.',
      },
      {
        title: 'Tägliche automatisierte Sicherungen planen',
        description:
          'Erstellen Sie eine geplante Sicherungsrichtlinie, die automatisch zu einer festgelegten Zeit jeden Tag ausgeführt wird.',
        warning: 'Stellen Sie sicher, dass das Sicherungsziel ausreichend Speicherplatz hat. Eine fehlgeschlagene Sicherung aufgrund von unzureichendem Speicherplatz warnt Sie standardmäßig nicht.',
      },
      {
        title: 'Systemstatus-Sicherung für Domänencontroller konfigurieren',
        description:
          'Für Domänencontroller sind Systemstatus-Sicherungen entscheidend, da sie Active Directory, SYSVOL, die Registrierung und den Zertifikatspeicher umfassen.',
        note: 'Systemstatus-Sicherungen für Domänencontroller sollten mindestens zweimal innerhalb der Tombstone-Lebensdauer (Standard 180 Tage) durchgeführt werden, um die AD-Objektwiederherstellung zu ermöglichen.',
      },
      {
        title: 'Datei- und Ordnerebene-Sicherung konfigurieren',
        description:
          'Erstellen Sie eine gezielte Sicherungsrichtlinie für bestimmte wichtige Verzeichnisse wie Dateifreigaben oder Anwendungsdaten.',
      },
      {
        title: 'Sicherungsereignis-Benachrichtigungen aktivieren',
        description:
          'Konfigurieren Sie E-Mail-Benachrichtigungen für Sicherungserfolgs- und -fehlerereignisse, damit Administratoren über Probleme informiert werden.',
        note: 'Für eine robustere Überwachung integrieren Sie mit System Center Operations Manager (SCOM) oder einer Drittanbieter-Überwachungslösung.',
      },
      {
        title: 'Testwiederherstellung einer Datei durchführen',
        description:
          'Testen Sie Ihre Sicherungen regelmäßig, indem Sie eine Wiederherstellung durchführen. Beginnen Sie mit einer Wiederherstellung auf Dateiebene, um die Datenintegrität zu überprüfen, ohne Produktionssysteme zu beeinträchtigen.',
        warning: 'Testen Sie Wiederherstellungen immer zuerst an einem alternativen Speicherort. Die Wiederherstellung am ursprünglichen Speicherort überschreibt vorhandene Dateien.',
      },
      {
        title: 'Sicherungszustand und -verlauf überwachen',
        description:
          'Überprüfen Sie den Sicherungsverlauf, suchen Sie nach Fehlern und stellen Sie sicher, dass Sicherungen planmäßig erfolgreich abgeschlossen werden.',
      },
    ],
  },
}

export default wsGuidesDe
