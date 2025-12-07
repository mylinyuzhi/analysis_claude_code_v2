# Subagent Execution Mechanism

## Overview

This document explains how Claude Code executes subagents, including the serial vs parallel decision logic, the async generator pattern, and background agent handling.

> Symbol mappings: [symbol_index.md](../00_overview/symbol_index.md)

Key functions in this document:
- `executeAgent` (XY1) - Main async generator for agent execution
- `executeForkAgent` (YY1) - Fork-based agent execution
- `createSubAgentContext` (BSA) - Context creation for subagents
- `filterUnresolvedToolUses` (sX0) - Fork context message filtering

---

## Serial vs Parallel: LLM-Based Decision

### Key Insight: No Automated Parallel Detection

**Important Finding**: There is NO automated system that decides whether to run agents in parallel or serial. The decision is **100% made by the main agent LLM** based on:

1. The Task tool description it receives
2. The nature of the tasks at hand
3. Its judgment about dependencies between tasks

### How Parallel Execution is Triggered

From the Task tool description (chunks.125.mjs:1013):

```
Usage notes:
- Launch multiple agents concurrently whenever possible, to maximize performance;
  to do that, use a single message with multiple tool uses
```

**The Pattern:**
```
Single Message with Multiple Tool Uses = Parallel Execution
Separate Messages = Serial Execution
```

### Decision Logic Flow

```
Main Agent receives task requiring multiple subagents
                      │
                      ▼
        ┌─────────────────────────────────┐
        │ Are tasks independent?           │
        │ (Can they run simultaneously?)   │
        └─────────────────────────────────┘
                      │
         ┌────────────┴────────────┐
         │                         │
         ▼ Yes                     ▼ No
┌─────────────────────┐   ┌─────────────────────┐
│ Single message with │   │ Separate messages   │
│ multiple Task calls │   │ (wait for results)  │
└─────────────────────┘   └─────────────────────┘
         │                         │
         ▼                         ▼
   PARALLEL EXECUTION        SERIAL EXECUTION
```

### Example: Parallel

```javascript
// Main agent sends ONE message with multiple tool_use blocks:
{
  "type": "assistant",
  "content": [
    {
      "type": "tool_use",
      "name": "Task",
      "input": {
        "subagent_type": "Explore",
        "prompt": "Find all TypeScript files with 'error' in name"
      }
    },
    {
      "type": "tool_use",
      "name": "Task",
      "input": {
        "subagent_type": "Explore",
        "prompt": "Find all test files for authentication"
      }
    }
  ]
}
// Both agents execute concurrently!
```

### Example: Serial

```javascript
// Main agent sends message 1:
{
  "type": "assistant",
  "content": [{
    "type": "tool_use",
    "name": "Task",
    "input": {
      "subagent_type": "Plan",
      "prompt": "Design the authentication system"
    }
  }]
}

// Wait for result...

// Main agent sends message 2 (uses result from message 1):
{
  "type": "assistant",
  "content": [{
    "type": "tool_use",
    "name": "Task",
    "input": {
      "subagent_type": "general-purpose",
      "prompt": "Implement the auth system based on the plan above"
    }
  }]
}
```

---

## Async Generator Pattern: XY1 (executeAgent)

The core agent execution uses an **async generator pattern** that yields progress events while processing.

```javascript
// ============================================
// executeAgent - Main async generator for agent execution
// Location: chunks.145.mjs:1069-1190
// ============================================

// ORIGINAL (for source lookup):
async function* XY1({
  agentDefinition: A,
  promptMessages: Q,
  toolUseContext: B,
  canUseTool: G,
  isAsync: Z,
  forkContextMessages: I,
  querySource: Y,
  override: J,
  model: W
}) {
  let X = await B.getAppState(),
    V = X.toolPermissionContext.mode,
    F = inA(A.model, B.options.mainLoopModel, W, V),
    K = J?.agentId ? J.agentId : SWA(),
    H = [...I ? sX0(I) : [], ...Q],
    // ... initialization ...
    m = BSA(B, {
      options: k,
      agentId: K,
      messages: H,
      // ... context options ...
    });
  for await (let o of O$({
    messages: H,
    systemPrompt: v,
    userContext: E,
    systemContext: U,
    canUseTool: G,
    toolUseContext: m,
    querySource: Y
  })) if (o.type === "assistant" || o.type === "user" || o.type === "progress" || o.type === "system" && o.subtype === "compact_boundary") x.push(o), p = EJ9(x, K).catch((IA) => g(`Failed to record sidechain transcript: ${IA}`)), yield o;
  if (await p, u.signal.aborted) throw new WW;
  if ($O(A) && A.callback) A.callback()
}

// READABLE (for understanding):
async function* executeAgent({
  agentDefinition,
  promptMessages,
  toolUseContext,
  canUseTool,
  isAsync,
  forkContextMessages,
  querySource,
  override,
  model
}) {
  // Get app state and determine model
  const appState = await toolUseContext.getAppState();
  const permissionMode = appState.toolPermissionContext.mode;
  const resolvedModel = resolveAgentModel(
    agentDefinition.model,
    toolUseContext.options.mainLoopModel,
    model,
    permissionMode
  );

  // Generate unique agent ID or use provided one
  const agentId = override?.agentId ?? generateAgentId();

  // Prepare messages: fork context (filtered) + prompt messages
  const messages = [
    ...(forkContextMessages ? filterUnresolvedToolUses(forkContextMessages) : []),
    ...promptMessages
  ];

  // Resolve tools for this agent
  const resolvedTools = resolveAgentTools(agentDefinition, toolUseContext.options.tools, isAsync).resolvedTools;

  // Create subagent context
  const subAgentContext = createSubAgentContext(toolUseContext, {
    options: { tools: resolvedTools, mainLoopModel: resolvedModel, ... },
    agentId: agentId,
    messages: messages,
    // ... other options ...
  });

  // Execute main agent loop, yielding events
  const collectedMessages = [];
  for await (const event of mainAgentLoop({
    messages,
    systemPrompt,
    userContext,
    systemContext,
    canUseTool,
    toolUseContext: subAgentContext,
    querySource
  })) {
    // Filter and collect relevant events
    if (event.type === "assistant" ||
        event.type === "user" ||
        event.type === "progress" ||
        (event.type === "system" && event.subtype === "compact_boundary")) {
      collectedMessages.push(event);

      // Record transcript asynchronously
      recordSidechainTranscript(collectedMessages, agentId);

      // Yield event to caller
      yield event;
    }
  }

  // Check for abort
  if (abortController.signal.aborted) {
    throw new AbortError();
  }

  // Call agent callback if built-in
  if (isBuiltInAgent(agentDefinition) && agentDefinition.callback) {
    agentDefinition.callback();
  }
}

// Mapping: XY1→executeAgent, A→agentDefinition, Q→promptMessages, B→toolUseContext,
//          G→canUseTool, Z→isAsync, I→forkContextMessages, Y→querySource, J→override, W→model
```

### Yielded Event Types

| Event Type | Description | Collected? |
|------------|-------------|------------|
| `assistant` | Agent's response message | Yes |
| `user` | User/tool result message | Yes |
| `progress` | Progress updates | Yes |
| `system` (compact_boundary) | Compact boundary marker | Yes |
| `stream_event` | Streaming events | No |
| `stream_request_start` | Stream start marker | No |

---

## Promise.race Execution Loop

The Task tool uses `Promise.race` to enable interruptible agent execution:

```javascript
// ============================================
// Task Tool Execution Loop - Promise.race pattern
// Location: chunks.145.mjs:1905-1955
// ============================================

// ORIGINAL (for source lookup):
let m = XY1({
  ...R,
  override: { ...R.override, agentId: T }
})[Symbol.asyncIterator]();

try {
  while (!0) {
    let FA = m.next(),
      zA = await Promise.race([
        FA.then((wA) => ({ type: "message", result: wA })),
        p.then(() => ({ type: "background" }))
      ]);
    zA.type;
    let { result: NA } = zA;
    if (NA.done) break;
    // ... process event ...
  }
} finally {
  if (k) clearInterval(k);
  if (Y.setToolJSX) Y.setToolJSX(null)
}

// READABLE (for understanding):
const agentIterator = executeAgent({
  ...executionParams,
  override: { ...executionParams.override, agentId }
})[Symbol.asyncIterator]();

try {
  while (true) {
    const nextPromise = agentIterator.next();

    // Race between:
    // 1. Next message from agent
    // 2. Background signal (for async agents)
    const raceResult = await Promise.race([
      nextPromise.then(result => ({ type: "message", result })),
      backgroundSignal.then(() => ({ type: "background" }))
    ]);

    if (raceResult.type === "background") {
      // Background agent - return early, continue in background
      // (not shown: actual implementation returns async_launched status)
    }

    const { result } = raceResult;
    if (result.done) break;  // Agent completed

    const event = result.value;
    collectedEvents.push(event);

    // Process and forward progress events...
  }
} finally {
  clearInterval(progressTimer);
  clearToolJSX();
}

// Mapping: m→agentIterator, FA→nextPromise, zA→raceResult, NA→result, p→backgroundSignal
```

**Key Pattern**: `Promise.race` allows:
1. **Foreground agents**: Process each event as it comes
2. **Background agents**: Return early with `async_launched` status while agent continues

---

## Context Creation: BSA (createSubAgentContext)

Every subagent gets its own isolated context:

```javascript
// ============================================
// createSubAgentContext - Create isolated context for subagent
// Location: chunks.145.mjs:915-960
// ============================================

// ORIGINAL (for source lookup):
function BSA(A, Q) {
  let B = Q?.abortController ?? (Q?.shareAbortController ? A.abortController : JU0(A.abortController)),
    G = Q?.getAppState ? Q.getAppState : Q?.shareAbortController ? A.getAppState : async () => {
      let Z = await A.getAppState();
      if (Z.toolPermissionContext.shouldAvoidPermissionPrompts) return Z;
      return {
        ...Z,
        toolPermissionContext: {
          ...Z.toolPermissionContext,
          shouldAvoidPermissionPrompts: !0
        }
      }
    };
  return {
    readFileState: kAA(Q?.readFileState ?? A.readFileState),
    nestedMemoryAttachmentTriggers: new Set,
    toolDecisions: void 0,
    pendingSteeringAttachments: void 0,
    abortController: B,
    getAppState: G,
    setAppState: Q?.shareSetAppState ? A.setAppState : () => {},
    setMessages: () => {},
    setInProgressToolUseIDs: () => {},
    setResponseLength: Q?.shareSetResponseLength ? A.setResponseLength : () => {},
    updateFileHistoryState: () => {},
    addNotification: void 0,
    setToolJSX: void 0,
    setStreamMode: void 0,
    setSpinnerMessage: void 0,
    setSpinnerColor: void 0,
    setSpinnerShimmerColor: void 0,
    setSDKStatus: void 0,
    openMessageSelector: void 0,
    options: Q?.options ?? A.options,
    messages: Q?.messages ?? A.messages,
    agentId: Q?.agentId ?? SWA(),
    isSubAgent: !0,
    queryTracking: {
      chainId: E_3(),
      depth: (A.queryTracking?.depth ?? -1) + 1
    },
    fileReadingLimits: A.fileReadingLimits,
    userModified: A.userModified,
    criticalSystemReminder_EXPERIMENTAL: Q?.criticalSystemReminder_EXPERIMENTAL
  }
}

// READABLE (for understanding):
function createSubAgentContext(parentContext, options) {
  // AbortController: shared or isolated based on options
  const abortController = options?.abortController ??
    (options?.shareAbortController
      ? parentContext.abortController
      : createIsolatedAbortController(parentContext.abortController));

  // GetAppState: force shouldAvoidPermissionPrompts=true for subagents
  const getAppState = options?.getAppState ?? (
    options?.shareAbortController
      ? parentContext.getAppState
      : async () => {
          const state = await parentContext.getAppState();
          if (state.toolPermissionContext.shouldAvoidPermissionPrompts) return state;
          return {
            ...state,
            toolPermissionContext: {
              ...state.toolPermissionContext,
              shouldAvoidPermissionPrompts: true  // Key: Subagents don't prompt for permissions
            }
          };
        }
  );

  return {
    // File state: cloned for isolation
    readFileState: cloneReadFileState(options?.readFileState ?? parentContext.readFileState),

    // New/empty state for subagent
    nestedMemoryAttachmentTriggers: new Set(),
    toolDecisions: undefined,
    pendingSteeringAttachments: undefined,

    // Controllers
    abortController,
    getAppState,

    // Disabled setters (subagent can't modify parent UI)
    setAppState: options?.shareSetAppState ? parentContext.setAppState : () => {},
    setMessages: () => {},
    setInProgressToolUseIDs: () => {},
    setResponseLength: options?.shareSetResponseLength ? parentContext.setResponseLength : () => {},
    updateFileHistoryState: () => {},

    // Disabled UI functions
    addNotification: undefined,
    setToolJSX: undefined,
    setStreamMode: undefined,
    setSpinnerMessage: undefined,
    setSpinnerColor: undefined,
    setSpinnerShimmerColor: undefined,
    setSDKStatus: undefined,
    openMessageSelector: undefined,

    // Options and messages
    options: options?.options ?? parentContext.options,
    messages: options?.messages ?? parentContext.messages,

    // Subagent identification
    agentId: options?.agentId ?? generateAgentId(),
    isSubAgent: true,  // Key flag identifying this as a subagent

    // Query tracking (increments depth)
    queryTracking: {
      chainId: generateChainId(),
      depth: (parentContext.queryTracking?.depth ?? -1) + 1
    },

    // Inherited from parent
    fileReadingLimits: parentContext.fileReadingLimits,
    userModified: parentContext.userModified,
    criticalSystemReminder_EXPERIMENTAL: options?.criticalSystemReminder_EXPERIMENTAL
  };
}

// Mapping: BSA→createSubAgentContext, A→parentContext, Q→options, B→abortController, G→getAppState
```

### Key Context Properties

| Property | Subagent Value | Purpose |
|----------|----------------|---------|
| `isSubAgent` | `true` | Identifies context as subagent |
| `shouldAvoidPermissionPrompts` | `true` | No permission dialogs |
| `agentId` | Unique ID | Track subagent instance |
| `queryTracking.depth` | parent.depth + 1 | Track nesting level |
| `setMessages` | `() => {}` | Disabled - can't modify parent |
| `setToolJSX` | `undefined` | Disabled - no UI access |

---

## Fork Context Message Filtering

When an agent has `forkContext: true`, it receives the conversation history. However, messages with unresolved tool uses are filtered:

```javascript
// ============================================
// filterUnresolvedToolUses - Filter messages with pending tool uses
// Location: chunks.145.mjs:1192-1208
// ============================================

// ORIGINAL (for source lookup):
function sX0(A) {
  let Q = new Set;
  for (let B of A)
    if (B?.type === "user") {
      let Z = B.message.content;
      if (Array.isArray(Z)) {
        for (let I of Z)
          if (I.type === "tool_result" && I.tool_use_id) Q.add(I.tool_use_id)
      }
    }
  return A.filter((B) => {
    if (B?.type === "assistant") {
      let Z = B.message.content;
      if (Array.isArray(Z)) return !Z.some((Y) => Y.type === "tool_use" && Y.id && !Q.has(Y.id))
    }
    return !0
  })
}

// READABLE (for understanding):
function filterUnresolvedToolUses(messages) {
  // Step 1: Collect all tool_use_ids that have results
  const resolvedToolUseIds = new Set();
  for (const message of messages) {
    if (message?.type === "user") {
      const content = message.message.content;
      if (Array.isArray(content)) {
        for (const block of content) {
          if (block.type === "tool_result" && block.tool_use_id) {
            resolvedToolUseIds.add(block.tool_use_id);
          }
        }
      }
    }
  }

  // Step 2: Filter out assistant messages with unresolved tool uses
  return messages.filter((message) => {
    if (message?.type === "assistant") {
      const content = message.message.content;
      if (Array.isArray(content)) {
        // Check if ANY tool_use in this message lacks a result
        const hasUnresolvedToolUse = content.some(
          block => block.type === "tool_use" &&
                   block.id &&
                   !resolvedToolUseIds.has(block.id)
        );
        return !hasUnresolvedToolUse;  // Keep if no unresolved tool uses
      }
    }
    return true;  // Keep non-assistant messages
  });
}

// Mapping: sX0→filterUnresolvedToolUses, A→messages, Q→resolvedToolUseIds
```

**Why This Filtering?**
- Fork context includes conversation history
- Some tool uses may not have results yet (in-progress tools)
- Subagent seeing tool_use without tool_result causes confusion
- Filter removes messages with pending/unresolved tool uses

---

## Background Agent Execution

Agents can run in background with `run_in_background: true`:

### Background Agent Flow

```
Main Agent calls Task with run_in_background: true
                      │
                      ▼
┌───────────────────────────────────────────────────────────────┐
│ Task Tool Handler                                             │
│  1. Launch executeAgent() generator                           │
│  2. Return immediately with async_launched status             │
│  3. Agent continues in background                             │
└───────────────────────────────────────────────────────────────┘
                      │
         ┌────────────┴────────────┐
         │                         │
         ▼                         ▼
┌─────────────────────┐   ┌─────────────────────┐
│ Main Agent receives │   │ Subagent executes   │
│ async_launched      │   │ in background       │
│ with agentId        │   │                     │
└─────────────────────┘   └─────────────────────┘
         │                         │
         │                         ▼
         │            ┌─────────────────────┐
         │            │ Transcript saved    │
         │            │ with agentId        │
         │            └─────────────────────┘
         │                         │
         ▼                         │
┌─────────────────────┐            │
│ Main Agent calls    │◄───────────┘
│ AgentOutputTool     │
│ with agentId        │
└─────────────────────┘
         │
         ▼
┌─────────────────────┐
│ Returns agent       │
│ final report        │
└─────────────────────┘
```

### AgentOutputTool Schema

```javascript
// ============================================
// AgentOutputTool Input Schema
// Location: chunks.145.mjs:1683-1687
// ============================================

// ORIGINAL:
VtZ = j.strictObject({
  agentId: j.string().describe("The agent ID to retrieve results for"),
  block: j.boolean().default(!0).describe("Whether to block until results are ready"),
  wait_up_to: j.number().min(0).max(300).default(150).describe("Maximum time to wait in seconds")
})

// READABLE:
agentOutputInputSchema = z.strictObject({
  agentId: z.string()
    .describe("The agent ID to retrieve results for"),
  block: z.boolean().default(true)
    .describe("Whether to block until results are ready"),
  wait_up_to: z.number().min(0).max(300).default(150)
    .describe("Maximum time to wait in seconds")
});
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `agentId` | string | required | ID from async_launched response |
| `block` | boolean | `true` | Wait for completion or immediate status |
| `wait_up_to` | number | 150 | Max wait time in seconds (0-300) |

### Async Agent Response Format

```javascript
// When agent is launched in background:
{
  status: "async_launched",
  agentId: "abc123-...",           // Use this to retrieve results
  description: "task description",
  prompt: "the original prompt"
}

// When retrieving results via AgentOutputTool:
{
  status: "completed",
  prompt: "the original prompt",
  agentId: "abc123-...",
  content: [{ type: "text", text: "..." }],
  totalDurationMs: 15000,
  totalTokens: 5000,
  totalToolUseCount: 12,
  usage: { /* detailed usage */ }
}
```

---

## Execution Lifecycle Summary

```
┌─────────────────────────────────────────────────────────────────┐
│                     TASK TOOL CALLED                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ 1. VALIDATE AGENT                                               │
│    - Find agent definition by subagent_type                     │
│    - Resolve model (agent > main > override > permission mode)  │
│    - Log telemetry: tengu_agent_tool_selected                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ 2. PREPARE CONTEXT                                              │
│    - Load resume transcript (if resuming)                       │
│    - Get fork context messages (if forkContext: true)           │
│    - Create entry message with prompt                           │
│    - Resolve system prompt                                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ 3. CREATE SUBAGENT CONTEXT (BSA)                                │
│    - Set isSubAgent: true                                       │
│    - Set shouldAvoidPermissionPrompts: true                     │
│    - Generate unique agentId                                    │
│    - Increment query depth                                      │
│    - Disable UI callbacks                                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ 4. EXECUTE AGENT (XY1)                                          │
│    - Start async generator                                      │
│    - Run main agent loop (O$)                                   │
│    - Yield events as they occur                                 │
│    - Record transcript continuously                             │
└─────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              │                               │
              ▼ Sync                          ▼ Async (run_in_background)
┌─────────────────────────┐      ┌─────────────────────────┐
│ 5a. WAIT FOR COMPLETION │      │ 5b. RETURN IMMEDIATELY  │
│     - Collect all events│      │     - Return agentId    │
│     - Extract final msg │      │     - Agent continues   │
│     - Return completed  │      │     - Return async_     │
│       status            │      │       launched status   │
└─────────────────────────┘      └─────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ 6. TELEMETRY & CLEANUP                                          │
│    - Log: tengu_agent_tool_completed                            │
│    - Call agent callback (if built-in)                          │
│    - Clear UI state                                             │
└─────────────────────────────────────────────────────────────────┘
```

---

## Transcript Recording System

### Overview

Every subagent execution records a transcript that enables the **resume** capability. This is handled by the `recordSidechainTranscript` (EJ9) function.

### Key Functions

- `recordSidechainTranscript` (EJ9) - Records messages to sidechain transcript
- `filterTranscriptEvents` (Bz9) - Filters events before recording
- `loadTranscript` (KY1) - Loads transcript for resume

### Recording Mechanism

```javascript
// ============================================
// recordSidechainTranscript - Save subagent messages for resume
// Location: chunks.154.mjs:908-910
// ============================================

// ORIGINAL (for source lookup):
async function EJ9(A, Q) {
  await _$().insertMessageChain(Bz9(A), !0, Q)
}

// READABLE (for understanding):
async function recordSidechainTranscript(messages, agentId) {
  // Filter messages, then insert as sidechain (isSidechain: true)
  await getSessionStorage().insertMessageChain(
    filterTranscriptEvents(messages),
    true,   // isSidechain flag
    agentId // Used to identify which agent's transcript
  );
}

// Mapping: EJ9→recordSidechainTranscript, A→messages, Q→agentId,
//          _$→getSessionStorage, Bz9→filterTranscriptEvents
```

**How it's called in executeAgent (XY1):**
```javascript
// Inside the main loop:
for await (const event of mainAgentLoop(...)) {
  if (event.type === "assistant" || event.type === "user" ||
      event.type === "progress" ||
      (event.type === "system" && event.subtype === "compact_boundary")) {

    collectedMessages.push(event);

    // Record transcript asynchronously (non-blocking)
    recordSidechainTranscript(collectedMessages, agentId)
      .catch(err => log(`Failed to record sidechain transcript: ${err}`));

    yield event;
  }
}
```

**Key Insight:** Recording is asynchronous and error-tolerant. Failures are logged but don't abort the agent.

### Event Filtering

Not all events are recorded to the transcript:

```javascript
// ============================================
// filterTranscriptEvents - Filter events for transcript storage
// Location: chunks.154.mjs:1269-1275
// ============================================

// ORIGINAL (for source lookup):
function Bz9(A) {
  return A.filter((Q) => {
    if (Q.type === "progress") return !1;
    if (Q.type === "attachment" && sE9() !== "ant") return !1;
    return !0
  })
}

// READABLE (for understanding):
function filterTranscriptEvents(events) {
  return events.filter(event => {
    // Exclude progress events (transient, UI-only)
    if (event.type === "progress") return false;

    // Exclude attachments unless in Anthropic environment
    if (event.type === "attachment" && getEnvironment() !== "ant") {
      return false;
    }

    return true;  // Keep all other events
  });
}

// Mapping: Bz9→filterTranscriptEvents, A→events, Q→event, sE9→getEnvironment
```

**Filtered Event Types:**

| Event Type | Recorded? | Reason |
|------------|-----------|--------|
| `assistant` | ✅ Yes | Core message content |
| `user` | ✅ Yes | Tool results, user messages |
| `system` (compact_boundary) | ✅ Yes | Compact markers |
| `progress` | ❌ No | Transient, UI-only |
| `attachment` | Conditional | Only in Anthropic environment |

### Loading Transcript for Resume

When an agent is resumed via the `resume` parameter, its transcript is loaded:

```javascript
// ============================================
// loadTranscript - Load subagent transcript for resume
// Location: chunks.154.mjs:1243-1267
// ============================================

// ORIGINAL (for source lookup):
async function KY1(A) {
  let Q = DVA(A),
    B = RA();
  try {
    B.statSync(Q)
  } catch {
    return null
  }
  try {
    let {
      messages: G
    } = await jVA(Q), Z = Array.from(G.values()).filter((X) => X.agentId === A && X.isSidechain);
    if (Z.length === 0) return null;
    let I = new Set(Z.map((X) => X.parentUuid)),
      Y = Z.filter((X) => !I.has(X.uuid)).sort((X, V) => new Date(V.timestamp).getTime() - new Date(X.timestamp).getTime())[0];
    if (!Y) return null;
    return SJ1(G, Y).filter((X) => X.agentId === A).map(({
      isSidechain: X,
      parentUuid: V,
      ...F
    }) => F)
  } catch {
    return null
  }
}

// READABLE (for understanding):
async function loadTranscript(agentId) {
  // Get transcript file path
  const transcriptPath = getTranscriptPath(agentId);
  const fs = getFileSystem();

  // Check if file exists
  try {
    fs.statSync(transcriptPath);
  } catch {
    return null;  // File doesn't exist
  }

  try {
    // Load and parse transcript file
    const { messages } = await parseTranscriptFile(transcriptPath);

    // Filter to sidechain messages for this agent
    const sidechainMessages = Array.from(messages.values())
      .filter(msg => msg.agentId === agentId && msg.isSidechain);

    if (sidechainMessages.length === 0) return null;

    // Find leaf messages (no children)
    const hasChildren = new Set(sidechainMessages.map(m => m.parentUuid));
    const leafMessages = sidechainMessages
      .filter(m => !hasChildren.has(m.uuid))
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    const latestLeaf = leafMessages[0];
    if (!latestLeaf) return null;

    // Reconstruct message chain from leaf to root
    const chain = reconstructMessageChain(messages, latestLeaf)
      .filter(m => m.agentId === agentId)
      .map(({ isSidechain, parentUuid, ...rest }) => rest);

    return chain;
  } catch {
    return null;  // Parse error
  }
}

// Mapping: KY1→loadTranscript, A→agentId, Q→transcriptPath, DVA→getTranscriptPath,
//          jVA→parseTranscriptFile, SJ1→reconstructMessageChain
```

**Loading Algorithm:**

```
loadTranscript(agentId)
           │
           ▼
┌─────────────────────────────────────────────────────────────────┐
│ 1. Check if transcript file exists                              │
│    If not, return null                                          │
└─────────────────────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────────────┐
│ 2. Parse transcript file                                        │
│    Get all messages from storage                                │
└─────────────────────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────────────┐
│ 3. Filter to sidechain messages for this agentId                │
│    isSidechain: true AND agentId matches                        │
└─────────────────────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────────────┐
│ 4. Find leaf message (most recent with no children)             │
│    Sort by timestamp descending, take first                     │
└─────────────────────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────────────┐
│ 5. Reconstruct message chain from leaf to root                  │
│    Follow parentUuid links                                      │
└─────────────────────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────────────┐
│ 6. Clean up messages (remove isSidechain, parentUuid)           │
│    Return array of messages                                     │
└─────────────────────────────────────────────────────────────────┘
```

### Transcript Storage Structure

| Property | Description |
|----------|-------------|
| `uuid` | Unique message identifier |
| `parentUuid` | Link to previous message in chain |
| `agentId` | Which agent this message belongs to |
| `isSidechain` | `true` for subagent messages |
| `timestamp` | When message was recorded |
| `type` | Message type (assistant, user, system) |
| `message` | Actual message content |

### Design Rationale

**Why record transcripts?**
1. **Resume capability**: Allow interrupted agents to continue
2. **Debugging**: Inspect what agent did
3. **Audit trail**: Track agent actions for safety

**Why asynchronous recording?**
1. **Performance**: Don't block agent execution
2. **Error tolerance**: Agent continues even if storage fails
3. **Streaming friendly**: Record as events come in

**Why filter events?**
1. **Space efficiency**: Progress events are transient
2. **Privacy**: Attachments may contain sensitive data
3. **Replay accuracy**: Only store meaningful events

---

## Key Takeaways

1. **Parallel vs Serial is LLM-decided**: No automated detection; main agent chooses based on task analysis
2. **Single message with multiple tool_use = parallel**: The key pattern for concurrent execution
3. **Async generator (XY1)**: Enables streaming progress and interruptible execution
4. **Promise.race pattern**: Allows background agents to return early
5. **Isolated context (BSA)**: Subagents can't modify parent state or UI
6. **shouldAvoidPermissionPrompts**: Subagents never prompt for permissions
7. **Fork context filtering**: Removes messages with unresolved tool uses
8. **Transcript recording**: Every subagent execution is saved for potential resume
9. **Resume via loadTranscript**: Reconstruct message chain from storage
