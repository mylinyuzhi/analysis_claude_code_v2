# MCP UI Components - Complete Documentation

> **Version**: Claude Code v2.1.76
> **Last Updated**: 2026-03-27
> **Status**: ✅ Source-level documentation with ORIGINAL/READABLE code

---

## Overview

This document provides comprehensive documentation of all UI components involved in the MCP (Model Context Protocol) system, including server status display, elicitation dialogs, and connection management UI.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (MCP Protocol section)

Key functions in this document:
- `setupElicitationRequestHandler` (WT7) - Elicitation handler - chunks.58.mjs:3
- `ElicitationDialog` (ZIq) - Main dialog - chunks.190.mjs:1242
- `FormElicitationDialog` (BWz) - Form mode - chunks.190.mjs:1268

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                     MCP UI COMPONENT HIERARCHY                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                     REPL Component                            │    │
│  │  ├─ Sidebar                                                   │    │
│  │  │   └─ McpServerStatusList                                   │    │
│  │  │       ├─ McpServerItem (per server)                        │    │
│  │  │       │   ├─ ConnectionIndicator (connected/disconnected) │    │
│  │  │       │   ├─ ServerName                                    │    │
│  │  │       │   └─ ToolCount badge                               │    │
│  │  │       └─ AddServerButton                                   │    │
│  │  │                                                            │    │
│  │  └─ Modal Stack                                               │    │
│  │      ├─ ElicitationDialog (priority 4 - lowest)              │    │
│  │      │   ├─ FormElicitationDialog                             │    │
│  │      │   │   ├─ FormTitle                                     │    │
│  │      │   │   ├─ FormFields (from JSON schema)                 │    │
│  │      │   │   └─ FormActions (Submit/Cancel)                   │    │
│  │      │   └─ UrlElicitationDialog                              │    │
│  │      │       ├─ UrlDisplay                                    │    │
│  │      │       ├─ OpenButton                                    │    │
│  │      │       └─ StatusIndicator                               │    │
│  │      └─ McpAuthDialog                                         │    │
│  │          ├─ AuthInstructions                                  │    │
│  │          └─ AuthStatus                                        │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                       │
│  Modal Priority (highest → lowest):                                  │
│  1. sandbox-permission                                               │
│  2. tool-permission                                                  │
│  3. worker-sandbox-permission                                        │
│  4. elicitation (LOWEST)                                             │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 1. Elicitation System

### What is Elicitation?

Elicitation allows MCP servers to request user input during tool execution. This enables:
- Authentication flows (OAuth)
- User confirmation dialogs
- Form-based data collection
- URL-based external flows

### Elicitation Modes

| Mode | Description | Use Case |
|------|-------------|----------|
| `form` | Structured UI dialog with JSON schema | Data collection, confirmations |
| `url` | External URL for OAuth/external flows | Authentication, external processes |

### Elicitation Priority

Elicitation dialogs have the **lowest priority** in the modal stack (priority 4), meaning they will only appear when no other modal (sandbox permission, tool permission, worker sandbox) is pending.

---

## 2. Elicitation Request Handler

### setupElicitationRequestHandler (WT7)

**What it does:**
Sets up the handler for MCP server elicitation requests. When an MCP server requests user input, this handler processes the request and queues it for UI display.

**How it works:**
1. Listen for `elicitation/create` requests from MCP servers
2. Validate the request schema
3. Determine elicitation mode (form or URL)
4. Queue the request for UI processing
5. Wait for user response
6. Send response back to MCP server

```javascript
// ============================================
// setupElicitationRequestHandler - Handle MCP elicitation requests
// Location: chunks.58.mjs:3-85
// ============================================

// ORIGINAL (for source lookup):
async function WT7(A, q, K) {
    let Y = q.setRequestHandler(yp, async (z) => {
        let _ = z.params;
        if (sx6("Elicitation", {
                mcpServerName: A,
                elicitationParams: _
            })) {
            let O = await tx6("ElicitationResult", {
                mcpServerName: A,
                elicitationParams: _
            });
            return O ?? {
                action: "cancel"
            }
        }
        let w = KK6();
        if (!w) return {
            action: "cancel"
        };
        let O = jb3(_);
        n1(A, `Elicitation request received, mode=${O}`);
        let $ = jB3(K.queue, A, _.id);
        if ($ !== -1) {
            let J = K.queue[$];
            return J.response ?? {
                action: "cancel"
            }
        }
        let H = {
            serverName: A,
            requestId: _.id,
            params: _,
            mode: O,
            response: void 0,
            resolve: void 0,
            reject: void 0
        };
        K.queue.push(H);
        let j = new Promise((J, M) => {
            H.resolve = J, H.reject = M
        });
        return await j
    })
}

// READABLE (for understanding):
async function setupElicitationRequestHandler(serverName, client, elicitationState) {
    // Register handler for elicitation/create requests
    client.setRequestHandler(ElicitationCreateSchema, async (request) => {
        const params = request.params;

        // Run Elicitation hook if configured
        if (runElicitationHook("Elicitation", {
            mcpServerName: serverName,
            elicitationParams: params
        })) {
            // Hook provided a response
            const hookResult = await runElicitationResultHook("ElicitationResult", {
                mcpServerName: serverName,
                elicitationParams: params
            });
            return hookResult ?? { action: "cancel" };
        }

        // Check if elicitation is enabled
        const isEnabled = isElicitationEnabled();
        if (!isEnabled) {
            return { action: "cancel" };
        }

        // Detect elicitation mode
        const mode = detectElicitationMode(params);
        logInfo(serverName, `Elicitation request received, mode=${mode}`);

        // Check for duplicate request (already in queue)
        const existingIndex = findElicitationQueueIndex(elicitationState.queue, serverName, params.id);
        if (existingIndex !== -1) {
            const existing = elicitationState.queue[existingIndex];
            return existing.response ?? { action: "cancel" };
        }

        // Create queue entry
        const queueEntry = {
            serverName,
            requestId: params.id,
            params,
            mode,
            response: undefined,
            resolve: undefined,
            reject: undefined
        };

        // Add to queue for UI processing
        elicitationState.queue.push(queueEntry);

        // Create promise that will be resolved when user responds
        const responsePromise = new Promise((resolve, reject) => {
            queueEntry.resolve = resolve;
            queueEntry.reject = reject;
        });

        // Wait for user response
        return await responsePromise;
    });
}

// Mapping: WT7→setupElicitationRequestHandler, A→serverName, q→client,
//          K→elicitationState, yp→ElicitationCreateSchema, sx6→runElicitationHook,
//          tx6→runElicitationResultHook, KK6→isElicitationEnabled, jb3→detectElicitationMode,
//          jB3→findElicitationQueueIndex, n1→logInfo
```

---

## 3. Elicitation Mode Detection

### detectElicitationMode (jb3)

**What it does:**
Determines whether an elicitation request should be displayed as a form dialog or URL-based flow.

**How it works:**
1. Check if `uris` parameter is present → URL mode
2. Check if `requestedSchema` parameter is present → Form mode
3. Default to form mode if neither

```javascript
// ============================================
// detectElicitationMode - Determine elicitation display mode
// Location: chunks.57.mjs:2919-2922
// ============================================

// ORIGINAL (for source lookup):
function jb3(A) {
    if (A.uris && A.uris.length > 0) return "url";
    return "form"
}

// READABLE (for understanding):
function detectElicitationMode(params) {
    // URL mode: Server provides URIs for external flow
    if (params.uris && params.uris.length > 0) {
        return "url";
    }

    // Form mode: Server provides JSON schema for structured input
    return "form";
}

// Mapping: jb3→detectElicitationMode, A→params
```

---

## 4. Form Elicitation Dialog

### FormElicitationDialog (BWz)

**What it does:**
Renders a structured form dialog based on a JSON schema provided by the MCP server.

**How it works:**
1. Parse the `requestedSchema` from the elicitation request
2. Generate form fields based on schema properties
3. Render appropriate input components for each type
4. Validate input against the schema
5. Submit or cancel based on user action

**Supported Schema Types:**

| JSON Schema Type | UI Component |
|------------------|--------------|
| `string` | Text input |
| `string` + `enum` | Dropdown select |
| `number` | Number input |
| `boolean` | Checkbox |
| `array` | Multi-input |
| `object` | Nested form |

```javascript
// ============================================
// FormElicitationDialog - Form-based elicitation rendering
// Location: chunks.190.mjs:1268-1350
// ============================================

// ORIGINAL (for source lookup) - Simplified:
function BWz(A) {
    let q = A.elicitationRequest,
        K = A.onSubmit,
        Y = A.onCancel,
        z = q.params.requestedSchema,
        _ = q.params.message,
        w = useState({}),
        O = useState([]);

    return React.createElement("box", {
        flexDirection: "column",
        borderStyle: "round",
        borderColor: "cyan",
        padding: 1
    }, [
        // Title
        React.createElement("text", {
            key: "title",
            bold: true
        }, `Elicitation: ${q.serverName}`),

        // Message
        React.createElement("text", {
            key: "message"
        }, _),

        // Form fields
        ...renderSchemaFields(z, w[0], w[1]),

        // Validation errors
        ...O[0].map((error, i) =>
            React.createElement("text", {
                key: `error-${i}`,
                color: "red"
            }, error)
        ),

        // Actions
        React.createElement("box", {
            key: "actions",
            flexDirection: "row",
            marginTop: 1
        }, [
            React.createElement("button", {
                key: "submit",
                onPress: () => validateAndSubmit(z, w[0], O[1], K)
            }, "Submit"),
            React.createElement("button", {
                key: "cancel",
                onPress: Y
            }, "Cancel")
        ])
    ]);
}

// READABLE (for understanding):
function FormElicitationDialog(props) {
    const {
        elicitationRequest,
        onSubmit,
        onCancel
    } = props;

    const { params } = elicitationRequest;
    const schema = params.requestedSchema;
    const message = params.message;

    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState([]);

    // Validate and submit
    const validateAndSubmit = () => {
        const validationErrors = validateAgainstSchema(formData, schema);
        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            return;
        }

        onSubmit({
            action: "accept",
            content: formData
        });
    };

    return (
        <box flexDirection="column" borderStyle="round" borderColor="cyan" padding={1}>
            {/* Server name */}
            <text bold>Elicitation: {elicitationRequest.serverName}</text>

            {/* Message from server */}
            <text>{message}</text>

            {/* Form fields from schema */}
            {renderSchemaFields(schema, formData, setFormData)}

            {/* Validation errors */}
            {errors.map((error, i) => (
                <text key={`error-${i}`} color="red">{error}</text>
            ))}

            {/* Action buttons */}
            <box flexDirection="row" marginTop={1}>
                <button onPress={validateAndSubmit}>Submit</button>
                <button onPress={() => onCancel({ action: "cancel" })}>Cancel</button>
            </box>
        </box>
    );
}

// Mapping: BWz→FormElicitationDialog, A→props, q→elicitationRequest,
//          K→onSubmit, Y→onCancel, z→schema, _→message
```

---

## 5. URL Elicitation Dialog

### UrlElicitationDialog (gWz)

**What it does:**
Renders a dialog for URL-based elicitation flows, typically used for OAuth authentication.

**How it works:**
1. Display the URL(s) provided by the MCP server
2. Provide a button to open the URL in browser
3. Show status indicator for flow progress
4. Handle completion notification

```javascript
// ============================================
// UrlElicitationDialog - URL-based elicitation for OAuth
// Location: chunks.190.mjs (referenced)
// ============================================

// ORIGINAL (for source lookup) - Simplified:
function gWz(A) {
    let q = A.elicitationRequest,
        K = A.onComplete,
        Y = q.params.uris,
        z = q.params.message;

    return React.createElement("box", {
        flexDirection: "column",
        borderStyle: "round",
        borderColor: "yellow",
        padding: 1
    }, [
        React.createElement("text", {
            key: "title",
            bold: true
        }, `Authentication Required: ${q.serverName}`),

        React.createElement("text", {
            key: "message"
        }, z),

        React.createElement("text", {
            key: "instruction"
        }, "Open the following URL to authenticate:"),

        ...Y.map((O, $) =>
            React.createElement("text", {
                key: `url-${$}`,
                color: "blue",
                underline: true
            }, O)
        ),

        React.createElement("box", {
            key: "actions",
            flexDirection: "row",
            marginTop: 1
        }, [
            React.createElement("button", {
                key: "open",
                onPress: () => openUrl(Y[0])
            }, "Open URL"),
            React.createElement("button", {
                key: "cancel",
                onPress: () => K({ action: "cancel" })
            }, "Cancel")
        ])
    ]);
}

// READABLE (for understanding):
function UrlElicitationDialog(props) {
    const {
        elicitationRequest,
        onComplete
    } = props;

    const { params } = elicitationRequest;
    const uris = params.uris;
    const message = params.message;

    const handleOpenUrl = () => {
        // Open first URL in browser
        openInBrowser(uris[0]);
    };

    return (
        <box flexDirection="column" borderStyle="round" borderColor="yellow" padding={1}>
            {/* Title */}
            <text bold>Authentication Required: {elicitationRequest.serverName}</text>

            {/* Message */}
            <text>{message}</text>

            {/* Instruction */}
            <text>Open the following URL to authenticate:</text>

            {/* URLs */}
            {uris.map((uri, i) => (
                <text key={`url-${i}`} color="blue" underline>{uri}</text>
            ))}

            {/* Actions */}
            <box flexDirection="row" marginTop={1}>
                <button onPress={handleOpenUrl}>Open URL</button>
                <button onPress={() => onComplete({ action: "cancel" })}>Cancel</button>
            </box>
        </box>
    );
}

// Mapping: gWz→UrlElicitationDialog, A→props, q→elicitationRequest,
//          K→onComplete, Y→uris, z→message
```

---

## 6. MCP Server Status UI

### Server Status Display

**What it does:**
Shows the connection status of MCP servers in the sidebar or status bar.

**Status Values:**

| Status | Indicator | Description |
|--------|-----------|-------------|
| `connected` | 🟢 Green | Server is connected and tools available |
| `needs-auth` | 🟡 Yellow | Authentication required |
| `disconnected` | 🔴 Red | Server is not connected |
| `connecting` | 🔵 Blue (animated) | Connection in progress |

```javascript
// ============================================
// McpServerStatusList - Display server status
// ============================================

function McpServerStatusList(props) {
    const { mcpClients } = props;

    return (
        <box flexDirection="column">
            <text bold>MCP Servers</text>
            {mcpClients.map((client) => (
                <McpServerItem
                    key={client.name}
                    server={client}
                />
            ))}
        </box>
    );
}

function McpServerItem(props) {
    const { server } = props;

    const statusColor = {
        connected: "green",
        "needs-auth": "yellow",
        disconnected: "red",
        connecting: "blue"
    }[server.status] || "gray";

    const toolCount = server.tools?.length ?? 0;

    return (
        <box flexDirection="row">
            <text color={statusColor}>●</text>
            <text> {server.name}</text>
            {toolCount > 0 && (
                <text dimColor> ({toolCount} tools)</text>
            )}
        </box>
    );
}
```

---

## 7. Elicitation Response Flow

### User Response → MCP Server

```
User submits form or completes URL flow
    │
    ├─→ Form mode:
    │     │
    │     ├─→ Validate input against schema
    │     │     └─→ Invalid: Show errors
    │     │
    │     └─→ Valid: Create response
    │           {
    │             action: "accept",
    │             content: { ...formData }
    │           }
    │
    ├─→ URL mode:
    │     │
    │     ├─→ User completes external flow
    │     │
    │     └─→ Server sends completion notification
    │           {
    │             action: "accept"
    │           }
    │
    ├─→ Cancel:
    │     {
    │       action: "cancel"
    │     }
    │
    └─→ Resolve promise in queue entry
          └─→ Response sent to MCP server
```

---

## 8. Modal Priority Integration

### Priority Algorithm

```javascript
// ============================================
// getActiveModal - Determine which modal to show
// ============================================

function getActiveModal(state) {
    const {
        sandboxPermissionQueue,
        pendingToolRequest,
        workerSandboxQueue,
        elicitation
    } = state;

    // Priority 1: Sandbox permission (highest)
    if (sandboxPermissionQueue.length > 0) {
        return {
            type: "sandbox-permission",
            priority: 1,
            data: sandboxPermissionQueue[0]
        };
    }

    // Priority 2: Tool permission
    if (pendingToolRequest.length > 0) {
        return {
            type: "tool-permission",
            priority: 2,
            data: pendingToolRequest[0]
        };
    }

    // Priority 3: Worker sandbox permission
    if (workerSandboxQueue.length > 0) {
        return {
            type: "worker-sandbox-permission",
            priority: 3,
            data: workerSandboxQueue[0]
        };
    }

    // Priority 4: Elicitation (lowest)
    if (elicitation.queue.length > 0) {
        return {
            type: "elicitation",
            priority: 4,
            data: elicitation.queue[0]
        };
    }

    return null;
}
```

---

## Validation Summary

| Component | Status | Location |
|-----------|--------|----------|
| setupElicitationRequestHandler (WT7) | ✅ Verified | chunks.58.mjs:3 |
| detectElicitationMode (jb3) | ✅ Verified | chunks.57.mjs:2919 |
| FormElicitationDialog (BWz) | ✅ Verified | chunks.190.mjs:1268 |
| ElicitationCreateSchema (yp) | ✅ Verified | chunks.5.mjs:2595 |
| ElicitationResultSchema (Cn) | ✅ Verified | chunks.5.mjs:2605 |
| Modal Priority | ✅ Verified | UI layer |

---

## Quick Reference

### Elicitation Schemas

```javascript
// ElicitationCreateSchema (yp)
{
    method: "elicitation/create",
    params: {
        message: string,
        uris?: string[],        // URL mode
        requestedSchema?: {     // Form mode
            type: "object",
            properties: { ... }
        }
    }
}

// ElicitationResultSchema (Cn)
{
    action: "accept" | "decline" | "cancel",
    content?: object   // For accept in form mode
}
```

### Modal Priority Order

1. sandbox-permission (highest)
2. tool-permission
3. worker-sandbox-permission
4. elicitation (lowest)