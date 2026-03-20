# Plugin System Integration Overview (Claude Code 2.1.76)

> Quick reference for understanding how plugins integrate with Claude Code's core systems.

---

## Documents in This Module

| File | Content |
|------|---------|
| `implementation.md` | Core plugin loading, caching, marketplace, security |
| `marketplace.md` | Marketplace sources, installation, enterprise policy |
| `plugin_hooks.md` | Hook registration, hot-reload, lifecycle |
| `skills_and_commands.md` | Skills and Commands integration |
| `agents_and_output_styles.md` | Agents and Output Styles |
| `cli_and_telemetry.md` | CLI commands and telemetry events |

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
         │  (w96)        │  │   (hk8)       │  │   (KQ6)       │
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
         │    (nB)       │  │   (VU7)       │  │    (Ik8)      │
         └───────┬───────┘  └───────┬───────┘  └───────────────┘
                 │                  │
                 ▼                  ▼
         ┌───────────────┐  ┌───────────────┐
         │  Hook System  │  │  MCP Manager  │
         │   Registry    │  │               │
         └───────────────┘  └───────────────┘
```

---

## Cross-Module Integration Diagrams

### Plugin Loading Sequence

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    PLUGIN LOADING SEQUENCE                                    │
└─────────────────────────────────────────────────────────────────────────────┘

    Session Start
         │
         ▼
    ┌──────────────────────────────────────┐
    │  loadEnabledPlugins (ip9)             │
    │  - Read enabledPlugins from settings  │
    │  - Resolve marketplace sources        │
    └──────────────────┬───────────────────┘
                       │
         ┌─────────────┼─────────────┐
         ▼             ▼             ▼
    ┌─────────┐  ┌─────────┐  ┌─────────┐
    │ GitHub  │  │   URL   │  │  Local  │
    │ Source  │  │ Source  │  │ Source  │
    └────┬────┘  └────┬────┘  └────┬────┘
         │            │            │
         └────────────┼────────────┘
                      ▼
    ┌──────────────────────────────────────┐
    │  loadPluginManifest (h24)            │
    │  - Read .claude-plugin/plugin.json   │
    │  - Discover components               │
    │  - Validate paths                    │
    └──────────────────┬───────────────────┘
                       │
         ┌─────────────┼─────────────┬─────────────┬─────────────┐
         ▼             ▼             ▼             ▼             ▼
    ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐
    │Commands │  │ Agents  │  │ Skills  │  │  Hooks  │  │   MCP   │
    │ (w96)   │  │ (KQ6)   │  │ (hk8)   │  │  (nB)   │  │ (VU7)   │
    └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘
         │            │            │            │            │
         ▼            ▼            ▼            ▼            ▼
    ┌─────────────────────────────────────────────────────────────┐
    │                    Component Registries                       │
    │  - Slash Command Registry (09_slash_command)                 │
    │  - Agent Tool Picker (30_agent_teams)                        │
    │  - Skill Registry (10_skill_system)                          │
    │  - Hook Registry (11_hooks)                                  │
    │  - MCP Server Registry (15_mcp_protocol)                     │
    └─────────────────────────────────────────────────────────────┘
```

### Hook Integration Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    PLUGIN HOOK INTEGRATION                                    │
└─────────────────────────────────────────────────────────────────────────────┘

    Plugin with hooksConfig
            │
            ▼
    ┌──────────────────────────────────────┐
    │  loadAllPluginHooks (nB)              │
    │  - Get enabled plugins                │
    │  - Initialize 21 event queues         │
    └──────────────────┬───────────────────┘
                       │
                       ▼
    ┌──────────────────────────────────────┐
    │  extractPluginHooksForEvent (nF9)    │
    │  - Convert hooksConfig to             │
    │    event-indexed format               │
    └──────────────────┬───────────────────┘
                       │
                       ▼
    ┌──────────────────────────────────────┐
    │  registerPluginHooks (KA6)           │
    │  - Add to global hook registry        │
    │  - Set priority=999 (last)            │
    └──────────────────┬───────────────────┘
                       │
                       ▼
    ┌──────────────────────────────────────┐
    │  Global Hook Registry (11_hooks)     │
    │                                       │
    │  Priority Order:                      │
    │  1. System hooks (1-10)               │
    │  2. User hooks (10-100)               │
    │  3. Plugin hooks (999) ← LAST         │
    └──────────────────────────────────────┘
```

### MCP Server Namespacing Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    PLUGIN MCP NAMESPACING                                     │
└─────────────────────────────────────────────────────────────────────────────┘

    Plugin manifest:
    {
      "mcpServers": {
        "myserver": { "command": "node", "args": ["server.js"] }
      }
    }
            │
            ▼
    ┌──────────────────────────────────────┐
    │  loadPluginMcpServers (VU7)          │
    │  - Read .mcp.json or manifest        │
    │  - Expand ${CLAUDE_PLUGIN_ROOT}      │
    └──────────────────┬───────────────────┘
                       │
                       ▼
    ┌──────────────────────────────────────┐
    │  namespaceMcpServers (bN9)           │
    │  - Prefix: "plugin:{name}:{server}"  │
    │  - Mark scope: "dynamic"             │
    └──────────────────┬───────────────────┘
                       │
                       ▼
    Registered as: "plugin:my-plugin:myserver"

    Tool names: "mcp__plugin_my-plugin_myserver__toolName"
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
Plugin → hooks/hooks.json → loadPluginHooks (N24) → loadAllPluginHooks (nB) → Global Hook Registry
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
getPluginCommands (w96) → Command Registry → Slash Command Handler
```

### 6. Agent Teams (via custom agents)

Plugin agents appear in the Agent tool:

```
getPluginAgents (KQ6) → Agent Definitions → Agent Tool Picker
```

### 7. LSP Servers (via .lsp.json)

Plugins can provide LSP server configurations:

```
Plugin → .lsp.json → loadPluginLspConfig (HvY) → namespacePluginServers (JvY) → LSP Server Manager
```

Server naming: `plugin:{pluginName}:{serverName}` with `scope: "dynamic"`

See: [27_lsp_integration/configuration.md](../27_lsp_integration/configuration.md) for full analysis.

---

## Loading Sequence

```
1. Session Start
   │
   ├─▶ loadEnabledPlugins (ip9)
   │     │
   │     ├─▶ lookupPluginEntry (a0) - Find plugin in marketplace
   │     │
   │     ├─▶ loadPlugin (sp6) - Load and cache
   │     │     │
   │     │     └─▶ loadPluginManifest (h24) - Discover components
   │     │
   │     └─▶ Return { plugins, errors }
   │
   ├─▶ loadAllPluginHooks (nB) - Register hooks
   │
   ├─▶ getPluginCommands (w96) - Load commands
   │
   ├─▶ getPluginSkills (hk8) - Load skills
   │
   ├─▶ getPluginAgents (KQ6) - Load agents
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
  "pathPattern": "**/*.py",
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

## Integration with Related Modules

### 1. System Reminder Module (04_system_reminder)

**Connection point:** Plugin skills are attached to system reminders for discoverability.

**Flow:**
```
Session Start
    │
    ├─ getPluginSkills (hk8)
    │     │
    │     └─ Returns skill definitions
    │
    └─ System Reminder Assembly
          │
          └─ Skills listed in reminder:
                "You can invoke them with: /plugin-name:skill-name"
```

**Key insight:** Plugin skills appear in the system reminder's skill listing, making them discoverable to users without explicit documentation. The reminder format:

```
When users reference a "slash command" or "/<something>" (e.g., "/commit", "/review-pr"),
they are referring to a skill. Use this tool to invoke it.
...
Available skills:
- plugin-name:skill-name - Description from SKILL.md
```

**Files to reference:**
- `04_system_reminder/` - Skill listing attachment mechanism
- `skills_and_commands.md` - `getPluginSkills` (hk8) implementation

### 2. Slash Command Module (09_slash_command)

**Connection point:** Plugin commands are registered as slash commands.

**Flow:**
```
Plugin Command Discovery
    │
    ├─ getPluginCommands (w96)
    │     │
    │     ├─ loadCommandsFromDir (m_4) - Scan for COMMAND.md files
    │     │
    │     └─ createCommandObject (dp6) - Build command definition
    │
    └─ Command Registry
          │
          ├─ Registered as: /plugin-name:command-name
          │
          └─ Slash Command Handler
                │
                └─ When user types /plugin-name:command-name
                      │
                      └─ Invoke Skill tool with plugin command context
```

**Namespacing:** Plugin commands use `plugin-name:command-name` format to prevent collisions with built-in commands.

**Command context includes:**
- `pluginInfo` - Plugin manifest and repository info
- `skill` - The command definition object
- `args` - User-provided arguments

**Files to reference:**
- `09_slash_command/` - Command registration and routing
- `skills_and_commands.md` - `getPluginCommands` (w96) implementation

### 3. Skill System Module (10_skill_system)

**Connection point:** Plugin skills are loaded and invoked through the skill system.

**Loading flow:**
```
getPluginSkills (hk8)
    │
    ├─ For each enabled plugin:
    │     │
    │     ├─ Check skillsPath (default: skills/)
    │     │
    │     └─ loadSkillsFromDir (B_4)
    │           │
    │           ├─ Scan for SKILL.md files
    │           │
    │           ├─ Parse frontmatter (description, accepts_args, etc.)
    │           │
    │           └─ Create skill definition:
    │                 {
    │                   type: "skill",
    │                   name: "plugin-name:skill-name",
    │                   source: "plugin",
    │                   systemPrompt: "...",  // From SKILL.md content
    │                   pluginInfo: { ... }
    │                 }
    │
    └─ Merge with built-in skills in skill registry
```

**Invocation flow:**
```
User types: /plugin-name:skill-name args
    │
    ├─ Skill tool invoked
    │     │
    │     ├─ Lookup skill in registry
    │     │
    │     ├─ Build prompt from skill definition
    │     │
    │     └─ Execute with agent context
    │
    └─ Skill has access to plugin-provided tools via MCP
```

**Files to reference:**
- `10_skill_system/` - Skill registry and invocation
- `skills_and_commands.md` - `getPluginSkills` (hk8), `loadSkillsFromDir` (B_4)

### 4. Hooks Module (11_hooks)

**Connection point:** Plugin hooks integrate with the global hook event system.

**21 Hook Events (v2.1.76):**

| Event | When Fired |
|-------|-----------|
| `PreToolUse` | Before any tool execution |
| `PostToolUse` | After tool execution completes |
| `Notification` | When notification is displayed |
| `Stop` | When session ends |
| `SubagentStop` | When subagent completes |
| `PreCompact` | Before context compaction |
| `PostCompact` | After context compaction |
| `UserPromptSubmit` | When user submits prompt |
| `PreSession` | At session start |
| `PostSession` | At session end |
| `SessionStart` | Alternative session start hook |
| `SessionEnd` | Alternative session end hook |
| `StatusLineSet` | When status line updates |
| `EnterPlanMode` | When entering plan mode |
| `ExitPlanMode` | When exiting plan mode |
| `TodoWrite` | When todos are updated |
| `TaskCreate` | When task is created |
| `TodoList` | When todo list is accessed |
| `WorktreeCreate` | When git worktree is created |
| `WorktreeRemove` | When git worktree is removed |
| `InstructionsLoaded` | When CLAUDE.md files are loaded |

**Hook loading flow:**
```
loadAllPluginHooks (nB)
    │
    ├─ For each enabled plugin:
    │     │
    │     ├─ loadPluginHooks (N24) - Parse hooks/hooks.json
    │     │
    │     └─ Merge with manifest.hooks declarations
    │
    └─ Register in global hook registry with priority 999
```

**Priority order (hooks execute in this order):**
1. System hooks (built-in)
2. User hooks (from settings)
3. Plugin hooks (priority 999, last)

**Hot-reload mechanism:**
```
setupPluginHookHotReload (oF9)
    │
    ├─ Watch for settings changes
    │
    ├─ On change:
    │     │
    │     ├─ getEnabledPluginsHash (F_4) - Compute hash
    │     │
    │     ├─ Compare with previous hash
    │     │
    │     └─ If different:
    │           │
    │           ├─ clearPluginHookCache (d01)
    │           │
    │           └─ Re-register hooks
    │
    └─ Observable pattern for reactive updates
```

**Enterprise policy:**
- `allowManagedHooksOnly` → All plugin hooks disabled
- `l1z` function checks this policy before hook registration

**Files to reference:**
- `11_hooks/` - Hook event system and registry
- `plugin_hooks.md` - `loadAllPluginHooks` (nB), hot-reload mechanism

### 5. MCP Integration

**Connection point:** Plugin MCP servers appear as tools in the tool registry.

**Flow:**
```
loadPluginMcpServers (VU7)
    │
    ├─ For each plugin:
    │     │
    │     ├─ Read .mcp.json or manifest.mcpServers
    │     │
    │     ├─ Expand variables:
    │     │     ${CLAUDE_PLUGIN_ROOT} → plugin install path
    │     │     ${user_config.KEY} → user-provided config
    │     │
    │     └─ Namespace servers:
    │           "myserver" → "plugin:my-plugin:myserver"
    │
    └─ getAllMcpServersWithPlugins (zG1)
          │
          └─ Merge: Plugin MCPs + User MCPs + Project MCPs
```

**Tool naming:** Plugin-provided tools appear as `mcp__plugin_pluginName_serverName__toolName`.

**Files to reference:**
- `implementation.md` - `loadPluginMcpServers` (VU7)
- `../15_mcp_protocol/` - MCP server management

### 6. LSP Integration

**Connection point:** Plugin LSP servers integrate with the LSP Server Manager.

**Flow:**
```
Plugin → .lsp.json → loadPluginLspConfig (HvY) → LSP Server Manager
```

**LSP config discovery:**
```
my-plugin/
├── .lsp.json              # LSP server configurations
└── .claude-plugin/
    └── plugin.json        # Can also declare lspServers in manifest
```

**LSP config format:**
```json
{
  "servers": {
    "typescript": {
      "command": "typescript-language-server",
      "args": ["--stdio"],
      "fileExtensions": [".ts", ".tsx"]
    }
  }
}
```

**Server namespacing:**
- Original: `"typescript"`
- Namespaced: `"plugin:my-plugin:typescript"` with `scope: "dynamic"`

**Variable expansion:**
- `${CLAUDE_PLUGIN_ROOT}` → Plugin installation directory
- Used for relative paths in command/args

**Files to reference:**
- `../27_lsp_integration/configuration.md` - Full LSP config analysis
- `symbol_index_infra_integration.md` - LSP symbols (HvY, JvY)

### 7. Chrome/Browser Integration

**Connection point:** Plugins can contribute browser automation capabilities via MCP.

**Relevant functions:**
- `getChromeMcpConfig` (HBA) - Chrome MCP configuration
- `createChromeMcpServer` (KBA) - Chrome MCP server factory

**Files to reference:**
- `../28_browser_control/` - Browser control analysis

---

## Related Symbol Indexes

- [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Plugin System section
- [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Hooks, Skills sections
- [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Tools, MCP sections
