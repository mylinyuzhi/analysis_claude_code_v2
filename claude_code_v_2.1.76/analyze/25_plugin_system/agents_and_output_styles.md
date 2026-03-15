# Plugin Agents and Output Styles (Claude Code 2.1.38)

> Deep analysis of how plugins contribute custom agents and output styles,
> including discovery patterns and integration with the agent tool system.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution

Key functions in this document:
- `getPluginAgents` (wK1) - Load all custom agents from enabled plugins
- `loadAgentsFromDir` (CU7) - Load agents from a plugin directory
- `getPluginOutputStyles` - Load output styles from plugins (if exists)
- `loadPluginManifest` (Pn4) - Discover agents and outputStyles components

---

## Overview

Plugins can extend Claude Code in two additional ways:
1. **Custom Agents** - Define specialized agent personas that appear in the Agent tool
2. **Output Styles** - Customize how tool output is rendered

Both follow the directory-based discovery pattern established by commands and skills.

---

## Custom Agents

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    PLUGIN AGENTS LOADING FLOW                               │
└─────────────────────────────────────────────────────────────────────────────┘

                    ┌──────────────────────────────────┐
                    │    Plugin Manager Initialization  │
                    │    iY() - getLoadedPlugins()      │
                    └──────────────────────────────────┘
                                    │
                                    ▼
                    ┌──────────────────────────────────┐
                    │    getPluginAgents (wK1)          │
                    │    Memoized loader               │
                    └──────────────────────────────────┘
                                    │
                                    ▼
                    ┌──────────────────────────────────┐
                    │  For each enabled plugin:         │
                    │  - agentsPath (default)           │
                    │  - agentsPaths (custom)           │
                    └──────────────────────────────────┘
                                    │
                                    ▼
                    ┌──────────────────────────────────┐
                    │  loadAgentsFromDir (CU7)          │
                    │  - Scan for AGENT.md files        │
                    │  - Parse frontmatter              │
                    │  - Create agent definitions       │
                    └──────────────────────────────────┘
                                    │
                                    ▼
                    ┌──────────────────────────────────┐
                    │  Agent Definition Object          │
                    │  {                                │
                    │    type: "agent",                 │
                    │    name: "plugin-name:agent",     │
                    │    source: "plugin",              │
                    │    ...                            │
                    │  }                                │
                    └──────────────────────────────────┘
```

### getPluginAgents (wK1)

**What it does:** Loads all custom agent definitions from enabled plugins.

```javascript
// ============================================
// getPluginAgents - Load all plugin agents
// Location: chunks.87.mjs:2509-2557
// ============================================

// ORIGINAL (for source lookup):
wK1 = KA(async () => {
    let { enabled: A, errors: q } = await iY(), K = [];
    if (q.length > 0) h(`Plugin loading errors: ${q.map((Y)=>TZ(Y)).join(", ")}`);
    for (let Y of A) {
        let z = new Set;
        if (Y.agentsPath) try {
            let w = CU7(Y.agentsPath, Y.name, Y.source, z);
            if (K.push(...w), w.length > 0) h(`Loaded ${w.length} agents from plugin ${Y.name} default directory`)
        } catch (w) {
            h(`Failed to load agents from plugin ${Y.name} default directory: ${w}`, { level: "error" })
        }
        if (Y.agentsPaths) {
            for (let w of Y.agentsPaths) try {
                let H = CU7(w, Y.name, Y.source, z);
                K.push(...H), h(`Loaded ${H.length} agents from plugin ${Y.name} custom path: ${w}`)
            } catch (H) {
                h(`Failed to load agents from plugin ${Y.name} custom path ${w}: ${H}`, { level: "error" })
            }
        }
    }
    return h(`Total plugin agents loaded: ${K.length}`), K
});

// READABLE (for understanding):
getPluginAgents = memoize(async () => {
    let { enabled: plugins, errors } = await getLoadedPlugins();
    let agents = [];

    if (errors.length > 0) {
        debug(`Plugin loading errors: ${errors.map(e => serializeError(e)).join(", ")}`);
    }

    for (let plugin of plugins) {
        let seenFiles = new Set();

        // Load from default agents directory
        if (plugin.agentsPath) {
            try {
                let pluginAgents = loadAgentsFromDir(
                    plugin.agentsPath, plugin.name, plugin.source, seenFiles
                );
                agents.push(...pluginAgents);
                if (pluginAgents.length > 0) {
                    debug(`Loaded ${pluginAgents.length} agents from ${plugin.name}`);
                }
            } catch (err) {
                debug(`Failed to load agents from ${plugin.name}: ${err}`, { level: "error" });
            }
        }

        // Load from custom agent paths
        if (plugin.agentsPaths) {
            for (let agentPath of plugin.agentsPaths) {
                try {
                    let pluginAgents = loadAgentsFromDir(agentPath, plugin.name, plugin.source, seenFiles);
                    agents.push(...pluginAgents);
                } catch (err) {
                    debug(`Failed: ${err}`, { level: "error" });
                }
            }
        }
    }

    debug(`Total plugin agents loaded: ${agents.length}`);
    return agents;
});

// Mapping: wK1→getPluginAgents, KA→memoize, iY→getLoadedPlugins, CU7→loadAgentsFromDir,
//   h→debug, TZ→serializeError
```

### loadAgentsFromDir (CU7)

**What it does:** Scans a directory for agent definition files.

```javascript
// ============================================
// loadAgentsFromDir - Load agents from directory
// Location: chunks.87.mjs:2470-2505
// ============================================

// Agent discovery pattern:
// agents/
// ├── AGENT.md           → plugin-name:agents (single agent)
// └── code-review/
//     └── AGENT.md       → plugin-name:code-review
// └── testing/
//     └── AGENT.md       → plugin-name:testing

// READABLE (for understanding):
function loadAgentsFromDir(dirPath, pluginName, pluginSource, seenFiles) {
    let fs = getFs();
    let agents = [];

    if (!fs.existsSync(dirPath)) return [];

    // Pattern 1: AGENT.md directly in directory
    let directAgentFile = path.join(dirPath, "AGENT.md");
    if (fs.existsSync(directAgentFile)) {
        if (isAlreadySeen(fs, directAgentFile, seenFiles)) return agents;

        let content = fs.readFileSync(directAgentFile, { encoding: "utf-8" });
        let { frontmatter, content: body } = parseMarkdownWithFrontmatter(content, directAgentFile);

        let agentName = `${pluginName}:${path.basename(dirPath)}`;
        let agent = createAgentObject(agentName, directAgentFile, frontmatter, body, pluginSource);
        if (agent) agents.push(agent);
        return agents;
    }

    // Pattern 2: AGENT.md in subdirectories
    let entries = fs.readdirSync(dirPath, { withFileTypes: true });
    for (let entry of entries) {
        if (!entry.isDirectory() && !entry.isSymbolicLink()) continue;

        let subdirPath = path.join(dirPath, entry.name);
        let agentFile = path.join(subdirPath, "AGENT.md");

        if (fs.existsSync(agentFile)) {
            if (isAlreadySeen(fs, agentFile, seenFiles)) continue;

            let content = fs.readFileSync(agentFile, { encoding: "utf-8" });
            let { frontmatter, content: body } = parseMarkdownWithFrontmatter(content, agentFile);

            let agentName = `${pluginName}:${entry.name}`;
            let agent = createAgentObject(agentName, agentFile, frontmatter, body, pluginSource);
            if (agent) agents.push(agent);
        }
    }

    return agents;
}
```

### Agent Definition Structure

```typescript
interface PluginAgent {
    type: "agent";
    name: string;                    // "plugin-name:agent-name"
    description: string;
    source: "plugin";
    pluginInfo: {
        pluginManifest: object;
        repository: string;
    };
    systemPrompt: string;            // From AGENT.md content
    allowedTools?: string[];         // From frontmatter "allowed-tools"
    model?: string;                  // Optional model override
    color?: string;                  // Display color in UI
}
```

### Agent Frontmatter Fields

| Field | Type | Description |
|-------|------|-------------|
| `description` | string | Agent description shown in Agent tool |
| `allowed-tools` | array | Tools this agent can use |
| `model` | string | Model override for this agent |
| `color` | string | UI color (for visual distinction) |
| `tools` | array | Alternative to allowed-tools |

### Example AGENT.md

```markdown
---
description: Expert code reviewer focused on security and best practices
allowed-tools:
  - Read
  - Grep
  - Glob
model: claude-sonnet-4-6
color: blue
---

You are a security-focused code reviewer. Your job is to:

1. Identify security vulnerabilities
2. Check for best practices
3. Suggest improvements

When reviewing code, focus on:
- Input validation
- Authentication/authorization
- Data sanitization
- Error handling
```

---

## Output Styles

### Overview

Output styles allow plugins to customize how tool output is rendered in the terminal. They're discovered similarly to agents.

### Discovery in loadPluginManifest

```javascript
// ============================================
// Output styles discovery in loadPluginManifest
// Location: chunks.143.mjs:992-1010
// ============================================

// ORIGINAL (for source lookup):
let j = $9(A, "output-styles");
if (!O.outputStyles && w.existsSync(j)) _.outputStylesPath = j;
if (O.outputStyles) {
    let G = Array.isArray(O.outputStyles) ? O.outputStyles : [O.outputStyles], f = [];
    for (let Z of G) {
        let N = $9(A, Z);
        if (w.existsSync(N)) f.push(N);
        else h(`Output style path ${Z} specified in manifest but not found at ${N} for ${O.name}`, {
            level: "warn"
        }), K1(Error(`Plugin component file not found: ${N} for ${O.name}`)), H.push({
            type: "path-not-found",
            source: q,
            plugin: O.name,
            path: N,
            component: "output-styles"
        })
    }
    if (f.length > 0) _.outputStylesPaths = f
}

// READABLE (for understanding):
let outputStylesDir = join(pluginDir, "output-styles");

// Auto-discover default directory
if (!manifest.outputStyles && fs.existsSync(outputStylesDir)) {
    plugin.outputStylesPath = outputStylesDir;
}

// Or use explicit paths from manifest
if (manifest.outputStyles) {
    let stylePaths = Array.isArray(manifest.outputStyles)
        ? manifest.outputStyles
        : [manifest.outputStyles];

    let resolvedPaths = [];
    for (let stylePath of stylePaths) {
        let fullPath = join(pluginDir, stylePath);
        if (fs.existsSync(fullPath)) {
            resolvedPaths.push(fullPath);
        } else {
            // Record error but continue
            errors.push({
                type: "path-not-found",
                source: pluginSource,
                plugin: pluginName,
                path: fullPath,
                component: "output-styles"
            });
        }
    }
    if (resolvedPaths.length > 0) {
        plugin.outputStylesPaths = resolvedPaths;
    }
}
```

### Output Style Directory Structure

```
output-styles/
├── default.json        # Default output style
└── custom/
    └── minimal.json    # Custom style variant
```

### Output Style Configuration

```json
{
  "name": "minimal",
  "description": "Minimal output style with reduced formatting",
  "tools": {
    "Read": {
      "maxLines": 50,
      "showLineNumbers": false
    },
    "Bash": {
      "showCommand": true,
      "collapseOutput": true,
      "maxOutputLines": 20
    }
  }
}
```

### Integration with Tool Rendering

Output styles are loaded during session initialization and applied to tool output rendering:

```
Session Init → Load Plugins → Get Output Styles → Apply to ToolRenderer
```

The styles can control:
- Maximum lines shown
- Whether line numbers are displayed
- Output collapsing behavior
- Formatting options per tool

---

## Component Discovery Summary

The `loadPluginManifest` (Pn4) function discovers all components in this order:

```javascript
// ============================================
// Component discovery order in loadPluginManifest
// Location: chunks.143.mjs:889-1105
// ============================================

function loadPluginManifest(pluginDir, source, enabled, pluginName) {
    let plugin = { name: manifest.name, manifest, path: pluginDir, source, enabled };
    let errors = [];

    // 1. Commands (lines 902-950)
    //    - Default: {pluginDir}/commands/
    //    - Manifest: commands (object or array)

    // 2. Agents (lines 952-970)
    //    - Default: {pluginDir}/agents/
    //    - Manifest: agents (array)

    // 3. Skills (lines 972-991)
    //    - Default: {pluginDir}/skills/
    //    - Manifest: skills (array)

    // 4. Output Styles (lines 992-1010)
    //    - Default: {pluginDir}/output-styles/
    //    - Manifest: outputStyles (array)

    // 5. Hooks (lines 1012-1083)
    //    - Default: {pluginDir}/hooks/hooks.json
    //    - Manifest: hooks (string, array, or object)

    // 6. MCP Servers (resolved later)
    //    - {pluginDir}/.mcp.json
    //    - Manifest: mcpServers

    return { plugin, errors };
}
```

### Discovery Pattern for Each Component

Each component type follows the same pattern:

```
1. Check manifest for explicit declaration
   ↓
2. If declared, resolve paths and validate
   ↓
3. If not declared, check standard directory location
   ↓
4. Record errors for missing files (but continue loading)
   ↓
5. Attach paths to plugin object (xxxPath / xxxPaths)
```

---

## Plugin Object Structure

After loading, a plugin object contains:

```typescript
interface Plugin {
    name: string;
    manifest: PluginManifest;
    path: string;              // Cached plugin directory
    source: string;            // "pluginName@marketplaceName"
    repository: string;        // Same as source
    enabled: boolean;

    // Commands
    commandsPath?: string;     // Default directory
    commandsPaths?: string[];  // Custom directories
    commandsMetadata?: object; // Inline definitions

    // Agents
    agentsPath?: string;
    agentsPaths?: string[];

    // Skills
    skillsPath?: string;
    skillsPaths?: string[];

    // Output Styles
    outputStylesPath?: string;
    outputStylesPaths?: string[];

    // Hooks
    hooksConfig?: HooksConfig;  // Merged hook configuration

    // MCP Servers
    mcpServers?: McpServersConfig;
}
```

---

## Integration with Agent Tool

Plugin agents are merged with system agents and appear in the Agent tool's agent picker:

```javascript
// In agent tool initialization:
let allAgents = [
    ...systemAgents,       // Built-in agents
    ...await getPluginAgents(),  // Plugin agents
    ...customAgents        // User-defined agents
];
```

### Agent Name Resolution

Plugin agents use namespaced names to prevent collisions:
- Built-in: `"general-purpose"`, `"explore"`, `"plan"`
- Plugin: `"myplugin:code-review"`, `"myplugin:testing"`

**Why namespacing:**
- Prevents name collisions between plugins
- Clear attribution of which plugin provides the agent
- Allows multiple plugins to have similar agent types

---

## Summary: Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| AGENT.md convention | Consistent with SKILL.md pattern for easy discovery |
| Namespaced agent names | Prevents collisions and provides attribution |
| Directory-based discovery | Convention over configuration for most plugins |
| Multiple paths support | Flexibility for complex plugins |
| Non-fatal error handling | Missing component files don't break plugin loading |
| Memoized loading | Performance for repeated agent lookups |
| Output styles as plugin feature | Allows consistent theming across sessions |