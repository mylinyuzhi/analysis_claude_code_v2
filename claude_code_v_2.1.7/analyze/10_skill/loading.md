# Skill Loading Pipeline

## Overview

The skill loading pipeline in Claude Code v2.1.7 is responsible for discovering, parsing, and registering skills from multiple sources. This document provides deep analysis of the loading process.

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

**Key loading functions:**
- `getSkills` (Wz7) - Main orchestrator
- `loadSkillDirectoryCommands` (lO0) - Load from skill directories
- `getPluginSkills` (tw0) - Load from enabled plugins
- `getBundledSkills` (kZ9) - Get bundled skills
- `scanSkillDirectory` (cO0) - Scan single directory
- `loadSkillFromPath` (So2) - Load skills from plugin path

---

## Quick Navigation

- [Loading Pipeline Overview](#loading-pipeline-overview)
- [Main Orchestrator: getSkills](#main-orchestrator-getskills)
- [Directory Loading: loadSkillDirectoryCommands](#directory-loading-loadskilldiirectorycommands)
- [Plugin Loading: getPluginSkills](#plugin-loading-getpluginskills)
- [Bundled Skills: getBundledSkills](#bundled-skills-getbundledskills)
- [Deduplication Algorithm](#deduplication-algorithm)

---

## Loading Pipeline Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    getSkills (Wz7)                               │
│                           │                                      │
│     ┌─────────────────────┼─────────────────────┐               │
│     │                     │                     │               │
│     ▼                     ▼                     ▼               │
│ ┌──────────┐       ┌──────────┐         ┌──────────┐           │
│ │  lO0()   │       │  tw0()   │         │  kZ9()   │           │
│ │ Dir Load │       │ Plugin   │         │ Bundled  │           │
│ └────┬─────┘       └────┬─────┘         └────┬─────┘           │
│      │                  │                    │                  │
│      │ Promise.all      │                    │ sync             │
│      ▼                  ▼                    ▼                  │
│ ┌──────────┐       ┌──────────┐         ┌──────────┐           │
│ │  cO0()   │       │  So2()   │         │  vZ9[]   │           │
│ │ managed  │       │per plugin│         │ registry │           │
│ │  user    │       │          │         │          │           │
│ │ project  │       │          │         │          │           │
│ └──────────┘       └──────────┘         └──────────┘           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    { skillDirCommands,
                      pluginSkills,
                      bundledSkills }
```

---

## Main Orchestrator: getSkills

### Wz7 - Combine all skill sources

```javascript
// ============================================
// getSkills - Main skill loading orchestrator
// Location: chunks.146.mjs:2299-2318 (Ln 435215)
// ============================================

// ORIGINAL (for source lookup):
async function Wz7(A) {
  try {
    let [Q, B] = await Promise.all([
      lO0(A).catch((Z) => {
        return e(Z instanceof Error ? Z : Error("Failed to load skill directory commands")),
               k("Skill directory commands failed to load, continuing without them"), []
      }),
      tw0().catch((Z) => {
        return e(Z instanceof Error ? Z : Error("Failed to load plugin skills")),
               k("Plugin skills failed to load, continuing without them"), []
      })
    ]),
    G = kZ9();
    return k(`getSkills returning: ${Q.length} skill dir commands, ${B.length} plugin skills, ${G.length} bundled skills`), {
      skillDirCommands: Q,
      pluginSkills: B,
      bundledSkills: G
    }
  } catch (Q) {
    return e(Q instanceof Error ? Q : Error("Unexpected error loading skills")),
           k("Unexpected error in getSkills, returning empty"), {
      skillDirCommands: [],
      pluginSkills: [],
      bundledSkills: []
    }
  }
}

// READABLE (for understanding):
async function getSkills(context) {
  try {
    // Load directory and plugin skills in parallel
    const [skillDirCommands, pluginSkills] = await Promise.all([
      // Directory skills with error handling
      loadSkillDirectoryCommands(context).catch((error) => {
        logError(error instanceof Error ? error : Error("Failed to load skill directory commands"));
        log("Skill directory commands failed to load, continuing without them");
        return [];
      }),

      // Plugin skills with error handling
      getPluginSkills().catch((error) => {
        logError(error instanceof Error ? error : Error("Failed to load plugin skills"));
        log("Plugin skills failed to load, continuing without them");
        return [];
      })
    ]);

    // Get bundled skills (synchronous)
    const bundledSkills = getBundledSkills();

    log(`getSkills returning: ${skillDirCommands.length} skill dir commands, ${pluginSkills.length} plugin skills, ${bundledSkills.length} bundled skills`);

    return {
      skillDirCommands,
      pluginSkills,
      bundledSkills
    };
  } catch (error) {
    logError(error instanceof Error ? error : Error("Unexpected error loading skills"));
    log("Unexpected error in getSkills, returning empty");
    return {
      skillDirCommands: [],
      pluginSkills: [],
      bundledSkills: []
    };
  }
}

// Mapping: Wz7→getSkills, A→context, Q→skillDirCommands, B→pluginSkills, G→bundledSkills
```

**How it works:**

1. **Parallel loading**: Uses `Promise.all` for directory and plugin loading
2. **Error isolation**: Each source has its own error handler
3. **Graceful degradation**: Returns empty array on failure, doesn't crash
4. **Synchronous bundled**: Bundled skills are already in memory

**Why this approach:**

- **Performance**: Parallel loading reduces startup time
- **Robustness**: One failing source doesn't break others
- **Debugging**: Detailed logging for troubleshooting

---

## Directory Loading: loadSkillDirectoryCommands

### lO0 - Load from managed/user/project directories

```javascript
// ============================================
// loadSkillDirectoryCommands - Load skills from all directories
// Location: chunks.133.mjs:2069-2096 (Ln 392353)
// ============================================

// ORIGINAL (for source lookup):
lO0 = W0(async (A) => {
  let Q = XzA(zQ(), "skills"),
    B = XzA(xL(), ".claude", "skills"),
    G = iO0("skills", A);
  k(`Loading skills from: managed=${B}, user=${Q}, project=[${G.join(", ")}]`);
  let [Z, Y, J] = await Promise.all([
    cO0(B, "policySettings"),
    iK("userSettings") ? cO0(Q, "userSettings") : Promise.resolve([]),
    iK("projectSettings") ? Promise.all(G.map((V) => cO0(V, "projectSettings"))) : Promise.resolve([])
  ]),
  X = await Y77(A),
  I = [...Z, ...Y, ...J.flat(), ...X],
  D = new Map,
  W = [];
  for (let { skill: V, filePath: F } of I) {
    if (V.type !== "prompt") continue;
    let H = A77(F);
    if (H === null) { W.push(V); continue }
    let E = D.get(H);
    if (E !== void 0) {
      k(`Skipping duplicate skill '${V.name}' from ${V.source} (same inode already loaded from ${E})`);
      continue
    }
    D.set(H, V.source), W.push(V)
  }
  let K = I.length - W.length;
  if (K > 0) k(`Deduplicated ${K} skills (same inode)`);
  return k(`Loaded ${W.length} unique skills`), W
});

// READABLE (for understanding):
const loadSkillDirectoryCommands = memoize(async (context) => {
  // Define directory paths
  const userSkillsDir = path.join(getUserConfigDir(), "skills");
  const managedSkillsDir = path.join(getPolicyDir(), ".claude", "skills");
  const projectSkillsDirs = getProjectSkillDirs("skills", context);

  log(`Loading skills from: managed=${managedSkillsDir}, user=${userSkillsDir}, project=[${projectSkillsDirs.join(", ")}]`);

  // Load from all directories in parallel
  const [managedSkills, userSkills, projectSkillsArrays] = await Promise.all([
    // Managed/policy skills (always loaded)
    scanSkillDirectory(managedSkillsDir, "policySettings"),

    // User skills (if enabled)
    isSettingEnabled("userSettings")
      ? scanSkillDirectory(userSkillsDir, "userSettings")
      : Promise.resolve([]),

    // Project skills (if enabled)
    isSettingEnabled("projectSettings")
      ? Promise.all(projectSkillsDirs.map(dir =>
          scanSkillDirectory(dir, "projectSettings")
        ))
      : Promise.resolve([])
  ]);

  // Load legacy commands directory
  const legacyCommands = await loadLegacyCommands(context);

  // Combine all skills
  const allSkills = [
    ...managedSkills,
    ...userSkills,
    ...projectSkillsArrays.flat(),
    ...legacyCommands
  ];

  // Deduplicate by inode
  const inodeMap = new Map();
  const uniqueSkills = [];

  for (const { skill, filePath } of allSkills) {
    // Only process prompt-type skills
    if (skill.type !== "prompt") continue;

    // Get file inode
    const inode = getFileInode(filePath);

    // Virtual files (no inode) are always included
    if (inode === null) {
      uniqueSkills.push(skill);
      continue;
    }

    // Check for duplicate
    const existingSource = inodeMap.get(inode);
    if (existingSource !== undefined) {
      log(`Skipping duplicate skill '${skill.name}' from ${skill.source} (same inode already loaded from ${existingSource})`);
      continue;
    }

    // Track and include
    inodeMap.set(inode, skill.source);
    uniqueSkills.push(skill);
  }

  const deduplicatedCount = allSkills.length - uniqueSkills.length;
  if (deduplicatedCount > 0) {
    log(`Deduplicated ${deduplicatedCount} skills (same inode)`);
  }

  log(`Loaded ${uniqueSkills.length} unique skills`);
  return uniqueSkills;
});

// Mapping: lO0→loadSkillDirectoryCommands, Q→userSkillsDir, B→managedSkillsDir,
//          G→projectSkillsDirs, cO0→scanSkillDirectory, iK→isSettingEnabled,
//          Y77→loadLegacyCommands, A77→getFileInode, D→inodeMap, W→uniqueSkills
```

**Key features:**

1. **Three-tier priority**: Managed → User → Project
2. **Conditional loading**: Respects settings for user/project
3. **Inode deduplication**: Prevents duplicate symlinked files
4. **Legacy support**: Loads from old `commands/` directory

---

## Plugin Loading: getPluginSkills

### tw0 - Load skills from enabled plugins

```javascript
// ============================================
// getPluginSkills - Load skills from plugins
// Location: chunks.130.mjs:1945-1979 (Ln 382381)
// ============================================

// ORIGINAL (for source lookup):
tw0 = W0(async () => {
  let { enabled: A, errors: Q } = await DG(), B = [];
  if (Q.length > 0) k(`Plugin loading errors: ${Q.map((G)=>h_(G)).join(", ")}`);
  k(`getPluginSkills: Processing ${A.length} enabled plugins`);
  for (let G of A) {
    let Z = new Set;
    if (k(`Checking plugin ${G.name}: skillsPath=${G.skillsPath?"exists":"none"}, skillsPaths=${G.skillsPaths?G.skillsPaths.length:0} paths`),
        G.skillsPath) {
      k(`Attempting to load skills from plugin ${G.name} default skillsPath: ${G.skillsPath}`);
      try {
        let Y = await So2(G.skillsPath, G.name, G.source, G.manifest, G.path, Z);
        B.push(...Y), k(`Loaded ${Y.length} skills from plugin ${G.name} default directory`)
      } catch (Y) {
        k(`Failed to load skills from plugin ${G.name} default directory: ${Y}`, { level: "error" })
      }
    }
    if (G.skillsPaths) {
      k(`Attempting to load skills from plugin ${G.name} skillsPaths: ${G.skillsPaths.join(", ")}`);
      for (let Y of G.skillsPaths) try {
        k(`Loading from skillPath: ${Y} for plugin ${G.name}`);
        let J = await So2(Y, G.name, G.source, G.manifest, G.path, Z);
        B.push(...J), k(`Loaded ${J.length} skills from plugin ${G.name} custom path: ${Y}`)
      } catch (J) {
        k(`Failed to load skills from plugin ${G.name} custom path ${Y}: ${J}`, { level: "error" })
      }
    }
  }
  return k(`Total plugin skills loaded: ${B.length}`), B
});

// READABLE (for understanding):
const getPluginSkills = memoize(async () => {
  // Get enabled plugins from plugin manager
  const { enabled: enabledPlugins, errors: loadErrors } = await getEnabledPlugins();
  const allSkills = [];

  // Log any plugin loading errors
  if (loadErrors.length > 0) {
    log(`Plugin loading errors: ${loadErrors.map(formatError).join(", ")}`);
  }

  log(`getPluginSkills: Processing ${enabledPlugins.length} enabled plugins`);

  // Process each enabled plugin
  for (const plugin of enabledPlugins) {
    // Track seen skills to avoid duplicates within plugin
    const seenSkills = new Set();

    log(`Checking plugin ${plugin.name}: skillsPath=${plugin.skillsPath ? "exists" : "none"}, skillsPaths=${plugin.skillsPaths?.length ?? 0} paths`);

    // Load from default skillsPath
    if (plugin.skillsPath) {
      log(`Attempting to load skills from plugin ${plugin.name} default skillsPath: ${plugin.skillsPath}`);
      try {
        const skills = await loadSkillsFromPath(
          plugin.skillsPath,
          plugin.name,
          plugin.source,
          plugin.manifest,
          plugin.path,
          seenSkills
        );
        allSkills.push(...skills);
        log(`Loaded ${skills.length} skills from plugin ${plugin.name} default directory`);
      } catch (error) {
        log(`Failed to load skills from plugin ${plugin.name} default directory: ${error}`, { level: "error" });
      }
    }

    // Load from additional skillsPaths
    if (plugin.skillsPaths) {
      log(`Attempting to load skills from plugin ${plugin.name} skillsPaths: ${plugin.skillsPaths.join(", ")}`);
      for (const skillPath of plugin.skillsPaths) {
        try {
          log(`Loading from skillPath: ${skillPath} for plugin ${plugin.name}`);
          const skills = await loadSkillsFromPath(
            skillPath,
            plugin.name,
            plugin.source,
            plugin.manifest,
            plugin.path,
            seenSkills
          );
          allSkills.push(...skills);
          log(`Loaded ${skills.length} skills from plugin ${plugin.name} custom path: ${skillPath}`);
        } catch (error) {
          log(`Failed to load skills from plugin ${plugin.name} custom path ${skillPath}: ${error}`, { level: "error" });
        }
      }
    }
  }

  log(`Total plugin skills loaded: ${allSkills.length}`);
  return allSkills;
});

// Mapping: tw0→getPluginSkills, DG→getEnabledPlugins, So2→loadSkillsFromPath,
//          A→enabledPlugins, B→allSkills, G→plugin, Z→seenSkills
```

**Plugin skill paths:**

- `skillsPath`: Default skills directory (single path)
- `skillsPaths`: Additional skill directories (array)

---

## Bundled Skills: getBundledSkills

### kZ9 - Return registered bundled skills

```javascript
// ============================================
// getBundledSkills - Get bundled skills registry
// Location: chunks.145.mjs:1774-1775 (Ln 431809)
// ============================================

// ORIGINAL (for source lookup):
function kZ9() {
  return [...vZ9]
}

// Registry population (via registration function)
// Location: chunks.145.mjs:1771
vZ9.push(Q)  // Called by registerBundledSkill()

// READABLE (for understanding):
function getBundledSkills() {
  // Return copy of bundled skills registry
  return [...bundledSkillsRegistry];
}

// Mapping: kZ9→getBundledSkills, vZ9→bundledSkillsRegistry
```

**Bundled skills** are registered at module load time, not loaded from filesystem.

---

## Deduplication Algorithm

### Inode-Based Deduplication

The deduplication algorithm prevents loading the same file multiple times when it appears via symlinks or duplicate paths.

```
Step 1: Load all skills from all sources
        ├─ managed skills  → [{skill, filePath}, ...]
        ├─ user skills     → [{skill, filePath}, ...]
        └─ project skills  → [{skill, filePath}, ...]

Step 2: For each skill:
        ├─ Skip if not prompt type
        ├─ Get inode: A77(filePath)
        │   ├─ null → include (virtual file)
        │   └─ number → check Map
        │       ├─ exists → skip (duplicate)
        │       └─ new → add to Map, include

Step 3: Return deduplicated list
```

**Why inode-based:**
- Symlinks resolve to same inode
- Handles cross-directory references
- First occurrence wins (preserves priority)

---

## Performance Considerations

### Memoization

All loading functions are memoized via `W0()`:

```javascript
// W0 = memoize function wrapper
lO0 = W0(async (A) => { ... });  // Directory loader
tw0 = W0(async () => { ... });   // Plugin loader
```

### Cache Invalidation

Caches are cleared via `clearSkillCaches` (lt):

```javascript
function lt() {
  Aj.cache?.clear?.();  // All commands
  Nc.cache?.clear?.();  // LLM-invocable
  hD1.cache?.clear?.(); // User skills
  // + plugin caches
}
```

**When to clear:**
- Plugin install/uninstall
- Skill file modification
- Settings change

---

## Related Modules

- [architecture.md](./architecture.md) - Skill system architecture
- [execution.md](./execution.md) - Skill execution flow
- [09_slash_command/custom_commands.md](../09_slash_command/custom_commands.md) - SKILL.md format
- [25_plugin/skill_integration.md](../25_plugin/skill_integration.md) - Plugin skills
