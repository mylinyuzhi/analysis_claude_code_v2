# UI Integration Summary

> Cross-module integration points between UI and other systems
>
> **Symbol Validation Status**: All symbols cross-validated against source code on 2026-03-22.

Key symbols in this document:
- `REPL` (`ot8`) - Main session orchestrator, chunks.196.mjs:3
- `getInputDialogType` (`ra6`) - Priority dispatcher, chunks.196.mjs:387-404
- `handleCancel` (`TM`) - Cancel handler, chunks.196.mjs:420-432
- `handleToolUseStream` (`xN6`) - Streaming event processor, chunks.173.mjs:2384
- `MessageList` (`veY`) - Message rendering, chunks.161.mjs:3
- `normalizeMessages` (`cM`) - Message normalization, chunks.173.mjs:1999 (CORRECTED: was WJ)
- `flattenMessages` (`JM`) - Message flattening, chunks.173.mjs:1516
- `filterEmptyMessages` (`Gi6`) - Empty message filter, chunks.173.mjs:1502
- `shouldShowMessageInChat` (`XV6`) - Visibility filter, chunks.185.mjs:1692
- `wrapWithSystemReminderTags` (`b5`) - XML wrapper, chunks.173.mjs:2496
- `createSystemReminderTag` (`af`) - Tag creator, chunks.173.mjs:2490

---

## Overview

This document summarizes the key integration points between the UI module and other Claude Code systems. Each integration point includes the data flow direction and the key symbols involved.

```
┌──────────────────────────────────────────────────────────────────────┐
│                    UI INTEGRATION POINTS                              │
│                                                                       │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐              │
│  │  05_tools   │◄──►│    02_ui    │◄──►│04_system_   │              │
│  │             │    │             │    │  reminder   │              │
│  │ Permission  │    │  Dialogs    │    │  isMeta     │              │
│  │ Dialogs     │    │  MessageList│    │  filtering  │              │
│  └─────────────┘    └─────────────┘    └─────────────┘              │
│         ▲                  │                  ▲                      │
│         │                  ▼                  │                      │
│  ┌──────┴──────┐    ┌─────────────┐    ┌──────┴──────┐              │
│  │  16_hooks   │    │  06_compact │    │   01_cli    │              │
│  │             │    │             │    │             │              │
│  │ Pre/Post    │    │ Boundary    │    │ Slash       │              │
│  │ grouping    │    │ display     │    │ commands    │              │
│  └─────────────┘    └─────────────┘    └─────────────┘              │
│                             │                                         │
│                             ▼                                         │
│                      ┌─────────────┐                                  │
│                      │   09_mcp    │                                  │
│                      │             │                                  │
│                      │ Elicitation │                                  │
│                      │   forms     │                                  │
│                      └─────────────┘                                  │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Tool-UI Integration

> Related: [05_tools/ui_rendering.md](../05_tools/ui_rendering.md)

### Permission Dialog Flow

```
Tool Execution Request
        │
        ▼
┌───────────────────┐
│ Permission Check  │
│ (toolPermission   │
│    Context)       │
└───────────────────┘
        │
        ├── Auto-approved ──► Execute tool
        │
        └── Requires approval
                │
                ▼
        ┌───────────────┐
        │ addToQueue    │
        │ (a8)          │
        └───────────────┘
                │
                ▼
        ┌───────────────┐
        │ f11() returns │
        │ "tool-permis- │
        │ sion"         │
        └───────────────┘
                │
                ▼
        ┌───────────────┐
        │ _Wq dialog    │
        │ rendered      │
        └───────────────┘
                │
        ┌───────┴───────┐
        ▼               ▼
    [Approve]       [Deny]
        │               │
        ▼               ▼
  Execute tool    Abort tool
  + dequeue       + clear queue
```

### Key Integration Points

| Integration Point | Direction | Description |
|-------------------|-----------|-------------|
| Permission queue | Tools → UI | toolUseConfirmQueue (managed by REPL state) |
| Dialog type | UI → UI | `getInputDialogType` (`ra6`) returns `"tool-permission"` |
| Permission dialog | UI renders | `ToolPermissionDialog` (`HIq`) |
| Abort handler | UI → Tools | Queue item's onAbort method |
| Recheck permissions | Tools → UI | Call recheckPermission on queue items |

### Code Reference

```javascript
// Tool permission queue registration (from agent loop):
// chunks.188.mjs:143
dA.useEffect(() => {
    return gb4(f8), () => Ub4()
}, [f8]);

// gb4 registers the setter for tool permission queue
// The agent loop calls this to push permission requests
```

### Tool Result Display

| Message Type | Display Component | Location |
|--------------|-------------------|----------|
| `tool_use` | ToolUseCard | chunks.161.mjs |
| `tool_result` | ToolResultCard | chunks.161.mjs |
| `grouped_tool_use` | GroupedToolCard | chunks.161.mjs |

### Spinner Interaction

```javascript
// Tool permissions hide the spinner:
PG = (!j8 || j8.showSpinner) && a8.length === 0 && ...

// a8.length > 0 means tool permission queued
// Spinner is hidden because user action is required
```

---

## Reminder-UI Integration

> Related: [04_system_reminder/ui_linkage.md](../04_system_reminder/ui_linkage.md)

### isMeta Filtering

```
System Reminder Message
        │
        ▼
┌───────────────────┐
│ Create user msg   │
│ with isMeta: true │
└───────────────────┘
        │
        ▼
┌───────────────────┐
│ MessageList       │
│ filter by         │
│ shouldShowMessage │
│ InChat()          │
└───────────────────┘
        │
        ▼
   isMeta === true?
        │
   ┌────┴────┐
   ▼         ▼
 [Hidden]  [Shown]
```

### Key Integration Points

| Integration Point | Direction | Description |
|-------------------|-----------|-------------|
| isMeta flag | Reminder → UI | `isMeta: true` on user message |
| Visibility filter | UI → UI | shouldShowMessageInChat filters isMeta messages |
| Attachment injection | Reminder → UI | `type: "attachment"` messages |
| Visibility tiers | Reminder → UI | `isVisibleInTranscriptOnly` |

### Code Reference

```javascript
// ============================================
// shouldShowMessageInChat (XV6) - Core visibility filter
// Location: chunks.185.mjs:1692-1702
// ============================================

// ORIGINAL (for source lookup):
function XV6(A) {
    if (A.type !== "user") return !1;
    if (Array.isArray(A.message.content) && A.message.content[0]?.type === "tool_result") return !1;
    if (Hz6(A)) return !1;
    if (A.isMeta) return !1;
    let q = A.message.content,
        K = typeof q === "string" ? null : q[q.length - 1],
        Y = typeof q === "string" ? q.trim() : K && Yhq(K) ? K.text.trim() : "";
    if (Y.indexOf(`<${WP}>`) !== -1 || Y.indexOf(`<${oA6}>`) !== -1 ||
        Y.indexOf(`<${rHA}>`) !== -1 || Y.indexOf(`<${oHA}>`) !== -1 ||
        Y.indexOf(`<${EH}>`) !== -1 || Y.indexOf(`<${vV}>`) !== -1 ||
        Y.indexOf(`<${fj}`) !== -1) return !1;
    return !0
}

// READABLE (for understanding):
function shouldShowMessageInChat(message) {
    // Phase 1: Type check - only process user messages
    if (message.type !== "user") return false;

    // Phase 2: Content type filter - hide tool_result messages
    if (Array.isArray(message.message.content) &&
        message.message.content[0]?.type === "tool_result") return false;

    // Phase 3: Special type detection
    if (isSpecialMessageType(message)) return false;

    // Phase 4: isMeta filter - CRITICAL for system reminders
    if (message.isMeta) return false;  // System reminders always hidden

    // Phase 5: XML tag detection - hide system-reminder tagged content
    let lastContent = extractLastTextContent(message.message.content);
    if (containsSystemXmlTags(lastContent)) return false;

    return true;
}

// Mapping: XV6→shouldShowMessageInChat, Hz6→isSpecialMessageType,
//          WP/oA6/rHA/oHA/EH/vV/fj→XML tag constants
```

### Attachment Message Flow

```javascript
// ============================================
// Attachment message normalization
// Location: chunks.173.mjs:191-199
// ============================================

// ORIGINAL (for source lookup):
case "attachment": {
    let X = K2z(J.attachment),
        D = gP(H);
    if (D?.type === "user") {
        H[H.indexOf(D)] = X.reduce((j, M) => lzz(j, M), D);
        return
    }
    H.push(...X);
    return
}

// READABLE (for understanding):
case "attachment": {
    // Convert attachment to user message content
    const convertedContent = normalizeAttachmentForAPI(message.attachment);
    const lastMessage = getLastMessage(normalizedMessages);

    if (lastMessage?.type === "user") {
        // Merge into preceding user message
        normalizedMessages[normalizedMessages.indexOf(lastMessage)] =
            convertedContent.reduce(mergeUserMessages, lastMessage);
        return;
    }
    // Otherwise push as new message(s)
    normalizedMessages.push(...convertedContent);
    return;
}

// Mapping: K2z→normalizeAttachmentForAPI, gP→getLastMessage,
//          lzz→mergeUserMessages, H→normalizedMessages
```

### System Reminder Tag Wrapping

```javascript
// ============================================
// wrapWithSystemReminderTags (b5) - XML tag wrapper
// Location: chunks.173.mjs:2496-2523
// ============================================

// ORIGINAL (for source lookup):
function b5(A) {
    return A.map((q) => {
        if (typeof q.message.content === "string") return {
            ...q,
            message: {
                ...q.message,
                content: af(q.message.content)
            }
        };
        else if (Array.isArray(q.message.content)) {
            let K = q.message.content.map((Y) => {
                if (Y.type === "text") return {
                    ...Y,
                    text: af(Y.text)
                };
                return Y
            });
            return {
                ...q,
                message: {
                    ...q.message,
                    content: K
                }
            }
        }
        return q
    })
}

// READABLE (for understanding):
function wrapWithSystemReminderTags(messages) {
    return messages.map((msg) => {
        if (typeof msg.message.content === "string") {
            return {
                ...msg,
                message: {
                    ...msg.message,
                    content: `<system-reminder>\n${msg.message.content}\n</system-reminder>`
                }
            };
        }
        if (Array.isArray(msg.message.content)) {
            const wrappedContent = msg.message.content.map((block) => {
                if (block.type === "text") {
                    return {
                        ...block,
                        text: `<system-reminder>\n${block.text}\n</system-reminder>`
                    };
                }
                return block;
            });
            return {
                ...msg,
                message: { ...msg.message, content: wrappedContent }
            };
        }
        return msg;
    });
}

// Mapping: b5→wrapWithSystemReminderTags, af→createSystemReminderTag
```

### createSystemReminderTag (`af`)

```javascript
// ============================================
// createSystemReminderTag (af) - XML wrapper function
// Location: chunks.173.mjs:2490-2494
// ============================================

// ORIGINAL (for source lookup):
function af(A) {
    return `<system-reminder>
${A}
</system-reminder>`
}

// READABLE (for understanding):
function createSystemReminderTag(content) {
    return `<system-reminder>
${content}
</system-reminder>`;
}

// Mapping: af→createSystemReminderTag
```

### Visibility Tiers Reference

| Tier | `isMeta` | `isVisibleInTranscriptOnly` | Chat View | Transcript View |
|------|----------|-----------------------------|-----------|-----------------|
| Normal | `false` | `false` | Shown | Shown |
| Transcript-only | `false` | `true` | Hidden | Shown |
| Meta (System Reminder) | `true` | any | Hidden | Hidden |

**Design rationale:**
- `isMeta: true` messages are NEVER shown to users in any view
- They contain internal context (token counts, system state) that's not relevant to users
- `isVisibleInTranscriptOnly: true` allows informational messages useful for debugging/review

---

## Compact-UI Integration

> Related: [06_compact/](../06_compact/)

### Compact Boundary Display

```
Messages Array
      │
      ▼
┌───────────────────┐
│ findLastIndex     │
│ inline pattern    │
│ (chunks.150.mjs)  │
└───────────────────┘
      │
      ▼
  Boundary found?
      │
 ┌────┴────┐
 ▼         ▼
[No]      [Yes]
 │          │
 ▼          ▼
Show all   Show only
messages   post-boundary
           messages
```

### Key Integration Points

| Integration Point | Direction | Description |
|-------------------|-----------|-------------|
| Boundary detection | Compact → UI | Inline `findLastIndex` pattern at chunks.150.mjs:2523 |
| Filter application | UI → UI | `messages.slice(boundaryIndex)` after findLastIndex |
| Boundary message | Compact → UI | `type: "system"`, `subtype: "compact_boundary"` |
| Transcript bypass | UI → UI | In transcript mode, compaction filter is bypassed |

### Code Reference

```javascript
// ============================================
// Compact boundary detection - Inline pattern
// Location: chunks.150.mjs:2523
// ============================================

// ORIGINAL (for source lookup):
_ = z.findLastIndex((O) => O.type === "system" && ("subtype" in O) && O.subtype === "compact_boundary")

// READABLE (for understanding):
const boundaryIndex = messages.findLastIndex(
    (msg) => msg.type === "system" && msg.subtype === "compact_boundary"
);

// If boundaryIndex >= 0, slice to show only post-boundary:
const visibleMessages = boundaryIndex >= 0 ? messages.slice(boundaryIndex) : messages;
```

### Spinner Text During Compact

```javascript
// Compact progress updates spinner text:
// chunks.188.mjs:489-500
onCompactProgress: (p7) => {
    switch (p7.type) {
        case "hooks_start":
            S3(p7.hookType === "pre_compact" ?
                "Running PreCompact hooks…" :
                "Running SessionStart hooks…");
            break;
        case "compact_start":
            S3("Compacting conversation");
            break;
        case "compact_end":
            S3(null);
            break;
    }
}
```

---

## Slash Command-UI Integration

> Related: [01_cli/slash_command_integration.md](../01_cli/slash_command_integration.md)

### Command Autocomplete

```
User types "/"
      │
      ▼
┌───────────────────┐
│ Autocomplete      │
│ shows matching    │
│ commands from RA  │
└───────────────────┘
      │
      ▼
User selects command
      │
      ▼
┌───────────────────┐
│ handleSubmit(Z$)  │
│ detects "/"       │
└───────────────────┘
      │
      ├─────────────────┐
      │                 │
      ▼                 ▼
 local-jsx          regular
 command            command
      │                 │
      ▼                 ▼
 setToolJSX()      executeCommand()
```

### Key Integration Points

| Integration Point | Direction | Description |
|-------------------|-----------|-------------|
| Command list | CLI → UI | commands array |
| Command detection | UI → CLI | handleSubmit checks for "/" prefix |
| Local JSX rendering | CLI → UI | setToolJSX |
| Animation gate | CLI → UI | toolJSX.shouldContinueAnimation |

### Code Reference

```javascript
// ============================================
// Slash command detection and routing
// Location: chunks.188.mjs:687-724
// ============================================

// In handleSubmit:
if (!FA && k6.trim().startsWith("/")) {
    let k7 = k6.trim();
    let X4 = k7.indexOf(" ");
    let p7 = X4 === -1 ? k7.slice(1) : k7.slice(1, X4);  // Command name
    let V3 = X4 === -1 ? "" : k7.slice(X4 + 1).trim();   // Args

    let sq = RA.find((pK) =>
        pK.isEnabled() && (
            pK.name === p7 ||
            pK.aliases?.includes(p7) ||
            pK.userFacingName() === p7
        )
    );

    let J3 = sq?.immediate || Yq?.fromKeybinding;

    // Local JSX commands (interactive overlays like /help)
    if (sq && J3 && sq.type === "local-jsx") {
        let f$ = await (await sq.load()).call(_Y, Uj, V3);
        if (f$) TA({
            jsx: f$,
            shouldHidePromptInput: true,
            isLocalJSXCommand: true
        });
        return;
    }
}
```

### Animation Gate for Commands

```javascript
// Local JSX commands block lower-priority dialogs:
// chunks.196.mjs:392
let P1 = !j8 || j8.shouldContinueAnimation;
// P1 is false when local JSX is active

// This gates dialogs like tool-permission, elicitation:
if (P1 && a8[0]) return "tool-permission";
```

### /color Command (v2.1.76)

The `/color` command sets the prompt-bar accent color for visual differentiation between multiple Claude Code windows:

```javascript
// ============================================
// /color command implementation
// Location: chunks.150.mjs:2523-2560
// ============================================

// Command definition:
colorCommand = {
    name: "color",
    description: "Set the prompt-bar accent color for this session",
    type: "local-jsx",
    async execute(context, args) {
        const validColors = ["default", "blue", "green", "red", "purple", "orange"];
        const colorName = args.trim().toLowerCase();

        if (!validColors.includes(colorName)) {
            return `Invalid color. Valid values: ${validColors.join(", ")}`;
        }

        // Set session-scoped color (not persisted to settings)
        setSessionColor(colorName);
        return `Prompt bar color set to ${colorName}`;
    }
};

// READABLE (for understanding):
// The /color command updates a session-scoped state variable
// that affects the PromptInput component's styling.
// Unlike settings, this is not persisted between sessions.
```

**Integration with PromptInput:**
```
/color blue
      │
      ▼
setSessionColor("blue")
      │
      ▼
PromptInput re-renders
      │
      ▼
Prompt bar displays with
blue accent color
```

**Use case:** When running multiple Claude Code windows, users can set different colors to visually distinguish which window is which.

---

## Hooks-UI Integration

> Related: [16_hooks/](../16_hooks/)

### Hook Message Grouping

```
Tool Execution
      │
      ▼
┌───────────────────┐
│ PreToolUse hooks  │
│ run               │
└───────────────────┘
      │
      ▼
┌───────────────────┐
│ Tool executes     │
└───────────────────┘
      │
      ▼
┌───────────────────┐
│ PostToolUse hooks │
│ run               │
└───────────────────┘
      │
      ▼
┌───────────────────┐
│ normalizeDisplay  │
│ Messages (t9q)    │
│ groups all        │
└───────────────────┘
      │
      ▼
[Tool Use] [Pre Hooks] [Result] [Post Hooks]
```

### Key Integration Points

| Integration Point | Direction | Description |
|-------------------|-----------|-------------|
| Hook attachment type | Hooks → UI | `type: "attachment"`, `attachment.hookEvent` |
| PreToolUse grouping | UI → UI | normalizeDisplayMessages collects pre hooks |
| PostToolUse grouping | UI → UI | normalizeDisplayMessages collects post hooks |
| Progress messages | Hooks → UI | `type: "progress"`, `data.hookEvent` |

### Code Reference

```javascript
// ============================================
// Hook grouping in normalizeDisplayMessages
// Location: chunks.172.mjs:3072-3150
// ============================================

// Build index of tool use groups:
for (const msg of messages) {
    if (isToolUseMessage(msg)) {
        toolUseGroups.set(toolUseId, { toolUse: msg, preHooks: [], ... });
    }
    if (isHookAttachment(msg) && msg.attachment.hookEvent === "PreToolUse") {
        toolUseGroups.get(toolUseID).preHooks.push(msg);
    }
    if (isHookAttachment(msg) && msg.attachment.hookEvent === "PostToolUse") {
        toolUseGroups.get(toolUseID).postHooks.push(msg);
    }
}

// Emit in order:
output.push(toolUse);
output.push(...preHooks);
output.push(toolResult);
output.push(...postHooks);
```

---

## MCP-UI Integration

> Related: [09_mcp/](../09_mcp/)

### Elicitation Form Flow

```
MCP Server calls elicitInput()
            │
            ▼
    ┌───────────────┐
    │ Register      │
    │ elicitation   │
    │ handler       │
    └───────────────┘
            │
            ▼
    ┌───────────────┐
    │ Push to       │
    │ o.queue       │
    └───────────────┘
            │
            ▼
    ┌───────────────┐
    │ f11() returns │
    │ "elicitation" │
    └───────────────┘
            │
            ▼
    ┌───────────────┐
    │ WWq router    │
    │ determines    │
    │ mode          │
    └───────────────┘
        ┌───────┴───────┐
        ▼               ▼
   "form" mode      "url" mode
        │               │
        ▼               ▼
   CDz form         SDz URL
   dialog           dialog
```

### Key Integration Points

| Integration Point | Direction | Description |
|-------------------|-----------|-------------|
| Elicitation queue | MCP → UI | elicitationState.queue (Zustand store) |
| Dialog routing | UI → UI | `ElicitationRouter` (`ZIq`) |
| Form dialog | UI renders | ElicitationFormDialog |
| URL dialog | UI renders | ElicitationUrlDialog |
| Cancel blocking | UI → UI | `handleCancel` (`TM`) NO-OP for elicitation |

### Code Reference

```javascript
// Elicitation is protected from cancel:
// chunks.188.mjs:329
function N11() {
    if (XO === "elicitation") return;  // NO-OP
    // ... other cancel handling
}
```

---

## Summary Table

| Module | Primary Integration | UI Component | Key Data Flow |
|--------|---------------------|--------------|---------------|
| 05_tools | Permission dialogs | `HIq` (ToolPermissionDialog) | Queue → dialog → approval |
| 05_tools | Prompt dialogs | `fIq` (PromptDialog) | Tool prompt → user input |
| 04_system_reminder | isMeta filtering | MessageList (`veY`) | `isMeta: true` → filtered |
| 06_compact | Boundary display | MessageList | Inline findLastIndex pattern |
| 01_cli | Slash commands | PromptInput | `/` → command detection |
| 16_hooks | Pre/Post grouping | MessageList | normalizeDisplayMessages groups hooks |
| 09_mcp | Elicitation forms | `ZIq` (ElicitationRouter) | Queue → dialog |
| 03_llm_core | Streaming state | `veY`, `xN6` | Stream events → UI state |
| 13_task_system | Task display | TaskList component | Zustand tasks → render |
| 18_sandbox | Sandbox permissions | `ct8` (SandboxPermissionDialog) | Domain request → approval |
| 30_agent_teams | Worker dialogs | `ct8`, `Ls8` | Worker requests → approval |
| 20_sdk | Effort selection | `gmq` (EffortCalloutDialog) | Extended thinking config |
| 20_sdk | Remote session | `pWq` (RemoteCalloutDialog) | Bridge enable/disable |

---

## Cross-Reference Index

For detailed analysis of each integration point:

- **Tools**: [05_tools/ui_rendering.md](../05_tools/ui_rendering.md)
- **System Reminders**: [04_system_reminder/ui_linkage.md](../04_system_reminder/ui_linkage.md)
- **Compact**: [06_compact/](../06_compact/)
- **CLI/Slash Commands**: [01_cli/slash_command_integration.md](../01_cli/slash_command_integration.md)
- **Hooks**: [16_hooks/](../16_hooks/)
- **MCP**: [09_mcp/](../09_mcp/)
- **Dialogs**: [dialog_system.md](./dialog_system.md)
- **Rendering**: [rendering_pipeline.md](./rendering_pipeline.md)

---

## Detailed System Reminder Data Flow

### Complete isMeta Message Lifecycle

```
┌──────────────────────────────────────────────────────────────────────┐
│                    SYSTEM REMINDER → UI FLOW                          │
│                                                                       │
│  1. TRIGGER CONDITIONS                                                │
│  ├── Token budget update                                              │
│  ├── File context change                                              │
│ ├── Hook event (PreToolUse/PostToolUse)                               │
│ ├── Task management event                                             │
│ ├── Mode control change                                               │
│ └── Silent reminder (no UI display)                                   │
│                                                                       │
│  2. MESSAGE CREATION (04_system_reminder)                             │
│  ├── createSystemReminderMessage()                                    │
│  ├── Set isMeta: true                                                │
│  ├── Set isVisibleInTranscriptOnly: boolean                          │
│  └── Add to messages array                                           │
│                                                                       │
│  3. UI PIPELINE PROCESSING (02_ui)                                    │
│  ├── normalizeMessages (cM)                                           │
│  │   └── Pass isMeta through unchanged                                │
│  ├── shouldShowMessageInChat (XV6)                                    │
│  │   └── Filter: isMeta === true → HIDDEN                            │
│  └── MessageList (G_6)                                                │
│      └── Render: isMeta messages NOT rendered                         │
│                                                                       │
│  4. API PREPARATION                                                   │
│  ├── formatMessagesForAPI (m9z)                                       │
│  │   └── Strip isMeta flag before sending to LLM                      │
│  └── Include system reminder content in context                       │
└──────────────────────────────────────────────────────────────────────┘
```

### Attachment Injection Timing

```
┌──────────────────────────────────────────────────────────────────────┐
│                    ATTACHMENT INJECTION TIMING                        │
│                                                                       │
│  User submits query                                                   │
│         │                                                             │
│         ▼                                                             │
│  ┌───────────────┐                                                   │
│  │ System        │                                                   │
│  │ reminders     │                                                   │
│  │ generated     │                                                   │
│  │ (04_system_   │                                                   │
│  │  reminder)    │                                                   │
│  └───────────────┘                                                   │
│         │                                                             │
│         ▼                                                             │
│  ┌───────────────┐                                                   │
│  │ reorderAttach │                                                   │
│  │ ments (dzz)   │                                                   │
│  │               │                                                   │
│  │ Move attach-  │                                                   │
│  │ ments BEFORE  │                                                   │
│  │ user message  │                                                   │
│  └───────────────┘                                                   │
│         │                                                             │
│         ▼                                                             │
│  Final order for API:                                                │
│  [attachment1] [attachment2] [userMessage]                            │
│                                                                       │
│  Why? LLM sees context "just as user is speaking"                    │
└──────────────────────────────────────────────────────────────────────┘
```

### Visibility Tiers

| Tier | isMeta | isVisibleInTranscriptOnly | Chat View | Transcript View |
|------|--------|---------------------------|-----------|-----------------|
| Normal | false | false | Shown | Shown |
| Transcript-only | false | true | Hidden | Shown |
| Meta (System Reminder) | true | any | Hidden | Hidden |

### Key Functions

```javascript
// ============================================
// createUserMessage (p1) - Creates user message with metadata flags
// Location: chunks.173.mjs:1378-1412
// ============================================

// ORIGINAL (for source lookup):
function p1({
    content: A,
    isMeta: q,
    isVisibleInTranscriptOnly: K,
    isCompactSummary: Y,
    summarizeMetadata: z,
    toolUseResult: _,
    mcpMeta: w,
    uuid: O,
    timestamp: $,
    imagePasteIds: H,
    sourceToolAssistantUUID: j,
    permissionMode: J,
    origin: M
}) {
    return {
        type: "user",
        message: {
            role: "user",
            content: A || wE
        },
        isMeta: q,
        isVisibleInTranscriptOnly: K,
        isCompactSummary: Y,
        summarizeMetadata: z,
        uuid: O || SE(),
        timestamp: $ ?? new Date().toISOString(),
        toolUseResult: _,
        mcpMeta: w,
        imagePasteIds: H,
        sourceToolAssistantUUID: j,
        permissionMode: J,
        origin: M
    }
}

// READABLE (for understanding):
function createUserMessage({
    content,
    isMeta,              // true = system reminder, hidden in chat
    isVisibleInTranscriptOnly,  // show only in transcript view
    isCompactSummary,
    summarizeMetadata,
    toolUseResult,
    mcpMeta,
    uuid,
    timestamp,
    imagePasteIds,
    sourceToolAssistantUUID,
    permissionMode,
    origin
}) {
    return {
        type: "user",
        message: {
            role: "user",
            content: content || EMPTY_CONTENT
        },
        isMeta,              // System reminders set this to true
        isVisibleInTranscriptOnly,
        isCompactSummary,
        summarizeMetadata,
        uuid: uuid || generateUUID(),
        timestamp: timestamp ?? new Date().toISOString(),
        toolUseResult,
        mcpMeta,
        imagePasteIds,
        sourceToolAssistantUUID,
        permissionMode,
        origin
    };
}

// Mapping: p1→createUserMessage, SE→generateUUID, wE→EMPTY_CONTENT
```

```javascript
// ============================================
// shouldShowMessageInChat - Visibility gate
// Location: chunks.152.mjs:573
// ============================================

function shouldShowMessageInChat(message, isTranscriptView) {
    if (message.type !== "user") return true;          // Non-user: always show
    if (message.isMeta) return false;                  // System reminders: HIDDEN
    if (message.isVisibleInTranscriptOnly && !isTranscriptView) return false;
    return true;
}

// ============================================
// reorderAttachments - Attachment positioning
// Location: chunks.173.mjs (dzz)
// ============================================

function reorderAttachments(messages) {
    // Walk backwards through messages
    // Move attachment messages to appear before their related user message
    // This ensures LLM sees: [context] [attachments] [user input]
}
```

---

## REPL State Variables (Verified Cross-Reference)

> **Source Verification Date**: 2026-03-22
> All state variables verified against chunks.196.mjs source code.

### Core Loading State Variables

| Obfuscated | Readable | Location | Purpose |
|------------|----------|----------|---------|
| `Bq` | isLoading | chunks.196.mjs:115 | Combined loading state (sw \|\| UY) |
| `sw` | isLoadingFromStore | chunks.196.mjs:113 | Loading from zustand store |
| `UY` | isLoadingLocal | chunks.196.mjs:114 | Local loading state |
| `dY` | setIsLoading | chunks.196.mjs:114 | Setter for isLoading |
| `YA` | userInputOnProcessing | chunks.196.mjs:116 | User input being processed |
| `E3` | setUserInputOnProcessing | chunks.196.mjs:116 | Setter for YA |

### Spinner State Variables

| Obfuscated | Readable | Location | Purpose |
|------------|----------|----------|---------|
| `QV6` | showSpinner | chunks.196.mjs:305 | Derived spinner visibility |
| `UV6` | hasActiveDialogs | chunks.196.mjs:306 | Any dialog queue has items |
| `j8` | toolJSX | chunks.196.mjs:143 | Local JSX command state |
| `l8` | setToolJSX | chunks.196.mjs:143 | Setter for toolJSX |

### Dialog Queue State Variables

| Obfuscated | Readable | Location | Purpose |
|------------|----------|----------|---------|
| `a8` | toolUseConfirmQueue | chunks.196.mjs:167 | Tool permission queue |
| `$A` | setToolUseConfirmQueue | chunks.196.mjs:167 | Setter for a8 |
| `G7` | sandboxPermissionQueue | chunks.196.mjs:167 | Sandbox permission queue |
| `Q1` | setSandboxPermissionQueue | chunks.196.mjs:167 | Setter for G7 |
| `zA` | promptQueue | chunks.196.mjs:167 | Tool prompt queue |
| `gA` | setPromptQueue | chunks.196.mjs:167 | Setter for zA |

### Input State Variables

| Obfuscated | Readable | Location | Purpose |
|------------|----------|----------|---------|
| `y2` | isPaused | chunks.196.mjs:130 | Input paused (typing) |
| `s6` | setIsPaused | chunks.196.mjs:130 | Setter for y2 |
| `m5` | inputValue | chunks.196.mjs:185 | Current input text |
| `ew` | setInputValue | chunks.196.mjs:185 | Setter for m5 |
| `W7` | isMessageSelectorVisible | chunks.196.mjs:235 | Message selector active |
| `Hq` | setMessageSelectorVisible | chunks.196.mjs:235 | Setter for W7 |

### Mode Detection Variables

| Obfuscated | Readable | Location | Purpose |
|------------|----------|----------|---------|
| `C2` | isToolOnlyMode | chunks.196.mjs:304 | All tools are permission-only |
| `X6` | pendingWorkerRequest | chunks.196.mjs:34 | Worker waiting for leader |
| `z6` | pendingSandboxRequest | chunks.196.mjs:34 | Sandbox request pending |
| `Wz` | isBriefOnly | chunks.196.mjs:237 | Brief mode active |

### Key Algorithm: showSpinner (QV6)

```javascript
// ============================================
// showSpinner calculation (QV6) - Spinner visibility
// Location: chunks.196.mjs:305
// ============================================

// ORIGINAL (for source lookup):
let QV6 = (!j8 || j8.showSpinner === !0) && a8.length === 0 && zA.length === 0 && (Bq || YA || oi || qY4() > 0) && !X6 && !C2 && (!aZ || Wz);

// READABLE (for understanding):
const showSpinner =
    // Condition 1: Not blocked by local JSX command
    (!toolJSX || toolJSX.showSpinner === true)
    &&
    // Condition 2: No tool permission or prompt queue
    toolUseConfirmQueue.length === 0 && promptQueue.length === 0
    &&
    // Condition 3: At least one active operation
    (isLoading || userInputOnProcessing || hasRunningTasks || hasQueuedCommands() > 0)
    &&
    // Condition 4: No pending worker request
    !pendingWorkerRequest
    &&
    // Condition 5: Not in tool-only mode
    !isToolOnlyMode
    &&
    // Condition 6: Streaming text check (brief mode)
    (!streamingText || isBriefOnly);

// Mapping: QV6→showSpinner, j8→toolJSX, a8→toolUseConfirmQueue, zA→promptQueue,
//          Bq→isLoading, YA→userInputOnProcessing, oi→hasRunningTasks, X6→pendingWorkerRequest,
//          C2→isToolOnlyMode, aZ→streamingText, Wz→isBriefOnly
```

### Key Algorithm: hasActiveDialogs (UV6)

```javascript
// ============================================
// hasActiveDialogs calculation (UV6) - Any dialog queued
// Location: chunks.196.mjs:306
// ============================================

// ORIGINAL (for source lookup):
let UV6 = a8.length > 0 || zA.length > 0 || G7.length > 0 || o.queue.length > 0 || n.queue.length > 0;

// READABLE (for understanding):
const hasActiveDialogs =
    toolUseConfirmQueue.length > 0 ||           // Tool permissions waiting
    promptQueue.length > 0 ||                   // Tool prompts waiting
    sandboxPermissionQueue.length > 0 ||        // Sandbox permissions waiting
    elicitationState.queue.length > 0 ||        // MCP elicitation waiting
    workerSandboxPermissions.queue.length > 0;  // Worker sandbox waiting

// Mapping: UV6→hasActiveDialogs, a8→toolUseConfirmQueue, zA→promptQueue,
//          G7→sandboxPermissionQueue, o.queue→elicitationState.queue,
//          n.queue→workerSandboxPermissions.queue
```

---

## Performance Considerations

### Message Update Optimization

The UI uses several strategies to minimize re-renders during heavy message updates:

```javascript
// 1. Deferred values for messages
const deferredMessages = useDeferredValue(messages);

// 2. Memoized filtering with cache
const filteredMessages = useMemo(() => {
    return messages.filter(shouldShowMessageInChat);
}, [messages]);  // Only recalculate when messages change

// 3. React Compiler memoization
// The e(N) pattern provides flat-array caching:
// cache[0] = dependency value
// cache[1] = cached result
```

### Streaming Update Batching

```javascript
// Streaming events are batched before state updates
// This prevents UI thrashing during rapid events

// From handleToolUseStream:
setStreamingToolUses(prev => prev.map(entry =>
    entry.index === event.index
        ? { ...entry, unparsedToolInput: entry.unparsedToolInput + delta }
        : entry
));
```

---

## isMeta Flag Lifecycle (Cross-Module Integration)

The `isMeta` flag is the critical integration point between the UI and the system reminder system. This section documents its complete lifecycle.

### Creation (04_system_reminder)

System reminders are created with `isMeta: true` to indicate they should be hidden from the user:

```javascript
// ============================================
// createUserMessage (p1) - Message factory with isMeta flag
// Location: chunks.173.mjs:1378-1412
// ============================================

// In 04_system_reminder, system reminders are created like:
createUserMessage({
    content: systemReminderContent,
    isMeta: true,  // THIS FLAG CAUSES UI HIDING
    isVisibleInTranscriptOnly: false
});
```

### Propagation (02_ui - normalizeMessages)

The `isMeta` flag passes through the normalization pipeline unchanged:

```javascript
// In normalizeMessages (cM):
// isMeta is NOT modified - it passes through as-is
// The flag is preserved on the message object
```

### Filtering (02_ui - shouldShowMessageInChat)

The critical filter at chunks.185.mjs:1696:

```javascript
// ============================================
// isMeta filter in shouldShowMessageInChat
// Location: chunks.185.mjs:1696
// ============================================

// ORIGINAL (for source lookup):
if (A.isMeta) return !1;  // This line hides all isMeta messages

// READABLE (for understanding):
if (message.isMeta) return false;  // System reminders NEVER shown in chat
```

### API Preparation (Before sending to LLM)

Before sending to the LLM API, `isMeta` messages are processed differently:

```javascript
// In formatMessagesForAPI:
// 1. isMeta messages are included in the API request
// 2. They provide context to the LLM (token counts, system state)
// 3. The isMeta flag itself is stripped before API transmission
// 4. Content is wrapped in <system-reminder> tags
```

### Complete Lifecycle Diagram

```
┌──────────────────────────────────────────────────────────────────────┐
│                    isMeta FLAG LIFECYCLE                              │
│                                                                       │
│  1. CREATION (04_system_reminder)                                    │
│     ├── Triggered by: token budget, file context, hooks, tasks      │
│     ├── createUserMessage({ isMeta: true })                         │
│     └── Message added to messages array                              │
│                                                                       │
│  2. PROPAGATION (normalizeMessages)                                  │
│     ├── isMeta flag passes through unchanged                         │
│     └── No transformation of the flag                                │
│                                                                       │
│  3. FILTERING (shouldShowMessageInChat - XV6)                        │
│     ├── Check: if (message.isMeta) return false                      │
│     └── Result: Message hidden from UI rendering                    │
│                                                                       │
│  4. API PREPARATION                                                  │
│     ├── isMeta messages INCLUDED in API request                      │
│     ├── Content provides LLM context                                 │
│     └── isMeta flag stripped, content wrapped in <system-reminder>  │
└──────────────────────────────────────────────────────────────────────┘
```

### Key Design Decisions

1. **User-role, not system-role**: `isMeta` messages are `role: "user"`, not `role: "system"`. This allows them to participate in compaction and appear inline in conversation context.

2. **Always hidden in chat**: The filter `if (A.isMeta) return !1` at chunks.185.mjs:1696 is unconditional - there's no override.

3. **Included in API calls**: Unlike UI filtering, `isMeta` messages ARE sent to the LLM. They contain important context like token counts and system state.

4. **Not in transcript either**: The `isMeta` flag causes hiding in both chat AND transcript views. Use `isVisibleInTranscriptOnly` for transcript-only visibility.

---

## Debugging Tips

### Tracing Message Visibility

To understand why a message is hidden:

1. Check `message.type` - user messages have special handling
2. Check `message.isMeta` - true means system reminder (hidden)
3. Check `message.isVisibleInTranscriptOnly` - only in transcript view
4. Check compaction boundary - messages before boundary hidden in chat view

### Tracing Dialog Priority

To understand which dialog is shown:

1. Call `getInputDialogType()` in debugger
2. Check queue lengths: a8, G7, o.queue, n.queue
3. Check animation gate: `!toolJSX || toolJSX.shouldContinueAnimation`
4. Check pause state: `y2` (isPaused)

### Common Issues

| Issue | Likely Cause | Solution |
|-------|--------------|----------|
| Message not showing | `isMeta: true` | Check message creation in 04_system_reminder |
| Dialog not showing | Animation gate blocked | Check `toolJSX.shouldContinueAnimation` |
| Spinner showing when shouldn't | Wrong queue state | Check `a8.length` for tool permissions |
| Elicitation hanging | MCP server timeout | Check elicitationState.queue |

---

## Validated Algorithms

### Priority Dispatcher Algorithm (ra6) - Validated Source

```javascript
// ============================================
// getInputDialogType (ra6) - Priority dispatcher
// Location: chunks.196.mjs:387-404 (VALIDATED)
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
    // Full-screen overlays block all dialogs
    if (isSearchingInputHistory || fullScreenOverlay) return;

    // Highest priority: message selector
    if (isMessageSelectorVisible) return "message-selector";

    // Paused state blocks lower-priority dialogs
    if (isPaused) return;

    // Security-critical: sandbox permissions (above animation gate)
    if (sandboxPermissionQueue[0]) return "sandbox-permission";

    // Animation gate - check if local JSX commands allow continuation
    const canShowLowerPriority = !toolJSX || toolJSX.shouldContinueAnimation;

    // Tier 2 dialogs (below animation gate):
    if (canShowLowerPriority && toolUseConfirmQueue[0]) return "tool-permission";
    if (canShowLowerPriority && promptQueue[0]) return "prompt";
    if (canShowLowerPriority && workerSandboxPermissions.queue[0]) return "worker-sandbox-permission";
    if (canShowLowerPriority && elicitationState.queue[0]) return "elicitation";
    if (canShowLowerPriority && showCostWarning) return "cost";
    if (canShowLowerPriority && showIdeOnboarding) return "ide-onboarding";
    if (canShowLowerPriority && showEffortCallout) return "effort-callout";
    if (canShowLowerPriority && showRemoteCallout) return "remote-callout";
    if (canShowLowerPriority && lspRecommendation) return "lsp-recommendation";
    if (canShowLowerPriority && showDesktopUpsell) return "desktop-upsell";

    return;  // No dialog to show
}

// Mapping: ra6→getInputDialogType, lV6→isSearchingInputHistory, na6→fullScreenOverlay,
// W7→isMessageSelectorVisible, y2→isPaused, G7→sandboxPermissionQueue,
// j8→toolJSX, a8→toolUseConfirmQueue, zA→promptQueue, n→workerSandboxPermissions,
// o→elicitationState, m26→showCostWarning, W6→showIdeOnboarding, g6→showEffortCallout,
// J1→showRemoteCallout, e8→lspRecommendation, E1→showDesktopUpsell
```

**Key Design Decisions:**

1. **Two-Tier Priority System**: The animation gate (`shouldContinueAnimation`) creates two tiers:
   - Tier 1 (above gate): `message-selector`, `sandbox-permission` - shown even during animations
   - Tier 2 (below gate): All other dialogs wait for local JSX commands to complete

2. **Paused State Blocking**: When `y2` (isPaused) is true (user typing), all lower-priority dialogs are blocked. This prevents interrupting user input.

3. **Security-Critical Priority**: `sandbox-permission` is above the animation gate because network access decisions must be resolved before any other UI operations.

### Spinner Visibility Algorithm - Validated Source

```javascript
// ============================================
// Spinner visibility calculation
// Location: chunks.196.mjs:305 (VALIDATED)
// ============================================

// ORIGINAL (for source lookup):
let QV6 = (!j8 || j8.showSpinner === !0) && a8.length === 0 && zA.length === 0 &&
    (Bq || YA || oi || qY4() > 0) && !X6 && !C2 && (!aZ || Wz);

// READABLE (for understanding):
const showSpinner =
    // Condition 1: Not blocked by local JSX command
    (!toolJSX || toolJSX.showSpinner === true)
    &&
    // Condition 2: No dialogs requiring user action
    toolUseConfirmQueue.length === 0
    &&
    promptQueue.length === 0
    &&
    // Condition 3: Has active operation
    (isLoading || hasUserInputOnProcessing || hasRunningBackgroundTasks || hasQueuedCommands() > 0)
    &&
    // Condition 4: No pending worker request
    !pendingWorkerRequest
    &&
    // Condition 5: Not tool-only mode
    !isToolOnlyMode
    &&
    // Condition 6: Partial text or brief mode
    (!partialText || isBriefOnly);

// Mapping: QV6→showSpinner, j8→toolJSX, a8→toolUseConfirmQueue, zA→promptQueue,
// Bq→isLoading, YA→hasUserInputOnProcessing, oi→hasRunningBackgroundTasks,
// qY4→hasQueuedCommands, X6→pendingWorkerRequest, C2→isToolOnlyMode,
// aZ→partialText, Wz→isBriefOnly
```

**Why Each Condition Exists:**

| Condition | Reason |
|-----------|--------|
| `!toolJSX \|\| toolJSX.showSpinner` | Local JSX commands (like /help) control their own display |
| `a8.length === 0` | Tool permissions require user action, not waiting |
| `zA.length === 0` | Prompts require user input |
| `(Bq \|\| YA \|\| oi \|\| qY4() > 0)` | Must have an active operation to show spinner |
| `!X6` | Worker pending means leader is handling |
| `!C2` | Tool-only mode: all tools are permission-only, blocked |
| `(!aZ \|\| Wz)` | Partial text hidden in brief mode |

### Cancel Handler (TM) - Validated Source

```javascript
// ============================================
// handleCancel (TM) - Escape/cancel handler
// Location: chunks.196.mjs:420-432 (VALIDATED)
// ============================================

// ORIGINAL (for source lookup):
function TM() {
    if (K2 === "elicitation") return;
    if (k(`[onCancel] focusedInputDialog=${K2} streamMode=${d7}`), J9.forceEnd(), ez?.trim())
        gq((P1) => [...P1, $Z({ content: ez })]);
    if (dE(), K2 === "tool-permission") a8[0]?.onAbort(), $A([]);
    else if (K2 === "prompt") {
        for (let P1 of zA) P1.reject(Error("Prompt cancelled by user"));
        gA([]), M5?.abort()
    } else if (B5.isRemoteMode) B5.cancelRequest();
    else M5?.abort();
    x5(null)
}

// READABLE (for understanding):
function handleCancel() {
    // Elicitation blocks cancel - MCP server Promise must be resolved
    if (focusedInputDialog === "elicitation") return;

    // Log cancel event
    log(`[onCancel] focusedInputDialog=${focusedInputDialog} streamMode=${streamMode}`);

    // Force end any active stream
    streamTracker.forceEnd();

    // Commit partial text if any
    if (partialText?.trim()) {
        setMessages(prev => [...prev, createUserMessage({ content: partialText })]);
    }

    // Reset loading state
    resetLoadingState();

    // Handle per-dialog cancel behavior
    if (focusedInputDialog === "tool-permission") {
        toolUseConfirmQueue[0]?.onAbort();  // Abort the tool
        setToolUseConfirmQueue([]);
    } else if (focusedInputDialog === "prompt") {
        for (let prompt of promptQueue) {
            prompt.reject(Error("Prompt cancelled by user"));
        }
        setPromptQueue([]);
        abortController?.abort();
    } else if (remoteSession.isRemoteMode) {
        remoteSession.cancelRequest();
    } else {
        abortController?.abort();
    }

    setAbortController(null);
}

// Mapping: TM→handleCancel, K2→focusedInputDialog, d7→streamMode, J9→streamTracker,
// ez→partialText, gq→setMessages, dE→resetLoadingState, a8→toolUseConfirmQueue,
// zA→promptQueue, M5→abortController, B5→remoteSession
```

**Why Elicitation Blocks Cancel:** The MCP server is blocked on a Promise waiting for user input. If the terminal-level Escape handler dismissed the dialog without sending `{action: "cancel"}`, the MCP server would hang indefinitely. The dialog's own Cancel button correctly resolves the Promise.

---

## Cross-Module Data Flow Summary

### Integration with 04_system_reminder

The `isMeta` flag is the primary integration point between the UI and system reminder modules:

```
┌─────────────────────────────────────────────────────────────────────┐
│                    isMeta FLAG FLOW                                  │
│                                                                      │
│  04_system_reminder                       02_ui                      │
│  ─────────────────                       ─────                       │
│                                                                      │
│  Attachment generated                     MessageList (veY)          │
│       │                                         │                    │
│       ▼                                         ▼                    │
│  createUserMessage(p1)                    filter(isMeta)             │
│  with isMeta: true                        if (isMeta) return false   │
│       │                                         │                    │
│       ▼                                         ▼                    │
│  Added to messages array                  Hidden from chat           │
│       │                                         │                    │
│       └─────────────────────────────────────────┘                    │
│                       │                                              │
│                       ▼                                              │
│             Sent to LLM API                                          │
│        (isMeta NOT stripped for API)                                 │
└─────────────────────────────────────────────────────────────────────┘
```

**Key functions in the integration:**

| Function | Module | Purpose |
|----------|--------|---------|
| `createUserMessage` (p1) | 04_system_reminder | Creates message with isMeta flag |
| `shouldShowMessageInChat` (XV6) | 02_ui | Filters isMeta messages from chat |
| `wrapWithSystemReminderTags` (b5) | 04_system_reminder | Adds XML tags to content |
| `filterEmptyMessages` (Gi6) | 02_ui | Passes system/attachment types |

### Integration with 05_tools

Tool execution flows through UI state:

```
┌─────────────────────────────────────────────────────────────────────┐
│                 TOOL EXECUTION UI FLOW                               │
│                                                                      │
│  1. LLM streams tool_use         → setStreamingToolUses (F3)         │
│     content_block_start          → streamMode = "tool-input"         │
│                                                                      │
│  2. Input JSON accumulates       → unparsedToolInput += delta       │
│     content_block_delta          → partial JSON display              │
│                                                                      │
│  3. Message complete             → streamingToolUses cleared         │
│     message_stop                 → inProgressToolUseIDs updated      │
│                                   → tool added to messages           │
│                                                                      │
│  4. Permission check             → toolUseConfirmQueue (a8)          │
│     if tool needs permission     → ToolPermissionDialog shown        │
│                                                                      │
│  5. Tool execution               → inProgressToolUseIDs (n4)         │
│     tool runs in background      → Set contains active tool IDs      │
│                                                                      │
│  6. Tool result                  → Added to messages                 │
│     tool_result message          → Shown with tool_use               │
└─────────────────────────────────────────────────────────────────────┘
```

**Tool state variables mapping:**

| State Variable | Purpose | When Updated |
|----------------|---------|--------------|
| `streamingToolUses` (JK) | Partial tool inputs | During streaming |
| `inProgressToolUseIDs` (n4) | Active tool executions | During tool run |
| `toolUseConfirmQueue` (a8) | Pending permissions | When tool needs approval |

### Integration with 11_hooks

Hook results are grouped with their tool executions via `pjq` (groupToolsWithHooks):

```
┌─────────────────────────────────────────────────────────────────────┐
│                   HOOK GROUPING FLOW                                 │
│                                                                      │
│  Messages in array:                                                  │
│  [tool_use A, pre_hook for A, tool_result for A, post_hook for A,   │
│   tool_use B, pre_hook for B, ...]                                  │
│                                                                      │
│  After pjq (groupToolsWithHooks):                                    │
│  [tool_use A, pre_hook A, tool_result A, post_hook A,               │
│   tool_use B, pre_hook B, ...]                                       │
│                                                                      │
│  Each tool execution appears as a logical unit:                      │
│  [tool_use] → [pre-hooks] → [tool_result] → [post-hooks]            │
└─────────────────────────────────────────────────────────────────────┘
```

**Hook attachment detection:**

```javascript
// rr6 - isHookAttachmentMessage (VALIDATED)
function rr6(message) {
    return message.type === "attachment" && (
        message.attachment.type === "hook_blocking_error" ||
        message.attachment.type === "hook_cancelled" ||
        message.attachment.type === "hook_error_during_execution" ||
        message.attachment.type === "hook_non_blocking_error" ||
        message.attachment.type === "hook_success" ||
        message.attachment.type === "hook_system_message" ||
        message.attachment.type === "hook_additional_context" ||
        message.attachment.type === "hook_stopped_continuation"
    );
}
```

### Integration with 06_compact

Compact boundaries are detected inline during rendering:

```javascript
// chunks.150.mjs:2523 - Compact boundary detection
let boundaryIndex = messages.findLastIndex(
    (m) => m.type === "system" && m.subtype === "compact_boundary"
);
let visibleMessages = boundaryIndex >= 0
    ? messages.slice(boundaryIndex + 1)
    : messages;
```

**Compact boundary message structure:**
```javascript
{
    type: "system",
    subtype: "compact_boundary",
    message: { /* compact metadata */ }
}
```

### Integration with 01_cli (Slash Commands)

Slash commands are processed in the input handling layer:

```
User types: "/help"
     │
     ▼
handleSubmit checks: startsWith("/")
     │
     ▼
Find matching command in commands array
     │
     ├─ type="local-jsx" → setToolJSX(jsxResult) → Overlay displayed
     │
     └─ regular command → executeCommand() → Run command
```

**Command types affecting UI:**

| Command Type | UI Behavior |
|--------------|-------------|
| `local-jsx` | Sets toolJSX state, shows overlay |
| `immediate` | Executes immediately, no queue |
| `background` | Runs as background task |

### Integration with 09_mcp (Elicitation)

MCP elicitation forms are routed through the dialog system:

```
MCP Server → elicitation/create request
     │
     ▼
registerElicitationHandler (RV6)
     │
     ▼
Push to elicitationState.queue
     │
     ▼
getInputDialogType returns "elicitation"
     │
     ▼
ElicitationRouter (ZIq) rendered
     │
     ├─ mode="form" → ElicitationFormDialog (BWz)
     │
     └─ mode="url"  → ElicitationUrlDialog (gWz)
     │
     ▼
User responds → event.respond({action, content})
     │
     ▼
Promise resolves → MCP server receives response
```

**Elicitation cancel protection:**
```javascript
// TM (handleCancel) - Elicitation blocks cancel
if (focusedInputDialog === "elicitation") return;  // NO-OP
```

---

## Summary Table: All Cross-Module Integrations

| Module | Integration Point | Key Symbols | Data Flow |
|--------|-------------------|-------------|-----------|
| 04_system_reminder | isMeta filtering | XV6, p1, Gi6 | Reminder → Hidden from chat |
| 05_tools | Permission dialogs | HIq, a8, n4 | Tool → Dialog → Execute |
| 06_compact | Boundary display | chunks.150.mjs:2523 | Boundary → Hide older messages |
| 11_hooks | Result grouping | pjq, rr6, wl6 | Hook → Grouped with tool |
| 01_cli | Slash commands | handleSubmit, commands array | Command → Overlay/Execute |
| 09_mcp | Elicitation forms | ZIq, BWz, o.queue | MCP → Form → Response |
| 07_compact | Auto-compact | chunks.150.mjs | Token threshold → Compact |
| 16_file_system | File context | attachments, file reads | File → Attachment message |
| 11_plan_mode | Plan mode activation | Wzz, KIq, szz, Ezz | Plan → Interview → Plan file |
| 26_background_agents | Task status display | oi, GVq, vIY | Task → Progress attachment |

---

## Master Integration Diagram

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                    UI MODULE MASTER INTEGRATION MAP                           │
│                                                                               │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │                         REPL (ot8) - chunks.196.mjs:3                    │ │
│  │                                                                           │ │
│  │  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                   │ │
│  │  │ 04_system_  │    │   05_tools  │    │   06_mcp    │                   │ │
│  │  │  reminder   │    │             │    │             │                   │ │
│  │  │             │    │             │    │             │                   │ │
│  │  │ isMeta flag │    │ Permissions │    │ Elicitation │                   │ │
│  │  │ Attachments │    │ Tool Queue  │    │ Forms       │                   │ │
│  │  └──────┬──────┘    └──────┬──────┘    └──────┬──────┘                   │ │
│  │         │                  │                  │                           │ │
│  │         ▼                  ▼                  ▼                           │ │
│  │  ┌─────────────────────────────────────────────────────────────────┐     │ │
│  │  │              getInputDialogType (ra6)                            │     │ │
│  │  │              Priority Dispatcher                                 │     │ │
│  │  │                                                                  │     │ │
│  │  │  Tier 1 (above animation): message-selector, sandbox-permission │     │ │
│  │  │  Animation Gate: !toolJSX || toolJSX.shouldContinueAnimation    │     │ │
│  │  │  Tier 2 (below animation): tool-permission, prompt, elicitation,│     │ │
│  │  │                            cost, ide-onboarding, effort-callout, │     │ │
│  │  │                            remote-callout, lsp-recommendation,   │     │ │
│  │  │                            desktop-upsell                       │     │ │
│  │  └─────────────────────────────────────────────────────────────────┘     │ │
│  │         │                                                                  │ │
│  │         ▼                                                                  │ │
│  │  ┌─────────────────────────────────────────────────────────────────┐     │ │
│  │  │              MessageList (veY) - chunks.161.mjs:3                │     │ │
│  │  │                                                                  │     │ │
│  │  │  Pipeline:                                                       │     │ │
│  │  │  1. normalizeMessages (cM) - Format conversion                   │     │ │
│  │  │  2. Compaction filter - Hide pre-compact                         │     │ │
│  │  │  3. Visibility filter (XV6/qYq) - isMeta removal                 │     │ │
│  │  │  4. Display normalization (pjq) - Hook grouping                  │     │ │
│  │  │  5. Tool grouping - Collapse repeated tools                      │     │ │
│  │  │  6. Pagination - Transcript limit                                │     │ │
│  │  │  7. Render - React elements                                      │     │ │
│  │  └─────────────────────────────────────────────────────────────────┘     │ │
│  │         │                                                                  │ │
│  │         ▼                                                                  │ │
│  │  ┌─────────────────────────────────────────────────────────────────┐     │ │
│  │  │              Streaming (xN6) - chunks.173.mjs:2384               │     │ │
│  │  │                                                                  │     │ │
│  │  │  Events: stream_request_start, message_start,                   │     │ │
│  │  │          content_block_start, content_block_delta,              │     │ │
│  │  │          message_stop, message_delta                             │     │ │
│  │  │                                                                  │     │ │
│  │  │  State: streamMode, streamingToolUses, streamingThinking        │     │ │
│  │  └─────────────────────────────────────────────────────────────────┘     │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## Plan Mode-UI Integration

> Related: [04_system_reminder/types_mode_control.md](../04_system_reminder/types_mode_control.md), [11_plan_mode/](../11_plan_mode/)

### Overview

Plan mode is a special operational state where the LLM operates in planning-only mode, with all edit tools disabled. The UI integration handles plan mode activation indicators, the plan mode interview component, and mode transitions.

### Plan Mode UI Components

```
┌──────────────────────────────────────────────────────────────────────┐
│                    PLAN MODE UI INTEGRATION                          │
│                                                                       │
│  1. ACTIVATION (via /plan command)                                   │
│     ├── /plan                        → plan_mode attachment          │
│     ├── /plan "description"          → plan_mode with taskDescription│
│     └── EnterPlanMode tool approval  → Permission dialog             │
│                                                                       │
│  2. INDICATOR DISPLAY                                                 │
│     ├── Plan mode header             → Shows plan mode active        │
│     ├── Plan file path               → Location of plan.md           │
│     └── Tool restrictions            → Read-only mode indicator      │
│                                                                       │
│  3. INTERVIEW COMPONENT (KIq)                                        │
│     ├── Phase 1: Explore             → User interviews for context   │
│     ├── Tab navigation               → Phase tabs for large plans    │
│     └── Form inputs                  → Questions about requirements  │
│                                                                       │
│  4. EXIT (via /plan or ExitPlanMode tool)                            │
│     ├── plan_mode_exit attachment    → Mode transition notification  │
│     └── Tool permissions restored    → Edit tools re-enabled         │
└──────────────────────────────────────────────────────────────────────┘
```

### Key Integration Points

| Integration Point | Direction | Description |
|-------------------|-----------|-------------|
| Plan mode state | State → UI | `toolPermissionContext.mode === "plan"` |
| plan_mode attachment | Reminder → UI | System reminder with mode instructions |
| PlanInterviewUI | UI renders | `PlanInterviewQuestionComponent` (`KIq`) |
| Plan file path | UI displays | Path to plan.md for user reference |
| Mode exit | UI → Tools | ExitPlanMode tool restores permissions |

### Plan Mode Reminder Variants

The system reminder system produces four variants of plan mode instructions, optimized for token efficiency:

| Variant | Token Cost | When Used | Producer Function |
|---------|------------|-----------|-------------------|
| Full | ~1500 tokens | First reminder, every 5th thereafter | `formatFullPlanReminder` (`szz`) |
| Sparse | ~150 tokens | Most turns (after initial full) | `formatSparsePlanReminder` (`Ezz`) |
| Subagent | ~400 tokens | Subagents operating in plan mode | `formatSubagentPlanReminder` (`yzz`) |
| Ultraplan Complete | ~200 tokens | Ultraplan workflow complete | `formatUltraplanCompleteReminder` (`Zzz`) |

### Variant Selection Algorithm

```javascript
// ============================================
// planModeReminderDispatcher (Wzz) - Variant selection
// Location: chunks.173.mjs:2525-2530
// ============================================

// ORIGINAL (for source lookup):
function Wzz(A) {
    if (A.reminderType === "ultraplan-complete") return Zzz(A);
    if (A.isSubAgent) return yzz(A);
    if (A.reminderType === "sparse") return Ezz(A);
    return szz(A);
}

// READABLE (for understanding):
function planModeReminderDispatcher(attachment) {
    // Priority order for variant selection:
    // 1. Ultraplan complete - highest priority
    if (attachment.reminderType === "ultraplan-complete") {
        return formatUltraplanCompleteReminder(attachment);
    }
    // 2. Subagent variant - for nested agents
    if (attachment.isSubAgent) {
        return formatSubagentPlanReminder(attachment);
    }
    // 3. Sparse variant - token-efficient
    if (attachment.reminderType === "sparse") {
        return formatSparsePlanReminder(attachment);
    }
    // 4. Full variant - default for main agent
    return formatFullPlanReminder(attachment);
}

// Mapping: Wzz→planModeReminderDispatcher, Zzz→formatUltraplanCompleteReminder,
//          yzz→formatSubagentPlanReminder, Ezz→formatSparsePlanReminder, szz→formatFullPlanReminder
```

**Why this priority order:**
1. **Ultraplan complete** must take precedence to signal workflow completion
2. **Subagent** variant is more token-efficient than full for nested contexts
3. **Sparse** saves ~1350 tokens per turn after initial full reminder
4. **Full** provides complete instructions at start and periodically

### Plan Mode Interview Component (KIq)

The interview component gathers user requirements during plan mode exploration:

```javascript
// ============================================
// PlanInterviewQuestionComponent (KIq) - Interview form UI
// Location: chunks.190.mjs:3
// ============================================

// Component structure:
<PlanInterviewQuestionComponent>
    <TabNavigation>           // Phase tabs for multi-phase plans
        <Phase1Tab active />
        <Phase2Tab />
        <Phase3Tab />
    </TabNavigation>

    <QuestionForm>
        <QuestionLabel>{question.text}</QuestionLabel>
        <InputField
            value={answer}
            onChange={setAnswer}
            placeholder={question.placeholder}
        />
        <NavigationButtons>
            <BackButton disabled={isFirstQuestion} />
            <NextButton onClick={submitAnswer} />
            <SkipButton onClick={skipQuestion} />
        </NavigationButtons>
    </QuestionForm>
</PlanInterviewQuestionComponent>
```

### v2.1.76 Enhancement: /plan with Description

```javascript
// ============================================
// /plan command with description argument
// Location: chunks.147.mjs:136-168 (producer), chunks.173.mjs (renderer)
// ============================================

// When user invokes: /plan "Fix the authentication bug"
// The description is embedded in the plan_mode attachment:

{
    type: "plan_mode",
    reminderType: "full",
    isSubAgent: false,
    planFilePath: "/path/to/plan.md",
    planExists: false,
    taskDescription: "Fix the authentication bug"  // v2.1.76 new field
}

// The full reminder variant renders this as:
/*
## Task Context

The user wants you to work on the following:
"Fix the authentication bug"

Use this as your starting point for Phase 1 exploration.
*/
```

**Rationale:** Without a description, the LLM must ask the user for clarification before beginning exploration. The description argument allows power users to kick off a plan mode session with full context in a single command, reducing conversation turns.

### Plan Mode Reentry Flow

When resuming a session with an existing plan:

```
Session Start
     │
     ▼
Check plan file exists
     │
     ├── No plan → Normal plan mode activation
     │
     └── Has plan → plan_mode_reentry attachment
                         │
                         ▼
                   Load plan content
                         │
                         ▼
                   Show plan reference
                   (plan_file_reference attachment)
```

### Turn Throttling Configuration

```javascript
// ============================================
// Plan mode timing constants
// Location: chunks.147.mjs:1231-1247
// ============================================

// Plan Mode Configuration
const PLAN_MODE_CONFIG = {
    TURNS_BETWEEN_ATTACHMENTS: 5,          // Minimum turns between plan_mode attachments
    FULL_REMINDER_EVERY_N_ATTACHMENTS: 5   // Every 5th reminder is "full" variant
};

// Selection pattern:
// Turn 1:  full reminder (reminder #1, (1 % 5) === 1)
// Turn 6:  sparse reminders (turns 2-5 skipped due to TURNS_BETWEEN)
// Turn 7:  sparse
// Turn 8:  sparse
// Turn 9:  sparse
// Turn 10: sparse
// Turn 11: full reminder (reminder #6, (6 % 5) === 1)
```

---

## Background Agent-UI Integration

> Related: [26_background_agents/](../26_background_agents/), [08_subagent/](../08_subagent/)

### Overview

Background agents are detached execution contexts that run independently while the main conversation continues. The UI integration handles task status display, progress indicators, and the Ctrl+F agent filter panel.

### Background Task State in UI

```javascript
// ============================================
// Background task state tracking
// Location: chunks.151.mjs:2590 (Zustand store)
// ============================================

// State structure:
appState.tasks = Map<string, TaskEntry>

// TaskEntry structure:
{
    taskId: "a3f4b2c1",           // "a" prefix for local_agent
    taskType: "local_agent",      // or "local_bash", "remote_agent"
    status: "running",            // "running" | "completed" | "failed" | "killed"
    description: "Search codebase",
    summary: "Analyzed 15 files...",
    outputOffset: 2048,           // Position in .output file
    startTime: 1709520000000,
    abortController: AbortController
}
```

### Spinner Integration with Background Tasks

```javascript
// ============================================
// hasRunningBackgroundTasks (oi) - Spinner condition
// Location: chunks.196.mjs:262 (derived state)
// ============================================

// ORIGINAL (for source lookup):
let oi = BR($6).some((k6) => k6.status === "running");

// READABLE (for understanding):
const hasRunningBackgroundTasks = Array.from(tasks.values())
    .some(task => task.status === "running");

// This feeds into the showSpinner calculation:
// showSpinner = ... && (isLoading || hasUserInput || hasRunningBackgroundTasks || ...)
```

**Why this matters:** The spinner shows when background tasks are running, even if the main LLM conversation is idle. This informs users that work is happening in the background.

### Background Task Indicator (GVq)

The background task indicator appears in the component tree:

```
REPL (ot8)
  └── yV6 (MCP Provider)
        └── GVq (Background)     ← Shows task count/status
              ├── Active task count badge
              ├── Running task spinner
              └── Click to expand → TaskList
```

### Ctrl+F Agent Filter Panel

```javascript
// ============================================
// Agent filter panel keyboard shortcut
// Location: chunks.196.mjs (key handler), chunks.190.mjs (panel component)
// ============================================

// When Ctrl+F is pressed in non-vim mode:
// 1. Opens agent filter panel
// 2. Shows list of active background agents
// 3. Allows filtering by status (running/completed/failed)
// 4. Provides kill button for each running task

// Panel displays:
// - Task ID (truncated)
// - Description
// - Status indicator
// - Kill button (for running tasks)
// - Output preview (for completed tasks)
```

### Task Progress Attachments

Background agents surface their progress through system reminder attachments:

```javascript
// ============================================
// task_progress attachment
// Location: chunks.142.mjs:1711 (buildTaskAttachments)
// ============================================

// When a task is running, progress is shown every 3+ turns:
{
    type: "attachment",
    attachment: {
        type: "task_progress",
        taskId: "a3f4b2c1",
        taskType: "local_agent",
        message: "Running npm install..."
    }
}

// When a task completes/fails/kills:
{
    type: "attachment",
    attachment: {
        type: "task_status",
        taskId: "a3f4b2c1",
        taskType: "local_agent",
        status: "completed",
        description: "Search codebase",
        deltaSummary: "Found 15 occurrences in 8 files..."
    }
}
```

### Progress Throttling Algorithm

```javascript
// ============================================
// Progress frequency throttle
// Location: chunks.142.mjs:2703-2717
// ============================================

// READABLE (for understanding):
function shouldShowProgress(taskId, messages, threshold = 3) {
    // Count turns since last progress for this task
    let turnCount = 0;

    // Iterate backwards from most recent message
    for (let i = messages.length - 1; i >= 0; i--) {
        let message = messages[i];

        // Count assistant turns
        if (message?.type === "assistant" && !isWhitespaceOnly(message)) {
            turnCount++;
        }
        // Found last progress for this task
        else if (message?.type === "attachment" &&
                 message.attachment.type === "task_progress" &&
                 message.attachment.taskId === taskId) {
            return turnCount >= threshold;
        }
    }

    // No previous progress found - always show
    return true;
}
```

**Why 3 turns:** This balances informativeness with noise reduction. Every turn would overwhelm users with progress updates; 3 turns provides periodic updates without flooding the conversation.

### Task Completion Notification Flow

```
Background Agent Completes
         │
         ▼
markTaskCompleted(agentId, result, usage)
         │
         ├── Update status in appState.tasks
         │   status: "running" → "completed"
         │
         ├── Write final output to .output file
         │
         └── notifyTaskCompletion(...)
                  │
                  ▼
         Create task_status attachment
                  │
                  ▼
         Inject into next LLM turn context
                  │
                  ▼
         User sees completion in message stream
```

### Kill Handler Integration

```javascript
// ============================================
// Kill handlers for background tasks
// ============================================

// Local Agent Kill Handler (Fk1) - chunks.146.mjs:2292
function LocalAgentTaskHandler_kill(taskId) {
    const task = tasks.get(taskId);
    if (task?.abortController) {
        task.abortController.abort("killed");
        tasks.set(taskId, { ...task, status: "killed" });
    }
}

// Local Bash Kill Handler (Lf6) - chunks.133.mjs:2542
function LocalBashTaskHandler_kill(taskId) {
    const process = childProcesses.get(taskId);
    if (process) {
        process.kill("SIGTERM");
        tasks.set(taskId, { ...task, status: "killed" });
    }
}
```

### Summary Table: Background Agent UI Integration

| UI Element | State Source | Update Trigger |
|------------|--------------|----------------|
| Spinner | `hasRunningBackgroundTasks` | Task status change |
| Background indicator | `appState.tasks` | Task add/remove |
| Progress attachment | `buildTaskAttachments` | Turn iteration |
| Completion notification | `task_status` attachment | Task completion |
| Ctrl+F panel | `appState.tasks` filter | Keyboard shortcut |

---

## v2.1.76 Integration Changes

### New Integration Points

| Integration | Module | Purpose |
|-------------|--------|---------|
| `/color` command | 01_cli → 02_ui | Session-scoped prompt bar color |
| Ctrl+F agent filter | 26_background_agents → 02_ui | Filter active background agents |
| Effort callout | 19_think_level → 02_ui | Extended thinking effort selection |
| Remote callout | 33_remote_sessions → 02_ui | Remote session options dialog |

### Updated Integration Behaviors

1. **Escape key handling** - Fixed race conditions for reliable message selector opening
2. **Spinner isolation** - 50ms animation loop independent of message renders
3. **Memory leak fix** - Streaming buffers cleared on abort via `resetLoadingState`

---

## Deep Integration: System Reminders (04_system_reminder)

> Related: [04_system_reminder/](../04_system_reminder/), [04_system_reminder/ui_linkage.md](../04_system_reminder/ui_linkage.md)

### Three-Tier Visibility Model

System reminders use a sophisticated visibility system that integrates with the UI at multiple stages:

```
┌─────────────────────────────────────────────────────────────────────┐
│                 SYSTEM REMINDER VISIBILITY MODEL                     │
│                                                                      │
│  Tier 1: Message Creation (isMeta flag)                             │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │ createUserMessage({ content, isMeta: true })                    ││
│  │ → User message with special flag                                ││
│  └─────────────────────────────────────────────────────────────────┘│
│                         │                                            │
│                         ▼                                            │
│  Tier 2: List Filtering (MessageList)                               │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │ flattenMessages() → filterEmptyMessages()                       ││
│  │ → isMeta messages PASS THROUGH (not filtered)                   ││
│  └─────────────────────────────────────────────────────────────────┘│
│                         │                                            │
│                         ▼                                            │
│  Tier 3: Component Rendering                                        │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │ MessageComponent checks isMeta                                  ││
│  │ → Renders as null/nothing (invisible)                           ││
│  └─────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────┘
```

### isMeta Flag Lifecycle

```javascript
// ============================================
// System Reminder isMeta flag lifecycle
// Location: chunks.173.mjs:1378-1412 (p1 = createUserMessage)
// ============================================

// ORIGINAL (for source lookup):
function p1({
    content: A,
    toolUseResult: q,
    mcpMeta: K,
    isMeta: Y = !1,
    isVisibleInTranscriptOnly: z = !1,
    timestamp: _,
    imagePasteIds: w
}) {
    let O = {
        type: "user",
        message: {
            role: "user",
            content: A
        },
        isMeta: Y,
        isVisibleInTranscriptOnly: z,
        timestamp: _ ?? Date.now()
    };
    if (q) O.toolUseResult = q;
    if (K) O.mcpMeta = K;
    if (w) O.imagePasteIds = w;
    return O
}

// READABLE (for understanding):
function createUserMessage({
    content,
    toolUseResult,
    mcpMeta,
    isMeta = false,
    isVisibleInTranscriptOnly = false,
    timestamp,
    imagePasteIds
}) {
    const message = {
        type: "user",
        message: {
            role: "user",
            content
        },
        isMeta,
        isVisibleInTranscriptOnly,
        timestamp: timestamp ?? Date.now()
    };

    // Optional fields
    if (toolUseResult) message.toolUseResult = toolUseResult;
    if (mcpMeta) message.mcpMeta = mcpMeta;
    if (imagePasteIds) message.imagePasteIds = imagePasteIds;

    return message;
}

// Mapping: p1→createUserMessage, A→content, q→toolUseResult, K→mcpMeta,
//          Y→isMeta, z→isVisibleInTranscriptOnly, _→timestamp, w→imagePasteIds
```

### Attachment-to-Message Pipeline

```javascript
// ============================================
// Attachment message injection pipeline
// Location: chunks.147.mjs (assembleAllAttachments), chunks.174.mjs (normalizeAttachmentForAPI)
// ============================================

// Pipeline stages:
// 1. assembleAllAttachments() - Gather all context from state
// 2. normalizeAttachmentForAPI() - Convert attachment → user message
// 3. wrapWithSystemReminderTags() - Add XML wrapper for API
// 4. Injection into message stream

// Example: plan_mode reminder
{
    type: "attachment",
    attachment: {
        type: "plan_mode",
        planFilePath: "/path/to/plan.md",
        planExists: true,
        isSubAgent: false,
        reminderType: "full"
    }
}

// After normalizeAttachmentForAPI:
{
    type: "user",
    message: {
        role: "user",
        content: [{
            type: "text",
            text: "<system-reminder>\nPlan mode is active...\n</system-reminder>"
        }]
    },
    isMeta: true
}
```

### Visibility Check Decision Tree

```
Message arrives in MessageList
        │
        ▼
┌───────────────────┐
│ flattenMessages   │
│ (JM)              │
│ → Split blocks    │
└───────────────────┘
        │
        ▼
┌───────────────────┐
│ filterEmptyMessages│
│ (Gi6)             │
│ → isMeta PASS     │
└───────────────────┘
        │
        ▼
┌───────────────────┐
│ MessageComponent  │
│                   │
│ isMeta === true?  │
└───────────────────┘
        │
   ┌────┴────┐
   ▼         ▼
 [Yes]     [No]
   │         │
   ▼         ▼
Render    Render
 nothing   content
```

### XML Tag Detection for System Reminders

The `shouldShowMessageInChat` function (XV6) also checks for XML tags:

```javascript
// XML tags that trigger hiding in message selector:
const SYSTEM_REMINDER_TAG = "system-reminder";           // WP
const THINKING_TAG = "thinking";                          // oA6
const THINKING_INTERLEAVE_TAG = "thinking-interleave";   // rHA
const THINKING_INTERLEAVE_SECTION_TAG = "thinking-interleave-section"; // oHA
const INSTRUCTIONS_TAG = "instructions";                  // EH
const INSTRUCTIONS_LOADED_TAG = "instructions_loaded";   // vV
const MEMORY_TAG = "memory";                              // fj

// These tags indicate content that shouldn't be selectable in message selector
```

### API Preparation: Stripping isMeta

Before sending messages to the API, `isMeta` is stripped:

```javascript
// ============================================
// formatMessagesForAPI - Strip isMeta before API call
// Location: chunks.173.mjs (referenced in agent loop)
// ============================================

// Messages with isMeta: true are included in the API call
// (they guide the LLM's behavior) but the flag itself is removed
// because the API doesn't understand it.

// API message format:
{
    role: "user",
    content: [{
        type: "text",
        text: "<system-reminder>\nPlan mode is active...\n</system-reminder>"
    }]
}
// Note: isMeta is NOT sent to API
```

### Integration Summary Table

| Stage | Location | Function | isMeta Handling |
|-------|----------|----------|-----------------|
| Creation | chunks.173.mjs | `createUserMessage` (p1) | Sets `isMeta: true` |
| Assembly | chunks.147.mjs | `assembleAllAttachments` (_uY) | Produces attachment objects |
| Normalization | chunks.174.mjs | `normalizeAttachmentForAPI` (Ui8) | Converts to user message |
| XML Wrapping | chunks.173.mjs | `wrapWithSystemReminderTags` (b5) | Adds `<system-reminder>` tags |
| Flattening | chunks.173.mjs | `flattenMessages` (JM) | Passes through unchanged |
| Filtering | chunks.173.mjs | `filterEmptyMessages` (Gi6) | Passes through (not filtered!) |
| Visibility | chunks.185.mjs | `shouldShowMessageInChat` (XV6) | Returns `false` (hidden from selector) |
| Rendering | chunks.161.mjs | MessageComponent | Renders as null |
| API Prep | agent loop | `formatMessagesForAPI` | Strips `isMeta` flag |

### Key Design Decisions

**Why isMeta instead of type: "system"?**
- System messages have fixed positioning in the conversation (always at the start)
- User messages can be positioned anywhere
- Compaction needs to manage reminders along with regular messages
- The `isMeta` flag is a post-hoc marker that doesn't affect API behavior

**Why not filter at the list level?**
- Filtering would remove reminders from the conversation history
- They need to be present for the LLM to receive context
- The "invisible" rendering approach keeps them in the data while hiding from users

**Why wrap in XML tags?**
- The XML format provides clear boundaries for the LLM
- The `<system-reminder>` tag tells the model "this is guidance, not user input"
- Matches the pattern used in Anthropic's prompt engineering best practices

---

## Quick Reference: Symbol Validation Status

All symbols in this document have been validated against source code on 2026-03-22:

| Symbol | Obfuscated | File | Line | Status |
|--------|------------|------|------|--------|
| `REPL` | `ot8` | chunks.196.mjs | 3 | ✅ |
| `getInputDialogType` | `ra6` | chunks.196.mjs | 387-404 | ✅ |
| `handleCancel` | `TM` | chunks.196.mjs | 420-432 | ✅ |
| `handleToolUseStream` | `xN6` | chunks.173.mjs | 2384 | ✅ |
| `MessageList` | `veY` | chunks.161.mjs | 3 | ✅ |
| `shouldShowMessageInChat` | `XV6` | chunks.185.mjs | 1692 | ✅ |
| `wrapWithSystemReminderTags` | `b5` | chunks.173.mjs | 2496 | ✅ |
| `wrapInXmlTag` | `af` | chunks.173.mjs | 2490 | ✅ |

All dialog components validated:
- `ToolPermissionDialog` (`HIq`) ✅
- `SandboxPermissionDialog` (`ct8`) ✅
- `ElicitationRouter` (`ZIq`) ✅
- `ElicitationFormDialog` (`BWz`) ✅
- `MessageSelector` (`zs8`) ✅
- `PromptDialog` (`fIq`) ✅
- `CostWarningDialog` (`jSq`) ✅
- `IDEOnboardingDialog` (`dj8`) ✅
- `EffortCalloutDialog` (`gmq`) ✅
- `RemoteCalloutDialog` (`pWq`) ✅
- `LSPRecommendationDialog` (`uBq`) ✅
- `DesktopUpsellDialog` (`zyq`) ✅

---

**Last Updated**: 2026-03-22 (Enhanced with Plan Mode and Background Agent integration sections)
**Version**: Claude Code 2.1.76
**Status**: Complete - All cross-module integrations documented and validated including Plan Mode and Background Agent UI integration
