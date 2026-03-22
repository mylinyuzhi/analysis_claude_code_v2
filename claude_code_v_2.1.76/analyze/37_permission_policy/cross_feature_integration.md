# Permission Cross-Feature Integration (Claude Code 2.1.76)

> How the permission/policy system integrates with tool execution, system reminders, plan mode, sandbox, multi-agent teams, file system, and CLI.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Tools, Permissions)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Hooks, Plan Mode, Agents)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (Sandbox, Shell)

**Cross-references:**
- [tool_execution_pipeline.md](../05_tools/tool_execution_pipeline.md) - Full fxY pipeline with permission stage
- [hook_integration.md](hook_integration.md) - Hook permission override mechanics
- [tools_filtering.md](../12_plan_mode/tools_filtering.md) - Plan mode read-only enforcement
- [overview.md](../18_sandbox/overview.md) - Sandbox architecture
- [permission_sync.md](../18_sandbox/permission_sync.md) - Multi-agent permission forwarding
- [overview.md](../16_file_system/overview.md) - File tool permission checks
- [implementation.md](../11_hooks/implementation.md) - Hook system event catalog
- [http_hooks.md](../11_hooks/http_hooks.md) - HTTP hook permission responses

Key functions in this document:
- `toolExecutionPipeline` (fxY) - 7-stage pipeline with permission at stage 4
- `canUseTool` (BYz) - Central permission decision function
- `permissionContextReducer` (Ez) - Immutable reducer for permission context updates
- `applyPermissionUpdates` (_v) - Applies a batch of reducer actions
- `refreshPermissionRules` (U84) - Reloads permission rules from settings
- `filterToolsByMode` (Xk8) - Filters tools based on permission mode
- `resolveToolSet` (_c) - Combines tool filtering with disallowed-tools exclusion
- `checkBashPermissions` (Tn8) - Bash tool permission cascade
- `checkBashRuleMatch` (cr6) - Exact-match rule checking for Bash commands
- `checkBashRuleMatchWithPrefix` (ufq) - Prefix-match rule checking for sandboxed Bash
- `shouldUseSandbox` (Ti) - Per-command sandbox gate
- `checkBashPermissionWithSandbox` (VYz) - Permission check for sandboxed commands
- `buildHookContext` ($w) - Injects permission_mode into hook context
- `getAsyncHookResponseAttachments` (tuY) - Collects async hook results for system reminders
- `createPermissionRequest` (SN1) - Creates worker permission request for leader
- `sendPermissionRequest` (CN1) - Sends request via mailbox
- `sendPermissionResponse` (IN1) - Leader sends decision to worker
- `processPermissionResponse` (If6) - Worker resolves promise from leader response
- `submitSwarmPermissionRequest` (tuq) - Full worker permission flow with promise blocking
- `matchesGlobalDenyRule` (bYz) - Checks tool against global deny rules
- `matchesGlobalAskRule` (xYz) - Checks tool against global ask rules
- `matchesGlobalAllowRule` (IYz) - Checks tool against global allow rules

---

## Master Integration Architecture

```
+----------------------------------------------------------------------+
|                    PERMISSION SYSTEM INTEGRATION MAP                   |
+----------------------------------------------------------------------+
|                                                                        |
|  01_cli ------+                                                        |
|  CLI flags    |   +----------------------------+                       |
|  --allowed    +-->|  Permission Context         |                      |
|  --disallowed |   |  (toolPermissionContext)    |                      |
|  --bypass     |   |  Ez -> _v -> U84            |                      |
|               |   +-----------+----------------+                       |
|  Config files-+               |                                        |
|                               v                                        |
|  +-------------------------------------------------------------+      |
|  | 05_tools: Tool Execution Pipeline (fxY)                      |      |
|  |  Stage 1: Input schema validation                            |      |
|  |  Stage 2: Custom validation (validateInput)                  |      |
|  |  Stage 3: Pre-hooks (11_hooks: LF8 -> Ax)                   |      |
|  |     +-- 04_system_reminder: permission_mode via $w()         |      |
|  |  Stage 4: Permission check (BYz -> canUseTool)              |<-----+
|  |     +-- Global deny/ask/allow rules (bYz/xYz/IYz)          |      |
|  |     +-- Tool checkPermissions() --> 16_file_system           |      |
|  |     |     +-- Read: checkReadPermissions (ro)                |      |
|  |     |     +-- Write/Edit: checkEditPermissions (N51)         |      |
|  |     |     +-- Bash: checkBashPermissions (Tn8)               |      |
|  |     |           +--> 18_sandbox: Ti, VYz                     |      |
|  |     |           +--> 29_shell_parser: safety analysis        |      |
|  |     +-- 02_ui: Dialog (tuq -> worker permission flow)        |      |
|  |           +--> 30_agent_teams: mailbox sync                  |      |
|  |  Stage 5: Tool execution (tool.call)                         |      |
|  |  Stage 6: Post-hooks (RF8 -> Ax)                             |      |
|  |  Stage 7: Result formatting and telemetry                    |      |
|  +-------------------------------------------------------------+      |
|                               |                                        |
|  12_plan_mode <---------------+                                        |
|    isReadOnly() + filterToolsByMode (Xk8)                              |
|                                                                        |
+----------------------------------------------------------------------+
```

---

## 1. Tool Execution Pipeline (05_tools)

### How permission fits into the 7-stage pipeline

**What it does:** The `fxY` (toolExecutionPipeline) function orchestrates the entire lifecycle of a single tool call. Permission checking occurs at stage 4, after input validation and pre-hooks, but before actual execution.

**How it works:**

The pipeline passes a `canUseTool` function (parameter `z` in fxY) that wraps `BYz`. The permission check integrates with pre-hook results:

```
fxY pipeline stage 4 (lines 591-600):

  hookPermissionResult (Z) from stage 3
      |
      +-- Z.behavior === "allow" AND !requiresUserInteraction() AND !requireCanUseTool
      |     -> Skip BYz entirely, use hook result as permission decision
      |
      +-- Z.behavior === "allow" AND (requiresUserInteraction() OR requireCanUseTool)
      |     -> Apply Z.updatedInput, then call BYz anyway
      |
      +-- Z.behavior === "deny"
      |     -> Use hook denial directly, skip BYz
      |
      +-- Z.behavior === "ask"
      |     -> Pass hook context to BYz, which forces user prompt
      |
      +-- Z is undefined (no hook override)
            -> Standard BYz flow
```

```javascript
// ============================================
// fxY stage 4 - Permission check with hook integration
// Location: chunks.146.mjs:591-600
// ============================================

// ORIGINAL (for source lookup):
let V;
if (Z !== void 0 && Z.behavior === "allow" && !A.requiresUserInteraction?.() && !Y.requireCanUseTool)
    k(`Hook approved tool use for ${A.name}, bypassing permission check`), V = Z;
else if (Z !== void 0 && Z.behavior === "allow" && (A.requiresUserInteraction?.() || Y.requireCanUseTool)) {
    if (k(`Hook approved tool use for ${A.name}, but canUseTool is required`), Z.updatedInput) X = Z.updatedInput;
    V = await z(A, X, Y, _, q)
} else if (Z !== void 0 && Z.behavior === "deny")
    k(`Hook denied tool use for ${A.name}`), V = Z;
else {
    let u = Z?.behavior === "ask" ? Z : void 0;
    if (Z?.behavior === "ask" && Z.updatedInput) X = Z.updatedInput;
    V = await z(A, X, Y, _, q, u)
}

// Mapping: Z->hookPermissionResult, V->finalPermissionResult, z->canUseTool (BYz),
//          A->tool, X->input, Y->toolUseContext, q->toolUseId
```

**Post-decision telemetry (lines 601-612):** After the permission decision, `fxY` logs the decision source ("hook" or "config") via `pw("tool_decision", ...)` and increments an OpenTelemetry counter via `Bk6()?.add(1, ...)`. The `toolDecisions` map on the context tracks per-tool-use decisions to avoid double-counting.

**Key insight:** The `requireCanUseTool` flag on the tool use context is separate from `requiresUserInteraction()`. It is set for contexts where the caller needs a user-facing decision regardless of hook results -- for example, when the SDK client has requested explicit permission tracking.

---

## 2. System Reminders (04_system_reminder)

### permission_mode propagation through hook context

**What it does:** The `$w()` function (buildHookContext) injects the current `permission_mode` into every hook event payload. This ensures hooks always know the security context in which they are operating.

**How it works:**

1. `fxY` calls `y4q` (executePreToolHooksIterator)
2. `y4q` reads `appState.toolPermissionContext.mode` from the current app state
3. `y4q` passes this mode to `LF8` (executePreToolHooks)
4. `LF8` calls `$w(permissionMode)` to build the base context
5. The resulting hook input contains `permission_mode: "default" | "auto" | "bypassPermissions" | "plan"`

```javascript
// ============================================
// Permission mode propagation chain
// Location: chunks.146.mjs:78, chunks.175.mjs:2468, chunks.175.mjs:1009
// ============================================

// y4q reads the mode:
let H = A.getAppState();
for await (let j of LF8(q.name, Y, K, A, H.toolPermissionContext.mode, ...))

// LF8 passes to $w:
let J = {
    ...$w(z, void 0, Y),    // z = permissionMode
    hook_event_name: "PreToolUse",
    tool_name: A,
    tool_input: K,
    tool_use_id: q
};

// $w embeds it:
return {
    permission_mode: A,    // The permission mode from toolPermissionContext
    session_id: ...,
    cwd: ...,
    ...
}
```

### Async hook responses as system-reminder attachments

**What it does:** `tuY()` (getAsyncHookResponseAttachments) collects completed async hook responses and creates attachment objects that are injected into the conversation as system-reminder-style context.

**How it works:**

1. Polls the async hook registry via `r4q()` (getPendingHookResponses)
2. For each completed response, creates an attachment with type `"async_hook_response"`
3. Removes delivered responses from the registry via `o4q()` (removePendingResponses)
4. These attachments appear in the system-reminder layer, making hook results visible to the model

```javascript
// ============================================
// getAsyncHookResponseAttachments - Async hook results as reminders
// Location: chunks.147.mjs:1050-1082
// ============================================

// ORIGINAL (for source lookup):
async function tuY() {
    let A = await r4q();
    if (A.length === 0) return [];
    let q = A.map(({ processId, response, hookName, hookEvent, toolName, pluginId, stdout, stderr, exitCode }) => {
        return {
            type: "async_hook_response",
            processId, hookName, hookEvent, toolName,
            response, stdout, stderr, exitCode
        }
    });
    if (A.length > 0) {
        let K = A.map((Y) => Y.processId);
        o4q(K);
    }
    return q;
}

// Mapping: tuY->getAsyncHookResponseAttachments, r4q->getPendingHookResponses, o4q->removePendingResponses
```

**Attachment types created by the hook system:**

| Type | Source | Content |
|------|--------|---------|
| `async_hook_response` | `tuY()` | Completed background hook output |
| `hook_blocking_error` | `Ax()` | Fatal hook error that blocks execution |
| `hook_non_blocking_error` | `Ax()` | Non-fatal hook failure |
| `hook_success` | `Ax()` | Successful hook execution result |
| `hook_additional_context` | `y4q()` | Context injected by hook's `additionalContext` field |
| `hook_system_message` | `Ax()` | Warning from hook's `systemMessage` field |

---

## 3. Plan Mode (12_plan_mode)

### Tool filtering by permission mode

**What it does:** `filterToolsByMode` (Xk8) restricts the available tool set when the permission mode is `"plan"`. Only read-only tools and the plan file writing exception pass the filter.

**How it works:**

```javascript
// ============================================
// filterToolsByMode - Plan mode tool filtering
// Location: chunks.93.mjs:1568-1588
// ============================================

// ORIGINAL (for source lookup):
function Xk8({ tools: A, isBuiltIn: q, isAsync: K = !1, permissionMode: Y }) {
    return A.filter((z) => {
        if (z.name.startsWith("mcp__")) return !0;
        if (z3(z, aJ) && Y === "plan") return !0;
        if (CW6.has(z.name)) return !1;
        if (!q && xV8.has(z.name)) return !1;
        if (K && !eP1.has(z.name)) {
            if (E7() && eP()) { if (z3(z, r4)) return !0; if (WY4.has(z.name)) return !0 }
            return !1
        }
        return !0
    })
}

// READABLE (for understanding):
function filterToolsByMode({ tools, isBuiltIn, isAsync = false, permissionMode }) {
    return tools.filter(tool => {
        if (tool.name.startsWith("mcp__")) return true;           // MCP tools always pass
        if (isPlanTool(tool) && permissionMode === "plan") return true;  // Plan tools in plan mode
        if (BLOCKED_TOOLS.has(tool.name)) return false;           // Always blocked (e.g., from agent hooks)
        if (!isBuiltIn && BUILTIN_ONLY_TOOLS.has(tool.name)) return false;
        if (isAsync && !ASYNC_SAFE_TOOLS.has(tool.name)) {       // Async context filtering
            if (isTeamMode() && isTeamLeader()) {                 // Team leaders get extra tools
                if (isPlanTool(tool)) return true;
                if (TEAM_LEADER_TOOLS.has(tool.name)) return true;
            }
            return false;
        }
        return true;
    })
}

// Mapping: Xk8->filterToolsByMode, CW6->BLOCKED_TOOLS, xV8->BUILTIN_ONLY_TOOLS,
//          eP1->ASYNC_SAFE_TOOLS, z3->isPlanTool, aJ->PLAN_TOOL_TAG, WY4->TEAM_LEADER_TOOLS
```

### Read-only enforcement at multiple layers

Plan mode enforces read-only access through three layers:

**Layer 1 -- Tool-level `isReadOnly()` method:**
- Glob, Grep, Read: always return `true`
- Bash: dynamically checks via `Z01()` (evaluateBashCommandReadiness), which parses the command to determine if it is read-only
- Write/Edit: return `false` unless writing to the plan file path

**Layer 2 -- Permission check in BYz:**
At line 2752, when `mode === "plan"` and `isBypassPermissionsModeAvailable` is true, the tool is auto-allowed. This handles the case where a user launched the session with `--dangerously-skip-permissions` but is currently in plan mode -- plan mode inherits the bypass.

```javascript
// ORIGINAL (for source lookup):
// Location: chunks.172.mjs:2752-2759
if (_.toolPermissionContext.mode === "bypassPermissions" ||
    _.toolPermissionContext.mode === "plan" && _.toolPermissionContext.isBypassPermissionsModeAvailable)
    return {
        behavior: "allow",
        updatedInput: lfq($, q),
        decisionReason: { type: "mode", mode: _.toolPermissionContext.mode }
    };
```

**Layer 3 -- resolveToolSet filtering:**
`_c()` (resolveToolSet) at chunks.93.mjs:1590 calls `Xk8` with the current `permissionMode` and then applies `disallowedTools` exclusion. The `permissionMode` parameter flows from `toolPermissionContext.mode` in the app state.

**Key insight:** Plan mode does not simply hide write tools -- it allows them for the plan file itself. The `z3(z, aJ)` check (`isPlanTool`) identifies tools that have been tagged as plan-related, permitting Write and Edit to modify `~/.cocode/plans/{name}.md` even in read-only mode.

---

## 4. Sandbox Integration (18_sandbox)

### Per-command sandbox gate

**What it does:** `Ti()` (shouldUseSandbox) determines whether a specific Bash command should be sandboxed.

```javascript
// ============================================
// shouldUseSandbox - Per-command sandbox decision
// Location: chunks.172.mjs:2454-2460
// ============================================

// ORIGINAL (for source lookup):
function Ti(A) {
    if (!vA.isSandboxingEnabled()) return !1;
    if (A.dangerouslyDisableSandbox && vA.areUnsandboxedCommandsAllowed()) return !1;
    if (!A.command) return !1;
    if (yYz(A.command)) return !1;
    return !0
}

// READABLE (for understanding):
function shouldUseSandbox(input) {
    if (!sandboxConfig.isSandboxingEnabled()) return false;
    if (input.dangerouslyDisableSandbox && sandboxConfig.areUnsandboxedCommandsAllowed()) return false;
    if (!input.command) return false;
    if (isCommandInExcludedList(input.command)) return false;
    return true;
}

// Mapping: Ti->shouldUseSandbox, vA->sandboxConfig, yYz->isCommandInExcludedList
```

### Sandbox auto-allow bypass

**What it does:** When sandboxing is enabled and `isAutoAllowBashIfSandboxedEnabled()` is true, Bash commands that pass sandbox checks can bypass the normal permission prompt. The permission check shifts from "should the user approve this command?" to "does any rule explicitly deny this command prefix?".

**How it works in Tn8 (checkBashPermissions):**

```javascript
// ============================================
// Sandbox auto-allow path in checkBashPermissions
// Location: chunks.172.mjs:1987-1990
// ============================================

// ORIGINAL (for source lookup):
if (vA.isSandboxingEnabled() && vA.isAutoAllowBashIfSandboxedEnabled() && Ti(A)) {
    let B = VYz(A, Y.toolPermissionContext);
    if (B.behavior !== "passthrough") return B
}

// READABLE:
if (sandboxConfig.isSandboxingEnabled() && sandboxConfig.isAutoAllowBashIfSandboxedEnabled() && shouldUseSandbox(input)) {
    let sandboxPermResult = checkBashPermissionWithSandbox(input, appState.toolPermissionContext);
    if (sandboxPermResult.behavior !== "passthrough") return sandboxPermResult;
}
```

`VYz` (checkBashPermissionWithSandbox) uses prefix matching to check deny and ask rules. If the command matches a deny rule, it is blocked. If it matches an ask rule, the user is prompted. If neither, it falls through to "passthrough" which continues to the normal permission flow.

### Sandbox exception in BYz (canUseTool)

**What it does:** In `BYz` (canUseTool), at line 2729, when a global ask rule matches but the command would be sandboxed and auto-allow-if-sandboxed is enabled, the ask rule is bypassed:

```javascript
// ============================================
// Sandbox permission exception
// Location: chunks.172.mjs:2728-2736
// ============================================

// ORIGINAL (for source lookup):
let O = xYz(_.toolPermissionContext, A);
if (O) {
    if (!(A.name === Q7 && vA.isSandboxingEnabled() && vA.isAutoAllowBashIfSandboxedEnabled() && Ti(q)))
        return { behavior: "ask", decisionReason: { type: "rule", rule: O }, message: ow(A.name) }
}

// READABLE:
let matchingAskRule = matchesGlobalAskRule(appState.toolPermissionContext, tool);
if (matchingAskRule) {
    // Only enforce the ask rule if the command is NOT sandboxed with auto-allow
    if (!(tool.name === BASH_TOOL_NAME && sandboxConfig.isSandboxingEnabled()
          && sandboxConfig.isAutoAllowBashIfSandboxedEnabled() && shouldUseSandbox(input)))
        return { behavior: "ask", ... };
}
```

**Key insight:** This creates a layered security model: when sandbox is active and auto-allow is on, the sandbox itself provides the security boundary (filesystem/network isolation), so the permission prompt becomes redundant. But deny rules are never bypassed -- even sandboxed commands respect explicit denials.

---

## 5. Multi-Agent Teams (30_agent_teams)

### Worker-to-Leader permission forwarding

**What it does:** In team mode, worker agents cannot prompt the user directly -- only the leader agent has UI access. When a worker needs permission for a tool call, it sends a request to the leader via a mailbox-based message passing system and blocks until the leader responds.

**How it works:**

```
Worker Agent                            Leader Agent
============                            ============

1. Tool needs permission
   |
   v
2. SN1() creates permission request
   { id, workerId, toolName, input }
   |
   v
3. CN1() sends to leader mailbox  -->  4. Leader reads mailbox
   via Xx8() typed message                 Sees permission_request
   |                                       |
   v                                       v
5. bN1() registers callback            6. Shows permission UI to user
   in Cf6 Map (permissionCallbackMap)      User approves/denies
   Worker blocks on Promise                |
   |                                       v
   |                                    7. IN1() sends response
   |                                       via Px8() typed message
   |   <-- mailbox response --             |
   v
8. If6() processes response
   Finds callback in Cf6 Map
   Resolves Promise (allow/deny)
   |
   v
9. Tool executes or is denied
```

### Key functions:

```javascript
// ============================================
// createPermissionRequest - Build request object
// Location: chunks.134.mjs:950-972
// ============================================

// ORIGINAL (for source lookup):
function SN1(A) {
    let q = A.teamName || l5(),
        K = A.workerId || nM(),
        Y = A.workerName || i3();
    return {
        id: zNY(),                    // UUID
        workerId: K,
        workerName: Y,
        workerColor: z,
        teamName: q,
        toolName: A.toolName,
        toolUseId: A.toolUseId,
        description: A.description,
        input: A.input,
        permissionSuggestions: A.permissionSuggestions || [],
        status: "pending",
        createdAt: Date.now()
    }
}

// Mapping: SN1->createPermissionRequest, l5->getTeamName, nM->getWorkerId,
//          i3->getWorkerName, zNY->generateUUID
```

```javascript
// ============================================
// sendPermissionRequest - Post to leader mailbox
// Location: chunks.134.mjs:1006-1028
// ============================================

// ORIGINAL (for source lookup):
async function CN1(A) {
    let q = await ol4(A.teamName);           // Resolve leader name
    let K = Xx8({                             // Create typed message
        request_id: A.id,
        agent_id: A.workerName,
        tool_name: A.toolName,
        tool_use_id: A.toolUseId,
        description: A.description,
        input: A.input,
        permission_suggestions: A.permissionSuggestions
    });
    return await x3(q, {                      // Post to mailbox
        from: A.workerName,
        text: B6(K),
        timestamp: new Date().toISOString(),
        color: A.workerColor
    }, A.teamName);
}

// Mapping: CN1->sendPermissionRequest, ol4->getLeaderName, Xx8->createPermissionRequestMessage,
//          x3->postToMailbox
```

```javascript
// ============================================
// processPermissionResponse - Resolve worker's blocking promise
// Location: chunks.134.mjs:1154-1163
// ============================================

// ORIGINAL (for source lookup):
function If6(A) {
    let q = Cf6.get(A.requestId);
    if (!q) return !1;
    Cf6.delete(A.requestId);
    if (A.decision === "approved") {
        let K = A.permissionUpdates || [], Y = A.updatedInput;
        q.onAllow(Y, K)
    } else q.onReject(A.feedback);
    return !0
}

// READABLE:
function processPermissionResponse(response) {
    let callback = permissionCallbackMap.get(response.requestId);
    if (!callback) return false;
    permissionCallbackMap.delete(response.requestId);
    if (response.decision === "approved") {
        callback.onAllow(response.updatedInput, response.permissionUpdates);
    } else {
        callback.onReject(response.feedback);
    }
    return true;
}

// Mapping: If6->processPermissionResponse, Cf6->permissionCallbackMap
```

### submitSwarmPermissionRequest - Full worker flow

`tuq()` (submitSwarmPermissionRequest) at chunks.194.mjs:3 orchestrates the complete worker-side permission flow:

1. Checks if team mode is active via `E7()` (isTeamMode) and `ic6()` (isWorkerAgent)
2. Creates a permission request via `SN1()`
3. Registers a callback with `bN1()` that resolves/rejects a Promise
4. Sends the request to the leader via `CN1()`
5. Sets `pendingWorkerRequest` in app state so the UI can show a waiting indicator
6. Blocks on the Promise until the leader responds
7. On allow: calls `handleUserAllow()` with the (possibly updated) input
8. On reject: calls `cancelAndAbort()` with optional feedback

**Callback maps:**

| Map | Variable | Purpose |
|-----|----------|---------|
| Permission callbacks | `Cf6` (permissionCallbackMap) | Standard tool permission requests |
| Sandbox callbacks | `nc6` (sandboxCallbackMap) | Network permission requests from sandboxed commands |

**Key insight:** Permission responses can include `permissionUpdates` -- an array of permission rule changes that the leader wants applied to the worker's context. This allows the leader to grant "always allow" for a pattern after approving a single instance, reducing future prompts for the same operation.

---

## 6. File System (16_file_system)

### Per-tool permission delegation

**What it does:** Each file tool implements `checkPermissions()` which delegates to a specialized permission checker. The checker evaluates path-based deny/ask/allow rules and CWD auto-allow logic.

**How it works:**

| Tool | checkPermissions delegates to | Rule type |
|------|-------------------------------|-----------|
| FileReadTool (i5) | `ro()` (checkReadPermissions) | "read" rules |
| FileWriteTool (vj) | `N51()` (checkEditPermissions) | "edit" rules |
| EditTool | `N51()` (checkEditPermissions) | "edit" rules |
| Bash tool (J4) | `Tn8()` (checkBashPermissions) | "bash" command rules |

### Read tool permission cascade

`ro()` (checkReadPermissions) follows this decision cascade:

```
1. UNC path check -> DENY (Windows WebDAV attack prevention)
2. Path deny rules -> DENY if match
3. Path ask rules -> ASK if match
4. CWD auto-allow -> ALLOW if file is under CWD or additional working dirs
5. Path allow rules -> ALLOW if match
6. Fallback -> ASK
```

### Edit tool permission cascade

`N51()` (checkEditPermissions) follows the same cascade as `ro()` but uses "edit" rule type instead of "read". The key difference is that edit permissions are never auto-allowed by CWD proximity alone in some contexts -- the `checkPathDenyRule` (Gj) function is also called during `validateInput` to catch denied paths before they reach the permission stage.

### Path deny rule matching

`checkPathDenyRule` resolves the file path to an absolute path and matches it against deny rules. The rules can specify:
- Exact file paths
- Directory prefixes (e.g., `/etc/` denies all files under `/etc`)
- Glob patterns (e.g., `*.env` denies all `.env` files)

```javascript
// ============================================
// FileWriteTool validateInput - Early deny rule check
// Location: chunks.146.mjs (from FileWriteTool definition)
// ============================================

// ORIGINAL (for source lookup):
async validateInput({ file_path: A }, q) {
    let K = g4(A), Y = await q.getAppState();
    if (Gj(K, Y.toolPermissionContext, "edit", "deny") !== null)
        return { result: !1, message: "File is in a directory that is denied by your permission settings.", errorCode: 1 };
}

// READABLE:
async validateInput({ file_path }, context) {
    let resolvedPath = resolvePath(file_path);
    let appState = await context.getAppState();
    if (checkPathDenyRule(resolvedPath, appState.toolPermissionContext, "edit", "deny") !== null) {
        return { result: false, message: "File is in a directory that is denied by your permission settings." };
    }
}
```

**Key insight:** The deny check in `validateInput` happens at stage 2 (before hooks and permission checks). This means denied paths are rejected immediately without triggering any hooks or showing a permission dialog. This is a performance optimization and also a security measure -- it prevents hooks from overriding file path denials.

---

## 7. CLI Integration (01_cli)

### Permission context from CLI flags

**What it does:** CLI flags feed into the `toolPermissionContext` via the `Ez` reducer. The reducer applies immutable transformations to build the permission context from multiple sources.

**CLI flags that affect permission:**

| Flag | Effect | Maps to |
|------|--------|---------|
| `--allowedTools` / `--allowed-tools` | Whitelist specific tools | `tools` field in toolOptions |
| `--disallowedTools` / `--disallowed-tools` | Blacklist specific tools | `disallowedTools` field in toolOptions |
| `--dangerously-skip-permissions` | Set mode to `"bypassPermissions"` | `mode` field in toolPermissionContext |
| `--permission-mode` | Set explicit mode | `mode` field |

### Permission context reducer

`Ez` (permissionContextReducer) handles six action types that modify the permission context:

```javascript
// ============================================
// permissionContextReducer - Immutable permission state updates
// Location: chunks.53.mjs:1224-1294
// ============================================

// ORIGINAL (for source lookup):
function Ez(A, q) {
    switch (q.type) {
        case "setMode":     return { ...A, mode: q.mode };
        case "addRules":    // Adds rules to alwaysAllowRules/alwaysDenyRules/alwaysAskRules
        case "replaceRules": // Replaces all rules for a destination+behavior
        case "addDirectories": // Adds to additionalWorkingDirectories
        case "removeRules":  // Removes specific rules
        case "removeDirectories": // Removes from additionalWorkingDirectories
    }
}

// Mapping: Ez->permissionContextReducer
```

**Rule destinations (sources):**

| Destination | Persistence | Editable at runtime |
|------------|-------------|---------------------|
| `policySettings` | Organization-managed | No |
| `flagSettings` | CLI flags | No |
| `command` | SDK commands | No |
| `localSettings` | `.claude/settings.local.json` | Yes |
| `projectSettings` | `.claude/settings.json` | Yes |
| `userSettings` | `~/.claude/settings.json` | Yes |
| `cliArg` | CLI arguments | Append-only |
| `session` | In-memory only | Yes |

### Tool filtering via resolveToolSet

`_c()` (resolveToolSet) at chunks.93.mjs:1590 combines `Xk8` (filterToolsByMode) with disallowed-tools exclusion:

```javascript
// ORIGINAL (for source lookup):
function _c(A, q, K = !1, Y = !1) {
    let { tools: z, disallowedTools: _, source: w, permissionMode: O } = A,
        $ = Y ? q : Xk8({ tools: q, isBuiltIn: w === "built-in", isAsync: K, permissionMode: O }),
        H = new Set(_?.map((G) => { let { toolName: f } = CH(G); return f }) ?? []),
        j = $.filter((G) => !H.has(G.name));
    if (z === void 0 || z.length === 1 && z[0] === "*") return { hasWildcard: !0, validTools: [], invalidTools: [], resolvedTools: j };
    // ... explicit tool matching ...
}

// Mapping: _c->resolveToolSet, Xk8->filterToolsByMode, CH->parseToolSpec
```

---

## 8. Hook System (11_hooks)

### PreToolUse permission override

**What it does:** Hooks registered for the `PreToolUse` event can return `permissionDecision` in their JSON output to override the normal permission flow. This is the primary mechanism for automated permission management.

**Decision options:**

| `permissionDecision` | Internal behavior | Effect |
|---------------------|-------------------|--------|
| `"allow"` | `"allow"` | Skip user prompt (unless `requiresUserInteraction`) |
| `"deny"` | `"deny"` | Block tool with error message |
| `"ask"` | `"ask"` | Force user prompt even if auto-allow rules match |

### Multi-hook aggregation priority

When multiple hooks provide permission decisions, the aggregation in `Ax()` follows strict priority:

```
deny > ask > allow > passthrough
```

- `"deny"` is sticky: once any hook denies, no subsequent hook can override it
- `"ask"` dominates `"allow"`: if any hook says ask, the user is prompted
- `"allow"` is first-wins: only the first allow takes effect, later allows are ignored
- `"passthrough"` is a no-op: has no effect on the aggregated decision

### Hook source priority

Hooks are merged from sources in this order (by `E_z`):

| Order | Source | Example |
|-------|--------|---------|
| 1 | Policy | Organization-managed hooks |
| 2 | Project | `.claude/settings.json` hooks |
| 3 | Plugin | PLUGIN.toml-contributed hooks |
| 4 | Session | Dynamically registered hooks |
| 5 | User | `~/.claude/settings.json` hooks |

In managed-only mode (`GL()` returns true), only policy and non-plugin project hooks execute.

---

## 9. canUseTool Decision Cascade

### BYz - The central permission decision function

**What it does:** `BYz` (canUseTool) is the single function that makes the final permission decision for any tool call. It evaluates rules in a strict cascade from most restrictive to most permissive.

**How it works:**

```
BYz(tool, input, toolUseContext, assistantMessage, toolUseId)
    |
    v
Layer 1: Abort check
    signal.aborted? -> throw AbortError
    |
Layer 2: Global deny rules (bYz)
    Any deny rule matches tool? -> DENY
    |
Layer 3: Global ask rules (xYz)
    Any ask rule matches tool? -> ASK
    (Exception: Bash + sandbox + auto-allow -> skip ask)
    |
Layer 4: Tool-specific checkPermissions()
    tool.checkPermissions(input, context) -> DENY/ASK/ALLOW/PASSTHROUGH
    |
Layer 5: Early returns for deny/requiresUserInteraction/explicit-ask-rule
    deny -> DENY
    requiresUserInteraction + ask -> ASK
    ask with rule-based reason -> ASK
    |
Layer 6: Mode-based bypass
    mode === "bypassPermissions" -> ALLOW
    mode === "plan" + isBypassPermissionsModeAvailable -> ALLOW
    |
Layer 7: Global allow rules (IYz)
    Any allow rule matches tool? -> ALLOW
    |
Layer 8: Fallback
    passthrough -> convert to ASK
    Everything else -> return as-is
```

```javascript
// ============================================
// canUseTool - Central permission decision
// Location: chunks.172.mjs:2715-2776
// ============================================

// ORIGINAL (for source lookup):
async function BYz(A, q, K, Y, z) {
    if (K.abortController.signal.aborted) throw new oY;
    let _ = K.getAppState(),
        w = bYz(_.toolPermissionContext, A);           // Layer 2: deny
    if (w) return { behavior: "deny", ... };
    let O = xYz(_.toolPermissionContext, A);           // Layer 3: ask
    if (O) {
        if (!(A.name === Q7 && vA.isSandboxingEnabled() && vA.isAutoAllowBashIfSandboxedEnabled() && Ti(q)))
            return { behavior: "ask", ... };
    }
    let $ = { behavior: "passthrough", ... };
    try {
        let M = A.inputSchema.parse(q);
        $ = await A.checkPermissions(M, K)             // Layer 4: tool-specific
    } catch (M) { ... }
    if ($?.behavior === "deny") return $;               // Layer 5: early returns
    if (A.requiresUserInteraction?.() && $?.behavior === "ask") return $;
    if ($?.behavior === "ask" && $.decisionReason?.type === "rule" ...) return $;
    if (_.toolPermissionContext.mode === "bypassPermissions" ||    // Layer 6: mode bypass
        _.toolPermissionContext.mode === "plan" && _.toolPermissionContext.isBypassPermissionsModeAvailable)
        return { behavior: "allow", ... };
    let j = IYz(_.toolPermissionContext, A);           // Layer 7: allow rules
    if (j) return { behavior: "allow", ... };
    let J = $.behavior === "passthrough" ?              // Layer 8: fallback
        { ...$, behavior: "ask", ... } : $;
    return J;
}

// Mapping: BYz->canUseTool, bYz->matchesGlobalDenyRule, xYz->matchesGlobalAskRule,
//          IYz->matchesGlobalAllowRule, Ti->shouldUseSandbox, oY->AbortError,
//          Q7->BASH_TOOL_NAME, vA->sandboxConfig
```

---

## Integration Summary Table

| Component | Section | Key Symbol | Readable Name | Data Flow Direction |
|-----------|---------|------------|---------------|---------------------|
| CLI | 01_cli | Ez | permissionContextReducer | CLI flags -> toolPermissionContext |
| CLI | 01_cli | _v | applyPermissionUpdates | Batched updates -> context |
| CLI | 01_cli | Xk8 | filterToolsByMode | permissionMode -> tool filtering |
| CLI | 01_cli | _c | resolveToolSet | disallowedTools + mode -> final tool set |
| System Reminders | 04_system_reminder | $w | buildHookContext | permissionMode -> hook payload |
| System Reminders | 04_system_reminder | tuY | getAsyncHookResponseAttachments | Hook results -> system reminders |
| Tools | 05_tools | fxY | toolExecutionPipeline | Hook result + BYz -> execution decision |
| Tools | 05_tools | y4q | executePreToolHooksIterator | LF8 results -> typed pipeline events |
| Tools | 05_tools | BYz | canUseTool | Rules + tool check -> allow/deny/ask |
| Hooks | 11_hooks | LF8 | executePreToolHooks | Tool name + mode -> hook execution |
| Hooks | 11_hooks | Ax | executeHooksIterator | Hook outputs -> aggregated permission |
| Hooks | 11_hooks | kr8 | resolveHooksForEvent | Event name -> matched hooks |
| Hooks | 11_hooks | E_z | mergeHookSources | All sources -> flat hook list |
| Plan Mode | 12_plan_mode | Xk8 | filterToolsByMode | "plan" mode -> read-only tools |
| Plan Mode | 12_plan_mode | Z01 | evaluateBashCommandReadiness | Command -> read-only determination |
| File System | 16_file_system | ro | checkReadPermissions | Path + rules -> read permission |
| File System | 16_file_system | N51 | checkEditPermissions | Path + rules -> edit permission |
| File System | 16_file_system | Gj | checkPathDenyRule | Path + rules -> deny match |
| Sandbox | 18_sandbox | Ti | shouldUseSandbox | Command -> sandbox decision |
| Sandbox | 18_sandbox | VYz | checkBashPermissionWithSandbox | Sandboxed command -> prefix rule check |
| Sandbox | 18_sandbox | Tn8 | checkBashPermissions | Command -> full bash permission cascade |
| Sandbox | 18_sandbox | cr6 | checkBashRuleMatch | Command -> exact rule match |
| Agent Teams | 30_agent_teams | SN1 | createPermissionRequest | Tool call -> mailbox request |
| Agent Teams | 30_agent_teams | CN1 | sendPermissionRequest | Request -> leader mailbox |
| Agent Teams | 30_agent_teams | IN1 | sendPermissionResponse | Leader decision -> worker mailbox |
| Agent Teams | 30_agent_teams | If6 | processPermissionResponse | Mailbox response -> promise resolution |
| Agent Teams | 30_agent_teams | tuq | submitSwarmPermissionRequest | Worker -> leader -> worker flow |
| Agent Teams | 30_agent_teams | bN1 | registerPermissionCallback | Request ID -> callback map |
| Config | common/config | U84 | refreshPermissionRules | Settings reload -> context update |

---

## End-to-End Permission Flow

A complete permission decision for a single tool call traverses these layers:

```
1. CLI startup
   --allowed-tools, --dangerously-skip-permissions
   -> Ez() builds initial toolPermissionContext
   -> U84() loads rules from settings files

2. Tool set assembly
   -> Xk8() filters by permissionMode (plan/default)
   -> _c() excludes disallowed tools

3. Tool use arrives from LLM
   -> Wi6() (toolDispatcher) finds tool in registry
   -> fxY() begins pipeline

4. Pre-hook stage
   -> y4q() calls LF8() with permission_mode
   -> LF8() calls $w() to inject mode into hook context
   -> Ax() runs hooks, aggregates permission decisions
   -> y4q() yields hookPermissionResult to fxY

5. Permission check stage
   -> fxY evaluates hook result vs requiresUserInteraction
   -> If needed, calls BYz() (canUseTool)
   -> BYz layers: deny rules -> ask rules -> tool.checkPermissions() -> mode bypass -> allow rules

6. Tool-specific permission
   -> Read: ro() checks path rules + CWD auto-allow
   -> Write/Edit: N51() checks path rules
   -> Bash: Tn8() checks command safety + sandbox + rule matching

7. User interaction (if ASK)
   -> Single agent: Show permission dialog
   -> Team worker: tuq() sends request via CN1() to leader mailbox
   -> Leader approves/denies via IN1()
   -> Worker resolves via If6()

8. Post-decision
   -> Telemetry logged (source: hook/config/mode/user)
   -> Tool executes or returns error
   -> Post-hooks run (RF8)
```
