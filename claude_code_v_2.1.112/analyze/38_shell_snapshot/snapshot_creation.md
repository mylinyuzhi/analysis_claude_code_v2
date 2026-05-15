# Snapshot Creation: Deep Deobfuscation (v2.1.112)

> Step-by-step deobfuscation of `createAndSaveSnapshot` (UPK) and `getSnapshotScript` (KzY) — the two functions that own the snapshot creation flow. Also covers `createArgv0ShellFunction` (U47), `createRipgrepShellIntegration` (o_Y), and `createFindGrepShellIntegration` (s_Y) — the helpers that build the cross-shell function snippets injected into the snapshot.

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_unit_06.md](../00_overview/symbol_additions_unit_06.md) - Unit 06 module symbols
> - [symbol_index.md](../00_overview/symbol_index.md) - Main v2.1.88→v2.1.112 diff index

Key functions in this document:
- `createAndSaveSnapshot` (UPK) - Top-level orchestrator
- `getSnapshotScript` (KzY) - Assembles the full bash -c script body
- `getClaudeConfigHomeDir` (A7) - Returns `~/.claude`
- `shellQuote` (A5) - Single-quote escape for shell arg list

Tool-integration helpers (`createArgv0ShellFunction` U47, `createRipgrepShellIntegration` o_Y, `createFindGrepShellIntegration` s_Y, `createBigQueryShellIntegration` t_Y) are deobfuscated in the dedicated docs linked from Section 3.

---

## 1. The Top-Level Orchestrator: `createAndSaveSnapshot` (UPK)

```javascript
// ============================================
// createAndSaveSnapshot - Top-level snapshot creation orchestrator
// Location: chunks.144.mjs:1994-2067
// ============================================

// ORIGINAL (for source lookup):
UPK = async (q) => {
    let K = q.includes("zsh") ? "zsh" : q.includes("bash") ? "bash" : "sh";
    return E(`Creating shell snapshot for ${K} (${q})`), new Promise(async (_) => {
        try {
            let z = Q47(q);
            E(`Looking for shell config file: ${z}`);
            let Y = await a3(z);
            if (!Y) E(`Shell config file not found: ${z}, creating snapshot with Claude Code defaults only`);
            let A = Date.now(),
                O = Math.random().toString(36).substring(2, 8),
                w = F47(A7(), "shell-snapshots");
            E(`Snapshots directory: ${w}`);
            let $ = F47(w, `snapshot-${K}-${A}-${O}.sh`);
            await i_Y(w, { recursive: !0 });
            let j = await KzY(q, $, Y);
            E(`Creating snapshot at: ${$}`), E(`Execution timeout: ${g47}ms`), n_Y(q, ["-c", "-l", j], {
                env: {
                    ...process.env.CLAUDE_CODE_DONT_INHERIT_ENV ? {} : Dk(),
                    SHELL: q,
                    GIT_EDITOR: "true",
                    CLAUDECODE: "1"
                },
                timeout: g47,
                maxBuffer: 1048576,
                encoding: "utf8"
            }, async (H, J, X) => { /* callback ... */ })
        } catch (z) {
            if (E(`Unexpected error during snapshot creation: ${z}`), z instanceof Error) E(`Error stack trace: ${z.stack}`);
            j6(z), d("tengu_shell_snapshot_error", {}), _(void 0)
        }
    })
}

// READABLE (for understanding):
const createAndSaveSnapshot = async (shellPath) => {
    const shellType = shellPath.includes("zsh") ? "zsh"
                    : shellPath.includes("bash") ? "bash"
                    : "sh";

    logForDebugging(`Creating shell snapshot for ${shellType} (${shellPath})`);

    return new Promise(async (resolve) => {
        try {
            const configFile = getConfigFile(shellPath);
            logForDebugging(`Looking for shell config file: ${configFile}`);
            const configFileExists = await pathExists(configFile);
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
                timeout: SNAPSHOT_CREATION_TIMEOUT,    // g47 = 10000
                maxBuffer: 1048576,                     // 1 MB
                encoding: "utf8"
            }, async (error, stdout, stderr) => { /* callback below */ });
        } catch (err) {
            logForDebugging(`Unexpected error during snapshot creation: ${err}`);
            if (err instanceof Error) logForDebugging(`Error stack trace: ${err.stack}`);
            logError(err);
            logEvent("tengu_shell_snapshot_error", {});
            resolve(undefined);
        }
    });
};

// Mapping: UPK→createAndSaveSnapshot, q→shellPath, K→shellType, z→configFile,
//          Y→configFileExists, A→timestamp, O→randomId, w→snapshotsDir,
//          $→shellSnapshotPath, j→snapshotScript, _→resolve,
//          Q47→getConfigFile, a3→pathExists, F47→path.join, A7→getClaudeConfigHomeDir,
//          i_Y→mkdir, KzY→getSnapshotScript, n_Y→execFile, g47→SNAPSHOT_CREATION_TIMEOUT,
//          Dk→subprocessEnv, d→logEvent, j6→logError, E→logForDebugging
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
        logForDebugging(`Full snapshot script:\n${snapshotScript}`);
        if (stdout) logForDebugging(`stdout output (${stdout.length} chars):\n${stdout}`);
        else        logForDebugging(`No stdout output captured`);
        if (stderr) logForDebugging(`stderr output (${stderr.length} chars): ${stderr}`);
        else        logForDebugging(`No stderr output captured`);

        logError(new Error(`Failed to create shell snapshot: ${error.message}`));
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

// Mapping: H→error, J→stdout, X→stderr, M→execError, P→signalNumber, $→shellSnapshotPath, _→resolve
```

### Step-by-step breakdown

| # | Step | Source | Notes |
|---|------|--------|-------|
| 1 | Shell-type detection | `q.includes("zsh") ? "zsh" : q.includes("bash") ? "bash" : "sh"` | Substring check on the binary path. POSIX `sh` is the fallback. |
| 2 | Config file lookup | `Q47(q)` | See [config_file_detection.md](./config_file_detection.md) |
| 3 | Config existence probe | `a3(z)` (=`pathExists`) | Returns boolean; missing config is not an error |
| 4 | Generate unique path | `snapshot-${shell}-${ts}-${rand6}.sh` | 6-char base36 random suffix |
| 5 | Ensure directory | `i_Y(w, {recursive: true})` (=`mkdir -p`) | Tolerant of pre-existing dir |
| 6 | Build script | `KzY(q, $, Y)` → see Section 2 | Returns the full bash script body |
| 7 | Spawn shell | `n_Y(shell, ["-c","-l", script], opts, callback)` | `n_Y` = `execFile` |
| 8 | Verify file | `await stat(snapshotPath)`.size | Truth-y size means the script wrote the file |
| 9 | Register cleanup | `eq(asyncCallback)` (=`registerCleanup`) | Fires on graceful shutdown |
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

The entire function body is wrapped in `new Promise(async (resolve) => { try { ... } catch { resolve(undefined) } })`. The Promise never rejects — every error path resolves with `undefined`. This is intentional: `createBashExecutor` always sees a value, never a rejection, so it doesn't need `.catch` at the consumption site. The `.catch` block at the call site (`UPK(q).catch(...)`) exists only as a safety net for impossible programmer errors.

---

## 2. The Script Assembler: `getSnapshotScript` (KzY)

```javascript
// ============================================
// getSnapshotScript - Assembles the full bash -c -l <script> body
// Location: chunks.144.mjs:1957-1984
// ============================================

// ORIGINAL (for source lookup):
async function KzY(q, K, _) {
    let z = Q47(q),
        Y = z.endsWith(".zshrc"),
        A = _ ? e_Y(z) : !Y ? 'echo "shopt -s expand_aliases" >> "$SNAPSHOT_FILE"' : "",
        O = await qzY(q);
    return `SNAPSHOT_FILE=${A5([K])}
      ${_?`source "${z}" < /dev/null`:"# No user config file to source"}

      # First, create/clear the snapshot file
      echo "# Snapshot file" >| "$SNAPSHOT_FILE"

      # When this file is sourced, we first unalias to avoid conflicts
      # This is necessary because aliases get "frozen" inside function definitions at definition time,
      # which can cause unexpected behavior when functions use commands that conflict with aliases
      echo "# Unset all aliases to avoid conflicts with functions" >> "$SNAPSHOT_FILE"
      echo "unalias -a 2>/dev/null || true" >> "$SNAPSHOT_FILE"

      ${A}

      ${O}

      # Exit silently on success, only report errors
      if [ ! -f "$SNAPSHOT_FILE" ]; then
        echo "Error: Snapshot file was not created at $SNAPSHOT_FILE" >&2
        exit 1
      fi
    `
}

// READABLE (for understanding):
async function getSnapshotScript(shellPath, snapshotFilePath, configFileExists) {
    const configFile = getConfigFile(shellPath);                           // Q47
    const isZsh = configFile.endsWith(".zshrc");
    const userContent = configFileExists
        ? getUserSnapshotContent(configFile)                                // e_Y
        : !isZsh
            ? 'echo "shopt -s expand_aliases" >> "$SNAPSHOT_FILE"'         // bash needs alias-expansion forced on
            : "";
    const claudeCodeContent = await getClaudeCodeSnapshotContent(shellPath);// qzY

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

// Mapping: KzY→getSnapshotScript, q→shellPath, K→snapshotFilePath, _→configFileExists,
//          z→configFile, Y→isZsh, A→userContent, O→claudeCodeContent,
//          A5→shellQuote, e_Y→getUserSnapshotContent, qzY→getClaudeCodeSnapshotContent
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
| `createArgv0ShellFunction` | U47 | [argv0_dispatch.md](./argv0_dispatch.md) | The shared primitive: portable argv[0] dispatch across zsh, bash subshell, bash main shell, and Windows Git Bash |
| `createRipgrepShellIntegration` | o_Y | [ripgrep_integration.md](./ripgrep_integration.md) | Returns either `{type: "function", snippet}` (embedded rg) or `{type: "alias", snippet}` (standalone rg binary) |
| `createFindGrepShellIntegration` | s_Y | [find_grep_integration.md](./find_grep_integration.md) | bfs/ugrep shadow functions with their prepended-flag rationale; or null when embedded search tools aren't available |
| `createBigQueryShellIntegration` | t_Y | [shell_integrations.md](./shell_integrations.md) | Currently always returns null — forward-compat hook for a future `bq` (BigQuery CLI) wrapper |

The orchestration shape that consumes them lives in `getClaudeCodeSnapshotContent` (qzY); see [config_file_detection.md](./config_file_detection.md) Section 3 for that deobfuscation.

The key cross-cutting design choice in v2.1.112 — that the generated rg/find/grep functions resolve the claude binary at function-call time via `$CLAUDE_CODE_EXECPATH` instead of baking the path at snapshot-generation time — is detailed in [argv0_dispatch.md](./argv0_dispatch.md). This is what makes snapshots portable across binary upgrades.

---

## 4. End-to-End: From Trigger to File

```
                                  ┌────────────────────────┐
                                  │ createAndSaveSnapshot   │
                                  │ (UPK)                   │
                                  │ chunks.144.mjs:1994     │
                                  └────────────┬────────────┘
                                               │
                       ┌───────────────────────┴───────────────────────┐
                       │                                                │
                       ▼                                                ▼
        ┌──────────────────────────┐                ┌──────────────────────────────┐
        │ getConfigFile (Q47)       │                │ getSnapshotScript (KzY)       │
        │ chunks.144.mjs:1840       │                │ chunks.144.mjs:1957           │
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
            │ (e_Y)                   │  │ (qzY)                       │  │  expand_aliases if   │
            │ chunks.144.mjs:1845     │  │ chunks.144.mjs:1898         │  │  no config + bash)   │
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
                │ Integration (o_Y)     │  │ GrepShell   │  │ QueryShell  │  │ Paths (RG4)     │
                │ chunks.144.mjs:1816   │  │ Integration │  │ Integration │  │ chunks.88.mjs:  │
                │                       │  │ (s_Y)       │  │ (t_Y)       │  │ 2728            │
                │ getRipgrepInfo +      │  │ chunks.144  │  │ chunks.144  │  │                 │
                │ createArgv0Shell      │  │ .mjs:1830   │  │ .mjs:1836   │  │ Plugin enabled  │
                │ Function              │  │             │  │             │  │ → bin/ dirs     │
                └───────────────────────┘  │ U47 x2 +    │  │ (always     │  │ → metachar      │
                                           │ unalias x2  │  │  null)      │  │ filtered        │
                                           └─────────────┘  └─────────────┘  └─────────────────┘
                                                  │
                                                  ▼
                                  All snippets joined → returned to KzY → returned to UPK
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
| `argv[0]` dispatch via env var lookup vs baked path | v2.1.112: env var | Snapshot portability across binary upgrades |
| Three separate telemetry events for failures | Yes | Distinguishes user-config errors from logic errors from race conditions |
| 1000-line caps on user-config captures | Yes | Safety against pathological configs without breaking normal ones |
| Cleanup on graceful shutdown only | Yes (no startup-sweep of stale files) | Simplicity; accept that crashed sessions leak one file each |
| `bq` shadow stub | Wired but null | Forward-compatibility for a future BigQuery integration |
