# MCP Tool Execution Complete Analysis (Claude Code 2.1.76)

> Complete source-level analysis of MCP tool discovery, execution, elicitation handling, and retry logic.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (MCP Protocol section)

Key functions in this document:
- `fetchMcpTools` (JE) - Tool discovery entry point - chunks.170.mjs:533
- `executeMcpToolCall` (F3z) - Tool execution with elicitation - chunks.169.mjs:2246
- `mcpToolCallCore` (PGq) - Low-level tool execution - chunks.169.mjs:2342
- `getMcpClientConnection` (yT6) - Get connected client - inferred

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                  MCP TOOL EXECUTION ARCHITECTURE                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ① Tool Discovery (fetchMcpTools)                                   │
│     ├─ Check server is connected and has tools capability            │
│     ├─ Send tools/list JSON-RPC request                              │
│     ├─ Build prefixed name: mcp__<server>__<tool>                   │
│     ├─ Extract annotations (readOnly, destructive, openWorld)       │
│     └─ Create tool object with call() method                         │
│                                                                       │
│  ② Tool Call Wrapper (in tool object)                               │
│     ├─ Emit progress event (started)                                 │
│     ├─ Get client connection (yT6)                                   │
│     ├─ Call executeMcpToolCall (F3z)                                 │
│     ├─ Handle session recovery retry                                 │
│     └─ Emit progress event (completed/failed)                        │
│                                                                       │
│  ③ Execution with Elicitation (F3z)                                 │
│     ├─ Call mcpToolCallCore (PGq)                                    │
│     ├─ If UrlElicitationRequired error:                              │
│     │   ├─ Parse elicitation requests from error data               │
│     │   ├─ Check if hook can handle                                  │
│     │   ├─ Queue UI elicitation dialog                               │
│     │   ├─ Wait for user response                                    │
│     │   └─ Retry tool call after elicitation                         │
│     └─ Return formatted result                                       │
│                                                                       │
│  ④ Core Execution (PGq)                                             │
│     ├─ Set up timeout (30 min default)                              │
│     ├─ Set up progress logging (every 30s)                           │
│     ├─ Call client.callTool via JSON-RPC                             │
│     ├─ Handle authentication errors (401)                            │
│     ├─ Handle session errors (404, -32001, connection closed)        │
│     └─ Process binary content (PDF, audio, images)                   │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 1. fetchMcpTools (JE) - Tool Discovery

**What it does:**
Discovers all available tools from a connected MCP server via the `tools/list` JSON-RPC method. Transforms each MCP tool into a Claude Code tool object with proper prefixing, annotations, and execution wrapper.

**How it works:**
1. Check server is connected and has `capabilities.tools`
2. Send `tools/list` JSON-RPC request
3. For each tool in response:
   - Build prefixed name: `mcp__<server>__<tool>`
   - Extract annotations from `tool.annotations`
   - Create tool object with `call()`, `description()`, `prompt()` methods
   - Add permission checking, auto-classification support
4. Return array of tool objects

**Why this approach:**
- Memoization via `ZP` caches results by server name, preventing redundant discovery calls
- Deferred loading via async `description()` and `prompt()` allows lazy evaluation
- Annotation extraction enables intelligent permission auto-classification

```javascript
// ============================================
// fetchMcpTools - Discover tools from MCP server
// Location: chunks.170.mjs:533-679
// ============================================

// ORIGINAL (for source lookup):
JE = ZP(async (A) => {
    if (A.type !== "connected") return [];
    try {
        if (!A.capabilities?.tools) return [];
        let q = await A.client.request({
                method: "tools/list"
            }, $y6),
            K = Ws(q.tools),
            Y = A.config.type === "sdk" && t6(process.env.CLAUDE_AGENT_SDK_MCP_NO_PREFIX);
        return K.map((z) => {
            let _ = $58(A.name, z.name);
            return {
                ...tZq,  // Base tool properties
                name: Y ? z.name : _,
                mcpInfo: {
                    serverName: A.name,
                    toolName: z.name
                },
                isMcp: !0,
                async description() {
                    return z.description ?? ""
                },
                async prompt() {
                    return z.description ?? ""
                },
                isConcurrencySafe() {
                    return z.annotations?.readOnlyHint ?? !1
                },
                isReadOnly() {
                    return z.annotations?.readOnlyHint ?? !1
                },
                toAutoClassifierInput(w) {
                    return u3z(w, z.name)
                },
                isDestructive() {
                    return z.annotations?.destructiveHint ?? !1
                },
                isOpenWorld() {
                    return z.annotations?.openWorldHint ?? !1
                },
                inputJSONSchema: z.inputSchema,
                async checkPermissions() {
                    return {
                        behavior: "passthrough",
                        message: "MCPTool requires permission.",
                        suggestions: [{
                            type: "addRules",
                            rules: [{ toolName: _, ruleContent: void 0 }],
                            behavior: "allow",
                            destination: "localSettings"
                        }]
                    }
                },
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

                    let D = Date.now(), X = 1;
                    for (let P = 0;; P++) try {
                        let W = await yT6(A),  // Get connected client
                            Z = await F3z({    // Execute tool
                                client: W,
                                clientConnection: A,
                                tool: z.name,
                                args: w,
                                meta: M,
                                signal: O.abortController.signal,
                                setAppState: O.setAppState,
                                onProgress: j && J ? (G) => {
                                    j({ toolUseID: J, data: G })
                                } : void 0,
                                handleElicitation: O.handleElicitation
                            });

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

                        return {
                            data: Z.content,
                            ...Z._meta || Z.structuredContent ? {
                                mcpMeta: {
                                    ...Z._meta && { _meta: Z._meta },
                                    ...Z.structuredContent && { structuredContent: Z.structuredContent }
                                }
                            } : {}
                        }
                    } catch (W) {
                        // Session recovery retry
                        if (W instanceof qn8 && P < X) {
                            n1(A.name, `Retrying tool '${z.name}' after session recovery`);
                            continue
                        }
                        // Emit progress: failed
                        if (j && J) j({
                            toolUseID: J,
                            data: {
                                type: "mcp_progress",
                                status: "failed",
                                serverName: A.name,
                                toolName: z.name,
                                elapsedTimeMs: Date.now() - D
                            }
                        });
                        // Wrap errors
                        if (W instanceof Error && !(W instanceof EV)) {
                            let Z = W.constructor.name;
                            if (Z === "Error") throw new EV(W.message, W.message.slice(0, 200));
                            if (Z === "McpError" && "code" in W && typeof W.code === "number")
                                throw new EV(W.message, `McpError ${W.code}`)
                        }
                        throw W
                    }
                },
                userFacingName() {
                    let w = z.annotations?.title || z.name;
                    return `${A.name} - ${w} (MCP)`
                },
                ...W96(A.name) ? T3z().getClaudeInChromeMCPToolOverrides(z.name) : {}
            }
        }).filter(x3z)
    } catch (q) {
        return EY(A.name, `Failed to fetch tools: ${_1(q)}`), []
    }
}, (A) => A.name, zn8)

// READABLE (for understanding):
const fetchMcpTools = memoize(async (clientConnection) => {
    // Only discover tools from connected servers
    if (clientConnection.type !== "connected") return [];

    try {
        // Check if server supports tools capability
        if (!clientConnection.capabilities?.tools) return [];

        // Request tools list via JSON-RPC
        const toolsResponse = await clientConnection.client.request({
            method: "tools/list"
        }, toolsListSchema);

        const tools = dedupeTools(toolsResponse.tools);

        // Check if prefix should be skipped (SDK mode with env var)
        const skipPrefix = clientConnection.config.type === "sdk" &&
            parseBoolean(process.env.CLAUDE_AGENT_SDK_MCP_NO_PREFIX);

        return tools.map((mcpTool) => {
            const prefixedName = buildMcpToolName(clientConnection.name, mcpTool.name);

            return {
                // Base tool properties
                ...baseToolProperties,

                // Name (with or without prefix)
                name: skipPrefix ? mcpTool.name : prefixedName,

                // MCP metadata for tracking
                mcpInfo: {
                    serverName: clientConnection.name,
                    toolName: mcpTool.name
                },

                // Mark as MCP tool
                isMcp: true,

                // Async description (deferred loading)
                async description() {
                    return mcpTool.description ?? ""
                },

                // Async prompt (deferred loading)
                async prompt() {
                    return mcpTool.description ?? ""
                },

                // Annotation-based methods
                isConcurrencySafe() {
                    return mcpTool.annotations?.readOnlyHint ?? false
                },

                isReadOnly() {
                    return mcpTool.annotations?.readOnlyHint ?? false
                },

                isDestructive() {
                    return mcpTool.annotations?.destructiveHint ?? false
                },

                isOpenWorld() {
                    return mcpTool.annotations?.openWorldHint ?? false
                },

                // Auto-classifier input generation
                toAutoClassifierInput(input) {
                    return buildAutoClassifierInput(input, mcpTool.name)
                },

                // Input schema
                inputJSONSchema: mcpTool.inputSchema,

                // Permission checking
                async checkPermissions() {
                    return {
                        behavior: "passthrough",
                        message: "MCPTool requires permission.",
                        suggestions: [{
                            type: "addRules",
                            rules: [{ toolName: prefixedName, ruleContent: undefined }],
                            behavior: "allow",
                            destination: "localSettings"
                        }]
                    };
                },

                // Main execution method
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
                                serverName: clientConnection.name,
                                toolName: mcpTool.name
                            }
                        });
                    }

                    const startTime = Date.now();
                    const maxRetries = 1;

                    for (let attempt = 0; ; attempt++) {
                        try {
                            // Get connected client (may reinitialize if expired)
                            const client = await getMcpClientConnection(clientConnection);

                            // Execute tool call
                            const result = await executeMcpToolCall({
                                client,
                                clientConnection,
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
                                        serverName: clientConnection.name,
                                        toolName: mcpTool.name,
                                        elapsedTimeMs: Date.now() - startTime
                                    }
                                });
                            }

                            return {
                                data: result.content,
                                ...(result._meta || result.structuredContent ? {
                                    mcpMeta: {
                                        ...(result._meta && { _meta: result._meta }),
                                        ...(result.structuredContent && { structuredContent: result.structuredContent })
                                    }
                                } : {})
                            };

                        } catch (error) {
                            // Session recovery retry
                            if (error instanceof McpSessionExpiredError && attempt < maxRetries) {
                                logInfo(clientConnection.name, `Retrying tool '${mcpTool.name}' after session recovery`);
                                continue;
                            }

                            // Emit progress: failed
                            if (progressCallback && toolUseId) {
                                progressCallback({
                                    toolUseID: toolUseId,
                                    data: {
                                        type: "mcp_progress",
                                        status: "failed",
                                        serverName: clientConnection.name,
                                        toolName: mcpTool.name,
                                        elapsedTimeMs: Date.now() - startTime
                                    }
                                });
                            }

                            // Wrap non-McpToolError errors
                            if (error instanceof Error && !(error instanceof McpToolError)) {
                                const errorType = error.constructor.name;
                                if (errorType === "Error") {
                                    throw new McpToolError(error.message, error.message.slice(0, 200));
                                }
                                if (errorType === "McpError" && "code" in error && typeof error.code === "number") {
                                    throw new McpToolError(error.message, `McpError ${error.code}`);
                                }
                            }
                            throw error;
                        }
                    }
                },

                // Display name
                userFacingName() {
                    const displayName = mcpTool.annotations?.title || mcpTool.name;
                    return `${clientConnection.name} - ${displayName} (MCP)`;
                },

                // Chrome-specific overrides if applicable
                ...(isChromeServer(clientConnection.name) ?
                    getChromeMcpToolOverrides(mcpTool.name) : {})
            };
        }).filter(filterValidTool);

    } catch (error) {
        logError(clientConnection.name, `Failed to fetch tools: ${formatError(error)}`);
        return [];
    }
}, (conn) => conn.name, memoCache);

// Mapping: JE→fetchMcpTools, A→clientConnection, ZP→memoize, $58→buildMcpToolName,
//          yT6→getMcpClientConnection, F3z→executeMcpToolCall, qn8→McpSessionExpiredError,
//          EV→McpToolError, tZq→baseToolProperties
```

**Key insight:**
The tool object's `call()` method is the bridge between Claude Code's tool execution pipeline and the MCP protocol. It handles:
1. Progress tracking with start/complete/fail events
2. Session recovery via retry on `McpSessionExpiredError`
3. Error wrapping to ensure consistent error types
4. Metadata forwarding for structured content

---

## 2. executeMcpToolCall (F3z) - Execution with Elicitation

**What it does:**
Executes an MCP tool call, handling URL elicitation errors by queueing UI dialogs and retrying after user interaction.

**How it works:**
1. Call `mcpToolCallCore` (PGq) to execute the tool
2. If error is `UrlElicitationRequired` (-32042):
   - Parse elicitation requests from error data
   - Check if hook can handle (via `sx6`)
   - If no hook, queue UI elicitation dialog
   - Wait for user response
   - Submit elicitation response
   - Retry tool call
3. Return result after all elicitations resolved

**Why this approach:**
- MCP servers can request user interaction (OAuth flows, etc.) mid-execution
- The elicitation system allows servers to pause execution and request user action
- Retry loop handles multiple sequential elicitations (up to 3)

```javascript
// ============================================
// executeMcpToolCall - Tool execution with elicitation handling
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
            P = (D != null && typeof D === "object" && "elicitations" in D && Array.isArray(D.elicitations)
                ? D.elicitations : []).filter((Z) => {
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

        logInfo(W, `Tool '${K}' requires URL elicitation (error -32042, attempt ${J+1}), processing ${P.length} elicitation(s)`);

        // Process each elicitation request
        for (let Z of P) {
            let { elicitationId: G } = Z;

            // Check if hook can handle
            let f = await checkHookForElicitation(W, Z, _);
            if (f) {
                logInfo(W, `URL elicitation ${G} resolved by hook: ${JSON.stringify(f)}`);
                if (f.action !== "accept") {
                    return {
                        content: `URL elicitation was ${f.action==="decline"?"declined":f.action+"ed"} by a hook. The tool "${K}" could not complete because it requires the user to open a URL.`
                    };
                }
                continue;  // Hook accepted, continue to next elicitation
            }

            // No hook, use UI elicitation
            let v;
            if (H) {
                // Use provided elicitation handler (SDK mode)
                v = await H(W, Z, _);
            } else {
                // Queue UI elicitation dialog
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

            // Submit elicitation response
            let N = await submitElicitationResponse(W, v, _, "url", G);
            if (N.action !== "accept") {
                logInfo(W, `User ${N.action==="decline"?"declined":N.action+"ed"} URL elicitation ${G}`);
                return {
                    content: `URL elicitation was ${N.action==="decline"?"declined":N.action+"ed"} by the user. The tool "${K}" could not complete because it requires the user to open a URL.`
                };
            }
            logInfo(W, `Elicitation ${G} completed, retrying tool call`);
        }
    }
}

// READABLE (for understanding):
async function executeMcpToolCall({
    client,
    clientConnection,
    tool,
    args,
    meta,
    signal,
    setAppState,
    onProgress,
    callToolFn = mcpToolCallCore,
    handleElicitation
}) {
    // Retry loop for elicitation handling
    for (let attempt = 0; ; attempt++) {
        try {
            // Execute the tool call
            return await callToolFn({
                client,
                tool,
                args,
                meta,
                signal,
                onProgress
            });

        } catch (error) {
            // Check if this is a URL elicitation required error
            if (!(error instanceof McpError) || error.code !== ErrorCode.UrlElicitationRequired) {
                throw error;  // Not an elicitation error, rethrow
            }

            // Limit elicitation rounds
            if (attempt >= 3) {
                throw error;
            }

            // Check if elicitation is enabled
            if (!isElicitationEnabled()) {
                throw error;
            }

            // Parse elicitation requests from error data
            const errorData = error.data;
            const elicitationRequests = (
                errorData != null &&
                typeof errorData === "object" &&
                "elicitations" in errorData &&
                Array.isArray(errorData.elicitations)
                    ? errorData.elicitations
                    : []
            ).filter((req) => {
                // Validate elicitation request structure
                if (req == null || typeof req !== "object") return false;
                const typed = req;
                return (
                    typed.mode === "url" &&
                    typeof typed.url === "string" &&
                    typeof typed.elicitationId === "string" &&
                    typeof typed.message === "string"
                );
            });

            const serverName = clientConnection.type === "connected" ? clientConnection.name : "unknown";

            if (elicitationRequests.length === 0) {
                logWarn(serverName, `Tool '${tool}' returned -32042 but no valid elicitations in error data`);
                throw error;
            }

            logInfo(serverName, `Tool '${tool}' requires URL elicitation (error -32042, attempt ${attempt + 1}), processing ${elicitationRequests.length} elicitation(s)`);

            // Process each elicitation request
            for (const elicitationRequest of elicitationRequests) {
                const { elicitationId } = elicitationRequest;

                // Check if a hook can handle this elicitation
                const hookResult = await checkHookForElicitation(serverName, elicitationRequest, signal);
                if (hookResult) {
                    logInfo(serverName, `URL elicitation ${elicitationId} resolved by hook: ${JSON.stringify(hookResult)}`);
                    if (hookResult.action !== "accept") {
                        return {
                            content: `URL elicitation was ${hookResult.action === "decline" ? "declined" : hookResult.action + "ed"} by a hook. The tool "${tool}" could not complete because it requires the user to open a URL.`
                        };
                    }
                    continue;  // Hook accepted, move to next elicitation
                }

                // No hook available, use UI elicitation
                let userResponse;
                if (handleElicitation) {
                    // Use provided elicitation handler (SDK mode)
                    userResponse = await handleElicitation(serverName, elicitationRequest, signal);
                } else {
                    // Queue UI elicitation dialog
                    const waitingState = { actionLabel: "Retry now", showCancel: true };
                    userResponse = await new Promise((resolve) => {
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
                                        if (response.action === "accept") return;  // Don't resolve yet
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
                }

                // Submit elicitation response to server
                const finalResponse = await submitElicitationResponse(serverName, userResponse, signal, "url", elicitationId);
                if (finalResponse.action !== "accept") {
                    logInfo(serverName, `User ${finalResponse.action === "decline" ? "declined" : finalResponse.action + "ed"} URL elicitation ${elicitationId}`);
                    return {
                        content: `URL elicitation was ${finalResponse.action === "decline" ? "declined" : finalResponse.action + "ed"} by the user. The tool "${tool}" could not complete because it requires the user to open a URL.`
                    };
                }

                logInfo(serverName, `Elicitation ${elicitationId} completed, retrying tool call`);
            }
        }
    }
}

// Mapping: F3z→executeMcpToolCall, A→client, q→clientConnection, K→tool, Y→args,
//          PGq→mcpToolCallCore, Aq→McpError, Fq.UrlElicitationRequired→ErrorCode.UrlElicitationRequired
```

**Key insight:**
The elicitation system allows MCP servers to pause tool execution and request user action (like OAuth flows). The retry loop with elicitation processing enables:
1. **Hook handling**: Custom handlers can auto-approve/decline elicitations
2. **UI integration**: User sees a dialog with URL and action buttons
3. **Multiple elicitations**: A single tool call can trigger multiple sequential elicitation requests

---

## 3. mcpToolCallCore (PGq) - Low-Level Execution

**What it does:**
Executes the actual JSON-RPC `tools/call` request to the MCP server, handling timeouts, progress, authentication errors, and session recovery.

**How it works:**
1. Set up timeout (30 minutes default via `f3z()`)
2. Set up progress logging (every 30 seconds)
3. Race between `client.callTool()` and timeout
4. Handle various error conditions:
   - 401: Authentication expired → `McpAuthExpiredError`
   - 404/-32001/connection closed: Session expired → `McpSessionExpiredError`
   - Tool error: Wrap in `McpToolError`
5. Process result (handle binary content via `g3z`)
6. Return formatted result

```javascript
// ============================================
// mcpToolCallCore - Low-level tool execution
// Location: chunks.169.mjs:2342-2430
// ============================================

// ORIGINAL (for source lookup):
async function PGq({
    client: {
        client: A,
        name: q,
        config: K
    },
    tool: Y,
    args: z,
    meta: _,
    signal: w,
    onProgress: O
}) {
    let $ = Date.now(), H;
    try {
        logInfo(q, `Calling MCP tool: ${Y}`);

        // Progress logging every 30 seconds
        H = setInterval((startTime, serverName, toolName) => {
            let elapsed = Date.now() - startTime,
                elapsedStr = `${Math.floor(elapsed/1000)}s`;
            logInfo(serverName, `Tool '${toolName}' still running (${elapsedStr} elapsed)`)
        }, 30000, $, q, Y);

        let timeout = getMcpTimeout(),  // Default 30 minutes
            timeoutId, timeoutPromise = new Promise((resolve, reject) => {
                timeoutId = setTimeout((rejectFn, serverName, toolName, timeoutMs) => {
                    rejectFn(new McpToolError(
                        `MCP server "${serverName}" tool "${toolName}" timed out after ${Math.floor(timeoutMs/1000)}s`,
                        "MCP tool timeout"
                    ));
                }, timeout, reject, q, Y, timeout);
            });

        // Race between tool call and timeout
        let result = await Promise.race([
            A.callTool({
                name: Y,
                arguments: z,
                _meta: _
            }, callToolResultSchema, {
                signal: w,
                timeout: timeout,
                onprogress: O ? (progress) => {
                    O({
                        type: "mcp_progress",
                        status: "progress",
                        serverName: q,
                        toolName: Y,
                        progress: progress.progress,
                        total: progress.total,
                        progressMessage: progress.message
                    });
                } : void 0
            }),
            timeoutPromise
        ]).finally(() => {
            if (timeoutId) clearTimeout(timeoutId);
        });

        // Check for error in result
        if ("isError" in result && result.isError) {
            let errorMsg = "Unknown error";
            if ("content" in result && Array.isArray(result.content) && result.content.length > 0) {
                let firstContent = result.content[0];
                if (firstContent && typeof firstContent === "object" && "text" in firstContent) {
                    errorMsg = firstContent.text;
                }
            } else if ("error" in result) {
                errorMsg = String(result.error);
            }
            logError(q, errorMsg);
            throw new McpToolError(errorMsg, "MCP tool returned error",
                "_meta" in result && result._meta ? { _meta: result._meta } : undefined);
        }

        // Log success
        let duration = Date.now() - $,
            durationStr = duration < 1000 ? `${duration}ms` :
                          duration < 60000 ? `${Math.floor(duration/1000)}s` :
                          `${Math.floor(duration/60000)}m ${Math.floor(duration%60000/1000)}s`;
        logInfo(q, `Tool '${Y}' completed successfully in ${durationStr}`);

        // Track code indexing tool usage
        let indexingTool = getCodeIndexingTool(q);
        if (indexingTool) {
            emitTelemetry("tengu_code_indexing_tool_used", {
                tool: indexingTool,
                source: "mcp",
                success: true
            });
        }

        return {
            content: await processMcpContent(result, Y, q),
            _meta: result._meta,
            structuredContent: result.structuredContent
        };

    } catch (error) {
        if (H !== void 0) clearInterval(H);
        let duration = Date.now() - $;
        if (error instanceof Error && error.name !== "AbortError") {
            logInfo(q, `Tool '${Y}' failed after ${Math.floor(duration/1000)}s: ${error.message}`);
        }

        if (error instanceof Error) {
            // Authentication error (401)
            if (("code" in error ? error.code : undefined) === 401 || error instanceof AuthExpiredError) {
                logInfo(q, "Tool call returned 401 Unauthorized - token may have expired");
                emitTelemetry("tengu_mcp_tool_call_auth_error", {});
                throw new McpAuthExpiredError(q, `MCP server "${q}" requires re-authorization (token expired)`);
            }

            // Session expired (404, -32001, connection closed)
            let isSessionExpired = isSessionExpiredError(error);
            let isConnectionClosed = "code" in error && error.code === -32000 &&
                error.message.includes("Connection closed") &&
                (K.type === "http" || K.type === "claudeai-proxy");

            if (isSessionExpired || isConnectionClosed) {
                logInfo(q, `MCP session expired during tool call (${isSessionExpired ? "404/-32001" : "connection closed"}), clearing connection cache for re-initialization`);
                emitTelemetry("tengu_mcp_session_expired", {});
                await clearMcpConnectionCache(q, K);
                throw new McpSessionExpiredError(q);
            }
        }

        if (!(error instanceof Error) || error.name !== "AbortError") {
            throw error;
        }

        // Aborted - return undefined content
        return { content: undefined };

    } finally {
        if (H !== void 0) clearInterval(H);
    }
}

// Mapping: PGq→mcpToolCallCore, A→client, q→serverName, K→config, Y→tool, z→args,
//          f3z→getMcpTimeout, g3z→processMcpContent, ZE1→McpToolError, WE1→McpAuthExpiredError,
//          qn8→McpSessionExpiredError
```

**Key insight:**
The timeout and session recovery mechanisms are critical for MCP reliability:
1. **30-minute timeout**: Long-running operations (like indexing) have enough time
2. **Progress logging**: Every 30 seconds logs that tool is still running
3. **Session recovery**: Detects expired sessions and throws `McpSessionExpiredError` which triggers reconnection in the caller

---

## 4. Tool Annotation Mapping

MCP tools can provide annotations that affect Claude Code's behavior:

| Annotation | Claude Code Method | Effect |
|------------|-------------------|--------|
| `readOnlyHint` | `isReadOnly()`, `isConcurrencySafe()` | Tool is safe for concurrent execution |
| `destructiveHint` | `isDestructive()` | Tool may cause irreversible changes |
| `openWorldHint` | `isOpenWorld()` | Tool interacts with external systems |
| `title` | `userFacingName()` | Display name in UI |

### Auto-Classification

Tools with `readOnlyHint: true` are automatically classified as safe:
- No permission prompt needed (unless `requireCanUseTool`)
- Can run concurrently with other tools
- Lower risk categorization

---

## 5. Error Types and Handling

| Error Type | Code | Handling |
|------------|------|----------|
| `McpToolError` (EV) | Various | User-facing error message |
| `McpSessionExpiredError` (qn8) | 404, -32001, connection closed | Retry after reconnection |
| `McpAuthExpiredError` (WE1) | 401 | Prompt user to re-authorize |
| `UrlElicitationRequired` | -32042 | Queue UI elicitation, retry |

---

## Cross-Module Integration

### MCP ↔ Tools (05)

MCP tools are registered in the tool registry with `mcp__` prefix. The tool execution pipeline routes MCP tool calls through `F3z` instead of the standard `tool.call` directly.

### MCP ↔ System Reminder (04)

MCP tool execution generates progress attachments:
- `mcp_progress.status: "started"` - Tool call beginning
- `mcp_progress.status: "progress"` - Progress update (if supported)
- `mcp_progress.status: "completed"` - Tool call success
- `mcp_progress.status: "failed"` - Tool call failure

### MCP ↔ UI (02)

Elicitation dialogs are queued in `elicitation.queue` in the UI state. The modal priority system shows elicitation dialogs after tool permission dialogs but before other modals.

---

## Verification

1. **Validate tool discovery symbol**:
   ```bash
   grep -n "JE = ZP" source/chunks.170.mjs
   # Expected: 533:    JE = ZP(async (A) => {
   ```

2. **Validate execution symbol**:
   ```bash
   grep -n "async function F3z" source/chunks.169.mjs
   # Expected: 2246:async function F3z({
   ```

3. **Validate elicitation error code**:
   ```bash
   grep -n "UrlElicitationRequired" source/chunks.169.mjs
   ```