# Skill System - Core Architecture (Claude Code 2.1.38)

## Overview

The skill system's core architecture handles discovery, loading, parsing, and registration of skills from multiple sources. The main entry point is `loadSkills` (ukA), which orchestrates the multi-source loading pipeline.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `loadSkills` (ukA) - Main skill loading entry point, chunks.134.mjs:2059-2093
- `createSkillObject` (dF4) - Skill object factory, chunks.134.mjs:1682-1756
- `parseSkillHooks` (pF4) - Hook parsing from frontmatter, chunks.134.mjs:1663-1671
- `parseConditionalPaths` (ZEY) - Path-based activation parsing, chunks.134.mjs:1673-1680
- `registerPromptSkill` (Sj) - Bundled skill registration, chunks.166.mjs:1795-1820
- `getBundledSkills` (nHq) - Get bundled skill array, chunks.166.mjs:1822-1824
- `loadSkillsFromDirectory` (oQ1) - Single directory skill loader, chunks.134.mjs:1758-1821
- `loadLegacyCommands` (vEY) - Deprecated command loader, chunks.134.mjs:1873-1935

---

## Skill Loading Pipeline

### Main Entry Point: loadSkills (ukA)

**What it does:** Discovers and loads skills from all configured sources, deduplicates by file inode, and separates conditional (paths-based) skills for lazy activation.

**How it works:**
1. Determine paths for managed, user, and project skill directories
2. Load skills from each source in parallel using `Promise.all`
3. Load legacy commands from `.claude/commands/` (deprecated)
4. Deduplicate by file inode ID to avoid loading the same file twice via symlinks
5. Separate skills into unconditional (immediate) and conditional (lazy) groups
6. Return unconditional skills; store conditional skills in `aQ1` Map for later activation

**Why this approach:**
- **Parallel loading** reduces startup time
- **Inode deduplication** handles symlink edge cases correctly
- **Conditional skill lazy loading** prevents unnecessary context bloat for skills that only apply to specific file patterns

**Key insight:** The loading order matters for precedence. Managed skills load first, then user, then project. Later skills with the same name overwrite earlier ones, giving project skills the highest priority.

```javascript
// ============================================
// loadSkills - Main skill loading entry point
// Location: chunks.134.mjs:2059-2093
// ============================================

// ORIGINAL (for source lookup):
ukA = KA(async (A) => {
    let q = Wt(O8(), "skills"),
        K = Wt(df(), ".claude", "skills"),
        Y = FkA("skills", A);
    h(`Loading skills from: managed=${K}, user=${q}, project=[${Y.join(", ")}]`);
    let [z, w, H] = await Promise.all([
        oQ1(K, "policySettings"),
        qX("userSettings") ? oQ1(q, "userSettings") : Promise.resolve([]),
        qX("projectSettings") ? Promise.all(Y.map((W) => oQ1(W, "projectSettings"))) : Promise.resolve([])
    ]),
    $ = qC(), // Get additional project directories
    O = qX("projectSettings") ? await Promise.all($.map((W) => oQ1(Wt(W, ".claude", "skills"), "projectSettings"))) : [],
    _ = await vEY(A), // Load legacy commands
    J = [...z, ...w, ...H.flat(), ...O.flat(), ..._],
    X = new Map, // Inode deduplication map
    D = [];
    for (let { skill: W, filePath: G } of J) {
        if (W.type !== "prompt") continue;
        let f = GEY(G); // Get inode ID
        if (f === null) { D.push(W); continue; }
        let Z = X.get(f);
        if (Z !== void 0) {
            h(`Skipping duplicate skill '${W.name}' from ${W.source} (same file already loaded from ${Z})`);
            continue;
        }
        X.set(f, W.source), D.push(W)
    }
    let j = J.length - D.length;
    if (j > 0) h(`Deduplicated ${j} skills (same file)`);

    // Separate conditional and unconditional skills
    let M = [], P = [];
    for (let W of D)
        if (W.type === "prompt" && W.paths && W.paths.length > 0 && !BkA.has(W.name))
            P.push(W); // Conditional
        else M.push(W); // Unconditional

    for (let W of P) aQ1.set(W.name, W); // Store conditional skills
    if (P.length > 0) h(`[skills] ${P.length} conditional skills stored (activated when matching files are touched)`);

    return h(`Loaded ${D.length} unique skills (${M.length} unconditional, ${P.length} conditional, ...)`), M
});

// READABLE (for understanding):
loadSkills = memoizeAsync(async (sessionContext) => {
    let managedSkillsDir = joinPath(getClaudeDir(), "skills"),
        userSkillsDir = joinPath(getHomeDir(), ".claude", "skills"),
        projectSkillsDirs = getProjectSkillDirectories(sessionContext);

    log(`Loading skills from: managed=${managedSkillsDir}, user=${userSkillsDir}, project=[${projectSkillsDirs.join(", ")}]`);

    // Parallel load from all sources
    let [managedSkills, userSkills, projectSkills] = await Promise.all([
        loadSkillsFromDirectory(managedSkillsDir, "policySettings"),
        isUserSettingsEnabled() ? loadSkillsFromDirectory(userSkillsDir, "userSettings") : Promise.resolve([]),
        isProjectSettingsEnabled() ? Promise.all(projectSkillsDirs.map(dir => loadSkillsFromDirectory(dir, "projectSettings"))) : Promise.resolve([])
    ]);

    // Load from additional project directories
    let additionalDirs = getAdditionalProjectDirs();
    let additionalSkills = isProjectSettingsEnabled() ? await Promise.all(
        additionalDirs.map(dir => loadSkillsFromDirectory(joinPath(dir, ".claude", "skills"), "projectSettings"))
    ) : [];

    // Load legacy commands (deprecated)
    let legacyCommands = await loadLegacyCommands(sessionContext);

    // Merge all sources
    let allSkills = [...managedSkills, ...userSkills, ...projectSkills.flat(), ...additionalSkills.flat(), ...legacyCommands];

    // Deduplicate by inode
    let inodeMap = new Map();
    let uniqueSkills = [];
    for (let { skill, filePath } of allSkills) {
        if (skill.type !== "prompt") continue;
        let inodeId = getFileInode(filePath);
        if (inodeId === null) { uniqueSkills.push(skill); continue; }
        let existingSource = inodeMap.get(inodeId);
        if (existingSource !== void 0) {
            log(`Skipping duplicate skill '${skill.name}' from ${skill.source} (same file already loaded from ${existingSource})`);
            continue;
        }
        inodeMap.set(inodeId, skill.source);
        uniqueSkills.push(skill);
    }

    // Separate conditional skills (paths-based activation)
    let unconditionalSkills = [];
    let conditionalSkills = [];
    for (let skill of uniqueSkills) {
        if (skill.type === "prompt" && skill.paths && skill.paths.length > 0 && !activatedConditionalSkills.has(skill.name)) {
            conditionalSkills.push(skill);
        } else {
            unconditionalSkills.push(skill);
        }
    }

    // Store conditional skills for lazy activation
    for (let skill of conditionalSkills) {
        conditionalSkillRegistry.set(skill.name, skill);
    }

    return unconditionalSkills;
});

// Mapping: ukA→loadSkills, KA→memoizeAsync, O8→getClaudeDir, df→getHomeDir, FkA→getProjectSkillDirectories,
// oQ1→loadSkillsFromDirectory, qX→isSettingsEnabled, vEY→loadLegacyCommands, GEY→getFileInode,
// aQ1→conditionalSkillRegistry, BkA→activatedConditionalSkills, Pt→skillRegistry
```

### Skill Loading Sources

| Source | Priority | Directory | Settings Check |
|--------|----------|-----------|----------------|
| Managed | Lowest | `~/.claude/skills/` | Always loaded |
| User | Medium | `~/.claude/skills/` | `qX("userSettings")` |
| Project | Highest | `.claude/skills/` | `qX("projectSettings")` |
| Legacy Commands | N/A | `.claude/commands/` | Always loaded |

**Why this priority order:** Project-specific skills should override user/managed skills, allowing teams to customize behavior per-project while maintaining a fallback to shared skills.

---

## Skill Object Creation

### createSkillObject (dF4)

**What it does:** Factory function that creates a standardized skill object from parsed frontmatter and content.

**How it works:**
1. Accepts all skill properties as parameters
2. Constructs an object with type="prompt" and standard fields
3. Provides `getPromptForCommand` method that:
   - Injects base directory context
   - Performs template substitution for arguments
   - Replaces `${CLAUDE_SESSION_ID}` placeholder
   - Processes template expressions via `Ma` function

**Why this approach:**
- **Factory pattern** ensures consistent skill object structure
- **Lazy prompt generation** via `getPromptForCommand` defers expensive processing until invocation
- **Template support** enables parameterized skills

**Key insight:** The `getPromptForCommand` method modifies the tool permission context to include the skill's `allowedTools`, creating a scoped permission environment for the skill's execution.

```javascript
// ============================================
// createSkillObject - Factory function for skill objects
// Location: chunks.134.mjs:1682-1756
// ============================================

// ORIGINAL (for source lookup):
function dF4({
    skillName: A,
    displayName: q,
    description: K,
    hasUserSpecifiedDescription: Y,
    markdownContent: z,
    allowedTools: w,
    argumentHint: H,
    argumentNames: $,
    whenToUse: O,
    version: _,
    model: J,
    disableModelInvocation: X,
    userInvocable: D,
    source: j,
    baseDir: M,
    loadedFrom: P,
    hooks: W,
    executionContext: G,
    agent: f,
    paths: Z
}) {
    return {
        type: "prompt",
        name: A,
        description: K,
        hasUserSpecifiedDescription: Y,
        allowedTools: w,
        argumentHint: H,
        argNames: $.length > 0 ? $ : void 0,
        whenToUse: O,
        version: _,
        model: J,
        disableModelInvocation: X,
        userInvocable: D,
        context: G,
        agent: f,
        paths: Z,
        contentLength: z.length,
        isEnabled: () => !0,
        isHidden: !D,
        progressMessage: "running",
        userFacingName() { return q || A },
        source: j,
        loadedFrom: P,
        hooks: W,
        skillRoot: M,
        async getPromptForCommand(N, T) {
            let k = M ? `Base directory for this skill: ${M}\n\n${z}` : z;
            return k = Ej1(k, N, !0, $),
                   k = k.replace(/\$\{CLAUDE_SESSION_ID\}/g, U6()),
                   k = await Ma(k, { ...T,
                       async getAppState() {
                           let y = await T.getAppState();
                           return {
                               ...y,
                               toolPermissionContext: {
                                   ...y.toolPermissionContext,
                                   alwaysAllowRules: {
                                       ...y.toolPermissionContext.alwaysAllowRules,
                                       command: w
                                   }
                               }
                           }
                       }
                   }, `/${A}`),
                   [{ type: "text", text: k }]
        }
    }
}

// READABLE (for understanding):
function createSkillObject({
    skillName,
    displayName,
    description,
    hasUserSpecifiedDescription,
    markdownContent,
    allowedTools,
    argumentHint,
    argumentNames,
    whenToUse,
    version,
    model,
    disableModelInvocation,
    userInvocable,
    source,
    baseDir,
    loadedFrom,
    hooks,
    executionContext,
    agent,
    paths
}) {
    return {
        type: "prompt",
        name: skillName,
        description,
        hasUserSpecifiedDescription,
        allowedTools,
        argumentHint,
        argNames: argumentNames.length > 0 ? argumentNames : undefined,
        whenToUse,
        version,
        model,
        disableModelInvocation,
        userInvocable,
        context: executionContext,
        agent,
        paths,
        contentLength: markdownContent.length,
        isEnabled: () => true,
        isHidden: !userInvocable,
        progressMessage: "running",
        userFacingName() { return displayName || skillName },
        source,
        loadedFrom,
        hooks,
        skillRoot: baseDir,

        async getPromptForCommand(args, toolUseContext) {
            // Inject base directory context
            let prompt = baseDir
                ? `Base directory for this skill: ${baseDir}\n\n${markdownContent}`
                : markdownContent;

            // Perform argument substitution
            prompt = substituteArguments(prompt, args, true, argumentNames);

            // Replace session ID placeholder
            prompt = prompt.replace(/\$\{CLAUDE_SESSION_ID\}/g, getSessionId());

            // Process template expressions
            prompt = await processTemplateExpressions(prompt, {
                ...toolUseContext,
                async getAppState() {
                    let state = await toolUseContext.getAppState();
                    return {
                        ...state,
                        // Inject skill's allowed tools into permission context
                        toolPermissionContext: {
                            ...state.toolPermissionContext,
                            alwaysAllowRules: {
                                ...state.toolPermissionContext.alwaysAllowRules,
                                command: allowedTools
                            }
                        }
                    };
                }
            }, `/${skillName}`);

            return [{ type: "text", text: prompt }];
        }
    };
}

// Mapping: dF4→createSkillObject, A→skillName, q→displayName, K→description, Y→hasUserSpecifiedDescription,
// z→markdownContent, w→allowedTools, H→argumentHint, $→argumentNames, O→whenToUse, _→version, J→model,
// X→disableModelInvocation, D→userInvocable, j→source, M→baseDir, P→loadedFrom, W→hooks, G→executionContext,
// f→agent, Z→paths, N→args, T→toolUseContext, Ej1→substituteArguments, U6→getSessionId, Ma→processTemplateExpressions
```

---

## Hook Parsing

### parseSkillHooks (pF4)

**What it does:** Parses and validates the `hooks` field from skill frontmatter using a Zod schema.

**How it works:**
1. Check if `hooks` field exists
2. Parse with `Xk.safeParse` (Zod schema)
3. Return parsed data on success, log error and return undefined on failure

**Why this approach:**
- **Zod validation** ensures hook structure is correct before registration
- **Fail-soft** behavior (log error, return undefined) prevents a malformed skill from crashing the system

**Key insight:** The hook schema (`Xk`) supports multiple hook events (PreToolUse, PostToolUse, etc.) with matcher patterns and hook definitions including one-shot hooks.

```javascript
// ============================================
// parseSkillHooks - Hook parsing from frontmatter
// Location: chunks.134.mjs:1663-1671
// ============================================

// ORIGINAL (for source lookup):
function pF4(A, q) {
    if (!A.hooks) return;
    let K = Xk.safeParse(A.hooks);
    if (!K.success) {
        h(`Invalid hooks in skill '${q}': ${K.error.message}`);
        return
    }
    return K.data
}

// READABLE (for understanding):
function parseSkillHooks(frontmatter, skillName) {
    if (!frontmatter.hooks) return undefined;

    let result = hooksSchema.safeParse(frontmatter.hooks);
    if (!result.success) {
        log(`Invalid hooks in skill '${skillName}': ${result.error.message}`);
        return undefined;
    }
    return result.data;
}

// Mapping: pF4→parseSkillHooks, A→frontmatter, q→skillName, Xk→hooksSchema, h→log
```

---

## Conditional Skill Activation

### Path-Based Activation (ZEY, EW1)

**What it does:** Skills with a `paths` field are only activated when the user touches files matching those path patterns.

**How it works:**
1. During loading, skills with `paths` are stored in `aQ1` Map instead of the main registry
2. When files are touched (read, edit, etc.), `EW1` checks if any conditional skill matches
3. Matching skills are moved from `aQ1` to the main `Pt` registry
4. Telemetry event `tengu_dynamic_skills_changed` is fired

**Why this approach:**
- **Reduces context bloat** - skills only appear when relevant
- **Automatic activation** - no manual enabling required
- **Gitignore-style matching** via `micromatch` library

**Key insight:** The paths field supports glob patterns like `src/**` or `**/*.test.ts`, enabling fine-grained activation rules.

```javascript
// ============================================
// parseConditionalPaths - Parse paths field for conditional activation
// Location: chunks.134.mjs:1673-1680
// ============================================

// ORIGINAL (for source lookup):
function ZEY(A) {
    if (!A.paths || typeof A.paths !== "string") return;
    let q = F76(A.paths).map((K) => {
        return K.endsWith("/**") ? K.slice(0, -3) : K
    }).filter((K) => K.length > 0);
    if (q.length === 0 || q.every((K) => K === "**")) return;
    return q
}

// READABLE (for understanding):
function parseConditionalPaths(frontmatter) {
    if (!frontmatter.paths || typeof frontmatter.paths !== "string") return undefined;

    let patterns = parseStringArray(frontmatter.paths).map(pattern => {
        // Strip trailing /** to use as directory prefix
        return pattern.endsWith("/**") ? pattern.slice(0, -3) : pattern;
    }).filter(pattern => pattern.length > 0);

    // Don't activate if patterns are empty or match everything
    if (patterns.length === 0 || patterns.every(p => p === "**")) return undefined;

    return patterns;
}

// Mapping: ZEY→parseConditionalPaths, A→frontmatter, F76→parseStringArray, q→patterns, K→pattern
```

---

## Bundled Skills

### registerPromptSkill (Sj)

**What it does:** Registers a built-in skill by adding it to the bundled skill registry array (`iHq`).

**How it works:**
1. Create skill object with provided properties
2. Set defaults for optional fields (`userInvocable: true`, `disableModelInvocation: false`)
3. Push to `iHq` array for later retrieval

**Why this approach:**
- **Array-based registry** is simple and efficient for built-in skills
- **Lazy loading** via module initializers ensures skills are available when needed
- **Consistent structure** matches file-based skills

```javascript
// ============================================
// registerPromptSkill - Register a bundled skill
// Location: chunks.166.mjs:1795-1820
// ============================================

// ORIGINAL (for source lookup):
function Sj(A) {
    let q = {
        type: "prompt",
        name: A.name,
        description: A.description,
        hasUserSpecifiedDescription: !0,
        allowedTools: A.allowedTools ?? [],
        argumentHint: A.argumentHint,
        whenToUse: A.whenToUse,
        model: A.model,
        disableModelInvocation: A.disableModelInvocation ?? !1,
        userInvocable: A.userInvocable ?? !0,
        contentLength: 0,
        source: "bundled",
        loadedFrom: "bundled",
        hooks: A.hooks,
        context: A.context,
        agent: A.agent,
        isEnabled: A.isEnabled ?? (() => !0),
        isHidden: !(A.userInvocable ?? !0),
        progressMessage: "running",
        userFacingName: () => A.name,
        getPromptForCommand: A.getPromptForCommand
    };
    iHq.push(q)
}

// READABLE (for understanding):
function registerPromptSkill(skillDefinition) {
    let skillObject = {
        type: "prompt",
        name: skillDefinition.name,
        description: skillDefinition.description,
        hasUserSpecifiedDescription: true,
        allowedTools: skillDefinition.allowedTools ?? [],
        argumentHint: skillDefinition.argumentHint,
        whenToUse: skillDefinition.whenToUse,
        model: skillDefinition.model,
        disableModelInvocation: skillDefinition.disableModelInvocation ?? false,
        userInvocable: skillDefinition.userInvocable ?? true,
        contentLength: 0,
        source: "bundled",
        loadedFrom: "bundled",
        hooks: skillDefinition.hooks,
        context: skillDefinition.context,
        agent: skillDefinition.agent,
        isEnabled: skillDefinition.isEnabled ?? (() => true),
        isHidden: !(skillDefinition.userInvocable ?? true),
        progressMessage: "running",
        userFacingName: () => skillDefinition.name,
        getPromptForCommand: skillDefinition.getPromptForCommand
    };
    bundledSkillRegistry.push(skillObject);
}

// Mapping: Sj→registerPromptSkill, A→skillDefinition, iHq→bundledSkillRegistry
```

### Built-in Skill Registration Chain

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
    registerKeybindingsSkill();    // fjq - active
    registerVerifySkill();         // Njq - stub
    registerInitVerifiersSkill();  // vjq - stub
    registerDebugSkill();          // kjq - active
    registerBenchmarkSkill();      // Cjq - stub
    registerSkillifySkill();       // hjq - stub
    if (isChromeExtensionAvailable()) {
        registerChromeSkill();     // jjq - conditional, active
    }
}

// Mapping: xjq→registerAllBuiltinSkills, Xjq→registerRememberSkill, Pjq→registerSettingsHelpSkill,
// fjq→registerKeybindingsSkill, Njq→registerVerifySkill, vjq→registerInitVerifiersSkill,
// kjq→registerDebugSkill, Cjq→registerBenchmarkSkill, hjq→registerSkillifySkill,
// cZ1→isChromeExtensionAvailable, jjq→registerChromeSkill
```

**Implementation Status (v2.1.38):**
| Skill | Function | Status |
|-------|----------|--------|
| keybindings-help | `fjq` | Active |
| debug | `kjq` | Active |
| claude-in-chrome | `jjq` | Active (conditional) |
| verify | `Njq` | Stub |
| init-verifiers | `vjq` | Stub |
| remember | `Xjq` | Stub |
| settings-help | `Pjq` | Stub |
| benchmark | `Cjq` | Stub |
| skillify | `hjq` | Stub |

---

## Skill Registry

The skill registry is stored in a Map (`Pt`) keyed by skill name:

```javascript
// Global state
Pt = new Map();       // Main skill registry (name → skill object)
aQ1 = new Map();      // Conditional skills awaiting activation
BkA = new Set();      // Activated conditional skill names
gF4 = new Set();      // Discovered skill directories
mkA = [];             // Skill change callbacks
```

### Registry Functions

| Function | Purpose |
|----------|---------|
| `iF4()` | Get all skills as array |
| `refreshSkillDirs` (vW1) | Reload skills from directories after file changes |
| `clearSkillCaches` (BP6) | Clear all skill-related caches |
| `registerSkillRefreshCallback` (lF4) | Register callback for skill changes |

---

## Design Rationale

### Why Multi-Source Loading?

**Alternatives considered:**
1. **Single source** - Only `.claude/skills/` → Rejected because it doesn't support organization-wide skills
2. **Config-based registration** - Explicitly list skills in config → Rejected because it requires manual maintenance

**The chosen approach** (managed → user → project) balances:
- **Discoverability** - Skills are automatically found without configuration
- **Flexibility** - Multiple sources allow layering (org → team → project)
- **Override capability** - Project skills can override user/managed skills

### Why Inode Deduplication?

Symlinks can cause the same file to appear multiple times in the loading path. Inode deduplication ensures:
- **No duplicate skills** in the registry
- **Correct precedence** - first source wins, later sources are skipped
- **Performance** - avoids loading/parsing the same file multiple times

### Why Conditional Activation?

Skills with `paths` only make sense when relevant files are touched:
- **Reduces context window usage** - skills not injected unless needed
- **Improves relevance** - only applicable skills appear in listings
- **Automatic workflow** - no manual enabling/disabling required