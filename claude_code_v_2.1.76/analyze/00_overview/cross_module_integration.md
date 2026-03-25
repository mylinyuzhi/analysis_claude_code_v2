# Cross-Module Integration (Claude Code 2.1.76)

## Overview

This document describes how the major infrastructure modules (MCP, Sandbox, IDE Integration) connect to each other and to the core system features, particularly the **System Reminder** system. Understanding these integration points is essential for comprehending the full request-response lifecycle.

---

## Integration Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           Cross-Module Integration                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│    ┌───────────────┐         ┌───────────────┐         ┌───────────────┐   │
│    │  MCP Module   │         │ Sandbox Module│         │IDE Integration │   │
│    │  (06_mcp)     │         │ (18_sandbox)  │         │(22_ide_integ)  │   │
│    │               │         │               │         │               │   │
│    │ • mcp-cli     │         │ • bwrap       │         │ • Diagnostics │   │
│    │ • Elicitation │         │ • seatbelt    │         │ • Selection   │   │
│    │ • McpHub      │         │ • Network     │         │ • Diff View   │   │
│    │               │         │   Proxy       │         │               │   │
│    └───────┬───────┘         └───────┬───────┘         └───────┬───────┘   │
│            │                         │                         │           │
│            │                         │                         │           │
│            ▼                         ▼                         ▼           │
│    ┌───────────────────────────────────────────────────────────────────┐   │
│    │                     System Reminder Attachment System              │   │
│    │                         (04_system_reminder)                       │   │
│    │                                                                     │   │
│    │  • Attachment Producers: MCP tool availability, Sandbox violations │   │
│    │  • IDE diagnostics delta, Selection context                        │   │
│    │  • beforeFileEdited hooks, Permission sync                         │   │
│    └───────────────────────────────────────────────────────────────────┘   │
│                                    │                                       │
│                                    ▼                                       │
│    ┌───────────────────────────────────────────────────────────────────┐   │
│    │                        Core Tool Execution                         │   │
│    │                           (05_tools)                               │   │
│    │                                                                     │   │
│    │  • Bash tool → wrapWithSandbox() → seatbelt/bwrap                  │   │
│    │  • Read/Write tools → beforeFileEdited → IDE diagnostics baseline  │   │
│    │  • mcp-cli interception → MCP client → tool execution              │   │
│    └───────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Module Integration Points

### 1. MCP → System Reminder Integration

**What it does:** MCP server and tool availability is surfaced to the LLM through system reminder attachments.

**How it works:**

1. **MCP Tool Availability Attachment Producer:**
   - When MCP clients connect/disconnect, `mergeMcpClients` (XVq) updates the state
   - The `onChangeAppStateHandler` observer detects MCP state changes
   - An attachment producer generates a "MCP tools available" summary
   - This is injected into the system prompt as a system reminder

2. **Server Status Notifications:**
   - MCP server connection failures trigger `mcp_clients_changed` events
   - These become system reminder attachments like:
     ```
     [MCP Server Status]
     - sqlite: Connected (3 tools, 1 resource)
     - github: Disconnected (authentication error)
     ```

**Key symbols:**
- `XVq` (mergeMcpClients) - chunks.178.mjs:446
- `WT7` (setupElicitationRequestHandler) - chunks.58.mjs:3
- `onChangeAppStateHandler` - app state observer for MCP sync

---

### 2. Sandbox → System Reminder Integration

**What it does:** Sandbox violations, permission changes, and security events surface as system reminders to inform the LLM about command restrictions.

**How it works:**

1. **Sandbox Violation Attachment:**
   - When `SandboxViolationStore` (dy1) records a violation from macOS log monitor
   - The violation is encoded with the command that triggered it
   - An attachment producer formats it as:
     ```
     [Sandbox Violation Detected]
     Command: curl http://external.example.com
     Violation: network-outbound (denied)
     Reason: Domain not in allowed list
     ```

2. **Permission Mode Changes:**
   - When permission mode changes (accept → plan, etc.)
   - Sandbox configuration refreshes via `refreshSandboxConfig` (Wx3)
   - A system reminder attachment informs the LLM of the new restrictions

3. **Bash Tool System Prompt Injection:**
   - `getSandboxSystemPromptBlock` (nBY) generates sandbox-specific instructions
   - Injected into the Bash tool's system prompt section
   - Informs the model about allowed/denied paths and network restrictions

**Key symbols:**
- `nBY` (getSandboxSystemPromptBlock) - chunks.146.mjs:883
- `h21` (isSandboxingEnabled) - chunks.56.mjs:357
- `Xx3` (wrapWithSandbox) - chunks.56.mjs:417

---

### 3. IDE Integration → System Reminder Integration

**What it does:** IDE selection context and LSP diagnostics are surfaced as system reminders to give the LLM awareness of the current development context.

**How it works:**

1. **Selection Context Attachment:**
   - IDE extension sends `selection_changed` MCP notification
   - Contains: `{ filePath, startLine, endLine, selectedText, languageId }`
   - An attachment producer formats it as:
     ```
     [IDE Selection Context]
     File: src/components/App.tsx
     Lines: 45-67
     Language: TypeScript

     Selected code:
     ```typescript
     // ... selected text ...
     ```
     ```

2. **Diagnostics Delta Attachment:**
   - `DiagnosticsManager` (Gb) maintains baseline from `beforeFileEdited` hook
   - After edits, `getNewDiagnostics()` computes the delta
   - `getIdeDiagnosticsAttachment` (cuY) generates the attachment:
     ```
     [New Diagnostics]
     src/App.tsx:
       - Error (line 23): Cannot find name 'undefinedVar'
       - Warning (line 45): Unused variable 'temp'
     ```

3. **beforeFileEdited Hook Integration:**
   - When the Edit/Write tool is about to modify a file
   - `DiagnosticsManager.beforeFileEdited(filePath)` captures the current diagnostics
   - This becomes the baseline for future delta computations
   - Ensures the LLM only sees new issues it may have caused

**Key symbols:**
- `Gb` (DiagnosticsManager) - chunks.170.mjs:740
- `MPq` (IDEDiffHandler) - chunks.165.mjs:1381
- `cuY` (getIdeDiagnosticsAttachment) - chunks.147.mjs:789

---

### 4. MCP Elicitation → Hook System Integration

**What it does:** MCP server elicitation requests fire hooks before showing the dialog and after the user responds.

**How it works:**

1. **Elicitation Hook (Before Dialog):**
   - MCP server sends `elicitation/create` request
   - `runElicitationHook` (sx6) executes the `Elicitation` hook
   - Hook script can:
     - Log the elicitation for audit
     - Pre-populate form fields
     - Cancel the elicitation by returning `{ action: "cancel" }`

2. **ElicitationResult Hook (After Response):**
   - User submits or cancels the elicitation
   - `runElicitationResultHook` (tx6) executes the `ElicitationResult` hook
   - Hook script receives `{ serverName, action, content }`

**Key symbols:**
- `WT7` (setupElicitationRequestHandler) - chunks.58.mjs:3
- `sx6` (runElicitationHook) - chunks.58.mjs:86
- `jB3` (detectElicitationMode) - chunks.57.mjs:2919

---

### 5. Sandbox → Permission System Integration

**What it does:** Sandbox permissions integrate with the tool permission system to allow auto-approval of sandboxed commands.

**How it works:**

1. **Auto-Allow Sandboxed Commands:**
   - Setting `sandbox.autoAllowBashIfSandboxed = true`
   - When a command is sandboxed (`isCommandSandboxed` returns true)
   - `checkBashPermissionWithSandbox` (Ezz) auto-approves without prompting
   - Rationale: sandbox already restricts the command's capabilities

2. **Permission Rule Sync:**
   - Sandbox network domain rules sync with permission rules
   - When a domain is allowed in sandbox settings, a corresponding permission rule is added
   - This enables consistent behavior across permission prompts and sandbox enforcement

**Key symbols:**
- `Sc` (isCommandSandboxed) - chunks.172.mjs:1763
- `Ezz` (checkBashPermissionWithSandbox) - chunks.172.mjs:1363
- `h21` (isSandboxingEnabled) - chunks.56.mjs:357

---

### 6. IDE → MCP Connection Flow

**What it does:** IDE integration uses MCP as the transport protocol, connecting as a client to the IDE's MCP server.

**How it works:**

1. **Connection Initialization:**
   - IDE extension starts MCP server on localhost (SSE or WebSocket)
   - Claude Code's MCP client connects with auth token
   - Server name is registered as `"ide"`

2. **Resource Subscription:**
   - Client subscribes to `selection_changed` notifications
   - Client subscribes to `diagnostics` updates
   - These become state in `ideSelection` and trigger attachment producers

3. **Tool Invocation:**
   - `openDiffInIde` (aJz) calls `openDiff` MCP tool
   - `closeDiffTab` calls `close_tab` MCP tool
   - `getAllDiagnostics` fetches current LSP diagnostics

**Key symbols:**
- `iV` (findConnectedIdeClient) - chunks.80.mjs:1868
- `MPq` (IDEDiffHandler) - chunks.165.mjs:1381
- `Gb` (DiagnosticsManager) - chunks.170.mjs:740

---

## System Reminder Attachment Producers

The following attachment producers generate system reminders from module state:

| Producer | Source Module | Trigger | Content |
|----------|---------------|---------|---------|
| MCP Tool Availability | MCP | Client connect/disconnect | List of available MCP tools |
| MCP Server Status | MCP | Connection state change | Server connection errors |
| Sandbox Violation | Sandbox | Violation detected | Blocked operation details |
| Permission Mode Change | Sandbox | Mode switch | New restriction summary |
| IDE Selection | IDE Integration | selection_changed | Current file/selection context |
| IDE Diagnostics | IDE Integration | afterFileEdited | New errors/warnings delta |

---

## Hook Integration Points

Hooks can intercept or observe cross-module events:

| Hook Event | Source Module | Timing |
|------------|---------------|--------|
| `PreToolUse` | Core | Before any tool execution |
| `PostToolUse` | Core | After tool execution |
| `Elicitation` | MCP | Before elicitation dialog |
| `ElicitationResult` | MCP | After user responds |
| `beforeFileEdited` | IDE Integration | Before Write/Edit modifies file |

---

## Related Documents

- [04_system_reminder/attachment_producers.md](./04_system_reminder/attachment_producers.md) - Full attachment producer documentation
- [06_mcp/elicitation_handler.md](../06_mcp/elicitation_handler.md) - MCP elicitation implementation
- [18_sandbox/overview.md](../18_sandbox/overview.md) - Sandbox architecture
- [22_ide_integration/overview.md](../22_ide_integration/overview.md) - IDE integration architecture