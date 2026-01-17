# State Management Cross-Module Interactions (v2.1.7)

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

## Table of Contents

1. [Overview](#overview)
2. [Architecture Diagram](#architecture-diagram)
3. [Plan Mode ↔ State Interactions](#plan-mode--state-interactions)
4. [Tools ↔ State Interactions](#tools--state-interactions)
5. [System Reminders ↔ State Interactions](#system-reminders--state-interactions)
6. [State Fields Cross-Reference Matrix](#state-fields-cross-reference-matrix)
7. [Key Architectural Patterns](#key-architectural-patterns)
8. [Related Symbols](#related-symbols)

---

## Overview

Claude Code's state management system interacts with multiple modules through a centralized state container. This document details the cross-module interactions between:

1. **Plan Mode** - Tool permission mode tracking and mode transitions
2. **Tools** - Tool execution context with permission state
3. **System Reminders** - Attachment-based state communication to LLM

**Key State Fields for Cross-Module Interaction:**
- `toolPermissionContext.mode` - Current permission mode
- `globalState.hasExitedPlanMode` - Plan mode exit flag
- `globalState.needsPlanModeExitAttachment` - Attachment trigger flag
- `globalState.planSlugCache` - Session plan slug cache

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                CROSS-MODULE STATE INTERACTION ARCHITECTURE                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                        APP STATE (React)                              │   │
│  │                                                                       │   │
│  │   toolPermissionContext: {                                           │   │
│  │     mode: "default" | "plan" | "acceptEdits" | "bypassPermissions"   │   │
│  │     isBypassPermissionsModeAvailable: boolean                        │   │
│  │     shouldAvoidPermissionPrompts: boolean                            │   │
│  │     alwaysAllowRules: { command: string[] }                          │   │
│  │   }                                                                   │   │
│  │                                                                       │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│        │                    │                     │                          │
│        ▼                    ▼                     ▼                          │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────────┐           │
│  │  PLAN MODE   │    │    TOOLS     │    │  SYSTEM REMINDERS    │           │
│  │              │    │              │    │                      │           │
│  │ EnterPlanMode│◄──►│ToolUseContext│──►│ buildPlanModeAttach  │           │
│  │ ExitPlanMode │    │Executor Class│    │ mI0/SG5 extraction   │           │
│  │              │    │              │    │                      │           │
│  └──────────────┘    └──────────────┘    └──────────────────────┘           │
│        │                    │                     │                          │
│        ▼                    ▼                     ▼                          │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                      GLOBAL STATE (g0)                               │   │
│  │                                                                       │   │
│  │   hasExitedPlanMode: boolean     (Xf0 getter, Iq setter)             │   │
│  │   needsPlanModeExitAttachment: boolean  (If0 getter, lw setter)      │   │
│  │   planSlugCache: Map<sessionId, slug>   (Z7A getter)                 │   │
│  │   hasExitedDelegateMode: boolean                                     │   │
│  │   needsDelegateModeExitAttachment: boolean                           │   │
│  │                                                                       │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Plan Mode ↔ State Interactions

### Overview

Plan mode is a special permission mode where Claude explores the codebase and creates a plan before implementation. The mode state is tracked in both React state and global state.

### State Field: `toolPermissionContext.mode`

**Possible Values:**
- `"default"` - Normal execution mode
- `"plan"` - Planning mode (read-only exploration)
- `"acceptEdits"` - Auto-accept edit operations
- `"bypassPermissions"` - Skip all permission prompts
- `"dontAsk"` - Don't ask, just execute

### Global State Flags (chunks.1.mjs:2706-2725)

```javascript
// ============================================
// Plan Mode Global State Flags
// Location: chunks.1.mjs:2706-2725
// ============================================

// ORIGINAL (for source lookup):
function Xf0() {
  return g0.hasExitedPlanMode
}

function Iq(A) {
  g0.hasExitedPlanMode = A
}

function If0() {
  return g0.needsPlanModeExitAttachment
}

function lw(A) {
  g0.needsPlanModeExitAttachment = A
}

function Ty(A, Q) {
  if (Q === "plan" && A !== "plan") g0.needsPlanModeExitAttachment = !1;
  if (A === "plan" && Q !== "plan") g0.needsPlanModeExitAttachment = !0
}

// READABLE (for understanding):
function hasExitedPlanMode() {
  return globalState.hasExitedPlanMode;
}

function setHasExitedPlanMode(value) {
  globalState.hasExitedPlanMode = value;
}

function needsPlanModeExitAttachment() {
  return globalState.needsPlanModeExitAttachment;
}

function setNeedsPlanModeExitAttachment(value) {
  globalState.needsPlanModeExitAttachment = value;
}

function onToolPermissionModeChanged(oldMode, newMode) {
  // Entering plan mode: clear the exit attachment flag
  if (newMode === "plan" && oldMode !== "plan") {
    globalState.needsPlanModeExitAttachment = false;
  }
  // Exiting plan mode: set the exit attachment flag
  if (oldMode === "plan" && newMode !== "plan") {
    globalState.needsPlanModeExitAttachment = true;
  }
}

// Mapping: Xf0→hasExitedPlanMode, Iq→setHasExitedPlanMode
// If0→needsPlanModeExitAttachment, lw→setNeedsPlanModeExitAttachment
// Ty→onToolPermissionModeChanged, A→oldMode, Q→newMode, g0→globalState
```

### Plan Mode State Lifecycle

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      PLAN MODE STATE LIFECYCLE                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────┐       │
│  │ INITIAL STATE                                                     │       │
│  │                                                                   │       │
│  │ toolPermissionContext.mode = "default"                           │       │
│  │ globalState.hasExitedPlanMode = false                            │       │
│  │ globalState.needsPlanModeExitAttachment = false                  │       │
│  └──────────────────────────────────────────────────────────────────┘       │
│                              │                                               │
│                              ▼ EnterPlanMode tool invoked                   │
│  ┌──────────────────────────────────────────────────────────────────┐       │
│  │ PLAN MODE ACTIVE                                                  │       │
│  │                                                                   │       │
│  │ toolPermissionContext.mode = "plan"                              │       │
│  │ onToolPermissionModeChanged("default", "plan") called            │       │
│  │   → needsPlanModeExitAttachment = false                          │       │
│  │                                                                   │       │
│  │ Effects:                                                          │       │
│  │ - Edit, Write, NotebookEdit tools blocked                        │       │
│  │ - Task/ExitPlanMode tools blocked for subagents                  │       │
│  │ - Model may switch to Opus for complex planning                  │       │
│  │ - Plan mode attachment generated each turn                       │       │
│  └──────────────────────────────────────────────────────────────────┘       │
│                              │                                               │
│            ┌─────────────────┴─────────────────┐                            │
│            │         Each Turn in Plan Mode     │                            │
│            ▼                                    ▼                            │
│  ┌─────────────────────────┐    ┌─────────────────────────────────┐         │
│  │ buildPlanModeAttachment │    │ selectModelForPlanMode          │         │
│  │ checks mode === "plan"  │    │ may upgrade to Opus if >200k    │         │
│  │ generates reminder      │    │ tokens and in plan mode         │         │
│  └─────────────────────────┘    └─────────────────────────────────┘         │
│                              │                                               │
│                              ▼ ExitPlanMode tool invoked                    │
│  ┌──────────────────────────────────────────────────────────────────┐       │
│  │ EXITING PLAN MODE                                                 │       │
│  │                                                                   │       │
│  │ toolPermissionContext.mode = "default"                           │       │
│  │ setHasExitedPlanMode(true)                                       │       │
│  │ setNeedsPlanModeExitAttachment(true)                             │       │
│  │ onToolPermissionModeChanged("plan", "default") called            │       │
│  │   → needsPlanModeExitAttachment = true                           │       │
│  └──────────────────────────────────────────────────────────────────┘       │
│                              │                                               │
│                              ▼ Next assistant turn                          │
│  ┌──────────────────────────────────────────────────────────────────┐       │
│  │ EXIT ATTACHMENT GENERATED                                         │       │
│  │                                                                   │       │
│  │ buildPlanModeExitAttachment checks needsPlanModeExitAttachment   │       │
│  │   → Generates plan_mode_exit attachment                          │       │
│  │   → Clears needsPlanModeExitAttachment flag                      │       │
│  │                                                                   │       │
│  │ State returns to normal:                                         │       │
│  │ - All tools available                                            │       │
│  │ - Normal model selection                                         │       │
│  └──────────────────────────────────────────────────────────────────┘       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Key Decision: Why Use Global State for Mode Flags?

**Problem:** React state updates are asynchronous and may not be immediately visible to attachment generators called in the same render cycle.

**Solution:** Use synchronous global state (`g0`) for flags that need to be immediately readable:
- `hasExitedPlanMode` - Read by attachment generators same cycle
- `needsPlanModeExitAttachment` - Trigger for exit attachment

**Trade-off:** Global state doesn't trigger re-renders, so it's only used for internal flags, not UI-visible state.

---

## Tools ↔ State Interactions

### ToolUseContext Structure

Tools receive state access through the `toolUseContext` object, which provides:
- `getAppState()` - Async getter for current state
- `setAppState(updater)` - State updater function
- `options.permissionMode` - Current permission mode

### Tool Context Creation (chunks.133.mjs)

```javascript
// ============================================
// Tool Context Creation with Permission Mode
// Location: chunks.133.mjs (conceptual, derived from exploration)
// ============================================

// READABLE (for understanding):
async function buildToolUseContext(messages, mainLoopModel, getPermissionMode, ...) {
  // Get current permission mode from state
  let permissionMode = (await getPermissionMode()).mode;

  // Model selection may differ based on plan mode
  let model = selectModelForPlanMode({
    permissionMode: permissionMode,
    mainLoopModel: mainLoopModel,
    exceeds200kTokens: permissionMode === "plan" && checkExceeds200kTokens(messages)
  });

  return {
    toolUseContext: {
      options: { mainLoopModel: model, ... },
      getAppState,               // Async state getter
      setAppState,               // State updater
      abortController,           // For interruption
      setInProgressToolUseIDs    // Progress tracking
    }
  };
}
```

### StreamingToolExecutor (chunks.133.mjs:2911-3087)

```javascript
// ============================================
// StreamingToolExecutor - Manages tool execution with state
// Location: chunks.133.mjs:2911-3087
// ============================================

// ORIGINAL (for source lookup):
class _H1 {
  toolDefinitions;
  canUseTool;
  tools = [];
  toolUseContext;
  hasErrored = !1;
  discarded = !1;
  progressAvailableResolve;
  constructor(A, Q, B) {
    this.toolDefinitions = A;
    this.canUseTool = Q;
    this.toolUseContext = B
  }
  // ... methods
  async executeTool(A) {
    A.status = "executing", this.toolUseContext.setInProgressToolUseIDs((Y) => new Set([...Y, A.id]));
    let Q = [],
      B = [],
      Z = (async () => {
        let Y = this.getAbortReason();
        if (Y) {
          Q.push(this.createSyntheticErrorMessage(A.id, Y, A.assistantMessage));
          A.results = Q, A.contextModifiers = B, A.status = "completed";
          return
        }
        let J = jH1(A.block, A.assistantMessage, this.canUseTool, this.toolUseContext),
          X = !1;
        for await (let I of J) {
          // ... handle results
          if (I.contextModifier) B.push(I.contextModifier.modifyContext)
        }
        if (A.results = Q, A.contextModifiers = B, A.status = "completed", !A.isConcurrencySafe && B.length > 0)
          for (let I of B) this.toolUseContext = I(this.toolUseContext)
      })();
    // ...
  }
}

// READABLE (for understanding):
class StreamingToolExecutor {
  toolDefinitions;      // Available tool definitions
  canUseTool;           // Permission checker function
  tools = [];           // Queue of tools to execute
  toolUseContext;       // State access and utilities
  hasErrored = false;   // Error tracking for siblings
  discarded = false;    // Streaming fallback flag

  constructor(toolDefinitions, canUseTool, toolUseContext) {
    this.toolDefinitions = toolDefinitions;
    this.canUseTool = canUseTool;
    this.toolUseContext = toolUseContext;  // Contains getAppState, setAppState
  }

  async executeTool(tool) {
    // Mark as executing, update in-progress IDs in state
    tool.status = "executing";
    this.toolUseContext.setInProgressToolUseIDs(
      (ids) => new Set([...ids, tool.id])
    );

    let results = [];
    let contextModifiers = [];

    let execution = (async () => {
      // Check for abort reason (user interrupt, streaming fallback)
      let abortReason = this.getAbortReason();
      if (abortReason) {
        results.push(this.createSyntheticErrorMessage(tool.id, abortReason, tool.assistantMessage));
        tool.results = results;
        tool.contextModifiers = contextModifiers;
        tool.status = "completed";
        return;
      }

      // Execute tool generator
      let toolGenerator = executeToolGenerator(
        tool.block,
        tool.assistantMessage,
        this.canUseTool,
        this.toolUseContext
      );

      for await (let result of toolGenerator) {
        // ... handle results

        // Collect context modifiers from tool results
        if (result.contextModifier) {
          contextModifiers.push(result.contextModifier.modifyContext);
        }
      }

      tool.results = results;
      tool.contextModifiers = contextModifiers;
      tool.status = "completed";

      // For non-concurrent-safe tools, apply modifiers immediately
      // This allows tools to update state for subsequent tools
      if (!tool.isConcurrencySafe && contextModifiers.length > 0) {
        for (let modifier of contextModifiers) {
          this.toolUseContext = modifier(this.toolUseContext);
        }
      }
    })();

    tool.promise = execution;
    execution.finally(() => this.processQueue());
  }
}

// Mapping: _H1→StreamingToolExecutor, A→toolDefinitions, Q→canUseTool, B→toolUseContext
// jH1→executeToolGenerator, C77→removeFromInProgressToolUseIDs
```

### Context Modifier Pattern

Tools can return a `contextModifier` to update `toolUseContext` after execution:

```javascript
// Pattern: Tool returns context modifier
yield {
  message: resultMessage,
  contextModifier: {
    modifyContext: (ctx) => ({
      ...ctx,
      someField: updatedValue
    })
  }
};

// StreamingToolExecutor applies modifiers
for (let modifier of contextModifiers) {
  this.toolUseContext = modifier(this.toolUseContext);
}
```

**Why This Pattern?**
- Tools can accumulate state changes without direct mutation during execution
- Allows sequential tools to see updated state from previous tools
- Non-concurrent-safe tools get immediate state updates

---

## System Reminders ↔ State Interactions

### Overview

System reminders are XML-wrapped messages injected into the conversation to provide context to the LLM. They are extracted from tool results and user messages, then communicated via attachments.

### System Reminder Extraction (chunks.91.mjs:3368-3402)

```javascript
// ============================================
// System Reminder Extraction Functions
// Location: chunks.91.mjs:3368-3402
// ============================================

// ORIGINAL (for source lookup):
function mI0(A) {
  let Q = A.trim().match(PG5);
  return Q && Q[1] ? Q[1].trim() : null
}

function SG5(A) {
  let Q = [],
    B = [];
  for (let G of A) {
    let Z = G.message.content;
    if (typeof Z === "string") {
      let Y = mI0(Z);
      if (Y) B.push(Y);
      else Q.push(`[USER]\n${Z}`)
    } else if (Array.isArray(Z)) {
      for (let Y of Z)
        if (Y.type === "text") {
          let J = mI0(Y.text);
          if (J) B.push(J);
          else Q.push(`[USER]\n${Y.text}`)
        } else if (Y.type === "tool_result") {
          let J = typeof Y.content === "string" ? Y.content : eA(Y.content),
            X = mI0(J);
          if (X) B.push(X);
          else Q.push(`[TOOL RESULT: ${Y.tool_use_id}]\n${J}`)
        }
    }
  }
  return {
    contextParts: Q,
    systemReminders: B
  }
}

// READABLE (for understanding):
// Regex pattern for system reminders: /^<system-reminder>\n?([\s\S]*?)\n?<\/system-reminder>$/
const SYSTEM_REMINDER_REGEX = /^<system-reminder>\n?([\s\S]*?)\n?<\/system-reminder>$/;

function extractSystemReminder(text) {
  let match = text.trim().match(SYSTEM_REMINDER_REGEX);
  return match && match[1] ? match[1].trim() : null;
}

function filterSystemReminderMessages(messages) {
  let contextParts = [];       // Non-reminder content
  let systemReminders = [];    // Extracted reminders

  for (let message of messages) {
    let content = message.message.content;

    if (typeof content === "string") {
      let reminder = extractSystemReminder(content);
      if (reminder) {
        systemReminders.push(reminder);
      } else {
        contextParts.push(`[USER]\n${content}`);
      }
    } else if (Array.isArray(content)) {
      for (let block of content) {
        if (block.type === "text") {
          let reminder = extractSystemReminder(block.text);
          if (reminder) {
            systemReminders.push(reminder);
          } else {
            contextParts.push(`[USER]\n${block.text}`);
          }
        } else if (block.type === "tool_result") {
          let resultContent = typeof block.content === "string"
            ? block.content
            : stringifyContent(block.content);
          let reminder = extractSystemReminder(resultContent);
          if (reminder) {
            systemReminders.push(reminder);
          } else {
            contextParts.push(`[TOOL RESULT: ${block.tool_use_id}]\n${resultContent}`);
          }
        }
      }
    }
  }

  return {
    contextParts,      // Array of non-reminder content
    systemReminders    // Array of extracted reminder strings
  };
}

// Mapping: mI0→extractSystemReminder, SG5→filterSystemReminderMessages
// A→text/messages, Q→contextParts/match, B→systemReminders
// PG5→SYSTEM_REMINDER_REGEX, eA→stringifyContent
```

### Attachment-Based State Communication

State changes are communicated to the LLM through the **attachment system**, not direct injection:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│            ATTACHMENT-BASED STATE COMMUNICATION FLOW                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────┐                                                        │
│  │  State Change   │                                                        │
│  │  (mode="plan")  │                                                        │
│  └────────┬────────┘                                                        │
│           │                                                                  │
│           ▼                                                                  │
│  ┌─────────────────────────────────────────────────────────────────┐        │
│  │  Attachment Generator Functions                                  │        │
│  │                                                                  │        │
│  │  • buildPlanModeAttachment (j27)                                │        │
│  │    - Checks toolPermissionContext.mode === "plan"               │        │
│  │    - Returns plan_mode attachment type                          │        │
│  │                                                                  │        │
│  │  • buildPlanModeExitAttachment (T27)                            │        │
│  │    - Checks globalState.needsPlanModeExitAttachment             │        │
│  │    - Returns plan_mode_exit attachment type                     │        │
│  │    - Clears the flag after generation                           │        │
│  │                                                                  │        │
│  └────────┬────────────────────────────────────────────────────────┘        │
│           │                                                                  │
│           ▼                                                                  │
│  ┌─────────────────────────────────────────────────────────────────┐        │
│  │  generateAllAttachments (O27)                                    │        │
│  │                                                                  │        │
│  │  Collects attachments from all generators:                       │        │
│  │  - Plan mode reminders                                           │        │
│  │  - File mentions (@file)                                         │        │
│  │  - MCP resources                                                 │        │
│  │  - Changed files                                                 │        │
│  │  - Claude.md content                                             │        │
│  │  - IDE selections                                                │        │
│  └────────┬────────────────────────────────────────────────────────┘        │
│           │                                                                  │
│           ▼                                                                  │
│  ┌─────────────────────────────────────────────────────────────────┐        │
│  │  wrapInSystemReminder (q5)                                       │        │
│  │                                                                  │        │
│  │  <system-reminder>                                               │        │
│  │  Plan mode still active...                                       │        │
│  │  </system-reminder>                                              │        │
│  └────────┬────────────────────────────────────────────────────────┘        │
│           │                                                                  │
│           ▼                                                                  │
│  ┌─────────────────────────────────────────────────────────────────┐        │
│  │  Injected into Conversation as Tool Result                      │        │
│  │                                                                  │        │
│  │  { type: "tool_result", content: "<system-reminder>...</...>" } │        │
│  └─────────────────────────────────────────────────────────────────┘        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Key Decision: Why Attachments Instead of Direct Injection?

**Problem:** Direct modification of the system prompt or messages is complex and error-prone.

**Solution:** Use the attachment system:
1. State-based condition checking in generators
2. XML wrapping for clear boundaries
3. Injection as tool results (part of existing message flow)
4. Extraction on compact for context reduction

**Benefits:**
- Clean separation between state management and LLM context building
- Attachments can be pruned/compacted independently
- System reminders clearly marked for extraction

---

## State Fields Cross-Reference Matrix

### Which Modules Affect Which State Fields

| State Field | Plan Mode | Tools | System Reminders | Notes |
|-------------|-----------|-------|------------------|-------|
| `toolPermissionContext.mode` | ✅ Modifies | ✅ Reads | ✅ Reads | Core cross-module field |
| `globalState.hasExitedPlanMode` | ✅ Modifies | - | - | Set on ExitPlanMode |
| `globalState.needsPlanModeExitAttachment` | ✅ Modifies | - | ✅ Reads/Clears | Trigger for exit attachment |
| `globalState.planSlugCache` | ✅ Modifies | - | - | Session plan file tracking |
| `sessionHooks` | - | - | - | Hook registration |
| `todos` | - | ✅ Modifies (TodoWrite) | - | Per-agent todo lists |
| `mcp` | - | ✅ Modifies (MCP tools) | - | MCP client state |
| `notifications` | - | ✅ Modifies | - | Queue notifications |

### State Access Patterns by Module

| Module | Access Pattern | Examples |
|--------|----------------|----------|
| **Plan Mode** | Direct state mutation via setAppState | `setAppState(s => ({ ...s, toolPermissionContext: {...} }))` |
| **Tools** | Context-based access via toolUseContext | `await toolUseContext.getAppState()` |
| **System Reminders** | Read-only for attachment generation | `if (mode === "plan") generateAttachment()` |
| **Attachments** | Read state, clear flags | `If0() && lw(false)` |

---

## Key Architectural Patterns

### 1. Dual State System

Claude Code uses **two state systems**:
1. **React State** - UI-reactive, triggers re-renders
2. **Global State** (`g0`) - Non-reactive, immediate access

**Why:** React state updates are async; some flags need immediate read access.

### 2. Context Modifier Pattern

Tools return `contextModifier` objects instead of directly mutating state:

```javascript
yield {
  message: result,
  contextModifier: {
    modifyContext: (ctx) => ({ ...ctx, updated: true })
  }
};
```

**Why:** Allows state accumulation without mutation during execution.

### 3. Attachment-Based State Communication

State is communicated to LLM via attachments, not direct injection:

```
State Change → Attachment Generator → System Reminder → LLM Context
```

**Why:** Clean separation between state management and context building.

### 4. Mode Transition Callbacks

Mode changes trigger callbacks that set global flags:

```javascript
function onToolPermissionModeChanged(oldMode, newMode) {
  if (newMode === "plan" && oldMode !== "plan") {
    g0.needsPlanModeExitAttachment = false;
  }
  if (oldMode === "plan" && newMode !== "plan") {
    g0.needsPlanModeExitAttachment = true;
  }
}
```

**Why:** Global flags can be read immediately by attachment generators.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

### Plan Mode State Functions
- `hasExitedPlanMode` (Xf0) - chunks.1.mjs:2706-2708
- `setHasExitedPlanMode` (Iq) - chunks.1.mjs:2710-2712
- `needsPlanModeExitAttachment` (If0) - chunks.1.mjs:2714-2716
- `setNeedsPlanModeExitAttachment` (lw) - chunks.1.mjs:2718-2720
- `onToolPermissionModeChanged` (Ty) - chunks.1.mjs:2722-2725

### System Reminder Functions
- `extractSystemReminder` (mI0) - chunks.91.mjs:3368-3371
- `filterSystemReminderMessages` (SG5) - chunks.91.mjs:3373-3402
- `SYSTEM_REMINDER_REGEX` (PG5) - chunks.91.mjs

### Tool Execution
- `StreamingToolExecutor` (_H1) - chunks.133.mjs:2911-3087
- `executeToolGenerator` (jH1) - chunks.133.mjs:3020
- `removeFromInProgressToolUseIDs` (C77) - chunks.133.mjs:3089-3091

### Attachment Builders
- `buildPlanModeAttachment` (j27) - chunks.131.mjs:3207-3231
- `buildPlanModeExitAttachment` (T27) - chunks.131.mjs:3233-3244
- `generateAllAttachments` (O27) - chunks.131.mjs:3121-3138
- `wrapInSystemReminder` (q5) - chunks.147.mjs:3218-3245

---

## See Also

- [app_state.md](./app_state.md) - Core state architecture
- [background_tasks.md](./background_tasks.md) - Background task storage
- [../12_plan_mode/](../12_plan_mode/) - Plan mode implementation
- [../04_system_reminder/](../04_system_reminder/) - System reminder details
- [../05_tools/](../05_tools/) - Tool system implementation
