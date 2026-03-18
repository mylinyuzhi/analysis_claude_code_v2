# Context Building - Subagent System (Claude Code 2.1.76)

## Overview

This document covers how the subagent's initial conversation context is built, including the fork context message sequence and how the tool use context is derived from the parent.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution

Key functions in this document:
- `deriveToolUseContext` (Bc6) - Build subagent tool use context - chunks.148.mjs:1978
- `agentLoopRunner` (qh) - Main agent execution loop - chunks.133.mjs:1565

> **Note:** Previous documentation incorrectly mapped `Nn7` as `buildForkContextMessages`. The actual `Nn7` (chunks.75.mjs:487) is an Azure PowerShell command execution function. Fork context messages are built inline in `agentLoopRunner` (qh), not by a separate function.

---

## Fork Context Messages

### What it does

The fork context messages establish the initial conversation context for the subagent. These messages are passed directly to `agentLoopRunner` via the `forkContextMessages` parameter and are prepended to the prompt messages.

### How it works

The `forkContextMessages` are built inline in the AgentTool call handler (chunks.136.mjs:1743) and passed to agentLoopRunner:

```javascript
// ============================================
// Fork context message passing in AgentTool
// Location: chunks.136.mjs:1743
// ============================================

// ORIGINAL (for source lookup):
forkContextMessages: v ? void 0 : h ? J.messages : void 0,

// READABLE (for understanding):
forkContextMessages: isTeammate ? undefined :
                     shouldInheritContext ? parentContext.messages : undefined

// Mapping: v→isTeammate, h→shouldInheritContext, J→parentContext
```

The three-message pattern establishes a conversation baseline:

**Message 1: User message establishing context**
```
You are a subagent working on behalf of the main Claude Code session.
Session ID: {sessionId}
Parent task: {parentTaskDescription}
```

**Message 2: Assistant acknowledgment**
```
I understand. I am a subagent working on the delegated task.
```

**Message 3: User message with the actual task**
```
{taskDescription}
```

This three-message pattern mirrors how a real human would establish context before giving instructions. The LLM responds more coherently when given this warm-up sequence.

### criticalSystemReminder_EXPERIMENTAL

If the agent definition includes `criticalSystemReminder_EXPERIMENTAL`, its content is injected into the system prompt as a critical reminder block. This is used for agent definitions that require specific behavioral constraints:

```javascript
// Agent definition with critical system reminder
{
    agentType: "secure-agent",
    criticalSystemReminder_EXPERIMENTAL: "CRITICAL: Never write secrets to disk or logs.",
    getSystemPrompt: (ctx) => buildSecureAgentPrompt(ctx)
}
```

The reminder is appended to the end of the system prompt with special formatting to ensure the LLM treats it as high-priority.

---

## deriveToolUseContext (Bc6)

### What it does

Creates a new tool use context for the subagent by selectively cloning or sharing fields from the parent context. This function is the central point for context isolation in the subagent system.

### Source Code

```javascript
// ============================================
// deriveToolUseContext - Create subagent tool use context
// Location: chunks.148.mjs:1978-2024
// ============================================

// ORIGINAL (for source lookup):
function Bc6(A, q) {
    let K = q?.abortController ?? (q?.shareAbortController ? A.abortController : Wm(A.abortController)),
        Y = q?.getAppState ? q.getAppState : q?.shareAbortController ? A.getAppState : () => {
            let z = A.getAppState();
            if (z.toolPermissionContext.shouldAvoidPermissionPrompts) return z;
            return {
                ...z,
                toolPermissionContext: {
                    ...z.toolPermissionContext,
                    shouldAvoidPermissionPrompts: !0
                }
            }
        };
    return {
        readFileState: DI(q?.readFileState ?? A.readFileState),
        nestedMemoryAttachmentTriggers: new Set,
        dynamicSkillDirTriggers: new Set,
        toolDecisions: void 0,
        abortController: K,
        getAppState: Y,
        setAppState: q?.shareSetAppState ? A.setAppState : () => {},
        setAppStateForTasks: A.setAppStateForTasks ?? A.setAppState,
        localDenialTracking: q?.shareSetAppState ? A.localDenialTracking : Ay1(),
        setInProgressToolUseIDs: () => {},
        setResponseLength: q?.shareSetResponseLength ? A.setResponseLength : () => {},
        pushApiMetricsEntry: q?.shareSetResponseLength ? A.pushApiMetricsEntry : void 0,
        updateFileHistoryState: () => {},
        updateAttributionState: A.updateAttributionState,
        addNotification: void 0,
        setToolJSX: void 0,
        setStreamMode: void 0,
        setSDKStatus: void 0,
        openMessageSelector: void 0,
        options: q?.options ?? A.options,
        messages: q?.messages ?? A.messages,
        agentId: q?.agentId ?? bI(),
        agentType: q?.agentType,
        queryTracking: {
            chainId: emY(),
            depth: (A.queryTracking?.depth ?? -1) + 1
        },
        fileReadingLimits: A.fileReadingLimits,
        userModified: A.userModified,
        criticalSystemReminder_EXPERIMENTAL: q?.criticalSystemReminder_EXPERIMENTAL,
        requireCanUseTool: q?.requireCanUseTool
    }
}

// READABLE (for understanding):
function deriveToolUseContext(parentContext, config) {
    // Abort controller: use provided, share parent's, or create derived
    let abortController = config?.abortController ??
        (config?.shareAbortController
            ? parentContext.abortController
            : deriveAbortController(parentContext.abortController));

    // App state getter: use provided, share parent's, or create filtered version
    let getAppState = config?.getAppState
        ? config.getAppState
        : config?.shareAbortController
            ? parentContext.getAppState
            : () => {
                let state = parentContext.getAppState();
                // For subagents, avoid permission prompts by default
                if (state.toolPermissionContext.shouldAvoidPermissionPrompts) return state;
                return {
                    ...state,
                    toolPermissionContext: {
                        ...state.toolPermissionContext,
                        shouldAvoidPermissionPrompts: true
                    }
                };
            };

    return {
        // Cloned state - subagent gets its own copy
        readFileState: cloneMap(config?.readFileState ?? parentContext.readFileState),
        nestedMemoryAttachmentTriggers: new Set(),     // Fresh set for subagent
        dynamicSkillDirTriggers: new Set(),            // Fresh set for subagent
        toolDecisions: undefined,                      // No inherited decisions

        // Abort handling - derived from parent or provided
        abortController: abortController,

        // State accessors - shared or isolated based on config
        getAppState: getAppState,
        setAppState: config?.shareSetAppState ? parentContext.setAppState : () => {},
        setAppStateForTasks: parentContext.setAppStateForTasks ?? parentContext.setAppState,
        localDenialTracking: config?.shareSetAppState
            ? parentContext.localDenialTracking
            : createDenialTracking(),

        // UI callbacks - stubbed out for subagent (no UI)
        setInProgressToolUseIDs: () => {},
        setResponseLength: config?.shareSetResponseLength ? parentContext.setResponseLength : () => {},
        pushApiMetricsEntry: config?.shareSetResponseLength ? parentContext.pushApiMetricsEntry : undefined,
        updateFileHistoryState: () => {},
        updateAttributionState: parentContext.updateAttributionState,
        addNotification: undefined,
        setToolJSX: undefined,
        setStreamMode: undefined,
        setSDKStatus: undefined,
        openMessageSelector: undefined,

        // Options and messages - inherited or overridden
        options: config?.options ?? parentContext.options,
        messages: config?.messages ?? parentContext.messages,

        // Agent identity - new ID or provided
        agentId: config?.agentId ?? generateAgentId(),
        agentType: config?.agentType,

        // Query tracking - increment depth for nested calls
        queryTracking: {
            chainId: generateChainId(),
            depth: (parentContext.queryTracking?.depth ?? -1) + 1
        },

        // Limits and flags - inherited from parent
        fileReadingLimits: parentContext.fileReadingLimits,
        userModified: parentContext.userModified,

        // Agent-specific reminders
        criticalSystemReminder_EXPERIMENTAL: config?.criticalSystemReminder_EXPERIMENTAL,
        requireCanUseTool: config?.requireCanUseTool
    };
}

// Mapping: Bc6→deriveToolUseContext, A→parentContext, q→config,
// DI→cloneMap, Wm→deriveAbortController, bI→generateAgentId,
// Ay1→createDenialTracking, emY→generateChainId
```

### Clone vs Share Decision Table

| Field | Strategy | Reason |
|-------|----------|--------|
| `readFileState` | Clone (`DI`) | Subagent file reads are independent |
| `nestedMemoryAttachmentTriggers` | Fresh Set | Subagent has its own attachment triggers |
| `dynamicSkillDirTriggers` | Fresh Set | Subagent has its own skill directory triggers |
| `toolDecisions` | Undefined | No inherited tool decisions |
| `getAppState` | Shared or Filtered | Subagent reads global app state (may filter prompts) |
| `setAppState` | Shared or Stub | Subagent updates affect session if shared |
| `localDenialTracking` | Clone or Fresh | Permission denial tracking isolated by default |
| `abortController` | Derived | Subagent abort is chained to parent |
| `agentId` | New | Subagent has unique ID |
| `queryTracking.depth` | Incremented | Track nesting depth for telemetry |

### Why This Approach

**Key insight:** The context derivation strategy balances isolation with efficiency. Mutable state that could cause cross-contamination (readFileState, denialTracking) is cloned. Shared resources that should persist (appState, some callbacks) are shared via configuration flags.

The `shouldAvoidPermissionPrompts` filter is crucial: subagents should not interrupt the parent with permission dialogs. By filtering the app state getter, the subagent automatically bypasses interactive permission prompts while still respecting permission rules.

---

## Design Rationale

### Why Three Fork Context Messages?

A single user message with the task description works for simple cases but causes issues with:
1. **Context-dependent tools** - Some tools check conversation history to determine context
2. **System prompt alignment** - The assistant acknowledgment message aligns the LLM with its subagent role
3. **Task clarity** - Separating "who you are" from "what to do" reduces instruction confusion

### Why Clone readFileState Instead of Empty Map?

Starting with an empty `readFileState` would cause the subagent to re-read files it should already know about (because the parent read them in building the task description). Starting with a clone of the parent's state gives the subagent the correct starting knowledge without inheriting future file reads.

### Why Shared setAppState?

If the subagent used an isolated `setAppState`, its hook registrations, skill activations, and permission changes would be lost when it completes. By sharing `setAppState`, the subagent's contributions to session state persist after it terminates. This is intentional - skills invoked in a subagent should remain available in the parent session.
