# MCP Elicitation Handler

## Overview

The MCP elicitation system allows MCP servers to request structured user input during tool execution. When an MCP server needs additional information from the user — such as OAuth credentials, configuration values, or decision confirmations — it sends an `elicitation/create` request through the MCP protocol. Claude Code then renders a form or URL-based dialog to the user and returns their response to the server. This bridges the gap between headless MCP server operations and interactive user workflows.

The system supports two modes: **form-based elicitation** (structured JSON Schema forms rendered in the terminal) and **URL-based elicitation** (redirecting the user to an external URL, such as an OAuth authorization page). Both modes are gated behind the `tengu_mcp_elicitation` feature flag.

In v2.1.76, the elicitation architecture was significantly expanded: hook integration was added for both request interception (`Elicitation` hook) and response observation (`ElicitationResult` hook), and the UI dialog was revised to support a wider range of JSON Schema field types.

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (MCP)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `setupElicitationRequestHandler` (RV6) - Registers the elicitation request handler on the MCP client (chunks.156.mjs)
- `detectElicitationMode` (iaY) - Determines if elicitation is "url" or "form" mode
- `isElicitationEnabled` (xq1) - Checks the feature flag for MCP elicitation
- `parseElicitationCapabilities` ($X9) - Determines which elicitation modes the client supports
- `applySchemaDefaults` (nH6) - Recursively applies default values from JSON Schema to response content
- `McpClient` (rH6) - The MCP Client class that handles elicitation protocol on the client side
- `McpServer` (in chunks.166.mjs) - The MCP Server class with `elicitInput` method

## Elicitation Protocol Architecture

### Two Elicitation Modes

**What it does:** The protocol supports two fundamentally different modes for requesting user input, each designed for different use cases.

**How it works:**

1. **Form mode** (`mode: "form"`): The MCP server sends a JSON Schema describing the desired input fields. Claude Code renders this schema as an interactive terminal form with text inputs, boolean toggles, select dropdowns, and array multi-selects. The user fills out the form, and the structured data is returned to the server.

2. **URL mode** (`mode: "url"`): The MCP server sends a URL that the user should visit (typically for OAuth authorization). The user is redirected to the URL, completes the flow there, and then sends a `notifications/elicitation/complete` notification back to the server when done.

**Why this approach:**
- Form mode handles simple data collection without leaving the terminal
- URL mode handles complex external flows (OAuth, web-based configuration) that cannot be replicated in a CLI
- The separation keeps the protocol clean — simple requests stay in-terminal, complex ones delegate to the browser

**Key insight:** The default mode when none is specified is `"form"`, not `"url"`. This is a conscious backward-compatibility decision, as form mode was the original implementation and URL mode was added later.

### Capability Negotiation

```javascript
// ============================================
// parseElicitationCapabilities - Determine supported elicitation modes from client capabilities
// Location: chunks.79.mjs:1528-1539
// ============================================

// ORIGINAL (for source lookup):
function $X9(A) {
    if (!A) return { supportsFormMode: !1, supportsUrlMode: !1 };
    let q = A.form !== void 0,
        K = A.url !== void 0;
    return { supportsFormMode: q || !q && !K, supportsUrlMode: K }
}

// READABLE (for understanding):
function parseElicitationCapabilities(elicitationCapability) {
    if (!elicitationCapability) return { supportsFormMode: false, supportsUrlMode: false };
    let hasFormCapability = elicitationCapability.form !== undefined;
    let hasUrlCapability = elicitationCapability.url !== undefined;
    return {
        supportsFormMode: hasFormCapability || (!hasFormCapability && !hasUrlCapability),
        supportsUrlMode: hasUrlCapability
    };
}

// Mapping: $X9→parseElicitationCapabilities, A→elicitationCapability, q→hasFormCapability, K→hasUrlCapability
```

**Capability fallback logic:**
The function implements a nuanced fallback: if a client declares _neither_ form nor URL capability, form mode is still considered supported. This means:
- `{ form: {} }` -> form=true, url=false
- `{ url: {} }` -> form=false, url=true
- `{ form: {}, url: {} }` -> form=true, url=true
- `{}` or `undefined` -> form=true, url=false (backward compatibility)

This ensures that older clients that advertise elicitation capability without specifying a mode still receive form-based requests.

## Client-Side Handler Registration

### setupElicitationRequestHandler (RV6)

```javascript
// ============================================
// setupElicitationRequestHandler - Register the handler that queues elicitation requests for UI rendering
// Location: chunks.156.mjs:1544-1586
// ============================================

// ORIGINAL (for source lookup):
function RV6(A, q, K) {
    A.setRequestHandler(vq1, async (Y, z) => {
        SA(q, `Received elicitation request: ${Q1(Y)}`);
        let w = iaY(Y.params);
        c("tengu_mcp_elicitation_shown", { mode: w });
        try {
            let H = new Promise(($) => {
                let O = () => { $({ action: "cancel" }) };
                if (z.signal.aborted) { O(); return }
                K((_) => ({
                    ..._,
                    elicitation: {
                        queue: [..._.elicitation.queue, {
                            serverName: q,
                            params: Y.params,
                            signal: z.signal,
                            respond: (J) => {
                                z.signal.removeEventListener("abort", O),
                                c("tengu_mcp_elicitation_response", { mode: w, action: J.action }),
                                $(J)
                            }
                        }]
                    }
                })),
                z.signal.addEventListener("abort", O)
            });
            return SA(q, `Elicitation response: ${Q1(H)}`), H
        } catch (H) {
            return Kz(q, `Elicitation error: ${H}`), { action: "cancel" }
        }
    })
}

// READABLE (for understanding):
function setupElicitationRequestHandler(mcpClient, serverName, updateState) {
    mcpClient.setRequestHandler(ElicitationCreateSchema, async (request, context) => {
        logMcp(serverName, `Received elicitation request: ${JSON.stringify(request)}`);
        let mode = detectElicitationMode(request.params);
        trackEvent("tengu_mcp_elicitation_shown", { mode });
        try {
            let responsePromise = new Promise((resolve) => {
                let onAbort = () => { resolve({ action: "cancel" }) };
                if (context.signal.aborted) { onAbort(); return }
                updateState((state) => ({
                    ...state,
                    elicitation: {
                        queue: [...state.elicitation.queue, {
                            serverName,
                            params: request.params,
                            signal: context.signal,
                            respond: (response) => {
                                context.signal.removeEventListener("abort", onAbort);
                                trackEvent("tengu_mcp_elicitation_response", {
                                    mode, action: response.action
                                });
                                resolve(response);
                            }
                        }]
                    }
                }));
                context.signal.addEventListener("abort", onAbort);
            });
            return logMcp(serverName, `Elicitation response: ${JSON.stringify(responsePromise)}`),
                   responsePromise;
        } catch (error) {
            logMcpError(serverName, `Elicitation error: ${error}`);
            return { action: "cancel" };
        }
    });
}

// Mapping: RV6→setupElicitationRequestHandler, A→mcpClient, q→serverName, K→updateState,
//          Y→request, z→context, w→mode, H→responsePromise, $→resolve, O→onAbort
```

### Queue-Based Elicitation Flow

**What it does:** Rather than blocking the MCP connection with a synchronous dialog, the handler enqueues the elicitation request into the application state and returns a Promise that resolves only when the user responds.

**How it works:**
1. MCP server sends `elicitation/create` request
2. Handler creates a Promise and pushes a queue entry into the React state
3. The UI detects `elicitation.queue.length > 0` and renders the appropriate dialog
4. When the user submits the form (accept) or cancels (cancel/decline), the `respond` callback is invoked
5. This resolves the Promise, which sends the response back to the MCP server
6. The queue entry is removed (first item popped via `slice(1)`)

**Why this approach:**
- **Non-blocking**: The MCP transport can continue processing other notifications while waiting for user input
- **Abort-safe**: If the MCP connection is cancelled (signal aborted), the handler automatically returns `{ action: "cancel" }` rather than leaving the Promise hanging
- **Queue ordering**: Multiple concurrent elicitation requests are serialized — the user sees them one at a time in FIFO order

**Key insight:** The abort handler is registered as a listener on `context.signal` and cleaned up when the user responds. This prevents a subtle memory leak where old abort listeners could accumulate. The error fallback always returns `{ action: "cancel" }` rather than throwing, ensuring the MCP server always gets a response even if the UI crashes.

## Hook Integration (v2.1.76)

### Elicitation Hook

In v2.1.76, two new hook events are fired around elicitation:

- **`Elicitation` hook**: Fires when the MCP server sends an elicitation request, before the dialog is shown to the user. Hook scripts can intercept and modify the request parameters (e.g., pre-populate fields, log the request).

- **`ElicitationResult` hook**: Fires after the user submits their response (or cancels). Hook scripts receive the action and content, enabling audit logging or post-processing.

**Design rationale:** These hooks maintain the same "before/after" pattern used by the tool execution hooks (`PreToolUse`/`PostToolUse`), making the hook system orthogonal and consistent across all user-facing interactions.

## Server-Side Elicitation API

### elicitInput Method

```javascript
// ============================================
// elicitInput - Server-side method to request user input via elicitation
// Location: chunks.166.mjs:711-741
// ============================================

// ORIGINAL (for source lookup):
async elicitInput(A, q) {
    var K, Y, z, w, H;
    switch ((K = A.mode) !== null && K !== void 0 ? K : "form") {
        case "url": {
            if (!((z = (Y = this._clientCapabilities)?.elicitation)?.url))
                throw Error("Client does not support url elicitation.");
            let O = A;
            return this.request({ method: "elicitation/create", params: O }, M01, q)
        }
        case "form": {
            if (!((H = (w = this._clientCapabilities)?.elicitation)?.form))
                throw Error("Client does not support form elicitation.");
            let O = A.mode === "form" ? A : { ...A, mode: "form" };
            let _ = await this.request({ method: "elicitation/create", params: O }, M01, q);
            if (_.action === "accept" && _.content && O.requestedSchema) try {
                let X = this._jsonSchemaValidator.getValidator(O.requestedSchema)(_.content);
                if (!X.valid) throw new Eq(VK.InvalidParams,
                    `Elicitation response content does not match requested schema: ${X.errorMessage}`)
            } catch (J) {
                if (J instanceof Eq) throw J;
                throw new Eq(VK.InternalError,
                    `Error validating elicitation response: ${J instanceof Error?J.message:String(J)}`)
            }
            return _
        }
    }
}

// READABLE (for understanding):
async elicitInput(params, options) {
    switch (params.mode ?? "form") {
        case "url": {
            if (!this._clientCapabilities?.elicitation?.url)
                throw Error("Client does not support url elicitation.");
            return this.request({ method: "elicitation/create", params }, ElicitationResultSchema, options);
        }
        case "form": {
            if (!this._clientCapabilities?.elicitation?.form)
                throw Error("Client does not support form elicitation.");
            let normalizedParams = params.mode === "form" ? params : { ...params, mode: "form" };
            let result = await this.request(
                { method: "elicitation/create", params: normalizedParams },
                ElicitationResultSchema, options
            );
            if (result.action === "accept" && result.content && normalizedParams.requestedSchema) {
                try {
                    let validation = this._jsonSchemaValidator
                        .getValidator(normalizedParams.requestedSchema)(result.content);
                    if (!validation.valid)
                        throw new McpError(ErrorCodes.InvalidParams,
                            `Elicitation response does not match requested schema: ${validation.errorMessage}`);
                } catch (error) {
                    if (error instanceof McpError) throw error;
                    throw new McpError(ErrorCodes.InternalError,
                        `Error validating elicitation response: ${error.message}`);
                }
            }
            return result;
        }
    }
}

// Mapping: A→params, q→options, K/Y/z/w/H→capability chain access, O→normalizedParams,
//          _→result, X→validation, J→error, M01→ElicitationResultSchema, Eq→McpError, VK→ErrorCodes
```

### Server-Side Schema Validation

**What it does:** When a server sends a form-mode elicitation with a `requestedSchema`, the server-side SDK automatically validates the user's response against that schema before returning it.

**How it works:**
1. Server calls `elicitInput({ mode: "form", requestedSchema: {...}, message: "..." })`
2. Client renders form, user fills it in, returns `{ action: "accept", content: {...} }`
3. Server-side SDK validates `content` against `requestedSchema` using `_jsonSchemaValidator`
4. If validation fails, a `McpError` with `InvalidParams` code is thrown
5. The server can handle this error and retry or fallback

**Why this approach:**
- Validates at the SDK level rather than requiring every MCP server to implement its own validation
- Uses the same JSON Schema that was sent to the client, ensuring consistency
- Only validates on `action: "accept"` — cancellation bypasses validation entirely

**Key insight:** The `applyDefaults` feature (controlled by `elicitation.form.applyDefaults` capability) fills in default values from the schema before validation. This means a user who leaves optional fields blank still gets valid data if the schema provides defaults.

## URL Elicitation and Completion Notification

### createElicitationCompletionNotifier

```javascript
// ============================================
// createElicitationCompletionNotifier - Create a callback for URL elicitation completion
// Location: chunks.166.mjs:743-752
// ============================================

// ORIGINAL (for source lookup):
createElicitationCompletionNotifier(A, q) {
    var K, Y;
    if (!((Y = (K = this._clientCapabilities)?.elicitation)?.url))
        throw Error("Client does not support URL elicitation (required for notifications/elicitation/complete)");
    return () => this.notification({
        method: "notifications/elicitation/complete",
        params: { elicitationId: A }
    }, q)
}

// READABLE (for understanding):
createElicitationCompletionNotifier(elicitationId, options) {
    if (!this._clientCapabilities?.elicitation?.url)
        throw Error("Client does not support URL elicitation");
    return () => this.notification({
        method: "notifications/elicitation/complete",
        params: { elicitationId }
    }, options);
}

// Mapping: A→elicitationId, q→options
```

**URL elicitation flow:**
1. Server sends `elicitation/create` with `mode: "url"` and a URL to visit
2. Client opens the URL in the browser and returns an `elicitationId`
3. Server creates a completion notifier via `createElicitationCompletionNotifier`
4. When the external flow completes (e.g., OAuth callback), the server calls the notifier
5. Client receives `notifications/elicitation/complete` and dismisses the URL dialog

This pattern is specifically designed for OAuth flows where the server needs to wait for an external callback before the elicitation is complete.

## Feature Flag and Capability Registration

### Capability Initialization

When creating the MCP client to connect to a server, Claude Code conditionally advertises elicitation capabilities:

```javascript
// ============================================
// MCP Client Capability Registration - Conditionally enable elicitation
// Location: chunks.145.mjs:2084-2092
// ============================================

// ORIGINAL (for source lookup):
capabilities: {
    roots: {},
    ...xq1() ? {
        elicitation: { form: {}, url: {} }
    } : {}
}

// READABLE (for understanding):
capabilities: {
    roots: {},
    ...(isElicitationEnabled() ? {
        elicitation: { form: {}, url: {} }
    } : {})
}

// Mapping: xq1→isElicitationEnabled
```

**Feature flag check:**

```javascript
// ============================================
// isElicitationEnabled - Check if MCP elicitation is enabled via feature flag
// Location: chunks.80.mjs:950-952
// ============================================

// ORIGINAL (for source lookup):
function xq1() { return x8("tengu_mcp_elicitation", !1) }

// READABLE (for understanding):
function isElicitationEnabled() { return getFeatureFlag("tengu_mcp_elicitation", false) }

// Mapping: xq1→isElicitationEnabled, x8→getFeatureFlag
```

**Key insight:** The elicitation feature is entirely opt-in via the `tengu_mcp_elicitation` feature flag with a default of `false`. When disabled, the client simply does not advertise the elicitation capability, so MCP servers cannot request user input through this mechanism. This provides a clean kill-switch for the feature.

## Security Considerations

### What MCP Servers Can and Cannot Elicit

1. **Form mode restrictions**: The JSON Schema defines what data can be requested. Claude Code renders only standard form controls (text, number, boolean, select, multi-select). There is no mechanism for servers to execute arbitrary code via elicitation.

2. **URL mode restrictions**: The server provides a URL, but Claude Code only opens it in the user's default browser. The URL is displayed to the user, who can choose not to visit it.

3. **User consent**: Every elicitation request pauses the conversation and requires explicit user action (submit or cancel). The user always sees the server name requesting the input.

4. **Abort safety**: If the MCP connection is terminated while an elicitation is pending, the system automatically returns `{ action: "cancel" }`, preventing servers from holding the conversation hostage.

5. **Capability-gated**: Servers cannot send elicitation requests unless the client has advertised the capability. The capability assertion throws an error if a server tries to elicit without permission.

6. **Schema validation**: For form mode, responses are validated against the `requestedSchema` on the server side, preventing malformed data from reaching the server's business logic.

### Elicitation Schema (Zod Definitions)

The elicitation protocol uses Zod schemas defined in `chunks.76.mjs`:

- `b99` - Elicitation capability schema: `{ form?: {}, url?: {} }`
- `vq1` - Elicitation create request schema (with `mode`, `requestedSchema`, `message` fields)
- `M01` - Elicitation result schema: `{ action: "accept"|"cancel"|"decline", content?: object }`
- `elicitationId` - String identifier used for URL elicitation completion tracking

## Elicitation Response Actions

The user can respond to an elicitation with one of three actions:

| Action | Meaning | Content |
|--------|---------|---------|
| `accept` | User provided input | `content` field contains the form values |
| `cancel` | User cancelled the dialog (Escape, abort) | No content |
| `decline` | User explicitly declined to provide input | No content |

The distinction between `cancel` and `decline` is semantic: `cancel` typically means the user dismissed the dialog, while `decline` means they actively chose not to answer. MCP servers can use this distinction to decide whether to retry.

## Data Flow Diagram

```
MCP Server                    Claude Code Client              User
    |                              |                            |
    |-- elicitation/create ------->|                            |
    |   { mode, schema, message }  |                            |
    |                              |-- Queue elicitation ------->|
    |                              |   (Elicitation hook fires)  |
    |                              |   (render form/open URL)    |
    |                              |                            |
    |                              |<-- User response ----------|
    |                              |   { action, content }      |
    |                              |   (ElicitationResult hook) |
    |<-- ElicitationResult --------|                            |
    |   { action, content }        |                            |
    |                              |                            |
    | (for URL mode only)          |                            |
    |-- notifications/elicitation/ |                            |
    |   complete { elicitationId } |                            |
```
