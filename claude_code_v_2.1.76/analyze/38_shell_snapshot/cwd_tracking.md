# CWD (Current Working Directory) Tracking in Claude Code

## 1. Overview

CWD tracking is the mechanism that allows shell commands executed by the Bash tool
to change the working directory (via `cd`, `pushd`, etc.) and have that new directory
persist for subsequent commands within the same session. Without this mechanism, every
shell command would execute in the original working directory since each command spawns
a new shell process.

The implementation spans three layers:

1. **Command construction** -- appending `pwd -P >| {cwdFilePath}` to the command chain
   so the shell writes its final CWD to a temp file.
2. **CWD read-back** -- after the child process exits, Node.js reads that temp file and
   updates global state.
3. **Global CWD state** -- a singleton `v1` object (with `AsyncLocalStorage` override for
   subagents) holds the current CWD for the entire session.

Source locations:
- `chunks.89.mjs` ~lines 1309-1596 -- shell provider, `buildExecCommand`, `HP1` (the
  main execution function), and `VO` (setCwd).
- `chunks.1.mjs` ~lines 2240-2376 -- global state initialization, `OS()` (getCwdState),
  `Xt6()` (setCwdState).
- `chunks.14.mjs` ~lines 505-525 -- `k81()` (getCwd with AsyncLocalStorage), `G1()`
  (safe getCwd with fallback).
- `chunks.42.mjs` ~lines 292-341 -- `H91` (process handle constructor), `J38` (killed
  process handle), `E97` (pre-spawn error result).

---

## 2. CWD File Creation

The CWD file path is created inside `buildExecCommand` (the method on the bash shell
provider object returned by `o54()`):

```javascript
// chunks.89.mjs, line 1330-1333
let $ = ux9(),                              // get tmpDir
    j = y8() === "windows" ? GP($) : $,    // Windows: toPosixPath
    J = w.useSandbox
        ? $P1(w.sandboxTmpDir, `cwd-${w.id}`)
        : $P1(j, `claude-${w.id}-cwd`),
    M = w.useSandbox
        ? $P1(w.sandboxTmpDir, `cwd-${w.id}`)
        : xx9($, `claude-${w.id}-cwd`);
```

Two path variables are produced:

| Variable | Purpose | Sandbox path | Normal path |
|----------|---------|-------------|-------------|
| `J` | Path used inside the shell script (written to by `pwd -P`) | `{sandboxTmpDir}/cwd-{id}` | `{tmpDir}/claude-{id}-cwd` |
| `M` | Path used by Node.js to read back the CWD | `{sandboxTmpDir}/cwd-{id}` | Via `xx9()` alternate path format |

The `id` (`w.id`) is a random 4-hex-digit string generated at line 1493:
```javascript
let M = Math.floor(Math.random() * 65536).toString(16).padStart(4, "0");
```

On Windows, `GP()` (toPosixPath) translates the temp directory path for shell
consumption. On non-Windows, `xx9()` produces an alternate path format for Node.js
to read back. In sandbox mode both paths are identical since they use `sandboxTmpDir`.

The function returns both pieces:
```javascript
return {
    commandString: f,
    cwdFilePath: M     // the Node.js-readable path
}
```

---

## 3. CWD Write in Command String

The shell command chain is built up as an array of steps joined with `&&`:

```javascript
// chunks.89.mjs, lines 1338-1348
let W = [];
if (O) {                                      // O = shell snapshot path
    let v = y8() === "windows" ? GP(O) : O;
    W.push(`source ${j4([v])}`)               // source the snapshot
}
let Z = await F97();                          // session env setup
if (Z) W.push(Z);
let G = mx9(A);                              // glob settings (extglob off)
if (G) W.push(G);
W.push(`eval ${P}`);                         // the actual user command
W.push(`pwd -P >| ${J}`);                    // <-- CWD capture
let f = W.join(" && ");
```

The final command string looks like:
```
source /tmp/snapshot && session_env && shopt -u extglob 2>/dev/null || true && eval 'user command' && pwd -P >| /tmp/claude-a1b2-cwd
```

Key details about the CWD capture step:

- **`pwd -P`** resolves all symlinks and prints the physical directory path. This avoids
  storing a symlink path that could become dangling.
- **`>|`** (force-overwrite) is used instead of `>` so the write succeeds even if the
  shell has `set -o noclobber` active (which would cause `>` to fail on existing files).
- Because the steps are joined with `&&`, the CWD file is only written if all prior
  steps (including the user's command) succeed. If the user's command fails (nonzero
  exit), `pwd -P >| ...` is not reached, and the CWD is not updated.

The `eval` wrapper around the user command is produced by `I54()`. For commands containing
pipes that are not in sandbox mode, `B54()` is used instead (which handles backticks and
`$(...)` subshell expressions).

---

## 4. CWD Read After Execution

After the child process completes, the `.then()` callback reads the CWD file:

```javascript
// chunks.89.mjs, lines 1557-1573
let I = y8() === "windows" ? tA6(P) : P;     // Windows path translation
return u.result.then(async (g) => {
    if (O) vA.cleanupAfterCommand();           // sandbox cleanup
    if (g && !w && !g.backgroundTaskId) try {
        let B = px9(I, {                       // px9 = readFileSync
            encoding: "utf8"
        }).trim();
        if (y8() === "windows") B = tA6(B);   // tA6 = toPosixPath on Windows
        VO(B, Z)                               // VO = setCwd
    } catch {
        d("tengu_shell_set_cwd", {
            success: !1
        })
    }
    try {
        Qx9(I)                                // Qx9 = unlinkSync -- cleanup
    } catch {}
})
```

Three conditions gate the CWD update (`g && !w && !g.backgroundTaskId`):

| Condition | Variable | Meaning |
|-----------|----------|---------|
| `g` (truthy) | Process result | The process actually completed (not null) |
| `!w` | `preventCwdChanges` | Caller did not request CWD to be frozen |
| `!g.backgroundTaskId` | Background flag | The task was not backgrounded |

If any of these fail, the CWD file is still cleaned up (`Qx9`/unlinkSync) but the
global CWD state is not modified.

On Windows, `tA6()` translates paths from Windows format to POSIX format both for the
file path used to read the CWD file and for the CWD value read from inside it.

---

## 5. setCwd Function (VO)

The `VO` function validates and stores the new CWD:

```javascript
// chunks.89.mjs, lines 1586-1596
function VO(A, q) {
    let K = ix9(A) ? A : nx9(q || $1().cwd(), A);  // resolve relative to fallback
    if (!$1().existsSync(K))
        throw Error(`Path "${K}" does not exist`);
    let Y = $1().realpathSync(K);                   // resolve symlinks again
    Xt6(Y);                                          // setCwdState
    try {
        d("tengu_shell_set_cwd", {
            success: !0
        })
    } catch (z) {}
}
```

Step by step:

1. **Path resolution**: If the path from `pwd -P` is relative (should not happen with
   `-P` but defensive), it is resolved against the fallback `q` (which is the CWD
   the command was launched in) or `process.cwd()`.
2. **Existence check**: `existsSync(K)` verifies the directory still exists. If it was
   deleted between command completion and this callback, an error is thrown and caught
   by the caller (which logs `tengu_shell_set_cwd` with `success: false`).
3. **Symlink resolution**: `realpathSync` resolves any remaining symlinks. This is
   somewhat redundant with `pwd -P` but ensures correctness even if the filesystem
   changed.
4. **State update**: `Xt6(Y)` stores the resolved path in global state.
5. **Telemetry**: Logs success.

---

## 6. Global CWD State

CWD is stored in the global `v1` singleton object initialized by `b8A()`:

```javascript
// chunks.1.mjs, lines 2240-2263
function b8A() {
    let A = "";
    if (typeof process < "u" && typeof process.cwd === "function"
        && typeof S8A === "function")
        A = S8A(Clq()).normalize("NFC");     // realpathSync(process.cwd()).normalize("NFC")
    return {
        originalCwd: A,
        projectRoot: A,
        // ... many other fields ...
        cwd: A,
        // ...
    }
}
```

The getter and setter:

```javascript
// chunks.1.mjs, lines 2370-2376
function OS() {              // getCwdState
    return v1.cwd
}

function Xt6(A) {            // setCwdState
    v1.cwd = A.normalize("NFC")
}
```

Key properties:

- **Unicode NFC normalization** is applied on every set. This prevents mismatches on
  macOS where the filesystem may return NFD-normalized paths (e.g., accented characters
  as separate combining characters) while user input uses NFC.
- **`originalCwd`** is set once at startup and never modified. It records where the
  user launched Claude Code from and is used as a fallback.
- **`cwd`** starts equal to `originalCwd` and is updated by `Xt6` after each
  successful command that changes directory.

### AsyncLocalStorage Layer (Subagent CWD Isolation)

The raw `OS()`/`Xt6()` operates on the global `v1` object. But the actual CWD accessor
used by tools is `k81()`, which checks `AsyncLocalStorage` first:

```javascript
// chunks.14.mjs, lines 508-518
function k81() {                              // getCwd
    return UHA.getStore() ?? OS()             // AsyncLocalStorage store or global
}

function G1() {                               // safe getCwd with fallback
    try {
        return k81()
    } catch {
        return AA()                           // AA = getOriginalCwd → v1.originalCwd
    }
}
```

`UHA` is an instance of Node.js `AsyncLocalStorage` (identified via the import alias
`KOK = AsyncLocalStorage`). When a subagent runs, it calls `UHA.run(cwdValue, callback)`
to establish an isolated CWD scope. Within that async context, `k81()` returns the
subagent's CWD instead of the global one. Outside any subagent context, `UHA.getStore()`
returns `undefined` and the global `v1.cwd` is used.

The safe variant `G1()` wraps `k81()` in a try/catch, falling back to `originalCwd`
if anything goes wrong. This is used in contexts where a CWD failure should not crash
the application.

---

## 7. CWD Recovery on Missing Directory

Before spawning a command, the execution function `HP1` checks that the current CWD
still exists:

```javascript
// chunks.89.mjs, lines 1500-1511
let Z = k81();                               // current CWD
try {
    q34(Z)                                    // accessSync -- throws if missing
} catch {
    let R = AA();                             // originalCwd (home-like fallback)
    k(`Shell CWD "${Z}" no longer exists, recovering to "${R}"`);
    try {
        q34(R), Xt6(R), Z = R               // try original CWD, update state
    } catch {
        return E97(`Working directory "${Z}" no longer exists. ` +
            `Please restart Claude from an existing directory.`)
    }
}
```

The recovery logic:

1. **Check current CWD**: `q34` (accessSync) tests if the directory is accessible.
2. **If missing**: Log a warning, try to fall back to `originalCwd` (the directory
   where Claude Code was launched).
3. **If fallback also missing**: Return a pre-spawn error result (`E97`) with exit
   code 1 and an error message. The command is never spawned.
4. **If fallback works**: Update global CWD state to the fallback and proceed.

This handles the scenario where the user (or a previous command) deleted the current
working directory. Without this check, the `spawn()` call would fail with a confusing
ENOENT error.

---

## 8. Background Task CWD Skip

When a command is backgrounded (auto-backgrounded due to long runtime or explicitly),
the process result includes a `backgroundTaskId` field. The CWD update callback checks
for this:

```javascript
if (g && !w && !g.backgroundTaskId) try {
    // ... read CWD file and update ...
```

When `g.backgroundTaskId` is set, the CWD update is skipped entirely. This is
important because:

- A backgrounded task continues running asynchronously.
- Its final `pwd -P` output reflects wherever that background process ended up.
- Allowing it to update the main session's CWD would cause unpredictable directory
  changes at arbitrary times.
- The CWD file is still cleaned up regardless.

The killed-process handle (`J38`/`k97`) also carries `backgroundTaskId`:

```javascript
// chunks.42.mjs, lines 296-308
class k97 {
    status = "killed";
    result;
    constructor(A) {
        this.taskOutput = new kw(oV("local_bash"), null);
        this.result = Promise.resolve({
            code: A?.code ?? 145,
            stdout: "",
            stderr: A?.stderr ?? "Command aborted before execution",
            interrupted: !0,
            backgroundTaskId: A?.backgroundTaskId
        })
    }
}
```

---

## 9. Sandbox CWD Handling

In sandbox mode, the CWD file path uses `sandboxTmpDir` instead of the regular system
temp directory:

```javascript
J = w.useSandbox
    ? $P1(w.sandboxTmpDir, `cwd-${w.id}`)     // sandbox path
    : $P1(j, `claude-${w.id}-cwd`),            // normal path
```

The sandbox temp directory is created with restricted permissions (mode `448` = `0700`,
owner-only rwx):

```javascript
// chunks.89.mjs, lines 1517-1522
if (O) {
    W = await vA.wrapWithSandbox(W, G, void 0, q);
    try {
        $1().mkdirSync(D, {
            mode: 448                          // 0o700
        })
    } catch (R) {
        k(`Failed to create ${D} directory: ${R}`)
    }
}
```

The sandbox directory path `D` is constructed from the system temp directory plus a
unique session identifier:

```javascript
let D = rx9(process.env.CLAUDE_CODE_TMPDIR || "/tmp", IN8());
```

This isolation means:
- The sandboxed command can only write its CWD to the sandboxed temp directory.
- The CWD file is inside the sandbox boundary.
- After execution, `vA.cleanupAfterCommand()` handles sandbox cleanup.
- The Node.js side reads the CWD file from the same sandbox path (since `M` equals `J`
  in sandbox mode).

---

## 10. Windows Path Translation

On Windows, paths go through translation at two points:

**Temp directory for shell script** (line 1331):
```javascript
let j = y8() === "windows" ? GP($) : $;
```
`GP()` converts Windows paths to POSIX format for the shell (e.g., `C:\Users\...` to
`/c/Users/...`).

**CWD file path for Node.js read** (line 1557):
```javascript
let I = y8() === "windows" ? tA6(P) : P;
```
`tA6()` translates the CWD file path for Node.js consumption.

**CWD value read from file** (line 1564):
```javascript
if (y8() === "windows") B = tA6(B);
```
The CWD value written by the shell (which may be in POSIX format from MSYS/Git Bash)
is translated back to a format Node.js understands.

---

## 11. PowerShell CWD Handling

On Windows with PowerShell, a different shell provider (`s54`) handles CWD:

```javascript
// chunks.89.mjs, lines 1390-1413
function s54(A) {
    return {
        type: "powershell",
        shellPath: A,
        detached: !1,
        async buildExecCommand(q, K) {
            let Y = Bx9(gx9(), `claude-pwd-ps-${K.id}`);
            let _ = `
; $_ec = if (!$?) { if ($LASTEXITCODE) { $LASTEXITCODE } else { 1 } } else { 0 }
; (Get-Location).Path | Out-File -FilePath '${Y.replace(/'/g,"''")}' -Encoding utf8 -NoNewline
; exit $_ec`;
            return {
                commandString: q + _,
                cwdFilePath: Y
            }
        },
        getSpawnArgs(q) {
            return ["-NoProfile", "-NonInteractive", "-Command", q]
        },
        async getEnvironmentOverrides() {
            return {}
        }
    }
}
```

Differences from bash/zsh:

| Aspect | Bash/Zsh | PowerShell |
|--------|----------|------------|
| CWD capture | `pwd -P >| {path}` | `(Get-Location).Path \| Out-File ...` |
| File naming | `claude-{id}-cwd` | `claude-pwd-ps-{id}` |
| Snapshot sourcing | `source {snapshot}` | None (no snapshot system) |
| Glob settings | `shopt -u extglob` / `setopt NO_EXTENDED_GLOB` | None |
| Detached | Yes | No |
| Error preservation | Implicit (via `&&` chain) | Explicit `$_ec` capture |

PowerShell appends the CWD write directly to the command string (no `&&` chaining),
preserving the original exit code in `$_ec` and restoring it after writing the CWD
file. This ensures the exit code of the user's command is what gets reported, not the
exit code of `Out-File`.

---

## 12. Shell Environment Prefix

The `CLAUDE_CODE_SHELL_PREFIX` environment variable allows wrapping the entire command
chain with a custom shell prefix:

```javascript
// chunks.89.mjs, line 1349
if (process.env.CLAUDE_CODE_SHELL_PREFIX)
    f = M91(process.env.CLAUDE_CODE_SHELL_PREFIX, f);
```

`M91` splits the prefix at its last ` -` to separate the command from flags:

```javascript
// chunks.42.mjs, lines 583-590
function M91(A, q) {
    let K = A.lastIndexOf(" -");
    if (K > 0) {
        let Y = A.substring(0, K),
            z = A.substring(K + 1);
        return `${j4([Y])} ${z} ${j4([q])}`
    } else return `${j4([A])} ${j4([q])}`
}
```

This is used for scenarios like running commands through `nix-shell`, `docker exec`, or
other wrappers. The CWD capture (`pwd -P >| ...`) is part of the wrapped command string,
so it still works correctly inside the prefix environment.

---

## 13. Glob Disabling

Before executing the user's command, glob expansion is disabled to prevent the shell
from expanding patterns in the command string:

```javascript
// chunks.89.mjs, lines 1302-1307
function mx9(A) {
    if (process.env.CLAUDE_CODE_SHELL_PREFIX)
        return "{ shopt -u extglob || setopt NO_EXTENDED_GLOB; } >/dev/null 2>&1 || true";
    if (A.includes("bash"))
        return "shopt -u extglob 2>/dev/null || true";
    else if (A.includes("zsh"))
        return "setopt NO_EXTENDED_GLOB 2>/dev/null || true";
    return null
}
```

This step is inserted into the `&&` chain before the `eval` of the user command, so
it executes in the same shell session. It does not directly affect CWD tracking but
is part of the command chain that precedes the `pwd -P >| ...` step.

---

## 14. Timeout and Default Configuration

The default command timeout is 30 minutes:

```javascript
// chunks.89.mjs, line 1598
ax9 = 1800000   // 30 minutes in milliseconds
```

The timeout is used at line 1493:
```javascript
let j = z || ax9;   // z = caller-provided timeout, ax9 = default 1800000
```

If a command times out, the process is killed and the CWD file may not have been written
(since the `pwd -P` step only runs after the command succeeds). In this case, the CWD
read-back will fail silently (caught by the `catch` block) and the CWD remains unchanged.

---

## 15. Summary of the Complete Flow

```
1. HP1() called with command string
   |
2. Check CWD exists (q34/accessSync) → recover to originalCwd if missing
   |
3. buildExecCommand() builds the chain:
   source snapshot && env_setup && glob_off && eval 'command' && pwd -P >| /tmp/cwd-file
   |
4. Optional: wrap with sandbox (vA.wrapWithSandbox)
   Optional: wrap with CLAUDE_CODE_SHELL_PREFIX (M91)
   |
5. spawn() child process with CWD set to current k81() value
   |
6. Child exits → .then() callback:
   a. Skip CWD update if: preventCwdChanges || backgroundTaskId
   b. readFileSync(cwdFilePath) → trim
   c. Windows: toPosixPath translation
   d. VO(newCwd, fallbackCwd):
      - resolve path if relative
      - existsSync check
      - realpathSync (resolve symlinks)
      - Xt6(resolved) → v1.cwd = resolved.normalize("NFC")
   e. Cleanup: unlinkSync(cwdFilePath)
   |
7. Next command reads k81() → UHA.getStore() ?? v1.cwd → uses updated CWD
```

The design is careful about edge cases: deleted directories, symlinks, Unicode
normalization, backgrounded tasks, sandboxed environments, Windows path formats, and
shell-specific CWD retrieval commands. The `AsyncLocalStorage` layer ensures subagents
get isolated CWD tracking without interfering with the main session.
