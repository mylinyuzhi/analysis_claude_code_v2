# Snapshot Creation: Deep Deobfuscation (v2.1.142)

> Step-by-step deobfuscation of `createAndSaveSnapshot` (`ip7`) and `getSnapshotScript` (`Oi_`) — the two functions that own the snapshot creation flow. Also covers `createArgv0ShellFunction` (`Iv6`), `createRipgrepShellIntegration` (`Ki_`), `createFindGrepShellIntegration` (`Ai_`), and `createBigQueryShellIntegration` (`zi_`) — the helpers that build the cross-shell function snippets injected into the snapshot.

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_shell_snapshot.md](../00_overview/symbol_additions_v2_1_142_shell_snapshot.md) - Unit 04 module symbols

Key functions in this document:
- `createAndSaveSnapshot` (`ip7`) — Top-level orchestrator
- `getSnapshotScript` (`Oi_`) — Assembles the full bash -c script body
- `getClaudeConfigHomeDir` (`b8`) — Returns `~/.claude`
- `shellQuote` (`W4`) — Single-quote escape for shell arg list

Tool-integration helpers (`createArgv0ShellFunction` `Iv6`, `createRipgrepShellIntegration` `Ki_`, `createFindGrepShellIntegration` `Ai_`, `createBigQueryShellIntegration` `zi_`) are deobfuscated in the dedicated docs linked from Section 3.

---

## 1. The Top-Level Orchestrator: `createAndSaveSnapshot` (`ip7`)

```javascript
// ============================================
// createAndSaveSnapshot - Top-level snapshot creation orchestrator
// Location: cli_inner_pretty.js:360697-360798
// ============================================

// ORIGINAL (for source lookup):
ip7 = async (H) => {
    let $ = H.includes("zsh") ? "zsh" : H.includes("bash") ? "bash" : "sh";
    return (
      N(`Creating shell snapshot for ${$} (${H})`),
      new Promise(async (q) => {
        try {
          let K = Sv6(H);
          N(`Looking for shell config file: ${K}`);
          let _ = await H_(K);
          if (!_) N(`Shell config file not found: ${K}, creating snapshot with Claude Code defaults only`);
          let A = Date.now(),
            z = Math.random().toString(36).substring(2, 8),
            Y = vX$.join(b8(), "shell-snapshots");
          N(`Snapshots directory: ${Y}`);
          let f = vX$.join(Y, `snapshot-${$}-${A}-${z}.sh`);
          await cY8.mkdir(Y, { recursive: !0 });
          let O = await Oi_(H, f, _);
          (N(`Creating snapshot at: ${f}`),
            N(`Execution timeout: ${hv6}ms`),
            np7.execFile(H, ["-c", "-l", O], {
              env: {
                ...(process.env.CLAUDE_CODE_DONT_INHERIT_ENV ? {} : XI()),
                SHELL: H,
                GIT_EDITOR: "true",
                CLAUDECODE: "1",
              },
              timeout: hv6,
              maxBuffer: 1048576,
              encoding: "utf8",
            }, async (M, w, D) => { /* callback ... */ }));
        } catch (K) {
          if ((N(`Unexpected error during snapshot creation: ${K}`, { level: "error" }), K instanceof Error))
            N(`Error stack trace: ${K.stack}`);
          (d("tengu_shell_snapshot_error", {}), q(void 0));
        }
      })
    );
  };

// READABLE (for understanding):
const createAndSaveSnapshot = async (shellPath) => {
    const shellType = shellPath.includes("zsh") ? "zsh"
                    : shellPath.includes("bash") ? "bash"
                    : "sh";

    logForDebugging(`Creating shell snapshot for ${shellType} (${shellPath})`);

    return new Promise(async (resolve) => {
        try {
            const configFile = getConfigFile(shellPath);                       // Sv6
            logForDebugging(`Looking for shell config file: ${configFile}`);
            const configFileExists = await pathExists(configFile);             // H_
            if (!configFileExists) {
                logForDebugging(`Shell config file not found: ${configFile}, creating snapshot with Claude Code defaults only`);
            }

            const timestamp = Date.now();
            const randomId = Math.random().toString(36).substring(2, 8);
            const snapshotsDir = path.join(getClaudeConfigHomeDir(), "shell-snapshots");
            logForDebugging(`Snapshots directory: ${snapshotsDir}`);
            const shellSnapshotPath = path.join(snapshotsDir, `snapshot-${shellType}-${timestamp}-${randomId}.sh`);

            await mkdir(snapshotsDir, { recursive: true });
            const snapshotScript = await getSnapshotScript(shellPath, shellSnapshotPath, configFileExists);

            logForDebugging(`Creating snapshot at: ${shellSnapshotPath}`);
            logForDebugging(`Execution timeout: ${SNAPSHOT_CREATION_TIMEOUT}ms`);

            execFile(shellPath, ["-c", "-l", snapshotScript], {
                env: {
                    ...(process.env.CLAUDE_CODE_DONT_INHERIT_ENV ? {} : subprocessEnv()),
                    SHELL: shellPath,
                    GIT_EDITOR: "true",
                    CLAUDECODE: "1"
                },
                timeout: SNAPSHOT_CREATION_TIMEOUT,    // hv6 = 10000
                maxBuffer: 1048576,                     // 1 MB
                encoding: "utf8"
            }, async (error, stdout, stderr) => { /* callback below */ });
        } catch (err) {
            logForDebugging(`Unexpected error during snapshot creation: ${err}`, { level: "error" });
            if (err instanceof Error) logForDebugging(`Error stack trace: ${err.stack}`);
            logEvent("tengu_shell_snapshot_error", {});
            resolve(undefined);
        }
    });
};

// Mapping: ip7→createAndSaveSnapshot, H→shellPath, $→shellType, K→configFile,
//          _→configFileExists, A→timestamp, z→randomId, Y→snapshotsDir,
//          f→shellSnapshotPath, O→snapshotScript, q→resolve,
//          Sv6→getConfigFile, H_→pathExists, vX$→path, b8→getClaudeConfigHomeDir,
//          cY8→fs/promises, Oi_→getSnapshotScript, np7→child_process,
//          hv6→SNAPSHOT_CREATION_TIMEOUT, XI→subprocessEnv, d→logEvent, N→logForDebugging
```

### Callback body (deobfuscated)

```javascript
// READABLE:
async (error, stdout, stderr) => {
    if (error) {
        const execError = error;
        logForDebugging(`Shell snapshot creation failed: ${error.message}`);
        logForDebugging(`Error details:`);
        logForDebugging(`  - Error code: ${execError?.code}`);
        logForDebugging(`  - Error signal: ${execError?.signal}`);
        logForDebugging(`  - Error killed: ${execError?.killed}`);
        logForDebugging(`  - Shell path: ${shellPath}`);
        logForDebugging(`  - Config file: ${getConfigFile(shellPath)}`);
        logForDebugging(`  - Config file exists: ${configFileExists}`);
        logForDebugging(`  - Working directory: ${getCwd()}`);
        logForDebugging(`  - Claude home: ${getClaudeConfigHomeDir()}`);
        if (stdout) logForDebugging(`stdout output (${stdout.length} chars):\n${stdout}`);
        else        logForDebugging(`No stdout output captured`);
        if (stderr) logForDebugging(`stderr output (${stderr.length} chars): ${stderr}`);
        else        logForDebugging(`No stderr output captured`);

        logForDebugging(`Failed to create shell snapshot: ${error.message}`, { level: "error" });
        const signalNumber = execError?.signal
            ? os.constants.signals[execError.signal]
            : undefined;
        logEvent("tengu_shell_snapshot_failed", {
            stderr_length: stderr?.length || 0,
            has_error_code: !!execError?.code,
            error_signal_number: signalNumber,
            error_killed: execError?.killed
        });
        resolve(undefined);
    } else {
        let snapshotSize;
        try {
            snapshotSize = (await stat(shellSnapshotPath)).size;
        } catch {}

        if (snapshotSize !== undefined) {
            logForDebugging(`Shell snapshot created successfully (${snapshotSize} bytes)`);
            registerCleanup(async () => {
                try {
                    await getFsImplementation().unlink(shellSnapshotPath);
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

// Mapping: M→error, w→stdout, D→stderr, j→execError, J→signalNumber, f→shellSnapshotPath, q→resolve
```

### Step-by-step breakdown

| # | Step | Source | Notes |
|---|------|--------|-------|
| 1 | Shell-type detection | `H.includes("zsh") ? "zsh" : H.includes("bash") ? "bash" : "sh"` | Substring check on the binary path. POSIX `sh` is the fallback. |
| 2 | Config file lookup | `Sv6(H)` | See [config_file_detection.md](./config_file_detection.md) |
| 3 | Config existence probe | `H_(K)` (=`pathExists`) | Returns boolean; missing config is not an error |
| 4 | Generate unique path | `snapshot-${shell}-${ts}-${rand6}.sh` | 6-char base36 random suffix |
| 5 | Ensure directory | `cY8.mkdir(Y, {recursive: true})` (=`mkdir -p`) | Tolerant of pre-existing dir |
| 6 | Build script | `Oi_(H, f, _)` → see Section 2 | Returns the full bash script body |
| 7 | Spawn shell | `np7.execFile(shell, ["-c","-l", script], opts, callback)` | `np7` = `child_process` |
| 8 | Verify file | `await stat(snapshotPath)`.size | Truth-y size means the script wrote the file |
| 9 | Register cleanup | `CK(asyncCallback)` (=`registerCleanup`) | Fires on graceful shutdown |
| 10 | Resolve Promise | `resolve(path)` or `resolve(undefined)` | Never rejects |

### Why three telemetry events?

The code emits three distinct event names for what naively looks like "snapshot failed":

| Event | Trigger | What we learn |
|-------|---------|---------------|
| `tengu_shell_snapshot_failed` | execFile callback received an error | User shell config likely has a problem (syntax, timeout, signal) — has `stderr_length`, `error_signal_number`, etc. |
| `tengu_shell_unknown_error` | execFile succeeded but the snapshot file doesn't exist after | Race condition or unusual FS state — empty payload because we have no real signal |
| `tengu_shell_snapshot_error` | Synchronous throw before/around execFile | Setup-time issue (mkdir failed, config path resolution exception) — caught by the outer try |

This three-way split lets analytics distinguish "user environment is broken" from "Claude Code's setup logic is broken" from "something weirder is happening", each of which has different remediation paths.

### Key insight

The entire function body is wrapped in `new Promise(async (resolve) => { try { ... } catch { resolve(undefined) } })`. The Promise never rejects — every error path resolves with `undefined`. This is intentional: `createBashShellProvider` always sees a value, never a rejection, so it doesn't need `.catch` at the consumption site. The `.catch` block at the call site (`ip7(H).then(...).catch(...)`) exists only as a safety net for impossible programmer errors, and now ALSO records a `shell_snapshot_create` span failure for OTEL observability.

---

## 2. The Script Assembler: `getSnapshotScript` (`Oi_`)

```javascript
// ============================================
// getSnapshotScript - Assembles the full bash -c -l <script> body
// Location: cli_inner_pretty.js:360661-360688
// ============================================

// ORIGINAL (for source lookup):
async function Oi_(H, $, q) {
  let K = Sv6(H),
    _ = K.endsWith(".zshrc"),
    A = q ? Yi_(K) : !_ ? 'echo "shopt -s expand_aliases" >> "$SNAPSHOT_FILE"' : "",
    z = await fi_(H);
  return `SNAPSHOT_FILE=${W4([$])}
      ${q ? `source "${K}" < /dev/null` : "# No user config file to source"}

      # First, create/clear the snapshot file
      echo "# Snapshot file" >| "$SNAPSHOT_FILE"

      # When this file is sourced, we first unalias to avoid conflicts
      # This is necessary because aliases get "frozen" inside function definitions at definition time,
      # which can cause unexpected behavior when functions use commands that conflict with aliases
      echo "# Unset all aliases to avoid conflicts with functions" >> "$SNAPSHOT_FILE"
      echo "unalias -a 2>/dev/null || true" >> "$SNAPSHOT_FILE"

      ${A}

      ${z}

      # Exit silently on success, only report errors
      if [ ! -f "$SNAPSHOT_FILE" ]; then
        echo "Error: Snapshot file was not created at $SNAPSHOT_FILE" >&2
        exit 1
      fi
    `;
}

// READABLE (for understanding):
async function getSnapshotScript(shellPath, snapshotFilePath, configFileExists) {
    const configFile = getConfigFile(shellPath);                              // Sv6
    const isZsh = configFile.endsWith(".zshrc");
    const userContent = configFileExists
        ? getUserSnapshotContent(configFile)                                   // Yi_
        : !isZsh
            ? 'echo "shopt -s expand_aliases" >> "$SNAPSHOT_FILE"'             // bash needs alias-expansion forced on
            : "";
    const claudeCodeContent = await getClaudeCodeSnapshotContent(shellPath);   // fi_

    return `SNAPSHOT_FILE=${shellQuote([snapshotFilePath])}
      ${configFileExists ? `source "${configFile}" < /dev/null` : '# No user config file to source'}

      # First, create/clear the snapshot file
      echo "# Snapshot file" >| "$SNAPSHOT_FILE"

      # When this file is sourced, we first unalias to avoid conflicts
      # This is necessary because aliases get "frozen" inside function definitions at definition time,
      # which can cause unexpected behavior when functions use commands that conflict with aliases
      echo "# Unset all aliases to avoid conflicts with functions" >> "$SNAPSHOT_FILE"
      echo "unalias -a 2>/dev/null || true" >> "$SNAPSHOT_FILE"

      ${userContent}

      ${claudeCodeContent}

      # Exit silently on success, only report errors
      if [ ! -f "$SNAPSHOT_FILE" ]; then
        echo "Error: Snapshot file was not created at $SNAPSHOT_FILE" >&2
        exit 1
      fi
    `;
}

// Mapping: Oi_→getSnapshotScript, H→shellPath, $→snapshotFilePath, q→configFileExists,
//          K→configFile, _→isZsh, A→userContent, z→claudeCodeContent,
//          W4→shellQuote, Yi_→getUserSnapshotContent, fi_→getClaudeCodeSnapshotContent
```

### Three subtle design choices in this script

**1. `< /dev/null` on the `source` line.**

```bash
source "${configFile}" < /dev/null
```

User configs sometimes contain interactive prompts:

```bash
# Imagined ~/.zshrc snippet
read -p "Enable powerlevel10k instant prompt? (y/n) " -n 1 -r yn
[[ $yn == "y" ]] && source ~/.p10k.zsh
```

Without `< /dev/null`, the snapshot-creation shell would block on `read`. With it, `read` immediately gets EOF and the `if` clause fails through to its default. This single redirection prevents an entire class of session-hang failures.

**2. `>|` instead of `>` for the file-clear line.**

```bash
echo "# Snapshot file" >| "$SNAPSHOT_FILE"
```

The `>|` is bash's "clobber" operator — it overwrites the target file even if the shell's `noclobber` option is set. Some users enable `noclobber` (`set -o noclobber`) in their `.bashrc` for safety. Without `>|`, the snapshot-creation script itself would fail when it ran in such a shell.

**3. `unalias -a` written into the snapshot (not run during creation).**

The line being emitted is:

```bash
echo "unalias -a 2>/dev/null || true" >> "$SNAPSHOT_FILE"
```

That is — the snapshot file contains `unalias -a` as its **first executable statement**. When a Bash tool command later sources the snapshot, the very first thing it does is clear all aliases. Why?

Bash aliases inside function bodies get "frozen at definition time": the alias lookup happens when the function is *defined*, not when it's *called*. So if `.bashrc` defines:

```bash
alias ls='ls -G'
function my_helper() { ls /tmp; }   # 'ls' is captured here as 'ls -G'
```

And the snapshot then redefines the function (via base64 eval) before redefining the alias, the function would carry the **old** alias semantics. By clearing all aliases first, then redefining functions (still frozen with the old aliases), then redefining current aliases, the snapshot ensures both function bodies and direct-alias invocations work correctly.

### Script length safety

The 1000-line caps inside `getUserSnapshotContent` (see [config_file_detection.md](./config_file_detection.md)) keep the snapshot file from exceeding tens of MB even in pathological cases. The `execFile` `maxBuffer` of 1 MB limits **stdout/stderr** capture, not the snapshot file itself (which is written via `>>` redirection, not stdout). So extremely-large snapshot files can still be created — just the diagnostic output from a failure is bounded.

---

## 3. Tool Integration Helpers (Deferred)

The script body assembled by `getSnapshotScript` embeds four tool-integration snippets, each produced by a dedicated helper. To keep this document focused on the orchestrator, the deobfuscation of each helper lives in its own dedicated document:

| Helper | Symbol | Dedicated doc | Purpose |
|--------|--------|---------------|---------|
| `createArgv0ShellFunction` | `Iv6` | [argv0_dispatch.md](./argv0_dispatch.md) | The shared primitive: portable argv[0] dispatch across zsh, bash subshell, bash main shell, and Windows Git Bash. NEW in v2.1.142: takes a 4th `denyPatterns` argument and bakes the install path. |
| `createRipgrepShellIntegration` | `Ki_` | [ripgrep_integration.md](./ripgrep_integration.md) | Returns either `{type: "function", snippet}` (embedded rg) or `{type: "alias", snippet}` (standalone rg binary) |
| `createFindGrepShellIntegration` | `Ai_` | [find_grep_integration.md](./find_grep_integration.md) | bfs/ugrep shadow functions; NEW in v2.1.142: passes ugrep-only flag patterns as deny list |
| `createBigQueryShellIntegration` | `zi_` | [shell_integrations.md](./shell_integrations.md) | Always returns null — kept as a forward-compat hook for a future `bq` (BigQuery CLI) wrapper |

The orchestration shape that consumes them lives in `getClaudeCodeSnapshotContent` (`fi_`); see [config_file_detection.md](./config_file_detection.md) Section 3 for that deobfuscation.

The key v2.1.112 → v2.1.142 design changes for these helpers:

1. **`createArgv0ShellFunction` (`Iv6`) baked install path.** v2.1.112 fell back to `command -v claude` when `$CLAUDE_CODE_EXECPATH` was unset. v2.1.142 bakes `${HOME}/.local/bin/claude` (or `claude.exe` on Windows) into the function body via `getInstallBinDir()`/`ne()`. After v2.1.113's native-binary-install change, this path is reliable, and avoids PATH-hijack risk where `command -v claude` could resolve a malicious claude on PATH.

2. **`createArgv0ShellFunction` (`Iv6`) deny-pattern dispatch.** A new 4th argument `K = []` lists glob patterns; if any user argument matches, the wrapper falls through to `command ${H} "$@"` (the system tool). Used only by the `grep` integration to send ugrep-only flags to system grep.

3. **`createFindGrepShellIntegration` (`Ai_`) uses the new deny list** for `grep`, passing `["-*-filter*", "-*-pager*", "-*-view*", "-*-format-open*", "-*-config*", "---*", "-@*", "-*-save-config*"]`. The `find` integration does not use deny patterns (none of bfs's exclusive flags are likely to cause user confusion).

4. **`hasEmbeddedSearchTools` (`dM`) gate simplified.** v2.1.112 read `process.env.EMBEDDED_SEARCH_TOOLS`. v2.1.142 unconditionally returns true for non-SDK builds — embedded `bfs`/`ugrep` are always available on native builds.

5. **`createBigQueryShellIntegration` (`zi_`) explicitly returns null.** Wired but null. The `BQ_FUNC_END` heredoc path in `fi_` is dead code preserved for forward compatibility.

---

## 4. End-to-End: From Trigger to File

```
                                  ┌────────────────────────┐
                                  │ createAndSaveSnapshot   │
                                  │ (ip7)                   │
                                  │ cli_inner_pretty:360697 │
                                  └────────────┬────────────┘
                                               │
                       ┌───────────────────────┴───────────────────────┐
                       │                                                │
                       ▼                                                ▼
        ┌──────────────────────────┐                ┌──────────────────────────────┐
        │ getConfigFile (Sv6)       │                │ getSnapshotScript (Oi_)       │
        │ cli_inner_pretty:360534   │                │ cli_inner_pretty:360661       │
        │                          │                │                              │
        │ shellPath → ~/.bashrc /  │                │ Assembles:                   │
        │ ~/.zshrc / ~/.profile    │                │   prelude (SNAPSHOT_FILE=...) │
        └──────────────────────────┘                │   + source config             │
                                                    │   + unalias-a write           │
                                                    │   + getUserSnapshotContent   │
                                                    │   + getClaudeCodeSnapshot... │
                                                    │   + verify-or-exit-1 trailer  │
                                                    └────┬─────────────────────────┘
                                                         │
                              ┌──────────────────────────┼──────────────────────┐
                              │                          │                       │
                              ▼                          ▼                       ▼
            ┌─────────────────────────┐  ┌────────────────────────────┐  ┌──────────────────────┐
            │ getUserSnapshotContent  │  │ getClaudeCodeSnapshotContent│  │ (literal: shopt -s   │
            │ (Yi_)                   │  │ (fi_)                       │  │  expand_aliases if   │
            │ cli_inner_pretty:360538 │  │ cli_inner_pretty:360597     │  │  no config + bash)   │
            │                         │  │                             │  └──────────────────────┘
            │ functions+options+      │  │ rg + find/grep + bq + PATH  │
            │ aliases capture         │  │                             │
            └─────────────────────────┘  └────────┬────────────────────┘
                                                  │
                                ┌─────────────────┼──────────────┬─────────────────────┐
                                │                 │              │                     │
                                ▼                 ▼              ▼                     ▼
                ┌───────────────────────┐  ┌─────────────┐  ┌─────────────┐  ┌────────────────┐
                │ createRipgrepShell    │  │ createFind  │  │ createBig   │  │ getPluginBin    │
                │ Integration (Ki_)     │  │ GrepShell   │  │ QueryShell  │  │ Paths (bM6)     │
                │ cli_inner_pretty:     │  │ Integration │  │ Integration │  │ cli_inner_      │
                │ 360509                │  │ (Ai_)       │  │ (zi_)       │  │ pretty:230997   │
                │                       │  │ cli_inner_  │  │             │  │                 │
                │ ripgrepCommand +      │  │ pretty:     │  │ (always     │  │ Plugin enabled  │
                │ createArgv0Shell      │  │ 360516      │  │  null)      │  │ → bin/ dirs     │
                │ Function              │  │             │  │             │  │ → metachar      │
                └───────────────────────┘  │ Iv6 x2 +    │  │             │  │ filtered        │
                                           │ unalias x2  │  │             │  └─────────────────┘
                                           └─────────────┘  └─────────────┘
                                                  │
                                                  ▼
                                  All snippets joined → returned to Oi_ → returned to ip7
                                                  │
                                                  ▼
                                  execFile(shell, ["-c","-l", script], opts, cb)
                                                  │
                                                  ▼
                                  stat verify → register cleanup → resolve(path)
```

---

## 5. Decision Summary

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Promise rejects vs always resolves | Always resolve | Consumers never need `.catch`; `undefined` path is explicit |
| Script as multi-line template literal | Yes | Easier to read/audit than `[].join("\n")` for the top-level shape |
| Sub-scripts via heredoc vs `echo` | Both, depending on content | Functions need heredoc to preserve newlines; aliases work fine with `echo` |
| `argv[0]` dispatch via env var lookup vs baked path | v2.1.142: env var → baked install path → system tool | Snapshot portability across binary upgrades; baked path avoids PATH-hijack risk; system fallback for missing binary |
| Three separate telemetry events for failures | Yes | Distinguishes user-config errors from logic errors from race conditions |
| OTEL span tracking on snapshot creation | Yes (NEW in v2.1.142) | Observability into snapshot creation time/failures via traces |
| 1000-line caps on user-config captures | Yes | Safety against pathological configs without breaking normal ones |
| Graceful-shutdown cleanup AND periodic retention sweep | Yes (sweep new in v2.1.117) | Catches crashed-session leaks |
| `bq` shadow stub | Wired but null | Forward-compatibility for a future BigQuery integration |
| `dM` env-var gate removed | Yes (NEW in v2.1.142) | Native builds always have bfs/ugrep; no need for opt-in/opt-out |
