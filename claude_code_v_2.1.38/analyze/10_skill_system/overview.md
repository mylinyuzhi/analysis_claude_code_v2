# Skill System & Slash Command: Unified Abstraction (Claude Code 2.1.38)

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
Plugin skills                           LLM calls Skill tool (wt)
  └─ type: "prompt"                          ↓
     (user + LLM, usually)             handlePromptCommandFromTool (Pb4)
                                             ↓
Bundled skills (registered at init)    handlePromptCommand (Wb4)
  └─ type: "prompt"                          ↓
     (user + LLM)                      LLM executes with full prompt context
```

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Skill System, Hooks
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Slash Commands, UI Components

Key functions in this document:
- `createSkillObject` (dF4) - Factory that builds a command object from parsed SKILL.md
- `registerPromptSkill` (Sj) - Registers a bundled skill into the runtime registry
- `loadSkills` (ukA) - Master loader orchestrating all skill sources
- `loadSkillFromDir` (oQ1) - Parses one `.claude/skills/` directory
- `loadPluginSkills` (B0A) - Loads skills from installed plugins
- `getAllCommands` (cZ) - Memoized merger of ALL command sources
- `getSkillToolCommands` (hv) - Filter: commands visible to LLM via Skill tool
- `getSlashCommandSkills` (aO6) - Filter: commands shown in slash command autocomplete UI
- `skillToolDefinition` (wt) - The actual Skill tool object used by the agent loop
- `SKILL_TOOL_NAME` (NJ) - The string constant `"Skill"`
- `getSkillToolPrompt` (d0A) - Memoized prompt text for the Skill tool
- `buildSkillListingAttachment` (OIY) - Builds `skill_listing` for system reminder injection
- `formatSkillListing` (BU7) - Budget-aware skill list text formatter
- `filterCommandSuggestions` (PgA) - Core fuzzy filter for "/" input autocomplete
- `useCommandSuggestions` (WGq) - React hook orchestrating all autocomplete suggestions
- `handleSubmitCommand` (PE6) - REPL submit handler: immediate slash vs. deferred pipeline

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

### createSkillObject (dF4)

**What it does:** Creates the runtime command object from a parsed SKILL.md file. This is the factory function that bridges static markdown files and the runtime command interface.

**How it works:**

```javascript
// ============================================
// createSkillObject - Build command object from parsed SKILL.md
// Location: chunks.134.mjs:1682-1759
// ============================================

// ORIGINAL (for source lookup):
function dF4({ skillName: A, displayName: q, description: K, hasUserSpecifiedDescription: Y, markdownContent: z, allowedTools: w, argumentHint: H, argumentNames: $, whenToUse: O, version: _, model: J, disableModelInvocation: X, userInvocable: D, source: j, baseDir: M, loadedFrom: P, hooks: W, executionContext: G, agent: f, paths: Z }) {
    return {
        type: "prompt", name: A, description: K, hasUserSpecifiedDescription: Y,
        allowedTools: w, argumentHint: H, argNames: $.length > 0 ? $ : void 0,
        whenToUse: O, version: _, model: J, disableModelInvocation: X,
        userInvocable: D, context: G, agent: f, paths: Z,
        contentLength: z.length, isEnabled: () => !0, isHidden: !D,
        progressMessage: "running",
        userFacingName() { return q || A },
        source: j, loadedFrom: P, hooks: W, skillRoot: M,
        async getPromptForCommand(N, T) {
            let k = M ? `Base directory for this skill: ${M}\n\n${z}` : z;
            k = Ej1(k, N, !0, $);                        // arg substitution
            k = k.replace(/\$\{CLAUDE_SESSION_ID\}/g, U6()); // session ID injection
            k = await Ma(k, { ...T, async getAppState() {
                let y = await T.getAppState();
                return { ...y, toolPermissionContext: {
                    ...y.toolPermissionContext,
                    alwaysAllowRules: { ...y.toolPermissionContext.alwaysAllowRules, command: w }
                }}
            }}, `/${A}`);
            return [{ type: "text", text: k }]
        }
    }
}

// READABLE (for understanding):
function createSkillObject({ skillName, displayName, description, hasUserSpecifiedDescription,
    markdownContent, allowedTools, argumentHint, argumentNames, whenToUse, version, model,
    disableModelInvocation, userInvocable, source, baseDir, loadedFrom, hooks,
    executionContext, agent, paths }) {
    return {
        type: "prompt",
        name: skillName,
        description,
        hasUserSpecifiedDescription,
        allowedTools,
        argumentHint,
        argNames: argumentNames.length > 0 ? argumentNames : undefined,
        whenToUse, version, model,
        disableModelInvocation, userInvocable,
        context: executionContext, agent, paths,
        contentLength: markdownContent.length,
        isEnabled: () => true,
        isHidden: !userInvocable,   // hidden from user-facing lists if model-only
        progressMessage: "running",
        userFacingName() { return displayName || skillName },
        source, loadedFrom, hooks, skillRoot: baseDir,

        async getPromptForCommand(args, toolUseContext) {
            // 1. Prepend baseDir header if applicable (for skill-dir skills)
            let content = baseDir
                ? `Base directory for this skill: ${baseDir}\n\n${markdownContent}`
                : markdownContent;

            // 2. Substitute $1, $2 or named ${args.foo} placeholders
            content = interpolateArguments(content, args, true, argumentNames);

            // 3. Inject the current session ID
            content = content.replace(/\$\{CLAUDE_SESSION_ID\}/g, getSessionId());

            // 4. Execute embedded shell expressions ($(command) blocks in content)
            //    Note: overwrites toolPermissionContext.alwaysAllowRules to enforce
            //    the skill's allowedTools during shell execution
            content = await executeShellExpansion(content, {
                ...toolUseContext,
                async getAppState() {
                    let state = await toolUseContext.getAppState();
                    return {
                        ...state,
                        toolPermissionContext: {
                            ...state.toolPermissionContext,
                            alwaysAllowRules: {
                                ...state.toolPermissionContext.alwaysAllowRules,
                                command: allowedTools  // enforce skill's tool whitelist
                            }
                        }
                    }
                }
            }, `/${skillName}`);

            return [{ type: "text", text: content }]
        }
    }
}

// Mapping: dF4→createSkillObject, Ej1→interpolateArguments, U6→getSessionId, Ma→executeShellExpansion
```

**Key insights:**

1. **`getPromptForCommand` is where all the magic happens:** The prompt is not static — it is dynamically assembled at invocation time, with argument substitution, session ID injection, and shell expansion all applied to the raw markdown content. This means a skill's prompt can contain `$(git log --oneline -10)` and it will be substituted with actual git output when the skill runs.

2. **`allowedTools` double-enforcement:** The skill's `allowed-tools` list is enforced in two places: once when building the `command_permissions` attachment (restricting what tools the LLM can use during skill execution), and again here in `executeShellExpansion` (restricting what tools any embedded shell expressions in the skill content can use).

3. **`baseDir` injection:** When a skill from `.claude/skills/commit/` runs, the prompt is prefixed with `Base directory for this skill: /path/to/project/.claude/skills/commit/`. This helps the LLM understand the skill's filesystem context.

### registerPromptSkill (Sj) - The Bundled Skill Variant

**What it does:** An alternate factory for bundled (code-defined) skills that are registered at application startup, not loaded from files.

```javascript
// ============================================
// registerPromptSkill - Register a bundled skill into the in-memory registry
// Location: chunks.166.mjs:1795-1820
// ============================================

// ORIGINAL (for source lookup):
function Sj(A) {
    let q = {
        type: "prompt", name: A.name, description: A.description,
        hasUserSpecifiedDescription: !0, allowedTools: A.allowedTools ?? [],
        argumentHint: A.argumentHint, whenToUse: A.whenToUse, model: A.model,
        disableModelInvocation: A.disableModelInvocation ?? !1,
        userInvocable: A.userInvocable ?? !0,
        contentLength: 0, source: "bundled", loadedFrom: "bundled",
        hooks: A.hooks, context: A.context, agent: A.agent,
        isEnabled: A.isEnabled ?? (() => !0),
        isHidden: !(A.userInvocable ?? !0),
        progressMessage: "running",
        userFacingName: () => A.name,
        getPromptForCommand: A.getPromptForCommand
    };
    iHq.push(q)
}

// READABLE (for understanding):
function registerPromptSkill(skillDef) {
    let commandObject = {
        type: "prompt",
        name: skillDef.name,
        description: skillDef.description,
        hasUserSpecifiedDescription: true,     // always true for bundled (defined in code)
        allowedTools: skillDef.allowedTools ?? [],
        argumentHint: skillDef.argumentHint,
        whenToUse: skillDef.whenToUse,
        model: skillDef.model,
        disableModelInvocation: skillDef.disableModelInvocation ?? false,
        userInvocable: skillDef.userInvocable ?? true,
        contentLength: 0,                      // no file content - getPromptForCommand is in code
        source: "bundled",
        loadedFrom: "bundled",
        hooks: skillDef.hooks,
        context: skillDef.context,
        agent: skillDef.agent,
        isEnabled: skillDef.isEnabled ?? (() => true),
        isHidden: !(skillDef.userInvocable ?? true),
        progressMessage: "running",
        userFacingName: () => skillDef.name,
        getPromptForCommand: skillDef.getPromptForCommand  // provided by caller
    };
    bundledSkillRegistry.push(commandObject);  // added to iHq[]
}

// Mapping: Sj→registerPromptSkill, iHq→bundledSkillRegistry, A→skillDef
```

**Why this approach:** Bundled skills like `keybindings-help` and `debug` need the same runtime interface as user-defined skills to flow through `handlePromptCommand` without special-casing. `registerPromptSkill` creates the identical interface shape but with `getPromptForCommand` provided as a function in code instead of read from a file.

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

**Conditional skills:** Skills with a `paths:` frontmatter field are separated into a `conditionalSkillsMap` (aQ1). They are NOT returned by `loadSkills` immediately. Instead, `activateConditionalSkills` (EW1) checks these against file-operation events — when a tool writes/reads a file matching the glob pattern, the corresponding skill activates dynamically.

### loadSkillFromDir (oQ1) - Single Directory Parser

**What it does:** Scans one `.claude/skills/` directory and builds command objects for every SKILL.md found.

**How it works:**
1. Read the directory for subdirectories
2. For each subdirectory containing a `SKILL.md` (or multiple `.md` files):
   - Read the SKILL.md content
   - Parse frontmatter via yaml parser (`yD`)
   - Extract all metadata fields: `description`, `allowed-tools`, `user-invocable`, `disable-model-invocation`, `model`, `context`, `agent`, `arguments`, `paths`, `when-to-use`, `hooks`, `version`
   - Derive the command name: subdirectory name, optionally namespaced by relative path from root
   - Call `createSkillObject(dF4)` to build the runtime object
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

### Overview of the Skill Tool (wt)

The `Skill` tool is the mechanism by which the LLM can autonomously invoke skills. It bridges the LLM's reasoning ("the user wants to commit code") to the skill execution pipeline. Critically, it feeds into the **same `handlePromptCommand(Wb4)` function** that handles user-typed `/commit`.

### The Skill Tool Object (wt)

```javascript
// ============================================
// skillToolDefinition - The complete Skill tool object
// Location: chunks.132.mjs:820-1017
// ============================================

// ORIGINAL (for source lookup):
wt = {
    name: NJ,  // "Skill"
    maxResultSizeChars: 1e5,
    get inputSchema() { return HNY() },
    get outputSchema() { return _NY() },
    description: async ({ skill: A }) => `Execute skill: ${A}`,
    prompt: async () => d0A(ZO()),
    userFacingName: () => NJ,
    isConcurrencySafe: () => !1,
    isEnabled: () => !0,
    isReadOnly: () => !1,
    async validateInput({ skill: A }, q) { /* ... */ },
    async checkPermissions({ skill: A, args: q }, K) { /* ... */ },
    async call({ skill: A, args: q }, K, Y, z, w) { /* ... */ }
}

// READABLE (for understanding):
const skillTool = {
    name: "Skill",   // NJ = "Skill" (chunks.89.mjs:586)
    maxResultSizeChars: 100_000,
    get inputSchema() { return getSkillInputSchema() },   // Zod: { skill: string, args?: string }
    get outputSchema() { return getSkillOutputSchema() },
    description: async ({ skill: skillName }) => `Execute skill: ${skillName}`,
    prompt: async () => getSkillToolPrompt(getCwd()),    // d0A: memoized full description text
    userFacingName: () => "Skill",
    isConcurrencySafe: () => false,
    isEnabled: () => true,
    isReadOnly: () => false,

    async validateInput({ skill: skillName }, context) {
        // Validates skill name format and checks it exists in getSkillToolCommands(hv)
    },
    async checkPermissions({ skill: skillName, args }, context) {
        // Checks permission context for skill execution (always auto-approved for skills)
    },
    async call({ skill: skillName, args }, context, getOutput, setState, sessionState) {
        // Delegates to handlePromptCommandFromTool(Pb4) → handlePromptCommand(Wb4)
        // Returns the skill's output messages back into the agent loop
    }
}

// Mapping: wt→skillTool, NJ→"Skill", HNY→getSkillInputSchema, _NY→getSkillOutputSchema,
//          d0A→getSkillToolPrompt, ZO→getCwd
```

### The Skill Tool Prompt (d0A) - LLM Instruction

**What it does:** Generates the static description text that appears in the LLM's tool use context. This text tells the LLM exactly when and how to invoke the Skill tool.

```javascript
// ============================================
// getSkillToolPrompt - Memoized prompt text for the Skill tool
// Location: chunks.88.mjs:10-38
// ============================================

// ORIGINAL (for source lookup):
d0A = KA(async (A) => {
    return `Execute a skill within the main conversation

When users ask you to perform tasks, check if any of the available skills match. Skills provide specialized capabilities and domain knowledge.

When users reference a "slash command" or "/<something>" (e.g., "/commit", "/review-pr"), they are referring to a skill. Use this tool to invoke it.

How to invoke:
- Use this tool with the skill name and optional arguments
- Examples:
  - \`skill: "pdf"\` - invoke the pdf skill
  - \`skill: "commit", args: "-m 'Fix bug'"\` - invoke with arguments
  - \`skill: "review-pr", args: "123"\` - invoke with arguments
  - \`skill: "ms-office-suite:pdf"\` - invoke using fully qualified name

Important:
- Available skills are listed in system-reminder messages in the conversation
- When a skill matches the user's request, this is a BLOCKING REQUIREMENT: invoke the relevant Skill tool BEFORE generating any other response about the task
- NEVER mention a skill without actually calling this tool
- Do not invoke a skill that is already running
- Do not use this tool for built-in CLI commands (like /help, /clear, etc.)
- If you see a <${SG}> tag in the current conversation turn, the skill has ALREADY been loaded - follow the instructions directly instead of calling this tool again
`
})

// READABLE (for understanding):
const getSkillToolPrompt = memoized(async (cwd) => {
    return `Execute a skill within the main conversation
...
- Available skills are listed in system-reminder messages in the conversation
- When a skill matches the user's request, this is a BLOCKING REQUIREMENT: invoke the relevant Skill tool BEFORE generating any other response about the task
- NEVER mention a skill without actually calling this tool
...
- If you see a <command-name> tag in the current conversation turn, the skill has ALREADY been loaded - follow the instructions directly instead of calling this tool again
`
})

// Mapping: d0A→getSkillToolPrompt, KA→memoized, SG→COMMAND_NAME_TAG, ZO→getCwd
```

**Key insights:**

1. **"BLOCKING REQUIREMENT"**: The prompt instructs the LLM with a strong obligation — it MUST invoke the Skill tool before generating any other response when a matching skill exists. This prevents the LLM from trying to answer "commit my changes" with a text response instead of triggering the skill.

2. **`<command-name>` idempotency guard**: The final instruction checks for the `<command-name>` XML tag in the current turn. When a skill runs, its metadata is injected as `<command-name>/commit</command-name>`. If this tag is already present, the skill is already loaded and the LLM should follow the injected instructions directly rather than calling the Skill tool again. This prevents double-invocation.

3. **Explicit exclusion of built-ins**: The tool description explicitly states "Do not use this tool for built-in CLI commands (like /help, /clear, etc.)". This is enforced both by the text instruction and by the `source !== "builtin"` filter in `getSkillToolCommands(hv)`.

---

## Part 5: The System Reminder Injection Pipeline

The LLM needs to know which skills exist before it can decide to invoke them. Claude Code injects skill availability into the conversation as a `system-reminder` attachment on every turn. This is a four-stage pipeline:

```
Turn N starts
     │
     ▼
[Stage 1] loadSkillsForLLM (hv)
     Load all "prompt"-type commands, filter out:
     - disableModelInvocation=true (user-only)
     - source="builtin" (hardcoded CLI commands)
     - no description AND no whenToUse (undiscoverable)
     Result: Array of visible-to-LLM skills
     │
     ▼
[Stage 2] buildSkillListingAttachment (OIY)
     Filter to NEW skills (not yet sent in this session via xg1 Set)
     If no new skills: return [] (no-op for this turn)
     Set isInitial = (sentSkillNames.size === 0 before this)
     Add all new skill names to sentSkillNames (xg1)
     │
     ▼
[Stage 3] formatSkillListing (BU7)
     Format skills as budget-aware text listing:
     charBudget = min(16000, contextWindowTokens * 4 * 0.02)
     Tier 1: Full  → "- name: description - whenToUse"
     Tier 2: Trunc → "- name: desc…" (proportionally truncated)
     Tier 3: Names → "- name" (when even truncated won't fit)
     │
     ▼
[Stage 4] System Reminder Message (chunks.173.mjs)
     Attachment → Message:
     "The following skills are available for use with the Skill tool:\n\n{listing}"
     (tagged isMeta: true so it's excluded from compaction)
```

### Stage 1: loadSkillsForLLM (hv)

**What it does:** The primary filter for what the LLM can see and invoke.

**Key filter criteria** (all must pass):
- `type === "prompt"` — only skills, not interactive `local`/`local-jsx` commands
- `!disableModelInvocation` — user has not explicitly blocked model access
- `source !== "builtin"` — not a hardcoded CLI command
- At least one of: `loadedFrom === "bundled"` OR `loadedFrom === "commands_DEPRECATED"` OR `hasUserSpecifiedDescription` OR `whenToUse`

**Why the last condition:** This prevents skills without documentation from being exposed to the LLM. If a user creates `.claude/skills/experiment/SKILL.md` with no `description:` or `when-to-use:` field, the LLM will not see it. This forces skill authors to write documentation.

### Stage 2: buildSkillListingAttachment (OIY) - Delta Updates

**What it does:** Implements delta-only skill delivery to avoid repeating the full skill list every turn.

```javascript
// ============================================
// buildSkillListingAttachment - Delta skill injection
// Location: chunks.142.mjs:2381-2410
// ============================================

// ORIGINAL (for source lookup):
async function OIY(A) {
    let q = ZO(),
        Y = (await hv(q)).filter(($) => !xg1.has($.name));
    if (Y.length === 0) return [];
    let z = xg1.size === 0;
    for (let $ of Y) xg1.add($.name);
    let w = yG(A.options.mainLoopModel, FP());
    return [{ type: "skill_listing", content: BU7(Y, w), skillCount: Y.length, isInitial: z }]
}

// READABLE (for understanding):
async function buildSkillListingAttachment(sessionContext) {
    let cwd = getCwd();
    let allSkills = await loadSkillsForLLM(cwd);      // hv(cwd)
    let newSkills = allSkills.filter(s => !sentSkillNames.has(s.name));  // xg1 = session-level set
    if (newSkills.length === 0) return [];             // nothing new this turn

    let isInitial = sentSkillNames.size === 0;         // true on the very first turn
    for (let skill of newSkills) sentSkillNames.add(skill.name);

    let contextWindowSize = getContextWindowForModel(sessionContext.options.mainLoopModel, getDefaultParams());
    return [{ type: "skill_listing", content: formatSkillListing(newSkills, contextWindowSize),
              skillCount: newSkills.length, isInitial }]
}

// Mapping: OIY→buildSkillListingAttachment, xg1→sentSkillNames, z→isInitial,
//          hv→loadSkillsForLLM, BU7→formatSkillListing, yG→getContextWindowForModel
```

**Why delta updates:** The skill list can be large (dozens of skills with descriptions). Sending it every turn would waste tokens. The `xg1` set tracks which skills have been sent in the current session, so new skills discovered mid-session (from `discoverProjectSkills` dynamic reloading) are sent incrementally without re-sending known skills.

### Stage 3: formatSkillListing (BU7) - Budget-Aware Formatting

**What it does:** Converts the skill array to text, fitting within a character budget derived from the model's context window size.

**The three rendering tiers:**

```
charBudget = min(
    env.SLASH_COMMAND_TOOL_CHAR_BUDGET,    // manual override
    contextWindowTokens * 4 * 0.02,        // 2% of context window in chars
    16000                                   // absolute default
)

Tier 1 (everything fits):
  "- commit: Create a git commit with a conventional commit message - use when staging"
  "- review: Review pull request and suggest improvements - use for PR review requests"

Tier 2 (descriptions truncated):
  "- commit: Create a git commit with a conven…"
  "- review: Review pull request and suggest…"

Tier 3 (names only, when descBudgetPerSkill < 20 chars):
  "- commit"
  "- review"
```

**Key insight:** The `2% * 4 = 8%` factor converts context window tokens to characters (approx 4 chars/token), then takes 2% of that. For a 200K token model: `200,000 × 4 × 0.02 = 16,000 chars`. This caps the skill listing at about 1.6K tokens regardless of how many skills exist.

### Stage 4: System Reminder Message Construction (chunks.173.mjs)

The `skill_listing` attachment type is converted to a system reminder message:

```javascript
// Attachment dispatch in chunks.173.mjs:880
case "skill_listing": {
    if (!A.content) return [];
    return wrapAsSystemReminder([createMetaMessage({
        content: `The following skills are available for use with the Skill tool:\n\n${A.content}`,
        isMeta: true   // excluded from compaction summaries
    })])
}
```

**The LLM sees:**
```
The following skills are available for use with the Skill tool:

- commit: Create a git commit - use when user wants to commit changes
- review: Review pull request - use when asked to review or check a PR
- deploy: Deploy to staging - use when deploying to staging environment
```

### Invoked Skills Tracking (da4 / MN1)

When a skill runs, it is recorded in the session state via `registerInvokedSkill(MN1)`. This builds a separate `invoked_skills` attachment that reminds the LLM of skills already run in this session:

```javascript
// Register skill at invocation time (chunks.1.mjs:2963)
function MN1(skillName, skillPath, skillContent) {
    setAppState(state => ({
        ...state,
        invokedSkills: new Map(state.invokedSkills).set(skillName, {
            skillName, skillPath, content: skillContent, invokedAt: Date.now()
        })
    }))
}

// Build reminder attachment (chunks.146.mjs:2711)
function da4() {
    let invokedSkills = getInvokedSkills();  // zR6() → state.invokedSkills
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

The user-visible part of the unified system is the slash command picker that appears when a user types `/` in the REPL input.

### Layer 1: Input Detection (PE6)

The REPL submit handler (`handleSubmitCommand`, PE6, chunks.185.mjs:3067) has an early-exit path for `local-jsx` slash commands that are marked `immediate`:

```javascript
// ORIGINAL (from chunks.185.mjs:3105):
if (q.trim().startsWith("/")) {
    let x = q.trim(), p = x.indexOf(" ");
    let l = p === -1 ? x.slice(1) : x.slice(1, p);   // command name
    let r = p === -1 ? "" : x.slice(p + 1).trim();    // args
    let s = commands.find((cmd) =>
        cmd.immediate && cmd.isEnabled() &&
        (cmd.name === l || cmd.aliases?.includes(l) || cmd.userFacingName() === l)
    );
    if (s && s.type === "local-jsx") {
        // Execute immediately: render JSX without going through the message pipeline
        // This prevents commands like /help, /config from appearing in conversation history
        executeImmediateCommand(s, r);
        return;
    }
}
// Otherwise: fall through to handleSlashInput(Mb4) via normal message pipeline
```

**Why two paths:** Commands like `/help`, `/config` are purely interactive UI. Running them through the message pipeline would add chat history entries that the user never requested. "Immediate" execution renders them inline without creating conversation turns.

### Layer 2: Fuzzy Suggestion Filter (PgA)

`filterCommandSuggestions` (PgA) in `chunks.182.mjs:1971` is the core autocomplete engine:

```javascript
// ============================================
// filterCommandSuggestions - Fuzzy slash command picker
// Location: chunks.182.mjs:1971-2057
// ============================================

// ORIGINAL (for source lookup):
function PgA(A, q) {
    if (!NF(A)) return [];       // NF(A) = A.startsWith("/")
    if (QDz(A)) return [];       // QDz = isAfterCommandSpace: has non-trailing space = in args mode
    let K = A.slice(1).toLowerCase().trim();
    if (K === "") {
        // "/" alone: show frecency-sorted list
        let $= q.filter((W) => !W.isHidden);
        let O = $.filter(W => W.type === "prompt")
            .map(W => ({ cmd: W, score: bM6(W.userFacingName()) }))  // bM6 = getDecayedSkillScore
            .filter(entry => entry.score > 0)
            .sort((a, b) => b.score - a.score).slice(0, 5).map(e => e.cmd);
        // ... group remaining by source priority (userSettings > projectSettings > policySettings > builtin)
        return [...frecencyTop, ...userSettings, ...projectSettings, ...policy, ...builtins]
            .map(cmd => toSuggestionItem(cmd))
    }
    // partial query: Fuse.js fuzzy search
    return fuseSearch(partialQuery, commandsWithKeys, {
        threshold: 0.3,
        keys: [
            { name: "commandName", weight: 3 },
            { name: "partKey",     weight: 2 },  // hyphen-split name parts
            { name: "aliasKey",    weight: 2 },
            { name: "descriptionKey", weight: 0.5 }
        ]
    }).sort(customSorter).map(result => toSuggestionItem(result.item.command, matchedAlias))
}

// READABLE (for understanding):
function filterCommandSuggestions(inputText, commands) {
    if (!isSlashInput(inputText)) return [];          // not starting with "/"
    if (isInArgsMode(inputText)) return [];           // has space = typing args

    let partialQuery = inputText.slice(1).toLowerCase().trim();

    if (partialQuery === "") {
        // "/" alone: show ALL commands ranked by frecency + source priority
        let visible = commands.filter(cmd => !cmd.isHidden);
        // Top 5 recently-used skills (time-decayed score from bM6)
        let frecencyTop = visible
            .filter(cmd => cmd.type === "prompt")
            .map(cmd => ({ cmd, score: getDecayedSkillScore(cmd.userFacingName()) }))
            .filter(e => e.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 5).map(e => e.cmd);
        // Remaining grouped by source tier then alphabetically
        return [...frecencyTop, ...userSkills, ...projectSkills, ...managedSkills, ...builtins]
            .map(cmd => toSuggestionItem(cmd));
    }

    // Partial query: Fuse.js with weighted multi-key matching
    let fuseResults = new Fuse(commandsWithKeys, {
        includeScore: true,
        threshold: 0.3,
        keys: [
            { name: "commandName",    weight: 3 },
            { name: "partKey",        weight: 2 },  // e.g., "commit" matches "my-commit-skill"
            { name: "aliasKey",       weight: 2 },
            { name: "descriptionKey", weight: 0.5 }
        ]
    }).search(partialQuery);

    return fuseResults
        .sort(rankByExactnessAndScore)  // exact > alias > prefix > fuzzy > frecency tiebreak
        .map(result => toSuggestionItem(result.item.command, result.matchedAlias));
}

// Mapping: PgA→filterCommandSuggestions, NF→isSlashInput, QDz→isInArgsMode,
//          bM6→getDecayedSkillScore, sWq→toSuggestionItem
```

**Ranking algorithm for "/" (empty query):**
1. Top 5 most recently/frequently used prompt skills (bM6 score > 0)
2. User settings skills (alphabetical)
3. Project settings skills (alphabetical)
4. Policy settings skills (alphabetical)
5. Built-in commands (alphabetical)

**Ranking algorithm for "/partial":**
1. Exact name match (e.g., "/com" → command named "com")
2. Exact alias match
3. Name prefix match
4. Alias prefix match
5. Fuzzy score (Fuse.js)
6. Frecency tiebreaker (bM6 score)

### Layer 3: Ghost Text Inline Completion (pv6 + MgA)

For `/command` typed **inside** a longer prompt (not at the start of input), `findInlineSlashToken` (pv6) detects the pattern:

```javascript
// ============================================
// findInlineSlashToken - Detect /cmd mid-sentence
// Location: chunks.182.mjs:1896-1911
// ============================================

// ORIGINAL:
function pv6(A, q) {
    if (A.startsWith("/")) return null;   // handled by PgA, not inline
    let Y = A.slice(0, q).match(/(?<=\s)\/([a-zA-Z0-9_:-]*)$/);
    if (!Y) return null;
    return { token: Y[0], startPos: Y.index, partialCommand: Y[1] }
}

// READABLE:
function findInlineSlashToken(inputText, cursorPosition) {
    if (inputText.startsWith("/")) return null;  // whole-line slash: PgA handles it
    let match = inputText.slice(0, cursorPosition).match(/(?<=\s)\/([a-zA-Z0-9_:-]*)$/);
    // matches /command at cursor, preceded by whitespace
    if (!match) return null;
    return { token: match[0], startPos: match.index, partialCommand: match[1] }
}
```

When a mid-sentence slash is detected, `getInlineGhostSuffix` (MgA) returns the completion suffix (e.g., typing "please run /com" in "commit" context shows "mit" as ghost text). Tab-pressing calls `acceptCommandSuggestion` (WgA) to replace the partial token with the full command name.

### Layer 4: useCommandSuggestions Hook (WGq)

The React hook `useCommandSuggestions` in `chunks.183.mjs` orchestrates all autocomplete behavior:

```
useEffect(effect, [inputText]):
  IF inputText starts with "/" AND cursor at end AND NOT in args-mode:
    ghost = getInlineGhostSuffix(MgA)
    IF ghost exists: setInlineGhost(ghost), clearDropdown
    ELSE: suggestions = filterCommandSuggestions(PgA), setDropdownSuggestions
  IF inputText starts with "!" (bash mode): check bash history (wGq)
  IF inputText contains "@": check teammate/file mentions (NgA)
  IF inputText === "/add-dir ": show directory completions (Tf6)
  IF inputText === "/resume ": show previous session titles ($F)
```

### The `disableSlashCommands` Gate

The entire autocomplete and slash command system can be disabled via the `disableSlashCommands` prop on the REPL component (`TUA`, chunks.188.mjs:22):

```javascript
// From chunks.188.mjs - REPL setup
let mergedCommands = buildCommandList(sessionOptions.commands);
let enabledCommands = useMemo(() => disableSlashCommands ? [] : mergedCommands, [disableSlashCommands, mergedCommands]);
// enabledCommands is passed to WGq, PgA, and handleSubmit
// When disableSlashCommands=true: no suggestions, no command resolution, "/" treated as plain text
```

This is used in embedded/SDK contexts where the REPL is rendered inside another application that provides its own command system.

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
      getPromptForCommand  registerSkillHooks(IM6)    buildSkillMetadata(nfY)
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
