# Command Assembly - Deep Analysis (Claude Code 2.1.76)
> Complete analysis of how shell commands are assembled for execution: snapshot sourcing, eval wrapping, CWD tracking, sandbox integration.

Source: `chunks.89.mjs` (lines ~231088-231820), `chunks.42.mjs` (lines ~103821-104144)

---

## 1. buildExecCommand Flow

The `buildExecCommand` method lives inside the `o54` factory function (`createBashExecutor`). It is called for **every** Bash tool invocation and returns a `{ commandString, cwdFilePath }` pair that the caller uses to spawn a shell process.

### Full Source (chunks.89.mjs, line 1319)

```javascript
async buildExecCommand(_, w) {
    // Step 1: Await the snapshot promise (created once at executor init)
    let O = await Y;

    // Step 2: Verify snapshot file still exists on disk
    if (O) try {
        await bx9(O)   // stat the file - throws if missing
    } catch {
        // Snapshot was deleted (e.g., cleanup timer, /tmp wipe)
        k(`Snapshot file missing, recreating: ${O}`);
        Y = RN8(A).catch((v) => {
            k(`Failed to recreate shell snapshot: ${v}`);
            return
        });
        O = await Y
    }

    // Step 3: Stash snapshot path and sandboxTmpDir in closure vars
    z = O;          // z is read by getSpawnArgs to decide -l flag
    K = w.sandboxTmpDir;

    // Step 4: Generate CWD file paths
    let $ = ux9(),                           // os.tmpdir()
        j = y8() === "windows" ? GP($) : $,  // normalize path on Windows
        // Where pwd writes the CWD (inside sandbox tmpdir if sandboxed)
        J = w.useSandbox
            ? $P1(w.sandboxTmpDir, `cwd-${w.id}`)
            : $P1(j, `claude-${w.id}-cwd`),
        // Where the caller reads it back (may differ on Windows)
        M = w.useSandbox
            ? $P1(w.sandboxTmpDir, `cwd-${w.id}`)
            : xx9($, `claude-${w.id}-cwd`);

    // Step 5: Eval-wrap the user command
    let D = x54(_),       // NUL -> /dev/null substitution
        X = b54(D),       // pipe-safe detection
        P = I54(D, X);    // standard eval wrapping

    // Step 6: Special pipe handling (non-sandbox only)
    if (!w.useSandbox && D.includes("|") && X) P = B54(D);

    // Step 7: Build the command chain array
    let W = [];

    // 7a: Source the shell snapshot
    if (O) {
        let v = y8() === "windows" ? GP(O) : O;
        W.push(`source ${j4([v])}`)
    }

    // 7b: Session environment / hook scripts
    let Z = await F97();
    if (Z) W.push(Z);

    // 7c: Disable extglob to prevent syntax errors
    let G = mx9(A);
    if (G) W.push(G);

    // 7d: eval the wrapped command + write pwd
    W.push(`eval ${P}`);
    W.push(`pwd -P >| ${J}`);

    // Step 8: Join with && and apply shell prefix
    let f = W.join(" && ");
    if (process.env.CLAUDE_CODE_SHELL_PREFIX)
        f = M91(process.env.CLAUDE_CODE_SHELL_PREFIX, f);

    return {
        commandString: f,
        cwdFilePath: M
    }
}
```

### Walkthrough

| Step | What happens | Why |
|------|-------------|-----|
| 1 | `await Y` | The snapshot promise `Y` is created once when `o54` is called. Subsequent `buildExecCommand` calls reuse the same resolved value. |
| 2 | `bx9(O)` stat check | Snapshots live in `/tmp` or `~/.claude/shell-snapshots/`. They can be cleaned by the OS or the cleanup timer. If gone, recreate. |
| 3 | Closure capture | `z` (snapshot path) is read by `getSpawnArgs` to decide whether to pass `-l` (login shell). `K` (sandbox tmpdir) is read by `getEnvironmentOverrides`. |
| 4 | CWD file paths | Two paths: `J` (written by `pwd -P` inside the shell) and `M` (read by Node after the process exits). They differ only on Windows due to path normalization. |
| 5-6 | Eval wrapping | The user's command must be wrapped for safe execution under `eval`. Pipe commands get special treatment. |
| 7 | Chain assembly | Each step is joined with `&&` so any failure short-circuits. |
| 8 | Shell prefix | `CLAUDE_CODE_SHELL_PREFIX` allows wrapping the entire chain (e.g., `firejail`, `nsjail`, custom wrappers). |

---

## 2. Command Chain Structure

The final `commandString` passed to the shell is a single `&&`-chained expression:

```
source '/path/to/snapshot-zsh-1234567890-abc123.sh'   # [1] Restore env
&& <session-env-hook-scripts>                          # [2] Hook injections
&& shopt -u extglob 2>/dev/null || true                # [3] Disable extglob
&& eval 'user_command_here'                            # [4] Execute command
&& pwd -P >| /tmp/claude-a1b2-cwd                     # [5] Persist CWD
```

### Step 1: Shell Snapshot Sourcing

The snapshot file (created by `RN8`) contains a full dump of the user's shell environment:

```bash
# Snapshot file
# Unset all aliases to avoid conflicts with functions
unalias -a 2>/dev/null || true
# Functions
function my_func { ... }
# Shell Options
shopt -s expand_aliases
shopt -s checkwinsize
# Aliases
alias -- ls='ls --color=auto'
alias -- ll='ls -la'
# Check for rg availability
if ! (unalias rg 2>/dev/null; command -v rg) >/dev/null 2>&1; then
  alias rg='/path/to/bundled/rg'
fi
export PATH="/usr/local/bin:/usr/bin:..."
```

By sourcing this snapshot, Claude Code restores the user's functions, aliases, shell options, and PATH without running the full `.bashrc`/`.zshrc` on every command. This is a major performance optimization.

### Step 2: Session Environment Hook Scripts (F97)

`F97` loads additional shell setup from two sources:

1. **`CLAUDE_ENV_FILE`**: An environment variable pointing to a file of shell commands to source.
2. **Hook files**: Files matching `setup-hook-*.sh` or `sessionstart-hook-*.sh` in the session-env directory, sorted by type (setup before sessionstart) then by numeric ID.

```javascript
async function F97() {
    if (y8() === "windows") return null;  // Not supported on Windows
    if (bo !== void 0) return bo;          // Cached after first call

    let A = [];
    // Source 1: CLAUDE_ENV_FILE
    let q = process.env.CLAUDE_ENV_FILE;
    if (q) try {
        let Y = (await u97(q, "utf8")).trim();
        if (Y) A.push(Y);
    } catch (Y) { ... }

    // Source 2: Hook files in session-env directory
    let K = await m97();  // ~/.claude/session-env/<session-id>/
    try {
        let z = (await U$3(K))
            .filter((_) => _.match(/^(setup|sessionstart)-hook-\d+\.sh$/))
            .sort(/* setup before sessionstart, then by numeric id */);
        for (let _ of z) {
            let w = W38(K, _);
            let O = (await u97(w, "utf8")).trim();
            if (O) A.push(O);
        }
    } catch (Y) { ... }

    if (A.length === 0) return bo = null;
    return bo = A.join("\n");
}
```

The result is cached in `bo` for the session lifetime. `g97()` can invalidate the cache.

### Step 3: Extglob Disable (mx9)

```javascript
function mx9(A) {
    // When CLAUDE_CODE_SHELL_PREFIX is set, generate a cross-shell-safe command
    if (process.env.CLAUDE_CODE_SHELL_PREFIX)
        return "{ shopt -u extglob || setopt NO_EXTENDED_GLOB; } >/dev/null 2>&1 || true";
    // Otherwise, shell-specific
    if (A.includes("bash"))
        return "shopt -u extglob 2>/dev/null || true";
    else if (A.includes("zsh"))
        return "setopt NO_EXTENDED_GLOB 2>/dev/null || true";
    return null
}
```

Extglob (extended globbing) is disabled because it changes how certain patterns like `?(...)`, `*(...)`, `+(...)` are parsed by the shell. If a user's `.bashrc` enabled it, commands containing parentheses could be misinterpreted. The `|| true` ensures the chain continues even if the shopt fails.

### Step 4: Eval Wrapping

The user's raw command goes through a multi-stage wrapping pipeline before being passed to `eval`.

### Step 5: CWD Persistence

```
pwd -P >| /tmp/claude-a1b2-cwd
```

- `pwd -P` resolves symlinks to give the physical directory path
- `>|` (clobber) forces write even if `noclobber` is set
- The file path includes a random hex ID to avoid collisions between concurrent commands

After the process exits, the caller reads this file to update the tracked CWD:

```javascript
// After process completes
let B = px9(I, { encoding: "utf8" }).trim();  // readFileSync
VO(B, Z);  // validate and set new CWD
```

`VO` validates the path exists and calls `Xt6(Y)` to update the global CWD tracker.

---

## 3. Eval Wrapping (x54, b54, I54, B54)

Four functions form the eval-wrapping pipeline. They handle heredocs, multiline strings, pipes, and stdin redirection.

### x54 - NUL-to-/dev/null Substitution

```javascript
// Gx9 = /(\d?&?>+\s*)[Nn][Uu][Ll](?=\s|$|[|&;)\n])/g
function x54(A) {
    return A.replace(Gx9, "$1/dev/null")
}
```

Windows-style `NUL` redirections (e.g., `2>NUL`, `>nul`) are converted to `/dev/null` for Unix compatibility. The regex matches optional file descriptor digits, redirect operators, and case-insensitive `NUL`.

### b54 - Pipe Safety Detection

```javascript
function b54(A) {
    if (NN8(A)) return false;  // contains heredoc
    if (Zx9(A)) return false;  // contains explicit stdin redirect
    return true;
}
```

Determines whether it is safe to add `< /dev/null` redirection. Returns `false` (unsafe) when:

- **Heredoc detected** (`NN8`): The command uses `<<EOF` or `<<-EOF` syntax, which provides its own stdin. Pattern: `/<<-?\s*(?:(['"]?)(\w+)\1|\\(\w+))/` with guards against bitshift operators (`\d\s*<<\s*\d`) and arithmetic contexts (`$((...<<...))`).

- **Explicit stdin redirect** (`Zx9`): The command already has a `< file` redirection. Pattern: `/(?:^|[\s;&|])<(?![<(])\s*\S+/`.

### I54 - Standard Eval Wrapping

```javascript
function I54(A, q = true) {
    // Heredocs or multiline strings: single-quote the whole command
    if (NN8(A) || Wx9(A)) {
        let Y = `'${A.replace(/'/g, "'" + '"' + "'" + '"' + "'")}'`;
        if (NN8(A)) return Y;            // heredoc: no /dev/null redirect
        return q ? `${Y} < /dev/null` : Y  // multiline: redirect if safe
    }
    // Normal command: shell-quote and optionally redirect
    if (q) return j4([A, "<", "/dev/null"]);
    return j4([A])
}
```

Two strategies based on command complexity:

1. **Heredoc/multiline commands**: Wrapped in single quotes with escaped internal quotes (`'"'"'` is the classic shell single-quote escape). Heredocs never get `< /dev/null` (they provide their own stdin). Multiline strings get it if `q` is true.

2. **Simple commands**: Passed through `j4` (shell-quote array), with `< /dev/null` appended to prevent the command from reading from the terminal's stdin (which would hang).

### Wx9 - Multiline String Detection

```javascript
function Wx9(A) {
    let q = /'(?:[^'\\]|\\.)*\n(?:[^'\\]|\\.)*'/;   // single-quoted multiline
    let K = /"(?:[^"\\]|\\.)*\n(?:[^"\\]|\\.)*"/;   // double-quoted multiline
    return q.test(A) || K.test(A)
}
```

Detects commands containing literal newlines inside quoted strings.

### B54 - Smart Pipe Handling

```javascript
function B54(A) {
    if (A.includes("`"))   return jW6(A);  // backticks: fallback
    if (A.includes("$("))  return jW6(A);  // command substitution: fallback
    if (Nx9(A))            return jW6(A);  // control flow keywords: fallback

    let q = Vx9(A);                        // collapse line continuations
    if (q.includes("\n"))  return jW6(A);  // still multiline: fallback

    let K = Fz(q);                         // tokenize
    if (!K.success)        return jW6(A);  // parse failed: fallback

    let Y = K.tokens;
    let z = fx9(Y);                        // find first pipe operator
    if (z <= 0)            return jW6(A);  // no pipe found: fallback

    // Insert < /dev/null before the pipe, keeping the pipe command's stdin intact
    let _ = [...m54(Y, 0, z), "< /dev/null", ...m54(Y, z, Y.length)];
    return g54(_.join(" "))
}
```

This is the most sophisticated wrapping path. It is used **only** when:
- Sandbox is disabled (`!w.useSandbox`)
- The command contains a pipe (`D.includes("|")`)
- The pipe is safe to modify (`X` from `b54` is true)

The strategy: tokenize the command, find the first `|`, and insert `< /dev/null` before it. This prevents the first command in the pipeline from blocking on stdin while allowing the piped commands to receive their data normally.

**Fallback path** (`jW6`): When the command is too complex to safely tokenize (backticks, `$(...)`, control flow, multiline), it falls back to:

```javascript
function jW6(A) {
    return g54(A) + " < /dev/null"
}
function g54(A) {
    return "'" + A.replace(/'/g, "'" + '"' + "'" + '"' + "'") + "'"
}
```

Simple single-quote wrapping with `< /dev/null` appended to the end. Less precise but always safe.

### Helper Functions

**Nx9** - Control flow detection:
```javascript
function Nx9(A) {
    return /\b(for|while|until|if|case|select)\s/.test(A)
}
```

**Vx9** - Line continuation collapse:
```javascript
function Vx9(A) {
    return A.replace(/\\+\n/g, (q) => {
        let K = q.length - 1;  // number of backslashes
        if (K % 2 === 1) return "\\".repeat(K - 1);  // odd: line continuation
        else return q                                   // even: literal backslashes + newline
    })
}
```

**m54** - Token reconstruction: Rebuilds shell tokens back into a string, handling env var assignments (`KEY=value`), redirections (`2>&1`, `>/dev/null`), and glob patterns. It shell-quotes each word token via `j4`.

**fx9** - Find first pipe:
```javascript
function fx9(A) {
    for (let q = 0; q < A.length; q++) {
        let K = A[q];
        if (VN8(K, "|")) return q
    }
    return -1
}
```

---

## 4. getSpawnArgs

```javascript
getSpawnArgs(_) {
    let w = z !== void 0;  // z = snapshot path (set by buildExecCommand)
    if (w) k("Spawning shell without login (-l flag skipped)");
    return ["-c", ...w ? [] : ["-l"], _]
}
```

| Scenario | Args | Rationale |
|----------|------|-----------|
| Snapshot available | `["-c", command]` | The snapshot already contains the user's shell environment. A login shell would re-run `.bashrc`/`.zshrc`, duplicating work and potentially conflicting with the snapshot. |
| No snapshot | `["-c", "-l", command]` | Without a snapshot, the shell must load the user's config via the login mechanism to get PATH, aliases, etc. |

The `-c` flag tells the shell to execute the command string argument rather than reading from stdin or a script file.

---

## 5. getEnvironmentOverrides

```javascript
async getEnvironmentOverrides(_) {
    let w = _.includes("tmux"),   // check if command involves tmux
        O = n54(),                 // reconstruct TMUX env var
        $ = {};

    // Preserve TMUX session connection
    if (O) $.TMUX = O;

    // Sandbox temp directory overrides
    if (K) {
        let H = K;   // K = sandboxTmpDir from buildExecCommand
        if (y8() === "windows") H = GP(H);
        $.TMPDIR = H;
        $.CLAUDE_CODE_TMPDIR = H;
        $.TMPPREFIX = $P1(H, "zsh");  // zsh uses TMPPREFIX for temp files
    }

    // Additional tool-injected environment variables
    for (let [H, j] of d54()) $[H] = j;

    return $
}
```

### TMUX Handling (n54)

```javascript
function n54() {
    if (!l54 || i54 === null) return null;
    return `${l54},${i54},0`
}
```

TMUX sets the `TMUX` env var to `<socket_path>,<pid>,<window>`. Claude Code captures `l54` (socket path) and `i54` (PID) at startup and reconstructs the variable. This allows commands like `tmux send-keys` to work inside Claude Code's shell.

### Sandbox Temp Directory

When sandbox is active, all temp file operations are redirected to the sandbox's isolated tmpdir:
- `TMPDIR` - Standard Unix temp directory
- `CLAUDE_CODE_TMPDIR` - Claude-specific marker
- `TMPPREFIX` - Zsh-specific temp file prefix (zsh creates temp files at `$TMPPREFIX*`)

### Additional Variables (d54)

`d54()` returns `U54`, a `Map` that tools can populate at runtime via the closure. This is the extensibility point for injecting per-command environment variables.

---

## 6. Shell Process Spawning (HP1)

The `HP1` function (`executeCommand`) is the top-level orchestrator. It calls `buildExecCommand`, applies sandbox wrapping, spawns the process, and handles CWD recovery.

### Full Spawn Sequence (chunks.89.mjs, line 1485)

```javascript
async function HP1(A, q, K, Y) {
    let {
        timeout: z, onProgress: _, preventCwdChanges: w,
        shouldUseSandbox: O, shouldAutoBackground: $, onStdout: H
    } = Y ?? {};

    let j = z || ax9;                           // Default timeout: 1,800,000ms (30 min)
    let J = await Au9[K]();                      // Get shell provider (bash or powershell)
    let M = Math.floor(Math.random() * 65536)    // Random hex ID for CWD file
            .toString(16).padStart(4, "0");

    // Create sandbox tmpdir path (even if not used)
    let D = rx9(process.env.CLAUDE_CODE_TMPDIR || "/tmp", IN8());

    // Build the command
    let { commandString: X, cwdFilePath: P } = await J.buildExecCommand(A, {
        id: M,
        sandboxTmpDir: O ? D : void 0,
        useSandbox: O ?? false
    });

    let W = X;
    let Z = k81();   // Get current tracked CWD

    // Validate CWD still exists
    try {
        q34(Z)        // statSync
    } catch {
        let R = AA(); // fallback to initial CWD
        k(`Shell CWD "${Z}" no longer exists, recovering to "${R}"`);
        try {
            q34(R); Xt6(R); Z = R
        } catch {
            return E97(`Working directory "${Z}" no longer exists. ...`)
        }
    }

    if (q.aborted) return J38();   // Check abort signal

    let G = J.shellPath;

    // Sandbox wrapping
    if (O) {
        W = await vA.wrapWithSandbox(W, G, void 0, q);
        try {
            $1().mkdirSync(D, { mode: 448 })   // 0700 = rwx------
        } catch (R) {
            k(`Failed to create ${D} directory: ${R}`)
        }
    }

    let f = J.getSpawnArgs(W);
    let v = await J.getEnvironmentOverrides(A);

    // Output handling setup
    let N = !!H;                             // streaming mode if onStdout callback
    let V = oV("local_bash");               // output file path
    let L = new kw(V, _ ?? null, !N);       // TaskOutput tracker

    // Ensure output directory exists
    await dx9(yJ6(), { recursive: true });

    // Open output file if not streaming
    let h;
    if (!N) {
        let R = Ap6.O_NOFOLLOW ?? 0;
        h = Ux9(L.path, process.platform === "win32"
            ? "w"
            : Ap6.O_WRONLY | Ap6.O_CREAT | Ap6.O_APPEND | R)
    }

    try {
        // SPAWN THE PROCESS
        let R = lx9(G, f, {
            env: {
                ...process.env,
                SHELL: K === "bash" ? G : void 0,
                GIT_EDITOR: "true",
                CLAUDECODE: "1",
                ...v,
                ...{}   // placeholder for future overrides
            },
            cwd: Z,
            stdio: N
                ? ["pipe", "pipe", "pipe"]       // streaming: capture all
                : ["pipe", fileHandle, fileHandle], // file: redirect stdout+stderr
            detached: J.detached,   // true for bash, false for powershell
            windowsHide: true
        });

        if (h !== void 0) K34(h);   // close file handle after spawn inherits it

        let u = H91(R, q, j, L, $); // process monitor (timeout, abort, background)

        // Stream stdout if callback provided
        if (R.stdout && H) R.stdout.on("data", (g) => {
            H(typeof g === "string" ? g : g.toString())
        });

        // CWD recovery after process exits
        let I = y8() === "windows" ? tA6(P) : P;
        return u.result.then(async (g) => {
            if (O) vA.cleanupAfterCommand();  // sandbox cleanup

            // Read and apply new CWD (skip if preventCwdChanges or backgrounded)
            if (g && !w && !g.backgroundTaskId) try {
                let B = px9(I, { encoding: "utf8" }).trim();
                if (y8() === "windows") B = tA6(B);
                VO(B, Z)   // validate + update CWD
            } catch {
                d("tengu_shell_set_cwd", { success: false })
            }

            // Clean up CWD file
            try { Qx9(I) } catch {}
        }), u

    } catch (R) {
        if (h !== void 0) try { K34(h) } catch {}
        return L.clear(),
            k(`Shell exec error: ${_1(R)}`),
            J38(void 0, { code: 126, stderr: _1(R) })
    }
}
```

### Environment Variables Set on Every Spawn

| Variable | Value | Purpose |
|----------|-------|---------|
| `SHELL` | Shell path (bash only) | Convention: `$SHELL` should match the running shell |
| `GIT_EDITOR` | `"true"` | Prevents git from opening an interactive editor (e.g., during `git commit` without `-m`). `true` is the Unix command that exits 0 immediately. |
| `CLAUDECODE` | `"1"` | Marker for scripts to detect they are running inside Claude Code |
| `TMUX` | Socket,PID,0 | Preserves tmux session connection (if applicable) |
| `TMPDIR` | Sandbox tmpdir | Only when sandboxed - isolates temp files |
| `CLAUDE_CODE_TMPDIR` | Sandbox tmpdir | Only when sandboxed - Claude-specific marker |
| `TMPPREFIX` | Sandbox tmpdir + "/zsh" | Only when sandboxed - zsh temp file prefix |

### stdio Configuration

| Mode | stdin | stdout | stderr |
|------|-------|--------|--------|
| **Streaming** (`onStdout` callback) | `pipe` | `pipe` | `pipe` |
| **File output** (default) | `pipe` | file handle | file handle |

In file mode, stdout and stderr share the same file handle, interleaving output in chronological order. The file is opened with `O_NOFOLLOW` on Unix to prevent symlink attacks.

### Process Options

- **`detached: true`** (bash): The process group is separate from Node's, allowing `kill(-pid)` to terminate the entire process tree.
- **`windowsHide: true`**: Prevents a console window from flashing on Windows.

---

## 7. Sandbox Integration

When `shouldUseSandbox` is true, the assembled command string is wrapped by the platform-specific sandbox before spawning:

```javascript
if (O) {
    W = await vA.wrapWithSandbox(W, G, void 0, q);
    try {
        $1().mkdirSync(D, { mode: 448 })  // 0700 octal
    } catch (R) {
        k(`Failed to create ${D} directory: ${R}`)
    }
}
```

### Sandbox Effects

1. **Command wrapping**: `vA.wrapWithSandbox(commandString, shellPath, undefined, abortSignal)` transforms the command. On Linux this typically invokes the `linux-sandbox` binary (dispatched via `arg0`). On macOS it uses `sandbox-exec` with a profile.

2. **Isolated tmpdir**: Created with mode `0700` (owner-only access) at `$CLAUDE_CODE_TMPDIR/<session-id>`. All temp file variables (`TMPDIR`, `CLAUDE_CODE_TMPDIR`, `TMPPREFIX`) point here.

3. **CWD file path**: When sandboxed, the CWD file is written inside `sandboxTmpDir` rather than the system `/tmp`. This ensures the sandbox allows the write.

4. **Post-command cleanup**: `vA.cleanupAfterCommand()` is called after each sandboxed command completes, cleaning up sandbox-specific state.

### CWD Path Differences

| Context | CWD write path (J) | CWD read path (M) |
|---------|--------------------|--------------------|
| No sandbox | `/tmp/claude-{id}-cwd` | `/tmp/claude-{id}-cwd` |
| Sandbox | `{sandboxTmpDir}/cwd-{id}` | `{sandboxTmpDir}/cwd-{id}` |
| Windows (no sandbox) | `GP(/tmp)/claude-{id}-cwd` | `xx9(/tmp, claude-{id}-cwd)` |

The `id` is a random 4-character hex string generated per command invocation.

---

## 8. CLAUDE_CODE_SHELL_PREFIX

This environment variable allows prepending a custom prefix to the entire command chain. Applied via `M91`:

```javascript
function M91(A, q) {
    let K = A.lastIndexOf(" -");
    if (K > 0) {
        // Prefix has flags: split prefix and flags
        let Y = A.substring(0, K),       // e.g., "firejail"
            z = A.substring(K + 1);       // e.g., "--noprofile"
        return `${j4([Y])} ${z} ${j4([q])}`
    } else {
        // Simple prefix: just wrap
        return `${j4([A])} ${j4([q])}`
    }
}
```

### Behavior

The function splits the prefix at the last ` -` boundary to separate the binary path from its flags:

| `CLAUDE_CODE_SHELL_PREFIX` | Result |
|----------------------------|--------|
| `firejail` | `'firejail' '<full_command_chain>'` |
| `firejail --noprofile` | `'firejail' --noprofile '<full_command_chain>'` |
| `nsjail -Mo --chroot /` | `'nsjail' -Mo --chroot / '<full_command_chain>'` |

Flags after the last ` -` are passed unquoted (allowing shell interpretation), while the binary path and the full command are shell-quoted via `j4`.

### Cross-Shell Extglob

When `CLAUDE_CODE_SHELL_PREFIX` is set, `mx9` generates a cross-shell-compatible extglob disable:

```bash
{ shopt -u extglob || setopt NO_EXTENDED_GLOB; } >/dev/null 2>&1 || true
```

This handles the case where the prefix might change which shell actually executes the command (e.g., a sandbox might use a different shell internally).

---

## 9. Snapshot Creation (RN8)

The snapshot is created once per session, not per command. Here is the full creation flow:

```javascript
RN8 = async (A) => {
    let q = A.includes("zsh") ? "zsh" : A.includes("bash") ? "bash" : "sh";
    return new Promise(async (K) => {
        let Y = LN8(A);  // ~/.bashrc or ~/.zshrc
        let z = await uK(Y);  // check if config file exists

        let _ = Date.now();
        let w = Math.random().toString(36).substring(2, 8);
        let O = EN8(c8(), "shell-snapshots");  // ~/.claude/shell-snapshots/
        let $ = EN8(O, `snapshot-${q}-${_}-${w}.sh`);

        await kx9(O, { recursive: true });  // mkdir -p

        let H = await Ix9(A, $, z);  // generate snapshot script

        // Execute snapshot script in a login shell
        yx9(A, ["-c", "-l", H], {
            env: {
                ...process.env.CLAUDE_CODE_DONT_INHERIT_ENV ? {} : process.env,
                SHELL: A,
                GIT_EDITOR: "true",
                CLAUDECODE: "1"
            },
            timeout: 10000,      // 10 second timeout (p54)
            maxBuffer: 1048576,  // 1MB
            encoding: "utf8"
        }, async (j, J, M) => {
            if (j) {
                // Snapshot creation failed - log details, resolve undefined
                K(void 0)
            } else {
                let D = (await Ex9($)).size;
                if (D !== void 0) {
                    // Register cleanup on session exit
                    E4(async () => { await $1().unlink($) });
                    K($)  // resolve with snapshot path
                } else {
                    K(void 0)
                }
            }
        })
    })
}
```

### Snapshot Script Template (Ix9)

```javascript
async function Ix9(A, q, K) {
    let Y = LN8(A);          // config file path
    let z = Y.endsWith(".zshrc");
    let _ = K ? Sx9(Y) : (!z ? 'echo "shopt -s expand_aliases" >> "$SNAPSHOT_FILE"' : "");
    let w = await Cx9();      // rg availability + PATH + find/grep shadows

    return `SNAPSHOT_FILE=${j4([q])}
      ${K ? `source "${Y}" < /dev/null` : "# No user config file to source"}

      # First, create/clear the snapshot file
      echo "# Snapshot file" >| "$SNAPSHOT_FILE"

      # Unset all aliases to avoid conflicts with functions
      echo "# Unset all aliases to avoid conflicts with functions" >> "$SNAPSHOT_FILE"
      echo "unalias -a 2>/dev/null || true" >> "$SNAPSHOT_FILE"

      ${_}    // Functions + shell options dump

      ${w}    // rg check + find/grep shadows + PATH export

      # Validation
      if [ ! -f "$SNAPSHOT_FILE" ]; then
        echo "Error: Snapshot file was not created at $SNAPSHOT_FILE" >&2
        exit 1
      fi
    `
}
```

### Snapshot Contents (Sx9)

For **bash**:
1. Functions: Uses `declare -F` to list names, `declare -f` to dump bodies, base64-encodes each function to preserve special characters
2. Shell options: `shopt -p` for bash options, `set -o | grep "on"` for POSIX options
3. Expand aliases: Always enabled

For **zsh**:
1. Functions: Uses `typeset +f` to list names, `typeset -f` to dump bodies (no base64 needed in zsh)
2. Shell options: `setopt` to dump all enabled options
3. Filter: Completion functions (single underscore prefix like `_git`) are excluded, but double-underscore helpers (like `__pyenv_init`) are kept

### Tool Shadows (Cx9)

The snapshot includes availability checks and aliases/functions for Claude Code's bundled tools:

1. **ripgrep (`rg`)**: If `rg` is not found on PATH, adds either a function (for argv0-based dispatch) or an alias pointing to the bundled binary.

2. **find/grep shadows** (ant-native only via `hx9`): Replaces `find` with `bfs` and `grep` with `ugrep` for faster searching:

```javascript
function hx9() {
    if (!n$()) return null;  // only on ant-native builds
    let A = C14();  // path to bundled tools
    return [
        "unalias find 2>/dev/null || true",
        "unalias grep 2>/dev/null || true",
        yN8("find", "bfs", A, ["-regextype", "findutils-default"]),
        yN8("grep", "ugrep", A, ["-G", "--ignore-files", "--hidden", "-I",
            ...Rx9.map((q) => `--exclude-dir=${q}`)])
    ].join("\n")
}
```

The `yN8` function generates cross-shell wrapper functions that use `exec -a` (bash) or `ARGV0=` (zsh) to set argv[0]:

```javascript
function yN8(A, q, K, Y = []) {
    let z = j4([K]);
    let _ = Y.length > 0 ? `${Y.join(" ")} "$@"` : '"$@"';
    return [
        `function ${A} {`,
        '  if [[ -n $ZSH_VERSION ]]; then',
        `    ARGV0=${q} ${z} ${_}`,
        '  elif [[ "$OSTYPE" == "msys" ]] || ... ; then',
        `    ARGV0=${q} ${z} ${_}`,
        '  elif [[ $BASHPID != $$ ]]; then',
        `    exec -a ${q} ${z} ${_}`,       // subshell: can use exec
        '  else',
        `    (exec -a ${q} ${z} ${_})`,     // main shell: fork first
        '  fi',
        '}'
    ].join("\n")
}
```

---

## 10. CWD Recovery (VO)

After every non-background command, the CWD file is read and validated:

```javascript
function VO(A, q) {
    // Resolve relative paths against previous CWD
    let K = ix9(A) ? A : nx9(q || $1().cwd(), A);
    if (!$1().existsSync(K))
        throw Error(`Path "${K}" does not exist`);
    let Y = $1().realpathSync(K);  // resolve symlinks
    Xt6(Y);  // update global CWD tracker
    d("tengu_shell_set_cwd", { success: true });
}
```

The CWD file is then deleted (`Qx9(I)`) to avoid stale reads.

### Error Cases

| Scenario | Behavior |
|----------|----------|
| CWD file missing (command failed before `pwd -P`) | Caught by try/catch, telemetry logged, CWD unchanged |
| CWD path no longer exists | Error thrown, CWD unchanged |
| Background task | CWD update skipped (`!g.backgroundTaskId`) |
| `preventCwdChanges` flag | CWD update skipped (`!w`) |

---

## 11. Shell Selection (sx9)

Before any of this runs, Claude Code must find a suitable shell:

```javascript
async function sx9() {
    // 1. CLAUDE_CODE_SHELL override
    let A = process.env.CLAUDE_CODE_SHELL;
    if (A && (A.includes("bash") || A.includes("zsh")) && CN8(A))
        return A;

    // 2. Build candidate list based on $SHELL preference
    let q = process.env.SHELL;
    let Y = q?.includes("bash");
    let [z, _] = await Promise.all([EM("zsh"), EM("bash")]);  // which
    let w = ["/bin", "/usr/bin", "/usr/local/bin", "/opt/homebrew/bin"];

    // Prefer user's shell type, try both zsh and bash
    let $ = (Y ? ["bash", "zsh"] : ["zsh", "bash"])
        .flatMap((j) => w.map((J) => `${J}/${j}`));

    // 3. Insert which-found paths at appropriate positions
    if (Y) { if (_) $.unshift(_); if (z) $.push(z) }
    else    { if (z) $.unshift(z); if (_) $.push(_) }

    // 4. $SHELL itself gets highest priority if valid
    if (q && (q.includes("bash") || q.includes("zsh")) && CN8(q))
        $.unshift(q);

    // 5. Find first executable
    let H = $.find((j) => j && CN8(j));
    if (!H) throw Error("No suitable shell found...");
    return H
}
```

Only `bash` and `zsh` are supported. Fish, tcsh, dash, and other shells are not candidates. The preference order is: `CLAUDE_CODE_SHELL` > `$SHELL` > `which` results > hardcoded paths.

---

## 12. Timeout and Default Constants

| Constant | Value | Purpose |
|----------|-------|---------|
| `ax9` | 1,800,000 ms (30 min) | Default command timeout |
| `p54` | 10,000 ms (10 sec) | Snapshot creation timeout |
| `maxBuffer` | 1,048,576 (1 MB) | Snapshot creation stdout/stderr limit |
| Sandbox dir mode | 448 (0o700) | Owner-only read/write/execute |

---

## Summary

The command assembly pipeline transforms a user's raw command string through a carefully layered process:

1. **NUL substitution** (x54) - Windows compatibility
2. **Pipe analysis** (b54) - Determine stdin redirect strategy
3. **Eval wrapping** (I54 or B54) - Shell-safe quoting with stdin management
4. **Chain assembly** - Prepend snapshot source, hook scripts, extglob disable; append CWD capture
5. **Shell prefix** (M91) - Optional outer wrapper for custom sandboxing
6. **Sandbox wrapping** - Platform-specific isolation
7. **Process spawn** - With carefully curated environment variables and stdio config
8. **CWD recovery** - Read back the working directory after execution

Each layer handles specific edge cases (heredocs, multiline strings, pipes, backticks, control flow) with fallback paths that prioritize correctness over optimization. The snapshot system ensures consistent environment restoration without the latency of sourcing `.bashrc`/`.zshrc` on every command.
