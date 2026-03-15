# LLM Core: UI Linkage (Claude Code 2.1.38)

> Complete pipeline from user input → LLM API streaming → React state updates → Terminal UI rendering.
> Covers REPL integration, stream event processing, and component-level render triggers.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Agent Loop, LLM API)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Steering, Stream events)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations (UI Components)

Key functions in this document:
- `onQuery` (ff) - REPL entry point for user message submission, chunks.188.mjs:589
- `handleQuery` (oc) - Executes agent loop with full context, chunks.188.mjs:550
- `handleStreamedEvent` (T11) - Callback receiving events from agent loop, chunks.188.mjs:542
- `processStreamEvent` (iW1) - Routes stream events to correct React state setters, chunks.173.mjs:390
- `mainAgentLoop` (ZR) - Core async generator yielding stream events, chunks.149.mjs:1753
- `SessionLogRenderer` (KYq) - Transcript display component, chunks.161.mjs:917
- `AssistantMessageRenderer` (Yd1) - Per-message display component, chunks.161.mjs:874
- `MessageTranscript` (g91) - Full conversation history renderer, chunks.161.mjs
- `BashOutputRenderer` (BYq) - Shell output detail component, chunks.162.mjs:3

---

## Architecture Overview

The UI linkage connects the React terminal UI (built on Ink) to the async generator LLM streaming pipeline through a series of callbacks and React state updates:

```
[Terminal Input Box]
        │ onSubmit (Z$)
        ▼
[REPL Component (TUA)]
  onQuery callback (ff)
        │ submitQuery
        ▼
[Message State Update]
  setMessages([...existing, userMessage])
  setIsLoading(true)
        │ executeQuery
        ▼
[Agent Loop Integration (oc/handleQuery)]
  Build system prompt + tool context
  for await (event of mainAgentLoop(ZR)) {
    handleStreamedEvent(T11)(event)
  }
        │ ZR yields stream events
        ▼
[LLM Streaming (lOq/llmRequestGenerator)]
  for await (event of AnthropicAPI.stream()) {
    yield { type: "stream_event", event }    ← raw SSE events
    on content_block_stop:
      yield completeAssistantMessage         ← triggers re-render
  }
        │ yielded events
        ▼
[handleStreamedEvent (T11)]
  calls processStreamEvent(iW1)
        │ dispatches to state setters
        ▼
[React State Updates]
  setMessages((m) => [...m, event])         ← full message: re-render
  setStreamMode("thinking"|"responding"...)  ← status bar update
  setStreamingToolUses([...toolInputs])      ← tool preview update
        │ React reconciliation
        ▼
[Component Re-renders]
  SessionLogRenderer (KYq)
    └── MessageTranscript (g91)
          ├── AssistantMessageRenderer (Yd1)  ← text/thinking blocks
          ├── ToolUseBlock renderer           ← tool_use blocks
          └── ToolResultBlock renderer        ← tool results
  BashOutputRenderer (BYq)                   ← shell output (polling)
```

---

## Stage 1: User Input → Query Submission

### onQuery - REPL query entry point

**What it does:** The top-level callback that receives user-submitted messages, prevents concurrent queries, updates UI state, and delegates to `handleQuery`.

**How it works:**

1. **Proactive mode abort**: If proactive mode is active when the user submits, terminates the proactive agent before proceeding.
2. **Concurrency guard**: Checks `isQueryInProgress.current` (a `useRef`). If a query is already running, enqueues the new message via `lB` (enqueueOrBuffer) and returns immediately, preventing race conditions.
3. **Loading state**: Sets `isQueryInProgress.current = true`, calls `setIsLoading(true)`, appends user messages to `setMessages`, clears streaming tool uses.
4. **State sync**: Waits for the React state flush via a `new Promise` that resolves from inside `setMessages` — this ensures the appended message is visible in `allMessages` before query execution.
5. **beforeQueryHook**: If a hook is provided (e.g., remote session), runs it with `allMessages + newMessages`. If it returns false, aborts the query.
6. **Delegates to handleQuery**: Calls `oc` with the complete message history.

```javascript
// ============================================
// onQuery - REPL user message submission entry point
// Location: chunks.188.mjs:589-680
// ============================================

// ORIGINAL (for source lookup):
ff = dA.useCallback(async (k6, q8, FA, Yq, k7, X4, p7, V3) => {
  if (l8()) {
    let sq = i3(), J3 = g5();
    if (sq && J3) kj6(sq, J3, !0)
  }
  if (I6.current) {
    c("tengu_concurrent_onquery_detected", {}),
    k6.filter((sq) => sq.type === "user").map((sq) => J51(sq.message.content)).filter((sq) => sq !== null)
      .forEach((sq, J3) => { if (lB({value: sq, mode: "prompt"}, A1), J3 === 0) c("tengu_concurrent_onquery_enqueued", {}) });
    C3(!1); return
  }
  I6.current = !0, tA.current = k6;
  try {
    C3(!0), X6((J3) => [...J3, ...k6]), ZY(void 0), Qj.current = 0, xq([]);
    let sq = await new Promise((J3) => { X6((pK) => { return J3(pK), pK }) });
    if (p7 && V3) { let J3 = [...sq, ...k6]; if (!await p7(V3, J3)) return }
    await oc(sq, k6, q8, FA, Yq, k7, X4)
  } finally { I6.current = !1, LP(Date.now()), YK(); }
}, [oc, C3, A1, YK])

// READABLE (for understanding):
const onQuery = useCallback(async (
  newMessages,         // k6: incoming user messages
  abortController,     // q8: request abort controller
  hasShellContext,     // FA: shell context flag
  shouldQuery,         // Yq: execute query flag
  model,               // k7: model to use
  specSessionTime,     // X4: speculation session time saved
  beforeQueryHook,     // p7: pre-query callback
  beforeQueryState     // V3: pre-query state
) => {
  // Terminate proactive agent if active
  if (isProactiveMode()) {
    let agent = getProactiveAgent(), config = getProactiveConfig();
    if (agent && config) terminateProactiveAgent(agent, config, true);
  }
  // Prevent concurrent queries by queueing
  if (isQueryInProgress.current) {
    recordMetric("tengu_concurrent_onquery_detected", {});
    newMessages.filter(m => m.type === "user")
      .map(m => extractPromptText(m.message.content)).filter(Boolean)
      .forEach((text, i) => {
        enqueueOrBuffer({value: text, mode: "prompt"}, appState);
        if (i === 0) recordMetric("tengu_concurrent_onquery_enqueued", {});
      });
    setIsLoading(false); return;
  }
  isQueryInProgress.current = true;
  lastQueryMessages.current = newMessages;
  try {
    setIsLoading(true);
    setMessages(m => [...m, ...newMessages]);  // Optimistic UI update
    setUserInputOnProcessing(undefined);
    turnCounter.current = 0;
    setStreamingToolUses([]);
    // Wait for state to settle (ensures allMessages includes new messages)
    let allMessages = await new Promise(resolve => {
      setMessages(msgs => { resolve(msgs); return msgs; })
    });
    // Run pre-query hook
    if (beforeQueryHook && beforeQueryState) {
      if (!await beforeQueryHook(beforeQueryState, [...allMessages, ...newMessages])) return;
    }
    await handleQuery(allMessages, newMessages, abortController, hasShellContext, shouldQuery, model, specSessionTime);
  } finally {
    isQueryInProgress.current = false;
    setLastQueryTime(Date.now());
    resetLoadingState();
  }
}, [handleQuery, setIsLoading, appState, resetLoadingState])

// Mapping: ff→onQuery, k6→newMessages, q8→abortController, Yq→shouldQuery, k7→model,
//   I6→isQueryInProgress, C3→setIsLoading, X6→setMessages, ZY→setUserInputOnProcessing,
//   xq→setStreamingToolUses, oc→handleQuery, LP→setLastQueryTime, YK→resetLoadingState
```

**Why this approach:**
- The `new Promise` wrapping `setMessages` is a deliberate trick to flush React's state batch before proceeding. Without this, `allMessages` passed to `handleQuery` would not include the just-appended user messages.
- Using `useRef` for `isQueryInProgress` (rather than `useState`) avoids re-renders on toggle — the ref updates synchronously within the same event loop tick, preventing races even if React batches state updates.

**Key insight:** The concurrency prevention happens at the JavaScript level (synchronous `useRef` check), not at the async level. This prevents even the most aggressive concurrent submits before React has a chance to re-render.

---

## Stage 2: Context Building → Agent Loop Entry

### handleQuery - Agent loop integration

**What it does:** Builds the full execution context (system prompt, tools, user context) and feeds messages into the main agent loop generator.

**How it works:**

1. **MCP session start**: Notifies MCP clients that a query has started (so they can refresh tool state).
2. **User input logging**: Logs the user's input text for diagnostics.
3. **Tool use context building**: Calls `J0` (getToolUseContext) to build permission context, model info, and shell state.
4. **Parallel context loading** via `Promise.all`:
   - `loadFileHistoryContext` — git status, changed files
   - `buildSystemPrompt` (dZ) — assembles the 12+ section system prompt
   - `loadInputContext` — user config, language preferences
   - `loadSystemContext` — platform info, environment
5. **System prompt composition**: Combines custom system prompt + default system prompt via `ot` (buildFinalSystemPrompt).
6. **Agent loop execution**: `for await (let event of ZR({...})) handleStreamedEvent(event)` — the generator yields one event at a time, and each is immediately processed.
7. **Post-query cleanup**: Resets loading state, runs profiling report, calls `onTurnComplete` callback.

```javascript
// ============================================
// handleQuery - Bridges React UI to main agent loop
// Location: chunks.188.mjs:550-588
// ============================================

// ORIGINAL (for source lookup):
oc = dA.useCallback(async (k6, q8, FA, Yq, k7, X4, p7) => {
  let V3 = q8.filter((f$) => f$.type === "user" || f$.type === "assistant").pop();
  if (Yq) { Fd.handleQueryStart(p1); let f$ = iV(p1); if (f$) mx7(f$) }
  if (yD1(), V3?.type === "user" && typeof V3.message.content === "string") eL7(V3.message.content);
  if (!Yq) { YK(), HY(null); return }
  let sq = J0(k6, q8, FA, k7, p7, X4);
  y3("query_context_loading_start");
  let [, , J3, pK, _Y] = await Promise.all([
    zUA(B, A1), void 0,
    dZ(bA, X4, Array.from(B.additionalWorkingDirectories.keys()), p1),
    i$(), l$()
  ]),
  Uj = {...pK, ...mWz(p1)};
  y3("query_context_loading_end");
  let iJ = ot({ mainThreadAgentDefinition: k, toolUseContext: sq, customSystemPrompt: D,
    defaultSystemPrompt: J3, appendSystemPrompt: j });
  y3("query_query_start");
  for await (let f$ of ZR({ messages: k6, systemPrompt: iJ, userContext: Uj,
    systemContext: _Y, canUseTool: Zf, toolUseContext: sq, querySource: EQ1() })) T11(f$);
  y3("query_end"), YK(), n1q(), P?.()
}, [p1, YK, J0, B, A1, bA, D, P, j, Zf, k, T11])

// READABLE (for understanding):
const handleQuery = useCallback(async (
  allMessages, newMessages, abortController, hasShellContext,
  shouldQuery, model, specSessionTime
) => {
  let lastMessage = newMessages.filter(m => m.type === "user" || m.type === "assistant").pop();
  // Notify MCP clients, close diff tabs in IDE
  if (shouldQuery) {
    MCPManager.handleQueryStart(mcpClients);
    let ideUpdate = findConnectedIdeClient(mcpClients);
    if (ideUpdate) closeAllDiffTabs(ideUpdate);
  }
  // Log the user's query text
  if (logUserInput() && lastMessage?.type === "user" && typeof lastMessage.message.content === "string") {
    recordUserInput(lastMessage.message.content);
  }
  if (!shouldQuery) { resetLoadingState(); setAbortController(null); return; }
  // Build permission+model context for tool execution
  let toolUseContext = getToolUseContext(allMessages, newMessages, abortController, model, specSessionTime, hasShellContext);
  recordTiming("query_context_loading_start");
  let [,, defaultSystemPrompt, userContext, systemContext] = await Promise.all([
    loadFileHistoryContext(appState, setAppState), // Changed files, git status
    undefined,
    buildSystemPrompt(tools, model, Array.from(appState.additionalWorkingDirectories.keys()), mcpClients),
    loadInputContext(),         // Config, language
    loadSystemContext()         // Platform, env
  ]);
  let mergedUserContext = {...userContext, ...extractMCPResourceContext(mcpClients)};
  recordTiming("query_context_loading_end");
  // Compose final system prompt
  let finalSystemPrompt = buildFinalSystemPrompt({
    mainThreadAgentDefinition: agentDefinition,
    toolUseContext: toolUseContext,
    customSystemPrompt: customSystemPrompt,
    defaultSystemPrompt: defaultSystemPrompt,
    appendSystemPrompt: appendSystemPromptFn
  });
  recordTiming("query_query_start");
  // Core agent loop - each yielded event is processed immediately
  for await (let event of mainAgentLoop({
    messages: allMessages, systemPrompt: finalSystemPrompt,
    userContext: mergedUserContext, systemContext: systemContext,
    canUseTool: canUseToolFn, toolUseContext: toolUseContext, querySource: getQuerySource()
  })) {
    handleStreamedEvent(event);   // ← every event triggers a potential re-render
  }
  recordTiming("query_end");
  resetLoadingState();
  printProfilingReport();
  onTurnComplete?.();
}, [mcpClients, resetLoadingState, getToolUseContext, ...])

// Mapping: oc→handleQuery, ZR→mainAgentLoop, T11→handleStreamedEvent,
//   dZ→buildSystemPrompt, ot→buildFinalSystemPrompt, J0→getToolUseContext
```

**Key insight:** The `for await` loop over `ZR` (mainAgentLoop) is intentionally synchronous-per-event. Each event is fully processed by `handleStreamedEvent` before the next event is pulled from the generator. This ensures React state updates happen in strict event-arrival order, preventing out-of-order rendering.

---

## Stage 3: Stream Events → React State

### handleStreamedEvent - Stream event dispatcher

**What it does:** The `useCallback`-wrapped bridge between the agent loop's yielded events and React state setters. Each event from the loop passes through this function.

```javascript
// ============================================
// handleStreamedEvent - Dispatches agent loop events to React state
// Location: chunks.188.mjs:542-549
// ============================================

// ORIGINAL (for source lookup):
T11 = dA.useCallback((k6) => {
  iW1(k6, (q8) => {
    if (cR(q8)) X6(() => [q8]);
    else X6((FA) => [...FA, q8])
  }, (q8) => p2((FA) => FA + q8.length), tK, xq, (q8) => {
    X6((FA) => FA.filter((Yq) => Yq !== q8)), rmA(q8.uuid)
  }, R4)
}, [X6, p2, tK, xq, R4])

// READABLE (for understanding):
const handleStreamedEvent = useCallback((event) => {
  processStreamEvent(
    event,
    // onMessageUpdate: add message OR replace entire conversation
    (message) => {
      if (isConversationReset(message)) setMessages(() => [message]);
      else setMessages(existing => [...existing, message]);
    },
    // onStreamingChunk: token counter (for status bar display)
    (chunk) => updateTokenCounter(count => count + chunk.length),
    // setStreamMode: update "requesting"|"thinking"|"responding"|"tool-input"|"tool-use"
    setStreamMode,
    // setStreamingToolUses: update in-progress tool input previews
    setStreamingToolUses,
    // onRemoveMessage: remove a tombstoned/failed message
    (message) => {
      setMessages(existing => existing.filter(m => m !== message));
      removeFromMessageCache(message.uuid);
    },
    // onThinkingUpdate: update thinking block state (streaming vs. complete)
    setThinkingState
  );
}, [setMessages, updateTokenCounter, setStreamMode, setStreamingToolUses, setThinkingState])

// Mapping: T11→handleStreamedEvent, k6→event, iW1→processStreamEvent,
//   X6→setMessages, p2→updateTokenCounter, tK→setStreamMode, xq→setStreamingToolUses,
//   R4→setThinkingState, cR→isConversationReset, rmA→removeFromMessageCache
```

### processStreamEvent - Event routing to state

**What it does:** The core routing function that maps each event type from the agent loop to specific React state mutations. Handles two classes of events: complete messages (added to `messages` array) and raw stream events (update transient UI state).

**How it works:**

The function operates on a two-tier event system:

**Tier 1: Complete events** (add to messages state, trigger full re-render)
- `type: "assistant"` — A complete LLM message (text, thinking, or tool_use block). Added to `messages` via `onMessageUpdate`.
- `type: "user"` — Tool result or user-injected message.
- `type: "tombstone"` — A message that was retracted (e.g., failed tool use). Removed via `onRemoveMessage`.
- `type: "tool_use_summary"` — Ignored (used only by transcript replay).

**Tier 2: Stream events** (update transient state, no message added)
- `type: "stream_request_start"` → `setStreamMode("requesting")`
- `type: "stream_event"` wrapping `content_block_start`:
  - `text` block → `setStreamMode("responding")`
  - `thinking`/`redacted_thinking` → `setStreamMode("thinking")`
  - `tool_use` → `setStreamMode("tool-input")`, create streaming tool use entry
- `type: "stream_event"` wrapping `content_block_delta`:
  - `text_delta` → `onStreamingChunk(text)` (token counter)
  - `input_json_delta` → append to `streamingToolUses[index].unparsedToolInput`
  - `thinking_delta` → `onStreamingChunk(thinking)`
- `type: "stream_event"` wrapping `message_stop` → `setStreamMode("tool-use")`, clear `streamingToolUses`

```javascript
// ============================================
// processStreamEvent - Routes stream events to React state
// Location: chunks.173.mjs:390-488
// ============================================

// ORIGINAL (for source lookup):
function iW1(A, q, K, Y, z, w, H) {
  if (A.type !== "stream_event" && A.type !== "stream_request_start") {
    if (A.type === "tombstone") { w?.(A.message); return }
    if (A.type === "tool_use_summary") return;
    if (A.type === "assistant") {
      let $ = A.message.content.find((O) => O.type === "thinking");
      if ($ && $.type === "thinking") H?.(() => ({thinking: $.thinking, isStreaming: !1, streamingEndedAt: Date.now()}))
    }
    q(A); return
  }
  if (A.type === "stream_request_start") { Y("requesting"); return }
  if (A.event.type === "message_stop") { Y("tool-use"), z(() => []); return }
  switch (A.event.type) {
    case "content_block_start":
      switch (A.event.content_block.type) {
        case "thinking": case "redacted_thinking": Y("thinking"); return;
        case "text": Y("responding"); return;
        case "tool_use": {
          Y("tool-input");
          let $ = A.event.content_block, O = A.event.index;
          z((_) => [..._, {index: O, contentBlock: $, unparsedToolInput: ""}]); return
        }
      } break;
    case "content_block_delta":
      switch (A.event.delta.type) {
        case "text_delta": K(A.event.delta.text); return;
        case "input_json_delta": {
          let $ = A.event.delta.partial_json, O = A.event.index;
          K($), z((_) => {
            let J = _.find((X) => X.index === O);
            if (!J) return _;
            return [..._.filter((X) => X !== J), {...J, unparsedToolInput: J.unparsedToolInput + $}]
          }); return
        }
        case "thinking_delta": K(A.event.delta.thinking); return;
        case "signature_delta": K(A.event.delta.signature); return;
      }
    case "content_block_stop": return;
    case "message_delta": Y("responding"); return;
  }
}

// READABLE (for understanding):
function processStreamEvent(event, onMessageUpdate, onStreamingChunk, setStreamMode, setStreamingToolUses, onRemoveMessage, onThinkingUpdate) {
  // --- Tier 1: Complete messages (add to messages array) ---
  if (event.type !== "stream_event" && event.type !== "stream_request_start") {
    if (event.type === "tombstone") { onRemoveMessage?.(event.message); return; }
    if (event.type === "tool_use_summary") return;  // Ignored
    if (event.type === "assistant") {
      // Extract thinking block for dedicated thinking display
      let thinkingBlock = event.message.content.find(b => b.type === "thinking");
      if (thinkingBlock) onThinkingUpdate?.(() => ({
        thinking: thinkingBlock.thinking, isStreaming: false, streamingEndedAt: Date.now()
      }));
    }
    onMessageUpdate(event);  // ← TRIGGERS REACT RE-RENDER
    return;
  }
  // --- Tier 2: Transient stream events (update UI state only) ---
  if (event.type === "stream_request_start") { setStreamMode("requesting"); return; }
  if (event.event.type === "message_stop") { setStreamMode("tool-use"); setStreamingToolUses(() => []); return; }
  switch (event.event.type) {
    case "content_block_start":
      switch (event.event.content_block.type) {
        case "thinking": case "redacted_thinking": setStreamMode("thinking"); return;
        case "text": setStreamMode("responding"); return;
        case "tool_use":
          setStreamMode("tool-input");
          setStreamingToolUses(existing => [...existing, {
            index: event.event.index, contentBlock: event.event.content_block, unparsedToolInput: ""
          }]); return;
      } break;
    case "content_block_delta":
      switch (event.event.delta.type) {
        case "text_delta": onStreamingChunk(event.event.delta.text); return;
        case "input_json_delta":
          onStreamingChunk(event.event.delta.partial_json);
          setStreamingToolUses(existing => {
            let block = existing.find(t => t.index === event.event.index);
            if (!block) return existing;
            return [...existing.filter(t => t !== block), {...block, unparsedToolInput: block.unparsedToolInput + event.event.delta.partial_json}];
          }); return;
        case "thinking_delta": onStreamingChunk(event.event.delta.thinking); return;
        case "signature_delta": onStreamingChunk(event.event.delta.signature); return;
      }
    case "content_block_stop": return;  // *** NO ACTION: complete message arrives separately ***
    case "message_delta": setStreamMode("responding"); return;
  }
}

// Mapping: A→event, q→onMessageUpdate, K→onStreamingChunk, Y→setStreamMode,
//   z→setStreamingToolUses, w→onRemoveMessage, H→onThinkingUpdate
```

**Why `content_block_stop` does NOT trigger a re-render:**

This is the most important subtlety in the pipeline. When a content block finishes, `processStreamEvent` returns early on `content_block_stop` — it does NOT call `onMessageUpdate`. The actual re-render happens when `llmRequestGenerator` (lOq) yields the complete assistant message object immediately after the `content_block_stop` event. That complete message arrives as a Tier 1 `"assistant"` event and triggers `onMessageUpdate → setMessages() → React re-render`.

The sequence per content block:
```
lOq yields: { type: "stream_event", event: { type: "content_block_stop", index: 0 } }
  → processStreamEvent: no-op (returns early)

lOq yields: { type: "assistant", message: { content: [completedBlock] }, uuid: "...", ... }
  → processStreamEvent: onMessageUpdate({ type: "assistant", ... })
    → setMessages(existing => [...existing, assistantMsg])
      → React reconciles → component re-renders with new message
```

**Key insight:** The "stream" from the UI's perspective is really a sequence of complete discrete messages. Text streaming appears smooth because each text block is a separate complete message (yielded on `content_block_stop`), and React's fast reconciliation makes them appear to stream in.

---

## Stage 4: Stream State Machine

The `streamMode` state variable (O7) drives which loading indicator is shown in the status bar and header:

| State | Trigger | UI Effect |
|-------|---------|-----------|
| `"requesting"` | `stream_request_start` | Shows "..." waiting indicator |
| `"thinking"` | `content_block_start` (thinking) | Shows thinking animation |
| `"responding"` | `content_block_start` (text) or `message_delta` | Shows response streaming |
| `"tool-input"` | `content_block_start` (tool_use) | Shows "Building tool input..." |
| `"tool-use"` | `message_stop` | Shows "Executing tool..." |
| `null` | Initial / after query ends | No indicator |

The `streamingToolUses` state array drives the "live tool input" preview shown while the model is generating tool parameters. Each entry is:
```typescript
{
  index: number,            // SSE block index
  contentBlock: ToolUseBlock, // Block metadata (tool name, tool use id)
  unparsedToolInput: string  // Raw JSON string accumulating input_json_delta events
}
```

When `message_stop` arrives, `streamingToolUses` is cleared because the tool has received its complete input and is about to execute.

---

## Stage 5: UI Rendering Components

### SessionLogRenderer (KYq)

**What it does:** The top-level component that displays the conversation transcript in the REPL. Receives `messages` as a prop and renders all messages in order.

**How it reacts to streaming:**

The component uses React's memo cache pattern. Line checking `memoCache[20] !== finalLog.messages` ensures the `MessageTranscript` element is only recreated when the `messages` array reference changes (which happens every time `setMessages` is called).

```javascript
// ============================================
// SessionLogRenderer - Transcript display component
// Location: chunks.161.mjs:917-1016
// ============================================

// ORIGINAL (for source lookup):
function KYq(A) {
  let q = e(34), {log: K, onExit: Y, onSelect: z} = A, [w, H] = fP.default.useState(null)
  // ... setup code ...
  let S;
  if (q[19] !== j || q[20] !== X.messages)
    S = fP.default.createElement(g91, {
      messages: X.messages,              // ← Watched for changes
      normalizedMessageHistory: N,
      tools: P, commands: T, verbose: !0,
      toolJSX: null, toolUseConfirmQueue: k, inProgressToolUseIDs: y,
      isMessageSelectorVisible: !1, conversationId: j,
      screen: "transcript", screenToggleId: 1,
      streamingToolUses: B, showAllInTranscript: !0, isLoading: !1
    }), q[19] = j, q[20] = X.messages, q[21] = S;
  else S = q[21];
  // ...
}

// READABLE (for understanding):
function SessionLogRenderer({ log, onExit, onSelect }) {
  // ... setup, effect to parse remote logs ...
  let finalLog = parsedLog ?? log;
  let conversationId = getConversationId(finalLog) || "";
  // Re-create MessageTranscript only when messages or conversationId changes
  let messageTranscript;
  if (memoCache[19] !== conversationId || memoCache[20] !== finalLog.messages) {
    messageTranscript = React.createElement(MessageTranscript, {
      messages: finalLog.messages,       // ← New array reference triggers rebuild
      normalizedMessageHistory: normalizedHistory,
      tools: tools, verbose: true,
      streamingToolUses: streamingToolUses,  // ← In-progress tool input state
      isLoading: false
    });
    memoCache[19] = conversationId;
    memoCache[20] = finalLog.messages;
    memoCache[21] = messageTranscript;
  } else {
    messageTranscript = memoCache[21];
  }
  return React.createElement(..., messageTranscript);
}

// Mapping: KYq→SessionLogRenderer, K→log, g91→MessageTranscript,
//   X.messages→finalLog.messages, B→streamingToolUses
```

### AssistantMessageRenderer (Yd1)

**What it does:** Renders a single assistant message text with optional bold/dim styling and subtitle. Used for status messages, compact summaries, and other assistant-generated text.

```javascript
// ============================================
// AssistantMessageRenderer - Single message text display
// Location: chunks.161.mjs:874-906
// ============================================

// ORIGINAL (for source lookup):
function Yd1(A) {
  let q = e(10), {message: K, bold: Y, dimColor: z, subtitle: w} = A,
    H = Y === void 0 ? !1 : Y, $ = z === void 0 ? !1 : z, O;
  if (q[0] === Symbol.for("react.memo_cache_sentinel")) O = mZ1.default.createElement(c4, null), q[0] = O;
  else O = q[0];
  let _;
  if (q[1] !== H || q[2] !== $ || q[3] !== K)
    _ = mZ1.default.createElement(I, {flexDirection: "row"}, O, mZ1.default.createElement(V, {bold: H, dimColor: $}, " ", K)),
    q[1] = H, q[2] = $, q[3] = K, q[4] = _;
  else _ = q[4];
  // ... subtitle and final container ...
  return X
}

// READABLE (for understanding):
function AssistantMessageRenderer({ message, bold = false, dimColor = false, subtitle }) {
  let memoCache = useMemoCache(10);
  // Icon (rendered once and cached permanently)
  let icon = memoCache[0] === CACHE_SENTINEL
    ? (memoCache[0] = React.createElement(AssistantIcon, null))
    : memoCache[0];
  // Message row (re-created if bold, dimColor, or message text changes)
  let messageRow = (memoCache[1] !== bold || memoCache[2] !== dimColor || memoCache[3] !== message)
    ? (memoCache[1]=bold, memoCache[2]=dimColor, memoCache[3]=message,
       memoCache[4] = React.createElement(Box, {flexDirection:"row"}, icon,
         React.createElement(Text, {bold, dimColor}, " ", message)))
    : memoCache[4];
  // Optional subtitle
  let subtitleEl = memoCache[5] !== subtitle
    ? (memoCache[5]=subtitle, memoCache[6] = subtitle && React.createElement(Text, {dimColor:true}, subtitle))
    : memoCache[6];
  // Combine and return
  return (memoCache[7] !== messageRow || memoCache[8] !== subtitleEl)
    ? (memoCache[7]=messageRow, memoCache[8]=subtitleEl,
       memoCache[9] = React.createElement(Box, {flexDirection:"column"}, messageRow, subtitleEl))
    : memoCache[9];
}

// Mapping: Yd1→AssistantMessageRenderer, K→message, Y→bold, z→dimColor, w→subtitle,
//   c4→AssistantIcon, I→Box, V→Text
```

### BashOutputRenderer (BYq)

**What it does:** Shows shell execution output in a detail panel. Uses polling to refresh content while a shell is still running.

**How it connects to streaming:**
1. Shell execution results are stored to disk via `ZK1` (writeOutputChunk) by the BashTool.
2. When the complete tool result message arrives in `messages` state, the shell's status changes from `"running"` to `"completed"`.
3. BashOutputRenderer subscribes to `shell.id` and `shell.status` in its `useEffect` dependencies.
4. When status changes to `"completed"`, it reads the final output from disk via `M_6` (readFullOutput) and renders it.
5. While status is `"running"`, it polls on a 1-second timer by updating the `refreshTrigger` state.

```javascript
// ============================================
// BashOutputRenderer - Shell output detail panel
// Location: chunks.162.mjs:3-150
// ============================================

// ORIGINAL (for source lookup):
function BYq(A) {
  // ... state setup ...
  let f;
  if (q[11] !== K.id || q[12] !== K.status)
    f = () => {
      let s = M_6(K.id), {totalLines: O1, truncatedContent: T1} = HZ6(s);
      if (X({stdout: T1, stdoutLines: O1}), K.status === "running") {
        let N1 = setTimeout(() => {O(J7z)}, 1000);
        return () => clearTimeout(N1)
      }
    }, q[11] = K.id, q[12] = K.status, q[13] = f;
  else f = q[13];
  wd1.useEffect(f, [K.id, K.status, $]);
  // ... render last 10 lines of output ...
}

// READABLE (for understanding):
function BashOutputRenderer({ shell, onDone, onKillShell, onBack }) {
  let [outputState, setOutputState] = useState({stdout: "", stdoutLines: 0});
  let [refreshTrigger, setRefreshTrigger] = useState(0);
  let updateEffect;
  if (memoCache[11] !== shell.id || memoCache[12] !== shell.status) {
    updateEffect = () => {
      // Read current output from disk
      let rawOutput = readFullOutput(shell.id);
      let { totalLines, truncatedContent } = truncateAndCount(rawOutput);
      setOutputState({ stdout: truncatedContent, stdoutLines: totalLines });
      // Set up polling if still running
      if (shell.status === "running") {
        let timerId = setTimeout(() => setRefreshTrigger(REFRESH_INTERVAL), 1000);
        return () => clearTimeout(timerId);  // Cleanup on unmount/status change
      }
    };
    memoCache[11] = shell.id;
    memoCache[12] = shell.status;
    memoCache[13] = updateEffect;
  }
  useEffect(updateEffect, [shell.id, shell.status, refreshTrigger]);
  // Render last 10 lines in a bordered box
  return React.createElement(Modal, {title: "Shell details"},
    outputState.stdout
      ? React.createElement(Box, {borderStyle:"round", height: 12},
          outputState.stdout.split("\n").slice(-10).map(renderLine),
          React.createElement(Text, {dimColor:true, italic:true},
            outputState.stdoutLines > 10
              ? `Showing last 10 lines of ${outputState.stdoutLines} total`
              : `Showing ${outputState.stdoutLines} lines`
          )
        )
      : React.createElement(Text, {dimColor:true}, "No output available")
  );
}

// Mapping: BYq→BashOutputRenderer, K→shell, M_6→readFullOutput, HZ6→truncateAndCount,
//   X→setOutputState, O→setRefreshTrigger, J7z→REFRESH_INTERVAL
```

---

## Complete Event Sequence (Example: Text Response)

```
User types: "what is 2+2?"
           │
           ▼
onSubmit (Z$) → onQuery (ff)
  setMessages([...existing, userMessage])     ← React re-renders with user message
  setIsLoading(true)
  handleQuery (oc):
    buildSystemPrompt (dZ) [parallel with other context loading]
    for await event of mainAgentLoop (ZR):
    │
    │  EVENT 1: { type: "stream_request_start" }
    │  → setStreamMode("requesting")
    │  ← Status bar shows "..."
    │
    │  EVENT 2: { type: "stream_event", event: { type: "message_start", message: {...} } }
    │  → no UI action (initializes usage tracking in lOq)
    │
    │  EVENT 3: { type: "stream_event", event: { type: "content_block_start", content_block: {type:"text"} } }
    │  → setStreamMode("responding")
    │  ← Status bar shows "responding"
    │
    │  EVENT 4: { type: "stream_event", event: { type: "content_block_delta", delta: {type:"text_delta", text:"2"} } }
    │  → onStreamingChunk("2")  [token counter +1]
    │  ← Token count display updates
    │
    │  EVENT 5: { type: "stream_event", event: { type: "content_block_delta", delta: {type:"text_delta", text:"+2"} } }
    │  → onStreamingChunk("+2")  [token counter +2]
    │
    │  EVENT 6: { type: "stream_event", event: { type: "content_block_stop", index: 0 } }
    │  → no-op (complete message comes next)
    │
    │  EVENT 7: { type: "assistant", message: {content:[{type:"text",text:"2+2=4"}]}, uuid:"abc", ... }
    │  → setMessages(existing => [...existing, event])
    │  ← React re-renders: "2+2=4" appears in conversation
    │
    │  EVENT 8: { type: "stream_event", event: { type: "message_delta", delta: {stop_reason:"end_turn"} } }
    │  → setStreamMode("responding")  [no real change]
    │
    │  EVENT 9: { type: "stream_event", event: { type: "message_stop" } }
    │  → setStreamMode("tool-use")
    │  → setStreamingToolUses(() => [])  [no tool uses to clear]
    │
    └── for await loop ends
        resetLoadingState()
        setIsLoading(false)
        setStreamMode(null)
        ← Status bar clears, input box re-enables
```

---

## Architecture Trade-offs

### React Memo Cache Pattern

All Ink components use a custom `useMemoCache` (built into the React compiler output) instead of standard `useMemo`. This pattern:

- **Why**: The React compiler statically analyzes components and emits explicit cache slots. This avoids `useMemo`'s overhead of creating a dependency array and closure every render.
- **How it works**: Each memoized value is stored in a slot of the `e(N)` array (the cache), initialized to `Symbol.for("react.memo_cache_sentinel")`. On subsequent renders, the cached value is used if all dependencies are the same object references.
- **Trade-off**: More verbose but zero allocation cost per render hit (cache slot read is O(1)). This is critical in a terminal app where every keystroke can cause dozens of re-renders.

### Streaming Architecture: Discrete Messages vs. True Streaming

The system uses **discrete complete messages** rather than mutable streaming state. Each `content_block_stop` triggers a new message being appended to the `messages` array. This means:

- **Pro**: Simple React reconciliation — new items in an array, no mutation.
- **Pro**: Each message has a stable `uuid`, enabling efficient key-based list rendering.
- **Con**: For a long text response, there are N re-renders (one per content block), not truly continuous streaming.
- **Con**: If a user scrolls to read an earlier message, new messages appending to the array may cause scroll position drift.

### Concurrent Query Prevention

The `isQueryInProgress` `useRef` (not `useState`) is the critical concurrency guard. `useRef` values are synchronous and don't trigger re-renders when mutated, making them ideal for guards that need to be checked immediately within event handlers.

### Tombstone Mechanism

Messages can be removed mid-display via the `"tombstone"` event type. This handles scenarios where:
- A tool use failed and its result message needs to be retracted
- Compact replaced the conversation history with a summary
- An agent timeout caused a partial response to be withdrawn

The `onRemoveMessage` callback both removes from `messages` state and calls `rmA` (removeFromMessageCache) to clean up any cached rendering data.
