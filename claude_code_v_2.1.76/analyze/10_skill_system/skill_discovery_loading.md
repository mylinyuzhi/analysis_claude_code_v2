# Skill Discovery & Loading Flow (Claude Code 2.1.38)

## Overview

This document details the complete skill discovery and loading pipeline from filesystem to registry. Skills are discovered from multiple directory hierarchies, parsed from SKILL.md files, and registered in the command system for both user (slash command) and LLM (Skill tool) invocation.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Skill System section)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations (Slash Commands section)

Key functions in this document:
- `loadSkills` (ukA) - Master loading orchestrator - chunks.134.mjs:2059
- `loadSkillFromDir` (oQ1) - Parse skills from single directory - chunks.134.mjs:1758
- `findSkillDirectories` (TW1) - Discover .claude/skills/ paths - chunks.134.mjs:1945
- `discoverProjectSkills` (vW1) - Dynamic reload from file changes - chunks.134.mjs:1964
- `activateConditionalSkills` (EW1) - Path-based activation - chunks.134.mjs:1996
- `loadPluginSkills` (B0A) - Load skills from plugins - chunks.87.mjs:2157
- `loadLegacyCommands` (vEY) - Backward compat loader - chunks.134.mjs:1873

---

## Directory Hierarchy

### Five-Tier Loading Priority

Skills are loaded from five distinct sources in priority order:

```
┌─────────────────────────────────────────────────────────────────────┐
│ Loading Tier                    │ Source Tag        │ Path Pattern │
├─────────────────────────────────┼───────────────────┼──────────────┤
│ 1. Managed Skills               │ policySettings    │ {app-install}/skills/                 │
│    (Application-installed)      │                   │ ~/.claude/skills/ (resolved)          │
├─────────────────────────────────┼───────────────────┼──────────────┤
│ 2. User Skills                  │ userSettings      │ ~/.claude/skills/                     │
│    (User home directory)        │                   │ (only if userSettings permitted)     │
├─────────────────────────────────┼───────────────────┼──────────────┤
│ 3. Project Skills (explicit)    │ projectSettings   │ {project-root}/.claude/skills/       │
│    (Configured project roots)   │                   │ (only if projectSettings permitted)  │
├─────────────────────────────────┼───────────────────┼──────────────┤
│ 4. Project Skills (CWD climb)   │ projectSettings   │ {cwd-ancestors}/.claude/skills/      │
│    (Directory tree climb)       │                   │ (only if projectSettings permitted)  │
├─────────────────────────────────┼───────────────────┼──────────────┤
│ 5. Legacy Commands              │ (varies)          │ {cwd}/.claude/commands/              │
│    (Deprecated, backward compat)│                   │ (deprecated directory structure)     │
└─────────────────────────────────┴───────────────────┴──────────────┘
```

Plus two additional sources loaded separately:
- **Bundled Skills** - Registered via `registerPromptSkill` (Sj) at initialization
- **Plugin Skills** - Loaded via `loadPluginSkills` (B0A) from installed plugins

### Skill Directory Structure

```
.claude/skills/
├── commit/                    # Skill name = directory name
│   └── SKILL.md              # Required: skill definition file
├── review/
│   └── SKILL.md
├── namespace/                 # Namespaced skill
│   └── my-skill/
│       └── SKILL.md          # Command: /namespace:my-skill
└── conditional-skill/
    └── SKILL.md              # With paths: frontmatter for conditional activation
```

**Naming conventions:**
- Directory name becomes the command name (e.g., `commit/` → `/commit`)
- Subdirectories create namespaced commands (e.g., `team/review/` → `/team:review`)
- SKILL.md is case-insensitive (skill.md, SKILL.md, Skill.md all work)

---

## Loading Pipeline

### Phase 1: Path Discovery

```javascript
// ============================================
// findSkillDirectories - Discover skill directories via tree climb
// Location: chunks.134.mjs:1945
// ============================================

// READABLE (for understanding):
function findSkillDirectories(cwd, maxDepth = 20) {
    const results = [];
    let currentPath = cwd;
    let depth = 0;

    while (currentPath && depth < maxDepth) {
        const skillsPath = path.join(currentPath, ".claude", "skills");
        if (fs.existsSync(skillsPath)) {
            results.push(skillsPath);
        }

        const parentPath = path.dirname(currentPath);
        if (parentPath === currentPath) break;  // Reached root
        currentPath = parentPath;
        depth++;
    }

    return results;
}
```

**Key insight:** The directory climb allows skills to be defined at any ancestor level, enabling shared team skills in parent directories.

### Phase 2: Parallel Loading from All Tiers

```javascript
// ============================================
// loadSkills - Master loading orchestrator
// Location: chunks.134.mjs:2059-2092
// ============================================

// READABLE (for understanding):
loadSkills = memoized(async (toolUseContext) => {
    // 1. Determine paths for each tier
    const managedDir = path.join(appInstallDir(), "skills");
    const userDir = path.join(userHomeDir(), ".claude", "skills");
    const projectDirs = getProjectSkillDirs("skills", toolUseContext);

    // 2. Load from all tiers in parallel (with permission gating)
    const [managed, user, project] = await Promise.all([
        loadSkillFromDir(managedDir, "policySettings"),
        isPermitted("userSettings")
            ? loadSkillFromDir(userDir, "userSettings")
            : Promise.resolve([]),
        isPermitted("projectSettings")
            ? Promise.all(projectDirs.map(d => loadSkillFromDir(d, "projectSettings")))
            : Promise.resolve([])
    ]);

    // 3. Load from CWD-based roots
    const cwdRoots = getProjectRoots();
    const cwdSkills = isPermitted("projectSettings")
        ? await Promise.all(cwdRoots.map(r =>
            loadSkillFromDir(path.join(r, ".claude", "skills"), "projectSettings")))
        : [];

    // 4. Load legacy commands for backward compatibility
    const legacy = await loadLegacyCommands(toolUseContext);

    // 5. Merge and deduplicate
    const all = [...managed, ...user, ...project.flat(), ...cwdSkills.flat(), ...legacy];
    return deduplicateByInode(all);
});
```

**Why parallel loading:**
- Disk I/O is the bottleneck; parallelizing reduces total load time
- Each tier is independent; no ordering dependency within a tier
- Permission checks happen before I/O to skip unauthorized directories

### Phase 3: Inode-Based Deduplication

**Why inode deduplication:**
- Symlinks can cause the same file to appear through multiple paths
- Monorepos may have shared skill directories reachable from multiple roots
- Prevents duplicate skill registration with different source tags

```javascript
// ============================================
// getInodeId - Get filesystem inode for deduplication
// Location: chunks.134.mjs:1651
// ============================================

// READABLE (for understanding):
function getInodeId(filePath) {
    try {
        const stats = fs.statSync(filePath);
        return stats.ino;  // Inode number uniquely identifies file
    } catch {
        return null;  // On error, include (can't dedup)
    }
}
```

### Phase 4: Conditional Skill Separation

Skills with `paths:` frontmatter are stored separately and activated on demand:

```javascript
// Split into unconditional vs conditional
let unconditional = [], conditional = [];
for (let skill of deduplicated) {
    let isConditional = skill.type === "prompt"
                     && skill.paths?.length > 0
                     && !alreadyActivatedSkills.has(skill.name);
    if (isConditional) {
        conditional.push(skill);
    } else {
        unconditional.push(skill);
    }
}

// Store conditional skills for later activation
for (let skill of conditional) {
    conditionalSkillsMap.set(skill.name, skill);
}

return unconditional;  // Only unconditional skills immediately active
```

---

## Single Directory Loading

### loadSkillFromDir (oQ1)

**What it does:** Reads all subdirectories in a `.claude/skills/` directory, parses each `SKILL.md`, and creates skill objects.

```javascript
// ============================================
// loadSkillFromDir - Parse all skills from a directory
// Location: chunks.134.mjs:1758-1820
// ============================================

// READABLE (for understanding):
async function loadSkillFromDir(baseDir, sourceTier) {
    const fs = getFs();
    const results = [];

    try {
        const entries = fs.readdirSync(baseDir, { withFileTypes: true });

        for (const entry of entries) {
            // Only process directories and symlinks
            if (!entry.isDirectory() && !entry.isSymbolicLink()) continue;

            const skillDir = path.join(baseDir, entry.name);
            const skillMdPath = path.join(skillDir, "SKILL.md");

            try {
                const rawContent = fs.readFileSync(skillMdPath, { encoding: "utf-8" });
                const { frontmatter, content } = parseFrontmatter(rawContent, skillMdPath);

                const skill = createSkillObject({
                    skillName: entry.name,
                    description: frontmatter.description ?? autoExtractDescription(content),
                    markdownContent: content,
                    allowedTools: parseToolList(frontmatter["allowed-tools"]),
                    userInvocable: parseBoolean(frontmatter["user-invocable"] ?? true),
                    disableModelInvocation: parseBoolean(frontmatter["disable-model-invocation"]),
                    model: resolveModel(frontmatter.model),
                    hooks: parseAndValidateHooks(frontmatter, entry.name),
                    executionContext: frontmatter.context === "fork" ? "fork" : undefined,
                    agent: frontmatter.agent,
                    argumentNames: parseArgumentNames(frontmatter.arguments),
                    paths: parsePathPatterns(frontmatter),
                    source: sourceTier,
                    baseDir: skillDir,
                    loadedFrom: "skills"
                });

                results.push({ skill, filePath: skillMdPath });
            } catch {
                // SKILL.md missing or unreadable: silently skip
            }
        }
    } catch (dirErr) {
        // ENOENT/EACCES/EPERM: directory doesn't exist or not accessible
        if (!["ENOENT", "EACCES", "EPERM"].includes(dirErr.code)) {
            logError(dirErr);
        }
    }

    return results;
}
```

**Design decisions:**

1. **Silent SKILL.md miss:** Non-skill subdirectories are harmlessly ignored
2. **Symlink support:** Both directories and symlinks are processed
3. **Graceful degradation:** Missing directories don't throw; empty array returned

---

## Conditional Skill Activation

### paths: Frontmatter Parsing

```javascript
// ============================================
// parsePathPatterns - Parse paths frontmatter into glob patterns
// Location: chunks.134.mjs:1673
// ============================================

// READABLE (for understanding):
function parsePathPatterns(frontmatter) {
    const paths = frontmatter.paths;
    if (!paths) return undefined;

    // String: single pattern (newline or comma separated)
    if (typeof paths === "string") {
        return paths.split(/[\n,]/).map(p => p.trim()).filter(Boolean);
    }

    // Array: multiple patterns
    if (Array.isArray(paths)) {
        return paths.filter(p => typeof p === "string");
    }

    return undefined;
}
```

### activateConditionalSkills (EW1)

**What it does:** Activates conditional skills when their path patterns match current working context.

```javascript
// ============================================
// activateConditionalSkills - Path-based skill activation
// Location: chunks.134.mjs:1996
// ============================================

// READABLE (for understanding):
function activateConditionalSkills(triggerFilePath, activeSkillsMap, conditionalSkillsMap) {
    const newlyActivated = [];

    for (const [name, skill] of conditionalSkillsMap) {
        // Skip if already activated
        if (activeSkillsMap.has(name)) continue;

        // Check if any path pattern matches
        const matches = skill.paths.some(pattern => {
            return minimatch(triggerFilePath, pattern, { matchBase: true });
        });

        if (matches) {
            activeSkillsMap.set(name, skill);
            newlyActivated.push(skill);
        }
    }

    return newlyActivated;
}
```

**Typical use cases:**
- Auto-activate `review` skill when `*.py` files are edited
- Auto-activate `terraform` skill when `*.tf` files are touched
- Team-specific skills for certain directory patterns

---

## Plugin Skill Loading

### loadPluginSkills (B0A)

**What it does:** Memoized function that loads skills from all enabled plugins.

```javascript
// ============================================
// loadPluginSkills - Load skills from all plugins
// Location: chunks.87.mjs:2157
// ============================================

// READABLE (for understanding):
loadPluginSkills = memoized(async () => {
    const plugins = getEnabledPlugins();
    const allPluginSkills = [];

    for (const plugin of plugins) {
        const skillsPaths = plugin.skillsPaths ?? [plugin.skillsPath].filter(Boolean);

        for (const skillsPath of skillsPaths) {
            const skills = await loadPluginSkillDir(skillsPath, plugin);
            allPluginSkills.push(...skills);
        }
    }

    return allPluginSkills;
});
```

### Plugin Skill Directory Structure

```
{plugin-install}/skills/
├── first-skill.md       # Skill name from filename
├── second-skill.md
└── nested/
    └── skill.md         # Command: /nested:skill
```

**Key difference from project skills:**
- Plugin skills use flat `.md` files (not SKILL.md in subdirectories)
- Command names may include plugin prefix for namespacing
- `pluginInfo` field is attached for telemetry and permissions

---

## Legacy Command Loading

### loadLegacyCommands (vEY)

**What it does:** Loads from deprecated `.claude/commands/` directory for backward compatibility.

```javascript
// ============================================
// loadLegacyCommands - Backward compatibility loader
// Location: chunks.134.mjs:1873
// ============================================

// READABLE (for understanding):
async function loadLegacyCommands(toolUseContext) {
    const results = [];
    const commandsDir = path.join(process.cwd(), ".claude", "commands");

    try {
        const entries = fs.readdirSync(commandsDir, { withFileTypes: true });

        for (const entry of entries) {
            if (!entry.isFile()) continue;

            const filePath = path.join(commandsDir, entry.name);
            const { frontmatter, content } = parseFrontmatter(await fs.readFile(filePath));

            results.push({
                skill: createSkillObject({
                    skillName: path.basename(entry.name, ".md"),
                    markdownContent: content,
                    source: "legacy",
                    loadedFrom: "commands_DEPRECATED",
                    ...frontmatter
                }),
                filePath
            });
        }
    } catch {
        // Legacy directory doesn't exist - that's fine
    }

    return results;
}
```

---

## Skill Registry Integration

### getAllCommands (cZ)

**What it does:** Merges all skill sources into the unified command registry.

```javascript
// ============================================
// getAllCommands - Merge all skill sources
// Location: chunks.168.mjs:2292-2306
// ============================================

// READABLE (for understanding):
getAllCommands = memoized(async () => {
    const [userSkills, bundledSkills, pluginSkills] = await Promise.all([
        loadSkills(),
        getBundledSkills(),
        loadPluginSkills()
    ]);

    // Merge with built-in commands
    const all = new Map();

    // Add in priority order (later overwrites earlier)
    for (const skill of bundledSkills) all.set(skill.name, skill);
    for (const skill of pluginSkills) all.set(skill.name, skill);
    for (const skill of userSkills) all.set(skill.name, skill);

    return all;
});
```

---

## Hot Reloading

### discoverProjectSkills (vW1)

**What it does:** Dynamically reloads skills when files change.

```javascript
// ============================================
// discoverProjectSkills - Dynamic skill reload
// Location: chunks.134.mjs:1964
// ============================================

// READABLE (for understanding):
async function discoverProjectSkills(fileOperation, toolUseContext) {
    // Clear caches
    clearSkillsCache();

    // Reload from affected directories
    const affectedDirs = getAffectedSkillDirectories(fileOperation.path);
    const newSkills = [];

    for (const dir of affectedDirs) {
        const skills = await loadSkillFromDir(dir, "projectSettings");
        newSkills.push(...skills);
    }

    // Update registry
    for (const { skill } of newSkills) {
        activeSkillsMap.set(skill.name, skill);
    }

    // Notify listeners
    for (const listener of skillChangeListeners) {
        listener(newSkills);
    }

    return newSkills;
}
```

### registerSkillChangeListener (lF4)

```javascript
// READABLE (for understanding):
function registerSkillChangeListener(callback) {
    skillChangeListeners.push(callback);

    // Return unsubscribe function
    return () => {
        const index = skillChangeListeners.indexOf(callback);
        if (index >= 0) skillChangeListeners.splice(index, 1);
    };
}
```

---

## Summary

The skill discovery and loading system provides:

1. **Five-tier priority loading** - Managed → User → Project → CWD → Legacy
2. **Inode deduplication** - Handles symlinks and duplicate paths
3. **Conditional activation** - Path-pattern-based skill activation
4. **Plugin integration** - Skills from installed plugins
5. **Backward compatibility** - Legacy commands directory support
6. **Hot reloading** - Dynamic updates when files change

The architecture cleanly separates discovery (finding directories) from loading (parsing files) from registration (adding to command system), enabling efficient parallelization and caching.