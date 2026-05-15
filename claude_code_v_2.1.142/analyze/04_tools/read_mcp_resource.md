# ReadMcpResource — Fetch a Specific MCP Resource by URI

> **Tool name:** `ReadMcpResourceTool`
> **Source:** `Xe_` schema in `cli_inner_pretty.js`
> **Search hint:** *read a specific MCP resource by URI*
> **Concurrency-safe:** true · **Read-only:** true

---

## Overview

`ReadMcpResource` reads a specific MCP resource from a named server, identified by `(server, uri)`. The complement to `ListMcpResources`: list to discover, read to fetch.

---

## Schema

```javascript
// ============================================
// readMcpResourceInputSchema - Xe_ required server + uri
// Location: cli_inner_pretty.js (Xe_ decl)
// ============================================

// ORIGINAL (for source lookup):
Xe_ = yH(() =>
  y.object({
    server: y.string().describe("MCP server name (required)"),
    uri: y.string().describe("Resource URI (required)"),
  }),
);

// READABLE (for understanding):
const readMcpResourceInputSchema = lazySchema(() =>
  z.object({
    server: z.string().describe("MCP server name (required)"),
    uri: z.string().describe("Resource URI (required)"),
  }),
);

// Mapping: Xe_→readMcpResourceInputSchema
```

Both fields are required — there's no useful default for either.

---

## Key Behavior

### Routes through the MCP client per server

The runtime looks up the MCP client by `server` name, then calls its `resources/read` JSON-RPC method with `{ uri }`. The MCP server then returns the resource content (text, binary base64, or structured blocks).

### Result truncation reporting

Like ListMcpResources, this tool declares an `isResultTruncated` callback. Large resources (e.g., a server returning a 5 MB log) get truncated to the tool's `maxResultSizeChars` envelope, and the model is told via marker. The model can then call again with `range` parameters where the server supports them (the inner protocol may have per-resource range query semantics).

### `shouldDefer: true`

Same rationale as ListMcpResources — the read tool is in the tool-search pool, surfaced only when a query references MCP resources or when the user explicitly mentions a server.

---

## Key Insights

**Why require `server` explicitly?** A URI alone (e.g., `file:///etc/hosts`) doesn't say which server's filesystem view to use. Forcing `server` makes the call unambiguous and pushes the disambiguation problem to the model, which already has the server context from a prior `ListMcpResources` or `@mention` interaction.

**Read-only + concurrency-safe both true.** The tool doesn't mutate any local state and multiple reads can interleave. Even if the *server* sees a side-effect on read (unusual but legal in MCP), the client doesn't track such effects — they're the server's problem.

**Why not unify Read with ReadMcpResource?** Different addressing systems (local paths vs MCP URIs), different permission models (filesystem ACL vs MCP server allowlist), different result envelopes (file content + size+lines vs MCP resource blocks). Sharing a tool would force callers to switch on `uri.startsWith("file://")` to know which behavior to expect.

---

## v2.1.112 → v2.1.142 Deltas

- **v2.1.137:** MCP tool results being invisible when the server returns content blocks — fixed; ReadMcpResource now renders block-form results correctly.
- **v2.1.128:** Fixed MCP tool results dropping images when the server returns both structured content and content blocks.
- **v2.1.121:** Improved MCP OAuth and `alwaysLoad` interactions affect tool-list deferral but not the read path itself.

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_tools_utility.md](../00_overview/symbol_additions_v2_1_142_tools_utility.md) — *Module: Tools — MCP*

Key functions in this document:
- `ReadMcpResourceTool` — declaration
- `readMcpResourceInputSchema` (`Xe_`) — required `{server, uri}`
- `READ_MCP_RESOURCE_TOOL_NAME` (`Gz`)
