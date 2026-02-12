# Proactive Mode Analysis

## Overview

Proactive mode is a new experimental agent behavior in Claude Code v2.1.38 where the agent can take initiative without explicit user prompts. Rather than the standard request-response cycle, proactive mode enables Claude to act autonomously -- for example, monitoring file changes and responding without waiting for the user to type a message.

This feature is gated behind the `tengu_vinteuil_phrase` feature flag (a GrowthBook-based flag) and uses a **simplified system prompt** rather than the full system prompt used in standard mode. Proactive mode touches several components: the system prompt builder, the REPL component, the terminal progress bar, and the status bar/footer.

The design philosophy is clear: when the agent is acting proactively, the interface should be less intrusive (no progress bar, no prompt suggestions), and the system prompt should be lighter-weight to reduce latency and token usage for autonomous actions.

---

## Feature Flag and Gating Mechanism

### `tengu_vinteuil_phrase` Flag

**What it does:** Controls whether proactive mode and the simplified system prompt path are activated.

**How it works:**
1. The flag is checked via `x8("tengu_vinteuil_phrase", false)`, which reads from GrowthBook's cached feature flags
2. There is a **dual gating** mechanism -- two independent paths can trigger the simplified prompt:
   - **GrowthBook flag**: `x8("tengu_vinteuil_phrase", false)` returns true
   - **Client data cache**: `COq()` returns `"tengu_vinteuil_phrase"` from server-side client data
3. Either path results in the same outcome: routing to the simplified system prompt builder `hOq`

**Why this approach:**
- The dual gating (GrowthBook flag + client data cache) allows the feature to be enabled either through the standard feature flag system or through server-side configuration pushed via client data. This provides two independent rollout mechanisms.
- The client data path (`COq`) reads from `f6().clientDataCache.data.system_prompt_variant`, allowing the server to override the prompt path without requiring a GrowthBook configuration change.
- The `tengu_vinteuil_phrase` naming is an internal codename (following the pattern of other "tengu_" prefixed flags), likely chosen to be non-descriptive for security-through-obscurity of experimental features.

**Key insight:** The log message `[SystemPrompt] path=simple proactive=${P9z?.isProactiveActive()??false}` records both which prompt path was taken and whether proactive mode is currently active. This telemetry decouples the simplified prompt (which can be used without proactive mode) from the proactive activity state itself.

```javascript
// ============================================
// buildSystemPrompt - Main entry point for system prompt construction
// Location: chunks.169.mjs:236-249
// ============================================

// ORIGINAL (for source lookup):
async function dZ(A, q, K, Y) {
    if (J6(void 0)) return ["You are Claude Code, Anthropic's official CLI for Claude."];
    if (x8("tengu_vinteuil_phrase", !1)) return h(`[SystemPrompt] path=simple proactive=${P9z?.isProactiveActive()??!1}`), hOq(A, q, K, Y);
    let z = COq();
    if (z === "tengu_vinteuil_phrase") return h(`[SystemPrompt] client_data system_prompt_variant=${z}`), hOq(A, q, K, Y);
    let w = h6(),
        [H, $, O] = await Promise.all([hv(w), rBA(), nBA(q, K)]),
        // ... full system prompt construction ...
    return [G9z($), Z9z($), f9z(J), V9z(J), xOq(), N9z($, J), T9z(), v9z(J, D), $T6, E9z(J), k9z(), ...x8("tengu_system_prompt_global_cache", !1) ? [xG1] : [], ...M].filter((P) => P !== null)
}

// READABLE (for understanding):
async function buildSystemPrompt(tools, modelId, additionalWorkDirs, mcpServers) {
    if (isTestMode(undefined)) return ["You are Claude Code, Anthropic's official CLI for Claude."];

    // Path 1: GrowthBook feature flag check
    if (getFeatureFlag("tengu_vinteuil_phrase", false)) {
        log(`[SystemPrompt] path=simple proactive=${proactiveController?.isProactiveActive() ?? false}`);
        return buildSimplifiedSystemPrompt(tools, modelId, additionalWorkDirs, mcpServers);
    }

    // Path 2: Client data cache check
    let variant = getClientDataPromptVariant();
    if (variant === "tengu_vinteuil_phrase") {
        log(`[SystemPrompt] client_data system_prompt_variant=${variant}`);
        return buildSimplifiedSystemPrompt(tools, modelId, additionalWorkDirs, mcpServers);
    }

    // Default: full system prompt with all sections
    // ... 12+ sections including task management, tool policy, code references, etc.
}

// Mapping: dZ->buildSystemPrompt, A->tools, q->modelId, K->additionalWorkDirs, Y->mcpServers,
//   x8->getFeatureFlag, P9z->proactiveController, hOq->buildSimplifiedSystemPrompt,
//   COq->getClientDataPromptVariant, h->log
```

### Feature Flag Checker

```javascript
// ============================================
// getFeatureFlag - Reads a feature flag from GrowthBook cache
// Location: chunks.174.mjs:2137-2147
// ============================================

// ORIGINAL (for source lookup):
function x8(A, q) {
    if (!te()) return q;
    if (wf1(A, q), ed1.has(A)) FT6(A);
    else sd1.add(A);
    try {
        let K = f6().cachedGrowthBookFeatures?.[A];
        return K !== void 0 ? K : q
    } catch {
        return q
    }
}

// READABLE (for understanding):
function getFeatureFlag(flagName, defaultValue) {
    if (!isInitialized()) return defaultValue;
    trackFlagUsage(flagName, defaultValue);
    if (knownFlags.has(flagName)) reportFlagAccess(flagName);
    else newFlags.add(flagName);
    try {
        let value = getGlobalState().cachedGrowthBookFeatures?.[flagName];
        return value !== undefined ? value : defaultValue;
    } catch {
        return defaultValue;
    }
}

// Mapping: x8->getFeatureFlag, A->flagName, q->defaultValue, te->isInitialized,
//   f6->getGlobalState, ed1->knownFlags, sd1->newFlags, FT6->reportFlagAccess
```

### Client Data Variant Checker

```javascript
// ============================================
// getClientDataPromptVariant - Reads system_prompt_variant from client data cache
// Location: chunks.168.mjs:2386-2394
// ============================================

// ORIGINAL (for source lookup):
function COq() {
    j9z();
    try {
        let A = f6().clientDataCache;
        return A ? M9z(A.data) : null
    } catch {
        return null
    }
}

// READABLE (for understanding):
function getClientDataPromptVariant() {
    refreshClientDataIfStale();
    try {
        let cache = getGlobalState().clientDataCache;
        return cache ? extractPromptVariant(cache.data) : null;
    } catch {
        return null;
    }
}

// Mapping: COq->getClientDataPromptVariant, j9z->refreshClientDataIfStale,
//   f6->getGlobalState, M9z->extractPromptVariant
```

---

## System Prompt Path: Simplified vs Full

### Simplified System Prompt (`hOq`)

**What it does:** Builds a streamlined system prompt with fewer sections, used when proactive mode or the simplified prompt flag is active.

**How it works:**
1. Fetches skills, output style, and simplified environment info in parallel
2. Constructs the prompt from 6 core sections (vs 12+ in the full prompt)
3. Uses `IOq` (simplified env info) instead of `nBA` (full env info)
4. Uses dynamic updatable sections via `wc()` and static sections via `_91()`

**Sections included in the simplified prompt:**
| Section Builder | Readable Name | Description |
|----------------|---------------|-------------|
| `L9z` | `buildIntroSection` | "You are an interactive agent..." (not "CLI tool") |
| `R9z` | `buildSystemSection` | System rules (permissions, prompt injection warnings) |
| `y9z` (conditional) | `buildCodingInstructions` | Coding best practices (only if output style is null or keepCodingInstructions) |
| `C9z` | `buildCarefulActionsSection` | Reversibility and blast radius awareness |
| `S9z` | `buildToolUsageSection` | Tool usage guidelines |
| `h9z` | `buildToneStyleSection` | Tone and style rules |

**Sections in the FULL prompt but ABSENT from simplified:**
| Section Builder | Readable Name | Description |
|----------------|---------------|-------------|
| `f9z` | `buildTaskManagement` | Todo tool usage instructions and examples |
| `V9z` | `buildAskQuestions` | UserInput tool guidance |
| `xOq` | `buildHooksNotice` | Hooks system explanation |
| `N9z` | `buildDoingTasks` | Detailed software engineering task guidance |
| `T9z` | `buildSystemReminders` | System-reminder tags and context window info |
| `v9z` | `buildToolPolicy` | Detailed tool policy with subagent usage |
| `$T6` | `SECURITY_POLICY` | Security testing policy statement |
| `E9z` | `buildTodoReminder` | "Always use todo tool" reminder |
| `k9z` | `buildCodeReferences` | Code reference format guidance |

**Why this approach:**
- The simplified prompt removes verbose examples (especially task management examples that span 30+ lines), detailed tool policies, and redundant reminders.
- This significantly reduces token usage for each turn, which is critical for proactive mode where the agent may trigger many autonomous turns.
- The key sections retained (intro, system rules, careful actions, tool usage, tone) represent the minimum viable set of instructions needed for safe autonomous operation.
- Notably, `S9z` (tool usage) in the simplified version still covers the essential tool routing rules (use Read instead of cat, Edit instead of sed, etc.), ensuring correct tool selection even in autonomous mode.

**Key insight:** The simplified prompt changes the agent's self-identification from "interactive CLI tool" (in `G9z`) to "interactive agent" (in `L9z`). This subtle wording change reflects the proactive mode's departure from the traditional CLI request-response paradigm.

```javascript
// ============================================
// buildSimplifiedSystemPrompt - Constructs the simplified system prompt
// Location: chunks.169.mjs:225-234
// ============================================

// ORIGINAL (for source lookup):
async function hOq(A, q, K, Y) {
    if (J6(void 0)) return ["You are Claude Code, Anthropic's official CLI for Claude."];
    let z = h6(),
        [w, H, $] = await Promise.all([hv(z), rBA(), IOq(q, K)]),
        O = l4(),
        _ = new Set(A.map((D) => D.name)),
        J = [wc("auto_memory", () => F0A(), "..."), wc("ant_model_override", () => bOq(), "..."),
             _91("env_info_simple", () => IOq(q, K)), _91("language", () => uOq(O.language)),
             wc("output_style", () => BOq(H), "..."), wc("mcp_instructions", () => mOq(Y), "..."),
             _91("scratchpad", () => UOq())],
        X = await MIA(J);
    return [L9z(H), R9z(_), H === null || H.keepCodingInstructions === !0 ? y9z() : null,
            C9z(), S9z(_, w), h9z(),
            ...J6(process.env.CLAUDE_CODE_FORCE_GLOBAL_CACHE) || x8("tengu_system_prompt_global_cache", !1) ? [xG1] : [],
            ...X].filter((D) => D !== null)
}

// READABLE (for understanding):
async function buildSimplifiedSystemPrompt(tools, modelId, additionalWorkDirs, mcpServers) {
    if (isTestMode(undefined)) return ["You are Claude Code, Anthropic's official CLI for Claude."];
    let cwd = getCwd();
    let [skills, outputStyle, envInfo] = await Promise.all([
        getSkills(cwd), getOutputStyle(), buildSimplifiedEnvInfo(modelId, additionalWorkDirs)
    ]);
    let config = getConfig();
    let toolNames = new Set(tools.map(t => t.name));

    // Dynamic sections that can update between turns
    let dynamicSections = [
        updatable("auto_memory", () => getMemoryContent(), "MEMORY.md is read from disk each turn"),
        updatable("ant_model_override", () => getModelOverride(), "GrowthBook feature value can change"),
        static("env_info_simple", () => buildSimplifiedEnvInfo(modelId, additionalWorkDirs)),
        static("language", () => buildLanguageSection(config.language)),
        updatable("output_style", () => buildOutputStyleSection(outputStyle), "User can change mid-session"),
        updatable("mcp_instructions", () => buildMcpInstructions(mcpServers), "MCP servers connect/disconnect"),
        static("scratchpad", () => buildScratchpadSection()),
    ];
    let resolvedDynamic = await resolveDynamicSections(dynamicSections);

    return [
        buildIntroSection(outputStyle),          // "You are an interactive agent..."
        buildSystemSection(toolNames),            // Permissions, prompt injection, etc.
        outputStyle === null || outputStyle.keepCodingInstructions === true
            ? buildCodingInstructions() : null,   // Coding best practices (conditional)
        buildCarefulActionsSection(),             // Reversibility awareness
        buildToolUsageSection(toolNames, skills), // Tool routing rules
        buildToneStyleSection(),                  // Tone, formatting
        // Global cache boundary (if enabled)
        ...resolvedDynamic                        // Memory, env, language, output style, MCP, scratchpad
    ].filter(d => d !== null);
}

// Mapping: hOq->buildSimplifiedSystemPrompt, A->tools, q->modelId, K->additionalWorkDirs,
//   Y->mcpServers, hv->getSkills, rBA->getOutputStyle, IOq->buildSimplifiedEnvInfo,
//   L9z->buildIntroSection, R9z->buildSystemSection, y9z->buildCodingInstructions,
//   C9z->buildCarefulActionsSection, S9z->buildToolUsageSection, h9z->buildToneStyleSection,
//   wc->updatable, _91->static, MIA->resolveDynamicSections
```

### Simplified vs Full Environment Info

The simplified env info (`IOq`) uses a structured bullet-point format vs the full env info (`nBA`) which uses XML `<env>` tags and `<claude_background_info>` sections.

```javascript
// ============================================
// buildSimplifiedEnvInfo - Compact environment info for simplified prompt
// Location: chunks.169.mjs:402-412
// ============================================

// ORIGINAL (for source lookup):
async function IOq(A, q) {
    let [K, Y] = await Promise.all([aj(), gOq()]),
        z = k1A(A), w = z ? `You are powered by the model named ${z}...` : `You are powered by the model ${A}.`,
        H = QOq(A), $ = H ? `\n\nAssistant knowledge cutoff is ${H}.` : null,
        O = [
            `Primary working directory: ${h6()}`,
            [`Is a git repository: ${K}`],
            q && q.length > 0 ? "Additional working directories:" : null,
            q && q.length > 0 ? q : null,
            `Platform: ${xA.platform}`, `OS Version: ${Y}`,
            `The current date is: ${h_1()}`, w, $,
            `The most recent Claude model family is Claude 4.5/4.6. Model IDs — Opus 4.6: '${lBA.opus}', Sonnet 4.5: '${lBA.sonnet}', Haiku 4.5: '${lBA.haiku}'.`
        ].filter((J) => J !== null),
        _ = `\n\n<fast_mode_info>...</fast_mode_info>`;
    return ["# Environment", "You have been invoked in the following environment: ", ...WG1(O), _].join("\n")
}

// READABLE (for understanding):
async function buildSimplifiedEnvInfo(modelId, additionalWorkDirs) {
    let [isGitRepo, osVersion] = await Promise.all([checkIsGitRepo(), getOsVersion()]);
    let modelName = getModelDisplayName(modelId);
    let cutoff = getKnowledgeCutoff(modelId);
    let items = [
        `Primary working directory: ${getCwd()}`,
        [`Is a git repository: ${isGitRepo}`],
        // ... additional dirs, platform, date, model info, cutoff, model family
    ].filter(item => item !== null);
    return ["# Environment", "You have been invoked in the following environment: ",
        ...formatAsBulletList(items), fastModeInfoBlock].join("\n");
}

// Mapping: IOq->buildSimplifiedEnvInfo, nBA->buildFullEnvInfo, aj->checkIsGitRepo,
//   gOq->getOsVersion, k1A->getModelDisplayName, QOq->getKnowledgeCutoff
```

---

## REPL Integration

### Proactive State Subscription

**What it does:** The REPL component subscribes to proactive state changes and uses the active/inactive state to control tool filtering and UI behavior.

**How it works:**
1. On mount, reads `uE6?.isProactiveActive()` to initialize state (defaults to `false`)
2. Sets up a subscription via `uE6.subscribeToProactiveChanges()` that updates the React state whenever proactive status changes
3. The `G1` (isProactiveActive) state is included in the dependency array of `useMemo` for tool computation, ensuring tools are recomputed when proactive mode toggles
4. Tool list is computed via `tD(B)` (getFilteredTools), which considers the current permission context

**Why this approach:**
- Using `useSyncExternalStore` pattern (in the status bar) and manual subscription (in the REPL) provides reactive updates when the proactive controller toggles state. This allows the UI to instantly adapt when proactive mode activates/deactivates without polling.
- The proactive controller (`uE6`/`P9z`/`M8z`/`ajz`/`sGq`) is a module-level singleton initialized to `null`. It is expected to be set externally when the proactive feature is available. The null-safe optional chaining (`uE6?.isProactiveActive()`) ensures graceful degradation when the controller is not present.

**Key insight:** The five separate module-level references (`uE6`, `P9z`, `M8z`, `ajz`, `sGq`) to the proactive controller across different chunks suggest that each module imports/re-exports its own reference. This is a consequence of the bundler's code splitting -- they all point to the same underlying proactive controller instance, but each chunk holds its own binding for tree-shaking and lazy loading purposes.

```javascript
// ============================================
// REPL - Proactive state subscription in REPL component
// Location: chunks.188.mjs:32-39
// ============================================

// ORIGINAL (for source lookup):
let [G1, L1] = dA.useState(uE6?.isProactiveActive() ?? !1);
dA.useEffect(() => {
    if (!uE6) return;
    return uE6.subscribeToProactiveChanges(() => {
        L1(uE6.isProactiveActive())
    })
}, []);
let x1 = dA.useMemo(() => tD(B), [B, G1]);

// READABLE (for understanding):
let [isProactive, setIsProactive] = React.useState(
    proactiveController?.isProactiveActive() ?? false
);
React.useEffect(() => {
    if (!proactiveController) return;
    return proactiveController.subscribeToProactiveChanges(() => {
        setIsProactive(proactiveController.isProactiveActive());
    });
}, []);
// Re-filter tools whenever permission context or proactive state changes
let filteredTools = React.useMemo(
    () => getFilteredTools(permissionContext),
    [permissionContext, isProactive]
);

// Mapping: G1->isProactive, L1->setIsProactive, uE6->proactiveController,
//   tD->getFilteredTools, B->permissionContext, x1->filteredTools
```

### Tool Filtering

**What it does:** The `tD` function filters the available tool set based on the current permission context. While it does not directly reference proactive mode, it is re-evaluated when proactive state changes (via the `G1` dependency).

**How it works:**
1. Starts with the full set of registered tools from `kt()` (getAllTools)
2. Removes a fixed set of excluded tools (`cd`, `ld`, `cD`)
3. Applies permission-based filtering via `hg1` (applyToolPermissionRules)
4. In delegate mode, further restricts to a known set of delegate-safe tools
5. In REPL mode, removes tools that conflict with the REPL tool (`y_6`)

```javascript
// ============================================
// getFilteredTools - Filters tools based on permission context
// Location: chunks.141.mjs:1505-1516
// ============================================

// ORIGINAL (for source lookup):
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
getFilteredTools = (permissionContext) => {
    if (isTestMode(undefined)) return [defaultTool];
    let excludedTools = new Set([toolA.name, toolB.name, toolC]);
    let allTools = getAllTools().filter(t => !excludedTools.has(t.name));
    let permitted = applyToolPermissionRules(allTools, permissionContext);
    if (permissionContext.mode === "delegate")
        permitted = permitted.filter(t => delegateSafeTools.has(t.name));
    if (isTestMode(process.env.CLAUDE_REPL_MODE)) {
        if (permitted.some(t => t.name === replToolName))
            permitted = permitted.filter(t => !replConflictTools.has(t.name));
    }
    let enabledStatus = permitted.map(t => t.isEnabled());
    return permitted.filter((t, i) => enabledStatus[i]);
};

// Mapping: tD->getFilteredTools, A->permissionContext, kt->getAllTools,
//   hg1->applyToolPermissionRules, R_6->delegateSafeTools, y_6->replToolName, rp7->replConflictTools
```

---

## UI Adaptations

### Terminal Progress Bar Disabled

**What it does:** The terminal progress bar (which shows indeterminate/completed states during agent processing) is disabled when proactive mode is active.

**How it works:**
1. In the message display component, the progress bar enablement is computed as: `terminalProgressBarEnabled && !isProactiveActive`
2. The value is memoized via React's compiler cache sentinel pattern
3. When proactive mode is active, `M8z?.isProactiveActive()` returns `true`, causing `f1` to evaluate to `false`

**Why this approach:**
- In standard mode, the progress bar gives users feedback that the agent is processing their request. In proactive mode, the agent acts autonomously, so showing a persistent progress bar would be misleading or annoying.
- The agent may be constantly processing in proactive mode, which would cause the progress bar to never reach "completed" state, creating a confusing UI.

```javascript
// ============================================
// Progress bar control in message display
// Location: chunks.161.mjs:747
// ============================================

// ORIGINAL (for source lookup):
if (q[31] === Symbol.for("react.memo_cache_sentinel"))
    f1 = f6().terminalProgressBarEnabled && !(M8z?.isProactiveActive() ?? !1),
    q[31] = f1;
else f1 = q[31];

// READABLE (for understanding):
if (cache[31] === CACHE_SENTINEL) {
    progressBarEnabled = getGlobalState().terminalProgressBarEnabled
        && !(proactiveController?.isProactiveActive() ?? false);
    cache[31] = progressBarEnabled;
} else {
    progressBarEnabled = cache[31];
}

// Mapping: M8z->proactiveController, f6->getGlobalState, f1->progressBarEnabled
```

### Prompt Suggestion Suppressed

**What it does:** The input prompt suggestion (e.g., "Try 'fix lint errors'") is suppressed when proactive mode is active.

**How it works:**
1. The placeholder text logic checks: `turnCount < 1 && promptSuggestionEnabled && !proactiveController?.isProactiveActive()`
2. If proactive mode is active, the prompt suggestion returns `undefined` (no suggestion shown)
3. This only affects the initial prompt -- after the first turn, the condition `turnCount < 1` is already false

**Why this approach:**
- Prompt suggestions are designed to help users who have not yet typed anything. In proactive mode, the agent is expected to act without user input, so showing "Try 'fix lint errors'" would be contradictory to the autonomous behavior model.

```javascript
// ============================================
// Prompt suggestion logic with proactive check
// Location: chunks.184.mjs:1693-1698
// ============================================

// ORIGINAL (for source lookup):
return UZq.useMemo(() => {
    if (A !== "") return;
    if (K) return `Message @${K.length>gZq?K.slice(0,gZq-3)+"...":K}…`;
    if (Y.length > 0 && (f6().queuedCommandUpHintCount || 0) < sjz) return "Press up to edit queued messages";
    if (q < 1 && z && !ajz?.isProactiveActive()) return iDq()
}, [A, Y, q, z, K])

// READABLE (for understanding):
return React.useMemo(() => {
    if (inputText !== "") return;  // User is typing, no suggestion
    if (mentionTarget) return `Message @${truncate(mentionTarget, 20)}...`;
    if (queuedCommands.length > 0 && hintCount < 3) return "Press up to edit queued messages";
    if (turnCount < 1 && promptSuggestionEnabled && !proactiveController?.isProactiveActive()) {
        return getRandomPromptSuggestion();  // e.g., 'Try "fix lint errors"'
    }
}, [inputText, queuedCommands, turnCount, promptSuggestionEnabled, mentionTarget]);

// Mapping: A->inputText, q->turnCount, z->promptSuggestionEnabled, K->mentionTarget,
//   Y->queuedCommands, ajz->proactiveController, iDq->getRandomPromptSuggestion,
//   gZq->MAX_MENTION_LENGTH(20), sjz->MAX_HINT_COUNT(3)
```

### Status Bar: Next Tick Indicator

**What it does:** The status bar shows whether a proactive tick is scheduled, indicating the agent will act soon.

**How it works:**
1. Uses React's `useSyncExternalStore` to subscribe to the proactive controller's state
2. Subscribes to `sGq?.subscribeToProactiveChanges` for change notifications
3. Reads `sGq?.getNextTickAt` to determine if a next proactive tick is scheduled
4. If `getNextTickAt()` returns a non-null value (a timestamp), variable `k` becomes `true`
5. Fallback functions (`Ajz` as no-op subscriber, `tGq` as null-returning getter) handle the case where the proactive controller is not available

```javascript
// ============================================
// Status bar proactive tick indicator
// Location: chunks.183.mjs:2610
// ============================================

// ORIGINAL (for source lookup):
k = qE6.useSyncExternalStore(
    sGq?.subscribeToProactiveChanges ?? Ajz,
    sGq?.getNextTickAt ?? tGq,
    tGq
) !== null,

// READABLE (for understanding):
hasScheduledProactiveTick = React.useSyncExternalStore(
    proactiveController?.subscribeToProactiveChanges ?? noopSubscribe,
    proactiveController?.getNextTickAt ?? returnsNull,
    returnsNull  // server snapshot fallback
) !== null;

// Mapping: k->hasScheduledProactiveTick, sGq->proactiveController,
//   Ajz->noopSubscribe, tGq->returnsNull, qE6->React
```

The fallback definitions ensure the component does not crash when no proactive controller is present:

```javascript
// ============================================
// Proactive controller fallbacks
// Location: chunks.183.mjs:2876-2878
// ============================================

// ORIGINAL (for source lookup):
Ajz = (A) => () => {}
tGq = () => null

// READABLE (for understanding):
noopSubscribe = (callback) => () => {};  // Returns unsubscribe function (no-op)
returnsNull = () => null;                // Always returns null (no tick scheduled)

// Mapping: Ajz->noopSubscribe, tGq->returnsNull
```

---

## Behavioral Differences Summary

| Aspect | Standard Mode | Proactive Mode |
|--------|--------------|----------------|
| **System Prompt** | Full (12+ sections, ~4000 tokens) | Simplified (6 sections, ~2000 tokens) |
| **Self-identification** | "interactive CLI tool" | "interactive agent" |
| **Environment Info** | XML `<env>` tags with background info | Bullet-point list format |
| **Task Management** | Detailed todo examples included | Omitted |
| **Tool Policy** | Verbose with subagent examples | Simplified routing rules only |
| **Progress Bar** | Enabled (indeterminate/completed) | Disabled |
| **Prompt Suggestions** | Shown on first turn | Suppressed |
| **Status Bar** | Standard mode indicators | Shows scheduled tick indicator |
| **Trigger** | User types a message | Autonomous (scheduled ticks) |

### Trade-offs

**Token efficiency vs instruction completeness:** The simplified prompt drops ~50% of the instructions. This reduces latency and cost for frequent autonomous turns, but means the agent has less guidance for complex tasks (no task management examples, no detailed tool policies). The retained sections focus on safety (careful actions) and correctness (tool routing), prioritizing "do no harm" over "do it optimally."

**Graceful degradation:** Every proactive controller reference uses optional chaining (`?.`) and null-coalescing (`??`). If the controller is never initialized, all proactive-dependent behaviors silently default to standard mode behavior. This means the proactive infrastructure is always present in the code but has zero runtime impact when not activated.

**Single controller, multiple references:** The proactive controller is referenced as 5 different identifiers across chunks (`uE6`, `P9z`, `M8z`, `ajz`, `sGq`), all initialized to `null`. This is a side-effect of the bundler's code splitting -- each chunk gets its own module-scoped variable. The actual controller instance, when available, exposes three key methods:
- `isProactiveActive()` -- boolean indicating if proactive mode is currently enabled
- `subscribeToProactiveChanges(callback)` -- returns unsubscribe function, fires on state changes
- `getNextTickAt()` -- returns timestamp of next scheduled proactive action, or null

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions and symbols in this document:
- `buildSystemPrompt` (dZ) - Main system prompt entry point, chunks.169.mjs:236
- `buildSimplifiedSystemPrompt` (hOq) - Simplified prompt builder for proactive mode, chunks.169.mjs:225
- `getFeatureFlag` (x8) - GrowthBook feature flag reader, chunks.174.mjs:2137
- `getClientDataPromptVariant` (COq) - Reads system_prompt_variant from client data, chunks.168.mjs:2386
- `extractPromptVariant` (M9z) - Extracts variant string from client data, chunks.168.mjs:2380
- `getFilteredTools` (tD) - Tool filtering based on permission context, chunks.141.mjs:1505
- `buildSimplifiedEnvInfo` (IOq) - Compact environment info builder, chunks.169.mjs:402
- `buildFullEnvInfo` (nBA) - Full environment info builder, chunks.169.mjs:378
- `buildIntroSection` (L9z) - "You are an interactive agent..." intro, chunks.169.mjs:175
- `buildSystemSection` (R9z) - System rules section, chunks.169.mjs:183
- `buildCodingInstructions` (y9z) - Coding best practices section, chunks.169.mjs:189
- `buildCarefulActionsSection` (C9z) - Reversibility/blast radius section, chunks.169.mjs:197
- `buildToolUsageSection` (S9z) - Tool usage guidelines section, chunks.169.mjs:210
- `buildToneStyleSection` (h9z) - Tone and style section, chunks.169.mjs:220
- `getRandomPromptSuggestion` (iDq) - Random prompt suggestion generator, chunks.176.mjs:1000
- Proactive controller references: `uE6` (chunks.188.mjs), `P9z` (chunks.169.mjs), `M8z` (chunks.161.mjs), `ajz` (chunks.184.mjs), `sGq` (chunks.183.mjs)
- `noopSubscribe` (Ajz) - Fallback subscriber (no-op), chunks.183.mjs:2876
- `returnsNull` (tGq) - Fallback getter (returns null), chunks.183.mjs:2878
