# MCP UI Linkage & React State Integration

## Overview

The MCP system connects to Claude Code's React UI at several integration points: the state management layer (reading MCP data into component props), the modal priority system (rendering elicitation dialogs), and the app state observer (persisting MCP state changes to disk). This document covers those integration points.

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - MCP UI/State Sync section
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - UI Components

Key symbols in this document:
- `mergeMcpClients` (XVq) - chunks.178.mjs:446 - Dedup merge of MCP client lists
- `ElicitationDialog` (ZIq) - chunks.190.mjs:1242 - MCP server input request renderer
- `FormElicitationDialog` (BWz) - chunks.190.mjs:1268 - Form-mode elicitation renderer
- `UrlElicitationDialog` (gWz) - chunks.190.mjs (referenced) - URL-mode elicitation renderer
- `setupElicitationRequestHandler` (WT7) - chunks.58.mjs:3 - Elicitation request handler registration
- `detectElicitationMode` (jB3) - chunks.57.mjs:2919 - Elicitation mode detection

> **Note:** Previous documentation incorrectly mapped `WWq` to ElicitationDialog. Actual `WWq` in chunks.166.mjs:3188 is a StatsDialog component. The correct ElicitationDialog is `ZIq` in chunks.190.mjs:1242.
> **Note:** `K11` was incorrectly documented as `onChangeAppStateHandler`. Actual `K11` in chunks.10.mjs:508 is unrelated to MCP state sync.

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

### IDE Connection Status Tracking

**What it does:** The IDE connection status is tracked by watching the `mcpClients` list for a client named "ide". When present, the IDE is considered connected.

**How it works:**
1. The `getIdeConnectionStatus` hook (LV6 in chunks.190.mjs:2902) checks for an MCP client with `name === "ide"`
2. Returns `{ status: "connected" | "pending" | "disconnected" | null, ideName: string | null }`
3. Used by `IdeSelectionIndicator` (dIq) to show the IDE connection badge in the status line
4. Also used by `hasConnectedIde` (L$1 in chunks.65.mjs:1811) for boolean checks

> **Note:** Previous documentation incorrectly mapped `fVq` to `trackMcpIdeStatus`. No such function exists. IDE status tracking uses `getIdeConnectionStatus` (LV6) and `hasConnectedIde` (L$1).

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

### Modal State Machine

```
                    ┌─────────────────────────────────────┐
                    │           Modal States               │
                    ├─────────────────────────────────────┤
                    │                                     │
   sandbox-perm ───►│  [1] sandbox-permission             │
   queue[0]         │      macOS sandbox violation        │
                    │      User must Allow/Deny           │
                    │                                     │
   tool-request ───►│  [2] tool-permission                │
   queue[0]         │      Tool approval dialog           │
                    │      User must Accept/Reject        │
                    │                                     │
   worker-sandbox ─►│  [3] worker-sandbox-permission      │
   queue[0]         │      Worker process sandboxing      │
                    │                                     │
   elicitation ────►│  [4] elicitation                    │
   queue[0]         │      MCP server input request       │
                    │      Form or URL mode               │
                    │                                     │
                    └─────────────────────────────────────┘

Transitions:
- Any queue[0] becoming truthy → shows that modal
- Modal dismissed → check next highest priority queue
- All queues empty → no modal shown
```

---

## 5. ElicitationDialog Component (ZIq) — chunks.190.mjs:1242

### What it does

Renders the MCP server's input request as either a terminal form (for structured data) or a URL prompt (for OAuth/browser flows). Consumes the first item in `elicitation.queue`.

### How it works

**Two render modes (from `detectElicitationMode` - jB3):**

**Form mode** (`mode === "form"` or no mode specified):
- Receives a JSON Schema describing the required fields
- Renders via `FormElicitationDialog` (BWz) component
- Schema properties rendered as terminal form elements:
  - `type: "string"` → text input
  - `type: "boolean"` → toggle checkbox
  - `type: "string", enum: [...]` → select dropdown
  - `type: "array"` → multi-select list
- Default values from `default` field in schema are pre-populated

**URL mode** (`mode === "url"`):
- Renders via `UrlElicitationDialog` (gWz) component
- Receives a URL to open in the browser
- Shows the URL to the user with instructions
- Waits for user to complete the external flow
- User signals completion; a `notifications/elicitation/complete` notification is sent back to the MCP server

### Elicitation Request Schema

```javascript
// ============================================
// Elicitation request format from MCP server
// Location: chunks.57.mjs:2911 (detectElicitationMode)
// ============================================

interface ElicitationRequest {
    id: string;              // Unique request ID for correlation
    serverName: string;      // MCP server that made the request
    message: string;         // User-facing prompt text
    mode?: "form" | "url";   // Display mode (default: "form")
    schema?: JSONSchema;     // For form mode: field definitions
    url?: string;            // For url mode: external URL
}

interface JSONSchema {
    type: "object";
    properties: {
        [fieldName: string]: {
            type: "string" | "boolean" | "number" | "array";
            description?: string;
            enum?: string[];       // For dropdown selection
            default?: any;         // Pre-filled default value
            items?: JSONSchema;    // For array type
        }
    };
    required?: string[];
}
```

### Form Rendering Algorithm

```javascript
// ============================================
// FormElicitationDialog - Schema-driven form rendering
// Location: chunks.190.mjs:1268
// ============================================

// READABLE (for understanding):
function FormElicitationDialog({ request, onResponse }) {
    const [values, setValues] = useState(
        // Initialize with defaults from schema
        Object.fromEntries(
            Object.entries(request.schema.properties).map(([key, prop]) => [
                key,
                prop.default ?? (prop.type === 'boolean' ? false : '')
            ])
        )
    );

    // Render each property as appropriate input
    const fields = Object.entries(request.schema.properties).map(([name, prop]) => {
        if (prop.type === 'boolean') {
            return <ToggleField
                key={name}
                label={prop.description ?? name}
                value={values[name]}
                onChange={(v) => setValues(prev => ({ ...prev, [name]: v }))}
            />;
        }

        if (prop.enum) {
            return <SelectField
                key={name}
                label={prop.description ?? name}
                options={prop.enum}
                value={values[name]}
                onChange={(v) => setValues(prev => ({ ...prev, [name]: v }))}
            />;
        }

        if (prop.type === 'array') {
            return <MultiSelectField
                key={name}
                label={prop.description ?? name}
                options={prop.items?.enum ?? []}
                values={values[name]}
                onChange={(v) => setValues(prev => ({ ...prev, [name]: v }))}
            />;
        }

        // Default: text input
        return <TextField
            key={name}
            label={prop.description ?? name}
            value={values[name]}
            onChange={(v) => setValues(prev => ({ ...prev, [name]: v }))}
        />;
    });

    return (
        <Box flexDirection="column">
            <Text bold>{request.message}</Text>
            {fields}
            <Box marginTop={1}>
                <Button onPress={() => onResponse('accept', values)}>Submit</Button>
                <Button onPress={() => onResponse('decline', null)}>Decline</Button>
            </Box>
        </Box>
    );
}

// Mapping: BWz→FormElicitationDialog, gWz→UrlElicitationDialog
```

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

---

## 8. Elicitation Flow State Machine

### Complete Elicitation Lifecycle

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Elicitation Request Flow                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  MCP Server                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ Server needs user input                                              │    │
│  │ Calls: notifications/elicitation/request                            │    │
│  │ Params: { id, message, mode?, schema?/url? }                        │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                           │                                                  │
│                           ▼                                                  │
│  Transport Layer (SSE/WebSocket)                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ JSON-RPC notification received                                       │    │
│  │ Routed to setupElicitationRequestHandler (WT7)                      │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                           │                                                  │
│                           ▼                                                  │
│  Elicitation Handler (FA)                                                   │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ 1. Validate request format                                           │    │
│  │ 2. Detect mode: detectElicitationMode(jB3)                          │    │
│  │ 3. Add to queue: elicitation.queue.push(request)                    │    │
│  │ 4. Set responder: elicitation.respond = createResponder()           │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                           │                                                  │
│                           ▼                                                  │
│  UI Rendering (React)                                                       │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ Check modal priority stack:                                          │    │
│  │   if (sandboxPermQueue[0]) → show sandbox dialog                    │    │
│  │   else if (toolPermQueue[0]) → show tool permission                 │    │
│  │   else if (workerSandboxQueue[0]) → show worker sandbox             │    │
│  │   else if (elicitation.queue[0]) → show elicitation dialog         │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                           │                                                  │
│           ┌───────────────┴───────────────┐                                 │
│           │                               │                                  │
│           ▼                               ▼                                  │
│  ┌─────────────────────┐       ┌─────────────────────┐                     │
│  │ Form Mode           │       │ URL Mode            │                     │
│  │ (FormElicitation)   │       │ (UrlElicitation)    │                     │
│  │                     │       │                     │                     │
│  │ - Render form fields│       │ - Show URL to user  │                     │
│  │ - Validate input    │       │ - Open in browser   │                     │
│  │ - Submit/Decline    │       │ - Wait for callback │                     │
│  └─────────┬───────────┘       └─────────┬───────────┘                     │
│            │                             │                                   │
│            └──────────────┬──────────────┘                                 │
│                           │                                                  │
│                           ▼                                                  │
│  User Response                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ onResponse(action, content)                                          │    │
│  │                                                                       │    │
│  │ action: "accept" | "decline" | "cancel"                              │    │
│  │ content: form data (for accept) | null (for decline/cancel)         │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                           │                                                  │
│                           ▼                                                  │
│  Response to MCP Server                                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ elicitationHandler.respond({ action, content })                      │    │
│  │                                                                       │    │
│  │ Sends: notifications/elicitation/complete                           │    │
│  │ Params: { id, action, content }                                      │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                           │                                                  │
│                           ▼                                                  │
│  Queue Advance                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ elicitation.queue = elicitation.queue.slice(1)                      │    │
│  │ // If queue[0] exists, next elicitation shown automatically         │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### URL Mode Details

**Location:** `chunks.190.mjs` (UrlElicitationDialog component)

URL mode is used for OAuth flows and external authentication:

```javascript
// ============================================
// UrlElicitationDialog - Handle OAuth/browser-based elicitation
// Location: chunks.190.mjs
// ============================================

// READABLE (for understanding):
function UrlElicitationDialog({ request, onResponse }) {
    let [status, setStatus] = useState('pending');  // 'pending' | 'opened' | 'completed'
    let [callbackData, setCallbackData] = useState(null);

    // Open URL in browser
    async function openUrl() {
        setStatus('opened');
        await openInBrowser(request.url);

        // Poll for callback or wait for webhook
        // (implementation depends on OAuth flow type)
    }

    // User completed external flow
    function handleComplete(data) {
        setCallbackData(data);
        setStatus('completed');
        onResponse('accept', data);
    }

    // User cancelled
    function handleCancel() {
        onResponse('cancel', null);
    }

    return (
        <Box flexDirection="column">
            <Text bold>{request.message}</Text>
            <Text dimColor>URL: {request.url}</Text>

            {status === 'pending' && (
                <Button onPress={openUrl}>Open in Browser</Button>
            )}

            {status === 'opened' && (
                <>
                    <Text>Waiting for you to complete authentication...</Text>
                    <Spinner />
                    <Button onPress={handleCancel}>Cancel</Button>
                </>
            )}

            {status === 'completed' && (
                <Text color="green">✓ Authentication complete</Text>
            )}
        </Box>
    );
}
```

**URL Mode Use Cases:**
- OAuth 2.0 authorization code flow
- Device code flow (display code, user enters on another device)
- SAML SSO flows
- Magic link authentication

---

## 9. Hook Interception

### Elicitation Hook Events

The elicitation system can be intercepted by hooks:

```javascript
// ============================================
// Elicitation hook integration
// Location: chunks.57.mjs (setupElicitationRequestHandler)
// ============================================

// Hook event types for elicitation:
// - "elicitation_request": Before showing dialog to user
// - "elicitation_response": After user responds, before sending to server

// READABLE (for understanding):
async function setupElicitationRequestHandler(mcpClient, hookManager) {
    mcpClient.onNotification('notifications/elicitation/request', async (params) => {
        let request = {
            id: params.id,
            serverName: mcpClient.name,
            message: params.message,
            mode: params.mode,
            schema: params.schema,
            url: params.url
        };

        // Fire pre-elicitation hook
        if (hookManager) {
            let hookResult = await hookManager.fireHook('elicitation_request', {
                request,
                serverName: mcpClient.name
            });

            // Hook can modify or block the elicitation
            if (hookResult.blocked) {
                // Automatically decline
                elicitationHandler.respond({
                    id: params.id,
                    action: 'decline',
                    content: null
                });
                return;
            }

            // Hook can pre-fill values
            if (hookResult.prefilledValues) {
                request.prefilledValues = hookResult.prefilledValues;
            }
        }

        // Add to UI queue
        elicitation.queue.push(request);
    });
}
```

**Hook use cases:**
- Auto-approve certain elicitation types (e.g., known OAuth flows)
- Pre-fill form values from previous sessions
- Block elicitation from untrusted servers
- Log elicitation requests for audit

---

## 10. MCP Progress Notifications UI Integration

### What it does

When MCP tools report progress during execution (long-running operations), the progress notifications are displayed in the UI through the `onProgress` callback mechanism.

### Progress Notification Flow

```javascript
// ============================================
// MCP Progress Notification Handler
// Location: chunks.170.mjs (inside fetchMcpTools tool.call)
// ============================================

// Progress notification types:
// - type: "mcp_progress"
// - status: "started" | "completed" | "failed"
// - serverName: string
// - toolName: string
// - elapsedTimeMs?: number

interface McpProgressNotification {
    toolUseID: string;
    data: {
        type: "mcp_progress";
        status: "started" | "completed" | "failed";
        serverName: string;
        toolName: string;
        elapsedTimeMs?: number;
    }
}
```

### UI Display

Progress notifications are typically shown in:
1. **Tool result area** - While tool is executing
2. **Status line** - Brief indicator of active MCP operation
3. **Transcript** - Logged with the tool use result

---

## 11. MCP Connection Status UI Indicators

### MCP Client Status Display

The `mcpClients` array from app state is used to display connection status:

```javascript
// ============================================
// MCP Connection Status Display
// Location: chunks.190.mjs (getIdeConnectionStatus pattern)
// ============================================

function getMcpConnectionStatus(mcpClients) {
    let connected = mcpClients.filter(c => c.type === "connected");
    let pending = mcpClients.filter(c => c.type === "pending");
    let disconnected = mcpClients.filter(c => c.type === "disconnected");

    return {
        connectedCount: connected.length,
        pendingCount: pending.length,
        disconnectedCount: disconnected.length,
        servers: connected.map(c => c.name)
    };
}
```

### Status Bar Integration

When MCP servers are connected, the status bar can show:
- `MCP: 3 servers` - Count of connected servers
- Server names on hover or expand
- Warning indicator if any servers disconnected

---

## 12. MCP Tool Discovery in REPL

### Tool List Integration

MCP tools are merged with built-in tools in the REPL component:

```
Built-in Tools (Bash, Read, Edit, etc.)
    │
    ▼
mergeMcpClients(initialMcpClients, mcpClientsFromAppState)
    │
    ▼
loadTools(permissionContext) → filteredTools
    │
    ▼
Active Tool Set (built-in + MCP + custom)
    │
    ▼
Passed to query builder
```

### Tool Name Display

MCP tools appear with their prefixed names:
- `mcp__sqlite__query` → displayed as "sqlite: query"
- `mcp__github__search` → displayed as "github: search"

The `userFacingName()` method provides human-readable names:

```javascript
userFacingName() {
    let w = z.annotations?.title || z.name;
    return `${A.name} - ${w} (MCP)`
}
```

---

## 13. MCP Notification Handler (ZBq)

### What it does

Handles MCP server notifications and displays them in the UI.

### Location

**chunks.195.mjs** - MCP notification handler component

### Notification Types

| Notification Type | UI Action |
|-------------------|-----------|
| `resources/list_changed` | Refresh resource list |
| `tools/list_changed` | Refresh tool list |
| `elicitation/request` | Show elicitation dialog |
| `progress` | Update progress indicator |
| `log` | Add to transcript |

### Implementation

```javascript
// ============================================
// MCP Notification Handler
// Location: chunks.195.mjs
// ============================================

function useMcpNotifications(mcpClients, addNotification) {
    useEffect(() => {
        if (!mcpClients) return;

        for (let client of mcpClients) {
            if (client.type !== "connected") continue;

            // Register notification handlers
            client.onNotification('notifications/resources/list_changed', () => {
                addNotification({
                    type: "mcp_refresh",
                    message: `Resources updated for ${client.name}`
                });
            });

            client.onNotification('notifications/tools/list_changed', () => {
                addNotification({
                    type: "mcp_refresh",
                    message: `Tools updated for ${client.name}`
                });
            });
        }
    }, [mcpClients]);
}
```

---

## 14. Cross-Module UI Integration Summary

### MCP ↔ System Reminder UI Flow

```
MCP Server Connects
    │
    ├─► mcpClients state updated
    │
    ├─► Session file written (mcp-cli discovery)
    │
    └─► System prompt builder includes MCP instructions
            │
            └─► Model sees: "You have access to N MCP servers"
```

### MCP ↔ Permission UI Flow

```
MCP Tool Call
    │
    ├─► Permission check triggered
    │
    ├─► If needs approval:
    │       │
    │       └─► Permission dialog shown
    │               │
    │               ├─► Allow → Execute tool
    │               └─► Deny → Return error
    │
    └─► If auto-allowed → Execute directly
```

### MCP ↔ Elicitation UI Flow

```
MCP Server requests input
    │
    ├─► elicitation.queue.push(request)
    │
    ├─► Modal priority check:
    │       if (no higher priority dialogs)
    │           show ElicitationDialog
    │
    ├─► User responds
    │       │
    │       ├─► accept + content → Send to MCP server
    │       ├─► decline → Send decline to server
    │       └─► cancel → Send cancel to server
    │
    └─► elicitation.queue.shift() → Show next if any
```

---

## Related Documents

- [implementation.md](./implementation.md) - MCP implementation details
- [mcp_hub.md](./mcp_hub.md) - McpHub and MCPContext
- [elicitation_handler.md](./elicitation_handler.md) - Elicitation system
- [transport_layer.md](./transport_layer.md) - Transport implementations
- [cross_module_integration.md](./cross_module_integration.md) - Cross-module integration
- [../04_system_reminder/implementation_details.md](../04_system_reminder/implementation_details.md) - System reminder system
- [../22_ide_integration/ui_linkage.md](../22_ide_integration/ui_linkage.md) - IDE UI integration
