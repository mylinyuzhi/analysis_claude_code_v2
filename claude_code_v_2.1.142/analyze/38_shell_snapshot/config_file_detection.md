# Config Detection & Content Generation (v2.1.142)

> The three functions that decide **which config file to source** and **what to write into the snapshot**. Together they implement the bash-vs-zsh-vs-sh branching that lets a single snapshotter handle three subtly different shell environments.

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_shell_snapshot.md](../00_overview/symbol_additions_v2_1_142_shell_snapshot.md) - Unit 04 module symbols

Key functions in this document:
- `getConfigFile` (`Sv6`) — Shell path → config path mapping (cli_inner_pretty.js:360534)
- `getUserSnapshotContent` (`Yi_`) — User functions/options/aliases capture (cli_inner_pretty.js:360538)
- `getClaudeCodeSnapshotContent` (`fi_`) — rg/find/grep/bq/PATH injection (cli_inner_pretty.js:360597)
- `createRipgrepShellIntegration` (`Ki_`) — rg snippet builder (referenced)
- `createFindGrepShellIntegration` (`Ai_`) — bfs/ugrep snippet builder (referenced)
- `createBigQueryShellIntegration` (`zi_`) — placeholder, always null (referenced)
- `getPluginBinPaths` (`bM6`) — plugin bin/ dir collector (cli_inner_pretty.js:230997)
- `getPlatform` (`c$`) — platform detection
- `subprocessEnv` (`XI`) — env-var sanitizer
- `LITERAL_BACKSLASH` (`yv6`) — `"\\"` escape constant

---

## 1. `getConfigFile` (`Sv6`) — Shell Path to Config Path

```javascript
// ============================================
// getConfigFile - Map shell binary path to its config file
// Location: cli_inner_pretty.js:360534-360537
// ============================================

// ORIGINAL (for source lookup):
function Sv6(H) {
  let $ = H.includes("zsh") ? ".zshrc" : H.includes("bash") ? ".bashrc" : ".profile";
  return vX$.join(lY8.homedir(), $);
}

// READABLE (for understanding):
function getConfigFile(shellPath) {
    const fileName = shellPath.includes("zsh")
        ? ".zshrc"
        : shellPath.includes("bash")
            ? ".bashrc"
            : ".profile";
    return path.join(os.homedir(), fileName);
}

// Mapping: Sv6→getConfigFile, H→shellPath, $→fileName, vX$→path, lY8→os
```

### What it does

Maps a shell binary path to its conventional interactive-config file location.

| Shell path matches | Config file | Why this file |
|--------------------|-------------|---------------|
| Contains `zsh` (e.g., `/bin/zsh`, `/usr/local/bin/zsh`) | `~/.zshrc` | zsh's interactive-shell config (vs `.zshenv` which runs always, `.zlogin` which runs for login shells) |
| Contains `bash` (e.g., `/bin/bash`, `/opt/homebrew/bin/bash`) | `~/.bashrc` | bash's interactive-non-login config (vs `.bash_profile` which is login-only) |
| Anything else (e.g., `/bin/sh`, `/bin/dash`, `/bin/ash`) | `~/.profile` | POSIX-shell convention; sourced by sh-likes for login |

### Why these specific files?

The snapshotter runs the shell with `-c -l` (login mode). Each shell sources different files in different orders for login vs interactive:

```
zsh login flow:    .zshenv → .zprofile → .zshrc → .zlogin
bash login flow:   /etc/profile → ~/.bash_profile (else ~/.bash_login else ~/.profile)
                   then if interactive: ~/.bashrc
sh login flow:     /etc/profile → ~/.profile
```

Claude Code targets the **interactive** config file because that's where users put their day-to-day aliases and functions (their `gst='git status'`, their `cd` overrides, their nvm/pyenv shims). `.bash_profile` and `.zshenv` typically contain only PATH/env exports that the login shell init chain already handles.

By explicitly `source`ing `~/.bashrc` after the shell starts in login mode, we get the union:
- Login chain runs (catches `.bash_profile`, `/etc/profile`, etc.)
- Then we explicitly source `~/.bashrc` to capture the interactive customizations

### Edge case: bash without `.bashrc`

If `~/.bashrc` doesn't exist but the shell is bash, `getSnapshotScript` (`Oi_`) inserts a literal `echo "shopt -s expand_aliases" >> "$SNAPSHOT_FILE"`. This is because bash by default disables `expand_aliases` in non-interactive mode (the mode each Bash tool spawn uses). Without this line, the snapshot's `alias` definitions would be inert. zsh doesn't need this — `alias` is always honored.

### Why no `.profile` capture for bash?

When a user has `bash` but no `.bashrc`, they might still have a `.profile` with their personalizations. The current code does NOT fall back to `.profile` in this case — it just emits the expand_aliases line and proceeds with an empty user content section. This is a deliberate simplification: handling cascading config-file searches across shells adds complexity for an edge case (bash users typically have a `.bashrc`).

### Key insight

The simple `.includes("zsh")` / `.includes("bash")` substring check correctly handles all observed install paths:
- `/bin/zsh` ✓
- `/usr/local/bin/zsh` ✓
- `/opt/homebrew/bin/zsh` (Apple Silicon) ✓
- `/nix/store/...bash-5.2-p15/bin/bash` (NixOS) ✓
- `/bin/bash-static` ✓ (matches "bash")

The fallthrough to `.profile` catches `/bin/sh`, `/bin/dash`, `/bin/ash`, `/bin/ksh` — none of which would be substring-matched. Whether `.profile` is the right config for these is debatable, but it's the closest POSIX convention.

---

## 2. `getUserSnapshotContent` (`Yi_`) — Capture Script Generator

```javascript
// ============================================
// getUserSnapshotContent - Generate script to capture functions/options/aliases
// Location: cli_inner_pretty.js:360538-360596
// ============================================

// ORIGINAL (for source lookup):
function Yi_(H) {
  let $ = H.endsWith(".zshrc"),
    q = "";
  if ($)
    q += `
      echo "# Functions" >> "$SNAPSHOT_FILE"
      typeset -f > /dev/null 2>&1
      typeset +f | grep -vE '^_[^_]' | while read func; do
        typeset -f "$func" >> "$SNAPSHOT_FILE"
      done
    `;
  else
    q += `
      echo "# Functions" >> "$SNAPSHOT_FILE"
      declare -f > /dev/null 2>&1
      declare -F | cut -d' ' -f3 | grep -vE '^_[^_]' | while read func; do
        encoded_func=$(declare -f "$func" | base64 )
        echo "eval ${yv6}"${yv6}$(echo '$encoded_func' | base64 -d)${yv6}" > /dev/null 2>&1" >> "$SNAPSHOT_FILE"
      done
    `;
  if ($)
    q += `
      echo "# Shell Options" >> "$SNAPSHOT_FILE"
      setopt | sed 's/^/setopt /' | head -n 1000 >> "$SNAPSHOT_FILE"
    `;
  else
    q += `
      echo "# Shell Options" >> "$SNAPSHOT_FILE"
      shopt -p | head -n 1000 >> "$SNAPSHOT_FILE"
      set -o | grep "on" | awk '{print "set -o " $1}' | head -n 1000 >> "$SNAPSHOT_FILE"
      echo "shopt -s expand_aliases" >> "$SNAPSHOT_FILE"
    `;
  return (
    (q += `
      echo "# Aliases" >> "$SNAPSHOT_FILE"
      if [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
        alias | grep -v "='winpty " | sed 's/^alias //g' | sed 's/^/alias -- /' | head -n 1000 >> "$SNAPSHOT_FILE"
      else
        alias | sed 's/^alias //g' | sed 's/^/alias -- /' | head -n 1000 >> "$SNAPSHOT_FILE"
      fi
  `), q);
}

// READABLE (for understanding):
function getUserSnapshotContent(configFile) {
    const isZsh = configFile.endsWith(".zshrc");
    let content = "";

    // 1. Functions (bash uses base64 round-trip; zsh uses direct typeset -f)
    if (isZsh) {
        content += zshFunctionCapture;
    } else {
        content += bashFunctionCapture;  // contains LITERAL_BACKSLASH (yv6) embeddings
    }

    // 2. Shell options
    if (isZsh) {
        content += zshShellOptionsCapture;
    } else {
        content += bashShellOptionsCapture;  // shopt -p + set -o + force expand_aliases
    }

    // 3. Aliases (filter winpty on Windows)
    content += sharedAliasCapture;

    return content;
}

// Mapping: Yi_→getUserSnapshotContent, H→configFile, $→isZsh, q→content,
//          yv6→LITERAL_BACKSLASH
```

### 2.1 Function Capture

#### Zsh path

```bash
echo "# Functions" >> "$SNAPSHOT_FILE"
typeset -f > /dev/null 2>&1                          # Force autoload
typeset +f | grep -vE '^_[^_]' | while read func; do
  typeset -f "$func" >> "$SNAPSHOT_FILE"
done
```

**`typeset -f > /dev/null 2>&1` (force autoload):** Zsh has lazy function loading via `autoload`. A function declared `autoload my_func` doesn't have its body until first call. By doing a no-op `typeset -f`, we force all autoloadable functions to resolve. Without this line, autoloaded functions would show up in `typeset +f` (which lists names) but `typeset -f $func` would return nothing.

**`typeset +f`:** Lists function names only. The `+f` form is name-only; `-f` is name+body.

**`grep -vE '^_[^_]'`:** Excludes single-underscore-prefixed names. This regex matches a literal underscore followed by a non-underscore character — so `_git` matches and is filtered, but `__pyenv_init` does NOT match and is kept.

| Pattern | Matches `^_[^_]`? | Kept in snapshot? |
|---------|-------------------|-------------------|
| `_git`, `_ssh`, `_brew_completion` | Yes (single `_` + letter) | No (filtered out) |
| `__pyenv_init`, `__zsh_like_cd` | No (`__` is `_` + `_`) | Yes |
| `nvm`, `gst`, `mise` | No (no leading `_`) | Yes |

The filter is targeted at shell completion handlers. The zsh completion system installs hundreds of `_command` functions that are tens to hundreds of lines each, balloon the snapshot to several MB, and aren't needed for Claude Code's Bash tool. Double-underscore-prefix is the conventional namespace for runtime helpers (mise, pyenv, rbenv, etc.) that DO matter.

**Why direct `typeset -f $func >> $SNAPSHOT_FILE` for zsh:** zsh's function-body output is already re-loadable shell code. No escaping needed.

#### Bash path

```bash
echo "# Functions" >> "$SNAPSHOT_FILE"
declare -f > /dev/null 2>&1                          # Force resolution
declare -F | cut -d' ' -f3 | grep -vE '^_[^_]' | while read func; do
  encoded_func=$(declare -f "$func" | base64 )
  echo "eval \"\$(echo '$encoded_func' | base64 -d)\" > /dev/null 2>&1" >> "$SNAPSHOT_FILE"
done
```

**`declare -F`:** Lists function names in the form `declare -f <name>`. The `cut -d' ' -f3` extracts the third whitespace-separated field — the name itself.

**`base64`:** bash function bodies frequently contain unescapable sequences:
- Single quotes inside the body
- Backslashes that interact with the heredoc/single-quote context of the snapshot script
- Newlines that would terminate `echo` arguments

Base64 encoding makes any byte sequence safe. The round-trip is: capture body → encode → embed encoded string in `echo "eval \"$(echo '<base64>' | base64 -d)\""` → on snapshot source, decode and `eval`.

**Backslash literal escape (`${yv6}` = `"\\"`):** The JavaScript template needs to emit a literal backslash for the shell `eval` to see. The constant `yv6 = "\\"` is used in the template:

```javascript
echo "eval ${yv6}"${yv6}$(echo '$encoded_func' | base64 -d)${yv6}" > /dev/null 2>&1"
```

After JavaScript string interpolation, this produces the shell line:

```bash
echo "eval \"$(echo '$encoded_func' | base64 -d)\" > /dev/null 2>&1"
```

Which, when executed by the snapshot-creation shell, writes this exact text into the snapshot file:

```bash
eval "$(echo 'ZGVjbGFyZSAtZiBteWZ1bmMgKCkgey4uLn0=' | base64 -d)" > /dev/null 2>&1
```

That snapshot-file line, when sourced later, decodes the base64 and `eval`s the function definition.

**`> /dev/null 2>&1` suffix:** Discards any output from the function re-declaration. If a function references a missing tool or has a syntactic issue, `eval` would print warnings — these are silenced.

### 2.2 Shell Options Capture

#### Zsh path

```bash
echo "# Shell Options" >> "$SNAPSHOT_FILE"
setopt | sed 's/^/setopt /' | head -n 1000 >> "$SNAPSHOT_FILE"
```

`setopt` with no arguments lists currently-enabled options, one per line. The `sed` prefixes each with `setopt ` to make them re-executable. Capped at 1000 lines.

#### Bash path

```bash
echo "# Shell Options" >> "$SNAPSHOT_FILE"
shopt -p | head -n 1000 >> "$SNAPSHOT_FILE"
set -o | grep "on" | awk '{print "set -o " $1}' | head -n 1000 >> "$SNAPSHOT_FILE"
echo "shopt -s expand_aliases" >> "$SNAPSHOT_FILE"
```

Bash has **two** option systems:

| System | Command | Re-executable output? |
|--------|---------|----------------------|
| `shopt` | `shopt -p` | Yes — produces `shopt -s name` / `shopt -u name` lines |
| `set -o` | `set -o` | No — produces a two-column table |

For `set -o`, we filter to "on" rows with `grep "on"` then reformat with `awk '{print "set -o " $1}'`. The first column ($1) is the option name.

**`shopt -s expand_aliases` force:** This MUST appear in the snapshot regardless of what the user has set. Bash's behavior:
- Interactive mode: `expand_aliases` defaults ON → aliases work
- Non-interactive mode (`bash -c ...`): `expand_aliases` defaults OFF → aliases are NOT expanded

The Bash tool spawns bash non-interactively. Without forcing `expand_aliases` on in the snapshot, every user alias would be inert.

### 2.3 Alias Capture

```bash
echo "# Aliases" >> "$SNAPSHOT_FILE"
if [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
  alias | grep -v "='winpty " | sed 's/^alias //g' | sed 's/^/alias -- /' | head -n 1000 >> "$SNAPSHOT_FILE"
else
  alias | sed 's/^alias //g' | sed 's/^/alias -- /' | head -n 1000 >> "$SNAPSHOT_FILE"
fi
```

**`alias`:** With no arguments, lists current aliases.

**Two-step sed normalization:**
1. `sed 's/^alias //g'` strips the leading `alias ` token
2. `sed 's/^/alias -- /'` prepends `alias -- `

The `--` separator prevents alias names starting with `-` from being misparsed as flags. (Rare but possible — bash allows alias names containing nearly anything.)

**Windows winpty filter:** On Git Bash, Cygwin, and MSYS2, the user's `.bashrc` typically contains:

```bash
alias node='winpty node.exe'
alias python='winpty python.exe'
```

These are auto-generated wrappers that route through Windows' `winpty` to give the program a TTY. But Claude Code's Bash tool doesn't allocate a TTY — `winpty` would print `stdin is not a tty` and exit. The `grep -v "='winpty "` filter removes any alias whose value starts with `winpty`, letting the user's command see the bare `node`/`python`/etc.

---

## 3. `getClaudeCodeSnapshotContent` (`fi_`) — Tool Injections + PATH

```javascript
// ============================================
// getClaudeCodeSnapshotContent - Inject rg/find/grep/bq/PATH into snapshot
// Location: cli_inner_pretty.js:360597-360660
// ============================================

// ORIGINAL (for source lookup):
async function fi_(H) {
  let $ = process.env.PATH;
  if (c$() === "windows") {
    let f = await tX(H, ["-lc", 'echo "$PATH"'], { reject: !1, timeout: hv6 });
    if (f.exitCode === 0 && f.stdout) $ = f.stdout.trim();
  }
  let q = await bM6();
  if (q.length > 0) {
    let f = c$() === "windows" ? q.map(MP) : q;
    $ = [$, ...f].filter(Boolean).join(":");
  }
  let K = Ki_(), _ = "";
  if (
    ((_ += `
      # Check for rg availability
      echo "# Check for rg availability" >> "$SNAPSHOT_FILE"
      echo "if ! (unalias rg 2>/dev/null; command -v rg) >/dev/null 2>&1; then" >> "$SNAPSHOT_FILE"
  `),
    K.type === "function")
  )
    _ += `
      cat >> "$SNAPSHOT_FILE" << 'RIPGREP_FUNC_END'
  ${K.snippet}
RIPGREP_FUNC_END
    `;
  else {
    let f = K.snippet.replaceAll("'", "'\\''");
    _ += `
      echo '  alias rg='"'${f}'" >> "$SNAPSHOT_FILE"
    `;
  }
  _ += `
      echo "fi" >> "$SNAPSHOT_FILE"
  `;
  let A = Ai_();
  if (A !== null)
    _ += `
      # Shadow find/grep with embedded bfs/ugrep (ant-native only)
      echo "# Shadow find/grep with embedded bfs/ugrep" >> "$SNAPSHOT_FILE"
      cat >> "$SNAPSHOT_FILE" << 'FIND_GREP_FUNC_END'
${A}
FIND_GREP_FUNC_END
    `;
  let z = zi_();
  if (z !== null)
    _ += `
      echo "# Shadow bq to label query jobs with source=claude_code" >> "$SNAPSHOT_FILE"
      cat >> "$SNAPSHOT_FILE" << 'BQ_FUNC_END'
${z}
BQ_FUNC_END
    `;
  let Y = `PATH_END_${Math.random().toString(36).substring(2, 18)}`;
  return ((_ += `

      # Add PATH to the file
      cat >> "$SNAPSHOT_FILE" << '${Y}'
export PATH=${W4([$ || ""])}
${Y}
  `), _);
}

// READABLE (for understanding):
async function getClaudeCodeSnapshotContent(shellPath) {
    // === 1. PATH discovery ===
    let pathValue = process.env.PATH;

    // On Windows, use the bash subshell's PATH (Cygwin-style colon-separated)
    // rather than the Node process.env.PATH (Windows-style semicolon-separated).
    if (getPlatform() === "windows") {
        const cygwinResult = await execa(shellPath, ["-lc", 'echo "$PATH"'], {
            reject: false,
            timeout: SNAPSHOT_CREATION_TIMEOUT       // hv6 = 10000 ms
        });
        if (cygwinResult.exitCode === 0 && cygwinResult.stdout) {
            pathValue = cygwinResult.stdout.trim();
        }
    }

    // Prepend enabled plugin bin/ directories
    const pluginBinDirs = await getPluginBinPaths();
    if (pluginBinDirs.length > 0) {
        const normalizedDirs = getPlatform() === "windows"
            ? pluginBinDirs.map(toCygwinPath)
            : pluginBinDirs;
        pathValue = [pathValue, ...normalizedDirs].filter(Boolean).join(":");
    }

    // === 2. Ripgrep integration ===
    const rgIntegration = createRipgrepShellIntegration();      // Ki_
    let content = "";
    content += `
      # Check for rg availability
      echo "# Check for rg availability" >> "$SNAPSHOT_FILE"
      echo "if ! (unalias rg 2>/dev/null; command -v rg) >/dev/null 2>&1; then" >> "$SNAPSHOT_FILE"
    `;

    if (rgIntegration.type === "function") {
        // Multi-line function body: emit via heredoc to preserve newlines
        content += `
      cat >> "$SNAPSHOT_FILE" << 'RIPGREP_FUNC_END'
  ${rgIntegration.snippet}
RIPGREP_FUNC_END
        `;
    } else {
        // Simple alias: emit via echo, escape single quotes
        const escapedSnippet = rgIntegration.snippet.replaceAll("'", "'\\''");
        content += `
      echo '  alias rg='"'${escapedSnippet}'" >> "$SNAPSHOT_FILE"
        `;
    }
    content += `
      echo "fi" >> "$SNAPSHOT_FILE"
    `;

    // === 3. find/grep shadow ===
    const findGrepIntegration = createFindGrepShellIntegration();   // Ai_
    if (findGrepIntegration !== null) {
        content += `
      # Shadow find/grep with embedded bfs/ugrep (ant-native only)
      echo "# Shadow find/grep with embedded bfs/ugrep" >> "$SNAPSHOT_FILE"
      cat >> "$SNAPSHOT_FILE" << 'FIND_GREP_FUNC_END'
${findGrepIntegration}
FIND_GREP_FUNC_END
        `;
    }

    // === 4. bq shadow (placeholder, always null) ===
    const bqIntegration = createBigQueryShellIntegration();         // zi_
    if (bqIntegration !== null) {
        content += `
      echo "# Shadow bq to label query jobs with source=claude_code" >> "$SNAPSHOT_FILE"
      cat >> "$SNAPSHOT_FILE" << 'BQ_FUNC_END'
${bqIntegration}
BQ_FUNC_END
        `;
    }

    // === 5. PATH export (heredoc with randomized delimiter to avoid collisions) ===
    const pathDelim = `PATH_END_${Math.random().toString(36).substring(2, 18)}`;
    content += `

      # Add PATH to the file
      cat >> "$SNAPSHOT_FILE" << '${pathDelim}'
export PATH=${shellQuote([pathValue || ""])}
${pathDelim}
    `;

    return content;
}

// Mapping: fi_→getClaudeCodeSnapshotContent, H→shellPath, $→pathValue, q→pluginBinDirs,
//          K→rgIntegration, _→content, A→findGrepIntegration, z→bqIntegration, Y→pathDelim,
//          c$→getPlatform, tX→execa, bM6→getPluginBinPaths, MP→toCygwinPath,
//          Ki_→createRipgrepShellIntegration, Ai_→createFindGrepShellIntegration,
//          zi_→createBigQueryShellIntegration, W4→shellQuote, hv6→SNAPSHOT_CREATION_TIMEOUT
```

### 3.1 Why Windows gets a different PATH

On Windows, `process.env.PATH` is a Windows-style `C:\foo;D:\bar` semicolon-separated string. Inside `bash -c` on Cygwin/MSYS2/Git Bash, paths need to be colon-separated and use `/c/foo` style. Asking the bash subshell `echo "$PATH"` gives us the correctly-translated string the user's bash already has, instead of trying to do the translation ourselves.

The `timeout: hv6` (10s) on the inner `execa` call matches the outer snapshot timeout — a slow shell startup won't deadlock here either.

### 3.2 Plugin bin/ path injection

```javascript
const pluginBinDirs = await getPluginBinPaths();
if (pluginBinDirs.length > 0) {
    const normalizedDirs = getPlatform() === "windows"
        ? pluginBinDirs.map(toCygwinPath)
        : pluginBinDirs;
    pathValue = [pathValue, ...normalizedDirs].filter(Boolean).join(":");
}
```

`getPluginBinPaths` (`bM6` at cli_inner_pretty.js:230997) returns the `bin/` subdirectories of all enabled plugins. The function filters out any path containing shell metacharacters (`:`, `"`, `'`, `$`, `` ` ``, `\`, newline) on POSIX systems to prevent injection:

```javascript
// From cli_inner_pretty.js:230997-231006:
async function bM6() {
    let { enabled: H } = await lY();
    return H.filter(($) => !$.isBuiltin && $.path)
        .map(($) => pq.join($.path, "bin"))
        .filter(($) => {
            if (pq.sep !== "\\" && /[:"'$`\\\n\r]/.test($))
                return (N(`Dropping plugin bin path with shell metacharacters: ${$}`), !1);
            return !0;
        });
}
```

`pq.sep` is the path separator (`\\` on Windows, `/` elsewhere). The check skips the metacharacter regex on Windows because Windows paths legitimately contain `:` in drive letters.

**Order matters:** plugin bins are **appended** to the system PATH (`[pathValue, ...normalizedDirs]`), not prepended. This means user-installed system tools win over plugin-shipped equivalents — a conservative default. A future change might add a `priority: prepend` plugin manifest field for plugins that want to override system tools.

### 3.3 The `unalias rg` check explained

```bash
echo "if ! (unalias rg 2>/dev/null; command -v rg) >/dev/null 2>&1; then" >> "$SNAPSHOT_FILE"
```

Two-step subshell check:
1. `unalias rg 2>/dev/null` — removes any `rg` alias the user has set (if no alias exists, the failure is silenced)
2. `command -v rg` — checks if a binary named `rg` is on PATH

Both run inside `(...)` so the unalias doesn't leak into the parent shell. The entire expression's exit code is used by `if !` — non-zero means "rg is NOT available," and we proceed to inject the fallback.

Why `unalias` first? Some users alias `rg` to add default flags (`alias rg='rg --smart-case'`). With the alias active, `command -v rg` would succeed (because the alias exists), but our fallback function wouldn't fire even though the user has no actual binary. Clearing the alias inside the subshell exposes whether the underlying binary exists.

### 3.4 Heredoc vs echo: why both?

The function form of the rg fallback is multi-line:

```bash
function rg {
  local _cc_bin="${CLAUDE_CODE_EXECPATH:-}"
  ...
  fi
}
```

Embedding this into the snapshot via `echo` would require escaping every newline, every double quote, every `$`. Heredoc with a literal delimiter (`'RIPGREP_FUNC_END'`, single-quoted = no variable expansion) is much cleaner:

```bash
cat >> "$SNAPSHOT_FILE" << 'RIPGREP_FUNC_END'
function rg {
  local _cc_bin="${CLAUDE_CODE_EXECPATH:-}"
  ...
}
RIPGREP_FUNC_END
```

The single-quoted delimiter is essential — without quotes, the heredoc body would expand `${CLAUDE_CODE_EXECPATH:-}` immediately (during snapshot generation) instead of preserving it for later (when the snapshot is sourced).

The alias form is single-line, so `echo` with manual escaping is simpler:

```bash
echo '  alias rg='"'/path/to/rg --flag1 --flag2'" >> "$SNAPSHOT_FILE"
```

The mixed quoting (`'  alias rg='"'..."'`) is needed because the alias value itself is wrapped in single quotes (which can't contain unescaped single quotes), so we close the outer single-quote, switch to double-quoted to hold the inner-single-quoted body, and reopen single-quote at the end. The `replaceAll("'", "'\\''")` on the snippet handles any embedded single quotes by closing-escaping-reopening.

### 3.5 Randomized heredoc delimiter for PATH

```javascript
const pathDelim = `PATH_END_${Math.random().toString(36).substring(2, 18)}`;
content += `
  cat >> "$SNAPSHOT_FILE" << '${pathDelim}'
export PATH=${shellQuote([pathValue || ""])}
${pathDelim}
`;
```

Generates a delimiter like `PATH_END_a8x4f9z2k1m0p3q7`. Why random?

Heredocs terminate when the delimiter appears on a line by itself. If the PATH contained literal `PATH_END` (e.g., a directory named `/home/user/PATH_END/bin`), the heredoc would truncate prematurely. A 16-char random suffix makes the collision probability negligible (~36^16 ≈ 8e24 possibilities).

Could a path like `/home/user/foo PATH_END_a8x4f9z2k1m0p3q7/bin` exist? Only if the user deliberately constructed it AFTER reading the snapshot generation logic. The randomization is the practical-paranoia level — not cryptographic, but enough to avoid any realistic accidental collision.

### 3.6 PATH-quoting via `shellQuote` (`W4`)

```javascript
export PATH=${shellQuote([pathValue || ""])}
```

The `shellQuote` (`W4`) helper single-quotes the value, escaping any embedded single quotes via `'\''` substitution. For a typical PATH `/usr/local/bin:/usr/bin:/bin`, this produces:

```bash
export PATH='/usr/local/bin:/usr/bin:/bin'
```

For a pathological PATH containing a single quote (e.g., from a poorly-named directory), it produces:

```bash
export PATH='/usr/local/bin:/home/o'\''connor/bin:/bin'
```

The `'\''` pattern (close-single, escaped-single, open-single) is the standard shell-safe single-quote escape.

---

## 4. v2.1.112 → v2.1.142 Diff Summary

### 4.1 `getClaudeCodeSnapshotContent` (`fi_`)

| Aspect | v2.1.112 (`qzY`) | v2.1.142 (`fi_`) | Why |
|--------|---------|----------|-----|
| Windows PATH probe | Same — `execa(shellPath, ["-lc", 'echo "$PATH"'], {timeout: 10000})` | Same | (preserved) |
| Plugin bin paths | `await RG4()` + path filter + colon-join | `await bM6()` + same | Function renamed but same semantics |
| PATH delimiter | `cat << 'PATH_END_<random16>'` heredoc | Same | (preserved) |
| `bq` shadow path | Wired with `t_Y()` returning null | Same — `zi_()` returns null | Dead code preserved as forward-compat hook |
| `$PATH` quoting | Single-quote via `A5` | Single-quote via `W4` | Same helper, renamed obfuscated symbol |

### 4.2 `getUserSnapshotContent` (`Yi_`)

Identical to v2.1.112's `e_Y`. Same bash/zsh branching, same base64 round-trip for bash functions, same 1000-line caps, same winpty filter.

### 4.3 `getConfigFile` (`Sv6`)

Identical to v2.1.112's `Q47`. Same `.zshrc`/`.bashrc`/`.profile` selection.

### 4.4 VCS exclusion list (`_i_`)

Unchanged: `[".git", ".svn", ".hg", ".bzr", ".jj", ".sl"]`. Same in v2.1.88, v2.1.112, v2.1.142.

### 4.5 Source-line safety

The Bash tool's `buildExecCommand` continues to emit:

```bash
source <snapshot> 2>/dev/null || true
```

Snapshot syntax errors or corruption do not break the entire `&&`-joined command chain. The user gets degraded shell-env fidelity instead of a hard `source` failure.

---

## 5. Why the bash/zsh Asymmetry?

bash and zsh have surprisingly different metaprogramming surfaces. The asymmetry in `getUserSnapshotContent` reflects these real differences:

| Concern | bash answer | zsh answer | Reason |
|---------|-------------|------------|--------|
| Function-name listing | `declare -F` | `typeset +f` | Different builtin commands |
| Function-body extraction | `declare -f $name` | `typeset -f $name` | Different builtin commands |
| Function-body safety | Often needs escaping | Self-quoting | bash output may contain `\` continuations, embedded heredocs; zsh output is re-loadable as-is |
| Lazy/autoload | Not built-in | `autoload` | zsh has explicit autoload mechanism that needs `typeset -f` to force resolution |
| Alias expansion in non-interactive | OFF by default | Always on | bash needs explicit `shopt -s expand_aliases`; zsh doesn't |
| Option-set syntax | `shopt` (bash extensions) + `set -o` (POSIX) | `setopt` | Two systems vs one |

The bash branch uses base64 to defensively handle any function-body content. The zsh branch trusts `typeset -f` output directly. If zsh's output ever turned out to be unsafe in some edge case, the obvious mitigation would be to apply the same base64 round-trip — but to date that hasn't been needed.

---

## 6. Decision Summary

| Decision | Choice | Why |
|----------|--------|-----|
| Map shell binary to single config file | Yes (`.bashrc` / `.zshrc` / `.profile`) | Simplifies the source-and-capture step; trades edge-case coverage for predictability |
| Skip completion functions via `^_[^_]` regex | Yes | Reduces snapshot size dramatically; keeps useful double-underscore helpers |
| Base64 for bash function bodies | Yes | Robust against any content; small size overhead |
| Direct `typeset -f` for zsh | Yes | Trusts zsh's self-quoting output |
| Force `shopt -s expand_aliases` for bash | Yes | Mandatory for aliases to work in non-interactive bash |
| 1000-line caps everywhere | Yes | Safety; doesn't affect typical configs |
| Filter `winpty` aliases on Windows | Yes | Avoids "stdin is not a tty" errors on Git Bash |
| Probe Windows PATH from bash subshell | Yes | Gets Cygwin-style colon-separated string |
| Append (not prepend) plugin bins to PATH | Yes | System tools win over plugin equivalents |
| Random heredoc delimiter for PATH | Yes | Cheap insurance against pathological path contents |
| `bq` shadow wired but null | Yes | Forward-compatibility for future BigQuery feature |
| `source ... \|\| true` on snapshot consumption | Yes (since v2.1.112) | Snapshot corruption no longer breaks commands |
