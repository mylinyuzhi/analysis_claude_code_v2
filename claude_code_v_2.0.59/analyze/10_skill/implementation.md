# Skill System Implementation

## Related Symbols

> Symbol mappings: [symbol_index.md](../00_overview/symbol_index.md#module-skill-system)

Key functions in this document:
- `SkillTool` (ln) - Main skill tool definition
- `loadSkillsFromDirectory` (XK0) - Loads skills from a single directory
- `loadSkillDirectoryCommands` (VK0) - Loads skills from all three tiers
- `getSkillsFromAllSources` (Sv3) - Aggregates skill and plugin skills
- `getAllCommands` (sE) - Master aggregator for all commands
- `getModelInvokableSkills` (OWA) - Filters skills invokable by LLM
- `processSlashCommand` (s61) - Processes skill invocation
- `processPromptCommand` (kP2) - Generates skill prompt messages
- `parseFrontmatter` (NV) - Parses YAML frontmatter from markdown

---

## 1. Overview

Skills in Claude Code are reusable AI-powered operations defined in `SKILL.md` files. They allow users to create domain-specific capabilities that Claude can autonomously invoke to complete tasks more effectively.

### 1.1 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        SKILL SYSTEM ARCHITECTURE                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    LLM INVOCATION LAYER                          │  │
│  │  ┌──────────────┐    ┌─────────────────┐    ┌────────────────┐  │  │
│  │  │  SkillTool   │    │ SlashCommandTool│    │  Other Tools   │  │  │
│  │  │     (ln)     │    │      (cP)       │    │                │  │  │
│  │  └──────┬───────┘    └────────┬────────┘    └────────────────┘  │  │
│  └─────────┼────────────────────┼───────────────────────────────────┘  │
│            │                    │                                       │
│            ▼                    ▼                                       │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    COMMAND PROCESSING LAYER                      │  │
│  │  ┌────────────────────────────────────────────────────────────┐  │  │
│  │  │  processSlashCommand (s61) → processPromptCommand (kP2)    │  │  │
│  │  └────────────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                              │                                          │
│                              ▼                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    SKILL DISCOVERY LAYER                         │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐               │  │
│  │  │    OWA()    │  │   Z71()     │  │   n51()     │               │  │
│  │  │ Model-Only  │  │Slash Cmds   │  │   Hybrid    │               │  │
│  │  │   Skills    │  │   Only      │  │   Skills    │               │  │
│  │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘               │  │
│  │         └────────────────┼────────────────┘                      │  │
│  │                          ▼                                       │  │
│  │  ┌────────────────────────────────────────────────────────────┐  │  │
│  │  │              getAllCommands (sE) - Master Aggregator       │  │  │
│  │  └────────────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                              │                                          │
│                              ▼                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    LOADING LAYER (Parallel)                      │  │
│  │                                                                   │  │
│  │   Promise.all([fC9(), Sv3(), PQA(), jv3()])                      │  │
│  │       │            │       │        │                            │  │
│  │       ▼            ▼       ▼        ▼                            │  │
│  │   Custom       Skills  Plugins  Context                          │  │
│  │   Commands      │                                                │  │
│  │                 ▼                                                │  │
│  │         ┌───────────────────┐                                    │  │
│  │         │ getSkillsFromAll  │                                    │  │
│  │         │   Sources (Sv3)   │                                    │  │
│  │         └─────────┬─────────┘                                    │  │
│  │                   │ Promise.all([VK0(), iW0()])                  │  │
│  │                   ▼                                              │  │
│  │         ┌─────────────────────────────────┐                      │  │
│  │         │  Skill Dirs  │  Plugin Skills   │                      │  │
│  │         │    (VK0)     │     (iW0)        │                      │  │
│  │         └─────────────────────────────────┘                      │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                              │                                          │
│                              ▼                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    FILE SYSTEM LAYER                             │  │
│  │                                                                   │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐                  │  │
│  │  │  Managed   │  │    User    │  │  Project   │                  │  │
│  │  │  Skills    │  │   Skills   │  │  Skills    │                  │  │
│  │  │ (policy)   │  │  (~/.claude)│ │(./.claude) │                  │  │
│  │  └────────────┘  └────────────┘  └────────────┘                  │  │
│  │                                                                   │  │
│  │  Directory: ~/.claude/skills/<skill-name>/SKILL.md               │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Skills vs Slash Commands

| Aspect | Skills | Slash Commands |
|--------|--------|----------------|
| File name | `SKILL.md` (exact name) | Any `*.md` file |
| `isSkill` flag | `true` | `false` |
| Directory structure | Subdirectory required | Can be flat |
| LLM invocation | Via SkillTool | Via SlashCommandTool |
| Filter function | `OWA()` | `Z71()` |
| Progress message | `"loading"` (in metadata) | `"running"` |
| `isHidden` | `true` | `false` |
| Purpose | LLM-invokable operations | User-invokable commands |

### 1.3 Key Terminology

- **Skill**: A SKILL.md-based definition that Claude can autonomously invoke
- **Slash Command**: A user-facing command invoked with `/command` syntax
- **Model-invokable**: Skills that can be invoked by the LLM via SkillTool
- **Frontmatter**: YAML metadata at the top of markdown files
- **Token Budget**: Character limit for skills shown to LLM (default: 15,000)
- **Context Modifier**: Function that modifies execution context after skill runs

---

## 2. Skill Definition & Structure

### 2.1 SKILL.md File Format

Skills are defined in `SKILL.md` files with YAML frontmatter followed by markdown content:

```markdown
---
name: my-skill-name
description: What this skill does
when_to_use: When Claude should invoke this skill
allowed-tools: ["Read", "Grep", "Glob", "Edit"]
model: sonnet
disable-model-invocation: false
argument-hint: <optional arguments>
version: 1.0
---

# Skill Title

Your skill instructions here...

$ARGUMENTS
```

### 2.2 Frontmatter Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | No | Display name (defaults to directory name) |
| `description` | string | No | Skill description (auto-extracted from first heading if missing) |
| `when_to_use` | string | Yes* | Guidance for when LLM should invoke this skill |
| `allowed-tools` | string/array | No | Tools this skill can use |
| `model` | string | No | Model override (`sonnet`, `opus`, `inherit`) |
| `disable-model-invocation` | boolean | No | If `true`, skill cannot be invoked by LLM |
| `argument-hint` | string | No | Hint text for skill arguments |
| `version` | string | No | Skill version number |

*Required for skill to appear in LLM's available skills list

### 2.3 Frontmatter Parsing Algorithm

```javascript
// ============================================
// parseFrontmatter - Extracts YAML frontmatter from markdown
// Location: chunks.16.mjs:892-919
// ============================================

// ORIGINAL (for source lookup):
function NV(A) {
  let Q = /^---\s*\n([\s\S]*?)---\s*\n?/,
    B = A.match(Q);
  if (!B) return { frontmatter: {}, content: A };
  let G = B[1] || "", Z = A.slice(B[0].length), I = {}, Y = G.split(`\n`);
  for (let J of Y) {
    let W = J.indexOf(":");
    if (W > 0) {
      let X = J.slice(0, W).trim(), V = J.slice(W + 1).trim();
      if (X) { let F = V.replace(/^["']|["']$/g, ""); I[X] = F }
    }
  }
  return { frontmatter: I, content: Z }
}

// READABLE (for understanding):
function parseFrontmatter(fileContent) {
  // Match YAML frontmatter block: ---\nkey: value\n---
  let frontmatterRegex = /^---\s*\n([\s\S]*?)---\s*\n?/;
  let match = fileContent.match(frontmatterRegex);

  if (!match) return { frontmatter: {}, content: fileContent };

  let frontmatterBlock = match[1] || "";
  let contentAfterFrontmatter = fileContent.slice(match[0].length);
  let parsedFrontmatter = {};

  // Parse key: value pairs line by line
  let lines = frontmatterBlock.split('\n');
  for (let line of lines) {
    let colonIndex = line.indexOf(":");
    if (colonIndex > 0) {
      let key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();
      if (key) {
        // Remove surrounding quotes if present
        let cleanValue = value.replace(/^["']|["']$/g, "");
        parsedFrontmatter[key] = cleanValue;
      }
    }
  }

  return { frontmatter: parsedFrontmatter, content: contentAfterFrontmatter };
}

// Mapping: NV→parseFrontmatter, A→fileContent, Q→frontmatterRegex, B→match,
//          G→frontmatterBlock, Z→contentAfterFrontmatter, I→parsedFrontmatter
```

**How it works:**
1. Uses regex to match `---\n...\n---` pattern at file start
2. If no match, returns empty frontmatter with full content
3. Splits frontmatter block by newlines
4. Parses each line as `key: value` pair
5. Strips surrounding quotes from values
6. Returns both parsed frontmatter object and remaining content

**Why this approach:**
- **Simple line-by-line parsing** instead of full YAML parser: Reduces dependencies and bundle size. Skills only need simple key-value pairs, not nested YAML structures.
- **Quote stripping** handles both `"value"` and `'value'`: Users may use either style.
- **Graceful fallback**: If no frontmatter found, entire file becomes content - allows backwards compatibility.

**Key insight:** The frontmatter parser is intentionally minimal - it doesn't support nested YAML, arrays inline, or multi-line values. This is sufficient for skill metadata and avoids the complexity/size of a full YAML parser.

### 2.4 Skill Object Schema

When loaded, each skill becomes an object with these properties:

```typescript
interface SkillObject {
  // Identity
  type: "prompt";                    // Always "prompt" for skills
  name: string;                      // Directory name
  description: string;               // Computed: frontmatter.description || firstHeading
  source: "policySettings" | "userSettings" | "projectSettings";

  // Flags
  isSkill: true;                     // Distinguishes from slash commands
  isHidden: true;                    // Hidden from general command list
  isEnabled: () => boolean;          // Always returns true for skills
  disableModelInvocation: boolean;   // From frontmatter

  // Metadata
  hasUserSpecifiedDescription: boolean;
  whenToUse: string | undefined;     // Critical for LLM selection
  argumentHint: string | undefined;
  version: string | undefined;
  progressMessage: "running";        // Displayed during execution

  // Configuration
  allowedTools: string[];            // Tools skill can invoke
  model: string | undefined;         // Model override

  // Functions
  userFacingName(): string;          // Returns name or directory name
  getPromptForCommand(args: string, context: AppContext): Promise<ContentBlock[]>;
}
```

---

## 3. Skill Loading Pipeline

### 3.1 Three-Tier Directory Structure

Skills are loaded from three locations with defined priority:

```
1. MANAGED (policySettings) - Highest priority
   Location: {managed_data_dir}/.claude/skills/<skill-name>/SKILL.md

2. USER (userSettings)
   Location: ~/.claude/skills/<skill-name>/SKILL.md

3. PROJECT (projectSettings) - Lowest priority
   Location: {project_root}/.claude/skills/<skill-name>/SKILL.md
```

### Deduplication Algorithm

**What it does:** Removes duplicate skills when the same skill exists in multiple tiers.

**How it works:**
1. Load all skills from all tiers in parallel
2. Iterate through combined list in priority order (managed → user → project)
3. For each skill, compute its SKILL.md file path
4. Check if we've seen a skill with the same name before
5. If duplicate found, compare inodes (file system unique identifiers)
6. If same inode → skip (symlink to same file), if different → skip (different file, keep first)

**Why this approach:**
- **Inode comparison** instead of content hash: Faster (single stat call vs file read), handles symlinks correctly
- **Priority order preserved**: Managed skills override user skills override project skills
- **Name-based deduplication**: Uses skill directory name, not `name` frontmatter field

**Key insight:** The inode comparison handles the case where a user symlinks their project skill to a global skill - they get deduplicated correctly. Without inode comparison, you'd need expensive content comparison or always override.

### 3.2 Loading Pipeline Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     SKILL LOADING PIPELINE                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  getAllCommands (sE) - Master Aggregator                        │
│  Location: chunks.152.mjs:2266-2271                            │
│  │                                                              │
│  └─► Promise.all([                                              │
│         fC9(),      // Custom commands from directories         │
│         Sv3(),      // Skills (skill dirs + plugin skills)      │
│         PQA(),      // Plugin commands                          │
│         jv3()       // Context-based skills                     │
│      ])                                                         │
│                                                                 │
│  getSkillsFromAllSources (Sv3)                                  │
│  Location: chunks.152.mjs:2151-2168                            │
│  │                                                              │
│  └─► Promise.all([                                              │
│         VK0(),      // Skill directory commands                 │
│         iW0()       // Plugin skills                            │
│      ])                                                         │
│                                                                 │
│  loadSkillDirectoryCommands (VK0)                               │
│  Location: chunks.152.mjs:1115-1134                            │
│  │                                                              │
│  └─► Promise.all([                                              │
│         XK0(managedDir, "policySettings"),                      │
│         XK0(userDir, "userSettings"),                           │
│         XK0(projectDir, "projectSettings")                      │
│      ])                                                         │
│      │                                                          │
│      └─► Deduplication by inode comparison                      │
│                                                                 │
│  loadSkillsFromDirectory (XK0)                                  │
│  Location: chunks.152.mjs:1008-1093                            │
│  │                                                              │
│  └─► For each subdirectory:                                     │
│         1. Check for SKILL.md                                   │
│         2. Read file content                                    │
│         3. Parse frontmatter via NV()                           │
│         4. Create skill object                                  │
│         5. Define getPromptForCommand()                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 3.3 Single Directory Scanner Implementation

```javascript
// ============================================
// loadSkillsFromDirectory - Scans directory for SKILL.md files
// Location: chunks.152.mjs:1008-1093
// ============================================

// ORIGINAL (for source lookup):
async function XK0(A, Q) {
  let B = RA(), G = [];
  try {
    if (!B.existsSync(A)) return [];
    let Z = B.readdirSync(A);
    for (let I of Z) {
      if (!I.isDirectory() && !I.isSymbolicLink()) continue;
      let Y = tg(A, I.name), J = tg(Y, "SKILL.md");
      if (B.existsSync(J)) try {
        let W = B.readFileSync(J, { encoding: "utf-8" }),
          { frontmatter: X, content: V } = NV(W),
          F = I.name,
          K = X.description ?? Wx(V, "Skill"),
          D = UO(X["allowed-tools"]),
          H = X["argument-hint"],
          C = X.when_to_use,
          E = X.version,
          U = X.name,
          q = X["disable-model-invocation"],
          w = q === void 0 ? !1 : Y0(q),
          N = X.model === "inherit" ? void 0 : X.model,
          R = `${K} (${Pm(Q)})`;
        G.push({
          type: "prompt", name: F, description: R,
          hasUserSpecifiedDescription: !!X.description,
          allowedTools: D, argumentHint: H, whenToUse: C, version: E,
          model: N, isSkill: !0, disableModelInvocation: w,
          isEnabled: () => !0, isHidden: !0, progressMessage: "running",
          userFacingName() { return U || F },
          source: Q,
          async getPromptForCommand(T, y) {
            let v = `Base directory for this skill: ${Y}\n\n${V}`;
            if (T) {
              if (v.includes("$ARGUMENTS")) v = v.replaceAll("$ARGUMENTS", T);
              else v = v + `\n\nARGUMENTS: ${T}`;
            }
            return v = await Fa(v, { ...y, /* permission injection */ }, `/${F}`),
              [{ type: "text", text: v }]
          }
        })
      } catch (W) { AA(W instanceof Error ? W : Error(String(W))) }
    }
  } catch (Z) { AA(Z instanceof Error ? Z : Error(String(Z))) }
  return G
}

// READABLE (for understanding):
async function loadSkillsFromDirectory(skillsBasePath, sourceType) {
  let fileSystem = getFileSystem();
  let loadedSkills = [];

  try {
    if (!fileSystem.existsSync(skillsBasePath)) return [];

    let entries = fileSystem.readdirSync(skillsBasePath);
    for (let entry of entries) {
      // Skip files, only process directories/symlinks
      if (!entry.isDirectory() && !entry.isSymbolicLink()) continue;

      let skillDir = joinPath(skillsBasePath, entry.name);
      let skillMdPath = joinPath(skillDir, "SKILL.md");

      if (fileSystem.existsSync(skillMdPath)) {
        try {
          let fileContent = fileSystem.readFileSync(skillMdPath, { encoding: "utf-8" });
          let { frontmatter, content } = parseFrontmatter(fileContent);

          let directoryName = entry.name;
          let description = frontmatter.description ?? extractFirstHeading(content, "Skill");
          let allowedTools = parseToolsArray(frontmatter["allowed-tools"]);
          let argumentHint = frontmatter["argument-hint"];
          let whenToUse = frontmatter.when_to_use;
          let version = frontmatter.version;
          let displayName = frontmatter.name;
          let disableModelInvocation = parseBoolean(frontmatter["disable-model-invocation"] ?? false);
          let modelOverride = frontmatter.model === "inherit" ? undefined : frontmatter.model;
          let displayDescription = `${description} (${formatSourceLabel(sourceType)})`;

          loadedSkills.push({
            type: "prompt",
            name: directoryName,
            description: displayDescription,
            hasUserSpecifiedDescription: !!frontmatter.description,
            allowedTools: allowedTools,
            argumentHint: argumentHint,
            whenToUse: whenToUse,
            version: version,
            model: modelOverride,
            isSkill: true,                  // KEY: Marks as skill
            disableModelInvocation: disableModelInvocation,
            isEnabled: () => true,
            isHidden: true,                 // Hidden from general listing
            progressMessage: "running",
            userFacingName() { return displayName || directoryName },
            source: sourceType,

            async getPromptForCommand(userArguments, appContext) {
              // Inject base directory path
              let skillPrompt = `Base directory for this skill: ${skillDir}\n\n${content}`;

              // Handle $ARGUMENTS placeholder or append
              if (userArguments) {
                if (skillPrompt.includes("$ARGUMENTS")) {
                  skillPrompt = skillPrompt.replaceAll("$ARGUMENTS", userArguments);
                } else {
                  skillPrompt = skillPrompt + `\n\nARGUMENTS: ${userArguments}`;
                }
              }

              // Process template and inject tool permissions
              skillPrompt = await processPromptTemplate(skillPrompt, {
                ...appContext,
                // Permission context modification
                async getAppState() {
                  let appState = await appContext.getAppState();
                  return {
                    ...appState,
                    toolPermissionContext: {
                      ...appState.toolPermissionContext,
                      alwaysAllowRules: {
                        ...appState.toolPermissionContext.alwaysAllowRules,
                        command: allowedTools  // Inject skill's allowed tools
                      }
                    }
                  };
                }
              }, `/${directoryName}`);

              return [{ type: "text", text: skillPrompt }];
            }
          });
        } catch (error) {
          logError(error instanceof Error ? error : Error(String(error)));
        }
      }
    }
  } catch (error) {
    logError(error instanceof Error ? error : Error(String(error)));
  }

  return loadedSkills;
}

// Mapping: XK0→loadSkillsFromDirectory, A→skillsBasePath, Q→sourceType, B→fileSystem,
//          G→loadedSkills, Z→entries, I→entry, Y→skillDir, J→skillMdPath
```

### 3.4 Three-Tier Loading with Deduplication

```javascript
// ============================================
// loadSkillDirectoryCommands - Loads skills from all three tiers
// Location: chunks.152.mjs:1115-1134
// ============================================

// ORIGINAL (for source lookup):
VK0 = s1(async () => {
  let A = tg(MQ(), "skills"),                    // User skills dir
    Q = tg(W0(), ".claude", "skills"),           // Project skills dir
    B = tg(iw(), ".claude", "skills");           // Managed skills dir
  g(`Loading skills from directories: managed=${B}, user=${A}, project=${Q}`);

  let [G, Z, I] = await Promise.all([
    XK0(B, "policySettings"),
    EH("userSettings") ? XK0(A, "userSettings") : Promise.resolve([]),
    EH("projectSettings") ? XK0(Q, "projectSettings") : Promise.resolve([])
  ]);

  let Y = [...G, ...Z, ...I], J = [], W = new Map;
  for (let X of Y) {
    if (X.type !== "prompt") continue;
    let V = X.source === "policySettings" ? tg(iw(), ".claude", "skills", X.name)
          : X.source === "userSettings" ? tg(MQ(), "skills", X.name)
          : tg(W0(), ".claude", "skills", X.name),
      F = tg(V, "SKILL.md"),
      K = W.get(X.name);
    if (K && Iv3(K, F)) {
      g(`Skipping duplicate skill '${X.name}' from ${X.source} (same file as earlier source)`);
      continue
    }
    W.set(X.name, F), J.push(X)
  }
  if (J.length < Y.length) g(`Deduplicated ${Y.length-J.length} duplicate skills`);
  return g(`Loaded ${J.length} unique skills`), J
});

// READABLE (for understanding):
loadSkillDirectoryCommands = memoize(async () => {
  let userSkillsDir = joinPath(getClaudeDataDir(), "skills");
  let projectSkillsDir = joinPath(getWorkingDir(), ".claude", "skills");
  let managedSkillsDir = joinPath(getManagedDir(), ".claude", "skills");

  log(`Loading skills from directories: managed=${managedSkillsDir}, user=${userSkillsDir}, project=${projectSkillsDir}`);

  // Load from all three tiers in parallel
  let [managedSkills, userSkills, projectSkills] = await Promise.all([
    loadSkillsFromDirectory(managedSkillsDir, "policySettings"),
    isSettingsEnabled("userSettings")
      ? loadSkillsFromDirectory(userSkillsDir, "userSettings")
      : Promise.resolve([]),
    isSettingsEnabled("projectSettings")
      ? loadSkillsFromDirectory(projectSkillsDir, "projectSettings")
      : Promise.resolve([])
  ]);

  let allSkills = [...managedSkills, ...userSkills, ...projectSkills];
  let uniqueSkills = [];
  let seenFilePaths = new Map();  // Track seen SKILL.md paths

  // Deduplicate by comparing inodes
  for (let skill of allSkills) {
    if (skill.type !== "prompt") continue;

    let skillDir = skill.source === "policySettings"
      ? joinPath(getManagedDir(), ".claude", "skills", skill.name)
      : skill.source === "userSettings"
      ? joinPath(getClaudeDataDir(), "skills", skill.name)
      : joinPath(getWorkingDir(), ".claude", "skills", skill.name);
    let skillFilePath = joinPath(skillDir, "SKILL.md");
    let existingPath = seenFilePaths.get(skill.name);

    // Check if this is a duplicate (same inode)
    if (existingPath && isSameFile(existingPath, skillFilePath)) {
      log(`Skipping duplicate skill '${skill.name}' from ${skill.source}`);
      continue;
    }

    seenFilePaths.set(skill.name, skillFilePath);
    uniqueSkills.push(skill);
  }

  if (uniqueSkills.length < allSkills.length) {
    log(`Deduplicated ${allSkills.length - uniqueSkills.length} duplicate skills`);
  }

  log(`Loaded ${uniqueSkills.length} unique skills`);
  return uniqueSkills;
});

// Mapping: VK0→loadSkillDirectoryCommands, A→userSkillsDir, Q→projectSkillsDir,
//          B→managedSkillsDir, G→managedSkills, Z→userSkills, I→projectSkills,
//          Y→allSkills, J→uniqueSkills, W→seenFilePaths
```

### 3.5 Caching Strategy

All skill loading functions are wrapped with `s1()` (memoization) for performance:

```javascript
// Memoization via s1()
VK0 = s1(async () => { ... });  // Skill directory commands
iW0 = s1(async () => { ... });  // Plugin skills
sE = s1(async () => { ... });   // All commands aggregator
OWA = s1(async () => { ... });  // Model-invokable skills filter

// Cache clearing
function clearAllSkillCaches() {
  sE.cache?.clear?.();      // Clear getAllCommands cache
  OWA.cache?.clear?.();     // Clear getModelInvokableSkills cache
  n51.cache?.clear?.();     // Clear getSlashCommandSkills cache
  zI1();                    // Additional cache clear
  f69();                    // Clear plugin skills cache
  gC9();                    // Clear skill directory cache
}
```

**Key insight:** Cache is only cleared explicitly via `nH9()` - there's no TTL-based expiration. This means skills are loaded once per session unless cache is manually invalidated.

---

## 4. Skill Candidate Selection

### 4.1 Filter Functions

Claude Code provides three filter functions to categorize commands:

```javascript
// ============================================
// Skill Filtering Functions
// Location: chunks.152.mjs:2273-2283
// ============================================

// Model-invokable skills (for SkillTool)
OWA = s1(async () => {
  return (await sE()).filter((Q) =>
    Q.type === "prompt" &&           // Must be prompt type
    Q.isSkill === true &&            // Must be skill (not command)
    !Q.disableModelInvocation &&     // Must allow model invocation
    Q.source !== "builtin" &&        // Not built-in
    (Q.hasUserSpecifiedDescription || Q.whenToUse)  // Must have docs
  )
});

// Slash commands (for SlashCommandTool)
Z71 = s1(async () => {
  return (await sE()).filter((Q) =>
    Q.type === "prompt" &&
    Q.isSkill !== true &&            // Must NOT be skill
    !Q.disableModelInvocation &&
    Q.source !== "builtin" &&
    (Q.hasUserSpecifiedDescription || Q.whenToUse)
  )
});

// Hybrid (slash command skills)
n51 = s1(async () => {
  return (await sE()).filter((Q) =>
    Q.type === "prompt" &&
    Q.source !== "builtin" &&
    (Q.hasUserSpecifiedDescription || Q.whenToUse) &&
    (Q.isSkill || Q.disableModelInvocation)  // Either skill OR model disabled
  )
});
```

### 4.2 Selection Criteria Explained

For a skill to appear in the LLM's available skills list (`OWA`):

| Criteria | Reason |
|----------|--------|
| `type === "prompt"` | Must be a prompt-based skill (not functional) |
| `isSkill === true` | Distinguishes from slash commands |
| `!disableModelInvocation` | Creator hasn't explicitly blocked LLM access |
| `source !== "builtin"` | Built-in commands have dedicated handling |
| `hasUserSpecifiedDescription OR whenToUse` | Must have documentation for LLM context |

### 4.3 Token Budget Algorithm

Skills shown to the LLM are limited by a character budget:

```javascript
// ============================================
// Token Budget Functions
// Location: chunks.130.mjs:2750-2770
// ============================================

// Get budget (default: 15,000 chars, configurable via env)
function getSkillTokenBudget() {
  return Number(process.env.SLASH_COMMAND_TOOL_CHAR_BUDGET) || 15000;
}

// Format single skill for prompt
function formatSkillForPrompt(skill) {
  let name = `/${skill.name}`;
  let argHint = skill.argumentHint ? ` ${skill.argumentHint}` : "";
  let whenToUse = skill.whenToUse ? `- ${skill.whenToUse}` : "";
  return `- ${name}${argHint}: ${skill.description} ${whenToUse}`.trim();
}

// Limit skills by budget
function limitCommandsByTokenBudget(skills) {
  let result = [];
  let currentChars = 0;

  for (let skill of skills) {
    let formatted = formatSkillForPrompt(skill);
    currentChars += formatted.length + 1;  // +1 for newline

    if (currentChars > getSkillTokenBudget()) break;  // Budget exceeded
    result.push(skill);
  }

  return result;
}
```

**Why 15,000 characters?**
- Prevents system prompt from becoming too large
- Leaves room for other context (CLAUDE.md, file contents, etc.)
- Configurable for users who need more/fewer skills

---

## 5. Skill Tool Implementation

### 5.1 Tool Definition

```javascript
// ============================================
// SkillTool - Complete tool definition
// Location: chunks.130.mjs:2555-2745
// ============================================

// Input schema
Ft5 = j.object({
  skill: j.string().describe('The skill name (no arguments). E.g., "pdf" or "xlsx"')
});

// Output schema
Kt5 = j.object({
  success: j.boolean().describe("Whether the skill is valid"),
  commandName: j.string().describe("The name of the skill"),
  allowedTools: j.array(j.string()).optional().describe("Tools allowed by this skill"),
  model: j.string().optional().describe("Model override if specified")
});

// Tool object
ln = {
  name: kq,                              // "Skill"
  inputSchema: Ft5,
  outputSchema: Kt5,

  description: async ({ skill }) => `Execute skill: ${skill}`,
  prompt: async () => _b2(),             // Dynamic prompt with available skills
  userFacingName: () => kq,

  isConcurrencySafe: () => false,        // Cannot run concurrently
  isEnabled: () => true,
  isReadOnly: () => false,               // Skills can modify state

  async validateInput({ skill }, context) { ... },
  async checkPermissions({ skill }, context) { ... },
  async call({ skill }, context, prevResult, assistantMsg) { ... },

  mapToolResultToToolResultBlockParam(result, toolUseId) {
    return {
      type: "tool_result",
      tool_use_id: toolUseId,
      content: `Launching skill: ${result.commandName}`
    };
  },

  // UI render functions
  renderToolResultMessage: Cd2,
  renderToolUseMessage: Ed2,
  renderToolUseProgressMessage: zd2,
  renderToolUseRejectedMessage: Ud2,
  renderToolUseErrorMessage: $d2
};
```

### 5.2 Input Validation

```javascript
// ============================================
// validateInput - Validates skill name before execution
// Location: chunks.130.mjs:2567-2602
// ============================================

// ORIGINAL (for source lookup):
async validateInput({ skill: A }, Q) {
  let B = A.trim();
  if (!B) return { result: !1, message: `Invalid skill format: ${A}`, errorCode: 1 };
  let G = B.startsWith("/") ? B.substring(1) : B, Z = await sE();
  if (!ph(G, Z)) return { result: !1, message: `Unknown skill: ${G}`, errorCode: 2 };
  let I = Pq(G, Z);
  if (!I) return { result: !1, message: `Could not load skill: ${G}`, errorCode: 3 };
  if (I.disableModelInvocation) return { result: !1, message: `Skill ${G} cannot be used with ${kq} tool due to disable-model-invocation`, errorCode: 4 };
  if (I.type !== "prompt") return { result: !1, message: `Skill ${G} is not a prompt-based skill`, errorCode: 5 };
  return { result: !0 }
}

// READABLE (for understanding):
async validateInput({ skill }, context) {
  let trimmedSkill = skill.trim();

  // Error code 1: Empty skill name
  if (!trimmedSkill) return {
    result: false,
    message: `Invalid skill format: ${skill}`,
    errorCode: 1
  };

  // Remove leading "/" if present
  let skillName = trimmedSkill.startsWith("/") ? trimmedSkill.substring(1) : trimmedSkill;

  // Load all available skills
  let allSkills = await getAllCommands();

  // Error code 2: Skill doesn't exist
  if (!commandExists(skillName, allSkills)) return {
    result: false,
    message: `Unknown skill: ${skillName}`,
    errorCode: 2
  };

  // Get skill object
  let skillObj = lookupCommand(skillName, allSkills);

  // Error code 3: Failed to load
  if (!skillObj) return {
    result: false,
    message: `Could not load skill: ${skillName}`,
    errorCode: 3
  };

  // Error code 4: Model invocation disabled
  if (skillObj.disableModelInvocation) return {
    result: false,
    message: `Skill ${skillName} cannot be used with Skill tool due to disable-model-invocation`,
    errorCode: 4
  };

  // Error code 5: Wrong type
  if (skillObj.type !== "prompt") return {
    result: false,
    message: `Skill ${skillName} is not a prompt-based skill`,
    errorCode: 5
  };

  return { result: true };
}

// Mapping: A→skill, Q→context, B→trimmedSkill, G→skillName, Z→allSkills, I→skillObj,
//          sE→getAllCommands, ph→commandExists, Pq→lookupCommand, kq→SKILL_TOOL_NAME
```

**How it works:**
1. Trims whitespace from skill name
2. Strips leading "/" if present (allows both "skill" and "/skill")
3. Loads ALL skills via cached `getAllCommands()`
4. Checks existence via `commandExists()` (checks name, userFacingName, aliases)
5. Retrieves full skill object via `lookupCommand()`
6. Validates skill is not disabled for model invocation
7. Validates skill is prompt-based (not functional)

**Why this approach:**
- **Early validation before permission check**: Avoids asking user permission for invalid skills
- **Error codes provide machine-readable failure reasons**: UI can handle different errors differently
- **Loads full skill set to check**: Ensures aliases and userFacingName are also matched
- **Separate existence check vs lookup**: `commandExists` is fast boolean check, `lookupCommand` does full retrieval

**Key insight:** The validation loads the ENTIRE skill set via `sE()` even for a single skill check. This seems inefficient, but skills are cached via memoization (`s1`), so repeated calls are O(1). The trade-off is simpler code vs micro-optimization.

**Error Codes Summary:**

| Code | Meaning | Cause |
|------|---------|-------|
| 1 | Invalid format | Empty or whitespace-only skill name |
| 2 | Unknown skill | Skill not found in any source |
| 3 | Load failed | Skill exists but couldn't be loaded |
| 4 | Model disabled | `disable-model-invocation: true` in frontmatter |
| 5 | Wrong type | Not a prompt-based skill |

### 5.3 Permission Checking with Wildcards

```javascript
// ============================================
// checkPermissions - Checks permission rules with wildcard support
// Location: chunks.130.mjs:2603-2659
// ============================================

// ORIGINAL (for source lookup):
async checkPermissions({ skill: A }, Q) {
  let B = A.trim(), G = B.startsWith("/") ? B.substring(1) : B,
    I = (await Q.getAppState()).toolPermissionContext, Y = await sE(), J = Pq(G, Y),
    W = (K) => {
      if (K === A) return !0;
      if (K.endsWith(":*")) { let D = K.slice(0, -2); return A.startsWith(D) }
      return !1
    },
    X = fU(I, ln, "deny");
  for (let [K, D] of X.entries()) if (W(K)) return { behavior: "deny", message: "Skill execution blocked by permission rules", decisionReason: { type: "rule", rule: D } };
  let V = fU(I, ln, "allow");
  for (let [K, D] of V.entries()) if (W(K)) return { behavior: "allow", updatedInput: { skill: A }, decisionReason: { type: "rule", rule: D } };
  let F = [{ type: "addRules", rules: [{ toolName: kq, ruleContent: A }], behavior: "allow", destination: "localSettings" }];
  return { behavior: "ask", message: `Execute skill: ${G}`, decisionReason: void 0, suggestions: F, metadata: { command: J } }
}

// READABLE (for understanding):
async checkPermissions({ skill }, context) {
  let trimmedSkill = skill.trim();
  let skillName = trimmedSkill.startsWith("/") ? trimmedSkill.substring(1) : trimmedSkill;

  let permissionContext = (await context.getAppState()).toolPermissionContext;
  let allSkills = await getAllCommands();
  let skillObj = lookupCommand(skillName, allSkills);

  // Wildcard matcher: "prefix:*" matches all skills starting with "prefix"
  let matchesRule = (ruleKey) => {
    if (ruleKey === skill) return true;
    if (ruleKey.endsWith(":*")) {
      let prefix = ruleKey.slice(0, -2);  // Remove ":*"
      return skill.startsWith(prefix);
    }
    return false;
  };

  // Check DENY rules first (deny takes precedence)
  let denyRules = getRulesForTool(permissionContext, ln, "deny");
  for (let [ruleKey, rule] of denyRules.entries()) {
    if (matchesRule(ruleKey)) return {
      behavior: "deny",
      message: "Skill execution blocked by permission rules",
      decisionReason: { type: "rule", rule: rule }
    };
  }

  // Check ALLOW rules
  let allowRules = getRulesForTool(permissionContext, ln, "allow");
  for (let [ruleKey, rule] of allowRules.entries()) {
    if (matchesRule(ruleKey)) return {
      behavior: "allow",
      updatedInput: { skill: skill },
      decisionReason: { type: "rule", rule: rule }
    };
  }

  // No matching rule - ask user with suggestions
  let suggestions = [{
    type: "addRules",
    rules: [{ toolName: kq, ruleContent: skill }],
    behavior: "allow",
    destination: "localSettings"
  }];

  return {
    behavior: "ask",
    message: `Execute skill: ${skillName}`,
    decisionReason: undefined,
    suggestions: suggestions,
    metadata: { command: skillObj }
  };
}

// Mapping: A→skill, Q→context, B→trimmedSkill, G→skillName, I→permissionContext,
//          Y→allSkills, J→skillObj, W→matchesRule, X→denyRules, V→allowRules, F→suggestions,
//          fU→getRulesForTool, ln→SkillTool, kq→SKILL_TOOL_NAME
```

**How it works:**
1. Normalizes skill name (trim, strip leading "/")
2. Gets permission context from app state
3. Defines `matchesRule()` closure for wildcard pattern matching
4. Checks DENY rules first - **deny always wins**
5. Checks ALLOW rules second
6. If no rule matches, returns "ask" with pre-built suggestions for user

**Why this approach:**
- **Deny-first evaluation**: Security best practice - explicit denies cannot be overridden by allows
- **Wildcard pattern `prefix:*`**: Allows batch permission for plugin skills (e.g., `ms-office:*` allows all MS Office plugin skills)
- **Suggestions for "ask"**: Reduces friction - user can one-click approve
- **Saves to localSettings**: Project-specific permissions, not global

**Key insight:** The wildcard pattern uses `:*` suffix (not `*` alone) to avoid accidental matches. Pattern `my-skill*` would be ambiguous, but `my-skill:*` clearly indicates "all skills in my-skill namespace". This mirrors common permission patterns in other systems.

**Wildcard Pattern Matching:**
- Exact match: `"my-skill"` matches only `"my-skill"`
- Prefix match: `"plugin:*"` matches `"plugin:pdf"`, `"plugin:xlsx"`, etc.
- NOT a wildcard: `"my-*"` (must end with `:*` not just `*`)

### 5.4 Call Method and Context Modifier

```javascript
// ============================================
// call - Executes skill and returns context modifier
// Location: chunks.130.mjs:2660-2731
// ============================================

// ORIGINAL (for source lookup):
async call({ skill: A }, Q, B, G) {
  let Z = A.trim(), I = Z.startsWith("/") ? Z.substring(1) : Z, Y = await sE(), J = await s61(I, "", Y, Q);
  if (!J.shouldQuery) throw Error("Command processing failed");
  let W = J.allowedTools || [], X = J.model, V = J.maxThinkingTokens, F = Ny().has(I) ? I : "custom";
  GA("tengu_skill_tool_invocation", { command_name: F });
  let K = B71(G, kq), D = Q71(J.messages.filter((H) => {
    if (H.type === "progress") return !1;
    if (H.type === "user" && "message" in H) { let C = H.message.content; if (typeof C === "string" && C.includes("<command-message>")) return !1 }
    return !0
  }), K);
  return g(`SkillTool returning ${D.length} newMessages for skill ${I}`), {
    data: { success: !0, commandName: I, allowedTools: W.length > 0 ? W : void 0, model: X },
    newMessages: D,
    contextModifier(H) {
      let C = H;
      if (W.length > 0) C = { ...C, async getAppState() { let E = await Q.getAppState(); return { ...E, toolPermissionContext: { ...E.toolPermissionContext, alwaysAllowRules: { ...E.toolPermissionContext.alwaysAllowRules, command: [...new Set([...E.toolPermissionContext.alwaysAllowRules.command || [], ...W])] } } } } };
      if (X) C = { ...C, options: { ...C.options, mainLoopModel: X } };
      if (V !== void 0) C = { ...C, options: { ...C.options, maxThinkingTokens: V } };
      return C
    }
  }
}

// READABLE (for understanding):
async call({ skill }, context, previousResult, assistantMessage) {
  let trimmedSkill = skill.trim();
  let skillName = trimmedSkill.startsWith("/") ? trimmedSkill.substring(1) : trimmedSkill;

  // Load skills and process
  let allSkills = await getAllCommands();
  let processResult = await processSlashCommand(skillName, "", allSkills, context);

  if (!processResult.shouldQuery) {
    throw Error("Command processing failed");
  }

  let allowedTools = processResult.allowedTools || [];
  let modelOverride = processResult.model;
  let maxThinkingTokens = processResult.maxThinkingTokens;

  // Telemetry - track skill usage
  let commandType = getBuiltinCommandNames().has(skillName) ? skillName : "custom";
  analyticsEvent("tengu_skill_tool_invocation", { command_name: commandType });

  // Extract tool use ID for message tagging
  let toolUseId = extractToolUseId(assistantMessage, kq);

  // Filter messages (remove progress and command-message metadata tags)
  let filteredMessages = processResult.messages.filter((msg) => {
    if (msg.type === "progress") return false;
    if (msg.type === "user" && "message" in msg) {
      let content = msg.message.content;
      if (typeof content === "string" && content.includes("<command-message>")) return false;
    }
    return true;
  });

  // Tag messages with source tool use ID for traceability
  let taggedMessages = tagMessagesWithSource(filteredMessages, toolUseId);

  log(`SkillTool returning ${taggedMessages.length} newMessages for skill ${skillName}`);

  return {
    data: {
      success: true,
      commandName: skillName,
      allowedTools: allowedTools.length > 0 ? allowedTools : undefined,
      model: modelOverride
    },
    newMessages: taggedMessages,

    // Context modifier - modifies context for subsequent LLM calls
    contextModifier(currentContext) {
      let modifiedContext = currentContext;

      // Inject allowed tools into permission context
      if (allowedTools.length > 0) {
        modifiedContext = {
          ...modifiedContext,
          async getAppState() {
            let appState = await context.getAppState();
            return {
              ...appState,
              toolPermissionContext: {
                ...appState.toolPermissionContext,
                alwaysAllowRules: {
                  ...appState.toolPermissionContext.alwaysAllowRules,
                  command: [...new Set([
                    ...appState.toolPermissionContext.alwaysAllowRules.command || [],
                    ...allowedTools
                  ])]
                }
              }
            };
          }
        };
      }

      // Apply model override
      if (modelOverride) {
        modifiedContext = {
          ...modifiedContext,
          options: {
            ...modifiedContext.options,
            mainLoopModel: modelOverride
          }
        };
      }

      // Apply max thinking tokens
      if (maxThinkingTokens !== undefined) {
        modifiedContext = {
          ...modifiedContext,
          options: {
            ...modifiedContext.options,
            maxThinkingTokens: maxThinkingTokens
          }
        };
      }

      return modifiedContext;
    }
  };
}

// Mapping: A→skill, Q→context, B→previousResult, G→assistantMessage, Z→trimmedSkill,
//          I→skillName, Y→allSkills, J→processResult, W→allowedTools, X→modelOverride,
//          V→maxThinkingTokens, F→commandType, K→toolUseId, D→taggedMessages,
//          sE→getAllCommands, s61→processSlashCommand, Ny→getBuiltinCommandNames,
//          GA→analyticsEvent, B71→extractToolUseId, Q71→tagMessagesWithSource
```

**How it works:**
1. Normalizes skill name
2. Processes skill via `processSlashCommand()` → generates prompt messages
3. Extracts allowed tools, model override, thinking tokens from result
4. Filters out metadata messages (`<command-message>` tags, progress)
5. Tags remaining messages with tool use ID for tracing
6. Returns `contextModifier` closure that modifies subsequent context

**Why this approach:**
- **Context Modifier pattern**: Instead of directly modifying global state, returns a function that lazily modifies context. This allows skill effects to be scoped to subsequent turns only.
- **Message filtering**: `<command-message>` tags are for UI display only, not for LLM consumption
- **Tool use ID tagging**: Enables tracing which messages came from which skill invocation
- **Deduplication via Set**: `[...new Set([...existing, ...new])]` prevents duplicate tool entries

**Key insight:** The `contextModifier` is a closure that captures the skill's `allowedTools`, `model`, and `maxThinkingTokens`. This closure is called by the main loop AFTER the current turn completes, modifying context for the NEXT LLM call. This is how skills can grant temporary permissions - they're scoped to the skill's execution context.

---

## 6. Skill Execution Pipeline

### 6.1 Step-by-Step Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    SKILL EXECUTION PIPELINE                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. LLM INVOCATION                                              │
│     └─► LLM calls SkillTool with { skill: "skill-name" }        │
│                                                                 │
│  2. INPUT VALIDATION (validateInput)                            │
│     ├─► Trim and normalize skill name                           │
│     ├─► Load all skills via sE()                                │
│     ├─► Check skill exists via ph()                             │
│     ├─► Load skill object via Pq()                              │
│     ├─► Verify not disableModelInvocation                       │
│     └─► Verify type === "prompt"                                │
│                                                                 │
│  3. PERMISSION CHECK (checkPermissions)                         │
│     ├─► Get permission context from app state                   │
│     ├─► Check DENY rules (with wildcard support)                │
│     │   └─► If match: Return { behavior: "deny" }               │
│     ├─► Check ALLOW rules (with wildcard support)               │
│     │   └─► If match: Return { behavior: "allow" }              │
│     └─► No match: Return { behavior: "ask" } with suggestions   │
│                                                                 │
│  4. EXECUTION (call)                                            │
│     ├─► Load all skills via sE()                                │
│     ├─► Process skill via s61()                                 │
│     │   └─► processSlashCommand → processPromptCommand          │
│     │       ├─► Get skill prompt via getPromptForCommand()      │
│     │       ├─► Format metadata (command-message tags)          │
│     │       ├─► Parse allowed tools                             │
│     │       └─► Create message array                            │
│     ├─► Filter out progress and command-message tags            │
│     ├─► Tag messages with source tool use ID                    │
│     └─► Return { data, newMessages, contextModifier }           │
│                                                                 │
│  5. CONTEXT MODIFICATION                                        │
│     ├─► If allowedTools: Inject into permission context         │
│     ├─► If model: Override mainLoopModel                        │
│     └─► If maxThinkingTokens: Set thinking budget               │
│                                                                 │
│  6. MESSAGE INJECTION                                           │
│     └─► newMessages injected into conversation for next turn    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 6.2 Prompt Processing Functions

```javascript
// ============================================
// processSlashCommand - Entry point for skill processing
// Location: chunks.121.mjs:1170-1174
// ============================================

// ORIGINAL (for source lookup):
async function s61(A, Q, B, G, Z = []) {
  if (!ph(A, B)) throw new oj(`Unknown command: ${A}`);
  let I = Pq(A, B);
  if (I.type !== "prompt") throw Error(`Unexpected ${I.type} command.`);
  return kP2(I, Q, G, [], Z)
}

// READABLE (for understanding):
async function processSlashCommand(skillName, arguments, allSkills, context, extraMessages = []) {
  // Verify skill exists
  if (!commandExists(skillName, allSkills)) {
    throw new CommandNotFoundError(`Unknown command: ${skillName}`);
  }

  // Get skill object
  let skill = lookupCommand(skillName, allSkills);

  // Verify it's a prompt command
  if (skill.type !== "prompt") {
    throw Error(`Unexpected ${skill.type} command. Expected 'prompt' command.`);
  }

  // Process the prompt command
  return processPromptCommand(skill, arguments, context, [], extraMessages);
}

// Mapping: s61→processSlashCommand, A→skillName, Q→arguments, B→allSkills,
//          G→context, Z→extraMessages, I→skill
```

```javascript
// ============================================
// processPromptCommand - Generates skill prompt messages
// Location: chunks.121.mjs:1177-1214
// ============================================

// ORIGINAL (for source lookup):
async function kP2(A, Q, B, G = [], Z = []) {
  let I = await A.getPromptForCommand(Q, B),
    Y = sf5(A, Q);
  g(`Metadata string for ${A.userFacingName()}:`);
  let J = (Y.match(/<command-message>/g) || []).length;
  let W = w0A(A.allowedTools ?? []),
    X = Z.length > 0 || G.length > 0 ? [...Z, ...G, ...I] : I,
    V = Xf([R0({ content: X })], void 0),
    F = await d91(jYA(I.filter((D) => D.type === "text").map((D) => D.text).join(" "), B, null, [], B.messages, "repl_main_thread")),
    K = [R0({ content: Y }), R0({ content: X, isMeta: !0 }), ...F,
         ...W.length || A.model ? [l9({ type: "command_permissions", allowedTools: W, model: A.useSmallFastModel ? MW() : A.model })] : []];
  return { messages: K, shouldQuery: !0, allowedTools: W, maxThinkingTokens: V > 0 ? V : void 0, model: A.useSmallFastModel ? MW() : A.model, command: A }
}

// READABLE (for understanding):
async function processPromptCommand(skill, userArguments, context, prefixContent = [], extraMessages = []) {
  // Get skill prompt content
  let skillPromptBlocks = await skill.getPromptForCommand(userArguments, context);

  // Format metadata string with command-message tags
  let metadataString = formatCommandMetadata(skill, userArguments);
  log(`Metadata string for ${skill.userFacingName()}: ${metadataString.substring(0,200)}`);

  // Parse allowed tools from skill
  let allowedTools = parseAllowedTools(skill.allowedTools ?? []);

  // Combine content: extra messages + prefix + skill prompt
  let combinedContent = extraMessages.length > 0 || prefixContent.length > 0
    ? [...extraMessages, ...prefixContent, ...skillPromptBlocks]
    : skillPromptBlocks;

  // Calculate thinking tokens budget
  let thinkingTokensBudget = calculateThinkingBudget([createMetaBlock({ content: combinedContent })], undefined);

  // Process templates and expand
  let expandedMessages = await expandTemplates(
    processContent(
      skillPromptBlocks.filter(b => b.type === "text").map(b => b.text).join(" "),
      context, null, [], context.messages, "repl_main_thread"
    )
  );

  // Build final message array
  let messages = [
    createMetaBlock({ content: metadataString }),           // Metadata with command-message tags
    createMetaBlock({ content: combinedContent, isMeta: true }),  // Skill prompt content
    ...expandedMessages,                                      // Expanded template messages
    ...(allowedTools.length || skill.model ? [
      createAttachment({
        type: "command_permissions",
        allowedTools: allowedTools,
        model: skill.useSmallFastModel ? getSmallFastModel() : skill.model
      })
    ] : [])
  ];

  return {
    messages: messages,
    shouldQuery: true,
    allowedTools: allowedTools,
    maxThinkingTokens: thinkingTokensBudget > 0 ? thinkingTokensBudget : undefined,
    model: skill.useSmallFastModel ? getSmallFastModel() : skill.model,
    command: skill
  };
}

// Mapping: kP2→processPromptCommand, A→skill, Q→userArguments, B→context,
//          G→prefixContent, Z→extraMessages, I→skillPromptBlocks, Y→metadataString,
//          W→allowedTools, X→combinedContent, K→messages
```

### 6.3 Metadata Formatting

```javascript
// ============================================
// formatSkillMetadata - Creates metadata XML tags for skills
// Location: chunks.121.mjs:1155-1158
// ============================================

// ORIGINAL (for source lookup):
function U60(A, Q = "loading") {
  return `<command-message>${`The "${A}" skill is ${Q}`}</command-message>
<command-name>${A}</command-name>`
}

// READABLE (for understanding):
function formatSkillMetadata(skillName, progressMessage = "loading") {
  return `<command-message>The "${skillName}" skill is ${progressMessage}</command-message>
<command-name>${skillName}</command-name>`;
}

// Mapping: U60→formatSkillMetadata, A→skillName, Q→progressMessage

// ============================================
// formatCommandMetadata - Dispatches to appropriate formatter
// Location: chunks.121.mjs:1165-1168
// ============================================

// ORIGINAL (for source lookup):
function sf5(A, Q) {
  if (A.isSkill) return U60(A.userFacingName(), A.progressMessage);
  return af5(A.userFacingName(), A.progressMessage, Q)
}

// READABLE (for understanding):
function formatCommandMetadata(command, arguments) {
  if (command.isSkill) {
    // Skills use simpler metadata format
    return formatSkillMetadata(command.userFacingName(), command.progressMessage);
  }
  // Slash commands include arguments
  return formatSlashCommandMetadata(command.userFacingName(), command.progressMessage, arguments);
}

// Mapping: sf5→formatCommandMetadata, A→command, Q→arguments
```

---

## 7. Serial vs Parallel Execution

### 7.1 Parallel Operations

The skill system uses parallel loading for independent operations:

**1. Master Aggregator - 4 sources in parallel:**
```javascript
// Location: chunks.152.mjs:2266-2271
let [customCommands, { skillDirCommands, pluginSkills }, pluginCommands, contextSkills] =
  await Promise.all([
    fC9(),    // Custom commands from directories
    Sv3(),    // Skills from skill dirs + plugins
    PQA(),    // Plugin commands
    jv3()     // Context-based skills
  ]);
```

**2. Skill Sources - 2 sources in parallel:**
```javascript
// Location: chunks.152.mjs:2151-2168
let [skillDirCommands, pluginSkills] = await Promise.all([
  VK0().catch(err => { /* graceful degradation */ return []; }),
  iW0().catch(err => { /* graceful degradation */ return []; })
]);
```

**3. Three-tier directories - 3 sources in parallel:**
```javascript
// Location: chunks.152.mjs:1120
let [managedSkills, userSkills, projectSkills] = await Promise.all([
  XK0(managedDir, "policySettings"),
  isEnabled("userSettings") ? XK0(userDir, "userSettings") : Promise.resolve([]),
  isEnabled("projectSettings") ? XK0(projectDir, "projectSettings") : Promise.resolve([])
]);
```

### 7.2 Serial Operations

Some operations must be serial to maintain consistency:

**1. Skill content preloading (in agents):**
```javascript
// Location: chunks.145.mjs:1116-1153 (approximate)
for (let { skill } of skillsToLoad) {
  // Sequential: Order matters for message injection
  await skill.getPromptForCommand("", context);
}
```

**2. Directory scanning within single directory:**
```javascript
// Location: chunks.152.mjs:1014-1089
for (let entry of entries) {
  // Sequential: Each skill processed one at a time
  if (fileSystem.existsSync(skillMdPath)) {
    // Parse and create skill object
  }
}
```

### 7.3 Trade-offs Analysis

| Operation | Execution | Rationale |
|-----------|-----------|-----------|
| Source loading | Parallel | Independent sources, no dependencies |
| Tier loading | Parallel | Independent directories |
| Skill discovery | Serial | Directory iteration within single source |
| Skill preloading | Serial | Message order must be deterministic |
| LLM streaming | Serial | Single stream, yielded sequentially |

**Performance Characteristics:**
- **Parallel discovery**: O(1) latency for loading all sources (bounded by slowest source)
- **Serial preloading**: O(n) latency where n = number of skills in agent
- **Design decision**: Prioritizes message ordering consistency over maximum parallelism

### 7.4 Deep Analysis: Why Serial Preloading?

**What it does:** Skills are loaded one-at-a-time (sequentially) rather than all at once.

**How it works:**
```javascript
for (let { skill } of skillsToLoad) {
  // Each skill awaited individually - NOT Promise.all()
  await skill.getPromptForCommand("", context);
}
```

**Why this approach:**
1. **Message ordering guarantee**: Skill prompts are injected into conversation history. If loaded in parallel, the order would be non-deterministic (whichever finishes first).
2. **Dependent context**: One skill's output might affect another skill's context in the same agent definition.
3. **Error isolation**: If skill N fails, skills 1..N-1 are already loaded. With parallel loading, partial failure handling is more complex.

**Alternatives considered:**
- **Full parallel**: Faster but non-deterministic message order
- **Parallel with sorting**: Could sort after load, but adds complexity
- **Batched parallel**: Load in small batches - diminishing returns for typical skill counts

**Key insight:** Most agents have 1-3 skills, so the latency difference between parallel and serial is negligible (tens of milliseconds). The complexity of ensuring deterministic ordering with parallel loading isn't worth it for such small N.

---

## 8. Stream Support

### 8.1 Key Insight: Skills Are NOT Streamed

Skills are **preloaded before** the LLM stream begins. The skill content is injected into the message history, and only the LLM's response is streamed.

### 8.2 Stream Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                      STREAMING TIMELINE                        │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  PHASE 1: SKILL PRELOADING (Blocking)                          │
│  ─────────────────────────────────────                         │
│  │                                                             │
│  ├─► User invokes skill (or LLM calls SkillTool)               │
│  │                                                             │
│  ├─► Load all skills via sE()                                  │
│  │                                                             │
│  ├─► Process skill via s61() → kP2()                           │
│  │   ├─► Read SKILL.md content                                 │
│  │   ├─► Parse frontmatter                                     │
│  │   ├─► Generate prompt with $ARGUMENTS substitution          │
│  │   └─► Create message array                                  │
│  │                                                             │
│  ├─► Display metadata to user:                                 │
│  │   <command-message>The "skill" is loading</command-message> │
│  │                                                             │
│  └─► Messages injected into conversation                       │
│                                                                │
│  PHASE 2: LLM STREAMING (Async Generator)                      │
│  ─────────────────────────────────────────                     │
│  │                                                             │
│  ├─► Call LLM API with injected messages                       │
│  │                                                             │
│  ├─► For each chunk from API:                                  │
│  │   └─► yield chunk to client (real-time display)             │
│  │                                                             │
│  ├─► Collect full response for transcript                      │
│  │                                                             │
│  └─► Check abort signal: if aborted, throw AbortError          │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### 8.3 Metadata Display During Loading

When a skill is invoked, users see metadata before the LLM response:

```xml
<command-message>The "my-skill" skill is loading</command-message>
<command-name>my-skill</command-name>
```

This is generated by `formatSkillMetadata` (U60) and injected into messages before the LLM call.

### 8.4 LLM Response Streaming

```javascript
// Location: chunks.145.mjs:1179-1187 (approximate)
// After skill preloading completes:

for await (let chunk of mainAgentLoop({
  messages: messagesWithSkillContent,
  context: modifiedContext,
  // ... other options
})) {
  yield chunk;  // Real-time output to client
}

// Abort handling
if (context.signal.aborted) {
  throw new AbortError();  // WW class
}
```

**Key points:**
- `mainAgentLoop` (O$) is an async generator
- Each chunk is yielded directly to client
- Abort signal can interrupt at any point
- Full response collected asynchronously for transcript

---

## 9. Timeout & Error Handling

### 9.1 No Explicit Timeout

The skill system does **NOT** have built-in timeout mechanisms for skill loading. Instead:

- Relies on caller's `AbortController` for interruption
- No automatic timeout for file reads or skill processing
- Network timeouts (if any) are handled at the API layer

### 9.2 Graceful Degradation Pattern

Each skill source has independent error handling:

```javascript
// ============================================
// Graceful Degradation in getSkillsFromAllSources
// Location: chunks.152.mjs:2151-2168
// ============================================

async function getSkillsFromAllSources() {
  try {
    let [skillDirCommands, pluginSkills] = await Promise.all([
      // Skill directories - isolated error handling
      loadSkillDirectoryCommands().catch((error) => {
        logError(error instanceof Error ? error : Error("Failed to load skill directory commands"));
        log("Skill directory commands failed to load, continuing without them");
        return [];  // Return empty, don't crash
      }),

      // Plugin skills - isolated error handling
      getPluginSkills().catch((error) => {
        logError(error instanceof Error ? error : Error("Failed to load plugin skills"));
        log("Plugin skills failed to load, continuing without them");
        return [];  // Return empty, don't crash
      })
    ]);

    log(`getSkills returning: ${skillDirCommands.length} skill dir commands, ${pluginSkills.length} plugin skills`);

    return {
      skillDirCommands,
      pluginSkills
    };
  } catch (error) {
    // Outer catch for unexpected errors
    logError(error instanceof Error ? error : Error("Unexpected error loading skills"));
    log("Unexpected error in getSkills, returning empty");
    return {
      skillDirCommands: [],
      pluginSkills: []
    };
  }
}
```

**Design principles:**
1. Each source wrapped in individual `.catch()`
2. Errors logged but don't propagate
3. Failed sources return empty arrays
4. Outer try-catch for unexpected failures
5. System continues with partial skill set

### 9.3 Individual Skill Loading Errors

```javascript
// Location: chunks.152.mjs:1086-1088
// Within loadSkillsFromDirectory (XK0)

try {
  // Parse and create skill object
  let fileContent = fileSystem.readFileSync(skillMdPath, { encoding: "utf-8" });
  let { frontmatter, content } = parseFrontmatter(fileContent);
  // ... create skill object
  loadedSkills.push(skillObject);
} catch (error) {
  // Log error but continue with other skills
  logError(error instanceof Error ? error : Error(String(error)));
  // This skill is skipped, others continue loading
}
```

### 9.4 No Retry Mechanism

The skill system does **NOT** implement automatic retries:

- Failed skill loading → skill is skipped
- Failed source loading → source returns empty array
- Re-invocation must be triggered by user or UI layer
- Cache invalidation via `nH9()` allows fresh reload

**Why no retry?**
- Skills are local files (high reliability)
- Retrying would add latency without clear benefit
- Keeps code simple and predictable

### 9.5 Abort Signal Handling

```javascript
// Location: chunks.145.mjs:1188 (approximate)
// After streaming completes

if (await promise, context.signal.aborted) {
  throw new WW;  // AbortError
}
```

The `AbortController` pattern allows callers to:
- Cancel long-running skill operations
- Interrupt LLM streaming mid-response
- Clean up resources on user interruption

---

## 10. Permission System Integration

### 10.1 Permission Flow

```
┌─────────────────────────────────────────────────────────┐
│                 PERMISSION CHECK FLOW                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. Get permission context from app state               │
│     └─► toolPermissionContext                           │
│                                                         │
│  2. Check DENY rules (checked first)                    │
│     ├─► Exact match: "my-skill"                         │
│     └─► Wildcard match: "plugin:*"                      │
│                                                         │
│     If MATCH: Return { behavior: "deny" }               │
│                                                         │
│  3. Check ALLOW rules                                   │
│     ├─► Exact match: "my-skill"                         │
│     └─► Wildcard match: "plugin:*"                      │
│                                                         │
│     If MATCH: Return { behavior: "allow" }              │
│                                                         │
│  4. No matching rule                                    │
│     └─► Return { behavior: "ask" }                      │
│         with suggestions for user                       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 10.2 Wildcard Pattern Matching

```javascript
// Pattern matching logic
let matchesRule = (ruleKey) => {
  // Exact match
  if (ruleKey === skill) return true;

  // Wildcard: "prefix:*" matches all starting with "prefix"
  if (ruleKey.endsWith(":*")) {
    let prefix = ruleKey.slice(0, -2);  // Remove ":*"
    return skill.startsWith(prefix);
  }

  return false;
};
```

**Examples:**
- Rule `"my-skill"` matches only `"my-skill"`
- Rule `"plugin:*"` matches `"plugin:pdf"`, `"plugin:xlsx"`, `"plugin:anything"`
- Rule `"my-*"` is NOT a wildcard (must end with `:*`)

### 10.3 Context Modifier - Permission Injection

When a skill has `allowed-tools`, these are injected into the permission context:

```javascript
contextModifier(currentContext) {
  if (allowedTools.length > 0) {
    return {
      ...currentContext,
      async getAppState() {
        let appState = await originalContext.getAppState();
        return {
          ...appState,
          toolPermissionContext: {
            ...appState.toolPermissionContext,
            alwaysAllowRules: {
              ...appState.toolPermissionContext.alwaysAllowRules,
              command: [...new Set([
                ...appState.toolPermissionContext.alwaysAllowRules.command || [],
                ...allowedTools  // Inject skill's allowed tools
              ])]
            }
          }
        };
      }
    };
  }
  return currentContext;
}
```

**Result:** After skill executes, LLM can use the specified tools without additional permission prompts.

---

## 11. Custom Skill Support

### 11.1 Creating a Custom Skill

**Step 1: Create directory structure**
```
.claude/skills/my-skill/
└── SKILL.md
```

**Step 2: Write SKILL.md**
```markdown
---
name: Code Analyzer
description: Analyzes code for patterns and issues
when_to_use: When user asks to analyze code quality or find patterns
allowed-tools: ["Read", "Grep", "Glob"]
model: sonnet
---

# Code Analyzer

You are a code analysis expert. Analyze the codebase for:

1. Code patterns and anti-patterns
2. Potential bugs and issues
3. Performance concerns
4. Security vulnerabilities

$ARGUMENTS

Provide detailed analysis with file locations and recommendations.
```

### 11.2 Skill Discovery Locations

| Location | Priority | Source Type | Condition |
|----------|----------|-------------|-----------|
| `{managed}/.claude/skills/` | 1 (highest) | `policySettings` | Always loaded |
| `~/.claude/skills/` | 2 | `userSettings` | If `userSettings` enabled |
| `{project}/.claude/skills/` | 3 (lowest) | `projectSettings` | If `projectSettings` enabled |

### 11.3 Plugin Skills

Plugins can bundle skills via manifest configuration:

**Single path:**
```json
{
  "name": "my-plugin",
  "skills": "./skills"
}
```

**Multiple paths:**
```json
{
  "name": "my-plugin",
  "skills": [
    "./skills-core",
    "./skills-advanced"
  ]
}
```

**Plugin skill loading (iW0):**
```javascript
// Location: chunks.142.mjs:3586-3617
for (let plugin of enabledPlugins) {
  // Default skills path
  if (plugin.skillsPath) {
    let skills = await loadSkillsFromPluginPath(plugin.skillsPath, plugin.name, ...);
    allSkills.push(...skills);
  }

  // Additional skills paths
  if (plugin.skillsPaths) {
    for (let path of plugin.skillsPaths) {
      let skills = await loadSkillsFromPluginPath(path, plugin.name, ...);
      allSkills.push(...skills);
    }
  }
}
```

### 11.4 $ARGUMENTS Placeholder

Skills can use `$ARGUMENTS` to inject user-provided arguments:

```markdown
---
name: Search Skill
---

Search for: $ARGUMENTS
```

**Processing logic:**
```javascript
if (userArguments) {
  if (skillPrompt.includes("$ARGUMENTS")) {
    // Replace placeholder
    skillPrompt = skillPrompt.replaceAll("$ARGUMENTS", userArguments);
  } else {
    // Append as section
    skillPrompt = skillPrompt + `\n\nARGUMENTS: ${userArguments}`;
  }
}
```

### 11.5 Base Directory Injection

Skills automatically receive their base directory path:

```javascript
let skillPrompt = `Base directory for this skill: ${skillDir}\n\n${content}`;
```

This allows skills to reference files relative to their location.

---

## 12. Summary

### 12.1 Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| SKILL.md naming | Clear differentiation from regular commands |
| Three-tier loading | Priority system for managed/user/project skills |
| Parallel source loading | Minimize latency for independent sources |
| Serial skill preloading | Maintain deterministic message ordering |
| No streaming during load | Skills are metadata, not interactive content |
| Graceful degradation | Partial failures don't crash system |
| No retry mechanism | Simplicity; local files are reliable |
| Token budget | Prevent context overflow |
| Wildcard permissions | Flexible access control for skill groups |

### 12.2 Performance Characteristics

- **Skill discovery**: O(1) relative to source count (parallel loading)
- **Directory scanning**: O(n) where n = subdirectories
- **Skill preloading**: O(n) where n = skills to load
- **Cache hit**: O(1) via memoization
- **Memory**: Skills cached until explicit invalidation

### 12.3 Extensibility Points

1. **Custom skills**: Add SKILL.md in any supported directory
2. **Plugin skills**: Bundle skills with plugins via manifest
3. **Tool restrictions**: Control which tools skills can use
4. **Model override**: Specify model for skill execution
5. **Permission rules**: Configure allow/deny with wildcards
