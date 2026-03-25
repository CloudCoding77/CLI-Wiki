import type { CommandExplanation } from '../types'

export const explanationsPart2: Record<string, CommandExplanation> = {
  // ─── PACKAGE MANAGEMENT ────────────────────────────────────────────

  apt: {
    useCases: [
      'Install, upgrade, or remove packages on Debian/Ubuntu systems',
      'Search for available packages and check dependency trees',
      'Perform full system upgrades with a single command',
    ],
    internals:
      'apt is a high-level frontend to dpkg. It resolves dependencies by reading package metadata from configured repositories in /etc/apt/sources.list, downloads .deb files to /var/cache/apt/archives, and delegates actual installation to dpkg.',
    mistakes: [
      'Running `apt upgrade` without `apt update` first — the local package index is stale, so you may miss security patches or get dependency errors.',
      'Using `apt autoremove` blindly after kernel upgrades — it can remove the running kernel\'s modules. Always verify the list before confirming.',
      'Mixing `apt` and `apt-get` in scripts — `apt` is designed for interactive use and its output format may change. Use `apt-get` in scripts for stable output.',
    ],
    bestPractices: [
      'Always run `apt update` before `apt install` to ensure the latest package metadata.',
      'Use `apt list --upgradable` to review pending upgrades before applying them.',
      'Prefer `apt full-upgrade` over `apt upgrade` when you need to handle changed dependencies (e.g., major version bumps).',
    ],
  },

  dnf: {
    useCases: [
      'Manage packages on Fedora, RHEL 8+, and CentOS Stream',
      'Query installed or available packages and inspect their metadata',
      'Enable/disable modular streams for language runtimes or databases',
    ],
    internals:
      'dnf replaced yum by reimplementing dependency resolution with libsolv, a SAT-solver-based library. It downloads repository metadata as compressed XML/SQLite, solves the dependency graph, then delegates rpm transactions to librpm.',
    mistakes: [
      'Forgetting `dnf makecache` after adding a new repo — dnf will not see the new packages until metadata is refreshed.',
      'Using `dnf remove` on a group meta-package and accidentally removing many dependencies — use `dnf group remove` with `--with-optional` carefully.',
      'Ignoring `dnf needs-restarting` output — updated libraries are only active after restarting affected services or rebooting.',
    ],
    bestPractices: [
      'Use `dnf history` to review and undo/redo transactions if an upgrade causes issues.',
      'Pin critical packages with `dnf versionlock` to prevent unintended upgrades.',
      'Enable `dnf automatic` with security-only updates for servers.',
    ],
  },

  brew: {
    useCases: [
      'Install CLI tools and libraries on macOS (and Linux) without root',
      'Manage GUI applications on macOS via `brew install --cask`',
      'Pin specific package versions when stability matters',
    ],
    internals:
      'Homebrew installs formulae into a prefix (/opt/homebrew on Apple Silicon, /usr/local on Intel). Packages are built from source or poured from pre-compiled bottles. Symlinks in the prefix bin/ directory point to the active version in the Cellar.',
    mistakes: [
      'Running `brew update && brew upgrade` without reviewing — this can upgrade major versions and break projects. Use `brew pin <formula>` to freeze packages you depend on.',
      'Installing Homebrew as root — it is designed to run under your user account. Root installation causes permission headaches.',
      'Not running `brew cleanup` periodically — old bottles accumulate and waste disk space.',
    ],
    bestPractices: [
      'Use `brew bundle dump` to generate a Brewfile for reproducible environments.',
      'Run `brew doctor` after issues to diagnose common configuration problems.',
      'Prefer `brew install --cask` for GUI apps to keep /Applications clean.',
    ],
  },

  choco: {
    useCases: [
      'Install and update software on Windows from the command line',
      'Automate workstation setup in scripts or with configuration management',
      'Manage internal packages via private Chocolatey feeds',
    ],
    internals:
      'Chocolatey wraps NuGet packaging. Packages contain PowerShell install scripts that typically download an installer and run it silently. Choco keeps a local database of installed packages in C:\\ProgramData\\chocolatey\\lib.',
    mistakes: [
      'Running `choco install` without an elevated shell — most packages require admin rights and will fail silently or partially.',
      'Not specifying `--yes` in automated scripts — the default interactive prompt blocks unattended runs.',
      'Ignoring package checksums with `--ignore-checksums` — this bypasses integrity verification and is a security risk.',
    ],
    bestPractices: [
      'Use `choco upgrade all` on a schedule to keep software patched.',
      'Pin packages with `choco pin add -n=<pkg>` to prevent accidental upgrades of critical tools.',
      'Set up a `packages.config` XML file for reproducible machine provisioning.',
    ],
  },

  npm: {
    useCases: [
      'Install JavaScript/TypeScript project dependencies from the npm registry',
      'Run project-defined scripts (build, test, lint) via `npm run`',
      'Publish reusable packages to public or private registries',
    ],
    internals:
      'npm resolves a dependency tree, deduplicates shared versions, and installs packages into node_modules. Since npm v7 it uses a flat node_modules layout via arborist. The package-lock.json records the exact resolved tree for reproducible installs.',
    mistakes: [
      'Committing node_modules to version control — it is large and platform-specific. Commit only package.json and package-lock.json.',
      'Using `npm install` in CI instead of `npm ci` — `npm ci` is faster and ensures the lockfile is respected exactly, failing if it is out of sync.',
      'Installing devDependencies in production images — use `npm ci --omit=dev` to keep containers lean.',
    ],
    bestPractices: [
      'Always commit package-lock.json to ensure deterministic builds.',
      'Run `npm audit` regularly and address high/critical vulnerabilities promptly.',
      'Use `npx` to run one-off CLI tools without polluting global installs.',
      'Scope internal packages under an org (`@org/pkg`) to avoid name collisions.',
    ],
  },

  pip: {
    useCases: [
      'Install Python packages from PyPI or private indexes',
      'Freeze current environment into a requirements.txt for reproducibility',
      'Install packages in editable mode during development with `pip install -e .`',
    ],
    internals:
      'pip resolves dependencies using a backtracking resolver (since v20.3). It downloads wheels (or sdists that it builds) from PyPI, then installs them into the site-packages directory of the active Python interpreter or virtual environment.',
    mistakes: [
      'Installing packages globally with `sudo pip install` — this can conflict with system packages. Always use a virtual environment.',
      'Not pinning versions in requirements.txt — unpinned deps lead to non-reproducible builds and unexpected breakage.',
      'Ignoring the resolver backtracking warning — it usually means conflicting version constraints. Simplify or update your constraints.',
    ],
    bestPractices: [
      'Always work inside a venv or conda environment to isolate dependencies.',
      'Use `pip freeze > requirements.txt` to snapshot the environment, but maintain a human-edited requirements.in with direct deps only.',
      'Prefer `pip install --require-hashes` in CI/CD for supply-chain security.',
    ],
  },

  snap: {
    useCases: [
      'Install sandboxed applications on Ubuntu and other snap-enabled distros',
      'Get auto-updating desktop or server applications with confined permissions',
      'Run multiple versions of the same application via channels (stable/edge)',
    ],
    internals:
      'Snaps are squashfs images mounted at /snap/<name>/<revision>. snapd manages downloads, mounts, AppArmor/seccomp confinement profiles, and automatic background updates. Each snap runs in a confined sandbox with access mediated by interfaces.',
    mistakes: [
      'Expecting snaps to have full filesystem access — they are sandboxed. Connect required interfaces with `snap connect` if a feature is missing.',
      'Disabling automatic refresh indefinitely — snap enforces a maximum hold of 90 days. Plan maintenance windows instead.',
      'Not checking `snap connections` when an app misbehaves — missing interface connections are the most common cause of permission errors.',
    ],
    bestPractices: [
      'Use `snap refresh --hold` to temporarily defer updates during critical work.',
      'Inspect available interfaces with `snap interfaces` to understand sandbox boundaries.',
      'Prefer the `--classic` flag only when truly needed, as it disables confinement.',
    ],
  },

  flatpak: {
    useCases: [
      'Install sandboxed desktop applications on any Linux distribution',
      'Run apps from Flathub with automatic runtime deduplication',
      'Test beta software via flatpak beta branches without affecting the host',
    ],
    internals:
      'Flatpak uses OSTree to store and deduplicate application and runtime files. Applications run in a bubblewrap sandbox with filesystem, network, and device access controlled by portal APIs and permissions declared in metadata.',
    mistakes: [
      'Granting `--filesystem=host` overrides to every app — this defeats the sandbox. Grant the narrowest path needed.',
      'Forgetting to run `flatpak update` — unlike snaps, Flatpak does not auto-update by default on all distros.',
      'Not cleaning unused runtimes — run `flatpak uninstall --unused` periodically to reclaim disk space.',
    ],
    bestPractices: [
      'Use `flatpak override --user` to customize permissions per-app without affecting system defaults.',
      'Enable Flathub as a user remote for unprivileged installs.',
      'Review app permissions with `flatpak info --show-permissions <app>` before granting overrides.',
    ],
  },

  cargo: {
    useCases: [
      'Build, test, and manage Rust projects and their dependencies',
      'Install Rust CLI tools globally with `cargo install`',
      'Publish crates to crates.io for community reuse',
    ],
    internals:
      'Cargo reads Cargo.toml to resolve a dependency graph (recorded in Cargo.lock), downloads crates from the registry, and invokes rustc with the correct flags. It supports incremental compilation and caches build artifacts in the target/ directory.',
    mistakes: [
      'Not committing Cargo.lock for binary projects — without it, CI may resolve different dependency versions. (Libraries should not commit it.)',
      'Clearing the target/ directory to "fix" build errors — this forces a full rebuild. Use `cargo clean -p <crate>` to selectively clean.',
      'Ignoring `cargo clippy` warnings — clippy catches subtle bugs and non-idiomatic code that the compiler allows.',
    ],
    bestPractices: [
      'Run `cargo clippy` and `cargo fmt` before every commit for consistent, idiomatic code.',
      'Use `cargo audit` to check dependencies for known security vulnerabilities.',
      'Enable LTO and `opt-level = "z"` in release profiles when binary size matters.',
    ],
  },

  pacman: {
    useCases: [
      'Install, upgrade, and remove packages on Arch Linux and derivatives',
      'Query the local package database or sync database for package info',
      'Perform full system upgrades with `pacman -Syu`',
    ],
    internals:
      'pacman uses libalpm to manage a local database of installed packages. It downloads compressed packages from mirror servers, verifies PGP signatures, resolves dependencies, then extracts files directly to the filesystem.',
    mistakes: [
      'Running `pacman -Sy <package>` (partial upgrade) — this can break your system due to mismatched library versions. Always use `pacman -Syu`.',
      'Ignoring .pacnew and .pacsave files after upgrades — these indicate configuration file conflicts that need manual merging.',
      'Removing packages with `pacman -R` instead of `pacman -Rs` — the former leaves orphan dependencies behind.',
    ],
    bestPractices: [
      'Always perform a full system upgrade (`pacman -Syu`) before installing new packages.',
      'Use `paccache -r` to keep only the 3 most recent package versions in the cache.',
      'Check the Arch Linux news page before major upgrades for manual intervention notices.',
    ],
  },

  zypper: {
    useCases: [
      'Manage packages on openSUSE and SUSE Linux Enterprise',
      'Add and manage OBS (Open Build Service) repositories',
      'Apply patches and perform system migrations between release versions',
    ],
    internals:
      'zypper is a CLI frontend to libzypp, which uses libsolv for SAT-based dependency resolution. It reads repository metadata in rpm-md format and manages transactions through librpm.',
    mistakes: [
      'Adding too many third-party OBS repos — conflicting packages across repos cause dependency hell. Use `zypper repos` to audit.',
      'Running `zypper dup` from a running graphical session — major distribution upgrades should be done from a TTY or recovery mode.',
      'Ignoring vendor change warnings — accepting vendor changes without review can replace stable packages with untested versions.',
    ],
    bestPractices: [
      'Use `zypper patch` for security-only updates on servers.',
      'Lock critical packages with `zypper addlock` to prevent unintended upgrades.',
      'Run `zypper verify` to check that installed packages are intact and no dependencies are broken.',
    ],
  },

  dpkg: {
    useCases: [
      'Install a standalone .deb file that is not in a repository',
      'Query installed packages and their file lists',
      'Reconfigure or repair broken package installations',
    ],
    internals:
      'dpkg is the low-level Debian package manager. It unpacks .deb archives (ar format containing control.tar and data.tar), runs maintainer scripts (preinst, postinst, prerm, postrm), and updates /var/lib/dpkg/status to track installed packages.',
    mistakes: [
      'Using `dpkg -i` without resolving dependencies first — dpkg does not fetch dependencies. Run `apt --fix-broken install` afterward.',
      'Force-removing packages with `--force-remove-reinstreq` — this can leave the system in an inconsistent state.',
      'Editing /var/lib/dpkg/status by hand — manual edits can corrupt the package database. Use dpkg or apt commands instead.',
    ],
    bestPractices: [
      'Use `dpkg -l | grep <pattern>` to quickly check if a package is installed.',
      'Run `dpkg --configure -a` to fix packages left in an unconfigured state.',
      'Prefer `apt install ./<file>.deb` over raw dpkg for automatic dependency resolution.',
    ],
  },

  rpm: {
    useCases: [
      'Install standalone .rpm files on Red Hat-family systems',
      'Query installed package metadata, file lists, and scripts',
      'Verify package integrity and file permissions against the rpm database',
    ],
    internals:
      'rpm manages an embedded BerkeleyDB/SQLite database at /var/lib/rpm. It extracts cpio payloads from .rpm files, runs scriptlets, and records file ownership. Dependency resolution is not built in — that is handled by dnf/yum.',
    mistakes: [
      'Using `rpm -Uvh` to install a package that is not an upgrade — use `rpm -ivh` for fresh installs to avoid accidentally removing the old version.',
      'Ignoring `rpm -Va` warnings — changed config files are expected, but changed binaries may indicate tampering.',
      'Force-installing with `--nodeps` — this bypasses dependency checks and often leads to broken software.',
    ],
    bestPractices: [
      'Use `rpm -qa --last` to list packages sorted by install date for audit trails.',
      'Verify package signatures with `rpm -K <file>.rpm` before installing third-party RPMs.',
      'Prefer dnf/yum over raw rpm for installs to get automatic dependency handling.',
    ],
  },

  // ─── COMPRESSION ───────────────────────────────────────────────────

  tar: {
    useCases: [
      'Archive multiple files and directories into a single .tar file',
      'Combine with gzip/bzip2/xz for compressed archives (.tar.gz, .tar.bz2, .tar.xz)',
      'Extract backups while preserving file permissions and ownership',
      'Stream archives over SSH for remote file transfers',
    ],
    internals:
      'tar writes a sequential stream of 512-byte header blocks followed by file data blocks. It does not compress on its own — compression is handled by piping through external programs (gzip, bzip2, xz) or via built-in flags (-z, -j, -J).',
    mistakes: [
      'Extracting tar files without checking contents first — use `tar -tf` to list files and watch for paths starting with `/` or `../` that could overwrite system files.',
      'Forgetting the `-z`, `-j`, or `-J` flag when extracting compressed archives — tar will complain about invalid headers. Modern GNU tar auto-detects, but BSD tar may not.',
      'Using relative paths incorrectly when creating archives — always `cd` to the parent directory or use `-C` to avoid embedding unwanted directory levels.',
    ],
    bestPractices: [
      'Always list (`tar -tf`) an archive before extracting to inspect its structure.',
      'Use `tar -caf archive.tar.xz dir/` to let tar auto-select the compressor based on the file extension.',
      'Add `--exclude-vcs` to skip .git directories when archiving source trees.',
    ],
  },

  zip: {
    useCases: [
      'Create cross-platform compressed archives that Windows users can open natively',
      'Add files to an existing archive incrementally',
      'Compress files while preserving directory structure for distribution',
    ],
    internals:
      'zip stores each file individually compressed (deflate by default) with a local file header. A central directory at the end of the file indexes all entries, allowing random access to individual files without reading the entire archive.',
    mistakes: [
      'Assuming zip preserves Unix permissions — it stores them in extra fields that Windows ignores. Use tar for permission-sensitive archives.',
      'Encrypting with the default ZipCrypto — it is cryptographically weak. Use `zip -e` with AES via 7z if security matters.',
      'Creating very large archives (>4 GB) with old zip implementations — ensure you use Zip64 extensions.',
    ],
    bestPractices: [
      'Use `zip -r archive.zip dir/` for recursive directory compression.',
      'Add `-x "*.DS_Store"` or `-x "*.git/*"` to exclude unwanted files.',
      'For maximum compatibility with non-Unix systems, prefer zip over tar.gz.',
    ],
  },

  gzip: {
    useCases: [
      'Compress individual files to save disk space (.gz extension)',
      'Pipe compressed data through network transfers or between programs',
      'Compress log files for rotation and archival',
    ],
    internals:
      'gzip uses the DEFLATE algorithm (LZ77 + Huffman coding). It replaces the original file with a compressed version by default. It operates on single files — for multiple files, combine with tar.',
    mistakes: [
      'Expecting gzip to handle directories — it only compresses single files. Use `tar -czf` for directories.',
      'Forgetting that `gzip` deletes the original file — use `gzip -k` to keep it or redirect from stdin.',
      'Using maximum compression (`-9`) for large files without measuring — the size improvement over `-6` (default) is often negligible but much slower.',
    ],
    bestPractices: [
      'Use `gzip -k` to keep the original file alongside the compressed version.',
      'For decompression, `gunzip` and `gzip -d` are equivalent — use whichever you remember.',
      'Pipe output with `gzip -c` when you need to write to stdout instead of replacing the file.',
    ],
  },

  bzip2: {
    useCases: [
      'Compress files with better ratios than gzip at the cost of speed',
      'Create .tar.bz2 archives for source code distribution',
      'Compress large text-heavy datasets where ratio matters more than time',
    ],
    internals:
      'bzip2 uses the Burrows-Wheeler Transform (BWT) followed by Move-to-Front, then Huffman coding. The BWT rearranges data to cluster similar bytes, which makes subsequent compression more effective. It processes data in 100-900 KB blocks.',
    mistakes: [
      'Using bzip2 for real-time streaming — its block-based nature makes it slow to start decompressing. Use gzip or zstd for streaming.',
      'Forgetting that bzip2 also deletes the original — use `bzip2 -k` to keep it.',
      'Not considering xz or zstd as modern alternatives — they generally offer better ratios and speed.',
    ],
    bestPractices: [
      'Use `pbzip2` for parallel compression on multi-core machines.',
      'Consider migrating to zstd or xz for new projects — bzip2 is legacy in most contexts.',
      'Use `-9` (900 KB blocks) only for maximum compression; `-6` is a good default.',
    ],
  },

  xz: {
    useCases: [
      'Achieve the highest compression ratios for archival and distribution',
      'Compress Linux kernel images and large tarballs for download',
      'Create .tar.xz archives as the modern replacement for .tar.bz2',
    ],
    internals:
      'xz uses the LZMA2 algorithm, which combines LZ77 dictionary compression with range coding. LZMA2 supports multi-threaded compression and adaptive block sizing. The large dictionary (up to 1.5 GB) enables excellent compression but requires significant memory.',
    mistakes: [
      'Using high compression levels on low-memory machines — `xz -9` needs ~674 MB RAM for compression and ~65 MB for decompression.',
      'Not using `-T0` for multi-threaded compression — single-threaded xz is very slow on large files.',
      'Using xz for files that need random access — the format is sequential. Use a block-oriented format instead.',
    ],
    bestPractices: [
      'Use `xz -T0` to automatically use all CPU cores for compression.',
      'Default compression level (`-6`) offers a good ratio/speed tradeoff.',
      'For faster alternatives with similar ratios, evaluate zstd at high levels.',
    ],
  },

  '7z': {
    useCases: [
      'Create archives with the highest compression ratios using LZMA/LZMA2',
      'Work with many archive formats (zip, tar, rar, iso, cab) through a single tool',
      'Create encrypted archives with strong AES-256 encryption',
    ],
    internals:
      '7z supports multiple codecs (LZMA, LZMA2, PPMd, BZip2, Deflate). It uses solid compression by default, grouping files into a single block for better ratios. The header can also be encrypted, hiding file names from inspection.',
    mistakes: [
      'Relying on 7z format for Linux backups — it does not store Unix permissions or ownership. Use tar for backups.',
      'Using solid archives for frequent updates — modifying one file requires recompressing the entire solid block.',
      'Forgetting `-mhe=on` when encrypting sensitive archives — without it, file names remain visible even though content is encrypted.',
    ],
    bestPractices: [
      'Use `7z a -t7z -m0=lzma2 -mx=9` for maximum compression.',
      'Enable header encryption with `-mhe=on` when archiving sensitive data.',
      'For cross-platform sharing, output to zip format (`-tzip`) for wider compatibility.',
    ],
  },

  zstd: {
    useCases: [
      'Compress files with an excellent speed-to-ratio tradeoff',
      'Use as a fast real-time compression layer for databases or log shipping',
      'Replace gzip in pipelines where both speed and decent compression matter',
      'Create dictionaries for compressing many small similar files efficiently',
    ],
    internals:
      'Zstandard uses a combination of LZ77 matching, Finite State Entropy (tANS) coding, and Huffman coding. It supports 22 compression levels plus an ultra mode. At low levels it is faster than gzip with similar ratios; at high levels it approaches xz ratios.',
    mistakes: [
      'Not using adaptive mode (`--adapt`) for variable-speed I/O — zstd can auto-tune its level based on I/O throughput.',
      'Training a dictionary on non-representative data — dictionaries must be trained on samples similar to the target data.',
      'Using level 22 (ultra) without understanding the memory cost — it requires significant RAM for minimal gain over level 19.',
    ],
    bestPractices: [
      'Use `zstd -T0` for multi-threaded compression on multi-core systems.',
      'Train a dictionary with `zstd --train` when compressing many small similar files (e.g., JSON logs).',
      'Default level (3) is excellent for general use; level 19 is good for archival.',
    ],
  },

  unzip: {
    useCases: [
      'Extract .zip archives on Unix/Linux/macOS systems',
      'List contents of a zip file without extracting',
      'Extract specific files from a large zip archive',
    ],
    internals:
      'unzip reads the central directory at the end of the zip file to locate entries, then decompresses each file independently using the stored algorithm (typically deflate). It can extract to stdout with `-p` for piping.',
    mistakes: [
      'Extracting into the current directory without checking — some zip files don\'t have a top-level directory, scattering files everywhere. Use `unzip -l` first.',
      'Ignoring encoding issues with filenames — zip files from Windows may use non-UTF-8 encoding. Use `-O` to specify the encoding.',
      'Overwriting existing files without prompting — use `unzip -n` (never overwrite) or `-o` (always overwrite) explicitly.',
    ],
    bestPractices: [
      'Use `unzip -l archive.zip` to inspect contents before extracting.',
      'Extract into a dedicated directory with `unzip archive.zip -d target/` to avoid clutter.',
      'Use `unzip -t` to test archive integrity without extracting.',
    ],
  },

  unrar: {
    useCases: [
      'Extract .rar archives received from others',
      'List and test RAR archive contents for integrity',
      'Extract password-protected RAR files',
    ],
    internals:
      'unrar decompresses RAR archives using a proprietary algorithm (PPMd and LZSS variants). The RAR format supports solid compression, recovery records, and multi-volume spanning. unrar is the free extraction-only tool; creating RAR files requires the proprietary rar utility.',
    mistakes: [
      'Trying to create RAR files with unrar — it only extracts. Use `rar` or choose an open format like tar.zst or 7z.',
      'Ignoring multi-part archives — files like .part1.rar, .part2.rar must all be present. Extract from the first part only.',
      'Not checking integrity first — use `unrar t archive.rar` before extracting to detect corruption.',
    ],
    bestPractices: [
      'Use `unrar l archive.rar` to list contents before extraction.',
      'Prefer open formats (tar.gz, tar.zst, 7z) for your own archives — RAR is proprietary.',
      'Use `unrar x` (preserve paths) rather than `unrar e` (flat extract) to maintain directory structure.',
    ],
  },

  lz4: {
    useCases: [
      'Compress data where decompression speed is critical (e.g., real-time applications)',
      'Use as a fast compression layer for filesystem snapshots or databases',
      'Pipe data through network transfers where CPU is the bottleneck, not bandwidth',
    ],
    internals:
      'LZ4 uses a simplified LZ77 algorithm optimized for speed. It achieves decompression speeds of multiple GB/s on modern CPUs by using a simple hash-based match finder and minimal entropy coding. The format supports both block and frame modes.',
    mistakes: [
      'Expecting high compression ratios — LZ4 trades ratio for speed. Use zstd or xz when ratio matters.',
      'Mixing lz4 block format with frame format — tools may not be interoperable. Use the frame format (default in the lz4 CLI) for compatibility.',
      'Not using `lz4 -BD` for better ratios — block-dependent mode links blocks for slightly better compression.',
    ],
    bestPractices: [
      'Use lz4 as the default compression for real-time pipelines and temporary data.',
      'Combine with tar for directory compression: `tar cf - dir/ | lz4 > archive.tar.lz4`.',
      'Use `lz4 -9` (HC mode) when you want better compression but still faster than gzip.',
    ],
  },

  pigz: {
    useCases: [
      'Compress or decompress gzip files using multiple CPU cores',
      'Drop-in replacement for gzip in existing scripts that need faster throughput',
      'Compress large files or streams where single-threaded gzip is too slow',
    ],
    internals:
      'pigz (Parallel Implementation of GZip) splits input into 128 KB blocks and compresses them in parallel using a thread pool. The output is a valid gzip stream — each block is an independent deflate block, so any gzip tool can decompress it.',
    mistakes: [
      'Expecting parallel decompression by default — pigz can only decompress single-threaded since standard gzip streams are sequential. Only pigz-created files with independent blocks benefit from parallel decompression.',
      'Setting too many threads on a shared system — use `-p <n>` to limit cores and avoid starving other processes.',
      'Assuming pigz output is byte-identical to gzip — the results decompress identically but the compressed bytes differ due to block boundaries.',
    ],
    bestPractices: [
      'Replace gzip with pigz in backup scripts for significant speedups: `tar cf - dir/ | pigz > archive.tar.gz`.',
      'Use `-p` to control the number of threads on busy servers.',
      'Combine with `tar --use-compress-program=pigz` for transparent integration.',
    ],
  },

  // ─── PERMISSIONS & USERS ───────────────────────────────────────────

  chmod: {
    useCases: [
      'Set read/write/execute permissions on files and directories',
      'Make scripts executable with `chmod +x`',
      'Restrict sensitive files (private keys, config) to owner-only access',
    ],
    internals:
      'chmod modifies the file mode bits stored in the inode. The kernel checks these bits (owner/group/other) along with the process UID/GID to determine access. On ext4, permissions are stored in the inode table; on networked filesystems, behavior depends on the server.',
    mistakes: [
      'Using `chmod 777` to "fix" permission problems — this makes files world-writable, creating a security hole. Determine the actual needed permissions.',
      'Applying `chmod -R 755` to a directory containing files — this makes all files executable. Use `find` to apply different modes to files (644) and directories (755).',
      'Forgetting that chmod has no effect on FAT/NTFS partitions — these filesystems do not support Unix permissions natively.',
    ],
    bestPractices: [
      'Use symbolic notation (`chmod u+x,go-w`) for readability in scripts.',
      'Set private keys to `chmod 600` — SSH and GPG refuse keys with broader permissions.',
      'Apply permissions recursively with care: `find dir/ -type f -exec chmod 644 {} +` and `find dir/ -type d -exec chmod 755 {} +`.',
    ],
  },

  chown: {
    useCases: [
      'Change file or directory ownership after copying files between users',
      'Fix ownership after extracting archives created by another user',
      'Set correct ownership for web server document roots',
    ],
    internals:
      'chown updates the UID and GID fields in the file\'s inode. Only root can change file ownership (to prevent users from giving away quota). Group changes are allowed if the caller is the file owner and a member of the target group.',
    mistakes: [
      'Running `chown -R` on /usr or /etc — this can break system services. Always double-check your target path.',
      'Forgetting the colon syntax for group — `chown user:group file` sets both; `chown user file` changes only the owner.',
      'Using chown on symlinks without `-h` — by default chown follows symlinks and changes the target, not the link itself.',
    ],
    bestPractices: [
      'Use `chown -R user:group dir/` to recursively fix ownership of deployed applications.',
      'Combine with `chmod` in deployment scripts to set both ownership and permissions.',
      'Use `--from=olduser` to conditionally change ownership only if the current owner matches.',
    ],
  },

  sudo: {
    useCases: [
      'Execute a single command with elevated (root) privileges',
      'Run administrative tasks without logging in as root',
      'Edit system files safely with `sudo -e` (sudoedit)',
    ],
    internals:
      'sudo checks /etc/sudoers (parsed by the sudoers plugin) to verify the caller is authorized for the requested command. It authenticates via PAM, caches credentials for a configurable timeout (default 15 minutes), and logs all invocations to syslog.',
    mistakes: [
      'Using `sudo su -` habitually instead of `sudo <command>` — running an interactive root shell bypasses per-command auditing.',
      'Redirecting output with sudo incorrectly — `sudo echo x > /etc/file` fails because the shell (not sudo) handles the redirect. Use `echo x | sudo tee /etc/file`.',
      'Adding `NOPASSWD: ALL` in sudoers for convenience — this is a significant security risk. Limit NOPASSWD to specific commands.',
    ],
    bestPractices: [
      'Use `sudo -e` (sudoedit) to edit system files — it copies the file, opens your editor, then writes back, preventing accidental damage.',
      'Configure sudoers with `visudo` only — it validates syntax before saving.',
      'Audit sudo usage via `/var/log/auth.log` or `journalctl -u sudo`.',
    ],
  },

  useradd: {
    useCases: [
      'Create new user accounts on Linux systems',
      'Set up service accounts with restricted shells for daemons',
      'Create users with specific UID/GID assignments for NFS compatibility',
    ],
    internals:
      'useradd writes entries to /etc/passwd, /etc/shadow, and /etc/group. It optionally creates a home directory by copying files from /etc/skel. Default values come from /etc/default/useradd and /etc/login.defs.',
    mistakes: [
      'Forgetting to set a password after `useradd` — the account is locked by default. Run `passwd <user>` immediately.',
      'Not using `-m` to create the home directory — without it, the user has no home directory. Some distros default to creating it, others do not.',
      'Creating service accounts with a login shell — use `-s /usr/sbin/nologin` for accounts that should never log in interactively.',
    ],
    bestPractices: [
      'Use `useradd -m -s /bin/bash <user>` for interactive users to create a home directory with the default shell.',
      'For service accounts, use `useradd -r -s /usr/sbin/nologin <service>` to create a system account.',
      'Set password expiry policies with `-e` (expiry date) and chage for compliance.',
    ],
  },

  passwd: {
    useCases: [
      'Change your own password or another user\'s password (as root)',
      'Lock or unlock user accounts',
      'Force a user to change their password at next login',
    ],
    internals:
      'passwd updates the hashed password in /etc/shadow. It uses PAM modules to enforce password quality rules (length, complexity). The hash algorithm is configured in /etc/login.defs (typically SHA-512 or yescrypt).',
    mistakes: [
      'Setting weak passwords that pass minimal PAM checks — configure pam_pwquality for stricter rules.',
      'Using `passwd -d` to remove a password — this allows passwordless login, which is rarely the intent. Use `passwd -l` to lock instead.',
      'Not testing PAM rules after changing /etc/pam.d/common-password — a misconfigured PAM stack can lock everyone out.',
    ],
    bestPractices: [
      'Use `passwd -e <user>` to force a password change at next login for new accounts.',
      'Lock accounts with `passwd -l <user>` rather than deleting them to preserve audit trails.',
      'Configure pam_pwquality to enforce minimum length, complexity, and dictionary checks.',
    ],
  },

  id: {
    useCases: [
      'Display the current user\'s UID, GID, and group memberships',
      'Verify effective group membership before accessing shared resources',
      'Script user identity checks in automation',
    ],
    internals:
      'id reads from /etc/passwd and /etc/group (or NSS backends like LDAP) to resolve the numeric UID/GID to names. It shows both real and effective IDs, which differ when setuid/setgid programs are running.',
    mistakes: [
      'Assuming `id` output reflects recent group changes — new group memberships require a new login session to take effect.',
      'Parsing id output with fragile string matching — use `id -u`, `id -g`, or `id -Gn` for specific fields.',
    ],
    bestPractices: [
      'Use `id -u` to get just the numeric UID for scripting.',
      'After adding a user to a group, use `newgrp <group>` or re-login before testing with `id`.',
    ],
  },

  groups: {
    useCases: [
      'List all groups a user belongs to',
      'Verify group membership for access control debugging',
    ],
    internals:
      'groups reads supplementary group IDs from /etc/group and the kernel credential structure. It is essentially a shorthand for `id -Gn`.',
    mistakes: [
      'Forgetting that group changes require re-login — adding a user to a group in /etc/group does not affect existing sessions.',
      'Confusing primary group (from /etc/passwd) with supplementary groups (from /etc/group) — both appear in the output but serve different roles.',
    ],
    bestPractices: [
      'Use `groups <username>` to check another user\'s memberships.',
      'Combine with `newgrp` to activate a newly assigned group without logging out.',
    ],
  },

  su: {
    useCases: [
      'Switch to another user account in the current terminal',
      'Open a root shell for multiple administrative tasks',
      'Test application behavior as a different user',
    ],
    internals:
      'su starts a new shell process with the target user\'s UID/GID. With `su -` (login shell), it also resets the environment (PATH, HOME, etc.) to the target user\'s defaults by sourcing their login profile.',
    mistakes: [
      'Using `su` without the dash (`su root` vs `su - root`) — without `-`, the environment (PATH, HOME) is not reset, leading to confusing behavior.',
      'Using su instead of sudo for single commands — su opens a persistent root shell, increasing the risk of accidental damage.',
      'Leaving a root su session open — always `exit` promptly to minimize the window for mistakes.',
    ],
    bestPractices: [
      'Always use `su -` to get a clean login environment.',
      'Prefer `sudo` for single commands to maintain audit trails.',
      'Use `su - <user> -c "command"` to run a single command as another user without an interactive shell.',
    ],
  },

  last: {
    useCases: [
      'Review recent login history for security auditing',
      'Check when a specific user last logged in',
      'Identify unexpected logins or unusual login times',
    ],
    internals:
      'last reads the /var/log/wtmp binary file, which records all login and logout events. Each record contains the username, terminal, remote host, and timestamps. The `lastb` command reads /var/log/btmp for failed login attempts.',
    mistakes: [
      'Relying solely on `last` for security — an attacker with root access can clear wtmp. Combine with remote syslog.',
      'Ignoring `still logged in` entries that persist after crashes — these indicate the system did not record a clean logout.',
    ],
    bestPractices: [
      'Use `last -a` to show the hostname in the last column for wider terminals.',
      'Run `lastb` to check for brute-force login attempts.',
      'Rotate wtmp/btmp with logrotate to prevent them from growing unbounded.',
    ],
  },

  usermod: {
    useCases: [
      'Add an existing user to additional groups',
      'Change a user\'s home directory, shell, or login name',
      'Lock or unlock user accounts',
    ],
    internals:
      'usermod modifies entries in /etc/passwd, /etc/shadow, and /etc/group. When changing the home directory with `-d -m`, it moves the directory contents to the new location and updates the passwd entry.',
    mistakes: [
      'Using `usermod -G group user` without `-a` — this replaces all supplementary groups with the specified one. Always use `usermod -aG group user` to append.',
      'Modifying a user who is currently logged in — changes to groups only take effect on new sessions.',
      'Forgetting to move the home directory contents when changing it — use `-m` with `-d` to automatically relocate files.',
    ],
    bestPractices: [
      'Always use `usermod -aG` (append) when adding users to groups.',
      'Lock accounts with `usermod -L <user>` before deletion to prevent access during the transition.',
      'Use `usermod -s /usr/sbin/nologin` to disable interactive login for decommissioned accounts.',
    ],
  },

  userdel: {
    useCases: [
      'Remove user accounts that are no longer needed',
      'Clean up after employee departures or decommissioned service accounts',
    ],
    internals:
      'userdel removes the user\'s entries from /etc/passwd, /etc/shadow, and /etc/group. With `-r`, it also recursively deletes the home directory and mail spool.',
    mistakes: [
      'Running `userdel -r` without backing up the home directory first — all files are permanently deleted.',
      'Deleting a user who owns running processes — kill or reassign processes first with `pkill -u <user>`.',
      'Forgetting to remove the user from sudoers — orphaned sudoers entries remain and could be exploited if the UID is reused.',
    ],
    bestPractices: [
      'Back up the home directory before deletion: `tar -czf /backup/user.tar.gz /home/user`.',
      'Use `userdel -r` only after verifying no critical files exist in the home directory.',
      'Audit and remove any cron jobs, sudoers entries, and SSH keys belonging to the deleted user.',
    ],
  },

  groupadd: {
    useCases: [
      'Create new groups for access control on shared resources',
      'Set up project-specific groups for collaborative file access',
      'Create system groups for service accounts',
    ],
    internals:
      'groupadd appends a new entry to /etc/group and /etc/gshadow. It auto-assigns the next available GID unless one is specified with `-g`. System groups (created with `-r`) use GIDs from a reserved range defined in /etc/login.defs.',
    mistakes: [
      'Creating groups with GIDs that conflict with NFS-shared systems — coordinate GID allocation across machines or use a directory service.',
      'Forgetting to add users to the new group — creating the group alone does not grant anyone access.',
    ],
    bestPractices: [
      'Use `groupadd -r <group>` for system/service groups to use the system GID range.',
      'Document group purposes in a central location to avoid orphaned groups.',
      'Combine with `chmod g+rwx` and `chown :group` on shared directories to enable collaborative access.',
    ],
  },

  acl: {
    useCases: [
      'Grant file access to specific users beyond the owner/group/other model',
      'Set default permissions for new files in a shared directory',
      'Implement fine-grained access control without creating many groups',
    ],
    internals:
      'POSIX ACLs extend the standard permission model with additional user/group entries stored in extended attributes (system.posix_acl_access). The kernel evaluates ACLs in order: owner, named users, owning group, named groups, other. The ACL mask limits the effective permissions of all non-owner entries.',
    mistakes: [
      'Setting ACLs without understanding the mask — the mask entry limits the maximum permissions for all named users and groups. Use `setfacl -m m::rwx` if entries seem to lose permissions.',
      'Forgetting default ACLs on directories — without `-d`, new files inside do not inherit the ACL.',
      'Not checking filesystem support — mount the filesystem with `acl` option (or ensure it is default) before using setfacl.',
    ],
    bestPractices: [
      'Use `setfacl -d -m u:user:rwx dir/` to set default ACLs that new files inherit.',
      'Check ACLs with `getfacl file` — `ls -l` only shows a `+` indicator.',
      'Remove all ACLs with `setfacl -b file` when simplifying back to standard permissions.',
    ],
  },

  umask: {
    useCases: [
      'Control default permissions for newly created files and directories',
      'Tighten defaults in scripts that create sensitive files',
      'Set permissive defaults for collaborative shared directories',
    ],
    internals:
      'umask is a process attribute (not a command that modifies files). When a process creates a file, the kernel subtracts the umask bits from the requested mode. For example, a typical file creation requests mode 666; with umask 022, the result is 644.',
    mistakes: [
      'Setting umask 000 for convenience — every new file becomes world-writable, which is a major security risk.',
      'Expecting umask to affect existing files — it only applies to newly created files. Use chmod for existing files.',
      'Confusing umask with chmod — umask subtracts permissions; chmod sets them.',
    ],
    bestPractices: [
      'Use `umask 077` in scripts that create sensitive data (private keys, secrets).',
      'Set umask in ~/.bashrc or /etc/profile for persistent defaults.',
      'Standard server umask of `022` is appropriate for most use cases (files: 644, dirs: 755).',
    ],
  },

  chage: {
    useCases: [
      'Set password expiration policies for user accounts',
      'Force users to change passwords periodically for compliance',
      'View password aging information for auditing',
    ],
    internals:
      'chage modifies the password aging fields in /etc/shadow: last change date, minimum/maximum days between changes, warning period, and account expiration date. The login process checks these fields on each authentication.',
    mistakes: [
      'Setting maximum password age too short — frequent forced changes lead users to choose weaker, predictable passwords.',
      'Confusing account expiration (`-E`) with password expiration (`-M`) — account expiration disables the account entirely.',
      'Not setting a warning period (`-W`) — users get locked out without notice if they miss the expiration.',
    ],
    bestPractices: [
      'Use `chage -l <user>` to review all aging settings for an account.',
      'Set `-W 14` to warn users 14 days before password expiration.',
      'Combine with `chage -d 0 <user>` to force an immediate password change at next login.',
    ],
  },

  visudo: {
    useCases: [
      'Safely edit the /etc/sudoers file with syntax validation',
      'Grant or revoke sudo privileges for users and groups',
      'Configure fine-grained command restrictions for sudo',
    ],
    internals:
      'visudo locks /etc/sudoers, opens it in the default editor, and validates the syntax before saving. If syntax errors are found, it prompts to re-edit, discard, or save anyway. This prevents lockouts from typos in the sudoers file.',
    mistakes: [
      'Editing /etc/sudoers directly with a text editor — a syntax error can lock out all sudo access. Always use visudo.',
      'Using `ALL=(ALL) NOPASSWD: ALL` broadly — this gives unrestricted passwordless root access. Limit to specific commands.',
      'Not testing sudoers changes in a separate session — keep an existing root session open when making changes in case you lock yourself out.',
    ],
    bestPractices: [
      'Place custom rules in /etc/sudoers.d/ files rather than editing the main sudoers file.',
      'Use `visudo -f /etc/sudoers.d/custom` to edit drop-in files with syntax checking.',
      'Specify commands explicitly: `user ALL=(ALL) /usr/bin/systemctl restart nginx` instead of ALL.',
      'Always keep a root shell open when modifying sudoers as a safety net.',
    ],
  },

  // ─── DISK & STORAGE ────────────────────────────────────────────────

  lsblk: {
    useCases: [
      'List all block devices and their partitions in a tree view',
      'Identify disk device names before partitioning or formatting',
      'Check mount points and filesystem types at a glance',
    ],
    internals:
      'lsblk reads from /sys/block and /sys/class/block to enumerate block devices. It builds the parent-child tree from kernel device relationships and optionally queries udev for additional properties like UUID, LABEL, and FSTYPE.',
    mistakes: [
      'Confusing device names between reboots — device names (sda, sdb) can change. Use UUID or LABEL for persistent identification.',
      'Not using `lsblk -f` to see filesystem info — the default output omits UUIDs and mount points.',
    ],
    bestPractices: [
      'Use `lsblk -f` to see filesystem types, UUIDs, labels, and mount points.',
      'Use `lsblk -o NAME,SIZE,TYPE,MOUNTPOINT,UUID` for custom column output.',
      'Cross-reference with `blkid` for authoritative UUID/label information.',
    ],
  },

  mount: {
    useCases: [
      'Attach a filesystem to the directory tree for access',
      'Mount USB drives, ISO images, or network shares',
      'Remount a filesystem with different options (e.g., read-write)',
    ],
    internals:
      'mount invokes the mount(2) syscall, which attaches a filesystem superblock to a directory inode (the mount point). The VFS layer routes subsequent path lookups through the mounted filesystem. Options are passed to the filesystem driver in the kernel.',
    mistakes: [
      'Mounting over a non-empty directory — the original contents become hidden (not deleted) until unmount. Use empty directories as mount points.',
      'Forgetting to unmount before removing media — this can corrupt the filesystem. Use `umount` or `sync` first.',
      'Not using `mount -o remount` when changing options — unmounting an active filesystem may fail if files are open.',
    ],
    bestPractices: [
      'Use `mount -o ro` for read-only access when examining forensic images or untrusted media.',
      'Use `mount -a` to mount all entries in /etc/fstab (useful after editing fstab).',
      'Use `findmnt` for a cleaner view of the current mount tree than plain `mount` output.',
    ],
  },

  fdisk: {
    useCases: [
      'Create, delete, and modify MBR partition tables on disks',
      'View existing partition layouts for troubleshooting',
      'Set partition types and bootable flags',
    ],
    internals:
      'fdisk reads and writes the partition table stored in the first sector (MBR) or in GPT headers. Changes are made in memory and only written to disk when you issue the `w` command. It manipulates CHS/LBA addressing for legacy compatibility.',
    mistakes: [
      'Writing the partition table to the wrong disk — double-check the device name with `lsblk` before running fdisk.',
      'Using fdisk for GPT disks — while modern fdisk supports GPT, `gdisk` or `parted` are more reliable for GPT operations.',
      'Not running `partprobe` after modifying partitions on a live system — the kernel may not see the changes until notified.',
    ],
    bestPractices: [
      'Always back up the existing partition table with `sfdisk -d /dev/sdX > backup.txt` before modifications.',
      'Use `fdisk -l` to list all disks and partitions non-destructively.',
      'Prefer `parted` or `gdisk` for GPT partition tables on modern systems.',
    ],
  },

  mkfs: {
    useCases: [
      'Create a new filesystem on a partition or block device',
      'Format USB drives with a specific filesystem (ext4, FAT32, NTFS)',
      'Initialize filesystems with tuned parameters for specific workloads',
    ],
    internals:
      'mkfs is a frontend that calls filesystem-specific tools (mkfs.ext4, mkfs.xfs, mkfs.vfat, etc.). Each tool writes the filesystem superblock, inode tables, journal, and allocation structures to the target device, overwriting any existing data.',
    mistakes: [
      'Running mkfs on the wrong device — this destroys all data. Triple-check with `lsblk` and ensure the device is not mounted.',
      'Using mkfs on a partition that is currently mounted — the filesystem will be corrupted. Always unmount first.',
      'Not specifying the filesystem type — `mkfs` without `-t` may default to ext2, which lacks journaling.',
    ],
    bestPractices: [
      'Always specify the filesystem type: `mkfs -t ext4 /dev/sdX1`.',
      'Add a label with `-L mylabel` for easy identification in mount commands and fstab.',
      'Use `mkfs.ext4 -T largefile` for partitions storing few, very large files to optimize inode allocation.',
    ],
  },

  blkid: {
    useCases: [
      'Find UUID, LABEL, and filesystem type of block devices',
      'Generate fstab entries using persistent identifiers',
      'Identify unlabeled partitions during troubleshooting',
    ],
    internals:
      'blkid probes block devices by reading magic bytes at known offsets to identify filesystem types. It maintains a cache at /etc/blkid.tab (or /run/blkid/blkid.tab) to speed up subsequent lookups.',
    mistakes: [
      'Relying on stale blkid cache — use `blkid -g` (garbage collect) or `blkid -p` (low-level probe, no cache) if results seem wrong.',
      'Not running as root — blkid may not be able to read all devices without elevated privileges.',
    ],
    bestPractices: [
      'Use `blkid -o export /dev/sdX1` for easily parsable output in scripts.',
      'Reference UUIDs from blkid in /etc/fstab instead of device names for stability.',
      'Use `blkid -p` to force a fresh probe and bypass the cache.',
    ],
  },

  dd: {
    useCases: [
      'Write ISO images to USB drives for bootable media',
      'Create disk-level backups (full partition clones)',
      'Generate files of specific sizes for testing',
      'Securely wipe drives by overwriting with zeros or random data',
    ],
    internals:
      'dd reads blocks of a specified size from input and writes them to output, performing optional conversions. It operates below the filesystem level, copying raw bytes. It uses the read(2)/write(2) syscalls directly, with configurable block sizes that significantly affect throughput.',
    mistakes: [
      'Specifying the wrong `of=` target — dd will silently overwrite any device without confirmation. It is nicknamed "disk destroyer" for a reason. Verify with `lsblk` first.',
      'Using too small a block size — the default 512 bytes is very slow for bulk copies. Use `bs=4M` or larger.',
      'Forgetting `status=progress` — without it, dd runs silently and you cannot tell if it is working or stuck.',
    ],
    bestPractices: [
      'Always double-check the `of=` device before pressing Enter.',
      'Use `dd bs=4M status=progress oflag=sync` for writing ISO images to USB drives.',
      'Prefer `pv` piped to dd for a progress bar: `pv input.iso | dd of=/dev/sdX bs=4M`.',
      'Use `sync` after dd completes to flush kernel buffers before removing media.',
    ],
  },

  parted: {
    useCases: [
      'Create and manage GPT and MBR partition tables',
      'Resize partitions without data loss (for supported filesystems)',
      'Script partition operations in non-interactive mode',
    ],
    internals:
      'parted reads and writes partition tables directly and can handle both MBR and GPT. Unlike fdisk, changes are applied immediately when you issue commands (no separate write step). It uses libparted for filesystem-aware resizing when supported.',
    mistakes: [
      'Forgetting that parted applies changes immediately — there is no undo or "write" confirmation step. One wrong command can destroy the partition table.',
      'Resizing a mounted filesystem — always unmount before resizing to avoid corruption.',
      'Confusing parted units — use `unit s` (sectors) for precision or `unit MiB` for clarity. Default units can cause off-by-one alignment issues.',
    ],
    bestPractices: [
      'Use `parted -s` for scripted (non-interactive) partition operations.',
      'Set optimal alignment with `parted -a optimal` for SSDs and modern drives.',
      'Back up the partition table before modifications: `sgdisk --backup=table.bak /dev/sdX`.',
    ],
  },

  smartctl: {
    useCases: [
      'Check hard drive and SSD health via S.M.A.R.T. attributes',
      'Run self-tests to proactively detect failing drives',
      'Monitor drive temperature and error counters over time',
    ],
    internals:
      'smartctl communicates with storage devices via ATA/SCSI/NVMe pass-through commands to query the on-device S.M.A.R.T. firmware. It reads attribute tables, error logs, and self-test results stored in drive firmware. Part of the smartmontools package.',
    mistakes: [
      'Assuming a "PASSED" overall assessment means the drive is healthy — individual attributes like Reallocated Sector Count or Current Pending Sector may indicate imminent failure even when the overall status passes.',
      'Not running periodic self-tests — S.M.A.R.T. attributes only update during tests. Schedule regular short/long tests.',
      'Ignoring smartctl on NVMe drives — NVMe uses a different attribute set. Use `smartctl -a /dev/nvme0` for NVMe health data.',
    ],
    bestPractices: [
      'Run `smartctl -a /dev/sdX` for a comprehensive health report.',
      'Schedule long self-tests weekly with `smartctl -t long /dev/sdX`.',
      'Set up smartd for continuous monitoring with email alerts on attribute changes.',
    ],
  },

  ncdu: {
    useCases: [
      'Interactively find what is consuming disk space',
      'Navigate large directory trees to identify the biggest files and folders',
      'Clean up disk space by identifying and deleting unnecessary files',
    ],
    internals:
      'ncdu (NCurses Disk Usage) performs a single recursive scan of the target directory, building an in-memory tree of sizes. It then displays an interactive ncurses interface sorted by size. This is much faster than running du repeatedly.',
    mistakes: [
      'Scanning from root (/) without excluding virtual filesystems — `/proc`, `/sys`, and `/dev` can produce misleading results. Use `-x` to stay on one filesystem.',
      'Deleting files from ncdu without understanding what they are — press `d` carefully and verify before confirming.',
    ],
    bestPractices: [
      'Use `ncdu -x /` to scan only the root filesystem without crossing mount boundaries.',
      'Export scans with `ncdu -o scan.json /` to analyze later with `ncdu -f scan.json`.',
      'Run ncdu on remote servers via SSH to quickly diagnose disk-full situations.',
    ],
  },

  fstab: {
    useCases: [
      'Define filesystems to mount automatically at boot',
      'Configure mount options for network shares (NFS, CIFS)',
      'Set up swap partitions for automatic activation',
    ],
    internals:
      '/etc/fstab is read by mount(8) and systemd-fstab-generator. Each line describes a filesystem: device, mount point, type, options, dump flag, and fsck pass number. systemd converts fstab entries into .mount units at boot.',
    mistakes: [
      'Using device names (/dev/sda1) instead of UUIDs — device names can change between boots, causing mount failures. Use UUID=<uuid> or LABEL=<label>.',
      'Misspelling mount options — a typo can prevent the system from booting. Always test with `mount -a` before rebooting.',
      'Setting the fsck pass to 0 for ext4 root — root should be pass 1 for boot-time filesystem checks.',
    ],
    bestPractices: [
      'Always use UUID= or LABEL= for device identification.',
      'Test fstab changes with `mount -a` and `findmnt --verify` before rebooting.',
      'Add `nofail` to non-critical mounts so boot continues if the device is absent.',
      'Add `noauto` for entries you want defined but not mounted at boot (mount manually with `mount /mountpoint`).',
    ],
  },

  tune2fs: {
    useCases: [
      'Adjust ext2/ext3/ext4 filesystem parameters after creation',
      'Add or remove a journal to convert between ext2 and ext3/ext4',
      'Set reserved block percentage for non-root users',
    ],
    internals:
      'tune2fs modifies the filesystem superblock directly. It can change parameters like the reserved block count, maximum mount count before forced fsck, volume label, and feature flags. Changes take effect immediately without unmounting (for most options).',
    mistakes: [
      'Reducing reserved blocks to 0% on root filesystems — the reserved space (default 5%) prevents root from being unable to write logs when disk is full. Keep at least 1-2% for root.',
      'Enabling features not supported by the running kernel — this can make the filesystem unmountable.',
      'Running tune2fs on a mounted filesystem for options that require unmounting — check the man page for each option.',
    ],
    bestPractices: [
      'Reduce reserved blocks on large data partitions: `tune2fs -m 1 /dev/sdX1` (1% instead of 5%).',
      'Set a filesystem label for easy identification: `tune2fs -L mylabel /dev/sdX1`.',
      'Use `tune2fs -l /dev/sdX1` to display current superblock settings.',
    ],
  },

  'xfs-repair': {
    useCases: [
      'Repair corrupted XFS filesystems after crashes or hardware failures',
      'Check XFS filesystem integrity when errors are suspected',
      'Recover from log corruption that prevents mounting',
    ],
    internals:
      'xfs_repair reads the XFS filesystem structures (superblock, AG headers, inode btrees, extent btrees) and rebuilds any inconsistent metadata. It operates in multiple phases: superblock verification, AG scanning, inode discovery, and directory reconstruction. It must be run on an unmounted filesystem.',
    mistakes: [
      'Running xfs_repair on a mounted filesystem — this will cause data corruption. Always unmount first.',
      'Not trying `mount -o ro` first — if the filesystem just needs log replay, a read-only mount will clean the log without repair.',
      'Using `-L` (force log zeroing) as a first resort — this discards pending log transactions and should only be used when normal repair and mount fail.',
    ],
    bestPractices: [
      'Unmount the filesystem before running: `umount /dev/sdX1 && xfs_repair /dev/sdX1`.',
      'Try `xfs_repair -n` (no-modify mode) first to assess damage without making changes.',
      'Use `xfs_repair -L` only as a last resort after backing up whatever data is recoverable.',
    ],
  },

  // ─── SYSTEM MONITORING ─────────────────────────────────────────────

  dmesg: {
    useCases: [
      'View kernel messages for hardware detection and driver loading',
      'Diagnose hardware failures, USB device issues, or filesystem errors',
      'Check boot messages after system startup',
    ],
    internals:
      'dmesg reads the kernel ring buffer, a fixed-size circular buffer (typically 256 KB-1 MB) where the kernel stores printk() messages. Messages include timestamps, log levels, and subsystem identifiers. When the buffer is full, old messages are overwritten.',
    mistakes: [
      'Expecting dmesg to persist across reboots — the kernel ring buffer is volatile. Use `journalctl -k` for persistent kernel logs.',
      'Not filtering by level — dmesg outputs everything. Use `dmesg -l err,warn` to focus on problems.',
      'Running as non-root on newer kernels — `dmesg_restrict` sysctl may block unprivileged access. Use sudo.',
    ],
    bestPractices: [
      'Use `dmesg -T` to display human-readable timestamps instead of seconds since boot.',
      'Use `dmesg -w` to follow new kernel messages in real time (like `tail -f`).',
      'Filter by facility: `dmesg --facility=kern` for kernel-only messages.',
    ],
  },

  journalctl: {
    useCases: [
      'Query systemd journal logs for any service, unit, or boot session',
      'Follow live log output from specific services',
      'Investigate errors by filtering on time ranges, priorities, or PIDs',
      'View logs from previous boots for post-crash analysis',
    ],
    internals:
      'journalctl reads binary journal files stored in /var/log/journal/ (persistent) or /run/log/journal/ (volatile). The journal is structured and indexed, allowing efficient filtering by unit, priority, timestamp, and arbitrary fields without grep.',
    mistakes: [
      'Not persisting the journal — if /var/log/journal/ does not exist, logs are lost on reboot. Create the directory and restart systemd-journald.',
      'Searching all logs without filters — on busy systems, unfiltered output is overwhelming. Always filter by unit, time, or priority.',
      'Ignoring journal disk usage — without limits, the journal can fill the disk. Configure `SystemMaxUse` in journald.conf.',
    ],
    bestPractices: [
      'Use `journalctl -u <service> -f` to follow a specific service\'s logs in real time.',
      'Filter by priority: `journalctl -p err` to see only errors and above.',
      'View logs from the last boot: `journalctl -b -1` for post-crash investigation.',
      'Set size limits in /etc/systemd/journald.conf with `SystemMaxUse=500M`.',
    ],
  },

  vmstat: {
    useCases: [
      'Get a quick overview of system memory, swap, CPU, and I/O activity',
      'Monitor system performance at regular intervals',
      'Identify memory pressure or CPU saturation',
    ],
    internals:
      'vmstat reads /proc/stat, /proc/meminfo, and /proc/vmstat to collect CPU, memory, swap, and I/O counters. The first line shows averages since boot; subsequent lines (with an interval) show per-period deltas.',
    mistakes: [
      'Reading the first line as current values — the first line is always the average since boot. Look at subsequent lines for real-time data.',
      'Ignoring the `si`/`so` (swap in/out) columns — non-zero values indicate active swapping, which is a sign of memory pressure.',
      'Not specifying an interval and count — `vmstat 1 10` gives 10 one-second samples, which is much more useful than a single snapshot.',
    ],
    bestPractices: [
      'Use `vmstat 1 10` for a quick 10-second performance snapshot.',
      'Watch the `r` column (run queue) — values consistently higher than CPU count indicate CPU saturation.',
      'Combine with `iostat` for a complete picture of CPU and disk performance.',
    ],
  },

  iostat: {
    useCases: [
      'Monitor disk I/O throughput and latency per device',
      'Identify which disk is the performance bottleneck',
      'Track CPU utilization broken down by user, system, and I/O wait',
    ],
    internals:
      'iostat reads /proc/diskstats and /proc/stat to compute per-device I/O statistics. It reports read/write rates, average request sizes, queue depths, and service times. Part of the sysstat package.',
    mistakes: [
      'Reading the first report as current — like vmstat, the first report is since boot. Use an interval for real-time data.',
      'Ignoring `%util` at 100% on SSDs — %util is less meaningful for SSDs and NVMe with multiple queues. Focus on latency (await) instead.',
      'Not using `-x` for extended statistics — the default output lacks critical fields like await (latency) and queue depth.',
    ],
    bestPractices: [
      'Use `iostat -xz 1` for extended stats with an interval, omitting idle devices.',
      'Watch `await` (average I/O latency in ms) — high values indicate storage bottlenecks.',
      'Use `iostat -p ALL` to see stats for individual partitions.',
    ],
  },

  lsof: {
    useCases: [
      'Find which process is using a specific file or port',
      'Identify processes holding deleted files (preventing disk space reclamation)',
      'Debug "address already in use" errors by finding the process on a port',
      'List all files opened by a specific process or user',
    ],
    internals:
      'lsof reads /proc/<pid>/fd for each process to enumerate open file descriptors. It resolves these to inodes, socket info, and network connections. It also reads /proc/net/* for socket mappings.',
    mistakes: [
      'Running lsof without arguments — it lists every open file on the system, which can be extremely slow and produce overwhelming output.',
      'Forgetting to use sudo — lsof cannot see other users\' processes without root privileges.',
      'Not knowing the `-i` syntax — use `lsof -i :8080` (colon before port) to find processes on a specific port.',
    ],
    bestPractices: [
      'Use `lsof -i :PORT` to quickly find what is listening on a port.',
      'Use `lsof +D /path/` to find processes with files open in a directory (useful before unmounting).',
      'Find deleted but open files wasting space: `lsof +L1` lists files with zero link count.',
    ],
  },

  watch: {
    useCases: [
      'Repeatedly run a command and display its output in real time',
      'Monitor changing values like disk usage, process counts, or queue depths',
      'Wait for a condition to appear without manual re-running',
    ],
    internals:
      'watch uses ncurses to clear the screen, executes the specified command via the shell at the given interval (default 2 seconds), and redisplays the output. With `-d`, it highlights differences between successive runs.',
    mistakes: [
      'Not quoting commands with pipes or special characters — `watch ls | grep foo` watches only `ls`. Use `watch "ls | grep foo"` with quotes.',
      'Using too short an interval for expensive commands — `watch -n 0.1 du -sh /` will hammer the filesystem.',
      'Expecting watch to work with interactive commands — watch only captures stdout and has no terminal interaction.',
    ],
    bestPractices: [
      'Use `watch -d` to highlight differences between updates for easy change detection.',
      'Use `watch -n 5 "command"` for an appropriate interval to avoid system load.',
      'Combine with `-g` (exit when output changes) for scripted waiting: `watch -g "ls /path/to/expected-file"`.',
    ],
  },

  nohup: {
    useCases: [
      'Run a command that continues after you log out of SSH',
      'Start long-running background jobs immune to hangup signals',
      'Launch daemons from the command line without a service manager',
    ],
    internals:
      'nohup sets the SIGHUP signal disposition to ignore, redirects stdout/stderr to nohup.out (if not already redirected), then execs the specified command. The process survives the terminal closing because it ignores the HUP signal sent when the controlling terminal disconnects.',
    mistakes: [
      'Forgetting to append `&` — `nohup command` still runs in the foreground. Use `nohup command &` to background it.',
      'Not redirecting output — nohup writes to nohup.out in the current directory, which can grow unbounded.',
      'Using nohup when screen/tmux is available — tmux provides a recoverable session, which is far more convenient.',
    ],
    bestPractices: [
      'Use `nohup command > /dev/null 2>&1 &` to fully detach with no output file.',
      'Prefer tmux or screen for interactive jobs where you need to reattach later.',
      'Use `disown` after backgrounding if you forgot nohup: `command & disown`.',
    ],
  },

  strace: {
    useCases: [
      'Debug why a program fails by tracing its system calls',
      'Identify which files a process opens or which network connections it makes',
      'Profile system call frequency and latency for performance analysis',
      'Attach to a running process to diagnose hangs or unexpected behavior',
    ],
    internals:
      'strace uses the ptrace(2) system call to intercept and record every syscall made by the traced process. The kernel stops the tracee at each syscall entry and exit, allowing strace to log the call name, arguments, and return value. This introduces significant overhead (10-100x slowdown).',
    mistakes: [
      'Using strace in production without understanding the overhead — ptrace adds severe latency. Use perf or eBPF for production tracing.',
      'Not filtering with `-e` — unfiltered strace output is enormous. Use `-e trace=file` or `-e trace=network` to focus.',
      'Forgetting `-f` when tracing programs that fork — child processes are not traced by default.',
    ],
    bestPractices: [
      'Use `-e trace=open,read,write` to focus on file I/O activity.',
      'Attach to a running process with `strace -p <PID> -f` for live debugging.',
      'Use `-c` for a syscall summary (count and time) instead of full trace output.',
      'Redirect output to a file with `-o trace.log` for later analysis.',
    ],
  },

  sar: {
    useCases: [
      'Review historical CPU, memory, disk, and network utilization',
      'Correlate performance issues with specific times of day',
      'Generate daily/weekly performance reports for capacity planning',
    ],
    internals:
      'sar reads binary data files collected by the sa1 cron job (which runs sadc, the system activity data collector). These files are stored in /var/log/sa/ (or /var/log/sysstat/). sadc samples kernel counters at configurable intervals and writes them to the daily data file.',
    mistakes: [
      'Not enabling sysstat data collection — sar shows "Cannot open" errors because the sa1/sa2 cron jobs are not configured.',
      'Looking at only CPU stats — sar has many subsystems. Use `-r` (memory), `-b` (I/O), `-n DEV` (network) for complete analysis.',
      'Not specifying a date — sar defaults to today. Use `-f /var/log/sa/sa<DD>` for historical data.',
    ],
    bestPractices: [
      'Enable the sysstat systemd timer or cron jobs for continuous data collection.',
      'Use `sar -u 1 10` for a quick CPU utilization snapshot.',
      'Use `sar -n DEV -f /var/log/sa/sa15` to review network activity from the 15th of the month.',
      'Combine multiple flags: `sar -u -r -b 1 5` for CPU, memory, and I/O in one view.',
    ],
  },

  nethogs: {
    useCases: [
      'Identify which processes are consuming the most network bandwidth',
      'Monitor per-process bandwidth usage in real time',
      'Troubleshoot unexpected network traffic from unknown processes',
    ],
    internals:
      'nethogs uses libpcap to capture packets on network interfaces and correlates them to processes by matching socket endpoints in /proc/net/tcp and /proc/<pid>/fd. It groups traffic by PID and displays per-process send/receive rates.',
    mistakes: [
      'Running without root — nethogs needs raw socket access for packet capture.',
      'Not specifying an interface on multi-homed systems — use `nethogs eth0` to target a specific interface.',
      'Expecting accurate totals — nethogs tracks TCP connections; UDP and other protocols may not be fully accounted for.',
    ],
    bestPractices: [
      'Run `nethogs -t` for tracemode (non-interactive) output suitable for logging.',
      'Specify the interface: `nethogs eth0` to focus on the relevant network.',
      'Use `iftop` alongside nethogs for a per-connection view vs per-process view.',
    ],
  },

  iftop: {
    useCases: [
      'Monitor per-connection network bandwidth in real time',
      'Identify which remote hosts are sending/receiving the most traffic',
      'Debug network congestion by seeing active connection throughput',
    ],
    internals:
      'iftop uses libpcap to capture packets on an interface and aggregates traffic by source/destination IP pairs. It displays a top-like interface with bar graphs showing 2-second, 10-second, and 40-second traffic averages.',
    mistakes: [
      'Running without specifying an interface — iftop may pick the wrong one. Use `-i eth0` explicitly.',
      'Expecting process-level attribution — iftop shows connections, not processes. Use nethogs for per-process data.',
      'Not using `-n` to disable DNS lookups — DNS resolution slows the display significantly on busy networks.',
    ],
    bestPractices: [
      'Use `iftop -nNP -i eth0` to show numeric IPs, no DNS, and port numbers for quick identification.',
      'Press `t` to toggle between one-line and two-line display modes.',
      'Use `-F net/mask` to filter traffic to/from a specific subnet.',
    ],
  },

  mpstat: {
    useCases: [
      'View per-CPU utilization to detect imbalanced workloads',
      'Identify if a workload is single-threaded (one core maxed, others idle)',
      'Monitor CPU utilization breakdown (user, system, iowait, idle) per core',
    ],
    internals:
      'mpstat reads per-CPU counters from /proc/stat and reports utilization percentages for each CPU. Part of the sysstat package. It breaks down time into user, nice, system, iowait, irq, softirq, steal, and idle.',
    mistakes: [
      'Only looking at aggregate CPU — mpstat\'s value is per-core breakdowns. Use `-P ALL` to see all cores.',
      'Ignoring `%steal` on virtual machines — high steal indicates the hypervisor is throttling your VM\'s CPU time.',
      'Not using an interval — a single snapshot is less useful than a time series. Use `mpstat -P ALL 1 10`.',
    ],
    bestPractices: [
      'Use `mpstat -P ALL 1` to monitor all CPUs with one-second intervals.',
      'Watch `%iowait` per core — high values indicate I/O-bound processes pinned to specific cores.',
      'Combine with `pidstat` to correlate per-CPU usage with specific processes.',
    ],
  },

  perf: {
    useCases: [
      'Profile CPU usage at the function level to find performance hotspots',
      'Trace hardware performance counters (cache misses, branch mispredictions)',
      'Record and analyze execution traces for optimization work',
      'Generate flame graphs for visual performance analysis',
    ],
    internals:
      'perf uses the Linux perf_events subsystem to program CPU hardware performance counters (PMCs) and software tracepoints. It samples the instruction pointer at a configurable rate, resolves symbols from debug info, and records call stacks. Data is written to perf.data files for offline analysis.',
    mistakes: [
      'Profiling without debug symbols — stack traces show hex addresses instead of function names. Install -dbg/-debuginfo packages.',
      'Using too high a sampling rate — `perf record -F 99` (99 Hz) is usually sufficient. Higher rates add overhead.',
      'Forgetting `perf record` runs until interrupted — always Ctrl+C to stop. Use `-g` for call graphs.',
    ],
    bestPractices: [
      'Use `perf top` for a live top-like view of CPU-consuming functions.',
      'Record with call graphs: `perf record -g -p <PID>` then `perf report`.',
      'Generate flame graphs: pipe `perf script` output through FlameGraph tools.',
      'Use `perf stat <command>` for quick hardware counter summaries (IPC, cache misses).',
    ],
  },

  htop: {
    useCases: [
      'Interactively monitor processes with CPU, memory, and I/O usage',
      'Search, filter, and signal processes from a visual interface',
      'View per-core CPU usage and memory breakdown at a glance',
    ],
    internals:
      'htop reads /proc/<pid>/stat, /proc/<pid>/status, and /proc/meminfo to gather process and system metrics. It uses ncurses for the TUI and updates at a configurable interval (default 1.5 seconds). It can display process trees and supports mouse interaction.',
    mistakes: [
      'Killing processes with the wrong signal — htop defaults to SIGTERM (15). Some processes need SIGKILL (9) to stop, but always try SIGTERM first.',
      'Sorting by memory without understanding VIRT vs RES — VIRT includes mapped but unused memory. Sort by RES (resident) for actual physical memory usage.',
      'Not using the tree view — press F5 to see parent-child process relationships, which helps identify fork bombs or runaway spawners.',
    ],
    bestPractices: [
      'Press F5 for tree view, F6 to choose sort column, F4 to filter by name.',
      'Customize columns in Setup (F2) to show I/O rates, thread counts, or cgroup info.',
      'Use `htop -u <user>` to monitor only one user\'s processes.',
    ],
  },

  atop: {
    useCases: [
      'Monitor system-level and process-level resource usage with historical logging',
      'Analyze past performance issues from atop\'s persistent log files',
      'Track disk I/O and network I/O per process (unlike basic top)',
    ],
    internals:
      'atop reads kernel counters from /proc and uses the netlink interface for process accounting. It writes snapshots to compressed log files in /var/log/atop/ at configurable intervals (default 600 seconds via the atop service). Past snapshots can be replayed with `atop -r`.',
    mistakes: [
      'Not starting the atop service — without it, historical data is not collected. Enable `atop.service` for persistent logging.',
      'Ignoring the color coding — atop highlights critical resources in red. Pay attention to red bars and values.',
      'Expecting real-time per-process network stats without the netatop kernel module — install netatop for per-process network breakdowns.',
    ],
    bestPractices: [
      'Enable the atop systemd service for continuous background logging.',
      'Use `atop -r /var/log/atop/atop_YYYYMMDD` to replay historical data and press `t`/`T` to step through snapshots.',
      'Press `d` for disk view, `n` for network view, `m` for memory view during interactive use.',
    ],
  },

  glances: {
    useCases: [
      'Get a comprehensive system overview in a single terminal window',
      'Monitor remote systems via a built-in web interface or API',
      'Export system metrics to InfluxDB, Prometheus, or other backends',
    ],
    internals:
      'glances is a Python-based monitoring tool using the psutil library to read system metrics cross-platform. It aggregates CPU, memory, disk, network, processes, containers, and sensors into a single curses-based dashboard. It supports client-server mode and REST API export.',
    mistakes: [
      'Installing without optional dependencies — features like Docker monitoring, GPU stats, and sensors require extra Python packages.',
      'Running glances in web mode on an untrusted network without authentication — use `--password` to enable auth.',
      'Expecting low resource usage — glances consumes more CPU/memory than top/htop due to Python overhead. Use htop on resource-constrained systems.',
    ],
    bestPractices: [
      'Use `glances -w` to start the web interface for remote monitoring.',
      'Export to time-series databases: `glances --export influxdb2` for historical dashboards.',
      'Use `glances -t 5` to set a 5-second refresh interval on busy systems.',
    ],
  },

  pidstat: {
    useCases: [
      'Monitor CPU, memory, or I/O statistics for specific processes',
      'Track per-thread CPU usage for multi-threaded applications',
      'Correlate per-process I/O with overall system I/O from iostat',
    ],
    internals:
      'pidstat reads /proc/<pid>/stat and /proc/<pid>/io to report per-process or per-thread statistics at regular intervals. It is part of the sysstat package and shares sadc\'s data collection framework.',
    mistakes: [
      'Not using `-d` for disk I/O stats — the default shows only CPU. Use `-d` for I/O and `-r` for memory.',
      'Forgetting `-t` for per-thread stats — without it, multi-threaded app stats are aggregated.',
      'Not specifying a PID with `-p` — without it, pidstat shows all processes, which can be noisy.',
    ],
    bestPractices: [
      'Use `pidstat -u -d -r 1` for combined CPU, disk, and memory stats at 1-second intervals.',
      'Target a specific process: `pidstat -p <PID> -t 1` for per-thread breakdown.',
      'Combine with `strace -c` output to correlate syscall patterns with resource usage.',
    ],
  },
}
