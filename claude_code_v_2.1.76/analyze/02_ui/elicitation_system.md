# Elicitation System

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `ElicitationRouter` (WWq) - Routes elicitation events to form or URL component based on mode
- `ElicitationFormDialog` (CDz) - JSON Schema-based form UI for MCP server input requests
- `ElicitationUrlDialog` (SDz) - URL-opening dialog for MCP server URL elicitation
- `registerElicitationHandler` (RV6) - MCP handler that queues elicitation requests into app state
- `getElicitationMode` (iaY) - Determines elicitation mode ("url" or "form") from params
- `isElicitationEnabled` (xq1) - Feature flag gate for MCP elicitation capability
- `getInputDialogType` (f11) - REPL priority dispatcher that determines which dialog to show
- `handleCancel` (N11) - Cancel handler that skips cancellation when elicitation is active
- `isTextInputSchema` (Ic1) - Checks if a JSON Schema field is a text-input type (string/number/integer)
- `isEnumSchema` (VF) - Checks if a schema has enum/oneOf constraints (select dropdown)
- `isMultiSelectSchema` (PY1) - Checks if a schema is an array with enum/anyOf items (checkbox list)
- `getEnumValues` (_11) - Extracts enum values from a oneOf/enum schema
- `getEnumLabel` (kf1) - Gets the display label for an enum value
- `getMultiSelectValues` (Cc1) - Extracts values from array items with anyOf/enum
- `getMultiSelectLabel` (Sc1) - Gets the display label for a multi-select value
- `validateFieldValue` (yc1) - Validates a string input against a Zod schema derived from JSON Schema
- `buildZodSchema` (RDz) - Converts a JSON Schema property into a Zod validator
- `isDateTimeSchema` (hc1) - Checks if a schema is a date or date-time format string
- `asyncDateValidation` (MWq) - Performs async natural-language date parsing and validation
- `formatDateDisplay` (yDz) - Formats a date/datetime value for display in the form
- `elicitInput` (Server method) - MCP server SDK method that sends elicitation/create to client
- `sendTerminalNotification` (vc1) - Sends OS-level notification ("Claude Code needs your input")
- `setInputMode` (DZ) - Sets the terminal input mode for the active dialog

---

## 1. Overview

The elicitation system enables MCP (Model Context Protocol) servers and tools to interactively ask the user questions during execution. Instead of requiring all parameters upfront, an MCP server can pause mid-operation and request user input through a schema-based form system rendered in the terminal UI.

The system supports two distinct modes:
1. **Form mode** -- A JSON Schema-driven form with text fields, selects, booleans, multi-select checkboxes, and validation
2. **URL mode** -- A simple dialog asking the user to open a URL in their browser

The architecture follows a **queue-based dispatch pattern**: an MCP server sends an `elicitation/create` request, which gets pushed onto a queue in the app state, the REPL's priority dispatcher picks it up, renders the appropriate UI component, and the user's response flows back to the MCP server via a Promise resolution.

### Why Elicitation Exists

MCP servers often need runtime information that cannot be predetermined -- OAuth tokens, user preferences, confirmation of destructive actions, selection from dynamically-generated options, etc. Without elicitation, servers would either need to fail and ask the agent to relay questions (lossy and slow) or require all config upfront (inflexible). Elicitation provides a direct server-to-user communication channel that preserves the interactive nature of the CLI.

---

## 2. Architecture

### Data Flow

```
MCP Server                    Claude Code Client                        Terminal UI
    |                               |                                       |
    |-- elicitation/create -------->|                                       |
    |                               |-- push to state.elicitation.queue --> |
    |                               |                                       |
    |                               |<-- getInputDialogType() returns      |
    |                               |    "elicitation"                      |
    |                               |                                       |
    |                               |-- render ElicitationRouter --------> |
    |                               |   (WWq routes to CDz or SDz)         |
    |                               |                                       |
    |                               |                     user fills form   |
    |                               |                     and accepts/      |
    |                               |                     declines          |
    |                               |                                       |
    |                               |<-- onResponse(action, content) ------|
    |                               |                                       |
    |                               |-- event.respond({action, content}) -->|
    |                               |-- queue.slice(1) removes from queue   |
    |                               |                                       |
    |<-- Promise resolves with  ----|                                       |
    |    {action, content}          |                                       |
```

### Component Hierarchy

```
REPL (TUA) -- chunks.188.mjs
  |
  +-- getInputDialogType (f11) -- Priority dispatcher
  |     Returns "elicitation" when queue[0] exists and animation allows
  |
  +-- ElicitationRouter (WWq) -- chunks.181.mjs:2553
        |
        +-- [mode="form"] --> ElicitationFormDialog (CDz) -- chunks.182.mjs:3
        |
        +-- [mode="url"]  --> ElicitationUrlDialog (SDz) -- chunks.182.mjs:697
```

### Key Design Decisions

**Queue-based dispatch over direct rendering:** The system does not render the elicitation dialog directly when the MCP request arrives. Instead, it pushes the request onto a queue and lets the REPL's priority dispatcher decide when to show it. This is critical because:
1. Multiple input dialogs compete for the terminal (tool permissions, sandbox permissions, cost warnings, etc.)
2. The animation system needs to complete before showing interactive dialogs
3. Only one dialog can be active at a time in the terminal

**Promise-based response bridging:** The MCP handler creates a Promise that resolves when the user responds. The `respond` callback is stored in the queue entry alongside the event data. This elegantly bridges the async MCP protocol with the React component lifecycle -- the MCP handler blocks on the Promise while the React component calls `respond()` when the user submits.

---

## 3. Queue Management

### State Structure

The elicitation state is initialized as part of the REPL's zustand store:

```javascript
// ============================================
// State initialization - Elicitation queue in app state
// Location: chunks.189.mjs:1627-1629 and chunks.151.mjs:471-473
// ============================================

// ORIGINAL (for source lookup):
elicitation: {
    queue: []
},

// READABLE (for understanding):
// The elicitation queue starts empty. Each entry contains:
// {
//   serverName: string,       -- Name of the MCP server requesting input
//   params: ElicitationParams, -- The full elicitation request (mode, message, schema/url)
//   signal: AbortSignal,      -- Abort signal from the MCP request context
//   respond: (result) => void -- Callback that resolves the MCP handler's Promise
// }
```

### Priority Dispatch

The REPL determines which interactive dialog to show using a priority function:

```javascript
// ============================================
// getInputDialogType - Priority dispatcher for interactive dialogs
// Location: chunks.188.mjs:304-317
// ============================================

// ORIGINAL (for source lookup):
function f11() {
    if (s_ || fz) return;
    if (o_) return "message-selector";
    if (W$) return;
    if (oq[0]) return "sandbox-permission";
    let k6 = !vK || vK.shouldContinueAnimation;
    if (k6 && F7[0]) return "tool-permission";
    if (k6 && Z1.queue[0]) return "worker-sandbox-permission";
    if (k6 && E1.queue[0]) return "elicitation";
    if (k6 && Yx) return "cost";
    if (k6 && k1) return "ide-onboarding";
    if (k6 && w6) return "lsp-recommendation";
    return
}

// READABLE (for understanding):
function getInputDialogType() {
    // If in full-screen mode or search mode, show nothing
    if (isFullScreenActive || searchOverlay) return;
    // Message selector has highest priority
    if (isMessageSelectorVisible) return "message-selector";
    // If streaming is paused, don't show any dialog
    if (isPaused) return;
    // Sandbox permission is next (blocks execution)
    if (sandboxPermissionQueue[0]) return "sandbox-permission";
    // Remaining dialogs require animation to be idle or continuing
    let canShowDialog = !animationState || animationState.shouldContinueAnimation;
    if (canShowDialog && toolPermissionQueue[0]) return "tool-permission";
    if (canShowDialog && workerSandboxPermissions.queue[0]) return "worker-sandbox-permission";
    if (canShowDialog && elicitationState.queue[0]) return "elicitation";
    if (canShowDialog && showCostThreshold) return "cost";
    if (canShowDialog && showIdeOnboarding) return "ide-onboarding";
    if (canShowDialog && lspRecommendation) return "lsp-recommendation";
    return;
}

// Mapping: f11->getInputDialogType, s_->isFullScreenActive, fz->searchOverlay,
// o_->isMessageSelectorVisible, W$->isPaused, oq->sandboxPermissionQueue,
// vK->animationState, F7->toolPermissionQueue, Z1->workerSandboxPermissions,
// E1->elicitationState, Yx->showCostThreshold, k1->showIdeOnboarding, w6->lspRecommendation
```

**Priority order analysis:**

The elicitation dialog sits at priority level 6 out of 8:

| Priority | Dialog | Rationale |
|----------|--------|-----------|
| 1 | message-selector | User explicitly triggered, must respond |
| 2 | (streaming paused) | Blocks all dialogs |
| 3 | sandbox-permission | Security-critical, always shown immediately |
| 4 | tool-permission | Security-critical, needs animation idle |
| 5 | worker-sandbox-permission | Security-critical for workers |
| **6** | **elicitation** | **MCP server input request** |
| 7 | cost | Informational threshold warning |
| 8 | ide-onboarding / lsp-recommendation | Optional onboarding |

**Key insight:** Elicitation is intentionally lower priority than security-related permissions. If a tool permission and an elicitation are both queued, the tool permission will be shown first. This ensures security decisions are never blocked or delayed by MCP server input requests.

### Cancel Protection

When the user presses the cancel key, the REPL's cancel handler explicitly skips cancellation if an elicitation dialog is active:

```javascript
// ============================================
// handleCancel - Cancel handler with elicitation protection
// Location: chunks.188.mjs:328-340
// ============================================

// ORIGINAL (for source lookup):
function N11() {
    if (XO === "elicitation") return;
    if (h(`[onCancel] focusedInputDialog=${XO} streamMode=${O7}`), I6.current = !1, YK(), XO === "tool-permission")
        F7[0]?.onAbort(), f8([]);
    else if ($O.isRemoteMode) $O.cancelRequest();
    else O3?.abort();
    // ...
}

// READABLE (for understanding):
function handleCancel() {
    // IMPORTANT: Do not cancel the session while elicitation is showing.
    // The user should use Escape within the elicitation dialog instead.
    if (focusedInputDialog === "elicitation") return;

    log(`[onCancel] focusedInputDialog=${focusedInputDialog} streamMode=${streamMode}`);
    isSubmitting.current = false;
    resetInput();

    if (focusedInputDialog === "tool-permission") {
        toolPermissionQueue[0]?.onAbort();
        setToolPermissionQueue([]);
    } else if (remoteSession.isRemoteMode) {
        remoteSession.cancelRequest();
    } else {
        abortController?.abort();
    }
    // ... cleanup tasks
}

// Mapping: N11->handleCancel, XO->focusedInputDialog, O7->streamMode,
// I6->isSubmitting, YK->resetInput, F7->toolPermissionQueue, f8->setToolPermissionQueue,
// $O->remoteSession, O3->abortController
```

**Why cancel is blocked during elicitation:** If the user could cancel the session while an elicitation form is displayed, the MCP server would receive an abort signal AND lose the ability to get user input. The elicitation dialog has its own Escape/cancel mechanism that sends a proper "cancel" response back to the server, allowing it to handle the cancellation gracefully.

---

## 4. MCP Integration

### Handler Registration

When a new MCP client is connected, the elicitation handler is registered on the client:

```javascript
// ============================================
// registerElicitationHandler - Sets up elicitation/create handling for MCP client
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
function registerElicitationHandler(mcpClient, serverName, setState) {
    mcpClient.setRequestHandler(ElicitationCreateRequest, async (request, context) => {
        logInfo(serverName, `Received elicitation request: ${stringify(request)}`);
        let mode = getElicitationMode(request.params);
        trackEvent("tengu_mcp_elicitation_shown", { mode });

        try {
            let responsePromise = new Promise((resolve) => {
                // Auto-cancel if the MCP request was already aborted
                let onAbort = () => { resolve({ action: "cancel" }) };
                if (context.signal.aborted) { onAbort(); return; }

                // Push the elicitation request onto the queue in app state
                setState((state) => ({
                    ...state,
                    elicitation: {
                        queue: [...state.elicitation.queue, {
                            serverName: serverName,
                            params: request.params,
                            signal: context.signal,
                            respond: (result) => {
                                // Clean up abort listener when user responds
                                context.signal.removeEventListener("abort", onAbort);
                                trackEvent("tengu_mcp_elicitation_response", {
                                    mode, action: result.action
                                });
                                resolve(result);
                            }
                        }]
                    }
                }));

                // If the MCP server aborts while waiting, auto-cancel
                context.signal.addEventListener("abort", onAbort);
            });

            return logInfo(serverName, `Elicitation response: ${stringify(responsePromise)}`),
                   responsePromise;
        } catch (error) {
            return logError(serverName, `Elicitation error: ${error}`),
                   { action: "cancel" };
        }
    });
}

// Mapping: RV6->registerElicitationHandler, A->mcpClient, q->serverName, K->setState,
// vq1->ElicitationCreateRequest, Y->request, z->context, w->mode, iaY->getElicitationMode,
// SA->logInfo, Kz->logError, Q1->stringify, c->trackEvent
```

### How it works (step by step):

1. **Request arrives**: The MCP server calls `elicitInput()` on its SDK, which sends `elicitation/create` to the client
2. **Handler fires**: The registered handler creates a new Promise that will hold the response
3. **Abort check**: If the request's abort signal is already triggered, immediately resolve with `{action: "cancel"}`
4. **Queue push**: The request metadata (serverName, params, signal) plus a `respond` callback are pushed onto `state.elicitation.queue` via `setState`
5. **Abort listener**: An abort listener is added so if the server disconnects or cancels while waiting, the Promise resolves with cancel
6. **Blocking wait**: The handler `return`s the Promise, which blocks the MCP protocol handler until the user responds
7. **User responds**: When the UI component calls `respond({action, content})`, the Promise resolves and flows back to the MCP server

### Feature Flag Gating

Elicitation capability is gated behind a feature flag:

```javascript
// ============================================
// isElicitationEnabled - Feature flag for MCP elicitation
// Location: chunks.80.mjs:950-952
// ============================================

// ORIGINAL (for source lookup):
function xq1() {
    return x8("tengu_mcp_elicitation", !1)
}

// READABLE (for understanding):
function isElicitationEnabled() {
    return getFeatureFlag("tengu_mcp_elicitation", false);
}

// Mapping: xq1->isElicitationEnabled, x8->getFeatureFlag
```

When the MCP client is created, the capabilities advertised to the server include elicitation only if the flag is enabled:

```javascript
// ============================================
// MCP client capability advertisement - Conditional elicitation support
// Location: chunks.145.mjs:2084-2092
// ============================================

// ORIGINAL (for source lookup):
{
    capabilities: {
        roots: {},
        ...xq1() ? {
            elicitation: {
                form: {},
                url: {}
            }
        } : {}
    }
}

// READABLE (for understanding):
{
    capabilities: {
        roots: {},
        ...(isElicitationEnabled() ? {
            elicitation: {
                form: {},   // Supports JSON Schema form-based elicitation
                url: {}     // Supports URL-opening elicitation
            }
        } : {})
    }
}

// Mapping: xq1->isElicitationEnabled
```

**Key insight:** The capability is split into `form` and `url` sub-capabilities. This allows the MCP protocol to evolve -- a client could support form elicitation but not URL elicitation, or vice versa. Currently Claude Code advertises both when the flag is on.

### MCP Server SDK Side

On the server SDK side (chunks.166.mjs), the `elicitInput` method on the MCP `Server` class validates capability support before sending the request:

```javascript
// ============================================
// elicitInput - MCP Server SDK method for requesting user input
// Location: chunks.166.mjs:711-742
// ============================================

// ORIGINAL (for source lookup):
async elicitInput(A, q) {
    var K, Y, z, w, H;
    switch ((K = A.mode) !== null && K !== void 0 ? K : "form") {
        case "url": {
            if (!((z = (Y = this._clientCapabilities) === null || ...)) throw Error("Client does not support url elicitation.");
            return this.request({ method: "elicitation/create", params: A }, M01, q)
        }
        case "form": {
            if (!((H = (w = this._clientCapabilities) === null || ...)) throw Error("Client does not support form elicitation.");
            let _ = await this.request({ method: "elicitation/create", params: A }, M01, q);
            if (_.action === "accept" && _.content && O.requestedSchema) try {
                let X = this._jsonSchemaValidator.getValidator(O.requestedSchema)(_.content);
                if (!X.valid) throw new Eq(VK.InvalidParams, `Elicitation response content does not match requested schema: ...`)
            } catch (J) { ... }
            return _
        }
    }
}

// READABLE (for understanding):
async elicitInput(params, options) {
    switch (params.mode ?? "form") {
        case "url": {
            // Verify client supports URL elicitation
            if (!this._clientCapabilities?.elicitation?.url)
                throw Error("Client does not support url elicitation.");
            return this.request({ method: "elicitation/create", params }, ElicitResultSchema, options);
        }
        case "form": {
            // Verify client supports form elicitation
            if (!this._clientCapabilities?.elicitation?.form)
                throw Error("Client does not support form elicitation.");
            const result = await this.request({ method: "elicitation/create", params }, ElicitResultSchema, options);

            // Server-side validation: verify the response content matches the requested schema
            if (result.action === "accept" && result.content && params.requestedSchema) {
                const validation = this._jsonSchemaValidator.getValidator(params.requestedSchema)(result.content);
                if (!validation.valid)
                    throw new McpError(ErrorCode.InvalidParams,
                        `Elicitation response content does not match requested schema: ${validation.errorMessage}`);
            }
            return result;
        }
    }
}

// Mapping: A->params, q->options, M01->ElicitResultSchema, Eq->McpError, VK->ErrorCode
```

**Important design decision:** The server SDK performs schema validation on the response *after* the client returns it. This means the client (Claude Code) does not need to enforce perfect schema compliance -- the server SDK acts as a safety net. However, the client still does its own validation for UX reasons (showing inline errors to the user).

---

## 5. UI Component: Form Mode (ElicitationFormDialog)

### Component Structure

The `ElicitationFormDialog` (CDz) is a substantial React component (~695 lines) that renders a JSON Schema-driven form in the terminal. It is the most complex of the two elicitation modes.

```javascript
// ============================================
// ElicitationFormDialog - JSON Schema form for MCP server input
// Location: chunks.182.mjs:3-695
// ============================================

// ORIGINAL (for source lookup):
function CDz({ event: A, onResponse: q }) {
    let { serverName: K, signal: Y } = A,
        z = A.params,
        { message: w, requestedSchema: H } = z,
        $ = Object.keys(H.properties).length > 0,
        [O, _] = P$.useState($ ? null : "accept"),
        [J, X] = P$.useState(() => { /* init form values from defaults */ }),
        [D, j] = P$.useState(() => { /* init validation errors */ });
    // ...
}

// READABLE (for understanding):
function ElicitationFormDialog({ event, onResponse }) {
    let { serverName, signal } = event;
    let params = event.params;
    let { message, requestedSchema } = params;

    // If there are properties to fill, start with no button focused;
    // if no properties (confirmation-only), start on "accept"
    let hasProperties = Object.keys(requestedSchema.properties).length > 0;
    let [focusedButton, setFocusedButton] = useState(hasProperties ? null : "accept");

    // Initialize form values from schema defaults
    let [formValues, setFormValues] = useState(() => {
        let initial = {};
        for (let [name, schema] of Object.entries(requestedSchema.properties)) {
            if (typeof schema === "object" && schema !== null && schema.default !== undefined) {
                initial[name] = schema.default;
            }
        }
        return initial;
    });

    // Initialize validation errors for fields with invalid defaults
    let [fieldErrors, setFieldErrors] = useState(() => {
        let errors = {};
        for (let [name, schema] of Object.entries(requestedSchema.properties)) {
            if (isTextInputSchema(schema) && schema?.default !== undefined) {
                let result = validateFieldValue(String(schema.default), schema);
                if (!result.isValid && result.error) errors[name] = result.error;
            }
        }
        return errors;
    });
    // ...
}

// Mapping: CDz->ElicitationFormDialog, A->event, q->onResponse, K->serverName,
// Y->signal, z->params, w->message, H->requestedSchema, $->hasProperties,
// O->focusedButton, _->setFocusedButton, J->formValues, X->setFormValues,
// D->fieldErrors, j->setFieldErrors, P$->React, Ic1->isTextInputSchema,
// yc1->validateFieldValue
```

### Field Type Detection and Rendering

The component determines how to render each field based on JSON Schema type analysis:

```
Schema Analysis Flow:
  |
  +-- PY1(schema) = true  --> Multi-select checkbox list (array with enum/anyOf items)
  |
  +-- VF(schema) = true   --> Single-select radio/dropdown (string with enum/oneOf)
  |
  +-- schema.type === "boolean" --> Toggle checkbox
  |
  +-- Ic1(schema) = true  --> Text input (string, number, integer)
  |
  +-- fallback            --> Plain text display
```

The type detection functions:

```javascript
// ============================================
// isMultiSelectSchema - Detects array-with-enum schema (checkbox list)
// Location: chunks.181.mjs:2388-2390
// ============================================

// ORIGINAL (for source lookup):
function PY1(A) {
    return A.type === "array" && "items" in A && typeof A.items === "object" &&
           A.items !== null && (("enum" in A.items) || ("anyOf" in A.items))
}

// READABLE (for understanding):
function isMultiSelectSchema(schema) {
    return schema.type === "array" &&
           "items" in schema &&
           typeof schema.items === "object" &&
           schema.items !== null &&
           (("enum" in schema.items) || ("anyOf" in schema.items));
}

// Mapping: PY1->isMultiSelectSchema, A->schema
```

```javascript
// ============================================
// isEnumSchema - Detects single-select enum schema (radio buttons)
// Location: chunks.181.mjs:2517-2519
// ============================================

// ORIGINAL (for source lookup):
VF = (A) => {
    return A.type === "string" && (("enum" in A) || ("oneOf" in A))
}

// READABLE (for understanding):
isEnumSchema = (schema) => {
    return schema.type === "string" && (("enum" in schema) || ("oneOf" in schema));
}

// Mapping: VF->isEnumSchema, A->schema
```

```javascript
// ============================================
// isTextInputSchema - Detects free-text input types
// Location: chunks.182.mjs:841
// ============================================

// ORIGINAL (for source lookup):
Ic1 = (A) => ["string", "number", "integer"].includes(A.type)

// READABLE (for understanding):
isTextInputSchema = (schema) => ["string", "number", "integer"].includes(schema.type);

// Mapping: Ic1->isTextInputSchema, A->schema
```

### Field Navigation

The form implements a wrap-around navigation system. Fields are numbered 0..N-1, and below them sit "Accept" (index N) and "Decline" (index N+1). Navigation wraps:

```javascript
// ============================================
// navigateFields - Wrap-around navigation between form fields and action buttons
// Location: chunks.182.mjs:109-121 (inside CDz)
// ============================================

// ORIGINAL (for source lookup):
function t(H1) {
    if (O1 && PY1(O1.schema)) q1(O1.name, O1.schema), b(void 0);
    else if (O1 && VF(O1.schema)) b(void 0);
    if (N1 && O1) {
        if (E1(O1.name, O1.schema, G), x.current !== void 0) clearTimeout(x.current), x.current = void 0;
        if (hc1(O1.schema) && G.trim() !== "" && D[O1.name]) a(O1.name, O1.schema, G)
    }
    let y1 = M.length + 2,
        B1 = P ?? (O === "accept" ? M.length : O === "decline" ? M.length + 1 : void 0),
        A6 = B1 !== void 0 ? (B1 + (H1 === "up" ? y1 - 1 : 1)) % y1 : 0;
    if (A6 < M.length) W(A6), _(null), j1(A6);
    else W(void 0), _(A6 === M.length ? "accept" : "decline"), f("")
}

// READABLE (for understanding):
function navigateFields(direction) {
    // Close any open dropdown/multi-select when leaving a field
    if (currentField && isMultiSelectSchema(currentField.schema))
        validateMultiSelect(currentField.name, currentField.schema), closeDropdown();
    else if (currentField && isEnumSchema(currentField.schema))
        closeDropdown();

    // Commit current text input value before leaving field
    if (isTextInput && currentField) {
        commitTextValue(currentField.name, currentField.schema, textInputValue);
        if (debounceTimer.current !== undefined)
            clearTimeout(debounceTimer.current), debounceTimer.current = undefined;
        // Trigger async date validation if needed
        if (isDateTimeSchema(currentField.schema) && textInputValue.trim() !== "" && fieldErrors[currentField.name])
            asyncDateValidation(currentField.name, currentField.schema, textInputValue);
    }

    // Calculate next position with wrap-around
    let totalItems = fields.length + 2;  // fields + Accept + Decline
    let currentIndex = focusedFieldIndex ??
        (focusedButton === "accept" ? fields.length : focusedButton === "decline" ? fields.length + 1 : undefined);
    let nextIndex = currentIndex !== undefined
        ? (currentIndex + (direction === "up" ? totalItems - 1 : 1)) % totalItems
        : 0;

    if (nextIndex < fields.length) {
        setFocusedFieldIndex(nextIndex);
        setFocusedButton(null);
        initTextValueForField(nextIndex);
    } else {
        setFocusedFieldIndex(undefined);
        setFocusedButton(nextIndex === fields.length ? "accept" : "decline");
        setTextInputValue("");
    }
}

// Mapping: t->navigateFields, H1->direction, O1->currentField, N1->isTextInput,
// M->fields, P->focusedFieldIndex, O->focusedButton, W->setFocusedFieldIndex,
// _->setFocusedButton, G->textInputValue, E1->commitTextValue, q1->validateMultiSelect,
// b->closeDropdown, hc1->isDateTimeSchema, a->asyncDateValidation, j1->initTextValueForField,
// D->fieldErrors, x->debounceTimer
```

**Key insight:** The navigation logic not only moves the cursor but also validates and commits the current field's value before leaving it. This ensures that partially-typed text is properly saved and validated when the user tabs away. For date/datetime fields specifically, leaving the field triggers async natural-language parsing (e.g., converting "next Monday" to "2026-02-16").

### Validation System

Validation is performed by converting JSON Schema into Zod schemas at runtime:

```javascript
// ============================================
// buildZodSchema - Converts JSON Schema property to Zod validator
// Location: chunks.181.mjs:2426-2486
// ============================================

// ORIGINAL (for source lookup):
function RDz(A) {
    if (VF(A)) {
        let [q, ...K] = _11(A);
        if (!q) return u.never();
        return u.enum([q, ...K])
    }
    if (A.type === "string") {
        let q = u.string();
        if (A.minLength !== void 0) q = q.min(A.minLength, { message: `Must be at least ${A.minLength} character${...}` });
        if (A.maxLength !== void 0) q = q.max(A.maxLength, { message: `Must be at most ${A.maxLength} character${...}` });
        switch (A.format) {
            case "email": q = q.email({ message: "Must be a valid email address, e.g. user@example.com" }); break;
            case "uri":   q = q.url({ message: "Must be a valid URI, e.g. https://example.com" }); break;
            case "date":  q = q.date("Must be a valid date, e.g. 2024-03-15, today, next Monday"); break;
            case "date-time": q = q.datetime({ offset: true, message: "Must be a valid date-time, e.g. 2024-03-15T14:30:00Z, tomorrow at 3pm" }); break;
        }
        return q
    }
    if (A.type === "number" || A.type === "integer") {
        let q = A.type === "integer" ? "an integer" : "a number",
            z = /* build range message */,
            w = u.coerce.number({ error: z });
        if (A.type === "integer") w = w.int({ message: z });
        if (A.minimum !== void 0) w = w.min(A.minimum, { message: z });
        if (A.maximum !== void 0) w = w.max(A.maximum, { message: z });
        return w
    }
    if (A.type === "boolean") return u.coerce.boolean();
    throw Error(`Unsupported schema: ${Q1(A)}`)
}

// READABLE (for understanding):
function buildZodSchema(jsonSchema) {
    // Enum types -> Zod enum
    if (isEnumSchema(jsonSchema)) {
        let [first, ...rest] = getEnumValues(jsonSchema);
        if (!first) return zod.never();
        return zod.enum([first, ...rest]);
    }

    // String types with format-specific validation
    if (jsonSchema.type === "string") {
        let validator = zod.string();
        if (jsonSchema.minLength !== undefined)
            validator = validator.min(jsonSchema.minLength, { message: `Must be at least ${jsonSchema.minLength} character(s)` });
        if (jsonSchema.maxLength !== undefined)
            validator = validator.max(jsonSchema.maxLength, { message: `Must be at most ${jsonSchema.maxLength} character(s)` });
        switch (jsonSchema.format) {
            case "email":     validator = validator.email(...); break;
            case "uri":       validator = validator.url(...); break;
            case "date":      validator = validator.date(...); break;
            case "date-time": validator = validator.datetime({ offset: true, ... }); break;
        }
        return validator;
    }

    // Numeric types with range validation
    if (jsonSchema.type === "number" || jsonSchema.type === "integer") {
        let validator = zod.coerce.number({ error: rangeMessage });
        if (jsonSchema.type === "integer") validator = validator.int(...);
        if (jsonSchema.minimum !== undefined) validator = validator.min(jsonSchema.minimum, ...);
        if (jsonSchema.maximum !== undefined) validator = validator.max(jsonSchema.maximum, ...);
        return validator;
    }

    // Boolean -> coerced boolean
    if (jsonSchema.type === "boolean") return zod.coerce.boolean();

    throw Error(`Unsupported schema: ${stringify(jsonSchema)}`);
}

// Mapping: RDz->buildZodSchema, A->jsonSchema, VF->isEnumSchema, _11->getEnumValues,
// u->zod, Q1->stringify
```

The actual validation call:

```javascript
// ============================================
// validateFieldValue - Validates user input against schema
// Location: chunks.181.mjs:2488-2498
// ============================================

// ORIGINAL (for source lookup):
function yc1(A, q) {
    let Y = RDz(q).safeParse(A);
    if (Y.success) return { value: Y.data, isValid: !0 };
    return { isValid: !1, error: Y.error.issues.map((z) => z.message).join("; ") }
}

// READABLE (for understanding):
function validateFieldValue(inputString, jsonSchema) {
    let result = buildZodSchema(jsonSchema).safeParse(inputString);
    if (result.success) return { value: result.data, isValid: true };
    return {
        isValid: false,
        error: result.error.issues.map(issue => issue.message).join("; ")
    };
}

// Mapping: yc1->validateFieldValue, A->inputString, q->jsonSchema, RDz->buildZodSchema
```

**Trade-off analysis:** Using Zod for validation (rather than a JSON Schema validator library directly) is an interesting choice. Zod provides better error messages and TypeScript integration, but requires the translation step in `buildZodSchema`. The translation covers the most common JSON Schema constructs (string constraints, numeric ranges, enums, formats) but does not support advanced features like `pattern`, `allOf`, `if/then`, or `$ref`. This is a deliberate trade-off: MCP elicitation forms are meant for simple user input, not complex document validation.

### Submission Flow

When the user navigates to "Accept" and presses Enter:

```javascript
// ============================================
// Submit handler - Accept validation and response
// Location: chunks.182.mjs:332-341 (inside key handler)
// ============================================

// ORIGINAL (for source lookup):
if (y1.return && O === "accept") {
    if (Y1() && Object.keys(D).length === 0) q("accept", J);
    else {
        let P6 = H.required || [];
        for (let q6 of P6)
            if (J[q6] === void 0) D1(q6, "This field is required");
        let V6 = M.findIndex((q6) => P6.includes(q6.name) && J[q6.name] === void 0 || D[q6.name] !== void 0);
        if (V6 !== -1) W(V6), _(null), j1(V6)
    }
    return
}

// READABLE (for understanding):
if (key.return && focusedButton === "accept") {
    // Check all required fields are filled AND no validation errors exist
    if (allRequiredFieldsFilled() && Object.keys(fieldErrors).length === 0) {
        onResponse("accept", formValues);
    } else {
        // Mark missing required fields with error
        let requiredFields = requestedSchema.required || [];
        for (let fieldName of requiredFields) {
            if (formValues[fieldName] === undefined)
                setFieldError(fieldName, "This field is required");
        }
        // Focus the first field that has an error or is missing
        let errorIndex = fields.findIndex(field =>
            (requiredFields.includes(field.name) && formValues[field.name] === undefined) ||
            fieldErrors[field.name] !== undefined
        );
        if (errorIndex !== -1) {
            setFocusedFieldIndex(errorIndex);
            setFocusedButton(null);
            initTextValueForField(errorIndex);
        }
    }
    return;
}

// Mapping: y1->key, O->focusedButton, Y1->allRequiredFieldsFilled, D->fieldErrors,
// J->formValues, q->onResponse, H->requestedSchema, M->fields, D1->setFieldError,
// W->setFocusedFieldIndex, _->setFocusedButton, j1->initTextValueForField
```

**Validation on submit strategy:**
1. First check: Are all required fields filled AND are there zero validation errors?
2. If yes: immediately call `onResponse("accept", formValues)` with the collected data
3. If no: iterate through required fields, add "This field is required" for missing ones
4. Auto-navigate: focus the first field with an error so the user can fix it

This "validate-on-submit with auto-focus" pattern is user-friendly in a terminal context because the user cannot see all errors at once (limited screen space), so jumping to the first error gives clear guidance.

### Scrollable Field List

For forms with many fields, the component implements virtual scrolling:

```javascript
// ============================================
// Field viewport calculation - Virtual scrolling for large forms
// Location: chunks.182.mjs:456-473 (inside CDz)
// ============================================

// ORIGINAL (for source lookup):
let _1 = 3,
    G1 = Math.max(2, Math.floor((s - 14) / _1)),
    L1 = P$.useMemo(() => {
        let H1 = M.length;
        if (H1 <= G1) return { start: 0, end: H1 };
        let y1 = P ?? H1 - 1,
            B1 = Math.max(0, y1 - Math.floor(G1 / 2)),
            A6 = Math.min(B1 + G1, H1);
        return B1 = Math.max(0, A6 - G1), { start: B1, end: A6 }
    }, [M.length, G1, P]);

// READABLE (for understanding):
let LINES_PER_FIELD = 3;  // Each field takes ~3 lines (label, value, error/spacer)
let maxVisibleFields = Math.max(2, Math.floor((terminalRows - 14) / LINES_PER_FIELD));

let viewport = useMemo(() => {
    let totalFields = fields.length;
    if (totalFields <= maxVisibleFields) return { start: 0, end: totalFields };

    // Center the focused field in the viewport
    let focusedIndex = focusedFieldIndex ?? totalFields - 1;
    let start = Math.max(0, focusedIndex - Math.floor(maxVisibleFields / 2));
    let end = Math.min(start + maxVisibleFields, totalFields);
    start = Math.max(0, end - maxVisibleFields);  // Adjust if near the end
    return { start, end };
}, [fields.length, maxVisibleFields, focusedFieldIndex]);

// Mapping: _1->LINES_PER_FIELD, G1->maxVisibleFields, s->terminalRows,
// L1->viewport, M->fields, P->focusedFieldIndex
```

**Key insight:** The viewport calculation reserves 14 lines for the dialog chrome (title, subtitle, Accept/Decline buttons, input guide, borders) and allocates 3 lines per field (label line, value line, error/spacer line). The focused field is kept roughly centered in the viewport. When scrolled, "N more above" / "N more below" indicators are shown.

---

## 6. UI Component: URL Mode (ElicitationUrlDialog)

The URL mode is significantly simpler -- it displays a URL with hostname highlighting and offers "Open in Browser" or "Decline":

```javascript
// ============================================
// ElicitationUrlDialog - URL-opening dialog for MCP servers
// Location: chunks.182.mjs:697-819
// ============================================

// ORIGINAL (for source lookup):
function SDz(A) {
    let q = e(49),
        { event: K, onResponse: Y } = A,
        { serverName: z, signal: w } = K,
        H = K.params,
        { message: $, url: O } = H,
        [_, J] = P$.useState("open");
    vc1("Claude Code needs your input", "elicitation_url_dialog"), DZ("elicitation-url");
    // ...
    if (j1.return)
        if (_ === "open") zY(O), Y("accept");
        else Y("decline")
}

// READABLE (for understanding):
function ElicitationUrlDialog(props) {
    let { event, onResponse } = props;
    let { serverName, signal } = event;
    let { message, url } = event.params;
    let [selectedAction, setSelectedAction] = useState("open");

    // Send OS notification and set input mode
    sendTerminalNotification("Claude Code needs your input", "elicitation_url_dialog");
    setInputMode("elicitation-url");

    // Parse URL for display: highlight the hostname
    let hostname = new URL(url).hostname;
    let prefix = url.slice(0, url.indexOf(hostname));   // e.g., "https://"
    let suffix = url.slice(url.indexOf(hostname) + hostname.length);  // e.g., "/path?query"

    // Key handler: left/right toggles, enter submits
    useInput((input, key) => {
        if (key.leftArrow || key.rightArrow) {
            setSelectedAction(toggle);  // Toggles between "open" and "decline"
            return;
        }
        if (key.return) {
            if (selectedAction === "open") {
                openInBrowser(url);  // Opens URL in default browser
                onResponse("accept");
            } else {
                onResponse("decline");
            }
        }
    });

    // Render: title, message, URL with bold hostname, Open/Decline buttons
    return <DialogBox
        title={`MCP server "${serverName}" wants to open a URL`}
        subtitle={message}
        color="permission"
        onCancel={() => onResponse("cancel")}
    >
        <Box flexDirection="column">
            <Box marginBottom={1}><Text>{prefix}<Text bold>{hostname}</Text>{suffix}</Text></Box>
            <Box>
                {/* Open in Browser / Decline buttons */}
            </Box>
        </Box>
    </DialogBox>;
}

// Mapping: SDz->ElicitationUrlDialog, A->props, K->event, Y->onResponse,
// z->serverName, w->signal, $->message, O->url, _->selectedAction,
// J->setSelectedAction, zY->openInBrowser, vc1->sendTerminalNotification,
// DZ->setInputMode
```

**Design decision:** The URL dialog highlights the hostname in bold. This is a security measure -- it draws the user's attention to which domain they are about to open, helping them detect potential phishing or unexpected redirects from MCP servers.

---

## 7. Router Component (ElicitationRouter)

The router component inspects the elicitation mode and delegates to the appropriate sub-component:

```javascript
// ============================================
// ElicitationRouter - Routes to form or URL elicitation component
// Location: chunks.181.mjs:2553-2575
// ============================================

// ORIGINAL (for source lookup):
function WWq(A) {
    let q = e(6),
        { event: K, onResponse: Y } = A;
    if (K.params.mode === "url") {
        let w;
        if (q[0] !== K || q[1] !== Y) w = j7.default.createElement(SDz, { event: K, onResponse: Y }),
            q[0] = K, q[1] = Y, q[2] = w;
        else w = q[2];
        return w
    }
    let z;
    if (q[3] !== K || q[4] !== Y) z = j7.default.createElement(CDz, { event: K, onResponse: Y }),
        q[3] = K, q[4] = Y, q[5] = z;
    else z = q[5];
    return z
}

// READABLE (for understanding):
function ElicitationRouter(props) {
    let cache = useCache(6);  // React Compiler memo cache
    let { event, onResponse } = props;

    if (event.params.mode === "url") {
        // Memoized: only re-create if event or onResponse changed
        if (cache[0] !== event || cache[1] !== onResponse) {
            cache[2] = <ElicitationUrlDialog event={event} onResponse={onResponse} />;
            cache[0] = event; cache[1] = onResponse;
        }
        return cache[2];
    }

    // Default: form mode (memoized)
    if (cache[3] !== event || cache[4] !== onResponse) {
        cache[5] = <ElicitationFormDialog event={event} onResponse={onResponse} />;
        cache[3] = event; cache[4] = onResponse;
    }
    return cache[5];
}

// Mapping: WWq->ElicitationRouter, A->props, K->event, Y->onResponse,
// SDz->ElicitationUrlDialog, CDz->ElicitationFormDialog, e->useCache
```

**Key insight:** The `e(6)` pattern is the React Compiler's memoization cache. Instead of using `useMemo` or `React.memo`, the compiler transforms components to use a flat array cache where it stores previous prop values and computed results. This is a compile-time optimization -- the original source likely used standard JSX without explicit memoization, and the React Compiler added these caches automatically.

---

## 8. REPL Integration

The REPL connects the elicitation queue to the router component:

```javascript
// ============================================
// REPL elicitation rendering - Queue consumption and response dispatch
// Location: chunks.188.mjs:1247-1260
// ============================================

// ORIGINAL (for source lookup):
XO === "elicitation" && V7.createElement(WWq, {
    event: E1.queue[0],
    onResponse: (k6, q8) => {
        let FA = E1.queue[0];
        if (FA) A1((Yq) => ({
            ...Yq,
            elicitation: {
                queue: Yq.elicitation.queue.slice(1)
            }
        })), FA.respond({
            action: k6,
            content: q8
        })
    }
})

// READABLE (for understanding):
focusedInputDialog === "elicitation" && createElement(ElicitationRouter, {
    event: elicitationState.queue[0],
    onResponse: (action, content) => {
        let currentEvent = elicitationState.queue[0];
        if (currentEvent) {
            // Remove the first item from the queue
            setState((state) => ({
                ...state,
                elicitation: {
                    queue: state.elicitation.queue.slice(1)
                }
            }));
            // Resolve the MCP handler's Promise with the user's response
            currentEvent.respond({
                action: action,     // "accept", "decline", or "cancel"
                content: content    // Form values (only for "accept" in form mode)
            });
        }
    }
});

// Mapping: XO->focusedInputDialog, WWq->ElicitationRouter, E1->elicitationState,
// V7->React, A1->setState, k6->action, q8->content, FA->currentEvent, Yq->state
```

**Response flow:**
1. The `ElicitationFormDialog` or `ElicitationUrlDialog` calls `onResponse(action, content)`
2. The REPL's `onResponse` handler:
   - Reads the current queue head (`queue[0]`)
   - Removes it from the queue via `queue.slice(1)`
   - Calls `currentEvent.respond({action, content})` which resolves the Promise in the MCP handler
3. If there is another elicitation in the queue, `getInputDialogType` will return "elicitation" again on the next render, and the next one will be shown

**Key insight:** The queue is consumed one at a time using FIFO ordering. Multiple MCP servers can queue elicitation requests simultaneously, and they will be presented to the user sequentially. The `respond` callback is unique per queue entry, so each MCP server gets back exactly its own response.

---

## 9. State Flow Summary

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        App State (Zustand)                              │
│                                                                         │
│  elicitation: {                                                         │
│    queue: [                                                             │
│      {                                                                  │
│        serverName: "my-mcp-server",                                     │
│        params: { mode: "form", message: "...", requestedSchema: {...} },│
│        signal: AbortSignal,                                             │
│        respond: (result) => void  // resolves the Promise               │
│      },                                                                 │
│      ... // additional queued requests                                  │
│    ]                                                                    │
│  }                                                                      │
└─────────┬───────────────────────────────────────────────────────────────┘
          │
          │ queue[0] consumed by
          ▼
┌─────────────────────────────────────────┐
│  getInputDialogType() (f11)             │
│  Returns "elicitation" when:            │
│  - No higher-priority dialog is active  │
│  - Animation is idle or continuing      │
│  - queue[0] exists                      │
└─────────┬───────────────────────────────┘
          │
          │ triggers rendering of
          ▼
┌─────────────────────────────────────────┐
│  ElicitationRouter (WWq)                │
│  Routes to CDz (form) or SDz (url)     │
└─────────┬───────────────────────────────┘
          │
          │ user interaction produces
          ▼
┌─────────────────────────────────────────┐
│  onResponse(action, content)            │
│  1. queue.slice(1) - remove from queue  │
│  2. event.respond({action, content})    │
│     - resolves MCP handler Promise      │
│     - MCP server receives response      │
└─────────────────────────────────────────┘
```

### Response Actions

| Action | Meaning | Content |
|--------|---------|---------|
| `"accept"` | User filled form and accepted | `formValues` object (form mode) or `undefined` (URL mode) |
| `"decline"` | User explicitly declined | `undefined` |
| `"cancel"` | User pressed Escape, or MCP server aborted | `undefined` |

---

## 10. Abort Signal Handling

The system carefully manages abort signals at multiple levels:

1. **MCP handler level** (chunks.156.mjs): If `context.signal` is already aborted when the handler fires, immediately resolve with cancel. Otherwise, add an abort listener that resolves with cancel if the server disconnects.

2. **Form component level** (chunks.182.mjs:30-42): The `ElicitationFormDialog` adds its own abort listener on the signal. If the signal fires while the form is displayed, it calls `onResponse("cancel")` to dismiss the form.

3. **URL component level** (chunks.182.mjs:715-722): Same pattern -- abort listener triggers cancel response.

4. **Cleanup**: When the user responds, the `respond` callback in the MCP handler removes the abort listener to prevent double-resolution. This is critical -- without cleanup, a late abort signal could try to resolve an already-resolved Promise.

**Why this matters:** MCP servers can disconnect at any time (crash, timeout, network issues). The abort signal cascade ensures that:
- The UI dialog is dismissed if the server goes away
- The REPL is not left in a stuck state waiting for user input on a dead request
- Resources (listeners, Promises) are properly cleaned up
