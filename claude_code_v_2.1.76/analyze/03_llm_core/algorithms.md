# LLM Core: Key Algorithms (Claude Code 2.1.76)

> Deep analysis of critical algorithms in the LLM core: token counting, context overflow recovery, thinking mode decision, and dynamic tool loading.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra

---

## Algorithm 1: Token Counting & Compaction Threshold

### Overview

The token counting algorithm determines when auto-compaction should be triggered based on the current message token count relative to the model's context limit.

### Algorithm Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    TOKEN COUNTING & COMPACTION FLOW                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  1. Get Model Context Limit                                              │
│     ├── Opus 4.6: 1,000,000 tokens                                       │
│     ├── Sonnet 4.6: 200,000 tokens                                       │
│     └── Haiku 4.5: 200,000 tokens                                        │
│                                                                          │
│  2. Get Threshold Percentage                                             │
│     ├── Default: 80% (0.80)                                              │
│     └── Haiku: 85% (0.85)                                                │
│                                                                          │
│  3. Estimate Current Token Count                                         │
│     └── Count messages, tool results, system prompt                      │
│                                                                          │
│  4. Compare: tokens > threshold × contextLimit?                          │
│     ├── YES → Trigger auto-compact                                       │
│     └── NO → Continue without compaction                                 │
│                                                                          │
│  5. 20% Buffer Purpose:                                                  │
│     ├── Room for next user message                                       │
│     ├── Space for injected system prompts                                │
│     └── Margin for token estimation inaccuracies                         │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Threshold Values by Model

| Model | Context Limit | Threshold % | Trigger Point |
|-------|---------------|-------------|---------------|
| Opus 4.6 | 1,000,000 | 80% | 800,000 tokens |
| Sonnet 4.6 | 200,000 | 80% | 160,000 tokens |
| Haiku 4.5 | 200,000 | 85% | 170,000 tokens |

### Key Decision: Why 20% Buffer?

The 20% buffer is critical because:

1. **Next user message**: Users can write long messages
2. **System prompt injection**: Additional context may be added dynamically
3. **Token estimation**: Tokenizers are approximations, not exact counts
4. **Response space**: Need room for the assistant's response

---

## Algorithm 2: Context Overflow Recovery

### Overview

When the API returns a `context_length_exceeded` error, the retry wrapper automatically calculates a reduced `max_tokens` value and retries the request.

### Source Code (VERIFIED)

```javascript
// ============================================
// parseContextOverflowError - Extracts token counts from error
// Location: chunks.89.mjs:110-129
// ============================================

// ORIGINAL (for source lookup):
function $54(A) {
    if (A.status !== 400 || !A.message) return;
    if (!A.message.includes("input length and `max_tokens` exceed context limit")) return;
    let q = /input length and `max_tokens` exceed context limit: (\d+) \+ (\d+) > (\d+)/,
        K = A.message.match(q);
    if (!K || K.length !== 4) return;
    if (!K[1] || !K[2] || !K[3]) {
        _6(Error("Unable to parse max_tokens from max_tokens exceed context limit error message"));
        return
    }
    let Y = parseInt(K[1], 10),
        z = parseInt(K[2], 10),
        _ = parseInt(K[3], 10);
    if (isNaN(Y) || isNaN(z) || isNaN(_)) return;
    return {
        inputTokens: Y,
        maxTokens: z,
        contextLimit: _
    }
}

// READABLE (for understanding):
function parseContextOverflowError(error) {
    // 1. Only handle 400 errors with specific message
    if (error.status !== 400 || !error.message) return undefined;
    if (!error.message.includes("input length and `max_tokens` exceed context limit")) {
        return undefined;
    }

    // 2. Parse error message: "input length and `max_tokens` exceed context limit: 50000 + 4096 > 200000"
    const pattern = /input length and `max_tokens` exceed context limit: (\d+) \+ (\d+) > (\d+)/;
    const match = error.message.match(pattern);

    if (!match || match.length !== 4) return undefined;

    let inputTokens = parseInt(match[1], 10);   // e.g., 50000
    let maxTokens = parseInt(match[2], 10);     // e.g., 4096
    let contextLimit = parseInt(match[3], 10);  // e.g., 200000

    if (isNaN(inputTokens) || isNaN(maxTokens) || isNaN(contextLimit)) {
        return undefined;
    }

    return { inputTokens, maxTokens, contextLimit };
}

// Mapping: $54→parseContextOverflowError, A→error, q→pattern, K→match,
//   Y→inputTokens, z→maxTokens, _→contextLimit, _6→logError
```

### Recovery Algorithm

```javascript
// ============================================
// Context Overflow Recovery - withApiRetry
// Location: chunks.89.mjs:62-80
// ============================================

// Algorithm steps:
// 1. Parse error to extract: inputTokens, contextLimit
// 2. Calculate available = contextLimit - inputTokens - BUFFER(1000)
// 3. If available < FLOOR_OUTPUT_TOKENS(3000): Cannot recover, throw error
// 4. Calculate thinkingBudget = thinkingEnabled ? budgetTokens + 1 : 0
// 5. Set maxTokensOverride = max(FLOOR, available, thinkingBudget)
// 6. Retry with reduced max_tokens

// READABLE algorithm:
function handleContextOverflow(error, retryContext) {
    let parsed = parseContextOverflowError(error);
    if (!parsed) return { recovered: false };

    let { inputTokens, contextLimit } = parsed;
    const BUFFER = 1000;
    let available = Math.max(0, contextLimit - inputTokens - BUFFER);

    const FLOOR_OUTPUT_TOKENS = 3000;
    if (available < FLOOR_OUTPUT_TOKENS) {
        throw error; // Cannot recover - no room for response
    }

    // Account for thinking budget
    let thinkingBudget = (retryContext.thinkingConfig?.type === "enabled")
        ? retryContext.thinkingConfig.budgetTokens + 1
        : 0;

    let adjustedMaxTokens = Math.max(FLOOR_OUTPUT_TOKENS, available, thinkingBudget);
    retryContext.maxTokensOverride = adjustedMaxTokens;

    return { recovered: true, maxTokensOverride: adjustedMaxTokens };
}
```

### Why 1000-Token Buffer?

The buffer provides margin for:
- Token estimation inaccuracies in counting messages
- Dynamic content that may be added between estimation and request
- Safety margin to avoid hitting the exact limit

---

## Algorithm 3: Thinking Mode Decision Tree

### Overview

Determines whether to use adaptive thinking, enabled thinking with budget, or no thinking based on model capabilities and configuration.

### Decision Tree

```
                    ┌─────────────────────────────────────┐
                    │   isThinkingEnabled()?              │
                    │   Check DISABLE_THINKING env var    │
                    │   Check thinkingConfig.type         │
                    └───────────────┬─────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │ Disabled                      │ Not Disabled
                    ▼                               ▼
            ┌───────────────────┐           ┌───────────────────────┐
            │ thinking:         │           │ supportsThinking()?   │
            │ undefined         │           │ (QG7)                 │
            └───────────────────┘           └───────────┬───────────┘
                                                        │
                                        ┌───────────────┴───────────────┐
                                        │ Not Supported                │ Supported
                                        ▼                               ▼
                                ┌───────────────────┐           ┌───────────────────────┐
                                │ thinking:         │           │ DISABLE_ADAPTIVE_     │
                                │ undefined         │           │ THINKING?             │
                                └───────────────────┘           └───────────┬───────────┘
                                                                        │
                                                ┌───────────────────────┴───────────────┐
                                                │ Disabled                             │ Not Disabled
                                                ▼                                       ▼
                                        ┌───────────────────────┐           ┌───────────────────────┐
                                        │ Use enabled thinking  │           │ supportsAdaptive()?   │
                                        │ with budget_tokens    │           │ (I21)                 │
                                        └───────────────────────┘           └───────────┬───────────┘
                                                                                        │
                                                                ┌───────────────────────┴───────────────┐
                                                                │ NOT Supported                        │ Supported
                                                                ▼                                       ▼
                                                        ┌───────────────────────┐           ┌───────────────────────┐
                                                        │ Use enabled thinking  │           │ thinking:             │
                                                        │ with budget_tokens    │           │ { type: "adaptive" }  │
                                                        └───────────────────────┘           └───────────────────────┘
```

### Source Code (VERIFIED)

```javascript
// ============================================
// Thinking Mode Decision - In streamingQueryCore
// Location: chunks.171.mjs:130-143
// ============================================

// ORIGINAL (for source lookup):
C6 = K.type !== "disabled" && !t6(process.env.CLAUDE_CODE_DISABLE_THINKING),
    o6 = void 0;
if (C6 && QG7(_.model))
    if (!t6(process.env.CLAUDE_CODE_DISABLE_ADAPTIVE_THINKING) && I21(_.model)) o6 = {
        type: "adaptive"
    };
    else {
        let j6 = FGq(_.model);
        if (K.type === "enabled" && K.budgetTokens !== void 0) j6 = K.budgetTokens;
        j6 = Math.min(u6 - 1, j6), o6 = {
            budget_tokens: j6,
            type: "enabled"
        }
    }

// READABLE (for understanding):
let isThinkingEnabled = thinkingConfig.type !== "disabled" &&
    !parseBoolean(process.env.CLAUDE_CODE_DISABLE_THINKING);
let thinkingParams = undefined;

if (isThinkingEnabled && supportsThinking(model)) {
    // Try adaptive thinking first (Claude 4.6+)
    if (!parseBoolean(process.env.CLAUDE_CODE_DISABLE_ADAPTIVE_THINKING) &&
        supportsAdaptiveThinking(model)) {
        thinkingParams = { type: "adaptive" };
    } else {
        // Fall back to enabled thinking with budget
        let budget = getDefaultThinkingBudget(model);

        // Allow override from thinkingConfig
        if (thinkingConfig.type === "enabled" && thinkingConfig.budgetTokens !== undefined) {
            budget = thinkingConfig.budgetTokens;
        }

        // Ensure budget < max_tokens
        budget = Math.min(maxTokens - 1, budget);

        thinkingParams = {
            budget_tokens: budget,
            type: "enabled"
        };
    }
}

// Mapping: C6→isThinkingEnabled, o6→thinkingParams, K→thinkingConfig,
//   u6→maxTokens, t6→parseBoolean, QG7→supportsThinking, I21→supportsAdaptiveThinking,
//   FGq→getDefaultThinkingBudget
```

### Budget Token Calculation

```javascript
// ============================================
// getThinkingBudgetLimits - Returns model-specific budget limits
// Location: chunks.176.mjs:1533-1547
// ============================================

// ORIGINAL (for source lookup):
function oa(A) {
    let q, K, Y = IY(A);
    if (Y.includes("opus-4-5") || Y.includes("opus-4-6") || Y.includes("sonnet-4") || Y.includes("haiku-4")) q = 32000, K = 64000;
    else if (Y.includes("opus-4-1") || Y.includes("opus-4")) q = 32000, K = 32000;
    else if (Y.includes("claude-3-opus")) q = 4096, K = 4096;
    else if (Y.includes("claude-3-sonnet")) q = 8192, K = 8192;
    else if (Y.includes("claude-3-haiku")) q = 4096, K = 4096;
    else if (Y.includes("3-5-sonnet") || Y.includes("3-5-haiku")) q = 8192, K = 8192;
    else if (Y.includes("3-7-sonnet")) q = 32000, K = 64000;
    else q = q2z, K = K2z;
    return {
        default: q,
        upperLimit: K
    }
}

// READABLE (for understanding):
function getThinkingBudgetLimits(model) {
    let normalizedModel = normalizeModelName(model);
    let defaultBudget, upperLimit;

    // Claude 4.x series (32K default, 64K max)
    if (normalizedModel.includes("opus-4-5") ||
        normalizedModel.includes("opus-4-6") ||
        normalizedModel.includes("sonnet-4") ||
        normalizedModel.includes("haiku-4")) {
        defaultBudget = 32000;
        upperLimit = 64000;
    }
    // Opus 4.1/4 (fixed 32K)
    else if (normalizedModel.includes("opus-4-1") || normalizedModel.includes("opus-4")) {
        defaultBudget = 32000;
        upperLimit = 32000;
    }
    // Claude 3.x series (4K-8K fixed)
    else if (normalizedModel.includes("claude-3-opus")) {
        defaultBudget = 4096;
        upperLimit = 4096;
    }
    else if (normalizedModel.includes("claude-3-sonnet")) {
        defaultBudget = 8192;
        upperLimit = 8192;
    }
    else if (normalizedModel.includes("claude-3-haiku")) {
        defaultBudget = 4096;
        upperLimit = 4096;
    }
    else if (normalizedModel.includes("3-5-sonnet") || normalizedModel.includes("3-5-haiku")) {
        defaultBudget = 8192;
        upperLimit = 8192;
    }
    else if (normalizedModel.includes("3-7-sonnet")) {
        defaultBudget = 32000;
        upperLimit = 64000;
    }
    // Default fallback
    else {
        defaultBudget = 32000;
        upperLimit = 64000;
    }

    return { default: defaultBudget, upperLimit };
}

// Mapping: oa→getThinkingBudgetLimits, A→model, IY→normalizeModelName,
//   q→defaultBudget, K→upperLimit
```

---

## Algorithm 4: Dynamic Tool Loading

### Overview

Determines whether to use deferred tool loading to reduce token count in the initial request, letting the model request additional tools as needed.

### Decision Criteria

```javascript
// ============================================
// shouldUseDynamicLoading - Decision for deferred tool loading
// Location: chunks.171.mjs:17 (approximate, inferred from usage)
// ============================================

function shouldUseDynamicLoading(model, tools, getToolPermissionContext, agents, queryType) {
    // 1. Check if model supports deferred tools
    if (!modelSupportsDeferredTools(model)) return false;

    // 2. Check feature flag
    if (!getFeatureFlag("tengu_deferred_tools")) return false;

    // 3. Check if there are enough tools to benefit
    let deferredToolCount = tools.filter(isDeferredTool).length;
    if (deferredToolCount < 10) return false;  // Not worth the overhead

    // 4. Check permission context - plan mode needs all tools
    let permContext = await getToolPermissionContext();
    if (permContext.mode === "plan") return false;

    return true;
}
```

### Tool Filtering Logic

```javascript
// In streamingQueryCore (mGq) - chunks.171.mjs:20-27
// ORIGINAL (for source lookup):
if (j) {
    let T6 = zF(A);  // zF = extractReferencedTools
    J = Y.filter((D6) => {
        if (!GX(D6)) return !0;  // GX = isDeferredTool
        if (z3(D6, HZ)) return !0;  // Always include certain tools
        return T6.has(D6.name)  // Include if referenced in messages
    })
} else J = Y.filter((T6) => !z3(T6, HZ));

// READABLE (for understanding):
if (useDynamicLoading) {
    let referencedToolNames = extractReferencedTools(messages);
    filteredTools = tools.filter((tool) => {
        // Always include non-deferred tools
        if (!isDeferredTool(tool)) return true;
        // Always include certain essential tools
        if (isEssentialTool(tool)) return true;
        // Include deferred tools only if referenced
        return referencedToolNames.has(tool.name);
    });
} else {
    // Non-dynamic: exclude only hidden tools
    filteredTools = tools.filter((tool) => !isHiddenTool(tool));
}
```

### Deferred Tools Hint Injection

```javascript
// In streamingQueryCore (mGq) - chunks.171.mjs:72-81
// ORIGINAL (for source lookup):
if (j && !ki6()) {
    let T6 = Y.filter(GX).map(fp6).sort().join(`
`);
    if (T6) N = [p1({
        content: `<available-deferred-tools>
${T6}
</available-deferred-tools>`,
        isMeta: !0
    }), ...N]
}

// READABLE (for understanding):
if (useDynamicLoading && !isInternalBuild()) {
    let deferredToolsHint = tools
        .filter(isDeferredTool)
        .map(formatDeferredToolHint)
        .sort()
        .join("\n");

    if (deferredToolsHint) {
        // Prepend meta message listing available deferred tools
        messages = [
            createMetaMessage(`<available-deferred-tools>
${deferredToolsHint}
</available-deferred-tools>`),
            ...messages
        ];
    }
}
```

### Why Dynamic Loading?

**Benefits:**
1. Reduces initial request token count
2. Enables larger MCP tool sets without hitting limits
3. Allows model to request tools on-demand

**Trade-offs:**
1. Extra latency if model requests deferred tool
2. More complex request flow
3. Not suitable for plan mode (needs all tools upfront)

---

## Algorithm 5: Retry with Exponential Backoff

### Overview

When API calls fail due to rate limiting or transient errors, the retry wrapper uses exponential backoff with jitter.

### Source Code (VERIFIED)

```javascript
// ============================================
// calculateBackoff - Exponential backoff with jitter
// Location: chunks.89.mjs:100-108
// ============================================

// ORIGINAL (for source lookup):
function VI(A, q) {
    if (q) {
        let z = parseInt(q, 10);
        if (!isNaN(z)) return z * 1000
    }
    let K = Math.min(Sb9 * Math.pow(2, A - 1), 32000),
        Y = Math.random() * 0.25 * K;
    return K + Y
}

// READABLE (for understanding):
function calculateBackoff(attempt, retryAfterHeader) {
    // If server provided retry-after header, use it
    if (retryAfterHeader) {
        let seconds = parseInt(retryAfterHeader, 10);
        if (!isNaN(seconds)) {
            return seconds * 1000;
        }
    }

    // Exponential backoff: 500ms * 2^(attempt-1), capped at 32s
    let baseDelay = Math.min(500 * Math.pow(2, attempt - 1), 32000);

    // Add jitter (0-25% of base delay)
    let jitter = Math.random() * 0.25 * baseDelay;

    return baseDelay + jitter;
}

// Mapping: VI→calculateBackoff, A→attempt, q→retryAfterHeader,
//   Sb9→BASE_DELAY_MS(500), K→baseDelay, Y→jitter
```

### Backoff Schedule

| Attempt | Base Delay | With Jitter Range |
|---------|------------|-------------------|
| 1 | 500ms | 500-625ms |
| 2 | 1000ms | 1000-1250ms |
| 3 | 2000ms | 2000-2500ms |
| 4 | 4000ms | 4000-5000ms |
| 5 | 8000ms | 8000-10000ms |
| 6 | 16000ms | 16000-20000ms |
| 7+ | 32000ms (capped) | 32000-40000ms |

### Why Jitter?

Jitter prevents "thundering herd" scenarios where multiple clients retry simultaneously after a rate limit reset.

---

## Algorithm 6: Fast Mode Cooldown

### Overview

When fast mode encounters rate limits or errors, it enters a cooldown period to prevent cascading failures.

### Constants

```javascript
const FAST_MODE_COOLDOWN_DURATION = 600000;  // 10 minutes (Fb9)
const FAST_MODE_MIN_RETRY_DELAY = 20000;     // 20 seconds (gb9)
const FAST_MODE_FALLBACK_DELAY = 1800000;    // 30 minutes (Bb9)
```

### Cooldown Trigger Conditions

```javascript
// In withApiRetry - chunks.89.mjs:29-45
if (isFastMode && error instanceof APIError && (error.status === 429 || isOverloaded(error))) {
    // Check for rate limit header
    let overageReason = error.headers?.get("anthropic-ratelimit-unified-overage-disabled-reason");
    if (overageReason !== null) {
        setFastModeCooldown(overageReason);
        retryContext.fastMode = false;
        continue;
    }

    // Check for retry delay
    let retryDelay = parseRetryAfterHeader(error);
    if (retryDelay !== null && retryDelay < FAST_MODE_MIN_RETRY_DELAY) {
        await sleep(retryDelay);
        continue;
    }

    // Calculate cooldown delay
    let cooldownDelay = Math.max(retryDelay ?? FAST_MODE_FALLBACK_DELAY, FAST_MODE_COOLDOWN_DURATION);
    let reason = isOverloaded(error) ? "overloaded" : "rate_limit";

    // Enter cooldown
    setFastModeCooldown(Date.now() + cooldownDelay, reason);
    retryContext.fastMode = false;
    continue;
}
```

---

## Algorithm 7: Attachment Assembly Pipeline

### Overview

The attachment assembly algorithm determines which system reminders to inject into each LLM turn. It categorizes attachments into three groups with different computation strategies.

### Source Code (VERIFIED)

```javascript
// ============================================
// assembleAllAttachments - Main orchestrator
// Location: chunks.147.mjs:3-18
// ============================================

// ORIGINAL (for source lookup):
async function _uY(A, q, K, Y, z, _) {
    if (t6(process.env.CLAUDE_CODE_DISABLE_ATTACHMENTS) || t6(process.env.CLAUDE_CODE_SIMPLE)) return [];
    let w = sK(),
        O = setTimeout((W) => W.abort(), 1000, w),
        $ = {
            ...q,
            abortController: w
        },
        H = !q.agentId,
        j = A ? [Hz("at_mentioned_files", () => RuY(A, $)), Hz("mcp_resources", () => SuY(A, $)), Hz("agent_mentions", () => Promise.resolve(huY(A, q.options.agentDefinitions.activeAgents))), ...[]] : [],
        J = await Promise.all(j),
        M = [Hz("date_change", () => Promise.resolve(fuY())), Hz("ultrathink_effort", () => Promise.resolve(TuY(A))), Hz("deferred_tools_delta", () => Promise.resolve(xE1(q.options.tools, q.options.mainLoopModel, z))), Hz("mcp_instructions_delta", () => Promise.resolve(uE1(q.options.mcpClients, q.options.tools, q.options.mainLoopModel, z))), Hz("changed_files", () => CuY($)), Hz("nested_memory", () => IuY($)), Hz("dynamic_skill", () => BuY($)), Hz("skill_listing", () => guY($)), Hz("ultra_claude_md", async () => VuY(z)), Hz("plan_mode", () => DuY(z, q)), Hz("plan_mode_exit", () => XuY(q)), Hz("auto_mode", () => ZuY(z, q)), Hz("auto_mode_exit", () => GuY(q)), Hz("todo_reminders", () => r$() ? auY(z, q) : ruY(z, q)), ...E7() ? [..._ === "session_memory" ? [] : [Hz("teammate_mailbox", async () => euY(q))], Hz("team_context", async () => AmY(z ?? []))] : [], Hz("agent_pending_messages", async () => $uY(q)), Hz("critical_system_reminder", () => Promise.resolve(vuY(q)))],
        D = H ? [Hz("ide_selection", async () => kuY(K, q)), Hz("ide_opened_file", async () => LuY(K, q)), Hz("output_style", async () => Promise.resolve(NuY())), Hz("diagnostics", async () => cuY(q)), Hz("lsp_diagnostics", async () => luY(q)), Hz("unified_tasks", async () => suY(q)), Hz("async_hook_responses", async () => tuY()), Hz("token_usage", async () => Promise.resolve(qmY(z ?? [], q.options.mainLoopModel))), Hz("budget_usd", async () => Promise.resolve(YmY(q.options.maxBudgetUsd))), Hz("output_token_usage", async () => Promise.resolve(KmY())), Hz("verify_plan_reminder", async () => _mY(z, q)), Hz("queued_commands", () => OuY(Y))] : [],
        [X, P] = await Promise.all([Promise.all(M), Promise.all(D)]);
    return clearTimeout(O), [...J.flat(), ...X.flat(), ...P.flat()].filter((W) => W !== void 0 && W !== null)
}

// READABLE (for understanding):
async function assembleAllAttachments(userMessage, toolUseContext, ideContext, queuedCommands, autoCompactTracking, sessionMemoryType) {
    // Early exit if attachments disabled
    if (parseBoolean(process.env.CLAUDE_CODE_DISABLE_ATTACHMENTS) ||
        parseBoolean(process.env.CLAUDE_CODE_SIMPLE)) {
        return [];
    }

    let abortController = createAbortController();
    let timeoutId = setTimeout((ctrl) => ctrl.abort(), 1000, abortController);

    let context = {
        ...toolUseContext,
        abortController
    };

    let isMainAgent = !toolUseContext.agentId;

    // GROUP 1: User-dependent producers (only if user message exists)
    let userDependentAttachments = userMessage ? [
        timedAttachmentProducer("at_mentioned_files", () => getAtMentionedFilesAttachment(userMessage, context)),
        timedAttachmentProducer("mcp_resources", () => getMcpResourcesAttachment(userMessage, context)),
        timedAttachmentProducer("agent_mentions", () => Promise.resolve(getAgentMentionsAttachment(userMessage, toolUseContext.options.agentDefinitions.activeAgents)))
    ] : [];

    let group1Results = await Promise.all(userDependentAttachments);

    // GROUP 2: Always-computed producers (parallel execution)
    let alwaysComputedAttachments = [
        timedAttachmentProducer("date_change", () => Promise.resolve(getDateChangeAttachment())),
        timedAttachmentProducer("ultrathink_effort", () => Promise.resolve(getUltrathinkEffortAttachment(userMessage))),
        timedAttachmentProducer("deferred_tools_delta", () => Promise.resolve(getDeferredToolsDeltaAttachment(toolUseContext.options.tools, toolUseContext.options.mainLoopModel, autoCompactTracking))),
        timedAttachmentProducer("mcp_instructions_delta", () => Promise.resolve(getMcpInstructionsDeltaAttachment(toolUseContext.options.mcpClients, toolUseContext.options.tools, toolUseContext.options.mainLoopModel, autoCompactTracking))),
        timedAttachmentProducer("changed_files", () => getChangedFilesAttachment(context)),
        timedAttachmentProducer("nested_memory", () => getNestedMemoryAttachments(context)),
        timedAttachmentProducer("dynamic_skill", () => getDynamicSkillAttachments(context)),
        timedAttachmentProducer("skill_listing", () => getSkillListingAttachment(context)),
        timedAttachmentProducer("ultra_claude_md", async () => getUltraClaudeMdAttachment(autoCompactTracking)),
        timedAttachmentProducer("plan_mode", () => getPlanModeAttachment(autoCompactTracking, toolUseContext)),
        timedAttachmentProducer("plan_mode_exit", () => getPlanModeExitAttachment(toolUseContext)),
        timedAttachmentProducer("auto_mode", () => getAutoModeAttachment(autoCompactTracking, toolUseContext)),
        timedAttachmentProducer("auto_mode_exit", () => getAutoModeExitAttachment(toolUseContext)),
        timedAttachmentProducer("todo_reminders", () => isStructuredTasksEnabled() ? getTaskReminderAttachment(autoCompactTracking, toolUseContext) : getTodoReminderAttachment(autoCompactTracking, toolUseContext))
    ];

    // Add team-mode specific attachments if in team mode
    if (isTeamMode()) {
        alwaysComputedAttachments.push(
            ...(sessionMemoryType === "session_memory" ? [] : [timedAttachmentProducer("teammate_mailbox", async () => getTeammateMailboxAttachment(toolUseContext))]),
            timedAttachmentProducer("team_context", async () => getTeamContextAttachment(autoCompactTracking ?? []))
        );
    }

    alwaysComputedAttachments.push(
        timedAttachmentProducer("agent_pending_messages", async () => getAgentPendingMessagesAttachment(toolUseContext)),
        timedAttachmentProducer("critical_system_reminder", () => Promise.resolve(getCriticalSystemReminder(toolUseContext)))
    );

    // GROUP 3: Main-agent-only producers
    let mainAgentOnlyAttachments = isMainAgent ? [
        timedAttachmentProducer("ide_selection", async () => getIdeSelectionAttachment(ideContext, toolUseContext)),
        timedAttachmentProducer("ide_opened_file", async () => getIdeOpenedFileAttachment(ideContext, toolUseContext)),
        timedAttachmentProducer("output_style", async () => Promise.resolve(getOutputStyleAttachment())),
        timedAttachmentProducer("diagnostics", async () => getDiagnosticsAttachment(toolUseContext)),
        timedAttachmentProducer("lsp_diagnostics", async () => getLspDiagnosticsAttachment(toolUseContext)),
        timedAttachmentProducer("unified_tasks", async () => getUnifiedTasksAttachment(toolUseContext)),
        timedAttachmentProducer("async_hook_responses", async () => getAsyncHookResponsesAttachment()),
        timedAttachmentProducer("token_usage", async () => Promise.resolve(getTokenUsageAttachment(autoCompactTracking ?? [], toolUseContext.options.mainLoopModel))),
        timedAttachmentProducer("budget_usd", async () => Promise.resolve(getBudgetUsdAttachment(toolUseContext.options.maxBudgetUsd))),
        timedAttachmentProducer("output_token_usage", async () => Promise.resolve(getOutputTokenUsageAttachment())),
        timedAttachmentProducer("verify_plan_reminder", async () => getVerifyPlanReminderAttachment(autoCompactTracking, toolUseContext)),
        timedAttachmentProducer("queued_commands", () => getQueuedCommandsAttachment(queuedCommands))
    ] : [];

    // Execute all attachment producers in parallel
    let [group2Results, group3Results] = await Promise.all([
        Promise.all(alwaysComputedAttachments),
        Promise.all(mainAgentOnlyAttachments)
    ]);

    clearTimeout(timeoutId);

    // Flatten and filter null/undefined attachments
    return [
        ...group1Results.flat(),
        ...group2Results.flat(),
        ...group3Results.flat()
    ].filter((attachment) => attachment !== undefined && attachment !== null);
}

// Mapping: _uY→assembleAllAttachments, A→userMessage, q→toolUseContext, K→ideContext,
//   Y→queuedCommands, z→autoCompactTracking, _→sessionMemoryType, t6→parseBoolean,
//   sK→createAbortController, Hz→timedAttachmentProducer, RuY→getAtMentionedFilesAttachment,
//   SuY→getMcpResourcesAttachment, huY→getAgentMentionsAttachment, fuY→getDateChangeAttachment,
//   TuY→getUltrathinkEffortAttachment, xE1→getDeferredToolsDeltaAttachment,
//   uE1→getMcpInstructionsDeltaAttachment, CuY→getChangedFilesAttachment,
//   IuY→getNestedMemoryAttachments, BuY→getDynamicSkillAttachments, guY→getSkillListingAttachment,
//   VuY→getUltraClaudeMdAttachment, DuY→getPlanModeAttachment, XuY→getPlanModeExitAttachment,
//   ZuY→getAutoModeAttachment, GuY→getAutoModeExitAttachment, ruY→getTodoReminderAttachment,
//   auY→getTaskReminderAttachment, E7→isTeamMode, euY→getTeammateMailboxAttachment,
//   AmY→getTeamContextAttachment, $uY→getAgentPendingMessagesAttachment, vuY→getCriticalSystemReminder,
//   kuY→getIdeSelectionAttachment, LuY→getIdeOpenedFileAttachment, NuY→getOutputStyleAttachment,
//   cuY→getDiagnosticsAttachment, luY→getLspDiagnosticsAttachment, suY→getUnifiedTasksAttachment,
//   tuY→getAsyncHookResponsesAttachment, qmY→getTokenUsageAttachment, YmY→getBudgetUsdAttachment,
//   KmY→getOutputTokenUsageAttachment, _mY→getVerifyPlanReminderAttachment, OuY→getQueuedCommandsAttachment
```

### Attachment Categorization

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    ATTACHMENT ASSEMBLY PIPELINE                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  GROUP 1: User-Dependent (conditional)                                  │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │ • at_mentioned_files - Only if user message contains @mentions    │  │
│  │ • mcp_resources - Only if user message present                    │  │
│  │ • agent_mentions - Only if user message mentions agents           │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  GROUP 2: Always-Computed (every turn)                                  │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │ • date_change • ultrathink_effort • deferred_tools_delta          │  │
│  │ • mcp_instructions_delta • changed_files • nested_memory          │  │
│  │ • dynamic_skill • skill_listing • ultra_claude_md                 │  │
│  │ • plan_mode • plan_mode_exit • auto_mode • auto_mode_exit         │  │
│  │ • todo_reminders • teammate_mailbox (team mode)                    │  │
│  │ • team_context (team mode) • agent_pending_messages               │  │
│  │ • critical_system_reminder                                         │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  GROUP 3: Main-Agent-Only (not in subagents)                            │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │ • ide_selection • ide_opened_file • output_style                   │  │
│  │ • diagnostics • lsp_diagnostics • unified_tasks                    │  │
│  │ • async_hook_responses • token_usage • budget_usd                  │  │
│  │ • output_token_usage • verify_plan_reminder • queued_commands      │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  EXECUTION: All groups run in parallel, results flattened and filtered   │
│  TIMEOUT: 1000ms - abort if producers take too long                      │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Why This Architecture

**Parallel Execution:**
- All attachment producers run concurrently via `Promise.all`
- Reduces latency from potentially 20+ serial calls to single parallel batch
- 1-second timeout prevents hanging on slow producers

**Conditional Groups:**
- Group 1 depends on user message content
- Group 2 always runs for consistent context
- Group 3 only for main agent (subagents don't need IDE state)

**Error Isolation:**
- Each producer wrapped in `timedAttachmentProducer` with try-catch
- Single producer failure doesn't crash entire pipeline
- Telemetry logs failures at 5% sampling rate

---

## Algorithm 8: Model Overload Detection & Fallback

### Overview

When Opus 4.6 returns a 529 error (overloaded), the system can automatically fall back to Sonnet 4.6 to maintain service availability.

### Source Code (VERIFIED)

```javascript
// ============================================
// isOverloadedError - Detects model overload condition
// Location: chunks.89.mjs:136-139
// ============================================

// ORIGINAL (for source lookup):
function iF6(A) {
    if (!(A instanceof a7)) return !1;
    return A.status === 529 || (A.message?.includes('"type":"overloaded_error"') ?? !1)
}

// READABLE (for understanding):
function isOverloadedError(error) {
    if (!(error instanceof APIError)) return false;
    // Either 529 status or overloaded_error type in message
    return error.status === 529 ||
           (error.message?.includes('"type":"overloaded_error"') ?? false);
}

// Mapping: iF6→isOverloadedError, A→error, a7→APIError
```

### Fallback Decision Logic

```javascript
// ============================================
// Model fallback decision in withApiRetry
// Location: chunks.89.mjs:50-57
// ============================================

// ORIGINAL (for source lookup):
if (iF6(j) && (process.env.FALLBACK_FOR_ALL_PRIMARY_MODELS || !iA() && V36(K.model))) {
    if (w++, w >= hb9) {
        if (K.fallbackModel) throw d("tengu_api_opus_fallback_triggered", {
            original_model: K.model,
            fallback_model: K.fallbackModel,
            provider: k76()
        }), new R36(K.model, K.fallbackModel);
        if (!process.env.IS_SANDBOX) throw d("tengu_api_custom_529_overloaded_error", {}), new RB(Error(Vv8), z)
    }
}

// READABLE (for understanding):
if (isOverloadedError(error) &&
    (process.env.FALLBACK_FOR_ALL_PRIMARY_MODELS ||
     (!isInternalBuild() && isOpusModel(retryContext.model)))) {

    consecutive529Errors++;

    // Circuit breaker: max 3 consecutive overload errors
    if (consecutive529Errors >= MAX_CONSECUTIVE_529_ERRORS) {
        if (retryContext.fallbackModel) {
            // Trigger fallback to alternative model
            logEvent("tengu_api_opus_fallback_triggered", {
                original_model: retryContext.model,
                fallback_model: retryContext.fallbackModel,
                provider: getProvider()
            });
            throw new ModelFallbackError(retryContext.model, retryContext.fallbackModel);
        }

        // No fallback configured - throw custom error
        if (!process.env.IS_SANDBOX) {
            logEvent("tengu_api_custom_529_overloaded_error", {});
            throw new RetryError(Error(MODEL_OVERLOADED_MESSAGE), retryContext);
        }
    }
}

// Mapping: iF6→isOverloadedError, j→error, w→consecutive529Errors, hb9→MAX_CONSECUTIVE_529_ERRORS,
//   K→retryContext, V36→isOpusModel, iA→isInternalBuild, d→logEvent, R36→ModelFallbackError,
//   RB→RetryError, k76→getProvider
```

### Fallback Flow

```
Opus 4.6 API Call
    │
    ├── Success → Continue normally
    │
    └── Error 529 (Overloaded)
        │
        ├── Check: consecutive529Errors >= 3?
        │   ├── YES → Circuit breaker tripped
        │   │   ├── Has fallback model?
        │   │   │   ├── YES → Throw ModelFallbackError
        │   │   │   │           → Retry with Sonnet 4.6
        │   │   │   └── NO → Throw RetryError
        │   │   │               → User sees "overloaded" message
        │   │   └── IS_SANDBOX? → Silent retry
        │   │
        │   └── NO → Increment counter, retry same model
        │
        └── After 3 consecutive 529s:
            → Automatic fallback to Sonnet 4.6
            → Telemetry event logged
            → User experience preserved
```

### Why This Design

**Circuit Breaker Pattern:**
- Requires 3 consecutive 529 errors before fallback
- Prevents premature fallback on transient issues
- Balances availability with model preference

**Fallback Model Selection:**
- Configured per-session via `fallbackModel` parameter
- Typically Sonnet 4.6 as cheaper, higher-capacity alternative
- Maintains conversation continuity

**Internal vs External:**
- `isInternalBuild()` check prevents fallback in testing
- `FALLBACK_FOR_ALL_PRIMARY_MODELS` env var overrides for all models

---

## Algorithm 9: Streaming Tool Executor

### Overview

During streaming, tool calls can be executed in parallel as they arrive, rather than waiting for the complete message. This algorithm manages concurrent tool execution with safety constraints.

### Concurrency Safety Model

**Concurrency-Safe Tools:**
Tools that can run in parallel with each other:
- Read operations (file reads, grep, glob)
- Non-mutating bash commands (ls, cat, git status)

**Non-Concurrent Tools:**
Tools that must run sequentially:
- Write operations
- Edit operations
- Bash commands with side effects

### Execution Logic

```javascript
// ============================================
// StreamingToolExecutor - Parallel tool execution during streaming
// Location: chunks.148.mjs:3-228
// ============================================

class StreamingToolExecutor {
    constructor(toolDefinitions, canUseTool, toolUseContext) {
        this.toolDefinitions = toolDefinitions;
        this.canUseTool = canUseTool;
        this.toolUseContext = toolUseContext;
        this.tools = [];
    }

    addTool(toolUse, assistantMessage) {
        // Find tool definition
        let tool = this.toolDefinitions.find(t => t.name === toolUse.name);
        if (!tool) {
            // Unknown tool - create error result immediately
            this.tools.push({
                id: toolUse.id,
                status: "completed",
                results: [createToolNotFoundError(toolUse.name)]
            });
            return;
        }

        // Parse and validate input
        let parsedInput = tool.inputSchema.safeParse(toolUse.input);

        // Determine if tool is concurrency-safe
        let isConcurrencySafe = tool.isConcurrencySafe?.(parsedInput.data) ?? false;

        this.tools.push({
            id: toolUse.id,
            block: toolUse,
            status: "queued",
            isConcurrencySafe,
            parsedInput: parsedInput.data
        });

        // Start processing queue
        this.processQueue();
    }

    canExecuteTool(isConcurrencySafe) {
        let executing = this.tools.filter(t => t.status === "executing");

        // Can execute if:
        // 1. No tools currently executing, OR
        // 2. Tool is concurrency-safe AND all executing tools are also concurrency-safe
        return executing.length === 0 ||
               (isConcurrencySafe && executing.every(t => t.isConcurrencySafe));
    }

    async processQueue() {
        for (let tool of this.tools) {
            if (tool.status !== "queued") continue;

            if (this.canExecuteTool(tool.isConcurrencySafe)) {
                await this.executeTool(tool);
            } else if (!tool.isConcurrencySafe) {
                // Non-concurrent tool must wait - stop processing
                break;
            }
        }
    }

    *getCompletedResults() {
        for (let tool of this.tools) {
            if (tool.status === "completed" && tool.results) {
                tool.status = "yielded";
                for (let result of tool.results) {
                    yield { message: result, newContext: this.toolUseContext };
                }
            }
        }
    }
}
```

### Execution State Machine

```
Tool Queued
    │
    ├── canExecuteTool()?
    │   ├── YES (no tools executing)
    │   │   └── Start execution → status: "executing"
    │   │
    │   ├── YES (concurrency-safe, all executing are safe)
    │   │   └── Start parallel execution → status: "executing"
    │   │
    │   └── NO (non-concurrent tool blocked)
    │       └── Wait in queue → status: "queued"
    │
    └── Execution Complete
        └── Store results → status: "completed"

getCompletedResults() called
    └── Yield results → status: "yielded"
```

### Why This Design

**Parallel Execution:**
- Safe tools run concurrently, reducing total latency
- Example: 3 file reads execute in parallel instead of serially
- Improves perceived responsiveness during streaming

**Safety Constraints:**
- Non-concurrent tools block subsequent non-concurrent tools
- Prevents race conditions between writes/edits
- Each tool declares its safety via `isConcurrencySafe()`

**Streaming Integration:**
- Results yielded as soon as available
- Agent loop can inject tool results mid-stream
- Enables "streaming" feel for tool-heavy responses

---

## Summary

These algorithms form the core of Claude Code's resilience and optimization:

| Algorithm | Purpose | Key Insight |
|-----------|---------|-------------|
| Token Counting | Prevent context overflow | 20% buffer for safety |
| Context Overflow Recovery | Automatic max_tokens adjustment | 1000-token buffer for margin |
| Thinking Mode Decision | Enable optimal reasoning | Adaptive preferred for 4.6+ |
| Dynamic Tool Loading | Reduce token usage | On-demand tool loading |
| Exponential Backoff | Handle rate limits | Jitter prevents herd behavior |
| Fast Mode Cooldown | Prevent cascading failures | 10-minute cooldown period |
| Attachment Assembly | Context injection | Parallel execution with timeout |
| Model Overload Fallback | Service availability | Circuit breaker with fallback |
| Streaming Tool Executor | Parallel tool execution | Concurrency-safe parallelism |

All constants and thresholds are tuned based on production telemetry to balance user experience with API reliability.