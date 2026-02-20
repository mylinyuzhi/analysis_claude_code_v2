# MCP UI Linkage & React State Integration

## Overview

The MCP system connects to Claude Code's React UI at several integration points: the state management layer (reading MCP data into component props), the modal priority system (rendering elicitation dialogs), and the app state observer (persisting MCP state changes to disk). This document covers those integration points.

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - MCP UI/State Sync section
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - UI Components

Key symbols in this document:
- `mergeMcpClients` (XVq) - chunks.186.mjs:163 - Dedup merge of MCP client lists
- `mergeCommands` (sgA) - chunks.186.mjs:177 - Dedup merge of slash command lists
- `trackMcpIdeStatus` (fVq) - chunks.186.mjs:410 - IDE installation tracker hook
- `ElicitationDialog` (WWq) - chunks.188.mjs:1247 - MCP server input request renderer
- `onChangeAppStateHandler` (K11) - chunks.176.mjs:581 - App state → disk sync observer

---

## 1. MCP State Slice in REPL Component

### What it does

The main REPL component (in chunks.188.mjs) subscribes to the `mcp` slice of app state and makes it available to child components as props.

### State structure

```typescript
// mcp slice of app state
{
  clients: McpClient[],       // active server connections
  tools: McpTool[],           // all tools across all servers
  commands: SlashCommand[],   // MCP-contributed slash commands
  resources: Record<string, McpResource[]>  // resources by server name
}
```

### Selector usage

```javascript
const mcpState = useAppState(s => s.mcp);
// mcpState.clients, mcpState.tools, mcpState.commands, mcpState.resources
```

The selector uses reference equality — if `s.mcp` object reference hasn't changed, no re-render. This is why `onChangeAppStateHandler` (K11) uses reference inequality check before triggering disk writes.

---

## 2. Client Merging Hooks (chunks.186.mjs)

### mergeMcpClients (XVq) — chunks.186.mjs:163

**What it does:** Merges two lists of MCP clients — the `initialMcpClients` (passed as a prop from the startup configuration) and the `runtimeClients` (from app state, added dynamically during the session). Deduplicates by the `name` field.

**Algorithm:**

```javascript
// ============================================
// mergeMcpClients - Deduplicate-merge initial and runtime MCP client lists
// Location: chunks.186.mjs:163
// ============================================

// ORIGINAL (for source lookup):
const XVq = (A, q) => useMemo(() => {
  let K = new Map(A.map(Y => [Y.name, Y]));
  for (let Y of q) K.set(Y.name, Y);
  return [...K.values()];
}, [A, q]);

// READABLE (for understanding):
const mergeMcpClients = (initialClients, runtimeClients) => useMemo(() => {
  // Start with initial clients as the base
  const mergedMap = new Map(initialClients.map(client => [client.name, client]));

  // Runtime clients override initial clients with the same name
  // (runtime state is more up-to-date than startup config)
  for (const client of runtimeClients) {
    mergedMap.set(client.name, client);
  }

  return [...mergedMap.values()];
}, [initialClients, runtimeClients]);

// Mapping: XVq→mergeMcpClients, A→initialClients, q→runtimeClients, K→mergedMap, Y→client
```

**Why runtime overrides initial:** If the same server is configured at startup AND dynamically connected during the session, the runtime version reflects the actual current connection state (e.g., whether it's actually connected, what tools it currently exposes). Using a Map by `name` ensures O(1) dedup.

### mergeCommands (sgA) — chunks.186.mjs:177

**What it does:** Same pattern as `mergeMcpClients` but for slash commands. Merges built-in commands, plugin commands, and MCP-contributed commands. The `disableSlashCommands` feature gate is applied after merging.

**Command merge chain:**
```
builtIn → plugin commands → MCP commands
      ↓ (gate: disableSlashCommands removes some)
   activeCommands
```

The MCP commands come from MCP servers that export `prompts` (slash-command-like tool invocations).

### trackMcpIdeStatus (fVq) — chunks.186.mjs:410

**What it does:** A hook that watches the `mcpClients` list length and updates the IDE installation status flag when it changes. This enables the "IDE connected" UI indicator.

**How it works:**
1. Tracks `mcpClients.length` with `useEffect`
2. When the count changes and `ideFlag` is true:
   - If count > 0: marks IDE as "connected" (at least one MCP client active)
   - If count drops to 0: marks as "disconnected"
3. Used to show/hide the IDE connection badge in the status line

---

## 3. Tool Loading Pipeline (chunks.188.mjs:39-62)

### What it does

Before tools are available for the model, they go through a filtering and merging pipeline that applies permission context, capability flags, and initial tool overrides.

### Pipeline stages

```
toolPermissionContext (from app state)
    ↓
loadTools(permissionContext)    [tD function]
    ↓
filteredTools                  (permissions applied)
    ↓
mergeMcpClients(initialTools, filteredTools)
    ↓
activeTools                    (passed to query builder)
```

**Stage 1 — `loadTools(permissionContext)`:**
- Reads all registered tools (built-in + MCP)
- Filters by permission context (e.g., removes tools the user has disabled)
- Returns `filteredTools` array

**Stage 2 — merge with `initialTools`:**
- `initialTools` are passed as a prop from the startup configuration
- They may include custom tools or tool overrides from CLAUDE.md
- The merge preserves initialTools unless the runtime filteredTools has a newer version

**Stage 3 — active tools:**
- Final `activeTools` array is passed to the system prompt builder and the tool dispatch router

---

## 4. Modal Priority Stack (chunks.188.mjs:307-316)

### What it does

The REPL can show one of several modal dialogs at a time. The priority stack determines which modal takes precedence when multiple events are pending simultaneously.

### Priority order (highest → lowest)

```javascript
// ============================================
// Modal priority resolver - Pick the highest-priority pending modal
// Location: chunks.188.mjs:307-316
// ============================================

// ORIGINAL (for source lookup):
let modal = null;
if (sandboxPermissions[0]) modal = "sandbox-permission";
else if (pendingWorkerRequest[0]) modal = "tool-permission";
else if (workerSandboxQueue[0]) modal = "worker-sandbox-permission";
else if (elicitation.queue[0]) modal = "elicitation";

// READABLE (for understanding):
let activeModal = null;
if (sandboxPermissionQueue[0]) {
  activeModal = "sandbox-permission";       // 1st priority: macOS sandbox violations
} else if (pendingToolRequest[0]) {
  activeModal = "tool-permission";          // 2nd priority: tool approval dialogs
} else if (workerSandboxQueue[0]) {
  activeModal = "worker-sandbox-permission"; // 3rd priority: worker process sandboxing
} else if (elicitation.queue[0]) {
  activeModal = "elicitation";              // 4th priority: MCP server input requests
}

// Mapping: sandboxPermissions→sandboxPermissionQueue, pendingWorkerRequest→pendingToolRequest,
//          modal→activeModal
```

**Design rationale for elicitation being lowest priority:**
- Security decisions (sandbox, tool permissions) are blocking — the agent cannot proceed without user approval
- MCP elicitation is user-initiated data collection — it's still important, but doesn't block the security model
- If a tool permission AND an elicitation are pending simultaneously, the security dialog must appear first

**FIFO queue for elicitation:** `elicitation.queue` is an array processed front-to-back. If multiple MCP servers request input simultaneously, each gets its own dialog shown in order. This prevents dialog stacking while ensuring all requests are eventually fulfilled.

---

## 5. ElicitationDialog Component (WWq) — chunks.188.mjs:1247

### What it does

Renders the MCP server's input request as either a terminal form (for structured data) or a URL prompt (for OAuth/browser flows). Consumes the first item in `elicitation.queue`.

### How it works

**Two render modes (from `detectElicitationMode` - iaY):**

**Form mode** (`mode === "form"` or no mode specified):
- Receives a JSON Schema describing the required fields
- Renders schema properties as terminal form elements:
  - `type: "string"` → text input
  - `type: "boolean"` → toggle checkbox
  - `type: "string", enum: [...]` → select dropdown
  - `type: "array"` → multi-select list
- User fills out the form and presses Enter
- `applySchemaDefaults(nH6)` pre-populates fields with `default` values from the schema

**URL mode** (`mode === "url"`):
- Receives a URL to open in the browser
- Shows the URL to the user with instructions
- Waits for user to complete the external flow
- User signals completion; a `notifications/elicitation/complete` notification is sent back to the MCP server

**Response handling:**

```javascript
// ============================================
// ElicitationDialog.onResponse - Process user response and advance queue
// Location: chunks.188.mjs:1247-1290
// ============================================

// ORIGINAL (for source lookup):
function onResponse(action, content) {
  FA.respond({ action, content });
  elicitation.queue = elicitation.queue.slice(1);
}

// READABLE (for understanding):
function onResponse(action, content) {
  // action: "accept" | "decline" | "cancel"
  // content: filled form data or null for decline/cancel

  elicitationHandler.respond({ action, content });  // send to MCP server via protocol

  // Remove first item from queue (FIFO - show next pending request if any)
  elicitation.queue = elicitation.queue.slice(1);
}

// Mapping: FA→elicitationHandler, elicitation.queue.slice(1)→advance FIFO queue
```

**Three response actions:**
- `accept` + `content`: User filled the form and submitted
- `decline`: User explicitly declined to provide input (MCP server should handle gracefully)
- `cancel`: User dismissed without deciding (treated as decline by most servers)

---

## 6. App State → MCP Sync (K11 — onChangeAppStateHandler)

### What it does

An observer function registered on the app state store that watches for MCP state changes and persists them to disk whenever they occur. This keeps the session state file (read by `mcp-cli`) in sync with the live in-memory state.

### How it works

```javascript
// ============================================
// onChangeAppStateHandler - App state observer for MCP sync
// Location: chunks.176.mjs:581-620
// ============================================

// ORIGINAL (for source lookup):
function K11(newState, oldState) {
  if (!O$()) return;
  if (newState.mcp === oldState.mcp) return;
  let { clients, tools, resources } = newState.mcp;
  updateMcpSessionState(clients, tools, resources);
  if (isEndpointMode()) saveMcpEndpointConfig();
}

// READABLE (for understanding):
function onChangeAppStateHandler(newState, oldState) {
  // Guard 1: Only run if mcp-cli feature is enabled
  if (!isMcpCliEnabled()) return;

  // Guard 2: Reference equality check — only act if mcp state actually changed
  // This is critical for performance: setState() is called frequently,
  // and we don't want to write to disk on every unrelated state change
  if (newState.mcp === oldState.mcp) return;

  const { clients, tools, resources } = newState.mcp;

  // Write updated MCP state to ~/.claude/claude-code-mcp-cli/{sessionId}.json
  updateMcpSessionState(clients, tools, resources);  // [CJq]

  // If running as MCPContext endpoint, also save port/secret to config file
  if (isEndpointMode()) {
    saveMcpEndpointConfig();  // writes { port, secret } for child processes
  }
}

// Mapping: K11→onChangeAppStateHandler, O$→isMcpCliEnabled, newState.mcp→mcpState
```

**Performance design:** The reference equality check (`newState.mcp === oldState.mcp`) uses JavaScript object identity, not deep equality. Since the app state uses immutable update patterns, the `mcp` reference only changes when something in the MCP subtree actually changed. This means `onChangeAppStateHandler` calls `updateMcpSessionState` at most once per actual MCP state change event, not on every call to `setState()`.

### Session State File Schema

File path: `~/.claude/claude-code-mcp-cli/{sessionId}.json`

```json
{
  "clients": [
    {
      "name": "sqlite",
      "type": "stdio",
      "command": "uvx",
      "args": ["mcp-server-sqlite", "--db-path", "~/data.db"],
      "status": "connected"
    }
  ],
  "configs": {
    "sqlite": { "command": "uvx", "args": [...] }
  },
  "tools": [
    {
      "name": "mcp__sqlite__query",
      "serverName": "sqlite",
      "originalToolName": "query",
      "description": "Execute a SQL query",
      "inputSchema": { "type": "object", "properties": { "sql": { "type": "string" } } },
      "isMcp": true
    }
  ],
  "resources": {
    "sqlite": [
      { "uri": "sqlite:///schema", "name": "Database Schema", "mimeType": "text/plain" }
    ]
  },
  "normalizedNames": {
    "sqlite": "sqlite",
    "github": "GitHub"
  }
}
```

**normalizedNames field:** Maps lowercase server names to their original-case names. Used by `mcp-cli` to resolve `mcp-cli call github/search` → server name `"GitHub"`.

---

## 7. Endpoint Config File (MCPContext mode)

When MCPContext (ZQA) is running as a local HTTP bridge, it writes an additional file so that child processes know where to connect:

**File path:** `~/.claude/claude-code-mcp-cli/{sessionId}-endpoint.json`

```json
{
  "port": 54321,
  "secret": "a3f8bc92d1e4f7a0b5c6d2e8f9a1b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0"
}
```

The child `mcp-cli` process reads this file and constructs `callRemoteMcpEndpoint` requests to `http://127.0.0.1:{port}/mcp` with `Authorization: Bearer {secret}` headers, delegating all tool execution to the parent session's MCP connections.
