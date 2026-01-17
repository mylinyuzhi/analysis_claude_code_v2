# Plugin System Overview

> Comprehensive plugin extensibility framework for Claude Code v2.1.7
>
> **Related Symbols:** See symbol index files:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

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
│  │  --plugin-dir <path>  (inline plugins)                          │   │
│  └────────────────────────────┬────────────────────────────────────┘   │
└───────────────────────────────┼─────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                       COMMAND LAYER                                     │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐      │
│  │  parsePluginCmd  │  │  cmdToViewState  │  │  PluginCmdComp   │      │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘      │
└─────────────────────────────────────────────────────────────────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        │                       │                       │
        ▼                       ▼                       ▼
┌───────────────┐      ┌───────────────┐      ┌───────────────┐
│  MARKETPLACE  │      │ INSTALLATION  │      │    STATE      │
│   MANAGER     │      │    ENGINE     │      │   MANAGER     │
│               │      │               │      │               │
│ addMarketplace│      │ installPlugin │      │ loadInstalled │
│ loadMarket    │      │ cachePlugin   │      │ saveInstalled │
│ findPlugin    │      │ gitClone      │      │ enable/disable│
│               │      │               │      │               │
│    (NS,VI0)   │      │ (ofA,G32)     │      │ (f_,UI0)      │
│ chunks.91.mjs │      │ chunks.130.mjs│      │ chunks.91.mjs │
└───────┬───────┘      └───────┬───────┘      └───────┬───────┘
        │                      │                      │
        ▼                      ▼                      ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         STORAGE LAYER                                   │
│                                                                         │
│  ~/.claude/                                                             │
│  ├── plugins/                                                          │
│  │   ├── known_marketplaces.json   ← Known marketplace sources         │
│  │   ├── marketplaces/             ← Cached marketplace manifests      │
│  │   │   └── <marketplace-name>/                                       │
│  │   │       └── marketplace.json                                      │
│  │   └── cache/                    ← Installed plugin files            │
│  │       └── <marketplace>/<plugin>/<version>/                         │
│  │           └── .claude-plugin/plugin.json                            │
│  ├── installed_plugins.json        ← V1 registry                       │
│  ├── installed_plugins_v2.json     ← V2 registry (with scopes)         │
│  └── settings.json                 ← enabledPlugins state              │
└─────────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                       LOADING LAYER                                     │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                  discoverPluginsAndHooks (DG)                    │  │
│  │                  chunks.130.mjs:3246-3263 (memoized)             │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│        │              │              │              │                   │
│        ▼              ▼              ▼              ▼                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐               │
│  │ Commands │  │  Skills  │  │  Agents  │  │  Hooks   │               │
│  │  paths   │  │  paths   │  │  paths   │  │ configs  │               │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘               │
│  From plugin definition during loading (ao2)                           │
└─────────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        RUNTIME LAYER                                    │
│                                                                         │
│  Plugin components are injected into Claude Code:                       │
│  • Commands → available as /plugin-name:command                         │
│  • Skills → available to LLM during conversations                       │
│  • Agents → available for Task tool                                     │
│  • Hooks → merged with user hooks                                       │
│  • Output Styles → custom output formatting                             │
│  • LSP Servers → language server configurations                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Key Concepts

### Plugin vs Marketplace

| Concept | Definition | Example |
|---------|------------|---------|
| **Plugin** | A package containing commands, skills, agents, hooks, etc. | `code-formatter` |
| **Marketplace** | A curated collection of plugins | `claude-plugins-official` |
| **Plugin ID** | Unique identifier: `plugin-name@marketplace-name` | `code-formatter@official` |
| **Inline Plugin** | Session-only plugin from `--plugin-dir` | `myplugin@inline` |

### Plugin Components

A plugin can provide one or more of these components:

| Component | Description | Directory/File |
|-----------|-------------|----------------|
| **Commands** | Slash commands (`/plugin:cmd`) | `commands/` |
| **Skills** | LLM-invokable operations | `skills/` |
| **Agents** | Custom agent definitions | `agents/` |
| **Hooks** | Event hooks (PreToolUse, etc.) | `hooks/hooks.json` |
| **Output Styles** | Custom output formatting | `output-styles/` |
| **LSP Servers** | Language server configurations | manifest `lspServers` |

### Installation Scopes (V2)

| Scope | Description | Path |
|-------|-------------|------|
| `managed` | Enterprise/policy installed | Policy directory |
| `user` | User-level installation | `~/.claude/plugins/cache/` |
| `project` | Project-specific | `.claude/plugins/` |
| `local` | Local development (in marketplace dir) | Marketplace directory |

### Plugin Sources

| Source Type | Description | Example |
|-------------|-------------|---------|
| `github-default-branch` | GitHub repo with auto branch detection | `owner/repo` |
| `git` | Any git URL with optional ref | `https://git.example.com/repo.git` |
| `npm` | NPM package (planned) | `@scope/package` |
| `file` | Direct path to marketplace.json | `/path/to/marketplace.json` |
| `directory` | Directory with `.claude-plugin/` | `/path/to/plugin/` |

---

## File System Layout

```
~/.claude/
├── plugins/
│   ├── known_marketplaces.json         # Known marketplace sources
│   │   {
│   │     "claude-plugins-official": {
│   │       "source": { "source": "github-default-branch", "repo": "anthropic/plugins" },
│   │       "installLocation": "~/.claude/plugins/marketplaces/claude-plugins-official",
│   │       "autoUpdate": true,
│   │       "lastUpdated": "2024-01-15T10:30:00Z"
│   │     }
│   │   }
│   │
│   ├── marketplaces/                    # Cached marketplace manifests
│   │   └── claude-plugins-official/
│   │       ├── .claude-plugin/
│   │       │   └── marketplace.json     # The marketplace manifest
│   │       └── plugins/                 # Local plugin directories (if relative sources)
│   │           ├── code-formatter/
│   │           └── github-integration/
│   │
│   └── cache/                           # Installed plugin files (versioned)
│       └── claude-plugins-official/
│           └── code-formatter/
│               └── 1.2.0/               # Version-specific directory
│                   ├── .claude-plugin/
│                   │   └── plugin.json
│                   ├── commands/
│                   │   └── format.md
│                   ├── skills/
│                   │   └── auto-format/
│                   │       └── SKILL.md
│                   └── hooks/
│                       └── hooks.json
│
├── installed_plugins.json               # V1 registry
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
├── installed_plugins_v2.json            # V2 registry (with scopes)
│   {
│     "version": 2,
│     "plugins": {
│       "code-formatter@claude-plugins-official": [
│         {
│           "scope": "user",
│           "installPath": "~/.claude/plugins/cache/...",
│           "version": "1.2.0",
│           "installedAt": "2024-01-15T10:30:00Z",
│           "lastUpdated": "2024-01-15T10:30:00Z",
│           "gitCommitSha": "abc123..."
│         }
│       ]
│     }
│   }
│
└── settings.json                        # Enable/disable state
    {
      "enabledPlugins": {
        "code-formatter@claude-plugins-official": true
      }
    }
```

---

## Data Flow

### 1. Plugin Discovery Flow (at Startup)

```
Claude Code Startup
        │
        ▼
┌───────────────────────────────────────┐
│ discoverPluginsAndHooks (DG)          │
│ chunks.130.mjs:3246-3263              │
│ (memoized via W0)                     │
│                                       │
│ 1. Load marketplace plugins (OB7)     │
│ 2. Load inline plugins (RB7)          │
│ 3. Filter enabled/disabled            │
│ 4. Return { enabled, disabled, errors}│
└───────────────────────────────────────┘
        │
        ├───────────────────────────────────┐
        ▼                                   ▼
┌─────────────────────────┐      ┌─────────────────────────┐
│ loadMarketplacePlugins  │      │ loadInlinePlugins       │
│ (OB7)                   │      │ (RB7)                   │
│ chunks.130.mjs:2841-2888│      │ chunks.130.mjs:3180-3221│
│                         │      │                         │
│ For each enabled plugin │      │ For each --plugin-dir   │
│ in settings.json:       │      │ path:                   │
│ 1. Check policy (H4A)   │      │ 1. Validate path exists │
│ 2. Find in marketplace  │      │ 2. Load plugin def      │
│ 3. Initialize plugin    │      │ 3. Mark as @inline      │
└─────────────────────────┘      └─────────────────────────┘
```

### 2. Marketplace Plugin Loading Flow

```
loadMarketplacePlugins (OB7)
        │
        ▼
┌───────────────────────────────────┐
│ Get enabledPlugins from settings  │
│ jQ().enabledPlugins || {}         │
└───────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────┐
│ For each plugin@marketplace:      │
│                                   │
│ 1. Split ID into plugin + market  │
│ 2. Check marketplace policy (H4A) │
│    - Is source allowed?           │
│    - Is source blocklisted?       │
│ 3. Find plugin in marketplace     │
│    HI0() - cached lookup          │
│    NF()  - async with fetch       │
└───────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────┐
│ initializePluginFromMarketplace   │
│ (MB7) chunks.130.mjs:2890-3177    │
│                                   │
│ 1. Resolve source (local/remote)  │
│ 2. Copy to versioned cache        │
│ 3. Load plugin.json manifest      │
│ 4. Load components:               │
│    - commands                     │
│    - agents                       │
│    - skills                       │
│    - hooks                        │
│    - output-styles                │
└───────────────────────────────────┘
```

### 3. Plugin Installation Flow

```
User: /plugin install code-formatter@official
        │
        ▼
┌───────────────────────────────────┐
│ Parse plugin command              │
│ Returns: { plugin, marketplace }  │
└───────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────┐
│ findPluginInMarketplaces (NF)     │
│ chunks.91.mjs:264-288             │
│                                   │
│ 1. Try cache: HI0()               │
│ 2. Fallback: fetch marketplace    │
│ 3. Return plugin entry            │
└───────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────┐
│ installPlugin (ofA)               │
│ chunks.130.mjs:2267-2303          │
│                                   │
│ 1. Determine install scope        │
│ 2. Cache plugin from source       │
│ 3. Update settings.enabledPlugins │
│ 4. Clear cache and reload         │
└───────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────┐
│ Git Clone (for remote sources)    │
│ gitCloneWithSubmodules (G32)      │
│ chunks.90.mjs:2382-2389           │
│                                   │
│ Features (v2.1.7):                │
│ • --recurse-submodules            │
│ • --shallow-submodules            │
│ • SSH batch mode                  │
└───────────────────────────────────┘
```

---

## Plugin Components

### Plugin Definition Structure

```javascript
// ============================================
// loadPluginDefinitionFromPath - Load and parse plugin from filesystem
// Location: chunks.130.mjs:2612-2820
// ============================================

// Plugin definition object returned:
{
  name: "my-plugin",              // Plugin name
  manifest: { ... },               // Parsed plugin.json
  path: "/path/to/plugin",         // Installation path
  source: "my-plugin@marketplace", // Plugin ID
  repository: "...",               // Source repository
  enabled: true,                   // Enable state

  // Component paths (detected from manifest or default directories)
  commandsPath: "/path/commands",      // Default commands/
  commandsPaths: ["/custom/path"],     // Custom command paths
  commandsMetadata: { ... },           // Inline command definitions

  agentsPath: "/path/agents",          // Default agents/
  agentsPaths: ["/custom/path"],       // Custom agent paths

  skillsPath: "/path/skills",          // Default skills/
  skillsPaths: ["/custom/path"],       // Custom skill paths

  outputStylesPath: "/path/output-styles",
  outputStylesPaths: ["/custom/path"],

  hooksConfig: { PreToolUse: [...] }   // Merged hook configurations
}
```

### Command Loading Logic

Commands are discovered from multiple sources:

1. **Default Directory**: `commands/` (if no manifest declaration)
2. **Manifest Array**: `commands: ["./commands", "./extra-commands"]`
3. **Manifest Object with Metadata**:
   ```json
   {
     "commands": {
       "my-cmd": {
         "source": "./commands/my-cmd.md",
         "description": "Custom description"
       },
       "inline-cmd": {
         "content": "# Inline command content..."
       }
     }
   }
   ```

### Hook Loading Logic

Hooks are loaded from two locations:

1. **Standard location**: `hooks/hooks.json`
2. **Manifest-declared**: `hooks: ["./custom-hooks.json"]`

```javascript
// ============================================
// Hook loading from plugin (chunks.130.mjs:2735-2820)
// ============================================

// 1. Check standard location first
let standardPath = join(pluginPath, "hooks", "hooks.json");
if (exists(standardPath)) {
  hooks = loadHooksFile(standardPath, pluginName);
}

// 2. Then check manifest-declared hooks
if (manifest.hooks) {
  for (let hookPath of manifest.hooks) {
    let additionalHooks = loadHooksFile(join(pluginPath, hookPath));
    hooks = mergeHookConfigs(hooks, additionalHooks);  // lo2
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
│     └── Use --plugin-dir for inline plugins                            │
│                                                                         │
│  2. INSTALLATION                                                        │
│     ├── Fetch plugin from source (github/git/file)                     │
│     ├── Clone with submodules (v2.1.7: --recurse-submodules)           │
│     ├── Validate plugin.json manifest                                   │
│     ├── Cache to versioned directory                                   │
│     └── Update settings.json enabledPlugins                            │
│                                                                         │
│  3. LOADING (at startup)                                                │
│     ├── discoverPluginsAndHooks (DG) - memoized                        │
│     ├── loadMarketplacePlugins (OB7)                                   │
│     ├── loadInlinePlugins (RB7) for --plugin-dir                       │
│     └── Load components (commands, agents, skills, hooks)              │
│                                                                         │
│  4. RUNTIME                                                             │
│     ├── Plugin commands available as /plugin-name:command              │
│     ├── Plugin skills available to LLM                                 │
│     ├── Plugin hooks executed on events                                │
│     └── Plugin agents available in Task tool                           │
│                                                                         │
│  5. MANAGEMENT                                                          │
│     ├── Enable/Disable via settings.json                               │
│     ├── Uninstall (/plugin uninstall)                                  │
│     ├── Update marketplace (/plugin marketplace update)                │
│     └── Auto-update toggle per marketplace (v2.1.2+)                   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Key Functions Summary

| Function | Obfuscated | Location | Purpose |
|----------|------------|----------|---------|
| `discoverPluginsAndHooks` | `DG` | chunks.130.mjs:3246 | Main discovery entry (memoized) |
| `loadMarketplacePlugins` | `OB7` | chunks.130.mjs:2841 | Load from marketplaces |
| `loadInlinePlugins` | `RB7` | chunks.130.mjs:3180 | Load from --plugin-dir |
| `initializePluginFromMarketplace` | `MB7` | chunks.130.mjs:2890 | Initialize single plugin |
| `loadPluginDefinitionFromPath` | `ao2` | chunks.130.mjs:2612 | Parse plugin from path |
| `loadHooksFile` | `po2` | chunks.130.mjs:2602 | Load hooks.json |
| `mergeHookConfigs` | `lo2` | chunks.130.mjs:2830 | Merge hook configurations |
| `findPluginInMarketplaces` | `NF` | chunks.91.mjs:264 | Async find with fetch |
| `findPluginInCachedMarketplace` | `HI0` | chunks.91.mjs:237 | Sync cache lookup |
| `installPlugin` | `ofA` | chunks.130.mjs:2267 | Installation entry point |
| `addMarketplaceSource` | `NS` | chunks.91.mjs:136 | Add marketplace |
| `loadMarketplaceSource` | `VI0` | chunks.91.mjs:50 | Fetch marketplace |
| `loadMarketplaceConfigs` | `D5` | chunks.90.mjs:2232 | Read known_marketplaces |
| `saveMarketplaceConfig` | `FVA` | chunks.90.mjs:2258 | Write known_marketplaces |
| `gitCloneWithSubmodules` | `G32` | chunks.90.mjs:2382 | Git clone with submodules |
| `loadInstalledPluginsRegistry` | `f_` | chunks.91.mjs:551 | Load registry |
| `saveInstalledPluginsRegistry` | `UI0` | chunks.91.mjs:580 | Save registry |
| `clearPluginCache` | `Bt` | chunks.130.mjs:3224 | Clear memoized cache |
| `getInlinePlugins` | `Qf0` | chunks.1.mjs:2678 | Get --plugin-dir paths |

---

## Related Files

- [unified_loading.md](./unified_loading.md) - **Unified component loading & merging** (NEW)
- [skill_integration.md](./skill_integration.md) - **Plugin-skill integration** (NEW)
- [plugin_updates.md](./plugin_updates.md) - v2.1.7 specific changes
- [installation.md](./installation.md) - Plugin installation details
- [loading.md](./loading.md) - Component loading
- [marketplace.md](./marketplace.md) - Marketplace management
- [schemas.md](./schemas.md) - All schemas
- [slash_command.md](./slash_command.md) - `/plugin` command
- [state_management.md](./state_management.md) - Enable/disable state
