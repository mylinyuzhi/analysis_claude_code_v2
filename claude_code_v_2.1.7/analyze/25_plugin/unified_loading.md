# Plugin Unified Component Loading System

## Overview

Claude Code v2.1.7 plugins provide a unified system for loading multiple component types (agents, skills, commands, hooks, MCP servers) through a single manifest schema. This document details the unified loading architecture and how plugin components merge with local configurations.

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

**Key functions:**
- `discoverPluginsAndHooks` (DG) - Master plugin discovery
- `parsePluginManifest` (LF1) - Manifest parsing with validation
- `loadPluginComponents` (ao2) - Component loader
- `mergeHooksArrays` (lo2) - Hook merging
- `mergeAgentsBySource` (mb) - Agent priority merging
- `sortHooksByPriority` (n32) - Hook execution ordering

---

## Quick Navigation

- [Unified Manifest Schema](#unified-manifest-schema)
- [Component Path Resolution](#component-path-resolution)
- [Priority and Merging](#priority-and-merging)
- [Local Configuration Integration](#local-configuration-integration)
- [Component Discovery Flow](#component-discovery-flow)

---

## Unified Manifest Schema

### V4A - Master Plugin Schema

The `V4A` schema (chunks.90.mjs:1690-1698) unifies all component definitions in a single validated schema:

```javascript
// ============================================
// V4A - Unified plugin manifest schema
// Location: chunks.90.mjs:1690-1698
// ============================================

V4A = zod.object({
  ...V75.shape,    // Base metadata (name, version, description, author, etc.)
  ...F75.partial().shape,   // Hooks configuration
  ...E75.partial().shape,   // Commands definition
  ...z75.partial().shape,   // Agents definition
  ...$75.partial().shape,   // Skills definition
  ...C75.partial().shape,   // Output styles definition
  ...U75.partial().shape,   // MCP servers definition
  ...N75.partial().shape    // LSP servers definition
}).strict();

// Schema sections:
// V75 (1631-1641): name, version, description, author, homepage, repository, license, keywords
// E75 (1656-1657): commands (paths or object mappings)
// z75 (1658-1659): agents (paths)
// $75 (1660-1661): skills (paths)
// C75 (1662-1663): outputStyles (paths)
// F75 (1645-1646): hooks (files or inline)
// U75 (1664-1665): mcpServers (inline, paths, or MCPB URLs)
// N75 (1688-1689): lspServers (configuration)
```

### Plugin Manifest Example

```json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "description": "A comprehensive plugin",
  "author": "developer",

  "commands": ["commands/", "extra-commands/"],
  "agents": ["agents/"],
  "skills": ["skills/", "custom-skills/"],
  "outputStyles": ["output-styles/"],

  "hooks": {
    "PreToolUse": [
      { "matcher": "Bash", "hooks": [{ "type": "command", "command": "echo pre" }] }
    ]
  },

  "mcpServers": {
    "my-server": { "command": "node", "args": ["server.js"] }
  },

  "lspServers": {
    "typescript": { "command": "typescript-language-server", "args": ["--stdio"] }
  }
}
```

---

## Component Path Resolution

### Loading Modes

Each component type supports two loading modes:

| Component | Manifest Key | Directory Convention |
|-----------|--------------|---------------------|
| Commands | `commands` | `/commands/` |
| Agents | `agents` | `/agents/` |
| Skills | `skills` | `/skills/` |
| Output Styles | `outputStyles` | `/output-styles/` |
| Hooks | `hooks` | `/hooks/hooks.json` |
| MCP Servers | `mcpServers` | `/.mcp.json` |

### Path Resolution Algorithm (ao2)

```javascript
// ============================================
// Component path resolution in ao2
// Location: chunks.130.mjs:2612-2827
// ============================================

// For each component type:
// 1. Check manifest declaration first
if (manifest.skills) {
  // Array/string of paths: ["skills/subdir", "path/to/skill.md"]
  result.skillsPaths = normalizeToArray(manifest.skills);
}
// 2. Fall back to directory convention
else if (fs.existsSync(path.join(pluginRoot, "skills"))) {
  result.skillsPath = path.join(pluginRoot, "skills");
}

// Path types supported:
// - Relative: "./skills" → resolved from plugin root
// - File: "path/to/skill.md" → single file
// - Directory: "skills/" → scanned recursively
// - URL (MCP only): "https://example.com/bundle.mcpb"
```

### MCP Server Loading (aQ7)

MCP servers support three input formats:

```javascript
// ============================================
// aQ7 - MCP Servers Configuration Unifier
// Location: chunks.130.mjs:1360-1411
// ============================================

// Format 1: Standard file location
// Looks for .mcp.json in plugin root
if (plugin.path) {
  const standardConfig = readMcpConfigFile(plugin.path, ".mcp.json");
  mcpConfig = { ...mcpConfig, ...standardConfig };
}

// Format 2: Manifest string (path or URL)
if (typeof manifest.mcpServers === "string") {
  if (isValidUrl(manifest.mcpServers)) {
    // Download from MCPB URL
    const downloaded = await downloadMCPBFile(plugin, manifest.mcpServers);
    mcpConfig = { ...mcpConfig, ...downloaded };
  } else {
    // Read from relative path
    const fileConfig = readMcpConfigFile(plugin.path, manifest.mcpServers);
    mcpConfig = { ...mcpConfig, ...fileConfig };
  }
}

// Format 3: Inline object
if (typeof manifest.mcpServers === "object" && !Array.isArray(manifest.mcpServers)) {
  mcpConfig = { ...mcpConfig, ...manifest.mcpServers };
}

// Format 4: Array (mixed formats)
if (Array.isArray(manifest.mcpServers)) {
  for (const entry of manifest.mcpServers) {
    // Each entry can be string (path/URL) or object (inline)
  }
}
```

---

## Priority and Merging

### Hook Priority Order

```javascript
// ============================================
// Hook priority constants
// Location: chunks.91.mjs:2779
// ============================================

const HOOK_PRIORITY_ORDER = ["localSettings", "projectSettings", "userSettings"];
// Lower index = higher priority

// Plugin hooks get priority 999 (lowest)
const getPriority = (source) => source === "pluginHook" ? 999 : priorityMap[source];
```

| Source | Priority | Execution Order |
|--------|----------|-----------------|
| `localSettings` | 0 | First (highest) |
| `projectSettings` | 1 | Second |
| `userSettings` | 2 | Third |
| `pluginHook` | 999 | Last (lowest) |

**Key insight:** Plugin hooks are **READ-ONLY** - users cannot edit or remove them through settings. Must disable the plugin to remove its hooks.

### Agent Priority Order

```javascript
// ============================================
// Agent merging by source (mb)
// Location: chunks.93.mjs:602-614
// ============================================

// Priority order (later overwrites earlier):
const agentsByPriority = [
  builtInAgents,        // Priority 1: Built-in (base)
  pluginAgents,         // Priority 2: Plugin agents
  userSettingsAgents,   // Priority 3: ~/.claude/agents/
  projectSettingsAgents, // Priority 4: .claude/agents/
  flagSettingsAgents,   // Priority 5: CLI --agents
  policySettingsAgents  // Priority 6: Managed (highest)
];

// Deduplication: Same agentType from later source overwrites earlier
const agentMap = new Map();
for (const agentGroup of agentsByPriority) {
  for (const agent of agentGroup) {
    agentMap.set(agent.agentType, agent);
  }
}
```

| Source | Priority | Override Power |
|--------|----------|----------------|
| `built-in` | 1 | Lowest (base) |
| `plugin` | 2 | Low |
| `userSettings` | 3 | Medium |
| `projectSettings` | 4 | Medium-High |
| `flagSettings` | 5 | High |
| `policySettings` | 6 | Highest |

### Skills Assembly (No Deduplication)

```javascript
// ============================================
// Skills assembly (Wz7)
// Location: chunks.146.mjs:2298-2318
// ============================================

// Skills are NOT deduplicated - kept in separate arrays
const { skillDirCommands, pluginSkills, bundledSkills } = await assembleAllSkills();

// Final combination in getAllCommands (Aj):
return [
  ...bundledSkills,      // Priority 1: Bundled (first)
  ...skillDirCommands,   // Priority 2: Directory skills
  ...mcpPrompts,         // Priority 3: MCP prompts
  ...pluginSkills,       // Priority 4: Plugin skills
  ...dynamicSkills,      // Priority 5: Dynamic/eligibility
  ...builtinCommands     // Priority 6: Built-in (last)
].filter(cmd => cmd.isEnabled());
```

---

## Local Configuration Integration

### Configuration Sources

| Component | Local Path | Plugin Path | Merge Strategy |
|-----------|------------|-------------|----------------|
| **Hooks** | `~/.claude/settings.json` | `plugin.json` | Concat arrays by hook type |
| **Agents** | `~/.claude/agents/*.md` | `agents/` | Map by agentType, last wins |
| **Skills** | `~/.claude/skills/*` | `skills/` | Keep separate, no dedup |
| **Commands** | `~/.claude/commands/*` | `commands/` | Keep separate |
| **MCP** | `~/.claude/.mcp.json` | `.mcp.json` | Merge objects, last wins |

### Hook Merging Algorithm (lo2)

```javascript
// ============================================
// mergeHooksArrays - Hook array merger
// Location: chunks.130.mjs:2830-2838
// ============================================

function mergeHooksArrays(existingHooks, newHooks) {
  if (!existingHooks) return newHooks;

  let merged = { ...existingHooks };

  for (const [hookName, hookHandlers] of Object.entries(newHooks)) {
    if (!merged[hookName]) {
      // New hook type
      merged[hookName] = hookHandlers;
    } else {
      // Hook type exists: concatenate handler arrays
      merged[hookName] = [...(merged[hookName] || []), ...hookHandlers];
    }
  }

  return merged;
}
```

### Plugin Configuration per User

```javascript
// Per-plugin configuration storage
// Location: chunks.130.mjs:1000-1017

// Users can configure plugin-specific settings:
pluginConfigs[pluginId] = {
  mcpServers: {
    serverName: { enabled: true, envOverrides: {...} }
  },
  // Other plugin-specific overrides
};
```

---

## Component Discovery Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    discoverPluginsAndHooks (DG)                  │
│                              │                                   │
│    ┌─────────────────────────┼─────────────────────────┐        │
│    ▼                         ▼                         ▼        │
│ loadInstalledPlugins    CLI --plugin-dir        Session dirs    │
│    (OB7)                    (Qf0)                  (RB7)        │
│    │                         │                         │        │
│    └─────────────────────────┴─────────────────────────┘        │
│                              │                                   │
│                              ▼                                   │
│                    ┌───────────────────┐                        │
│                    │ Filter: enabled   │                        │
│                    └─────────┬─────────┘                        │
│                              │                                   │
│    ┌─────────────────────────┼─────────────────────────┐        │
│    ▼                         ▼                         ▼        │
│ getPluginSkills        getPluginAgents       loadPluginHooks   │
│    (tw0)                   (O4A)                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────────┐
        ▼                     ▼                         ▼
Local Settings         Project Settings          Policy Settings
(~/.claude/)           (.claude/)               (managed)
        │                     │                         │
        └─────────────────────┴─────────────────────────┘
                              │
                              ▼
                    ┌───────────────────┐
                    │  Merge by type:   │
                    │  - Hooks: concat  │
                    │  - Agents: map    │
                    │  - Skills: arrays │
                    └───────────────────┘
```

---

## Plugin Scope System

### Installation Scopes

| Scope | Path | Use Case |
|-------|------|----------|
| `managed` | Policy-managed | Organization-wide plugins |
| `user` | `~/.claude/plugins/` | User-installed plugins |
| `project` | `.claude/plugins/` | Project-specific plugins |
| `local` | CLI `--plugin-dir` | Session-specific plugins |

### Enabled State Tracking

```javascript
// Plugin enabled state stored in:
// ~/.claude/installed_plugins_v2.json

{
  "plugin-name@marketplace": {
    enabled: true,
    version: "1.0.0",
    installedAt: "2024-01-01T00:00:00Z",
    path: "/path/to/plugin"
  }
}
```

---

## Output Styles Loading

### Output Style Discovery

Plugins can provide custom output styles through the `outputStyles` manifest key:

```javascript
// ============================================
// getPluginOutputStyles - Load output styles from enabled plugins
// Location: chunks.130.mjs:2043-2084
// ============================================

// ORIGINAL (for source lookup):
ew0 = W0(async () => {
  let { enabled: A } = await DG(), B = [];
  for (let G of A) {
    if (G.outputStylesPath) {
      let Z = await yo2(G.outputStylesPath, G.name);
      B.push(...Z);
    }
    if (G.outputStylesPaths) {
      for (let Z of G.outputStylesPaths) {
        let Y = await yo2(Z, G.name);
        B.push(...Y);
      }
    }
  }
  return B;
});

// READABLE (for understanding):
const getPluginOutputStyles = memoize(async () => {
  const { enabled: enabledPlugins } = await discoverPluginsAndHooks();
  const allStyles = [];

  for (const plugin of enabledPlugins) {
    // Load from default outputStylesPath
    if (plugin.outputStylesPath) {
      const styles = await scanOutputStylesDirectory(plugin.outputStylesPath, plugin.name);
      allStyles.push(...styles);
    }

    // Load from additional outputStylesPaths
    if (plugin.outputStylesPaths) {
      for (const stylePath of plugin.outputStylesPaths) {
        const styles = await scanOutputStylesDirectory(stylePath, plugin.name);
        allStyles.push(...styles);
      }
    }
  }

  return allStyles;
});

// Mapping: ew0→getPluginOutputStyles, yo2→scanOutputStylesDirectory, DG→discoverPluginsAndHooks
```

### Output Style File Format

Output styles are markdown files with YAML frontmatter:

```markdown
---
name: concise
description: Brief, to-the-point responses
---

# Concise Output Style

Be brief and direct. Avoid unnecessary explanations.
Focus on actionable information only.
```

### Output Style Priority

| Source | Priority |
|--------|----------|
| Built-in styles | Lowest |
| Plugin styles | Medium |
| User styles (`~/.claude/output-styles/`) | Highest |

---

## LSP Server Loading

### LSP Server Discovery

Plugins can provide LSP server configurations through the `lspServers` manifest key:

```javascript
// ============================================
// loadLspServersFromPlugin - Load LSP configs from plugin
// Location: chunks.114.mjs:2016-2075
// ============================================

// ORIGINAL (for source lookup):
async function xg5(A, Q) {
  let B = A.manifest?.lspServers;
  if (!B) return {};

  let G = {};
  for (let [Z, Y] of Object.entries(B)) {
    // Validate path is within plugin root
    if (!Pg5(Y.command, A.path)) {
      log(`LSP server ${Z} command path not within plugin`);
      continue;
    }

    // Expand ${CLAUDE_PLUGIN_ROOT} in paths
    G[Z] = vg5(Y, A.path);
  }
  return G;
}

// READABLE (for understanding):
async function loadLspServersFromPlugin(plugin, context) {
  const lspConfig = plugin.manifest?.lspServers;
  if (!lspConfig) return {};

  const loadedServers = {};
  for (const [serverName, serverConfig] of Object.entries(lspConfig)) {
    // Security: Validate command path is within plugin directory
    if (!validatePluginPath(serverConfig.command, plugin.path)) {
      log(`LSP server ${serverName} command path not within plugin`);
      continue;
    }

    // Expand variables in config
    loadedServers[serverName] = expandLspServerConfig(serverConfig, plugin.path);
  }
  return loadedServers;
}

// Mapping: xg5→loadLspServersFromPlugin, Pg5→validatePluginPath, vg5→expandLspServerConfig
```

### LSP Server Configuration Schema

```json
{
  "lspServers": {
    "typescript": {
      "command": "${CLAUDE_PLUGIN_ROOT}/node_modules/.bin/typescript-language-server",
      "args": ["--stdio"],
      "env": {
        "NODE_PATH": "${CLAUDE_PLUGIN_ROOT}/node_modules"
      },
      "filePatterns": ["*.ts", "*.tsx"]
    }
  }
}
```

### Variable Expansion

| Variable | Expansion |
|----------|-----------|
| `${CLAUDE_PLUGIN_ROOT}` | Absolute path to plugin directory |
| `${HOME}` | User home directory |
| `${CWD}` | Current working directory |

### LSP Server Merging

LSP servers from multiple sources are merged with last-wins semantics:

```
┌──────────────────────────────────────────────────────┐
│                LSP SERVER MERGING                     │
├──────────────────────────────────────────────────────┤
│                                                       │
│  Built-in LSP configs                                 │
│        │                                              │
│        ▼                                              │
│  Plugin LSP configs (merged by server name)           │
│        │                                              │
│        ▼                                              │
│  User LSP configs (~/.claude/lsp-servers.json)        │
│        │                                              │
│        ▼                                              │
│  Final merged config (last definition wins)           │
│                                                       │
└──────────────────────────────────────────────────────┘
```

**Key insight:** Plugin LSP servers must have their command paths validated to ensure they're within the plugin directory. This prevents plugins from executing arbitrary binaries.

---

## Summary Table

| Aspect | Hooks | Agents | Skills | Commands | MCP | Output Styles | LSP |
|--------|-------|--------|--------|----------|-----|---------------|-----|
| **Manifest Key** | `hooks` | `agents` | `skills` | `commands` | `mcpServers` | `outputStyles` | `lspServers` |
| **Convention Dir** | `/hooks/` | `/agents/` | `/skills/` | `/commands/` | `/.mcp.json` | `/output-styles/` | manifest only |
| **Priority** | 0-999 | 1-6 | Ordered | N/A | Last wins | Last wins | Last wins |
| **Merging** | Concat | Map | Arrays | Arrays | Merge | Arrays | Merge |
| **Dedup** | No | By type | No | No | By name | No | By name |
| **Plugin Editable** | No | Yes | N/A | N/A | Yes | N/A | Yes |

---

## Related Modules

- [overview.md](./overview.md) - Plugin system overview
- [loading.md](./loading.md) - Plugin loading process
- [skill_integration.md](./skill_integration.md) - Plugin skills
- [schemas.md](./schemas.md) - Plugin manifest schemas
- [10_skill/architecture.md](../10_skill/architecture.md) - Skill system
- [11_hook/internals.md](../11_hook/internals.md) - Hook system
