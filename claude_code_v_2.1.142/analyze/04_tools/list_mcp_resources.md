# ListMcpResources — Enumerate MCP Server Resources

> **Tool name:** `ListMcpResourcesTool` (user-facing: `listMcpResources`)
> **Source:** see `O$_` schema and `Q3H_Tool` declaration in `cli_inner_pretty.js`
> **Search hint:** *list resources from connected MCP servers*
> **Concurrency-safe:** true · **Read-only:** true

---

## Overview

Lists available resources from configured MCP servers. Each returned resource includes all standard MCP resource fields **plus a `server` field** indicating which server it's from. With no parameters, lists resources from all servers; with `server: "myserver"`, lists from one specific server.

This is the MCP-side analog to filesystem listing: resources are server-defined addressable entities (URIs) that MCP servers expose for reading.

---

## Schema

```javascript
// ============================================
// listMcpResourcesInputSchema - O$_ optional server filter
// Location: cli_inner_pretty.js (schema in O$_)
// ============================================

// ORIGINAL (for source lookup):
O$_ = yH(() => y.object({ server: y.string().optional().describe("...") }));

// READABLE (for understanding):
const listMcpResourcesInputSchema = lazySchema(() =>
  z.object({ server: z.string().optional().describe("Specific MCP server name, or omit for all servers") }),
);

// Mapping: O$_→listMcpResourcesInputSchema
```

---

## Key Behavior

### Two iteration paths

```
input.server === undefined   → iterate all connected MCP clients, accumulate .resources arrays
input.server === "myserver"  → look up named client, return only its resources
```

In both paths, each resource is decorated with `server: <serverName>` so the model can disambiguate `file://config.json` from `myserver1` vs `myserver2`.

### `isResultTruncated` callback

The tool declares an `isResultTruncated` callback (rather than a static `maxResultSizeChars`) so the tool runner can detect when a server's resource list overflowed the result envelope and report a truncation marker to the model. The marker tells the model: "you saw a partial list; ask for a specific server to get the rest."

### `shouldDefer: true`

The tool is registered as deferred (`shouldDefer`) so it's part of the tool-search pool — many MCP servers means a bloated tool list. Servers' resources are discovered only when a query mentions them.

---

## Key Insights

**Why include the `server` field on every resource?** MCP resource URIs are server-namespaced but their *raw forms* often collide. `file:///etc/hosts` could exist as a resource on multiple servers (different views of the same path). Without the `server` decoration, the model couldn't safely call `ReadMcpResource` because it wouldn't know which server's binding to use.

**Why optional `server` parameter rather than a separate "list-one-server" tool?** Same tool surface, two modes. Forcing the model to pick a server when it doesn't know the names creates a cold-start problem; making it optional lets discovery and targeted listing share one entry point.

**The `isMcp: false` flag (despite the name)** — this is a *built-in* tool that *interacts with* MCP servers. It is not itself a tool *exposed by* an MCP server. The flag matters for the permission system (built-in tools don't go through MCP permission paths).

---

## v2.1.112 → v2.1.142 Deltas

- **v2.1.116:** Faster MCP startup; `resources/templates/list` is now deferred to first `@`-mention — list operations are lazy.
- **v2.1.121:** `alwaysLoad` MCP server option to bypass tool-search deferral; affects whether ListMcpResources surfaces in the tool list.

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_tools_utility.md](../00_overview/symbol_additions_v2_1_142_tools_utility.md) — *Module: Tools — MCP*

Key functions in this document:
- `ListMcpResourcesTool` — declaration
- `listMcpResourcesInputSchema` (`O$_`) — optional `server` filter
- `LIST_MCP_RESOURCES_TOOL_NAME` (`Q3H`)
