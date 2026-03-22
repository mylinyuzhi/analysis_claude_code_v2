# Permission Dialog System (Claude Code 2.1.76)

> UI layer for permission decisions: 13-level priority dialog dispatch, promise-based approval flow, cancel handling, and swarm mode delegation.

---

## Related Symbols

> Symbol mappings:
> - [decision_pipeline.md](decision_pipeline.md) - Permission decision engine (BYz/tJ) that produces "ask" decisions consumed here
> - [tool_execution_pipeline.md](../05_tools/tool_execution_pipeline.md) - Tool pipeline (fxY) that calls canUseTool
> - [permission_sync.md](../18_sandbox/permission_sync.md) - Sandbox permission queue

Key functions in this document:
- `getInputDialogType` (ra6) - 13-level priority dispatcher for dialog rendering
- `asyncToolPermissionRequest` (tuq) - Swarm mode: delegates permission to leader via mailbox
- `createPermissionDialog` (Amq) - Creates queue entry with callbacks for interactive approval
- `buildCanUseTool` (nfz) - React hook wrapping the permission promise flow
- `ToolPermissionDialog` (HIq) - React component rendering the tool permission UI
- `handleCancel` (TM) - Cancel handler with per-dialog behavior
- `resolveGuard` (zb1) - Promise deduplication utility preventing double-resolution

---

## Architecture Overview

```
Permission Decision: behavior === "ask"
    |
    v
+-- nfz (buildCanUseTool) - React hook -----------------------------------+
|  Creates Promise($)                                                      |
|  Creates permission context (ruq) with callbacks                         |
|  Calls tJ (canUseTool) or uses pre-computed hook hint                    |
|  On "allow" -> resolve immediately                                       |
|  On "deny"  -> resolve with deny                                         |
|  On "ask"   -> try swarm delegation (tuq), then local dialog (Amq)       |
+--------------------------------------------------------------------------+
    |
    v
+-- tuq (asyncToolPermissionRequest) - Swarm path -------------------------+
|  Only for swarm workers (not leader, not standalone)                      |
|  SN1() builds request with team/worker metadata                          |
|  bN1() registers onAllow/onReject callbacks                              |
|  CN1() sends request to leader via mailbox                               |
|  Sets pendingWorkerRequest in app state                                  |
|  Waits for leader response via promise resolution                        |
|  Returns null if not in swarm mode -> falls through to Amq               |
+--------------------------------------------------------------------------+
    |
    v (if tuq returns null)
+-- Amq (createPermissionDialog) - Local interactive path -----------------+
|  Pushes to toolUseConfirmQueue (a8)                                      |
|  Registers: onAllow, onReject, onAbort, recheckPermission                |
|  Optionally bridges to REPL via bridgeCallbacks                          |
|  Optionally runs PermissionRequest hooks asynchronously                  |
|  Waits for user interaction via promise                                  |
+--------------------------------------------------------------------------+
    |
    v
+-- ra6 (getInputDialogType) - Priority dispatcher -----------------------+
|  Priority 1:  message-selector                                           |
|  Priority 2:  (spinner active -> none)                                   |
|  Priority 3:  sandbox-permission     <-- HIGHEST security                |
|  Priority 4:  tool-permission        <-- Standard approval               |
|  Priority 5:  prompt                                                     |
|  Priority 6:  worker-sandbox-permission                                  |
|  Priority 7:  elicitation            <-- MCP server input                |
|  Priority 8:  cost                                                       |
|  Priority 9:  ide-onboarding                                             |
|  Priority 10: effort-callout                                             |
|  Priority 11: remote-callout                                             |
|  Priority 12: lsp-recommendation                                        |
|  Priority 13: desktop-upsell                                             |
+--------------------------------------------------------------------------+
    |
    v
+-- HIq (ToolPermissionDialog) - React component --------------------------+
|  Renders tool-specific permission UI via hWz (getDialogComponent)        |
|  Displays tool metadata, input summary, suggestions                      |
|  Calls onAllow/onReject on user interaction                              |
|  Resolves the promise created in Amq                                     |
+--------------------------------------------------------------------------+
    |
    v
  Promise resolves -> permission result returns to fxY pipeline
```

---

## Dialog Priority Dispatcher

### ra6 (getInputDialogType) - Which dialog to show

**What it does:** Determines which interactive dialog should be rendered at any given moment. Only one dialog can be active at a time. Priority ordering ensures security-critical dialogs always take precedence over informational ones.

**How it works:**

```javascript
// ============================================
// getInputDialogType - Priority-based dialog dispatcher
// Location: chunks.196.mjs:387-404
// ============================================

// ORIGINAL (for source lookup):
function ra6() {
    if (lV6 || na6) return;
    if (W7) return "message-selector";
    if (y2) return;
    if (G7[0]) return "sandbox-permission";
    let P1 = !j8 || j8.shouldContinueAnimation;
    if (P1 && a8[0]) return "tool-permission";
    if (P1 && zA[0]) return "prompt";
    if (P1 && n.queue[0]) return "worker-sandbox-permission";
    if (P1 && o.queue[0]) return "elicitation";
    if (P1 && m26) return "cost";
    if (P1 && W6) return "ide-onboarding";
    if (P1 && g6) return "effort-callout";
    if (P1 && J1) return "remote-callout";
    if (P1 && e8) return "lsp-recommendation";
    if (P1 && E1) return "desktop-upsell";
    return
}

// READABLE (for understanding):
function getInputDialogType() {
    // Block-all guards: overlay active or processing state
    if (isProcessingPaste || isConfirmingAction) return undefined;

    // Priority 1: Message selector (multi-response picker)
    if (isMessageSelectorVisible) return "message-selector";

    // Priority 2: Spinner animation is consuming the input area
    if (isSpinnerActive) return undefined;

    // Priority 3: Sandbox network permission (security-critical)
    if (sandboxPermissionQueue[0]) return "sandbox-permission";

    // Animation gating: only show remaining dialogs if animation permits
    let animationReady = !localJSXCommand || localJSXCommand.shouldContinueAnimation;

    // Priority 4: Tool permission (standard approval)
    if (animationReady && toolUseConfirmQueue[0]) return "tool-permission";

    // Priority 5: Prompt (MCP prompt/confirm dialog)
    if (animationReady && promptQueue[0]) return "prompt";

    // Priority 6: Worker sandbox permission (swarm worker network access)
    if (animationReady && workerSandboxQueue[0]) return "worker-sandbox-permission";

    // Priority 7: MCP elicitation (server requesting user input)
    if (animationReady && elicitationQueue[0]) return "elicitation";

    // Priority 8-13: Informational callouts (non-blocking)
    if (animationReady && costThreshold) return "cost";
    if (animationReady && ideOnboarding) return "ide-onboarding";
    if (animationReady && effortCallout) return "effort-callout";
    if (animationReady && remoteCallout) return "remote-callout";
    if (animationReady && lspRecommendation) return "lsp-recommendation";
    if (animationReady && desktopUpsell) return "desktop-upsell";

    return undefined;  // No dialog needed
}

// Mapping: ra6->getInputDialogType, lV6->isProcessingPaste, na6->isConfirmingAction
// W7->isMessageSelectorVisible, y2->isSpinnerActive
// G7->sandboxPermissionQueue, a8->toolUseConfirmQueue, zA->promptQueue
// n.queue->workerSandboxQueue, o.queue->elicitationQueue
// j8->localJSXCommand, P1->animationReady
// m26->costThreshold, W6->ideOnboarding, g6->effortCallout
// J1->remoteCallout, e8->lspRecommendation, E1->desktopUpsell
```

**Priority rationale:**

| Priority | Dialog | Why this position |
|----------|--------|-------------------|
| 1 | `message-selector` | User is actively choosing between LLM responses. Must not be interrupted. |
| 2 | (spinner block) | Animation is in progress. Showing a dialog during animation causes visual glitches. |
| 3 | `sandbox-permission` | Network access approval. Security-critical and blocks tool execution. Not gated by animation -- sandbox dialogs always interrupt. |
| 4 | `tool-permission` | Standard tool approval. Most common permission dialog. Gated by animation. |
| 5 | `prompt` | MCP prompt/confirm. Less urgent than tool permission because MCP servers can wait. |
| 6 | `worker-sandbox-permission` | Swarm worker network access. Leader approves on behalf of worker. Lower priority than local permissions. |
| 7 | `elicitation` | MCP server requesting structured input. Can wait for permission dialogs to clear. |
| 8-13 | Informational | Cost warnings, onboarding, upsells. Non-blocking, purely informational. |

**Key insight:** Sandbox permission (Priority 3) is the only security dialog that bypasses the animation gate (`P1`). This ensures network access prompts appear immediately, even if a local JSX command is still animating. All other dialogs wait for animation to complete, preventing a jarring UX where dialogs flash during transitions.

---

## Queue State Variables

The dialog system uses separate queue arrays for each dialog type. Each queue is a React state array where the first element (`queue[0]`) is the active item and the rest are waiting.

```
Queue variable    Obfuscated    Type              Dialog type
--------------    ----------    ----              -----------
toolUseConfirmQ   a8            Array<QueueItem>  "tool-permission"
sandboxPermQ      G7            Array<QueueItem>  "sandbox-permission"
promptQueue       zA            Array<QueueItem>  "prompt"
workerSandboxQ    n.queue       Array<QueueItem>  "worker-sandbox-permission"
elicitationQ      o.queue       Array<QueueItem>  "elicitation"

Non-queue state:
costThreshold     m26           boolean           "cost"
ideOnboarding     W6            boolean           "ide-onboarding"
effortCallout     g6            boolean           "effort-callout"
remoteCallout     J1            boolean           "remote-callout"
lspRecommendation e8            boolean           "lsp-recommendation"
desktopUpsell     E1            boolean           "desktop-upsell"
```

**Key insight:** Queue-based dialogs (Priorities 3-7) can stack: multiple permission requests can be queued simultaneously because tool execution is concurrent. Boolean-based dialogs (Priorities 8-13) are singletons -- only one cost warning or one onboarding dialog can exist at a time. The queue approach ensures FIFO ordering: the first tool to request permission gets prompted first.

---

## Promise Resolution Flow

### nfz (buildCanUseTool) - The React hook that bridges UI and pipeline

**What it does:** Creates a `useCallback` hook that wraps the entire permission flow in a Promise. This is the function passed as the `canUseTool` callback to the tool execution pipeline. It bridges the async pipeline world (which needs a return value) with the React UI world (which needs state and re-renders).

**How it works:**

```javascript
// ============================================
// buildCanUseTool - React hook for permission flow
// Location: chunks.194.mjs:219-301
// ============================================

// ORIGINAL (for source lookup):
function nfz(A, q) {
    return Kmq.useCallback(async (K, Y, z, _, w, O) => {
        return new Promise(($) => {
            let H = ruq(K, Y, z, _, w, q, ouq(A));
            if (H.resolveIfAborted($)) return;
            return (O !== void 0 ? Promise.resolve(O) : tJ(K, Y, z, _, w)).then(async (J) => {
                if (J.behavior === "allow") {
                    if (H.resolveIfAborted($)) return;
                    H.logDecision({ decision: "accept", source: "config" });
                    $(H.buildAllow(J.updatedInput ?? Y, { decisionReason: J.decisionReason }));
                    return
                }
                let M = z.getAppState();
                let D = await K.description(Y, { ... });
                if (H.resolveIfAborted($)) return;
                switch (J.behavior) {
                    case "deny": {
                        V01({ tool: K, input: Y, ... }, { decision: "reject", source: "config" });
                        $(J); return
                    }
                    case "ask": {
                        // Try automated checks first
                        if (M.toolPermissionContext.awaitAutomatedChecksBeforeDialog) {
                            let P = await auq({ ctx: H, ... });
                            if (P) { $(P); return }
                        }
                        if (H.resolveIfAborted($)) return;
                        // Try swarm delegation
                        let X = await tuq({ ctx: H, description: D, ... });
                        if (X) { $(X); return }
                        // Fall through to local dialog
                        Amq({ ctx: H, description: D, result: J, ... }, $);
                        return
                    }
                }
            }).catch((J) => {
                if (J instanceof oY || J instanceof Az) H.logCancelled(), $(H.cancelAndAbort(...));
                else _6(J), $(H.cancelAndAbort(...))
            })
        })
    }, [A, q])
}

// READABLE (for understanding):
function buildCanUseTool(pushToQueue, setToolUseConfirmQueue) {
    return useCallback(async (tool, input, toolUseContext, assistantMsg, toolUseId, hookHint) => {
        return new Promise((resolve) => {
            let ctx = createPermissionContext(tool, input, toolUseContext, assistantMsg, toolUseId,
                                             setToolUseConfirmQueue, pushToQueue);
            if (ctx.resolveIfAborted(resolve)) return;

            // Get permission decision (use hook hint if pre-computed, otherwise call tJ)
            let decisionPromise = hookHint ? Promise.resolve(hookHint) : canUseTool(tool, input, ...);

            decisionPromise.then(async (decision) => {
                // ALLOW: resolve immediately
                if (decision.behavior === "allow") {
                    ctx.logDecision("accept"); resolve(ctx.buildAllow(decision.updatedInput)); return;
                }
                // Get human-readable description for dialog
                let description = await tool.description(input, { ... });
                // DENY: resolve immediately
                if (decision.behavior === "deny") {
                    logDenyTelemetry(tool, input, ...); resolve(decision); return;
                }
                // ASK: try automated checks, then swarm, then local dialog
                if (decision.behavior === "ask") {
                    // Step 1: Try PermissionRequest hook (automated approval)
                    if (awaitAutomatedChecksBeforeDialog) {
                        let hookResult = await tryAutomatedPermissionHooks(ctx, ...);
                        if (hookResult) { resolve(hookResult); return; }
                    }
                    // Step 2: Try swarm delegation (for worker agents)
                    let swarmResult = await asyncToolPermissionRequest(ctx, description, ...);
                    if (swarmResult) { resolve(swarmResult); return; }
                    // Step 3: Push to local dialog queue (for interactive users)
                    createPermissionDialog(ctx, description, decision, resolve);
                    return;
                }
            }).catch(handleAbortOrError);
        });
    }, [pushToQueue, setToolUseConfirmQueue]);
}

// Mapping: nfz->buildCanUseTool, A->pushToQueue, q->setToolUseConfirmQueue
// K->tool, Y->input, z->toolUseContext, _->assistantMsg, w->toolUseId, O->hookHint
// ruq->createPermissionContext, tJ->canUseTool, auq->tryAutomatedPermissionHooks
// tuq->asyncToolPermissionRequest, Amq->createPermissionDialog
// oY->AbortError, Az->CancellationError, V01->logDenyTelemetry
```

**Key insight:** The Promise is the bridge between two execution models. The tool pipeline (fxY) is an async generator that `await`s a permission result. The React UI renders dialogs by reading queue state. The Promise connects them: `createPermissionDialog` pushes to the queue (triggering re-render), and the queue item's callbacks `resolve()` the Promise (unblocking the pipeline). The three-step fallback (hooks -> swarm -> dialog) ensures that automated systems get a chance to handle permissions before showing UI.

---

## Swarm Mode Delegation

### tuq (asyncToolPermissionRequest) - Worker-to-leader permission flow

**What it does:** When a swarm worker agent needs permission, this function delegates the decision to the team leader. The worker sends a permission request via the mailbox system and waits for the leader's response. If the process is not a swarm worker, the function returns `null`, causing the caller to fall through to the local dialog.

**How it works:**

```javascript
// ============================================
// asyncToolPermissionRequest - Swarm permission delegation
// Location: chunks.194.mjs:3-64
// ============================================

// ORIGINAL (for source lookup):
async function tuq(A) {
    if (!E7() || !ic6()) return null;
    let { ctx: q, description: K, updatedInput: Y, suggestions: z } = A;
    try {
        let w = () => q.toolUseContext.setAppState(($) => ({
            ...$, pendingWorkerRequest: null
        }));
        return await new Promise(($) => {
            let { resolve: H, claim: j } = zb1($),
                J = SN1({
                    toolName: q.tool.name, toolUseId: q.toolUseID,
                    input: q.input, description: K, permissionSuggestions: z
                });
            bN1({
                requestId: J.id, toolUseId: q.toolUseID,
                async onAllow(M, D, X, P) {
                    if (!j()) return;
                    w();
                    let W = M && Object.keys(M).length > 0 ? M : q.input;
                    H(await q.handleUserAllow(W, D, X, void 0, P))
                },
                onReject(M, D) {
                    if (!j()) return;
                    w();
                    q.logDecision({ decision: "reject", source: { type: "user_reject", hasFeedback: !!M } });
                    H(q.cancelAndAbort(M, void 0, D))
                }
            });
            CN1(J);
            q.toolUseContext.setAppState((M) => ({
                ...M, pendingWorkerRequest: { toolName: q.tool.name, toolUseId: q.toolUseID, description: K }
            }));
            q.toolUseContext.abortController.signal.addEventListener("abort", () => {
                if (!j()) return;
                w(); q.logCancelled(); H(q.cancelAndAbort(void 0, true))
            }, { once: true });
        })
    } catch (w) {
        return logError(w instanceof Error ? w : Error(`Failed to submit swarm permission request: ${String(w)}`)), null
    }
}

// READABLE (for understanding):
async function asyncToolPermissionRequest(args) {
    // Guard: only works for swarm workers (not leader, not standalone)
    if (!isSwarmMode() || !isSwarmWorker()) return null;

    let { ctx, description, updatedInput, suggestions } = args;
    try {
        let clearPendingState = () => ctx.toolUseContext.setAppState(s => ({
            ...s, pendingWorkerRequest: null
        }));

        return await new Promise((rawResolve) => {
            // Step 1: Create resolve guard (prevents double-resolution)
            let { resolve, claim } = resolveGuard(rawResolve);

            // Step 2: Build permission request with team/worker metadata
            let request = buildPermissionRequest({
                toolName: ctx.tool.name,
                toolUseId: ctx.toolUseID,
                input: ctx.input,
                description,
                permissionSuggestions: suggestions
            });

            // Step 3: Register callbacks for when leader responds
            registerPermissionCallbacks({
                requestId: request.id,
                toolUseId: ctx.toolUseID,
                async onAllow(updatedInput, permissions, scope, ruleUpdates) {
                    if (!claim()) return;  // Already resolved
                    clearPendingState();
                    let finalInput = updatedInput && Object.keys(updatedInput).length > 0
                        ? updatedInput : ctx.input;
                    resolve(await ctx.handleUserAllow(finalInput, permissions, scope, undefined, ruleUpdates));
                },
                onReject(feedback, rejectionDetails) {
                    if (!claim()) return;
                    clearPendingState();
                    ctx.logDecision({ decision: "reject", source: { type: "user_reject", ... } });
                    resolve(ctx.cancelAndAbort(feedback, undefined, rejectionDetails));
                }
            });

            // Step 4: Send request to leader via mailbox
            sendPermissionRequestToLeader(request);

            // Step 5: Set pending state for UI (shows "Waiting for leader..." badge)
            ctx.toolUseContext.setAppState(s => ({
                ...s, pendingWorkerRequest: { toolName: ctx.tool.name, toolUseId: ctx.toolUseID, description }
            }));

            // Step 6: Register abort handler
            ctx.toolUseContext.abortController.signal.addEventListener("abort", () => {
                if (!claim()) return;
                clearPendingState(); ctx.logCancelled();
                resolve(ctx.cancelAndAbort(undefined, /*wasAborted*/ true));
            }, { once: true });
        });
    } catch (error) {
        logError(error);
        return null;  // Fall through to local dialog
    }
}

// Mapping: tuq->asyncToolPermissionRequest, E7->isSwarmMode, ic6->isSwarmWorker
// SN1->buildPermissionRequest, bN1->registerPermissionCallbacks
// CN1->sendPermissionRequestToLeader, zb1->resolveGuard
```

**Swarm permission flow detail:**

```
Worker Agent                     Mailbox (JSONL)                  Leader Agent
-----------                     ---------------                  ------------
SN1() builds request     --->
                                request written to
CN1() sends via x3()    --->    leader's mailbox file    --->    Leader reads mailbox
                                                                  |
Sets pendingWorkerRequest                                         v
in app state                                                   Leader sees permission
  |                                                            request in UI (via
  v                                                            worker-sandbox-permission
Worker UI shows                                                queue or tool-permission
"Waiting for leader"                                           queue)
badge (Ls8 component)                                             |
  |                                                               v
  |                                                            Leader approves/denies
  |                                                               |
  |                          response written to                  v
  |                <---      worker's mailbox file   <---     IN1() sends response
  |
  v
Poller detects response
  |
  v
bN1 callback fires
(onAllow or onReject)
  |
  v
Promise resolves
  |
  v
Pipeline continues
```

**Key insight:** The `resolveGuard` (zb1) prevents a race condition where both the leader response and an abort signal could try to resolve the same promise. The `claim()` function returns `true` only on the first call, ensuring the promise resolves exactly once. The `pendingWorkerRequest` state is set in app state so the UI can show a "Waiting for leader to approve..." badge via the `Ls8` component.

---

## Resolve Guard Utility

### zb1 (resolveGuard) - Single-resolution guarantee

**What it does:** Wraps a Promise's `resolve` function to ensure it can only be called once. Multiple codepaths (user approval, user rejection, abort signal, hook resolution) can all attempt to resolve the same permission promise. Without this guard, the promise could be resolved multiple times, causing undefined behavior.

**How it works:**

```javascript
// ============================================
// resolveGuard - Single-resolution wrapper
// Location: chunks.193.mjs:2964-2980
// ============================================

// ORIGINAL (for source lookup):
function zb1(A) {
    let q = !1, K = !1;
    return {
        resolve(Y) {
            if (K) return;
            K = !0, q = !0, A(Y)
        },
        isResolved() { return q },
        claim() {
            if (q) return !1;
            return q = !0, !0
        }
    }
}

// READABLE (for understanding):
function resolveGuard(originalResolve) {
    let isClaimed = false;
    let isFullyResolved = false;
    return {
        resolve(value) {
            if (isFullyResolved) return;   // Already resolved, ignore
            isFullyResolved = true;
            isClaimed = true;
            originalResolve(value);
        },
        isResolved() { return isClaimed; },
        claim() {
            if (isClaimed) return false;   // Someone else claimed first
            isClaimed = true;
            return true;                   // This caller won the race
        }
    };
}

// Mapping: zb1->resolveGuard, A->originalResolve, q->isClaimed, K->isFullyResolved
```

**Key insight:** Two different guard patterns are offered: `resolve()` for the simple case (just resolve if not already done), and `claim()` for the async case (check if you can claim the right to resolve, then do async work, then call the original resolve). The `claim()` pattern is used in `tuq` and `Amq` where callbacks do async work between claiming and resolving -- without `claim()`, two callbacks could both start async work, and the second one's result would be discarded silently.

---

## Interactive Permission Dialog

### Amq (createPermissionDialog) - Queue-based dialog creation

**What it does:** Creates a permission dialog entry, pushes it to the `toolUseConfirmQueue`, and wires up all the callbacks that let the user approve, reject, or abort the tool use. Also supports bridge callbacks for REPL mode and asynchronous hook-based permission checks.

**How it works:**

```javascript
// ============================================
// createPermissionDialog - Interactive permission dialog
// Location: chunks.194.mjs:74-198
// ============================================

// ORIGINAL (for source lookup):
function Amq(A, q) {
    let { ctx: K, description: Y, result: z, awaitAutomatedChecksBeforeDialog: _,
          bridgeCallbacks: w } = A,
        { resolve: O, isResolved: $, claim: H } = zb1(q),
        j = !1, J, M, D = w ? lfz() : void 0,
        X = Date.now(), P = z.updatedInput ?? K.input;
    // ... (callback definitions)
    K.pushToQueue({
        assistantMessage: K.assistantMessage,
        tool: K.tool,
        description: Y,
        input: P,
        toolUseContext: K.toolUseContext,
        toolUseID: K.toolUseID,
        permissionResult: z,
        permissionPromptStartTimeMs: X,
        onUserInteraction() { /* debounce 200ms, pause spinner, clear animation */ },
        onDismissCheckmark() { /* clear auto-approval timer, remove from queue */ },
        onAbort() {
            if (!H()) return;
            // ... bridge cleanup ...
            K.logCancelled(); K.logDecision({ decision: "reject", source: { type: "user_abort" } });
            O(K.cancelAndAbort(void 0, true))
        },
        async onAllow(updatedInput, permissions, scope, ruleUpdates) {
            if (!H()) return;
            // ... bridge cleanup ...
            O(await K.handleUserAllow(updatedInput, permissions, scope, X, ruleUpdates, z.decisionReason))
        },
        onReject(feedback, rejectionDetails) {
            if (!H()) return;
            // ... bridge cleanup ...
            K.logDecision({ decision: "reject", source: { type: "user_reject", hasFeedback: !!feedback } });
            O(K.cancelAndAbort(feedback, void 0, rejectionDetails))
        },
        async recheckPermission() {
            if ($()) return;
            let result = await tJ(K.tool, K.input, K.toolUseContext, K.assistantMessage, K.toolUseID);
            if (result.behavior === "allow") {
                if (!H()) return;
                K.removeFromQueue(); K.logDecision({ decision: "accept", source: "config" });
                O(K.buildAllow(result.updatedInput ?? K.input))
            }
        }
    });
    // Bridge mode: forward to REPL client
    if (w && D && !K.tool.requiresUserInteraction?.()) {
        w.sendRequest(D, K.tool.name, input, K.toolUseID, Y, z.suggestions, z.blockedPath);
        // ... register response handler on bridge ...
    }
    // Async hook mode: run PermissionRequest hook in background
    if (!_) (async () => {
        if ($()) return;
        let hookResult = await K.runHooks(mode, z.suggestions, z.updatedInput, X);
        if (!hookResult || !H()) return;
        K.removeFromQueue(); O(hookResult);
    })();
}

// READABLE (for understanding):
function createPermissionDialog(args, rawResolve) {
    let { ctx, description, result, awaitAutomatedChecksBeforeDialog, bridgeCallbacks } = args;
    let { resolve, isResolved, claim } = resolveGuard(rawResolve);
    let permissionPromptStartTime = Date.now();
    let effectiveInput = result.updatedInput ?? ctx.input;

    // Push queue item with all callbacks
    ctx.pushToQueue({
        // Metadata for rendering
        tool: ctx.tool,
        description,
        input: effectiveInput,
        permissionResult: result,
        permissionPromptStartTimeMs: permissionPromptStartTime,

        // User interaction callbacks
        onAllow(updatedInput, permissions, scope, ruleUpdates) { /* claim + resolve */ },
        onReject(feedback, details) { /* claim + resolve with cancellation */ },
        onAbort() { /* claim + resolve with abort */ },

        // Background re-evaluation
        recheckPermission() {
            // Re-run canUseTool to see if rules changed (e.g., user added "always allow")
            // If now allowed, auto-dismiss the dialog
        },

        // UX callbacks
        onUserInteraction() { /* pause spinner after 200ms debounce */ },
        onDismissCheckmark() { /* clean up after auto-approval animation */ }
    });

    // Optional: Bridge to REPL client for headless/IDE mode
    if (bridgeCallbacks && !tool.requiresUserInteraction()) {
        bridgeCallbacks.sendRequest(requestId, tool.name, input, ...);
        bridgeCallbacks.onResponse(requestId, (response) => { /* resolve based on response */ });
    }

    // Optional: Run PermissionRequest hooks asynchronously
    if (!awaitAutomatedChecksBeforeDialog) {
        (async () => {
            let hookResult = await ctx.runHooks(mode, suggestions, updatedInput, startTime);
            if (hookResult && claim()) { ctx.removeFromQueue(); resolve(hookResult); }
        })();
    }
}

// Mapping: Amq->createPermissionDialog, K->ctx, Y->description, z->result
// w->bridgeCallbacks, O->resolve, $->isResolved, H->claim
// zb1->resolveGuard, tJ->canUseTool, lfz->createBridgeRequestId
```

**Key insight:** The `recheckPermission` callback enables live rule updates. When the user adds an "always allow" rule for a tool while a permission dialog is showing, the dialog can auto-dismiss by re-running `canUseTool` and finding the new allow rule. This is called periodically or when rule changes are detected. The `onUserInteraction` callback has a 200ms debounce to prevent the spinner from pausing during accidental/brief touches -- only sustained interaction pauses the animation.

---

## Animation Gating

### P1 variable - Preventing rapid dialog re-shows

**What it does:** The `P1` (animationReady) variable gates whether most dialogs can appear. It checks `!j8 || j8.shouldContinueAnimation` -- if a local JSX command is rendering and has not indicated that animation should continue, all dialogs from Priority 4 onward are suppressed.

**How it works:**

```
JSX command starts rendering (e.g., tool output expanding)
    |
    v
j8 = { isLocalJSXCommand: true, shouldContinueAnimation: false }
    |
    v
P1 = false -> all Priority 4-13 dialogs suppressed
    |
    v
Animation completes -> j8.shouldContinueAnimation = true
    |
    v
P1 = true -> dialogs can now appear
```

**Key insight:** Without animation gating, a permission dialog could flash during a tool output transition and then immediately disappear when the animation completes. The gate ensures a clean visual transition: the animation finishes first, then the dialog appears. The exception is `sandbox-permission` (Priority 3) which bypasses this gate entirely -- network access decisions are too security-critical to delay for animations.

The animation timing also interacts with the `onUserInteraction` 200ms debounce in `Amq`. Together these mechanisms prevent:
1. Dialog appearing during animation (gating)
2. Spinner pausing during brief interaction flicker (debounce)
3. Multiple dialogs competing for screen space (priority ordering)

---

## Tool Permission Dialog Component

### HIq (ToolPermissionDialog) - React rendering

**What it does:** Renders the tool-specific permission dialog component. Looks up the appropriate dialog component based on the tool type and passes through all necessary props.

**How it works:**

```javascript
// ============================================
// ToolPermissionDialog - Dialog component
// Location: chunks.190.mjs:899-939
// ============================================

// ORIGINAL (for source lookup):
function HIq(A) {
    let q = A6(17),
        { toolUseConfirm: K, toolUseContext: Y, onDone: z, onReject: _, verbose: w, workerBadge: O } = A;
    // Memoize interrupt handler
    let $ = () => { z(); _(); K.onReject() };
    D8("app:interrupt", $, { context: "Confirmation" });
    // Get dialog title
    let j = SWz(K);
    $a6(j, "permission_prompt");
    // Look up tool-specific dialog component
    let D = hWz(K.tool);
    // Render
    return createElement(D, {
        toolUseContext: Y, toolUseConfirm: K,
        onDone: z, onReject: _, verbose: w, workerBadge: O
    });
}

// READABLE (for understanding):
function ToolPermissionDialog(props) {
    let { toolUseConfirm, toolUseContext, onDone, onReject, verbose, workerBadge } = props;

    // Register interrupt handler (Ctrl+C or Escape)
    let handleInterrupt = () => { onDone(); onReject(); toolUseConfirm.onReject(); };
    useKeybinding("app:interrupt", handleInterrupt, { context: "Confirmation" });

    // Set terminal title to show what's waiting for approval
    let title = getDialogTitle(toolUseConfirm);
    setTerminalTitle(title, "permission_prompt");

    // Resolve tool-specific dialog component (e.g., BashDialog, EditDialog, etc.)
    let DialogComponent = getDialogComponent(toolUseConfirm.tool);

    return <DialogComponent
        toolUseContext={toolUseContext}
        toolUseConfirm={toolUseConfirm}
        onDone={onDone} onReject={onReject}
        verbose={verbose} workerBadge={workerBadge}
    />;
}

// Mapping: HIq->ToolPermissionDialog, K->toolUseConfirm, Y->toolUseContext
// SWz->getDialogTitle, hWz->getDialogComponent, $a6->setTerminalTitle
// D8->useKeybinding
```

**Dialog title generation (SWz):**

```javascript
// ============================================
// getDialogTitle - Context-aware dialog title
// Location: chunks.190.mjs:891-896
// ============================================

// ORIGINAL (for source lookup):
function SWz(A) {
    let q = A.tool.userFacingName(A.input);
    if (A.tool === zD) return "Claude Code needs your approval for the plan";
    if (A.tool === Ki6) return "Claude Code wants to enter plan mode";
    if (!q || q.trim() === "") return "Claude Code needs your attention";
    return `Claude needs your permission to use ${q}`
}

// Mapping: SWz->getDialogTitle, zD->PlanTool, Ki6->PlanModeTool
```

**Dialog component dispatch (hWz):** Maps each tool to a specialized dialog component. For example, the Bash tool gets a dialog showing the command, the Edit tool gets a diff view, and unknown tools get a generic `M86` dialog.

---

## Cancel Handling

### TM (handleCancel) - Per-dialog cancel behavior

**What it does:** Handles the user pressing Escape or Ctrl+C during a dialog. Different dialog types have different cancel behaviors -- notably, elicitation dialogs cannot be cancelled because the MCP server expects a response.

**How it works:**

```javascript
// ============================================
// handleCancel - Per-dialog cancel behavior
// Location: chunks.196.mjs:420-432
// ============================================

// ORIGINAL (for source lookup):
function TM() {
    if (K2 === "elicitation") return;
    if (k(`[onCancel] focusedInputDialog=${K2} streamMode=${d7}`), J9.forceEnd(),
        ez?.trim()) gq((P1) => [...P1, $Z({ content: ez })]);
    if (dE(), K2 === "tool-permission")
        a8[0]?.onAbort(), $A([]);
    else if (K2 === "prompt") {
        for (let P1 of zA) P1.reject(Error("Prompt cancelled by user"));
        gA([]), M5?.abort()
    } else if (B5.isRemoteMode) B5.cancelRequest();
    else M5?.abort();
    x5(null)
}

// READABLE (for understanding):
function handleCancel() {
    // Elicitation dialogs cannot be cancelled
    if (currentDialog === "elicitation") return;

    log(`Cancel: dialog=${currentDialog} stream=${streamMode}`);
    typingAnimation.forceEnd();

    // Save any typed user input
    if (currentInputText?.trim()) {
        appendToMessages(createUserMessage({ content: currentInputText }));
    }

    clearInput();

    // Dialog-specific cancellation
    if (currentDialog === "tool-permission") {
        // Abort the first queued tool permission
        toolUseConfirmQueue[0]?.onAbort();
        setToolUseConfirmQueue([]);  // Clear entire queue
    }
    else if (currentDialog === "prompt") {
        // Reject ALL queued prompts
        for (let prompt of promptQueue) {
            prompt.reject(Error("Prompt cancelled by user"));
        }
        setPromptQueue([]);
        abortController?.abort();
    }
    else if (isRemoteMode) {
        cancelRemoteRequest();
    }
    else {
        abortController?.abort();
    }

    setOverrideMessage(null);
}

// Mapping: TM->handleCancel, K2->currentDialog, d7->streamMode
// J9->typingAnimation, ez->currentInputText, dE->clearInput
// a8->toolUseConfirmQueue, $A->setToolUseConfirmQueue
// zA->promptQueue, gA->setPromptQueue, M5->abortController
// B5->remoteMode, x5->setOverrideMessage
```

**Cancel behavior by dialog type:**

| Dialog Type | Cancel Behavior |
|-------------|-----------------|
| `elicitation` | **Blocked** -- MCP server expects a response; Escape is ignored |
| `tool-permission` | Abort the front item (`onAbort`), clear entire queue |
| `prompt` | Reject ALL queued prompts with error, abort controller |
| `sandbox-permission` | Falls through to abort controller (resolves as deny) |
| `worker-sandbox-permission` | Falls through to abort controller |
| `cost` / informational | Falls through to abort controller |

**Key insight:** Tool permission cancel clears the entire queue (`$A([])`), not just the front item. This is intentional: when the user presses Escape, they want to stop all pending tool executions, not just the one currently showing. By contrast, prompt cancel rejects all queued prompts individually (each gets its own rejection error) because each prompt has an independent consumer that needs to handle the cancellation.

---

## Automated Permission Checks

### auq (tryAutomatedPermissionHooks) - Hook-based auto-approval

**What it does:** Before showing a dialog to the user, runs the `PermissionRequest` hook to see if an automated system can approve the tool use. This is used by IDE integrations and custom hook handlers that want to auto-approve certain operations.

**How it works:**

```javascript
// ============================================
// tryAutomatedPermissionHooks
// Location: chunks.193.mjs:3156-3170
// ============================================

// ORIGINAL (for source lookup):
async function auq(A) {
    let { ctx: q, updatedInput: K, suggestions: Y, permissionMode: z } = A;
    try {
        let _ = await q.runHooks(z, Y, K);
        if (_) return _;
        let w = null;
        // ... additional automated checks ...
    } catch { /* ... */ }
}

// READABLE (for understanding):
async function tryAutomatedPermissionHooks(args) {
    let { ctx, updatedInput, suggestions, permissionMode } = args;
    try {
        let hookResult = await ctx.runHooks(permissionMode, suggestions, updatedInput);
        if (hookResult) return hookResult;  // Hook handled it
        return null;  // No automated handler, fall through to dialog
    } catch { /* ... */ }
}

// Mapping: auq->tryAutomatedPermissionHooks
```

**Key insight:** The `awaitAutomatedChecksBeforeDialog` flag controls whether this runs before or after the dialog is shown. When `true` (the default path in `nfz`), automated hooks run first and can prevent the dialog from appearing at all. When `false` (the `Amq` path), the dialog appears immediately and automated hooks run in the background -- if they approve, the dialog auto-dismisses. The background approach gives better perceived latency because the user sees the dialog instantly, and it may auto-approve before they need to act.

---

## Worker Badge and Pending State

When a swarm worker is waiting for leader approval, the UI shows a "Waiting for leader..." badge. This is implemented via two mechanisms:

1. **`pendingWorkerRequest` state:** Set by `tuq` when a permission request is sent to the leader. The `Le9` selector extracts it from app state. The `Ls8` component renders the badge with the tool name and description.

2. **`X6` variable in the REPL:** Reads `pendingWorkerRequest` from app state and conditionally renders the `Ls8` badge component alongside the main dialog area.

```
Worker agent state:
  pendingWorkerRequest: { toolName: "Bash", toolUseId: "...", description: "Run npm install" }
      |
      v
  Ls8 component renders: "Waiting for leader to approve Bash: Run npm install"
      |
      v
  Leader approves -> bN1 callback fires -> pendingWorkerRequest = null -> badge disappears
```

---

## End-to-End "Ask" Flow Example

```
tJ returns { behavior: "ask", message: "...", suggestions: [...] }
    |
    v
nfz (buildCanUseTool hook)
    |-- Creates ruq context with callbacks
    |-- Calls tool.description() for human-readable text
    |-- behavior === "ask"
    |
    |-- Step 1: awaitAutomatedChecksBeforeDialog?
    |   |-- auq() runs PermissionRequest hooks
    |   |-- Hook returns null (no automated handler)
    |
    |-- Step 2: tuq() - swarm delegation?
    |   |-- E7() returns false (not in swarm mode)
    |   |-- Returns null -> falls through
    |
    |-- Step 3: Amq() - local dialog
    |   |-- Creates resolveGuard(rawResolve)
    |   |-- Pushes to toolUseConfirmQueue (a8):
    |   |   { tool, description, input, onAllow, onReject, onAbort, recheckPermission }
    |   |-- Background hook runner starts (if !awaitAutomatedChecksBeforeDialog)
    |
    v
React re-render triggered by queue state change
    |
    v
ra6() -> toolUseConfirmQueue[0] exists -> returns "tool-permission"
    |
    v
K2 = "tool-permission" -> renders HIq (ToolPermissionDialog)
    |-- hWz(tool) -> selects BashPermissionDialog component
    |-- SWz(toolUseConfirm) -> "Claude needs your permission to use Bash"
    |-- Renders command preview, allow/deny buttons, suggestions
    |
    v
User clicks "Allow once"
    |
    v
onAllow callback fires
    |-- claim() returns true (first caller)
    |-- handleUserAllow(input, null, null) -> builds allow result
    |-- resolve(allowResult)
    |
    v
Promise resolves in nfz -> returns to fxY pipeline
    |
    v
fxY continues to tool.call() execution
```
