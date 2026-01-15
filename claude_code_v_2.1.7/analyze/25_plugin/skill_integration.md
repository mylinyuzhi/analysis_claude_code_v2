# Plugin-Skill Integration

## Overview

Plugins in Claude Code v2.1.7 can provide skills through their manifest configuration. This document details how plugin skills are discovered, loaded, and integrated with the skill system.

> Symbol mappings:
> - [symbol_index_core.md](../00_overview/symbol_index_core.md) - Core modules
> - [symbol_index_infra.md](../00_overview/symbol_index_infra.md) - Infrastructure modules

**Key functions:**
- `getPluginSkills` (tw0) - Load skills from enabled plugins
- `loadSkillsFromPath` (So2) - Load skills from a plugin path
- `getEnabledPlugins` (DG) - Get list of enabled plugins

---

## Quick Navigation

- [Plugin Skill Architecture](#plugin-skill-architecture)
- [Manifest Configuration](#manifest-configuration)
- [Loading Pipeline](#loading-pipeline)
- [Skill Path Resolution](#skill-path-resolution)
- [Deduplication](#deduplication)

---

## Plugin Skill Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    PLUGIN SKILL INTEGRATION                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Plugin Manifest                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ {                                                        │    │
│  │   "name": "my-plugin",                                   │    │
│  │   "skillsPath": "./skills",                              │    │
│  │   "skillsPaths": ["./extra-skills", "./more-skills"]     │    │
│  │ }                                                        │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                   │
│                              ▼                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              getPluginSkills (tw0)                        │    │
│  │                                                          │    │
│  │  for each enabled plugin:                                │    │
│  │    ├─ load from skillsPath (if defined)                  │    │
│  │    └─ load from each skillsPaths entry                   │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                   │
│                              ▼                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │            loadSkillsFromPath (So2)                       │    │
│  │                                                          │    │
│  │  ├─ Scan directory for *.md files                        │    │
│  │  ├─ Scan subdirectories for SKILL.md                     │    │
│  │  └─ Parse frontmatter and content                        │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                   │
│                              ▼                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                  Skill Objects                            │    │
│  │                                                          │    │
│  │  {                                                       │    │
│  │    source: "plugin",                                     │    │
│  │    loadedFrom: "plugin",                                 │    │
│  │    pluginInfo: { name, manifest, repository, path }      │    │
│  │    ...                                                   │    │
│  │  }                                                       │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Manifest Configuration

### Plugin Manifest Fields for Skills

```json
{
  "name": "my-awesome-plugin",
  "version": "1.0.0",
  "description": "A plugin with custom skills",

  "skillsPath": "./skills",
  "skillsPaths": [
    "./custom-skills",
    "./experimental-skills"
  ]
}
```

| Field | Type | Description |
|-------|------|-------------|
| `skillsPath` | string | Default skills directory (relative to plugin root) |
| `skillsPaths` | string[] | Additional skill directories |

### Directory Structure

```
my-plugin/
├── plugin.json          # Manifest
├── skills/              # Default skillsPath
│   ├── review.md
│   ├── refactor.md
│   └── test/
│       └── SKILL.md
├── custom-skills/       # Additional skillsPath
│   └── deploy.md
└── experimental-skills/ # Another skillsPath
    └── analyze/
        └── SKILL.md
```

---

## Loading Pipeline

### getPluginSkills (tw0)

Main entry point for loading plugin skills.

```javascript
// ============================================
// getPluginSkills - Load skills from all enabled plugins
// Location: chunks.130.mjs:1945-1979 (Ln 382381)
// ============================================

// ORIGINAL (for source lookup):
tw0 = W0(async () => {
  let { enabled: A, errors: Q } = await DG(), B = [];
  if (Q.length > 0) k(`Plugin loading errors: ${Q.map((G)=>h_(G)).join(", ")}`);
  k(`getPluginSkills: Processing ${A.length} enabled plugins`);
  for (let G of A) {
    let Z = new Set;
    if (G.skillsPath) {
      try {
        let Y = await So2(G.skillsPath, G.name, G.source, G.manifest, G.path, Z);
        B.push(...Y)
      } catch (Y) {
        k(`Failed to load skills from plugin ${G.name} default directory: ${Y}`, { level: "error" })
      }
    }
    if (G.skillsPaths) {
      for (let Y of G.skillsPaths) try {
        let J = await So2(Y, G.name, G.source, G.manifest, G.path, Z);
        B.push(...J)
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
    // Track seen skills to prevent duplicates within this plugin
    const seenSkills = new Set();

    // Load from default skillsPath
    if (plugin.skillsPath) {
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
      } catch (error) {
        log(`Failed to load skills from plugin ${plugin.name} default directory: ${error}`, { level: "error" });
      }
    }

    // Load from additional skillsPaths
    if (plugin.skillsPaths) {
      for (const skillPath of plugin.skillsPaths) {
        try {
          const skills = await loadSkillsFromPath(
            skillPath,
            plugin.name,
            plugin.source,
            plugin.manifest,
            plugin.path,
            seenSkills
          );
          allSkills.push(...skills);
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

### loadSkillsFromPath (So2)

Loads skills from a single directory path.

```javascript
// ============================================
// loadSkillsFromPath - Load skills from a plugin directory
// Location: chunks.130.mjs (inferred from tw0 calls)
// ============================================

// READABLE pseudocode:
async function loadSkillsFromPath(
  skillPath,       // Relative path from plugin root
  pluginName,      // Plugin identifier
  pluginSource,    // Plugin source (git, registry, local)
  pluginManifest,  // Plugin manifest object
  pluginPath,      // Absolute path to plugin root
  seenSkills       // Set to track duplicates
) {
  const absolutePath = path.join(pluginPath, skillPath);
  const skills = [];

  if (!directoryExists(absolutePath)) {
    return skills;
  }

  // Scan for direct .md files
  const mdFiles = await glob("*.md", { cwd: absolutePath });
  for (const file of mdFiles) {
    const filePath = path.join(absolutePath, file);
    const skillName = path.basename(file, ".md");

    // Skip if already seen
    if (seenSkills.has(skillName)) continue;
    seenSkills.add(skillName);

    // Parse and create skill object
    const content = await readFile(filePath, "utf-8");
    const { frontmatter, content: body } = parseFrontmatter(content);

    skills.push(createPluginSkill({
      name: frontmatter.name || skillName,
      description: frontmatter.description,
      frontmatter,
      content: body,
      filePath,
      pluginName,
      pluginSource,
      pluginManifest,
      pluginPath
    }));
  }

  // Scan subdirectories for SKILL.md
  const subdirs = await readdir(absolutePath);
  for (const subdir of subdirs) {
    const skillMdPath = path.join(absolutePath, subdir, "SKILL.md");
    if (!fileExists(skillMdPath)) continue;

    const skillName = subdir;
    if (seenSkills.has(skillName)) continue;
    seenSkills.add(skillName);

    // Parse and create skill object
    const content = await readFile(skillMdPath, "utf-8");
    const { frontmatter, content: body } = parseFrontmatter(content);

    skills.push(createPluginSkill({
      name: frontmatter.name || skillName,
      description: frontmatter.description,
      frontmatter,
      content: body,
      filePath: skillMdPath,
      pluginName,
      pluginSource,
      pluginManifest,
      pluginPath
    }));
  }

  return skills;
}
```

---

## Skill Path Resolution

### Path Types

| Path Type | Resolution |
|-----------|------------|
| Relative | `path.join(pluginPath, skillsPath)` |
| Absolute | Used directly |

### Example Resolution

```javascript
// Plugin at: ~/.claude/plugins/my-plugin/
// Manifest: { "skillsPath": "./skills" }

// Resolved path:
const absolutePath = path.join(
  "~/.claude/plugins/my-plugin",  // pluginPath
  "./skills"                       // skillsPath
);
// Result: ~/.claude/plugins/my-plugin/skills/
```

---

## Deduplication

### Within Plugin

Each plugin maintains a `seenSkills` Set to prevent duplicates:

```javascript
const seenSkills = new Set();

// When loading:
if (seenSkills.has(skillName)) {
  continue; // Skip duplicate
}
seenSkills.add(skillName);
```

### Across Plugins

Plugin skills are combined with other skill sources and filtered by the main aggregator:

```javascript
// In getAllCommands (Aj):
const allCommands = [
  ...bundledSkills,
  ...skillDirCommands,  // Directory skills
  ...mcpPrompts,
  ...pluginSkills,      // Plugin skills (may contain duplicates with above)
  ...dynamicSkills,
  ...builtinCommands
].filter(cmd => cmd.isEnabled());
```

**Priority order:** If a skill with the same name exists in both directory and plugin, the directory skill takes precedence (loaded first).

---

## Plugin Skill Metadata

### pluginInfo Property

Plugin skills include a `pluginInfo` object:

```javascript
{
  type: "prompt",
  name: "review",
  source: "plugin",
  loadedFrom: "plugin",
  pluginInfo: {
    name: "my-plugin",           // Plugin name
    manifest: { /* ... */ },     // Full manifest
    repository: "user/repo",     // Git repository (if applicable)
    path: "~/.claude/plugins/..." // Absolute plugin path
  },
  // ... other skill properties
}
```

### Usage in Description

The `pluginInfo` is used to enhance skill descriptions:

```javascript
// From gzA (getDescription), chunks.146.mjs:2336-2338
if (skill.source === "plugin") {
  if (skill.pluginInfo?.repository) {
    return `${skill.description} (plugin:${skill.pluginInfo.repository})`;
  }
  return `${skill.description} (plugin)`;
}
```

---

## Error Handling

### Per-Plugin Isolation

Errors in one plugin don't affect others:

```javascript
for (const plugin of enabledPlugins) {
  try {
    // Load skills from plugin
    const skills = await loadSkillsFromPath(...);
    allSkills.push(...skills);
  } catch (error) {
    // Log error but continue with other plugins
    log(`Failed to load skills from plugin ${plugin.name}: ${error}`, { level: "error" });
  }
}
```

### Per-Path Isolation

Errors in one path within a plugin don't affect other paths:

```javascript
if (plugin.skillsPaths) {
  for (const skillPath of plugin.skillsPaths) {
    try {
      const skills = await loadSkillsFromPath(skillPath, ...);
      allSkills.push(...skills);
    } catch (error) {
      // Continue with other paths
      log(`Failed to load from ${skillPath}: ${error}`, { level: "error" });
    }
  }
}
```

---

## Best Practices

### Plugin Skill Organization

```
my-plugin/
├── plugin.json
└── skills/
    ├── review.md           # Simple skill (single file)
    ├── deploy/
    │   ├── SKILL.md        # Complex skill (directory)
    │   └── templates/      # Supporting files
    │       └── ...
    └── analyze/
        ├── SKILL.md
        └── prompts/
            └── ...
```

### Skill Naming

- Use kebab-case: `code-review`, `deploy-staging`
- Avoid conflicts with built-in commands
- Consider prefixing with plugin name: `myplugin-review`

---

## Related Modules

- [overview.md](./overview.md) - Plugin system overview
- [loading.md](./loading.md) - Plugin loading process
- [10_skill/architecture.md](../10_skill/architecture.md) - Skill system architecture
- [10_skill/loading.md](../10_skill/loading.md) - Skill loading pipeline
