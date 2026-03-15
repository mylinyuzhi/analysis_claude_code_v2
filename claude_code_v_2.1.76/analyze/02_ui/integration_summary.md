# UI Integration Summary

> Cross-module integration points between UI and other systems

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
        │ (F7)          │
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

| Integration Point | Direction | Key Symbols |
|-------------------|-----------|-------------|
| Permission queue | Tools → UI | `F7` (toolUseConfirmQueue), `f8` (setter) |
| Dialog type | UI → UI | `f11()` returns `"tool-permission"` |
| Permission dialog | UI renders | `_Wq` (ToolPermissionDialog) |
| Abort handler | UI → Tools | `F7[0].onAbort()` |
| Recheck permissions | Tools → UI | `F7.forEach(e => e.recheckPermission())` |

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
PG = (!vK || vK.showSpinner) && F7.length === 0 && ...

// F7.length > 0 means tool permission queued
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

| Integration Point | Direction | Key Symbols |
|-------------------|-----------|-------------|
| isMeta flag | Reminder → UI | `isMeta: true` on user message |
| Visibility filter | UI → UI | `qYq()` filters isMeta messages |
| Attachment injection | Reminder → UI | `type: "attachment"` messages |
| Visibility tiers | Reminder → UI | `isVisibleInTranscriptOnly` |

### Code Reference

```javascript
// ============================================
// shouldShowMessageInChat - Core visibility filter
// Location: chunks.173.mjs:1292-1297
// ============================================

function qYq(A, q) {
    if (A.type !== "user") return !0;
    if (A.isMeta) return !1;  // System reminders always hidden
    if (A.isVisibleInTranscriptOnly && !q) return !1;
    return !0
}
```

### Attachment Message Flow

```javascript
// Attachment messages are processed in normalization:
// chunks.173.mjs:191-199
case "attachment": {
    let X = K2z(J.attachment),  // Convert to user message content
        D = gP(H);               // Get last message
    if (D?.type === "user") {
        // Merge into preceding user message
        H[H.indexOf(D)] = X.reduce((j, M) => lzz(j, M), D);
        return
    }
    H.push(...X);
    return
}
```

---

## Compact-UI Integration

> Related: [06_compact/](../06_compact/)

### Compact Boundary Display

```
Messages Array
      │
      ▼
┌───────────────────┐
│ findLastCompact   │
│ Boundary()        │
│ (Y2z)             │
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

| Integration Point | Direction | Key Symbols |
|-------------------|-----------|-------------|
| Boundary detection | Compact → UI | `Y2z()` finds boundary index |
| Filter application | UI → UI | `EN()` slices messages |
| Boundary message | Compact → UI | `type: "system"`, `subtype: "compact_boundary"` |
| Transcript bypass | UI → UI | In transcript mode, `EN` is bypassed |

### Code Reference

```javascript
// ============================================
// getVisibleMessagesAfterCompact
// Location: chunks.173.mjs:1286-1290
// ============================================

function EN(A) {
    let q = Y2z(A);          // Find last boundary
    if (q === -1) return A;  // No boundary, show all
    return A.slice(q);        // Show only post-boundary
}
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

| Integration Point | Direction | Key Symbols |
|-------------------|-----------|-------------|
| Command list | CLI → UI | `RA` (commands array) |
| Command detection | UI → CLI | `Z$` checks for "/" prefix |
| Local JSX rendering | CLI → UI | `TA` (setToolJSX) |
| Animation gate | CLI → UI | `vK.shouldContinueAnimation` |

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
// chunks.188.mjs:309
let k6 = !vK || vK.shouldContinueAnimation;
// k6 is false when local JSX is active

// This gates dialogs like tool-permission, elicitation:
if (k6 && F7[0]) return "tool-permission";
```

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

| Integration Point | Direction | Key Symbols |
|-------------------|-----------|-------------|
| Hook attachment type | Hooks → UI | `type: "attachment"`, `attachment.hookEvent` |
| PreToolUse grouping | UI → UI | `t9q()` collects pre hooks |
| PostToolUse grouping | UI → UI | `t9q()` collects post hooks |
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
    │ E1.queue      │
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

| Integration Point | Direction | Key Symbols |
|-------------------|-----------|-------------|
| Elicitation queue | MCP → UI | `E1.queue` (elicitationState.queue) |
| Dialog routing | UI → UI | `WWq` (ElicitationRouter) |
| Form dialog | UI renders | `CDz` (ElicitationFormDialog) |
| URL dialog | UI renders | `SDz` (ElicitationUrlDialog) |
| Cancel blocking | UI → UI | `handleCancel` NO-OP for elicitation |

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
| 05_tools | Permission dialogs | `_Wq` | `F7` queue → dialog → approval |
| 04_system_reminder | isMeta filtering | MessageList | `isMeta: true` → filtered |
| 06_compact | Boundary display | MessageList | `EN()` slices messages |
| 01_cli | Slash commands | PromptInput | `/` → command detection |
| 16_hooks | Pre/Post grouping | MessageList | `t9q()` groups hooks |
| 09_mcp | Elicitation forms | `WWq`, `CDz` | `E1.queue` → dialog |

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
