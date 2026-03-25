import type { CommandExplanation } from '../types'

export const explanationsDeP1: Record<string, CommandExplanation> = {
  // ─── FILE MANAGEMENT (23) ───────────────────────────────────────────

  ls: {
    useCases: [
      'Dateien und Verzeichnisse im aktuellen oder angegebenen Pfad auflisten',
      'Dateiberechtigungen, Groessen und Aenderungsdaten im Langformat pruefen',
      'Versteckte Konfigurationsdateien (Dotfiles) in einem Verzeichnis finden',
    ],
    internals:
      'ls liest Verzeichniseintraege ueber den readdir-Systemaufruf und ruft stat fuer jede Datei auf, um Metadaten zu sammeln. Beim Sortieren nach Zeit oder Groesse wird stat fuer jeden Eintrag aufgerufen, was bei Verzeichnissen mit vielen Dateien langsam werden kann.',
    mistakes: [
      'Vergessen von -a, um versteckte Dateien (Namen mit Punkt am Anfang) zu sehen, wodurch wichtige Konfigurationsdateien uebersehen werden',
      'Parsen der ls-Ausgabe in Skripten statt find oder Glob-Expansion zu verwenden, was bei Dateinamen mit Leerzeichen oder Sonderzeichen fehlschlaegt',
      'Verwendung von ls -R bei sehr grossen Verzeichnisbaeumen, wenn find deutlich effizienter und skriptfaehiger waere',
    ],
    bestPractices: [
      'ls -lh fuer menschenlesbare Groessen und ls -lt fuer Sortierung nach Aenderungszeit verwenden',
      'In Skripten find oder Shell-Globbing statt ls-Ausgabe-Parsing bevorzugen',
      'ls --color=auto in interaktiven Shells fuer schnelle visuelle Unterscheidung von Dateitypen nutzen',
    ],
  },

  cd: {
    useCases: [
      'Zu einem anderen Verzeichnis im Dateisystem navigieren',
      'Schnell zum Home-Verzeichnis zurueckkehren mit cd oder cd ~',
      'Mit cd - zum vorherigen Verzeichnis wechseln',
    ],
    mistakes: [
      'Pfade mit Leerzeichen nicht in Anfuehrungszeichen setzen: cd "mein ordner" statt cd mein ordner verwenden',
      'cd in einer Subshell oder einem Skript verwenden und erwarten, dass die uebergeordnete Shell das Verzeichnis wechselt, was nicht passiert',
    ],
    bestPractices: [
      'cd - verwenden, um schnell zwischen zwei Verzeichnissen zu wechseln',
      'CDPATH-Variable setzen, um vollstaendige Pfade zu haeufig besuchten Verzeichnissen zu ueberspringen',
      'pushd/popd statt cd verwenden, wenn man zuverlaessig zu einem vorherigen Verzeichnis zurueckkehren muss',
    ],
  },

  pwd: {
    useCases: [
      'Den absoluten Pfad des aktuellen Arbeitsverzeichnisses ausgeben',
      'Den Standort vor dem Ausfuehren destruktiver Befehle wie rm -rf ueberpruefen',
      'Das aktuelle Verzeichnis in einer Variable fuer spaetere Verwendung im Skript speichern',
    ],
    bestPractices: [
      'pwd -P verwenden, um Symlinks aufzuloesen und den physischen Pfad zu erhalten',
      'In Skripten $PWD oder $(pwd) statt fest codierter Pfade fuer Portabilitaet bevorzugen',
    ],
  },

  cp: {
    useCases: [
      'Dateien oder Verzeichnisse fuer Backups oder Vorlagen duplizieren',
      'Dateien zwischen Verzeichnissen kopieren und dabei Metadaten beibehalten oder aktualisieren',
      'Erstellte Artefakte in ein Zielverzeichnis bereitstellen',
    ],
    internals:
      'cp oeffnet die Quelldatei zum Lesen und erstellt oder kuerzt die Zieldatei, dann kopiert es Daten in Bloecken. Mit -p werden auch Berechtigungen, Besitzer und Zeitstempel ueber chmod/chown/utime-Systemaufrufe kopiert.',
    mistakes: [
      'Vergessen von -r beim Kopieren von Verzeichnissen, wodurch cp diese stillschweigend ueberspringt oder einen Fehler ausgibt',
      'Ueberschreiben vorhandener Dateien ohne -i (interaktiv) oder -n (kein Ueberschreiben), was zu unerwartetem Datenverlust fuehrt',
      'Nicht -p oder -a verwenden, um Berechtigungen beizubehalten, was zu falschen Dateimodi im Ziel fuehrt',
    ],
    bestPractices: [
      'cp -a (Archiv) verwenden, um alle Attribute beizubehalten und rekursiv einschliesslich Symlinks zu kopieren',
      'cp -i verwenden, um vor dem Ueberschreiben vorhandener Dateien eine Bestaetigungsabfrage zu erhalten',
      'Fuer grosse Verzeichniskopien ueber Dateisysteme hinweg rsync fuer Wiederaufnahme und Fortschrittsanzeige in Betracht ziehen',
    ],
  },

  mv: {
    useCases: [
      'Eine Datei oder ein Verzeichnis umbenennen',
      'Dateien von einem Verzeichnis in ein anderes verschieben',
      'Projektstruktur durch Verschieben von Dateien reorganisieren',
    ],
    internals:
      'Auf demselben Dateisystem ruft mv einfach rename() auf, das Verzeichniseintraege aktualisiert, ohne Daten zu kopieren. Ueber Dateisystemgrenzen hinweg wird auf eine Kopier-dann-Loeschen-Operation zurueckgegriffen, was deutlich langsamer ist.',
    mistakes: [
      'Dateien ueber Dateisystemgrenzen verschieben, ohne zu wissen, dass dies eine vollstaendige Kopie ausloest, was bei grossen Dateien langsam sein kann',
      'Versehentliches Ueberschreiben einer bestehenden Datei am Zielort ohne -i zur Bestaetigungsabfrage',
      'Vergessen, dass mv auf einem Verzeichnis dieses umbenennt und Skripte, die den alten Pfad verwenden, beeintraechtigen kann',
    ],
    bestPractices: [
      'mv -i verwenden, um vor dem Ueberschreiben vorhandener Dateien nachzufragen',
      'mv -n (kein Ueberschreiben) bei Batch-Operationen verwenden, um unbeabsichtigtes Ueberschreiben zu vermeiden',
      'Beim Verschieben vieler Dateien eine for-Schleife oder find -exec statt Glob-Expansion verwenden',
    ],
  },

  rm: {
    useCases: [
      'Dateien oder Verzeichnisse loeschen, die nicht mehr benoetigt werden',
      'Temporaere Dateien oder Build-Artefakte aufraeumen',
      'Defekte Symlinks oder veraltete Lock-Dateien entfernen',
    ],
    internals:
      'rm ruft den unlink-Systemaufruf fuer Dateien auf, der den Verzeichniseintrag entfernt. Die Dateidaten werden erst freigegeben, wenn alle Hardlinks und offenen Dateideskriptoren geschlossen sind. Fuer Verzeichnisse wird rmdir nach rekursivem Unlinken des Inhalts verwendet.',
    mistakes: [
      'rm -rf mit einer Variable ausfuehren, die leer oder / sein koennte, was potenziell das gesamte Dateisystem loescht. Variablen immer vorher validieren.',
      'Vergessen, dass rm auf den meisten Linux-Systemen permanent ist. Es gibt keinen Papierkorb. Erwaegen Sie trash-cli oder einen Alias.',
      'rm -rf auf Symlink-Verzeichnisse anwenden, ohne zu verstehen, dass es dem Link folgt und den Zielinhalt loescht',
    ],
    bestPractices: [
      'rm -i fuer interaktive Bestaetigungsabfrage bei wichtigen Loeschvorgaengen verwenden',
      'Pfad mit echo oder ls ueberpruefen, bevor rm -rf ausgefuehrt wird',
      'In Skripten set -u verwenden, um nicht gesetzte Variablen abzufangen, die gefaehrliche rm-Befehle erzeugen koennten',
      'trash-cli oder gio trash als sicherere Alternativen zum permanenten Loeschen in Betracht ziehen',
    ],
  },

  mkdir: {
    useCases: [
      'Ein oder mehrere neue Verzeichnisse erstellen',
      'Projektverzeichnisstrukturen in einem Befehl einrichten',
      'Sicherstellen, dass ein erforderliches Verzeichnis existiert, bevor Dateien geschrieben werden',
    ],
    mistakes: [
      'Vergessen von -p beim Erstellen verschachtelter Verzeichnisse wie mkdir a/b/c, was fehlschlaegt wenn a/b nicht existiert',
      'Verzeichnisse mit Leerzeichen oder Sonderzeichen erstellen, ohne den Pfad in Anfuehrungszeichen zu setzen',
    ],
    bestPractices: [
      'Immer mkdir -p verwenden, um uebergeordnete Verzeichnisse bei Bedarf zu erstellen und Fehler zu vermeiden, wenn das Verzeichnis bereits existiert',
      '-m verwenden, um Berechtigungen bei der Erstellung zu setzen, z.B. mkdir -m 700 secrets',
      'Mit geschweiften Klammern kombinieren: mkdir -p project/{src,tests,docs} um mehrere Verzeichnisse auf einmal zu erstellen',
    ],
  },

  touch: {
    useCases: [
      'Schnell eine neue leere Datei erstellen',
      'Den Aenderungszeitstempel einer Datei aktualisieren, ohne ihren Inhalt zu aendern',
      'Platzhalter- oder Lock-Dateien in Skripten erstellen',
    ],
    internals:
      'touch ruft den utimensat-Systemaufruf auf, um Zugriffs- und Aenderungszeiten zu aktualisieren. Wenn die Datei nicht existiert, wird sie mit open() unter Standard-Berechtigungen erstellt.',
    mistakes: [
      'Annehmen, dass touch nur Dateien erstellt, obwohl es primaer Zeitstempel bestehender Dateien aktualisiert',
      'touch in Skripten verwenden, wo atomare Dateierstellung noetig ist. Stattdessen einen geeigneten Lock-Mechanismus nutzen.',
    ],
    bestPractices: [
      'touch -d oder touch -t verwenden, um einen bestimmten Zeitstempel statt der aktuellen Zeit zu setzen',
      'Zum Erstellen von Dateien mit bestimmtem Inhalt echo oder printf mit Umleitung in eine Datei bevorzugen',
    ],
  },

  find: {
    useCases: [
      'Dateien nach Name, Typ, Groesse, Aenderungszeit oder Berechtigungen suchen',
      'Befehle auf jede passende Datei mit -exec ausfuehren',
      'Alte Dateien aufraeumen, z.B. Logs aelter als 30 Tage loeschen',
      'Ueber Verzeichnisbaeume suchen, wenn grep allein nicht ausreicht',
    ],
    internals:
      'find durchlaeuft den Verzeichnisbaum mit opendir/readdir und wendet jedes Praedikat (Test) der Reihe nach an. Es verwendet Kurzschlussauswertung, daher verbessert das Voranstellen guenstigerer Tests die Leistung. Die -exec-Aktion forkt einen neuen Prozess pro Treffer, es sei denn man nutzt + zum Batchverarbeiten.',
    mistakes: [
      'Vergessen, das Muster in -name "*.txt" zu quotieren, wodurch die Shell es vor find per Glob expandiert',
      '-exec mit ; statt + verwenden bei vielen Dateien, wodurch pro Datei ein Prozess gestartet wird statt zu batchverarbeiten',
      'Kein Startverzeichnis angeben, was standardmaessig das aktuelle Verzeichnis nutzt und moeglicherweise unbeabsichtigte Orte durchsucht',
    ],
    bestPractices: [
      'Restriktivere Filter zuerst setzen (z.B. -type f vor -name) fuer schnellere Auswertung',
      '-exec ... + statt -exec ... ; verwenden, um Argumente zu batchverarbeiten und Prozess-Overhead zu reduzieren',
      '-print0 gepaart mit xargs -0 fuer Dateinamen mit Leerzeichen oder Sonderzeichen verwenden',
      'Mit -prune kombinieren, um Verzeichnisse zu ueberspringen, in die nicht abgestiegen werden soll',
    ],
  },

  cat: {
    useCases: [
      'Den Inhalt kleiner Dateien im Terminal anzeigen',
      'Mehrere Dateien zu einer Ausgabe oder Datei verketten',
      'Dateiinhalt per Pipe an andere Befehle zur Weiterverarbeitung uebergeben',
    ],
    internals:
      'cat liest jede Datei sequenziell mit read-Systemaufrufen und schreibt auf stdout. Es ist bewusst einfach gehalten und fuehrt keine Formatierung oder Paginierung durch.',
    mistakes: [
      'cat verwenden, um eine einzelne Datei in eine Pipe zu leiten (ueberfluessige Verwendung von cat). Stattdessen Eingabeumleitung nutzen: grep pattern < file',
      'cat auf grosse Binaerdateien anwenden, was das Terminal mit unlesbaren Zeichen ueberflutet',
      'Vergessen, dass cat file1 file2 > file1 die file1 vor dem Lesen kuerzt und deren Inhalt verliert',
    ],
    bestPractices: [
      'cat -n verwenden, um Zeilennummern zum Debuggen anzuzeigen',
      'less oder bat zum interaktiven Lesen grosser Dateien statt cat verwenden',
      'Eingabeumleitung (< file) statt cat file | bevorzugen, wenn eine einzelne Datei in einen Befehl geleitet wird',
    ],
  },

  head: {
    useCases: [
      'Die ersten Zeilen einer Datei schnell ansehen',
      'Datei-Header, Spaltennamen in CSVs oder Format vor der Verarbeitung pruefen',
      'Ausgabe einer Pipe auf die ersten N Zeilen begrenzen',
    ],
    internals:
      'head liest aus der Datei oder stdin, bis die angeforderte Anzahl an Zeilen oder Bytes ausgegeben wurde, und schliesst dann die Eingabe. Bei Piping sendet dies SIGPIPE an den vorgelagerten Befehl und stoppt ihn fruehzeitig.',
    mistakes: [
      'Nicht wissen, dass man die Zeilenanzahl mit -n angeben kann; Standard sind 10, was zu wenig oder zu viel sein kann',
      'Vergessen von head -c fuer byte-basierte statt zeilenbasierte Extraktion',
    ],
    bestPractices: [
      'head -n 1 verwenden, um schnell die erste Zeile zu holen, nuetzlich fuer CSV-Header',
      'Mit tail kombinieren, um einen Bereich zu extrahieren: head -n 20 file | tail -n 5 liefert Zeilen 16 bis 20',
    ],
  },

  tail: {
    useCases: [
      'Die letzten N Zeilen einer Datei ansehen, typischerweise Log-Dateien',
      'Einer wachsenden Log-Datei in Echtzeit mit tail -f folgen',
      'Eine Header-Zeile ueberspringen und den Rest einer Datei verarbeiten',
    ],
    internals:
      'tail springt ans Ende der Datei und liest rueckwaerts, um die angeforderte Anzahl an Zeilen zu finden. Mit -f verwendet es inotify (Linux) oder kqueue (macOS), um auf neue angehaengte Daten zu warten.',
    mistakes: [
      'tail -f auf einer Log-Datei verwenden, die rotiert wird, ohne tail -F zu nutzen, das die Datei nach Rotation neu oeffnet',
      'Vergessen von tail -n +2 zum Ueberspringen einer Header-Zeile; stattdessen tail -n -1 verwenden, was nur die letzte Zeile liefert',
    ],
    bestPractices: [
      'tail -F (grosses F) verwenden, um Log-Dateien zu folgen, die rotiert werden koennten',
      'tail -n +N verwenden, um ab Zeile N zu drucken, nuetzlich zum Ueberspringen von Headern',
      'Mit grep kombinieren, um Logs auf bestimmte Muster zu ueberwachen: tail -F app.log | grep ERROR',
    ],
  },

  ln: {
    useCases: [
      'Symbolische Links erstellen, um Dateien oder Verzeichnisse von einem anderen Ort zu referenzieren',
      'Versionierte Deployments mit einem current-Symlink auf das aktive Release einrichten',
      'Hardlinks erstellen, um Dateidaten ohne Duplizierung auf demselben Dateisystem zu teilen',
    ],
    internals:
      'Symbolische Links erstellen eine neue Inode, die einen Pfad-String zum Ziel speichert. Hardlinks fuegen einen neuen Verzeichniseintrag hinzu, der auf dieselbe Inode wie das Ziel zeigt und die eigentlichen Datenbloecke teilt. Hardlinks koennen keine Dateisystemgrenzen ueberschreiten.',
    mistakes: [
      'Verwechslung der Argumentreihenfolge: es ist ln -s ziel linkname, nicht umgekehrt',
      'Versuchen, Hardlinks auf Verzeichnisse zu erstellen, was auf den meisten Systemen nicht erlaubt ist',
      'Relative Symlinks erstellen, ohne zu wissen, dass sie relativ zum Link-Standort aufgeloest werden, nicht zum aktuellen Verzeichnis',
    ],
    bestPractices: [
      'ln -sf verwenden, um einen bestehenden Symlink atomar zu ersetzen',
      'Symbolische Links gegenueber Hardlinks fuer Klarheit und dateisystemuebergreifende Kompatibilitaet bevorzugen',
      'Absolute Pfade fuer Symlinks verwenden, die verschoben werden koennten, oder bewusst relative Pfade fuer portable Baeume',
    ],
  },

  less: {
    useCases: [
      'Grosse Dateien lesen und durchnavigieren, ohne sie vollstaendig in den Speicher zu laden',
      'Interaktiv im Dateiinhalt suchen mit / und ?',
      'Befehlsausgabe seitenweise ansehen, wenn sie die Terminalhoehe ueberschreitet',
    ],
    internals:
      'less liest die Datei bei Bedarf und puffert nur das fuer die Anzeige Noetige. Es nutzt termcap/terminfo fuer die Terminalsteuerung und unterstuetzt Rueckwaertsnavigation durch einen Puffer zuvor gelesener Daten.',
    mistakes: [
      'Die Such-Shortcuts nicht kennen: / fuer Vorwaertssuche, ? fuer Rueckwaertssuche, n/N zum Wiederholen',
      'Vergessen, less -R zu verwenden, um farbige Ausgabe von Befehlen wie grep --color korrekt anzuzeigen',
    ],
    bestPractices: [
      'LESS="-R" in der Umgebung setzen, um ANSI-Farbcodes immer korrekt zu behandeln',
      'less +F verwenden, um den Follow-Modus zu aktivieren (wie tail -f), und Ctrl+C zum Stoppen druecken',
      'v in less druecken, um die Datei im Standard-Editor zu oeffnen',
    ],
  },

  tree: {
    useCases: [
      'Verzeichnisstruktur als eingeruecktes Baumdiagramm visualisieren',
      'Verzeichnislisten fuer Dokumentation oder README-Dateien generieren',
      'Schnell die Ordnungstiefe und Organisation eines Projekts pruefen',
    ],
    mistakes: [
      'tree auf einem sehr grossen Verzeichnis ohne Tiefenlimit ausfuehren, was ueberwaetigende Ausgabe erzeugt',
      'Vergessen, mit -I node_modules, .git oder andere grosse Verzeichnisse auszufiltern',
    ],
    bestPractices: [
      'tree -L 2 verwenden, um die Tiefe zu begrenzen und die Ausgabe uebersichtlich zu halten',
      'tree -I "node_modules|.git" verwenden, um haeufige grosse Verzeichnisse zu ignorieren',
      'tree -a verwenden, um versteckte Dateien einzubeziehen, und tree --dirsfirst, um Verzeichnisse vor Dateien aufzulisten',
    ],
  },

  rename: {
    useCases: [
      'Dateien per Batch mit Perl-regulaeren Ausdruecken umbenennen',
      'Dateiendungen fuer eine Reihe von Dateien in einem Befehl aendern',
      'Namenskonventionen ueber ein Verzeichnis von Dateien hinweg standardisieren',
    ],
    internals:
      'Der Perl-rename-Befehl wertet einen Perl-Ausdruck gegen jeden Dateinamen aus und ruft rename() auf, um die Transformation anzuwenden. Er ist nicht identisch mit dem util-linux-rename, der einfache String-Ersetzung verwendet.',
    mistakes: [
      'Verwechslung des Perl-rename (prename) mit dem util-linux-rename, die voellig unterschiedliche Syntax haben',
      'Vergessen, -n (Trockenlauf) zuerst zu verwenden, um Aenderungen vor dem tatsaechlichen Umbenennen zu pruefen',
      'Spezielle Regex-Zeichen in Dateinamen nicht escapen, was unbeabsichtigte Treffer verursacht',
    ],
    bestPractices: [
      'Immer zuerst rename -n ausfuehren, um Aenderungen vor dem Anwenden zu pruefen',
      'rename an einem Testsatz von Dateien verwenden, bevor es auf ein ganzes Verzeichnis angewendet wird',
      'Das Perl-rename (prename) fuer komplexe musterbasierte Umbenennungen bevorzugen',
    ],
  },

  realpath: {
    useCases: [
      'Symbolische Links und relative Pfade zu einem absoluten kanonischen Pfad aufloesen',
      'Den tatsaechlichen Speicherort einer Datei fuer Skripte ermitteln, die deterministische Pfade benoetigen',
      'Ueberpruefen, wohin ein Symlink tatsaechlich zeigt',
    ],
    bestPractices: [
      'realpath --relative-to=DIR verwenden, um relative Pfade zwischen zwei Orten zu berechnen',
      'In Skripten realpath verwenden, um vom Benutzer angegebene Pfade vor der Verarbeitung zu normalisieren',
    ],
  },

  basename: {
    useCases: [
      'Den Dateinamen aus einem vollstaendigen Pfad extrahieren und den Verzeichnisteil entfernen',
      'Eine Dateiendung fuer die Generierung von Ausgabe-Dateinamen in Skripten entfernen',
      'Pfade in Schleifen verarbeiten, um nur die Dateikomponente zu isolieren',
    ],
    bestPractices: [
      'basename mit einem Suffix-Argument verwenden, um Endungen zu entfernen: basename file.tar.gz .tar.gz liefert file',
      'In bash ${var##*/} fuer denselben Effekt ohne Starten eines Subprozesses bevorzugen',
    ],
  },

  rmdir: {
    useCases: [
      'Leere Verzeichnisse sicher entfernen, im Gegensatz zu rm -rf, das auch Inhalte loescht',
      'Leere Verzeichnisse aufraeumen, nachdem deren Inhalte verschoben oder geloescht wurden',
      'Ueberpruefen, ob ein Verzeichnis leer ist, da rmdir bei nicht-leeren Verzeichnissen fehlschlaegt',
    ],
    mistakes: [
      'Erwarten, dass rmdir Verzeichnisse mit Inhalt entfernt. Es entfernt nur leere Verzeichnisse.',
      '-p nicht verwenden, um uebergeordnete Verzeichnisse zu entfernen, die nach Entfernen des Kindverzeichnisses leer werden',
    ],
    bestPractices: [
      'rmdir -p verwenden, um ein Verzeichnis und seine leeren uebergeordneten Verzeichnisse in einem Schritt zu entfernen',
      'rmdir statt rm -rf bevorzugen, wenn bewusst bei nicht-leeren Verzeichnissen als Sicherheitspruefung fehlgeschlagen werden soll',
    ],
  },

  dirname: {
    useCases: [
      'Den Verzeichnisteil aus einem vollstaendigen Dateipfad extrahieren',
      'Das uebergeordnete Verzeichnis eines Skripts ermitteln, um relative Ressourcen zu finden',
      'Pfade dynamisch in Shell-Skripten zusammenbauen',
    ],
    bestPractices: [
      'In Skripten DIR=$(dirname "$0") verwenden, um das Verzeichnis des aktuell laufenden Skripts zu finden',
      'In bash ${var%/*} fuer denselben Effekt ohne Starten eines Subprozesses bevorzugen',
    ],
  },

  chroot: {
    useCases: [
      'Einen Prozess mit einem alternativen Root-Dateisystem zur Isolation ausfuehren',
      'Ein defektes System reparieren, indem man von einem Live-USB in dessen gemountetes Dateisystem chrootet',
      'Leichtgewichtige Sandboxen fuer Software-Erstellung oder Tests einrichten',
    ],
    internals:
      'chroot ruft den chroot()-Systemaufruf auf, der das Root-Verzeichnis fuer den aufrufenden Prozess und seine Kindprozesse aendert. Es bietet keine vollstaendige Isolation wie Container. Prozesse koennen ein chroot verlassen, wenn sie Root-Rechte haben.',
    mistakes: [
      'Erwarten, dass chroot eine Sicherheitsgrenze ist. Ein Root-Benutzer innerhalb eines chroot kann daraus ausbrechen.',
      'Vergessen, wesentliche Dateien innerhalb des chroot einzurichten wie /dev, /proc und benoetigte Bibliotheken',
      'DNS-Resolver-Konfiguration (/etc/resolv.conf) nicht binden oder kopieren, was zu fehlender Netzwerk-Namensaufloesung fuehrt',
    ],
    bestPractices: [
      '/proc, /sys und /dev vor dem Chrooten mounten, um eine funktionsfaehige Umgebung zu erhalten',
      'unshare oder Container statt chroot verwenden, wenn tatsaechliche Sicherheitsisolation benoetigt wird',
      'Benoetigte Shared Libraries und Binaries in das chroot kopieren oder per Bind-Mount einbinden',
    ],
  },

  mktemp: {
    useCases: [
      'Eine temporaere Datei oder ein Verzeichnis mit eindeutigem Namen sicher erstellen',
      'Race Conditions vermeiden, wenn mehrere Skripte gleichzeitig temporaere Dateien benoetigen',
      'Zwischenergebnisse in Skripten speichern, die nach Abschluss aufraeumen',
    ],
    internals:
      'mktemp generiert einen eindeutigen Namen mit einem zufaelligen Suffix und erstellt die Datei atomar mit exklusiven Open-Flags (O_EXCL), was Race Conditions zwischen Namensgenerierung und Dateierstellung verhindert.',
    mistakes: [
      'Temporaere Dateien nach Gebrauch nicht aufraeumen und Unordnung in /tmp hinterlassen',
      'Temporaere Dateinamen fest codieren statt mktemp zu verwenden, was Race-Condition-Schwachstellen erzeugt',
    ],
    bestPractices: [
      'Ergebnis immer in einer Variable speichern: TMPFILE=$(mktemp) und einen Trap zum Aufraeumen bei Beendigung einrichten',
      'mktemp -d verwenden, um ein temporaeres Verzeichnis zu erstellen, wenn mehrere temporaere Dateien benoetigt werden',
      'Einen Trap einrichten: trap "rm -f $TMPFILE" EXIT, um Aufraeumen auch bei Fehlern sicherzustellen',
    ],
  },

  install: {
    useCases: [
      'Dateien kopieren und dabei Berechtigungen, Besitzer und Verzeichnisse in einem Schritt setzen',
      'Binaries mit korrekten Modus-Bits in Systemverzeichnisse bei make install bereitstellen',
      'Das gaengige Muster von mkdir + cp + chmod durch einen einzelnen atomaren Befehl ersetzen',
    ],
    internals:
      'install kombiniert die Funktionalitaet von cp, mkdir -p, chmod und chown in einem einzigen Befehl. Es kopiert die Datei und setzt dann die angegebenen Attribute. Es erstellt immer eine neue Kopie, niemals einen Hardlink.',
    mistakes: [
      'install auf Verzeichnisse anwenden, die bereits Dateien enthalten, die behalten werden sollen, da es nicht zusammenfuehrt',
      'Vergessen, -m fuer den Dateimodus anzugeben, der standardmaessig 755 ist',
    ],
    bestPractices: [
      'install -D verwenden, um alle fuehrenden Verzeichnisse automatisch zu erstellen',
      '-m explizit fuer Klarheit angeben: install -m 644 config.conf /etc/myapp/',
      'install -o und -g verwenden, um Besitzer und Gruppe in einem Schritt bei der Bereitstellung zu setzen',
    ],
  },

  // ─── NETWORKING (28) ────────────────────────────────────────────────

  ping: {
    useCases: [
      'Grundlegende Netzwerkkonnektivitaet zu einem Host testen',
      'Round-Trip-Latenz zu einem Server messen',
      'DNS-Aufloesungsprobleme diagnostizieren, indem ein Hostname vs. eine IP gepingt wird',
    ],
    internals:
      'ping sendet ICMP-Echo-Request-Pakete an den Zielhost und wartet auf Echo-Reply-Pakete. Es berechnet die Round-Trip-Zeit aus der Zeitstempeldifferenz. Root oder setuid ist typischerweise erforderlich, da Raw Sockets verwendet werden.',
    mistakes: [
      'Annehmen, dass ein Host ausgefallen ist, weil ping fehlschlaegt, obwohl der Host moeglicherweise einfach ICMP-Verkehr blockiert',
      'ping unter Linux ohne -c ausfuehren, was endlos pingt, bis manuell gestoppt wird',
    ],
    bestPractices: [
      'ping -c 4 verwenden, um eine feste Anzahl von Pings zu senden und Zusammenfassungsstatistiken zu erhalten',
      'ping -W verwenden, um ein Timeout fuer nicht reagierende Hosts zu setzen, damit der Befehl nicht haengt',
      'Gegen eine bekannte IP wie 8.8.8.8 neben einem Hostnamen testen, um DNS-Probleme von Netzwerkproblemen zu unterscheiden',
    ],
  },

  curl: {
    useCases: [
      'HTTP-Anfragen stellen, um APIs zu testen und Webinhalte herunterzuladen',
      'POST-, PUT- und andere HTTP-Methoden mit benutzerdefinierten Headern und Bodies senden',
      'HTTP-Antworten einschliesslich Header, Statuscodes und Timing debuggen',
      'Dateien aus dem Web mit Wiederaufnahme-Unterstuetzung herunterladen',
    ],
    internals:
      'curl nutzt libcurl fuer Protokollaushandlung, TLS-Handshakes, Verbindungs-Pooling und Datentransfer. Es unterstuetzt ueber 25 Protokolle einschliesslich HTTP, FTP, SMTP und SCP. Weiterleitungen werden standardmaessig nicht verfolgt.',
    mistakes: [
      'Vergessen von -L zum Folgen von Weiterleitungen, wodurch eine 301/302-Antwort statt des tatsaechlichen Inhalts erhalten wird',
      'Nicht -o oder -O beim Herunterladen von Dateien verwenden, wodurch binaerer Inhalt ins Terminal geschrieben wird',
      'Sensible Daten auf der Kommandozeile uebergeben, wo sie in Prozesslisten erscheinen. Stattdessen --data @file verwenden.',
    ],
    bestPractices: [
      'curl -sS fuer Skripting verwenden: Stiller Modus, aber Fehler werden trotzdem angezeigt',
      'curl -w fuer detaillierte Timing-Informationen zum Performance-Debugging verwenden',
      '-H fuer benutzerdefinierte Header und -d fuer POST-Daten verwenden',
      '--fail (-f) in Skripten verwenden, um bei HTTP-Fehlern einen Nicht-Null-Exit-Code zurueckzugeben',
    ],
  },

  wget: {
    useCases: [
      'Dateien aus dem Web mit automatischem Retry bei Fehlern herunterladen',
      'Komplette Webseiten fuer Offline-Browsing spiegeln',
      'Dateien im Hintergrund mit Wiederaufnahme-Unterstuetzung herunterladen',
    ],
    internals:
      'wget verarbeitet HTTP-, HTTPS- und FTP-Protokolle. Es unterstuetzt rekursives Herunterladen durch Parsen von HTML-Links. Es schreibt standardmaessig direkt auf die Festplatte, was es speichereffizient fuer grosse Downloads macht.',
    mistakes: [
      'Rekursives Herunterladen ohne Tiefenlimit verwenden, wodurch potenziell eine gesamte Website heruntergeladen wird',
      '--no-clobber oder --continue nicht verwenden, wodurch bereits vorhandene Dateien erneut heruntergeladen werden',
      'Vergessen, --user-agent zu setzen, wenn Server Standard-wget-Anfragen blockieren',
    ],
    bestPractices: [
      'wget -c verwenden, um unterbrochene Downloads fortzusetzen',
      'wget -q fuer stillen Modus in Skripten oder -nv fuer nicht-verbose Fortschritt verwenden',
      '--retry-connrefused und --waitretry fuer widerstandsfaehige Downloads in automatisierten Skripten setzen',
    ],
  },

  ssh: {
    useCases: [
      'Sichere Verbindung zu entfernten Servern fuer die Administration herstellen',
      'Befehle auf entfernten Maschinen ohne interaktive Sitzung ausfuehren',
      'Sichere Tunnel erstellen, um auf Dienste hinter Firewalls zuzugreifen',
      'Ports weiterleiten, um entfernte Dienste lokal verfuegbar zu machen',
    ],
    internals:
      'ssh baut einen verschluesselten Kanal ueber einen Schluesselaustausch auf (typischerweise Diffie-Hellman), authentifiziert den Server ueber seinen Host-Key und dann den Benutzer ueber Passwort oder Public Key. Die gesamte Kommunikation wird mit symmetrischen Chiffren wie AES verschluesselt.',
    mistakes: [
      'Den Host-Key-Fingerprint bei der ersten Verbindung nicht ueberpruefen, was anfaellig fuer MITM-Angriffe macht',
      'Zu offene Berechtigungen fuer private Schluessel setzen. SSH erfordert 600 oder strenger fuer Schluesseldateien.',
      'Vergessen, ssh-agent oder Key-Forwarding zu verwenden und Passphrasen wiederholt einzugeben',
    ],
    bestPractices: [
      'SSH-Key-Authentifizierung statt Passwoerter fuer bessere Sicherheit und Komfort verwenden',
      'Haeufig genutzte Verbindungen in ~/.ssh/config fuer kuerzere Befehle konfigurieren',
      'ssh -L fuer lokale Portweiterleitung und -R fuer Reverse-Portweiterleitung verwenden',
      'ssh -J fuer Jump-Hosts (ProxyJump) statt mehrerer manueller Sprunge verwenden',
    ],
  },

  scp: {
    useCases: [
      'Dateien zwischen lokalen und entfernten Maschinen ueber SSH kopieren',
      'Dateien sicher uebertragen, wenn rsync nicht verfuegbar ist',
      'Schnelle einmalige Dateiuebertragungen zu/von Servern',
    ],
    internals:
      'scp nutzt das SSH-Protokoll fuer die Datenuebertragung, baut eine verschluesselte Verbindung auf und kopiert dann Dateidaten hindurch. Das Legacy-SCP-Protokoll wurde in modernem OpenSSH intern durch SFTP ersetzt.',
    mistakes: [
      'Vergessen von -r zum rekursiven Kopieren von Verzeichnissen',
      'scp fuer grosse oder haeufige Uebertragungen verwenden, wenn rsync durch Delta-Transfers effizienter waere',
      'Entfernte Pfade mit Leerzeichen oder Sonderzeichen nicht quotieren',
    ],
    bestPractices: [
      'rsync oder sftp gegenueber scp fuer grosse Uebertragungen bevorzugen, da sie Wiederaufnahme und Delta-Sync unterstuetzen',
      '-C fuer Kompression bei langsamen Verbindungen verwenden',
      'scp -P (grosses P) verwenden, um einen nicht-standardmaessigen SSH-Port anzugeben',
    ],
  },

  netstat: {
    useCases: [
      'Alle aktiven Netzwerkverbindungen und lauschenden Ports auflisten',
      'Ermitteln, welcher Prozess einen bestimmten Port verwendet',
      'Netzwerk-Interface-Statistiken und Routing-Tabellen anzeigen',
    ],
    internals:
      'netstat liest unter Linux aus /proc/net/, um TCP-, UDP- und Unix-Socket-Informationen zu sammeln. Es ordnet Socket-Inodes Prozessen zu, indem es /proc/*/fd durchsucht. Auf modernen Systemen wird ss bevorzugt, da es direkt ueber Kernel-Netlink-Sockets liest.',
    mistakes: [
      'Ohne sudo ausfuehren, was Prozessnamen und PIDs fuer Sockets anderer Benutzer verbirgt',
      'netstat auf modernen Systemen verwenden, wo ss dieselben Informationen schneller und detaillierter liefert',
    ],
    bestPractices: [
      'netstat -tulnp verwenden, um TCP/UDP-lauschende Ports mit Prozessnamen und numerischen Adressen zu sehen',
      'ss gegenueber netstat auf modernen Linux-Systemen fuer bessere Leistung bevorzugen',
      'netstat -s fuer Protokoll-Statistiken bei der Diagnose von Netzwerkproblemen verwenden',
    ],
  },

  traceroute: {
    useCases: [
      'Netzwerkpfadprobleme diagnostizieren, indem jeder Hop zwischen Ihnen und einem Ziel angezeigt wird',
      'Erkennen, wo Paketverlust oder hohe Latenz in der Route auftritt',
      'Routing-Aenderungen ueberpruefen oder unerwartete Netzwerkpfade erkennen',
    ],
    internals:
      'traceroute sendet Pakete mit schrittweise steigenden TTL-Werten ab 1. Jeder Router auf dem Pfad verringert die TTL und sendet eine ICMP-Time-Exceeded-Nachricht zurueck, wenn sie Null erreicht, wodurch seine Adresse sichtbar wird. Das endgueltige Ziel antwortet normal.',
    mistakes: [
      'Annehmen, dass Sternchen (*) bedeuten, dass ein Router ausgefallen ist, obwohl viele Router so konfiguriert sind, dass sie nicht auf traceroute-Probes antworten',
      'Nicht wissen, dass traceroute unter Linux standardmaessig UDP verwenden kann, aber unter macOS ICMP, was unterschiedliche Ergebnisse liefert',
    ],
    bestPractices: [
      'mtr statt traceroute fuer kontinuierliche Pfadueberwachung mit Statistiken verwenden',
      'Sowohl UDP (-U) als auch ICMP (-I) ausprobieren, wenn viele Timeouts auftreten, da einige Router ein Protokoll filtern, aber nicht das andere',
      'traceroute -n verwenden, um DNS-Lookups fuer schnellere Ergebnisse zu ueberspringen',
    ],
  },

  ifconfig: {
    useCases: [
      'IP-Adressen und Netzwerk-Interface-Konfiguration anzeigen',
      'Netzwerk-Interfaces manuell aktivieren oder deaktivieren',
      'Interface-Statistiken wie Paketzaehler und Fehler pruefen',
    ],
    internals:
      'ifconfig verwendet ioctl-Systemaufrufe (SIOCGIFADDR, SIOCGIFFLAGS usw.), um Netzwerk-Interfaces abzufragen und zu konfigurieren. Es ist Teil des veralteten net-tools-Pakets und unterstuetzt keine neueren Netzwerkfunktionen.',
    mistakes: [
      'ifconfig auf modernem Linux verwenden, wo es zugunsten des ip-Befehls veraltet ist',
      'Erwarten, dass ifconfig-Aenderungen ueber Neustarts hinweg bestehen bleiben, ohne Netzwerk-Konfigurationsdateien zu bearbeiten',
    ],
    bestPractices: [
      'Den ip-Befehl statt ifconfig auf modernen Linux-Systemen fuer mehr Funktionen und bessere Ausgabe verwenden',
      'ifconfig nur auf aelteren Systemen oder macOS verwenden, wo ip moeglicherweise nicht verfuegbar ist',
      'Fuer persistente Netzwerkkonfiguration die entsprechenden Konfigurationsdateien bearbeiten oder NetworkManager/netplan verwenden',
    ],
  },

  dig: {
    useCases: [
      'DNS-Eintraege fuer eine Domain abfragen (A, AAAA, MX, NS, TXT, CNAME usw.)',
      'DNS-Aufloesungsprobleme debuggen und Propagierung von DNS-Aenderungen pruefen',
      'DNSSEC-Signaturen und Vertrauenskette ueberpruefen',
    ],
    internals:
      'dig erstellt DNS-Anfragepakete und sendet sie an den angegebenen oder systemkonfigurierten Resolver. Es zeigt die rohe DNS-Antwort einschliesslich aller Sektionen (Frage, Antwort, Autoritaet, Zusatz) und Timing-Informationen an.',
    mistakes: [
      'Den Standard-System-Resolver abfragen statt einen autoritativen Server, wenn die DNS-Propagierung geprueft wird',
      'Den Eintragstyp nicht explizit angeben, was standardmaessig A ist und MX, TXT oder andere Eintraege verpasst',
    ],
    bestPractices: [
      'dig +short fuer knappe Ausgabe verwenden, wenn nur die Antwort benoetigt wird',
      'Autoritative Nameserver direkt abfragen mit dig @ns1.example.com example.com, um den Cache zu umgehen',
      'dig +trace verwenden, um die vollstaendige Delegierungskette ab den Root-Servern zu verfolgen',
      'dig -x fuer Reverse-DNS-Lookups (PTR-Eintraege) verwenden',
    ],
  },

  nslookup: {
    useCases: [
      'Schnelle DNS-Lookups, wenn dig nicht verfuegbar ist',
      'Interaktive DNS-Abfragen mit mehreren Abfragen in einer Sitzung',
      'Einfache Vorwaerts- und Rueckwaerts-DNS-Aufloesungspruefungen',
    ],
    internals:
      'nslookup sendet DNS-Abfragen aehnlich wie dig, aber mit einem einfacheren Ausgabeformat. Es kann im interaktiven Modus laufen, in dem Abfragetyp und Server fuer mehrere Lookups gesetzt werden koennen.',
    mistakes: [
      'Sich beim Skripting auf das nslookup-Ausgabeformat verlassen, wenn dig +short zuverlaessiger und besser parsbar ist',
      'Nicht wissen, dass nslookup seine eigene Resolver-Bibliothek nutzt, nicht den System-Resolver, was andere Ergebnisse als host oder getent liefern kann',
    ],
    bestPractices: [
      'dig gegenueber nslookup fuer detailliertes DNS-Troubleshooting bevorzugen',
      'nslookup -type=mx domain.com verwenden, um bestimmte Eintragstypen abzufragen',
      'nslookup fuer schnelle Ad-hoc-Lookups verwenden, wo dig ueberdimensioniert ist',
    ],
  },

  host: {
    useCases: [
      'Einfache DNS-Lookups mit sauberer Ausgabe durchfuehren',
      'Schnelle Reverse-DNS-Lookups fuer IP-Adressen',
      'Pruefen, ob eine Domain nach DNS-Aenderungen korrekt aufloest',
    ],
    bestPractices: [
      'host fuer schnelle Lookups und dig fuer detailliertes Troubleshooting verwenden',
      'host -t verwenden, um den Eintragstyp anzugeben: host -t MX example.com',
      'host IP_ADRESSE fuer schnelle Reverse-DNS-Lookups verwenden',
    ],
  },

  whois: {
    useCases: [
      'Domain-Registrierungsdetails und Ablaufdaten nachschlagen',
      'Den Besitzer oder Registrar eines Domainnamens finden',
      'IP-Adresszuweisung und Netzwerkbesitz pruefen',
    ],
    mistakes: [
      'Vollstaendige Besitzerdetails erwarten, wenn viele Domains Datenschutz-Services verwenden',
      'Den falschen whois-Server fuer nicht-standardmaessige TLDs abfragen',
    ],
    bestPractices: [
      'whois verwenden, um Domain-Ablaufdaten zu pruefen, bevor sie verfallen',
      'Mit dig kombinieren, um ein vollstaendiges Bild einer Domain und ihrer DNS-Konfiguration zu erhalten',
    ],
  },

  rsync: {
    useCases: [
      'Dateien effizient zwischen lokalen und entfernten Verzeichnissen synchronisieren',
      'Inkrementelle Backups erstellen, die nur geaenderte Daten uebertragen',
      'Verzeichnisse mit Loeschung von Dateien spiegeln, die in der Quelle entfernt wurden',
      'Grosse Datensaetze mit Wiederaufnahme-Unterstuetzung bei unterbrochenen Verbindungen uebertragen',
    ],
    internals:
      'rsync verwendet einen Delta-Transfer-Algorithmus, der rollende Pruefsummen auf beiden Seiten berechnet und nur die Unterschiede sendet. Fuer neue Dateien wird die gesamte Datei uebertragen. Es kommuniziert fuer entfernte Uebertragungen standardmaessig ueber SSH.',
    mistakes: [
      'Den abschliessenden Schraegstrich beim Quellverzeichnis vergessen, was aendert, ob das Verzeichnis selbst oder sein Inhalt synchronisiert wird',
      '--delete ohne vorherigen Trockenlauf verwenden, wodurch versehentlich Dateien am Zielort entfernt werden',
      'Nicht -a (Archiv-Modus) verwenden und dabei Berechtigungen, Zeitstempel oder Symlinks bei der Uebertragung verlieren',
    ],
    bestPractices: [
      'Immer -a (Archiv) verwenden, um Dateiattribute beizubehalten und rekursiv zu kopieren',
      'rsync -n (Trockenlauf) vor der Verwendung von --delete ausfuehren, um zu pruefen, was entfernt wird',
      'rsync -avz fuer komprimierte, ausfuehrliche Uebertragungen mit vollstaendiger Attributbeibehaltung verwenden',
      '--exclude verwenden, um Dateien wie .git oder node_modules zu ueberspringen',
    ],
  },

  nc: {
    useCases: [
      'TCP/UDP-Konnektivitaet zu einem bestimmten Host und Port testen',
      'Einfache Client-Server-Verbindungen zum Debuggen erstellen',
      'Dateien zwischen Maschinen uebertragen, ohne einen vollstaendigen Dienst einzurichten',
      'Ports scannen, um zu pruefen, welche Dienste laufen',
    ],
    internals:
      'netcat (nc) oeffnet rohe TCP- oder UDP-Sockets und verbindet stdin/stdout mit dem Netzwerk-Stream. Es kann sowohl als Client als auch als Server (mit -l) arbeiten, was es extrem vielseitig fuer Ad-hoc-Netzwerke macht.',
    mistakes: [
      'Einen lauschenden nc-Prozess unbeabsichtigt laufen lassen, was eine offene Hintertuer erzeugt',
      'Die verschiedenen netcat-Implementierungen (GNU, OpenBSD, ncat) verwechseln, die unterschiedliche Flags haben',
      '-u fuer UDP vergessen, wenn UDP-Dienste getestet werden',
    ],
    bestPractices: [
      'nc -zv fuer schnelles Port-Scanning verwenden: nc -zv host 80 testet, ob Port 80 offen ist',
      'ncat (von nmap) fuer eine funktionsreichere und konsistentere netcat-Implementierung verwenden',
      'Ein Timeout mit -w setzen, um bei nicht reagierenden Verbindungen nicht zu haengen',
    ],
  },

  iptables: {
    useCases: [
      'Firewall-Regeln zum Erlauben oder Blockieren von Datenverkehr auf einem Linux-System konfigurieren',
      'Portweiterleitung und NAT fuer Datenverkehr-Routing einrichten',
      'Eingehende Verbindungen protokollieren und Raten-begrenzen, um Missbrauch zu verhindern',
    ],
    internals:
      'iptables verbindet sich mit dem Netfilter-Framework im Linux-Kernel. Regeln sind in Tabellen (filter, nat, mangle) und Ketten (INPUT, OUTPUT, FORWARD) organisiert. Der Kernel wertet Pakete der Reihe nach gegen Regeln aus und wendet die erste zutreffende Regel an.',
    mistakes: [
      'Eine DROP-Regel fuer SSH hinzufuegen, bevor sichergestellt ist, dass Konsolenzugang besteht, wodurch man sich vom Server aussperrt',
      'Vergessen, Regeln mit iptables-save zu speichern, wodurch alle Aenderungen beim Neustart verloren gehen',
      'Regeln in der falschen Reihenfolge einfuegen, da iptables Regeln von oben nach unten verarbeitet und bei der ersten Uebereinstimmung stoppt',
    ],
    bestPractices: [
      'Immer eine Regel fuer bestehende/zugehoerige Verbindungen beibehalten: -m state --state ESTABLISHED,RELATED -j ACCEPT',
      'iptables-save und iptables-restore oder einen persistenten Dienst verwenden, um Neustarts zu ueberstehen',
      'Auf modernen Linux-Systemen nftables als Nachfolger von iptables in Betracht ziehen',
      'Regeln in einer lokalen/Konsolen-Sitzung testen, bevor sie remote angewendet werden, um Aussperrung zu vermeiden',
    ],
  },

  arp: {
    useCases: [
      'Den ARP-Cache anzeigen, um IP-zu-MAC-Adress-Zuordnungen im lokalen Netzwerk zu sehen',
      'Netzwerkprobleme durch doppelte IP-Adressen oder ARP-Spoofing diagnostizieren',
      'Manuell statische ARP-Eintraege hinzufuegen oder entfernen',
    ],
    internals:
      'ARP (Address Resolution Protocol) ordnet IPv4-Adressen MAC-Adressen in lokalen Netzwerken zu. Der arp-Befehl liest unter Linux aus /proc/net/arp. Eintraege verfallen nach einem Timeout (typischerweise 15-20 Minuten) und werden bei Bedarf aktualisiert.',
    mistakes: [
      'arp auf modernen Systemen verwenden, wo der ip-neigh-Befehl bevorzugt wird',
      'Nicht wissen, dass ARP nur fuer Hosts im selben Netzwerksegment funktioniert',
    ],
    bestPractices: [
      'ip neigh statt arp auf modernen Linux-Systemen verwenden',
      'arp -a verwenden, um alle zwischengespeicherten Eintraege zur Fehlerbehebung lokaler Netzwerkkonnektivitaet anzuzeigen',
    ],
  },

  tcpdump: {
    useCases: [
      'Netzwerkpakete zur Fehlerbehebung erfassen und analysieren',
      'Protokollprobleme in der Client-Server-Kommunikation debuggen',
      'Datenverkehr auf bestimmten Ports oder Interfaces in Echtzeit ueberwachen',
      'Paketmitschnitte fuer spaetere Analyse in Wireshark speichern',
    ],
    internals:
      'tcpdump verwendet libpcap, um das Netzwerk-Interface in den Promiscuous-Modus zu versetzen und Pakete ueber den Kernel-Paketfilter (BPF) zu erfassen. Es dekodiert Protokoll-Header und zeigt sie in einem lesbaren Format an.',
    mistakes: [
      'Ohne Filter erfassen und von irrelevantem Datenverkehr ueberwaeltigt werden',
      'tcpdump auf einem stark genutzten Interface ohne Begrenzung der Erfassungsanzahl (-c) oder Groesse ausfuehren, was die Festplatte fuellt',
      'Vergessen, -w zu verwenden, um Mitschnitte fuer spaetere Analyse zu speichern, wenn die Live-Ausgabe zu schnell scrollt',
    ],
    bestPractices: [
      'Immer BPF-Filter verwenden, um den Erfassungsumfang zu begrenzen: tcpdump -i eth0 port 443 and host 10.0.0.1',
      'Mitschnitte mit -w file.pcap fuer detaillierte Analyse in Wireshark speichern',
      '-n verwenden, um DNS-Aufloesung fuer schnellere Ausgabe zu ueberspringen, und -c um die Paketanzahl zu begrenzen',
      '-A oder -X verwenden, um Paketinhalte in ASCII oder Hex zum Debuggen von Anwendungsprotokollen anzuzeigen',
    ],
  },

  nmap: {
    useCases: [
      'Einen Host oder ein Netzwerk scannen, um offene Ports und laufende Dienste zu erkennen',
      'Die eigene Infrastruktur auf unbeabsichtigt exponierte Dienste pruefen',
      'Betriebssystem- und Dienstversionen auf entfernten Maschinen erkennen',
    ],
    internals:
      'nmap sendet speziell erstellte Pakete (SYN, ACK, FIN usw.) und analysiert Antworten, um Portzustaende (offen, geschlossen, gefiltert) zu ermitteln. Es nutzt Timing-Algorithmen, um Geschwindigkeit und Genauigkeit auszubalancieren, und kann OS und Dienste anhand von Antwortmustern identifizieren.',
    mistakes: [
      'Netzwerke scannen, die man nicht besitzt oder fuer die man keine Genehmigung hat, was potenziell illegal ist',
      'Aggressives Timing (-T5) in Produktionsnetzwerken verwenden, was Stoerungen verursacht oder IDS-Alarme ausloest',
      'Nicht als Root ausfuehren, was nmap auf TCP-Connect-Scans statt schnellere SYN-Scans beschraenkt',
    ],
    bestPractices: [
      'Nur Netzwerke scannen, die man besitzt oder fuer die man ausdrueckliche Genehmigung hat',
      '-sV fuer Dienstversions-Erkennung und -O fuer OS-Erkennung verwenden',
      'Mit -sn (Ping-Scan) zur Host-Erkennung beginnen, bevor detaillierte Port-Scans durchgefuehrt werden',
      '--top-ports 1000 verwenden, um die haeufigsten Ports schnell zu scannen',
    ],
  },

  ss: {
    useCases: [
      'Alle aktiven Netzwerkverbindungen und lauschenden Sockets auflisten',
      'Herausfinden, welcher Prozess einen bestimmten Port verwendet',
      'Socket-Statistiken fuer Leistungsoptimierung ueberwachen',
    ],
    internals:
      'ss fragt den Kernel direkt ueber Netlink-Sockets ab, was deutlich schneller ist als netstat, das /proc/net-Dateien liest. Es kann detaillierte TCP-Zustandsinformationen einschliesslich Staukontroll- und Timer-Daten anzeigen.',
    mistakes: [
      '-p-Flag nicht verwenden (erfordert Root), um Prozessinformationen zu sehen',
      'Aus Gewohnheit netstat verwenden, wenn ss dieselben Daten schneller liefert',
    ],
    bestPractices: [
      'ss -tulnp als Ersatz fuer netstat -tulnp verwenden, um lauschende Ports mit Prozessinfo aufzulisten',
      'ss -s fuer eine schnelle Zusammenfassung der Socket-Statistiken verwenden',
      'Mit ss state filtern, um Sockets in bestimmten TCP-Zustaenden anzuzeigen: ss state established',
    ],
  },

  ip: {
    useCases: [
      'Netzwerk-Interfaces, Adressen und Routen auf modernem Linux konfigurieren',
      'Die Routing-Tabelle anzeigen und aendern',
      'ARP/Neighbor-Cache und Netzwerk-Namespaces verwalten',
    ],
    internals:
      'Der ip-Befehl von iproute2 nutzt Netlink-Sockets, um direkt mit dem Kernel-Netzwerk-Stack zu kommunizieren, was effizienter und funktionsreicher ist als die ioctl-basierten Legacy-Tools (ifconfig, route, arp).',
    mistakes: [
      'Adressen ohne Angabe einer Subnetzmaske hinzufuegen, was standardmaessig /32 ergibt, was selten gewuenscht ist',
      'Erwarten, dass ip-Befehlsaenderungen ueber Neustarts hinweg bestehen bleiben, ohne NetworkManager, netplan oder Konfigurationsdateien zu verwenden',
    ],
    bestPractices: [
      'ip addr statt ifconfig zum Anzeigen und Verwalten von IP-Adressen verwenden',
      'ip route statt route fuer Routing-Tabellenverwaltung verwenden',
      'ip link verwenden, um Interface-Zustand (up/down) und Eigenschaften zu verwalten',
      'ip -c (Farbe) fuer besser lesbare Ausgabe und ip -br fuer Kurzformat verwenden',
    ],
  },

  mtr: {
    useCases: [
      'Den Netzwerkpfad zu einem Host mit Echtzeit-Statistiken kontinuierlich ueberwachen',
      'Intermittierenden Paketverlust oder Latenzspitzen entlang einer Route erkennen',
      'Einen umfassenden Netzwerkpfadbericht fuer Support-Tickets erstellen',
    ],
    internals:
      'mtr kombiniert die Funktionalitaet von ping und traceroute. Es sendet kontinuierlich Probes mit steigenden TTL-Werten und berechnet Pro-Hop-Statistiken einschliesslich Verlustprozentsatz, durchschnittlicher Latenz, Jitter und Standardabweichung.',
    mistakes: [
      'mtr zu kurz laufen lassen, um intermittierende Probleme zu erkennen. Mindestens eine Minute laufen lassen.',
      'Den --report-Modus nicht verwenden, wenn Ergebnisse geteilt werden, da die interaktive Ansicht nicht einfach kopiert werden kann',
    ],
    bestPractices: [
      'mtr --report -c 100 fuer einen sauberen Textbericht verwenden, der sich zum Teilen mit ISPs oder Netzwerk-Teams eignet',
      'mtr in beide Richtungen ausfuehren (vom und zum Problemhost), um asymmetrische Routing-Probleme zu erkennen',
      'mtr -T verwenden, um TCP statt ICMP zu nutzen, wenn ICMP gefiltert wird',
    ],
  },

  sftp: {
    useCases: [
      'Dateien interaktiv ueber eine verschluesselte SSH-Verbindung uebertragen',
      'Entfernte Dateien durchsuchen und verwalten, wenn mehr als scp benoetigt wird',
      'Dateien sicher von Servern hoch- und herunterladen, die nur SFTP erlauben',
    ],
    internals:
      'SFTP fuehrt das SSH2-Dateitransferprotokoll ueber eine SSH-Verbindung aus. Im Gegensatz zu FTP verwendet es eine einzige verschluesselte Verbindung fuer Befehle und Daten. Das Protokoll ist binaer und umfasst Operationen zum Lesen von Verzeichnissen, stat, open, read, write und mehr.',
    mistakes: [
      'SFTP mit FTPS (FTP ueber TLS) verwechseln. Es sind voellig unterschiedliche Protokolle.',
      'Den Batch-Modus (-b) fuer automatisierte Uebertragungen in Skripten nicht verwenden',
    ],
    bestPractices: [
      'sftp -b batchfile fuer automatisierte geskriptete Uebertragungen verwenden',
      'rsync gegenueber sftp fuer Verzeichnis-Synchronisation bevorzugen, da rsync Deltas behandelt',
      'get -r und put -r fuer rekursive Verzeichnisuebertragungen verwenden',
    ],
  },

  bridge: {
    useCases: [
      'Netzwerk-Bridge-Interfaces verwalten, die mehrere Netzwerksegmente verbinden',
      'Die MAC-Adress-Weiterleitungstabelle anzeigen und konfigurieren',
      'VLAN-Filterung auf Bridge-Ports einrichten',
    ],
    internals:
      'Der bridge-Befehl von iproute2 verwaltet das Linux-Kernel-Bridge-Device ueber Netlink. Eine Bridge arbeitet auf Layer 2, leitet Ethernet-Frames zwischen Ports basierend auf gelernten MAC-Adressen weiter und fungiert im Wesentlichen als Software-Switch.',
    mistakes: [
      'brctl (Legacy) mit dem bridge-Befehl (modernes iproute2) verwechseln',
      'STP (Spanning Tree Protocol) nicht aktivieren, wenn mehrere Bridges verbunden werden, was Broadcast-Stuerme riskiert',
    ],
    bestPractices: [
      'bridge statt dem veralteten brctl von bridge-utils verwenden',
      'bridge fdb show verwenden, um die MAC-Weiterleitungsdatenbank zu inspizieren',
      'STP aktivieren, wenn mehrere Netzwerksegmente gebrückt werden, um Schleifen zu verhindern',
    ],
  },

  ethtool: {
    useCases: [
      'Hardware-Einstellungen von Netzwerk-Interfaces anzeigen und konfigurieren',
      'Verbindungsgeschwindigkeit, Duplex-Modus und Treiberinformationen pruefen',
      'Hardware-Offloading-Funktionen zur Fehlerbehebung aktivieren oder deaktivieren',
    ],
    internals:
      'ethtool kommuniziert mit Netzwerk-Geraetetreibern ueber ioctl-Aufrufe, um NIC-Parameter (Netzwerk-Interface-Karte) abzufragen und zu aendern. Es kann auf treiberspezifische Funktionen, Register-Dumps und EEPROM-Daten zugreifen.',
    mistakes: [
      'Offload-Einstellungen auf Produktions-Interfaces ohne Tests aendern, was potenziell Konnektivitaetsprobleme verursacht',
      'ethtool -i nicht fuer Treiberinformationen pruefen, bevor NIC-Probleme gemeldet werden',
    ],
    bestPractices: [
      'ethtool -i fuer Treiber- und Firmware-Info, -S fuer NIC-Statistiken und -k fuer Offload-Einstellungen verwenden',
      'ethtool verwenden, um Autonegotiation und Verbindungseinstellungen bei der Diagnose langsamer Netzwerkverbindungen zu ueberpruefen',
      'ethtool -S auf Fehlerzaehler pruefen, wenn Paketverlust diagnostiziert wird',
    ],
  },

  socat: {
    useCases: [
      'Bidirektionale Datenkanaele zwischen zwei Adressen (Sockets, Dateien, Pipes) erstellen',
      'TCP/UDP-Relays und Proxies einrichten',
      'TLS-Verbindungen testen oder Ad-hoc-verschluesselte Tunnel erstellen',
      'Serielle Geraete ueber das Netzwerk verbinden',
    ],
    internals:
      'socat oeffnet zwei bidirektionale Byte-Streams (Adressen genannt) und uebertraegt Daten zwischen ihnen. Es unterstuetzt eine breite Palette von Adresstypen einschliesslich TCP, UDP, Unix-Sockets, SSL, EXEC, PTY und Dateien. Es ist im Wesentlichen eine leistungsfaehigere Version von netcat.',
    mistakes: [
      'Von der komplexen Adress-Syntax ueberfordert werden. Mit einfachen TCP-Beispielen beginnen und aufbauen.',
      'Vergessen, dass socat standardmaessig bidirektionale Verbindungen erstellt, was moeglicherweise nicht gewuenscht ist',
    ],
    bestPractices: [
      'socat als leistungsfaehigeren Ersatz fuer nc verwenden, wenn Funktionen wie SSL oder Adress-Rewriting benoetigt werden',
      'Zum TLS-Testen: socat - OPENSSL:host:443, um interaktiv eine Verbindung zu einem HTTPS-Server herzustellen',
      'socat fuer transparentes TCP-Proxying verwenden: socat TCP-LISTEN:8080,fork TCP:target:80',
    ],
  },

  httpie: {
    useCases: [
      'HTTP-Anfragen mit einer intuitiveren Syntax als curl stellen',
      'REST-APIs schnell mit formatierter und farbiger Ausgabe testen und debuggen',
      'JSON-Payloads mit einfacher key=value-Syntax senden',
    ],
    internals:
      'HTTPie ist ein Python-basierter HTTP-Client, der auf der requests-Bibliothek aufbaut. Es formatiert JSON-Ausgabe automatisch, faerbt Antworten ein und handelt Content-Type-Aushandlung. Es unterstuetzt Sitzungen, Plugins und Authentifizierungsschemata.',
    mistakes: [
      'Den http-Befehl fuer HTTPS-URLs verwenden und verwirrt werden. HTTPie behandelt beides, aber https fuer Klarheit verwenden.',
      'Nicht wissen, dass = String-Werte sendet, waehrend := rohe JSON-Werte im Request-Body sendet',
    ],
    bestPractices: [
      'http fuer schnelles API-Testing und curl fuer Skripting und Automatisierung verwenden',
      ':= fuer nicht-String-JSON-Werte verwenden: http POST api/users age:=30 admin:=true',
      '--session verwenden, um Cookies und Authentifizierung ueber mehrere Anfragen hinweg beizubehalten',
    ],
  },

  bandwhich: {
    useCases: [
      'Echtzeit-Netzwerkbandbreiten-Nutzung pro Prozess ueberwachen',
      'Ermitteln, welche Anwendungen die meiste Bandbreite verbrauchen',
      'Bandbreiten-Aufschluesselung nach Remote-Host und Verbindung anzeigen',
    ],
    internals:
      'bandwhich erfasst Pakete mit libpcap, ordnet Netzwerkverbindungen Prozessen zu, indem es /proc/net und /proc/pid-Daten liest, und aggregiert Bandbreitennutzung in einer Terminal-Oberflaeche. Root-Rechte sind fuer die Paketerfassung erforderlich.',
    mistakes: [
      'Nicht mit sudo ausfuehren, was fuer Paketerfassung und Prozesszuordnung erforderlich ist',
      'Erwarten, dass es historische Daten anzeigt. Es ueberwacht nur Echtzeit-Datenverkehr.',
    ],
    bestPractices: [
      'Mit sudo bandwhich fuer vollstaendige Prozess-Sichtbarkeit ausfuehren',
      'Tab verwenden, um zwischen verschiedenen Ansichten zu wechseln: Gesamt, Pro-Prozess und Pro-Verbindung',
      '-i verwenden, um ein Netzwerk-Interface anzugeben, wenn mehrere vorhanden sind',
    ],
  },

  'wget-advanced': {
    useCases: [
      'Webseiten mit Tiefenkontrolle und Domain-Beschraenkungen spiegeln',
      'Dateien hinter Authentifizierung mit Cookies oder Anmeldedaten herunterladen',
      'Grosse Batch-Downloads mit Ratenbegrenzung planen',
    ],
    internals:
      'wget nutzt rekursives HTML-Parsing, um verlinkte Ressourcen beim Spiegeln zu entdecken. Es respektiert standardmaessig robots.txt und unterstuetzt HTTP, HTTPS und FTP mit eingebauter Retry-Logik, Proxy-Support und Bandbreitendrosselung.',
    mistakes: [
      'Spiegeln ohne --restrict-file-names, um Sonderzeichen in URLs zu behandeln',
      '--limit-rate nicht verwenden, um den Zielserver nicht zu ueberlasten oder die eigene Bandbreite zu saettigen',
      '--convert-links beim Spiegeln fuer Offline-Ansicht vergessen, was defekte interne URLs hinterlaesst',
    ],
    bestPractices: [
      'wget --mirror -p --convert-links fuer offline-taugliche Seitenspiegelungen verwenden',
      'Ratenbegrenzung mit --limit-rate=200k setzen, um zum Server ruecksichtsvoll zu sein',
      '--warc-file verwenden, um WARC-Archive fuer ordnungsgemaesse Web-Archivierung zu erstellen',
      '--accept und --reject kombinieren, um Dateitypen bei rekursiven Downloads zu filtern',
    ],
  },

  // ─── SYSTEM INFO (16) ──────────────────────────────────────────────

  uname: {
    useCases: [
      'Kernel-Version und Betriebssystemtyp pruefen',
      'Die Systemarchitektur ermitteln (x86_64, ARM usw.)',
      'Portable Skripte schreiben, die Verhalten basierend auf OS oder Architektur anpassen',
    ],
    internals:
      'uname ruft den uname()-Systemaufruf auf, der eine Struktur mit Systemname, Knotenname, Release, Version und Maschinenarchitektur zurueckgibt. Der Kernel fuellt diese Werte zur Kompilier-/Boot-Zeit.',
    mistakes: [
      'uname -a in Skripten verwenden und die vollstaendige Ausgabe parsen, die zwischen Systemen variiert. Stattdessen spezifische Flags wie -s, -r oder -m verwenden.',
    ],
    bestPractices: [
      'uname -s fuer OS-Name, -r fuer Kernel-Release, -m fuer Architektur verwenden',
      'In Skripten case-Anweisungen auf uname -s-Ausgabe verwenden, um Linux, Darwin (macOS) und andere Betriebssysteme zu behandeln',
    ],
  },

  hostname: {
    useCases: [
      'Den Systemhostnamen anzeigen oder setzen',
      'Den FQDN (Fully Qualified Domain Name) der Maschine nachschlagen',
      'Die dem Hostnamen zugeordnete IP-Adresse ermitteln',
    ],
    mistakes: [
      'Den Hostnamen setzen, ohne auch /etc/hostname und /etc/hosts zu aktualisieren, was nach Neustart zu Inkonsistenzen fuehrt',
      'Hostname mit dem DNS-Namen verwechseln, den externe Systeme verwenden, um die Maschine zu erreichen',
    ],
    bestPractices: [
      'hostname -f fuer den FQDN und hostname -I fuer alle IP-Adressen verwenden',
      'hostnamectl auf systemd-Systemen fuer persistente Hostnamen-Aenderungen verwenden',
    ],
  },

  uptime: {
    useCases: [
      'Pruefen, wie lange das System seit dem letzten Neustart laeuft',
      'Aktuelle Load-Averages anzeigen, um die Systemauslastung einzuschaetzen',
      'Schnell ueberpruefen, ob ein Server waehrend eines Vorfalls kuerzlich neugestartet wurde',
    ],
    internals:
      'uptime liest unter Linux aus /proc/uptime, das zwei Werte enthaelt: Gesamtsekunden seit dem Boot und gesamte Leerlaufsekunden ueber alle CPUs. Load-Averages stammen aus /proc/loadavg.',
    bestPractices: [
      'uptime -p fuer ein menschenlesbares Dauerformat unter Linux verwenden',
      'Load-Averages relativ zur Anzahl der CPU-Kerne interpretieren. Ein Load von 4.0 ist bei einem 8-Kern-System in Ordnung.',
    ],
  },

  df: {
    useCases: [
      'Festplattennutzung und verfuegbaren Speicherplatz auf gemounteten Dateisystemen pruefen',
      'Speicherkapazitaet ueberwachen, bevor Operationen ausgefuehrt werden, die Festplattenplatz benoetigen',
      'Ermitteln, auf welchem Dateisystem ein Verzeichnis liegt',
    ],
    internals:
      'df ruft den statfs- oder statvfs-Systemaufruf auf jedem gemounteten Dateisystem auf, um Blockzaehlungen (gesamt, frei, verfuegbar) abzurufen. Die verfuegbaren Bloecke unterscheiden sich von freien Bloecken, da etwas Speicherplatz fuer den Root-Benutzer reserviert ist.',
    mistakes: [
      '-h fuer menschenlesbare Ausgabe nicht verwenden und Schwierigkeiten bei der Interpretation roher Blockzaehlungen haben',
      'Freien Speicherplatz mit verfuegbarem Speicherplatz verwechseln. df zeigt den fuer Nicht-Root-Benutzer verfuegbaren Platz, der geringer ist als der gesamte freie Platz.',
    ],
    bestPractices: [
      'df -h fuer menschenlesbare Groessen und df -T verwenden, um den Dateisystemtyp einzubeziehen',
      'df -i verwenden, um die Inode-Nutzung zu pruefen, da Inodes auf manchen Dateisystemen vor dem Speicherplatz ausgehen koennen',
      'df /pfad/zum/verzeichnis verwenden, um das spezifische Dateisystem fuer dieses Verzeichnis zu pruefen',
    ],
  },

  du: {
    useCases: [
      'Herausfinden, welche Verzeichnisse den meisten Festplattenplatz verwenden',
      'Die Groesse eines Verzeichnisbaums vor dem Kopieren oder Archivieren schaetzen',
      'Grosse Dateien oder Verzeichnisse finden, die aufgeraeumt werden koennen',
    ],
    internals:
      'du durchlaeuft den Verzeichnisbaum und ruft stat fuer jede Datei auf, um die Blockbelegung zu ermitteln. Es zaehlt belegte Bloecke, nicht die scheinbare Dateigroesse, sodass Sparse-Dateien weniger als ihre logische Groesse anzeigen koennen. Hardlink-Dateien werden nur einmal gezaehlt.',
    mistakes: [
      'du auf dem Root-Dateisystem ohne Tiefenlimit ausfuehren, was sehr lange dauert',
      'Scheinbare Groesse mit tatsaechlicher Festplattennutzung verwechseln, besonders bei Sparse-Dateien oder Dateisystem-Blockgroessen',
      '--exclude nicht verwenden, um virtuelle Dateisysteme wie /proc oder /sys zu ueberspringen',
    ],
    bestPractices: [
      'du -sh fuer eine Zusammenfassung eines einzelnen Verzeichnisses und du -sh * zum Vergleichen der Eintraege im aktuellen Verzeichnis verwenden',
      'du --max-depth=1 verwenden, um nur die Groessen der obersten Unterverzeichnisse zu sehen',
      'Mit sort kombinieren: du -sh * | sort -h, um die groessten Verzeichnisse schnell zu finden',
    ],
  },

  free: {
    useCases: [
      'System-Speichernutzung einschliesslich RAM und Swap pruefen',
      'Feststellen, ob das System unter Speicherdruck steht oder swappt',
      'Verfuegbaren Speicher ueberwachen, bevor speicherintensive Aufgaben gestartet werden',
    ],
    internals:
      'free liest aus /proc/meminfo, um Kernel-Speicherstatistiken zu erhalten. Die Spalte available (ab Kernel 3.14) schaetzt, wie viel Speicher fuer das Starten neuer Anwendungen ohne Swapping verfuegbar ist, unter Beruecksichtigung rueckforderbarer Caches.',
    mistakes: [
      'Genutzten Speicher als Problem fehlinterpretieren. Linux nutzt freien RAM fuer Disk-Caching, was normal und vorteilhaft ist.',
      'Auf die free-Spalte statt available schauen, die den tatsaechlich von neuen Anwendungen nutzbaren Betrag darstellt',
    ],
    bestPractices: [
      'free -h fuer menschenlesbare Groessen verwenden',
      'Auf die available-Spalte schauen, nicht free, um den tatsaechlich nutzbaren Speicher einzuschaetzen',
      'free -s 5 verwenden, um die Speichernutzung alle 5 Sekunden zu ueberwachen',
    ],
  },

  who: {
    useCases: [
      'Sehen, welche Benutzer aktuell im System angemeldet sind',
      'Pruefen, wann Benutzer sich angemeldet haben und von welchem Terminal oder Host',
      'Die eigenen Login-Sitzungsdetails ueberpruefen',
    ],
    internals:
      'who liest die utmp-Datei (/var/run/utmp), die aktuelle Benutzersitzungen verfolgt. Der Login-Prozess schreibt Eintraege, wenn sich Benutzer authentifizieren, und entfernt sie beim Abmelden.',
    bestPractices: [
      'who -b verwenden, um die letzte System-Boot-Zeit zu sehen',
      'w (ein verwandter Befehl) fuer mehr Details verwenden, einschliesslich was jeder Benutzer ausfuehrt',
      'last (liest wtmp) fuer Anmeldehistorie verwenden, nicht nur aktuelle Sitzungen',
    ],
  },

  env: {
    useCases: [
      'Alle aktuellen Umgebungsvariablen anzeigen',
      'Einen Befehl mit geaenderten Umgebungsvariablen ausfuehren, ohne die aktuelle Shell zu beeinflussen',
      'Die Umgebung leeren und einen Befehl mit nur angegebenen Variablen ausfuehren',
    ],
    internals:
      'env modifiziert das Umgebungs-Array und ruft dann execvp auf, um den angegebenen Befehl auszufuehren. Ohne Argumente gibt es die aktuelle Umgebung aus, indem es ueber das environ-Pointer-Array iteriert.',
    mistakes: [
      'env mit export verwechseln. env fuehrt einen einzelnen Befehl mit geaenderten Variablen aus, waehrend export Variablen fuer die aktuelle Shell und alle zukuenftigen Kindprozesse setzt.',
      'env verwenden, um Variablen permanent zu setzen, was es nicht tut. Aenderungen gelten nur fuer den gestarteten Befehl.',
    ],
    bestPractices: [
      'env -i verwenden, um mit einer komplett sauberen Umgebung fuer reproduzierbare Tests zu starten',
      'env VAR=wert befehl verwenden, um Variablen temporaer fuer einen einzelnen Befehl zu ueberschreiben',
      'Der Shebang #!/usr/bin/env python3 ist portabler als den Python-Pfad fest zu codieren',
    ],
  },

  lscpu: {
    useCases: [
      'CPU-Architektur, Kernanzahl, Thread-Anzahl und Cache-Groessen anzeigen',
      'Pruefen, ob Virtualisierungserweiterungen (VT-x, AMD-V) verfuegbar sind',
      'NUMA-Topologie fuer Leistungsoptimierung ermitteln',
    ],
    internals:
      'lscpu liest aus /proc/cpuinfo und sysfs-Eintraegen unter /sys/devices/system/cpu, um CPU-Topologie, Features und Faehigkeiten zu sammeln. Es liest auch SMBIOS/DMI-Daten fuer physische CPU-Informationen.',
    bestPractices: [
      'lscpu verwenden, um schnell zu pruefen, wie viele Kerne und Threads verfuegbar sind, bevor Parallelitaet optimiert wird',
      'Das Virtualization-Feld pruefen, um zu verifizieren, ob Hardware-Virtualisierung aktiviert ist',
      'lscpu --extended fuer CPU-spezifische Details in NUMA-Systemen verwenden',
    ],
  },

  lshw: {
    useCases: [
      'Ein detailliertes Hardware-Inventar des gesamten Systems erhalten',
      'Hardware-Modelle, Seriennummern und Firmware-Versionen identifizieren',
      'Hardware-Kompatibilitaets- oder Treiberprobleme diagnostizieren',
    ],
    internals:
      'lshw liest Hardware-Informationen aus mehreren Kernel-Quellen: /proc, /sys, DMI/SMBIOS-Tabellen und geraetespezifischen Interfaces. Root-Zugang ist fuer vollstaendige Informationen einschliesslich Seriennummern und Firmware-Versionen erforderlich.',
    mistakes: [
      'Ohne sudo ausfuehren, was zu unvollstaendigen Informationen fuer viele Hardware-Klassen fuehrt',
      'Genaue Informationen in virtuellen Maschinen erwarten, wo Hardware-Details moeglicherweise emuliert oder nicht verfuegbar sind',
    ],
    bestPractices: [
      'sudo lshw -short fuer eine knappe Hardware-Zusammenfassung ausfuehren',
      'lshw -class network oder lshw -class disk verwenden, um nach Hardware-Klasse zu filtern',
      'lshw -html verwenden, um einen HTML-Hardwarebericht zu generieren',
    ],
  },

  lspci: {
    useCases: [
      'Alle PCI-Geraete auflisten einschliesslich GPUs, Netzwerkkarten und Speicher-Controller',
      'Hardware-Modelle fuer die Treiberinstallation identifizieren',
      'Geraeteerkennungsprobleme diagnostizieren',
    ],
    internals:
      'lspci liest aus /sys/bus/pci/devices und dem PCI-Konfigurationsraum, um Geraete aufzuzaehlen. Es nutzt die pci.ids-Datenbank, um Hersteller- und Geraete-IDs in menschenlesbare Namen zu uebersetzen.',
    bestPractices: [
      'lspci -v fuer detaillierte Informationen ueber jedes Geraet einschliesslich des verwendeten Treibers verwenden',
      'lspci -nn verwenden, um sowohl Namen als auch numerische Hersteller-/Geraete-IDs fuer Treibersuchen anzuzeigen',
      'lspci -k verwenden, um zu sehen, welcher Kernel-Treiber an jedes Geraet gebunden ist',
    ],
  },

  lsusb: {
    useCases: [
      'Alle an das System angeschlossenen USB-Geraete auflisten',
      'Hersteller- und Produkt-IDs fuer USB-Geraetekonfiguration identifizieren',
      'Ueberpruefen, ob ein USB-Geraet vom System erkannt wird',
    ],
    internals:
      'lsusb liest aus /sys/bus/usb/devices und nutzt die usb.ids-Datenbank, um Hersteller- und Produkt-IDs zu uebersetzen. Es kann auch USB-Geraetedeskriptoren direkt fuer detaillierte Informationen abfragen.',
    bestPractices: [
      'lsusb -v fuer detaillierte Deskriptor-Informationen ueber jedes Geraet verwenden',
      'lsusb -t fuer eine Baumansicht der USB-Bus-Topologie verwenden',
      'Mit dmesg kombinieren, um USB-Erkennungsereignisse mit Geraeteeintraegen zu korrelieren',
    ],
  },

  printenv: {
    useCases: [
      'Den Wert einer bestimmten Umgebungsvariable anzeigen',
      'Alle Umgebungsvariablen auflisten, aehnlich wie env, aber ohne die Befehlsausfuehrungsfunktion',
      'Pruefen, ob eine Variable exportiert (in der Umgebung verfuegbar) ist oder nur in der Shell gesetzt',
    ],
    bestPractices: [
      'printenv VAR_NAME verwenden, um eine bestimmte Variable ohne das Rauschen aller Variablen zu pruefen',
      'printenv gegenueber echo $VAR in Skripten bevorzugen, da printenv klar fehlschlaegt, wenn die Variable nicht existiert',
    ],
  },

  arch: {
    useCases: [
      'Schnell die System-CPU-Architektur pruefen (aequivalent zu uname -m)',
      'Feststellen, ob das System x86_64, ARM oder eine andere Architektur ausfuehrt',
      'Entscheiden, welche Binary- oder Paket-Architektur heruntergeladen werden soll',
    ],
    bestPractices: [
      'arch als schnelle Abkuerzung fuer uname -m in interaktiven Sitzungen verwenden',
      'In Skripten uname -m bevorzugen, da es auf Unix-Systemen breiter verfuegbar ist',
    ],
  },

  nproc: {
    useCases: [
      'Die Anzahl verfuegbarer Verarbeitungseinheiten fuer Parallelitaetsoptimierung ermitteln',
      'Die Anzahl paralleler Jobs in Build-Systemen setzen wie make -j$(nproc)',
      'Skripte schreiben, die automatisch mit verfuegbaren CPU-Kernen skalieren',
    ],
    internals:
      'nproc liest aus /sys/devices/system/cpu oder dem sched_getaffinity-Systemaufruf, um zu ermitteln, wie viele CPUs dem aktuellen Prozess zur Verfuegung stehen, unter Beruecksichtigung von cgroup-Limits und CPU-Affinitaetsmasken.',
    bestPractices: [
      'nproc in Build-Befehlen verwenden: make -j$(nproc), um alle verfuegbaren Kerne zu nutzen',
      'nproc --all verwenden, um die Gesamtanzahl ohne Affinitaetsbeschraenkungen zu erhalten',
      'Einen Kern fuer Reaktionsfaehigkeit abziehen: make -j$(($(nproc) - 1)), um das System waehrend Builds interaktiv zu halten',
    ],
  },

  locale: {
    useCases: [
      'System-Locale und Spracheinstellungen anzeigen oder konfigurieren',
      'Zeichenkodierungsprobleme in der Terminalausgabe diagnostizieren',
      'Locale-Einstellungen ueberpruefen, bevor Tools ausgefuehrt werden, die korrekte Kodierung benoetigen',
    ],
    mistakes: [
      'Inkonsistente Locale-Einstellungen ueber LC_*-Variablen hinweg, was unerwartetes Verhalten bei Sortierung oder Zeichenbehandlung verursacht',
      'Benoetigte Locales auf dem System nicht generieren (locale-gen), bevor versucht wird, sie zu verwenden',
    ],
    bestPractices: [
      'locale verwenden, um aktuelle Einstellungen anzuzeigen, und locale -a, um alle verfuegbaren Locales aufzulisten',
      'LC_ALL=C fuer konsistentes, locale-unabhaengiges Verhalten in Skripten setzen (besonders fuer sort und grep)',
      'UTF-8-Locales (z.B. en_US.UTF-8) fuer moderne Anwendungen verwenden, die internationale Zeichen verarbeiten',
    ],
  },

  // ─── TEXT PROCESSING (23) ──────────────────────────────────────────

  grep: {
    useCases: [
      'Nach Mustern oder Textstrings in Dateien oder Befehlsausgabe suchen',
      'Log-Dateien nach bestimmten Fehlern, Zeitstempeln oder Ereignissen filtern',
      'Dateien finden, die ein bestimmtes Code-Muster in einer Codebasis enthalten',
      'Eingaben validieren, indem geprueft wird, ob sie einem erwarteten Muster entsprechen',
    ],
    internals:
      'grep kompiliert das Muster in einen endlichen Automaten und durchsucht jede Eingabezeile. Es nutzt optimierte Algorithmen wie Boyer-Moore fuer feste Strings und DFA/NFA fuer Regex. Mit -r durchlaeuft es Verzeichnisbaeume und filtert nach Dateityp.',
    mistakes: [
      'Vergessen von -E fuer erweiterte Regex (oder egrep verwenden) und sich wundern, warum +, | und () nicht funktionieren',
      'Das Muster nicht quotieren, wodurch die Shell Sonderzeichen interpretiert, bevor grep sie sieht',
      'grep -r auf riesigen Verzeichnisbaeumen ohne --include zum Filtern von Dateitypen verwenden, was es sehr langsam macht',
    ],
    bestPractices: [
      'grep -rn fuer rekursive Suche mit Zeilennummern verwenden, um Treffer schnell zu finden',
      'grep -i fuer Gross-/Kleinschreibung-unabhaengiges Matching und -w fuer ganzes Wort verwenden',
      'grep -c zum Zaehlen von Treffern verwenden statt nach wc -l zu pipen',
      'grep --include="*.py" verwenden, um die Suche auf bestimmte Dateitypen einzuschraenken',
    ],
  },

  sed: {
    useCases: [
      'Text in Dateien oder Streams suchen und ersetzen',
      'Bestimmte Zeilen basierend auf Mustern oder Zeilennummern loeschen, einfuegen oder transformieren',
      'Text in Pipelines fuer Batch-Bearbeitungsaufgaben verarbeiten',
    ],
    internals:
      'sed liest Eingabe zeilenweise in einen Pattern-Space, wendet Befehle der Reihe nach an und gibt dann das Ergebnis aus. Es unterstuetzt einen Hold-Space fuer mehrzeilige Operationen. sed kompiliert sein Skript in eine interne Darstellung fuer effiziente Verarbeitung.',
    mistakes: [
      'Vergessen, dass sed -i sich unter macOS anders verhaelt (erfordert eine Backup-Endung wie -i .bak) als unter Linux',
      'Schraegstriche in Mustern nicht escapen, wenn / als Trennzeichen verwendet wird. Ein anderes Trennzeichen wie sed "s|alt|neu|g" verwenden.',
      'Annehmen, dass sed denselben Regex-Dialekt wie grep oder Perl verwendet. Basis-Regex ist Standard, sofern nicht -E verwendet wird.',
    ],
    bestPractices: [
      'sed -i.bak fuer In-Place-Bearbeitungen mit einer Sicherungsdatei verwenden',
      'Alternative Trennzeichen verwenden, wenn das Muster Schraegstriche enthaelt: sed "s|/alter/pfad|/neuer/pfad|g"',
      '-E fuer erweiterte Regex verwenden, um ueberfluessiges Escaping zu vermeiden',
      'sed-Befehle zuerst ohne -i testen, um die Ausgabe vor dem Aendern von Dateien zu ueberpruefen',
    ],
  },

  awk: {
    useCases: [
      'Bestimmte Spalten aus strukturierten Textdaten extrahieren und transformieren',
      'Berechnungen und Aggregationen auf textbasierten Datendateien durchfuehren',
      'Formatierte Berichte aus Log-Dateien oder CSV-Daten generieren',
      'Text verarbeiten, wenn sed zu limitiert ist, aber eine vollstaendige Skriptsprache uebertrieben waere',
    ],
    internals:
      'awk teilt jede Eingabezeile in Felder anhand des Feldtrennzeichens (FS, Standard Whitespace). Es fuehrt ein Programm aus Muster-Aktions-Paaren aus: Fuer jede Zeile, die einem Muster entspricht, wird die zugehoerige Aktion ausgefuehrt. Es unterstuetzt Variablen, Arrays, Funktionen und printf.',
    mistakes: [
      '$0 verwenden, wenn ein bestimmtes Feld gemeint ist ($1, $2 usw.). $0 ist die gesamte Zeile.',
      'Vergessen, den Feldtrenner mit -F zu setzen, wenn CSVs oder andere begrenzte Daten verarbeitet werden',
      'Quotierungsprobleme: awk-Programme sollten in einfachen Anfuehrungszeichen stehen, um Shell-Interpretation von $ zu verhindern',
    ],
    bestPractices: [
      '-F verwenden, um den Feldtrenner zu setzen: awk -F, fuer CSV oder awk -F: fuer /etc/passwd',
      'BEGIN- und END-Bloecke fuer Initialisierung und Zusammenfassungsausgabe verwenden',
      'awk fuer Spaltenextraktion statt cut verwenden, wenn flexible Whitespace-Behandlung benoetigt wird',
      'awk gegenueber komplexen sed+grep-Ketten fuer strukturierte Datenverarbeitung bevorzugen',
    ],
  },

  sort: {
    useCases: [
      'Textzeilen alphabetisch, numerisch oder nach bestimmten Feldern sortieren',
      'Daten fuer uniq, join oder comm vorbereiten, die sortierte Eingabe erfordern',
      'Die obersten/untersten N Eintraege durch Sortieren und Pipen nach head/tail finden',
    ],
    internals:
      'sort verwendet einen Merge-Sort-Algorithmus, der fuer grosse Dateien optimiert ist. Fuer Daten, die den Speicher uebersteigen, fuehrt es eine externe Sortierung mit temporaeren Dateien durch. Es ist locale-abhaengig, was die Sortierreihenfolge beeinflusst.',
    mistakes: [
      'Zahlen alphabetisch sortieren (10 kommt vor 2) statt -n fuer numerische Sortierung zu verwenden',
      'Nicht wissen, dass sort locale-abhaengig ist. LC_ALL=C sort liefert Byte-Reihenfolge-Sortierung, die schneller und vorhersagbarer ist.',
      '-t zum Setzen des Feldtrennzeichens vergessen, wenn nach einer bestimmten Spalte sortiert wird',
    ],
    bestPractices: [
      'sort -n fuer numerische Sortierung und sort -h fuer menschenlesbare Groessen (1K, 2M, 3G) verwenden',
      'sort -k zum Sortieren nach bestimmten Feldern verwenden: sort -t, -k2,2n zum Sortieren von CSV nach zweiter Spalte numerisch',
      'sort -u verwenden, um in einem Schritt zu sortieren und zu deduplizieren',
      'LC_ALL=C fuer schnellste Sortierung setzen, wenn locale-spezifische Reihenfolge nicht benoetigt wird',
    ],
  },

  uniq: {
    useCases: [
      'Aufeinanderfolgende doppelte Zeilen aus sortierter Eingabe entfernen',
      'Vorkommen jeder eindeutigen Zeile mit -c zaehlen',
      'Doppelte oder nur-eindeutige Zeilen in Datensaetzen finden',
    ],
    internals:
      'uniq vergleicht jede Zeile mit der vorherigen und erkennt daher nur benachbarte Duplikate. Die Eingabe muss zuerst sortiert werden fuer globale Deduplizierung. Es liest zeilenweise mit konstantem Speicherverbrauch.',
    mistakes: [
      'uniq auf unsortierter Eingabe verwenden und erwarten, dass alle Duplikate entfernt werden. Es entfernt nur aufeinanderfolgende Duplikate.',
      'Vergessen, zuerst zu sortieren: immer sort | uniq oder sort -u fuer globale Eindeutigkeit verwenden',
    ],
    bestPractices: [
      'Immer vor uniq sortieren, es sei denn, nur aufeinanderfolgende Zeilen sollen dedupliziert werden',
      'sort | uniq -c | sort -rn verwenden, um eine Haeufigkeitszaehlung sortiert nach den haeufigsten zu erhalten',
      'uniq -d verwenden, um nur duplizierte Zeilen anzuzeigen, und uniq -u, um nur eindeutige Zeilen anzuzeigen',
    ],
  },

  wc: {
    useCases: [
      'Zeilen, Woerter oder Zeichen in Dateien oder Befehlsausgabe zaehlen',
      'Schnell die Dateigroesse in Zeilen fuer Log-Dateien oder Datensaetze pruefen',
      'Die Anzahl der Ergebnisse von grep oder find zaehlen',
    ],
    mistakes: [
      'Sich auf wc -c fuer Zeichenzaehlung verlassen, wenn eigentlich wc -m fuer Multibyte-Zeichen gewuenscht ist',
      'Vergessen, dass wc -l Zeilenumbrueche zaehlt, sodass eine Datei ohne abschliessenden Zeilenumbruch eine Zeile weniger als erwartet meldet',
    ],
    bestPractices: [
      'wc -l fuer Zeilenzaehlung verwenden, was die am haeufigsten benoetigte Metrik ist',
      'wc -w fuer Wortzaehlung in Dokumenten und wc -c fuer Byte-Zaehlung verwenden',
      'grep-Ausgabe nach wc -l pipen, um Treffer zu zaehlen, oder besser direkt grep -c verwenden',
    ],
  },

  diff: {
    useCases: [
      'Zwei Dateien vergleichen, um zu sehen, was sich zwischen ihnen geaendert hat',
      'Patches fuer die Verteilung von Code-Aenderungen generieren',
      'Ueberpruefen, ob ein Transformations- oder Verarbeitungsschritt erwartete Ergebnisse liefert',
    ],
    internals:
      'diff verwendet den Hunt-Szymanski- oder Myers-Algorithmus, um die laengste gemeinsame Teilfolge zwischen zwei Dateien zu finden, und gibt den minimalen Satz von Aenderungen aus, um die eine in die andere zu transformieren.',
    mistakes: [
      '-u (Unified-Format) nicht verwenden, das viel besser lesbar ist und das Standardformat fuer Patches darstellt',
      'Binaerdateien ohne --binary-Flag vergleichen oder aussagekraeftige Textausgabe davon erwarten',
    ],
    bestPractices: [
      'diff -u fuer Unified-Format verwenden, den Standard fuer Patches und Code-Reviews',
      'diff -r verwenden, um Verzeichnisse rekursiv zu vergleichen',
      'diff --color fuer visuelle Hervorhebung im Terminal verwenden',
      'colordiff oder delta fuer bessere visuelle Diffs in Betracht ziehen',
    ],
  },

  cut: {
    useCases: [
      'Bestimmte Spalten oder Felder aus begrenzt formatiertem Text extrahieren',
      'Zeichenbereiche aus Daten mit fester Breite herausziehen',
      'Schnell ein einzelnes Feld aus CSV- oder TSV-Dateien holen',
    ],
    internals:
      'cut liest jede Zeile und extrahiert die angegebenen Bytes (-b), Zeichen (-c) oder Felder (-f) basierend auf einem Trennzeichen. Es verarbeitet eine Zeile nach der anderen mit minimalem Speicherverbrauch.',
    mistakes: [
      'Vergessen, das Trennzeichen mit -d fuer nicht-Tab-begrenzte Daten zu setzen, da Tab der Standard ist',
      'cut auf CSV-Dateien mit gequoteten Feldern anwenden, die Kommas enthalten. cut versteht kein CSV-Quoting.',
      '-c (Zeichen) mit -b (Bytes) verwechseln, wenn mit Multibyte-Kodierungen gearbeitet wird',
    ],
    bestPractices: [
      'cut -d, -f2 fuer einfache CSV-Spaltenextraktion verwenden, aber awk fuer komplexe Faelle nutzen',
      'cut -d: -f1 /etc/passwd verwenden, um Benutzernamen zu extrahieren',
      'awk gegenueber cut bevorzugen, wenn flexible Feldbehandlung oder Whitespace-Trennzeichen benoetigt werden',
    ],
  },

  tr: {
    useCases: [
      'Zeichen aus Textstreams uebersetzen, zusammenfassen oder loeschen',
      'Zwischen Gross- und Kleinbuchstaben konvertieren',
      'Bestimmte Zeichenklassen wie Ziffern oder Whitespace entfernen oder ersetzen',
    ],
    internals:
      'tr erstellt eine Uebersetzungstabelle, die jedes Byte in SET1 dem entsprechenden Byte in SET2 zuordnet, und wendet sie auf jedes Byte der Eingabe an. Es arbeitet auf einzelnen Zeichen, nicht auf Strings oder Mustern.',
    mistakes: [
      'Erwarten, dass tr mehrzeichen-Strings oder Regex-Muster verarbeitet. Es arbeitet nur auf einzelnen Zeichen.',
      'tr mit Multibyte-Zeichen (UTF-8) verwenden, wobei es Zeichen moeglicherweise falsch aufteilt',
    ],
    bestPractices: [
      'tr "[:upper:]" "[:lower:]" fuer portable Gross-/Kleinbuchstaben-Konvertierung verwenden',
      'tr -s " " verwenden, um wiederholte Leerzeichen zu einem einzigen zusammenzufassen',
      'tr -d "\\n" verwenden, um alle Zeilenumbrueche aus der Eingabe zu entfernen',
      'tr -dc kombinieren, um nur bestimmte Zeichen beizubehalten: tr -dc "a-zA-Z0-9"',
    ],
  },

  tee: {
    useCases: [
      'Befehlsausgabe gleichzeitig auf dem Bildschirm und in eine Datei schreiben',
      'Einen Protokollierungspunkt mitten in einer Pipeline einfuegen',
      'In Dateien schreiben, die sudo erfordern, waehrend eine Pipeline beibehalten wird',
    ],
    internals:
      'tee liest von stdin und schreibt sowohl auf stdout als auch in eine oder mehrere angegebene Dateien. Es nutzt Standard-Read/Write-Systemaufrufe und flusht die Ausgabe zu allen Zielen, sobald Daten eintreffen.',
    mistakes: [
      '-a zum Anhaengen statt Ueberschreiben vergessen, wodurch bestehender Dateiinhalt verloren geht',
      'Nicht wissen, dass sudo echo "text" > /root/file fehlschlaegt, weil die Umleitung von der Shell ausgefuehrt wird, nicht von sudo. Stattdessen echo "text" | sudo tee /root/file verwenden.',
    ],
    bestPractices: [
      'tee -a verwenden, um an eine Datei anzuhaengen statt sie zu ueberschreiben',
      'tee verwenden, um in Root-eigene Dateien zu schreiben: echo "zeile" | sudo tee -a /etc/config',
      'tee /dev/null verwenden, wenn die Ausgabe dupliziert werden soll, ohne in eine Datei zu schreiben',
    ],
  },

  xargs: {
    useCases: [
      'Befehle aus stdin zusammenbauen und ausfuehren, unter Beruecksichtigung von Argumentlistenlimits',
      'Operationen ueber mehrere Eingaben parallelisieren',
      'Ausgabe von find, grep oder anderen Befehlen verarbeiten, die zeilengetrennte Eingabe erzeugen',
    ],
    internals:
      'xargs liest Elemente von stdin, teilt sie nach Whitespace oder dem angegebenen Trennzeichen und baut Befehlszeilen bis zum System-ARG_MAX-Limit. Mit -P kann es mehrere Befehle parallel ausfuehren, indem Worker-Prozesse geforkt werden.',
    mistakes: [
      '-0 nicht mit find -print0 verwenden, was bei Dateinamen mit Leerzeichen oder Zeilenumbruechen fehlschlaegt',
      'Vergessen, dass xargs standardmaessig nach Whitespace trennt, was bei Pfaden mit Leerzeichen fehlschlaegt',
      '-I {} nicht verwenden, wenn das Argument an einer bestimmten Stelle im Befehl stehen muss',
    ],
    bestPractices: [
      'Immer find -print0 mit xargs -0 paaren, um jeden Dateinamen sicher zu behandeln',
      'xargs -I {} fuer Befehle verwenden, bei denen das Argument an einem bestimmten Platz steht: xargs -I {} cp {} /ziel/',
      'xargs -P N verwenden, um N Befehle parallel fuer schnellere Batch-Verarbeitung auszufuehren',
      'xargs -n 1 verwenden, um einen Befehl pro Eingabeelement statt gebatchte auszufuehren',
    ],
  },

  paste: {
    useCases: [
      'Zeilen mehrerer Dateien mit einem Trennzeichen nebeneinander zusammenfuehren',
      'Eine Datenspalte in eine einzelne Tab- oder Komma-getrennte Zeile konvertieren',
      'Spalten aus verschiedenen Quellen zu einer Ausgabe kombinieren',
    ],
    mistakes: [
      'Vergessen, das Trennzeichen mit -d zu setzen, wenn etwas anderes als Tab benoetigt wird',
      '-s nicht verwenden, wenn Zeilen einer einzelnen Datei in eine Zeile zusammengefuegt werden sollen, statt Dateien spaltenweise zusammenzufuehren',
    ],
    bestPractices: [
      'paste -d, verwenden, um mit Kommas fuer CSV-aehnliche Ausgabe zusammenzufuehren',
      'paste -s verwenden, um Zeilen aus einer einzelnen Datei in eine Zeile zu serialisieren',
      'paste mit cut fuer einfache Spalten-Neuanordnungsaufgaben kombinieren',
    ],
  },

  column: {
    useCases: [
      'Text in ausgerichtete Spalten fuer lesbare Terminalausgabe formatieren',
      'Begrenzte Daten wie CSV oder mount-Ausgabe huebsch formatieren',
      'Ausgerichtete Tabellen aus Befehlsausgabe in Skripten erstellen',
    ],
    mistakes: [
      'Das Trennzeichen mit -s oder -t nicht angeben, was bei nicht-Whitespace-begrenzter Eingabe zu Fehlausrichtung fuehrt',
      'Erwarten, dass column komplexes CSV mit gequoteten Feldern verarbeitet',
    ],
    bestPractices: [
      'column -t verwenden, um Spalten aus Whitespace-getrennter Eingabe automatisch zu erkennen und auszurichten',
      'column -s, -t fuer Komma-begrenzte Eingabe verwenden',
      'Befehlsausgabe durch column -t fuer schnelle Formatierung pipen: mount | column -t',
    ],
  },

  jq: {
    useCases: [
      'JSON-Daten aus APIs oder Konfigurationsdateien parsen, filtern und transformieren',
      'Bestimmte Felder aus komplexen verschachtelten JSON-Strukturen extrahieren',
      'JSON-Ausgabe fuer Lesbarkeit oder Weiterverarbeitung umformatieren',
      'JSON-Datentransformationen in Shell-Pipelines durchfuehren',
    ],
    internals:
      'jq kompiliert seinen Filterausdruck in ein Bytecode-Programm und fuehrt es gegen die geparste JSON-Eingabe aus. Es unterstuetzt eine umfassende Ausdruckssprache mit Variablen, Funktionen, Bedingungen und Reduce-Operationen.',
    mistakes: [
      'Vergessen, -r (rohe Ausgabe) zu verwenden, wodurch gequotete Strings in der Ausgabe erscheinen',
      'Null-Werte nicht behandeln, die sich durch Ausdruecke propagieren und unerwartete Ergebnisse verursachen',
      'String-Interpolation verwenden, wenn jq-Ausdruckssprachfeatures sauberer waeren',
    ],
    bestPractices: [
      'jq -r fuer rohe String-Ausgabe ohne JSON-Quoting verwenden',
      'jq "." fuer Pretty-Printing von JSON und jq -c fuer kompakte einzeilige Ausgabe verwenden',
      'jq select() zum Filtern von Arrays verwenden: jq ".[] | select(.status == \\"active\\")"',
      'jq --arg verwenden, um Shell-Variablen sicher in jq-Ausdruecke zu uebergeben',
    ],
  },

  yq: {
    useCases: [
      'YAML-Daten parsen, filtern und transformieren, aehnlich wie jq JSON verarbeitet',
      'YAML-Konfigurationsdateien programmgesteuert in CI/CD-Pipelines bearbeiten',
      'Zwischen YAML-, JSON- und XML-Formaten konvertieren',
    ],
    internals:
      'yq (die Go-Version von mikefarah) parst YAML in einen Knotenbaum und wertet Pfadausdruecke dagegen aus. Es unterstuetzt In-Place-Bearbeitung, Multi-Dokument-YAML und Anker/Aliase.',
    mistakes: [
      'Die zwei verschiedenen yq-Tools verwechseln: den Python-Wrapper um jq und das Go-basierte yq von mikefarah, die unterschiedliche Syntax haben',
      '-i fuer In-Place-Bearbeitung nicht verwenden und Ausgabe zurueck in dieselbe Datei umleiten, was sie kuerzt',
    ],
    bestPractices: [
      'yq -i fuer In-Place-Dateibearbeitung verwenden statt Ausgabe in dieselbe Datei umzuleiten',
      'yq -o=json verwenden, um YAML in JSON zu konvertieren, und jq, um JSON in YAML zu konvertieren',
      'yq eval-all verwenden, um mehrere YAML-Dateien zusammenzufuehren',
    ],
  },

  printf: {
    useCases: [
      'Ausgabe mit praeziser Kontrolle ueber Feldbreiten, Auffuellung und Zahlenformatierung formatieren',
      'Formatierte Strings in Skripten ohne die Inkonsistenzen von echo generieren',
      'Ausgerichtete Ausgabe oder Daten im festen Format erstellen',
    ],
    internals:
      'printf in bash ist ein Builtin, das Formatstrings aehnlich der C-printf-Funktion verarbeitet. Es unterstuetzt %s (String), %d (Ganzzahl), %f (Gleitkomma), %x (Hex) und Breiten-/Praezisionsspezifizierer.',
    mistakes: [
      'printf mit echo verwechseln. printf fuegt keinen abschliessenden Zeilenumbruch hinzu, sofern nicht \\n explizit angegeben wird.',
      'Vergessen, dass printf den Formatstring wiederverwendet, wenn mehr Argumente als Formatspezifizierer vorhanden sind',
    ],
    bestPractices: [
      'printf statt echo fuer portable und vorhersagbare Ausgabe in Skripten verwenden',
      'printf "%s\\n" verwenden, um Strings sicher auszugeben, die mit einem Bindestrich beginnen oder Backslashes enthalten koennten',
      'printf "%-20s %s\\n" verwenden, um linksbuendige Spaltenausgabe zu erstellen',
    ],
  },

  fold: {
    useCases: [
      'Lange Zeilen auf eine bestimmte Breite fuer Anzeige oder Formatierung umbrechen',
      'Text fuer Umgebungen mit Zeilenlaengenlimits wie E-Mail vorbereiten',
      'Textausgabe formatieren, um in eine Terminalbreite zu passen',
    ],
    mistakes: [
      'fold ohne -s verwenden, was Zeilen mitten in Woertern umbricht',
      'fmt nicht kennen, das intelligenteres absatzorientiertes Umbrechen durchfuehrt',
    ],
    bestPractices: [
      'fold -s verwenden, um an Wortgrenzen statt mitten im Wort umzubrechen',
      'fold -w 80 fuer Standard-Terminalbreiten-Umbruch verwenden',
      'fmt statt fold fuer absatzorientierte Textformatierung in Betracht ziehen',
    ],
  },

  split: {
    useCases: [
      'Grosse Dateien in kleinere Teile fuer Transfer oder Verarbeitung aufteilen',
      'Log-Dateien oder Datensaetze in handhabbare Stuecke aufteilen',
      'Dateien fuer Systeme mit Dateigroessenlimits vorbereiten',
    ],
    internals:
      'split liest die Eingabedatei und schreibt sequenzielle Teile in Ausgabedateien mit alphabetischen Suffixen (aa, ab, ac, ...). Es kann nach Zeilenanzahl, Byte-Anzahl oder Anzahl der Ausgabedateien aufteilen.',
    mistakes: [
      'Vergessen, ein Praefix fuer Ausgabedateien anzugeben, wodurch Standardnamen wie xaa, xab entstehen, die schwer zuzuordnen sind',
      'Binaerdateien nach Zeilen statt Bytes aufteilen, was die Daten beschaedigt',
    ],
    bestPractices: [
      'split -b 100M fuer Aufteilen nach Groesse und split -l 1000 fuer Aufteilen nach Zeilenanzahl verwenden',
      'Immer ein sinnvolles Praefix angeben: split -b 100M grossedatei.tar teil_',
      'cat teil_* > zusammengefuegt verwenden, um geteilte Dateien wieder zusammenzusetzen',
    ],
  },

  comm: {
    useCases: [
      'Zwei sortierte Dateien zeilenweise vergleichen und gemeinsame oder eindeutige Zeilen finden',
      'Zeilen finden, die nur in einer Datei vorhanden sind und nicht in der anderen',
      'Mengenoperationen (Vereinigung, Schnittmenge, Differenz) auf sortierten Textdateien durchfuehren',
    ],
    internals:
      'comm liest beide Dateien gleichzeitig und geht sie in Sortierreihenfolge durch. Es gibt drei Spalten aus: Zeilen nur in Datei 1, Zeilen nur in Datei 2 und Zeilen, die in beiden gemeinsam sind.',
    mistakes: [
      'comm auf unsortierten Dateien verwenden, was ohne Warnung falsche Ergebnisse liefert',
      'Die Spaltenunterdrueckungsflags verwechseln: -1 unterdrueckt nur-Datei1, -2 unterdrueckt nur-Datei2, -3 unterdrueckt gemeinsame',
    ],
    bestPractices: [
      'Immer beide Dateien vor der Verwendung von comm sortieren: comm <(sort datei1) <(sort datei2)',
      'comm -23 verwenden, um Zeilen nur in Datei1 anzuzeigen (wie Mengendifferenz)',
      'comm -12 verwenden, um nur gemeinsame Zeilen anzuzeigen (wie Schnittmenge)',
    ],
  },

  nl: {
    useCases: [
      'Zeilennummern zur Dateiausgabe als Referenz hinzufuegen',
      'Nur nicht-leere Zeilen in einem Dokument nummerieren',
      'Nummerierte Auflistungen fuer Dokumentation oder Code-Review erstellen',
    ],
    bestPractices: [
      'nl -ba verwenden, um alle Zeilen einschliesslich leerer Zeilen zu nummerieren',
      'nl -s ". " fuer ein lesbares Trennzeichen zwischen Nummer und Text verwenden',
      'cat -n fuer einfache Zeilennummerierung bevorzugen, nl fuer mehr Formatierungskontrolle verwenden',
    ],
  },

  expand: {
    useCases: [
      'Tabs in Leerzeichen im Quellcode fuer konsistente Formatierung konvertieren',
      'Whitespace vor dem Vergleichen von Dateien mit diff normalisieren',
      'Textdateien fuer Systeme vorbereiten, die Tabs nicht gut verarbeiten',
    ],
    bestPractices: [
      'expand -t 4 verwenden, um Tabs in 4 Leerzeichen zu konvertieren, entsprechend gaengiger Codierstandards',
      'unexpand fuer die umgekehrte Operation (Leerzeichen zu Tabs) verwenden',
      'Den Editor oder Formatierer statt expand fuer persistente Code-Stil-Aenderungen in Betracht ziehen',
    ],
  },

  envsubst: {
    useCases: [
      'Umgebungsvariablen in Vorlagendateien ersetzen',
      'Konfigurationsdateien aus Vorlagen in CI/CD-Pipelines generieren',
      'Platzhalter in Textdateien durch Laufzeitwerte ersetzen',
    ],
    internals:
      'envsubst durchsucht die Eingabe nach $VARIABLE- oder ${VARIABLE}-Mustern und ersetzt sie durch Werte aus der Umgebung. Es ist Teil von GNU gettext und verarbeitet Eingabe als Stream.',
    mistakes: [
      'Variablen nicht exportieren, bevor envsubst ausgefuehrt wird, wodurch Platzhalter unersetzt bleiben',
      'envsubst auf Dateien anwenden, die Dollarzeichen woertlich enthalten (wie Shell-Skripte), wodurch sie unbeabsichtigt ersetzt werden',
    ],
    bestPractices: [
      'Substitution auf bestimmte Variablen beschraenken: envsubst "$VAR1 $VAR2" < vorlage > ausgabe',
      'Alle benoetigten Variablen vor dem Ausfuehren von envsubst exportieren',
      'envsubst statt sed fuer Template-Verarbeitung verwenden, wenn Variablen in der Umgebung vorhanden sind',
    ],
  },

  rev: {
    useCases: [
      'Die Zeichenreihenfolge jeder Zeile in der Eingabe umkehren',
      'Das letzte Feld eines begrenzten Strings durch Umkehren, Ausschneiden und erneutes Umkehren extrahieren',
      'Schneller Textmanipulationstrick in Pipelines',
    ],
    bestPractices: [
      'rev mit cut kombinieren, um das letzte Feld zu extrahieren: echo "a.b.c" | rev | cut -d. -f1 | rev ergibt c',
      'rev als praktisches Werkzeug fuer Palindrompruefung oder einfache Texttransformationstricks verwenden',
    ],
  },

  // ─── PROCESS MANAGEMENT (15) ───────────────────────────────────────

  ps: {
    useCases: [
      'Laufende Prozesse mit PIDs, CPU- und Speichernutzung auflisten',
      'Die PID eines bestimmten Prozesses zum Signalisieren oder Untersuchen finden',
      'Den Prozessbaum anzeigen, um Eltern-Kind-Beziehungen zu verstehen',
    ],
    internals:
      'ps liest unter Linux aus /proc, wo jedes nach einer Nummer benannte Verzeichnis einem laufenden Prozess entspricht. Es sammelt Status, Befehlszeile, Speicherzuordnungen und Scheduling-Info aus Dateien wie /proc/PID/stat und /proc/PID/cmdline.',
    mistakes: [
      'BSD-Optionen (ps aux) mit UNIX-Optionen (ps -ef) verwechseln. Beide funktionieren, haben aber unterschiedliche Ausgabeformate.',
      'ps aux | grep prozess verwenden und den grep-Befehl selbst matchen. pgrep verwenden oder grep -v grep hinzufuegen.',
    ],
    bestPractices: [
      'ps aux fuer eine umfassende Liste aller Prozesse mit CPU- und Speicherinfo verwenden',
      'ps -ef --forest (oder pstree) verwenden, um die Prozesshierarchie zu visualisieren',
      'pgrep statt ps | grep verwenden, um Prozesse nach Name zu finden',
      'ps -p PID verwenden, um Details ueber einen bestimmten Prozess zu erhalten',
    ],
  },

  top: {
    useCases: [
      'Systemressourcennutzung in Echtzeit ueberwachen',
      'Prozesse identifizieren, die am meisten CPU oder Speicher verbrauchen',
      'Systemlast und Prozessanzahl ueber die Zeit beobachten',
    ],
    internals:
      'top liest in regelmaessigen Intervallen aus /proc, um Pro-Prozess-Statistiken zu sammeln. Es berechnet CPU-Prozentsaetze durch Vergleich der kumulierten CPU-Zeit zwischen Stichproben. Es nutzt die ncurses-Bibliothek fuer die interaktive Terminalanzeige.',
    mistakes: [
      'Die interaktiven Tasten nicht kennen: M zum Sortieren nach Speicher, P nach CPU, k zum Beenden, q zum Verlassen',
      'top verwenden, wenn htop verfuegbar ist, das eine deutlich bessere interaktive Erfahrung bietet',
    ],
    bestPractices: [
      'top -o %MEM zum Sortieren nach Speichernutzung oder top -o %CPU fuer CPU-Nutzung verwenden',
      '1 in top druecken, um die Auslastung pro CPU-Kern anzuzeigen',
      'htop als benutzerfreundlichere Alternative mit Mausunterstuetzung und besserer Visualisierung verwenden',
      'top -bn1 fuer einen einzelnen Batch-Snapshot verwenden, der fuer Skripting geeignet ist',
    ],
  },

  kill: {
    useCases: [
      'Signale an Prozesse senden, am haeufigsten um sie zu beenden',
      'Einen Prozess sanft mit SIGTERM oder erzwungen mit SIGKILL stoppen',
      'HUP an einen Daemon senden, um Konfigurationsneuladung auszuloesen',
    ],
    internals:
      'kill ruft den kill()-Systemaufruf auf, der ein Signal an einen Prozess oder eine Prozessgruppe sendet. Der Kernel liefert das Signal und der Prozess behandelt es, ignoriert es oder wird durch die Standardaktion beendet. SIGKILL (9) und SIGSTOP koennen weder gefangen noch ignoriert werden.',
    mistakes: [
      'kill -9 als ersten Versuch verwenden statt zuerst SIGTERM (15) zu versuchen, das ordnungsgemaesses Aufraeumen ermoeglicht',
      'Die falsche PID aufgrund eines Tippfehlers beenden. PID mit ps ueberpruefen, bevor Signale gesendet werden.',
      'Nicht wissen, dass kill jedes Signal senden kann, nicht nur Beendigung. kill -l verwenden, um alle Signale aufzulisten.',
    ],
    bestPractices: [
      'Zuerst kill PID (SIGTERM) versuchen, einige Sekunden warten, dann kill -9 PID (SIGKILL) nur bei Bedarf verwenden',
      'kill -HUP verwenden, um Daemon-Konfigurationen neu zu laden, ohne den Dienst zu stoppen',
      'pkill oder killall verwenden, um Prozesse nach Name zu beenden, statt PIDs manuell nachzuschlagen',
    ],
  },

  'bg-fg': {
    useCases: [
      'Einen gestoppten Hintergrundjob mit bg fortsetzen oder mit fg in den Vordergrund bringen',
      'Eine laufende Vordergrundaufgabe nach Druecken von Ctrl+Z in den Hintergrund verschieben',
      'Mehrere Aufgaben in einer einzelnen Terminal-Sitzung ohne tmux oder screen verwalten',
    ],
    internals:
      'bg sendet SIGCONT an einen gestoppten Prozess und setzt ihn zur Ausfuehrung im Hintergrund. fg sendet SIGCONT und verbindet den Prozess mit der Vordergrund-Prozessgruppe des Terminals. Die Shell verfolgt Jobs ueber ihre Prozessgruppen-IDs.',
    mistakes: [
      'Vergessen, dass Ctrl+Z den Prozess nur stoppt, nicht in den Hintergrund verschiebt. Danach bg eingeben.',
      'bg auf einem Prozess ausfuehren, der von stdin liest, was ihn sofort wieder mit SIGTTIN stoppt',
    ],
    bestPractices: [
      'Ctrl+Z dann bg verwenden, um einen laufenden Prozess in den Hintergrund zu verschieben, oder & beim Starten des Befehls anhaengen',
      'jobs verwenden, um aktuelle Hintergrundjobs und ihre Nummern aufzulisten',
      'fg %N verwenden, um einen bestimmten Job nach Jobnummer in den Vordergrund zu bringen',
    ],
  },

  cron: {
    useCases: [
      'Befehle planen, die automatisch zu bestimmten Zeiten oder Intervallen ausgefuehrt werden',
      'Wiederkehrende Wartungsaufgaben wie Backups, Log-Rotation und Bereinigungen automatisieren',
      'Periodische Datenverarbeitungs- oder Berichtsskripte ausfuehren',
    ],
    internals:
      'Der cron-Daemon (crond) wacht jede Minute auf, liest crontab-Dateien aus /var/spool/cron und /etc/cron.d und prueft, ob Eintraege mit der aktuellen Zeit uebereinstimmen. Uebereinstimmende Eintraege werden in einer minimalen Shell-Umgebung ausgefuehrt.',
    mistakes: [
      'Den vollstaendigen Pfad zu Befehlen nicht angeben, da cron mit einem minimalen PATH laeuft, der /usr/local/bin moeglicherweise nicht enthaelt',
      'Vergessen, dass cron-Jobs mit einer minimalen Umgebung laufen. Variablen wie PATH, HOME und SHELL koennen sich von der Login-Shell unterscheiden.',
      'Ausgabe nicht umleiten, wodurch cron bei jedem Lauf stdout/stderr per E-Mail sendet und moeglicherweise den Mail-Spool fuellt',
    ],
    bestPractices: [
      'crontab -e zum Bearbeiten der crontab und crontab -l zum Auflisten der Eintraege verwenden',
      'Immer absolute Pfade fuer Befehle und Dateien in cron-Jobs verwenden',
      'Ausgabe in eine Log-Datei umleiten: */5 * * * * /pfad/zum/skript >> /var/log/myjob.log 2>&1',
      'Cron-Syntax-Checker wie crontab.guru verwenden, um Zeitplanausdruecke zu ueberpruefen',
    ],
  },

  nice: {
    useCases: [
      'Einen Prozess mit geaenderter CPU-Scheduling-Prioritaet starten',
      'Die Prioritaet CPU-intensiver Hintergrundaufgaben senken, damit sie die interaktive Nutzung nicht beeintraechtigen',
      'Batch-Jobs mit reduzierter Prioritaet ausfuehren, um auf gemeinsam genutzten Systemen ruecksichtsvoll zu sein',
    ],
    internals:
      'nice passt den Niceness-Wert des Prozesses an, den der Kernel-Scheduler verwendet, um CPU-Zeit zuzuteilen. Niceness reicht von -20 (hoechste Prioritaet) bis 19 (niedrigste). Nur Root kann negative Niceness-Werte setzen.',
    mistakes: [
      'Erwarten, dass nice die CPU-Nutzung limitiert. Es beeinflusst nur die Scheduling-Prioritaet relativ zu anderen Prozessen.',
      'Negative Nice-Werte ohne Root setzen wollen, was vom Kernel abgelehnt wird',
    ],
    bestPractices: [
      'nice -n 19 fuer niedrigste Prioritaet bei Hintergrundjobs verwenden: nice -n 19 make -j4',
      'ionice neben nice verwenden, um auch die I/O-Prioritaet fuer festplattenintensive Aufgaben zu senken',
      'renice verwenden, um die Prioritaet bereits laufender Prozesse zu aendern',
    ],
  },

  pgrep: {
    useCases: [
      'Prozess-IDs nach Name, Benutzer oder anderen Attributen finden, ohne ps-Ausgabe zu parsen',
      'In Skripten pruefen, ob ein bestimmter Prozess laeuft',
      'PIDs fuer die Verwendung mit kill oder anderen Befehlen erhalten',
    ],
    internals:
      'pgrep durchsucht /proc nach Prozessen, die den angegebenen Kriterien (Name, Benutzer, Terminal usw.) entsprechen, und gibt deren PIDs zurueck. Es matcht standardmaessig gegen den Prozess-Befehlsnamen, nicht die vollstaendige Befehlszeile.',
    mistakes: [
      'Nicht wissen, dass pgrep standardmaessig den Prozessnamen (comm) matcht, nicht die vollstaendige Befehlszeile. -f fuer vollstaendiges Befehlszeilen-Matching verwenden.',
      'Exakte Uebereinstimmungen erwarten, wenn pgrep standardmaessig Substring-Matching durchfuehrt. -x fuer exaktes Namens-Matching verwenden.',
    ],
    bestPractices: [
      'pgrep -f verwenden, um gegen die vollstaendige Befehlszeile einschliesslich Argumenten zu matchen',
      'pgrep -a verwenden, um sowohl PID als auch vollstaendigen Befehl zur Verifikation anzuzeigen',
      'pgrep -u benutzername verwenden, um Prozesse eines bestimmten Benutzers zu finden',
      'pgrep in Skripten fuer Prozess-Existenzpruefungen verwenden: pgrep -x nginx > /dev/null && echo laeuft',
    ],
  },

  systemctl: {
    useCases: [
      'Systemdienste starten, stoppen, neustarten und deren Status pruefen',
      'Dienste aktivieren oder deaktivieren, um beim Booten automatisch zu starten',
      'Den systemd-Unit-Abhaengigkeitsbaum anzeigen und verwalten',
    ],
    internals:
      'systemctl kommuniziert mit dem systemd-Init-Daemon ueber D-Bus. systemd verwaltet Dienste als Units mit definierten Abhaengigkeiten, Reihenfolgen und Ressourcenkontrollen. Jede Unit hat eine Konfigurationsdatei, die beschreibt, wie der Dienst gestartet, gestoppt und ueberwacht wird.',
    mistakes: [
      'Vergessen, systemctl daemon-reload nach dem Aendern von Unit-Dateien auszufuehren, wodurch systemd veraltete Konfiguration verwendet',
      'enable/disable (Boot-Verhalten) mit start/stop (aktueller Zustand) verwechseln. Enable startet den Dienst nicht.',
      'Nicht journalctl fuer Dienstprotokolle pruefen, wenn ein Dienst nicht startet',
    ],
    bestPractices: [
      'systemctl status dienst verwenden, um aktuellen Zustand und aktuelle Log-Eintraege zu sehen',
      'systemctl enable --now dienst verwenden, um in einem Befehl zu aktivieren und zu starten',
      'journalctl -u dienst -f verwenden, um Dienstprotokolle in Echtzeit zu verfolgen',
      'systemctl list-units --failed verwenden, um Dienste zu finden, die nicht gestartet werden konnten',
    ],
  },

  service: {
    useCases: [
      'Dienste auf SysVinit- oder systemd-Systemen starten, stoppen und neustarten',
      'Den Status eines Dienstes mit einer einfachen Schnittstelle pruefen',
      'Dienste auf aelteren Linux-Systemen ohne systemd verwalten',
    ],
    internals:
      'Auf SysVinit-Systemen fuehrt service die Init-Skripte in /etc/init.d/ mit der angegebenen Aktion aus. Auf systemd-Systemen dient es als Kompatibilitaets-Wrapper, der in systemctl-Befehle uebersetzt.',
    mistakes: [
      'service auf systemd-Systemen verwenden, wenn systemctl mehr Informationen und Kontrolle bietet',
      'Den Exit-Code von service-Befehlen in Skripten nicht pruefen, um den Erfolg zu verifizieren',
    ],
    bestPractices: [
      'Auf systemd-Systemen systemctl gegenueber service fuer Zugang zu allen Funktionen bevorzugen',
      'service --status-all verwenden, um alle Dienste und ihre Zustaende aufzulisten',
      'Dienststatus nach dem Starten/Stoppen ueberpruefen, um zu bestaetigen, dass die Aktion erfolgreich war',
    ],
  },

  at: {
    useCases: [
      'Einen einmaligen Befehl planen, der zu einer bestimmten Zeit in der Zukunft ausgefuehrt wird',
      'Eine Aufgabe auf Nebenzeiten verschieben',
      'Einen Befehl nach einer relativen Verzoegerung ausfuehren, ohne ein Terminal offen zu halten',
    ],
    internals:
      'at liest Befehle von stdin und speichert sie in einem Spool-Verzeichnis (/var/spool/at). Der atd-Daemon prueft auf ausstehende Jobs und fuehrt sie zur angegebenen Zeit aus. Der Job erbt die aktuelle Umgebung.',
    mistakes: [
      'Nicht wissen, dass at-Jobs die aktuelle Umgebung und das Arbeitsverzeichnis erben, die zur Ausfuehrungszeit moeglicherweise nicht mehr gueltig sind',
      'Vergessen, dass at standardmaessig die lokale Zeitzone verwendet',
    ],
    bestPractices: [
      'at mit flexibler Zeitsyntax verwenden: at now + 2 hours, at 3:00 PM, at midnight tomorrow',
      'atq verwenden, um ausstehende Jobs aufzulisten, und atrm, um sie zu entfernen',
      'Absolute Pfade in at-Jobs verwenden, da das Arbeitsverzeichnis spaeter moeglicherweise nicht mehr existiert',
    ],
  },

  jobs: {
    useCases: [
      'Alle Hintergrund- und angehaltenen Jobs in der aktuellen Shell-Sitzung auflisten',
      'Den Status von Hintergrundaufgaben pruefen, bevor das Terminal geschlossen wird',
      'Jobnummern fuer die Verwendung mit fg, bg, kill und disown erhalten',
    ],
    mistakes: [
      'Erwarten, dass jobs Prozesse anzeigt, die in anderen Terminals gestartet wurden. Es zeigt nur Jobs der aktuellen Shell.',
      'Das Terminal mit laufenden Hintergrundjobs schliessen, was SIGHUP sendet und sie beendet. disown oder nohup verwenden.',
    ],
    bestPractices: [
      'jobs -l verwenden, um PIDs in der Ausgabe einzubeziehen',
      'jobs vor dem Schliessen eines Terminals pruefen, um das Beenden von Hintergrundarbeit zu vermeiden',
      'disown verwenden, um einen Job von der Shell zu trennen, damit er das Schliessen des Terminals ueberlebt',
    ],
  },

  disown: {
    useCases: [
      'Einen Hintergrundjob von der Shell trennen, damit er das Schliessen des Terminals ueberlebt',
      'Verhindern, dass SIGHUP an einen Job gesendet wird, wenn die Shell beendet wird',
      'Einen langlebigen Prozess am Laufen halten, nachdem die SSH-Verbindung getrennt wird',
    ],
    internals:
      'disown entfernt den angegebenen Job aus der Shell-Jobtabelle. Wenn die Shell beendet wird, sendet sie SIGHUP an alle Jobs in ihrer Tabelle. Disowned-Jobs sind nicht in der Tabelle und erhalten daher kein SIGHUP.',
    mistakes: [
      'Vergessen, den Job zuerst in den Hintergrund zu verschieben. Zuerst Ctrl+Z dann bg, bevor disown verwendet wird.',
      'Einen Prozess disownen, der auf das Terminal schreibt. Er koennte haengen oder abstuerzen, wenn das Terminal verschwindet. Ausgabe vorher umleiten.',
    ],
    bestPractices: [
      'Ausgabe vor dem Disownen umleiten: command > output.log 2>&1 & disown',
      'Fuer neue Prozesse nohup command & bevorzugen, das die Umleitung automatisch behandelt',
      'tmux oder screen fuer langlebige Aufgaben verwenden, zu denen man sich spaeter wieder verbinden moechte',
    ],
  },

  wait: {
    useCases: [
      'Auf den Abschluss von Hintergrundprozessen warten, bevor im Skript fortgefahren wird',
      'Parallele Aufgaben synchronisieren und deren Exit-Status sammeln',
      'Sicherstellen, dass alle Hintergrundjobs beendet sind, bevor ein Skript beendet wird',
    ],
    internals:
      'wait ruft den waitpid()-Systemaufruf auf, der blockiert, bis der angegebene Kindprozess beendet ist. Es gibt den Exit-Status des erwarteten Prozesses zurueck. Ohne Argumente wartet es auf alle Kindprozesse.',
    mistakes: [
      'Vergessen, Hintergrund-PIDs mit $! zu erfassen, um auf bestimmte Prozesse zu warten',
      'wait ohne Argumente in Skripten mit vielen Hintergrundprozessen verwenden, ohne einzelne Exit-Status zu pruefen',
    ],
    bestPractices: [
      'PIDs erfassen und gezielt warten: cmd1 & pid1=$!; cmd2 & pid2=$!; wait $pid1 $pid2',
      'Exit-Status nach wait pruefen: wait $pid; echo "Exit-Status: $?"',
      'wait -n (bash 4.3+) verwenden, um auf den Abschluss eines einzelnen Hintergrundjobs zu warten',
    ],
  },

  timeout: {
    useCases: [
      'Einen Befehl mit Zeitlimit ausfuehren und ihn beenden, wenn er zu lange dauert',
      'Verhindern, dass Skripte bei Netzwerk- oder blockierenden Operationen endlos haengen',
      'Sicherheitsgrenzen zu automatisierten Pipelines hinzufuegen, die innerhalb eines Zeitfensters abgeschlossen werden muessen',
    ],
    internals:
      'timeout startet den Befehl als Kindprozess und setzt einen Timer. Wenn der Timer ablaeuft, sendet es SIGTERM (standardmaessig) an den Prozess. Es kann ein nachfolgendes SIGKILL senden, wenn der Prozess nach dem initialen Signal nicht beendet wird.',
    mistakes: [
      'Vergessen, dass timeout standardmaessig SIGTERM sendet, das gefangen werden kann. --kill-after verwenden, um SIGKILL als Fallback zu senden.',
      'Den Exit-Status 124 (Timeout aufgetreten) in Skripten nicht behandeln',
    ],
    bestPractices: [
      'timeout 30s befehl fuer ein 30-Sekunden-Limit verwenden. Unterstuetzt s, m, h, d-Suffixe.',
      'timeout --kill-after=10s 60s befehl verwenden, um bei 60s SIGTERM und bei 70s SIGKILL zu senden',
      'Exit-Status 124 in Skripten pruefen, um Timeouts zu erkennen: timeout 10s cmd || [ $? -eq 124 ] && echo "Zeitlimit ueberschritten"',
    ],
  },

  renice: {
    useCases: [
      'Die CPU-Scheduling-Prioritaet eines laufenden Prozesses aendern',
      'Die Prioritaet eines ausser Kontrolle geratenen Prozesses senken, der zu viel CPU verbraucht',
      'Die Prioritaet eines kritischen Prozesses erhoehen (erfordert Root)',
    ],
    internals:
      'renice ruft den setpriority()-Systemaufruf auf, um die Niceness eines laufenden Prozesses, einer Prozessgruppe oder aller Prozesse eines Benutzers zu aendern. Der Kernel-Scheduler nutzt Niceness, um proportionale CPU-Zeit zuzuteilen.',
    mistakes: [
      'Die Prioritaet ohne Root-Rechte erhoehen (Niceness senken) wollen',
      'PID mit Jobnummer verwechseln. renice arbeitet mit PIDs, nicht mit Shell-Jobnummern.',
    ],
    bestPractices: [
      'renice -n 19 -p PID verwenden, um die niedrigste Prioritaet fuer CPU-intensive Hintergrundaufgaben zu setzen',
      'renice -n -5 -p PID (als Root) verwenden, um die Prioritaet wichtiger Prozesse zu erhoehen',
      'renice -n 10 -u benutzername verwenden, um die Prioritaet aller Prozesse eines bestimmten Benutzers zu senken',
    ],
  },
}
