import type { CommandExplanation } from '../types'

export const explanationsPart1: Record<string, CommandExplanation> = {
  // ─── FILE MANAGEMENT (23) ───────────────────────────────────────────

  ls: {
    useCases: [
      'List files and directories in the current or specified path',
      'Check file permissions, sizes, and modification dates with long format',
      'Discover hidden configuration files (dotfiles) in a directory',
    ],
    internals:
      'ls reads directory entries via the readdir system call and stats each file to gather metadata. When sorting by time or size, it calls stat on every entry, which can slow down on directories with many files.',
    mistakes: [
      'Forgetting -a to see hidden files (names starting with a dot) and missing important config files',
      'Parsing ls output in scripts instead of using find or glob expansion, which breaks on filenames with spaces or special characters',
      'Using ls -R on very large directory trees when find would be far more efficient and scriptable',
    ],
    bestPractices: [
      'Use ls -lh for human-readable sizes and ls -lt to sort by modification time',
      'Prefer find or shell globbing over parsing ls output in scripts',
      'Use ls --color=auto in interactive shells for quick visual distinction of file types',
    ],
  },

  cd: {
    useCases: [
      'Navigate to a different directory in the filesystem',
      'Return to home directory quickly with cd or cd ~',
      'Switch back to the previous directory with cd -',
    ],
    mistakes: [
      'Forgetting to quote paths with spaces: use cd "my folder" not cd my folder',
      'Using cd in a subshell or script expecting the parent shell to change directory, which it will not',
    ],
    bestPractices: [
      'Use cd - to toggle between two directories rapidly',
      'Set CDPATH variable to skip typing full paths to frequently visited directories',
      'Use pushd/popd instead of cd when you need to return to a previous directory reliably',
    ],
  },

  pwd: {
    useCases: [
      'Print the absolute path of the current working directory',
      'Verify your location before running destructive commands like rm -rf',
      'Capture the current directory in a variable for use later in a script',
    ],
    bestPractices: [
      'Use pwd -P to resolve symlinks and get the physical path',
      'In scripts, prefer $PWD or $(pwd) to hardcoded paths for portability',
    ],
  },

  cp: {
    useCases: [
      'Duplicate files or directories for backups or templates',
      'Copy files between directories while preserving or updating metadata',
      'Deploy built artifacts to a target directory',
    ],
    internals:
      'cp opens the source file for reading and creates or truncates the destination, then copies data in chunks. With -p it also copies permissions, ownership, and timestamps via chmod/chown/utime system calls.',
    mistakes: [
      'Forgetting -r when copying directories, which causes cp to skip them silently or error out',
      'Overwriting existing files without -i (interactive) or -n (no-clobber), losing data unexpectedly',
      'Not using -p or -a to preserve permissions, leading to wrong file modes in the destination',
    ],
    bestPractices: [
      'Use cp -a (archive) to preserve all attributes and copy recursively including symlinks',
      'Use cp -i to get a prompt before overwriting existing files',
      'For large directory copies across filesystems, consider rsync instead for resumability and progress',
    ],
  },

  mv: {
    useCases: [
      'Rename a file or directory in place',
      'Move files from one directory to another',
      'Reorganize project structure by relocating files',
    ],
    internals:
      'On the same filesystem mv simply calls rename(), which updates directory entries without copying data. Across filesystems it falls back to a copy-then-delete operation, which is much slower.',
    mistakes: [
      'Moving files across filesystems without realizing it triggers a full copy, which can be slow for large files',
      'Accidentally overwriting an existing file at the destination without using -i for confirmation',
      'Forgetting that mv on a directory renames it and can break scripts relying on the old path',
    ],
    bestPractices: [
      'Use mv -i to prompt before overwriting existing files',
      'Use mv -n (no-clobber) in batch operations to avoid unintended overwrites',
      'When moving many files, use a for loop or find -exec instead of relying on glob expansion limits',
    ],
  },

  rm: {
    useCases: [
      'Delete files or directories you no longer need',
      'Clean up temporary or build artifacts',
      'Remove broken symlinks or stale lock files',
    ],
    internals:
      'rm calls the unlink system call for files, which removes the directory entry. The file data is only freed when all hard links and open file descriptors are closed. For directories, it uses rmdir after recursively unlinking contents.',
    mistakes: [
      'Running rm -rf with a variable that could be empty or /, potentially wiping the entire filesystem. Always validate variables first.',
      'Forgetting that rm is permanent on most Linux systems. There is no trash. Consider using trash-cli or an alias.',
      'Using rm -rf on symlinked directories without understanding it follows the link and deletes the target contents',
    ],
    bestPractices: [
      'Use rm -i for interactive confirmation on important deletions',
      'Double-check your path with echo or ls before running rm -rf',
      'In scripts, use set -u to catch unset variables that could produce dangerous rm commands',
      'Consider trash-cli or gio trash as safer alternatives to permanent deletion',
    ],
  },

  mkdir: {
    useCases: [
      'Create one or more new directories',
      'Set up project directory structures in one command',
      'Ensure a required directory exists before writing files',
    ],
    mistakes: [
      'Forgetting -p when creating nested directories like mkdir a/b/c, which fails if a/b does not exist',
      'Creating directories with spaces or special characters without quoting the path',
    ],
    bestPractices: [
      'Always use mkdir -p to create parent directories as needed and avoid errors if the directory already exists',
      'Use -m to set permissions at creation time, e.g., mkdir -m 700 secrets',
      'Combine with curly brace expansion: mkdir -p project/{src,tests,docs} to create multiple directories at once',
    ],
  },

  touch: {
    useCases: [
      'Create a new empty file quickly',
      'Update the modification timestamp of a file without changing its content',
      'Create placeholder files or lock files in scripts',
    ],
    internals:
      'touch calls the utimensat system call to update file access and modification times. If the file does not exist, it creates it with open() using default permissions.',
    mistakes: [
      'Assuming touch only creates files when it primarily updates timestamps on existing files',
      'Using touch in scripts where you need atomic file creation. Use a proper lock mechanism instead.',
    ],
    bestPractices: [
      'Use touch -d or touch -t to set a specific timestamp instead of the current time',
      'For creating files with specific content, prefer echo or printf redirected to a file',
    ],
  },

  find: {
    useCases: [
      'Locate files by name, type, size, modification time, or permissions',
      'Execute commands on each matching file using -exec',
      'Clean up old files, e.g., delete logs older than 30 days',
      'Search across directory trees when grep alone is not sufficient',
    ],
    internals:
      'find walks the directory tree using opendir/readdir and applies each predicate (test) in order. It short-circuits evaluation, so putting cheaper tests first improves performance. The -exec action forks a new process per match unless you use + to batch arguments.',
    mistakes: [
      'Forgetting to quote the pattern in -name "*.txt", causing the shell to glob-expand it before find sees it',
      'Using -exec with ; instead of + when operating on many files, spawning one process per file instead of batching',
      'Not specifying a starting directory, which defaults to the current directory and may search unintended locations',
    ],
    bestPractices: [
      'Put more restrictive filters first (e.g., -type f before -name) for faster evaluation',
      'Use -exec ... + instead of -exec ... ; to batch arguments and reduce process overhead',
      'Use -print0 paired with xargs -0 for filenames containing spaces or special characters',
      'Combine with -prune to skip directories you do not want to descend into',
    ],
  },

  cat: {
    useCases: [
      'Display the contents of small files in the terminal',
      'Concatenate multiple files into one output or file',
      'Pipe file content to other commands for further processing',
    ],
    internals:
      'cat reads each file sequentially using read system calls and writes to stdout. It is intentionally simple, doing no formatting or pagination.',
    mistakes: [
      'Using cat to feed a single file into a pipe (useless use of cat). Use input redirection instead: grep pattern < file',
      'Using cat on large binary files, which floods the terminal with garbage characters',
      'Forgetting that cat file1 file2 > file1 truncates file1 before reading it, losing its contents',
    ],
    bestPractices: [
      'Use cat -n to display line numbers for debugging',
      'Use less or bat for reading large files interactively instead of cat',
      'Prefer input redirection (< file) over cat file | when piping a single file into a command',
    ],
  },

  head: {
    useCases: [
      'Preview the first few lines of a file quickly',
      'Check file headers, column names in CSVs, or format before processing',
      'Limit output from a pipe to the first N lines',
    ],
    internals:
      'head reads from the file or stdin until it has emitted the requested number of lines or bytes, then closes the input. When piped, this sends SIGPIPE to the upstream command, stopping it early.',
    mistakes: [
      'Not knowing you can specify line count with -n, defaulting to 10 which may be too few or too many',
      'Forgetting head -c for byte-based extraction instead of line-based',
    ],
    bestPractices: [
      'Use head -n 1 to quickly grab the first line, useful for CSV headers',
      'Combine with tail to extract a range: head -n 20 file | tail -n 5 gets lines 16 through 20',
    ],
  },

  tail: {
    useCases: [
      'View the last N lines of a file, typically log files',
      'Follow a growing log file in real time with tail -f',
      'Skip a header line and process the rest of a file',
    ],
    internals:
      'tail seeks to the end of the file and reads backward to find the requested number of lines. With -f it uses inotify (Linux) or kqueue (macOS) to watch for new data appended to the file.',
    mistakes: [
      'Using tail -f on a log file that gets rotated without using tail -F, which reopens the file after rotation',
      'Forgetting tail -n +2 to skip a header line, using tail -n -1 instead which gives only the last line',
    ],
    bestPractices: [
      'Use tail -F (capital F) to follow log files that may be rotated',
      'Use tail -n +N to print from line N onward, useful for skipping headers',
      'Combine with grep to monitor logs for specific patterns: tail -F app.log | grep ERROR',
    ],
  },

  ln: {
    useCases: [
      'Create symbolic links to reference files or directories from another location',
      'Set up versioned deployments with a current symlink pointing to the active release',
      'Create hard links to share file data without duplication on the same filesystem',
    ],
    internals:
      'Symbolic links create a new inode that stores a path string pointing to the target. Hard links add a new directory entry pointing to the same inode as the target, sharing the actual data blocks. Hard links cannot cross filesystem boundaries.',
    mistakes: [
      'Confusing argument order: it is ln -s target linkname, not the other way around',
      'Trying to create hard links to directories, which is not allowed on most systems',
      'Creating relative symlinks without realizing they resolve relative to the link location, not the current directory',
    ],
    bestPractices: [
      'Use ln -sf to force-replace an existing symlink atomically',
      'Prefer symbolic links over hard links for clarity and cross-filesystem compatibility',
      'Use absolute paths for symlinks that may be moved, or deliberately use relative paths for portable trees',
    ],
  },

  less: {
    useCases: [
      'Read and navigate through large files without loading them entirely into memory',
      'Search within file content interactively using / and ?',
      'View command output page by page when it exceeds the terminal height',
    ],
    internals:
      'less reads the file on demand, buffering only what is needed for display. It uses termcap/terminfo for terminal control and supports backward navigation by keeping a buffer of previously read data.',
    mistakes: [
      'Not knowing the search shortcuts: / for forward search, ? for backward search, n/N to repeat',
      'Forgetting to use less -R to properly display colored output from commands like grep --color',
    ],
    bestPractices: [
      'Set LESS="-R" in your environment to always handle ANSI color codes properly',
      'Use less +F to enter follow mode (like tail -f) and press Ctrl+C to stop following',
      'Press v while in less to open the file in your default editor',
    ],
  },

  tree: {
    useCases: [
      'Visualize directory structure as an indented tree diagram',
      'Generate directory listings for documentation or README files',
      'Quickly audit folder depth and organization of a project',
    ],
    mistakes: [
      'Running tree on a very large directory without depth limits, producing overwhelming output',
      'Forgetting to filter with -I to ignore node_modules, .git, or other bulky directories',
    ],
    bestPractices: [
      'Use tree -L 2 to limit depth and keep output manageable',
      'Use tree -I "node_modules|.git" to ignore common large directories',
      'Use tree -a to include hidden files and tree --dirsfirst to list directories before files',
    ],
  },

  rename: {
    useCases: [
      'Batch rename files using Perl regular expressions',
      'Change file extensions for a set of files in one command',
      'Standardize naming conventions across a directory of files',
    ],
    internals:
      'The Perl rename command evaluates a Perl expression against each filename and calls rename() to apply the transformation. It is not the same as the util-linux rename which uses simple string replacement.',
    mistakes: [
      'Confusing the Perl rename (prename) with the util-linux rename, which have completely different syntax',
      'Forgetting to use -n (dry run) first to preview changes before actually renaming',
      'Not escaping special regex characters in filenames, causing unintended matches',
    ],
    bestPractices: [
      'Always run rename -n first to preview what will change before committing',
      'Use rename on a test set of files before applying to an entire directory',
      'Prefer the Perl rename (prename) for complex pattern-based renaming tasks',
    ],
  },

  realpath: {
    useCases: [
      'Resolve symbolic links and relative paths to an absolute canonical path',
      'Get the true location of a file for use in scripts that need deterministic paths',
      'Verify where a symlink actually points',
    ],
    bestPractices: [
      'Use realpath --relative-to=DIR to compute relative paths between two locations',
      'In scripts, use realpath to normalize user-provided paths before operating on them',
    ],
  },

  basename: {
    useCases: [
      'Extract the filename from a full path, stripping the directory portion',
      'Remove a file extension for generating output filenames in scripts',
      'Process paths in loops to isolate just the file component',
    ],
    bestPractices: [
      'Use basename with a suffix argument to strip extensions: basename file.tar.gz .tar.gz returns file',
      'In bash, prefer ${var##*/} for the same effect without spawning a subprocess',
    ],
  },

  rmdir: {
    useCases: [
      'Remove empty directories safely, unlike rm -rf which deletes contents too',
      'Clean up empty directories after moving or deleting their contents',
      'Verify a directory is empty before removing it, since rmdir fails on non-empty directories',
    ],
    mistakes: [
      'Expecting rmdir to remove directories with contents. It only removes empty directories.',
      'Not using -p to remove parent directories that become empty after the child is removed',
    ],
    bestPractices: [
      'Use rmdir -p to remove a directory and its empty parent directories in one step',
      'Prefer rmdir over rm -rf when you intentionally want to fail on non-empty directories as a safety check',
    ],
  },

  dirname: {
    useCases: [
      'Extract the directory portion from a full file path',
      'Determine the parent directory of a script for locating relative resources',
      'Build paths dynamically in shell scripts',
    ],
    bestPractices: [
      'In scripts, use DIR=$(dirname "$0") to find the directory of the currently running script',
      'In bash, prefer ${var%/*} for the same effect without spawning a subprocess',
    ],
  },

  chroot: {
    useCases: [
      'Run a process with an alternate root filesystem for isolation',
      'Repair a broken system by chrooting into its mounted filesystem from a live USB',
      'Create lightweight sandboxes for building or testing software',
    ],
    internals:
      'chroot calls the chroot() system call which changes the root directory for the calling process and its children. It does not provide full isolation like containers. Processes can escape a chroot if they have root privileges.',
    mistakes: [
      'Expecting chroot to be a security boundary. A root user inside a chroot can escape it.',
      'Forgetting to set up essential files inside the chroot such as /dev, /proc, and required libraries',
      'Not binding or copying DNS resolver configuration (/etc/resolv.conf) leading to no network name resolution',
    ],
    bestPractices: [
      'Mount /proc, /sys, and /dev before chrooting for a functional environment',
      'Use unshare or containers instead of chroot when you need actual security isolation',
      'Copy or bind-mount required shared libraries and binaries into the chroot',
    ],
  },

  mktemp: {
    useCases: [
      'Create a temporary file or directory with a unique name safely',
      'Avoid race conditions when multiple scripts need temp files simultaneously',
      'Store intermediate results in scripts that clean up after themselves',
    ],
    internals:
      'mktemp generates a unique name using a random suffix and creates the file atomically with exclusive open flags (O_EXCL), preventing race conditions between name generation and file creation.',
    mistakes: [
      'Not cleaning up temp files after use, leaving clutter in /tmp',
      'Hardcoding temp file names instead of using mktemp, creating race condition vulnerabilities',
    ],
    bestPractices: [
      'Always store the result in a variable: TMPFILE=$(mktemp) and use a trap to clean up on exit',
      'Use mktemp -d to create a temporary directory when you need multiple temp files',
      'Set up a trap: trap "rm -f $TMPFILE" EXIT to ensure cleanup even on errors',
    ],
  },

  install: {
    useCases: [
      'Copy files while setting permissions, ownership, and creating directories in one step',
      'Deploy binaries to system directories with correct mode bits during make install',
      'Replace the common pattern of mkdir + cp + chmod with a single atomic command',
    ],
    internals:
      'install combines the functionality of cp, mkdir -p, chmod, and chown into a single command. It copies the file and then sets the specified attributes. It always creates a new copy, never a hard link.',
    mistakes: [
      'Using install on directories that already contain files you want to keep, since it does not merge',
      'Forgetting to specify -m for the file mode, which defaults to 755',
    ],
    bestPractices: [
      'Use install -D to create all leading directories automatically',
      'Specify -m explicitly for clarity: install -m 644 config.conf /etc/myapp/',
      'Use install -o and -g to set owner and group in a single step during deployment',
    ],
  },

  // ─── NETWORKING (28) ────────────────────────────────────────────────

  ping: {
    useCases: [
      'Test basic network connectivity to a host',
      'Measure round-trip latency to a server',
      'Diagnose DNS resolution problems by pinging a hostname vs an IP',
    ],
    internals:
      'ping sends ICMP Echo Request packets to the target host and listens for Echo Reply packets. It calculates round-trip time from the timestamp difference. Root or setuid is typically required because it uses raw sockets.',
    mistakes: [
      'Assuming a host is down because ping fails, when the host may simply be blocking ICMP traffic',
      'Running ping without -c on Linux, which pings indefinitely until manually stopped',
    ],
    bestPractices: [
      'Use ping -c 4 to send a fixed number of pings and get summary statistics',
      'Use ping -W to set a timeout for unresponsive hosts so the command does not hang',
      'Test against a known IP like 8.8.8.8 alongside a hostname to distinguish DNS issues from network issues',
    ],
  },

  curl: {
    useCases: [
      'Make HTTP requests to test APIs and download web content',
      'Send POST, PUT, and other HTTP methods with custom headers and bodies',
      'Debug HTTP responses including headers, status codes, and timing',
      'Download files from the web with resume support',
    ],
    internals:
      'curl uses libcurl to handle protocol negotiation, TLS handshakes, connection pooling, and data transfer. It supports over 25 protocols including HTTP, FTP, SMTP, and SCP. Redirects are not followed by default.',
    mistakes: [
      'Forgetting -L to follow redirects, getting a 301/302 response instead of the actual content',
      'Not using -o or -O when downloading files, dumping binary content into the terminal',
      'Passing sensitive data on the command line where it appears in process listings. Use --data @file instead.',
    ],
    bestPractices: [
      'Use curl -sS for scripting: silent mode but still showing errors',
      'Use curl -w to get detailed timing info for performance debugging',
      'Use -H to set custom headers and -d for POST data',
      'Use --fail (-f) in scripts to return a non-zero exit code on HTTP errors',
    ],
  },

  wget: {
    useCases: [
      'Download files from the web with automatic retry on failure',
      'Mirror entire websites for offline browsing',
      'Download files in the background with resume support',
    ],
    internals:
      'wget handles HTTP, HTTPS, and FTP protocols. It supports recursive downloading by parsing HTML for links. It writes directly to disk by default, making it memory-efficient for large downloads.',
    mistakes: [
      'Using recursive download without depth limits, potentially downloading an entire website',
      'Not using --no-clobber or --continue, re-downloading files that already exist',
      'Forgetting to set --user-agent when servers block default wget requests',
    ],
    bestPractices: [
      'Use wget -c to resume interrupted downloads',
      'Use wget -q for quiet mode in scripts, or -nv for non-verbose progress',
      'Set --retry-connrefused and --waitretry for resilient downloads in automated scripts',
    ],
  },

  ssh: {
    useCases: [
      'Connect to remote servers securely for administration',
      'Execute commands on remote machines without an interactive session',
      'Create secure tunnels for accessing services behind firewalls',
      'Forward ports to access remote services locally',
    ],
    internals:
      'ssh establishes an encrypted channel using a key exchange (typically Diffie-Hellman), authenticates the server via its host key, then authenticates the user via password or public key. All communication is encrypted with symmetric ciphers like AES.',
    mistakes: [
      'Not verifying the host key fingerprint on first connection, making you vulnerable to MITM attacks',
      'Setting overly permissive permissions on private keys. SSH requires 600 or stricter on key files.',
      'Forgetting to use ssh-agent or key forwarding and typing passphrases repeatedly',
    ],
    bestPractices: [
      'Use SSH key authentication instead of passwords for better security and convenience',
      'Configure frequently used connections in ~/.ssh/config for shorter commands',
      'Use ssh -L for local port forwarding and -R for reverse port forwarding',
      'Use ssh -J for jump hosts (ProxyJump) instead of multiple manual hops',
    ],
  },

  scp: {
    useCases: [
      'Copy files between local and remote machines over SSH',
      'Transfer files securely when rsync is not available',
      'Quick one-off file transfers to/from servers',
    ],
    internals:
      'scp uses the SSH protocol for data transfer, establishing an encrypted connection and then copying file data through it. The legacy SCP protocol has been replaced by SFTP internally in modern OpenSSH.',
    mistakes: [
      'Forgetting -r to copy directories recursively',
      'Using scp for large or frequent transfers when rsync would be more efficient due to delta transfers',
      'Not quoting remote paths with spaces or special characters',
    ],
    bestPractices: [
      'Prefer rsync or sftp over scp for large transfers since they support resume and delta sync',
      'Use -C for compression on slow connections',
      'Use scp -P (capital P) to specify a non-default SSH port',
    ],
  },

  netstat: {
    useCases: [
      'List all active network connections and listening ports',
      'Identify which process is using a specific port',
      'View network interface statistics and routing tables',
    ],
    internals:
      'netstat reads from /proc/net/ on Linux to gather TCP, UDP, and Unix socket information. It maps socket inodes to processes by scanning /proc/*/fd. On modern systems, ss is preferred as it reads directly from kernel netlink sockets.',
    mistakes: [
      'Running without sudo, which hides process names and PIDs for sockets owned by other users',
      'Using netstat on modern systems where ss provides the same info faster and with more detail',
    ],
    bestPractices: [
      'Use netstat -tulnp to see TCP/UDP listening ports with process names and numeric addresses',
      'Prefer ss over netstat on modern Linux systems for better performance',
      'Use netstat -s for protocol-level statistics when diagnosing network issues',
    ],
  },

  traceroute: {
    useCases: [
      'Diagnose network path issues by showing each hop between you and a destination',
      'Identify where packet loss or high latency occurs in the route',
      'Verify routing changes or detect unexpected network paths',
    ],
    internals:
      'traceroute sends packets with incrementally increasing TTL values starting from 1. Each router along the path decrements the TTL and sends back an ICMP Time Exceeded message when it reaches zero, revealing its address. The final destination responds normally.',
    mistakes: [
      'Assuming asterisks (*) mean a router is down when many routers are configured to not respond to traceroute probes',
      'Not realizing that traceroute may use UDP by default on Linux but ICMP on macOS, giving different results',
    ],
    bestPractices: [
      'Use mtr instead of traceroute for continuous path monitoring with statistics',
      'Try both UDP (-U) and ICMP (-I) modes if you see many timeouts, as some routers filter one protocol but not the other',
      'Use traceroute -n to skip DNS lookups for faster results',
    ],
  },

  ifconfig: {
    useCases: [
      'View IP addresses and network interface configuration',
      'Bring network interfaces up or down manually',
      'Check interface statistics like packet counts and errors',
    ],
    internals:
      'ifconfig uses ioctl system calls (SIOCGIFADDR, SIOCGIFFLAGS, etc.) to query and configure network interfaces. It is part of the legacy net-tools package and does not support newer networking features.',
    mistakes: [
      'Using ifconfig on modern Linux where it is deprecated in favor of the ip command',
      'Expecting ifconfig changes to persist across reboots without editing network configuration files',
    ],
    bestPractices: [
      'Use the ip command instead of ifconfig on modern Linux systems for more features and better output',
      'Use ifconfig only on older systems or macOS where ip may not be available',
      'For persistent network configuration, edit the appropriate config files or use NetworkManager/netplan',
    ],
  },

  dig: {
    useCases: [
      'Query DNS records for a domain (A, AAAA, MX, NS, TXT, CNAME, etc.)',
      'Debug DNS resolution issues and check propagation of DNS changes',
      'Verify DNSSEC signatures and chain of trust',
    ],
    internals:
      'dig constructs DNS query packets and sends them to the specified or system-configured resolver. It displays the raw DNS response including all sections (question, answer, authority, additional) and timing information.',
    mistakes: [
      'Querying the default system resolver instead of an authoritative server when checking DNS propagation',
      'Not specifying the record type explicitly, which defaults to A and misses MX, TXT, or other records',
    ],
    bestPractices: [
      'Use dig +short for concise output when you just need the answer',
      'Query authoritative nameservers directly with dig @ns1.example.com example.com to bypass caching',
      'Use dig +trace to follow the full delegation chain from root servers',
      'Use dig -x for reverse DNS lookups (PTR records)',
    ],
  },

  nslookup: {
    useCases: [
      'Quick DNS lookups when dig is not available',
      'Interactive DNS querying with multiple queries in one session',
      'Simple forward and reverse DNS resolution checks',
    ],
    internals:
      'nslookup sends DNS queries similarly to dig but with a simpler output format. It can run in interactive mode where you can set the query type and server for multiple lookups.',
    mistakes: [
      'Relying on nslookup output format for scripting when dig +short is more reliable and parseable',
      'Not knowing that nslookup uses its own resolver library, not the system resolver, which can give different results from host or getent',
    ],
    bestPractices: [
      'Prefer dig over nslookup for detailed DNS troubleshooting',
      'Use nslookup -type=mx domain.com to query specific record types',
      'Use nslookup for quick ad-hoc lookups where dig is overkill',
    ],
  },

  host: {
    useCases: [
      'Perform simple DNS lookups with clean output',
      'Quick reverse DNS lookups on IP addresses',
      'Check if a domain resolves correctly after DNS changes',
    ],
    bestPractices: [
      'Use host for quick lookups and dig for detailed troubleshooting',
      'Use host -t to specify record type: host -t MX example.com',
      'Use host IP_ADDRESS for quick reverse DNS lookups',
    ],
  },

  whois: {
    useCases: [
      'Look up domain registration details and expiration dates',
      'Find the owner or registrar of a domain name',
      'Check IP address allocation and network ownership',
    ],
    mistakes: [
      'Expecting complete owner details when many domains use privacy protection services',
      'Querying the wrong whois server for non-standard TLDs',
    ],
    bestPractices: [
      'Use whois to check domain expiration dates before they lapse',
      'Combine with dig to get a full picture of a domain and its DNS configuration',
    ],
  },

  rsync: {
    useCases: [
      'Synchronize files between local and remote directories efficiently',
      'Create incremental backups that only transfer changed data',
      'Mirror directories with deletion of files removed from the source',
      'Transfer large datasets with resume support on interrupted connections',
    ],
    internals:
      'rsync uses a delta-transfer algorithm that computes rolling checksums on both sides and only sends the differences. For new files it transfers the entire file. It communicates over SSH by default for remote transfers.',
    mistakes: [
      'Forgetting the trailing slash on the source directory, which changes whether the directory itself or its contents are synced',
      'Using --delete without a dry run first, accidentally removing files at the destination',
      'Not using -a (archive mode) and losing permissions, timestamps, or symlinks during transfer',
    ],
    bestPractices: [
      'Always use -a (archive) for preserving file attributes and recursive copying',
      'Run rsync -n (dry run) before using --delete to preview what will be removed',
      'Use rsync -avz for compressed, verbose transfers with full attribute preservation',
      'Use --exclude to skip files like .git or node_modules',
    ],
  },

  nc: {
    useCases: [
      'Test TCP/UDP connectivity to a specific host and port',
      'Create simple client-server connections for debugging',
      'Transfer files between machines without setting up a full service',
      'Scan ports to check which services are running',
    ],
    internals:
      'netcat (nc) opens raw TCP or UDP sockets and connects stdin/stdout to the network stream. It can operate as either a client or a server (with -l), making it extremely versatile for ad-hoc networking.',
    mistakes: [
      'Leaving a listening nc process running unintentionally, creating an open backdoor',
      'Confusing the different netcat implementations (GNU, OpenBSD, ncat) which have different flags',
      'Forgetting -u for UDP when testing UDP services',
    ],
    bestPractices: [
      'Use nc -zv for quick port scanning: nc -zv host 80 tests if port 80 is open',
      'Use ncat (from nmap) for a more feature-rich and consistent netcat implementation',
      'Set a timeout with -w to avoid hanging on unresponsive connections',
    ],
  },

  iptables: {
    useCases: [
      'Configure firewall rules to allow or block traffic on a Linux system',
      'Set up port forwarding and NAT for routing traffic',
      'Log and rate-limit incoming connections to prevent abuse',
    ],
    internals:
      'iptables interfaces with the Netfilter framework in the Linux kernel. Rules are organized into tables (filter, nat, mangle) and chains (INPUT, OUTPUT, FORWARD). The kernel evaluates packets against rules in order and applies the first matching rule.',
    mistakes: [
      'Adding a DROP rule for SSH before ensuring you have console access, locking yourself out of the server',
      'Forgetting to save rules with iptables-save, losing all changes on reboot',
      'Inserting rules in the wrong order, since iptables processes rules top to bottom and stops at the first match',
    ],
    bestPractices: [
      'Always keep a rule allowing established/related connections: -m state --state ESTABLISHED,RELATED -j ACCEPT',
      'Use iptables-save and iptables-restore or a persistent service to survive reboots',
      'Consider nftables on modern Linux systems as the successor to iptables',
      'Test rules on a local/console session before applying remotely to avoid lockout',
    ],
  },

  arp: {
    useCases: [
      'View the ARP cache to see IP-to-MAC address mappings on the local network',
      'Diagnose network issues caused by duplicate IP addresses or ARP spoofing',
      'Manually add or remove static ARP entries',
    ],
    internals:
      'ARP (Address Resolution Protocol) maps IPv4 addresses to MAC addresses on local networks. The arp command reads from /proc/net/arp on Linux. Entries expire after a timeout (typically 15-20 minutes) and are refreshed on demand.',
    mistakes: [
      'Using arp on modern systems where the ip neigh command is preferred',
      'Not realizing ARP only works for hosts on the same network segment',
    ],
    bestPractices: [
      'Use ip neigh instead of arp on modern Linux systems',
      'Use arp -a to display all cached entries for troubleshooting local network connectivity',
    ],
  },

  tcpdump: {
    useCases: [
      'Capture and analyze network packets for troubleshooting',
      'Debug protocol-level issues in client-server communication',
      'Monitor traffic on specific ports or interfaces in real time',
      'Save packet captures for later analysis in Wireshark',
    ],
    internals:
      'tcpdump uses libpcap to place the network interface in promiscuous mode and capture packets via the kernel packet filter (BPF). It decodes protocol headers and displays them in a readable format.',
    mistakes: [
      'Capturing without a filter and being overwhelmed by irrelevant traffic',
      'Running tcpdump on a busy interface without limiting capture count (-c) or size, filling up disk',
      'Forgetting to use -w to save captures for later analysis when live output scrolls too fast',
    ],
    bestPractices: [
      'Always use BPF filters to limit capture scope: tcpdump -i eth0 port 443 and host 10.0.0.1',
      'Save captures with -w file.pcap for detailed analysis in Wireshark',
      'Use -n to skip DNS resolution for faster output and -c to limit packet count',
      'Use -A or -X to view packet contents in ASCII or hex for debugging application protocols',
    ],
  },

  nmap: {
    useCases: [
      'Scan a host or network to discover open ports and running services',
      'Audit your own infrastructure for unintended exposed services',
      'Detect OS and service versions on remote machines',
    ],
    internals:
      'nmap sends crafted packets (SYN, ACK, FIN, etc.) and analyzes responses to determine port states (open, closed, filtered). It uses timing algorithms to balance speed and accuracy, and can fingerprint OS and services based on response patterns.',
    mistakes: [
      'Scanning networks you do not own or have permission to scan, which is potentially illegal',
      'Using aggressive timing (-T5) on production networks, causing disruption or triggering IDS alerts',
      'Not running as root, which limits nmap to TCP connect scans instead of faster SYN scans',
    ],
    bestPractices: [
      'Only scan networks you own or have explicit permission to scan',
      'Use -sV for service version detection and -O for OS detection',
      'Start with -sn (ping scan) for host discovery before doing detailed port scans',
      'Use --top-ports 1000 to scan the most common ports quickly',
    ],
  },

  ss: {
    useCases: [
      'List all active network connections and listening sockets',
      'Find which process is using a specific port',
      'Monitor socket statistics for performance tuning',
    ],
    internals:
      'ss queries the kernel directly through netlink sockets, which is significantly faster than netstat reading /proc/net files. It can display detailed TCP state information including congestion control and timer data.',
    mistakes: [
      'Not using -p flag (which requires root) to see process information',
      'Using netstat out of habit when ss provides the same data faster',
    ],
    bestPractices: [
      'Use ss -tulnp as a replacement for netstat -tulnp to list listening ports with process info',
      'Use ss -s for a quick summary of socket statistics',
      'Filter with ss state to show sockets in specific TCP states: ss state established',
    ],
  },

  ip: {
    useCases: [
      'Configure network interfaces, addresses, and routes on modern Linux',
      'View and modify the routing table',
      'Manage ARP/neighbor cache and network namespaces',
    ],
    internals:
      'The ip command from iproute2 uses netlink sockets to communicate with the kernel networking stack directly, which is more efficient and feature-rich than the ioctl-based legacy tools (ifconfig, route, arp).',
    mistakes: [
      'Adding addresses without specifying a subnet mask, defaulting to /32 which is rarely what you want',
      'Expecting ip command changes to persist across reboots without using NetworkManager, netplan, or config files',
    ],
    bestPractices: [
      'Use ip addr instead of ifconfig to view and manage IP addresses',
      'Use ip route instead of route for routing table management',
      'Use ip link to manage interface state (up/down) and properties',
      'Use ip -c (color) for more readable output and ip -br for brief format',
    ],
  },

  mtr: {
    useCases: [
      'Continuously monitor the network path to a host with real-time statistics',
      'Identify intermittent packet loss or latency spikes along a route',
      'Produce a comprehensive network path report for support tickets',
    ],
    internals:
      'mtr combines the functionality of ping and traceroute. It continuously sends probes with incrementing TTL values and calculates per-hop statistics including loss percentage, average latency, jitter, and standard deviation.',
    mistakes: [
      'Running mtr for too short a duration to detect intermittent issues. Let it run for at least a minute.',
      'Not using --report mode when sharing results, as the interactive view cannot be easily copied',
    ],
    bestPractices: [
      'Use mtr --report -c 100 for a clean text report suitable for sharing with ISPs or network teams',
      'Run mtr in both directions (from and to the problem host) to identify asymmetric routing issues',
      'Use mtr -T to use TCP instead of ICMP if ICMP is being filtered',
    ],
  },

  sftp: {
    useCases: [
      'Transfer files interactively over an encrypted SSH connection',
      'Browse and manage remote files when you need more than scp offers',
      'Upload and download files securely from servers that only allow SFTP',
    ],
    internals:
      'SFTP runs the SSH2 file transfer protocol over an SSH connection. Unlike FTP, it uses a single encrypted connection for both commands and data. The protocol is binary and includes operations for reading directories, stat, open, read, write, and more.',
    mistakes: [
      'Confusing SFTP with FTPS (FTP over TLS). They are completely different protocols.',
      'Not using batch mode (-b) for automated transfers in scripts',
    ],
    bestPractices: [
      'Use sftp -b batchfile for automated scripted transfers',
      'Prefer rsync over sftp for syncing directories since rsync handles deltas',
      'Use get -r and put -r for recursive directory transfers',
    ],
  },

  bridge: {
    useCases: [
      'Manage network bridge interfaces that connect multiple network segments',
      'View and configure the MAC address forwarding table',
      'Set up VLAN filtering on bridge ports',
    ],
    internals:
      'The bridge command from iproute2 manages the Linux kernel bridge device via netlink. A bridge works at Layer 2, forwarding Ethernet frames between ports based on learned MAC addresses, essentially acting as a software switch.',
    mistakes: [
      'Confusing brctl (legacy) with the bridge command (modern iproute2)',
      'Not enabling STP (Spanning Tree Protocol) when connecting multiple bridges, risking broadcast storms',
    ],
    bestPractices: [
      'Use bridge instead of the deprecated brctl from bridge-utils',
      'Use bridge fdb show to inspect the MAC forwarding database',
      'Enable STP when bridging multiple network segments to prevent loops',
    ],
  },

  ethtool: {
    useCases: [
      'View and configure network interface hardware settings',
      'Check link speed, duplex mode, and driver information',
      'Enable or disable hardware offloading features for troubleshooting',
    ],
    internals:
      'ethtool communicates with network device drivers through ioctl calls to query and modify NIC (network interface card) parameters. It can access driver-specific features, register dumps, and EEPROM data.',
    mistakes: [
      'Changing offload settings on production interfaces without testing, potentially causing connectivity issues',
      'Not checking ethtool -i for driver information before reporting NIC issues',
    ],
    bestPractices: [
      'Use ethtool -i for driver and firmware info, -S for NIC statistics, and -k for offload settings',
      'Use ethtool to verify autonegotiation and link settings when diagnosing slow network connections',
      'Check ethtool -S for error counters when troubleshooting packet loss',
    ],
  },

  socat: {
    useCases: [
      'Create bidirectional data channels between two addresses (sockets, files, pipes)',
      'Set up TCP/UDP relays and proxies',
      'Test TLS connections or create ad-hoc encrypted tunnels',
      'Connect to serial devices over the network',
    ],
    internals:
      'socat opens two bidirectional byte streams (called addresses) and transfers data between them. It supports a wide range of address types including TCP, UDP, Unix sockets, SSL, EXEC, PTY, and files. It is essentially a more powerful version of netcat.',
    mistakes: [
      'Getting overwhelmed by the complex address syntax. Start with simple TCP examples and build up.',
      'Forgetting that socat creates bidirectional connections by default, which may not be desired',
    ],
    bestPractices: [
      'Use socat as a more capable replacement for nc when you need features like SSL or address rewriting',
      'For TLS testing: socat - OPENSSL:host:443 to connect to an HTTPS server interactively',
      'Use socat for transparent TCP proxying: socat TCP-LISTEN:8080,fork TCP:target:80',
    ],
  },

  httpie: {
    useCases: [
      'Make HTTP requests with a more intuitive syntax than curl',
      'Quickly test and debug REST APIs with formatted and colorized output',
      'Send JSON payloads with simple key=value syntax',
    ],
    internals:
      'HTTPie is a Python-based HTTP client built on the requests library. It automatically formats JSON output, colorizes responses, and handles content type negotiation. It supports sessions, plugins, and authentication schemes.',
    mistakes: [
      'Using the http command for HTTPS URLs and getting confused. HTTPie handles both, but use https for clarity.',
      'Not knowing that = sends string values while := sends raw JSON values in request bodies',
    ],
    bestPractices: [
      'Use http for quick API testing and curl for scripting and automation',
      'Use := for non-string JSON values: http POST api/users age:=30 admin:=true',
      'Use --session to persist cookies and auth across multiple requests',
    ],
  },

  bandwhich: {
    useCases: [
      'Monitor real-time network bandwidth usage per process',
      'Identify which applications are consuming the most bandwidth',
      'View bandwidth breakdown by remote host and connection',
    ],
    internals:
      'bandwhich captures packets using libpcap, maps network connections to processes by reading /proc/net and /proc/pid data, and aggregates bandwidth usage in a terminal UI. It requires root privileges for packet capture.',
    mistakes: [
      'Not running with sudo, which is required for packet capture and process mapping',
      'Expecting it to show historical data. It only monitors real-time traffic.',
    ],
    bestPractices: [
      'Run with sudo bandwhich for full process visibility',
      'Use Tab to switch between different views: total, per-process, and per-connection',
      'Use -i to specify a network interface if you have multiple',
    ],
  },

  'wget-advanced': {
    useCases: [
      'Mirror websites with depth control and domain restrictions',
      'Download files from behind authentication using cookies or credentials',
      'Schedule large batch downloads with rate limiting',
    ],
    internals:
      'wget uses recursive HTML parsing to discover linked resources when mirroring. It respects robots.txt by default and supports HTTP, HTTPS, and FTP with built-in retry logic, proxy support, and bandwidth throttling.',
    mistakes: [
      'Mirroring without --restrict-file-names to handle special characters in URLs',
      'Not using --limit-rate to avoid overwhelming the target server or saturating your own bandwidth',
      'Forgetting --convert-links when mirroring for offline viewing, leaving broken internal URLs',
    ],
    bestPractices: [
      'Use wget --mirror -p --convert-links for offline-viewable site mirrors',
      'Rate limit with --limit-rate=200k to be polite to the server',
      'Use --warc-file to create WARC archives for proper web archival',
      'Combine --accept and --reject to filter file types during recursive downloads',
    ],
  },

  // ─── SYSTEM INFO (16) ──────────────────────────────────────────────

  uname: {
    useCases: [
      'Check the kernel version and operating system type',
      'Determine the system architecture (x86_64, ARM, etc.)',
      'Write portable scripts that adapt behavior based on the OS or architecture',
    ],
    internals:
      'uname calls the uname() system call which returns a struct containing system name, node name, release, version, and machine architecture. The kernel populates these values at compile/boot time.',
    mistakes: [
      'Using uname -a in scripts and parsing the full output, which varies across systems. Use specific flags like -s, -r, or -m instead.',
    ],
    bestPractices: [
      'Use uname -s for OS name, -r for kernel release, -m for architecture',
      'In scripts, use case statements on uname -s output to handle Linux, Darwin (macOS), and other OSes',
    ],
  },

  hostname: {
    useCases: [
      'Display or set the system hostname',
      'Look up the FQDN (fully qualified domain name) of the machine',
      'Get the IP address associated with the hostname',
    ],
    mistakes: [
      'Setting the hostname without also updating /etc/hostname and /etc/hosts, causing inconsistencies after reboot',
      'Confusing hostname with the DNS name that external systems use to reach the machine',
    ],
    bestPractices: [
      'Use hostname -f for the FQDN and hostname -I for all IP addresses',
      'Use hostnamectl on systemd systems for persistent hostname changes',
    ],
  },

  uptime: {
    useCases: [
      'Check how long the system has been running since last reboot',
      'View the current load averages to assess system busy-ness',
      'Quickly verify if a server was recently rebooted during an incident',
    ],
    internals:
      'uptime reads from /proc/uptime on Linux, which contains two values: total seconds since boot and total idle seconds across all CPUs. Load averages come from /proc/loadavg.',
    bestPractices: [
      'Use uptime -p for a human-readable duration format on Linux',
      'Interpret load averages relative to the number of CPU cores. A load of 4.0 is fine on an 8-core system.',
    ],
  },

  df: {
    useCases: [
      'Check disk space usage and available space on mounted filesystems',
      'Monitor storage capacity before running operations that need disk space',
      'Identify which filesystem a directory resides on',
    ],
    internals:
      'df calls the statfs or statvfs system call on each mounted filesystem to retrieve block counts (total, free, available). The available blocks differ from free blocks because some space is reserved for the root user.',
    mistakes: [
      'Not using -h for human-readable output and struggling to interpret raw block counts',
      'Confusing free space with available space. df shows space available to non-root users, which is less than total free space.',
    ],
    bestPractices: [
      'Use df -h for human-readable sizes and df -T to include filesystem type',
      'Use df -i to check inode usage, as you can run out of inodes before disk space on some filesystems',
      'Use df /path/to/dir to check the specific filesystem for that directory',
    ],
  },

  du: {
    useCases: [
      'Find which directories are using the most disk space',
      'Estimate the size of a directory tree before copying or archiving',
      'Locate large files or directories that can be cleaned up',
    ],
    internals:
      'du walks the directory tree and calls stat on each file to get its block allocation. It counts allocated blocks, not apparent file size, so sparse files may show less than their logical size. It counts hard-linked files only once.',
    mistakes: [
      'Running du on the root filesystem without depth limits, which takes a very long time',
      'Confusing apparent size with actual disk usage, especially with sparse files or filesystem block sizes',
      'Not using --exclude to skip virtual filesystems like /proc or /sys',
    ],
    bestPractices: [
      'Use du -sh for a summary of a single directory and du -sh * to compare items in the current directory',
      'Use du --max-depth=1 to see only top-level subdirectory sizes',
      'Combine with sort: du -sh * | sort -h to find the largest directories quickly',
    ],
  },

  free: {
    useCases: [
      'Check system memory usage including RAM and swap',
      'Determine if the system is under memory pressure or swapping',
      'Monitor available memory before launching memory-intensive tasks',
    ],
    internals:
      'free reads from /proc/meminfo to get kernel memory statistics. The available column (added in kernel 3.14) estimates how much memory is available for starting new applications without swapping, accounting for reclaimable caches.',
    mistakes: [
      'Misinterpreting used memory as a problem. Linux uses free RAM for disk caching, which is normal and beneficial.',
      'Looking at the free column instead of available, which is the actual amount usable by new applications',
    ],
    bestPractices: [
      'Use free -h for human-readable sizes',
      'Look at the available column, not free, to gauge actual usable memory',
      'Use free -s 5 to monitor memory usage every 5 seconds',
    ],
  },

  who: {
    useCases: [
      'See which users are currently logged into the system',
      'Check when users logged in and from which terminal or host',
      'Verify your own login session details',
    ],
    internals:
      'who reads the utmp file (/var/run/utmp) which tracks current user sessions. The login process writes entries when users authenticate and removes them on logout.',
    bestPractices: [
      'Use who -b to see the last system boot time',
      'Use w (a related command) for more detail including what each user is running',
      'Use last (reads wtmp) for login history, not just current sessions',
    ],
  },

  env: {
    useCases: [
      'Display all current environment variables',
      'Run a command with modified environment variables without affecting the current shell',
      'Clear the environment and run a command with only specified variables',
    ],
    internals:
      'env modifies the environment array and then calls execvp to run the specified command. Without arguments, it prints the current environment by iterating over the environ pointer array.',
    mistakes: [
      'Confusing env with export. env runs a single command with modified variables, while export sets variables for the current shell and all future child processes.',
      'Using env to set variables permanently, which it does not. Changes only apply to the spawned command.',
    ],
    bestPractices: [
      'Use env -i to start with a completely clean environment for reproducible testing',
      'Use env VAR=value command to temporarily override variables for a single command',
      'The shebang #!/usr/bin/env python3 is more portable than hardcoding the Python path',
    ],
  },

  lscpu: {
    useCases: [
      'View CPU architecture, core count, thread count, and cache sizes',
      'Check if virtualization extensions (VT-x, AMD-V) are available',
      'Determine NUMA topology for performance tuning',
    ],
    internals:
      'lscpu reads from /proc/cpuinfo and sysfs entries under /sys/devices/system/cpu to gather CPU topology, features, and capabilities. It also reads SMBIOS/DMI data for physical CPU information.',
    bestPractices: [
      'Use lscpu to quickly check how many cores and threads are available before tuning parallelism',
      'Check the Virtualization field to verify if hardware virtualization is enabled',
      'Use lscpu --extended for per-CPU details in NUMA systems',
    ],
  },

  lshw: {
    useCases: [
      'Get a detailed hardware inventory of the entire system',
      'Identify hardware models, serial numbers, and firmware versions',
      'Troubleshoot hardware compatibility or driver issues',
    ],
    internals:
      'lshw reads hardware information from multiple kernel sources: /proc, /sys, DMI/SMBIOS tables, and device-specific interfaces. It requires root access for complete information including serial numbers and firmware versions.',
    mistakes: [
      'Running without sudo, which results in incomplete information for many hardware classes',
      'Expecting accurate information in virtual machines, where hardware details may be emulated or unavailable',
    ],
    bestPractices: [
      'Run sudo lshw -short for a concise hardware summary',
      'Use lshw -class network or lshw -class disk to filter by hardware class',
      'Use lshw -html to generate an HTML hardware report',
    ],
  },

  lspci: {
    useCases: [
      'List all PCI devices including GPUs, network cards, and storage controllers',
      'Identify hardware models for driver installation',
      'Troubleshoot device detection issues',
    ],
    internals:
      'lspci reads from /sys/bus/pci/devices and the PCI configuration space to enumerate devices. It uses the pci.ids database to translate vendor and device IDs into human-readable names.',
    bestPractices: [
      'Use lspci -v for detailed information about each device including driver in use',
      'Use lspci -nn to show both names and numeric vendor/device IDs for driver searches',
      'Use lspci -k to see which kernel driver is bound to each device',
    ],
  },

  lsusb: {
    useCases: [
      'List all USB devices connected to the system',
      'Identify vendor and product IDs for USB device configuration',
      'Verify that a USB device is detected by the system',
    ],
    internals:
      'lsusb reads from /sys/bus/usb/devices and uses the usb.ids database to translate vendor and product IDs. It can also query USB device descriptors directly for detailed information.',
    bestPractices: [
      'Use lsusb -v for detailed descriptor information about each device',
      'Use lsusb -t for a tree view showing the USB bus topology',
      'Combine with dmesg to correlate USB detection events with device entries',
    ],
  },

  printenv: {
    useCases: [
      'Display the value of a specific environment variable',
      'List all environment variables, similar to env but without the command-execution feature',
      'Check if a variable is exported (available in the environment) vs only set in the shell',
    ],
    bestPractices: [
      'Use printenv VAR_NAME to check a specific variable without the noise of all variables',
      'Prefer printenv over echo $VAR in scripts because printenv fails clearly if the variable does not exist',
    ],
  },

  arch: {
    useCases: [
      'Quickly check the system CPU architecture (equivalent to uname -m)',
      'Determine if the system is running x86_64, ARM, or another architecture',
      'Decide which binary or package architecture to download',
    ],
    bestPractices: [
      'Use arch as a quick shorthand for uname -m in interactive sessions',
      'In scripts, prefer uname -m as it is more widely available across Unix systems',
    ],
  },

  nproc: {
    useCases: [
      'Get the number of available processing units for parallelism tuning',
      'Set the number of parallel jobs in build systems like make -j$(nproc)',
      'Write scripts that automatically scale with available CPU cores',
    ],
    internals:
      'nproc reads from /sys/devices/system/cpu or the sched_getaffinity system call to determine how many CPUs are available to the current process, respecting cgroup limits and CPU affinity masks.',
    bestPractices: [
      'Use nproc in build commands: make -j$(nproc) to use all available cores',
      'Use nproc --all to get the total count ignoring affinity restrictions',
      'Subtract one core for responsiveness: make -j$(($(nproc) - 1)) to keep the system interactive during builds',
    ],
  },

  locale: {
    useCases: [
      'Display or configure the system locale and language settings',
      'Troubleshoot character encoding issues in terminal output',
      'Verify locale settings before running tools that depend on proper encoding',
    ],
    mistakes: [
      'Having inconsistent locale settings across LC_* variables, causing unexpected behavior in sorting or character handling',
      'Not generating needed locales on the system (locale-gen) before trying to use them',
    ],
    bestPractices: [
      'Use locale to display current settings and locale -a to list all available locales',
      'Set LC_ALL=C for consistent, locale-independent behavior in scripts (especially for sort and grep)',
      'Use UTF-8 locales (e.g., en_US.UTF-8) for modern applications that handle international characters',
    ],
  },

  // ─── TEXT PROCESSING (23) ──────────────────────────────────────────

  grep: {
    useCases: [
      'Search for patterns or text strings in files or command output',
      'Filter log files for specific errors, timestamps, or events',
      'Find files containing a specific code pattern across a codebase',
      'Validate input by checking if it matches an expected pattern',
    ],
    internals:
      'grep compiles the pattern into a finite automaton and scans each line of input. It uses optimized algorithms like Boyer-Moore for fixed strings and DFA/NFA for regexes. With -r it walks directory trees and filters by file type.',
    mistakes: [
      'Forgetting -E for extended regex (or using egrep) and wondering why +, |, and () do not work',
      'Not quoting the pattern, allowing the shell to interpret special characters before grep sees them',
      'Using grep -r on huge directory trees without --include to filter file types, making it very slow',
    ],
    bestPractices: [
      'Use grep -rn for recursive search with line numbers to quickly locate matches',
      'Use grep -i for case-insensitive matching and -w for whole-word matching',
      'Use grep -c to count matches instead of piping to wc -l',
      'Use grep --include="*.py" to restrict search to specific file types',
    ],
  },

  sed: {
    useCases: [
      'Find and replace text in files or streams',
      'Delete, insert, or transform specific lines based on patterns or line numbers',
      'Process text in pipelines for batch editing tasks',
    ],
    internals:
      'sed reads input line by line into a pattern space, applies commands in order, then outputs the result. It supports a hold space for multi-line operations. sed compiles its script into an internal representation for efficient processing.',
    mistakes: [
      'Forgetting that sed -i behaves differently on macOS (requires a backup extension like -i .bak) vs Linux',
      'Not escaping forward slashes in patterns when using / as the delimiter. Use a different delimiter like sed "s|old|new|g".',
      'Assuming sed uses the same regex flavor as grep or Perl. Basic regex is the default unless you use -E.',
    ],
    bestPractices: [
      'Use sed -i.bak for in-place edits with a backup file for safety',
      'Use alternative delimiters when the pattern contains slashes: sed "s|/old/path|/new/path|g"',
      'Use -E for extended regex to avoid excessive escaping',
      'Test sed commands without -i first to verify the output before modifying files',
    ],
  },

  awk: {
    useCases: [
      'Extract and transform specific columns from structured text data',
      'Perform calculations and aggregations on text-based data files',
      'Generate formatted reports from log files or CSV data',
      'Process text when sed is too limited but a full scripting language is overkill',
    ],
    internals:
      'awk splits each input line into fields using the field separator (FS, default whitespace). It executes a program consisting of pattern-action pairs: for each line matching a pattern, the associated action runs. It supports variables, arrays, functions, and printf.',
    mistakes: [
      'Using $0 when you mean a specific field ($1, $2, etc.). $0 is the entire line.',
      'Forgetting to set the field separator with -F when processing CSVs or other delimited data',
      'Quoting issues: awk programs should be in single quotes to prevent shell interpretation of $',
    ],
    bestPractices: [
      'Use -F to set the field separator: awk -F, for CSV or awk -F: for /etc/passwd',
      'Use BEGIN and END blocks for initialization and summary output',
      'Use awk for column extraction instead of cut when you need flexible whitespace handling',
      'Prefer awk over complex sed+grep chains for structured data processing',
    ],
  },

  sort: {
    useCases: [
      'Sort lines of text alphabetically, numerically, or by specific fields',
      'Prepare data for uniq, join, or comm which require sorted input',
      'Find the top/bottom N items by sorting and piping to head/tail',
    ],
    internals:
      'sort uses a merge sort algorithm optimized for large files. For data that exceeds memory, it performs an external sort using temporary files. It is locale-aware, which affects collation order.',
    mistakes: [
      'Sorting numbers alphabetically (10 comes before 2) instead of using -n for numeric sort',
      'Not realizing that sort is locale-dependent. LC_ALL=C sort gives byte-order sorting which is faster and more predictable.',
      'Forgetting -t to set the field delimiter when sorting by a specific column',
    ],
    bestPractices: [
      'Use sort -n for numeric sorting and sort -h for human-readable sizes (1K, 2M, 3G)',
      'Use sort -k to sort by specific fields: sort -t, -k2,2n to sort CSV by second column numerically',
      'Use sort -u to sort and deduplicate in one step',
      'Set LC_ALL=C for fastest sorting when locale-specific ordering is not needed',
    ],
  },

  uniq: {
    useCases: [
      'Remove consecutive duplicate lines from sorted input',
      'Count occurrences of each unique line with -c',
      'Find duplicate or unique-only lines in data sets',
    ],
    internals:
      'uniq compares each line with the previous one, so it only detects adjacent duplicates. Input must be sorted first for global deduplication. It reads line by line with constant memory usage.',
    mistakes: [
      'Using uniq on unsorted input and expecting it to remove all duplicates. It only removes consecutive duplicates.',
      'Forgetting to sort first: always use sort | uniq or sort -u for global uniqueness',
    ],
    bestPractices: [
      'Always sort before uniq unless you specifically want to deduplicate consecutive lines only',
      'Use sort | uniq -c | sort -rn to get a frequency count sorted by most common',
      'Use uniq -d to show only duplicated lines and uniq -u to show only unique lines',
    ],
  },

  wc: {
    useCases: [
      'Count lines, words, or characters in files or command output',
      'Quickly check file size in lines for log files or data sets',
      'Count the number of results from grep or find',
    ],
    mistakes: [
      'Relying on wc -c for character count when you actually want wc -m for multibyte characters',
      'Forgetting that wc -l counts newlines, so a file without a trailing newline reports one fewer line than expected',
    ],
    bestPractices: [
      'Use wc -l for line count, which is the most commonly needed metric',
      'Use wc -w for word count in documents and wc -c for byte count',
      'Pipe grep output to wc -l to count matches, or better yet use grep -c directly',
    ],
  },

  diff: {
    useCases: [
      'Compare two files to see what changed between them',
      'Generate patches for distributing code changes',
      'Verify that a transformation or processing step produced expected results',
    ],
    internals:
      'diff uses the Hunt-Szymanski or Myers algorithm to find the longest common subsequence between two files and outputs the minimal set of changes needed to transform one into the other.',
    mistakes: [
      'Not using -u (unified format) which is much more readable and is the standard format for patches',
      'Comparing binary files without --binary flag or expecting meaningful text output from them',
    ],
    bestPractices: [
      'Use diff -u for unified format, the standard for patches and code reviews',
      'Use diff -r to recursively compare directories',
      'Use diff --color for visual highlighting in the terminal',
      'Consider using colordiff or delta for better visual diffs',
    ],
  },

  cut: {
    useCases: [
      'Extract specific columns or fields from delimited text',
      'Pull out character ranges from fixed-width data',
      'Quickly grab a single field from CSV or TSV files',
    ],
    internals:
      'cut reads each line and extracts the specified bytes (-b), characters (-c), or fields (-f) based on a delimiter. It processes one line at a time with minimal memory usage.',
    mistakes: [
      'Forgetting to set the delimiter with -d for non-tab-delimited data, since tab is the default',
      'Trying to use cut on CSV files with quoted fields containing commas. cut does not understand CSV quoting.',
      'Confusing -c (characters) with -b (bytes) when working with multibyte encodings',
    ],
    bestPractices: [
      'Use cut -d, -f2 for simple CSV column extraction, but use awk for complex cases',
      'Use cut -d: -f1 /etc/passwd to extract usernames',
      'Prefer awk over cut when you need flexible field handling or whitespace delimiters',
    ],
  },

  tr: {
    useCases: [
      'Translate, squeeze, or delete characters from text streams',
      'Convert between uppercase and lowercase',
      'Remove or replace specific character classes like digits or whitespace',
    ],
    internals:
      'tr builds a translation table mapping each byte in SET1 to the corresponding byte in SET2 and applies it to every byte in the input. It operates on individual characters, not strings or patterns.',
    mistakes: [
      'Expecting tr to handle multi-character strings or regex patterns. It only operates on single characters.',
      'Using tr with multibyte characters (UTF-8) where it may split characters incorrectly',
    ],
    bestPractices: [
      'Use tr "[:upper:]" "[:lower:]" for portable case conversion',
      'Use tr -s " " to squeeze repeated spaces into a single space',
      'Use tr -d "\\n" to remove all newlines from input',
      'Combine tr -dc for keeping only specific characters: tr -dc "a-zA-Z0-9"',
    ],
  },

  tee: {
    useCases: [
      'Write command output to both the screen and a file simultaneously',
      'Insert a logging point in the middle of a pipeline',
      'Write to files that require sudo while maintaining a pipeline',
    ],
    internals:
      'tee reads from stdin and writes to both stdout and one or more specified files. It uses standard read/write system calls and flushes output to all destinations as data arrives.',
    mistakes: [
      'Forgetting -a to append instead of overwrite, losing existing file content',
      'Not realizing that sudo echo "text" > /root/file fails because the redirect is done by the shell, not sudo. Use echo "text" | sudo tee /root/file instead.',
    ],
    bestPractices: [
      'Use tee -a to append to a file instead of overwriting it',
      'Use tee to write to root-owned files: echo "line" | sudo tee -a /etc/config',
      'Use tee /dev/null when you want to duplicate output without writing to a file',
    ],
  },

  xargs: {
    useCases: [
      'Build and execute commands from stdin, handling argument list limits',
      'Parallelize operations across multiple inputs',
      'Process output from find, grep, or other commands that produce line-separated input',
    ],
    internals:
      'xargs reads items from stdin, splits them by whitespace or the specified delimiter, and builds command lines up to the system ARG_MAX limit. With -P it can run multiple commands in parallel by forking worker processes.',
    mistakes: [
      'Not using -0 with find -print0, breaking on filenames containing spaces or newlines',
      'Forgetting that xargs splits on whitespace by default, which breaks on paths with spaces',
      'Not using -I {} when the argument needs to go in a specific position in the command',
    ],
    bestPractices: [
      'Always pair find -print0 with xargs -0 to handle any filename safely',
      'Use xargs -I {} for commands where the argument goes in a specific place: xargs -I {} cp {} /dest/',
      'Use xargs -P N to run N commands in parallel for faster batch processing',
      'Use xargs -n 1 to run one command per input item instead of batching',
    ],
  },

  paste: {
    useCases: [
      'Merge lines of multiple files side by side with a delimiter',
      'Convert a column of data into a single tab-separated or comma-separated line',
      'Combine columns from different sources into one output',
    ],
    mistakes: [
      'Forgetting to set the delimiter with -d when you need something other than tab',
      'Not using -s when you want to join lines from a single file into one line instead of merging files column-wise',
    ],
    bestPractices: [
      'Use paste -d, to merge with commas for CSV-like output',
      'Use paste -s to serialize lines from a single file into one line',
      'Combine paste with cut for simple column rearrangement tasks',
    ],
  },

  column: {
    useCases: [
      'Format text into aligned columns for readable terminal output',
      'Pretty-print delimited data like CSV or mount output',
      'Create aligned tables from command output in scripts',
    ],
    mistakes: [
      'Not specifying the delimiter with -s or -t, causing misalignment on non-whitespace-delimited input',
      'Expecting column to handle complex CSV with quoted fields',
    ],
    bestPractices: [
      'Use column -t to auto-detect and align columns from whitespace-separated input',
      'Use column -s, -t for comma-delimited input',
      'Pipe command output through column -t for quick formatting: mount | column -t',
    ],
  },

  jq: {
    useCases: [
      'Parse, filter, and transform JSON data from APIs or configuration files',
      'Extract specific fields from complex nested JSON structures',
      'Reformat JSON output for readability or further processing',
      'Perform JSON data transformations in shell pipelines',
    ],
    internals:
      'jq compiles its filter expression into a bytecode program and executes it against the parsed JSON input. It supports a comprehensive expression language with variables, functions, conditionals, and reduce operations.',
    mistakes: [
      'Forgetting to use -r (raw output) and getting quoted strings in the output',
      'Not handling null values which propagate through expressions and cause unexpected results',
      'Using string interpolation when jq expression language features would be cleaner',
    ],
    bestPractices: [
      'Use jq -r for raw string output without JSON quoting',
      'Use jq "." for pretty-printing JSON and jq -c for compact single-line output',
      'Use jq select() to filter arrays: jq ".[] | select(.status == \"active\")"',
      'Use jq --arg to safely pass shell variables into jq expressions',
    ],
  },

  yq: {
    useCases: [
      'Parse, filter, and transform YAML data similar to how jq handles JSON',
      'Edit YAML configuration files programmatically in CI/CD pipelines',
      'Convert between YAML, JSON, and XML formats',
    ],
    internals:
      'yq (the Go version by mikefarah) parses YAML into a node tree and evaluates path expressions against it. It supports in-place editing, multi-document YAML, and anchors/aliases.',
    mistakes: [
      'Confusing the two different yq tools: the Python wrapper around jq and the Go-based yq by mikefarah, which have different syntax',
      'Not using -i for in-place editing and piping output back to the same file, which truncates it',
    ],
    bestPractices: [
      'Use yq -i for in-place file editing instead of redirecting output to the same file',
      'Use yq -o=json to convert YAML to JSON and jq to convert JSON to YAML',
      'Use yq eval-all to merge multiple YAML files',
    ],
  },

  printf: {
    useCases: [
      'Format output with precise control over field widths, padding, and number formatting',
      'Generate formatted strings in scripts without the inconsistencies of echo',
      'Create aligned output or fixed-format data',
    ],
    internals:
      'printf in bash is a builtin that processes format strings similarly to the C printf function. It supports %s (string), %d (integer), %f (float), %x (hex), and width/precision specifiers.',
    mistakes: [
      'Confusing printf with echo. printf does not add a trailing newline unless you include \\n explicitly.',
      'Forgetting that printf reuses the format string if there are more arguments than format specifiers',
    ],
    bestPractices: [
      'Use printf instead of echo for portable and predictable output in scripts',
      'Use printf "%s\\n" to safely print strings that might start with a dash or contain backslashes',
      'Use printf "%-20s %s\\n" to create left-aligned column output',
    ],
  },

  fold: {
    useCases: [
      'Wrap long lines to a specified width for display or formatting',
      'Prepare text for environments with line-length limits like email',
      'Format text output to fit within a terminal width',
    ],
    mistakes: [
      'Using fold without -s, which breaks lines in the middle of words',
      'Not knowing about fmt which does smarter paragraph-aware wrapping',
    ],
    bestPractices: [
      'Use fold -s to break at word boundaries instead of mid-word',
      'Use fold -w 80 for standard terminal width wrapping',
      'Consider fmt instead of fold for paragraph-aware text formatting',
    ],
  },

  split: {
    useCases: [
      'Break large files into smaller chunks for transfer or processing',
      'Split log files or data sets into manageable pieces',
      'Prepare files for systems with file size limits',
    ],
    internals:
      'split reads the input file and writes sequential chunks to output files named with alphabetical suffixes (aa, ab, ac, ...). It can split by line count, byte count, or number of output files.',
    mistakes: [
      'Forgetting to specify a prefix for output files and getting default names like xaa, xab that are hard to identify',
      'Splitting binary files by lines instead of bytes, corrupting the data',
    ],
    bestPractices: [
      'Use split -b 100M for splitting by size and split -l 1000 for splitting by line count',
      'Always specify a meaningful prefix: split -b 100M largefile.tar chunk_',
      'Use cat chunk_* > reassembled_file to recombine split files',
    ],
  },

  comm: {
    useCases: [
      'Compare two sorted files line by line and find common or unique lines',
      'Find lines unique to one file that are not in the other',
      'Perform set operations (union, intersection, difference) on sorted text files',
    ],
    internals:
      'comm reads both files simultaneously, advancing through them in sort order. It outputs three columns: lines unique to file 1, lines unique to file 2, and lines common to both.',
    mistakes: [
      'Using comm on unsorted files, which produces incorrect results without any warning',
      'Confusing the column suppression flags: -1 suppresses file1-only, -2 suppresses file2-only, -3 suppresses common',
    ],
    bestPractices: [
      'Always sort both files before using comm: comm <(sort file1) <(sort file2)',
      'Use comm -23 to show lines only in file1 (like set difference)',
      'Use comm -12 to show only common lines (like set intersection)',
    ],
  },

  nl: {
    useCases: [
      'Add line numbers to file output for reference',
      'Number only non-empty lines in a document',
      'Create numbered listings for documentation or code review',
    ],
    bestPractices: [
      'Use nl -ba to number all lines including blank lines',
      'Use nl -s ". " for a readable separator between the number and the text',
      'Prefer cat -n for simple line numbering, use nl for more formatting control',
    ],
  },

  expand: {
    useCases: [
      'Convert tabs to spaces in source code for consistent formatting',
      'Normalize whitespace before comparing files with diff',
      'Prepare text files for systems that do not handle tabs well',
    ],
    bestPractices: [
      'Use expand -t 4 to convert tabs to 4 spaces, matching common coding standards',
      'Use unexpand for the reverse operation (spaces to tabs)',
      'Consider using your editor or formatter instead for persistent code style changes',
    ],
  },

  envsubst: {
    useCases: [
      'Substitute environment variables in template files',
      'Generate configuration files from templates in CI/CD pipelines',
      'Replace placeholders in text files with runtime values',
    ],
    internals:
      'envsubst scans input for $VARIABLE or ${VARIABLE} patterns and replaces them with values from the environment. It is part of GNU gettext and processes input as a stream.',
    mistakes: [
      'Not exporting variables before running envsubst, which leaves placeholders unreplaced',
      'Using envsubst on files that contain dollar signs meant literally (like shell scripts), replacing them unintentionally',
    ],
    bestPractices: [
      'Restrict substitution to specific variables: envsubst "$VAR1 $VAR2" < template > output',
      'Export all needed variables before running envsubst',
      'Use envsubst instead of sed for template processing when variables are in the environment',
    ],
  },

  rev: {
    useCases: [
      'Reverse the character order of each line in input',
      'Extract the last field of a delimited string by reversing, cutting, and reversing again',
      'Quick text manipulation trick in pipelines',
    ],
    bestPractices: [
      'Combine rev with cut to extract the last field: echo "a.b.c" | rev | cut -d. -f1 | rev gives c',
      'Use rev as a fun utility for palindrome checking or simple text transformation tricks',
    ],
  },

  // ─── PROCESS MANAGEMENT (15) ───────────────────────────────────────

  ps: {
    useCases: [
      'List running processes with their PIDs, CPU, and memory usage',
      'Find the PID of a specific process for signaling or investigation',
      'View the process tree to understand parent-child relationships',
    ],
    internals:
      'ps reads from /proc on Linux, where each directory named by a number corresponds to a running process. It gathers status, command line, memory maps, and scheduling info from files like /proc/PID/stat and /proc/PID/cmdline.',
    mistakes: [
      'Confusing BSD-style options (ps aux) with UNIX-style (ps -ef). Both work but have different output formats.',
      'Using ps aux | grep process and matching the grep command itself. Use pgrep or add grep -v grep.',
    ],
    bestPractices: [
      'Use ps aux for a comprehensive list of all processes with CPU and memory info',
      'Use ps -ef --forest (or pstree) to visualize the process hierarchy',
      'Use pgrep instead of ps | grep for finding processes by name',
      'Use ps -p PID to get details about a specific process',
    ],
  },

  top: {
    useCases: [
      'Monitor system resource usage in real time',
      'Identify processes consuming the most CPU or memory',
      'Watch system load and process counts over time',
    ],
    internals:
      'top reads from /proc at regular intervals to gather per-process statistics. It calculates CPU percentages by comparing cumulative CPU time between samples. It uses the ncurses library for its interactive terminal display.',
    mistakes: [
      'Not knowing the interactive keys: press M to sort by memory, P by CPU, k to kill, q to quit',
      'Using top when htop is available, which provides a much better interactive experience',
    ],
    bestPractices: [
      'Use top -o %MEM to sort by memory usage or top -o %CPU for CPU usage',
      'Press 1 in top to show per-CPU core utilization',
      'Use htop as a more user-friendly alternative with mouse support and better visuals',
      'Use top -bn1 for a single batch snapshot suitable for scripting',
    ],
  },

  kill: {
    useCases: [
      'Send signals to processes, most commonly to terminate them',
      'Gracefully stop a process with SIGTERM or forcefully with SIGKILL',
      'Send HUP to a daemon to trigger configuration reload',
    ],
    internals:
      'kill calls the kill() system call which sends a signal to a process or process group. The kernel delivers the signal and the process either handles it, ignores it, or is terminated by the default action. SIGKILL (9) and SIGSTOP cannot be caught or ignored.',
    mistakes: [
      'Using kill -9 as the first resort instead of trying SIGTERM (15) first, which allows graceful cleanup',
      'Killing the wrong PID due to a typo. Double-check the PID with ps before sending signals.',
      'Not knowing that kill can send any signal, not just termination. Use kill -l to list all signals.',
    ],
    bestPractices: [
      'Try kill PID (SIGTERM) first, wait a few seconds, then use kill -9 PID (SIGKILL) only if needed',
      'Use kill -HUP to reload daemon configurations without stopping the service',
      'Use pkill or killall to kill processes by name instead of looking up PIDs manually',
    ],
  },

  'bg-fg': {
    useCases: [
      'Resume a stopped background job with bg or bring it to the foreground with fg',
      'Move a running foreground task to the background after pressing Ctrl+Z',
      'Manage multiple tasks in a single terminal session without tmux or screen',
    ],
    internals:
      'bg sends SIGCONT to a stopped process and sets it to run in the background. fg sends SIGCONT and attaches the process to the terminal foreground process group. The shell tracks jobs via their process group IDs.',
    mistakes: [
      'Forgetting Ctrl+Z only stops the process, it does not background it. You need to type bg afterward.',
      'Running bg on a process that reads from stdin, which will immediately stop again with SIGTTIN',
    ],
    bestPractices: [
      'Use Ctrl+Z then bg to background a running process, or append & when starting the command',
      'Use jobs to list current background jobs and their numbers',
      'Use fg %N to bring a specific job to the foreground by job number',
    ],
  },

  cron: {
    useCases: [
      'Schedule commands to run automatically at specific times or intervals',
      'Automate recurring maintenance tasks like backups, log rotation, and cleanups',
      'Run periodic data processing or reporting scripts',
    ],
    internals:
      'The cron daemon (crond) wakes up every minute, reads crontab files from /var/spool/cron and /etc/cron.d, and checks if any entries match the current time. Matching entries are executed in a minimal shell environment.',
    mistakes: [
      'Not specifying the full path to commands, since cron runs with a minimal PATH that may not include /usr/local/bin',
      'Forgetting that cron jobs run with a minimal environment. Variables like PATH, HOME, and SHELL may differ from your login shell.',
      'Not redirecting output, causing cron to email stdout/stderr on every run, potentially filling up the mail spool',
    ],
    bestPractices: [
      'Use crontab -e to edit your crontab and crontab -l to list entries',
      'Always use absolute paths for commands and files in cron jobs',
      'Redirect output to a log file: */5 * * * * /path/to/script >> /var/log/myjob.log 2>&1',
      'Use cron syntax checkers like crontab.guru to verify your schedule expressions',
    ],
  },

  nice: {
    useCases: [
      'Start a process with a modified CPU scheduling priority',
      'Lower the priority of CPU-intensive background tasks so they do not impact interactive use',
      'Run batch jobs at reduced priority to be courteous to other users on shared systems',
    ],
    internals:
      'nice adjusts the process niceness value which the kernel scheduler uses to determine CPU time allocation. Niceness ranges from -20 (highest priority) to 19 (lowest). Only root can set negative niceness values.',
    mistakes: [
      'Expecting nice to limit CPU usage. It only affects scheduling priority relative to other processes.',
      'Trying to set negative nice values without root, which is rejected by the kernel',
    ],
    bestPractices: [
      'Use nice -n 19 for lowest priority background jobs: nice -n 19 make -j4',
      'Use ionice alongside nice to also lower I/O priority for disk-heavy tasks',
      'Use renice to change the priority of already-running processes',
    ],
  },

  pgrep: {
    useCases: [
      'Find process IDs by name, user, or other attributes without parsing ps output',
      'Check if a specific process is running in scripts',
      'Get PIDs for use with kill or other commands',
    ],
    internals:
      'pgrep scans /proc for processes matching the given criteria (name, user, terminal, etc.) and returns their PIDs. It matches against the process command name by default, not the full command line.',
    mistakes: [
      'Not knowing that pgrep matches the process name (comm), not the full command line, by default. Use -f for full command line matching.',
      'Expecting exact matches when pgrep does substring matching by default. Use -x for exact name matching.',
    ],
    bestPractices: [
      'Use pgrep -f to match against the full command line including arguments',
      'Use pgrep -a to show both PID and full command for verification',
      'Use pgrep -u username to find processes by a specific user',
      'Use pgrep in scripts for process existence checks: pgrep -x nginx > /dev/null && echo running',
    ],
  },

  systemctl: {
    useCases: [
      'Start, stop, restart, and check the status of system services',
      'Enable or disable services to start automatically at boot',
      'View and manage the systemd unit dependency tree',
    ],
    internals:
      'systemctl communicates with the systemd init daemon over D-Bus. systemd manages services as units with defined dependencies, ordering, and resource controls. Each unit has a configuration file describing how to start, stop, and monitor the service.',
    mistakes: [
      'Forgetting to run systemctl daemon-reload after modifying unit files, causing systemd to use stale configuration',
      'Confusing enable/disable (boot behavior) with start/stop (current state). Enable does not start the service.',
      'Not checking journalctl for service logs when a service fails to start',
    ],
    bestPractices: [
      'Use systemctl status service to see current state and recent log entries',
      'Use systemctl enable --now service to enable and start in one command',
      'Use journalctl -u service -f to follow service logs in real time',
      'Use systemctl list-units --failed to find services that failed to start',
    ],
  },

  service: {
    useCases: [
      'Start, stop, and restart services on SysVinit or systemd systems',
      'Check the status of a service with a simple interface',
      'Manage services on older Linux systems without systemd',
    ],
    internals:
      'On SysVinit systems, service runs the init scripts in /etc/init.d/ with the specified action. On systemd systems, it acts as a compatibility wrapper that translates to systemctl commands.',
    mistakes: [
      'Using service on systemd systems when systemctl provides more information and control',
      'Not checking the exit code of service commands in scripts to verify success',
    ],
    bestPractices: [
      'On systemd systems, prefer systemctl over service for access to full features',
      'Use service --status-all to list all services and their states',
      'Verify service status after starting/stopping to confirm the action succeeded',
    ],
  },

  at: {
    useCases: [
      'Schedule a one-time command to run at a specific time in the future',
      'Defer a task to run during off-peak hours',
      'Run a command after a relative delay without keeping a terminal open',
    ],
    internals:
      'at reads commands from stdin and stores them in a spool directory (/var/spool/at). The atd daemon checks for pending jobs and executes them at the specified time. The job inherits the current environment.',
    mistakes: [
      'Not realizing that at jobs inherit the current environment and working directory, which may not be valid at execution time',
      'Forgetting that at uses the local timezone by default',
    ],
    bestPractices: [
      'Use at with flexible time syntax: at now + 2 hours, at 3:00 PM, at midnight tomorrow',
      'Use atq to list pending jobs and atrm to remove them',
      'Use absolute paths in at jobs since the working directory may not exist later',
    ],
  },

  jobs: {
    useCases: [
      'List all background and suspended jobs in the current shell session',
      'Check the status of background tasks before closing the terminal',
      'Get job numbers for use with fg, bg, kill, and disown',
    ],
    mistakes: [
      'Expecting jobs to show processes started in other terminals. It only shows jobs for the current shell.',
      'Closing the terminal with background jobs running, which sends SIGHUP and kills them. Use disown or nohup.',
    ],
    bestPractices: [
      'Use jobs -l to include PIDs in the output',
      'Check jobs before closing a terminal to avoid killing background work',
      'Use disown to detach a job from the shell so it survives terminal closure',
    ],
  },

  disown: {
    useCases: [
      'Detach a background job from the shell so it survives terminal closure',
      'Prevent SIGHUP from being sent to a job when the shell exits',
      'Keep a long-running process alive after you disconnect from SSH',
    ],
    internals:
      'disown removes the specified job from the shell job table. When the shell exits, it sends SIGHUP to all jobs in its table. Disowned jobs are not in the table and therefore do not receive SIGHUP.',
    mistakes: [
      'Forgetting to background the job first. You must Ctrl+Z then bg before disown.',
      'Disowning a process that writes to the terminal. It may hang or crash when the terminal goes away. Redirect output first.',
    ],
    bestPractices: [
      'Redirect output before disowning: command > output.log 2>&1 & disown',
      'For new processes, prefer nohup command & which handles redirection automatically',
      'Use tmux or screen for long-running tasks you want to reattach to later',
    ],
  },

  wait: {
    useCases: [
      'Wait for background processes to complete before continuing in a script',
      'Synchronize parallel tasks and collect their exit statuses',
      'Ensure all background jobs finish before exiting a script',
    ],
    internals:
      'wait calls the waitpid() system call, which blocks until the specified child process exits. It returns the exit status of the waited-for process. Without arguments, it waits for all child processes.',
    mistakes: [
      'Forgetting to capture background PIDs with $! for waiting on specific processes',
      'Using wait without arguments in scripts with many background processes, not checking individual exit statuses',
    ],
    bestPractices: [
      'Capture PIDs and wait specifically: cmd1 & pid1=$!; cmd2 & pid2=$!; wait $pid1 $pid2',
      'Check exit status after wait: wait $pid; echo "Exit status: $?"',
      'Use wait -n (bash 4.3+) to wait for any single background job to finish',
    ],
  },

  timeout: {
    useCases: [
      'Run a command with a time limit, killing it if it takes too long',
      'Prevent scripts from hanging indefinitely on network or blocking operations',
      'Add safety bounds to automated pipelines that must complete within a window',
    ],
    internals:
      'timeout starts the command as a child process and sets a timer. When the timer expires, it sends SIGTERM (by default) to the process. It can send a follow-up SIGKILL if the process does not terminate after the initial signal.',
    mistakes: [
      'Forgetting that timeout sends SIGTERM by default which can be caught. Use --kill-after to send SIGKILL as a fallback.',
      'Not handling the exit status 124 (timeout occurred) in scripts',
    ],
    bestPractices: [
      'Use timeout 30s command for a 30-second limit. Supports s, m, h, d suffixes.',
      'Use timeout --kill-after=10s 60s command to SIGTERM at 60s and SIGKILL at 70s',
      'Check exit status 124 in scripts to detect timeouts: timeout 10s cmd || [ $? -eq 124 ] && echo "Timed out"',
    ],
  },

  renice: {
    useCases: [
      'Change the CPU scheduling priority of a running process',
      'Lower the priority of a runaway process that is consuming too much CPU',
      'Raise the priority of a critical process (requires root)',
    ],
    internals:
      'renice calls the setpriority() system call to change the niceness of a running process, process group, or all processes owned by a user. The kernel scheduler uses niceness to allocate proportional CPU time.',
    mistakes: [
      'Trying to increase priority (lower niceness) without root privileges',
      'Confusing PID with job number. renice works with PIDs, not shell job numbers.',
    ],
    bestPractices: [
      'Use renice -n 19 -p PID to set lowest priority for CPU-heavy background tasks',
      'Use renice -n -5 -p PID (as root) to boost priority for important processes',
      'Use renice -n 10 -u username to lower priority of all processes by a specific user',
    ],
  },
}
