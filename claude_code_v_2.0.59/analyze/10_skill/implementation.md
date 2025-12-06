# Skills System Implementation

## Overview

Skills in Claude Code are reusable command templates loaded from markdown files in the `skills/` directory. They allow users to define custom commands that can be invoked during sessions, providing a way to extend Claude Code's functionality beyond built-in commands.

## What Skills Are

Skills are:
- Markdown files that define custom commands
- Stored in `skills/` directories (project-level or plugin-level)
- Similar to commands but specifically for reusable task templates
- Loaded dynamically at runtime and cached for performance

## Skill Loading Architecture

### 1. Loading from Skill Directories

Skills are loaded from two main sources:

**Skill Directory Commands (VK0)**
```javascript
// chunks.152.mjs:2153-2168
async function Sv3() {
  try {
    let [A, Q] = await Promise.all([
      VK0().catch((B) => {
        return AA(B instanceof Error ? B : Error("Failed to load skill directory commands")),
        g("Skill directory commands failed to load, continuing without them"), []
      }),
      iW0().catch((B) => {
        return AA(B instanceof Error ? B : Error("Failed to load plugin skills")),
        g("Plugin skills failed to load, continuing without them"), []
      })
    ]);
    return g(`getSkills returning: ${A.length} skill dir commands, ${Q.length} plugin skills`), {
      skillDirCommands: A,
      pluginSkills: Q
    }
  } catch (A) {
    return AA(A instanceof Error ? A : Error("Unexpected error loading skills")),
    g("Unexpected error in getSkills, returning empty"), {
      skillDirCommands: [],
      pluginSkills: []
    }
  }
}
```

**Key Functions:**
- `VK0()` - Loads skills from skill directories
- `iW0()` - Loads skills from plugins
- `Sv3()` - Orchestrates loading from both sources

### 2. Plugin Skills Loading

**From chunks.142.mjs:3586-3620:**
```javascript
iW0 = s1(async () => {
  g(">>>>> getPluginSkills CALLED <<<<<");
  let {
    enabled: A,
    errors: Q
  } = await l7(), B = [];

  if (Q.length > 0) g(`Plugin loading errors: ${Q.map((G)=>oM(G)).join(", ")}`);
  g(`getPluginSkills: Processing ${A.length} enabled plugins`);

  for (let G of A) {
    if (g(`Checking plugin ${G.name}: skillsPath=${G.skillsPath?"exists":"none"}, skillsPaths=${G.skillsPaths?G.skillsPaths.length:0} paths`),
        G.skillsPath) {
      g(`Attempting to load skills from plugin ${G.name} default skillsPath: ${G.skillsPath}`);
      try {
        let Z = await b69(G.skillsPath, G.name, G.source, G.manifest, G.path);
        B.push(...Z), g(`Loaded ${Z.length} skills from plugin ${G.name} default directory`)
      } catch (Z) {
        g(`Failed to load skills from plugin ${G.name} default directory: ${Z}`, {
          level: "error"
        })
      }
    }

    if (G.skillsPaths) {
      g(`Attempting to load skills from plugin ${G.name} skillsPaths: ${G.skillsPaths.join(", ")}`);
      for (let Z of G.skillsPaths) try {
        g(`Loading from skillPath: ${Z} for plugin ${G.name}`);
        let I = await b69(Z, G.name, G.source, G.manifest, G.path);
        B.push(...I), g(`Loaded ${I.length} skills from plugin ${G.name} custom path: ${Z}`)
      } catch (I) {
        g(`Failed to load skills from plugin ${G.name} custom path ${Z}: ${I}`, {
          level: "error"
        })
      }
    }
  }
  return g(`Total plugin skills loaded: ${B.length}`), B
})
```

**Loading Process:**
1. Fetch all enabled plugins via `l7()`
2. For each plugin, check for `skillsPath` (default skills directory)
3. Load skills from default directory using `b69()`
4. If plugin has `skillsPaths` array, load from each custom path
5. Aggregate all skills and return

### 3. Skill Configuration in Plugin Manifest

**From chunks.94.mjs:2500:**
```javascript
o45 = j.object({
  skills: j.union([
    Vh.describe("Path to additional skill directory (in addition to those in the skills/ directory, if it exists), relative to the plugin root"),
    j.array(Vh.describe("Path to additional skill directory (in addition to those in the skills/ directory, if it exists), relative to the plugin root"))
      .describe("List of paths to additional skill directories")
  ])
})
```

**Manifest Schema:**
```json
{
  "skills": "./custom-skills"  // Single path
}
```

Or:
```json
{
  "skills": [
    "./skills-dir-1",
    "./skills-dir-2"
  ]  // Multiple paths
}
```

### 4. Skill Directory Scanning

**From chunks.95.mjs:853-865:**
```javascript
if (G.skills) {
  let K = Array.isArray(G.skills) ? G.skills : [G.skills];
  for (let D of K) V(D)
}

// Standard directories that are automatically scanned
let F = ["commands", "agents", "skills", "hooks", "output-styles"];
for (let K of F) {
  let D = A8(A, K);
  if (Z.existsSync(D)) oAA(D, A8(I, K))
}
```

### 5. Skill File Loading Implementation

**From chunks.142.mjs:3382-3450:**
```javascript
// ============================================
// b69 - Load skills from a directory
// Location: chunks.142.mjs:3382
// ============================================
async function b69(skillsPath, pluginName, source, manifest, pluginPath) {
  let fs = RA(),  // File system module
    skills = [];

  try {
    if (!fs.existsSync(skillsPath)) return [];

    // Check for SKILL.md in root directory
    let rootSkillPath = sXA(skillsPath, "SKILL.md");
    if (fs.existsSync(rootSkillPath)) {
      try {
        let fileContent = fs.readFileSync(rootSkillPath, { encoding: "utf-8" }),
          { frontmatter, content } = NV(fileContent),  // Parse markdown frontmatter
          skillName = `${pluginName}:${rXA(skillsPath)}`,  // Generate skill name
          skillData = {
            filePath: rootSkillPath,
            baseDir: Ka(rootSkillPath),
            frontmatter,
            content
          },
          skill = RjA(skillName, skillData, source, manifest, pluginPath, true, {
            isSkillMode: true
          });
        if (skill) skills.push(skill);
      } catch (error) {
        g(`Failed to load skill from ${rootSkillPath}: ${error}`, {
          level: "error"
        });
      }
      return skills;
    }

    // Scan subdirectories for SKILL.md files
    let entries = fs.readdirSync(skillsPath);
    for (let entry of entries) {
      if (!entry.isDirectory() && !entry.isSymbolicLink()) continue;

      let dirPath = sXA(skillsPath, entry.name),
        skillFilePath = sXA(dirPath, "SKILL.md");

      if (fs.existsSync(skillFilePath)) {
        try {
          let fileContent = fs.readFileSync(skillFilePath, { encoding: "utf-8" }),
            { frontmatter, content } = NV(fileContent),
            skillName = `${pluginName}:${entry.name}`,
            skillData = {
              filePath: skillFilePath,
              baseDir: Ka(skillFilePath),
              frontmatter,
              content
            },
            skill = RjA(skillName, skillData, source, manifest, pluginPath, true, {
              isSkillMode: true
            });
          if (skill) skills.push(skill);
        } catch (error) {
          g(`Failed to load skill from ${skillFilePath}: ${error}`, {
            level: "error"
          });
        }
      }
    }
  } catch (error) {
    g(`Failed to load skills from directory ${skillsPath}: ${error}`, {
      level: "error"
    });
  }

  return skills;
}
```

**Loading Logic:**
1. Check if skills directory exists
2. Look for `SKILL.md` in root directory first
3. If found, parse and register as skill
4. Otherwise, scan subdirectories for `SKILL.md` files
5. Each skill is parsed with frontmatter and content
6. Skill name format: `pluginName:directoryName`
7. Errors are logged but don't stop other skills from loading

### 6. Skill Directory Commands Loading

**From chunks.152.mjs:1115-1134:**
```javascript
// ============================================
// VK0 - Load skill directory commands (memoized)
// Location: chunks.152.mjs:1115
// ============================================
VK0 = s1(async () => {
  // Skill directories from different sources
  let managedSkillsDir = tg(iw(), ".claude", "skills"),      // Policy/managed
    userSkillsDir = tg(MQ(), "skills"),                      // User settings
    projectSkillsDir = tg(W0(), ".claude", "skills");        // Project settings

  g(`Loading skills from directories: managed=${managedSkillsDir}, user=${userSkillsDir}, project=${projectSkillsDir}`);

  // Load from all three locations in parallel
  let [managedSkills, userSkills, projectSkills] = await Promise.all([
    XK0(managedSkillsDir, "policySettings"),
    EH("userSettings") ? XK0(userSkillsDir, "userSettings") : Promise.resolve([]),
    EH("projectSettings") ? XK0(projectSkillsDir, "projectSettings") : Promise.resolve([])
  ]);

  let allSkills = [...managedSkills, ...userSkills, ...projectSkills],
    uniqueSkills = [],
    seenFilePaths = new Map();  // Deduplication map

  // Deduplicate skills by file path
  for (let skill of allSkills) {
    if (skill.type !== "prompt") continue;

    let skillPath = skill.source === "policySettings"
      ? tg(iw(), ".claude", "skills", skill.name)
      : skill.source === "userSettings"
      ? tg(MQ(), "skills", skill.name)
      : tg(W0(), ".claude", "skills", skill.name),
      skillFilePath = tg(skillPath, "SKILL.md"),
      existingPath = seenFilePaths.get(skill.name);

    if (existingPath && Iv3(existingPath, skillFilePath)) {
      g(`Skipping duplicate skill '${skill.name}' from ${skill.source} (same file as earlier source)`);
      continue;
    }

    seenFilePaths.set(skill.name, skillFilePath);
    uniqueSkills.push(skill);
  }

  if (uniqueSkills.length < allSkills.length) {
    g(`Deduplicated ${allSkills.length - uniqueSkills.length} duplicate skills`);
  }

  g(`Loaded ${uniqueSkills.length} unique skills (managed: ${managedSkills.length}, user: ${userSkills.length}, project: ${projectSkills.length}, duplicates removed: ${allSkills.length - uniqueSkills.length})`);

  return uniqueSkills;
});
```

**Key Features:**
- **Three-tier loading**: Managed settings, user settings, project settings
- **Parallel loading**: Uses `Promise.all()` for performance
- **Deduplication**: Tracks file paths to avoid loading same skill twice
- **Conditional loading**: Respects settings permissions (EH checks)
- **Memoization**: Result cached via `s1()` until cleared

**Directory Structure:**
```
plugin-root/
├── skills/                    # Default skills directory (auto-scanned)
│   ├── skill-1.md
│   ├── skill-2.md
│   └── ...
├── custom-skills/             # Additional skills (from manifest)
│   └── ...
└── .claude-plugin/
    └── plugin.json            # Manifest with skills config
```

## Skill Execution Mechanism

Skills are treated as command templates:

1. **Discovery**: Skills are loaded during initialization or when plugins are refreshed
2. **Registration**: Each skill becomes a callable command
3. **Invocation**: User can invoke skill like any command
4. **Execution**: Skill's markdown content is processed as a prompt template

### Skill Aggregation

**From chunks.152.mjs:2153-2168:**
```javascript
// ============================================
// Sv3 - Get all skills (directory + plugin skills)
// Location: chunks.152.mjs:2153
// ============================================
async function Sv3() {
  try {
    // Load skills from both sources in parallel
    let [skillDirCommands, pluginSkills] = await Promise.all([
      VK0().catch((error) => {
        AA(error instanceof Error ? error : Error("Failed to load skill directory commands"));
        g("Skill directory commands failed to load, continuing without them");
        return [];
      }),
      iW0().catch((error) => {
        AA(error instanceof Error ? error : Error("Failed to load plugin skills"));
        g("Plugin skills failed to load, continuing without them");
        return [];
      })
    ]);

    g(`getSkills returning: ${skillDirCommands.length} skill dir commands, ${pluginSkills.length} plugin skills`);

    return {
      skillDirCommands,
      pluginSkills
    };
  } catch (error) {
    AA(error instanceof Error ? error : Error("Unexpected error loading skills"));
    g("Unexpected error in getSkills, returning empty");
    return {
      skillDirCommands: [],
      pluginSkills: []
    };
  }
}
```

**Aggregation Strategy:**
1. Load skills from skill directories (VK0)
2. Load skills from plugins (iW0)
3. Both load in parallel for performance
4. Errors are caught and logged, not propagated
5. Returns empty arrays on failure (graceful degradation)
6. Separates skill sources for potential differential handling

## Skill Preloading and Validation

### Caching
```javascript
// chunks.152.mjs - Skills use memoization via s1()
iW0 = s1(async () => {
  // Cached async function that loads plugin skills
  // Result is cached until cache is cleared
})

// Cache clearing
function nH9() {
  sE.cache?.clear?.(),
  OWA.cache?.clear?.(),
  n51.cache?.clear?.(),
  zI1(),
  f69(),  // Clears iW0 cache
  gC9()
}
```

### Error Handling
Skills loading is fault-tolerant:
- Individual plugin skill loading failures don't stop other plugins
- Errors are logged but don't crash the system
- Failed skills are skipped, successful ones are returned
- Errors are collected and reported to UI

```javascript
try {
  let Z = await b69(G.skillsPath, G.name, G.source, G.manifest, G.path);
  B.push(...Z)
} catch (Z) {
  g(`Failed to load skills from plugin ${G.name} default directory: ${Z}`, {
    level: "error"
  })
  // Continue processing other plugins
}
```

## Plugin Skills vs Skill Directory Commands

| Aspect | Skill Directory Commands | Plugin Skills |
|--------|--------------------------|---------------|
| Source | `VK0()` function | `iW0()` function |
| Location | Project-level `skills/` | Plugin `skills/` directories |
| Configuration | N/A | Via plugin manifest `skills` field |
| Loading | Direct directory scan | Plugin system integration |
| Caching | Via `s1()` memoization | Via `s1()` memoization |

## Skills in Agent Context

**From chunks.125.mjs:1543:**
```javascript
let W = Y.name || ai5(A).replace(/\.md$/, ""),
    V = [Q, ...B, W].join(":"),
    F = Y.description || Y["when-to-use"] || `Agent from ${Q} plugin`,
    K = k0A(Y.tools),
    D = UO(Y.skills),  // Skills can be specified in agent frontmatter
```

Skills can be referenced in agent definitions via frontmatter, allowing agents to use specific skill sets.

## Configuration Options

### Plugin Manifest Configuration

```json
{
  "name": "my-plugin",
  "skills": "./custom-skills"
}
```

Or with multiple directories:

```json
{
  "name": "my-plugin",
  "skills": [
    "./skills-core",
    "./skills-advanced"
  ]
}
```

### Skill File Format

Skills are markdown files with optional frontmatter:

```markdown
---
name: my-skill
description: What this skill does
when-to-use: When to use this skill
tools: ["Read", "Grep"]  # Optional tool restrictions
---

# Skill Content

Your skill prompt content here...
```

## Summary

Skills provide a powerful extension mechanism for Claude Code:

1. **Flexible Loading**: From both project directories and plugins
2. **Plugin Integration**: Plugins can bundle skills via manifest configuration
3. **Performance**: Cached loading with memoization
4. **Fault Tolerance**: Individual skill failures don't crash the system
5. **Reusability**: Skills can be shared across projects and users via plugins

The skills system follows Claude Code's plugin architecture patterns, integrating seamlessly with the command system while maintaining clean separation between built-in and user-defined functionality.
