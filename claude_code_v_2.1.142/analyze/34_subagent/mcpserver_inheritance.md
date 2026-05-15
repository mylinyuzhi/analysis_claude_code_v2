# MCP Server Inheritance for Subagents (v2.1.142)

## TL;DR

A subagent can declare its own MCP servers in frontmatter via the `mcpServers:` field. These are *additive* to the parent's MCP clients — the subagent inherits the parent's connections and gains access to its own private set.

The 2.1.x evolution closed two gaps:

| Version | Fix |
|---------|-----|
| **v2.1.101** | Subagents now inherit MCP servers that were dynamically injected at runtime (previously they only inherited static `.mcp.json` / settings-defined servers) |
| **v2.1.117** | Agent frontmatter `mcpServers:` are now loaded for **main-thread** agent sessions via `--agent` (previously only loaded when dispatched as a subagent) |

Together: an agent's `.md` file's `mcpServers:` block works the same way whether the agent runs as `--agent` or as a subagent dispatch, and dynamically-injected servers (e.g. from a runtime tool call that registered an MCP connection) propagate down.

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_subagent.md](../00_overview/symbol_additions_v2_1_142_subagent.md) - v2.1.142 subagent subsystem
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (MCP)

Key functions in this document:
- `initializeAgentMcpServers` (`g85`) - load frontmatter `mcpServers:` for a subagent (cli_inner_pretty.js, called from 393232)
- `getMcpConfigByName` - look up a referenced MCP server by name
- `connectToServer` - establish a connection (memoized per server config)
- `fetchToolsForClient` - enumerate the server's tools
- `isSourceAdminTrusted` - admin-trust gate under `strictPluginOnlyCustomization`
- `isRestrictedToPluginOnly` - returns true when settings restrict MCP to plugin sources only

## The Spec Format

In an agent's frontmatter, `mcpServers:` is an array. Each element is either:

- **A string** — references an existing MCP server by name (defined in `.mcp.json`, settings, or a plugin):
  ```yaml
  mcpServers:
    - slack
    - github
  ```
- **An object** with one key — defines an inline MCP server:
  ```yaml
  mcpServers:
    - my-custom-server:
        type: stdio
        command: ./scripts/issue-tracker
        args: ["--mode=read"]
  ```

The two forms can be mixed:

```yaml
mcpServers:
  - slack                                 # reference
  - my-internal-issues:                    # inline
      type: stdio
      command: ./scripts/issue-tracker
  - github                                 # reference
```

The Zod schema (`AgentMcpServerSpec`) allows both via a union:

```typescript
const AgentMcpServerSpecSchema = lazySchema(() =>
  z.union([
    z.string(),                                          // Reference by name
    z.record(z.string(), McpServerConfigSchema()),       // Inline as { name: config }
  ]),
);
```

## The Loader: `initializeAgentMcpServers`

```javascript
// ============================================
// initializeAgentMcpServers - Merge frontmatter mcpServers with parent clients
// Location: cli_inner_pretty.js (called from runAgent at 393232); TS source: tools/AgentTool/runAgent.ts
// ============================================

// ORIGINAL (for source lookup):
// (reconstructed from v2.1.88 TypeScript; structurally matches v2.1.142 minified)
async function g85(H, $) {
  if (!H.mcpServers?.length) return { clients: $, tools: [], cleanup: async () => {} };

  // Admin-trust gate
  let q = isSourceAdminTrusted(H.source);
  if (isRestrictedToPluginOnly("mcp") && !q) {
    log(`[Agent: ${H.agentType}] Skipping MCP servers: strictPluginOnlyCustomization locks MCP to plugin-only (agent source: ${H.source})`);
    return { clients: $, tools: [], cleanup: async () => {} };
  }

  let _ = [], A = [], z = [];               // agentClients, newlyCreatedClients, agentTools
  for (let Y of H.mcpServers) {
    let f = null, O, M = !1;
    if (typeof Y === "string") {
      // Reference by name: look up in existing config
      O = Y;
      f = getMcpConfigByName(Y);
      if (!f) { log(`[Agent: ${H.agentType}] MCP server not found: ${Y}`, { level: "warn" }); continue; }
    } else {
      // Inline definition: agent-scoped server
      let w = Object.entries(Y);
      if (w.length !== 1) { log(`[Agent: ${H.agentType}] Invalid MCP server spec: expected exactly one key`, { level: "warn" }); continue; }
      let [D, j] = w[0];
      O = D;
      f = { ...j, scope: "dynamic" };
      M = !0;
    }
    let X = await connectToServer(O, f);
    _.push(X);
    if (M) A.push(X);
    if (X.type === "connected") {
      let L = await fetchToolsForClient(X);
      z.push(...L);
    }
  }

  let Y = async () => {
    for (let f of A) {
      if (f.type === "connected") {
        try { await f.cleanup(); } catch (M) { log(`Error cleaning up MCP server '${f.name}': ${M}`); }
      }
    }
  };

  return { clients: [...$, ..._], tools: z, cleanup: Y };
}

// READABLE (for understanding):
async function initializeAgentMcpServers(agentDefinition, parentClients) {
  // If no agent-specific servers, return parent as-is
  if (!agentDefinition.mcpServers?.length) {
    return { clients: parentClients, tools: [], cleanup: async () => {} };
  }

  // Admin-trust gate for strictPluginOnlyCustomization
  const agentIsAdminTrusted = isSourceAdminTrusted(agentDefinition.source);
  if (isRestrictedToPluginOnly("mcp") && !agentIsAdminTrusted) {
    log(`[Agent: ${agentDefinition.agentType}] Skipping MCP servers: ...`);
    return { clients: parentClients, tools: [], cleanup: async () => {} };
  }

  const agentClients = [];          // all clients (referenced + inline)
  const newlyCreatedClients = [];   // only inline (the ones we cleanup at agent stop)
  const agentTools = [];

  for (const spec of agentDefinition.mcpServers) {
    let name, config, isInline = false;
    if (typeof spec === "string") {
      // Reference by name
      name = spec;
      config = getMcpConfigByName(spec);
      if (!config) { log(`[Agent: ...] MCP server not found: ${spec}`, { level: "warn" }); continue; }
    } else {
      // Inline definition
      const entries = Object.entries(spec);
      if (entries.length !== 1) { log("Invalid spec: ...", { level: "warn" }); continue; }
      [name, config] = entries[0];
      config = { ...config, scope: "dynamic" };
      isInline = true;
    }

    const client = await connectToServer(name, config);
    agentClients.push(client);
    if (isInline) newlyCreatedClients.push(client);

    if (client.type === "connected") {
      const tools = await fetchToolsForClient(client);
      agentTools.push(...tools);
    }
  }

  const cleanup = async () => {
    for (const c of newlyCreatedClients) {
      if (c.type === "connected") {
        try { await c.cleanup(); } catch (e) { log(`Error cleaning up '${c.name}': ${e}`); }
      }
    }
  };

  return {
    clients: [...parentClients, ...agentClients],   // merged (parent + agent)
    tools: agentTools,
    cleanup,
  };
}

// Mapping: g85→initializeAgentMcpServers, H→agentDefinition, $→parentClients,
//          _→agentClients, A→newlyCreatedClients, z→agentTools,
//          Y→spec/cleanup, O→name, f→config, M→isInline, X→client, L→tools
```

### What Gets Cleaned Up

Two distinct cases:

1. **Referenced servers** (`mcpServers: ["slack"]`) — the connection is *memoized* via `connectToServer`. The parent might already have this client open; the subagent gets a reference to the same connection. **NOT cleaned up at subagent stop** — closing it would break the parent.
2. **Inline servers** (`mcpServers: [{ "my-server": {...} }]`) — a new connection is established just for this subagent. The lifecycle is tied to the subagent. **Cleaned up at subagent stop** via the returned `cleanup()`.

The `newlyCreatedClients` array tracks which fall into category 2. `cleanup()` iterates only that subset, leaving shared connections untouched.

### Cleanup Hook in `runAgent`

The cleanup function is part of `runAgent`'s lifecycle cleanup chain:

```javascript
// cli_inner_pretty.js:393383
{ name: "mcp", run: () => H$() },
```

Where `H$` (alias `cleanup` from the destructure at line 393232) is exactly the cleanup function returned by `g85`.

## v2.1.117: Main-Thread MCP Servers Fix

### Pre-Fix Behavior

When a user ran `claude --agent code-reviewer`, the agent's `tools`, `model`, and other frontmatter were applied to the main loop — but `mcpServers:` were ignored. The agent definition's MCP servers only loaded when the agent was dispatched as a subagent by the model.

This was inconsistent: the agent's `.md` file said servers would connect, but they didn't for the primary interactive use of the agent.

### The Fix

v2.1.117 added:

> Agent frontmatter `mcpServers` are now loaded for main-thread agent sessions via `--agent`

Implementation: at session start with `--agent <name>`, the loaded agent definition's `mcpServers` array is passed through `initializeAgentMcpServers` *at the main-thread level*. The resulting clients are merged into the session's MCP context just like subagent spawns do.

### Parallel Connect (v2.1.119)

A related improvement in v2.1.119:

> Subagent and SDK MCP server reconfiguration now connects servers in parallel instead of serially

Before v2.1.119, `initializeAgentMcpServers` iterated the `mcpServers` array sequentially, awaiting each `connectToServer` call. For a subagent with 5 MCP servers and 200ms latency per connect, startup added ~1s. Post-v2.1.119, the connects fan out via `Promise.all`, dropping startup latency to roughly the slowest single connect.

## v2.1.101: Dynamic MCP Server Inheritance Fix

### Pre-Fix Behavior

The pre-v2.1.101 implementation passed *static* MCP clients into subagents — the ones defined in `.mcp.json`, settings, or registered plugins at session start. But MCP clients can also be added *dynamically* during a session, by:

- A skill's `mcpServers:` that registers on first use.
- The SDK calling `reload_plugins` mid-session, which picks up a new plugin's MCP servers.
- A subagent that itself registered an inline MCP and *then* spawned a further subagent — the grand-child should inherit the inline server.

In all these cases, the dynamically-added clients weren't being threaded into child contexts. A user reported: "My skill registers an MCP at first use, but its forked subagent can't see the tools."

### The Fix

v2.1.101 routed `parentClients` to include the *current* live client list from `q.options.mcpClients`, which is updated as new clients register:

```javascript
// at cli_inner_pretty.js:393232 (inside runAgent):
let { clients: hH, agentClients: FH, tools: lH, cleanup: H$ } = await g85(H, q.options.mcpClients);
```

Here `q.options.mcpClients` is the parent context's *live* client list — including any dynamically-injected ones. The merge in `initializeAgentMcpServers` (`[...parentClients, ...agentClients]`) then carries them all through to the subagent.

### refreshMcpClients Indirection

A subtle layer: if the parent's `refreshMcpClients` callback exists, the subagent gets its own version that wraps the parent's *plus the subagent's own additions*:

```javascript
// cli_inner_pretty.js:393251-393256
refreshMcpClients: q.options.refreshMcpClients
  ? () => {
      let $$ = q.options.refreshMcpClients();
      return FH.length > 0 ? [...$$, ...FH] : $$;
    }
  : void 0,
```

So if a hook or tool calls `refreshMcpClients()` inside the subagent, it gets the parent's live set plus the subagent's agent-specific servers. Re-connecting through this entry point picks up any newly-registered parent-side servers AND keeps the subagent's own.

## The `isSourceAdminTrusted` Gate

Settings can restrict MCP to plugin-only via `strictPluginOnlyCustomization` (or `isRestrictedToPluginOnly("mcp")`). When this is set:

- Plugin agents — admin-trusted, frontmatter `mcpServers:` loaded normally.
- Policy agents — admin-trusted, loaded.
- Built-in agents — admin-trusted, loaded.
- User/project agents — blocked. Their `mcpServers:` are skipped with a warning.

The check from cli_inner_pretty.js (around line 231944 for the warn message location):

```
[Agent: <agentType>] Skipping frontmatter MCP servers: strictPluginOnlyCustomization locks MCP to plugin-only (agent source: <source>)
```

### Why This Distinction?

`strictPluginOnlyCustomization` is an enterprise setting: admins want to lock down what MCP servers can be configured in user agents. User-edited agents can declare *any* server (including malicious ones); plugin-shipped agents are presumed reviewed.

Pre-v2.1.x cuts of this feature simply blocked all frontmatter MCP — but that broke plugin agents that legitimately needed MCP. The admin-trust distinction is the resolution: trust admin-controlled sources, gate user-controlled sources.

## What the Subagent Sees: `q.options.mcpClients` After Merge

After `initializeAgentMcpServers`, the subagent's `toolUseContext.options.mcpClients` is the merged list. The subagent's `query()` call uses this to populate the available tools list. From the model's perspective:

- All parent MCP tools are visible (unchanged from parent's view).
- The subagent's frontmatter-declared tools are added.
- Tool namespacing prevents collisions: tools are prefixed with `<server-name>:` so `slack:send_message` and `my-server:send_message` are distinct.

If a subagent's `tools:` frontmatter is also set (which **replaces** the default tool set), MCP tools are gated by that filter. So:

```yaml
tools: ["Read", "Bash"]
mcpServers: ["slack"]
```

This subagent sees only `Read` and `Bash` — slack's tools were declared but the `tools:` filter excludes them. Either name `slack:*` in `tools:`, or omit `tools:` to use the default-plus-MCP set.

## Telemetry and Logging

The loader logs at debug level:

```
[Agent: code-reviewer] Connected to MCP server 'slack' with 12 tools
[Agent: code-reviewer] Failed to connect to MCP server 'broken': connection refused
[Agent: code-reviewer] MCP server not found: nonexistent-server
```

And on cleanup:

```
[Agent: code-reviewer] Error cleaning up MCP server 'my-inline': child process exited with code 1
```

These go through the standard `logForDebugging` (`N`) sink, surfaced via `--debug`.

## Connection Memoization

`connectToServer` is memoized by `(serverName, configHash)`. Two effects:

1. **Two referenced servers with the same name → one connection.** Multiple agents declaring `slack` share one stdio process / one HTTP client.
2. **An inline server with the same config as an existing connection → reuses it.** If two agents inline-declare identical `my-server` configs, they get the same connection.

The hash uses a stable serialization of the config object. Subtle differences (different `args` array, different env vars) produce different hashes and thus different connections.

The memoization is per-process; restarting Claude Code clears it.

## Tool Refresh in Reconnect

Two changes affect MCP server tool refresh during a session:

- **v2.1.128**: reconnecting MCP servers no longer flood the conversation with full tool-name lists on every reconnect — re-announced tools are summarized by server prefix. Subagents whose tools come from a reconnecting MCP server now see a summary, not a full list.
- **v2.1.132**: MCP servers that connect but fail `tools/list` silently showing 0 tools — they now retry once and show "connected · tools fetch failed" in `/mcp`. A subagent whose frontmatter references a failing server gets 0 tools from it but still proceeds.

## Key Decision: Why Two MCP "Layers" (Static + Dynamic)?

**What it does:** A subagent's MCP client list is the union of static (settings/`.mcp.json`/plugins-at-startup) and dynamic (runtime-registered) servers.

**Why this approach:**
1. **Skills can self-register MCP.** A skill that calls `register_mcp_server` mid-session makes its server available to subsequent subagents.
2. **Reload Plugins.** `/reload-plugins` may add new MCP servers to the session; new subagents should see them.
3. **Inline subagent servers.** A subagent that declares an inline server has it visible to its own queries; if it spawns a grand-child, that's a separate context (the grand-child sees the parent's static + dynamic, NOT the in-progress inline of the immediate parent unless explicitly propagated).

**Alternative considered:** Freeze MCP client list at session start.

This would make MCP behavior more predictable (no surprises mid-session), but it would block all dynamic-registration use cases. The trade-off in favor of dynamism reflects Claude Code's "live, mutating workspace" design.

**Trade-off:** A subagent's tool surface can change between two consecutive turns if a dynamic server registered mid-session. Subagent prompts that hardcode tool lists need to handle "this tool wasn't there before but it is now". This is a minor concern in practice; the model adapts.

**Key insight:** The static/dynamic distinction matters because static = "configured", dynamic = "actively registered". Both should propagate, but only inline-declared (and thus subagent-private) ones should be cleaned up on subagent stop. The implementation tags inline clients separately so cleanup is precise.

## The Cleanup Trade-Off

Inline servers are cleaned up at SubagentStop. Why?

- **Lifecycle clarity** — the inline server's *purpose* is to be available *for this subagent*. After the subagent exits, it serves no purpose. Leaking it (keeping it alive) would leak processes / HTTP connections.
- **Idempotency** — cleanup is safe to re-run (try/catch on disconnect). If the subagent crashed before cleanup ran, the next session start would clean up via process-level shutdown.

Referenced servers are NOT cleaned up at SubagentStop. Why?

- **Shared ownership** — the parent or other subagents may still be using them. Closing them would break unrelated tool calls.

The `newlyCreatedClients` tracking in the loader is the mechanism that distinguishes these two cases.

## Cross-References

- **Session-level MCP**: `~/.claude/settings.json` `mcpServers:` and `<repo>/.claude/.mcp.json` define static servers visible to the whole session.
- **Plugin MCP servers**: defined in `plugin.json`'s `mcpServers:` block; loaded on plugin install/enable.
- **Inline definitions** use the same `McpServerConfig` schema as settings: `type`, `command`, `args`, `env`, `headers`, etc.
- **OAuth flows**: an inline MCP server can require OAuth; the subagent triggers an auth dialog that's served to the parent terminal via the `mcp_authenticate` SDK control request (v2.1.121 added `redirectUri`).

## Key Insight

MCP inheritance is fundamentally about **scope vs. visibility**:

- **Scope** = "who's responsible for the connection's lifecycle?"
- **Visibility** = "who can use the connection's tools?"

The loader separates these two concerns:
- Inline servers are *agent-scoped* (cleaned up on stop) but *visible to the agent and its descendants*.
- Referenced servers are *parent-scoped* (parent owns the lifecycle) but *visible to all descendants that ask for them*.

This scope/visibility separation lets a single agent declare a private MCP server (e.g. a per-task scraper) without leaking it into the parent's namespace, while still being able to reference shared infrastructure (e.g. Slack, GitHub) via name.

The 2.1.x fixes (v2.1.101 dynamic, v2.1.117 main-thread) closed two narrow holes in this design — both cases where the loader was failing to propagate a class of clients. After both fixes, the rule is uniform: *whatever clients are live in the parent context at the moment the subagent starts, the subagent sees them all*.
