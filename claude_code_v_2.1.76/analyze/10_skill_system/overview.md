# Skill System & Slash Command: Unified Abstraction (Claude Code 2.1.76)

## Overview

The Skill System and the Slash Command system are **the same unified abstraction**: a "command object" that can be invoked by either the user (via `/name` in the REPL input) or by the LLM (via the `Skill` tool). Both mechanisms resolve to the same command registry, execute via the same dispatch logic, and share the same runtime object structure.

The key insight is that `type: "prompt"` commands are the bridge. Every skill is a command. Every user-invocable skill is also a slash command. The distinction is purely about **who can invoke it** and **how it was loaded**:

```
Command Sources                         Invocation Paths
─────────────────────                   ──────────────────
Built-in (hardcoded)                    User types "/name"  → REPL autocomplete → executeCommand
  └─ type: "local" / "local-jsx"                          ↓
     (only user, never LLM)             handleSlashInput (Mb4)
                                                           ↓
Skills from disk (.claude/skills/)      executeCommand (ifY)
  └─ type: "prompt"                          │
     (user + LLM unless blocked)       ──────┼──────────────────────────
                                             │
Plugin skills                           LLM calls Skill tool (m66)
  └─ type: "prompt"                          ↓
     (user + LLM, usually)             handlePromptCommandFromTool (Pb4)
                                             ↓
Bundled skills (registered at init)    handlePromptCommand (Wb4)
  └─ type: "prompt"                          ↓
     (user + LLM)                      LLM executes with full prompt context
```

---

## v2.1.76 New Features

This version introduces several significant enhancements to the Skill System:

### 1. InstructionsLoaded Hook Event

A new hook event type that fires when skill instructions are injected into the conversation context. This enables:
- Audit logging of skill usage
- Initialization actions when skills load
- Token budget monitoring

**Symbols:** `WF6` (hasInstructionsLoadedHook), `ZF6` (executeInstructionsLoadedHooks)

### 2. Environment Variable Support

Skills can now use `${CLAUDE_SKILL_DIR}` in their content, which is replaced with the skill's base directory path at execution time. This enables:
- Relative path references within skills
- Portable skill definitions across projects

**Implementation:** In `getPromptForCommand` (chunks.90.mjs:1238-1240)

### 3. New Bundled Skills

| Skill | Purpose | Symbol |
|-------|---------|--------|
| `update-config` | Configure settings.json | `uyq` |
| `stuck` | Diagnose frozen sessions | `dyq` |
| `claude-api` | Claude API assistance | `PMz` |
| `simplify` | Code review and cleanup | `eyq` |
| `batch` | Parallel worktree operations | `YLq` |
| `loop` | Recurring prompt scheduling | `gJz` (v2.1.71) |

---

## Documentation Guide

This module contains multiple specialized documents. Use this guide to navigate:

| Document | Content | When to Use |
|----------|---------|-------------|
| **overview.md** (this file) | Architecture, unified abstraction, command types | Understanding high-level concepts |
| [implementation.md](implementation.md) | Code analysis, algorithms, data structures | Deep code understanding |
| [skill_discovery_loading.md](skill_discovery_loading.md) | Discovery pipeline, loading tiers | Understanding how skills are found |
| [skill_context_modifier.md](skill_context_modifier.md) | allowedTools, model override, hooks injection | Understanding context modification |
| [skill_tool.md](skill_tool.md) | Skill tool details, permissions, forked execution | Understanding LLM skill invocation |
| [skill_reminder_integration.md](skill_reminder_integration.md) | System reminder injection, skill discovery for LLM | Understanding skill visibility |
| [skill_compact_interaction.md](skill_compact_interaction.md) | State preservation across compaction | Understanding skill persistence |
| [cross_component_integration.md](cross_component_integration.md) | All integration points summary | Big picture view |
| [plugin_skills.md](plugin_skills.md) | Plugin skill loading, first-party detection | Plugin integration |
| [builtin_skills_reference.md](builtin_skills_reference.md) | Built-in skill catalog | Reference for available skills |
| [11_hooks/implementation.md](../11_hooks/implementation.md) | Complete hooks system | Hook events and execution |

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Skill System, Hooks
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Slash Commands, UI Components

Key functions in this document:
- `createSkillObject` (v94) - Factory that builds a command object from parsed SKILL.md
- `registerPromptSkill` (rw) - Registers a bundled skill into the runtime registry
- `getAllSkills` (I0) - Main entry point, returns all loaded skills (memoized)
- `getSkills` (z5z) - Aggregates all skill sources
- `loadSkillDirCommands` (JV8) - Loads from skill directories (memoized)
- `loadSkillsFromDirectory` (Zp6) - Loads skills from a single directory
- `loadPluginSkills` (hk8) - Loads skills from installed plugins
- `getAllSkillsForTool` (NR) - Filter: commands visible to LLM via Skill tool
- `getSlashCommandSkills` (vp6) - Filter: commands shown in slash command autocomplete UI
- `SkillTool` (m66) - The actual Skill tool object used by the agent loop
- `SKILL_TOOL_NAME` (oH) - The string constant `"Skill"`
- `generateSkillListingAttachment` (guY) - Builds `skill_listing` for system reminder injection
- `formatSkillListing` (fV8) - Budget-aware skill list text formatter
- `registerSkillHooks` (gc4) - Registers hooks from skill frontmatter
- `trackSkillUsage` (ON1) - Records skill usage for scoring
- `computeSkillScore` (ux8) - Calculates skill priority score with half-life decay

---

## Part 1: The Unified Command Object Interface

### What it is

Every command in Claude Code — whether a hardcoded built-in, a user-defined skill file, a plugin skill, or a bundled built-in skill — is represented as the **same runtime object shape**. There is no separate "command class" and "skill class". The interface is:

```typescript
interface CommandObject {
  // Identity
  type: "local" | "local-jsx" | "prompt"
  name: string                    // Canonical internal name (e.g., "commit")
  userFacingName: () => string    // Display name (may differ from name for plugins)
  description: string
  aliases?: string[]

  // Lifecycle
  isEnabled: () => boolean        // Memoizable gate (feature flags, etc.)
  isHidden: boolean               // True if userInvocable=false (model-only)
  progressMessage: string         // "running" for skills, custom for built-ins

  // Invocation access control
  userInvocable?: boolean         // false = only LLM can invoke this
  disableModelInvocation?: boolean // true = only user can invoke this

  // Prompt-type fields (type === "prompt")
  hasUserSpecifiedDescription: boolean
  whenToUse?: string              // LLM invocation guidance
  allowedTools?: string[]         // Tool whitelist during skill execution
  argNames?: string[]             // Named arguments from frontmatter "arguments:"
  argumentHint?: string           // UI hint for the argument input
  model?: string                  // Model override for this skill
  context?: "fork"                // "fork" = run in isolated sub-agent
  agent?: string                  // Agent type for forked execution
  paths?: string[]                // Glob patterns for conditional activation
  version?: string                // Skill version tracking
  hooks?: ParsedHooks             // Hook definitions from frontmatter
  skillRoot?: string              // Base directory (for hook scope)

  // Loading metadata
  source: "builtin" | "bundled" | "policySettings" | "userSettings" | "projectSettings" | "plugin" | "mcp"
  loadedFrom: "bundled" | "skills" | "commands_DEPRECATED" | "plugin" | "mcp" | "user-defined"
  contentLength: number

  // Load / execution
  load?: () => Promise<CommandImpl>   // For "local" and "local-jsx" types
  getPromptForCommand?: (args: string, ctx: ToolUseContext) => Promise<ContentBlock[]>  // For "prompt" type
}
```

**Why this design:** By unifying the interface, the entire dispatch chain (`handleSlashInput → executeCommand → handlePromptCommand`) is type-agnostic for the registry lookups. The same `findCommand(cZ)`, `isCommandAvailable(Sd)`, and `filterCommands(PgA)` functions work for both built-ins and skills without separate codepaths.

### The Source × LoadedFrom Matrix

The `source` and `loadedFrom` fields together describe where a command came from. This is critical because several filters use them to determine visibility:

| source | loadedFrom | Who can see | Who can invoke | Example |
|--------|-----------|-------------|----------------|---------|
| `"builtin"` | `"builtin"` | User (autocomplete + REPL) | User only | `/help`, `/clear` |
| `"bundled"` | `"bundled"` | User + LLM | User + LLM | keybindings-help, debug |
| `"policySettings"` | `"skills"` | User + LLM (with filter) | User + LLM | managed skills |
| `"userSettings"` | `"skills"` | User + LLM | User + LLM | `~/.claude/skills/commit/` |
| `"projectSettings"` | `"skills"` | User + LLM | User + LLM | `.claude/skills/review/` |
| `"projectSettings"` | `"commands_DEPRECATED"` | LLM (legacy) | User + LLM | `.claude/commands/` |
| `"plugin"` | `"plugin"` | User + LLM | User + LLM | Plugin-distributed skills |
| `"mcp"` | `"mcp"` | User + LLM | User + LLM | MCP server slash commands |

---

## Part 2: The Unified Command Object Factory

> **For detailed code analysis**, see [implementation.md](implementation.md#creating-the-skill-object).

### createSkillObject (v94)

**What it does:** Creates the runtime command object from a parsed SKILL.md file. This is the factory function that bridges static markdown files and the runtime command interface.

**Key responsibilities:**
1. Builds the command object with all metadata (name, description, allowedTools, etc.)
2. Provides `getPromptForCommand()` that processes the skill prompt at invocation time:
   - Base directory injection
   - Argument substitution (`$1`, `${args.foo}`)
   - Session ID injection
   - Shell expansion (`!`cmd``, ```!\ncmd\n```)

**Key insight:** The prompt is dynamically assembled at invocation time, not stored statically. This allows skills to contain `!`git log --oneline -10`` that executes when the skill runs.

### registerPromptSkill (Sj) - The Bundled Skill Variant

**What it does:** An alternate factory for bundled (code-defined) skills registered at application startup.

**Why this approach:** Bundled skills need the same runtime interface as user-defined skills to flow through `handlePromptCommand` without special-casing. The key difference is `getPromptForCommand` is provided as a function in code instead of read from a file.

---

## Part 3: Skill Loading Architecture

### Five-Tier Loading Hierarchy

```
loadSkills (ukA) in chunks.134.mjs:2059
│
├── Tier 1: Managed skills (policySettings)
│   └── loadSkillFromDir(appInstallDir + "/skills", "policySettings")
│
├── Tier 2: User skills (userSettings, if permitted)
│   └── loadSkillFromDir(homeDir + "/.claude/skills", "userSettings")
│
├── Tier 3: Project skills from explicit roots (projectSettings, if permitted)
│   └── for each project root in getProjectSkillDirs():
│       loadSkillFromDir(projectRoot + "/.claude/skills", "projectSettings")
│
├── Tier 4: Project skills from CWD roots (projectSettings, if permitted)
│   └── for each root in getProjectRoots():
│       loadSkillFromDir(root + "/.claude/skills", "projectSettings")
│
└── Tier 5: Legacy commands (backward compat)
    └── loadLegacyCommands() → scans .claude/commands/
```

**Deduplication:** After loading all tiers, each skill file path gets its inode via `getInodeId` (GEY). The same physical file loaded from two different paths (e.g., via a symlink) is deduplicated — only the first-seen inode wins.

**Conditional skills:** Skills with a `paths:` frontmatter field are separated into a `conditionalSkillsMap` (VW6). They are NOT returned by `loadSkills` immediately. Instead, `activateConditionalSkills` (LW6) checks these against file-operation events — when a tool writes/reads a file matching the glob pattern, the corresponding skill activates dynamically.

### loadSkillFromDir (oQ1) - Single Directory Parser

**What it does:** Scans one `.claude/skills/` directory and builds command objects for every SKILL.md found.

**How it works:**
1. Read the directory for subdirectories
2. For each subdirectory containing a `SKILL.md` (or multiple `.md` files):
   - Read the SKILL.md content
   - Parse frontmatter via yaml parser (`yD`)
   - Extract all metadata fields: `description`, `allowed-tools`, `user-invocable`, `disable-model-invocation`, `model`, `context`, `agent`, `arguments`, `paths`, `when-to-use`, `hooks`, `version`
   - Derive the command name: subdirectory name, optionally namespaced by relative path from root
   - Call `createSkillObject(v94)` to build the runtime object
3. Handle `deduplicateSkillFiles(fEY)`: if both a `SKILL.md` and other `.md` files exist in a dir, prefer `SKILL.md`
4. Return array of `{ skill: CommandObject, filePath: string }`

**Name derivation for namespacing:**
- `.claude/skills/commit/SKILL.md` → name `"commit"` (no namespace)
- `.claude/skills/frontend/deploy/SKILL.md` → name `"frontend:deploy"` (colon-separated namespace)
- The `getRelativePath(cF4)` function computes the namespace prefix by comparing the skill's directory to the skill root

### loadPluginSkills (B0A) - Plugin Skill Loader

**What it does:** Loads skills from all installed plugins. Each plugin may contribute skills from its `skillsPath` or `skillsPaths` directories.

**How it works:**
1. Get all enabled plugins via `getLoadedPlugins(iY)`
2. For each plugin, call `loadPluginSkillDir(vU7)` on its skill path(s)
3. `vU7` first checks for a root-level `SKILL.md` in the plugin's skills directory (a single-skill plugin)
4. If not found, scans subdirectories for `SKILL.md` files (a multi-skill plugin)
5. Skills from plugins set `source: "plugin"`, `loadedFrom: "plugin"`, and carry a `pluginInfo` object for telemetry

---

## Part 4: The Skill Tool — Model-Side Invocation

> **For detailed code analysis**, see [skill_tool.md](skill_tool.md).

### Overview of the Skill Tool (wt)

The `Skill` tool is the mechanism by which the LLM can autonomously invoke skills. It bridges the LLM's reasoning ("the user wants to commit code") to the skill execution pipeline. Critically, it feeds into the **same `handlePromptCommand(Wb4)` function** that handles user-typed `/commit`.

### Key Tool Properties

| Property | Value | Purpose |
|----------|-------|---------|
| `name` | `"Skill"` | Tool identifier for LLM API calls |
| `inputSchema` | `{ skill: string, args?: string }` | Skill name and optional arguments |
| `isConcurrencySafe` | `false` | Cannot run in parallel |
| `isReadOnly` | `false` | Can modify state |

### Tool Lifecycle Methods

1. **`validateInput`** - Checks skill name format and existence in registry
2. **`checkPermissions`** - Auto-approves safe skills, prompts user for skills with `allowedTools` or `hooks`
3. **`call`** - Delegates to `handlePromptCommandFromTool(Pb4)` → `handlePromptCommand(Wb4)`

### The Skill Tool Prompt (d0A)

The prompt instructs the LLM with a **"BLOCKING REQUIREMENT"** — it MUST invoke the Skill tool before generating any other response when a matching skill exists. This prevents the LLM from answering "commit my changes" with text instead of triggering the skill.

**Key prompt instructions:**
- Available skills are listed in system-reminder messages
- Never mention a skill without calling this tool
- Do not use for built-in CLI commands (`/help`, `/clear`, etc.)
- If `<command-name>` tag is present, skill is already loaded

---

## Part 5: The System Reminder Injection Pipeline

> **For detailed code analysis**, see [skill_reminder_integration.md](skill_reminder_integration.md).

The LLM needs to know which skills exist before it can decide to invoke them. Claude Code injects skill availability into the conversation as a `system-reminder` attachment on every turn. This is a four-stage pipeline:

```
Turn N starts
     │
     ▼
[Stage 1] getAllSkillsForTool (NR)
     Filter: type==="prompt", !disableModelInvocation, source!=="builtin"
     Result: Array of visible-to-LLM skills
     │
     ▼
[Stage 2] generateSkillListingAttachment (guY)
     Filter to NEW skills (not yet sent via nT6 Set)
     Track isInitial flag for first turn
     │
     ▼
[Stage 3] formatSkillListing (fV8)
     Budget-aware text formatting:
     charBudget = min(16000, contextWindowTokens * 4 * 0.02)
     Tier 1: Full | Tier 2: Truncated | Tier 3: Names only
     │
     ▼
[Stage 4] System Reminder Message
     "The following skills are available for use with the Skill tool:\n\n{listing}"
```

### Key Design Decisions

**Delta Updates (Stage 2):** The skill list can be large. The `nT6` set tracks which skills have been sent, so new skills discovered mid-session are sent incrementally without re-sending known skills.

**Budget-Aware Formatting (Stage 3):** The budget is ~2% of the context window (~16K chars for 200K token models). This caps skill listings at ~1.6K tokens regardless of skill count.

**Documentation Requirement:** Skills without `description:` or `when-to-use:` are not exposed to the LLM. This forces skill authors to write documentation for discoverability.

### Invoked Skills Tracking (Tqq / Uw6)

> **For detailed analysis**, see [skill_compact_interaction.md](skill_compact_interaction.md).

When skills are invoked, they're tracked for state preservation across compaction:

```
Skill invoked → registerInvokedSkill(Uw6) → skillsInSession Map
                                               │
Compaction triggered ←──────────────────────────┘
       │
       ▼
getInvokedSkillsAttachment(Tqq) → invoked_skills attachment
       │
       ▼
Skills restored in post-compaction context
```

**The LLM sees:**
```
The following skills are available for use with the Skill tool:

- commit: Create a git commit - use when user wants to commit changes
- review: Review pull request - use when asked to review or check a PR
- deploy: Deploy to staging - use when deploying to staging environment
```

### Invoked Skills Tracking (Tqq / Uw6)

When a skill runs, it is recorded in the session state via `registerInvokedSkill(Uw6)`. This builds a separate `invoked_skills` attachment that reminds the LLM of skills already run in this session:

```javascript
// Register skill at invocation time (chunks.1.mjs:3037)
function Uw6(skillName, skillPath, skillContent, agentId = null) {
    let key = `${agentId??""}:${skillName}`;
    sessionState.invokedSkills.set(key, {
        skillName, skillPath, content: skillContent,
        invokedAt: Date.now(), agentId
    })
}

// Build reminder attachment (chunks.147.mjs:1896)
function Tqq(agentId) {
    let invokedSkills = getInvokedSkillsForAgent(agentId);  // St6() → state.invokedSkills filtered by agentId
    if (invokedSkills.size === 0) return null;
    let sorted = Array.from(invokedSkills.values())
        .sort((a, b) => b.invokedAt - a.invokedAt)  // most recent first
        .map(s => ({ name: s.skillName, path: s.skillPath, content: s.content }));
    return createAttachmentMessage({ type: "invoked_skills", skills: sorted })
}

// System reminder message (chunks.173.mjs:823)
case "invoked_skills": {
    if (A.skills.length === 0) return [];
    let K = A.skills.map(s =>
        `### Skill: ${s.name}\nPath: ${s.path}\n\n${s.content}`
    ).join("\n\n---\n\n");
    return wrapAsSystemReminder([createMetaMessage({
        content: `The following skills were invoked in this session. Continue to follow these guidelines:\n\n${K}`,
        isMeta: true
    })])
}
```

**Why track invoked skills:** Once a skill has run and injected its instructions, the LLM should continue following those instructions on subsequent turns even if the skill's prompt is no longer in the immediate context. The `invoked_skills` reminder re-injects the skill's full content as a "continue following these guidelines" message, ensuring persistent behavioral effects.

---

## Part 6: Slash Command Autocomplete UI

> **For detailed code analysis**, see [slash_command_mapping.md](slash_command_mapping.md).

The user-visible part of the unified system is the slash command picker that appears when a user types `/` in the REPL input. This is a four-layer autocomplete system:

### Layer Architecture

```
Layer 1: Input Detection (PE6)
    └── Immediate execution for local-jsx commands (/help, /config)
    └── Otherwise: route through message pipeline

Layer 2: Fuzzy Suggestion Filter (PgA)
    └── "/" alone: Show frecency-sorted list (top 5 recent + source tier groups)
    └── "/partial": Fuse.js fuzzy search with weighted keys

Layer 3: Ghost Text Inline Completion (pv6 + MgA)
    └── Detects /command mid-sentence
    └── Shows completion as ghost text

Layer 4: useCommandSuggestions Hook (WGq)
    └── React hook orchestrating all autocomplete behavior
```

### Ranking Algorithm for "/" (Empty Query)

1. Top 5 most recently/frequently used prompt skills (frecency score)
2. User settings skills (alphabetical)
3. Project settings skills (alphabetical)
4. Policy settings skills (alphabetical)
5. Built-in commands (alphabetical)

### disableSlashCommands Gate

The entire autocomplete system can be disabled via `disableSlashCommands` prop for embedded/SDK contexts where the REPL renders inside another application.

---

## Part 7: Complete Flow Diagram — Unified Slash/Skill Invocation

```
USER TYPES "/commit fix auth bug"
                     │
                     ▼
          ┌─────────────────────┐
          │  PE6: handleSubmit  │   chunks.185.mjs:3105
          │  (onSubmit handler) │
          └──────────┬──────────┘
                     │ Is it immediate? (type=local-jsx AND immediate=true)
             ┌───────┴───────┐
           YES              NO
             │               │
             ▼               ▼
    Execute JSX directly   handleSlashInput(Mb4)
    (skip message pipeline) chunks.130.mjs:1506
                             │
                             ▼
                    parseSlashCommand(Db4)
                    → { commandName: "commit", args: "fix auth bug", isMcp: false }
                             │
                             ▼
                    isCommandAvailable(Sd) → YES
                             │
                             ▼
                    executeCommand(ifY)
                             │
                    findCommand(zI) → command object
                             │
                    userInvocable? → YES
                             │
                    type === "prompt"? → YES
                             │
                    context === "fork"? ──YES→ handleForkedCommand(cfY)
                             │ NO                (isolated sub-agent)
                             ▼
                    handlePromptCommand(Wb4)
                             │
              ┌──────────────┼──────────────────────────────┐
              │              │                              │
              ▼              ▼                              ▼
      getPromptForCommand  registerSkillHooks(gc4)    buildSkillMetadata(nfY)
      (resolves SKILL.md   (if command.hooks)         → <command-message>commit</command-message>
       content with args,                               <command-name>/commit</command-name>
       shell expansion,                                 <command-args>fix auth bug</command-args>
       session ID)
              │
              ▼
      Messages built:
        1. userMessage(<command-message>)  ← recorded in conversation
        2. userMessage(promptContent, isMeta:true) ← hidden from compaction
        3. ...thinkingTokenAttachments
        4. attachmentMessage({ type: "command_permissions", allowedTools, model })
      shouldQuery: true → Agent loop runs with LLM


LLM INVOKES SKILL via Skill tool
                     │
                     ▼
          ┌─────────────────────────┐
          │  skillTool.call(wt)     │   chunks.132.mjs
          │  { skill: "commit",     │
          │    args: "fix auth bug" │
          └──────────┬──────────────┘
                     │
                     ▼
          handlePromptCommandFromTool(Pb4)
          chunks.130.mjs:1819
                     │
          isCommandAvailable? → YES
          type === "prompt"?  → YES
                     │
                     ▼
          handlePromptCommand(Wb4)  ← SAME FUNCTION as user path!
          chunks.130.mjs:1826
```

**Key insight:** The red thread through this diagram is that **both invocation paths converge on `handlePromptCommand(Wb4)`**. The Skill tool is not a different execution mechanism — it is simply an alternative entry point that skips the user-input parsing layer and goes directly to the command execution layer. The command object, the prompt assembly, the hook registration, the message building — all identical.

---

## Summary: The Unified Abstraction

The slash command and skill system share one unified abstraction: the **command object**. Its interface is:
- `type`: determines execution path (local/jsx for interactive, prompt for LLM-driven)
- `getPromptForCommand`: the single entry point for prompt assembly (content + args + shell expansion)
- `source` / `loadedFrom`: provenance metadata for filtering and display
- `userInvocable` / `disableModelInvocation`: access control switches

The two invocation paths (user typing `/name` vs LLM calling `Skill { skill: "name" }`) are both thin wrappers over the same `handlePromptCommand(Wb4)` core. The only functional difference is entry point — `handleSlashInput` for humans, `handlePromptCommandFromTool` for the model.

The three filter views (`getAllCommands`, `getSkillToolCommands`, `getSlashCommandSkills`) are the only mechanism by which this single unified registry is exposed differently to the autocomplete UI, the Skill tool, and the system reminder injection — all reading from the same source.
