# SDK Tools Integration

## Overview

Tool execution in SDK mode differs significantly from interactive CLI mode. The `isNonInteractive` flag (q7) affects permission handling, error messages, and tool behavior. This document covers the complete tool execution pipeline in SDK sessions, including the MCP-based permission prompt tool mechanism.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Tool execution symbols
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - SDK mode detection
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Transport layer

Key functions in this document:
- `isNonInteractive` (q7) - Core SDK mode check (chunks.1.mjs:2720)
- `processPermissionResult` (JV6) - MCP tool permission result handler
- `permissionRequestHandler` (I51) - Core permission request logic
- `processPermissionRequestIterator` ($Jz) - Generator for permission processing
- `findTool` (Tv) - Tool lookup by name
- `toolDispatcher` (bU1) - Routes tool execution

---

## Tool Execution Pipeline in SDK Mode

### High-Level Flow

```
Agent Loop receives tool_use block
    │
    ├── Find tool by name (findTool)
    │
    ├── Check if permission needed
    │   │
    │   ├── No permission needed → Execute directly
    │   │
    │   └── Permission needed:
    │       │
    │       ├── permissionPromptToolName set?
    │       │   │
    │       │   ├── YES: Call MCP tool for permission
    │       │   │   └── processPermissionResult()
    │       │   │
    │       │   └── NO: Use control_request/response flow
    │       │       └── Send can_use_tool to SDK client
    │       │       └── Wait for control_response
    │       │
    │       └── Permission granted?
    │           ├── YES: Execute tool
    │           └── NO: Return denial result
    │
    └── Return tool result
```

---

## isNonInteractive Flag Propagation

### Core SDK Mode Check

```javascript
// ============================================
// isNonInteractive - Core SDK mode check
// Location: chunks.1.mjs:2720-2722
// ============================================

// ORIGINAL (for source lookup):
function q7() {
    return !v1.isInteractive
}

// READABLE (for understanding):
function isNonInteractive() {
    return !globalState.isInteractive;
}

// Mapping: q7→isNonInteractive, v1→globalState
```

**What it controls:**

The `isNonInteractive` flag is checked in 30+ locations throughout the codebase. In tool execution specifically:

| Check Location | Interactive Behavior | SDK Behavior |
|---|---|---|
| Permission prompts | Shows interactive dialog | Sends control_request or MCP tool call |
| Tool timeout handling | User can Ctrl+C | Controlled via abortSignal |
| Error messages | User-friendly with hints | Machine-parseable terse strings |
| Progress indicators | Spinner with live output | Streamed as events |

---

## Permission Prompt Tool Mechanism

### Overview

When `--permission-prompt-tool <tool-name>` is specified, Claude Code routes all permission requests through an MCP tool. This enables fully automated permission handling for CI/CD and programmatic use cases.

### createCanUseTool Method

**What it does:** Creates a permission checker callback that wraps the `checkToolPermission` function. This method is called during SDK initialization to set up the permission handling flow for tool execution. In SDK mode, it races hook-based permissions against SDK control_request permissions.

**How it works:**
1. Receives a callback function to trigger after permission processing
2. Returns an async function that checks tool permissions
3. If permission is already decided (allow/deny), returns immediately
4. Otherwise, races hook-based permission iterator against SDK permission request
5. First response wins — enables responsive permission handling

```javascript
// ============================================
// createCanUseTool - Creates permission checker with Promise.race pattern
// Location: chunks.184.mjs:2119-2166
// ============================================

// ORIGINAL (for source lookup):
createCanUseTool(A) {
    return async (q, K, Y, z, _) => {
        let w = await tJ(q, K, Y, z, _);
        if (w.behavior === "allow" || w.behavior === "deny") return w;
        let O = new AbortController,
            $ = Y.abortController.signal,
            H = () => O.abort();
        $.addEventListener("abort", H, { once: !0 });
        try {
            let j = EDz(q.name, _, K, Y, w.suggestions).then((D) => ({
                source: "hook",
                decision: D
            }));
            A?.();
            let J = this.sendRequest({
                    subtype: "can_use_tool",
                    tool_name: q.name,
                    input: K,
                    permission_suggestions: w.suggestions,
                    blocked_path: w.blockedPath,
                    decision_reason: VDz(w.decisionReason),
                    tool_use_id: _,
                    agent_id: Y.agentId
                }, ao6(), O.signal).then((D) => ({
                    source: "sdk",
                    result: D
                })),
                M = await Promise.race([j, J]);
            if (M.source === "hook") {
                if (M.decision) return J.catch(() => {}), O.abort(), M.decision;
                let D = await J;
                return JV6(D.result, q, K, Y)
            }
            return JV6(M.result, q, K, Y)
        } catch (j) {
            return JV6({
                behavior: "deny",
                message: `Tool permission request failed: ${j}`,
                toolUseID: _
            }, q, K, Y)
        } finally {
            if (this.getPendingPermissionRequests().length === 0) zV6("running");
            $.removeEventListener("abort", H)
        }
    }
}

// READABLE (for understanding):
createCanUseTool(onPermissionPromptCallback) {
    return async (tool, input, sessionContext, toolUseId, permissionContext) => {
        // Step 1: Check if permission is already determined (local rules, mode, etc.)
        let localResult = await checkToolPermission(tool, input, sessionContext, toolUseId, permissionContext);
        if (localResult.behavior === "allow" || localResult.behavior === "deny") {
            return localResult;  // No need for interactive prompt
        }

        // Step 2: Set up abort handling for the race
        let raceAbortController = new AbortController();
        let sessionAbortSignal = sessionContext.abortController.signal;
        let abortHandler = () => raceAbortController.abort();
        sessionAbortSignal.addEventListener("abort", abortHandler, { once: true });

        try {
            // Step 3: Create hook-based permission iterator
            // This processes permission hooks that may auto-respond
            let hookPermissionPromise = permissionRequestIterator(
                tool.name,
                permissionContext,
                input,
                sessionContext,
                localResult.suggestions
            ).then((decision) => ({
                source: "hook",
                decision: decision
            }));

            // Notify UI that permission prompt is starting
            onPermissionPromptCallback?.();

            // Step 4: Create SDK control_request for remote permission
            let sdkPermissionPromise = this.sendRequest(
                {
                    subtype: "can_use_tool",
                    tool_name: tool.name,
                    input: input,
                    permission_suggestions: localResult.suggestions,
                    blocked_path: localResult.blockedPath,
                    decision_reason: serializeDecisionReason(localResult.decisionReason),
                    tool_use_id: toolUseId,
                    agent_id: sessionContext.agentId
                },
                permissionResponseSchema,
                raceAbortController.signal
            ).then((result) => ({
                source: "sdk",
                result: result
            }));

            // Step 5: RACE — first response wins
            let raceResult = await Promise.race([hookPermissionPromise, sdkPermissionPromise]);

            // Step 6: Handle race result
            if (raceResult.source === "hook") {
                // Hook responded first
                if (raceResult.decision) {
                    // Cancel the SDK request, return hook decision
                    sdkPermissionPromise.catch(() => {});  // Suppress unhandled rejection
                    raceAbortController.abort();
                    return raceResult.decision;
                }
                // Hook didn't decide, wait for SDK response
                let sdkResult = await sdkPermissionPromise;
                return processPermissionResult(sdkResult.result, tool, input, sessionContext);
            }

            // SDK responded first
            return processPermissionResult(raceResult.result, tool, input, sessionContext);

        } catch (error) {
            // Error handling: deny with reason
            return processPermissionResult(
                {
                    behavior: "deny",
                    message: `Tool permission request failed: ${error}`,
                    toolUseID: toolUseId
                },
                tool, input, sessionContext
            );
        } finally {
            // Update UI state if no more pending requests
            if (this.getPendingPermissionRequests().length === 0) {
                setUIState("running");
            }
            sessionAbortSignal.removeEventListener("abort", abortHandler);
        }
    };
}

// Mapping: A→onPermissionPromptCallback, q→tool, K→input, Y→sessionContext,
//   z→toolUseId, _→permissionContext, w→localResult, O→raceAbortController,
//   tJ→checkToolPermission, EDz→permissionRequestIterator, JV6→processPermissionResult,
//   ao6→permissionResponseSchema, zV6→setUIState
```

### Promise.race Pattern Analysis

**Why race hook and SDK permissions?**

The race pattern enables responsive permission handling in scenarios where:
1. **Hook auto-responses** — A PreToolUse hook might automatically allow/deny certain tools
2. **SDK client responses** — The remote SDK client provides permission decisions
3. **First response wins** — Reduces latency by not waiting for both paths

**Race scenarios:**

| Scenario | Winner | Behavior |
|----------|--------|----------|
| Hook returns allow/deny immediately | Hook | SDK request cancelled, hook decision used |
| Hook doesn't respond, SDK responds | SDK | Hook promise ignored, SDK result processed |
| Both respond near-simultaneously | Fastest | Either can win, result is consistent |
| Neither responds | Timeout | Both promises eventually reject/timeout |

**Key insight:** The abort handling ensures that when a hook decides first, the SDK request is cancelled cleanly without leaving orphaned pending requests. The `getPendingPermissionRequests().length === 0` check in the finally block updates the UI state only when all permission requests are resolved.

### Promise.race Algorithm Deep-Dive

**Step-by-step execution flow:**

```
Permission Request Received
         │
         ▼
┌────────────────────────────────────┐
│ 1. checkToolPermission (local)     │
│    Check local rules/mode/settings │
└────────────────────────────────────┘
         │
         ├── behavior="allow" or "deny"? ──► RETURN immediately (no race needed)
         │
         ▼ behavior="ask" (needs input)
┌────────────────────────────────────┐
│ 2. Create AbortController for race │
│    Attach to session abort signal  │
└────────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────┐
│ 3. Create TWO parallel promises:   │
│    ┌─────────────────────────────┐ │
│    │ Hook Permission Promise     │ │
│    │ permissionRequestIterator() │ │
│    │ - Process PreToolUse hooks  │ │
│    │ - May auto-respond          │ │
│    └─────────────────────────────┘ │
│    ┌─────────────────────────────┐ │
│    │ SDK Permission Promise      │ │
│    │ sendRequest(can_use_tool)   │ │
│    │ - Route to SDK client       │ │
│    │ - Wait for control_response │ │
│    └─────────────────────────────┘ │
└────────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────┐
│ 4. Promise.race([hook, sdk])       │
│    First to resolve wins           │
└────────────────────────────────────┘
         │
         ├── source="hook" && decision exists?
         │   ├── YES: Abort SDK request, return hook decision
         │   └── NO: Wait for SDK result, process it
         │
         └── source="sdk"
             └── Process SDK result
         │
         ▼
┌────────────────────────────────────┐
│ 5. Cleanup (finally block)         │
│    - Remove abort listeners        │
│    - Update UI state if no pending │
└────────────────────────────────────┘
```

**Abort handling rationale:**

The nested AbortController pattern is critical for correctness:
- `raceAbortController` — Cancels the losing promise when race completes
- `sessionAbortController.signal` — Propagates session-level cancellation (e.g., Ctrl+C)

When hook wins: `raceAbortController.abort()` sends `control_cancel_request` to SDK client, preventing orphaned requests.

**Error handling path:**

If the race throws (timeout, network error, hook exception):
1. Catch block executes
2. Returns `{ behavior: "deny", message: "Tool permission request failed: ${error}" }`
3. Tool execution is blocked gracefully
4. User sees error message in result

### Permission Race Edge Cases Deep-Dive

**What this analysis covers:** The Promise.race pattern introduces several edge cases that require careful handling. This section documents the critical edge cases and how the implementation addresses them.

#### Edge Case 1: Both Promises Reject

**Scenario:** Both hook promise and SDK promise reject (e.g., hook throws, network fails simultaneously).

**What happens:**
```javascript
// Hook throws: HookException
// SDK request fails: NetworkError
// Promise.race([j, J]) throws the first rejection

try {
    let raceResult = await Promise.race([hookPromise, sdkPromise]);
} catch (error) {
    // error is whichever promise rejected first
    return processPermissionResult({
        behavior: "deny",
        message: `Tool permission request failed: ${error}`,
        toolUseID: toolUseId
    });
}
```

**Why this is safe:**
- The catch block handles any error from either promise
- Both rejections are captured by the single try/catch
- The result is a deny with a descriptive message
- No unhandled rejection warnings because we `.catch()` the SDK promise in the hook-wins path

#### Edge Case 2: Abort During Race

**Scenario:** Session abort signal fires while the race is in progress.

**What happens:**
1. `sessionAbortSignal.addEventListener("abort", abortHandler)` fires
2. `abortHandler()` calls `raceAbortController.abort()`
3. SDK request's AbortSignal is triggered
4. SDK promise rejects with AbortError
5. Race throws, catch block handles it

**Abort propagation chain:**
```
sessionAbortController.abort()
    → sessionAbortSignal "abort" event
    → abortHandler() called
    → raceAbortController.abort()
    → SDK request AbortSignal triggered
    → SDK promise rejects with AbortError/DOMException
    → Promise.race throws
    → catch block returns deny result
```

**Why nested AbortController is critical:**
- `raceAbortController` isolates the race abort from the session abort
- This allows proper cleanup without interfering with other operations
- The SDK request can be cancelled independently of session cancellation

#### Edge Case 3: Orphaned Pending Requests (Memory Leak Prevention)

**Scenario:** Hook wins the race, but SDK request is still pending.

**What happens without cleanup:**
- SDK request continues waiting for response
- `pendingRequests` map retains entry for the request_id
- Memory leak: pendingRequests grows unbounded

**How the implementation prevents this:**
```javascript
if (raceResult.source === "hook" && raceResult.decision) {
    // Suppress unhandled rejection warning
    sdkPermissionPromise.catch(() => {});
    // Abort the SDK request
    raceAbortController.abort();
    return raceResult.decision;
}
```

**Cleanup sequence when hook wins:**
1. `sdkPermissionPromise.catch(() => {})` — Registers empty handler to suppress "unhandled rejection" warning
2. `raceAbortController.abort()` — Triggers abort in SDK request
3. `sendRequest()` detects abort, sends `control_cancel_request` to client
4. Client discards pending request
5. `finally` block checks `getPendingPermissionRequests().length === 0`
6. If all requests resolved, updates UI state to "running"

**Key insight:** The `.catch(() => {})` pattern is essential for JavaScript promise hygiene. Without it, an aborted promise would cause an unhandled rejection warning, even though we deliberately cancelled it.

#### Edge Case 4: Hook Returns Non-Decision

**Scenario:** Hook promise resolves but with `null` or `undefined` (no decision made).

**What happens:**
```javascript
if (raceResult.source === "hook") {
    if (raceResult.decision) {
        // Hook made a decision
        return raceResult.decision;
    }
    // Hook didn't decide (returned null/undefined)
    // Fall through to wait for SDK result
    let sdkResult = await sdkPermissionPromise;
    return processPermissionResult(sdkResult.result, tool, input, sessionContext);
}
```

**Why this design:**
- Hooks may run but not make a permission decision
- Example: A logging hook that records tool use but doesn't interfere
- The system gracefully falls back to SDK permission request

#### Edge Case 5: SDK Responds First, Then Hook Throws

**Scenario:** SDK promise resolves first, then hook promise rejects.

**What happens:**
```javascript
let raceResult = await Promise.race([hookPromise, sdkPromise]);
// raceResult is from SDK (winner)

// hookPromise eventually rejects, but we don't care
// because Promise.race already returned
```

**Why this is safe:**
- `Promise.race` returns as soon as one promise settles (resolve or reject)
- The losing promise continues running but its result is ignored
- Any rejection from the loser after race completes doesn't affect us
- Memory is cleaned up in finally block regardless of which promise won

#### Edge Case 6: Concurrent Permission Requests

**Scenario:** Multiple tools require permission simultaneously.

**What happens:**
```javascript
// Each tool call creates its own raceAbortController
let raceAbortController1 = new AbortController();
let raceAbortController2 = new AbortController();

// Each request has unique request_id
// pendingRequests map tracks all active requests
this.pendingRequests.set(requestId1, { resolve, reject, controller: raceAbortController1 });
this.pendingRequests.set(requestId2, { resolve, reject, controller: raceAbortController2 });
```

**Concurrent request handling:**
- Each permission request is independent
- Separate AbortController for each race
- `pendingRequests` map keys by `request_id` for isolation
- UI state check in finally block counts ALL pending requests:
  ```javascript
  if (this.getPendingPermissionRequests().length === 0) {
      setUIState("running");
  }
  ```

**UI state management:**
- When first permission request starts: UI shows "permission prompt" state
- When all permission requests complete: UI returns to "running" state
- If some requests still pending: UI remains in "permission prompt" state

### Permission Race Timing Analysis

**Why race both paths instead of sequential?**

| Approach | Latency | Complexity |
|----------|---------|------------|
| Hook first, then SDK if needed | Higher latency (sequential wait) | Lower |
| Parallel race | Lower latency (first response wins) | Higher |
| SDK only | Highest latency (no fast-path) | Lowest |

**The parallel race approach optimizes for:**
1. **Fast path:** Hook auto-responds → no SDK round-trip needed
2. **Normal path:** SDK client responds → standard permission flow
3. **Recovery path:** Either fails → graceful deny with message

**Timing diagram:**
```
Time →
0ms    50ms   100ms  150ms  200ms  250ms
│      │      │      │      │      │
├──────┼──────┼──────┼──────┼──────┤
│ Hook │      │      │      │      │
│ ─────┼─────►│      │      │      │
│      │ SDK  │      │      │      │
│      │ ─────┼─────►│ ────►│      │
│      │      │      │ RACE │      │
│      │      │      │ DONE │      │
│      │      │      │  ↓   │      │
│      │      │      │RESULT│      │
```

**If hook wins at 50ms:** SDK request is cancelled, result returned immediately.
**If SDK wins at 150ms:** Hook result is ignored, SDK result used.

### permissionRequestIterator (EDz) — Hook-Based Permission Processing

**Location:** `chunks.184.mjs:2234-2272`

**What it does:** An async generator that processes hook-based permission requests. This function is one side of the Promise.race pattern — it iterates through permission hooks and returns the first decision.

**How it works:**
1. Gets current permission mode from app state
2. Creates an async iterator from `b_6` (hook execution generator)
3. Yields each hook result
4. On first allow/deny decision: applies permission updates and returns
5. If no hook decides: returns `undefined` (falls through to SDK path)

```javascript
// ============================================
// permissionRequestIterator - Hook-based permission processing
// Location: chunks.184.mjs:2234-2272
// ============================================

// ORIGINAL (for source lookup):
async function EDz(A, q, K, Y, z) {
    let w = Y.getAppState().toolPermissionContext.mode,
        O = b_6(A, q, K, Y, w, z, Y.abortController.signal);
    for await (let $ of O) if ($.permissionRequestResult && ($.permissionRequestResult.behavior === "allow" || $.permissionRequestResult.behavior === "deny")) {
        let H = $.permissionRequestResult;
        if (H.behavior === "allow") {
            let j = H.updatedInput || K,
                J = H.updatedPermissions ?? [];
            if (J.length > 0) {
                NC(J);
                let M = Y.getAppState(),
                    D = _v(M.toolPermissionContext, J);
                Y.setAppState((X) => {
                    if (X.toolPermissionContext === D) return X;
                    return {
                        ...X,
                        toolPermissionContext: D
                    }
                })
            }
            return {
                behavior: "allow",
                updatedInput: j,
                userModified: !1,
                decisionReason: {
                    type: "hook",
                    hookName: "PermissionRequest"
                }
            }
        } else return {
            behavior: "deny",
            message: H.message || "Permission denied by PermissionRequest hook",
            decisionReason: {
                type: "hook",
                hookName: "PermissionRequest"
            }
        }
    }
    return
}

// READABLE (for understanding):
async function permissionRequestIterator(toolName, permissionContext, toolInput, sessionContext, suggestions) {
    // Get current permission mode
    let permissionMode = sessionContext.getAppState().toolPermissionContext.mode;

    // Create hook execution generator
    // b_6 is the generator that executes PreToolUse hooks
    let hookIterator = executePermissionHooks(
        toolName,
        permissionContext,
        toolInput,
        sessionContext,
        permissionMode,
        suggestions,
        sessionContext.abortController.signal
    );

    // Iterate through hook results
    for await (let hookResult of hookIterator) {
        // Check if hook made a decision
        if (hookResult.permissionRequestResult &&
            (hookResult.permissionRequestResult.behavior === "allow" ||
             hookResult.permissionRequestResult.behavior === "deny")) {

            let decision = hookResult.permissionRequestResult;

            if (decision.behavior === "allow") {
                // Apply updated input if hook modified it
                let finalInput = decision.updatedInput || toolInput;

                // Apply permission updates if provided
                let updatedPerms = decision.updatedPermissions ?? [];
                if (updatedPerms.length > 0) {
                    // Persist to disk
                    persistPermissions(updatedPerms);

                    // Update in-memory state
                    let currentPermContext = sessionContext.getAppState();
                    let newPermContext = mergePermissions(currentPermContext.toolPermissionContext, updatedPerms);
                    sessionContext.setAppState((state) => {
                        if (state.toolPermissionContext === newPermContext) return state;
                        return { ...state, toolPermissionContext: newPermContext };
                    });
                }

                return {
                    behavior: "allow",
                    updatedInput: finalInput,
                    userModified: false,
                    decisionReason: {
                        type: "hook",
                        hookName: "PermissionRequest"
                    }
                };
            } else {
                // Deny
                return {
                    behavior: "deny",
                    message: decision.message || "Permission denied by PermissionRequest hook",
                    decisionReason: {
                        type: "hook",
                        hookName: "PermissionRequest"
                    }
                };
            }
        }
    }

    // No hook made a decision, return undefined
    // This signals the caller to wait for SDK response
    return undefined;
}

// Mapping: EDz→permissionRequestIterator, A→toolName, q→permissionContext, K→toolInput,
//          Y→sessionContext, z→suggestions, w→permissionMode, O→hookIterator,
//          $→hookResult, H→decision, j→finalInput, J→updatedPerms, NC→persistPermissions,
//          _v→mergePermissions, b_6→executePermissionHooks
```

### Why Return `undefined`?

When `permissionRequestIterator` returns `undefined`:
1. No hook made an allow/deny decision
2. The `Promise.race` in `createCanUseTool` sees `{ source: "hook", decision: undefined }`
3. The code falls through to wait for SDK response:
   ```javascript
   if (raceResult.source === "hook") {
       if (raceResult.decision) {
           // Hook made a decision
           return raceResult.decision;
       }
       // Hook didn't decide (returned undefined)
       let sdkResult = await sdkPermissionPromise;
       return processPermissionResult(sdkResult.result, ...);
   }
   ```

This design allows hooks to:
- **Auto-respond**: Return allow/deny immediately
- **Pass through**: Return nothing, let SDK client decide
- **Log only**: Execute side effects without affecting permission

### checkToolPermission (tJ)

**What it does:** Checks tool permission before execution. Returns a permission result with behavior and suggestions.

**Return structure:**
```javascript
{
    behavior: "allow" | "deny" | "ask",
    suggestions: [
        { rule: "allow", type: "tool", value: "Bash", scope: "session" }
    ],
    blockedPath: "/path/to/blocked/file",  // Optional
    decisionReason: { type: "...", ... }    // Optional
}
```

### Permission Tool Flow

```javascript
// ============================================
// Permission request with MCP tool flow
// Location: chunks.179.mjs:1600-1630
// ============================================

// ORIGINAL (for source lookup):
let J = new Promise((P) => {
    O.addEventListener("abort", () => P("aborted"), { once: !0 });
});
// ... call MCP tool, race with abort
let j = D, M = A.mapToolResultToToolResultBlockParam(j.data, "1");
return jc1(Gv6.parse(j9(M.content[0].text)), A, Y, z)

// READABLE (for understanding):
async function callPermissionPromptTool(permissionTool, toolInput, sessionContext, abortSignal) {
    // Build the MCP tool call
    let toolCallPayload = {
        type: "tool_use",
        name: permissionTool.name,
        input: {
            tool_name: toolInput.tool_name,
            input: toolInput.input,
            tool_use_id: toolInput.tool_use_id
        }
    };

    // Race between tool execution and abort
    let abortPromise = new Promise((resolve) => {
        abortSignal.addEventListener("abort", () => resolve("aborted"), { once: true });
    });

    // Execute MCP tool
    let result = await Promise.race([
        executeMcpToolCall(toolCallPayload),
        abortPromise
    ]);

    if (result === "aborted") {
        return { behavior: "deny", message: "Request aborted" };
    }

    // Parse and process result
    let parsedResult = PermissionToolResponseSchema.parse(result.content[0].text);
    return processPermissionResult(parsedResult, permissionTool, toolInput, sessionContext);
}

// Mapping: Gv6→PermissionToolResponseSchema, JV6→processPermissionResult
```

### processPermissionResult (JV6)

```javascript
// ============================================
// processPermissionResult - Process MCP permission result
// Location: chunks.184.mjs:1621-1642
// ============================================

// ORIGINAL (for source lookup):
function JV6(A, q, K, Y) {
    let z = {
        type: "permissionPromptTool",
        permissionPromptToolName: q.name,
        toolResult: A
    };
    if (A.behavior === "allow") {
        let _ = A.updatedPermissions;
        if (_) Y.setAppState((w) => ({
            ...w,
            toolPermissionContext: _v(w.toolPermissionContext, _)
        })), NC(_);
        return {
            ...A,
            decisionReason: z
        }
    } else if (A.behavior === "deny" && A.interrupt) k(`SDK permission prompt deny+interrupt: tool=${q.name} message=${A.message}`), Y.abortController.abort();
    return {
        ...A,
        decisionReason: z
    }
}

// READABLE (for understanding):
function processPermissionResult(toolResult, permissionTool, toolInput, sessionContext) {
    // Build decision reason for telemetry and debugging
    let decisionReason = {
        type: "permissionPromptTool",
        permissionPromptToolName: permissionTool.name,
        toolResult: toolResult
    };

    if (toolResult.behavior === "allow") {
        // Apply permission updates if provided
        let updatedPerms = toolResult.updatedPermissions;
        if (updatedPerms) {
            // Update app state with new permissions
            sessionContext.setAppState((state) => ({
                ...state,
                toolPermissionContext: mergePermissions(state.toolPermissionContext, updatedPerms)
            }));
            // Persist to disk
            persistPermissions(updatedPerms);
        }
        return { ...toolResult, decisionReason };
    } else if (toolResult.behavior === "deny" && toolResult.interrupt) {
        // interrupt=true means abort the entire session, not just this tool
        logDebug(`SDK permission prompt deny+interrupt: tool=${permissionTool.name}`);
        sessionContext.abortController.abort();
    }
    return { ...toolResult, decisionReason };
}

// Mapping: JV6→processPermissionResult, A→toolResult, q→permissionTool, K→toolInput, Y→sessionContext, z→decisionReason, _v→mergePermissions, NC→persistPermissions
```

### Permission Tool Response Schema

```javascript
// The MCP permission tool must return a JSON object matching this schema:
{
    behavior: "allow" | "deny" | "ask",
    message?: string,              // Optional: message for deny/ask
    updatedPermissions?: [         // Optional: persistent permission updates
        {
            rule: "allow" | "deny",
            type: "tool" | "domain" | "path",
            value: string,
            scope: "session" | "permanent"
        }
    ],
    interrupt?: boolean,           // If true + deny: abort entire session
    updatedInput?: {...}           // Optional: modified tool input
}
```

---

## Standard control_request Permission Flow

When no `permissionPromptToolName` is set, permissions use the bidirectional `control_request`/`control_response` protocol:

### Permission Request Message (Server → Client)

```javascript
{
    "type": "control_request",
    "request_id": "<uuid>",
    "request": {
        "subtype": "can_use_tool",
        "tool_name": "Bash",
        "input": {"command": "rm -rf /tmp/test"},
        "tool_use_id": "tu_xxx",
        "permission_suggestions": [          // Suggested permission rules
            {
                "rule": "allow",
                "type": "tool",
                "value": "Bash",
                "scope": "session"
            }
        ],
        "blocked_path": "/path/to/file",     // Optional: path that triggered the permission check
        "decision_reason": {                  // Optional: why permission was triggered
            "type": "hook" | "default" | "permission_mode",
            "hookName": "PreToolUse:...",
            "reason": "..."
        }
    }
}
```

### permission_suggestions Field

**What it does:** Provides pre-computed permission rule suggestions that the SDK client can present to the user for quick selection. These suggestions are generated based on the tool type, input analysis, and current permission context.

**How suggestions are generated:**
1. Tool analysis: `checkToolPermission` analyzes the tool and input
2. Pattern matching: Matches against known permission patterns
3. Scope determination: Suggests appropriate scope (session vs permanent)
4. Rule generation: Creates suggested permission rules

**Suggestion structure:**
```javascript
{
    suggestions: [
        {
            rule: "allow" | "deny",
            type: "tool" | "domain" | "path",
            value: string,              // Tool name, domain, or path pattern
            scope: "session" | "permanent"
        }
    ]
}
```

### decision_reason Field

**What it does:** Explains why the permission request was triggered. Useful for debugging and auditing permission flows.

**Decision reason types:**

| Type | Description | Example |
|------|-------------|---------|
| `hook` | PreToolUse hook requested permission | `{ type: "hook", hookName: "PreToolUse:Bash", reason: "..." }` |
| `default` | Default permission mode requires confirmation | `{ type: "default", mode: "default" }` |
| `permission_mode` | Current permission mode setting | `{ type: "permission_mode", mode: "ask" }` |
| `permissionPromptTool` | MCP tool processed permission | `{ type: "permissionPromptTool", toolResult: {...} }` |

### Permission Response Message (Client → Server)

```javascript
// Allow:
{
    "type": "control_response",
    "response": {
        "subtype": "success",
        "request_id": "<uuid>",
        "response": {
            "behavior": "allow",
            "updatedPermissions": [...]
        }
    }
}

// Deny:
{
    "type": "control_response",
    "response": {
        "subtype": "success",
        "request_id": "<uuid>",
        "response": {
            "behavior": "deny",
            "message": "User denied this operation"
        }
    }
}
```

---

## Tool Result Handling Differences

### Streaming Tool Output

In SDK mode with `--output-format=stream-json`, tool results are streamed as they become available:

```javascript
// ============================================
// Tool result streaming in SDK mode
// Location: chunks.179.mjs:315-353
// ============================================

case "tool_result":
    collectedMessages.push(event);
    // Stream tool result to SDK client
    if (shouldStreamEvents) {
        yield {
            type: "tool_result",
            tool_use_id: event.tool_use_id,
            content: event.content,
            is_error: event.is_error,
            session_id: getSessionId(),
            uuid: generateId()
        };
    }
    break;
```

### Error Handling Differences

| Error Type | Interactive Mode | SDK Mode |
|---|---|---|
| Tool not found | `"Tool 'X' not found"` | Same message, no hint |
| Permission denied | Interactive dialog | Returns deny result |
| Timeout | User can cancel | Controlled via abortSignal |
| Invalid input | Shows schema | Returns validation error |

---

## MCP Tool Integration for Permissions

### Setting Up Permission Prompt Tool

**CLI Usage:**
```bash
claude --print --output-format=stream-json \
       --permission-prompt-tool my_permission_handler \
       --mcp-config mcp_config.json
```

**MCP Server Configuration:**
```json
{
    "mcpServers": {
        "my_permission_server": {
            "command": "node",
            "args": ["permission-server.js"]
        }
    }
}
```

**Permission Tool Implementation:**
```javascript
// permission-server.js - MCP server with permission tool
const server = new McpServer({ name: "permission-server", version: "1.0.0" });

server.tool(
    "my_permission_handler",
    {
        type: "object",
        properties: {
            tool_name: { type: "string" },
            input: { type: "object" },
            tool_use_id: { type: "string" }
        }
    },
    async (params) => {
        // Your permission logic here
        if (isAllowed(params.tool_name, params.input)) {
            return {
                content: [{
                    type: "text",
                    text: JSON.stringify({
                        behavior: "allow",
                        updatedPermissions: []
                    })
                }]
            };
        } else {
            return {
                content: [{
                    type: "text",
                    text: JSON.stringify({
                        behavior: "deny",
                        message: "Operation not allowed by policy"
                    })
                }]
            };
        }
    }
);
```

---

## Tool Filtering in SDK Mode

### Allowed Tools Configuration

SDK clients can restrict which tools are available:

```javascript
// CLI flags for tool restriction:
--allowed-tools Bash Read Write     // Only these tools
--disallowed-tools WebSearch WebFetch  // All except these
--tools '["Bash", "Read", "Write"]'    // Exact set (JSON)
```

### Tool Discovery in Initialize Response

The `initialize` control response includes available tools:

```javascript
{
    "type": "control_response",
    "response": {
        "subtype": "success",
        "request_id": "<uuid>",
        "response": {
            "tools": [
                "Bash", "Read", "Write", "Edit", "Glob", "Grep",
                "TaskOutput", "WebFetch", "WebSearch", "TaskCreate",
                "TaskList", "TaskGet", "TaskUpdate", "TaskStop",
                "NotebookEdit", "ExitPlanMode", "EnterPlanMode",
                "AskUserQuestion", "Skill", "Agent"
            ],
            "mcp_tools": [
                "mcp_server1.tool1",
                "mcp_server1.tool2",
                "mcp_server2.tool1"
            ],
            "commands": [
                { "name": "help", "description": "Show help" },
                { "name": "clear", "description": "Clear conversation" }
            ],
            "models": ["claude-opus-4-6", "claude-sonnet-4-6"],
            // ...
        }
    }
}
```

### Tool Filtering Logic

The `tools` and `disallowedTools` fields in agent configuration control tool availability:

```javascript
// ============================================
// Agent tool filtering configuration
// Location: chunks.91.mjs:48-104
// ============================================

// Agent configuration with tool restrictions
{
    agentType: "my_agent",
    whenToUse: "Use this agent for...",
    tools: ["Bash", "Read", "Write"],        // Only these tools
    disallowedTools: ["WebSearch"],          // Plus deny these
    // ... other fields
}

// Parsing function extracts tools/disallowedTools
function parseAgentConfig(agentType, jsonString, source = "flagSettings") {
    let parsed = AgentConfigSchema.parse(jsonString);

    // Get allowed tools list
    let tools = parseToolList(parsed.tools);

    // Get disallowed tools list
    let disallowedTools = parsed.disallowedTools !== undefined
        ? parseToolList(parsed.disallowedTools)
        : undefined;

    return {
        agentType,
        tools,
        disallowedTools,
        // ...
    };
}
```

---

## MCP Tool Integration for SDK Sessions

### MCP Tools in SDK Mode

SDK sessions can connect MCP servers through two mechanisms:

1. **SDK MCP Servers** (`sdkMcpServers` in initialize request)
   - MCP servers managed by the SDK client
   - Communication routed through `sendMcpMessage` control channel
   - See [sdk_mcp_integration.md](./sdk_mcp_integration.md) for details

2. **Permission Prompt Tool** (`--permission-prompt-tool`)
   - Special MCP tool for handling permissions programmatically
   - Routes permission requests through MCP instead of control_request

### Permission Tool vs Standard Permission Flow

```
Tool requires permission
    │
    ├── permissionPromptToolName set?
    │   │
    │   ├── YES: Call MCP tool via sendMcpMessage
    │   │   └── { tool_name, input, tool_use_id }
    │   │       └── Response: { behavior, message, updatedPermissions }
    │   │           └── processPermissionResult()
    │   │
    │   └── NO: Standard control_request flow
    │       └── sendRequest({ subtype: "can_use_tool", ... })
    │           └── Wait for control_response
    │
    └── Permission result determines tool execution
```

---

## Summary: Tool Execution Decision Tree

```
Tool execution requested
    │
    ├── Is tool in allowed list?
    │   ├── NO → Return error: "Tool not allowed"
    │   └── YES → Continue
    │
    ├── Does tool require permission?
    │   ├── NO → Execute tool
    │   └── YES → Check permission mode
    │
    ├── Permission mode:
    │   ├── bypassPermissions → Execute without asking
    │   ├── acceptEdits → Auto-allow edit tools
    │   └── default → Request permission
    │
    ├── Permission request:
    │   ├── permissionPromptToolName set?
    │   │   ├── YES → Call MCP tool → processPermissionResult()
    │   │   └── NO → Send control_request → Wait for control_response
    │   │
    │   └── Result:
    │       ├── allow → Execute tool
    │       ├── deny → Return denial result
    │       └── deny+interrupt → Abort session
    │
    └── Execute tool → Return result
```

---

## Tool Result Context Preservation

### System Reminder Wrapping for Tool Results

In SDK mode, tool results that need to persist in context can be wrapped in `<system-reminder>` XML tags. This is particularly important for:

1. **Large tool outputs** — Summarized results wrapped as system reminders preserve key information
2. **Permission decisions** — Permission states that affect future tool calls are injected as reminders
3. **Cross-turn context** — Tool results that influence subsequent tool invocations

### wrapInXmlTag for Tool Results

The `wrapInXmlTag` (af) function can wrap tool result content:

```javascript
// ============================================
// Tool result wrapping for context preservation
// Location: chunks.173.mjs:2490-2494
// ============================================

// READABLE (for understanding):
function wrapToolResultForContext(toolResult) {
    // Large file contents can be summarized and wrapped
    if (toolResult.length > MAX_CONTEXT_LENGTH) {
        const summary = summarizeToolResult(toolResult);
        return wrapInXmlTag(summary);
    }
    return toolResult;
}
```

### Permission State Injection

Permission decisions are injected as system reminders to maintain permission state across turns:

```javascript
// Permission decision result wrapped as system reminder
if (permissionResult.behavior === "allow" && permissionResult.updatedPermissions) {
    // Permission updates are preserved in context
    const permissionContext = formatPermissionContext(permissionResult.updatedPermissions);
    const wrapped = wrapInXmlTag(permissionContext);
    // Inject into next API call's context
}
```

### When Tool Results Are Wrapped

| Scenario | Wrapped? | Reason |
|----------|----------|--------|
| Small text output | No | Direct inclusion is sufficient |
| Large file contents | Yes (summarized) | Token efficiency, key information preserved |
| Permission decisions | Yes | State persistence across turns |
| Error results | Sometimes | If error affects subsequent tool calls |

For complete system reminder documentation including injection points, see [../04_system_reminder/overview.md](../04_system_reminder/overview.md).

---

## Cross-References

- **MCP Integration**: See [sdk_mcp_integration.md](./sdk_mcp_integration.md) for MCP server setup in SDK mode
- **Error Recovery**: See [sdk_error_recovery.md](./sdk_error_recovery.md) for tool execution error handling
- **Session Management**: See [sdk_session_management.md](./sdk_session_management.md) for tool permission persistence
- **Tool Execution Details**: See [05_tools/](../05_tools/) for tool implementation details
- **System Reminders**: See [../04_system_reminder/overview.md](../04_system_reminder/overview.md) for XML wrapping and context preservation
