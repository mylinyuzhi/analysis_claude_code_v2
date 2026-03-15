# Built-in Skills Reference (Claude Code 2.1.38)

## Overview

Claude Code v2.1.38 includes 9 built-in prompt skills registered via `registerAllBuiltinSkills` (xjq). Of these, only 3 are fully active with actual `Sj()` registration calls, while 6 are stub implementations that return immediately without registering. This document provides a comprehensive reference for all built-in skills, their registration status, and activation requirements.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Built-in Prompt Skills section)

Key functions in this document:
- `registerAllBuiltinSkills` (xjq) - Master registration function - chunks.177.mjs:2441-2443
- `registerPromptSkill` (Sj) - Skill registration function - chunks.166.mjs:1795-1820
- `builtinSkillsLazyInit` (bjq) - Lazy initializer - chunks.177.mjs:2445-2456

---

## Registration Architecture

### Master Registration Function (xjq)

```javascript
// ============================================
// registerAllBuiltinSkills - Master registration function
// Location: chunks.177.mjs:2441-2443
// ============================================

// ORIGINAL (for source lookup):
function xjq() {
    if (Xjq(), Pjq(), fjq(), Njq(), vjq(), kjq(), Cjq(), hjq(), cZ1()) jjq()
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
    if (isChromeExtensionAvailable()) {
        registerChromeSkill();     // jjq - ACTIVE (conditional)
    }
}

// Mapping: xjq→registerAllBuiltinSkills, Xjq→registerRememberSkill,
// Pjq→registerSettingsHelpSkill, fjq→registerKeybindingsSkill,
// Njq→registerVerifySkill, vjq→registerInitVerifiersSkill,
// kjq→registerDebugSkill, Cjq→registerBenchmarkSkill,
// hjq→registerSkillifySkill, cZ1→isChromeExtensionAvailable, jjq→registerChromeSkill
```

### Registration Status Summary

| Skill | Registration Function | Has `Sj()` Call | Status |
|-------|-----------------------|-----------------|--------|
| keybindings-help | fjq | ✅ Yes | **Active** |
| debug | kjq | ✅ Yes | **Active** |
| claude-in-chrome | jjq | ✅ Yes (conditional) | **Active** |
| remember | Xjq | ❌ No (stub) | Inactive |
| settings-help | Pjq | ❌ No (stub) | Inactive |
| verify | Njq | ❌ No (stub) | Inactive |
| init-verifiers | vjq | ❌ No (stub) | Inactive |
| benchmark | Cjq | ❌ No (stub) | Inactive |
| skillify | hjq | ❌ No (stub) | Inactive |

---

## Active Skills

### 1. keybindings-help (fjq)

**Purpose:** Customize keyboard shortcuts and manage `~/.claude/keybindings.json`.

**Registration:**
```javascript
// ============================================
// registerKeybindingsSkill - Register keybindings skill
// Location: chunks.177.mjs:1809-1838
// ============================================

// ORIGINAL (for source lookup):
function fjq() {
    Sj({
        name: "keybindings-help",
        description: "Use when the user wants to customize keyboard shortcuts, rebind keys, add chord bindings, or modify ~/.claude/keybindings.json. Examples: \"rebind ctrl+s\", \"add a chord shortcut\", \"change the submit key\", \"customize keybindings\".",
        userInvocable: !0,
        async getPromptForCommand(A) {
            let q = `${q_z}\n${K_z}\n${Y_z}\n${z_z}\n${w_z}\n${H_z}\n${$_z}\n${O_z}\n${$_z}`;
            if (A) q += `\n\n## Task\n\n${A}`;
            return [{ type: "text", text: q }]
        }
    })
}

// READABLE (for understanding):
function registerKeybindingsSkill() {
    registerPromptSkill({
        name: "keybindings-help",
        description: "Use when the user wants to customize keyboard shortcuts...",
        userInvocable: true,
        async getPromptForCommand(args) {
            let prompt = [
                KEYBINDINGS_INTRO,
                FILE_FORMAT_SECTION,
                KEYSTROKE_SYNTAX_SECTION,
                UNBINDING_SECTION,
                INTERACTION_SECTION,
                COMMON_PATTERNS_SECTION,
                BEHAVIORAL_RULES_SECTION,
                DOCTOR_VALIDATION_SECTION
            ].join('\n');

            if (args) {
                prompt += `\n\n## Task\n\n${args}`;
            }

            return [{ type: "text", text: prompt }];
        }
    });
}
```

**Prompt Sections:**
- `q_z` - Introduction and "Read Before Write" guidance
- `K_z` - File format with JSON schema
- `Y_z` - Keystroke syntax (modifiers, special keys, chords)
- `z_z` - Unbinding default shortcuts
- `w_z` - How user bindings interact with defaults
- `H_z` - Common patterns (rebind, add chord)
- `$_z` - Behavioral rules
- `O_z` - Validation with `/doctor`

**Key Properties:**
- `userInvocable: true` - Can be called via `/keybindings-help`
- No `allowedTools` restriction - Uses all available tools
- No `disableModelInvocation` - Can be invoked by LLM

**Usage Example:**
```
/keybindings-help rebind ctrl+s to submit
```

---

### 2. debug (kjq)

**Purpose:** Debug the current Claude Code session by reading debug logs.

**Registration:**
```javascript
// ============================================
// registerDebugSkill - Register debug skill
// Location: chunks.177.mjs:2188-2249
// ============================================

// ORIGINAL (for source lookup):
function kjq() {
    Sj({
        name: "debug",
        description: "Debug your current Claude Code session by reading the session debug log.",
        allowedTools: ["Read", "Grep", "Glob"],
        argumentHint: "[issue description]",
        disableModelInvocation: !0,
        userInvocable: !0,
        async getPromptForCommand(A) {
            let q = M61(), K;
            try { K = await b1().readFile(q, "utf-8") } catch { K = "Could not read debug log" }
            return [{
                type: "text",
                text: `# Debug Skill\n\nRead the debug log at: ${q}\n\n## Debug Log Content\n\n\`\`\`\n${X_z(K, 500)}\n\`\`\`\n\n${A ? `## Issue to Debug\n\n${A}` : ""}`
            }]
        }
    })
}

// READABLE (for understanding):
function registerDebugSkill() {
    registerPromptSkill({
        name: "debug",
        description: "Debug your current Claude Code session by reading the session debug log.",
        allowedTools: ["Read", "Grep", "Glob"],  // Limited tool set
        argumentHint: "[issue description]",
        disableModelInvocation: true,  // Cannot be invoked by LLM
        userInvocable: true,
        async getPromptForCommand(args) {
            let logPath = getDebugLogPath();
            let logContent;

            try {
                logContent = await fs.readFile(logPath, "utf-8");
            } catch {
                logContent = "Could not read debug log";
            }

            // Only show last 500 lines
            let recentLog = takeLastNLines(logContent, 500);

            return [{
                type: "text",
                text: `# Debug Skill

Read the debug log at: ${logPath}

## Debug Log Content

\`\`\`
${recentLog}
\`\`\`

${args ? `## Issue to Debug\n\n${args}` : ""}`
            }];
        }
    });
}
```

**Key Properties:**
- `allowedTools: ["Read", "Grep", "Glob"]` - Restricted tool set for safety
- `disableModelInvocation: true` - **Cannot** be invoked by LLM, only user
- `userInvocable: true` - Can be called via `/debug`
- Shows last 500 lines of debug log

**Usage Example:**
```
/debug tool execution failing
```

---

### 3. claude-in-chrome (jjq)

**Purpose:** Browser automation via Chrome extension integration.

**Registration:**
```javascript
// ============================================
// registerChromeSkill - Register Chrome integration skill
// Location: chunks.177.mjs:1269-1290
// ============================================

// ORIGINAL (for source lookup):
function jjq() {
    Sj({
        name: "claude-in-chrome",
        description: "Automates your Chrome browser to interact with web pages - clicking elements, filling forms, capturing screenshots, reading console logs, and navigating sites. Opens pages in new tabs within your existing Chrome session. Requires site-level permissions before executing (configured in the extension).",
        whenToUse: "When the user wants to interact with web pages, automate browser tasks, capture screenshots, read console logs, or perform any browser-based actions. Always invoke BEFORE attempting to use any mcp__claude-in-chrome__* tools.",
        allowedTools: gOz,  // List of mcp__claude-in-chrome__* tools
        userInvocable: !0,
        isEnabled: () => cZ1(),  // Conditional on extension availability
        async getPromptForCommand(A) {
            let q = `${RHq}\n${UOz}`;
            if (A) q += `\n\n## Task\n\n${A}`;
            return [{ type: "text", text: q }]
        }
    })
}

// READABLE (for understanding):
function registerChromeSkill() {
    registerPromptSkill({
        name: "claude-in-chrome",
        description: "Automates your Chrome browser to interact with web pages...",
        whenToUse: "When the user wants to interact with web pages...",
        allowedTools: CHROME_MCP_TOOLS,  // All mcp__claude-in-chrome__* tools
        userInvocable: true,
        isEnabled: () => isChromeExtensionAvailable(),  // Conditional
        async getPromptForCommand(args) {
            let prompt = `${CHROME_SYSTEM_PROMPT}\n${CHROME_NOW_AVAILABLE}`;
            if (args) {
                prompt += `\n\n## Task\n\n${args}`;
            }
            return [{ type: "text", text: prompt }];
        }
    });
}
```

**Key Properties:**
- `isEnabled: () => cZ1()` - Only registered if Chrome extension is available
- `allowedTools: gOz` - All MCP Chrome tools (e.g., `mcp__claude-in-chrome__tabs_context_mcp`)
- `userInvocable: true` - Can be called via `/claude-in-chrome`
- Has `whenToUse` for automatic invocation hints

**Prompt Content:**
- `RHq` - System prompt for Chrome automation
- `UOz` - "Now that this skill is invoked, you have access to Chrome browser automation tools..."

**Usage Example:**
```
/claude-in-chrome take a screenshot of the current page
```

---

## Stub Skills (Inactive)

### 4. remember (Xjq)

**Purpose:** Review session memories and update project memory file (CLAUDE.local.md).

**Status:** Stub - returns without registering.

```javascript
// ============================================
// registerRememberSkill - Stub registration
// Location: chunks.177.mjs:1142-1144
// ============================================

// ORIGINAL (for source lookup):
function Xjq() {
    return
}

// READABLE (for understanding):
function registerRememberSkill() {
    return;  // No-op in v2.1.38
}
```

**System Prompt Available:** `QOz` (REMEMBER_SKILL_PROMPT) - chunks.177.mjs:1146-1259

**Expected Behavior (when activated):**
1. Read session memory files from `~/.claude/projects/{project}/{session}/session-memory/summary.md`
2. Analyze for patterns appearing in 2+ sessions
3. Propose updates to CLAUDE.local.md
4. Use AskUserQuestion for confirmation

**Activation Requirements:**
```javascript
// What the registration would look like when active:
function registerRememberSkill() {
    registerPromptSkill({
        name: "remember",
        description: "Review session memories and update CLAUDE.local.md with learnings.",
        allowedTools: ["Read", "Write", "Edit", "AskUserQuestion"],
        userInvocable: true,
        async getPromptForCommand(args) {
            return [{ type: "text", text: REMEMBER_SKILL_PROMPT }];
        }
    });
}
```

---

### 5. settings-help (Pjq)

**Purpose:** Help users configure Claude Code settings.

**Status:** Stub - returns without registering.

```javascript
// ============================================
// registerSettingsHelpSkill - Stub registration
// Location: chunks.177.mjs:1314-1316
// ============================================

// ORIGINAL (for source lookup):
function Pjq() {
    return
}
```

**System Prompt Available:** `dOz` (SETTINGS_HELP_PROMPT) - chunks.177.mjs:1318-1563

**Prompt Content:**
- Settings file locations table
- Permissions configuration syntax
- Environment variables
- Model & Agent settings
- Attribution settings
- MCP server management
- Plugin configuration

---

### 6. verify (Njq)

**Purpose:** Orchestrate code verification using verifier skills.

**Status:** Stub - returns without registering.

```javascript
// ============================================
// registerVerifySkill - Stub registration
// Location: chunks.177.mjs:1921-1923
// ============================================

// ORIGINAL (for source lookup):
function Njq() {
    return
}
```

**System Prompt Available:** `__z` (VERIFIER_SYSTEM_PROMPT) - chunks.177.mjs:1933-2176

**Detailed Analysis:** See [verifier_skills.md](verifier_skills.md)

---

### 7. init-verifiers (vjq)

**Purpose:** Initialize verifier skills for a project.

**Status:** Stub - returns without registering.

```javascript
// ============================================
// registerInitVerifiersSkill - Stub registration
// Location: chunks.177.mjs:1929-1931
// ============================================

// ORIGINAL (for source lookup):
function vjq() {
    return
}
```

**Lazy Initializer:** `Ejq` - chunks.177.mjs:2178-2180

---

### 8. benchmark (Cjq)

**Purpose:** Performance benchmarking.

**Status:** Stub - returns without registering.

```javascript
// ============================================
// registerBenchmarkSkill - Stub registration
// Location: chunks.177.mjs:2279-2281
// ============================================

// ORIGINAL (for source lookup):
function Cjq() {
    return
}
```

**Note:** No system prompt constant found adjacent to this function, suggesting the prompt may be defined elsewhere or the feature is less complete than other stubs.

---

### 9. skillify (hjq)

**Purpose:** Create a new skill from the current session.

**Status:** Stub - returns without registering.

```javascript
// ============================================
// registerSkillifySkill - Stub registration
// Location: chunks.177.mjs:2299-2301
// ============================================

// ORIGINAL (for source lookup):
function hjq() {
    return
}
```

**System Prompt Available:** `j_z` (SKILLIFY_PROMPT) - chunks.177.mjs:2303-2434

**Expected Behavior (when activated):**
1. Analyze current session for repeatable process
2. Interview user about skill design
3. Generate SKILL.md with frontmatter
4. Write to `.claude/skills/{name}/SKILL.md`

**Interview Process (from prompt):**
- Round 1: High-level confirmation (name, description)
- Round 2: Steps, arguments, execution mode
- Round 3: Per-step details, success criteria
- Round 4: Trigger phrases, gotchas

---

## Lazy Initialization (bjq)

The `bjq` function ensures all skill module dependencies are loaded:

```javascript
// ============================================
// builtinSkillsLazyInit - Load all skill modules
// Location: chunks.177.mjs:2445-2456
// ============================================

// ORIGINAL (for source lookup):
bjq = v(() => {
    Djq();   // Remember module init
    Mjq();   // Chrome module init
    Wjq();   // (unknown)
    Vjq();   // (unknown)
    Tjq();   // Verify module init
    Ejq();   // Init-verifiers module init
    Ljq();   // (unknown)
    Sjq();   // (unknown)
    Ijq();   // Skillify module init
    r91()    // Chrome tools init
})

// READABLE (for understanding):
builtinSkillsLazyInit = lazyInit(() => {
    initRememberModule();
    initChromeModule();
    initUnknownModule1();
    initUnknownModule2();
    initVerifyModule();
    initInitVerifiersModule();
    initUnknownModule3();
    initUnknownModule4();
    initSkillifyModule();
    initChromeTools();
});
```

---

## Activation Requirements for Stub Skills

To activate a stub skill, the registration function needs to call `Sj()`:

```javascript
// Template for activating a stub skill
function registerSkillName() {
    registerPromptSkill({
        name: "skill-name",
        description: "Description of the skill",
        allowedTools: ["Tool1", "Tool2"],  // Optional: restrict tools
        userInvocable: true,               // Optional: allow /name invocation
        argumentHint: "[args description]", // Optional: show in UI
        disableModelInvocation: false,     // Allow LLM to invoke
        async getPromptForCommand(args) {
            let prompt = SYSTEM_PROMPT_CONSTANT;
            if (args) {
                prompt += `\n\n## Task\n\n${args}`;
            }
            return [{ type: "text", text: prompt }];
        }
    });
}
```

---

## Design Rationale

### Why Stubs Exist

The stub implementations suggest:
1. **Feature preparation** - System prompts are ready, awaiting full implementation
2. **Incremental rollout** - Features can be enabled by replacing `return` with `Sj()` call
3. **Testing infrastructure** - Lazy initializers ensure dependencies are available
4. **Reduced binary size** - Unused features don't add runtime overhead

### Why Chrome is Conditional

The `claude-in-chrome` skill depends on:
- Chrome extension being installed
- Extension being available in the current context
- User having granted necessary permissions

The `isEnabled: () => cZ1()` check ensures the skill is only registered when the extension is actually available.

### Why debug has disableModelInvocation

The `debug` skill is marked `disableModelInvocation: true` because:
1. It exposes internal debug logs
2. Users should explicitly request debugging
3. Automatic invocation could expose sensitive information
4. The tool is designed for troubleshooting, not normal operation