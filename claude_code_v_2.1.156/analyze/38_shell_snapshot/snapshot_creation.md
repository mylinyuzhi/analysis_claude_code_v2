# Snapshot Creation: createAndSaveSnapshot + getSnapshotScript (v2.1.156)

> This document deobfuscates the two functions that own the shell-snapshot creation flow in Claude Code v2.1.156: `createAndSaveSnapshot` (`js7`, `cli_inner_pretty.js:341168-341269`) — the top-level orchestrator — and `getSnapshotScript` (`sD_`, `cli_inner_pretty.js:341109-341136`) — the assembler that builds the `bash -c -l <script>` body. Headline 2.1.156 facts: the orchestration is **structurally identical** to the v2.1.88 clean source (same Promise-wrapped `execFile` callback, same shell-type detection, same `snapshot-<type>-<Date.now()>-<rand6>.sh` path under `~/.claude/shell-snapshots`, same three telemetry events, same `timeout=10000 / maxBuffer=1048576 / encoding=utf8`). The only change inside these two functions versus v2.1.88 is that the PATH line `getSnapshotScript` emits (via `getClaudeCodeSnapshotContent` `aD_`) now uses a random-delimiter heredoc and plugin-bin concatenation instead of a flat `echo "export PATH=…"`. The far larger 2.1.156 deltas (`-S dfs`, the spawn-env probe `ws7`, the `getKnownEnvKeys` union) live in *sibling* functions, not in `js7`/`sD_` themselves — this doc flags exactly where the boundary is.

---

## 1. The Top-Level Orchestrator: `createAndSaveSnapshot` (`js7`)

`createAndSaveSnapshot` is an arrow function assigned to the module-level `var js7` (`cli_inner_pretty.js:341168`). It takes the resolved shell binary path (`binShell`) and returns a Promise that resolves to the snapshot file path on success or `undefined` on any failure. It never rejects.

```javascript
// ============================================
// createAndSaveSnapshot - Top-level snapshot creation orchestrator (header + setup)
// Location: cli_inner_pretty.js:341168-341200
// ============================================

// ORIGINAL (for source lookup):
js7 = async (H) => {
    let $ = H.includes("zsh") ? "zsh" : H.includes("bash") ? "bash" : "sh";
    return (
      N(`Creating shell snapshot for ${$} (${H})`),
      new Promise(async (q) => {
        try {
          let K = ux6(H);
          N(`Looking for shell config file: ${K}`);
          let _ = await Z5(K);
          if (!_) N(`Shell config file not found: ${K}, creating snapshot with Claude Code defaults only`);
          let z = Date.now(),
            A = Math.random().toString(36).substring(2, 8),
            Y = hG$.join(l8(), "shell-snapshots");
          N(`Snapshots directory: ${Y}`);
          let f = hG$.join(Y, `snapshot-${$}-${z}-${A}.sh`);
          await vX8.mkdir(Y, { recursive: !0 });
          let O = await sD_(H, f, _);
          (N(`Creating snapshot at: ${f}`),
            N(`Execution timeout: ${VX8}ms`),
            Ms7.execFile(
              H,
              ["-c", "-l", O],
              {
                env: {
                  ...(process.env.CLAUDE_CODE_DONT_INHERIT_ENV ? {} : yv()),
                  SHELL: H,
                  GIT_EDITOR: "true",
                  CLAUDECODE: "1",
                },
                timeout: VX8,
                maxBuffer: 1048576,
                encoding: "utf8",
              },
              async (M, j, w) => { /* callback, see §1.2 */ },
            ));
        } catch (K) { /* outer catch, see §1.3 */ }
      })
    );
  };

// READABLE (for understanding):
const createAndSaveSnapshot = async (binShell) => {
    // (1) shell-type detection: substring match on the binary path
    const shellType = binShell.includes("zsh")  ? "zsh"
                    : binShell.includes("bash") ? "bash"
                    : "sh";

    logForDebugging(`Creating shell snapshot for ${shellType} (${binShell})`);

    return new Promise(async (resolve) => {
        try {
            const configFile = getConfigFile(binShell);                 // ux6 → ~/.zshrc | ~/.bashrc | ~/.profile
            logForDebugging(`Looking for shell config file: ${configFile}`);
            const configFileExists = await pathExists(configFile);      // Z5
            if (!configFileExists)
                logForDebugging(`Shell config file not found: ${configFile}, creating snapshot with Claude Code defaults only`);

            // (2) unique path: snapshot-<type>-<Date.now()>-<rand6>.sh
            const timestamp = Date.now();
            const randomId  = Math.random().toString(36).substring(2, 8);   // 6-char base36
            const snapshotsDir = path.join(getClaudeConfigHomeDir(), "shell-snapshots");   // l8()
            logForDebugging(`Snapshots directory: ${snapshotsDir}`);
            const shellSnapshotPath = path.join(snapshotsDir, `snapshot-${shellType}-${timestamp}-${randomId}.sh`);

            await fsPromises.mkdir(snapshotsDir, { recursive: true });   // mkdir -p
            const snapshotScript = await getSnapshotScript(binShell, shellSnapshotPath, configFileExists);  // sD_

            logForDebugging(`Creating snapshot at: ${shellSnapshotPath}`);
            logForDebugging(`Execution timeout: ${SNAPSHOT_CREATION_TIMEOUT}ms`);   // VX8 = 10000
            childProcess.execFile(binShell, ["-c", "-l", snapshotScript], {
                env: {
                    ...(process.env.CLAUDE_CODE_DONT_INHERIT_ENV ? {} : subprocessEnv()),  // yv()
                    SHELL: binShell,
                    GIT_EDITOR: "true",
                    CLAUDECODE: "1",
                },
                timeout: SNAPSHOT_CREATION_TIMEOUT,   // 10000 ms
                maxBuffer: 1048576,                   // 1 MB
                encoding: "utf8",
            }, async (error, stdout, stderr) => { /* callback, see §1.2 */ });
        } catch (err) { /* outer catch, see §1.3 */ }
    });
};

// Mapping: js7→createAndSaveSnapshot, H→binShell, $→shellType, K→configFile, _→configFileExists,
//          z→timestamp, A→randomId, Y→snapshotsDir, f→shellSnapshotPath, O→snapshotScript, q→resolve,
//          ux6→getConfigFile, Z5→pathExists, l8→getClaudeConfigHomeDir, hG$→path(node),
//          vX8→fs/promises, Ms7→child_process, sD_→getSnapshotScript, VX8→SNAPSHOT_CREATION_TIMEOUT,
//          yv→subprocessEnv, N→logForDebugging, d→logEvent
```

### 1.1 Setup phase, step by step

**What it does:** Resolves which shell flavor and config file are in play, generates a collision-resistant snapshot path, ensures the directory exists, builds the capture script, then spawns the shell to run it.

**How it works (with source anchors):**

| # | Step | 2.1.156 source | Notes |
|---|------|----------------|-------|
| 1 | Shell-type detection | `H.includes("zsh") ? "zsh" : H.includes("bash") ? "bash" : "sh"` — `cli_inner_pretty.js:341169` | Substring match on the binary path string, not an exec/`--version` probe. `sh` is the catch-all fallback. |
| 2 | Config-file resolution | `let K = ux6(H)` — `cli_inner_pretty.js:341174` | `getConfigFile` (`ux6`, `cli_inner_pretty.js:340982-340985`): `zsh→.zshrc`, `bash→.bashrc`, else `.profile`, joined to `os.homedir()`. |
| 3 | Config existence probe | `let _ = await Z5(K)` — `cli_inner_pretty.js:341176` | `pathExists` (`Z5`). A missing config is **not** an error; it is logged and the snapshot proceeds with Claude-defaults only (`cli_inner_pretty.js:341177`). |
| 4 | Unique path | `Date.now()` + `Math.random().toString(36).substring(2,8)` — `cli_inner_pretty.js:341178-341179` | 6-char base36 random suffix. Final name `snapshot-${shellType}-${ts}-${rand6}.sh` at `cli_inner_pretty.js:341182`. |
| 5 | Directory | `Y = hG$.join(l8(), "shell-snapshots")` — `cli_inner_pretty.js:341180`; `await vX8.mkdir(Y, {recursive:true})` — `cli_inner_pretty.js:341183` | `l8()` = `getClaudeConfigHomeDir` (`~/.claude` or override); `recursive:true` makes the `mkdir` idempotent. |
| 6 | Build script | `let O = await sD_(H, f, _)` — `cli_inner_pretty.js:341184` | `getSnapshotScript` returns the full `bash -c -l` body — see §2. |
| 7 | Spawn shell | `Ms7.execFile(H, ["-c","-l", O], opts, cb)` — `cli_inner_pretty.js:341187-341200` | `Ms7` = `require("child_process")` (bound in module init `Ds7`, `cli_inner_pretty.js:341288`). |

**Why shell-type detection by substring (alternatives & trade-offs):** The function never executes the shell to ask "what are you" before building the script — it pattern-matches the path string (`/bin/zsh`, `/usr/bin/bash`, …). The alternative — spawning `$shell --version` — costs an extra process launch on the hot session-startup path and can hang on misconfigured shells. The substring approach is O(1), cannot hang, and the only cost is mis-classifying an exotic shell (e.g. a `zsh` symlinked to a name without "zsh" in it) into the `sh`/`.profile` branch, which degrades gracefully (you still get a valid POSIX snapshot, just without zsh-specific capture). **Key insight:** the same `includes` ladder appears verbatim in both `js7` (`341169`) and `getConfigFile` `ux6` (`340983`) — they classify independently from the *same* `binShell` string, so they always agree.

**Why a `Date.now()`-plus-`rand6` filename:** Multiple Claude sessions (or multiple shell adapters within one session) can create snapshots concurrently under the shared `~/.claude/shell-snapshots` directory. A timestamp alone collides when two snapshots are created in the same millisecond; the 6-char base36 suffix (~2 billion values) makes a same-millisecond collision astronomically unlikely. This is identical to v2.1.88 (`ShellSnapshot.ts:437-444`).

### 1.2 The `execFile` callback (success + failure paths)

```javascript
// ============================================
// createAndSaveSnapshot - execFile result callback (verify / cleanup / telemetry)
// Location: cli_inner_pretty.js:341201-341260
// ============================================

// ORIGINAL (for source lookup):
async (M, j, w) => {
  if (M) {
    let D = M;
    if (
      (N(`Shell snapshot creation failed: ${M.message}`),
      N("Error details:"),
      N(`  - Error code: ${D?.code}`),
      N(`  - Error signal: ${D?.signal}`),
      N(`  - Error killed: ${D?.killed}`),
      N(`  - Shell path: ${H}`),
      N(`  - Config file: ${ux6(H)}`),
      N(`  - Config file exists: ${_}`),
      N(`  - Working directory: ${C$()}`),
      N(`  - Claude home: ${l8()}`),
      N(`Full snapshot script:
${O}`),
      j)
    )
      N(`stdout output (${j.length} chars):
${j}`);
    else N("No stdout output captured");
    if (w) N(`stderr output (${w.length} chars): ${w}`);
    else N("No stderr output captured");
    N(`Failed to create shell snapshot: ${M.message}`, { level: "error" });
    let J = D?.signal ? kX8.constants.signals[D.signal] : void 0;
    (d("tengu_shell_snapshot_failed", {
      stderr_length: w?.length || 0,
      has_error_code: !!D?.code,
      error_signal_number: J,
      error_killed: D?.killed,
    }),
      q(void 0));
  } else {
    let D;
    try {
      D = (await vX8.stat(f)).size;
    } catch {}
    if (D !== void 0)
      (N(`Shell snapshot created successfully (${D} bytes)`),
        $7(async () => {
          try {
            (await U$().unlink(f), N(`Cleaned up session snapshot: ${f}`));
          } catch (J) {
            N(`Error cleaning up session snapshot: ${J}`);
          }
        }),
        q(f));
    else {
      (N(`Shell snapshot file not found after creation: ${f}`),
        N(`Checking if parent directory still exists: ${Y}`));
      try {
        let J = await U$().readdir(Y);
        N(`Directory contains ${J.length} files`);
      } catch {
        N(`Parent directory does not exist or is not accessible: ${Y}`);
      }
      (d("tengu_shell_unknown_error", {}), q(void 0));
    }
  }
}

// READABLE (for understanding):
async (error, stdout, stderr) => {
  if (error) {
    const execError = error;   // Error & { killed?, signal?, code? }
    // --- full debug-log trail (one logForDebugging per field) ---
    logForDebugging(`Shell snapshot creation failed: ${error.message}`);
    logForDebugging("Error details:");
    logForDebugging(`  - Error code: ${execError?.code}`);
    logForDebugging(`  - Error signal: ${execError?.signal}`);
    logForDebugging(`  - Error killed: ${execError?.killed}`);
    logForDebugging(`  - Shell path: ${binShell}`);
    logForDebugging(`  - Config file: ${getConfigFile(binShell)}`);       // ux6
    logForDebugging(`  - Config file exists: ${configFileExists}`);
    logForDebugging(`  - Working directory: ${getCwd()}`);                // C$()
    logForDebugging(`  - Claude home: ${getClaudeConfigHomeDir()}`);      // l8()
    logForDebugging(`Full snapshot script:\n${snapshotScript}`);
    if (stdout) logForDebugging(`stdout output (${stdout.length} chars):\n${stdout}`);
    else        logForDebugging("No stdout output captured");
    if (stderr) logForDebugging(`stderr output (${stderr.length} chars): ${stderr}`);
    else        logForDebugging("No stderr output captured");
    logForDebugging(`Failed to create shell snapshot: ${error.message}`, { level: "error" });

    // signal NAME ("SIGKILL") → signal NUMBER (9) via os.constants.signals
    const signalNumber = execError?.signal ? os.constants.signals[execError.signal] : undefined;
    logEvent("tengu_shell_snapshot_failed", {
      stderr_length: stderr?.length || 0,
      has_error_code: !!execError?.code,
      error_signal_number: signalNumber,
      error_killed: execError?.killed,
    });
    resolve(undefined);
  } else {
    let snapshotSize;
    try { snapshotSize = (await fsPromises.stat(shellSnapshotPath)).size; } catch {}

    if (snapshotSize !== undefined) {
      logForDebugging(`Shell snapshot created successfully (${snapshotSize} bytes)`);
      registerCleanup(async () => {                                       // $7
        try {
          await getFsImplementation().unlink(shellSnapshotPath);          // U$().unlink
          logForDebugging(`Cleaned up session snapshot: ${shellSnapshotPath}`);
        } catch (err) {
          logForDebugging(`Error cleaning up session snapshot: ${err}`);
        }
      });
      resolve(shellSnapshotPath);
    } else {
      logForDebugging(`Shell snapshot file not found after creation: ${shellSnapshotPath}`);
      logForDebugging(`Checking if parent directory still exists: ${snapshotsDir}`);
      try {
        const dirContents = await getFsImplementation().readdir(snapshotsDir);
        logForDebugging(`Directory contains ${dirContents.length} files`);
      } catch {
        logForDebugging(`Parent directory does not exist or is not accessible: ${snapshotsDir}`);
      }
      logEvent("tengu_shell_unknown_error", {});
      resolve(undefined);
    }
  }
}

// Mapping: M→error, j→stdout, w→stderr, D(if-branch)→execError, D(else-branch)→snapshotSize,
//          J(signal)→signalNumber, J(cleanup err)→err, J(readdir)→dirContents, f→shellSnapshotPath,
//          Y→snapshotsDir, O→snapshotScript, _→configFileExists, H→binShell, q→resolve,
//          C$→getCwd, l8→getClaudeConfigHomeDir, kX8→os, vX8→fs/promises, U$→getFsImplementation,
//          $7→registerCleanup, d→logEvent, N→logForDebugging
```

**Success path (the `else` branch, `cli_inner_pretty.js:341233-341247`):**

1. `stat(shellSnapshotPath).size` is read inside a `try/catch` (`cli_inner_pretty.js:341235-341237`). A `catch {}` swallows the stat error so that "file missing after a *successful* exec" becomes `snapshotSize === undefined` rather than a thrown exception.
2. If `snapshotSize !== undefined` (file exists): log the byte size, register a shutdown cleanup, and `resolve(shellSnapshotPath)` (`cli_inner_pretty.js:341238-341247`).
3. `registerCleanup` (`$7`, `cli_inner_pretty.js:341240`) enqueues an async callback that `unlink`s the snapshot via `getFsImplementation().unlink` (`U$().unlink`, `cli_inner_pretty.js:341242`) on graceful shutdown. The unlink is itself wrapped in `try/catch` so a missing file at exit time is a no-op debug line, not a crash.

**Why `stat`-then-resolve instead of trusting the exit code (the "verify" decision):** `execFile` returning no error only tells us the shell process exited 0 — it does **not** tell us the snapshot file was written. The capture script writes the file via `>>`/`>|` redirection (see §2), so a script that silently `cd`-ed away, hit a `noclobber` failure on a non-`>|` line, or had its final `[ ! -f … ] && exit 1` guard satisfied could still exit cleanly without a usable file. The explicit `stat` is the orchestrator's independent proof-of-write. **Key insight:** this is why a *third* telemetry event exists — `tengu_shell_unknown_error` (`cli_inner_pretty.js:341257`) fires only in the "exec succeeded but file absent" gap, which is otherwise invisible.

**Failure path (the `if (error)` branch, `cli_inner_pretty.js:341202-341232`):**

1. A long, field-by-field debug-log trail is emitted (one `logForDebugging`/`N` call per field): `error.message`, `code`, `signal`, `killed`, `binShell`, re-resolved `getConfigFile(binShell)`, `configFileExists`, `getCwd()`, `getClaudeConfigHomeDir()`, the **full snapshot script**, and conditionally the captured `stdout`/`stderr` with their char counts (`cli_inner_pretty.js:341205-341223`).
2. The signal **name** → **number** conversion at `cli_inner_pretty.js:341225`: `D?.signal ? kX8.constants.signals[D.signal] : void 0`. Node's `execFile` error carries `signal` as a string like `"SIGKILL"`; `os.constants.signals["SIGKILL"]` maps it to the integer `9`. Telemetry stores the number (compact, locale-independent, easy to aggregate) rather than the string.
3. `tengu_shell_snapshot_failed` (`cli_inner_pretty.js:341226-341231`) with `{stderr_length, has_error_code, error_signal_number, error_killed}`. Note the payload carries **no raw stderr text** — only its length — to avoid exfiltrating user environment data into analytics. `error_killed: true` typically means the 10-second `timeout` fired.
4. `resolve(undefined)` (`cli_inner_pretty.js:341232`).

### 1.3 Outer `catch` and the three-event taxonomy

The setup phase is wrapped in `try { … } catch (K) { … }` (`cli_inner_pretty.js:341173`/`341262-341266`). A synchronous throw before/around `execFile` (e.g. `mkdir` failing, a path-resolution exception) lands here, logs `Unexpected error during snapshot creation` at error level plus a stack trace, emits `tengu_shell_snapshot_error` (`cli_inner_pretty.js:341265`), and `resolve(undefined)`.

**Why three distinct events for what looks like one "failed":**

| Event | Trigger | Source | What it isolates |
|-------|---------|--------|------------------|
| `tengu_shell_snapshot_failed` | `execFile` callback got an `error` | `cli_inner_pretty.js:341226` | The user's shell config is broken (syntax/timeout/signal) — carries `error_signal_number`, `error_killed`. |
| `tengu_shell_unknown_error` | exec succeeded but file absent after `stat` | `cli_inner_pretty.js:341257` | A race/FS anomaly — empty payload because there is no real signal to report. |
| `tengu_shell_snapshot_error` | synchronous throw in setup | `cli_inner_pretty.js:341265` | Claude Code's *own* setup logic threw (mkdir, path resolution). |

This split lets analytics distinguish "user environment is broken" from "our setup logic is broken" from "something weirder is happening", each with a different remediation owner. The taxonomy is unchanged from v2.1.88 (`ShellSnapshot.ts:513`, `566`, `578`).

**Key insight — the Promise never rejects.** Every path resolves with either the path or `undefined`. The consumer `createBashShellAdapter` (`Gs7`, `cli_inner_pretty.js:341341`) fires `js7(H)` and only needs to branch on truthiness, never to `.catch`. This is a deliberate API contract: snapshot creation is best-effort, and a failed snapshot must degrade the session (no custom aliases/functions) rather than abort it.

---

## 2. The Script Assembler: `getSnapshotScript` (`sD_`)

```javascript
// ============================================
// getSnapshotScript - Assembles the full `bash -c -l <script>` capture body
// Location: cli_inner_pretty.js:341109-341136
// ============================================

// ORIGINAL (for source lookup):
async function sD_(H, $, q) {
  let K = ux6(H),
    _ = K.endsWith(".zshrc"),
    z = q ? oD_(K) : !_ ? 'echo "shopt -s expand_aliases" >> "$SNAPSHOT_FILE"' : "",
    A = await aD_(H);
  return `SNAPSHOT_FILE=${O4([$])}
      ${q ? `source "${K}" < /dev/null` : "# No user config file to source"}

      # First, create/clear the snapshot file
      echo "# Snapshot file" >| "$SNAPSHOT_FILE"

      # When this file is sourced, we first unalias to avoid conflicts
      # This is necessary because aliases get "frozen" inside function definitions at definition time,
      # which can cause unexpected behavior when functions use commands that conflict with aliases
      echo "# Unset all aliases to avoid conflicts with functions" >> "$SNAPSHOT_FILE"
      echo "unalias -a 2>/dev/null || true" >> "$SNAPSHOT_FILE"

      ${z}

      ${A}

      # Exit silently on success, only report errors
      if [ ! -f "$SNAPSHOT_FILE" ]; then
        echo "Error: Snapshot file was not created at $SNAPSHOT_FILE" >&2
        exit 1
      fi
    `;
}

// READABLE (for understanding):
async function getSnapshotScript(binShell, snapshotFilePath, configFileExists) {
  const configFile = getConfigFile(binShell);           // ux6
  const isZsh = configFile.endsWith(".zshrc");

  // userContent: from config if it exists; else for bash inject `shopt -s expand_aliases`
  // (getUserSnapshotContent normally emits this); for zsh-with-no-config, empty string.
  const userContent = configFileExists
    ? getUserSnapshotContent(configFile)                 // oD_
    : !isZsh
      ? 'echo "shopt -s expand_aliases" >> "$SNAPSHOT_FILE"'
      : "";
  const claudeContent = await getClaudeCodeSnapshotContent(binShell);   // aD_  (async)

  return `SNAPSHOT_FILE=${shellQuote([snapshotFilePath])}
      ${configFileExists ? `source "${configFile}" < /dev/null` : "# No user config file to source"}

      # First, create/clear the snapshot file
      echo "# Snapshot file" >| "$SNAPSHOT_FILE"

      # When this file is sourced, we first unalias to avoid conflicts
      # ...aliases get "frozen" inside function definitions at definition time...
      echo "# Unset all aliases to avoid conflicts with functions" >> "$SNAPSHOT_FILE"
      echo "unalias -a 2>/dev/null || true" >> "$SNAPSHOT_FILE"

      ${userContent}

      ${claudeContent}

      # Exit silently on success, only report errors
      if [ ! -f "$SNAPSHOT_FILE" ]; then
        echo "Error: Snapshot file was not created at $SNAPSHOT_FILE" >&2
        exit 1
      fi
    `;
}

// Mapping: sD_→getSnapshotScript, H→binShell, $→snapshotFilePath, q→configFileExists,
//          K→configFile, _→isZsh, z→userContent, A→claudeContent,
//          ux6→getConfigFile, oD_→getUserSnapshotContent, aD_→getClaudeCodeSnapshotContent,
//          O4→shellQuote(quote)
```

### 2.1 Body order

**What it does:** Returns a single multi-line bash script string (run later as `bash -c -l <script>`) whose job is to *write another shell file* (`$SNAPSHOT_FILE`) containing the user's captured functions/options/aliases plus Claude's tool integrations.

**How it works — the emitted body, in order (`cli_inner_pretty.js:341114-341135`):**

1. **`SNAPSHOT_FILE=${O4([$])}`** (`cli_inner_pretty.js:341114`) — assigns the target path as a shell variable. `O4` (`quote`, the shell-quote helper) wraps the path as a single safe shell word, so paths containing spaces/metacharacters are inert.
2. **`source "<configFile>" < /dev/null`** if `configFileExists`, else the literal comment `# No user config file to source` (`cli_inner_pretty.js:341115`). The `< /dev/null` redirect feeds EOF to any interactive `read` in the user's rc file so the capture shell can never block on a prompt.
3. **`echo "# Snapshot file" >| "$SNAPSHOT_FILE"`** (`cli_inner_pretty.js:341118`) — create/clear the output file. `>|` is the force-clobber redirect, defeating a user's `set -o noclobber`.
4. **unalias-all preamble** — a comment line plus `echo "unalias -a 2>/dev/null || true" >> "$SNAPSHOT_FILE"` (`cli_inner_pretty.js:341123-341124`). Note: this *writes* `unalias -a` into the snapshot file; it is the snapshot's first executable statement at source-time, not run now.
5. **`${userContent}`** (`cli_inner_pretty.js:341126`) — the result of `getUserSnapshotContent` (`oD_`): functions + shell-options + aliases capture, branched zsh vs bash. (For no-config bash, this is the single `shopt -s expand_aliases` line; for no-config zsh, empty.)
6. **`${claudeContent}`** (`cli_inner_pretty.js:341128`) — the awaited result of `getClaudeCodeSnapshotContent` (`aD_`): rg fallback + find/grep shadow + bq(null stub) + the PATH heredoc.
7. **existence-check trailer** — `if [ ! -f "$SNAPSHOT_FILE" ]; then echo "Error…" >&2; exit 1; fi` (`cli_inner_pretty.js:341130-341134`). This is what makes a vanished-file case surface as a non-zero exit (caught by the `if (error)` branch) rather than a silent success.

**Why a template literal rather than `[].join("\n")`:** The top-level *shape* (prelude → source → clear → unalias → user → claude → verify) is fixed and human-auditable; a template literal keeps that shape visually contiguous so a reviewer can read the generated script top-to-bottom. The two *variable* sub-blocks (`${userContent}`, `${claudeContent}`) are themselves built with `[].join("\n")` inside `oD_`/`aD_` because they have conditional branches. Mixing the two styles puts the stable scaffold in template form and the branchy content in array form — the most readable split.

### 2.2 The three load-bearing shell tricks (rationale)

**(a) `< /dev/null` on the `source` line (`cli_inner_pretty.js:341115`).** User rc files occasionally contain interactive `read` prompts (e.g. powerlevel10k "enable instant prompt?" gates). Without the redirect the 10-second `execFile` timeout would fire and the whole snapshot would fail; with it, `read` gets immediate EOF and the rc file falls through to its default. This converts an entire class of session-hang failures into a no-op.

**(b) `>|` force-clobber on the clear line (`cli_inner_pretty.js:341118`).** `>|` overwrites even when `noclobber` is set. A user who runs `set -o noclobber` in their `.bashrc` would otherwise make the capture script's own first write fail. Using `>|` here (but plain `>>` for appends) is deliberate: only the *truncate* needs clobber protection.

**(c) `unalias -a` written *into* the snapshot, not run now (`cli_inner_pretty.js:341124`).** Bash freezes alias lookups inside function bodies at *definition* time. When the snapshot is later sourced, it redefines functions (some via base64 `eval` in the bash branch of `oD_`) and then redefines aliases; clearing all aliases first guarantees the re-sourced functions don't carry stale alias semantics from the capture shell. Emitting it as the snapshot's first line is what makes the captured environment reproduce faithfully.

**Key insight:** `getSnapshotScript` is a *script that writes a script*. Everything in the returned body is `echo … >> "$SNAPSHOT_FILE"` plumbing whose runtime effect is the *content of the snapshot file*, not the capture shell's own state. The only lines that affect the capture shell itself are the `source` (to load the user env to be captured) and the final existence check.

---

## 3. Cross-Validation: v2.1.156 vs v2.1.88 vs v2.1.142

### 3.1 `createAndSaveSnapshot` — structurally identical to v2.1.88

Comparing `js7` (`cli_inner_pretty.js:341168-341269`) against the clean TypeScript `createAndSaveSnapshot` (`ShellSnapshot.ts:413-582`), every structural element matches:

| Aspect | v2.1.88 (`ShellSnapshot.ts`) | v2.1.156 (`js7`) | Same? |
|--------|------------------------------|------------------|-------|
| Shell-type ladder | `zsh → bash → sh` (`:416-420`) | `cli_inner_pretty.js:341169` | identical |
| Path template | `snapshot-${shellType}-${timestamp}-${randomId}.sh` (`:443`) | `cli_inner_pretty.js:341182` | identical |
| Snapshots dir | `join(getClaudeConfigHomeDir(), 'shell-snapshots')` (`:439`) | `cli_inner_pretty.js:341180` | identical |
| `rand6` | `Math.random().toString(36).substring(2,8)` (`:438`) | `cli_inner_pretty.js:341179` | identical |
| `mkdir` | `{ recursive: true }` (`:447`) | `cli_inner_pretty.js:341183` | identical |
| execFile args | `["-c","-l", script]` (`:458`) | `cli_inner_pretty.js:341189` | identical |
| env spread | `CLAUDE_CODE_DONT_INHERIT_ENV ? {} : subprocessEnv()`, + `SHELL/GIT_EDITOR:'true'/CLAUDECODE:'1'` (`:461-467`) | `cli_inner_pretty.js:341192-341195` | identical |
| timeout / maxBuffer / encoding | `10000 / 1024*1024 / utf8` (`:468-470`) | `cli_inner_pretty.js:341197-341199` | identical |
| stat→registerCleanup→resolve | `:523`/`:534`/`:547` | `cli_inner_pretty.js:341236`/`341240`/`341247` | identical |
| signal-number conversion | `os.constants.signals[…]` (`:508-512`) | `cli_inner_pretty.js:341225` | identical |
| 3 telemetry events | `:513`/`:566`/`:578` | `cli_inner_pretty.js:341226`/`341257`/`341265` | identical |

So the orchestrator itself carries **no behavioral delta** from v2.1.88. The v2.1.142 reference doc reached the same conclusion (its `ip7` is the same shape) — the only obfuscation churn is the symbol renames (`ip7→js7`, `Oi_→sD_`, `Sv6→ux6`, `H_→Z5`, `b8→l8`, `XI→yv`, `hv6→VX8`, `np7→Ms7`).

### 3.2 `getSnapshotScript` — the heredoc PATH change (the one real delta)

`sD_` (`cli_inner_pretty.js:341109-341136`) is byte-for-byte the same template as the v2.1.88 `getSnapshotScript` (`ShellSnapshot.ts:345-386`) — same prelude, same `< /dev/null`, same `>|`, same `unalias -a`, same trailer. The difference is **not in `sD_` itself** but in the `${claudeContent}` it interpolates from `getClaudeCodeSnapshotContent` (`aD_`):

- **v2.1.88** (`ShellSnapshot.ts:332-337`) appends PATH with a flat single line:
  ```bash
  echo "export PATH=${quote([pathValue || ''])}" >> "$SNAPSHOT_FILE"
  ```
- **v2.1.156** writes PATH through a **random-delimiter heredoc** `PATH_END_<random16>` (`cli_inner_pretty.js:341097-341104` per the evidence brief) and concatenates `getPluginBinPaths` (`NV6`) results onto PATH (`341051-341055`). The random delimiter prevents a PATH value that happens to contain the literal token from prematurely terminating the heredoc.

This is the heredoc PATH change the scope calls out. It is **NEW vs v2.1.88** (confirmed: `ShellSnapshot.ts` has only the flat `echo "export PATH=…"` at `:336`, no heredoc, no plugin-bin concatenation) and was already present in the v2.1.142 lineage. Because it lives in `aD_`, this doc only notes the boundary — the full deobfuscation belongs in the `config_file_detection.md`/`shell_integrations.md` siblings.

### 3.3 What is NOT in `js7`/`sD_` (boundary clarification)

The big 2.1.156 changes flagged in the evidence brief are in *sibling* functions, deliberately outside the two functions this doc owns. For diff-completeness, the boundary is:

- **`-S dfs` for find/bfs** lives in `createFindGrepShellIntegration` (`iD_`, `cli_inner_pretty.js:340964`), reached only through `aD_` → `${claudeContent}`. Absent from `ShellSnapshot.ts` (`:167` passes only `['-regextype','findutils-default']`). NEW in 2.1.156.
- **Spawn-env probe** `probeSpawnEnv` (`ws7`, `cli_inner_pretty.js:341137-341159`) is a *separate* function the adapter fires alongside `js7`; it runs `shell -c env`, parses each `KEY=` line via `envLineKeyRegex` (`tD_`, `cli_inner_pretty.js:341290` = `/^([A-Za-z_][A-Za-z0-9_]*)=/`), and stores the key set via `setSpawnEnvKeys` (`i98`, `cli_inner_pretty.js:341155`). Entirely absent from `ShellSnapshot.ts`. NEW.
- **`getKnownEnvKeys` union** (`iD$`, `cli_inner_pretty.js:209864-209871`) merges `Object.keys(subprocessEnv())` ∪ `CLAUDE_INJECTED_ENV_KEYS` (`fV5`) ∪ session keys (`K97`) ∪ spawn-probe keys (`l26`), returning `null` until both a snapshot exists and the probe has resolved. The injected-keys list gained `CLAUDE_EFFORT` (`cli_inner_pretty.js:209894`) — NEW. This bridges snapshot creation to the bash permission/policy layer (consumers at 242985/440809/441400).

Note the easy-to-conflate pair in module init `Ds7` (`cli_inner_pretty.js:341288`): `vX8 = require("fs/promises")` (used for `mkdir`/`stat`) versus `VX8 = 1e4` (the `SNAPSHOT_CREATION_TIMEOUT`, `cli_inner_pretty.js:341165`). Same letters, different case — `js7` uses both within four lines (`vX8.mkdir` at `341183`, `timeout: VX8` at `341197`).

---

## 4. Lifecycle: cleanup and retention

The snapshot file has two independent cleanup mechanisms:

1. **Graceful-shutdown unlink** — `registerCleanup` (`$7`) inside the success path (`cli_inner_pretty.js:341240-341246`) removes *this session's* snapshot on a clean exit.
2. **Periodic retention sweep** — `Qvz()` runs `QC(join(getClaudeConfigHomeDir(), "shell-snapshots"), ".sh")` (`cli_inner_pretty.js:588103`), an age-based `.sh` sweep of `~/.claude/shell-snapshots` gated by the `cleanupPeriodDays` logic. This catches snapshots leaked by crashed sessions that never ran their shutdown cleanup.

Separately, `claude project purge` explicitly **does not** touch shell-snapshots: it pushes the warning `"shell-snapshots/ are not project-scoped and will not be touched"` (`cli_inner_pretty.js:642572` and again `cli_inner_pretty.js:642599`, each guarded by a `nAH(join($,"shell-snapshots"))` existence check at `642571`/`642598`), because snapshots are keyed by shell type, not by project.

---

## 5. Decision Summary

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Shell detection | substring `includes` on the path | O(1), cannot hang; mis-classification degrades to a valid POSIX snapshot |
| Filename uniqueness | `Date.now()` + 6-char base36 | survives same-millisecond concurrent creation across sessions |
| Promise contract | always resolve (path or `undefined`), never reject | consumer (`createBashShellAdapter` `Gs7`) branches on truthiness, no `.catch` needed |
| Post-exec verification | independent `stat().size` | exit-0 ≠ file-written; surfaces the "silent no-file" gap |
| Failure taxonomy | three distinct tengu events | isolates user-config / FS-race / our-setup failures |
| Signal in telemetry | number via `os.constants.signals` | compact, locale-independent, aggregatable; raw stderr length only (no text) |
| Capture-shell safety | `< /dev/null`, `>|`, written `unalias -a` | prevents prompt-hang, `noclobber` failure, and stale frozen-alias semantics |
| PATH write (2.1.156) | random-delimiter heredoc + plugin-bin concat (in `aD_`) | avoids delimiter collisions and includes plugin bins — the one delta vs v2.1.88 in this flow |

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_156_shell_snapshot.md](../00_overview/symbol_additions_v2_1_156_shell_snapshot.md) — this module's symbol additions

Key functions in this document:
- `createAndSaveSnapshot` (`js7`) — top-level orchestrator; arrow fn at `cli_inner_pretty.js:341168-341269`
- `getSnapshotScript` (`sD_`) — assembles the `bash -c -l` capture body; `cli_inner_pretty.js:341109-341136`
- `getConfigFile` (`ux6`) — shell path → `~/.zshrc`/`~/.bashrc`/`~/.profile`; `cli_inner_pretty.js:340982-340985`
- `getUserSnapshotContent` (`oD_`) — user functions/options/aliases capture; `cli_inner_pretty.js:340986`
- `getClaudeCodeSnapshotContent` (`aD_`) — rg/find-grep/bq + PATH heredoc; `cli_inner_pretty.js:341045`
- `probeSpawnEnv` (`ws7`) — NEW spawn-env probe (`shell -c env`); `cli_inner_pretty.js:341137-341159`
- `getKnownEnvKeys` (`iD$`) — env-key union feeding bash permission policy; `cli_inner_pretty.js:209864-209871`
- `SNAPSHOT_CREATION_TIMEOUT` (`VX8`) — `1e4` (10000 ms); `cli_inner_pretty.js:341165`
- `subprocessEnv` (`yv`) — sanitized subprocess env spread into the execFile call
- `registerCleanup` (`$7`) — shutdown unlink registry
- `quote` (`O4`) — shell-quote helper used for `SNAPSHOT_FILE=` and PATH words
