# `canUseTool` Flow — Bridge & Layering (v2.1.142)

**Theme:** Every tool call in Claude Code passes through a `canUseTool` callback before execution. In the **interactive** path it's a React hook (`useCanUseTool`) that drives the UI prompt. In the **SDK** path it's the host's `Options.canUseTool` callback or the `permissionPromptToolName` indirection. In the **headless** path there's no `canUseTool` — the static chain alone decides.

This document maps the runtime mechanism: how `canUseTool` is wired, who provides it, how it layers with `tD`/`UA5`, and how the SDK's bridge exchanges messages with the host.

For the **deterministic policy chain** that sits underneath all `canUseTool` variants, see [`architecture.md`](./architecture.md) §3 (`UA5`). For **what the user sees** when the interactive variant fires, see [`permission_dialog_ui.md`](./permission_dialog_ui.md). For **what the model sees after denial**, see [`reminder_interaction.md`](./reminder_interaction.md).

---

## 1. The CanUseToolFn Type

```typescript
// v2.1.88 src/hooks/useCanUseTool.tsx:27
export type CanUseToolFn<Input extends Record<string, unknown> = Record<string, unknown>> = (
  tool: ToolType,
  input: Input,
  toolUseContext: ToolUseContext,
  assistantMessage: AssistantMessage,
  toolUseID: string,
  forceDecision?: PermissionDecision<Input>,
) => Promise<PermissionDecision<Input>>;
```

A `canUseTool` function:
1. Takes a tool, its input, surrounding context, and the assistant message that triggered the call
2. Returns a Promise resolving to a `PermissionDecision` (`{behavior: "allow"|"deny", updatedInput?, decisionReason?, message?}`)
3. Optionally accepts a `forceDecision` to short-circuit the check (used by resume paths that already have a decision)

The contract is intentionally minimal: callers don't know whether the function is talking to a UI, a remote SDK, or anything else.

### Where it's called from

Every tool dispatch site in the agent loop calls `canUseTool(...)` and awaits the result. The result then drives:
- Tool runs (`allow`) — with `updatedInput` substituted if the caller rewrote inputs
- Tool deny envelope (`deny`) — see [`reminder_interaction.md`](./reminder_interaction.md) §1
- The function never returns `ask` to the dispatch site — `ask` is internal; by the time the function resolves, the user/SDK has already converted it to allow or deny

---

## 2. Three Providers of `canUseTool`

### 2a. Interactive path — `useCanUseTool` hook

```typescript
// v2.1.88 src/hooks/useCanUseTool.tsx:29-200 (excerpt)
function useCanUseTool(setToolUseConfirmQueue, setToolPermissionContext) {
  return async (tool, input, toolUseContext, assistantMessage, toolUseID, forceDecision) =>
    new Promise(resolve => {
      const ctx = createPermissionContext(tool, input, toolUseContext, assistantMessage, toolUseID,
        setToolPermissionContext, createPermissionQueueOps(setToolUseConfirmQueue));
      if (ctx.resolveIfAborted(resolve)) return;
      
      const decisionPromise = forceDecision !== undefined
        ? Promise.resolve(forceDecision)
        : hasPermissionsToUseTool(tool, input, toolUseContext, assistantMessage, toolUseID);
      
      return decisionPromise.then(async result => {
        // Result is { behavior: "allow" | "ask" | "deny" }
        // Note: passthrough was already converted to ask by tD/UA5
        if (result.behavior === "allow") {
          /* resolve with allow */
        }
        switch (result.behavior) {
          case "deny":
            /* resolve with deny */
            break;
          case "ask": {
            // Try coordinator handler (multi-agent-teams) first
            if (appState.toolPermissionContext.awaitAutomatedChecksBeforeDialog) {
              const coordinatorDecision = await handleCoordinatorPermission({ ... });
              if (coordinatorDecision) { resolve(coordinatorDecision); return; }
            }
            // Try swarm-worker handler
            const swarmDecision = await handleSwarmWorkerPermission({ ... });
            if (swarmDecision) { resolve(swarmDecision); return; }
            // Try speculative classifier check for Bash
            if (feature("BASH_CLASSIFIER") && result.pendingClassifierCheck && tool.name === BASH_TOOL_NAME) {
              const speculativeResult = await peekSpeculativeClassifierCheck(input.command);
              if (speculativeResult?.matches && speculativeResult.confidence === "high") {
                resolve(ctx.buildAllow(...));
                return;
              }
            }
            // Fall through to actual UI prompt
            handleInteractivePermission({ ctx, description, result, ... }, resolve);
            return;
          }
        }
      });
    });
}
```

The interactive hook **wraps `hasPermissionsToUseTool` (`tD`)** with:
1. A coordinator-mode short-circuit (for multi-agent-teams coordinator)
2. A swarm-worker handler (for in-process teammates)
3. A speculative classifier check (Bash fast-path)
4. The interactive prompt fallback

### 2b. SDK path — `Options.canUseTool`

When using Claude Code as a library (the `@anthropic-ai/claude-agent-sdk` package), the consumer can supply their own callback:

```typescript
import { Anthropic, Options } from '@anthropic-ai/claude-agent-sdk';

const options: Options = {
  canUseTool: async (toolName, input, { signal, suggestions, blockedPath }) => {
    // Custom logic: maybe show a dialog, maybe consult an audit log, etc.
    if (toolName === 'Bash' && input.command.startsWith('rm')) {
      return { behavior: 'deny', message: 'rm commands not permitted in this SDK session' };
    }
    return { behavior: 'allow', updatedInput: input };
  },
};
```

The bridge code (cli_inner_pretty.js:498918-498922) routes:

```javascript
// ============================================
// SDK canUseTool bridge - Process control request
// Location: cli_inner_pretty.js:498918-498922
// ============================================

// ORIGINAL (for source lookup):
async processControlRequest(H, $) {
  if (H.request.subtype === "can_use_tool") {
    if (!this.canUseTool) throw Error("canUseTool callback is not provided.");
    return {
      ...(await this.canUseTool(H.request.tool_name, H.request.input, {
        signal: $,
        suggestions: H.request.permission_suggestions,
        blockedPath: H.request.blocked_path,
        // ... other context fields
      })),
    };
  }
}

// READABLE (for understanding):
async processControlRequest(request, abortSignal) {
  if (request.request.subtype === "can_use_tool") {
    if (!this.canUseTool) {
      throw new Error("canUseTool callback is not provided.");
    }
    // Call the SDK consumer's callback with the bridge-transferred request
    return {
      ...(await this.canUseTool(
        request.request.tool_name,
        request.request.input,
        {
          signal: abortSignal,
          suggestions: request.request.permission_suggestions,
          blockedPath: request.request.blocked_path,
        }
      )),
    };
  }
}

// Mapping: H→request, $→abortSignal
```

The host callback is invoked via the **control protocol** — a request-response message channel between the CLI process and the SDK host. The CLI sends a `can_use_tool` request; the host's `canUseTool` runs; the host sends back a response; the CLI proceeds.

### 2c. `permissionPromptToolName` indirection

The SDK can alternatively specify a **tool name** that handles permission prompts:

```typescript
const options: Options = {
  permissionPromptToolName: 'mcp__my-server__handle_permission',
};
```

When set, the CLI dispatches permission decisions through this tool — calling `mcp__my-server__handle_permission` with the would-be tool call as input, and reading its `tool_result` for the decision.

The mutual exclusion is enforced (cli_inner_pretty.js:498428):

```javascript
if (R) {  // canUseTool callback present
  if (Z)  // permissionPromptToolName also present
    throw Error("canUseTool callback cannot be used with permissionPromptToolName. Please use one or the other.");
  F.push("--permission-prompt-tool", "stdio");
} else if (Z) F.push("--permission-prompt-tool", Z);
```

Why mutually exclusive? Both options serve the same purpose (let the SDK consumer decide). Allowing both would create order-of-operations ambiguity (does the tool fire first, then the callback? or vice versa?). Forcing a choice keeps the bridge protocol clean.

### 2d. Headless path — no `canUseTool`

In `claude --print` mode without any SDK setup, there is no `canUseTool` provider. The fallback pattern appears at every dispatch site, e.g. in the `/fork` slash command handler:

```javascript
// cli_inner_pretty.js:511639 (call site within /fork command — Tb5)
let _ = await lR6(K, $, $.canUseTool ?? tD);
```

`$.canUseTool ?? tD` — if no `canUseTool` is registered on the toolUseContext, fall back directly to `tD` (the static policy chain). `lR6` (defined at cli_inner_pretty.js:427943) is the fork-subagent spawn entry point; the same `?? tD` pattern recurs throughout the codebase wherever a dispatch needs a `canUseTool` value.

When the fallback path runs `tD` directly without a wrapper, any `ask` verdict has nowhere to go — there's no UI to prompt with. The static chain alone decides; ask verdicts are converted to `deny` (via `dontAsk` mode or the absence of an interactive prompt mechanism).

In practice headless runs use:
- `--permission-mode dontAsk` (explicit silent deny on ask)
- `--allowed-tools` (whitelist specific tools)
- `--dangerously-skip-permissions` (bypass mode)

Or they fail with "Permission required for tool X" error.

---

## 3. The Bridge Protocol

The SDK ↔ CLI communication uses a structured request/response protocol. Key request types relevant to permissions:

### `can_use_tool` request

```typescript
// CLI → SDK (request)
{
  request_id: "uuid",
  subtype: "can_use_tool",
  tool_name: "Bash",
  input: { command: "ls" },
  permission_suggestions: [/* PermissionUpdate[] */],
  blocked_path?: "/etc/secrets",  // if relevant
}

// SDK → CLI (response)
{
  request_id: "uuid",
  behavior: "allow" | "deny",
  updatedInput?: { ... },   // for allow
  message?: "...",           // for deny
  decisionReason?: { type: "other", reason: "..." },
}
```

### `permission_request` envelope (alternative path)

When the SDK uses a `permissionPromptToolName`, the CLI sends a structured `permission_request` (see [`reminder_interaction.md`](./reminder_interaction.md) §4):

```javascript
// cli_inner_pretty.js:239298-239309 (PD6 = buildPermissionRequest)
function PD6(H) {
  return {
    type: "permission_request",
    request_id: H.requestId,
    agent_id: H.agentId,
    tool_name: H.toolName,
    tool_use_id: H.toolUseId,
    description: H.description,
    input: H.input,
    permission_suggestions: H.permissionSuggestions,
  };
}
```

The receiving SDK invokes its `permissionPromptToolName` tool with this envelope as input. The tool's `tool_result` is then parsed for the decision.

### Decision classification

When using `permissionPromptToolName`, the result must include a `decisionClassification`:

```javascript
// cli_inner_pretty.js:387733-387737
case "permissionPromptTool": {
  // Extract decisionClassification from toolResult
  // Maps to: "user_temporary" | "user_permanent" | "user_reject"
}
```

- `user_temporary` → behavior: "allow" (single use)
- `user_permanent` → behavior: "allow" + suggest the SDK persist the rule
- `user_reject` → behavior: "deny"

This is a more structured response than `canUseTool`'s direct allow/deny — the SDK's permission tool can express intent ("yes, just this once" vs "yes, save the rule"), and the CLI's prompt-state machine reads it accordingly.

---

## 4. Layering — SDK Doesn't Bypass Static Chain

A critical invariant: **the SDK's `canUseTool` cannot bypass the static policy chain** (deny rules, mode constraints).

The sequence:

```
   Tool call arrives
        │
        ▼
   tD/UA5 runs FIRST (static chain)
        │
        ├──► If deny → return deny (SDK never sees this)
        ├──► If allow → return allow (SDK never sees this)
        └──► If ask:
                │
                ▼
        If SDK canUseTool registered:
            │
            ▼
        Send can_use_tool request
            │
            ▼
        SDK responds with allow|deny
            │
            ▼
        Return SDK's decision
```

The static chain runs **before** `canUseTool` consultation. Why?

- **Performance**: a deny rule denies without round-tripping to the SDK host.
- **Security**: an SDK consumer can't accidentally override a user's `Bash(rm:*)` deny by being too permissive.
- **Determinism**: the SDK only sees the *uncertain* cases (ask verdicts), not every tool call.

If the SDK *wants* to override allow, it has to grant permission via the response. But it cannot override deny — that's by design.

### Where the layering is enforced

In the interactive path, the layering is in `useCanUseTool`:

```typescript
const decisionPromise = forceDecision !== undefined
  ? Promise.resolve(forceDecision)
  : hasPermissionsToUseTool(tool, input, toolUseContext, ...);

return decisionPromise.then(async result => {
  if (result.behavior === "allow") { /* short-circuit */ }
  if (result.behavior === "deny") { /* short-circuit */ }
  if (result.behavior === "ask") {
    /* THIS is where SDK / coordinator / swarm / interactive handlers compete */
  }
});
```

For headless SDK with `canUseTool`, the static chain is in `tD` itself (called via `lR6(K, $, $.canUseTool ?? tD)`). The fallback structure ensures static chain still runs.

---

## 5. Coordinator and Swarm Worker Pre-handlers

Before falling through to the interactive UI, the hook tries two pre-handlers:

### `handleCoordinatorPermission`

For sessions running in **coordinator mode** (multi-agent-teams lead), permission decisions can be delegated to the team's permission policy. The handler:

```typescript
// v2.1.88 src/hooks/toolPermission/handlers/coordinatorHandler.ts
async function handleCoordinatorPermission({ ctx, pendingClassifierCheck, updatedInput, suggestions, permissionMode }) {
  // If coordinator mode is active, the lead's permission policy decides.
  // Returns a decision or undefined (= "fall through to next handler").
}
```

When set, the coordinator's `permission_policy.json` (the team's central policy) is consulted. If the policy has an explicit allow/deny for this action, return it; otherwise undefined.

### `handleSwarmWorkerPermission`

For in-process **teammates** (subagents in the team), permission decisions can be deferred to the team's lead via the **mailbox protocol**:

```typescript
// v2.1.88 src/hooks/toolPermission/handlers/swarmWorkerHandler.ts
async function handleSwarmWorkerPermission({ ctx, description, pendingClassifierCheck, updatedInput, suggestions }) {
  // Send a permission_request to the team's mailbox.
  // The lead picks it up, decides, sends back.
  // Returns the decision or undefined.
}
```

This lets the team lead see and approve all teammates' permission prompts in one centralized inbox — a UX pattern for multi-agent supervision.

### Order matters

`handleCoordinatorPermission` runs first, then `handleSwarmWorkerPermission`, then the interactive prompt. The order encodes "central policy first, then mailbox, then local UI." Each handler returns either a decision (short-circuit) or undefined (fall through).

---

## 6. Speculative Classifier — Bash Fast-path

When the user types `Bash(npm test)` and a previous similar command was approved, the classifier may have **pre-computed** a decision asynchronously. The speculative check picks it up:

```typescript
// v2.1.88 src/hooks/useCanUseTool.tsx (around line 150)
if (feature("BASH_CLASSIFIER") && result.pendingClassifierCheck && tool.name === BASH_TOOL_NAME
    && !appState.toolPermissionContext.awaitAutomatedChecksBeforeDialog) {
  const speculativePromise = peekSpeculativeClassifierCheck(input.command);
  if (speculativePromise) {
    const raceResult = await Promise.race([
      speculativePromise.then(/* result handler */),
      new Promise(/* timeout */)
    ]);
    if (raceResult.type === "result" && raceResult.result.matches && raceResult.result.confidence === "high") {
      consumeSpeculativeClassifierCheck(input.command);
      // Allow!
      resolve(ctx.buildAllow(input, {
        decisionReason: {
          type: "classifier",
          classifier: "bash_allow",
          reason: `Allowed by prompt rule: "${raceResult.result.matchedDescription}"`
        }
      }));
      return;
    }
  }
}
```

### What's "speculative"?

The classifier ordinarily runs synchronously when the user is about to be prompted. But for *frequent* commands (npm, git, etc.), the system runs the classifier **ahead of time** — when a prior similar command was approved, the system kicks off a background classifier run for variations.

When the same command comes up again, the speculative result is already cached. The hook checks the cache; if `confidence === "high"` and `matches === true`, allow without prompting.

### Why?

- **Latency**: skipping the prompt saves 1-3 seconds per Bash command.
- **User comfort**: "this is the 5th `npm test` you've allowed; I'll just do it" is the right UX.
- **Safety preserved**: only `high` confidence matches; lower confidence still prompts.

---

## 7. The `forceDecision` Parameter

The `canUseTool` signature includes `forceDecision?: PermissionDecision<Input>`. When passed, it short-circuits the entire chain:

```typescript
const decisionPromise = forceDecision !== undefined
  ? Promise.resolve(forceDecision)
  : hasPermissionsToUseTool(tool, input, toolUseContext, assistantMessage, toolUseID);
```

### When is it used?

1. **Resume**: a resumed session has a saved decision for a pending tool call; pass it as forceDecision.
2. **Test suites**: integration tests can inject decisions without setting up the full UI.
3. **Programmatic auto-approve**: scripts that want to "approve this specific call" without going through rule modification.

### Why an out-of-band parameter, not a config?

A config-based force would be global per-session. The parameter is per-call. This lets a script say "force-allow this one call" without affecting subsequent calls.

---

## 8. The `applyHookPermissionDecision` Bridge

When a `PreToolUse` or `PermissionRequest` hook returns a decision, the agent loop needs to translate the hook output into the `PermissionDecision` shape. The function is `applyHookPermissionDecision` (cli_inner_pretty.js around 520649):

```typescript
// Conceptual shape:
function applyHookPermissionDecision(hookOutput, currentVerdict) {
  if (hookOutput.permissionDecision === "allow") {
    return { behavior: "allow", updatedInput: hookOutput.updatedInput, decisionReason: { type: "hook", hookName, ... } };
  }
  if (hookOutput.permissionDecision === "deny") {
    return { behavior: "deny", message: hookOutput.message, decisionReason: { type: "hook", hookName, ... } };
  }
  if (hookOutput.permissionDecision === "ask") {
    return { behavior: "ask", message: hookOutput.message, decisionReason: { type: "hook", hookName, ... } };
  }
  if (hookOutput.permissionDecision === "defer" || !hookOutput.permissionDecision) {
    return currentVerdict;  // pass through unchanged
  }
}
```

The hook's output thus **layers on top** of the static-chain verdict. If the hook says `defer`, the static-chain verdict stands; if the hook says anything else, the hook's decision wins (modulo the v2.1.110 deny re-check for `allow + updatedInput`).

### `oiH` re-check (v2.1.110)

The v2.1.110 fix wraps the layering with `oiH` (cli_inner_pretty.js:421627):

```javascript
function oiH(secondPassResult, toolName) {
  if (secondPassResult?.behavior === "deny" || secondPassResult?.behavior === "ask") {
    log(`PermissionRequest hook allowed ${toolName} with updatedInput, but ${secondPassResult.behavior} rule overrides`);
    return secondPassResult;
  }
  return null;
}
```

When a hook says `allow + updatedInput`, the static chain re-runs on the new input. If a deny rule now matches the rewritten input, the deny wins. See [`architecture.md`](./architecture.md) step 7 for the full discussion.

---

## 9. The Headless / Background Path

For background agents and `--print` mode, the canUseTool plumbing simplifies. The fallback pattern shows up at many dispatch sites — e.g. the `/fork` slash command handler at cli_inner_pretty.js:511639:

```javascript
// cli_inner_pretty.js:511639 (inside the /fork command's Tb5 handler)
let _ = await lR6(K, $, $.canUseTool ?? tD);
```

`lR6` (cli_inner_pretty.js:427943) is the **fork-subagent spawn entry point**. The relevant pattern here is the third argument:
- Directive (prompt string)
- Tool use context
- A `canUseTool` function (or `tD` directly via `?? tD` fallback)

For background agents, `$.canUseTool` is typically undefined or a wrapper that:
- Honors the bg agent's `permissionMode` (preserveMode pattern from v2.1.141)
- Falls back to `dontAsk` semantics for unprompt-able situations

For `--print`, it's the SDK's callback if registered, else `tD` direct fallback.

This unification means **all paths converge on `tD`** — interactive, SDK, headless. The wrapper functions differ; the underlying decision logic is the same.

---

## 10. The Async / Race Architecture

The interactive path uses a **race-based architecture**:

```typescript
// Conceptual structure of handleInteractivePermission:
function handleInteractivePermission({ ctx, description, result, ... }, resolve) {
  const { resolve: resolveOnce, isResolved, claim } = createResolveOnce(resolve);
  
  // Push prompt onto queue (renders the UI)
  ctx.queue.push({
    onAllow: (updatedInput) => { claim() && resolveOnce({behavior: "allow", updatedInput, ...}); },
    onReject: (message) => { claim() && resolveOnce({behavior: "deny", message, ...}); },
    onAbort: () => { claim() && resolveOnce(ABORT_RESULT); },
    recheckPermission: () => { /* see below */ },
  });

  // In parallel: run hooks asynchronously, race with user interaction
  runHooksInParallel().then(hookDecision => {
    if (!isResolved() && hookDecision) {
      claim() && resolveOnce(hookDecision);  // hook beat user
    }
  });

  // Bash classifier check (if pending)
  if (pendingClassifierCheck) {
    runClassifierAsync().then(classifierDecision => {
      if (!isResolved() && classifierDecision) {
        claim() && resolveOnce(classifierDecision);  // classifier beat user
      }
    });
  }
}
```

### Why race?

A permission prompt has three potential answerers:
1. **The user** (clicks Yes/No)
2. **A hook** (PermissionRequest returns allow/deny)
3. **The classifier** (in auto mode, decides yes/no)

Any of them can complete first. The race architecture means whichever completes first wins; the others are no-ops.

The `createResolveOnce` + `claim()` pattern ensures **exactly one** decision is honored. Subsequent attempts (e.g., the user clicks Yes right as the classifier returns Deny) are dropped.

### Mode-change re-eval

The `recheckPermission` callback (called by `eJH` after mode change) doesn't resolve directly. Instead:

```typescript
recheckPermission: async () => {
  const newVerdict = await hasPermissionsToUseTool(tool, input, toolUseContext, ...);
  if (newVerdict.behavior === "allow") {
    claim() && resolveOnce(newVerdict);  // close prompt
  } else if (newVerdict.behavior === "deny") {
    claim() && resolveOnce(newVerdict);  // close prompt with deny
  }
  // else: still ask — leave prompt open
}
```

Re-eval respects the same race semantics. If the prompt is already resolved (user clicked Yes before mode change), the recheck is a no-op.

---

## 11. Cross-Validation with v2.1.88

The `useCanUseTool` hook is **identical in shape** between v2.1.88 (TS source) and v2.1.142 (bundle). The TypeScript reference at `src/hooks/useCanUseTool.tsx` describes the bundle's exact behavior.

The `processControlRequest` SDK bridge (cli_inner_pretty.js:498918) has the same structure in v2.1.88 (`src/sdk/control-protocol.ts` or similar). The `can_use_tool` request type is part of the long-stable SDK protocol.

The `permissionPromptToolName` mechanism is in v2.1.88 (`src/cli.ts` and bridge code) — its `decisionClassification` field for `user_temporary | user_permanent | user_reject` predates v2.1.142.

The `handleCoordinatorPermission` / `handleSwarmWorkerPermission` handlers are v2.1.88 files (`src/hooks/toolPermission/handlers/`). The multi-agent-teams permission delegation is a long-standing feature.

The speculative Bash classifier check is v2.1.88 (`src/tools/BashTool/bashPermissions.ts` exports `peekSpeculativeClassifierCheck` and `consumeSpeculativeClassifierCheck`). The feature flag `BASH_CLASSIFIER` predates v2.1.142.

The `forceDecision` parameter is present in v2.1.88's `CanUseToolFn` type.

The `oiH` re-check (v2.1.110 fix) is in both v2.1.88 (post-fix) and v2.1.142. The relevant comment in v2.1.88 documents the same invariant.

### Changes in the v2.1.142 window

| Aspect | v2.1.88 | v2.1.142 |
|---|---|---|
| `useCanUseTool` shape | Same | Same |
| SDK bridge protocol | Same `can_use_tool` request | Same |
| `permissionPromptToolName` | Same | Same |
| Mutually exclusive callback | Same | Same |
| Coordinator handler | Present | Present |
| Swarm worker handler | Present | Present |
| Speculative classifier | Present | Present |
| `recheckPermission` | Present | Present, now triggered by `eJH` (v2.1.141) |
| `forceDecision` | Present | Same |
| `BASH_CLASSIFIER` feature flag | Active | Active |
| `awaitAutomatedChecksBeforeDialog` | Present, used by coordinator handler | Same |

The mechanism is **stable**. v2.1.142 additions are mostly in *what feeds it* (mode-change re-eval from `eJH`, classifier improvements, bg-agent preserveMode) rather than the bridge itself.

---

## 12. Why This Architecture?

### 12.1 Wrap-and-fallback layering

The pattern `$.canUseTool ?? tD` is everywhere. It encodes: "if a higher-level wrapper exists, use it; otherwise fall back to the policy chain."

Wrappers add UI/SDK semantics but don't replace `tD`. This means:
- The static chain is the **lowest common denominator** — every path runs it eventually
- The wrappers add **opportunistic short-circuits** (allow without prompting if speculative classifier matches)
- The wrappers add **UI affordances** (interactive prompt, SDK envelope)

A user adding a new wrapper (e.g., for IDE integration) follows the same pattern: take the existing canUseTool, wrap it, fall through to it on the non-handled cases.

### 12.2 Race-based concurrency

Multiple potential decision sources (user, hook, classifier) require either:
- **Sequential** (run each in order, take first non-undefined) — simple but adds latency for slow paths
- **Race** (run in parallel, first to resolve wins) — fast but requires resolve-once guard

The race approach reduces perceived latency at the cost of slight complexity (the `createResolveOnce` pattern). For a UX-critical decision point, the trade-off favors speed.

### 12.3 Pre-handlers before interactive

Coordinator and swarm handlers run **before** the interactive prompt. Why not the other way?

Because once the interactive prompt fires, the user is engaged. Interrupting them with a delayed coordinator answer would be jarring. Running the pre-handlers first lets *non-UI* decision sources resolve before any UI is shown, avoiding the "the dialog flashed and disappeared" bug.

---

## Related Symbols

> Symbol mappings:
> - [`symbol_additions_v2_1_142_permission.md`](../00_overview/symbol_additions_v2_1_142_permission.md)
> - [`symbol_index_infra_platform.md`](../00_overview/symbol_index_infra_platform.md)

Key functions and types in this document:
- `CanUseToolFn<Input>` — Type signature (v2.1.88: src/hooks/useCanUseTool.tsx:27)
- `useCanUseTool` — React hook providing interactive `canUseTool` (v2.1.88: src/hooks/useCanUseTool.tsx:29)
- `hasPermissionsToUseTool` (`tD`) — Static policy chain — see [`architecture.md`](./architecture.md) (cli_inner_pretty.js:421879-422144)
- `processControlRequest` — SDK control protocol handler (cli_inner_pretty.js:498918)
- `Options.canUseTool` — SDK option field (cli_inner_pretty.js:498752, 498760)
- `Options.permissionPromptToolName` — Alternative SDK option (cli_inner_pretty.js:498375, 501129-501215)
- Mutual exclusion error (cli_inner_pretty.js:498428)
- `handleCoordinatorPermission` — Coordinator pre-handler (v2.1.88: src/hooks/toolPermission/handlers/coordinatorHandler.ts)
- `handleSwarmWorkerPermission` — Swarm worker pre-handler (v2.1.88: src/hooks/toolPermission/handlers/swarmWorkerHandler.ts)
- `handleInteractivePermission` — Interactive prompt setup (v2.1.88: src/hooks/toolPermission/handlers/interactiveHandler.ts)
- `peekSpeculativeClassifierCheck` / `consumeSpeculativeClassifierCheck` — Bash fast-path (v2.1.88: src/tools/BashTool/bashPermissions.ts)
- `createResolveOnce` — Resolve-guard pattern (v2.1.88: src/hooks/toolPermission/PermissionContext.ts)
- `applyHookPermissionDecision` — Hook output → PermissionDecision (cli_inner_pretty.js around 520649)
- `recheckPermission` — Re-eval callback (v2.1.88: PermissionContext.ts)
- `lR6` — Inner dispatch function with `canUseTool ?? tD` fallback (cli_inner_pretty.js:511639)
- `buildPermissionRequest` (`PD6`) — Envelope construction (cli_inner_pretty.js:239298)
- `decisionClassification` discriminant — `user_temporary | user_permanent | user_reject` (cli_inner_pretty.js:387733)
- `BASH_CLASSIFIER` feature flag — Gates speculative classifier check
- `awaitAutomatedChecksBeforeDialog` flag — Coordinator-mode trigger
- `createPermissionQueueOps`, `createPermissionContext` — Queue helpers (v2.1.88: PermissionContext.ts)
