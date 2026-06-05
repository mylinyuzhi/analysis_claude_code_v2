# Config Detection + User/Claude Content Generators (v2.1.156)

> This doc covers the three functions that decide **which shell rc file to source** and **what content to write into a shell snapshot**: `getConfigFile` (`ux6`, cli_inner_pretty.js:340982-340985), `getUserSnapshotContent` (`oD_`, cli_inner_pretty.js:340986-341044), and `getClaudeCodeSnapshotContent` (`aD_`, cli_inner_pretty.js:341045-341108). The headline 2.1.156 facts: (1) the function-capture filter `grep -vE '^_[^_]'` (cli_inner_pretty.js:340998 zsh / 341011 bash) ships in its **reverted** form — the v2.1.147 variant that also dropped single-underscore *user* functions poisoned the re-sourced shell and returned **exit 127 on every Bash command**, and v2.1.148 reverted it (changelog_to_code_map.md rows 243/260/414); (2) `aD_` adds the `-S dfs` arg to the find shadow, concatenates plugin bin paths via `getPluginBinPaths` (`NV6`, cli_inner_pretty.js:341051-341055), probes the Windows PATH through execa `aJ` (cli_inner_pretty.js:341048), and writes the final PATH through a **random-delimiter heredoc** `PATH_END_<rand16>` (cli_inner_pretty.js:341097-341104); (3) the BigQuery shadow path is dead — `rD_` returns `null` (cli_inner_pretty.js:340979-340981) so the `BQ_FUNC_END` heredoc at cli_inner_pretty.js:341089-341095 never emits.

---

## 1. `getConfigFile` (`ux6`) — Shell Path → Config File

```javascript
// ============================================
// getConfigFile - Map a shell binary path to its interactive rc file under $HOME
// Location: cli_inner_pretty.js:340982-340985
// ============================================

// ORIGINAL (for source lookup):
function ux6(H) {
  let $ = H.includes("zsh") ? ".zshrc" : H.includes("bash") ? ".bashrc" : ".profile";
  return hG$.join(kX8.homedir(), $);
}

// READABLE (for understanding):
function getConfigFile(shellPath) {
  const fileName = shellPath.includes("zsh")
    ? ".zshrc"
    : shellPath.includes("bash")
      ? ".bashrc"
      : ".profile";
  return path.join(os.homedir(), fileName); // hG$ = path module, kX8 = os module
}

// Mapping: ux6→getConfigFile, H→shellPath, $→fileName, hG$→path, kX8→os
```

**What it does:** Translates the shell binary path (e.g. `/bin/zsh`, `/opt/homebrew/bin/bash`, `/bin/sh`) into the conventional interactive-config file path joined under `os.homedir()`.

**How it works (step by step):**
1. Substring-match `"zsh"` anywhere in the path → `.zshrc`.
2. Else substring-match `"bash"` → `.bashrc`.
3. Else (any sh-like: `/bin/sh`, `/bin/dash`, `/bin/ash`, `/bin/ksh`) → `.profile`.
4. `hG$.join(kX8.homedir(), fileName)` produces the absolute path (`path.join(os.homedir(), …)`).

| Shell path matches | Config file | Why this file |
|--------------------|-------------|---------------|
| Contains `zsh` | `~/.zshrc` | zsh's interactive-shell rc (vs `.zshenv` which always runs, `.zlogin` login-only) |
| Contains `bash` | `~/.bashrc` | bash's interactive-non-login rc (vs `.bash_profile` which is login-only) |
| Anything else | `~/.profile` | POSIX sh convention; sourced by sh-likes on login |

**Why this approach:** The snapshotter spawns the real shell with `-c -l` (login mode). The login init chain already covers `.bash_profile`/`.zprofile`/`/etc/profile`, so `getConfigFile` deliberately targets the **interactive** rc file — the place users actually keep their day-to-day aliases, `cd` overrides, and nvm/pyenv/mise shims. Explicitly `source`ing `~/.bashrc` on top of the login chain captures the union of login-time env exports and interactive customizations.

**Alternatives considered (inferable):** A cascading multi-file search (try `.bashrc`, then `.bash_profile`, then `.profile`) would cover more edge cases but adds complexity for a population — bash users — who almost universally have a `.bashrc`. The code instead handles the bash-without-`.bashrc` case downstream in `getSnapshotScript` (`sD_`) by emitting a bare `echo "shopt -s expand_aliases" >> "$SNAPSHOT_FILE"` so aliases still expand even with no user content (see the evidence brief's `sD_` 341114-341135 body order).

**Key insight:** The naive `.includes()` substring test correctly classifies every realistic install path (`/usr/local/bin/zsh`, `/nix/store/…bash-5.2/bin/bash`, `/bin/bash-static` → all match) precisely because shell binary names embed their family name. The fallthrough to `.profile` is the closest POSIX convention for the long tail of `sh`/`dash`/`ksh` even though it is not always the "right" interactive rc for those shells.

**vs v2.1.88 / v2.1.142:** Byte-identical logic. v2.1.88 `getConfigFile` (ShellSnapshot.ts:181-191) and the v2.1.142 doc's `Sv6` use the same `.zshrc`/`.bashrc`/`.profile` selection. Only the obfuscated symbol changed (`Sv6` → `ux6`) and the bound module aliases (`hG$`/`kX8`).

---

## 2. `getUserSnapshotContent` (`oD_`) — Functions / Options / Aliases Capture

```javascript
// ============================================
// getUserSnapshotContent - Emit the shell script that captures user functions, options, aliases
// Location: cli_inner_pretty.js:340986-341044
// ============================================

// ORIGINAL (for source lookup):
function oD_(H) {
  let $ = H.endsWith(".zshrc"),
    q = "";
  if ($)
    q += `
      echo "# Functions" >> "$SNAPSHOT_FILE"

      # Force autoload all functions first
      typeset -f > /dev/null 2>&1

      # Now get user function names - filter completion functions (single underscore prefix)
      # but keep double-underscore helpers (e.g. __zsh_like_cd from mise, __pyenv_init)
      typeset +f | grep -vE '^_[^_]' | while read func; do
        typeset -f "$func" >> "$SNAPSHOT_FILE"
      done
    `;
  else
    q += `
      echo "# Functions" >> "$SNAPSHOT_FILE"

      # Force autoload all functions first
      declare -f > /dev/null 2>&1

      # Now get user function names - filter completion functions (single underscore prefix)
      # but keep double-underscore helpers (e.g. __zsh_like_cd from mise, __pyenv_init)
      declare -F | cut -d' ' -f3 | grep -vE '^_[^_]' | while read func; do
        # Encode the function to base64, preserving all special characters
        encoded_func=$(declare -f "$func" | base64 )
        # Write the function definition to the snapshot
        echo "eval ${bx6}"${bx6}$(echo '$encoded_func' | base64 -d)${bx6}" > /dev/null 2>&1" >> "$SNAPSHOT_FILE"
      done
    `;
  // ... shell options + aliases (see §2.2/§2.3) ...
}

// READABLE (for understanding):
function getUserSnapshotContent(configFile) {
  const isZsh = configFile.endsWith(".zshrc");
  let content = "";
  // 1. Functions: zsh uses direct `typeset -f`; bash uses a base64 round-trip
  content += isZsh ? zshFunctionCapture : bashFunctionCapture; // bashFunctionCapture embeds LITERAL_BACKSLASH (bx6 = "\\")
  // 2. Shell options: zsh `setopt`; bash `shopt -p` + `set -o` + force expand_aliases
  content += isZsh ? zshShellOptionsCapture : bashShellOptionsCapture;
  // 3. Aliases (filter winpty on msys/cygwin)
  content += sharedAliasCapture;
  return content;
}

// Mapping: oD_→getUserSnapshotContent, H→configFile, $→isZsh, q→content, bx6→LITERAL_BACKSLASH
```

The function decides the shell flavor from a single fact — `configFile.endsWith(".zshrc")` (cli_inner_pretty.js:340987) — and concatenates three capture blocks. The asymmetry between branches reflects genuine bash/zsh metaprogramming differences (see §2.4).

### 2.1 The function-capture filter `grep -vE '^_[^_]'` — DEEP ANALYSIS

This is the load-bearing line of the whole module: it appears at cli_inner_pretty.js:340998 (zsh) and cli_inner_pretty.js:341011 (bash).

**What it does:** Filters the list of function *names* before each function body is re-emitted into the snapshot. It drops names that begin with a single underscore followed by a non-underscore character, while keeping everything else.

**How it works — the regex semantics:**
- `^_` anchors a literal underscore at the start of the name.
- `[^_]` requires the *next* character to be anything **other than** an underscore.
- `grep -vE` inverts the match (`-v`) using extended regex (`-E`), so names that match are *removed* and the rest pass through.

| Function name | Matches `^_[^_]`? | Kept in snapshot? |
|---------------|-------------------|-------------------|
| `_git`, `_ssh`, `_brew` (zsh completion handlers) | Yes (`_` + letter) | No — filtered out |
| `__pyenv_init`, `__zsh_like_cd` (mise/pyenv helpers) | No (`__` = `_` then `_`, second char IS `_`) | Yes — kept |
| `nvm`, `gst`, `mise`, `cd` (ordinary user funcs) | No (no leading `_`) | Yes — kept |

**Why this approach:** The zsh completion subsystem installs *hundreds* of `_command` functions (`_git`, `_docker`, `_kubectl`…), each tens-to-hundreds of lines. Capturing them all balloons the snapshot to multiple MB and contributes nothing to the Bash tool (which never runs interactive completion). The single-underscore prefix is the zsh/bash convention for completion handlers, while the **double-underscore** prefix (`__`) is the de-facto namespace for *runtime* helpers from version managers (mise's `__zsh_like_cd`, pyenv's `__pyenv_init`, rbenv, etc.) that user functions and aliases genuinely depend on. The regex is a one-line heuristic that keeps the second category and discards the first.

**Why direct `typeset -f` for zsh vs the base64 round-trip for bash:** see §2.2 and §2.3.

**Key insight:** The `[^_]` second-character clause is what makes this safe. A naive `grep -v '^_'` would also nuke the `__`-prefixed helpers, breaking mise/pyenv/rbenv shims. The negated-character-class is the whole point: drop `_x`, keep `__x`.

### 2.2 The exit-127 regression saga — CRITICAL

This filter has a scar. Cross-link **changelog_to_code_map.md rows 243, 260, and 414**.

- **v2.1.147 (changelog row 260):** *"Fixed shell snapshot dropping user functions whose names start with a single underscore, which broke aliases referencing them"*. The 2.1.147 build changed this very filter so it *also* dropped single-underscore **user** functions — not just completion handlers. The intent was unclear but the effect was catastrophic: user functions named `_myhelper` were excluded from the snapshot, yet aliases and other functions still *referenced* them. When the Bash tool re-sourced the poisoned snapshot, those references resolved to nothing.
- **The symptom:** Because the snapshot is sourced at the very head of every Bash tool command chain (`source <snapshot> 2>/dev/null || true && …`, see the brief's provider assembly order 341381-341393), a snapshot that fails to define a referenced function poisons the shell environment for the entire `&&`-joined command. For affected users the shell returned **exit code 127** ("command not found") on *every* Bash command.
- **v2.1.148 (changelog row 243):** *"Fixed the Bash tool returning exit code 127 on every command for some users (a regression introduced in 2.1.147)"*. The fix was a **revert**: restore the filter to `grep -vE '^_[^_]'`, which drops only single-underscore completion functions and keeps single-underscore *user* helpers as well as all double-underscore helpers. Changelog row 243 pins the exact anchors `cli_inner_pretty.js:340998 (zsh) / 341011 (bash)` and the generator `oD_` 340986-341044.
- **What 2.1.156 ships:** the **reverted** form. Confirmed by reading cli_inner_pretty.js:340998 and cli_inner_pretty.js:341011 — both are exactly `grep -vE '^_[^_]'`. Changelog row 414 lists this among the "Reverted/transient behaviors … shown in their post-2.1.156-bundle form": *"the 2.1.147 single-underscore shell-snapshot filter (reverted by 2.1.148, bundle shows the reverted `grep -vE '^_[^_]'`)."*

**Why the regression was so severe (design rationale):** The snapshot is a *trust-on-source* artifact. There is no validation step between "generate snapshot" and "source it before every command" — the whole design bets that the captured shell code re-loads cleanly. That bet is what makes the Bash tool fast (no fresh login shell per command), but it also means any filter that produces an *internally inconsistent* snapshot (a referenced symbol that was filtered out) degrades not gracefully but to a total exit-127 brownout. The `|| true` on the `source` line only swallows a `source` *parse* failure; it does not protect against the *sourced* environment being semantically broken.

**Key insight:** `^_[^_]` is not just a size optimization — it is a *correctness contract*. The second `[^_]` clause and the decision to keep single-underscore *user* functions are both load-bearing: removing either re-introduces the exit-127 class of bug.

### 2.3 The bash base64 round-trip (cli_inner_pretty.js:341011-341016)

```javascript
// ============================================
// bashFunctionCapture (inside oD_) - base64-encode each bash function body for safe re-eval
// Location: cli_inner_pretty.js:341011-341016
// ============================================

// ORIGINAL (for source lookup):
declare -F | cut -d' ' -f3 | grep -vE '^_[^_]' | while read func; do
  # Encode the function to base64, preserving all special characters
  encoded_func=$(declare -f "$func" | base64 )
  # Write the function definition to the snapshot
  echo "eval ${bx6}"${bx6}$(echo '$encoded_func' | base64 -d)${bx6}" > /dev/null 2>&1" >> "$SNAPSHOT_FILE"
done

// READABLE (for understanding):
// declare -F lists lines like `declare -f myfunc`; `cut -d' ' -f3` takes the 3rd field (the name).
// For each surviving name:
//   encoded_func = base64( declare -f name )          # capture body, encode to ASCII-safe text
//   append to snapshot the literal line:
//     eval "$(echo '<base64>' | base64 -d)" > /dev/null 2>&1
// bx6 = "\\" (LITERAL_BACKSLASH) is the JS-side escape that emits a real backslash so that the
// generated shell line contains   eval \"...\"   (escaped double-quotes inside the outer echo).

// Mapping: bx6→LITERAL_BACKSLASH; the JS template `eval ${bx6}"${bx6}$(...)${bx6}"` produces the
//          shell text  eval \"$(echo '$encoded_func' | base64 -d)\"
```

**What it does:** For bash, instead of writing the raw `declare -f` body into the snapshot, it base64-encodes the body at generation time and writes a self-decoding `eval` line so that on re-source the body is decoded and `eval`'d.

**How it works (step by step):**
1. `declare -F` prints `declare -f <name>` per function; `cut -d' ' -f3` extracts `<name>`.
2. The `grep -vE '^_[^_]'` filter (§2.1) drops completion handlers.
3. `declare -f "$func"` emits the full function body; piping to `base64` produces an ASCII-safe blob.
4. The `echo "eval … $(echo '$encoded_func' | base64 -d) …"` line — with `${bx6}` (= `"\\"`) injecting escaped double-quotes — writes a snapshot line of the form `eval "$(echo '<b64>' | base64 -d)" > /dev/null 2>&1`.
5. `declare -f > /dev/null 2>&1` first (cli_inner_pretty.js:341007) forces bash to materialize any lazily-resolved functions before listing.

**Why this approach (rationale + alternatives):** bash function bodies routinely contain content that is hostile to naive embedding into a single-quoted/double-quoted snapshot template: embedded single quotes, backslash line-continuations, here-docs, and literal newlines that would terminate an `echo` argument. base64 reduces *any* byte sequence to `[A-Za-z0-9+/=]`, which embeds trivially and survives the heredoc/quote context of the generator. The alternative — escaping every metacharacter inline — is fragile and historically the source of corruption bugs. The `> /dev/null 2>&1` suffix silences re-declaration warnings (e.g. a function that references a now-missing tool).

**Why zsh skips this:** zsh's `typeset -f "$func"` output is *already re-loadable shell source* — it is self-quoting, so the snapshot writes it directly (cli_inner_pretty.js:340999) with no encoding. If zsh's output ever proved unsafe, the obvious mitigation would be to copy the bash base64 round-trip, but to date it has not been needed.

**Key insight:** `bx6 = "\\"` (confirmed at cli_inner_pretty.js:341164) exists solely so the JavaScript template literal can emit a *real* backslash into the generated shell, producing escaped `\"` quotes around the `eval` argument. It is a JS-string-escaping artifact, not a shell concept.

### 2.4 Shell Options capture (cli_inner_pretty.js:341018-341029)

**zsh branch (cli_inner_pretty.js:341019-341022):**
```bash
echo "# Shell Options" >> "$SNAPSHOT_FILE"
setopt | sed 's/^/setopt /' | head -n 1000 >> "$SNAPSHOT_FILE"
```
`setopt` with no args lists currently-enabled options one per line; `sed` re-prefixes each with `setopt ` so the line is re-executable; capped at 1000 lines.

**bash branch (cli_inner_pretty.js:341024-341028):**
```bash
echo "# Shell Options" >> "$SNAPSHOT_FILE"
shopt -p | head -n 1000 >> "$SNAPSHOT_FILE"
set -o | grep "on" | awk '{print "set -o " $1}' | head -n 1000 >> "$SNAPSHOT_FILE"
echo "shopt -s expand_aliases" >> "$SNAPSHOT_FILE"
```

**Why two systems for bash:** bash has *two* independent option systems. `shopt -p` already emits re-executable `shopt -s name`/`shopt -u name` lines. `set -o`, by contrast, prints a two-column table, so the pipeline keeps only the `on` rows (`grep "on"`) and reformats column 1 into `set -o name` (`awk '{print "set -o " $1}'`). zsh unifies both under `setopt`, hence its single line.

**The forced `shopt -s expand_aliases` (cli_inner_pretty.js:341028) — DEEP:** This line is emitted unconditionally for bash regardless of user settings. bash's `expand_aliases` defaults **on** in interactive mode but **off** in non-interactive mode — and the Bash tool always spawns bash non-interactively (`bash -c …`). Without this forced line, every captured user alias in the snapshot would be inert. zsh needs no equivalent because zsh honors aliases in all modes. (This is also why `getSnapshotScript` emits the bare `expand_aliases` line for the bash-without-`.bashrc` edge case noted in §1.)

### 2.5 Alias capture (cli_inner_pretty.js:341031-341040)

```bash
echo "# Aliases" >> "$SNAPSHOT_FILE"
if [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
  alias | grep -v "='winpty " | sed 's/^alias //g' | sed 's/^/alias -- /' | head -n 1000 >> "$SNAPSHOT_FILE"
else
  alias | sed 's/^alias //g' | sed 's/^/alias -- /' | head -n 1000 >> "$SNAPSHOT_FILE"
fi
```

**Two-step `sed` normalization:** `sed 's/^alias //g'` strips the leading `alias ` token that `alias` (no-arg) prints, then `sed 's/^/alias -- /'` re-prepends `alias -- `. The `--` end-of-options separator protects alias names that begin with `-` from being misparsed as flags.

**The winpty filter (`grep -v "='winpty "`) — DEEP:** On Git Bash / MSYS2 / Cygwin (`$OSTYPE` of `msys`/`cygwin`), the shell auto-generates wrapper aliases like `alias node='winpty node.exe'` so console programs get a Win32 TTY in mintty. But the Bash tool allocates **no** TTY, so `winpty` would emit `stdin is not a tty` and fail. The `grep -v "='winpty "` line removes any alias whose value begins with `winpty `, letting commands fall through to the bare `node`/`python`/etc. This branch is gated purely on `$OSTYPE`; the non-Windows branch is identical minus the filter.

**vs v2.1.88 / v2.1.142:** The entire `getUserSnapshotContent` body is byte-identical to v2.1.88 ShellSnapshot.ts:197-263 (same `^_[^_]` filter, same base64 round-trip, same `shopt -s expand_aliases`, same winpty filter, same 1000-line caps) and to the v2.1.142 doc's `Yi_`. Only the obfuscated names changed (`Yi_`→`oD_`, `yv6`→`bx6`). The exit-127 saga is invisible in a diff against 2.1.88/2.1.142 because 2.1.156 ships the *reverted* (i.e. original) filter — the 2.1.147 deviation existed only in the 2.1.147 bundle.

---

## 3. `getClaudeCodeSnapshotContent` (`aD_`) — Tool Shadows + PATH

```javascript
// ============================================
// getClaudeCodeSnapshotContent - PATH discovery + rg/find/grep/bq shadows + PATH heredoc
// Location: cli_inner_pretty.js:341045-341108
// ============================================

// ORIGINAL (for source lookup):
async function aD_(H) {
  let $ = process.env.PATH;
  if (n$() === "windows") {
    let f = await aJ(H, ["-lc", 'echo "$PATH"'], { reject: !1, timeout: VX8 });
    if (f.exitCode === 0 && f.stdout) $ = f.stdout.trim();
  }
  let q = await NV6();
  if (q.length > 0) {
    let f = n$() === "windows" ? q.map(cW) : q;
    $ = [$, ...f].filter(Boolean).join(":");
  }
  let K = lD_(),
    _ = "";
  // ... rg availability check + heredoc/alias (341058-341079) ...
  let z = iD_();        // find/grep shadow, or null on non-native builds
  // ... FIND_GREP_FUNC_END heredoc if z !== null (341081-341088) ...
  let A = rD_();        // 341089: rD_() returns null → BQ heredoc never emits
  // ... BQ_FUNC_END heredoc if A !== null (DEAD) ...
  let Y = `PATH_END_${Math.random().toString(36).substring(2, 18)}`;
  // ... random-delimiter PATH heredoc (341099-341104) ...
  return _;
}

// READABLE (for understanding):
async function getClaudeCodeSnapshotContent(shellPath) {
  let pathValue = process.env.PATH;
  if (getPlatform() === "windows") {                                    // n$()
    const probe = await execa(shellPath, ["-lc", 'echo "$PATH"'], {     // aJ
      reject: false, timeout: SNAPSHOT_CREATION_TIMEOUT });             // VX8 = 1e4
    if (probe.exitCode === 0 && probe.stdout) pathValue = probe.stdout.trim();
  }
  const pluginBinDirs = await getPluginBinPaths();                      // NV6
  if (pluginBinDirs.length > 0) {
    const dirs = getPlatform() === "windows" ? pluginBinDirs.map(toCygwinPath) : pluginBinDirs; // cW
    pathValue = [pathValue, ...dirs].filter(Boolean).join(":");
  }
  const rg = createRipgrepShellIntegration();                          // lD_
  let content = "";
  /* rg availability check + heredoc-or-alias, find/grep shadow (iD_), bq shadow (rD_ → null), PATH heredoc */
  return content;
}

// Mapping: aD_→getClaudeCodeSnapshotContent, H→shellPath, $→pathValue, q→pluginBinDirs,
//          K→rg, _→content, z→findGrepIntegration, A→bqIntegration, Y→pathDelim,
//          n$→getPlatform, aJ→execa, VX8→SNAPSHOT_CREATION_TIMEOUT, NV6→getPluginBinPaths,
//          cW→toCygwinPath, lD_→createRipgrepShellIntegration, iD_→createFindGrepShellIntegration,
//          rD_→createBigQueryShellIntegration, O4→quote
```

### 3.1 PATH discovery (cli_inner_pretty.js:341046-341055)

**Windows PATH probe (cli_inner_pretty.js:341047-341050):**
```javascript
if (n$() === "windows") {
  let f = await aJ(H, ["-lc", 'echo "$PATH"'], { reject: !1, timeout: VX8 });
  if (f.exitCode === 0 && f.stdout) $ = f.stdout.trim();
}
```
**Why:** On Windows, Node's `process.env.PATH` is a Windows-style `C:\foo;D:\bar` semicolon string. Inside bash on Cygwin/MSYS2/Git Bash, PATH must be colon-separated with `/c/foo`-style entries. Rather than translate it in JS, the code asks the user's *own* bash subshell (`shell -lc 'echo "$PATH"'`) for the already-translated string. The `timeout: VX8` (10000 ms, confirmed at the brief's constant table) matches the outer snapshot timeout so a slow login shell cannot deadlock the probe. `reject: !1` (= `reject:false`) means a non-zero exit is tolerated and we fall back to `process.env.PATH`.

**Plugin bin paths (cli_inner_pretty.js:341051-341055):**
```javascript
let q = await NV6();
if (q.length > 0) {
  let f = n$() === "windows" ? q.map(cW) : q;
  $ = [$, ...f].filter(Boolean).join(":");
}
```
`getPluginBinPaths` (`NV6`) returns the `bin/` directories of enabled plugins. On Windows they are converted to Cygwin paths via `toCygwinPath` (`cW`). They are **appended** (`[pathValue, ...dirs]`), not prepended — a conservative default so user-installed system tools win over plugin-shipped equivalents.

### 3.2 rg availability check (cli_inner_pretty.js:341056-341079)

The script first writes a guard into the snapshot (cli_inner_pretty.js:341059-341062):
```bash
echo "if ! (unalias rg 2>/dev/null; command -v rg) >/dev/null 2>&1; then" >> "$SNAPSHOT_FILE"
```
The `(unalias rg …; command -v rg)` runs in a subshell so the `unalias` cannot leak into the parent. Clearing any `alias rg='rg --smart-case'` *before* `command -v rg` exposes whether a real `rg` binary exists (an alias alone would otherwise satisfy `command -v`). If no binary is found, the fallback fires.

Then, depending on `createRipgrepShellIntegration` (`lD_`) returning `type: "function"` (embedded ripgrep via bun argv0) or `type: "alias"` (system ripgrep path):
- **function** (cli_inner_pretty.js:341066-341069): write the multi-line function via a single-quoted heredoc terminated by `RIPGREP_FUNC_END`. The single-quoted delimiter is essential — it prevents the heredoc body from expanding `${CLAUDE_CODE_EXECPATH:-}` and `$@` at *generation* time; they must be preserved for *source* time.
- **alias** (cli_inner_pretty.js:341071-341075): single quotes inside the snippet are escaped with `replaceAll("'", "'\\''")` and the snippet is `echo`'d as a one-line `alias rg=…`.
The block closes with `echo "fi"` (cli_inner_pretty.js:341077-341078).

### 3.3 find/grep shadow + the `-S dfs` arg (cli_inner_pretty.js:341080-341088)

```javascript
let z = iD_();
if (z !== null)
  _ += `
      # Shadow find/grep with embedded bfs/ugrep (ant-native only)
      echo "# Shadow find/grep with embedded bfs/ugrep" >> "$SNAPSHOT_FILE"
      cat >> "$SNAPSHOT_FILE" << 'FIND_GREP_FUNC_END'
${z}
FIND_GREP_FUNC_END
    `;
```
`createFindGrepShellIntegration` (`iD_`, cli_inner_pretty.js:340964-340978) returns `null` on non-native builds (`!RL()`) — in which case the entire `FIND_GREP_FUNC_END` heredoc is skipped — or the combined `unalias find/grep` + bfs/ugrep functions otherwise. The `FIND_GREP_FUNC_END` delimiter is single-quoted to preserve the function bodies verbatim.

**NEW in 2.1.156 — `-S dfs`:** `iD_` builds the find shadow as `xx6("find", "bfs", ["-S", "dfs", "-regextype", "findutils-default"])` (cli_inner_pretty.js:340969). The `-S dfs` arg is **new** versus v2.1.88, where `createArgv0ShellFunction` for find was called with only `["-regextype", "findutils-default"]` (ShellSnapshot.ts:167-170). Per **changelog_to_code_map.md row ~218**, this fixes *"`find` in the Bash tool exhausting the macOS system file/vnode table and crashing the host on large directory trees"*: bfs defaults to breadth-first (`-S bfs`), which holds an open directory FD per pending level and can exhaust the macOS vnode/open-file table on huge trees; `-S dfs` (depth-first) bounds concurrent open directory handles to the path depth. Confirmed absent in both v2.1.88 ShellSnapshot.ts:167-170 and the v2.1.142 find_grep doc.

### 3.4 The dead BigQuery path (cli_inner_pretty.js:341089-341095)

```javascript
let A = rD_();
if (A !== null)
  _ += `
      echo "# Shadow bq to label query jobs with source=claude_code" >> "$SNAPSHOT_FILE"
      cat >> "$SNAPSHOT_FILE" << 'BQ_FUNC_END'
${A}
BQ_FUNC_END
    `;
```
`createBigQueryShellIntegration` (`rD_`) is a hard stub: `function rD_() { return null; }` (cli_inner_pretty.js:340979-340981). Because `A` is always `null`, the `if (A !== null)` guard is never taken and the `BQ_FUNC_END` heredoc never emits. This is forward-compat dead code: the wiring for a future "label BigQuery jobs with `source=claude_code`" feature is in place, but the body returns `null`. **Same status as v2.1.142** (`zi_()` returned null) and **absent entirely from v2.1.88** (ShellSnapshot.ts has no bq path).

### 3.5 The random-delimiter PATH heredoc (cli_inner_pretty.js:341097-341104)

```javascript
// ============================================
// PATH heredoc - write export PATH via a randomized single-quoted heredoc delimiter
// Location: cli_inner_pretty.js:341097-341104
// ============================================

// ORIGINAL (for source lookup):
let Y = `PATH_END_${Math.random().toString(36).substring(2, 18)}`;
return (
  (_ += `

      # Add PATH to the file
      cat >> "$SNAPSHOT_FILE" << '${Y}'
export PATH=${O4([$ || ""])}
${Y}
  `),
  _
);

// READABLE (for understanding):
const pathDelim = `PATH_END_${Math.random().toString(36).substring(2, 18)}`; // e.g. PATH_END_a8x4f9z2k1m0p3q7
content += `
      # Add PATH to the file
      cat >> "$SNAPSHOT_FILE" << '${pathDelim}'
export PATH=${quote([pathValue || ""])}    // O4 single-quotes the value, escaping embedded ' as '\''
${pathDelim}
  `;
return content;

// Mapping: Y→pathDelim, $→pathValue, O4→quote (shell single-quote helper)
```

**What it does:** Appends an `export PATH=<single-quoted value>` line to the snapshot, wrapped in a heredoc whose terminator is `PATH_END_` plus a 16-char base-36 random suffix.

**Why a random delimiter (DEEP):** A heredoc ends when its delimiter appears alone on a line. If PATH contained the literal token `PATH_END` (e.g. a directory `/home/user/PATH_END/bin`), a *fixed* delimiter would truncate the heredoc prematurely and corrupt the snapshot. `Math.random().toString(36).substring(2, 18)` yields ~16 base-36 chars (~36^16 ≈ 8e24 possibilities), making accidental collision negligible. This is practical paranoia, not cryptographic — a collision would require a user to deliberately construct a path containing the exact generated suffix *after* reading the generator. The value itself is single-quoted by `quote` (`O4`), which escapes any embedded single quote as `'\''`, so a pathological PATH segment like `/home/o'connor/bin` survives.

**Why heredoc instead of `echo "export PATH=…"` (vs v2.1.88):** v2.1.88 wrote PATH with a plain `echo "export PATH=${quote([pathValue || ''])}"` (ShellSnapshot.ts:336). 2.1.156 (and v2.1.142) replace this with the randomized heredoc. The heredoc form sidesteps an entire class of quoting hazards: with `echo`, the doubly-nested quoting (JS template → shell `echo` → snapshot file) is fragile for PATH values containing `"`, `$`, backticks, or `'`. The single-quoted heredoc delimiter writes the `export PATH=…` line verbatim with zero shell expansion at generation time. **This is NEW vs v2.1.88** (confirmed: ShellSnapshot.ts:336 uses `echo`, no heredoc, no `PATH_END_` delimiter); the v2.1.142 doc already documents the heredoc form.

---

## 4. v2.1.88 → v2.1.156 Diff Summary

| Aspect | v2.1.88 (ShellSnapshot.ts) | v2.1.156 (`aD_`/`oD_`/`ux6`) | NEW / CHANGED? |
|--------|----------------------------|------------------------------|----------------|
| `getConfigFile` | `.zshrc`/`.bashrc`/`.profile` | Same (cli_inner_pretty.js:340982-340985) | Unchanged (symbol `Sv6`→`ux6`) |
| Function filter | `grep -vE '^_[^_]'` | `grep -vE '^_[^_]'` (cli_inner_pretty.js:340998/341011) | Unchanged form, but survived the 2.1.147→148 revert (§2.2) |
| bash base64 round-trip | Present, uses `LITERAL_BACKSLASH` | Present, uses `bx6 = "\\"` (cli_inner_pretty.js:341011-341016) | Unchanged |
| `shopt -s expand_aliases` force | Present | Present (cli_inner_pretty.js:341028) | Unchanged |
| winpty alias filter | Present | Present (cli_inner_pretty.js:341037) | Unchanged |
| find shadow args | `["-regextype","findutils-default"]` | `["-S","dfs","-regextype","findutils-default"]` (cli_inner_pretty.js:340969) | **NEW** `-S dfs` (vnode-table fix) |
| Plugin bin paths in PATH | Absent | `getPluginBinPaths` appended (cli_inner_pretty.js:341051-341055) | **NEW** (also in 2.1.142) |
| Windows PATH probe | `execa('echo $PATH', {shell:true})` | `aJ(H, ["-lc",'echo "$PATH"'], …)` (cli_inner_pretty.js:341048) | **CHANGED** (explicit shell + login flag) |
| PATH write | `echo "export PATH=…"` (ShellSnapshot.ts:336) | `cat << 'PATH_END_<rand16>'` heredoc (cli_inner_pretty.js:341097-341104) | **NEW** randomized heredoc (also in 2.1.142) |
| bq shadow | Absent | `rD_()` returns null → heredoc dead (cli_inner_pretty.js:340979-340981, 341089-341095) | **NEW** dead stub (also in 2.1.142) |
| `_cc_bin` resolution in argv0 fn | Absent (direct `quotedPath`) | `local _cc_bin="${CLAUDE_CODE_EXECPATH:-}"` + baked fallback (cli_inner_pretty.js:340941-340943) | **CHANGED** (2.1.142 refactor, still present) |

**vs v2.1.142 docs:** `getConfigFile`, `getUserSnapshotContent`, and the bq-null path are functionally identical (the v2.1.142 doc's §4 already noted no change from 2.1.112). The only thing the v2.1.142 doc did *not* surface that 2.1.156 makes explicit is the `-S dfs` find arg (its find_grep doc shows no `-S dfs`) and the exit-127 revert saga (a 2.1.147→2.1.148 event that postdates the 2.1.142 snapshot). The 2.1.156 source confirms `-S dfs` at cli_inner_pretty.js:340969 and the reverted filter at cli_inner_pretty.js:340998/341011.

---

## 5. Why the bash/zsh Asymmetry?

The branching in `getUserSnapshotContent` mirrors real bash/zsh differences rather than arbitrary style:

| Concern | bash answer | zsh answer | Reason |
|---------|-------------|------------|--------|
| List function names | `declare -F \| cut -d' ' -f3` | `typeset +f` | Different builtins; bash's `declare -F` prints `declare -f <name>` |
| Extract function body | `declare -f $name` | `typeset -f $name` | Different builtins |
| Body re-load safety | base64 round-trip | direct (self-quoting) | bash bodies may contain `\` continuations / embedded heredocs; zsh output is re-loadable verbatim |
| Force materialization | `declare -f > /dev/null 2>&1` | `typeset -f > /dev/null 2>&1` | zsh `autoload` needs forcing; bash forces lazy resolution too |
| Alias expansion (non-interactive) | force `shopt -s expand_aliases` | not needed | bash disables it for `bash -c`; zsh always honors aliases |
| Option-set capture | `shopt -p` + `set -o` | `setopt` | two systems vs one |

The asymmetry is deliberate defense: bash gets the heavier base64 machinery because its function-body output is unsafe to embed raw; zsh trusts `typeset -f`. The shared parts (the `^_[^_]` filter, the winpty alias filter, the 1000-line caps) apply to both.

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_156_shell_snapshot.md](../00_overview/symbol_additions_v2_1_156_shell_snapshot.md) — this module's symbol additions

Key functions in this document:
- `getConfigFile` (`ux6`) — shell path → `~/.zshrc`/`~/.bashrc`/`~/.profile` (cli_inner_pretty.js:340982-340985)
- `getUserSnapshotContent` (`oD_`) — functions/options/aliases capture, zsh vs bash branches (cli_inner_pretty.js:340986-341044)
- `getClaudeCodeSnapshotContent` (`aD_`) — PATH discovery + rg/find/grep/bq shadows + PATH heredoc (cli_inner_pretty.js:341045-341108)
- `createArgv0ShellFunction` (`xx6`) — emits cross-shell argv0 dispatch function with `_cc_bin` resolution (cli_inner_pretty.js:340924-340956)
- `createRipgrepShellIntegration` (`lD_`) — rg snippet builder: `{type:"function"|"alias", snippet}` (cli_inner_pretty.js:340957-340962)
- `createFindGrepShellIntegration` (`iD_`) — bfs/ugrep shadow with `-S dfs`, or null (cli_inner_pretty.js:340964-340978)
- `createBigQueryShellIntegration` (`rD_`) — dead stub, returns null (cli_inner_pretty.js:340979-340981)
- `LITERAL_BACKSLASH` (`bx6`) — `"\\"`, used in bash base64 eval line (cli_inner_pretty.js:341164)
- `SNAPSHOT_CREATION_TIMEOUT` (`VX8`) — `1e4` ms, reused by Windows PATH probe (cli_inner_pretty.js:341165)
- `getPluginBinPaths` (`NV6`) — plugin `bin/` dirs appended to PATH (referenced, cli_inner_pretty.js:341051)
- `quote` (`O4`) — shell single-quote helper for PATH value (referenced, cli_inner_pretty.js:341103)
