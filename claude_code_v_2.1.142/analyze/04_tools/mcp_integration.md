# MCP Tool Integration

> MCP (Model Context Protocol) tools are a different class entirely — they are constructed per-(server, tool) at runtime, share a common base spread (`...mI6`), and carry metadata (`_meta`, `mcpInfo`) that built-in tools don't.

## Why MCP is a separate factory class

Built-in tools register at module load with their Zod schemas, prompts, and call implementations baked in. MCP tools come from external servers (stdio, sse, http transports) and arrive after a network round-trip with `tools/list`. Their input schemas are JSON Schema (not Zod), their descriptions are server-supplied (often AI-generated, not human-curated), and they may disconnect mid-session.

The MCP wrapper factory mirrors the built-in factory but:
- Reads `inputJSONSchema` rather than constructing a Zod schema.
- Sets `isMcp: true`, `mcpInfo: {serverName, toolName, ...}`.
- Maps Anthropic-namespaced `_meta` annotations onto built-in fields (`alwaysLoad`, `maxResultSizeChars`, `searchHint`).
- Implements `checkPermissions` as `passthrough` (defer to user allow-rules) rather than a tool-specific decision.
- Wraps `call` in an MCP-specific retry/recovery layer.

## The MCP tool spread base

### mcpToolBase (`mI6`) — the catch-all `mcp` tool + spread base

```javascript
// ============================================
// mcpToolBase (mI6) — shared base for all MCP wrappers and the `mcp` catch-all
// Location: cli_inner_pretty.js:409973-410010
// ============================================

// ORIGINAL (for source lookup):
(mI6 = XK({
  isMcp: !0,
  isOpenWorld() { return !1; },
  name: "mcp",
  maxResultSizeChars: 1e5,
  async description() { return hH4; },
  async prompt() { return yH4; },
  get inputSchema() { return F95(); },
  get outputSchema() { return g95(); },
  async call() { return { data: "" }; },
  async checkPermissions() {
    return { behavior: "passthrough", message: "MCPTool requires permission." };
  },
  renderToolUseMessage: RH4,
  userFacingName: () => "mcp",
  renderToolUseProgressMessage: CH4,
  renderToolResultMessage: tM8,
  isResultTruncated(H) {
    if (typeof H === "string") return eu(H);
    if (Array.isArray(H)) return H.some(($) => $.type === "text" && eu($.text));
    return !1;
  },
  mapToolResultToToolResultBlockParam(H, $) {
    return { tool_use_id: $, type: "tool_result", content: SrH(H) };
  },
}));

// READABLE (for understanding):
const mcpToolBase = createTool({
  isMcp: true,
  isOpenWorld: () => false,                            // Default; per-tool override via _meta openWorldHint
  name: "mcp",                                          // Sentinel name for the catch-all
  maxResultSizeChars: 100_000,
  async description() { return MCP_TOOL_GENERIC_DESCRIPTION; },
  async prompt() { return MCP_TOOL_GENERIC_PROMPT; },
  get inputSchema() { return buildMcpToolGenericInputSchema(); },   // passthrough()
  get outputSchema() { return buildMcpToolGenericOutputSchema(); },
  async call() { return { data: "" }; },               // Never directly invoked
  async checkPermissions() {
    // Always passthrough — the user's allow/deny rules decide
    return { behavior: "passthrough", message: "MCPTool requires permission." };
  },
  renderToolUseMessage: renderMcpToolUseMessage,
  userFacingName: () => "mcp",
  renderToolUseProgressMessage: renderMcpToolUseProgressMessage,
  renderToolResultMessage: renderMcpToolResultMessage,
  isResultTruncated(output) {
    // MCP outputs are union: string OR array of {type, text|...} blocks
    if (typeof output === "string") return isTruncatedHeuristic(output);
    if (Array.isArray(output)) {
      return output.some(block => block.type === "text" && isTruncatedHeuristic(block.text));
    }
    return false;
  },
  mapToolResultToToolResultBlockParam(output, toolUseID) {
    return { tool_use_id: toolUseID, type: "tool_result", content: serialiseMcpToolOutput(output) };
  },
});

// Mapping: mI6→mcpToolBase, XK→createTool, F95→buildMcpToolGenericInputSchema, g95→buildMcpToolGenericOutputSchema,
//          hH4→MCP_TOOL_GENERIC_DESCRIPTION, yH4→MCP_TOOL_GENERIC_PROMPT, RH4→renderMcpToolUseMessage,
//          CH4→renderMcpToolUseProgressMessage, tM8→renderMcpToolResultMessage, eu→isTruncatedHeuristic, SrH→serialiseMcpToolOutput,
//          H→output, $→toolUseID
```

**What it does:** Serves as both (a) a registration object for the "generic MCP" placeholder tool, and (b) a property spread base from which all per-(server, tool) wrappers inherit defaults via `{...mI6, ...overrides}`.

**Why a placeholder `name: "mcp"`:** The "generic" mcpToolBase shows up in tool lists as a catch-all for tool-search-pre-discovery. When ToolSearch sees that the user might want an MCP tool but no servers are connected yet, it can fall back to "mcp" as a hint that capabilities exist behind the protocol layer.

**Key insight:** The dual role (registered tool + spread base) means changes to `mcpToolBase` ripple to every MCP wrapper. Adding a new render method or adjusting `maxResultSizeChars` here updates 50+ MCP tools at once.

## Per-tool wrapper construction

For each tool a server reports via `tools/list`, the host constructs a wrapper:

```javascript
// ============================================
// createMcpToolWrapper — per-(server, tool) factory
// Location: cli_inner_pretty.js:414750-414903 (within the listTools success path)
// ============================================

// ORIGINAL (for source lookup):
let z = K.map((f) => {
  let O = KU(H.name, f.name),                            // O = prefixed name "mcp__server__tool"
    M = f._meta?.["anthropic/maxResultSizeChars"],
    w = typeof M === "number" && Number.isFinite(M) && M > 0;
  return {
    ...mI6,                                              // Spread base (the catch-all)
    name: _ ? f.name : O,                                // _ = useUnprefixedNames (CLAUDE_AGENT_SDK_MCP_NO_PREFIX)
    mcpInfo: {
      serverName: H.name,
      serverInfoName: H.serverInfo?.name,
      toolName: f.name,
      execution: f.execution,
      effectiveMaxPermission: A?.[f.name],
    },
    isMcp: !0,
    searchHint:
      typeof f._meta?.["anthropic/searchHint"] === "string"
        ? f._meta["anthropic/searchHint"].replace(/\s+/g, " ").trim() || void 0
        : void 0,
    alwaysLoad: H.config.alwaysLoad === !0 || f._meta?.["anthropic/alwaysLoad"] === !0,
    async description() { return f.description ?? ""; },
    async prompt() {
      let D = f.description ?? "";
      return D.length > QP$ ? D.slice(0, QP$) + "… [truncated]" : D;
    },
    isConcurrencySafe() { return f.annotations?.readOnlyHint ?? !1; },
    isReadOnly() { return f.annotations?.readOnlyHint ?? !1; },
    toAutoClassifierInput(D) { return Y_5(D, f.name); },
    isDestructive() { return f.annotations?.destructiveHint ?? !1; },
    isOpenWorld() { return f.annotations?.openWorldHint ?? !1; },
    maxResultSizeChars: w ? Math.min(M, tz6) : mI6.maxResultSizeChars,
    persistenceThresholdCeiling: w ? tz6 : void 0,
    inputJSONSchema: f.inputSchema,                       // JSON Schema, not Zod
    async checkPermissions() {
      return {
        behavior: "passthrough",
        message: "MCPTool requires permission.",
        suggestions: [{ type: "addRules", rules: [{ toolName: O, ruleContent: void 0 }], behavior: "allow", destination: "localSettings" }],
      };
    },
    async call(D, j, J, X, L) {
      // ... see below ...
    },
    userFacingName() {
      let D = f.annotations?.title || f.name;
      return `${H.name} - ${D} (MCP)`;
    },
    // Per-tool overrides for special servers
    ...(uTH(H.name) && (H.config.type === "stdio" || !H.config.type) ? o15().getClaudeInChromeMCPToolOverrides(f.name) : {}),
    ...((H.config.type === "stdio" || !H.config.type) && AZH(H.name) ? a15().getComputerUseMCPToolOverrides(f.name) : {}),
    ...(O$4(f.name) ? M$4() : {}),
  };
}).filter(z_5);

// READABLE (for understanding):
const wrapped = serverTools.map((toolDef) => {
  const prefixedName = formatMcpToolName(serverConnection.name, toolDef.name);                      // "mcp__github__create_pr"
  const metaMaxSize = toolDef._meta?.["anthropic/maxResultSizeChars"];
  const hasSizeAnnotation = typeof metaMaxSize === "number" && Number.isFinite(metaMaxSize) && metaMaxSize > 0;

  return {
    ...mcpToolBase,                                                                                  // Inherit catch-all defaults
    name: useUnprefixedNames ? toolDef.name : prefixedName,
    mcpInfo: {
      serverName: serverConnection.name,
      serverInfoName: serverConnection.serverInfo?.name,
      toolName: toolDef.name,
      execution: toolDef.execution,                                                                  // "local" or "remote" — affects timeout
      effectiveMaxPermission: permissionsByTool?.[toolDef.name],
    },
    isMcp: true,
    searchHint:
      typeof toolDef._meta?.["anthropic/searchHint"] === "string"
        ? toolDef._meta["anthropic/searchHint"].replace(/\s+/g, " ").trim() || undefined
        : undefined,
    alwaysLoad: serverConnection.config.alwaysLoad === true || toolDef._meta?.["anthropic/alwaysLoad"] === true,
    async description() { return toolDef.description ?? ""; },
    async prompt() {
      const desc = toolDef.description ?? "";
      // Long descriptions get truncated — Anthropic recommends concise MCP tool descriptions
      return desc.length > MAX_MCP_PROMPT_CHARS ? desc.slice(0, MAX_MCP_PROMPT_CHARS) + "… [truncated]" : desc;
    },
    // Concurrency-safe and read-only mirror the readOnlyHint annotation
    isConcurrencySafe() { return toolDef.annotations?.readOnlyHint ?? false; },
    isReadOnly() { return toolDef.annotations?.readOnlyHint ?? false; },
    toAutoClassifierInput(input) { return mcpAutoClassifierProjection(input, toolDef.name); },
    isDestructive() { return toolDef.annotations?.destructiveHint ?? false; },
    isOpenWorld() { return toolDef.annotations?.openWorldHint ?? false; },
    // Cap user-supplied maxResultSizeChars at our own ceiling tz6 (50K? — guard against abuse)
    maxResultSizeChars: hasSizeAnnotation ? Math.min(metaMaxSize, MCP_RESULT_SIZE_CEILING) : mcpToolBase.maxResultSizeChars,
    persistenceThresholdCeiling: hasSizeAnnotation ? MCP_RESULT_SIZE_CEILING : undefined,
    inputJSONSchema: toolDef.inputSchema,                                                            // Forward server's JSON Schema verbatim
    async checkPermissions() {
      return {
        behavior: "passthrough",
        message: "MCPTool requires permission.",
        suggestions: [{
          type: "addRules",
          rules: [{ toolName: prefixedName, ruleContent: undefined }],                               // Pre-fill "Always allow mcp__server__tool"
          behavior: "allow",
          destination: "localSettings",
        }],
      };
    },
    async call(input, ctx, _canUseTool, parentMessage, onProgress) {
      // ... MCP-specific retry/recovery wrapper ... (see below)
    },
    userFacingName() {
      // annotations.title is the server's preferred display name; fall back to tool name
      const title = toolDef.annotations?.title || toolDef.name;
      return `${serverConnection.name} - ${title} (MCP)`;
    },
    // Special-server overrides (Chrome in-process MCP, computer-use, etc.)
    ...(isClaudeInChromeServer(serverConnection.name) && isStdioOrUntyped(serverConnection) ? loadChromeMcpOverrides().getClaudeInChromeMCPToolOverrides(toolDef.name) : {}),
    ...(isStdioOrUntyped(serverConnection) && isComputerUseServer(serverConnection.name) ? loadComputerUseOverrides().getComputerUseMCPToolOverrides(toolDef.name) : {}),
    ...(isElicitationTool(toolDef.name) ? getElicitationOverrides() : {}),
  };
}).filter(isWrappedToolEnabled);

// Mapping: K→serverTools, f→toolDef, O→prefixedName, M→metaMaxSize, w→hasSizeAnnotation, KU→formatMcpToolName,
//          H→serverConnection, _→useUnprefixedNames, A→permissionsByTool, mI6→mcpToolBase, tz6→MCP_RESULT_SIZE_CEILING,
//          QP$→MAX_MCP_PROMPT_CHARS, Y_5→mcpAutoClassifierProjection, uTH→isClaudeInChromeServer, AZH→isComputerUseServer,
//          O$4→isElicitationTool, o15→loadChromeMcpOverrides, a15→loadComputerUseOverrides, M$4→getElicitationOverrides,
//          z_5→isWrappedToolEnabled
```

## `_meta["anthropic/*"]` annotation contract

The MCP wrapper reads four optional annotations from `_meta`:

| Annotation | Type | Effect |
|------------|------|--------|
| `anthropic/maxResultSizeChars` | `number` | Per-tool result-size budget, capped at `MCP_RESULT_SIZE_CEILING`. Sets `persistenceThresholdCeiling`. |
| `anthropic/alwaysLoad` | `boolean` | If `true`, tool is never deferred (full schema in turn 1). Mirrors `alwaysLoad` Tool property. |
| `anthropic/searchHint` | `string` | One-line capability phrase for `ToolSearch` keyword matching. |
| `anthropic/toolName` (handled in toAutoClassifierInput) | `string` | Custom classifier-input projection key. |

Plus standard MCP annotations `readOnlyHint`, `destructiveHint`, `openWorldHint`, `title`, all surfaced via accessors on the wrapper.

**Why the `anthropic/` namespace:** The MCP spec defines `_meta` as an open extension point for client-specific metadata. Prefixing with the vendor name (`anthropic/`) avoids conflicts with other MCP clients that might define their own meta keys. The MCP spec explicitly invites this namespacing pattern.

**Key insight:** These annotations are how server authors opt into Claude Code-specific behaviour without breaking compatibility with other MCP clients. A GitHub MCP server can declare `anthropic/alwaysLoad: true` on its `create_pr` tool to ensure Claude Code never makes the user pay a ToolSearch round-trip for the highest-value tool — while a different MCP client (Anthropic Workbench, OpenAI clients) sees the same server and ignores the meta entirely.

## `${path}` interpolation in MCP hooks

The MCP-tool hook type (`mcp_tool`) supports `${path}` interpolation in its arguments. The format is documented in the hook schema:

```javascript
// ============================================
// MCP hook arg interpolation schema
// Location: cli_inner_pretty.js:48793-48800
// ============================================

// ORIGINAL (for source lookup):
type: y.literal("mcp_tool").describe("MCP tool hook type"),
...
arguments: y.record(y.string(), y.any()).describe(
  'Arguments passed to the MCP tool. String values support ${path} interpolation from the hook input JSON (e.g. "${tool_input.file_path}").',
),

// READABLE (for understanding):
type: z.literal("mcp_tool").describe("MCP tool hook type"),
// ...
arguments: z.record(z.string(), z.any()).describe(
  'Arguments passed to the MCP tool. String values support ${path} interpolation from the hook input JSON (e.g. "${tool_input.file_path}").',
),

// Mapping: y→z (Zod aliased)
```

**What this means in practice:** A user can configure a hook that, when triggered, calls an MCP tool with arguments pulled from the hook's input JSON. The `${path}` syntax (`${tool_input.file_path}`, `${command}`, etc.) navigates a JSONPath into the input.

Example user-defined hook:
```json
{
  "PreToolUse": [{
    "matcher": "Edit",
    "hooks": [{
      "type": "mcp_tool",
      "server": "audit-log",
      "tool": "record_edit",
      "arguments": {
        "file": "${tool_input.file_path}",
        "edit_summary": "${tool_input.new_string}"
      }
    }]
  }]
}
```

Before invoking `mcp__audit-log__record_edit`, the host resolves `${tool_input.file_path}` against the hook's payload (`{tool_input: {file_path: "/abs/path/foo.ts", ...}}`) and substitutes the literal value.

**Why interpolation rather than passing the whole input:** A user might want to send only the file path to an audit MCP — not the entire diff. Interpolation lets the hook spec be precise about what data crosses the boundary.

The interpolation engine handles a few escape rules:
- `${...}` literal — substitute
- `$$` — literal `$` (escape)
- Missing path → empty string substitution (lenient; not an error)

## Error envelopes

MCP errors are wrapped in a special envelope (`fh` class) so the model sees a consistent shape:

```javascript
// ============================================
// MCP call() error wrapping — uniform fh envelope
// Location: cli_inner_pretty.js:414866-414889
// ============================================

// ORIGINAL (for source lookup):
} catch (v) {
  if (v instanceof FrH && V < G) {
    H8(H.name, `Retrying tool '${f.name}' after session recovery`);
    continue;
  }
  if (L && P) L({ type: "progress", toolUseID: P, data: { type: "mcp_progress", status: "failed", ... } });
  if (v instanceof Error && !(v instanceof fh)) {
    let E = v.constructor.name;
    if (E === "Error") throw new fh(v.message, v.message.slice(0, 200));
    if (E === "McpError" && "code" in v && typeof v.code === "number")
      throw new fh(v.message, `McpError ${v.code}`);
  }
  throw v;
}

// READABLE (for understanding):
} catch (err) {
  // 1. Session-recovery error → retry once (V < G means retry budget remains)
  if (err instanceof McpSessionRecoveryError && attemptIndex < MAX_RETRIES) {
    logInfo(serverConnection.name, `Retrying tool '${toolDef.name}' after session recovery`);
    continue;
  }
  // 2. Emit failure progress
  if (onProgress && toolUseId) {
    onProgress({
      type: "progress", toolUseID: toolUseId,
      data: { type: "mcp_progress", status: "failed", serverName, toolName, elapsedTimeMs: ... },
    });
  }
  // 3. Wrap non-McpToolError throwables in an McpToolError envelope (`fh`)
  if (err instanceof Error && !(err instanceof McpToolError)) {
    const ctorName = err.constructor.name;
    if (ctorName === "Error") {
      // Plain Error — message is the model-visible text; tag is the slice for telemetry
      throw new McpToolError(err.message, err.message.slice(0, 200));
    }
    if (ctorName === "McpError" && "code" in err && typeof err.code === "number") {
      throw new McpToolError(err.message, `McpError ${err.code}`);
    }
  }
  // 4. Anything else (already McpToolError or unrecognised) bubbles up
  throw err;
}

// Mapping: v→err, FrH→McpSessionRecoveryError, V→attemptIndex, G→MAX_RETRIES, H8→logInfo, fh→McpToolError, E→ctorName, L→onProgress, P→toolUseId
```

**Why envelope errors:** Three reasons:
1. **Uniform model-facing message.** Regardless of underlying error type (network timeout, McpError code 32000, server-side validation failure), the model sees a structured `McpToolError` with `.message` and a short tag.
2. **Telemetry buckets.** The tag (`"McpError 32000"`, `"TimeoutError"`) lets analytics aggregate failure modes without scanning raw messages.
3. **Retry budget.** Some errors are retriable (session-recovery, transient network); the envelope makes the retry decision explicit.

**Key insight:** The retry mechanism is one round only (`V < G` with `G = 1`). MCP servers can be flaky during reconnect; one retry covers the common "session was reconnected mid-call" case without entering retry storms.

## Result structuredContent / mcpMeta passthrough

MCP tools can return `structuredContent` and `_meta` in their response, which the wrapper threads back to the dispatcher via `mcpMeta`:

```javascript
// ============================================
// MCP call() return — pass structuredContent + _meta through
// Location: cli_inner_pretty.js:414857-414865
// ============================================

// ORIGINAL (for source lookup):
return {
  data: E.content,
  ...((E._meta || E.structuredContent) && {
    mcpMeta: {
      ...(E._meta && { _meta: E._meta }),
      ...(E.structuredContent && { structuredContent: E.structuredContent }),
    },
  }),
};

// READABLE (for understanding):
return {
  data: mcpResponse.content,
  // Only attach mcpMeta if the server returned at least one meta field —
  // keeps the result shape clean when there's nothing to pass through.
  ...((mcpResponse._meta || mcpResponse.structuredContent) && {
    mcpMeta: {
      ...(mcpResponse._meta && { _meta: mcpResponse._meta }),
      ...(mcpResponse.structuredContent && { structuredContent: mcpResponse.structuredContent }),
    },
  }),
};

// Mapping: E→mcpResponse
```

**Where mcpMeta goes:** SDK consumers (Anthropic Workbench, third-party tools using the Claude Code SDK) can read it from the tool result for richer integration. The Claude model itself doesn't see `mcpMeta` — only the `data` (via `mapToolResultToToolResultBlockParam`).

**Why pass it through:** MCP servers can attach machine-readable data (JSON results, ID mappings, paging cursors) to the side of the human-readable `content` blocks. The model uses `content`; SDK clients use `structuredContent`. The same response serves both.

## Authenticate / complete-authentication synthetic tools

For OAuth-bearing MCP servers, the host generates synthetic `authenticate` / `complete_authentication` tools that look like MCP tools but are constructed in-process (see `cli_inner_pretty.js:411664-411778` and `cli_inner_pretty.js:411786-411900`). They share `isMcp: true` and `mcpInfo` but bypass the server entirely — the `call` method drives the OAuth flow locally.

These are auto-injected when a server's transport supports OAuth (sse, http) and the user hasn't authenticated yet. They disappear from the tools list once authentication completes.

## v2.1.112 → v2.1.142 Deltas

- **v2.1.121:** `alwaysLoad` config flag — both at the server level (`H.config.alwaysLoad`) and the per-tool `_meta["anthropic/alwaysLoad"]` annotation. When true, the tool bypasses tool-search deferral (`zm` returns `!1` at `cli_inner_pretty.js:211831`).
- **v2.1.128:** MCP server name `workspace` reserved; tools/list cache improvements; structured content + content-block dual return finally renders both image and structured data correctly.
- **v2.1.137:** HTTP/SSE servers returning 403 on connect classified as `needsAuth` (not `failed`) so `McpAuth` pseudo-tool surfaces.
- **v2.1.139:** Plugin/MCP servers receive `CLAUDE_PROJECT_DIR` env var (`cli_inner_pretty.js:414308`) when spawned via stdio transport, so they can resolve project-relative paths consistently. `.mcp.json` edits now trigger remote reconnection (the watcher diffs current vs new config and reconnects affected servers without restarting the session).
- **v2.1.142:** `MCP_TOOL_TIMEOUT` env var finally raises both the per-request tool-call timeout (`r15` at line 413221) and the per-fetch HTTP/SSE inner timeout (`U$4` at line 413346). The pre-fix bug capped the inner fetch at 60s regardless of `MCP_TOOL_TIMEOUT` setting.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - MCP
> - v2.1.142 additions: [symbol_additions_v2_1_142_tools_arch.md](../00_overview/symbol_additions_v2_1_142_tools_arch.md)

Key functions in this document:
- `mcpToolBase` (obfuscated: `mI6`) - Catch-all `mcp` tool + spread base for all MCP wrappers
- `McpToolError` (obfuscated: `fh`) - Uniform error envelope class
- `formatMcpToolName` (obfuscated: `KU`) - Format `mcp__server__tool` prefixed name
- `MCP_RESULT_SIZE_CEILING` (obfuscated: `tz6`) - Hard ceiling on _meta-set maxResultSizeChars
- `MAX_MCP_PROMPT_CHARS` (obfuscated: `QP$`) - Truncation point for server descriptions
- `mcpAutoClassifierProjection` (obfuscated: `Y_5`) - Convert MCP input to classifier text
- `serialiseMcpToolOutput` (obfuscated: `SrH`) - Convert MCP content blocks to API-shaped content
- `isClaudeInChromeServer` (obfuscated: `uTH`) - Recognise the Chrome in-process MCP
- `isComputerUseServer` (obfuscated: `AZH`) - Recognise the computer-use MCP
- `getClaudeInChromeOverrides` (obfuscated: `o15`) - Tool-overrides loader for Chrome MCP
