# Plugin Agents and Output Styles (Claude Code 2.1.76)

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

### `getPluginAgents` (wK1)

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
            if (K.push(...w), w.length > 0) h(`Loaded ${w.length} agents from plugin ${Y.name}`)
        } catch (w) {
            h(`Failed to load agents from plugin ${Y.name}: ${w}`, { level: "error" })
        }
        if (Y.agentsPaths) {
            for (let w of Y.agentsPaths) try {
                let H = CU7(w, Y.name, Y.source, z);
                K.push(...H)
            } catch (H) {
                h(`Failed to load agents from ${w}: ${H}`, { level: "error" })
            }
        }
    }
    return h(`Total plugin agents loaded: ${K.length}`), K
});

// READABLE (for understanding):
getPluginAgents = memoize(async () => {
    let { enabled: plugins, errors } = await getLoadedPlugins();
    let agents = [];

    for (let plugin of plugins) {
        let seenFiles = new Set();

        if (plugin.agentsPath) {
            try {
                let pluginAgents = loadAgentsFromDir(
                    plugin.agentsPath, plugin.name, plugin.source, seenFiles
                );
                agents.push(...pluginAgents);
            } catch (err) {
                debug(`Failed to load agents from ${plugin.name}: ${err}`, { level: "error" });
            }
        }

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

---

## Output Styles

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
