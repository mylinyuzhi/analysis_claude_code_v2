# Background Task Management - Deep Analysis (Claude Code 2.1.76)

## 1. Overview

Background tasks allow long-running shell commands to continue executing while the user
continues interacting with Claude. When a command exceeds its timeout, it can be
transitioned to background mode rather than being killed. The system is built around
three main classes:

- **`j38` (ProcessHandler)** - Manages a single child process lifecycle with timeout,
  background, and kill capabilities.
- **`kw` (TaskOutput)** - Handles output buffering with in-memory and file-backed
  storage, plus polling support for background tasks.
- **`H38` (StreamHandler)** - Wires `stdout`/`stderr` streams from the child process
  into `TaskOutput`.

The background task registry (in `chunks.133.mjs`) tracks all running/backgrounded
tasks in an application-wide state object, enabling the TUI to display progress and
deliver completion notifications.

## 2. ProcessHandler Class (j38) - chunks.42.mjs line 195

The `j38` class is the central process lifecycle manager. It wraps a Node.js
`ChildProcess` and governs state transitions between `running`, `backgrounded`,
`completed`, and `killed`.

### Private Fields

```javascript
class j38 {
    #A = "running";     // state: "running" | "backgrounded" | "completed" | "killed"
    #q;                 // backgroundTaskId (string, set when backgrounded)
    #K;                 // stdoutHandler (H38 instance)
    #z;                 // stderrHandler (H38 instance)
    #Y;                 // childProcess (Node.js ChildProcess)
    #w = null;          // timeoutHandle (from setTimeout)
    #_;                 // abortSignal (AbortSignal)
    #$;                 // onTimeoutCallback (set by caller for auto-background)
    #H;                 // timeoutMs (timeout duration)
    #j;                 // autoBackground flag (boolean)
    #O = null;          // resultResolve (resolves the outer result Promise)
    #J = null;          // exitCodeResolve (resolves the inner exit code Promise)
    #M = null;          // abortHandler (bound reference for cleanup)
    taskOutput;         // kw instance (TaskOutput)
}
```

### Constructor

```javascript
// Source: chunks.42.mjs line 216
constructor(A, q, K, Y, z = !1) {
    if (this.#Y = A,            // childProcess
        this.#_ = q,            // abortSignal
        this.#H = K,            // timeoutMs
        this.#j = z,            // autoBackground
        this.taskOutput = Y,    // kw instance
        this.#z = A.stderr ? new H38(A.stderr, Y, !0) : null,   // stderr handler
        this.#K = A.stdout ? new H38(A.stdout, Y, !1) : null,   // stdout handler
        z) this.onTimeout = (_) => {
        this.#$ = _             // store the timeout callback for later invocation
    };
    this.result = this.#T()     // initialize the result promise chain
}
```

The constructor wires up `stdout`/`stderr` via `H38` stream handlers, and if
`autoBackground` is true, exposes an `onTimeout` setter that the caller uses to
register their background transition callback.

### Initialization (#T method)

```javascript
// Source: chunks.42.mjs line 245
#T() {
    this.#M = this.#X.bind(this),
    this.#_.addEventListener("abort", this.#M, { once: !0 }),
    this.#Y.once("exit", this.#G.bind(this)),
    this.#Y.once("error", this.#P.bind(this)),
    this.#w = setTimeout(j38.#W, this.#H, this);

    let A = new Promise((q) => { this.#J = q });   // inner: resolves with exit code
    return new Promise((q) => {
        this.#O = q,                                 // outer: resolves with full result
        A.then(this.#N.bind(this))                   // chain: exit code -> build result
    })
}
```

This sets up a two-promise chain:
1. **Inner promise** resolves with the raw exit code (via `#J`).
2. **Outer promise** resolves with the full result object (via `#O`), constructed in
   the `#N` handler after the exit code is known.

Three event sources feed the inner promise:
- **`exit` event** on the child process (`#G`): converts exit code or signal to numeric code.
- **`error` event** on the child process (`#P`): resolves with code 1.
- **`abort` event** on the abort signal (`#X`): triggers `kill()`.

The timeout is started immediately via `setTimeout(j38.#W, this.#H, this)`.

## 3. State Transitions

### State Diagram

```
                    ┌──────────────────────────────────────────────┐
                    │                                              │
              ┌─────▼─────┐   timeout + autoBackground   ┌────────┴──────┐
  spawn ─────►│  running   ├─────────────────────────────►│  backgrounded  │
              └─────┬──┬───┘                              └────────┬──────┘
                    │  │                                           │
          timeout   │  │  exit/error                     exit/error│
     (no autoBack)  │  │                                           │
                    │  │  ┌───────────┐                  ┌─────────▼──────┐
                    │  └──►completed  │◄─────────────────┤   completed     │
                    │     └───────────┘                  └────────────────┘
                    │
                    │  abort / kill()
                    │     ┌───────────┐
                    └─────►  killed   │
                          └───────────┘
```

### Timeout Handler (static #W)

```javascript
// Source: chunks.42.mjs line 210
static #W(A) {
    if (A.#j && A.#$)     // autoBackground enabled AND callback registered
        A.#$(A.background.bind(A));  // invoke callback, passing background() method
    else
        A.#k(N97)         // kill with TIMEOUT exit code (143)
}
```

When the timeout fires, the static `#W` method checks two conditions:
1. `#j` (autoBackground flag) must be `true`.
2. `#$` (onTimeout callback) must have been registered by the caller.

If both are true, it calls the callback with `background()` bound to this instance,
letting the caller decide when to invoke it. If either condition is false, it kills the
process with exit code `N97 = 143` (the timeout exit code).

### background(taskId) Method

```javascript
// Source: chunks.42.mjs line 280
background(A) {
    if (this.#A === "running") {
        if (this.#q = A,                      // store the background task ID
            this.#A = "backgrounded",          // transition state
            this.#f(),                         // clear timeout timer and abort listener
            !this.taskOutput.stdoutToFile)      // if not already file-backed...
            this.taskOutput.spillToDisk();      // ...spill buffered output to disk
        return !0                              // success
    }
    return !1                                  // already not running, cannot background
}
```

Key behaviors:
- Only transitions from `"running"` state; returns `false` otherwise.
- Calls `#f()` to clean up the timeout timer and abort signal listener, since a
  backgrounded process should no longer be subject to either.
- If the `TaskOutput` is not already in file-backed mode (`stdoutToFile`), it calls
  `spillToDisk()` to flush the in-memory buffer to a file. This is critical because
  backgrounded tasks may produce far more output than the in-memory buffer can hold.
- The `taskId` becomes the `backgroundTaskId` included in the final result.

### kill() and #k() Methods

```javascript
// Source: chunks.42.mjs line 273
#k(A) {
    if (this.#A = "killed",             // transition to killed
        this.#Y.pid)                     // if process has a PID
        V97.default(this.#Y.pid, "SIGKILL");  // tree-kill entire process group
    this.#Z(A ?? v97)                    // resolve exit code (default: 137 = SIGKILL)
}

kill() {
    this.#k()                            // public wrapper, no custom exit code
}
```

The `#k` method uses `treekill` (the `V97` import) to send `SIGKILL` to the entire
process tree, not just the direct child. This ensures any subprocesses spawned by the
command are also terminated. The exit code defaults to `v97 = 137` (128 + 9 = SIGKILL),
matching Unix conventions.

### Exit Code Constants

```javascript
// Source: chunks.42.mjs line 345-347
v97 = 137   // INTERRUPT/SIGKILL exit code (128 + 9)
N97 = 143   // TIMEOUT exit code (128 + 15, i.e., SIGTERM-equivalent)
```

### Abort Signal Handler (#X)

```javascript
// Source: chunks.42.mjs line 225
#X() {
    if (this.#_.reason === "interrupt") return;   // skip kill on user interrupt
    this.kill()
}
```

When the `AbortSignal` fires, the handler checks if the abort reason is `"interrupt"`.
If so, it does nothing -- the process will terminate naturally from the interrupt signal
propagation. Otherwise, it calls `kill()` to forcefully terminate the process.

### Process Exit Handler (#G)

```javascript
// Source: chunks.42.mjs line 229
#G(A, q) {
    let K = A !== null && A !== void 0
        ? A                                // use exit code if available
        : q === "SIGTERM" ? 144 : 1;       // signal: SIGTERM=144, other=1
    this.#Z(K)                              // resolve exit code promise
}
```

This translates the Node.js `exit` event (which provides either an exit code or a
signal name) into a numeric code, then resolves the inner exit code promise.

### Exit Code Resolver (#Z)

```javascript
// Source: chunks.42.mjs line 236
#Z(A) {
    if (this.#J) this.#J(A), this.#J = null
}
```

A one-shot resolver that feeds the exit code to the promise chain. Setting `#J = null`
after invocation prevents double-resolution.

### Result Builder (#N) - The onExit Handler

```javascript
// Source: chunks.42.mjs line 256
async #N(A) {
    if (this.#f(),                              // cleanup timeout + abort listener
        this.#A === "running" || this.#A === "backgrounded")
        this.#A = "completed";                  // transition to completed

    let q = await this.taskOutput.getStdout(),  // may read from disk (async)
        K = {
            code: A,
            stdout: q,
            stderr: this.taskOutput.getStderr(),
            interrupted: A === v97,              // true if killed by signal (137)
            backgroundTaskId: this.#q            // undefined if not backgrounded
        };

    // Handle file-backed output for non-backgrounded tasks
    if (this.taskOutput.stdoutToFile && !this.#q)
        if (this.taskOutput.outputFileRedundant)
            this.taskOutput.deleteOutputFile();  // small output: cleanup file
        else
            K.outputFilePath = this.taskOutput.path,
            K.outputFileSize = this.taskOutput.outputFileSize,
            K.outputTaskId = this.taskOutput.taskId;

    // Append timeout message to stderr
    if (A === N97)                               // exit code 143 = timeout
        K.stderr = [`Command timed out after ${UK(this.#H)}`, K.stderr]
            .filter(Boolean).join(" ");

    let Y = this.#O;
    if (Y) this.#O = null, Y(K)                 // resolve the outer result promise
}
```

This is the final handler that constructs the result object. Notable details:
- For file-backed output (`stdoutToFile`), if the output is small enough that
  `outputFileRedundant` is true, the file is deleted to avoid orphan files.
- For backgrounded tasks (`#q` is set), the file cleanup is skipped because the
  background task registry manages the file.
- The timeout message is injected into `stderr` only for the timeout exit code (143).

### Cleanup

```javascript
// Source: chunks.42.mjs line 287
cleanup() {
    this.#K?.cleanup(),        // stdout stream handler
    this.#z?.cleanup(),        // stderr stream handler
    this.taskOutput.clear(),   // clear all output buffers
    this.#f(),                 // clear timeout + abort listener
    this.#Y = null,            // release child process reference
    this.#_ = null,            // release abort signal reference
    this.#$ = void 0           // release timeout callback
}
```

### Timer/Listener Cleanup (#f)

```javascript
// Source: chunks.42.mjs line 239
#f() {
    let A = this.#w;
    if (A) clearTimeout(A), this.#w = null;   // clear timeout timer
    let q = this.#M;
    if (q) this.#_.removeEventListener("abort", q), this.#M = null  // remove abort listener
}
```

## 4. StreamHandler Class (H38) - chunks.42.mjs line 175

The `H38` class is a lightweight adapter between Node.js readable streams and the
`TaskOutput` (`kw`) class.

```javascript
// Source: chunks.42.mjs line 175
class H38 {
    #A;                                      // stream reference
    #q = !1;                                 // cleaned up flag
    #K;                                      // taskOutput reference
    #z;                                      // isStderr flag
    #Y = this.#w.bind(this);                 // bound data handler

    constructor(A, q, K) {
        this.#A = A,                         // stream
        this.#K = q,                         // taskOutput (kw)
        this.#z = K,                         // isStderr boolean
        A.setEncoding("utf-8"),              // always decode as UTF-8
        A.on("data", this.#Y)               // start receiving data
    }

    #w(A) {                                  // data handler
        let q = typeof A === "string" ? A : A.toString();
        if (this.#z) this.#K.writeStderr(q);
        else this.#K.writeStdout(q)
    }

    cleanup() {
        if (this.#q) return;                 // idempotent
        this.#q = !0,
        this.#A.removeListener("data", this.#Y),
        this.#A = null,
        this.#K = null,
        this.#Y = () => {}                   // replace with no-op
    }
}
```

The stream handler converts all chunks to strings (guarding against Buffer objects)
and routes them to the appropriate `TaskOutput` method. The `cleanup()` is idempotent
via the `#q` flag, preventing double-removal of listeners.

## 5. TaskOutput Class (kw) - chunks.42.mjs line 8

The `kw` class is the most complex component, managing output in three modes:

1. **In-memory mode** (default): Buffers stdout in `#A` and stderr in `#q` as strings.
2. **Overflow/spill mode**: When combined output exceeds `#_` bytes (default `y$3`),
   spills to disk via a `Y91` file writer.
3. **File-backed mode** (`stdoutToFile = true`): Output is directed to a file from the
   start, used for commands with redirected output.

### Fields

```javascript
// Source: chunks.42.mjs line 8
class kw {
    taskId;                     // unique task identifier
    path;                       // output file path: g2(taskId) => `<sessionDir>/<taskId>.output`
    stdoutToFile;               // boolean: direct-to-file mode
    #A = "";                    // in-memory stdout buffer
    #q = "";                    // in-memory stderr buffer
    #K = null;                  // Y91 file writer (set when spilled)
    #z = new nC6(1000);         // ring buffer for recent lines (capacity 1000)
    #Y = 0;                     // total line count
    #w = 0;                     // total byte count
    #_;                         // max in-memory size threshold
    #$;                         // polling callback (for TUI progress updates)
    #H = !1;                    // outputFileRedundant flag
    #j = 0;                     // output file size
    static #O = new Map;        // global map: taskId -> kw instance (for polling)
    static #J = new Map;        // active polling set: taskId -> kw instance
    static #M = null;           // polling interval handle
}
```

### Write Path (#X)

```javascript
// Source: chunks.42.mjs line 66
#X(A, q) {                      // A=chunk, q=isStderr
    if (this.#w += A.length,     // track total bytes
        this.#G(A),              // update ring buffer + notify via polling callback
        this.#K) {               // already spilled to disk?
        this.#K.append(q ? `[stderr] ${A}` : A);
        return
    }
    if (this.#A.length + this.#q.length + A.length > this.#_) {
        this.#P(q ? A : null, q ? null : A);  // spill to disk
        return
    }
    if (q) this.#q += A;        // append to in-memory stderr
    else this.#A += A            // append to in-memory stdout
}
```

The write path has three branches:
1. If already spilled (`#K` exists), append directly to the file writer.
2. If adding this chunk would exceed the threshold, trigger spillToDisk via `#P`.
3. Otherwise, append to the in-memory string buffer.

### Ring Buffer for Recent Lines (#G)

```javascript
// Source: chunks.42.mjs line 78
#G(A) {
    let Y = 0, z = [], _ = 0, w = A.length;
    while (w > 0) {
        let O = A.lastIndexOf("\n", w - 1);
        if (O === -1) break;
        if (Y++, z.length < 100 && _ < 4096) {
            let $ = w - O - 1;
            if ($ > 0 && $ <= 4096 - _) {
                let H = A.slice(O + 1, w);
                if (H.trim()) z.push(Buffer.from(H).toString()), _ += $
            }
        }
        w = O
    }
    this.#Y += Y;                                  // total line count
    for (let O = z.length - 1; O >= 0; O--)        // add lines to ring buffer
        this.#z.add(z[O]);
    if (this.#$ && z.length > 0) {                  // if polling callback registered
        let O = this.#z.getRecent(5);               // get last 5 lines
        this.#$(
            w91(O, "\n"),                            // short recent text (5 lines)
            w91(this.#z.getRecent(100), "\n"),       // full recent text (100 lines)
            this.#Y,                                 // total line count
            this.#w,                                 // total byte count
            this.#K !== null                         // isOverflowed flag
        )
    }
}
```

This method maintains a `nC6` ring buffer (capacity 1000 lines) of recent output lines.
It scans each chunk backwards for newlines, extracts up to 100 lines per chunk (with a
4096-byte cap), and adds them to the ring buffer. If a polling callback is registered
(for TUI progress display), it is invoked with the 5 most recent lines, 100 most recent
lines, line count, byte count, and overflow status.

### Spill to Disk (#P)

```javascript
// Source: chunks.42.mjs line 105
#P(A, q) {
    if (this.#K = new Y91(this.taskId),   // create file writer
        this.#A)                           // flush existing stdout buffer
        this.#K.append(this.#A), this.#A = "";
    if (this.#q)                           // flush existing stderr buffer
        this.#K.append(`[stderr] ${this.#q}`), this.#q = "";
    if (q) this.#K.append(q);             // append triggering stdout chunk
    if (A) this.#K.append(`[stderr] ${A}`) // append triggering stderr chunk
}
```

When the in-memory threshold is exceeded, all buffered content is flushed to a `Y91`
file writer. Stderr content is prefixed with `[stderr]` in the file to distinguish it.

### getStdout() - Reading Output

```javascript
// Source: chunks.42.mjs line 111
async getStdout() {
    if (this.stdoutToFile) return this.#Z();        // read from file
    if (this.#K) {                                   // spilled to disk
        let A = this.#z.getRecent(5),                // last 5 lines from ring buffer
            q = w91(A, "\n"),
            Y = `\nOutput truncated (${Math.round(this.#w/1024)}KB total). ` +
                `Full output saved to: ${this.path}`;
        return q ? q + Y : Y.trimStart()
    }
    return this.#A                                   // in-memory: return buffer directly
}
```

Three paths for reading:
1. **File-backed mode**: Reads directly from the output file via `#Z()`.
2. **Spilled mode**: Returns the last 5 lines from the ring buffer plus a truncation
   message pointing to the full output file.
3. **In-memory mode**: Returns the string buffer directly.

### Static Polling Infrastructure

```javascript
// Source: chunks.42.mjs line 28-58
static startPolling(A) {
    let q = kw.#O.get(A);
    if (!q || !q.#$) return;
    if (kw.#J.set(A, q),
        !kw.#M)
        kw.#M = setInterval(kw.#W, L$3),   // L$3 = polling interval
        kw.#M.unref()                        // don't keep event loop alive
}

static stopPolling(A) {
    if (kw.#J.delete(A),
        kw.#J.size === 0 && kw.#M)
        clearInterval(kw.#M), kw.#M = null
}

static #W() {
    for (let [, A] of kw.#J) {
        if (!A.#$) continue;
        ow6(A.path, R$3).then(({ content: q, bytesRead: K, bytesTotal: Y }) => {
            if (!A.#$) return;
            if (!q) { A.#$(""  , "", 0, Y, !1); return }
            // Extract last 5 and last 100 lines from file content
            // Invoke callback with parsed output
            A.#w = Y,
            A.#$(q.slice(_), q.slice(O), w, Y, K < Y)
        }, () => {})
    }
}
```

The polling system uses a single shared `setInterval` (with `.unref()` so it does not
prevent process exit) to periodically read output files for all active background tasks.
Each tick reads the file via `ow6()` (a tail-read utility), parses the last few lines,
and delivers them to the polling callback for TUI rendering. Polling starts when a task
becomes visible in the TUI and stops when the task completes.

## 6. File Writer (Y91) - chunks.41.mjs line 2252

The `Y91` class provides asynchronous, batched file appending. It accumulates chunks
in an array and flushes them to disk in a single write operation.

```javascript
// Source: chunks.41.mjs line 2252
class Y91 {
    #A;               // file path
    #q = null;        // file handle (fs.FileHandle)
    #K = [];          // pending chunks (string[])
    #z = null;        // flush promise
    #Y = null;        // flush resolve

    constructor(A) {
        this.#A = g2(A)    // path: <sessionDir>/<taskId>.output
    }

    append(A) {
        if (this.#K.push(A),
            !this.#z)
            this.#z = new Promise((q) => { this.#Y = q }),
            this.#H()       // start write loop
    }

    flush() { return this.#z ?? Promise.resolve() }
    cancel() { this.#K.length = 0 }
}
```

The write loop (`#w`) opens the file with `O_WRONLY | O_APPEND | O_CREAT` flags, drains
the pending chunk queue by concatenating chunks into a single `Buffer` (`#$`), writes
via `appendFile`, and continues until the queue is empty. The file handle is closed after
each drain cycle. This batching strategy minimizes system calls under high-throughput
output.

## 7. Ring Buffer (nC6) - chunks.41.mjs line 2447

A fixed-capacity circular buffer used to retain the most recent output lines:

```javascript
// Source: chunks.41.mjs line 2447
class nC6 {
    capacity;
    buffer;
    head = 0;
    size = 0;

    constructor(A) {
        this.capacity = A;
        this.buffer = Array(A)
    }

    add(A) {
        this.buffer[this.head] = A,
        this.head = (this.head + 1) % this.capacity,
        if (this.size < this.capacity) this.size++
    }

    getRecent(A) {
        let q = [],
            K = this.size < this.capacity ? 0 : this.head,
            Y = Math.min(A, this.size);
        for (let z = 0; z < Y; z++) {
            let _ = (K + this.size - Y + z) % this.capacity;
            q.push(this.buffer[_])
        }
        return q
    }
}
```

The `TaskOutput` uses a ring buffer of capacity 1000 to keep the most recent output
lines. This allows the TUI to display a tail of output even for very large outputs
without holding the entire output in memory.

## 8. Factory Function (H91) and Pre-Built Handlers

### H91 - Normal Process Handler Factory

```javascript
// Source: chunks.42.mjs line 292
function H91(A, q, K, Y, z = !1) {
    return new j38(A, q, K, Y, z)
}
```

Simple factory that creates a `j38` instance with the given child process, abort signal,
timeout, task output, and optional auto-background flag.

### k97 - KilledResult (Pre-Spawn Abort)

```javascript
// Source: chunks.42.mjs line 296
class k97 {
    status = "killed";
    result;
    taskOutput;

    constructor(A) {
        this.taskOutput = new kw(oV("local_bash"), null),
        this.result = Promise.resolve({
            code: A?.code ?? 145,
            stdout: "",
            stderr: A?.stderr ?? "Command aborted before execution",
            interrupted: !0,
            backgroundTaskId: A?.backgroundTaskId
        })
    }
    background() { return !1 }
    kill() {}
    cleanup() {}
}
```

Used when a process is killed before it even starts (e.g., abort signal fires during
spawn). It implements the same interface as `j38` but with no-op methods and an
immediately-resolved result promise.

### J38 - Killed With Background ID

```javascript
// Source: chunks.42.mjs line 316
function J38(A, q) {
    return new k97({ backgroundTaskId: A, ...q })
}
```

Creates a `k97` instance that carries a `backgroundTaskId`, used when a backgrounded
task is aborted.

### E97 - Pre-Spawn Error

```javascript
// Source: chunks.42.mjs line 323
function E97(A) {
    let q = new kw(oV("local_bash"), null);
    return {
        status: "completed",
        result: Promise.resolve({
            code: 1,
            stdout: "",
            stderr: A,                // error message
            interrupted: !1,
            preSpawnError: A
        }),
        taskOutput: q,
        background() { return !1 },
        kill() {},
        cleanup() {}
    }
}
```

Returns a duck-typed handler for commands that fail before spawning (e.g., invalid shell
path). The `preSpawnError` field distinguishes these from normal failures.

## 9. Integration with Shell Executor (chunks.89.mjs)

The shell executor in `chunks.89.mjs` creates the process handler and wires up CWD
tracking:

```javascript
// Source: chunks.89.mjs line 1553
let u = H91(R, q, j, L, $);  // R=childProcess, q=abortSignal, j=timeout, L=taskOutput, $=autoBackground

if (R.stdout && H)
    R.stdout.on("data", (g) => { H(typeof g === "string" ? g : g.toString()) });

let I = y8() === "windows" ? tA6(P) : P;
return u.result.then(async (g) => {
    if (O) vA.cleanupAfterCommand();
    if (g && !w && !g.backgroundTaskId)  // only update CWD if NOT backgrounded
        try {
            let B = px9(I, { encoding: "utf8" }).trim();
            if (y8() === "windows") B = tA6(B);
            VO(B, Z)                      // update current working directory
        } catch {
            d("tengu_shell_set_cwd", { success: !1 })
        }
    try { Qx9(I) } catch {}              // cleanup CWD tracking file
}), u
```

The critical detail here: CWD is NOT updated for backgrounded tasks
(`!g.backgroundTaskId` check). This prevents a still-running background command from
changing the working directory of the main session.

## 10. Background Task Registry (chunks.133.mjs)

### Task Registration (Ol4)

```javascript
// Source: chunks.133.mjs line 2370
function Ol4(A, q, K) {
    let { command: Y, description: z, shellCommand: _, agentId: w } = A,
        O = _.taskOutput.taskId,
        $ = E4(async () => { wQ6(O, q) }),   // cleanup callback
        H = {
            ...RG(O, "local_bash", z, K),     // base task fields (id, status, timestamps)
            type: "local_bash",
            status: "running",
            command: Y,
            completionStatusSentInAttachment: !1,
            shellCommand: _,                    // reference to j38 instance
            unregisterCleanup: $,
            lastReportedTotalLines: 0,
            isBackgrounded: !1,
            agentId: w
        };
    return Zf(H, q), O    // register in global state, return task ID
}
```

### Background Transition (Hl4)

```javascript
// Source: chunks.133.mjs line 2464
function Hl4(A, q, K, Y, z) {
    if (!q.background(A)) return !1;   // call j38.background(taskId)
    return Y((_) => {                   // update app state
        let w = _.tasks[A];
        if (!Gf(w) || w.isBackgrounded) return _;
        return { ..._, tasks: { ..._.tasks, [A]: { ...w, isBackgrounded: !0 } } }
    }),
    q.result.then(async (_) => {       // when process eventually completes...
        await q.taskOutput.flush(),
        q.cleanup();
        let w = !1, O;
        i9(A, Y, (H) => {
            if (H.status === "killed") return w = !0, H;
            return O = H.unregisterCleanup, {
                ...H,
                status: _.code === 0 ? "completed" : "failed",
                result: { code: _.code, interrupted: _.interrupted },
                shellCommand: null,
                unregisterCleanup: void 0,
                endTime: Date.now()
            }
        }), O?.();
        let $ = w ? "killed" : _.code === 0 ? "completed" : "failed";
        GN1(A, K, $, _.code, Y, z), $O(A)   // notify user + flush file writer
    }), !0
}
```

This function orchestrates the full background transition:
1. Calls `j38.background(taskId)` to transition the process handler state.
2. Updates the global app state to mark the task as `isBackgrounded: true`.
3. Attaches a `.then()` handler on the result promise to:
   - Flush remaining output and clean up the process handler.
   - Update the task status to `completed`/`failed`/`killed`.
   - Invoke the cleanup callback.
   - Send a notification to the user via `GN1`.

### Completion Notification (GN1)

```javascript
// Source: chunks.133.mjs line 2327
function GN1(A, q, K, Y, z, _, w = "bash") {
    let O = !1;
    i9(A, z, (M) => {
        if (M.notified) return M;
        return O = !0, { ...M, notified: !0 }
    });
    if (!O) return;    // already notified, skip

    switch (K) {
        case "completed":
            $ = `Background command "${q}" completed` +
                (Y !== void 0 ? ` (exit code ${Y})` : "");
            break;
        case "failed":
            $ = `Background command "${q}" failed` +
                (Y !== void 0 ? ` with exit code ${Y}` : "");
            break;
        case "killed":
            $ = `Background command "${q}" was stopped`;
            break;
    }
    // Construct XML notification with task ID, output path, status
    // Inject as system message: "Read the output file to retrieve the result: <path>"
    w0({ value: J, mode: "task-notification", priority: "later" })
}
```

The notification is injected as a system message into the conversation, instructing the
model to read the output file to get the command result.

## 11. Auto-Background Flow (chunks.171.mjs)

The complete auto-background flow in the Bash tool executor:

```javascript
// Source: chunks.171.mjs line 2220
// Step 1: Register timeout callback if auto-background enabled
if (V.onTimeout && N)
    V.onTimeout((g) => {
        R("tengu_bash_command_timeout_backgrounded", g)
    });

// Step 2: Wait for early completion or initial timeout
let g = await Promise.race([L, new Promise((B) => setTimeout(B, Yfq, null).unref())]);
if (g !== null) return V.cleanup(), g;           // completed quickly
if (Z) return { backgroundTaskId: Z, ... };       // already backgrounded

// Step 3: Start polling for TUI progress display
kw.startPolling(V.taskOutput.taskId);

// Step 4: Main polling loop
while (!0) {
    let g = v(),                                   // create next progress tick
        B = await Promise.race([L, g]);            // race: completion vs tick
    if (B !== null) {
        if (B.backgroundTaskId !== void 0) {       // process was backgrounded then completed
            jl4(B.backgroundTaskId, K);            // mark as notified
            // ... extract output file info ...
            return V.cleanup(), Q
        }
        if (I) Jl4(I, K);                         // cleanup pending registration
        return V.cleanup(), B                      // normal completion
    }
    if (Z) return { backgroundTaskId: Z, ... };    // backgrounded during tick

    // Step 5: Show Ctrl+B hint after threshold
    let b = Date.now() - u, p = Math.floor(b / 1000);
    if (!rh1 && Z === void 0 && p >= Yfq / 1000 && Y) {
        if (!I) I = Ol4({ command: $, description: H || $, shellCommand: V, agentId: O }, K, w);
        Y({ jsx: fn8.createElement(TN1, null), ... })  // render "Press Ctrl+B" hint
    }

    // Step 6: Yield progress event to caller
    yield { type: "progress", fullOutput: D, output: X, elapsedTimeSeconds: p, ... }
}
```

The complete lifecycle:
1. Command spawns with `j38` process handler.
2. `onTimeout` callback is registered for auto-background.
3. A race between completion and the initial wait period determines fast vs slow path.
4. For slow commands, the polling loop begins, yielding progress events to the TUI.
5. After a threshold (Yfq milliseconds), the task is registered in the background task
   registry and a Ctrl+B hint appears.
6. If the user presses Ctrl+B, or if auto-background triggers on timeout, the process
   transitions to backgrounded state.
7. The function returns immediately with `{ backgroundTaskId, ... }`.
8. The process continues running; completion is handled by the `.then()` handler
   attached during `Hl4`.

## 12. Task Type Guards

Two type guard functions distinguish task types in the registry:

```javascript
// Source: chunks.95.mjs line 1914
function Gf(A) {
    return typeof A === "object" && A !== null && "type" in A && A.type === "local_bash"
}

// Source: chunks.146.mjs line 1945
function Sf(A) {
    return typeof A === "object" && A !== null && "type" in A && A.type === "local_agent"
}
```

The background task system supports both `local_bash` (shell commands) and
`local_agent` (subagent tasks) as background task types, with different handling for
each.

## 13. Summary of Data Flow

```
User command
  → Shell executor spawns child process
  → H91() creates j38 (ProcessHandler) with kw (TaskOutput)
  → H38 (StreamHandler) wires stdout/stderr into kw
  → kw buffers in memory (or spills to Y91 file writer)
  → nC6 ring buffer retains last 1000 lines for TUI

If timeout fires:
  → j38.#W checks autoBackground
  → If yes: onTimeout callback → Hl4 → j38.background(taskId)
    → kw.spillToDisk() if needed
    → Task registered in global state
    → .then() handler attached for eventual completion
    → Return {backgroundTaskId} to caller immediately
  → If no: j38.#k(143) → treekill → resolve with timeout code

When backgrounded process completes:
  → j38.#N builds result
  → .then() in Hl4 fires
  → Flush output, cleanup, update state
  → GN1 sends notification as system message
  → Model reads output file to get results
```
