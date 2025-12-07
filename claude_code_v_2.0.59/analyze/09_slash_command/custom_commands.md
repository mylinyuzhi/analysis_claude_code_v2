# Custom Command Loading System

## Overview

Claude Code v2.0.59 supports custom slash commands loaded from markdown files with YAML frontmatter. Custom commands can be defined at policy, user, and project levels, enabling extensibility and team-specific workflows.

> Symbol mappings: [symbol_index.md](../00_overview/symbol_index.md)

**Key loading functions:**
- `loadCommandFilesFromDirectories` (_n) - Scan directories for command files
- `scanMarkdownFiles` (TK0) - Find and parse .md files
- `parseFrontmatter` (NV) - Extract YAML frontmatter
- `loadCustomCommandsForExecution` (fC9) - Build command objects

---

## Custom Command Architecture

```
Command File (.md)
       │
       ├── .claude/commands/     (project)
       ├── ~/.claude/commands/   (user)
       └── policy/commands/      (policy)
       │
       ▼
┌─────────────────────────────────────────────────────────────────┐
│  loadCommandFilesFromDirectories (_n)                            │
│  - Parallel scan of all sources                                  │
│  - 3-second timeout                                              │
│  - Source tagging                                                │
└─────────────────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────────┐
│  scanMarkdownFiles (TK0)                                         │
│  - Glob pattern: *.md                                            │
│  - ripgrep or native file search                                 │
│  - Read file contents                                            │
└─────────────────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────────┐
│  parseFrontmatter (NV)                                           │
│  - Extract YAML between ---                                      │
│  - Parse key: value pairs                                        │
│  - Return { frontmatter, content }                               │
└─────────────────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────────┐
│  loadCustomCommandsForExecution (fC9)                            │
│  - Build command objects                                         │
│  - Set up getPromptForCommand()                                  │
│  - Handle $ARGUMENTS replacement                                 │
└─────────────────────────────────────────────────────────────────┘
       │
       ▼
  Command objects ready for registration
```

---

## Directory Sources

Commands are loaded from three directory sources in priority order:

| Source | Path | Priority | Scope |
|--------|------|----------|-------|
| Policy | `<policy-dir>/commands/` | 1 (highest) | Organization-wide |
| User | `~/.claude/commands/` | 2 | User-specific |
| Project | `.claude/commands/` | 3 | Project-specific |

### Directory Loading

```javascript
// ============================================
// loadCommandFilesFromDirectories - Scan all command sources
// Location: chunks.153.mjs:1855-1882
// ============================================

// ORIGINAL (for source lookup):
_n = s1(async function(A) {
  let Q = Date.now(),
    B = TJ1(MQ(), A),                    // ~/.claude/commands/
    G = TJ1(iw(), ".claude", A),         // policy/commands/
    Z = zb3(A),                          // .claude/commands/ (project)
    [I, Y, J] = await Promise.all([
      TK0(G).then((X) => X.map((V) => ({
        ...V,
        baseDir: G,
        source: "policySettings"
      }))),
      EH("userSettings") ? TK0(B).then((X) => X.map((V) => ({
        ...V,
        baseDir: B,
        source: "userSettings"
      }))) : Promise.resolve([]),
      EH("projectSettings") ? Promise.all(Z.map((X) => TK0(X).then((V) => V.map((F) => ({
        ...F,
        baseDir: X,
        source: "projectSettings"
      }))))) : Promise.resolve([])
    ]),
    W = J.flat();
  return GA("tengu_dir_search", {
    // telemetry
  }), [...I, ...Y, ...W]
});

// READABLE (for understanding):
const loadCommandFilesFromDirectories = memoize(async function(subdir) {
  const startTime = Date.now();

  // Define all source directories
  const userCommandsDir = path.join(getUserConfigDir(), subdir);      // ~/.claude/commands/
  const policyCommandsDir = path.join(getPolicyDir(), ".claude", subdir);  // policy/commands/
  const projectCommandsDirs = getProjectCommandDirs(subdir);           // .claude/commands/

  // Scan all sources in parallel
  const [policyCommands, userCommands, projectCommandsArrays] = await Promise.all([
    // Policy commands (always loaded)
    scanMarkdownFiles(policyCommandsDir).then(files =>
      files.map(file => ({ ...file, baseDir: policyCommandsDir, source: "policySettings" }))
    ),

    // User commands (if enabled)
    isSettingsEnabled("userSettings")
      ? scanMarkdownFiles(userCommandsDir).then(files =>
          files.map(file => ({ ...file, baseDir: userCommandsDir, source: "userSettings" }))
        )
      : Promise.resolve([]),

    // Project commands (if enabled)
    isSettingsEnabled("projectSettings")
      ? Promise.all(projectCommandsDirs.map(dir =>
          scanMarkdownFiles(dir).then(files =>
            files.map(file => ({ ...file, baseDir: dir, source: "projectSettings" }))
          )
        ))
      : Promise.resolve([])
  ]);

  const projectCommands = projectCommandsArrays.flat();

  // Emit telemetry
  telemetry("tengu_dir_search", { /* timing data */ });

  // Merge all sources: policy → user → project
  return [...policyCommands, ...userCommands, ...projectCommands];
});

// Mapping: _n→loadCommandFilesFromDirectories, A→subdir, B→userCommandsDir,
//          G→policyCommandsDir, Z→projectCommandsDirs, TK0→scanMarkdownFiles,
//          MQ→getUserConfigDir, iw→getPolicyDir, EH→isSettingsEnabled
```

---

## Markdown File Scanning

### scanMarkdownFiles (TK0)

Scans a directory for markdown files using ripgrep:

```javascript
// ============================================
// scanMarkdownFiles - Find and parse .md files
// Location: chunks.153.mjs:1809-1836
// ============================================

// ORIGINAL (for source lookup):
async function TK0(A) {
  let Q = o9(),
    B = setTimeout(() => Q.abort(), 3000);  // 3-second timeout
  try {
    if (!PK0(A)) return [];
    let Z = Y0(process.env.CLAUDE_CODE_USE_NATIVE_FILE_SEARCH)
      ? await Ub3(A, Q.signal)
      : await aj(["--files", "--hidden", "--follow", "--no-ignore", "--glob", "*.md"], A, Q.signal);
    return (await Promise.all(Z.map(async (Y) => {
      try {
        let J = await Hb3(Y, { encoding: "utf-8" }),
          { frontmatter: W, content: X } = NV(J);
        return {
          filePath: Y,
          frontmatter: W,
          content: X
        }
      } catch {
        return null  // Skip failed files
      }
    }))).filter(Boolean)
  } finally {
    clearTimeout(B)
  }
}

// READABLE (for understanding):
async function scanMarkdownFiles(directory) {
  const abortController = createAbortController();
  const timeout = setTimeout(() => abortController.abort(), 3000);  // 3-second timeout

  try {
    // Skip if directory doesn't exist
    if (!directoryExists(directory)) return [];

    // Find all .md files using ripgrep or native search
    const filePaths = parseBoolean(process.env.CLAUDE_CODE_USE_NATIVE_FILE_SEARCH)
      ? await nativeFileSearch(directory, abortController.signal)
      : await ripgrepSearch(
          ["--files", "--hidden", "--follow", "--no-ignore", "--glob", "*.md"],
          directory,
          abortController.signal
        );

    // Read and parse each file in parallel
    const results = await Promise.all(filePaths.map(async (filePath) => {
      try {
        const content = await readFile(filePath, { encoding: "utf-8" });
        const { frontmatter, content: body } = parseFrontmatter(content);
        return { filePath, frontmatter, content: body };
      } catch {
        return null;  // Skip files that fail to read/parse
      }
    }));

    // Filter out failed files
    return results.filter(Boolean);
  } finally {
    clearTimeout(timeout);
  }
}

// Mapping: TK0→scanMarkdownFiles, A→directory, Q→abortController, B→timeout,
//          Z→filePaths, NV→parseFrontmatter, aj→ripgrepSearch, Hb3→readFile,
//          PK0→directoryExists
```

**Key features:**
- 3-second timeout for responsiveness
- Uses ripgrep for fast file discovery
- Parallel file reading
- Graceful handling of failed files
- Supports hidden files and symlinks

---

## Frontmatter Parsing

### parseFrontmatter (NV)

Extracts YAML frontmatter from markdown files:

```javascript
// ============================================
// parseFrontmatter - Extract YAML frontmatter from markdown
// Location: chunks.16.mjs:892-919
// ============================================

// ORIGINAL (for source lookup):
function NV(A) {
  let Q = /^---\s*\n([\s\S]*?)---\s*\n?/,
    B = A.match(Q);
  if (!B) return {
    frontmatter: {},
    content: A
  };
  let G = B[1] || "",
    Z = A.slice(B[0].length),
    I = {},
    Y = G.split(`\n`);
  for (let J of Y) {
    let W = J.indexOf(":");
    if (W > 0) {
      let X = J.slice(0, W).trim(),
        V = J.slice(W + 1).trim();
      if (X) {
        let F = V.replace(/^["']|["']$/g, "");
        I[X] = F
      }
    }
  }
  return {
    frontmatter: I,
    content: Z
  }
}

// READABLE (for understanding):
function parseFrontmatter(fileContent) {
  // Regex to match YAML frontmatter between --- markers
  const frontmatterRegex = /^---\s*\n([\s\S]*?)---\s*\n?/;
  const match = fileContent.match(frontmatterRegex);

  // No frontmatter found
  if (!match) {
    return {
      frontmatter: {},
      content: fileContent
    };
  }

  const yamlContent = match[1] || "";
  const bodyContent = fileContent.slice(match[0].length);
  const frontmatter = {};

  // Parse YAML key-value pairs
  const lines = yamlContent.split("\n");
  for (const line of lines) {
    const colonIndex = line.indexOf(":");
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim();
      const value = line.slice(colonIndex + 1).trim();
      if (key) {
        // Remove surrounding quotes
        const cleanValue = value.replace(/^["']|["']$/g, "");
        frontmatter[key] = cleanValue;
      }
    }
  }

  return {
    frontmatter: frontmatter,
    content: bodyContent
  };
}

// Mapping: NV→parseFrontmatter, A→fileContent, Q→frontmatterRegex, B→match,
//          G→yamlContent, Z→bodyContent, I→frontmatter, Y→lines
```

### Frontmatter Format

```yaml
---
description: Brief description of the command
allowed-tools: Read, Grep, Glob
argument-hint: <file-path>
when_to_use: Use this command when analyzing code
model: claude-sonnet-4-5-20250929
disable-model-invocation: false
version: 1.0
---

Your prompt content here...

$ARGUMENTS will be replaced with user input.
```

### Supported Frontmatter Fields

| Field | Type | Description |
|-------|------|-------------|
| `description` | string | User-visible command description |
| `allowed-tools` | string | Comma-separated list of allowed tools |
| `argument-hint` | string | Usage hint shown to user |
| `when_to_use` | string | Guidance for automatic command selection |
| `model` | string | Model override (`inherit` for parent's model) |
| `disable-model-invocation` | boolean | Prevent LLM from auto-invoking |
| `version` | string | Command version |

---

## Command Object Creation

### loadCustomCommandsForExecution (fC9)

Transforms parsed files into executable command objects:

```javascript
// ============================================
// loadCustomCommandsForExecution - Build command objects
// Location: chunks.152.mjs:909-994
// ============================================

// ORIGINAL (for source lookup):
fC9 = s1(async () => {
  try {
    let A = await _n("commands");
    return Qv3(A).map(({
      baseDir: G,
      filePath: Z,
      frontmatter: I,
      content: Y,
      source: J
    }) => {
      try {
        let W = I.description ?? Wx(Y, "Custom command"),
          X = UO(I["allowed-tools"]),
          V = I["argument-hint"],
          F = I.when_to_use,
          K = I.version,
          D = Y0(I["disable-model-invocation"] ?? void 0),
          H = I.model === "inherit" ? void 0 : I.model ? UD(I.model) : void 0,
          C = WK0(Z),          // isSkill (skill.md)
          E = C ? RSA(Z) : void 0,  // skillBaseDir
          U = Zv3(Z, G),       // generateCommandName
          q = W !== "Custom command";
        return {
          type: "prompt",
          name: U,
          description: W,
          allowedTools: X.length > 0 ? X : void 0,
          argumentHint: V,
          whenToUse: F,
          isEnabled: () => !0,
          isHidden: !1,
          isSkill: C,
          skillBaseDir: E,
          hasUserSpecifiedDescription: q,
          disableModelInvocation: D,
          model: H,
          version: K,
          progressMessage: C ? "loading" : "running",
          userFacingName() {
            return U
          },
          source: J,
          async getPromptForCommand(w, N) {
            let R = Y;
            if (C && E) R = `Base directory for this skill: ${E}\n\n${R}`;
            if (w)
              if (R.includes("$ARGUMENTS")) R = R.replaceAll("$ARGUMENTS", w);
              else R = R + `\n\nARGUMENTS: ${w}`;
            return R = await Fa(R, { ...N, /* processing */ })
            // ...
          }
        }
      } catch (W) {
        return null
      }
    }).filter(Boolean)
  } catch {
    return []
  }
});

// READABLE (for understanding):
const loadCustomCommandsForExecution = memoize(async () => {
  try {
    // Load all command files from directories
    const commandFiles = await loadCommandFilesFromDirectories("commands");

    // Deduplicate and build command objects
    return deduplicateCommands(commandFiles).map(({
      baseDir,
      filePath,
      frontmatter,
      content,
      source
    }) => {
      try {
        // Extract metadata from frontmatter
        const description = frontmatter.description ?? extractFirstLine(content, "Custom command");
        const allowedTools = parseToolList(frontmatter["allowed-tools"]);
        const argumentHint = frontmatter["argument-hint"];
        const whenToUse = frontmatter.when_to_use;
        const version = frontmatter.version;
        const disableModelInvocation = parseBoolean(frontmatter["disable-model-invocation"] ?? undefined);
        const model = frontmatter.model === "inherit"
          ? undefined
          : frontmatter.model ? normalizeModelName(frontmatter.model) : undefined;

        // Check if this is a skill (skill.md)
        const isSkill = isSkillFile(filePath);
        const skillBaseDir = isSkill ? getSkillBaseDir(filePath) : undefined;

        // Generate command name from file path
        const commandName = generateCommandName(filePath, baseDir);
        const hasUserSpecifiedDescription = description !== "Custom command";

        return {
          type: "prompt",
          name: commandName,
          description: description,
          allowedTools: allowedTools.length > 0 ? allowedTools : undefined,
          argumentHint: argumentHint,
          whenToUse: whenToUse,
          isEnabled: () => true,
          isHidden: false,
          isSkill: isSkill,
          skillBaseDir: skillBaseDir,
          hasUserSpecifiedDescription: hasUserSpecifiedDescription,
          disableModelInvocation: disableModelInvocation,
          model: model,
          version: version,
          progressMessage: isSkill ? "loading" : "running",
          userFacingName() {
            return commandName;
          },
          source: source,

          async getPromptForCommand(args, context) {
            let prompt = content;

            // Add skill base directory info for skills
            if (isSkill && skillBaseDir) {
              prompt = `Base directory for this skill: ${skillBaseDir}\n\n${prompt}`;
            }

            // Handle $ARGUMENTS placeholder
            if (args) {
              if (prompt.includes("$ARGUMENTS")) {
                prompt = prompt.replaceAll("$ARGUMENTS", args);
              } else {
                prompt = prompt + `\n\nARGUMENTS: ${args}`;
              }
            }

            // Process additional placeholders
            prompt = await processPlaceholders(prompt, { ...context });
            return prompt;
          }
        };
      } catch (error) {
        return null;  // Skip failed commands
      }
    }).filter(Boolean);
  } catch {
    return [];
  }
});

// Mapping: fC9→loadCustomCommandsForExecution, _n→loadCommandFilesFromDirectories,
//          Qv3→deduplicateCommands, Zv3→generateCommandName, WK0→isSkillFile,
//          UO→parseToolList, Y0→parseBoolean, UD→normalizeModelName
```

---

## $ARGUMENTS Replacement

Custom commands support argument substitution through the `$ARGUMENTS` placeholder:

### Replacement Logic

```javascript
// In getPromptForCommand:
if (args) {
  if (prompt.includes("$ARGUMENTS")) {
    // Explicit placeholder: replace all occurrences
    prompt = prompt.replaceAll("$ARGUMENTS", args);
  } else {
    // No placeholder: append at end
    prompt = prompt + `\n\nARGUMENTS: ${args}`;
  }
}
```

### Example Command

**File:** `.claude/commands/analyze.md`

```markdown
---
description: Analyze code for issues
allowed-tools: Read, Grep
---

Please analyze the following file for potential issues:

$ARGUMENTS

Focus on:
- Security vulnerabilities
- Performance problems
- Code style issues
```

**Usage:** `/analyze src/main.js`

**Resulting prompt:**
```
Please analyze the following file for potential issues:

src/main.js

Focus on:
- Security vulnerabilities
- Performance problems
- Code style issues
```

---

## Command Name Generation

### generateCommandName (Zv3)

Generates command name from file path:

```javascript
// ============================================
// generateCommandName - Generate command name from path
// Location: chunks.152.mjs:894-896
// ============================================

// Logic:
// 1. For skills: directory-based naming (skill name)
// 2. For regular: filename without extension, colon-separated for subdirs

// Examples:
// .claude/commands/analyze.md           → "analyze"
// .claude/commands/review/code.md       → "review:code"
// .claude/commands/tools/lint/check.md  → "tools:lint:check"
// .claude/commands/myskill/skill.md     → "myskill" (skill)
```

---

## Skill Detection

Skills are special commands identified by `skill.md` files:

```javascript
// isSkillFile (WK0):
function isSkillFile(filePath) {
  return filePath.endsWith("/skill.md");
}

// getSkillBaseDir (RSA):
function getSkillBaseDir(filePath) {
  return path.dirname(filePath);
}
```

**Skill characteristics:**
- Named after parent directory
- Have access to `skillBaseDir` for file operations
- Progress message: "loading" instead of "running"
- Can contain multiple related files

---

## Deduplication

### deduplicateCommands (Qv3)

Handles naming conflicts between command sources:

```javascript
// ============================================
// deduplicateCommands - Handle command name conflicts
// Location: chunks.152.mjs:852-868
// ============================================

// ORIGINAL (for source lookup):
function Qv3(A) {
  let Q = new Map;
  for (let B of A) {
    let G = Zv3(B.filePath, B.baseDir);
    if (B.filePath.endsWith("/skill.md")) {
      Q.set(G, B);
      continue
    }
    if (!Q.has(G)) Q.set(G, B)
  }
  return Array.from(Q.values())
}

// READABLE (for understanding):
function deduplicateCommands(commands) {
  const seen = new Map();

  for (const cmd of commands) {
    const name = generateCommandName(cmd.filePath, cmd.baseDir);

    // skill.md has priority - always overwrites
    if (cmd.filePath.endsWith("/skill.md")) {
      seen.set(name, cmd);
      continue;
    }

    // First occurrence wins for non-skill files
    if (!seen.has(name)) {
      seen.set(name, cmd);
    }
  }

  return Array.from(seen.values());
}

// Mapping: Qv3→deduplicateCommands, A→commands, Q→seen, B→cmd, G→name,
//          Zv3→generateCommandName
```

**Priority order:**
1. `skill.md` takes precedence over individual files (always overwrites)
2. First occurrence wins for same-named commands
3. Since loading order is Policy → User → Project, policy commands have highest priority

---

## Plugin Command Integration

Plugins can also provide commands through manifests:

```javascript
// ============================================
// getSkillsFromPluginsAndDirectories (Sv3)
// Location: chunks.152.mjs:2151-2168
// ============================================

// Plugins contribute commands through:
// 1. Plugin manifest files
// 2. Plugin command directories

// Plugin command structure:
{
  type: "prompt",
  name: "plugin-name:command",
  pluginInfo: {
    pluginManifest: manifest,
    repository: repositoryUrl
  }
}
```

---

## Example Custom Commands

### Simple Prompt Command

**File:** `.claude/commands/explain.md`

```markdown
---
description: Explain code in simple terms
---

Please explain the following code in simple terms that a beginner could understand:

$ARGUMENTS
```

### Restricted Tools Command

**File:** `.claude/commands/read-only-review.md`

```markdown
---
description: Review code without making changes
allowed-tools: Read, Grep, Glob
argument-hint: <file-path>
---

Review the code at $ARGUMENTS for:
- Code quality issues
- Potential bugs
- Improvement suggestions

Do NOT make any changes - only analyze and report.
```

### Model Override Command

**File:** `.claude/commands/quick-check.md`

```markdown
---
description: Quick code check with fast model
model: claude-haiku-3-5-20241022
---

Quickly check this code for obvious issues:

$ARGUMENTS
```

### Skill Directory

**Directory:** `.claude/commands/code-review/`

**File:** `.claude/commands/code-review/skill.md`

```markdown
---
description: Comprehensive code review skill
when_to_use: Use when user asks for a code review
allowed-tools: Read, Grep, Glob, Write
---

Perform a comprehensive code review on the specified files.

Base directory for skill assets: This skill's base directory

$ARGUMENTS
```

---

## Settings Controls

Custom commands respect settings flags:

| Setting | Effect |
|---------|--------|
| `userSettings` | Enables loading from `~/.claude/commands/` |
| `projectSettings` | Enables loading from `.claude/commands/` |

```javascript
// Check settings before loading:
EH("userSettings")     // isSettingsEnabled("userSettings")
EH("projectSettings")  // isSettingsEnabled("projectSettings")
```

---

## Error Handling

The loading system gracefully handles errors:

```javascript
// File read errors: skip the file
try {
  const content = await readFile(filePath);
  // ...
} catch {
  return null;  // Skip this file
}

// Command build errors: skip the command
try {
  return buildCommand(file);
} catch {
  return null;  // Skip this command
}

// Overall load errors: return empty array
try {
  return await loadAllCommands();
} catch {
  return [];  // No custom commands
}
```

---

## Performance Optimizations

### Memoization

All loading functions are memoized:

```javascript
const loadCustomCommandsForExecution = memoize(async () => { ... });
const loadCommandFilesFromDirectories = memoize(async (subdir) => { ... });
```

### Timeout

3-second timeout prevents slow directory scans:

```javascript
const timeout = setTimeout(() => abortController.abort(), 3000);
```

### Parallel Loading

All sources are scanned in parallel:

```javascript
const [policy, user, project] = await Promise.all([
  scanMarkdownFiles(policyDir),
  scanMarkdownFiles(userDir),
  Promise.all(projectDirs.map(scanMarkdownFiles))
]);
```

---

## See Also

- [Command Parsing](./parsing.md) - How commands are parsed
- [Command Execution](./execution.md) - How commands execute
- [Built-in Commands](./builtin_commands.md) - Built-in command reference
- [Streaming and Errors](./streaming_errors.md) - Error handling
