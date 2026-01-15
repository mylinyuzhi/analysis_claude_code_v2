# Custom Command Loading System (SKILL.md)

## Overview

Claude Code v2.1.7 supports custom slash commands loaded from markdown files (SKILL.md) with YAML frontmatter. Custom commands can be defined at managed, user, and project levels, enabling extensibility and team-specific workflows.

> Symbol mappings:
> - [symbol_index_core.md](../00_overview/symbol_index_core.md) - Core modules
> - [symbol_index_infra.md](../00_overview/symbol_index_infra.md) - Infrastructure modules

**Key loading functions:**
- `loadSkillDirectoryCommands` (lO0) - Load skills from all directory sources
- `loadPluginSkills` (tw0) - Load skills from enabled plugins
- `scanSkillDirectory` (cO0) - Scan a single directory for skills
- `parseFrontmatter` - Extract YAML frontmatter from markdown

---

## Quick Navigation

- [Custom Command Architecture](#custom-command-architecture)
- [Directory Sources](#directory-sources)
- [SKILL.md File Format](#skillmd-file-format)
- [Frontmatter Options](#frontmatter-options)
- [Loading Pipeline](#loading-pipeline)
- [Deduplication](#deduplication)

---

## Custom Command Architecture

```
SKILL.md Files
       │
       ├── ~/.claude/skills/           (managed/policy)
       ├── ~/user/config/.claude/skills/ (user)
       └── .claude/skills/             (project)
       │
       ▼
┌─────────────────────────────────────────────────────────────────┐
│  loadSkillDirectoryCommands (lO0)                               │
│  - Parallel scan of all sources                                 │
│  - Promise.all for performance                                  │
│  - Source tagging (policySettings, userSettings, projectSettings)│
└─────────────────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────────┐
│  scanSkillDirectory (cO0)                                       │
│  - Glob pattern: *.md, */SKILL.md                               │
│  - Read file contents                                           │
│  - Parse frontmatter                                            │
└─────────────────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────────┐
│  Inode Deduplication                                            │
│  - Same file across paths → deduplicate                         │
│  - Map<inode, source> for tracking                              │
│  - First source wins                                            │
└─────────────────────────────────────────────────────────────────┘
       │
       ▼
  Skill objects ready for use
```

---

## Directory Sources

Skills are loaded from three directory sources:

| Source | Path | Priority | Scope |
|--------|------|----------|-------|
| Managed/Policy | `~/.claude/skills/` | 1 (highest) | Organization-wide |
| User | `<user-config>/.claude/skills/` | 2 | User-specific |
| Project | `.claude/skills/` | 3 | Project-specific |

### Directory Loading (lO0)

```javascript
// ============================================
// loadSkillDirectoryCommands - Load skills from all sources
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
  ]);
  // ... deduplication logic
  return W
});

// READABLE (for understanding):
const loadSkillDirectoryCommands = memoize(async (context) => {
  // Define all source directories
  const userSkillsDir = path.join(getUserConfigDir(), "skills");
  const managedSkillsDir = path.join(getPolicyDir(), ".claude", "skills");
  const projectSkillsDirs = getProjectSkillDirs("skills", context);

  log(`Loading skills from: managed=${managedSkillsDir}, user=${userSkillsDir}, project=[${projectSkillsDirs.join(", ")}]`);

  // Load from all sources in parallel
  const [managedSkills, userSkills, projectSkillsArrays] = await Promise.all([
    scanSkillDirectory(managedSkillsDir, "policySettings"),
    isSettingEnabled("userSettings")
      ? scanSkillDirectory(userSkillsDir, "userSettings")
      : Promise.resolve([]),
    isSettingEnabled("projectSettings")
      ? Promise.all(projectSkillsDirs.map(dir => scanSkillDirectory(dir, "projectSettings")))
      : Promise.resolve([])
  ]);

  // Load legacy commands directory
  const legacyCommands = await loadLegacyCommands(context);

  // Combine all skills
  const allSkills = [...managedSkills, ...userSkills, ...projectSkillsArrays.flat(), ...legacyCommands];

  // Deduplicate by inode
  const uniqueSkills = deduplicateByInode(allSkills);

  log(`Loaded ${uniqueSkills.length} unique skills`);
  return uniqueSkills;
});

// Mapping: lO0→loadSkillDirectoryCommands, Q→userSkillsDir, B→managedSkillsDir,
//          G→projectSkillsDirs, cO0→scanSkillDirectory, iK→isSettingEnabled,
//          Y77→loadLegacyCommands
```

**Key features:**
- Parallel loading for performance (Promise.all)
- Conditional loading based on settings
- Legacy commands directory support
- Memoized for efficiency

---

## SKILL.md File Format

### Basic Structure

```markdown
---
name: my-skill
description: A custom skill that does something useful
allowed-tools: Read, Grep, Bash
model: sonnet
---

# My Custom Skill

This content becomes the prompt sent to Claude.

Arguments are available via $ARGUMENTS placeholder.

User provided: $ARGUMENTS
```

### File Placement Options

1. **Direct markdown file:** `~/.claude/skills/my-skill.md`
2. **Directory with SKILL.md:** `~/.claude/skills/my-skill/SKILL.md`

---

## Frontmatter Options

| Field | Type | Description | Default |
|-------|------|-------------|---------|
| `name` | string | Command name (e.g., "commit") | Filename |
| `description` | string | Help text shown in `/help` | Required |
| `aliases` | string[] | Alternative names | None |
| `allowed-tools` | string[] | Tools the skill can use | All tools |
| `model` | string | Model override (sonnet, opus, haiku) | Default model |
| `user-invocable` | boolean | Can users invoke directly? | true |
| `disable-model-invocation` | boolean | Prevent LLM from calling | false |
| `when-to-use` | string | Guidance for when to use skill | None |
| `progress-message` | string | Message while executing | "running" |
| `context` | string | Execution context ("fork" for subagent) | main |
| `hooks` | object | Hook definitions | None |

### Example with All Options

```markdown
---
name: review
description: Review code changes for issues and improvements
aliases:
  - r
  - cr
allowed-tools:
  - Read
  - Grep
  - Bash
model: sonnet
user-invocable: true
when-to-use: When the user wants code reviewed or asks about code quality
progress-message: Reviewing code...
context: main
hooks:
  PostToolUse:
    - matcher: Bash
      hooks:
        - type: post-tool-use
          command: echo "Bash command completed"
---

# Code Review

Please review the following code changes and provide feedback.

$ARGUMENTS
```

---

## Loading Pipeline

### Skill Scanning (cO0)

```javascript
// ============================================
// scanSkillDirectory - Scan directory for skill files
// Location: chunks.133.mjs (inferred from lO0 calls)
// ============================================

// READABLE pseudocode:
async function scanSkillDirectory(directory, source) {
  if (!directoryExists(directory)) return [];

  const skills = [];

  // Scan for direct .md files
  const mdFiles = await glob("*.md", { cwd: directory });
  for (const file of mdFiles) {
    const skill = await loadSkillFile(path.join(directory, file), source);
    if (skill) skills.push(skill);
  }

  // Scan for SKILL.md in subdirectories
  const subdirs = await readdir(directory);
  for (const subdir of subdirs) {
    const skillPath = path.join(directory, subdir, "SKILL.md");
    if (fileExists(skillPath)) {
      const skill = await loadSkillFile(skillPath, source);
      if (skill) skills.push(skill);
    }
  }

  return skills;
}
```

### Skill File Loading

```javascript
// READABLE pseudocode:
async function loadSkillFile(filePath, source) {
  const content = await readFile(filePath, "utf-8");
  const { frontmatter, content: body } = parseFrontmatter(content);

  return {
    type: "prompt",
    name: frontmatter.name || path.basename(filePath, ".md"),
    description: frontmatter.description,
    aliases: parseArray(frontmatter.aliases),
    allowedTools: parseArray(frontmatter["allowed-tools"]),
    model: frontmatter.model,
    userInvocable: frontmatter["user-invocable"] !== "false",
    disableModelInvocation: frontmatter["disable-model-invocation"] === "true",
    whenToUse: frontmatter["when-to-use"],
    progressMessage: frontmatter["progress-message"] || "running",
    context: frontmatter.context,
    hooks: parseHooks(frontmatter.hooks),
    source: source,
    loadedFrom: "skills",
    filePath: filePath,

    isEnabled: () => true,
    userFacingName: () => frontmatter.name || path.basename(filePath, ".md"),

    getPromptForCommand: async (args, context) => {
      // Replace $ARGUMENTS with actual arguments
      const prompt = body.replace(/\$ARGUMENTS/g, args);
      return [{ type: "text", text: prompt }];
    }
  };
}
```

---

## Deduplication

### Inode-Based Deduplication

Skills are deduplicated by filesystem inode to prevent loading the same file multiple times (e.g., when a skill is symlinked across directories).

```javascript
// ============================================
// Inode deduplication in lO0
// Location: chunks.133.mjs:2074-2095
// ============================================

// ORIGINAL (for source lookup):
let X = await Y77(A), I = [...Z, ...Y, ...J.flat(), ...X], D = new Map, W = [];
for (let {
    skill: V,
    filePath: F
  }
  of I) {
  if (V.type !== "prompt") continue;
  let H = A77(F);
  if (H === null) {
    W.push(V);
    continue
  }
  let E = D.get(H);
  if (E !== void 0) {
    k(`Skipping duplicate skill '${V.name}' from ${V.source} (same inode already loaded from ${E})`);
    continue
  }
  D.set(H, V.source), W.push(V)
}
let K = I.length - W.length;
if (K > 0) k(`Deduplicated ${K} skills (same inode)`);

// READABLE (for understanding):
const legacyCommands = await loadLegacyCommands(context);
const allSkills = [...managedSkills, ...userSkills, ...projectSkillsArrays.flat(), ...legacyCommands];

const inodeMap = new Map();  // inode → source
const uniqueSkills = [];

for (const { skill, filePath } of allSkills) {
  // Only process prompt-type skills
  if (skill.type !== "prompt") continue;

  // Get file inode
  const inode = getFileInode(filePath);

  // If inode is null (e.g., virtual file), include it
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

  // Track inode and add skill
  inodeMap.set(inode, skill.source);
  uniqueSkills.push(skill);
}

const deduplicatedCount = allSkills.length - uniqueSkills.length;
if (deduplicatedCount > 0) {
  log(`Deduplicated ${deduplicatedCount} skills (same inode)`);
}

// Mapping: A77→getFileInode, D→inodeMap, W→uniqueSkills, K→deduplicatedCount
```

**Why inode deduplication:**
- Symlinked skills appear in multiple directories
- Same file can be referenced from managed, user, and project paths
- First occurrence wins (priority order: managed → user → project)

---

## Plugin Skills Integration

In addition to directory-based skills, plugins can provide skills through their manifest:

```javascript
// Plugin manifest can specify skill paths:
{
  "name": "my-plugin",
  "skillsPath": "./skills",        // Default skills directory
  "skillsPaths": [                  // Additional skill directories
    "./custom-skills",
    "./experimental-skills"
  ]
}
```

See: [25_plugin/skill_integration.md](../25_plugin/skill_integration.md)

---

## Argument Replacement

The `$ARGUMENTS` placeholder in skill content is replaced with user-provided arguments:

```javascript
// Example skill content:
"Please review these files: $ARGUMENTS"

// User invokes: /review src/main.ts src/utils.ts
// Result: "Please review these files: src/main.ts src/utils.ts"
```

---

## Legacy Commands Support

For backward compatibility, v2.1.7 also loads from the legacy `commands/` directory:

| Legacy Path | New Path |
|------------|----------|
| `~/.claude/commands/` | `~/.claude/skills/` |
| `.claude/commands/` | `.claude/skills/` |

The `loadLegacyCommands` function (Y77) handles this migration path.

---

## Related Modules

- [parsing.md](./parsing.md) - Command parsing
- [execution.md](./execution.md) - Command execution flow
- [builtin_commands.md](./builtin_commands.md) - Built-in slash commands
- [10_skill/loading.md](../10_skill/loading.md) - Skill loading pipeline details
- [25_plugin/skill_integration.md](../25_plugin/skill_integration.md) - Plugin skill integration
