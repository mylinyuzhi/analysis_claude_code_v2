# Tool UI Interaction Complete Analysis (Claude Code 2.1.76)

> Complete source-level analysis of tool UI rendering, modal priority, and user interaction flows.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Tools section)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `renderToolUseMessage` - Per-tool rendering method
- `renderToolResultMessage` - Result rendering method
- `ra6()` - Modal priority determination - chunks.196.mjs:387-404
- `HIq` - Tool permission modal component - chunks.196.mjs:1388

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                    TOOL UI RENDERING PIPELINE                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ① Tool Use Block (from LLM)                                        │
│     └─ {type: "tool_use", name: "Read", input: {...}}              │
│                                                                       │
│  ② Tool Lookup & Validation                                         │
│     ├─ findTool (dK) - chunks.56.mjs:1592                           │
│     └─ Session tool set validation                                   │
│                                                                       │
│  ③ Permission Check                                                  │
│     ├─ canUseTool function                                           │
│     ├─ Hook override check                                           │
│     └─ User prompt if needed                                         │
│                                                                       │
│  ④ In-Progress Rendering                                            │
│     ├─ tool.renderToolUseMessage(input, options)                    │
│     ├─ Header with tool name and icon                               │
│     └─ Input summary/preview                                         │
│                                                                       │
│  ⑤ Tool Execution                                                    │
│     ├─ tool.call(input, context)                                    │
│     └─ Progress callbacks                                            │
│                                                                       │
│  ⑥ Result Rendering                                                  │
│     ├─ tool.renderToolResultMessage(result, input, options)         │
│     ├─ Success: formatted output                                    │
│     └─ Error: error message with context                            │
│                                                                       │
│  ⑦ Message Assembly                                                  │
│     └─ createUserMessage (p1) - chunks.173.mjs:1378                 │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Modal Priority System

### Priority Determination Function

**What it does:**
Determines which modal dialog should be displayed based on current UI state. This ensures only one modal is shown at a time, with higher priority modals blocking lower ones.

**Why this approach:**
- Single modal focus prevents user confusion
- Clear priority order ensures critical actions (permissions) take precedence
- Animation control via `shouldContinueAnimation` flag allows non-blocking tool use display

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
    // Early exit conditions
    if (isCostThresholdAcknowledged || hasUnresolvedAuth) return undefined;

    // Priority 1: Message selector (highest - user is actively selecting)
    if (isMessageSelectorOpen) return "message-selector";

    // Priority 2: Check if streaming is active
    if (isStreamingActive) return undefined;

    // Priority 3: Sandbox permission (security-critical)
    if (pendingSandboxRequest[0]) return "sandbox-permission";

    // Animation control flag - allows non-blocking display
    const shouldShowAnimatedModal = !currentToolJSX || currentToolJSX.shouldContinueAnimation;

    // Priority 4: Tool permission (user action required)
    if (shouldShowAnimatedModal && toolPermissionQueue[0]) return "tool-permission";

    // Priority 5: Prompt dialog (clarification needed)
    if (shouldShowAnimatedModal && promptQueue[0]) return "prompt";

    // Priority 6: Worker sandbox permission (background agent security)
    if (shouldShowAnimatedModal && workerSandboxQueue[0]) return "worker-sandbox-permission";

    // Priority 7: Elicitation (MCP server input request)
    if (shouldShowAnimatedModal && elicitation.queue[0]) return "elicitation";

    // Priority 8: Cost threshold warning
    if (shouldShowAnimatedModal && isCostThresholdReached) return "cost";

    // Priority 9: IDE onboarding
    if (shouldShowAnimatedModal && showIdeOnboarding) return "ide-onboarding";

    // Priority 10: Effort callout
    if (shouldShowAnimatedModal && showEffortCallout) return "effort-callout";

    // Priority 11: Remote session callout
    if (shouldShowAnimatedModal && showRemoteCallout) return "remote-callout";

    // Priority 12: LSP recommendation
    if (shouldShowAnimatedModal && lspRecommendation) return "lsp-recommendation";

    // Priority 13: Desktop upsell (lowest)
    if (shouldShowAnimatedModal && showDesktopUpsell) return "desktop-upsell";

    return undefined;
}

// Mapping: ra6→determineActiveModal, lV6→isCostThresholdAcknowledged, na6→hasUnresolvedAuth,
//          W7→isMessageSelectorOpen, y2→isStreamingActive, G7→pendingSandboxRequest,
//          a8→toolPermissionQueue, zA→promptQueue, n.queue→workerSandboxQueue,
//          o.queue→elicitation.queue, m26→isCostThresholdReached, W6→showIdeOnboarding,
//          g6→showEffortCallout, J1→showRemoteCallout, e8→lspRecommendation, E1→showDesktopUpsell
```

### Modal Priority Table

| Priority | Modal Type | Trigger Condition | User Action |
|----------|------------|-------------------|-------------|
| 1 | `message-selector` | User opened message selector | Select/cancel |
| 2 | `sandbox-permission` | Network sandbox request pending | Allow/deny |
| 3 | `tool-permission` | Tool needs user approval | Allow/deny/always |
| 4 | `prompt` | AskUserQuestion/Prompt queue | Answer/cancel |
| 5 | `worker-sandbox-permission` | Background agent sandbox | Allow/deny |
| 6 | `elicitation` | MCP server requests input | Form/URL response |
| 7 | `cost` | Cost threshold reached | Acknowledge |
| 8 | `ide-onboarding` | IDE setup prompt | Install/skip |
| 9 | `effort-callout` | Effort level notification | Acknowledge |
| 10 | `remote-callout` | Remote session info | Acknowledge |
| 11 | `lsp-recommendation` | LSP setup suggestion | Install/skip |
| 12 | `desktop-upsell` | Desktop app promotion | Install/dismiss |

---

## Tool Use Message Rendering

### Rendering Interface

Each tool defines `renderToolUseMessage` and `renderToolResultMessage` methods:

```typescript
interface ToolRenderer {
  // Called when tool starts executing
  renderToolUseMessage(
    input: ToolInput,
    options: {
      verbose: boolean;
      toolUseContext: ToolUseContext;
      toolUseId: string;
    }
  ): React.ReactElement | string;

  // Called when tool completes
  renderToolResultMessage(
    result: ToolResult,
    input: ToolInput,
    options: {
      verbose: boolean;
      isFocused: boolean;
    }
  ): React.ReactElement | string;
}
```

### Bash Tool Rendering Example

```javascript
// ============================================
// Bash Tool renderToolUseMessage - chunks.172.mjs:156
// ============================================

// ORIGINAL (for source lookup):
Xl4 = (A, q) => {
    let {
        command: K,
        description: Y
    } = A, z = Y || K;
    return b8.createElement(N6, {
        input: A,
        options: q
    }, b8.createElement(wS, null, b8.createElement(dE, {
        scheme: "blue"
    }, "Bash")), b8.createElement(KS, null, b8.createElement("span", {
        className: s8.bold
    }, z)), Y && b8.createElement(U6, null, Y))
}

// READABLE (for understanding):
function renderBashToolUseMessage(input, options) {
  const { command, description } = input;
  const displayText = description || command;

  return (
    <ToolUseContainer input={input} options={options}>
      <ToolIcon>
        <Icon scheme="blue">⚡</Icon>
      </ToolIcon>
      <ToolTitle>
        <span className="bold">{displayText}</span>
      </ToolTitle>
      {description && (
        <ToolDescription>{description}</ToolDescription>
      )}
    </ToolUseContainer>
  );
}

// Mapping: Xl4→renderBashToolUseMessage, N6→ToolUseContainer, wS→ToolIcon,
//          dE→Icon, KS→ToolTitle, U6→ToolDescription, s8.bold→CSS.bold
```

### Read Tool Rendering Example

```javascript
// ============================================
// Read Tool renderToolUseMessage - chunks.90.mjs:2117
// ============================================

// ORIGINAL (for source lookup):
Y94 = (A, q) => {
    let K = A.file_path;
    return b8.createElement(L9, {
        input: A,
        options: q,
        icon: b8.createElement(wS, null, b8.createElement(dE, {
            scheme: "blue"
        }, "Read")),
        title: K,
        shouldResolvePath: !0
    })
}

// READABLE (for understanding):
function renderReadToolUseMessage(input, options) {
  const filePath = input.file_path;

  return (
    <FileToolContainer
      input={input}
      options={options}
      icon={<ToolIcon><Icon scheme="blue">📄</Icon></ToolIcon>}
      title={filePath}
      shouldResolvePath={true}
    />
  );
}

// Mapping: Y94→renderReadToolUseMessage, L9→FileToolContainer, wS→ToolIcon, dE→Icon
```

---

## Tool Result Rendering

### Success Result Pattern

```javascript
// ============================================
// Generic success result rendering
// Location: chunks.139.mjs (Glob tool example)
// ============================================

// ORIGINAL (for source lookup):
da4 = (A, q, K) => {
    let Y = A.output;
    return b8.createElement(YA, {
        result: A,
        isFocused: K?.isFocused
    }, Y)
}

// READABLE (for understanding):
function renderGlobToolResultMessage(result, input, options) {
  const output = result.output;

  return (
    <ToolResultContainer result={result} isFocused={options?.isFocused}>
      {output}
    </ToolResultContainer>
  );
}

// Mapping: da4→renderGlobToolResultMessage, YA→ToolResultContainer
```

### Error Result Pattern

```javascript
// ============================================
// Error result rendering - chunks.146.mjs
// ============================================

// READABLE (for understanding):
function renderToolError(toolName, error, toolUseId) {
  return (
    <ToolResultContainer isError={true}>
      <ErrorHeader>
        <Icon scheme="red">⚠️</Icon>
        <span>Error in {toolName}</span>
      </ErrorHeader>
      <ErrorDetails>{error.message}</ErrorDetails>
      <ToolUseId>Tool use ID: {toolUseId}</ToolUseId>
    </ToolResultContainer>
  );
}
```

---

## Tool Permission Modal

### Permission Modal Component

```javascript
// ============================================
// HIq - Tool Permission Modal
// Location: chunks.196.mjs:1388
// ============================================

// ORIGINAL (for source lookup):
Ys6 = K2 === "tool-permission" ? b8.createElement(HIq, {
    key: "tool-permission",
    toolUseConfirm: a8[0],
    toolUseContext: g,
    onDone: (z) => wW(!1, z),
    onReject: () => {
        a8[0]?.onAbort(), $A([])
    },
    verbose: B,
    workerBadge: X6?.badge
}) : null

// READABLE (for understanding):
const toolPermissionModal = activeModal === "tool-permission" ? (
  <ToolPermissionModal
    key="tool-permission"
    toolUseConfirm={toolPermissionQueue[0]}
    toolUseContext={sessionContext}
    onDone={(decision) => handlePermissionDecision(false, decision)}
    onReject={() => {
      toolPermissionQueue[0]?.onAbort();
      setToolPermissionQueue([]);
    }}
    verbose={isVerboseMode}
    workerBadge={workerRequest?.badge}
  />
) : null;

// Mapping: Ys6→toolPermissionModal, HIq→ToolPermissionModal, K2→activeModal,
//          a8→toolPermissionQueue, g→sessionContext, wW→handlePermissionDecision,
//          $A→setToolPermissionQueue, B→isVerboseMode, X6→workerRequest
```

### Permission Decision Flow

```
User sees permission modal
  │
  ├─→ "Yes, always" → Add to allowedTools, proceed
  │     └─ Update toolPermissionContext
  │
  ├─→ "Yes, this time" → Proceed once, no persistence
  │     └─ Return allow decision
  │
  ├─→ "No, this time" → Block once
  │     └─ Return deny decision
  │
  └─→ "No, always" → Add to deniedTools
        └─ Update toolPermissionContext
```

---

## Streaming Tool Use Display

### In-Progress State Management

```javascript
// ============================================
// Streaming tool use state - chunks.196.mjs
// ============================================

// State variables
const [streamingToolUses, setStreamingToolUses] = useState([]);
const [inProgressToolUseIDs, setInProgressToolUseIDs] = useState(new Set());

// During execution
if (q[27] !== cachedToolName ||
    q[28] !== currentInput ||
    q[29] !== currentTool) {
  toolElement = currentTool.renderToolUseMessage(currentInput, {
    verbose: verbose,
    toolUseContext: toolUseContext,
    toolUseId: toolUseId
  });
  // Cache for re-render optimization
  q[27] = cachedToolName;
  q[28] = currentInput;
  q[29] = currentTool;
}

// Mapping: q→renderCache, streamingToolUses→streamingTools
```

### Animation Control

```javascript
// ============================================
// Animation control for non-blocking display
// ============================================

const currentToolJSX = /* from state */;
const shouldContinueAnimation =
  !currentToolJSX || currentToolJSX.shouldContinueAnimation;

// When shouldContinueAnimation is false:
// - Tool use message still displays
// - But modal priority check skips it
// - Allows user to see progress without blocking
```

---

## Cross-Module Integration

### Tools ↔ System Reminder (04)

Tool execution generates attachments that become system reminders:

| Tool Event | Attachment Type | Reminder Purpose |
|------------|-----------------|------------------|
| Progress update | `progress` | Show operation status |
| Hook context | `hook_additional_context` | Pre-hook modifications |
| Hook denial | `hook_blocking_error` | Hook rejection reason |
| Task status | `task_status` | Background task changes |

### Tools ↔ UI (02)

- Tool messages are React components
- Modal priority managed in REPL component
- State synchronized via Zustand store

### Tools ↔ MCP (06)

- MCP tools use same rendering interface
- `mcp__` prefix handled in tool name display
- Elicitation has separate modal type (priority 6)

---

## UI Component Hierarchy

```
REPL (chunks.196.mjs)
├── MessageList
│   ├── UserMessage
│   ├── AssistantMessage
│   │   ├── TextContent
│   │   └── ToolUseBlock
│   │       ├── ToolUseHeader (in-progress)
│   │       └── ToolResultMessage (completed)
│   └── SystemMessage
│
├── Modal Layer (priority-based)
│   ├── ToolPermissionModal (HIq)
│   ├── SandboxPermissionModal
│   ├── PromptModal
│   ├── ElicitationDialog
│   └── ... other modals
│
└── InputArea
    ├── TextInput
    ├── ImageAttachment
    └── SlashCommandSuggestions
```

---

## Key Insights

### Design Decisions

1. **Single Modal Focus**: Only one modal shown at a time prevents cognitive overload
2. **Animation Control**: `shouldContinueAnimation` allows non-blocking progress display
3. **Per-Tool Rendering**: Each tool defines its own UI for maximum flexibility
4. **Cache Optimization**: Render output cached to prevent unnecessary re-renders
5. **Verbose Mode**: Detailed output available via verbose flag

### Performance Considerations

- React.memo for tool components
- Deferred value for large tool results
- Cache invalidation on input change
- Streaming updates via progress callbacks

---

## Quick Reference

### Modal Priority (Highest to Lowest)

1. `message-selector`
2. `sandbox-permission`
3. `tool-permission`
4. `prompt`
5. `worker-sandbox-permission`
6. `elicitation`
7. `cost`
8. `ide-onboarding`
9. `effort-callout`
10. `remote-callout`
11. `lsp-recommendation`
12. `desktop-upsell`

### Key UI Symbols

| Obfuscated | Readable | Purpose |
|------------|----------|---------|
| HIq | ToolPermissionModal | Permission dialog |
| ra6 | determineActiveModal | Priority calculation |
| Xl4 | renderBashToolUseMessage | Bash tool UI |
| Y94 | renderReadToolUseMessage | Read tool UI |
| da4 | renderGlobToolResultMessage | Glob result UI |

---

## Version History

| Version | Changes |
|---------|---------|
| 2.1.76 | Added worker badge for background agents |
| 2.1.72 | Improved permission modal UX |
| 2.1.32 | Added elicitation modal type |
| 2.1.27 | Added remote session callout |