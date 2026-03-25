import type { CommandExplanation } from '../types'

export const explanationsDeP2: Record<string, CommandExplanation> = {
  // ─── PAKETVERWALTUNG ────────────────────────────────────────────

  apt: {
    useCases: [
      'Pakete auf Debian/Ubuntu-Systemen installieren, aktualisieren oder entfernen',
      'Nach verfuegbaren Paketen suchen und Abhaengigkeitsbaeume pruefen',
      'Vollstaendige System-Upgrades mit einem einzigen Befehl durchfuehren',
    ],
    internals:
      'apt ist ein High-Level-Frontend fuer dpkg. Es loest Abhaengigkeiten auf, indem es Paketmetadaten aus konfigurierten Repositories in /etc/apt/sources.list liest, .deb-Dateien nach /var/cache/apt/archives herunterlaed und die eigentliche Installation an dpkg delegiert.',
    mistakes: [
      '`apt upgrade` ohne vorheriges `apt update` ausfuehren — der lokale Paketindex ist veraltet, sodass Sicherheitspatches fehlen oder Abhaengigkeitsfehler auftreten koennen.',
      '`apt autoremove` nach Kernel-Upgrades blind ausfuehren — es kann die Module des laufenden Kernels entfernen. Liste immer vor der Bestaetigung pruefen.',
      '`apt` und `apt-get` in Skripten mischen — `apt` ist fuer interaktive Nutzung gedacht und sein Ausgabeformat kann sich aendern. In Skripten `apt-get` fuer stabile Ausgabe verwenden.',
    ],
    bestPractices: [
      'Immer `apt update` vor `apt install` ausfuehren, um die neuesten Paketmetadaten sicherzustellen.',
      '`apt list --upgradable` verwenden, um anstehende Upgrades vor der Anwendung zu pruefen.',
      '`apt full-upgrade` statt `apt upgrade` bevorzugen, wenn geaenderte Abhaengigkeiten behandelt werden muessen (z.B. Major-Versionsspruenge).',
    ],
  },

  dnf: {
    useCases: [
      'Pakete auf Fedora, RHEL 8+ und CentOS Stream verwalten',
      'Installierte oder verfuegbare Pakete abfragen und deren Metadaten inspizieren',
      'Modulare Streams fuer Laufzeitumgebungen oder Datenbanken aktivieren/deaktivieren',
    ],
    internals:
      'dnf hat yum ersetzt, indem es die Abhaengigkeitsaufloesung mit libsolv, einer SAT-Solver-basierten Bibliothek, neu implementiert hat. Es laedt Repository-Metadaten als komprimiertes XML/SQLite herunter, loest den Abhaengigkeitsgraphen und delegiert rpm-Transaktionen an librpm.',
    mistakes: [
      '`dnf makecache` nach dem Hinzufuegen eines neuen Repos vergessen — dnf sieht die neuen Pakete erst nach Aktualisierung der Metadaten.',
      '`dnf remove` auf ein Gruppen-Metapaket anwenden und versehentlich viele Abhaengigkeiten entfernen — `dnf group remove` mit `--with-optional` vorsichtig verwenden.',
      'Die Ausgabe von `dnf needs-restarting` ignorieren — aktualisierte Bibliotheken sind erst nach Neustart der betroffenen Dienste oder einem Reboot aktiv.',
    ],
    bestPractices: [
      '`dnf history` verwenden, um Transaktionen zu pruefen und bei Problemen rueckgaengig zu machen.',
      'Kritische Pakete mit `dnf versionlock` fixieren, um unbeabsichtigte Upgrades zu verhindern.',
      '`dnf automatic` mit Security-only-Updates fuer Server aktivieren.',
    ],
  },

  brew: {
    useCases: [
      'CLI-Tools und Bibliotheken auf macOS (und Linux) ohne Root installieren',
      'GUI-Anwendungen auf macOS ueber `brew install --cask` verwalten',
      'Bestimmte Paketversionen fixieren, wenn Stabilitaet wichtig ist',
    ],
    internals:
      'Homebrew installiert Formulae in ein Prefix (/opt/homebrew auf Apple Silicon, /usr/local auf Intel). Pakete werden aus dem Quellcode gebaut oder aus vorkompilierten Bottles installiert. Symlinks im bin/-Verzeichnis des Prefix zeigen auf die aktive Version im Cellar.',
    mistakes: [
      '`brew update && brew upgrade` ohne Pruefung ausfuehren — dies kann Major-Versionen aktualisieren und Projekte beschaedigen. `brew pin <formula>` verwenden, um Pakete einzufrieren.',
      'Homebrew als Root installieren — es ist fuer den normalen Benutzeraccount konzipiert. Root-Installation verursacht Berechtigungsprobleme.',
      '`brew cleanup` nicht regelmaessig ausfuehren — alte Bottles sammeln sich an und verschwenden Speicherplatz.',
    ],
    bestPractices: [
      '`brew bundle dump` verwenden, um ein Brewfile fuer reproduzierbare Umgebungen zu erzeugen.',
      '`brew doctor` nach Problemen ausfuehren, um haeufige Konfigurationsprobleme zu diagnostizieren.',
      '`brew install --cask` fuer GUI-Apps bevorzugen, um /Applications sauber zu halten.',
    ],
  },

  choco: {
    useCases: [
      'Software unter Windows ueber die Kommandozeile installieren und aktualisieren',
      'Arbeitsplatz-Einrichtung in Skripten oder mit Konfigurationsmanagement automatisieren',
      'Interne Pakete ueber private Chocolatey-Feeds verwalten',
    ],
    internals:
      'Chocolatey kapselt NuGet-Pakete. Pakete enthalten PowerShell-Installationsskripte, die typischerweise einen Installer herunterladen und still ausfuehren. Choco fuehrt eine lokale Datenbank installierter Pakete in C:\\ProgramData\\chocolatey\\lib.',
    mistakes: [
      '`choco install` ohne erhoehte Shell ausfuehren — die meisten Pakete benoetigen Admin-Rechte und schlagen still oder teilweise fehl.',
      '`--yes` in automatisierten Skripten nicht angeben — die standardmaessige interaktive Abfrage blockiert unbeaufsichtigte Laeufe.',
      'Paket-Pruefsummen mit `--ignore-checksums` ignorieren — dies umgeht die Integritaetspruefung und ist ein Sicherheitsrisiko.',
    ],
    bestPractices: [
      '`choco upgrade all` regelmaessig ausfuehren, um Software gepatcht zu halten.',
      'Pakete mit `choco pin add -n=<pkg>` fixieren, um versehentliche Upgrades kritischer Tools zu verhindern.',
      'Eine `packages.config`-XML-Datei fuer reproduzierbare Maschinen-Bereitstellung einrichten.',
    ],
  },

  npm: {
    useCases: [
      'JavaScript/TypeScript-Projektabhaengigkeiten aus der npm-Registry installieren',
      'Projektdefinierte Skripte (build, test, lint) ueber `npm run` ausfuehren',
      'Wiederverwendbare Pakete in oeffentlichen oder privaten Registries veroeffentlichen',
    ],
    internals:
      'npm loest einen Abhaengigkeitsbaum auf, dedupliziert gemeinsame Versionen und installiert Pakete in node_modules. Seit npm v7 verwendet es ein flaches node_modules-Layout ueber arborist. Die package-lock.json zeichnet den exakten aufgeloesten Baum fuer reproduzierbare Installationen auf.',
    mistakes: [
      'node_modules in die Versionskontrolle committen — es ist gross und plattformspezifisch. Nur package.json und package-lock.json committen.',
      '`npm install` statt `npm ci` in CI verwenden — `npm ci` ist schneller und stellt sicher, dass die Lockfile exakt eingehalten wird.',
      'devDependencies in Produktions-Images installieren — `npm ci --omit=dev` verwenden, um Container schlank zu halten.',
    ],
    bestPractices: [
      'Immer package-lock.json committen, um deterministische Builds sicherzustellen.',
      '`npm audit` regelmaessig ausfuehren und hohe/kritische Schwachstellen zeitnah beheben.',
      '`npx` verwenden, um einmalige CLI-Tools auszufuehren, ohne globale Installationen zu verschmutzen.',
      'Interne Pakete unter einer Org (`@org/pkg`) scopen, um Namenskollisionen zu vermeiden.',
    ],
  },

  pip: {
    useCases: [
      'Python-Pakete von PyPI oder privaten Indexes installieren',
      'Aktuelle Umgebung in eine requirements.txt fuer Reproduzierbarkeit einfrieren',
      'Pakete im editierbaren Modus waehrend der Entwicklung mit `pip install -e .` installieren',
    ],
    internals:
      'pip loest Abhaengigkeiten mit einem Backtracking-Resolver (seit v20.3) auf. Es laedt Wheels (oder sdists, die es baut) von PyPI herunter und installiert sie in das site-packages-Verzeichnis des aktiven Python-Interpreters oder der virtuellen Umgebung.',
    mistakes: [
      'Pakete global mit `sudo pip install` installieren — dies kann mit Systempaketen kollidieren. Immer eine virtuelle Umgebung verwenden.',
      'Versionen in requirements.txt nicht pinnen — ungepinnte Abhaengigkeiten fuehren zu nicht reproduzierbaren Builds und unerwarteten Problemen.',
      'Die Backtracking-Warnung des Resolvers ignorieren — sie deutet meist auf widersprüchliche Versionsbeschraenkungen hin. Constraints vereinfachen oder aktualisieren.',
    ],
    bestPractices: [
      'Immer innerhalb eines venv oder einer conda-Umgebung arbeiten, um Abhaengigkeiten zu isolieren.',
      '`pip freeze > requirements.txt` fuer einen Snapshot verwenden, aber eine manuell gepflegte requirements.in mit nur direkten Abhaengigkeiten fuehren.',
      '`pip install --require-hashes` in CI/CD fuer Supply-Chain-Sicherheit bevorzugen.',
    ],
  },

  snap: {
    useCases: [
      'Sandboxed-Anwendungen auf Ubuntu und anderen snap-faehigen Distributionen installieren',
      'Automatisch aktualisierende Desktop- oder Server-Anwendungen mit eingeschraenkten Berechtigungen erhalten',
      'Mehrere Versionen derselben Anwendung ueber Channels (stable/edge) ausfuehren',
    ],
    internals:
      'Snaps sind squashfs-Images, die unter /snap/<name>/<revision> gemountet werden. snapd verwaltet Downloads, Mounts, AppArmor/seccomp-Confinement-Profile und automatische Hintergrund-Updates. Jeder Snap laeuft in einer eingeschraenkten Sandbox mit Zugriff ueber Interfaces.',
    mistakes: [
      'Erwarten, dass Snaps vollen Dateisystemzugriff haben — sie sind sandboxed. Fehlende Interfaces mit `snap connect` verbinden.',
      'Automatische Aktualisierung unbegrenzt deaktivieren — snap erzwingt ein Maximum von 90 Tagen. Stattdessen Wartungsfenster planen.',
      '`snap connections` nicht pruefen, wenn eine App fehlerhaft ist — fehlende Interface-Verbindungen sind die haeufigste Ursache fuer Berechtigungsfehler.',
    ],
    bestPractices: [
      '`snap refresh --hold` verwenden, um Updates waehrend kritischer Arbeit voruebergehend aufzuschieben.',
      'Verfuegbare Interfaces mit `snap interfaces` inspizieren, um Sandbox-Grenzen zu verstehen.',
      'Das `--classic`-Flag nur verwenden, wenn wirklich noetig, da es das Confinement deaktiviert.',
    ],
  },

  flatpak: {
    useCases: [
      'Sandboxed-Desktop-Anwendungen auf jeder Linux-Distribution installieren',
      'Apps von Flathub mit automatischer Runtime-Deduplizierung ausfuehren',
      'Beta-Software ueber Flatpak-Beta-Branches testen, ohne den Host zu beeinflussen',
    ],
    internals:
      'Flatpak verwendet OSTree zum Speichern und Deduplizieren von Anwendungs- und Runtime-Dateien. Anwendungen laufen in einer bubblewrap-Sandbox mit Dateisystem-, Netzwerk- und Geraetezugriff, der durch Portal-APIs und in Metadaten deklarierte Berechtigungen gesteuert wird.',
    mistakes: [
      '`--filesystem=host`-Overrides fuer jede App gewaehren — dies unterlaueft die Sandbox. Den engsten benoetigten Pfad gewaehren.',
      '`flatpak update` vergessen — im Gegensatz zu Snaps aktualisiert Flatpak nicht auf allen Distributionen automatisch.',
      'Ungenutzte Runtimes nicht bereinigen — `flatpak uninstall --unused` regelmaessig ausfuehren, um Speicherplatz zurueckzugewinnen.',
    ],
    bestPractices: [
      '`flatpak override --user` verwenden, um Berechtigungen pro App anzupassen, ohne Systemvorgaben zu aendern.',
      'Flathub als User-Remote fuer unprivilegierte Installationen aktivieren.',
      'App-Berechtigungen mit `flatpak info --show-permissions <app>` pruefen, bevor Overrides gewaehrt werden.',
    ],
  },

  cargo: {
    useCases: [
      'Rust-Projekte und deren Abhaengigkeiten bauen, testen und verwalten',
      'Rust-CLI-Tools global mit `cargo install` installieren',
      'Crates auf crates.io fuer die Community veroeffentlichen',
    ],
    internals:
      'Cargo liest Cargo.toml, um einen Abhaengigkeitsgraphen aufzuloesen (aufgezeichnet in Cargo.lock), laedt Crates aus der Registry herunter und ruft rustc mit den korrekten Flags auf. Es unterstuetzt inkrementelle Kompilierung und cacht Build-Artefakte im target/-Verzeichnis.',
    mistakes: [
      'Cargo.lock bei Binaer-Projekten nicht committen — ohne sie kann CI andere Abhaengigkeitsversionen aufloesen. (Bibliotheken sollten sie nicht committen.)',
      'Das target/-Verzeichnis loeschen, um Build-Fehler zu "beheben" — dies erzwingt einen vollstaendigen Rebuild. `cargo clean -p <crate>` fuer selektives Bereinigen verwenden.',
      '`cargo clippy`-Warnungen ignorieren — clippy findet subtile Bugs und nicht-idiomatischen Code, den der Compiler erlaubt.',
    ],
    bestPractices: [
      '`cargo clippy` und `cargo fmt` vor jedem Commit ausfuehren fuer konsistenten, idiomatischen Code.',
      '`cargo audit` verwenden, um Abhaengigkeiten auf bekannte Sicherheitsluecken zu pruefen.',
      'LTO und `opt-level = "z"` in Release-Profilen aktivieren, wenn die Binaergroesse wichtig ist.',
    ],
  },

  pacman: {
    useCases: [
      'Pakete auf Arch Linux und Derivaten installieren, aktualisieren und entfernen',
      'Die lokale Paketdatenbank oder Sync-Datenbank nach Paketinformationen abfragen',
      'Vollstaendige System-Upgrades mit `pacman -Syu` durchfuehren',
    ],
    internals:
      'pacman nutzt libalpm zur Verwaltung einer lokalen Datenbank installierter Pakete. Es laedt komprimierte Pakete von Mirror-Servern herunter, verifiziert PGP-Signaturen, loest Abhaengigkeiten auf und extrahiert Dateien direkt ins Dateisystem.',
    mistakes: [
      '`pacman -Sy <paket>` (partielles Upgrade) ausfuehren — dies kann das System durch nicht uebereinstimmende Bibliotheksversionen beschaedigen. Immer `pacman -Syu` verwenden.',
      '.pacnew- und .pacsave-Dateien nach Upgrades ignorieren — diese zeigen Konfigurationsdatei-Konflikte an, die manuell zusammengefuehrt werden muessen.',
      'Pakete mit `pacman -R` statt `pacman -Rs` entfernen — ersteres laesst verwaiste Abhaengigkeiten zurueck.',
    ],
    bestPractices: [
      'Immer ein vollstaendiges System-Upgrade (`pacman -Syu`) vor der Installation neuer Pakete durchfuehren.',
      '`paccache -r` verwenden, um nur die 3 neuesten Paketversionen im Cache zu behalten.',
      'Die Arch-Linux-News-Seite vor groesseren Upgrades auf manuelle Eingriffe pruefen.',
    ],
  },

  zypper: {
    useCases: [
      'Pakete auf openSUSE und SUSE Linux Enterprise verwalten',
      'OBS-(Open Build Service)-Repositories hinzufuegen und verwalten',
      'Patches anwenden und Systemmigrationen zwischen Release-Versionen durchfuehren',
    ],
    internals:
      'zypper ist ein CLI-Frontend fuer libzypp, das libsolv fuer SAT-basierte Abhaengigkeitsaufloesung nutzt. Es liest Repository-Metadaten im rpm-md-Format und verwaltet Transaktionen ueber librpm.',
    mistakes: [
      'Zu viele OBS-Repos von Drittanbietern hinzufuegen — widersprüchliche Pakete ueber Repos verursachen Abhaengigkeitsprobleme. Mit `zypper repos` pruefen.',
      '`zypper dup` aus einer laufenden grafischen Sitzung ausfuehren — groessere Distributions-Upgrades sollten von einem TTY oder Recovery-Modus erfolgen.',
      'Warnungen zu Anbieter-Wechseln ignorieren — das Akzeptieren von Anbieterwechseln ohne Pruefung kann stabile Pakete durch ungetestete ersetzen.',
    ],
    bestPractices: [
      '`zypper patch` fuer Security-only-Updates auf Servern verwenden.',
      'Kritische Pakete mit `zypper addlock` sperren, um unbeabsichtigte Upgrades zu verhindern.',
      '`zypper verify` ausfuehren, um zu pruefen, ob installierte Pakete intakt und keine Abhaengigkeiten defekt sind.',
    ],
  },

  dpkg: {
    useCases: [
      'Eine einzelne .deb-Datei installieren, die nicht in einem Repository ist',
      'Installierte Pakete und deren Dateilisten abfragen',
      'Defekte Paketinstallationen rekonfigurieren oder reparieren',
    ],
    internals:
      'dpkg ist der Low-Level-Paketmanager von Debian. Es entpackt .deb-Archive (ar-Format mit control.tar und data.tar), fuehrt Maintainer-Skripte (preinst, postinst, prerm, postrm) aus und aktualisiert /var/lib/dpkg/status zur Verfolgung installierter Pakete.',
    mistakes: [
      '`dpkg -i` ohne vorherige Abhaengigkeitsaufloesung verwenden — dpkg holt keine Abhaengigkeiten. Danach `apt --fix-broken install` ausfuehren.',
      'Pakete mit `--force-remove-reinstreq` erzwungen entfernen — dies kann das System in einem inkonsistenten Zustand hinterlassen.',
      '/var/lib/dpkg/status manuell bearbeiten — manuelle Aenderungen koennen die Paketdatenbank beschaedigen. Stattdessen dpkg- oder apt-Befehle verwenden.',
    ],
    bestPractices: [
      '`dpkg -l | grep <muster>` verwenden, um schnell zu pruefen, ob ein Paket installiert ist.',
      '`dpkg --configure -a` ausfuehren, um Pakete in unkonfiguriertem Zustand zu reparieren.',
      '`apt install ./<datei>.deb` statt direktem dpkg fuer automatische Abhaengigkeitsaufloesung bevorzugen.',
    ],
  },

  rpm: {
    useCases: [
      'Einzelne .rpm-Dateien auf Red-Hat-basierten Systemen installieren',
      'Installierte Paketmetadaten, Dateilisten und Skripte abfragen',
      'Paketintegritaet und Dateiberechtigungen gegen die rpm-Datenbank verifizieren',
    ],
    internals:
      'rpm verwaltet eine eingebettete BerkeleyDB/SQLite-Datenbank unter /var/lib/rpm. Es extrahiert cpio-Payloads aus .rpm-Dateien, fuehrt Scriptlets aus und zeichnet Dateieigentuemerschaft auf. Abhaengigkeitsaufloesung ist nicht integriert — das uebernimmt dnf/yum.',
    mistakes: [
      '`rpm -Uvh` fuer ein Paket verwenden, das kein Upgrade ist — `rpm -ivh` fuer Neuinstallationen nutzen, um versehentliches Entfernen der alten Version zu vermeiden.',
      '`rpm -Va`-Warnungen ignorieren — geaenderte Konfigurationsdateien sind normal, aber geaenderte Binaerdateien koennen auf Manipulation hindeuten.',
      'Installation mit `--nodeps` erzwingen — dies umgeht Abhaengigkeitspruefungen und fuehrt oft zu defekter Software.',
    ],
    bestPractices: [
      '`rpm -qa --last` verwenden, um Pakete sortiert nach Installationsdatum aufzulisten.',
      'Paketsignaturen mit `rpm -K <datei>.rpm` verifizieren, bevor Drittanbieter-RPMs installiert werden.',
      'dnf/yum statt direktem rpm fuer Installationen bevorzugen, um automatische Abhaengigkeitsbehandlung zu erhalten.',
    ],
  },

  // ─── KOMPRIMIERUNG ───────────────────────────────────────────────

  tar: {
    useCases: [
      'Mehrere Dateien und Verzeichnisse in eine einzelne .tar-Datei archivieren',
      'Mit gzip/bzip2/xz fuer komprimierte Archive kombinieren (.tar.gz, .tar.bz2, .tar.xz)',
      'Backups unter Beibehaltung von Dateiberechtigungen und Eigentuemer extrahieren',
      'Archive ueber SSH fuer Remote-Dateitransfers streamen',
    ],
    internals:
      'tar schreibt einen sequentiellen Strom von 512-Byte-Headerbloecken gefolgt von Datenbloecken. Es komprimiert nicht selbst — die Komprimierung erfolgt durch Piping an externe Programme (gzip, bzip2, xz) oder ueber integrierte Flags (-z, -j, -J).',
    mistakes: [
      'tar-Dateien extrahieren, ohne den Inhalt vorher zu pruefen — `tar -tf` verwenden, um Dateien aufzulisten und auf Pfade mit `/` oder `../` zu achten, die Systemdateien ueberschreiben koennten.',
      'Das `-z`-, `-j`- oder `-J`-Flag beim Extrahieren komprimierter Archive vergessen — tar meldet ungueltige Header. Modernes GNU tar erkennt automatisch, BSD tar moeglicherweise nicht.',
      'Relative Pfade beim Erstellen von Archiven falsch verwenden — immer `cd` ins uebergeordnete Verzeichnis oder `-C` nutzen, um unerwuenschte Verzeichnisebenen zu vermeiden.',
    ],
    bestPractices: [
      'Immer ein Archiv auflisten (`tar -tf`), bevor es extrahiert wird, um die Struktur zu pruefen.',
      '`tar -caf archiv.tar.xz verz/` verwenden, um tar den Kompressor automatisch anhand der Dateierweiterung waehlen zu lassen.',
      '`--exclude-vcs` hinzufuegen, um .git-Verzeichnisse beim Archivieren von Quellbaemen auszuschliessen.',
    ],
  },

  zip: {
    useCases: [
      'Plattformuebergreifende komprimierte Archive erstellen, die Windows-Nutzer nativ oeffnen koennen',
      'Dateien inkrementell zu einem bestehenden Archiv hinzufuegen',
      'Dateien unter Beibehaltung der Verzeichnisstruktur fuer die Verteilung komprimieren',
    ],
    internals:
      'zip speichert jede Datei einzeln komprimiert (standardmaessig deflate) mit einem lokalen Datei-Header. Ein zentrales Verzeichnis am Ende der Datei indexiert alle Eintraege und ermoeglicht wahlfreien Zugriff auf einzelne Dateien, ohne das gesamte Archiv lesen zu muessen.',
    mistakes: [
      'Annehmen, dass zip Unix-Berechtigungen bewaehrt — es speichert sie in Extra-Feldern, die Windows ignoriert. tar fuer berechtigungssensitive Archive verwenden.',
      'Mit dem Standard ZipCrypto verschluesseln — es ist kryptographisch schwach. `zip -e` mit AES via 7z verwenden, wenn Sicherheit wichtig ist.',
      'Sehr grosse Archive (>4 GB) mit alten zip-Implementierungen erstellen — sicherstellen, dass Zip64-Erweiterungen verwendet werden.',
    ],
    bestPractices: [
      '`zip -r archiv.zip verz/` fuer rekursive Verzeichniskomprimierung verwenden.',
      '`-x "*.DS_Store"` oder `-x "*.git/*"` hinzufuegen, um unerwuenschte Dateien auszuschliessen.',
      'Fuer maximale Kompatibilitaet mit Nicht-Unix-Systemen zip statt tar.gz bevorzugen.',
    ],
  },

  gzip: {
    useCases: [
      'Einzelne Dateien komprimieren, um Speicherplatz zu sparen (.gz-Erweiterung)',
      'Komprimierte Daten durch Netzwerktransfers oder zwischen Programmen pipen',
      'Logdateien fuer Rotation und Archivierung komprimieren',
    ],
    internals:
      'gzip verwendet den DEFLATE-Algorithmus (LZ77 + Huffman-Kodierung). Es ersetzt standardmaessig die Originaldatei durch eine komprimierte Version. Es arbeitet mit Einzeldateien — fuer mehrere Dateien mit tar kombinieren.',
    mistakes: [
      'Erwarten, dass gzip Verzeichnisse verarbeitet — es komprimiert nur Einzeldateien. `tar -czf` fuer Verzeichnisse verwenden.',
      'Vergessen, dass `gzip` die Originaldatei loescht — `gzip -k` verwenden, um sie zu behalten, oder von stdin umleiten.',
      'Maximale Komprimierung (`-9`) fuer grosse Dateien ohne Messung verwenden — die Groessenverbesserung gegenueber `-6` (Standard) ist oft vernachlaessigbar, aber viel langsamer.',
    ],
    bestPractices: [
      '`gzip -k` verwenden, um die Originaldatei neben der komprimierten Version zu behalten.',
      'Zum Dekomprimieren sind `gunzip` und `gzip -d` aequivalent — verwende, was du dir merkst.',
      'Ausgabe mit `gzip -c` pipen, wenn auf stdout geschrieben werden soll, statt die Datei zu ersetzen.',
    ],
  },

  bzip2: {
    useCases: [
      'Dateien mit besseren Verhaeltnissen als gzip auf Kosten der Geschwindigkeit komprimieren',
      '.tar.bz2-Archive fuer die Quellcode-Verteilung erstellen',
      'Grosse textlastige Datensaetze komprimieren, wenn das Verhaeltnis wichtiger ist als die Zeit',
    ],
    internals:
      'bzip2 verwendet die Burrows-Wheeler-Transformation (BWT) gefolgt von Move-to-Front und dann Huffman-Kodierung. Die BWT ordnet Daten um, um aehnliche Bytes zu gruppieren, was die nachfolgende Komprimierung effektiver macht. Es verarbeitet Daten in 100-900 KB-Bloecken.',
    mistakes: [
      'bzip2 fuer Echtzeit-Streaming verwenden — seine blockbasierte Natur macht den Start der Dekomprimierung langsam. gzip oder zstd fuer Streaming verwenden.',
      'Vergessen, dass bzip2 ebenfalls die Originaldatei loescht — `bzip2 -k` verwenden, um sie zu behalten.',
      'xz oder zstd nicht als moderne Alternativen in Betracht ziehen — sie bieten in der Regel bessere Verhaeltnisse und Geschwindigkeit.',
    ],
    bestPractices: [
      '`pbzip2` fuer parallele Komprimierung auf Multi-Core-Maschinen verwenden.',
      'Fuer neue Projekte eine Migration zu zstd oder xz erwaegen — bzip2 ist in den meisten Kontexten veraltet.',
      '`-9` (900 KB-Bloecke) nur fuer maximale Komprimierung verwenden; `-6` ist ein guter Standard.',
    ],
  },

  xz: {
    useCases: [
      'Hoechste Komprimierungsverhaeltnisse fuer Archivierung und Verteilung erzielen',
      'Linux-Kernel-Images und grosse Tarballs fuer den Download komprimieren',
      '.tar.xz-Archive als modernen Ersatz fuer .tar.bz2 erstellen',
    ],
    internals:
      'xz verwendet den LZMA2-Algorithmus, der LZ77-Woerterbuchkomprimierung mit Range-Coding kombiniert. LZMA2 unterstuetzt Multi-Thread-Komprimierung und adaptive Blockgroessen. Das grosse Woerterbuch (bis zu 1,5 GB) ermoeglicht exzellente Komprimierung, erfordert aber erheblichen Speicher.',
    mistakes: [
      'Hohe Kompressionsstufen auf Maschinen mit wenig Speicher verwenden — `xz -9` benoetigt ca. 674 MB RAM fuer Komprimierung und ca. 65 MB fuer Dekomprimierung.',
      '`-T0` fuer Multi-Thread-Komprimierung nicht verwenden — Single-Threaded xz ist bei grossen Dateien sehr langsam.',
      'xz fuer Dateien verwenden, die wahlfreien Zugriff benoetigen — das Format ist sequentiell. Stattdessen ein blockorientiertes Format verwenden.',
    ],
    bestPractices: [
      '`xz -T0` verwenden, um automatisch alle CPU-Kerne fuer die Komprimierung zu nutzen.',
      'Die Standard-Kompressionsstufe (`-6`) bietet einen guten Kompromiss zwischen Verhaeltnis und Geschwindigkeit.',
      'Fuer schnellere Alternativen mit aehnlichen Verhaeltnissen zstd auf hohen Stufen evaluieren.',
    ],
  },

  '7z': {
    useCases: [
      'Archive mit den hoechsten Komprimierungsverhaeltnissen mittels LZMA/LZMA2 erstellen',
      'Mit vielen Archivformaten (zip, tar, rar, iso, cab) ueber ein einzelnes Tool arbeiten',
      'Verschluesselte Archive mit starker AES-256-Verschluesselung erstellen',
    ],
    internals:
      '7z unterstuetzt mehrere Codecs (LZMA, LZMA2, PPMd, BZip2, Deflate). Es nutzt standardmaessig Solid-Komprimierung und gruppiert Dateien in einen einzigen Block fuer bessere Verhaeltnisse. Der Header kann ebenfalls verschluesselt werden, um Dateinamen vor Inspektion zu verbergen.',
    mistakes: [
      'Sich auf das 7z-Format fuer Linux-Backups verlassen — es speichert keine Unix-Berechtigungen oder Eigentuemer. tar fuer Backups verwenden.',
      'Solid-Archive fuer haeufige Updates verwenden — das Aendern einer Datei erfordert die Neukomprimierung des gesamten Solid-Blocks.',
      '`-mhe=on` beim Verschluesseln sensibler Archive vergessen — ohne dies bleiben Dateinamen sichtbar, obwohl der Inhalt verschluesselt ist.',
    ],
    bestPractices: [
      '`7z a -t7z -m0=lzma2 -mx=9` fuer maximale Komprimierung verwenden.',
      'Header-Verschluesselung mit `-mhe=on` beim Archivieren sensibler Daten aktivieren.',
      'Fuer plattformuebergreifendes Teilen ins zip-Format (`-tzip`) ausgeben fuer breitere Kompatibilitaet.',
    ],
  },

  zstd: {
    useCases: [
      'Dateien mit einem exzellenten Geschwindigkeits-Verhaeltnis-Kompromiss komprimieren',
      'Als schnelle Echtzeit-Komprimierungsschicht fuer Datenbanken oder Log-Shipping nutzen',
      'gzip in Pipelines ersetzen, wo sowohl Geschwindigkeit als auch gute Komprimierung wichtig sind',
      'Woerterbuecher erstellen, um viele kleine aehnliche Dateien effizient zu komprimieren',
    ],
    internals:
      'Zstandard nutzt eine Kombination aus LZ77-Matching, Finite State Entropy (tANS)-Kodierung und Huffman-Kodierung. Es unterstuetzt 22 Kompressionsstufen plus einen Ultra-Modus. Auf niedrigen Stufen ist es schneller als gzip bei aehnlichen Verhaeltnissen; auf hohen Stufen naehert es sich xz-Verhaeltnissen.',
    mistakes: [
      'Den adaptiven Modus (`--adapt`) bei variabler I/O-Geschwindigkeit nicht verwenden — zstd kann seine Stufe automatisch basierend auf dem I/O-Durchsatz anpassen.',
      'Ein Woerterbuch mit nicht-repraesentativen Daten trainieren — Woerterbuecher muessen mit Samples trainiert werden, die den Zieldaten aehneln.',
      'Stufe 22 (Ultra) ohne Verstaendnis des Speicherbedarfs verwenden — es erfordert erheblichen RAM fuer minimalen Gewinn gegenueber Stufe 19.',
    ],
    bestPractices: [
      '`zstd -T0` fuer Multi-Thread-Komprimierung auf Multi-Core-Systemen verwenden.',
      'Ein Woerterbuch mit `zstd --train` trainieren, wenn viele kleine aehnliche Dateien komprimiert werden (z.B. JSON-Logs).',
      'Die Standardstufe (3) ist fuer allgemeine Nutzung exzellent; Stufe 19 eignet sich gut fuer Archivierung.',
    ],
  },

  unzip: {
    useCases: [
      '.zip-Archive auf Unix/Linux/macOS-Systemen extrahieren',
      'Inhalte einer zip-Datei ohne Extraktion auflisten',
      'Bestimmte Dateien aus einem grossen zip-Archiv extrahieren',
    ],
    internals:
      'unzip liest das zentrale Verzeichnis am Ende der zip-Datei, um Eintraege zu lokalisieren, und dekomprimiert dann jede Datei unabhaengig mit dem gespeicherten Algorithmus (typischerweise deflate). Es kann mit `-p` auf stdout extrahieren fuer Piping.',
    mistakes: [
      'In das aktuelle Verzeichnis extrahieren, ohne vorher zu pruefen — manche zip-Dateien haben kein Hauptverzeichnis und verstreuen Dateien ueberall. Zuerst `unzip -l` verwenden.',
      'Kodierungsprobleme bei Dateinamen ignorieren — zip-Dateien von Windows koennen Nicht-UTF-8-Kodierung verwenden. `-O` verwenden, um die Kodierung anzugeben.',
      'Bestehende Dateien ohne Nachfrage ueberschreiben — `unzip -n` (nie ueberschreiben) oder `-o` (immer ueberschreiben) explizit verwenden.',
    ],
    bestPractices: [
      '`unzip -l archiv.zip` verwenden, um Inhalte vor dem Extrahieren zu inspizieren.',
      'In ein dediziertes Verzeichnis extrahieren mit `unzip archiv.zip -d ziel/`, um Unordnung zu vermeiden.',
      '`unzip -t` verwenden, um die Archivintegritaet ohne Extraktion zu testen.',
    ],
  },

  unrar: {
    useCases: [
      'Erhaltene .rar-Archive extrahieren',
      'Inhalte von RAR-Archiven auflisten und auf Integritaet testen',
      'Passwortgeschuetzte RAR-Dateien extrahieren',
    ],
    internals:
      'unrar dekomprimiert RAR-Archive mit einem proprietaeren Algorithmus (PPMd- und LZSS-Varianten). Das RAR-Format unterstuetzt Solid-Komprimierung, Wiederherstellungsdaten und mehrteilige Archive. unrar ist das kostenlose Nur-Extraktions-Tool; zum Erstellen von RAR-Dateien wird das proprietaere rar-Programm benoetigt.',
    mistakes: [
      'Versuchen, RAR-Dateien mit unrar zu erstellen — es extrahiert nur. `rar` verwenden oder ein offenes Format wie tar.zst oder 7z waehlen.',
      'Mehrteilige Archive ignorieren — Dateien wie .part1.rar, .part2.rar muessen alle vorhanden sein. Nur vom ersten Teil extrahieren.',
      'Integritaet nicht vorher pruefen — `unrar t archiv.rar` vor dem Extrahieren verwenden, um Korruption zu erkennen.',
    ],
    bestPractices: [
      '`unrar l archiv.rar` verwenden, um Inhalte vor der Extraktion aufzulisten.',
      'Offene Formate (tar.gz, tar.zst, 7z) fuer eigene Archive bevorzugen — RAR ist proprietaer.',
      '`unrar x` (Pfade beibehalten) statt `unrar e` (flaches Extrahieren) verwenden, um die Verzeichnisstruktur beizubehalten.',
    ],
  },

  lz4: {
    useCases: [
      'Daten komprimieren, wenn Dekomprimierungsgeschwindigkeit kritisch ist (z.B. Echtzeit-Anwendungen)',
      'Als schnelle Komprimierungsschicht fuer Dateisystem-Snapshots oder Datenbanken nutzen',
      'Daten durch Netzwerktransfers pipen, wenn die CPU der Engpass ist, nicht die Bandbreite',
    ],
    internals:
      'LZ4 nutzt einen vereinfachten LZ77-Algorithmus, der auf Geschwindigkeit optimiert ist. Es erreicht Dekomprimierungsgeschwindigkeiten von mehreren GB/s auf modernen CPUs durch einen einfachen Hash-basierten Match-Finder und minimale Entropie-Kodierung. Das Format unterstuetzt sowohl Block- als auch Frame-Modus.',
    mistakes: [
      'Hohe Komprimierungsverhaeltnisse erwarten — LZ4 tauscht Verhaeltnis gegen Geschwindigkeit. zstd oder xz verwenden, wenn das Verhaeltnis wichtig ist.',
      'lz4-Block-Format mit Frame-Format verwechseln — Tools sind moeglicherweise nicht interoperabel. Das Frame-Format (Standard in der lz4-CLI) fuer Kompatibilitaet verwenden.',
      '`lz4 -BD` fuer bessere Verhaeltnisse nicht verwenden — der blockabhaengige Modus verknuepft Bloecke fuer etwas bessere Komprimierung.',
    ],
    bestPractices: [
      'lz4 als Standard-Komprimierung fuer Echtzeit-Pipelines und temporaere Daten verwenden.',
      'Mit tar fuer Verzeichniskomprimierung kombinieren: `tar cf - verz/ | lz4 > archiv.tar.lz4`.',
      '`lz4 -9` (HC-Modus) verwenden, wenn bessere Komprimierung gewuenscht ist, aber immer noch schneller als gzip.',
    ],
  },

  pigz: {
    useCases: [
      'gzip-Dateien mit mehreren CPU-Kernen komprimieren oder dekomprimieren',
      'Drop-in-Ersatz fuer gzip in bestehenden Skripten, die schnelleren Durchsatz benoetigen',
      'Grosse Dateien oder Streams komprimieren, wenn Single-Threaded gzip zu langsam ist',
    ],
    internals:
      'pigz (Parallel Implementation of GZip) teilt die Eingabe in 128-KB-Bloecke und komprimiert sie parallel mit einem Thread-Pool. Die Ausgabe ist ein gueltiger gzip-Stream — jeder Block ist ein unabhaengiger deflate-Block, sodass jedes gzip-Tool ihn dekomprimieren kann.',
    mistakes: [
      'Standardmaessig parallele Dekomprimierung erwarten — pigz kann nur Single-Threaded dekomprimieren, da Standard-gzip-Streams sequentiell sind. Nur pigz-erstellte Dateien mit unabhaengigen Bloecken profitieren von paralleler Dekomprimierung.',
      'Zu viele Threads auf einem geteilten System setzen — `-p <n>` verwenden, um Kerne zu begrenzen und andere Prozesse nicht auszuhungern.',
      'Annehmen, dass pigz-Ausgabe byte-identisch mit gzip ist — die Ergebnisse dekomprimieren identisch, aber die komprimierten Bytes unterscheiden sich aufgrund von Blockgrenzen.',
    ],
    bestPractices: [
      'gzip in Backup-Skripten durch pigz fuer erhebliche Beschleunigung ersetzen: `tar cf - verz/ | pigz > archiv.tar.gz`.',
      '`-p` verwenden, um die Anzahl der Threads auf ausgelasteten Servern zu steuern.',
      'Mit `tar --use-compress-program=pigz` fuer transparente Integration kombinieren.',
    ],
  },

  // ─── BERECHTIGUNGEN & BENUTZER ───────────────────────────────────

  chmod: {
    useCases: [
      'Lese-/Schreib-/Ausfuehrungsberechtigungen fuer Dateien und Verzeichnisse setzen',
      'Skripte mit `chmod +x` ausfuehrbar machen',
      'Sensible Dateien (private Schluessel, Konfiguration) auf Nur-Eigentuemer-Zugriff beschraenken',
    ],
    internals:
      'chmod aendert die Dateimodus-Bits, die im Inode gespeichert sind. Der Kernel prueft diese Bits (Eigentuemer/Gruppe/Andere) zusammen mit der Prozess-UID/GID, um den Zugriff zu bestimmen. Auf ext4 werden Berechtigungen in der Inode-Tabelle gespeichert; auf Netzwerkdateisystemen haengt das Verhalten vom Server ab.',
    mistakes: [
      '`chmod 777` verwenden, um Berechtigungsprobleme zu "beheben" — dies macht Dateien fuer alle schreibbar und erzeugt eine Sicherheitsluecke. Die tatsaechlich benoetigten Berechtigungen ermitteln.',
      '`chmod -R 755` auf ein Verzeichnis mit Dateien anwenden — dies macht alle Dateien ausfuehrbar. `find` verwenden, um verschiedene Modi fuer Dateien (644) und Verzeichnisse (755) zu setzen.',
      'Vergessen, dass chmod auf FAT/NTFS-Partitionen keine Wirkung hat — diese Dateisysteme unterstuetzen Unix-Berechtigungen nicht nativ.',
    ],
    bestPractices: [
      'Symbolische Notation (`chmod u+x,go-w`) fuer Lesbarkeit in Skripten verwenden.',
      'Private Schluessel auf `chmod 600` setzen — SSH und GPG verweigern Schluessel mit breiteren Berechtigungen.',
      'Berechtigungen rekursiv mit Vorsicht anwenden: `find verz/ -type f -exec chmod 644 {} +` und `find verz/ -type d -exec chmod 755 {} +`.',
    ],
  },

  chown: {
    useCases: [
      'Datei- oder Verzeichnis-Eigentuemer nach dem Kopieren von Dateien zwischen Benutzern aendern',
      'Eigentuemerschaft nach dem Extrahieren von Archiven eines anderen Benutzers korrigieren',
      'Korrekte Eigentuemerschaft fuer Webserver-Dokumentverzeichnisse setzen',
    ],
    internals:
      'chown aktualisiert die UID- und GID-Felder im Inode der Datei. Nur root kann die Dateieigentuemerschaft aendern (um zu verhindern, dass Benutzer Quota umgehen). Gruppenaenderungen sind erlaubt, wenn der Aufrufer Dateieigentuemer und Mitglied der Zielgruppe ist.',
    mistakes: [
      '`chown -R` auf /usr oder /etc ausfuehren — dies kann Systemdienste beschaedigen. Immer den Zielpfad genau pruefen.',
      'Die Doppelpunkt-Syntax fuer Gruppen vergessen — `chown benutzer:gruppe datei` setzt beides; `chown benutzer datei` aendert nur den Eigentuemer.',
      'chown auf Symlinks ohne `-h` verwenden — standardmaessig folgt chown Symlinks und aendert das Ziel, nicht den Link selbst.',
    ],
    bestPractices: [
      '`chown -R benutzer:gruppe verz/` verwenden, um die Eigentuemerschaft bereitgestellter Anwendungen rekursiv zu korrigieren.',
      'In Deployment-Skripten mit `chmod` kombinieren, um sowohl Eigentuemerschaft als auch Berechtigungen zu setzen.',
      '`--from=alterbenutzer` verwenden, um die Eigentuemerschaft nur zu aendern, wenn der aktuelle Eigentuemer uebereinstimmt.',
    ],
  },

  sudo: {
    useCases: [
      'Einen einzelnen Befehl mit erhoehten (Root-)Berechtigungen ausfuehren',
      'Verwaltungsaufgaben ausfuehren, ohne sich als root anzumelden',
      'Systemdateien sicher mit `sudo -e` (sudoedit) bearbeiten',
    ],
    internals:
      'sudo prueft /etc/sudoers (geparst durch das sudoers-Plugin), um zu verifizieren, ob der Aufrufer fuer den angeforderten Befehl autorisiert ist. Es authentifiziert ueber PAM, cacht Anmeldedaten fuer ein konfigurierbares Timeout (Standard 15 Minuten) und protokolliert alle Aufrufe im syslog.',
    mistakes: [
      '`sudo su -` gewohnheitsmaessig statt `sudo <befehl>` verwenden — eine interaktive Root-Shell umgeht die befehlsweise Auditierung.',
      'Ausgabeumleitung mit sudo falsch verwenden — `sudo echo x > /etc/datei` schlaegt fehl, weil die Shell (nicht sudo) die Umleitung handhabt. `echo x | sudo tee /etc/datei` verwenden.',
      '`NOPASSWD: ALL` in sudoers aus Bequemlichkeit hinzufuegen — dies ist ein erhebliches Sicherheitsrisiko. NOPASSWD auf bestimmte Befehle beschraenken.',
    ],
    bestPractices: [
      '`sudo -e` (sudoedit) zum Bearbeiten von Systemdateien verwenden — es kopiert die Datei, oeffnet den Editor und schreibt zurueck, um versehentliche Schaeden zu verhindern.',
      'sudoers nur mit `visudo` konfigurieren — es validiert die Syntax vor dem Speichern.',
      'sudo-Nutzung ueber `/var/log/auth.log` oder `journalctl -u sudo` auditieren.',
    ],
  },

  useradd: {
    useCases: [
      'Neue Benutzerkonten auf Linux-Systemen erstellen',
      'Dienstkonten mit eingeschraenkten Shells fuer Daemons einrichten',
      'Benutzer mit bestimmten UID/GID-Zuweisungen fuer NFS-Kompatibilitaet erstellen',
    ],
    internals:
      'useradd schreibt Eintraege in /etc/passwd, /etc/shadow und /etc/group. Es erstellt optional ein Home-Verzeichnis durch Kopieren von Dateien aus /etc/skel. Standardwerte stammen aus /etc/default/useradd und /etc/login.defs.',
    mistakes: [
      'Vergessen, ein Passwort nach `useradd` zu setzen — das Konto ist standardmaessig gesperrt. Sofort `passwd <benutzer>` ausfuehren.',
      '`-m` zum Erstellen des Home-Verzeichnisses nicht verwenden — ohne dies hat der Benutzer kein Home-Verzeichnis. Manche Distributionen erstellen es standardmaessig, andere nicht.',
      'Dienstkonten mit einer Login-Shell erstellen — `-s /usr/sbin/nologin` fuer Konten verwenden, die sich nie interaktiv anmelden sollen.',
    ],
    bestPractices: [
      '`useradd -m -s /bin/bash <benutzer>` fuer interaktive Benutzer verwenden, um ein Home-Verzeichnis mit der Standard-Shell zu erstellen.',
      'Fuer Dienstkonten `useradd -r -s /usr/sbin/nologin <dienst>` verwenden, um ein Systemkonto zu erstellen.',
      'Passwort-Ablaufrichtlinien mit `-e` (Ablaufdatum) und chage fuer Compliance setzen.',
    ],
  },

  passwd: {
    useCases: [
      'Das eigene Passwort oder das eines anderen Benutzers (als root) aendern',
      'Benutzerkonten sperren oder entsperren',
      'Einen Benutzer zwingen, sein Passwort bei der naechsten Anmeldung zu aendern',
    ],
    internals:
      'passwd aktualisiert das gehashte Passwort in /etc/shadow. Es nutzt PAM-Module zur Durchsetzung von Passwortqualitaetsregeln (Laenge, Komplexitaet). Der Hash-Algorithmus wird in /etc/login.defs konfiguriert (typischerweise SHA-512 oder yescrypt).',
    mistakes: [
      'Schwache Passwoerter setzen, die minimale PAM-Pruefungen bestehen — pam_pwquality fuer strengere Regeln konfigurieren.',
      '`passwd -d` verwenden, um ein Passwort zu entfernen — dies erlaubt passwortlose Anmeldung, was selten beabsichtigt ist. Stattdessen `passwd -l` zum Sperren verwenden.',
      'PAM-Regeln nach Aenderung von /etc/pam.d/common-password nicht testen — ein falsch konfigurierter PAM-Stack kann alle aussperren.',
    ],
    bestPractices: [
      '`passwd -e <benutzer>` verwenden, um eine Passwortaenderung bei der naechsten Anmeldung fuer neue Konten zu erzwingen.',
      'Konten mit `passwd -l <benutzer>` sperren, statt sie zu loeschen, um Audit-Trails zu erhalten.',
      'pam_pwquality konfigurieren, um Mindestlaenge, Komplexitaet und Woerterbuchpruefungen durchzusetzen.',
    ],
  },

  id: {
    useCases: [
      'UID, GID und Gruppenmitgliedschaften des aktuellen Benutzers anzeigen',
      'Effektive Gruppenmitgliedschaft vor dem Zugriff auf gemeinsame Ressourcen pruefen',
      'Benutzeridentitaetspruefungen in Automatisierung skripten',
    ],
    internals:
      'id liest aus /etc/passwd und /etc/group (oder NSS-Backends wie LDAP), um die numerische UID/GID in Namen aufzuloesen. Es zeigt sowohl reale als auch effektive IDs, die sich unterscheiden, wenn setuid/setgid-Programme laufen.',
    mistakes: [
      'Annehmen, dass die `id`-Ausgabe aktuelle Gruppenaenderungen widerspiegelt — neue Gruppenmitgliedschaften erfordern eine neue Login-Sitzung, um wirksam zu werden.',
      'id-Ausgabe mit fragiler Zeichenkettensuche parsen — `id -u`, `id -g` oder `id -Gn` fuer bestimmte Felder verwenden.',
    ],
    bestPractices: [
      '`id -u` verwenden, um nur die numerische UID fuer Skripte zu erhalten.',
      'Nach dem Hinzufuegen eines Benutzers zu einer Gruppe `newgrp <gruppe>` verwenden oder sich neu anmelden, bevor mit `id` getestet wird.',
    ],
  },

  groups: {
    useCases: [
      'Alle Gruppen auflisten, denen ein Benutzer angehoert',
      'Gruppenmitgliedschaft zur Fehlersuche bei Zugriffssteuerung pruefen',
    ],
    internals:
      'groups liest ergaenzende Gruppen-IDs aus /etc/group und der Kernel-Credential-Struktur. Es ist im Wesentlichen eine Kurzform fuer `id -Gn`.',
    mistakes: [
      'Vergessen, dass Gruppenaenderungen eine Neuanmeldung erfordern — das Hinzufuegen eines Benutzers zu einer Gruppe in /etc/group betrifft bestehende Sitzungen nicht.',
      'Primaere Gruppe (aus /etc/passwd) mit ergaenzenden Gruppen (aus /etc/group) verwechseln — beide erscheinen in der Ausgabe, haben aber unterschiedliche Rollen.',
    ],
    bestPractices: [
      '`groups <benutzername>` verwenden, um die Mitgliedschaften eines anderen Benutzers zu pruefen.',
      'Mit `newgrp` kombinieren, um eine neu zugewiesene Gruppe zu aktivieren, ohne sich abzumelden.',
    ],
  },

  su: {
    useCases: [
      'Im aktuellen Terminal zu einem anderen Benutzerkonto wechseln',
      'Eine Root-Shell fuer mehrere Verwaltungsaufgaben oeffnen',
      'Anwendungsverhalten als anderer Benutzer testen',
    ],
    internals:
      'su startet einen neuen Shell-Prozess mit der UID/GID des Zielbenutzers. Mit `su -` (Login-Shell) wird auch die Umgebung (PATH, HOME usw.) auf die Standardwerte des Zielbenutzers zurueckgesetzt, indem dessen Login-Profil geladen wird.',
    mistakes: [
      '`su` ohne Bindestrich verwenden (`su root` vs. `su - root`) — ohne `-` wird die Umgebung (PATH, HOME) nicht zurueckgesetzt, was zu verwirrendem Verhalten fuehrt.',
      'su statt sudo fuer einzelne Befehle verwenden — su oeffnet eine persistente Root-Shell, was das Risiko versehentlicher Schaeden erhoeht.',
      'Eine Root-su-Sitzung offen lassen — immer sofort `exit` ausfuehren, um das Fenster fuer Fehler zu minimieren.',
    ],
    bestPractices: [
      'Immer `su -` verwenden, um eine saubere Login-Umgebung zu erhalten.',
      '`sudo` fuer einzelne Befehle bevorzugen, um Audit-Trails beizubehalten.',
      '`su - <benutzer> -c "befehl"` verwenden, um einen einzelnen Befehl als anderer Benutzer ohne interaktive Shell auszufuehren.',
    ],
  },

  last: {
    useCases: [
      'Aktuelle Anmeldehistorie fuer Sicherheitsaudits pruefen',
      'Pruefen, wann sich ein bestimmter Benutzer zuletzt angemeldet hat',
      'Unerwartete Anmeldungen oder ungewoehnliche Anmeldezeiten identifizieren',
    ],
    internals:
      'last liest die binaere Datei /var/log/wtmp, die alle An- und Abmeldeereignisse aufzeichnet. Jeder Eintrag enthaelt Benutzername, Terminal, Remote-Host und Zeitstempel. Der Befehl `lastb` liest /var/log/btmp fuer fehlgeschlagene Anmeldeversuche.',
    mistakes: [
      'Sich allein auf `last` fuer Sicherheit verlassen — ein Angreifer mit Root-Zugriff kann wtmp loeschen. Mit Remote-Syslog kombinieren.',
      '`still logged in`-Eintraege ignorieren, die nach Abstuerzen bestehen bleiben — diese zeigen, dass das System keine saubere Abmeldung aufgezeichnet hat.',
    ],
    bestPractices: [
      '`last -a` verwenden, um den Hostnamen in der letzten Spalte fuer breitere Terminals anzuzeigen.',
      '`lastb` ausfuehren, um Brute-Force-Anmeldeversuche zu pruefen.',
      'wtmp/btmp mit logrotate rotieren, um unkontrolliertes Wachstum zu verhindern.',
    ],
  },

  usermod: {
    useCases: [
      'Einen bestehenden Benutzer zu zusaetzlichen Gruppen hinzufuegen',
      'Home-Verzeichnis, Shell oder Login-Namen eines Benutzers aendern',
      'Benutzerkonten sperren oder entsperren',
    ],
    internals:
      'usermod aendert Eintraege in /etc/passwd, /etc/shadow und /etc/group. Beim Aendern des Home-Verzeichnisses mit `-d -m` werden die Verzeichnisinhalte an den neuen Ort verschoben und der passwd-Eintrag aktualisiert.',
    mistakes: [
      '`usermod -G gruppe benutzer` ohne `-a` verwenden — dies ersetzt alle ergaenzenden Gruppen durch die angegebene. Immer `usermod -aG gruppe benutzer` zum Anfuegen verwenden.',
      'Einen aktuell angemeldeten Benutzer aendern — Gruppenaenderungen werden erst bei neuen Sitzungen wirksam.',
      'Vergessen, die Home-Verzeichnis-Inhalte bei Aenderung zu verschieben — `-m` mit `-d` verwenden, um Dateien automatisch umzuziehen.',
    ],
    bestPractices: [
      'Immer `usermod -aG` (anfuegen) verwenden, wenn Benutzer zu Gruppen hinzugefuegt werden.',
      'Konten mit `usermod -L <benutzer>` vor dem Loeschen sperren, um Zugriff waehrend der Uebergangszeit zu verhindern.',
      '`usermod -s /usr/sbin/nologin` verwenden, um interaktive Anmeldung fuer stillgelegte Konten zu deaktivieren.',
    ],
  },

  userdel: {
    useCases: [
      'Nicht mehr benoetigte Benutzerkonten entfernen',
      'Nach Mitarbeiterabgaengen oder stillgelegten Dienstkonten aufraeumen',
    ],
    internals:
      'userdel entfernt die Eintraege des Benutzers aus /etc/passwd, /etc/shadow und /etc/group. Mit `-r` wird zusaetzlich das Home-Verzeichnis und der Mail-Spool rekursiv geloescht.',
    mistakes: [
      '`userdel -r` ohne vorherige Sicherung des Home-Verzeichnisses ausfuehren — alle Dateien werden dauerhaft geloescht.',
      'Einen Benutzer loeschen, der laufende Prozesse besitzt — Prozesse zuerst mit `pkill -u <benutzer>` beenden oder neu zuweisen.',
      'Vergessen, den Benutzer aus sudoers zu entfernen — verwaiste sudoers-Eintraege bleiben und koennten ausgenutzt werden, wenn die UID wiederverwendet wird.',
    ],
    bestPractices: [
      'Home-Verzeichnis vor dem Loeschen sichern: `tar -czf /backup/benutzer.tar.gz /home/benutzer`.',
      '`userdel -r` nur verwenden, nachdem bestaetigt wurde, dass keine kritischen Dateien im Home-Verzeichnis existieren.',
      'Alle Cron-Jobs, sudoers-Eintraege und SSH-Schluessel des geloeschten Benutzers auditieren und entfernen.',
    ],
  },

  groupadd: {
    useCases: [
      'Neue Gruppen fuer Zugriffssteuerung auf gemeinsame Ressourcen erstellen',
      'Projektspezifische Gruppen fuer kollaborativen Dateizugriff einrichten',
      'Systemgruppen fuer Dienstkonten erstellen',
    ],
    internals:
      'groupadd fuegt einen neuen Eintrag in /etc/group und /etc/gshadow hinzu. Es weist automatisch die naechste verfuegbare GID zu, sofern keine mit `-g` angegeben wird. Systemgruppen (erstellt mit `-r`) nutzen GIDs aus einem reservierten Bereich, definiert in /etc/login.defs.',
    mistakes: [
      'Gruppen mit GIDs erstellen, die mit NFS-geteilten Systemen kollidieren — GID-Zuweisung maschinenuebergreifend koordinieren oder einen Verzeichnisdienst verwenden.',
      'Vergessen, Benutzer zur neuen Gruppe hinzuzufuegen — allein das Erstellen der Gruppe gewaehrt niemandem Zugriff.',
    ],
    bestPractices: [
      '`groupadd -r <gruppe>` fuer System-/Dienstgruppen verwenden, um den System-GID-Bereich zu nutzen.',
      'Gruppenzwecke an zentraler Stelle dokumentieren, um verwaiste Gruppen zu vermeiden.',
      'Mit `chmod g+rwx` und `chown :gruppe` auf gemeinsamen Verzeichnissen kombinieren, um kollaborativen Zugriff zu ermoeglichen.',
    ],
  },

  acl: {
    useCases: [
      'Dateizugriff fuer bestimmte Benutzer ueber das Eigentuemer/Gruppe/Andere-Modell hinaus gewaehren',
      'Standardberechtigungen fuer neue Dateien in einem gemeinsamen Verzeichnis setzen',
      'Feinkoernige Zugriffssteuerung ohne Erstellung vieler Gruppen implementieren',
    ],
    internals:
      'POSIX-ACLs erweitern das Standard-Berechtigungsmodell um zusaetzliche Benutzer-/Gruppeneintraege, die in erweiterten Attributen (system.posix_acl_access) gespeichert werden. Der Kernel wertet ACLs in Reihenfolge aus: Eigentuemer, benannte Benutzer, besitzende Gruppe, benannte Gruppen, Andere. Die ACL-Maske begrenzt die effektiven Berechtigungen aller Nicht-Eigentuemer-Eintraege.',
    mistakes: [
      'ACLs setzen, ohne die Maske zu verstehen — der Maskeneintrag begrenzt die maximalen Berechtigungen fuer alle benannten Benutzer und Gruppen. `setfacl -m m::rwx` verwenden, wenn Eintraege Berechtigungen zu verlieren scheinen.',
      'Standard-ACLs auf Verzeichnissen vergessen — ohne `-d` erben neue Dateien darin die ACL nicht.',
      'Dateisystem-Unterstuetzung nicht pruefen — das Dateisystem mit der `acl`-Option mounten (oder sicherstellen, dass es Standard ist), bevor setfacl verwendet wird.',
    ],
    bestPractices: [
      '`setfacl -d -m u:benutzer:rwx verz/` verwenden, um Standard-ACLs zu setzen, die neue Dateien erben.',
      'ACLs mit `getfacl datei` pruefen — `ls -l` zeigt nur ein `+`-Zeichen an.',
      'Alle ACLs mit `setfacl -b datei` entfernen, wenn zu Standardberechtigungen vereinfacht wird.',
    ],
  },

  umask: {
    useCases: [
      'Standardberechtigungen fuer neu erstellte Dateien und Verzeichnisse steuern',
      'Standardwerte in Skripten verschaerfen, die sensible Dateien erstellen',
      'Freizuegige Standardwerte fuer kollaborative gemeinsame Verzeichnisse setzen',
    ],
    internals:
      'umask ist ein Prozessattribut (kein Befehl, der Dateien aendert). Wenn ein Prozess eine Datei erstellt, subtrahiert der Kernel die umask-Bits vom angeforderten Modus. Beispiel: Eine typische Dateierstellung fordert Modus 666 an; mit umask 022 ergibt das 644.',
    mistakes: [
      'umask 000 aus Bequemlichkeit setzen — jede neue Datei wird fuer alle schreibbar, was ein grosses Sicherheitsrisiko ist.',
      'Erwarten, dass umask bestehende Dateien betrifft — es gilt nur fuer neu erstellte Dateien. chmod fuer bestehende Dateien verwenden.',
      'umask mit chmod verwechseln — umask subtrahiert Berechtigungen; chmod setzt sie.',
    ],
    bestPractices: [
      '`umask 077` in Skripten verwenden, die sensible Daten erstellen (private Schluessel, Geheimnisse).',
      'umask in ~/.bashrc oder /etc/profile fuer persistente Standardwerte setzen.',
      'Der Standard-Server-umask von `022` ist fuer die meisten Anwendungsfaelle geeignet (Dateien: 644, Verzeichnisse: 755).',
    ],
  },

  chage: {
    useCases: [
      'Passwort-Ablaufrichtlinien fuer Benutzerkonten setzen',
      'Benutzer zwingen, Passwoerter regelmaessig fuer Compliance zu aendern',
      'Passwort-Alterungsinformationen fuer Audits einsehen',
    ],
    internals:
      'chage aendert die Passwort-Alterungsfelder in /etc/shadow: letztes Aenderungsdatum, Mindest-/Maximalzahl der Tage zwischen Aenderungen, Warnzeitraum und Konto-Ablaufdatum. Der Login-Prozess prueft diese Felder bei jeder Authentifizierung.',
    mistakes: [
      'Maximales Passwortalter zu kurz setzen — haeufige erzwungene Aenderungen fuehren dazu, dass Benutzer schwaechere, vorhersagbare Passwoerter waehlen.',
      'Konto-Ablauf (`-E`) mit Passwort-Ablauf (`-M`) verwechseln — Konto-Ablauf deaktiviert das Konto vollstaendig.',
      'Keinen Warnzeitraum (`-W`) setzen — Benutzer werden ohne Vorankuendigung ausgesperrt, wenn sie den Ablauf verpassen.',
    ],
    bestPractices: [
      '`chage -l <benutzer>` verwenden, um alle Alterungseinstellungen eines Kontos zu pruefen.',
      '`-W 14` setzen, um Benutzer 14 Tage vor Passwort-Ablauf zu warnen.',
      'Mit `chage -d 0 <benutzer>` kombinieren, um eine sofortige Passwortaenderung bei der naechsten Anmeldung zu erzwingen.',
    ],
  },

  visudo: {
    useCases: [
      'Die /etc/sudoers-Datei sicher mit Syntaxvalidierung bearbeiten',
      'sudo-Berechtigungen fuer Benutzer und Gruppen gewaehren oder widerrufen',
      'Feinkoernige Befehlsbeschraenkungen fuer sudo konfigurieren',
    ],
    internals:
      'visudo sperrt /etc/sudoers, oeffnet sie im Standard-Editor und validiert die Syntax vor dem Speichern. Bei Syntaxfehlern wird zum erneuten Bearbeiten, Verwerfen oder dennoch Speichern aufgefordert. Dies verhindert Aussperrungen durch Tippfehler in der sudoers-Datei.',
    mistakes: [
      '/etc/sudoers direkt mit einem Texteditor bearbeiten — ein Syntaxfehler kann den gesamten sudo-Zugriff sperren. Immer visudo verwenden.',
      '`ALL=(ALL) NOPASSWD: ALL` breit verwenden — dies gewaehrt uneingeschraenkten passwortlosen Root-Zugriff. Auf bestimmte Befehle beschraenken.',
      'sudoers-Aenderungen nicht in einer separaten Sitzung testen — eine bestehende Root-Sitzung offen halten, wenn Aenderungen vorgenommen werden, fuer den Fall einer Aussperrung.',
    ],
    bestPractices: [
      'Benutzerdefinierte Regeln in /etc/sudoers.d/-Dateien ablegen, statt die Haupt-sudoers-Datei zu bearbeiten.',
      '`visudo -f /etc/sudoers.d/custom` verwenden, um Drop-in-Dateien mit Syntaxpruefung zu bearbeiten.',
      'Befehle explizit angeben: `benutzer ALL=(ALL) /usr/bin/systemctl restart nginx` statt ALL.',
      'Immer eine Root-Shell offen halten, wenn sudoers geaendert wird, als Sicherheitsnetz.',
    ],
  },

  // ─── FESTPLATTE & SPEICHER ────────────────────────────────────────

  lsblk: {
    useCases: [
      'Alle Blockgeraete und ihre Partitionen in einer Baumansicht auflisten',
      'Festplattengeraete-Namen vor dem Partitionieren oder Formatieren identifizieren',
      'Mount-Punkte und Dateisystemtypen auf einen Blick pruefen',
    ],
    internals:
      'lsblk liest aus /sys/block und /sys/class/block, um Blockgeraete aufzuzaehlen. Es baut den Eltern-Kind-Baum aus Kernel-Geraetebeziehungen auf und fragt optional udev nach zusaetzlichen Eigenschaften wie UUID, LABEL und FSTYPE ab.',
    mistakes: [
      'Geraete-Namen zwischen Neustarts verwechseln — Geraete-Namen (sda, sdb) koennen sich aendern. UUID oder LABEL fuer persistente Identifikation verwenden.',
      '`lsblk -f` nicht verwenden, um Dateisystem-Infos zu sehen — die Standardausgabe laesst UUIDs und Mount-Punkte weg.',
    ],
    bestPractices: [
      '`lsblk -f` verwenden, um Dateisystemtypen, UUIDs, Labels und Mount-Punkte zu sehen.',
      '`lsblk -o NAME,SIZE,TYPE,MOUNTPOINT,UUID` fuer benutzerdefinierte Spaltenausgabe verwenden.',
      'Mit `blkid` fuer autoritative UUID/Label-Informationen abgleichen.',
    ],
  },

  mount: {
    useCases: [
      'Ein Dateisystem in den Verzeichnisbaum einhaengen fuer den Zugriff',
      'USB-Laufwerke, ISO-Images oder Netzwerkfreigaben mounten',
      'Ein Dateisystem mit anderen Optionen remounten (z.B. Lese-Schreib)',
    ],
    internals:
      'mount ruft den mount(2)-Syscall auf, der einen Dateisystem-Superblock an einen Verzeichnis-Inode (den Mount-Punkt) anhaengt. Die VFS-Schicht leitet nachfolgende Pfadaufloesungen durch das gemountete Dateisystem. Optionen werden an den Dateisystem-Treiber im Kernel uebergeben.',
    mistakes: [
      'Ueber ein nicht-leeres Verzeichnis mounten — der urspruengliche Inhalt wird verborgen (nicht geloescht), bis unmount erfolgt. Leere Verzeichnisse als Mount-Punkte verwenden.',
      'Vor dem Entfernen von Medien nicht unmounten — dies kann das Dateisystem beschaedigen. Vorher `umount` oder `sync` verwenden.',
      '`mount -o remount` beim Aendern von Optionen nicht verwenden — das Unmounten eines aktiven Dateisystems kann fehlschlagen, wenn Dateien geoeffnet sind.',
    ],
    bestPractices: [
      '`mount -o ro` fuer schreibgeschuetzten Zugriff beim Untersuchen von forensischen Images oder nicht vertrauenswuerdigen Medien verwenden.',
      '`mount -a` verwenden, um alle Eintraege in /etc/fstab zu mounten (nuetzlich nach fstab-Bearbeitung).',
      '`findmnt` fuer eine uebersichtlichere Ansicht des aktuellen Mount-Baums als die reine `mount`-Ausgabe verwenden.',
    ],
  },

  fdisk: {
    useCases: [
      'MBR-Partitionstabellen auf Festplatten erstellen, loeschen und aendern',
      'Bestehende Partitionslayouts zur Fehlerbehebung anzeigen',
      'Partitionstypen und bootfaehige Flags setzen',
    ],
    internals:
      'fdisk liest und schreibt die Partitionstabelle, die im ersten Sektor (MBR) oder in GPT-Headern gespeichert ist. Aenderungen werden im Speicher vorgenommen und erst auf die Festplatte geschrieben, wenn der Befehl `w` ausgefuehrt wird. Es manipuliert CHS/LBA-Adressierung fuer Legacy-Kompatibilitaet.',
    mistakes: [
      'Die Partitionstabelle auf die falsche Festplatte schreiben — den Geraete-Namen mit `lsblk` pruefen, bevor fdisk ausgefuehrt wird.',
      'fdisk fuer GPT-Festplatten verwenden — obwohl modernes fdisk GPT unterstuetzt, sind `gdisk` oder `parted` zuverlaessiger fuer GPT-Operationen.',
      '`partprobe` nach dem Aendern von Partitionen auf einem laufenden System nicht ausfuehren — der Kernel sieht die Aenderungen moeglicherweise erst nach Benachrichtigung.',
    ],
    bestPractices: [
      'Immer die bestehende Partitionstabelle mit `sfdisk -d /dev/sdX > backup.txt` sichern, bevor Aenderungen vorgenommen werden.',
      '`fdisk -l` verwenden, um alle Festplatten und Partitionen nicht-destruktiv aufzulisten.',
      '`parted` oder `gdisk` fuer GPT-Partitionstabellen auf modernen Systemen bevorzugen.',
    ],
  },

  mkfs: {
    useCases: [
      'Ein neues Dateisystem auf einer Partition oder einem Blockgeraet erstellen',
      'USB-Laufwerke mit einem bestimmten Dateisystem (ext4, FAT32, NTFS) formatieren',
      'Dateisysteme mit optimierten Parametern fuer bestimmte Workloads initialisieren',
    ],
    internals:
      'mkfs ist ein Frontend, das dateisystemspezifische Tools (mkfs.ext4, mkfs.xfs, mkfs.vfat usw.) aufruft. Jedes Tool schreibt den Dateisystem-Superblock, Inode-Tabellen, Journal und Allokationsstrukturen auf das Zielgeraet und ueberschreibt alle bestehenden Daten.',
    mistakes: [
      'mkfs auf dem falschen Geraet ausfuehren — dies zerstoert alle Daten. Dreifach mit `lsblk` pruefen und sicherstellen, dass das Geraet nicht gemountet ist.',
      'mkfs auf einer aktuell gemounteten Partition verwenden — das Dateisystem wird beschaedigt. Immer vorher unmounten.',
      'Den Dateisystemtyp nicht angeben — `mkfs` ohne `-t` kann standardmaessig ext2 verwenden, dem Journaling fehlt.',
    ],
    bestPractices: [
      'Immer den Dateisystemtyp angeben: `mkfs -t ext4 /dev/sdX1`.',
      'Ein Label mit `-L meinlabel` hinzufuegen fuer einfache Identifikation in mount-Befehlen und fstab.',
      '`mkfs.ext4 -T largefile` fuer Partitionen verwenden, die wenige, sehr grosse Dateien speichern, um die Inode-Allokation zu optimieren.',
    ],
  },

  blkid: {
    useCases: [
      'UUID, LABEL und Dateisystemtyp von Blockgeraeten finden',
      'fstab-Eintraege mit persistenten Identifikatoren generieren',
      'Unbeschriftete Partitionen bei der Fehlerbehebung identifizieren',
    ],
    internals:
      'blkid prueft Blockgeraete durch Lesen von Magic-Bytes an bekannten Offsets, um Dateisystemtypen zu identifizieren. Es pflegt einen Cache unter /etc/blkid.tab (oder /run/blkid/blkid.tab), um nachfolgende Abfragen zu beschleunigen.',
    mistakes: [
      'Sich auf veralteten blkid-Cache verlassen — `blkid -g` (Garbage Collection) oder `blkid -p` (Low-Level-Probe, kein Cache) verwenden, wenn Ergebnisse falsch erscheinen.',
      'Nicht als root ausfuehren — blkid kann moeglicherweise nicht alle Geraete ohne erhoehte Berechtigungen lesen.',
    ],
    bestPractices: [
      '`blkid -o export /dev/sdX1` fuer leicht parsbare Ausgabe in Skripten verwenden.',
      'UUIDs von blkid in /etc/fstab statt Geraete-Namen fuer Stabilitaet referenzieren.',
      '`blkid -p` verwenden, um eine frische Pruefung zu erzwingen und den Cache zu umgehen.',
    ],
  },

  dd: {
    useCases: [
      'ISO-Images auf USB-Laufwerke fuer bootfaehige Medien schreiben',
      'Festplatten-Backups auf Blockebene (vollstaendige Partitions-Klone) erstellen',
      'Dateien bestimmter Groesse fuer Tests generieren',
      'Laufwerke durch Ueberschreiben mit Nullen oder Zufallsdaten sicher loeschen',
    ],
    internals:
      'dd liest Bloecke einer angegebenen Groesse von der Eingabe und schreibt sie auf die Ausgabe, mit optionalen Konvertierungen. Es arbeitet unterhalb der Dateisystemebene und kopiert rohe Bytes. Es nutzt die read(2)/write(2)-Syscalls direkt, mit konfigurierbaren Blockgroessen, die den Durchsatz erheblich beeinflussen.',
    mistakes: [
      'Das falsche `of=`-Ziel angeben — dd ueberschreibt jedes Geraet ohne Bestaetigung. Es wird aus gutem Grund "Disk Destroyer" genannt. Vorher mit `lsblk` pruefen.',
      'Eine zu kleine Blockgroesse verwenden — die Standardgroesse von 512 Bytes ist sehr langsam fuer Massenkopien. `bs=4M` oder groesser verwenden.',
      '`status=progress` vergessen — ohne dies laeuft dd stumm und es ist nicht erkennbar, ob es arbeitet oder haengt.',
    ],
    bestPractices: [
      'Immer das `of=`-Geraet pruefen, bevor Enter gedrueckt wird.',
      '`dd bs=4M status=progress oflag=sync` zum Schreiben von ISO-Images auf USB-Laufwerke verwenden.',
      '`pv` fuer einen Fortschrittsbalken an dd pipen: `pv input.iso | dd of=/dev/sdX bs=4M`.',
      '`sync` nach Abschluss von dd verwenden, um Kernel-Puffer vor dem Entfernen der Medien zu leeren.',
    ],
  },

  parted: {
    useCases: [
      'GPT- und MBR-Partitionstabellen erstellen und verwalten',
      'Partitionen ohne Datenverlust vergroessern/verkleinern (fuer unterstuetzte Dateisysteme)',
      'Partitionsoperationen im nicht-interaktiven Modus skripten',
    ],
    internals:
      'parted liest und schreibt Partitionstabellen direkt und kann sowohl MBR als auch GPT verarbeiten. Anders als fdisk werden Aenderungen sofort angewendet, wenn Befehle ausgefuehrt werden (kein separater Schreibschritt). Es nutzt libparted fuer dateisystembewusstes Vergroessern/Verkleinern, wenn unterstuetzt.',
    mistakes: [
      'Vergessen, dass parted Aenderungen sofort anwendet — es gibt kein Rueckgaengig oder "Schreiben"-Bestaetigung. Ein falscher Befehl kann die Partitionstabelle zerstoeren.',
      'Ein gemountetes Dateisystem vergroessern/verkleinern — immer vorher unmounten, um Korruption zu vermeiden.',
      'parted-Einheiten verwechseln — `unit s` (Sektoren) fuer Praezision oder `unit MiB` fuer Klarheit verwenden. Standardeinheiten koennen Off-by-One-Ausrichtungsprobleme verursachen.',
    ],
    bestPractices: [
      '`parted -s` fuer geskriptete (nicht-interaktive) Partitionsoperationen verwenden.',
      'Optimale Ausrichtung mit `parted -a optimal` fuer SSDs und moderne Laufwerke setzen.',
      'Die Partitionstabelle vor Aenderungen sichern: `sgdisk --backup=tabelle.bak /dev/sdX`.',
    ],
  },

  smartctl: {
    useCases: [
      'Festplatten- und SSD-Gesundheit ueber S.M.A.R.T.-Attribute pruefen',
      'Selbsttests ausfuehren, um fehlerhafte Laufwerke proaktiv zu erkennen',
      'Laufwerkstemperatur und Fehlerzaehler ueber die Zeit ueberwachen',
    ],
    internals:
      'smartctl kommuniziert mit Speichergeraeten ueber ATA/SCSI/NVMe-Pass-Through-Befehle, um die On-Device-S.M.A.R.T.-Firmware abzufragen. Es liest Attributtabellen, Fehlerprotokolle und Selbsttestergebnisse, die in der Laufwerks-Firmware gespeichert sind. Teil des smartmontools-Pakets.',
    mistakes: [
      'Annehmen, dass eine "PASSED"-Gesamtbewertung bedeutet, dass das Laufwerk gesund ist — einzelne Attribute wie Reallocated Sector Count oder Current Pending Sector koennen auf bevorstehenden Ausfall hindeuten, auch wenn der Gesamtstatus bestanden ist.',
      'Keine regelmaessigen Selbsttests ausfuehren — S.M.A.R.T.-Attribute werden nur waehrend Tests aktualisiert. Regelmaessige kurze/lange Tests einplanen.',
      'smartctl auf NVMe-Laufwerken ignorieren — NVMe verwendet einen anderen Attributsatz. `smartctl -a /dev/nvme0` fuer NVMe-Gesundheitsdaten verwenden.',
    ],
    bestPractices: [
      '`smartctl -a /dev/sdX` fuer einen umfassenden Gesundheitsbericht ausfuehren.',
      'Woechentlich lange Selbsttests mit `smartctl -t long /dev/sdX` einplanen.',
      'smartd fuer kontinuierliche Ueberwachung mit E-Mail-Benachrichtigungen bei Attributaenderungen einrichten.',
    ],
  },

  ncdu: {
    useCases: [
      'Interaktiv herausfinden, was Speicherplatz verbraucht',
      'Grosse Verzeichnisbaeume navigieren, um die groessten Dateien und Verzeichnisse zu identifizieren',
      'Speicherplatz bereinigen durch Identifizieren und Loeschen unnoetigerDateien',
    ],
    internals:
      'ncdu (NCurses Disk Usage) fuehrt einen einmaligen rekursiven Scan des Zielverzeichnisses durch und baut einen Groessen-Baum im Speicher auf. Dann zeigt es eine interaktive ncurses-Oberflaeche sortiert nach Groesse an. Dies ist viel schneller als wiederholtes Ausfuehren von du.',
    mistakes: [
      'Vom Root (/) scannen, ohne virtuelle Dateisysteme auszuschliessen — `/proc`, `/sys` und `/dev` koennen irrefuehrende Ergebnisse liefern. `-x` verwenden, um auf einem Dateisystem zu bleiben.',
      'Dateien aus ncdu loeschen, ohne zu verstehen, was sie sind — `d` vorsichtig druecken und vor der Bestaetigung pruefen.',
    ],
    bestPractices: [
      '`ncdu -x /` verwenden, um nur das Root-Dateisystem ohne Ueberschreitung von Mount-Grenzen zu scannen.',
      'Scans mit `ncdu -o scan.json /` exportieren, um sie spaeter mit `ncdu -f scan.json` zu analysieren.',
      'ncdu auf Remote-Servern via SSH ausfuehren, um Festplatte-voll-Situationen schnell zu diagnostizieren.',
    ],
  },

  fstab: {
    useCases: [
      'Dateisysteme definieren, die beim Booten automatisch gemountet werden',
      'Mount-Optionen fuer Netzwerkfreigaben (NFS, CIFS) konfigurieren',
      'Swap-Partitionen fuer automatische Aktivierung einrichten',
    ],
    internals:
      '/etc/fstab wird von mount(8) und systemd-fstab-generator gelesen. Jede Zeile beschreibt ein Dateisystem: Geraet, Mount-Punkt, Typ, Optionen, Dump-Flag und fsck-Passnummer. systemd wandelt fstab-Eintraege beim Booten in .mount-Units um.',
    mistakes: [
      'Geraete-Namen (/dev/sda1) statt UUIDs verwenden — Geraete-Namen koennen sich zwischen Neustarts aendern und Mount-Fehler verursachen. UUID=<uuid> oder LABEL=<label> verwenden.',
      'Mount-Optionen falsch schreiben — ein Tippfehler kann das Booten des Systems verhindern. Immer mit `mount -a` testen, bevor neu gestartet wird.',
      'Den fsck-Pass fuer ext4-Root auf 0 setzen — Root sollte Pass 1 fuer Boot-Zeit-Dateisystempruefungen sein.',
    ],
    bestPractices: [
      'Immer UUID= oder LABEL= fuer Geraeteidentifikation verwenden.',
      'fstab-Aenderungen mit `mount -a` und `findmnt --verify` testen, bevor neu gestartet wird.',
      '`nofail` zu nicht-kritischen Mounts hinzufuegen, damit der Boot fortgesetzt wird, wenn das Geraet fehlt.',
      '`noauto` fuer Eintraege hinzufuegen, die definiert, aber nicht beim Boot gemountet werden sollen (manuell mounten mit `mount /mountpunkt`).',
    ],
  },

  tune2fs: {
    useCases: [
      'ext2/ext3/ext4-Dateisystemparameter nach der Erstellung anpassen',
      'Ein Journal hinzufuegen oder entfernen, um zwischen ext2 und ext3/ext4 zu konvertieren',
      'Den reservierten Blockprozentsatz fuer Nicht-Root-Benutzer setzen',
    ],
    internals:
      'tune2fs aendert den Dateisystem-Superblock direkt. Es kann Parameter wie die reservierte Blockanzahl, die maximale Mount-Anzahl vor erzwungenem fsck, Volume-Label und Feature-Flags aendern. Aenderungen werden sofort wirksam, ohne Unmounten (fuer die meisten Optionen).',
    mistakes: [
      'Reservierte Bloecke auf Root-Dateisystemen auf 0% reduzieren — der reservierte Speicherplatz (Standard 5%) verhindert, dass root bei voller Festplatte keine Logs schreiben kann. Mindestens 1-2% fuer Root beibehalten.',
      'Features aktivieren, die vom laufenden Kernel nicht unterstuetzt werden — dies kann das Dateisystem unmountbar machen.',
      'tune2fs auf einem gemounteten Dateisystem fuer Optionen ausfuehren, die Unmounten erfordern — die Manpage fuer jede Option pruefen.',
    ],
    bestPractices: [
      'Reservierte Bloecke auf grossen Datenpartitionen reduzieren: `tune2fs -m 1 /dev/sdX1` (1% statt 5%).',
      'Ein Dateisystem-Label fuer einfache Identifikation setzen: `tune2fs -L meinlabel /dev/sdX1`.',
      '`tune2fs -l /dev/sdX1` verwenden, um aktuelle Superblock-Einstellungen anzuzeigen.',
    ],
  },

  'xfs-repair': {
    useCases: [
      'Beschaedigte XFS-Dateisysteme nach Abstuerzen oder Hardwarefehlern reparieren',
      'XFS-Dateisystemintegritaet pruefen, wenn Fehler vermutet werden',
      'Von Log-Korruption wiederherstellen, die das Mounten verhindert',
    ],
    internals:
      'xfs_repair liest die XFS-Dateisystemstrukturen (Superblock, AG-Header, Inode-BTrees, Extent-BTrees) und baut inkonsistente Metadaten neu auf. Es arbeitet in mehreren Phasen: Superblock-Verifizierung, AG-Scanning, Inode-Erkennung und Verzeichnis-Rekonstruktion. Es muss auf einem nicht gemounteten Dateisystem ausgefuehrt werden.',
    mistakes: [
      'xfs_repair auf einem gemounteten Dateisystem ausfuehren — dies verursacht Datenkorruption. Immer vorher unmounten.',
      'Nicht zuerst `mount -o ro` versuchen — wenn das Dateisystem nur Log-Replay benoetigt, bereinigt ein schreibgeschuetztes Mounten das Log ohne Reparatur.',
      '`-L` (Log-Nullung erzwingen) als erste Massnahme verwenden — dies verwirft ausstehende Log-Transaktionen und sollte nur verwendet werden, wenn normale Reparatur und Mounten fehlschlagen.',
    ],
    bestPractices: [
      'Das Dateisystem vor dem Ausfuehren unmounten: `umount /dev/sdX1 && xfs_repair /dev/sdX1`.',
      'Zuerst `xfs_repair -n` (Nur-Lesen-Modus) versuchen, um den Schaden zu bewerten, ohne Aenderungen vorzunehmen.',
      '`xfs_repair -L` nur als letzten Ausweg verwenden, nachdem alle wiederherstellbaren Daten gesichert wurden.',
    ],
  },

  // ─── SYSTEMUEBERWACHUNG ─────────────────────────────────────────

  dmesg: {
    useCases: [
      'Kernel-Meldungen fuer Hardware-Erkennung und Treiber-Laden anzeigen',
      'Hardware-Ausfaelle, USB-Geraeteprobleme oder Dateisystemfehler diagnostizieren',
      'Boot-Meldungen nach dem Systemstart pruefen',
    ],
    internals:
      'dmesg liest den Kernel-Ringpuffer, einen Ringpuffer fester Groesse (typischerweise 256 KB-1 MB), in dem der Kernel printk()-Meldungen speichert. Meldungen enthalten Zeitstempel, Log-Level und Subsystem-Identifikatoren. Wenn der Puffer voll ist, werden alte Meldungen ueberschrieben.',
    mistakes: [
      'Erwarten, dass dmesg ueber Neustarts hinweg bestehen bleibt — der Kernel-Ringpuffer ist flüchtig. `journalctl -k` fuer persistente Kernel-Logs verwenden.',
      'Nicht nach Level filtern — dmesg gibt alles aus. `dmesg -l err,warn` verwenden, um sich auf Probleme zu konzentrieren.',
      'Auf neueren Kerneln ohne Root ausfuehren — `dmesg_restrict`-Sysctl kann unprivilegierten Zugriff blockieren. sudo verwenden.',
    ],
    bestPractices: [
      '`dmesg -T` verwenden, um menschenlesbare Zeitstempel statt Sekunden seit Boot anzuzeigen.',
      '`dmesg -w` verwenden, um neue Kernel-Meldungen in Echtzeit zu verfolgen (wie `tail -f`).',
      'Nach Facility filtern: `dmesg --facility=kern` fuer nur Kernel-Meldungen.',
    ],
  },

  journalctl: {
    useCases: [
      'Systemd-Journal-Logs fuer jeden Dienst, jede Unit oder Boot-Sitzung abfragen',
      'Live-Log-Ausgabe von bestimmten Diensten verfolgen',
      'Fehler durch Filtern nach Zeitbereichen, Prioritaeten oder PIDs untersuchen',
      'Logs von vorherigen Boots fuer Post-Crash-Analyse anzeigen',
    ],
    internals:
      'journalctl liest binaere Journal-Dateien, die in /var/log/journal/ (persistent) oder /run/log/journal/ (flüchtig) gespeichert sind. Das Journal ist strukturiert und indexiert und ermoeglicht effizientes Filtern nach Unit, Prioritaet, Zeitstempel und beliebigen Feldern ohne grep.',
    mistakes: [
      'Das Journal nicht persistent machen — wenn /var/log/journal/ nicht existiert, gehen Logs beim Neustart verloren. Das Verzeichnis erstellen und systemd-journald neu starten.',
      'Alle Logs ohne Filter durchsuchen — auf ausgelasteten Systemen ist ungefilterte Ausgabe ueberwältigend. Immer nach Unit, Zeit oder Prioritaet filtern.',
      'Journal-Speicherverbrauch ignorieren — ohne Limits kann das Journal die Festplatte fuellen. `SystemMaxUse` in journald.conf konfigurieren.',
    ],
    bestPractices: [
      '`journalctl -u <dienst> -f` verwenden, um die Logs eines bestimmten Dienstes in Echtzeit zu verfolgen.',
      'Nach Prioritaet filtern: `journalctl -p err`, um nur Fehler und hoeher zu sehen.',
      'Logs vom letzten Boot anzeigen: `journalctl -b -1` fuer Post-Crash-Untersuchung.',
      'Groessenlimits in /etc/systemd/journald.conf mit `SystemMaxUse=500M` setzen.',
    ],
  },

  vmstat: {
    useCases: [
      'Einen schnellen Ueberblick ueber Speicher, Swap, CPU und I/O-Aktivitaet des Systems erhalten',
      'Systemleistung in regelmaessigen Intervallen ueberwachen',
      'Speicherdruck oder CPU-Saettigung identifizieren',
    ],
    internals:
      'vmstat liest /proc/stat, /proc/meminfo und /proc/vmstat, um CPU-, Speicher-, Swap- und I/O-Zaehler zu sammeln. Die erste Zeile zeigt Durchschnittswerte seit dem Boot; nachfolgende Zeilen (mit einem Intervall) zeigen Deltas pro Zeitraum.',
    mistakes: [
      'Die erste Zeile als aktuelle Werte lesen — die erste Zeile ist immer der Durchschnitt seit dem Boot. Nachfolgende Zeilen fuer Echtzeit-Daten betrachten.',
      'Die `si`/`so`-Spalten (Swap In/Out) ignorieren — Werte ungleich Null deuten auf aktives Swapping hin, was ein Zeichen fuer Speicherdruck ist.',
      'Kein Intervall und keine Anzahl angeben — `vmstat 1 10` liefert 10 Ein-Sekunden-Samples, was viel nuetzlicher ist als ein einzelner Snapshot.',
    ],
    bestPractices: [
      '`vmstat 1 10` fuer einen schnellen 10-Sekunden-Leistungs-Snapshot verwenden.',
      'Die `r`-Spalte (Run Queue) beobachten — Werte konstant hoeher als die CPU-Anzahl deuten auf CPU-Saettigung hin.',
      'Mit `iostat` fuer ein vollstaendiges Bild von CPU- und Festplattenleistung kombinieren.',
    ],
  },

  iostat: {
    useCases: [
      'Festplatten-I/O-Durchsatz und Latenz pro Geraet ueberwachen',
      'Identifizieren, welche Festplatte der Leistungsengpass ist',
      'CPU-Auslastung aufgeschluesselt nach User, System und I/O-Wait verfolgen',
    ],
    internals:
      'iostat liest /proc/diskstats und /proc/stat, um geraetespezifische I/O-Statistiken zu berechnen. Es meldet Lese-/Schreibraten, durchschnittliche Anfraggroessen, Queue-Tiefen und Servicezeiten. Teil des sysstat-Pakets.',
    mistakes: [
      'Den ersten Bericht als aktuell lesen — wie vmstat ist der erste Bericht seit dem Boot. Ein Intervall fuer Echtzeit-Daten verwenden.',
      '`%util` bei 100% auf SSDs ignorieren — %util ist weniger aussagekraeftig fuer SSDs und NVMe mit mehreren Queues. Stattdessen auf Latenz (await) fokussieren.',
      '`-x` fuer erweiterte Statistiken nicht verwenden — die Standardausgabe laesst kritische Felder wie await (Latenz) und Queue-Tiefe weg.',
    ],
    bestPractices: [
      '`iostat -xz 1` fuer erweiterte Statistiken mit Intervall verwenden, inaktive Geraete auslassen.',
      '`await` (durchschnittliche I/O-Latenz in ms) beobachten — hohe Werte deuten auf Speicher-Engpaesse hin.',
      '`iostat -p ALL` verwenden, um Statistiken fuer einzelne Partitionen zu sehen.',
    ],
  },

  lsof: {
    useCases: [
      'Herausfinden, welcher Prozess eine bestimmte Datei oder einen Port verwendet',
      'Prozesse identifizieren, die geloeschte Dateien offen halten (und Speicherplatzrueckgewinnung verhindern)',
      '"Address already in use"-Fehler debuggen, indem der Prozess auf einem Port gefunden wird',
      'Alle von einem bestimmten Prozess oder Benutzer geoeffneten Dateien auflisten',
    ],
    internals:
      'lsof liest /proc/<pid>/fd fuer jeden Prozess, um offene Dateideskriptoren aufzuzaehlen. Es loest diese zu Inodes, Socket-Infos und Netzwerkverbindungen auf. Es liest auch /proc/net/* fuer Socket-Zuordnungen.',
    mistakes: [
      'lsof ohne Argumente ausfuehren — es listet jede offene Datei im System auf, was extrem langsam sein und ueberwältigende Ausgabe produzieren kann.',
      'sudo vergessen — lsof kann ohne Root-Berechtigungen die Prozesse anderer Benutzer nicht sehen.',
      'Die `-i`-Syntax nicht kennen — `lsof -i :8080` (Doppelpunkt vor dem Port) verwenden, um Prozesse auf einem bestimmten Port zu finden.',
    ],
    bestPractices: [
      '`lsof -i :PORT` verwenden, um schnell zu finden, was auf einem Port lauscht.',
      '`lsof +D /pfad/` verwenden, um Prozesse mit offenen Dateien in einem Verzeichnis zu finden (nuetzlich vor dem Unmounten).',
      'Geloeschte, aber offene Dateien finden, die Speicherplatz verschwenden: `lsof +L1` listet Dateien mit null Link-Count auf.',
    ],
  },

  watch: {
    useCases: [
      'Einen Befehl wiederholt ausfuehren und seine Ausgabe in Echtzeit anzeigen',
      'Sich aendernde Werte wie Festplattennutzung, Prozessanzahlen oder Queue-Tiefen ueberwachen',
      'Auf das Erscheinen einer Bedingung warten, ohne manuell erneut auszufuehren',
    ],
    internals:
      'watch nutzt ncurses, um den Bildschirm zu loeschen, fuehrt den angegebenen Befehl ueber die Shell im gegebenen Intervall (Standard 2 Sekunden) aus und zeigt die Ausgabe erneut an. Mit `-d` werden Unterschiede zwischen aufeinanderfolgenden Ausfuehrungen hervorgehoben.',
    mistakes: [
      'Befehle mit Pipes oder Sonderzeichen nicht quotieren — `watch ls | grep foo` beobachtet nur `ls`. `watch "ls | grep foo"` mit Anfuehrungszeichen verwenden.',
      'Ein zu kurzes Intervall fuer aufwendige Befehle verwenden — `watch -n 0.1 du -sh /` belastet das Dateisystem uebermässig.',
      'Erwarten, dass watch mit interaktiven Befehlen funktioniert — watch erfasst nur stdout und hat keine Terminal-Interaktion.',
    ],
    bestPractices: [
      '`watch -d` verwenden, um Unterschiede zwischen Updates fuer einfache Aenderungserkennung hervorzuheben.',
      '`watch -n 5 "befehl"` fuer ein angemessenes Intervall verwenden, um Systemlast zu vermeiden.',
      'Mit `-g` (beenden bei Ausgabeaenderung) fuer geskriptetes Warten kombinieren: `watch -g "ls /pfad/zur/erwarteten-datei"`.',
    ],
  },

  nohup: {
    useCases: [
      'Einen Befehl ausfuehren, der nach dem Ausloggen aus SSH weiterlaeuft',
      'Langlebige Hintergrundprozesse starten, die gegen Hangup-Signale immun sind',
      'Daemons ueber die Kommandozeile ohne Service-Manager starten',
    ],
    internals:
      'nohup setzt die SIGHUP-Signal-Disposition auf Ignorieren, leitet stdout/stderr nach nohup.out um (wenn nicht bereits umgeleitet) und fuehrt dann den angegebenen Befehl aus. Der Prozess ueberlebt das Schliessen des Terminals, da er das HUP-Signal ignoriert, das beim Trennen des kontrollierenden Terminals gesendet wird.',
    mistakes: [
      '`&` anzuhaengen vergessen — `nohup befehl` laeuft immer noch im Vordergrund. `nohup befehl &` verwenden, um es in den Hintergrund zu verschieben.',
      'Ausgabe nicht umleiten — nohup schreibt in nohup.out im aktuellen Verzeichnis, das unbegrenzt wachsen kann.',
      'nohup verwenden, wenn screen/tmux verfuegbar ist — tmux bietet eine wiederherstellbare Sitzung, die wesentlich komfortabler ist.',
    ],
    bestPractices: [
      '`nohup befehl > /dev/null 2>&1 &` verwenden, um vollstaendig ohne Ausgabedatei abzukoppeln.',
      'tmux oder screen fuer interaktive Jobs bevorzugen, bei denen spaeteres Wiederanhaengen noetig ist.',
      '`disown` nach dem Hintergrundsetzen verwenden, falls nohup vergessen wurde: `befehl & disown`.',
    ],
  },

  strace: {
    useCases: [
      'Debuggen, warum ein Programm fehlschlaegt, indem seine Systemaufrufe verfolgt werden',
      'Identifizieren, welche Dateien ein Prozess oeffnet oder welche Netzwerkverbindungen er aufbaut',
      'Systemaufruf-Haeufigkeit und -Latenz fuer Leistungsanalyse profilen',
      'An einen laufenden Prozess anhaengen, um Haenger oder unerwartetes Verhalten zu diagnostizieren',
    ],
    internals:
      'strace nutzt den ptrace(2)-Systemaufruf, um jeden Syscall des verfolgten Prozesses abzufangen und aufzuzeichnen. Der Kernel stoppt den Tracee bei jedem Syscall-Eintritt und -Austritt, sodass strace Aufrufname, Argumente und Rueckgabewert protokollieren kann. Dies verursacht erheblichen Overhead (10-100x Verlangsamung).',
    mistakes: [
      'strace in Produktion verwenden, ohne den Overhead zu verstehen — ptrace fuegt erhebliche Latenz hinzu. perf oder eBPF fuer Produktions-Tracing verwenden.',
      'Nicht mit `-e` filtern — ungefilterte strace-Ausgabe ist enorm. `-e trace=file` oder `-e trace=network` zur Fokussierung verwenden.',
      '`-f` vergessen, wenn Programme verfolgt werden, die forken — Kindprozesse werden standardmaessig nicht verfolgt.',
    ],
    bestPractices: [
      '`-e trace=open,read,write` verwenden, um sich auf Datei-I/O-Aktivitaet zu konzentrieren.',
      'An einen laufenden Prozess mit `strace -p <PID> -f` fuer Live-Debugging anhaengen.',
      '`-c` fuer eine Syscall-Zusammenfassung (Anzahl und Zeit) statt vollstaendiger Trace-Ausgabe verwenden.',
      'Ausgabe mit `-o trace.log` in eine Datei umleiten fuer spaetere Analyse.',
    ],
  },

  sar: {
    useCases: [
      'Historische CPU-, Speicher-, Festplatten- und Netzwerkauslastung pruefen',
      'Leistungsprobleme mit bestimmten Tageszeiten korrelieren',
      'Taegliche/woechentliche Leistungsberichte fuer Kapazitaetsplanung generieren',
    ],
    internals:
      'sar liest binaere Datendateien, die vom sa1-Cron-Job gesammelt werden (der sadc, den System Activity Data Collector, ausfuehrt). Diese Dateien werden in /var/log/sa/ (oder /var/log/sysstat/) gespeichert. sadc sampelt Kernel-Zaehler in konfigurierbaren Intervallen und schreibt sie in die taegliche Datendatei.',
    mistakes: [
      'sysstat-Datensammlung nicht aktivieren — sar zeigt "Cannot open"-Fehler, weil die sa1/sa2-Cron-Jobs nicht konfiguriert sind.',
      'Nur CPU-Statistiken betrachten — sar hat viele Subsysteme. `-r` (Speicher), `-b` (I/O), `-n DEV` (Netzwerk) fuer vollstaendige Analyse verwenden.',
      'Kein Datum angeben — sar zeigt standardmaessig heute an. `-f /var/log/sa/sa<DD>` fuer historische Daten verwenden.',
    ],
    bestPractices: [
      'Den sysstat-Systemd-Timer oder Cron-Jobs fuer kontinuierliche Datensammlung aktivieren.',
      '`sar -u 1 10` fuer einen schnellen CPU-Auslastungs-Snapshot verwenden.',
      '`sar -n DEV -f /var/log/sa/sa15` verwenden, um Netzwerkaktivitaet vom 15. des Monats zu pruefen.',
      'Mehrere Flags kombinieren: `sar -u -r -b 1 5` fuer CPU, Speicher und I/O in einer Ansicht.',
    ],
  },

  nethogs: {
    useCases: [
      'Identifizieren, welche Prozesse die meiste Netzwerkbandbreite verbrauchen',
      'Pro-Prozess-Bandbreitennutzung in Echtzeit ueberwachen',
      'Unerwarteten Netzwerkverkehr von unbekannten Prozessen aufspueren',
    ],
    internals:
      'nethogs nutzt libpcap zum Erfassen von Paketen auf Netzwerk-Interfaces und korreliert sie mit Prozessen, indem Socket-Endpunkte in /proc/net/tcp und /proc/<pid>/fd abgeglichen werden. Es gruppiert Verkehr nach PID und zeigt Sende-/Empfangsraten pro Prozess an.',
    mistakes: [
      'Ohne Root ausfuehren — nethogs benoetigt Raw-Socket-Zugriff fuer Paketerfassung.',
      'Auf Multi-Homed-Systemen kein Interface angeben — `nethogs eth0` verwenden, um ein bestimmtes Interface anzusteuern.',
      'Genaue Gesamtwerte erwarten — nethogs verfolgt TCP-Verbindungen; UDP und andere Protokolle werden moeglicherweise nicht vollstaendig erfasst.',
    ],
    bestPractices: [
      '`nethogs -t` fuer Tracemode-Ausgabe (nicht-interaktiv) verwenden, die sich fuer Logging eignet.',
      'Das Interface angeben: `nethogs eth0`, um sich auf das relevante Netzwerk zu konzentrieren.',
      '`iftop` neben nethogs fuer eine Pro-Verbindung-Ansicht vs. Pro-Prozess-Ansicht verwenden.',
    ],
  },

  iftop: {
    useCases: [
      'Pro-Verbindung-Netzwerkbandbreite in Echtzeit ueberwachen',
      'Identifizieren, welche Remote-Hosts den meisten Verkehr senden/empfangen',
      'Netzwerkueberlastung durch Anzeige des aktiven Verbindungsdurchsatzes debuggen',
    ],
    internals:
      'iftop nutzt libpcap zum Erfassen von Paketen auf einem Interface und aggregiert Verkehr nach Quell-/Ziel-IP-Paaren. Es zeigt eine top-aehnliche Oberflaeche mit Balkendiagrammen, die 2-Sekunden-, 10-Sekunden- und 40-Sekunden-Verkehrsdurchschnitte anzeigen.',
    mistakes: [
      'Ohne Interface-Angabe ausfuehren — iftop waehlt moeglicherweise das falsche. `-i eth0` explizit verwenden.',
      'Prozess-Zuordnung erwarten — iftop zeigt Verbindungen, keine Prozesse. nethogs fuer Pro-Prozess-Daten verwenden.',
      '`-n` nicht verwenden, um DNS-Lookups zu deaktivieren — DNS-Aufloesung verlangsamt die Anzeige auf ausgelasteten Netzwerken erheblich.',
    ],
    bestPractices: [
      '`iftop -nNP -i eth0` verwenden, um numerische IPs, kein DNS und Portnummern fuer schnelle Identifikation anzuzeigen.',
      '`t` druecken, um zwischen ein- und zweizeiligem Anzeigemodus umzuschalten.',
      '`-F netz/maske` verwenden, um Verkehr zu/von einem bestimmten Subnetz zu filtern.',
    ],
  },

  mpstat: {
    useCases: [
      'Pro-CPU-Auslastung anzeigen, um unausgewogene Workloads zu erkennen',
      'Erkennen, ob ein Workload Single-Threaded ist (ein Kern maximal ausgelastet, andere im Leerlauf)',
      'CPU-Auslastungsaufschluesselung (User, System, iowait, Idle) pro Kern ueberwachen',
    ],
    internals:
      'mpstat liest Pro-CPU-Zaehler aus /proc/stat und meldet Auslastungsprozentsaetze fuer jede CPU. Teil des sysstat-Pakets. Es schlüsselt die Zeit in User, Nice, System, iowait, IRQ, softirq, Steal und Idle auf.',
    mistakes: [
      'Nur die aggregierte CPU betrachten — der Wert von mpstat sind Pro-Kern-Aufschluesselungen. `-P ALL` verwenden, um alle Kerne zu sehen.',
      '`%steal` auf virtuellen Maschinen ignorieren — hoher Steal zeigt, dass der Hypervisor die CPU-Zeit Ihrer VM drosselt.',
      'Kein Intervall verwenden — ein einzelner Snapshot ist weniger nuetzlich als eine Zeitreihe. `mpstat -P ALL 1 10` verwenden.',
    ],
    bestPractices: [
      '`mpstat -P ALL 1` verwenden, um alle CPUs mit Ein-Sekunden-Intervallen zu ueberwachen.',
      '`%iowait` pro Kern beobachten — hohe Werte deuten auf I/O-gebundene Prozesse hin, die an bestimmte Kerne gepinnt sind.',
      'Mit `pidstat` kombinieren, um Pro-CPU-Nutzung mit bestimmten Prozessen zu korrelieren.',
    ],
  },

  perf: {
    useCases: [
      'CPU-Nutzung auf Funktionsebene profilen, um Leistungs-Hotspots zu finden',
      'Hardware-Performance-Counter (Cache-Misses, Branch-Mispredictions) verfolgen',
      'Ausfuehrungstraces fuer Optimierungsarbeit aufzeichnen und analysieren',
      'Flame Graphs fuer visuelle Leistungsanalyse generieren',
    ],
    internals:
      'perf nutzt das Linux-perf_events-Subsystem, um CPU-Hardware-Performance-Counter (PMCs) und Software-Tracepoints zu programmieren. Es sampelt den Instruction Pointer mit konfigurierbarer Rate, loest Symbole aus Debug-Info auf und zeichnet Call-Stacks auf. Daten werden in perf.data-Dateien fuer Offline-Analyse geschrieben.',
    mistakes: [
      'Profiling ohne Debug-Symbole — Stack-Traces zeigen Hex-Adressen statt Funktionsnamen. -dbg/-debuginfo-Pakete installieren.',
      'Eine zu hohe Sampling-Rate verwenden — `perf record -F 99` (99 Hz) ist normalerweise ausreichend. Hoehere Raten erzeugen Overhead.',
      'Vergessen, dass `perf record` bis zur Unterbrechung laeuft — immer Ctrl+C zum Stoppen. `-g` fuer Call-Graphen verwenden.',
    ],
    bestPractices: [
      '`perf top` fuer eine live top-aehnliche Ansicht CPU-verbrauchender Funktionen verwenden.',
      'Mit Call-Graphen aufzeichnen: `perf record -g -p <PID>` dann `perf report`.',
      'Flame Graphs generieren: `perf script`-Ausgabe durch FlameGraph-Tools pipen.',
      '`perf stat <befehl>` fuer schnelle Hardware-Counter-Zusammenfassungen (IPC, Cache-Misses) verwenden.',
    ],
  },

  htop: {
    useCases: [
      'Prozesse interaktiv mit CPU-, Speicher- und I/O-Nutzung ueberwachen',
      'Prozesse von einer visuellen Oberflaeche aus suchen, filtern und Signale senden',
      'Pro-Kern-CPU-Nutzung und Speicheraufschluesselung auf einen Blick anzeigen',
    ],
    internals:
      'htop liest /proc/<pid>/stat, /proc/<pid>/status und /proc/meminfo, um Prozess- und Systemmetriken zu sammeln. Es nutzt ncurses fuer das TUI und aktualisiert in einem konfigurierbaren Intervall (Standard 1,5 Sekunden). Es kann Prozessbaeume anzeigen und unterstuetzt Maus-Interaktion.',
    mistakes: [
      'Prozesse mit dem falschen Signal beenden — htop nutzt standardmaessig SIGTERM (15). Manche Prozesse benoetigen SIGKILL (9), aber immer zuerst SIGTERM versuchen.',
      'Nach Speicher sortieren, ohne VIRT vs. RES zu verstehen — VIRT beinhaltet gemappten, aber ungenutzten Speicher. Nach RES (Resident) sortieren fuer tatsaechliche physische Speichernutzung.',
      'Die Baumansicht nicht verwenden — F5 druecken, um Eltern-Kind-Prozessbeziehungen zu sehen, was bei der Identifikation von Fork-Bombs oder unkontrollierten Spawnern hilft.',
    ],
    bestPractices: [
      'F5 fuer Baumansicht, F6 fuer Sortierspalte, F4 fuer Namensfilter druecken.',
      'Spalten im Setup (F2) anpassen, um I/O-Raten, Thread-Anzahlen oder cgroup-Infos anzuzeigen.',
      '`htop -u <benutzer>` verwenden, um nur die Prozesse eines Benutzers zu ueberwachen.',
    ],
  },

  atop: {
    useCases: [
      'System- und prozessbezogene Ressourcennutzung mit historischem Logging ueberwachen',
      'Vergangene Leistungsprobleme aus atops persistenten Logdateien analysieren',
      'Festplatten-I/O und Netzwerk-I/O pro Prozess verfolgen (anders als einfaches top)',
    ],
    internals:
      'atop liest Kernel-Zaehler aus /proc und nutzt das Netlink-Interface fuer Prozess-Accounting. Es schreibt Snapshots in komprimierte Logdateien in /var/log/atop/ in konfigurierbaren Intervallen (Standard 600 Sekunden ueber den atop-Service). Vergangene Snapshots koennen mit `atop -r` wiedergegeben werden.',
    mistakes: [
      'Den atop-Service nicht starten — ohne ihn werden keine historischen Daten gesammelt. `atop.service` fuer persistentes Logging aktivieren.',
      'Die Farbkodierung ignorieren — atop hebt kritische Ressourcen rot hervor. Auf rote Balken und Werte achten.',
      'Echtzeit-Pro-Prozess-Netzwerkstatistiken ohne das netatop-Kernelmodul erwarten — netatop fuer Pro-Prozess-Netzwerkaufschluesselungen installieren.',
    ],
    bestPractices: [
      'Den atop-Systemd-Service fuer kontinuierliches Hintergrund-Logging aktivieren.',
      '`atop -r /var/log/atop/atop_JJJJMMTT` verwenden, um historische Daten wiederzugeben, und `t`/`T` druecken, um durch Snapshots zu navigieren.',
      '`d` fuer Festplattenansicht, `n` fuer Netzwerkansicht, `m` fuer Speicheransicht waehrend der interaktiven Nutzung druecken.',
    ],
  },

  glances: {
    useCases: [
      'Einen umfassenden Systemueberblick in einem einzigen Terminalfenster erhalten',
      'Remote-Systeme ueber eine integrierte Web-Oberflaeche oder API ueberwachen',
      'Systemmetriken nach InfluxDB, Prometheus oder andere Backends exportieren',
    ],
    internals:
      'glances ist ein Python-basiertes Monitoring-Tool, das die psutil-Bibliothek nutzt, um Systemmetriken plattformuebergreifend zu lesen. Es aggregiert CPU, Speicher, Festplatte, Netzwerk, Prozesse, Container und Sensoren in einem einzelnen curses-basierten Dashboard. Es unterstuetzt Client-Server-Modus und REST-API-Export.',
    mistakes: [
      'Ohne optionale Abhaengigkeiten installieren — Funktionen wie Docker-Monitoring, GPU-Statistiken und Sensoren erfordern zusaetzliche Python-Pakete.',
      'glances im Web-Modus in einem nicht vertrauenswuerdigen Netzwerk ohne Authentifizierung ausfuehren — `--password` verwenden, um Auth zu aktivieren.',
      'Niedrigen Ressourcenverbrauch erwarten — glances verbraucht mehr CPU/Speicher als top/htop aufgrund von Python-Overhead. htop auf ressourcenbeschraenkten Systemen verwenden.',
    ],
    bestPractices: [
      '`glances -w` verwenden, um die Web-Oberflaeche fuer Remote-Monitoring zu starten.',
      'In Zeitreihen-Datenbanken exportieren: `glances --export influxdb2` fuer historische Dashboards.',
      '`glances -t 5` verwenden, um ein 5-Sekunden-Aktualisierungsintervall auf ausgelasteten Systemen zu setzen.',
    ],
  },

  pidstat: {
    useCases: [
      'CPU-, Speicher- oder I/O-Statistiken fuer bestimmte Prozesse ueberwachen',
      'Pro-Thread-CPU-Nutzung fuer Multi-Thread-Anwendungen verfolgen',
      'Pro-Prozess-I/O mit gesamtem System-I/O von iostat korrelieren',
    ],
    internals:
      'pidstat liest /proc/<pid>/stat und /proc/<pid>/io, um pro Prozess oder pro Thread Statistiken in regelmaessigen Intervallen zu melden. Es ist Teil des sysstat-Pakets und teilt das Datensammlungs-Framework von sadc.',
    mistakes: [
      '`-d` fuer Festplatten-I/O-Statistiken nicht verwenden — die Standardanzeige zeigt nur CPU. `-d` fuer I/O und `-r` fuer Speicher verwenden.',
      '`-t` fuer Pro-Thread-Statistiken vergessen — ohne dies werden Multi-Thread-App-Statistiken aggregiert.',
      'Keinen PID mit `-p` angeben — ohne dies zeigt pidstat alle Prozesse an, was unuebersichtlich sein kann.',
    ],
    bestPractices: [
      '`pidstat -u -d -r 1` fuer kombinierte CPU-, Festplatten- und Speicherstatistiken im 1-Sekunden-Intervall verwenden.',
      'Einen bestimmten Prozess ansteuern: `pidstat -p <PID> -t 1` fuer Pro-Thread-Aufschluesselung.',
      'Mit `strace -c`-Ausgabe kombinieren, um Syscall-Muster mit Ressourcennutzung zu korrelieren.',
    ],
  },
}
