# Implementation Report - Skill System (Module 10)

## Overview

The Skill System is a mechanism for extending Claude Code's capabilities through reusable, prompt-based modules. Skills are Markdown files (`SKILL.md`) that define behavior instructions for the LLM. They support dynamic discovery from multiple directory hierarchies, conditional activation based on file path patterns, argument substitution, shell expansion, hook registration, and execution in isolated sub-agents (forking).

The system draws a clear boundary between **skill loading** (parsing and registering skill definitions from disk) and **skill execution** (generating prompt messages that drive LLM behavior). The `createSkillObject` function (dF4) is the central abstraction: it converts raw SKILL.md frontmatter + content into a runtime command object. All skill execution -- whether triggered by a user typing `/commit` or the LLM invoking the Skill tool -- flows through this object's `getPromptForCommand` method.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Skill System section)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations (Slash Commands section)

Key functions in this document:
- `loadSkills` (ukA) - Orchestrates discovery and loading of skills from all sources
- `loadSkillFromDir` (oQ1) - Parses all skills from a single `.claude/skills/` directory
- `createSkillObject` (dF4) - Creates the runtime command object from parsed skill metadata
- `parseSkillPaths` (ZEY) - Parses `paths:` frontmatter into normalized glob patterns
- `parseSkillHooks` (pF4) - Parses and Zod-validates `hooks:` frontmatter
- `isSkillFile` (bkA) - Detects case-insensitive SKILL.md filenames
- `deduplicateSkillFiles` (fEY) - Resolves SKILL.md vs. multiple .md file conflicts
- `getSkillName_fromSkillMd` (VEY) - Derives command name from SKILL.md path
- `getSkillName_fromMdFile` (NEY) - Derives command name from arbitrary .md path
- `getRelativePath` (cF4) - Computes namespace prefix from directory hierarchy
- `discoverProjectSkills` (vW1) - Dynamically reloads skills from file operation triggers
- `findSkillDirectories` (TW1) - Climbs directory tree to find `.claude/skills/` dirs
- `activateConditionalSkills` (EW1) - Path-pattern-based runtime skill activation
- `loadLegacyCommands` (vEY) - Loads deprecated `.claude/commands/` directory commands
- `getInodeId` (GEY) - Gets filesystem inode for deduplication of symlinked skills
- `clearSkillsCache` (BP6) - Clears all caches for skill reload
- `registerSkillChangeListener` (lF4) - Registers callbacks for skill updates
- `interpolateArguments` (Ej1) - Argument substitution in skill prompt text
- `executeShellExpansion` (Ma) - Executes embedded shell commands in skill content
- `registerPromptSkill` (Sj) - Registers a bundled (built-in) prompt skill
- `getBundledSkills` (nHq) - Returns all registered bundled skills

---

## Core Data Structures

### Skill Object Schema

Every skill -- whether loaded from disk, from a plugin, or registered as a built-in -- is represented as a command object with a uniform interface. The `createSkillObject` (dF4) function produces this structure for user-defined skills:

```
{
  type: "prompt"               // Always "prompt" for skills (never "local" or "local-jsx")
  name: string                 // Canonical command name (e.g., "commit", "namespace:review")
  description: string          // For display in command picker and Skill tool description
  hasUserSpecifiedDescription: boolean  // true if description came from frontmatter (not auto-generated)
  allowedTools: string[]       // Tool whitelist from "allowed-tools:" frontmatter
  argumentHint: string|undefined       // Hint text for the argument placeholder in UI
  argNames: string[]|undefined         // Named argument list from "arguments:" frontmatter
  whenToUse: string|undefined          // Guidance for when the LLM should auto-invoke this skill
  version: string|undefined            // Skill version for change tracking
  model: string|undefined              // Model override (resolves via t9() config lookup)
  disableModelInvocation: boolean      // If true, skill is user-only (not accessible to LLM)
  userInvocable: boolean               // If false, only LLM can invoke (not user directly)
  context: "fork"|undefined            // If "fork", runs in isolated sub-agent
  agent: string|undefined              // Agent type for forked execution (default: "general-purpose")
  paths: string[]|undefined            // Glob patterns for conditional activation
  contentLength: number                // Length of SKILL.md content in bytes
  source: string                       // Loading tier: "policySettings"|"userSettings"|"projectSettings"
  loadedFrom: string                   // "skills"|"commands_DEPRECATED"|"bundled"|"plugin"
  hooks: ParsedHooks|undefined         // Hook definitions from frontmatter
  skillRoot: string|undefined          // Base directory of the skill (for hook registration)
  isEnabled: () => boolean             // Always returns true for user-defined skills
  isHidden: boolean                    // !userInvocable (hidden from user-facing lists if model-only)
  progressMessage: "running"           // Fixed string for progress indicator
  userFacingName: () => string         // Returns displayName || name
  getPromptForCommand: async (args, ctx) => ContentBlock[]  // Main execution method
}
```

---

## Skill Loading Architecture

### Five-Tier Loading Hierarchy

Skills are loaded from five distinct sources in priority order (later sources can override earlier ones of the same name):

```
Priority (high → low):
┌─────────────────────────────────────┐  Source tier
│ 1. Managed Skills                   │  policySettings  (application install dir)
│    ~/.claude/skills/                │
├─────────────────────────────────────┤
│ 2. User Skills                      │  userSettings    (user home directory)
│    ~/[user home]/.claude/skills/    │  (only if userSettings permitted)
├─────────────────────────────────────┤
│ 3. Project Skills (explicit)        │  projectSettings (discovered project roots)
│    {project}/.claude/skills/        │  (only if projectSettings permitted)
├─────────────────────────────────────┤
│ 4. Project Skills (from CWD)        │  projectSettings (current working directory)
│    {cwd}/.claude/skills/            │  (only if projectSettings permitted)
├─────────────────────────────────────┤
│ 5. Legacy Commands                  │  from vEY()
│    {cwd}/.claude/commands/          │  (deprecated, backward compat)
└─────────────────────────────────────┘
```

Plus **bundled skills** (registered via `Sj`) and **plugin skills** (loaded via `B0A`) which are loaded separately and merged in `getAllCommands` (cZ).

### loadSkills (ukA) - Master Loading Function

**What it does:** Orchestrates the complete skill loading pipeline from all directory sources with inode-based deduplication.

**How it works:**

```javascript
// ============================================
// loadSkills - Master skill discovery and loading
// Location: chunks.134.mjs:2059-2092
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
    $ = qC(),
    O = qX("projectSettings") ? await Promise.all($.map((W) => oQ1(Wt(W, ".claude", "skills"), "projectSettings"))) : [],
    _ = await vEY(A),
    J = [...z, ...w, ...H.flat(), ...O.flat(), ..._],
    X = new Map, D = [];
    for (let { skill: W, filePath: G } of J) {
        if (W.type !== "prompt") continue;
        let f = GEY(G);
        if (f === null) { D.push(W); continue }
        let Z = X.get(f);
        if (Z !== void 0) {
            h(`Skipping duplicate skill '${W.name}' from ${W.source} (same file already loaded from ${Z})`);
            continue
        }
        X.set(f, W.source), D.push(W)
    }
    let j = J.length - D.length;
    if (j > 0) h(`Deduplicated ${j} skills (same file)`);
    let M = [], P = [];
    for (let W of D)
        if (W.type === "prompt" && W.paths && W.paths.length > 0 && !BkA.has(W.name)) P.push(W);
        else M.push(W);
    for (let W of P) aQ1.set(W.name, W);
    if (P.length > 0) h(`[skills] ${P.length} conditional skills stored (activated when matching files are touched)`);
    return h(`Loaded ${D.length} unique skills (...)`), M
});

// READABLE (for understanding):
loadSkills = memoized(async (toolUseContext) => {
    // 1. Determine paths for each loading tier
    let managedSkillsDir   = path.join(appInstallDir(), "skills");      // O8() = app install path
    let userSkillsDir      = path.join(userHomeDir(), ".claude", "skills");  // df() = home dir
    let projectSkillsDirs  = getProjectSkillDirs("skills", toolUseContext);  // FkA = multi-root project dirs

    // 2. Load from all tiers in parallel (with permission checks)
    let [managedSkills, userSkills, projectSkillsNested] = await Promise.all([
        loadSkillFromDir(managedSkillsDir, "policySettings"),
        isPermitted("userSettings") ? loadSkillFromDir(userSkillsDir, "userSettings") : Promise.resolve([]),
        isPermitted("projectSettings")
            ? Promise.all(projectSkillsDirs.map(dir => loadSkillFromDir(dir, "projectSettings")))
            : Promise.resolve([])
    ]);

    // 3. Load from additional CWD-based project roots
    let cwdProjectRoots = getProjectRoots();   // qC() = project roots from config
    let cwdProjectSkills = isPermitted("projectSettings")
        ? await Promise.all(cwdProjectRoots.map(root => loadSkillFromDir(path.join(root, ".claude", "skills"), "projectSettings")))
        : [];

    // 4. Load legacy commands (.claude/commands/)
    let legacyCommands = await loadLegacyCommands(toolUseContext);

    // 5. Flatten all skills into one array
    let allSkills = [...managedSkills, ...userSkills, ...projectSkillsNested.flat(), ...cwdProjectSkills.flat(), ...legacyCommands];

    // 6. Inode-based deduplication (handles symlinks and duplicate paths)
    let seenInodes = new Map();   // inode → source name
    let deduplicated = [];
    for (let { skill, filePath } of allSkills) {
        if (skill.type !== "prompt") continue;
        let inode = getInodeId(filePath);  // GEY: returns null on error
        if (inode === null) { deduplicated.push(skill); continue; }  // Can't dedup, include
        if (seenInodes.has(inode)) {
            debug(`Skipping duplicate skill '${skill.name}' from ${skill.source} (same file)`);
            continue;
        }
        seenInodes.set(inode, skill.source);
        deduplicated.push(skill);
    }

    // 7. Split into conditional (paths-based) vs unconditional skills
    let unconditional = [], conditional = [];
    for (let skill of deduplicated) {
        let isConditional = skill.type === "prompt" && skill.paths && skill.paths.length > 0
                         && !alreadyActivatedSkills.has(skill.name);
        if (isConditional) conditional.push(skill);
        else unconditional.push(skill);
    }

    // 8. Store conditional skills in the separate map (not returned yet)
    for (let skill of conditional) conditionalSkillsMap.set(skill.name, skill);

    return unconditional;   // Only unconditional skills are immediately active
});

// Mapping: ukA->loadSkills, oQ1->loadSkillFromDir, vEY->loadLegacyCommands, GEY->getInodeId, qX->isPermitted, FkA->getProjectSkillDirs, qC->getProjectRoots, df->userHomeDir, O8->appInstallDir, BkA->alreadyActivatedSkills, aQ1->conditionalSkillsMap
```

**Key design decisions:**

1. **Memoization**: `KA` (memoized) wraps `ukA` so the disk scan happens only once per session. Cache is cleared via `clearSkillsCache` (BP6) when files change.

2. **Inode deduplication**: `GEY(filePath)` resolves the file's inode number (via `fs.statSync(...).ino`). If two paths resolve to the same inode (e.g., a symlink and its target, or the same `.claude/skills/` appearing through multiple CWD ancestors), the second occurrence is skipped. This prevents duplicate skill definitions.

3. **Two-phase separation**: After deduplication, skills are split into "unconditional" (immediately active) and "conditional" (stored in `conditionalSkillsMap`, activated on file path matching). Only unconditional skills are returned from `loadSkills` -- conditional ones wait for `activateConditionalSkills` (EW1) to trigger.

4. **Permission gating**: `qX("userSettings")` and `qX("projectSettings")` check whether the session is permitted to access those directories. This supports policy-restricted environments where skill loading is limited to managed skills only.

---

## Parsing a Single Skills Directory

### loadSkillFromDir (oQ1)

**What it does:** Reads all subdirectories in a `.claude/skills/` directory, parses each `SKILL.md` file, and creates skill command objects.

**Complete frontmatter field mapping:**

| Frontmatter Key | Field | Default | Type | Description |
|-----------------|-------|---------|------|-------------|
| `description:` | description | Auto-generated from first heading | string | Human-readable description for command picker |
| `allowed-tools:` | allowedTools | [] | string or array | Tool whitelist (space/comma separated) |
| `user-invocable:` | userInvocable | true | boolean | If false, model-only (user can't invoke directly) |
| `disable-model-invocation:` | disableModelInvocation | false | boolean | If true, user-only (model can't invoke via Skill tool) |
| `model:` | model | undefined | string | Override model for this skill's execution |
| `context:` | executionContext | undefined | "fork" | If "fork", run in isolated sub-agent |
| `agent:` | agent | "general-purpose" | string | Agent type for forked execution |
| `hooks:` | hooks | undefined | object | Lifecycle hook definitions |
| `arguments:` | argNames | [] | string | Named argument names for `$argName` substitution |
| `argument-hint:` | argumentHint | undefined | string | UI hint text for argument placeholder |
| `when_to_use:` | whenToUse | undefined | string | LLM guidance for auto-invocation |
| `version:` | version | undefined | string | Version identifier |
| `name:` | displayName | undefined | string | Override display name (userFacingName) |
| `paths:` | paths | undefined | string | Glob patterns for conditional activation |

```javascript
// ============================================
// loadSkillFromDir - Parse all skills from a directory
// Location: chunks.134.mjs:1758-1820
// ============================================

// ORIGINAL (for source lookup):
async function oQ1(A, q) {
    let K = b1(), Y = [];
    try {
        let z = K.readdirSync(A);
        for (let w of z) try {
            if (w.isDirectory() || w.isSymbolicLink()) {
                let H = Wt(A, w.name), $ = Wt(H, "SKILL.md");
                try {
                    let O = K.readFileSync($, { encoding: "utf-8" }),
                        { frontmatter: _, content: J } = yD(O, $),
                        X = w.name,
                        D = _.description ?? vp(J, "Skill"),
                        j = Vh(_["allowed-tools"]),
                        M = _["user-invocable"] === void 0 ? !0 : bP6(_["user-invocable"]),
                        P = bP6(_["disable-model-invocation"]),
                        W = _.model === "inherit" ? void 0 : _.model ? t9(_.model) : void 0,
                        G = pF4(_, X),
                        f = _.context === "fork" ? "fork" : void 0,
                        Z = _.agent,
                        N = xu1(_.arguments),
                        T = ZEY(_);
                    Y.push({ skill: dF4({ skillName: X, displayName: _.name, description: D,
                        hasUserSpecifiedDescription: !!_.description, markdownContent: J,
                        allowedTools: j, argumentHint: _["argument-hint"], argumentNames: N,
                        whenToUse: _.when_to_use, version: _.version, model: W,
                        disableModelInvocation: P, userInvocable: M, source: q, baseDir: H,
                        loadedFrom: "skills", hooks: G, executionContext: f, agent: Z, paths: T }),
                        filePath: $ })
                } catch {}  // SKILL.md missing or unreadable: silently skip
            }
        } catch (H) { logError(H) }
    } catch (z) {
        // ENOENT/EACCES/EPERM: directory doesn't exist or not accessible
        if (z.code !== "ENOENT" && z.code !== "EACCES" && z.code !== "EPERM") logError(z)
    }
    return Y
}

// READABLE (for understanding):
async function loadSkillFromDir(baseDir, sourceTier) {
    let fs = getFs();
    let results = [];
    try {
        let entries = fs.readdirSync(baseDir);
        for (let entry of entries) {
            try {
                if (!entry.isDirectory() && !entry.isSymbolicLink()) continue;
                let skillDir = path.join(baseDir, entry.name);
                let skillMdPath = path.join(skillDir, "SKILL.md");
                try {
                    // Read and parse the SKILL.md file
                    let rawContent = fs.readFileSync(skillMdPath, { encoding: "utf-8" });
                    let { frontmatter, content } = parseFrontmatter(rawContent, skillMdPath);

                    // Extract all fields from frontmatter
                    let skillName = entry.name;                           // Directory name = command name
                    let description = frontmatter.description ?? autoExtractDescription(content, "Skill");
                    let allowedTools = parseToolList(frontmatter["allowed-tools"]);
                    let userInvocable = frontmatter["user-invocable"] === undefined ? true
                                      : parseBoolean(frontmatter["user-invocable"]);
                    let disableModelInvocation = parseBoolean(frontmatter["disable-model-invocation"]);
                    let model = frontmatter.model === "inherit" ? undefined
                               : frontmatter.model ? resolveModel(frontmatter.model) : undefined;
                    let hooks = parseAndValidateHooks(frontmatter, skillName);
                    let executionContext = frontmatter.context === "fork" ? "fork" : undefined;
                    let agentType = frontmatter.agent;
                    let argNames = parseArgumentNames(frontmatter.arguments);
                    let paths = parsePathPatterns(frontmatter);

                    results.push({
                        skill: createSkillObject({
                            skillName, displayName: frontmatter.name, description,
                            hasUserSpecifiedDescription: !!frontmatter.description,
                            markdownContent: content, allowedTools,
                            argumentHint: frontmatter["argument-hint"], argumentNames: argNames,
                            whenToUse: frontmatter.when_to_use, version: frontmatter.version,
                            model, disableModelInvocation, userInvocable, source: sourceTier,
                            baseDir: skillDir, loadedFrom: "skills", hooks,
                            executionContext, agent: agentType, paths
                        }),
                        filePath: skillMdPath
                    });
                } catch {} // SKILL.md not found or unreadable: silently skip this subdirectory
            } catch (entryErr) { logError(entryErr); }
        }
    } catch (dirErr) {
        // Silently ignore missing directories; log unexpected errors
        if (dirErr.code !== "ENOENT" && dirErr.code !== "EACCES" && dirErr.code !== "EPERM") {
            logError(dirErr);
        }
    }
    return results;
}

// Mapping: oQ1->loadSkillFromDir, yD->parseFrontmatter, vp->autoExtractDescription, Vh->parseToolList, bP6->parseBoolean, t9->resolveModel, pF4->parseAndValidateHooks, xu1->parseArgumentNames, ZEY->parsePathPatterns, dF4->createSkillObject, b1->getFs, Wt->path.join
```

**Design notes:**

1. **Silent SKILL.md miss**: The inner try-catch silently ignores any subdirectory that doesn't have a readable SKILL.md. This means non-skill subdirectories in `.claude/skills/` are harmlessly ignored.

2. **Symlink support**: Both directories and symlinks (`isSymbolicLink()`) are processed. This allows sharing skill definitions across projects via symlinks.

3. **`model === "inherit"`**: A special sentinel value that explicitly means "do NOT override the model" (as opposed to an absent field, which also means no override). This allows skills to explicitly opt into always inheriting the session model.

---

## Creating the Skill Object

### createSkillObject (dF4) - The Runtime Command Object

**What it does:** Converts raw parsed skill metadata into the runtime command object that the rest of the system uses. The most important part is the `getPromptForCommand` method, which performs argument substitution, SESSION_ID injection, shell expansion, and tool permission override.

```javascript
// ============================================
// createSkillObject - Build runtime skill command object
// Location: chunks.134.mjs:1682-1755
// ============================================

// ORIGINAL (for source lookup):
function dF4({ skillName: A, displayName: q, description: K, hasUserSpecifiedDescription: Y,
    markdownContent: z, allowedTools: w, argumentHint: H, argumentNames: $, whenToUse: O,
    version: _, model: J, disableModelInvocation: X, userInvocable: D, source: j, baseDir: M,
    loadedFrom: P, hooks: W, executionContext: G, agent: f, paths: Z }) {
    return {
        type: "prompt", name: A, description: K, hasUserSpecifiedDescription: Y,
        allowedTools: w, argumentHint: H, argNames: $.length > 0 ? $ : void 0, whenToUse: O,
        version: _, model: J, disableModelInvocation: X, userInvocable: D, context: G, agent: f,
        paths: Z, contentLength: z.length, isEnabled: () => !0, isHidden: !D, progressMessage: "running",
        userFacingName() { return q || A },
        source: j, loadedFrom: P, hooks: W, skillRoot: M,
        async getPromptForCommand(N, T) {
            let k = M ? `Base directory for this skill: ${M}\n\n${z}` : z;
            return k = Ej1(k, N, !0, $),
                   k = k.replace(/\$\{CLAUDE_SESSION_ID\}/g, U6()),
                   k = await Ma(k, { ...T, async getAppState() {
                       let y = await T.getAppState();
                       return { ...y, toolPermissionContext: { ...y.toolPermissionContext,
                           alwaysAllowRules: { ...y.toolPermissionContext.alwaysAllowRules, command: w } } }
                   } }, `/${A}`),
                   [{ type: "text", text: k }]
        }
    }
}

// READABLE (for understanding):
function createSkillObject({ skillName, displayName, description, hasUserSpecifiedDescription,
    markdownContent, allowedTools, argumentHint, argumentNames, whenToUse, version, model,
    disableModelInvocation, userInvocable, source, baseDir, loadedFrom, hooks, executionContext, agent, paths }) {
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
        isHidden: !userInvocable,             // Hidden from user-facing lists if model-only
        progressMessage: "running",
        source,
        loadedFrom,
        hooks,
        skillRoot: baseDir,

        userFacingName() {
            return displayName || skillName;   // `name:` frontmatter overrides directory name
        },

        // Main execution method: produces the LLM prompt text
        async getPromptForCommand(userArgs, toolUseContext) {
            // Step 1: Prepend base directory context if this is a project skill
            let promptText = baseDir
                ? `Base directory for this skill: ${baseDir}\n\n${markdownContent}`
                : markdownContent;

            // Step 2: Substitute $argName / $ARGUMENTS / $0,$1,... patterns with user args
            promptText = interpolateArguments(promptText, userArgs, /*appendIfUnused=*/true, argumentNames);

            // Step 3: Replace ${CLAUDE_SESSION_ID} with current session UUID
            promptText = promptText.replace(/\$\{CLAUDE_SESSION_ID\}/g, getSessionId());

            // Step 4: Execute embedded shell commands (!`cmd` and ``` !cmd ``` blocks)
            // Uses a MODIFIED toolUseContext that grants command permission for allowedTools
            promptText = await executeShellExpansion(promptText, {
                ...toolUseContext,
                async getAppState() {
                    let state = await toolUseContext.getAppState();
                    return {
                        ...state,
                        toolPermissionContext: {
                            ...state.toolPermissionContext,
                            alwaysAllowRules: {
                                ...state.toolPermissionContext.alwaysAllowRules,
                                command: allowedTools   // Auto-approve commands in allowedTools list
                            }
                        }
                    };
                }
            }, `/${skillName}`);

            return [{ type: "text", text: promptText }];
        }
    };
}

// Mapping: dF4->createSkillObject, Ej1->interpolateArguments, U6->getSessionId, Ma->executeShellExpansion
```

### getPromptForCommand - Four-Stage Prompt Processing Pipeline

The `getPromptForCommand` method applies four sequential transformations to the raw skill content before returning it to the caller:

#### Stage 1: Base Directory Injection

```
If skill has a baseDir (is a project skill):
  Insert "Base directory for this skill: /path/to/project/.claude/skills/commit\n\n"
  before the SKILL.md content.

Purpose: Lets the LLM know the relative root for all file paths mentioned in the skill.
```

#### Stage 2: Argument Interpolation (Ej1)

**What it does:** Substitutes user-provided arguments into the skill prompt using multiple placeholder syntaxes.

```javascript
// ============================================
// interpolateArguments - Multi-syntax argument substitution
// Location: chunks.87.mjs:1735-1754
// ============================================

// ORIGINAL (for source lookup):
function Ej1(A, q, K = !0, Y = []) {
    if (q === void 0 || q === null) return A;
    let z = u0A(q),  // Split args string into array
        w = A;
    // Named arg substitution: $argName → args[i] (from "arguments:" frontmatter order)
    for (let H = 0; H < Y.length; H++) {
        let $ = Y[H];
        if (!$) continue;
        A = A.replace(new RegExp(`\\$${$}(?![\\[\\w])`, "g"), z[H] ?? "")
    }
    // Indexed bracket syntax: $ARGUMENTS[0], $ARGUMENTS[1], ...
    A = A.replace(/\$ARGUMENTS\[(\d+)\]/g, (H, $) => { let O = parseInt($, 10); return z[O] ?? "" });
    // Simple positional: $0, $1, $2 (but not $word)
    A = A.replace(/\$(\d+)(?!\w)/g, (H, $) => { let O = parseInt($, 10); return z[O] ?? "" });
    // Full args string: $ARGUMENTS → the complete raw args
    A = A.replaceAll("$ARGUMENTS", q);
    // Fallback: if no substitution happened and args exist, append them
    if (A === w && K && q) A = A + `\n\nARGUMENTS: ${q}`;
    return A
}

// READABLE (for understanding):
function interpolateArguments(promptText, userArgs, appendIfUnused = true, argNames = []) {
    if (userArgs === undefined || userArgs === null) return promptText;
    let argArray = splitArgs(userArgs);    // u0A: splits "foo bar baz" → ["foo", "bar", "baz"]
    let originalText = promptText;

    // 1. Named substitution: $commitMessage → argArray[0], $branch → argArray[1], etc.
    //    (Order determined by "arguments:" frontmatter order)
    for (let i = 0; i < argNames.length; i++) {
        let name = argNames[i];
        if (!name) continue;
        // Use negative lookahead to avoid matching $argName[ or $argNameWord
        promptText = promptText.replace(new RegExp(`\\$${name}(?![\\[\\w])`, "g"), argArray[i] ?? "");
    }

    // 2. Indexed bracket: $ARGUMENTS[0] → argArray[0]
    promptText = promptText.replace(/\$ARGUMENTS\[(\d+)\]/g,
        (_, idx) => argArray[parseInt(idx, 10)] ?? "");

    // 3. Simple positional: $0 → argArray[0], $1 → argArray[1]
    promptText = promptText.replace(/\$(\d+)(?!\w)/g,
        (_, idx) => argArray[parseInt(idx, 10)] ?? "");

    // 4. Full args string: $ARGUMENTS → entire raw args string
    promptText = promptText.replaceAll("$ARGUMENTS", userArgs);

    // 5. Fallback: if no substitution occurred but args exist, append raw
    if (promptText === originalText && appendIfUnused && userArgs) {
        promptText = promptText + `\n\nARGUMENTS: ${userArgs}`;
    }

    return promptText;
}

// Mapping: Ej1->interpolateArguments, u0A->splitArgs, A->promptText, q->userArgs, K->appendIfUnused, Y->argNames
```

**Four argument placeholder formats:**

| Syntax | Example | Resolves To | Use Case |
|--------|---------|-------------|----------|
| `$argName` | `$commitMessage` | `argNames[i]`-th argument | Semantic named params (requires `arguments:` frontmatter) |
| `$ARGUMENTS[n]` | `$ARGUMENTS[0]` | n-th positional argument | Explicit positional access |
| `$n` | `$0`, `$1` | n-th positional argument | Shell-style positional params |
| `$ARGUMENTS` | `$ARGUMENTS` | Complete raw args string | Pass all args as single string |

**Fallback behavior:** If the prompt contains none of these placeholders but the user provided arguments, the system appends `\n\nARGUMENTS: {args}` to the end of the prompt. This ensures user input is never silently lost -- skills that don't use any placeholder syntax still receive the user's arguments, just appended to the end.

**Key insight:** The substitution is applied in the order shown, with `$ARGUMENTS` global replace happening last. This means if you have `$ARGUMENTS` in the prompt, it will NOT be pre-empted by the named/positional substitutions because `$ARGUMENTS[n]` and `$n` are more specific patterns.

#### Stage 3: Session ID Injection

```javascript
promptText = promptText.replace(/\$\{CLAUDE_SESSION_ID\}/g, getSessionId());
```

Replaces `${CLAUDE_SESSION_ID}` with the current session UUID. Useful for skills that need to track or reference the current session (e.g., for writing session-specific log files or creating unique identifiers).

#### Stage 4: Shell Expansion (Ma)

**What it does:** Executes shell commands embedded in the skill prompt and replaces their output inline. This allows skills to include dynamic data (git status, current date, file listings, etc.) directly in their prompts.

**Supported syntax:**

```
Inline backtick:  !`git log --oneline -10`
Triple backtick:  ```!
                  git status
                  ```
```

```javascript
// ============================================
// executeShellExpansion - Execute shell commands in skill content
// Location: chunks.81.mjs:601-622
// ============================================

// ORIGINAL (for source lookup):
async function Ma(A, q, K) {
    let Y = A;
    return await Promise.all([...A.matchAll(q09), ...A.matchAll(K09)].map(async (z) => {
        let w = z[1]?.trim();
        if (w) try {
            let H = await uX(qq, { command: w }, q, qR({ content: [] }), "");
            if (H.behavior !== "allow") throw h(...), new cx(`Bash command permission check failed for pattern "${z[0]}": ${H.message||"Permission denied"}`);
            let { data: $ } = await qq.call({ command: w }, q),
                O = await S$6(qq, $, A09()),
                _ = typeof O.content === "string" ? O.content : Jb7($.stdout, $.stderr);
            Y = Y.replace(z[0], _)
        } catch (H) { if (H instanceof cx) throw H; Y09(H, z[0]) }
    })), Y
}

// READABLE (for understanding):
async function executeShellExpansion(promptText, toolUseContext, commandPath) {
    let result = promptText;
    // q09 = /```!\s*\n?([\s\S]*?)\n?```/g  (triple-backtick blocks)
    // K09 = /(?<!\w|\$)!`([^`]+)`/g       (inline backtick)
    let matches = [...promptText.matchAll(tripleBacktickPattern), ...promptText.matchAll(inlineBacktickPattern)];

    await Promise.all(matches.map(async (match) => {
        let command = match[1]?.trim();
        if (!command) return;
        try {
            // 1. Permission check - honors the modified allowedTools in toolUseContext
            let permCheck = await checkBashPermission(BashTool, { command }, toolUseContext, emptyMessages, "");
            if (permCheck.behavior !== "allow") {
                throw new PermissionError(`Bash command permission check failed: ${permCheck.message || "Permission denied"}`);
            }

            // 2. Execute the shell command via BashTool
            let { data } = await BashTool.call({ command }, toolUseContext);

            // 3. Process output (tool output summary or raw stdout/stderr)
            let output = await summarizeToolOutput(BashTool, data, emptyConfig());
            let text = typeof output.content === "string" ? output.content
                      : formatShellOutput(data.stdout, data.stderr);

            // 4. Replace the shell expansion pattern with actual output
            result = result.replace(match[0], text);
        } catch (err) {
            if (err instanceof PermissionError) throw err;  // Re-throw permission errors
            handleShellExpansionError(err, match[0]);        // Format other errors as [Error: ...]
        }
    }));

    return result;
}

// Mapping: Ma->executeShellExpansion, q09->tripleBacktickPattern, K09->inlineBacktickPattern, uX->checkBashPermission, qq->BashTool, S$6->summarizeToolOutput, Jb7->formatShellOutput, Y09->handleShellExpansionError, cx->PermissionError
```

**Why shell expansion is powerful:** A skill can include dynamic context at execution time. For example:

```markdown
---
allowed-tools: Bash
---
You are a commit message assistant. Here is the current git state:

Current diff:
!`git diff --staged`

Recent commits:
!`git log --oneline -5`

Write a conventional commit message for these changes.
```

When `/commit` is invoked, the `!` expansions run first, capturing the actual staged diff and recent history. The LLM receives this data as part of its prompt rather than needing to call Bash tool itself -- which can save tool call round-trips and simplify the skill's logic.

**Security model for shell expansion:**
- The `toolUseContext` passed to `executeShellExpansion` has its `alwaysAllowRules.command` overridden with the skill's `allowedTools` list
- This means only commands matching the whitelist are auto-approved
- Commands not in the whitelist trigger the normal permission prompt
- Throwing `PermissionError` (cx) propagates out, preventing the skill from loading with unauthorized output

---

## Skill File Naming and Namespacing

### Skill Name Derivation

Skills get their command names from their directory/file paths. The naming logic handles two cases: `SKILL.md` files (canonical) and arbitrary `.md` files (legacy commands):

```javascript
// ============================================
// getSkillName_fromSkillMd (VEY) - Derive name from SKILL.md path
// Location: chunks.134.mjs:1853-1858
// ============================================

// ORIGINAL (for source lookup):
function VEY(A, q) {
    let K = f51(A),   // parent dir of SKILL.md → skill dir
        Y = f51(K),   // grandparent dir → "skills" parent
        z = uP6(K),   // basename of skill dir
        w = cF4(Y, q);  // relative path prefix
    return w ? `${w}:${z}` : z
}

// READABLE (for understanding):
function getSkillName_fromSkillMd(skillMdPath, baseDir) {
    let skillDir = parentDir(skillMdPath);    // /project/.claude/skills/nested/commit
    let parentOfSkillDir = parentDir(skillDir); // /project/.claude/skills/nested
    let dirName = basename(skillDir);          // "commit"
    let namespace = getRelativePath(parentOfSkillDir, baseDir);  // "nested" (or "")
    return namespace ? `${namespace}:${dirName}` : dirName;  // "nested:commit" or "commit"
}

// ============================================
// getSkillName_fromMdFile (NEY) - Derive name from arbitrary .md path
// Location: chunks.134.mjs:1861-1866
// ============================================

// ORIGINAL (for source lookup):
function NEY(A, q) {
    let K = uP6(A),
        Y = f51(A),
        z = K.replace(/\.md$/, ""),
        w = cF4(Y, q);
    return w ? `${w}:${z}` : z
}

// READABLE (for understanding):
function getSkillName_fromMdFile(mdFilePath, baseDir) {
    let fileName = basename(mdFilePath);              // "review.md"
    let fileDir = parentDir(mdFilePath);              // /project/.claude/commands/review
    let commandName = fileName.replace(/\.md$/, ""); // "review"
    let namespace = getRelativePath(fileDir, baseDir);
    return namespace ? `${namespace}:${commandName}` : commandName;  // "review" or "sub:review"
}

// ============================================
// getRelativePath (cF4) - Build ":" separated namespace from path hierarchy
// Location: chunks.134.mjs:1846-1851
// ============================================

// ORIGINAL (for source lookup):
function cF4(A, q) {
    let K = q.endsWith(VW1) ? q.slice(0, -1) : q;
    if (A === K) return "";
    let Y = A.slice(K.length + 1);
    return Y ? Y.split(VW1).join(":") : ""
}

// READABLE (for understanding):
function getRelativePath(dirPath, baseDir) {
    let normalizedBase = baseDir.endsWith(pathSep) ? baseDir.slice(0, -1) : baseDir;
    if (dirPath === normalizedBase) return "";
    let relativePart = dirPath.slice(normalizedBase.length + 1);
    // Convert path separators to colons for namespacing
    return relativePart ? relativePart.split(pathSep).join(":") : "";
}

// Mapping: VEY->getSkillName_fromSkillMd, NEY->getSkillName_fromMdFile, cF4->getRelativePath, f51->parentDir, uP6->basename, VW1->pathSep
```

**Namespacing examples:**

```
Directory structure:              Command name:
.claude/skills/commit/SKILL.md  →  "commit"
.claude/skills/git/push/SKILL.md → "git:push"
.claude/skills/review/SKILL.md  →  "review"

.claude/commands/commit.md      →  "commit"
.claude/commands/git/push.md    →  "git:push"
```

**Key insight:** The `:` separator in command names creates a flat namespace that encodes the directory hierarchy. `/git:push` is a valid slash command for a skill in `.claude/skills/git/push/`. This allows organizing skills into logical groups without creating separate registries.

---

## Skill File Disambiguation

### deduplicateSkillFiles (fEY)

**What it does:** When a skills directory contains both a `SKILL.md` file and other `.md` files in the same directory, `SKILL.md` takes priority. If only regular `.md` files exist, all of them become separate commands.

```javascript
// ============================================
// deduplicateSkillFiles - Resolve SKILL.md vs .md conflicts
// Location: chunks.134.mjs:1827-1843
// ============================================

// ORIGINAL (for source lookup):
function fEY(A) {
    let q = new Map;
    for (let Y of A) {
        let z = f51(Y.filePath), w = q.get(z) ?? [];
        w.push(Y), q.set(z, w)
    }
    let K = [];
    for (let [Y, z] of q) {
        let w = z.filter((H) => bkA(H.filePath));
        if (w.length > 0) {
            let H = w[0];
            if (w.length > 1) h(`Multiple skill files found in ${Y}, using ${uP6(H.filePath)}`);
            K.push(H)
        } else K.push(...z)
    }
    return K
}

// READABLE (for understanding):
function deduplicateSkillFiles(fileEntries) {
    // Group files by parent directory
    let byDirectory = new Map();
    for (let entry of fileEntries) {
        let dir = parentDir(entry.filePath);
        let group = byDirectory.get(dir) ?? [];
        group.push(entry);
        byDirectory.set(dir, group);
    }

    let result = [];
    for (let [dir, files] of byDirectory) {
        // Check if any file in this dir is a SKILL.md
        let skillMdFiles = files.filter(f => isSkillFile(f.filePath));
        if (skillMdFiles.length > 0) {
            // SKILL.md wins; use first match (warn if multiple SKILL.md somehow)
            if (skillMdFiles.length > 1) debug(`Multiple skill files found in ${dir}`);
            result.push(skillMdFiles[0]);
        } else {
            // No SKILL.md: include all .md files (each becomes a separate command)
            result.push(...files);
        }
    }
    return result;
}

// Mapping: fEY->deduplicateSkillFiles, bkA->isSkillFile, f51->parentDir, uP6->basename
```

**Key insight:** This function is used in `loadLegacyCommands` (vEY) when loading from `.claude/commands/`. In that context, a directory can contain either a `SKILL.md` (one skill per directory) or multiple `.md` files (one skill per file). The deduplication logic cleanly handles both conventions without requiring a separate configuration flag.

---

## Path Patterns and Conditional Skills

### parsePathPatterns (ZEY)

**What it does:** Parses the `paths:` frontmatter field into a normalized array of glob patterns, stripping trailing `/**` patterns.

```javascript
// ============================================
// parsePathPatterns - Parse and normalize conditional activation globs
// Location: chunks.134.mjs:1673-1679
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
function parsePathPatterns(frontmatter) {
    if (!frontmatter.paths || typeof frontmatter.paths !== "string") return undefined;
    let patterns = splitLines(frontmatter.paths)  // F76: split by newlines/commas
        .map(pattern => pattern.endsWith("/**") ? pattern.slice(0, -3) : pattern)
        .filter(pattern => pattern.length > 0);
    // If all patterns collapsed to "**" (match everything), treat as unconditional
    if (patterns.length === 0 || patterns.every(p => p === "**")) return undefined;
    return patterns;
}

// Mapping: ZEY->parsePathPatterns, F76->splitLines
```

**Why strip `/**`:** The path matching library (`ignores` / `UF4`) uses gitignore-style patterns. A pattern like `src/**` means "any file under src/". The `/**` suffix would prevent the base directory itself from matching, so it's stripped to `src` which matches both the directory and any file within it.

**Conditional skills example:**

```yaml
# .claude/skills/react-helper/SKILL.md
---
description: Helper for React component development
paths: |
  src/components/**
  src/pages/**
---
...
```

This skill only activates when the user edits files in `src/components/` or `src/pages/`. Until then, it remains in `conditionalSkillsMap` and doesn't appear in the command list.

### activateConditionalSkills (EW1)

**What it does:** Checks modified file paths against the patterns of all pending conditional skills and moves matching skills from `conditionalSkillsMap` to `activeSkillsMap`.

```javascript
// ============================================
// activateConditionalSkills - Path-pattern-based runtime skill activation
// Location: chunks.134.mjs:1996-2025
// ============================================

// ORIGINAL (for source lookup):
function EW1(A, q) {
    if (aQ1.size === 0) return [];
    let K = [];
    for (let [Y, z] of aQ1) {
        if (z.type !== "prompt" || !z.paths || z.paths.length === 0) continue;
        let w = UF4.default().add(z.paths);
        for (let H of A) {
            let $ = PEY(H) ? WEY(q, H) : H;
            if (w.ignores($)) {
                Pt.set(Y, z), aQ1.delete(Y), BkA.add(Y), K.push(Y), h(`[skills] Activated conditional skill '${Y}' (matched path: ${$})`);
                break
            }
        }
    }
    if (K.length > 0) {
        c("tengu_dynamic_skills_changed", { source: "conditional_paths", ... });
        for (let Y of mkA) try { Y() } catch (z) { logError(z) }
    }
    return K
}

// READABLE (for understanding):
function activateConditionalSkills(modifiedPaths, workingDir) {
    if (conditionalSkillsMap.size === 0) return [];
    let activatedNames = [];

    for (let [skillName, skill] of conditionalSkillsMap) {
        if (skill.type !== "prompt" || !skill.paths || skill.paths.length === 0) continue;

        // Build a gitignore-style path matcher for this skill's patterns
        let matcher = createIgnoreMatcher().add(skill.paths);   // UF4 = 'ignore' library

        for (let filePath of modifiedPaths) {
            // Normalize absolute paths to relative (for gitignore-style matching)
            let normalizedPath = isAbsolutePath(filePath) ? makeRelative(workingDir, filePath) : filePath;

            if (matcher.ignores(normalizedPath)) {
                // Activate: move from conditional to active map
                activeSkillsMap.set(skillName, skill);
                conditionalSkillsMap.delete(skillName);
                activatedSkillsSet.add(skillName);   // Remember: never re-deactivate
                activatedNames.push(skillName);
                debug(`[skills] Activated conditional skill '${skillName}' (matched path: ${normalizedPath})`);
                break;   // One match is enough; check next skill
            }
        }
    }

    if (activatedNames.length > 0) {
        telemetry("tengu_dynamic_skills_changed", { source: "conditional_paths", ... });
        notifySkillChangeListeners();  // mkA callbacks
    }

    return activatedNames;
}

// Mapping: EW1->activateConditionalSkills, aQ1->conditionalSkillsMap, Pt->activeSkillsMap, BkA->activatedSkillsSet, mkA->skillChangeListeners, UF4->ignoreMatcher, PEY->isAbsolutePath, WEY->makeRelative
```

**Key insight:** Once activated, a conditional skill stays active for the entire session (`BkA.add(Y)` prevents it from being re-deactivated). There's no mechanism to deactivate a skill after it's been activated. This is intentional: if you've touched a file that matches a skill's patterns, the skill becomes relevant for your entire workflow, not just for that specific file edit.

**When is this called?** The `EW1` function is triggered from the tool execution infrastructure. When an `Edit`, `Write`, or `MultiEdit` tool call modifies a file, the path is fed to `activateConditionalSkills` before the tool execution completes. This means new skills can become available mid-conversation as the user edits their codebase.

---

## Dynamic Skill Discovery

### discoverProjectSkills (vW1)

**What it does:** Reloads skills from a list of project skill directories in response to file system changes (e.g., when the user creates or edits a SKILL.md file during a session).

```javascript
// ============================================
// discoverProjectSkills - Dynamic reload from file operation triggers
// Location: chunks.134.mjs:1964-1990
// ============================================

// ORIGINAL (for source lookup):
async function vW1(A) {
    if (A.length === 0) return;
    let q = new Set(Pt.keys()),
        K = await Promise.all(A.map((z) => oQ1(z, "projectSettings")));
    for (let z = K.length - 1; z >= 0; z--)
        for (let { skill: w } of K[z] ?? [])
            if (w.type === "prompt") Pt.set(w.name, w);
    let Y = K.flat().length;
    if (Y > 0) {
        let z = [...Pt.keys()].filter((w) => !q.has(w));
        if (z.length > 0) c("tengu_dynamic_skills_changed", { source: "file_operation", ... })
    }
    for (let z of mkA) try { z() } catch (w) { logError(w) }
}

// READABLE (for understanding):
async function discoverProjectSkills(skillDirectories) {
    if (skillDirectories.length === 0) return;

    let existingSkillNames = new Set(activeSkillsMap.keys());

    // Reload from all specified directories in parallel
    let skillResults = await Promise.all(
        skillDirectories.map(dir => loadSkillFromDir(dir, "projectSettings"))
    );

    // Apply in reverse order (later directories override earlier ones)
    for (let i = skillResults.length - 1; i >= 0; i--) {
        for (let { skill } of skillResults[i] ?? []) {
            if (skill.type === "prompt") {
                activeSkillsMap.set(skill.name, skill);  // Upsert: creates or overwrites
            }
        }
    }

    let totalLoaded = skillResults.flat().length;
    if (totalLoaded > 0) {
        let newNames = [...activeSkillsMap.keys()].filter(name => !existingSkillNames.has(name));
        if (newNames.length > 0) {
            telemetry("tengu_dynamic_skills_changed", { source: "file_operation", ... });
        }
    }

    notifySkillChangeListeners();  // Trigger UI refresh
}

// Mapping: vW1->discoverProjectSkills, oQ1->loadSkillFromDir, Pt->activeSkillsMap, mkA->skillChangeListeners
```

### findSkillDirectories (TW1)

**What it does:** Finds all `.claude/skills/` directories from a list of modified file paths by climbing the directory tree.

```javascript
// ============================================
// findSkillDirectories - Climb dir tree to find .claude/skills/ dirs
// Location: chunks.134.mjs:1945-1961
// ============================================

// ORIGINAL (for source lookup):
function TW1(A, q) {
    let K = b1(),
        Y = q.endsWith(VW1) ? q.slice(0, -1) : q,
        z = [];
    for (let w of A) {
        let H = f51(w);
        while (H.startsWith(Y + VW1)) {
            let $ = Wt(H, ".claude", "skills");
            if (!gF4.has($)) try {
                K.statSync($), z.push($), gF4.add($)
            } catch {}
            let O = f51(H);
            if (O === H) break;
            H = O
        }
    }
    return z.sort((w, H) => H.split(VW1).length - w.split(VW1).length)
}

// READABLE (for understanding):
function findSkillDirectories(modifiedFilePaths, workingDir) {
    let fs = getFs();
    let normalizedWorkDir = workingDir.endsWith(pathSep) ? workingDir.slice(0, -1) : workingDir;
    let found = [];

    for (let filePath of modifiedFilePaths) {
        let currentDir = parentDir(filePath);

        // Climb up the directory tree (staying within working directory bounds)
        while (currentDir.startsWith(normalizedWorkDir + pathSep)) {
            let skillsDir = path.join(currentDir, ".claude", "skills");

            // Only check each directory once per session (cached in gF4)
            if (!checkedSkillsDirs.has(skillsDir)) {
                try {
                    fs.statSync(skillsDir);  // Does the directory exist?
                    found.push(skillsDir);
                    checkedSkillsDirs.add(skillsDir);
                } catch {}  // Directory doesn't exist; skip
            }

            let parentDirectory = parentDir(currentDir);
            if (parentDirectory === currentDir) break;  // Reached filesystem root
            currentDir = parentDirectory;
        }
    }

    // Sort by depth descending (deepest paths first = most specific first)
    return found.sort((a, b) => b.split(pathSep).length - a.split(pathSep).length);
}

// Mapping: TW1->findSkillDirectories, gF4->checkedSkillsDirs, f51->parentDir, b1->getFs, Wt->path.join, VW1->pathSep
```

**Key insight:** Depth-first sorting (deepest directories first) ensures that the most specific skills (closest to the modified file) are loaded before more general ones. When the same skill name exists in both `project/.claude/skills/` and a subdirectory's `.claude/skills/`, the subdirectory version wins.

---

## Legacy Commands Loading

### loadLegacyCommands (vEY)

**What it does:** Loads skills from the deprecated `.claude/commands/` directory structure. This was the original location for custom commands before the SKILL.md convention was introduced.

**Key differences from SKILL.md loading:**
- Loads individual `.md` files directly (not directory-based)
- `loadedFrom` is set to `"commands_DEPRECATED"` instead of `"skills"`
- `baseDir` is set only if the file is a SKILL.md (for namespace resolution); otherwise `undefined`
- `paths` is always `undefined` (no conditional activation support)
- Uses `deduplicateSkillFiles` (fEY) to handle the case where a directory contains both SKILL.md and other .md files

```javascript
// ============================================
// loadLegacyCommands - Load deprecated .claude/commands/ directory
// Location: chunks.134.mjs:1873-1934
// ============================================

// ORIGINAL (for source lookup):
async function vEY(A) {
    try {
        let q = await Qp("commands", A),  // Qp: scans .claude/commands/ directories
            K = fEY(q),  // deduplicate: SKILL.md wins over .md files in same dir
            Y = [];
        for (let { baseDir: z, filePath: w, frontmatter: H, content: $, source: O } of K) try {
            let _ = H.description ?? vp($, "Custom command"),
                J = Vh(H["allowed-tools"]),
                X = H["user-invocable"] === void 0 ? !0 : bP6(H["user-invocable"]),
                D = bP6(H["disable-model-invocation"]),
                j = H.model === "inherit" ? void 0 : H.model ? t9(H.model) : void 0,
                M = H.context === "fork" ? "fork" : void 0,
                P = H.agent,
                G = bkA(w) ? f51(w) : void 0,  // baseDir only for SKILL.md files
                f = TEY({ baseDir: z, filePath: w, frontmatter: H, content: $, source: O }),
                Z = pF4(H, f),
                N = xu1(H.arguments);
            Y.push({ skill: dF4({ skillName: f, displayName: void 0,
                description: _, hasUserSpecifiedDescription: !!H.description,
                markdownContent: $, allowedTools: J, argumentHint: H["argument-hint"],
                argumentNames: N, whenToUse: H.when_to_use, version: H.version, model: j,
                disableModelInvocation: D, userInvocable: X, source: O,
                baseDir: G, loadedFrom: "commands_DEPRECATED",  // Key difference
                hooks: Z, executionContext: M, agent: P, paths: void 0 }),
                filePath: w })
        } catch (_) { logError(_) }
        return Y
    } catch (q) { return logError(q), [] }
}

// READABLE (for understanding):
async function loadLegacyCommands(toolUseContext) {
    try {
        // Scan all .claude/commands/ directories (via Qp file scanner)
        let commandFiles = await scanCommandsDir("commands", toolUseContext);
        let deduplicated = deduplicateSkillFiles(commandFiles);  // SKILL.md wins
        let skills = [];
        for (let { baseDir, filePath, frontmatter, content, source } of deduplicated) {
            try {
                let commandName = deriveCommandName({ baseDir, filePath, frontmatter, content, source });
                let skillBaseDir = isSkillFile(filePath) ? parentDir(filePath) : undefined;  // Only for SKILL.md
                skills.push({
                    skill: createSkillObject({
                        skillName: commandName,
                        displayName: undefined,     // Legacy: no display name override
                        loadedFrom: "commands_DEPRECATED",  // Marks as legacy
                        paths: undefined,           // No conditional activation
                        baseDir: skillBaseDir,      // Set only for SKILL.md files
                        // ... (other fields same as loadSkillFromDir)
                    }),
                    filePath
                });
            } catch (err) { logError(err); }
        }
        return skills;
    } catch (err) { logError(err); return []; }
}

// Mapping: vEY->loadLegacyCommands, Qp->scanCommandsDir, fEY->deduplicateSkillFiles, TEY->deriveCommandName, bkA->isSkillFile
```

---

## Hook Parsing

### parseSkillHooks (pF4)

**What it does:** Parses and Zod-validates the `hooks:` frontmatter object. Returns a typed `ParsedHooks` object or `undefined` if no hooks or invalid hooks.

```javascript
// ============================================
// parseSkillHooks - Parse and validate skill hook definitions
// Location: chunks.134.mjs:1663-1670
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
    let result = HookSchema.safeParse(frontmatter.hooks);   // Xk = Zod schema
    if (!result.success) {
        debug(`Invalid hooks in skill '${skillName}': ${result.error.message}`);
        return undefined;   // Silently ignore invalid hooks (don't break skill loading)
    }
    return result.data;
}

// Mapping: pF4->parseSkillHooks, Xk->HookSchema
```

**Key insight:** Hook parsing uses `safeParse` (not `parse`), so schema validation errors don't crash skill loading. Skills with malformed hooks still load -- they just don't have hooks registered. This graceful degradation prevents a typo in the `hooks:` block from breaking an otherwise valid skill.

**Hook definition structure in SKILL.md:**

```yaml
hooks:
  PreToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: "echo 'About to run bash'"
  PostToolUse:
    - matcher: ""
      hooks:
        - type: prompt
          prompt: "Verify the output looks correct"
```

---

## Bundled Skill Registration

### registerPromptSkill (Sj) and getBundledSkills (nHq)

**What they do:** Built-in skills (shipped with the Claude Code binary) are registered via `Sj` during initialization and retrieved via `nHq`. This is a separate pathway from file-based skill loading.

```javascript
// ============================================
// registerPromptSkill - Register a built-in bundled skill
// Location: chunks.166.mjs:1795-1820
// ============================================

// ORIGINAL (for source lookup):
function Sj(A) {
    let q = {
        type: "prompt", name: A.name, description: A.description, hasUserSpecifiedDescription: !0,
        allowedTools: A.allowedTools ?? [], argumentHint: A.argumentHint, whenToUse: A.whenToUse,
        model: A.model, disableModelInvocation: A.disableModelInvocation ?? !1,
        userInvocable: A.userInvocable ?? !0, contentLength: 0, source: "bundled", loadedFrom: "bundled",
        hooks: A.hooks, context: A.context, agent: A.agent, isEnabled: A.isEnabled ?? (() => !0),
        isHidden: !(A.userInvocable ?? !0), progressMessage: "running",
        userFacingName: () => A.name, getPromptForCommand: A.getPromptForCommand
    };
    iHq.push(q)
}

// READABLE (for understanding):
function registerPromptSkill(config) {
    let bundledSkill = {
        type: "prompt",
        name: config.name,
        description: config.description,
        hasUserSpecifiedDescription: true,   // Bundled skills always have explicit descriptions
        allowedTools: config.allowedTools ?? [],
        argumentHint: config.argumentHint,
        whenToUse: config.whenToUse,
        model: config.model,
        disableModelInvocation: config.disableModelInvocation ?? false,
        userInvocable: config.userInvocable ?? true,
        contentLength: 0,                    // Bundled: no disk content to measure
        source: "bundled",
        loadedFrom: "bundled",
        hooks: config.hooks,
        context: config.context,
        agent: config.agent,
        isEnabled: config.isEnabled ?? (() => true),
        isHidden: !(config.userInvocable ?? true),
        progressMessage: "running",
        userFacingName: () => config.name,   // No displayName override for bundled skills
        getPromptForCommand: config.getPromptForCommand   // Caller provides the prompt function
    };
    bundledSkillRegistry.push(bundledSkill);  // iHq
}

// getBundledSkills - Returns snapshot of registered bundled skills
function getBundledSkills() {
    return [...bundledSkillRegistry];  // iHq
}

// Mapping: Sj->registerPromptSkill, nHq->getBundledSkills, iHq->bundledSkillRegistry
```

**How bundled skills differ from file-based skills:**

| Aspect | File-based Skills (dF4) | Bundled Skills (Sj) |
|--------|------------------------|---------------------|
| Source | `.claude/skills/SKILL.md` | Binary code |
| `loadedFrom` | `"skills"` or `"commands_DEPRECATED"` | `"bundled"` |
| `source` | `"policySettings"` / `"userSettings"` / `"projectSettings"` | `"bundled"` |
| `contentLength` | Actual byte count of SKILL.md | Always 0 |
| `getPromptForCommand` | Generated from file content + arg interpolation + shell expansion | Caller-provided function |
| `hasUserSpecifiedDescription` | `!!frontmatter.description` | Always `true` |
| Argument interpolation | Yes (Ej1) | No (caller handles) |
| Shell expansion | Yes (Ma) | No (caller handles) |

---

## State Variables

The skill system maintains six module-level state variables:

| Variable | Obfuscated | Type | Description |
|----------|------------|------|-------------|
| `activeSkillsMap` | `Pt` | `Map<string, Skill>` | Currently active skills (name → skill object) |
| `conditionalSkillsMap` | `aQ1` | `Map<string, Skill>` | Conditional skills waiting for path activation |
| `activatedSkillsSet` | `BkA` | `Set<string>` | Names of skills that have been conditionally activated (never re-deactivated) |
| `skillChangeListeners` | `mkA` | `Array<Function>` | Callbacks notified when skills change |
| `checkedSkillsDirs` | `gF4` | `Set<string>` | Skill directories already checked for deduplication |
| `pathMatcherLib` | `UF4` | Module | The `ignore` library for gitignore-style matching |

**Cache invalidation:** `clearSkillsCache` (BP6) clears the memoization caches for `loadSkills` (ukA) and the legacy commands scanner (`Qp`), and resets `conditionalSkillsMap` and `activatedSkillsSet`. However, it does NOT clear `activeSkillsMap` (Pt) -- running skills remain active. This is intentional: `clearSkillsCache` is called when files change and the system needs to discover new/changed skills, but existing active skills should remain accessible.

---

## Skill Registry Internals

### getSkillRegistry (cZ) - The Unified Registry Getter

**What it does:** Aggregates skills from all sources into a unified registry, with memoization for performance.

**How it works:**
1. Loads from three main sources in parallel:
   - Skill directory commands (user/project skills)
   - Plugin commands (from installed plugins)
   - Bundled skills (first-party built-in skills)
2. Merges with additional skill sources:
   - User commands (non-skill commands)
   - Dynamic skills (from `@` mentions)
   - Built-in commands (hardcoded)
3. Filters by `isEnabled()`
4. Handles duplicate name resolution

```javascript
// ============================================
// getSkillRegistry - Unified skill aggregation
// Location: chunks.168.mjs:2292-2306
// ============================================

// ORIGINAL (for source lookup):
cZ = KA(async (A) => {
    let [{
        skillDirCommands: q,
        pluginSkills: K,
        bundledSkills: Y
    }, z, w] = await Promise.all([_9z(A), YK1(), O9z()]), H = iF4(), $ = [...Y, ...q, ...z, ...K, ...w, ...QBA()].filter((D) => D.isEnabled());
    if (H.length === 0) return $;
    let O = new Set($.map((D) => D.name)),
        _ = H.filter((D) => !O.has(D.name) && D.isEnabled());
    if (_.length === 0) return $;
    let J = new Set(QBA().map((D) => D.name)),
        X = $.findIndex((D) => J.has(D.name));
    if (X === -1) return [...$, ..._];
    return [...$.slice(0, X), ..._, ...$.slice(X)]
});

// READABLE (for understanding):
const getSkillRegistry = memoize(async (registryContext) => {
    // 1. Load from three main sources in parallel
    let [{
        skillDirCommands,    // Skills from .claude/skills/
        pluginSkills,        // Skills from plugins
        bundledSkills        // Built-in bundled skills
    }, userCommands, dynamicSkills] = await Promise.all([
        getSkillsFromDirs(registryContext),    // _9z
        loadPluginCommands(),                   // YK1
        getBundledDynamicSkills()               // O9z
    ]);

    // 2. Get additional skills from state
    let additionalSkills = getAdditionalSkillsFromState();  // iF4

    // 3. Merge all sources with priority order
    // Priority: bundled → skillDir → userCommands → plugin → dynamic → built-in
    let allSkills = [
        ...bundledSkills,
        ...skillDirCommands,
        ...userCommands,
        ...pluginSkills,
        ...dynamicSkills,
        ...getBuiltInCommands()  // QBA
    ].filter(skill => skill.isEnabled());

    // 4. Add additional skills (avoiding duplicates)
    if (additionalSkills.length === 0) return allSkills;

    let existingNames = new Set(allSkills.map(s => s.name));
    let uniqueAdditional = additionalSkills.filter(
        s => !existingNames.has(s.name) && s.isEnabled()
    );

    if (uniqueAdditional.length === 0) return allSkills;

    // 5. Insert additional skills before built-in commands
    let builtInNames = new Set(getBuiltInCommands().map(s => s.name));
    let insertIndex = allSkills.findIndex(s => builtInNames.has(s.name));

    if (insertIndex === -1) {
        return [...allSkills, ...uniqueAdditional];
    }

    return [
        ...allSkills.slice(0, insertIndex),
        ...uniqueAdditional,
        ...allSkills.slice(insertIndex)
    ];
});

// Mapping: cZ→getSkillRegistry, KA→memoize, _9z→getSkillsFromDirs,
// YK1→loadPluginCommands, O9z→getBundledDynamicSkills, iF4→getAdditionalSkillsFromState,
// QBA→getBuiltInCommands
```

**Why this approach:**
- **Parallel loading:** All sources load concurrently for performance
- **Priority ordering:** Earlier sources take precedence for duplicate names
- **Memoization:** `KA()` caches the result to avoid repeated filesystem access
- **Dynamic insertion:** Additional skills are inserted at the right position

### Loading Source Functions

The registry pulls from multiple sources, each with its own loader:

#### getSkillsFromDirs (_9z)

**What it does:** Loads skills from skill directories and plugin skills.

```javascript
// ============================================
// getSkillsFromDirs - Load from directories and plugins
// Location: chunks.168.mjs:2118-2137
// ============================================

// ORIGINAL (for source lookup):
async function _9z(A) {
    try {
        let [q, K] = await Promise.all([ukA(A).catch((z) => {
            return K1(z instanceof Error ? z : Error("Failed to load skill directory commands")), h("Skill directory commands failed to load, continuing without them"), []
        }), B0A().catch((z) => {
            return K1(z instanceof Error ? z : Error("Failed to load plugin skills")), h("Plugin skills failed to load, continuing without them"), []
        })]), Y = nHq();
        return h(`getSkills returning: ${q.length} skill dir commands, ${K.length} plugin skills, ${Y.length} bundled skills`), {
            skillDirCommands: q,
            pluginSkills: K,
            bundledSkills: Y
        }
    } catch (q) {
        return K1(q instanceof Error ? q : Error("Unexpected error loading skills")), h("Unexpected error in getSkills, returning empty"), {
            skillDirCommands: [],
            pluginSkills: [],
            bundledSkills: []
        }
    }
}

// READABLE (for understanding):
async function getSkillsFromDirs(registryContext) {
    try {
        // Load in parallel with error recovery
        let [skillDirCommands, pluginSkills] = await Promise.all([
            loadSkills(registryContext).catch(err => {
                logError(err);
                debug("Skill directory commands failed to load, continuing without them");
                return [];
            }),
            loadPluginSkills().catch(err => {
                logError(err);
                debug("Plugin skills failed to load, continuing without them");
                return [];
            })
        ]);

        // Get bundled skills (always available)
        let bundledSkills = getBundledSkills();  // nHq

        debug(`getSkills returning: ${skillDirCommands.length} skill dir commands, ${pluginSkills.length} plugin skills, ${bundledSkills.length} bundled skills`);

        return {
            skillDirCommands,
            pluginSkills,
            bundledSkills
        };
    } catch (err) {
        logError(err);
        debug("Unexpected error in getSkills, returning empty");
        return {
            skillDirCommands: [],
            pluginSkills: [],
            bundledSkills: []
        };
    }
}

// Mapping: _9z→getSkillsFromDirs, ukA→loadSkills, B0A→loadPluginSkills, nHq→getBundledSkills
```

**Key insight:** Each loader has its own error boundary. If one fails, others continue. This ensures partial functionality even when some skill sources are broken.

#### loadPluginCommands (YK1)

**What it does:** Loads commands from installed plugins.

```javascript
// ============================================
// loadPluginCommands - Load from plugins
// Location: chunks.87.mjs:2039
// ============================================

// READABLE (for understanding):
loadPluginCommands = memoize(async () => {
    let { enabled: plugins, errors } = await getEnabledPlugins();
    let commands = [];

    if (errors.length > 0) {
        debug(`Plugin loading errors: ${errors.map(e => e.message).join(", ")}`);
    }

    for (let plugin of plugins) {
        let seenFiles = new Set();

        // Load from default commands directory
        if (plugin.commandsPath) {
            try {
                let cmds = await loadCommandsFromDir(
                    plugin.commandsPath,
                    plugin.name,
                    plugin.source,
                    plugin.manifest,
                    plugin.path,
                    { isSkillMode: false },
                    seenFiles
                );
                commands.push(...cmds);
                if (cmds.length > 0) {
                    debug(`Loaded ${cmds.length} commands from plugin ${plugin.name} default directory`);
                }
            } catch (err) {
                debug(`Failed to load commands from plugin ${plugin.name}: ${err}`);
            }
        }

        // Load from custom command paths
        if (plugin.commandsPaths) {
            for (let cmdPath of plugin.commandsPaths) {
                // Similar loading logic...
            }
        }
    }

    return commands;
});
```

#### getBundledDynamicSkills (O9z)

**What it does:** Returns dynamically bundled skills based on eligibility.

```javascript
// ============================================
// getBundledDynamicSkills - Dynamic bundled skills
// Location: chunks.168.mjs:2110-2116
// ============================================

// ORIGINAL (for source lookup):
async function O9z() {
    try {
        return (await op1())?.eligible ? [ezq] : []
    } catch (A) {
        return []
    }
}

// READABLE (for understanding):
async function getBundledDynamicSkills() {
    try {
        let eligibility = await checkFeatureEligibility();
        return eligibility?.eligible ? [FEATURE_SKILL] : [];
    } catch (err) {
        return [];
    }
}
```

### Cache Invalidation

The registry uses memoization (`KA`) for performance. Caches are cleared when:

1. **Skills are reloaded** - `clearSkillsCache` (BP6) is called
2. **Registry refresh** - `bm()` clears all caches
3. **File changes detected** - Watcher triggers reload

```javascript
// ============================================
// Cache invalidation functions
// Location: chunks.168.mjs:2139-2145
// ============================================

// ORIGINAL (for source lookup):
function UBA() {
    cZ.cache?.clear?.(), hv.cache?.clear?.(), aO6.cache?.clear?.()
}

function bm() {
    UBA(), dO6(), EU7(), BP6()
}

// READABLE (for understanding):
function clearRegistryCaches() {
    getSkillRegistry.cache?.clear?.();
    getSkillsForLLMInvocation.cache?.clear?.();
    getSlashCommandSkills.cache?.clear?.();
}

function refreshAllSkills() {
    clearRegistryCaches();
    clearDynamicSkills();
    clearConditionalSkills();
    clearSkillsCache();
}

// Mapping: UBA→clearRegistryCaches, bm→refreshAllSkills
```

### Registry Context

The `ZO()` function provides context for registry operations:

```javascript
// ZO() returns a registry context object used by cZ and related functions
// The context includes:
// - Current working directory
// - Project roots
// - Permission settings
// - Tool use context (if available)
```

### Multi-Source Loading Priority

When skills from different sources have the same name, the priority is:

```
Priority (highest → lowest):
1. Bundled skills (built-in, first-party)
2. Skill directory commands (user/project .claude/skills/)
3. User commands (non-skill commands)
4. Plugin skills
5. Dynamic skills
6. Built-in commands (hardcoded)
```

**Why this order:**
- **Bundled first:** First-party skills are trusted and well-tested
- **User skills override plugins:** User customization takes precedence
- **Dynamic skills last:** These are discovered at runtime, not predefined

---

## Key Architectural Insights

### The Three-Map Architecture

The skill system uses three data structures to implement a progressive activation model:

```
                   At session start:
                   ┌────────────────────────────────┐
                   │  loadSkills() discovers all     │
                   │  SKILL.md files                 │
                   └────────────────┬───────────────┘
                                    │
              ┌─────────────────────┴────────────────────┐
              │                                          │
    Has paths: frontmatter?                      No paths: frontmatter
              │                                          │
              ▼                                          ▼
   ┌─────────────────────┐                  ┌─────────────────────┐
   │  conditionalSkillsMap│                  │   activeSkillsMap   │
   │  (aQ1)              │                  │   (Pt)              │
   │  Waiting for path   │                  │   Available now     │
   │  match              │                  │                     │
   └──────────┬──────────┘                  └─────────────────────┘
              │
    User edits a file matching paths:
              │
              ▼
   ┌─────────────────────┐     ┌─────────────────────┐
   │ activatedSkillsSet  │────▶│   activeSkillsMap   │
   │ (BkA)               │     │   (Pt)              │
   │ Prevents re-check   │     │   Now also active   │
   └─────────────────────┘     └─────────────────────┘
```

This architecture keeps the active command list small (only relevant skills visible) while ensuring skills become available exactly when needed. For a project with 50 skills where most are specific to particular subsystems, a developer working on frontend code never sees backend-specific skills cluttering their command picker.

### Prompt Engineering as Skill Definition

The entire skill system is built on a key abstraction: **skills are prompt templates, not code**. The SKILL.md file contains instructions for the LLM, not business logic. The execution infrastructure (argument substitution, shell expansion, hook registration, forked agents) exists to make these prompt templates more powerful and context-aware, but the core intelligence lives in the markdown content.

This has significant implications:
1. **Skills are easy to create**: Any user can write a SKILL.md without programming knowledge
2. **Skills are version-controlled**: Markdown files live naturally in git repositories
3. **Skills are reviewable**: The entire skill definition is human-readable
4. **Skills are portable**: A SKILL.md from one project can be dropped into another project's `.claude/skills/` directory
