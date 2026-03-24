# Shell Snapshot: Complete Implementation Reference (Claude Code v2.1.76)

> Deep-dive reverse engineering of the shell snapshot system: how Claude Code captures
> the user's shell environment (functions, aliases, shell options, PATH) into a reusable
> snapshot file, then sources it before every tool-executed command.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations (Shell section)

Key functions in this document:
- `generateSnapshotScript` (Ix9) - Assembles the full snapshot-creation shell script
- `generateShellConfigCapture` (Sx9) - Captures functions, shell options, aliases
- `generateToolInjections` (Cx9) - Injects rg fallback, find/grep shadows, PATH export
- `createSnapshot` (RN8) - Orchestrates snapshot creation: spawn shell, execute script, verify file
- `createBashExecutor` (o54) - Returns the executor object used for every Bash tool invocation
- `getShellConfigPath` (LN8) - Maps shell path to config file (~/.bashrc, ~/.zshrc, ~/.profile)
- `handleExtglob` (mx9) - Disables extended glob to prevent pattern expansion interference
- `getRipgrepFallback` (Lx9) - Generates rg function or alias for the snapshot
- `getFindGrepShadows` (hx9) - Generates find/grep shadow functions using ant-native bfs/ugrep
- `buildArgv0Function` (yN8) - Builds a cross-shell (zsh/bash/Windows) argv0-dispatch function
- `wrapCommand` (I54) - Wraps a command for eval with heredoc/multiline safety
- `shouldAddDevNull` (b54) - Determines if `< /dev/null` stdin redirect is needed
- `replaceNulRedirect` (x54) - Replaces bare `NUL` (Windows) with `/dev/null`
- `wrapCommandWithPipe` (B54) - Wraps a piped command, injecting `< /dev/null` before the first pipe
- `applyShellPrefix` (M91) - Applies CLAUDE_CODE_SHELL_PREFIX wrapper around commands
- `getSessionEnvironment` (F97) - Loads session env scripts from CLAUDE_ENV_FILE and hook files
- `detectShell` (sx9) - Finds a usable bash/zsh shell on the system

---

## 1. Overview

### Why Shell Snapshots Exist

Every time Claude Code executes a Bash tool command, it spawns a **new** shell process. Without snapshotting, each invocation would either:
1. Source the user's `.bashrc`/`.zshrc` from scratch (slow, ~200-500ms per command), or
2. Run in a bare environment missing the user's aliases, functions, PATH additions, and shell options.

The snapshot system solves this by running the user's shell config **once** at session start, capturing the resulting environment into a static `.sh` file, then sourcing that lightweight file before each command. This gives sub-millisecond environment restoration while preserving the user's customizations.

### High-Level Flow

```
Session start
  --> detectShell() finds bash/zsh
  --> createBashExecutor() starts snapshot creation in background
  --> createSnapshot():
       1. Determine config file (.bashrc/.zshrc)
       2. Generate snapshot script (source config, capture state)
       3. Execute script in login shell with 10s timeout
       4. Verify snapshot file was created
       5. Register cleanup on process exit
  --> Snapshot file ready at ~/.claude/shell-snapshots/snapshot-{shell}-{ts}-{rand}.sh

Each Bash tool call:
  --> buildExecCommand():
       1. source snapshot.sh
       2. eval session-env hooks
       3. disable extglob
       4. eval <user-command>
       5. pwd -P >| cwdFile
  --> getSpawnArgs(): shell -c <command>  (no -l flag when snapshot exists)
```

---

## 2. Snapshot Script Generation

### 2.1 Master Script Assembly (Ix9 / generateSnapshotScript)

The `Ix9` function assembles the complete shell script that, when executed, produces the snapshot file. It orchestrates three components: config sourcing, environment capture (`Sx9`), and tool injections (`Cx9`).

```javascript
// ============================================
// generateSnapshotScript - Assemble full snapshot creation script
// Location: chunks.89.mjs:1145-1172
// ============================================

// ORIGINAL (obfuscated):
async function Ix9(A, q, K) {
    let Y = LN8(A),
        z = Y.endsWith(".zshrc"),
        _ = K ? Sx9(Y) : !z ? 'echo "shopt -s expand_aliases" >> "$SNAPSHOT_FILE"' : "",
        w = await Cx9();
    return `SNAPSHOT_FILE=${j4([q])}
      ${K?`source "${Y}" < /dev/null`:"# No user config file to source"}

      # First, create/clear the snapshot file
      echo "# Snapshot file" >| "$SNAPSHOT_FILE"

      # When this file is sourced, we first unalias to avoid conflicts
      # This is necessary because aliases get "frozen" inside function definitions at definition time,
      # which can cause unexpected behavior when functions use commands that conflict with aliases
      echo "# Unset all aliases to avoid conflicts with functions" >> "$SNAPSHOT_FILE"
      echo "unalias -a 2>/dev/null || true" >> "$SNAPSHOT_FILE"

      ${_}

      ${w}

      # Exit silently on success, only report errors
      if [ ! -f "$SNAPSHOT_FILE" ]; then
        echo "Error: Snapshot file was not created at $SNAPSHOT_FILE" >&2
        exit 1
      fi
    `
}

// READABLE (deobfuscated):
async function generateSnapshotScript(shellPath, snapshotFilePath, configFileExists) {
    let configPath = getShellConfigPath(shellPath);          // LN8
    let isZsh = configPath.endsWith(".zshrc");
    let envCapture = configFileExists
        ? generateShellConfigCapture(configPath)             // Sx9
        : (!isZsh ? 'echo "shopt -s expand_aliases" >> "$SNAPSHOT_FILE"' : "");
    let toolInjections = await generateToolInjections();     // Cx9

    return `SNAPSHOT_FILE=${shellQuote([snapshotFilePath])}
      ${configFileExists
          ? `source "${configPath}" < /dev/null`
          : "# No user config file to source"}

      echo "# Snapshot file" >| "$SNAPSHOT_FILE"
      echo "# Unset all aliases to avoid conflicts with functions" >> "$SNAPSHOT_FILE"
      echo "unalias -a 2>/dev/null || true" >> "$SNAPSHOT_FILE"

      ${envCapture}
      ${toolInjections}

      if [ ! -f "$SNAPSHOT_FILE" ]; then
        echo "Error: Snapshot file was not created at $SNAPSHOT_FILE" >&2
        exit 1
      fi
    `;
}
```

**Parameters:**
- `A` / `shellPath` - Absolute path to the shell binary (e.g. `/bin/bash`, `/usr/bin/zsh`)
- `q` / `snapshotFilePath` - Target path for the snapshot file
- `K` / `configFileExists` - Boolean: whether the user's config file exists on disk

**Key design decisions:**
1. The config file is sourced with `< /dev/null` to prevent it from reading stdin (which would hang).
2. The snapshot file is created with `>|` (clobber) to overwrite any existing file.
3. The `unalias -a` line is written first into the snapshot so that when the snapshot is later sourced, aliases don't interfere with function definitions that were "frozen" at definition time.
4. When the config file does not exist, bash still gets `shopt -s expand_aliases` (aliases are disabled by default in non-interactive bash).

### 2.2 Config File Detection (LN8 / getShellConfigPath)

```javascript
// ORIGINAL:
function LN8(A) {
    let q = A.includes("zsh") ? ".zshrc" : A.includes("bash") ? ".bashrc" : ".profile";
    return EN8(OP1.homedir(), q)
}

// READABLE:
function getShellConfigPath(shellPath) {
    let configName = shellPath.includes("zsh")  ? ".zshrc"
                   : shellPath.includes("bash") ? ".bashrc"
                   : ".profile";
    return path.join(os.homedir(), configName);
}
```

Simple string matching on the shell path. Falls back to `.profile` for unknown shells (e.g. `/bin/sh`).

### 2.3 Environment Capture (Sx9 / generateShellConfigCapture)

This function produces shell script fragments that capture four categories of shell state: functions, shell options, aliases. The output differs between bash and zsh.

```javascript
// ============================================
// generateShellConfigCapture - Capture functions, options, aliases
// Location: chunks.89.mjs:1048-1099
// ============================================

// ORIGINAL (obfuscated):
function Sx9(A) {
    let q = A.endsWith(".zshrc"),
        K = "";
    // ... (see sections below)
    return K
}
```

#### 2.3.1 Function Capture

**For zsh:**
```bash
echo "# Functions" >> "$SNAPSHOT_FILE"

# Force autoload all functions first
typeset -f > /dev/null 2>&1

# Now get user function names - filter completion functions (single underscore prefix)
# but keep double-underscore helpers (e.g. __zsh_like_cd from mise, __pyenv_init)
typeset +f | grep -vE '^_[^_]' | while read func; do
  typeset -f "$func" >> "$SNAPSHOT_FILE"
done
```

Zsh uses `typeset +f` to list function names, then `typeset -f "$func"` to output each function's full definition. The definitions are written directly to the snapshot file as plain shell code.

**For bash:**
```bash
echo "# Functions" >> "$SNAPSHOT_FILE"

# Force autoload all functions first
declare -f > /dev/null 2>&1

# Now get user function names - filter completion functions (single underscore prefix)
# but keep double-underscore helpers (e.g. __zsh_like_cd from mise, __pyenv_init)
declare -F | cut -d' ' -f3 | grep -vE '^_[^_]' | while read func; do
  # Encode the function to base64, preserving all special characters
  encoded_func=$(declare -f "$func" | base64 )
  # Write the function definition to the snapshot
  echo "eval \"$(echo '$encoded_func' | base64 -d)\" > /dev/null 2>&1" >> "$SNAPSHOT_FILE"
done
```

Bash uses a **base64 encoding round-trip** to handle special characters in function bodies. The `declare -f` output is piped through `base64`, and the snapshot file contains an `eval` that decodes and evaluates the function definition at source time. The `> /dev/null 2>&1` suppresses any errors from functions that fail to re-declare (e.g., due to missing dependencies).

Note: In the obfuscated source, `kN8` is the backslash escape constant:
```javascript
// @from(Ln 231384, Col 4)
kN8 = "\\"
```
So the template `echo "eval ${kN8}"${kN8}$(echo '$encoded_func' | base64 -d)${kN8}" > /dev/null 2>&1"` produces:
```bash
echo "eval \"$(echo '$encoded_func' | base64 -d)\" > /dev/null 2>&1"
```

**Function filtering pattern: `grep -vE '^_[^_]'`**

This regex filters OUT functions whose names start with a single underscore followed by a non-underscore character. This targets shell completion functions (like `_git`, `_ssh`, `_brew`) which are typically large, numerous, and unnecessary for Claude Code's purposes. However, functions starting with double underscores (like `__zsh_like_cd` from mise, `__pyenv_init` from pyenv, `__git_ps1`) are **kept**, as these are often runtime helpers that affect tool behavior.

| Pattern | Matches | Kept? |
|---------|---------|-------|
| `_git` | `^_[^_]` | No (filtered) |
| `_ssh_hosts` | `^_[^_]` | No (filtered) |
| `__pyenv_init` | Does NOT match `^_[^_]` | Yes (kept) |
| `__zsh_like_cd` | Does NOT match `^_[^_]` | Yes (kept) |
| `nvm` | Does NOT match | Yes (kept) |
| `my_func` | Does NOT match | Yes (kept) |

#### 2.3.2 Shell Options Capture

**For zsh:**
```bash
echo "# Shell Options" >> "$SNAPSHOT_FILE"
setopt | sed 's/^/setopt /' | head -n 1000 >> "$SNAPSHOT_FILE"
```

Zsh's `setopt` (with no arguments) lists all enabled options. The `sed` prefix turns each line into a `setopt <option>` command. Capped at 1000 lines as a safety limit.

**For bash:**
```bash
echo "# Shell Options" >> "$SNAPSHOT_FILE"
shopt -p | head -n 1000 >> "$SNAPSHOT_FILE"
set -o | grep "on" | awk '{print "set -o " $1}' | head -n 1000 >> "$SNAPSHOT_FILE"
echo "shopt -s expand_aliases" >> "$SNAPSHOT_FILE"
```

Bash captures two categories of options:
1. `shopt -p` outputs all shopt settings in re-executable form (e.g., `shopt -s cdspell`, `shopt -u dotglob`).
2. `set -o` outputs POSIX options; only those currently "on" are captured as `set -o <name>`.
3. `expand_aliases` is explicitly forced on, because bash disables it in non-interactive mode by default.

#### 2.3.3 Alias Capture

```bash
echo "# Aliases" >> "$SNAPSHOT_FILE"
# Filter out winpty aliases on Windows to avoid "stdin is not a tty" errors
# Git Bash automatically creates aliases like "alias node='winpty node.exe'" for
# programs that need Win32 Console in mintty, but winpty fails when there's no TTY
if [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
  alias | grep -v "='winpty " | sed 's/^alias //g' | sed 's/^/alias -- /' | head -n 1000 >> "$SNAPSHOT_FILE"
else
  alias | sed 's/^alias //g' | sed 's/^/alias -- /' | head -n 1000 >> "$SNAPSHOT_FILE"
fi
```

The `alias` command output is normalized: the `alias ` prefix is stripped, then re-added as `alias -- ` (the `--` prevents alias names starting with `-` from being interpreted as flags). On Windows (MSYS/Cygwin), winpty-wrapped aliases are filtered out because they require a TTY that Claude Code's spawned processes don't have.

---

## 3. Tool Injections (Cx9 / generateToolInjections)

After the user's environment is captured, `Cx9` adds Claude Code's own tool overrides into the snapshot file. These ensure that `rg`, `find`, and `grep` are available with the correct behavior.

```javascript
// ============================================
// generateToolInjections - Add rg, find/grep, PATH to snapshot
// Location: chunks.89.mjs:1101-1143
// ============================================

// ORIGINAL (obfuscated):
async function Cx9() {
    let A = process.env.PATH;
    if (y8() === "windows") {
        let z = await q9("echo $PATH", { shell: !0, reject: !1 });
        if (z.exitCode === 0 && z.stdout) A = z.stdout.trim()
    }
    let q = Lx9(),        // getRipgrepFallback
        K = "";
    // ... rg injection ...
    let Y = hx9();         // getFindGrepShadows
    // ... find/grep injection ...
    // ... PATH export ...
    return K
}
```

### 3.1 Ripgrep (rg) Fallback

The ripgrep injection is conditional: it only activates if `rg` is not already available on the system.

```bash
# Check for rg availability
echo "# Check for rg availability" >> "$SNAPSHOT_FILE"
echo "if ! (unalias rg 2>/dev/null; command -v rg) >/dev/null 2>&1; then" >> "$SNAPSHOT_FILE"
```

The check first removes any `rg` alias, then uses `command -v rg` to detect the binary. If not found, Claude Code injects either a **function** or an **alias** depending on whether argv0 dispatch is available.

**Function form** (when argv0 dispatch is available, via `Lx9` / `getRipgrepFallback`):

```javascript
// ORIGINAL:
function Lx9() {
    let A = p$6();    // getRgInfo()
    if (A.argv0) return {
        type: "function",
        snippet: yN8("rg", A.argv0, A.rgPath)
    };
    let q = j4([A.rgPath]),
        K = A.rgArgs.map((z) => j4([z]));
    return {
        type: "alias",
        snippet: A.rgArgs.length > 0 ? `${q} ${K.join(" ")}` : q
    }
}
```

The `yN8` / `buildArgv0Function` constructs a cross-platform function that uses `exec -a` (bash) or `ARGV0=` (zsh) to set argv[0]:

```javascript
// ORIGINAL:
function yN8(A, q, K, Y = []) {
    let z = j4([K]),
        _ = Y.length > 0 ? `${Y.join(" ")} "$@"` : '"$@"';
    return [`function ${A} {`,
        "  if [[ -n $ZSH_VERSION ]]; then",
        `    ARGV0=${q} ${z} ${_}`,
        '  elif [[ "$OSTYPE" == "msys" ]] || ...',
        `    ARGV0=${q} ${z} ${_}`,
        "  elif [[ $BASHPID != $$ ]]; then",
        `    exec -a ${q} ${z} ${_}`,
        "  else",
        `    (exec -a ${q} ${z} ${_})`,
        "  fi",
        "}"].join("\n")
}

// READABLE:
function buildArgv0Function(funcName, argv0Name, binaryPath, extraArgs = []) {
    // Produces a shell function that dispatches via argv0 on all platforms:
    //   - zsh: ARGV0=name binary args "$@"
    //   - Windows (msys/cygwin): ARGV0=name binary args "$@"
    //   - bash subshell: exec -a name binary args "$@"
    //   - bash main shell: (exec -a name binary args "$@") in subshell
}
```

The bash main-shell case wraps in a subshell `(exec -a ...)` because `exec` in the main shell would replace the shell process entirely.

### 3.2 find/grep Shadow Functions (ant-native)

When ant-native is available (`n$()` returns truthy), `hx9` / `getFindGrepShadows` generates shadow functions for `find` and `grep` that redirect to `bfs` and `ugrep`:

```javascript
// ORIGINAL:
function hx9() {
    if (!n$()) return null;
    let A = C14();  // ant-native binary path
    return [
        "unalias find 2>/dev/null || true",
        "unalias grep 2>/dev/null || true",
        yN8("find", "bfs", A, ["-regextype", "findutils-default"]),
        yN8("grep", "ugrep", A, ["-G", "--ignore-files", "--hidden", "-I",
            ...Rx9.map((q) => `--exclude-dir=${q}`)])
    ].join("\n")
}
```

Where `Rx9` is the VCS directory exclusion list:
```javascript
Rx9 = [".git", ".svn", ".hg", ".bzr"]
```

So the `grep` shadow function calls `ugrep` with flags: `-G` (basic regex), `--ignore-files`, `--hidden`, `-I` (skip binary files), and excludes `.git`, `.svn`, `.hg`, `.bzr` directories.

The find shadow calls `bfs` with `-regextype findutils-default` for GNU find compatibility.

### 3.3 PATH Export

```bash
# Add PATH to the file
echo "export PATH=<quoted-current-PATH>" >> "$SNAPSHOT_FILE"
```

The PATH from the Node.js process is exported into the snapshot. On Windows, the PATH is fetched from a bash subshell (`echo $PATH`) since the Node.js `process.env.PATH` uses Windows-style separators.

---

## 4. Snapshot Creation Flow (RN8 / createSnapshot)

The `RN8` function orchestrates the entire snapshot creation process.

```javascript
// ============================================
// createSnapshot - Execute snapshot script, verify result
// Location: chunks.89.mjs:1180-1253
// ============================================

// ORIGINAL (obfuscated):
RN8 = async (A) => {
    let q = A.includes("zsh") ? "zsh" : A.includes("bash") ? "bash" : "sh";
    return k(`Creating shell snapshot for ${q} (${A})`), new Promise(async (K) => {
        try {
            let Y = LN8(A);                          // Config file path
            let z = await uK(Y);                      // Check if config exists
            if (!z) k(`Shell config file not found: ${Y}, ...`);

            let _ = Date.now(),
                w = Math.random().toString(36).substring(2, 8),
                O = EN8(c8(), "shell-snapshots");     // ~/.claude/shell-snapshots/

            let $ = EN8(O, `snapshot-${q}-${_}-${w}.sh`);
            await kx9(O, { recursive: !0 });          // mkdir -p

            let H = await Ix9(A, $, z);               // Generate script

            yx9(A, ["-c", "-l", H], {
                env: {
                    ...process.env.CLAUDE_CODE_DONT_INHERIT_ENV ? {} : process.env,
                    SHELL: A,
                    GIT_EDITOR: "true",
                    CLAUDECODE: "1"
                },
                timeout: p54,          // 10000 ms (1e4)
                maxBuffer: 1048576,    // 1 MB
                encoding: "utf8"
            }, async (j, J, M) => {
                if (j) {
                    // Error handling with detailed logging
                    d("tengu_shell_snapshot_failed", { ... });
                    K(void 0)          // Resolve with undefined (no snapshot)
                } else {
                    let D;
                    try { D = (await Ex9($)).size } catch {}
                    if (D !== void 0) {
                        // Success: register cleanup, resolve with path
                        E4(async () => {
                            try { await $1().unlink($) } catch {}
                        });
                        K($)
                    } else {
                        // File missing after "successful" execution
                        d("tengu_shell_unknown_error", {});
                        K(void 0)
                    }
                }
            })
        } catch (Y) {
            d("tengu_shell_snapshot_error", {});
            K(void 0)
        }
    })
}
```

### Step-by-step breakdown:

| Step | Action | Detail |
|------|--------|--------|
| 1 | Shell type detection | String check: `"zsh"`, `"bash"`, or `"sh"` |
| 2 | Config file lookup | `LN8(shellPath)` --> `~/.bashrc`, `~/.zshrc`, or `~/.profile` |
| 3 | Config file existence check | `uK(configPath)` async stat check |
| 4 | Snapshot directory | `~/.claude/shell-snapshots/` created recursively |
| 5 | File naming | `snapshot-{shell}-{timestamp}-{random6}.sh` |
| 6 | Script generation | `Ix9(shellPath, snapshotPath, configExists)` |
| 7 | Execution | `child_process.execFile(shell, ["-c", "-l", script], options, callback)` |
| 8 | Verification | `stat(snapshotPath).size` -- must be > 0 |
| 9 | Cleanup registration | `E4(onExit)` registers an async cleanup that deletes the snapshot file when the process exits |

### Key constants:

```javascript
p54 = 1e4          // 10,000 ms = 10 second timeout
// maxBuffer: 1048576  = 1 MB (1024 * 1024)
```

### Environment variables set during snapshot creation:

| Variable | Value | Purpose |
|----------|-------|---------|
| `SHELL` | Shell path | Ensures child shell knows its own identity |
| `GIT_EDITOR` | `"true"` | Prevents git from opening an editor (which would hang) |
| `CLAUDECODE` | `"1"` | Allows user configs to detect Claude Code and skip interactive-only setup |
| `CLAUDE_CODE_DONT_INHERIT_ENV` | (checked) | If set, starts with empty env instead of inheriting `process.env` |

### Failure handling:

The snapshot system is **gracefully degradable**. If snapshot creation fails for any reason:
1. The Promise resolves with `undefined` (never rejects).
2. Telemetry events are emitted: `tengu_shell_snapshot_failed` (with error details like stderr length, error signal, killed flag) or `tengu_shell_snapshot_error` (for unexpected exceptions).
3. The executor falls back to running commands in a login shell without a snapshot.

---

## 5. Shell Executor Construction (o54 / createBashExecutor)

The `o54` function returns an executor object with four methods used by the command execution pipeline.

```javascript
// ============================================
// createBashExecutor - Build executor with snapshot support
// Location: chunks.89.mjs:1309-1374
// ============================================

// ORIGINAL (obfuscated):
async function o54(A, q) {
    let K, Y = q?.skipSnapshot
        ? Promise.resolve(void 0)
        : RN8(A).catch((_) => { k(`Failed to create shell snapshot: ${_}`); return }),
        z;
    return {
        type: "bash",
        shellPath: A,
        detached: !0,
        async buildExecCommand(_, w) { /* ... */ },
        getSpawnArgs(_) { /* ... */ },
        async getEnvironmentOverrides(_) { /* ... */ }
    }
}
```

**Parameters:**
- `A` / `shellPath` - Path to the shell binary
- `q` / `options` - Optional `{ skipSnapshot: boolean }`

The snapshot creation (`RN8`) is kicked off immediately and stored as a Promise. This means snapshot creation happens **in parallel** with any other initialization. The `buildExecCommand` method awaits this Promise on first call.

### 5.1 Snapshot Recreation

If the snapshot file is missing when `buildExecCommand` is called (e.g., deleted by another process), it is recreated:

```javascript
async buildExecCommand(_, w) {
    let O = await Y;    // Await the snapshot promise
    if (O) try {
        await bx9(O)    // stat/access check
    } catch {
        k(`Snapshot file missing, recreating: ${O}`);
        Y = RN8(A).catch((v) => {
            k(`Failed to recreate shell snapshot: ${v}`); return
        });
        O = await Y
    }
    z = O;               // Store for getSpawnArgs to check
    // ...
}
```

---

## 6. Snapshot Sourcing During Command Execution

### 6.1 buildExecCommand - Command Assembly

When a Bash tool command is executed, `buildExecCommand` assembles the full command string:

```javascript
// READABLE (deobfuscated):
async buildExecCommand(userCommand, options) {
    let snapshotPath = await snapshotPromise;
    // ... recreation logic ...
    cachedSnapshot = snapshotPath;
    sandboxTmpDir = options.sandboxTmpDir;

    let tmpDir = getTmpDir();                                     // ux9()
    let cwdFilePath = options.useSandbox
        ? path.join(options.sandboxTmpDir, `cwd-${options.id}`)
        : path.join(tmpDir, `claude-${options.id}-cwd`);

    let sanitized = replaceNulRedirect(userCommand);              // x54
    let shouldAddNull = shouldAddDevNull(sanitized);              // b54
    let wrapped = wrapCommand(sanitized, shouldAddNull);          // I54

    // For non-sandbox piped commands, use special pipe wrapping
    if (!options.useSandbox && sanitized.includes("|") && shouldAddNull)
        wrapped = wrapCommandWithPipe(sanitized);                 // B54

    let parts = [];
    if (snapshotPath) {
        parts.push(`source ${shellQuote([snapshotPath])}`)
    }

    let sessionEnv = await getSessionEnvironment();               // F97
    if (sessionEnv) parts.push(sessionEnv);

    let extglobDisable = handleExtglob(shellPath);                // mx9
    if (extglobDisable) parts.push(extglobDisable);

    parts.push(`eval ${wrapped}`);
    parts.push(`pwd -P >| ${cwdFilePath}`);

    let commandString = parts.join(" && ");

    if (process.env.CLAUDE_CODE_SHELL_PREFIX)
        commandString = applyShellPrefix(
            process.env.CLAUDE_CODE_SHELL_PREFIX, commandString   // M91
        );

    return { commandString, cwdFilePath };
}
```

The final command string looks like:
```bash
source '/path/to/snapshot.sh' && <session-env> && shopt -u extglob 2>/dev/null || true && eval '<user-command>' && pwd -P >| /tmp/claude-xxxx-cwd
```

### 6.2 getSpawnArgs - Login Shell Bypass

```javascript
getSpawnArgs(commandString) {
    let hasSnapshot = cachedSnapshot !== void 0;
    if (hasSnapshot) k("Spawning shell without login (-l flag skipped)");
    return ["-c", ...hasSnapshot ? [] : ["-l"], commandString]
}

// With snapshot:    shell -c "source snapshot && ... && eval cmd && pwd"
// Without snapshot: shell -c -l "eval cmd && pwd"
```

This is a critical optimization: when the snapshot is available, the `-l` (login) flag is **skipped**. The snapshot already contains everything from the login shell initialization, so re-running it would be redundant and slow.

### 6.3 getEnvironmentOverrides

```javascript
async getEnvironmentOverrides(userCommand) {
    let hasTmux = userCommand.includes("tmux");
    let tmuxInfo = getTmuxInfo();       // n54() -> "cols,rows,0" or null
    let overrides = {};

    if (tmuxInfo) overrides.TMUX = tmuxInfo;

    if (sandboxTmpDir) {
        let dir = sandboxTmpDir;
        overrides.TMPDIR = dir;
        overrides.CLAUDE_CODE_TMPDIR = dir;
        overrides.TMPPREFIX = path.join(dir, "zsh");   // zsh-specific tmp prefix
    }

    // Merge in dynamic environment variables from d54()
    for (let [key, value] of getEnvOverrides()) {
        overrides[key] = value;
    }

    return overrides;
}
```

---

## 7. Extglob Handling (mx9 / handleExtglob)

Extended glob patterns (like `!(pattern)`, `@(a|b)`) in bash and zsh can interfere with shell commands that Claude Code generates. The `mx9` function disables them:

```javascript
// ORIGINAL:
function mx9(A) {
    if (process.env.CLAUDE_CODE_SHELL_PREFIX)
        return "{ shopt -u extglob || setopt NO_EXTENDED_GLOB; } >/dev/null 2>&1 || true";
    if (A.includes("bash"))
        return "shopt -u extglob 2>/dev/null || true";
    else if (A.includes("zsh"))
        return "setopt NO_EXTENDED_GLOB 2>/dev/null || true";
    return null
}

// READABLE:
function handleExtglob(shellPath) {
    if (process.env.CLAUDE_CODE_SHELL_PREFIX)
        // Unknown shell behind prefix -- try both bash and zsh disable
        return "{ shopt -u extglob || setopt NO_EXTENDED_GLOB; } >/dev/null 2>&1 || true";
    if (shellPath.includes("bash"))
        return "shopt -u extglob 2>/dev/null || true";
    else if (shellPath.includes("zsh"))
        return "setopt NO_EXTENDED_GLOB 2>/dev/null || true";
    return null;
}
```

The `CLAUDE_CODE_SHELL_PREFIX` case is interesting: when a prefix command wraps execution (e.g., for containerized shells), the actual shell type is unknown, so both bash and zsh disable commands are tried. The `{ ... }` grouping with `||` ensures at least one succeeds without error.

---

## 8. Command Wrapping (x54, b54, I54, B54)

These four functions handle the transformation from raw user command to a safe eval-able string.

### 8.1 replaceNulRedirect (x54)

```javascript
// ORIGINAL:
function x54(A) {
    return A.replace(Gx9, "$1/dev/null")
}
// Where:
Gx9 = /(\d?&?>+\s*)[Nn][Uu][Ll](?=\s|$|[|&;)\n])/g

// READABLE:
function replaceNulRedirect(command) {
    // Replace Windows "NUL" redirect target with Unix "/dev/null"
    // e.g., "2>NUL" -> "2>/dev/null", ">nul" -> ">/dev/null"
    return command.replace(
        /(\d?&?>+\s*)[Nn][Uu][Ll](?=\s|$|[|&;)\n])/g,
        "$1/dev/null"
    );
}
```

### 8.2 shouldAddDevNull (b54)

```javascript
// ORIGINAL:
function b54(A) {
    if (NN8(A)) return !1;    // Has heredoc -- don't redirect stdin
    if (Zx9(A)) return !1;    // Has explicit stdin redirect (<)
    return !0
}
```

Returns `false` if the command contains a heredoc (`<<EOF`) or an explicit stdin redirect (`< file`). Otherwise returns `true`, meaning `< /dev/null` should be added to prevent the command from reading stdin (which would hang).

### 8.3 wrapCommand (I54)

```javascript
// ORIGINAL:
function I54(A, q = !0) {
    if (NN8(A) || Wx9(A)) {
        // Heredoc or multiline-quoted string: wrap in single quotes
        let Y = `'${A.replace(/'/g,`'"'"'`)}'`;
        if (NN8(A)) return Y;                   // Heredocs: no stdin redirect
        return q ? `${Y} < /dev/null` : Y
    }
    if (q) return j4([A, "<", "/dev/null"]);     // shellQuote with < /dev/null
    return j4([A])                               // shellQuote only
}

// READABLE:
function wrapCommand(command, addDevNull = true) {
    if (hasHeredoc(command) || hasMultilineQuotes(command)) {
        // Must use manual single-quoting for heredocs/multiline strings
        let quoted = "'" + command.replace(/'/g, "'\"'\"'") + "'";
        if (hasHeredoc(command)) return quoted;  // Heredoc provides its own stdin
        return addDevNull ? `${quoted} < /dev/null` : quoted;
    }
    if (addDevNull) return shellQuote([command, "<", "/dev/null"]);
    return shellQuote([command]);
}
```

### 8.4 wrapCommandWithPipe (B54)

For piped commands, `< /dev/null` must be inserted *before* the first pipe, not at the end. This function tokenizes the command, finds the first `|`, and inserts `< /dev/null` at that point:

```javascript
// ORIGINAL:
function B54(A) {
    if (A.includes("`")) return jW6(A);          // Backtick: fallback to simple wrap
    if (A.includes("$(")) return jW6(A);         // Command sub: fallback
    if (Nx9(A)) return jW6(A);                   // Control flow: fallback
    let q = Vx9(A);                              // Strip line continuations
    if (q.includes("\n")) return jW6(A);         // Still multiline: fallback
    let K = Fz(q);                               // Tokenize
    if (!K.success) return jW6(A);               // Parse failure: fallback
    let Y = K.tokens,
        z = fx9(Y);                              // Find first pipe index
    if (z <= 0) return jW6(A);                   // No pipe: fallback
    // Insert "< /dev/null" before the pipe token
    let _ = [...m54(Y, 0, z), "< /dev/null", ...m54(Y, z, Y.length)];
    return g54(_.join(" "))                       // Single-quote the result
}

// Where jW6 is the simple fallback:
function jW6(A) {
    return g54(A) + " < /dev/null"
}
// And g54 is single-quote escaping:
function g54(A) {
    return "'" + A.replace(/'/g, `'"'"'`) + "'"
}
```

---

## 9. Shell Detection (sx9 / detectShell)

```javascript
// ORIGINAL (abridged):
async function sx9() {
    // 1. Check CLAUDE_CODE_SHELL env override
    let A = process.env.CLAUDE_CODE_SHELL;
    if (A && (A.includes("bash") || A.includes("zsh")) && CN8(A))
        return A;

    // 2. Detect from SHELL env + which
    let q = process.env.SHELL;
    let prefersBash = q?.includes("bash");
    let [zshPath, bashPath] = await Promise.all([which("zsh"), which("bash")]);

    // 3. Build candidate list: known paths + which results
    let knownDirs = ["/bin", "/usr/bin", "/usr/local/bin", "/opt/homebrew/bin"];
    let candidates = (prefersBash ? ["bash", "zsh"] : ["zsh", "bash"])
        .flatMap((shell) => knownDirs.map((dir) => `${dir}/${shell}`));

    // 4. Prepend SHELL and which results based on preference
    // 5. Find first executable candidate via CN8 (access + --version check)
    let found = candidates.find((path) => path && CN8(path));
    if (!found) throw Error("No suitable shell found...");
    return found;
}
```

Priority order: `CLAUDE_CODE_SHELL` env > `$SHELL` env > `which` results > hardcoded paths. The system prefers zsh over bash (unless `$SHELL` is bash), and validates each candidate with both `access(X_OK)` and a `--version` timeout check.

---

## 10. Session Environment (F97 / getSessionEnvironment)

Located in `chunks.42.mjs:612-651`, this function loads additional shell setup scripts that are evaluated **after** the snapshot is sourced but **before** the user's command:

```javascript
// READABLE (deobfuscated):
async function getSessionEnvironment() {
    if (isWindows()) return null;
    if (cachedSessionEnv !== undefined) return cachedSessionEnv;

    let scripts = [];

    // 1. Load from CLAUDE_ENV_FILE if set
    let envFile = process.env.CLAUDE_ENV_FILE;
    if (envFile) {
        let content = (await readFile(envFile, "utf8")).trim();
        if (content) scripts.push(content);
    }

    // 2. Load from session hook files
    //    ~/.claude/session-env/{sessionId}/setup-hook-{n}.sh
    //    ~/.claude/session-env/{sessionId}/sessionstart-hook-{n}.sh
    let hookDir = await getSessionEnvDir();
    let hookFiles = (await readdir(hookDir))
        .filter(f => f.match(/^(setup|sessionstart)-hook-\d+\.sh$/))
        .sort(/* setup before sessionstart, then by number */);
    for (let file of hookFiles) {
        let content = (await readFile(path.join(hookDir, file), "utf8")).trim();
        if (content) scripts.push(content);
    }

    cachedSessionEnv = scripts.length > 0 ? scripts.join("\n") : null;
    return cachedSessionEnv;
}
```

This supports hooks that inject environment setup (e.g., activating a virtualenv, setting API keys) into every command execution without modifying the snapshot itself.

---

## 11. Shell Prefix (M91 / applyShellPrefix)

When `CLAUDE_CODE_SHELL_PREFIX` is set, the entire command string is wrapped:

```javascript
// ORIGINAL:
function M91(A, q) {
    let K = A.lastIndexOf(" -");
    if (K > 0) {
        let Y = A.substring(0, K),
            z = A.substring(K + 1);
        return `${j4([Y])} ${z} ${j4([q])}`
    } else return `${j4([A])} ${j4([q])}`
}

// READABLE:
function applyShellPrefix(prefix, commandString) {
    // If prefix contains flags (e.g., "docker exec -i container -c"),
    // split at the last flag to place the command after it
    let lastFlagIndex = prefix.lastIndexOf(" -");
    if (lastFlagIndex > 0) {
        let base = prefix.substring(0, lastFlagIndex);
        let flag = prefix.substring(lastFlagIndex + 1);
        return `${shellQuote([base])} ${flag} ${shellQuote([commandString])}`;
    }
    return `${shellQuote([prefix])} ${shellQuote([commandString])}`;
}
```

This allows running commands inside containers, SSH sessions, or other wrapper environments. The flag-splitting logic handles cases like `CLAUDE_CODE_SHELL_PREFIX="docker exec -i mycontainer -c"` where `-c` needs to come before the quoted command.

---

## 12. Complete Snapshot File Structure

When fully generated, a snapshot file contains these sections in order:

```bash
# Snapshot file
# Unset all aliases to avoid conflicts with functions
unalias -a 2>/dev/null || true
# Functions
eval "$(echo '<base64-encoded-function>' | base64 -d)" > /dev/null 2>&1
eval "$(echo '<base64-encoded-function>' | base64 -d)" > /dev/null 2>&1
# ... more functions ...
# Shell Options
shopt -s cdspell
shopt -u dotglob
# ... more shopt settings ...
set -o emacs
# ... more set -o settings ...
shopt -s expand_aliases
# Aliases
alias -- ll='ls -la'
alias -- gs='git status'
# ... more aliases ...
# Check for rg availability
if ! (unalias rg 2>/dev/null; command -v rg) >/dev/null 2>&1; then
function rg {
  if [[ -n $ZSH_VERSION ]]; then
    ARGV0=rg '/path/to/bundled/rg' "$@"
  elif [[ $BASHPID != $$ ]]; then
    exec -a rg '/path/to/bundled/rg' "$@"
  else
    (exec -a rg '/path/to/bundled/rg' "$@")
  fi
}
fi
# Shadow find/grep with embedded bfs/ugrep
# (only when ant-native is available)
function find { ... }
function grep { ... }
export PATH="/usr/local/bin:/usr/bin:/bin:..."
```

For zsh, the structure differs in the Functions section (direct `typeset -f` output instead of base64-encoded eval) and Shell Options section (`setopt` commands instead of `shopt`/`set -o`).

---

## 13. Lifecycle Summary

```
┌─────────────────────────────────────────────────────────────────┐
│                     Session Start                                │
│  sx9() detectShell → o54() createBashExecutor                    │
│      └→ RN8() createSnapshot (async, non-blocking)               │
│           ├→ LN8() → ~/.bashrc or ~/.zshrc                       │
│           ├→ Ix9() generateSnapshotScript                        │
│           │    ├→ source config < /dev/null                       │
│           │    ├→ Sx9() capture functions/options/aliases          │
│           │    └→ Cx9() inject rg/find/grep/PATH                  │
│           ├→ execFile(shell, ["-c", "-l", script], 10s timeout)   │
│           ├→ stat() verify file created                           │
│           └→ E4() register cleanup on exit                        │
├─────────────────────────────────────────────────────────────────┤
│                     Each Command Execution                       │
│  buildExecCommand():                                             │
│      source snapshot.sh                                          │
│      && session-env hooks (F97)                                  │
│      && extglob disable (mx9)                                    │
│      && eval '<wrapped-command>'                                 │
│      && pwd -P >| cwdFile                                        │
│  getSpawnArgs(): shell -c <command>  (no -l with snapshot)        │
│  getEnvironmentOverrides(): TMUX, TMPDIR, dynamic env            │
├─────────────────────────────────────────────────────────────────┤
│                     Session End                                   │
│  E4 cleanup → unlink snapshot file                                │
└─────────────────────────────────────────────────────────────────┘
```
