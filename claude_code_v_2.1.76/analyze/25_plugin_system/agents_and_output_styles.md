# Plugin Agents and Output Styles (Claude Code 2.1.76)

> Deep analysis of how plugins contribute custom agents and output styles,
> including discovery patterns and integration with the agent tool system.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution

Key functions in this document:
- `getPluginAgents` (KQ6) - Load all custom agents from enabled plugins
- `PLUGIN_MEMORY_TYPES` (S24) - Constant array ["user", "project", "local"]
- `loadAgentsFromDir` (C24) - Load agents from a plugin directory
- `loadAgentFromMarkdown` (I24) - Parse single AGENT.md file into agent definition
- `getPluginOutputStyles` (Ik8) - Load output styles from plugins
- `loadOutputStylesFromDir` (p_4) - Helper to load styles from a directory

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
                    │    _z() - getLoadedPlugins()      │
                    └──────────────────────────────────┘
                                    │
                                    ▼
                    ┌──────────────────────────────────┐
                    │    getPluginAgents (KQ6)         │
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
                    │  loadAgentsFromDir (C24)          │
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

### `getPluginAgents` (KQ6)

**What it does:** Loads all custom agent definitions from enabled plugins.

```javascript
// ============================================
// getPluginAgents - Load all plugin agents
// Location: chunks.95.mjs:1121-1162
// ============================================

// ORIGINAL (for source lookup):
KQ6 = e1(async () => {
    let { enabled: A, errors: q } = await _z();
    if (q.length > 0) k(`Plugin loading errors: ${q.map((z)=>sM(z)).join(", ")}`);
    let Y = (await Promise.all(A.map(async (z) => {
        let _ = new Set, w = [];
        if (z.agentsPath) try {
            let O = await C24(z.agentsPath, z.name, z.source, z.path, z.manifest, _);
            if (w.push(...O), O.length > 0) k(`Loaded ${O.length} agents from plugin ${z.name}`)
        } catch (O) {
            k(`Failed to load agents from plugin ${z.name}: ${O}`, { level: "error" })
        }
        if (z.agentsPaths) {
            let O = await Promise.all(z.agentsPaths.map(async ($) => {
                // Load from each custom path...
            }));
            for (let $ of O) w.push(...$)
        }
        return w
    }))).flat();
    return k(`Total plugin agents loaded: ${Y.length}`), Y
});

// READABLE (for understanding):
getPluginAgents = memoize(async () => {
    let { enabled: plugins, errors } = await getLoadedPlugins();
    if (errors.length > 0) {
        debug(`Plugin loading errors: ${errors.map(serializePluginError).join(", ")}`);
    }

    let allAgents = (await Promise.all(plugins.map(async (plugin) => {
        let seenFiles = new Set(), agents = [];

        if (plugin.agentsPath) {
            try {
                let loaded = await loadAgentsFromDir(
                    plugin.agentsPath, plugin.name, plugin.source,
                    plugin.path, plugin.manifest, seenFiles
                );
                agents.push(...loaded);
            } catch (err) {
                debug(`Failed: ${err}`, { level: "error" });
            }
        }

        if (plugin.agentsPaths) {
            for (let agentPath of plugin.agentsPaths) {
                try {
                    let loaded = await loadAgentsFromDir(
                        agentPath, plugin.name, plugin.source,
                        plugin.path, plugin.manifest, seenFiles
                    );
                    agents.push(...loaded);
                } catch (err) { /* error handling */ }
            }
        }
        return agents;
    }))).flat();

    debug(`Total plugin agents loaded: ${allAgents.length}`);
    return allAgents;
});

// Mapping: KQ6→getPluginAgents, e1→memoize, _z→getLoadedPlugins, C24→loadAgentsFromDir,
//   k→debug, sM→serializePluginError
```

---

## Deep Analysis: Agent Loading Functions

### `loadAgentsFromDir` (C24) - Directory Scanner

**What it does:** Scans a directory for agent definition files (AGENT.md files with frontmatter).

```javascript
// ============================================
// loadAgentsFromDir - Scan directory for AGENT.md files
// Location: chunks.95.mjs:1001-1021
// ============================================

// ORIGINAL (for source lookup):
async function C24(A, q, K, Y, z, _, w) {
    let O = await j0(A), $ = [];
    if (!O) return $;
    for (let H of O) {
        // Only process AGENT.md files
        let G = $9(H, "AGENT.md");
        if (!await uK(G)) continue;
        if (w.has(G)) continue;
        w.add(G);
        let J = await I24(G, q, K, Y, z, _);
        J && $.push(J);
    }
    return $;
}

// READABLE (for understanding):
async function loadAgentsFromDir(dirPath, pluginName, pluginSource, pluginPath, manifest, seenFiles) {
    let subdirs = await listDirectories(dirPath);
    let agents = [];

    if (!subdirs) return agents;

    for (let subdir of subdirs) {
        // Look for AGENT.md in each subdirectory
        let agentFile = path.join(subdir, "AGENT.md");
        if (!await fileExists(agentFile)) continue;

        // Deduplication by realpath
        if (seenFiles.has(agentFile)) continue;
        seenFiles.add(agentFile);

        // Parse the agent definition
        let agentDef = await loadAgentFromMarkdown(
            agentFile, pluginName, pluginSource, pluginPath, manifest
        );
        if (agentDef) agents.push(agentDef);
    }
    return agents;
}

// Mapping: C24→loadAgentsFromDir, A→dirPath, q→pluginName, K→pluginSource,
//   Y→pluginPath, z→manifest, _→seenFiles, w→seenFiles,
//   j0→listDirectories, $9→path.join, uK→fileExists, I24→loadAgentFromMarkdown
```

**Discovery pattern:**
```
agents/
├── AGENT.md           → Skipped (no AGENT.md in root agents/ dir)
└── code-review/
    └── AGENT.md       → Loaded as "plugin-name:code-review"
└── testing/
    └── AGENT.md       → Loaded as "plugin-name:testing"
```

### `loadAgentFromMarkdown` (I24) - Agent Definition Parser

**What it does:** Parses a single AGENT.md file into an agent definition object.

```javascript
// ============================================
// loadAgentFromMarkdown - Parse AGENT.md into agent definition
// Location: chunks.95.mjs:1024-1097
// ============================================

// ORIGINAL (for source lookup):
async function I24(A, q, K, Y, z, _) {
    let w = await F17(A), O = hK(w);
    if (!O.description) return null;  // Required field

    // Agent name from directory or frontmatter
    let $ = O.name || l9(l9(A));
    let H = `${q}:${$}`;  // Namespaced name

    // Extract system prompt (content after frontmatter)
    let G = S7(w);

    // Validate memory types
    let J = O.memory;
    if (J && !S24.includes(J)) {
        k(`Invalid memory type "${J}" for agent ${H}, must be one of ${S24.join(", ")}`);
        J = undefined;
    }

    return {
        type: "agent",
        name: H,
        description: O.description,
        source: "plugin",
        pluginInfo: { pluginManifest: z, repository: Y },
        systemPrompt: G,
        allowedTools: O["allowed-tools"] || O.allowedTools,
        model: O.model,
        color: O.color,
        memory: J
    };
}

// READABLE (for understanding):
async function loadAgentFromMarkdown(filePath, pluginName, pluginSource, pluginPath, manifest) {
    let content = await readFile(filePath);
    let frontmatter = parseFrontmatter(content);

    // description is required
    if (!frontmatter.description) return null;

    // Agent name: frontmatter.name > directory name
    let agentName = frontmatter.name || path.basename(path.dirname(filePath));
    let fullName = `${pluginName}:${agentName}`;  // Namespace: "plugin:agent"

    // System prompt is the markdown content after frontmatter
    let systemPrompt = extractContentAfterFrontmatter(content);

    // Validate memory type
    let memory = frontmatter.memory;
    if (memory && !PLUGIN_MEMORY_TYPES.includes(memory)) {
        log(`Invalid memory type "${memory}" for agent ${fullName}`);
        memory = undefined;
    }

    return {
        type: "agent",
        name: fullName,                           // "plugin-name:agent-name"
        description: frontmatter.description,     // Required
        source: "plugin",
        pluginInfo: {
            pluginManifest: manifest,
            repository: pluginPath
        },
        systemPrompt: systemPrompt,               // The agent's instructions
        allowedTools: frontmatter["allowed-tools"] || frontmatter.allowedTools,
        model: frontmatter.model,                 // Optional model override
        color: frontmatter.color,                 // Display color
        memory: memory                            // Memory scope validation
    };
}

// Mapping: I24→loadAgentFromMarkdown, A→filePath, q→pluginName, K→pluginSource,
//   Y→pluginPath, z→manifest, _→seenFiles, w→content, O→frontmatter,
//   F17→readFile, hK→parseFrontmatter, S7→extractContentAfterFrontmatter,
//   S24→PLUGIN_MEMORY_TYPES, k→log
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

### Agent Discovery Pattern

```
agents/
├── AGENT.md           → plugin-name:agents (single agent at directory level)
└── code-review/
    └── AGENT.md       → plugin-name:code-review
└── testing/
    └── AGENT.md       → plugin-name:testing
```

### Agent Naming and Namespacing

Plugin agents use namespaced names to prevent collisions:
- Built-in: `"general-purpose"`, `"explore"`, `"plan"`
- Plugin: `"myplugin:code-review"`, `"myplugin:testing"`

**Why namespacing:**
- Prevents name collisions between plugins
- Clear attribution of which plugin provides the agent
- Allows multiple plugins to have similar agent types

### PLUGIN_MEMORY_TYPES Constant (S24)

```javascript
// ============================================
// PLUGIN_MEMORY_TYPES - Valid memory scopes for plugin agents
// Location: chunks.95.mjs:1120
// ============================================

S24 = ["user", "project", "local"];
```

**What it does:** Defines the valid scopes for plugin-provided agent memory types.

**How it works:**
1. `user` - Memory available across all projects for this user
2. `project` - Memory scoped to the current project directory
3. `local` - Memory scoped to `.claude/settings.local.json` (not committed)

**Why this matters:** Plugin agents can store persistent memory using these scopes. The system validates agent memory configurations against this list to ensure only valid scopes are used.

---

## Output Styles

### `getPluginOutputStyles` (Ik8) - Output Style Loader

**What it does:** Loads all output style configurations from enabled plugins.

```javascript
// ============================================
// getPluginOutputStyles - Load output styles from plugins
// Location: chunks.94.mjs:941-974
// ============================================

// ORIGINAL (for source lookup):
Ik8 = e1(async () => {
    let { enabled: A, errors: q } = await _z();
    if (q.length > 0) k(`Plugin loading errors: ${q.map((z)=>sM(z)).join(", ")}`);
    let Y = (await Promise.all(A.map(async (z) => {
        let _ = [];
        if (z.outputStylesPath) try {
            let w = await p_4(z.outputStylesPath, z.name);
            _.push(...w)
        } catch (w) { /* error handling */ }
        if (z.outputStylesPaths) {
            // Load from additional paths...
        }
        return _
    }))).flat();
    return k(`Total plugin output styles loaded: ${Y.length}`), Y
});

// READABLE (for understanding):
getPluginOutputStyles = memoize(async () => {
    let { enabled: plugins, errors } = await getLoadedPlugins();
    if (errors.length > 0) {
        debug(`Plugin loading errors: ${errors.map(serializePluginError).join(", ")}`);
    }

    let allStyles = (await Promise.all(plugins.map(async (plugin) => {
        let styles = [];

        // Standard output-styles directory
        if (plugin.outputStylesPath) {
            try {
                let loaded = await loadOutputStylesFromDir(
                    plugin.outputStylesPath, plugin.name
                );
                styles.push(...loaded);
            } catch (err) { /* error handling */ }
        }

        // Additional custom paths
        if (plugin.outputStylesPaths) {
            for (let stylePath of plugin.outputStylesPaths) {
                // Load from each path...
            }
        }
        return styles;
    }))).flat();

    debug(`Total plugin output styles loaded: ${allStyles.length}`);
    return allStyles;
});

// Mapping: Ik8→getPluginOutputStyles, e1→memoize, _z→getLoadedPlugins, p_4→loadOutputStylesFromDir
```

### Overview

Output styles allow plugins to customize how tool output is rendered in the terminal. They're discovered similarly to agents.

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

### Directory Structure

```
output-styles/
├── default.json        # Default output style
└── custom/
    └── minimal.json    # Custom style variant
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
