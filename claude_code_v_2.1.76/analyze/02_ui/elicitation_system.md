# Elicitation System

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `ElicitationRouter` (`ZIq`) - Routes elicitation events to form or URL component based on mode
- `ElicitationFormDialog` (`BWz`) - JSON Schema-based form UI for MCP server input requests
- `ElicitationUrlDialog` (`gWz`) - URL-opening dialog for MCP server URL elicitation
- `registerElicitationHandler` - MCP handler that queues elicitation requests into app state
- `getElicitationMode` - Determines elicitation mode ("url" or "form") from params
- `isElicitationEnabled` - Feature flag gate for MCP elicitation capability
- `getInputDialogType` (`ra6`) - REPL priority dispatcher that determines which dialog to show
- `handleCancel` (`TM`) - Cancel handler that skips cancellation when elicitation is active
- `isTextInputSchema` - Checks if a JSON Schema field is a text-input type (string/number/integer)
- `isEnumSchema` - Checks if a schema has enum/oneOf constraints (select dropdown)
- `isMultiSelectSchema` - Checks if a schema is an array with enum/anyOf items (checkbox list)
- `getEnumValues` - Extracts enum values from a oneOf/enum schema
- `getEnumLabel` - Gets the display label for an enum value
- `getMultiSelectValues` - Extracts values from array items with anyOf/enum
- `getMultiSelectLabel` - Gets the display label for a multi-select value
- `validateFieldValue` - Validates a string input against a Zod schema derived from JSON Schema
- `buildZodSchema` - Converts a JSON Schema property into a Zod validator
- `isDateTimeSchema` - Checks if a schema is a date or date-time format string
- `asyncDateValidation` - Performs async natural-language date parsing and validation
- `formatDateDisplay` - Formats a date/datetime value for display in the form
- `elicitInput` (Server method) - MCP server SDK method that sends elicitation/create to client
- `sendTerminalNotification` - Sends OS-level notification ("Claude Code needs your input")
- `setInputMode` - Sets the terminal input mode for the active dialog

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
    |                               |   (ZIq routes to BWz or gWz)        |
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
REPL (TUA) -- chunks.196.mjs
  |
  +-- getInputDialogType (ra6) -- Priority dispatcher
  |     Returns "elicitation" when queue[0] exists and animation allows
  |
  +-- ElicitationRouter (ZIq) -- chunks.190.mjs:1242
        |
        +-- [mode="form"] --> ElicitationFormDialog (BWz) -- chunks.190.mjs:1268
        |
        +-- [mode="url"]  --> ElicitationUrlDialog (gWz) -- chunks.190.mjs (referenced at line 1251)
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
// Location: chunks.196.mjs:387-404
// ============================================

// ORIGINAL (for source lookup):
function ra6() {
    if (lV6 || na6) return;
    if (W7) return "message-selector";
    if (y2) return;
    if (G7[0]) return "sandbox-permission";
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
    if (isSearchingInputHistory || fullScreenOverlay) return;
    if (isMessageSelectorVisible) return "message-selector";
    if (isPaused) return;
    if (sandboxPermissionQueue[0]) return "sandbox-permission";
    const canShowLowerPriority = !toolJSX || toolJSX.shouldContinueAnimation;
    if (canShowLowerPriority && toolUseConfirmQueue[0]) return "tool-permission";
    if (canShowLowerPriority && workerSandboxPermissions.queue[0]) return "worker-sandbox-permission";
    if (canShowLowerPriority && elicitationState.queue[0]) return "elicitation";
    if (canShowLowerPriority && showCostWarning) return "cost";
    if (canShowLowerPriority && showIdeOnboarding) return "ide-onboarding";
    if (canShowLowerPriority && lspRecommendation) return "lsp-recommendation";
    return;
}

// Mapping: E1→elicitationState, E1.queue[0]→first pending elicitation event
```

**Elicitation priority (5th):** Elicitation is below sandbox/tool permissions because it is non-security. It can wait until security-critical approvals are handled.

### Cancel Blocking

Elicitation is protected from the standard Escape/cancel handler:

```javascript
// ============================================
// handleCancel (TM) - Elicitation cancel protection
// Location: chunks.196.mjs:420-432
// ============================================

// ORIGINAL (for source lookup):
function TM() {
    if (K2 === "elicitation") return;  // NO-OP - elicitation blocks cancel
    // ... rest of cancel handling
}

// READABLE (for understanding):
function handleCancel() {
    if (focusedInputDialog === "elicitation") return;
    // ...
}
```

**Why block cancel:** An MCP server is blocked waiting on a Promise. If the terminal-level Escape handler dismissed the elicitation without sending a `{action: "cancel"}` response, the MCP server would hang indefinitely. The dialog's own Cancel button correctly sends `{action: "cancel"}` to resolve the Promise gracefully.

---

## 4. ElicitationRouter (ZIq)

The `ElicitationRouter` is the top-level elicitation UI component that determines which sub-component to render:

```javascript
// ============================================
// ElicitationRouter (ZIq) - Mode routing
// Location: chunks.190.mjs:1242-1266
// ============================================

// ORIGINAL (for source lookup):
function ZIq(A) {
    let q = A6(7),
        { event: K, onResponse: Y, onWaitingDismiss: z } = A;
    if (K.params.mode === "url") {
        return XA.default.createElement(gWz, {
            event: K,
            onResponse: Y,
            onWaitingDismiss: z
        });
    }
    return XA.default.createElement(BWz, {
        event: K,
        onResponse: Y
    });
}

// READABLE (for understanding):
function ElicitationRouter({ event, onResponse, onWaitingDismiss }) {
    if (event.params.mode === "url") {
        return <ElicitationUrlDialog event={event} onResponse={onResponse} onWaitingDismiss={onWaitingDismiss} />;
    }
    return <ElicitationFormDialog event={event} onResponse={onResponse} />;
}

// Mapping: ZIq→ElicitationRouter, gWz→ElicitationUrlDialog, BWz→ElicitationFormDialog
```

### Mode Detection (iaY)

```javascript
// READABLE (for understanding):
function getElicitationMode(params) {
    // URL mode: params.url is set (OAuth redirect, browser-based auth)
    if (params.url) return "url";
    // Form mode: default for all schema-based input
    return "form";
}
```

---

## 5. ElicitationFormDialog (BWz)

The form dialog renders JSON Schema-based forms in the terminal.

### Supported Field Types

| Schema Type | Rendered As |
|-------------|------------|
| `string` / `number` / `integer` (no enum) | Text input field |
| `string` / `number` with `enum` or `oneOf` | Select dropdown |
| `array` with `items.anyOf` or `items.enum` | Multi-select checkbox list |
| `boolean` | Toggle/checkbox |
| `string` with `format: "date"` or `format: "date-time"` | Date input with natural-language parsing |

### JSON Schema to Zod Validation

The `buildZodSchema` function converts a JSON Schema property to a Zod validator for runtime validation:

```javascript
// ============================================
// buildZodSchema - JSON Schema to Zod converter
// Location: chunks.182.mjs:100-157
// ============================================

// READABLE (for understanding):
function buildZodSchema(schemaProperty, isRequired) {
    let validator;

    if (isTextInputSchema(schemaProperty)) {
        // String/number/integer without enum
        if (schemaProperty.type === "number" || schemaProperty.type === "integer") {
            validator = z.coerce.number();
            if (schemaProperty.minimum !== undefined) validator = validator.min(schemaProperty.minimum);
            if (schemaProperty.maximum !== undefined) validator = validator.max(schemaProperty.maximum);
        } else {
            validator = z.string();
            if (schemaProperty.minLength !== undefined) validator = validator.min(schemaProperty.minLength);
            if (schemaProperty.maxLength !== undefined) validator = validator.max(schemaProperty.maxLength);
            if (schemaProperty.pattern) validator = validator.regex(new RegExp(schemaProperty.pattern));
        }
    } else if (isEnumSchema(schemaProperty)) {
        // Enum values (single select)
        const values = getEnumValues(schemaProperty);
        validator = z.enum(values);
    } else if (isMultiSelectSchema(schemaProperty)) {
        // Array of enum values (multi-select)
        const itemValues = getMultiSelectValues(schemaProperty);
        validator = z.array(z.enum(itemValues));
    } else {
        validator = z.any();
    }

    // Wrap optional fields
    if (!isRequired) {
        validator = validator.optional();
    }

    return validator;
}

// Mapping: buildZodSchema converts JSON Schema properties to Zod validators
```

### Field Rendering Decision Tree

```
For each property in JSON Schema:
    │
    ├── isTextInputSchema? → <TextInput> with Zod string/number validator
    │       (type: string/number/integer, no enum/oneOf)
    │
    ├── isEnumSchema? → <SelectInput> (dropdown)
    │       (has .enum[] or .oneOf[])
    │
    ├── isMultiSelectSchema? → <CheckboxList>
    │       (type: array with .items.anyOf[] or .items.enum[])
    │
    ├── isDateTimeSchema? → <DateInput> with asyncDateValidation
    │       (type: string, format: "date" or "date-time")
    │
    └── type: boolean → <Toggle>
```

### Natural Language Date Parsing (MWq)

For date fields, the system accepts natural language input ("next Tuesday", "3 days from now") and validates it asynchronously:

```javascript
// ============================================
// asyncDateValidation - Natural language date parsing
// Location: chunks.182.mjs:620-650
// ============================================

// READABLE (for understanding):
async function asyncDateValidation(inputString, schema) {
    // First: try direct ISO 8601 parse
    const directParse = Date.parse(inputString);
    if (!isNaN(directParse)) {
        return { valid: true, value: new Date(directParse) };
    }

    // Second: use NLP date parser (e.g., chrono-node)
    const nlpResult = await parseNaturalLanguageDate(inputString);
    if (nlpResult) {
        // Validate against schema constraints
        if (schema.minimum && nlpResult < new Date(schema.minimum)) {
            return { valid: false, error: `Date must be after ${schema.minimum}` };
        }
        return { valid: true, value: nlpResult };
    }

    return { valid: false, error: "Could not parse date" };
}

// Mapping: MWq→asyncDateValidation
```

---

## 6. Response Flow

When the user submits the form:

```javascript
// ============================================
// Response submission from REPL
// Location: chunks.188.mjs:1247-1260
// ============================================

// READABLE (for understanding):
<ElicitationRouter
    event={elicitationState.queue[0]}
    onResponse={(action, content) => {
        const currentEvent = elicitationState.queue[0];
        if (currentEvent) {
            // Remove from queue
            setAppState(state => ({
                ...state,
                elicitation: { queue: state.elicitation.queue.slice(1) }
            }));
            // Resolve the MCP server's Promise
            currentEvent.respond({ action, content });
        }
    }}
/>
```

**`action` values:**
- `"accept"` - User completed the form and submitted
- `"cancel"` - User pressed Cancel/Escape within the dialog
- `"decline"` - User explicitly declined (for confirmation-type prompts)

**`content`** - An object mapping field names to user-entered values (for form mode), or `undefined` (for URL/cancel actions).

---

## 7. OS Notification

When an elicitation request arrives while the terminal may not be focused, an OS-level notification is sent:

```javascript
// ============================================
// sendTerminalNotification - OS notification for elicitation
// Location: chunks.181.mjs (vc1)
// ============================================

// READABLE (for understanding):
function sendTerminalNotification(serverName) {
    sendOSNotification({
        title: "Claude Code needs your input",
        body: `${serverName} is requesting information`,
        sound: true
    });
}

// Mapping: vc1→sendTerminalNotification
```

This is called by `registerElicitationHandler` when the elicitation event is pushed to the queue, ensuring the user is alerted even if Claude Code is in the background.

---

## 8. Integration with MCP Transport

The `registerElicitationHandler` function (`RV6`) is installed on the MCP client connection at session start:

```javascript
// ============================================
// registerElicitationHandler - MCP elicitation handler installation
// Location: chunks.181.mjs (RV6)
// ============================================

// READABLE (for understanding):
function registerElicitationHandler(mcpClient, setAppState, serverName) {
    if (!isElicitationEnabled()) return;  // Feature flag gate

    mcpClient.setRequestHandler("elicitation/create", async (params, { signal }) => {
        return new Promise((resolve) => {
            // Push to UI queue
            setAppState(state => ({
                ...state,
                elicitation: {
                    queue: [...state.elicitation.queue, {
                        serverName,
                        params,
                        signal,
                        respond: resolve  // This resolves when UI responds
                    }]
                }
            }));

            // Send OS notification
            sendTerminalNotification(serverName);
        });
        // Promise blocks here until UI calls respond()
    });
}

// Mapping: RV6→registerElicitationHandler, xq1→isElicitationEnabled
```

**Key insight:** The MCP handler registers a Promise-returning handler. The Promise only resolves when the user completes or cancels the form. This means the MCP server's `elicitInput()` call is literally blocking while the user is interacting with the UI.
