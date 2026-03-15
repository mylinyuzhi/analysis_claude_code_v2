# CLI-Slash Command Integration

> How CLI flags control slash command discovery, loading, and execution

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Skill System
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Slash Commands

Key functions in this document:
- `--disable-slash-commands` flag - Disables all skill/slash command functionality
- `getSkills` - Loads skills from directories, plugins, and bundled sources
- `mergeCommands` - Combines command sources into final registry

---

## Overview

The slash command system integrates with CLI through:

1. **Flag Control** - `--disable-slash-commands` to disable all commands
2. **Directory Discovery** - Loading skills from `.claude/skills/` and plugin directories
3. **Priority Resolution** - Built-in vs. skill-based command precedence
4. **Session Context** - Passing command availability to the REPL

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                   CLI → SLASH COMMAND INTEGRATION PIPELINE                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────┐    ┌───────────────────┐    ┌──────────────────┐     │
│  │  CLI Flag        │    │  Skill            │    │  Plugin          │     │
│  │  --disable-      │    │  Directories      │    │  Directories     │     │
│  │  slash-commands  │    │  .claude/skills/  │    │  --plugin-dir    │     │
│  └────────┬─────────┘    └─────────┬─────────┘    └────────┬─────────┘     │
│           │                        │                       │               │
│           │                        └───────────────────────┘               │
│           │                                    │                           │
│           ▼                                    ▼                           │
│  ┌─────────────────────┐          ┌─────────────────────┐                  │
│  │ disableSlashCommands│          │ getSkills()         │                  │
│  │ = true              │          │ chunks.168.mjs      │                  │
│  └──────────┬──────────┘          └──────────┬──────────┘                  │
│             │                                │                             │
│             │                     ┌──────────┴──────────┐                  │
│             │                     │                     │                  │
│             │              ┌─────────────┐       ┌─────────────┐           │
│             │              │ skillDir    │       │ bundled     │           │
│             │              │ Commands    │       │ Skills      │           │
│             │              └─────────────┘       └─────────────┘           │
│             │                     │                     │                  │
│             │                     └──────────┬──────────┘                  │
│             │                                │                             │
│             │                     ┌──────────┴──────────┐                  │
│             │                     │                     │                  │
│             │              ┌─────────────┐       ┌─────────────┐           │
│             │              │ MCP         │       │ Plugin      │           │
│             │              │ Commands    │       │ Skills      │           │
│             │              └─────────────┘       └─────────────┘           │
│             │                     │                     │                  │
│             │                     └──────────┬──────────┘                  │
│             │                                │                             │
│             └────────────────────────────────┤                             │
│                                              │                             │
│                                              ▼                             │
│                               ┌─────────────────────────┐                  │
│                               │ Final Command Registry  │                  │
│                               │                         │                  │
│                               │ if (disableSlashCommands)│                 │
│                               │   return []             │                  │
│                               │ else                    │                  │
│                               │   return mergedCommands │                  │
│                               └─────────────────────────┘                  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. CLI Flag: --disable-slash-commands

### 1.1 Flag Definition

**Source location:** `chunks.197.mjs:1027`

```javascript
// ============================================
// --disable-slash-commands flag definition
// Location: chunks.197.mjs:1027
// ============================================

// ORIGINAL (for source lookup):
.option("--disable-slash-commands", "Disable all skills", () => !0)

// READABLE (for understanding):
.option("--disable-slash-commands",
    "Disable all skills",
    () => true)  // Parser: always returns true when flag is present

// Mapping: Flag value stored in options.disableSlashCommands
```

### 1.2 Flag Extraction

**Source location:** `chunks.197.mjs:1054`

```javascript
// ============================================
// disableSlashCommands flag extraction
// Location: chunks.197.mjs:1054
// ============================================

// ORIGINAL (for source lookup):
let r = H.disableSlashCommands || !1

// READABLE (for understanding):
let disableSlashCommands = options.disableSlashCommands || false;

// Mapping: r→disableSlashCommands, H→options
```

### 1.3 Propagation to REPL

**Source location:** `chunks.197.mjs:1702`

```javascript
// ============================================
// disableSlashCommands passed to REPL component
// Location: chunks.197.mjs:1702
// ============================================

// ORIGINAL (for source lookup):
disableSlashCommands: r,

// READABLE (for understanding):
// Passed as prop to REPL component
<REPL
    disableSlashCommands={disableSlashCommands}
    // ... other props
/>

// Mapping: r→disableSlashCommands
```

---

## 2. Skill Discovery at Startup

### 2.1 getSkills Function

**Source location:** `chunks.168.mjs:2126-2132`

```javascript
// ============================================
// getSkills - Load skills from all sources
// Location: chunks.168.mjs:2126-2132
// ============================================

// ORIGINAL (for source lookup):
let [{
    skillDirCommands: q,
    pluginSkills: K,
    bundledSkills: Y
}, z, w] = await Promise.all([
    x1(),
    cZ(o1),
    TB1(o1)
]),
// ... later ...
return {
    skillDirCommands: q,
    pluginSkills: K,
    bundledSkills: Y
}

// On error:
return {
    skillDirCommands: [],
    pluginSkills: [],
    bundledSkills: []
}

// READABLE (for understanding):
async function getSkills() {
    try {
        // Load all skill sources in parallel
        let [
            { skillDirCommands, pluginSkills, bundledSkills },
            mcpCommands,
            externalCommands
        ] = await Promise.all([
            loadProjectSkills(),       // From .claude/skills/
            loadMcpCommands(),         // From MCP servers
            loadExternalCommands()     // From external sources
        ]);

        return {
            skillDirCommands,   // Skills from .claude/skills/ directory
            pluginSkills,       // Skills from plugin directories
            bundledSkills       // Built-in skills (commit, review-pr, etc.)
        };
    } catch (error) {
        // Return empty on error
        return {
            skillDirCommands: [],
            pluginSkills: [],
            bundledSkills: []
        };
    }
}

// Mapping: q→skillDirCommands, K→pluginSkills, Y→bundledSkills,
//          x1→loadProjectSkills, cZ→loadMcpCommands, TB1→loadExternalCommands
```

### 2.2 Skill Directory Discovery

**Source location:** `chunks.168.mjs:2294` (referenced)

```javascript
// ============================================
// Skill directory discovery
// Location: chunks.168.mjs (skill loading)
// ============================================

// READABLE (for understanding):
async function loadProjectSkills() {
    // Standard skill directories:
    // 1. ~/.claude/skills/        (user-level skills)
    // 2. .claude/skills/          (project-level skills)
    // 3. --plugin-dir paths       (CLI-specified plugins)

    let skillDirectories = [
        getUserSkillsDir(),      // ~/.claude/skills/
        getProjectSkillsDir(),   // .claude/skills/
        ...pluginDirs            // From --plugin-dir flag
    ];

    let skillDirCommands = [];
    let pluginSkills = [];
    let bundledSkills = [];

    for (let dir of skillDirectories) {
        if (fs.existsSync(dir)) {
            let skills = await loadSkillsFromDir(dir);
            if (dir.fromPlugin) {
                pluginSkills.push(...skills);
            } else {
                skillDirCommands.push(...skills);
            }
        }
    }

    // Load bundled skills (built into Claude Code)
    bundledSkills = loadBundledSkills();

    return { skillDirCommands, pluginSkills, bundledSkills };
}
```

---

## 3. Command Merging and Priority

### 3.1 Command Source Priority

**Source location:** `chunks.168.mjs` (merge logic)

```javascript
// ============================================
// Command merging with priority
// Location: chunks.168.mjs
// ============================================

// READABLE (for understanding):
function mergeAllCommands(skills, mcpCommands, externalCommands, builtins) {
    // Priority order (later overrides earlier):
    // 1. bundledSkills      - Built-in skills (lowest priority)
    // 2. skillDirCommands   - From .claude/skills/
    // 3. userCommands       - User-defined commands
    // 4. pluginSkills       - From plugin directories
    // 5. dynamicSkills      - Dynamically discovered
    // 6. builtins           - Hardcoded commands (highest priority)

    let { skillDirCommands, pluginSkills, bundledSkills } = skills;

    return [
        ...bundledSkills,       // /commit, /review-pr, etc.
        ...skillDirCommands,    // Project skills
        ...mcpCommands,         // MCP-provided commands
        ...pluginSkills,        // Plugin skills
        ...externalCommands,    // External commands
        ...getBuiltinCommands() // /help, /clear, /compact, etc.
    ];
}
```

### 3.2 Built-in Commands

```javascript
// ============================================
// Built-in slash commands
// ============================================

// READABLE (for understanding):
const BUILTIN_COMMANDS = [
    { name: "help",     description: "Show help",        handler: showHelp },
    { name: "clear",    description: "Clear screen",     handler: clearScreen },
    { name: "compact",  description: "Compact context",  handler: compactContext },
    { name: "config",   description: "Open config",      handler: openConfig },
    { name: "cost",     description: "Show cost stats",  handler: showCost },
    { name: "doctor",   description: "Run diagnostics",  handler: runDoctor },
    { name: "init",     description: "Initialize",       handler: runInit },
    { name: "login",    description: "Login to Claude",  handler: doLogin },
    { name: "logout",   description: "Logout",           handler: doLogout },
    { name: "memory",   description: "Manage memory",    handler: manageMemory },
    { name: "permissions", description: "Manage permissions", handler: managePerms },
    { name: "pr-comments", description: "View PR comments", handler: viewPrComments },
    { name: "review",   description: "Review PR",        handler: reviewPr },
    { name: "status",   description: "Show status",      handler: showStatus },
    { name: "terminal-setup", description: "Setup terminal", handler: terminalSetup },
    { name: "theme",    description: "Set theme",        handler: setTheme },
    { name: "vim",      description: "Toggle vim mode",  handler: toggleVim },
    { name: "bug",      description: "Report bug",       handler: reportBug },
    { name: "color",    description: "Toggle color output", handler: toggleColor },
    { name: "effort",   description: "Set effort level", handler: setEffort },
];
```

### 3.3 Bundled Skills (Skills Directory)

```javascript
// ============================================
// Bundled skills (built into Claude Code)
// ============================================

// READABLE (for understanding):
const BUNDLED_SKILLS = [
    {
        name: "commit",
        description: "Create a git commit",
        prompt: "Create a git commit with the current changes...",
        file: "skills/commit/SKILL.md"
    },
    {
        name: "review-pr",
        description: "Review a pull request",
        prompt: "Review the pull request...",
        file: "skills/review-pr/SKILL.md"
    },
    {
        name: "pdf",
        description: "Process PDF files",
        prompt: "Extract and analyze PDF content...",
        file: "skills/pdf/SKILL.md"
    }
];
```

---

## 4. REPL Integration

### 4.1 Command Props to REPL

**Source location:** `chunks.196.mjs:22`

```javascript
// ============================================
// REPL component props for slash commands
// Location: chunks.196.mjs:22
// ============================================

// ORIGINAL (for source lookup):
disableSlashCommands: f = !1,

// READABLE (for understanding):
function REPL({
    // ... other props
    disableSlashCommands = false,
    // ... other props
}) {
    // Component implementation
}

// Mapping: f→disableSlashCommands
```

### 4.2 Command Filtering in REPL

**Source location:** `chunks.196.mjs:1644`

```javascript
// ============================================
// Command filtering in REPL
// Location: chunks.196.mjs:1644
// ============================================

// ORIGINAL (for source lookup):
let RA = useMemo(() => f ? [] : V4, [f, V4]);

// READABLE (for understanding):
// In the REPL component:
let enabledCommands = useMemo(() => {
    if (disableSlashCommands) {
        return [];  // Return empty array when disabled
    }
    return allCommands;  // Return full command list
}, [disableSlashCommands, allCommands]);

// Mapping: RA→enabledCommands, f→disableSlashCommands, V4→allCommands
```

### 4.3 Effect on Autocomplete

When `disableSlashCommands` is true:

1. **No autocomplete** - `/` doesn't trigger command suggestions
2. **No command resolution** - Typing `/commit` won't invoke the skill
3. **Empty registry** - `enabledCommands = []`

---

## 5. Plugin Directory Integration

### 5.1 --plugin-dir Flag

**Source location:** `chunks.197.mjs:1019`

```javascript
// ============================================
// --plugin-dir flag definition
// Location: chunks.197.mjs:1019
// ============================================

// ORIGINAL (for source lookup):
.option("--plugin-dir <paths...>", "Load plugins from directories for this session only (repeatable)")

// READABLE (for understanding):
.option("--plugin-dir <paths...>",
    "Load plugins from directories for this session only (repeatable)")
```

### 5.2 Plugin Directory Processing

**Source location:** `chunks.197.mjs:1050`

```javascript
// ============================================
// Plugin directory processing
// Location: chunks.197.mjs:1050
// ============================================

// ORIGINAL (for source lookup):
if (k.length > 0) lL6(k), Sv();

// READABLE (for understanding):
if (pluginDirs.length > 0) {
    setPluginDirectories(pluginDirs);
    refreshPlugins();
}

// Mapping: k→pluginDirs, lL6→setPluginDirectories, Sv→refreshPlugins
```

### 5.3 Plugin Loading Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    PLUGIN LOADING FLOW                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  CLI Entry                                                                   │
│  │                                                                          │
│  ├─► Parse --plugin-dir flag                                                │
│  │                                                                          │
│  ├─► setPluginDirectories(pluginDirs)                                       │
│  │   │                                                                      │
│  │   └─► Store paths in global plugin registry                              │
│  │                                                                          │
│  ├─► refreshPlugins()                                                       │
│  │   │                                                                      │
│  │   └─► Trigger plugin discovery                                           │
│  │                                                                          │
│  ├─► getSkills() called during session setup                                │
│  │   │                                                                      │
│  │   ├─► loadProjectSkills()                                                │
│  │   │   │                                                                  │
│  │   │   ├─► Load from ~/.claude/skills/ (user skills)                      │
│  │   │   ├─► Load from .claude/skills/ (project skills)                     │
│  │   │   └─► Load from --plugin-dir paths (plugin skills)                   │
│  │   │                                                                      │
│  │   └─► Return { skillDirCommands, pluginSkills, bundledSkills }           │
│  │                                                                          │
│  └─► Merge all command sources                                              │
│       │                                                                      │
│       └─► Pass to REPL component                                             │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Key design decision: Session-only plugin loading**

The `--plugin-dir` flag loads plugins for the current session only:
- Plugins are NOT persisted across sessions
- Allows testing plugins without modifying config
- Useful for CI/CD pipelines with custom skills

---

## 6. Session Context Flow

### 6.1 Command Loading Timeline

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    COMMAND LOADING TIMELINE                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  CLI Entry (chunks.197.mjs)                                                 │
│  │                                                                          │
│  ├─► Parse --disable-slash-commands                                        │
│  │                                                                          │
│  ├─► Parse --plugin-dir paths                                              │
│  │                                                                          │
│  ├─► Call getSkills()                                                      │
│  │   │                                                                      │
│  │   ├─► loadProjectSkills() → skillDirCommands                            │
│  │   ├─► loadPluginSkills() → pluginSkills                                 │
│  │   └─► loadBundledSkills() → bundledSkills                               │
│  │                                                                          │
│  ├─► Call loadMcpCommands() → mcpCommands                                  │
│  │                                                                          │
│  ├─► Merge all command sources                                             │
│  │                                                                          │
│  ├─► Apply disableSlashCommands gate                                       │
│  │   │                                                                      │
│  │   └─► if (disableSlashCommands) return []                               │
│  │                                                                          │
│  └─► Pass to REPL component                                                 │
│      │                                                                      │
│      └─► <REPL commands={mergedCommands} ... />                            │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 6.2 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    COMMAND DATA FLOW                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌────────────────┐                                                         │
│  │ CLI Flags      │                                                         │
│  │ - disableSlash │                                                         │
│  │ - pluginDir    │                                                         │
│  └───────┬────────┘                                                         │
│          │                                                                  │
│          ▼                                                                  │
│  ┌────────────────┐     ┌────────────────┐     ┌────────────────┐          │
│  │ .claude/skills │     │ Plugin Dirs    │     │ Bundled Skills │          │
│  │ (project)      │     │ (--plugin-dir) │     │ (built-in)     │          │
│  └───────┬────────┘     └───────┬────────┘     └───────┬────────┘          │
│          │                      │                      │                   │
│          ▼                      ▼                      ▼                   │
│  ┌────────────────┐     ┌────────────────┐     ┌────────────────┐          │
│  │ skillDir       │     │ pluginSkills   │     │ bundledSkills  │          │
│  │ Commands       │     │                │     │                │          │
│  └───────┬────────┘     └───────┬────────┘     └───────┬────────┘          │
│          │                      │                      │                   │
│          └──────────────────────┼──────────────────────┘                   │
│                                 │                                          │
│                                 ▼                                          │
│                    ┌────────────────────────┐                              │
│                    │ Merge + Deduplicate    │                              │
│                    │ by command name        │                              │
│                    └───────────┬────────────┘                              │
│                                │                                           │
│                    ┌───────────┴────────────┐                              │
│                    │                        │                              │
│             disableSlashCommands?     enableSlashCommands                   │
│                    │                        │                              │
│                    ▼                        ▼                              │
│             ┌────────────┐          ┌────────────┐                         │
│             │ []         │          │ Merged     │                         │
│             │ (empty)    │          │ Commands   │                         │
│             └────────────┘          └────────────┘                         │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 7. Use Cases

### 7.1 Disabling All Commands

**Scenario:** Running Claude Code in a restricted/embedded context

```bash
claude --disable-slash-commands -p "analyze this code"
```

**Effect:**
- No `/` command suggestions
- No skill invocation
- Cleaner output for integration

### 7.2 Loading Custom Skills

**Scenario:** Loading skills from a custom directory

```bash
claude --plugin-dir /path/to/custom/skills
```

**Effect:**
- Skills from `/path/to/custom/skills` loaded
- Merged with project skills
- Available as `/skillname` commands

### 7.3 Combined Usage

**Scenario:** Running with custom skills but disabling built-in

```bash
claude --plugin-dir ./my-skills --disable-slash-commands
```

**Effect:**
- Plugin directory loaded (but...)
- `--disable-slash-commands` wins
- No commands available

---

## 8. Key Integration Points Summary

| Integration Point | Location | Description |
|-------------------|----------|-------------|
| Flag definition | `chunks.197.mjs:1027` | `--disable-slash-commands` |
| Flag extraction | `chunks.197.mjs:1054` | `disableSlashCommands` variable |
| Plugin dir flag | `chunks.197.mjs:1019` | `--plugin-dir` |
| Plugin processing | `chunks.197.mjs:1050` | Set and refresh plugins |
| Skill loading | `chunks.168.mjs:2126` | `getSkills()` |
| Command merge | `chunks.168.mjs` | Merge all sources |
| REPL prop | `chunks.197.mjs:1702` | Pass to component |
| REPL filter | `chunks.196.mjs:1644` | Apply disable gate |
| Component prop | `chunks.196.mjs:22` | `disableSlashCommands` prop |
