# Built-In Skills Reference (Claude Code 2.1.76)

## Overview

This document catalogs all built-in skills registered via `registerAllBundledSkills` (DRq). In v2.1.76, three new entries have been added: the `/claude-api` built-in skill, and `/simplify` and `/batch` bundled commands.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Skill System section)

Key functions in this document:
- `registerAllBundledSkills` (DRq) - Master registration function - chunks.184.mjs:710-724
- `registerPromptSkill` (rw) - Skill registration utility - chunks.165.mjs:2546-2587
- `getBundledSkills` (iPq) - Get bundled skill array - chunks.165.mjs:2589
- `registerClaudeApiSkill` (PMz) - Active claude-api skill - chunks.184.mjs:674
- `registerSimplifySkill` (eyq) - Active simplify command - chunks.181.mjs:1379
- `registerBatchSkill` (YLq) - Active batch command - chunks.181.mjs:1526
- `registerLoopSkill` (gJz) - Active loop command - chunks.181.mjs:1640
- `registerUpdateConfigSkill` (uyq) - Active update-config command - chunks.184.mjs
- `registerStuckSkill` (dyq) - Active stuck command - chunks.181.mjs

---

## Registration Chain

```javascript
// ============================================
// registerAllBundledSkills - Master registration function
// Location: chunks.184.mjs:710-724
// ============================================

// ORIGINAL (for source lookup):
function DRq() {
    uyq(), Fyq(), Qyq(), dyq(), nyq(), oyq(), syq(), eyq(), YLq(), _Lq();
    {
        let {
            registerLoopSkill: A
        } = ($Lq(), k4(OLq));
        A()
    } {
        let {
            registerClaudeApiSkill: A
        } = (MRq(), k4(JRq));
        A()
    }
    if (kN6()) byq()
}

// READABLE (for understanding):
function registerAllBundledSkills() {
    registerUpdateConfigSkill();       // uyq - ACTIVE (NEW v2.1.76)
    registerBuiltinKeybindingsSkill(); // Fyq - ACTIVE
    registerBuiltinDebugSkill();       // Qyq - ACTIVE
    registerStuckSkill();              // dyq - ACTIVE (NEW v2.1.76)
    registerReviewCommands();          // nyq - ACTIVE
    registerPrCommentsCommand();       // oyq - ACTIVE
    registerSecurityReviewCommand();   // syq - ACTIVE
    registerSimplifySkill();           // eyq - ACTIVE (NEW v2.1.76)
    registerBatchSkill();              // YLq - ACTIVE (NEW v2.1.76)
    registerMcpToolPrompts();          // _Lq - stub

    // Lazy-loaded skills via module extraction
    { registerLoopSkill(); }           // gJz - ACTIVE (NEW v2.1.71)
    { registerClaudeApiSkill(); }      // PMz - ACTIVE (NEW v2.1.76)

    if (isChromeExtensionAvailable()) {
        registerChromeSkill();         // byq - ACTIVE (conditional)
    }
}

// Mapping: DRq→registerAllBundledSkills, uyq→registerUpdateConfigSkill,
// Fyq→registerBuiltinKeybindingsSkill, Qyq→registerBuiltinDebugSkill,
// dyq→registerStuckSkill, nyq→registerReviewCommands, oyq→registerPrCommentsCommand,
// syq→registerSecurityReviewCommand, eyq→registerSimplifySkill, YLq→registerBatchSkill,
// _Lq→registerMcpToolPrompts, gJz→registerLoopSkill, PMz→registerClaudeApiSkill,
// kN6→isChromeExtensionAvailable, byq→registerChromeSkill
```

---

## Implementation Status (v2.1.76)

| Skill | Function | Status | Notes |
|-------|----------|--------|-------|
| `update-config` | `uyq` | ACTIVE (NEW v2.1.76) | Configure settings.json |
| `keybindings-help` | `Fyq` | ACTIVE | Help with keybinding configuration |
| `debug` | `Qyq` | ACTIVE | Debug information and diagnostics |
| `stuck` | `dyq` | ACTIVE (NEW v2.1.76) | Diagnose frozen sessions |
| `review` | `nyq` | ACTIVE | Code review with multiple agents |
| `pr-comments` | `oyq` | ACTIVE | PR comment resolution |
| `security-review` | `syq` | ACTIVE | Security audit workflow |
| `simplify` | `eyq` | ACTIVE (NEW v2.1.76) | Code cleanup and optimization |
| `batch` | `YLq` | ACTIVE (NEW v2.1.76) | Parallel worktree operations |
| `mcp-tool-prompts` | `_Lq` | Stub | MCP tool prompt templates |
| `loop` | `gJz` | ACTIVE (NEW v2.1.71) | Recurring prompt scheduling |
| `claude-api` | `PMz` | ACTIVE (NEW v2.1.76) | Claude API usage assistance |
| `claude-in-chrome` | `byq` | ACTIVE (conditional) | Chrome extension integration |

---

## Active Skill Details

### update-config (uyq) - NEW in v2.1.76

**Purpose:** Configure Claude Code settings via settings.json, including hooks, permissions, and environment variables.

**Key behaviors:**
- Manages settings.json, settings.local.json files
- Configures hooks for automated behaviors ("from now on when X", "each time X", "whenever X")
- Handles permissions ("allow X", "add permission", "move permission to")
- Sets environment variables
- Troubleshoots hook configuration issues

**Source Location:** chunks.181.mjs:228

```javascript
// ============================================
// registerUpdateConfigSkill - Settings configuration
// Location: chunks.181.mjs:228
// ============================================

// ORIGINAL (for source lookup):
function uyq() {
    rw({
        name: "update-config",
        description: "Use this skill to configure the Claude Code harness via settings.json. Automated behaviors ('from now on when X', 'each time X', 'whenever X') require hooks configured in settings.json - the harness executes these, not Claude...",
        whenToUse: 'When the user wants to configure Claude Code settings...',
        allowedTools: ["Read", "Write", "Bash", "Glob"],
        userInvocable: !0,
        async getPromptForCommand(A) {
            return [{ type: "text", text: zJz }]  // UPDATE_CONFIG_PROMPT
        }
    })
}

// Mapping: uyq→registerUpdateConfigSkill, rw→registerPromptSkill, zJz→UPDATE_CONFIG_PROMPT
```

**Note:** For simple settings like theme/model changes, use the Config tool directly. This skill is for complex configuration scenarios.

### keybindings-help (Fyq)

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

### stuck (dyq) - NEW in v2.1.76

**Purpose:** Diagnose and recover from frozen or stuck sessions.

**Key behaviors:**
- Identifies common causes of session hangs
- Checks for blocking operations
- Provides recovery steps
- Analyzes background agent status
- Reviews hook timeouts

**Source Location:** chunks.181.mjs:1583

```javascript
// ============================================
// registerStuckSkill - Diagnose frozen sessions
// Location: chunks.181.mjs:1583
// ============================================

// ORIGINAL (for source lookup):
function dyq() {  // Note: different dyq than debug skill
    rw({
        name: "stuck",
        description: "Diagnose and recover from a frozen or stuck session",
        whenToUse: 'When the user reports the session is frozen, stuck, or not responding...',
        userInvocable: !0,
        async getPromptForCommand(A) {
            return [{ type: "text", text: uJz }]  // STUCK_SKILL_PROMPT
        }
    })
}

// Mapping: dyq→registerStuckSkill, rw→registerPromptSkill, uJz→STUCK_SKILL_PROMPT
```

**Common stuck causes:**
1. Background agent waiting for input
2. Hook command hanging
3. Long-running tool operation
4. Permission prompt waiting for response
5. Network timeout on remote operation

### debug (Qyq)

**Purpose:** Enable debug logging for this session and help diagnose issues.

**Key behaviors:**
- Enables debug logging dynamically
- Reads last N lines from debug log file
- Provides session-specific diagnostic information
- Shows settings file locations for user/project/local

**Source Location:** chunks.181.mjs:1090-1170

```javascript
// ============================================
// registerDebugSkill - Debug logging and diagnostics
// Location: chunks.181.mjs:1090-1170
// ============================================

// ORIGINAL (for source lookup):
function dyq() {
    rw({
        name: "debug",
        description: "Enable debug logging for this session and help diagnose issues",
        allowedTools: ["Read", "Grep", "Glob"],
        argumentHint: "[issue description]",
        disableModelInvocation: !0,
        userInvocable: !0,
        async getPromptForCommand(A) {
            // Reads debug log, shows last N lines, diagnoses issues
        }
    })
}

// READABLE (for understanding):
function registerDebugSkill() {
    registerPromptSkill({
        name: "debug",
        description: "Enable debug logging for this session and help diagnose issues",
        allowedTools: ["Read", "Grep", "Glob"],
        argumentHint: "[issue description]",
        disableModelInvocation: true,  // Only user can invoke
        userInvocable: true,
        async getPromptForCommand(issueDescription) {
            // 1. Check if debug logging was enabled
            // 2. Read last N lines from debug log
            // 3. Format with session context and settings paths
            return [{ type: "text", text: debugPrompt }];
        }
    });
}

// Mapping: dyq→registerDebugSkill, rw→registerPromptSkill
```

### claude-api (PMz) - NEW in v2.1.76

**Purpose:** Assists users with Claude API usage, including making API calls, understanding response formats, and working with the SDK.

**Key behaviors:**
- Detects project language (Python, TypeScript, Go, Java, Ruby, C#, PHP, curl)
- Loads language-specific documentation
- Explains API endpoint usage patterns
- Helps construct API requests
- Interprets API responses and errors
- Provides code examples for common patterns
- Supports Agent SDK for Python and TypeScript

**Trigger conditions:**
- Code imports `anthropic`, `@anthropic-ai/sdk`, or `claude_agent_sdk`
- User asks about Claude API, Anthropic SDKs, or Agent SDK

**Do NOT trigger when:**
- Code imports `openai` or other AI SDKs
- General programming questions
- ML/data-science tasks

**Source Location:** chunks.184.mjs:674-688

```javascript
// ============================================
// registerClaudeApiSkill - Claude API assistance
// Location: chunks.184.mjs:674-688
// ============================================

// ORIGINAL (for source lookup):
function PMz() {
    rw({
        name: "claude-api",
        description: "Build apps with the Claude API or Anthropic SDK.\nTRIGGER when: code imports `anthropic`/`@anthropic-ai/sdk`/`claude_agent_sdk`, or user asks to use Claude API, Anthropic SDKs, or Agent SDK.\nDO NOT TRIGGER when: code imports `openai`/other AI SDK, general programming, or ML/data-science tasks.",
        allowedTools: ["Read", "Grep", "Glob", "WebFetch"],
        userInvocable: !0,
        async getPromptForCommand(A) {
            let q = await MMz();  // Detect language
            return [{
                type: "text",
                text: XMz(q, A)     // Format prompt with docs
            }]
        }
    })
}

// READABLE (for understanding):
function registerClaudeApiSkill() {
    registerPromptSkill({
        name: "claude-api",
        description: "Build apps with the Claude API or Anthropic SDK...",
        allowedTools: ["Read", "Grep", "Glob", "WebFetch"],
        userInvocable: true,
        async getPromptForCommand(userArgs) {
            // 1. Detect project language from file extensions
            let detectedLanguage = await detectProjectLanguage();

            // 2. Format prompt with language-specific docs
            return [{
                type: "text",
                text: formatClaudeApiPrompt(detectedLanguage, userArgs)
            }];
        }
    });
}

// Mapping: PMz→registerClaudeApiSkill, rw→registerPromptSkill,
// MMz→detectProjectLanguage, XMz→formatClaudeApiPrompt
```

**Language Detection Logic:**
The skill detects project language by checking file extensions and config files:
- Python: `.py`, `requirements.txt`, `pyproject.toml`, `setup.py`, `Pipfile`
- TypeScript: `.ts`, `.tsx`, `tsconfig.json`, `package.json`
- Go: `.go`, `go.mod`
- Java: `.java`, `pom.xml`, `build.gradle`
- Ruby: `.rb`, `Gemfile`
- C#: `.cs`, `.csproj`
- PHP: `.php`, `composer.json`
- curl: (no specific files)

### simplify (eyq) - NEW in v2.1.76

**Purpose:** Review changed code for reuse, quality, and efficiency, then fix any issues found.

**Algorithm - Three Parallel Review Agents:**

```
┌─────────────────────────────────────────────────────────────────┐
│                    /simplify Workflow                           │
├─────────────────────────────────────────────────────────────────┤
│  Phase 1: Identify Changes                                      │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ git diff (or git diff HEAD if staged)                       ││
│  │ If no git changes → review recently modified files          ││
│  └─────────────────────────────────────────────────────────────┘│
│                           ↓                                     │
│  Phase 2: Launch Three Review Agents (parallel, via Agent tool)│
│  ┌───────────────────┬───────────────────┬───────────────────┐ │
│  │ Agent 1: Reuse    │ Agent 2: Quality  │ Agent 3: Efficiency│ │
│  ├───────────────────┼───────────────────┼───────────────────┤ │
│  │ • Search existing │ • Redundant state │ • Unnecessary work │ │
│  │   utilities       │ • Parameter sprawl│ • Missed concurrency│ │
│  │ • Flag duplicates │ • Copy-paste code │ • Hot-path bloat   │ │
│  │ • Inline logic    │ • Leaky abs.      │ • Memory leaks     │ │
│  │   → utilities     │ • Stringly-typed  │ • Overly broad ops │ │
│  └───────────────────┴───────────────────┴───────────────────┘ │
│                           ↓                                     │
│  Phase 3: Fix Issues                                            │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Aggregate findings from all three agents                    ││
│  │ Fix each issue directly (skip false positives)              ││
│  │ Do NOT argue with findings - just skip if not worth fixing  ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

**Source Location:** chunks.181.mjs:1379-1397

```javascript
// ============================================
// registerSimplifySkill - Code review and cleanup
// Location: chunks.181.mjs:1379-1397
// ============================================

// ORIGINAL (for source lookup):
function eyq() {
    rw({
        name: "simplify",
        description: "Review changed code for reuse, quality, and efficiency, then fix any issues found.",
        userInvocable: !0,
        async getPromptForCommand(A) {
            let q = SJz;
            if (A) q += "\n\n## Additional Focus\n\n" + A;
            return [{ type: "text", text: q }]
        }
    })
}

// Mapping: eyq→registerSimplifySkill, SJz→SIMPLIFY_PROMPT
```

**Quality Review Checklist:**
1. Redundant state - cached values that could be derived
2. Parameter sprawl - adding parameters instead of generalizing
3. Copy-paste with slight variation - near-duplicates needing abstraction
4. Leaky abstractions - exposing internal details
5. Stringly-typed code - raw strings where enums exist

**Efficiency Review Checklist:**
1. Unnecessary work - redundant computations, N+1 patterns
2. Missed concurrency - sequential operations that could be parallel
3. Hot-path bloat - blocking work in startup/per-request paths
4. Recurring no-op updates - unconditional state updates in loops
5. Memory issues - unbounded data structures, listener leaks

### batch (YLq) - NEW in v2.1.76

**Purpose:** Research and plan a large-scale change, then execute it in parallel across 5–30 isolated worktree agents.

**Architecture:**

```
┌─────────────────────────────────────────────────────────────────┐
│                    /batch Workflow                              │
├─────────────────────────────────────────────────────────────────┤
│  Phase 1: Research & Plan                                       │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Analyze codebase to find all units needing change           ││
│  │ Create decomposition plan with independent units            ││
│  │ Write plan to file for review                               ││
│  └─────────────────────────────────────────────────────────────┘│
│                           ↓                                     │
│  Phase 2: Execute in Parallel                                   │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ For each unit (5-30 units):                                 ││
│  │   1. Create isolated git worktree                           ││
│  │   2. Spawn background agent with unit-specific instructions ││
│  │   3. Agent: implement → test → simplify → commit → PR      ││
│  │                                                              ││
│  │ All agents run in parallel (background mode)                ││
│  └─────────────────────────────────────────────────────────────┘│
│                           ↓                                     │
│  Phase 3: Track Progress                                        │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Monitor background-agent completion notifications           ││
│  │ Parse `PR: <url>` from each agent result                    ││
│  │ Render progress table with status and PR links              ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

**Key properties:**
- `disableModelInvocation: true` - only user can invoke
- Requires git repository (uses worktrees)
- Each agent runs in isolated context
- Agents create PRs independently

**Source Location:** chunks.181.mjs:1526-1550

```javascript
// ============================================
// registerBatchSkill - Parallel worktree operations
// Location: chunks.181.mjs:1526-1550
// ============================================

// ORIGINAL (for source lookup):
function YLq() {
    rw({
        name: "batch",
        description: "Research and plan a large-scale change, then execute it in parallel across 5–30 isolated worktree agents that each open a PR.",
        whenToUse: "Use when the user wants to make a sweeping, mechanical change across many files...",
        argumentHint: "<instruction>",
        userInvocable: !0,
        disableModelInvocation: !0,
        async getPromptForCommand(A) {
            let q = A.trim();
            if (!q) return [{ type: "text", text: xJz }];  // usage help
            if (!await IH()) return [{ type: "text", text: bJz }];  // not git repo
            return [{ type: "text", text: IJz(q) }]  // formatted prompt
        }
    })
}

// Mapping: YLq→registerBatchSkill, IH→isGitRepository,
// xJz→BATCH_USAGE_HELP, bJz→NOT_GIT_REPO_ERROR, IJz→formatBatchPrompt
```

### loop (gJz) - NEW in v2.1.71

**Purpose:** Schedule recurring prompts or slash commands to run at specified intervals.

**Interval Parsing:**
- Format: `[interval] <prompt>`
- Intervals: `Ns` (seconds), `Nm` (minutes), `Nh` (hours), `Nd` (days)
- Default: 10 minutes if interval not specified
- Minimum granularity: 1 minute

**Integration with Cron Tools:**
The loop skill uses the `CronCreate` tool to schedule tasks:
1. Parse interval from input
2. Convert to cron expression
3. Create cron job with `recurring: true`
4. Jobs auto-expire after 3 days

**Source Location:** chunks.181.mjs:1640-1660

```javascript
// ============================================
// registerLoopSkill - Recurring prompt scheduling
// Location: chunks.181.mjs:1640-1660
// ============================================

// ORIGINAL (for source lookup):
function gJz() {
    rw({
        name: "loop",
        description: "Run a prompt or slash command on a recurring interval (e.g. /loop 5m /foo, defaults to 10m)",
        whenToUse: 'When the user wants to set up a recurring task, poll for status...',
        argumentHint: "[interval] <prompt>",
        userInvocable: !0,
        isEnabled: kR,  // !process.env.CLAUDE_CODE_DISABLE_CRON
        async getPromptForCommand(A) {
            let q = A.trim();
            if (!q) return [{ type: "text", text: mJz }];  // usage help
            return [{ type: "text", text: BJz(q) }]  // format with prompt
        }
    })
}

// Mapping: gJz→registerLoopSkill, kR→isCronEnabled,
// mJz→LOOP_USAGE_HELP, BJz→formatLoopPrompt
```

**Related:** See [36_loop_cron/](../36_loop_cron/) for complete cron system documentation.

### claude-in-chrome (byq) - Conditional

**Purpose:** Integration with the Claude in Chrome extension for browser automation.

**Activation condition:** Only registered when `isChromeExtensionAvailable()` returns true.

---

## Stub Skills

These skills have prompt text defined but registration is a no-op:

### update-config (uyq) - Stub

Prompt text exists at `zJz` (chunks.181.mjs:228) with settings.json schema reference, but registration function is a stub that returns immediately.

### verify (Qyq) - Stub

System prompt fully specified (244 lines) at `kJz` (chunks.181.mjs:837) but registration function is a no-op. See [verifier_skills.md](./verifier_skills.md) for complete architecture documentation.

### mcp-tool-prompts (_Lq) - Stub

Placeholder for MCP tool prompt templates.

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
