import type { CommandExplanation } from '../types'

export const explanationsDeP3: Record<string, CommandExplanation> = {
  // ─── SHELL UTILITIES (26) ───────────────────────────────────────────

  alias: {
    useCases: [
      'Kurznamen fuer lange oder haeufig verwendete Befehle erstellen',
      'Standard-Flags bestehender Befehle ueberschreiben (z.B. alias ls="ls --color")',
      'Projektspezifische Abkuerzungen in .bashrc oder .zshrc definieren',
    ],
    internals:
      'Aliases sind einfache Textersetzungen, die die Shell vor jeder anderen Expansion durchfuehrt. Sie werden in einer In-Memory-Hashtabelle pro Shell-Sitzung gespeichert und gelten nur fuer interaktive Shells, sofern nicht explizit mit shopt -s expand_aliases in Skripten aktiviert.',
    mistakes: [
      'Aliases in Skripten definieren, ohne expand_aliases zu aktivieren -- Aliases sind in nicht-interaktiven Shells standardmaessig deaktiviert.',
      'alias fuer komplexe Logik verwenden statt Shell-Funktionen -- Aliases koennen keine Argumente in der Mitte des Befehls entgegennehmen. Verwende stattdessen eine Funktion.',
      'Vergessen, Aliases persistent zu machen -- in einem Terminal definierte Aliases gehen beim Schliessen der Sitzung verloren. Fuege sie in ~/.bashrc oder ~/.zshrc ein.',
    ],
    bestPractices: [
      'Verwende Funktionen statt Aliases, wenn du Argumente verarbeiten oder bedingte Logik hinzufuegen musst.',
      'Setze einen Backslash vor gefaehrliche Aliases, um sie temporaer zu umgehen: \\rm ueberspringt einen Alias fuer rm.',
      'Halte eine separate Alias-Datei (z.B. ~/.bash_aliases), die von deiner Shell-RC gesourct wird.',
    ],
  },

  history: {
    useCases: [
      'Zuvor ausgefuehrte Befehle abrufen und erneut ausfuehren',
      'Vergangene Befehle mit Ctrl+R (Rueckwaertssuche) durchsuchen',
      'Pruefen, welche Befehle in einer Sitzung ausgefuehrt wurden, zum Debuggen',
    ],
    internals:
      'Die Shell pflegt waehrend der Sitzung eine In-Memory-History-Liste und speichert sie beim Beenden in eine Datei (typischerweise ~/.bash_history oder ~/.zsh_history). HISTSIZE steuert die Anzahl im Speicher, HISTFILESIZE die Dateigroesse.',
    mistakes: [
      'Sich auf history fuer Sicherheitsaudits verlassen -- Benutzer koennen ~/.bash_history frei aendern oder loeschen. Verwende auditd fuer echte Auditierung.',
      'Mehrere Terminals oeffnen und History verlieren -- Standardmaessig ueberschreibt bash die History-Datei. Setze shopt -s histappend, um stattdessen anzufuegen.',
      'Versehentlich Geheimnisse speichern -- Befehle mit Passwoertern oder Tokens in Argumenten werden aufgezeichnet. Verwende HISTIGNORE oder HISTCONTROL=ignorespace und stelle sensiblen Befehlen ein Leerzeichen voran.',
    ],
    bestPractices: [
      'Setze HISTCONTROL=ignoreboth, um Duplikate und mit Leerzeichen vorangestellte Befehle zu ueberspringen.',
      'Erhoehe HISTSIZE und HISTFILESIZE auf grosse Werte (z.B. 10000), damit nuetzliche History selten verloren geht.',
      'Verwende history | grep <Muster> oder Ctrl+R fuer schnelles Nachschlagen.',
    ],
  },

  source: {
    useCases: [
      'Umgebungsvariablen oder Funktionen aus einer Datei in die aktuelle Shell laden',
      'Aenderungen an .bashrc oder .profile anwenden, ohne ein neues Terminal zu oeffnen',
      'Wiederverwendbaren Bibliothekscode in Shell-Skripten einbinden',
    ],
    internals:
      'source (oder sein POSIX-Aequivalent .) liest und fuehrt Befehle aus der angegebenen Datei in der aktuellen Shell-Umgebung aus, nicht in einer Subshell. Das bedeutet, dass Variablen, Funktionen und Optionen, die in der Datei gesetzt werden, in der aufrufenden Shell bestehen bleiben.',
    mistakes: [
      'source mit dem Ausfuehren eines Skripts verwechseln -- ./script.sh startet eine Subshell und Aenderungen betreffen nicht die uebergeordnete Shell. Verwende source script.sh, um die aktuelle Umgebung zu aendern.',
      'Nicht vertrauenswuerdige Dateien sourcen -- da source mit vollen Shell-Rechten laeuft, kann das Sourcen einer vom Angreifer kontrollierten Datei beliebige Befehle ausfuehren.',
    ],
    bestPractices: [
      'Verwende source zum Laden von Umgebungskonfigurationen, nicht zum Ausfuehren eigenstaendiger Skripte.',
      'Validiere oder vertraue Dateien immer, bevor du sie sourcst, besonders in automatisierten Pipelines.',
      'Bevorzuge das Schluesselwort "source" gegenueber "." fuer bessere Lesbarkeit in bash-Skripten.',
    ],
  },

  echo: {
    useCases: [
      'Text, Variablen oder formatierte Ausgaben auf stdout ausgeben',
      'Einfache Zeichenketten ueber Umleitung in Dateien schreiben',
      'Benutzerfeedback in Shell-Skripten bereitstellen',
    ],
    internals:
      'echo ist typischerweise ein Shell-Built-in, das seine Argumente durch Leerzeichen getrennt auf stdout schreibt, gefolgt von einem Zeilenumbruch. Das Verhalten von -e, -n und Backslash-Interpretation variiert zwischen dem bash-Built-in echo und /bin/echo, was es weniger portabel als printf macht.',
    mistakes: [
      'echo mit benutzerkontrollierter Eingabe verwenden -- wenn die Eingabe mit -e oder -n beginnt, kann echo dies als Flag interpretieren. Verwende stattdessen printf "%s\\n" "$var".',
      'Sich auf echo -e fuer Portabilitaet verlassen -- das Backslash-Interpretationsverhalten variiert zwischen Shells und Systemen. Verwende printf fuer konsistentes Verhalten.',
    ],
    bestPractices: [
      'Bevorzuge printf gegenueber echo fuer portable, vorhersagbare Ausgabeformatierung.',
      'Setze Variablen immer in Anfuehrungszeichen: echo "$var", um Word-Splitting und Globbing zu verhindern.',
      'Verwende echo fuer einfache Nachrichten in interaktiven Skripten; verwende printf fuer alles Produktionsreife.',
    ],
  },

  date: {
    useCases: [
      'Aktuelles Datum und Uhrzeit in verschiedenen Formaten anzeigen',
      'Zeitstempel fuer Logdateien und Backup-Namen generieren',
      'Datumsarithmetik durchfuehren (z.B. "3 days ago") mit GNU date',
    ],
    internals:
      'date liest die Systemuhr ueber den gettimeofday/clock_gettime-Syscall und formatiert das Ergebnis mit strftime-Formatspezifizierern. Es respektiert die TZ-Umgebungsvariable fuer Zeitzonen-Konvertierung.',
    mistakes: [
      'Annehmen, dass date -d auf macOS funktioniert -- das -d-Flag ist GNU-spezifisch. Unter macOS/BSD verwende date -v oder installiere GNU coreutils.',
      'Locale-abhaengige Formate in Skripten verwenden -- die date-Ausgabe aendert sich mit LC_TIME. Verwende immer explizite Formatstrings wie +%Y-%m-%d fuer Skripte.',
    ],
    bestPractices: [
      'Verwende ISO-8601-Format (date +%Y-%m-%dT%H:%M:%S%z) fuer eindeutige Zeitstempel.',
      'Verwende date +%s fuer Epoch-Sekunden, wenn du Arithmetik benoetigst.',
      'Setze TZ explizit in Skripten, die von einer bestimmten Zeitzone abhaengen.',
    ],
  },

  cal: {
    useCases: [
      'Schnell einen Kalender fuer den aktuellen oder einen bestimmten Monat/Jahr anzeigen',
      'Wochentag fuer ein bestimmtes Datum pruefen',
    ],
    mistakes: [
      'Erwarten, dass cal Datumsstrings akzeptiert -- es nimmt Monat und Jahr als separate numerische Argumente: cal 3 2026, nicht cal March 2026.',
      'Vergessen, dass das Jahresargument das aktuelle Jahr anzeigt -- cal 12 zeigt Dezember des aktuellen Jahres, was moeglicherweise nicht beabsichtigt ist.',
    ],
    bestPractices: [
      'Verwende cal -3, um den vorherigen, aktuellen und naechsten Monat nebeneinander anzuzeigen.',
      'Verwende ncal fuer ein vertikales Layout, das standardmaessig heute hervorhebt.',
    ],
  },

  sleep: {
    useCases: [
      'Verzoegerungen zwischen Befehlen in Skripten einfuegen (z.B. Retry-Schleifen)',
      'Wiederholte Operationen wie API-Polling drosseln',
      'Auf die Verfuegbarkeit eines abhaengigen Dienstes warten',
    ],
    internals:
      'sleep ruft den nanosleep-Syscall auf und gibt die CPU an den Scheduler ab. GNU sleep akzeptiert Gleitkomma-Sekunden und Suffixe (s, m, h, d). Es kann durch Signale unterbrochen werden.',
    mistakes: [
      'sleep in einer Busy-Wait-Schleife verwenden statt ereignisgesteuerter Wartemechanismen -- bevorzuge inotifywait, wait oder ordentliche Health-Check-Mechanismen.',
      'Lange sleep-Dauern in CI-Pipelines hartcodieren -- das verschwendet Runner-Zeit. Verwende stattdessen Retry-Logik mit exponentiellem Backoff.',
    ],
    bestPractices: [
      'Verwende sleep mit Dezimalwerten (sleep 0.5) fuer Sub-Sekunden-Verzoegerungen auf GNU-Systemen.',
      'Kombiniere mit until/while-Schleifen fuer Polling mit Timeout statt unbegrenztem Warten.',
    ],
  },

  time: {
    useCases: [
      'Wanduhr- und CPU-Zeit eines Befehls messen',
      'Performance verschiedener Ansaetze vergleichen',
      'Skripte profilen, um langsame Abschnitte zu finden',
    ],
    internals:
      'Das bash-Built-in time verwendet times(), um Shell- und Kindprozess-CPU-Zeit zu messen. Das externe /usr/bin/time verwendet wait4() und gibt real-, user- und sys-Zeit aus. User-Zeit ist CPU im User-Space; sys-Zeit ist CPU in Kernel-Syscalls.',
    mistakes: [
      'Das bash-Built-in time mit /usr/bin/time verwechseln -- das Built-in hat begrenzte Ausgabe. Verwende command time oder /usr/bin/time -v fuer detaillierte Statistiken wie Speicherverbrauch.',
      'Benchmarking mit einem einzigen Lauf -- Systemlast variiert. Fuehre Befehle mehrmals aus und bilde den Durchschnitt, oder verwende hyperfine fuer ordentliche Benchmarks.',
    ],
    bestPractices: [
      'Verwende /usr/bin/time -v (GNU) fuer detaillierte Ressourcennutzung einschliesslich max RSS.',
      'Verwende die TIMEFORMAT-Variable in bash, um die Ausgabe des Built-in time anzupassen.',
      'Fuer serioeoses Benchmarking verwende hyperfine statt manueller time-Aufrufe.',
    ],
  },

  seq: {
    useCases: [
      'Zahlensequenzen fuer Schleifen und Pipelines generieren',
      'Nummerierte Dateinamen oder Testdaten erstellen',
      'Bereiche mit benutzerdefinierten Schritten oder mit Nullen aufgefuellte Ausgabe erzeugen',
    ],
    internals:
      'seq gibt eine Zahlenfolge von Anfang bis Ende mit optionalem Inkrement aus. Intern verwendet es long-double-Arithmetik, was bei dezimalen Inkrementen zu Gleitkomma-Praezisionsproblemen fuehren kann.',
    mistakes: [
      'seq mit Gleitkomma-Inkrementen verwenden und exakte Werte erwarten -- Gleitkomma-Rundung kann unerwartete Ergebnisse liefern. Verwende awk oder bc fuer praezise Dezimalfolgen.',
      'Nicht ueber Brace-Expansion Bescheid wissen -- in bash ist {1..10} oft einfacher als $(seq 1 10) fuer Ganzzahlbereiche.',
    ],
    bestPractices: [
      'Verwende seq -w fuer mit Nullen aufgefuellte Ausgabe (z.B. 01, 02, ..., 10).',
      'Bevorzuge bash-Brace-Expansion {start..end..step}, wenn Portabilitaet zu Nicht-GNU-Systemen nicht noetig ist.',
      'Verwende seq -s, um das Trennzeichen zu aendern (z.B. seq -s, 1 5 ergibt 1,2,3,4,5).',
    ],
  },

  which: {
    useCases: [
      'Den vollstaendigen Pfad einer ausfuehrbaren Datei in deinem PATH finden',
      'Pruefen, welche Version eines Befehls ausgefuehrt wird',
      'PATH-Probleme debuggen, wenn das falsche Binary laeuft',
    ],
    internals:
      'which durchsucht die in PATH aufgelisteten Verzeichnisse von links nach rechts und gibt die erste passende ausfuehrbare Datei aus. Es kennt keine Shell-Built-ins, Aliases oder Funktionen.',
    mistakes: [
      'which zum Finden von Shell-Built-ins verwenden -- which durchsucht nur PATH. Verwende type oder command -v, um Built-ins, Aliases und Funktionen zu finden.',
      'Annehmen, dass which sich ueberall gleich verhaelt -- manche Systeme haben ein csh-Skript als which, das sich anders verhaelt. Bevorzuge command -v fuer portable Skripte.',
    ],
    bestPractices: [
      'Verwende command -v in Skripten fuer POSIX-portable Suche nach ausfuehrbaren Dateien.',
      'Verwende type -a, um alle Fundorte und Typen (Alias, Funktion, Built-in, Datei) eines Befehls zu sehen.',
    ],
  },

  man: {
    useCases: [
      'Offizielle Dokumentation fuer jeden installierten Befehl lesen',
      'Syscall-Schnittstellen (Sektion 2) oder Bibliotheksfunktionen (Sektion 3) nachschlagen',
      'Befehlsflags und Verwendungsbeispiele entdecken',
    ],
    internals:
      'man durchsucht eine Datenbank vorformatierter oder Quell-Manpages (troff/groff), die typischerweise in /usr/share/man gespeichert sind. Es leitet die formatierte Ausgabe durch einen Pager (normalerweise less). Die MANPATH-Variable und der mandb-Cache steuern, wo Seiten gefunden werden.',
    mistakes: [
      'Die Sektionsnummer nicht angeben -- man printf zeigt den Shell-Befehl, nicht die C-Funktion. Verwende man 3 printf fuer die C-Bibliotheksversion.',
      'Nicht ueber apropos Bescheid wissen -- wenn du den Befehlsnamen nicht kennst, verwende apropos <Stichwort> (oder man -k), um Man-Page-Beschreibungen zu durchsuchen.',
    ],
    bestPractices: [
      'Verwende man -k <Stichwort>, um relevante Man-Pages nach Thema zu suchen.',
      'Setze MANPAGER, um den Pager anzupassen (z.B. MANPAGER="less -R" fuer Farbunterstuetzung).',
      'Pruefe den EXAMPLES-Abschnitt am Ende von Man-Pages fuer schnelle Verwendungsmuster.',
    ],
  },

  clear: {
    useCases: [
      'Den Terminalbildschirm fuer eine frische Ansicht loeschen',
      'Visuelles Durcheinander waehrend interaktiver Debug-Sitzungen zuruecksetzen',
    ],
    internals:
      'clear sendet terminalspezifische Escape-Sequenzen (typischerweise aus der terminfo-Datenbank), um den Cursor nach oben zu bewegen und die Anzeige zu loeschen. Es loescht nicht den Scrollback in allen Terminals; verwende clear -x oder printf "\\033[3J" dafuer.',
    mistakes: [
      'Denken, dass clear den Scrollback loescht -- standardmaessig wird nur der sichtbare Bildschirm geloescht. Scrolle hoch, um vorherige Ausgaben zu sehen. Verwende reset fuer einen vollstaendigen Terminal-Reset.',
    ],
    bestPractices: [
      'Verwende Ctrl+L als Tastenkuerzel fuer clear in den meisten Shells.',
      'Verwende reset statt clear, wenn das Terminal in einem fehlerhaften Zustand ist (z.B. nach dem Catchen einer Binaerdatei).',
    ],
  },

  screen: {
    useCases: [
      'Langlebige Prozesse nach dem Trennen von SSH am Laufen halten',
      'Mehrere Terminal-Sitzungen in einer Verbindung multiplexen',
      'Eine Terminal-Sitzung mit einem anderen Benutzer fuer Pair-Debugging teilen',
    ],
    internals:
      'screen erstellt ein Pseudo-Terminal (pty) zwischen dem Benutzer-Terminal und Kindprozessen. Der screen-Prozess laeuft im Hintergrund weiter, sodass Kindprozesse Terminal-Trennungen ueberleben. Der Sitzungszustand wird in /var/run/screen oder /tmp/screens gespeichert.',
    mistakes: [
      'Versehentlich screen-Sitzungen verschachteln -- Ctrl-a innerhalb einer verschachtelten screen-Sitzung sendet den Befehl an die aeussere Sitzung. Verwende Ctrl-a a, um ihn durchzureichen.',
      'Sitzungen nicht benennen -- ohne Namen wird das Verwalten mehrerer getrennter Sitzungen unuebersichtlich. Verwende screen -S name.',
    ],
    bestPractices: [
      'Benenne deine Sitzungen: screen -S meinprojekt fuer einfaches Wiederanhaengen.',
      'Verwende screen -rd, um eine anderswo angehaengte Sitzung wiederzuverbinden.',
      'Erwaege tmux als modernere Alternative mit besserer Skript-Unterstuetzung.',
    ],
  },

  tmux: {
    useCases: [
      'Persistente Terminal-Sitzungen aufrechterhalten, die SSH-Trennungen ueberleben',
      'Ein Terminal in mehrere Panes und Fenster fuer paralleles Arbeiten aufteilen',
      'Komplexe Multi-Pane-Entwicklungsumgebungen skripten',
    ],
    internals:
      'tmux fuehrt einen Serverprozess aus, der alle Sitzungen besitzt. Clients verbinden sich ueber einen Unix-Socket (Standard: /tmp/tmux-UID/default) mit dem Server. Jedes Pane ist ein separates pty. Der Server bleibt bestehen, bis alle Sitzungen beendet werden, und erlaubt Detach/Reattach.',
    mistakes: [
      'Vergessen, vor dem Schliessen des Terminals zu detachen -- das Schliessen des Terminal-Fensters kann den tmux-Client beenden, aber die Sitzung bleibt bestehen. Verwende explizit tmux detach (Ctrl-b d).',
      'Nicht wissen, wie man scrollt -- tmux faengt Eingaben ab, sodass normales Scrollen nicht funktioniert. Wechsle mit Ctrl-b [ in den Copy-Modus und verwende Pfeiltasten oder Page Up.',
      'Verschachtelte tmux-Sitzungen verursachen Prefix-Key-Verwirrung -- setze einen anderen Prefix in inneren Sitzungen oder verwende send-prefix.',
    ],
    bestPractices: [
      'Verwende tmux new -s name, um Sitzungen fuer einfache Verwaltung zu benennen.',
      'Lerne die Tastenkuerzel: Ctrl-b % (vertikaler Split), Ctrl-b " (horizontaler Split), Ctrl-b d (Detach).',
      'Verwende eine .tmux.conf, um Tastenbelegungen, Statusleiste und Standard-Shell anzupassen.',
      'Verwende tmuxinator oder tmux-resurrect, um komplexe Layouts zu speichern und wiederherzustellen.',
    ],
  },

  locate: {
    useCases: [
      'Dateien schnell anhand des Namens im gesamten Dateisystem finden',
      'Dateien schneller als find suchen, indem eine vorgefertigte Datenbank genutzt wird',
      'Konfigurationsdateien oder Bibliotheken finden, wenn ein Teil des Namens bekannt ist',
    ],
    internals:
      'locate durchsucht eine vorgefertigte Datenbank (normalerweise /var/lib/mlocate/mlocate.db), die von updatedb erstellt wird, das typischerweise taeglich per cron laeuft. Die Datenbank speichert Dateipfade, sodass Abfragen im Vergleich zum Durchlaufen des Dateisystems nahezu sofort sind.',
    mistakes: [
      'Veraltete Ergebnisse erhalten -- locate verwendet eine Datenbank, die Stunden oder Tage alt sein kann. Fuehre zuerst sudo updatedb aus, wenn aktuelle Ergebnisse benoetigt werden.',
      'Dateien finden, auf die man keinen Zugriff hat -- standardmaessig kann locate Dateien anzeigen, die du nicht lesen darfst. mlocate prueft Berechtigungen zur Abfragezeit.',
    ],
    bestPractices: [
      'Verwende locate -i fuer Suche ohne Beruecksichtigung der Gross-/Kleinschreibung.',
      'Verwende locate -r fuer Regex-Musterabgleich.',
      'Fuehre sudo updatedb aus, nachdem du neue Dateien erstellt hast, wenn du sie sofort finden musst.',
    ],
  },

  export: {
    useCases: [
      'Shell-Variablen fuer Kindprozesse verfuegbar machen',
      'Umgebungsvariablen fuer Anwendungen setzen (z.B. export PATH=...)',
      'Toolverhalten ueber die Umgebung konfigurieren (z.B. export EDITOR=vim)',
    ],
    internals:
      'export markiert eine Variable, sodass sie in die Umgebung jedes nachfolgend geforkten Kindprozesses kopiert wird. Die Umgebung wird ueber den execve-Syscall uebergeben. Ohne export existieren Variablen nur in der aktuellen Shell.',
    mistakes: [
      'Vergessen zu exportieren -- VAR=value ohne export setzen bedeutet, dass Kindprozesse es nicht sehen koennen. Verwende export VAR=value.',
      'Erwarten, dass exportierte Variablen nach oben propagieren -- Kindprozesse koennen die Elternumgebung nicht aendern. Verwende source, um Variablen in die aktuelle Shell zu laden.',
    ],
    bestPractices: [
      'Kombiniere Zuweisung und Export: export VAR=value statt zwei separate Befehle.',
      'Verwende export -p, um alle exportierten Variablen zum Debuggen aufzulisten.',
      'Setze persistente Exports in ~/.bashrc (interaktiv) oder ~/.profile (Login-Shells).',
    ],
  },

  'read-builtin': {
    useCases: [
      'Benutzereingaben interaktiv in Skripten lesen',
      'Zeilen aus Dateien oder Pipes in Variablen parsen',
      'Einfache Eingabeaufforderungen und Bestaetigungsdialoge in bash implementieren',
    ],
    internals:
      'read ist ein bash-Built-in, das eine Zeile von stdin (oder einem Dateideskriptor mit -u) liest, sie anhand von IFS aufteilt und die resultierenden Woerter benannten Variablen zuweist. Die letzte Variable erhaelt den Rest der Zeile.',
    mistakes: [
      'IFS in while-read-Schleifen vergessen -- ohne IFS-Setzung werden fuehrende/nachfolgende Leerzeichen entfernt. Verwende while IFS= read -r line, um Leerzeichen zu erhalten.',
      'Das -r-Flag weglassen -- ohne -r werden Backslashes als Escape-Zeichen behandelt. Verwende immer read -r, es sei denn, du willst explizit Backslash-Interpretation.',
      'In einer Pipeline in read pipen -- in bash laufen Pipeline-Befehle in Subshells, sodass von read gesetzte Variablen verloren gehen. Verwende Process-Substitution: while read line; do ...; done < <(command).',
    ],
    bestPractices: [
      'Verwende immer read -r, um Backslash-Interpretation zu verhindern.',
      'Verwende IFS= read -r line, um Zeilen woertlich zu lesen.',
      'Verwende read -p "Eingabe: " var fuer interaktive Eingabeaufforderungen mit Nachricht.',
      'Verwende read -s fuer Passworteingabe (deaktiviert Echo).',
    ],
  },

  test: {
    useCases: [
      'Dateiexistenz, -typ und Berechtigungen in Skripten pruefen',
      'Zeichenketten und Ganzzahlen in bedingten Ausdruecken vergleichen',
      'Bedingungen in if-Anweisungen und while-Schleifen auswerten',
    ],
    internals:
      'test (auch als [ aufgerufen) wertet einen bedingten Ausdruck aus und beendet sich mit 0 (wahr) oder 1 (falsch). Das bash-Built-in [[ ist eine erweiterte Version, die Regex-Abgleich unterstuetzt und kein Quoting von Variablen erfordert, um Word-Splitting zu verhindern.',
    mistakes: [
      'Leerzeichen um [ und ] vergessen -- [ ist ein Befehl, also scheitert [\"$x\" = \"y\"]. Verwende [ \"$x\" = \"y\" ] mit Leerzeichen.',
      '= vs -eq falsch verwenden -- = ist fuer Zeichenkettenvergleich, -eq ist fuer Ganzzahlvergleich. Verwechslung liefert falsche Ergebnisse.',
      'Variablen nicht quoten -- nicht gequotete leere Variablen verursachen Syntaxfehler. Immer quoten: [ \"$var\" = \"value\" ].',
    ],
    bestPractices: [
      'Bevorzuge [[ ]] gegenueber [ ] in bash-Skripten fuer sicherere Syntax (kein Word-Splitting, unterstuetzt && und ||).',
      'Verwende -f fuer Dateien, -d fuer Verzeichnisse, -z fuer leere Zeichenketten, -n fuer nicht-leere Zeichenketten.',
      'Setze Variablen innerhalb von [ ] immer in Anfuehrungszeichen, um Fehler mit leeren oder leerzeichenhaltigen Werten zu verhindern.',
    ],
  },

  bc: {
    useCases: [
      'Beliebig praezise Arithmetik von der Kommandozeile ausfuehren',
      'Gleitkomma-Berechnungen durchfuehren, die bash nativ nicht beherrscht',
      'Zwischen Zahlensystemen konvertieren (hex, binaer, dezimal)',
    ],
    internals:
      'bc ist eine POSIX-Rechnersprache mit beliebiger Praezision. Es liest Ausdruecke von stdin, kompiliert sie in Bytecode und fuehrt sie aus. Das -l-Flag laedt eine Mathematik-Bibliothek mit Sinus, Kosinus, Exp, Log und setzt scale auf 20.',
    mistakes: [
      'Standardmaessig Ganzzahldivision erhalten -- bc verwendet standardmaessig scale=0, sodass 5/3 den Wert 1 liefert. Setze scale=2 (oder verwende -l) fuer Dezimalergebnisse.',
      'Vergessen, Ausdruecke zu echoen -- bc liest stdin, verwende also echo "5/3" | bc -l in Skripten.',
    ],
    bestPractices: [
      'Verwende bc -l fuer Gleitkomma-Mathematik mit einer Standard-Genauigkeit von 20.',
      'Setze scale explizit fuer die benoetigte Praezision: echo "scale=4; 10/3" | bc.',
      'Verwende obase und ibase fuer Basiskonvertierung: echo "obase=16; 255" | bc gibt FF aus.',
    ],
  },

  'xdg-open': {
    useCases: [
      'Eine Datei oder URL mit der Standardanwendung auf Linux-Desktops oeffnen',
      'Einen Browser fuer eine URL aus einem Skript starten',
      'Dokumente, Bilder oder PDFs vom Terminal aus oeffnen',
    ],
    internals:
      'xdg-open ist ein Shell-Skript aus xdg-utils, das die Desktop-Umgebung erkennt (GNOME, KDE, XFCE usw.) und an den entsprechenden Oeffner delegiert (gio open, kde-open, exo-open). Es verwendet MIME-Typ-Zuordnungen aus ~/.config/mimeapps.list und der gemeinsamen MIME-Datenbank.',
    mistakes: [
      'xdg-open auf macOS oder WSL verwenden -- xdg-open ist Linux-spezifisch. Verwende open auf macOS und wslview oder explorer.exe auf WSL.',
      'Keine Desktop-Umgebung haben -- xdg-open erfordert eine laufende DE oder zumindest einen konfigurierten Handler. Es scheitert auf Headless-Servern.',
    ],
    bestPractices: [
      'Verwende xdg-mime, um Standard-Anwendungen fuer MIME-Typen abzufragen oder zu setzen.',
      'Wickle in plattformuebergreifenden Skripten xdg-open/open/start in eine plattformerkennende Funktion.',
    ],
  },

  type: {
    useCases: [
      'Bestimmen, ob ein Befehl ein Built-in, Alias, eine Funktion oder ein externes Binary ist',
      'Debuggen, welche Version eines Befehls die Shell ausfuehren wird',
      'Verifizieren, dass ein Befehl existiert, bevor er in einem Skript verwendet wird',
    ],
    internals:
      'type ist ein Shell-Built-in, das Aliases, Funktionen, Built-ins und PATH-Eintraege der Reihe nach durchsucht, um zu beschreiben, wie die Shell einen Befehlsnamen interpretieren wuerde. Im Gegensatz zu which sieht es den vollstaendigen Shell-Namespace.',
    mistakes: [
      'which statt type verwenden -- which durchsucht nur PATH und uebersieht Built-ins, Aliases und Funktionen.',
      'type -a nicht verwenden -- ohne -a siehst du nur den ersten Treffer. Verwende type -a, um alle Definitionen zu sehen.',
    ],
    bestPractices: [
      'Verwende type -a command, um jede Definition zu sehen (Alias, Funktion, Built-in und alle PATH-Treffer).',
      'Verwende command -v in Skripten als portable Methode zu pruefen, ob ein Befehl existiert.',
    ],
  },

  'set-shopt': {
    useCases: [
      'Shell-Verhaltensoptionen wie Fehlerbehandlung und Globbing konfigurieren',
      'Strikten Modus in Skripten mit set -euo pipefail aktivieren',
      'Bash-spezifische Features mit shopt umschalten (z.B. globstar, extglob)',
    ],
    internals:
      'set aendert POSIX-Shell-Optionen und Positionsparameter. shopt ist bash-spezifisch und steuert erweiterte Features. set -e bewirkt, dass die Shell bei jedem Befehlsfehler abbricht; set -u behandelt nicht gesetzte Variablen als Fehler; set -o pipefail laesst Pipelines scheitern, wenn eine Komponente scheitert.',
    mistakes: [
      'Die set -e-Semantik nicht verstehen -- Befehle in if-Bedingungen, ||-Ketten und &&-Ketten loesen keinen Exit bei Fehler aus, was zu unerwartetem Verhalten fuehrt.',
      'set -o pipefail vergessen -- ohne es gibt eine Pipeline nur den Exit-Status des letzten Befehls zurueck und verbirgt Fehler in frueheren Stufen.',
      'set -e in Funktionen verwenden, die aus bedingten Kontexten aufgerufen werden -- das -e-Flag wird in diesen Kontexten ausgesetzt, was verwirrend sein kann.',
    ],
    bestPractices: [
      'Beginne Skripte mit set -euo pipefail als "strikter Modus"-Grundlage.',
      'Verwende shopt -s globstar, um ** rekursives Globbing in bash zu aktivieren.',
      'Verwende shopt -s nullglob, damit ungematchte Globs zu nichts expandieren statt zum woertlichen Muster.',
      'Dokumentiere jede Abweichung vom strikten Modus mit Kommentaren, die erklaeren, warum.',
    ],
  },

  trap: {
    useCases: [
      'Temporaere Dateien beim Skript-Exit aufraeumen, auch bei Fehlern oder Unterbrechungen',
      'Signale (z.B. SIGINT, SIGTERM) in langlebigen Skripten ordentlich behandeln',
      'Finalisierungscode ausfuehren, unabhaengig davon, wie ein Skript beendet wird',
    ],
    internals:
      'trap ist ein Shell-Built-in, das einen Befehlsstring registriert, der ausgefuehrt wird, wenn die Shell ein bestimmtes Signal oder Pseudo-Signal (EXIT, ERR, DEBUG, RETURN) empfaengt. Der Trap-Handler laeuft im aktuellen Shell-Kontext mit Zugriff auf alle Variablen.',
    mistakes: [
      'Vergessen, den Trap-Befehl zu quoten -- trap rm -f $tmpfile EXIT bricht, weil $tmpfile zum Definitionszeitpunkt expandiert wird. Verwende einfache Anfuehrungszeichen: trap \'rm -f "$tmpfile"\' EXIT.',
      'Nicht mehrere Signale behandeln -- nur EXIT zu trappen uebersieht Faelle, in denen das Skript gekillt wird. Trappe sowohl EXIT als auch relevante Signale wie SIGINT und SIGTERM.',
    ],
    bestPractices: [
      'Verwende trap cleanup EXIT als primaeren Aufraeum-Mechanismus -- es feuert bei normalem Exit, Fehlern und den meisten Signalen.',
      'Erstelle eine Aufraeum-Funktion und trappe sie: cleanup() { rm -f "$tmp"; }; trap cleanup EXIT.',
      'Verwende trap - SIGNAL, um einen Trap auf sein Standardverhalten zurueckzusetzen.',
    ],
  },

  eval: {
    useCases: [
      'Dynamisch konstruierte Befehlsstrings ausfuehren',
      'Indirekte Variablenexpansion in aelteren bash-Versionen durchfuehren',
      'Befehle verarbeiten, die aus Benutzereingaben oder Konfiguration erstellt wurden (mit Vorsicht)',
    ],
    internals:
      'eval verkettet seine Argumente und parst und fuehrt dann den resultierenden String als Shell-Befehl aus. Das bedeutet eine zweite Expansionsrunde: Variablen, Command-Substitutions und Globbing werden erneut ausgewertet.',
    mistakes: [
      'Code-Injection-Schwachstellen einfuehren -- eval fuehrt beliebigen Code aus. Niemals eval mit unbereinigten Benutzereingaben verwenden. Dies ist der gefaehrlichste Shell-Befehl.',
      'eval verwenden, wenn einfachere Alternativen existieren -- bash nameref (declare -n), Arrays oder indirekte Expansion (${!var}) beseitigen oft die Notwendigkeit fuer eval.',
    ],
    bestPractices: [
      'Vermeide eval wann immer moeglich. Verwende stattdessen bash-Arrays, Namerefs (declare -n) oder indirekte Expansion.',
      'Wenn eval wirklich noetig ist, validiere und bereinige alle Eingaben rigoros.',
      'Dokumentiere mit einem Kommentar, warum eval noetig ist und warum Alternativen nicht ausreichen.',
    ],
  },

  tput: {
    useCases: [
      'Farben und Formatierung zur Terminal-Ausgabe in Skripten hinzufuegen',
      'Terminal-Faehigkeiten (Spalten, Zeilen) portabel abfragen',
      'Cursorposition fuer dynamische Terminal-Interfaces steuern',
    ],
    internals:
      'tput fragt die terminfo-Datenbank fuer den aktuellen Terminaltyp (aus TERM) ab und gibt die entsprechende Escape-Sequenz aus. Das ist portabler als hartcodierte ANSI-Escape-Codes, da es sich an die tatsaechlichen Terminal-Faehigkeiten anpasst.',
    mistakes: [
      'ANSI-Escapes hartcodieren statt tput zu verwenden -- nicht alle Terminals unterstuetzen ANSI. tput verwendet die terminfo-Datenbank fuer korrekte Sequenzen.',
      'Vergessen, Formatierung zurueckzusetzen -- wenn du Bold oder Farbe setzt und nicht zuruecksetzt, erbt nachfolgende Ausgabe die Formatierung. Verwende immer tput sgr0 zum Zuruecksetzen.',
    ],
    bestPractices: [
      'Verwende tput colors, um zu pruefen, ob das Terminal Farben unterstuetzt, bevor du Farbcodes ausgibst.',
      'Verwende tput cols und tput lines, um Terminalabmessungen fuer responsive Ausgabe zu erhalten.',
      'Speichere tput-Aufrufe in Variablen am Skriptanfang fuer Performance: bold=$(tput bold); reset=$(tput sgr0).',
    ],
  },

  yes: {
    useCases: [
      'Interaktive Eingabeaufforderungen in Skripten automatisch bestaetigen (z.B. yes | apt-get install)',
      'Einen Strom wiederholter Zeichenketten zum Testen generieren',
      'Pipelines mit hohem Durchsatz-Input Stresstests unterziehen',
    ],
    internals:
      'yes schreibt wiederholt eine Zeichenkette (Standard "y") mit maximaler Geschwindigkeit auf stdout, bis es beendet wird oder die Pipe schliesst. Moderne Implementierungen verwenden gepufferte Schreibvorgaenge fuer Durchsatz -- GNU yes kann mehrere GB/s ausgeben.',
    mistakes: [
      'yes ohne Pipe ausfuehren -- es fuellt das Terminal endlos. Immer pipen oder umleiten.',
      'yes unvorsichtig verwenden, um Sicherheitsabfragen zu umgehen -- automatisches Bestaetigen destruktiver Operationen wie rm -ri kann zu Datenverlust fuehren.',
    ],
    bestPractices: [
      'Bevorzuge befehlsspezifische nicht-interaktive Flags (z.B. apt-get -y, rm -f) gegenueber dem Pipen von yes.',
      'Verwende yes zum Testen oder wenn kein nicht-interaktives Flag verfuegbar ist.',
    ],
  },

  // ─── FILE INSPECTION (13) ──────────────────────────────────────────

  file: {
    useCases: [
      'Den Typ einer Datei identifizieren, ohne sich auf die Erweiterung zu verlassen',
      'Pruefen, ob eine Datei binaer oder Text ist, bevor sie verarbeitet wird',
      'Dateikodierung, Kompressionsformat oder Bildabmessungen erkennen',
    ],
    internals:
      'file fuehrt drei Tests der Reihe nach durch: Dateisystem-Tests (stat), Magic-Number-Tests (Byte-Muster-Vergleich mit /usr/share/misc/magic) und Sprachtests (Pruefung auf Textmuster). Es meldet den ersten Treffer.',
    mistakes: [
      'Dateierweiterungen vertrauen -- file untersucht den Inhalt, nicht den Namen. Eine .jpg koennte eine umbenannte ausfuehrbare Datei sein.',
      'Annehmen, dass file fuer Sicherheit massgeblich ist -- file kann mit Polyglot-Dateien oder manipulierten Headern getaeuscht werden. Verwende es nicht als Sicherheitsgate.',
    ],
    bestPractices: [
      'Verwende file -i fuer MIME-Typ-Ausgabe, geeignet fuer programmatische Nutzung.',
      'Verwende file -b fuer kurze Ausgabe ohne Dateinamen-Praefix.',
      'Kombiniere mit find fuer Massenanalyse: find . -exec file {} +.',
    ],
  },

  stat: {
    useCases: [
      'Detaillierte Datei-Metadaten anzeigen: Groesse, Berechtigungen, Zeitstempel, Inode',
      'Exakte Aenderungszeit fuer Build-Systeme oder Caching pruefen',
      'Dateisystem- und Inode-Informationen fuer eine Datei ermitteln',
    ],
    internals:
      'stat ruft den stat()- oder lstat()-Syscall auf, um die Inode-Metadaten zu lesen. Es gibt Groesse, Bloecke, Inode-Nummer, Berechtigungen (Modus), Eigentuemer/Gruppe und drei Zeitstempel aus: Zugriff (atime), Aenderung (mtime) und Aenderung des Inodes (ctime).',
    mistakes: [
      'ctime mit Erstellungszeit verwechseln -- ctime ist die Inode-Aenderungszeit (Berechtigungs- oder Link-Aenderungen), nicht die Erstellungszeit. Linux ext4 speichert die Geburtszeit (crtime), zugaenglich ueber stat -c %W auf neueren Systemen.',
      'Inkompatible Formatoptionen verwenden -- GNU stat verwendet -c fuer Formatstrings, waehrend BSD/macOS stat -f verwendet. Skripte muessen dies beruecksichtigen.',
    ],
    bestPractices: [
      'Verwende stat -c "%s" file fuer Dateigroesse in Bytes (GNU) zum Skripten.',
      'Verwende stat -c "%a %U %G" file, um oktale Berechtigungen und Eigentuemer zu sehen.',
      'Fuer plattformuebergreifende Skripte die stat-Variante erkennen oder portable Alternativen verwenden.',
    ],
  },

  md5sum: {
    useCases: [
      'Dateiintegritaet nach Downloads oder Uebertragungen verifizieren',
      'Pruefsummen fuer eine Menge von Dateien zum Vergleich generieren',
      'Versehentliche Dateikorruption oder -aenderung erkennen',
    ],
    internals:
      'md5sum berechnet den MD5-Message-Digest (128-Bit-Hash), indem die Datei in Bloecken durch den MD5-Algorithmus verarbeitet wird. Es gibt einen Hexadezimal-Hash und Dateinamen aus. Das -c-Flag liest eine Pruefsummendatei und verifiziert jeden Eintrag.',
    mistakes: [
      'MD5 fuer Sicherheitszwecke verwenden -- MD5 ist kryptografisch gebrochen; Kollisionen koennen gezielt erstellt werden. Verwende sha256sum fuer sicherheitsrelevante Verifizierung.',
      'Binaermodus unter Windows vergessen -- bei plattformuebergreifender Nutzung verwende md5sum -b fuer konsistentes Binaer-Checksumming.',
    ],
    bestPractices: [
      'Verwende sha256sum statt md5sum fuer alle sicherheitsrelevanten Integritaetspruefungen.',
      'Verwende md5sum -c checksums.md5 zur Batch-Verifizierung von Dateien gegen eine Pruefsummendatei.',
      'Verwende md5sum nur fuer schnelle nicht-sicherheitsrelevante Integritaetspruefungen oder Legacy-Kompatibilitaet.',
    ],
  },

  strings: {
    useCases: [
      'Lesbaren Text aus Binaerdateien zur Analyse extrahieren',
      'Hartcodierte Zeichenketten, URLs oder Fehlermeldungen in ausfuehrbaren Dateien finden',
      'Schnelle Sichtung verdaechtiger Binaerdateien oder Firmware-Images',
    ],
    internals:
      'strings scannt eine Datei nach Sequenzen druckbarer Zeichen einer Mindestlaenge (Standard 4). Standardmaessig scannt es nur initialisierte und geladene Datensektionen von Objektdateien; verwende -a, um die gesamte Datei zu scannen.',
    mistakes: [
      'Das -a-Flag nicht verwenden -- standardmaessig scannt strings nur bestimmte Sektionen von Objektdateien. Verwende strings -a, um die gesamte Datei zu scannen, besonders fuer Nicht-ELF-Dateien.',
      'Sich auf strings-Ausgabe fuer Sicherheitsanalysen verlassen -- strings kann verschleierte oder kodierte Daten uebersehen. Verwende es als Ausgangspunkt, nicht als definitive Analyse.',
    ],
    bestPractices: [
      'Verwende strings -n N, um die Mindest-Stringlaenge festzulegen (z.B. -n 8 fuer laengere Strings).',
      'Pipe durch grep, um nach interessanten Mustern zu filtern: strings binary | grep -i password.',
      'Verwende strings -t x, um den Offset jedes Strings fuer weitere Untersuchung anzuzeigen.',
    ],
  },

  hexdump: {
    useCases: [
      'Rohen binaeren Dateiinhalt Byte fuer Byte inspizieren',
      'Dateiformat-Probleme oder binaere Protokolle debuggen',
      'Nicht druckbare Zeichen und exakte Bytewerte anzeigen',
    ],
    internals:
      'hexdump liest die Datei und formatiert jedes Byte als Hexadezimalwert (und optional ASCII). Es unterstuetzt benutzerdefinierte Formatstrings ueber -e. Das -C-Flag erzeugt die kanonische Hex+ASCII-Seite-an-Seite-Anzeige.',
    mistakes: [
      'hexdump ohne -C verwenden -- das Standard-Ausgabeformat ist verwirrend mit 16-Bit-Woertern in Little-Endian-Reihenfolge. Verwende hexdump -C fuer das vertraute Hex+ASCII-Layout.',
      'xxd nicht kennen -- fuer einfacheres Hex-Dumping und Umkehren ist xxd oft intuitiver als hexdump.',
    ],
    bestPractices: [
      'Verwende hexdump -C fuer die kanonische Hex+ASCII-Anzeige.',
      'Verwende hexdump -n N, um die Ausgabe auf die ersten N Bytes zu begrenzen.',
      'Erwaege xxd als benutzerfreundlichere Alternative mit Umkehr-Faehigkeit (-r).',
    ],
  },

  ldd: {
    useCases: [
      'Shared-Library-Abhaengigkeiten eines Binarys oder Shared-Objects auflisten',
      '"Bibliothek nicht gefunden"-Fehler zur Laufzeit debuggen',
      'Verifizieren, dass ein Binary gegen erwartete Bibliotheksversionen linkt',
    ],
    internals:
      'ldd ruft den dynamischen Linker (ld-linux.so) mit speziellen Umgebungsvariablen auf, um die Bibliotheksaufloesung nachzuverfolgen. Es durchlaeuft den Abhaengigkeitsbaum und durchsucht Pfade in DT_RPATH, DT_RUNPATH, LD_LIBRARY_PATH, ldconfig-Cache und Standardpfaden.',
    mistakes: [
      'ldd auf nicht vertrauenswuerdigen Binarys ausfuehren -- ldd kann das Binary ausfuehren, um Abhaengigkeiten aufzuloesen, was ein Sicherheitsrisiko darstellt. Verwende stattdessen objdump -p oder readelf -d bei nicht vertrauenswuerdigen Dateien.',
      '"not found"-Eintraege ignorieren -- diese zeigen fehlende Bibliotheken an, die Laufzeitfehler verursachen. Installiere die fehlende Bibliothek oder korrigiere LD_LIBRARY_PATH.',
    ],
    bestPractices: [
      'Fuehre ldd niemals auf nicht vertrauenswuerdigen ausfuehrbaren Dateien aus; verwende stattdessen readelf -d oder objdump -p.',
      'Verwende ldd -v fuer ausfuehrliche Ausgabe mit Versionsinformationen.',
      'Behebe fehlende Bibliotheken durch Installation des richtigen Pakets oder Setzen von LD_LIBRARY_PATH.',
    ],
  },

  nm: {
    useCases: [
      'Symbole (Funktionen, Variablen) in Objektdateien oder Bibliotheken auflisten',
      'Undefinierte-Symbol-Fehler beim Linken debuggen',
      'Pruefen, ob eine Bibliothek eine bestimmte Funktion exportiert',
    ],
    internals:
      'nm liest die Symboltabelle aus ELF-Objektdateien, Archiv-Bibliotheken (.a) oder Shared Objects. Es zeigt Symbolnamen, Adressen und Typen an (T=Text/Code, D=Daten, U=Undefiniert, B=BSS). Gestrippte Binarys haben keine Symboltabelle.',
    mistakes: [
      'nm auf einem gestrippten Binary ausfuehren -- gestrippte Binarys haben keine Symboltabellen, sodass nm nichts anzeigt. Verwende nm -D fuer dynamische Symbole oder readelf --dyn-syms.',
      'Symboltypen verwechseln -- U bedeutet undefiniert (muss gelinkt werden), T bedeutet definiert in der Text-Sektion. Fehlinterpretation fuehrt zu falschen Schlussfolgerungen beim Linken.',
    ],
    bestPractices: [
      'Verwende nm -D, um dynamische Symbole in Shared Libraries aufzulisten.',
      'Verwende nm -C, um C++-Symbolnamen fuer bessere Lesbarkeit zu demangglen.',
      'Kombiniere mit grep, um nach bestimmten Symbolen zu suchen: nm libfoo.so | grep my_function.',
    ],
  },

  objdump: {
    useCases: [
      'Kompilierte Binarys disassemblieren, um Maschinencode zu inspizieren',
      'Section-Header, Relocations und Symboltabellen von Objektdateien anzeigen',
      'Kompilierten Code auf Assembler-Ebene reverse-engineeren oder debuggen',
    ],
    internals:
      'objdump verwendet die BFD-Bibliothek (Binary File Descriptor), um ELF-, PE- und andere Objektformate zu parsen. Es kann mit dem integrierten Disassembler fuer die Zielarchitektur disassemblieren und Header, Relocations und Debug-Informationen anzeigen.',
    mistakes: [
      'Disassemblieren ohne Architektur-Angabe fuer cross-kompilierte Binarys -- verwende -m, um die Zielarchitektur zu setzen.',
      '-d vs -D nicht korrekt verwenden -- -d disassembliert nur Code-Sektionen; -D disassembliert alle Sektionen einschliesslich Daten, was irrefuehrende Ausgabe erzeugt.',
    ],
    bestPractices: [
      'Verwende objdump -d zum Disassemblieren nur der Code-Sektionen.',
      'Verwende objdump -h, um Section-Header und deren Groessen/Adressen anzuzeigen.',
      'Kombiniere mit -C fuer C++-Name-Demangling: objdump -d -C binary.',
      'Fuer tiefere Analyse erwaege radare2 oder Ghidra als leistungsfaehigere Alternativen.',
    ],
  },

  readelf: {
    useCases: [
      'ELF-Binary-Header, Sektionen und Segmente inspizieren',
      'Dynamische Linking-Informationen sicher anzeigen (im Gegensatz zu ldd)',
      'Debug-Informationen, Symboltabellen und Relocation-Eintraege untersuchen',
    ],
    internals:
      'readelf parst ELF-Formatstrukturen direkt ohne die BFD-Bibliothek, was es unabhaengig von libbfd macht. Es liest ELF-Header, Programm-Header, Sektions-Header, Symboltabellen und dynamische Segmente aus dem Binary.',
    mistakes: [
      'readelf mit objdump verwechseln -- readelf ist ELF-spezifisch, haengt aber nicht von BFD ab. objdump unterstuetzt mehrere Formate, verwendet aber BFD. readelf liefert detailliertere ELF-spezifische Informationen.',
      '-W fuer breite Ausgabe nicht verwenden -- lange Symbolnamen werden ohne -W (--wide) abgeschnitten.',
    ],
    bestPractices: [
      'Verwende readelf -d, um dynamische Abhaengigkeiten sicher zu inspizieren statt ldd bei nicht vertrauenswuerdigen Binarys.',
      'Verwende readelf -h, um den ELF-Header anzuzeigen (Architektur, Eintrittspunkt, Typ).',
      'Verwende readelf -s fuer vollstaendige Symboltabellen und readelf --dyn-syms fuer dynamische Symbole.',
    ],
  },

  sha256sum: {
    useCases: [
      'Dateiintegritaet nach Downloads kryptografisch verifizieren',
      'Pruefsummen fuer Software-Releases und Verteilung generieren',
      'Dateiinhalte vergleichen, ohne die tatsaechlichen Daten zu untersuchen',
    ],
    internals:
      'sha256sum berechnet den SHA-256-Hash (256-Bit) mit dem SHA-2-Familien-Algorithmus. Die Datei wird in Bloecken verarbeitet und der Hash wird als 64 Hexadezimalzeichen ausgegeben. SHA-256 gilt derzeit als sicher gegen Kollisions- und Preimage-Angriffe.',
    mistakes: [
      'Den Hash visuell statt programmatisch pruefen -- manueller Vergleich ist fehleranfaellig. Verwende sha256sum -c zur automatischen Verifizierung.',
      'Die Pruefsummendatei ueber einen unsicheren Kanal herunterladen -- wenn ein Angreifer den Download aendern kann, kann er auch die Pruefsumme aendern. Verifiziere Pruefsummen ueber eine signierte Quelle oder HTTPS.',
    ],
    bestPractices: [
      'Verwende sha256sum -c SHA256SUMS, um mehrere Dateien automatisch zu verifizieren.',
      'Verifiziere Pruefsummen immer aus einer vertrauenswuerdigen, unabhaengigen Quelle (z.B. GPG-signierte Pruefsummendateien).',
      'Verwende sha256sum statt md5sum fuer alle Integritaets-Verifizierungsaufgaben.',
    ],
  },

  xxd: {
    useCases: [
      'Hex-Dumps von Dateien mit sauberer Seite-an-Seite-Anzeige erstellen',
      'Hex-Dumps mit dem -r-Flag (Umkehr) zurueck in Binaer konvertieren',
      'Binaerdateien patchen, indem ein Hex-Dump bearbeitet und zurueckkonvertiert wird',
    ],
    internals:
      'xxd liest Eingaben Byte fuer Byte und formatiert sie als Hexadezimal mit optionaler ASCII-Anzeige. Das -r-Flag kehrt den Prozess um, parst Hexwerte und schreibt binaere Ausgabe. Es verarbeitet kontinuierliche Hex-Streams oder formatierte Dumps.',
    mistakes: [
      '-r fuer Umkehroperationen vergessen -- xxd erstellt standardmaessig Hex-Dumps. Verwende xxd -r, um Hex zurueck in Binaer zu konvertieren.',
      'ASCII-Spalte im Hex-Dump vor dem Umkehren aendern -- xxd -r liest nur die Hex-Spalten, nicht die ASCII-Spalte. Aenderungen an der ASCII-Seite werden ignoriert.',
    ],
    bestPractices: [
      'Verwende xxd -p fuer einen reinen Hex-Dump ohne Adressen oder ASCII (nuetzlich zum Pipen).',
      'Binaer-Patching-Workflow: xxd file > file.hex, Hexwerte bearbeiten, xxd -r file.hex > file.patched.',
      'Verwende xxd -l N, um die Ausgabe auf die ersten N Bytes zu begrenzen.',
    ],
  },

  od: {
    useCases: [
      'Dateiinhalte in oktal, hex, dezimal oder Zeichenformat dumpen',
      'Binaerdaten mit benutzerdefinierten Ausgabeformaten inspizieren',
      'Rohe Bytes in anderen Formaten als Hex anzeigen, wenn noetig',
    ],
    internals:
      'od (Octal Dump) liest Dateien und zeigt Inhalte im angegebenen Zahlensystem an. Es ist ein POSIX-Standardtool, was es portabler als xxd oder hexdump macht. Es unterstuetzt verschiedene Ausgabeformate ueber -t (z.B. -t x1 fuer Hex-Bytes).',
    mistakes: [
      'Standard-Oktalausgabe verwenden, wenn Hex beabsichtigt ist -- od verwendet standardmaessig Oktal (Basis 8), was selten gewuenscht ist. Verwende od -A x -t x1z fuer Hex-Ausgabe.',
      'xxd und hexdump nicht kennen -- od ist portabel, aber weniger benutzerfreundlich. Verwende xxd oder hexdump -C fuer lesbarere Ausgabe.',
    ],
    bestPractices: [
      'Verwende od -A x -t x1z fuer Hex-Byte-Anzeige mit ASCII-Seitenleiste.',
      'Verwende od -c, um Zeichen mit Backslash-Escapes fuer nicht druckbare Bytes anzuzeigen.',
      'Bevorzuge xxd oder hexdump -C fuer interaktive Nutzung; reserviere od fuer POSIX-Portabilitaet.',
    ],
  },

  cmp: {
    useCases: [
      'Zwei Dateien Byte fuer Byte vergleichen, um zu pruefen, ob sie identisch sind',
      'Den ersten Unterschied zwischen zwei Binaerdateien finden',
      'In Skripten mit Exit-Codes auf Dateigleichheit testen',
    ],
    internals:
      'cmp liest beide Dateien gleichzeitig Byte fuer Byte und meldet die erste abweichende Byte-Position und Zeilennummer. Es beendet sich mit 0 bei identischen Dateien, 1 bei Unterschied und 2 bei Fehler. Mit -s erzeugt es keine Ausgabe, nur den Exit-Code.',
    mistakes: [
      'diff statt cmp fuer Binaerdateien verwenden -- diff ist zeilenorientiert und erzeugt bei Binaerdateien unbrauchbare Ausgabe. Verwende cmp fuer Byte-Level-Vergleich.',
      '-s fuer Skripte vergessen -- ohne -s gibt cmp Ausgabe aus. Verwende cmp -s file1 file2 fuer stillen Vergleich in Skripten.',
    ],
    bestPractices: [
      'Verwende cmp -s in Skripten mit if-Anweisungen: if cmp -s file1 file2; then echo gleich; fi.',
      'Verwende cmp -l, um alle abweichenden Bytes aufzulisten, nicht nur das erste.',
      'Fuer Textdatei-Vergleich verwende stattdessen diff fuer menschenlesbare Ausgabe.',
    ],
  },

  // ─── VERSION CONTROL (16) ─────────────────────────────────────────

  git: {
    useCases: [
      'Aenderungen am Quellcode verfolgen und mit anderen zusammenarbeiten',
      'Eine vollstaendige Historie der Projektentwicklung mit Branching fuehren',
      'Verteilte Entwicklungs-Workflows teamuebergreifend verwalten',
    ],
    internals:
      'Git speichert Daten als inhaltsadressierbares Dateisystem. Jede Dateiversion wird als Blob gespeichert, Verzeichnisse als Trees und Snapshots als Commits (die jeweils auf einen Tree und Eltern-Commits verweisen). Branches sind einfach Zeiger (Refs) auf Commit-SHAs, gespeichert in .git/refs.',
    mistakes: [
      'Grosse Binaerdateien committen -- Git speichert jede Version, sodass Repos schnell wachsen. Verwende Git LFS fuer grosse Binarys.',
      'git add . verwenden, ohne den Status zu pruefen -- das stagt alles, einschliesslich temporaerer Dateien. Fuehre immer zuerst git status aus oder verwende eine .gitignore.',
      'Force-Push auf geteilte Branches -- das ueberschreibt die Historie und bricht die Arbeit von Mitarbeitern. Force-Push nur auf persoenliche Branches.',
    ],
    bestPractices: [
      'Schreibe aussagekraeftige Commit-Nachrichten mit einer kurzen Zusammenfassungszeile unter 50 Zeichen.',
      'Verwende Branches fuer Features, Fixes und Experimente. Halte main/master stabil.',
      'Richte frueh eine .gitignore ein, um Build-Artefakte, Abhaengigkeiten und IDE-Dateien auszuschliessen.',
      'Mache kleine, fokussierte Commits statt grosser monolithischer.',
    ],
  },

  'git-stash': {
    useCases: [
      'Nicht committete Aenderungen temporaer speichern, um sauber den Branch zu wechseln',
      'Laufende Arbeit beiseitelegen, wenn ein dringender Fix bearbeitet werden muss',
      'Experimentelle Aenderungen speichern und wiederherstellen, ohne zu committen',
    ],
    internals:
      'git stash erstellt zwei (oder drei mit --include-untracked) Commit-Objekte: eins fuer den Index-Zustand und eins fuer den Working-Tree-Zustand. Diese werden auf einem Ref-Stack (refs/stash) ueber ein Reflog gespeichert. git stash pop wendet den obersten Eintrag an und entfernt ihn.',
    mistakes: [
      'Stashen und vergessen -- gestashte Aenderungen koennen verloren gehen, wenn du sie nie poppst. Verwende regelmassig git stash list, um vergessene Stashes zu pruefen.',
      'Annehmen, dass Stash ungetrackte Dateien einschliesst -- standardmaessig speichert Stash nur getrackte Dateien. Verwende git stash -u, um ungetrackte Dateien einzuschliessen.',
      'git stash pop verwenden und Konflikte bekommen -- pop entfernt den Stash auch bei Konflikten. Verwende stattdessen git stash apply, um den Stash sicher zu behalten, bis du den Merge-Erfolg bestaetigst.',
    ],
    bestPractices: [
      'Benenne deine Stashes: git stash push -m "WIP: Feature-Beschreibung" fuer Klarheit.',
      'Verwende git stash apply statt pop, bis du verifiziert hast, dass die Aenderungen sauber angewendet wurden.',
      'Raeume alte Stashes mit git stash drop oder git stash clear auf.',
    ],
  },

  'git-log': {
    useCases: [
      'Commit-History fuer ein Repository, eine Datei oder einen Autor ueberpruefen',
      'Herausfinden, wann eine bestimmte Aenderung eingefuehrt wurde',
      'Changelogs generieren oder Projektentwicklung verfolgen',
    ],
    internals:
      'git log durchlaeuft den Commit-DAG, beginnend bei HEAD (oder angegebenen Refs), indem es Eltern-Zeigern folgt. Jeder Commit speichert einen Tree-Hash, Autor-/Committer-Info, Zeitstempel und Eltern-Hashes. Formatierung und Filterung erfolgen nach dem Durchlauf.',
    mistakes: [
      'Ueberwaetigende Log-Ausgabe betrachten -- ohne Formatierungsflags ist die Ausgabe ausfuehrlich. Verwende --oneline fuer kompakte Ausgabe.',
      'Nicht nach Pfad filtern -- git log zeigt standardmaessig alle Commits. Verwende git log -- pfad/zur/datei, um nur Commits zu sehen, die diese Datei betreffen.',
    ],
    bestPractices: [
      'Verwende git log --oneline --graph --decorate fuer eine kompakte visuelle Branch-History.',
      'Verwende git log --author="name" zum Filtern nach Autor.',
      'Verwende git log -p, um den tatsaechlichen Diff fuer jeden Commit zu sehen.',
      'Verwende git log --since="2 weeks ago" fuer zeitbasierte Filterung.',
    ],
  },

  'git-branch': {
    useCases: [
      'Branches erstellen, auflisten, umbenennen oder loeschen',
      'Feature-Branches und Release-Branches verwalten',
      'Pruefen, auf welchem Branch man sich gerade befindet',
    ],
    internals:
      'Ein Branch ist ein leichtgewichtiger verschiebbarer Zeiger, der als 40-Zeichen-SHA in .git/refs/heads/ gespeichert ist. Das Erstellen eines Branch ist O(1) -- es schreibt nur eine Ref-Datei. HEAD ist eine symbolische Referenz auf den aktuellen Branch.',
    mistakes: [
      'Branches mit nicht gemergter Arbeit loeschen -- git branch -d verweigert dies, wenn der Branch nicht gemergt ist. -D erzwingt das Loeschen und kann Arbeit verlieren. Pruefe vorher mit git branch --merged.',
      'Veraltete Remote-Tracking-Branches nicht aufraeumen -- nach dem Loeschen von Remote-Branches bleiben lokale Referenzen bestehen. Verwende git fetch --prune zum Aufraeumen.',
    ],
    bestPractices: [
      'Verwende beschreibende Branch-Namen mit Praefixen: feature/, bugfix/, hotfix/.',
      'Raeume regelmassig gemergte Branches auf: git branch --merged | xargs git branch -d.',
      'Verwende git branch -vv, um Tracking-Beziehungen und Ahead/Behind-Status zu sehen.',
    ],
  },

  'git-rebase': {
    useCases: [
      'Commits auf eine neue Basis erneut abspielen fuer eine lineare History',
      'Commit-History vor dem Mergen eines Feature-Branch aufraeumen',
      'Commits mit interaktivem Rebase squashen, umformulieren oder umordnen',
    ],
    internals:
      'Rebase funktioniert, indem es den gemeinsamen Vorfahren findet, jeden Commit als Patch speichert, den Branch auf die neue Basis zuruecksetzt und jeden Patch erneut abspielt. Interaktives Rebase (-i) erlaubt das Bearbeiten der Todo-Liste vor dem Abspielen. Jeder neu abgespielte Commit erhaelt einen neuen SHA.',
    mistakes: [
      'Commits rebasen, die auf einen geteilten Branch gepusht wurden -- das ueberschreibt die Historie und zwingt Mitarbeiter, divergierende Historien abzugleichen. Rebase nur lokale oder persoenliche Branches.',
      'Nicht wissen, wie man abbricht -- wenn ein Rebase schiefgeht, verwende git rebase --abort, um zum Zustand vor dem Rebase zurueckzukehren.',
      'Verworrene Historie durch Rebasen von Merge-Commits erstellen -- Rebase linearisiert die Historie standardmaessig und verwirft Merge-Commits. Verwende --rebase-merges, um die Merge-Topologie zu erhalten.',
    ],
    bestPractices: [
      'Verwende interaktives Rebase (git rebase -i), um Commits vor dem Mergen in main aufzuraeumen.',
      'Rebase niemals Commits, auf denen andere ihre Arbeit aufgebaut haben.',
      'Verwende git rebase --onto, um ein Branch-Segment auf eine andere Basis zu transplantieren.',
    ],
  },

  'git-remote': {
    useCases: [
      'Verbindungen zu Remote-Repositories verwalten',
      'Remote-Repository-Referenzen hinzufuegen, entfernen oder umbenennen',
      'URLs fuer Fetch- und Push-Operationen anzeigen oder aendern',
    ],
    internals:
      'Remote-Konfigurationen werden in .git/config als [remote "name"]-Sektionen mit URL- und Fetch-Refspec-Eintraegen gespeichert. Remote-Tracking-Branches (refs/remotes/) sind lokale Kopien der Remote-Branch-Zustaende, die durch Fetch aktualisiert werden.',
    mistakes: [
      'Remote-Branches mit lokalen Branches verwechseln -- Remote-Tracking-Branches (origin/main) sind schreibgeschuetzte Snapshots. Man kann nicht direkt auf sie committen.',
      'Falsche Remote-URLs nach Repository-Umzuegen haben -- verwende git remote set-url zum Aktualisieren.',
    ],
    bestPractices: [
      'Verwende git remote -v, um alle Remotes mit ihren Fetch- und Push-URLs anzuzeigen.',
      'Verwende SSH-URLs zur Authentifizierung statt HTTPS mit Tokens fuer bessere Sicherheit.',
      'Fuege mehrere Remotes fuer Forks hinzu: origin fuer deinen Fork, upstream fuer das Original.',
    ],
  },

  'git-bisect': {
    useCases: [
      'Den exakten Commit finden, der einen Bug eingefuehrt hat, mittels binaerer Suche',
      'Performance-Regressionen ueber viele Commits identifizieren',
      'Bug-Suche mit einem Testskript automatisieren',
    ],
    internals:
      'git bisect fuehrt eine binaere Suche durch die Commit-History durch. Du markierst Commits als gut oder schlecht, und es checkt den Mittelpunkt aus. Bei N Commits findet es den Verursacher in O(log N) Schritten. Der Zustand wird in .git/BISECT_LOG gespeichert.',
    mistakes: [
      'Keine zuverlaessige Testmoeglichkeit haben -- bisect erfordert einen konsistenten Bestanden/Fehlgeschlagen-Test fuer jeden Commit. Instabile Tests liefern falsche Ergebnisse.',
      'Vergessen, git bisect reset auszufuehren -- das laesst HEAD in einem detached Zustand bei einem zufaelligen Commit.',
    ],
    bestPractices: [
      'Automatisiere mit git bisect run ./test-script.sh, wobei das Skript mit 0 fuer gut und 1 fuer schlecht endet.',
      'Fuehre immer git bisect reset aus, wenn du fertig bist, um zu deinem Branch zurueckzukehren.',
      'Verwende git bisect skip, wenn ein Commit nicht getestet werden kann (z.B. kompiliert nicht).',
    ],
  },

  'git-config': {
    useCases: [
      'Benutzername, E-Mail und Editor fuer Git-Operationen setzen',
      'Aliases, Merge-Tools und Diff-Einstellungen konfigurieren',
      'Pro-Repo-, globale und systemweite Git-Einstellungen verwalten',
    ],
    internals:
      'Git-Config liest von drei Ebenen: System (/etc/gitconfig), global (~/.gitconfig) und lokal (.git/config). Lokal ueberschreibt global, das system ueberschreibt. Werte werden als INI-artige Schluessel-Wert-Paare in diesen Dateien gespeichert.',
    mistakes: [
      'Config auf der falschen Ebene setzen -- ohne --global gelten Einstellungen nur fuer das aktuelle Repo. Umgekehrt betrifft --global alle Repos.',
      'Vergessen, user.email und user.name zu setzen -- Commits ohne diese zeigen generische Informationen. Setze sie mit git config --global.',
    ],
    bestPractices: [
      'Setze die Identitaet global: git config --global user.name und user.email.',
      'Verwende bedingte Includes fuer verschiedene Identitaeten: [includeIf "gitdir:~/work/"], um die E-Mail automatisch fuer Arbeits-Repos zu wechseln.',
      'Definiere nuetzliche Aliases: git config --global alias.lg "log --oneline --graph --decorate".',
    ],
  },

  'git-merge': {
    useCases: [
      'Arbeit aus verschiedenen Branches zusammenfuehren',
      'Feature-Branches zurueck in main integrieren',
      'Upstream-Aenderungen in deinen Arbeitsbranch bringen',
    ],
    internals:
      'Git Merge findet den gemeinsamen Vorfahren (Merge Base) der beiden Branches und fuehrt dann einen Drei-Wege-Merge durch. Wenn der aktuelle Branch keine neuen Commits hat, fuehrt es einen Fast-Forward durch (verschiebt nur den Zeiger). Andernfalls erstellt es einen Merge-Commit mit zwei Eltern.',
    mistakes: [
      'Mergen, ohne vorher zu pullen -- wenn der Remote neue Commits hat, koennten unerwartete Konflikte auftreten. Pulle oder fetche vor dem Mergen.',
      'Fast-Forward-Merges verwenden, wenn Merge-History gewuenscht ist -- Fast-Forward-Merges hinterlassen keine Spur des Branches. Verwende git merge --no-ff, um immer einen Merge-Commit zu erstellen.',
      'Konflikte nicht ordentlich loesen -- Konflikte blind durch Akzeptieren einer Seite loesen kann Bugs einfuehren. Pruefe jeden Konflikt sorgfaeltig.',
    ],
    bestPractices: [
      'Verwende git merge --no-ff fuer Feature-Branches, um die Branch-History im Log zu erhalten.',
      'Loese Konflikte in einem Merge-Tool: git mergetool.',
      'Teste das Merge-Ergebnis vor dem Pushen, um Integrationsprobleme zu erkennen.',
    ],
  },

  'git-cherry-pick': {
    useCases: [
      'Einen bestimmten Commit aus einem anderen Branch anwenden, ohne den gesamten Branch zu mergen',
      'Einen Bugfix auf einen Release-Branch backporten',
      'Einzelne Commits aus einem aufgegebenen Branch retten',
    ],
    internals:
      'Cherry-Pick berechnet den Diff, den der Ziel-Commit eingefuehrt hat (zwischen ihm und seinem Eltern-Commit), und wendet diesen Diff auf den aktuellen HEAD als neuen Commit an. Der neue Commit hat einen anderen SHA, weil er einen anderen Eltern-Commit hat, obwohl die Aenderungen identisch sind.',
    mistakes: [
      'Merge-Commits cherry-picken, ohne -m anzugeben -- Merge-Commits haben mehrere Eltern. Du musst angeben, gegen welchen Eltern-Commit der Diff erstellt werden soll, mit -m 1 (normalerweise die Mainline).',
      'Viele Commits cherry-picken statt zu mergen -- Cherry-Pick dupliziert Commits und fuehrt zu Konflikten, wenn Branches spaeter gemergt werden. Bevorzuge Merge oder Rebase fuer das Integrieren mehrerer Commits.',
    ],
    bestPractices: [
      'Verwende Cherry-Pick sparsam -- es dupliziert Commits. Bevorzuge Merge oder Rebase fuer routinemaessige Integration.',
      'Verwende git cherry-pick -x, um den originalen Commit-Hash in der Nachricht zu vermerken.',
      'Verwende git cherry-pick --no-commit, um Aenderungen zu stagen, ohne zu committen, was das Kombinieren mehrerer Cherry-Picks erlaubt.',
    ],
  },

  'git-tag': {
    useCases: [
      'Release-Punkte in der Repository-History markieren (z.B. v1.0.0)',
      'Annotierte Tags mit Nachrichten fuer Releases erstellen',
      'Bestimmte Commits mit einem menschenlesbaren Namen referenzieren',
    ],
    internals:
      'Leichtgewichtige Tags sind einfache Refs in .git/refs/tags/, die auf einen Commit zeigen. Annotierte Tags sind vollstaendige Git-Objekte mit Tagger, Datum, Nachricht und optionaler GPG-Signatur, gespeichert in der Objektdatenbank und durch eine Tag-Ref referenziert.',
    mistakes: [
      'Leichtgewichtige Tags fuer Releases verwenden -- leichtgewichtige Tags haben keine Metadaten. Verwende annotierte Tags (git tag -a) fuer Releases, damit sie Tagger, Datum und Nachricht enthalten.',
      'Vergessen, Tags zu pushen -- git push sendet standardmaessig keine Tags. Verwende git push --tags oder git push origin <tagname>.',
    ],
    bestPractices: [
      'Verwende annotierte Tags fuer Releases: git tag -a v1.0.0 -m "Release 1.0.0".',
      'Folge Semantic Versioning (semver) fuer Tag-Namen.',
      'Pushe Tags explizit: git push origin --tags.',
      'Signiere Release-Tags mit GPG: git tag -s zur Verifizierung.',
    ],
  },

  'git-diff': {
    useCases: [
      'Nicht gestagete Aenderungen im Working Tree anzeigen',
      'Gestagete Aenderungen gegen den letzten Commit vergleichen',
      'Zwischen beliebigen zwei Commits, Branches oder Tags vergleichen',
    ],
    internals:
      'git diff berechnet Unterschiede durch Vergleich von Blob-Objekten. Fuer Working-Tree-Diffs vergleicht es den Index (Staging Area) mit dem Working Tree. git diff --cached vergleicht HEAD mit dem Index. Die Ausgabe verwendet standardmaessig das Unified-Diff-Format.',
    mistakes: [
      'git diff und git diff --cached verwechseln -- git diff zeigt nur nicht gestagete Aenderungen. git diff --cached (oder --staged) zeigt, was committet wird.',
      'Erwarten, dass nur Whitespace-Aenderungen erscheinen -- standardmaessig zeigt diff Whitespace-Aenderungen. Verwende git diff -w, um Whitespace fuer sauberere Reviews zu ignorieren.',
    ],
    bestPractices: [
      'Verwende git diff --staged vor dem Committen, um genau zu ueberpruefen, was committet wird.',
      'Verwende git diff --stat fuer eine Zusammenfassung geaenderter Dateien und Zeilenzahlen.',
      'Verwende git diff branch1..branch2 zum Vergleichen von Branches.',
      'Verwende git diff --word-diff fuer Inline-Wort-Level-Diffs.',
    ],
  },

  'git-reset': {
    useCases: [
      'Dateien aus dem Index unstagen, ohne Aenderungen zu verlieren (--mixed)',
      'Den letzten Commit rueckgaengig machen, waehrend Aenderungen im Working Tree bleiben (--soft)',
      'Commits und Aenderungen vollstaendig verwerfen (--hard)',
    ],
    internals:
      'git reset verschiebt die HEAD-Ref (und den aktuellen Branch-Zeiger) auf einen angegebenen Commit. --soft verschiebt nur die Ref, --mixed (Standard) setzt auch den Index zurueck, und --hard setzt sowohl Index als auch Working Tree zurueck. Es operiert auf Refs, nicht auf einzelnen Dateien (git reset -- file setzt nur den Index fuer diese Datei zurueck).',
    mistakes: [
      '--hard verwenden und nicht committete Arbeit verlieren -- --hard ist destruktiv und verwirft Working-Tree-Aenderungen unwiderruflich. Verwende --soft oder --mixed, um Aenderungen zu erhalten.',
      'Geteilte Branch-History zuruecksetzen -- Reset und Force-Push ueberschreiben die Historie fuer Mitarbeiter. Verwende stattdessen git revert fuer oeffentliche Branches.',
      'reset mit revert verwechseln -- reset ueberschreibt die Historie, revert erstellt einen neuen Commit, der eine Aenderung rueckgaengig macht. Verwende revert auf geteilten Branches.',
    ],
    bestPractices: [
      'Verwende git reset --soft HEAD~1, um den letzten Commit rueckgaengig zu machen, aber Aenderungen gestagt zu lassen.',
      'Verwende git reset HEAD -- file, um eine bestimmte Datei zu unstagen.',
      'Bevorzuge git revert gegenueber git reset fuer das Rueckgaengigmachen von Aenderungen auf geteilten Branches.',
      'Pruefe git reflog, um versehentliche Resets wiederherzustellen.',
    ],
  },

  'git-submodule': {
    useCases: [
      'Externe Repositories als Abhaengigkeiten in dein Projekt einbinden',
      'Eine bestimmte Version einer Bibliothek oder gemeinsamen Komponente pinnen',
      'Multi-Repo-Projekte verwalten, bei denen Komponenten unabhaengig weiterentwickelt werden',
    ],
    internals:
      'Submodule werden ueber eine .gitmodules-Datei (URL und Pfad) und einen speziellen Tree-Eintrag (Gitlink) verfolgt, der den gepinnten Commit-SHA jedes Submoduls aufzeichnet. Der Submodul-Inhalt lebt in seinem eigenen .git-Verzeichnis (oder wird in .git/modules/ absorbiert).',
    mistakes: [
      'Ein Repo klonen und --recurse-submodules vergessen -- Submodul-Verzeichnisse werden leer sein. Fuehre git submodule update --init --recursive nach dem Klonen aus.',
      'Submodul-Zeiger-Updates nicht committen -- nach dem Aktualisieren eines Submoduls sieht das uebergeordnete Repo einen dirty Gitlink. Du musst diese Aenderung im uebergeordneten Repo committen.',
      'In detached HEAD innerhalb von Submodulen geraten -- Submodule checken einen bestimmten Commit aus, keinen Branch. Wechsle in das Submodul und checke einen Branch aus, bevor du Aenderungen machst.',
    ],
    bestPractices: [
      'Klone mit --recurse-submodules, um Submodule automatisch zu initialisieren.',
      'Verwende git submodule update --remote, um die neuesten Commits von Submodul-Remotes zu pullen.',
      'Erwaege Alternativen wie git subtree oder Paketmanager, wenn die Submodul-Komplexitaet zu hoch ist.',
    ],
  },

  'git-worktree': {
    useCases: [
      'Gleichzeitig an mehreren Branches arbeiten, ohne zu stashen oder zu wechseln',
      'Einen langen Build auf einem Branch ausfuehren, waehrend auf einem anderen entwickelt wird',
      'Einen Pull Request in einem separaten Verzeichnis ueberpruefen, waehrend die eigene Arbeit intakt bleibt',
    ],
    internals:
      'git worktree erstellt zusaetzliche Arbeitsverzeichnisse, die dasselbe .git-Repository teilen. Jeder Worktree hat seinen eigenen HEAD und Index, teilt aber den Object Store und die Refs. Worktree-Metadaten werden in .git/worktrees/ gespeichert.',
    mistakes: [
      'Denselben Branch in mehreren Worktrees auschecken -- Git verhindert dies, um Verwirrung zu vermeiden. Verwende einen anderen Branch fuer jeden Worktree.',
      'Vergessen, Worktrees zu entfernen -- alte Worktrees verbrauchen Speicherplatz und sperren Branches. Verwende git worktree remove oder git worktree prune.',
    ],
    bestPractices: [
      'Verwende git worktree add ../project-hotfix hotfix-branch fuer isoliertes Arbeiten an einem Hotfix.',
      'Entferne Worktrees, wenn fertig: git worktree remove <pfad>.',
      'Verwende git worktree list, um alle aktiven Worktrees zu sehen.',
    ],
  },

  'git-blame': {
    useCases: [
      'Herausfinden, wer jede Zeile einer Datei zuletzt geaendert hat und wann',
      'Den Commit aufspueren, der eine bestimmte Codezeile eingefuehrt hat',
      'Die Geschichte und den Hintergrund von Codeaenderungen verstehen',
    ],
    internals:
      'git blame durchlaeuft die Commit-History und fuehrt Diff-Analysen durch, um jede Zeile der aktuellen Version dem Commit zuzuordnen, der sie zuletzt geaendert hat. Es verwendet einen Copy/Rename-Erkennungsalgorithmus, um Zeilen ueber Datei-Umbenennungen hinweg mit -C zu verfolgen.',
    mistakes: [
      'Einen Formatierungs-Commit statt den urspruenglichen Autor blamen -- grosse Reformatierungs-Commits verdecken die echte Historie. Verwende git blame -w, um Whitespace-Aenderungen zu ignorieren, oder --ignore-rev, um bestimmte Commits zu ueberspringen.',
      '-C nicht verwenden, um Code zu verfolgen, der zwischen Dateien verschoben wurde -- ohne -C stoppt blame bei der Datei, in die Code eingefuegt wurde, nicht wo er herkam.',
    ],
    bestPractices: [
      'Verwende git blame -w, um reine Whitespace-Aenderungen zu ignorieren.',
      'Erstelle eine .git-blame-ignore-revs-Datei fuer Formatierungs-Commits und konfiguriere git config blame.ignoreRevsFile.',
      'Verwende git log -p -S "code string" (Pickaxe) als Ergaenzung zu blame, um zu finden, wann Code hinzugefuegt oder entfernt wurde.',
    ],
  },

  // ─── CONTAINERS (15) ──────────────────────────────────────────────

  docker: {
    useCases: [
      'Anwendungen in isolierten, reproduzierbaren Containern ausfuehren',
      'Anwendungen mit allen Abhaengigkeiten fuer konsistentes Deployment paketieren',
      'Entwicklungsumgebungen erstellen, die der Produktion entsprechen',
    ],
    internals:
      'Docker verwendet Linux-Namespaces (PID, NET, MNT, UTS, IPC, USER) fuer Isolation und cgroups fuer Ressourcenlimits. Images sind geschichtete Dateisysteme mit Union-Mount (overlay2). Der Docker-Daemon (dockerd) verwaltet Container ueber containerd und runc.',
    mistakes: [
      'Container als root innerhalb und ausserhalb ausfuehren -- der Standard-root-Benutzer im Container wird auf root auf dem Host abgebildet (sofern User-Namespaces nicht aktiviert sind). Verwende USER im Dockerfile oder das --user-Flag.',
      'Alte Container und Images nicht aufraeumen -- Speicherplatzverbrauch waechst schnell. Fuehre regelmassig docker system prune aus.',
      'latest-Tag in Produktion verwenden -- der latest-Tag ist veraenderlich und unvorhersagbar. Pinne spezifische Image-Versionen.',
    ],
    bestPractices: [
      'Verwende spezifische Image-Tags (z.B. node:20-alpine) statt :latest.',
      'Fuehre Container mit einem Nicht-Root-Benutzer aus fuer mehr Sicherheit.',
      'Verwende Multi-Stage-Builds, um die finale Image-Groesse zu minimieren.',
      'Verwende docker system prune regelmaessig, um Speicherplatz freizugeben.',
    ],
  },

  'docker-compose': {
    useCases: [
      'Multi-Container-Anwendungen mit einer einzigen Konfigurationsdatei definieren und ausfuehren',
      'Entwicklungsumgebungen mit Datenbanken, Caches und Diensten einrichten',
      'Container-Abhaengigkeiten, Netzwerke und Volumes deklarativ orchestrieren',
    ],
    internals:
      'Docker Compose liest eine YAML-Datei (compose.yaml) und uebersetzt sie in Docker-API-Aufrufe. Es erstellt ein dediziertes Netzwerk fuer das Projekt, startet Container in Abhaengigkeitsreihenfolge und verwaltet ihren Lebenszyklus. Dienste werden per Name ueber Docker Embedded DNS aufgeloest.',
    mistakes: [
      'depends_on ohne Healthchecks verwenden -- depends_on wartet nur auf den Container-Start, nicht auf die Dienstbereitschaft. Fuege Healthcheck-Bedingungen hinzu.',
      'Geheimnisse in der Compose-Datei speichern -- Umgebungsvariablen in YAML sind in docker inspect sichtbar. Verwende Docker Secrets oder .env-Dateien, die von der Versionskontrolle ausgeschlossen sind.',
      'docker-compose (v1) statt docker compose (v2) verwenden -- v1 ist veraltet. Verwende die docker compose Plugin-Syntax.',
    ],
    bestPractices: [
      'Verwende docker compose (v2-Plugin-Syntax) statt des veralteten docker-compose-Binarys.',
      'Definiere Healthchecks fuer Dienste, von denen andere Dienste abhaengen.',
      'Verwende benannte Volumes fuer persistente Daten und Bind-Mounts fuer Entwicklungscode.',
      'Verwende Profiles, um optionale Dienste zu definieren (z.B. Debug-Tools, Monitoring).',
    ],
  },

  'docker-image': {
    useCases: [
      'Lokal gespeicherte Docker-Images auflisten, inspizieren und verwalten',
      'Ungenutzte Images entfernen, um Speicherplatz freizugeben',
      'Images zum Pushen in Registries taggen',
    ],
    internals:
      'Docker-Images werden als Layer im lokalen Image-Store gespeichert (typischerweise /var/lib/docker/overlay2). Jeder Layer ist ein Dateisystem-Diff. docker image ls liest den Image-Metadaten-Index. Dangling Images sind Layer, die von keinem getaggten Image referenziert werden.',
    mistakes: [
      'Dangling Images nicht entfernen -- Builds erstellen ungetaggte Zwischen-Images. Verwende docker image prune, um sie zu entfernen.',
      'Image-ID mit Tag verwechseln -- mehrere Tags koennen auf dieselbe Image-ID zeigen. Das Entfernen eines Tags loescht das Image nicht, wenn andere Tags es referenzieren.',
    ],
    bestPractices: [
      'Verwende docker image prune, um Dangling Images aufzuraeumen.',
      'Verwende docker image ls --format, um die Ausgabe fuer Skripte anzupassen.',
      'Inspiziere Image-Layer mit docker image history, um Groessen-Engpaesse zu finden.',
    ],
  },

  'docker-exec': {
    useCases: [
      'Einen Befehl in einem laufenden Container zum Debuggen ausfuehren',
      'Eine interaktive Shell in einem Container oeffnen',
      'Einmalige Wartungsaufgaben in einem laufenden Dienst ausfuehren',
    ],
    internals:
      'docker exec verwendet den nsenter-Mechanismus, um den Namespaces (PID, NET, MNT usw.) eines bestehenden Container-Prozesses beizutreten. Es erstellt einen neuen Prozess innerhalb des Containers, ohne einen neuen Container zu starten.',
    mistakes: [
      '-it fuer interaktive Nutzung vergessen -- ohne -i (stdin) und -t (tty) erhaeltst du keine interaktive Shell. Verwende docker exec -it container bash.',
      'Aenderungen per exec machen, die ins Dockerfile gehoeren -- alle per exec gemachten Aenderungen gehen verloren, wenn der Container neu erstellt wird. Aendere stattdessen das Dockerfile.',
    ],
    bestPractices: [
      'Verwende docker exec -it <container> sh (oder bash) fuer interaktives Debuggen.',
      'Verwende docker exec fuer Einmalaufgaben, nicht fuer persistente Konfiguration.',
      'Gib --user an, um als bestimmter Benutzer im Container auszufuehren.',
    ],
  },

  'docker-logs': {
    useCases: [
      'stdout/stderr-Ausgabe eines laufenden oder gestoppten Containers anzeigen',
      'Container-Logs in Echtzeit zum Debuggen verfolgen',
      'Anwendungs-Startfehler in Containern pruefen',
    ],
    internals:
      'Docker faengt stdout und stderr des Container-PID-1-Prozesses ab und speichert sie ueber den konfigurierten Logging-Treiber (Standard: json-file in /var/lib/docker/containers/). docker logs liest diese gespeicherten Logs. Der Stream-Modus (--follow) verwendet inotify oder Polling.',
    mistakes: [
      'Anwendung loggt in Dateien statt auf stdout -- Docker faengt nur stdout/stderr ab. Anwendungen sollten auf stdout loggen, damit docker logs funktioniert.',
      'Logs wachsen unbegrenzt -- der json-file-Treiber hat kein Standard-Groessenlimit. Konfiguriere max-size und max-file in daemon.json oder pro Container.',
    ],
    bestPractices: [
      'Verwende docker logs -f --tail 100, um aktuelle Logs zu verfolgen, ohne ueberwaetigende Ausgabe.',
      'Verwende docker logs --since 1h, um nur aktuelle Logs anzuzeigen.',
      'Konfiguriere Log-Rotation: --log-opt max-size=10m --log-opt max-file=3.',
    ],
  },

  'docker-network': {
    useCases: [
      'Isolierte Netzwerke fuer Container-zu-Container-Kommunikation erstellen',
      'Container ueber verschiedene Compose-Projekte hinweg verbinden',
      'Netzwerk-Konnektivitaetsprobleme zwischen Containern debuggen',
    ],
    internals:
      'Docker-Networking verwendet Linux-Bridge-Devices (docker0 fuer die Standard-Bridge), veth-Paare, die jeden Container mit der Bridge verbinden, und iptables-Regeln fuer NAT und Port-Forwarding. Benutzerdefinierte Bridge-Netzwerke fuegen eingebettetes DNS fuer Container-Namensaufloesung hinzu.',
    mistakes: [
      'Das Standard-Bridge-Netzwerk verwenden -- die Standard-Bridge bietet keine DNS-Aufloesung zwischen Containern. Erstelle immer benutzerdefinierte Netzwerke.',
      'Ports unnoetig exponieren -- das Veroeffentlichen von Ports (-p) exponiert sie zum Host und moeglicherweise zum Internet. Veroeffentliche nur Ports, die externe Clients benoetigen.',
    ],
    bestPractices: [
      'Erstelle benutzerdefinierte Bridge-Netzwerke: docker network create mynet fuer DNS-basierte Service-Erkennung.',
      'Verwende docker network inspect, um Konnektivitaet zu debuggen und verbundene Container zu sehen.',
      'Verwende interne Netzwerke (--internal) fuer Backend-Dienste, die keinen externen Zugang haben sollten.',
    ],
  },

  kubectl: {
    useCases: [
      'Kubernetes-Cluster, Deployments und Services von der CLI verwalten',
      'Containerisierte Anwendungen auf Kubernetes deployen, skalieren und debuggen',
      'Cluster-Zustand inspizieren, Logs anzeigen und in Pods execen',
    ],
    internals:
      'kubectl kommuniziert mit dem Kubernetes-API-Server ueber HTTPS. Es liest Cluster-Zugangsdaten aus ~/.kube/config (oder KUBECONFIG). Befehle werden in REST-API-Aufrufe an den API-Server uebersetzt, der den Zustand in etcd speichert.',
    mistakes: [
      'Auf dem falschen Cluster oder Namespace operieren -- kubectl verwendet standardmaessig den aktuellen Kontext. Verifiziere immer mit kubectl config current-context und verwende -n namespace.',
      'kubectl apply mit Delete-then-Create-Semantik verwenden -- apply verwendet Strategic Merge Patch. Fuer vollstaendige Ersetzungen verwende kubectl replace. Das Mischen von apply und imperativen Befehlen verursacht Annotations-Drift.',
      'Keine Ressourcenlimits verwenden -- Pods ohne Ressourcen-Requests/Limits koennen andere Workloads aushungern oder unvorhersehbar OOM-gekillt werden.',
    ],
    bestPractices: [
      'Gib immer --namespace an oder setze einen Standard-Namespace in deinem Kontext.',
      'Verwende kubectl apply -f fuer deklaratives Management mit versionskontrolliertem YAML.',
      'Verwende kubectl describe und kubectl logs zum Debuggen von Pod-Problemen.',
      'Verwende kubectl get -o wide oder -o yaml fuer detaillierte Ressourcen-Inspektion.',
    ],
  },

  podman: {
    useCases: [
      'Container ohne Daemon und ohne Root-Rechte ausfuehren',
      'Docker durch eine daemonlose, rootlose Container-Runtime ersetzen',
      'Pods (Container-Gruppen) nativ fuer Kubernetes-Kompatibilitaet verwalten',
    ],
    internals:
      'Podman verwendet dieselbe OCI-Runtime (runc/crun) und dasselbe Image-Format wie Docker, hat aber keinen zentralen Daemon. Jeder Container laeuft als direkter Kindprozess. Der rootlose Modus verwendet User-Namespaces, um Container-Root auf einen unprivilegierten Host-Benutzer abzubilden.',
    mistakes: [
      'Annehmen, dass Docker Compose direkt funktioniert -- verwende podman-compose oder podman compose (mit dem Compose-Plugin) statt docker-compose.',
      'Berechtigungsprobleme im rootlosen Modus -- rootlose Container koennen standardmaessig nicht an Ports unter 1024 binden. Verwende sysctl oder Port-Mapping ueber 1024.',
    ],
    bestPractices: [
      'Verwende podman als Drop-in-Ersatz fuer docker: alias docker=podman.',
      'Verwende podman generate kube, um laufende Container als Kubernetes-YAML zu exportieren.',
      'Verwende podman play kube, um Kubernetes-Pod-YAML lokal auszufuehren.',
      'Bevorzuge den rootlosen Modus fuer Entwicklung zur Verbesserung der Sicherheitslage.',
    ],
  },

  'docker-volume': {
    useCases: [
      'Container-Daten ueber den Container-Lebenszyklus hinaus persistieren',
      'Daten zwischen Containern teilen',
      'Datenbank-Storage und andere stateful Workloads verwalten',
    ],
    internals:
      'Docker-Volumes werden in /var/lib/docker/volumes/ auf dem Host gespeichert. Sie werden vom Docker-Daemon verwaltet und sind vom Container-Dateisystem getrennt. Benannte Volumes bleiben bis zur expliziten Entfernung bestehen. Volume-Treiber koennen Volumes mit Netzwerk-Storage unterstuetzen.',
    mistakes: [
      'Bind-Mounts fuer Produktionsdaten verwenden -- Bind-Mounts haengen vom Host-Dateisystem-Layout ab. Verwende benannte Volumes fuer Portabilitaet und Docker-Verwaltung.',
      'Vergessen, dass anonyme Volumes schwer zu verwalten sind -- Container, die ohne benannte Volumes gestartet werden, erstellen anonyme Volumes, die das System ueberladen. Verwende benannte Volumes.',
    ],
    bestPractices: [
      'Verwende benannte Volumes fuer persistente Daten: docker volume create mydata.',
      'Verwende docker volume prune, um ungenutzte Volumes aufzuraeumen.',
      'Verwende docker volume inspect, um den Mountpunkt auf dem Host zu finden.',
    ],
  },

  'docker-build': {
    useCases: [
      'Docker-Images aus einem Dockerfile bauen',
      'Optimierte Produktions-Images mit Multi-Stage-Builds erstellen',
      'Images mit Build-Argumenten und benutzerdefinierten Kontexten bauen',
    ],
    internals:
      'Docker Build sendet den Build-Kontext (Verzeichnisinhalte) an den Daemon und fuehrt dann jede Dockerfile-Anweisung als Schritt aus. Jeder Schritt erstellt einen neuen Layer. BuildKit (Standard in neueren Versionen) fuegt parallele Stage-Ausfuehrung, Cache-Mounts und Secret-Mounts hinzu.',
    mistakes: [
      'Grosse Build-Kontexte -- Docker sendet den gesamten Build-Kontext an den Daemon. Verwende .dockerignore, um node_modules, .git und andere grosse Verzeichnisse auszuschliessen.',
      'Den Layer-Cache unnoetig invalidieren -- COPY . . frueh im Dockerfile invalidiert den Cache fuer alle nachfolgenden Layer bei jeder Dateiaenderung. Kopiere zuerst Abhaengigkeitsdateien, installiere, dann kopiere den Rest.',
    ],
    bestPractices: [
      'Verwende Multi-Stage-Builds, um finale Images klein zu halten.',
      'Ordne Dockerfile-Anweisungen von am wenigsten zu am haeufigsten geaendert fuer Cache-Effizienz.',
      'Verwende .dockerignore, um unnoetige Dateien vom Build-Kontext auszuschliessen.',
      'Verwende BuildKit Cache-Mounts (--mount=type=cache) fuer Paketmanager-Caches.',
    ],
  },

  'docker-tag': {
    useCases: [
      'Einen registry-qualifizierten Namen zu einem lokalen Image vor dem Pushen hinzufuegen',
      'Versions-Tags fuer Release-Images erstellen',
      'Ein Image unter mehreren Namen aliasieren',
    ],
    internals:
      'docker tag erstellt eine neue Referenz (name:tag), die auf eine bestehende Image-ID zeigt. Es werden keine Daten kopiert -- es ist rein eine Metadaten-Operation. Das vollstaendige Tag-Format ist registry/repository:tag.',
    mistakes: [
      'Ein Tag mit einem anderen Image ueberschreiben -- Tags sind veraenderlich. Das Pushen eines neuen Images mit einem bestehenden Tag ersetzt es stillschweigend. Verwende eindeutige Tags (z.B. Git-SHA oder Semver).',
      'Nur latest als Tag verwenden -- latest ist nicht speziell; es ist nur der Standard, wenn kein Tag angegeben wird. Pushe immer explizite Versions-Tags.',
    ],
    bestPractices: [
      'Tagge mit semantischen Versionen: docker tag app:latest registry/app:1.2.3.',
      'Tagge auch mit dem Git-Commit-SHA fuer Nachverfolgbarkeit.',
      'Verwende sowohl ein Versions-Tag als auch latest fuer Komfort: pushe beide.',
    ],
  },

  'docker-push': {
    useCases: [
      'Lokale Images in eine Container-Registry hochladen',
      'Anwendungs-Images fuer Deployment veroeffentlichen',
      'Images mit Teammitgliedern oder CI/CD-Pipelines teilen',
    ],
    internals:
      'docker push laedt Image-Layer ueber die Docker Registry HTTP API v2 in eine Registry hoch. Nur Layer, die noch nicht in der Registry vorhanden sind, werden hochgeladen (Deduplizierung). Authentifizierung erfolgt ueber docker login Tokens, gespeichert in ~/.docker/config.json.',
    mistakes: [
      'Pushen, ohne eingeloggt zu sein -- docker push schlaegt mit Auth-Fehlern fehl, wenn du nicht vorher docker login ausgefuehrt hast.',
      'Grosse Images pushen -- nicht optimierte Images mit unnoetig vielen Layern verschwenden Bandbreite und Speicher. Minimiere die Image-Groesse vor dem Pushen.',
    ],
    bestPractices: [
      'Logge dich vor dem Pushen in deine Registry ein: docker login registry.example.com.',
      'Pushe sowohl ein Versions-Tag als auch latest fuer jedes Release.',
      'Verwende CI/CD-Pipelines, um das Bauen, Taggen und Pushen von Images zu automatisieren.',
    ],
  },

  'docker-prune': {
    useCases: [
      'Speicherplatz durch Entfernen ungenutzter Docker-Objekte freigeben',
      'Dangling Images, gestoppte Container und ungenutzte Netzwerke aufraeumen',
      'Eine ueberladene Docker-Umgebung zuruecksetzen',
    ],
    internals:
      'docker system prune entfernt gestoppte Container, Dangling Images, ungenutzte Netzwerke und optional den Build-Cache. Jeder Ressourcentyp hat auch seinen eigenen prune-Befehl. Prune verwendet Referenzzaehlung, um festzustellen, was ungenutzt ist.',
    mistakes: [
      'docker system prune -a verwenden, ohne die Auswirkung zu verstehen -- -a entfernt ALLE ungenutzten Images, nicht nur Dangling. Das schliesst Basis-Images ein, die du moeglicherweise brauchst, und erfordert erneutes Herunterladen.',
      'Prune in Produktion ausfuehren, ohne vorher zu pruefen -- prune entfernt gestoppte Container, die moeglicherweise nuetzliche Logs oder Zustaende haben. Inspiziere vor dem Prunen.',
    ],
    bestPractices: [
      'Verwende docker system prune regelmaessig in Entwicklungsumgebungen.',
      'Verwende docker system prune --filter "until=24h", um nur Objekte aelter als 24 Stunden zu entfernen.',
      'Fuehre zuerst docker system df aus, um den Speicherverbrauch vor dem Prunen zu sehen.',
    ],
  },

  'docker-inspect': {
    useCases: [
      'Detaillierte Konfiguration und Zustand von Containern, Images oder Netzwerken anzeigen',
      'Container-Netzwerk, Mounts und Umgebungsvariablen debuggen',
      'Spezifische Metadaten mit Go-Template-Formatierung extrahieren',
    ],
    internals:
      'docker inspect fragt den Docker-Daemon nach der vollstaendigen JSON-Darstellung eines Objekts ab. Dies umfasst Konfiguration, Zustand, Netzwerk-Einstellungen, Mountpunkte und mehr. Go-Templates koennen bestimmte Felder extrahieren.',
    mistakes: [
      'Von der vollstaendigen JSON-Ausgabe ueberwaealtigt werden -- verwende --format mit Go-Templates, um bestimmte Felder zu extrahieren.',
      'Den falschen Objekttyp inspizieren -- docker inspect erkennt den Typ automatisch, aber mehrdeutige Namen koennen das falsche Objekt treffen. Verwende explizit docker container inspect oder docker image inspect.',
    ],
    bestPractices: [
      'Verwende --format, um bestimmte Felder zu extrahieren: docker inspect --format "{{.NetworkSettings.IPAddress}}" container.',
      'Verwende docker inspect bei Netzwerken, um verbundene Container und deren IPs zu sehen.',
      'Pipe die Ausgabe durch jq fuer komplexe Abfragen: docker inspect container | jq .[0].Config.Env.',
    ],
  },

  helm: {
    useCases: [
      'Kubernetes-Anwendungen als Charts paketieren, versionieren und deployen',
      'Anwendungs-Releases mit Upgrade, Rollback und History verwalten',
      'Kubernetes-Manifeste mit konfigurierbaren Werten templaten',
    ],
    internals:
      'Helm rendert Go-Templates in chart templates/ unter Verwendung von Werten aus values.yaml und Overrides. Die gerenderten Manifeste werden ueber die Kubernetes-API auf den Cluster angewendet. Release-Metadaten werden als Secrets oder ConfigMaps im Ziel-Namespace gespeichert.',
    mistakes: [
      'Chart-Versionen nicht pinnen -- helm install ohne --version verwendet die neueste Chart-Version, die Breaking Changes einfuehren kann.',
      'Werte falsch ueberschreiben -- YAML-Einrueckungsfehler in --set oder -f-Dateien erzeugen stillschweigend falsche Konfigurationen. Verwende helm template, um gerenderte Manifeste zu pruefen.',
      'Release-Zustand nicht verstehen -- fehlgeschlagene Releases koennen zukuenftige Installationen blockieren. Verwende helm list -a, um alle Releases einschliesslich fehlgeschlagener zu sehen.',
    ],
    bestPractices: [
      'Pinne Chart-Versionen in CI/CD immer: helm install --version 1.2.3.',
      'Verwende helm template, um gerenderte Manifeste vor der Installation zu pruefen.',
      'Verwende helm diff (Plugin), um Aenderungen vor helm upgrade zu pruefen.',
      'Speichere Chart-Werte in versionskontrollierten Dateien statt in Inline-Set-Flags.',
    ],
  },

  // ─── SCRIPTING (15) ───────────────────────────────────────────────

  'bash-shebang': {
    useCases: [
      'Den Interpreter fuer ein Skript angeben, um sicherzustellen, dass es mit der richtigen Shell laeuft',
      'Skripte ausfuehrbar und selbstbeschreibend machen',
      'Zwischen bash, sh oder anderen Interpretern fuer Portabilitaet waehlen',
    ],
    internals:
      'Der Kernel liest die ersten zwei Bytes einer ausgefuehrten Datei. Wenn sie #! sind, parst er den Rest der Zeile als Interpreter-Pfad (und optionales Argument). Der Kernel fuehrt dann diesen Interpreter mit dem Skript-Pfad als Argument aus.',
    mistakes: [
      '#!/bin/bash verwenden, wenn #!/usr/bin/env bash portabler ist -- bash befindet sich moeglicherweise nicht auf allen Systemen unter /bin/bash (z.B. NixOS, FreeBSD). env durchsucht PATH.',
      'Bash-spezifische Syntax mit einem #!/bin/sh-Shebang schreiben -- sh kann dash oder eine andere minimale Shell sein, der bash-Features wie Arrays und [[ ]] fehlen.',
      'Vergessen, chmod +x fuer das Skript auszufuehren -- der Shebang wird nur verwendet, wenn die Datei direkt ausgefuehrt wird, was die Ausfuehrungsberechtigung erfordert.',
    ],
    bestPractices: [
      'Verwende #!/usr/bin/env bash fuer Portabilitaet.',
      'Verwende #!/bin/sh nur, wenn das Skript strikt POSIX-Shell-Syntax verwendet.',
      'Mache Skripte immer ausfuehrbar: chmod +x script.sh.',
      'Fuege set -euo pipefail nach dem Shebang fuer Sicherheit hinzu.',
    ],
  },

  'bash-variables': {
    useCases: [
      'Werte wie Dateipfade, Zaehler und Konfiguration speichern und wiederverwenden',
      'Daten zwischen Befehlen und Funktionen in Skripten uebergeben',
      'Spezielle Variablen ($?, $#, $@, $$) fuer Skript-Kontrollfluss verwenden',
    ],
    internals:
      'Bash-Variablen sind untypisierte Zeichenketten, die im Shell-Prozessspeicher gespeichert werden. declare kann Typen hinzufuegen (Integer, Array, Readonly). Variablenexpansion erfolgt waehrend der Wortexpansion, nach Brace-Expansion aber vor Field-Splitting und Glob-Expansion.',
    mistakes: [
      'Variablen nicht quoten -- ungequotete Variablen durchlaufen Word-Splitting und Glob-Expansion. "$var" ist fast immer korrekt; $var ist fast immer ein Bug.',
      'Leerzeichen um = bei der Zuweisung verwenden -- var = value wird als Befehl namens var mit Argumenten = und value geparst. Verwende var=value ohne Leerzeichen.',
      'Erwarten, dass Variablen ueber Subshells bestehen bleiben -- Pipeline-Komponenten und Befehle in $() laufen in Subshells. Dort gesetzte Variablen beeinflussen den Elternprozess nicht.',
    ],
    bestPractices: [
      'Setze Variablenexpansionen immer in doppelte Anfuehrungszeichen: "$variable".',
      'Verwende ${variable} fuer Klarheit bei Zeichenkettenverkettung: "${prefix}_suffix".',
      'Verwende readonly fuer Konstanten: readonly CONFIG_DIR="/etc/myapp".',
      'Verwende declare -i fuer Integer-Variablen, um arithmetische Zuweisung zu ermoeglichen.',
    ],
  },

  'bash-if': {
    useCases: [
      'Skriptausfuehrung basierend auf Bedingungen verzweigen (Dateiexistenz, Zeichenkettenvergleich, Exit-Codes)',
      'Fehlerfaelle behandeln und Fallback-Verhalten bereitstellen',
      'Eingaben vor der Verarbeitung in Skripten validieren',
    ],
    internals:
      'Das if-Konstrukt wertet den Exit-Code des Befehls nach if aus. Ein Exit-Code von 0 bedeutet wahr (then-Zweig), ungleich null bedeutet falsch (elif/else-Zweig). [, [[ und test sind Befehle, die bedingte Ausdruecke auswerten und entsprechende Exit-Codes zurueckgeben.',
    mistakes: [
      'Einfache Klammern ohne Quoting verwenden -- [ $var = "x" ] bricht, wenn $var leer ist oder Leerzeichen enthaelt. Verwende [[ $var = "x" ]] oder quote: [ "$var" = "x" ].',
      '= und == und -eq verwechseln -- = und == sind fuer Zeichenketten (in [[ ]]). -eq ist fuer Ganzzahlen. = fuer Ganzzahlvergleich macht Zeichenkettenvergleich.',
      'Das Leerzeichen vor ] vergessen -- [test] wird als Befehl namens [test] geparst. Verwende [ test ] mit Leerzeichen.',
    ],
    bestPractices: [
      'Bevorzuge [[ ]] gegenueber [ ] in bash fuer sicherere Syntax mit &&, ||, Musterabgleich und ohne Word-Splitting.',
      'Verwende if command; then zum direkten Pruefen von Exit-Codes statt if [ $? -eq 0 ].',
      'Verwende -f, -d, -r, -w, -x fuer Dateitests: if [[ -f "$file" ]]; then.',
    ],
  },

  'bash-for': {
    useCases: [
      'Ueber Listen von Dateien, Argumenten oder generierten Sequenzen iterieren',
      'Jede Zeile einer Befehlsausgabe verarbeiten',
      'C-artige gezaehlte Schleifen mit Arithmetik durchfuehren',
    ],
    internals:
      'Die for-in-Schleife iteriert ueber eine Wortliste, die durch Shell-Expansion erzeugt wird. Die C-artige for (( ))-Schleife verwendet arithmetische Auswertung. In beiden Faellen laeuft der Schleifenkoerper in der aktuellen Shell, sodass Variablenaenderungen bestehen bleiben.',
    mistakes: [
      'Ueber Befehlsausgabe ohne richtiges Quoting iterieren -- for f in $(ls) bricht bei Dateinamen mit Leerzeichen. Verwende for f in ./* oder while IFS= read -r fuer zeilenweise Verarbeitung.',
      'for zum Lesen von Zeilen aus einer Datei verwenden -- for liest Woerter, nicht Zeilen. Verwende stattdessen while IFS= read -r line.',
      'Die Schluesselwoerter do und done vergessen -- Syntaxfehler durch fehlendes do oder done sind haeufig. Ordne jedem for ein do...done zu.',
    ],
    bestPractices: [
      'Verwende for f in ./*.txt zum Iterieren ueber Dateien (glob-basiert, behandelt Leerzeichen korrekt).',
      'Verwende for (( i=0; i<n; i++ )) fuer gezaehlte Schleifen.',
      'Verwende for arg in "$@" zum Iterieren ueber Skript-Argumente (Anfuehrungszeichen erhalten Argumente mit Leerzeichen).',
    ],
  },

  'bash-while': {
    useCases: [
      'Dateien oder Befehlsausgaben zeilenweise lesen',
      'Retry-Schleifen implementieren, die auf eine Bedingung warten',
      'Polling-Schleifen oder Ereignisverarbeitungsschleifen ausfuehren',
    ],
    internals:
      'while wertet den Exit-Code seines Bedingungsbefehls aus. Wenn 0 (wahr), fuehrt es den Koerper aus und wiederholt die Schleife. Die Bedingung wird bei jeder Iteration neu ausgewertet. while true erstellt eine Endlosschleife. Die Schleife laeuft in der aktuellen Shell, es sei denn, sie ist Teil einer Pipeline.',
    mistakes: [
      'while read in einer Pipeline verwenden -- Pipeline-Komponenten laufen in Subshells, sodass darin gesetzte Variablen verloren gehen. Verwende while read ... done < <(command) mit Process-Substitution.',
      'Endlosschleifen ohne sleep oder Exit-Bedingung -- diese verbrauchen 100% CPU. Fuege immer einen sleep fuer Polling oder eine break-Bedingung ein.',
      '-r bei read vergessen -- ohne -r werden Backslashes in der Eingabe als Escape-Zeichen behandelt. Verwende immer while IFS= read -r line.',
    ],
    bestPractices: [
      'Verwende while IFS= read -r line; do ... done < file als idiomatisches Muster zum zeilenweisen Lesen von Dateien.',
      'Verwende Process-Substitution fuer Befehlsausgabe: while read -r line; do ...; done < <(command).',
      'Fuege eine break- oder Timeout-Bedingung in Polling-Schleifen ein, um endloses Haengen zu vermeiden.',
    ],
  },

  'bash-functions': {
    useCases: [
      'Wiederverwendbare Logik in Shell-Skripten kapseln',
      'Komplexe Skripte in handhabbare Einheiten organisieren',
      'Skript-lokale Befehle mit Parametern und Rueckgabewerten erstellen',
    ],
    internals:
      'Bash-Funktionen werden im Shell-Speicher gespeichert und in der aktuellen Shell ausgefuehrt (nicht in einer Subshell). Sie haben Zugriff auf alle globalen Variablen und koennen sie aendern. Argumente werden ueber $1, $2 usw. zugegriffen. Die return-Anweisung setzt den Exit-Code (0-255), keinen Wert.',
    mistakes: [
      'return verwenden, um eine Zeichenkette zurueckzugeben -- return setzt nur den Exit-Code (0-255). Um Daten zurueckzugeben, verwende echo und fange mit $() ab: result=$(my_function).',
      'Den globalen Namespace verschmutzen -- alle Variablen in Funktionen sind standardmaessig global. Verwende local, um funktionslokale Variablen zu deklarieren.',
      'Argumente nicht korrekt handhaben -- $@ innerhalb einer Funktion bezieht sich auf Funktionsargumente, nicht Skript-Argumente. Uebergib Skript-Argumente explizit.',
    ],
    bestPractices: [
      'Deklariere alle Funktionsvariablen mit local, um Namespace-Verschmutzung zu verhindern.',
      'Verwende echo fuer Ausgabe und fange mit Command-Substitution ab: result=$(func).',
      'Pruefe die Argumentanzahl am Anfang: [[ $# -lt 1 ]] && { echo "Verwendung: ..."; return 1; }.',
      'Definiere Funktionen, bevor sie aufgerufen werden (bash liest Skripte sequenziell).',
    ],
  },

  'bash-arrays': {
    useCases: [
      'Listen von Elementen speichern und manipulieren (Dateinamen, Argumente, Optionen)',
      'Befehlsargumente dynamisch aufbauen',
      'Sammlungen zusammengehoeriger Werte in Skripten verarbeiten',
    ],
    internals:
      'Bash unterstuetzt indizierte Arrays (Ganzzahl-Schluessel) und assoziative Arrays (Zeichenketten-Schluessel, declare -A). Arrays werden im Shell-Speicher gespeichert. Array-Expansion "${arr[@]}" erzeugt separate Woerter fuer jedes Element und erhaelt Elemente mit Leerzeichen.',
    mistakes: [
      'Array-Expansionen nicht quoten -- ${arr[@]} ohne Anfuehrungszeichen durchlaeuft Word-Splitting. Verwende immer "${arr[@]}", um Element-Grenzen zu erhalten.',
      '${arr[*]} und ${arr[@]} verwechseln -- * verbindet alle Elemente zu einer einzigen Zeichenkette (mit IFS), @ haelt sie getrennt. Verwende @ zum Iterieren.',
      'Versuchen, Arrays an Funktionen zu uebergeben -- bash kann Arrays nicht direkt uebergeben. Uebergib "${arr[@]}" und empfange als Argumente, oder uebergib den Array-Namen und verwende Nameref (declare -n).',
    ],
    bestPractices: [
      'Setze Array-Expansionen immer in Anfuehrungszeichen: "${array[@]}".',
      'Verwende declare -A fuer assoziative Arrays (bash 4+).',
      'Verwende array+=("element"), um an ein Array anzufuegen.',
      'Verwende ${#array[@]}, um die Array-Laenge zu erhalten.',
    ],
  },

  'bash-case': {
    useCases: [
      'Eine Variable gegen mehrere Muster abgleichen als Alternative zu if-elif-Ketten',
      'Kommandozeilenoptionen und Unterbefehle in Skripten parsen',
      'Mehrere Dateitypen oder Modi mit Musterabgleich behandeln',
    ],
    internals:
      'case fuehrt Musterabgleich (Glob-Muster, kein Regex) gegen das angegebene Wort durch. Es probiert jedes Muster der Reihe nach und fuehrt die Befehle fuer den ersten Treffer aus. ;; beendet eine Klausel, ;;& faellt zum naechsten Mustertest durch, ;& faellt bedingungslos durch.',
    mistakes: [
      'Die doppelten Semikolons ;; vergessen -- jede case-Klausel muss mit ;; enden. Fehlende ;; verursachen Syntaxfehler.',
      'Keinen Default-Case einschliessen -- ohne einen *)-Default-Handler passiert bei nicht gematchten Eingaben stillschweigend nichts. Fuege eine *)-Klausel fuer Fehlerbehandlung hinzu.',
      'Regex statt Globs verwenden -- case verwendet Glob-Muster (*, ?, [...]). Fuer Regex-Abgleich verwende stattdessen [[ =~ ]].',
    ],
    bestPractices: [
      'Schliesse immer einen *)-Default-Case fuer die Behandlung unerwarteter Eingaben ein.',
      'Verwende | fuer ODER-Muster: case $opt in -h|--help) ... ;;.',
      'Verwende case zum Parsen von CLI-Optionen und Unterbefehlen fuer Klarheit.',
    ],
  },

  'bash-redirect': {
    useCases: [
      'Befehlsausgabe in Dateien senden oder verwerfen',
      'stdout und stderr in verschiedene Ziele trennen',
      'Dateiinhalte als Eingabe an Befehle weiterleiten',
    ],
    internals:
      'Shell-Umleitungen manipulieren Dateideskriptoren ueber dup2-Syscalls vor exec. > schneidet ab und schreibt auf fd 1 (stdout), 2> leitet fd 2 (stderr) um, >> haengt an, < liest von fd 0 (stdin). &> leitet sowohl stdout als auch stderr um. Here-Documents (<<) erstellen temporaere Dateien oder Pipes.',
    mistakes: [
      '2>&1 > file statt > file 2>&1 verwenden -- Umleitungen werden von links nach rechts verarbeitet. 2>&1 > file sendet stderr an das urspruengliche stdout (Terminal), nicht die Datei. Kehre die Reihenfolge um.',
      '> verwenden, wenn >> beabsichtigt war -- > schneidet die Datei zuerst ab. Verwende >> zum Anhaengen.',
      'In einer Pipeline statt am Ende umleiten -- cmd > file | other faengt die Ausgabe in file ab, nicht in der Pipeline. Platziere Umleitungen sorgfaeltig.',
    ],
    bestPractices: [
      'Verwende > file 2>&1 oder &> file, um sowohl stdout als auch stderr in eine Datei umzuleiten.',
      'Verwende 2>/dev/null, um Fehlermeldungen zu verwerfen.',
      'Verwende tee, um in eine Datei zu schreiben und trotzdem die Ausgabe zu sehen: cmd | tee output.log.',
      'Verwende <<EOF Heredocs fuer mehrzeilige Eingabe an Befehle.',
    ],
  },

  'bash-pipe': {
    useCases: [
      'Befehle verketten, indem stdout mit stdin verbunden wird',
      'Datenverarbeitungs-Pipelines mit Filtern und Transformationen bauen',
      'Einfache Tools zu komplexen Operationen zusammensetzen (Unix-Philosophie)',
    ],
    internals:
      'Die Shell erstellt eine pipe(2) (einen Kernel-Puffer) zwischen jedem Befehlspaar. Jeder Befehl in der Pipeline laeuft als separater Prozess in seiner eigenen Subshell. Daten fliessen durch den Kernel-Pipe-Puffer (typischerweise 64KB unter Linux). Der Pipeline-Exit-Code ist standardmaessig der des letzten Befehls (oder bei pipefail jeder Fehler).',
    mistakes: [
      'Erwarten, dass in einer Pipeline gesetzte Variablen bestehen bleiben -- jede Pipeline-Komponente laeuft in einer Subshell. Darin gesetzte Variablen beeinflussen den Elternprozess nicht. Verwende stattdessen Process-Substitution.',
      'set -o pipefail nicht verwenden -- ohne es gibt cmd_that_fails | sort den Exit-Code von sort (0) zurueck und verbirgt den Fehler. Aktiviere immer pipefail.',
    ],
    bestPractices: [
      'Aktiviere set -o pipefail in Skripten, um Fehler in jeder Pipeline-Stufe zu erkennen.',
      'Verwende das PIPESTATUS-Array, um einzelne Exit-Codes zu pruefen: ${PIPESTATUS[0]}.',
      'Vermeide unnoetige Verwendung von cat: statt cat file | grep x verwende grep x file.',
    ],
  },

  'bash-trap': {
    useCases: [
      'Temporaere Dateien oder Prozesse aufraeumen, wenn ein Skript beendet wird',
      'SIGINT (Ctrl+C) in interaktiven Skripten ordentlich behandeln',
      'Fehler mit dem ERR-Pseudo-Signal loggen oder melden',
    ],
    internals:
      'trap registriert einen Handler-String fuer angegebene Signale oder Pseudo-Signale. EXIT feuert bei jedem Exit. ERR feuert bei jedem Befehlsfehler (wenn set -e aktiv ist). DEBUG feuert vor jedem Befehl. RETURN feuert, wenn eine Funktion oder gesourcte Datei zurueckkehrt.',
    mistakes: [
      'Einfache vs doppelte Anfuehrungszeichen beim Trap-Befehl zum falschen Zeitpunkt -- einfache Anfuehrungszeichen verzoegern die Expansion bis zur Ausfuehrung (normalerweise gewuenscht). Doppelte Anfuehrungszeichen expandieren Variablen zum Definitionszeitpunkt, was veraltete Werte erfassen kann.',
      'Nur EXIT trappen und SIGTERM uebersehen -- manche Prozessmanager senden SIGTERM vor SIGKILL. Trappe SIGTERM explizit, wenn Aufraeumen kritisch ist.',
    ],
    bestPractices: [
      'Verwende trap cleanup EXIT als primaeren Aufraeum-Mechanismus.',
      'Verwende einfache Anfuehrungszeichen fuer Trap-Befehle, um Variablenexpansion zu verzoegern: trap \'rm -f "$tmpfile"\' EXIT.',
      'Trappe mehrere Signale: trap cleanup EXIT SIGINT SIGTERM.',
    ],
  },

  'bash-getopts': {
    useCases: [
      'Kurze Kommandozeilenoptionen (-v, -f dateiname) in Shell-Skripten parsen',
      'Skripte mit standardisierter Unix-artiger Optionsbehandlung bauen',
      'Kommandozeilenargumente systematisch validieren und verarbeiten',
    ],
    internals:
      'getopts ist ein Shell-Built-in, das Positionsparameter einzeln verarbeitet. Es verwendet OPTIND zur Positionsverfolgung und OPTARG fuer Optionsargumente. Es behandelt kombinierte Flags (-abc) und Optionen mit Argumenten (-f value). Es unterstuetzt nur kurze Optionen.',
    mistakes: [
      'OPTIND nicht zuruecksetzen, wenn getopts erneut aufgerufen wird -- OPTIND behaelt seinen Wert zwischen Aufrufen. Setze es auf 1 zurueck, wenn ein zweiter Satz von Argumenten geparst wird.',
      'getopts mit getopt verwechseln -- getopts ist das bash-Built-in (nur kurze Optionen). getopt ist ein externer Befehl, der lange Optionen unterstuetzt, aber Portabilitaetsprobleme hat.',
      'Den fuehrenden Doppelpunkt fuer stille Fehlerbehandlung vergessen -- ohne fuehrenden : im Optionsstring gibt getopts eigene Fehlermeldungen aus. Verwende ":vf:" fuer benutzerdefinierte Fehlerbehandlung.',
    ],
    bestPractices: [
      'Verwende einen fuehrenden Doppelpunkt im Optionsstring fuer benutzerdefinierte Fehlerbehandlung: getopts ":vf:" opt.',
      'Behandle die ? und :-Faelle fuer unbekannte Optionen und fehlende Argumente.',
      'Shifte nach getopts: shift $((OPTIND - 1)), um auf verbleibende Nicht-Options-Argumente zuzugreifen.',
    ],
  },

  'bash-subshell': {
    useCases: [
      'Umgebungsaenderungen (cd, Variablenzuweisungen) von der Eltern-Shell isolieren',
      'Eine Gruppe von Befehlen in einem separaten Kontext mit ( ... ) ausfuehren',
      'Befehlsausgabe mit $( ... ) Command-Substitution abfangen',
    ],
    internals:
      'Eine Subshell ist ein Kindprozess, der durch fork() erstellt wird. Sie erbt eine Kopie aller Variablen, Dateideskriptoren und Optionen vom Elternprozess. Aenderungen in der Subshell (Variablenzuweisungen, cd) beeinflussen den Elternprozess nicht. ( ) erzwingt eine Subshell; $( ) erstellt eine zur Erfassung.',
    mistakes: [
      'Erwarten, dass Subshell-Aenderungen den Elternprozess beeinflussen -- Variablen, die in ( ), $( ) oder Pipeline-Komponenten gesetzt werden, propagieren nicht zurueck. Redesigne, um dies zu vermeiden, oder verwende Process-Substitution.',
      'Unnoetige Subshells erstellen -- $( ) und ( ) erstellen Prozesse. Verwende { } zum Gruppieren von Befehlen in der aktuellen Shell, wenn Isolation nicht benoetigt wird.',
    ],
    bestPractices: [
      'Verwende ( cd /tmp && command ), um temporaer das Verzeichnis zu wechseln, ohne den Elternprozess zu beeinflussen.',
      'Verwende { } statt ( ), wenn du keine Subshell-Isolation benoetigst, um Fork-Overhead zu vermeiden.',
      'Verwende $( ) fuer Command-Substitution statt Backticks fuer Lesbarkeit und Verschachtelungsunterstuetzung.',
    ],
  },

  'bash-regex': {
    useCases: [
      'Zeichenketten gegen Muster in [[ =~ ]]-Bedingungen abgleichen',
      'Erfasste Gruppen aus Zeichenketten mit BASH_REMATCH extrahieren',
      'Eingabeformate (E-Mails, Datumsangaben, Versionen) in Skripten validieren',
    ],
    internals:
      'Der =~-Operator in [[ ]] fuehrt POSIX Extended Regular Expression Matching durch. Der Regex darf nicht gequotet werden (Quoting macht ihn zu einem woertlichen String). Erfasste Gruppen werden im BASH_REMATCH-Array gespeichert: [0] ist der vollstaendige Treffer, [1]+ sind Capture-Gruppen.',
    mistakes: [
      'Das Regex-Muster quoten -- [[ $str =~ "^[0-9]+" ]] matcht den woertlichen String ^[0-9]+. Quote den Regex nicht: [[ $str =~ ^[0-9]+ ]].',
      'BASH_REMATCH nicht pruefen -- nach einem erfolgreichen Match befinden sich Capture-Gruppen in BASH_REMATCH. Sie nicht zu verwenden, verfehlt den Sinn des Regex-Matchings.',
      'Regex verwenden, wenn ein Glob ausreichen wuerde -- fuer einfachen Musterabgleich ist [[ $str == *.txt ]] (Glob) einfacher und lesbarer als Regex.',
    ],
    bestPractices: [
      'Speichere komplexe Muster in einer Variable: pattern="^v([0-9]+)\\.([0-9]+)"; [[ $v =~ $pattern ]].',
      'Greife auf Capture-Gruppen ueber ${BASH_REMATCH[1]}, ${BASH_REMATCH[2]} usw. zu.',
      'Verwende Globs fuer einfaches Matching und Regex nur, wenn du Capture-Gruppen oder komplexe Muster benoetigst.',
    ],
  },

  'bash-debug': {
    useCases: [
      'Skriptausfuehrung nachverfolgen, um zu finden, wo Fehler auftreten',
      'Jeden Befehl und seine Argumente bei der Ausfuehrung ausgeben',
      'Komplexe Variablenexpansion und bedingte Logik debuggen',
    ],
    internals:
      'set -x aktiviert xtrace, das jeden Befehl nach der Expansion aber vor der Ausfuehrung auf stderr ausgibt (mit PS4-Praefix). bash -x script.sh aktiviert es fuer das gesamte Skript. set -v gibt Zeilen vor der Expansion aus. trap mit DEBUG feuert vor jedem Befehl.',
    mistakes: [
      'set -x in Produktionsskripten belassen -- xtrace-Ausgabe kann sensible Daten (Passwoerter, Tokens) in Logs leaken. Entferne es oder sichere es hinter einem Debug-Flag.',
      'PS4 nicht verwenden, um Kontext hinzuzufuegen -- der Standard-PS4 ist "+". Setze PS4="+ ${BASH_SOURCE}:${LINENO}: ", um Datei und Zeilennummer in die Trace-Ausgabe einzuschliessen.',
    ],
    bestPractices: [
      'Verwende set -x selektiv um problematische Abschnitte, nicht das gesamte Skript.',
      'Setze PS4="+ \\${BASH_SOURCE}:\\${LINENO}: " fuer informative Trace-Ausgabe mit Datei und Zeilennummern.',
      'Verwende bash -x script.sh zum Debuggen, ohne das Skript zu aendern.',
      'Verwende shellcheck, um Bugs statisch vor dem Laufzeit-Debugging zu erkennen.',
    ],
  },

  // ─── DEVELOPER TOOLS (16) ─────────────────────────────────────────

  make: {
    useCases: [
      'Build-Prozesse fuer C/C++ und andere kompilierte Projekte automatisieren',
      'Task-Runner fuer beliebige Projekte mit Makefile-Targets definieren',
      'Nur geaenderte Dateien basierend auf Abhaengigkeitsverfolgung neu bauen',
    ],
    internals:
      'make liest ein Makefile mit Targets, Voraussetzungen und Rezepten. Es baut einen Abhaengigkeits-DAG, prueft Datei-Aenderungszeiten, um festzustellen, was veraltet ist, und fuehrt die minimale Menge an Rezepten aus, um Targets aktuell zu bringen. Jede Rezeptzeile laeuft in einer separaten Shell.',
    mistakes: [
      'Leerzeichen statt Tabs fuer Rezept-Einrueckung verwenden -- make erfordert Tabs, keine Leerzeichen, fuer Rezeptzeilen. Dies ist eine haeufige Ursache fuer "missing separator"-Fehler.',
      '.PHONY-Targets nicht deklarieren -- Targets wie clean, die keine Dateien erzeugen, sollten als .PHONY deklariert werden. Andernfalls wird das Target uebersprungen, wenn eine Datei namens clean existiert.',
      'Annehmen, dass Variablen ueber Rezeptzeilen bestehen bleiben -- jede Zeile laeuft in einer separaten Shell. Verwende Backslash-Fortsetzung oder .ONESHELL fuer mehrzeilige Rezepte.',
    ],
    bestPractices: [
      'Deklariere .PHONY fuer Nicht-Datei-Targets: .PHONY: clean test build.',
      'Verwende Variablen fuer Compiler-Flags: CFLAGS = -Wall -O2.',
      'Verwende make -j$(nproc) fuer parallele Builds.',
      'Verwende make -n (Trockenlauf), um eine Vorschau dessen zu sehen, was ausgefuehrt wird.',
    ],
  },

  gcc: {
    useCases: [
      'C- und C++-Quellcode in ausfuehrbare Dateien oder Objektdateien kompilieren',
      'Optimierte Binarys fuer Produktions-Deployment generieren',
      'Mit Debug-Symbolen kompilieren fuer die Verwendung mit gdb und valgrind',
    ],
    internals:
      'gcc orchestriert vier Stufen: Praeprozessierung (cpp), Kompilierung (cc1 zu Assembly), Assemblierung (as zu Objektdateien) und Linken (ld). Jede Stufe kann separat mit -E, -S, -c ausgefuehrt werden. Der Optimierer arbeitet auf Zwischendarstellungen (GIMPLE, RTL) zwischen den Kompilierungsstufen.',
    mistakes: [
      'Warnungen nicht aktivieren -- gcc ohne Flags kompiliert still, auch bei Bugs. Verwende mindestens -Wall -Wextra.',
      'Optimierten Code debuggen -- Optimierungen ordnen Code um und eliminieren ihn, was Debugging unzuverlaessig macht. Verwende -O0 -g fuer Debug-Builds.',
      'Vergessen, die Math-Bibliothek zu linken -- Funktionen aus math.h erfordern -lm: gcc prog.c -lm.',
    ],
    bestPractices: [
      'Verwende -Wall -Wextra -Werror waehrend der Entwicklung fuer maximale Fehlererkennung.',
      'Verwende -g fuer Debug-Builds (mit gdb/valgrind) und -O2 fuer Release-Builds.',
      'Verwende -fsanitize=address,undefined fuer Laufzeit-Fehlererkennung beim Testen.',
      'Verwende -std=c11 oder -std=c17, um den C-Standard explizit anzugeben.',
    ],
  },

  node: {
    useCases: [
      'JavaScript- und TypeScript-Anwendungen auf dem Server ausfuehren',
      'Skripte und CLI-Tools in JavaScript ausfuehren',
      'Die Node.js-REPL fuer schnelle JavaScript-Experimente verwenden',
    ],
    internals:
      'Node.js bettet die V8-JavaScript-Engine ein und bietet asynchrone I/O ueber libuv, das einen Event-Loop verwendet, der von epoll/kqueue/IOCP unterstuetzt wird. Singlethreaded fuer JS-Ausfuehrung, aber mit Thread-Pool fuer blockierende Operationen (DNS, Dateisystem). Module werden ueber den node_modules-Algorithmus aufgeloest.',
    mistakes: [
      'Den Event-Loop mit synchronen Operationen blockieren -- CPU-intensive Aufgaben blockieren alle anderen Operationen. Verwende worker_threads oder lagere in externe Prozesse aus.',
      'Promise-Rejections nicht behandeln -- unbehandelte Rejections lassen den Prozess in modernem Node.js abstuerzen. Verwende immer .catch() oder try/catch mit async/await.',
      'Veraltete Callbacks statt Promises verwenden -- die meisten Node.js-APIs unterstuetzen jetzt Promises ueber fs/promises usw.',
    ],
    bestPractices: [
      'Verwende async/await mit try/catch fuer sauberen asynchronen Code.',
      'Verwende das --watch-Flag (Node 18+) fuer automatischen Neustart waehrend der Entwicklung.',
      'Setze engines in package.json, um die minimale Node.js-Version zu erzwingen.',
      'Verwende ESM (import/export) statt CommonJS (require) fuer neue Projekte.',
    ],
  },

  python3: {
    useCases: [
      'Python-Skripte und -Anwendungen ausfuehren',
      'Die interaktive Python-REPL fuer schnelle Experimente und Datenexploration verwenden',
      'Einzeiler von der Kommandozeile mit python3 -c ausfuehren',
    ],
    internals:
      'CPython kompiliert Quellcode zu Bytecode (.pyc-Dateien gecacht in __pycache__) und fuehrt ihn auf einer stapelbasierten virtuellen Maschine aus. Die GIL (Global Interpreter Lock) serialisiert Thread-Ausfuehrung. Modulaufloesung durchsucht sys.path der Reihe nach.',
    mistakes: [
      'python statt python3 verwenden -- auf vielen Systemen zeigt python auf Python 2 (oder existiert nicht). Verwende immer explizit python3.',
      'Pakete global mit pip installieren -- globale Installationen verursachen Versionskonflikte. Verwende virtuelle Umgebungen: python3 -m venv .venv.',
      'Standard-mutable-Argumente mutieren -- def f(lst=[]): Anfuegungen bleiben ueber Aufrufe bestehen. Verwende None als Standard und erstelle innerhalb.',
    ],
    bestPractices: [
      'Verwende immer virtuelle Umgebungen: python3 -m venv .venv && source .venv/bin/activate.',
      'Verwende python3 -m pip statt pip direkt, um die korrekte Python-Version sicherzustellen.',
      'Verwende python3 -m module_name, um Module als Skripte auszufuehren (vermeidet PATH-Probleme).',
      'Pinne Abhaengigkeiten in requirements.txt oder pyproject.toml.',
    ],
  },

  gdb: {
    useCases: [
      'Kompilierte C/C++-Programme interaktiv mit Breakpoints und Stepping debuggen',
      'Core-Dumps abgestuerzter Programme post-mortem analysieren',
      'Speicher, Variablen und Call-Stacks waehrend der Ausfuehrung inspizieren',
    ],
    internals:
      'gdb verwendet den ptrace-Syscall, um sich an einen Zielprozess anzuhaengen und ihn zu steuern. Es liest DWARF-Debug-Informationen (von -g-Kompilierung), um Maschinenadressen auf Quellzeilen, Variablennamen und Typen abzubilden. Breakpoints werden implementiert, indem Instruktionen durch INT 3 (auf x86) ersetzt werden.',
    mistakes: [
      'Debuggen ohne -g -- ohne Debug-Symbole zeigt gdb rohen Speicher und Adressen statt Variablennamen und Quellzeilen. Kompiliere mit gcc -g.',
      'Optimierte Builds debuggen -- Compiler-Optimierungen ordnen Code um und eliminieren Variablen. Verwende -O0 mit -g fuer zuverlaessiges Debuggen.',
      'gdb-Befehle nicht effizient nutzen -- manuelles Durchsteppen von Code ist langsam. Lerne bedingte Breakpoints und Watchpoints.',
    ],
    bestPractices: [
      'Kompiliere mit -g -O0 fuer Debug-Sitzungen.',
      'Verwende break, run, next, step, print und backtrace als Kernbefehle.',
      'Verwende bedingte Breakpoints: break file.c:42 if x > 100.',
      'Verwende gdb -tui fuer eine geteilte Quellansicht, oder verwende cgdb fuer ein besseres TUI.',
    ],
  },

  valgrind: {
    useCases: [
      'Speicherlecks und ungueltigen Speicherzugriff in C/C++-Programmen erkennen',
      'Use-after-free, Buffer-Overflows und uninitialisierte Speicherlesevorgaenge finden',
      'Speichernutzung und Cache-Verhalten profilen',
    ],
    internals:
      'Valgrind fuehrt das Programm auf einer synthetischen CPU aus, die jeden Speicherzugriff instrumentiert. Das Memcheck-Tool verfolgt jedes Byte Speicher mit Gueltigkeits- (V) und Adressierbarkeits- (A) Bits. Diese Instrumentierung macht Programme 10-50x langsamer, erkennt aber Fehler praezise.',
    mistakes: [
      'Nicht mit -g kompilieren -- ohne Debug-Symbole meldet Valgrind Fehler ohne Datei- und Zeileninformationen. Verwende immer -g.',
      '"possibly lost"-Meldungen ignorieren -- diese weisen oft auf echte Lecks durch Interior-Pointer hin. Untersuche sie.',
      'Optimierte Builds ausfuehren -- Inlining und Optimierung verschleiern Fehlerpositionen. Verwende -O0 oder -O1 fuer Valgrind-Laeufe.',
    ],
    bestPractices: [
      'Kompiliere mit -g -O0 fuer die genaueste Valgrind-Ausgabe.',
      'Verwende --leak-check=full --show-leak-kinds=all fuer gruendliche Leck-Erkennung.',
      'Verwende Suppression-Dateien, um bekannte Falsch-Positive von Systembibliotheken zu ignorieren.',
      'Erwaege AddressSanitizer (-fsanitize=address) fuer schnellere Pruefungen in CI.',
    ],
  },

  ab: {
    useCases: [
      'Schnelles HTTP-Benchmarking von Webservern',
      'Request-Durchsatz und Latenz unter Last messen',
      'Einfache Lasttests fuer Entwicklungs- und Staging-Umgebungen',
    ],
    internals:
      'Apache Bench (ab) erstellt eine konfigurierbare Anzahl gleichzeitiger HTTP-Verbindungen und sendet Requests in einer Schleife. Es misst Antwortzeiten und berechnet Statistiken (Mittelwert, Median, Perzentile). Es verwendet einen einzelnen Thread mit nicht-blockierender I/O.',
    mistakes: [
      'Keinen abschliessenden Slash fuer URLs einschliessen -- ab kann sich bei bestimmten URL-Formaten unerwartet verhalten. Schliesse immer den vollstaendigen URL-Pfad ein.',
      'ab fuer serioeoses Benchmarking verwenden -- ab ist auf HTTP/1.0 beschraenkt, singlethreaded und hat keine erweiterten Features. Verwende hey, wrk oder k6 fuer Produktions-Benchmarking.',
    ],
    bestPractices: [
      'Verwende ab -n 1000 -c 10 fuer 1000 Requests mit 10 gleichzeitigen Verbindungen.',
      'Verwende -k fuer Keep-Alive-Verbindungen, um persistente Verbindungsperformance zu testen.',
      'Erwaege hey oder wrk fuer genaueres und funktionsreicheres Benchmarking.',
    ],
  },

  hey: {
    useCases: [
      'Modernes HTTP-Lasttesting mit detaillierten Latenz-Histogrammen',
      'APIs mit benutzerdefinierten Headern, Methoden und Body-Payloads benchmarken',
      'Serverperformance unter gleichzeitiger Last testen',
    ],
    internals:
      'hey ist ein Go-basierter HTTP-Lastgenerator, der Goroutines fuer Concurrency verwendet. Es unterstuetzt HTTP/1.1 und HTTP/2, benutzerdefinierte Request-Bodies und gibt detaillierte Latenzverteilungs-Histogramme und Perzentildaten aus.',
    mistakes: [
      'Den Server nicht aufwaermen -- die ersten Requests beinhalten Verbindungsaufbau-Overhead. Sende zuerst einen Aufwaerm-Batch oder ignoriere anfaengliche Ergebnisse.',
      'Zu viele gleichzeitige Verbindungen fuer das Testszenario verwenden -- mehr Verbindungen als der Server verarbeiten kann, verzerrt Ergebnisse in Richtung Verbindungsfehler statt tatsaechlicher Performance.',
    ],
    bestPractices: [
      'Verwende hey -n 10000 -c 50 fuer einen soliden Baseline-Benchmark.',
      'Verwende -m und -d, um POST/PUT-Requests mit Bodies zu testen: hey -m POST -d "payload" URL.',
      'Fokussiere dich auf p99-Latenz, nicht den Durchschnitt, fuer realistische Performance-Bewertung.',
    ],
  },

  'git-hooks': {
    useCases: [
      'Linter und Formatter automatisch vor Commits ausfuehren',
      'Commit-Nachricht-Konventionen mit commit-msg-Hooks erzwingen',
      'CI-Builds oder Deployments bei Push mit serverseitigen Hooks ausloesen',
    ],
    internals:
      'Git-Hooks sind ausfuehrbare Skripte in .git/hooks/, die Git an bestimmten Lifecycle-Punkten ausfuehrt. Clientseitige Hooks (pre-commit, commit-msg, pre-push) laufen auf Entwickler-Rechnern. Serverseitige Hooks (pre-receive, post-receive) laufen auf dem Remote. Hooks koennen Operationen abbrechen, indem sie mit einem Exit-Code ungleich null beenden.',
    mistakes: [
      'Hooks sind nicht ausfuehrbar -- Git ueberspringt Hooks ohne Execute-Bit stillschweigend. Verwende chmod +x fuer Hook-Skripte.',
      'Hooks werden nicht mit dem Team geteilt -- .git/hooks/ wird nicht von Git getrackt. Verwende ein Hooks-Verzeichnis im Repo und konfiguriere core.hooksPath, oder verwende Tools wie husky oder pre-commit.',
      'Langsame Hooks frustrieren Entwickler -- langlebige pre-commit-Hooks verlangsamen den Workflow. Halte Hooks schnell oder fuehre schwere Pruefungen in CI aus.',
    ],
    bestPractices: [
      'Verwende core.hooksPath, um Hooks ueber ein versionskontrolliertes Verzeichnis zu teilen.',
      'Verwende das pre-commit-Framework oder husky fuer einfaches Hook-Management.',
      'Halte pre-commit-Hooks unter 5 Sekunden fuer gute Entwicklererfahrung.',
      'Verwende --no-verify sparsam und nur mit gutem Grund.',
    ],
  },

  ltrace: {
    useCases: [
      'Bibliotheksfunktionsaufrufe eines Programms nachverfolgen',
      'Shared-Library-Interaktionen und Parameterwerte debuggen',
      'Bibliotheksaufrufmuster zwischen Programmlaeufen vergleichen',
    ],
    internals:
      'ltrace faengt dynamische Bibliotheksaufrufe ab, indem es PLT-Eintraege (Procedure Linkage Table) manipuliert. Es setzt Breakpoints an PLT-Stubs, um Funktionsnamen, Argumente und Rueckgabewerte zu erfassen. Es verwendet ptrace zur Steuerung des Zielprozesses.',
    mistakes: [
      'ltrace auf statisch gelinkten Binarys verwenden -- ltrace verfolgt nur dynamische Bibliotheksaufrufe ueber die PLT. Statisch gelinkte Funktionen sind unsichtbar.',
      'Von der Ausgabe ueberwaealtigt werden -- beschaeftigte Programme machen Tausende von Bibliotheksaufrufen. Verwende -e, um bestimmte Funktionen zu filtern: ltrace -e malloc+free ./prog.',
    ],
    bestPractices: [
      'Verwende -e, um bestimmte Bibliotheksaufrufe zu filtern: ltrace -e open+read+write ./prog.',
      'Verwende -c fuer eine Zusammenfassungszaehlung aller Bibliotheksaufrufe statt einzelner Traces.',
      'Kombiniere mit strace fuer ein vollstaendiges Bild: ltrace fuer Bibliotheksaufrufe, strace fuer Syscalls.',
    ],
  },

  entr: {
    useCases: [
      'Tests automatisch erneut ausfuehren oder neu bauen, wenn sich Quelldateien aendern',
      'Eine dateiueberwachende Entwicklungsschleife ohne Build-Tool einrichten',
      'Jeden Befehl bei Dateiaenderung fuer schnelles Feedback ausloesen',
    ],
    internals:
      'entr verwendet inotify (Linux) oder kqueue (macOS/BSD), um Dateideskriptoren auf Aenderungsereignisse zu ueberwachen. Es liest eine Liste von Dateipfaden von stdin und fuehrt den angegebenen Befehl aus, wenn sich eine Datei aendert. Es ist bewusst einfach und komponierbar.',
    mistakes: [
      'Keine Dateiliste pipen -- entr liest Dateinamen von stdin. Gaengiges Muster: find . -name "*.c" | entr make.',
      'Erwarten, dass entr neue Dateien erkennt -- entr ueberwacht nur die beim Start aufgelisteten Dateien. Verwende entr -d, um bei neuen Dateien zu beenden, dann schleife zum Neustart.',
    ],
    bestPractices: [
      'Verwende while true; do find . -name "*.py" | entr -d pytest; done, um neue Dateien zu behandeln.',
      'Verwende entr -c, um den Bildschirm vor jedem Lauf zu loeschen.',
      'Verwende entr -r, um langlebige Prozesse (wie Server) bei Aenderungen neu zu starten.',
    ],
  },

  hyperfine: {
    useCases: [
      'Befehlsausfuehrungszeit mit statistischer Strenge benchmarken',
      'Performance verschiedener Befehle oder Implementierungen vergleichen',
      'Performance-Regressionen in Skripten und Tools erkennen',
    ],
    internals:
      'hyperfine fuehrt mehrere getimte Laeufe durch, verwirft Ausreisser und berechnet Mittelwert, Standardabweichung, Min, Max und Median. Es fuehrt optional Aufwaerm-Iterationen durch, um Dateisystem-Caches zu fuellen, und unterstuetzt parametrisierte Benchmarks fuer Vergleiche.',
    mistakes: [
      'Keine Aufwaerm-Laeufe verwenden -- Dateisystem-Caching-Effekte koennen Ergebnisse des ersten Laufs verzerren. Verwende --warmup 3 oder mehr.',
      'Befehle benchmarken, die zu schnell sind -- Sub-Millisekunden-Befehle werden vom Prozess-Startup-Rauschen dominiert. Buendle sie oder verwende das --min-runs-Flag, um die Stichprobengroesse zu erhoehen.',
    ],
    bestPractices: [
      'Verwende immer --warmup fuer Befehle, die von Festplatte lesen.',
      'Verwende hyperfine "cmd1" "cmd2", um zwei Befehle direkt zu vergleichen.',
      'Verwende --export-markdown, um Benchmark-Vergleichstabellen zu generieren.',
      'Verwende --parameter-scan fuer parametrisierte Benchmarks.',
    ],
  },

  tokei: {
    useCases: [
      'Codezeilen nach Sprache ueber ein Projekt zaehlen',
      'Einen schnellen Ueberblick ueber Projektzusammensetzung und -groesse erhalten',
      'Codebase-Groessen vergleichen oder Wachstum ueber Zeit verfolgen',
    ],
    internals:
      'tokei verwendet sprachspezifische Regeln, um Dateien zu klassifizieren und Code, Kommentare und Leerzeilen zu zaehlen. Es durchlaeuft den Verzeichnisbaum, identifiziert Sprachen nach Erweiterung und Shebang und parst jede Datei, um Code von Kommentaren zu unterscheiden.',
    mistakes: [
      'Generierten oder Vendor-Code einschliessen -- tokei zaehlt standardmaessig alles. Verwende .tokeignore oder .gitignore, um generierte Verzeichnisse auszuschliessen.',
      'LOC als Produktivitaetsmetrik vergleichen -- Codezeilen messen Groesse, nicht Qualitaet oder Aufwand.',
    ],
    bestPractices: [
      'Fuehre tokei in einem Git-Repository aus, um automatisch .gitignore zu respektieren.',
      'Verwende tokei -e, um bestimmte Dateitypen oder Verzeichnisse auszuschliessen.',
      'Verwende tokei --sort code, um Sprachen nach Codezeilen zu sortieren.',
    ],
  },

  shellcheck: {
    useCases: [
      'Shell-Skripte auf gaengige Bugs, Fallstricke und schlechte Praktiken linten',
      'Quoting-Fehler, unnoetige Verwendung von cat und andere Anti-Patterns erkennen',
      'Statische Analyse in CI fuer Shell-Skripte integrieren',
    ],
    internals:
      'ShellCheck parst Shell-Skripte mit einem Haskell-basierten Parser, baut einen AST und fuehrt Analyse-Durchlaeufe aus, die ueber 300 gaengige Probleme pruefen. Es versteht sh-, bash-, dash- und ksh-Dialekte basierend auf dem Shebang.',
    mistakes: [
      'ShellCheck-Warnungen ignorieren -- viele Warnungen erkennen echte Bugs (ungequotete Variablen, fehlende Fehlerbehandlung). Nicht ohne Verstaendnis unterdruecken.',
      'Den Shell-Dialekt nicht angeben -- ohne Shebang verwendet ShellCheck standardmaessig sh. Fuege den korrekten Shebang hinzu oder verwende -s bash fuer genaue Analyse.',
    ],
    bestPractices: [
      'Fuehre shellcheck fuer alle Shell-Skripte in CI aus.',
      'Verwende # shellcheck disable=SC2086 mit einem erklaerenden Kommentar, wenn spezifische Warnungen unterdrueckt werden.',
      'Installiere die ShellCheck-Editor-Integration fuer Echtzeit-Feedback.',
      'Behebe Warnungen schrittweise -- beginne mit Fehlern (Schweregrad error) und arbeite dich nach unten.',
    ],
  },

  jenv: {
    useCases: [
      'Mehrere Java-Versionen auf einem einzelnen Rechner verwalten',
      'Projektbezogene Java-Versionen automatisch setzen',
      'Zwischen JDK-Versionen fuer verschiedene Projekte wechseln',
    ],
    internals:
      'jenv funktioniert durch Verwaltung von Shim-Skripten, die java, javac und andere JDK-Befehle abfangen. Es verwendet eine .java-version-Datei oder die JENV_VERSION-Umgebungsvariable, um die aktive JDK-Version auszuwaehlen. Die eigentlichen JDKs muessen separat installiert werden.',
    mistakes: [
      'Erwarten, dass jenv JDKs installiert -- jenv verwaltet nur bereits installierte JDKs. Installiere JDKs zuerst ueber deinen Paketmanager, dann jenv add /pfad/zum/jdk.',
      'Vergessen, Plugins zu aktivieren -- das jenv-export-Plugin muss aktiviert sein, damit JAVA_HOME korrekt gesetzt wird: jenv enable-plugin export.',
    ],
    bestPractices: [
      'Aktiviere das Export-Plugin: jenv enable-plugin export.',
      'Verwende jenv local <version>, um eine projektbezogene Java-Version ueber .java-version zu setzen.',
      'Verwende jenv global <version>, um die standardmaessige systemweite Version zu setzen.',
    ],
  },

  nvm: {
    useCases: [
      'Mehrere Node.js-Versionen auf einem einzelnen Rechner installieren und verwalten',
      'Node.js-Versionen pro Projekt ueber .nvmrc-Dateien wechseln',
      'Code ueber verschiedene Node.js-Versionen hinweg testen',
    ],
    internals:
      'nvm ist ein bash-Skript, das Node.js-Installationen in ~/.nvm/versions/node/ verwaltet. Es aendert PATH, um auf die ausgewaehlte Version zu zeigen. Es laedt vorgefertigte Binarys herunter (oder kompiliert aus dem Quellcode) und verwaltet Symlinks. Jede Version hat ihre eigenen globalen node_modules.',
    mistakes: [
      'nvm ueber einen Paketmanager installieren -- nvm sollte ueber sein Installationsskript installiert werden, nicht per apt oder brew, die veraltete oder fehlerhafte Versionen liefern koennen.',
      'nvm nicht in nicht-interaktiven Shells laden -- nvm ist eine Shell-Funktion, die aus .bashrc geladen wird. Skripte muessen moeglicherweise nvm.sh explizit sourcen.',
      'Vergessen, dass globale Pakete versionsspezifisch sind -- npm install -g gilt nur fuer die aktuelle Node.js-Version. Nach dem Versionswechsel erneut installieren.',
    ],
    bestPractices: [
      'Erstelle eine .nvmrc-Datei im Projektstammverzeichnis mit der erforderlichen Node.js-Version.',
      'Verwende nvm use, um zur in .nvmrc angegebenen Version zu wechseln.',
      'Verwende nvm alias default <version>, um die Standard-Node.js-Version zu setzen.',
      'Fuege automatisches nvm use zu deinem Shell-Profil fuer verzeichnisbasiertes Umschalten hinzu.',
    ],
  },

  // ─── SECURITY (15) ────────────────────────────────────────────────

  gpg: {
    useCases: [
      'Dateien mit Public-Key- oder symmetrischer Kryptografie verschluesseln und entschluesseln',
      'Dateien und Commits signieren, um Authentizitaet und Integritaet zu beweisen',
      'Einen persoenlichen Schluesselring mit oeffentlichen und privaten Schluesseln verwalten',
    ],
    internals:
      'GPG implementiert den OpenPGP-Standard (RFC 4880). Es verwendet ein Web-of-Trust-Modell zur Schluesselvalidierung. Schluessel werden in ~/.gnupg/ gespeichert. Verschluesselung verwendet einen Sitzungsschluessel, der mit dem oeffentlichen Schluessel des Empfaengers verschluesselt wird. Signierung erstellt einen Hash der Daten und verschluesselt ihn mit dem privaten Schluessel des Absenders.',
    mistakes: [
      'Den privaten Schluessel nicht sichern -- wenn der private Schluessel verloren geht, sind verschluesselte Daten unwiederbringlich. Exportiere und speichere den Schluessel sicher: gpg --export-secret-keys.',
      'Kein Ablaufdatum fuer Schluessel setzen -- Schluessel ohne Ablauf koennen nicht automatisch ausser Dienst gestellt werden. Setze ein Ablaufdatum und verlaengere es rechtzeitig.',
      'Vergessen, den oeffentlichen Schluessel zu veroeffentlichen -- andere koennen nicht an dich verschluesseln, wenn sie deinen oeffentlichen Schluessel nicht haben. Lade ihn auf einen Keyserver hoch oder teile ihn direkt.',
    ],
    bestPractices: [
      'Setze Schluessel-Ablaufdaten und erneuere vor dem Ablauf.',
      'Sichere deinen privaten Schluessel und das Widerrufszertifikat an einem sicheren Offline-Ort.',
      'Verwende gpg --sign --armor fuer ASCII-armierte Signaturen in E-Mails.',
      'Verwende gpg-agent zum Cachen der Passphrase, um wiederholte Eingabe zu vermeiden.',
    ],
  },

  'ssh-keygen': {
    useCases: [
      'SSH-Schluesselpaare fuer passwortlose Authentifizierung generieren',
      'Deployment-Keys fuer CI/CD und Serverzugriff erstellen',
      'Schluessel verschiedener Typen und Staerken generieren',
    ],
    internals:
      'ssh-keygen generiert asymmetrische Schluesselpaare mit Algorithmen wie Ed25519 oder RSA. Der private Schluessel wird verschluesselt (mit einer Passphrase) in ~/.ssh/ gespeichert. Der oeffentliche Schluessel ist eine einzelne Zeile, die zur Remote-~/.ssh/authorized_keys fuer die Authentifizierung hinzugefuegt wird.',
    mistakes: [
      'RSA mit kleiner Schluesselgroesse verwenden -- RSA-Schluessel unter 3072 Bit gelten als schwach. Verwende ssh-keygen -t ed25519 fuer moderne, schnelle und sichere Schluessel.',
      'Keine Passphrase setzen -- ein passphrasenlooser privater Schluessel bietet keinen Schutz, wenn die Datei gestohlen wird. Setze immer eine Passphrase und verwende ssh-agent.',
      'Bestehende Schluessel ueberschreiben -- ssh-keygen ueberschreibt ohne Warnung, wenn die Datei existiert. Verwende einen eindeutigen Dateinamen mit -f.',
    ],
    bestPractices: [
      'Verwende Ed25519: ssh-keygen -t ed25519 -C "deine@email.com".',
      'Setze immer eine Passphrase und verwende ssh-agent, um wiederholte Eingabe zu vermeiden.',
      'Verwende separate Schluessel fuer verschiedene Zwecke (persoenlich, Arbeit, CI/CD).',
      'Setze restriktive Berechtigungen: chmod 600 ~/.ssh/id_ed25519.',
    ],
  },

  'ssh-copy-id': {
    useCases: [
      'Deinen oeffentlichen SSH-Schluessel auf einem Remote-Server fuer passwortlosen Login installieren',
      'Schluesselbasierte Authentifizierung schnell und korrekt einrichten',
      'Den Schluessel mit korrekten Berechtigungen auf der Remote-Seite kopieren',
    ],
    internals:
      'ssh-copy-id verbindet sich per Passwort-Authentifizierung mit dem Remote-Server, liest den lokalen oeffentlichen Schluessel und fuegt ihn an ~/.ssh/authorized_keys auf dem Remote-Host an. Es setzt auch korrekte Berechtigungen auf dem Remote-.ssh-Verzeichnis (700) und der authorized_keys-Datei (600).',
    mistakes: [
      'Nicht pruefen, welcher Schluessel kopiert wird -- ssh-copy-id verwendet den Standardschluessel. Gib den Schluessel explizit mit -i ~/.ssh/id_ed25519.pub an.',
      'Ausfuehren, wenn der Schluessel bereits installiert ist -- der Schluessel wird in authorized_keys dupliziert. Harmlos, aber unordentlich.',
    ],
    bestPractices: [
      'Gib den Schluessel explizit an: ssh-copy-id -i ~/.ssh/id_ed25519.pub user@host.',
      'Verifiziere die Verbindung danach: ssh user@host.',
      'Deaktiviere die Passwort-Authentifizierung auf dem Server, nachdem die schluesselbasierte Authentifizierung bestaetigt funktioniert.',
    ],
  },

  'openssl-cert': {
    useCases: [
      'Selbstsignierte Zertifikate fuer Entwicklung und Tests generieren',
      'Certificate Signing Requests (CSRs) fuer Produktionszertifikate erstellen',
      'SSL/TLS-Zertifikate inspizieren und verifizieren',
    ],
    internals:
      'OpenSSL implementiert den X.509-PKI-Standard. Zertifikatsgenerierung erstellt ein Schluesselpaar, baut eine Zertifikatsstruktur mit Subjekt, Gueltigkeit, Erweiterungen und signiert sie mit dem privaten Schluessel (selbstsigniert) oder reicht sie als CSR zur CA-Signierung ein.',
    mistakes: [
      'Selbstsignierte Zertifikate in Produktion verwenden -- Browser und Clients lehnen sie ab. Verwende eine richtige CA wie Let\'s Encrypt.',
      'Subject Alternative Names (SANs) nicht einschliessen -- moderne Browser erfordern SAN-Erweiterungen. Zertifikate mit nur Common Name (CN) koennen abgelehnt werden.',
      'Schwache Schluesselgroessen oder SHA-1 verwenden -- minimum RSA 2048-Bit und SHA-256 fuer moderne Kompatibilitaet.',
    ],
    bestPractices: [
      'Verwende openssl req -x509 -newkey ec -pkeyopt ec_paramgen_curve:prime256v1 fuer moderne selbstsignierte Zertifikate.',
      'Schliesse immer SANs in Zertifikaten ein mit -addext "subjectAltName=DNS:example.com".',
      'Verwende certbot/Let\'s Encrypt fuer Produktionszertifikate statt selbstsignierter.',
      'Verwende openssl x509 -text -noout, um Zertifikatsdetails zu inspizieren.',
    ],
  },

  ufw: {
    useCases: [
      'Eine einfache Firewall auf Ubuntu/Debian-Systemen einrichten',
      'Datenverkehr nach Port, Protokoll oder IP-Adresse erlauben oder verweigern',
      'Einen neuen Server schnell absichern, indem alle Ports ausser SSH blockiert werden',
    ],
    internals:
      'UFW (Uncomplicated Firewall) ist ein Frontend fuer iptables/nftables. Es uebersetzt einfache Regeln in iptables-Ketten und verwaltet sie persistent ueber Neustarts hinweg via /etc/ufw/. Regeln werden in /etc/ufw/user.rules und user6.rules gespeichert.',
    mistakes: [
      'ufw aktivieren, ohne vorher SSH zu erlauben -- das sperrt dich von Remote-Servern aus. Fuehre immer ufw allow ssh vor ufw enable aus.',
      'Nicht wissen, dass ufw-Regeln Docker umgehen -- Docker manipuliert iptables direkt und umgeht ufw-Regeln. Docker-veroeffentlichte Ports sind unabhaengig von ufw erreichbar.',
    ],
    bestPractices: [
      'Erlaube immer SSH vor dem Aktivieren: ufw allow 22/tcp && ufw enable.',
      'Verwende ufw default deny incoming und ufw default allow outgoing als Grundlage.',
      'Verwende ufw status verbose, um den aktuellen Regelsatz zu sehen.',
      'Verwende ufw limit ssh, um SSH-Verbindungen gegen Brute-Force-Angriffe zu drosseln.',
    ],
  },

  fail2ban: {
    useCases: [
      'IPs automatisch sperren, die boesartige Anzeichen zeigen (Brute-Force-Login-Versuche)',
      'SSH, Webserver und Mailserver vor automatisierten Angriffen schuetzen',
      'Rauschen durch wiederholte fehlgeschlagene Authentifizierungsversuche reduzieren',
    ],
    internals:
      'fail2ban ueberwacht Logdateien mit konfigurierbaren Regex-Filtern. Wenn ein Muster mehr als maxretry-mal innerhalb von findtime Sekunden von derselben IP matcht, fuehrt es eine Ban-Aktion aus (typischerweise eine iptables/nftables-REJECT-Regel) fuer bantime Sekunden.',
    mistakes: [
      'Sich selbst sperren -- eine falsch konfigurierte Regel oder zu viele fehlgeschlagene Login-Versuche koennen dich aussperren. Verwende ignoreip, um deine IPs auf die Whitelist zu setzen.',
      'Regex-Filter nicht testen -- falsche Filter verpassen entweder Angriffe oder erzeugen Falsch-Positive. Verwende fail2ban-regex zum Testen.',
    ],
    bestPractices: [
      'Fuege deine eigene IP zu ignoreip in jail.local hinzu, um Selbstaussperrung zu verhindern.',
      'Erstelle jail.local statt jail.conf zu bearbeiten -- jail.conf wird bei Upgrades ueberschrieben.',
      'Verwende fail2ban-client status <jail>, um aktive Sperren zu pruefen.',
      'Teste Filter mit fail2ban-regex /var/log/auth.log /etc/fail2ban/filter.d/sshd.conf.',
    ],
  },

  chattr: {
    useCases: [
      'Dateien unveraeaenderlich machen, um versehentliche oder boesartige Aenderungen zu verhindern',
      'Append-Only-Modus fuer Logdateien setzen',
      'Kritische Konfigurationsdateien vor Ueberschreiben schuetzen',
    ],
    internals:
      'chattr setzt erweiterte Dateiattribute auf ext2/ext3/ext4/btrfs-Dateisystemen ueber den ioctl-Aufruf FS_IOC_SETFLAGS. Das +i-Flag (immutable) verhindert alle Aenderungen, auch durch root. Das +a-Flag (append-only) erlaubt nur Anfuegen.',
    mistakes: [
      'Vergessen, dass du das immutable-Flag gesetzt hast -- Dateien mit +i koennen nicht geaendert, geloescht oder umbenannt werden, auch nicht von root. Verwende lsattr zur Pruefung, bevor du Fehler suchst, warum du eine Datei nicht bearbeiten kannst.',
      'Annehmen, dass chattr auf allen Dateisystemen funktioniert -- es ist spezifisch fuer ext2/3/4 und btrfs. Es funktioniert nicht auf tmpfs, NFS oder FAT.',
    ],
    bestPractices: [
      'Verwende chattr +i fuer kritische Konfigurationsdateien, um versehentliche Aenderungen zu verhindern.',
      'Verwende lsattr zur Verifizierung von Attributen: lsattr /etc/resolv.conf.',
      'Dokumentiere unveraeaenderliche Dateien, damit andere Admins wissen, dass sie das Flag vor dem Bearbeiten entfernen muessen.',
    ],
  },

  auditctl: {
    useCases: [
      'Dateizugriffe und Syscalls fuer Sicherheitsaudits ueberwachen',
      'Verfolgen, wer auf sensible Dateien wie /etc/passwd oder /etc/shadow zugreift',
      'Kernel-Level-Audit-Regeln fuer Compliance-Anforderungen einrichten',
    ],
    internals:
      'auditctl konfiguriert das Linux-Audit-Framework, indem es Regeln zum Kernel-Audit-Subsystem hinzufuegt. Der Kernel generiert Audit-Records fuer passende Ereignisse, die auditd in /var/log/audit/audit.log schreibt. Regeln koennen Dateizugriff (-w) oder Syscalls (-a) matchen.',
    mistakes: [
      'Zu viele Regeln hinzufuegen -- jede Regel wird fuer jedes passende Ereignis geprueft, was die Performance beeintraechtigt. Sei selektiv bei dem, was du auditierst.',
      'Regeln nicht persistent machen -- auditctl-Regeln gehen beim Neustart verloren. Schreibe sie nach /etc/audit/rules.d/ fuer Persistenz.',
    ],
    bestPractices: [
      'Verwende auditctl -w /etc/passwd -p wa -k passwd_changes, um Dateiaenderungen zu ueberwachen.',
      'Mache Regeln persistent in /etc/audit/rules.d/*.rules.',
      'Verwende ausearch -k <key>, um Audit-Logs nach Schluesselwort zu durchsuchen.',
      'Verwende aureport fuer zusammenfassende Berichte ueber Audit-Ereignisse.',
    ],
  },

  'openssl-enc': {
    useCases: [
      'Dateien mit symmetrischer Verschluesselung (AES) von der Kommandozeile verschluesseln',
      'Dateien entschluesseln, die mit openssl enc verschluesselt wurden',
      'Schnelle Dateiverschluesselung, wenn kein GPG-Setup verfuegbar ist',
    ],
    internals:
      'openssl enc verwendet symmetrische Chiffren (AES-256-CBC, ChaCha20 usw.) zur Datenverschluesselung. Standardmaessig leitet es den Verschluesselungsschluessel aus einem Passwort mit einer Key-Derivation-Funktion ab. Mit -pbkdf2 verwendet es PBKDF2 fuer die Schluesselableitung (empfohlen).',
    mistakes: [
      '-pbkdf2 nicht verwenden -- ohne es verwendet openssl die veraltete EVP_BytesToKey, die schwach ist. Fuege immer -pbkdf2 -iter 100000 hinzu.',
      'ECB-Modus verwenden -- ECB verschluesselt identische Bloecke zu identischem Chiffretext und leakt Muster. Verwende CBC oder einen modernen AEAD-Modus.',
    ],
    bestPractices: [
      'Verwende AES-256-CBC mit PBKDF2: openssl enc -aes-256-cbc -pbkdf2 -iter 100000 -salt -in file -out file.enc.',
      'Verwende immer -salt (Standard in modernem openssl), um Rainbow-Table-Angriffe zu verhindern.',
      'Erwaege age oder gpg fuer benutzerfreundlichere Dateiverschluesselung.',
    ],
  },

  age: {
    useCases: [
      'Dateien mit einem einfachen, modernen Tool verschluesseln (einfacher als GPG)',
      'An mehrere Empfaenger mit ihren oeffentlichen Schluesseln verschluesseln',
      'Passphrase-basierte Verschluesselung fuer persoenliche Dateien verwenden',
    ],
    internals:
      'age verwendet X25519 fuer Schluesselvereinbarung und ChaCha20-Poly1305 fuer authentifizierte Verschluesselung. Es generiert einen zufaelligen Dateischluessel, verschluesselt ihn fuer jeden Empfaenger-oeffentlichen-Schluessel und verschluesselt die Datei mit dem Dateischluessel. Das Format ist einfach und auditierbar.',
    mistakes: [
      'age-Schluessel mit SSH-Schluesseln verwechseln -- age hat sein eigenes Schluesselformat (age1...). Es kann auch SSH-Schluessel mit -R verwenden, aber native age-Schluessel werden bevorzugt.',
      'Den privaten Schluessel nicht sichern -- age-Schluessel in ~/.config/age/ sind die einzige Moeglichkeit, deine Dateien zu entschluesseln. Sichere sie zuverlaessig.',
    ],
    bestPractices: [
      'Generiere ein Schluesselpaar: age-keygen -o key.txt.',
      'Verschluessele an einen Empfaenger: age -r age1... -o file.enc file.',
      'Verwende age -p fuer passphrase-basierte Verschluesselung, wenn du keine Public-Key-Kryptografie benoetigst.',
      'Verwende age als einfachere Alternative zu GPG fuer Dateiverschluesselung.',
    ],
  },

  certbot: {
    useCases: [
      'Kostenlose SSL/TLS-Zertifikate von Let\'s Encrypt erhalten',
      'Zertifikate automatisch erneuern, bevor sie ablaufen',
      'HTTPS auf Webservern (Nginx, Apache) automatisch konfigurieren',
    ],
    internals:
      'certbot implementiert das ACME-Protokoll, um den Domain-Besitz gegenueber Let\'s Encrypt nachzuweisen. Es kann HTTP-01 (eine Datei auf Port 80 bereitstellen), DNS-01 (einen DNS-TXT-Record erstellen) oder TLS-ALPN-01-Challenges verwenden. Zertifikate werden in /etc/letsencrypt/ gespeichert und per systemd-Timer oder cron automatisch erneuert.',
    mistakes: [
      'Keine automatische Erneuerung einrichten -- Let\'s-Encrypt-Zertifikate laufen in 90 Tagen ab. Ohne automatische Erneuerung geht deine Seite offline. Verifiziere mit certbot renew --dry-run.',
      'certbot mit sowohl --nginx als auch --standalone ausfuehren -- verwende einen Modus. --nginx integriert sich mit nginx; --standalone startet seinen eigenen Server auf Port 80.',
    ],
    bestPractices: [
      'Verwende certbot --nginx oder certbot --apache fuer automatische Webserver-Konfiguration.',
      'Verifiziere, dass die automatische Erneuerung funktioniert: certbot renew --dry-run.',
      'Verwende certbot certonly fuer manuelle Konfiguration, wenn du den Server selbst konfigurieren moechtest.',
      'Verwende DNS-01-Challenge fuer Wildcard-Zertifikate: certbot -d "*.example.com" --manual --preferred-challenges dns.',
    ],
  },

  'ssh-agent': {
    useCases: [
      'SSH-Private-Key-Passphrasen cachen, um wiederholte Eingabe zu vermeiden',
      'SSH-Authentifizierung an Remote-Server weiterleiten (Agent-Forwarding)',
      'Mehrere SSH-Schluessel fuer verschiedene Dienste verwalten',
    ],
    internals:
      'ssh-agent ist ein Daemon, der entschluesselte private Schluessel im Speicher haelt. SSH-Clients kommunizieren mit ihm ueber einen Unix-Domain-Socket (SSH_AUTH_SOCK). Wenn Authentifizierung benoetigt wird, bittet der Client den Agent, die Signierungsoperation durchzufuehren, ohne den privaten Schluessel jemals preiszugeben.',
    mistakes: [
      'Den Agent nicht starten -- SSH fragt bei jedem Mal nach der Passphrase ohne laufenden Agent. Starte ihn mit eval $(ssh-agent) oder verwende den Keyring deiner Desktop-Umgebung.',
      'Agent-Forwarding zu nicht vertrauenswuerdigen Servern verwenden -- ein kompromittierter Server kann deinen weitergeleiteten Agent verwenden, um sich als du zu authentifizieren. Verwende ProxyJump (-J) statt Agent-Forwarding wenn moeglich.',
    ],
    bestPractices: [
      'Fuege Schluessel mit Lebensdauer hinzu: ssh-add -t 3600 fuer 1-Stunden-Ablauf.',
      'Verwende ProxyJump (-J) statt Agent-Forwarding fuer sichereres SSH-Hopping.',
      'Konfiguriere AddKeysToAgent yes in ~/.ssh/config, um Schluessel bei Erstbenutzung automatisch hinzuzufuegen.',
    ],
  },

  'sshd-config': {
    useCases: [
      'SSH-Server-Konfiguration fuer Sicherheit haerten',
      'Authentifizierungsmethoden, Ports und Zugriffskontrollen konfigurieren',
      'Pro-Benutzer- oder Pro-Gruppen-SSH-Zugriffsrichtlinien einrichten',
    ],
    internals:
      'sshd liest /etc/ssh/sshd_config beim Start (und bei SIGHUP-Reload). Konfigurationsanweisungen werden von oben nach unten verarbeitet, wobei der erste Treffer fuer die meisten Optionen gewinnt. Match-Bloecke ermoeglichen bedingte Konfiguration basierend auf Benutzer, Gruppe, Host oder Adresse.',
    mistakes: [
      'Passwort-Authentifizierung deaktivieren, bevor Schluessel-Authentifizierung bestaetigt funktioniert -- das sperrt dich aus. Teste schluesselbasierten Login in einer zweiten Sitzung, bevor du Passwoerter deaktivierst.',
      'sshd nach Aenderungen nicht neustarten -- Aenderungen an sshd_config erfordern einen Reload: systemctl reload sshd.',
      'sshd_config mit Syntaxfehlern bearbeiten -- eine fehlerhafte Konfiguration verhindert den Start von sshd. Verwende sshd -t zum Testen vor dem Neustart.',
    ],
    bestPractices: [
      'Deaktiviere Root-Login: PermitRootLogin no.',
      'Deaktiviere Passwort-Authentifizierung: PasswordAuthentication no (nachdem Schluessel-Authentifizierung bestaetigt funktioniert).',
      'Verwende sshd -t, um die Konfig-Syntax vor dem Neustart zu validieren.',
      'Verwende AllowUsers oder AllowGroups, um SSH-Zugang auf bestimmte Konten zu beschraenken.',
    ],
  },

  firewalld: {
    useCases: [
      'Firewall-Regeln auf RHEL/CentOS/Fedora-Systemen verwalten',
      'Netzwerk-Zonen mit verschiedenen Vertrauensstufen konfigurieren',
      'Firewall-Aenderungen anwenden, ohne den Dienst neu zu starten (Runtime vs. permanent)',
    ],
    internals:
      'firewalld ist ein dynamischer Firewall-Daemon, der nftables- (oder iptables-) Regeln verwaltet. Es verwendet Zonen, um Vertrauensstufen fuer Netzwerkverbindungen zu definieren. Regeln koennen zur Laufzeit (sofort, nicht-persistent) oder permanent (ueberleben Neustart) angewendet werden. D-Bus wird fuer Interprozesskommunikation verwendet.',
    mistakes: [
      '--permanent vergessen -- Laufzeit-Aenderungen gehen beim Reload/Neustart verloren. Verwende --permanent fuer persistente Regeln, dann --reload zum Anwenden.',
      'Nach permanenten Aenderungen nicht neuladen -- permanente Regeln treten erst nach firewall-cmd --reload in Kraft.',
    ],
    bestPractices: [
      'Wende sowohl Runtime als auch permanent an: firewall-cmd --add-service=http --permanent && firewall-cmd --reload.',
      'Verwende Zonen, um Netzwerk-Interfaces nach Vertrauensstufe zu segmentieren.',
      'Verwende firewall-cmd --list-all, um die aktuelle aktive Konfiguration zu sehen.',
      'Verwende Rich-Rules fuer komplexe Filterung: firewall-cmd --add-rich-rule.',
    ],
  },

  selinux: {
    useCases: [
      'Mandatory Access Control (MAC)-Richtlinien auf Linux-Systemen durchsetzen',
      'Einschraenken, worauf Prozesse zugreifen koennen, auch wenn sie kompromittiert sind',
      'SELinux-Verweigerungen beheben, die legitime Operationen blockieren',
    ],
    internals:
      'SELinux ist ein Linux-Security-Module (LSM), das jeden Prozess, jede Datei und jeden Socket mit einem Sicherheitskontext (user:role:type:level) versieht. Der Kernel prueft bei jedem Zugriffsversuch eine Richtlinien-Datenbank. Type-Enforcement (TE)-Regeln definieren, welche Typen auf welche anderen Typen zugreifen duerfen.',
    mistakes: [
      'SELinux deaktivieren statt Verweigerungen zu beheben -- das Setzen von SELinux auf disabled entfernt eine wichtige Sicherheitsschicht. Verwende den permissive Modus zum Debuggen, behebe dann und wechsle zurueck zu enforcing.',
      'Audit-Logs nicht pruefen -- SELinux-Verweigerungen werden in /var/log/audit/audit.log protokolliert. Verwende ausearch -m avc fuer aktuelle Verweigerungen.',
      'Falsche Dateikontexte nach dem Verschieben von Dateien -- mv bewahrt den Quellkontext. Verwende restorecon, um Kontexte auf die Richtlinien-Standards zurueckzusetzen.',
    ],
    bestPractices: [
      'Verwende getenforce und setenforce, um den Modus zu pruefen und temporaer zu setzen.',
      'Verwende audit2why und audit2allow, um Verweigerungen zu verstehen und zu beheben.',
      'Verwende restorecon -Rv /pfad nach dem Verschieben oder Erstellen von Dateien, um Kontexte zu korrigieren.',
      'Deaktiviere SELinux niemals dauerhaft; verwende stattdessen gezielt permissive Domains.',
    ],
  },

  // ─── EDITORS (10) ─────────────────────────────────────────────────

  vim: {
    useCases: [
      'Dateien effizient vom Terminal aus mit modalem Editing bearbeiten',
      'Schnelle Bearbeitungen auf Remote-Servern ueber SSH vornehmen',
      'Als leistungsstarker programmierbarer Editor mit umfangreichem Plugin-Oekosystem verwenden',
    ],
    internals:
      'Vim arbeitet in Modi: Normal (Navigation/Befehle), Insert (Tippen), Visual (Auswahl) und Command-Line (ex-Befehle). Es speichert Buffer im Speicher und eine Swap-Datei (.swp) fuer Crash-Recovery. Konfiguration ist in ~/.vimrc. Vim verwendet eine Befehlsgrammatik: Operator + Motion (z.B. d3w = 3 Woerter loeschen).',
    mistakes: [
      'In einem Modus feststecken -- druecke Esc, um zum Normal-Modus zurueckzukehren. :q! zum Beenden ohne Speichern.',
      'Motions und Operatoren nicht lernen -- nur Pfeiltasten und Insert-Modus zu verwenden verfehlt den Zweck. Lerne hjkl, w, b, d, c, y fuer effizientes Bearbeiten.',
      'Persistent Undo nicht verwenden -- setze undofile in .vimrc, um Undo-History ueber Sitzungen hinweg beizubehalten.',
    ],
    bestPractices: [
      'Lerne die Operator+Motion-Grammatik: d = loeschen, c = aendern, y = kopieren kombiniert mit w, $, iw usw.',
      'Verwende :wq zum Speichern und Beenden, :q! zum Beenden ohne Speichern.',
      'Verwende . zum Wiederholen der letzten Aenderung und u zum Rueckgaengigmachen.',
      'Beginne mit einer minimalen .vimrc und fuege Einstellungen hinzu, wenn du sie verstehst.',
    ],
  },

  nano: {
    useCases: [
      'Schnelle Dateibearbeitungen vom Terminal aus ohne modales Editing lernen zu muessen',
      'Konfigurationsdateien auf Servern bearbeiten, wo vi-Kenntnisse nicht erforderlich sind',
      'Einen anfaengerfreundlichen Terminal-Editor fuer neue Linux-Benutzer bereitstellen',
    ],
    internals:
      'nano ist ein moduslooser Editor (was du tippst, wird immer eingefuegt). Befehle verwenden Ctrl- und Alt-Tastenkombinationen, die am unteren Bildschirmrand angezeigt werden. Es liest die Datei in eine verkettete Liste von Zeilen im Speicher und schreibt beim Speichern zurueck.',
    mistakes: [
      'Die Tastenkuerzel nicht kennen -- ^ bedeutet Ctrl. Ctrl+O speichert (WriteOut), Ctrl+X beendet, Ctrl+K schneidet eine Zeile aus, Ctrl+U fuegt ein.',
      'Syntaxhervorhebung nicht aktivieren -- nano unterstuetzt Syntaxhervorhebung, aber sie ist moeglicherweise nicht standardmaessig aktiviert. Fuege include "/usr/share/nano/*.nanorc" zu ~/.nanorc hinzu.',
    ],
    bestPractices: [
      'Aktiviere Syntaxhervorhebung und Zeilennummern in ~/.nanorc.',
      'Verwende Ctrl+W zum Suchen und Ctrl+\\ zum Suchen und Ersetzen.',
      'Verwende nano -B, um Backups von Dateien vor dem Bearbeiten zu erstellen.',
      'Verwende Alt+#, um die Zeilennummernanzeige umzuschalten.',
    ],
  },

  emacs: {
    useCases: [
      'Als umfassende Entwicklungsumgebung mit integrierten Tools verwenden',
      'Code mit umfangreicher Sprachunterstuetzung ueber Major-Modes schreiben und bearbeiten',
      'org-mode fuer Notizen, Projektmanagement und literates Programmieren verwenden',
    ],
    internals:
      'Emacs ist im Wesentlichen ein Lisp-Interpreter (Emacs Lisp) mit einer Textbearbeitungsoberflaeche. Nahezu alles ist in Elisp implementiert, was es tiefgreifend erweiterbar macht. Buffer sind die zentrale Abstraktion; jede Datei, Shell oder jedes Tool laeuft in einem Buffer. Tastenbelegungen werden auf Elisp-Funktionen abgebildet.',
    mistakes: [
      'Feststecken -- C-g bricht jeden Befehl oder jede Tastensequenz ab. C-x C-c beendet Emacs.',
      'Die Tastenkonventionen nicht lernen -- C- bedeutet Ctrl, M- bedeutet Alt/Meta. C-x C-f oeffnet Dateien, C-x C-s speichert, C-x C-c beendet.',
      'Anfangs zu viele Pakete installieren -- Paketkonflikte und langsamer Start sind haeufig. Beginne minimal und fuege Pakete nach Bedarf hinzu.',
    ],
    bestPractices: [
      'Absolviere das eingebaute Tutorial: C-h t.',
      'Verwende ein Starter-Kit (Doom Emacs, Spacemacs oder Prelude) fuer ein kuratiertes Erlebnis.',
      'Lerne das C-h-Hilfesystem: C-h k (Taste beschreiben), C-h f (Funktion beschreiben), C-h v (Variable beschreiben).',
      'Verwende M-x, um Befehle nach Namen zu entdecken und auszufuehren.',
    ],
  },

  ed: {
    useCases: [
      'Dateien in Skripten oder ueber extrem eingeschraenkte Verbindungen bearbeiten',
      'Als Standard-POSIX-Zeileneditor fuer maximale Portabilitaet verwenden',
      'Automatisierte, skriptbare Bearbeitungen an Dateien vornehmen',
    ],
    internals:
      'ed ist ein zeilenorientierter Editor, der die gesamte Datei als Folge von Zeilen in den Speicher laedt. Befehle operieren auf einer aktuellen Zeilenadresse (Standard: letzte Zeile). Es verwendet eine Befehlssprache mit Adressen und Operationen (a=anfuegen, d=loeschen, s=ersetzen, w=schreiben).',
    mistakes: [
      'Visuelles Feedback erwarten -- ed bietet keine visuelle Anzeige. Es gibt ? bei Fehlern aus, ohne Erklaerung. Verwende H, um ausfuehrliche Fehlermeldungen zu aktivieren.',
      'Adresssyntax nicht verstehen -- Befehle operieren standardmaessig auf der aktuellen Zeile. Verwende Zeilennummern, Bereiche (1,5) oder Muster (/regex/), um bestimmte Zeilen anzusprechen.',
    ],
    bestPractices: [
      'Verwende ed fuer geskriptete Dateibearbeitungen in POSIX-Umgebungen, wo sed oder andere Tools nicht geeignet sind.',
      'Aktiviere ausfuehrliche Fehler: H-Befehl nach dem Starten von ed.',
      'Verwende printf-Befehle, die an ed gepipt werden, fuer automatisierte Bearbeitungen in Skripten.',
    ],
  },

  micro: {
    useCases: [
      'Einen modernen, intuitiven Terminal-Editor mit vertrauten Tastenkuerzeln verwenden',
      'nano durch einen leistungsfaehigeren Editor ersetzen, der sich wie ein GUI-Editor anfuehlt',
      'Dateien im Terminal mit Mausunterstuetzung und Syntaxhervorhebung bearbeiten',
    ],
    internals:
      'micro ist ein einzelnes Go-Binary, das Standard-Terminal-Tastenkuerzel verwendet (Ctrl+S speichern, Ctrl+Q beenden, Ctrl+C kopieren). Es unterstuetzt Syntaxhervorhebung ueber mitgelieferte Syntax-Dateien, ein Plugin-System in Lua und Multiple Cursors.',
    mistakes: [
      'Nicht wissen, dass es Multiple Cursors unterstuetzt -- Alt+N erstellt mehrere Cursor fuer paralleles Bearbeiten.',
      'Die Befehlspalette nicht erkunden -- Ctrl+E oeffnet die Befehlsleiste fuer erweiterte Operationen.',
    ],
    bestPractices: [
      'Verwende Standard-Tastenkuerzel: Ctrl+S speichern, Ctrl+Q beenden, Ctrl+F suchen.',
      'Verwende Ctrl+E, um auf die Befehlsleiste fuer Einstellungen und erweiterte Features zuzugreifen.',
      'Installiere Plugins mit micro -plugin install <name>.',
      'Konfiguriere Einstellungen in ~/.config/micro/settings.json.',
    ],
  },

  'sed-edit': {
    useCases: [
      'Programmatische, nicht-interaktive Bearbeitungen an Dateien aus Skripten vornehmen',
      'Suchen-und-Ersetzen-Operationen ueber Dateien hinweg durchfuehren',
      'Textstreams in Pipelines transformieren',
    ],
    internals:
      'sed liest die Eingabe zeilenweise in einen Pattern Space, wendet Befehle an (s/alt/neu/, d, p usw.) und gibt das Ergebnis aus. Es pflegt einen Hold Space fuer mehrzeilige Operationen. Das -i-Flag aendert Dateien direkt (erstellt eine temporaere Datei und ersetzt das Original).',
    mistakes: [
      '-i unterschiedlich auf GNU und BSD verwenden -- GNU sed verwendet -i (ohne Argument), BSD sed erfordert -i "" (leerer String). Fuer Portabilitaet verwende -i.bak auf beiden.',
      'Sonderzeichen im Muster nicht escapen -- /, ., * und andere Regex-Metazeichen muessen escaped werden. Oder verwende ein anderes Trennzeichen: s|pfad/zu|neuer/pfad|.',
      'Das g-Flag fuer globale Ersetzung vergessen -- s/alt/neu/ ersetzt nur den ersten Treffer pro Zeile. Verwende s/alt/neu/g fuer alle Treffer.',
    ],
    bestPractices: [
      'Verwende ein anderes Trennzeichen fuer Pfade: sed "s|/alter/pfad|/neuer/pfad|g", um das Escapen von Schraegstrichen zu vermeiden.',
      'Teste immer ohne -i zuerst: sed "s/alt/neu/g" file, um Aenderungen zu pruefen.',
      'Verwende -i.bak fuer portable In-Place-Bearbeitung mit Backup.',
    ],
  },

  vi: {
    useCases: [
      'Dateien auf jedem Unix-System bearbeiten -- vi ist garantiert verfuegbar',
      'Schnelle Bearbeitungen auf minimalen Systemen ohne vim vornehmen',
      'Den POSIX-standardisierten visuellen Editor verwenden',
    ],
    internals:
      'vi ist der POSIX-standardisierte visuelle Editor, der vim vorausgeht. Auf den meisten modernen Systemen ist vi ein Symlink zu vim oder ein minimaler vim-Build. Originales vi verwendet ex-Befehle und hat nicht viele vim-Features (Visual-Block-Modus, Plugins, Undo-Baum).',
    mistakes: [
      'vi mit vim verwechseln -- vi fehlen moeglicherweise viele vim-Features (Syntaxhervorhebung, mehrfaches Undo, Visual-Block-Modus). Pruefe mit vi --version.',
      'Dieselbe Modus-Verwirrung wie bei vim -- Esc fuer Normal-Modus, i fuer Insert-Modus, :wq zum Speichern und Beenden.',
    ],
    bestPractices: [
      'Lerne grundlegende vi-Befehle (i, Esc, :wq, dd, yy, p), da sie ueberall funktionieren.',
      'Verwende vi, wenn vim nicht verfuegbar ist; andernfalls bevorzuge vim oder nvim.',
      'Setze EDITOR=vi in deinem Shell-Profil, wenn du vi als Standard-Editor bevorzugst.',
    ],
  },

  nvim: {
    useCases: [
      'Einen modernen, erweiterbaren Vim-Refactor mit Lua-basierter Konfiguration verwenden',
      'Eine vollstaendige IDE-Erfahrung mit LSP, Treesitter und modernen Plugins bauen',
      'Die asynchrone Architektur und den eingebauten Terminal-Emulator nutzen',
    ],
    internals:
      'Neovim ist ein Refactor von Vim mit sauberer Codebasis, eingebauter Lua-Runtime (LuaJIT), asynchroner Job-Steuerung und einer Client-Server-Architektur (msgpack-RPC). Es enthaelt einen eingebauten LSP-Client, Treesitter-Parser-Integration und einen Terminal-Emulator. Konfiguration ist in ~/.config/nvim/init.lua.',
    mistakes: [
      'Eine vim-Konfiguration direkt kopieren -- obwohl Neovim groesstenteils kompatibel ist, kann .vimrc Vim-spezifische Einstellungen referenzieren. Verwende init.lua fuer Neovim-native Konfiguration.',
      'Zu viele Plugins installieren, ohne sie zu verstehen -- beginne mit einer Distribution (LazyVim, NvChad, AstroNvim) oder baue schrittweise auf.',
    ],
    bestPractices: [
      'Verwende init.lua fuer die Konfiguration statt init.vim fuer bessere Performance.',
      'Verwende lazy.nvim als Plugin-Manager fuer lazy-geladenen, schnellen Start.',
      'Konfiguriere den eingebauten LSP-Client mit nvim-lspconfig fuer IDE-Features.',
      'Verwende Treesitter fuer schnelle, genaue Syntaxhervorhebung und Code-Navigation.',
    ],
  },

  helix: {
    useCases: [
      'Einen modernen modalen Editor mit Selection-First-Editing verwenden (erst auswaehlen, dann handeln)',
      'Code mit eingebautem LSP- und Tree-Sitter-Support out-of-the-box bearbeiten',
      'Einen Terminal-Editor ohne Plugin-Konfigurations-Overhead verwenden',
    ],
    internals:
      'Helix ist in Rust geschrieben und verwendet Tree-Sitter fuer Syntax-Parsing und -Hervorhebung. Es invertiert die Vim-Grammatik: statt Verb-dann-Objekt (dw = Wort loeschen) verwendet Helix Auswaehlen-dann-Handeln (w dann d = Wort auswaehlen, dann loeschen). LSP- und DAP-Unterstuetzung ist eingebaut.',
    mistakes: [
      'Vim-Tastenkuerzel erwarten -- Helix verwendet ein anderes Editiermodell. Auswahl kommt zuerst (w waehlt ein Wort, dann d loescht die Auswahl). Lies das Tutorial mit :tutor.',
      'Nach einem Plugin-System suchen -- Helix hat absichtlich kein Plugin-System (Stand 2025). Features sind eingebaut.',
    ],
    bestPractices: [
      'Fuehre :tutor aus, um das Helix-Editiermodell zu lernen.',
      'Verwende Leertaste als Leader-Key fuer Menuezugriff (Leertaste+f fuer Dateipicker, Leertaste+b fuer Buffer).',
      'Konfiguriere Language-Server in ~/.config/helix/languages.toml.',
      'Verwende x zum Auswaehlen von Zeilen, dann operiere auf der Auswahl.',
    ],
  },

  'code-cli': {
    useCases: [
      'Dateien und Verzeichnisse in VS Code vom Terminal aus oeffnen',
      'Dateien mit dem eingebauten Diff-Viewer vergleichen',
      'VS-Code-Erweiterungen von der Kommandozeile verwalten',
    ],
    internals:
      'Die code-CLI kommuniziert mit einer laufenden VS-Code-Instanz ueber IPC (falls vorhanden) oder startet eine neue Instanz. Sie kann Dateien an bestimmten Zeilennummern oeffnen, Dateien vergleichen, Erweiterungen installieren/deinstallieren und stdin in einen neuen Editor-Tab pipen.',
    mistakes: [
      'Die CLI unter macOS nicht installieren -- unter macOS fuehre "Shell Command: Install code command in PATH" aus der VS-Code-Befehlspalette aus.',
      'code in SSH-Sitzungen ohne Remote-Erweiterung verwenden -- code kann kein lokales GUI von einer Remote-Shell oeffnen. Verwende code --remote ssh-remote+host /pfad fuer VS Code Remote.',
    ],
    bestPractices: [
      'Verwende code -d file1 file2, um zwei Dateien zu vergleichen.',
      'Verwende code -g file:zeile:spalte, um eine Datei an einer bestimmten Position zu oeffnen.',
      'Verwende code --install-extension <id>, um Erweiterungen von der CLI zu installieren.',
      'Pipe zu VS Code: echo "hello" | code - oeffnet einen neuen Tab mit stdin-Inhalt.',
    ],
  },
}
