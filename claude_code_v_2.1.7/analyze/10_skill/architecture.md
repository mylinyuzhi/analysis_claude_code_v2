# Skill System Architecture

## Overview

The Skill System in Claude Code v2.1.7 provides a unified framework for defining, loading, and executing reusable AI-powered operations. Since v2.1.3, skills and slash commands have been merged into a single system.

> Symbol mappings:
> - [symbol_index_core.md](../00_overview/symbol_index_core.md) - Core modules
> - [symbol_index_infra.md](../00_overview/symbol_index_infra.md) - Infrastructure modules

**Key components:**
- `getSkills` (Wz7) - Main orchestrator for loading all skills
- `getAllCommands` (Aj) - Master aggregator combining all command sources
- `getLLMInvocableSkills` (Nc) - Filter skills for LLM invocation
- `getUserSkills` (hD1) - Filter user-defined skills
- `loadSkillDirectoryCommands` (lO0) - Load from skill directories
- `getPluginSkills` (tw0) - Load from plugins
- `getBundledSkills` (kZ9) - Get bundled skills

---

## Quick Navigation

- [Architecture Diagram](#architecture-diagram)
- [Unified Skill Model](#unified-skill-model)
- [Loading Sources](#loading-sources)
- [Filtering Layers](#filtering-layers)
- [Integration Points](#integration-points)

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        SKILL SYSTEM ARCHITECTURE                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    LLM INVOCATION LAYER                          │  │
│  │  ┌──────────────┐    ┌─────────────────┐    ┌────────────────┐  │  │
│  │  │  Skill Tool  │    │  Other Tools    │    │  MCP Tools     │  │  │
│  │  │    (kF)      │    │  (Bash, Read...)│    │                │  │  │
│  │  └──────┬───────┘    └─────────────────┘    └────────────────┘  │  │
│  └─────────┼───────────────────────────────────────────────────────┘  │
│            │                                                           │
│            ▼                                                           │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    COMMAND PROCESSING LAYER                      │  │
│  │  ┌────────────────────────────────────────────────────────────┐  │  │
│  │  │  executeSlashCommand (ab5) → processPromptSlashCommand (RP2)│  │  │
│  │  └────────────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                              │                                          │
│                              ▼                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    FILTERING LAYER                               │  │
│  │  ┌─────────────┐  ┌─────────────────┐  ┌─────────────────────┐  │  │
│  │  │     Nc()    │  │     hD1()       │  │       Aj()          │  │  │
│  │  │ LLM-Invoke  │  │  User Skills    │  │   All Commands      │  │  │
│  │  │   Skills    │  │                 │  │                     │  │  │
│  │  └──────┬──────┘  └────────┬────────┘  └──────────┬──────────┘  │  │
│  │         └──────────────────┴───────────────────────┘             │  │
│  │                          │ filter by criteria                    │  │
│  └──────────────────────────┼───────────────────────────────────────┘  │
│                              ▼                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    LOADING LAYER (Parallel)                      │  │
│  │                                                                   │  │
│  │        getSkills (Wz7) - Promise.all([...])                      │  │
│  │                          │                                        │  │
│  │         ┌────────────────┼────────────────┐                      │  │
│  │         ▼                ▼                ▼                      │  │
│  │   ┌──────────┐    ┌──────────┐    ┌──────────┐                  │  │
│  │   │  lO0()   │    │  tw0()   │    │  kZ9()   │                  │  │
│  │   │ Skill    │    │ Plugin   │    │ Bundled  │                  │  │
│  │   │ Dirs     │    │ Skills   │    │ Skills   │                  │  │
│  │   └────┬─────┘    └────┬─────┘    └────┬─────┘                  │  │
│  │        │               │               │                         │  │
│  └────────┼───────────────┼───────────────┼─────────────────────────┘  │
│           ▼               ▼               ▼                            │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    FILE SYSTEM LAYER                             │  │
│  │                                                                   │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌───────────┐  │  │
│  │  │  Managed   │  │    User    │  │  Project   │  │  Plugin   │  │  │
│  │  │  Skills    │  │   Skills   │  │  Skills    │  │  Skills   │  │  │
│  │  │ (policy)   │  │(~/.claude) │  │(./.claude) │  │           │  │  │
│  │  └────────────┘  └────────────┘  └────────────┘  └───────────┘  │  │
│  │                                                                   │  │
│  │  File Format: SKILL.md or *.md with frontmatter                  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Unified Skill Model

### Skill = Slash Command (Since v2.1.3)

In v2.1.3, the skill system was unified with slash commands:

| Aspect | Pre-2.1.3 | v2.1.3+ |
|--------|-----------|---------|
| File name | `SKILL.md` only | `SKILL.md` or `*.md` |
| Invocation | LLM only | LLM + User (`/command`) |
| UI | Hidden | Visible in `/help` |
| Tool | SkillTool | Skill Tool (unified) |

### Skill Object Interface

```typescript
interface Skill {
  // Identity
  name: string;                    // Internal name
  type: "prompt" | "local" | "local-jsx";
  source: "plugin" | "builtin" | "bundled" | "mcp" | string;
  loadedFrom: "skills" | "plugin" | "bundled" | "commands_DEPRECATED";

  // Metadata
  description: string;
  aliases?: string[];
  argumentHint?: string;
  whenToUse?: string;              // LLM guidance for invocation

  // Behavior
  allowedTools?: string[];         // Tool restrictions
  model?: string;                  // Model override
  userInvocable?: boolean;         // Can users invoke? (default: true)
  disableModelInvocation?: boolean; // Block LLM invocation?
  progressMessage?: string;        // Loading message
  context?: "main" | "fork";       // Execution context
  hooks?: HooksConfig;             // Skill hooks

  // Methods
  isEnabled: () => boolean;
  userFacingName: () => string;
  getPromptForCommand: (args: string, context: Context) => Promise<Content[]>;
}
```

---

## Loading Sources

### Three-Tier Loading

Skills are loaded from three priority levels:

| Tier | Path | Priority | Scope |
|------|------|----------|-------|
| 1. Managed | `~/.claude/skills/` | Highest | Organization-wide (policy) |
| 2. User | `<user-config>/.claude/skills/` | Medium | User-specific |
| 3. Project | `.claude/skills/` | Lowest | Project-specific |

### Aggregation Flow

```javascript
// ============================================
// Skill Loading Pipeline
// Location: chunks.146.mjs:2299-2318, 2448-2454
// ============================================

// Step 1: Load from all sources (Wz7)
const { skillDirCommands, pluginSkills, bundledSkills } = await Promise.all([
  loadSkillDirectoryCommands(context),  // lO0 - Directory skills
  getPluginSkills()                       // tw0 - Plugin skills
]);
const bundled = getBundledSkills();       // kZ9 - Bundled skills

// Step 2: Combine with MCP prompts and built-in (Aj)
const allCommands = [
  ...bundledSkills,      // Bundled first
  ...skillDirCommands,   // Directory skills
  ...mcpPrompts,         // MCP server prompts
  ...pluginSkills,       // Plugin skills
  ...dynamicSkills,      // Dynamic/eligibility skills
  ...builtinCommands     // Built-in commands last
].filter(cmd => cmd.isEnabled());
```

**Why this order:**
- Bundled skills have highest priority (can override others)
- Directory skills next (user customization)
- Plugin skills after (extensibility)
- Built-in commands last (defaults)

---

## Filtering Layers

### getAllCommands (Aj)

Returns all enabled commands from all sources:

```javascript
// Location: chunks.146.mjs:2448-2454
Aj = W0(async (A) => {
  let [{
    skillDirCommands: Q,
    pluginSkills: B,
    bundledSkills: G
  }, Z, Y] = await Promise.all([Wz7(A), z3A(), Dz7()]);
  return [...G, ...Q, ...Z, ...B, ...Y, ...nY9()].filter((J) => J.isEnabled())
});
```

### getLLMInvocableSkills (Nc)

Filters skills that can be invoked by the LLM via Skill Tool:

```javascript
// Location: chunks.146.mjs:2456-2457
Nc = W0(async (A) => {
  return (await Aj(A)).filter((B) =>
    B.type === "prompt" &&
    !B.disableModelInvocation &&
    B.source !== "builtin" &&
    (B.loadedFrom === "bundled" ||
     B.loadedFrom === "commands_DEPRECATED" ||
     B.hasUserSpecifiedDescription ||
     B.whenToUse)
  )
});
```

**Filter criteria:**
- Must be `prompt` type (not local/local-jsx)
- Not disabled for model invocation
- Not a built-in command
- Has description or `whenToUse` guidance

### getUserSkills (hD1)

Filters skills visible to users in `/help`:

```javascript
// Location: chunks.146.mjs:2458-2464
hD1 = W0(async (A) => {
  return (await Aj(A)).filter((B) =>
    B.type === "prompt" &&
    B.source !== "builtin" &&
    (B.hasUserSpecifiedDescription || B.whenToUse) &&
    (B.loadedFrom === "skills" ||
     B.loadedFrom === "plugin" ||
     B.loadedFrom === "bundled" ||
     B.disableModelInvocation)
  )
});
```

---

## Integration Points

### Skill Tool Integration

The Skill Tool (`kF`) allows the LLM to invoke skills:

```javascript
// System prompt integration
const skillHint = getSkillList().length > 0 && toolsIncludeSkillTool
  ? `- /<skill-name> (e.g., /commit) is shorthand for users to invoke a skill.
     Use the ${SKILL_TOOL_NAME} tool to execute them.
     IMPORTANT: Only use for skills listed in the tool's user-invocable section.`
  : "";
```

### Token Budgeting

Skills are limited by a token budget (default: 15,000 characters):

```javascript
// Environment variable
const SKILL_BUDGET = parseInt(process.env.SLASH_COMMAND_TOOL_CHAR_BUDGET) || 15000;

// Filter skills to fit budget
function limitSkillsByBudget(skills, budget) {
  let totalChars = 0;
  const included = [];
  for (const skill of skills) {
    const skillChars = formatSkillForLLM(skill).length;
    if (totalChars + skillChars > budget) break;
    included.push(skill);
    totalChars += skillChars;
  }
  return { included, excluded: skills.length - included.length };
}
```

### Cache Management

All skill caches can be cleared via `clearSkillCaches` (lt):

```javascript
// Location: chunks.146.mjs:2320-2321
function lt() {
  Aj.cache?.clear?.();   // All commands cache
  Nc.cache?.clear?.();   // LLM-invocable cache
  hD1.cache?.clear?.();  // User skills cache
  $F1();                 // Plugin commands cache
  xo2();                 // Plugin skills cache
  NH1();                 // Additional caches
}
```

**When to clear:**
- After installing/uninstalling plugins
- After modifying skill files
- After changing settings

---

## Key Design Decisions

### 1. Parallel Loading

**Decision:** Use `Promise.all` for loading from multiple sources.

**Rationale:**
- Faster startup time
- Sources are independent
- Error in one source doesn't block others

### 2. Inode Deduplication

**Decision:** Deduplicate skills by filesystem inode.

**Rationale:**
- Same file may appear via symlinks
- Prevents duplicate skills in the list
- First occurrence wins (priority order preserved)

### 3. Memoization

**Decision:** Memoize all loading and filtering functions.

**Rationale:**
- Skills don't change frequently during session
- Multiple callers get same results
- Explicit cache clearing when needed

### 4. Unified Model

**Decision:** Merge skills and slash commands (v2.1.3).

**Rationale:**
- Simpler mental model for users
- Skills can be invoked directly (`/skill-name`)
- Consistent behavior across invocation methods

---

## Related Modules

- [loading.md](./loading.md) - Skill loading pipeline details
- [execution.md](./execution.md) - Skill execution flow
- [09_slash_command/parsing.md](../09_slash_command/parsing.md) - Command parsing
- [25_plugin/skill_integration.md](../25_plugin/skill_integration.md) - Plugin skills
