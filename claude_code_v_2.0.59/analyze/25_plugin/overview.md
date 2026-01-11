# Plugin System Overview

> Comprehensive plugin extensibility framework for Claude Code v2.0.59
>
> **Related Symbols:** See [symbol_index_infra.md](../00_overview/symbol_index_infra.md) - Plugin System section

---

## Quick Navigation

- [Architecture Diagram](#architecture-diagram)
- [Key Concepts](#key-concepts)
- [File System Layout](#file-system-layout)
- [Data Flow](#data-flow)
- [Plugin Components](#plugin-components)
- [Lifecycle Overview](#lifecycle-overview)

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           USER INTERFACE                                │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  /plugin install <name>@<marketplace>                           │   │
│  │  /plugin marketplace add <url>                                  │   │
│  │  /plugin manage | enable | disable | uninstall                  │   │
│  └────────────────────────────┬────────────────────────────────────┘   │
└───────────────────────────────┼─────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                       COMMAND LAYER                                     │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐      │
│  │  parsePluginCmd  │  │  cmdToViewState  │  │  PluginCmdComp   │      │
│  │     (DC9)        │→ │     (lx3)        │→ │     (HC9)        │      │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘      │
│         chunks.152.mjs:76-164                                           │
└─────────────────────────────────────────────────────────────────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        │                       │                       │
        ▼                       ▼                       ▼
┌───────────────┐      ┌───────────────┐      ┌───────────────┐
│  MARKETPLACE  │      │ INSTALLATION  │      │    STATE      │
│   MANAGER     │      │    ENGINE     │      │   MANAGER     │
│               │      │               │      │               │
│ addMarketplace│      │ cachePlugin   │      │ getInstalled  │
│ removeMarket  │      │ copyToCache   │      │ saveInstalled │
│ updateMarket  │      │ installPlugin │      │ enable/disable│
│ findPlugin    │      │               │      │               │
│    (rAA,ZB1)  │      │  (SIA,s22,Bj) │      │  (QVA,cI1)    │
│ chunks.95.mjs │      │ chunks.95.mjs │      │chunks.143.mjs │
└───────┬───────┘      └───────┬───────┘      └───────┬───────┘
        │                      │                      │
        ▼                      ▼                      ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         STORAGE LAYER                                   │
│                                                                         │
│  ~/.claude/                                                             │
│  ├── plugins/                                                          │
│  │   ├── .marketplaces.json       ← Known marketplace sources          │
│  │   ├── marketplaces/            ← Cached marketplace manifests       │
│  │   │   └── <marketplace-name>/                                       │
│  │   │       └── marketplace.json                                      │
│  │   └── cache/                   ← Installed plugin files             │
│  │       └── <marketplace>/<plugin>/<version>/                         │
│  │           └── .claude-plugin/plugin.json                            │
│  ├── installed_plugins.json       ← V1 registry                        │
│  └── installed_plugins_v2.json    ← V2 registry (with scopes)          │
└─────────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                       LOADING LAYER                                     │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    getPluginsWithState (l7)                       │  │
│  │                    chunks.95.mjs:1751-1765                        │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│        │              │              │              │                   │
│        ▼              ▼              ▼              ▼                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐               │
│  │ Commands │  │  Skills  │  │  Agents  │  │  Hooks   │               │
│  │  (PQA)   │  │  (iW0)   │  │  (_0A)   │  │  (_1A)   │               │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘               │
│  chunks.142.mjs:3474   3586        3642        3652                    │
└─────────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        RUNTIME LAYER                                    │
│                                                                         │
│  Plugin components are injected into Claude Code:                       │
│  • Commands → getAllEnabledCommands() (sE)                             │
│  • Skills → getSkillsFromAllSources() (Sv3)                            │
│  • Agents → available for Task tool                                    │
│  • Hooks → merged with user hooks                                      │
│  • Output Styles → loadPluginOutputStyles()                            │
│  • MCP Servers → merged with user MCP config                           │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Key Concepts

### Plugin vs Marketplace

| Concept | Definition | Example |
|---------|------------|---------|
| **Plugin** | A package containing commands, skills, agents, hooks, etc. | `code-formatter` |
| **Marketplace** | A curated collection of plugins | `claude-plugins-official` |
| **Plugin ID** | Unique identifier: `plugin-name@marketplace-name` | `code-formatter@claude-plugins-official` |

### Plugin Components

A plugin can provide one or more of these components:

| Component | Description | Directory |
|-----------|-------------|-----------|
| **Commands** | Slash commands (`/plugin:cmd`) | `commands/` |
| **Skills** | LLM-invokable operations | `skills/` |
| **Agents** | Custom agent definitions | `agents/` |
| **Hooks** | Event hooks (PreToolUse, etc.) | `hooks/hooks.json` |
| **Output Styles** | Custom output formatting | `output-styles/` |
| **MCP Servers** | MCP server configurations | `.mcp.json` |
| **LSP Servers** | Language server configurations | `.lsp.json` |

### Installation Scopes (V2)

| Scope | Description | Path |
|-------|-------------|------|
| `managed` | Enterprise/policy installed | Policy directory |
| `user` | User-level installation | `~/.claude/plugins/cache/` |
| `project` | Project-specific | `.claude/plugins/` |
| `local` | Local development (in marketplace dir) | Marketplace directory |

---

## File System Layout

```
~/.claude/
├── plugins/
│   ├── .marketplaces.json              # Known marketplace sources
│   │   {
│   │     "claude-plugins-official": {
│   │       "source": { "source": "github", "repo": "anthropic/plugins" },
│   │       "installLocation": "~/.claude/plugins/marketplaces/claude-plugins-official",
│   │       "lastUpdated": "2024-01-15T10:30:00Z"
│   │     }
│   │   }
│   │
│   ├── marketplaces/                   # Cached marketplace manifests
│   │   └── claude-plugins-official/
│   │       ├── .claude-plugin/
│   │       │   └── marketplace.json    # The marketplace manifest
│   │       └── plugins/                # Local plugin directories (if relative sources)
│   │           ├── code-formatter/
│   │           └── github-integration/
│   │
│   ├── cache/                          # Installed plugin files (versioned)
│   │   └── claude-plugins-official/
│   │       └── code-formatter/
│   │           └── 1.2.0/              # Version-specific directory
│   │               ├── .claude-plugin/
│   │               │   └── plugin.json
│   │               ├── commands/
│   │               │   └── format.md
│   │               └── skills/
│   │                   └── auto-format/
│   │                       └── SKILL.md
│   │
│   └── npm-cache/                      # NPM package cache
│       └── node_modules/
│
├── installed_plugins.json              # V1 registry
│   {
│     "version": 1,
│     "plugins": {
│       "code-formatter@claude-plugins-official": {
│         "version": "1.2.0",
│         "installedAt": "2024-01-15T10:30:00Z",
│         "installPath": "~/.claude/plugins/cache/..."
│       }
│     }
│   }
│
└── installed_plugins_v2.json           # V2 registry (with scopes)
    {
      "version": 2,
      "plugins": {
        "code-formatter@claude-plugins-official": [
          {
            "scope": "user",
            "installPath": "~/.claude/plugins/cache/...",
            "version": "1.2.0",
            "installedAt": "2024-01-15T10:30:00Z"
          }
        ]
      }
    }
```

---

## Data Flow

### 1. Marketplace Discovery Flow

```
User: /plugin marketplace add https://example.com/marketplace
                │
                ▼
┌───────────────────────────────────┐
│ addMarketplaceSource (rAA)        │
│ chunks.95.mjs:572-589             │
│                                   │
│ 1. Check policy (GB1, LLA)        │
│ 2. Fetch & cache marketplace      │
│ 3. Validate with TIA schema       │
│ 4. Save to .marketplaces.json     │
└───────────────────────────────────┘
                │
                ▼
┌───────────────────────────────────┐
│ fetchAndCacheMarketplace (ve1)    │
│ chunks.95.mjs:463-570             │
│                                   │
│ Based on source type:             │
│ • github → git clone              │
│ • git → git clone                 │
│ • url → download JSON             │
│ • file → read local file          │
│ • directory → read local dir      │
└───────────────────────────────────┘
```

### 2. Plugin Installation Flow

```
User: /plugin install code-formatter@claude-plugins-official
                │
                ▼
┌───────────────────────────────────┐
│ parsePluginCommand (DC9)          │
│ Returns: { type: "install",       │
│            plugin: "code-formatter",
│            marketplace: "claude-plugins-official" }
└───────────────────────────────────┘
                │
                ▼
┌───────────────────────────────────┐
│ findPluginInMarketplaces (nl)     │
│ chunks.95.mjs:654-673             │
│                                   │
│ 1. Split ID into plugin@market    │
│ 2. Load marketplace config (pZ)   │
│ 3. Load marketplace data (_D)     │
│ 4. Find plugin entry              │
└───────────────────────────────────┘
                │
                ▼
┌───────────────────────────────────┐
│ cachePluginFromSource (SIA)       │
│ chunks.95.mjs:959-1054            │
│                                   │
│ 1. Create temp directory          │
│ 2. Fetch from source:             │
│    • npm → npm install            │
│    • github → git clone           │
│    • url → git clone              │
│    • local → copy directory       │
│ 3. Validate plugin.json           │
│ 4. Rename to final cache path     │
└───────────────────────────────────┘
                │
                ▼
┌───────────────────────────────────┐
│ copyToVersionedCache (s22)        │
│ chunks.95.mjs:819-873             │
│                                   │
│ 1. Calculate version path         │
│ 2. Copy plugin files              │
│ 3. Remove .git directory          │
└───────────────────────────────────┘
                │
                ▼
┌───────────────────────────────────┐
│ addInstalledPlugin (M39)          │
│ chunks.143.mjs:3685-3689          │
│                                   │
│ 1. Update in-memory registry      │
│ 2. Save to installed_plugins.json │
└───────────────────────────────────┘
```

### 3. Plugin Loading Flow (at Startup)

```
Claude Code Startup
        │
        ▼
┌───────────────────────────────────┐
│ initializePlugins (L39)           │
│ chunks.143.mjs:3665-3675          │
│                                   │
│ 1. Sync installed plugins (qX0)   │
│ 2. Initialize versioned system    │
└───────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────┐
│ getPluginsWithState (l7)          │
│ chunks.95.mjs:1751-1765           │
│ (memoized)                        │
│                                   │
│ 1. Load from settings (f85)       │
│ 2. Load session plugins (--plugin-dir)
│ 3. Filter enabled/disabled        │
│ 4. Return { enabled, disabled, errors }
└───────────────────────────────────┘
        │
        ├──────────────────────────────────────────────────┐
        │                                                  │
        ▼                                                  ▼
┌───────────────────────────┐                    ┌───────────────────────────┐
│ getPluginCommands (PQA)   │                    │ getPluginSkills (iW0)     │
│ chunks.142.mjs:3474-3585  │                    │ chunks.142.mjs:3586-3620  │
│ (memoized)                │                    │ (memoized)                │
│                           │                    │                           │
│ For each enabled plugin:  │                    │ For each enabled plugin:  │
│ • Load from commandsPath  │                    │ • Load from skillsPath    │
│ • Load from commandsPaths │                    │ • Load from skillsPaths   │
│ • Parse commandsMetadata  │                    │ • Parse SKILL.md files    │
└───────────────────────────┘                    └───────────────────────────┘
        │                                                  │
        └──────────────────────┬───────────────────────────┘
                               │
                               ▼
┌───────────────────────────────────────────────────────────────────────┐
│                     usePluginLoader ($I1)                             │
│                     chunks.142.mjs:3623-3696                          │
│                                                                       │
│ React hook that:                                                      │
│ 1. Calls l7() to get enabled/disabled plugins                        │
│ 2. Calls PQA() to load commands                                      │
│ 3. Calls _0A() to load agents                                        │
│ 4. Calls _1A() to load hooks                                         │
│ 5. Updates app state with loaded components                          │
└───────────────────────────────────────────────────────────────────────┘
```

---

## Plugin Components

### Command Loading

Commands are loaded from:
1. `commands/` directory (default)
2. `commandsPaths` array (custom paths)
3. `commandsMetadata` object (inline definitions)

```
Plugin Directory
├── .claude-plugin/
│   └── plugin.json
│       {
│         "name": "my-plugin",
│         "commands": ["./commands"],   // or custom paths
│         "commandsMetadata": {
│           "my-cmd": {
│             "source": "./commands/my-cmd.md",
│             "description": "Custom description"
│           }
│         }
│       }
└── commands/
    ├── format.md        → /my-plugin:format
    └── lint.md          → /my-plugin:lint
```

### Skill Loading

Skills are loaded from `skills/` directories with `SKILL.md` files:

```
Plugin Directory
└── skills/
    └── auto-format/
        └── SKILL.md
            ---
            name: auto-format
            description: Automatically format code
            when_to_use: When user asks for code formatting
            allowed-tools: Read, Write, Edit
            ---

            # Auto Format Skill

            Instructions for the LLM...
```

### Hook Integration

Hooks from plugins are merged with user hooks:

```javascript
// Plugin hooks file: .claude-plugin/hooks.json
{
  "hooks": {
    "PreToolUse": [
      { "type": "command", "command": "./validate.sh" }
    ]
  }
}
```

---

## Lifecycle Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         PLUGIN LIFECYCLE                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  1. DISCOVERY                                                           │
│     ├── Add marketplace source (/plugin marketplace add)               │
│     ├── Browse marketplace (/plugin install)                           │
│     └── Search for plugins                                              │
│                                                                         │
│  2. INSTALLATION                                                        │
│     ├── Fetch plugin from source (npm/github/git/url)                  │
│     ├── Validate plugin.json manifest                                   │
│     ├── Cache to versioned directory                                   │
│     └── Register in installed_plugins.json                             │
│                                                                         │
│  3. LOADING (at startup)                                                │
│     ├── Initialize plugins (L39)                                        │
│     ├── Get enabled/disabled state (l7)                                │
│     ├── Load components:                                                │
│     │   ├── Commands (PQA)                                             │
│     │   ├── Skills (iW0)                                               │
│     │   ├── Agents (_0A)                                               │
│     │   └── Hooks (_1A)                                                │
│     └── Inject into runtime                                            │
│                                                                         │
│  4. RUNTIME                                                             │
│     ├── Plugin commands available as /plugin-name:command              │
│     ├── Plugin skills available to LLM                                 │
│     ├── Plugin hooks executed on events                                │
│     └── Plugin agents available in Task tool                           │
│                                                                         │
│  5. MANAGEMENT                                                          │
│     ├── Enable/Disable (/plugin enable/disable)                        │
│     ├── Uninstall (/plugin uninstall)                                  │
│     └── Update marketplace (/plugin marketplace update)                │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Key Functions Summary

| Function | Obfuscated | Location | Purpose |
|----------|------------|----------|---------|
| `parsePluginCommand` | `DC9` | chunks.152.mjs:76 | Parse /plugin command args |
| `commandToViewState` | `lx3` | chunks.152.mjs:186 | Map command to UI state |
| `PluginCommandComponent` | `HC9` | chunks.152.mjs:250 | Main UI component |
| `addMarketplaceSource` | `rAA` | chunks.95.mjs:572 | Add marketplace |
| `removeMarketplace` | `ZB1` | chunks.95.mjs:591 | Remove marketplace |
| `updateMarketplace` | `IB1` | chunks.95.mjs:687 | Refresh marketplace |
| `findPluginInMarketplaces` | `nl` | chunks.95.mjs:654 | Find plugin by ID |
| `loadMarketplaceData` | `_D` | chunks.95.mjs:724 | Load marketplace (memoized) |
| `cachePluginFromSource` | `SIA` | chunks.95.mjs:959 | Download & cache plugin |
| `copyToVersionedCache` | `s22` | chunks.95.mjs:819 | Copy to versioned path |
| `getInstalledPlugins` | `QVA` | chunks.143.mjs:3462 | Get installed registry |
| `saveInstalledPlugins` | `cI1` | chunks.143.mjs:3492 | Save registry |
| `initializePlugins` | `L39` | chunks.143.mjs:3665 | Startup initialization |
| `getPluginsWithState` | `l7` | chunks.95.mjs:1751 | Get enabled/disabled |
| `getPluginCommands` | `PQA` | chunks.142.mjs:3474 | Load commands (memoized) |
| `getPluginSkills` | `iW0` | chunks.142.mjs:3586 | Load skills (memoized) |
| `usePluginLoader` | `$I1` | chunks.142.mjs:3623 | React hook for loading |

---

## Related Files

- [schemas.md](./schemas.md) - All Zod schemas
- [marketplace.md](./marketplace.md) - Marketplace management
- [installation.md](./installation.md) - Plugin installation
- [loading.md](./loading.md) - Component loading
- [state_management.md](./state_management.md) - Enable/disable state
- [slash_command.md](./slash_command.md) - `/plugin` command
