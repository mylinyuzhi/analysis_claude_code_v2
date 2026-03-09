# Plugin System Integration Overview (Claude Code 2.1.38)

> Quick reference for understanding how plugins integrate with Claude Code's core systems.

---

## Documents in This Module

| File | Content |
|------|---------|
| `implementation.md` | Core plugin loading, caching, marketplace, security |
| `marketplace.md` | Marketplace sources, installation, enterprise policy |
| `plugin_hooks.md` | Hook registration, hot-reload, lifecycle |
| `skills_and_commands.md` | Skills and Commands integration (NEW) |
| `agents_and_output_styles.md` | Agents and Output Styles (NEW) |
| `cli_and_telemetry.md` | CLI commands and telemetry events (NEW) |

---

## Component Integration Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         PLUGIN COMPONENT INTEGRATION                              │
└─────────────────────────────────────────────────────────────────────────────────┘

                                  Plugin
                                    │
                 ┌──────────────────┼──────────────────┐
                 │                  │                  │
                 ▼                  ▼                  ▼
         ┌───────────────┐  ┌───────────────┐  ┌───────────────┐
         │   Commands    │  │    Skills     │  │    Agents     │
         │  (YK1)        │  │   (B0A)       │  │   (wK1)       │
         └───────┬───────┘  └───────┬───────┘  └───────┬───────┘
                 │                  │                  │
                 ▼                  ▼                  ▼
         ┌───────────────┐  ┌───────────────┐  ┌───────────────┐
         │ Slash Command │  │ Skill Registry│  │  Agent Tool   │
         │   System      │  │               │  │   Picker      │
         └───────────────┘  └───────────────┘  └───────────────┘

                 ┌──────────────────┼──────────────────┐
                 │                  │                  │
                 ▼                  ▼                  ▼
         ┌───────────────┐  ┌───────────────┐  ┌───────────────┐
         │    Hooks      │  │ MCP Servers   │  │ Output Styles │
         │    (pa)       │  │   (VU7)       │  │               │
         └───────┬───────┘  └───────┬───────┘  └───────────────┘
                 │                  │
                 ▼                  ▼
         ┌───────────────┐  ┌───────────────┐
         │  Hook System  │  │  MCP Manager  │
         │   Registry    │  │               │
         └───────────────┘  └───────────────┘
```

---

## Integration Points

### 1. Tools System (via MCP Servers)

Plugins can provide MCP servers that appear as tools:

```
Plugin → .mcp.json → loadPluginMcpServers (VU7) → getAllMcpServersWithPlugins (zG1) → Tool Registry
```

Server naming: `plugin:{pluginName}:{serverName}` with `scope: "dynamic"`

### 2. Hooks System (via hooksConfig)

Plugins register hooks that run at lifecycle events:

```
Plugin → hooks/hooks.json → loadPluginHooks (Xn4) → loadAllPluginHooks (pa) → Global Hook Registry
```

Priority: Plugin hooks run last (priority 999) after user hooks.

### 3. Compact System (via session memory)

Plugins can provide session memory:

- Access via `pluginInfo` in command context
- Stored in plugin's cached directory

### 4. Reminder System (via system prompts)

Plugin commands can add context to prompts:

```
createCommandObject → getPromptForCommand() → Prompt Assembly
```

### 5. Slash Commands (via command registry)

Plugin commands appear as `/plugin-name:command-name`:

```
getPluginCommands (YK1) → Command Registry → Slash Command Handler
```

### 6. Agent Teams (via custom agents)

Plugin agents appear in the Agent tool:

```
getPluginAgents (wK1) → Agent Definitions → Agent Tool Picker
```

---

## Loading Sequence

```
1. Session Start
   │
   ├─▶ loadEnabledPlugins (HxY)
   │     │
   │     ├─▶ lookupPluginEntry (a0) - Find plugin in marketplace
   │     │
   │     ├─▶ loadPlugin ($xY) - Load and cache
   │     │     │
   │     │     └─▶ loadPluginManifest (Pn4) - Discover components
   │     │
   │     └─▶ Return { plugins, errors }
   │
   ├─▶ loadAllPluginHooks (pa) - Register hooks
   │
   ├─▶ getPluginCommands (YK1) - Load commands
   │
   ├─▶ getPluginSkills (B0A) - Load skills
   │
   ├─▶ getPluginAgents (wK1) - Load agents
   │
   └─▶ getAllMcpServersWithPlugins (zG1) - Merge MCP servers
```

---

## Key Files

| File | Purpose |
|------|---------|
| `~/.claude/settings.json` | `enabledPlugins` configuration |
| `~/.claude/known_marketplaces.json` | Installed marketplace registry |
| `~/.claude/installed_plugins.json` | Plugin installation metadata |
| `~/.claude/cache/{marketplace}/{plugin}/{version}/` | Versioned plugin cache |
| `~/.claude/marketplaces/{name}/` | Cached marketplace data |

---

## Configuration Scopes

| Scope | File | Availability |
|-------|------|--------------|
| `user` | `~/.claude/settings.json` | All projects |
| `project` | `.claude/settings.json` | Current project |
| `local` | `.claude/settings.local.json` | Local overrides |

Priority: `local` > `project` > `user`

---

## Plugin Manifest Structure

```json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "description": "Plugin description",
  "commands": {
    "my-cmd": { "source": "commands/my-cmd.md", "description": "..." }
  },
  "agents": ["agents/reviewer"],
  "skills": ["skills/code-review"],
  "hooks": ["hooks/custom-hooks.json"],
  "outputStyles": ["output-styles/minimal.json"],
  "mcpServers": { "my-server": { "command": "...", "args": [...] } }
}
```

---

## Enterprise Policy

| Policy Setting | Effect |
|----------------|--------|
| `strictKnownMarketplaces` | Whitelist of allowed marketplace sources |
| `blockedMarketplaces` | Blacklist of blocked sources |
| `allowManagedHooksOnly` | Disable all plugin hooks |

---

## Error Handling

Plugin errors are non-fatal. Errors are collected and surfaced in diagnostics:

```javascript
{ type: "plugin-not-found", source: "pluginId", ... }
{ type: "marketplace-blocked-by-policy", ... }
{ type: "path-not-found", component: "commands", ... }
{ type: "hook-load-failed", hookPath: "...", ... }
```

---

## Related Symbol Indexes

- [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Plugin System section
- [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Hooks, Skills sections
- [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Tools, MCP sections