# `alwaysLoad` — Per-Server Opt-out From Tool-Search Deferral

**Versions:** 2.1.121 (added)

## Summary

When **Tool Search** is enabled (the default on Sonnet/Opus 4+ models), MCP tools are *deferred* by default: their names appear in the model's `<system-reminder>` block but the model has to call the `ToolSearch` tool to fetch the JSON Schema before invoking any of them. This keeps the system prompt small even when many MCP servers are configured (one large server can otherwise consume 30 KB+ of tokens upfront).

The trade-off: for a server whose tools the agent is *expected* to use immediately (e.g. an internal SDK that wraps the team's bug tracker, where every session is about bugs), the round-trip of "discover via ToolSearch → call" adds latency to every session. v2.1.121 introduces `alwaysLoad: true` on the MCP server config to **skip tool-search deferral** — every tool on that server is loaded with its full schema at session start.

`alwaysLoad` can also be set at the **per-tool** level via the server's `_meta["anthropic/alwaysLoad"]` annotation — that already existed in v2.1.112 (only the per-tool annotation was supported). v2.1.121 extends this to the *server* level so users can opt entire servers into eager loading without modifying upstream server code.

## Files Involved

| Version | Path | Lines | What |
|---------|------|------:|------|
| v2.1.112 | `chunks.18.mjs` | 1935-1979 | MCP config schemas — **no** `alwaysLoad` field |
| v2.1.112 | `chunks.162.mjs` | 591 | `alwaysLoad: Y._meta?.["anthropic/alwaysLoad"] === !0` — per-tool only |
| v2.1.112 | `chunks.84.mjs` | 2874 | `isDeferredTool` — checks `tool.alwaysLoad` |
| v2.1.142 | `cli_inner_pretty.js` | 48880-48962 | MCP config schemas — `alwaysLoad: y.boolean().optional()` on every server type |
| v2.1.142 | `cli_inner_pretty.js` | 414769 | `alwaysLoad: H.config.alwaysLoad === !0 || f._meta?.["anthropic/alwaysLoad"] === !0` — OR of server-level + per-tool |
| v2.1.142 | `cli_inner_pretty.js` | 211830-211841 | `isDeferredTool` (`zm`) — short-circuits on `alwaysLoad` |
| v2.1.142 | `cli_inner_pretty.js` | 211831 | `if (H.alwaysLoad === !0) return !1;` — the eager-load skip |
| v2.1.142 | `cli_inner_pretty.js` | 414911 | `alwaysLoadCount: H6(z, (f) => f.alwaysLoad === !0)` — telemetry |
| v2.1.142 | `cli_inner_pretty.js` | 597883-597889 | `--mcp-config alwaysLoad servers` reporting |

## Config Schema Change

```javascript
// ============================================
// MCP server config schemas (v2.1.142 — alwaysLoad on every type)
// Location: cli_inner_pretty.js:48880-48962
// ============================================

// ORIGINAL (for source lookup, stdio variant shown):
nq$ = yH(() =>
  y.object({
    type: y.literal("stdio").optional(),
    command: y.string().min(1, "Command cannot be empty"),
    args: y.array(y.string()).default([]),
    env: y.record(y.string(), y.string()).optional(),
    alwaysLoad: y.boolean().optional(),
  })
)

// READABLE (for understanding):
// Each transport schema now includes the alwaysLoad opt-in:
const McpStdioServerConfigSchema = z.object({
    type: z.literal("stdio").optional(),
    command: z.string().min(1, "Command cannot be empty"),
    args: z.array(z.string()).default([]),
    env: z.record(z.string(), z.string()).optional(),
    alwaysLoad: z.boolean().optional(),   // ← NEW in v2.1.121
});
// (Same alwaysLoad field added to sse, sse-ide, ws-ide, http, ws, sdk schemas — see lines 48911, 48920, 48930, 48940, 48949, 48952, 48959)

// Mapping: nq$→McpStdioServerConfigSchema (alphabetic-letter-suffix obfuscation)
```

## Per-Tool Combiner Logic

```javascript
// ============================================
// adaptMcpTool - sets alwaysLoad from server config OR per-tool _meta
// Location: cli_inner_pretty.js:414769
// ============================================

// ORIGINAL (for source lookup, relevant block):
let z = K.map((f) => {
    return {
        ...mI6,
        name: _ ? f.name : O,
        mcpInfo: { /* ... */ },
        isMcp: !0,
        searchHint: /* ... */,
        alwaysLoad: H.config.alwaysLoad === !0 || f._meta?.["anthropic/alwaysLoad"] === !0,
        async description() { /* ... */ },
        // ...
    };
});

// READABLE (for understanding):
// For each tool returned by tools/list, build the local tool object:
const tools = mcpToolList.map((upstreamTool) => {
    return {
        ...defaultMcpToolBase,
        name: usePlainName ? upstreamTool.name : namespacedToolName,
        mcpInfo: { /* ... */ },
        isMcp: true,
        searchHint: /* ... */,

        // Server-level opt-in OR per-tool _meta opt-in.
        // (Server-level wins by virtue of being checked first; either true → alwaysLoad.)
        alwaysLoad:
            connectedClient.config.alwaysLoad === true               // ← NEW in v2.1.121
            || upstreamTool._meta?.["anthropic/alwaysLoad"] === true, // ← existed in v2.1.112

        async description() { /* ... */ },
        // ...
    };
});

// Mapping: H→connectedClient, K→mcpToolList, f→upstreamTool, _→usePlainName,
//          O→namespacedToolName, mI6→defaultMcpToolBase
```

## Where `alwaysLoad` Is Honored

```javascript
// ============================================
// isDeferredTool - tool-search deferral predicate
// Location: cli_inner_pretty.js:211830-211841
// ============================================

// ORIGINAL (for source lookup):
function zm(H) {
  if (H.alwaysLoad === !0) return !1;
  if (H.isMcp === !0) return !0;
  if (H.name === cY) return !1;
  if (H.name === D7) {
    if ((Rt(), s6(rlK)).isForkSubagentEnabled()) return !1;
  }
  if (H.name === x$_) return !1;
  if (H.name === u$_) return !1;
  if (H.name === nf && U3H()) return !1;
  return H.shouldDefer === !0;
}

// READABLE (for understanding):
function isDeferredTool(tool) {
    // First gate: alwaysLoad forcibly inhibits deferral.
    // Wins over the isMcp default-true policy below.
    if (tool.alwaysLoad === true) return false;

    // Default for MCP tools: defer. (alwaysLoad is the only override.)
    if (tool.isMcp === true) return true;

    if (tool.name === TOOL_SEARCH_TOOL_NAME) return false;   // can't defer the discovery tool itself

    if (tool.name === AGENT_TOOL_NAME) {
        // Agent (Task) tool defers unless ForkSubagent is enabled
        if (isForkSubagentEnabled()) return false;
    }

    if (tool.name === ASK_USER_QUESTION_TOOL_NAME) return false;
    if (tool.name === SOME_OTHER_BUILTIN_TOOL) return false;
    if (tool.name === SKILL_TOOL_NAME && areSkillsEnabled()) return false;

    // For non-MCP tools, defer only when the tool itself requests it.
    return tool.shouldDefer === true;
}

// Mapping: zm→isDeferredTool, H→tool, cY→TOOL_SEARCH_TOOL_NAME, D7→AGENT_TOOL_NAME,
//          x$_/u$_→other built-in tool name constants, nf→SKILL_TOOL_NAME,
//          U3H→areSkillsEnabled, rlK→subagent fork config provider
```

## Telemetry

`alwaysLoadCount` is now reported in the per-server connection summary:

```javascript
// ============================================
// MCP server tool-fetch summary - reports alwaysLoadCount
// Location: cli_inner_pretty.js:414900-414920 (relevant subset)
// ============================================

// ORIGINAL (for source lookup):
return {
    // ...
    alwaysLoadCount: H6(z, (f) => f.alwaysLoad === !0),
    // ...
};

// READABLE (for understanding):
return {
    // ...
    alwaysLoadCount: countWhere(toolsAfterMap, (tool) => tool.alwaysLoad === true),
    // ...
};

// Mapping: H6→countWhere, z→toolsAfterMap, f→tool
```

## CLI Surfacing

v2.1.121 also adds a `/doctor` and `--mcp-config` reporter that highlights servers with `alwaysLoad`:

```javascript
// ============================================
// reportMcpServers - separates alwaysLoad servers
// Location: cli_inner_pretty.js:597883-597889
// ============================================

// ORIGINAL (for source lookup):
z = lN($, (M) => M.alwaysLoad === !0),
Y = lN($, (M) => M.alwaysLoad !== !0),
// ...
...(f ? [fr6(!1, () => Or6(z, "regular-required", K), "--mcp-config alwaysLoad servers")] : [])

// READABLE (for understanding):
const alwaysLoadServers = partition(allServers, (server) => server.alwaysLoad === true),
      regularServers    = partition(allServers, (server) => server.alwaysLoad !== true);
// ...
...(showAlwaysLoadSection
    ? [renderSection(false, () => renderMcpList(alwaysLoadServers, "regular-required", scopeFilter),
                     "--mcp-config alwaysLoad servers")]
    : [])

// Mapping: lN→partition, $→allServers, z→alwaysLoadServers, Y→regularServers,
//          fr6→renderSection, Or6→renderMcpList, K→scopeFilter, f→showAlwaysLoadSection
```

This makes it easier for the user to debug "why are these tools showing up at startup but not those" by separating the two pools.

## Why This Approach

### Why a per-server flag rather than per-tool

Per-tool `_meta["anthropic/alwaysLoad"]` requires *upstream* changes to the server — you have to modify the server's tool registration to emit `_meta`. That's a non-starter for third-party MCP servers the user doesn't control. The per-server `alwaysLoad` flag puts the lever on the user's side: in their own `.mcp.json` they say "all tools from this server, always load."

### Why an OR (not AND, not override)

The combiner is OR: either the server config OR the upstream tool's `_meta` can set `alwaysLoad`. That means:
- A server author who pre-marks specific high-value tools (`_meta["anthropic/alwaysLoad"]: true`) gets honored even when the user hasn't set the server-level flag.
- A user who knows their workflow can flip the server-level flag and get *all* tools, even ones the author didn't pre-mark.
- The two coexist without conflict.

A different design — server-level OR-vs-AND-vs-override — could've worked:
- AND: confusing, because a user setting `alwaysLoad: true` on a server config would *not* get tools that lacked `_meta`. Hostile to the new flag's purpose.
- Override: ambiguous direction; either user-wins (matches OR effectively) or server-wins (defeats the purpose).
- OR (chosen): "any opt-in causes opt-in" — simple, predictable, no surprises.

### Why not default-on for stdio servers

Tool Search is justified by token budget. Stdio servers tend to have fewer tools than HTTP servers, and one can imagine a heuristic "stdio default eager, http default lazy." That heuristic is rejected because:
1. It would be silently inconsistent — moving a server from stdio to HTTP would silently change behavior.
2. Self-hosted HTTP MCP servers (e.g. `http://localhost:PORT`) are often also small. The transport doesn't predict tool count.
3. Users debugging tool visibility should have one mental model: "tools defer unless I or the server says don't defer."

### Why `=== !0` (strict-true comparison) everywhere

Throughout the codebase the predicates are `=== true`, not `truthy`. This intentionally rejects `alwaysLoad: 1` or `alwaysLoad: "true"` (string). The zod schema (`y.boolean().optional()`) enforces this at parse time too — invalid types cause the whole server config to fail validation rather than partial-apply.

### Key insight

`alwaysLoad` is the *single user-facing knob* that says "I'm willing to pay startup tokens for this server in exchange for zero discovery latency." It composes cleanly with the existing per-tool annotation (OR-combine), is opt-in (default false preserves backward compatibility), and is reported in telemetry and `/doctor` so users can see what's eager-loaded vs. deferred. It's a small surface, the right surface.

## Edge cases

- **Inheritance through plugins:** plugin-supplied `.mcp.json` entries inherit `alwaysLoad` like any other field. The plugin author can opt into eager loading.
- **`alwaysLoad` + ToolSearch disabled:** when ToolSearch is off entirely (`ENABLE_TOOL_SEARCH=false` or model doesn't support `tool_reference`), `alwaysLoad` is a no-op because no tool is deferred to begin with. The flag is a soft preference.
- **Per-tool `_meta` set to `false`:** the OR semantics means a server-level `alwaysLoad: true` overrides a per-tool `_meta["anthropic/alwaysLoad"]: false`. That's by design — the user (server-level) wins over the upstream author (per-tool `_meta`).

## Related Symbols

See [`symbol_additions_v2_1_142_mcp.md`](../00_overview/symbol_additions_v2_1_142_mcp.md) section "Module: MCP — `alwaysLoad`".

Key entities:
- `isDeferredTool` (`zm`, cli_inner_pretty.js:211830-211841)
- All MCP server config schemas now carry `alwaysLoad: z.boolean().optional()`:
  - `McpStdioServerConfigSchema` (`nq$`, cli_inner_pretty.js:48881-48889)
  - `McpSSEServerConfigSchema` (`Bu8`, cli_inner_pretty.js:48904-48913)
  - `McpSSEIdeServerConfigSchema` (`pu8`, cli_inner_pretty.js:48914-48922)
  - `McpWSIdeServerConfigSchema` (`Uu8`, cli_inner_pretty.js:48923-48932)
  - `McpHTTPServerConfigSchema` (`CR$`, cli_inner_pretty.js:48933-48942)
  - `McpWSServerConfigSchema` (`Fu8`, cli_inner_pretty.js:48943-48951)
  - `McpSDKServerConfigSchema` (`gu8`, cli_inner_pretty.js:48952)
  - `McpClaudeAiProxyServerConfigSchema` (`du8`, cli_inner_pretty.js:48954-48960)
