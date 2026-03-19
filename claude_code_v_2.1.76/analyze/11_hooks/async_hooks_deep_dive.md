# Async Hooks Deep Dive

## Overview

Async hooks are a specialized execution mode where a shell command hook runs **in the background**, allowing the main agent loop to continue without waiting for it. Results from async hooks are collected and presented at the next opportunity.

This document covers the full async hook lifecycle, the two detection modes, and how background hooks are managed.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Hooks section)

Key functions:
- `registerAsyncHook` (eTq) - Adds a background hook to `VR` (asyncHookRegistry)
- `appendAsyncHookStdout` (On7) - Accumulates stdout from background process
- `appendAsyncHookStderr` (_n7) - Accumulates stderr from background process
- `getPendingHookResponses` (Jn7) - Polls registry for completed hooks
- `cleanupAllAsyncHooks` (lMA) - Session-end cleanup
- `hookProgressPoller` (HJ6) - Streams live progress to remote clients
- `isAsyncHookResponse` (SK1) - Detects `{"async": true}` in JSON output
- `asyncHookRegistry` (VR) - In-memory Map of running background hooks

---

## Two Async Detection Modes

### Mode 1: Config-Based (`hook.async === true`)

**Trigger:** The hook configuration specifies `async: true` explicitly.

**Flow:**
```
executeCommandHook(vS1):
  if (hook.async && !forceSyncExecution):
    1. spawn process
    2. Write JSON payload to stdin
    3. Close stdin
    4. Call eTq() to register in VR (asyncHookRegistry)
    5. Return immediately: { backgrounded: true }

executeHooksIterator(Ax):
  Receives { backgrounded: true }
  Yields { outcome: "success" }
  Main loop continues without waiting
```

This mode is purely configuration-driven. The hook never writes a response — the main loop moves on immediately.

### Mode 2: Output-Based (Hook writes `{"async": true}`)

**Trigger:** A hook writes JSON containing `async: true` to its stdout early in execution.

**Flow:**
```
executeCommandHook(vS1):
  1. spawn process
  2. Set up stdout listener that watches for "}" in output
  3. Write JSON payload to stdin (stdin.end() is deferred)
  4. When stdout contains "}" → parse JSON:
     - If parsed.async === true:
       → Call eTq() to background the process
       → Resolve the race promise immediately
       → Return: { stdout: accumulated, status: 0 }
       [Process continues running in background]
     - If not async → continue normal sync processing

executeHooksIterator(Ax):
  Sees json output → SK1(json) returns true → treats as success
  Continues without blocking
```

This mode is dynamic — the hook can decide at runtime based on conditions:
```bash
#!/bin/bash
# Hook decides asynchronously based on work required
if [ "$HEAVY_WORK_REQUIRED" = "true" ]; then
    echo '{"async": true}'  # Tell the system we're going async
    ./run_heavy_background_work.sh &  # Do the work in background
else
    # Complete quickly, return JSON result
    echo '{"decision": "approve"}'
fi
```

### `forceSyncExecution` Override

The `forceSyncExecution` parameter in `Ax` (propagated to `vS1`) forces async hooks to wait for completion:

- **Used by:** `SessionStart` hooks (via `Qu8` with `forceSyncExecution: true`)
- **Reason:** The session cannot be initialized until all SessionStart hooks complete
- **Effect:** Even if `hook.async === true` or the hook writes `{"async": true}`, the system waits

```javascript
// In Qu8 (executeSessionStartHooks):
async function* Qu8(A, q, K, Y, z, _ = T$, w) {
    //...
    yield* Ax({
        // ...
        forceSyncExecution: w  // w = true for SessionStart, makes async hooks wait
    })
}
```

---

## Background Registry (`VR` / asyncHookRegistry)

The registry is a `Map<processId, HookProcessEntry>` stored in process memory.

### Entry Structure

```typescript
interface HookProcessEntry {
    processId: string;            // "async_hook_<pid>"
    hookId: string;               // UUID for telemetry
    hookName: string;             // e.g., "SessionStart:startup"
    hookEvent: string;            // e.g., "SessionStart"
    toolName?: string;            // For tool-scoped hooks
    command: string;              // Original command string
    startTime: number;            // Date.now() when registered
    timeout: number;              // asyncResponse.asyncTimeout || 15000
    stdout: string;               // Accumulated stdout
    stderr: string;               // Accumulated stderr
    output: string;               // stdout + stderr combined
    responseAttachmentSent: boolean; // Whether result was delivered
    shellCommand: ManagedShellProcess; // Reference to the process wrapper
    stopProgressInterval: () => void;  // Cleanup function for polling
}
```

### Data Flow

```
Process spawn
│
├─ eTq(registerAsyncHook) called to add to VR
│  └─ Attaches stream listeners:
│     ├─ stdout.on("data") → On7(appendAsyncHookStdout) → VR[pid].stdout += data
│     └─ stderr.on("data") → _n7(appendAsyncHookStderr) → VR[pid].stderr += data
│
├─ Process running in background...
│  └─ HJ6(hookProgressPoller): every 1000ms
│     ├─ Reads current output from VR[pid]
│     └─ If changed → emits xL9(emitHookProgress) to remote clients
│
└─ Next session turn → Jn7(getPendingHookResponses) called:
   For each entry in VR:
   ├─ If shellCommand.status === "killed" → remove, skip
   ├─ If shellCommand.status !== "completed" → skip (still running)
   └─ If completed AND stdout non-empty AND !responseAttachmentSent:
      ├─ Parse stdout lines for non-async JSON response
      ├─ Set responseAttachmentSent = true
      ├─ If hookEvent === "SessionStart" → invalidate env cache (Id7())
      └─ Return as attachment: { processId, response, stdout, stderr, exitCode }
```

---

## Remote Streaming Support

Only two events stream progress to remote clients during hook execution:
- `SessionStart`
- `Setup`

```javascript
// IL9 = ["SessionStart", "Setup"]
function isRemoteStreamingEvent(hookEvent) {
    return ["SessionStart", "Setup"].includes(hookEvent);  // IL9
}
```

The streaming only activates when `CLAUDE_CODE_REMOTE` environment variable is set. It uses `dMA(dispatchHookEvent)` to send events through a registered handler (`pMA`).

### Event Types Sent

```javascript
// Sent when hook starts executing:
{ type: "started", hookId, hookName, hookEvent }

// Sent every 1000ms during async execution (if output changed):
{ type: "progress", hookId, hookName, hookEvent, stdout, stderr, output }

// Sent when hook completes:
{ type: "response", hookId, hookName, hookEvent, stdout, stderr, output, exitCode, outcome }
```

---

## Async Hook Timeout

The timeout for async hooks comes from the `asyncResponse` object:

```javascript
let timeout = asyncResponse.asyncTimeout || 15000;  // Default: 15 seconds
```

This is separate from the main hook timeout (`T$ = 600000`). An async hook that doesn't complete within its timeout will be killed during `cleanupAllAsyncHooks(lMA)` at session end.

---

## Session-End Cleanup (`lMA` / `cleanupAllAsyncHooks`)

When the session ends, all pending async hooks are resolved:

```javascript
async function cleanupAllAsyncHooks() {
    for (let entry of asyncHookRegistry.values()) {
        if (entry.shellCommand?.status === "completed") {
            let result = await entry.shellCommand.result;
            finalizeAsyncHook(entry, result.code, result.code === 0 ? "success" : "error");
        } else {
            // Still running → kill it
            if (entry.shellCommand && entry.shellCommand.status !== "killed")
                entry.shellCommand.kill();
            finalizeAsyncHook(entry, 1, "cancelled");
        }
    }
    asyncHookRegistry.clear();
}
```

---

## Key Insight: Async vs Sync Trade-offs

| Aspect | Sync Hook | Async Hook |
|--------|----------|-----------|
| When to use | Fast checks, permission decisions, input validation | Long-running tasks (tests, builds, CI) |
| Blocks agent loop | Yes | No |
| Can return permission decisions | Yes | No (only via initial sync response) |
| Can modify tool input | Yes | No |
| Results visible to model | Next turn | Later turn (when Jn7 delivers) |
| Remote streaming | Limited | Yes (via HJ6 polling) |
| Default timeout | 10 minutes (MP) | 15 seconds (asyncTimeout) |

**Critical limitation:** Async hooks cannot block tool execution or return permission decisions because these require synchronous responses. They are best suited for side-effect work (logging, notifications, CI triggers) or long-running verification tasks whose results will be fed into future conversation turns.
