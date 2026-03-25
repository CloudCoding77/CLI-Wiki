import type { CommandFlag } from '../types'

export const commandFlags: Record<string, CommandFlag[]> = {
  // ── File Management ─────────────────────────────────────────────

  ls: [
    { flag: '-l', description: 'Long listing format with permissions and size' },
    { flag: '-a', description: 'Include hidden files (dotfiles)' },
    { flag: '-h', description: 'Human-readable file sizes (KB, MB, GB)' },
    { flag: '-R', description: 'List subdirectories recursively' },
    { flag: '-t', description: 'Sort by modification time, newest first' },
    { flag: '-S', description: 'Sort by file size, largest first' },
    { flag: '/S', description: 'List files in subdirectories recursively', os: ['windows'] },
    { flag: '/Q', description: 'Show file owner', os: ['windows'] },
  ],

  cp: [
    { flag: '-r', description: 'Copy directories recursively' },
    { flag: '-i', description: 'Prompt before overwriting existing files' },
    { flag: '-v', description: 'Show files as they are copied' },
    { flag: '-u', description: 'Copy only when source is newer than destination' },
    { flag: '-p', description: 'Preserve file mode, ownership, and timestamps' },
    { flag: '-n', description: 'Do not overwrite existing files' },
  ],

  mv: [
    { flag: '-i', description: 'Prompt before overwriting existing files' },
    { flag: '-f', description: 'Force move without prompting' },
    { flag: '-n', description: 'Do not overwrite existing files' },
    { flag: '-v', description: 'Show files as they are moved' },
    { flag: '-u', description: 'Move only when source is newer than destination' },
  ],

  rm: [
    { flag: '-r', description: 'Remove directories and their contents recursively' },
    { flag: '-f', description: 'Force removal without prompting' },
    { flag: '-i', description: 'Prompt before every removal' },
    { flag: '-v', description: 'Show files as they are removed' },
    { flag: '-d', description: 'Remove empty directories' },
    { flag: '/S', description: 'Delete files from all subdirectories', os: ['windows'] },
    { flag: '/Q', description: 'Quiet mode, do not ask to confirm', os: ['windows'] },
  ],

  mkdir: [
    { flag: '-p', description: 'Create parent directories as needed, no error if exists' },
    { flag: '-v', description: 'Print a message for each created directory' },
    { flag: '-m', description: 'Set permission mode (e.g. 755)' },
  ],

  find: [
    { flag: '-name', description: 'Search by filename pattern (case-sensitive)' },
    { flag: '-iname', description: 'Search by filename pattern (case-insensitive)' },
    { flag: '-type f', description: 'Match only regular files' },
    { flag: '-type d', description: 'Match only directories' },
    { flag: '-size', description: 'Match by file size (e.g. +10M, -1G)' },
    { flag: '-mtime', description: 'Match by modification time in days' },
    { flag: '-exec', description: 'Execute a command on each matched file' },
    { flag: '-delete', description: 'Delete matched files' },
  ],

  chmod: [
    { flag: '-R', description: 'Change permissions recursively for directories' },
    { flag: '-v', description: 'Show a diagnostic for every file processed' },
    { flag: '-c', description: 'Report only when a change is made' },
    { flag: '--reference', description: 'Copy permissions from a reference file' },
    { flag: '-f', description: 'Suppress most error messages' },
  ],

  chown: [
    { flag: '-R', description: 'Change ownership recursively for directories' },
    { flag: '-v', description: 'Show a diagnostic for every file processed' },
    { flag: '-c', description: 'Report only when a change is made' },
    { flag: '--reference', description: 'Copy ownership from a reference file' },
    { flag: '-h', description: 'Affect symbolic links instead of referenced files' },
  ],

  ln: [
    { flag: '-s', description: 'Create a symbolic (soft) link' },
    { flag: '-f', description: 'Force overwrite of existing destination file' },
    { flag: '-v', description: 'Show name of each linked file' },
    { flag: '-n', description: 'Do not dereference existing symlink target' },
    { flag: '-r', description: 'Create relative symbolic links' },
  ],

  rsync: [
    { flag: '-a', description: 'Archive mode: preserves permissions, timestamps, symlinks' },
    { flag: '-v', description: 'Verbose output showing transferred files' },
    { flag: '-z', description: 'Compress data during transfer' },
    { flag: '--delete', description: 'Delete files in destination not in source' },
    { flag: '-n', description: 'Dry run, show what would be transferred' },
    { flag: '--progress', description: 'Show transfer progress for each file' },
    { flag: '-e', description: 'Specify remote shell to use (e.g. ssh)' },
    { flag: '--exclude', description: 'Exclude files matching a pattern' },
  ],

  // ── Text Processing ─────────────────────────────────────────────

  grep: [
    { flag: '-i', description: 'Case-insensitive pattern matching' },
    { flag: '-r', description: 'Search recursively through directories' },
    { flag: '-n', description: 'Show line numbers with matched lines' },
    { flag: '-v', description: 'Invert match, show non-matching lines' },
    { flag: '-l', description: 'Show only filenames containing matches' },
    { flag: '-c', description: 'Print only a count of matching lines' },
    { flag: '-E', description: 'Use extended regular expressions (ERE)' },
    { flag: '--color', description: 'Highlight matching text in output' },
  ],

  sed: [
    { flag: '-i', description: 'Edit files in place' },
    { flag: '-e', description: 'Add a script command to execute' },
    { flag: '-n', description: 'Suppress automatic printing of pattern space' },
    { flag: '-E', description: 'Use extended regular expressions' },
    { flag: '-f', description: 'Read script commands from a file' },
  ],

  awk: [
    { flag: '-F', description: 'Set the input field separator' },
    { flag: '-v', description: 'Assign a value to a variable before execution' },
    { flag: '-f', description: 'Read the AWK program from a file' },
    { flag: '-i', description: 'Include an AWK source library', os: ['linux'] },
    { flag: '-b', description: 'Enable binary mode for input/output', os: ['linux'] },
  ],

  sort: [
    { flag: '-r', description: 'Reverse the sort order' },
    { flag: '-n', description: 'Sort numerically instead of alphabetically' },
    { flag: '-k', description: 'Sort by a specific field (column) number' },
    { flag: '-u', description: 'Output only unique lines after sorting' },
    { flag: '-t', description: 'Set the field delimiter character' },
    { flag: '-h', description: 'Sort human-readable numbers (e.g. 2K, 1G)' },
    { flag: '-o', description: 'Write output to a file instead of stdout' },
  ],

  cut: [
    { flag: '-d', description: 'Set the field delimiter character' },
    { flag: '-f', description: 'Select specific fields (e.g. -f1,3 or -f1-4)' },
    { flag: '-c', description: 'Select specific character positions' },
    { flag: '-b', description: 'Select specific byte positions' },
    { flag: '--complement', description: 'Output all fields except those selected' },
    { flag: '-s', description: 'Suppress lines with no delimiter character' },
  ],

  wc: [
    { flag: '-l', description: 'Count lines only' },
    { flag: '-w', description: 'Count words only' },
    { flag: '-c', description: 'Count bytes only' },
    { flag: '-m', description: 'Count characters only' },
    { flag: '-L', description: 'Print the length of the longest line' },
  ],

  // ── Networking ──────────────────────────────────────────────────

  curl: [
    { flag: '-o', description: 'Write output to a file instead of stdout' },
    { flag: '-X', description: 'Specify HTTP method (GET, POST, PUT, DELETE)' },
    { flag: '-H', description: 'Add a custom HTTP header to the request' },
    { flag: '-d', description: 'Send data in a POST request body' },
    { flag: '-s', description: 'Silent mode, hide progress and errors' },
    { flag: '-L', description: 'Follow HTTP redirects automatically' },
    { flag: '-I', description: 'Fetch HTTP headers only (HEAD request)' },
    { flag: '-k', description: 'Allow insecure SSL/TLS connections' },
  ],

  wget: [
    { flag: '-O', description: 'Save downloaded file with a specific name' },
    { flag: '-q', description: 'Quiet mode, suppress output' },
    { flag: '-r', description: 'Download recursively following links' },
    { flag: '-c', description: 'Resume a partially downloaded file' },
    { flag: '-P', description: 'Set the directory prefix for downloads' },
    { flag: '--limit-rate', description: 'Limit download speed (e.g. 200k, 2m)' },
    { flag: '-b', description: 'Run download in the background' },
  ],

  ssh: [
    { flag: '-p', description: 'Specify the port to connect to' },
    { flag: '-i', description: 'Select an identity file (private key) to use' },
    { flag: '-v', description: 'Verbose mode for debugging connections' },
    { flag: '-L', description: 'Set up local port forwarding (tunnel)' },
    { flag: '-R', description: 'Set up remote port forwarding' },
    { flag: '-N', description: 'Do not execute a remote command (tunnels only)' },
    { flag: '-X', description: 'Enable X11 display forwarding' },
  ],

  scp: [
    { flag: '-r', description: 'Copy directories recursively' },
    { flag: '-P', description: 'Specify the port to connect to' },
    { flag: '-i', description: 'Select an identity file (private key) to use' },
    { flag: '-v', description: 'Verbose mode for debugging transfers' },
    { flag: '-C', description: 'Enable compression during transfer' },
    { flag: '-q', description: 'Quiet mode, suppress progress meter' },
  ],

  ping: [
    { flag: '-c', description: 'Stop after sending a specific number of packets', os: ['macos', 'linux'] },
    { flag: '-n', description: 'Number of echo requests to send', os: ['windows'] },
    { flag: '-i', description: 'Set interval in seconds between packets', os: ['macos', 'linux'] },
    { flag: '-t', description: 'Set the IP time-to-live value', os: ['macos', 'linux'] },
    { flag: '-t', description: 'Ping continuously until stopped', os: ['windows'] },
    { flag: '-W', description: 'Set timeout in seconds to wait for reply', os: ['macos', 'linux'] },
    { flag: '-w', description: 'Timeout in milliseconds to wait for reply', os: ['windows'] },
    { flag: '-s', description: 'Set the size of the packet payload in bytes', os: ['macos', 'linux'] },
  ],

  // ── Process Management ──────────────────────────────────────────

  ps: [
    { flag: 'aux', description: 'Show all processes with detailed info (BSD style)' },
    { flag: '-e', description: 'Show all processes (System V style)' },
    { flag: '-f', description: 'Full format listing with additional columns' },
    { flag: '--sort', description: 'Sort output by a field (e.g. --sort=-%mem)', os: ['linux'] },
    { flag: '-p', description: 'Show info for specific process IDs only' },
    { flag: '-u', description: 'Show processes owned by a specific user' },
  ],

  kill: [
    { flag: '-9', description: 'Send SIGKILL to force terminate a process' },
    { flag: '-15', description: 'Send SIGTERM for graceful termination (default)' },
    { flag: '-l', description: 'List all available signal names' },
    { flag: '-s', description: 'Specify the signal to send by name' },
    { flag: '-HUP', description: 'Send SIGHUP to reload process configuration' },
  ],

  top: [
    { flag: '-d', description: 'Set screen refresh delay in seconds', os: ['linux'] },
    { flag: '-p', description: 'Monitor only specific process IDs', os: ['linux'] },
    { flag: '-u', description: 'Show processes for a specific user only', os: ['linux'] },
    { flag: '-n', description: 'Exit after a specified number of iterations', os: ['linux'] },
    { flag: '-b', description: 'Batch mode, useful for piping to a file', os: ['linux'] },
    { flag: '-o', description: 'Sort by a specific field (e.g. cpu, mem)' },
    { flag: '-l', description: 'Set number of samples to collect', os: ['macos'] },
  ],

  htop: [
    { flag: '-d', description: 'Set screen refresh delay in tenths of seconds' },
    { flag: '-u', description: 'Show processes for a specific user only' },
    { flag: '-p', description: 'Monitor only specific process IDs' },
    { flag: '-s', description: 'Sort by a specific column' },
    { flag: '-t', description: 'Show processes in a tree view' },
    { flag: '-C', description: 'Use monochrome color scheme' },
  ],

  // ── Version Control ─────────────────────────────────────────────

  git: [
    { flag: '-m', description: 'Specify the commit message inline' },
    { flag: '-a', description: 'Stage all modified tracked files and commit' },
    { flag: '--amend', description: 'Modify the most recent commit' },
    { flag: '--no-edit', description: 'Amend without changing the commit message' },
    { flag: '-v', description: 'Show diff in commit message editor' },
    { flag: '--status', description: 'Include status output in the commit template' },
  ],

  'git-log': [
    { flag: '--oneline', description: 'Show each commit as a single line' },
    { flag: '--graph', description: 'Draw ASCII graph of branch history' },
    { flag: '--all', description: 'Show commits from all branches' },
    { flag: '-n', description: 'Limit output to the last n commits' },
    { flag: '--author', description: 'Filter commits by a specific author' },
    { flag: '--since', description: 'Show commits after a date (e.g. 2024-01-01)' },
    { flag: '--stat', description: 'Show file change statistics per commit' },
    { flag: '-p', description: 'Show the full diff (patch) for each commit' },
  ],

  'git-diff': [
    { flag: '--staged', description: 'Show changes staged for the next commit' },
    { flag: '--stat', description: 'Show a summary of changed files and lines' },
    { flag: '--name-only', description: 'Show only names of changed files' },
    { flag: '--name-status', description: 'Show names and status (A/M/D) of changed files' },
    { flag: '-w', description: 'Ignore all whitespace changes' },
    { flag: '--color-words', description: 'Show word-level diffs with color highlighting' },
  ],

  'git-branch': [
    { flag: '-a', description: 'List both local and remote branches' },
    { flag: '-d', description: 'Delete a fully merged branch' },
    { flag: '-D', description: 'Force delete a branch even if not merged' },
    { flag: '-r', description: 'List remote-tracking branches only' },
    { flag: '-m', description: 'Rename a branch' },
    { flag: '-v', description: 'Show last commit hash and message per branch' },
  ],

  'git-stash': [
    { flag: 'push', description: 'Stash current working directory changes' },
    { flag: 'pop', description: 'Apply and remove the most recent stash' },
    { flag: 'list', description: 'List all stored stash entries' },
    { flag: 'apply', description: 'Apply a stash without removing it from list' },
    { flag: 'drop', description: 'Remove a specific stash entry from the list' },
    { flag: '-u', description: 'Include untracked files in the stash' },
    { flag: '-m', description: 'Add a description message to the stash' },
  ],
}
