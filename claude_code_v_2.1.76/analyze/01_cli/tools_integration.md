# CLI-Tools Integration

> How CLI flags flow into tool permission context and session tool set assembly

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Tools, State Management
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - CLI Module

Key functions in this document:
- `buildToolPermissionContext` (KJq) - Constructs tool permission context from CLI flags and config
- `assembleSessionToolSet` (YP6) - Assembles final tool set for session
- `getDefaultTools` (tD) - Returns built-in tool collection
- `filterToolsByRules` (hg1) - Filters tools by permission rules

---

## Overview

The CLI layer integrates with the tools system through a multi-stage pipeline:

1. **Flag Parsing** → CLI arguments (`--allowed-tools`, `--disallowed-tools`, `--tools`) parsed by Commander
2. **Context Building** → `buildToolPermissionContext` (KJq) merges CLI flags with config and org policies
3. **Tool Discovery** → `getDefaultTools` (tD) retrieves built-in tools
4. **Filtering & Assembly** → `assembleSessionToolSet` (YP6) produces final available tool set

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     CLI → TOOLS INTEGRATION PIPELINE                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────┐    ┌───────────────────┐    ┌──────────────────┐     │
│  │   CLI Flags      │    │   Config Sources  │    │   Org Policies   │     │
│  │  --allowed-tools │    │   user.json       │    │   enterprise     │     │
│  │  --disallowed-   │    │   project.json    │    │   managed        │     │
│  │  --tools         │    │   --settings      │    │                  │     │
│  └────────┬─────────┘    └─────────┬─────────┘    └────────┬─────────┘     │
│           │                        │                       │               │
│           └────────────────────────┼───────────────────────┘               │
│                                    ▼                                       │
│                    ┌───────────────────────────────┐                       │
│                    │  buildToolPermissionContext   │                       │
│                    │         (KJq)                 │                       │
│                    │   chunks.172.mjs:2252         │                       │
│                    └───────────────┬───────────────┘                       │
│                                    │                                       │
│                                    ▼                                       │
│                    ┌───────────────────────────────┐                       │
│                    │   ToolPermissionContext       │                       │
│                    │   - mode: default/bypass      │                       │
│                    │   - alwaysAllowRules          │                       │
│                    │   - alwaysDenyRules           │                       │
│                    │   - additionalWorkingDirs     │                       │
│                    └───────────────┬───────────────┘                       │
│                                    │                                       │
│           ┌────────────────────────┼────────────────────────┐              │
│           │                        │                        │              │
│           ▼                        ▼                        ▼              │
│  ┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐          │
│  │ getDefaultTools │   │   MCP Tools     │   │ filterToolsBy   │          │
│  │      (tD)       │   │   (from MCP     │   │    Rules        │          │
│  │ chunks.141.mjs  │   │   servers)      │   │    (hg1)        │          │
│  └────────┬────────┘   └────────┬────────┘   └────────┬────────┘          │
│           │                     │                     │                   │
│           └─────────────────────┼─────────────────────┘                   │
│                                 ▼                                         │
│                 ┌───────────────────────────────┐                         │
│                 │  assembleSessionToolSet       │                         │
│                 │          (YP6)                │                         │
│                 │   chunks.141.mjs:1476         │                         │
│                 └───────────────┬───────────────┘                         │
│                                 │                                         │
│                                 ▼                                         │
│                 ┌───────────────────────────────┐                         │
│                 │   Available Tool Set          │                         │
│                 │   (passed to Agent Loop)      │                         │
│                 └───────────────────────────────┘                         │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. CLI Flag Parsing for Tools

### 1.1 Tool-Related CLI Flags

The following flags control tool availability:

| Flag | Type | Description |
|------|------|-------------|
| `--allowed-tools` | string[] | Tools to always allow (whitelist) |
| `--disallowed-tools` | string[] | Tools to always deny (blacklist) |
| `--tools` | string[] | Specify exact tool set (disables others) |
| `--dangerously-skip-permissions` | boolean | Bypass all permission checks |

**Source location:** `chunks.197.mjs:1017-1027`

```javascript
// ============================================
// Tool-related CLI flag definitions - Commander setup
// Location: chunks.197.mjs:1017-1027
// ============================================

// ORIGINAL (for source lookup):
.option("--allowedTools, --allowed-tools <tools...>", 'Comma or space-separated list of tool names to allow (e.g. "Bash(git:*) Edit")')
.option("--tools <tools...>", 'Specify the list of available tools from the built-in set. Use "" to disable all tools, "default" to use all tools, or specify tool names (e.g. "Bash,Edit,Read").')
.option("--disallowedTools, --disallowed-tools <tools...>", 'Comma or space-separated list of tool names to deny (e.g. "Bash(git:*) Edit")')
.option("--dangerously-skip-permissions", "Bypass all permission checks. Recommended only for sandboxes with no internet access.", () => !0)

// READABLE (for understanding):
.option("--allowed-tools <tools...>",
    'Comma or space-separated list of tool names to allow (e.g. "Bash(git:*) Edit")')
.option("--tools <tools...>",
    'Specify exact tool set. Use "" to disable all, "default" for all tools, or list names.')
.option("--disallowed-tools <tools...>",
    'Comma or space-separated list of tool names to deny')
.option("--dangerously-skip-permissions",
    "Bypass all permission checks (dangerous!)")

// Mapping: allowedTools→allowedToolsCli, disallowedTools→disallowedToolsCli, tools→baseToolsCli
```

### 1.2 Flag Extraction in Action Handler

**Source location:** `chunks.197.mjs:1032-1039`

```javascript
// ============================================
// CLI flag extraction - Action handler destructuring
// Location: chunks.197.mjs:1032-1039
// ============================================

// ORIGINAL (for source lookup):
let {
    debug: $ = !1,
    debugToStderr: O = !1,
    dangerouslySkipPermissions: _,
    allowDangerouslySkipPermissions: J = !1,
    tools: X = [],
    allowedTools: D = [],
    disallowedTools: j = [],
    mcpConfig: M = [],
    permissionMode: P,
    addDir: W = [],
    ...
} = H,

// READABLE (for understanding):
let {
    dangerouslySkipPermissions,
    allowDangerouslySkipPermissions = false,
    tools: baseToolsCli = [],              // --tools flag
    allowedTools: allowedToolsCli = [],    // --allowed-tools flag
    disallowedTools: disallowedToolsCli = [], // --disallowed-tools flag
    permissionMode,
    addDir: additionalDirectories = [],
    ...
} = options;

// Mapping: X→baseToolsCli, D→allowedToolsCli, j→disallowedToolsCli, _→dangerouslySkipPermissions
```

---

## 2. buildToolPermissionContext (KJq)

**What it does:** Merges CLI flags, config files, and organizational policies into a unified `ToolPermissionContext` object that governs all tool access decisions during the session.

**Location:** `chunks.172.mjs:2252-2311`

### 2.1 Function Signature

```javascript
// ============================================
// buildToolPermissionContext - Main permission context builder
// Location: chunks.172.mjs:2252-2311
// ============================================

// ORIGINAL (for source lookup):
function KJq({
    allowedToolsCli: A,
    disallowedToolsCli: q,
    baseToolsCli: K,
    permissionMode: Y,
    allowDangerouslySkipPermissions: z,
    addDirs: w
}) {
    let H = hd(A),
        $ = hd(q);
    if (K && K.length > 0) {
        let Z = Szz(K),
            N = new Set(Z),
            k = rRA().filter((y) => !N.has(y));
        $ = [...$, ...k]
    }
    let O = [],
        _ = new Map,
        J = process.env.PWD;
    if (J && J !== y8() && hzz({
            originalCwd: y8(),
            processPwd: J
        })) _.set(J, {
        path: J,
        source: "session"
    });
    let X = i2("tengu_disable_bypass_permissions_mode"),
        D = C8() || {},
        j = D.permissions?.disableBypassPermissionsMode === "disable",
        M = (Y === "bypassPermissions" || z) && !X && !j,
        P = Q76(),
        W = [],
        G = AJq({
            mode: Y,
            additionalWorkingDirectories: _,
            alwaysAllowRules: {
                cliArg: H
            },
            alwaysDenyRules: {
                cliArg: $
            },
            alwaysAskRules: {},
            isBypassPermissionsModeAvailable: M
        }, P),
        f = [...D.permissions?.additionalDirectories || [], ...w];
    for (let Z of f) {
        let N = cG1(Z, G);
        if (N.resultType === "success") G = a2(G, {
            type: "addDirectories",
            directories: [N.absolutePath],
            destination: "cliArg"
        });
        else if (N.resultType !== "alreadyInWorkingDirectory" && N.resultType !== "pathNotFound") O.push(lG1(N))
    }
    return {
        toolPermissionContext: G,
        warnings: O,
        dangerousPermissions: W
    }
}

// READABLE (for understanding):
function buildToolPermissionContext({
    allowedToolsCli,        // CLI --allowed-tools values
    disallowedToolsCli,     // CLI --disallowed-tools values
    baseToolsCli,           // CLI --tools values (restricts available tools)
    permissionMode,         // Permission mode (default, acceptEdits, plan, bypassPermissions)
    allowDangerouslySkipPermissions,  // Whether bypass is allowed
    addDirs                 // Additional directories from --add-dir
}) {
    // Step 1: Parse allow/deny tool patterns
    let parsedAllowedTools = parseToolPatterns(allowedToolsCli);
    let parsedDisallowedTools = parseToolPatterns(disallowedToolsCli);

    // Step 2: Handle --tools flag (restrictive mode)
    // If --tools is specified, all other tools are implicitly denied
    if (baseToolsCli && baseToolsCli.length > 0) {
        let specifiedTools = parseToolsList(baseToolsCli);
        let specifiedSet = new Set(specifiedTools);
        // All built-in tools NOT in the specified list are added to deny list
        let allToolNames = getAllBuiltinToolNames();
        let implicitDenyList = allToolNames.filter(name => !specifiedSet.has(name));
        parsedDisallowedTools = [...parsedDisallowedTools, ...implicitDenyList];
    }

    let warnings = [];
    let additionalWorkingDirectories = new Map();

    // Step 3: Handle PWD as additional directory if different from cwd
    let pwd = process.env.PWD;
    if (pwd && pwd !== getCwd() && isValidDirectory(pwd, getCwd())) {
        additionalWorkingDirectories.set(pwd, {
            path: pwd,
            source: "session"
        });
    }

    // Step 4: Check if bypass permissions mode is available
    // Can be disabled by: feature flag, org policy, or user config
    let disableBypassFeatureFlag = isFeatureEnabled("tengu_disable_bypass_permissions_mode");
    let userConfig = getUserConfig() || {};
    let orgDisabled = userConfig.permissions?.disableBypassPermissionsMode === "disable";

    let isBypassAvailable = (permissionMode === "bypassPermissions" || allowDangerouslySkipPermissions)
                            && !disableBypassFeatureFlag
                            && !orgDisabled;

    // Step 5: Build initial permission context
    let initialContext = getDefaultPermissionContext();
    let permissionContext = createPermissionContext({
        mode: permissionMode,
        additionalWorkingDirectories: additionalWorkingDirectories,
        alwaysAllowRules: {
            cliArg: parsedAllowedTools
        },
        alwaysDenyRules: {
            cliArg: parsedDisallowedTools
        },
        alwaysAskRules: {},
        isBypassPermissionsModeAvailable: isBypassAvailable
    }, initialContext);

    // Step 6: Process additional directories
    let allAdditionalDirs = [
        ...(userConfig.permissions?.additionalDirectories || []),
        ...addDirs
    ];

    for (let dir of allAdditionalDirs) {
        let result = resolveAndValidateDirectory(dir, permissionContext);
        if (result.resultType === "success") {
            permissionContext = updateContext(permissionContext, {
                type: "addDirectories",
                directories: [result.absolutePath],
                destination: "cliArg"
            });
        } else if (result.resultType !== "alreadyInWorkingDirectory"
                   && result.resultType !== "pathNotFound") {
            warnings.push(formatWarning(result));
        }
    }

    return {
        toolPermissionContext: permissionContext,
        warnings: warnings,
        dangerousPermissions: []  // Populated for audit logging
    };
}

// Mapping: KJq→buildToolPermissionContext, A→allowedToolsCli, q→disallowedToolsCli,
//          K→baseToolsCli, Y→permissionMode, z→allowDangerouslySkipPermissions, w→addDirs,
//          H→parsedAllowedTools, $→parsedDisallowedTools, G→permissionContext, O→warnings
```

### 2.2 Key Design Decisions

**Why `--tools` creates an implicit deny list:**

The `--tools` flag is restrictive by design. When specified:
1. Only the listed tools are available
2. All other built-in tools are automatically denied
3. This provides a simple "allowlist" mode without requiring users to list every tool they want to deny

**Why bypass mode requires multiple checks:**

Bypass permissions mode can be disabled by three different sources:
1. **Feature flag** (`tengu_disable_bypass_permissions_mode`) - Statsig-controlled rollout
2. **Org policy** - Enterprise administrators can enforce security
3. **User config** - Local `disableBypassPermissionsMode: "disable"`

This layered approach ensures enterprise security while allowing gradual feature rollout.

### 2.3 Invocation Point

**Source location:** `chunks.197.mjs:1274-1286`

```javascript
// ============================================
// buildToolPermissionContext invocation in main entry
// Location: chunks.197.mjs:1274-1286
// ============================================

// ORIGINAL (for source lookup):
let B1 = KJq({
        allowedToolsCli: D,
        disallowedToolsCli: j,
        baseToolsCli: X,
        permissionMode: G1,
        allowDangerouslySkipPermissions: J,
        addDirs: W
    }),
    A6 = B1.toolPermissionContext,
    {
        warnings: O6,
        dangerousPermissions: P6
    } = B1;

// READABLE (for understanding):
let permissionResult = buildToolPermissionContext({
    allowedToolsCli: allowedToolsCli,
    disallowedToolsCli: disallowedToolsCli,
    baseToolsCli: baseToolsCli,
    permissionMode: resolvedPermissionMode,
    allowDangerouslySkipPermissions: allowDangerouslySkipPermissions,
    addDirs: additionalDirectories
});

let toolPermissionContext = permissionResult.toolPermissionContext;
let { warnings, dangerousPermissions } = permissionResult;

// Mapping: B1→permissionResult, A6→toolPermissionContext, O6→warnings, P6→dangerousPermissions
```

---

## 3. getDefaultTools (tD)

**What it does:** Returns the collection of built-in tools available for the session, filtered by permission context and environment.

**Location:** `chunks.141.mjs:1505-1516`

### 3.1 Tool Collection Definition

```javascript
// ============================================
// kt - Built-in tool collection definition
// Location: chunks.141.mjs:1465-1467
// ============================================

// ORIGINAL (for source lookup):
function kt() {
    return [rj1, kW6, qq, WB, tS, Nj, i5, sW, vj, gd, Vj, bO, LW6, vW6, dW1, wt, kg1,
        ...jH() ? [tc4, $l4, Wl4, Ll4] : [],
        ...Hi4 ? [Hi4] : [],
        ...$i4 ? [$i4] : [],
        vRA,
        ...l8() ? [zhY(), whY(), HhY()] : [],
        ...wi4 ? [wi4] : [],
        ...zi4 ? [zi4] : [],
        cd, ld,
        ...Fp() ? [IW6] : []]
}

// READABLE (for understanding):
function getToolCollection() {
    return [
        // Core tools (always available)
        AgentTool,          // Task/Agent spawning
        TaskOutputTool,     // Async task output retrieval
        BashTool,           // Shell command execution
        GlobTool,           // File pattern matching
        GrepTool,           // Content search
        WebSearchTool,      // Web search
        FileReadTool,       // File reading
        EditTool,           // File editing
        FileWriteTool,      // File writing
        NotebookEditTool,   // Jupyter notebook editing
        WebFetchTool,       // URL content fetching
        BashOutputTool,     // Background bash output
        TaskCreateTool,     // Task creation (structured tasks)
        TaskStopTool,       // Stop running task
        TaskListTool,       // List tasks
        SkillTool,          // Skill invocation
        NotebookReadTool,   // Jupyter notebook reading

        // Conditional tools based on feature flags
        ...(isTeamsEnabled() ? [
            TeamCreateTool,
            TeamDeleteTool,
            SendMessageTool
        ] : []),

        // Dynamic tools (loaded from MCP/plugins)
        ...(mcpTool ? [mcpTool] : []),
        ...(pluginTool ? [pluginTool] : []),

        // Structured output tools
        StructuredOutputTool,
        ToolSearchTool,

        // Rewind tool (if enabled)
        ...(isRewindEnabled() ? [RewindTool] : [])
    ];
}

// Mapping: kt→getToolCollection, rj1→AgentTool, kW6→TaskOutputTool, qq→BashTool,
//          WB→GlobTool, tS→GrepTool, i5→FileReadTool, sW→EditTool, vj→FileWriteTool,
//          wt→SkillTool, cd→StructuredOutputTool, ld→ToolSearchTool
```

### 3.2 Default Tool Selection with Filtering

```javascript
// ============================================
// getDefaultTools - Filtered tool selection
// Location: chunks.141.mjs:1505-1516
// ============================================

// ORIGINAL (for source lookup):
$hY
tD = (A) => {
        if (J6(void 0)) return [qq];
        let q = new Set([cd.name, ld.name, cD]),
            K = kt().filter((w) => !q.has(w.name)),
            Y = hg1(K, A);
        if (A.mode === "delegate") Y = Y.filter((w) => R_6.has(w.name));
        if (J6(process.env.CLAUDE_REPL_MODE)) {
            if (Y.some((H) => H.name === y_6)) Y = Y.filter((H) => !rp7.has(H.name))
        }
        let z = Y.map((w) => w.isEnabled());
        return Y.filter((w, H) => z[H])
    }

// READABLE (for understanding):
const getDefaultTools = (permissionContext) => {
    // Edge case: if undefined context (test mode), return only Bash
    if (isTestMode(undefined)) return [BashTool];

    // Always exclude these from the default list (they're added separately)
    let alwaysExcludeSet = new Set([
        StructuredOutputTool.name,
        ToolSearchTool.name,
        STRUCTURED_OUTPUT_NAME
    ]);

    // Get all tools and exclude the always-exclude set
    let allTools = getToolCollection().filter(tool => !alwaysExcludeSet.has(tool.name));

    // Apply permission rules filtering
    let filteredTools = filterToolsByRules(allTools, permissionContext);

    // Delegate mode: restrict to DELEGATE_ALLOWED_TOOLS only
    if (permissionContext.mode === "delegate") {
        filteredTools = filteredTools.filter(tool =>
            DELEGATE_ALLOWED_TOOLS.has(tool.name)
        );
    }

    // REPL mode filtering: exclude REPL-conflicting tools
    if (isTestMode(process.env.CLAUDE_REPL_MODE)) {
        if (filteredTools.some(tool => tool.name === REPL_TOOL_NAME)) {
            filteredTools = filteredTools.filter(tool =>
                !REPL_CONFLICT_TOOLS.has(tool.name)
            );
        }
    }

    // Filter to only enabled tools
    let enabledFlags = filteredTools.map(tool => tool.isEnabled());
    return filteredTools.filter((tool, index) => enabledFlags[index]);
};

// Mapping: tD→getDefaultTools, A→permissionContext, q→alwaysExcludeSet,
//          K→allTools, Y→filteredTools, hg1→filterToolsByRules, R_6→DELEGATE_ALLOWED_TOOLS
```

---

## 4. assembleSessionToolSet (YP6)

**What it does:** Final assembly point that merges default tools with MCP tools and applies all filtering rules.

**Location:** `chunks.141.mjs:1476-1483`

```javascript
// ============================================
// assembleSessionToolSet - Final tool set assembly
// Location: chunks.141.mjs:1476-1483
// ============================================

// ORIGINAL (for source lookup):
function YP6(A, q) {
    let K = tD(A);
    if (O$()) return K;
    let Y = hg1(q, A),
        z = Sx([...K, ...Y], "name");
    if (A.mode === "delegate") return z.filter((w) => R_6.has(w.name));
    return z
}

// READABLE (for understanding):
function assembleSessionToolSet(permissionContext, mcpTools) {
    // Step 1: Get default built-in tools filtered by permission context
    let defaultTools = getDefaultTools(permissionContext);

    // Step 2: If filtering is disabled (test mode), return defaults only
    if (isFilteringDisabled()) return defaultTools;

    // Step 3: Filter MCP tools by permission context
    let filteredMcpTools = filterToolsByRules(mcpTools, permissionContext);

    // Step 4: Merge and deduplicate by tool name
    let mergedTools = uniqueBy([...defaultTools, ...filteredMcpTools], "name");

    // Step 5: Delegate mode final filter
    if (permissionContext.mode === "delegate") {
        return mergedTools.filter(tool => DELEGATE_ALLOWED_TOOLS.has(tool.name));
    }

    return mergedTools;
}

// Mapping: YP6→assembleSessionToolSet, A→permissionContext, q→mcpTools,
//          K→defaultTools, tD→getDefaultTools, O$→isFilteringDisabled,
//          hg1→filterToolsByRules, Sx→uniqueBy, R_6→DELEGATE_ALLOWED_TOOLS
```

### 4.1 Mode-Specific Tool Restrictions

Different execution modes have different tool availability:

| Mode | Restriction | Rationale |
|------|-------------|-----------|
| `default` | Full tool set | Normal operation |
| `delegate` | DELEGATE_ALLOWED_TOOLS only | Subagents have limited capabilities |
| `bypassPermissions` | Full tool set, no prompts | Dangerous but convenient |
| `background` | BACKGROUND_AGENT_ALLOWED_TOOLS | Background tasks can't interact with UI |

### 4.2 Delegate Mode Tool Whitelist

**Source location:** `chunks.89.mjs:876`

```javascript
// ============================================
// DELEGATE_ALLOWED_TOOLS - Tool whitelist for delegate mode
// Location: chunks.89.mjs:876
// ============================================

// ORIGINAL (for source lookup):
R_6 = new Set([vh, VK1, iB, Nh, NK1, TK1, DR, fK])

// READABLE (for understanding):
const DELEGATE_ALLOWED_TOOLS = new Set([
    "TeamCreate",      // Create agent teams
    "TeamDelete",      // Delete teams
    "SendMessage",     // Send team messages
    "TaskCreate",      // Create structured tasks
    "TaskGet",         // Get task details
    "TaskList",        // List all tasks
    "TaskUpdate",      // Update task status
    "Task"             // Spawn subagents
]);

// Mapping: R_6→DELEGATE_ALLOWED_TOOLS, vh→"TeamCreate", VK1→"TeamDelete",
//          iB→"SendMessage", Nh→"TaskCreate", NK1→"TaskGet", TK1→"TaskList",
//          DR→"TaskUpdate", fK→"Task"
```

**Why these specific tools?**

Delegate mode is used for subagents that should have limited capabilities:
- **No Bash** - Can't execute arbitrary commands
- **No file operations** - Can't read/write/edit files directly
- **Team/Task tools only** - Can coordinate but not perform destructive operations
- **Safe for delegation** - Parent agent retains control over dangerous operations

---

## 5. Tool Whitelist Constants

### 5.1 BACKGROUND_AGENT_ALLOWED_TOOLS (Bj1)

**Source location:** `chunks.89.mjs:876`

```javascript
// ============================================
// BACKGROUND_AGENT_ALLOWED_TOOLS - Tools for background agents
// Location: chunks.89.mjs:876
// ============================================

// ORIGINAL (for source lookup):
Bj1 = new Set([uj1, bW, N_6, fK, TH, bj1])

// READABLE (for understanding):
const BACKGROUND_AGENT_ALLOWED_TOOLS = new Set([
    "TaskOutput",      // Check task status
    "ExitPlanMode",    // Exit plan mode
    "EnterPlanMode",   // Enter plan mode
    "Task",            // Spawn subagents
    "AskUserQuestion", // Ask questions (async)
    "TaskStop"         // Stop running tasks
]);

// Mapping: Bj1→BACKGROUND_AGENT_ALLOWED_TOOLS, uj1→"TaskOutput", bW→"ExitPlanMode",
//          N_6→"EnterPlanMode", fK→"Task", TH→"AskUserQuestion", bj1→"TaskStop"
```

**Why background agents need different tools:**

Background agents run without user interaction, so they:
- Can't use tools that require synchronous user input
- Can use `AskUserQuestion` which queues questions for later
- Need `TaskOutput`/`TaskStop` for managing child tasks
- Can enter/exit plan mode for planning workflows

### 5.2 ALL_SAFE_TOOLS (L_6)

```javascript
// ============================================
// ALL_SAFE_TOOLS - Safe tools for restricted contexts
// Location: chunks.89.mjs:876
// ============================================

// ORIGINAL (for source lookup):
L_6 = new Set([Jq, JL, cg, s9, xO, Jz, h4, bq, f5, jM, NJ, cD, dM, ...[], iB])

// READABLE (for understanding):
const ALL_SAFE_TOOLS = new Set([
    "Read",            // File reading
    "WebSearch",       // Web search
    "Glob",            // File pattern matching
    "Grep",            // Content search
    "WebFetch",        // URL fetching
    // ... other read-only tools
    "SendMessage"      // Team messaging
]);

// Mapping: L_6→ALL_SAFE_TOOLS, Jq→"Read", JL→"WebSearch"
```

### 5.3 STRUCTURED_TASK_TOOLS (np7)

```javascript
// ============================================
// STRUCTURED_TASK_TOOLS - Tools for structured task management
// Location: chunks.89.mjs:876
// ============================================

// ORIGINAL (for source lookup):
np7 = new Set([Nh, NK1, TK1, DR])

// READABLE (for understanding):
const STRUCTURED_TASK_TOOLS = new Set([
    "TaskCreate",      // Create tasks
    "TaskGet",         // Get task details
    "TaskList",        // List tasks
    "TaskUpdate"       // Update tasks
]);

// Mapping: np7→STRUCTURED_TASK_TOOLS, Nh→"TaskCreate", NK1→"TaskGet",
//          TK1→"TaskList", DR→"TaskUpdate"
```

---

## 6. Complete Integration Flow

### 6.1 Sequence Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CLI → TOOLS INTEGRATION SEQUENCE                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  User                                                                       │
│   │                                                                         │
│   │ claude --allowed-tools "Bash(git:*)" --disallowed-tools "WebFetch"     │
│   ▼                                                                         │
│  Commander.parse()                                                          │
│   │                                                                         │
│   │ Extract: allowedTools=["Bash(git:*)"], disallowedTools=["WebFetch"]    │
│   ▼                                                                         │
│  mainEntry() [chunks.197.mjs:931]                                          │
│   │                                                                         │
│   │ Resolve permission mode from flags/config                              │
│   ▼                                                                         │
│  buildToolPermissionContext() [chunks.172.mjs:2252]                        │
│   │                                                                         │
│   │ ├─ Parse tool patterns: "Bash(git:*)" → {tool:"Bash", args:"git:*"}   │
│   │ ├─ Merge with user/project config                                     │
│   │ ├─ Check feature flags & org policies                                 │
│   │ └─ Build ToolPermissionContext                                         │
│   ▼                                                                         │
│  ToolPermissionContext                                                      │
│   {                                                                         │
│     mode: "default",                                                        │
│     alwaysAllowRules: { cliArg: [{tool:"Bash", args:"git:*"}] },          │
│     alwaysDenyRules: { cliArg: [{tool:"WebFetch"}] },                     │
│     isBypassPermissionsModeAvailable: false                                │
│   }                                                                         │
│   │                                                                         │
│   ▼                                                                         │
│  getDefaultTools(permissionContext) [chunks.141.mjs:1505]                  │
│   │                                                                         │
│   │ ├─ Get all built-in tools                                              │
│   │ ├─ Filter by permission rules                                          │
│   │ └─ Return enabled tools only                                           │
│   ▼                                                                         │
│  assembleSessionToolSet(permissionContext, mcpTools) [chunks.141.mjs:1476] │
│   │                                                                         │
│   │ ├─ Merge default tools with MCP tools                                  │
│   │ ├─ Apply final permission filtering                                    │
│   │ └─ Deduplicate by tool name                                            │
│   ▼                                                                         │
│  Available Tool Set → Agent Loop                                            │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 6.2 Tool Permission Decision Matrix

When a tool is invoked, the permission system checks:

```
┌─────────────────────────────────────────────────────────────────┐
│                TOOL PERMISSION DECISION TREE                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Tool invocation request                                         │
│  │                                                               │
│  ▼                                                               │
│  ┌─────────────────────────────────────────┐                    │
│  │ Is bypass permissions mode active?      │                    │
│  │ (mode === "bypassPermissions" AND      │                    │
│  │  isBypassPermissionsModeAvailable)     │                    │
│  └────────────────┬────────────────────────┘                    │
│                   │                                              │
│         ┌────────┴────────┐                                      │
│         │                 │                                      │
│        YES               NO                                      │
│         │                 │                                      │
│         ▼                 ▼                                      │
│    ┌─────────┐   ┌─────────────────────────────────┐            │
│    │ ALLOW   │   │ Check alwaysAllowRules          │            │
│    │ (no     │   │ Does tool match any allow rule? │            │
│    │ prompt) │   └────────────────┬────────────────┘            │
│    └─────────┘                    │                             │
│                          ┌────────┴────────┐                    │
│                          │                 │                    │
│                         YES               NO                    │
│                          │                 │                    │
│                          ▼                 ▼                    │
│                     ┌─────────┐   ┌─────────────────────────┐   │
│                     │ ALLOW   │   │ Check alwaysDenyRules   │   │
│                     │ (no     │   │ Does tool match any     │   │
│                     │ prompt) │   │ deny rule?              │   │
│                     └─────────┘   └────────────────┬────────┘   │
│                                             │                  │
│                                   ┌─────────┴─────────┐        │
│                                   │                   │        │
│                                  YES                 NO        │
│                                   │                   │        │
│                                   ▼                   ▼        │
│                              ┌─────────┐   ┌───────────────┐   │
│                              │ DENY    │   │ Check mode    │   │
│                              │ (error  │   │ specific      │   │
│                              │ or ask) │   │ rules         │   │
│                              └─────────┘   └───────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 7. Key Integration Points Summary

| Integration Point | Location | Description |
|-------------------|----------|-------------|
| Flag parsing | `chunks.197.mjs:1017` | Commander definitions |
| Flag extraction | `chunks.197.mjs:1032` | Destructuring in action handler |
| Context building | `chunks.172.mjs:2252` | `buildToolPermissionContext` |
| Tool discovery | `chunks.141.mjs:1505` | `getDefaultTools` |
| Tool assembly | `chunks.141.mjs:1476` | `assembleSessionToolSet` |
| Permission filtering | `chunks.141.mjs:1469` | `filterToolsByRules` |
| Delegate whitelist | `chunks.89.mjs:876` | `DELEGATE_ALLOWED_TOOLS` |
| Background whitelist | `chunks.89.mjs:876` | `BACKGROUND_AGENT_ALLOWED_TOOLS` |
