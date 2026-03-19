# Skill Discovery & Loading Flow (Claude Code 2.1.76)

## Overview

This document details the complete skill discovery and loading pipeline from filesystem to registry.

**v2.1.76 changes:**
- Fix for skills not discovered from git worktrees (worktree paths now included in skill directory search)
- `${CLAUDE_SKILL_DIR}` environment variable adds a custom skill directory source
- `InstructionsLoaded` hook event fires when skill instructions are injected into the conversation

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Skill System section)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations (Slash Commands section)

Key functions in this document:
- `loadSkillDirCommands` (JV8) - Master loading orchestrator - chunks.90.mjs:1577
- `loadSkillsFromDirectory` (Zp6) - Parse skills from single directory - chunks.90.mjs:1265
- `getAllSkills` (I0) - Get all loaded skills (memoized) - chunks.168.mjs:2013
- `getSkills` (z5z) - Aggregate all skill sources - chunks.168.mjs:1815
- `activateConditionalSkills` (LW6) - Path-based activation - chunks.90.mjs:1508
- `loadPluginSkills` (B0A) - Load skills from plugins - chunks.87.mjs:2157
- `loadLegacyCommands` (Fm9) - Backward compat loader - chunks.90.mjs:1373

---

## Directory Hierarchy

### Six-Tier Loading Priority (v2.1.76)

Skills are loaded from six distinct sources in priority order:

```
┌─────────────────────────────────────────────────────────────────────┐
│ Loading Tier                    │ Source Tag        │ Path Pattern │
├─────────────────────────────────┼───────────────────┼──────────────┤
│ 1. Managed Skills               │ policySettings    │ {app-install}/skills/                 │
│    (Application-installed)      │                   │                                       │
├─────────────────────────────────┼───────────────────┼──────────────┤
│ 2. User Skills                  │ userSettings      │ ~/.claude/skills/                     │
│    (User home directory)        │                   │ (only if userSettings permitted)     │
├─────────────────────────────────┼───────────────────┼──────────────┤
│ 3. Custom Directory             │ userSettings      │ ${CLAUDE_SKILL_DIR}                  │
│    (Env var, v2.1.76)           │                   │ (only if env var is set)             │
├─────────────────────────────────┼───────────────────┼──────────────┤
│ 4. Project Skills (explicit)    │ projectSettings   │ {project-root}/.claude/skills/       │
│    (Configured project roots)   │                   │ (only if projectSettings permitted)  │
├─────────────────────────────────┼───────────────────┼──────────────┤
│ 5. Project Skills (CWD climb)   │ projectSettings   │ {cwd-ancestors}/.claude/skills/      │
│    (Directory tree climb)       │                   │ (includes git worktrees, v2.1.76)   │
├─────────────────────────────────┼───────────────────┼──────────────┤
│ 6. Legacy Commands              │ (varies)          │ {cwd}/.claude/commands/              │
│    (Deprecated, backward compat)│                   │ (deprecated directory structure)     │
└─────────────────────────────────┴───────────────────┴──────────────┘
```

Plus two additional sources loaded separately:
- **Bundled Skills** - Registered via `registerPromptSkill` (rw) at initialization
- **Plugin Skills** - Loaded via `loadPluginSkills` (B0A) from installed plugins

---

## ${CLAUDE_SKILL_DIR} Support (v2.1.76)

### What it does

When the `CLAUDE_SKILL_DIR` environment variable is set, its value is added as an additional skills directory source.

### How it works

1. During `loadSkills`, check if `process.env.CLAUDE_SKILL_DIR` is set
2. If set, add it to the list of directories to scan for skills
3. Skills from `CLAUDE_SKILL_DIR` are loaded with `userSettings` source tag
4. These skills follow the same deduplication and conditional activation rules

### Use cases

- **CI/CD environments**: Point to a shared directory of team skills
- **Custom installations**: Override the default skill location without symlinks
- **Testing**: Point to a test skill directory without modifying ~/.claude

```javascript
// ============================================
// CLAUDE_SKILL_DIR environment variable handling (v2.1.76)
// Location: chunks.134.mjs (added in 2.1.76)
// ============================================

// READABLE (for understanding):
async function loadSkills(toolUseContext) {
    // ... existing source loading ...

    // NEW in v2.1.76: load from CLAUDE_SKILL_DIR if set
    let customSkillDir = process.env.CLAUDE_SKILL_DIR;
    let customDirSkills = [];
    if (customSkillDir && isPermitted("userSettings")) {
        customDirSkills = await loadSkillFromDir(customSkillDir, "userSettings");
        log(`Loaded ${customDirSkills.length} skills from CLAUDE_SKILL_DIR: ${customSkillDir}`);
    }

    // Merge into all skills list
    let allSkills = [...managedSkills, ...userSkills, ...customDirSkills, ...projectSkills.flat(), ...legacy];
    // ... deduplication and conditional separation ...
}
```

---

## Git Worktree Fix (v2.1.76)

### Problem

In v2.1.38, the CWD-based directory tree climb for skill discovery used `process.cwd()` exclusively. When Claude Code ran inside a git worktree, the worktree path was correctly identified as the CWD, but the climb did not include the main worktree's `.claude/skills/` directory.

This meant project skills defined in the main repository were not visible to agents running in worktrees, requiring users to duplicate skill definitions.

### Fix

In v2.1.76, `findSkillDirectories` (TW1) now detects when the current directory is a git worktree and includes the main worktree's skill directories in the search path.

```javascript
// ============================================
// findSkillDirectories - v2.1.76 worktree fix
// Location: chunks.134.mjs:1945
// ============================================

// READABLE (for understanding):
function findSkillDirectories(cwd, maxDepth = 20) {
    const results = [];
    let currentPath = cwd;
    let depth = 0;

    // Climb directory tree from CWD
    while (currentPath && depth < maxDepth) {
        const skillsPath = path.join(currentPath, ".claude", "skills");
        if (fs.existsSync(skillsPath)) {
            results.push(skillsPath);
        }
        const parentPath = path.dirname(currentPath);
        if (parentPath === currentPath) break;
        currentPath = parentPath;
        depth++;
    }

    // NEW in v2.1.76: also check main worktree if in a worktree
    let mainWorktreePath = getMainWorktreePath(cwd);
    if (mainWorktreePath && mainWorktreePath !== cwd) {
        let mainWorktreeSkillsPath = path.join(mainWorktreePath, ".claude", "skills");
        if (fs.existsSync(mainWorktreeSkillsPath) && !results.includes(mainWorktreeSkillsPath)) {
            results.push(mainWorktreeSkillsPath);
        }
    }

    return results;
}
```

---

## Loading Pipeline

### Phase 1: Path Discovery

The `findSkillDirectories` (TW1) function climbs the directory tree from the current working directory, collecting `.claude/skills/` directories at each level.

### Phase 2: Parallel Loading from All Tiers

```javascript
// ============================================
// loadSkills - Master loading orchestrator
// Location: chunks.134.mjs:2059-2092
// ============================================

// READABLE (for understanding):
loadSkills = memoized(async (toolUseContext) => {
    const managedDir = path.join(appInstallDir(), "skills");
    const userDir = path.join(userHomeDir(), ".claude", "skills");
    const customDir = process.env.CLAUDE_SKILL_DIR;  // v2.1.76
    const projectDirs = getProjectSkillDirs("skills", toolUseContext);

    const [managed, user, project] = await Promise.all([
        loadSkillFromDir(managedDir, "policySettings"),
        isPermitted("userSettings")
            ? loadSkillFromDir(userDir, "userSettings")
            : Promise.resolve([]),
        isPermitted("projectSettings")
            ? Promise.all(projectDirs.map(d => loadSkillFromDir(d, "projectSettings")))
            : Promise.resolve([])
    ]);

    // v2.1.76: load from custom dir if set
    let customDirSkills = [];
    if (customDir && isPermitted("userSettings")) {
        customDirSkills = await loadSkillFromDir(customDir, "userSettings");
    }

    const cwdRoots = getProjectRoots();  // Includes main worktree in v2.1.76
    const cwdSkills = isPermitted("projectSettings")
        ? await Promise.all(cwdRoots.map(r =>
            loadSkillFromDir(path.join(r, ".claude", "skills"), "projectSettings")))
        : [];

    const legacy = await loadLegacyCommands(toolUseContext);

    const all = [...managed, ...user, ...customDirSkills, ...project.flat(), ...cwdSkills.flat(), ...legacy];
    return deduplicateByInode(all);
});
```

### Phase 3: Inode-Based Deduplication

Skills that appear through multiple paths (via symlinks or worktrees resolving to the same file) are deduplicated by inode. The first occurrence wins.

### Phase 4: Conditional Skill Separation

Skills with `paths:` frontmatter are stored separately in `conditionalSkillRegistry` and activated only when files matching their path patterns are touched.

---

## InstructionsLoaded Hook (v2.1.76)

### What it does

When a skill's instructions (prompt content) are injected into the conversation, a new `InstructionsLoaded` hook event fires. This allows external hooks to observe when and which skill instructions were applied.

### When it fires

The `InstructionsLoaded` hook fires after:
1. The skill's `getPromptForCommand()` method is called and returns prompt messages
2. The prompt messages have been added to the conversation

### Hook data

```javascript
// InstructionsLoaded hook event structure
{
    type: "InstructionsLoaded",
    skillName: "commit",       // The skill that was loaded
    skillSource: "project",    // Source: bundled/user/project/plugin
    contentLength: 1234,       // Length of the injected instructions
    args: "feat: add feature"  // Arguments passed to the skill
}
```

### Use cases

- **Audit logging**: Record which skill instructions are used in a session
- **Monitoring**: Track skill usage in production environments
- **Conditional logic**: Run different post-load actions based on which skill was loaded

---

## Plugin Skill Loading

### loadPluginSkills (B0A)

Memoized function that loads skills from all enabled plugins:

```javascript
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

---

## Summary

The skill discovery and loading system in v2.1.76 provides:

1. **Six-tier priority loading** - Managed → User → Custom Dir → Project → CWD → Legacy
2. **${CLAUDE_SKILL_DIR} support** - Custom skill directory via environment variable
3. **Git worktree fix** - Main worktree skills are discoverable from worktree CWDs
4. **Inode deduplication** - Handles symlinks and cross-path duplicates
5. **Conditional activation** - Path-pattern-based skill activation
6. **Plugin integration** - Skills from installed plugins
7. **InstructionsLoaded hook** - Observability when skill instructions are injected
