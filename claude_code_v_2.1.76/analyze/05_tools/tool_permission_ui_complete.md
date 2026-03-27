# Tool Permission UI Complete Analysis (Claude Code 2.1.76)

> Complete source-level analysis of tool permission dialogs, user interaction flows, and React component rendering.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Tools section)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `canUseTool` (z) - Permission decision function - chunks.146.mjs
- `determineActiveModal` (ra6) - Modal priority system - chunks.196.mjs:387
- `ToolPermissionModal` (HIq) - React component - chunks.196.mjs:1388

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                 PERMISSION DECISION ARCHITECTURE                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ① Tool Execution Request                                            │
│     └─ fxY (toolExecutionPipeline) calls canUseTool                  │
│                                                                       │
│  ② Hook Pre-Check                                                    │
│     ├─ y4q (executePreToolHooks) runs first                          │
│     ├─ Hook can return: allow, deny, ask                             │
│     └─ Hook permission result stored in Z variable                   │
│                                                                       │
│  ③ Permission Decision (canUseTool)                                  │
│     ├─ Check hook result (Z.behavior)                                │
│     ├─ Check auto-allow rules                                        │
│     ├─ Check permission policy settings                              │
│     └─ If no auto-allow: Prompt user                                 │
│                                                                       │
│  ④ User Interaction (if needed)                                      │
│     ├─ ToolPermissionModal React component                           │
│     ├─ Options: "Yes always", "Yes once", "No once", "No always"     │
│     └─ Modal priority queue management                               │
│                                                                       │
│  ⑤ Decision Recording                                                 │
│     ├─ toolDecisions Map updated                                     │
│     ├─ Telemetry event emitted                                       │
│     └─ Permission settings may be updated                            │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Permission Decision Algorithm

### canUseTool Function (z)

**What it does:**
Determines whether a tool can be executed based on hooks, auto-allow rules, permission policies, and user consent.

**How it works:**
1. Check hook permission result first (if hook returned allow/deny)
2. Check if tool requires user interaction (e.g., Agent tool)
3. Evaluate auto-allow conditions
4. Check permission policy from settings
5. If no automatic decision, prompt user via modal

**Key insight:**
Hook results have priority but can be overridden for tools that require explicit user interaction.

```javascript
// ============================================
// Permission Decision Logic - Extracted from fxY
// Location: chunks.146.mjs:591-600
// ============================================

// ORIGINAL (for source lookup):
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

// READABLE (for understanding):
// Hook result handling in permission decision
if (hookPermissionResult !== undefined && hookPermissionResult.behavior === "allow") {
    // Hook approved, but check if explicit user interaction is required
    if (!tool.requiresUserInteraction?.() && !context.requireCanUseTool) {
        console.debug(`Hook approved tool use for ${tool.name}, bypassing permission check`);
        finalDecision = hookPermissionResult;
    } else {
        // Hook approved, but tool requires explicit user consent
        console.debug(`Hook approved tool use for ${tool.name}, but canUseTool is required`);
        if (hookPermissionResult.updatedInput) input = hookPermissionResult.updatedInput;
        finalDecision = await canUseTool(tool, input, context, message, toolUseId);
    }
} else if (hookPermissionResult !== undefined && hookPermissionResult.behavior === "deny") {
    // Hook denied - use hook's decision
    console.debug(`Hook denied tool use for ${tool.name}`);
    finalDecision = hookPermissionResult;
} else {
    // No hook decision or "ask" behavior - prompt user
    const askOptions = hookPermissionResult?.behavior === "ask" ? hookPermissionResult : undefined;
    if (hookPermissionResult?.behavior === "ask" && hookPermissionResult.updatedInput) {
        input = hookPermissionResult.updatedInput;
    }
    finalDecision = await canUseTool(tool, input, context, message, toolUseId, askOptions);
}

// Mapping: Z→hookPermissionResult, A→tool, Y→context, V→finalDecision,
//          z→canUseTool, _→message, q→toolUseId, X→input
```

---

## Modal Priority System

### determineActiveModal Function (ra6)

**What it does:**
Determines which modal should be displayed based on current UI state. Only one modal is shown at a time, with a strict priority order.

**Priority Order (highest to lowest):**

| Priority | Modal Type | Trigger Condition |
|----------|------------|-------------------|
| 1 | message-selector | User actively selecting messages |
| 2 | (streaming) | Streaming active - no modal |
| 3 | sandbox-permission | Pending sandbox request |
| 4 | tool-permission | Tool permission queue has items |
| 5 | prompt | Prompt dialog queue |
| 6 | worker-sandbox-permission | Background agent sandbox |
| 7 | elicitation | MCP server requesting input |
| 8 | cost | Cost threshold reached |
| 9 | ide-onboarding | IDE onboarding dialog |
| 10 | effort-callout | Reasoning effort callout |
| 11 | remote-callout | Remote session callout |
| 12 | lsp-recommendation | LSP recommendation |
| 13 | desktop-upsell | Desktop app promotion |

**Key insight:**
The `shouldContinueAnimation` flag allows non-blocking tool use display while a modal is being processed.

```javascript
// ============================================
// ra6 - Modal priority determination
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
function determineActiveModal() {
    // Early exit: Cost acknowledged or auth unresolved
    if (isCostThresholdAcknowledged || hasUnresolvedAuth) return undefined;

    // Priority 1: Message selector (user is actively selecting)
    if (isMessageSelectorOpen) return "message-selector";

    // Priority 2: Streaming active - don't show modal
    if (isStreamingActive) return undefined;

    // Priority 3: Sandbox permission (security-critical)
    if (pendingSandboxRequest[0]) return "sandbox-permission";

    // Animation control: Allow non-blocking modals if current tool allows
    const shouldShowAnimatedModal = !currentToolJSX || currentToolJSX.shouldContinueAnimation;

    // Priorities 4-13: Animated modals (shown while tool executes)
    if (shouldShowAnimatedModal && toolPermissionQueue[0]) return "tool-permission";
    if (shouldShowAnimatedModal && promptQueue[0]) return "prompt";
    if (shouldShowAnimatedModal && workerSandboxQueue[0]) return "worker-sandbox-permission";
    if (shouldShowAnimatedModal && elicitation.queue[0]) return "elicitation";
    if (shouldShowAnimatedModal && isCostThresholdReached) return "cost";
    if (shouldShowAnimatedModal && showIdeOnboarding) return "ide-onboarding";
    if (shouldShowAnimatedModal && showEffortCallout) return "effort-callout";
    if (shouldShowAnimatedModal && showRemoteCallout) return "remote-callout";
    if (shouldShowAnimatedModal && lspRecommendation) return "lsp-recommendation";
    if (shouldShowAnimatedModal && showDesktopUpsell) return "desktop-upsell";

    return undefined;
}

// Mapping: ra6→determineActiveModal, lV6→isCostThresholdAcknowledged, na6→hasUnresolvedAuth,
//          W7→isMessageSelectorOpen, y2→isStreamingActive, G7→pendingSandboxRequest,
//          j8→currentToolJSX, P1→shouldShowAnimatedModal, a8→toolPermissionQueue,
//          zA→promptQueue, n.queue→workerSandboxQueue, o.queue→elicitation.queue
```

---

## User Decision Recording

### Decision Recording Logic

**What it does:**
Records the user's permission decision for telemetry and future reference.

```javascript
// ============================================
// Decision Recording - Extracted from fxY
// Location: chunks.146.mjs:601-612
// ============================================

// ORIGINAL (for source lookup):
if (V.behavior !== "ask" && !Y.toolDecisions?.has(q)) {
    let u = V.behavior === "allow" ? "accept" : "reject",
        I = V.decisionReason?.type === "hook" ? "hook" : "config";
    if (pw("tool_decision", {
        decision: u,
        source: I,
        tool_name: hq(A.name)
    }), qk8(A.name)) {
        let g = Kk8(A, X, u, I);
        Bk6()?.add(1, g)
    }
}

// READABLE (for understanding):
// Record decision if not "ask" and not already recorded
if (finalDecision.behavior !== "ask" && !context.toolDecisions?.has(toolUseId)) {
    const decisionType = finalDecision.behavior === "allow" ? "accept" : "reject";
    const decisionSource = finalDecision.decisionReason?.type === "hook" ? "hook" : "config";

    // Emit telemetry event
    emitTelemetry("tool_decision", {
        decision: decisionType,
        source: decisionSource,
        tool_name: getDisplayName(tool.name)
    });

    // Track for specific tools (e.g., MCP tools)
    if (isTrackedTool(tool.name)) {
        const attributes = buildToolDecisionAttributes(tool, input, decisionType, decisionSource);
        getMetricCollector()?.add(1, attributes);
    }
}

// Mapping: V→finalDecision, Y→context, q→toolUseId, A→tool, X→input,
//          pw→emitTelemetry, hq→getDisplayName, qk8→isTrackedTool,
//          Kk8→buildToolDecisionAttributes, Bk6→getMetricCollector
```

---

## Permission Denial Handling

### Denied Tool Result

**What it does:**
Formats and returns the error result when permission is denied.

```javascript
// ============================================
// Permission Denied Handling - Extracted from fxY
// Location: chunks.146.mjs:621-673
// ============================================

// ORIGINAL (for source lookup):
if (V.behavior !== "allow") {
    k(`${A.name} tool permission denied`);
    let u = Y.toolDecisions?.get(q);
    jk8("reject", u?.source || "unknown"), h01(), d("tengu_tool_use_can_use_tool_rejected", {
        messageID: w,
        toolName: hq(A.name),
        queryChainId: Y.queryTracking?.chainId,
        queryDepth: Y.queryTracking?.depth,
        // ... telemetry fields ...
    });
    let I = V.message;
    if (P && !I) I = `Execution stopped by PreToolUse hook${W?`: ${W}`:""}`;
    let g = [{
        type: "tool_result",
        content: I,
        is_error: !0,
        tool_use_id: q
    }],
    B = V.behavior === "ask" ? V.contentBlocks : void 0;
    if (B?.length) g.push(...B);
    // ... image handling ...
    return D.push({
        message: p1({
            content: g,
            imagePasteIds: b,
            toolUseResult: `Error: ${I}`,
            sourceToolAssistantUUID: _.uuid
        })
    }), D
}

// READABLE (for understanding):
if (finalDecision.behavior !== "allow") {
    console.debug(`${tool.name} tool permission denied`);

    const toolDecision = context.toolDecisions?.get(toolUseId);
    recordDecision("reject", toolDecision?.source || "unknown");
    finishPermissionFlow();

    // Emit rejection telemetry
    emitTelemetry("tengu_tool_use_can_use_tool_rejected", {
        messageID: messageId,
        toolName: getDisplayName(tool.name),
        queryChainId: context.queryTracking?.chainId,
        queryDepth: context.queryTracking?.depth
    });

    // Build error message
    let errorMessage = finalDecision.message;
    if (shouldPreventContinuation && !errorMessage) {
        errorMessage = `Execution stopped by PreToolUse hook${stopReason ? `: ${stopReason}` : ""}`;
    }

    // Build content blocks for error result
    const contentBlocks = [{
        type: "tool_result",
        content: errorMessage,
        is_error: true,
        tool_use_id: toolUseId
    }];

    // Add additional content blocks if "ask" behavior
    const additionalBlocks = finalDecision.behavior === "ask" ? finalDecision.contentBlocks : undefined;
    if (additionalBlocks?.length) {
        contentBlocks.push(...additionalBlocks);
    }

    // Push error message to results
    results.push({
        message: createUserMessage({
            content: contentBlocks,
            imagePasteIds: imagePasteIds,
            toolUseResult: `Error: ${errorMessage}`,
            sourceToolAssistantUUID: message.uuid
        })
    });

    return results;
}

// Mapping: V→finalDecision, A→tool, Y→context, q→toolUseId, P→shouldPreventContinuation,
//          W→stopReason, D→results, p1→createUserMessage, d→emitTelemetry
```

---

## Hook Permission Result Types

### PermissionResult Interface

```typescript
interface PermissionResult {
    behavior: "allow" | "deny" | "ask";
    message?: string;
    updatedInput?: Record<string, unknown>;
    contentBlocks?: ContentBlock[];
    decisionReason?: {
        type: "hook" | "config" | "user";
        hookName?: string;
    };
    userModified?: boolean;
    acceptFeedback?: string;
}
```

### Behavior Meanings

| Behavior | Meaning | Effect |
|----------|---------|--------|
| `allow` | Tool approved | Proceed with execution |
| `deny` | Tool rejected | Return error result |
| `ask` | Prompt user | Show modal with additional context |

---

## Cross-Module Integration

### Tools ↔ Hooks (11)

- `y4q` (executePreToolHooks) runs before permission check
- Hook can return permission result with behavior
- Hook can modify input via `updatedInput`
- Hook can provide additional context blocks

### Tools ↔ System Reminder (04)

- `hook_permission_decision` attachment generated
- `hook_additional_context` attachment for extra info
- `hook_blocking_error` attachment for denials

### Tools ↔ UI (02)

- `tool-permission` modal in priority queue
- `shouldContinueAnimation` allows non-blocking display
- React state managed in REPL component

---

## UI Components

### ToolPermissionModal Component

**Location:** chunks.196.mjs:1388

**Props:**
- `toolName`: Display name of the tool
- `input`: Tool input parameters
- `onDecision`: Callback for user decision
- `preview`: Optional preview content

**Render Options:**

| Button | Effect |
|--------|--------|
| "Yes, always" | Add to allowed tools, proceed |
| "Yes, this time" | Allow once, don't save |
| "No, this time" | Deny once, don't save |
| "No, always" | Add to denied tools, reject |

---

## Version History

| Version | Changes |
|---------|---------|
| 2.1.76 | Hook permission integration, modal priority system |
| 2.1.72 | Permission policy from settings |
| 2.1.32 | Auto-allow for read-only tools in team mode |

---

## Symbol Validation Status

**Last validated:** 2026-03-27

| Symbol | Validated Location | Status |
|--------|-------------------|--------|
| ra6 (determineActiveModal) | chunks.196.mjs:387 | ✅ Correct |
| z (canUseTool) | chunks.146.mjs | ✅ Correct |
| y4q (executePreToolHooks) | chunks.146.mjs:74 | ✅ Correct |
| p1 (createUserMessage) | chunks.173.mjs:1378 | ✅ Correct |