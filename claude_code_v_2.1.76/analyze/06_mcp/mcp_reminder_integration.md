# MCP ↔ System Reminder Integration (Claude Code 2.1.76)

> Complete analysis of how MCP tool execution integrates with the system reminder/attachment system.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (MCP Protocol section)
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Attachments section)

Key functions in this document:
- `executeMcpToolCall` (F3z) - Tool execution with progress - chunks.169.mjs:2246
- `fetchMcpTools` (JE) - Tool discovery - chunks.170.mjs:533
- Elicitation queue integration with system state

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│               MCP ↔ SYSTEM REMINDER INTEGRATION                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  MCP Tool Execution Flow:                                            │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │ fetchMcpTools (JE)                                          │    │
│  │ ├─ Discover tools via tools/list                           │    │
│  │ └─ Create tool objects with call() method                  │    │
│  └────────────────────────────┬────────────────────────────────┘    │
│                               │                                      │
│                               ▼                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │ tool.call() → executeMcpToolCall (F3z)                      │    │
│  │                                                              │    │
│  │ Progress Callbacks:                                          │    │
│  │ ├─ "started" → mcp_progress attachment                      │    │
│  │ ├─ "progress" → progress update attachment                  │    │
│  │ ├─ "completed" → completion attachment                      │    │
│  │ └─ "failed" → error attachment                              │    │
│  │                                                              │    │
│  │ Elicitation Handling:                                        │    │
│  │ ├─ UrlElicitationRequired (-32042)                          │    │
│  │ ├─ Queue in elicitation.queue                               │    │
│  │ ├─ Wait for user response                                   │    │
│  │ └─ Retry with elicitation response                          │    │
│  └────────────────────────────┬────────────────────────────────┘    │
│                               │                                      │
│                               ▼                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │ System Reminder / Attachment Generation                      │    │
│  │                                                              │    │
│  │ Attachment Types:                                            │    │
│  │ ├─ mcp_progress - Tool execution status                     │    │
│  │ ├─ elicitation_request - MCP server needs user input        │    │
│  │ ├─ mcp_server_status - Server connection changes            │    │
│  │ └─ mcp_tool_result - Tool result summary                    │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## MCP Progress Attachments

### Progress Attachment Schema

```javascript
// ============================================
// MCP progress attachment structure
// ============================================

const mcpProgressAttachment = {
    type: "attachment",
    attachment: {
        type: "mcp_progress",
        toolUseID: "toolu_abc123",
        serverName: "sqlite",
        toolName: "query",
        status: "started" | "progress" | "completed" | "failed",
        elapsedTimeMs: 1500,
        progress: 50,           // Optional: 0-100 for tools supporting progress
        total: 100,             // Optional: total work units
        progressMessage: "Indexing...",  // Optional: status message
        timestamp: "2024-01-15T10:30:00Z"
    }
};
```

### Progress States

| Status | When Generated | Purpose |
|--------|----------------|---------|
| `started` | Tool call begins | Show operation in progress |
| `progress` | Tool reports progress | Update progress bar/text |
| `completed` | Tool succeeds | Remove from in-progress, show result |
| `failed` | Tool errors | Show error in tool result |

### Progress Callback Integration

```javascript
// ============================================
// Progress callback in tool.call()
// Location: chunks.170.mjs (fetchMcpTools)
// ============================================

// ORIGINAL (for source lookup):
async call(w, O, $, H, j) {
    let J = p3z(H),  // Extract tool_use ID
        M = J ? { "claudecode/toolUseId": J } : {};

    // Emit progress: started
    if (j && J) j({
        toolUseID: J,
        data: {
            type: "mcp_progress",
            status: "started",
            serverName: A.name,
            toolName: z.name
        }
    });

    let D = Date.now();
    // ... execution ...

    // Emit progress: completed
    if (j && J) j({
        toolUseID: J,
        data: {
            type: "mcp_progress",
            status: "completed",
            serverName: A.name,
            toolName: z.name,
            elapsedTimeMs: Date.now() - D
        }
    });
}

// READABLE (for understanding):
async call(input, context, canUseTool, assistantMessage, progressCallback) {
    const toolUseId = extractToolUseId(assistantMessage);
    const meta = toolUseId ? { "claudecode/toolUseId": toolUseId } : {};

    // Emit progress: started
    if (progressCallback && toolUseId) {
        progressCallback({
            toolUseID: toolUseId,
            data: {
                type: "mcp_progress",
                status: "started",
                serverName: connection.name,
                toolName: mcpTool.name
            }
        });
    }

    const startTime = Date.now();

    try {
        // Execute tool
        const result = await executeMcpToolCall({
            client,
            clientConnection: connection,
            tool: mcpTool.name,
            args: input,
            meta,
            signal: context.abortController.signal,
            setAppState: context.setAppState,
            onProgress: progressCallback && toolUseId ? (progress) => {
                progressCallback({ toolUseID: toolUseId, data: progress });
            } : undefined,
            handleElicitation: context.handleElicitation
        });

        // Emit progress: completed
        if (progressCallback && toolUseId) {
            progressCallback({
                toolUseID: toolUseId,
                data: {
                    type: "mcp_progress",
                    status: "completed",
                    serverName: connection.name,
                    toolName: mcpTool.name,
                    elapsedTimeMs: Date.now() - startTime
                }
            });
        }

        return { data: result.content };

    } catch (error) {
        // Emit progress: failed
        if (progressCallback && toolUseId) {
            progressCallback({
                toolUseID: toolUseId,
                data: {
                    type: "mcp_progress",
                    status: "failed",
                    serverName: connection.name,
                    toolName: mcpTool.name,
                    elapsedTimeMs: Date.now() - startTime
                }
            });
        }

        throw error;
    }
}
```

---

## Elicitation Integration

### Elicitation Queue State

```javascript
// Elicitation state in app state
{
    elicitation: {
        queue: [{
            serverName: "jira",
            requestId: "elicit-abc123",
            params: {
                mode: "url",
                url: "https://auth.atlassian.com/...",
                message: "Please authenticate with Jira"
            },
            signal: AbortSignal,
            waitingState: {
                actionLabel: "Retry now",
                showCancel: true
            },
            respond: (response) => { /* ... */ },
            onWaitingDismiss: (action) => { /* ... */ }
        }]
    }
}
```

### Elicitation Flow with Attachments

```javascript
// ============================================
// Elicitation request handling
// Location: chunks.169.mjs (executeMcpToolCall)
// ============================================

// READABLE (for understanding):
async function handleElicitationRequest({
    serverName,
    elicitationRequest,
    signal,
    setAppState
}) {
    const { elicitationId, mode, url, message } = elicitationRequest;

    // Generate attachment for LLM context
    const attachment = {
        type: "elicitation_request",
        serverName,
        elicitationId,
        mode,
        message,
        timestamp: new Date().toISOString()
    };

    // Queue in app state for UI rendering
    const waitingState = { actionLabel: "Retry now", showCancel: true };

    const userResponse = await new Promise((resolve) => {
        const onCancel = () => resolve({ action: "cancel" });
        if (signal.aborted) { onCancel(); return; }
        signal.addEventListener("abort", onCancel);

        setAppState((state) => ({
            ...state,
            elicitation: {
                queue: [...state.elicitation.queue, {
                    serverName,
                    requestId: `error-elicit-${elicitationId}`,
                    params: elicitationRequest,
                    signal,
                    waitingState,
                    respond: (response) => {
                        if (response.action === "accept") return;
                        signal.removeEventListener("abort", onCancel);
                        resolve(response);
                    },
                    onWaitingDismiss: (action) => {
                        signal.removeEventListener("abort", onCancel);
                        if (action === "retry") resolve({ action: "accept" });
                        else resolve({ action: "cancel" });
                    }
                }]
            }
        }));
    });

    // Submit response to MCP server
    const finalResponse = await submitElicitationResponse(
        serverName,
        userResponse,
        signal,
        mode,
        elicitationId
    );

    return finalResponse;
}
```

### Elicitation Attachment Types

```javascript
// Form mode elicitation
{
    type: "attachment",
    attachment: {
        type: "elicitation_request",
        serverName: "database",
        mode: "form",
        message: "Please provide database credentials",
        requestedSchema: {
            type: "object",
            properties: {
                host: { type: "string" },
                port: { type: "number" },
                username: { type: "string" },
                password: { type: "string", format: "password" }
            },
            required: ["host", "username", "password"]
        }
    }
}

// URL mode elicitation (OAuth)
{
    type: "attachment",
    attachment: {
        type: "elicitation_request",
        serverName: "jira",
        mode: "url",
        message: "Please authenticate with Jira",
        url: "https://auth.atlassian.com/oauth/authorize?...",
        uris: ["https://auth.atlassian.com/oauth/authorize?..."]
    }
}
```

---

## MCP Server Status Attachments

### Server Connection Events

```javascript
// ============================================
// MCP server status attachment
// ============================================

const serverStatusAttachment = {
    type: "attachment",
    attachment: {
        type: "mcp_server_status",
        serverName: "sqlite",
        previousStatus: "connected",
        newStatus: "disconnected" | "connecting" | "connected" | "error",
        errorMessage: "Connection refused",
        timestamp: "2024-01-15T10:30:00Z"
    }
};
```

### Status Transitions

```
            ┌─────────────┐
            │   initial   │
            └──────┬──────┘
                   │
                   ▼
            ┌─────────────┐
      ┌────▶│ connecting  │◀────┐
      │     └──────┬──────┘     │
      │            │            │
      │            ▼            │
      │     ┌─────────────┐     │
      │     │  connected  │     │
      │     └──────┬──────┘     │
      │            │            │
      │            ▼            │
      │     ┌─────────────┐     │
      └─────│   error     │─────┘
            └──────┬──────┘
                   │
                   ▼
            ┌─────────────┐
            │disconnected │
            └─────────────┘
```

---

## Cross-Module Integration

### MCP ↔ Tools (05)

- MCP tools registered with `mcp__` prefix
- Execute through standard tool pipeline (fxY)
- Permission checks apply to MCP tools
- Progress callbacks integrated with tool result messages

### MCP ↔ UI (02)

- Elicitation dialogs rendered in modal layer
- Modal priority: elicitation is lowest priority
- Progress indicators in tool result display

### MCP ↔ System Reminder (04)

- Progress attachments during tool execution
- Elicitation requests as special attachment type
- Server status changes generate notifications

### MCP ↔ Hooks (11)

- PreToolUse hooks can modify MCP tool input
- PostToolUse hooks can modify MCP tool output
- Elicitation can be auto-resolved by hooks

---

## Session Recovery Integration

### Session Expired Handling

```javascript
// ============================================
// MCP session recovery with attachments
// ============================================

async function handleMcpSessionExpired(serverName, config) {
    // Generate notification attachment
    const attachment = {
        type: "mcp_session_expired",
        serverName,
        timestamp: new Date().toISOString()
    };

    // Clear connection cache
    await clearMcpConnectionCache(serverName, config);

    // Emit telemetry
    emitTelemetry("tengu_mcp_session_expired", {
        serverName
    });

    // Throw error for retry logic
    throw new McpSessionExpiredError(serverName);
}
```

### Retry Flow

```
Tool call fails with session expired
  │
  ├─→ Clear connection cache
  │
  ├─→ Reinitialize connection
  │
  ├─→ Retry tool call (max 1 retry)
  │
  └─→ If success: continue
      If fail: propagate error
```

---

## Binary Content Handling

### Binary Content in Tool Results

```javascript
// ============================================
// Binary content processing in MCP results
// Location: chunks.169.mjs (processMcpContent)
// ============================================

async function processMcpContent(result, toolName, serverName) {
    const content = result.content;

    // Handle binary content (PDFs, images, audio)
    if (Array.isArray(content)) {
        for (const item of content) {
            if (item.type === "image" || item.type === "resource") {
                // Binary content saved to disk
                if (item.mimeType?.startsWith("image/") ||
                    item.mimeType === "application/pdf" ||
                    item.mimeType?.startsWith("audio/")) {

                    const savedPath = await saveBinaryContent(item, serverName);

                    // Generate attachment for result
                    return {
                        type: "text",
                        text: `Binary content saved to: ${savedPath}`
                    };
                }
            }
        }
    }

    return content;
}
```

---

## Quick Reference

### Attachment Types

| Type | Purpose | Generated By |
|------|---------|--------------|
| `mcp_progress` | Tool execution status | Tool call progress callback |
| `elicitation_request` | MCP server needs user input | UrlElicitationRequired error |
| `mcp_server_status` | Server connection changes | Connection state changes |
| `mcp_session_expired` | Session recovery needed | Session error handling |

### Elicitation Response Actions

| Action | Meaning | Continue Tool? |
|--------|---------|----------------|
| `accept` | User completed OAuth/filled form | Yes |
| `decline` | User explicitly declined | No |
| `cancel` | User dismissed dialog | No |

### Error Codes

| Code | Name | Handling |
|------|------|----------|
| -32042 | UrlElicitationRequired | Queue elicitation, retry |
| 401 | Unauthorized | Prompt re-authorization |
| 404, -32001 | Session expired | Reconnect, retry |

---

## Version History

| Version | Changes |
|---------|---------|
| 2.1.76 | Binary content handling, improved progress attachments |
| 2.1.72 | Elicitation system with form/URL modes |
| 2.1.32 | McpHub for browser connections |
| 2.1.27 | SSE transport support |

---

## Modal Priority System

### Elicitation in Modal Stack

The elicitation dialog has the **lowest priority** in the modal stack:

```javascript
// ============================================
// Modal priority determination
// Location: UI state management
// ============================================

function determineCurrentModal(appState) {
    // Priority order (highest to lowest):

    // 1. Sandbox permission (security-critical)
    if (appState.sandboxPermissionQueue?.[0]) {
        return "sandbox-permission";
    }

    // 2. Tool permission (user approval needed)
    if (appState.pendingToolRequest?.[0]) {
        return "tool-permission";
    }

    // 3. Worker sandbox permission
    if (appState.workerSandboxQueue?.[0]) {
        return "worker-sandbox-permission";
    }

    // 4. Elicitation (lowest priority - MCP server request)
    if (appState.elicitation?.queue?.[0]) {
        return "elicitation";
    }

    return null;
}
```

### Why Lowest Priority?

1. **User flow preservation**: Don't interrupt active permission flows
2. **Security ordering**: Permission decisions must complete before external server requests
3. **Nested scenarios**: A tool permission may trigger elicitation after approval
4. **User control**: User should resolve local decisions before interacting with external services

---

## Source-Level Elicitation Analysis

### Complete Elicitation Error Handling

```javascript
// ============================================
// Elicitation handling in executeMcpToolCall (F3z)
// Location: chunks.169.mjs:2246-2340
// ============================================

// ORIGINAL (for source lookup):
async function F3z({
    client: A,
    clientConnection: q,
    tool: K,
    args: Y,
    meta: z,
    signal: _,
    setAppState: w,
    onProgress: O,
    callToolFn: $ = PGq,
    handleElicitation: H
}) {
    for (let J = 0;; J++) try {
        return await $({
            client: A,
            tool: K,
            args: Y,
            meta: z,
            signal: _,
            onProgress: O
        })
    } catch (M) {
        // Check for URL elicitation required error
        if (!(M instanceof Aq) || M.code !== Fq.UrlElicitationRequired) throw M;
        if (J >= 3) throw M;  // Max 3 elicitation rounds
        if (!KK6()) throw M;  // Check if elicitation is enabled

        // Parse elicitation requests from error data
        let D = M.data,
            P = (D?.elicitations ?? []).filter((Z) => {
                if (Z == null || typeof Z !== "object") return !1;
                let G = Z;
                return G.mode === "url" && typeof G.url === "string" &&
                       typeof G.elicitationId === "string" && typeof G.message === "string"
            }),
            W = q.type === "connected" ? q.name : "unknown";

        if (P.length === 0) {
            logWarn(W, `Tool '${K}' returned -32042 but no valid elicitations in error data`);
            throw M;
        }

        logInfo(W, `Tool '${K}' requires URL elicitation (attempt ${J+1}), processing ${P.length} elicitation(s)`);

        // Process each elicitation request
        for (let Z of P) {
            let { elicitationId: G } = Z;

            // Check if hook can handle
            let f = await checkHookForElicitation(W, Z, _);
            if (f) {
                logInfo(W, `URL elicitation ${G} resolved by hook: ${JSON.stringify(f)}`);
                if (f.action !== "accept") {
                    return {
                        content: `URL elicitation was ${f.action}ed by a hook. The tool "${K}" could not complete.`
                    };
                }
                continue;  // Hook accepted, continue to next elicitation
            }

            // No hook, use UI elicitation
            let v;
            if (H) {
                v = await H(W, Z, _);
            } else {
                let V = { actionLabel: "Retry now", showCancel: !0 };
                v = await new Promise((L) => {
                    let h = () => { L({ action: "cancel" }) };
                    if (_.aborted) { h(); return; }
                    _.addEventListener("abort", h);
                    w((R) => ({
                        ...R,
                        elicitation: {
                            queue: [...R.elicitation.queue, {
                                serverName: W,
                                requestId: `error-elicit-${G}`,
                                params: Z,
                                signal: _,
                                waitingState: V,
                                respond: (u) => {
                                    if (u.action === "accept") return;
                                    _.removeEventListener("abort", h);
                                    L(u);
                                },
                                onWaitingDismiss: (u) => {
                                    _.removeEventListener("abort", h);
                                    if (u === "retry") L({ action: "accept" });
                                    else L({ action: "cancel" });
                                }
                            }]
                        }
                    }));
                });
            }

            let N = await submitElicitationResponse(W, v, _, "url", G);
            if (N.action !== "accept") {
                logInfo(W, `User ${N.action}ed URL elicitation ${G}`);
                return {
                    content: `URL elicitation was ${N.action}ed by the user. The tool "${K}" could not complete.`
                };
            }
            logInfo(W, `Elicitation ${G} completed, retrying tool call`);
        }
    }
}

// Mapping: F3z→executeMcpToolCall, Aq→McpError, Fq.UrlElicitationRequired→ErrorCode.UrlElicitationRequired,
//          PGq→mcpToolCallCore, KK6→isElicitationEnabled
```

### Key Insight: Three-Layer Elicitation Resolution

1. **Hook Resolution**: Hooks can auto-approve/decline elicitations without user interaction
2. **SDK Handler**: SDK mode provides custom elicitation handler
3. **UI Dialog**: Default behavior shows user dialog with URL and action buttons

---

## Verification

1. **Validate executeMcpToolCall symbol**:
   ```bash
   grep -n "async function F3z" source/chunks.169.mjs
   # Expected: 2246:async function F3z({
   ```

2. **Validate mcpToolCallCore symbol**:
   ```bash
   grep -n "async function PGq" source/chunks.169.mjs
   # Expected: 2342:async function PGq({
   ```

3. **Validate progress emission**:
   ```bash
   grep -n "mcp_progress" source/chunks.170.mjs
   ```