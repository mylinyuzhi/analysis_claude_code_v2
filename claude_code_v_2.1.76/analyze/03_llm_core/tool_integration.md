# Tool Integration (Claude Code 2.1.76)

> Complete analysis of how tools are integrated with the LLM API: schema building for requests, dispatch from responses, permission checking, and result feedback loops.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `StreamingToolExecutor` (ui6) - Parallel tool execution during streaming (VERIFIED: chunks.148.mjs:3-228)
- `toolDispatcher` (Wi6) - Routes tool calls to implementations (VERIFIED: chunks.146.mjs:285-389)
- `executeToolCore` (fxY) - Core tool execution with hooks and permissions (VERIFIED: chunks.146.mjs:442+)
- `buildToolSchemas` (nZ6) - Builds API tool definitions from internal tool objects
- `executePreToolHooksIterator` (B1q) - Pre-tool hook execution
- `executePostToolHooksIterator` (b1q) - Post-tool hook execution

---

## Architecture Overview

Tool integration spans three phases:

```
PHASE 1: SCHEMA BUILDING (LLM Request)
Tool Objects ────► buildToolSchemas ────► API Schema
  - Filter by deferred loading
  - Add cache control markers
  - Include MCP tool metadata

PHASE 2: DISPATCH FROM RESPONSE
tool_use blocks ────► toolDispatcher ────► Execution
  - Lookup tool by name
  - Validate input against schema
  - Check permissions
  - Execute tool.call()

PHASE 3: RESULT FEEDBACK
tool_result ────► Message History ────► Next LLM Request
  - Normalize result content
  - Track file operations
  - Record telemetry
```

---

## Phase 1: Tool Schema Building

### buildToolSchema (Sh1) - Converts single tool to API format

**What it does:**
The `buildToolSchema` (Sh1) function transforms a single internal tool object into the JSON Schema format required by the Anthropic Messages API. This is called for each tool to build the complete `tools` array.

**Source Code (VERIFIED):**

```javascript
// ============================================
// buildToolSchema - Converts single tool to API schema format
// Location: chunks.170.mjs:1452-1472
// ============================================

// ORIGINAL (for source lookup):
async function Sh1(A, q) {
    let K = jY("tengu_tool_pear"),
        Y = "inputJSONSchema" in A && A.inputJSONSchema ? A.inputJSONSchema : fU(A.inputSchema);
    if (!E7()) Y = n3z(A.name, Y);
    let z = {
        name: A.name,
        description: await A.prompt({
            getToolPermissionContext: q.getToolPermissionContext,
            tools: q.tools,
            agents: q.agents,
            allowedAgentTypes: q.allowedAgentTypes
        }),
        input_schema: Y
    };
    if (K && A.strict === !0 && q.model && eY6(q.model)) z.strict = !0;
    if (q.betas?.includes(nA1) && A.input_examples) z.input_examples = A.input_examples;
    if (q.deferLoading) z.defer_loading = !0;
    if (q.cacheControl) z.cache_control = q.cacheControl;
    if (w8("tengu_fgts", !1) || t6(process.env.CLAUDE_CODE_ENABLE_FINE_GRAINED_TOOL_STREAMING)) z.eager_input_streaming = !0;
    return z
}

// READABLE (for understanding):
async function buildToolSchema(tool, options) {
    // Check if strict mode is enabled via feature flag
    let isStrictEnabled = getFeatureFlag("tengu_tool_pear");

    // Get input schema - use pre-built JSON schema if available, otherwise convert Zod
    let inputSchema = "inputJSONSchema" in tool && tool.inputJSONSchema
        ? tool.inputJSONSchema
        : zodToJsonSchema(tool.inputSchema);

    // Remove strictly-typed fields if not using strict mode (Bedrock compatibility)
    if (!isBedrockProvider()) {
        inputSchema = removeStrictFields(tool.name, inputSchema);
    }

    // Build base tool definition
    let toolDef = {
        name: tool.name,
        description: await tool.prompt({
            getToolPermissionContext: options.getToolPermissionContext,
            tools: options.tools,
            agents: options.agents,
            allowedAgentTypes: options.allowedAgentTypes
        }),
        input_schema: inputSchema
    };

    // Add strict mode if enabled and model supports it
    if (isStrictEnabled && tool.strict === true && options.model && supportsStrictMode(options.model)) {
        toolDef.strict = true;
    }

    // Add input examples if beta is enabled
    if (options.betas?.includes(OUTPUT_ITERATION_BETA) && tool.input_examples) {
        toolDef.input_examples = tool.input_examples;
    }

    // Add defer_loading for dynamic tool loading optimization
    if (options.deferLoading) {
        toolDef.defer_loading = true;
    }

    // Add cache control for prompt caching
    if (options.cacheControl) {
        toolDef.cache_control = options.cacheControl;
    }

    // Enable eager input streaming for fine-grained tool streaming
    if (getFeatureFlag("tengu_fgts", false) ||
        parseBoolean(process.env.CLAUDE_CODE_ENABLE_FINE_GRAINED_TOOL_STREAMING)) {
        toolDef.eager_input_streaming = true;
    }

    return toolDef;
}

// Mapping: Sh1→buildToolSchema, A→tool, q→options, K→isStrictEnabled, Y→inputSchema,
//   jY→getFeatureFlag, fU→zodToJsonSchema, n3z→removeStrictFields, E7→isBedrockProvider,
//   w8→getFeatureFlag, t6→parseBoolean, eY6→supportsStrictMode, nA1→OUTPUT_ITERATION_BETA
```

**How it works:**

1. **Schema Extraction**: Uses `inputJSONSchema` if pre-built, otherwise converts Zod schema via `zodToJsonSchema`
2. **Bedrock Compatibility**: Removes strictly-typed fields for non-Bedrock providers
3. **Dynamic Description**: Calls `tool.prompt()` to generate context-aware descriptions
4. **Optional Features**:
   - `strict`: Enables structured output validation
   - `defer_loading`: Marks tool for dynamic loading
   - `cache_control`: Enables prompt caching for tool schema
   - `eager_input_streaming`: Enables fine-grained streaming

**Why this approach:**
- Each tool is processed independently for parallelization
- Feature flags enable gradual rollout of new capabilities
- Description is generated dynamically to include context-specific guidance

### shouldUseDynamicLoading (yi6) - Decision logic for deferred tools

**What it does:**
Determines whether to use dynamic tool loading (deferred tools with ToolSearch) based on model capabilities, MCP tool count, and feature flags.

**Source Code (VERIFIED):**

```javascript
// ============================================
// shouldUseDynamicLoading - Decides if dynamic tool loading should be used
// Location: chunks.169.mjs:433-471
// ============================================

// ORIGINAL (for source lookup):
async function yi6(A, q, K, Y, z) {
    let _ = q.filter(($) => $.isMcp).length;

    function w($, H, j, J) {
        d("tengu_tool_search_mode_decision", {
            enabled: $,
            mode: H,
            reason: j,
            checkedModel: A,
            mcpToolCount: _,
            userType: "external",
            ...J
        })
    }
    if (!Vi6(A)) return k(`Tool search disabled for model '${A}': model does not support tool_reference blocks.`), w(!1, "standard", "model_unsupported"), !1;
    if (!bz6(q)) return k("Tool search disabled: ToolSearchTool is not available."), w(!1, "standard", "mcp_search_unavailable"), !1;
    let O = Fi8();
    switch (O) {
        case "tst":
            return w(!0, O, "tst_enabled"), !0;
        case "tst-auto": {
            let { enabled: $, debugDescription: H, metrics: j } = await o5z(q, K, Y, A);
            if ($) return k(`Auto tool search enabled: ${H}`), w(!0, O, "auto_above_threshold", j), !0;
            if (q.some((J) => GX(J)) && !My()) try {
                let J = w8("tengu_tst_kx7", !1);
                return k(`Tool search ${J?"enabled":"disabled"} via experiment`), w(J, O, "experiment_enable_tst"), J
            } catch (J) { k(`GrowthBook not ready: ${J}`) }
            return k(`Auto tool search disabled: ${H}`), w(!1, O, "auto_below_threshold", j), !1
        }
        case "standard":
            return w(!1, O, "standard_mode"), !1
    }
}

// READABLE (for understanding):
async function shouldUseDynamicLoading(model, tools, getToolPermissionContext, agents, source) {
    let mcpToolCount = tools.filter((t) => t.isMcp).length;

    // Helper to log telemetry
    function logDecision(enabled, mode, reason, extraMetrics) {
        logEvent("tengu_tool_search_mode_decision", {
            enabled,
            mode,
            reason,
            checkedModel: model,
            mcpToolCount,
            userType: "external",
            ...extraMetrics
        });
    }

    // Prerequisite 1: Model must support tool_reference blocks
    if (!supportsToolReferenceBlocks(model)) {
        console.warn(`Tool search disabled for model '${model}': model does not support tool_reference blocks.`);
        logDecision(false, "standard", "model_unsupported");
        return false;
    }

    // Prerequisite 2: ToolSearchTool must be available
    if (!isToolSearchToolAvailable(tools)) {
        console.warn("Tool search disabled: ToolSearchTool is not available.");
        logDecision(false, "standard", "mcp_search_unavailable");
        return false;
    }

    // Check the tool search mode
    let mode = getToolSearchMode();

    switch (mode) {
        case "tst":  // Force enabled
            logDecision(true, mode, "tst_enabled");
            return true;

        case "tst-auto": {  // Auto-decide based on thresholds
            let { enabled, debugDescription, metrics } = await checkAutoThreshold(tools, getToolPermissionContext, agents, model);

            if (enabled) {
                console.log(`Auto tool search enabled: ${debugDescription}`);
                logDecision(true, mode, "auto_above_threshold", metrics);
                return true;
            }

            // Below threshold, but check experiment flag for deferred tools
            if (tools.some((t) => isDeferredTool(t)) && !isGrowthBookReady()) {
                try {
                    let experimentEnabled = getFeatureFlag("tengu_tst_kx7", false);
                    console.log(`Tool search ${experimentEnabled ? "enabled" : "disabled"} via experiment`);
                    logDecision(experimentEnabled, mode, "experiment_enable_tst");
                    return experimentEnabled;
                } catch (e) {
                    console.log(`GrowthBook not ready: ${e}`);
                }
            }

            console.log(`Auto tool search disabled: ${debugDescription}`);
            logDecision(false, mode, "auto_below_threshold", metrics);
            return false;
        }

        case "standard":  // Disabled
            logDecision(false, mode, "standard_mode");
            return false;
    }
}

// Mapping: yi6→shouldUseDynamicLoading, A→model, q→tools, K→getToolPermissionContext,
//   Y→agents, z→source, _→mcpToolCount, w→logDecision, Vi6→supportsToolReferenceBlocks,
//   bz6→isToolSearchToolAvailable, Fi8→getToolSearchMode, GX→isDeferredTool,
//   o5z→checkAutoThreshold, w8→getFeatureFlag
```

**Decision Flow:**

```
                    ┌─────────────────────────────────┐
                    │ shouldUseDynamicLoading()       │
                    └───────────────┬─────────────────┘
                                    │
                    ┌───────────────▼───────────────┐
                    │ supportsToolReferenceBlocks?  │
                    │ (Claude 4+ only)              │
                    └───────────────┬───────────────┘
                                    │
                    ┌─────── No ────┴─── Yes ───────┐
                    │                               │
                    ▼                               ▼
            ┌───────────────┐           ┌───────────────────┐
            │ Return false  │           │ isToolSearchTool  │
            │ (model_unsup) │           │ Available?        │
            └───────────────┘           └─────────┬─────────┘
                                                │
                                ┌─────── No ────┴─── Yes ───────┐
                                │                               │
                                ▼                               ▼
                        ┌───────────────┐           ┌───────────────────┐
                        │ Return false  │           │ Check tool_search │
                        │ (search_unav) │           │ mode setting      │
                        └───────────────┘           └─────────┬─────────┘
                                                            │
                        ┌─────────────┬─────────────┬───────┴───────┐
                        │             │             │               │
                        ▼             ▼             ▼               ▼
                    "tst"        "tst-auto"    "standard"      (other)
                        │             │             │               │
                        ▼             ▼             ▼               ▼
                Return true    Auto-threshold  Return false   Return false
                                check
                                    │
                        ┌───────────┴───────────┐
                        │                       │
                        ▼                       ▼
                Above threshold          Below threshold
                → Return true            → Check experiment
                                            │
                                    ┌───────┴───────┐
                                    │               │
                                    ▼               ▼
                                Enabled         Disabled
                                → true          → false
```

**Why this approach:**
- Three modes allow flexibility: force-on, auto, and force-off
- Model capability check ensures features are only used where supported
- Auto mode uses dynamic threshold based on MCP tool count and context
- Experiment flags allow gradual rollout to users

### extractReferencedTools (zF) - Find tools mentioned in history

**What it does:**
Scans message history to find tool names that have been referenced (via tool_reference blocks). This determines which deferred tools should be included in the next request.

**Source Code (VERIFIED):**

```javascript
// ============================================
// extractReferencedTools - Find tool names mentioned in message history
// Location: chunks.169.mjs:485-508
// ============================================

// ORIGINAL (for source lookup):
function zF(A) {
    let q = new Set, K = 0;
    for (let Y of A) {
        if (Y.type === "system" && Y.subtype === "compact_boundary") {
            let _ = Y.compactMetadata?.preCompactDiscoveredTools;
            if (_) {
                for (let w of _) q.add(w);
                K += _.length
            }
            continue
        }
        if (Y.type !== "user") continue;
        let z = Y.message?.content;
        if (!Array.isArray(z)) continue;
        for (let _ of z)
            if (r5z(_)) {
                for (let w of _.content)
                    if (n5z(w)) q.add(w.tool_name)
            }
    }
    if (q.size > 0) k(`Dynamic tool loading: found ${q.size} discovered tools in message history`);
    return q
}

// READABLE (for understanding):
function extractReferencedTools(messages) {
    let discoveredTools = new Set();
    let carriedFromCompact = 0;

    for (let message of messages) {
        // Handle compact boundary - carry over discovered tools
        if (message.type === "system" && message.subtype === "compact_boundary") {
            let preCompactTools = message.compactMetadata?.preCompactDiscoveredTools;
            if (preCompactTools) {
                for (let toolName of preCompactTools) {
                    discoveredTools.add(toolName);
                }
                carriedFromCompact += preCompactTools.length;
            }
            continue;
        }

        // Only process user messages for tool references
        if (message.type !== "user") continue;

        let content = message.message?.content;
        if (!Array.isArray(content)) continue;

        // Look for tool_result blocks containing tool_reference
        for (let block of content) {
            if (isToolResult(block)) {
                for (let nestedBlock of block.content) {
                    if (isToolReferenceWithName(nestedBlock)) {
                        discoveredTools.add(nestedBlock.tool_name);
                    }
                }
            }
        }
    }

    if (discoveredTools.size > 0) {
        console.log(`Dynamic tool loading: found ${discoveredTools.size} discovered tools in message history`);
    }

    return discoveredTools;
}

// Mapping: zF→extractReferencedTools, A→messages, q→discoveredTools, K→carriedFromCompact,
//   r5z→isToolResult, n5z→isToolReferenceWithName, k→console.log
```

**Why this approach:**
- Tools discovered in previous turns are included to maintain continuity
- Compact boundary handling ensures tools survive context compaction
- Using a Set automatically deduplicates tool names

### Dynamic Tool Loading in streamingQueryCore

**What it does:**
Applies the dynamic loading decision to filter and prepare tools for the API request.

**Source Code (VERIFIED):**

```javascript
// ============================================
// Dynamic tool loading in streamingQueryCore
// Location: chunks.171.mjs:17-52
// ============================================

// ORIGINAL (for source lookup):
j = await yi6(_.model, Y, _.getToolPermissionContext, _.agents, "query");
if (j && !Y.some(GX) && !_.hasPendingMcpServers) k("Tool search disabled: no deferred tools available"), j = !1;
let J;
if (j) {
    let T6 = zF(A);
    J = Y.filter((D6) => {
        if (!GX(D6)) return !0;
        if (z3(D6, HZ)) return !0;
        return T6.has(D6.name)
    })
} else J = Y.filter((T6) => !z3(T6, HZ));
...
v = await Promise.all(J.map((T6) => Sh1(T6, {
    ...
    deferLoading: j && (GX(T6) || e3z(T6))
})));
if (j) {
    let T6 = Y.filter(GX).length,
        D6 = J.filter(GX).length;
    k(`Dynamic tool loading: ${D6}/${T6} deferred tools included`)
}

// READABLE (for understanding):
let useDynamicLoading = await shouldUseDynamicLoading(
    options.model,
    tools,
    options.getToolPermissionContext,
    options.agents,
    "query"
);

// Disable if no deferred tools available
if (useDynamicLoading && !tools.some(isDeferredTool) && !options.hasPendingMcpServers) {
    console.log("Tool search disabled: no deferred tools available");
    useDynamicLoading = false;
}

let filteredTools;
if (useDynamicLoading) {
    // Find tools mentioned in recent messages
    let referencedTools = extractReferencedTools(messages);

    // Include tool if: not deferred, OR is ToolSearch, OR was referenced
    filteredTools = tools.filter((tool) => {
        if (!isDeferredTool(tool)) return true;
        if (isToolSearchTool(tool)) return true;
        return referencedTools.has(tool.name);
    });
} else {
    // Exclude all deferred tools
    filteredTools = tools.filter((tool) => !isDeferredTool(tool));
}

// Build tool schemas
let toolSchemas = await Promise.all(filteredTools.map((tool) =>
    buildToolSchema(tool, {
        ...
        deferLoading: useDynamicLoading && (isDeferredTool(tool) || isExtendedDeferred(tool))
    })
));

// Log statistics if dynamic loading is active
if (useDynamicLoading) {
    let totalDeferred = tools.filter(isDeferredTool).length;
    let includedDeferred = filteredTools.filter(isDeferredTool).length;
    console.log(`Dynamic tool loading: ${includedDeferred}/${totalDeferred} deferred tools included`);
}

// Mapping: j→useDynamicLoading, J→filteredTools, T6→referencedTools/totalDeferred,
//   D6→includedDeferred, yi6→shouldUseDynamicLoading, zF→extractReferencedTools,
//   GX→isDeferredTool, Sh1→buildToolSchema
```

**Key insight:**
Dynamic tool loading reduces token usage by 70-90% when MCP servers expose many tools. Only tools that are actively being used (referenced in history) or core built-in tools are included. The ToolSearch tool allows the model to discover and load additional tools on demand.

---

## Phase 2: Tool Dispatch from LLM Response

### StreamingToolExecutor - Parallel tool execution during streaming

**What it does:**
The `StreamingToolExecutor` (ui6) enables tools to start executing while the LLM stream is still in progress, reducing perceived latency. This is a critical optimization that makes the agent feel more responsive.

**Source Code (VERIFIED):**

```javascript
// ============================================
// StreamingToolExecutor - Parallel tool execution during LLM streaming
// Location: chunks.148.mjs:3-228
// ============================================

// ORIGINAL (for source lookup):
class ui6 {
    toolDefinitions;
    canUseTool;
    tools = [];
    toolUseContext;
    hasErrored = !1;
    erroredToolDescription = "";
    siblingAbortController;
    discarded = !1;
    progressAvailableResolve;
    constructor(A, q, K) {
        this.toolDefinitions = A;
        this.canUseTool = q;
        this.toolUseContext = K, this.siblingAbortController = Wm(K.abortController)
    }
    discard() {
        this.discarded = !0
    }
    addTool(A, q) {
        let K = dK(this.toolDefinitions, A.name);
        if (!K) {
            this.tools.push({
                id: A.id,
                block: A,
                assistantMessage: q,
                status: "completed",
                isConcurrencySafe: !0,
                pendingProgress: [],
                results: [p1({
                    content: [{
                        type: "tool_result",
                        content: `<tool_use_error>Error: No such tool available: ${A.name}</tool_use_error>`,
                        is_error: !0,
                        tool_use_id: A.id
                    }],
                    toolUseResult: `Error: No such tool available: ${A.name}`,
                    sourceToolAssistantUUID: q.uuid
                })]
            });
            return
        }
        A.input = PE1(K, A.input);
        let Y = K.inputSchema.safeParse(A.input),
            z = Y?.success ? (() => {
                try {
                    return Boolean(K.isConcurrencySafe(Y.data))
                } catch {
                    return !1
                }
            })() : !1;
        this.tools.push({
            id: A.id,
            block: A,
            assistantMessage: q,
            status: "queued",
            isConcurrencySafe: z,
            pendingProgress: []
        }), this.processQueue()
    }
    canExecuteTool(A) {
        let q = this.tools.filter((K) => K.status === "executing");
        return q.length === 0 || A && q.every((K) => K.isConcurrencySafe)
    }
    async processQueue() {
        for (let A of this.tools) {
            if (A.status !== "queued") continue;
            if (this.canExecuteTool(A.isConcurrencySafe)) await this.executeTool(A);
            else if (!A.isConcurrencySafe) break
        }
    }
    // ... additional methods ...
}

// READABLE (for understanding):
class StreamingToolExecutor {
    toolDefinitions;
    canUseTool;
    tools = [];
    toolUseContext;
    hasErrored = false;
    erroredToolDescription = "";
    siblingAbortController;
    discarded = false;
    progressAvailableResolve;

    constructor(toolDefinitions, canUseTool, toolUseContext) {
        this.toolDefinitions = toolDefinitions;
        this.canUseTool = canUseTool;
        this.toolUseContext = toolUseContext;
        // Create sibling abort controller for coordinated cancellation
        this.siblingAbortController = cloneAbortController(toolUseContext.abortController);
    }

    discard() {
        this.discarded = true;
    }

    addTool(toolUseBlock, assistantMessage) {
        // 1. Look up tool definition
        let tool = findTool(this.toolDefinitions, toolUseBlock.name);

        // 2. Tool not found - create error result immediately
        if (!tool) {
            this.tools.push({
                id: toolUseBlock.id,
                block: toolUseBlock,
                assistantMessage: assistantMessage,
                status: "completed",
                isConcurrencySafe: true,
                pendingProgress: [],
                results: [createUserMessage({
                    content: [{
                        type: "tool_result",
                        content: `<tool_use_error>Error: No such tool available: ${toolUseBlock.name}</tool_use_error>`,
                        is_error: true,
                        tool_use_id: toolUseBlock.id
                    }],
                    toolUseResult: `Error: No such tool available: ${toolUseBlock.name}`,
                    sourceToolAssistantUUID: assistantMessage.uuid
                })]
            });
            return;
        }

        // 3. Normalize and validate input
        toolUseBlock.input = normalizeToolInput(tool, toolUseBlock.input);
        let parseResult = tool.inputSchema.safeParse(toolUseBlock.input);

        // 4. Determine if tool is concurrency-safe
        let isConcurrencySafe = parseResult?.success
            ? (() => {
                try {
                    return Boolean(tool.isConcurrencySafe(parseResult.data));
                } catch {
                    return false;
                }
            })()
            : false;

        // 5. Add to queue and trigger processing
        this.tools.push({
            id: toolUseBlock.id,
            block: toolUseBlock,
            assistantMessage: assistantMessage,
            status: "queued",
            isConcurrencySafe: isConcurrencySafe,
            pendingProgress: []
        });
        this.processQueue();
    }

    canExecuteTool(isConcurrencySafe) {
        let executing = this.tools.filter((t) => t.status === "executing");
        // Can execute if: nothing running, OR all running tools are concurrency-safe
        return executing.length === 0 ||
               (isConcurrencySafe && executing.every((t) => t.isConcurrencySafe));
    }

    async processQueue() {
        for (let tool of this.tools) {
            if (tool.status !== "queued") continue;
            if (this.canExecuteTool(tool.isConcurrencySafe)) {
                await this.executeTool(tool);
            } else if (!tool.isConcurrencySafe) {
                break; // Non-safe tool must wait
            }
        }
    }
}

// Mapping: ui6→StreamingToolExecutor, A→toolUseBlock/tool, q→assistantMessage/canUseTool,
//   K→toolUseContext, dK→findTool, PE1→normalizeToolInput, Wm→cloneAbortController
```

**How it works:**

1. **Tool Queue**: As `tool_use` blocks arrive in the stream, they're added to an internal queue via `addTool()`
2. **Concurrency Safety Check**: Before queuing, determines if the tool is "concurrency-safe" (can run in parallel with other tools)
3. **Parallel Execution**: Each queued tool immediately begins execution in a separate async context
4. **Result Collection**: `getCompletedResults()` returns finished tool results that can be yielded immediately
5. **Remaining Drain**: `getRemainingResults()` is called after the stream ends to collect any still-running tools

**Concurrency Safety Algorithm:**

The key innovation is the `canExecuteTool()` method. Not all tools can safely run in parallel:
- **Safe tools**: Read operations, stateless tools (Read, Glob, Grep)
- **Unsafe tools**: Write operations, tools that modify state (Edit, Write, Bash)

```
Decision Logic:
  EXECUTING_COUNT == 0  →  Start any tool
  EXECUTING_COUNT > 0 AND NEW_TOOL_IS_SAFE AND ALL_EXECUTING_ARE_SAFE  →  Start in parallel
  Otherwise  →  Wait for current tools to complete
```

**Why this approach:**
- **Reduced latency**: Users see tool results appearing while the LLM is still generating
- **Parallel execution**: Multiple independent tools can run simultaneously (e.g., 3 Read operations)
- **Safety guarantees**: Tools that modify files never run concurrently, preventing race conditions
- **Abort handling**: If the user cancels, running tools can be gracefully terminated via siblingAbortController

**Key insight:** The streaming tool executor trades complexity for latency. Without it, the user would wait for the entire LLM response before any tool starts. The concurrency safety mechanism ensures that parallel execution doesn't cause file corruption or race conditions.

### Sequential Tool Execution (tZ6)

**What it does:**
When streaming tool execution is disabled, the `tZ6` function executes tools sequentially after the stream completes.

---

## Tool Dispatcher - Core Routing Logic

### toolDispatcher (Wi6) - Routes tool calls to implementations

**What it does:**
The `toolDispatcher` is an async generator that takes a `tool_use` block from the LLM response, looks up the corresponding tool implementation, validates input, and delegates to the core execution logic.

**Source Code (VERIFIED):**

```javascript
// ============================================
// toolDispatcher - Routes tool_use blocks to tool implementations
// Location: chunks.146.mjs:285-389
// ============================================

// ORIGINAL (for source lookup):
async function* Wi6(A, q, K, Y) {
    let z = A.name,
        _ = dK(Y.options.tools, z);
    if (!_) {
        let J = dK(ng(), z);
        if (J && J.aliases?.includes(z)) _ = J
    }
    let w = q.message.id,
        O = q.requestId,
        $ = PxY(z, Y.options.mcpClients),
        H = WxY(z, Y.options.mcpClients);
    if (!_) {
        let J = hq(z);
        k(`Unknown tool ${z}: ${A.id}`), d("tengu_tool_use_error", {
            error: `No such tool available: ${J}`,
            toolName: J,
            toolUseID: A.id,
            isMcp: z.startsWith("mcp__"),
            // ... telemetry fields ...
        }), yield {
            message: p1({
                content: [{
                    type: "tool_result",
                    content: `<tool_use_error>Error: No such tool available: ${z}</tool_use_error>`,
                    is_error: !0,
                    tool_use_id: A.id
                }],
                toolUseResult: `Error: No such tool available: ${z}`,
                sourceToolAssistantUUID: q.uuid
            })
        };
        return
    }
    let j = A.input;
    try {
        if (Y.abortController.signal.aborted) {
            // ... handle cancellation ...
        }
        for await (let J of ZxY(_, A.id, j, Y, K, q, w, O, $, H)) yield J
    } catch (J) {
        // ... error handling ...
    }
}

// READABLE (for understanding):
async function* toolDispatcher(toolUseBlock, assistantMessage, canUseTool, toolUseContext) {
    let toolName = toolUseBlock.name;

    // 1. Look up tool in available tools
    let tool = findTool(toolUseContext.options.tools, toolName);

    // 2. Check alias mapping for backwards compatibility
    if (!tool) {
        let builtinTool = findTool(getBuiltinTools(), toolName);
        if (builtinTool && builtinTool.aliases?.includes(toolName)) {
            tool = builtinTool;
        }
    }

    // 3. Extract MCP metadata for telemetry
    let mcpServerType = getMcpServerType(toolName, toolUseContext.options.mcpClients);
    let mcpServerBaseUrl = getMcpServerBaseUrl(toolName, toolUseContext.options.mcpClients);

    // 4. Tool not found - return error
    if (!tool) {
        log(`Unknown tool ${toolName}: ${toolUseBlock.id}`);
        logEvent("tengu_tool_use_error", {
            error: `No such tool available: ${sanitizeToolName(toolName)}`,
            toolName: sanitizeToolName(toolName),
            toolUseID: toolUseBlock.id,
            isMcp: toolName.startsWith("mcp__"),
            // ... additional telemetry ...
        });

        yield {
            message: createUserMessage({
                content: [{
                    type: "tool_result",
                    content: `<tool_use_error>Error: No such tool available: ${toolName}</tool_use_error>`,
                    is_error: true,
                    tool_use_id: toolUseBlock.id
                }],
                toolUseResult: `Error: No such tool available: ${toolName}`,
                sourceToolAssistantUUID: assistantMessage.uuid
            })
        };
        return;
    }

    let input = toolUseBlock.input;

    try {
        // 5. Check for cancellation before execution
        if (toolUseContext.abortController.signal.aborted) {
            logEvent("tengu_tool_use_cancelled", { /* telemetry */ });
            yield { /* cancelled result */ };
            return;
        }

        // 6. Delegate to core execution
        for await (let result of executeToolWithProgress(
            tool, toolUseBlock.id, input, toolUseContext,
            canUseTool, assistantMessage, messageId, requestId,
            mcpServerType, mcpServerBaseUrl
        )) {
            yield result;
        }
    } catch (error) {
        // 7. Handle unexpected errors
        reportError(error);
        let errorMessage = error instanceof Error ? error.message : String(error);
        let fullMessage = `Error calling tool${tool ? ` (${tool.name})` : ""}: ${errorMessage}`;

        yield {
            message: createUserMessage({
                content: [{
                    type: "tool_result",
                    content: `<tool_use_error>${fullMessage}</tool_use_error>`,
                    is_error: true,
                    tool_use_id: toolUseBlock.id
                }],
                toolUseResult: fullMessage,
                sourceToolAssistantUUID: assistantMessage.uuid
            })
        };
    }
}

// Mapping: Wi6→toolDispatcher, A→toolUseBlock, q→assistantMessage, K→canUseTool,
//   Y→toolUseContext, z→toolName, _→tool, dK→findTool, hq→sanitizeToolName,
//   PxY→getMcpServerType, WxY→getMcpServerBaseUrl, ZxY→executeToolWithProgress
```

**How it works:**

1. **Tool Lookup**: First searches in current session's available tools, then checks built-in tools with alias support
2. **MCP Metadata Extraction**: Parses MCP tool names (`mcp__<server>__<tool>`) to extract server info for telemetry
3. **Cancellation Check**: Verifies the abort controller before delegating to execution
4. **Delegation**: Passes control to `executeToolWithProgress` (ZxY) which handles the full execution pipeline
5. **Error Recovery**: Catches and wraps unexpected errors as tool_result messages

**Why this approach:**
- **Generator pattern**: Allows yielding progress updates during long-running tool operations
- **Alias support**: Maintains backwards compatibility when tool names change
- **Rich telemetry**: Captures MCP server details for debugging and monitoring
- **Error isolation**: Unexpected errors don't crash the agent; they become error messages for the LLM

**Key insight:** The dispatcher is intentionally thin. It performs routing and error handling, but the complex logic (validation, permissions, hooks, execution) is delegated to `executeToolCore` (fxY). This separation makes the flow easier to test and reason about.

---

## Permission Check Flow

### Permission Decision Algorithm

The permission system determines whether a tool can execute without user approval. This is implemented in `executeToolCore` (fxY).

**Source Code (VERIFIED):**

```javascript
// ============================================
// executeToolCore - Core tool execution with hooks and permissions
// Location: chunks.146.mjs:442-640
// ============================================

// ORIGINAL (for source lookup):
async function fxY(A, q, K, Y, z, _, w, O, $, H, j) {
    let J = A.inputSchema.safeParse(K);
    if (!J.success) {
        let u = V4q(A.name, J.error),
            I = GxY(A, Y.messages, Y.options.tools);
        if (I) d("tengu_deferred_tool_schema_not_sent", {...}), u += I;
        return k(`${A.name} tool input error: ${u.slice(0,200)}`), d("tengu_tool_use_error", {...}), [{...}]
    }
    // ... validateInput check ...
    let M = await A.validateInput?.(J.data, Y);
    if (M?.result === !1) return k(`${A.name} tool validation error: ${M.message?.slice(0,200)}`), [{...}];

    // ... Pre-tool hooks iteration ...
    let P = !1, W, Z, G = [], f = Date.now();
    for await (let u of y4q(Y, A, X, q, _.message.id, O, $, H)) switch (u.type) {
        case "message": /* handle progress/message */ break;
        case "hookPermissionResult": Z = u.hookPermissionResult; break;
        case "hookUpdatedInput": X = u.updatedInput; break;
        case "preventContinuation": P = u.shouldPreventContinuation; break;
        case "stopReason": W = u.stopReason; break;
        case "stop": return /* early exit */;
    }

    // ... Permission decision logic ...
    let V;
    if (Z !== void 0 && Z.behavior === "allow" && !A.requiresUserInteraction?.() && !Y.requireCanUseTool)
        k(`Hook approved tool use for ${A.name}, bypassing permission check`), V = Z;
    else if (Z !== void 0 && Z.behavior === "allow" && (A.requiresUserInteraction?.() || Y.requireCanUseTool)) {
        if (k(`Hook approved tool use for ${A.name}, but canUseTool is required`), Z.updatedInput) X = Z.updatedInput;
        V = await z(A, X, Y, _, q)
    } else if (Z !== void 0 && Z.behavior === "deny")
        k(`Hook denied tool use for ${A.name}`), V = Z;
    else {
        let u = Z?.behavior === "ask" ? Z : void 0;
        if (Z?.behavior === "ask" && Z.updatedInput) X = Z.updatedInput;
        V = await z(A, X, Y, _, q, u)
    }
    // ... continue with execution or denial ...
}

// READABLE (for understanding):
async function executeToolCore(tool, toolUseId, input, toolUseContext, canUseTool,
                               assistantMessage, messageId, requestId, mcpServerType, mcpServerBaseUrl,
                               progressCallback) {
    // 1. Input validation against Zod schema
    let parseResult = tool.inputSchema.safeParse(input);
    if (!parseResult.success) {
        let errorMessage = formatValidationError(tool.name, parseResult.error);
        let deferredInfo = getDeferredToolHint(tool, toolUseContext.messages, toolUseContext.options.tools);
        if (deferredInfo) {
            logEvent("tengu_deferred_tool_schema_not_sent", {...});
            errorMessage += deferredInfo;
        }
        return [createToolErrorResult(toolUseId, assistantMessage, `InputValidationError: ${errorMessage}`)];
    }

    // 2. Custom validation (tool-specific)
    let customValidation = await tool.validateInput?.(parseResult.data, toolUseContext);
    if (customValidation?.result === false) {
        return [createToolErrorResult(toolUseId, assistantMessage, customValidation.message)];
    }

    // 3. Run pre-tool hooks
    let shouldPreventContinuation = false;
    let stopReason;
    let hookPermissionResult;
    let messages = [];
    let hookStartTime = Date.now();

    for await (let hookResult of executePreToolHooksIterator(
        toolUseContext, tool, parseResult.data, toolUseId, messageId, requestId, mcpServerType, mcpServerBaseUrl
    )) {
        switch (hookResult.type) {
            case "message":
                if (hookResult.message.message.type === "progress") {
                    progressCallback(hookResult.message.message);
                } else {
                    messages.push(hookResult.message);
                }
                break;
            case "hookPermissionResult":
                hookPermissionResult = hookResult.hookPermissionResult;
                break;
            case "hookUpdatedInput":
                parseResult.data = hookResult.updatedInput;
                break;
            case "preventContinuation":
                shouldPreventContinuation = hookResult.shouldPreventContinuation;
                break;
            case "stopReason":
                stopReason = hookResult.stopReason;
                break;
            case "stop":
                return [...messages, createToolErrorResult(toolUseId, assistantMessage, stopReason)];
        }
    }

    // 4. Permission decision matrix
    let permissionResult;

    if (hookPermissionResult !== undefined &&
        hookPermissionResult.behavior === "allow" &&
        !tool.requiresUserInteraction?.() &&
        !toolUseContext.requireCanUseTool) {
        // Hook approved, bypass permission check
        log(`Hook approved tool use for ${tool.name}, bypassing permission check`);
        permissionResult = hookPermissionResult;
    } else if (hookPermissionResult !== undefined &&
               hookPermissionResult.behavior === "allow" &&
               (tool.requiresUserInteraction?.() || toolUseContext.requireCanUseTool)) {
        // Hook approved, but still need permission check
        log(`Hook approved tool use for ${tool.name}, but canUseTool is required`);
        if (hookPermissionResult.updatedInput) {
            parseResult.data = hookPermissionResult.updatedInput;
        }
        permissionResult = await canUseTool(tool, parseResult.data, toolUseContext, assistantMessage, toolUseId);
    } else if (hookPermissionResult !== undefined &&
               hookPermissionResult.behavior === "deny") {
        // Hook denied
        log(`Hook denied tool use for ${tool.name}`);
        permissionResult = hookPermissionResult;
    } else {
        // No hook result, need to ask user
        let askContext = hookPermissionResult?.behavior === "ask" ? hookPermissionResult : undefined;
        if (hookPermissionResult?.behavior === "ask" && hookPermissionResult.updatedInput) {
            parseResult.data = hookPermissionResult.updatedInput;
        }
        permissionResult = await canUseTool(tool, parseResult.data, toolUseContext, assistantMessage, toolUseId, askContext);
    }

    // 5. Track decision for learning
    if (permissionResult.behavior !== "ask" && !toolUseContext.toolDecisions?.has(toolUseId)) {
        let decision = permissionResult.behavior === "allow" ? "accept" : "reject";
        let source = permissionResult.decisionReason?.type === "hook" ? "hook" : "config";
        logDecision("tool_decision", { decision, source, tool_name: sanitizeToolName(tool.name) });
    }

    // 6. Execute or return denial
    if (permissionResult.behavior !== "allow") {
        log(`${tool.name} tool permission denied`);
        // ... handle denial ...
        return [createDenialResult(...)];
    }

    // 7. Execute the tool
    let result = await tool.call(parseResult.data, toolUseContext, progressCallback);
    // ... process result ...
}

// Mapping: fxY→executeToolCore, A→tool, q→toolUseId, K→input, Y→toolUseContext,
//   z→canUseTool, _→assistantMessage, w→messageId, O→requestId, $→mcpServerType,
//   H→mcpServerBaseUrl, j→progressCallback, V4q→formatValidationError, y4q→executePreToolHooksIterator
```

### Permission Decision Tree

The permission system determines whether a tool can execute without user approval:

```
                    ┌─────────────────────────────────────┐
                    │    PreToolUse Hook Execution        │
                    │    (executePreToolHooksIterator)    │
                    └─────────────────┬───────────────────┘
                                      │
                    ┌─────────────────▼───────────────────┐
                    │   hookPermissionResult.behavior?    │
                    └─────────────────┬───────────────────┘
                                      │
         ┌────────────────────────────┼────────────────────────────┐
         │                            │                            │
         ▼                            ▼                            ▼
      "allow"                       "deny"                       "ask"
         │                            │                            │
         ▼                            ▼                            ▼
┌────────────────────┐    ┌────────────────────┐    ┌────────────────────┐
│ requiresUser       │    │ Return error       │    │ Pass hook result   │
│ Interaction()?     │    │ immediately        │    │ to canUseTool      │
└────────┬───────────┘    └────────────────────┘    └────────────────────┘
         │
    ┌────┴────┐
    │         │
   Yes        No
    │         │
    ▼         ▼
┌────────┐  ┌────────────────────────────────────────┐
│ Call   │  │ Bypass canUseTool                       │
│canUse  │  │ Hook already approved the operation     │
│Tool()  │  └────────────────────────────────────────┘
└────────┘
```

**Permission Resolution Steps:**

1. **Hook Result "allow" + no user interaction required**: Bypass permission check entirely
2. **Hook Result "allow" + user interaction required**: Still call `canUseTool()` but hook pre-approves
3. **Hook Result "deny"**: Return error immediately, don't ask user
4. **Hook Result "ask"**: Pass context to `canUseTool()` for user interaction
5. **No hook result**: Call `canUseTool()` normally

**Why this approach:**
- **Hook flexibility**: Hooks can pre-approve operations for known-safe contexts (e.g., test files)
- **User interaction gating**: Some tools (like Bash) always require user interaction for safety
- **Deny shortcut**: Hooks can immediately block dangerous operations without user prompts
- **Ask passthrough**: Hooks can provide context to the permission prompt (e.g., "This file matches pattern X")

**Key insight:** The permission decision matrix balances automation with safety. Hooks enable automation for trusted contexts, while `requiresUserInteraction()` ensures that inherently risky operations (shell commands, file writes) always require explicit approval.

### Hook Integration

**Pre-Tool Hooks (B1q):**
- Run before tool execution
- Can modify input (`hookUpdatedInput`)
- Can approve/deny (`hookPermissionResult`)
- Can stop execution (`stop`)

**Post-Tool Hooks (b1q):**
- Run after tool completes
- Receive tool name, input, and result
- Enable post-execution processing

---

## Result Feedback Loop

### Tool Result Construction

After tool execution, the result is wrapped in a `tool_result` message:

```javascript
{
    message: createUserMessage({
        content: [{
            type: "tool_result",
            content: result.data,
            tool_use_id: toolUseId,
            ...(result.isError ? { is_error: true } : {})
        }],
        toolUseResult: typeof result.data === "string" ? result.data : JSON.stringify(result.data),
        sourceToolAssistantUUID: assistantMessage.uuid
    })
}
```

### File Operation Tracking

Tools that modify files trigger tracking:
- Read tool: tracks `file_path`
- Edit/Write tools: tracks `file_path`
- Bash tool: tracks `full_command` (sanitized)

### Telemetry Recording

Every tool execution records:
```javascript
logEvent("tengu_tool_use_success", {
    messageID: messageId,
    toolName: sanitizeToolName(tool.name),
    isMcp: tool.isMcp ?? false,
    durationMs: executionDuration,
    toolResultSizeBytes: resultSizeBytes,
    queryChainId: toolUseContext.queryTracking?.chainId,
    queryDepth: toolUseContext.queryTracking?.depth,
    mcpServerType: mcpServerType,
    mcpServerUrl: mcpServerUrl
});
```

---

## Parallel vs Sequential Execution

### When to Use Each

| Mode | When Used | Characteristics |
|------|-----------|-----------------|
| Streaming Parallel | `tengu_streaming_tool_execution2` flag enabled | Lower latency, tools run during stream |
| Sequential | Flag disabled, post-stream, or fallback | Simpler, guaranteed ordering |

### Execution Flows

**Streaming:**
```
Stream Event: tool_use
    ├──► Immediately start toolDispatcher()
    │
    └─ Stream continues meanwhile
        Stream Event: tool_use (parallel)
        └──► Runs in parallel with first tool
Stream completes
    └──► getRemainingResults() drains pending
```

**Sequential:**
```
Stream completes with all tool_use blocks
    ├──► executeToolsSequentially()
    │    ├── toolDispatcher(tool_use_1) → Execute → Yield result
    │    ├── toolDispatcher(tool_use_2) → Execute → Yield result
    │    └── (etc.)
```

---

## MCP Tool Handling

### MCP Tool Name Parsing

MCP tool names follow format: `mcp__<server_name>__<tool_name>`

### MCP Server Type Detection

Detects connection type:
- "stdio": Standard input/output
- "sse": Server-sent events
- "streamable-http": HTTP streaming

---

## Error Handling

**Tool Not Found**: Returns error message "No such tool available"

**Input Validation Error**: Returns `InputValidationError` with details

**Permission Denied**: Returns error with denial reason

**Execution Error**: Wraps error in tool_result with `is_error: true`

---

## Summary

Tool integration in Claude Code 2.1.76:

1. **Optimizes token usage** through deferred tool loading
2. **Reduces latency** via streaming parallel tool execution
3. **Provides security** through the permission system with hook integration
4. **Maintains observability** with comprehensive telemetry
5. **Handles errors gracefully** with informative error messages returned to the LLM

The separation of concerns between schema building, dispatch, execution, and result handling allows each phase to be optimized independently.

---

## Permission Decision Matrix (VERIFIED)

### executeToolCore (fxY) - Permission Decision Logic

**What it does:** Determines whether a tool can execute based on hook results, tool requirements, and permission context.

**Source Code (VERIFIED):**

```javascript
// ============================================
// Permission Decision Matrix - executeToolCore permission logic
// Location: chunks.146.mjs:589-600
// ============================================

// ORIGINAL (for source lookup):
az4(A.name, N, a$() ? B6(X) : void 0), sz4();
let V;
if (Z !== void 0 && Z.behavior === "allow" && !A.requiresUserInteraction?.() && !Y.requireCanUseTool) k(`Hook approved tool use for ${A.name}, bypassing permission check`), V = Z;
else if (Z !== void 0 && Z.behavior === "allow" && (A.requiresUserInteraction?.() || Y.requireCanUseTool)) {
    if (k(`Hook approved tool use for ${A.name}, but canUseTool is required`), Z.updatedInput) X = Z.updatedInput;
    V = await z(A, X, Y, _, q)
} else if (Z !== void 0 && Z.behavior === "deny") k(`Hook denied tool use for ${A.name}`), V = Z;
else {
    let u = Z?.behavior === "ask" ? Z : void 0;
    if (Z?.behavior === "ask" && Z.updatedInput) X = Z.updatedInput;
    V = await z(A, X, Y, _, q, u)
}

// READABLE (for understanding):
// Record tool input for telemetry
recordToolInput(tool.name, inputMetadata, JSON.stringify(input) /* if sampling enabled */);
resetPermissionRequestState();

let permissionResult;

// Case 1: Hook approved AND tool doesn't require user interaction AND context doesn't require canUseTool
// → BYPASS permission check entirely
if (hookPermissionResult !== undefined &&
    hookPermissionResult.behavior === "allow" &&
    !tool.requiresUserInteraction?.() &&
    !toolUseContext.requireCanUseTool) {
    log(`Hook approved tool use for ${tool.name}, bypassing permission check`);
    permissionResult = hookPermissionResult;
}

// Case 2: Hook approved BUT tool requires user interaction OR context requires canUseTool
// → Still call canUseTool() but hook pre-approves
else if (hookPermissionResult !== undefined &&
         hookPermissionResult.behavior === "allow" &&
         (tool.requiresUserInteraction?.() || toolUseContext.requireCanUseTool)) {
    log(`Hook approved tool use for ${tool.name}, but canUseTool is required`);
    if (hookPermissionResult.updatedInput) {
        input = hookPermissionResult.updatedInput;
    }
    permissionResult = await canUseTool(tool, input, toolUseContext, assistantMessage, toolUseId);
}

// Case 3: Hook denied
// → Return error immediately, don't ask user
else if (hookPermissionResult !== undefined &&
         hookPermissionResult.behavior === "deny") {
    log(`Hook denied tool use for ${tool.name}`);
    permissionResult = hookPermissionResult;
}

// Case 4: No hook result or hook returned "ask"
// → Call canUseTool() normally
else {
    let askContext = hookPermissionResult?.behavior === "ask" ? hookPermissionResult : undefined;
    if (hookPermissionResult?.behavior === "ask" && hookPermissionResult.updatedInput) {
        input = hookPermissionResult.updatedInput;
    }
    permissionResult = await canUseTool(tool, input, toolUseContext, assistantMessage, toolUseId, askContext);
}

// Mapping: V→permissionResult, Z→hookPermissionResult, A→tool, Y→toolUseContext,
//   X→input, _→assistantMessage, q→toolUseId, z→canUseTool, k→log
```

**Why this approach:**
- **Hook flexibility**: Hooks can pre-approve operations for known-safe contexts (e.g., test files)
- **User interaction gating**: Some tools (like Bash) always require user interaction for safety via `requiresUserInteraction()`
- **Deny shortcut**: Hooks can immediately block dangerous operations without user prompts
- **Ask passthrough**: Hooks can provide context to the permission prompt (e.g., "This file matches pattern X")

**Key insight:** The permission decision matrix balances automation with safety. Hooks enable automation for trusted contexts, while `requiresUserInteraction()` ensures that inherently risky operations (shell commands, file writes) always require explicit approval.

---

## Concurrency Safety Algorithm (VERIFIED)

### canExecuteTool - Determine if tool can run in parallel

**What it does:** Checks whether a tool can start executing based on what's currently running.

**Source Code (VERIFIED):**

```javascript
// ============================================
// canExecuteTool - Concurrency safety check
// Location: chunks.148.mjs:62-65
// ============================================

// ORIGINAL (for source lookup):
canExecuteTool(A) {
    let q = this.tools.filter((K) => K.status === "executing");
    return q.length === 0 || A && q.every((K) => K.isConcurrencySafe)
}

// READABLE (for understanding):
canExecuteTool(isConcurrencySafe) {
    let executingTools = this.tools.filter((tool) => tool.status === "executing");

    // Can execute if:
    // 1. Nothing is currently executing, OR
    // 2. New tool is safe AND all currently executing tools are also safe
    return executingTools.length === 0 ||
           (isConcurrencySafe && executingTools.every((tool) => tool.isConcurrencySafe));
}
```

**Concurrency Safety Decision Table:**

| Currently Executing | New Tool | Can Execute? | Reason |
|---------------------|----------|--------------|--------|
| None | Any | ✅ Yes | Nothing to conflict with |
| Safe tools only | Safe | ✅ Yes | All tools are parallel-safe |
| Safe tools only | Unsafe | ❌ No | Unsafe tool must wait |
| Any unsafe tool | Any | ❌ No | Unsafe tool blocks all others |

**Safe vs Unsafe Tools:**

| Category | Tools | Reason |
|----------|-------|--------|
| **Safe** | Read, Glob, Grep | Read-only, no side effects |
| **Unsafe** | Write, Edit, Bash, NotebookEdit | Modifies state, potential conflicts |

**Key insight:** An unsafe tool (like Bash) blocks all other tools from starting until it completes. This prevents race conditions where two tools try to modify the same file simultaneously, or where a read happens during a write.

---

## Visual Decision Trees

### Concurrency Safety Decision Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    StreamingToolExecutor.canExecuteTool()               │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │  Get tools with status        │
                    │  "executing"                  │
                    └───────────────┬───────────────┘
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │   executingTools.length === 0?│
                    └───────────────┬───────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │ Yes                           │ No
                    ▼                               ▼
            ┌───────────────┐           ┌───────────────────────────┐
            │ Return TRUE   │           │ isConcurrencySafe(newTool)│
            │ Start tool    │           └───────────┬───────────────┘
            └───────────────┘                       │
                                    ┌───────────────┴───────────────┐
                                    │ False                         │ True
                                    ▼                               ▼
                            ┌───────────────┐           ┌───────────────────────────┐
                            │ Return FALSE  │           │ ALL executing tools       │
                            │ Wait          │           │ isConcurrencySafe?        │
                            └───────────────┘           └───────────┬───────────────┘
                                                                    │
                                                    ┌───────────────┴───────────────┐
                                                    │ Yes                           │ No
                                                    ▼                               ▼
                                            ┌───────────────┐           ┌───────────────┐
                                            │ Return TRUE   │           │ Return FALSE  │
                                            │ Start tool    │           │ Wait          │
                                            └───────────────┘           └───────────────┘
```

### Permission Decision Flow (executeToolCore)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    executeToolCore (fxY) Entry                          │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │   Input Schema Validation     │
                    │   tool.inputSchema.safeParse  │
                    └───────────────┬───────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │ Invalid                       │ Valid
                    ▼                               ▼
            ┌───────────────┐           ┌───────────────────────────┐
            │ Return error  │           │ Run Pre-Tool Hooks        │
            │ message       │           │ executePreToolHooksIterator│
            └───────────────┘           └───────────┬───────────────┘
                                                    │
                                                    ▼
                                    ┌───────────────────────────────┐
                                    │   hookPermissionResult.behavior│
                                    └───────────────┬───────────────┘
                                                    │
            ┌───────────────────┬───────────────────┼───────────────────┬───────────────────┐
            │                   │                   │                   │
            ▼                   ▼                   ▼                   ▼
    ┌───────────────┐   ┌───────────────┐   ┌───────────────┐   ┌───────────────┐
    │ "allow"       │   │ "deny"        │   │ "ask"         │   │ undefined     │
    └───────┬───────┘   └───────┬───────┘   └───────┬───────┘   └───────┬───────┘
            │                   │                   │                   │
            ▼                   ▼                   ▼                   ▼
    ┌───────────────┐   ┌───────────────┐   ┌───────────────┐   ┌───────────────┐
    │requiresUser   │   │ Return error  │   │ Pass context  │   │ Call          │
    │Interaction()? │   │ immediately   │   │ to canUseTool │   │ canUseTool()  │
    └───────┬───────┘   └───────────────┘   └───────────────┘   └───────────────┘
            │
    ┌───────┴───────┐
    │ Yes           │ No
    ▼               ▼
┌───────────────┐ ┌───────────────────────────────────────────────────────┐
│ Call          │ │ BYPASS permission check                               │
│ canUseTool()  │ │ Hook already approved - execute immediately          │
└───────────────┘ └───────────────────────────────────────────────────────┘
```

### Tool Execution State Machine

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    Tool Execution State Transitions                      │
└─────────────────────────────────────────────────────────────────────────┘

State: "queued"
    │
    │ canExecuteTool() returns true
    │
    ▼
State: "executing"
    │
    │ ├── Tool completes successfully ──────────────► State: "completed"
    │ │                                                   │
    │ │                                                   │ results[] populated
    │ │                                                   │
    │ ├── Tool errors ──────────────────────────────► State: "completed" (with error)
    │ │                                                   │
    │ │                                                   │ results[] contains error
    │ │                                                   │
    │ └── User aborts ──────────────────────────────► State: "completed" (synthetic)
                                                        │
                                                        │ Synthetic error message
                                                        │ created
                                                        │
                                                        ▼
                                                State: "yielded"
                                                        │
                                                        │ Results returned to
                                                        │ main agent loop
                                                        │
                                                        ▼
                                                (Final state)
```

---

## Complete Tool Execution Sequence

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    Tool Execution from LLM Response to Result           │
└─────────────────────────────────────────────────────────────────────────┘

LLM Response (streaming)
    │
    │ content_block_start: { type: "tool_use", name: "Read", id: "xxx" }
    │
    ▼
StreamingToolExecutor.addTool()
    │
    ├── Look up tool definition
    │       └── dK(this.toolDefinitions, toolName)
    │
    ├── Normalize input (apply aliases)
    │       └── PE1(tool, input)
    │
    ├── Validate against Zod schema
    │       └── tool.inputSchema.safeParse(input)
    │
    ├── Determine concurrency safety
    │       └── tool.isConcurrencySafe(parsedInput)
    │
    └── Add to queue with status: "queued"
            │
            │ processQueue()
            │
            ▼
    canExecuteTool(isConcurrencySafe)
            │
            ├── TRUE ────► executeTool()
            │                   │
            │                   ├── Create abort controller clone
            │                   │       └── Wm(this.siblingAbortController)
            │                   │
            │                   ├── Call toolDispatcher (Wi6)
            │                   │       │
            │                   │       ├── Validate input
            │                   │       ├── Run pre-tool hooks (y4q)
            │                   │       ├── Check permissions (canUseTool)
            │                   │       ├── Execute tool.call()
            │                   │       └── Run post-tool hooks
            │                   │
            │                   └── Store results
            │                           └── tool.results = [...messages]
            │
            └── FALSE ────► Wait (tool stays in queue)
                                │
                                │ After current tools complete
                                │
                                └── Retry canExecuteTool()
```

---

## Summary

Tool integration in Claude Code 2.1.76 provides:

1. **Schema building** with deferred loading optimization
2. **Streaming parallel execution** with concurrency safety
3. **Permission system** with hook integration
4. **Comprehensive telemetry** for observability
5. **Graceful error handling** with informative messages

The key innovations are:
- **StreamingToolExecutor**: Parallel tool execution with safety guarantees
- **Permission Decision Matrix**: Hooks can pre-approve or deny without user prompts
- **Concurrency Safety**: Read-only tools can run in parallel, write operations are serialized

---

## Sibling Abort Controller Pattern

**What it does:**
The sibling abort controller pattern enables coordinated cancellation of parallel tool executions. When one tool fails catastrophically, other parallel tools may need to be cancelled.

**How it works:**

```javascript
// ============================================
// cloneAbortController - Creates sibling abort controller for tool isolation
// Location: chunks.148.mjs:16
// ============================================

// ORIGINAL (for source lookup):
function Wm(A) {
    let q = new AbortController();
    A.signal.addEventListener("abort", () => {
        q.abort(A.signal.reason)
    });
    return q
}

// READABLE (for understanding):
function cloneAbortController(parentController) {
    let siblingController = new AbortController();

    // Propagate parent abort to sibling
    parentController.signal.addEventListener("abort", () => {
        siblingController.abort(parentController.signal.reason);
    });

    return siblingController;
}

// Mapping: Wm→cloneAbortController, A→parentController, q→siblingController
```

**Why this approach:**
- **Isolation**: Each tool gets its own controller, allowing individual cancellation
- **Propagation**: Parent abort (user cancellation) automatically cascades to all tools
- **Bidirectional signaling**: A tool can signal sibling errors without affecting parent

**Key insight:** The sibling controller is created in the StreamingToolExecutor constructor:
```javascript
this.siblingAbortController = cloneAbortController(toolUseContext.abortController);
```

When a Bash tool fails with an error, it calls:
```javascript
this.siblingAbortController.abort("sibling_error");
```

This signals other parallel tools that a sibling has failed, but doesn't trigger the main abort controller (which would indicate user cancellation).

---

## Tool Execution Lifecycle State Machine

```
TOOL EXECUTION LIFECYCLE
========================

        ┌──────────────┐
        │   CREATED    │  Tool object exists, not yet called
        └──────┬───────┘
               │ StreamingToolExecutor.addTool()
               ▼
        ┌──────────────┐
        │    QUEUED    │  Waiting in executor queue
        └──────┬───────┘
               │ canExecuteTool() returns true
               ▼
        ┌──────────────┐
        │  EXECUTING   │  Tool.call() is running
        └──────┬───────┘
               │ Tool completes (success or error)
               ▼
        ┌──────────────┐
        │  COMPLETED   │  Results stored, ready to yield
        └──────┬───────┘
               │ getCompletedResults() called
               ▼
        ┌──────────────┐
        │   YIELDED    │  Results returned to main agent loop
        └──────────────┘


TRANSITIONS:

QUEUED → EXECUTING:
  - Condition: canExecuteTool(isConcurrencySafe) returns true
  - Action: Set status to "executing", call executeTool()

EXECUTING → COMPLETED:
  - Condition: Tool.call() finishes (resolve or reject)
  - Action: Store results, set status to "completed"

COMPLETED → YIELDED:
  - Condition: getCompletedResults() iterates
  - Action: Mark as yielded to prevent re-yield
```

---

## Complete StreamingToolExecutor Method Reference

### Constructor
```javascript
constructor(toolDefinitions, canUseTool, toolUseContext)
```
- **toolDefinitions**: Array of available tool objects
- **canUseTool**: Permission function (may require user approval)
- **toolUseContext**: Execution context including abortController

### Instance Methods

| Method | Purpose |
|--------|---------|
| `discard()` | Mark executor as discarded, skip result yielding |
| `addTool(toolUseBlock, assistantMessage)` | Queue a tool for execution |
| `canExecuteTool(isConcurrencySafe)` | Check if parallel execution allowed |
| `processQueue()` | Execute queued tools respecting concurrency |
| `executeTool(toolEntry)` | Core execution with sibling abort controller |
| `getCompletedResults()` | Generator yielding finished tool results |
| `getRemainingResults()` | Async generator for draining unfinished tools |
| `hasCompletedResults()` | Check if any tools have finished |
| `hasExecutingTools()` | Check if any tools still running |
| `hasUnfinishedTools()` | Check if any tools not yet yielded |
| `getUpdatedContext()` | Return context with modifications from tools |

### Instance Properties

| Property | Type | Description |
|----------|------|-------------|
| `toolDefinitions` | Array | Available tools for lookup |
| `canUseTool` | Function | Permission check function |
| `tools` | Array | Queued/executing/completed tools |
| `toolUseContext` | Object | Execution context |
| `hasErrored` | Boolean | Whether a Bash tool failed |
| `erroredToolDescription` | String | Description of failed tool |
| `siblingAbortController` | AbortController | Controller for coordinated cancellation |
| `discarded` | Boolean | If true, skip result yielding |
| `progressAvailableResolve` | Function | Resolver for progress promise |

---

## Deep Algorithm Analysis: executeTool Method

**What it does:**
The `executeTool` method is the core execution engine within StreamingToolExecutor. It handles the complex interplay between tool execution, abort handling, progress tracking, and context modification.

**Location:** chunks.148.mjs:138-179

**Source Code (VERIFIED):**

```javascript
// ============================================
// executeTool - Core tool execution with abort handling and progress tracking
// Location: chunks.148.mjs:138-179
// ============================================

// ORIGINAL (for source lookup):
async executeTool(A) {
    A.status = "executing", this.toolUseContext.setInProgressToolUseIDs((_) => new Set([..._, A.id])), this.updateInterruptibleState();
    let q = [],
        K = [],
        z = (async () => {
            let _ = this.getAbortReason(A);
            if (_) {
                q.push(this.createSyntheticErrorMessage(A.id, _, A.assistantMessage)), A.results = q, A.contextModifiers = K, A.status = "completed", this.updateInterruptibleState();
                return
            }
            let w = Wm(this.siblingAbortController);
            w.signal.addEventListener("abort", () => {
                if (w.signal.reason !== "sibling_error" && !this.toolUseContext.abortController.signal.aborted && !this.discarded) this.toolUseContext.abortController.abort(w.signal.reason)
            }, {
                once: !0
            });
            let O = Wi6(A.block, A.assistantMessage, this.canUseTool, {
                    ...this.toolUseContext,
                    abortController: w
                }),
                $ = !1;
            for await (let H of O) {
                let j = this.getAbortReason(A);
                if (j && !$) {
                    q.push(this.createSyntheticErrorMessage(A.id, j, A.assistantMessage));
                    break
                }
                if (H.message.type === "user" && Array.isArray(H.message.message.content) && H.message.message.content.some((M) => M.type === "tool_result" && M.is_error === !0)) {
                    if ($ = !0, A.block.name === Q7) this.hasErrored = !0, this.erroredToolDescription = this.getToolDescription(A), this.siblingAbortController.abort("sibling_error")
                }
                if (H.message)
                    if (H.message.type === "progress") {
                        if (A.pendingProgress.push(H.message), this.progressAvailableResolve) this.progressAvailableResolve(), this.progressAvailableResolve = void 0
                    } else q.push(H.message);
                if (H.contextModifier) K.push(H.contextModifier.modifyContext)
            }
            if (A.results = q, A.contextModifiers = K, A.status = "completed", this.updateInterruptibleState(), !A.isConcurrencySafe && K.length > 0)
                for (let H of K) this.toolUseContext = H(this.toolUseContext)
        })();
    A.promise = z, z.finally(() => {
        this.processQueue()
    })
}

// READABLE (for understanding):
async executeTool(toolEntry) {
    // Phase 1: Initialize execution state
    toolEntry.status = "executing";
    this.toolUseContext.setInProgressToolUseIDs((ids) => new Set([...ids, toolEntry.id]));
    this.updateInterruptibleState();

    let results = [];
    let contextModifiers = [];

    // Phase 2: Main execution coroutine
    let executionPromise = (async () => {
        // Check for pre-execution abort (user cancelled, sibling error, or discarded)
        let abortReason = this.getAbortReason(toolEntry);
        if (abortReason) {
            results.push(this.createSyntheticErrorMessage(
                toolEntry.id,
                abortReason,
                toolEntry.assistantMessage
            ));
            toolEntry.results = results;
            toolEntry.contextModifiers = contextModifiers;
            toolEntry.status = "completed";
            this.updateInterruptibleState();
            return;
        }

        // Phase 3: Create isolated abort controller for this tool
        let toolAbortController = cloneAbortController(this.siblingAbortController);

        // Phase 4: Set up abort propagation from sibling to parent
        toolAbortController.signal.addEventListener("abort", () => {
            // Only propagate to parent if:
            // - Not a sibling_error (we handle that separately)
            // - Parent not already aborted
            // - Executor not discarded
            if (toolAbortController.signal.reason !== "sibling_error" &&
                !this.toolUseContext.abortController.signal.aborted &&
                !this.discarded) {
                this.toolUseContext.abortController.abort(toolAbortController.signal.reason);
            }
        }, { once: true });

        // Phase 5: Create tool dispatcher generator
        let toolGenerator = toolDispatcher(
            toolEntry.block,
            toolEntry.assistantMessage,
            this.canUseTool,
            { ...this.toolUseContext, abortController: toolAbortController }
        );

        let hasError = false;

        // Phase 6: Process tool execution stream
        for await (let event of toolGenerator) {
            // Check for mid-execution abort
            let abortReason = this.getAbortReason(toolEntry);
            if (abortReason && !hasError) {
                results.push(this.createSyntheticErrorMessage(
                    toolEntry.id,
                    abortReason,
                    toolEntry.assistantMessage
                ));
                break;
            }

            // Phase 7: Detect tool errors for cascading abort
            if (event.message.type === "user" &&
                Array.isArray(event.message.message.content) &&
                event.message.message.content.some(
                    (block) => block.type === "tool_result" && block.is_error === true
                )) {
                hasError = true;

                // Bash tool errors cascade to siblings
                if (toolEntry.block.name === BASH_TOOL_NAME) {
                    this.hasErrored = true;
                    this.erroredToolDescription = this.getToolDescription(toolEntry);
                    this.siblingAbortController.abort("sibling_error");
                }
            }

            // Phase 8: Handle progress vs final messages
            if (event.message) {
                if (event.message.type === "progress") {
                    // Progress messages are buffered for later yield
                    toolEntry.pendingProgress.push(event.message);

                    // Notify waiter if one exists
                    if (this.progressAvailableResolve) {
                        this.progressAvailableResolve();
                        this.progressAvailableResolve = void 0;
                    }
                } else {
                    // Final messages go to results array
                    results.push(event.message);
                }
            }

            // Phase 9: Collect context modifiers
            if (event.contextModifier) {
                contextModifiers.push(event.contextModifier.modifyContext);
            }
        }

        // Phase 10: Finalize execution
        toolEntry.results = results;
        toolEntry.contextModifiers = contextModifiers;
        toolEntry.status = "completed";
        this.updateInterruptibleState();

        // Phase 11: Apply context modifiers (only for non-concurrency-safe tools)
        // This ensures state mutations are applied in order
        if (!toolEntry.isConcurrencySafe && contextModifiers.length > 0) {
            for (let modifier of contextModifiers) {
                this.toolUseContext = modifier(this.toolUseContext);
            }
        }
    })();

    // Phase 12: Store promise and schedule queue processing
    toolEntry.promise = executionPromise;
    executionPromise.finally(() => {
        this.processQueue();  // Check if more tools can now execute
    });
}

// Mapping: executeTool→executeTool, A→toolEntry, q→results, K→contextModifiers,
//   z→executionPromise, Wm→cloneAbortController, Wi6→toolDispatcher, Q7→BASH_TOOL_NAME
```

### Algorithm Breakdown: The 12 Phases

| Phase | Name | Purpose |
|-------|------|---------|
| 1 | Initialize | Set status, update UI state tracking |
| 2 | Pre-abort check | Exit early if cancelled before starting |
| 3 | Isolated controller | Create sibling abort controller for isolation |
| 4 | Propagation setup | Configure abort signal propagation |
| 5 | Generator creation | Start tool dispatcher async generator |
| 6 | Stream processing | Process events from tool execution |
| 7 | Error detection | Check for cascading abort conditions |
| 8 | Message routing | Route progress vs final messages |
| 9 | Context collection | Gather context modification functions |
| 10 | Finalization | Store results, update status |
| 11 | Context application | Apply mutations for non-safe tools |
| 12 | Queue processing | Trigger next tool execution |

### Key Insight: Why Context Modifiers Only Apply to Non-Safe Tools

```javascript
if (!toolEntry.isConcurrencySafe && contextModifiers.length > 0) {
    for (let modifier of contextModifiers) {
        this.toolUseContext = modifier(this.toolUseContext);
    }
}
```

**Why this approach:**
- **Concurrency-safe tools** run in parallel, so their context modifications could race
- **Non-safe tools** are serialized, guaranteeing modification order
- **State consistency**: Only serialized tools can mutate shared state
- **Examples**: Edit tool changes file state, Bash modifies working directory

---

## Deep Algorithm Analysis: getAbortReason Method

**What it does:**
Determines why a tool should be aborted, if at all. This method is called multiple times during tool execution to check for cancellation conditions.

**Location:** chunks.148.mjs:107-115

**Source Code (VERIFIED):**

```javascript
// ============================================
// getAbortReason - Determines tool abort reason
// Location: chunks.148.mjs:107-115
// ============================================

// ORIGINAL (for source lookup):
getAbortReason(A) {
    if (this.discarded) return "streaming_fallback";
    if (this.hasErrored) return "sibling_error";
    if (this.toolUseContext.abortController.signal.aborted) {
        if (this.toolUseContext.abortController.signal.reason === "interrupt") return this.getToolInterruptBehavior(A) === "cancel" ? "user_interrupted" : null;
        return "user_interrupted"
    }
    return null
}

// READABLE (for understanding):
getAbortReason(toolEntry) {
    // Priority 1: Executor was discarded (streaming fell back to sequential)
    if (this.discarded) {
        return "streaming_fallback";
    }

    // Priority 2: A sibling Bash tool errored
    if (this.hasErrored) {
        return "sibling_error";
    }

    // Priority 3: User aborted (check interrupt behavior)
    if (this.toolUseContext.abortController.signal.aborted) {
        // Check if tool can be interrupted
        if (this.toolUseContext.abortController.signal.reason === "interrupt") {
            // Tool-specific interrupt behavior
            return this.getToolInterruptBehavior(toolEntry) === "cancel"
                ? "user_interrupted"
                : null;  // Tool wants to block, not cancel
        }
        return "user_interrupted";
    }

    // No abort condition
    return null;
}

// Mapping: getAbortReason→getAbortReason, A→toolEntry
```

### Abort Reason Priority Table

| Priority | Reason | Condition | Effect |
|----------|--------|-----------|--------|
| 1 | `streaming_fallback` | `this.discarded` | Tool skipped, executor replaced |
| 2 | `sibling_error` | `this.hasErrored` | Cascading cancellation from Bash failure |
| 3 | `user_interrupted` | Parent abort + cancel behavior | User cancelled the operation |
| - | `null` | No abort condition | Continue execution |

### Key Insight: Interrupt Behavior

Some tools can opt to **block** instead of **cancel** on interrupt:

```javascript
getToolInterruptBehavior(toolEntry) {
    let tool = findTool(this.toolDefinitions, toolEntry.block.name);
    if (!tool?.interruptBehavior) return "block";  // Default
    try {
        return tool.interruptBehavior();
    } catch {
        return "block";
    }
}
```

**Why this matters:**
- **Block behavior**: Tool continues running, user sees "waiting for tool"
- **Cancel behavior**: Tool receives abort signal, cleans up and exits
- **Example**: Bash with long-running command may want to block

---

## Deep Algorithm Analysis: getRemainingResults Method

**What it does:**
Async generator that drains all remaining tool results after the LLM stream completes. Uses sophisticated waiting logic to avoid busy-polling.

**Location:** chunks.148.mjs:201-215

**Source Code (VERIFIED):**

```javascript
// ============================================
// getRemainingResults - Async generator for draining unfinished tools
// Location: chunks.148.mjs:201-215
// ============================================

// ORIGINAL (for source lookup):
async * getRemainingResults() {
    if (this.discarded) return;
    while (this.hasUnfinishedTools()) {
        await this.processQueue();
        for (let A of this.getCompletedResults()) yield A;
        if (this.hasExecutingTools() && !this.hasCompletedResults() && !this.hasPendingProgress()) {
            let A = this.tools.filter((K) => K.status === "executing" && K.promise).map((K) => K.promise),
                q = new Promise((K) => {
                    this.progressAvailableResolve = K
                });
            if (A.length > 0) await Promise.race([...A, q])
        }
    }
    for (let A of this.getCompletedResults()) yield A
}

// READABLE (for understanding):
async *getRemainingResults() {
    if (this.discarded) return;

    // Main drain loop
    while (this.hasUnfinishedTools()) {
        // Try to process more tools
        await this.processQueue();

        // Yield any completed results immediately
        for (let result of this.getCompletedResults()) {
            yield result;
        }

        // Waiting strategy: avoid busy-polling
        if (this.hasExecutingTools() &&
            !this.hasCompletedResults() &&
            !this.hasPendingProgress()) {

            // Collect promises for executing tools
            let executingPromises = this.tools
                .filter((t) => t.status === "executing" && t.promise)
                .map((t) => t.promise);

            // Create promise that resolves when progress arrives
            let progressPromise = new Promise((resolve) => {
                this.progressAvailableResolve = resolve;
            });

            // Race: first tool completes OR progress arrives
            if (executingPromises.length > 0) {
                await Promise.race([...executingPromises, progressPromise]);
            }
        }
    }

    // Final drain: yield any remaining completed results
    for (let result of this.getCompletedResults()) {
        yield result;
    }
}

// Mapping: getRemainingResults→getRemainingResults
```

### Waiting Strategy Analysis

**Why this approach:**

1. **Avoid busy-polling**: The `Promise.race` allows efficient waiting
2. **Progress responsiveness**: `progressPromise` wakes up on progress events
3. **Fair scheduling**: Each iteration yields completed results before waiting

**Race condition handling:**

```
┌─────────────────────────────────────────────────────────────────┐
│                    WAITING STRATEGY FLOW                         │
│                                                                  │
│  Check: hasExecutingTools() AND !hasCompletedResults()          │
│      │                                                           │
│      ▼                                                           │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Promise.race([                                           │   │
│  │   tool_1_promise,                                        │   │
│  │   tool_2_promise,                                        │   │
│  │   progressPromise  ← Resolved when progress arrives      │   │
│  │ ])                                                       │   │
│  └──────────────────────────────────────────────────────────┘   │
│      │                                                           │
│      ├─ Tool completes → Wake up, yield results                  │
│      ├─ Progress arrives → Wake up, yield progress               │
│      └─ All tools complete → Exit loop, final drain              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Cross-Feature Connections: Tool Integration with System Reminders

### Connection 1: Tool Results as Attachments

When tools execute, their results can become attachments that are re-injected into subsequent turns:

**Flow:**
```
Tool executes (e.g., Read tool)
    ↓
Tool result stored in message history
    ↓
Tool result marked with file_path for potential caching
    ↓
Content replacement: Large outputs replaced with <persisted-output>
    ↓
Subsequent turn: If user @mentions same file
    ↓
Attachment producer checks readFileState cache
    ↓
If unchanged: produces already_read_file (silent)
If changed: produces file (with synthetic messages)
```

**Integration points:**
- `chunks.89.mjs:2205-2210` - `applyContentReplacements` (T34)
- `chunks.174.mjs:3-469` - `normalizeAttachmentForAPI` (Ui8)
- `chunks.142.mjs:2544-2562` - `buildFileAttachmentForMention` (TyA)

### Connection 2: Hook-Generated Attachments

Pre-tool and post-tool hooks can generate attachments that modify tool behavior:

```javascript
// Pre-tool hook can inject additional context
for await (let hookResult of executePreToolHooks(toolName, input, context)) {
    if (hookResult.additionalContexts) {
        // These become attachments in the current turn
        yield {
            message: createUserMessage({
                type: "hook_additional_context",
                content: hookResult.additionalContexts,
                hookName: `PreToolUse:${toolName}`
            })
        };
    }
}
```

**Source:** chunks.146.mjs:74-216 (executePreToolHooksIterator)

### Connection 3: Bash Tool Output and File Change Detection

Bash tool execution can trigger file change attachments:

```
Bash tool modifies file (e.g., npm install)
    ↓
File watcher detects change via mtime comparison
    ↓
wIY (getChangedFilesAttachment) runs on next turn
    ↓
Produces edited_text_file attachment
    ↓
LLM sees: "Note: package.json was modified..."
```

**Why this matters:**
- **External tools**: Tools like npm, git modify files outside LLM control
- **Awareness**: System reminders keep LLM informed of external changes
- **Conflict prevention**: LLM can adjust its plan based on file changes

### Connection 4: MCP Tool Results as Context

MCP tool results are handled specially:

```javascript
// MCP tool results include server metadata
if (tool.isMcp) {
    toolResult.mcpMeta = {
        serverName: parseMcpServerName(tool.name),
        toolName: parseMcpToolName(tool.name),
        requestId: generateRequestId()
    };
}
```

**Integration with MCP resource attachments:**
- MCP tool execution may return `resource_link` blocks
- These are converted to `mcp_resource` attachments
- Subsequent turns can reference these resources via @mention

### Connection 5: Tool Permission Context and Mode Attachments

The permission context affects attachment production:

```
Plan mode (toolPermissionContext.mode === "plan")
    ↓
Plan mode attachment produced (ihY)
    ↓
LLM receives plan mode instructions
    ↓
Tool restrictions applied:
    - Edit/Write allowed on plan file only
    - Bash restricted to non-destructive commands
    - Agent tool available for exploration
```

**Source:** chunks.142.mjs:2034-2090 (getPlanModeAttachment)

---

## Cross-Feature Connections: StreamingToolExecutor with Agent Loop

### Connection 1: Interruptible State Management

StreamingToolExecutor updates interruptible state that affects UI:

```javascript
updateInterruptibleState() {
    let executing = this.tools.filter((t) => t.status === "executing");
    this.toolUseContext.setHasInterruptibleToolInProgress?.(
        executing.length > 0 &&
        executing.every((t) => this.getToolInterruptBehavior(t) === "cancel")
    );
}
```

**Why this matters:**
- **UI feedback**: User sees which tools can be cancelled
- **Keyboard handling**: Interrupt key (Ctrl+C) behavior varies by tool
- **Graceful shutdown**: Some tools need cleanup on interrupt

### Connection 2: Progress Messages and Streaming

Progress messages are buffered and yielded separately:

```javascript
if (event.message.type === "progress") {
    toolEntry.pendingProgress.push(event.message);
    if (this.progressAvailableResolve) {
        this.progressAvailableResolve();
        this.progressAvailableResolve = void 0;
    }
}
```

**Integration with UI:**
- Progress messages update streaming indicators
- `progressAvailableResolve` wakes up `getRemainingResults`
- UI shows "Building tool input..." or "Executing tool..." based on progress

### Connection 3: Tool Result UUIDs and Message Correlation

Tool results reference their parent assistant message:

```javascript
results.push(createUserMessage({
    content: [...],
    toolUseResult: resultSummary,
    sourceToolAssistantUUID: assistantMessage.uuid  // Correlation
}));
```

**Why this matters:**
- **Message threading**: UI can link tool result to tool call
- **Compact handling**: Tombstone can remove tool result when assistant message removed
- **Transcript display**: Tool result shown adjacent to tool call in UI

---

## Summary: Key Algorithms in Tool Integration

| Algorithm | Purpose | Complexity |
|-----------|---------|------------|
| `canExecuteTool` | Determine parallel execution eligibility | O(n) where n = executing tools |
| `processQueue` | Execute queued tools respecting concurrency | O(n) where n = queued tools |
| `executeTool` | Core execution with abort/progress/context handling | Complex state machine |
| `getAbortReason` | Determine cancellation condition | O(1) with priority checks |
| `getRemainingResults` | Drain unfinished tools without busy-polling | Async generator with Promise.race |
| `updateInterruptibleState` | Update UI about cancelability | O(n) where n = executing tools |
| `cloneAbortController` | Create sibling controller for isolation | O(1) with event listener |

The tool integration system represents a sophisticated balance between:
- **Parallelism** for performance (concurrency-safe tools)
- **Safety** for correctness (non-safe tools serialized)
- **Responsiveness** for UX (progress tracking, interruptibility)
- **Isolation** for fault tolerance (sibling abort controllers)
