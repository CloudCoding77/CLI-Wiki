export interface CommandTranslation {
  description: string
  examples: string[]
  tips?: string
}

const commandsDe: Record<string, CommandTranslation> = {
  // ── File Management ──────────────────────────────────────────
  ls: {
    description: 'Verzeichnisinhalte auflisten.',
    examples: [
      'Alle Dateien inklusive versteckter anzeigen',
      'Mit menschenlesbaren Dateigrößen auflisten',
      'Windows: Verzeichnis auflisten',
    ],
    tips: 'Verwende `ls -R` für eine rekursive Auflistung.',
  },
  cd: {
    description: 'Das aktuelle Arbeitsverzeichnis wechseln.',
    examples: [
      'Zum Benutzerverzeichnis wechseln',
      'Eine Ebene nach oben wechseln',
      'Zu einem absoluten Pfad wechseln',
    ],
  },
  pwd: {
    description: 'Den aktuellen Arbeitsverzeichnis-Pfad ausgeben.',
    examples: ['Aktuelles Verzeichnis anzeigen'],
  },
  cp: {
    description: 'Dateien oder Verzeichnisse kopieren.',
    examples: [
      'Eine Datei kopieren',
      'Verzeichnis rekursiv kopieren',
      'Windows: Datei kopieren',
    ],
    tips: 'Verwende `-i`, um vor dem Überschreiben nachzufragen.',
  },
  mv: {
    description: 'Dateien und Verzeichnisse verschieben oder umbenennen.',
    examples: ['Eine Datei umbenennen', 'In ein Verzeichnis verschieben'],
  },
  rm: {
    description: 'Dateien oder Verzeichnisse löschen.',
    examples: [
      'Eine Datei löschen',
      'Verzeichnis rekursiv löschen',
      'Windows: Datei löschen',
    ],
    tips: 'Verwende `rm -i` für eine interaktive Bestätigung. Sei sehr vorsichtig mit `rm -rf`!',
  },
  mkdir: {
    description: 'Neue Verzeichnisse erstellen.',
    examples: ['Ein Verzeichnis erstellen', 'Verschachtelte Verzeichnisse erstellen'],
  },
  touch: {
    description: 'Eine leere Datei erstellen oder deren Zeitstempel aktualisieren.',
    examples: ['Leere Datei erstellen', 'Zeitstempel aktualisieren'],
  },
  find: {
    description: 'Dateien und Verzeichnisse in einer Verzeichnishierarchie suchen.',
    examples: [
      'Nach Name suchen',
      'Dateien finden, die in den letzten 24 Stunden geändert wurden',
      'Leere Dateien finden und löschen',
    ],
    tips: 'Kombiniere mit `-exec`, um Befehle auf die Ergebnisse anzuwenden.',
  },
  cat: {
    description: 'Dateiinhalte anzeigen.',
    examples: ['Dateiinhalt anzeigen', 'Mit Zeilennummern anzeigen', 'Dateien zusammenfügen'],
  },
  head: {
    description: 'Die ersten Zeilen einer Datei anzeigen.',
    examples: ['Erste 10 Zeilen anzeigen', 'Erste 20 Zeilen anzeigen'],
  },
  tail: {
    description: 'Die letzten Zeilen einer Datei anzeigen.',
    examples: ['Letzte 10 Zeilen anzeigen', 'Datei in Echtzeit verfolgen'],
    tips: '`tail -f` ist unverzichtbar für die Überwachung von Live-Logdateien.',
  },
  ln: {
    description: 'Harte oder symbolische Links erstellen.',
    examples: ['Symbolischen Link erstellen', 'Windows: Symlink erstellen'],
  },
  less: {
    description: 'Dateiinhalte mit Scrollen und Suche anzeigen.',
    examples: [
      'Eine Datei öffnen',
      'Vorwärts suchen',
      'Rückwärts suchen',
      'Beenden',
    ],
    tips: 'Verwende `G` um zum Ende zu springen, `g` um zum Anfang zu springen. `F` folgt neuer Ausgabe wie `tail -f`.',
  },
  tree: {
    description: 'Verzeichnisstruktur als Baum anzeigen.',
    examples: [
      'Aktuellen Verzeichnisbaum anzeigen',
      'Mit Dateigrößen anzeigen',
      'Tiefe auf 2 Ebenen begrenzen',
      'Windows: auch Dateien anzeigen',
    ],
    tips: 'Installation auf macOS mit `brew install tree`, auf Linux mit `apt install tree`.',
  },
  rename: {
    description: 'Dateien umbenennen, mit Musterunterstützung unter Linux.',
    examples: [
      'Eine einzelne Datei umbenennen',
      'Linux: Dateiendung für mehrere Dateien ändern',
      'Windows: eine Datei umbenennen',
    ],
    tips: 'Unter Linux verwendet `rename` Perl-Regex. Installation mit `apt install rename`.',
  },
  realpath: {
    description: 'Den absoluten Pfad einer Datei auflösen, Symlinks eingeschlossen.',
    examples: ['Absoluten Pfad ermitteln', 'Symlink-Ziel auflösen'],
  },
  basename: {
    description: 'Den Dateinamen oder Verzeichnisteil aus einem Pfad extrahieren.',
    examples: [
      'Dateiname aus Pfad ermitteln',
      'Dateiendung entfernen',
      'Verzeichnisteil ermitteln',
    ],
    tips: 'Wird häufig in Shell-Skripten verwendet, um Dateipfade dynamisch zu verarbeiten.',
  },
  rmdir: {
    description: 'Leere Verzeichnisse entfernen.',
    examples: [
      'Ein leeres Verzeichnis entfernen',
      'Verschachtelte leere Verzeichnisse entfernen',
      'Windows: Verzeichnis und Inhalt entfernen',
    ],
    tips: 'Verwende `rm -r`, um nicht-leere Verzeichnisse unter Linux/macOS zu entfernen.',
  },
  dirname: {
    description: 'Die letzte Komponente eines Dateipfads entfernen und das Verzeichnis zurückgeben.',
    examples: ['Verzeichnis aus Pfad extrahieren', 'In einer Skriptvariable verwenden'],
    tips: 'Nützlich in Skripten, um das Verzeichnis des aktuellen Skripts zu ermitteln.',
  },
  chroot: {
    description: 'Einen Befehl oder eine Shell mit einem anderen Stammverzeichnis ausführen.',
    examples: ['Eine chroot-Umgebung betreten', 'Einen einzelnen Befehl im chroot ausführen'],
    tips: 'Moderne Alternativen wie `systemd-nspawn` und Container bieten bessere Isolation.',
  },
  mktemp: {
    description: 'Temporäre Dateien oder Verzeichnisse mit eindeutigen Namen sicher erstellen.',
    examples: [
      'Eine temporäre Datei erstellen',
      'Ein temporäres Verzeichnis erstellen',
      'Benutzerdefinierte Vorlage',
    ],
    tips: 'Verwende immer `mktemp` statt fest kodierter temporärer Pfade, um Race Conditions zu vermeiden.',
  },
  install: {
    description: 'Dateien kopieren und Attribute (Berechtigungen, Eigentümer) in einem Schritt setzen.',
    examples: [
      'Programmdatei mit Ausführungsrechten installieren',
      'Mit Eigentümer installieren',
      'Verzeichnisse mit install erstellen',
    ],
    tips: 'Wird häufig in Makefiles zum Bereitstellen kompilierter Dateien verwendet.',
  },

  // ── Networking ───────────────────────────────────────────────
  ping: {
    description: 'ICMP-Echo-Anfragen senden, um die Netzwerkverbindung zu testen.',
    examples: ['Einen Host anpingen', 'Mit Anzahl anpingen'],
  },
  curl: {
    description: 'Daten über verschiedene Protokolle von oder zu einem Server übertragen.',
    examples: ['GET-Anfrage', 'JSON-Daten per POST senden', 'Datei herunterladen'],
    tips: 'Verwende `-v` für eine ausführliche Ausgabe zur Fehlersuche bei Anfragen.',
  },
  wget: {
    description: 'Dateien aus dem Web herunterladen.',
    examples: ['Eine Datei herunterladen', 'Im Hintergrund herunterladen', 'Eine Website spiegeln'],
  },
  ssh: {
    description: 'Sichere Verbindung zu einem entfernten Rechner herstellen.',
    examples: ['Mit Server verbinden', 'Mit Schlüssel verbinden', 'SSH-Tunnel'],
  },
  scp: {
    description: 'Dateien sicher zwischen Hosts über SSH kopieren.',
    examples: [
      'Auf entfernten Rechner kopieren',
      'Vom entfernten Rechner kopieren',
      'Verzeichnis kopieren',
    ],
  },
  netstat: {
    description: 'Netzwerkverbindungen, Routing-Tabellen und Schnittstellenstatistiken anzeigen.',
    examples: [
      'Lauschende Ports anzeigen (Linux)',
      'Alle Verbindungen anzeigen',
      'Routing-Tabelle anzeigen',
    ],
    tips: 'Unter modernem Linux wird `ss` gegenüber `netstat` bevorzugt.',
  },
  traceroute: {
    description: 'Den Weg verfolgen, den Pakete zu einem Netzwerk-Host nehmen.',
    examples: ['Route zu einem Host verfolgen', 'Windows'],
  },
  ifconfig: {
    description: 'Netzwerkschnittstellenparameter anzeigen oder konfigurieren.',
    examples: [
      'IP-Adressen anzeigen (Linux)',
      'Schnittstellen anzeigen (macOS)',
      'Windows-IP-Konfiguration',
    ],
    tips: 'Unter Linux hat `ip` auf modernen Distributionen `ifconfig` abgelöst.',
  },
  dig: {
    description: 'DNS-Abfragewerkzeug.',
    examples: ['A-Eintrag abfragen', 'MX-Einträge abfragen', 'Kurzantwort'],
  },
  nslookup: {
    description: 'DNS-Namensserver abfragen.',
    examples: ['Domain abfragen', 'Bestimmten DNS-Server verwenden'],
  },
  host: {
    description: 'Einfaches DNS-Abfragewerkzeug.',
    examples: ['Domain abfragen', 'Reverse-Abfrage'],
  },
  whois: {
    description: 'Domain-Registrierungsinformationen abfragen.',
    examples: ['Domain-Informationen abfragen'],
  },
  rsync: {
    description: 'Schnelles, vielseitiges Werkzeug zum Kopieren/Synchronisieren von Dateien.',
    examples: [
      'Verzeichnisse synchronisieren',
      'Mit entferntem Rechner synchronisieren',
      'Probelauf',
    ],
    tips: 'Verwende `--delete`, um Dateien im Ziel zu entfernen, die in der Quelle nicht vorhanden sind.',
  },
  nc: {
    description: 'Netzwerkwerkzeug zum Lesen/Schreiben über Netzwerkverbindungen.',
    examples: ['Prüfen, ob ein Port offen ist', 'Auf einem Port lauschen', 'Daten senden'],
  },
  iptables: {
    description: 'Linux-Kernel-Firewallregeln konfigurieren.',
    examples: [
      'Alle Regeln auflisten',
      'Eingehende SSH-Verbindungen erlauben',
      'Eine IP-Adresse blockieren',
    ],
    tips: 'Unter modernem Linux ist `nftables` der Nachfolger von `iptables`.',
  },
  arp: {
    description: 'Den ARP-Cache anzeigen und bearbeiten.',
    examples: ['ARP-Tabelle anzeigen', 'Eintrag löschen'],
  },
  tcpdump: {
    description: 'Netzwerkpakete aufzeichnen und analysieren.',
    examples: [
      'Auf Schnittstelle eth0 aufzeichnen',
      'HTTP-Verkehr aufzeichnen',
      'Aufzeichnung in Datei speichern',
      'Aufzeichnungsdatei lesen',
    ],
    tips: 'Verwende `-n` um DNS-Auflösung zu überspringen. Erfordert Root oder sudo.',
  },
  nmap: {
    description: 'Netzwerkscanner zur Host-Erkennung und Port-Analyse.',
    examples: [
      'Einen Host scannen',
      'Die 100 häufigsten Ports scannen',
      'Betriebssystem-Erkennung',
      'Subnetz scannen',
    ],
    tips: 'Verwende `-sn` für einen Ping-Sweep. Hole immer eine Genehmigung ein, bevor du fremde Netzwerke scannst.',
  },
  ss: {
    description: 'Socket-Statistiken anzeigen — der moderne Ersatz für netstat.',
    examples: [
      'Alle Verbindungen anzeigen',
      'Lauschende TCP-Ports anzeigen',
      'Lauschende UDP-Ports anzeigen',
      'Nach Port filtern',
    ],
    tips: '`ss -tlnp` ist der schnellste Weg zu sehen, welcher Prozess auf welchem Port lauscht.',
  },
  ip: {
    description: 'Netzwerkschnittstellen, Routing und Adressen anzeigen und konfigurieren.',
    examples: [
      'Alle Netzwerkschnittstellen anzeigen',
      'Routing-Tabelle anzeigen',
      'Eine IP-Adresse hinzufügen',
      'Schnittstelle aktivieren',
    ],
    tips: '`ip a` ist der moderne Ersatz für `ifconfig`. Verwende `ip -br a` für eine kompakte Ansicht.',
  },
  mtr: {
    description: 'Kombiniert ping und traceroute zu einem Echtzeit-Netzwerkdiagnosetool.',
    examples: [
      'Interaktiven Trace starten',
      'Nicht-interaktiver Berichtsmodus',
      'TCP statt ICMP verwenden',
    ],
    tips: 'Installation mit `apt install mtr` oder `brew install mtr`.',
  },
  sftp: {
    description: 'Dateien sicher über SSH mit einer interaktiven Shell übertragen.',
    examples: [
      'Mit einem Server verbinden',
      'Eine Datei herunterladen',
      'Eine Datei hochladen',
      'Ein Verzeichnis herunterladen',
    ],
    tips: 'Verwende `lpwd` und `lcd` um dein lokales Dateisystem während der Verbindung zu navigieren.',
  },
  bridge: {
    description: 'Netzwerk-Bridge-Geräte verwalten (Teil von iproute2).',
    examples: [
      'Bridge-Weiterleitungsdatenbank anzeigen',
      'VLAN-Informationen anzeigen',
      'Bridge-Link-Informationen anzeigen',
    ],
  },
  ethtool: {
    description: 'Ethernet-Geräteeinstellungen anzeigen und ändern (Geschwindigkeit, Duplex, Wake-on-LAN).',
    examples: [
      'Schnittstelleneinstellungen anzeigen',
      'Treiberinformationen anzeigen',
      'Link-Statistiken anzeigen',
    ],
    tips: 'Erfordert Root-Rechte zum Ändern von Einstellungen. Nützlich zur Diagnose von NIC-Problemen.',
  },
  socat: {
    description: 'Mehrzweck-Relay für bidirektionalen Datentransfer zwischen zwei Kanälen.',
    examples: [
      'Einfache TCP-Portweiterleitung',
      'Ein virtuelles serielles Port-Paar erstellen',
      'Verbindung zu einem TLS-Server herstellen',
    ],
    tips: 'Leistungsfähiger als `nc` — unterstützt SSL, UNIX-Sockets, serielle Ports und mehr.',
  },
  httpie: {
    description: 'Benutzerfreundlicher HTTP-Client für das Terminal, Alternative zu curl.',
    examples: ['Einfache GET-Anfrage', 'JSON-Daten per POST senden', 'Benutzerdefinierte Header'],
    tips: 'Installation mit `pip install httpie`. Verwende `:=` für Nicht-String-JSON-Werte.',
  },
  bandwhich: {
    description: 'Aktuelle Netzwerkauslastung nach Prozess und Verbindung anzeigen.',
    examples: ['Mit sudo für vollständige Informationen ausführen', 'Rohdatenmodus anzeigen'],
    tips: 'Installation mit `cargo install bandwhich` oder dem Paketmanager.',
  },
  'wget-advanced': {
    description: 'Erweiterte wget-Nutzung: Websites spiegeln, Geschwindigkeitsbegrenzung und rekursive Downloads.',
    examples: [
      'Eine Website für Offline-Zugriff spiegeln',
      'Download mit Geschwindigkeitsbegrenzung',
      'Unterbrochenen Download fortsetzen',
      'Download mit Wiederholungsversuchen',
    ],
    tips: 'Verwende `--no-parent` bei rekursiven Downloads, um innerhalb eines Verzeichnisses zu bleiben.',
  },

  // ── System Info ──────────────────────────────────────────────
  uname: {
    description: 'Systeminformationen anzeigen.',
    examples: [
      'Alle Systeminformationen anzeigen',
      'Kernelversion anzeigen',
      'Windows-Systeminformationen',
    ],
  },
  hostname: {
    description: 'Den Hostnamen des Systems anzeigen oder setzen.',
    examples: ['Hostnamen anzeigen', 'FQDN anzeigen'],
  },
  uptime: {
    description: 'Anzeigen, wie lange das System bereits läuft.',
    examples: ['Betriebszeit anzeigen', 'Übersichtliches Format'],
  },
  df: {
    description: 'Speicherplatzbelegung des Dateisystems melden.',
    examples: ['Speichernutzung menschenlesbar anzeigen', 'Bestimmten Einhängepunkt anzeigen'],
  },
  du: {
    description: 'Speicherverbrauch von Dateien und Verzeichnissen schätzen.',
    examples: ['Verzeichnisgrößen anzeigen', 'Gesamtgröße eines Verzeichnisses anzeigen'],
  },
  free: {
    description: 'Menge an freiem und belegtem Arbeitsspeicher anzeigen.',
    examples: ['Speicher menschenlesbar anzeigen', 'In Megabyte anzeigen'],
  },
  who: {
    description: 'Anzeigen, wer am System angemeldet ist.',
    examples: ['Angemeldete Benutzer anzeigen', 'Aktuellen Benutzer anzeigen'],
  },
  env: {
    description: 'Umgebungsvariablen anzeigen oder setzen.',
    examples: [
      'Alle Umgebungsvariablen auflisten',
      'Variable setzen (bash)',
      'Windows: Variablen auflisten',
    ],
  },
  lscpu: {
    description: 'Detaillierte CPU-Architekturinformationen anzeigen.',
    examples: ['CPU-Informationen anzeigen', 'JSON-Ausgabe', 'Bestimmtes Feld anzeigen'],
  },
  lshw: {
    description: 'Detaillierte Hardwarekonfiguration des Systems auflisten.',
    examples: [
      'Vollständiger Hardwarebericht',
      'Kurze Zusammenfassung',
      'Nur Netzwerkgeräte anzeigen',
      'HTML-Bericht',
    ],
    tips: 'Erfordert Root für vollständige Informationen. Installation mit `apt install lshw`.',
  },
  lspci: {
    description: 'Alle PCI-Geräte auflisten (Grafikkarten, Netzwerkkarten usw.).',
    examples: [
      'Alle PCI-Geräte auflisten',
      'Ausführliche Ausgabe',
      'Verwendete Kernel-Treiber anzeigen',
      'Nach GPU filtern',
    ],
  },
  lsusb: {
    description: 'Alle am System angeschlossenen USB-Geräte auflisten.',
    examples: ['Alle USB-Geräte auflisten', 'Ausführliche Informationen', 'Als Baumstruktur anzeigen'],
  },
  printenv: {
    description: 'Umgebungsvariablen ausgeben.',
    examples: [
      'Alle Umgebungsvariablen ausgeben',
      'Bestimmte Variable ausgeben',
      'HOME ausgeben',
    ],
    tips: 'Verwende `env` für ein ähnliches Ergebnis mit mehr Formatierungsoptionen.',
  },
  arch: {
    description: 'Die Hardware-Architektur des Systems anzeigen.',
    examples: ['Architektur anzeigen', 'macOS: Unter Rosetta ausführen'],
  },
  nproc: {
    description: 'Die Anzahl der verfügbaren Verarbeitungseinheiten (CPU-Kerne) ausgeben.',
    examples: ['CPU-Anzahl anzeigen', 'In make für parallele Jobs verwenden'],
    tips: 'Auf macOS Installation über `brew install coreutils` (als `gnproc`) oder `sysctl -n hw.ncpu` verwenden.',
  },
  locale: {
    description: 'Locale- und Internationalisierungseinstellungen anzeigen oder setzen.',
    examples: [
      'Alle Locale-Einstellungen anzeigen',
      'Verfügbare Locales auflisten',
      'Bestimmte Kategorie anzeigen',
    ],
    tips: 'Setze `LC_ALL=C` für vorhersagbare Sortierung und Byte-Vergleiche in Skripten.',
  },

  // ── Process Management ───────────────────────────────────────
  ps: {
    description: 'Laufende Prozesse auflisten.',
    examples: [
      'Alle Prozesse anzeigen',
      'Prozessbaum anzeigen',
      'Windows: Aufgaben auflisten',
    ],
  },
  top: {
    description: 'Echtzeit-Systemressourcennutzung und Prozesse anzeigen.',
    examples: ['top starten', 'htop starten (falls installiert)', 'Nach Speicher sortieren'],
    tips: '`htop` ist eine benutzerfreundlichere Alternative zu `top`.',
  },
  kill: {
    description: 'Prozesse anhand der PID beenden.',
    examples: [
      'Prozess ordnungsgemäß beenden',
      'Beenden erzwingen',
      'Nach Name beenden',
      'Windows: Beenden erzwingen',
    ],
  },
  'bg-fg': {
    description: 'Hintergrund- und Vordergrund-Jobs in der Shell verwalten.',
    examples: [
      'Hintergrund-Jobs auflisten',
      'In den Hintergrund senden',
      'In den Vordergrund holen',
    ],
    tips: 'Drücke Strg+Z, um einen laufenden Prozess anzuhalten, dann verwende `bg` oder `fg`.',
  },
  cron: {
    description: 'Wiederkehrende Aufgaben planen.',
    examples: [
      'Cron-Jobs bearbeiten',
      'Cron-Jobs auflisten',
      'Skript täglich um 2 Uhr ausführen',
    ],
    tips: 'Verwende https://crontab.guru zum Erstellen von Cron-Ausdrücken.',
  },
  nice: {
    description: 'Einen Prozess mit angepasster Priorität starten.',
    examples: [
      'Mit niedrigerer Priorität ausführen',
      'Mit höchster Priorität ausführen (Root)',
      'Priorität eines laufenden Prozesses ändern',
    ],
    tips: 'Nice-Werte reichen von -20 (höchste Priorität) bis 19 (niedrigste). Nur Root kann negative Werte setzen.',
  },
  pgrep: {
    description: 'Prozesse nach Name oder Muster finden oder signalisieren.',
    examples: [
      'PID eines Prozesses nach Name finden',
      'Prozessnamen und PIDs auflisten',
      'Alle Prozesse nach Name beenden',
      'Bestimmtes Signal senden',
    ],
    tips: 'Sicherer als `kill $(pidof name)` bei mehreren Instanzen.',
  },
  systemctl: {
    description: 'Den systemd-System- und Dienst-Manager steuern.',
    examples: [
      'Einen Dienst starten',
      'Einen Dienst stoppen',
      'Dienst beim Hochfahren aktivieren',
      'Dienststatus prüfen',
    ],
    tips: 'Verwende `systemctl list-units --failed` um alle fehlgeschlagenen Dienste zu sehen.',
  },
  service: {
    description: 'init.d-Dienste verwalten (ältere Alternative zu systemctl).',
    examples: [
      'Einen Dienst starten',
      'Einen Dienst stoppen',
      'Einen Dienst neustarten',
      'Status prüfen',
    ],
    tips: 'Bevorzuge `systemctl` auf modernen Systemen.',
  },
  at: {
    description: 'Einen einmaligen Befehl zu einem bestimmten Zeitpunkt planen.',
    examples: [
      'Zu einem bestimmten Zeitpunkt planen',
      'In 1 Stunde ausführen',
      'Ausstehende Jobs auflisten',
      'Einen ausstehenden Job entfernen',
    ],
    tips: 'Für wiederkehrende Aufgaben verwende `cron`.',
  },
  jobs: {
    description: 'Aktive Jobs in der aktuellen Shell-Sitzung auflisten.',
    examples: ['Alle Jobs auflisten', 'Mit Prozess-IDs auflisten', 'Nur laufende Jobs anzeigen'],
  },
  disown: {
    description: 'Jobs aus der Shell-Jobtabelle entfernen, damit sie das Abmelden überleben.',
    examples: [
      'Den letzten Hintergrund-Job freigeben',
      'Einen bestimmten Job freigeben',
      'Alle Jobs freigeben',
    ],
    tips: 'Verwende `nohup` beim Starten des Befehls oder `disown` nach dem Hintergrundsetzen.',
  },
  wait: {
    description: 'Auf das Ende von Hintergrundprozessen oder Jobs warten.',
    examples: [
      'Auf alle Hintergrund-Jobs warten',
      'Auf bestimmte PID warten',
      'Warten und Exit-Status prüfen',
    ],
  },
  timeout: {
    description: 'Einen Befehl mit Zeitlimit ausführen und ihn beenden, wenn die Dauer überschritten wird.',
    examples: [
      'Nach 5 Sekunden beenden',
      'SIGKILL nach 10 Sekunden senden',
      'Timeout mit Nachfrist',
    ],
    tips: 'Auf macOS Installation über `brew install coreutils` (als `gtimeout`).',
  },
  renice: {
    description: 'Die Planungspriorität laufender Prozesse ändern.',
    examples: [
      'Priorität eines Prozesses senken',
      'Priorität erhöhen (erfordert Root)',
      'Alle Prozesse eines Benutzers anpassen',
    ],
    tips: 'Werte reichen von -20 (höchste Priorität) bis 19 (niedrigste). Nur Root kann negative Werte setzen.',
  },

  // ── Text Processing ──────────────────────────────────────────
  grep: {
    description: 'Text anhand von Mustern durchsuchen.',
    examples: [
      'Nach Muster suchen',
      'Rekursive Suche',
      'Groß-/Kleinschreibung ignorieren',
      'Windows: Zeichenkette suchen',
    ],
    tips: 'Verwende `-n` für Zeilennummern und `-c` zum Zählen der Treffer.',
  },
  sed: {
    description: 'Stream-Editor zum Filtern und Transformieren von Text.',
    examples: [
      'Erstes Vorkommen ersetzen',
      'Alle Vorkommen ersetzen',
      'Direkt in der Datei bearbeiten',
    ],
    tips: "Unter macOS benötigt `sed -i` ein leeres String-Argument: `sed -i '' 's/old/new/g' file`.",
  },
  awk: {
    description: 'Mustererkennungs- und Textverarbeitungssprache.',
    examples: ['Zweite Spalte ausgeben', 'Eine Spalte summieren', 'Benutzerdefiniertes Trennzeichen'],
  },
  sort: {
    description: 'Zeilen von Textdateien sortieren.',
    examples: [
      'Alphabetisch sortieren',
      'Numerisch sortieren',
      'In umgekehrter Reihenfolge sortieren',
      'Sortieren und Duplikate entfernen',
    ],
  },
  uniq: {
    description: 'Wiederholte Zeilen melden oder unterdrücken (Eingabe muss sortiert sein).',
    examples: ['Doppelte Zeilen entfernen', 'Vorkommen zählen'],
  },
  wc: {
    description: 'Zeilen, Wörter und Zeichen zählen.',
    examples: ['Zeilen zählen', 'Wörter zählen', 'Zeichen zählen'],
  },
  diff: {
    description: 'Dateien zeilenweise vergleichen.',
    examples: ['Zwei Dateien vergleichen', 'Unified-Format', 'Windows: Dateien vergleichen'],
  },
  cut: {
    description: 'Abschnitte aus jeder Zeile einer Datei entfernen.',
    examples: ['Felder nach Trennzeichen extrahieren', 'Zeichen 1-10 extrahieren'],
  },
  tr: {
    description: 'Zeichen übersetzen oder löschen.',
    examples: [
      'In Großbuchstaben umwandeln',
      'Ziffern löschen',
      'Wiederholte Leerzeichen zusammenfassen',
    ],
  },
  tee: {
    description: 'Von der Standardeingabe lesen und sowohl auf die Standardausgabe als auch in Dateien schreiben.',
    examples: ['In Datei und Standardausgabe schreiben', 'An Datei anhängen', 'Mit sudo schreiben'],
  },
  xargs: {
    description: 'Befehle aus der Standardeingabe erstellen und ausführen.',
    examples: [
      'Gefundene Dateien löschen',
      'Mit Platzhalter ausführen',
      'Parallele Ausführung',
    ],
    tips: 'Verwende `-0` zusammen mit `find -print0` für Dateinamen mit Leerzeichen.',
  },
  paste: {
    description: 'Zeilen von Dateien nebeneinander zusammenführen.',
    examples: ['Zwei Dateien zusammenführen', 'Mit Komma verbinden'],
  },
  column: {
    description: 'Eingabe in Spalten formatieren.',
    examples: ['Als Tabelle formatieren', 'Trennzeichen angeben'],
  },
  jq: {
    description: 'Kommandozeilen-JSON-Prozessor — JSON aufteilen, filtern und transformieren.',
    examples: [
      'JSON formatiert ausgeben',
      'Ein Feld extrahieren',
      'Verschachteltes Feld extrahieren',
      'Array-Elemente filtern',
    ],
    tips: 'Verwende `-r` für rohe Zeichenkettenausgabe (ohne Anführungszeichen).',
  },
  yq: {
    description: 'Kommandozeilen-YAML/JSON-Prozessor — wie jq, aber für YAML.',
    examples: [
      'Ein YAML-Feld lesen',
      'YAML in JSON konvertieren',
      'Ein Feld direkt in der Datei aktualisieren',
    ],
    tips: 'Installation mit `brew install yq`. Äußerst nützlich für Kubernetes- und CI-Konfigurationen.',
  },
  printf: {
    description: 'Text mit präziser Kontrolle über die Ausgabe formatieren und ausgeben.',
    examples: [
      'Mit Zeilenumbruch ausgeben',
      'Zahlen formatieren',
      'Wiederholte Ausgabe erzeugen',
      'Zeichenketten auffüllen',
    ],
    tips: 'Bevorzuge `printf` gegenüber `echo` in Skripten für konsistentes plattformübergreifendes Verhalten.',
  },
  fold: {
    description: 'Lange Zeilen auf eine bestimmte Zeilenbreite umbrechen.',
    examples: ['Bei 80 Zeichen umbrechen', 'An Wortgrenzen umbrechen', 'Befehlsausgabe umbrechen'],
  },
  split: {
    description: 'Eine Datei in kleinere Teile aufteilen.',
    examples: [
      'In Dateien mit je 100 Zeilen aufteilen',
      'In 10-MB-Stücke aufteilen',
      'Mit numerischem Suffix aufteilen',
    ],
    tips: 'Wieder zusammenfügen mit `cat part_* > original.txt`.',
  },
  comm: {
    description: 'Zwei sortierte Dateien zeilenweise vergleichen und eindeutige sowie gemeinsame Zeilen anzeigen.',
    examples: [
      'Nur in Datei1 vorhandene Zeilen anzeigen',
      'Gemeinsame Zeilen beider Dateien anzeigen',
      'Nur in Datei2 vorhandene Zeilen anzeigen',
    ],
    tips: 'Eingabedateien müssen sortiert sein. Verwende bei Bedarf vorher `sort`.',
  },
  nl: {
    description: 'Zeilen von Dateien mit konfigurierbarer Formatierung nummerieren.',
    examples: [
      'Alle nicht-leeren Zeilen nummerieren',
      'Alle Zeilen einschließlich Leerzeilen nummerieren',
      'Benutzerdefiniertes Format verwenden (mit führenden Nullen)',
    ],
  },
  expand: {
    description: 'Tabulatoren in Leerzeichen und umgekehrt umwandeln.',
    examples: [
      'Tabulatoren in 4 Leerzeichen umwandeln',
      'Leerzeichen zurück in Tabulatoren umwandeln',
      'Nur führende Tabulatoren umwandeln',
    ],
  },
  envsubst: {
    description: 'Umgebungsvariablen-Referenzen in Textvorlagen ersetzen.',
    examples: [
      'Alle Umgebungsvariablen in einer Vorlage ersetzen',
      'Nur bestimmte Variablen ersetzen',
    ],
    tips: 'Teil von GNU gettext. Installation auf macOS über `brew install gettext`.',
  },
  rev: {
    description: 'Zeichen jeder Zeile in einer Datei oder Eingabe umkehren.',
    examples: [
      'Eine Zeichenkette umkehren',
      'Zeilen in einer Datei umkehren',
      'Dateierweiterung extrahieren',
    ],
  },

  // ── Package Management ───────────────────────────────────────
  apt: {
    description: 'Paketverwaltung für Debian-/Ubuntu-basierte Distributionen.',
    examples: [
      'Paketliste aktualisieren',
      'Ein Paket installieren',
      'Alle Pakete aktualisieren',
      'Ein Paket entfernen',
    ],
  },
  dnf: {
    description: 'Paketverwaltung für Fedora-/RHEL-basierte Distributionen.',
    examples: ['Ein Paket installieren', 'Alle Pakete aktualisieren', 'Pakete suchen'],
  },
  brew: {
    description: 'Homebrew-Paketverwaltung für macOS und Linux.',
    examples: [
      'Ein Paket installieren',
      'Homebrew aktualisieren',
      'Pakete aktualisieren',
      'Pakete suchen',
    ],
  },
  choco: {
    description: 'Paketverwaltung für Windows (Chocolatey / Windows Package Manager).',
    examples: ['Mit Chocolatey installieren', 'Mit winget installieren', 'Mit winget suchen'],
  },
  npm: {
    description: 'Node.js-Paketmanager zum Installieren und Verwalten von JavaScript-Paketen.',
    examples: [
      'Abhängigkeiten installieren',
      'Ein Paket global installieren',
      'Ein Skript aus package.json ausführen',
      'Alle Pakete aktualisieren',
    ],
    tips: 'Verwende `npm ci` für saubere Installationen in CI-Umgebungen.',
  },
  pip: {
    description: 'Python-Paketinstaller zum Verwalten von Python-Bibliotheken.',
    examples: [
      'Ein Paket installieren',
      'Aus Requirements-Datei installieren',
      'Installierte Pakete auflisten',
      'Ein Paket deinstallieren',
    ],
    tips: 'Verwende virtuelle Umgebungen (`python3 -m venv venv`), um Projektabhängigkeiten zu isolieren.',
  },
  snap: {
    description: 'Snap-Pakete installieren und verwalten — containerisierte Softwarebündel.',
    examples: [
      'Ein Snap-Paket installieren',
      'Installierte Snaps auflisten',
      'Alle Snaps aktualisieren',
      'Einen Snap entfernen',
    ],
    tips: 'Verwende `--classic` für Apps, die vollen Systemzugriff benötigen.',
  },
  flatpak: {
    description: 'Flatpak-Anwendungen in Sandbox-Containern installieren und verwalten.',
    examples: [
      'Eine Anwendung installieren',
      'Eine Flatpak-App ausführen',
      'Installierte Apps auflisten',
      'Alle Apps aktualisieren',
    ],
  },
  cargo: {
    description: 'Rust-Paketmanager und Build-System.',
    examples: [
      'Ein neues Projekt erstellen',
      'Das Projekt kompilieren',
      'Das Projekt ausführen',
      'Ein binäres Crate installieren',
    ],
    tips: 'Verwende `cargo add [crate]` um Abhängigkeiten hinzuzufügen. `cargo clippy` führt den Rust-Linter aus.',
  },
  pacman: {
    description: 'Paketmanager für Arch Linux.',
    examples: [
      'Ein Paket installieren',
      'System aktualisieren',
      'Pakete suchen',
      'Paket und Abhängigkeiten entfernen',
    ],
    tips: 'Verwende `yay` oder `paru` als AUR-Helfer für Community-Pakete.',
  },
  zypper: {
    description: 'Paketmanager für openSUSE/SLES.',
    examples: [
      'Ein Paket installieren',
      'Alle Pakete aktualisieren',
      'Pakete suchen',
      'Ein Repository hinzufügen',
    ],
  },
  dpkg: {
    description: 'Low-Level-Debian-Paketmanager für .deb-Dateien.',
    examples: [
      'Eine .deb-Datei installieren',
      'Installierte Pakete auflisten',
      'Paketinformationen anzeigen',
      'Dateien eines Pakets auflisten',
    ],
    tips: 'Verwende `apt` zur Abhängigkeitsauflösung. Verwende `dpkg` für direkte .deb-Installationen.',
  },
  rpm: {
    description: 'Low-Level-RPM-Paketmanager für .rpm-Dateien.',
    examples: [
      'Ein RPM installieren',
      'Installiertes Paket abfragen',
      'Dateien eines Pakets auflisten',
      'Paketintegrität überprüfen',
    ],
    tips: 'Verwende `dnf` oder `zypper` zur Abhängigkeitsauflösung.',
  },

  // ── Compression ──────────────────────────────────────────────
  tar: {
    description: 'Dateien archivieren und komprimieren.',
    examples: ['Gzip-Archiv erstellen', 'Gzip-Archiv entpacken', 'Inhalt auflisten'],
    tips: 'Merkhilfe: c=erstellen, x=entpacken, z=gzip, f=Datei, v=ausführlich.',
  },
  zip: {
    description: 'ZIP-Archive erstellen und entpacken.',
    examples: ['ZIP erstellen', 'ZIP entpacken', 'PowerShell komprimieren'],
  },
  gzip: {
    description: 'Dateien mit gzip komprimieren oder dekomprimieren.',
    examples: ['Eine Datei komprimieren', 'Dekomprimieren', 'Originaldatei beibehalten'],
  },
  bzip2: {
    description: 'Dateien mit dem bzip2-Algorithmus komprimieren oder dekomprimieren.',
    examples: [
      'Eine Datei komprimieren',
      'Eine Datei dekomprimieren',
      'Komprimieren und Original behalten',
      '.tar.bz2-Archiv entpacken',
    ],
    tips: 'bzip2 komprimiert besser als gzip, ist aber langsamer.',
  },
  xz: {
    description: 'Dateien mit dem xz/LZMA-Algorithmus komprimieren — bestes Kompressionsverhältnis.',
    examples: [
      'Eine Datei komprimieren',
      'Eine Datei dekomprimieren',
      'Originaldatei behalten',
      '.tar.xz-Archiv entpacken',
    ],
    tips: 'xz erreicht das beste Kompressionsverhältnis, ist aber am langsamsten.',
  },
  '7z': {
    description: 'Hochkomprimierender Archivierer mit Unterstützung für 7z, zip, tar, gzip und bzip2.',
    examples: [
      'Ein Archiv erstellen',
      'Ein Archiv entpacken',
      'Archivinhalt auflisten',
      'Mit Passwort entpacken',
    ],
    tips: 'Installation: `apt install p7zip-full` (Linux), `brew install sevenzip` (macOS).',
  },
  zstd: {
    description: 'Schnelle Echtzeit-Komprimierung mit ausgezeichnetem Verhältnis.',
    examples: ['Eine Datei komprimieren', 'Dekomprimieren', 'Maximale Komprimierung', 'Schnellmodus'],
  },
  unzip: {
    description: 'ZIP-Archive entpacken.',
    examples: [
      'In das aktuelle Verzeichnis entpacken',
      'In ein bestimmtes Verzeichnis entpacken',
      'Inhalt auflisten ohne zu entpacken',
    ],
  },
  unrar: {
    description: 'RAR-Archive entpacken.',
    examples: [
      'Mit vollständigem Pfad entpacken',
      'In ein Verzeichnis entpacken',
      'Inhalt auflisten',
      'Archivintegrität testen',
    ],
    tips: 'Installation über den Paketmanager. Verwende `7z` als Alternative für RAR-Unterstützung.',
  },
  lz4: {
    description: 'Extrem schneller verlustfreier Kompressionsalgorithmus.',
    examples: ['Eine Datei komprimieren', 'Dekomprimieren', 'Hoher Komprimierungsmodus'],
    tips: 'Optimiert für Geschwindigkeit statt Kompressionsrate. Ideal für temporäre Dateien und Cache.',
  },
  pigz: {
    description: 'Paralleles gzip — mehrfädiger gzip-Ersatz für schnellere Komprimierung.',
    examples: [
      'Mit allen Kernen komprimieren',
      'Dekomprimieren',
      'Thread-Anzahl angeben',
      'Zusammen mit tar verwenden',
    ],
    tips: 'Direkter Ersatz für gzip. Erzeugt gzip-kompatible Dateien.',
  },

  // ── Permissions & Users ──────────────────────────────────────
  chmod: {
    description: 'Dateiberechtigungen ändern.',
    examples: ['Ausführbar machen', 'Berechtigungen numerisch setzen', 'Rekursiv'],
    tips: '7=rwx, 6=rw-, 5=r-x, 4=r--, 0=---',
  },
  chown: {
    description: 'Dateibesitzer und Gruppe ändern.',
    examples: ['Besitzer ändern', 'Besitzer und Gruppe ändern', 'Rekursiv'],
  },
  sudo: {
    description: 'Einen Befehl als Superuser oder anderer Benutzer ausführen.',
    examples: ['Als Root ausführen', 'Als anderer Benutzer ausführen', 'Root-Shell öffnen'],
    tips: 'Verwende `sudo !!`, um den letzten Befehl mit sudo erneut auszuführen.',
  },
  useradd: {
    description: 'Ein neues Benutzerkonto erstellen.',
    examples: [
      'Benutzer erstellen',
      'Mit Benutzerverzeichnis und Shell erstellen',
      'Passwort setzen',
    ],
  },
  passwd: {
    description: 'Ein Benutzerpasswort ändern.',
    examples: [
      'Eigenes Passwort ändern',
      'Passwort eines anderen Benutzers ändern',
      'Konto sperren',
    ],
  },
  id: {
    description: 'Benutzer- und Gruppen-IDs anzeigen.',
    examples: [
      'Aktuelle Benutzerinformationen anzeigen',
      'Bestimmten Benutzer anzeigen',
      'Nur Gruppen anzeigen',
    ],
  },
  groups: {
    description: 'Anzeigen, zu welchen Gruppen ein Benutzer gehört.',
    examples: ['Gruppen des aktuellen Benutzers anzeigen', 'Gruppen eines Benutzers anzeigen'],
  },
  su: {
    description: 'Zu einem anderen Benutzerkonto wechseln.',
    examples: ['Zu Root wechseln', 'Zu Benutzer wechseln', 'Einzelnen Befehl ausführen'],
  },
  last: {
    description: 'Liste der zuletzt angemeldeten Benutzer anzeigen.',
    examples: ['Letzte Anmeldungen anzeigen', 'Neustarts anzeigen', 'Bestimmten Benutzer anzeigen'],
  },
  usermod: {
    description: 'Ein Benutzerkonto ändern — Gruppen, Home-Verzeichnis, Shell und mehr.',
    examples: [
      'Benutzer zu einer Gruppe hinzufügen',
      'Home-Verzeichnis ändern',
      'Login-Shell ändern',
      'Einen Benutzer umbenennen',
    ],
    tips: 'Verwende `-aG` (nicht nur `-G`) um zur Gruppe hinzuzufügen, ohne aus anderen entfernt zu werden.',
  },
  userdel: {
    description: 'Ein Benutzerkonto vom System löschen.',
    examples: ['Einen Benutzer löschen', 'Benutzer und Home-Verzeichnis löschen'],
    tips: 'Verwende `-r` um auch das Home-Verzeichnis und den Mail-Spool zu entfernen.',
  },
  groupadd: {
    description: 'Benutzergruppen erstellen oder löschen.',
    examples: [
      'Eine neue Gruppe erstellen',
      'Mit bestimmter GID erstellen',
      'Eine Gruppe löschen',
      'Alle Gruppen auflisten',
    ],
  },
  acl: {
    description: 'Access Control Lists für feingranulare Dateiberechtigungen abrufen oder setzen.',
    examples: [
      'ACL einer Datei anzeigen',
      'Benutzer Lesezugriff gewähren',
      'Gruppe Schreibzugriff gewähren',
      'Alle ACL-Einträge entfernen',
    ],
    tips: 'ACLs erweitern die traditionellen Unix-Berechtigungen. Das Dateisystem muss mit der Option `acl` gemountet sein.',
  },
  umask: {
    description: 'Standard-Berechtigungsmaske für neu erstellte Dateien und Verzeichnisse setzen.',
    examples: [
      'Aktuelle umask anzeigen',
      'In symbolischer Form anzeigen',
      'Restriktive umask setzen',
    ],
    tips: 'Standard-umask 022 ergibt Dateien mit 644 und Verzeichnisse mit 755. Setze 077 für private Dateien.',
  },
  chage: {
    description: 'Informationen zum Passwortablauf und -alter eines Benutzers ändern.',
    examples: [
      'Informationen zum Passwortalter anzeigen',
      'Passwortablauf auf 90 Tage setzen',
      'Passwortänderung bei nächster Anmeldung erzwingen',
    ],
  },
  visudo: {
    description: 'Die sudoers-Datei sicher mit Syntaxprüfung bearbeiten.',
    examples: [
      'sudoers-Datei bearbeiten',
      'Eine bestimmte Include-Datei bearbeiten',
      'Syntax prüfen ohne zu bearbeiten',
    ],
    tips: 'Bearbeite niemals /etc/sudoers direkt — `visudo` prüft die Syntax vor dem Speichern.',
  },

  // ── Disk & Storage ───────────────────────────────────────────
  lsblk: {
    description: 'Informationen über alle verfügbaren Blockgeräte auflisten.',
    examples: [
      'Alle Blockgeräte auflisten',
      'Dateisystem-Informationen anzeigen',
      'Größen in Bytes anzeigen',
    ],
  },
  mount: {
    description: 'Dateisysteme ein- oder aushängen.',
    examples: ['Einen USB-Stick einhängen', 'Aushängen', 'Alle Einhängepunkte auflisten'],
    tips: 'Verwende `umount -l` für ein verzögertes Aushängen, wenn das Gerät belegt ist.',
  },
  fdisk: {
    description: 'Festplattenpartitionstabelle bearbeiten.',
    examples: ['Partitionen auflisten', 'Partitionen auf einer Festplatte bearbeiten'],
    tips: 'Verwende `gdisk` für GPT-Partitionstabellen.',
  },
  mkfs: {
    description: 'Ein Dateisystem auf einer Partition erstellen.',
    examples: ['ext4-Dateisystem erstellen', 'FAT32 erstellen'],
  },
  blkid: {
    description: 'Blockgeräte-Attribute anzeigen (UUID, Dateisystemtyp).',
    examples: ['Alle Geräte anzeigen', 'Bestimmtes Gerät anzeigen'],
  },
  dd: {
    description: 'Low-Level-Kopieren und Konvertieren von Rohdaten — Disk-Images und Klonen.',
    examples: [
      'Bootfähigen USB-Stick aus ISO erstellen',
      'Eine Festplattenpartition klonen',
      'Leere Datei mit bestimmter Größe erstellen',
      'MBR sichern',
    ],
    tips: 'Prüfe `of=`-Ziel doppelt — ein falsches Ziel kann dein Betriebssystem überschreiben.',
  },
  parted: {
    description: 'Festplattenpartitionen erstellen, vergrößern und verwalten (GPT und MBR).',
    examples: ['Interaktiven Modus öffnen', 'Partitionen auflisten', 'Eine Partition erstellen'],
    tips: 'Bevorzuge `parted` gegenüber `fdisk` für GPT-Partitionstabellen und Festplatten größer als 2 TB.',
  },
  smartctl: {
    description: 'Festplattengesundheit mit S.M.A.R.T.-Diagnose überwachen.',
    examples: [
      'Festplattengesundheit prüfen',
      'Vollständige Festplatteninformationen',
      'Kurzen Selbsttest starten',
      'Testergebnisse anzeigen',
    ],
    tips: 'Installation mit `apt install smartmontools`.',
  },
  ncdu: {
    description: 'NCurses-basierter Speicherplatzanalysator mit interaktiver Navigation.',
    examples: [
      'Aktuelles Verzeichnis analysieren',
      'Einen bestimmten Pfad analysieren',
      'Ergebnisse als JSON exportieren',
    ],
    tips: 'Pfeiltasten zum Navigieren, `d` zum Löschen.',
  },
  fstab: {
    description: 'Referenz für die Dateisystem-Mount-Konfiguration in /etc/fstab.',
    examples: ['Typischer ext4-Eintrag', 'tmpfs nach /tmp einbinden', 'NFS-Mount'],
    tips: 'Verwende `sudo mount -a`, um fstab-Einträge ohne Neustart zu testen. Verwende immer UUID statt Gerätenamen.',
  },
  tune2fs: {
    description: 'Parameter von ext2/ext3/ext4-Dateisystemen anpassen.',
    examples: [
      'Dateisystem-Informationen anzeigen',
      'Label setzen',
      'Automatische Dateisystemprüfung deaktivieren',
    ],
    tips: 'Niemals auf einem eingehängten Dateisystem mit Schreibänderungen verwenden.',
  },
  'xfs-repair': {
    description: 'XFS-Dateisysteme prüfen und reparieren.',
    examples: ['Prüfen und reparieren', 'Trockenlauf (keine Änderungen)', 'Log-Nullung erzwingen (letzter Ausweg)'],
    tips: 'Das Dateisystem vor der Reparatur aushängen. Verwende zuerst `-n` für eine schreibgeschützte Prüfung.',
  },

  // ── System Monitoring ────────────────────────────────────────
  dmesg: {
    description: 'Kernel-Ringpuffer-Meldungen ausgeben.',
    examples: [
      'Kernel-Meldungen anzeigen',
      'Neue Meldungen verfolgen',
      'Menschenlesbare Zeitstempel',
    ],
    tips: 'Nützlich zur Diagnose von Hardware- und Treiberproblemen.',
  },
  journalctl: {
    description: 'Das systemd-Journal abfragen.',
    examples: [
      'Letzte Logeinträge anzeigen',
      'Logeinträge live verfolgen',
      'Logeinträge für einen Dienst',
      'Logeinträge seit heute',
    ],
  },
  vmstat: {
    description: 'Statistiken zum virtuellen Speicher melden.',
    examples: ['Statistiken anzeigen', 'Alle 2 Sekunden aktualisieren', '5 Stichproben pro Sekunde'],
  },
  iostat: {
    description: 'CPU- und I/O-Statistiken melden.',
    examples: ['CPU- und Festplattenstatistiken anzeigen', 'Erweiterte Festplattenstatistiken'],
  },
  lsof: {
    description: 'Offene Dateien und die zugehörigen Prozesse auflisten.',
    examples: [
      'Alle offenen Dateien auflisten',
      'Von einem Prozess geöffnete Dateien',
      'Wer verwendet einen Port',
      'Dateien in einem Verzeichnis',
    ],
    tips: 'Unverzichtbar, um herauszufinden, welcher Prozess einen Port oder eine Datei verwendet.',
  },
  watch: {
    description: 'Einen Befehl wiederholt ausführen und die Ausgabe anzeigen.',
    examples: [
      'Speichernutzung alle 2 Sek. beobachten',
      'Benutzerdefiniertes Intervall (5 Sek.)',
      'Unterschiede hervorheben',
    ],
  },
  nohup: {
    description: 'Einen Befehl ausführen, der gegen Auflegesignale immun ist.',
    examples: ['Im Hintergrund ausführen', 'Benutzerdefinierte Ausgabedatei'],
  },
  strace: {
    description: 'Systemaufrufe und Signale eines Prozesses verfolgen.',
    examples: [
      'Einen Befehl verfolgen',
      'An laufenden Prozess anhängen',
      'Nur Dateioperationen verfolgen',
    ],
  },
  sar: {
    description: 'Systemaktivitätsstatistiken sammeln und berichten (CPU, Speicher, I/O, Netzwerk).',
    examples: [
      'CPU-Auslastung alle 2s, 5 Mal',
      'Speicherstatistiken',
      'Netzwerkstatistiken',
      'Aus Tagesprotokoll lesen',
    ],
    tips: 'Teil des `sysstat`-Pakets.',
  },
  nethogs: {
    description: 'Netzwerkbandbreiten-Nutzung pro Prozess in Echtzeit überwachen.',
    examples: [
      'Alle Schnittstellen überwachen',
      'Bestimmte Schnittstelle überwachen',
      'Alle 5 Sekunden aktualisieren',
    ],
    tips: 'Drücke `q` zum Beenden, `m` zum Wechseln zwischen KB/MB.',
  },
  iftop: {
    description: 'Bandbreitennutzung einer Netzwerkschnittstelle in Echtzeit anzeigen.',
    examples: [
      'Standardschnittstelle überwachen',
      'Bestimmte Schnittstelle überwachen',
      'Ohne DNS-Auflösung',
    ],
    tips: 'Drücke `t` zum Umschalten des Anzeigemodus.',
  },
  mpstat: {
    description: 'CPU-Statistiken pro Prozessorkern berichten.',
    examples: ['Alle CPUs alle 2s anzeigen', '5 Berichte mit 1s-Intervall anzeigen'],
    tips: 'Teil des `sysstat`-Pakets. Nützlich, um CPU-Ungleichgewicht zwischen Kernen zu erkennen.',
  },
  perf: {
    description: 'Linux-Werkzeug zur Leistungsanalyse und Profilerstellung.',
    examples: [
      'Einen Befehl profilieren',
      'CPU-Samples aufzeichnen',
      'Aufgezeichnete Daten anzeigen',
      'Cache-Misses zählen',
    ],
    tips: 'Verwende `perf top` für Live-Systemprofiling.',
  },
  htop: {
    description: 'Interaktiver Prozess-Viewer mit Farben, Sortierung und Baumansicht.',
    examples: ['htop starten', 'Nur Prozesse des Benutzers anzeigen', 'Baumansichtsmodus'],
    tips: 'F5 für Baumansicht, F6 zum Sortieren, F9 zum Senden von Signalen.',
  },
  atop: {
    description: 'Erweiterter System- und Prozessmonitor mit Verlaufsprotokollierung.',
    examples: [
      'atop mit 5-Sekunden-Intervall starten',
      'Aus Protokolldatei lesen',
      'Festplattenstatistiken anzeigen',
    ],
    tips: 'Der atop-Daemon protokolliert Systemaktivitäten zur späteren Auswertung.',
  },
  glances: {
    description: 'Plattformübergreifendes Systemüberwachungstool, geschrieben in Python.',
    examples: ['Glances starten', 'Webserver-Modus', 'Client-Server-Modus'],
    tips: 'Installation mit `pip install glances`. Die Web-Oberfläche läuft standardmäßig auf Port 61208.',
  },
  pidstat: {
    description: 'Statistiken für Linux-Tasks melden (CPU, Speicher, I/O pro Prozess).',
    examples: [
      'CPU-Statistiken für alle Tasks',
      'I/O-Statistiken pro Prozess',
      'Speicherstatistiken für bestimmte PID',
    ],
    tips: 'Teil des `sysstat`-Pakets. Verwende `-t`, um Threads anzuzeigen.',
  },

  // ── File Inspection ──────────────────────────────────────────
  file: {
    description: 'Den Typ einer Datei bestimmen.',
    examples: ['Dateityp prüfen', 'Mehrere Dateien prüfen', 'MIME-Typ'],
  },
  stat: {
    description: 'Detaillierten Datei- oder Dateisystemstatus anzeigen.',
    examples: ['Dateidetails anzeigen', 'Nur Größe anzeigen', 'Berechtigungen anzeigen'],
  },
  md5sum: {
    description: 'Dateiprüfsummen berechnen und verifizieren.',
    examples: ['MD5-Prüfsumme', 'SHA256-Prüfsumme', 'Prüfsumme verifizieren'],
    tips: 'Verwende SHA256 oder höher für sicherheitskritische Überprüfungen.',
  },
  strings: {
    description: 'Druckbare Zeichenfolgen aus Binärdateien ausgeben.',
    examples: ['Zeichenketten aus Binärdatei extrahieren', 'Mindestlänge 10 Zeichen'],
  },
  hexdump: {
    description: 'Dateiinhalte in hexadezimaler Form anzeigen.',
    examples: ['Kanonische Hex- + ASCII-Darstellung', 'Mit xxd'],
  },
  ldd: {
    description: 'Abhängigkeiten von gemeinsam genutzten Bibliotheken eines Binärprogramms anzeigen.',
    examples: ['Abhängigkeiten auflisten', 'Ausführliche Ausgabe', 'Auf fehlende Bibliotheken prüfen'],
    tips: 'Führe `ldd` niemals bei nicht vertrauenswürdigen Binärdateien aus.',
  },
  nm: {
    description: 'Symbole aus Objektdateien oder Binärprogrammen auflisten.',
    examples: ['Alle Symbole auflisten', 'Nur undefinierte Symbole', 'C++-Symbole demanglen'],
    tips: 'Verwende `nm -C` für C++-Code, um lesbare Symbolnamen zu erhalten.',
  },
  objdump: {
    description: 'Informationen aus Objektdateien anzeigen und Binärprogramme disassemblieren.',
    examples: [
      'Ein Binärprogramm disassemblieren',
      'Alle Header anzeigen',
      'Dynamische Abhängigkeiten anzeigen',
    ],
    tips: 'Verwende `-M intel` für Intel-Syntax-Disassemblierung.',
  },
  readelf: {
    description: 'Detaillierte Informationen über ELF-Dateien anzeigen.',
    examples: ['ELF-Header anzeigen', 'Alle Sektionen anzeigen', 'Symboltabelle anzeigen'],
  },
  sha256sum: {
    description: 'SHA-256-Prüfsummen zur Dateiintegritätsprüfung berechnen und verifizieren.',
    examples: ['Prüfsumme erzeugen', 'Gegen Prüfsummendatei verifizieren', 'macOS-Äquivalent'],
    tips: 'Prüfsummen heruntergeladener ISOs und sicherheitskritischer Dateien immer verifizieren.',
  },
  xxd: {
    description: 'Hex-Dumps von Dateien erstellen oder Hex-Dumps umkehren.',
    examples: [
      'Hex-Dump einer Datei',
      'Reiner Hex-Ausgabe',
      'Hex zu Binär umkehren',
      'Auf die ersten 64 Bytes beschränken',
    ],
    tips: 'Wird mit `vim` installiert. Verwende `-p` für reines Hex.',
  },
  od: {
    description: 'Dateien in oktaler und anderen Formaten ausgeben.',
    examples: ['Oktaler Dump', 'Hex-Bytes', 'Zeichendarstellung'],
  },
  cmp: {
    description: 'Zwei Dateien Byte für Byte vergleichen.',
    examples: [
      'Zwei Dateien vergleichen',
      'Stiller Modus (nur Exit-Code)',
      'Alle abweichenden Bytes anzeigen',
    ],
    tips: 'Verwende `cmp` für Binärdateien. Verwende `diff` für Textdateien.',
  },

  // ── Shell Utilities ──────────────────────────────────────────
  alias: {
    description: 'Kurznamen für Befehle erstellen.',
    examples: ['Einen Alias erstellen', 'Alle Aliase auflisten', 'Einen Alias entfernen'],
    tips: 'Füge Aliase zu ~/.bashrc oder ~/.zshrc hinzu, um sie dauerhaft zu machen.',
  },
  history: {
    description: 'Die Befehlshistorie anzeigen oder verwalten.',
    examples: [
      'Gesamte Historie anzeigen',
      'Letzte 20 Befehle anzeigen',
      'Befehl Nr. 42 ausführen',
      'Historie durchsuchen',
    ],
    tips: 'Drücke Strg+R für eine Rückwärtssuche in der Historie.',
  },
  source: {
    description: 'Befehle aus einer Datei in der aktuellen Shell ausführen.',
    examples: [
      'Shell-Konfiguration neu laden',
      'Umgebungsvariablen laden',
      'Punkt-Syntax verwenden',
    ],
  },
  echo: {
    description: 'Eine Textzeile oder einen Variablenwert ausgeben.',
    examples: ['Text ausgeben', 'Variable ausgeben', 'Ohne abschließenden Zeilenumbruch'],
  },
  date: {
    description: 'Systemdatum und -uhrzeit anzeigen oder setzen.',
    examples: ['Aktuelles Datum anzeigen', 'ISO-Format', 'Unix-Zeitstempel'],
  },
  cal: {
    description: 'Einen Kalender anzeigen.',
    examples: ['Aktueller Monat', 'Ganzes Jahr', 'Bestimmter Monat'],
  },
  sleep: {
    description: 'Die Ausführung für eine bestimmte Zeit pausieren.',
    examples: ['5 Sekunden warten', '2 Minuten warten', 'In einem Skript verwenden'],
  },
  time: {
    description: 'Messen, wie lange ein Befehl zur Ausführung braucht.',
    examples: ['Einen Befehl messen', 'Einen Build messen'],
  },
  seq: {
    description: 'Eine Zahlenfolge ausgeben.',
    examples: ['1 bis 10 ausgeben', 'Mit Schrittweite', 'In einer for-Schleife verwenden'],
  },
  which: {
    description: 'Eine Befehlsbinärdatei im PATH finden.',
    examples: ['Pfad der Binärdatei finden', 'Alle Speicherorte finden', 'Befehlstyp anzeigen'],
  },
  man: {
    description: 'Die Handbuchseite eines Befehls anzeigen.',
    examples: ['Handbuchseite lesen', 'Handbuchseiten durchsuchen', 'Bestimmte Sektion'],
    tips: 'Verwende `tldr` (falls installiert) für vereinfachte Befehlsbeispiele.',
  },
  clear: {
    description: 'Den Terminalbildschirm leeren.',
    examples: ['Bildschirm leeren', 'Windows'],
    tips: 'Tastenkürzel: Strg+L leert den Bildschirm in den meisten Terminals.',
  },
  screen: {
    description: 'Terminal-Multiplexer — mehrere Shell-Sitzungen verwalten.',
    examples: ['Neue Sitzung starten', 'Benannte Sitzung', 'Sitzungen auflisten', 'Wieder verbinden'],
    tips: 'Trennen mit Strg+A, dann D.',
  },
  tmux: {
    description: 'Terminal-Multiplexer mit geteilten Fenstern und Sitzungen.',
    examples: [
      'Neue Sitzung starten',
      'Benannte Sitzung',
      'Sitzungen auflisten',
      'Mit Sitzung verbinden',
    ],
    tips: 'Standard-Präfix ist Strg+B. Horizontal teilen: Strg+B dann %, vertikal: Strg+B dann ".',
  },
  locate: {
    description: 'Dateien schnell mithilfe einer vorberechneten Datenbank finden.',
    examples: ['Datei nach Name finden', 'Groß-/Kleinschreibung ignorieren', 'Datenbank aktualisieren'],
    tips: 'Viel schneller als `find`, erfordert aber vorheriges Ausführen von `updatedb`.',
  },
  export: {
    description: 'Umgebungsvariablen setzen und an Kindprozesse exportieren.',
    examples: [
      'Eine Variable setzen und exportieren',
      'Zum PATH hinzufügen',
      'Alle exportierten Variablen auflisten',
    ],
    tips: 'Zu `~/.bashrc` oder `~/.zshrc` hinzufügen, damit sie sitzungsübergreifend erhalten bleiben.',
  },
  'read-builtin': {
    description: 'Eine Zeile von stdin in eine Variable einlesen.',
    examples: [
      'Benutzer zur Eingabe auffordern',
      'Lautlos lesen (Passwörter)',
      'Datei zeilenweise lesen',
      'Zeitlimit setzen',
    ],
    tips: 'Verwende `IFS= read -r line` um Leerzeichen und Backslashes beim Lesen beizubehalten.',
  },
  test: {
    description: 'Bedingte Ausdrücke auswerten, die in Shell-Skripten verwendet werden.',
    examples: [
      'Prüfen ob Datei existiert',
      'Prüfen ob Verzeichnis existiert',
      'Zeichenketten vergleichen',
      'Zahlen vergleichen',
    ],
    tips: 'Verwende `[[ ]]` in Bash für sicherere Vergleiche.',
  },
  bc: {
    description: 'Taschenrechner mit beliebiger Genauigkeit für Berechnungen in der Shell.',
    examples: [
      'Grundrechenarten',
      'Gleitkomma-Division',
      'Quadratwurzel',
      'Hexadezimal in Dezimal umwandeln',
    ],
    tips: 'Verwende `scale=N` um die Dezimalstellen festzulegen.',
  },
  'xdg-open': {
    description: 'Eine Datei oder URL mit der Standardanwendung öffnen.',
    examples: [
      'Eine Datei mit Standard-App öffnen',
      'URL im Browser öffnen (Linux)',
      'Aktuelles Verzeichnis im Finder öffnen (macOS)',
      'Mit bestimmter App öffnen (macOS)',
    ],
    tips: 'Unter macOS zeigt `open -R file` die Datei im Finder an.',
  },
  type: {
    description: 'Bestimmen, wie ein Befehlsname interpretiert wird (Builtin, Alias, Datei).',
    examples: ['Befehlstyp prüfen', 'Alle Speicherorte anzeigen', 'Nur das Typwort ausgeben'],
    tips: 'In Skripten gegenüber `which` bevorzugt, da Builtins und Aliase erkannt werden.',
  },
  'set-shopt': {
    description: 'Shell-Optionen und Verhaltenseinstellungen konfigurieren.',
    examples: [
      'Abbruch bei Fehler aktivieren',
      'Globstar (rekursive Globs) aktivieren',
      'Pipefail aktivieren',
      'Alle shopt-Optionen auflisten',
    ],
    tips: '`set -euo pipefail` ist ein gängiger Strikt-Modus für Skripte.',
  },
  trap: {
    description: 'Befehle ausführen, wenn die Shell Signale empfängt oder beendet wird.',
    examples: ['Aufräumen beim Beenden', 'SIGINT ignorieren', 'Mehrere Signale behandeln'],
    tips: 'Verwende `trap - SIGNAL`, um ein Signal auf sein Standardverhalten zurückzusetzen.',
  },
  eval: {
    description: 'Argumente als Shell-Befehl ausführen, nützlich für dynamischen Befehlsaufbau.',
    examples: ['Eine Variable als Befehl ausführen', 'Dynamischen Variablennamen setzen'],
    tips: 'Mit Vorsicht verwenden — `eval` kann Sicherheitsrisiken bergen.',
  },
  tput: {
    description: 'Terminal-Fähigkeiten abfragen und setzen (Farben, Cursorbewegung).',
    examples: [
      'Anzahl der Spalten abfragen',
      'Fettschrift setzen',
      'Vordergrundfarbe setzen (Rot)',
      'Cursor auf Zeile 5, Spalte 10 bewegen',
    ],
    tips: 'Verwende `tput sgr0`, um alle Attribute zurückzusetzen.',
  },
  yes: {
    description: 'Eine Zeichenkette wiederholt ausgeben — nützlich für Bestätigungsaufforderungen.',
    examples: [
      'Bestätigungen automatisch beantworten',
      'Benutzerdefinierte Zeichenkette wiederholen',
      'N Zeilen erzeugen',
    ],
  },

  // ── Version Control ──────────────────────────────────────────
  git: {
    description: 'Verteiltes Versionskontrollsystem.',
    examples: [
      'Ein Repository klonen',
      'Änderungen vormerken und committen',
      'Branch erstellen und wechseln',
      'Zum Remote pushen',
    ],
    tips: 'Verwende `git log --oneline --graph` für eine grafische Commit-Historie.',
  },
  'git-stash': {
    description: 'Nicht committete Änderungen vorübergehend speichern.',
    examples: ['Änderungen stashen', 'Stashes auflisten', 'Stash anwenden und entfernen'],
  },
  'git-log': {
    description: 'Commit-Verlauf und Unterschiede anzeigen.',
    examples: [
      'Kompaktes Log',
      'Diff des letzten Commits anzeigen',
      'Log mit Graphdarstellung',
      'Status anzeigen',
    ],
  },
  'git-branch': {
    description: 'Branches auflisten, erstellen, umbenennen oder löschen.',
    examples: [
      'Lokale Branches auflisten',
      'Alle Branches einschließlich Remote auflisten',
      'Einen neuen Branch erstellen',
      'Einen Branch löschen',
    ],
    tips: 'Verwende `git switch -c branch-name` um in einem Schritt zu erstellen und zu wechseln.',
  },
  'git-rebase': {
    description: 'Commits auf einen anderen Branch oder Commit erneut anwenden.',
    examples: [
      'Auf main rebasen',
      'Interaktiver Rebase (letzte 3 Commits)',
      'Nach Konfliktlösung fortfahren',
      'Rebase abbrechen',
    ],
    tips: 'Rebase niemals öffentliche/geteilte Branches.',
  },
  'git-remote': {
    description: 'Remote-Repository-Verbindungen verwalten.',
    examples: [
      'Remotes auflisten',
      'Einen Remote hinzufügen',
      'Remote-URL ändern',
      'Einen Remote entfernen',
    ],
  },
  'git-bisect': {
    description: 'Binäre Suche durch die Commit-Historie, um den Commit zu finden, der einen Fehler eingeführt hat.',
    examples: [
      'Bisect starten',
      'Aktuellen als fehlerhaft markieren',
      'Bekannten guten Commit markieren',
      'Mit Testskript automatisieren',
    ],
    tips: 'Mit `git bisect reset` beenden.',
  },
  'git-config': {
    description: 'Repository- oder globale Git-Konfiguration abrufen und setzen.',
    examples: [
      'Globalen Benutzernamen setzen',
      'Globale E-Mail setzen',
      'Standard-Editor setzen',
      'Alle Konfigurationen auflisten',
    ],
    tips: 'Verwende `--local` für repo-spezifische Einstellungen, `--global` für benutzerweit.',
  },
  'git-merge': {
    description: 'Branches durch Zusammenführen der Commit-Historien kombinieren.',
    examples: [
      'Feature in den aktuellen Branch mergen',
      'Merge ohne Fast-Forward',
      'Einen konfliktbehafteten Merge abbrechen',
    ],
    tips: 'Verwende `--no-ff`, um immer einen Merge-Commit für klarere Historie zu erstellen.',
  },
  'git-cherry-pick': {
    description: 'Bestimmte Commits von einem Branch auf einen anderen anwenden.',
    examples: ['Einen Commit cherry-picken', 'Cherry-Pick ohne zu committen', 'Einen Bereich cherry-picken'],
  },
  'git-tag': {
    description: 'Release-Tags erstellen, auflisten und verwalten.',
    examples: [
      'Annotierten Tag erstellen',
      'Tags auflisten',
      'Tags zum Remote pushen',
      'Einen Tag löschen',
    ],
    tips: 'Verwende annotierte Tags (`-a`) für Releases.',
  },
  'git-diff': {
    description: 'Änderungen zwischen Commits, Branches oder dem Arbeitsverzeichnis anzeigen.',
    examples: [
      'Nicht bereitgestellte Änderungen',
      'Bereitgestellte Änderungen',
      'Zwischen Branches',
      'Statistik-Zusammenfassung',
    ],
  },
  'git-reset': {
    description: 'Änderungen aus dem Staging entfernen oder HEAD auf einen anderen Commit verschieben.',
    examples: [
      'Eine Datei aus dem Staging entfernen',
      'Soft-Reset (Änderungen bleiben bereitgestellt)',
      'Mixed-Reset (Änderungen bleiben nicht bereitgestellt)',
      'Hard-Reset (Änderungen verwerfen)',
    ],
    tips: 'Verwende `--soft`, um einen Commit rückgängig zu machen. `--hard` ist destruktiv!',
  },
  'git-submodule': {
    description: 'Verschachtelte Repositories innerhalb eines übergeordneten Projekts verwalten.',
    examples: ['Ein Submodul hinzufügen', 'Nach dem Klonen initialisieren', 'Alle Submodule aktualisieren'],
    tips: 'Mit `--recurse-submodules` klonen. `git subtree` als Alternative in Betracht ziehen.',
  },
  'git-worktree': {
    description: 'Gleichzeitig an mehreren Branches mit verknüpften Arbeitsverzeichnissen arbeiten.',
    examples: ['Einen Worktree erstellen', 'Worktrees auflisten', 'Einen Worktree entfernen'],
    tips: 'Ideal für Code-Reviews oder Hotfixes, ohne aktuelle Arbeit stashen zu müssen.',
  },
  'git-blame': {
    description: 'Anzeigen, wer jede Zeile einer Datei zuletzt geändert hat und wann.',
    examples: ['Blame für eine Datei', 'Blame für bestimmte Zeilen', 'Leerzeichen-Änderungen ignorieren'],
    tips: 'Verwende `git log -p -- file` für die vollständige Änderungshistorie einer Datei.',
  },

  // ── Containers ───────────────────────────────────────────────
  docker: {
    description: 'Container erstellen, ausführen und verwalten.',
    examples: [
      'Einen Container starten',
      'Laufende Container auflisten',
      'Ein Image erstellen',
      'Einen Container stoppen',
    ],
  },
  'docker-compose': {
    description: 'Multi-Container-Anwendungen definieren und ausführen.',
    examples: ['Dienste starten', 'Dienste stoppen', 'Logs anzeigen', 'Neu erstellen'],
  },
  'docker-image': {
    description: 'Docker-Images, Volumes und Netzwerke verwalten.',
    examples: [
      'Images auflisten',
      'Ungenutzte Images entfernen',
      'Volumes auflisten',
      'Einen Container inspizieren',
    ],
  },
  'docker-exec': {
    description: 'Einen Befehl in einem laufenden Container ausführen.',
    examples: ['Interaktive Shell öffnen', 'Einzelnen Befehl ausführen', 'Shell als Root öffnen'],
    tips: 'Falls Bash fehlschlägt, versuche `sh`. Verwende `-it` für interaktive Sitzungen.',
  },
  'docker-logs': {
    description: 'Logs eines laufenden oder gestoppten Containers abrufen und verfolgen.',
    examples: [
      'Container-Logs anzeigen',
      'Live-Logs verfolgen',
      'Letzte 50 Zeilen anzeigen',
      'Mit Zeitstempeln anzeigen',
    ],
  },
  'docker-network': {
    description: 'Docker-Netzwerke für die Containerkommunikation erstellen und verwalten.',
    examples: [
      'Netzwerke auflisten',
      'Ein Bridge-Netzwerk erstellen',
      'Container mit Netzwerk verbinden',
      'Ein Netzwerk inspizieren',
    ],
  },
  kubectl: {
    description: 'Kubernetes-Kommandozeilenwerkzeug zur Verwaltung von Cluster-Ressourcen.',
    examples: [
      'Alle Pods auflisten',
      'Ein Manifest anwenden',
      'Pod-Logs streamen',
      'Shell in Pod öffnen',
    ],
    tips: 'Verwende `kubectl config get-contexts` um Cluster anzuzeigen und zu wechseln.',
  },
  podman: {
    description: 'Daemonlose Container-Engine — Drop-in-Ersatz für Docker.',
    examples: [
      'Einen Container ausführen',
      'Container auflisten',
      'Ein Image erstellen',
      'Systemd-Unit generieren',
    ],
    tips: 'Podman läuft standardmäßig ohne Root, was es sicherer als Docker macht.',
  },
  'docker-volume': {
    description: 'Persistente Datenvolumes für Container erstellen und verwalten.',
    examples: [
      'Ein Volume erstellen',
      'Volumes auflisten',
      'Ein Volume inspizieren',
      'In einem Container verwenden',
    ],
  },
  'docker-build': {
    description: 'Docker-Images aus einem Dockerfile erstellen.',
    examples: [
      'Aus dem aktuellen Verzeichnis erstellen',
      'Mit Build-Argument erstellen',
      'Ohne Cache erstellen',
      'Bestimmtes Dockerfile verwenden',
    ],
    tips: 'Verwende `.dockerignore`, um Dateien auszuschließen. Multi-Stage-Builds reduzieren die Image-Größe.',
  },
  'docker-tag': {
    description: 'Images für das Pushen in Registries taggen.',
    examples: ['Für Docker Hub taggen', 'Für private Registry taggen'],
  },
  'docker-push': {
    description: 'Images auf Docker Hub oder private Registries pushen.',
    examples: ['Auf Docker Hub pushen', 'Alle Tags pushen'],
    tips: 'Führe zuerst `docker login` aus.',
  },
  'docker-prune': {
    description: 'Unbenutzte Container, Images, Netzwerke und Volumes entfernen.',
    examples: [
      'Verwaiste Ressourcen entfernen',
      'Alles Unbenutzte entfernen',
      'Volumes einschließen',
      'Speicherplatznutzung anzeigen',
    ],
    tips: 'Verwende `-a`, um auch unbenutzte Images zu entfernen. `--volumes` mit Vorsicht verwenden.',
  },
  'docker-inspect': {
    description: 'Detaillierte JSON-Informationen über Container, Images oder Netzwerke zurückgeben.',
    examples: ['Einen Container inspizieren', 'IP-Adresse abfragen', 'Ein Image inspizieren'],
    tips: 'Verwende die Go-Template-Syntax mit `-f`, um bestimmte Felder zu extrahieren.',
  },
  helm: {
    description: 'Kubernetes-Paketmanager zum Bereitstellen und Verwalten von Charts.',
    examples: [
      'Ein Chart installieren',
      'Releases auflisten',
      'Ein Release aktualisieren',
      'Ein Repository hinzufügen',
    ],
    tips: 'Verwende `helm template`, um Manifeste vor der Installation zu prüfen.',
  },

  // ── Scripting ────────────────────────────────────────────────
  'bash-shebang': {
    description: 'Die Shebang-Zeile teilt dem Betriebssystem mit, welchen Interpreter es verwenden soll.',
    examples: [
      'Bash-Shebang',
      'Portabler Shebang',
      'Skript ausführbar machen',
      'Das Skript ausführen',
    ],
    tips: 'Verwende `#!/usr/bin/env bash` für Portabilität.',
  },
  'bash-variables': {
    description: 'Variablen in Shell-Skripten definieren und verwenden.',
    examples: [
      'Eine Variable zuweisen',
      'Eine Variable verwenden',
      'Befehlssubstitution',
      'Standardwert wenn nicht gesetzt',
    ],
    tips: 'Keine Leerzeichen um `=` bei Zuweisungen. Variablen immer in Anführungszeichen setzen: `"$VAR"`.',
  },
  'bash-if': {
    description: 'Bedingte Verzweigung in Shell-Skripten.',
    examples: ['Einfaches if', 'If-else', 'Zeichenkettenvergleich'],
    tips: 'Verwende `[[ ]]` (doppelte Klammern) in Bash für sicherere Vergleiche.',
  },
  'bash-for': {
    description: 'Über eine Liste von Elementen in einem Shell-Skript iterieren.',
    examples: [
      'Über Werte iterieren',
      'Über Dateien iterieren',
      'C-ähnliche Schleife',
      'Über Array iterieren',
    ],
    tips: 'Verwende `break` zum vorzeitigen Abbrechen, `continue` zum Überspringen.',
  },
  'bash-while': {
    description: 'Einen Befehlsblock wiederholt ausführen, solange eine Bedingung wahr ist.',
    examples: ['Hochzählen', 'Datei zeilenweise lesen', 'Endlosschleife'],
    tips: 'Stelle immer sicher, dass die Bedingung irgendwann falsch wird.',
  },
  'bash-functions': {
    description: 'Wiederverwendbare Codeblöcke in Shell-Skripten definieren.',
    examples: ['Eine Funktion definieren', 'Die Funktion aufrufen', 'Rückgabewert erfassen'],
    tips: 'Argumente sind `$1`, `$2` usw. Verwende `local` für lokale Variablen.',
  },
  'bash-arrays': {
    description: 'Listen von Werten in Shell-Skripten speichern und bearbeiten.',
    examples: ['Ein Array deklarieren', 'Element per Index zugreifen', 'Alle Elemente', 'Array-Länge'],
    tips: 'Array-Erweiterungen immer in Anführungszeichen setzen: `"${arr[@]}"`.',
  },
  'bash-case': {
    description: 'Mehrfach-Verzweigung mit Mustervergleich.',
    examples: ['Einfaches case', 'Mehrere Muster abgleichen'],
    tips: 'Das Muster `*)` ist der Auffangfall. Jeder Fall endet mit `;;`.',
  },
  'bash-redirect': {
    description: 'Eingabe-, Ausgabe- und Fehlerströme in der Shell umleiten.',
    examples: [
      'Stdout in Datei schreiben (überschreiben)',
      'Stdout an Datei anhängen',
      'Stderr nach Stdout umleiten',
      'Alle Ausgaben verwerfen',
    ],
    tips: '`2>&1` muss NACH der Ausgabeumleitung stehen. Verwende `&>` als Kurzform in Bash.',
  },
  'bash-pipe': {
    description: 'Befehle mit Pipes verbinden und Subshells zur Gruppierung verwenden.',
    examples: [
      'Ausgabe an nächsten Befehl weiterleiten',
      'Subshell in Variable',
      'Prozesssubstitution',
      'Mehrere Befehle in Subshell ausführen',
    ],
    tips: 'Jeder Befehl in einer Pipeline läuft in einer Subshell.',
  },
  'bash-trap': {
    description: 'Signale und Aufräumaktionen in Skripten mit dem trap-Builtin behandeln.',
    examples: [
      'Temporäre Dateien beim Beenden aufräumen',
      'Strg+C elegant behandeln',
      'Bei Fehler protokollieren',
    ],
    tips: 'Häufige Signale: EXIT (0), INT (2), TERM (15), ERR (bei Fehler).',
  },
  'bash-getopts': {
    description: 'Kommandozeilenoptionen und Flags in Shell-Skripten parsen.',
    examples: ['-v und -f Flags parsen', 'Optionen überspringen (shift)'],
    tips: 'Ein Doppelpunkt nach einem Buchstaben bedeutet, dass ein Argument erwartet wird (z. B. `f:`).',
  },
  'bash-subshell': {
    description: 'Befehle in Subshells und Befehlssubstitution mit $() ausführen.',
    examples: ['Subshell (isolierte Umgebung)', 'Befehlssubstitution', 'Prozesssubstitution'],
    tips: 'Subshells erben die Elternumgebung, können sie aber nicht verändern.',
  },
  'bash-regex': {
    description: 'Musterabgleich mit [[ =~ ]] und regulären Ausdrücken in Bash.',
    examples: ['E-Mail-Muster abgleichen', 'Erfassungsgruppe extrahieren'],
    tips: 'Das Regex-Muster nicht in Anführungszeichen setzen. Verwende `BASH_REMATCH` für Erfassungsgruppen.',
  },
  'bash-debug': {
    description: 'Skripte debuggen mit set -x, set -e, set -o pipefail und PS4.',
    examples: ['Strikt-Modus-Header', 'Trace mit Zeilennummern', 'Nur einen Abschnitt debuggen'],
    tips: 'Führe `bash -x script.sh` aus, um ein ganzes Skript ohne Änderungen zu tracen.',
  },

  // ── Developer Tools ──────────────────────────────────────────
  make: {
    description: 'Build-Automatisierungstool, das ein Makefile liest.',
    examples: [
      'Standardziel kompilieren',
      'Bestimmtes Ziel kompilieren',
      '4 Jobs parallel ausführen',
      'Testlauf',
    ],
    tips: 'Verwende `make -n` für eine Vorschau ohne Ausführung.',
  },
  gcc: {
    description: 'GNU C/C++-Compiler — C- und C++-Programme kompilieren und linken.',
    examples: [
      'Ein C-Programm kompilieren',
      'Mit Debugging kompilieren',
      'C++-Programm kompilieren',
      'Mit Optimierungen kompilieren',
    ],
    tips: 'Verwende `-Wall -Wextra` um alle Warnungen zu aktivieren.',
  },
  node: {
    description: 'JavaScript außerhalb des Browsers mit Node.js ausführen.',
    examples: [
      'Ein Skript ausführen',
      'Interaktiver REPL',
      'Inline-Code ausführen',
      'Node-Version prüfen',
    ],
    tips: 'Verwende `nvm` (Node Version Manager) um mehrere Node.js-Versionen zu verwalten.',
  },
  python3: {
    description: 'Python-Skripte ausführen oder einen interaktiven Python-Interpreter starten.',
    examples: [
      'Ein Skript ausführen',
      'Interaktiver REPL',
      'Inline-Code ausführen',
      'Einfachen HTTP-Server starten',
    ],
    tips: 'Verwende virtuelle Umgebungen: `python3 -m venv venv && source venv/bin/activate`.',
  },
  gdb: {
    description: 'GNU Debugger zum Debuggen von C/C++ und anderen kompilierten Programmen.',
    examples: [
      'Debugging eines Programms starten',
      'Einen Haltepunkt setzen',
      'Das Programm ausführen',
      'Eine Variable inspizieren',
    ],
    tips: 'Mit `-g` kompilieren, um Debug-Symbole einzubinden.',
  },
  valgrind: {
    description: 'Speicherfehlererkennung und Profiler für C/C++-Programme.',
    examples: [
      'Auf Speicherlecks prüfen',
      'Vollständige Leckprüfung mit Details',
      'Mit Callgrind profilieren',
    ],
    tips: 'Mit `-g -O0` kompilieren für beste Ergebnisse.',
  },
  ab: {
    description: 'HTTP-Lasttesttool — Webserver-Leistung messen.',
    examples: ['100 Anfragen, 10 gleichzeitig', 'POST-Anfrage Benchmark'],
    tips: 'Abschließendes `/` in der URL angeben.',
  },
  hey: {
    description: 'Moderner HTTP-Lastgenerator — bessere Alternative zu Apache Bench.',
    examples: ['Einfacher Lasttest', '200 Anfragen, 20 gleichzeitig', 'POST mit JSON-Body'],
  },
  'git-hooks': {
    description: 'Shell-Skripte, die automatisch bei Git-Ereignissen ausgeführt werden.',
    examples: [
      'Verfügbare Hooks auflisten',
      'Pre-Commit-Hook erstellen',
      'Pre-Commit: Linter ausführen',
      'Hook einmalig überspringen',
    ],
    tips: 'Verwende Tools wie `husky` um Hooks über package.json im Team zu teilen.',
  },
  ltrace: {
    description: 'Bibliotheksaufrufe eines Programms verfolgen.',
    examples: ['Bibliotheksaufrufe verfolgen', 'Bestimmte Bibliothek verfolgen', 'Aufrufe zählen'],
    tips: 'Ähnlich wie `strace`, aber für Bibliotheksaufrufe statt Systemaufrufe.',
  },
  entr: {
    description: 'Befehle bei Dateiänderungen ausführen — Dateiüberwachung für Entwicklungsabläufe.',
    examples: [
      'Bei Änderung neu kompilieren',
      'Server bei Änderung neu starten',
      'Tests bei Änderung ausführen',
    ],
    tips: 'Verwende `-r`, um langlaufende Prozesse neu zu starten.',
  },
  hyperfine: {
    description: 'Benchmarking-Tool: Ausführungszeiten von Befehlen messen und vergleichen.',
    examples: ['Einen Befehl benchmarken', 'Zwei Befehle vergleichen', 'Aufwärm-Durchläufe'],
    tips: 'Installation mit `cargo install hyperfine` oder dem Paketmanager.',
  },
  tokei: {
    description: 'Codezeilen nach Programmiersprache in einem Projekt zählen.',
    examples: ['Zeilen im aktuellen Verzeichnis zählen', 'Nach Codezeilen sortieren', 'Bestimmtes Verzeichnis'],
    tips: 'Installation mit `cargo install tokei`. Deutlich schneller als `cloc`.',
  },
  shellcheck: {
    description: 'Statisches Analysewerkzeug für Shell-Skripte — Fehler und schlechte Praktiken finden.',
    examples: ['Ein Skript prüfen', 'Shell-Dialekt angeben', 'Ausgabe im JSON-Format'],
    tips: 'Lässt sich in die meisten Editoren integrieren.',
  },
  jenv: {
    description: 'Mehrere Java-Versionen auf dem System verwalten.',
    examples: [
      'Verwaltete Versionen auflisten',
      'Globale Java-Version setzen',
      'Lokale Version für Projekt setzen',
      'Ein JDK hinzufügen',
    ],
    tips: 'Installation mit `brew install jenv` oder aus Git.',
  },
  nvm: {
    description: 'Node.js-Versionsmanager — Node-Versionen installieren und wechseln.',
    examples: [
      'Neuestes LTS installieren',
      'Zu einer Version wechseln',
      'Installierte Versionen auflisten',
      'Standardversion setzen',
    ],
    tips: 'Füge `nvm use` zu `.nvmrc` für projektspezifische Node-Versionen hinzu.',
  },

  // ── Security ─────────────────────────────────────────────────
  gpg: {
    description: 'GNU Privacy Guard — Dateien mit Public-Key-Kryptographie verschlüsseln, entschlüsseln und signieren.',
    examples: [
      'Ein Schlüsselpaar generieren',
      'Eine Datei verschlüsseln',
      'Eine Datei entschlüsseln',
      'Eine Datei signieren',
    ],
  },
  'ssh-keygen': {
    description: 'SSH-Authentifizierungsschlüssel generieren, verwalten und konvertieren.',
    examples: [
      'Ed25519-Schlüssel generieren (empfohlen)',
      'RSA-Schlüssel generieren (4096 Bit)',
      'Schlüssel-Fingerabdruck anzeigen',
      'Passphrase ändern',
    ],
    tips: 'Ed25519 ist schneller und sicherer als RSA.',
  },
  'ssh-copy-id': {
    description: 'Öffentlichen SSH-Schlüssel auf einem Remote-Server für passwortlose Anmeldung installieren.',
    examples: [
      'Standardschlüssel auf Server kopieren',
      'Bestimmten Schlüssel kopieren',
      'Kopieren mit nicht-standardmäßigem Port',
    ],
  },
  'openssl-cert': {
    description: 'Kryptographisches Toolkit für TLS/SSL, Zertifikate, Hashing und Verschlüsselung.',
    examples: [
      'Selbstsigniertes Zertifikat generieren',
      'Zertifikatsdetails anzeigen',
      'TLS einer Website prüfen',
      'Datei mit SHA256 hashen',
    ],
  },
  ufw: {
    description: 'Uncomplicated Firewall — einfaches Frontend zur Verwaltung von iptables-Regeln.',
    examples: [
      'Firewall aktivieren',
      'SSH erlauben',
      'Bestimmten Port erlauben',
      'Aktuelle Regeln anzeigen',
    ],
    tips: 'Erlaube immer SSH, bevor du ufw aktivierst, um dich nicht auszusperren.',
  },
  fail2ban: {
    description: 'Schutz vor Brute-Force-Angriffen durch Sperren von IPs nach wiederholten Fehlversuchen.',
    examples: ['Dienststatus prüfen', 'SSH-Jail prüfen', 'Eine IP entsperren'],
    tips: 'Kopiere `jail.conf` nach `jail.local` zur Anpassung.',
  },
  chattr: {
    description: 'Erweiterte Dateiattribute auf Linux-Dateisystemen setzen und anzeigen.',
    examples: [
      'Eine Datei unveränderlich machen',
      'Unveränderlich-Flag entfernen',
      'Nur-Anhängen-Datei (für Logs)',
      'Dateiattribute anzeigen',
    ],
    tips: 'Das Attribut `+i` verhindert, dass selbst Root die Datei löschen oder ändern kann.',
  },
  auditctl: {
    description: 'Linux Audit-System — Audit-Regeln konfigurieren und Audit-Logs durchsuchen.',
    examples: [
      'Dateizugriff überwachen',
      'Audit-Regeln auflisten',
      'Audit-Log nach Schlüssel durchsuchen',
      'Alle Audit-Regeln löschen',
    ],
    tips: 'Regeln gehen beim Neustart verloren. Zu `/etc/audit/rules.d/` hinzufügen für Persistenz.',
  },
  'openssl-enc': {
    description: 'Symmetrische Verschlüsselung und Entschlüsselung von Dateien mit OpenSSL-Chiffren.',
    examples: [
      'Eine Datei verschlüsseln (AES-256)',
      'Eine Datei entschlüsseln',
      'Verfügbare Chiffren auflisten',
    ],
    tips: 'Verwende immer `-pbkdf2` und `-salt` für passwortbasierte Verschlüsselung.',
  },
  age: {
    description: 'Einfaches, modernes Dateiverschlüsselungstool — Alternative zu GPG.',
    examples: [
      'Mit Passphrase verschlüsseln',
      'Mit öffentlichem Schlüssel verschlüsseln',
      'Entschlüsseln',
      'Ein Schlüsselpaar erzeugen',
    ],
    tips: 'Einfacher als GPG ohne Konfigurationsdateien. Unterstützt auch SSH-Schlüssel.',
  },
  certbot: {
    description: "TLS-Zertifikate von Let's Encrypt automatisch beziehen und erneuern.",
    examples: [
      'Zertifikat für nginx erhalten',
      'Zertifikat für Apache erhalten',
      'Alle Zertifikate erneuern',
      'Probelauf der Erneuerung',
    ],
    tips: 'Einen Cronjob oder systemd-Timer für automatische Erneuerung einrichten.',
  },
  'ssh-agent': {
    description: 'Privaten SSH-Schlüssel im Speicher halten, um wiederholte Passphrase-Eingaben zu vermeiden.',
    examples: [
      'Agent starten und Standardschlüssel hinzufügen',
      'Bestimmten Schlüssel hinzufügen',
      'Geladene Schlüssel auflisten',
      'Alle Schlüssel entfernen',
    ],
    tips: 'Der macOS-Schlüsselbund kann Passphrasen speichern: `ssh-add --apple-use-keychain`.',
  },
  'sshd-config': {
    description: 'Referenz für die OpenSSH-Server-Konfiguration und -Härtung.',
    examples: [
      'Root-Anmeldung deaktivieren',
      'Passwort-Authentifizierung deaktivieren',
      'Auf bestimmte Benutzer beschränken',
    ],
    tips: 'Immer mit `sshd -t` testen, bevor der Dienst neu gestartet wird.',
  },
  firewalld: {
    description: 'firewalld-Frontend zur Verwaltung von Zonen und Firewallregeln (RHEL/Fedora).',
    examples: [
      'Alle Regeln auflisten',
      'HTTP dauerhaft erlauben',
      'Einen Port öffnen',
      'Regeln neu laden',
    ],
    tips: 'Verwende `--permanent`, um Regeln über Neustarts hinweg beizubehalten, dann `--reload`.',
  },
  selinux: {
    description: 'SELinux-Sicherheitskontexte und -Richtlinien prüfen und verwalten.',
    examples: [
      'SELinux-Status prüfen',
      'Auf permissiven Modus setzen',
      'Dateikontexte anzeigen',
      'Standardkontext wiederherstellen',
    ],
    tips: 'Zum Troubleshooting den permissiven Modus bevorzugen statt SELinux zu deaktivieren.',
  },

  // ── Editors ──────────────────────────────────────────────────
  vim: {
    description: 'Leistungsstarker modaler Texteditor mit umfangreichen Tastenkürzeln.',
    examples: ['Eine Datei öffnen', 'Speichern und beenden', 'Beenden ohne zu speichern', 'Suchen und ersetzen'],
    tips: 'Drücke `Esc` um in den Befehlsmodus zu gelangen, `i` für den Einfügemodus.',
  },
  nano: {
    description: 'Einfacher, benutzerfreundlicher Terminal-Texteditor — ideal für Einsteiger.',
    examples: ['Eine Datei öffnen oder erstellen', 'Datei speichern', 'Editor verlassen', 'Text suchen'],
    tips: 'Tastenkürzel werden am unteren Bildschirmrand angezeigt. `^` bedeutet Strg.',
  },
  emacs: {
    description: 'Erweiterbarer, anpassbarer Texteditor und Computerumgebung.',
    examples: ['Eine Datei öffnen', 'Datei speichern', 'Emacs beenden', 'Befehlspalette öffnen'],
    tips: 'Verwende `emacs -nw` für den reinen Terminalmodus.',
  },
  ed: {
    description: 'Der originale Unix-Zeileneditor — minimalistisch und überall verfügbar.',
    examples: ['Eine Datei öffnen', 'Alle Zeilen ausgeben', 'Text anhängen', 'Speichern und beenden'],
    tips: 'Verwende `ed` wenn nichts anderes verfügbar ist — garantiert auf jedem POSIX-System vorhanden.',
  },
  micro: {
    description: 'Moderner Terminal-Texteditor mit vertrauten Tastenkombinationen (Strg+S, Strg+C, Strg+Z).',
    examples: ['Eine Datei öffnen', 'Speichern', 'Rückgängig machen', 'Suchen und ersetzen'],
    tips: 'Installation: `brew install micro` oder `snap install micro`.',
  },
  'sed-edit': {
    description: 'Dateien direkt bearbeiten mit Stream-Editor-Ausdrücken, ohne einen Editor zu öffnen.',
    examples: [
      'Text in Datei ersetzen (Linux)',
      'Text in Datei ersetzen (macOS)',
      'Zeilen löschen, die einem Muster entsprechen',
    ],
    tips: 'macOS `sed` erfordert eine leere Zeichenkette nach `-i`. Verwende `gsed` auf macOS für GNU-sed-Verhalten.',
  },
  vi: {
    description: 'Der ursprüngliche POSIX-Texteditor, auf praktisch allen Unix-Systemen vorinstalliert.',
    examples: ['Eine Datei öffnen', 'An bestimmter Zeile öffnen', 'Im Nur-Lese-Modus öffnen'],
    tips: 'Drücke `i` für den Einfügemodus, `Esc` für den Befehlsmodus, `:wq` zum Speichern und Beenden.',
  },
  nvim: {
    description: 'Fork von Vim mit asynchronen Plugins, integriertem LSP-Client und Lua-Konfiguration.',
    examples: [
      'Eine Datei öffnen',
      'Zwei Dateien vergleichen',
      'Mit sauberer Konfiguration öffnen',
      'Gesundheitscheck',
    ],
    tips: 'Konfiguration unter `~/.config/nvim/init.lua`. Beliebte Distributionen: LazyVim, AstroNvim, NvChad.',
  },
  helix: {
    description: 'Moderner modaler Editor in Rust geschrieben, mit integriertem LSP und Tree-sitter.',
    examples: ['Eine Datei öffnen', 'Datei an bestimmter Zeile öffnen', 'Gesundheitscheck (LSP-Status)'],
    tips: 'Verwendet Selektion-zuerst-Bearbeitung. Keine Plugins für LSP/Syntaxhervorhebung nötig.',
  },
  'code-cli': {
    description: 'VS Code vom Terminal aus starten, Dateien vergleichen, Erweiterungen installieren.',
    examples: [
      'Aktuelles Verzeichnis öffnen',
      'Zwei Dateien vergleichen',
      'Eine Erweiterung installieren',
      'Datei an bestimmter Zeile öffnen',
    ],
    tips: 'Auf macOS "Shell Command: Install code in PATH" aus der VS Code Befehlspalette ausführen.',
  },
}

export default commandsDe
