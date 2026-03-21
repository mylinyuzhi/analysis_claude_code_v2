# Proactive Mode Analysis (Claude Code 2.1.76)

> Proactive mode is an experimental agent behavior where the agent can take initiative without explicit user prompts. Rather than the standard request-response cycle, proactive mode enables Claude to act autonomously.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_integration.md) - Integrations

Key functions and symbols in this document:
- `buildSystemPrompt` (R0) - Main system prompt entry point, chunks.168.mjs:2144
- `getFeatureFlag` (w8) - GrowthBook feature flag reader
- `proactiveController` references: `Nb1`, `_fz`, `nVY`, `WeY`
- `getFilteredTools` (FX) - Tool filtering based on permission context

---

## Overview

Proactive mode uses a **simplified system prompt** rather than the full system prompt used in standard mode. The design philosophy is clear: when the agent is acting proactively, the interface should be less intrusive (no progress bar, no prompt suggestions), and the system prompt should be lighter-weight to reduce latency and token usage for autonomous actions.

---

## Feature Flag and Gating Mechanism

### Environment Variable Check

**What it does:** Controls whether simplified system prompt is used.

**How it works:**
1. The check is done via `t6(process.env.CLAUDE_CODE_SIMPLE)` which parses a boolean environment variable
2. If `CLAUDE_CODE_SIMPLE` is set, returns a minimal prompt with just CWD and date
3. Otherwise, builds the full system prompt with all sections

**Why this approach:**
- Environment variable provides a simple on/off switch for simplified mode
- Useful for testing and debugging the simplified prompt path
- Provides graceful degradation when proactive controller is not available

```javascript
// ============================================
// buildSystemPrompt - Main entry point for system prompt construction
// Location: chunks.168.mjs:2144-2156
// ============================================

// ORIGINAL (for source lookup):
async function R0(A, q, K, Y) {
    if (t6(process.env.CLAUDE_CODE_SIMPLE)) return [`You are Claude Code, Anthropic's official CLI for Claude.

CWD: ${G1()}
Date: ${GD6()}`];
    let z = G1(),
        [_, w, O] = await Promise.all([NR(z), IZq(), RZq(q, K)]),
        $ = mA(),
        H = new Set(A.map((M) => M.name)),
        j = [AF("memory", () => ID1()), AF("ant_model_override", () => J5z()), AF("env_info_simple", () => RZq(q, K)), AF("language", () => M5z($.language)), AF("output_style", () => D5z(w)), m8q("mcp_instructions", () => iT6() ? null : X5z(Y), "MCP servers connect/disconnect between turns"), AF("scratchpad", () => E5z()), AF("frc", () => y5z(q)), AF("summarize_tool_results", () => L5z), AF("brief", () => R5z())],
        J = await B8q(j);
    return [P5z(w), W5z(H), w === null || w.keepCodingInstructions === !0 ? Z5z() : null, G5z(), f5z(H, _), N5z(), v5z(), ...t6(process.env.CLAUDE_CODE_FORCE_GLOBAL_CACHE) || w8("tengu_system_prompt_global_cache", !1) ? [S_6] : [], ...J].filter((M) => M !== null)
}

// READABLE (for understanding):
async function buildSystemPrompt(tools, modelId, additionalWorkDirs, mcpServers) {
    // Simplified mode check via environment variable
    if (parseBoolean(process.env.CLAUDE_CODE_SIMPLE)) {
        return [`You are Claude Code, Anthropic's official CLI for Claude.

CWD: ${getCwd()}
Date: ${getCurrentDate()}`];
    }

    let cwd = getCwd();
    let [skills, outputStyle, envInfo] = await Promise.all([
        getSkills(cwd), getOutputStyle(), buildEnvInfo(modelId, additionalWorkDirs)
    ]);
    let config = getConfig();
    let toolNames = new Set(tools.map(t => t.name));

    // Dynamic sections that can update between turns
    let dynamicSections = [
        updatable("memory", () => getMemoryContent()),
        updatable("ant_model_override", () => getModelOverride()),
        updatable("env_info_simple", () => buildEnvInfo(modelId, additionalWorkDirs)),
        updatable("language", () => buildLanguageSection(config.language)),
        updatable("output_style", () => buildOutputStyleSection(outputStyle)),
        conditional("mcp_instructions", () => shouldDisableMcp() ? null : buildMcpInstructions(mcpServers), "MCP servers connect/disconnect between turns"),
        updatable("scratchpad", () => buildScratchpadSection()),
        updatable("frc", () => buildFrcSection(modelId)),
        updatable("summarize_tool_results", () => SUMMARIZE_TOOL_RESULTS_SECTION),
        updatable("brief", () => BRIEF_SECTION),
    ];
    let resolvedDynamic = await resolveDynamicSections(dynamicSections);

    return [
        buildIntroSection(outputStyle),          // "You are Claude Code..."
        buildSystemSection(toolNames),           // Permissions, prompt injection, etc.
        outputStyle === null || outputStyle.keepCodingInstructions === true
            ? buildCodingInstructions() : null,  // Coding best practices (conditional)
        buildCarefulActionsSection(),            // Reversibility awareness
        buildToolUsageSection(toolNames, skills),// Tool routing rules
        buildToneStyleSection(),                 // Tone, formatting
        buildAdditionalSections(),               // Additional context sections
        // Global cache boundary (if enabled)
        ...parseBoolean(process.env.CLAUDE_CODE_FORCE_GLOBAL_CACHE) || getFeatureFlag("tengu_system_prompt_global_cache", false)
            ? [GLOBAL_CACHE_BOUNDARY] : [],
        ...resolvedDynamic                       // Memory, env, language, output style, MCP, scratchpad
    ].filter(section => section !== null);
}

// Mapping: R0→buildSystemPrompt, A→tools, q→modelId, K→additionalWorkDirs, Y→mcpServers,
//   t6→parseBoolean, G1→getCwd, GD6→getCurrentDate, NR→getSkills, IZq→getOutputStyle,
//   RZq→buildEnvInfo, mA→getConfig, AF→updatable, m8q→conditional, B8q→resolveDynamicSections,
//   P5z→buildIntroSection, W5z→buildSystemSection, Z5z→buildCodingInstructions,
//   G5z→buildCarefulActionsSection, f5z→buildToolUsageSection, N5z→buildToneStyleSection
```

---

## Proactive Controller Architecture

### Module-Level Singleton Pattern

**What it does:** The proactive controller is a module-level singleton that provides proactive mode state and subscription capabilities.

**How it works:**
1. Each chunk declares its own module-level reference initialized to `null`
2. The controller instance is set externally when the proactive feature is available
3. Null-safe optional chaining (`?.`) ensures graceful degradation when not present

**Proactive Controller References in 2.1.76:**
| Symbol | File:Line | Usage Context |
|--------|-----------|---------------|
| `Nb1` | chunks.196.mjs:1792 | REPL component - state subscription |
| `_fz` | chunks.192.mjs:2137 | Prompt suggestion suppression |
| `nVY` | chunks.136.mjs:1377 | Agent loop execution context |
| `WeY` | chunks.160.mjs:3104 | Terminal progress bar control |

**Why this approach:**
- Multiple module-level references across chunks is a consequence of bundler code splitting
- Each chunk gets its own binding for tree-shaking and lazy loading purposes
- All references point to the same underlying controller instance when initialized
- Null initialization ensures no runtime impact when feature is disabled

```javascript
// ============================================
// Proactive controller declarations across chunks
// ============================================

// chunks.196.mjs:1792 - REPL component
Nb1 = null  // Used for REPL state subscription

// chunks.192.mjs:2137 - Prompt suggestion
_fz = null  // Used to suppress prompt suggestions

// chunks.136.mjs:1377 - Agent loop context
nVY = null  // Used for execution context determination

// chunks.160.mjs:3104 - Progress bar control
WeY = null  // Used to disable progress bar
```

---

## REPL Integration

### Proactive State Subscription

**What it does:** The REPL component subscribes to proactive state changes and uses the active/inactive state to control tool filtering and UI behavior.

**How it works:**
1. On mount, reads `Nb1?.isProactiveActive()` to initialize state (defaults to `false`)
2. Sets up a subscription via `Nb1.subscribeToProactiveChanges()` that updates the React state
3. The `y6` (isProactive) state is included in the dependency array of `useMemo` for tool computation
4. Tool list is computed via `FX(g)` (getFilteredTools), which considers the current permission context

**Why this approach:**
- Using subscription pattern provides reactive updates when proactive controller toggles state
- The UI instantly adapts when proactive mode activates/deactivates without polling
- The proactive controller exposes three key methods:
  - `isProactiveActive()` -- boolean indicating if proactive mode is currently enabled
  - `subscribeToProactiveChanges(callback)` -- returns unsubscribe function
  - `getNextTickAt()` -- returns timestamp of next scheduled proactive action, or null

```javascript
// ============================================
// REPL - Proactive state subscription in REPL component
// Location: chunks.196.mjs:36-43
// ============================================

// ORIGINAL (for source lookup):
let [y6, G6] = N8.useState(Nb1?.isProactiveActive() ?? !1);
N8.useEffect(() => {
    if (!Nb1) return;
    return Nb1.subscribeToProactiveChanges(() => {
        G6(Nb1.isProactiveActive())
    })
}, []);
let R6 = N8.useMemo(() => FX(g), [g, y6]);

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

// Mapping: y6→isProactive, G6→setIsProactive, Nb1→proactiveController,
//   FX→getFilteredTools, g→permissionContext, R6→filteredTools
```

### Tool Filtering Integration

**What it does:** The `FX` function filters the available tool set based on the current permission context. It is re-evaluated when proactive state changes via the `y6` dependency.

**How it works:**
1. Starts with the full set of registered tools
2. Applies permission-based filtering
3. In delegate mode, further restricts to delegate-safe tools
4. Returns enabled tools only

---

## UI Adaptations

### Terminal Progress Bar Disabled

**What it does:** The terminal progress bar is disabled when proactive mode is active.

**How it works:**
1. In the message display component, progress bar enablement is computed as: `terminalProgressBarEnabled && !isProactiveActive`
2. Uses React's memo cache sentinel pattern for performance
3. When proactive mode is active, `WeY?.isProactiveActive()` returns `true`, causing `c6` to be `false`

**Why this approach:**
- In standard mode, progress bar gives users feedback that agent is processing
- In proactive mode, agent acts autonomously, showing persistent progress bar would be misleading
- Agent may constantly process in proactive mode, causing progress bar to never reach "completed"

```javascript
// ============================================
// Progress bar control in message display
// Location: chunks.161.mjs:202-204
// ============================================

// ORIGINAL (for source lookup):
if (q[48] === Symbol.for("react.memo_cache_sentinel")) U6 = X1().terminalProgressBarEnabled && !(WeY?.isProactiveActive() ?? !1), q[48] = U6;
else U6 = q[48];
let c6 = U6,

// READABLE (for understanding):
if (cache[48] === CACHE_SENTINEL) {
    progressBarEnabled = getGlobalState().terminalProgressBarEnabled
        && !(proactiveController?.isProactiveActive() ?? false);
    cache[48] = progressBarEnabled;
} else {
    progressBarEnabled = cache[48];
}
let showProgressBar = progressBarEnabled;

// Mapping: WeY→proactiveController, X1→getGlobalState, U6→progressBarEnabled, c6→showProgressBar
```

### Prompt Suggestion Suppressed

**What it does:** The input prompt suggestion is suppressed when proactive mode is active.

**How it works:**
1. The placeholder text logic checks: `turnCount < 1 && promptSuggestionEnabled && !proactiveController?.isProactiveActive()`
2. If proactive mode is active, the prompt suggestion returns `undefined`
3. Only affects initial prompt -- after first turn, `turnCount < 1` is already false

**Why this approach:**
- Prompt suggestions help users who have not yet typed anything
- In proactive mode, agent is expected to act without user input
- Showing "Try 'fix lint errors'" would contradict autonomous behavior model

```javascript
// ============================================
// Prompt suggestion logic with proactive check
// Location: chunks.192.mjs:2127-2132
// ============================================

// ORIGINAL (for source lookup):
return uxq.useMemo(() => {
    if (A !== "") return;
    if (K) return `Message @${K.length>xxq?K.slice(0,xxq-3)+"...":K}…`;
    if (Y.some(Ut) && (X1().queuedCommandUpHintCount || 0) < wfz) return "Press up to edit queued messages";
    if (q < 1 && z && !_fz?.isProactiveActive()) return rEq()
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

// Mapping: A→inputText, q→turnCount, z→promptSuggestionEnabled, K→mentionTarget,
//   Y→queuedCommands, _fz→proactiveController, rEq→getRandomPromptSuggestion,
//   xxq→MAX_MENTION_LENGTH(20), wfz→MAX_HINT_COUNT(3)
```

### Status Bar: Next Tick Indicator

**What it does:** The status bar shows whether a proactive tick is scheduled, indicating the agent will act soon.

**How it works:**
1. Uses React's `useSyncExternalStore` to subscribe to the proactive controller's state
2. Reads `proactiveController?.getNextTickAt` to determine if a next proactive tick is scheduled
3. If `getNextTickAt()` returns non-null (a timestamp), shows tick indicator

```javascript
// ============================================
// Status bar proactive tick indicator
// Location: chunks.192.mjs:425
// ============================================

// The useSyncExternalStore pattern subscribes to proactive changes
// and checks if getNextTickAt returns a non-null timestamp
hasScheduledProactiveTick = React.useSyncExternalStore(
    proactiveController?.subscribeToProactiveChanges ?? noopSubscribe,
    proactiveController?.getNextTickAt ?? returnsNull,
    returnsNull  // server snapshot fallback
) !== null;
```

---

## Agent Loop Integration

### Execution Context Determination

**What it does:** The agent loop uses proactive state to determine execution context, affecting how the loop processes messages and tools.

**How it works:**
1. Checks multiple conditions including proactive state
2. Combines with background mode, continue flag, and other state flags
3. Determines whether to use special execution path

```javascript
// ============================================
// Agent loop proactive state check
// Location: chunks.136.mjs:1714
// ============================================

// ORIGINAL (for source lookup):
Y6 = (_ === !0 || R.background === !0 || r || e || (nVY?.isProactiveActive() ?? !1)) && !fV1,

// READABLE (for understanding):
shouldUseSpecialContext = (
    isFlaggedMode === true ||
    sessionConfig.background === true ||
    isContinue ||
    hasToolPermission ||
    (proactiveController?.isProactiveActive() ?? false)
) && !isDisabled;

// Mapping: Y6→shouldUseSpecialContext, _→isFlaggedMode, R.background→sessionConfig.background,
//   r→isContinue, e→hasToolPermission, nVY→proactiveController, fV1→isDisabled
```

---

## System Prompt Section Assembly

### Section Builders in 2.1.76

The system prompt is built from these sections:

| Section Builder | Readable Name | Description |
|----------------|---------------|-------------|
| `P5z` | `buildIntroSection` | "You are Claude Code..." |
| `W5z` | `buildSystemSection` | System rules, permissions |
| `Z5z` | `buildCodingInstructions` | Coding best practices (conditional) |
| `G5z` | `buildCarefulActionsSection` | Reversibility awareness |
| `f5z` | `buildToolUsageSection` | Tool routing rules |
| `N5z` | `buildToneStyleSection` | Tone, formatting |

### Dynamic Sections

Dynamic sections are resolved at runtime and can update between turns:

| Section Key | Builder | Description |
|-------------|---------|-------------|
| `memory` | `ID1` | MEMORY.md content |
| `ant_model_override` | `J5z` | Model override from GrowthBook |
| `env_info_simple` | `RZq` | Environment info |
| `language` | `M5z` | Language preference |
| `output_style` | `D5z` | Output style configuration |
| `mcp_instructions` | `X5z` | MCP server instructions |
| `scratchpad` | `E5z` | Scratchpad content |
| `frc` | `y5z` | FRC section |
| `summarize_tool_results` | `L5z` | Tool result summarization |
| `brief` | `R5z` | Brief mode instructions |

---

## Behavioral Differences Summary

| Aspect | Standard Mode | Proactive Mode |
|--------|--------------|----------------|
| **System Prompt** | Full with all sections | Potentially simplified |
| **Progress Bar** | Enabled (indeterminate/completed) | Disabled |
| **Prompt Suggestions** | Shown on first turn | Suppressed |
| **Status Bar** | Standard mode indicators | Shows scheduled tick indicator |
| **Trigger** | User types a message | Autonomous (scheduled ticks) |

---

## Trade-offs Analysis

### Token Efficiency vs Instruction Completeness

**Design choice:** Simplified prompt removes verbose examples and detailed instructions.

**Trade-offs:**
- **Pro**: Reduces latency and cost for frequent autonomous turns
- **Pro**: Retained sections focus on safety (careful actions) and correctness (tool routing)
- **Con**: Less guidance for complex tasks (no task management examples, no detailed tool policies)

### Graceful Degradation

**Design choice:** Every proactive controller reference uses optional chaining (`?.`) and null-coalescing (`??`).

**Trade-offs:**
- **Pro**: If controller is never initialized, all proactive-dependent behaviors silently default to standard mode
- **Pro**: Zero runtime impact when feature is disabled
- **Con**: No explicit error if controller initialization fails unexpectedly

### Single Controller, Multiple References

**Design choice:** The proactive controller is referenced as 4 different identifiers across chunks.

**Trade-offs:**
- **Pro**: Each chunk gets its own module-scoped variable for tree-shaking
- **Con**: Must maintain consistency across all references
- **Con**: Debugging requires checking all reference points

**Key insight:** The proactive controller exposes three key methods that all chunks rely on:
1. `isProactiveActive()` - boolean indicating current proactive state
2. `subscribeToProactiveChanges(callback)` - reactive state subscription
3. `getNextTickAt()` - timestamp of next scheduled action or null

---

## Cross-Feature Integration

### Integration with System Prompt Building

The proactive mode affects system prompt construction:
- Simplified prompt path when `CLAUDE_CODE_SIMPLE` is set
- Global cache boundary insertion controlled by `tengu_system_prompt_global_cache` feature flag

### Integration with UI Components

The proactive controller affects multiple UI behaviors:
- **Progress bar**: Disabled when proactive is active (`!isProactiveActive`)
- **Prompt suggestions**: Suppressed in proactive mode
- **Status bar**: Shows next tick indicator via `getNextTickAt`

### Integration with Tool Filtering

Tool availability changes in proactive mode:
- Tool filter function `getFilteredTools` (FX) is called with proactive state
- The `y6` (isProactive) dependency triggers re-filtering when state changes

---

## Deep Source Code Analysis

### Proactive Controller Module Pattern

**What it does:** The proactive controller is implemented as a module-level singleton that can be optionally initialized. This pattern allows the feature to be completely absent without affecting the rest of the codebase.

**Source Code Pattern (VERIFIED):**

```javascript
// ============================================
// Proactive Controller Module Pattern
// Location: Multiple chunks (Nb1, _fz, nVY, WeY)
// ============================================

// Each chunk declares its own module-level reference:
// chunks.196.mjs:1792 - REPL component
Nb1 = null;  // Used for REPL state subscription

// chunks.192.mjs:2137 - Prompt suggestion
_fz = null;  // Used to suppress prompt suggestions

// chunks.136.mjs:1377 - Agent loop context
nVY = null;  // Used for execution context determination

// chunks.160.mjs:3104 - Progress bar control
WeY = null;  // Used to disable progress bar

// Controller interface (expected methods):
interface ProactiveController {
    isProactiveActive(): boolean;
    subscribeToProactiveChanges(callback: () => void): () => void;
    getNextTickAt(): number | null;
}

// Usage pattern (null-safe):
let isActive = proactiveController?.isProactiveActive() ?? false;
```

**Why this approach:**
- Feature can be completely disabled by never initializing
- Each chunk gets its own binding for tree-shaking
- Optional chaining ensures no runtime errors if uninitialized
- Clean separation between proactive and standard execution

### REPL Proactive State Subscription (VERIFIED)

**Location:** chunks.196.mjs:36-43

```javascript
// ============================================
// REPL - Proactive state subscription
// Location: chunks.196.mjs:36-43
// ============================================

// ORIGINAL (for source lookup):
let [y6, G6] = N8.useState(Nb1?.isProactiveActive() ?? !1);
N8.useEffect(() => {
    if (!Nb1) return;
    return Nb1.subscribeToProactiveChanges(() => {
        G6(Nb1.isProactiveActive())
    })
}, []);
let R6 = N8.useMemo(() => FX(g), [g, y6]);

// READABLE (for understanding):
let [isProactive, setIsProactive] = React.useState(
    proactiveController?.isProactiveActive() ?? false
);

React.useEffect(() => {
    // No controller - nothing to subscribe to
    if (!proactiveController) return;

    // Subscribe to proactive state changes
    return proactiveController.subscribeToProactiveChanges(() => {
        setIsProactive(proactiveController.isProactiveActive());
    });
}, []);

// Re-filter tools whenever proactive state changes
let filteredTools = React.useMemo(
    () => getFilteredTools(permissionContext),
    [permissionContext, isProactive]
);

// Mapping: y6→isProactive, G6→setIsProactive, Nb1→proactiveController,
//   FX→getFilteredTools, g→permissionContext, R6→filteredTools
```

**Key insight:** The subscription pattern ensures the UI instantly reflects proactive state changes without polling. The `useMemo` dependency on `isProactive` ensures tool list is recomputed when proactive mode toggles.

### Progress Bar Control (VERIFIED)

**Location:** chunks.160.mjs:3104 (referenced), chunks.161.mjs:202-204

```javascript
// ============================================
// Progress bar control in message display
// Location: chunks.161.mjs:202-204
// ============================================

// ORIGINAL (for source lookup):
if (q[48] === Symbol.for("react.memo_cache_sentinel"))
    U6 = X1().terminalProgressBarEnabled && !(WeY?.isProactiveActive() ?? !1),
    q[48] = U6;
else U6 = q[48];
let c6 = U6,

// READABLE (for understanding):
if (cache[48] === CACHE_SENTINEL) {
    progressBarEnabled = getGlobalState().terminalProgressBarEnabled
        && !(proactiveController?.isProactiveActive() ?? false);
    cache[48] = progressBarEnabled;
} else {
    progressBarEnabled = cache[48];
}
let showProgressBar = progressBarEnabled;

// Mapping: WeY→proactiveController, X1→getGlobalState, U6→progressBarEnabled,
//   c6→showProgressBar, q→cache
```

**Why this approach:**
- In standard mode, progress bar gives users feedback during processing
- In proactive mode, agent acts autonomously - persistent progress bar would be misleading
- Uses React compiler's `useMemoCache` pattern for performance

### Prompt Suggestion Suppression (VERIFIED)

**Location:** chunks.192.mjs:2127-2132

```javascript
// ============================================
// Prompt suggestion logic with proactive check
// Location: chunks.192.mjs:2127-2132
// ============================================

// ORIGINAL (for source lookup):
return uxq.useMemo(() => {
    if (A !== "") return;
    if (K) return `Message @${K.length>xxq?K.slice(0,xxq-3)+"...":K}…`;
    if (Y.some(Ut) && (X1().queuedCommandUpHintCount || 0) < wfz) return "Press up to edit queued messages";
    if (q < 1 && z && !_fz?.isProactiveActive()) return rEq()
}, [A, Y, q, z, K])

// READABLE (for understanding):
return React.useMemo(() => {
    // User is typing - no suggestion
    if (inputText !== "") return;

    // Mention target exists - show mention hint
    if (mentionTarget) {
        return `Message @${truncate(mentionTarget, 20)}...`;
    }

    // Queued commands exist - show navigation hint
    if (queuedCommands.some(isQueuedCommand) &&
        (getGlobalState().queuedCommandUpHintCount || 0) < 3) {
        return "Press up to edit queued messages";
    }

    // First turn with suggestions enabled - show prompt suggestion
    // BUT: Skip if proactive mode is active
    if (turnCount < 1 &&
        promptSuggestionEnabled &&
        !proactiveController?.isProactiveActive()) {
        return getRandomPromptSuggestion();  // e.g., 'Try "fix lint errors"'
    }
}, [inputText, queuedCommands, turnCount, promptSuggestionEnabled, mentionTarget]);

// Mapping: A→inputText, q→turnCount, z→promptSuggestionEnabled, K→mentionTarget,
//   Y→queuedCommands, _fz→proactiveController, rEq→getRandomPromptSuggestion,
//   xxq→MAX_MENTION_LENGTH(20), wfz→MAX_HINT_COUNT(3)
```

**Key insight:** Prompt suggestions help new users discover capabilities. In proactive mode, the agent is expected to act autonomously - showing "Try 'fix lint errors'" would contradict autonomous behavior model.

---

## Integration with 04_system_reminder

### Proactive Mode Attachment Handling

When proactive mode is active, the attachment system behaves differently:

```
Standard Mode:
  User input → Assemble attachments → Inject into context → LLM processes

Proactive Mode:
  Scheduled tick → Limited attachments → Inject into context → LLM processes autonomously
```

**Key differences:**
1. **No user-dependent attachments**: `@mentioned` files are not processed
2. **Limited reminder types**: Only essential system state is included
3. **Reduced frequency**: Attachment throttling is more aggressive

---

## Telemetry Events

### Proactive Mode Events

```javascript
// Proactive state change
logEvent("tengu_proactive_state_changed", {
    isActive: boolean,
    nextTickAt: number | null
});

// Proactive tick executed
logEvent("tengu_proactive_tick_executed", {
    tickId: string,
    durationMs: number,
    hadToolUse: boolean
});

// Proactive mode disabled
logEvent("tengu_proactive_disabled", {
    reason: "user_input" | "error" | "timeout"
});
```