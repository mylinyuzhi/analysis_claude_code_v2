# Plugin Skills Integration - Deep Analysis (Claude Code 2.1.38)

## Overview

Plugin Skills extend Claude Code's capabilities through installed plugins. Plugins can contribute skills (commands) that behave similarly to user-defined skills but come from external packages. This document covers how plugins contribute skills, the `pluginInfo` field structure, and the distinction between first-party and third-party plugins.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Skill System section)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations (Plugin System section)

Key functions in this document:
- `isPluginFirstParty` (Uu4) - Check if plugin is first-party - chunks.132.mjs:764-770
- `createPluginCommandObject` (uu1) - Create skill object from plugin - chunks.87.mjs:1870-1931
- `loadPluginCommands` (YK1) - Load all plugin commands - chunks.87.mjs:2039
- `loadCommandsFromDir` (TU7) - Load commands from plugin directory - chunks.87.mjs:1856-1868

---

## Architecture Overview

```
Plugin Skills Loading Flow
──────────────────────────

                    ┌──────────────────────────────────┐
                    │    Plugin Manager Initialization  │
                    │    iY() - getEnabledPlugins()     │
                    └──────────────────────────────────┘
                                    │
                                    ▼
                    ┌──────────────────────────────────┐
                    │   For each enabled plugin:       │
                    │   - commandsPath (default)       │
                    │   - commandsPaths (custom)       │
                    │   - commandsMetadata (config)    │
                    └──────────────────────────────────┘
                                    │
                                    ▼
              ┌─────────────────────────────────────────────┐
              │  TU7() - loadCommandsFromDir()              │
              │  (chunks.87.mjs:1856)                       │
              │                                              │
              │  1. Scan directory for .md files            │
              │  2. Parse frontmatter                        │
              │  3. Create skill objects via uu1()          │
              └─────────────────────────────────────────────┘
                                    │
                                    ▼
              ┌─────────────────────────────────────────────┐
              │  uu1() - createPluginCommandObject()        │
              │  (chunks.87.mjs:1870)                       │
              │                                              │
              │  Creates skill object with:                  │
              │  - source: "plugin"                          │
              │  - pluginInfo: { pluginManifest, repository }│
              │  - getPromptForCommand()                     │
              └─────────────────────────────────────────────┘
                                    │
                                    ▼
              ┌─────────────────────────────────────────────┐
              │  Skill Object                                │
              │  {                                           │
              │    type: "prompt",                          │
              │    name: "plugin-name:skill-name",          │
              │    source: "plugin",                        │
              │    pluginInfo: {...},                       │
              │    ...                                      │
              │  }                                           │
              └─────────────────────────────────────────────┘
```

---

## Implementation Details

### isPluginFirstParty (Uu4)

**What it does:** Determines if a plugin skill comes from a first-party (Anthropic) repository.

**How it works:**
1. Checks if source is "plugin"
2. Verifies pluginInfo.repository exists
3. Extracts repository suffix after "@"
4. Checks against first-party repository set

```javascript
// ============================================
// isPluginFirstParty - Check if plugin is first-party
// Location: chunks.132.mjs:764-770
// ============================================

// ORIGINAL (for source lookup):
function Uu4(A) {
    if (A.source !== "plugin" || !A.pluginInfo?.repository) return !1;
    let q = A.pluginInfo.repository.lastIndexOf("@");
    if (q <= 0) return !1;
    let K = A.pluginInfo.repository.slice(q + 1);
    return NT.has(K)
}

// READABLE (for understanding):
function isPluginFirstParty(skill) {
    // Must be a plugin skill with repository info
    if (skill.source !== "plugin" || !skill.pluginInfo?.repository) {
        return false;
    }

    // Repository format: "owner/repo@version"
    // We extract the repo name after "@"
    let atIndex = skill.pluginInfo.repository.lastIndexOf("@");
    if (atIndex <= 0) {
        return false;
    }

    let repoName = skill.pluginInfo.repository.slice(atIndex + 1);

    // Check against first-party repositories set
    return FIRST_PARTY_REPOSITORIES.has(repoName);
}

// Mapping: Uu4→isPluginFirstParty, NT→FIRST_PARTY_REPOSITORIES
```

### FIRST_PARTY_REPOSITORIES (NT)

**What it is:** A Set of repository names that are considered first-party (Anthropic official).

```javascript
// ============================================
// FIRST_PARTY_REPOSITORIES - First-party plugin repositories
// Location: chunks.15.mjs:227
// ============================================

// ORIGINAL (for source lookup):
NT = new Set(["claude-code-marketplace", "claude-code-plugins", "claude-plugins-official", "anthropic-marketplace", "anthropic-plugins", "agent-skills", "life-sciences", "knowledge-work-plugins"])

// READABLE (for understanding):
const FIRST_PARTY_REPOSITORIES = new Set([
    "claude-code-marketplace",     // Main marketplace
    "claude-code-plugins",         // Official plugins
    "claude-plugins-official",     // Alternative official name
    "anthropic-marketplace",       // Anthropic marketplace
    "anthropic-plugins",           // Anthropic plugins
    "agent-skills",                // Agent skills repo
    "life-sciences",               // Life sciences domain
    "knowledge-work-plugins"       // Knowledge work plugins
]);

// Mapping: NT→FIRST_PARTY_REPOSITORIES
```

**Why this approach:**
- **Security:** First-party plugins are trusted more than third-party
- **Telemetry:** Different event data for first-party vs third-party
- **Naming:** First-party plugins can use reserved names

### createPluginCommandObject (uu1)

**What it does:** Creates a skill object from a plugin's command file.

**How it works:**
1. Parses frontmatter from the .md file
2. Resolves allowed-tools with shell expansion
3. Creates skill object with plugin metadata
4. Returns object with getPromptForCommand method

```javascript
// ============================================
// createPluginCommandObject - Create skill from plugin file
// Location: chunks.87.mjs:1870-1931
// ============================================

// ORIGINAL (for source lookup):
function uu1(A, q, K, Y, z, w, H = {
    isSkillMode: !1
}) {
    try {
        let {
            frontmatter: $,
            content: O
        } = q, _ = $.description ?? vp(O, w ? "Plugin skill" : "Plugin command"), J = $["allowed-tools"], X = typeof J === "string" ? Iu1(J, z) : Array.isArray(J) ? J.map((B) => typeof B === "string" ? Iu1(B, z) : B) : J, D = Vh(X), j = $["argument-hint"], M = xu1($.arguments), P = $.when_to_use, W = $.version, G = $.name, f = $.model === "inherit" ? void 0 : $.model ? t9($.model) : void 0, Z = $["disable-model-invocation"], N;
        if (H.isSkillMode) N = Z === void 0 ? !1 : J6(Z);
        else N = J6(Z);
        let T = $["user-invocable"],
            y = !(H.isSkillMode ? T === void 0 || T === null ? !0 : J6(T) : !0);
        return {
            type: "prompt",
            name: A,
            description: _,
            hasUserSpecifiedDescription: !!$.description,
            allowedTools: D,
            argumentHint: j,
            argNames: M.length > 0 ? M : void 0,
            whenToUse: P,
            version: W,
            model: f,
            disableModelInvocation: N,
            contentLength: O.length,
            source: "plugin",
            loadedFrom: w || H.isSkillMode ? "plugin" : void 0,
            pluginInfo: {
                pluginManifest: Y,
                repository: K
            },
            isEnabled: () => !0,
            isHidden: y,
            progressMessage: w || H.isSkillMode ? "loading" : "running",
            userFacingName() {
                return G || A
            },
            async getPromptForCommand(B, S) {
                let m = H.isSkillMode ? `Base directory for this skill: ${Qa(q.filePath)}

${O}` : O;
                return m = Ej1(m, B, !0, M), m = Iu1(m, z), m = m.replace(/\$\{CLAUDE_SESSION_ID\}/g, U6()), m = await Ma(m, {
                    ...S,
                    async getAppState() {
                        let b = await S.getAppState();
                        return {
                            ...b,
                            toolPermissionContext: {
                                ...b.toolPermissionContext,
                                alwaysAllowRules: {
                                    ...b.toolPermissionContext.alwaysAllowRules,
                                    command: D
                                }
                            }
                        }
                    }
                }, `/${A}`), [{
                    type: "text",
                    text: m
                }]
            }
        }
    } catch ($) {
        return h(`Failed to create command from ${q.filePath}: ${$}`, {
            level: "error"
        }), null
    }
}

// READABLE (for understanding):
function createPluginCommandObject(
    commandName,
    parsedFile,
    repository,
    pluginManifest,
    pluginPath,
    isSkillFile,
    options = { isSkillMode: false }
) {
    try {
        let { frontmatter, content } = parsedFile;

        // Generate description if not specified
        let description = frontmatter.description ??
            generateDescription(content, isSkillFile ? "Plugin skill" : "Plugin command");

        // Process allowed-tools with shell expansion
        let allowedToolsRaw = frontmatter["allowed-tools"];
        let allowedTools = processAllowedTools(allowedToolsRaw, pluginPath);

        // Parse other frontmatter fields
        let argumentHint = frontmatter["argument-hint"];
        let argNames = parseArguments(frontmatter.arguments);
        let whenToUse = frontmatter.when_to_use;
        let version = frontmatter.version;
        let displayName = frontmatter.name;

        // Resolve model override
        let model = frontmatter.model === "inherit"
            ? undefined
            : frontmatter.model ? resolveModelConfig(frontmatter.model) : undefined;

        // Handle disable-model-invocation
        let disableModelInvocation = options.isSkillMode
            ? frontmatter["disable-model-invocation"] === undefined
                ? false
                : parseBoolean(frontmatter["disable-model-invocation"])
            : parseBoolean(frontmatter["disable-model-invocation"]);

        // Handle user-invocable
        let userInvocable = frontmatter["user-invocable"];
        let isHidden = !(options.isSkillMode
            ? userInvocable === undefined || userInvocable === null
                ? true
                : parseBoolean(userInvocable)
            : true);

        return {
            type: "prompt",
            name: commandName,
            description,
            hasUserSpecifiedDescription: !!frontmatter.description,
            allowedTools,
            argumentHint,
            argNames: argNames.length > 0 ? argNames : undefined,
            whenToUse,
            version,
            model,
            disableModelInvocation,
            contentLength: content.length,
            source: "plugin",
            loadedFrom: isSkillFile || options.isSkillMode ? "plugin" : undefined,

            // Plugin-specific metadata
            pluginInfo: {
                pluginManifest,
                repository
            },

            isEnabled: () => true,
            isHidden,
            progressMessage: isSkillFile || options.isSkillMode ? "loading" : "running",

            userFacingName() {
                return displayName || commandName;
            },

            async getPromptForCommand(args, toolUseContext) {
                // Skill mode adds base directory hint
                let promptText = options.isSkillMode
                    ? `Base directory for this skill: ${getBaseDir(parsedFile.filePath)}

${content}`
                    : content;

                // Apply transformations
                promptText = interpolateArguments(promptText, args, true, argNames);
                promptText = expandShellVariables(promptText, pluginPath);
                promptText = promptText.replace(/\$\{CLAUDE_SESSION_ID\}/g, generateSessionId());
                promptText = await executeShellExpansion(promptText, {
                    ...toolUseContext,
                    async getAppState() {
                        let state = await toolUseContext.getAppState();
                        return {
                            ...state,
                            toolPermissionContext: {
                                ...state.toolPermissionContext,
                                alwaysAllowRules: {
                                    ...state.toolPermissionContext.alwaysAllowRules,
                                    command: allowedTools
                                }
                            }
                        };
                    }
                }, `/${commandName}`);

                return [{ type: "text", text: promptText }];
            }
        };
    } catch (err) {
        debug(`Failed to create command from ${parsedFile.filePath}: ${err}`, { level: "error" });
        return null;
    }
}

// Mapping: uu1→createPluginCommandObject, Iu1→expandShellVariables, Vh→processAllowedTools,
// xu1→parseArguments, J6→parseBoolean, t9→resolveModelConfig, Ej1→interpolateArguments,
// Ma→executeShellExpansion, U6→generateSessionId, Qa→getBaseDir
```

---

## pluginInfo Field Structure

The `pluginInfo` field is attached to plugin skills to identify their origin:

```typescript
interface PluginInfo {
    pluginManifest: {
        name: string;           // Plugin display name
        version: string;        // Plugin version
        description?: string;   // Plugin description
        // ... other manifest fields
    };
    repository: string;         // Format: "owner/repo@version"
                                // Examples:
                                // - "anthropics/claude-code-marketplace@1.0.0"
                                // - "third-party/plugin-name@2.1.0"
}
```

### Usage in Telemetry

The `pluginInfo` is used to enrich telemetry events:

```javascript
// From executeForkedSkill (chunks.132.mjs:696-704)
let isPluginFirstParty = isPluginFirstParty(skillDefinition);

emitTelemetry("tengu_skill_tool_invocation", {
    command_name: "custom",
    execution_context: "fork",
    ...skillDefinition.pluginInfo && {
        plugin_name: isPluginFirstParty
            ? skillDefinition.pluginInfo.pluginManifest.name
            : "third-party",
        plugin_repository: isPluginFirstParty
            ? skillDefinition.pluginInfo.repository
            : "third-party"
    }
});
```

**Key insight:** Third-party plugins are identified as "third-party" in telemetry, while first-party plugins use their actual name and repository. This allows Anthropic to track official plugin usage separately from community plugins.

---

## Plugin Command Loading

### Plugin Directory Structure

Plugins can define commands in multiple ways:

```
my-plugin/
├── plugin.json              # Plugin manifest
├── commands/                # Default commands directory
│   ├── SKILL.md            # Skill file (becomes plugin-name:skill)
│   └── other-command.md    # Other command
├── custom-commands/         # Custom commands path (from manifest)
│   └── special.md
└── commandsMetadata: {      # In plugin.json
    "my-command": {
        "source": "./path/to/command.md",
        "description": "Custom description override"
    }
}
```

### Loading Priority

1. **commandsPath** - Default directory (usually `commands/`)
2. **commandsPaths** - Additional directories from manifest
3. **commandsMetadata** - Explicit command definitions with overrides

### loadPluginCommands (YK1)

**What it does:** Loads all commands from all enabled plugins.

```javascript
// ============================================
// loadPluginCommands - Load from all plugins
// Location: chunks.87.mjs:2039
// ============================================

// READABLE (for understanding):
loadPluginCommands = memoize(async () => {
    let { enabled: plugins, errors } = await getEnabledPlugins();
    let commands = [];

    if (errors.length > 0) {
        debug(`Plugin loading errors: ${errors.map(e => e.message).join(", ")}`);
    }

    for (let plugin of plugins) {
        let seenFiles = new Set();

        // Load from default commands directory
        if (plugin.commandsPath) {
            try {
                let cmds = await loadCommandsFromDir(
                    plugin.commandsPath,
                    plugin.name,
                    plugin.source,
                    plugin.manifest,
                    plugin.path,
                    { isSkillMode: false },
                    seenFiles
                );
                commands.push(...cmds);
                if (cmds.length > 0) {
                    debug(`Loaded ${cmds.length} commands from plugin ${plugin.name} default directory`);
                }
            } catch (err) {
                debug(`Failed to load commands from plugin ${plugin.name}: ${err}`);
            }
        }

        // Load from custom command paths (manifest: commandsPaths)
        if (plugin.commandsPaths) {
            for (let cmdPath of plugin.commandsPaths) {
                let stats = fs.statSync(cmdPath);
                if (stats.isDirectory()) {
                    let cmds = await loadCommandsFromDir(...);
                    commands.push(...cmds);
                } else if (stats.isFile() && cmdPath.endsWith(".md")) {
                    // Single file command
                    let cmd = await loadCommandFromFile(...);
                    if (cmd) commands.push(cmd);
                }
            }
        }
    }

    return commands;
});
```

---

## First-Party vs Third-Party Handling

### Telemetry Differences

| Field | First-Party | Third-Party |
|-------|-------------|-------------|
| `plugin_name` | Actual manifest name | "third-party" |
| `plugin_repository` | Actual repository | "third-party" |

### Naming Restrictions

First-party plugins can use reserved names:

```javascript
// Reserved names check (chunks.15.mjs:124-134)
if (name.isReserved) {
    if (source === "git" && url) {
        let isGitHubAnthropics = url.includes("github.com/anthropics/") ||
                                   url.includes("git@github.com:anthropics/");
        if (isGitHubAnthropics) {
            return null; // Allow
        }
        return `The name '${name}' is reserved for official Anthropic marketplaces.`;
    }
}
```

### Security Implications

First-party plugins are trusted more:
- **Auto-allow:** First-party skills may bypass certain permission checks
- **Telemetry:** Full details sent for analytics
- **Updates:** Can receive automatic updates

Third-party plugins:
- **Permissions:** May require explicit user approval
- **Telemetry:** Anonymized as "third-party"
- **Sandboxing:** Potentially more restricted execution

---

## Skill Name Derivation

Plugin skills derive their names from file paths:

```javascript
// From mN9 function
function deriveCommandName(filePath, baseDir, pluginName) {
    let relativePath = path.relative(baseDir, filePath);
    let name = relativePath
        .replace(/\.md$/, "")      // Remove .md extension
        .replace(/\//g, ":");      // Replace / with :

    // Result: "plugin-name:subdir:command-name"
    return `${pluginName}:${name}`;
}
```

**Examples:**
- `commands/SKILL.md` → `plugin-name:SKILL`
- `commands/code/review.md` → `plugin-name:code:review`
- `commands/test.md` → `plugin-name:test`

---

## Design Rationale

### Why Separate First-Party Detection?

1. **Security:** Anthropic can trust its own plugins more
2. **Analytics:** Track official plugin adoption
3. **Support:** First-party plugins get better support

### Why pluginInfo Field?

The `pluginInfo` field enables:
1. **Attribution:** Know which plugin contributed a skill
2. **Updates:** Check for plugin updates
3. **Telemetry:** Rich analytics data
4. **Debugging:** Identify plugin conflicts

### Why Memoized Loading?

Plugin commands are loaded once and cached:
- Avoid repeated filesystem access
- Fast lookup during skill invocation
- Cache cleared on plugin changes

---

## Debugging

### Check Plugin Skills

```javascript
// Get all plugin skills
let registry = await getSkillRegistry(getRegistryContext());
let pluginSkills = registry.filter(s => s.source === "plugin");
console.log(pluginSkills.map(s => s.name));
```

### Check First-Party Status

```javascript
// Check if a skill is first-party
let skill = registry.find(s => s.name === "plugin-name:command");
if (skill?.pluginInfo) {
    console.log(isPluginFirstParty(skill));
}
```

### Check Plugin Info

```javascript
// View plugin metadata
let skill = registry.find(s => s.source === "plugin");
console.log(skill.pluginInfo);
// {
//   pluginManifest: { name: "...", version: "..." },
//   repository: "owner/repo@version"
// }
```