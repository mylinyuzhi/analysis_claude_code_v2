# mcp — Generic MCP Tool Envelope

> **Tool name:** `mcp` (user-facing name: `mcp`)
> **Source:** `cli_inner_pretty.js` (`F95` schema, generic MCP tool decl)
> **Properties:** `isMcp: true`, `isOpenWorld: true`

---

## Overview

The `mcp` tool is the **generic dispatcher** for tools provided by MCP servers. Every individual tool exposed by an MCP server (via the JSON-RPC `tools/list` reply) becomes its own callable named `mcp__<server>__<tool>` — but the registration mechanism, schema-handling, permission gating, and result envelope are shared through the generic `mcp` tool factory.

When you see "the mcp tool" referenced as a search hint or in tool-search outputs, it's this **factory entrypoint** — the per-server tools are spawned from it.

---

## Property Keys

```
isMcp: true
isOpenWorld: true
name: "mcp"
maxResultSizeChars
description, prompt
inputSchema, outputSchema  ← dynamically attached per server tool
call, checkPermissions
renderToolUseMessage, userFacingName
renderToolUseProgressMessage, renderToolResultMessage
isResultTruncated, mapToolResultToToolResultBlockParam
```

---

## Key Behavior

### `isMcp: true` flag is the discriminator

The tool registry checks `tool.isMcp` to decide which permission path applies:
- **`isMcp: false`** built-in: paths are local/private; permission rules are like `Bash(...)` or `Edit(...)`.
- **`isMcp: true`**: paths go through MCP permission rules (`mcp__<server>__<tool>` matching, server-level allowlists).

The `mcp` tool factory bakes in the `isMcp` flag so every per-server tool inherits it.

### `isOpenWorld: true` describes the schema lifecycle

`isOpenWorld: true` tells the runtime: "this tool's input schema is not statically known; it's discovered at server-connect time and may change between sessions." The deferred-tool gate (see `cli_inner_pretty.js:211831`) uses this:

```javascript
function zm(H) {
  if (H.alwaysLoad === !0) return !1;
  if (H.isMcp === !0) return !0;   // ← all MCP tools defer unless alwaysLoad
  // ...
}
```

All `isMcp: true` tools defer to tool-search by default. The `alwaysLoad: true` MCP server config override (v2.1.121) bypasses this so trusted servers' tools are always available without search.

### Schema per individual tool

Each per-server tool's input schema is constructed at MCP `tools/list` time from the server's reply. The generic factory provides the *envelope*; the schema is the server's contract.

---

## Key Insights

**Why one `mcp` factory rather than registering each tool independently?**
- Shared rendering, permission flow, result-truncation logic.
- The pure factory composition means new MCP servers don't need any CLI code change to expose new tools — connect, list, register.
- The `mcp__<server>__<tool>` namespacing is enforced by the factory, preventing collisions between servers exposing tools with the same name.

**`isOpenWorld` is the "I don't trust this schema" signal.** Built-in tools have schemas baked in at compile time; MCP servers can ship arbitrary schemas. The flag tells the runtime:
- Tool-search may need to reload the schema.
- Permission rules can't assume schema-driven argument validation at rule-write time.
- Schema-based caching (like StructuredOutput's `sdK` WeakMap) is *not* applied — every call may have different fields.

**Why `mcp` shows up as a tool name in some contexts?** It's the *category* name. When the user asks "what MCP tools are available?", the system can answer "the `mcp` family of tools" — meaning all the dynamically-registered per-server tools.

---

## v2.1.112 → v2.1.142 Deltas

- **v2.1.142:** Fixed `MCP_TOOL_TIMEOUT` not raising the per-request fetch timeout for remote HTTP/SSE MCP servers — capped tool calls at 60 s regardless of configured value.
- **v2.1.141:** Fixed `/mcp` server list scrolling and OAuth refresh fixes around the generic MCP dispatcher.
- **v2.1.128:** MCP `workspace` is reserved server name; tools/list cache improvements.
- **v2.1.121:** Added `alwaysLoad` MCP server option to bypass tool-search deferral — affects whether `isMcp` triggers deferring.

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_tools_utility.md](../00_overview/symbol_additions_v2_1_142_tools_utility.md) — *Module: Tools — MCP*

Key functions in this document:
- `mcpToolInputSchema` (`F95`) — generic envelope schema
- `isDeferredTool` (`zm`) — uses `isMcp` to default-defer MCP tools
- `buildMcpToolName` — `mcp__<server>__<tool>` namespacer
- `getMcpPrefix` — `mcp__<server>__` prefix
