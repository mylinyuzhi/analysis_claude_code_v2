# Plugin Skills and Commands Integration (Claude Code 2.1.38)

> Deep analysis of how plugins contribute skills and slash commands,
> including loading mechanisms, discovery patterns, and object creation.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `getPluginCommands` (YK1) - Load all slash commands from enabled plugins
- `getPluginSkills` (B0A) - Load all skills from enabled plugins
- `loadCommandsFromDir` (TU7) - Load commands from a plugin directory
- `loadSkillsFromDir` (vU7) - Load skills from a plugin directory
- `createCommandObject` (uu1) - Create command/skill object from parsed file
- `loadPluginManifest` (Pn4) - Discover plugin components including commands/skills

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
    │    getPluginCommands (YK1)  │   │    getPluginSkills (B0A)    │
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
    ┌─────────────────────────────┐   │  loadSkillsFromDir (vU7)    │
    │  loadCommandsFromDir (TU7)  │   │  - Look for SKILL.md in dir  │
    │  - Scan for .md files       │   │  - Or SKILL.md in subdirs    │
    │  - Parse frontmatter        │   │  - isSkillMode: true         │
    └─────────────────────────────┘   └─────────────────────────────┘
                    │                                 │
                    └───────────────┬─────────────────┘
                                    ▼
                    ┌──────────────────────────────────┐
                    │  createCommandObject (uu1)       │
                    │  Creates unified object with:    │
                    │  - type: "prompt"                │
                    │  - source: "plugin"              │
                    │  - pluginInfo: {...}             │
                    │  - getPromptForCommand()         │
                    └──────────────────────────────────┘
```

---

## Commands Loading: getPluginCommands (YK1)

### What it does

Loads all slash commands from all enabled plugins, returning a memoized array of command objects.

### How it works

```javascript
// ============================================
// getPluginCommands - Load all plugin commands
// Location: chunks.87.mjs:2039-2156
// ============================================

// ORIGINAL (for source lookup):
YK1 = KA(async () => {
    let { enabled: A, errors: q } = await iY(), K = [];
    if (q.length > 0) h(`Plugin loading errors: ${q.map((Y)=>TZ(Y)).join(", ")}`);
    for (let Y of A) {
        let z = new Set;
        if (Y.commandsPath) try {
            let w = await TU7(Y.commandsPath, Y.name, Y.source, Y.manifest, Y.path, {
                isSkillMode: !1
            }, z);
            if (K.push(...w), w.length > 0) h(`Loaded ${w.length} commands from plugin ${Y.name} default directory`)
        } catch (w) { /* error handling */ }
        if (Y.commandsPaths) {
            for (let w of Y.commandsPaths) try {
                let H = b1(), $ = H.statSync(w);
                if ($.isDirectory()) {
                    let O = await TU7(w, Y.name, Y.source, Y.manifest, Y.path, {
                        isSkillMode: !1
                    }, z);
                    K.push(...O);
                } else if ($.isFile() && w.endsWith(".md")) {
                    // Single file command - parse and create
                    let O = H.readFileSync(w, { encoding: "utf-8" }),
                        { frontmatter: _, content: J } = yD(O, w),
                        X = `${Y.name}:${Lj1(w).replace(/\.md$/,"")}`,
                        D = uu1(X, { filePath: w, baseDir: Qa(w), frontmatter: _, content: J },
                               Y.source, Y.manifest, Y.path, !1);
                    if (D) K.push(D);
                }
            } catch (H) { /* error handling */ }
        }
        if (Y.commandsMetadata) {
            // Inline content commands (no file)
            for (let [w, H] of Object.entries(Y.commandsMetadata))
                if (H.content && !H.source) try {
                    let { frontmatter: $, content: O } = yD(H.content, `<inline:${Y.name}:${w}>`),
                        _ = `${Y.name}:${w}`,
                        J = uu1(_, { filePath: `<inline:${_}>`, baseDir: Y.path,
                                   frontmatter: { ...$, ...H.description && { description: H.description } },
                                   content: O }, Y.source, Y.manifest, Y.path, !1);
                    if (J) K.push(J);
                } catch ($) { /* error handling */ }
        }
    }
    return h(`Total plugin commands loaded: ${K.length}`), K
});

// READABLE (for understanding):
getPluginCommands = memoize(async () => {
    let { enabled: plugins, errors } = await getLoadedPlugins();
    let commands = [];

    if (errors.length > 0) {
        debug(`Plugin loading errors: ${errors.map(e => serializeError(e)).join(", ")}`);
    }

    for (let plugin of plugins) {
        let seenFiles = new Set();  // Deduplication tracker

        // 1. Load from default commands directory
        if (plugin.commandsPath) {
            try {
                let cmds = await loadCommandsFromDir(
                    plugin.commandsPath, plugin.name, plugin.source,
                    plugin.manifest, plugin.path, { isSkillMode: false }, seenFiles
                );
                commands.push(...cmds);
            } catch (err) {
                debug(`Failed to load commands from ${plugin.name}: ${err}`, { level: "error" });
            }
        }

        // 2. Load from custom command paths (from manifest.commandsPaths)
        if (plugin.commandsPaths) {
            for (let cmdPath of plugin.commandsPaths) {
                let stats = fs.statSync(cmdPath);
                if (stats.isDirectory()) {
                    let cmds = await loadCommandsFromDir(cmdPath, ...);
                    commands.push(...cmds);
                } else if (stats.isFile() && cmdPath.endsWith(".md")) {
                    // Single file command
                    let content = fs.readFileSync(cmdPath, { encoding: "utf-8" });
                    let { frontmatter, content: body } = parseMarkdownWithFrontmatter(content, cmdPath);
                    let cmdName = `${plugin.name}:${path.basename(cmdPath).replace(/\.md$/, "")}`;
                    let cmd = createCommandObject(cmdName, { filePath: cmdPath, frontmatter, content: body },
                                                  plugin.source, plugin.manifest, plugin.path, false);
                    if (cmd) commands.push(cmd);
                }
            }
        }

        // 3. Load inline content commands (from manifest.commands with content field)
        if (plugin.commandsMetadata) {
            for (let [cmdKey, cmdConfig] of Object.entries(plugin.commandsMetadata)) {
                if (cmdConfig.content && !cmdConfig.source) {
                    let { frontmatter, content } = parseMarkdownWithFrontmatter(cmdConfig.content);
                    let cmdName = `${plugin.name}:${cmdKey}`;
                    let cmd = createCommandObject(cmdName, { ... }, ...);
                    if (cmd) commands.push(cmd);
                }
            }
        }
    }

    debug(`Total plugin commands loaded: ${commands.length}`);
    return commands;
});

// Mapping: YK1→getPluginCommands, KA→memoize, iY→getLoadedPlugins, TU7→loadCommandsFromDir,
//   uu1→createCommandObject, b1→getFs, yD→parseMarkdownWithFrontmatter, Lj1→path.basename,
//   Qa→path.dirname, h→debug, TZ→serializeError
```

### Three Loading Sources for Commands

| Source | Field | Description |
|--------|-------|-------------|
| Default directory | `commandsPath` | Auto-discovered `{pluginDir}/commands/` |
| Custom paths | `commandsPaths` | Explicit paths from manifest `commands: [...]` |
| Inline content | `commandsMetadata` | Content defined directly in manifest |

**Why three sources:**
- **Default directory** - Convention over configuration, works for most plugins
- **Custom paths** - For plugins with non-standard directory structures
- **Inline content** - Marketplace can inject commands without files (e.g., from marketplace.json)

---

## Skills Loading: getPluginSkills (B0A)

### What it does

Loads all skills from enabled plugins. Skills differ from commands in that they're primarily agent-activated (not user-invoked via slash).

### How it works

```javascript
// ============================================
// getPluginSkills - Load all plugin skills
// Location: chunks.87.mjs:2157-2191
// ============================================

// ORIGINAL (for source lookup):
B0A = KA(async () => {
    let { enabled: A, errors: q } = await iY(), K = [];
    if (q.length > 0) h(`Plugin loading errors: ${q.map((Y)=>TZ(Y)).join(", ")}`);
    h(`getPluginSkills: Processing ${A.length} enabled plugins`);
    for (let Y of A) {
        let z = new Set;
        if (Y.skillsPath) {
            h(`Attempting to load skills from plugin ${Y.name} default skillsPath: ${Y.skillsPath}`);
            try {
                let w = await vU7(Y.skillsPath, Y.name, Y.source, Y.manifest, Y.path, z);
                K.push(...w), h(`Loaded ${w.length} skills from plugin ${Y.name} default directory`)
            } catch (w) {
                h(`Failed to load skills from plugin ${Y.name} default directory: ${w}`, { level: "error" })
            }
        }
        if (Y.skillsPaths) {
            for (let w of Y.skillsPaths) try {
                let H = await vU7(w, Y.name, Y.source, Y.manifest, Y.path, z);
                K.push(...H), h(`Loaded ${H.length} skills from plugin ${Y.name} custom path: ${w}`)
            } catch (H) { /* error handling */ }
        }
    }
    return h(`Total plugin skills loaded: ${K.length}`), K
});

// READABLE (for understanding):
getPluginSkills = memoize(async () => {
    let { enabled: plugins, errors } = await getLoadedPlugins();
    let skills = [];

    debug(`getPluginSkills: Processing ${plugins.length} enabled plugins`);

    for (let plugin of plugins) {
        let seenFiles = new Set();

        // Load from default skills directory
        if (plugin.skillsPath) {
            debug(`Loading skills from ${plugin.name} default path: ${plugin.skillsPath}`);
            try {
                let pluginSkills = await loadSkillsFromDir(
                    plugin.skillsPath, plugin.name, plugin.source,
                    plugin.manifest, plugin.path, seenFiles
                );
                skills.push(...pluginSkills);
            } catch (err) {
                debug(`Failed: ${err}`, { level: "error" });
            }
        }

        // Load from custom skill paths
        if (plugin.skillsPaths) {
            for (let skillPath of plugin.skillsPaths) {
                let pluginSkills = await loadSkillsFromDir(skillPath, ...);
                skills.push(...pluginSkills);
            }
        }
    }

    debug(`Total plugin skills loaded: ${skills.length}`);
    return skills;
});

// Mapping: B0A→getPluginSkills, KA→memoize, iY→getLoadedPlugins, vU7→loadSkillsFromDir,
//   h→debug, TZ→serializeError
```

### Key Difference: skills vs commands

- **Commands**: `isSkillMode: false` in options
- **Skills**: `isSkillMode: true` AND `loadedFrom: "plugin"` marker
- Skills add "Base directory for this skill: X" to prompts

---

## Directory Loading: loadCommandsFromDir (TU7)

### What it does

Scans a directory for `.md` files and creates command objects for each.

### How it works

```javascript
// ============================================
// loadCommandsFromDir - Load commands from a directory
// Location: chunks.87.mjs:1856-1868
// ============================================

// ORIGINAL (for source lookup):
async function TU7(A, q, K, Y, z, w = { isSkillMode: !1 }, H = new Set) {
    let $ = FN9(A, A, H),  // Get all files recursively
        O = QN9($),        // Group by directory
        _ = [];
    for (let J of O) {
        let X = mN9(J.filePath, J.baseDir, q),  // Derive command name
            D = uu1(X, J, K, Y, z, pO6(J.filePath), w);
        if (D) _.push(D)
    }
    return _
}

// READABLE (for understanding):
async function loadCommandsFromDir(
    dirPath,
    pluginName,
    pluginSource,
    pluginManifest,
    pluginPath,
    options = { isSkillMode: false },
    seenFiles = new Set()
) {
    // 1. Recursively find all .md files
    let allFiles = findMarkdownFiles(dirPath, dirPath, seenFiles);

    // 2. Group files by directory (for deduplication)
    let groupedFiles = groupFilesByDirectory(allFiles);

    // 3. Create command object for each file
    let commands = [];
    for (let file of groupedFiles) {
        let commandName = deriveCommandName(file.filePath, file.baseDir, pluginName);
        let cmd = createCommandObject(
            commandName, file, pluginSource, pluginManifest,
            pluginPath, isSkillFile(file.filePath), options
        );
        if (cmd) commands.push(cmd);
    }

    return commands;
}

// Mapping: TU7→loadCommandsFromDir, FN9→findMarkdownFiles, QN9→groupFilesByDirectory,
//   mN9→deriveCommandName, uu1→createCommandObject, pO6→isSkillFile
```

---

## Skills Directory Loading: loadSkillsFromDir (vU7)

### What it does

Loads skills from a directory. Unlike commands, skills look for `SKILL.md` files specifically.

### How it works

```javascript
// ============================================
// loadSkillsFromDir - Load skills from directory
// Location: chunks.87.mjs:1943-2016
// ============================================

// ORIGINAL (for source lookup):
async function vU7(A, q, K, Y, z, w) {
    let H = b1(), $ = [];
    try {
        if (!H.existsSync(A)) return [];
        // Check for SKILL.md directly in this directory
        let O = kj1(A, "SKILL.md");
        if (H.existsSync(O)) {
            if (Rx(H, O, w)) return $;  // Already seen
            try {
                let J = H.readFileSync(O, { encoding: "utf-8" }),
                    { frontmatter: X, content: D } = yD(J, O),
                    j = `${q}:${Lj1(A)}`,  // plugin-name:dirName
                    M = { filePath: O, baseDir: Qa(O), frontmatter: X, content: D },
                    P = uu1(j, M, K, Y, z, !0, { isSkillMode: !0 });
                if (P) $.push(P)
            } catch (J) { /* error */ }
            return $;
        }
        // Otherwise, scan subdirectories for SKILL.md
        let _ = H.readdirSync(A);
        for (let J of _) {
            if (!J.isDirectory() && !J.isSymbolicLink()) continue;
            let X = kj1(A, J.name), D = kj1(X, "SKILL.md");
            if (H.existsSync(D)) {
                if (Rx(H, D, w)) continue;
                try {
                    let j = H.readFileSync(D, { encoding: "utf-8" }),
                        { frontmatter: M, content: P } = yD(j, D),
                        W = `${q}:${J.name}`,  // plugin-name:subdirName
                        G = { filePath: D, baseDir: Qa(D), frontmatter: M, content: P },
                        f = uu1(W, G, K, Y, z, !0, { isSkillMode: !0 });
                    if (f) $.push(f)
                } catch (j) { /* error */ }
            }
        }
    } catch (O) { /* error */ }
    return $
}

// READABLE (for understanding):
async function loadSkillsFromDir(dirPath, pluginName, pluginSource, pluginManifest, pluginPath, seenFiles) {
    let fs = getFs();
    let skills = [];

    if (!fs.existsSync(dirPath)) return [];

    // Pattern 1: SKILL.md directly in the directory
    //    skills/SKILL.md -> plugin-name:skills
    let directSkillFile = path.join(dirPath, "SKILL.md");
    if (fs.existsSync(directSkillFile)) {
        if (isAlreadySeen(fs, directSkillFile, seenFiles)) return skills;

        let content = fs.readFileSync(directSkillFile, { encoding: "utf-8" });
        let { frontmatter, content: body } = parseMarkdownWithFrontmatter(content, directSkillFile);

        let skillName = `${pluginName}:${path.basename(dirPath)}`;  // e.g., "myplugin:skills"
        let skill = createCommandObject(
            skillName,
            { filePath: directSkillFile, baseDir: path.dirname(directSkillFile), frontmatter, content: body },
            pluginSource, pluginManifest, pluginPath, true,  // isSkillFile = true
            { isSkillMode: true }
        );
        if (skill) skills.push(skill);
        return skills;
    }

    // Pattern 2: SKILL.md in subdirectories
    //    skills/code-review/SKILL.md -> plugin-name:code-review
    //    skills/testing/SKILL.md -> plugin-name:testing
    let entries = fs.readdirSync(dirPath, { withFileTypes: true });
    for (let entry of entries) {
        if (!entry.isDirectory() && !entry.isSymbolicLink()) continue;

        let subdirPath = path.join(dirPath, entry.name);
        let skillFile = path.join(subdirPath, "SKILL.md");

        if (fs.existsSync(skillFile)) {
            if (isAlreadySeen(fs, skillFile, seenFiles)) continue;

            let content = fs.readFileSync(skillFile, { encoding: "utf-8" });
            let { frontmatter, content: body } = parseMarkdownWithFrontmatter(content, skillFile);

            let skillName = `${pluginName}:${entry.name}`;  // e.g., "myplugin:code-review"
            let skill = createCommandObject(
                skillName, { ... },
                pluginSource, pluginManifest, pluginPath, true,
                { isSkillMode: true }
            );
            if (skill) skills.push(skill);
        }
    }

    return skills;
}

// Mapping: vU7→loadSkillsFromDir, b1→getFs, kj1→path.join, Lj1→path.basename,
//   Qa→path.dirname, yD→parseMarkdownWithFrontmatter, uu1→createCommandObject,
//   Rx→isAlreadySeen, pO6→isSkillFile
```

### Skill Discovery Patterns

```
skills/
├── SKILL.md              → plugin-name:skills (single skill in root)
└── code-review/
    └── SKILL.md          → plugin-name:code-review
└── testing/
    └── SKILL.md          → plugin-name:testing
```

**Why SKILL.md convention:**
- Clear marker file for skills (vs arbitrary .md files for commands)
- Allows skill-specific frontmatter like `when_to_use`, `user-invocable`
- Enables directory-level configuration

---

## Command Object Creation: createCommandObject (uu1)

### What it does

Creates a unified command/skill object from a parsed Markdown file. Both commands and skills use this function with different options.

### How it works

```javascript
// ============================================
// createCommandObject - Create command/skill object from file
// Location: chunks.87.mjs:1870-1937
// ============================================

// ORIGINAL (for source lookup):
function uu1(A, q, K, Y, z, w, H = { isSkillMode: !1 }) {
    try {
        let { frontmatter: $, content: O } = q,
            _ = $.description ?? vp(O, w ? "Plugin skill" : "Plugin command"),
            J = $["allowed-tools"],
            X = typeof J === "string" ? Iu1(J, z) : Array.isArray(J) ? J.map((B) => typeof B === "string" ? Iu1(B, z) : B) : J,
            D = Vh(X),
            j = $["argument-hint"],
            M = xu1($.arguments),
            P = $.when_to_use,
            W = $.version,
            G = $.name,
            f = $.model === "inherit" ? void 0 : $.model ? t9($.model) : void 0,
            Z = $["disable-model-invocation"],
            N;
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
            pluginInfo: { pluginManifest: Y, repository: K },
            isEnabled: () => !0,
            isHidden: y,
            progressMessage: w || H.isSkillMode ? "loading" : "running",
            userFacingName() { return G || A },
            async getPromptForCommand(B, S) {
                let m = H.isSkillMode ? `Base directory for this skill: ${Qa(q.filePath)}

${O}` : O;
                return m = Ej1(m, B, !0, M), m = Iu1(m, z),
                       m = m.replace(/\$\{CLAUDE_SESSION_ID\}/g, U6()),
                       m = await Ma(m, { ...S, async getAppState() {
                           let b = await S.getAppState();
                           return { ...b, toolPermissionContext: { ...b.toolPermissionContext,
                               alwaysAllowRules: { ...b.toolPermissionContext.alwaysAllowRules, command: D } } }
                       } }, `/${A}`),
                       [{ type: "text", text: m }]
            }
        }
    } catch ($) { return h(`Failed to create command from ${q.filePath}: ${$}`, { level: "error" }), null }
}

// READABLE (for understanding):
function createCommandObject(
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

        // 1. Description: use frontmatter or generate from content
        let description = frontmatter.description ??
            generateDescription(content, isSkillFile ? "Plugin skill" : "Plugin command");

        // 2. Process allowed-tools with shell variable expansion
        let allowedToolsRaw = frontmatter["allowed-tools"];
        let allowedTools = processAllowedTools(allowedToolsRaw, pluginPath);

        // 3. Parse other frontmatter fields
        let argumentHint = frontmatter["argument-hint"];
        let argNames = parseArguments(frontmatter.arguments);
        let whenToUse = frontmatter.when_to_use;
        let version = frontmatter.version;
        let displayName = frontmatter.name;

        // 4. Model resolution
        let model = frontmatter.model === "inherit"
            ? undefined
            : frontmatter.model ? resolveModelConfig(frontmatter.model) : undefined;

        // 5. disable-model-invocation handling (different for skills vs commands)
        let disableModelInvocation = options.isSkillMode
            ? frontmatter["disable-model-invocation"] === undefined
                ? false
                : parseBoolean(frontmatter["disable-model-invocation"])
            : parseBoolean(frontmatter["disable-model-invocation"]);

        // 6. user-invocable determines visibility
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
                // Skills add base directory hint
                let promptText = options.isSkillMode
                    ? `Base directory for this skill: ${getBaseDir(parsedFile.filePath)}

${content}`
                    : content;

                // Apply argument interpolation
                promptText = interpolateArguments(promptText, args, true, argNames);

                // Expand shell variables relative to plugin path
                promptText = expandShellVariables(promptText, pluginPath);

                // Replace session ID placeholder
                promptText = promptText.replace(/\$\{CLAUDE_SESSION_ID\}/g, generateSessionId());

                // Execute shell expansion with permission context
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

// Mapping: uu1→createCommandObject, vp→generateDescription, Iu1→expandShellVariables,
//   Vh→processAllowedTools, xu1→parseArguments, t9→resolveModelConfig, J6→parseBoolean,
//   Ej1→interpolateArguments, Ma→executeShellExpansion, U6→generateSessionId, Qa→getBaseDir
```

### Frontmatter Fields

| Field | Type | Description |
|-------|------|-------------|
| `description` | string | Human-readable description |
| `allowed-tools` | string\|array | Tools the command can use |
| `argument-hint` | string | Hint for argument usage |
| `arguments` | array | Named arguments |
| `when_to_use` | string | When the skill should be used |
| `version` | string | Skill version |
| `name` | string | Display name |
| `model` | string | Model override ("inherit" = use default) |
| `disable-model-invocation` | boolean | Skip LLM call |
| `user-invocable` | boolean | Show in UI for skills |

---

## Component Discovery in Manifest

The `loadPluginManifest` (Pn4) function discovers commands and skills:

```javascript
// ============================================
// Component discovery in loadPluginManifest
// Location: chunks.143.mjs:902-991
// ============================================

// Commands discovery (lines 902-950):
let commandsDir = join(pluginDir, "commands");
if (!manifest.commands && fs.existsSync(commandsDir)) {
    plugin.commandsPath = commandsDir;  // Auto-discover
}
if (manifest.commands) {
    // Two formats supported:
    // Format A: Object with source/content
    //   { "myCmd": { source: "path.md", description: "..." } }
    // Format B: Array of paths
    //   ["commands/cmd1.md", "commands/cmd2.md"]
}

// Skills discovery (lines 972-991):
let skillsDir = join(pluginDir, "skills");
if (!manifest.skills && fs.existsSync(skillsDir)) {
    plugin.skillsPath = skillsDir;  // Auto-discover
}
if (manifest.skills) {
    // Array of paths
    plugin.skillsPaths = resolvedPaths;
}
```

### Manifest Format Examples

```json
{
  "name": "my-plugin",
  "commands": {
    "review": {
      "source": "commands/review.md",
      "description": "Review code changes"
    },
    "test": {
      "content": "# Test\n\nRun tests...",
      "description": "Run tests"
    }
  },
  "skills": ["skills/code-review", "skills/testing"]
}
```

---

## Cache Management

Both loaders are memoized with cache clearing:

```javascript
// Clear commands cache
function dO6() {
    YK1.cache?.clear?.();  // Clear getPluginCommands memo
}

// Clear skills cache
function EU7() {
    B0A.cache?.clear?.();  // Clear getPluginSkills memo
}
```

These are called when plugins are enabled/disabled/updated.

---

## Summary: Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| Three loading sources | Flexibility: convention (default dir), explicit (custom paths), inline (marketplace-defined) |
| Unified createCommandObject | Both commands and skills share the same object structure |
| `loadedFrom: "plugin"` marker | Distinguish plugin skills from user-defined skills |
| `isSkillMode` option | Different default behaviors for skills vs commands |
| SKILL.md convention | Clear marker for skill directories vs command files |
| Memoized loaders | Avoid repeated filesystem scans |
| `seenFiles` deduplication | Prevent loading same file twice from different paths |