# Built-In Skills Reference (Claude Code 2.1.76)

## Overview

This document catalogs all built-in skills registered via `registerAllBuiltinSkills` (xjq). In v2.1.76, three new entries have been added: the `/claude-api` built-in skill, and `/simplify` and `/batch` bundled commands.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Skill System section)

Key functions in this document:
- `registerAllBuiltinSkills` (xjq) - Master registration function - chunks.177.mjs:2441-2443
- `builtinSkillsLazyInit` (bjq) - Lazy initializer for all skill modules - chunks.177.mjs:2445-2456
- `registerPromptSkill` (Sj) - Skill registration utility - chunks.166.mjs:1795-1820
- `getBundledSkills` (nHq) - Get bundled skill array - chunks.166.mjs:1822-1824
- `registerKeybindingsSkill` (fjq) - Active keybindings-help - chunks.177.mjs
- `registerDebugSkill` (kjq) - Active debug skill - chunks.177.mjs
- `registerChromeSkill` (jjq) - Active chrome skill (conditional) - chunks.177.mjs
- `registerClaudeApiSkill` (Ajq) - NEW in v2.1.76 - Active claude-api skill - chunks.177.mjs
- `registerSimplifySkill` (Gjq) - NEW in v2.1.76 - Active simplify command - chunks.177.mjs
- `registerBatchSkill` (Fjq) - NEW in v2.1.76 - Active batch command - chunks.177.mjs

---

## Registration Chain

```javascript
// ============================================
// registerAllBuiltinSkills - Master registration function
// Location: chunks.177.mjs:2441-2443
// ============================================

// ORIGINAL (for source lookup):
function xjq() {
    if (Xjq(), Pjq(), fjq(), Njq(), vjq(), kjq(), Cjq(), hjq(), Ajq(), Gjq(), Fjq(), cZ1()) jjq()
}

// READABLE (for understanding):
function registerAllBuiltinSkills() {
    registerRememberSkill();       // Xjq - stub
    registerSettingsHelpSkill();   // Pjq - stub
    registerKeybindingsSkill();    // fjq - ACTIVE
    registerVerifySkill();         // Njq - stub
    registerInitVerifiersSkill();  // vjq - stub
    registerDebugSkill();          // kjq - ACTIVE
    registerBenchmarkSkill();      // Cjq - stub
    registerSkillifySkill();       // hjq - stub
    registerClaudeApiSkill();      // Ajq - ACTIVE (NEW in v2.1.76)
    registerSimplifySkill();       // Gjq - ACTIVE (NEW in v2.1.76)
    registerBatchSkill();          // Fjq - ACTIVE (NEW in v2.1.76)
    if (isChromeExtensionAvailable()) {
        registerChromeSkill();     // jjq - ACTIVE (conditional)
    }
}

// Mapping: xjq→registerAllBuiltinSkills, Xjq→registerRememberSkill, Pjq→registerSettingsHelpSkill,
// fjq→registerKeybindingsSkill, Njq→registerVerifySkill, vjq→registerInitVerifiersSkill,
// kjq→registerDebugSkill, Cjq→registerBenchmarkSkill, hjq→registerSkillifySkill,
// Ajq→registerClaudeApiSkill, Gjq→registerSimplifySkill, Fjq→registerBatchSkill,
// cZ1→isChromeExtensionAvailable, jjq→registerChromeSkill
```

---

## Implementation Status (v2.1.76)

| Skill | Function | Status | Notes |
|-------|----------|--------|-------|
| `keybindings-help` | `fjq` | ACTIVE | Help with keybinding configuration |
| `debug` | `kjq` | ACTIVE | Debug information and diagnostics |
| `claude-in-chrome` | `jjq` | ACTIVE (conditional) | Chrome extension integration |
| `claude-api` | `PMz` | ACTIVE (NEW v2.1.76) | Claude API usage assistance |
| `simplify` | `eyq` | ACTIVE (NEW v2.1.76) | Simplify code or text |
| `batch` | `YLq` | ACTIVE (NEW v2.1.76) | Batch operations on multiple items |
| `loop` | `gJz` | ACTIVE (NEW v2.1.71) | Recurring prompt scheduling |
| `verify` | `Njq` | Stub | Verifier orchestrator (not yet active) |
| `init-verifiers` | `vjq` | Stub | Verifier initialization (not yet active) |
| `remember` | `Xjq` | Stub | Memory capture (not yet active) |
| `settings-help` | `Pjq` | Stub | Settings help (not yet active) |
| `benchmark` | `Cjq` | Stub | Benchmarking (not yet active) |
| `skillify` | `hjq` | Stub | Skill creation wizard (not yet active) |

---

## Active Skill Details

### keybindings-help (fjq)

**Purpose:** Interactive help for configuring keybindings in Claude Code.

**Registration:**
```javascript
registerPromptSkill({
    name: "keybindings-help",
    description: "Get help with keybinding configuration",
    userInvocable: true,
    allowedTools: ["Read", "Write"],
    getPromptForCommand: async (args) => [{ type: "text", text: KEYBINDINGS_HELP_PROMPT + args }]
});
```

### debug (kjq)

**Purpose:** Show debug information, diagnostic output, and system state.

**Registration:**
```javascript
registerPromptSkill({
    name: "debug",
    description: "Show debug information and run diagnostics",
    userInvocable: true,
    allowedTools: ["Bash", "Read"],
    getPromptForCommand: async (args) => [{ type: "text", text: DEBUG_PROMPT + args }]
});
```

### claude-api (PMz) - NEW in v2.1.76

**Purpose:** Assists users with Claude API usage, including making API calls, understanding response formats, and working with the SDK.

**Key behaviors:**
- Explains API endpoint usage
- Helps construct API requests
- Interprets API responses and errors
- Provides code examples for common patterns
- Supports multiple languages: Python, TypeScript, Go, Java, Ruby, C#, PHP, curl

**Registration:**
```javascript
registerPromptSkill({
    name: "claude-api",
    description: "Build apps with the Claude API or Anthropic SDK...",
    userInvocable: true,
    allowedTools: ["Read", "Grep", "Glob", "WebFetch"],
    getPromptForCommand: async (args) => [{ type: "text", text: CLAUDE_API_PROMPT + args }]
});
```

**Source Location:** chunks.184.mjs:674-688

### simplify (eyq) - NEW in v2.1.76

**Purpose:** Simplifies code by reviewing for reuse, quality, and efficiency, then fixing issues found.

**Key behaviors:**
- Launches three parallel review agents (Code Reuse, Code Quality, Efficiency)
- Searches for existing utilities that could replace newly written code
- Identifies redundant state, parameter sprawl, copy-paste patterns
- Fixes issues directly after review

**Registration:**
```javascript
registerPromptSkill({
    name: "simplify",
    description: "Review changed code for reuse, quality, and efficiency...",
    userInvocable: true,
    getPromptForCommand: async (args) => [{ type: "text", text: SIMPLIFY_PROMPT + args }]
});
```

**Source Location:** chunks.181.mjs:1379-1397

### batch (YLq) - NEW in v2.1.76

**Purpose:** Research and plan a large-scale change, then execute it in parallel across 5–30 isolated worktree agents.

**Key behaviors:**
- Decomposes work into independent units
- Spawns agents in isolated git worktrees
- Each agent opens a PR
- disableModelInvocation: true (user-initiated only)

**Registration:**
```javascript
registerPromptSkill({
    name: "batch",
    description: "Research and plan a large-scale change...",
    whenToUse: "Use when the user wants to make a sweeping change...",
    argumentHint: "<instruction>",
    userInvocable: true,
    disableModelInvocation: true,
    getPromptForCommand: async (args) => [{ type: "text", text: BATCH_PROMPT + args }]
});
```

**Source Location:** chunks.181.mjs:1526-1550
```

### loop (gJz) - NEW in v2.1.71

**Purpose:** Schedule recurring prompts or slash commands to run at specified intervals.

**Key behaviors:**
- Parses interval from input (e.g., `5m`, `2h`, `1d`)
- Default interval is 10 minutes if not specified
- Uses CronCreate tool for scheduling
- Supports trailing "every" clause parsing

**Registration:**
```javascript
registerPromptSkill({
    name: "loop",
    description: "Run a prompt or slash command on a recurring interval",
    whenToUse: 'When the user wants to set up a recurring task, poll for status...',
    argumentHint: "[interval] <prompt>",
    userInvocable: true,
    isEnabled: !process.env.CLAUDE_CODE_DISABLE_CRON,
    getPromptForCommand: async (args) => [{ type: "text", text: LOOP_PROMPT + args }]
});
```

**Related:** See [36_loop_cron/](../36_loop_cron/) for complete cron system documentation.

### claude-in-chrome (jjq) - Conditional

**Purpose:** Integration with the Claude in Chrome extension for browser automation.

**Activation condition:** Only registered when `isChromeExtensionAvailable()` returns true.

---

## Stub Skills (Unchanged from v2.1.38)

These skills remain as stubs in v2.1.76:

### verify (Njq) - Stub

System prompt fully specified (244 lines) but registration function is a no-op. See [verifier_skills.md](./verifier_skills.md) for complete architecture documentation.

### init-verifiers (vjq) - Stub

Companion to verify. Initializes verifier skills in a project.

### remember (Xjq) - Stub

Planned memory capture skill.

### settings-help (Pjq) - Stub

Planned settings configuration helper.

### benchmark (Cjq) - Stub

Planned benchmarking workflow.

### skillify (hjq) - Stub

Planned skill creation wizard.

---

## builtinSkillsLazyInit (bjq)

```javascript
// ============================================
// builtinSkillsLazyInit - Lazy module initialization
// Location: chunks.177.mjs:2445-2456
// ============================================

// ORIGINAL (for source lookup):
bjq = v(() => {
    Tjq(), Ejq(), fjq_init(), kjq_init(), jjq_init(), Ajq_init(), Gjq_init(), Fjq_init()
})

// READABLE (for understanding):
const builtinSkillsLazyInit = lazyInit(() => {
    verifySkillModuleInit();       // Tjq - loads verify system prompt
    initVerifiersModuleInit();     // Ejq - loads init-verifiers system prompt
    keybindingsSkillInit();        // fjq init
    debugSkillInit();              // kjq init
    chromeSkillInit();             // jjq init
    claudeApiSkillInit();          // Ajq init (NEW in v2.1.76)
    simplifySkillInit();           // Gjq init (NEW in v2.1.76)
    batchSkillInit();              // Fjq init (NEW in v2.1.76)
});
```

The lazy initializer ensures skill modules are only loaded when the skill system is first needed, not at application startup.

---

## Design Rationale

### Why Lazy Initialization?

Skill modules contain large system prompts (the verify skill's is 244 lines). Loading all of them at startup would increase startup time. The `lazyInit` pattern defers loading until the skill system is actually needed.

### Why Stub Registration for Future Skills?

The stub pattern (registration function exists but is a no-op) provides:
1. **Placeholder** - The skill name is reserved; future activation won't conflict
2. **Infrastructure** - The lazy initializer already loads the module; activation just needs `registerPromptSkill()` to be called
3. **Testing** - Stubs can be activated in test environments for preview

### Why Separate Active/Stub Status?

The `/claude-api`, `/simplify`, and `/batch` skills were added as active in v2.1.76 because they represent stable, user-facing functionality. Future experimental skills are added as stubs first and activated after stabilization.
