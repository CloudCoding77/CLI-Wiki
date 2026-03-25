import type { CommandExplanation } from '../types'

export const explanationsPart3: Record<string, CommandExplanation> = {
  // ─── SHELL UTILITIES (26) ───────────────────────────────────────────

  alias: {
    useCases: [
      'Create shorthand names for long or frequently used commands',
      'Override default flags for existing commands (e.g., alias ls="ls --color")',
      'Define project-specific shortcuts in .bashrc or .zshrc',
    ],
    internals:
      'Aliases are simple text substitutions performed by the shell before any other expansion. They are stored in an in-memory hash table per shell session and only apply to interactive shells unless explicitly enabled in scripts with shopt -s expand_aliases.',
    mistakes: [
      'Defining aliases in scripts without enabling expand_aliases -- aliases are disabled in non-interactive shells by default.',
      'Using alias for complex logic instead of shell functions -- aliases cannot accept arguments in the middle of the command. Use a function instead.',
      'Forgetting to persist aliases -- aliases defined in a terminal are lost when the session ends. Add them to ~/.bashrc or ~/.zshrc.',
    ],
    bestPractices: [
      'Use functions instead of aliases when you need to handle arguments or add conditional logic.',
      'Prefix dangerous aliases with a backslash to bypass them temporarily: \\rm will skip an alias for rm.',
      'Keep a dedicated aliases file (e.g., ~/.bash_aliases) sourced from your shell rc for organization.',
    ],
  },

  history: {
    useCases: [
      'Recall and re-execute previously run commands',
      'Search through past commands with Ctrl+R (reverse search)',
      'Audit what commands were run in a session for debugging',
    ],
    internals:
      'The shell maintains an in-memory history list during the session and persists it to a file (typically ~/.bash_history or ~/.zsh_history) on exit. HISTSIZE controls the in-memory count while HISTFILESIZE controls the file size.',
    mistakes: [
      'Relying on history for security auditing -- users can modify or delete ~/.bash_history freely. Use auditd for real auditing.',
      'Opening multiple terminals and losing history -- by default bash overwrites the history file. Set shopt -s histappend to append instead.',
      'Accidentally storing secrets -- commands with passwords or tokens in arguments get recorded. Use HISTIGNORE or HISTCONTROL=ignorespace and prefix sensitive commands with a space.',
    ],
    bestPractices: [
      'Set HISTCONTROL=ignoreboth to skip duplicates and space-prefixed commands.',
      'Increase HISTSIZE and HISTFILESIZE to large values (e.g., 10000) so you rarely lose useful history.',
      'Use history | grep <pattern> or Ctrl+R for fast lookups.',
    ],
  },

  source: {
    useCases: [
      'Load environment variables or functions from a file into the current shell',
      'Apply changes to .bashrc or .profile without opening a new terminal',
      'Include reusable library code in shell scripts',
    ],
    internals:
      'source (or its POSIX equivalent .) reads and executes commands from the specified file in the current shell environment, not a subshell. This means variables, functions, and options set in the file persist in the calling shell.',
    mistakes: [
      'Confusing source with executing a script -- running ./script.sh spawns a subshell and changes do not affect the parent. Use source script.sh to modify the current environment.',
      'Sourcing untrusted files -- since source runs with full shell privileges, sourcing an attacker-controlled file can execute arbitrary commands.',
    ],
    bestPractices: [
      'Use source for loading environment configs, not for running standalone scripts.',
      'Always validate or trust files before sourcing them, especially in automated pipelines.',
      'Prefer the "source" keyword over "." for readability in bash scripts.',
    ],
  },

  echo: {
    useCases: [
      'Print text, variables, or formatted output to stdout',
      'Write simple strings to files via redirection',
      'Provide user feedback in shell scripts',
    ],
    internals:
      'echo is typically a shell built-in that writes its arguments to stdout separated by spaces followed by a newline. Behavior of -e, -n and backslash interpretation varies between bash built-in echo and /bin/echo, making it less portable than printf.',
    mistakes: [
      'Using echo with user-controlled input -- if the input starts with -e or -n, echo may interpret it as a flag. Use printf "%s\\n" "$var" instead.',
      'Relying on echo -e for portability -- backslash interpretation behavior varies across shells and systems. Use printf for consistent behavior.',
    ],
    bestPractices: [
      'Prefer printf over echo for portable, predictable output formatting.',
      'Always quote variables: echo "$var" to prevent word splitting and globbing.',
      'Use echo for simple messages in interactive scripts; use printf for anything production-grade.',
    ],
  },

  date: {
    useCases: [
      'Display the current date and time in various formats',
      'Generate timestamps for log files and backup names',
      'Perform date arithmetic (e.g., "3 days ago") with GNU date',
    ],
    internals:
      'date reads the system clock via the gettimeofday/clock_gettime syscall, then formats the result using strftime-style format specifiers. It respects the TZ environment variable for timezone conversion.',
    mistakes: [
      'Assuming date -d works on macOS -- the -d flag is GNU-specific. On macOS/BSD use date -v or install GNU coreutils.',
      'Using locale-dependent formats in scripts -- date output changes with LC_TIME. Always use explicit format strings like +%Y-%m-%d for scripting.',
    ],
    bestPractices: [
      'Use ISO 8601 format (date +%Y-%m-%dT%H:%M:%S%z) for unambiguous timestamps.',
      'Use date +%s for epoch seconds when you need to do arithmetic.',
      'Set TZ explicitly in scripts that depend on a specific timezone.',
    ],
  },

  cal: {
    useCases: [
      'Quickly view a calendar for the current or any specific month/year',
      'Check day-of-week for a particular date',
    ],
    mistakes: [
      'Expecting cal to accept date strings -- it takes month and year as separate numeric arguments: cal 3 2026, not cal March 2026.',
      'Forgetting the year argument shows the current year -- cal 12 shows December of the current year, which may not be what you intended.',
    ],
    bestPractices: [
      'Use cal -3 to display previous, current, and next month side by side.',
      'Use ncal for a vertical layout that highlights today by default.',
    ],
  },

  sleep: {
    useCases: [
      'Add delays between commands in scripts (e.g., retry loops)',
      'Rate-limit repeated operations like API polling',
      'Wait for a dependent service to become available',
    ],
    internals:
      'sleep invokes the nanosleep syscall, yielding the CPU to the scheduler. GNU sleep accepts floating-point seconds and suffixes (s, m, h, d). It can be interrupted by signals.',
    mistakes: [
      'Using sleep in a busy-wait loop instead of event-driven waits -- prefer inotifywait, wait, or proper health-check mechanisms.',
      'Hardcoding long sleep durations in CI pipelines -- this wastes runner time. Use retry logic with exponential backoff instead.',
    ],
    bestPractices: [
      'Use sleep with fractional seconds (sleep 0.5) for sub-second delays on GNU systems.',
      'Combine with until/while loops for polling with a timeout rather than indefinite waiting.',
    ],
  },

  time: {
    useCases: [
      'Measure the wall-clock and CPU time of a command',
      'Compare performance of different approaches',
      'Profile scripts to find slow sections',
    ],
    internals:
      'The bash built-in time uses times() to measure shell and child process CPU time. The external /usr/bin/time uses wait4() and reports real, user, and sys time. User time is CPU spent in user-space; sys time is CPU spent in kernel syscalls.',
    mistakes: [
      'Confusing the bash built-in time with /usr/bin/time -- the built-in has limited output. Use command time or /usr/bin/time -v for detailed stats like memory usage.',
      'Benchmarking with a single run -- system load varies. Run commands multiple times and average, or use hyperfine for proper benchmarks.',
    ],
    bestPractices: [
      'Use /usr/bin/time -v (GNU) for detailed resource usage including max RSS.',
      'Use the TIMEFORMAT variable in bash to customize the built-in time output.',
      'For serious benchmarking, use hyperfine instead of manual time invocations.',
    ],
  },

  seq: {
    useCases: [
      'Generate sequences of numbers for loops and pipelines',
      'Create numbered file names or test data',
      'Produce ranges with custom increments or zero-padded output',
    ],
    internals:
      'seq outputs a sequence of numbers from first to last with an optional increment. It uses long double arithmetic internally, which can cause floating-point precision issues for decimal increments.',
    mistakes: [
      'Using seq with floating-point increments and expecting exact values -- floating-point rounding can produce unexpected results. Use awk or bc for precise decimal sequences.',
      'Not knowing about brace expansion -- in bash, {1..10} is often simpler than $(seq 1 10) for integer ranges.',
    ],
    bestPractices: [
      'Use seq -w for zero-padded output (e.g., 01, 02, ..., 10).',
      'Prefer bash brace expansion {start..end..step} when portability to non-GNU systems is not needed.',
      'Use seq -s to change the separator (e.g., seq -s, 1 5 produces 1,2,3,4,5).',
    ],
  },

  which: {
    useCases: [
      'Find the full path of an executable in your PATH',
      'Verify which version of a command will be executed',
      'Debug PATH issues when the wrong binary runs',
    ],
    internals:
      'which searches the directories listed in PATH left to right and prints the first matching executable. It does not know about shell built-ins, aliases, or functions.',
    mistakes: [
      'Using which to find shell built-ins -- which only searches PATH. Use type or command -v to find built-ins, aliases, and functions.',
      'Assuming which behavior is consistent -- some systems have a csh script as which that behaves differently. Prefer command -v for portable scripts.',
    ],
    bestPractices: [
      'Use command -v in scripts for POSIX-portable executable lookup.',
      'Use type -a to see all locations and types (alias, function, built-in, file) of a command.',
    ],
  },

  man: {
    useCases: [
      'Read the official documentation for any installed command',
      'Look up system call interfaces (section 2) or library functions (section 3)',
      'Discover command flags and usage examples',
    ],
    internals:
      'man searches a database of pre-formatted or source (troff/groff) manual pages, typically stored in /usr/share/man. It pipes the formatted output through a pager (usually less). The MANPATH variable and mandb cache control where pages are found.',
    mistakes: [
      'Not specifying the section number -- man printf shows the shell command, not the C function. Use man 3 printf for the C library version.',
      'Not knowing about apropos -- if you do not know the command name, use apropos <keyword> (or man -k) to search man page descriptions.',
    ],
    bestPractices: [
      'Use man -k <keyword> to search for relevant man pages by topic.',
      'Set MANPAGER to customize the pager (e.g., MANPAGER="less -R" for color support).',
      'Check the EXAMPLES section near the end of man pages for quick usage patterns.',
    ],
  },

  clear: {
    useCases: [
      'Clear the terminal screen for a fresh view',
      'Reset visual clutter during interactive debugging sessions',
    ],
    internals:
      'clear sends terminal-specific escape sequences (typically from the terminfo database) to move the cursor to the top and clear the display. It does not erase scrollback in all terminals; use clear -x or printf "\\033[3J" for that.',
    mistakes: [
      'Thinking clear erases scrollback -- by default it only clears the visible screen. Scroll up to see previous output. Use reset for a full terminal reset.',
    ],
    bestPractices: [
      'Use Ctrl+L as a keyboard shortcut for clear in most shells.',
      'Use reset instead of clear if the terminal is in a broken state (e.g., after catting a binary file).',
    ],
  },

  screen: {
    useCases: [
      'Keep long-running processes alive after disconnecting from SSH',
      'Multiplex several terminal sessions inside one connection',
      'Share a terminal session with another user for pair debugging',
    ],
    internals:
      'screen creates a pseudo-terminal (pty) between the user terminal and child processes. The screen process persists in the background, so child processes survive terminal disconnects. Session state is stored in /var/run/screen or /tmp/screens.',
    mistakes: [
      'Nesting screen sessions accidentally -- pressing Ctrl-a inside a nested screen sends the command to the outer session. Use Ctrl-a a to pass it through.',
      'Not naming sessions -- without names, managing multiple detached sessions becomes confusing. Use screen -S name.',
    ],
    bestPractices: [
      'Name your sessions: screen -S myproject for easy reattachment.',
      'Use screen -rd to reattach a session that is attached elsewhere.',
      'Consider tmux as a more modern alternative with better scripting support.',
    ],
  },

  tmux: {
    useCases: [
      'Maintain persistent terminal sessions that survive SSH disconnects',
      'Split a terminal into multiple panes and windows for parallel work',
      'Script complex multi-pane development environments',
    ],
    internals:
      'tmux runs a server process that owns all sessions. Clients connect to the server via a Unix socket (default: /tmp/tmux-UID/default). Each pane is a separate pty. The server persists until all sessions are killed, allowing detach/reattach.',
    mistakes: [
      'Forgetting to detach before closing the terminal -- closing the terminal window may kill the tmux client but the session persists. Use tmux detach (Ctrl-b d) explicitly.',
      'Not knowing how to scroll -- tmux captures input, so normal scrolling does not work. Enter copy mode with Ctrl-b [ and use arrow keys or Page Up.',
      'Nested tmux sessions causing prefix key confusion -- set a different prefix in inner sessions or use send-prefix.',
    ],
    bestPractices: [
      'Use tmux new -s name to name sessions for easy management.',
      'Learn the key bindings: Ctrl-b % (vertical split), Ctrl-b " (horizontal split), Ctrl-b d (detach).',
      'Use a .tmux.conf to customize keybindings, status bar, and default shell.',
      'Use tmuxinator or tmux-resurrect to save and restore complex layouts.',
    ],
  },

  locate: {
    useCases: [
      'Quickly find files by name across the entire filesystem',
      'Search for files faster than find by using a pre-built database',
      'Find config files or libraries when you know part of the name',
    ],
    internals:
      'locate searches a pre-built database (usually /var/lib/mlocate/mlocate.db) created by updatedb, which is typically run daily via cron. The database stores file paths, making lookups nearly instant compared to traversing the filesystem.',
    mistakes: [
      'Getting stale results -- locate uses a database that may be hours or days old. Run sudo updatedb first if you need current results.',
      'Finding files you cannot access -- by default locate may show files you lack permission to read. mlocate checks permissions at query time.',
    ],
    bestPractices: [
      'Use locate -i for case-insensitive searches.',
      'Use locate -r for regex pattern matching.',
      'Run sudo updatedb after creating new files if you need to locate them immediately.',
    ],
  },

  export: {
    useCases: [
      'Make shell variables available to child processes',
      'Set environment variables for applications (e.g., export PATH=...)',
      'Configure tool behavior via environment (e.g., export EDITOR=vim)',
    ],
    internals:
      'export marks a variable so that it is copied into the environment of every subsequently forked child process. The environment is passed via the execve syscall. Without export, variables exist only in the current shell.',
    mistakes: [
      'Forgetting to export -- setting VAR=value without export means child processes cannot see it. Use export VAR=value.',
      'Expecting exported variables to propagate upward -- child processes cannot modify the parent environment. Use source to load variables into the current shell.',
    ],
    bestPractices: [
      'Combine assignment and export: export VAR=value rather than two separate commands.',
      'Use export -p to list all exported variables for debugging.',
      'Set persistent exports in ~/.bashrc (interactive) or ~/.profile (login shells).',
    ],
  },

  'read-builtin': {
    useCases: [
      'Read user input interactively in scripts',
      'Parse lines from files or pipes into variables',
      'Implement simple prompts and confirmation dialogs in bash',
    ],
    internals:
      'read is a bash built-in that reads a line from stdin (or a file descriptor with -u), splits it using IFS, and assigns the resulting words to named variables. The last variable receives the remainder of the line.',
    mistakes: [
      'Forgetting IFS in while-read loops -- without setting IFS, leading/trailing whitespace is stripped. Use while IFS= read -r line to preserve whitespace.',
      'Omitting -r flag -- without -r, backslashes are treated as escape characters. Always use read -r unless you specifically want backslash interpretation.',
      'Piping into read in a pipeline -- in bash, pipeline commands run in subshells, so variables set by read are lost. Use process substitution: while read line; do ...; done < <(command).',
    ],
    bestPractices: [
      'Always use read -r to prevent backslash interpretation.',
      'Use IFS= read -r line for reading lines verbatim.',
      'Use read -p "prompt: " var for interactive prompts with a message.',
      'Use read -s for password input (disables echo).',
    ],
  },

  test: {
    useCases: [
      'Check file existence, type, and permissions in scripts',
      'Compare strings and integers in conditional expressions',
      'Evaluate conditions in if statements and while loops',
    ],
    internals:
      'test (also invoked as [) evaluates a conditional expression and exits with 0 (true) or 1 (false). The bash built-in [[ is an enhanced version that supports regex matching and does not require quoting variables to prevent word splitting.',
    mistakes: [
      'Forgetting spaces around [ and ] -- [ is a command, so [\"$x\" = \"y\"] fails. Use [ \"$x\" = \"y\" ] with spaces.',
      'Using = vs -eq incorrectly -- = is for string comparison, -eq is for integer comparison. Mixing them gives wrong results.',
      'Not quoting variables -- unquoted empty variables cause syntax errors. Always quote: [ \"$var\" = \"value\" ].',
    ],
    bestPractices: [
      'Prefer [[ ]] over [ ] in bash scripts for safer syntax (no word splitting, supports && and ||).',
      'Use -f for files, -d for directories, -z for empty strings, -n for non-empty strings.',
      'Always quote variables inside [ ] to prevent errors with empty or whitespace-containing values.',
    ],
  },

  bc: {
    useCases: [
      'Perform arbitrary-precision arithmetic from the command line',
      'Calculate floating-point math that bash cannot handle natively',
      'Convert between number bases (hex, binary, decimal)',
    ],
    internals:
      'bc is a POSIX arbitrary-precision calculator language. It reads expressions from stdin, compiles them into a bytecode, and executes them. The -l flag loads a math library providing sine, cosine, exp, log, and sets scale to 20.',
    mistakes: [
      'Getting integer division by default -- bc uses scale=0 by default, so 5/3 gives 1. Set scale=2 (or use -l) for decimal results.',
      'Forgetting to echo expressions -- bc reads stdin, so use echo "5/3" | bc -l in scripts.',
    ],
    bestPractices: [
      'Use bc -l for floating-point math with a default scale of 20.',
      'Set scale explicitly for the precision you need: echo "scale=4; 10/3" | bc.',
      'Use obase and ibase for base conversion: echo "obase=16; 255" | bc outputs FF.',
    ],
  },

  'xdg-open': {
    useCases: [
      'Open a file or URL with the default application on Linux desktops',
      'Launch a browser for a URL from a script',
      'Open documents, images, or PDFs from the terminal',
    ],
    internals:
      'xdg-open is a shell script from xdg-utils that detects the desktop environment (GNOME, KDE, XFCE, etc.) and delegates to the appropriate opener (gio open, kde-open, exo-open). It uses MIME type associations from ~/.config/mimeapps.list and the shared MIME database.',
    mistakes: [
      'Using xdg-open on macOS or WSL -- xdg-open is Linux-specific. Use open on macOS and wslview or explorer.exe on WSL.',
      'Not having a desktop environment -- xdg-open requires a running DE or at least a configured handler. It fails on headless servers.',
    ],
    bestPractices: [
      'Use xdg-mime to query or set default applications for MIME types.',
      'In cross-platform scripts, wrap xdg-open/open/start in a platform-detecting function.',
    ],
  },

  type: {
    useCases: [
      'Determine whether a command is a built-in, alias, function, or external binary',
      'Debug which version of a command the shell will execute',
      'Verify that a command exists before using it in a script',
    ],
    internals:
      'type is a shell built-in that searches through aliases, functions, built-ins, and PATH entries in order to describe how the shell would interpret a command name. Unlike which, it sees the full shell namespace.',
    mistakes: [
      'Using which instead of type -- which only searches PATH and misses built-ins, aliases, and functions.',
      'Not using type -a -- without -a you only see the first match. Use type -a to see all definitions.',
    ],
    bestPractices: [
      'Use type -a command to see every definition (alias, function, built-in, and all PATH matches).',
      'Use command -v in scripts for a portable way to check if a command exists.',
    ],
  },

  'set-shopt': {
    useCases: [
      'Configure shell behavior options like error handling and globbing',
      'Enable strict mode in scripts with set -euo pipefail',
      'Toggle bash-specific features with shopt (e.g., globstar, extglob)',
    ],
    internals:
      'set modifies POSIX shell options and positional parameters. shopt is bash-specific and controls extended features. set -e causes the shell to exit on any command failure; set -u treats unset variables as errors; set -o pipefail makes pipelines fail if any component fails.',
    mistakes: [
      'Not understanding set -e semantics -- commands in if conditions, || chains, and && chains do not trigger exit on failure, leading to unexpected behavior.',
      'Forgetting set -o pipefail -- without it, a pipeline returns only the exit status of the last command, hiding failures in earlier stages.',
      'Using set -e in functions called from conditional contexts -- the -e flag is suspended in those contexts, which can be confusing.',
    ],
    bestPractices: [
      'Start scripts with set -euo pipefail as a "strict mode" baseline.',
      'Use shopt -s globstar to enable ** recursive globbing in bash.',
      'Use shopt -s nullglob so that unmatched globs expand to nothing instead of the literal pattern.',
      'Document any deviation from strict mode with comments explaining why.',
    ],
  },

  trap: {
    useCases: [
      'Clean up temporary files on script exit, even on errors or interrupts',
      'Handle signals gracefully (e.g., SIGINT, SIGTERM) in long-running scripts',
      'Run finalization code regardless of how a script terminates',
    ],
    internals:
      'trap is a shell built-in that registers a command string to execute when the shell receives a specific signal or pseudo-signal (EXIT, ERR, DEBUG, RETURN). The trap handler runs in the current shell context with access to all variables.',
    mistakes: [
      'Forgetting to quote the trap command -- trap rm -f $tmpfile EXIT breaks because $tmpfile is expanded at definition time. Use single quotes: trap \'rm -f "$tmpfile"\' EXIT.',
      'Not handling multiple signals -- trapping only EXIT misses cases where the script is killed. Trap both EXIT and relevant signals like SIGINT and SIGTERM.',
    ],
    bestPractices: [
      'Use trap cleanup EXIT as the primary cleanup mechanism -- it fires on normal exit, errors, and most signals.',
      'Create a cleanup function and trap it: cleanup() { rm -f "$tmp"; }; trap cleanup EXIT.',
      'Use trap - SIGNAL to reset a trap to its default behavior.',
    ],
  },

  eval: {
    useCases: [
      'Execute dynamically constructed command strings',
      'Perform indirect variable expansion in older bash versions',
      'Process commands built from user input or configuration (with caution)',
    ],
    internals:
      'eval concatenates its arguments, then parses and executes the resulting string as a shell command. This means a second round of expansion occurs: variables, command substitutions, and globbing are all re-evaluated.',
    mistakes: [
      'Introducing code injection vulnerabilities -- eval executes arbitrary code. Never eval unsanitized user input. This is the most dangerous shell command.',
      'Using eval when simpler alternatives exist -- bash nameref (declare -n), arrays, or indirect expansion (${!var}) often eliminate the need for eval.',
    ],
    bestPractices: [
      'Avoid eval whenever possible. Use bash arrays, namerefs (declare -n), or indirect expansion instead.',
      'If eval is truly necessary, validate and sanitize all input rigorously.',
      'Document why eval is needed with a comment explaining why alternatives are insufficient.',
    ],
  },

  tput: {
    useCases: [
      'Add colors and formatting to terminal output in scripts',
      'Query terminal capabilities (columns, lines) portably',
      'Control cursor position for dynamic terminal interfaces',
    ],
    internals:
      'tput queries the terminfo database for the current terminal type (from TERM) and outputs the corresponding escape sequence. This is more portable than hardcoding ANSI escape codes since it adapts to the actual terminal capabilities.',
    mistakes: [
      'Hardcoding ANSI escapes instead of using tput -- not all terminals support ANSI. tput uses the terminfo database to emit correct sequences.',
      'Forgetting to reset formatting -- if you set bold or color and do not reset, subsequent output inherits the formatting. Always use tput sgr0 to reset.',
    ],
    bestPractices: [
      'Use tput colors to check if the terminal supports color before emitting color codes.',
      'Use tput cols and tput lines to get terminal dimensions for responsive output.',
      'Wrap tput calls in variables at script start for performance: bold=$(tput bold); reset=$(tput sgr0).',
    ],
  },

  yes: {
    useCases: [
      'Auto-confirm interactive prompts in scripts (e.g., yes | apt-get install)',
      'Generate a stream of repeated strings for testing',
      'Stress-test pipelines with high-throughput input',
    ],
    internals:
      'yes repeatedly writes a string (default "y") to stdout at maximum speed until killed or the pipe closes. Modern implementations use buffered writes for throughput -- GNU yes can output several GB/s.',
    mistakes: [
      'Running yes without a pipe -- it fills the terminal endlessly. Always pipe it or redirect it.',
      'Using yes to bypass safety prompts carelessly -- auto-confirming destructive operations like rm -ri can cause data loss.',
    ],
    bestPractices: [
      'Prefer command-specific non-interactive flags (e.g., apt-get -y, rm -f) over piping yes.',
      'Use yes for testing or when no non-interactive flag is available.',
    ],
  },

  // ─── FILE INSPECTION (13) ──────────────────────────────────────────

  file: {
    useCases: [
      'Identify the type of a file without relying on its extension',
      'Check if a file is binary or text before processing',
      'Detect file encoding, compression format, or image dimensions',
    ],
    internals:
      'file performs three tests in order: filesystem tests (stat), magic number tests (comparing byte patterns against /usr/share/misc/magic), and language tests (checking for text patterns). It reports the first match.',
    mistakes: [
      'Trusting file extensions -- file examines content, not names. A .jpg could be a renamed executable.',
      'Assuming file is authoritative for security -- file can be fooled with polyglot files or crafted headers. Do not use it as a security gate.',
    ],
    bestPractices: [
      'Use file -i for MIME type output suitable for programmatic use.',
      'Use file -b for brief output without the filename prefix.',
      'Combine with find for bulk analysis: find . -exec file {} +.',
    ],
  },

  stat: {
    useCases: [
      'View detailed file metadata: size, permissions, timestamps, inode',
      'Check the exact modification time for build systems or caching',
      'Determine the filesystem and inode information for a file',
    ],
    internals:
      'stat calls the stat() or lstat() syscall to read the inode metadata. It reports size, blocks, inode number, permissions (mode), owner/group, and three timestamps: access (atime), modification (mtime), and change (ctime).',
    mistakes: [
      'Confusing ctime with creation time -- ctime is the inode change time (permission or link changes), not creation time. Linux ext4 stores birth time (crtime) accessible via stat -c %W on newer systems.',
      'Using incompatible format options -- GNU stat uses -c for format strings while BSD/macOS stat uses -f. Scripts must account for this.',
    ],
    bestPractices: [
      'Use stat -c "%s" file for file size in bytes (GNU) for scripting.',
      'Use stat -c "%a %U %G" file to see octal permissions and ownership.',
      'For cross-platform scripts, detect the stat variant or use portable alternatives.',
    ],
  },

  md5sum: {
    useCases: [
      'Verify file integrity after downloads or transfers',
      'Generate checksums for a set of files for comparison',
      'Detect accidental file corruption or modification',
    ],
    internals:
      'md5sum computes the MD5 message digest (128-bit hash) by processing the file in blocks through the MD5 algorithm. It outputs a hexadecimal hash and filename. The -c flag reads a checksum file and verifies each entry.',
    mistakes: [
      'Using MD5 for security purposes -- MD5 is cryptographically broken; collisions can be crafted. Use sha256sum for security-sensitive verification.',
      'Forgetting binary mode on Windows -- when cross-platform, use md5sum -b to ensure consistent binary-mode checksumming.',
    ],
    bestPractices: [
      'Use sha256sum instead of md5sum for any security-relevant integrity checks.',
      'Use md5sum -c checksums.md5 to batch-verify files against a checksum file.',
      'Use md5sum only for fast non-security integrity checks or legacy compatibility.',
    ],
  },

  strings: {
    useCases: [
      'Extract readable text from binary files for analysis',
      'Find hardcoded strings, URLs, or error messages in executables',
      'Quick triage of suspicious binaries or firmware images',
    ],
    internals:
      'strings scans a file for sequences of printable characters of a minimum length (default 4). By default it only scans initialized and loaded data sections of object files; use -a to scan the entire file.',
    mistakes: [
      'Not using -a flag -- by default strings only scans certain sections of object files. Use strings -a to scan the entire file, especially for non-ELF files.',
      'Relying on strings output for security analysis -- strings can miss obfuscated or encoded data. Use it as a starting point, not a definitive analysis.',
    ],
    bestPractices: [
      'Use strings -n N to set minimum string length (e.g., -n 8 for longer strings only).',
      'Pipe through grep to filter for interesting patterns: strings binary | grep -i password.',
      'Use strings -t x to show the offset of each string for further investigation.',
    ],
  },

  hexdump: {
    useCases: [
      'Inspect raw binary content of files byte by byte',
      'Debug file format issues or binary protocols',
      'View non-printable characters and exact byte values',
    ],
    internals:
      'hexdump reads the file and formats each byte as hexadecimal (and optionally ASCII). It supports custom format strings via -e. The -C flag produces the canonical hex+ASCII side-by-side display.',
    mistakes: [
      'Using hexdump without -C -- the default output format is confusing with 16-bit words in little-endian order. Use hexdump -C for the familiar hex+ASCII layout.',
      'Not knowing about xxd -- for simpler hex dumping and reversing, xxd is often more intuitive than hexdump.',
    ],
    bestPractices: [
      'Use hexdump -C for the canonical hex+ASCII display.',
      'Use hexdump -n N to limit output to the first N bytes.',
      'Consider xxd as a more user-friendly alternative with reverse (-r) capability.',
    ],
  },

  ldd: {
    useCases: [
      'List shared library dependencies of a binary or shared object',
      'Debug "library not found" errors at runtime',
      'Verify that a binary links against expected library versions',
    ],
    internals:
      'ldd invokes the dynamic linker (ld-linux.so) with special environment variables to trace library resolution. It walks the dependency tree, searching paths in DT_RPATH, DT_RUNPATH, LD_LIBRARY_PATH, ldconfig cache, and default paths.',
    mistakes: [
      'Running ldd on untrusted binaries -- ldd may execute the binary to resolve dependencies, which is a security risk. Use objdump -p or readelf -d on untrusted files instead.',
      'Ignoring "not found" entries -- these indicate missing libraries that will cause runtime failures. Install the missing library or fix LD_LIBRARY_PATH.',
    ],
    bestPractices: [
      'Never run ldd on untrusted executables; use readelf -d or objdump -p instead.',
      'Use ldd -v for verbose output showing version information.',
      'Fix missing libraries by installing the correct package or setting LD_LIBRARY_PATH.',
    ],
  },

  nm: {
    useCases: [
      'List symbols (functions, variables) in object files or libraries',
      'Debug undefined symbol errors during linking',
      'Check whether a library exports a specific function',
    ],
    internals:
      'nm reads the symbol table from ELF object files, archive libraries (.a), or shared objects. It displays symbol names, addresses, and types (T=text/code, D=data, U=undefined, B=BSS). Stripped binaries have no symbol table.',
    mistakes: [
      'Running nm on a stripped binary -- stripped binaries lack symbol tables, so nm shows nothing. Use nm -D for dynamic symbols or readelf --dyn-syms.',
      'Confusing symbol types -- U means undefined (needs linking), T means defined in text section. Misreading these leads to wrong conclusions about linking.',
    ],
    bestPractices: [
      'Use nm -D to list dynamic symbols in shared libraries.',
      'Use nm -C to demangle C++ symbol names for readability.',
      'Combine with grep to search for specific symbols: nm libfoo.so | grep my_function.',
    ],
  },

  objdump: {
    useCases: [
      'Disassemble compiled binaries to inspect machine code',
      'View section headers, relocations, and symbol tables of object files',
      'Reverse-engineer or debug compiled code at the assembly level',
    ],
    internals:
      'objdump uses the BFD (Binary File Descriptor) library to parse ELF, PE, and other object formats. It can disassemble using the built-in disassembler for the target architecture and display headers, relocations, and debug info.',
    mistakes: [
      'Disassembling without specifying the architecture for cross-compiled binaries -- use -m to set the target architecture.',
      'Not using -d vs -D correctly -- -d disassembles code sections only; -D disassembles all sections including data, which produces misleading output.',
    ],
    bestPractices: [
      'Use objdump -d for disassembly of code sections only.',
      'Use objdump -h to view section headers and their sizes/addresses.',
      'Combine with -C for C++ name demangling: objdump -d -C binary.',
      'For deeper analysis, consider radare2 or Ghidra as more capable alternatives.',
    ],
  },

  readelf: {
    useCases: [
      'Inspect ELF binary headers, sections, and segments',
      'View dynamic linking information safely (unlike ldd)',
      'Examine debug information, symbol tables, and relocation entries',
    ],
    internals:
      'readelf directly parses ELF format structures without using the BFD library, making it independent of libbfd. It reads ELF headers, program headers, section headers, symbol tables, and dynamic segments from the binary.',
    mistakes: [
      'Confusing readelf with objdump -- readelf is ELF-specific but does not depend on BFD. objdump supports multiple formats but uses BFD. readelf gives more detailed ELF-specific info.',
      'Not using -W for wide output -- long symbol names get truncated without -W (--wide).',
    ],
    bestPractices: [
      'Use readelf -d to safely inspect dynamic dependencies instead of ldd on untrusted binaries.',
      'Use readelf -h to view the ELF header (architecture, entry point, type).',
      'Use readelf -s for full symbol tables and readelf --dyn-syms for dynamic symbols.',
    ],
  },

  sha256sum: {
    useCases: [
      'Cryptographically verify file integrity after downloads',
      'Generate checksums for software releases and distribution',
      'Compare file contents without examining the actual data',
    ],
    internals:
      'sha256sum computes the SHA-256 hash (256-bit) using the SHA-2 family algorithm. The file is processed in blocks and the hash is output as 64 hexadecimal characters. SHA-256 is currently considered secure against collision and preimage attacks.',
    mistakes: [
      'Checking the hash visually instead of programmatically -- manual comparison is error-prone. Use sha256sum -c to verify automatically.',
      'Downloading the checksum file over an insecure channel -- if an attacker can modify the download, they can modify the checksum too. Verify checksums via a signed source or HTTPS.',
    ],
    bestPractices: [
      'Use sha256sum -c SHA256SUMS to automatically verify multiple files.',
      'Always verify checksums from a trusted, independent source (e.g., GPG-signed checksum files).',
      'Use sha256sum over md5sum for all integrity verification tasks.',
    ],
  },

  xxd: {
    useCases: [
      'Create hex dumps of files with a clean side-by-side display',
      'Convert hex dumps back to binary with the -r (reverse) flag',
      'Patch binary files by editing a hex dump and converting back',
    ],
    internals:
      'xxd reads input byte by byte and formats it as hexadecimal with optional ASCII display. The -r flag reverses the process, parsing hex values and writing binary output. It handles continuous hex streams or formatted dumps.',
    mistakes: [
      'Forgetting -r for reverse operations -- xxd creates hex dumps by default. Use xxd -r to convert hex back to binary.',
      'Modifying ASCII column in hex dump before reversing -- xxd -r only reads the hex columns, not the ASCII. Edits to the ASCII side are ignored.',
    ],
    bestPractices: [
      'Use xxd -p for a plain hex dump without addresses or ASCII (useful for piping).',
      'Binary patching workflow: xxd file > file.hex, edit hex values, xxd -r file.hex > file.patched.',
      'Use xxd -l N to limit output to first N bytes.',
    ],
  },

  od: {
    useCases: [
      'Dump file contents in octal, hex, decimal, or character formats',
      'Inspect binary data with custom output formats',
      'View raw bytes in formats other than hex when needed',
    ],
    internals:
      'od (octal dump) reads files and displays content in the specified numeric base. It is a POSIX standard tool, making it more portable than xxd or hexdump. It supports various output formats via -t (e.g., -t x1 for hex bytes).',
    mistakes: [
      'Using default octal output when hex is intended -- od defaults to octal (base 8), which is rarely what you want. Use od -A x -t x1z for hex output.',
      'Not knowing about xxd and hexdump -- od is portable but less user-friendly. Use xxd or hexdump -C for more readable output.',
    ],
    bestPractices: [
      'Use od -A x -t x1z for hex byte display with ASCII sidebar.',
      'Use od -c to display characters with backslash escapes for non-printable bytes.',
      'Prefer xxd or hexdump -C for interactive use; reserve od for POSIX portability.',
    ],
  },

  cmp: {
    useCases: [
      'Compare two files byte by byte to check if they are identical',
      'Find the first point of difference between two binary files',
      'Use in scripts to test file equality with exit codes',
    ],
    internals:
      'cmp reads both files simultaneously byte by byte and reports the first differing byte position and line number. It exits with 0 if files are identical, 1 if they differ, and 2 on error. With -s it produces no output, only the exit code.',
    mistakes: [
      'Using diff instead of cmp for binary files -- diff is line-oriented and produces unhelpful output for binary files. Use cmp for byte-level comparison.',
      'Forgetting -s for scripting -- without -s, cmp prints output. Use cmp -s file1 file2 for silent comparison in scripts.',
    ],
    bestPractices: [
      'Use cmp -s in scripts with if statements: if cmp -s file1 file2; then echo same; fi.',
      'Use cmp -l to list all differing bytes, not just the first.',
      'For text file comparison, use diff instead for human-readable output.',
    ],
  },

  // ─── VERSION CONTROL (16) ─────────────────────────────────────────

  git: {
    useCases: [
      'Track changes to source code and collaborate with others',
      'Maintain a complete history of project evolution with branching',
      'Manage distributed development workflows across teams',
    ],
    internals:
      'Git stores data as a content-addressable filesystem. Every file version is stored as a blob, directories as trees, and snapshots as commits (each pointing to a tree and parent commits). Branches are simply pointers (refs) to commit SHAs stored in .git/refs.',
    mistakes: [
      'Committing large binary files -- Git stores every version, so repos grow quickly. Use Git LFS for large binaries.',
      'Using git add . without checking status -- this stages everything including temporary files. Always run git status first or use a .gitignore.',
      'Force-pushing to shared branches -- this rewrites history and breaks collaborators. Only force-push to personal branches.',
    ],
    bestPractices: [
      'Write meaningful commit messages with a short summary line under 50 characters.',
      'Use branches for features, fixes, and experiments. Keep main/master stable.',
      'Set up a .gitignore early to exclude build artifacts, dependencies, and IDE files.',
      'Make small, focused commits rather than large monolithic ones.',
    ],
  },

  'git-stash': {
    useCases: [
      'Temporarily save uncommitted changes to switch branches cleanly',
      'Set aside work-in-progress when you need to handle an urgent fix',
      'Save and restore experimental changes without committing',
    ],
    internals:
      'git stash creates two (or three with --include-untracked) commit objects: one for the index state and one for the working tree state. These are stored on a ref stack (refs/stash) using a reflog. git stash pop applies and drops the top entry.',
    mistakes: [
      'Stashing and forgetting -- stashed changes can be lost if you never pop them. Use git stash list regularly to check for forgotten stashes.',
      'Assuming stash includes untracked files -- by default stash only saves tracked files. Use git stash -u to include untracked files.',
      'Using git stash pop and getting conflicts -- pop drops the stash even on conflict. Use git stash apply instead to keep the stash safe until you confirm the merge succeeded.',
    ],
    bestPractices: [
      'Name your stashes: git stash push -m "WIP: feature description" for clarity.',
      'Use git stash apply instead of pop until you verify the changes applied cleanly.',
      'Clean up old stashes with git stash drop or git stash clear.',
    ],
  },

  'git-log': {
    useCases: [
      'Review commit history for a repository, file, or author',
      'Find when a specific change was introduced',
      'Generate changelogs or track project evolution',
    ],
    internals:
      'git log walks the commit DAG starting from HEAD (or specified refs), following parent pointers. Each commit stores a tree hash, author/committer info, timestamps, and parent hashes. Formatting and filtering happen after traversal.',
    mistakes: [
      'Viewing overwhelming log output -- without formatting flags the output is verbose. Use --oneline for concise output.',
      'Not filtering by path -- git log shows all commits by default. Use git log -- path/to/file to see only commits affecting that file.',
    ],
    bestPractices: [
      'Use git log --oneline --graph --decorate for a concise visual branch history.',
      'Use git log --author="name" to filter by author.',
      'Use git log -p to see the actual diff for each commit.',
      'Use git log --since="2 weeks ago" for time-based filtering.',
    ],
  },

  'git-branch': {
    useCases: [
      'Create, list, rename, or delete branches',
      'Manage feature branches and release branches',
      'Check which branch you are currently on',
    ],
    internals:
      'A branch is a lightweight movable pointer stored as a 40-character SHA in .git/refs/heads/. Creating a branch is O(1) -- it just writes a ref file. HEAD is a symbolic ref pointing to the current branch.',
    mistakes: [
      'Deleting branches with unmerged work -- git branch -d refuses if the branch is not merged. Using -D force-deletes and can lose work. Check with git branch --merged first.',
      'Not cleaning up stale remote-tracking branches -- after remote branches are deleted, local references remain. Use git fetch --prune to clean them up.',
    ],
    bestPractices: [
      'Use descriptive branch names with prefixes: feature/, bugfix/, hotfix/.',
      'Regularly prune merged branches: git branch --merged | xargs git branch -d.',
      'Use git branch -vv to see tracking relationships and ahead/behind status.',
    ],
  },

  'git-rebase': {
    useCases: [
      'Replay commits onto a new base for a linear history',
      'Clean up commit history before merging a feature branch',
      'Squash, reword, or reorder commits with interactive rebase',
    ],
    internals:
      'Rebase works by finding the common ancestor, saving each commit as a patch, resetting the branch to the new base, and replaying each patch. Interactive rebase (-i) lets you edit the todo list before replay. Each replayed commit gets a new SHA.',
    mistakes: [
      'Rebasing commits that have been pushed to a shared branch -- this rewrites history and forces collaborators to reconcile divergent histories. Only rebase local or personal branches.',
      'Not knowing how to abort -- if a rebase goes wrong, use git rebase --abort to return to the pre-rebase state.',
      'Creating a tangled history by rebasing merge commits -- rebase linearizes history by default, dropping merge commits. Use --rebase-merges to preserve merge topology.',
    ],
    bestPractices: [
      'Use interactive rebase (git rebase -i) to clean up commits before merging to main.',
      'Never rebase commits that others have based work on.',
      'Use git rebase --onto for transplanting a branch segment to a different base.',
    ],
  },

  'git-remote': {
    useCases: [
      'Manage connections to remote repositories',
      'Add, remove, or rename remote repository references',
      'View or change the URLs for fetch and push operations',
    ],
    internals:
      'Remote configurations are stored in .git/config as [remote "name"] sections with url and fetch refspec entries. Remote-tracking branches (refs/remotes/) are local copies of remote branch states updated by fetch.',
    mistakes: [
      'Confusing remote branches with local branches -- remote-tracking branches (origin/main) are read-only snapshots. You cannot commit to them directly.',
      'Having incorrect remote URLs after repository moves -- use git remote set-url to update.',
    ],
    bestPractices: [
      'Use git remote -v to view all remotes with their fetch and push URLs.',
      'Use SSH URLs for authentication instead of HTTPS with tokens for better security.',
      'Add multiple remotes for forks: origin for your fork, upstream for the original.',
    ],
  },

  'git-bisect': {
    useCases: [
      'Find the exact commit that introduced a bug using binary search',
      'Identify performance regressions across many commits',
      'Automate bug-finding with a test script',
    ],
    internals:
      'git bisect performs a binary search through commit history. You mark commits as good or bad, and it checks out the midpoint. With N commits, it finds the culprit in O(log N) steps. The state is stored in .git/BISECT_LOG.',
    mistakes: [
      'Not having a reliable way to test -- bisect requires a consistent pass/fail test for each commit. Flaky tests produce wrong results.',
      'Forgetting to run git bisect reset after finishing -- this leaves HEAD in a detached state at a random commit.',
    ],
    bestPractices: [
      'Automate with git bisect run ./test-script.sh where the script exits 0 for good and 1 for bad.',
      'Always run git bisect reset when finished to return to your branch.',
      'Use git bisect skip if a commit cannot be tested (e.g., does not compile).',
    ],
  },

  'git-config': {
    useCases: [
      'Set user name, email, and editor for Git operations',
      'Configure aliases, merge tools, and diff settings',
      'Manage per-repo, global, and system-wide Git settings',
    ],
    internals:
      'Git config reads from three levels: system (/etc/gitconfig), global (~/.gitconfig), and local (.git/config). Local overrides global, which overrides system. Values are stored as INI-style key-value pairs in these files.',
    mistakes: [
      'Setting config at the wrong scope -- without --global, settings only apply to the current repo. Conversely, --global affects all repos.',
      'Forgetting to set user.email and user.name -- commits without these show generic info. Set them with git config --global.',
    ],
    bestPractices: [
      'Set identity globally: git config --global user.name and user.email.',
      'Use conditional includes for different identities: [includeIf "gitdir:~/work/"] to auto-switch email for work repos.',
      'Define useful aliases: git config --global alias.lg "log --oneline --graph --decorate".',
    ],
  },

  'git-merge': {
    useCases: [
      'Combine work from different branches into one',
      'Integrate feature branches back into main',
      'Bring upstream changes into your working branch',
    ],
    internals:
      'Git merge finds the common ancestor (merge base) of the two branches, then performs a three-way merge. If the current branch has no new commits, it performs a fast-forward (just moves the pointer). Otherwise it creates a merge commit with two parents.',
    mistakes: [
      'Merging without pulling first -- if the remote has new commits, you may face unexpected conflicts. Pull or fetch before merging.',
      'Using fast-forward merges when you want merge history -- fast-forward merges leave no trace of the branch. Use git merge --no-ff to always create a merge commit.',
      'Not resolving conflicts properly -- resolving conflicts by accepting one side blindly can introduce bugs. Review each conflict carefully.',
    ],
    bestPractices: [
      'Use git merge --no-ff for feature branches to preserve the branch history in the log.',
      'Resolve conflicts in a merge tool: git mergetool.',
      'Test the merged result before pushing to catch integration issues.',
    ],
  },

  'git-cherry-pick': {
    useCases: [
      'Apply a specific commit from another branch without merging the whole branch',
      'Backport a bugfix to a release branch',
      'Rescue individual commits from an abandoned branch',
    ],
    internals:
      'Cherry-pick computes the diff introduced by the target commit (between it and its parent), then applies that diff to the current HEAD as a new commit. The new commit has a different SHA because it has a different parent, even though the changes are the same.',
    mistakes: [
      'Cherry-picking merge commits without specifying -m -- merge commits have multiple parents. You must specify which parent to diff against with -m 1 (usually the mainline).',
      'Cherry-picking many commits instead of merging -- cherry-pick duplicates commits, leading to conflicts when branches are later merged. Prefer merge or rebase for incorporating multiple commits.',
    ],
    bestPractices: [
      'Use cherry-pick sparingly -- it duplicates commits. Prefer merge or rebase for routine integration.',
      'Use git cherry-pick -x to record the original commit hash in the message.',
      'Use git cherry-pick --no-commit to stage changes without committing, allowing you to combine multiple cherry-picks.',
    ],
  },

  'git-tag': {
    useCases: [
      'Mark release points in the repository history (e.g., v1.0.0)',
      'Create annotated tags with messages for releases',
      'Reference specific commits by a human-readable name',
    ],
    internals:
      'Lightweight tags are simple refs in .git/refs/tags/ pointing to a commit. Annotated tags are full Git objects with a tagger, date, message, and optional GPG signature, stored in the object database and pointed to by a tag ref.',
    mistakes: [
      'Using lightweight tags for releases -- lightweight tags have no metadata. Use annotated tags (git tag -a) for releases so they include the tagger, date, and message.',
      'Forgetting to push tags -- git push does not send tags by default. Use git push --tags or git push origin <tagname>.',
    ],
    bestPractices: [
      'Use annotated tags for releases: git tag -a v1.0.0 -m "Release 1.0.0".',
      'Follow semantic versioning (semver) for tag names.',
      'Push tags explicitly: git push origin --tags.',
      'Sign release tags with GPG: git tag -s for verification.',
    ],
  },

  'git-diff': {
    useCases: [
      'View unstaged changes in your working tree',
      'Compare staged changes against the last commit',
      'Diff between any two commits, branches, or tags',
    ],
    internals:
      'git diff computes differences by comparing blob objects. For working tree diffs it compares the index (staging area) against the working tree. git diff --cached compares HEAD against the index. The output uses unified diff format by default.',
    mistakes: [
      'Confusing git diff and git diff --cached -- git diff shows unstaged changes only. git diff --cached (or --staged) shows what will be committed.',
      'Expecting whitespace-only changes to appear -- by default diff shows whitespace changes. Use git diff -w to ignore whitespace for cleaner reviews.',
    ],
    bestPractices: [
      'Use git diff --staged before committing to review exactly what will be committed.',
      'Use git diff --stat for a summary of changed files and line counts.',
      'Use git diff branch1..branch2 to compare branches.',
      'Use git diff --word-diff for inline word-level diffs.',
    ],
  },

  'git-reset': {
    useCases: [
      'Unstage files from the index without losing changes (--mixed)',
      'Undo the last commit while keeping changes in the working tree (--soft)',
      'Completely discard commits and changes (--hard)',
    ],
    internals:
      'git reset moves the HEAD ref (and current branch pointer) to a specified commit. --soft only moves the ref, --mixed (default) also resets the index, and --hard resets both the index and working tree. It operates on refs, not on individual files (git reset -- file only resets the index for that file).',
    mistakes: [
      'Using --hard and losing uncommitted work -- --hard is destructive and discards working tree changes irreversibly. Use --soft or --mixed to preserve changes.',
      'Resetting shared branch history -- resetting and force-pushing rewrites history for collaborators. Use git revert instead for public branches.',
      'Confusing reset with revert -- reset rewrites history, revert creates a new commit that undoes a change. Use revert on shared branches.',
    ],
    bestPractices: [
      'Use git reset --soft HEAD~1 to undo the last commit but keep changes staged.',
      'Use git reset HEAD -- file to unstage a specific file.',
      'Prefer git revert over git reset for undoing changes on shared branches.',
      'Check git reflog to recover from accidental resets.',
    ],
  },

  'git-submodule': {
    useCases: [
      'Include external repositories as dependencies inside your project',
      'Pin a specific version of a library or shared component',
      'Manage multi-repo projects where components evolve independently',
    ],
    internals:
      'Submodules are tracked via a .gitmodules file (URL and path) and a special tree entry (gitlink) that records the pinned commit SHA of each submodule. The submodule content lives in its own .git directory (or is absorbed into .git/modules/).',
    mistakes: [
      'Cloning a repo and forgetting --recurse-submodules -- submodule directories will be empty. Run git submodule update --init --recursive after cloning.',
      'Not committing submodule pointer updates -- after updating a submodule, the parent repo sees a dirty gitlink. You must commit this change in the parent.',
      'Getting into detached HEAD inside submodules -- submodules check out a specific commit, not a branch. cd into the submodule and checkout a branch before making changes.',
    ],
    bestPractices: [
      'Clone with --recurse-submodules to initialize submodules automatically.',
      'Use git submodule update --remote to pull the latest commits from submodule remotes.',
      'Consider alternatives like git subtree or package managers if submodule complexity is too high.',
    ],
  },

  'git-worktree': {
    useCases: [
      'Work on multiple branches simultaneously without stashing or switching',
      'Run a long build on one branch while developing on another',
      'Review a pull request in a separate directory while keeping your work intact',
    ],
    internals:
      'git worktree creates additional working directories that share the same .git repository. Each worktree has its own HEAD and index but shares the object store and refs. Worktree metadata is stored in .git/worktrees/.',
    mistakes: [
      'Checking out the same branch in multiple worktrees -- Git prevents this to avoid confusion. Use a different branch for each worktree.',
      'Forgetting to remove worktrees -- old worktrees consume disk space and lock branches. Use git worktree remove or git worktree prune.',
    ],
    bestPractices: [
      'Use git worktree add ../project-hotfix hotfix-branch for isolated work on a hotfix.',
      'Remove worktrees when done: git worktree remove <path>.',
      'Use git worktree list to see all active worktrees.',
    ],
  },

  'git-blame': {
    useCases: [
      'Find who last modified each line of a file and when',
      'Track down the commit that introduced a specific line of code',
      'Understand the history and rationale behind code changes',
    ],
    internals:
      'git blame walks through the commit history, performing diff analysis to attribute each line in the current version to the commit that last modified it. It uses a copy/rename detection algorithm to follow lines across file renames with -C.',
    mistakes: [
      'Blaming a formatting commit instead of the original author -- large reformatting commits obscure the real history. Use git blame -w to ignore whitespace changes, or --ignore-rev to skip specific commits.',
      'Not using -C to follow code moved between files -- without -C, blame stops at the file where code was pasted, not where it originated.',
    ],
    bestPractices: [
      'Use git blame -w to ignore whitespace-only changes.',
      'Create a .git-blame-ignore-revs file for formatting commits and configure git config blame.ignoreRevsFile.',
      'Use git log -p -S "code string" (pickaxe) as a complement to blame for finding when code was added or removed.',
    ],
  },

  // ─── CONTAINERS (15) ──────────────────────────────────────────────

  docker: {
    useCases: [
      'Run applications in isolated, reproducible containers',
      'Package applications with all dependencies for consistent deployment',
      'Create development environments that match production',
    ],
    internals:
      'Docker uses Linux namespaces (PID, NET, MNT, UTS, IPC, USER) for isolation and cgroups for resource limits. Images are layered filesystems using a union mount (overlay2). The Docker daemon (dockerd) manages containers via containerd and runc.',
    mistakes: [
      'Running containers as root inside and outside -- the default root user in containers maps to root on the host (unless user namespaces are enabled). Use USER in Dockerfile or --user flag.',
      'Not cleaning up old containers and images -- disk usage grows quickly. Run docker system prune regularly.',
      'Using latest tag in production -- the latest tag is mutable and unpredictable. Pin specific image versions.',
    ],
    bestPractices: [
      'Use specific image tags (e.g., node:20-alpine) instead of :latest.',
      'Run containers with a non-root user for security.',
      'Use multi-stage builds to minimize final image size.',
      'Use docker system prune periodically to reclaim disk space.',
    ],
  },

  'docker-compose': {
    useCases: [
      'Define and run multi-container applications with a single config file',
      'Set up development environments with databases, caches, and services',
      'Orchestrate container dependencies, networking, and volumes declaratively',
    ],
    internals:
      'Docker Compose reads a YAML file (compose.yaml) and translates it into Docker API calls. It creates a dedicated network for the project, starts containers in dependency order, and manages their lifecycle. Services are resolved by name via Docker embedded DNS.',
    mistakes: [
      'Not using depends_on with healthchecks -- depends_on only waits for the container to start, not for the service to be ready. Add healthcheck conditions.',
      'Storing secrets in the compose file -- environment variables in YAML are visible in docker inspect. Use Docker secrets or .env files excluded from version control.',
      'Using docker-compose (v1) instead of docker compose (v2) -- v1 is deprecated. Use the docker compose plugin syntax.',
    ],
    bestPractices: [
      'Use docker compose (v2 plugin syntax) instead of the deprecated docker-compose binary.',
      'Define healthchecks for services that other services depend on.',
      'Use named volumes for persistent data and bind mounts for development code.',
      'Use profiles to define optional services (e.g., debug tools, monitoring).',
    ],
  },

  'docker-image': {
    useCases: [
      'List, inspect, and manage locally stored Docker images',
      'Remove unused images to reclaim disk space',
      'Tag images for pushing to registries',
    ],
    internals:
      'Docker images are stored as layers in the local image store (typically /var/lib/docker/overlay2). Each layer is a filesystem diff. docker image ls reads the image metadata index. Dangling images are layers not referenced by any tagged image.',
    mistakes: [
      'Not removing dangling images -- builds create untagged intermediate images. Use docker image prune to remove them.',
      'Confusing image ID with tag -- multiple tags can point to the same image ID. Removing a tag does not delete the image if other tags reference it.',
    ],
    bestPractices: [
      'Use docker image prune to clean up dangling images.',
      'Use docker image ls --format to customize output for scripting.',
      'Inspect image layers with docker image history to find size bottlenecks.',
    ],
  },

  'docker-exec': {
    useCases: [
      'Run a command inside a running container for debugging',
      'Open an interactive shell in a container',
      'Execute one-off maintenance tasks in a running service',
    ],
    internals:
      'docker exec uses the nsenter mechanism to join the namespaces (PID, NET, MNT, etc.) of an existing container process. It creates a new process inside the container without starting a new container.',
    mistakes: [
      'Forgetting -it for interactive use -- without -i (stdin) and -t (tty), you get no interactive shell. Use docker exec -it container bash.',
      'Making changes via exec that should be in the Dockerfile -- any changes made via exec are lost when the container is recreated. Modify the Dockerfile instead.',
    ],
    bestPractices: [
      'Use docker exec -it <container> sh (or bash) for interactive debugging.',
      'Use docker exec for one-off tasks, not for persistent configuration.',
      'Specify --user to run as a specific user inside the container.',
    ],
  },

  'docker-logs': {
    useCases: [
      'View stdout/stderr output from a running or stopped container',
      'Tail container logs in real time for debugging',
      'Check application startup errors in containers',
    ],
    internals:
      'Docker captures stdout and stderr of the container PID 1 process and stores them via the configured logging driver (default: json-file in /var/lib/docker/containers/). docker logs reads these stored logs. Stream mode (--follow) uses inotify or polling.',
    mistakes: [
      'Application logging to files instead of stdout -- Docker only captures stdout/stderr. Applications should log to stdout for docker logs to work.',
      'Logs growing unbounded -- the json-file driver has no default size limit. Configure max-size and max-file in daemon.json or per-container.',
    ],
    bestPractices: [
      'Use docker logs -f --tail 100 to follow recent logs without overwhelming output.',
      'Use docker logs --since 1h to view only recent logs.',
      'Configure log rotation: --log-opt max-size=10m --log-opt max-file=3.',
    ],
  },

  'docker-network': {
    useCases: [
      'Create isolated networks for container-to-container communication',
      'Connect containers across different compose projects',
      'Debug network connectivity issues between containers',
    ],
    internals:
      'Docker networking uses Linux bridge devices (docker0 for the default bridge), veth pairs connecting each container to the bridge, and iptables rules for NAT and port forwarding. User-defined bridge networks add embedded DNS for container name resolution.',
    mistakes: [
      'Using the default bridge network -- the default bridge does not provide DNS resolution between containers. Always create user-defined networks.',
      'Exposing ports unnecessarily -- publishing ports (-p) exposes them to the host and possibly the internet. Only publish ports that external clients need.',
    ],
    bestPractices: [
      'Create custom bridge networks: docker network create mynet for DNS-based service discovery.',
      'Use docker network inspect to debug connectivity and see connected containers.',
      'Use internal networks (--internal) for backend services that should not have external access.',
    ],
  },

  kubectl: {
    useCases: [
      'Manage Kubernetes clusters, deployments, and services from the CLI',
      'Deploy, scale, and debug containerized applications on Kubernetes',
      'Inspect cluster state, view logs, and exec into pods',
    ],
    internals:
      'kubectl communicates with the Kubernetes API server over HTTPS. It reads cluster credentials from ~/.kube/config (or KUBECONFIG). Commands are translated to REST API calls against the API server, which stores state in etcd.',
    mistakes: [
      'Operating on the wrong cluster or namespace -- kubectl uses the current context by default. Always verify with kubectl config current-context and use -n namespace.',
      'Using kubectl apply with delete-then-create semantics -- apply uses strategic merge patch. For full replacements, use kubectl replace. Mixing apply and imperative commands causes annotation drift.',
      'Not using resource limits -- pods without resource requests/limits can starve other workloads or get OOM-killed unpredictably.',
    ],
    bestPractices: [
      'Always specify --namespace or set a default namespace in your context.',
      'Use kubectl apply -f for declarative management with version-controlled YAML.',
      'Use kubectl describe and kubectl logs for debugging pod issues.',
      'Use kubectl get -o wide or -o yaml for detailed resource inspection.',
    ],
  },

  podman: {
    useCases: [
      'Run containers without a daemon and without root privileges',
      'Replace Docker with a daemonless, rootless container runtime',
      'Manage pods (groups of containers) natively for Kubernetes compatibility',
    ],
    internals:
      'Podman uses the same OCI runtime (runc/crun) and image format as Docker but has no central daemon. Each container runs as a direct child process. Rootless mode uses user namespaces to map container root to an unprivileged host user.',
    mistakes: [
      'Assuming Docker Compose works directly -- use podman-compose or podman compose (with the compose plugin) instead of docker-compose.',
      'Permission issues in rootless mode -- rootless containers cannot bind to ports below 1024 by default. Use sysctl or port mapping above 1024.',
    ],
    bestPractices: [
      'Use podman as a drop-in replacement for docker: alias docker=podman.',
      'Use podman generate kube to export running containers as Kubernetes YAML.',
      'Use podman play kube to run Kubernetes pod YAML locally.',
      'Prefer rootless mode for development to improve security posture.',
    ],
  },

  'docker-volume': {
    useCases: [
      'Persist container data beyond container lifecycle',
      'Share data between containers',
      'Manage database storage and other stateful workloads',
    ],
    internals:
      'Docker volumes are stored in /var/lib/docker/volumes/ on the host. They are managed by the Docker daemon and are separate from the container filesystem. Named volumes persist until explicitly removed. Volume drivers can back volumes with network storage.',
    mistakes: [
      'Using bind mounts for production data -- bind mounts depend on host filesystem layout. Use named volumes for portability and Docker management.',
      'Forgetting that anonymous volumes are hard to manage -- containers started without named volumes create anonymous volumes that clutter the system. Use named volumes.',
    ],
    bestPractices: [
      'Use named volumes for persistent data: docker volume create mydata.',
      'Use docker volume prune to clean up unused volumes.',
      'Use docker volume inspect to find the mount point on the host.',
    ],
  },

  'docker-build': {
    useCases: [
      'Build Docker images from a Dockerfile',
      'Create optimized production images with multi-stage builds',
      'Build images with build arguments and custom contexts',
    ],
    internals:
      'Docker build sends the build context (directory contents) to the daemon, then executes each Dockerfile instruction as a step. Each step creates a new layer. BuildKit (default in newer versions) adds parallel stage execution, cache mounts, and secret mounts.',
    mistakes: [
      'Large build contexts -- Docker sends the entire build context to the daemon. Use .dockerignore to exclude node_modules, .git, and other large directories.',
      'Busting the layer cache unnecessarily -- COPY . . early in the Dockerfile invalidates cache for all subsequent layers on any file change. Copy dependency files first, install, then copy the rest.',
    ],
    bestPractices: [
      'Use multi-stage builds to keep final images small.',
      'Order Dockerfile instructions from least to most frequently changing for cache efficiency.',
      'Use .dockerignore to exclude unnecessary files from the build context.',
      'Use BuildKit cache mounts (--mount=type=cache) for package manager caches.',
    ],
  },

  'docker-tag': {
    useCases: [
      'Add a registry-qualified name to a local image before pushing',
      'Create version tags for release images',
      'Alias an image under multiple names',
    ],
    internals:
      'docker tag creates a new reference (name:tag) pointing to an existing image ID. No data is copied -- it is purely a metadata operation. The full tag format is registry/repository:tag.',
    mistakes: [
      'Overwriting a tag with a different image -- tags are mutable. Pushing a new image with an existing tag silently replaces it. Use unique tags (e.g., git SHA or semver).',
      'Using only latest as a tag -- latest is not special; it is just the default when no tag is specified. Always push explicit version tags.',
    ],
    bestPractices: [
      'Tag with semantic versions: docker tag app:latest registry/app:1.2.3.',
      'Also tag with the git commit SHA for traceability.',
      'Use both a version tag and latest for convenience: push both.',
    ],
  },

  'docker-push': {
    useCases: [
      'Upload local images to a container registry',
      'Publish application images for deployment',
      'Share images with team members or CI/CD pipelines',
    ],
    internals:
      'docker push uploads image layers to a registry via the Docker Registry HTTP API v2. Only layers not already present in the registry are uploaded (deduplication). Authentication is handled via docker login tokens stored in ~/.docker/config.json.',
    mistakes: [
      'Pushing without logging in -- docker push fails with auth errors if you have not run docker login first.',
      'Pushing large images -- unoptimized images with unnecessary layers waste bandwidth and storage. Minimize image size before pushing.',
    ],
    bestPractices: [
      'Log in to your registry before pushing: docker login registry.example.com.',
      'Push both a version tag and latest for each release.',
      'Use CI/CD pipelines to automate building, tagging, and pushing images.',
    ],
  },

  'docker-prune': {
    useCases: [
      'Reclaim disk space by removing unused Docker objects',
      'Clean up dangling images, stopped containers, and unused networks',
      'Reset a cluttered Docker environment',
    ],
    internals:
      'docker system prune removes stopped containers, dangling images, unused networks, and optionally build cache. Each resource type also has its own prune command. Prune uses reference counting to determine what is unused.',
    mistakes: [
      'Using docker system prune -a without understanding the impact -- -a removes ALL unused images, not just dangling ones. This includes base images you may need, requiring re-download.',
      'Running prune in production without checking -- prune removes stopped containers that might have useful logs or state. Inspect before pruning.',
    ],
    bestPractices: [
      'Use docker system prune regularly in development environments.',
      'Use docker system prune --filter "until=24h" to only remove objects older than 24 hours.',
      'Run docker system df first to see disk usage before pruning.',
    ],
  },

  'docker-inspect': {
    useCases: [
      'View detailed configuration and state of containers, images, or networks',
      'Debug container networking, mounts, and environment variables',
      'Extract specific metadata with Go template formatting',
    ],
    internals:
      'docker inspect queries the Docker daemon for the full JSON representation of an object. This includes configuration, state, network settings, mount points, and more. Go templates can extract specific fields.',
    mistakes: [
      'Getting overwhelmed by the full JSON output -- use --format with Go templates to extract specific fields.',
      'Inspecting the wrong object type -- docker inspect auto-detects type, but ambiguous names may match the wrong object. Use docker container inspect or docker image inspect explicitly.',
    ],
    bestPractices: [
      'Use --format to extract specific fields: docker inspect --format "{{.NetworkSettings.IPAddress}}" container.',
      'Use docker inspect on networks to see connected containers and their IPs.',
      'Pipe output to jq for complex queries: docker inspect container | jq .[0].Config.Env.',
    ],
  },

  helm: {
    useCases: [
      'Package, version, and deploy Kubernetes applications as charts',
      'Manage application releases with upgrade, rollback, and history',
      'Template Kubernetes manifests with configurable values',
    ],
    internals:
      'Helm renders Go templates in chart templates/ using values from values.yaml and overrides. The rendered manifests are applied to the cluster via the Kubernetes API. Release metadata is stored as Secrets or ConfigMaps in the target namespace.',
    mistakes: [
      'Not pinning chart versions -- helm install without --version uses the latest chart version, which may introduce breaking changes.',
      'Overriding values incorrectly -- YAML indentation errors in --set or -f files silently produce wrong configurations. Use helm template to preview rendered manifests.',
      'Not understanding release state -- failed releases can block future installs. Use helm list -a to see all releases including failed ones.',
    ],
    bestPractices: [
      'Always pin chart versions in CI/CD: helm install --version 1.2.3.',
      'Use helm template to preview rendered manifests before installing.',
      'Use helm diff (plugin) to preview changes before helm upgrade.',
      'Store chart values in version-controlled files rather than inline --set flags.',
    ],
  },

  // ─── SCRIPTING (15) ───────────────────────────────────────────────

  'bash-shebang': {
    useCases: [
      'Specify the interpreter for a script to ensure it runs with the correct shell',
      'Make scripts executable and self-describing',
      'Choose between bash, sh, or other interpreters for portability',
    ],
    internals:
      'The kernel reads the first two bytes of an executed file. If they are #!, it parses the rest of the line as the interpreter path (and optional argument). The kernel then executes that interpreter with the script path as an argument.',
    mistakes: [
      'Using #!/bin/bash when #!/usr/bin/env bash is more portable -- bash may not be at /bin/bash on all systems (e.g., NixOS, FreeBSD). env searches PATH.',
      'Writing bash-specific syntax with a #!/bin/sh shebang -- sh may be dash or another minimal shell that lacks bash features like arrays and [[ ]].',
      'Forgetting to chmod +x the script -- the shebang is only used when the file is executed directly, which requires the execute permission.',
    ],
    bestPractices: [
      'Use #!/usr/bin/env bash for portability.',
      'Use #!/bin/sh only if the script uses strictly POSIX shell syntax.',
      'Always make scripts executable: chmod +x script.sh.',
      'Add set -euo pipefail after the shebang for safety.',
    ],
  },

  'bash-variables': {
    useCases: [
      'Store and reuse values like file paths, counters, and configuration',
      'Pass data between commands and functions in scripts',
      'Use special variables ($?, $#, $@, $$) for script control flow',
    ],
    internals:
      'Bash variables are untyped strings stored in the shell process memory. Declare can add types (integer, array, readonly). Variable expansion occurs during word expansion, after brace expansion but before field splitting and glob expansion.',
    mistakes: [
      'Not quoting variables -- unquoted variables undergo word splitting and glob expansion. "$var" is almost always correct; $var is almost always a bug.',
      'Using spaces around = in assignment -- var = value is parsed as a command named var with arguments = and value. Use var=value with no spaces.',
      'Expecting variables to persist across subshells -- pipeline components and commands in $() run in subshells. Variables set there do not affect the parent.',
    ],
    bestPractices: [
      'Always double-quote variable expansions: "$variable".',
      'Use ${variable} for clarity in string concatenation: "${prefix}_suffix".',
      'Use readonly for constants: readonly CONFIG_DIR="/etc/myapp".',
      'Use declare -i for integer variables to enable arithmetic assignment.',
    ],
  },

  'bash-if': {
    useCases: [
      'Branch script execution based on conditions (file existence, string comparison, exit codes)',
      'Handle error cases and provide fallback behavior',
      'Validate input before processing in scripts',
    ],
    internals:
      'The if construct evaluates the exit code of the command after if. An exit code of 0 means true (then branch), non-zero means false (elif/else branch). [, [[, and test are commands that evaluate conditional expressions and return appropriate exit codes.',
    mistakes: [
      'Using single brackets without quoting -- [ $var = "x" ] breaks if $var is empty or contains spaces. Use [[ $var = "x" ]] or quote: [ "$var" = "x" ].',
      'Confusing = and == and -eq -- = and == are for strings (in [[ ]]). -eq is for integers. Using = for integer comparison does string comparison.',
      'Forgetting the space before ] -- [test] is parsed as a command named [test]. Use [ test ] with spaces.',
    ],
    bestPractices: [
      'Prefer [[ ]] over [ ] in bash for safer syntax with &&, ||, pattern matching, and no word splitting.',
      'Use if command; then for checking exit codes directly rather than if [ $? -eq 0 ].',
      'Use -f, -d, -r, -w, -x for file tests: if [[ -f "$file" ]]; then.',
    ],
  },

  'bash-for': {
    useCases: [
      'Iterate over lists of files, arguments, or generated sequences',
      'Process each line of a command output',
      'Perform C-style counted loops with arithmetic',
    ],
    internals:
      'The for-in loop iterates over a word list produced by shell expansion. The C-style for (( )) loop uses arithmetic evaluation. In both cases, the loop body runs in the current shell, so variable changes persist.',
    mistakes: [
      'Iterating over command output without proper quoting -- for f in $(ls) breaks on filenames with spaces. Use for f in ./* or while IFS= read -r for line-by-line processing.',
      'Using for to read lines from a file -- for reads words, not lines. Use while IFS= read -r line instead.',
      'Forgetting the do and done keywords -- syntax errors from missing do or done are common. Match every for with do...done.',
    ],
    bestPractices: [
      'Use for f in ./*.txt to iterate over files (glob-based, handles spaces correctly).',
      'Use for (( i=0; i<n; i++ )) for counted loops.',
      'Use for arg in "$@" to iterate over script arguments (quotes preserve arguments with spaces).',
    ],
  },

  'bash-while': {
    useCases: [
      'Read files or command output line by line',
      'Implement retry loops that wait for a condition to become true',
      'Run polling loops or event processing loops',
    ],
    internals:
      'while evaluates the exit code of its condition command. If 0 (true), it executes the body and loops. The condition is re-evaluated each iteration. while true creates an infinite loop. The loop runs in the current shell unless it is part of a pipeline.',
    mistakes: [
      'Using while read in a pipeline -- pipeline components run in subshells, so variables set inside are lost. Use while read ... done < <(command) with process substitution.',
      'Infinite loops without a sleep or exit condition -- these consume 100% CPU. Always include a sleep for polling or a break condition.',
      'Forgetting -r with read -- without -r, backslashes in input are treated as escape characters. Always use while IFS= read -r line.',
    ],
    bestPractices: [
      'Use while IFS= read -r line; do ... done < file as the idiomatic pattern for reading files line by line.',
      'Use process substitution for command output: while read -r line; do ...; done < <(command).',
      'Include a break or timeout condition in polling loops to avoid infinite hangs.',
    ],
  },

  'bash-functions': {
    useCases: [
      'Encapsulate reusable logic in shell scripts',
      'Organize complex scripts into manageable units',
      'Create script-local commands with parameters and return values',
    ],
    internals:
      'Bash functions are stored in shell memory and execute in the current shell (not a subshell). They have access to all global variables and can modify them. Arguments are accessed via $1, $2, etc. The return statement sets the exit code (0-255), not a value.',
    mistakes: [
      'Using return to return a string -- return only sets the exit code (0-255). To return data, echo the result and capture with $(): result=$(my_function).',
      'Polluting the global namespace -- all variables in functions are global by default. Use local to declare function-local variables.',
      'Not handling arguments correctly -- $@ inside a function refers to function arguments, not script arguments. Pass script args explicitly.',
    ],
    bestPractices: [
      'Declare all function variables with local to prevent namespace pollution.',
      'Use echo for output and capture with command substitution: result=$(func).',
      'Check argument count at the start: [[ $# -lt 1 ]] && { echo "Usage: ..."; return 1; }.',
      'Define functions before they are called (bash reads scripts sequentially).',
    ],
  },

  'bash-arrays': {
    useCases: [
      'Store and manipulate lists of items (filenames, arguments, options)',
      'Build command arguments dynamically',
      'Process collections of related values in scripts',
    ],
    internals:
      'Bash supports indexed arrays (integer keys) and associative arrays (string keys, declare -A). Arrays are stored in shell memory. Array expansion "${arr[@]}" produces separate words for each element, preserving elements with spaces.',
    mistakes: [
      'Not quoting array expansions -- ${arr[@]} without quotes undergoes word splitting. Always use "${arr[@]}" to preserve element boundaries.',
      'Confusing ${arr[*]} and ${arr[@]} -- * joins all elements into a single string (with IFS), @ keeps them separate. Use @ for iteration.',
      'Trying to pass arrays to functions -- bash cannot pass arrays directly. Pass "${arr[@]}" and receive as args, or pass the array name and use nameref (declare -n).',
    ],
    bestPractices: [
      'Always quote array expansions: "${array[@]}".',
      'Use declare -A for associative arrays (bash 4+).',
      'Use array+=("element") to append to an array.',
      'Use ${#array[@]} to get the array length.',
    ],
  },

  'bash-case': {
    useCases: [
      'Match a variable against multiple patterns as an alternative to if-elif chains',
      'Parse command-line options and subcommands in scripts',
      'Handle multiple file types or modes with pattern matching',
    ],
    internals:
      'case performs pattern matching (glob patterns, not regex) against the given word. It tries each pattern in order and executes the commands for the first match. ;; terminates a clause, ;;& falls through to the next pattern test, ;& falls through unconditionally.',
    mistakes: [
      'Forgetting the double semicolons ;; -- each case clause must end with ;;. Missing it causes syntax errors.',
      'Not including a default case -- without a *) default handler, unmatched inputs silently do nothing. Add a *) clause for error handling.',
      'Using regex instead of globs -- case uses glob patterns (*, ?, [...]). For regex matching, use [[ =~ ]] instead.',
    ],
    bestPractices: [
      'Always include a *) default case for handling unexpected input.',
      'Use | for OR patterns: case $opt in -h|--help) ... ;;.',
      'Use case for parsing CLI options and subcommands for clarity.',
    ],
  },

  'bash-redirect': {
    useCases: [
      'Send command output to files or discard it',
      'Separate stdout and stderr into different destinations',
      'Feed file contents as input to commands',
    ],
    internals:
      'Shell redirections manipulate file descriptors via dup2 syscalls before exec. > truncates and writes to fd 1 (stdout), 2> redirects fd 2 (stderr), >> appends, < reads from fd 0 (stdin). &> redirects both stdout and stderr. Here-documents (<<) create temporary files or pipes.',
    mistakes: [
      'Using 2>&1 > file instead of > file 2>&1 -- redirections are processed left to right. 2>&1 > file sends stderr to the original stdout (terminal), not the file. Reverse the order.',
      'Using > when >> was intended -- > truncates the file first. Use >> to append.',
      'Redirecting in a pipeline instead of at the end -- cmd > file | other captures output in file, not in the pipeline. Place redirections carefully.',
    ],
    bestPractices: [
      'Use > file 2>&1 or &> file to redirect both stdout and stderr to a file.',
      'Use 2>/dev/null to discard error messages.',
      'Use tee to write to a file while still seeing output: cmd | tee output.log.',
      'Use <<EOF heredocs for multi-line input to commands.',
    ],
  },

  'bash-pipe': {
    useCases: [
      'Chain commands together by connecting stdout to stdin',
      'Build data processing pipelines with filters and transformations',
      'Compose simple tools into complex operations (Unix philosophy)',
    ],
    internals:
      'The shell creates a pipe(2) (a kernel buffer) between each pair of commands. Each command in the pipeline runs as a separate process in its own subshell. Data flows through the kernel pipe buffer (typically 64KB on Linux). The pipeline exit code is the last command by default (or any failure with pipefail).',
    mistakes: [
      'Expecting variables set in a pipeline to persist -- each pipeline component runs in a subshell. Variables set inside do not affect the parent. Use process substitution instead.',
      'Not using set -o pipefail -- without it, cmd_that_fails | sort returns the exit code of sort (0), hiding the failure. Always enable pipefail.',
    ],
    bestPractices: [
      'Enable set -o pipefail in scripts to catch failures in any pipeline stage.',
      'Use PIPESTATUS array to check individual exit codes: ${PIPESTATUS[0]}.',
      'Avoid unnecessary use of cat: instead of cat file | grep x, use grep x file.',
    ],
  },

  'bash-trap': {
    useCases: [
      'Clean up temporary files or processes when a script exits',
      'Handle SIGINT (Ctrl+C) gracefully in interactive scripts',
      'Log or report errors using the ERR pseudo-signal',
    ],
    internals:
      'trap registers a handler string for specified signals or pseudo-signals. EXIT fires on any exit. ERR fires on any command failure (when set -e is active). DEBUG fires before every command. RETURN fires when a function or sourced file returns.',
    mistakes: [
      'Single-quoting vs double-quoting the trap command at the wrong time -- single quotes delay expansion to execution time (usually desired). Double quotes expand variables at definition time, which may capture stale values.',
      'Trapping only EXIT and missing SIGTERM -- some process managers send SIGTERM before SIGKILL. Trap SIGTERM explicitly if cleanup is critical.',
    ],
    bestPractices: [
      'Use trap cleanup EXIT as the primary cleanup mechanism.',
      'Use single quotes for trap commands to defer variable expansion: trap \'rm -f "$tmpfile"\' EXIT.',
      'Trap multiple signals: trap cleanup EXIT SIGINT SIGTERM.',
    ],
  },

  'bash-getopts': {
    useCases: [
      'Parse short command-line options (-v, -f filename) in shell scripts',
      'Build scripts with standardized Unix-style option handling',
      'Validate and process command-line arguments systematically',
    ],
    internals:
      'getopts is a shell built-in that processes positional parameters one option at a time. It uses OPTIND to track position and OPTARG for option arguments. It handles combined flags (-abc) and options with arguments (-f value). It only supports short options.',
    mistakes: [
      'Not resetting OPTIND when calling getopts again -- OPTIND retains its value between calls. Reset it to 1 if parsing a second set of arguments.',
      'Confusing getopts with getopt -- getopts is the bash built-in (short options only). getopt is an external command that supports long options but has portability issues.',
      'Forgetting the leading colon for silent error handling -- without a leading : in the option string, getopts prints its own error messages. Use ":vf:" for custom error handling.',
    ],
    bestPractices: [
      'Use a leading colon in the option string for custom error handling: getopts ":vf:" opt.',
      'Handle the ? and : cases for unknown options and missing arguments.',
      'Shift after getopts: shift $((OPTIND - 1)) to access remaining non-option arguments.',
    ],
  },

  'bash-subshell': {
    useCases: [
      'Isolate environment changes (cd, variable assignments) from the parent shell',
      'Run a group of commands in a separate context with ( ... )',
      'Capture command output with $( ... ) command substitution',
    ],
    internals:
      'A subshell is a child process created by fork(). It inherits a copy of all variables, file descriptors, and options from the parent. Changes in the subshell (variable assignments, cd) do not affect the parent. ( ) forces a subshell; $( ) creates one for capture.',
    mistakes: [
      'Expecting subshell changes to affect the parent -- variables set in ( ), $( ), or pipeline components do not propagate back. Redesign to avoid this, or use process substitution.',
      'Creating unnecessary subshells -- $( ) and ( ) create processes. Use { } for grouping commands in the current shell if isolation is not needed.',
    ],
    bestPractices: [
      'Use ( cd /tmp && command ) to temporarily change directory without affecting the parent.',
      'Use { } instead of ( ) when you do not need subshell isolation, to avoid fork overhead.',
      'Use $( ) for command substitution instead of backticks for readability and nesting support.',
    ],
  },

  'bash-regex': {
    useCases: [
      'Match strings against patterns within [[ =~ ]] conditionals',
      'Extract captured groups from strings using BASH_REMATCH',
      'Validate input formats (emails, dates, versions) in scripts',
    ],
    internals:
      'The =~ operator in [[ ]] performs POSIX Extended Regular Expression matching. The regex must not be quoted (quoting makes it a literal string). Captured groups are stored in the BASH_REMATCH array: [0] is the full match, [1]+ are capture groups.',
    mistakes: [
      'Quoting the regex pattern -- [[ $str =~ "^[0-9]+" ]] matches the literal string ^[0-9]+. Do not quote the regex: [[ $str =~ ^[0-9]+ ]].',
      'Not checking BASH_REMATCH -- after a successful match, capture groups are in BASH_REMATCH. Forgetting to use them misses the point of regex matching.',
      'Using regex when a glob would suffice -- for simple pattern matching, [[ $str == *.txt ]] (glob) is simpler and more readable than regex.',
    ],
    bestPractices: [
      'Store complex patterns in a variable: pattern="^v([0-9]+)\\.([0-9]+)"; [[ $v =~ $pattern ]].',
      'Access capture groups via ${BASH_REMATCH[1]}, ${BASH_REMATCH[2]}, etc.',
      'Use globs for simple matching and regex only when you need capture groups or complex patterns.',
    ],
  },

  'bash-debug': {
    useCases: [
      'Trace script execution to find where failures occur',
      'Print each command and its arguments as they execute',
      'Debug complex variable expansion and conditional logic',
    ],
    internals:
      'set -x enables xtrace, which prints each command to stderr (prefixed by PS4) after expansion but before execution. bash -x script.sh enables it for the entire script. set -v prints lines before expansion. trap with DEBUG fires before every command.',
    mistakes: [
      'Leaving set -x on in production scripts -- xtrace output can leak sensitive data (passwords, tokens) to logs. Remove or guard it behind a debug flag.',
      'Not using PS4 to add context -- the default PS4 is "+". Set PS4="+ ${BASH_SOURCE}:${LINENO}: " to include the file and line number in trace output.',
    ],
    bestPractices: [
      'Use set -x selectively around problematic sections, not the entire script.',
      'Set PS4="+ \\${BASH_SOURCE}:\\${LINENO}: " for informative trace output with file and line numbers.',
      'Use bash -x script.sh for debugging without modifying the script.',
      'Use shellcheck to catch bugs statically before runtime debugging.',
    ],
  },

  // ─── DEVELOPER TOOLS (16) ─────────────────────────────────────────

  make: {
    useCases: [
      'Automate build processes for C/C++ and other compiled projects',
      'Define task runners for any project using Makefile targets',
      'Rebuild only changed files based on dependency tracking',
    ],
    internals:
      'make reads a Makefile containing targets, prerequisites, and recipes. It builds a dependency DAG, checks file modification times to determine what is out of date, and executes the minimum set of recipes to bring targets up to date. Each recipe line runs in a separate shell.',
    mistakes: [
      'Using spaces instead of tabs for recipe indentation -- make requires tabs, not spaces, for recipe lines. This is a common source of "missing separator" errors.',
      'Not declaring .PHONY targets -- targets like clean that do not produce files should be declared .PHONY. Otherwise, if a file named clean exists, the target is skipped.',
      'Assuming variables persist across recipe lines -- each line runs in a separate shell. Use backslash continuation or .ONESHELL for multi-line recipes.',
    ],
    bestPractices: [
      'Declare .PHONY for non-file targets: .PHONY: clean test build.',
      'Use variables for compiler flags: CFLAGS = -Wall -O2.',
      'Use make -j$(nproc) for parallel builds.',
      'Use make -n (dry run) to preview what will be executed.',
    ],
  },

  gcc: {
    useCases: [
      'Compile C and C++ source code into executables or object files',
      'Generate optimized binaries for production deployment',
      'Compile with debug symbols for use with gdb and valgrind',
    ],
    internals:
      'gcc orchestrates four stages: preprocessing (cpp), compilation (cc1 to assembly), assembly (as to object files), and linking (ld). Each stage can be run separately with -E, -S, -c. The optimizer operates on intermediate representations (GIMPLE, RTL) between compilation stages.',
    mistakes: [
      'Not enabling warnings -- gcc with no flags compiles silently even with bugs. Always use -Wall -Wextra at minimum.',
      'Debugging optimized code -- optimizations reorder and eliminate code, making debugging unreliable. Use -O0 -g for debug builds.',
      'Forgetting to link math library -- functions from math.h require -lm: gcc prog.c -lm.',
    ],
    bestPractices: [
      'Use -Wall -Wextra -Werror during development for maximum error detection.',
      'Use -g for debug builds (with gdb/valgrind) and -O2 for release builds.',
      'Use -fsanitize=address,undefined for runtime error detection during testing.',
      'Use -std=c11 or -std=c17 to specify the C standard explicitly.',
    ],
  },

  node: {
    useCases: [
      'Run JavaScript and TypeScript applications on the server',
      'Execute scripts and CLI tools written in JavaScript',
      'Use the Node.js REPL for quick JavaScript experiments',
    ],
    internals:
      'Node.js embeds the V8 JavaScript engine and provides asynchronous I/O via libuv, which uses an event loop backed by epoll/kqueue/IOCP. Single-threaded for JS execution but uses a thread pool for blocking operations (DNS, filesystem). Modules are resolved via the node_modules algorithm.',
    mistakes: [
      'Blocking the event loop with synchronous operations -- CPU-intensive tasks block all other operations. Use worker_threads or offload to external processes.',
      'Not handling promise rejections -- unhandled rejections crash the process in modern Node.js. Always .catch() or use try/catch with async/await.',
      'Using deprecated callbacks instead of promises -- most Node.js APIs now support promises via fs/promises, etc.',
    ],
    bestPractices: [
      'Use async/await with try/catch for clean asynchronous code.',
      'Use the --watch flag (Node 18+) for auto-restart during development.',
      'Set engines in package.json to enforce minimum Node.js version.',
      'Use ESM (import/export) over CommonJS (require) for new projects.',
    ],
  },

  python3: {
    useCases: [
      'Run Python scripts and applications',
      'Use the interactive Python REPL for quick experiments and data exploration',
      'Execute one-liners from the command line with python3 -c',
    ],
    internals:
      'CPython compiles source to bytecode (.pyc files cached in __pycache__), then executes it on a stack-based virtual machine. The GIL (Global Interpreter Lock) serializes thread execution. Module resolution searches sys.path in order.',
    mistakes: [
      'Using python instead of python3 -- on many systems python points to Python 2 (or does not exist). Always use python3 explicitly.',
      'Installing packages globally with pip -- global installs cause version conflicts. Use virtual environments: python3 -m venv .venv.',
      'Mutating default mutable arguments -- def f(lst=[]): appends persist across calls. Use None as default and create inside.',
    ],
    bestPractices: [
      'Always use virtual environments: python3 -m venv .venv && source .venv/bin/activate.',
      'Use python3 -m pip instead of pip directly to ensure the correct Python version.',
      'Use python3 -m module_name to run modules as scripts (avoids PATH issues).',
      'Pin dependencies in requirements.txt or pyproject.toml.',
    ],
  },

  gdb: {
    useCases: [
      'Debug compiled C/C++ programs interactively with breakpoints and stepping',
      'Analyze core dumps from crashed programs post-mortem',
      'Inspect memory, variables, and call stacks during execution',
    ],
    internals:
      'gdb uses the ptrace syscall to attach to and control a target process. It reads DWARF debug information (from -g compilation) to map machine addresses to source lines, variable names, and types. Breakpoints are implemented by replacing instructions with INT 3 (on x86).',
    mistakes: [
      'Debugging without -g -- without debug symbols, gdb shows raw memory and addresses instead of variable names and source lines. Compile with gcc -g.',
      'Debugging optimized builds -- compiler optimizations rearrange code and eliminate variables. Use -O0 with -g for reliable debugging.',
      'Not using gdb commands efficiently -- stepping through code manually is slow. Learn conditional breakpoints and watchpoints.',
    ],
    bestPractices: [
      'Compile with -g -O0 for debugging sessions.',
      'Use break, run, next, step, print, and backtrace as core commands.',
      'Use conditional breakpoints: break file.c:42 if x > 100.',
      'Use gdb -tui for a split-screen source view, or use cgdb for a better TUI.',
    ],
  },

  valgrind: {
    useCases: [
      'Detect memory leaks and invalid memory access in C/C++ programs',
      'Find use-after-free, buffer overflows, and uninitialized memory reads',
      'Profile memory usage and cache behavior',
    ],
    internals:
      'Valgrind runs the program on a synthetic CPU that instruments every memory access. The Memcheck tool tracks each byte of memory with validity (V) and addressability (A) bits. This instrumentation makes programs run 10-50x slower but catches errors precisely.',
    mistakes: [
      'Not compiling with -g -- without debug symbols, Valgrind reports errors without file and line information. Always use -g.',
      'Ignoring "possibly lost" reports -- these often indicate real leaks through interior pointers. Investigate them.',
      'Running optimized builds -- inlining and optimization obscure error locations. Use -O0 or -O1 for Valgrind runs.',
    ],
    bestPractices: [
      'Compile with -g -O0 for the most accurate Valgrind output.',
      'Use --leak-check=full --show-leak-kinds=all for thorough leak detection.',
      'Use suppression files to ignore known false positives from system libraries.',
      'Consider AddressSanitizer (-fsanitize=address) for faster checks in CI.',
    ],
  },

  ab: {
    useCases: [
      'Quick HTTP benchmarking of web servers',
      'Measure request throughput and latency under load',
      'Simple load testing for development and staging environments',
    ],
    internals:
      'Apache Bench (ab) creates a configurable number of concurrent HTTP connections and sends requests in a loop. It measures response times and computes statistics (mean, median, percentiles). It uses a single thread with non-blocking I/O.',
    mistakes: [
      'Not including a trailing slash for URLs -- ab may behave unexpectedly with certain URL formats. Always include the full URL path.',
      'Using ab for serious benchmarking -- ab is limited to HTTP/1.0, single-threaded, and lacks advanced features. Use hey, wrk, or k6 for production benchmarking.',
    ],
    bestPractices: [
      'Use ab -n 1000 -c 10 for 1000 requests with 10 concurrent connections.',
      'Use -k for keep-alive connections to test persistent connection performance.',
      'Consider hey or wrk for more accurate and feature-rich benchmarking.',
    ],
  },

  hey: {
    useCases: [
      'Modern HTTP load testing with detailed latency histograms',
      'Benchmark APIs with custom headers, methods, and body payloads',
      'Test server performance under concurrent load',
    ],
    internals:
      'hey is a Go-based HTTP load generator that uses goroutines for concurrency. It supports HTTP/1.1 and HTTP/2, custom request bodies, and outputs detailed latency distribution histograms and percentile data.',
    mistakes: [
      'Not warming up the server -- the first requests include connection setup overhead. Send a warm-up batch first or ignore initial results.',
      'Using too many concurrent connections for the test scenario -- more connections than the server can handle skews results toward connection errors, not actual performance.',
    ],
    bestPractices: [
      'Use hey -n 10000 -c 50 for a solid baseline benchmark.',
      'Use -m and -d to test POST/PUT requests with bodies: hey -m POST -d "payload" URL.',
      'Focus on p99 latency, not average, for realistic performance assessment.',
    ],
  },

  'git-hooks': {
    useCases: [
      'Run linters and formatters automatically before commits',
      'Enforce commit message conventions with commit-msg hooks',
      'Trigger CI builds or deployments on push with server-side hooks',
    ],
    internals:
      'Git hooks are executable scripts in .git/hooks/ that Git runs at specific lifecycle points. Client-side hooks (pre-commit, commit-msg, pre-push) run on developer machines. Server-side hooks (pre-receive, post-receive) run on the remote. Hooks can abort operations by exiting non-zero.',
    mistakes: [
      'Hooks not being executable -- Git silently skips hooks without the execute bit. Use chmod +x on hook scripts.',
      'Hooks not being shared with the team -- .git/hooks/ is not tracked by Git. Use a hooks directory in the repo and configure core.hooksPath, or use tools like husky or pre-commit.',
      'Slow hooks frustrating developers -- long-running pre-commit hooks slow down the workflow. Keep hooks fast or run heavy checks in CI.',
    ],
    bestPractices: [
      'Use core.hooksPath to share hooks via a version-controlled directory.',
      'Use pre-commit framework or husky for easy hook management.',
      'Keep pre-commit hooks under 5 seconds for developer experience.',
      'Use --no-verify sparingly and only with good reason.',
    ],
  },

  ltrace: {
    useCases: [
      'Trace library function calls made by a program',
      'Debug shared library interactions and parameter values',
      'Compare library call patterns between program runs',
    ],
    internals:
      'ltrace intercepts dynamic library calls by manipulating the PLT (Procedure Linkage Table) entries. It inserts breakpoints at PLT stubs to capture function names, arguments, and return values. It uses ptrace to control the target process.',
    mistakes: [
      'Using ltrace on statically linked binaries -- ltrace only traces dynamic library calls via the PLT. Statically linked functions are invisible to it.',
      'Getting overwhelmed by output -- busy programs make thousands of library calls. Use -e to filter specific functions: ltrace -e malloc+free ./prog.',
    ],
    bestPractices: [
      'Use -e to filter specific library calls: ltrace -e open+read+write ./prog.',
      'Use -c for a summary count of all library calls instead of individual traces.',
      'Combine with strace for a complete picture: ltrace for library calls, strace for syscalls.',
    ],
  },

  entr: {
    useCases: [
      'Automatically rerun tests or rebuild when source files change',
      'Set up a file-watching development loop without a build tool',
      'Trigger any command on file modification for rapid feedback',
    ],
    internals:
      'entr uses inotify (Linux) or kqueue (macOS/BSD) to watch file descriptors for modification events. It reads a list of file paths from stdin and runs the specified command when any file changes. It is deliberately simple and composable.',
    mistakes: [
      'Not piping a file list -- entr reads filenames from stdin. Common pattern: find . -name "*.c" | entr make.',
      'Expecting entr to detect new files -- entr only watches files listed at startup. Use entr -d to exit when new files appear, then loop to restart.',
    ],
    bestPractices: [
      'Use while true; do find . -name "*.py" | entr -d pytest; done to handle new files.',
      'Use entr -c to clear the screen before each run.',
      'Use entr -r to restart long-running processes (like servers) on changes.',
    ],
  },

  hyperfine: {
    useCases: [
      'Benchmark command execution time with statistical rigor',
      'Compare performance of different commands or implementations',
      'Detect performance regressions in scripts and tools',
    ],
    internals:
      'hyperfine performs multiple timed runs, discards outliers, and computes mean, stddev, min, max, and median. It optionally runs warmup iterations to prime filesystem caches and supports parameterized benchmarks for comparisons.',
    mistakes: [
      'Not using warmup runs -- filesystem caching effects can skew first-run results. Use --warmup 3 or more.',
      'Benchmarking commands that are too fast -- sub-millisecond commands are dominated by process startup noise. Batch them or use the --min-runs flag to increase sample size.',
    ],
    bestPractices: [
      'Always use --warmup for commands that read from disk.',
      'Use hyperfine "cmd1" "cmd2" to compare two commands directly.',
      'Use --export-markdown to generate benchmark comparison tables.',
      'Use --parameter-scan for parameterized benchmarks.',
    ],
  },

  tokei: {
    useCases: [
      'Count lines of code by language across a project',
      'Get a quick overview of project composition and size',
      'Compare codebase sizes or track growth over time',
    ],
    internals:
      'tokei uses language-specific rules to classify files and count code, comments, and blank lines. It walks the directory tree, identifies languages by extension and shebang, and parses each file to distinguish code from comments.',
    mistakes: [
      'Including generated or vendor code -- tokei counts everything by default. Use .tokeignore or .gitignore to exclude generated directories.',
      'Comparing LOC as a productivity metric -- lines of code measure size, not quality or effort.',
    ],
    bestPractices: [
      'Run tokei in a git repository to automatically respect .gitignore.',
      'Use tokei -e to exclude specific file types or directories.',
      'Use tokei --sort code to sort languages by lines of code.',
    ],
  },

  shellcheck: {
    useCases: [
      'Lint shell scripts for common bugs, pitfalls, and bad practices',
      'Catch quoting errors, useless use of cat, and other anti-patterns',
      'Integrate static analysis into CI for shell scripts',
    ],
    internals:
      'ShellCheck parses shell scripts using a Haskell-based parser, builds an AST, and runs analysis passes that check for over 300 common issues. It understands sh, bash, dash, and ksh dialects based on the shebang.',
    mistakes: [
      'Ignoring ShellCheck warnings -- many warnings catch real bugs (unquoted variables, missing error handling). Do not suppress without understanding.',
      'Not specifying the shell dialect -- without a shebang, ShellCheck defaults to sh. Add the correct shebang or use -s bash for accurate analysis.',
    ],
    bestPractices: [
      'Run shellcheck on all shell scripts in CI.',
      'Use # shellcheck disable=SC2086 with a comment explaining why when suppressing specific warnings.',
      'Install the ShellCheck editor integration for real-time feedback.',
      'Fix warnings incrementally -- start with errors (severity error) and work down.',
    ],
  },

  jenv: {
    useCases: [
      'Manage multiple Java versions on a single machine',
      'Set per-project Java versions automatically',
      'Switch between JDK versions for different projects',
    ],
    internals:
      'jenv works by managing shim scripts that intercept java, javac, and other JDK commands. It uses a .java-version file or the JENV_VERSION environment variable to select the active JDK version. The actual JDKs must be installed separately.',
    mistakes: [
      'Expecting jenv to install JDKs -- jenv only manages already-installed JDKs. Install JDKs first via your package manager, then jenv add /path/to/jdk.',
      'Forgetting to enable plugins -- jenv export plugin must be enabled for JAVA_HOME to be set correctly: jenv enable-plugin export.',
    ],
    bestPractices: [
      'Enable the export plugin: jenv enable-plugin export.',
      'Use jenv local <version> to set a per-project Java version via .java-version.',
      'Use jenv global <version> to set the default system-wide version.',
    ],
  },

  nvm: {
    useCases: [
      'Install and manage multiple Node.js versions on a single machine',
      'Switch Node.js versions per project using .nvmrc files',
      'Test code across different Node.js versions',
    ],
    internals:
      'nvm is a bash script that manages Node.js installations in ~/.nvm/versions/node/. It modifies PATH to point to the selected version. It downloads prebuilt binaries (or compiles from source) and manages symlinks. Each version has its own global node_modules.',
    mistakes: [
      'Installing nvm via a package manager -- nvm should be installed via its install script, not apt or brew, which may provide outdated or broken versions.',
      'Not loading nvm in non-interactive shells -- nvm is a shell function loaded from .bashrc. Scripts may need to source nvm.sh explicitly.',
      'Forgetting that global packages are per-version -- npm install -g applies only to the current Node.js version. Reinstall after switching versions.',
    ],
    bestPractices: [
      'Create a .nvmrc file in your project root with the required Node.js version.',
      'Use nvm use to switch to the version specified in .nvmrc.',
      'Use nvm alias default <version> to set the default Node.js version.',
      'Add automatic nvm use to your shell profile for directory-based switching.',
    ],
  },

  // ─── SECURITY (15) ────────────────────────────────────────────────

  gpg: {
    useCases: [
      'Encrypt and decrypt files using public-key or symmetric cryptography',
      'Sign files and commits to prove authenticity and integrity',
      'Manage a personal keyring of public and private keys',
    ],
    internals:
      'GPG implements the OpenPGP standard (RFC 4880). It uses a web of trust model for key validation. Keys are stored in ~/.gnupg/. Encryption uses a session key encrypted with the recipient public key. Signing creates a hash of the data and encrypts it with the sender private key.',
    mistakes: [
      'Not backing up the private key -- if the private key is lost, encrypted data is unrecoverable. Export and store the key securely: gpg --export-secret-keys.',
      'Not setting an expiration date on keys -- keys without expiration cannot be automatically retired. Set an expiration and extend it before it lapses.',
      'Forgetting to publish the public key -- others cannot encrypt to you if they do not have your public key. Upload to a keyserver or share directly.',
    ],
    bestPractices: [
      'Set key expiration dates and renew before expiry.',
      'Back up your private key and revocation certificate in a secure offline location.',
      'Use gpg --sign --armor for ASCII-armored signatures in email.',
      'Use gpg-agent for caching the passphrase to avoid repeated entry.',
    ],
  },

  'ssh-keygen': {
    useCases: [
      'Generate SSH key pairs for passwordless authentication',
      'Create deployment keys for CI/CD and server access',
      'Generate keys of different types and strengths',
    ],
    internals:
      'ssh-keygen generates asymmetric key pairs using algorithms like Ed25519 or RSA. The private key is stored encrypted (with a passphrase) in ~/.ssh/. The public key is a single line that gets added to remote ~/.ssh/authorized_keys for authentication.',
    mistakes: [
      'Using RSA with a small key size -- RSA keys under 3072 bits are considered weak. Use ssh-keygen -t ed25519 for modern, fast, and secure keys.',
      'Not setting a passphrase -- a passphrase-less private key provides no protection if the file is stolen. Always set a passphrase and use ssh-agent.',
      'Overwriting existing keys -- ssh-keygen overwrites without warning if the file exists. Use a unique filename with -f.',
    ],
    bestPractices: [
      'Use Ed25519: ssh-keygen -t ed25519 -C "your@email.com".',
      'Always set a passphrase and use ssh-agent to avoid repeated entry.',
      'Use separate keys for different purposes (personal, work, CI/CD).',
      'Set restrictive permissions: chmod 600 ~/.ssh/id_ed25519.',
    ],
  },

  'ssh-copy-id': {
    useCases: [
      'Install your SSH public key on a remote server for passwordless login',
      'Set up key-based authentication quickly and correctly',
      'Copy the key with proper permissions on the remote side',
    ],
    internals:
      'ssh-copy-id connects to the remote server via password authentication, reads the local public key, and appends it to ~/.ssh/authorized_keys on the remote host. It also sets proper permissions on the remote .ssh directory (700) and authorized_keys file (600).',
    mistakes: [
      'Not verifying which key is being copied -- ssh-copy-id uses the default key. Specify the key explicitly with -i ~/.ssh/id_ed25519.pub.',
      'Running it when the key is already installed -- the key gets duplicated in authorized_keys. Harmless but messy.',
    ],
    bestPractices: [
      'Specify the key explicitly: ssh-copy-id -i ~/.ssh/id_ed25519.pub user@host.',
      'Verify the connection works afterward: ssh user@host.',
      'Disable password authentication on the server after confirming key-based auth works.',
    ],
  },

  'openssl-cert': {
    useCases: [
      'Generate self-signed certificates for development and testing',
      'Create Certificate Signing Requests (CSRs) for production certificates',
      'Inspect and verify SSL/TLS certificates',
    ],
    internals:
      'OpenSSL implements the X.509 PKI standard. Certificate generation creates a key pair, builds a certificate structure with subject, validity, extensions, and signs it with the private key (self-signed) or submits it as a CSR for CA signing.',
    mistakes: [
      'Using self-signed certificates in production -- browsers and clients reject them. Use a proper CA like Let\'s Encrypt.',
      'Not including Subject Alternative Names (SANs) -- modern browsers require SAN extensions. Certificates with only Common Name (CN) may be rejected.',
      'Using weak key sizes or SHA-1 -- minimum RSA 2048-bit and SHA-256 for modern compatibility.',
    ],
    bestPractices: [
      'Use openssl req -x509 -newkey ec -pkeyopt ec_paramgen_curve:prime256v1 for modern self-signed certs.',
      'Always include SANs in certificates with -addext "subjectAltName=DNS:example.com".',
      'Use certbot/Let\'s Encrypt for production certificates instead of self-signed.',
      'Use openssl x509 -text -noout to inspect certificate details.',
    ],
  },

  ufw: {
    useCases: [
      'Set up a simple firewall on Ubuntu/Debian systems',
      'Allow or deny traffic by port, protocol, or IP address',
      'Quickly secure a new server by blocking all ports except SSH',
    ],
    internals:
      'UFW (Uncomplicated Firewall) is a frontend for iptables/nftables. It translates simple rules into iptables chains and manages them persistently across reboots via /etc/ufw/. Rules are stored in /etc/ufw/user.rules and user6.rules.',
    mistakes: [
      'Enabling ufw without allowing SSH first -- this locks you out of remote servers. Always ufw allow ssh before ufw enable.',
      'Not knowing that ufw rules bypass Docker -- Docker manipulates iptables directly, bypassing ufw rules. Docker-published ports are accessible regardless of ufw.',
    ],
    bestPractices: [
      'Always allow SSH before enabling: ufw allow 22/tcp && ufw enable.',
      'Use ufw default deny incoming and ufw default allow outgoing as a baseline.',
      'Use ufw status verbose to see the current rule set.',
      'Use ufw limit ssh to rate-limit SSH connections against brute-force attacks.',
    ],
  },

  fail2ban: {
    useCases: [
      'Automatically ban IPs that show malicious signs (brute-force login attempts)',
      'Protect SSH, web servers, and mail servers from automated attacks',
      'Reduce noise from repeated failed authentication attempts',
    ],
    internals:
      'fail2ban monitors log files using configurable regex filters. When a pattern matches more than maxretry times within findtime seconds from the same IP, it executes a ban action (typically adding an iptables/nftables REJECT rule) for bantime seconds.',
    mistakes: [
      'Banning yourself -- a misconfigured rule or too many failed login attempts can lock you out. Use ignoreip to whitelist your IPs.',
      'Not testing regex filters -- incorrect filters either miss attacks or produce false positives. Use fail2ban-regex to test.',
    ],
    bestPractices: [
      'Add your own IP to ignoreip in jail.local to prevent self-lockout.',
      'Create jail.local instead of editing jail.conf -- jail.conf is overwritten on upgrades.',
      'Use fail2ban-client status <jail> to check active bans.',
      'Test filters with fail2ban-regex /var/log/auth.log /etc/fail2ban/filter.d/sshd.conf.',
    ],
  },

  chattr: {
    useCases: [
      'Make files immutable to prevent accidental or malicious modification',
      'Set append-only mode for log files',
      'Protect critical configuration files from being overwritten',
    ],
    internals:
      'chattr sets extended file attributes on ext2/ext3/ext4/btrfs filesystems via the ioctl FS_IOC_SETFLAGS call. The +i (immutable) flag prevents all modifications including by root. The +a (append-only) flag allows only appending.',
    mistakes: [
      'Forgetting you set the immutable flag -- files with +i cannot be modified, deleted, or renamed, even by root. Use lsattr to check before troubleshooting why you cannot edit a file.',
      'Assuming chattr works on all filesystems -- it is specific to ext2/3/4 and btrfs. It does not work on tmpfs, NFS, or FAT.',
    ],
    bestPractices: [
      'Use chattr +i on critical config files to prevent accidental changes.',
      'Use lsattr to verify attributes: lsattr /etc/resolv.conf.',
      'Document immutable files so other admins know to remove the flag before editing.',
    ],
  },

  auditctl: {
    useCases: [
      'Monitor file access and system calls for security auditing',
      'Track who accesses sensitive files like /etc/passwd or /etc/shadow',
      'Set up kernel-level audit rules for compliance requirements',
    ],
    internals:
      'auditctl configures the Linux Audit Framework by adding rules to the kernel audit subsystem. The kernel generates audit records for matching events, which auditd writes to /var/log/audit/audit.log. Rules can match file access (-w) or syscalls (-a).',
    mistakes: [
      'Adding too many rules -- each rule is checked for every matching event, impacting performance. Be selective about what you audit.',
      'Not making rules persistent -- auditctl rules are lost on reboot. Write them to /etc/audit/rules.d/ for persistence.',
    ],
    bestPractices: [
      'Use auditctl -w /etc/passwd -p wa -k passwd_changes to watch file modifications.',
      'Make rules persistent in /etc/audit/rules.d/*.rules.',
      'Use ausearch -k <key> to search audit logs by key.',
      'Use aureport for summary reports of audit events.',
    ],
  },

  'openssl-enc': {
    useCases: [
      'Encrypt files with symmetric encryption (AES) from the command line',
      'Decrypt files that were encrypted with openssl enc',
      'Quick file encryption when GPG setup is not available',
    ],
    internals:
      'openssl enc uses symmetric ciphers (AES-256-CBC, ChaCha20, etc.) to encrypt data. By default it derives the encryption key from a password using a key derivation function. With -pbkdf2 it uses PBKDF2 for key derivation (recommended).',
    mistakes: [
      'Not using -pbkdf2 -- without it, openssl uses the legacy EVP_BytesToKey which is weak. Always add -pbkdf2 -iter 100000.',
      'Using ECB mode -- ECB encrypts identical blocks to identical ciphertext, leaking patterns. Use CBC or a modern AEAD mode.',
    ],
    bestPractices: [
      'Use AES-256-CBC with PBKDF2: openssl enc -aes-256-cbc -pbkdf2 -iter 100000 -salt -in file -out file.enc.',
      'Always use -salt (default in modern openssl) to prevent rainbow table attacks.',
      'Consider age or gpg for more user-friendly file encryption.',
    ],
  },

  age: {
    useCases: [
      'Encrypt files with a simple, modern tool (simpler than GPG)',
      'Encrypt to multiple recipients with their public keys',
      'Use passphrase-based encryption for personal files',
    ],
    internals:
      'age uses X25519 for key agreement and ChaCha20-Poly1305 for authenticated encryption. It generates a random file key, encrypts it to each recipient public key, and encrypts the file with the file key. The format is simple and auditable.',
    mistakes: [
      'Confusing age keys with SSH keys -- age has its own key format (age1...). It can also use SSH keys with -R, but native age keys are preferred.',
      'Not backing up the private key -- age keys in ~/.config/age/ are the only way to decrypt your files. Back them up securely.',
    ],
    bestPractices: [
      'Generate a key pair: age-keygen -o key.txt.',
      'Encrypt to a recipient: age -r age1... -o file.enc file.',
      'Use age -p for passphrase-based encryption when you do not need public-key crypto.',
      'Use age as a simpler alternative to GPG for file encryption.',
    ],
  },

  certbot: {
    useCases: [
      'Obtain free SSL/TLS certificates from Let\'s Encrypt',
      'Automatically renew certificates before they expire',
      'Configure HTTPS on web servers (Nginx, Apache) automatically',
    ],
    internals:
      'certbot implements the ACME protocol to prove domain ownership to Let\'s Encrypt. It can use HTTP-01 (serve a file on port 80), DNS-01 (create a DNS TXT record), or TLS-ALPN-01 challenges. Certificates are stored in /etc/letsencrypt/ and auto-renewed via a systemd timer or cron.',
    mistakes: [
      'Not setting up auto-renewal -- Let\'s Encrypt certificates expire in 90 days. Without auto-renewal, your site goes down. Verify with certbot renew --dry-run.',
      'Running certbot with both --nginx and --standalone -- use one mode. --nginx integrates with nginx; --standalone starts its own server on port 80.',
    ],
    bestPractices: [
      'Use certbot --nginx or certbot --apache for automatic web server configuration.',
      'Verify auto-renewal works: certbot renew --dry-run.',
      'Use certbot certonly for manual configuration if you prefer to configure the server yourself.',
      'Use DNS-01 challenge for wildcard certificates: certbot -d "*.example.com" --manual --preferred-challenges dns.',
    ],
  },

  'ssh-agent': {
    useCases: [
      'Cache SSH private key passphrases to avoid repeated entry',
      'Forward SSH authentication to remote servers (agent forwarding)',
      'Manage multiple SSH keys for different services',
    ],
    internals:
      'ssh-agent is a daemon that holds decrypted private keys in memory. SSH clients communicate with it via a Unix domain socket (SSH_AUTH_SOCK). When authentication is needed, the client asks the agent to perform the signing operation without ever exposing the private key.',
    mistakes: [
      'Not starting the agent -- SSH prompts for the passphrase every time without a running agent. Start it with eval $(ssh-agent) or use your desktop environment keyring.',
      'Using agent forwarding to untrusted servers -- a compromised server can use your forwarded agent to authenticate as you. Use ProxyJump (-J) instead of agent forwarding when possible.',
    ],
    bestPractices: [
      'Add keys with a lifetime: ssh-add -t 3600 for 1-hour expiry.',
      'Use ProxyJump (-J) instead of agent forwarding for safer SSH hopping.',
      'Configure AddKeysToAgent yes in ~/.ssh/config to auto-add keys on first use.',
    ],
  },

  'sshd-config': {
    useCases: [
      'Harden SSH server configuration for security',
      'Configure authentication methods, ports, and access controls',
      'Set up per-user or per-group SSH access policies',
    ],
    internals:
      'sshd reads /etc/ssh/sshd_config at startup (and on SIGHUP reload). Configuration directives are processed top-down, with the first match winning for most options. Match blocks allow conditional configuration based on user, group, host, or address.',
    mistakes: [
      'Disabling password auth before confirming key auth works -- this locks you out. Test key-based login in a second session before disabling passwords.',
      'Not restarting sshd after changes -- changes to sshd_config require a reload: systemctl reload sshd.',
      'Editing sshd_config with syntax errors -- a broken config prevents sshd from starting. Use sshd -t to test before restarting.',
    ],
    bestPractices: [
      'Disable root login: PermitRootLogin no.',
      'Disable password authentication: PasswordAuthentication no (after confirming key auth works).',
      'Use sshd -t to validate config syntax before restarting.',
      'Use AllowUsers or AllowGroups to restrict SSH access to specific accounts.',
    ],
  },

  firewalld: {
    useCases: [
      'Manage firewall rules on RHEL/CentOS/Fedora systems',
      'Configure network zones with different trust levels',
      'Apply firewall changes without restarting the service (runtime vs permanent)',
    ],
    internals:
      'firewalld is a dynamic firewall daemon that manages nftables (or iptables) rules. It uses zones to define trust levels for network connections. Rules can be applied at runtime (immediate, non-persistent) or permanently (survive reboot). D-Bus is used for inter-process communication.',
    mistakes: [
      'Forgetting --permanent -- runtime changes are lost on reload/reboot. Use --permanent for persistent rules, then --reload to apply.',
      'Not reloading after permanent changes -- permanent rules do not take effect until firewall-cmd --reload.',
    ],
    bestPractices: [
      'Apply both runtime and permanent: firewall-cmd --add-service=http --permanent && firewall-cmd --reload.',
      'Use zones to segment network interfaces by trust level.',
      'Use firewall-cmd --list-all to see the current active configuration.',
      'Use rich rules for complex filtering: firewall-cmd --add-rich-rule.',
    ],
  },

  selinux: {
    useCases: [
      'Enforce mandatory access control (MAC) policies on Linux systems',
      'Restrict what processes can access even if compromised',
      'Troubleshoot SELinux denials that block legitimate operations',
    ],
    internals:
      'SELinux is a Linux Security Module (LSM) that labels every process, file, and socket with a security context (user:role:type:level). The kernel checks a policy database for every access attempt. Type Enforcement (TE) rules define which types can access which other types.',
    mistakes: [
      'Disabling SELinux instead of fixing denials -- setting SELinux to disabled removes an important security layer. Use permissive mode to debug, then fix and switch back to enforcing.',
      'Not checking audit logs -- SELinux denials are logged in /var/log/audit/audit.log. Use ausearch -m avc for recent denials.',
      'Incorrect file contexts after moving files -- mv preserves the source context. Use restorecon to reset contexts to the policy defaults.',
    ],
    bestPractices: [
      'Use getenforce and setenforce to check and temporarily set the mode.',
      'Use audit2why and audit2allow to understand and resolve denials.',
      'Use restorecon -Rv /path after moving or creating files to fix contexts.',
      'Never permanently disable SELinux; use targeted permissive domains instead.',
    ],
  },

  // ─── EDITORS (10) ─────────────────────────────────────────────────

  vim: {
    useCases: [
      'Edit files efficiently from the terminal with modal editing',
      'Make quick edits on remote servers over SSH',
      'Use as a powerful programmable editor with extensive plugin ecosystem',
    ],
    internals:
      'Vim operates in modes: Normal (navigation/commands), Insert (typing), Visual (selection), and Command-line (ex commands). It stores buffers in memory and a swap file (.swp) for crash recovery. Configuration is in ~/.vimrc. Vim uses a command grammar: operator + motion (e.g., d3w = delete 3 words).',
    mistakes: [
      'Getting stuck in a mode -- press Esc to return to Normal mode. :q! to quit without saving.',
      'Not learning motions and operators -- using arrow keys and Insert mode exclusively defeats the purpose. Learn hjkl, w, b, d, c, y for efficient editing.',
      'Not using persistent undo -- set undofile in .vimrc to maintain undo history across sessions.',
    ],
    bestPractices: [
      'Learn the operator+motion grammar: d = delete, c = change, y = yank combined with w, $, iw, etc.',
      'Use :wq to save and quit, :q! to quit without saving.',
      'Use . to repeat the last change and u to undo.',
      'Start with a minimal .vimrc and add settings as you understand them.',
    ],
  },

  nano: {
    useCases: [
      'Make quick file edits from the terminal without learning modal editing',
      'Edit configuration files on servers where vi skills are not required',
      'Provide a beginner-friendly terminal editor for new Linux users',
    ],
    internals:
      'nano is a modeless editor (what you type is always inserted). Commands use Ctrl and Alt key combinations shown at the bottom of the screen. It reads the file into a linked list of lines in memory and writes back on save.',
    mistakes: [
      'Not knowing the key shortcuts -- ^ means Ctrl. Ctrl+O saves (WriteOut), Ctrl+X exits, Ctrl+K cuts a line, Ctrl+U pastes.',
      'Not enabling syntax highlighting -- nano supports syntax highlighting but it may not be enabled by default. Add include "/usr/share/nano/*.nanorc" to ~/.nanorc.',
    ],
    bestPractices: [
      'Enable syntax highlighting and line numbers in ~/.nanorc.',
      'Use Ctrl+W to search and Ctrl+\\ to search and replace.',
      'Use nano -B to create backups of files before editing.',
      'Use Alt+# to toggle line numbers display.',
    ],
  },

  emacs: {
    useCases: [
      'Use as a comprehensive development environment with built-in tools',
      'Write and edit code with extensive language support via major modes',
      'Use org-mode for note-taking, project management, and literate programming',
    ],
    internals:
      'Emacs is essentially a Lisp interpreter (Emacs Lisp) with a text editing interface. Nearly everything is implemented in Elisp, making it deeply extensible. Buffers are the core abstraction; each file, shell, or tool runs in a buffer. Keybindings map to Elisp functions.',
    mistakes: [
      'Getting stuck -- C-g cancels any command or key sequence. C-x C-c exits Emacs.',
      'Not learning the key conventions -- C- means Ctrl, M- means Alt/Meta. C-x C-f opens files, C-x C-s saves, C-x C-c quits.',
      'Installing too many packages initially -- package conflicts and slow startup are common. Start minimal and add packages as needed.',
    ],
    bestPractices: [
      'Complete the built-in tutorial: C-h t.',
      'Use a starter kit (Doom Emacs, Spacemacs, or Prelude) for a curated experience.',
      'Learn the C-h help system: C-h k (describe key), C-h f (describe function), C-h v (describe variable).',
      'Use M-x to discover and run commands by name.',
    ],
  },

  ed: {
    useCases: [
      'Edit files in scripts or over extremely limited connections',
      'Use as the standard POSIX line editor for maximum portability',
      'Make automated, scriptable edits to files',
    ],
    internals:
      'ed is a line-oriented editor that loads the entire file into memory as a sequence of lines. Commands operate on a current line address (default: last line). It uses a command language with addresses and operations (a=append, d=delete, s=substitute, w=write).',
    mistakes: [
      'Expecting visual feedback -- ed provides no visual display. It prints ? on errors with no explanation. Use H to enable verbose error messages.',
      'Not understanding address syntax -- commands operate on the current line by default. Use line numbers, ranges (1,5), or patterns (/regex/) to target specific lines.',
    ],
    bestPractices: [
      'Use ed for scripted file edits in POSIX environments where sed or other tools are not suitable.',
      'Enable verbose errors: H command after starting ed.',
      'Use printf commands piped to ed for automated edits in scripts.',
    ],
  },

  micro: {
    useCases: [
      'Use a modern, intuitive terminal editor with familiar keybindings',
      'Replace nano with a more capable editor that feels like a GUI editor',
      'Edit files in the terminal with mouse support and syntax highlighting',
    ],
    internals:
      'micro is a single Go binary that uses standard terminal keybindings (Ctrl+S save, Ctrl+Q quit, Ctrl+C copy). It supports syntax highlighting via bundled syntax files, a plugin system in Lua, and multiple cursors.',
    mistakes: [
      'Not knowing it supports multiple cursors -- Alt+N creates multiple cursors for parallel editing.',
      'Not exploring the command palette -- Ctrl+E opens the command bar for advanced operations.',
    ],
    bestPractices: [
      'Use standard keybindings: Ctrl+S save, Ctrl+Q quit, Ctrl+F find.',
      'Use Ctrl+E to access the command bar for settings and advanced features.',
      'Install plugins with micro -plugin install <name>.',
      'Configure settings in ~/.config/micro/settings.json.',
    ],
  },

  'sed-edit': {
    useCases: [
      'Make programmatic, non-interactive edits to files from scripts',
      'Perform search-and-replace operations across files',
      'Transform text streams in pipelines',
    ],
    internals:
      'sed reads input line by line into a pattern space, applies commands (s/old/new/, d, p, etc.), and outputs the result. It maintains a hold space for multi-line operations. The -i flag modifies files in place (creating a temporary file and replacing the original).',
    mistakes: [
      'Using -i differently on GNU and BSD -- GNU sed uses -i (no argument), BSD sed requires -i "" (empty string). For portability, use -i.bak on both.',
      'Not escaping special characters in the pattern -- /, ., *, and other regex metacharacters need escaping. Or use a different delimiter: s|path/to|new/path|.',
      'Forgetting the g flag for global replacement -- s/old/new/ replaces only the first match per line. Use s/old/new/g for all matches.',
    ],
    bestPractices: [
      'Use a different delimiter for paths: sed "s|/old/path|/new/path|g" to avoid escaping slashes.',
      'Always test without -i first: sed "s/old/new/g" file to preview changes.',
      'Use -i.bak for portable in-place editing with a backup.',
    ],
  },

  vi: {
    useCases: [
      'Edit files on any Unix system -- vi is guaranteed to be available',
      'Make quick edits on minimal systems without vim installed',
      'Use the POSIX-standard visual editor',
    ],
    internals:
      'vi is the POSIX-standardized visual editor, predating vim. On most modern systems, vi is a symlink to vim or a minimal vim build. Original vi uses ex commands and does not have many vim features (visual block mode, plugins, undo tree).',
    mistakes: [
      'Confusing vi with vim -- vi may lack many vim features (syntax highlighting, multiple undo, visual block mode). Check with vi --version.',
      'The same mode confusion as vim -- Esc for Normal mode, i for Insert mode, :wq to save and quit.',
    ],
    bestPractices: [
      'Learn basic vi commands (i, Esc, :wq, dd, yy, p) as they work everywhere.',
      'Use vi when vim is not available; otherwise prefer vim or nvim.',
      'Set EDITOR=vi in your shell profile if you prefer vi as the default editor.',
    ],
  },

  nvim: {
    useCases: [
      'Use a modern, extensible refactoring of Vim with Lua-based configuration',
      'Build a full IDE experience with LSP, treesitter, and modern plugins',
      'Take advantage of async architecture and built-in terminal emulator',
    ],
    internals:
      'Neovim is a refactor of Vim with a clean codebase, built-in Lua runtime (LuaJIT), asynchronous job control, and a client-server architecture (msgpack-RPC). It includes built-in LSP client, treesitter parser integration, and a terminal emulator. Config is in ~/.config/nvim/init.lua.',
    mistakes: [
      'Copying a vim config directly -- while Neovim is mostly compatible, .vimrc may reference Vim-specific settings. Use init.lua for Neovim-native configuration.',
      'Installing too many plugins without understanding them -- start with a distribution (LazyVim, NvChad, AstroNvim) or build up gradually.',
    ],
    bestPractices: [
      'Use init.lua for configuration instead of init.vim for better performance.',
      'Use lazy.nvim as a plugin manager for lazy-loaded, fast startup.',
      'Configure the built-in LSP client with nvim-lspconfig for IDE features.',
      'Use treesitter for fast, accurate syntax highlighting and code navigation.',
    ],
  },

  helix: {
    useCases: [
      'Use a modern modal editor with selection-first editing (select then act)',
      'Edit code with built-in LSP and tree-sitter support out of the box',
      'Use a terminal editor without plugin configuration overhead',
    ],
    internals:
      'Helix is written in Rust and uses tree-sitter for syntax parsing and highlighting. It inverts Vim grammar: instead of verb-then-object (dw = delete word), Helix uses select-then-act (w then d = select word then delete). LSP and DAP support is built in.',
    mistakes: [
      'Expecting Vim keybindings -- Helix uses a different editing model. Selection comes first (w selects a word, then d deletes the selection). Read the tutorial with :tutor.',
      'Looking for a plugin system -- Helix intentionally has no plugin system (as of 2025). Features are built in.',
    ],
    bestPractices: [
      'Run :tutor to learn the Helix editing model.',
      'Use space as the leader key to access menus (space+f for file picker, space+b for buffers).',
      'Configure language servers in ~/.config/helix/languages.toml.',
      'Use x to select lines, then operate on the selection.',
    ],
  },

  'code-cli': {
    useCases: [
      'Open files and folders in VS Code from the terminal',
      'Compare files with the built-in diff viewer',
      'Manage VS Code extensions from the command line',
    ],
    internals:
      'The code CLI communicates with a running VS Code instance via IPC (if one exists) or launches a new instance. It can open files at specific line numbers, diff files, install/uninstall extensions, and pipe stdin to a new editor tab.',
    mistakes: [
      'Not installing the CLI on macOS -- on macOS, run "Shell Command: Install code command in PATH" from the VS Code command palette first.',
      'Using code in SSH sessions without Remote extension -- code cannot open a local GUI from a remote shell. Use code --remote ssh-remote+host /path for VS Code Remote.',
    ],
    bestPractices: [
      'Use code -d file1 file2 to diff two files.',
      'Use code -g file:line:column to open a file at a specific location.',
      'Use code --install-extension <id> to install extensions from the CLI.',
      'Pipe to VS Code: echo "hello" | code - opens a new tab with stdin content.',
    ],
  },
}
