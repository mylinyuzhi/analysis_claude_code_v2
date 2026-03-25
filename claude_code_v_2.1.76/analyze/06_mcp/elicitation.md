# MCP Elicitation

## Overview

MCP Elicitation (introduced broadly in v2.1.76) allows MCP servers to request structured input from users mid-task. This feature enables interactive workflows where the MCP server needs to collect user-provided data — such as credentials, configuration values, or binary decisions — without breaking the conversation flow.

The elicitation system is distinct from the `AskUserQuestion` tool used by the agent itself: elicitation is **server-initiated** (the MCP server drives the request), whereas `AskUserQuestion` is **agent-initiated** (the LLM agent asks the user). Both routes ultimately render a dialog to the user, but the protocol and code paths differ.

## How It Works

### End-to-End Flow

1. An MCP server sends an `elicitation/create` JSON-RPC request to the connected client, including a JSON Schema that describes what fields to collect.
2. `setupElicitationRequestHandler` (RV6) in `chunks.156.mjs` intercepts the request and enqueues it into the application's elicitation queue.
3. The `ElicitationDialog` component (WWq) detects the non-empty queue and renders the appropriate UI:
   - **Form mode**: Renders a schema-driven terminal form with labeled fields
   - **URL mode**: Prompts the user to open a browser URL and complete an external flow
4. The user fills in the form and submits (or cancels/declines).
5. The `respond` callback is invoked with `{ action, content }`, resolving the pending Promise.
6. The resolved value is returned to the MCP server as the `elicitation/create` response.
7. If hooks are configured, the `Elicitation` hook fires before the dialog is shown, and the `ElicitationResult` hook fires after the user responds.

### Protocol Diagram

```
MCP Server                    Claude Code Client              User
    |                              |                            |
    |-- elicitation/create ------->|                            |
    |   {                          |                            |
    |     mode: "form"|"url",      |                            |
    |     requestedSchema: {...},  |                            |
    |     message: "...",          |                            |
    |     requestId: "..."         |                            |
    |   }                          |                            |
    |                              |--[Elicitation hook fires]  |
    |                              |--[Enqueue + Render Dialog]>|
    |                              |                            |
    |                              |<--[User submits form]------|
    |                              |                            |
    |                              |--[ElicitationResult hook]  |
    |<-- { action, content } ------|                            |
    |                              |                            |
```

## Request Schema

The `elicitation/create` request body follows this structure:

```typescript
interface ElicitationRequest {
  mode?: "form" | "url";          // defaults to "form"
  message: string;                // human-readable prompt to display
  requestedSchema?: JSONSchema;   // JSON Schema for form fields (form mode)
  url?: string;                   // URL to open (url mode)
  requestId: string;              // unique ID for this elicitation
  title?: string;                 // optional dialog title
  description?: string;           // optional longer description
}
```

## Response Schema

The server receives one of three responses:

```typescript
interface ElicitationResponse {
  action: "accept" | "cancel" | "decline";
  content?: Record<string, unknown>;  // present only when action === "accept"
}
```

| `action` | Meaning | `content` |
|----------|---------|-----------|
| `accept` | User submitted the form | Object matching the requestedSchema |
| `cancel` | Dialog dismissed (Escape key, abort signal) | Not present |
| `decline` | User explicitly declined | Not present |

MCP servers should treat `cancel` and `decline` differently: `cancel` suggests the user may not have seen the full request, while `decline` is an intentional refusal.

## Form Mode: JSON Schema Field Rendering

When the server sends `mode: "form"` with a `requestedSchema`, the dialog renders interactive form fields based on the schema's `properties`:

| JSON Schema type | Rendered as |
|-----------------|-------------|
| `string` | Text input field |
| `string` with `enum` | Select dropdown |
| `boolean` | Toggle checkbox |
| `number` / `integer` | Numeric text input with validation |
| `array` | Multi-select list (from `items.enum`) |
| `object` | Nested group of fields |

**Default values:** The `applySchemaDefaults` function (nH6) pre-populates fields with `default` values from the JSON Schema before the dialog is shown. Users can accept defaults by pressing Enter, making common-case elicitation very fast.

**Example schema:**
```json
{
  "type": "object",
  "properties": {
    "username": {
      "type": "string",
      "description": "GitHub username"
    },
    "scope": {
      "type": "string",
      "enum": ["read", "write", "admin"],
      "default": "read",
      "description": "Access level"
    },
    "remember": {
      "type": "boolean",
      "default": false,
      "description": "Save credentials for future use"
    }
  },
  "required": ["username"]
}
```

## URL Mode: Browser-Based Flows

When the server sends `mode: "url"`, the dialog shows the URL to the user and waits for them to complete the flow in a browser. This is designed for OAuth authorization flows:

1. Dialog displays the URL and a message like "Open this URL to authorize access"
2. User navigates to the URL in their browser
3. External service (e.g., GitHub OAuth) redirects to a callback URL known to the MCP server
4. MCP server receives the callback and calls `createElicitationCompletionNotifier()` to send `notifications/elicitation/complete` to the client
5. Client receives the notification, resolves the dialog, and returns `{ action: "accept" }` (with no content — the server already has the data from its callback)

## Hook Integration

### Elicitation Hook

The `Elicitation` hook fires when the MCP server sends an elicitation request, before the dialog is shown to the user.

**Hook payload:**
```json
{
  "event": "Elicitation",
  "serverName": "my-mcp-server",
  "params": {
    "mode": "form",
    "message": "Please provide your API credentials",
    "requestedSchema": { ... }
  }
}
```

Hook scripts can:
- Log elicitation requests for audit purposes
- Modify the request parameters (e.g., add context to the message)
- Cancel the elicitation by returning `{ action: "cancel" }` (to deny the server access)

### ElicitationResult Hook

The `ElicitationResult` hook fires after the user responds (accepts, cancels, or declines).

**Hook payload:**
```json
{
  "event": "ElicitationResult",
  "serverName": "my-mcp-server",
  "action": "accept",
  "content": { "username": "alice", "scope": "read" }
}
```

Hook scripts can:
- Log user responses for compliance
- Observe what data was provided to MCP servers

## Design Rationale

### Why Server-Initiated vs. Agent-Initiated

MCP servers need to collect user input at moments determined by the server's own workflow, not by the agent's conversation turn. For example:
- An OAuth server needs credentials before it can serve any tools
- A database tool may need a connection string that differs per session
- A configuration tool may need user choices before setting up the environment

If the agent had to ask for this information via `AskUserQuestion`, the server would need to coordinate with the agent through tool results — an awkward round-trip that also requires the agent to know what to ask. Elicitation keeps this logic in the server.

### Why Queue-Based (Not Blocking)

The elicitation handler uses a FIFO queue rather than blocking the MCP transport. This design:
- Allows multiple MCP servers to issue elicitation requests concurrently
- Preserves the ordering guarantee (first request shown first)
- Keeps the MCP protocol connection alive while waiting for user input (the server's request is pending, not dropped)
- Enables abort safety: if the connection closes, `{ action: "cancel" }` is returned automatically

### Why Feature-Flagged

The `tengu_mcp_elicitation` feature flag (defaulting to `false`) provides a clean kill-switch. When disabled:
- The client does not advertise elicitation capability in the `initialize` handshake
- MCP servers that attempt to send `elicitation/create` will receive an error because the client never claimed support
- No elicitation UI code paths execute

This protects users on older or restricted deployments from receiving unexpected server-initiated dialogs.

## Security Considerations

1. **Server name visible to user**: Every elicitation dialog shows which MCP server is requesting the input, so users can make informed trust decisions.

2. **No arbitrary code execution**: The server can only request data through schema-defined fields. It cannot inject executable content through the elicitation mechanism.

3. **URL display before open**: In URL mode, the full URL is shown to the user before any browser action. Users can abort without visiting the URL.

4. **Response validation**: For form mode, the server-side SDK validates `content` against `requestedSchema` before returning the response to the calling code. This catches malformed responses at the protocol level.

5. **Capability gating**: Servers cannot send elicitation requests without the client having first advertised the capability. Servers that attempt this receive a protocol error.

## Related Documents

- [elicitation_handler.md](./elicitation_handler.md) - Deep implementation analysis of the handler registration and queue mechanism
- [ui_linkage.md](./ui_linkage.md) - `ElicitationDialog` component and modal priority stack
- [mcp_implementation.md](./mcp_implementation.md) - MCP client architecture overview

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (MCP)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - UI Components

Key functions in this document:
- `setupElicitationRequestHandler` (WT7) - Handler registration in chunks.58.mjs:3
- `ElicitationDialog` (ZIq) - UI rendering in chunks.190.mjs:1242
- `FormElicitationDialog` (BWz) - Form mode renderer in chunks.190.mjs:1268
- `detectElicitationMode` (jB3) - Mode detection in chunks.57.mjs:2919
- `isElicitationEnabled` (KK6) - Feature flag check in chunks.57.mjs:2911
- `runElicitationHook` (sx6) - Elicitation hook execution in chunks.58.mjs:86
- `findElicitationQueueIndex` (JB3) - Queue lookup in chunks.57.mjs:2923
