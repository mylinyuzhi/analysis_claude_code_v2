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
- `setupElicitationRequestHandler` (WT7) - Registers the elicitation request handler on the MCP client (chunks.58.mjs:3)
- `detectElicitationMode` (jB3) - Determines if elicitation is "url" or "form" mode (chunks.57.mjs:2919)
- `isElicitationEnabled` (KK6) - Checks the feature flag for MCP elicitation (chunks.57.mjs:2911)
- `findElicitationQueueIndex` (JB3) - Finds elicitation by server name and ID (chunks.57.mjs:2923)
- `runElicitationHook` (sx6) - Executes the Elicitation hook (chunks.58.mjs:86)
- `McpClient` (rH6) - The MCP Client class that handles elicitation protocol on the client side
- `elicitInput` - Server-side method in chunks.11.mjs:1715

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
// detectElicitationMode - Determine elicitation mode from params
// Location: chunks.57.mjs:2919-2921
// ============================================

// ORIGINAL (for source lookup):
function jB3(A) {
    return A.mode === "url" ? "url" : "form"
}

// READABLE (for understanding):
function detectElicitationMode(params) {
    return params.mode === "url" ? "url" : "form";
}

// Mapping: jB3→detectElicitationMode, A→params
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
// Location: chunks.58.mjs:3-84 (validated)
// ============================================

// ORIGINAL (for source lookup):
function WT7(A, q, K) {
    try {
        A.setRequestHandler(yp, async (Y, z) => {
            n1(q, `Received elicitation request: ${B6(Y)}`);
            let _ = jB3(Y.params);
            d("tengu_mcp_elicitation_shown", { mode: _ });
            try {
                let w = await sx6(q, Y.params, z.signal);
                if (w) return n1(q, `Elicitation resolved by hook: ${B6(w)}`),
                    d("tengu_mcp_elicitation_response", { mode: _, action: w.action }), w;
                let O = _ === "url" && "elicitationId" in Y.params ? Y.params.elicitationId : void 0,
                    H = await new Promise((J) => {
                        let M = () => { J({ action: "cancel" }) };
                        if (z.signal.aborted) { M(); return }
                        K((X) => ({
                            ...X,
                            elicitation: {
                                queue: [...X.elicitation.queue, {
                                    serverName: q,
                                    requestId: z.requestId,
                                    params: Y.params,
                                    signal: z.signal,
                                    waitingState: O ? { actionLabel: "Skip confirmation" } : void 0,
                                    respond: (P) => {
                                        z.signal.removeEventListener("abort", M),
                                        d("tengu_mcp_elicitation_response", { mode: _, action: P.action }),
                                        J(P)
                                    }
                                }]
                            }
                        })),
                        z.signal.addEventListener("abort", M)
                    });
                return n1(q, `Elicitation response: ${B6(H)}`), await tx6(q, H, z.signal, _, O)
            } catch (w) {
                return EY(q, `Elicitation error: ${w}`), { action: "cancel" }
            }
        }),
        A.setNotificationHandler(My6, (Y) => {
            let { elicitationId: z } = Y.params;
            n1(q, `Received elicitation completion notification: ${z}`);
            let _ = !1;
            if (K((w) => {
                    let O = JB3(w.elicitation.queue, q, z);
                    if (O === -1) return w;
                    _ = !0;
                    let $ = [...w.elicitation.queue];
                    return $[O] = { ...$[O], completed: !0 }, { ...w, elicitation: { queue: $ } }
                }), !_) n1(q, `Ignoring completion notification for unknown elicitation: ${z}`)
        })
    } catch { return }
}

// READABLE (for understanding):
function setupElicitationRequestHandler(mcpClient, serverName, updateState) {
    try {
        mcpClient.setRequestHandler(ElicitationCreateSchema, async (request, context) => {
            logMcp(serverName, `Received elicitation request: ${JSON.stringify(request)}`);
            let mode = detectElicitationMode(request.params);
            trackEvent("tengu_mcp_elicitation_shown", { mode });

            try {
                // Check if hook wants to intercept/modify the elicitation
                let hookResult = await runElicitationHook(serverName, request.params, context.signal);
                if (hookResult) {
                    logMcp(serverName, `Elicitation resolved by hook: ${JSON.stringify(hookResult)}`);
                    trackEvent("tengu_mcp_elicitation_response", { mode, action: hookResult.action });
                    return hookResult;
                }

                let elicitationId = mode === "url" && "elicitationId" in request.params
                    ? request.params.elicitationId : undefined;

                let responsePromise = new Promise((resolve) => {
                    let onAbort = () => { resolve({ action: "cancel" }) };

                    if (context.signal.aborted) { onAbort(); return; }

                    updateState((state) => ({
                        ...state,
                        elicitation: {
                            queue: [...state.elicitation.queue, {
                                serverName,
                                requestId: context.requestId,
                                params: request.params,
                                signal: context.signal,
                                waitingState: elicitationId ? { actionLabel: "Skip confirmation" } : undefined,
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

                logMcp(serverName, `Elicitation response: ${JSON.stringify(responsePromise)}`);
                return await runElicitationResultHook(serverName, responsePromise, context.signal, mode, elicitationId);
            } catch (error) {
                logMcpError(serverName, `Elicitation error: ${error}`);
                return { action: "cancel" };
            }
        });

        // Handle completion notification for URL mode
        mcpClient.setNotificationHandler(ElicitationCompleteNotification, (notification) => {
            let { elicitationId } = notification.params;
            logMcp(serverName, `Received elicitation completion notification: ${elicitationId}`);
            let found = false;
            updateState((state) => {
                let index = findElicitationQueueIndex(state.elicitation.queue, serverName, elicitationId);
                if (index === -1) return state;
                found = true;
                let queue = [...state.elicitation.queue];
                queue[index] = { ...queue[index], completed: true };
                return { ...state, elicitation: { queue } };
            });
            if (!found) logMcp(serverName, `Ignoring completion notification for unknown elicitation: ${elicitationId}`);
        });
    } catch { return; }
}

// Mapping: WT7→setupElicitationRequestHandler, A→mcpClient, q→serverName, K→updateState,
//          Y→request, z→context, _→mode, w→hookResult, H→responsePromise, J→resolve, M→onAbort,
//          yp→ElicitationCreateSchema, jB3→detectElicitationMode, sx6→runElicitationHook,
//          tx6→runElicitationResultHook, JB3→findElicitationQueueIndex, n1→logMcp, d→trackEvent, EY→logMcpError
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
// Location: chunks.57.mjs:2911-2913 (validated)
// ============================================

// ORIGINAL (for source lookup):
function KK6() {
    return w8("tengu_mcp_elicitation", !1)
}

// READABLE (for understanding):
function isElicitationEnabled() {
    return getFeatureFlag("tengu_mcp_elicitation", false);
}

// Mapping: KK6→isElicitationEnabled, w8→getFeatureFlag
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

The elicitation protocol uses Zod schemas defined in `chunks.5.mjs`:

- `yp` - ElicitationCreateSchema: `{ method: "elicitation/create", params: Htq }`
- `Htq` - Union of form mode (`Otq`) and URL mode (`$tq`) params
- `Otq` - Form mode params (extends rE6 with mode: "form", message, requestedSchema)
- `$tq` - URL mode params: `{ mode: "url", message, elicitationId, url }`
- `Cn` - ElicitationResultSchema: `{ action: "accept"|"cancel"|"decline", content?: object }`
- `My6` - ElicitationCompleteNotification schema for URL mode completion

> **Note:** Previous documentation incorrectly mapped `b99`, `vq1`, `M01` to elicitation schemas. These are unrelated: `vq1` is a hash function in chunks.28.mjs:2117, `M01` is a git options object in chunks.92.mjs:393.

## Elicitation Response Actions

The user can respond to an elicitation with one of three actions:

| Action | Meaning | Content |
|--------|---------|---------|
| `accept` | User provided input | `content` field contains the form values |
| `cancel` | User cancelled the dialog (Escape, abort) | No content |
| `decline` | User explicitly declined to provide input | No content |

The distinction between `cancel` and `decline` is semantic: `cancel` typically means the user dismissed the dialog, while `decline` means they actively chose not to answer. MCP servers can use this distinction to decide whether to retry.

## UI Dialog Components (v2.1.76)

### Form-Mode Elicitation Dialog

**Location:** chunks.190.mjs:1330-1630

The form-mode elicitation dialog is rendered when `state.elicitation.queue[0]` exists and the mode is `"form"`. The dialog handles multiple JSON Schema field types with full keyboard navigation.

```javascript
// ============================================
// ElicitationDialog - Form-mode elicitation UI component
// Location: chunks.190.mjs:1330-1630 (excerpts)
// ============================================

// READABLE (for understanding):
function ElicitationDialog({ elicitation, onResponse }) {
    // State for form values, selected field index, and validation errors
    let [formValues, setFormValues] = useState({});
    let [selectedIndex, setSelectedIndex] = useState(0);
    let [validationErrors, setValidationErrors] = useState({});
    let [actionFocus, setActionFocus] = useState(null); // "accept" or "decline"

    // Keyboard navigation
    useInput((char, key) => {
        // Up/Down: navigate between fields
        if (key.upArrow || key.downArrow) {
            navigateFields(key.upArrow ? "up" : "down");
        }
        // Enter: submit or navigate
        if (key.return) {
            if (actionFocus === "accept") handleSubmit();
            else if (actionFocus === "decline") handleDecline();
            else navigateFields("down");
        }
        // Space: toggle boolean / select in dropdown
        if (char === " ") {
            if (currentField?.type === "boolean") toggleBoolean();
            else if (isEnumField) selectEnumValue();
        }
        // Escape: cancel
        if (key.escape) {
            onResponse({ action: "cancel" });
        }
    });

    // Schema field types supported:
    // - string (text input, with optional format validation)
    // - number/integer (numeric input with parsing)
    // - boolean (toggle: yes/no)
    // - enum (single-select dropdown)
    // - array with enum items (multi-select)
}
```

### Supported JSON Schema Field Types

| Type | UI Control | Keyboard Interaction |
|------|------------|---------------------|
| `string` | Text input | Type to enter, Backspace to clear |
| `string` + `enum` | Single-select | Up/Down to navigate, Space/Enter to select |
| `number`/`integer` | Text input | Type numbers, parsed on submit |
| `boolean` | Toggle | Space to toggle between true/false |
| `array` + `enum` | Multi-select | Up/Down to navigate, Space to toggle item |

### URL-Mode Elicitation Dialog

**Location:** chunks.190.mjs:1950-2000

The URL-mode dialog shows the external URL and provides a "Skip confirmation" button.

```javascript
// ============================================
// URLElicitationDialog - URL-mode elicitation UI component
// Location: chunks.190.mjs:1950-2000
// ============================================

// READABLE (for understanding):
function URLElicitationDialog({ elicitation, onResponse }) {
    let { params, waitingState } = elicitation;

    return (
        <Box flexDirection="column">
            <Text bold>{params.message}</Text>
            <Text dimColor>URL: {params.url}</Text>

            {/* URL display with copy hint */}
            <Box marginTop={1}>
                <Text dimColor>If your browser doesn't open automatically, copy this URL:</Text>
                <URLDisplay url={params.url} />
            </Box>

            {/* Action button */}
            <Box marginTop={1}>
                <Button onPress={() => onResponse({ action: waitingState?.actionLabel === "Skip" ? "accept" : "cancel" })}>
                    {waitingState?.actionLabel || "Cancel"}
                </Button>
            </Box>
        </Box>
    );
}
```

### Elicitation State Management

**State shape:**

```javascript
// In REPL state (chunks.148.mjs)
{
    elicitation: {
        queue: [
            {
                serverName: "my-mcp-server",
                requestId: "req-123",
                params: {
                    mode: "form",
                    message: "Please enter your API key",
                    requestedSchema: { type: "object", properties: { apiKey: { type: "string" } } }
                },
                signal: AbortSignal,
                waitingState: undefined, // or { actionLabel: "Skip confirmation" } for URL mode
                respond: (response) => void, // Resolves the pending Promise
                completed: false // Set when notifications/elicitation/complete received
            }
        ]
    }
}
```

### Dialog State Machine

```
                    ┌──────────────┐
                    │  Queue Empty │
                    └──────┬───────┘
                           │
         elicitation/create│
                           ▼
                    ┌──────────────┐
                    │ Dialog Shown │◄──────┐
                    └──────┬───────┘       │
                           │               │
           ┌───────────────┼───────────────┤
           │               │               │
           ▼               ▼               ▼
    ┌────────────┐  ┌────────────┐  ┌────────────┐
    │   Accept   │  │   Cancel   │  │   Decline  │
    └─────┬──────┘  └─────┬──────┘  └─────┬──────┘
          │               │               │
          │               │               │
          ▼               ▼               ▼
    ┌─────────────────────────────────────────────┐
    │ respond({ action, content? }) called        │
    │ Promise resolves, MCP response sent         │
    │ Queue shifts: queue.slice(1)                │
    └─────────────────────────────────────────────┘
```

---

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
