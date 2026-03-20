# Plugin Skills and Commands Integration (Claude Code 2.1.76)

> Deep analysis of how plugins contribute skills and slash commands,
> including loading mechanisms, discovery patterns, and object creation.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `getPluginCommands` (w96) - Load all slash commands from enabled plugins
- `getPluginSkills` (hk8) - Load all skills from enabled plugins
- `loadCommandsFromDir` (m_4) - Load commands from a plugin directory
- `loadSkillsFromDir` (B_4) - Load skills from a plugin directory
- `createCommandObject` (dp6) - Create command/skill object from parsed file
- `loadPluginManifest` (h24) - Discover plugin components including commands/skills

---

## Overview

Plugins can contribute two types of prompt-based capabilities:
1. **Slash Commands** - User-invocable via `/command-name` syntax
2. **Skills** - Agent-activatable capabilities with `loadedFrom: "plugin"` marker

Both use the same underlying file format (Markdown with frontmatter) but differ in how they're discovered and invoked.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    PLUGIN COMMANDS/SKILLS LOADING FLOW                       │
└─────────────────────────────────────────────────────────────────────────────┘

                    ┌──────────────────────────────────┐
                    │    Plugin Manager Initialization  │
                    │    iY() - getLoadedPlugins()      │
                    └──────────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    ▼                               ▼
    ┌─────────────────────────────┐   ┌─────────────────────────────┐
    │    getPluginCommands (w96)  │   │    getPluginSkills (hk8)    │
    │    Memoized loader          │   │    Memoized loader          │
    └─────────────────────────────┘   └─────────────────────────────┘
                    │                               │
                    ▼                               ▼
    ┌─────────────────────────────┐   ┌─────────────────────────────┐
    │  For each enabled plugin:    │   │  For each enabled plugin:    │
    │  - commandsPath (default)    │   │  - skillsPath (default)      │
    │  - commandsPaths (custom)    │   │  - skillsPaths (custom)      │
    │  - commandsMetadata (inline) │   └─────────────────────────────┘
    └─────────────────────────────┘                   │
                    │                                 ▼
                    ▼                 ┌─────────────────────────────┐
    ┌─────────────────────────────┐   │  loadSkillsFromDir (B_4)     │
    │  loadCommandsFromDir (m_4)  │   │  - Look for SKILL.md in dir  │
    │  - Scan for .md files       │   │  - Or SKILL.md in subdirs    │
    │  - Parse frontmatter        │   │  - isSkillMode: true         │
    └─────────────────────────────┘   └─────────────────────────────┘
                    │                                 │
                    └───────────────┬─────────────────┘
                                    ▼
                    ┌──────────────────────────────────┐
                    │  createCommandObject (dp6)       │
                    │  Creates unified object with:    │
                    │  - type: "prompt"                │
                    │  - source: "plugin"              │
                    │  - pluginInfo: {...}             │
                    │  - getPromptForCommand()         │
                    └──────────────────────────────────┘
```

---

## Slash Commands

### `getPluginCommands` (w96) - Command Loader

**What it does:** Loads all slash commands from all enabled plugins. Memoized so it only runs once per session.

**Naming convention:** Plugin commands appear as `/plugin-name:command-name` to prevent collisions with built-in commands and other plugins.

**Discovery pattern:**
```
commands/
├── my-command.md          → /plugin-name:my-command
├── deploy.md              → /plugin-name:deploy
└── setup/
    └── config.md          → /plugin-name:setup/config (nested)
```

### Command Frontmatter Format

```markdown
---
description: Deploy the current project to production
allowed-tools:
  - Bash
  - Read
requires-confirmation: true
---

Deploy the project by running the following steps:
1. Run tests: `npm test`
2. Build: `npm run build`
3. Deploy: `npm run deploy`
```

| Frontmatter Field | Type | Description |
|------------------|------|-------------|
| `description` | string | Shown in slash command help |
| `allowed-tools` | string[] | Tools this command can use |
| `requires-confirmation` | boolean | Show confirmation before executing |

---

## Skills

### `getPluginSkills` (hk8) - Skill Loader

**What it does:** Loads all skills from all enabled plugins. Skills are SKILL.md files within plugin directories.

**Key difference from commands:** Skills are invoked by the agent based on context, not directly by the user with a slash. They appear in the skill system's discovery mechanism.

**Discovery pattern:**
```
skills/
├── SKILL.md               → plugin-name skill (direct)
└── code-review/
    └── SKILL.md           → plugin-name:code-review skill
```

---

## Namespacing Strategy

### Why Namespacing Matters

Plugin components (commands, skills, agents) use namespaced names to prevent collisions:

| Component Type | Built-in Name | Plugin Name |
|----------------|---------------|-------------|
| Command | `/commit` | `/my-plugin:deploy` |
| Skill | `code-review` | `my-plugin:code-review` |
| Agent | `general-purpose` | `my-plugin:reviewer` |

**Collision prevention:**
1. Multiple plugins can define similar commands without conflict
2. User can distinguish between built-in and plugin functionality
3. Plugin attribution is clear in the UI

### Name Resolution Algorithm

When a user types `/deploy`, the system follows this resolution path:

```
1. Exact match in built-in commands?
   └─ Yes → Execute built-in command

2. Exact match in plugin commands (with prefix)?
   └─ Yes → Execute plugin command

3. Prefix match in plugin commands?
   └─ If single match → Execute with suggestion
   └─ If multiple matches → Show suggestion list

4. No match found → Show "Unknown command" error
```

**Example resolution:**
```
User types: /deploy

Built-in commands: [help, clear, compact, ...]  → No match
Plugin commands:
  - my-plugin:deploy
  - other-plugin:deploy

Result: Show suggestion:
  "Did you mean /my-plugin:deploy or /other-plugin:deploy?"
```

### MCP Server Namespacing

Plugin MCP servers use a three-part namespace: `plugin:{pluginName}:{serverName}`

```javascript
// Before namespacing (in plugin manifest):
{ "mcpServers": { "my-server": { ... } } }

// After namespacing (in tool registry):
{ "plugin:my-plugin:my-server": { ..., scope: "dynamic" } }
```

This ensures:
- MCP tools from different plugins don't collide
- Tools are attributable to their source plugin
- The `scope: "dynamic"` marker distinguishes plugin MCPs from static config

### SKILL.md Format

```markdown
---
name: code-review
description: Review code for security vulnerabilities and best practices
triggers:
  - "review my code"
  - "check for security issues"
  - "code review"
---

When performing a code review, analyze the code for:
1. Security vulnerabilities (SQL injection, XSS, etc.)
2. Best practices violations
3. Performance issues
4. Code clarity

Focus especially on input validation and authentication flows.
```

---

## Deep Analysis: Command/Skill Loading Functions

### `loadCommandsFromDir` (m_4) - Directory Scanner

**What it does:** Scans a directory for command definition files (Markdown files with frontmatter).

```javascript
// ============================================
// loadCommandsFromDir - Scan directory for command files
// Location: chunks.94.mjs:470-520
// ============================================

// ORIGINAL (for source lookup):
async function m_4(A, q, K, Y, z, _, w) {
    let O = await auY(A), $ = [];
    if (!O) return $;
    for (let H of O) {
        if (w.has(H)) continue;  // Dedup by realpath
        w.add(H);
        let G = await F17(H), J = hK(G), Q = J["command-name"] || J.name || l9(H, ".md");
        if (!Q) continue;
        let Z = await dp6(H, Q, q, K, Y, z, G, J);
        $.push(Z);
    }
    return $;
}

// READABLE (for understanding):
async function loadCommandsFromDir(dirPath, pluginName, pluginSource, manifest, pluginPath, options, seenFiles) {
    let files = await listMarkdownFiles(dirPath);
    let commands = [];

    if (!files) return commands;

    for (let filePath of files) {
        // Deduplication by realpath (handles symlinks)
        if (seenFiles.has(filePath)) continue;
        seenFiles.add(filePath);

        // Read and parse the markdown file
        let content = await readFile(filePath);
        let frontmatter = parseFrontmatter(content);

        // Determine command name
        // Priority: frontmatter["command-name"] > frontmatter.name > filename (without .md)
        let commandName = frontmatter["command-name"] || frontmatter.name || path.basename(filePath, ".md");
        if (!commandName) continue;

        // Create the command object
        let commandObj = await createCommandObject(
            filePath, commandName, pluginName, pluginSource,
            manifest, pluginPath, options, content, frontmatter
        );
        commands.push(commandObj);
    }
    return commands;
}

// Mapping: m_4→loadCommandsFromDir, A→dirPath, q→pluginName, K→pluginSource,
//   Y→manifest, z→pluginPath, _→options, w→seenFiles, auY→listMarkdownFiles,
//   F17→readFile, hK→parseFrontmatter, l9→path.basename, dp6→createCommandObject
```

### `loadSkillsFromDir` (B_4) - Skill Directory Scanner

**What it does:** Scans a directory for skill definition files (SKILL.md files with frontmatter).

```javascript
// ============================================
// loadSkillsFromDir - Scan directory for SKILL.md files
// Location: chunks.94.mjs:522-580
// ============================================

// ORIGINAL (for source lookup):
async function B_4(A, q, K, Y, z, _, w) {
    let O = await auY(A), $ = [];
    if (!O) return $;
    for (let H of O) {
        // Only process SKILL.md files (different from commands which process all .md)
        if (!jV8(H)) continue;  // jV8 = isSkillFile (checks for SKILL.md)
        if (w.has(H)) continue;
        w.add(H);
        let G = await F17(H), J = hK(G), Q = J["skill-name"] || J.name || l9(l9(H), ".md");
        if (!Q) continue;
        let Z = await dp6(H, Q, q, K, Y, z, { ..._, isSkillMode: true }, G, J);
        $.push(Z);
    }
    return $;
}

// READABLE (for understanding):
async function loadSkillsFromDir(dirPath, pluginName, pluginSource, manifest, pluginPath, options, seenFiles) {
    let files = await listMarkdownFiles(dirPath);
    let skills = [];

    if (!files) return skills;

    for (let filePath of files) {
        // Skills only: filter for SKILL.md files
        if (!isSkillFile(filePath)) continue;  // Must be SKILL.md
        if (seenFiles.has(filePath)) continue;
        seenFiles.add(filePath);

        let content = await readFile(filePath);
        let frontmatter = parseFrontmatter(content);

        let skillName = frontmatter["skill-name"] || frontmatter.name || path.basename(path.dirname(filePath));
        if (!skillName) continue;

        // Create skill object with isSkillMode: true
        let skillObj = await createCommandObject(
            filePath, skillName, pluginName, pluginSource,
            manifest, pluginPath, { ...options, isSkillMode: true }, content, frontmatter
        );
        skills.push(skillObj);
    }
    return skills;
}

// Mapping: B_4→loadSkillsFromDir, jV8→isSkillFile, dp6→createCommandObject
```

**Key difference from commands:**
- Skills only process files named `SKILL.md`
- Skills pass `isSkillMode: true` to createCommandObject
- Skills can appear in system reminders with `(from plugin-name)` attribution

### `createCommandObject` (dp6) - Object Factory

**What it does:** Creates a unified command/skill object from a parsed markdown file.

```javascript
// ============================================
// createCommandObject - Factory for command/skill objects
// Location: chunks.94.mjs:420-468
// ============================================

// ORIGINAL (for source lookup):
async function dp6(A, q, K, Y, z, _, w, O, H) {
    let G = _.isSkillMode ? "skill" : "command",
        J = w.isSkillMode ? `${K}:${q}` : q;  // Namespace skill names
    return {
        type: "prompt",
        name: J,
        source: "plugin",
        description: H.description || "",
        acceptsArgs: H["accepts-args"] || H.acceptsArgs || !1,
        userFacingName: q,
        displayName: q,
        pluginInfo: { pluginManifest: Y, repository: z },
        systemPrompt: S7(O),  // Extract content after frontmatter
        allowedTools: H["allowed-tools"] || H.allowedTools,
        frontmatter: H,
        filePath: A,
        loadedFrom: "plugin",
        getPromptForCommand: (Q) => iY4(O, Q)  // Interpolate arguments
    };
}

// READABLE (for understanding):
async function createCommandObject(filePath, name, pluginName, pluginSource, manifest, pluginPath, options, content, frontmatter) {
    let type = options.isSkillMode ? "skill" : "command";

    // Skill names are namespaced: "plugin-name:skill-name"
    // Command names are NOT namespaced at this level (handled by caller)
    let fullName = options.isSkillMode ? `${pluginName}:${name}` : name;

    return {
        type: "prompt",                    // Both commands and skills are prompt-based
        name: fullName,                    // Unique identifier
        source: "plugin",                  // Marks as plugin-contributed
        description: frontmatter.description || "",
        acceptsArgs: frontmatter["accepts-args"] || frontmatter.acceptsArgs || false,
        userFacingName: name,              // Display name without prefix
        displayName: name,                 // For UI display
        pluginInfo: {
            pluginManifest: manifest,
            repository: pluginPath
        },
        systemPrompt: extractContentAfterFrontmatter(content),
        allowedTools: frontmatter["allowed-tools"] || frontmatter.allowedTools,
        frontmatter: frontmatter,
        filePath: filePath,
        loadedFrom: "plugin",              // For system reminder attribution

        // Function to interpolate arguments into the prompt
        getPromptForCommand: (args) => interpolateArguments(content, args)
    };
}

// Mapping: dp6→createCommandObject, A→filePath, q→name, K→pluginName,
//   Y→manifest, z→pluginPath, _→options, w→options (alias),
//   O→content, H→frontmatter, S7→extractContentAfterFrontmatter,
//   iY4→interpolateArguments
```

**Key properties:**
- `type: "prompt"` - Both commands and skills use prompt-based execution
- `source: "plugin"` - Distinguishes from built-in commands
- `loadedFrom: "plugin"` - Used for system reminder attribution
- `getPromptForCommand()` - Returns rendered prompt with argument substitution

### Frontmatter Parsing

Both commands and skills use YAML frontmatter for metadata:

```javascript
// ============================================
// parseFrontmatter - Extract YAML frontmatter from markdown
// Location: chunks.94.mjs (utility)
// ============================================

function parseFrontmatter(content) {
    let match = content.match(/^---\n([\s\S]*?)\n---/);
    if (!match) return {};

    try {
        return yaml.parse(match[1]);
    } catch (e) {
        return {};  // Invalid YAML - return empty object
    }
}

// Supported frontmatter fields:
// - name / command-name / skill-name: The identifier
// - description: Short description for help text
// - allowed-tools: Array of tool names this command can use
// - accepts-args: Boolean, whether the command accepts arguments
// - requires-confirmation: Boolean, ask user before executing
```

---

## `createCommandObject` (dp6) - Unified Object Factory

**What it does:** Creates a unified command/skill object from a parsed markdown file, regardless of whether it's a command or skill.

**Key properties:**
- `type: "prompt"` - Both commands and skills use prompt-based execution
- `source: "plugin"` - Marks as plugin-contributed (not built-in)
- `pluginInfo: { pluginManifest, repository }` - Plugin attribution
- `getPromptForCommand()` - Returns the rendered prompt text with argument substitution

**Why unified:** Both commands and skills share the same execution path (Skill tool or slash command handler). The `createCommandObject` function ensures consistent object shape regardless of which category the file falls into.

---

## Source Code: getPluginCommands and getPluginSkills

### getPluginCommands (w96) - Command Loader

```javascript
// ============================================
// getPluginCommands - Load all slash commands from enabled plugins
// Location: chunks.94.mjs:582-706
// ============================================

// ORIGINAL (for source lookup):
w96 = e1(async () => {
    let { enabled: A, errors: q } = await _z();
    if (q.length > 0) k(`Plugin loading errors: ${q.map((z)=>sM(z)).join(", ")}`);
    let Y = (await Promise.all(A.map(async (z) => {
        let _ = new Set, w = [];
        if (z.commandsPath) try {
            let O = await m_4(z.commandsPath, z.name, z.source, z.manifest, z.path, { isSkillMode: !1 }, _);
            if (w.push(...O), O.length > 0) k(`Loaded ${O.length} commands from plugin ${z.name}`)
        } catch (O) { /* error handling */ }
        if (z.commandsPaths) {
            // Load from custom paths...
        }
        if (z.commandsMetadata) {
            // Load inline content commands...
        }
        return w
    }))).flat();
    return k(`Total plugin commands loaded: ${Y.length}`), Y
});

// READABLE (for understanding):
getPluginCommands = memoize(async () => {
    let { enabled: plugins, errors } = await getLoadedPlugins();
    if (errors.length > 0) {
        debug(`Plugin loading errors: ${errors.map(serializePluginError).join(", ")}`);
    }

    let allCommands = (await Promise.all(plugins.map(async (plugin) => {
        let seenFiles = new Set(), commands = [];

        // Standard commands directory: {plugin}/commands/
        if (plugin.commandsPath) {
            try {
                let loaded = await loadCommandsFromDir(
                    plugin.commandsPath, plugin.name, plugin.source,
                    plugin.manifest, plugin.path, { isSkillMode: false }, seenFiles
                );
                commands.push(...loaded);
            } catch (err) {
                debug(`Failed to load commands: ${err}`, { level: "error" });
            }
        }

        // Additional paths from manifest.commandsPaths
        if (plugin.commandsPaths) {
            for (let cmdPath of plugin.commandsPaths) {
                // Load from each custom path...
            }
        }

        // Inline commands from manifest.commandsMetadata
        if (plugin.commandsMetadata) {
            for (let [name, meta] of Object.entries(plugin.commandsMetadata)) {
                if (meta.content && !meta.source) {
                    // Load inline content command...
                }
            }
        }
        return commands;
    }))).flat();

    debug(`Total plugin commands loaded: ${allCommands.length}`);
    return allCommands;
});

// Mapping: w96→getPluginCommands, e1→memoize, _z→getLoadedPlugins, m_4→loadCommandsFromDir,
//   dp6→createCommandObject, k→debug, sM→serializePluginError
```

### getPluginSkills (hk8) - Skill Loader

```javascript
// ============================================
// getPluginSkills - Load all skills from enabled plugins
// Location: chunks.94.mjs:707-746
// ============================================

// The implementation mirrors getPluginCommands but uses loadSkillsFromDir (B_4)
// and checks skillsPath / skillsPaths fields instead

// Key difference: Skills use SKILL.md convention, commands use any .md file
// Skills have loadedFrom: "plugin" marker for system reminder attribution
```

---

## Integration with Core Systems

### Slash Command System (Module 09)

Plugin commands are merged with built-in commands in the slash command registry:

```
Built-in commands + Plugin commands → Combined registry
    │
    └─ User types /my-plugin:deploy → matches plugin command
           └─ Execute via Skill tool or direct prompt injection
```

**Command naming convention:**
- Built-in: `/help`, `/clear`, `/compact`
- Plugin: `/my-plugin:deploy`, `/my-plugin:code-review`
- The colon separator prevents naming conflicts

**Name resolution flow:**
1. User types `/deploy`
2. System checks for exact match in built-in commands
3. If not found, searches plugin commands with prefix matching
4. Returns closest match or shows suggestions

### Skill System (Module 10)

Plugin skills are merged with built-in skills:

```
Built-in skills + Plugin skills → Skill registry
    │
    └─ Agent invokes Skill tool with name "my-plugin:code-review"
           └─ Executes skill's SKILL.md prompt content
```

**Skill invocation flow:**
1. LLM decides to use Skill tool with skill name
2. Skill tool looks up skill definition in registry
3. If skill has `loadedFrom: "plugin"`, log plugin attribution
4. Execute skill prompt with argument interpolation

### System Reminder Integration (Module 04)

Plugin skills appear in the skill listing attachment sent to the LLM:

```javascript
// In generateSkillListingAttachment:
let pluginSkills = await getPluginSkills();
// pluginSkills have loadedFrom: "plugin" marker for attribution
```

The system reminder shows: `skill-name (from plugin-name): description`

**Discovery flow:**

```
Session Start
    │
    ├─ getPluginSkills (hk8)
    │     │
    │     ├─ loadSkillsFromDir (B_4)
    │     │     │
    │     │     ├─ Scan for SKILL.md files
    │     │     ├─ Parse frontmatter (description, accepts_args)
    │     │     └─ Create skill definition with pluginInfo
    │     │
    │     └─ Returns: [{ name, description, pluginInfo, ... }]
    │
    └─ generateSkillListingAttachment (guY)
          │
          ├─ Merge with built-in skills
          │
          └─ Format for system reminder:
                "Available skills:
                 - plugin-name:skill-name - Description from SKILL.md"
```

**System reminder budget:**
- Skill listings use 2% of context window (SKILL_BUDGET_RATIO = 0.02)
- Maximum fallback budget: 16000 characters
- Plugin skills are included in the same budget as built-in skills

### Skill Discovery Format in System Reminder

When a plugin skill is loaded, the system reminder includes it in the skill listing:

```
When users reference a "slash command" or "/<something>" (e.g., "/commit", "/review-pr"),
they are referring to a skill. Use this tool to invoke it.

Available skills:
- my-plugin:code-review - Review code for security vulnerabilities
- my-plugin:deploy - Deploy the current project to production

You can invoke them with: /my-plugin:code-review, /my-plugin:deploy
```

The `(from plugin-name)` attribution is shown in UI but not in the LLM-facing reminder to save tokens.

### generateSkillListingAttachment Integration

The skill listing attachment sent to the LLM includes plugin skills:

```javascript
// In generateSkillListingAttachment (chunks.147.mjs):
async function generateSkillListingAttachment() {
    let allSkills = await getAllSkills();  // Includes plugin skills
    let pluginSkills = allSkills.filter(s => s.loadedFrom === "plugin");

    // Format for system reminder:
    // skill-name (from plugin-name): description

    return {
        type: "skill_listing",
        content: formattedSkillList
    };
}
```
